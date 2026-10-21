import { readResponseTextCapped } from '../common/http.js';
import { isSearchId } from './normalize.js';

/** The two requests that this provider sends to SkyWatch: the archive search and its results. */

export const SEARCH_URL = 'https://api.skywatch.co/earthcache/archive/search';
export const RESULTS_PATH_END = '/search_results?per_page=50';
export const UPSTREAM_TIMEOUT_MS = 15_000;
export const MAX_UPSTREAM_BYTES = 4 * 1024 * 1024;
export const POLL_WAIT_MS = 2000;
export const MAX_POLLS = 10;
const DEFAULT_RETRY_AFTER_S = 60;
const MAX_RETRY_AFTER_S = 600;

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

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
 * Send one upstream request with a time limit that also covers the body. The
 * body is read only for an answer 200.
 * @returns {Promise<{ok:true, value:unknown}|{ok:false, kind:string, retryAfter?:number}|{ok:false, pending:true}>}
 */
async function send({ fetchImpl, url, init, setTimer, clearTimer, pendingOk }) {
  const controller = new AbortController();
  const timer = setTimer(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let outcome;
  try {
    const response = await fetchImpl(url, {
      ...init,
      redirect: 'error',
      signal: controller.signal,
    });
    if (response.status === 200) {
      outcome = await readJson(response, controller.signal);
    } else if (pendingOk && response.status === 202) {
      outcome = { ok: false, pending: true };
    } else {
      outcome = failureOf(response);
    }
  } catch {
    outcome = { ok: false, kind: 'upstream_failed' };
  } finally {
    clearTimer(timer);
  }
  return outcome;
}

const headersOf = (key) => ({
  'x-api-key': key,
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

/**
 * Run one archive search: start it, then read its results until the answer is
 * not 202, with at most ten result requests.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {string} options.key - Trimmed key.
 * @param {number[]} options.bbox - West, south, east, north.
 * @param {string} options.start - YYYY-MM-DD.
 * @param {string} options.end - YYYY-MM-DD.
 * @param {(fn: () => void, ms: number) => unknown} options.setTimer
 * @param {(timer: unknown) => void} options.clearTimer
 * @param {(ms: number) => Promise<void>} options.wait
 * @returns {Promise<{ok:true, document:{data:unknown[]}, polls:number}|{ok:false, kind:string, retryAfter?:number, polls:number}>}
 */
export async function runSearch({
  fetchImpl,
  key,
  bbox,
  start,
  end,
  setTimer,
  clearTimer,
  wait,
}) {
  const [west, south, east, north] = bbox;
  const headers = headersOf(key);
  const started = await send({
    fetchImpl,
    url: SEARCH_URL,
    init: {
      method: 'POST',
      headers,
      body: JSON.stringify({
        location: {
          type: 'Polygon',
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        },
        start_date: start,
        end_date: end,
        order_by: '-date',
      }),
    },
    setTimer,
    clearTimer,
    pendingOk: false,
  });
  if (!started.ok) return { ...started, polls: 0 };
  const id =
    isObject(started.value) && isObject(started.value.data)
      ? started.value.data.id
      : undefined;
  if (!isSearchId(id)) return { ok: false, kind: 'bad_upstream', polls: 0 };

  const url = `${SEARCH_URL}/${id}${RESULTS_PATH_END}`;
  let polls = 0;
  while (polls < MAX_POLLS) {
    if (polls > 0) await wait(POLL_WAIT_MS);
    polls += 1;
    const answer = await send({
      fetchImpl,
      url,
      init: { method: 'GET', headers },
      setTimer,
      clearTimer,
      pendingOk: true,
    });
    if (answer.pending) continue;
    if (!answer.ok) return { ...answer, polls };
    if (!isObject(answer.value) || !Array.isArray(answer.value.data)) {
      return { ok: false, kind: 'bad_upstream', polls };
    }
    return { ok: true, document: answer.value, polls };
  }
  return { ok: false, kind: 'search_timeout', polls };
}
