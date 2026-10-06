import test from 'node:test';
import assert from 'node:assert/strict';
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

import {
  validateAssetPath,
  validateDataPack,
  validateSceneDataPacks,
} from './manifest.js';
const imagePack = () => ({
  ...pack(),
  format: 'image',
  placement: {
    bounds: [-2, -1, 2, 1],
    height: 0,
    altitudeReference: 'ellipsoid',
  },
});
const feature = (id = 'p', type = 'Point', coordinates = [0, 0]) => ({
  type: 'Feature',
  id,
  geometry: { type, coordinates },
});
const geo = (value) =>
  decodePackGeoJSON(new TextEncoder().encode(JSON.stringify(value)));
const geoFeatures = (features) => geo({ type: 'FeatureCollection', features });
const tick = () => new Promise((r) => setImmediate(r));
const makeSession = (
  source = asset,
  adapter = () => ({ dispose() {} }),
  options = {},
) =>
  createDataPackSession({
    sources: { assets: source },
    adapters: { geojson: adapter },
    ...options,
  });
const response = (
  chunks = [new Uint8Array([1, 2, 3])],
  headers = { 'content-type': 'application/json' },
) =>
  new Response(
    new ReadableStream({
      start(c) {
        for (const chunk of chunks) c.enqueue(chunk);
        c.close();
      },
    }),
    { headers },
  );
const directory = (fetchImpl) =>
  createAssetDirectorySource({ baseUrl: 'https://example.org/a/', fetchImpl });
test('[director-076] The asset path accepts safe names', async () => {
  assert.doesNotThrow(() => validateAssetPath('A_1/b-c.d'));
});

test('[director-076] The asset path rejects traversal', async () => {
  assert.throws(() => validateAssetPath('../x'), /relative asset path/);
});

test('[director-077] The manifest rejects invalid version', async () => {
  const a = pack();
  a.version = 2;
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /unsupported pack/,
  );
});

test('[director-077] The manifest rejects invalid format', async () => {
  const a = pack();
  a.format = 'other';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /unsupported pack/,
  );
});

test('[director-077] The manifest accepts geojson', async () => {
  const a = pack();
  a.format = 'geojson';
  a.placement = { altitudeReference: 'ellipsoid' };
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-077] The manifest accepts image', async () => {
  const a = pack();
  a.format = 'image';
  a.placement = {
    bounds: [-2, -1, 2, 1],
    height: 0,
    altitudeReference: 'ellipsoid',
  };
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-077] The manifest accepts media', async () => {
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-078] The attribution rejects protocol', async () => {
  const a = pack();
  a.attribution.url = 'http://example.org/a';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /HTTPS source link without/,
  );
});

test('[director-078] The attribution rejects username', async () => {
  const a = pack();
  a.attribution.url = 'https://u@example.org/a';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /HTTPS source link without/,
  );
});

test('[director-078] The attribution rejects password', async () => {
  const a = pack();
  a.attribution.url = 'https://:p@example.org/a';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /HTTPS source link without/,
  );
});

test('[director-078] The attribution rejects query', async () => {
  const a = pack();
  a.attribution.url = 'https://example.org/a?q=1';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /HTTPS source link without/,
  );
});

test('[director-078] The attribution rejects fragment', async () => {
  const a = pack();
  a.attribution.url = 'https://example.org/a#x';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /HTTPS source link without/,
  );
});

test('[director-078] The attribution rejects invalid URL text', async () => {
  const a = pack();
  a.attribution.url = 'bad';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /expected an HTTPS source link/,
  );
});

test('[director-078] The attribution accepts a safe link', async () => {
  const a = pack();
  a.attribution.url = 'https://example.org/a';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The attribution rejects blank text', async () => {
  const a = pack();
  a.attribution.text = ' ';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /attribution.text/,
  );
});

test('[director-078] The attribution rejects blank license', async () => {
  const a = pack();
  a.attribution.license = ' ';
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /attribution.license/,
  );
});

test('[director-079] The byte length rejects a fraction', async () => {
  const a = pack();
  a.byteLength = 1.5;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /integer/);
});

test('[director-079] The digest rejects invalid type', async () => {
  const a = pack();
  a.sha256 = { toString: () => 'a'.repeat(64) };
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /digest/);
});

test('[director-079] The digest rejects invalid alphabet', async () => {
  const a = pack();
  a.sha256 = 'G'.repeat(64);
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /digest/);
});

test('[director-079] The integrity fields accept their limits', async () => {
  const a = pack();
  a.byteLength = 8388608;
  a.sha256 = 'a'.repeat(64);
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
  a.byteLength = 0;
  assert.throws(() => validateDataPack(a, 'pack', new Set()));
  a.byteLength = 8388609;
  assert.throws(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-080] The image rejects reversed west', async () => {
  const a = imagePack();
  a.placement.bounds = [2, -1, 1, 1];
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /non-dateline/);
});

test('[director-080] The image rejects reversed south', async () => {
  const a = imagePack();
  a.placement.bounds = [-2, 1, 2, -1];
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /non-dateline/);
});

test('[director-080] The image rejects short bounds', async () => {
  const a = imagePack();
  a.placement.bounds = [-2, -1, 2];
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /west, south/);
});

test('[director-080] The image rejects bounds field 0', async () => {
  const a = imagePack();
  a.placement.bounds[0] = 181;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[0\]/);
});

test('[director-080] The image rejects bounds field 1', async () => {
  const a = imagePack();
  a.placement.bounds[1] = 91;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[1\]/);
});

