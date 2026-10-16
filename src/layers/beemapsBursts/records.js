/** Read the answers of the burst routes. A value that is not valid gives null. */

const QUOTE_ID = /^[0-9a-f]{32}$/;
const MAX_EXPIRY_SECONDS = 600;

const whole = (value) => Number.isInteger(value) && value >= 0;
const text = (value) => typeof value === 'string' && value !== '';
const textOrNull = (value) => value === null || typeof value === 'string';
const numberOrNull = (value) => value === null || Number.isFinite(value);
const box = (value) =>
  Array.isArray(value) &&
  value.length === 4 &&
  value.every((number) => Number.isFinite(number));

/**
 * @param {unknown} payload - Parsed answer of the route /api/beemaps/burst/quote.
 * @returns {{quoteId:string, expiresInSeconds:number, bbox:number[], areaKm2:number, credits:number, budget:{used:number, limit:number, remaining:number}}|null}
 */
export function normalizeQuote(payload) {
  const { quoteId, expiresInSeconds, request, budget } = payload ?? {};
  if (
    typeof quoteId !== 'string' ||
    !QUOTE_ID.test(quoteId) ||
    !Number.isInteger(expiresInSeconds) ||
    expiresInSeconds < 1 ||
    expiresInSeconds > MAX_EXPIRY_SECONDS ||
    !box(request?.bbox) ||
    !(request.areaKm2 > 0) ||
    !Number.isFinite(request.areaKm2) ||
    !Number.isInteger(request.credits) ||
    request.credits < 1 ||
    !whole(budget?.used) ||
    !whole(budget?.limit) ||
    !whole(budget?.remaining)
  ) {
    return null;
  }
  return {
    quoteId,
    expiresInSeconds,
    bbox: [...request.bbox],
    areaKm2: request.areaKm2,
    credits: request.credits,
    budget: {
      used: budget.used,
      limit: budget.limit,
      remaining: budget.remaining,
    },
  };
}

/**
 * @param {unknown} payload - Parsed answer of the route /api/beemaps/burst/confirm with the status 200.
 * @returns {{replayed:boolean, burst:{id:string, status:string|null, validUntil:string|null, credits:number|null}, creditsRemaining:number|null}|null}
 */
export function normalizeCreated(payload) {
  const burst = payload?.burst;
  if (
    payload?.ok !== true ||
    payload.outcome !== 'created' ||
    !text(burst?.id) ||
    !textOrNull(burst.status) ||
    !textOrNull(burst.validUntil) ||
    !numberOrNull(burst.credits)
  ) {
    return null;
  }
  return {
    replayed: payload.replayed === true,
    burst: {
      id: burst.id,
      status: burst.status,
      validUntil: burst.validUntil,
      credits: burst.credits,
    },
    creditsRemaining: whole(payload.creditsRemaining)
      ? payload.creditsRemaining
      : null,
  };
}

function readBurst(item) {
  if (
    !text(item?.id) ||
    typeof item.isHit !== 'boolean' ||
    !textOrNull(item.status) ||
    !numberOrNull(item.credits) ||
    (item.bbox !== null && !box(item.bbox))
  ) {
    return null;
  }
  return {
    id: item.id,
    status: item.status,
    isHit: item.isHit,
    credits: item.credits,
    bbox: item.bbox === null ? null : [...item.bbox],
  };
}

/**
 * @param {unknown} payload - Parsed answer of the route /api/beemaps/burst/list.
 * @returns {{bursts:object[], total:number, cached:boolean}|null}
 */
export function normalizeList(payload) {
  if (
    !Array.isArray(payload?.bursts) ||
    !whole(payload.total) ||
    typeof payload.cached !== 'boolean'
  ) {
    return null;
  }
  return {
    bursts: payload.bursts.map(readBurst).filter((burst) => burst !== null),
    total: payload.total,
    cached: payload.cached,
  };
}
