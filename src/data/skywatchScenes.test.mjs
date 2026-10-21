import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeScenes } from '../../server/providers/skywatch/normalize.js';

const RING = [
  [10, 60],
  [10.02, 60],
  [10.02, 60.01],
  [10, 60.01],
  [10, 60],
];
/** An upstream result in the documented shape, with made-up values. */
const row = (n, extra = {}) => ({
  id: `scene-${n}`,
  location: { type: 'Polygon', coordinates: [RING] },
  intersection: { type: 'Polygon', coordinates: [RING] },
  start_time: new Date(Date.UTC(2026, 9, 1 + n, 10, 30)).toISOString(),
  end_time: new Date(Date.UTC(2026, 9, 1 + n, 10, 31)).toISOString(),
  preview_uri: `https://previews.example.invalid/${n}.png?sig=CANARY`,
  thumbnail_uri: `https://thumbs.example.invalid/${n}.png?sig=CANARY`,
  resolution: 0.5,
  source: 'Example operator',
  product_name: 'Example product',
  location_coverage_percentage: 80,
  area_sq_km: 12.5,
  minimum_area_sq_km: 25,
  price_per_sq_km: 14,
  cost: 350,
  result_cloud_cover_percentage: 5,
  off_nadir_angle: 12.5,
  ...extra,
});
const doc = (data, extra = {}) => ({ data, ...extra });
const one = (extra) => normalizeScenes(doc([row(1, extra)])).scenes[0];

test('[skywatch-source-020] keeps only the allowed fields, from the named upstream fields', () => {
  const { scenes } = normalizeScenes(doc([row(1)]));
  assert.deepEqual(scenes, [
    {
      id: 'scene-1',
      start: '2026-10-02T10:30:00.000Z',
      end: '2026-10-02T10:31:00.000Z',
      footprint: { type: 'Polygon', coordinates: [RING] },
      resolutionM: 0.5,
      provider: 'Example operator',
      product: 'Example product',
      cloudPercent: 5,
      coveragePercent: 80,
      areaKm2: 12.5,
      pricePerKm2: 14,
      cost: 350,
      thumbnail: true,
    },
  ]);
  const text = JSON.stringify(scenes);
  for (const word of [
    'CANARY',
    'preview',
    'thumbs.example',
    'intersection',
    'minimum',
    'nadir',
  ])
    assert.equal(text.includes(word), false, word);
});

test('[skywatch-source-020] maps each number field from its own upstream field', () => {
  const scene = one({
    resolution: 1,
    result_cloud_cover_percentage: 2,
    location_coverage_percentage: 3,
    area_sq_km: 4,
    price_per_sq_km: 5,
    cost: 6,
  });
  assert.equal(scene.resolutionM, 1);
  assert.equal(scene.cloudPercent, 2);
  assert.equal(scene.coveragePercent, 3);
  assert.equal(scene.areaKm2, 4);
  assert.equal(scene.pricePerKm2, 5);
  assert.equal(scene.cost, 6);
});

test('[skywatch-source-020] gives null for each number value that does not meet its rule', () => {
  const fields = [
    ['resolution', 'resolutionM'],
    ['area_sq_km', 'areaKm2'],
    ['price_per_sq_km', 'pricePerKm2'],
    ['cost', 'cost'],
    ['result_cloud_cover_percentage', 'cloudPercent'],
    ['location_coverage_percentage', 'coveragePercent'],
  ];
  for (const [upstream, field] of fields) {
    for (const value of [
      null,
      '7',
      true,
      -1,
      Infinity,
      'Upgrade your plan for price',
      {},
      [],
    ]) {
      assert.equal(
        one({ [upstream]: value })[field],
        null,
        `${upstream} ${String(value)}`,
      );
    }
    assert.equal(one({ [upstream]: 0 })[field], 0, upstream);
    const missing = row(1);
    delete missing[upstream];
    assert.equal(normalizeScenes(doc([missing])).scenes[0][field], null);
  }
  for (const [upstream, field] of fields.slice(4)) {
    assert.equal(one({ [upstream]: 100 })[field], 100);
    assert.equal(one({ [upstream]: 100.5 })[field], null);
  }
  assert.equal(one({ area_sq_km: 100000 }).areaKm2, 100000);
  assert.equal(normalizeScenes(JSON.parse('{"data":[]}')).scenes.length, 0);
  const infinite = JSON.parse(
    JSON.stringify({ data: [row(1)] }).replace('"cost":350', '"cost":1e999'),
  );
  assert.equal(normalizeScenes(infinite).scenes[0].cost, null);
});