test('[director-080] The image rejects bounds field 2', async () => {
  const a = imagePack();
  a.placement.bounds[2] = 181;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[2\]/);
});

test('[director-080] The image rejects bounds field 3', async () => {
  const a = imagePack();
  a.placement.bounds[3] = 91;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[3\]/);
});

test('[director-080] The image rejects height and reference', async () => {
  const a = imagePack();
  a.placement.height = -12001;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /height/);
  a.placement.height = 0;
  a.placement.altitudeReference = 'terrain';
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /ellipsoid/);
});

test('[director-081] The media rejects an unknown anchor', async () => {
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  assert.throws(
    () => validateDataPack(a, 'pack', new Set()),
    /unknown scene anchor/,
  );
});

test('[director-082] The scene rejects duplicate pack IDs', async () => {
  assert.throws(
    () =>
      validateSceneDataPacks(
        { dataPacks: [pack(), pack()], shots: [] },
        'scene',
      ),
    /duplicate pack ID/,
  );
});

test('[director-082] The shot rejects duplicate pack IDs', async () => {
  assert.throws(
    () =>
      validateSceneDataPacks(
        {
          dataPacks: [pack()],
          shots: [{ dataPackIds: ['outline', 'outline'] }],
        },
        'scene',
      ),
    /distinct scene pack IDs/,
  );
});

test('[director-082] The shot rejects unknown pack IDs', async () => {
  assert.throws(
    () =>
      validateSceneDataPacks(
        { dataPacks: [pack()], shots: [{ dataPackIds: ['unknown'] }] },
        'scene',
      ),
    /distinct scene pack IDs/,
  );
});

test('[director-082] The scene accepts absent packs and anchors', async () => {
  assert.doesNotThrow(() => validateSceneDataPacks({ shots: [{}] }, 'scene'));
  assert.doesNotThrow(() =>
    validateSceneDataPacks({ anchors: [], dataPacks: [], shots: [] }, 'scene'),
  );
  assert.throws(() =>
    validateSceneDataPacks(
      { dataPacks: Array.from({ length: 9 }, pack), shots: [] },
      'scene',
    ),
  );
});

test('[director-083] The collection rejects invalid type', async () => {
  assert.throws(
    () => geo({ type: 'Other', features: [] }),
    /bounded FeatureCollection/,
  );
});

test('[director-083] The collection rejects invalid array', async () => {
  assert.throws(
    () => geo({ type: 'FeatureCollection', features: {} }),
    /bounded FeatureCollection/,
  );
});

test('[director-083] The collection rejects invalid total', async () => {
  assert.throws(
    () =>
      geo({
        type: 'FeatureCollection',
        features: Array.from({ length: 2001 }, (_, i) => feature(String(i))),
      }),
    /bounded FeatureCollection/,
  );
});

test('[director-084] The feature rejects type', async () => {
  const f = feature();
  f.type = 'Other';
  assert.throws(() => geo({ type: 'FeatureCollection', features: [f] }), /IDs/);
});

test('[director-084] The feature rejects ID type', async () => {
  const f = feature();
  f.id = 7;
  assert.throws(() => geo({ type: 'FeatureCollection', features: [f] }), /IDs/);
});

test('[director-084] The feature rejects blank ID', async () => {
  const f = feature();
  f.id = ' ';
  assert.throws(() => geo({ type: 'FeatureCollection', features: [f] }), /IDs/);
});

test('[director-084] The feature rejects long ID', async () => {
  const f = feature();
  f.id = 'a'.repeat(257);
  assert.throws(() => geo({ type: 'FeatureCollection', features: [f] }), /IDs/);
});

test('[director-084] The feature rejects duplicate ID', async () => {
  const f = feature();
  assert.throws(
    () => geo({ type: 'FeatureCollection', features: [f, f] }),
    /IDs/,
  );
});

test('[director-085] The position rejects invalid array', async () => {
  const saved = Object.getOwnPropertyDescriptor(Object.prototype, 'some');
  Object.defineProperty(Object.prototype, 'some', {
    configurable: true,
    value: Array.prototype.some,
  });
  try {
    assert.throws(
      () => geoFeatures([feature('p', 'Point', { 0: 0, 1: 0, length: 2 })]),
      /position/,
    );
  } finally {
    if (saved) Object.defineProperty(Object.prototype, 'some', saved);
    else delete Object.prototype.some;
  }
});

test('[director-085] The position rejects invalid length', async () => {
  assert.throws(() => geoFeatures([feature('p', 'Point', [0])]), /position/);
});

test('[director-085] The position rejects invalid finite', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 'x'])]),
    /position/,
  );
});

test('[director-085] The position rejects invalid longitude', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [181, 0])]),
    /position/,
  );
});

test('[director-085] The position rejects invalid latitude', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 91])]),
    /position/,
  );
});

test('[director-085] The position rejects invalid low height', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 0, -12001])]),
    /position/,
  );
});

test('[director-085] The position rejects invalid high height', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 0, 1000000001])]),
    /position/,
  );
});

test('[director-085] The position total rejects excess', async () => {
  assert.throws(
    () =>
      geoFeatures([
        feature(
          'p',
          'LineString',
          Array.from({ length: 50001 }, () => [0, 0]),
        ),
      ]),
    /position/,
  );
});

test('[director-085] The position uses zero for absent height', async () => {
  assert.deepEqual(
    geoFeatures([feature('p', 'Point', [0, 0])])[0].coordinates,
    [0, 0, 0],
  );
});

test('[director-085] The position keeps explicit height', async () => {
  assert.deepEqual(
    geoFeatures([feature('p', 'Point', [0, 0, 7])])[0].coordinates,
    [0, 0, 7],
  );
});

