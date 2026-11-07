import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeScenes } from '../../server/providers/up42/normalize.js';

const ring = [
  [10, 60],
  [10.02, 60],
  [10.02, 60.01],
  [10, 60.01],
  [10, 60],
];
const map = new Map([
  ['pneo', { host: 'oneatlas', thumbnail: true }],
  ['phr', { host: 'oneatlas', thumbnail: false }],
  ['other', { host: 'planet', thumbnail: true }],
]);
const row = (extra = {}) => ({
  type: 'Feature',
  id: 'wrong-id',
  geometry: { type: 'Polygon', coordinates: [ring] },
  properties: {
    id: 'scene.1',
    collection: 'pneo',
    datetime: '2026-10-01T01:02:03Z',
    start_datetime: '2026-10-02T02:03:04Z',
    end_datetime: '2026-10-03T03:04:05Z',
    resolution: 0.7,
    producer: 'Producer A',
    constellation: 'Constellation B',
    cloudCoverage: 13,
    providerProperties: { secret: 'HIDDEN' },
    thumbnail: false,
    ...extra,
  },
});
const one = (extra) => normalizeScenes([row(extra)], 'oneatlas', map).scenes[0];

test('[up42-source-019] sets only the named scene fields from their sources', () => {
  assert.deepEqual(one(), {
    id: 'scene.1',
    host: 'oneatlas',
    collection: 'pneo',
    start: '2026-10-02T02:03:04.000Z',
    end: '2026-10-03T03:04:05.000Z',
    footprint: { type: 'Polygon', coordinates: [ring] },
    resolutionM: 0.7,
    provider: 'Producer A',
    cloudPercent: 13,
    thumbnail: true,
  });
  assert.deepEqual(
    one({
      start_datetime: null,
      end_datetime: null,
      producer: null,
      collection: 'phr',
      thumbnail: true,
    }),
    {
      id: 'scene.1',
      host: 'oneatlas',
      collection: 'phr',
      start: '2026-10-01T01:02:03.000Z',
      end: '2026-10-01T01:02:03.000Z',
      footprint: { type: 'Polygon', coordinates: [ring] },
      resolutionM: 0.7,
      provider: 'Constellation B',
      cloudPercent: 13,
      thumbnail: false,
    },
  );
  assert.equal(one({ producer: ' A\u0000B ' }).provider, 'AB');
  assert.equal(one({ producer: '😀'.repeat(121) }).provider, '😀'.repeat(120));
  assert.equal(one({ producer: '', constellation: ' ' }).provider, null);
  assert.equal(one({ producer: 1, constellation: false }).provider, null);
});

test('[up42-source-020] drops each invalid feature and counts all drops', () => {
  const bad = [
    null,
    [],
    5,
    { ...row(), properties: null },
    row({ id: '' }),
    row({ id: 'a b' }),
    row({ id: 'a'.repeat(129) }),
    row({ id: 1 }),
    row({ collection: 'missing' }),
    row({ collection: 'other' }),
    row({ datetime: null, start_datetime: null }),
    row({ end_datetime: 'x' }),
    row({ end_datetime: '2020-01-01T00:00:00Z' }),
  ];
  const answer = normalizeScenes(
    [
      ...bad,
      row(),
      row({
        id: 'second',
        collection: 'phr',
        resolution: 2,
        cloudCoverage: 27,
      }),
    ],
    'oneatlas',
    map,
  );
  assert.equal(answer.dropped, 13);
  assert.deepEqual(
    answer.scenes.map(
      ({ id, collection, resolutionM, cloudPercent, thumbnail }) => ({
        id,
        collection,
        resolutionM,
        cloudPercent,
        thumbnail,
      }),
    ),
    [
      {
        id: 'scene.1',
        collection: 'pneo',
        resolutionM: 0.7,
        cloudPercent: 13,
        thumbnail: true,
      },
      {
        id: 'second',
        collection: 'phr',
        resolutionM: 2,
        cloudPercent: 27,
        thumbnail: false,
      },
    ],
  );
  assert.equal(one({ id: 'a'.repeat(128) }).id, 'a'.repeat(128));
  assert.equal(one({ id: 'A_z-9.' }).id, 'A_z-9.');
});

