import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSceneBundle,
  parseSceneShare,
  readSceneShare,
  createBundleAssets,
  BUNDLE_SOURCE,
} from './bundle.js';
import { describeSceneShare } from './preview.js';
import { editSceneDetails, selectSceneDocument } from '../authoring.js';
const bytes = new TextEncoder().encode(
  JSON.stringify({ type: 'FeatureCollection', features: [] }),
);
const fixture = () => ({
  version: 6,
  scenes: [
    {
      id: 'one',
      title: 'Example',
      dataPacks: [
        {
          id: 'data',
          version: 1,
          format: 'geojson',
          source: { adapter: 'assets', path: 'test/data.geojson' },
          attribution: {
            text: 'Example author',
            license: 'CC0-1.0',
            url: 'https://example.org/source',
          },
          placement: { altitudeReference: 'ellipsoid' },
        },
      ],
      shots: [
        {
          id: 'shot',
          title: 'Original',
          durationSec: 3,
          holdSec: 2,
          camera: { lat: 1, lon: 2, alt: 300, pitch: -60 },
          layers: { traffic: false },
          dataPackIds: ['data'],
        },
      ],
    },
    { id: 'other', shots: [] },
  ],
});
const asset = () => ({
  bytes: bytes.slice(),
  mimeType: 'application/geo+json',
});

test('[director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request', async () => {
  const original = fixture(),
    before = JSON.stringify(original);
  let reads = 0;
  const text = await createSceneBundle(
    selectSceneDocument(original, 'one'),
    () => {
      reads++;
      return asset();
    },
  );
  const parsed = await parseSceneShare(text);
  assert.equal(reads, 1);
  assert.equal(JSON.stringify(original), before);
  assert.equal(parsed.project.scenes.length, 1);
  const pack = parsed.project.scenes[0].dataPacks[0];
  assert.equal(pack.source.adapter, 'scene-bundle');
  assert.equal(pack.byteLength, 42);
  assert.deepEqual(
    pack.attribution,
    original.scenes[0].dataPacks[0].attribution,
  );
  assert.deepEqual(
    parsed.assets.get(pack.source.path).bytes,
    new Uint8Array([
      123, 34, 116, 121, 112, 101, 34, 58, 34, 70, 101, 97, 116, 117, 114, 101,
      67, 111, 108, 108, 101, 99, 116, 105, 111, 110, 34, 44, 34, 102, 101, 97,
      116, 117, 114, 101, 115, 34, 58, 91, 93, 125,
    ]),
  );
});

test('[director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity', async () => {
  const valid = JSON.parse(await createSceneBundle(fixture(), () => asset()));
  const mutations = [
    (b) => (b.version = 2),
    (b) => (b.assets[0].path = '../secret'),
    (b) => (b.assets[0].base64 = 'A==='),
    (b) => (b.assets[0].base64 = '____'),
    (b) => (b.assets[0].base64 = btoa('different')),
    (b) => (b.assets[0].headers = {}),
    (b) => (b.assets[0].mimeType = 'text/html'),
    (b) => b.assets.push(b.assets[0]),
    (b) => (b.assets = []),
    (b) => (b.project.scenes[0].dataPacks[0].source.adapter = 'assets'),
    (b) => (b.project.scenes[0].dataPacks = []),
    (b) => (b.project.scenes[0].dataPacks[0].sha256 = '0'.repeat(64)),
    (b) => (b.assets = Array.from({ length: 65 }, () => b.assets[0])),
  ];
  for (const mutate of mutations) {
    const b = structuredClone(valid);
    mutate(b);
    await assert.rejects(parseSceneShare(JSON.stringify(b)));
  }
});

test('[director-102] The bundle checks asset limits and declared integrity before export', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array(8 * 1024 * 1024 + 1),
      mimeType: 'image/png',
    })),
    /limit/,
  );
  const p = fixture();
  p.scenes[0].dataPacks[0].sha256 = '0'.repeat(64);
  await assert.rejects(
    createSceneBundle(p, () => asset()),
    /integrity/,
  );
  await assert.rejects(
    createSceneBundle(fixture(), () => null),
    /select a file/,
  );
});

test('[director-103] The data packs with the same path share one asset and reject integrity values that differ', async () => {
  const p = fixture();
  p.scenes[0].dataPacks.push({
    ...structuredClone(p.scenes[0].dataPacks[0]),
    id: 'second',
  });
  let reads = 0;
  const text = await createSceneBundle(p, () => {
    reads++;
    return asset();
  });
  assert.equal(reads, 1);
  assert.equal((await parseSceneShare(text)).assets.size, 1);
  p.scenes[0].dataPacks[1].byteLength = 1;
  await assert.rejects(
    createSceneBundle(p, () => asset()),
    /integrity/,
  );
});

test('[director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes', () => {
  const p = fixture();
  const report = describeSceneShare(
    { project: p, assets: new Map() },
    { sourceIds: [], layerIds: [] },
  );
  assert.equal(report.packs[0].status, 'Source unavailable');
  assert.deepEqual(report.missingLayers, ['traffic']);
  p.scenes[0].dataPacks[0].source.adapter = BUNDLE_SOURCE;
  assert.match(
    describeSceneShare({ project: p, assets: new Map() }).packs[0].status,
    /Missing bundle/,
  );
});