test('[director-086] The line rejects invalid array', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'LineString', {})]),
    /Invalid line/,
  );
});

test('[director-086] The line rejects invalid minimum', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'LineString', [[0, 0]])]),
    /Invalid line/,
  );
});

test('[director-086] The ring needs four points', async () => {
  assert.throws(
    () =>
      geoFeatures([
        feature('p', 'Polygon', [
          [
            [0, 0],
            [1, 0],
            [0, 0],
          ],
        ]),
      ]),
    /Invalid line/,
  );
});

test('[director-086] The line accepts two distinct endpoints', async () => {
  assert.deepEqual(
    geoFeatures([
      feature('p', 'LineString', [
        [0, 0],
        [1, 1],
      ]),
    ])[0].coordinates,
    [
      [0, 0, 0],
      [1, 1, 0],
    ],
  );
});

test('[director-086] The ring rejects unclosed field 0', async () => {
  const ring = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  ring[3][0] = 1;
  assert.throws(
    () => geoFeatures([feature('p', 'Polygon', [ring])]),
    /Unclosed ring/,
  );
});

test('[director-086] The ring rejects unclosed field 1', async () => {
  const ring = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  ring[3][1] = 1;
  assert.throws(
    () => geoFeatures([feature('p', 'Polygon', [ring])]),
    /Unclosed ring/,
  );
});

test('[director-086] The ring rejects unclosed field 2', async () => {
  const ring = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  ring[3][2] = 1;
  assert.throws(
    () => geoFeatures([feature('p', 'Polygon', [ring])]),
    /Unclosed ring/,
  );
});

test('[director-087] The geometry rejects invalid type', async () => {
  const f = feature();
  f.geometry = {
    type: 'MultiPoint',
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
      ],
    ],
  };
  assert.throws(() => geoFeatures([f]), /Unsupported geometry/);
});

test('[director-087] The geometry rejects invalid array', async () => {
  const f = feature();
  f.geometry = {
    type: 'Polygon',
    coordinates: {
      0: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
      ],
      length: 1,
    },
  };
  const saved = Object.getOwnPropertyDescriptor(Object.prototype, 'map');
  Object.defineProperty(Object.prototype, 'map', {
    configurable: true,
    value: Array.prototype.map,
  });
  try {
    assert.throws(() => geoFeatures([f]), /Unsupported geometry/);
  } finally {
    if (saved) Object.defineProperty(Object.prototype, 'map', saved);
    else delete Object.prototype.map;
  }
});

test('[director-087] The geometry rejects invalid empty', async () => {
  const f = feature();
  f.geometry = { type: 'Polygon', coordinates: [] };
  assert.throws(() => geoFeatures([f]), /Unsupported geometry/);
});

test('[director-087] The geometry rejects invalid total', async () => {
  const f = feature();
  f.geometry = {
    type: 'Polygon',
    coordinates: Array.from({ length: 129 }, () => [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0],
    ]),
  };
  assert.throws(() => geoFeatures([f]), /Unsupported geometry/);
});

test('[director-087] The geometry returns a closed polygon', async () => {
  const ring = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 0],
  ];
  assert.deepEqual(geoFeatures([feature('p', 'Polygon', [ring])]), [
    {
      id: 'p',
      type: 'Polygon',
      coordinates: [
        [
          [0, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
          [0, 0, 0],
        ],
      ],
    },
  ]);
});

test('[director-087] The geometry removes properties', async () => {
  const f = feature('p', 'Point', [1, 2, 3]);
  f.properties = { url: 'bad' };
  assert.deepEqual(geoFeatures([f]), [
    { id: 'p', type: 'Point', coordinates: [1, 2, 3] },
  ]);
});

test('[director-088] The new session reports idle state', async () => {
  const s = createDataPackSession();
  assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
  assert.equal(await s.load([]), true);
  s.destroy();
  assert.equal(await s.load([]), false);
});

test('[director-088] The session rejects pack list type', async () => {
  const s = createDataPackSession();
  await assert.rejects(s.load({}), /Too many data packs/);
  s.destroy();
});

test('[director-088] The session rejects pack list total', async () => {
  const s = createDataPackSession();
  await assert.rejects(
    s.load(Array.from({ length: 9 }, pack)),
    /Too many data packs/,
  );
  s.destroy();
});

test('[director-088] The session rejects destroyed state', async () => {
  let calls = 0;
  const s = makeSession(() => {
    calls++;
    return asset();
  });
  s.destroy();
  assert.equal(await s.load([pack()]), false);
  assert.equal(calls, 0);
  s.destroy();
});

test('[director-088] The session rejects cancelled state', async () => {
  let calls = 0;
  const s = makeSession(() => {
    calls++;
    return asset();
  });
  const c = new AbortController();
  c.abort();
  assert.equal(await s.load([pack()], { signal: c.signal }), false);
  assert.equal(calls, 0);
  s.destroy();
});

test('[director-089] The session disposes handles in reverse order', async () => {
  const order = [];
  const s = makeSession(asset, ({ pack }) => ({
    dispose() {
      order.push(pack.id);
    },
  }));
  assert.equal(await s.load([pack(), { ...pack(), id: 'b' }]), true);
  assert.deepEqual(s.getState(), { status: 'ready', count: 2 });
  s.clear();
  assert.deepEqual(order, ['b', 'outline']);
  assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
  s.destroy();
});

test('[director-089] The session gives copied state', async () => {
  const s = makeSession();
  await s.load([pack()]);
  s.getState().status = 'bad';
  assert.equal(s.getState().status, 'ready');
  s.destroy();
});

