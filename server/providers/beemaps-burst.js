import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { isLoopbackCommand } from './common/loopback-command.js';
import { clientKey } from './common/rate-limit.js';
import { sameSiteGated } from './common/same-site.js';
import { createAudit } from './beemaps-burst/audit.js';
import { createCredits } from './beemaps-burst/credits.js';
import { createLedger } from './beemaps-burst/ledger.js';
import { createQuotes } from './beemaps-burst/quotes.js';
import { createBurst, listBursts } from './beemaps-burst/upstream.js';
import {
  CONFIRM_BODY_MAX,
  LIST_BODY_MAX,
  QUOTE_BODY_MAX,
  readBodyText,
  readConfig,
  validateConfirm,
  validateList,
  validateQuote,
} from './beemaps-burst/validate.js';

/**
 * Bee Maps burst provider: routes that ask Bee Maps to map an area again. A
 * burst costs credits and cannot be cancelled, so every rule that protects the
 * money lives here.
 *
 * GET  /api/beemaps/burst/status  -> the settings
 * POST /api/beemaps/burst/quote   -> a single-use quote for a box (this machine only)
 * POST /api/beemaps/burst/confirm -> one create request for one quote (this machine only)
 * POST /api/beemaps/burst/list    -> the bursts of the key (this machine only)
 *
 * The steps of a confirm, in order: method, local request, rate limit, flag,
 * key, body, busy, idempotency key, hold, quote, budget, audit line, record of
 * the attempt, upstream request. The first step that answers ends the confirm.
 */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = { quote: 10, confirm: 3, list: 6 };
const LIST_CACHE_MS = 60_000;
const HOLD_MS = { key_rejected: 300_000, no_credit: 600_000 };

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

/** A limiter of requests in a window of 60 seconds, on the given clock. */
function makeLimiter(max, now) {
  const times = [];
  return () => {
    const at = now();
    while (times.length > 0 && at - times[0] >= RATE_WINDOW_MS) times.shift();
    if (times.length >= max) return false;
    times.push(at);
    return true;
  };
}

/** The answer for a stored record. */
function answerOfRecord(record, replayed) {
  if (record.state === 'created') {
    return {
      status: 200,
      payload: {
        ok: true,
        outcome: 'created',
        replayed,
        burst: record.burst,
        creditsRemaining: record.creditsRemaining,
      },
      headers: {},
    };
  }
  if (record.state === 'refused') {
    const hasWait = record.retryAfter !== undefined;
    return {
      status: record.status,
      payload: {
        ok: false,
        outcome: 'refused',
        error: record.error,
        ...(hasWait ? { retryAfter: record.retryAfter } : {}),
        ...(replayed ? { replayed: true } : {}),
      },
      headers: hasWait ? { 'Retry-After': String(record.retryAfter) } : {},
    };
  }
  return {
    status: 409,
    payload: {
      ok: false,
      outcome: 'unknown',
      error: 'outcome_unknown',
      replayed: true,
    },
    headers: {},
  };
}

/**
 * Vite plugin for `/api/beemaps/burst/*`.
 *
 * @param {object} [options]
 * @param {Record<string, string|undefined>} [options.env] Environment with the
 *   BEEMAPS_BURST_* variables.
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the upstream requests.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Function} [options.setTimer] Timer for the request timeouts.
 * @param {Function} [options.clearTimer] Clears that timer.
 * @param {string} [options.cacheDir] Folder of `credits.json` and `ledger.json`.
 * @param {string} [options.sourceRoot] Folder that holds `.gev-logs`, for the default audit.
 * @param {(event: object) => Promise<void>} [options.audit] Writes an audit line.
 * @param {() => string} [options.randomId] Gives the id of a request.
 * @param {object} [options.fs] File functions for the two durable files.
 */
