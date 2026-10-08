import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSceneDocument, stringifySceneDocument } from '../document.js';
import { normalizeProject } from '../../scenes/project.js';
import { createDataPackSession } from './session.js';
import { createAssetDirectorySource } from './source.js';
import { decodePackGeoJSON } from './geojson.js';

const pack = () => ({
  id: 'outline',
  version: 1,
  format: 'geojson',
  source: { adapter: 'assets', path: 'example/outline.geojson' },
  attribution: { text: 'Example author', license: 'CC0-1.0' },
  placement: { altitudeReference: 'ellipsoid' },
});
const project = () => ({
  version: 5,
  scenes: [
    {
      id: 'scene',
      dataPacks: [pack()],
      shots: [{ id: 'shot', dataPackIds: ['outline'] }],
    },
  ],
});
const asset = () => ({
  bytes: new Uint8Array([1, 2, 3]),
  mimeType: 'application/json',
});
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

test('v5 packs and shot references round trip through project migration without acquiring bytes', () => {
  const normalized = normalizeProject(
    parseSceneDocument(JSON.stringify(project())),
  );
  assert.deepEqual(
    JSON.parse(stringifySceneDocument(normalized)).scenes[0].dataPacks,
    project().scenes[0].dataPacks,
  );
  assert.deepEqual(normalized.scenes[0].shots[0].dataPackIds, ['outline']);
  for (const version of [1, 2, 3, 4]) {
    const old = normalizeProject(
      parseSceneDocument(
        JSON.stringify({ version, scenes: [{ id: 'old', shots: [] }] }),
      ),
    );
    assert.equal(old.version, 6);
    assert.equal(old.scenes[0].dataPacks, undefined);
  }
});

test('[director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials', () => {
  const mutations = [
    (s) => {
      s.dataPacks = null;
    },
    (s) => s.dataPacks.push(pack()),
    (s) => s.shots[0].dataPackIds.push('missing'),
    (s) => s.shots[0].dataPackIds.push('outline'),
    (s) => (s.dataPacks[0].placement.altitudeReference = 'terrain'),
    (s) => (s.dataPacks[0].source.headers = { Authorization: 'secret' }),
    (s) => (s.dataPacks[0].attribution.url = 'javascript:alert(1)'),
    (s) => (s.dataPacks[0].byteLength = 0),
    (s) => (s.dataPacks[0].sha256 = 'wrong'),
    ...[
      '../x',
      '/api/status',
      'https://example.com/x',
      'x?a=1',
      'x#key',
      '%2e%2e/x',
      'a\\b',
      'a//b',
    ].map((path) => (s) => (s.dataPacks[0].source.path = path)),
  ];
  for (const mutate of mutations) {
    const p = project();
    mutate(p.scenes[0]);
    assert.throws(() => parseSceneDocument(JSON.stringify(p)));
  }
  const old = project();
  old.version = 4;
  assert.throws(() => parseSceneDocument(JSON.stringify(old)));
});

test('[director-080] The manifest checks given image bounds and media anchor references', () => {
  const p = project(),
    s = p.scenes[0],
    a = s.dataPacks[0];
  a.format = 'image';
  a.placement = {
    bounds: [-98, 30, -97, 31],
    height: 200,
    altitudeReference: 'ellipsoid',
  };
  assert.doesNotThrow(() => parseSceneDocument(JSON.stringify(p)));
  a.placement.bounds[2] = -99;
  assert.throws(() => parseSceneDocument(JSON.stringify(p)));
  a.format = 'media';
  a.placement = { anchorId: 'one' };
  assert.throws(() => parseSceneDocument(JSON.stringify(p)));
  s.anchors = [
    { id: 'one', lat: 30, lon: -97, alt: 200, altitudeReference: 'ellipsoid' },
  ];
  assert.doesNotThrow(() => parseSceneDocument(JSON.stringify(p)));
});

test('[director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets', async () => {
  const requests = [];
  const source = createAssetDirectorySource({
    baseUrl: 'https://assets.example.org/packs/',
    fetchImpl: async (...args) => {
      requests.push(args);
      return new Response(new Uint8Array([1, 2, 3]), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  });
  assert.deepEqual(
    (await source({ path: 'a/data.json' })).bytes,
    new Uint8Array([1, 2, 3]),
  );
  assert.equal(requests[0][0], 'https://assets.example.org/packs/a/data.json');
  assert.equal(requests[0][1].credentials, 'omit');
  assert.equal(requests[0][1].redirect, 'error');
  assert.equal(requests[0][1].referrerPolicy, 'no-referrer');
  await assert.rejects(source({ path: '../api/test' }));
  assert.equal(requests.length, 1);
  await assert.rejects(source({ path: 'a', maxBytes: 2 }), /byte limit/);
  const missing = createAssetDirectorySource({
    baseUrl: 'https://example.org/packs/',
    fetchImpl: async () => new Response('', { status: 404 }),
  });
  await assert.rejects(missing({ path: 'a' }), /unavailable/);
});

test('[director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints', () => {
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'p',
        properties: { title: '<script>', marker: 'https://bad.example/x' },
        geometry: { type: 'Point', coordinates: [-97, 30, 300] },
      },
    ],
  };
  const decode = () =>
    decodePackGeoJSON(new TextEncoder().encode(JSON.stringify(data)));
  assert.deepEqual(decode(), [
    { id: 'p', type: 'Point', coordinates: [-97, 30, 300] },
  ]);
  data.features.push(data.features[0]);
  assert.throws(decode, /IDs/);
  data.features.pop();
  data.features[0].geometry.coordinates[1] = 91;
  assert.throws(decode, /position/);
  data.features[0].geometry = {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 2],
      ],
    ],
  };
  assert.throws(decode, /ring/);
});

