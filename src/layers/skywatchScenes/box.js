/**
 * The box and the dates of a SkyWatch search: `scenesBox` is the box of
 * about 2304 km² around the view centre, and `searchWindow` is the last
 * 92 calendar days in UTC. It does not import Cesium or server code, so the
 * tests run on the host.
 */

const EARTH_RADIUS_M = 6371008.8;
export const HALF_SIDE_M = 24000;
export const GRID_DEGREES = 0.01;
export const MAX_LATITUDE = 80;
export const WINDOW_DAYS = 92;
const DAY_MS = 86_400_000;

const round = (value, digits) => Number(value.toFixed(digits));
const snap = (value) =>
  round(Math.round(value / GRID_DEGREES) * GRID_DEGREES, 2);

/**
 * The box of a search around the view centre.
 * @param {{lat:number, lon:number}|null} centre - Point under the middle of the view, or null.
 * @returns {{ok:true, centre:{lat:number, lon:number}, bbox:number[]}|{ok:false, reason:'sky'|'latitude'|'meridian'}}
 */
export function scenesBox(centre) {
  if (!Number.isFinite(centre?.lat) || !Number.isFinite(centre?.lon)) {
    return { ok: false, reason: 'sky' };
  }
  const halfHeight = ((HALF_SIDE_M / EARTH_RADIUS_M) * 180) / Math.PI;
  const lat = snap(centre.lat);
  const lon = snap(centre.lon);
  if (Math.abs(lat) > MAX_LATITUDE) return { ok: false, reason: 'latitude' };
  const halfWidth = halfHeight / Math.cos((lat * Math.PI) / 180);
  const bbox = [
    round(lon - halfWidth, 6),
    round(lat - halfHeight, 6),
    round(lon + halfWidth, 6),
    round(lat + halfHeight, 6),
  ];
  if (bbox[0] < -180 || bbox[2] > 180) return { ok: false, reason: 'meridian' };
  return { ok: true, centre: { lat, lon }, bbox };
}

/**
 * The window of a search: the UTC date of the time as `end`, and the date 91
 * days before it as `start`.
 * @param {number} time - Time in milliseconds.
 * @returns {{start:string, end:string}}
 */
export function searchWindow(time) {
  const day = Math.floor(time / DAY_MS) * DAY_MS;
  const text = (value) => new Date(value).toISOString().slice(0, 10);
  return { start: text(day - (WINDOW_DAYS - 1) * DAY_MS), end: text(day) };
}
