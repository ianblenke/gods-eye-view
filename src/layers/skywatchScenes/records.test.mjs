import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_SCENES, normalizeAnswer } from './records.js';

const RING = [
  [10, 60],
  [10.2, 60],
  [10.2, 60.1],
  [10, 60.1],
  [10, 60],
];
const scene = (id, overrides = {}) => ({
  id,
  start: '2026-10-14T08:03:00.000Z',
  end: '2026-10-14T08:03:05.000Z',
  footprint: { type: 'Polygon', coordinates: [RING] },
  resolutionM: 0.5,
  provider: 'Satellogic',
  product: 'Aleph-1',
  cloudPercent: 3.4,
  coveragePercent: 100,
  areaKm2: 120,
  pricePerKm2: 5,
  cost: 600,
  thumbnail: true,
  ...overrides,
});
const answer = (scenes, extra = {}) => ({
  source: 'SkyWatch',
  scenes,
  count: scenes.length,
  total: scenes.length,
  truncated: false,
  cached: false,
  budget: { used: 3, limit: 20 },
  ...extra,
});
const idsOf = (payload) => normalizeAnswer(payload).scenes.map(({ id }) => id);

test('[skywatch-scenes-layer-016] keeps exactly the seven fields of a valid scene', () => {
  const result = normalizeAnswer(answer([scene('scene-1')]));
  assert.deepEqual(result.scenes, [
    {
      id: 'scene-1',
      time: Date.parse('2026-10-14T08:03:00.000Z'),
      ring: RING,
      resolutionM: 0.5,
      provider: 'Satellogic',
      cloudPercent: 3.4,
      thumbnail: true,
    },
  ]);
  assert.deepEqual(Object.keys(result).sort(), [
    'limit',
    'scenes',
    'total',
    'truncated',
    'used',
  ]);
});

test('[skywatch-scenes-layer-016] drops a scene whose id does not have 1 to 128 letters, digits, hyphens or underscores', () => {
  const good = ['a', 'A-z_0', 'x'.repeat(128)];
  const bad = ['', 'x'.repeat(129), 'a b', 'a/b', 'a.b', 'é', 7, null];
  assert.deepEqual(
    idsOf(answer([...good, ...bad].map((id) => scene(id)))),
    good,
  );
  assert.deepEqual(idsOf(answer([{ ...scene('x'), id: undefined }])), []);
});

test('[skywatch-scenes-layer-016] drops a scene whose start is not a text that Date.parse reads', () => {
  const payload = answer([
    scene('a', { start: 'not a time' }),
    scene('b', { start: 1760429000000 }),
    scene('c', { start: null }),
    scene('d', { start: 'Oct 14 2026 08:03:00 GMT' }),
    scene('e', { start: 2026 }),
    scene('f', { start: ['2026-10-14T08:03:00.000Z'] }),
  ]);
  const result = normalizeAnswer(payload);
  assert.deepEqual(
    result.scenes.map(({ id }) => id),
    ['d'],
  );
  assert.equal(result.scenes[0].time, Date.parse('2026-10-14T08:03:00.000Z'));
});

test('[skywatch-scenes-layer-016] drops a scene whose footprint is not a polygon with exactly one ring', () => {
  const payload = answer([
    scene('a', { footprint: null }),
    scene('b', { footprint: { type: 'MultiPolygon', coordinates: [RING] } }),
    scene('c', { footprint: { type: 'Polygon', coordinates: [] } }),
    scene('d', { footprint: { type: 'Polygon', coordinates: [RING, RING] } }),
    scene('e', { footprint: { type: 'Polygon', coordinates: RING } }),
    scene('f', { footprint: { type: 'Polygon' } }),
    scene('g', { footprint: 'Polygon' }),
    scene('i', {
      footprint: {
        type: 'Polygon',
        coordinates: [
          { 0: RING[0], 1: RING[1], 2: RING[2], 3: RING[0], length: 4 },
        ],
      },
    }),
    scene('h'),
  ]);
  assert.deepEqual(idsOf(payload), ['h']);
});

test('[skywatch-scenes-layer-016] keeps a ring of 4 to 2000 positions, and drops a shorter or longer ring', () => {
  const ringOf = (count) => {
    const ring = Array.from({ length: count - 1 }, (_, index) => [
      10 + index * 1e-5,
      60 + (index % 2) * 1e-5,
    ]);
    return [...ring, ring[0]];
  };
  const payload = answer([
    scene('three', {
      footprint: { type: 'Polygon', coordinates: [ringOf(3)] },
    }),
    scene('four', { footprint: { type: 'Polygon', coordinates: [ringOf(4)] } }),
    scene('max', {
      footprint: { type: 'Polygon', coordinates: [ringOf(2000)] },
    }),
    scene('over', {
      footprint: { type: 'Polygon', coordinates: [ringOf(2001)] },
    }),
  ]);
  const result = normalizeAnswer(payload);
  assert.deepEqual(
    result.scenes.map(({ id }) => id),
    ['four', 'max'],
  );
  assert.equal(result.scenes[1].ring.length, 2000);
});