test('[director-104] The bundle byte store removes old data after replacement and uses no network source', async () => {
  const parsed = await parseSceneShare(
    await createSceneBundle(fixture(), () => asset()),
  );
  const store = createBundleAssets();
  store.replace(parsed.assets);
  const path = parsed.project.scenes[0].dataPacks[0].source.path;
  const first = store.source({ path });
  first.bytes[0] = 0;
  assert.deepEqual(
    store.source({ path }).bytes,
    new Uint8Array([
      123, 34, 116, 121, 112, 101, 34, 58, 34, 70, 101, 97, 116, 117, 114, 101,
      67, 111, 108, 108, 101, 99, 116, 105, 111, 110, 34, 44, 34, 102, 101, 97,
      116, 117, 114, 101, 115, 34, 58, 91, 93, 125,
    ]),
  );
  const controller = new AbortController();
  controller.abort();
  assert.throws(() => store.source({ path, signal: controller.signal }));
  store.clear();
  assert.deepEqual(store.getState(), { count: 0, bytes: 0 });
  assert.throws(() => store.source({ path }), /unavailable/);
});

test('[director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file', async () => {
  let reads = 0;
  await assert.rejects(
    readSceneShare({
      name: 'large.json',
      size: 6 * 1024 * 1024,
      text: () => {
        reads++;
      },
    }),
    /5 MiB/,
  );
  await assert.rejects(
    readSceneShare({
      name: 'large.gevbundle.json',
      size: 52428801,
      text: () => {
        reads++;
      },
    }),
    /50 MiB/,
  );
  assert.equal(reads, 0);
  let resolve;
  const owner = new AbortController();
  const work = readSceneShare(
    { name: 'pending.json', text: () => new Promise((r) => (resolve = r)) },
    { signal: owner.signal },
  );
  owner.abort();
  await assert.rejects(work, /abort/i);
  resolve(JSON.stringify(fixture()));
});

test('[director-107] The cancelled bundle export stops before the next asset and returns no partial output', async () => {
  let resolve;
  const owner = new AbortController();
  const work = createSceneBundle(
    fixture(),
    () => new Promise((r) => (resolve = r)),
    { signal: owner.signal },
  );
  owner.abort();
  await assert.rejects(work, /abort/i);
  resolve(asset());
});

test('details editing preserves content IDs, layers and provenance, rejects invalid drafts atomically', () => {
  const p = fixture(),
    before = JSON.stringify(p);
  p.scenes[0].shots[0].sourcePackId = 'existing';
  const scene = p.scenes[0],
    shot = scene.shots[0];
  const edited = editSceneDetails(
    p,
    'one',
    'shot',
    {
      anchors: [
        { id: 'a', lat: 1, lon: 2, alt: 400, altitudeReference: 'ellipsoid' },
      ],
      dataPacks: scene.dataPacks,
    },
    {
      camera: { anchorId: 'a' },
      durationSec: 4,
      holdSec: 0,
      dataPackIds: ['data'],
    },
  );
  assert.equal(edited.scenes[0].shots[0].sourcePackId, 'existing');
  assert.deepEqual(edited.scenes[0].shots[0].layers, shot.layers);
  assert.equal(edited.scenes[0].shots[0].id, 'shot');
  assert.throws(() =>
    editSceneDetails(
      p,
      'one',
      'shot',
      { anchors: [] },
      { camera: { anchorId: 'missing' } },
    ),
  );
  assert.throws(() =>
    editSceneDetails(p, 'one', 'shot', { source: 'remote' }, {}),
  );
  assert.throws(() =>
    editSceneDetails(p, 'one', 'shot', {}, { sourcePackId: 'replacement' }),
  );
  delete p.scenes[0].shots[0].sourcePackId;
  assert.equal(JSON.stringify(p), before);
});

test('[director-101] The bundle accepts long valid source asset names', async () => {
  const p = fixture();
  p.scenes[0].dataPacks[0].source.path = 'x'.repeat(1024);
  const parsed = await parseSceneShare(
    await createSceneBundle(p, () => asset()),
  );
  assert.equal(parsed.assets.size, 1);
});

import { withShareSignal } from './lifetime.js';
const shareDeferred = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { resolve, promise };
};
const bundleObject = async (p = fixture()) =>
  JSON.parse(await createSceneBundle(p, asset));
const manyPacks = (n) => {
  const scenes = [];
  for (let i = 0; i < n; i++) {
    const p = structuredClone(fixture().scenes[0].dataPacks[0]);
    p.id = `p${i}`;
    p.source.path = `data/${i}.json`;
    const j = Math.floor(i / 8);
    if (!scenes[j]) scenes[j] = { id: `s${j}`, dataPacks: [], shots: [] };
    scenes[j].dataPacks.push(p);
  }
  return { version: 6, scenes };
};
test('[director-098] The share helpers reject nontext input', async () => {
  await assert.rejects(parseSceneShare({}), /share exceeds/);
});

test('[director-098] The share helpers reject invalid JSON', async () => {
  await assert.rejects(parseSceneShare('{'), /invalid JSON/);
});

test('[director-098] The share helpers accept plain project JSON', async () => {
  const v = await parseSceneShare(JSON.stringify({ version: 6, scenes: [] }));
  assert.deepEqual(v.assets, new Map());
  assert.deepEqual(v.project, { version: 6, scenes: [] });
});