test('[director-090] The cancelled session disposes late resources', async () => {
  const d = deferred(),
    entered = deferred();
  let disposed = 0;
  const s = makeSession(asset, () => {
    entered.resolve();
    return d.promise;
  });
  const work = s.load([pack()]);
  await entered.promise;
  s.clear();
  assert.equal(await work, false);
  d.resolve({
    dispose() {
      disposed++;
    },
  });
  await tick();
  assert.equal(disposed, 1);
  s.destroy();
});

test('[director-090] The session tolerates a null late handle', async () => {
  const d = deferred(),
    entered = deferred();
  const s = makeSession(asset, () => {
    entered.resolve();
    return d.promise;
  });
  const work = s.load([pack()]);
  await entered.promise;
  s.clear();
  assert.equal(await work, false);
  d.resolve(null);
  await tick();
  s.destroy();
  assert.equal(s.getState().status, 'idle');
});

test('[director-090] The session destroys pending work', async () => {
  const d = deferred();
  const s = makeSession(() => d.promise);
  const work = s.load([pack()]);
  s.destroy();
  assert.equal(await work, false);
  d.resolve(asset());
  await tick();
  assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
});

test('[director-091] The replacement keeps its own resources', async () => {
  const d = deferred();
  let calls = 0,
    disposed = 0;
  const s = makeSession(
    () => (++calls === 1 ? d.promise : asset()),
    () => ({
      dispose() {
        disposed++;
      },
    }),
  );
  const old = s.load([pack()]);
  assert.equal(await s.load([pack()]), true);
  assert.equal(await old, false);
  d.resolve(asset());
  await tick();
  assert.deepEqual(s.getState(), { status: 'ready', count: 1 });
  assert.equal(disposed, 0);
  s.destroy();
  assert.equal(disposed, 1);
});

test('[director-092] The session reports a stable source error', async () => {
  const s = makeSession(() => Promise.reject(new Error('secret')));
  await assert.rejects(s.load([pack()]), {
    message:
      'Data pack could not load: check its source, format, size or integrity',
  });
  assert.equal(s.getState().status, 'idle');
  s.destroy();
});

test('[director-092] The deadline rejects stalled work', async () => {
  const s = makeSession(() => new Promise(() => {}), undefined, {
    timeoutMs: 1,
  });
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
  assert.equal(s.getState().count, 0);
});

test('[director-092] The session rejects absent source', async () => {
  const s = createDataPackSession({
    sources: {},
    adapters: { geojson: () => ({ dispose() {} }) },
  });
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
});

test('[director-092] The session rejects absent adapter', async () => {
  const s = createDataPackSession({ sources: { assets: asset }, adapters: {} });
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects byte type', async () => {
  const s = makeSession(() => ({ bytes: [1, 2, 3] }));
  await assert.rejects(s.load([{ ...pack() }]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects byte empty', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array() }));
  await assert.rejects(s.load([{ ...pack() }]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects byte size', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array(8388609) }));
  await assert.rejects(s.load([{ ...pack() }]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects byte declared size', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array([1]) }));
  await assert.rejects(
    s.load([{ ...pack(), byteLength: 2 }]),
    /could not load/,
  );
  s.destroy();
});

test('[director-093] The session rejects total byte excess', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array(8388608) }));
  await assert.rejects(
    s.load(Array.from({ length: 5 }, (_, i) => ({ ...pack(), id: String(i) }))),
    /could not load/,
  );
  assert.equal(s.getState().count, 0);
  s.destroy();
});

test('[director-093] The session rejects a wrong digest', async () => {
  const s = makeSession();
  await assert.rejects(
    s.load([{ ...pack(), sha256: '0'.repeat(64) }]),
    /could not load/,
  );
  s.destroy();
});

test('[director-093] The session checks exact bytes and digest', async () => {
  let options;
  const s = makeSession((o) => {
    options = o;
    return asset();
  });
  assert.equal(
    await s.load([
      {
        ...pack(),
        byteLength: 3,
        sha256:
          '039058c6f2c0cb492c533b0a4d14ef77cc0f78abccced5287d84a1a2011cfb81',
      },
    ]),
    true,
  );
  assert.equal(options.maxBytes, 3);
  s.destroy();
});

test('[director-089] The session rejects handle null', async () => {
  const s = makeSession(asset, () => null);
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
});

test('[director-089] The session rejects handle disposal', async () => {
  const s = makeSession(asset, () => ({}));
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
});

test('[director-094] The directory rejects protocol', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'ftp://example.org/a/',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-094] The directory rejects username', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'https://u@example.org/a/',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-094] The directory rejects password', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'https://:p@example.org/a/',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-094] The directory rejects query', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'https://example.org/a/?q=1',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-094] The directory rejects fragment', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'https://example.org/a/#x',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-094] The directory rejects directory', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'https://example.org/a',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-095] The request sets its own options', async () => {
  let request;
  const source = createAssetDirectorySource({
    baseUrl: 'https://example.org/a/',
    fetchImpl: async (...args) => {
      request = args;
      return response();
    },
  });
  assert.deepEqual(await source({ path: 'b/c.json' }), {
    bytes: new Uint8Array([1, 2, 3]),
    mimeType: 'application/json',
  });
  assert.equal(request[0], 'https://example.org/a/b/c.json');
  assert.deepEqual(Object.keys(request[1]).sort(), [
    'cache',
    'credentials',
    'redirect',
    'referrerPolicy',
    'signal',
  ]);
  assert.equal(Object.hasOwn(request[1], 'cache'), true);
  assert.equal(request[1].cache, 'no-store');
  assert.equal(request[1].credentials, 'omit');
  assert.equal(request[1].redirect, 'error');
  assert.equal(request[1].referrerPolicy, 'no-referrer');
});

