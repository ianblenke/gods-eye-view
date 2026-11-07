import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HINT,
  footprintCentre,
  footprintStyle,
  readoutText,
  sceneList,
  thumbnailSize,
} from './model.js';

const RING = [
  [10, 60],
  [10.2, 60],
  [10.2, 60.1],
  [10, 60.1],
  [10, 60],
];
const scene = (id, time, overrides = {}) => ({
  id,
  time: Date.parse(time),
  ring: RING,
  resolutionM: 0.5,
  provider: 'Satellogic',
  cloudPercent: 3.4,
  thumbnail: true,
  ...overrides,
});
const answer = (scenes, extra = {}) => ({
  scenes,
  count: scenes.length,
  truncated: false,
  partial: false,
  used: 3,
  limit: 20,
  ...extra,
});
const THREE = answer([
  scene('a', '2026-10-12T10:00:00.000Z'),
  scene('b', '2026-10-14T08:03:00.000Z', {
    provider: 'Planet',
    resolutionM: 3,
    cloudPercent: 12,
  }),
  scene('c', '2026-08-01T00:00:00.000Z', {
    provider: 'Airbus',
    resolutionM: 1,
    cloudPercent: 40,
  }),
]);

test('[up42-scenes-layer-020] styles a footprint that is not selected and a selected footprint', () => {
  assert.deepEqual(footprintStyle(false), {
    color: '#38bdf8',
    outlineAlpha: 0.9,
    width: 2,
    fillAlpha: 0,
  });
  assert.deepEqual(footprintStyle(true), {
    color: '#facc15',
    outlineAlpha: 1,
    width: 3,
    fillAlpha: 0.25,
  });
});

test('[up42-scenes-layer-021] gives the hint with no answer and no message', () => {
  assert.equal(
    HINT,
    'A press searches 92 days of the UP42 archive in a 48 km box at the view centre.',
  );
  assert.equal(
    readoutText({ message: null, answer: null, thumbMessage: null }),
    'A press searches 92 days of the UP42 archive in a 48 km box at the view centre.',
  );
  assert.equal(
    readoutText({ message: '', answer: null }),
    'A press searches 92 days of the UP42 archive in a 48 km box at the view centre.',
  );
  assert.equal(
    readoutText({ message: 'Press failed.', answer: null }),
    'Press failed.',
  );
  assert.equal(
    readoutText({
      message: 'Press failed.',
      answer: null,
      thumbMessage: 'Loading the thumbnail…',
    }),
    'Press failed.',
  );
});

test('[up42-scenes-layer-021] writes the count, the newest date and the searches of the day', () => {
  assert.equal(
    readoutText({ message: null, answer: THREE, thumbMessage: null }),
    '3 scenes · newest 2026-10-14 · searches today 3 of 20',
  );
  assert.equal(
    readoutText({
      message: null,
      answer: answer([scene('a', '2026-10-14T08:03:00.000Z')]),
    }),
    '1 scene · newest 2026-10-14 · searches today 3 of 20',
  );
  assert.equal(
    readoutText({ message: null, answer: answer([]) }),
    '0 scenes · searches today 3 of 20',
  );
  assert.equal(
    readoutText({ message: null, answer: { ...THREE, truncated: true } }),
    '3 scenes · newest 2026-10-14 · UP42 results are partial · searches today 3 of 20',
  );
  assert.equal(
    readoutText({ message: null, answer: { ...THREE, used: null } }),
    '3 scenes · newest 2026-10-14',
  );
  assert.equal(
    readoutText({ message: null, answer: { ...THREE, limit: null } }),
    '3 scenes · newest 2026-10-14',
  );
  assert.equal(
    readoutText({
      message: null,
      answer: { ...answer([]), truncated: true, used: null, limit: null },
    }),
    '0 scenes · UP42 results are partial',
  );
});

