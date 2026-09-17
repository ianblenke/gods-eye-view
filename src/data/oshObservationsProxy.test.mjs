import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  OBS_MAX_ENTRIES,
  OBS_TTL_MS,
  createOshObservationsCache,
} from '../../server/providers/osh/observations.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-observation.json', import.meta.url), 'utf8'),
);
const ROOT = new URL('https://osh.example/api/');

function urlFor(id) {
  return new URL(`https://osh.example/api/datastreams/${id}/observations?limit=1&resultTime=latest`);
}

test('[osh-022] serves the newest observation of a datastream', async () => {
  let call = 0;
  const fetchImpl = async () => {
    call += 1;
    return new Response(JSON.stringify(fixture), { status: 200 });
  };
  const cache = createOshObservationsCache({ fetchImpl, now: () => 1000 });
  const result = await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  assert.equal(call, 1);
  assert.equal(result.stale, false);
  assert.equal(result.fetchedAt, 1000);
  assert.equal(result.observation.phenomenonTime, '2026-01-01T00:05:00Z');
  assert.deepEqual(result.observation.location, { lat: 45.21, lon: 10.53, alt: 121 });
});

test('[osh-022] an empty item list maps to observation:null', async () => {
  const fetchImpl = async () =>
    new Response(JSON.stringify({ items: [] }), { status: 200 });
  const cache = createOshObservationsCache({ fetchImpl });
  const result = await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  assert.equal(result.observation, null);
});

test('[osh-022] an upstream non-2xx status throws with the upstream status attached', async () => {
  const fetchImpl = async () => new Response(null, { status: 400 });
  const cache = createOshObservationsCache({ fetchImpl });
  await assert.rejects(
    cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {}),
    (error) => error.status === 400,
  );
});

test('[osh-023] caches the newest observation for 15 seconds', async () => {
  let call = 0;
  let now = 0;
  const fetchImpl = async () => {
    call += 1;
    return new Response(JSON.stringify(fixture), { status: 200 });
  };
  const cache = createOshObservationsCache({ fetchImpl, now: () => now });
  await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  now += OBS_TTL_MS - 1;
  const cached = await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  assert.equal(call, 1);
  assert.equal(cached.stale, false);
  now += 2;
  await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  assert.equal(call, 2);
});

test('[osh-023] shares one call between concurrent requests for one id, and makes two for two ids', async () => {
  let call = 0;
  const fetchImpl = async () => {
    call += 1;
    return new Response(JSON.stringify(fixture), { status: 200 });
  };
  const cache = createOshObservationsCache({ fetchImpl });
  await Promise.all([
    cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {}),
    cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {}),
  ]);
  assert.equal(call, 1);
  await cache.get('ds-fixture-2', urlFor('ds-fixture-2'), {});
  assert.equal(call, 2);
});

test('[osh-023] serves the stale value when a refresh fails, and rethrows with no cache', async () => {
  let succeed = true;
  let now = 0;
  const fetchImpl = async () => {
    if (succeed) return new Response(JSON.stringify(fixture), { status: 200 });
    throw new Error('upstream down');
  };
  const cache = createOshObservationsCache({ fetchImpl, now: () => now });
  await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  succeed = false;
  now += OBS_TTL_MS + 1;
  const result = await cache.get('ds-fixture-1', urlFor('ds-fixture-1'), {});
  assert.equal(result.stale, true);
  assert.ok(result.observation);

  await assert.rejects(
    cache.get('ds-fixture-new', urlFor('ds-fixture-new'), {}),
    /upstream down/,
  );
});

test('[osh-023] keeps at most 256 ids and drops the oldest', async () => {
  const callsById = new Map();
  const fetchImpl = async (url) => {
    const id = String(url).match(/datastreams\/([^/]+)\//)[1];
    callsById.set(id, (callsById.get(id) || 0) + 1);
    return new Response(JSON.stringify(fixture), { status: 200 });
  };
  const cache = createOshObservationsCache({ fetchImpl });
  for (let index = 0; index < OBS_MAX_ENTRIES + 1; index += 1) {
    const id = `ds-fixture-${index}`;
    await cache.get(id, urlFor(id), {});
  }
  assert.equal(cache.size(), OBS_MAX_ENTRIES);

  await cache.get('ds-fixture-0', urlFor('ds-fixture-0'), {});
  assert.equal(
    callsById.get('ds-fixture-0'),
    2,
    'the oldest id was dropped, so selecting it again must fetch it again',
  );

  await cache.get(`ds-fixture-${OBS_MAX_ENTRIES}`, urlFor(`ds-fixture-${OBS_MAX_ENTRIES}`), {});
  assert.equal(
    callsById.get(`ds-fixture-${OBS_MAX_ENTRIES}`),
    1,
    'the newest id must still be cached, with no second fetch',
  );
});
