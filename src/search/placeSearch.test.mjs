import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlaceSearch, createGoogleGeocoder, createPhotonGeocoder } from './index.js';
import { createStandalonePlaceSearch } from '../standalone/placeSearch.js';
import { photonExtentToBounds } from '../keylessGeocoder.js';
const feature = { geometry: { type: 'Point', coordinates: [105.85, 21.03] }, properties: { name: 'Hà Nội', type: 'city' } };
const hit = () => Response.json({ features: [feature] });

test('malformed successful Photon responses remain retryable', async () => {
  for (const malformed of [{ error: 'temporary failure' }, { features: {} }, { features: [{ geometry: { coordinates: [null, 1] } }] }]) {
    let calls = 0;
    const provider = createPhotonGeocoder({ fetchImpl: async () => ++calls === 1 ? Response.json(malformed) : hit() });
    assert.deepEqual(await provider.geocode('Hanoi'), { place: null, answered: false });
    assert.equal((await provider.geocode('Hanoi')).place.name, 'Hà Nội');
    assert.equal(calls, 2);
  }
});

test('standalone geocoding falls back after Google connection, JSON and refusal failures', async () => {
  for (const fail of [() => { throw new Error('offline'); }, () => new Response('invalid json'), () => Response.json({ configured: true, status: 'REQUEST_DENIED', results: [] })]) {
    const urls = [];
    const service = createStandalonePlaceSearch({ fetchImpl: async (url) => {
      urls.push(url); return String(url).startsWith('/api/google/geocode') ? fail() : hit();
    } });
    const result = await service.geocode('Hanoi');
    assert.equal(result.place.name, 'Hà Nội');
    assert.equal(result.fallbackUsed, true);
    assert.equal(urls.length, 2);
  }
});

test('[credential-boundary-013] a keyless server answers configured:false and the search then uses Photon', async () => {
  const service = createStandalonePlaceSearch({ fetchImpl: async (url) => {
    if (String(url).startsWith('/api/google/geocode')) {
      return Response.json({ configured: false, status: null, results: [] });
    }
    assert.equal(new URL(url, 'http://localhost').hostname, 'photon.komoot.io');
    return hit();
  } });
  assert.equal((await service.geocode('Hanoi')).place.lat, 21.03);
});

test('[credential-boundary-013] a configured:false answer does not make the combined answer inconclusive', async () => {
  // configured:false gives {place:null, answered:true}, the same shape as a
  // ZERO_RESULTS miss. Photon's empty feature list is also a miss, so the
  // combined answer is {place:null, answered:true}, not answered:false.
  const service = createStandalonePlaceSearch({ fetchImpl: async (url) => {
    if (String(url).startsWith('/api/google/geocode')) {
      return Response.json({ configured: false, status: null, results: [] });
    }
    return Response.json({ features: [] });
  } });
  const result = await service.geocode('nowhere at all');
  assert.equal(result.place, null);
  assert.equal(result.answered, true);
});

// The route answers 429 from its limiter and 502 when the upstream fetch fails.
const routeError = (status, photon) => {
  const urls = [];
  const service = createStandalonePlaceSearch({ fetchImpl: async (url) => {
    urls.push(String(url));
    if (String(url).startsWith('/api/google/geocode')) {
      return Response.json({ configured: true, status: null, results: [] }, { status });
    }
    return photon();
  } });
  return { service, urls };
};

test('[credential-boundary-013] an HTTP error answer from the route and a Photon miss make the combined answer inconclusive', async () => {
  // With no place, the result has no fallbackUsed field.
  for (const status of [429, 502]) {
    const { service, urls } = routeError(status, () => Response.json({ features: [] }));
    assert.deepEqual(await service.geocode('nowhere at all'), { place: null, answered: false });
    assert.equal(new URL(urls[1], 'http://localhost').hostname, 'photon.komoot.io');
    assert.equal(urls.length, 2);
  }
});

