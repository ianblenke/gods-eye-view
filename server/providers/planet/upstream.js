import { readResponseTextCapped } from '../common/http.js';
import { ITEM_TYPES } from './normalize.js';

/** The search requests that this provider sends to Planet: one quick search for each item type. */

export const SEARCH_URL =
  'https://api.planet.com/data/v1/quick-search?_page_size=25&_sort=acquired%20desc';
export const UPSTREAM_TIMEOUT_MS = 15_000;
export const MAX_UPSTREAM_BYTES = 4 * 1024 * 1024;
const DAY_MS = 86_400_000;
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
 * Send one search request with a time limit that also covers the body. The
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

/** The calendar date after a date YYYY-MM-DD. */
const dayAfter = (date) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + DAY_MS).toISOString().slice(0, 10);

/** The JSON text of the body of the search for one item type. */
function searchBody(type, [west, south, east, north], start, end) {
  return JSON.stringify({
    item_types: [type],
    filter: {
      type: 'AndFilter',
      config: [
        {
          type: 'GeometryFilter',
          field_name: 'geometry',
          config: {
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
        },
        {
          type: 'DateRangeFilter',
          field_name: 'acquired',
          config: {
            gte: `${start}T00:00:00Z`,
            lt: `${dayAfter(end)}T00:00:00Z`,
          },
        },
        {
          type: 'StringInFilter',
          field_name: 'quality_category',
          config: ['standard'],
        },
      ],
    },
  });
}

/**
 * Run the two search requests: `PSScene`, then `SkySatCollect` after a valid
 * first page. The first failure ends the run.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {string} options.key - Trimmed key.
 * @param {number[]} options.bbox - West, south, east, north.
 * @param {string} options.start - YYYY-MM-DD.
 * @param {string} options.end - YYYY-MM-DD.
 * @param {(fn: () => void, ms: number) => unknown} options.setTimer
 * @param {(timer: unknown) => void} options.clearTimer
 * @returns {Promise<{ok:true, pages:{type:string, page:object}[], requests:number}|{ok:false, kind:string, retryAfter?:number, requests:number}>}
 */
export async function runSearches({
  fetchImpl,
  key,
  bbox,
  start,
  end,
  setTimer,
  clearTimer,
}) {
  const headers = {
    Authorization: `api-key ${key}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const pages = [];
  for (const type of ITEM_TYPES) {
    const requests = pages.length + 1;
    const answer = await send({
      fetchImpl,
      init: {
        method: 'POST',
        headers,
        body: searchBody(type, bbox, start, end),
      },
      setTimer,
      clearTimer,
    });
    if (!answer.ok) return { ...answer, requests };
    if (!isObject(answer.value) || !Array.isArray(answer.value.features)) {
      return { ok: false, kind: 'bad_upstream', requests };
    }
    pages.push({ type, page: answer.value });
  }
  return { ok: true, pages, requests: pages.length };
}