test('[skywatch-source-020] removes control characters and the white space at the ends, then keeps 120 code points', () => {
  assert.equal(one({ source: 'A\u0007B' }).provider, 'AB');
  assert.equal(
    one({ source: '\u0000\u001fA\u007f\u009fB\u00a0' }).provider,
    'AB',
  );
  assert.equal(one({ source: '  Operator  ' }).provider, 'Operator');
  assert.equal(one({ source: ' \u0001 ' }).provider, null);
  assert.equal(one({ source: '' }).provider, null);
  for (const value of [null, 5, true, {}, ['A']])
    assert.equal(one({ source: value }).provider, null);
  const exact = '😀'.repeat(120);
  assert.equal(one({ product_name: exact }).product, exact);
  assert.equal(one({ product_name: exact + '😀' }).product, exact);
  assert.equal(one({ product_name: 'x'.repeat(121) }).product, 'x'.repeat(120));
  assert.equal(
    one({ product_name: `${'x'.repeat(119)}\u0007yz` }).product,
    `${'x'.repeat(119)}y`,
  );
  assert.equal(
    one({ product_name: ` ${'x'.repeat(120)}` }).product,
    'x'.repeat(120),
  );
});

test('[skywatch-source-020] sets thumbnail from an absolute HTTPS thumbnail_uri only', () => {
  assert.equal(
    one({ thumbnail_uri: 'https://a.example.invalid/t.png' }).thumbnail,
    true,
  );
  for (const value of [
    'http://a.example.invalid/t.png',
    '//a.example.invalid/t.png',
    '/t.png',
    'not a url',
    'data:image/png;base64,AAAA',
    '',
    null,
    5,
  ])
    assert.equal(one({ thumbnail_uri: value }).thumbnail, false, String(value));
  const missing = row(1);
  delete missing.thumbnail_uri;
  assert.equal(normalizeScenes(doc([missing])).scenes[0].thumbnail, false);
});

test('[skywatch-source-020] gives the ISO text of a valid time, and null for an end_time that is not valid', () => {
  assert.equal(
    one({ start_time: '2026-10-05T01:02:03Z' }).start,
    '2026-10-05T01:02:03.000Z',
  );
  assert.equal(
    one({ end_time: '2026-10-05T01:02:03+02:00' }).end,
    '2026-10-04T23:02:03.000Z',
  );
  for (const value of ['not a time', '', null, 5, '2026-13-45T00:00:00Z'])
    assert.equal(one({ end_time: value }).end, null, String(value));
});

test('[skywatch-source-020] removes an item that is not an object, or a scene with a bad id, start_time or location', () => {
  const kept = row(9);
  const data = [
    null,
    5,
    'text',
    [],
    row(1, { id: 'has space' }),
    row(2, { id: '' }),
    row(3, { id: 'a'.repeat(129) }),
    row(4, { id: 7 }),
    row(5, { start_time: 'not a time' }),
    row(6, { start_time: null }),
    row(7, { location: null }),
    row(8, { location: { type: 'MultiPolygon', coordinates: [[RING]] } }),
    kept,
  ];
  const { scenes } = normalizeScenes(doc(data));
  assert.deepEqual(
    scenes.map((scene) => scene.id),
    ['scene-9'],
  );
  assert.equal(one({ id: 'a'.repeat(128) }).id, 'a'.repeat(128));
});

