import { readResponseBytesCapped } from '../common/http.js';
import { makeRateLimiter } from '../common/rate-limit.js';
import {
  MAX_IMAGE_BYTES,
  hasImageSignature,
  isImageType,
  mediaTypeOf,
  parseThumbnailUrl,
} from './image.js';
import { isSearchId } from './normalize.js';
import { isSameSite } from './same-site.js';

/**
 * SkyWatch thumbnails: a read-only route for the thumbnail of a scene that a
 * kept answer of the scenes route gave. The URL of the thumbnail and the key
 * stay on the server.
 *
 * GET /api/skywatch/thumbnail/<id> -> the image (off until SKYWATCH_THUMBNAILS=true)
 *
 * The steps of a request, in order: path, same site, method, variable, rate
 * limit, scene, URL check, image store. The first step that answers ends the
 * request. Each upstream request writes one log line.
 */

const ROUTE = '/api/skywatch/thumbnail';
const STORE_MS = 600_000;
const STORE_MAX = 32;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
const UPSTREAM_TIMEOUT_MS = 15_000;
const OWN_HOST = 'api.skywatch.co';
const ACCEPT = 'image/png, image/jpeg, image/webp';

function sendJson(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(payload));
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

/** The checked image of an upstream answer. The body is read only for an image type. */
async function imageOf(response, signal) {
  if (response.status !== 200) return { ok: false, kind: 'upstream_failed' };
  const type = mediaTypeOf(response.headers.get('content-type'));
  if (!isImageType(type)) return { ok: false, kind: 'bad_upstream' };
  let bytes;
  try {
    bytes = await readResponseBytesCapped(response, MAX_IMAGE_BYTES, signal);
  } catch (error) {
    return {
      ok: false,
      kind:
        error?.code === 'RESPONSE_TOO_LARGE'
          ? 'bad_upstream'
          : 'upstream_failed',
    };
  }
  if (!hasImageSignature(type, bytes))
    return { ok: false, kind: 'bad_upstream' };
  return { ok: true, type, bytes };
}

/**
 * Vite plugin for `/api/skywatch/thumbnail/*`.
 *
 * @param {object} [options]
 * @param {Record<string, string|undefined>} [options.env] Environment with
 *   SKYWATCH_API_KEY and SKYWATCH_THUMBNAILS.
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the upstream request.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Function} [options.setTimer] Timer for the time limit of a request.
 * @param {Function} [options.clearTimer] Clears that timer.
 * @param {(line: string) => void} [options.log] Writes one line of the log.
 * @param {(id: string) => string|null} [options.thumbnailUrlOf] The thumbnail
 *   URL of a scene of a kept answer of the scenes route, or null.
 */
export function skywatchThumbnailProxy({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  log = (line) => console.log(line),
  thumbnailUrlOf = () => null,
} = {}) {
  const allow = makeRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX });
  const store = new Map();
  const inFlight = new Map();

  const key = () => (env.SKYWATCH_API_KEY ?? '').trim();

  async function fetchImage(url) {
    const controller = new AbortController();
    const timer = setTimer(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    const headers = { Accept: ACCEPT };
    const apiKey = key();
    if (url.hostname === OWN_HOST && apiKey !== '') {
      headers['x-api-key'] = apiKey;
    }
    let outcome;
    try {
      const response = await fetchImpl(url.href, {
        method: 'GET',
        headers,
        redirect: 'error',
        signal: controller.signal,
      });
      outcome = await imageOf(response, controller.signal);
    } catch {
      outcome = { ok: false, kind: 'upstream_failed' };
    } finally {
      clearTimer(timer);
    }
    return outcome;
  }

  /** The image store step: a kept image, or the upstream request that is in flight. */
  function fromStore(href) {
    const kept = store.get(href);
    if (kept !== undefined && now() - kept.at < STORE_MS) {
      return Promise.resolve(kept);
    }
    return inFlight.get(href) ?? null;
  }

  async function startFetch(url) {
    const started = now();
    const run = fetchImage(url).then((result) => {
      const ms = now() - started;
      if (!result.ok) {
        log(`[skywatch] thumbnail failed kind=${result.kind} ms=${ms}`);
        return result;
      }
      log(`[skywatch] thumbnail ok bytes=${result.bytes.byteLength} ms=${ms}`);
      const entry = { ...result, at: now() };
      store.delete(url.href);
      if (store.size >= STORE_MAX) store.delete(store.keys().next().value);
      store.set(url.href, entry);
      return entry;
    });
    inFlight.set(url.href, run);
    try {
      return await run;
    } finally {
      inFlight.delete(url.href);
    }
  }

  async function handle(req, res, next) {
    const id = req.url.split('?')[0].slice(1);
    if (!isSearchId(id)) return next();
    if (!isSameSite(req)) return sendJson(res, 403, { error: 'cross_origin' });
    if (req.method !== 'GET') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }
    if (env.SKYWATCH_THUMBNAILS !== 'true') {
      return sendJson(res, 404, { error: 'thumbnails_off' });
    }
    if (!allow('thumbnails')) {
      return sendJson(
        res,
        429,
        { error: 'rate_limited' },
        { 'Retry-After': '60' },
      );
    }
    const text = thumbnailUrlOf(id);
    if (text === null) return sendJson(res, 404, { error: 'unknown_scene' });
    const url = parseThumbnailUrl(text);
    if (url === null) return sendJson(res, 502, { error: 'bad_upstream' });
    const result = (await fromStore(url.href)) ?? (await startFetch(url));
    if (!result.ok) return sendJson(res, 502, { error: result.kind });
    return sendImage(res, result);
  }

  const install = ({ middlewares }) => {
    middlewares.use(ROUTE, handle);
  };
  return {
    name: 'skywatch-thumbnail-proxy',
    configureServer: install,
    configurePreviewServer: install,
  };
}
