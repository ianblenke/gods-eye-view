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
for (const character of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  test(`[director-076] The asset path accepts ${character} in both character positions`, () => {
    assert.doesNotThrow(() => validateAssetPath(character));
    assert.doesNotThrow(() => validateAssetPath('x' + character));
  });
}
test('[director-079] The manifest accepts each hexadecimal digest character', () => {
  const value = pack();
  value.sha256 = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  assert.doesNotThrow(() => validateDataPack(value, 'pack', new Set()));
});
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

test('[director-076] The validator rejects the path type before it reads a segment', () => {
  let reads = 0;
  const value = { split() { reads++; return ['x']; } };
  assert.throws(() => validateAssetPath(value), {
    message: 'source.path: expected nonempty text, at most 1024 characters',
  });
  assert.equal(reads, 0);
});

for (const [tags, label, alter, message] of [
  ['077', 'fields before ID', p => { p.extra = 1; p.id = ''; }, 'pack.extra: unsupported field'],
  ['077', 'ID before version', p => { p.id = ''; p.version = 2; }, 'pack.id: expected nonempty text, at most 256 characters'],
  ['077', 'version before format', p => { p.version = 2; p.format = 'bad'; }, 'pack.version: unsupported pack version'],
  ['077', 'format before source fields', p => { p.format = 'bad'; p.source.extra = 1; }, 'pack.format: unsupported pack format'],
  ['076 director-077', 'source name before path', p => { p.source.adapter = ''; p.source.path = '../x'; }, 'pack.source.adapter: expected nonempty text, at most 256 characters'],
  ['076 director-078', 'source path before attribution fields', p => { p.source.path = '../x'; p.attribution.extra = 1; }, 'pack.source.path: expected a relative asset path without URL syntax or traversal'],
  ['078', 'text before license', p => { p.attribution.text = ''; p.attribution.license = ''; }, 'pack.attribution.text: expected nonempty text, at most 4096 characters'],
  ['078', 'license before URL', p => { p.attribution.license = ''; p.attribution.url = 'bad'; }, 'pack.attribution.license: expected nonempty text, at most 4096 characters'],
  ['078 director-079', 'URL before byteLength', p => { p.attribution.url = 'bad'; p.byteLength = 0; }, 'pack.attribution.url: expected an HTTPS source link'],
  ['079', 'byteLength before digest', p => { p.byteLength = 0; p.sha256 = 'bad'; }, 'pack.byteLength: expected a number from 1 to 8388608'],
  ['080', 'bounds values before edge order', p => { p.placement.bounds = [181, 0, 1, 1]; }, 'pack.placement.bounds[0]: expected a number from -180 to 180'],
  ['080', 'edge order before height', p => { p.placement.bounds = [0, 0, 0, 1]; p.placement.height = 1000000001; }, 'pack.placement.bounds: expected increasing non-dateline bounds'],
]) {
  test(`[director-${tags}] The manifest checks ${label}`, () => {
    const p = tags === '080' ? imagePack() : pack();
    alter(p);
    assert.throws(() => validateDataPack(p, 'pack', new Set()), { message });
  });
}

test('[director-079] The validator checks the digest before it reads the placement', () => {
  const p = pack();
  p.sha256 = 'bad';
  let reads = 0;
  Object.defineProperty(p, 'placement', { enumerable: true, get() { reads++; return { altitudeReference: 'ellipsoid' }; } });
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.sha256: expected a lowercase SHA-256 digest' });
  assert.equal(reads, 0);
});

test('[director-080] The validator checks the height reference before it checks the bounds', () => {
  const p = imagePack(); p.placement.altitudeReference = 'bad'; p.placement.bounds = null;
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.placement.altitudeReference: expected ellipsoid height in meters' });
});

test('[director-080] The validator checks the bounds array before it reads the length', () => {
  let reads = 0;
  const p = imagePack(); p.placement.bounds = { get length() { reads++; return 4; } };
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.placement.bounds: expected an array of at most 4 entries' });
  assert.equal(reads, 0);
});

test('[director-080] The validator checks the bounds length before it checks each coordinate', () => {
  const p = imagePack(); p.placement.bounds = ['bad', 0, 1];
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.placement.bounds: expected west, south, east, north' });
});

test('[director-082] The validator checks the list before it reads the anchors', () => {
  let reads = 0;
  const scene = { dataPacks: null, shots: [], get anchors() { reads++; return []; } };
  assert.throws(() => validateSceneDataPacks(scene, '$'), { message: '$.dataPacks: expected an array of at most 8 entries' });
  assert.equal(reads, 0);
});

test('[director-077 director-082] The validator checks the declaration before it checks for duplicate IDs', () => {
  const second = pack();
  second.version = 2;
  assert.throws(() => validateSceneDataPacks({ dataPacks: [pack(), second], shots: [] }, '$'), {
    message: '$.dataPacks[1].version: unsupported pack version',
  });
});

test('[director-088] The session reads source entries before renderer entries', () => {
  const order = [];
  const sources = { get assets() { order.push('source'); return asset; } };
  const adapters = { get geojson() { order.push('renderer'); return () => ({ dispose() {} }); } };
  const s = createDataPackSession({ sources, adapters });
  try { assert.deepEqual(order, ['source', 'renderer']); }
  finally { s.destroy(); }
});

test('[director-097] The source waits for stream cancellation before it releases the reader lock', async () => {
  const order = [];
  const source = directory(async () => ({
    ok: true,
    headers: new Headers(),
    body: { getReader() { return {
      async read() { return { done: true }; },
      async cancel() { await tick(); order.push('cancelled'); },
      releaseLock() { order.push('released'); },
    }; } },
  }));
  await source({ path: 'x' });
  assert.deepEqual(order, ['cancelled', 'released']);
});

test('[director-097] The source waits for body cancellation before it rejects the asset request', async () => {
  let cancelled = false;
  const source = directory(async () => ({
    ok: false,
    body: { async cancel() { await tick(); cancelled = true; } },
  }));
  await assert.rejects(source({ path: 'x' }), { message: 'Asset unavailable' });
  assert.equal(cancelled, true);
});

test('[director-089] The source registers its listener and checks its state before it reads the work promise', async () => {
  const order = [];
  const aborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
  const s = makeSession(({ signal }) => {
    const add = signal.addEventListener.bind(signal);
    signal.addEventListener = (...args) => { order.push('listener'); add(...args); };
    Object.defineProperty(signal, 'aborted', { get() { order.push('state'); return aborted.call(signal); } });
    return { get then() { order.push('work'); return resolve => resolve(asset()); } };
  });
  try {
    assert.equal(await s.load([pack()]), true);
    assert.deepEqual(order.slice(0, 3), ['listener', 'state', 'work']);
  } finally { s.destroy(); }
});

test('[director-092] The session reads the source signal reason once during another source signal event', async () => {
  const d = deferred();
  let reads = 0, callback;
  const s = makeSession(({ signal }) => {
    const add = signal.addEventListener.bind(signal);
    signal.addEventListener = (type, fn, options) => { callback = fn; add(type, fn, options); };
    Object.defineProperty(signal, 'reason', { get() {
      if (++reads === 1) callback();
      return new Error('stop');
    } });
    return d.promise;
  });
  try {
    const work = s.load([pack()]);
    s.clear();
    assert.equal(await work, false);
    assert.equal(reads, 1);
    d.resolve(asset());
    await tick();
  } finally { s.destroy(); }
});

for (const mode of ['success', 'error']) {
  test(`[director-092] The source signal event during listener removal stops ${mode}`, async () => {
    let reads = 0, renders = 0, first = true;
    const s = makeSession(({ signal }) => {
      Object.defineProperty(signal, 'reason', { get() { reads++; return new Error('event'); } });
      const remove = signal.removeEventListener.bind(signal);
      signal.removeEventListener = (...args) => {
        if (first) { first = false; signal.dispatchEvent(new Event('abort')); }
        remove(...args);
      };
      return mode === 'success' ? asset() : Promise.reject(new Error('source'));
    }, () => { renders++; return { dispose() {} }; });
    try {
      await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
      assert.equal(reads, 1);
      assert.equal(renders, 0);
    } finally { s.destroy(); }
  });
}

