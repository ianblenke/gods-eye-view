import { readResponseJsonCapped } from '../common/http.js';

/**
 * The only fetch() call site of the OpenSensorHub provider. Every route,
 * the base-path probe and the page walk call oshGet(). It sends one GET
 * request with no body, never follows a redirect, and caps the response
 * body and the request time. The only WebSocket call site is
 * oshOpenStream(), below.
 */

/** The list format this provider asks for. Measured against the owner's server on 2026-09-17. */
export const OSH_LIST_FORMAT = 'application/geo+json';

/**
 * Build the URL of the first page of a list request. `query` maps each key
 * to one value. The serializer encodes each value, so a `+`, a `/` or a
 * space in a value reaches the server as that byte and never as a space or
 * a path separator.
 * A safety check re-reads the built URL and throws when it does not keep
 * the root's origin and start with the root's path, the same shape of
 * check `assertObservationUrl()` runs in `ids.js`. `path` is a fixed
 * literal at every call site today, so the check cannot fail; it holds
 * even if a later call site names a path built some other way.
 * @param {URL} root - Resolved API root, or a candidate root.
 * @param {string} path
 * @param {Record<string,string>} query
 * @returns {URL}
 */
export function oshListUrl(root, path, query) {
  const url = new URL(path, root);
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) {
    throw new Error('OSH list URL failed the safety check');
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) params.set(key, value);
  url.search = params.toString();
  return url;
}

/** Hard byte cap on any OpenSensorHub response body. */
export const OSH_MAX_BODY_BYTES = 8 * 1024 * 1024;
/** Per-request upstream timeout. */
export const OSH_REQUEST_TIMEOUT_MS = 15_000;

/**
 * @param {typeof fetch} fetchImpl - Injected fetch implementation.
 * @param {string|URL} url - Upstream URL.
 * @param {object} [options]
 * @param {Record<string,string>} [options.headers]
 * @param {AbortSignal} [options.signal] - Caller abort signal.
 * @param {number} [options.timeoutMs]
 * @param {number} [options.maxBytes]
 * @returns {Promise<{status:number, json:*}>}
 */
export async function oshGet(
  fetchImpl,
  url,
  {
    headers = {},
    signal,
    timeoutMs = OSH_REQUEST_TIMEOUT_MS,
    maxBytes = OSH_MAX_BODY_BYTES,
  } = {},
) {
  const controller = new AbortController();
  const onAbort = () => controller.abort(signal.reason);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener('abort', onAbort, { once: true });
  }
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('OSH upstream timeout', 'TimeoutError'));
  }, timeoutMs);
  try {
    const response = await fetchImpl(String(url), {
      method: 'GET',
      headers,
      redirect: 'manual',
      signal: controller.signal,
    });
    if (response.status >= 300 && response.status < 400) {
      void response.body?.cancel?.().catch(() => {});
      const error = new Error('OSH upstream redirected');
      error.code = 'OSH_REDIRECT';
      error.status = response.status;
      throw error;
    }
    let json = null;
    if (response.status !== 204) {
      try {
        json = await readResponseJsonCapped(response, maxBytes);
      } catch (error) {
        if (error?.code === 'RESPONSE_TOO_LARGE') {
          const tooLarge = new Error('OSH upstream response too large');
          tooLarge.code = 'OSH_TOO_LARGE';
          tooLarge.status = response.status;
          throw tooLarge;
        }
        json = null; // not JSON, or an empty body — treated as no body
      }
    }
    return { status: response.status, json };
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}

/**
 * The only WebSocket call site of the provider. It opens one upstream
 * stream. The Node constructor takes a second argument with a `headers`
 * object (an extension of Node), and it sends a GET handshake with those
 * headers. The server sends one JSON observation in each binary frame, so
 * the socket reads a frame as an ArrayBuffer. No file of the provider uses the
 * name `send`, so the provider sends no message frame to the server. The
 * close frame of a socket that the provider closes is the only frame it sends.
 * @param {typeof WebSocket} WebSocketImpl - Injected WebSocket constructor.
 * @param {string|URL} url - Live URL, already built and guarded by the caller.
 * @param {object} [options]
 * @param {Record<string,string>} [options.headers]
 * @returns {WebSocket}
 */
export function oshOpenStream(WebSocketImpl, url, { headers = {} } = {}) {
  const socket = new WebSocketImpl(String(url), { headers });
  socket.binaryType = 'arraybuffer';
  return socket;
}

/** Query keys a next-page link may carry. Any other key stops the walk. */
export const OSH_PAGE_LINK_QUERY_KEYS = Object.freeze([
  'limit',
  'offset',
  'cursor',
  'page',
  'startIndex',
  'f',
]);

