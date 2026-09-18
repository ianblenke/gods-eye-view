import assert from 'node:assert/strict';
import test from 'node:test';
import { installGoogleGeocodeRoute } from '../server/providers/places/geocode.js';
import { projectGeocodeResults } from './data/placeProviderPayloads.js';

/** Install the route in isolation and return a small request helper. */
function install(options) {
  const routes = new Map();
  installGoogleGeocodeRoute(
    { use: (path, handler) => routes.set(path, handler) },
    options,
  );
  const handler = routes.get('/api/google/geocode');
  return async (query, { method = 'GET' } = {}) => {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      end(body) {
        this.body = body ? JSON.parse(body) : null;
      },
    };
    await handler(
      { method, url: `/${query}`, socket: { remoteAddress: 'fixture' } },
      res,
    );
    return res;
  };
}

test('[credential-boundary-007] a keyless server answers configured:false with no upstream call', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({});
  });
  const request = install({ resolveApiKey: () => '' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, {
    configured: false,
    error: null,
    status: null,
    results: [],
  });
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(calls, 0);
});

test('[credential-boundary-008] forward mode sends the address and bounds, and keeps the key out of the body', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(new URL(url));
    return Response.json({
      status: 'OK',
      results: [{
        formatted_address: 'Austin, TX, USA',
        types: ['locality'],
        address_components: [{ long_name: 'Austin', types: ['locality'] }],
        geometry: { location: { lat: 30.27, lng: -97.74 } },
      }],
    });
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=Austin%2C+TX&bounds=1%2C1%7C2%2C2');

  assert.equal(calls.length, 1);
  assert.equal(calls[0].origin, 'https://maps.googleapis.com');
  assert.equal(calls[0].pathname, '/maps/api/geocode/json');
  assert.equal(calls[0].searchParams.get('address'), 'Austin, TX');
  assert.equal(calls[0].searchParams.get('bounds'), '1,1|2,2');
  assert.equal(calls[0].searchParams.get('key'), 'fixture-server-key');

  assert.equal(result.statusCode, 200);
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(result.body.configured, true);
  assert.equal(result.body.status, 'OK');
  assert.equal(result.body.results[0].formatted_address, 'Austin, TX, USA');
  assert.equal(result.body.error, null);
  assert.ok(!JSON.stringify(result.body).includes('fixture-server-key'));
});

test('[credential-boundary-008] the server key wins over the browser key, and a blank server key falls back', async (t) => {
  // Mirrors the five-row selection table of googleServerKey.test.mjs, at this
  // one route.
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(new URL(url).searchParams.get('key'));
    return Response.json({ status: 'ZERO_RESULTS', results: [] });
  });
  for (const [server, browser, expected] of [
    ['server-secret', 'browser-public', 'server-secret'],
    ['', 'browser-public', 'browser-public'],
    ['   ', 'browser-public', 'browser-public'],
  ]) {
    const request = install({
      resolveApiKey: () => (String(server).trim() || browser),
    });
    await request('?address=austin');
    assert.equal(calls.at(-1), expected);
  }
});

test('[credential-boundary-009] reverse mode sends latlng and projects the answer', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(new URL(url));
    return Response.json({
      status: 'OK',
      results: [{
        formatted_address: 'Austin, TX, USA',
        types: ['locality'],
        address_components: [{ long_name: 'Austin', types: ['locality'] }],
        geometry: { location: { lat: 30.27, lng: -97.74 } },
      }],
    });
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?lat=30.27&lon=-97.74');

  assert.equal(calls[0].searchParams.get('latlng'), '30.27,-97.74');
  assert.equal(calls[0].searchParams.has('address'), false);
  assert.equal(result.body.status, 'OK');
  assert.equal(result.body.results[0].geometry.location.lat, 30.27);
});

test('[credential-boundary-010] refuses malformed input with a 400 and no upstream call', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({ status: 'OK', results: [] });
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  for (const query of [
    '',
    '?address=austin&lat=30&lon=-97',
    '?address=' + 'a'.repeat(257),
    '?address=austin&bounds=not-bounds',
    '?lat=999&lon=-97',
    '?lat=30',
  ]) {
    const result = await request(query);
    assert.equal(result.statusCode, 400, query);
    assert.equal(result.body.configured, true, query);
    assert.ok(result.body.error, query);
  }
  assert.equal(calls, 0);
});

test('[credential-boundary-010] refuses a non-GET method with a 405', async () => {
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin', { method: 'POST' });
  assert.equal(result.statusCode, 405);
});

test('[credential-boundary-011] a non-ok upstream status passes through its error with no key', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ error_message: 'Denied', status: 'REQUEST_DENIED' }, { status: 403 }),
  );
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 403);
  assert.equal(result.body.error, 'Denied');
  assert.ok(!JSON.stringify(result.body).includes('fixture-server-key'));
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] a thrown fetch answers 502', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('offline');
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 502);
  assert.equal(result.body.configured, true);
  assert.ok(result.body.error);
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] an over-cap body answers with an error, not a throw', async (t) => {
  const big = 'x'.repeat(2 * 1024 * 1024);
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    status: 200,
    headers: new Map(),
    body: {
      getReader: () => {
        let sent = false;
        return {
          async read() {
            if (sent) return { done: true, value: undefined };
            sent = true;
            return { done: false, value: new TextEncoder().encode(big) };
          },
          async cancel() {},
          releaseLock() {},
        };
      },
    },
  }));
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.configured, true);
  assert.ok(result.body.error);
  assert.deepEqual(result.body.results, []);
});

test('[credential-boundary-011] a set rate limiter answers 429 with Retry-After', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({ status: 'OK', results: [] });
  });
  const request = install({
    resolveApiKey: () => 'fixture-server-key',
    rateLimiter: () => false,
  });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 429);
  assert.equal(result.headers['retry-after'], '5');
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(calls, 0);
});

test('[credential-boundary-012] projectGeocodeResults caps lists and keeps only the allowed fields', () => {
  const bigResult = {
    formatted_address: 'X',
    place_id: 'must-not-survive',
    types: Array.from({ length: 10 }, (_, i) => `type-${i}`),
    address_components: Array.from({ length: 25 }, (_, i) => ({
      long_name: `component-${i}`,
      types: ['route'],
    })),
    geometry: {
      location: { lat: 1, lng: 2 },
      bounds: { northeast: { lat: 2, lng: 3 }, southwest: { lat: 0, lng: 1 } },
      viewport: { northeast: { lat: 2, lng: 3 }, southwest: { lat: 0, lng: 1 } },
    },
  };
  const projected = projectGeocodeResults({
    status: 'OK',
    results: Array.from({ length: 14 }, () => bigResult),
  });
  assert.equal(projected.status, 'OK');
  assert.equal(projected.results.length, 12);
  assert.equal(projected.results[0].types.length, 8);
  assert.equal(projected.results[0].address_components.length, 20);
  assert.equal('place_id' in projected.results[0], false);
  assert.deepEqual(projected.results[0].geometry.location, { lat: 1, lng: 2 });
  assert.deepEqual(projected.results[0].address_components[0], {
    long_name: 'component-0',
    types: ['route'],
  });
});

test('[credential-boundary-012] projectGeocodeResults gives an empty answer for a malformed input', () => {
  for (const malformed of [null, undefined, {}, { status: 1 }, { results: 'nope' }, 'nope']) {
    const projected = projectGeocodeResults(malformed);
    assert.equal(projected.status, malformed && typeof malformed.status === 'string' ? malformed.status : null);
    assert.deepEqual(projected.results, []);
  }
});
