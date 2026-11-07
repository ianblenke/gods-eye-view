import { makeRateLimiter } from '../common/rate-limit.js';
import { isSameSite } from '../up42/same-site.js';
import { readBodyText } from '../up42/validate.js';
import { validateQuote } from './validate.js';
import { createQuotes } from './upstream.js';

function send(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(payload));
}
function failure(res, error) {
  const status =
    error === 'unknown_product'
      ? 404
      : error === 'credentials_rejected'
        ? 403
        : 502;
  return send(res, status, {
    error,
    ...(error === 'credentials_rejected' ? { keyRejected: true } : {}),
  });
}
function dailyLimit(v) {
  if (typeof v !== 'string' || !/^\d+$/.test(v)) return 20;
  const n = Number(v);
  return n >= 1 && n <= 200 ? n : 20;
}

/** Quote facts only. The route never changes an order. */
export function up42QuoteProxy({
  env = process.env,
  now = Date.now,
  client,
} = {}) {
  const quotes = createQuotes(client, now);
  const allow = makeRateLimiter({ windowMs: 60000, max: 6 });
  const store = new Map();
  const inFlight = new Map();
  let day = '';
  let used = 0;
  function budget() {
    const today = new Date(now()).toISOString().slice(0, 10);
    if (today !== day) {
      day = today;
      used = 0;
    }
    return { used, limit: dailyLimit(env.UP42_DAILY_QUOTES) };
  }
  async function start(key, input) {
    const run = Promise.resolve().then(() => quotes.run(input));
    inFlight.set(key, run);
    const result = await run;
    inFlight.delete(key);
    if (result.ok) {
      store.delete(key);
      if (store.size >= 16) store.delete(store.keys().next().value);
      store.set(key, { result, at: now() });
    }
    return result;
  }
  async function handle(req, res, next, products) {
    if (req.url.split('?')[0] !== '/') return next();
    if (req.method !== (products ? 'GET' : 'POST'))
      return send(res, 405, { error: 'Method not allowed' });
    if (
      !isSameSite(req) ||
      (!products && req.headers['content-type'] !== 'application/json')
    )
      return send(res, 403, { error: 'cross_origin' });
    if (env.UP42_QUOTES !== 'true')
      return send(res, 404, { error: 'quotes_off' });
    if (!allow('quotes'))
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    if (products) {
      const result = await quotes.products();
      return result.ok
        ? send(res, 200, { products: result.products })
        : failure(res, result.error);
    }
    const text = await readBodyText(req);
    if (text === null) return send(res, 400, { error: 'bad_body' });
    const input = validateQuote(text);
    if (!input.ok) {
      const { ok, ...payload } = input;
      return send(res, 400, payload);
    }
    if (
      (env.UP42_USERNAME ?? '').trim() === '' ||
      (env.UP42_PASSWORD ?? '').trim() === ''
    )
      return send(res, 503, { error: 'no_credentials', keyRequired: true });
    const key = JSON.stringify(input);
    const kept = store.get(key);
    let result;
    let cached = true;
    if (kept !== undefined && now() - kept.at < 600000) result = kept.result;
    else {
      result = inFlight.get(key);
      if (result === undefined) {
        const today = budget();
        if (today.used >= today.limit)
          return send(res, 429, { error: 'budget', ...today });
        used++;
        cached = false;
        result = start(key, input);
      }
    }
    result = await result;
    if (!result.ok) return failure(res, result.error);
    if (!client.isSafe(result)) return failure(res, 'upstream_failed');
    return send(res, 200, {
      results: result.results,
      cached,
      budget: budget(),
    });
  }
  const install = ({ middlewares }) => {
    middlewares.use('/api/up42/quote/products', (req, res, next) =>
      handle(req, res, next, true),
    );
    middlewares.use('/api/up42/quote', (req, res, next) =>
      handle(req, res, next, false),
    );
  };
  return {
    name: 'up42-quotes',
    configureServer: install,
    configurePreviewServer: install,
  };
}