test('[director-096] The stream joins distinct chunks', async () => {
  const source = directory(() =>
    response([new Uint8Array([1]), new Uint8Array([2, 3])]),
  );
  assert.deepEqual(
    (await source({ path: 'x' })).bytes,
    new Uint8Array([1, 2, 3]),
  );
});

test('[director-096] The stream rejects excess header bytes', async () => {
  const source = directory(() => response([], { 'content-length': '4' }));
  await assert.rejects(source({ path: 'x', maxBytes: 3 }), /byte limit/);
});

test('[director-096] The stream rejects excess chunk bytes', async () => {
  const source = directory(() => response());
  await assert.rejects(source({ path: 'x', maxBytes: 2 }), /byte limit/);
});

test('[director-096] The stream uses absent MIME default', async () => {
  const source = directory(() => response([], {}));
  assert.equal((await source({ path: 'x' })).mimeType, '');
});

test('[director-096] The stream normalizes MIME text', async () => {
  const source = directory(() =>
    response([], { 'content-type': ' IMAGE/PNG ; extra=x' }),
  );
  assert.equal((await source({ path: 'x' })).mimeType, 'image/png');
});

test('[director-097] The source rejects an absent stream', async () => {
  const source = directory(() => ({ ok: true }));
  await assert.rejects(source({ path: 'x' }), /stream unavailable/);
});

test('[director-097] The source tolerates failed body cancellation', async () => {
  let cancelled = 0;
  const source = directory(() => ({
    ok: false,
    body: {
      cancel: () => {
        cancelled++;
        return Promise.reject(new Error('bad'));
      },
    },
  }));
  await assert.rejects(source({ path: 'x' }), /Asset unavailable/);
  assert.equal(cancelled, 1);
});

test('[director-097] The source rejects a failed response without a body', async () => {
  await assert.rejects(
    directory(() => ({ ok: false }))({ path: 'x' }),
    /Asset unavailable/,
  );
});

test('[director-097] The stream releases its lock after an error', async () => {
  let cancelled = 0,
    unlocked = 0;
  const source = directory(() => ({
    ok: true,
    headers: { get: () => null },
    body: {
      getReader: () => ({
        read: () => Promise.reject(new Error('read error')),
        cancel: () => {
          cancelled++;
          return Promise.reject(new Error('cancel error'));
        },
        releaseLock() {
          unlocked++;
        },
      }),
    },
  }));
  await assert.rejects(source({ path: 'x' }), /read error/);
  assert.equal(cancelled, 1);
  assert.equal(unlocked, 1);
});

test('[director-097] The source checks its signal between chunks', async () => {
  const c = new AbortController();
  let unlocked = 0;
  const source = directory(() => ({
    ok: true,
    headers: { get: () => null },
    body: {
      getReader: () => ({
        async read() {
          c.abort();
          return { done: false, value: new Uint8Array([1]) };
        },
        cancel: async () => {},
        releaseLock() {
          unlocked++;
        },
      }),
    },
  }));
  await assert.rejects(source({ path: 'x', signal: c.signal }), /abort/i);
  assert.equal(unlocked, 1);
});

test('[director-080] The image admits its bounds field', async () => {
  const a = imagePack();
  a.format = 'image';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-080] The image admits its height field', async () => {
  const a = imagePack();
  a.format = 'image';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-080] The image admits its altitudeReference field', async () => {
  const a = imagePack();
  a.format = 'image';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-081] The media admits its anchorId field', async () => {
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-077] The geojson admits its altitudeReference field', async () => {
  const a = pack();
  a.format = 'geojson';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-080] The image bounds 0 rejects low excess', async () => {
  const a = imagePack();
  a.placement.bounds[0] = -181;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[0\]/);
});

test('[director-080] The image bounds 0 rejects high excess', async () => {
  const a = imagePack();
  a.placement.bounds[0] = 181;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[0\]/);
});

test('[director-080] The image bounds 1 rejects low excess', async () => {
  const a = imagePack();
  a.placement.bounds[1] = -91;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[1\]/);
});

test('[director-080] The image bounds 1 rejects high excess', async () => {
  const a = imagePack();
  a.placement.bounds[1] = 91;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[1\]/);
});

test('[director-080] The image bounds 2 rejects low excess', async () => {
  const a = imagePack();
  a.placement.bounds[2] = -181;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[2\]/);
});

test('[director-080] The image bounds 2 rejects high excess', async () => {
  const a = imagePack();
  a.placement.bounds[2] = 181;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[2\]/);
});

test('[director-080] The image bounds 3 rejects low excess', async () => {
  const a = imagePack();
  a.placement.bounds[3] = -91;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[3\]/);
});

test('[director-080] The image bounds 3 rejects high excess', async () => {
  const a = imagePack();
  a.placement.bounds[3] = 91;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /bounds\[3\]/);
});

test('[director-080] The image height checks both limits', async () => {
  const a = imagePack();
  a.placement.height = 1000000001;
  assert.throws(() => validateDataPack(a, 'pack', new Set()), /height/);
  a.placement.height = -12000;
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
  a.placement.height = 1000000000;
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-082] The scene uses supplied anchors', async () => {
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  assert.doesNotThrow(() =>
    validateSceneDataPacks(
      { anchors: [{ id: 'a' }], dataPacks: [a], shots: [] },
      'scene',
    ),
  );
});

