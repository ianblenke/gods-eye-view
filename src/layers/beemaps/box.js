/**
 * The boxes of the layers that use Bee Maps: `viewBox` is the box of 4 km²
 * around the view centre, which the layer "Bee Maps Bursts" uses for a quote,
 * and `framesBox` is the box of 0.09 km² for a request for frames.
 * It does not import Cesium or server code, so the tests run on the host.
 */

const EARTH_RADIUS_M = 6371008.8;
export const HALF_SIDE_M = 1000;
export const GRID_DEGREES = 0.005;
export const FRAMES_HALF_SIDE_M = 150;
export const FRAMES_GRID_DEGREES = 0.001;
export const MAX_LATITUDE = 80;

const round = (value, digits) => Number(value.toFixed(digits));
const snap = (value, grid) => round(Math.round(value / grid) * grid, 3);

/**
 * @param {{lat:number, lon:number}|null} centre - Point under the middle of the view, or null.
 * @param {number} halfSideM - Half of the side of the box in metres.
 * @param {number} grid - Grid of the centre in degrees.
 */
function boxAround(centre, halfSideM, grid) {
  if (!Number.isFinite(centre?.lat) || !Number.isFinite(centre?.lon)) {
    return { ok: false, reason: 'sky' };
  }
  const halfHeight = ((halfSideM / EARTH_RADIUS_M) * 180) / Math.PI;
  const lat = snap(centre.lat, grid);
  const lon = snap(centre.lon, grid);
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
 * The box of 4 km² around the view centre.
 * @param {{lat:number, lon:number}|null} centre - Point under the middle of the view, or null.
 * @returns {{ok:true, centre:{lat:number, lon:number}, bbox:number[]}|{ok:false, reason:'sky'|'latitude'|'meridian'}}
 */
export const viewBox = (centre) => boxAround(centre, HALF_SIDE_M, GRID_DEGREES);

/**
 * The box of 0.09 km² around the view centre, for a request for frames.
 * @param {{lat:number, lon:number}|null} centre - Point under the middle of the view, or null.
 * @returns {{ok:true, centre:{lat:number, lon:number}, bbox:number[]}|{ok:false, reason:'sky'|'latitude'|'meridian'}}
 */
export const framesBox = (centre) =>
  boxAround(centre, FRAMES_HALF_SIDE_M, FRAMES_GRID_DEGREES);
