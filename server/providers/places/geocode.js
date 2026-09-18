import { googleServerApiKey, keylessGooglePlacesResponse } from './google-key.js';
import { clientKey } from '../common/rate-limit.js';
import { readResponseTextCapped } from '../common/http.js';
import { validatePlacesCoordinates } from './coordinates.js';
import { projectGeocodeResults } from '../../../src/data/placeProviderPayloads.js';

/** Longest address text the route accepts. */
const GEOCODE_MAX_ADDRESS_LENGTH = 256;

/** Hard cap on the upstream geocoding response we will buffer. */
const GEOCODE_MAX_RESPONSE_BYTES = 1024 * 1024; // 1 MB

/** Upstream request timeout. */
const GEOCODE_TIMEOUT_MS = 5000;

/** Google's `bounds` viewport-bias shape: `lat,lng|lat,lng`. */
const GEOCODE_BOUNDS_PATTERN = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?\|-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/;

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/**
 * Read the request's mode from its query, refusing anything but exactly one
 * of a forward address lookup or a reverse lat/lon lookup.
 */
function readGeocodeRequest(searchParams) {
  const hasAddress = searchParams.has('address');
  const hasLatLon = searchParams.has('lat') || searchParams.has('lon');
  if (hasAddress === hasLatLon) {
    return { ok: false, error: 'Provide exactly one of address or lat and lon' };
  }
  if (hasAddress) {
    const address = String(searchParams.get('address') || '').trim();
    if (!address) return { ok: false, error: 'address must not be blank' };
    if (address.length > GEOCODE_MAX_ADDRESS_LENGTH) {
      return { ok: false, error: `address is longer than ${GEOCODE_MAX_ADDRESS_LENGTH} characters` };
    }
    const bounds = searchParams.get('bounds');
    if (bounds !== null && !GEOCODE_BOUNDS_PATTERN.test(bounds)) {
      return { ok: false, error: 'bounds must be lat,lng|lat,lng' };
    }
    return { ok: true, mode: 'forward', address, bounds };
  }
  const coordinates = validatePlacesCoordinates(searchParams);
  if (!coordinates.ok) return { ok: false, error: coordinates.error };
  return { ok: true, mode: 'reverse', latitude: coordinates.latitude, longitude: coordinates.longitude };
}

/**
 * Google geocoding, server-key only, forward and reverse. Shares the Places
 * rate limiter (passed in) so both cost-bearing Google surfaces spend one
 * per-IP budget. Every answer carries `Cache-Control: no-store` — Google
 * content is never cached here.
 */
export function installGoogleGeocodeRoute(middlewares, {
  resolveApiKey = googleServerApiKey,
  rateLimiter = null,
} = {}) {
  middlewares.use('/api/google/geocode', async (req, res) => {
    if (req.method !== 'GET') {
      sendJson(res, 405, { configured: false, error: 'Method not allowed', status: null, results: [] });
      return;
    }

    const apiKey = resolveApiKey();
    const keyless = keylessGooglePlacesResponse(apiKey);
    if (keyless) {
      sendJson(res, keyless.statusCode, { configured: false, error: keyless.payload.error, status: null, results: [] });
      return;
    }

    const requestUrl = new URL(req.url || '', 'http://localhost');
    const parsed = readGeocodeRequest(requestUrl.searchParams);
    if (!parsed.ok) {
      sendJson(res, 400, { configured: true, error: parsed.error, status: null, results: [] });
      return;
    }

    if (rateLimiter && !rateLimiter(clientKey(req))) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Retry-After', '5');
      res.end(JSON.stringify({ configured: true, error: 'Rate limit exceeded', status: null, results: [] }));
      return;
    }

    const upstream = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    upstream.searchParams.set('key', apiKey);
    if (parsed.mode === 'forward') {
      upstream.searchParams.set('address', parsed.address);
      if (parsed.bounds) upstream.searchParams.set('bounds', parsed.bounds);
    } else {
      upstream.searchParams.set('latlng', `${parsed.latitude},${parsed.longitude}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEOCODE_TIMEOUT_MS);
    try {
      const response = await fetch(upstream, { signal: controller.signal });
      let data = {};
      let readError = null;
      try {
        const text = await readResponseTextCapped(response, GEOCODE_MAX_RESPONSE_BYTES, controller.signal);
        data = JSON.parse(text);
      } catch (error) {
        readError = error?.message || 'Upstream response too large';
      }
      const projected = projectGeocodeResults(data);
      sendJson(res, response.ok ? 200 : response.status, {
        configured: true,
        status: projected.status,
        results: projected.results,
        error: readError || (response.ok ? null : (data.error_message || 'Google Geocoding request failed')),
      });
    } catch (error) {
      sendJson(res, 502, {
        configured: true,
        status: null,
        results: [],
        error: error?.message || 'Google Geocoding request failed',
      });
    } finally {
      clearTimeout(timer);
    }
  });
}