/**
 * True when `candidate` names only a later page of the same request: the
 * same origin as the resolved root, the same path as the current page, no
 * username and no password, no fragment, and a query with no key outside
 * the fixed allowlist. This is not a redirect check or a resource check —
 * it checks that the link cannot name a different request than the one
 * already sent, so a destructive path, a foreign origin, or a
 * method-override key such as `_method=DELETE` cannot become part of the
 * request.
 * @param {URL} candidate
 * @param {URL} root - Resolved API root.
 * @param {URL} current - URL of the page that named this candidate.
 * @returns {boolean}
 */
export function isSamePageWalk(candidate, root, current) {
  if (candidate.origin !== root.origin) return false;
  if (candidate.pathname !== current.pathname) return false;
  if (candidate.username !== '' || candidate.password !== '') return false;
  if (candidate.hash !== '') return false;
  for (const key of candidate.searchParams.keys()) {
    if (!OSH_PAGE_LINK_QUERY_KEYS.includes(key)) return false;
  }
  return true;
}

/**
 * Build the URL this provider actually requests for a next-page link, or
 * null when `isSamePageWalk` refuses the candidate. The origin comes from
 * `root` and the path from `current`, never from the candidate, and the
 * query is rebuilt one allowlisted key at a time from the candidate's own
 * parsed values.
 * The rebuild does not use the candidate's URL. So a separator that the
 * check does not know about cannot hide a second key inside the value of
 * an allowed key. Some servers read `;` as a second query separator. The
 * rebuilt query writes that value as one text string.
 *
 * An `f` key never carries the candidate's own value. `current` is the URL
 * this provider actually sent for the page it just read, so its own `f`
 * key says whether this list asks for a format at all. The rebuild drops
 * every `f` key the candidate carries, then appends the provider's own
 * format once, only when `current` already had one. This holds the format
 * across the whole walk: page 2 gets `f` only when page 1 did, and page 3
 * then reads that from page 2's own URL, never from a link in between.
 *
 * A server can write the format this provider sent into a next link with a
 * raw `+`. It can write an `f` key onto a list that never asks for a
 * format, such as the datastreams list. It can write the key twice. None
 * of those bytes ever reach the wire.
 * @param {URL} candidate
 * @param {URL} root
 * @param {URL} current
 * @returns {?URL}
 */
export function buildNextPageUrl(candidate, root, current) {
  if (!isSamePageWalk(candidate, root, current)) return null;
  const keepsFormat = current.searchParams.has('f');
  const query = new URLSearchParams();
  for (const [key, value] of candidate.searchParams) {
    if (key === 'f') continue;
    query.append(key, value);
  }
  if (keepsFormat) query.append('f', OSH_LIST_FORMAT);
  const next = new URL(current.pathname, root);
  next.search = query.toString();
  return next;
}

/** Default page cap for a walk that names no `maxPages` option. */
export const OSH_DEFAULT_MAX_PAGES = 20;

/**
 * Walk a `links[].rel === 'next'` chain from a list payload, following a
 * link only when the link names a later page of the same request (see
 * `buildNextPageUrl`), and stopping after `maxPages` pages (default 20). A
 * link that fails that check, or an unparsable `href`, stops the walk — it
 * is not an error, so the function still gives the items it collected, with
 * `truncated:false`. Reaching the page cap while the last page read still
 * named a next link gives `truncated:true`, so a loss at the cap is never
 * silent.
 * @param {typeof fetch} fetchImpl
 * @param {URL} root - Resolved API root (the origin every page must share).
 * @param {URL} firstUrl - URL of the first page.
 * @param {object} options
 * @param {Record<string,string>} [options.headers]
 * @param {(payload:*) => any[]} options.listOf - Reads the item array of a page.
 * @param {number} [options.maxPages] - Page cap for this walk.
 * @returns {Promise<{items: any[], truncated: boolean}>}
 */
export async function oshPages(
  fetchImpl,
  root,
  firstUrl,
  { headers = {}, listOf, maxPages = OSH_DEFAULT_MAX_PAGES },
) {
  const items = [];
  let url = firstUrl;
  let page = 0;
  let truncated = false;
  while (url && page < maxPages) {
    page += 1;
    const { status, json } = await oshGet(fetchImpl, url, { headers });
    if (status < 200 || status >= 300) {
      const error = new Error(`OSH page HTTP ${status}`);
      error.status = status;
      throw error;
    }
    for (const item of listOf(json)) items.push(item);
    const links = Array.isArray(json?.links) ? json.links : [];
    const next = links.find(
      (link) => link && link.rel === 'next' && typeof link.href === 'string',
    );
    if (!next) {
      url = null;
      break;
    }
    let candidate;
    try {
      candidate = new URL(next.href, url);
    } catch {
      url = null;
      break;
    }
    const nextUrl = buildNextPageUrl(candidate, root, url);
    if (!nextUrl) {
      url = null;
      break;
    }
    url = nextUrl;
    if (page >= maxPages) truncated = true;
  }
  return { items, truncated };
}
