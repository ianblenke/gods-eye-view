/** Scene facts only. This file sends no request. */
const ID = /^[A-Za-z0-9_.-]{1,128}$/;
export const isSearchId = (value) =>
  typeof value === 'string' && ID.test(value);
const CONTROL = /[\u0000-\u001f\u007f-\u009f]/g;
const object = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const numberIn = (value, min, max) =>
  Number.isFinite(value) && value >= min && value <= max ? value : null;
function timeOf(value) {
  if (typeof value !== 'string') return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}
function textOf(value) {
  if (typeof value !== 'string') return null;
  const text = Array.from(value.replace(CONTROL, '').trim())
    .slice(0, 120)
    .join('');
  return text === '' ? null : text;
}
function positionOf(position) {
  if (!Array.isArray(position) || position.length < 2 || position.length > 3)
    return null;
  if (!position.every(Number.isFinite)) return null;
  const [lon, lat] = position;
  if (numberIn(lon, -180, 180) === null || numberIn(lat, -90, 90) === null)
    return null;
  return [lon, lat];
}
function footprintOf(geometry) {
  if (!object(geometry) || geometry.type !== 'Polygon') return null;
  const rings = geometry.coordinates;
  if (!Array.isArray(rings) || rings.length !== 1) return null;
  const [ring] = rings;
  if (!Array.isArray(ring) || ring.length < 4 || ring.length > 2000)
    return null;
  const positions = ring.map(positionOf);
  if (positions.includes(null)) return null;
  const first = positions[0];
  const last = positions[positions.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return null;
  return { type: 'Polygon', coordinates: [positions] };
}
function sceneOf(feature, host, collections) {
  if (!object(feature) || !object(feature.properties)) return null;
  const p = feature.properties;
  if (!isSearchId(p.id)) return null;
  const collection = collections.get(p.collection);
  if (collection === undefined || collection.host !== host) return null;
  const start = timeOf(p.start_datetime ?? p.datetime);
  const end = timeOf(p.end_datetime ?? p.datetime);
  if (start === null || end === null || start > end) return null;
  const footprint = footprintOf(feature.geometry);
  if (footprint === null) return null;
  return {
    id: p.id,
    host,
    collection: p.collection,
    start,
    end,
    footprint,
    resolutionM: numberIn(p.resolution, 0, Infinity),
    provider: textOf(p.producer) ?? textOf(p.constellation),
    cloudPercent: numberIn(p.cloudCoverage, 0, 100),
    thumbnail: collection.thumbnail,
  };
}
export function normalizeScenes(features, host, collections) {
  const scenes = [];
  let dropped = 0;
  for (const feature of features) {
    const scene = sceneOf(feature, host, collections);
    if (scene === null) dropped++;
    else scenes.push(scene);
  }
  return { scenes, dropped };
}
