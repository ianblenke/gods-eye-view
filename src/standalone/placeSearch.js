import {
  createPlaceSearch,
  createGoogleGeocoder,
  createPhotonGeocoder,
} from '../search/index.js';

/**
 * Google first, through our own server, then keyless Photon. The browser
 * never holds or sends a Google key; the server answers `configured:false`
 * when it has none, which `createGoogleGeocoder` treats as no verdict.
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
