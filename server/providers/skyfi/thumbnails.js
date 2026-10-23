import { readResponseBytesCapped } from '../common/http.js';
import { makeRateLimiter } from '../common/rate-limit.js';
import {
  MAX_IMAGE_BYTES,
  hasImageSignature,
  isImageType,
  mediaTypeOf,
} from '../skywatch/image.js';
import { isSameSite } from '../skywatch/same-site.js';
import { isSceneId, isThumbnailLink } from './normalize.js';

/**
 * SkyFi thumbnails: a read-only route for the thumbnail of a scene that a
 * kept answer of the scenes route gave. A thumbnail is a public image, so the
 * upstream request has no key. The plugin keeps no image.
 *
 * GET /api/skyfi/thumbnail/<id> -> the image (off when SKYFI_THUMBNAILS=false)
 *
 * The steps of a request, in order: path, same site, method, variable, rate
 * limit, scene. The first step that answers ends the request. Each
 * upstream request writes one log line.
 */

const ROUTE = '/api/skyfi/thumbnail';
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
const UPSTREAM_TIMEOUT_MS = 15_000;
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
    'Cache-Control': 'no-store',
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
  if (!hasImageSignature(type, bytes)) {
    return { ok: false, kind: 'bad_upstream' };
  }
  return { ok: true, type, bytes };
}

/**
 * Vite plugin for `/api/skyfi/thumbnail/*`.
 *
 * @param {object} [options]
 * @param {Record<string, string|undefined>} [options.env] Environment with
 *   SKYFI_THUMBNAILS.
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the upstream request.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Function} [options.setTimer] Timer for the time limit of a request.
 * @param {Function} [options.clearTimer] Clears that timer.
 * @param {(line: string) => void} [options.log] Writes one line of the log.
 * @param {(id: string) => string|null} [options.thumbnailUrlOf] The
 *   thumbnail link of a scene of a kept answer of the scenes route, or null.
 */
export function skyfiThumbnailProxy({
  env = process.env,
  fetchImpl = fetch,
  now = Date.now,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  log = (line) => console.log(line),
  thumbnailUrlOf = () => null,
} = {}) {
  const allow = makeRateLimiter({ windowMs: RATE_WINDOW_MS, max: RATE_MAX });

  async function fetchImage(link) {
    const controller = new AbortController();
    const timer = setTimer(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    let outcome;
    try {
      const response = await fetchImpl(link, {
        method: 'GET',
        headers: { Accept: ACCEPT },
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

  async function handle(req, res, next) {
    const id = req.url.split('?')[0].slice(1);
    if (!isSceneId(id)) return next();
    if (!isSameSite(req)) return sendJson(res, 403, { error: 'cross_origin' });
    if (req.method !== 'GET') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }
    if (env.SKYFI_THUMBNAILS === 'false') {
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
    const link = thumbnailUrlOf(id);
    if (!isThumbnailLink(link)) {
      return sendJson(res, 404, { error: 'unknown_scene' });
    }
    const started = now();
    const result = await fetchImage(link);
    const ms = now() - started;
    if (!result.ok) {
      log(`[skyfi] thumbnail failed kind=${result.kind} ms=${ms}`);
      return sendJson(res, 502, { error: result.kind });
    }
    log(`[skyfi] thumbnail ok bytes=${result.bytes.byteLength} ms=${ms}`);
    return sendImage(res, result);
  }

  const install = ({ middlewares }) => {
    middlewares.use(ROUTE, handle);
  };
  return {
    name: 'skyfi-thumbnail-proxy',
    configureServer: install,
    configurePreviewServer: install,
  };
}
