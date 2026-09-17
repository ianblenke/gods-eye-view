/**
 * Pure adapter for an OpenSensorHub system list. Shared by the server
 * provider (server/providers/osh.js), which applies it before it caches a
 * page walk, and by any future browser code that reads the same shape.
 *
 * Accepts a GeoJSON FeatureCollection (`features`) or a plain list
 * (`items`). Keeps a record only for a feature with a string id and a Point
 * geometry with two finite coordinates. Every other field is optional, so a
 * missing property becomes null instead of a thrown error.
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

/**
 * Map a raw OpenSensorHub system list to trimmed records.
 * @param {*} payload - Upstream JSON body.
 * @returns {Array<{id:string, uid:?string, name:?string, description:?string, validTime:?Array, lon:number, lat:number, alt:?number}>}
 */
export function mapOshSystems(payload) {
  const list = listOf(payload);
  if (!list) return [];
  const records = [];
  for (const feature of list) {
    if (!feature || typeof feature !== 'object') continue;
    const id = typeof feature.id === 'string' && feature.id ? feature.id : null;
    if (!id) continue;
    const geometry = feature.geometry;
    if (!geometry || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates))
      continue;
    const lon = finiteNumber(geometry.coordinates[0]);
    const lat = finiteNumber(geometry.coordinates[1]);
    if (lon === null || lat === null) continue;
    const alt =
      geometry.coordinates.length > 2 ? finiteNumber(geometry.coordinates[2]) : null;
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