test('[director-089] The data pack session removes resources and cancels the transport on Stop', async () => {
  let disposed = 0,
    signal;
  const session = createDataPackSession({
    sources: {
      assets: async (options) => {
        signal = options.signal;
        return asset();
      },
    },
    adapters: {
      geojson: async () => ({
        dispose() {
          disposed++;
        },
      }),
    },
  });
  await session.load([pack()]);
  assert.deepEqual(session.getState(), { status: 'ready', count: 1 });
  session.clear();
  session.destroy();
  assert.equal(disposed, 1);
  assert.equal(signal.aborted, true);
  assert.equal(session.getState().count, 0);
});

test('[director-091] The data pack session replaces source work and ignores its late bytes', async () => {
  const first = deferred();
  let mounted = 0,
    calls = 0;
  const session = createDataPackSession({
    sources: { assets: () => (++calls === 1 ? first.promise : asset()) },
    adapters: {
      geojson: () => {
        mounted++;
        return {
          dispose() {
            mounted--;
          },
        };
      },
    },
  });
  const old = session.load([pack()]);
  await session.load([pack()]);
  assert.equal(await old, false);
  first.resolve(asset());
  await new Promise((r) => setImmediate(r));
  assert.equal(mounted, 1);
  session.destroy();
  assert.equal(mounted, 0);
});

test('[director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement', async () => {
  const rendering = deferred();
  let disposed = 0;
  const entered = deferred();
  const session = createDataPackSession({
    sources: { assets: asset },
    adapters: {
      geojson: () => {
        entered.resolve();
        return rendering.promise;
      },
    },
  });
  const load = session.load([pack()]);
  await entered.promise;
  session.clear();
  assert.equal(await load, false);
  rendering.resolve({
    dispose() {
      disposed++;
    },
  });
  await new Promise((r) => setImmediate(r));
  assert.equal(disposed, 1);
});

test('[director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result', async () => {
  const controller = new AbortController();
  let disposed = 0;
  const session = createDataPackSession({
    sources: { assets: asset },
    adapters: {
      geojson: () => {
        queueMicrotask(() => controller.abort());
        return {
          dispose() {
            disposed++;
          },
        };
      },
    },
  });
  assert.equal(
    await session.load([pack()], { signal: controller.signal }),
    false,
  );
  assert.equal(disposed, 1);
  assert.equal(session.getState().count, 0);
});

test('[director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources', async () => {
  const session = createDataPackSession({
    timeoutMs: 10,
    sources: { assets: () => new Promise(() => {}) },
    adapters: { geojson: () => assert.fail() },
  });
  await assert.rejects(session.load([pack()]), /could not load/);
  assert.equal(session.getState().status, 'idle');
  let disposed = 0,
    called = 0;
  const rollback = createDataPackSession({
    sources: {
      assets: () => {
        if (++called === 2) throw new Error('secret URL');
        return asset();
      },
    },
    adapters: {
      geojson: () => ({
        dispose() {
          disposed++;
        },
      }),
    },
  });
  await assert.rejects(
    rollback.load([pack(), { ...pack(), id: 'second' }]),
    (e) => !e.message.includes('secret') && /could not load/.test(e.message),
  );
  assert.equal(disposed, 1);
  assert.equal(rollback.getState().count, 0);
});

test('[director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names', async () => {
  let mounted = 0;
  const session = createDataPackSession({
    sources: { assets: asset },
    adapters: {
      geojson: () => {
        mounted++;
        return { dispose() {} };
      },
    },
  });
  for (const overrides of [
    { byteLength: 2 },
    { sha256: '0'.repeat(64) },
    { source: { adapter: 'toString', path: 'a' } },
  ])
    await assert.rejects(session.load([{ ...pack(), ...overrides }]));
  assert.equal(mounted, 0);
  const digest = await crypto.subtle.digest('SHA-256', asset().bytes);
  const sha256 = Buffer.from(digest).toString('hex');
  await session.load([{ ...pack(), byteLength: 3, sha256 }]);
  assert.equal(mounted, 1);
  session.destroy();
});

test('[director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal', async () => {
  let cancelled = 0,
    requests = 0;
  const source = createAssetDirectorySource({
    baseUrl: 'https://example.org/packs/',
    fetchImpl: async () => {
      requests++;
      return new Response(
        new ReadableStream({
          cancel() {
            cancelled++;
          },
        }),
        { status: 403 },
      );
    },
  });
  await assert.rejects(source({ path: 'a.json' }), /unavailable/);
  assert.equal(cancelled, 1);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(source({ path: 'a.json', signal: controller.signal }));
  assert.equal(requests, 1);
});