test('[up42-scenes-layer-021] writes the date of the newest scene in UTC when the time zone of the machine is not UTC', (t) => {
  const before = process.env.TZ;
  t.after(() => {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  });
  process.env.TZ = 'America/New_York';
  const late = answer([scene('a', '2026-10-14T02:00:00.000Z')]);
  assert.equal(new Date(late.scenes[0].time).getDate(), 13);
  assert.equal(
    readoutText({ message: null, answer: late }),
    '1 scene · newest 2026-10-14 · searches today 3 of 20',
  );
});

test('[up42-scenes-layer-021] puts the message, the answer and the message of the thumbnail in that order', () => {
  assert.equal(
    readoutText({
      message: 'Too many searches. Wait 60 seconds.',
      answer: THREE,
      thumbMessage: 'Loading the thumbnail…',
    }),
    'Too many searches. Wait 60 seconds. · 3 scenes · newest 2026-10-14 · searches today 3 of 20 · Loading the thumbnail…',
  );
  assert.equal(
    readoutText({
      message: null,
      answer: THREE,
      thumbMessage: 'Loading the thumbnail…',
    }),
    '3 scenes · newest 2026-10-14 · searches today 3 of 20 · Loading the thumbnail…',
  );
  assert.equal(
    readoutText({ message: 'Failed.', answer: THREE, thumbMessage: null }),
    'Failed. · 3 scenes · newest 2026-10-14 · searches today 3 of 20',
  );
});

test('[up42-scenes-layer-022] gives null for no answer and for an answer with no scene', () => {
  assert.equal(sceneList({ answer: null, selectedId: null }), null);
  assert.equal(sceneList({ answer: answer([]), selectedId: null }), null);
});

test('[up42-scenes-layer-022] gives one item for each scene, in the order of the answer', () => {
  assert.deepEqual(sceneList({ answer: THREE, selectedId: 'b' }), {
    ariaLabel: 'UP42 scenes',
    items: [
      {
        id: 'scene:a',
        lead: '2026-10-12',
        text: 'a · Satellogic · 0.5 m · cloud 3%',
        active: false,
        params: { scene: 'a' },
      },
      {
        id: 'scene:b',
        lead: '2026-10-14',
        text: 'b · Planet · 3 m · cloud 12%',
        active: true,
        params: { scene: null },
      },
      {
        id: 'scene:c',
        lead: '2026-08-01',
        text: 'c · Airbus · 1 m · cloud 40%',
        active: false,
        params: { scene: 'c' },
      },
    ],
  });
  const none = sceneList({ answer: THREE, selectedId: null });
  assert.deepEqual(
    none.items.map(({ active, params }) => [active, params.scene]),
    [
      [false, 'a'],
      [false, 'b'],
      [false, 'c'],
    ],
  );
});

test('[up42-scenes-layer-022] writes the resolution and the cloud cover and omits null parts', () => {
  const textOf = (overrides) =>
    sceneList({
      answer: answer([scene('x', '2026-10-14T08:03:00.000Z', overrides)]),
      selectedId: null,
    }).items[0].text;
  assert.equal(textOf({ resolutionM: 3 }), 'x · Satellogic · 3 m · cloud 3%');
  assert.equal(
    textOf({ resolutionM: 0.123456 }),
    'x · Satellogic · 0.12 m · cloud 3%',
  );
  assert.equal(
    textOf({ resolutionM: 0.126 }),
    'x · Satellogic · 0.13 m · cloud 3%',
  );
  assert.equal(
    textOf({ cloudPercent: 3.6 }),
    'x · Satellogic · 0.5 m · cloud 4%',
  );
  assert.equal(
    textOf({ cloudPercent: 0 }),
    'x · Satellogic · 0.5 m · cloud 0%',
  );
  assert.equal(textOf({ provider: null }), 'x · 0.5 m · cloud 3%');
  assert.equal(textOf({ resolutionM: null }), 'x · Satellogic · cloud 3%');
  assert.equal(textOf({ cloudPercent: null }), 'x · Satellogic · 0.5 m');
  assert.equal(
    textOf({ thumbnail: false }),
    'x · Satellogic · 0.5 m · cloud 3% · no thumbnail',
  );
  assert.equal(
    textOf({ provider: null, resolutionM: null, cloudPercent: null }),
    'x',
  );
  assert.equal(
    textOf({
      provider: null,
      resolutionM: null,
      cloudPercent: null,
      thumbnail: false,
    }),
    'x · no thumbnail',
  );
});

