import assert from 'node:assert/strict';
import test from 'node:test';
import { installGoogleGeocodeRoute } from '../server/providers/places/geocode.js';
import { googlePlacesContextProxy } from '../server/providers/places/google.js';
import { projectGeocodeResults } from './data/placeProviderPayloads.js';

/** Return a small request helper for one route handler. */
function requestFor(handler) {
  const request = async (query, { method = 'GET' } = {}) => {
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
  request.handler = handler;
  return request;
}

/** Install the route in isolation and return a small request helper. */
function install(options) {
  const routes = new Map();
  installGoogleGeocodeRoute(
    { use: (path, handler) => routes.set(path, handler) },
    options,
  );
  return requestFor(routes.get('/api/google/geocode'));
}

/** A valid JSON geocoding body of exactly `bytes` bytes. */
function jsonBodyOfSize(bytes) {
  const head = '{"status":"OK","results":[],"pad":"';
  const tail = '"}';
  const body = head + 'x'.repeat(bytes - head.length - tail.length) + tail;
  assert.equal(Buffer.byteLength(body), bytes);
  JSON.parse(body);
  return body;
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

test('[credential-boundary-008] the forward mode sends the address and bounds, and keeps the key out of the body', async (t) => {
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

test('[credential-boundary-008] the route uses the server key first, and uses the browser key when the server key is blank', async (t) => {
  const names = ['GOOGLE_MAPS_SERVER_API_KEY', 'GOOGLE_MAPS_API_KEY', 'GEV_RATELIMIT_GOOGLE_PER_MIN'];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(new URL(url));
    return Response.json({ status: 'OK', results: [{ formatted_address: 'Austin, TX, USA' }] });
  });
  try {
    // The Google limiter is built at the first install in this process.
    process.env.GEV_RATELIMIT_GOOGLE_PER_MIN = '';
    for (const [server, browser, expected] of [
      ['server-secret', 'browser-public', 'server-secret'],
      ['server-secret', '', 'server-secret'],
      ['', 'browser-public', 'browser-public'],
      ['   ', 'browser-public', 'browser-public'],
    ]) {
      const row = `server ${JSON.stringify(server)}, browser ${JSON.stringify(browser)}`;
      process.env.GOOGLE_MAPS_SERVER_API_KEY = server;
      process.env.GOOGLE_MAPS_API_KEY = browser;
      const routes = new Map();
      // No resolver argument: the proxy selects the key from the environment.
      googlePlacesContextProxy().configureServer({
        middlewares: { use: (path, handler) => routes.set(path, handler) },
      });
      const before = calls.length;
      const result = await requestFor(routes.get('/api/google/geocode'))('?address=austin&bounds=1,1|2,2');

      assert.equal(calls.length, before + 1, row);
      assert.equal(calls.at(-1).searchParams.get('address'), 'austin', row);
      assert.equal(calls.at(-1).searchParams.get('bounds'), '1,1|2,2', row);
      assert.equal(calls.at(-1).searchParams.get('key'), expected, row);

      assert.equal(result.statusCode, 200, row);
      assert.equal(result.headers['cache-control'], 'no-store', row);
      assert.equal(result.body.configured, true, row);
      assert.equal(result.body.error, null, row);
      assert.equal(result.body.results[0].formatted_address, 'Austin, TX, USA', row);
      const body = JSON.stringify(result.body);
      assert.ok(!body.includes('server-secret'), row);
      assert.ok(!body.includes('browser-public'), row);
    }
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test('[credential-boundary-009] the reverse mode sends latlng and projects the answer', async (t) => {
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

test('[credential-boundary-010] the route refuses bad input with a 400 and no upstream call', async (t) => {
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
    '?address=',
    '?address=%20%20',
    '?lat=999&lon=-97',
    '?lat=30',
  ]) {
    const result = await request(query);
    assert.equal(result.statusCode, 400, query);
    assert.equal(result.body.configured, true, query);
    assert.ok(result.body.error, query);
    assert.equal(result.headers['cache-control'], 'no-store', query);
  }
  assert.equal(calls, 0);
});

test('[credential-boundary-010] the route refuses a non-GET method with a 405 and no upstream call', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({ status: 'OK', results: [] });
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin', { method: 'POST' });
  assert.equal(result.statusCode, 405);
  assert.deepEqual(result.body, { error: 'Method not allowed', status: null, results: [] });
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(calls, 0);

  // A server with no key also answers 405, before it reads a key.
  let keyReads = 0;
  const keyless = install({ resolveApiKey: () => { keyReads += 1; return ''; } });
  const keylessResult = await keyless('?address=austin', { method: 'POST' });
  assert.equal(keylessResult.statusCode, 405);
  assert.deepEqual(keylessResult.body, { error: 'Method not allowed', status: null, results: [] });
  assert.equal(keylessResult.headers['cache-control'], 'no-store');
  assert.equal(keyReads, 0);
  assert.equal(calls, 0);
});

test('[credential-boundary-010] the route accepts an address of exactly 256 characters', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({ status: 'OK', results: [] });
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=' + 'a'.repeat(256));
  assert.equal(result.statusCode, 200);
  assert.equal(calls, 1);
});

test('[credential-boundary-011] a non-ok upstream status gives the same status and its error, with no key', async (t) => {
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

test('[credential-boundary-011] the route removes the key from the upstream error message', async (t) => {
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({
      error_message: 'The provided API key fixture-server-key is invalid. Key: fixture-server-key',
      status: 'REQUEST_DENIED',
    }, { status: 403 }),
  );
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 403);
  assert.deepEqual(result.body, {
    configured: true,
    status: 'REQUEST_DENIED',
    results: [],
    error: 'The provided API key [redacted] is invalid. Key: [redacted]',
  });
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] a non-ok upstream status with no error_message gets a default error', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ status: 'UNKNOWN_ERROR' }, { status: 500 }));
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 500);
  assert.equal(result.body.error, 'Google Geocoding request failed');

  // A JSON body of null keeps the upstream status and gets the same default error.
  t.mock.method(globalThis, 'fetch', async () => new Response('null', { status: 503 }));
  const nullBody = await request('?address=austin');
  assert.equal(nullBody.statusCode, 503);
  assert.equal(nullBody.body.error, 'Google Geocoding request failed');
});

test('[credential-boundary-011] when the fetch throws, the route answers 502', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('offline, key=fixture-server-key');
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 502);
  assert.deepEqual(result.body, {
    configured: true,
    status: null,
    results: [],
    error: 'Google Geocoding request failed',
  });
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] when the body is larger than the maximum size, the route answers with an error and does not throw', async (t) => {
  const body = jsonBodyOfSize(1024 * 1024 + 1);
  t.mock.method(globalThis, 'fetch', async () => new Response(body, { status: 200 }));
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, {
    configured: true,
    status: null,
    results: [],
    error: 'Upstream response too large',
  });
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] the route reads a body of exactly the maximum size with no error', async (t) => {
  const body = jsonBodyOfSize(1024 * 1024);
  t.mock.method(globalThis, 'fetch', async () => new Response(body, { status: 200 }));
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, {
    configured: true,
    status: 'OK',
    results: [],
    error: null,
  });
});

