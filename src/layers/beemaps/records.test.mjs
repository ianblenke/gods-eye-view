import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_FRAMES, normalizeAnswer } from './records.js';

const ID = 'e79cd5d7c1102b08';
const frame = (overrides = {}) => ({
  id: ID,
  lat: 10.5,
  lon: 20.25,
  timestamp: '2026-10-01T12:00:00.000Z',
  ...overrides,
});
const answer = (frames, extra = {}) => ({ frames, ...extra });
const hex = (n) => n.toString(16).padStart(16, '0');
const kept = (frames) => normalizeAnswer(answer(frames)).frames;

test('[beemaps-frames-014] keeps exactly the fields id, lat, lon, timestamp and time of a valid frame', () => {
  const result = normalizeAnswer(
    answer([frame({ url: 'CANARY-url', device: 'CANARY', extra: 1 })]),
  );
  assert.deepEqual(result.frames, [
    {
      id: ID,
      lat: 10.5,
      lon: 20.25,
      timestamp: '2026-10-01T12:00:00.000Z',
      time: Date.UTC(2026, 9, 1, 12, 0, 0),
    },
  ]);
  assert.deepEqual(Object.keys(result.frames[0]), [
    'id',
    'lat',
    'lon',
    'timestamp',
    'time',
  ]);
  assert.equal(JSON.stringify(result).includes('CANARY'), false);
});

test('[beemaps-frames-014] drops a frame whose id is not 16 lowercase hexadecimal characters', () => {
  for (const id of [
    'E79CD5D7C1102B08',
    'e79cd5d7c1102b0',
    'e79cd5d7c1102b088',
    'g79cd5d7c1102b08',
    ' e79cd5d7c1102b0',
    '',
    16,
    null,
    undefined,
    ['e79cd5d7c1102b08'],
  ])
    assert.deepEqual(kept([frame({ id })]), [], String(id));
  const missing = frame();
  delete missing.id;
  assert.deepEqual(kept([missing]), []);
});

test('[beemaps-frames-014] drops a frame whose lat is not a finite number from -90 to 90', () => {
  for (const lat of [
    90.0000001,
    -90.0000001,
    '10.5',
    null,
    undefined,
    NaN,
    Infinity,
    -Infinity,
    {},
    [10.5],
  ])
    assert.deepEqual(kept([frame({ lat })]), [], String(lat));
  assert.equal(kept([frame({ lat: 90 })]).length, 1);
  assert.equal(kept([frame({ lat: -90 })]).length, 1);
});

test('[beemaps-frames-014] drops a frame whose lon is not a finite number from -180 to 180', () => {
  for (const lon of [
    180.0000001,
    -180.0000001,
    '20.25',
    null,
    undefined,
    NaN,
    Infinity,
    -Infinity,
    {},
    [20.25],
  ])
    assert.deepEqual(kept([frame({ lon })]), [], String(lon));
  assert.equal(kept([frame({ lon: 180 })]).length, 1);
  assert.equal(kept([frame({ lon: -180 })]).length, 1);
});

test('[beemaps-frames-014] drops a frame whose timestamp does not have the form with seconds and Z', () => {
  for (const timestamp of [
    '2026-10-01T12:00:00+00:00',
    '2026-10-01T12:00:00+02:00',
    '2026-10-01T12:00:00',
    '2026-10-01T12:00Z',
    '2026-10-01',
    '2026-10-01 12:00:00Z',
    '2026-10-01t12:00:00z',
    '2026-10-01T12:00:00.Z',
    ' 2026-10-01T12:00:00Z',
    '',
    1790856000000,
    null,
    undefined,
    ['2026-10-01T12:00:00Z'],
  ])
    assert.deepEqual(kept([frame({ timestamp })]), [], String(timestamp));
  assert.equal(kept([frame({ timestamp: '2026-10-01T12:00:00Z' })]).length, 1);
  assert.equal(
    kept([frame({ timestamp: '2026-10-01T12:00:00.1234Z' })]).length,
    1,
  );
});

