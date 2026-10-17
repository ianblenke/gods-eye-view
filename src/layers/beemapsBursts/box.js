import { viewBox } from '../beemaps/box.js';

export const MAX_LATITUDE = 80;

/**
 * The box of a quote: the box of 4 km² that `viewBox` builds, within the
 * latitudes of the burst route. `viewBox` checks the snapped centre only, and
 * the route checks the corners.
 *
 * @param {{lat:number, lon:number}|null} centre - Point under the middle of the view, or null.
 * @returns {{ok:true, centre:{lat:number, lon:number}, bbox:number[]}|{ok:false, reason:'sky'|'latitude'|'meridian'}}
 */
export function burstBox(centre) {
  const box = viewBox(centre);
  if (!box.ok) return box;
  if (box.bbox[1] < -MAX_LATITUDE || box.bbox[3] > MAX_LATITUDE) {
    return { ok: false, reason: 'latitude' };
  }
  return box;
}
