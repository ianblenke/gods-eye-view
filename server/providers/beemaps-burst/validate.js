/**
 * Input rules of the Bee Maps burst routes: the settings from the environment,
 * the reading of a request body, and the check of each body. Every check runs
 * before anything is spent or sent.
 */

const MIN_CREDITS = 125;
const DEFAULT_DAILY_CREDITS = 625;
const MAX_LATITUDE = 80;
const MIN_AREA_KM2 = 0.1;
const MAX_AREA_KM2 = 5;
const EARTH_RADIUS_M = 6371008.8;
const DEFAULT_LIST_LIMIT = 20;
const MAX_LIST_LIMIT = 100;
const QUOTE_ID = /^[0-9a-f]{32}$/;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9_-]{16,64}$/;

export const QUOTE_BODY_MAX = 4096;
export const CONFIRM_BODY_MAX = 1024;
export const LIST_BODY_MAX = 1024;

const digits = (text) => (/^\d+$/.test(text) ? Number(text) : 0);
const refusal = (error, extra = {}) => ({
  ok: false,
  status: 400,
  payload: { error, ...extra },
});

/**
 * The settings of the routes.
 *
 * @param {Record<string, string|undefined>} env
 * @returns {{enabled:boolean, key:string, configured:boolean, minCredits:number, maxCredits:number, dailyCredits:number}}
 */
export function readConfig(env) {
  const key = (env.BEEMAPS_BURST_API_KEY ?? '').trim();
  const daily = digits(env.BEEMAPS_BURST_DAILY_CREDITS);
  return {
    enabled: env.BEEMAPS_BURST_ENABLED === 'true',
    key,
    configured: key !== '',
    minCredits: MIN_CREDITS,
    maxCredits: Math.max(digits(env.BEEMAPS_BURST_MAX_CREDITS), MIN_CREDITS),
    dailyCredits: daily >= 1 ? daily : DEFAULT_DAILY_CREDITS,
  };
}

/**
 * The text of a request body, or null when it is larger than the limit or
 * fails while it is read.
 *
 * @param {AsyncIterable<Buffer|string>} req
 * @param {number} maxBytes
 * @returns {Promise<string|null>}
 */
export async function readBodyText(req, maxBytes) {
  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      size += buffer.length;
      if (size > maxBytes) return null;
      chunks.push(buffer);
    }
  } catch {
    return null;
  }
  return Buffer.concat(chunks).toString('utf8');
}

function parseObject(text) {
  try {
    const value = JSON.parse(text);
    return typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

const radians = (degrees) => (degrees * Math.PI) / 180;
const round6 = (value) => Number(value.toFixed(6));
const round3 = (value) => Number(value.toFixed(3));

function areaKm2Of([west, south, east, north]) {
  return (
    (EARTH_RADIUS_M *
      EARTH_RADIUS_M *
      radians(east - west) *
      (Math.sin(radians(north)) - Math.sin(radians(south)))) /
    1e6
  );
}

function checkBox(bbox) {
  if (
    !Array.isArray(bbox) ||
    bbox.length !== 4 ||
    !bbox.every((value) => typeof value === 'number' && Number.isFinite(value))
  ) {
    return refusal('bad_area');
  }
  const [west, south, east, north] = bbox.map(round6);
  if (
    west < -180 ||
    east > 180 ||
    south < -MAX_LATITUDE ||
    north > MAX_LATITUDE ||
    west >= east
  ) {
    return refusal('bad_area');
  }
  const rounded = [west, south, east, north];
  const area = round3(areaKm2Of(rounded));
  if (area < MIN_AREA_KM2) return refusal('bad_area');
  if (area > MAX_AREA_KM2) {
    return refusal('area_too_large', { maxKm2: MAX_AREA_KM2 });
  }
  return { ok: true, bbox: rounded, areaKm2: area };
}

/**
 * Check the body of a quote request.
 *
 * @param {string} text
 * @param {{maxCredits:number}} config
 * @returns {{ok:true, request:{bbox:number[], areaKm2:number, credits:number}}|{ok:false, status:number, payload:object}}
 */
export function validateQuote(text, config) {
  const body = parseObject(text);
  if (body === null) return refusal('bad_body');
  for (const name of Object.keys(body)) {
    if (name !== 'bbox' && name !== 'credits') return refusal('bad_body');
  }
  const box = checkBox(body.bbox);
  if (!box.ok) return box;
  const credits = Object.hasOwn(body, 'credits') ? body.credits : MIN_CREDITS;
  if (
    !Number.isInteger(credits) ||
    credits < MIN_CREDITS ||
    credits > config.maxCredits
  ) {
    return refusal('bad_credits');
  }
  return {
    ok: true,
    request: { bbox: box.bbox, areaKm2: box.areaKm2, credits },
  };
}

/**
 * Check the body of a confirm request.
 *
 * @param {string} text
 * @returns {{ok:true, quoteId:string, idempotencyKey:string}|{ok:false, status:number, payload:object}}
 */
export function validateConfirm(text) {
  const body = parseObject(text);
  if (
    body === null ||
    Object.keys(body).length > 2 ||
    typeof body.quoteId !== 'string' ||
    !QUOTE_ID.test(body.quoteId) ||
    typeof body.idempotencyKey !== 'string' ||
    !IDEMPOTENCY_KEY.test(body.idempotencyKey)
  ) {
    return refusal('bad_body');
  }
  return {
    ok: true,
    quoteId: body.quoteId,
    idempotencyKey: body.idempotencyKey,
  };
}

/**
 * Check the body of a list request.
 *
 * @param {string} text
 * @returns {{ok:true, limit:number}|{ok:false, status:number, payload:object}}
 */
export function validateList(text) {
  const body = parseObject(text);
  if (body === null) return refusal('bad_body');
  for (const name of Object.keys(body)) {
    if (name !== 'limit') return refusal('bad_body');
  }
  if (!Object.hasOwn(body, 'limit')) {
    return { ok: true, limit: DEFAULT_LIST_LIMIT };
  }
  const { limit } = body;
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIST_LIMIT) {
    return refusal('bad_body');
  }
  return { ok: true, limit };
}