export function beemapsBurstProxy({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  cacheDir = path.join(process.cwd(), '.gev-cache', 'beemaps-burst'),
  sourceRoot,
  audit = createAudit({ now, sourceRoot }),
  randomId = randomUUID,
  fs,
} = {}) {
  const credits = createCredits({
    dir: cacheDir,
    limit: () => readConfig(env).dailyCredits,
    now,
    fs,
  });
  const ledger = createLedger({ dir: cacheDir, now, fs });
  const quotes = createQuotes({ now });
  const allow = {
    quote: makeLimiter(RATE_MAX.quote, now),
    confirm: makeLimiter(RATE_MAX.confirm, now),
    list: makeLimiter(RATE_MAX.list, now),
  };
  let hold = null;
  let busy = false;
  let listCache = null;
  let listing = null;

  const startHold = (result) => {
    const ms =
      result.error === 'upstream_rate_limit'
        ? result.retryAfter * 1000
        : HOLD_MS[result.error];
    if (ms !== undefined) {
      hold = {
        status: result.status,
        error: result.error,
        until: now() + ms,
      };
    }
  };

  function handleStatus(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'GET') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    const config = readConfig(env);
    return send(res, 200, {
      enabled: config.enabled,
      configured: config.configured,
      minCredits: config.minCredits,
      maxCredits: config.maxCredits,
      dailyCredits: config.dailyCredits,
    });
  }

  async function handleQuote(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    if (!isLoopbackCommand(req)) {
      return send(res, 403, { error: 'cross_origin' });
    }
    if (!allow.quote()) {
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    }
    const config = readConfig(env);
    if (!config.enabled) return send(res, 403, { error: 'burst_off' });
    if (!config.configured) return send(res, 403, { error: 'no_key' });
    const text = await readBodyText(req, QUOTE_BODY_MAX);
    const checked = validateQuote(text, config);
    if (!checked.ok) return send(res, checked.status, checked.payload);
    const peeked = await credits.peek();
    if (!peeked.ok) return send(res, 500, { error: 'budget_unavailable' });
    const remaining = peeked.limit - peeked.used;
    if (checked.request.credits > remaining) {
      return send(res, 403, {
        error: 'budget_used',
        used: peeked.used,
        limit: peeked.limit,
      });
    }
    const { quoteId, expiresInSeconds } = quotes.add(checked.request);
    return send(res, 200, {
      quoteId,
      expiresInSeconds,
      request: checked.request,
      budget: { used: peeked.used, limit: peeked.limit, remaining },
    });
  }

  /** The steps of a confirm from the idempotency key on. The lock is held. */
  async function confirmLocked({ res, config, context, block }) {
    const { quoteId, idempotencyKey } = context;
    const found = await ledger.find(idempotencyKey);
    if (!found.ok) return block(500, 'ledger_unavailable');
    if (found.record !== null) {
      if (found.record.quoteId !== quoteId) return block(409, 'key_reused');
      const answer = answerOfRecord(found.record, true);
      return send(res, answer.status, answer.payload, answer.headers);
    }
    if (hold !== null && now() < hold.until) {
      const wait = Math.ceil((hold.until - now()) / 1000);
      const isRate = hold.error === 'upstream_rate_limit';
      return block(
        hold.status,
        hold.error,
        {
          ok: false,
          outcome: 'refused',
          held: true,
          ...(isRate ? { retryAfter: wait } : {}),
        },
        isRate ? { 'Retry-After': String(wait) } : {},
      );
    }
    if (found.holdSeconds > 0) {
      return block(
        409,
        'outcome_unknown',
        {
          ok: false,
          outcome: 'unknown',
          held: true,
          retryAfter: found.holdSeconds,
        },
        { 'Retry-After': String(found.holdSeconds) },
      );
    }
    const request = quotes.take(quoteId);
    if (request === null) return block(410, 'quote_expired');
    Object.assign(context, {
      bbox: request.bbox,
      areaKm2: request.areaKm2,
      credits: request.credits,
    });
    const reserved = await credits.reserve(request.credits);
    if (!reserved.ok) {
      return reserved.reason === 'limit'
        ? block(403, 'budget_used', {
            used: reserved.used,
            limit: reserved.limit,
          })
        : block(500, 'budget_unavailable');
    }
    try {
      await audit({ ...context, outcome: 'accepted' });
    } catch {
      return block(500, 'log_failed');
    }
    const begun = await ledger.begin(idempotencyKey, quoteId);
    if (!begun.ok) return block(500, 'ledger_unavailable');
    const started = now();
    const result = await createBurst({
      fetchImpl,
      key: config.key,
      bbox: request.bbox,
      credits: request.credits,
      setTimer,
      clearTimer,
    });
    const finished = {
      ...context,
      upstreamStatus: result.upstreamStatus,
      durationMs: now() - started,
    };
    if (result.kind === 'created') {
      await ledger.finish(idempotencyKey, 'created', {
        burst: result.burst,
        creditsRemaining: result.creditsRemaining,
      });
      await audit({
        ...finished,
        outcome: 'created',
        burstId: result.burst.id,
      }).catch(() => {});
      const answer = answerOfRecord(
        {
          state: 'created',
          burst: result.burst,
          creditsRemaining: result.creditsRemaining,
        },
        false,
      );
      return send(res, answer.status, answer.payload, answer.headers);
    }
    if (result.kind === 'refused') {
      startHold(result);
      await ledger.finish(idempotencyKey, 'refused', {
        status: result.status,
        error: result.error,
        retryAfter: result.retryAfter,
      });
      await audit({
        ...finished,
        outcome: 'refused',
        reason: result.error,
      }).catch(() => {});
      const answer = answerOfRecord({ state: 'refused', ...result }, false);
      return send(res, answer.status, answer.payload, answer.headers);
    }
    await ledger.finish(idempotencyKey, 'unknown', {});
    await audit({
      ...finished,
      outcome: 'unknown',
      reason: 'outcome_unknown',
    }).catch(() => {});
    return send(res, 502, {
      ok: false,
      outcome: 'unknown',
      error: 'outcome_unknown',
    });
  }

  async function handleConfirm(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    if (!isLoopbackCommand(req)) {
      return send(res, 403, { error: 'cross_origin' });
    }
    const context = { requestId: randomId(), client: clientKey(req) };
    const block = async (status, error, extra = {}, headers = {}) => {
      await audit({ ...context, outcome: 'blocked', reason: error }).catch(
        () => {},
      );
      return send(res, status, { error, ...extra }, headers);
    };
    if (!allow.confirm()) {
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    }
    const config = readConfig(env);
    if (!config.enabled) return block(403, 'burst_off');
    if (!config.configured) return block(403, 'no_key');
    const text = await readBodyText(req, CONFIRM_BODY_MAX);
    const checked = validateConfirm(text);
    if (!checked.ok) return block(checked.status, 'bad_body');
    context.quoteId = checked.quoteId;
    context.idempotencyKey = checked.idempotencyKey;
    if (busy) return block(409, 'busy');
    busy = true;
    try {
      return await confirmLocked({ res, config, context, block });
    } finally {
      busy = false;
    }
  }

  /** The list step "memory": a stored answer, or the request that is in flight. */
  async function lookupList(key) {
    if (listCache !== null && now() - listCache.at < LIST_CACHE_MS) {
      return { result: listCache.result, cached: true };
    }
    if (listing !== null) {
      const shared = await listing;
      return { result: shared, cached: true };
    }
    listing = listBursts({ fetchImpl, key, setTimer, clearTimer });
    try {
      const result = await listing;
      if (result.ok) listCache = { at: now(), result };
      return { result, cached: false };
    } finally {
      listing = null;
    }
  }

  async function handleList(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Method not allowed' });
    }
    if (!isLoopbackCommand(req)) {
      return send(res, 403, { error: 'cross_origin' });
    }
    if (!allow.list()) {
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    }
    const config = readConfig(env);
    if (!config.enabled) return send(res, 403, { error: 'burst_off' });
    if (!config.configured) return send(res, 403, { error: 'no_key' });
    const text = await readBodyText(req, LIST_BODY_MAX);
    const checked = validateList(text);
    if (!checked.ok) return send(res, checked.status, checked.payload);
    const { result, cached } = await lookupList(config.key);
    if (!result.ok) {
      return send(res, result.error === 'key_rejected' ? 403 : 502, {
        error: result.error,
      });
    }
    return send(res, 200, {
      bursts: result.bursts.slice(0, checked.limit),
      total: result.total,
      cached,
    });
  }

  /** An error that nobody expects gives an answer and never an unhandled rejection. */
  const guarded = (handler) => async (req, res, next) => {
    try {
      return await handler(req, res, next);
    } catch {
      if (!res.headersSent) send(res, 500, { error: 'internal_error' });
    }
  };

  const install = ({ middlewares }) => {
    middlewares.use('/api/beemaps/burst/status', sameSiteGated(handleStatus));
    middlewares.use('/api/beemaps/burst/quote', guarded(handleQuote));
    middlewares.use('/api/beemaps/burst/confirm', guarded(handleConfirm));
    middlewares.use('/api/beemaps/burst/list', guarded(handleList));
  };
  return {
    name: 'beemaps-burst-proxy',
    configureServer: install,
    configurePreviewServer: install,
  };
}