test('[director-089] The completed source does not read its reason when the promise settles', async () => {
  let reads = 0, thenReads = 0, callback;
  const s = makeSession(({ signal }) => {
    const add = signal.addEventListener.bind(signal);
    signal.addEventListener = (type, fn, options) => { callback = fn; add(type, fn, options); };
    Object.defineProperty(signal, 'reason', { get() { reads++; return new Error('late'); } });
    const value = asset();
    Object.defineProperty(value, 'then', { get() { if (++thenReads === 2) callback(); return undefined; } });
    return value;
  });
  try {
    assert.equal(await s.load([pack()]), true);
    assert.equal(thenReads, 2);
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});

test('[director-089] The session removes resources after source cancellation and timer removal', async () => {
  const nativeSet = globalThis.setTimeout, nativeClear = globalThis.clearTimeout;
  const timer = {}, order = [], d = deferred();
  let calls = 0, state, s;
  globalThis.setTimeout = () => timer;
  globalThis.clearTimeout = handle => { if (handle === timer) order.push('timer'); };
  const caller = { aborted: false, addEventListener() {}, removeEventListener() { order.push('caller'); } };
  s = makeSession(({ signal }) => {
    if (calls++ === 0) {
      signal.addEventListener('abort', () => { order.push('source'); state = s.getState(); });
      return asset();
    }
    return d.promise;
  }, () => ({ dispose() { order.push('resource'); } }));
  try {
    const work = s.load([pack(), {...pack(), id: 'second'}], { signal: caller });
    await tick();
    s.clear();
    assert.equal(await work, false);
    assert.deepEqual(state, { status: 'idle', count: 0 });
    assert.deepEqual(order, ['source', 'caller', 'timer', 'resource']);
    d.resolve(asset()); await tick();
  } finally { s.destroy(); globalThis.setTimeout = nativeSet; globalThis.clearTimeout = nativeClear; }
});

test('[director-088] The destroyed session returns false for a load call during source cancellation', async () => {
  const d = deferred();
  let next, s;
  s = makeSession(({ signal }) => {
    signal.addEventListener('abort', () => { next = s.load([]); });
    return d.promise;
  });
  try {
    const work = s.load([pack()]);
    s.destroy();
    assert.equal(await work, false);
    assert.equal(await next, false);
    d.resolve(asset()); await tick();
  } finally { s.destroy(); }
});

test('[director-088 director-091] The session checks the new list after it disposes old resources', async () => {
  let disposals = 0;
  const s = makeSession(asset, () => ({ dispose() { disposals++; } }));
  try {
    assert.equal(await s.load([pack()]), true);
    await assert.rejects(s.load(null), { message: 'Too many data packs' });
    assert.equal(disposals, 1);
    assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
  } finally { s.destroy(); }
});

test('[director-088] The validator checks the list before it reads the anchors', async () => {
  let reads = 0;
  const s = makeSession();
  try {
    await assert.rejects(s.load(null, { anchors: { map() { reads++; return []; } } }), { message: 'Too many data packs' });
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});

test('[director-088] The session checks declarations before it reads the caller signal', async () => {
  let reads = 0;
  const p = pack(); p.version = 2;
  const s = makeSession();
  try {
    await assert.rejects(s.load([p], { signal: { get aborted() { reads++; return true; } } }), { message: 'packs[0].version: unsupported pack version' });
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});

test('[director-089] The caller listener comes before the deadline timer starts', async () => {
  const order = [];
  const signal = { aborted: false, addEventListener() { order.push('listener'); }, removeEventListener() {} };
  const timeoutMs = { valueOf() { order.push('deadline'); return 15000; } };
  const s = makeSession(asset, undefined, { timeoutMs });
  try {
    assert.equal(await s.load([pack()], { signal }), true);
    assert.deepEqual(order, ['listener', 'deadline']);
  } finally { s.destroy(); }
});

test('[director-090] The caller event during listener registration cancels the load call', async () => {
  const nativeSet = globalThis.setTimeout, nativeClear = globalThis.clearTimeout;
  globalThis.setTimeout = () => ({});
  globalThis.clearTimeout = () => {};
  const c = new AbortController();
  const add = c.signal.addEventListener.bind(c.signal);
  c.signal.addEventListener = (...args) => { add(...args); c.abort(new Error('stop')); };
  const s = makeSession();
  try { assert.equal(await s.load([pack()], { signal: c.signal }), false); }
  finally { s.destroy(); globalThis.setTimeout = nativeSet; globalThis.clearTimeout = nativeClear; }
});

test('[director-089] The session checks the signal before it removes the timer and reports the ready state', async () => {
  const nativeSet = globalThis.setTimeout, nativeClear = globalThis.clearTimeout;
  const timer = {}, order = [];
  let state, s;
  globalThis.setTimeout = () => timer;
  globalThis.clearTimeout = handle => { if (handle === timer) { order.push('timer'); state = s.getState().status; } };
  s = makeSession(({ signal }) => {
    const check = signal.throwIfAborted.bind(signal);
    signal.throwIfAborted = () => { order.push('check'); check(); };
    return asset();
  });
  try {
    assert.equal(await s.load([pack()]), true);
    assert.deepEqual(order, ['check', 'check', 'timer']);
    assert.equal(state, 'loading');
  } finally { s.destroy(); globalThis.setTimeout = nativeSet; globalThis.clearTimeout = nativeClear; }
});

test('[director-090 director-093] The session rejects the signal error before it reads bytes', async () => {
  let reads = 0;
  const s = makeSession(({ signal }) => {
    signal.throwIfAborted = () => { throw new Error('stop'); };
    return { get bytes() { reads++; return new Uint8Array([1]); } };
  });
  try {
    await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});

test('[director-093] The session checks total bytes before it reads the digest', async () => {
  let calls = 0, reads = 0;
  const packs = Array.from({ length: 5 }, (_, i) => ({ ...pack(), id: 'p' + i }));
  Object.defineProperty(packs[4], 'sha256', { get() { reads++; return calls < 5 ? '0'.repeat(64) : undefined; } });
  class Bytes extends Uint8Array { get length() { return 8388608; } }
  const s = makeSession(() => { if (++calls === 5) reads = 0; return { bytes: new Bytes([1]) }; });
  try {
    await assert.rejects(s.load(packs), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});

test('[director-095] The source checks the path before it checks the caller signal', async () => {
  let calls = 0;
  const source = directory(() => { throw new Error('unused'); });
  await assert.rejects(source({ path: '../x', signal: { throwIfAborted() { calls++; throw new Error('stop'); } } }), {
    message: 'source.path: expected a relative asset path without URL syntax or traversal',
  });
  assert.equal(calls, 0);
});

test('[director-096] The source checks the header limit before it reads the first stream chunk', async () => {
  let reads = 0;
  const source = directory(async () => ({
    ok: true, headers: new Headers({ 'content-length': '2' }),
    body: { getReader() { return { async read() { reads++; return {done:true}; }, async cancel() {}, releaseLock() {} }; } },
  }));
  await assert.rejects(source({ path: 'x', maxBytes: 1 }), { message: 'Asset exceeds byte limit' });
  assert.equal(reads, 0);
});

test('[director-097] The source checks the signal before it reads the stream chunk', async () => {
  let checks = 0, reads = 0;
  const source = directory(async () => ({
    ok: true, headers: new Headers(),
    body: { getReader() { return { async read() { reads++; return {done:true}; }, async cancel() {}, releaseLock() {} }; } },
  }));
  const signal = { throwIfAborted() { if (++checks === 2) throw new Error('stop'); } };
  await assert.rejects(source({ path: 'x', signal }), { message: 'stop' });
  assert.equal(reads, 0);
});

for (const path of ['z/Zz', 'Z/zZ', 'zZ/Zz', '_x/_y', '-x/-y']) {
  test(`[director-076] The asset path accepts ${path}`, () => {
    assert.doesNotThrow(() => validateAssetPath(path));
  });
}
for (const [tag, label, alter, message] of [
  ['077', 'extra data pack field', p => { p.extra = 1; }, 'pack.extra: unsupported field'],
  ['077', 'format field', p => { p.format = 'bad'; }, 'pack.format: unsupported pack format'],
  ['077', 'source object', p => { p.source = null; }, 'pack.source: expected an object'],
  ['076', 'source path', p => { p.source.path = '../x'; }, 'pack.source.path: expected a relative asset path without URL syntax or traversal'],
  ['078', 'extra attribution field', p => { p.attribution.extra = 1; }, 'pack.attribution.extra: unsupported field'],
  ['078', 'attribution object', p => { p.attribution = null; }, 'pack.attribution: expected an object'],
  ['078', 'link syntax', p => { p.attribution.url = 'bad'; }, 'pack.attribution.url: expected an HTTPS source link'],
  ['078', 'link protocol', p => { p.attribution.url = 'http://example.org/'; }, 'pack.attribution.url: expected an HTTPS source link without credentials, query or fragment'],
  ['079', 'numeric text', p => { p.byteLength = '1'; }, 'pack.byteLength: expected a number from 1 to 8388608'],
  ['079', 'byteLength field', p => { p.byteLength = 0; }, 'pack.byteLength: expected a number from 1 to 8388608'],
  ['079', 'integer field', p => { p.byteLength = 1.5; }, 'pack.byteLength: expected an integer'],
  ['080', 'extra placement field', p => { p.placement.extra = 1; }, 'pack.placement.extra: unsupported field'],
  ['080', 'placement object', p => { p.placement = null; }, 'pack.placement: expected an object'],
  ['080', 'height reference', p => { p.placement.altitudeReference = 'bad'; }, 'pack.placement.altitudeReference: expected ellipsoid height in meters'],
  ['080', 'bound list', p => { p.format = 'image'; p.placement = { bounds: [0, 0, 1], height: 0, altitudeReference: 'ellipsoid' }; }, 'pack.placement.bounds: expected west, south, east, north'],
]) {
  test(`[director-${tag}] The manifest names the ${label}`, () => {
    const p = pack(); alter(p);
    assert.throws(() => validateDataPack(p, 'pack', new Set()), { message });
  });
}
test('[director-081] The manifest names an unknown anchor', () => {
  const p = { ...pack(), format: 'media', placement: { anchorId: 'absent' } };
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.placement.anchorId: unknown scene anchor' });
});
test('[director-082] The shot accepts eight references and rejects nine references', () => {
  const scene = {
    dataPacks: Array.from({ length: 8 }, (_, i) => ({ ...pack(), id: `p${i}` })),
    shots: [{ dataPackIds: Array.from({ length: 8 }, (_, i) => `p${i}`) }],
  };
  assert.doesNotThrow(() => validateSceneDataPacks(scene, '$'));
  scene.shots[0].dataPackIds.push('absent');
  assert.throws(() => validateSceneDataPacks(scene, '$'), { message: '$.shots[0].dataPackIds: expected an array of at most 8 entries' });
});
for (const [label, scene, message] of [
  ['declaration', { dataPacks: [{ ...pack(), extra: 1 }], shots: [] }, '$.dataPacks[0].extra: unsupported field'],
  ['duplicate ID', { dataPacks: [pack(), pack()], shots: [] }, '$.dataPacks[1].id: duplicate pack ID'],
  ['duplicate reference', { dataPacks: [pack()], shots: [{ dataPackIds: ['outline', 'outline'] }] }, '$.shots[0].dataPackIds: expected distinct scene pack IDs'],
  ['reference type', { dataPacks: [], shots: [{ dataPackIds: null }] }, '$.shots[0].dataPackIds: expected an array of at most 8 entries'],
]) {
  test(`[director-082] The scene names the invalid ${label}`, () => {
    assert.throws(() => validateSceneDataPacks(scene, '$'), { message });
  });
}
test('[director-085] The decoder rejects a null position', () => {
  assert.throws(() => geoFeatures([feature('p', 'Point', null)]), { message: 'Invalid geographic position' });
});
test('[director-085] The decoder keeps a negative zero height', () => {
  const value = decodePackGeoJSON(new TextEncoder().encode('{"type":"FeatureCollection","features":[{"type":"Feature","id":"p","geometry":{"type":"Point","coordinates":[0,0,-0]}}]}'));
  assert.equal(Object.is(value[0].coordinates[2], -0), true);
});
test('[director-086] The decoder rejects a null line', () => {
  assert.throws(() => geoFeatures([feature('p', 'LineString', null)]), { message: 'Invalid line' });
});
test('[director-086] The decoder accepts an open line', () => {
  assert.deepEqual(geoFeatures([feature('p', 'LineString', [[0, 0], [1, 1]])])[0].coordinates, [[0, 0, 0], [1, 1, 0]]);
});
test('[director-088] The session accepts an empty list without asset work', async () => {
  let calls = 0, timers = 0;
  const native = globalThis.setTimeout;
  globalThis.setTimeout = (...args) => { timers++; return native(...args); };
  const s = makeSession(() => { calls++; return asset(); });
  try {
    assert.equal(await s.load([]), true);
    assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
    assert.equal(calls, 0);
    assert.equal(timers, 0);
  } finally { globalThis.setTimeout = native; s.destroy(); }
});
test('[director-088] The session rejects a null list', async () => {
  const s = makeSession();
  try { await assert.rejects(s.load(null), { message: 'Too many data packs' }); }
  finally { s.destroy(); }
});
for (const [label, source, renderer] of [
  ['null bytes', () => ({ bytes: null }), () => ({ dispose() {} })],
  ['null handle', asset, () => null],
  ['source error', () => Promise.reject(new Error('source')), () => { assert.fail('The renderer must not run'); }],
]) {
  test(`[director-090] The session rejects ${label}`, async () => {
    const s = makeSession(source, renderer);
    try { await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' }); }
    finally { s.destroy(); }
  });
}
test('[director-089] The session sets and removes the caller listener', async () => {
  const events = [], callbacks = new Set();
  const signal = {
    aborted: false,
    addEventListener(type, callback, options) { events.push(['add', type, options]); callbacks.add(callback); },
    removeEventListener(type, callback) { events.push(['remove', type]); assert.equal(callbacks.delete(callback), true); },
  };
  const s = makeSession();
  try {
    assert.equal(await s.load([pack()], { signal }), true);
    s.clear();
    assert.deepEqual(events, [['add', 'abort', { once: true }], ['remove', 'abort']]);
    assert.equal(callbacks.size, 0);
  } finally { s.destroy(); }
});
test('[director-096] The source joins chunks of different lengths', async () => {
  const source = directory(() => response([new Uint8Array([1, 2]), new Uint8Array([3, 4, 5])]));
  assert.deepEqual([...(await source({ path: 'x' })).bytes], [1, 2, 3, 4, 5]);
});

test('[director-088] The data pack limits reject a caller change', async () => {
  const { PACK_LIMITS } = await import('./manifest.js');
  assert.equal(Object.isFrozen(PACK_LIMITS), true);
  assert.throws(() => { PACK_LIMITS.packs = 9; }, TypeError);
  assert.equal(PACK_LIMITS.packs, 8);
});

test('[director-088] The destroyed session does not read the caller signal state', async () => {
  let reads = 0;
  const signal = { get aborted() { reads++; return false; } };
  const s = makeSession(); s.destroy();
  assert.equal(await s.load([pack()], { signal }), false);
  assert.equal(reads, 0);
});
test('[director-090] The cleared load call does not read the caller signal state again', async () => {
  let reads = 0;
  const signal = { get aborted() { reads++; return false; }, addEventListener() {}, removeEventListener() {} };
  const d = deferred(), s = makeSession(() => d.promise);
  const load = s.load([pack()], { signal }); s.clear();
  assert.equal(await load, false);
  assert.equal(reads, 1);
  d.resolve(asset()); await tick();
});
test('[director-090] The session rejects asset data from a source error', async () => {
  let renders = 0;
  const s = makeSession(() => Promise.reject(asset()), () => { renders++; return { dispose() {} }; });
  try {
    await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(renders, 0);
  } finally { s.destroy(); }
});
test('[director-090] The session checks its source signal before it reads bytes and after renderer work', async () => {
  let checks = 0;
  const s = makeSession(({ signal }) => {
    const check = signal.throwIfAborted.bind(signal);
    signal.throwIfAborted = () => { checks++; check(); };
    return asset();
  });
  try {
    assert.equal(await s.load([pack()]), true);
    assert.equal(checks, 2);
  } finally { s.destroy(); }
});

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

test('[director-079] The byteLength field rejects a fraction', async () => {
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

test('[director-082] The scene rejects duplicate data pack IDs', async () => {
  assert.throws(
    () =>
      validateSceneDataPacks(
        { dataPacks: [pack(), pack()], shots: [] },
        'scene',
      ),
    /duplicate pack ID/,
  );
});

test('[director-082] The shot rejects duplicate data pack IDs', async () => {
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

test('[director-082] The shot rejects unknown data pack IDs', async () => {
  assert.throws(
    () =>
      validateSceneDataPacks(
        { dataPacks: [pack()], shots: [{ dataPackIds: ['unknown'] }] },
        'scene',
      ),
    /distinct scene pack IDs/,
  );
});

test('[director-082] The scene accepts absent data packs and anchors', async () => {
  assert.doesNotThrow(() => validateSceneDataPacks({ shots: [{}] }, 'scene'));
  assert.doesNotThrow(() =>
    validateSceneDataPacks({ anchors: [], dataPacks: [], shots: [] }, 'scene'),
  );
  assert.throws(() =>
    validateSceneDataPacks(
      { dataPacks: Array.from({ length: 9 }, (_, i) => ({ ...pack(), id: `p${i}` })), shots: [] },
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

test('[director-083] The collection rejects more than 2000 features', async () => {
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

test('[director-085] The position rejects a coordinate that is not finite', async () => {
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

test('[director-085] The position rejects a height below the limit', async () => {
  assert.throws(
    () => geoFeatures([feature('p', 'Point', [0, 0, -12001])]),
    /position/,
  );
});

test('[director-085] The position rejects a height above the limit', async () => {
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

test('[director-085] The position keeps the height in the data', async () => {
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

test('[director-087] The geometry rejects an empty polygon', async () => {
  const f = feature();
  f.geometry = { type: 'Polygon', coordinates: [] };
  assert.throws(() => geoFeatures([f]), /Unsupported geometry/);
});

test('[director-087] The geometry rejects more than 128 rings', async () => {
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

test('[director-088] The session rejects a value that is not a data pack list', async () => {
  const s = createDataPackSession();
  await assert.rejects(s.load({}), /Too many data packs/);
  s.destroy();
});

test('[director-088] The session rejects more than eight data packs', async () => {
  const s = createDataPackSession();
  await assert.rejects(
    s.load(Array.from({ length: 9 }, (_, i) => ({ ...pack(), id: `p${i}` }))),
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

test('[director-090] The session accepts a null late handle', async () => {
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

test('[director-090] The session destroys work that is not complete', async () => {
  const d = deferred();
  const s = makeSession(() => d.promise);
  const work = s.load([pack()]);
  s.destroy();
  assert.equal(await work, false);
  d.resolve(asset());
  await tick();
  assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
});

test('[director-091] The replacement keeps its resources', async () => {
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

test('[director-092] The session rejects absent renderer', async () => {
  const s = createDataPackSession({ sources: { assets: asset }, adapters: {} });
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects bytes that are not a Uint8Array', async () => {
  const s = makeSession(() => ({ bytes: [1, 2, 3] }));
  await assert.rejects(s.load([{ ...pack() }]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects an empty asset', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array() }));
  await assert.rejects(s.load([{ ...pack() }]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects an asset above the byte limit', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array(8388609) }));
  await assert.rejects(s.load([{ ...pack() }]), /could not load/);
  s.destroy();
});

test('[director-093] The session rejects a wrong byteLength field', async () => {
  const s = makeSession(() => ({ bytes: new Uint8Array([1]) }));
  await assert.rejects(
    s.load([{ ...pack(), byteLength: 2 }]),
    /could not load/,
  );
  s.destroy();
});

test('[director-093] The session rejects bytes above the total limit', async () => {
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

test('[director-089] The session rejects a null handle', async () => {
  const s = makeSession(asset, () => null);
  await assert.rejects(s.load([pack()]), /could not load/);
  s.destroy();
});

test('[director-089] The session rejects a handle without a dispose function', async () => {
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

test('[director-094] The directory rejects an address with no final slash', async () => {
  assert.throws(
    () =>
      createAssetDirectorySource({
        baseUrl: 'https://example.org/a',
        fetchImpl: () => assert.fail(),
      }),
    /explicit HTTP/,
  );
});

test('[director-095] The asset request sets its fixed options', async () => {
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

test('[director-096] The source returns an empty media type when the header is absent', async () => {
  const source = directory(() => response([], {}));
  assert.equal((await source({ path: 'x' })).mimeType, '');
});

test('[director-096] The source returns lowercase media type text without parameters', async () => {
  const source = directory(() =>
    response([], { 'content-type': ' IMAGE/PNG ; extra=x' }),
  );
  assert.equal((await source({ path: 'x' })).mimeType, 'image/png');
});

test('[director-097] The source rejects an absent stream', async () => {
  const source = directory(() => ({ ok: true }));
  await assert.rejects(source({ path: 'x' }), /stream unavailable/);
});

test('[director-097] The source accepts failed body cancellation', async () => {
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

test('[director-080] The image accepts its bounds field', async () => {
  const a = imagePack();
  a.format = 'image';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-080] The image accepts its height field', async () => {
  const a = imagePack();
  a.format = 'image';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-080] The image accepts its altitudeReference field', async () => {
  const a = imagePack();
  a.format = 'image';
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-081] The media accepts its anchorId field', async () => {
  const a = pack();
  a.format = 'media';
  a.placement = { anchorId: 'a' };
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set(['a'])));
});

test('[director-077] The geojson accepts its altitudeReference field', async () => {
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

test('[director-090] The session checks signal state without an event', async () => {
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

test('[director-090] The session checks destroyed state after it reads the signal', async () => {
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

test('[director-090] The session checks a cleared load call without signal state', async () => {
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

test('[director-090] The session disposes the handle before it adds the handle to its list', async () => {
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

test('[director-092] The absent renderer does not call its source', async () => {
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

test('[director-095] The asset request sets its credentials option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'credentials'), true);
  assert.equal(opts.credentials, 'omit');
});

test('[director-095] The asset request sets its redirect option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'redirect'), true);
  assert.equal(opts.redirect, 'error');
});

test('[director-095] The asset request sets its referrerPolicy option', async () => {
  let opts;
  const source = directory(async (url, o) => {
    opts = o;
    return response();
  });
  await source({ path: 'x' });
  assert.equal(Object.hasOwn(opts, 'referrerPolicy'), true);
  assert.equal(opts.referrerPolicy, 'no-referrer');
});

test('[director-095] The asset request sets its cache option', async () => {
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

test('[director-077] The manifest accepts the id field of a data pack', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts the version field of a data pack', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts the format field of a data pack', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts the source field of a data pack', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts the attribution field of a data pack', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts the placement field of a data pack', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-079] The manifest accepts the byteLength field of a data pack', async () => {
  const a = pack();
  a.byteLength = 3;
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-079] The manifest accepts the sha256 field of a data pack', async () => {
  const a = pack();
  a.sha256 = 'a'.repeat(64);
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts its source name field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-077] The manifest accepts its source path field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The manifest accepts its attribution text field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The manifest accepts its attribution license field', async () => {
  const a = pack();
  assert.doesNotThrow(() => validateDataPack(a, 'pack', new Set()));
});

test('[director-078] The manifest accepts its attribution url field', async () => {
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

test('[director-093] The session gives anchors to its renderer', async () => {
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

test('[director-089] The session keeps every data pack handle', async () => {
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

test('[director-095] The asset request sets its signal option', async () => {
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

test('[director-092] The data pack session reads the byteLength field once without a registered source', async () => {
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
    message:
      'Data pack could not load: check its source, format, size or integrity',
  });
  assert.equal(reads, 1);
  assert.deepEqual(session.getState(), { status: 'idle', count: 0 });
});

for (const [label, value] of [
  ['63 characters', 'a'.repeat(63)],
  ['65 characters', 'a'.repeat(65)],
  ['uppercase text', 'A'.repeat(64)],
  ['a prefix', 'x' + 'a'.repeat(64)],
  ['a suffix', 'a'.repeat(64) + 'x'],
]) {
  test(`[director-079] The digest rejects ${label}`, () => {
    assert.throws(
      () => validateDataPack({ ...pack(), sha256: value }, 'data', new Set()),
      {
        message: 'data.sha256: expected a lowercase SHA-256 digest',
      },
    );
  });
}
test('[director-079] The digest accepts 64 lowercase characters', () => {
  assert.doesNotThrow(() =>
    validateDataPack(
      { ...pack(), sha256: 'abcdef0123456789'.repeat(4) },
      'data',
      new Set(),
    ),
  );
});
for (const [label, bounds] of [
  ['equal longitude edges', [0, -1, 0, 1]],
  ['equal latitude edges', [-1, 0, 1, 0]],
]) {
  test(`[director-080] The image rejects ${label}`, () => {
    const value = imagePack();
    value.placement.bounds = bounds;
    assert.throws(() => validateDataPack(value, 'data', new Set()), {
      message: 'data.placement.bounds: expected increasing non-dateline bounds',
    });
  });
}
test('[director-080] The image accepts all geographic limits', () => {
  const value = imagePack();
  value.placement.bounds = [-180, -90, 180, 90];
  assert.doesNotThrow(() => validateDataPack(value, 'data', new Set()));
});
test('[director-088] The session accepts eight data packs', async () => {
  const session = makeSession();
  try {
    assert.equal(
      await session.load(
        Array.from({ length: 8 }, (_, i) => ({ ...pack(), id: String(i) })),
      ),
      true,
    );
    assert.deepEqual(session.getState(), { status: 'ready', count: 8 });
  } finally {
    session.destroy();
  }
});
test('[director-093] The session accepts the asset byte limit', async () => {
  const session = makeSession(() => ({ bytes: new Uint8Array(8388608) }));
  try {
    assert.equal(await session.load([pack()]), true);
  } finally {
    session.destroy();
  }
});
test('[director-093] The session accepts the total byte limit', async () => {
  const session = makeSession(() => ({ bytes: new Uint8Array(8388608) }));
  try {
    assert.equal(
      await session.load(
        Array.from({ length: 4 }, (_, i) => ({ ...pack(), id: String(i) })),
      ),
      true,
    );
    assert.equal(session.getState().count, 4);
  } finally {
    session.destroy();
  }
});
test('[director-093] The session rejects one byte above the total limit', async () => {
  let calls = 0;
  const session = makeSession(() => ({
    bytes: new Uint8Array(++calls <= 4 ? 8388608 : 1),
  }));
  try {
    await assert.rejects(
      session.load(
        Array.from({ length: 5 }, (_, i) => ({ ...pack(), id: String(i) })),
      ),
      {
        message:
          'Data pack could not load: check its source, format, size or integrity',
      },
    );
  } finally {
    session.destroy();
  }
});
test('[director-083] The decoder rejects invalid UTF8 bytes', () => {
  const bytes = new TextEncoder().encode(
    '{"type":"FeatureCollection","features":[],"text":"x"}',
  );
  bytes[bytes.length - 3] = 255;
  assert.throws(() => decodePackGeoJSON(bytes), {
    message: 'The encoded data was not valid for encoding utf-8',
  });
});
test('[director-083] The decoder rejects null', () => {
  assert.throws(() => geo(null), {
    message: 'Expected a bounded FeatureCollection',
  });
});
test('[director-084] The decoder rejects a null feature', () => {
  assert.throws(() => geoFeatures([null]), {
    message: 'Features require distinct string IDs',
  });
});
test('[director-087] The decoder rejects absent geometry', () => {
  assert.throws(() => geoFeatures([{ type: 'Feature', id: 'a' }]), {
    message: 'Unsupported geometry',
  });
});
test('[director-093] The source receives the path and the renderer receives the asset and signal', async () => {
  let sourceSignal;
  const session = makeSession(
    (options) => {
      assert.equal(options.path, 'example/outline.geojson');
      sourceSignal = options.signal;
      return asset();
    },
    (options) => {
      assert.deepEqual(options.asset.bytes, new Uint8Array([1, 2, 3]));
      assert.equal(options.asset.mimeType, 'application/json');
      assert.equal(options.signal, sourceSignal);
      assert.equal(options.signal.aborted, false);
      return { dispose() {} };
    },
  );
  try {
    assert.equal(await session.load([pack()]), true);
  } finally {
    session.destroy();
  }
});
test('[director-088] The session checks every declaration before the source call', async () => {
  let calls = 0;
  const session = makeSession(() => {
    calls++;
    return asset();
  });
  try {
    await assert.rejects(session.load([pack(), { ...pack(), version: 2 }]), {
      message: 'packs[1].version: unsupported pack version',
    });
    assert.equal(calls, 0);
  } finally {
    session.destroy();
  }
});
test('[director-089] The session destroys each ready resource', async () => {
  const disposed = [];
  const session = makeSession(asset, ({ pack }) => ({
    dispose() {
      disposed.push(pack.id);
    },
  }));
  assert.equal(await session.load([pack(), { ...pack(), id: 'second' }]), true);
  session.destroy();
  assert.deepEqual(disposed, ['second', 'outline']);
  assert.deepEqual(session.getState(), { status: 'idle', count: 0 });
});
for (const [label, end] of [
  ['success', false],
  ['clear', true],
]) {
  test(`[director-089] The session removes its deadline after ${label}`, async () => {
    const nativeSet = globalThis.setTimeout,
      nativeClear = globalThis.clearTimeout;
    const callbacks = new Map();
    let token = 0;
    globalThis.setTimeout = (callback) => {
      callbacks.set(++token, callback);
      return token;
    };
    globalThis.clearTimeout = (handle) => {
      callbacks.delete(handle);
    };
    let rendererSignal;
    const session = makeSession(
      (options) => {
        if (end) {
          rendererSignal = options.signal;
          return new Promise(() => {});
        }
        return asset();
      },
      ({ signal }) => {
        rendererSignal = signal;
        return { dispose() {} };
      },
    );
    try {
      const work = session.load([pack()]);
      if (end) {
        session.clear();
        assert.equal(await work, false);
      } else assert.equal(await work, true);
      for (const callback of callbacks.values()) callback();
      assert.equal(rendererSignal.aborted, end);
      assert.equal(callbacks.size, 0);
    } finally {
      session.destroy();
      globalThis.setTimeout = nativeSet;
      globalThis.clearTimeout = nativeClear;
    }
  });
}
test('[director-092] The deadline removes partial resources', async () => {
  const disposed = [];
  let calls = 0;
  const session = makeSession(
    () => (++calls === 1 ? asset() : new Promise(() => {})),
    ({ pack }) => ({
      dispose() {
        disposed.push(pack.id);
      },
    }),
    { timeoutMs: 10 },
  );
  try {
    await assert.rejects(session.load([pack(), { ...pack(), id: 'second' }]), {
      message:
        'Data pack could not load: check its source, format, size or integrity',
    });
    assert.deepEqual(disposed, ['outline']);
    assert.deepEqual(session.getState(), { status: 'idle', count: 0 });
  } finally {
    session.destroy();
  }
});
test('[director-076] The asset path rejects URL syntax with a stable message', () => {
  assert.throws(() => validateAssetPath('https://example.org/x'), {
    message:
      'source.path: expected a relative asset path without URL syntax or traversal',
  });
});
test('[director-082] The scene ignores a data pack list from its parent', () => {
  const scene = Object.assign(Object.create({ dataPacks: [null] }), {
    shots: [],
  });
  assert.doesNotThrow(() => validateSceneDataPacks(scene, 'scene'));
});
test('[director-080] The image rejects text for each geographic field', () => {
  for (const [key, index] of [
    ['bounds', 0],
    ['bounds', 1],
    ['height', 0],
  ]) {
    const value = imagePack();
    if (key === 'bounds') value.placement.bounds[index] = '0';
    else value.placement.height = '0';
    assert.throws(() => validateDataPack(value, 'data', new Set()), {
      message:
        key === 'bounds'
          ? `data.placement.bounds[${index}]: expected a number from ${index ? -90 : -180} to ${index ? 90 : 180}`
          : 'data.placement.height: expected a number from -12000 to 1000000000',
    });
  }
});
test('[director-078] The attribution accepts its text limits and rejects excess text', () => {
  for (const key of ['text', 'license']) {
    const value = pack();
    value.attribution[key] = 'x'.repeat(4096);
    assert.doesNotThrow(() => validateDataPack(value, 'data', new Set()));
    value.attribution[key] += 'x';
    assert.throws(() => validateDataPack(value, 'data', new Set()), {
      message: `data.attribution.${key}: expected nonempty text, at most 4096 characters`,
    });
  }
  const value = pack();
  value.attribution.url = 'https://example.org/' + 'x'.repeat(2028);
  assert.doesNotThrow(() => validateDataPack(value, 'data', new Set()));
  value.attribution.url += 'x';
  assert.throws(() => validateDataPack(value, 'data', new Set()), {
    message:
      'data.attribution.url: expected nonempty text, at most 2048 characters',
  });
});
test('[director-076] The asset path accepts 1024 characters and rejects 1025', () => {
  assert.doesNotThrow(() => validateAssetPath('x'.repeat(1024)));
  assert.throws(() => validateAssetPath('x'.repeat(1025)), {
    message: 'source.path: expected nonempty text, at most 1024 characters',
  });
});
test('[director-095] The directory source uses the default fetch function', async () => {
  const native = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    assert.equal(url, 'https://example.org/a/x');
    return response();
  };
  try {
    const source = createAssetDirectorySource({
      baseUrl: 'https://example.org/a/',
    });
    assert.deepEqual(
      (await source({ path: 'x' })).bytes,
      new Uint8Array([1, 2, 3]),
    );
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = native;
  }
});

for (const [label, key] of [
  ['ID', 'id'],
  ['source name', 'source'],
]) {
  test(`[director-077] The manifest accepts 256 characters for its ${label} and rejects 257`, () => {
    const value = pack();
    if (key === 'id') value.id = 'x'.repeat(256);
    else value.source.adapter = 'x'.repeat(256);
    assert.doesNotThrow(() => validateDataPack(value, 'data', new Set()));
    if (key === 'id') value.id += 'x';
    else value.source.adapter += 'x';
    assert.throws(() => validateDataPack(value, 'data', new Set()), {
      message:
        key === 'id'
          ? 'data.id: expected nonempty text, at most 256 characters'
          : 'data.source.adapter: expected nonempty text, at most 256 characters',
    });
  });
}

for (const value of ['x?a=1', 'a:b', '.x', 'x/', 'x//y']) {
  test(`[director-076] The asset path rejects ${value}`, () => {
    assert.throws(() => validateAssetPath(value), {
      message: 'source.path: expected a relative asset path without URL syntax or traversal',
    });
  });
}
test('[director-079] The manifest accepts one byte', () => {
  assert.doesNotThrow(() => validateDataPack({ ...pack(), byteLength: 1 }, 'pack', new Set()));
});
test('[director-080] The image rejects bounds outside an array', () => {
  const value = imagePack();
  value.placement.bounds = { 0: -2, 1: -1, 2: 2, 3: 1, length: 4, forEach: Array.prototype.forEach };
  assert.throws(() => validateDataPack(value, 'pack', new Set()), {
    message: 'pack.placement.bounds: expected an array of at most 4 entries',
  });
});
test('[director-082] The scene accepts eight distinct data packs', () => {
  assert.doesNotThrow(() => validateSceneDataPacks({ dataPacks: Array.from({ length: 8 }, (_, i) => ({ ...pack(), id: `p${i}` })), shots: [] }, 'scene'));
});
test('[director-082] The scene rejects nine distinct data packs', () => {
  assert.throws(() => validateSceneDataPacks({ dataPacks: Array.from({ length: 9 }, (_, i) => ({ ...pack(), id: `p${i}` })), shots: [] }, 'scene'), {
    message: 'scene.dataPacks: expected an array of at most 8 entries',
  });
});
for (const [label, coordinates] of [
  ['negative longitude', [-181, 0]], ['positive longitude', [181, 0]],
  ['negative latitude', [0, -91]], ['positive latitude', [0, 91]],
  ['one coordinate', [0]], ['four coordinates', [0, 0, 0, 0]],
]) {
  test(`[director-085] The position rejects ${label}`, () => {
    assert.throws(() => geoFeatures([feature('p', 'Point', coordinates)]), { message: 'Invalid geographic position' });
  });
}
for (const [label, coordinates, expected] of [
  ['negative longitude', [-180, 0], [-180, 0, 0]],
  ['positive longitude', [180, 0], [180, 0, 0]],
  ['negative latitude', [0, -90], [0, -90, 0]],
  ['positive latitude', [0, 90], [0, 90, 0]],
]) {
  test(`[director-085] The position accepts the limit for ${label}`, () => {
    assert.deepEqual(geoFeatures([feature('p', 'Point', coordinates)])[0].coordinates, expected);
  });
}
test('[director-089] The data pack session reports its state during asset work', async () => {
  const work = deferred();
  const session = makeSession(() => work.promise);
  const result = session.load([pack()]);
  try {
    assert.deepEqual(session.getState(), { status: 'loading', count: 0 });
    work.resolve(asset());
    assert.equal(await result, true);
  } finally {
    work.resolve(asset());
    session.destroy();
    await result;
  }
});
test('[director-096] The directory source accepts its default byte limit', async () => {
  const source = directory(() => response([new Uint8Array(8388608)], { 'content-length': '8388608' }));
  assert.equal((await source({ path: 'x' })).bytes.length, 8388608);
});

test('[director-093] The renderer receives the data pack and scene anchors', async () => {
  const declaration = pack();
  const sceneAnchors = [{ id: 'a' }];
  let calls = 0;
  const session = makeSession(asset, (input) => {
    calls++;
    assert.equal(input.pack, declaration);
    assert.equal(input.anchors, sceneAnchors);
    assert.equal(Object.hasOwn(input, 'pack'), true);
    assert.equal(Object.hasOwn(input, 'anchors'), true);
    return { dispose() {} };
  });
  try {
    assert.equal(await session.load([declaration], { anchors: sceneAnchors }), true);
    assert.equal(calls, 1);
  } finally {
    session.destroy();
  }
});
for (const [label, height] of [['minimum', -12000], ['maximum', 1000000000]]) {
  test(`[director-080] The image accepts its ${label} height`, () => {
    const value = imagePack();
    value.placement.height = height;
    assert.doesNotThrow(() => validateDataPack(value, 'pack', new Set()));
  });
  test(`[director-085] The position accepts its ${label} height`, () => {
    assert.deepEqual(geoFeatures([feature('p', 'Point', [0, 0, height])])[0].coordinates, label === 'minimum' ? [0, 0, -12000] : [0, 0, 1000000000]);
  });
}
test('[director-079] The manifest accepts its byte limit', () => {
  assert.doesNotThrow(() => validateDataPack({ ...pack(), byteLength: 8388608 }, 'pack', new Set()));
});
for (const outcome of ['success', 'error']) {
  test(`[director-089] The data pack session removes source listeners after ${outcome}`, async () => {
    const Native = globalThis.AbortController;
    const listeners = new Set();
    const options = [];
    globalThis.AbortController = class extends Native {
      constructor() {
        super();
        const add = this.signal.addEventListener.bind(this.signal);
        const remove = this.signal.removeEventListener.bind(this.signal);
        this.signal.addEventListener = (type, callback, config) => {
          assert.equal(type, 'abort');
          options.push(config);
          listeners.add(callback);
          add(type, callback, config);
        };
        this.signal.removeEventListener = (type, callback) => {
          assert.equal(type, 'abort');
          listeners.delete(callback);
          remove(type, callback);
        };
      }
    };
    let session;
    try {
      session = makeSession(() => outcome === 'error' ? Promise.reject(new Error('stop')) : asset());
      if (outcome === 'error') {
        await assert.rejects(session.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
        assert.equal(options.length, 1);
      } else {
        assert.equal(await session.load([pack()]), true);
        assert.equal(options.length, 2);
      }
      assert.deepEqual(options[0], { once: true });
      assert.equal(listeners.size, 0);
    } finally {
      session?.destroy();
      globalThis.AbortController = Native;
    }
  });
}

for (const outcome of ['success', 'error']) {
  test(`[director-089] The completed source listener ignores a later event after ${outcome}`, async () => {
    let callback, reasonReads = 0;
    const s = makeSession(({ signal }) => {
      const add = signal.addEventListener.bind(signal);
      signal.addEventListener = (type, listener, options) => { callback = listener; add(type, listener, options); };
      Object.defineProperty(signal, 'reason', { get() { reasonReads++; return new Error('stop'); } });
      return outcome === 'success' ? asset() : Promise.reject(new Error('source'));
    });
    try {
      if (outcome === 'success') assert.equal(await s.load([pack()]), true);
      else await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
      reasonReads = 0;
      callback(); callback();
      assert.equal(reasonReads, 0);
    } finally { s.destroy(); }
  });
}
test('[director-092] The source signal event stops work before the renderer', async () => {
  let sourceSignal, renders = 0, reasonReads = 0;
  const d = deferred();
  const s = makeSession(({ signal }) => {
    sourceSignal = signal;
    Object.defineProperty(signal, 'reason', { get() { reasonReads++; return asset(); } });
    return d.promise;
  }, () => { renders++; return { dispose() {} }; });
  try {
    const load = s.load([pack()]);
    sourceSignal.dispatchEvent(new Event('abort'));
    await assert.rejects(load, { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(renders, 0);
    assert.equal(reasonReads, 1);
    d.resolve(asset()); await tick();
  } finally { s.destroy(); }
});

test('[director-090] The caller destroys the session when it reads the caller signal after a source error', async () => {
  let reads = 0, s;
  const signal = {
    get aborted() { if (++reads === 2) s.destroy(); return false; },
    addEventListener() {}, removeEventListener() {},
  };
  s = makeSession(() => Promise.reject(new Error('source')));
  try { assert.equal(await s.load([pack()], { signal }), false); }
  finally { s.destroy(); }
});
test('[director-093] The session checks byte type before it reads the length', async () => {
  let reads = 0;
  const value = new Proxy({}, { get(target, key) { if (key === 'length') reads++; return 1; } });
  const s = makeSession(() => ({ bytes: value }));
  try {
    await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});
test('[director-093] The session does not read declared byteLength again for null bytes', async () => {
  let reads = 0;
  const p = pack();
  Object.defineProperty(p, 'byteLength', { get() { reads++; return 1; } });
  const s = makeSession(() => ({ bytes: null }));
  try {
    await assert.rejects(s.load([p]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(reads, 2);
  } finally { s.destroy(); }
});
test('[director-092] The deadline gives its cause to the source signal', async () => {
  let reason;
  const s = makeSession(({ signal }) => {
    signal.addEventListener('abort', () => { reason = signal.reason.message; }, { once: true });
    return new Promise(() => {});
  }, undefined, { timeoutMs: 5 });
  try {
    await assert.rejects(s.load([pack()]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(reason, 'Asset load timed out');
  } finally { s.destroy(); }
});

test('[director-079] The validator checks the digest type before it converts text', () => {
  const p = { ...pack(), sha256: Symbol('digest') };
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.sha256: expected a lowercase SHA-256 digest' });
});
test('[director-080] The validator checks west and east before south and north', () => {
  const reads = [], values = [2, -1, 1, 1];
  const bounds = new Proxy(values, { get(target, key, receiver) {
    if (/^[0-3]$/.test(String(key))) reads.push(Number(key));
    return Reflect.get(target, key, receiver);
  } });
  const p = imagePack(); p.placement.bounds = bounds;
  assert.throws(() => validateDataPack(p, 'pack', new Set()), { message: 'pack.placement.bounds: expected increasing non-dateline bounds' });
  assert.deepEqual(reads, [0, 1, 2, 3, 0, 2]);
});
test('[director-082] The validator rejects duplicate references before it searches for known IDs', () => {
  let reads = 0;
  const ids = ['outline', 'outline'];
  Object.defineProperty(ids, 'some', { get() { reads++; return Array.prototype.some; } });
  assert.throws(() => validateSceneDataPacks({ dataPacks: [pack()], shots: [{ dataPackIds: ids }] }, '$'), { message: '$.shots[0].dataPackIds: expected distinct scene pack IDs' });
  assert.equal(reads, 0);
});
test('[director-093] The session does not read bytes.length again without declared byteLength', async () => {
  let reads = 0;
  class Bytes extends Uint8Array { get length() { reads++; return super.length; } }
  const s = makeSession(() => ({ bytes: new Bytes([1, 2, 3]) }));
  try {
    assert.equal(await s.load([pack()]), true);
    assert.equal(reads, 3);
  } finally { s.destroy(); }
});
test('[director-090] The cleared session returns false without the source signal state', async () => {
  let reads = 0, first = true, s;
  const aborted = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
  s = makeSession(({ signal }) => {
    Object.defineProperty(signal, 'aborted', { get() { reads++; return aborted.call(signal); } });
    return asset();
  }, () => ({ get dispose() {
    if (first) { first = false; s.clear(); reads = 0; }
    return () => {};
  } }));
  try {
    assert.equal(await s.load([pack()]), false);
    assert.equal(reads, 0);
  } finally { s.destroy(); }
});
test('[director-091] The old caller listener does not change new resources', async () => {
  const callbacks = [], signal = { aborted: false, addEventListener(type, callback) { callbacks.push(callback); }, removeEventListener() {} };
  const s = makeSession();
  try {
    assert.equal(await s.load([pack()], { signal }), true);
    assert.equal(await s.load([pack()], { signal }), true);
    callbacks[0]();
    assert.deepEqual(s.getState(), { status: 'ready', count: 1 });
  } finally { s.destroy(); }
});

test('[director-088 director-092] The absent source map gives no source for a numeric name', async () => {
  let reads = 0;
  const p = pack(); p.source.adapter = '0';
  Object.defineProperty(p, 'byteLength', { get() { reads++; return 1; } });
  const s = createDataPackSession({ adapters: { geojson: () => ({ dispose() {} }) } });
  try {
    await assert.rejects(s.load([p]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(reads, 1);
    assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
  } finally { s.destroy(); }
});
test('[director-088 director-092] The absent renderer map gives no renderer for a numeric name', async () => {
  let reads = 0, calls = 0;
  const p = pack();
  Object.defineProperty(p, 'format', { enumerable: true, get() { return ++reads <= 5 ? 'geojson' : '0'; } });
  const s = createDataPackSession({ sources: { assets: () => { calls++; return asset(); } } });
  try {
    await assert.rejects(s.load([p]), { message: 'Data pack could not load: check its source, format, size or integrity' });
    assert.equal(calls, 0);
    assert.deepEqual(s.getState(), { status: 'idle', count: 0 });
  } finally { s.destroy(); }
});

test('[director-096] The source checks the byte limit before it keeps a chunk', async () => {
  const chunk = new Uint8Array([1]);
  const push = Array.prototype.push;
  let retained = 0;
  const source = createAssetDirectorySource({
    baseUrl: 'https://example.org/a/',
    fetchImpl: async () => ({
      ok: true,
      headers: { get: () => null },
      body: { getReader: () => ({
        read: async () => ({ done: false, value: chunk }),
        cancel: async () => {},
        releaseLock() {},
      }) },
    }),
  });
  Array.prototype.push = function (...values) {
    if (values.length === 1 && values[0] === chunk) retained++;
    return Reflect.apply(push, this, values);
  };
  try {
    await assert.rejects(source({ path: 'x', maxBytes: 0 }), { message: 'Asset exceeds byte limit' });
    assert.equal(retained, 0);
  } finally {
    Array.prototype.push = push;
  }
});

for (const mode of ['absent source', 'invalid bytes', 'excess total', 'wrong digest', 'invalid handle']) {
  test(`[director-092] The session does not read the global error property for ${mode}`, async () => {
    const saved = Object.getOwnPropertyDescriptor(globalThis, 'error');
    let reads = 0, calls = 0, s;
    Object.defineProperty(globalThis, 'error', { configurable: true, get() { reads++; return new Error('other'); } });
    class FullBytes extends Uint8Array { get length() { return 8388608; } }
    const source = () => {
      if (mode === 'invalid bytes') return { bytes: null };
      if (mode === 'excess total') return { bytes: ++calls === 5 ? new Uint8Array([1]) : new FullBytes([1]) };
      return asset();
    };
    const p = pack(); if (mode === 'wrong digest') p.sha256 = '0'.repeat(64);
    const packs = mode === 'excess total' ? Array.from({ length: 5 }, (_, i) => ({ ...p, id: `p${i}` })) : [p];
    try {
      s = mode === 'absent source' ? createDataPackSession() : makeSession(source, mode === 'invalid handle' ? () => null : undefined);
      await assert.rejects(s.load(packs), { message: 'Data pack could not load: check its source, format, size or integrity' });
      assert.equal(reads, 0);
    } finally {
      s?.destroy();
      if (saved) Object.defineProperty(globalThis, 'error', saved);
      else delete globalThis.error;
    }
  });
}

test('[director-082] The manifest rejects a reference in the second shot', () => {
  assert.throws(() => validateSceneDataPacks({ dataPacks: [pack()], shots: [{ dataPackIds: ['outline'] }, { dataPackIds: ['absent'] }] }, '$'), { message: '$.shots[1].dataPackIds: expected distinct scene pack IDs' });
});
test('[director-077] The manifest rejects an unlisted geojsonx format', () => {
  assert.throws(() => validateDataPack({ ...pack(), format: 'geojsonx' }, 'pack', new Set()), { message: 'pack.format: unsupported pack format' });
});
test('[director-094] The source rejects the file protocol', () => {
  assert.throws(() => createAssetDirectorySource({ baseUrl: 'file:///assets/' }), { message: 'Asset source requires an explicit HTTP(S) directory URL' });
});
test('[director-077 director-082] The manifest rejects an invalid second data pack', () => {
  assert.throws(() => validateSceneDataPacks({ dataPacks: [pack(), { ...pack(), id: 'second', version: 2 }], shots: [] }, '$'), { message: '$.dataPacks[1].version: unsupported pack version' });
});
test('[director-081] The manifest accepts a reference to the second anchor', () => {
  assert.doesNotThrow(() => validateSceneDataPacks({ anchors: [{ id: 'first' }, { id: 'second' }], dataPacks: [{ ...pack(), format: 'media', placement: { anchorId: 'second' } }], shots: [] }, '$'));
});
test('[director-082] The manifest rejects an unknown second reference ID', () => {
  assert.throws(() => validateSceneDataPacks({ dataPacks: [pack()], shots: [{ dataPackIds: ['outline', 'absent'] }] }, '$'), { message: '$.shots[0].dataPackIds: expected distinct scene pack IDs' });
});
test('[director-084] The decoder rejects the second feature', () => {
  assert.throws(() => geoFeatures([feature('first'), feature('first')]), { message: 'Features require distinct string IDs' });
});
test('[director-085 director-086] The decoder rejects the second line position', () => {
  assert.throws(() => geoFeatures([feature('line', 'LineString', [[0, 0], [0, 91]])]), { message: 'Invalid geographic position' });
});
test('[director-087] The decoder rejects the second ring', () => {
  assert.throws(() => geoFeatures([feature('polygon', 'Polygon', [[[0, 0], [1, 0], [1, 1], [0, 0]], [[0, 0], [1, 0], [1, 1], [0, 1]]])]), { message: 'Unclosed ring' });
});
test('[director-088] The session rejects an invalid second data pack before the source call', async () => {
  let calls = 0;
  const session = makeSession(() => { calls++; return asset(); });
  try {
    await assert.rejects(session.load([pack(), { ...pack(), id: 'second', version: 2 }]), { message: 'packs[1].version: unsupported pack version' });
    assert.equal(calls, 0);
  } finally { session.destroy(); }
});
test('[director-081 director-093] The session accepts a reference to the second anchor', async () => {
  const session = createDataPackSession({ sources: { assets: asset }, adapters: { media: () => ({ dispose() {} }) } });
  try { assert.equal(await session.load([{ ...pack(), format: 'media', placement: { anchorId: 'second' } }], { anchors: [{ id: 'first' }, { id: 'second' }] }), true); }
  finally { session.destroy(); }
});

test('[director-076] The validator rejects an invalid second path segment', () => {
  assert.throws(() => validateAssetPath('safe/../x'), { message: 'source.path: expected a relative asset path without URL syntax or traversal' });
});
test('[director-085] The decoder rejects an invalid second coordinate', () => {
  assert.throws(() => geoFeatures([feature('point', 'Point', [0, null])]), { message: 'Invalid geographic position' });
});

test('[director-079 director-082] The manifest rejects the second data pack digest', () => {
  const second = { ...pack(), id: 'second', sha256: 'A'.repeat(64) };
  assert.throws(() => validateSceneDataPacks({ dataPacks: [pack(), second], shots: [] }, '$'), { message: '$.dataPacks[1].sha256: expected a lowercase SHA-256 digest' });
});
test('[director-080] The manifest rejects the last bounds coordinate', () => {
  const value = imagePack();
  value.placement.bounds[3] = '1';
  assert.throws(() => validateDataPack(value, 'pack', new Set()), { message: 'pack.placement.bounds[3]: expected a number from -90 to 90' });
});

test('[director-097] The source cancels before it reads the second chunk', async () => {
  const chunks = [new Uint8Array([1]), new Uint8Array([2])];
  let reads = 0, checks = 0, unlocked = 0;
  const signal = {
    throwIfAborted() { if (++checks === 3) throw new Error('stop'); },
  };
  const source = directory(() => ({
    ok: true,
    headers: { get: () => null },
    body: {
      getReader: () => ({
        async read() {
          const value = chunks[reads++];
          return value ? { done: false, value } : { done: true };
        },
        cancel: async () => {},
        releaseLock() { unlocked++; },
      }),
    },
  }));
  await assert.rejects(source({ path: 'x', signal }), { message: 'stop' });
  assert.equal(reads, 1);
  assert.equal(unlocked, 1);
});


test('[director-088 director-093] The session calls both registered sources and both renderers', async () => {
  const first = pack();
  const second = { ...imagePack(), id: 'image', source: { adapter: 'pictures', path: 'test/image.png' } };
  const calls = [];
  const session = createDataPackSession({
    sources: {
      assets: ({ path }) => { calls.push(['source', path]); return asset(); },
      pictures: ({ path }) => { calls.push(['picture', path]); return { bytes: new Uint8Array([4, 5]), mimeType: 'image/png' }; },
    },
    adapters: {
      geojson: ({ pack, asset }) => { calls.push(['geojson', pack.id, [...asset.bytes]]); return { dispose() {} }; },
      image: ({ pack, asset }) => { calls.push(['image', pack.id, [...asset.bytes]]); return { dispose() {} }; },
    },
  });
  try {
    assert.equal(await session.load([first, second]), true);
    assert.deepEqual(calls, [
      ['source', 'example/outline.geojson'], ['geojson', 'outline', [1, 2, 3]],
      ['picture', 'test/image.png'], ['image', 'image', [4, 5]],
    ]);
    assert.equal(session.getState().count, 2);
  } finally { session.destroy(); }
});

for (const [tag, label, make, object, path] of [
  ['077', 'data pack', pack, p => p, 'pack'],
  ['077', 'source', pack, p => p.source, 'pack.source'],
  ['078', 'attribution', pack, p => p.attribution, 'pack.attribution'],
  ['080', 'geojson placement', pack, p => p.placement, 'pack.placement'],
  ['080', 'image placement', imagePack, p => p.placement, 'pack.placement'],
  ['081', 'media placement', () => ({ ...pack(), format: 'media', placement: { anchorId: 'anchor' } }), p => p.placement, 'pack.placement'],
]) {
  test(`[director-${tag}] The manifest rejects script and adapters in the ${label}`, () => {
    for (const key of ['script', 'adapters']) {
      const value = make();
      object(value)[key] = true;
      assert.throws(() => validateDataPack(value, 'pack', new Set(['anchor'])), {
        message: `${path}.${key}: unsupported field`,
      });
    }
  });
}
