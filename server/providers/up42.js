import { makeRateLimiter } from './common/rate-limit.js';
import { admitSameSite } from './common/same-site.js';
import { createClient } from './up42/auth.js';
import { isSameSite } from './up42/same-site.js';
import { createSearch } from './up42/upstream.js';
import { readBodyText, validateRequest } from './up42/validate.js';

const FAILURES = {
  credentials_rejected: {
    status: 403,
    payload: { error: 'credentials_rejected', keyRejected: true },
  },
  upstream_failed: { status: 502, payload: { error: 'upstream_failed' } },
  search_timeout: { status: 504, payload: { error: 'search_timeout' } },
  bad_collections: { status: 400, payload: { error: 'bad_collections' } },
};
function send(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(payload));
}
const onOwnPath = (req) => req.url.split('?')[0] === '/';
function dailyLimitOf(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return 20;
  const limit = Number(value);
  return limit >= 1 && limit <= 1000 ? limit : 20;
}

/** Read-only UP42 archive routes. All credentials stay on the server. */
export function up42Plugins({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  log = (line) => console.log(line),
} = {}) {
  const client = createClient({ env, fetchImpl, now, setTimer, clearTimer });
  const runSearch = createSearch(client, now);
  const allow = makeRateLimiter({ windowMs: 60000, max: 6 });
  const store = new Map();
  const inFlight = new Map();
  let count = { day: '', used: 0 };
  const configured = () =>
    (env.UP42_USERNAME ?? '').trim() !== '' &&
    (env.UP42_PASSWORD ?? '').trim() !== '';
  const limit = () => dailyLimitOf(env.UP42_DAILY_SEARCHES);
  function budget() {
    const day = new Date(now()).toISOString().slice(0, 10);
    if (count.day !== day) count = { day, used: 0 };
    return { used: count.used, limit: limit() };
  }
  async function search(id, input) {
    let result = await runSearch(input);
    if (!client.isSafe(result)) result = { ok: false, kind: 'upstream_failed' };
    log(result.ok ? '[up42] ok' : '[up42] failed');
    if (!result.ok) return result;
    const { ok, ...entry } = result;
    store.delete(id);
    if (store.size >= 32) store.delete(store.keys().next().value);
    store.set(id, { entry, at: now() });
    return { ok, entry, cached: false };
  }
  function fromStore(id) {
    const kept = store.get(id);
    if (kept !== undefined && now() - kept.at < 600000)
      return Promise.resolve({ ok: true, entry: kept.entry, cached: true });
    const flying = inFlight.get(id);
    if (flying === undefined) return null;
    return flying.then((result) =>
      result.ok ? { ...result, cached: true } : result,
    );
  }
  async function startSearch(id, input) {
    const run = search(id, input);
    inFlight.set(id, run);
    try {
      return await run;
    } finally {
      inFlight.delete(id);
    }
  }
  function handleStatus(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (admitSameSite(req, res)) return undefined;
    if (req.method !== 'GET')
      return send(res, 405, { error: 'Method not allowed' });
    return send(res, 200, { configured: configured() });
  }
  async function handleScenes(req, res, next) {
    if (!onOwnPath(req)) return next();
    if (req.method !== 'POST')
      return send(res, 405, { error: 'Method not allowed' });
    if (!isSameSite(req) || req.headers['content-type'] !== 'application/json')
      return send(res, 403, { error: 'cross_origin' });
    if (!allow('local'))
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    const text = await readBodyText(req);
    if (text === null) return send(res, 400, { error: 'bad_body' });
    const input = validateRequest(text, now());
    if (!input.ok) return send(res, input.status, input.payload);
    if (!configured())
      return send(res, 503, { error: 'no_credentials', keyRequired: true });
    const id = JSON.stringify([
      input.box,
      input.start,
      input.end,
      input.maxCloud,
      input.collections,
    ]);
    let result = await fromStore(id);
    if (result === null) {
      const today = budget();
      if (today.used >= today.limit)
        return send(res, 429, { error: 'budget', ...today });
      count.used++;
      result = await startSearch(id, input);
    }
    if (!result.ok) {
      const refusal = FAILURES[result.kind];
      return send(res, refusal.status, refusal.payload);
    }
    return send(res, 200, {
      source: 'UP42',
      ...result.entry,
      count: result.entry.scenes.length,
      cached: result.cached,
      budget: budget(),
    });
  }
  const install = ({ middlewares }) => {
    middlewares.use('/api/up42/status', handleStatus);
    middlewares.use('/api/up42/scenes', handleScenes);
  };
  return [
    {
      name: 'up42-proxy',
      configureServer: install,
      configurePreviewServer: install,
    },
  ];
}
