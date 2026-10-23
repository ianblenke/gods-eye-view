import { makeRateLimiter } from './common/rate-limit.js';
import { admitSameSite } from './common/same-site.js';
import { normalizeScenes } from './planet/normalize.js';
import { planetThumbnailProxy } from './planet/thumbnails.js';
import { runSearches } from './planet/upstream.js';
import { isSameSite } from './skywatch/same-site.js';
import { readBodyText, validateRequest } from './skywatch/validate.js';

/**
 * Planet provider: a read-only route for the archive scenes of a small box
 * and a date window. For each upstream search it sends one quick search
 * request for `PSScene` and one for `SkySatCollect`, and it keeps the key on
 * the server.
 *
 * GET  /api/planet/status -> {configured}
 * POST /api/planet/scenes -> scenes inside a box (same site, JSON only)
 *
 * The steps of a scenes request, in order: method, same site, rate limit,
 * body, box, area, dates, key, store, daily count. The first step that
 * answers ends the request. Each upstream search writes one log line.
 * `thumbnailTypeOf` gives the item type of a scene of a kept answer to the
 * thumbnail plugin of `planetPlugins()`.
 */

const STORE_MS = 600_000;
const STORE_MAX = 32;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 6;
const DEFAULT_DAILY_LIMIT = 20;
const MAX_DAILY_LIMIT = 1000;
const FAILURES = {
  key_rejected: {
    status: 403,
    payload: { error: 'key_rejected', keyRejected: true },
  },
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

/** The daily limit: digits only, from 1 to 1000, else 20. */
function dailyLimitOf(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    return DEFAULT_DAILY_LIMIT;
  }
  const limit = Number(value);
  return limit >= 1 && limit <= MAX_DAILY_LIMIT ? limit : DEFAULT_DAILY_LIMIT;
}

/** The UTC date of a time, as YYYY-MM-DD. */
const dayOf = (time) => new Date(time).toISOString().slice(0, 10);

function refusalOf(failure) {
  if (failure.kind === 'upstream_rate_limit') {
    return {
      status: 429,
      payload: { error: 'upstream_rate_limit', retryAfter: failure.retryAfter },
      headers: { 'Retry-After': String(failure.retryAfter) },
    };
  }
  return FAILURES[failure.kind];
}

/**
 * Vite plugin for `/api/planet/*`.
 *
 * @param {object} [options]
 * @param {Record<string, string|undefined>} [options.env] Environment with
 *   PLANET_API_KEY and PLANET_DAILY_SEARCHES.
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the upstream requests.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Function} [options.setTimer] Timer for the time limit of a request.
 * @param {Function} [options.clearTimer] Clears that timer.
 * @param {(line: string) => void} [options.log] Writes one line of the log.
 */
export function planetProxy({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  log = (line) => console.log(line),
} = {}) {
  const allow = makeRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX });
  const store = new Map();
  const inFlight = new Map();
  let count = { day: '', used: 0 };

  const key = () => (env.PLANET_API_KEY ?? '').trim();
  const limit = () => dailyLimitOf(env.PLANET_DAILY_SEARCHES);

  function countOfToday() {
    const day = dayOf(now());
    if (count.day !== day) count = { day, used: 0 };
    return count;
  }

  const budget = () => ({ used: countOfToday().used, limit: limit() });

  /** The item type of a scene of the newest kept answer that has it with a thumbnail, or null. */
  function thumbnailTypeOf(id) {
    for (const entry of [...store.values()].reverse()) {
      if (now() - entry.at >= STORE_MS) continue;
      const index = entry.scenes.findIndex(
        (scene) => scene.id === id && scene.thumbnail,
      );
      if (index !== -1) return entry.types[index];
    }
    return null;
  }

  async function search(id, apiKey, { bbox, start, end }) {
    const started = now();
    const result = await runSearches({
      fetchImpl,
      key: apiKey,
      bbox,
      start,
      end,
      setTimer,
      clearTimer,
    });
    const ms = now() - started;
    if (!result.ok) {
      log(
        `[planet] failed kind=${result.kind} requests=${result.requests} ms=${ms}`,
      );
      return { ok: false, failure: result };
    }
    const entry = { at: now(), ...normalizeScenes(result.pages) };
    log(
      `[planet] ok scenes=${entry.scenes.length} requests=${result.requests} ms=${ms}`,
    );
    store.delete(id);
    if (store.size >= STORE_MAX) store.delete(store.keys().next().value);
    store.set(id, entry);
    return { ok: true, entry };
  }

  /** The store step: a kept answer, or the upstream search that is in flight. */
  function fromStore(id) {
    const kept = store.get(id);
    if (kept !== undefined && now() - kept.at < STORE_MS) {
      return Promise.resolve({ ok: true, entry: kept, cached: true });
    }
    const flying = inFlight.get(id);
    if (flying === undefined) return null;
    return flying.then((shared) =>
      shared.ok ? { ...shared, cached: true } : shared,
    );
  }

  async function startSearch(id, apiKey, input) {
    const run = search(id, apiKey, input).then((result) =>
      result.ok ? { ...result, cached: false } : result,
    );
    inFlight.set(id, run);
    try {
      return await run;
    } finally {
      inFlight.delete(id);
    }
  }

  function answerOf({ entry, cached }) {
    return {
      source: 'Planet',
      scenes: entry.scenes,
      count: entry.scenes.length,
      truncated: entry.truncated,
      cached,
      budget: budget(),
    };
  }

  function handleStatus(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (admitSameSite(req, res)) return undefined;
    if (req.method !== 'GET') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    return send(res, 200, { configured: key() !== '' });
  }

  async function handleScenes(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    if (
      !isSameSite(req) ||
      req.headers['content-type'] !== 'application/json'
    ) {
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
    const id = JSON.stringify([checked.bbox, checked.start, checked.end]);
    let result = await fromStore(id);
    if (result === null) {
      const today = countOfToday();
      if (today.used >= limit()) {
        return send(res, 429, {
          error: 'budget',
          used: today.used,
          limit: limit(),
        });
      }
      today.used += 1;
      result = await startSearch(id, apiKey, checked);
    }
    if (!result.ok) {
      const refusal = refusalOf(result.failure);
      return send(res, refusal.status, refusal.payload, refusal.headers);
    }
    return send(res, 200, answerOf(result));
  }

  const install = ({ middlewares }) => {
    middlewares.use('/api/planet/status', handleStatus);
    middlewares.use('/api/planet/scenes', handleScenes);
  };
  return {
    name: 'planet-proxy',
    configureServer: install,
    configurePreviewServer: install,
    thumbnailTypeOf,
  };
}

/**
 * The scenes plugin and the thumbnail plugin, made with the same options. The
 * thumbnail plugin finds the item type of a scene in the kept answers of the
 * scenes plugin of the same call.
 * @param {Parameters<typeof planetProxy>[0]} [options]
 */
export function planetPlugins(options = {}) {
  const scenes = planetProxy(options);
  return [
    scenes,
    planetThumbnailProxy({
      ...options,
      thumbnailTypeOf: scenes.thumbnailTypeOf,
    }),
  ];
}
