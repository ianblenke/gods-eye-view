import { readResponseTextCapped } from '../common/http.js';

/** The search request that this provider sends to SkyFi: one archive search. */

export const SEARCH_URL = 'https://app.skyfi.com/platform-api/archives';
export const UPSTREAM_TIMEOUT_MS = 15_000;
export const MAX_UPSTREAM_BYTES = 4 * 1024 * 1024;
const PAGE_SIZE = 50;
const DEFAULT_RETRY_AFTER_S = 60;
const MAX_RETRY_AFTER_S = 600;

/** Seconds from a Retry-After header: digits only, 1 to 600, else 60. */
function retryAfterOf(value) {
  if (!/^\d+$/.test(value ?? '') || Number(value) < 1) {
    return DEFAULT_RETRY_AFTER_S;
  }
  return Math.min(Number(value), MAX_RETRY_AFTER_S);
}

function failureOf(response) {
  switch (response.status) {
    case 401:
    case 403:
      return { ok: false, kind: 'key_rejected' };
    case 429:
      return {
        ok: false,
        kind: 'upstream_rate_limit',
        retryAfter: retryAfterOf(response.headers.get('retry-after')),
      };
    default:
      return { ok: false, kind: 'upstream_failed' };
  }
}

async function readJson(response, signal) {
  let text;
  try {
    text = await readResponseTextCapped(response, MAX_UPSTREAM_BYTES, signal);
  } catch (error) {
    return {
      ok: false,
      kind:
        error?.code === 'RESPONSE_TOO_LARGE'
          ? 'bad_upstream'
          : 'upstream_failed',
    };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, kind: 'bad_upstream' };
  }
}

/**
 * Send the search request with a time limit that also covers the body. The
 * body is read only for an answer 200.
 */
async function send({ fetchImpl, init, setTimer, clearTimer }) {
  const controller = new AbortController();
  const timer = setTimer(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let outcome;
  try {
    const response = await fetchImpl(SEARCH_URL, {
      ...init,
      redirect: 'error',
      signal: controller.signal,
    });
    outcome =
      response.status === 200
        ? await readJson(response, controller.signal)
        : failureOf(response);
  } catch {
    outcome = { ok: false, kind: 'upstream_failed' };
  } finally {
    clearTimer(timer);
  }
  return outcome;
}

/** The text of a number with 6 digits after the decimal point, never with an exponent. */
const coordinate = (value) => value.toFixed(6);

/** The JSON text of the body of the search. */
function searchBody([west, south, east, north], start, end) {
  const position = (lon, lat) => `${coordinate(lon)} ${coordinate(lat)}`;
  const positions = [
    position(west, south),
    position(east, south),
    position(east, north),
    position(west, north),
    position(west, south),
  ];
  return JSON.stringify({
    aoi: `POLYGON ((${positions.join(', ')}))`,
    fromDate: `${start}T00:00:00+00:00`,
    toDate: `${end}T23:59:59+00:00`,
    pageSize: PAGE_SIZE,
  });
}

/**
 * Run the one search request. The key goes only with this request.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {string} options.key - Trimmed key.
 * @param {number[]} options.bbox - West, south, east, north.
 * @param {string} options.start - YYYY-MM-DD.
 * @param {string} options.end - YYYY-MM-DD.
 * @param {(fn: () => void, ms: number) => unknown} options.setTimer
 * @param {(timer: unknown) => void} options.clearTimer
 * @returns {Promise<{ok:true, page:object, requests:1}|{ok:false, kind:string, retryAfter?:number, requests:1}>}
 */
export async function runSearch({
  fetchImpl,
  key,
  bbox,
  start,
  end,
  setTimer,
  clearTimer,
}) {
  const answer = await send({
    fetchImpl,
    init: {
      method: 'POST',
      headers: {
        'X-Skyfi-Api-Key': key,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: searchBody(bbox, start, end),
    },
    setTimer,
    clearTimer,
  });
  if (!answer.ok) return { ...answer, requests: 1 };
  if (!Array.isArray(answer.value?.archives)) {
    return { ok: false, kind: 'bad_upstream', requests: 1 };
  }
  return { ok: true, page: answer.value, requests: 1 };
}
