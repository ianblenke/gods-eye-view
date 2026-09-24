import {
  createPlaceSearch,
  createGoogleGeocoder,
  createPhotonGeocoder,
} from '../search/index.js';

/**
 * Google first, through our own server, then keyless Photon. The browser
 * never holds or sends a Google key; the server answers `configured:false`
 * when it has none. `createGoogleGeocoder` gives `{place:null, answered:true}`
 * for that answer, the same shape as a `ZERO_RESULTS` miss, so the Photon
 * fallback still runs.
 */
export function createStandalonePlaceSearch({
  fetchImpl = (...args) => fetch(...args),
  signal,
} = {}) {
  return createPlaceSearch({
    signal,
    providers: [
      createGoogleGeocoder({
        request(query, { bias, signal }) {
          const params = new URLSearchParams({ address: query });
          if (bias) params.set('bounds', bias);
          return fetchImpl(`/api/google/geocode?${params.toString()}`, {
            signal,
          });
        },
      }),
      createPhotonGeocoder({ fetchImpl }),
    ],
  });
}
