/**
 * Pure adapter for an OpenSensorHub system list. Shared by the server
 * provider (server/providers/osh.js), which applies it before it caches a
 * page walk, and by the browser layer, which places each record with
 * placeOshEntities() below.
 *
 * `mapOshSystems()` reads a GeoJSON `FeatureCollection` (`features`) or a
 * plain list (`items`). It keeps a record for every entry with a string id,
 * and keeps the first record of a repeated id, because one walk can serve a
 * system twice. An entry with no Point geometry, or with a coordinate that
 * is not finite, keeps a record with `lon`, `lat` and `alt` null: a host
 * system with no geometry still needs its name for the detail of every
 * feature it hosts. Every other field is optional, so a missing property
 * becomes null instead of a thrown error.
 */

function finiteNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function listOf(payload) {
  if (Array.isArray(payload?.features)) return payload.features;
  if (Array.isArray(payload?.items)) return payload.items;
  return null;
}

/** Read a Point geometry's coordinates as `{lon, lat, alt}`, all null when absent or not finite. */
function pointOf(geometry) {
  if (!geometry || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates))
    return { lon: null, lat: null, alt: null };
  const lon = finiteNumber(geometry.coordinates[0]);
  const lat = finiteNumber(geometry.coordinates[1]);
  if (lon === null || lat === null) return { lon: null, lat: null, alt: null };
  const alt = geometry.coordinates.length > 2 ? finiteNumber(geometry.coordinates[2]) : null;
  return { lon, lat, alt };
}

/**
 * Map a raw OpenSensorHub system list to trimmed records.
 * @param {*} payload - Upstream JSON body.
 * @returns {Array<{id:string, uid:?string, name:?string, description:?string, validTime:?Array, lon:?number, lat:?number, alt:?number}>}
 */
export function mapOshSystems(payload) {
  const list = listOf(payload);
  if (!list) return [];
  const records = [];
  const seen = new Set();
  for (const feature of list) {
    if (!feature || typeof feature !== 'object') continue;
    const id = typeof feature.id === 'string' && feature.id ? feature.id : null;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const { lon, lat, alt } = pointOf(feature.geometry);
    const properties =
      feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : {};
    records.push({
      id,
      uid: typeof properties.uid === 'string' ? properties.uid : null,
      name: typeof properties.name === 'string' ? properties.name : null,
      description:
        typeof properties.description === 'string' ? properties.description : null,
      validTime: Array.isArray(properties.validTime) ? properties.validTime : null,
      lon,
      lat,
      alt,
    });
  }
  return records;
}

/**
 * Merge the system records and the feature-of-interest records into the
 * entities the layer places, with no cross-placement: a feature never
 * places its host system, and a system never places a feature.
 * @param {{systems: Array, fois: Array}} lists
 * @returns {{systems: Array, features: Array, unplaced: Array}}
 */
export function placeOshEntities({ systems = [], fois = [] } = {}) {
  const placedSystems = [];
  const unplaced = [];
  for (const system of systems) {
    if (system.lon === null || system.lat === null) {
      unplaced.push(system.id);
      continue;
    }
    placedSystems.push({ ...system, locationSource: 'geometry' });
  }
  const features = fois.map((foi) => ({ ...foi }));
  return { systems: placedSystems, features, unplaced };
}