test('[director-082] The scene uses absent anchor defaults', async () => {
  assert.doesNotThrow(() =>
    validateSceneDataPacks({ dataPacks: [pack()], shots: [] }, 'scene'),
  );
});

test('[director-085] The position accepts both geographic edges', async () => {
  assert.deepEqual(
    geoFeatures([
      feature('a', 'Point', [-180, -90, -12000]),
      feature('b', 'Point', [180, 90, 1000000000]),
    ]).map((f) => f.coordinates),
    [
      [-180, -90, -12000],
      [180, 90, 1000000000],
    ],
  );
});

test('[director-088] The session state uses its idle default', async () => {
  assert.deepEqual(createDataPackSession().getState(), {
    status: 'idle',
    count: 0,
  });
});

test('[director-088] The session state uses its zero default', async () => {
  assert.equal(createDataPackSession().getState().count, 0);
});

test('[director-089] The session state uses its active total', async () => {
  const s = makeSession();
  await s.load([pack()]);
  assert.equal(s.getState().count, 1);
  s.destroy();
});

test('[director-093] The session uses its default byte budget', async () => {
  let budget;
  const s = makeSession((o) => {
    budget = o.maxBytes;
    return asset();
  });
  await s.load([pack()]);
  assert.equal(budget, 8388608);
  s.destroy();
});

test('[director-093] The session accepts absent declared size', async () => {
  const s = makeSession();
  assert.equal(await s.load([pack()]), true);
  s.destroy();
});

test('[director-090] The session catches signal state without an event', async () => {
  let aborted = false;
  const signal = {
    get aborted() {
      return aborted;
    },
    addEventListener() {},
    removeEventListener() {},
  };
  const s = makeSession(() => {
    aborted = true;
    return Promise.reject(new Error('source'));
  });
  assert.equal(await s.load([pack()], { signal }), false);
  s.destroy();
});

test('[director-090] The session catches destroyed state after signal access', async () => {
  let first = true;
  let s;
  const signal = {
    get aborted() {
      if (first) {
        first = false;
        s.destroy();
      }
      return false;
    },
    addEventListener() {},
    removeEventListener() {},
  };
  s = makeSession(() => Promise.reject(new Error('source')));
  assert.equal(await s.load([pack()], { signal }), false);
  assert.equal(s.getState().status, 'idle');
});

test('[director-090] The session catches replacement without signal state', async () => {
  const d = deferred();
  const s = makeSession(() => d.promise);
  const work = s.load([pack()]);
  s.clear();
  assert.equal(await work, false);
  d.resolve(asset());
  await tick();
});

test('[director-090] The session guard rejects a detached resource', async () => {
  const Native = globalThis.AbortController;
  let s,
    disposed = 0;
  globalThis.AbortController = class {
    signal = {
      aborted: false,
      addEventListener() {},
      removeEventListener() {},
      throwIfAborted() {},
    };
    abort() {}
  };
  try {
    s = makeSession(asset, () => ({
      get dispose() {
        s.clear();
        return () => {
          disposed++;
        };
      },
    }));
    assert.equal(await s.load([pack()]), false);
    assert.equal(disposed, 1);
  } finally {
    s?.destroy();
    globalThis.AbortController = Native;
  }
});

test('[director-090] The session guard disposes before handle ownership', async () => {
  const Native = globalThis.AbortController;
  let controller, s, total, status;
  globalThis.AbortController = class {
    constructor() {
      controller = this;
    }
    signal = {
      aborted: false,
      reason: new Error('stop'),
      addEventListener() {},
      removeEventListener() {},
      throwIfAborted() {
        if (this.aborted) throw this.reason;
      },
    };
    abort() {
      this.signal.aborted = true;
    }
  };
  try {
    s = makeSession(asset, () => ({
      get dispose() {
        controller.signal.aborted = true;
        return () => {
          total = s.getState().count;
          status = s.getState().status;
        };
      },
    }));
    await assert.rejects(s.load([pack()]), /could not load/);
    assert.equal(total, 0);
    assert.equal(status, 'loading');
  } finally {
    s?.destroy();
    globalThis.AbortController = Native;
  }
});

test('[director-092] The session ignores a late source error', async () => {
  const d = deferred();
  let reject;
  const work = new Promise((r, j) => {
    reject = j;
  });
  const s = makeSession(() => work);
  const load = s.load([pack()]);
  s.clear();
  assert.equal(await load, false);
  reject(new Error('late'));
  await tick();
  assert.equal(s.getState().status, 'idle');
});

test('[director-097] The source rejects early cancellation', async () => {
  const c = new AbortController();
  c.abort(new Error('stop'));
  let calls = 0;
  const source = directory(() => {
    calls++;
    return response();
  });
  await assert.rejects(source({ path: 'x', signal: c.signal }), /stop/);
  assert.equal(calls, 0);
});

test('[director-094] The directory accepts HTTP and HTTPS', async () => {
  assert.equal(
    typeof createAssetDirectorySource({
      baseUrl: 'http://example.org/a/',
      fetchImpl: () => assert.fail(),
    }),
    'function',
  );
  assert.equal(typeof directory(() => assert.fail()), 'function');
});

test('[director-092] The absent adapter does not call its source', async () => {
  let calls = 0;
  const s = createDataPackSession({
    sources: {
      assets: () => {
        calls++;
        return asset();
      },
    },
  });
  await assert.rejects(s.load([pack()]), /could not load/);
  assert.equal(calls, 0);
  s.destroy();
});

