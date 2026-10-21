import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  boxAreaKm2,
  readBodyText,
  validateRequest,
} from '../../server/providers/skywatch/validate.js';

const NOW = Date.UTC(2026, 9, 21, 12, 0, 0);
const BOX = [10, 60, 10.02, 60.01];
const DATES = { start: '2026-10-01', end: '2026-10-20' };
const send = (body, now = NOW) => validateRequest(JSON.stringify(body), now);
const good = (extra = {}) => send({ bbox: BOX, ...DATES, ...extra });
const refused = (result, error, extra = {}) => {
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.deepEqual(result.payload, { error, ...extra });
};
const stream = (...chunks) => Readable.from(chunks.map((c) => Buffer.from(c)));

test('[skywatch-source-005] reads a body of exactly 4096 bytes and refuses a body of 4097 bytes', async () => {
  const head = JSON.stringify({ bbox: BOX, ...DATES });
  const exact = head.slice(0, -1) + ' '.repeat(4096 - head.length) + '}';
  assert.equal(Buffer.byteLength(exact), 4096);
  const text = await readBodyText(stream(exact));
  assert.equal(text, exact);
  assert.equal(validateRequest(text, NOW).ok, true);
  assert.equal(await readBodyText(stream(exact + ' ')), null);
});

test('[skywatch-source-005] counts bytes and not characters, and counts all chunks', async () => {
  const twoBytes = 'é'.repeat(2048);
  assert.equal(Buffer.byteLength(twoBytes), 4096);
  assert.equal(await readBodyText(stream(twoBytes)), twoBytes);
  assert.equal(await readBodyText(stream(twoBytes + 'é')), null);
  const half = 'a'.repeat(2048);
  assert.equal(await readBodyText(stream(half, half)), half + half);
  assert.equal(await readBodyText(stream(half, half, 'a')), null);
  assert.equal(await readBodyText(stream()), '');
});

test('[skywatch-source-005] gives null when the request body fails while it is read', async () => {
  const failing = Readable.from(
    (async function* () {
      yield Buffer.from('{"bbox":');
      throw new Error('aborted');
    })(),
  );
  assert.equal(await readBodyText(failing), null);
});

test('[skywatch-source-005] refuses a body that is not JSON, not an object or has another field', () => {
  for (const text of [
    '',
    'not json',
    '{"bbox":',
    'null',
    '[]',
    '5',
    '"text"',
    'true',
    '[{"bbox":[10,60,10.02,60.01]}]',
  ])
    refused(validateRequest(text, NOW), 'bad_body');
  refused(good({ limit: 5 }), 'bad_body');
  refused(good({ polygon: {} }), 'bad_body');
  refused(
    send({ bbox: BOX, start: DATES.start, end: DATES.end, extra: null }),
    'bad_body',
  );
});

test('[skywatch-source-006] accepts a box of four finite numbers in the order west, south, east and north', () => {
  const result = good();
  assert.equal(result.ok, true);
  assert.deepEqual(result.bbox, BOX);
  assert.equal(result.start, '2026-10-01');
  assert.equal(result.end, '2026-10-20');
  assert.equal(send({ bbox: [-180, -90, -179.99, -89.99], ...DATES }).ok, true);
  assert.equal(send({ bbox: [179.99, 89.99, 180, 90], ...DATES }).ok, true);
});

test('[skywatch-source-006] refuses each other value of bbox, and a body without bbox', () => {
  for (const bbox of [
    undefined,
    null,
    'box',
    {},
    [],
    [10, 60, 10.02],
    [10, 60, 10.02, 60.01, 5],
    [10, 60, 10.02, '60.01'],
    [10, 60, 10.02, null],
    [10, 60, Infinity, 60.01],
    [10, 60, NaN, 60.01],
    [10.02, 60, 10, 60.01],
    [10, 60, 10, 60.01],
    [10, 60.01, 10.02, 60],
    [10, 60, 10.02, 60],
    [-180.01, 60, -179.99, 60.01],
    [179.99, 60, 180.01, 60.01],
    [10, -90.01, 10.02, -89.99],
    [10, 89.99, 10.02, 90.01],
  ]) {
    const body = bbox === undefined ? { ...DATES } : { bbox, ...DATES };
    refused(send(body), 'bad_bbox');
  }
});