test('[director-098] The share helpers reject excess characters', async () => {
  const Native = globalThis.TextEncoder;
  let calls = 0;
  globalThis.TextEncoder = class {
    encode() {
      calls++;
      return new Uint8Array();
    }
  };
  try {
    await assert.rejects(
      parseSceneShare(' '.repeat(52428801)),
      /share exceeds 50 MiB/,
    );
    assert.equal(calls, 0);
  } finally {
    globalThis.TextEncoder = Native;
  }
});

test('[director-098] The share helpers reject excess UTF8 bytes', async () => {
  await assert.rejects(
    parseSceneShare('é'.repeat(26214401)),
    /share exceeds 50 MiB/,
  );
});

test('[director-099] The base64 rejects invalid type', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = 7;
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /invalid or oversized base64 asset/,
  );
});

test('[director-099] The base64 rejects invalid empty', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = '';
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /invalid or oversized base64 asset/,
  );
});

test('[director-099] The base64 rejects invalid length', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = 'A'.repeat(11184816);
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /invalid or oversized base64 asset/,
  );
});

test('[director-099] The base64 rejects invalid alignment', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = 'AAA';
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /invalid or oversized base64 asset/,
  );
});

test('[director-099] The base64 rejects invalid alphabet', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = '____';
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /invalid or oversized base64 asset/,
  );
});

test('[director-099] The base64 rejects invalid padding', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = 'A===';
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /invalid or oversized base64 asset/,
  );
});

test('[director-099] The bundle rejects duplicate paths', async () => {
  const b = await bundleObject();
  b.assets.push(b.assets[0]);
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /duplicate asset path/,
  );
});

test('[director-099] The bundle rejects unsupported MIME', async () => {
  const b = await bundleObject();
  b.assets[0].mimeType = 'text/html';
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /unsupported media type/,
  );
});

test('[director-099] The bundle rejects unsupported version', async () => {
  const b = await bundleObject();
  b.version = 2;
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /unsupported bundle version/,
  );
});

test('[director-100] The bundle rejects an absent asset', async () => {
  const b = await bundleObject();
  b.assets = [];
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /missing or mismatched bundle asset/,
  );
});

test('[director-100] The bundle rejects a wrong asset length', async () => {
  const b = await bundleObject();
  b.project.scenes[0].dataPacks[0].byteLength = 1;
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /missing or mismatched bundle asset/,
  );
});

test('[director-100] The bundle rejects a wrong asset digest', async () => {
  const b = await bundleObject();
  b.project.scenes[0].dataPacks[0].sha256 = '0'.repeat(64);
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /missing or mismatched bundle asset/,
  );
});

test('[director-100] The bundle rejects wrong asset digest', async () => {
  const b = await bundleObject();
  b.assets[0].sha256 = '0'.repeat(64);
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /asset integrity mismatch/,
  );
});

test('[director-100] The bundle rejects unused assets', async () => {
  const b = await bundleObject();
  b.project.scenes[0].dataPacks = [];
  b.project.scenes[0].shots[0].dataPackIds = [];
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /unreferenced bundle asset/,
  );
});

test('[director-100] The bundle rejects external data pack sources', async () => {
  const b = await bundleObject();
  b.project.scenes[0].dataPacks[0].source.adapter = 'assets';
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /include every declared pack/,
  );
});

test('[director-101] The export writes exact bundle metadata', async () => {
  const original = fixture();
  const before = JSON.stringify(original);
  const b = await bundleObject(original);
  const p = b.project.scenes[0].dataPacks[0];
  assert.equal(p.source.adapter, 'scene-bundle');
  assert.equal(p.source.path, 'files/0-data.geojson');
  assert.equal(p.byteLength, 42);
  assert.equal(
    p.sha256,
    'ed778c73ea51338d6576fb5992b189f2b94d9f3d5e199f46c1af520d6b0b3e6c',
  );
  assert.equal(
    b.assets[0].base64,
    'eyJ0eXBlIjoiRmVhdHVyZUNvbGxlY3Rpb24iLCJmZWF0dXJlcyI6W119',
  );
  assert.equal(Object.hasOwn(b.assets[0], 'byteLength'), false);
  assert.equal(JSON.stringify(original), before);
});

test('[director-102] The export rejects bytes that are not a Uint8Array', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => ({
      bytes: [1, 2, 3],
      mimeType: 'application/json',
    })),
    /asset byte limit/,
  );
});

test('[director-102] The export rejects an empty asset', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array(),
      mimeType: 'application/json',
    })),
    /asset byte limit/,
  );
});

test('[director-102] The export rejects an asset above the byte limit', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array(8388609),
      mimeType: 'application/json',
    })),
    /asset byte limit/,
  );
});

test('[director-102] The export rejects absent assets', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => null),
    /select a file/,
  );
});

test('[director-102] The export rejects declared byte length', async () => {
  const f = fixture(),
    p = f.scenes[0].dataPacks[0];
  p.byteLength = 1;
  await assert.rejects(
    createSceneBundle(f, asset),
    /selected file does not match/,
  );
});

test('[director-102] The export rejects declared digest', async () => {
  const f = fixture(),
    p = f.scenes[0].dataPacks[0];
  p.sha256 = '0'.repeat(64);
  await assert.rejects(
    createSceneBundle(f, asset),
    /selected file does not match/,
  );
});

