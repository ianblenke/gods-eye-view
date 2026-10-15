import { readResponseTextCapped } from '../common/http.js';

/**
 * The two upstream requests of the burst routes: the create call and the list
 * call. Each sends one request, never follows a redirect and never retries. The
 * result of a create call is "created", "refused" or "unknown". Only the status
 * 200 with one clear burst means "created". Only the statuses 400, 401, 402, 403
 * and 429 mean "refused". Everything else means that Bee Maps can have created
 * the burst.
 */

export const CREATE_URL = 'https://beemaps.com/api/developer/burst/create';
export const LIST_URL = 'https://beemaps.com/api/developer/bursts';
export const CREATE_TIMEOUT_MS = 30_000;
export const LIST_TIMEOUT_MS = 20_000;
export const MAX_BODY_BYTES = 1024 * 1024;
const LIST_LIMIT = 100;
const DEFAULT_RETRY_AFTER_S = 60;
const MAX_RETRY_AFTER_S = 600;
const BURST_STATUSES = new Set(['active', 'expired', 'refunded']);
const REFUSALS = {
  400: { status: 400, error: 'bad_request' },
  401: { status: 403, error: 'key_rejected' },
  403: { status: 403, error: 'key_rejected' },
  402: { status: 402, error: 'no_credit' },
  429: { status: 429, error: 'upstream_rate_limit' },
};

/** Seconds from a Retry-After header: digits only, 1 or more, 600 at most, else 60. */
export function retryAfterOf(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) return DEFAULT_RETRY_AFTER_S;
  return Math.min(Number(value), MAX_RETRY_AFTER_S);
}

const number = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;
const text = (value) => (typeof value === 'string' ? value : null);
const dropBody = (response) => {
  void response.body?.cancel().catch(() => {});
};

/** Read and parse the body of an answer. Null when it fails, is too large or is not JSON. */
async function readDocument(response, signal) {
  try {
    return {
      document: JSON.parse(
        await readResponseTextCapped(response, MAX_BODY_BYTES, signal),
      ),
    };
  } catch {
    return null;
  }
}

/**
 * Ask Bee Maps for one burst.
 *
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {string} options.key - Trimmed key.
 * @param {number[]} options.bbox - West, south, east, north.
 * @param {number} options.credits
 * @param {(fn: () => void, ms: number) => unknown} options.setTimer
 * @param {(timer: unknown) => void} options.clearTimer
 * @returns {Promise<object>}
 */
export async function createBurst({
  fetchImpl,
  key,
  bbox,
  credits,
  setTimer,
  clearTimer,
}) {
  const [west, south, east, north] = bbox;
  const ring = [
    [west, south],
    [east, south],
    [east, north],
    [west, north],
    [west, south],
  ];
  const controller = new AbortController();
  const timer = setTimer(() => controller.abort(), CREATE_TIMEOUT_MS);
  try {
    let response;
    try {
      response = await fetchImpl(CREATE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${key}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify([
          { geojson: { type: 'Polygon', coordinates: [ring] }, credits },
        ]),
        redirect: 'error',
        signal: controller.signal,
      });
    } catch {
      return { kind: 'unknown', upstreamStatus: null };
    }
    const code = response.status;
    if (Object.hasOwn(REFUSALS, code)) {
      dropBody(response);
      return {
        kind: 'refused',
        upstreamStatus: code,
        ...REFUSALS[code],
        ...(code === 429
          ? { retryAfter: retryAfterOf(response.headers.get('retry-after')) }
          : {}),
      };
    }
    if (code !== 200) {
      dropBody(response);
      return { kind: 'unknown', upstreamStatus: code };
    }
    const read = await readDocument(response, controller.signal);
    const document = read?.document;
    const burst = document?.bursts?.[0];
    if (
      document?.success !== true ||
      !Array.isArray(document.bursts) ||
      document.bursts.length !== 1 ||
      burst === null ||
      typeof burst !== 'object' ||
      typeof burst._id !== 'string' ||
      burst._id === ''
    ) {
      return { kind: 'unknown', upstreamStatus: 200 };
    }
    const remaining = document.creditsRemaining;
    return {
      kind: 'created',
      upstreamStatus: 200,
      burst: {
        id: burst._id,
        status: BURST_STATUSES.has(burst.status) ? burst.status : null,
        validUntil: text(burst.validUntil),
        credits: number(burst.credits),
      },
      creditsRemaining:
        Number.isInteger(remaining) && remaining >= 0 ? remaining : null,
    };
  } finally {
    clearTimer(timer);
  }
}

const round6 = (value) => Number(value.toFixed(6));

/** West, south, east and north of the outer ring of a polygon, or null. */
function bboxOf(geojson) {
  const ring = geojson?.coordinates?.[0];
  if (
    !Array.isArray(ring) ||
    ring.length < 4 ||
    !ring.every(
      (position) =>
        Array.isArray(position) &&
        position.length >= 2 &&
        number(position[0]) !== null &&
        number(position[1]) !== null,
    )
  ) {
    return null;
  }
  const lons = ring.map((position) => position[0]);
  const lats = ring.map((position) => position[1]);
  return [
    round6(Math.min(...lons)),
    round6(Math.min(...lats)),
    round6(Math.max(...lons)),
    round6(Math.max(...lats)),
  ];
}

/** The fields of one listed burst, or null when the item has no text _id. */
function listedBurst(item) {
  if (
    item === null ||
    typeof item !== 'object' ||
    typeof item._id !== 'string' ||
    item._id === ''
  ) {
    return null;
  }
  return {
    id: item._id,
    status: BURST_STATUSES.has(item.status) ? item.status : null,
    isHit: item.isHit === true,
    latestHitAt: text(item.latestHitAt),
    validUntil: text(item.validUntil),
    credits: number(item.credits),
    bbox: bboxOf(item.geojson),
  };
}

/**
 * Ask Bee Maps for the list of the bursts of the key, always with limit 100.
 *
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {string} options.key - Trimmed key.
 * @param {(fn: () => void, ms: number) => unknown} options.setTimer
 * @param {(timer: unknown) => void} options.clearTimer
 * @returns {Promise<{ok:true, bursts:object[], total:number}|{ok:false, error:string}>}
 */
export async function listBursts({ fetchImpl, key, setTimer, clearTimer }) {
  const controller = new AbortController();
  const timer = setTimer(() => controller.abort(), LIST_TIMEOUT_MS);
  try {
    let response;
    try {
      response = await fetchImpl(`${LIST_URL}?limit=${LIST_LIMIT}`, {
        method: 'GET',
        headers: { Authorization: `Basic ${key}`, Accept: 'application/json' },
        redirect: 'error',
        signal: controller.signal,
      });
    } catch {
      return { ok: false, error: 'upstream_failed' };
    }
    if (response.status === 401 || response.status === 403) {
      dropBody(response);
      return { ok: false, error: 'key_rejected' };
    }
    if (response.status !== 200) {
      dropBody(response);
      return { ok: false, error: 'upstream_failed' };
    }
    const read = await readDocument(response, controller.signal);
    if (!Array.isArray(read?.document?.bursts)) {
      return { ok: false, error: 'upstream_failed' };
    }
    const bursts = read.document.bursts
      .map(listedBurst)
      .filter((burst) => burst !== null)
      .slice(0, LIST_LIMIT);
    const { total } = read.document;
    return {
      ok: true,
      bursts,
      total: Number.isInteger(total) && total >= 0 ? total : bursts.length,
    };
  } finally {
    clearTimer(timer);
  }
}
