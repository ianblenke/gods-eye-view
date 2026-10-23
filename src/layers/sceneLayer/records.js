import { serviceOf } from './services.js';

/** Keep only the scenes of an answer that have a valid id, time and footprint. */

export const MAX_SCENES = 50;
const ID = /^[A-Za-z0-9_-]{1,128}$/;
const MIN_POSITIONS = 4;
const MAX_POSITIONS = 2000;
const MAX_PARTS = 16;

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

/** The ring of a list of positions as [longitude, latitude] pairs, or null. */
function readRing(positions) {
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

/** The ring of a part: a list with exactly one ring, or null. */
function readPart(part) {
  return Array.isArray(part) && part.length === 1 ? readRing(part[0]) : null;
}

/** The rings of a footprint: one for a Polygon, one for each part of a MultiPolygon, or null. */
function readRings(footprint) {
  const parts = footprint?.coordinates;
  if (footprint?.type === 'Polygon') {
    const ring = readPart(parts);
    return ring === null ? null : [ring];
  }
  if (
    footprint?.type !== 'MultiPolygon' ||
    !Array.isArray(parts) ||
    parts.length < 1 ||
    parts.length > MAX_PARTS
  ) {
    return null;
  }
  const rings = parts.map(readPart);
  return rings.includes(null) ? null : rings;
}

/** The name of a satellite provider: a known name, or the code with its underscores changed. */
function providerName(value, service) {
  if (typeof value !== 'string' || value === '') return null;
  if (Object.hasOwn(service.names, value)) return service.names[value];
  return service.spaces ? value.replaceAll('_', ' ') : value;
}

function readScene(item, service) {
  if (typeof item?.id !== 'string' || !ID.test(item.id)) return null;
  if (typeof item.start !== 'string') return null;
  const time = Date.parse(item.start);
  if (Number.isNaN(time)) return null;
  const rings = readRings(item.footprint);
  if (rings === null) return null;
  return {
    id: item.id,
    time,
    rings,
    resolutionM: amountOf(item.resolutionM),
    provider: providerName(item.provider, service),
    cloudPercent: percentOf(item.cloudPercent),
    thumbnail: item.thumbnail === true,
  };
}

/**
 * @param {unknown} payload - Parsed answer of the scenes route of the service.
 * @param {'planet'|'skyfi'} serviceName - The service that gave the answer.
 * @returns {{scenes:object[], total:number|null, truncated:boolean, used:number|null, limit:number|null}|null}
 */
export function normalizeAnswer(payload, serviceName) {
  const service = serviceOf(serviceName);
  if (!Array.isArray(payload?.scenes)) return null;
  const seen = new Set();
  const scenes = [];
  for (const item of payload.scenes) {
    if (scenes.length === MAX_SCENES) break;
    const scene = readScene(item, service);
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