test('[director-102] The export rejects excess total bytes', async () => {
  const f = manyPacks(5);
  await assert.rejects(
    createSceneBundle(f, () => ({
      bytes: new Uint8Array(8388608),
      mimeType: 'application/json',
    })),
    /asset byte limit/,
  );
});

test('[director-102] The export rejects excess asset total', async () => {
  const f = manyPacks(65);
  await assert.rejects(createSceneBundle(f, asset), /too many bundled assets/);
});

test('[director-103] The export reuses a shared asset', async () => {
  const f = fixture();
  f.scenes[0].dataPacks.push({
    ...structuredClone(f.scenes[0].dataPacks[0]),
    id: 'second',
  });
  let calls = 0;
  const b = JSON.parse(
    await createSceneBundle(f, () => {
      calls++;
      return asset();
    }),
  );
  assert.equal(calls, 1);
  assert.equal(b.assets.length, 1);
  assert.equal(
    b.project.scenes[0].dataPacks[1].source.path,
    'files/0-data.geojson',
  );
});

test('[director-103] The export rejects shared byte length', async () => {
  const f = fixture();
  const p = { ...structuredClone(f.scenes[0].dataPacks[0]), id: 'second' };
  p.byteLength = 1;
  f.scenes[0].dataPacks.push(p);
  await assert.rejects(
    createSceneBundle(f, asset),
    /conflicting shared asset integrity/,
  );
});

test('[director-103] The export rejects shared digest', async () => {
  const f = fixture();
  const p = { ...structuredClone(f.scenes[0].dataPacks[0]), id: 'second' };
  p.sha256 = '0'.repeat(64);
  f.scenes[0].dataPacks.push(p);
  await assert.rejects(
    createSceneBundle(f, asset),
    /conflicting shared asset integrity/,
  );
});

