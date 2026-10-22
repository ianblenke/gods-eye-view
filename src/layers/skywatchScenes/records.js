/** Keep only the scenes of an answer that have a valid id, time and footprint. */

export const MAX_SCENES = 50;
const ID = /^[A-Za-z0-9_-]{1,128}$/;
const MIN_POSITIONS = 4;
const MAX_POSITIONS = 2000;

const countOf = (value) =>
  Number.isInteger(value) && value >= 0 ? value : null;
const amountOf = (value) =>
  Number.isFinite(value) && value >= 0 ? value : null;
const percentOf = (value) =>
  Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;

function readPosition(position) {
  if (!Array.isArray(position) || position.length !== 2) return null;
  const [lon, lat] = position;
  if (!Number.isFinite(lon) || Math.abs(lon) > 180) return null;
  if (!Number.isFinite(lat) || Math.abs(lat) > 90) return null;
  return [lon, lat];
}

/** The ring of a footprint as [longitude, latitude] pairs, or null. */
function readRing(footprint) {
  if (
    footprint?.type !== 'Polygon' ||
    !Array.isArray(footprint.coordinates) ||
    footprint.coordinates.length !== 1
  ) {
    return null;
  }
  const [positions] = footprint.coordinates;
  if (
    !Array.isArray(positions) ||
    positions.length < MIN_POSITIONS ||
    positions.length > MAX_POSITIONS
  ) {
    return null;
  }
  const ring = [];
  for (const position of positions) {
    const pair = readPosition(position);
    if (pair === null) return null;
    ring.push(pair);
  }
  const [first, last] = [ring[0], ring.at(-1)];
  if (first[0] !== last[0] || first[1] !== last[1]) return null;
  return ring;
}

function readScene(item) {
  if (typeof item?.id !== 'string' || !ID.test(item.id)) return null;
  if (typeof item.start !== 'string') return null;
  const time = Date.parse(item.start);
  if (Number.isNaN(time)) return null;
  const ring = readRing(item.footprint);
  if (ring === null) return null;
  return {
    id: item.id,
    time,
    ring,
    resolutionM: amountOf(item.resolutionM),
    provider:
      typeof item.provider === 'string' && item.provider !== ''
        ? item.provider
        : null,
    cloudPercent: percentOf(item.cloudPercent),
    thumbnail: item.thumbnail === true,
  };
}

/**
 * @param {unknown} payload - Parsed answer of the route /api/skywatch/scenes.
 * @returns {{scenes:object[], total:number|null, truncated:boolean, used:number|null, limit:number|null}|null}
 */
export function normalizeAnswer(payload) {
  if (!Array.isArray(payload?.scenes)) return null;
  const seen = new Set();
  const scenes = [];
  for (const item of payload.scenes) {
    if (scenes.length === MAX_SCENES) break;
    const scene = readScene(item);
    if (scene === null || seen.has(scene.id)) continue;
    seen.add(scene.id);
    scenes.push(scene);
  }
  return {
    scenes,
    total: countOf(payload.total),
    truncated: payload.truncated === true,
    used: countOf(payload.budget?.used),
    limit: countOf(payload.budget?.limit),
  };
}
