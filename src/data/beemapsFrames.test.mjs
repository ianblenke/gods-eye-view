import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeDocument,
  readCredits,
} from '../../server/providers/beemaps/normalize.js';

/** An item in the documented shape, with made-up values. */
function item(overrides = {}) {
  return {
    url: 'https://cdn.example.invalid/image?signed=CANARY-url',
    timestamp: '2026-10-01T12:00:00Z',
    sequence: 'CANARY-sequence',
    idx: 7,
    device: 'CANARY-device',
    position: {
      lat: 10.5,
      lon: 20.25,
      lat_ref: 'n',
      lon_ref: 'e',
      gdop: 0.5,
      hdop: 0.5,
      pdop: 0.5,
      eph: 0.5,
      cno: 0.5,
    },
    width: 2028,
    height: 1024,
    imu: { acc_x: 1, acc_y: 2, acc_z: 3, gyro_x: 4, gyro_y: 5, gyro_z: 6 },
    ...overrides,
  };
}
const at = (timestamp, lat, lon) => item({ timestamp, position: { lat, lon } });
const normalize = (frames, since = null) =>
  normalizeDocument({ frames }, since);
const A = {
  id: 'e79cd5d7c1102b08',
  lat: 10.5,
  lon: 20.25,
  timestamp: '2026-10-01T12:00:00.000Z',
};
const B = {
  id: '48a9c09fd2c26081',
  lat: 10.5,
  lon: 20.250001,
  timestamp: '2026-10-01T12:00:00.000Z',
};

test('[beemaps-source-025] keeps the fields id, lat, lon and timestamp and gives the literal id of a frame', () => {
  const result = normalize([item()]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.frames, [A]);
  assert.deepEqual(Object.keys(result.frames[0]), [
    'id',
    'lat',
    'lon',
    'timestamp',
  ]);
});

test('[beemaps-source-025] drops the url, device, sensor and size fields from the answer', () => {
  const text = JSON.stringify(normalize([item()]));
  for (const canary of [
    'http',
    'CANARY',
    'imu',
    'acc_x',
    'gdop',
    'lat_ref',
    'width',
    'height',
    'sequence',
    'idx',
  ])
    assert.equal(text.includes(canary), false, canary);
});

test('[beemaps-source-025] rounds lat and lon to 6 decimals before it makes the id', () => {
  const frame = normalize([
    at('2026-10-02T08:30:15.123Z', 10.123456789, -20.987654321),
  ]).frames[0];
  assert.deepEqual(frame, {
    id: 'c151d5feb8186c8b',
    lat: 10.123457,
    lon: -20.987654,
    timestamp: '2026-10-02T08:30:15.123Z',
  });
  assert.deepEqual(
    normalize([at('2026-10-01T12:00:00Z', 10.5, 20.250001)]).frames,
    [B],
  );
});

test('[beemaps-source-025] writes the time with toISOString and reads other forms of a time text', () => {
  const frames = normalize([
    at('2026-10-01T12:00:00Z', 1, 2),
    at('2026-10-02T00:00:00.000Z', 1, 2),
  ]).frames;
  assert.deepEqual(
    frames.map((frame) => [frame.timestamp, frame.id]),
    [
      ['2026-10-02T00:00:00.000Z', 'c1e705a004cfd2d9'],
      [
        '2026-10-01T12:00:00.000Z',
        normalize([at('2026-10-01T12:00:00Z', 1, 2)]).frames[0].id,
      ],
    ],
  );
});

test('[beemaps-source-025] drops an item whose timestamp is not a text of the form YYYY-MM-DDTHH:MM:SS with Z or an offset', () => {
  for (const timestamp of [
    2026,
    1788264000000,
    null,
    undefined,
    true,
    {},
    [],
    ['2026-10-01T12:00:00Z'],
    'garbage',
    '',
    '5',
    '2026',
    '2026-10-01',
    '2026-10-01T12:00:00',
    '2026-10-01T12:00',
    '2026-10-01 12:00:00Z',
    '2026-10-01t12:00:00z',
    '2026-10-01T12:00:00+0200',
    'Oct 1 2026 12:00:00 GMT',
  ]) {
    const other = { lat: 3, lon: 4 };
    const result = normalize([item({ timestamp, position: other }), item()]);
    assert.deepEqual(result.frames, [A], String(timestamp));
  }
  const missing = item({ position: { lat: 3, lon: 4 } });
  delete missing.timestamp;
  assert.deepEqual(normalize([missing, item()]).frames, [A]);
});