test('[director-095] The request owns its credentials option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'credentials'), true);
  assert.equal(opts.credentials, 'omit');
});

test('[director-095] The request owns its redirect option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'redirect'), true);
  assert.equal(opts.redirect, 'error');
});

test('[director-095] The request owns its referrerPolicy option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'referrerPolicy'), true);
  assert.equal(opts.referrerPolicy, 'no-referrer');
});

test('[director-095] The request owns its cache option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'cache'), true);
  assert.equal(opts.cache, 'no-store');
});

test('[director-085] The position rejects field 0 that is not finite', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', ['bad', 0, 0])]),
    /position/,
  );
});

test('[director-085] The position rejects field 1 that is not finite', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 'bad', 0])]),
    /position/,
  );
});

test('[director-085] The position rejects field 2 that is not finite', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 0, 'bad'])]),
    /position/,
  );
});

test('[director-096] The source checks its default byte budget', async () => {
  const source = directory(() => response([new Uint8Array(8388609)]));
  await assert.rejects(source({ path: 'x' }), /byte limit/);
});

test('[director-077] The manifest admits its pack id field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its pack version field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its pack format field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its pack source field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its pack attribution field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its pack placement field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-079] The manifest admits its pack byteLength field', async () => {
  const a = pack();
  a.byteLength = 3;
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-079] The manifest admits its pack sha256 field', async () => {
  const a = pack();
  a.sha256 = 'a'.repeat(64);
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its source adapter field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest admits its source path field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The manifest admits its attribution text field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The manifest admits its attribution license field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The manifest admits its attribution url field', async () => {
  const a = pack();
  a.attribution.url = 'https://example.org/a';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-092] The session settles an early internal signal', async () => {
  const Native = globalThis.AbortController;
  let controller, s;
  const d = deferred();
  globalThis.AbortController = class extends Native {
    constructor() {
      super();
      controller = this;
    }
  };
  let work,
    settled = false;
  try {
    s = makeSession(() => {
      controller.abort(new Error('stop'));
      return d.promise;
    });
    work = s.load([pack()]).catch((e) => {
      settled = true;
      return e;
    });
    await tick();
    assert.equal(settled, true);
    assert.equal(s.getState().status, 'idle');
  } finally {
    d.resolve(asset());
    s?.destroy();
    await work;
    globalThis.AbortController = Native;
  }
});

test('[director-081] The session gives anchors to its adapter', async () => {
  let received;
  const s = makeSession(asset, ({ anchors }) => {
    received = anchors;
    return { dispose() {} };
  });
  assert.equal(await s.load([pack()], { anchors: [{ id: 'a' }] }), true);
  assert.deepEqual(received, [{ id: 'a' }]);
  s.destroy();
});

test('[director-089] The session state uses its active status', async () => {
  const s = makeSession();
  await s.load([pack()]);
  assert.equal(s.getState().status, 'ready');
  s.destroy();
});

test('[director-080] The placement selects the image fields', async () => {
  const a = imagePack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-081] The placement selects the media fields', async () => {
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-089] The session loads its geojson format', async () => {
  let calls = 0;
  const a = pack();
  const s = createDataPackSession({
    sources: { assets: asset },
    adapters: {
      geojson: () => {
        calls++;
        return { dispose() {} };
      },
    },
  });
  assert.equal(await s.load([a], { anchors: [{ id: 'a' }] }), true);
  assert.equal(calls, 1);
  s.destroy();
});

test('[director-089] The session loads its image format', async () => {
  let calls = 0;
  const a = imagePack();
  const s = createDataPackSession({
    sources: { assets: asset },
    adapters: {
      image: () => {
        calls++;
        return { dispose() {} };
      },
    },
  });
  assert.equal(await s.load([a], { anchors: [{ id: 'a' }] }), true);
  assert.equal(calls, 1);
  s.destroy();
});

test('[director-089] The session loads its media format', async () => {
  let calls = 0;
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  const s = createDataPackSession({
    sources: { assets: asset },
    adapters: {
      media: () => {
        calls++;
        return { dispose() {} };
      },
    },
  });
  assert.equal(await s.load([a], { anchors: [{ id: 'a' }] }), true);
  assert.equal(calls, 1);
  s.destroy();
});

test('[director-097] The source stops between stream chunks', async () => {
  const c = new AbortController();
  let reads = 0,
    unlocked = 0;
  const source = directory(() => ({
    ok: true,
    headers: { get: () => null },
    body: {
      getReader: () => ({
        async read() {
          reads++;
          if (reads === 1) {
            c.abort(new Error('stop'));
            return { done: false, value: new Uint8Array([1]) };
          }
          return { done: true };
        },
        cancel: async () => {},
        releaseLock() {
          unlocked++;
        },
      }),
    },
  }));
  await assert.rejects(source({ path: 'x', signal: c.signal }), /stop/);
  assert.equal(reads, 1);
  assert.equal(unlocked, 1);
});

test('[director-092] The session settles a source error before its deadline', async () => {
  let settled = false;
  const s = makeSession(() => Promise.reject(new Error('source')));
  const work = s.load([pack()]).catch((e) => {
    settled = true;
    return e;
  });
  try {
    await tick();
    assert.equal(settled, true);
    assert.equal(s.getState().status, 'idle');
  } finally {
    s.destroy();
  }
});

