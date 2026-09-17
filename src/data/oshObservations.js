/**
 * Pure helpers for one OpenSensorHub observation. Shared the same way as
 * src/data/oshSystems.js: the server provider applies them before it caches
 * a result, so a cached or served payload always holds trimmed rows.
 */

const MAX_DEPTH = 4;
const MAX_ROWS = 64;
const TRUNCATED_ROW = Object.freeze({ path: '…', value: '…' });

/**
 * Flatten a SWE Common result record to path/value rows. A primitive value
 * becomes one row. An object walks into dotted paths, and an array walks
 * into index paths. A value past the depth cap becomes the string
 * "[object]". A result with more than 64 rows keeps 63 and ends with one
 * marker row.
 * @param {*} result
 * @returns {Array<{path:string, value:*}>}
 */
export function flattenOshResult(result) {
  if (result === null || result === undefined) return [];
  const leaves = [];
  const visit = (value, path, depth) => {
    if (value === null || typeof value !== 'object') {
      leaves.push({ path, value });
      return;
    }
    if (depth >= MAX_DEPTH) {
      leaves.push({ path, value: '[object]' });
      return;
    }
    const isArray = Array.isArray(value);
    const keys = isArray ? value.map((_, index) => index) : Object.keys(value);
    if (keys.length === 0) {
      leaves.push({ path, value: isArray ? [] : {} });
      return;
    }
    for (const key of keys) {
      visit(value[key], path ? `${path}.${key}` : String(key), depth + 1);
    }
  };
  if (typeof result !== 'object') {
    leaves.push({ path: '', value: result });
  } else {
    visit(result, '', 0);
  }
  if (leaves.length <= MAX_ROWS) return leaves;
  return [...leaves.slice(0, MAX_ROWS - 1), TRUNCATED_ROW];
}

function findCoordinateKeys(object) {
  let latKey = null;
  let lonKey = null;
  for (const key of Object.keys(object)) {
    const lower = key.toLowerCase();
    if (lower === 'lat' || lower === 'latitude') latKey = key;
    if (lower === 'lon' || lower === 'longitude') lonKey = key;
  }
  return { latKey, lonKey };
}

function findAltitude(object) {
  for (const key of Object.keys(object)) {
    if (key.toLowerCase() === 'alt' || key.toLowerCase() === 'altitude') {
      const number = Number(object[key]);
      return Number.isFinite(number) ? number : null;
    }
  }
  return null;
}

function inRange(lat, lon) {
  return Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

function searchLocation(value, depth) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  if (depth >= MAX_DEPTH) return null;
  const { latKey, lonKey } = findCoordinateKeys(value);
  if (latKey && lonKey) {
    const lat = Number(value[latKey]);
    const lon = Number(value[lonKey]);
    if (Number.isFinite(lat) && Number.isFinite(lon) && inRange(lat, lon)) {
      return { lat, lon, alt: findAltitude(value) };
    }
  }
  for (const key of Object.keys(value)) {
    const found = searchLocation(value[key], depth + 1);
    if (found) return found;
  }
  return null;
}

function locationFromGeometry(result) {
  const coordinates = result?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const lon = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inRange(lat, lon)) return null;
  const alt = coordinates.length > 2 ? Number(coordinates[2]) : null;
  return { lat, lon, alt: Number.isFinite(alt) ? alt : null };
}

/**
 * Extract a location from a result record: an object with lat/lon (or
 * latitude/longitude) keys at any depth up to 4, case-insensitive, with an
 * optional alt. Falls back to `geometry.coordinates` as [lon, lat, alt?].
 * Returns null when the result carries no location, or one out of range.
 * @param {*} result
 * @returns {?{lat:number, lon:number, alt:?number}}
 */
export function extractOshLocation(result) {
  if (result === null || typeof result !== 'object') return null;
  const found = searchLocation(result, 0);
  if (found) return found;
  return locationFromGeometry(result);
}

/**
 * Build the response shape for one datastream's newest observation from the
 * upstream envelope `{items:[{phenomenonTime, resultTime, result}]}`. An
 * empty or malformed item list becomes null.
 * @param {*} payload
 * @returns {?{phenomenonTime:?string, resultTime:?string, rows:Array, location:*}}
 */
export function mapOshObservation(payload) {
  const items = Array.isArray(payload?.items) ? payload.items : null;
  if (!items || items.length === 0) return null;
  const first = items[0];
  if (!first || typeof first !== 'object') return null;
  const result = Object.hasOwn(first, 'result') ? first.result : null;
  return {
    phenomenonTime: typeof first.phenomenonTime === 'string' ? first.phenomenonTime : null,
    resultTime: typeof first.resultTime === 'string' ? first.resultTime : null,
    rows: flattenOshResult(result),
    location: extractOshLocation(result),
  };
}
