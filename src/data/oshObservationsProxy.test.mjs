import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  OBS_MAX_ENTRIES,
  OBS_TTL_MS,
  createOshKeyedCache,
  createOshObservationsCache,
  createOshSystemDatastreamsCache,
} from '../../server/providers/osh/observations.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-observation.json', import.meta.url), 'utf8'),
);
const datastreamsFixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-datastreams.json', import.meta.url), 'utf8'),
);
const ROOT = new URL('https://osh.example/api/');

function urlFor(id) {
  return new URL(`https://osh.example/api/datastreams/${id}/observations?limit=1&resultTime=latest`);
}

function systemDatastreamsUrlFor(id) {
  return new URL(`https://osh.example/api/systems/${id}/datastreams?limit=100`);
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

test('[osh-048] createOshKeyedCache() never shares one entry between two different keys', async () => {
  const callsById = new Map();
  const cache = createOshKeyedCache({
    fetchImpl: async () => {},
    ttlMs: 1000,
    refresh: async (_fetchImpl, id) => {
      callsById.set(id, (callsById.get(id) || 0) + 1);
      return `value-for-${id}`;
    },
  });
  const [a, b] = await Promise.all([cache.get('a'), cache.get('b')]);
  assert.equal(a.value, 'value-for-a');
  assert.equal(b.value, 'value-for-b');
  assert.equal(callsById.get('a'), 1);
  assert.equal(callsById.get('b'), 1);
});

test('[osh-048] createOshKeyedCache() does not refetch inside the TTL', async () => {
  let now = 0;
  let calls = 0;
  const cache = createOshKeyedCache({
    fetchImpl: async () => {},
    now: () => now,
    ttlMs: 1000,
    refresh: async () => {
      calls += 1;
      return 'v';
    },
  });
  await cache.get('a');
  now += 999;
  await cache.get('a');
  assert.equal(calls, 1);
  now += 2;
  await cache.get('a');
  assert.equal(calls, 2);
});

test('[osh-048] createOshKeyedCache() serves the stale value on a failed refresh, and never throws with a snapshot in hand', async () => {
  let now = 0;
  let succeed = true;
  const cache = createOshKeyedCache({
    fetchImpl: async () => {},
    now: () => now,
    ttlMs: 1000,
    refresh: async () => {
      if (!succeed) throw new Error('upstream down');
      return 'v';
    },
  });
  await cache.get('a');
  succeed = false;
  now += 1001;
  const result = await cache.get('a');
  assert.equal(result.stale, true);
  assert.equal(result.value, 'v');
});

test('[osh-048] createOshKeyedCache() keeps at most maxEntries ids', async () => {
  const cache = createOshKeyedCache({
    fetchImpl: async () => {},
    ttlMs: 1000,
    maxEntries: 3,
    refresh: async (_fetchImpl, id) => id,
  });
  for (const id of ['a', 'b', 'c', 'd']) await cache.get(id);
  assert.equal(cache.size(), 3);
});

test('[osh-048] createOshSystemDatastreamsCache() serves the datastreams of one system, built from mapOshDatastreams()', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(JSON.stringify(datastreamsFixture), { status: 200 });
  };
  const cache = createOshSystemDatastreamsCache({ fetchImpl, now: () => 1000, ttlMs: 5000 });
  const result = await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  assert.equal(calls, 1);
  assert.equal(result.stale, false);
  assert.equal(result.fetchedAt, 1000);
  assert.equal(result.datastreams.length, 2);
  assert.equal(result.datastreams[0].id, 'ds-fixture-1');
});

test('[osh-048] createOshSystemDatastreamsCache() shares one walk per id inside the TTL, and gives a second id its own', async () => {
  let now = 0;
  const callsById = new Map();
  const fetchImpl = async (url) => {
    const id = String(url).match(/systems\/([^/]+)\//)[1];
    callsById.set(id, (callsById.get(id) || 0) + 1);
    return new Response(JSON.stringify({ items: [] }), { status: 200 });
  };
  const cache = createOshSystemDatastreamsCache({ fetchImpl, now: () => now, ttlMs: 1000 });
  await Promise.all([
    cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {}),
    cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {}),
  ]);
  assert.equal(callsById.get('sys-fixture-1'), 1);
  await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  assert.equal(callsById.get('sys-fixture-1'), 1, 'a request inside the TTL sends no new call');
  now += 1001;
  await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  assert.equal(callsById.get('sys-fixture-1'), 2);
  await cache.get('sys-fixture-2', ROOT, systemDatastreamsUrlFor('sys-fixture-2'), {});
  assert.equal(callsById.get('sys-fixture-2'), 1);
});

test('[osh-048] createOshSystemDatastreamsCache() also accepts the secondary datastreams list key', async () => {
  const fetchImpl = async () =>
    new Response(JSON.stringify({ datastreams: datastreamsFixture.items }), { status: 200 });
  const cache = createOshSystemDatastreamsCache({ fetchImpl, now: () => 0, ttlMs: 5000 });
  const result = await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  assert.equal(result.datastreams.length, 2);
});

test('[osh-048] createOshSystemDatastreamsCache() maps an empty body to an empty list', async () => {
  const fetchImpl = async () => new Response(null, { status: 204 });
  const cache = createOshSystemDatastreamsCache({ fetchImpl, now: () => 0, ttlMs: 5000 });
  const result = await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  assert.deepEqual(result.datastreams, []);
});

test('[osh-048] createOshSystemDatastreamsCache() serves the stale snapshot on a failed walk, and rethrows with none', async () => {
  let now = 0;
  let succeed = true;
  const fetchImpl = async () => {
    if (succeed) return new Response(JSON.stringify({ items: [] }), { status: 200 });
    return new Response(null, { status: 500 });
  };
  const cache = createOshSystemDatastreamsCache({ fetchImpl, now: () => now, ttlMs: 1000 });
  await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  succeed = false;
  now += 1001;
  const result = await cache.get('sys-fixture-1', ROOT, systemDatastreamsUrlFor('sys-fixture-1'), {});
  assert.equal(result.stale, true);

  await assert.rejects(
    cache.get('sys-fixture-new', ROOT, systemDatastreamsUrlFor('sys-fixture-new'), {}),
  );
});
