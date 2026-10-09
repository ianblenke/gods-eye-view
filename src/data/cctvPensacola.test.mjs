import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pensacolaCameraToSource as map,
  loadPensacolaSourcesFromOpenData as load,
} from '../../server/providers/cctv/pensacola.js';
import { normalizeSourceItem } from '../../server/providers/cctv/normalize.js';
import { createCctvCatalog } from '../../server/providers/cctv/catalog.js';

const endpoint =
  'https://services.arcgis.com/3wFbqsFPLeKqOlIK/arcgis/rest/services/FL511_Traffic_Cameras/FeatureServer/0/query';
const query = {
  where: '1=1',
  geometryType: 'esriGeometryEnvelope',
  inSR: '4326',
  outSR: '4326',
  spatialRel: 'esriSpatialRelIntersects',
  geometry: '-87.65,30.2,-86.8,30.85',
  returnGeometry: 'false',
  f: 'json',
  outFields: 'DESCRIPT,DIRECTION,LATITUDE,LONGITUDE,IMAGE',
  resultRecordCount: '200',
};
const row = (changes = {}) => ({
  ID: '492',
  COUNTY: 'Escambia ',
  TIMESTAMP: '07/20/2026 8:10:17 PM',
  DESCRIPT: 'I10-MM 010.2EB-Pensacola Blvd',
  DIRECTION: 'E',
  LATITUDE: 30.502183,
  LONGITUDE: -87.266586,
  IMAGE: 'https://images-dis.divas.cloud/DGI/chan-10416_h.jpg',
  ...changes,
});
const body = (rows = [row()]) => ({
  features: rows.map((attributes) => ({ attributes })),
});
function setup(t, env = {}) {
  const saved = { ...process.env };
  for (const key of [
    'CCTV_PENSACOLA_ENABLED',
    'CCTV_PENSACOLA_MAX_SOURCES',
    'CCTV_PENSACOLA_ROWS_URL',
  ])
    delete process.env[key];
  Object.assign(process.env, env);
  t.after(() => {
    process.env = saved;
  });
  t.mock.method(console, 'log', () => {});
  return t.mock.method(console, 'warn', () => {});
}
function fake(t, response) {
  t.mock.method(globalThis, 'fetch', async () => response);
}
const expected = {
  id: 'fl-10416',
  name: 'I10-MM 010.2EB-Pensacola Blvd',
  code: '10416',
  feedType: 'image',
  url: 'https://images-dis.divas.cloud/DGI/chan-10416_h.jpg',
  snapshotUrl: 'https://images-dis.divas.cloud/DGI/chan-10416_h.jpg',
  lat: 30.502183,
  lon: -87.266586,
  headingDeg: 90,
  headingConfidence: 'low',
  provider: 'FL511',
  city: 'Pensacola',
  cityId: 'pensacola',
  sourceKind: 'fl511-open-data',
  license: 'FL511 (FDOT), individual non-commercial use only',
  pitchDeg: -18,
  fovDeg: 44,
  rangeM: 145,
  mountHeightM: 8,
  groundElevationM: 5,
};
test('[live-sources-010] maps each source field', () => {
  const source = map(row());
  assert.deepEqual(source, expected);
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(Object.hasOwn(source, key), true);
    assert.equal(normalizeSourceItem(source)[key], value);
  }
});
for (const [direction, heading] of [
  ['N', 0],
  ['E', 90],
  ['S', 180],
  ['W', 270],
  [' E ', 90],
])
  test(`[live-sources-011] maps direction ${direction}`, () => {
    const source = map(row({ DIRECTION: direction }));
    assert.equal(source.headingDeg, heading);
    assert.equal(source.headingConfidence, 'low');
  });
for (const direction of [
  'NOT DIRECTIONAL',
  'NE',
  'e',
  'constructor',
  '',
  undefined,
])
  test(`[live-sources-012] uses fallback for ${String(direction)}`, () => {
    const source = map(row({ DIRECTION: direction }));
    assert.equal(source.headingDeg, 45);
    assert.equal(source.headingConfidence, 'low');
  });
for (const image of [
  'https://snapshots.divas.cloud/DGI/D3CHP/US-98 at SR-281.jpg',
  'https://snapshots.divas.cloud/DGI/chan-1_h.jpg',
  'https://images-dis.divas.cloud.example.com/DGI/chan-1_h.jpg',
  'https://example.com/DGI/chan-1_h.jpg',
  'http://images-dis.divas.cloud/DGI/chan-1_h.jpg',
  'https://images-dis.divas.cloud:8443/DGI/chan-1_h.jpg',
  'https://user@images-dis.divas.cloud/DGI/chan-1_h.jpg',
])
  test(`[live-sources-013] drops address ${image}`, () => {
    assert.equal(map(row({ IMAGE: image })), null);
  });