test('[beemaps-frames-014] drops a frame whose timestamp Date.parse does not read', () => {
  for (const timestamp of [
    '2026-13-45T00:00:00Z',
    '2026-10-01T25:00:00Z',
    '2026-10-01T12:00:60Z',
  ])
    assert.deepEqual(kept([frame({ timestamp })]), [], timestamp);
});

test('[beemaps-frames-014] drops an item that is not an object and a frame that repeats an id', () => {
  const result = kept([
    null,
    5,
    'x',
    [],
    true,
    undefined,
    frame({ id: hex(1), lat: 1 }),
    frame({ id: hex(1), lat: 2 }),
    frame({ id: hex(2), lat: 3 }),
  ]);
  assert.deepEqual(
    result.map((item) => [item.id, item.lat]),
    [
      [hex(1), 1],
      [hex(2), 3],
    ],
  );
});

test('[beemaps-frames-014] keeps at most the first 200 valid frames', () => {
  assert.equal(MAX_FRAMES, 200);
  const frames = [];
  for (let n = 0; n < 205; n++) {
    frames.push(frame({ id: hex(n + 1), lat: 1 }));
    if (n % 40 === 0) frames.push(frame({ id: 'bad', lat: 2 }));
  }
  const result = kept(frames);
  assert.equal(result.length, 200);
  assert.equal(result[0].id, hex(1));
  assert.equal(result[199].id, hex(200));
  const exact = Array.from({ length: 200 }, (_, n) =>
    frame({ id: hex(n + 1) }),
  );
  assert.equal(kept(exact).length, 200);
  assert.equal(kept([...exact, frame({ id: hex(999) })]).length, 200);
});

test('[beemaps-frames-014] reads used, limit and remaining as whole numbers of 0 or more and null in all other cases', () => {
  const read = (extra) => {
    const { used, limit, remaining } = normalizeAnswer(answer([], extra));
    return { used, limit, remaining };
  };
  assert.deepEqual(
    read({ budget: { used: 3, limit: 20 }, credits: { remaining: 998 } }),
    { used: 3, limit: 20, remaining: 998 },
  );
  assert.deepEqual(
    read({ budget: { used: 0, limit: 0 }, credits: { remaining: 0 } }),
    { used: 0, limit: 0, remaining: 0 },
  );
  for (const value of [
    -1,
    1.5,
    '3',
    null,
    undefined,
    NaN,
    Infinity,
    {},
    [],
    true,
  ]) {
    assert.deepEqual(
      read({ budget: { used: value, limit: 20 }, credits: { remaining: 5 } }),
      { used: null, limit: 20, remaining: 5 },
      String(value),
    );
    assert.deepEqual(
      read({ budget: { used: 3, limit: value }, credits: { remaining: 5 } }),
      { used: 3, limit: null, remaining: 5 },
    );
    assert.deepEqual(
      read({ budget: { used: 3, limit: 20 }, credits: { remaining: value } }),
      { used: 3, limit: 20, remaining: null },
    );
  }
  for (const extra of [
    {},
    { budget: null, credits: null },
    { budget: 5, credits: 'x' },
  ])
    assert.deepEqual(read(extra), { used: null, limit: null, remaining: null });
});

test('[beemaps-frames-015] gives null for an answer that is not an object or whose frames is not a list', () => {
  for (const payload of [
    null,
    undefined,
    [],
    'x',
    5,
    true,
    {},
    { frames: null },
    { frames: 'x' },
    { frames: {} },
    { frames: { length: 1, 0: frame() } },
  ])
    assert.equal(normalizeAnswer(payload), null);
  assert.deepEqual(normalizeAnswer({ frames: [] }), {
    frames: [],
    used: null,
    limit: null,
    remaining: null,
  });
});
