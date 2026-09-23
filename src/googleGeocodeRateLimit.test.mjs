import assert from 'node:assert/strict';
import test from 'node:test';
import { googlePlacesContextProxy } from '../server/providers/places/google.js';

// This file runs in its own process, so the first install below builds the
// memoized Google limiter from the environment that the test sets.

function invokeRoute(handler, url) {
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
  return Promise.resolve(
    handler({ method: 'GET', url, headers: {}, socket: { remoteAddress: 'shared-limit-client' } }, res),
  ).then(() => res);
}

test('[credential-boundary-011] after one Places request, the shared rate limiter refuses a geocode request from the same client', async (t) => {
  const previous = process.env.GEV_RATELIMIT_GOOGLE_PER_MIN;
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls += 1;
    return Response.json({ places: [] });
  });
  try {
    process.env.GEV_RATELIMIT_GOOGLE_PER_MIN = '1';
    const routes = new Map();
    googlePlacesContextProxy({ resolveApiKey: () => 'fixture-key' }).configureServer({
      middlewares: { use: (path, handler) => routes.set(path, handler) },
    });

    const nearby = await invokeRoute(routes.get('/api/google/nearby-places'), '/?lat=30.27&lon=-97.74');
    assert.equal(nearby.statusCode, 200);
    assert.equal(calls, 1);

    const geocode = await invokeRoute(routes.get('/api/google/geocode'), '/?address=austin');
    assert.equal(geocode.statusCode, 429);
    assert.equal(geocode.headers['retry-after'], '5');
    assert.equal(geocode.headers['cache-control'], 'no-store');
    assert.deepEqual(geocode.body, {
      configured: true,
      error: 'Rate limit exceeded',
      status: null,
      results: [],
    });
    assert.equal(calls, 1);
  } finally {
    if (previous === undefined) delete process.env.GEV_RATELIMIT_GOOGLE_PER_MIN;
    else process.env.GEV_RATELIMIT_GOOGLE_PER_MIN = previous;
  }
});