test('[beemaps-source-025] drops an item whose timestamp Date.parse does not read as a date', () => {
  for (const timestamp of [
    '2026-13-45T00:00:00Z',
    '2026-10-01T12:00:60Z',
    '2026-10-01T25:00:00Z',
  ])
    assert.deepEqual(
      normalize([item({ timestamp }), item()]).frames,
      [A],
      timestamp,
    );
});

test('[beemaps-source-025] reads an offset and a fraction and writes the time with toISOString', () => {
  const frames = normalize([
    at('2026-10-01T12:00:00+02:00', 1, 2),
    at('2026-10-01T12:00:00.123456Z', 3, 4),
    at('2026-10-01T12:00:00-05:30', 5, 6),
  ]).frames;
  assert.deepEqual(
    frames.map((frame) => [frame.lat, frame.timestamp]),
    [
      [5, '2026-10-01T17:30:00.000Z'],
      [3, '2026-10-01T12:00:00.123Z'],
      [1, '2026-10-01T10:00:00.000Z'],
    ],
  );
});

test('[beemaps-source-025] drops an item whose lat is not a finite number from -90 to 90', () => {
  for (const lat of [
    90.0000001,
    -90.0000001,
    '10.5',
    null,
    undefined,
    NaN,
    Infinity,
    {},
  ]) {
    const result = normalize([item({ position: { lat, lon: 20.25 } }), item()]);
    assert.deepEqual(result.frames, [A], String(lat));
  }
  assert.equal(normalize([at('2026-10-01T12:00:00Z', 90, 0)]).frames.length, 1);
  assert.equal(
    normalize([at('2026-10-01T12:00:00Z', -90, 0)]).frames.length,
    1,
  );
});

test('[beemaps-source-025] drops an item whose lon is not a finite number from -180 to 180', () => {
  for (const lon of [
    180.0000001,
    -180.0000001,
    '20.25',
    null,
    undefined,
    NaN,
    Infinity,
    {},
  ]) {
    const result = normalize([item({ position: { lat: 10.5, lon } }), item()]);
    assert.deepEqual(result.frames, [A], String(lon));
  }
  assert.equal(
    normalize([at('2026-10-01T12:00:00Z', 0, 180)]).frames.length,
    1,
  );
  assert.equal(
    normalize([at('2026-10-01T12:00:00Z', 0, -180)]).frames.length,
    1,
  );
});

test('[beemaps-source-025] drops an item with no position', () => {
  for (const position of [undefined, null, 'x', 5, [], {}]) {
    const result = normalize([item({ position }), item()]);
    assert.deepEqual(result.frames, [A]);
  }
});

test('[beemaps-source-026] drops a frame before 00:00:00 UTC of since and keeps one at that time', () => {
  const frames = [
    at('2026-09-30T23:59:59.999Z', 1, 2),
    at('2026-10-01T00:00:00.000Z', 1, 2),
    at('2026-10-01T00:00:00.001Z', 3, 4),
  ];
  const cut = normalize(frames, '2026-10-01').frames;
  assert.deepEqual(
    cut.map((frame) => frame.timestamp),
    ['2026-10-01T00:00:00.001Z', '2026-10-01T00:00:00.000Z'],
  );
  assert.equal(cut[1].id, 'a7bcc26bd6d9e8a7');
  assert.equal(normalize(frames, null).frames.length, 3);
  assert.equal(normalize(frames, '2026-09-30').frames.length, 3);
  assert.equal(normalize(frames, '2026-10-02').frames.length, 0);
});

