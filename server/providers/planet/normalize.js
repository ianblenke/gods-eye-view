/** The fields of the Planet scenes that the route gives. Nothing in this file sends a request. */

export const MAX_SCENES = 50;
/** The item types of the two search requests, in their order. */
export const ITEM_TYPES = ['PSScene', 'SkySatCollect'];
const PROVIDERS = { PSScene: 'PlanetScope', SkySatCollect: 'SkySat' };
const MIN_RING = 4;
const MAX_RING = 2000;
const MAX_PARTS = 16;
const SCENE_ID = /^[A-Za-z0-9_-]{1,128}$/;

/** True for a scene id of 1 to 128 ASCII letters, digits, hyphens or underscores. */
export const isSceneId = (value) =>
  typeof value === 'string' && SCENE_ID.test(value);

/** The thumbnail URL of a scene, from its item type and its checked id. */
export const thumbnailUrlOf = (type, id) =>
  `https://tiles.planet.com/data/v1/item-types/${type}/items/${id}/thumb`;

/** A number from `min` to `max`, else null. Both limits are finite, so Infinity and NaN give null. */
const numberIn = (value, min, max) =>
  typeof value === 'number' && value >= min && value <= max ? value : null;

/** The ISO text of a valid time, else null. */
function timeOf(value) {
  if (typeof value !== 'string') return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

function positionOf(position) {
  if (!Array.isArray(position) || position.length > 3) return null;
  if (position.slice(2).some((value) => typeof value !== 'number')) return null;
  const [lon, lat] = position;
  if (numberIn(lon, -180, 180) === null || numberIn(lat, -90, 90) === null) {
    return null;
  }
  return [lon, lat];
}

/** A closed ring of 4 to 2000 positions as [lon, lat] pairs, else null. */
function ringOf(ring) {
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
  return positions;
}

/** The first ring of a polygon, else null. */
const outerRingOf = (polygon) =>
  Array.isArray(polygon) ? ringOf(polygon[0]) : null;

/** The footprint with the first ring of each polygon, else null. */
function footprintOf(geometry) {
  if (geometry?.type === 'Polygon') {
    const ring = outerRingOf(geometry.coordinates);
    return ring === null ? null : { type: 'Polygon', coordinates: [ring] };
  }
  if (geometry?.type !== 'MultiPolygon') return null;
  const parts = geometry.coordinates;
  if (!Array.isArray(parts) || parts.length < 1 || parts.length > MAX_PARTS) {
    return null;
  }
  const rings = parts.map(outerRingOf);
  if (rings.includes(null)) return null;
  return { type: 'MultiPolygon', coordinates: rings.map((ring) => [ring]) };
}

function sceneOf(feature, type) {
  if (!isSceneId(feature?.id)) return null;
  const properties = feature.properties;
  const start = timeOf(properties?.acquired);
  if (start === null) return null;
  const footprint = footprintOf(feature.geometry);
  if (footprint === null) return null;
  return {
    id: feature.id,
    start,
    footprint,
    resolutionM: numberIn(properties.gsd, 0, Number.MAX_VALUE),
    provider: PROVIDERS[type],
    cloudPercent: numberIn(properties.cloud_percent, 0, 100),
    thumbnail: feature._links?.thumbnail === thumbnailUrlOf(type, feature.id),
  };
}

const byNewestThenId = (a, b) => {
  const later = Date.parse(b.start) - Date.parse(a.start);
  if (later !== 0) return later;
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
};

const hasNextPage = (page) => typeof page._links?._next === 'string';

/**
 * The kept scenes of the two pages, the newest first, at most 50, with the
 * item type of each scene in `types`.
 * @param {{type:string, page:{features:unknown[], _links?:unknown}}[]} pages
 * @returns {{scenes:object[], types:string[], truncated:boolean}}
 */
export function normalizeScenes(pages) {
  const kept = [];
  for (const { type, page } of pages) {
    for (const feature of page.features) {
      const scene = sceneOf(feature, type);
      if (scene !== null) kept.push({ scene, type });
    }
  }
  kept.sort((a, b) => byNewestThenId(a.scene, b.scene));
  const first = kept.slice(0, MAX_SCENES);
  return {
    scenes: first.map((entry) => entry.scene),
    types: first.map((entry) => entry.type),
    truncated:
      pages.some(({ page }) => hasNextPage(page)) || kept.length > MAX_SCENES,
  };
}