for (const image of [
  'https://images-dis.divas.cloud/OTHER/chan-1_h.jpg',
  'https://images-dis.divas.cloud/DGI/other.jpg',
  'https://images-dis.divas.cloud/DGI/chan-1_l.jpg',
  'https://images-dis.divas.cloud/DGI/chan-1_h.jpg.exe',
  '',
  '   ',
  12345,
  undefined,
  'not a URL',
])
  test(`[live-sources-014] drops frame ${String(image)}`, () => {
    assert.equal(map(row({ IMAGE: image })), null);
  });
test('[live-sources-015] builds the clean frame address', () => {
  const source = map(
    row({
      IMAGE:
        'https://images-dis.divas.cloud/DGI/chan-10416_h.jpg?token=abc#top',
    }),
  );
  assert.equal(
    source.url,
    'https://images-dis.divas.cloud/DGI/chan-10416_h.jpg',
  );
  assert.equal(
    source.snapshotUrl,
    'https://images-dis.divas.cloud/DGI/chan-10416_h.jpg',
  );
});
for (const [label, changes] of [
  ['no latitude', { LATITUDE: undefined }],
  ['no longitude', { LONGITUDE: undefined }],
  ['text latitude', { LATITUDE: '30.502183' }],
  ['text longitude', { LONGITUDE: '-87.266586' }],
  ['zero', { LATITUDE: 0, LONGITUDE: 0 }],
  ['NaN', { LATITUDE: NaN }],
  ['infinite', { LONGITUDE: Infinity }],
])
  test(`[live-sources-016] drops ${label}`, () => {
    assert.equal(map(row(changes)), null);
  });
test('[live-sources-017] keeps the first channel', async (t) => {
  setup(t);
  fake(
    t,
    Response.json(
      body([row({ DESCRIPT: 'Alpha' }), row({ DESCRIPT: 'Beta' })]),
    ),
  );
  const sources = await load();
  assert.equal(sources.length, 1);
  assert.equal(sources[0].id, 'fl-10416');
  assert.equal(sources[0].name, 'Alpha');
});
for (const description of [undefined, '', '   ', ' Alpha '])
  test(`[live-sources-018] sets name for ${String(description)}`, () => {
    assert.equal(
      map(row({ DESCRIPT: description })).name,
      description === ' Alpha ' ? 'Alpha' : 'FL511 camera 10416',
    );
  });
test('[live-sources-019] sends only the fixed query and timeout', async (t) => {
  setup(t);
  const signal = new AbortController().signal;
  const timeout = t.mock.method(AbortSignal, 'timeout', () => signal);
  const request = t.mock.method(globalThis, 'fetch', async () =>
    Response.json(body()),
  );
  await load();
  assert.equal(request.mock.callCount(), 1);
  const [address, options] = request.mock.calls[0].arguments;
  const url = new URL(address);
  assert.equal(url.origin + url.pathname, endpoint);
  assert.deepEqual(Object.fromEntries(url.searchParams), query);
  assert.deepEqual(options, {
    headers: { Accept: 'application/json' },
    redirect: 'manual',
    signal,
  });
  assert.deepEqual(timeout.mock.calls[0].arguments, [15000]);
});
test('[live-sources-020] reads attributes and drops invalid entries', async (t) => {
  setup(t);
  fake(
    t,
    Response.json({
      features: [{ attributes: row() }, { attributes: null }, null, 7],
    }),
  );
  const sources = await load();
  assert.equal(sources.length, 1);
  assert.equal(sources[0].id, 'fl-10416');
  assert.equal(map(null), null);
  assert.equal(map(7), null);
});
for (const variant of ['body', 'no body', 'cancel error'])
  test(`[live-sources-021] handles HTTP error with ${variant}`, async (t) => {
    const warn = setup(t);
    let cancelled = 0;
    const response = {
      status: 503,
      ok: false,
      body:
        variant === 'no body'
          ? null
          : {
              cancel: async () => {
                cancelled++;
                if (variant === 'cancel error') throw new Error('cancel');
              },
            },
    };
    fake(t, response);
    assert.deepEqual(await load(), []);
    assert.equal(cancelled, variant === 'no body' ? 0 : 1);
    assert.deepEqual(
      warn.mock.calls.map((call) => call.arguments),
      [['[CCTV] Pensacola camera download failed:', 503]],
    );
  });
for (const error of [new Error('network down'), 'boom'])
  test(`[live-sources-022] handles request error ${String(error)}`, async (t) => {
    const warn = setup(t);
    t.mock.method(globalThis, 'fetch', async () => {
      throw error;
    });
    assert.deepEqual(await load(), []);
    assert.deepEqual(warn.mock.calls[0].arguments, [
      '[CCTV] Pensacola camera download error:',
      error === 'boom' ? 'boom' : 'network down',
    ]);
  });