test('[credential-boundary-011] when the body is not JSON, the route answers 200 with a fixed error and no key', async (t) => {
  // V8 quotes a body this short whole in its JSON.parse message.
  t.mock.method(globalThis, 'fetch', async () => new Response('<fixture-server-key>', { status: 200 }));
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const result = await request('?address=austin');
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, {
    configured: true,
    status: null,
    results: [],
    error: 'Google Geocoding response was not valid JSON',
  });
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] when the rate limiter refuses the request, the route answers 429 with Retry-After', async (t) => {
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

test('[credential-boundary-012] projectGeocodeResults shortens each list to its maximum length and keeps only the allowed fields', () => {
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

test('[credential-boundary-012] projectGeocodeResults keeps only the named fields inside each component, point and box', () => {
  const point = (lat, lng) => ({ lat, lng, altitude: 9, label: 'extra' });
  const projected = projectGeocodeResults({
    status: 'OK',
    results: [
      {
        formatted_address: 'Austin, TX, USA',
        types: ['locality'],
        address_components: [{
          long_name: 'Austin',
          short_name: 'ATX',
          types: Array.from({ length: 10 }, (_, i) => `type-${i}`),
        }],
        geometry: {
          location: point(30.27, -97.74),
          location_type: 'APPROXIMATE',
          bounds: { northeast: point(30.5, -97.5), southwest: point(30, -98), extra: true },
          viewport: { northeast: point(30.4, -97.6), southwest: point(30.1, -97.9), extra: true },
        },
      },
      {
        formatted_address: 'Bad geometry',
        geometry: {
          location: { lat: '30.27', lng: -97.74 },
          bounds: { northeast: point(30.5, -97.5) },
          viewport: 'nope',
        },
      },
    ],
  });
  assert.deepEqual(projected, {
    status: 'OK',
    results: [
      {
        formatted_address: 'Austin, TX, USA',
        address_components: [{
          long_name: 'Austin',
          types: Array.from({ length: 8 }, (_, i) => `type-${i}`),
        }],
        types: ['locality'],
        geometry: {
          location: { lat: 30.27, lng: -97.74 },
          bounds: { northeast: { lat: 30.5, lng: -97.5 }, southwest: { lat: 30, lng: -98 } },
          viewport: { northeast: { lat: 30.4, lng: -97.6 }, southwest: { lat: 30.1, lng: -97.9 } },
        },
      },
      {
        formatted_address: 'Bad geometry',
        address_components: [],
        types: [],
        geometry: { location: null, bounds: null, viewport: null },
      },
    ],
  });
});

test('[credential-boundary-012] projectGeocodeResults gives a default value to each field of an empty result', () => {
  const projected = projectGeocodeResults({ status: 'OK', results: [{}] });
  assert.deepEqual(projected.results, [{
    formatted_address: null,
    address_components: [],
    types: [],
    geometry: { location: null, bounds: null, viewport: null },
  }]);
});

test('[credential-boundary-012] projectGeocodeResults gives a default value to each field of an empty address component', () => {
  const projected = projectGeocodeResults({
    status: 'OK',
    results: [{ address_components: [{}] }],
  });
  assert.deepEqual(projected.results[0].address_components, [{ long_name: null, types: [] }]);
});

test('[credential-boundary-012] projectGeocodeResults gives an empty answer for an incorrect input', () => {
  for (const incorrect of [null, undefined, {}, { status: 1 }, { results: 'nope' }, 'nope']) {
    const projected = projectGeocodeResults(incorrect);
    assert.equal(projected.status, null);
    assert.deepEqual(projected.results, []);
  }
});

test('[credential-boundary-010] the route reads a request with no URL as an empty query', async () => {
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
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
  await request.handler({ method: 'GET', socket: { remoteAddress: 'fixture' } }, res);
  assert.equal(res.statusCode, 400);
});

test('[credential-boundary-011] the route stops the fetch after 5 s and answers 502', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let signal;
  t.mock.method(globalThis, 'fetch', (_url, options) => new Promise((_resolve, reject) => {
    signal = options.signal;
    signal.addEventListener('abort', () => {
      const error = new Error('This operation was aborted');
      error.name = 'AbortError';
      reject(error);
    });
  }));
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const pending = request('?address=austin');
  t.mock.timers.tick(4999);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  assert.equal(signal.aborted, true);
  const result = await pending;
  assert.equal(result.statusCode, 502);
  assert.deepEqual(result.body, {
    configured: true,
    status: null,
    results: [],
    error: 'Upstream timeout',
  });
  assert.equal(result.headers['cache-control'], 'no-store');
});

test('[credential-boundary-011] when the body does not arrive in 5 s, the route answers with a timeout error', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let readStarted;
  const started = new Promise((resolve) => {
    readStarted = resolve;
  });
  t.mock.method(globalThis, 'fetch', async () => {
    let finishRead;
    return {
      ok: true,
      status: 200,
      headers: new Headers(),
      body: {
        getReader: () => ({
          read() {
            readStarted();
            return new Promise((resolve) => {
              finishRead = resolve;
            });
          },
          // The abort cancels the reader, which ends the open read.
          async cancel() {
            finishRead?.({ done: true, value: undefined });
          },
          releaseLock() {},
        }),
      },
    };
  });
  const request = install({ resolveApiKey: () => 'fixture-server-key' });
  const pending = request('?address=austin');
  await started;
  t.mock.timers.tick(5000);
  const result = await pending;
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, {
    configured: true,
    status: null,
    results: [],
    error: 'Upstream timeout',
  });
  assert.equal(result.headers['cache-control'], 'no-store');
});
