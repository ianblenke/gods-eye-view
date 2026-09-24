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

/** A fake EventSource class. It records each instance and its listeners, and lets a test send an event. */
function fakeEventSource() {
  const instances = [];
  class FakeEventSource {
    constructor(url, options) {
      this.url = url;
      this.options = options;
      this.closed = false;
      this.listeners = new Map();
      instances.push(this);
    }

    addEventListener(name, listener) {
      this.listeners.set(name, [...(this.listeners.get(name) ?? []), listener]);
    }

    close() {
      this.closed = true;
    }

    send(name, event = {}) {
      for (const listener of this.listeners.get(name) ?? []) listener({ type: name, ...event });
    }
  }
  return { EventSource: FakeEventSource, instances };
}

/** Four callbacks that record each call as one array. */
function recordLiveCallbacks() {
  const calls = [];
  return {
    calls,
    callbacks: {
      onObservation: (observation) => calls.push(['observation', observation]),
      onOpen: () => calls.push(['open']),
      onDown: () => calls.push(['down']),
      onUnsupported: () => calls.push(['unsupported']),
    },
  };
}

test('[osh-071] the source opens one event source for the same-origin path of the datastream', () => {
  const { EventSource, instances } = fakeEventSource();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openLive('ds fixture/1?a=b', recordLiveCallbacks().callbacks);
  assert.equal(instances.length, 1);
  assert.equal(instances[0].url, '/api/osh/live?datastream=ds%20fixture%2F1%3Fa%3Db');
  const url = new URL(instances[0].url, 'https://app.example');
  assert.equal(url.origin, 'https://app.example', 'the path is same-origin');
  assert.equal(url.pathname, '/api/osh/live');
  assert.equal(url.searchParams.get('datastream'), 'ds fixture/1?a=b');
  assert.equal(url.username, '');
  assert.equal(url.password, '');
  assert.deepEqual(
    [...instances[0].listeners].map(([name, listeners]) => [name, listeners.length]).sort(),
    [
      ['down', 1],
      ['error', 1],
      ['observation', 1],
      ['open', 1],
      ['unsupported', 1],
    ],
    'one listener for each event name',
  );
});

test('[osh-071] the source gives an observation event to its callback as the parsed data', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordLiveCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openLive('ds-fixture-1', callbacks);
  const observation = {
    phenomenonTime: '2026-01-01T00:00:00Z',
    resultTime: '2026-01-01T00:00:01Z',
    rows: [{ path: 'speed', value: 42 }],
    location: { lat: 9, lon: 8, alt: 7 },
    ageMs: 3000,
  };
  instances[0].send('observation', { data: JSON.stringify(observation) });
  assert.deepEqual(calls, [['observation', observation]]);
});

test('[osh-071] the source ignores an observation event whose data is not one JSON object', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordLiveCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openLive('ds-fixture-1', callbacks);
  for (const data of ['not json', '', 'null', '42', '"text"', '[]', '[{"rows":[]}]']) {
    instances[0].send('observation', { data });
  }
  assert.deepEqual(calls, []);
});

test('[osh-071] the source gives the open, down and unsupported events to their callbacks', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordLiveCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openLive('ds-fixture-1', callbacks);
  instances[0].send('open', { data: '{}' });
  instances[0].send('down', { data: '{}' });
  instances[0].send('unsupported', { data: '{}' });
  assert.deepEqual(calls, [['open'], ['down'], ['unsupported']]);
});

test('[osh-071] the source ignores the open event of the connection, which has no data', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordLiveCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openLive('ds-fixture-1', callbacks);
  instances[0].send('open');
  assert.deepEqual(calls, []);
});

test('[osh-071] the source gives an error event to the down callback', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordLiveCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openLive('ds-fixture-1', callbacks);
  instances[0].send('error');
  assert.deepEqual(calls, [['down']]);
});

test('[osh-071] the close method closes the event source, and only that one', () => {
  const { EventSource, instances } = fakeEventSource();
  const source = createOshSource({ eventSourceImpl: EventSource });
  const first = source.openLive('ds-fixture-1', recordLiveCallbacks().callbacks);
  source.openLive('ds-fixture-2', recordLiveCallbacks().callbacks);
  assert.deepEqual(
    instances.map((instance) => instance.closed),
    [false, false],
  );
  first.close();
  assert.deepEqual(
    instances.map((instance) => instance.closed),
    [true, false],
  );
});

test('[osh-071] the default event source is the global constructor', () => {
  const original = globalThis.EventSource;
  const { EventSource, instances } = fakeEventSource();
  globalThis.EventSource = EventSource;
  try {
    const source = createOshSource();
    source.openLive('ds-fixture-1', recordLiveCallbacks().callbacks);
    assert.equal(instances.length, 1);
    assert.equal(instances[0].url, '/api/osh/live?datastream=ds-fixture-1');
  } finally {
    if (original === undefined) delete globalThis.EventSource;
    else globalThis.EventSource = original;
  }
});