for (const status of [302, 307])
  test(`[live-sources-023] refuses redirect ${status}`, async (t) => {
    const warn = setup(t);
    let cancelled = 0;
    fake(t, {
      status,
      ok: false,
      body: {
        cancel: async () => {
          cancelled++;
        },
      },
    });
    assert.deepEqual(await load(), []);
    assert.equal(cancelled, 1);
    assert.deepEqual(warn.mock.calls[0].arguments, [
      '[CCTV] Pensacola layer redirected; redirects are not followed',
    ]);
  });
for (const variant of ['declared', 'stream', 'exact'])
  test(`[live-sources-024] checks body size ${variant}`, async (t) => {
    const warn = setup(t);
    const json = JSON.stringify(body());
    const response =
      variant === 'declared'
        ? new Response(json, { headers: { 'Content-Length': '1048577' } })
        : new Response(
            json.padEnd(variant === 'exact' ? 1048576 : 1048577, ' '),
          );
    fake(t, response);
    const sources = await load();
    if (variant === 'exact') {
      assert.equal(sources.length, 1);
      assert.equal(sources[0].id, 'fl-10416');
      assert.equal(warn.mock.callCount(), 0);
    } else {
      assert.deepEqual(sources, []);
      assert.equal(
        warn.mock.calls[0].arguments[0],
        '[CCTV] Pensacola camera download error:',
      );
    }
  });
for (const payload of [
  { error: { message: 'bad' } },
  {},
  { features: [], error: {} },
])
  test(`[live-sources-025] handles error payload ${JSON.stringify(payload)}`, async (t) => {
    const warn = setup(t);
    fake(t, Response.json(payload));
    assert.deepEqual(await load(), []);
    assert.deepEqual(warn.mock.calls[0].arguments, [
      '[CCTV] Pensacola layer answered with an error.',
    ]);
  });
for (const [value, count] of [
  [undefined, 120],
  ['', 120],
  ['50', 50],
  ['50.9', 50],
  ['5', 8],
  ['500', 200],
  ['abc', 120],
])
  test(`[live-sources-026] applies cap ${String(value)}`, async (t) => {
    setup(t, value === undefined ? {} : { CCTV_PENSACOLA_MAX_SOURCES: value });
    const rows = Array.from({ length: 250 }, (_, i) => {
      const n = 250 - i;
      return row({
        LATITUDE: 30.4213 + n * 0.001,
        LONGITUDE: -87.2169,
        IMAGE: `https://images-dis.divas.cloud/DGI/chan-${1000 + n}_h.jpg`,
      });
    });
    fake(t, Response.json(body(rows)));
    const sources = await load();
    assert.equal(sources.length, count);
    assert.deepEqual(
      sources.map((source) => source.id),
      Array.from({ length: count }, (_, i) => `fl-${1001 + i}`),
    );
  });
for (const value of ['0', undefined, '', '1', 'false'])
  test(`[live-sources-${value === '0' ? '027' : '028'}] catalog applies switch ${String(value)}`, async (t) => {
    setup(t, value === undefined ? {} : { CCTV_PENSACOLA_ENABLED: value });
    let requests = 0;
    t.mock.method(globalThis, 'fetch', async (address) => {
      if (new URL(address).origin + new URL(address).pathname === endpoint) {
        requests++;
        return Response.json(body());
      }
      return Response.json([]);
    });
    const catalog = await createCctvCatalog({ sourceRoot: '/nonexistent' })();
    assert.equal(requests, value === '0' ? 0 : 1);
    assert.equal(
      catalog.some((source) => source.id === 'fl-10416'),
      value !== '0',
    );
  });
for (const value of ['http://127.0.0.1:9/layer/query', ''])
  test(`[live-sources-029] applies layer address ${value}`, async (t) => {
    setup(t, { CCTV_PENSACOLA_ROWS_URL: value });
    const request = t.mock.method(globalThis, 'fetch', async () =>
      Response.json(body()),
    );
    await load();
    const url = new URL(request.mock.calls[0].arguments[0]);
    assert.equal(url.origin + url.pathname, value || endpoint);
    assert.deepEqual(Object.fromEntries(url.searchParams), query);
  });
for (const [lat, lon, valid] of [
  [30.2, -87.65, true],
  [30.85, -86.8, true],
  [30.19, -87.65, false],
  [30.86, -87.65, false],
  [30.2, -87.66, false],
  [30.85, -86.79, false],
])
  test(`[live-sources-030] checks area point ${lat} ${lon}`, () => {
    const source = map(row({ LATITUDE: lat, LONGITUDE: lon }));
    assert.equal(source !== null, valid);
  });
