import { makeRateLimiter } from '../common/rate-limit.js';
import { isSearchId } from '../up42/normalize.js';
import { isSameSite } from '../up42/same-site.js';

function sendJson(res, status, error, extra = {}, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify({ error, ...extra }));
}
function sendImage(res, image) {
  res.writeHead(200, {
    'Content-Type': image.type,
    'Content-Length': String(image.bytes.byteLength),
    'Cache-Control': 'private, max-age=600',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
  });
  res.end(Buffer.from(image.bytes));
}

/** Checked thumbnails for scenes in this server's answer store. */
export function up42ThumbnailProxy({
  env = process.env,
  now = Date.now,
  client,
  thumbnailHostOf = () => null,
} = {}) {
  const allow = makeRateLimiter({ windowMs: 60000, max: 30 });
  const store = new Map();
  const inFlight = new Map();

  function fromStore(key) {
    const kept = store.get(key);
    if (kept !== undefined && now() - kept.at < 600000)
      return Promise.resolve(kept);
    return inFlight.get(key) ?? null;
  }
  async function startFetch(key, host, id) {
    // Claim the entry before the client can yield to another request.
    const run = Promise.resolve().then(() => client.thumbnail(host, id));
    inFlight.set(key, run);
    const result = await run;
    inFlight.delete(key);
    if (result.ok) {
      store.delete(key);
      if (store.size >= 32) store.delete(store.keys().next().value);
      store.set(key, { ...result, at: now() });
    }
    return result;
  }
  async function handle(req, res, next) {
    const id = req.url.split('?')[0].slice(1);
    if (!isSearchId(id)) return next();
    if (!isSameSite(req)) return sendJson(res, 403, 'cross_origin');
    if (req.method !== 'GET') return sendJson(res, 405, 'Method not allowed');
    if (env.UP42_THUMBNAILS !== 'true')
      return sendJson(res, 404, 'thumbnails_off');
    if (!allow('thumbnails'))
      return sendJson(res, 429, 'rate_limited', {}, { 'Retry-After': '60' });
    if (/^\.+$/.test(id)) return sendJson(res, 404, 'unknown_scene');
    const host = thumbnailHostOf(id);
    if (host === null) return sendJson(res, 404, 'unknown_scene');
    const key = JSON.stringify([host, id]);
    let result = fromStore(key);
    if (result === null) result = startFetch(key, host, id);
    result = await result;
    if (!result.ok) {
      console.log(`[up42] thumbnail failed kind=${result.kind}`);
      if (result.kind === 'credentials_rejected')
        return sendJson(res, 403, result.kind, { keyRejected: true });
      const status =
        result.kind === 'not_found'
          ? 404
          : result.kind === 'search_timeout'
            ? 504
            : 502;
      return sendJson(res, status, result.kind);
    }
    return sendImage(res, result);
  }
  const install = ({ middlewares }) => {
    middlewares.use('/api/up42/thumbnail', handle);
  };
  return {
    name: 'up42-thumbnail-proxy',
    configureServer: install,
    configurePreviewServer: install,
  };
}
