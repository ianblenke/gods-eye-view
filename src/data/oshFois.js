/**
 * Pure adapter for an OpenSensorHub feature-of-interest list. Shared the
 * same way as src/data/oshSystems.js. A feature of interest is a node of
 * the mesh: it carries its own point, and a link to the system that hosts
 * it. Keeps its own copy of the id pattern, the same reason
 * oshDatastreams.js does — the server-side boundary check stays a
 * node-only module.
 */

const OSH_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

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

/** Read a Point geometry's finite coordinates, or null when absent or not finite. */
function pointOf(geometry) {
  if (!geometry || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates))
    return null;
  const lon = finiteNumber(geometry.coordinates[0]);
  const lat = finiteNumber(geometry.coordinates[1]);
  if (lon === null || lat === null) return null;
  const alt = geometry.coordinates.length > 2 ? finiteNumber(geometry.coordinates[2]) : null;
  return { lon, lat, alt };
}

/**
 * Read the host system id from `hostedProcedure@link.href`, only when the
 * link's path ends `systems/<id>`. Any other link shape, including a link
 * to a procedure, gives null: a feature with a null host still draws, but
 * never joins the wrong system.
 * @param {*} properties
 * @returns {?string}
 */
function hostSystemId(properties) {
  const link = properties?.['hostedProcedure@link'];
  const href = link && typeof link === 'object' ? link.href : null;
  if (typeof href !== 'string' || !href) return null;
  const clean = href.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const parts = clean.split('/');
  const id = parts[parts.length - 1];
  const kind = parts[parts.length - 2];
  if (!id || kind !== 'systems') return null;
  return OSH_ID_PATTERN.test(id) ? id : null;
}

/**
 * Map a raw OpenSensorHub feature-of-interest list to trimmed records. Keeps
 * a record only for a feature with a string id and a Point geometry with
 * finite coordinates — a node with no geometry is a known, unplaced node,
 * not a record this adapter carries.
 * @param {*} payload - Upstream JSON body.
 * @returns {Array<{id:string, uid:?string, systemId:?string, name:?string, description:?string, validTime:?Array, lon:number, lat:number, alt:?number}>}
 */
export function mapOshFois(payload) {
  const list = listOf(payload);
  if (!list) return [];
  const records = [];
  const seen = new Set();
  for (const feature of list) {
    if (!feature || typeof feature !== 'object') continue;
    const id = typeof feature.id === 'string' && feature.id ? feature.id : null;
    if (!id || seen.has(id)) continue;
    const point = pointOf(feature.geometry);
    if (!point) {
      seen.add(id);
      continue;
    }
    seen.add(id);
    const properties =
      feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : {};
    records.push({
      id,
      uid: typeof properties.uid === 'string' ? properties.uid : null,
      systemId: hostSystemId(properties),
      name: typeof properties.name === 'string' ? properties.name : null,
      description:
        typeof properties.description === 'string' ? properties.description : null,
      validTime: Array.isArray(properties.validTime) ? properties.validTime : null,
      lon: point.lon,
      lat: point.lat,
      alt: point.alt,
    });
  }
  return records;
}
