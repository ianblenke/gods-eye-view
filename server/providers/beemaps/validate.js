/** Checks of a Bee Maps frames request. Nothing in this file sends a request. */

export const MAX_BODY_BYTES = 8192;
export const MAX_AREA_KM2 = 5;
const EARTH_RADIUS_M = 6371008.8;
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;
const FIRST_DAY = '2020-01-01';
const FIELDS = new Set(['bbox', 'polygon', 'since', 'limit']);

const radians = (degrees) => (degrees * Math.PI) / 180;

/** Read the request body as text. Returns null when it has more bytes than the cap or fails. */
export async function readBodyText(req) {
  const chunks = [];
  let total = 0;
  try {
    for await (const chunk of req) {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) return null;
      chunks.push(chunk);
    }
  } catch {
    return null;
  }
  return Buffer.concat(chunks).toString('utf8');
}

const refuse = (error, extra = {}) => ({
  ok: false,
  status: 400,
  payload: { error, ...extra },
});

function validPosition(position) {
  return (
    Array.isArray(position) &&
    position.length === 2 &&
    Number.isFinite(position[0]) &&
    Math.abs(position[0]) <= 180 &&
    Number.isFinite(position[1]) &&
    Math.abs(position[1]) <= 90
  );
}

function ringOfBox(bbox) {
  if (!Array.isArray(bbox) || bbox.length !== 4) return null;
  const [west, south, east, north] = bbox;
  const corners = [
    [west, south],
    [east, south],
    [east, north],
    [west, north],
  ];
  if (!corners.every(validPosition)) return null;
  if (west >= east || south >= north) return null;
  return [...corners, corners[0]];
}

function ringOfPolygon(polygon) {
  if (polygon?.type !== 'Polygon') return null;
  const rings = polygon.coordinates;
  if (!Array.isArray(rings) || rings.length !== 1) return null;
  const ring = rings[0];
  if (!Array.isArray(ring) || ring.length < 4 || ring.length > 101) {
    return null;
  }
  if (!ring.every(validPosition)) return null;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return null;
  return ring;
}

/** Area in km² of the smallest longitude and latitude box that holds the ring, on a sphere. */
export function boxAreaKm2(ring) {
  const lons = ring.map((position) => position[0]);
  const lats = ring.map((position) => position[1]);
  const width = radians(Math.max(...lons) - Math.min(...lons));
  const band =
    Math.sin(radians(Math.max(...lats))) - Math.sin(radians(Math.min(...lats)));
  return (EARTH_RADIUS_M ** 2 * width * band) / 1e6;
}

function isRealDay(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return false;
  }
  const [year, month, day] = text.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * Check the request body in the order of the spec: body, area, date, limit.
 * @param {string} text - Body text.
 * @param {number} nowMs - Current time in milliseconds.
 * @returns {{ok:true, ring:number[][], since:string|null, limit:number}|{ok:false, status:number, payload:object}}
 */
export function validateRequest(text, nowMs) {
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return refuse('bad_body');
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return refuse('bad_body');
  }
  if (Object.keys(body).some((key) => !FIELDS.has(key))) {
    return refuse('bad_body');
  }
  const hasBox = Object.hasOwn(body, 'bbox');
  if (hasBox === Object.hasOwn(body, 'polygon')) return refuse('bad_area');
  const ring = hasBox ? ringOfBox(body.bbox) : ringOfPolygon(body.polygon);
  if (ring === null) return refuse('bad_area');
  if (boxAreaKm2(ring) > MAX_AREA_KM2) {
    return refuse('area_too_large', { maxKm2: MAX_AREA_KM2 });
  }
  let since = null;
  if (Object.hasOwn(body, 'since')) {
    since = body.since;
    const today = new Date(nowMs).toISOString().slice(0, 10);
    if (!isRealDay(since) || since < FIRST_DAY || since > today) {
      return refuse('bad_since');
    }
  }
  let limit = DEFAULT_LIMIT;
  if (Object.hasOwn(body, 'limit')) {
    limit = body.limit;
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      return refuse('bad_limit');
    }
  }
  return { ok: true, ring, since, limit };
}
