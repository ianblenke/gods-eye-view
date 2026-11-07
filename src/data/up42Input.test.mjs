import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  boxAreaKm2,
  readBodyText,
  validateRequest,
} from '../../server/providers/up42/validate.js';

const NOW = Date.UTC(2026, 10, 6, 12);
const good = (extra = {}) => ({
  box: [10, 60, 10.02, 60.01],
  start: '2026-10-01',
  end: '2026-10-20',
  ...extra,
});
const check = (body) => validateRequest(JSON.stringify(body), NOW);
const refuse = (body, error, extra = {}) =>
  assert.deepEqual(check(body), {
    ok: false,
    status: 400,
    payload: { error, ...extra },
  });

test('[up42-source-006] reads at most 4096 bytes and handles a broken stream', async () => {
  const text = JSON.stringify(good());
  const exact = text + ' '.repeat(4096 - text.length);
  assert.equal(await readBodyText(Readable.from([Buffer.from(exact)])), exact);
  assert.equal(check(JSON.parse(exact)).ok, true);
  assert.equal(
    await readBodyText(Readable.from([Buffer.from(exact), Buffer.from('x')])),
    null,
  );
  assert.equal(
    await readBodyText(Readable.from([Buffer.from('é'.repeat(2049))])),
    null,
  );
  assert.equal(await readBodyText(Readable.from([])), '');
  const broken = Readable.from(
    (async function* () {
      yield Buffer.from('x');
      throw new Error('test');
    })(),
  );
  assert.equal(await readBodyText(broken), null);
});

for (const [index, text] of [
  '',
  '{',
  'null',
  '[]',
  '1',
  'true',
  '"text"',
  '{"other":1}',
].entries()) {
  test(`[up42-source-006] refuses body case ${index}`, () => {
    assert.deepEqual(validateRequest(text, NOW), {
      ok: false,
      status: 400,
      payload: { error: 'bad_body' },
    });
  });
}

test('[up42-source-007] accepts the box limits and keeps its own values', () => {
  assert.deepEqual(check(good()), {
    ok: true,
    box: [10, 60, 10.02, 60.01],
    start: '2026-10-01',
    end: '2026-10-20',
  });
  for (const box of [
    [-180, -90, -179.99, -89.99],
    [179.99, 89.99, 180, 90],
  ])
    assert.equal(check(good({ box })).ok, true);
});
for (const [index, box] of [
  undefined,
  null,
  'box',
  {},
  [],
  [1, 2, 3],
  [1, 2, 3, 4, 5],
  [1, 2, '3', 4],
  [1, 2, null, 4],
  [2, 1, 2, 3],
  [3, 1, 2, 3],
  [1, 3, 2, 2],
  [1, 2, 2, 2],
  [-181, 0, -180, 1],
  [179, 0, 181, 1],
  [0, -91, 1, -90],
  [0, 89, 1, 91],
].entries()) {
  test(`[up42-source-007] refuses box case ${index}`, () =>
    refuse(good({ box }), 'bad_bbox'));
}

test('[up42-source-008] checks the area before the dates', () => {
  assert.ok(Math.abs(boxAreaKm2([0, 0, 1, 1]) - 12363.718) < 0.01);
  assert.equal(check(good({ box: [0, 0, 0.4496, 0.4496] })).ok, true);
  refuse(good({ box: [0, 0, 0.4497, 0.4497], start: 'x' }), 'area_too_large', {
    maxKm2: 2500,
  });
});

test('[up42-source-009] accepts 92 days and the current UTC date', () => {
  assert.equal(
    check(good({ start: '2026-01-01', end: '2026-04-02' })).ok,
    true,
  );
  refuse(good({ start: '2026-01-01', end: '2026-04-03' }), 'bad_dates');
  assert.equal(
    check(good({ start: '2026-11-06', end: '2026-11-06' })).ok,
    true,
  );
  refuse(good({ end: '2026-11-07' }), 'bad_dates');
  refuse(good({ start: '2026-10-21' }), 'bad_dates');
  assert.equal(
    check(good({ start: '2024-02-29', end: '2024-02-29' })).ok,
    true,
  );
});
for (const [index, value] of [
  undefined,
  null,
  20261001,
  '2026-02-30',
  '2026-13-01',
  '2026-00-01',
  '2026-10-00',
  '2026-10-32',
  '2026-1-01',
  '2026-10-01T00:00:00Z',
  ' 2026-10-01',
  '',
].entries()) {
  test(`[up42-source-009] refuses date case ${index}`, () => {
    refuse(good({ start: value }), 'bad_dates');
    refuse(good({ end: value }), 'bad_dates');
  });
}

test('[up42-source-010] keeps the optional values and their absence', () => {
  assert.deepEqual(
    check(good({ maxCloud: 37, collections: ['pneo', 'phr'] })),
    {
      ok: true,
      box: [10, 60, 10.02, 60.01],
      start: '2026-10-01',
      end: '2026-10-20',
      maxCloud: 37,
      collections: ['pneo', 'phr'],
    },
  );
  assert.equal(Object.hasOwn(check(good()), 'maxCloud'), false);
  assert.equal(Object.hasOwn(check(good()), 'collections'), false);
  for (const maxCloud of [0, 100])
    assert.equal(check(good({ maxCloud })).maxCloud, maxCloud);
});
for (const [index, extra] of [
  { maxCloud: -1 },
  { maxCloud: 101 },
  { maxCloud: 0.5 },
  { maxCloud: '5' },
  { maxCloud: null },
  { collections: [] },
  { collections: 'pneo' },
  { collections: [null] },
  { collections: [''] },
  { collections: ['pneo', 'pneo'] },
  { collections: [' pneo'] },
  { collections: ['x'.repeat(129)] },
].entries()) {
  test(`[up42-source-010] refuses option case ${index}`, () =>
    refuse(good(extra), 'bad_options'));
}

test('[up42-source-009] refuses a date with a final line break', () => {
  refuse(good({ start: '2026-10-01\n' }), 'bad_dates');
  refuse(good({ end: '2026-10-20\n' }), 'bad_dates');
});

test('[up42-source-027] discards bytes through 65536 and stops above that size', async () => {
  const exact = Readable.from([Buffer.alloc(4096), Buffer.alloc(61440)]);
  assert.equal(await readBodyText(exact), null);
  assert.equal(exact.readableEnded, true);
  const reads = [];
  const excess = (async function* () {
    reads.push(65536);
    yield Buffer.alloc(65536);
    reads.push(1);
    yield Buffer.alloc(1);
    reads.push('unwanted');
    yield Buffer.alloc(1);
  })();
  assert.equal(await readBodyText(excess), null);
  assert.deepEqual(reads, [65536, 1]);
});
