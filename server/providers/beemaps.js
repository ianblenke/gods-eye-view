import path from 'node:path';
import { isLoopbackCommand } from './common/loopback-command.js';
import { makeRateLimiter } from './common/rate-limit.js';
import { sameSiteGated } from './common/same-site.js';
import { createBudget } from './beemaps/budget.js';
import { normalizeDocument } from './beemaps/normalize.js';
import { callUpstream } from './beemaps/upstream.js';
import { readBodyText, validateRequest } from './beemaps/validate.js';

/**
 * Bee Maps frames provider: a read-only route for the newest street-level
 * frames inside a small area. It sends one kind of upstream request and keeps
 * signed image URLs, device ids and sensor values out of every answer.
 *
 * GET  /api/beemaps/status -> {configured}
 * POST /api/beemaps/frames -> frames inside a box or a polygon (this machine only)
 *
 * The steps of a frames request, in order: method, local request, rate limit,
 * body, area, date, limit, key, memory, hold, budget. The first step that
 * answers ends the request.
 */

const MEMORY_MS = 600_000;
const MEMORY_MAX = 32;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 6;
const HOLD_MS = { key_rejected: 300_000, no_credit: 600_000 };
const FAILURES = {
  key_rejected: {
    status: 403,
    payload: { error: 'key_rejected', keyRejected: true },
  },
  no_credit: { status: 402, payload: { error: 'no_credit' } },
  upstream_failed: { status: 502, payload: { error: 'upstream_failed' } },
  bad_upstream: { status: 502, payload: { error: 'bad_upstream' } },
};

function send(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

/** True when the request is for the route itself and not for a path below it. */
const onOwnPath = (req) => req.url.split('?')[0] === '/';

const refusal = (status, payload, headers) => ({
  ok: false,
  status,
  payload,
  headers,
});

function failureOf(kind, retryAfter) {
  if (kind === 'upstream_rate_limit') {
    return refusal(
      429,
      { error: 'upstream_rate_limit', retryAfter },
      { 'Retry-After': String(retryAfter) },
    );
  }
  return refusal(FAILURES[kind].status, FAILURES[kind].payload);
}

/**
 * Vite plugin for `/api/beemaps/*`.
 *
 * @param {object} [options]
 * @param {Record<string, string|undefined>} [options.env] Environment with
 *   BEEMAPS_API_KEY and BEEMAPS_DAILY_QUERIES.
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the upstream request.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Function} [options.setTimer] Timer for the request timeout.
 * @param {Function} [options.clearTimer] Clears that timer.
 * @param {string} [options.cacheDir] Folder of the budget file.
 */
export function beemapsProxy({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  cacheDir = path.join(process.cwd(), '.gev-cache', 'beemaps'),
} = {}) {
  const budget = createBudget({ dir: cacheDir, env, now });
  const allow = makeRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX });
  const memory = new Map();
  const inFlight = new Map();
  let hold = null;

  const key = () => (env.BEEMAPS_API_KEY ?? '').trim();

  function holdAnswer() {
    const retryAfter = Math.ceil((hold.until - now()) / 1000);
    return failureOf(hold.kind, retryAfter);
  }

  function startHold(kind, retryAfter) {
    const holdMs =
      kind === 'upstream_rate_limit' ? retryAfter * 1000 : HOLD_MS[kind];
    if (holdMs !== undefined) hold = { kind, until: now() + holdMs };
  }

  async function fetchFresh(id, { apiKey, ring, since }) {
    if (hold !== null && now() < hold.until) return holdAnswer();
    const reserved = await budget.reserve();
    if (!reserved.ok) {
      return reserved.reason === 'limit'
        ? refusal(429, {
            error: 'budget',
            used: reserved.used,
            limit: reserved.limit,
          })
        : refusal(503, { error: 'budget_unavailable' });
    }
    const called = await callUpstream({
      fetchImpl,
      key: apiKey,
      ring,
      since,
      setTimer,
      clearTimer,
    });
    if (!called.ok) {
      startHold(called.kind, called.retryAfter);
      return failureOf(called.kind, called.retryAfter);
    }
    const normalized = normalizeDocument(called.document, since);
    if (!normalized.ok) return failureOf('bad_upstream');
    const entry = {
      at: now(),
      frames: normalized.frames,
      overflow: normalized.overflow,
      credits: normalized.credits,
    };
    memory.delete(id);
    if (memory.size >= MEMORY_MAX) memory.delete(memory.keys().next().value);
    memory.set(id, entry);
    return { ok: true, entry, cached: false };
  }

  /** The memory step: a stored answer, or the upstream request that is in flight. */
  async function lookup(id, input) {
    const stored = memory.get(id);
    if (stored !== undefined && now() - stored.at < MEMORY_MS) {
      return { ok: true, entry: stored, cached: true };
    }
    const flying = inFlight.get(id);
    if (flying !== undefined) {
      const shared = await flying;
      return shared.ok ? { ...shared, cached: true } : shared;
    }
    const run = fetchFresh(id, input);
    inFlight.set(id, run);
    try {
      return await run;
    } finally {
      inFlight.delete(id);
    }
  }

  function answerOf({ entry, cached }, limit, since) {
    const frames = entry.frames.slice(0, limit);
    const total = entry.frames.length;
    return {
      source: 'Bee Maps',
      frames,
      count: frames.length,
      total,
      truncated: total > limit || entry.overflow,
      cached,
      since,
      budget: budget.current(),
      credits: entry.credits,
    };
  }

  function handleStatus(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'GET') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    return send(res, 200, { configured: key() !== '' });
  }

  async function handleFrames(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    if (!isLoopbackCommand(req)) {
      return send(res, 403, { error: 'cross_origin' });
    }
    if (!allow('local')) {
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    }
    const text = await readBodyText(req);
    if (text === null) return send(res, 400, { error: 'bad_body' });
    const checked = validateRequest(text, now());
    if (!checked.ok) return send(res, checked.status, checked.payload);
    const apiKey = key();
    if (apiKey === '') {
      return send(res, 503, { error: 'no_key', keyRequired: true });
    }
    const { ring, since, limit } = checked;
    const result = await lookup(JSON.stringify([ring, since]), {
      apiKey,
      ring,
      since,
    });
    if (!result.ok) {
      return send(res, result.status, result.payload, result.headers);
    }
    return send(res, 200, answerOf(result, limit, since));
  }

  const install = ({ middlewares }) => {
    middlewares.use('/api/beemaps/status', sameSiteGated(handleStatus));
    middlewares.use('/api/beemaps/frames', handleFrames);
  };
  return {
    name: 'beemaps-proxy',
    configureServer: install,
    configurePreviewServer: install,
  };
}