test('[beemaps-source-026] orders the newest first and the smaller id first for equal times', () => {
  const one = at('2026-10-01T12:00:00Z', 10.5, 20.25);
  const two = at('2026-10-01T12:00:00Z', 10.5, 20.250001);
  const newer = at('2026-10-03T00:00:00Z', 1, 2);
  const older = at('2026-09-01T00:00:00Z', 1, 2);
  const forward = normalize([older, one, two, newer]).frames;
  const reverse = normalize([newer, two, one, older]).frames;
  assert.deepEqual(forward, reverse);
  assert.deepEqual(
    forward.map((frame) => frame.id),
    [forward[0].id, B.id, A.id, forward[3].id],
  );
  assert.equal(forward[0].timestamp, '2026-10-03T00:00:00.000Z');
  assert.equal(forward[3].timestamp, '2026-09-01T00:00:00.000Z');
});

test('[beemaps-source-026] drops a frame with an id that an earlier frame already has', () => {
  const result = normalize([
    item(),
    item({ idx: 8 }),
    item(),
    at('2026-10-01T12:00:00.000Z', 10.5, 20.250001),
  ]);
  assert.deepEqual(result.frames, [B, A]);
});

test('[beemaps-source-027] refuses a document that is not an object or whose frames is not a list', () => {
  for (const document of [null, undefined, [], 'x', 5, true])
    assert.deepEqual(
      normalizeDocument(document, null),
      { ok: false },
      String(document),
    );
  for (const frames of [
    undefined,
    null,
    {},
    'x',
    5,
    true,
    { length: 1, 0: item() },
  ])
    assert.deepEqual(normalizeDocument({ frames }, null), { ok: false });
  assert.equal(normalizeDocument({ frames: [] }, null).ok, true);
});

test('[beemaps-source-027] reads the first 5000 items and reports more items', () => {
  const make = (count) =>
    Array.from({ length: count }, (_, i) =>
      at('2026-10-01T12:00:00Z', 1 + i / 100000, 2),
    );
  const exact = normalize(make(5000));
  assert.equal(exact.frames.length, 5000);
  assert.equal(exact.overflow, false);
  const over = normalize(make(5001));
  assert.equal(over.frames.length, 5000);
  assert.equal(over.overflow, true);
  const late = make(5000);
  late.push(at('2026-12-31T00:00:00Z', 50, 50));
  assert.equal(
    normalize(late).frames.some((frame) => frame.lat === 50),
    false,
  );
});

test('[beemaps-source-027] drops an item of the list that is not an object', () => {
  const result = normalize([null, 5, 'x', [], true, undefined, item()]);
  assert.deepEqual(result.frames, [A]);
});

test('[beemaps-source-028] reads the credits as numbers of 0 or more and null in all other cases', () => {
  assert.deepEqual(
    readCredits({ creditsUsed: 3, creditsRemaining: 997, cost: 0.5 }),
    { used: 3, remaining: 997, cost: 0.5 },
  );
  assert.deepEqual(
    readCredits({ creditsUsed: 0, creditsRemaining: 0, cost: 0 }),
    {
      used: 0,
      remaining: 0,
      cost: 0,
    },
  );
  for (const value of [-1, '3', null, undefined, NaN, Infinity, {}, [], true]) {
    assert.deepEqual(
      readCredits({ creditsUsed: value, creditsRemaining: 5, cost: 1 }),
      { used: null, remaining: 5, cost: 1 },
      String(value),
    );
    assert.deepEqual(
      readCredits({ creditsUsed: 5, creditsRemaining: value, cost: 1 }),
      { used: 5, remaining: null, cost: 1 },
    );
    assert.deepEqual(
      readCredits({ creditsUsed: 5, creditsRemaining: 1, cost: value }),
      { used: 5, remaining: 1, cost: null },
    );
  }
  assert.deepEqual(readCredits({}), {
    used: null,
    remaining: null,
    cost: null,
  });
});

test('[beemaps-source-028] keeps the credits of the document in the result', () => {
  const result = normalizeDocument(
    { frames: [], creditsUsed: 3, creditsRemaining: 997, cost: 0.5 },
    null,
  );
  assert.deepEqual(result.credits, { used: 3, remaining: 997, cost: 0.5 });
  assert.deepEqual(normalize([]).credits, {
    used: null,
    remaining: null,
    cost: null,
  });
});
