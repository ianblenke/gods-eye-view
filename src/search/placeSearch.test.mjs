import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlaceSearch, createGoogleGeocoder, createPhotonGeocoder, normalizeGooglePlace } from './index.js';
import { createStandalonePlaceSearch } from '../standalone/placeSearch.js';
import { photonExtentToBounds } from '../keylessGeocoder.js';
const feature = { geometry: { type: 'Point', coordinates: [105.85, 21.03] }, properties: { name: 'Hà Nội', type: 'city' } };
const hit = () => Response.json({ features: [feature] });

test('[credential-boundary-013] a request function that answers no response counts as no verdict', async () => {
  const geocoder = createGoogleGeocoder({ request: async () => null });
  assert.deepEqual(await geocoder.geocode('Hanoi'), { place: null, answered: true });
});

test('[credential-boundary-013] a response with ok:false counts as a real, unanswered attempt', async () => {
  const geocoder = createGoogleGeocoder({ request: async () => ({ ok: false }) });
  assert.deepEqual(await geocoder.geocode('Hanoi'), { place: null, answered: false });
});

test('[credential-boundary-013] normalizeGooglePlace refuses an out-of-range or non-finite coordinate', () => {
  for (const location of [{ lat: 91, lng: 0 }, { lat: 0, lng: 181 }, { lat: NaN, lng: 0 }]) {
    assert.equal(normalizeGooglePlace({ geometry: { location } }), null);
  }
});

test('[credential-boundary-013] normalizeGooglePlace defaults an absent types list and formatted address', () => {
  const place = normalizeGooglePlace({ geometry: { location: { lat: 1, lng: 2 } } });
  assert.deepEqual(place.types, []);
  assert.equal(place.label, '');
});

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

test('[credential-boundary-013] a keyless server answers configured:false and the search falls back to Photon', async () => {
  const service = createStandalonePlaceSearch({ fetchImpl: async (url) => {
    if (String(url).startsWith('/api/google/geocode')) {
      return Response.json({ configured: false, status: null, results: [] });
    }
    assert.equal(new URL(url, 'http://localhost').hostname, 'photon.komoot.io');
    return hit();
  } });
  assert.equal((await service.geocode('Hanoi')).place.lat, 21.03);
});

test('[credential-boundary-013] a configured:false answer contributes no verdict, not a negative one', async () => {
  // Both providers come back with no place. Photon's is a confirmed miss
  // (an empty feature list), so the combined answer must stay a confident
  // "no place", not the "inconclusive" shape an unconfigured provider would
  // cause if it were treated as a refusal instead of a non-answer.
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