test('[credential-boundary-013] after an HTTP error answer from the route, the search then uses the Photon place', async () => {
  for (const status of [429, 502]) {
    const { service, urls } = routeError(status, hit);
    const result = await service.geocode('Hanoi');
    assert.equal(result.place.name, 'Hà Nội');
    assert.equal(result.answered, true);
    assert.equal(result.fallbackUsed, true);
    assert.equal(urls.length, 2);
  }
});

test('[credential-boundary-013] the geocode request URL is same-origin, with address and bounds, and no key', async () => {
  let captured;
  const service = createStandalonePlaceSearch({ fetchImpl: async (url) => {
    if (String(url).startsWith('/api/google/geocode')) {
      captured = new URL(url, 'http://localhost');
      return Response.json({ configured: true, status: 'ZERO_RESULTS', results: [] });
    }
    return hit();
  } });
  await service.geocode('Hanoi', { bias: '1,1|2,2' });
  assert.equal(captured.pathname, '/api/google/geocode');
  assert.equal(captured.searchParams.get('address'), 'Hanoi');
  assert.equal(captured.searchParams.get('bounds'), '1,1|2,2');
  assert.equal(captured.searchParams.has('key'), false);
});

test('cancellation before lookup makes no request', async () => {
  const controller = new AbortController(); controller.abort();
  let calls = 0;
  const provider = createPhotonGeocoder({ fetchImpl: async () => { calls++; return hit(); } });
  await assert.rejects(provider.geocode('Hanoi', { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls, 0);
});

test('cancellation stops Photon retries and does not cache a late response', async () => {
  const controller = new AbortController();
  let calls = 0;
  const provider = createPhotonGeocoder({ fetchImpl: async () => {
    calls++; if (calls === 1) controller.abort(); return hit();
  } });
  await assert.rejects(provider.geocode('Hanoi', { bias: '1,1|2,2', signal: controller.signal }), { name: 'AbortError' });
  assert.equal(calls, 1);
  assert.equal((await provider.geocode('Hanoi')).place.name, 'Hà Nội');
  assert.equal(calls, 2);
});

test('a Google request cancelled by its caller never starts the fallback', async () => {
  const controller = new AbortController(); let fallbackCalls = 0;
  const service = createPlaceSearch({ providers: [
    createGoogleGeocoder({ request: async () => { controller.abort(); return Response.json({ status: 'ZERO_RESULTS', results: [] }); } }),
    { geocode: async () => { fallbackCalls++; return { place: null, answered: true }; } },
  ] });
  await assert.rejects(service.geocode('missing', { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(fallbackCalls, 0);
});

test('service lifetime cancellation also rejects cache hits', async () => {
  const controller = new AbortController();
  const service = createPlaceSearch({ signal: controller.signal, providers: [createPhotonGeocoder({ fetchImpl: async () => hit() })] });
  assert.ok((await service.geocode('Hanoi')).place);
  controller.abort();
  await assert.rejects(service.geocode('Hanoi'), { name: 'AbortError' });
});

test('one cancelled caller cannot cancel another caller of the same service', async () => {
  const controller = new AbortController();
  const service = createPlaceSearch({ providers: [{ async geocode(_query, { signal }) {
    await new Promise((resolve) => setImmediate(resolve)); signal.throwIfAborted();
    return { place: { lat: 1, lng: 2 }, answered: true };
  } }] });
  const first = service.geocode('same', { signal: controller.signal });
  const second = service.geocode('same');
  controller.abort();
  await assert.rejects(first, { name: 'AbortError' });
  assert.equal((await second).place.lat, 1);
});

test('definitive misses expire while outage outcomes are never cached', async () => {
  let now = 0, calls = 0, answered = true;
  const service = createPlaceSearch({ now: () => now, providers: [{ async geocode() { calls++; return { place: null, answered }; } }] });
  await service.geocode('miss'); await service.geocode('miss'); assert.equal(calls, 1);
  now = 30_001; answered = false;
  await service.geocode('miss'); await service.geocode('miss'); assert.equal(calls, 3);
});

test('wrapped and nonnumeric Photon bounds are omitted', () => {
  assert.equal(photonExtentToBounds([170, 10, -170, -10]), null);
  assert.equal(photonExtentToBounds([null, 10, 20, -10]), null);
});