test('[director-104] The store copies the asset map', async () => {
  const s = createBundleAssets();
  const map = new Map([
    ['x', { bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/png' }],
    ['y', { bytes: new Uint8Array([4]), mimeType: 'image/png' }],
  ]);
  s.replace(map);
  map.clear();
  s.snapshot().clear();
  assert.deepEqual(s.getState(), { count: 2, bytes: 4 });
  s.replace();
  assert.deepEqual(s.getState(), { count: 0, bytes: 0 });
});

test('[director-104] The store clears stored bytes', async () => {
  const s = createBundleAssets();
  s.replace(new Map([['x', asset()]]));
  s.clear();
  assert.deepEqual(s.getState(), { count: 0, bytes: 0 });
});

test('[director-105] The store rejects absent bytes', async () => {
  const s = createBundleAssets();
  assert.throws(
    () => s.source({ path: 'x', maxBytes: 2 }),
    /Bundle asset unavailable/,
  );
});

test('[director-105] The store rejects bytes above the caller limit', async () => {
  const s = createBundleAssets();
  s.replace(
    new Map([
      ['x', { bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/png' }],
    ]),
  );
  assert.throws(
    () => s.source({ path: 'x', maxBytes: 2 }),
    /Bundle asset unavailable/,
  );
});

test('[director-105] The store returns an independent byte copy', async () => {
  const s = createBundleAssets();
  s.replace(
    new Map([
      ['x', { bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/png' }],
    ]),
  );
  s.source({ path: 'x' }).bytes[0] = 9;
  assert.deepEqual(s.source({ path: 'x' }), {
    bytes: new Uint8Array([1, 2, 3]),
    mimeType: 'image/png',
  });
});

test('[director-106] The reader accepts an absent filename', async () => {
  const v = await readSceneShare({
    size: 2,
    text: async () => JSON.stringify({ version: 6, scenes: [] }),
  });
  assert.deepEqual(v.assets, new Map());
});

test('[director-106] The reader rejects the ordinary file budget', async () => {
  let calls = 0;
  await assert.rejects(
    readSceneShare({
      name: 'x.json',
      size: 5242881,
      text: () => {
        calls++;
      },
    }),
    /file exceeds 5 MiB/,
  );
  assert.equal(calls, 0);
});

test('[director-106] The reader gives bundles the larger budget', async () => {
  const v = await readSceneShare({
    name: 'x.gevbundle.json',
    size: 5242881,
    text: async () => JSON.stringify({ version: 6, scenes: [] }),
  });
  assert.equal(v.assets.size, 0);
  await assert.rejects(
    readSceneShare({
      name: 'x.gevbundle.json',
      size: 52428801,
      text: () => assert.fail(),
    }),
    /share exceeds 50 MiB/,
  );
});

test('[director-107] The helper resolves without a signal', async () => {
  assert.equal(await withShareSignal(Promise.resolve(7)), 7);
});

test('[director-107] The helper rejects an early signal', async () => {
  const c = new AbortController();
  c.abort(new Error('early'));
  await assert.rejects(
    withShareSignal(Promise.reject(new Error('work')), c.signal),
    /early/,
  );
});

test('[director-107] The helper resolves with an active signal', async () => {
  const c = new AbortController();
  assert.equal(await withShareSignal(Promise.resolve(7), c.signal), 7);
});

test('[director-107] The helper rejects a work error', async () => {
  const c = new AbortController();
  await assert.rejects(
    withShareSignal(Promise.reject(new Error('work')), c.signal),
    /work/,
  );
});

test('[director-107] The helper checks signal state at settlement', async () => {
  const listeners = new Set();
  const signal = {
    aborted: false,
    reason: new Error('late'),
    addEventListener(t, f) {
      listeners.add(f);
    },
    removeEventListener(t, f) {
      listeners.delete(f);
    },
  };
  const d = shareDeferred();
  const work = withShareSignal(d.promise, signal);
  signal.aborted = true;
  d.resolve(7);
  await assert.rejects(work, /late/);
  assert.equal(listeners.size, 0);
});

test('[director-107] The helper cancels work that is not complete', async () => {
  const c = new AbortController();
  const d = shareDeferred();
  const work = withShareSignal(d.promise, c.signal);
  c.abort(new Error('stop'));
  await assert.rejects(work, /stop/);
  d.resolve(7);
});

test('[director-108] The preview reports exact totals and attribution', async () => {
  const f = fixture();
  f.scenes[1].shots.push({ id: 'b' }, { id: 'c' });
  f.scenes.push({ id: 'third', shots: [] });
  const r = describeSceneShare({
    project: f,
    assets: new Map([
      ['x', { bytes: new Uint8Array([1, 2, 3]) }],
      ['y', { bytes: new Uint8Array([4]) }],
    ]),
  });
  assert.equal(r.scenes, 3);
  assert.equal(r.shots, 3);
  assert.equal(r.bundledBytes, 4);
  assert.equal(r.packs[0].scene, 'Example');
  assert.equal(r.packs[0].id, 'data');
  assert.equal(r.packs[0].path, 'test/data.geojson');
  assert.deepEqual(r.packs[0].attribution, {
    text: 'Example author',
    license: 'CC0-1.0',
    url: 'https://example.org/source',
  });
});

test('[director-108] The preview uses the scene ID without a title', async () => {
  const f = fixture();
  delete f.scenes[0].title;
  assert.equal(
    describeSceneShare({ project: f, assets: new Map() }).packs[0].scene,
    'one',
  );
});

test('[director-109] The preview reports included bundle bytes', async () => {
  const f = fixture();
  f.scenes[0].dataPacks[0].source.adapter = 'scene-bundle';
  assert.equal(
    describeSceneShare({
      project: f,
      assets: new Map([['test/data.geojson', asset()]]),
    }).packs[0].status,
    'Included in bundle',
  );
});

test('[director-109] The preview reports absent bundle bytes', async () => {
  const f = fixture();
  f.scenes[0].dataPacks[0].source.adapter = 'scene-bundle';
  assert.equal(
    describeSceneShare({ project: f, assets: new Map() }).packs[0].status,
    'Missing bundle file — reimport its bundle',
  );
});

test('[director-109] The preview reports a configured source', async () => {
  assert.equal(
    describeSceneShare(
      { project: fixture(), assets: new Map() },
      { sourceIds: ['assets'] },
    ).packs[0].status,
    'Source configured; file checked when loaded',
  );
});

test('[director-109] The preview reports an unavailable source', async () => {
  assert.equal(
    describeSceneShare({ project: fixture(), assets: new Map() }).packs[0]
      .status,
    'Source unavailable',
  );
});

test('[director-110] The preview lists distinct absent layers', async () => {
  const f = fixture();
  f.scenes[0].shots.push({ id: 'b', layers: { traffic: true, ships: false } });
  f.scenes[1].shots.push({ id: 'c', layers: { ships: true } });
  assert.deepEqual(
    describeSceneShare(
      { project: f, assets: new Map() },
      { layerIds: ['traffic'] },
    ).missingLayers,
    ['ships'],
  );
});

test('[director-110] The preview detects applied shot packs', async () => {
  const f = fixture();
  f.scenes[0].appliedShotPacks = ['x'];
  assert.equal(
    describeSceneShare({ project: f, assets: new Map() }).externalContent,
    true,
  );
});

test('[director-110] The preview detects a shot source pack ID', async () => {
  const f = fixture();
  f.scenes[0].shots[0].sourcePackId = 'x';
  assert.equal(
    describeSceneShare({ project: f, assets: new Map() }).externalContent,
    true,
  );
});

test('[director-110] The preview detects no external content', async () => {
  assert.equal(
    describeSceneShare({ project: fixture(), assets: new Map() })
      .externalContent,
    false,
  );
});

test('[director-098] The share character guard precedes byte conversion', async () => {
  const Native = globalThis.TextEncoder;
  let calls = 0;
  globalThis.TextEncoder = class {
    encode() {
      calls++;
      return new Uint8Array();
    }
  };
  try {
    await assert.rejects(
      parseSceneShare(' '.repeat(52428801)),
      /share exceeds 50 MiB/,
    );
    assert.equal(calls, 0);
  } finally {
    globalThis.TextEncoder = Native;
  }
});

test('[director-101] The export accepts scenes without data packs', async () => {
  const b = JSON.parse(
    await createSceneBundle(
      { version: 6, scenes: [{ id: 's', shots: [] }] },
      () => assert.fail(),
    ),
  );
  assert.deepEqual(b.assets, []);
});

test('[director-101] The export keeps a supplied data pack list', async () => {
  assert.equal((await bundleObject()).assets.length, 1);
});

test('[director-102] The export accepts absent integrity fields', async () => {
  assert.equal((await bundleObject()).assets.length, 1);
});

test('[director-102] The export accepts an absent digest', async () => {
  assert.equal((await bundleObject()).assets.length, 1);
});

test('[director-103] The shared export accepts absent byte declarations', async () => {
  const f = fixture();
  f.scenes[0].dataPacks.push({
    ...structuredClone(f.scenes[0].dataPacks[0]),
    id: 'b',
  });
  assert.equal((await bundleObject(f)).assets.length, 1);
});

test('[director-103] The shared export accepts an absent digest', async () => {
  const f = fixture();
  f.scenes[0].dataPacks.push({
    ...structuredClone(f.scenes[0].dataPacks[0]),
    id: 'b',
  });
  assert.equal((await bundleObject(f)).assets.length, 1);
});

test('[director-099] The base64 accepts bytes without padding', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1, 2, 3]),
      mimeType: 'application/json',
    })),
  );
  assert.deepEqual(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).bytes,
    new Uint8Array([1, 2, 3]),
  );
});