test('[skywatch-source-007] refuses a box of more than 2500 km² and accepts a box of 2500 km² or less', () => {
  assert.ok(Math.abs(boxAreaKm2([0, 0, 0.4497, 0.4497]) - 2500.417) < 0.01);
  assert.ok(Math.abs(boxAreaKm2([0, 0, 0.4496, 0.4496]) - 2499.305) < 0.01);
  refused(send({ bbox: [0, 0, 0.4497, 0.4497], ...DATES }), 'area_too_large', {
    maxKm2: 2500,
  });
  assert.equal(send({ bbox: [0, 0, 0.4496, 0.4496], ...DATES }).ok, true);
  refused(send({ bbox: [-1, -1, 1, 1], ...DATES }), 'area_too_large', {
    maxKm2: 2500,
  });
});

test('[skywatch-source-007] uses a sphere with a radius of 6371008.8 m for the area', () => {
  // A box of 1 degree by 1 degree at the equator: R² · Δλ · (sin φ2 − sin φ1).
  const radius = 6371008.8;
  const expected =
    (radius * radius * (Math.PI / 180) * Math.sin(Math.PI / 180)) / 1e6;
  assert.ok(Math.abs(boxAreaKm2([0, 0, 1, 1]) - expected) < 1e-6);
  assert.ok(Math.abs(boxAreaKm2([0, 0, 1, 1]) - 12363.718) < 0.01);
});

test('[skywatch-source-008] accepts a window of 92 calendar days and refuses a window of 93', () => {
  assert.equal(good({ start: '2026-01-01', end: '2026-04-02' }).ok, true);
  refused(good({ start: '2026-01-01', end: '2026-04-03' }), 'bad_dates');
  assert.equal(good({ start: '2026-10-20', end: '2026-10-20' }).ok, true);
});

test('[skywatch-source-008] accepts an end on the UTC date of the server clock, and refuses the next day', () => {
  assert.equal(good({ start: '2026-10-21', end: '2026-10-21' }).ok, true);
  refused(good({ start: '2026-10-21', end: '2026-10-22' }), 'bad_dates');
  const justBeforeMidnight = Date.UTC(2026, 9, 21, 23, 59, 59, 999);
  assert.equal(
    send(
      { bbox: BOX, start: '2026-10-21', end: '2026-10-21' },
      justBeforeMidnight,
    ).ok,
    true,
  );
  const midnight = Date.UTC(2026, 9, 22, 0, 0, 0);
  assert.equal(
    send({ bbox: BOX, start: '2026-10-22', end: '2026-10-22' }, midnight).ok,
    true,
  );
});

test('[skywatch-source-008] refuses a start after the end, a missing date and each other form', () => {
  refused(good({ start: '2026-10-20', end: '2026-10-19' }), 'bad_dates');
  refused(send({ bbox: BOX, start: '2026-10-01' }), 'bad_dates');
  refused(send({ bbox: BOX, end: '2026-10-01' }), 'bad_dates');
  for (const value of [
    '2026-02-30',
    '2026-13-01',
    '2026-00-10',
    '2026-10-00',
    '2026-10-32',
    '2026-1-01',
    '26-10-01',
    '2026/10/01',
    '2026-10-01T00:00:00Z',
    ' 2026-10-01',
    '2026-10-01 ',
    '',
    null,
    20261001,
    ['2026-10-01'],
  ]) {
    refused(good({ start: value }), 'bad_dates');
    refused(good({ end: value }), 'bad_dates');
  }
  assert.equal(good({ start: '2024-02-29', end: '2024-02-29' }).ok, true);
});

test('[skywatch-source-018] checks the body, the box, the area and then the dates', () => {
  refused(
    validateRequest('{"bbox":[0,0,5,5],"start":"x","other":1}', NOW),
    'bad_body',
  );
  refused(send({ bbox: 'box', start: 'x', end: 'y' }), 'bad_bbox');
  refused(
    send({ bbox: [0, 0, 5, 5], start: 'x', end: 'y' }),
    'area_too_large',
    {
      maxKm2: 2500,
    },
  );
  refused(send({ bbox: BOX, start: 'x', end: 'y' }), 'bad_dates');
});