for (const [index, value] of [
  null,
  undefined,
  '7',
  true,
  -1,
  NaN,
  Infinity,
  {},
  [],
].entries()) {
  test(`[up42-source-020] clears number case ${index}`, () => {
    const scene = one({ resolution: value, cloudCoverage: value });
    assert.equal(scene.resolutionM, null);
    assert.equal(scene.cloudPercent, null);
  });
}
test('[up42-source-020] keeps the number limits', () => {
  assert.equal(one({ resolution: 0 }).resolutionM, 0);
  assert.equal(one({ cloudCoverage: 0 }).cloudPercent, 0);
  assert.equal(one({ cloudCoverage: 100 }).cloudPercent, 100);
  assert.equal(one({ cloudCoverage: 100.1 }).cloudPercent, null);
  assert.equal(one({ resolution: 1000 }).resolutionM, 1000);
});

const circle = (n) => {
  const points = Array.from({ length: n - 1 }, (_, i) => [
    10 + 0.01 * Math.cos((i * Math.PI * 2) / (n - 1)),
    60 + 0.01 * Math.sin((i * Math.PI * 2) / (n - 1)),
  ]);
  return [...points, [...points[0]]];
};
for (const [index, geometry] of [
  null,
  [],
  { type: 'Point', coordinates: [10, 60] },
  { type: 'Polygon', coordinates: null },
  { type: 'Polygon', coordinates: [] },
  { type: 'Polygon', coordinates: [ring, ring] },
  { type: 'Polygon', coordinates: [null] },
  { type: 'Polygon', coordinates: [circle(3)] },
  { type: 'Polygon', coordinates: [circle(2001)] },
  { type: 'Polygon', coordinates: [ring.slice(0, -1)] },
  { type: 'Polygon', coordinates: [[...ring.slice(0, -1), [10, 60.02]]] },
].entries()) {
  test(`[up42-source-020] drops polygon case ${index}`, () => {
    assert.deepEqual(
      normalizeScenes([{ ...row(), geometry }], 'oneatlas', map),
      { scenes: [], dropped: 1 },
    );
  });
}
for (const [index, point] of [
  null,
  [10],
  [10, 60, 2, 3],
  ['10', 60],
  [10, 60, 'x'],
  [181, 60],
  [-181, 60],
  [10, 91],
  [10, -91],
  [10, 60, Infinity],
  [NaN, 60],
].entries()) {
  test(`[up42-source-020] drops position case ${index}`, () => {
    const geometry = {
      type: 'Polygon',
      coordinates: [[ring[0], point, ...ring.slice(2)]],
    };
    assert.deepEqual(
      normalizeScenes([{ ...row(), geometry }], 'oneatlas', map),
      { scenes: [], dropped: 1 },
    );
  });
}
test('[up42-source-020] keeps valid rings and removes altitude', () => {
  for (const n of [4, 2000])
    assert.equal(
      normalizeScenes(
        [{ ...row(), geometry: { type: 'Polygon', coordinates: [circle(n)] } }],
        'oneatlas',
        map,
      ).dropped,
      0,
    );
  const geometry = {
    type: 'Polygon',
    coordinates: [ring.map(([x, y], i) => [x, y, i])],
  };
  assert.deepEqual(
    normalizeScenes([{ ...row(), geometry }], 'oneatlas', map).scenes[0]
      .footprint,
    { type: 'Polygon', coordinates: [ring] },
  );
  const edges = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ];
  assert.equal(
    normalizeScenes(
      [{ ...row(), geometry: { type: 'Polygon', coordinates: [edges] } }],
      'oneatlas',
      map,
    ).dropped,
    0,
  );
});

test('[up42-source-020] drops an id with a final line break', () => {
  assert.deepEqual(
    normalizeScenes([row({ id: 'scene.1\n' })], 'oneatlas', map),
    { scenes: [], dropped: 1 },
  );
});