test('[director-108] The preview accepts absent data pack lists', async () => {
  assert.deepEqual(
    describeSceneShare({
      project: { scenes: [{ id: 's', shots: [] }] },
      assets: new Map(),
    }).packs,
    [],
  );
});

test('[director-108] The preview uses supplied data pack lists', async () => {
  assert.equal(
    describeSceneShare({ project: fixture(), assets: new Map() }).packs.length,
    1,
  );
});

test('[director-108] The preview keeps a supplied scene title', async () => {
  assert.equal(
    describeSceneShare({ project: fixture(), assets: new Map() }).packs[0]
      .scene,
    'Example',
  );
});

test('[director-109] The preview distinguishes bundle sources', async () => {
  const f = fixture();
  assert.equal(
    describeSceneShare(
      { project: f, assets: new Map([['test/data.geojson', asset()]]) },
      { sourceIds: ['assets'] },
    ).packs[0].status,
    'Source configured; file checked when loaded',
  );
});

test('[director-110] The preview accepts absent shot layers', async () => {
  assert.deepEqual(
    describeSceneShare({
      project: { scenes: [{ id: 's', shots: [{ id: 'a' }] }] },
      assets: new Map(),
    }).missingLayers,
    [],
  );
});

test('[director-110] The preview uses supplied shot layers', async () => {
  assert.deepEqual(
    describeSceneShare({ project: fixture(), assets: new Map() }).missingLayers,
    ['traffic'],
  );
});

test('[director-105] The store checks its default byte budget', async () => {
  const s = createBundleAssets();
  s.replace(
    new Map([['x', { bytes: new Uint8Array(8388609), mimeType: 'image/png' }]]),
  );
  assert.throws(() => s.source({ path: 'x' }), /unavailable/);
});

test('[director-099] The base64 rejects a custom text object', async () => {
  const b = await bundleObject();
  b.assets[0].base64 = { length: 4, marker: true };
  const oldString = Object.prototype.toString,
    oldIncludes = Object.getOwnPropertyDescriptor(Object.prototype, 'includes');
  Object.prototype.toString = function () {
    return this.marker ? 'AQ==' : oldString.call(this);
  };
  Object.defineProperty(Object.prototype, 'includes', {
    value: String.prototype.includes,
    configurable: true,
  });
  try {
    await assert.rejects(
      parseSceneShare(JSON.stringify(b)),
      /invalid or oversized base64 asset/,
    );
  } finally {
    Object.prototype.toString = oldString;
    if (oldIncludes)
      Object.defineProperty(Object.prototype, 'includes', oldIncludes);
    else delete Object.prototype.includes;
  }
});

test('[director-103] The export key uses the registered source name', async () => {
  const f = fixture();
  const p = { ...structuredClone(f.scenes[0].dataPacks[0]), id: 'b' };
  p.source.adapter = 'other';
  f.scenes[0].dataPacks.push(p);
  let calls = 0;
  const b = JSON.parse(
    await createSceneBundle(f, () => {
      calls++;
      return asset();
    }),
  );
  assert.equal(calls, 2);
  assert.equal(b.assets.length, 2);
});

test('[director-103] The export key uses path', async () => {
  const f = fixture();
  const p = { ...structuredClone(f.scenes[0].dataPacks[0]), id: 'b' };
  p.source.path = 'other/x.json';
  f.scenes[0].dataPacks.push(p);
  let calls = 0;
  const b = JSON.parse(
    await createSceneBundle(f, () => {
      calls++;
      return asset();
    }),
  );
  assert.equal(calls, 2);
  assert.equal(b.assets.length, 2);
});

test('[director-110] The preview detects each layer key', async () => {
  const f = fixture();
  f.scenes[0].shots[0].layers = { traffic: false, ships: false };
  assert.deepEqual(
    describeSceneShare(
      { project: f, assets: new Map() },
      { layerIds: ['traffic'] },
    ).missingLayers,
    ['ships'],
  );
});

test('[director-108] The preview totals include every asset', async () => {
  const r = describeSceneShare({
    project: { scenes: [] },
    assets: new Map([
      ['a', { bytes: new Uint8Array([1]) }],
      ['b', { bytes: new Uint8Array([2, 3]) }],
    ]),
  });
  assert.equal(r.bundledBytes, 3);
});

