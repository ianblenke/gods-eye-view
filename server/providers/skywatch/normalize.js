/** The fields of the scenes that the route gives. Nothing in this file sends a request. */

export const MAX_SCENES = 50;
const MAX_TEXT = 120;
const MIN_RING = 4;
const MAX_RING = 2000;
const SEARCH_ID = /^[A-Za-z0-9_-]{1,128}$/;
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/g;

/** True for a search id or a scene id of 1 to 128 ASCII letters, digits, hyphens or underscores. */
export const isSearchId = (value) =>
  typeof value === 'string' && SEARCH_ID.test(value);

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** A finite number from `min` to `max`, else null. */
const numberIn = (value, min, max) =>
  typeof value === 'number' &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max
    ? value
    : null;

/** The ISO text of a valid time, else null. */
function timeOf(value) {
  if (typeof value !== 'string') return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

/** Text without control characters and end spaces, cut to 120 code points; null when none stays. */
function textOf(value) {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(CONTROL, '').trim();
  const kept = Array.from(cleaned).slice(0, MAX_TEXT).join('');
  return kept === '' ? null : kept;
}

function thumbnailOf(value) {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function positionOf(position) {
  if (!Array.isArray(position)) return null;
  if (position.length < 2 || position.length > 3) return null;
  const [lon, lat] = position;
  if (!position.every((value) => typeof value === 'number')) return null;
  if (numberIn(lon, -180, 180) === null || numberIn(lat, -90, 90) === null) {
    return null;
  }
  return [lon, lat];
}

/** The footprint of a polygon with exactly one closed ring of 4 to 2000 positions, else null. */
function footprintOf(location) {
  if (!isObject(location) || location.type !== 'Polygon') return null;
  const rings = location.coordinates;
  if (!Array.isArray(rings) || rings.length !== 1) return null;
  const [ring] = rings;
  if (
    !Array.isArray(ring) ||
    ring.length < MIN_RING ||
    ring.length > MAX_RING
  ) {
    return null;
  }
  const positions = ring.map(positionOf);
  if (positions.includes(null)) return null;
  const first = positions[0];
  const last = positions[positions.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return null;
  return { type: 'Polygon', coordinates: [positions] };
}

function sceneOf(item) {
  if (!isObject(item) || !isSearchId(item.id)) return null;
  const start = timeOf(item.start_time);
  if (start === null) return null;
  const footprint = footprintOf(item.location);
  if (footprint === null) return null;
  return {
    id: item.id,
    start,
    end: timeOf(item.end_time),
    footprint,
    resolutionM: numberIn(item.resolution, 0, Infinity),
    provider: textOf(item.source),
    product: textOf(item.product_name),
    cloudPercent: numberIn(item.result_cloud_cover_percentage, 0, 100),
    coveragePercent: numberIn(item.location_coverage_percentage, 0, 100),
    areaKm2: numberIn(item.area_sq_km, 0, Infinity),
    pricePerKm2: numberIn(item.price_per_sq_km, 0, Infinity),
    cost: numberIn(item.cost, 0, Infinity),
    thumbnail: thumbnailOf(item.thumbnail_uri),
  };
}

const byNewestThenId = (a, b) => {
  if (a.start !== b.start) return a.start < b.start ? 1 : -1;
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
};

/**
 * The scenes of a results document whose `data` is an array.
 * @param {{data: unknown[], pagination?: unknown}} document
 * @returns {{scenes: object[], total: number, truncated: boolean}}
 */
export function normalizeScenes(document) {
  const rows = document.data;
  const kept = rows.map(sceneOf).filter((scene) => scene !== null);
  kept.sort(byNewestThenId);
  const upstreamTotal = isObject(document.pagination)
    ? document.pagination.total
    : undefined;
  const total =
    Number.isSafeInteger(upstreamTotal) && upstreamTotal >= rows.length
      ? upstreamTotal
      : rows.length;
  return {
    scenes: kept.slice(0, MAX_SCENES),
    total,
    truncated: total > rows.length || kept.length > MAX_SCENES,
  };
}
