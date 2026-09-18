import assert from 'node:assert/strict';
import test from 'node:test';
import { createOshSource } from './source.js';

function jsonResponse(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

test('[osh-028] reports key required on the systems, datastreams, fois and observation getters', async () => {
  const source = createOshSource({
    fetchImpl: async () => jsonResponse(503, { error: 'no_key' }),
  });
  assert.deepEqual(await source.getSystems(), {
    keyRequired: true,
    systems: [],
    stale: false,
  });
  assert.deepEqual(await source.getDatastreams(), { keyRequired: true, datastreams: [] });
  assert.deepEqual(await source.getFois(), { keyRequired: true, fois: [], truncated: false });
  assert.deepEqual(await source.getObservation('ds-fixture-1'), {
    keyRequired: true,
    observation: null,
  });
  assert.deepEqual(await source.getLocations(), {
    keyRequired: true,
    locations: [],
    failed: 0,
  });
});

test('[osh-028] a 503 with another error body still throws', async () => {
  const source = createOshSource({
    fetchImpl: async () => jsonResponse(503, { error: 'other' }),
  });
  await assert.rejects(source.getSystems(), /OSH HTTP 503/);
});

test('[osh-028] a 503 whose body does not confirm no_key still throws', async () => {
  const source = createOshSource({
    fetchImpl: async () => ({
      status: 503,
      ok: false,
      json: async () => {
        throw new Error('bad json');
      },
    }),
  });
  await assert.rejects(source.getSystems(), /OSH HTTP 503/);
});

test('[osh-028] another non-ok status throws', async () => {
  const source = createOshSource({ fetchImpl: async () => jsonResponse(502, {}) });
  await assert.rejects(source.getSystems(), /OSH HTTP 502/);
  await assert.rejects(source.getDatastreams(), /OSH HTTP 502/);
  await assert.rejects(source.getFois(), /OSH HTTP 502/);
  await assert.rejects(source.getObservation('ds-fixture-1'), /OSH HTTP 502/);
  await assert.rejects(source.getLocations(), /OSH HTTP 502/);
});

test('[osh-028] a payload without the expected array throws', async () => {
  const source = createOshSource({ fetchImpl: async () => jsonResponse(200, {}) });
  await assert.rejects(source.getSystems(), /Malformed OSH systems payload/);
  await assert.rejects(source.getDatastreams(), /Malformed OSH datastreams payload/);
  await assert.rejects(source.getFois(), /Malformed OSH fois payload/);
  await assert.rejects(source.getObservation('ds-fixture-1'), /Malformed OSH observation payload/);
  await assert.rejects(source.getLocations(), /Malformed OSH locations payload/);
});

test('[osh-028] the locations getter passes locations and failed through, and sends no query', async () => {
  let observedPath;
  const source = createOshSource({
    fetchImpl: async (path) => {
      observedPath = path;
      return jsonResponse(200, { locations: [{ systemId: 'sys-fixture-1' }], failed: 2 });
    },
  });
  const result = await source.getLocations();
  assert.equal(observedPath, '/api/osh/locations', 'the locations getter sends no query');
  assert.deepEqual(result, {
    keyRequired: false,
    locations: [{ systemId: 'sys-fixture-1' }],
    failed: 2,
  });
});

test('[osh-028] the locations getter defaults failed to 0 when the payload omits it', async () => {
  const source = createOshSource({
    fetchImpl: async () => jsonResponse(200, { locations: [] }),
  });
  assert.equal((await source.getLocations()).failed, 0);
});

test('[osh-028] returns the systems and datastreams records unchanged', async () => {
  const source = createOshSource({
    fetchImpl: async (path) => {
      if (path === '/api/osh/systems')
        return jsonResponse(200, { systems: [{ id: 'sys-fixture-1' }], stale: true });
      return jsonResponse(200, { datastreams: [{ id: 'ds-fixture-1' }] });
    },
  });
  assert.deepEqual(await source.getSystems(), {
    keyRequired: false,
    systems: [{ id: 'sys-fixture-1' }],
    stale: true,
  });
  assert.deepEqual(await source.getDatastreams(), {
    keyRequired: false,
    datastreams: [{ id: 'ds-fixture-1' }],
  });
});

test('[osh-028] the fois getter passes truncated through, and defaults it to false', async () => {
  const source = createOshSource({
    fetchImpl: async () =>
      jsonResponse(200, { fois: [{ id: 'foi-fixture-1' }], truncated: true }),
  });
  assert.deepEqual(await source.getFois(), {
    keyRequired: false,
    fois: [{ id: 'foi-fixture-1' }],
    truncated: true,
  });

  const noFlag = createOshSource({
    fetchImpl: async () => jsonResponse(200, { fois: [] }),
  });
  assert.equal((await noFlag.getFois()).truncated, false);
});

test('[osh-028] the datastreams getter sends a given system id as the system query parameter, and sends no such key when none is given', async () => {
  let observedPath;
  const source = createOshSource({
    fetchImpl: async (path) => {
      observedPath = path;
      return jsonResponse(200, { datastreams: [] });
    },
  });
  await source.getDatastreams({ system: 'sys fixture 1' });
  const url = new URL(observedPath, 'https://app.example');
  assert.equal(url.pathname, '/api/osh/datastreams');
  assert.equal(url.searchParams.get('system'), 'sys fixture 1');

  await source.getDatastreams();
  assert.equal(observedPath, '/api/osh/datastreams');
  assert.equal(observedPath.includes('system'), false, 'no system key must be sent when none is given');
});

test('[osh-028] the observations getter passes the id as a query parameter', async () => {
  let observedPath;
  const source = createOshSource({
    fetchImpl: async (path) => {
      observedPath = path;
      return jsonResponse(200, { observation: { rows: [] } });
    },
  });
  const result = await source.getObservation('ds fixture 1');
  const url = new URL(observedPath, 'https://app.example');
  assert.equal(url.pathname, '/api/osh/observations');
  assert.equal(url.searchParams.get('datastream'), 'ds fixture 1');
  assert.deepEqual(result, { keyRequired: false, observation: { rows: [] } });
});

test('[osh-050] the observation getter returns ageMs as served, computing nothing of its own', async () => {
  const source = createOshSource({
    fetchImpl: async () => jsonResponse(200, { observation: { rows: [], ageMs: -5000 } }),
  });
  const result = await source.getObservation('ds-fixture-1');
  assert.deepEqual(result, { keyRequired: false, observation: { rows: [], ageMs: -5000 } });
});

test('[osh-028] the default fetch implementation calls the global fetch', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => jsonResponse(200, { systems: [], stale: false });
  try {
    const source = createOshSource();
    assert.deepEqual(await source.getSystems(), {
      keyRequired: false,
      systems: [],
      stale: false,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('[osh-028] a cancelled observation read never publishes the response', async () => {
  const controller = new AbortController();
  const source = createOshSource({
    fetchImpl: async () => ({
      status: 200,
      ok: true,
      json: async () => {
        controller.abort();
        return { observation: null };
      },
    }),
  });
  await assert.rejects(
    source.getObservation('ds-fixture-1', { signal: controller.signal }),
    { name: 'AbortError' },
  );
});