test('[skywatch-scenes-layer-016] drops a scene with a position that is not two finite numbers in range', () => {
  const withPosition = (position) => [RING[0], position, ...RING.slice(2)];
  const positions = [
    [10, 60],
    [-180, -90],
    [180, 90],
    [10, 60, 5],
    [10],
    ['10', 60],
    [NaN, 60],
    [10, Infinity],
    [10, NaN],
    [180.0001, 60],
    [-180.0001, 60],
    [10, 90.0001],
    [10, -90.0001],
    null,
    { 0: 10, 1: 60, length: 2 },
  ];
  const payload = answer(
    positions.map((position, index) =>
      scene(`p${index}`, {
        footprint: { type: 'Polygon', coordinates: [withPosition(position)] },
      }),
    ),
  );
  assert.deepEqual(idsOf(payload), ['p0', 'p1', 'p2']);
});

test('[skywatch-scenes-layer-016] drops a scene whose first and last positions are not equal', () => {
  const open = [...RING.slice(0, 4), [10, 60.0001]];
  const lonOff = [...RING.slice(0, 4), [10.0001, 60]];
  const payload = answer([
    scene('open', { footprint: { type: 'Polygon', coordinates: [open] } }),
    scene('lon', { footprint: { type: 'Polygon', coordinates: [lonOff] } }),
    scene('closed'),
  ]);
  assert.deepEqual(idsOf(payload), ['closed']);
});

test('[skywatch-scenes-layer-016] drops an item that is not an object and a repeated id, and keeps the order of the answer', () => {
  const payload = answer([
    null,
    'scene',
    7,
    [scene('array')],
    scene('b'),
    scene('a'),
    scene('b', { provider: 'Second' }),
    scene('c'),
  ]);
  const result = normalizeAnswer(payload);
  assert.deepEqual(
    result.scenes.map(({ id }) => id),
    ['b', 'a', 'c'],
  );
  assert.equal(result.scenes[0].provider, 'Satellogic');
});

test('[skywatch-scenes-layer-016] keeps at most the first 50 valid scenes', () => {
  assert.equal(MAX_SCENES, 50);
  const scenes = [
    scene('bad', { id: '' }),
    ...Array.from({ length: 60 }, (_, index) => scene(`s${index}`)),
  ];
  const ids = idsOf(answer(scenes));
  assert.equal(ids.length, 50);
  assert.equal(ids[0], 's0');
  assert.equal(ids[49], 's49');
});

test('[skywatch-scenes-layer-016] keeps a resolution of 0 or more, a cloud cover from 0 to 100, a provider text and only a true thumbnail', () => {
  const rows = [
    [{ resolutionM: 0 }, 'resolutionM', 0],
    [{ resolutionM: 30 }, 'resolutionM', 30],
    [{ resolutionM: -0.1 }, 'resolutionM', null],
    [{ resolutionM: '0.5' }, 'resolutionM', null],
    [{ resolutionM: Infinity }, 'resolutionM', null],
    [{ resolutionM: null }, 'resolutionM', null],
    [{ cloudPercent: 0 }, 'cloudPercent', 0],
    [{ cloudPercent: 100 }, 'cloudPercent', 100],
    [{ cloudPercent: 100.1 }, 'cloudPercent', null],
    [{ cloudPercent: -1 }, 'cloudPercent', null],
    [{ cloudPercent: NaN }, 'cloudPercent', null],
    [{ cloudPercent: '3' }, 'cloudPercent', null],
    [{ provider: 'Planet' }, 'provider', 'Planet'],
    [{ provider: '' }, 'provider', null],
    [{ provider: 7 }, 'provider', null],
    [{ provider: null }, 'provider', null],
    [{ thumbnail: true }, 'thumbnail', true],
    [{ thumbnail: false }, 'thumbnail', false],
    [{ thumbnail: 'true' }, 'thumbnail', false],
    [{ thumbnail: 1 }, 'thumbnail', false],
    [{ thumbnail: undefined }, 'thumbnail', false],
  ];
  for (const [overrides, field, value] of rows) {
    const [kept] = normalizeAnswer(answer([scene('x', overrides)])).scenes;
    assert.equal(kept[field], value, JSON.stringify(overrides));
  }
});

test('[skywatch-scenes-layer-016] reads total, truncated, used and limit, and gives null or false for each other value', () => {
  const good = normalizeAnswer(
    answer([scene('a')], {
      total: 132,
      truncated: true,
      budget: { used: 0, limit: 20 },
    }),
  );
  assert.deepEqual(
    [good.total, good.truncated, good.used, good.limit],
    [132, true, 0, 20],
  );
  for (const [extra, expected] of [
    [{ total: -1 }, { total: null }],
    [{ total: 1.5 }, { total: null }],
    [{ total: '132' }, { total: null }],
    [{ truncated: 'true' }, { truncated: false }],
    [{ truncated: 1 }, { truncated: false }],
    [{ budget: null }, { used: null, limit: null }],
    [{ budget: { used: -1, limit: 2.5 } }, { used: null, limit: null }],
    [{ budget: { used: '3', limit: null } }, { used: null, limit: null }],
  ]) {
    const result = normalizeAnswer(answer([scene('a')], extra));
    for (const [field, value] of Object.entries(expected))
      assert.equal(result[field], value, JSON.stringify(extra));
  }
  const bare = normalizeAnswer({ scenes: [] });
  assert.deepEqual(bare, {
    scenes: [],
    total: null,
    truncated: false,
    used: null,
    limit: null,
  });
});

test('[skywatch-scenes-layer-017] gives null for an answer that is not an object or has no list of scenes', () => {
  for (const payload of [
    null,
    undefined,
    'scenes',
    7,
    [],
    {},
    { scenes: null },
    { scenes: {} },
    { scenes: 'a' },
  ])
    assert.equal(normalizeAnswer(payload), null, JSON.stringify(payload));
});
