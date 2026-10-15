/**
 * The box of a request for frames: about 4 km² around the view centre.
 * It does not import Cesium or server code, so the tests run on the host.
 */

const EARTH_RADIUS_M = 6371008.8;
export const HALF_SIDE_M = 1000;
export const GRID_DEGREES = 0.005;
export const MAX_LATITUDE = 80;
const HALF_HEIGHT_DEGREES = ((HALF_SIDE_M / EARTH_RADIUS_M) * 180) / Math.PI;

const round = (value, digits) => Number(value.toFixed(digits));
const snap = (value) =>
  round(Math.round(value / GRID_DEGREES) * GRID_DEGREES, 3);

/**
 * @param {{lat:number, lon:number}|null} centre - Point under the middle of the view, or null.
 * @returns {{ok:true, centre:{lat:number, lon:number}, bbox:number[]}|{ok:false, reason:'sky'|'latitude'|'meridian'}}
 */
export function viewBox(centre) {
  if (!Number.isFinite(centre?.lat) || !Number.isFinite(centre?.lon)) {
    return { ok: false, reason: 'sky' };
  }
  const lat = snap(centre.lat);
  const lon = snap(centre.lon);
  if (Math.abs(lat) > MAX_LATITUDE) return { ok: false, reason: 'latitude' };
  const halfWidth = HALF_HEIGHT_DEGREES / Math.cos((lat * Math.PI) / 180);
  const bbox = [
    round(lon - halfWidth, 6),
    round(lat - HALF_HEIGHT_DEGREES, 6),
    round(lon + halfWidth, 6),
    round(lat + HALF_HEIGHT_DEGREES, 6),
  ];
  if (bbox[0] < -180 || bbox[2] > 180) return { ok: false, reason: 'meridian' };
  return { ok: true, centre: { lat, lon }, bbox };
}