test('[director-092] The session uses its supplied deadline', async () => {
  let callback, delay;
  const nativeSet = globalThis.setTimeout,
    nativeClear = globalThis.clearTimeout;
  let s, work;
  globalThis.setTimeout = (fn, ms) => {
    callback = fn;
    delay = ms;
    return 7;
  };
  globalThis.clearTimeout = () => {};
  try {
    s = makeSession(() => new Promise(() => {}), undefined, { timeoutMs: 19 });
    work = s.load([pack()]);
    assert.equal(delay, 19);
    callback();
    await assert.rejects(work, /could not load/);
  } finally {
    s?.destroy();
    globalThis.setTimeout = nativeSet;
    globalThis.clearTimeout = nativeClear;
  }
});

test('[director-092] The session uses its default deadline', async () => {
  let callback, delay;
  const nativeSet = globalThis.setTimeout,
    nativeClear = globalThis.clearTimeout;
  let s, work;
  globalThis.setTimeout = (fn, ms) => {
    callback = fn;
    delay = ms;
    return 7;
  };
  globalThis.clearTimeout = () => {};
  try {
    s = makeSession(() => new Promise(() => {}));
    work = s.load([pack()]);
    assert.equal(delay, 15000);
    callback();
    await assert.rejects(work, /could not load/);
  } finally {
    s?.destroy();
    globalThis.setTimeout = nativeSet;
    globalThis.clearTimeout = nativeClear;
  }
});

test('[director-092] The session removes resources after a later error', async () => {
  let disposed = 0,
    calls = 0;
  const s = makeSession(
    () => {
      if (++calls === 2) throw new Error('secret');
      return asset();
    },
    () => ({
      dispose() {
        disposed++;
      },
    }),
  );
  await assert.rejects(
    s.load([pack(), { ...pack(), id: 'b' }]),
    /could not load/,
  );
  assert.equal(disposed, 1);
  assert.equal(s.getState().count, 0);
  s.destroy();
});

test('[director-089] The session rejects a falsy handle with inherited disposal', async () => {
  const saved = Object.getOwnPropertyDescriptor(Number.prototype, 'dispose');
  Object.defineProperty(Number.prototype, 'dispose', {
    configurable: true,
    value() {},
  });
  const s = makeSession(asset, () => 0);
  try {
    await assert.rejects(s.load([pack()]), /could not load/);
  } finally {
    s.destroy();
    if (saved) Object.defineProperty(Number.prototype, 'dispose', saved);
    else delete Number.prototype.dispose;
  }
});

test('[director-083] The collection accepts its exact feature limit', async () => {
  const features = Array.from({ length: 2000 }, (_, i) => feature(String(i)));
  assert.equal(geoFeatures(features).length, 2000);
});

test('[director-084] The feature ID accepts its exact text limit', async () => {
  assert.equal(geoFeatures([feature('a'.repeat(256))])[0].id.length, 256);
});

test('[director-085] The position accepts its exact total limit', async () => {
  assert.equal(
    geoFeatures([
      feature(
        'p',
        'LineString',
        Array.from({ length: 50000 }, () => [0, 0]),
      ),
    ])[0].coordinates.length,
    50000,
  );
});

test('[director-087] The polygon accepts its exact ring limit', async () => {
  const rings = Array.from({ length: 128 }, () => [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 0],
  ]);
  assert.equal(
    geoFeatures([feature('p', 'Polygon', rings)])[0].coordinates.length,
    128,
  );
});

test('[director-076] The asset path checks its text limit', async () => {
  assert.doesNotThrow(() => validateAssetPath('x'.repeat(1024)));
  assert.throws(() => validateAssetPath('x'.repeat(1025)), /1024/);
});

test('[director-089] The session owns every pack handle', async () => {
  const disposed = [];
  const s = makeSession(asset, ({ pack }) => ({
    dispose() {
      disposed.push(pack.id);
    },
  }));
  await s.load([pack(), { ...pack(), id: 'b' }]);
  s.clear();
  assert.deepEqual(disposed, ['b', 'outline']);
  s.destroy();
});

test('[director-095] The request owns its signal option', async () => {
  let options;
  const source = directory(async (url, o) => {
    options = o;
    return response();
  });
  await source({ path: 'x', signal: { token: 's', throwIfAborted() {} } });
  assert.equal(Object.hasOwn(options, 'signal'), true);
  assert.equal(options.signal.token, 's');
});

test('[director-096] The stream accepts its exact byte limit', async () => {
  const source = directory(() =>
    response([new Uint8Array([1, 2, 3])], {
      'content-length': '3',
      'content-type': 'image/png',
    }),
  );
  assert.deepEqual(
    (await source({ path: 'x', maxBytes: 3 })).bytes,
    new Uint8Array([1, 2, 3]),
  );
});

test('[director-092] The session rejects a falsy custom source', async () => {
  let calls = 0;
  const s = createDataPackSession({
    sources: { assets: 0 },
    adapters: {
      geojson: () => {
        calls++;
        return { dispose() {} };
      },
    },
  });
  await assert.rejects(s.load([pack()]), {
    message:
      'Data pack could not load: check its source, format, size or integrity',
  });
  assert.equal(calls, 0);
  assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
  s.destroy();
});

test('[director-092] The missing source stops after the validation size read', async () => {
  let reads = 0;
  const value = pack();
  Object.defineProperty(value, 'byteLength', {
    enumerable: true,
    get() {
      reads += 1;
      return 100;
    },
  });
  const session = createDataPackSession({
    sources: {},
    adapters: { geojson: () => ({ dispose() {} }) },
  });
  await assert.rejects(session.load([value]), {
    message: 'Data pack could not load: check its source, format, size or integrity',
  });
  assert.equal(reads, 1);
  assert.deepEqual(session.getState(), { status: 'idle', count: 0 });
});