/** Four callbacks for the video stream that record each call as one array. */
function recordVideoCallbacks() {
  const calls = [];
  return {
    calls,
    callbacks: {
      onFrame: (bytes) => calls.push(['frame', bytes]),
      onOpen: () => calls.push(['open']),
      onDown: () => calls.push(['down']),
      onUnsupported: () => calls.push(['unsupported']),
    },
  };
}

/** The data of a frame event: the base64 text of the bytes, as one JSON string. */
const frameData = (bytes) => JSON.stringify(Buffer.from(bytes).toString('base64'));

test('[osh-082] the source opens one event source for the same-origin video path of the datastream', () => {
  const { EventSource, instances } = fakeEventSource();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openVideo('ds fixture/1?a=b', recordVideoCallbacks().callbacks);
  assert.equal(instances.length, 1);
  assert.equal(instances[0].url, '/api/osh/video?datastream=ds%20fixture%2F1%3Fa%3Db');
  const url = new URL(instances[0].url, 'https://app.example');
  assert.equal(url.origin, 'https://app.example', 'the path is same-origin');
  assert.equal(url.pathname, '/api/osh/video');
  assert.equal(url.searchParams.get('datastream'), 'ds fixture/1?a=b');
  assert.equal(url.username, '');
  assert.equal(url.password, '');
  assert.equal(instances[0].options, undefined, 'the source passes no option, so no credentials');
  assert.deepEqual(
    [...instances[0].listeners].map(([name, listeners]) => [name, listeners.length]).sort(),
    [
      ['down', 1],
      ['error', 1],
      ['frame', 1],
      ['open', 1],
      ['unsupported', 1],
    ],
    'one listener for each event name',
  );
});

test('[osh-082] the source gives a frame event to its callback as the decoded bytes', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordVideoCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openVideo('ds-fixture-1', callbacks);
  const first = Uint8Array.from([0, 255, 128, 1, 2, 3, 250]);
  const second = Uint8Array.from([9, 8, 7]);
  instances[0].send('frame', { data: frameData(first) });
  instances[0].send('frame', { data: frameData(second) });
  assert.equal(calls.length, 2);
  assert.ok(calls[0][1] instanceof Uint8Array);
  assert.deepEqual(calls, [
    ['frame', first],
    ['frame', second],
  ]);
});

test('[osh-082] the source ignores a frame event whose data is not one JSON string of base64 text', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordVideoCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openVideo('ds-fixture-1', callbacks);
  const notFrames = [
    'not json',
    '',
    'AAAA',
    'null',
    '42',
    '{"a":1}',
    '["AAAA"]',
    '"!!!!"',
    '"A"',
    '"AA=A"',
  ];
  for (const data of notFrames) instances[0].send('frame', { data });
  instances[0].send('frame');
  assert.deepEqual(calls, []);
});

test('[osh-082] the source gives the open, down and unsupported events to their callbacks', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordVideoCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openVideo('ds-fixture-1', callbacks);
  instances[0].send('open', { data: '{}' });
  instances[0].send('down', { data: '{}' });
  instances[0].send('unsupported', { data: '{}' });
  assert.deepEqual(calls, [['open'], ['down'], ['unsupported']]);
});

test('[osh-082] the source ignores an open event that has no text data', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordVideoCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openVideo('ds-fixture-1', callbacks);
  instances[0].send('open');
  instances[0].send('open', { data: 42 });
  assert.deepEqual(calls, []);
});

test('[osh-082] the source gives an error event to the down callback', () => {
  const { EventSource, instances } = fakeEventSource();
  const { calls, callbacks } = recordVideoCallbacks();
  const source = createOshSource({ eventSourceImpl: EventSource });
  source.openVideo('ds-fixture-1', callbacks);
  instances[0].send('error');
  assert.deepEqual(calls, [['down']]);
});

test('[osh-082] the close method closes the video event source, and only that one', () => {
  const { EventSource, instances } = fakeEventSource();
  const source = createOshSource({ eventSourceImpl: EventSource });
  const first = source.openVideo('ds-fixture-1', recordVideoCallbacks().callbacks);
  source.openVideo('ds-fixture-2', recordVideoCallbacks().callbacks);
  assert.deepEqual(
    instances.map((instance) => instance.closed),
    [false, false],
  );
  first.close();
  assert.deepEqual(
    instances.map((instance) => instance.closed),
    [true, false],
  );
});

test('[osh-082] the default event source of the video stream is the global constructor', () => {
  const original = globalThis.EventSource;
  const { EventSource, instances } = fakeEventSource();
  globalThis.EventSource = EventSource;
  try {
    const source = createOshSource();
    source.openVideo('ds-fixture-1', recordVideoCallbacks().callbacks);
    assert.equal(instances.length, 1);
    assert.equal(instances[0].url, '/api/osh/video?datastream=ds-fixture-1');
  } finally {
    if (original === undefined) delete globalThis.EventSource;
    else globalThis.EventSource = original;
  }
});