test('[director-100] The bundle checks its second asset reference', async () => {
  const f = fixture();
  const p = {
    ...structuredClone(f.scenes[0].dataPacks[0]),
    id: 'b',
    source: { adapter: 'assets', path: 'test/b.json' },
  };
  f.scenes[0].dataPacks.push(p);
  const b = await bundleObject(f);
  b.project.scenes[0].dataPacks[1].byteLength = 1;
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /missing or mismatched/,
  );
});

test('[director-100] The bundle checks its second asset digest', async () => {
  const f = fixture();
  f.scenes[0].dataPacks.push({
    ...structuredClone(f.scenes[0].dataPacks[0]),
    id: 'b',
    source: { adapter: 'assets', path: 'test/b.json' },
  });
  const b = await bundleObject(f);
  b.assets[1].sha256 = '0'.repeat(64);
  await assert.rejects(
    parseSceneShare(JSON.stringify(b)),
    /asset integrity mismatch/,
  );
});

test('[director-103] The export accepts equal shared integrity', async () => {
  const f = fixture();
  f.scenes[0].dataPacks[0].byteLength = 42;
  f.scenes[0].dataPacks[0].sha256 =
    'ed778c73ea51338d6576fb5992b189f2b94d9f3d5e199f46c1af520d6b0b3e6c';
  f.scenes[0].dataPacks.push({
    ...structuredClone(f.scenes[0].dataPacks[0]),
    id: 'b',
  });
  assert.equal((await bundleObject(f)).assets.length, 1);
});

test('[director-102] The export rejects absent asset bytes', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => ({ mimeType: 'application/json' })),
    /asset byte limit/,
  );
});

test('[director-106] The reader checks a signal after text access', async () => {
  let calls = 0;
  const signal = {
    throwIfAborted() {
      calls++;
    },
    aborted: false,
    addEventListener() {},
    removeEventListener() {},
  };
  const v = await readSceneShare(
    {
      name: 'x.json',
      size: 2,
      text: () => Promise.resolve(JSON.stringify({ version: 6, scenes: [] })),
    },
    { signal },
  );
  assert.equal(v.assets.size, 0);
  assert.equal(calls, 3);
});

test('[director-102] The export checks its encoded text budget', async () => {
  const Native = globalThis.TextEncoder;
  globalThis.TextEncoder = class extends Native {
    encode(text) {
      return text.startsWith('{"format":"gev-scene-bundle"')
        ? { length: 52428801 }
        : super.encode(text);
    }
  };
  try {
    await assert.rejects(
      createSceneBundle(fixture(), asset),
      /share exceeds 50 MiB/,
    );
  } finally {
    globalThis.TextEncoder = Native;
  }
});

test('[director-102] The export keeps its total after an absent length', async () => {
  let calls = 0;
  class Bytes extends Uint8Array {
    reads = 0;
    get length() {
      return ++this.reads === 1 ? undefined : super.length;
    }
  }
  const f = manyPacks(6);
  await assert.rejects(
    createSceneBundle(f, () => ({
      bytes:
        calls++ === 0
          ? new Bytes([1])
          : calls === 6
            ? new Uint8Array([1])
            : new Uint8Array(8388608),
      mimeType: 'application/json',
    })),
    /asset byte limit/,
  );
});

test('[director-099] The bundle accepts the application/json media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'application/json',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'application/json',
  );
});

test('[director-099] The bundle accepts the application/geo+json media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'application/geo+json',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'application/geo+json',
  );
});

test('[director-099] The bundle accepts the image/png media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'image/png',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'image/png',
  );
});

test('[director-099] The bundle accepts the video/mp4 media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'video/mp4',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'video/mp4',
  );
});

test('[director-099] The bundle accepts the video/webm media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'video/webm',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'video/webm',
  );
});

test('[director-099] The bundle accepts the audio/mpeg media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'audio/mpeg',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'audio/mpeg',
  );
});

test('[director-099] The bundle accepts the audio/ogg media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'audio/ogg',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'audio/ogg',
  );
});

test('[director-099] The bundle accepts the audio/wav media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'audio/wav',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'audio/wav',
  );
});

test('[director-099] The bundle accepts the audio/webm media type', async () => {
  const b = JSON.parse(
    await createSceneBundle(fixture(), () => ({
      bytes: new Uint8Array([1]),
      mimeType: 'audio/webm',
    })),
  );
  assert.equal(
    (await parseSceneShare(JSON.stringify(b))).assets.get(
      'files/0-data.geojson',
    ).mimeType,
    'audio/webm',
  );
});

test('[director-102] The export accepts its exact asset total', async () => {
  const b = JSON.parse(await createSceneBundle(manyPacks(64), asset));
  assert.equal(b.assets.length, 64);
});