test('[up42-scenes-layer-022] writes the UTC date as the lead when the time zone of the machine is not UTC', (t) => {
  const before = process.env.TZ;
  t.after(() => {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  });
  process.env.TZ = 'America/New_York';
  const list = sceneList({
    answer: answer([scene('a', '2026-10-14T02:00:00.000Z')]),
    selectedId: null,
  });
  assert.equal(list.items[0].lead, '2026-10-14');
});

test('[up42-scenes-layer-023] fits the image in a square of 192 pixels and keeps its ratio', () => {
  assert.deepEqual(thumbnailSize(256, 256), { width: 192, height: 192 });
  assert.deepEqual(thumbnailSize(512, 256), { width: 192, height: 96 });
  assert.deepEqual(thumbnailSize(100, 400), { width: 48, height: 192 });
  assert.deepEqual(thumbnailSize(96, 48), { width: 192, height: 96 });
  assert.deepEqual(thumbnailSize(1000, 1), { width: 192, height: 1 });
  assert.deepEqual(thumbnailSize(1, 1000), { width: 1, height: 192 });
  assert.deepEqual(thumbnailSize(100, 100), { width: 192, height: 192 });
  assert.deepEqual(thumbnailSize(300, 200), { width: 192, height: 128 });
  assert.deepEqual(thumbnailSize(700, 400), { width: 192, height: 110 });
  for (const [width, height] of [
    [0, 100],
    [100, 0],
    [-1, 100],
    [NaN, 100],
    [100, Infinity],
    ['100', 100],
    [undefined, 100],
  ])
    assert.equal(thumbnailSize(width, height), null, `${width} ${height}`);
});

test('[up42-scenes-layer-023] gives the mean position of a ring without its last position', () => {
  assert.deepEqual(
    footprintCentre([
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [0, 0],
    ]),
    { lon: 1, lat: 1 },
  );
  assert.deepEqual(
    footprintCentre([
      [10, 60],
      [13, 60],
      [10, 63],
      [10, 60],
    ]),
    { lon: 11, lat: 61 },
  );
});

test('[up42-scenes-layer-039] gives one partial note for either route flag', () => {
  for (const extra of [
    { partial: true },
    { truncated: true },
    { partial: true, truncated: true },
  ]) {
    assert.equal(
      readoutText({ message: null, answer: answer([], extra) }),
      '0 scenes · UP42 results are partial · searches today 3 of 20',
    );
  }
});
test('[up42-scenes-layer-038] lists each id and collection with distinct scene values', () => {
  const list = sceneList({
    answer: answer([
      scene('scene.1', '2026-10-14', {
        collection: 'optical',
        provider: 'Airbus',
        resolutionM: 1,
        cloudPercent: 12,
      }),
      scene('scene.2', '2026-10-12', {
        collection: 'radar',
        provider: 'Capella',
        resolutionM: 3,
        cloudPercent: null,
        thumbnail: false,
      }),
    ]),
    selectedId: 'scene.2',
  });
  assert.deepEqual(list.items, [
    {
      id: 'scene:scene.1',
      lead: '2026-10-14',
      text: 'scene.1 · optical · Airbus · 1 m · cloud 12%',
      active: false,
      params: { scene: 'scene.1' },
    },
    {
      id: 'scene:scene.2',
      lead: '2026-10-12',
      text: 'scene.2 · radar · Capella · 3 m · no thumbnail',
      active: true,
      params: { scene: null },
    },
  ]);
});
