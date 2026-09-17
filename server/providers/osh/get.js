import { readResponseJsonCapped } from '../common/http.js';

/**
 * The only fetch() call site of the OpenSensorHub provider. Every route,
 * the base-path probe and the page walk call oshGet(). It sends one GET
 * request with no body, never follows a redirect, and caps the response
 * body and the request time.
 */

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
 * @param {URL} candidate
 * @param {URL} root
 * @param {URL} current
 * @returns {?URL}
 */
export function buildNextPageUrl(candidate, root, current) {
  if (!isSamePageWalk(candidate, root, current)) return null;
  const query = new URLSearchParams();
  for (const [key, value] of candidate.searchParams) query.append(key, value);
  const next = new URL(current.pathname, root);
  next.search = query.toString();
  return next;
}

/**
 * Walk a `links[].rel === 'next'` chain from a list payload, following a
 * link only when the link names a later page of the same request (see
 * `buildNextPageUrl`), and stopping after 20 pages. A link that fails that
 * check, or an unparsable `href`, stops the walk — it is not an error, so
 * the function still gives the items it collected.
 * @param {typeof fetch} fetchImpl
 * @param {URL} root - Resolved API root (the origin every page must share).
 * @param {URL} firstUrl - URL of the first page.
 * @param {object} options
 * @param {Record<string,string>} [options.headers]
 * @param {(payload:*) => any[]} options.listOf - Reads the item array of a page.
 * @returns {Promise<any[]>}
 */
export async function oshPages(fetchImpl, root, firstUrl, { headers = {}, listOf }) {
  const items = [];
  let url = firstUrl;
  let page = 0;
  while (url && page < 20) {
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
    if (!next) break;
    let candidate;
    try {
      candidate = new URL(next.href, url);
    } catch {
      break;
    }
    const nextUrl = buildNextPageUrl(candidate, root, url);
    if (!nextUrl) break;
    url = nextUrl;
  }
  return items;
}