test('[director-108] The preview counts shots apart from scenes', () => {
  const value = describeSceneShare({
    project: {
      scenes: [{ shots: [{}] }, { shots: [{}, {}, {}] }, { shots: [] }],
    },
    assets: new Map(),
  });
  assert.equal(value.scenes, 3);
  assert.equal(value.shots, 4);
});
test('[director-102] The export rejects an unsupported media type', async () => {
  await assert.rejects(
    createSceneBundle(fixture(), () => ({ ...asset(), mimeType: 'text/html' })),
    { message: 'assets: unsupported media type' },
  );
});
test('[director-099] The import rejects 65 different asset paths', async () => {
  const value = await bundleObject();
  value.assets = Array.from({ length: 65 }, (_, i) => ({
    ...value.assets[0],
    path: `files/${i}.json`,
  }));
  await assert.rejects(parseSceneShare(JSON.stringify(value)), {
    message: 'assets: expected an array of at most 64 entries',
  });
});
test('[director-105] The store rejects a cancelled asset call', () => {
  const store = createBundleAssets();
  store.replace(new Map([['x', asset()]]));
  const controller = new AbortController();
  controller.abort(new Error('stop'));
  assert.throws(() => store.source({ path: 'x', signal: controller.signal }), {
    message: 'stop',
  });
});
for (const [label, size, name] of [
  ['project', 5242880, 'x.json'],
  ['bundle', 52428800, 'x.gevbundle.json'],
]) {
  test(`[director-106] The reader accepts the ${label} file limit and rejects one more byte`, async () => {
    let calls = 0;
    const file = {
      name,
      size,
      text() {
        calls++;
        return Promise.resolve(JSON.stringify({ version: 6, scenes: [] }));
      },
    };
    assert.equal((await readSceneShare(file)).project.scenes.length, 0);
    assert.equal(calls, 1);
    file.size = size + 1;
    await assert.rejects(readSceneShare(file), {
      message:
        label === 'project'
          ? '$: file exceeds 5 MiB'
          : '$: share exceeds 50 MiB',
    });
    assert.equal(calls, 1);
  });
}
const byteProject = (sizes) => ({
  version: 6,
  scenes: [
    {
      id: 'one',
      dataPacks: sizes.map((size, i) => ({
        ...fixture().scenes[0].dataPacks[0],
        id: `data${i}`,
        source: { adapter: 'assets', path: `data/${i}.json` },
      })),
      shots: [],
    },
  ],
});
test('[director-102] The export accepts the asset byte limit', async () => {
  const value = JSON.parse(
    await createSceneBundle(byteProject([8388608]), () => ({
      bytes: new Uint8Array(8388608),
      mimeType: 'application/json',
    })),
  );
  assert.equal(value.project.scenes[0].dataPacks[0].byteLength, 8388608);
});
test('[director-102] The export accepts the total byte limit and rejects one more byte', async () => {
  const sizes = [8388608, 8388608, 8388608, 8388608];
  let i = 0;
  const resolve = () => ({
    bytes: new Uint8Array(sizes[i++]),
    mimeType: 'application/json',
  });
  assert.equal(
    JSON.parse(await createSceneBundle(byteProject(sizes), resolve)).assets
      .length,
    4,
  );
  sizes.push(1);
  i = 0;
  await assert.rejects(createSceneBundle(byteProject(sizes), resolve), {
    message: 'assets: asset byte limit exceeded',
  });
});
test('[director-099] The base64 accepts its length limit and rejects the next aligned length', async () => {
  const value = await bundleObject();
  value.assets[0].base64 = 'A'.repeat(11184812);
  await assert.rejects(parseSceneShare(JSON.stringify(value)), {
    message: 'assets: asset byte limit exceeded',
  });
  value.assets[0].base64 += 'AAAA';
  await assert.rejects(parseSceneShare(JSON.stringify(value)), {
    message: 'assets: invalid or oversized base64 asset',
  });
});
test('[director-099] The import accepts the total byte limit and rejects one more byte', async () => {
  const sizes = [8388608, 8388608, 8388608, 8388608];
  let i = 0;
  const resolve = () => ({
    bytes: new Uint8Array(sizes[i++]),
    mimeType: 'application/json',
  });
  const value = JSON.parse(
    await createSceneBundle(byteProject(sizes), resolve),
  );
  assert.equal((await parseSceneShare(JSON.stringify(value))).assets.size, 4);
  value.assets.push({
    path: 'files/extra.json',
    mimeType: 'application/json',
    base64: 'AA==',
    sha256: '0'.repeat(64),
  });
  await assert.rejects(parseSceneShare(JSON.stringify(value)), {
    message: 'assets: asset byte limit exceeded',
  });
});

for (const [label, call, stopAt] of [
  ['import before an asset', 'import', 2],
  ['import after a digest', 'import', 3],
  ['export before an asset', 'export', 1],
  ['export after asset bytes', 'export', 2],
  ['export after a digest', 'export', 3],
]) {
  test(`[director-107] The bundle stops ${label}`, async () => {
    const value =
      call === 'import' ? JSON.stringify(await bundleObject()) : fixture();
    let calls = 0,
      assets = 0,
      digests = 0;
    const nativeDigest = crypto.subtle.digest;
    crypto.subtle.digest = function (...args) {
      digests++;
      return nativeDigest.apply(this, args);
    };
    const signal = {
      aborted: false,
      addEventListener() {},
      removeEventListener() {},
      throwIfAborted() {
        if (++calls === stopAt) throw new Error('stop');
      },
    };
    try {
      await assert.rejects(
        call === 'import'
          ? parseSceneShare(value, { signal })
          : createSceneBundle(
              value,
              () => {
                assets++;
                return asset();
              },
              { signal },
            ),
        { message: 'stop' },
      );
      assert.equal(calls, stopAt);
      assert.equal(assets, call === 'import' || stopAt === 1 ? 0 : 1);
      assert.equal(digests, label.includes('after a digest') ? 1 : 0);
    } finally {
      crypto.subtle.digest = nativeDigest;
    }
  });
}