test('[skywatch-source-020] accepts only a polygon with exactly one closed ring of 4 to 2000 positions', () => {
  const polygon = (coordinates) => ({ type: 'Polygon', coordinates });
  const ringOf = (count) => {
    const ring = [];
    for (let i = 0; i < count - 1; i++) {
      const angle = (2 * Math.PI * i) / (count - 1);
      ring.push([10 + 0.01 * Math.cos(angle), 60 + 0.01 * Math.sin(angle)]);
    }
    ring.push([...ring[0]]);
    return ring;
  };
  const ids = (location) =>
    normalizeScenes(doc([row(1, { location })])).scenes.length;
  assert.equal(ids(polygon([ringOf(4)])), 1);
  assert.equal(ids(polygon([ringOf(2000)])), 1);
  assert.equal(ids(polygon([ringOf(3)])), 0);
  assert.equal(ids(polygon([ringOf(2001)])), 0);
  assert.equal(ids(polygon([RING, RING])), 0);
  assert.equal(ids(polygon([])), 0);
  assert.equal(ids(polygon('x')), 0);
  assert.equal(ids({ type: 'Point', coordinates: [10, 60] }), 0);
  assert.equal(ids({ coordinates: [RING] }), 0);
  const open = RING.slice(0, 4).concat([[10.01, 60]]);
  assert.equal(ids(polygon([open])), 0);
  const withAltitude = RING.map(([lon, lat], i) => [lon, lat, i === 4 ? 0 : 5]);
  withAltitude[4] = [10, 60, 99];
  assert.equal(ids(polygon([withAltitude])), 1);
  assert.deepEqual(
    one({ location: polygon([withAltitude]) }).footprint.coordinates,
    [RING],
  );
  for (const bad of [
    [10],
    [10, 60, 'x'],
    [10, 60, 1, 2],
    ['10', 60],
    [181, 60],
    [-181, 60],
    [10, 91],
    [10, -91],
    [NaN, 60],
    null,
  ]) {
    const ring = RING.map((p) => [...p]);
    ring[1] = bad;
    assert.equal(ids(polygon([ring])), 0, JSON.stringify(bad));
  }
  const edges = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ];
  assert.equal(ids(polygon([edges])), 1);
});

test('[skywatch-source-021] sorts all kept scenes, newest start first and then by id, and keeps the first 50', () => {
  const sameTime = '2026-10-10T00:00:00.000Z';
  const data = [
    row(1, { id: 'b', start_time: sameTime }),
    row(2, { id: 'a', start_time: sameTime }),
    row(3, { id: 'B', start_time: sameTime }),
    row(4, { id: 'z', start_time: '2026-10-11T00:00:00Z' }),
  ];
  assert.deepEqual(
    normalizeScenes(doc(data)).scenes.map((scene) => scene.id),
    ['z', 'B', 'a', 'b'],
  );
  const many = Array.from({ length: 51 }, (_, i) =>
    row(i, {
      start_time: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(),
    }),
  );
  const result = normalizeScenes(doc(many));
  assert.equal(result.scenes.length, 50);
  assert.equal(result.scenes[0].id, 'scene-50');
  assert.equal(result.scenes[49].id, 'scene-1');
  assert.equal(result.truncated, true);
});

test('[skywatch-source-021] gives total from pagination.total when it is a whole number not less than the data length', () => {
  const data = [row(1), row(2), null];
  assert.deepEqual(
    {
      ...normalizeScenes(doc(data, { pagination: { total: 3 } })),
      scenes: undefined,
    },
    { scenes: undefined, total: 3, truncated: false },
  );
  assert.equal(
    normalizeScenes(doc(data, { pagination: { total: 120 } })).total,
    120,
  );
  assert.equal(
    normalizeScenes(doc(data, { pagination: { total: 120 } })).truncated,
    true,
  );
  for (const total of [2, 3.5, '120', null, -1, Infinity]) {
    const result = normalizeScenes(doc(data, { pagination: { total } }));
    assert.equal(result.total, 3, String(total));
    assert.equal(result.truncated, false, String(total));
  }
  assert.equal(normalizeScenes(doc(data)).total, 3);
  assert.equal(normalizeScenes(doc(data, { pagination: null })).total, 3);
});

test('[skywatch-source-021] gives one order for each input order, also for two scenes with the same start and id', () => {
  const early = '2026-10-01T00:00:00.000Z';
  const late = '2026-10-02T00:00:00.000Z';
  const items = [
    row(1, { id: 'b', start_time: early }),
    row(2, { id: 'a', start_time: late }),
    row(3, { id: 'a', start_time: early }),
    row(4, { id: 'c', start_time: early }),
    row(5, { id: 'a', start_time: early }),
    row(6, { id: 'b', start_time: late }),
  ];
  const expected = [
    ['a', late],
    ['b', late],
    ['a', early],
    ['a', early],
    ['b', early],
    ['c', early],
  ];
  for (const order of [
    items,
    [...items].reverse(),
    [items[3], items[0], items[5], items[2], items[1], items[4]],
  ]) {
    assert.deepEqual(
      normalizeScenes(doc(order)).scenes.map((scene) => [
        scene.id,
        scene.start,
      ]),
      expected,
    );
  }
});
