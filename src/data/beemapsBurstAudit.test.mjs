import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fsp } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createAudit } from '../../server/providers/beemaps-burst/audit.js';

const T0 = Date.UTC(2026, 9, 15, 12, 0, 0);
const BOX = [9.982014, 59.991007, 10.017986, 60.008993];
const FIELDS = [
  'time',
  'requestId',
  'outcome',
  'reason',
  'client',
  'bbox',
  'areaKm2',
  'credits',
  'quoteId',
  'idempotencyKey',
  'upstreamStatus',
  'burstId',
  'durationMs',
];
const EVENT = {
  requestId: '3f1c1e0e-5b1a-4d7e-9a53-0f4c8f0a6b11',
  outcome: 'created',
  reason: null,
  client: '127.0.0.1',
  bbox: BOX,
  areaKm2: 4,
  credits: 125,
  quoteId: 'a'.repeat(32),
  idempotencyKey: 'k'.repeat(16),
  upstreamStatus: 200,
  burstId: 'b1b1b1',
  durationMs: 12,
};

function capture() {
  const lines = [];
  const log = createAudit({
    now: () => T0,
    append: async (line) => {
      lines.push(line);
    },
  });
  return { lines, log, parsed: () => lines.map((line) => JSON.parse(line)) };
}

async function tempRoot(t) {
  const root = await fsp.mkdtemp(path.join(os.tmpdir(), 'gev-burst-audit-'));
  t.after(() => fsp.rm(root, { recursive: true, force: true }));
  return root;
}

test('[beemaps-burst-control-031] writes one JSON line with exactly the 13 fields, the time as an ISO text and the values of the event', async () => {
  const { lines, log, parsed } = capture();
  await log(EVENT);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].endsWith('\n'), true);
  assert.equal(lines[0].split('\n').length, 2);
  assert.deepEqual(Object.keys(parsed()[0]), FIELDS);
  assert.deepEqual(parsed()[0], { time: '2026-10-15T12:00:00.000Z', ...EVENT });
});

test('[beemaps-burst-control-031] writes the reasons of the list as they are and any other reason as null', async () => {
  const { log, parsed } = capture();
  const reasons = [
    'cross_origin',
    'burst_off',
    'no_key',
    'bad_body',
    'busy',
    'key_reused',
    'outcome_unknown',
    'key_rejected',
    'no_credit',
    'upstream_rate_limit',
    'bad_request',
    'budget_used',
    'budget_unavailable',
    'quote_expired',
    'ledger_unavailable',
    'log_failed',
  ];
  for (const reason of [
    ...reasons,
    'other',
    'rate_limited',
    '',
    null,
    undefined,
    5,
    'CROSS_ORIGIN',
  ])
    await log({ ...EVENT, outcome: 'blocked', reason });
  assert.deepEqual(
    parsed().map((line) => line.reason),
    [...reasons, null, null, null, null, null, null, null],
  );
});

test('[beemaps-burst-control-031] writes the outcomes accepted, created, refused, unknown and blocked and any other outcome as null', async () => {
  const { log, parsed } = capture();
  for (const outcome of [
    'accepted',
    'created',
    'refused',
    'unknown',
    'blocked',
    'failed',
    'sent',
    undefined,
  ])
    await log({ ...EVENT, outcome });
  assert.deepEqual(
    parsed().map((line) => line.outcome),
    ['accepted', 'created', 'refused', 'unknown', 'blocked', null, null, null],
  );
});

test('[beemaps-burst-control-031] writes a field that has the wrong shape as null and writes no other field', async () => {
  const { log, parsed } = capture();
  await log({
    outcome: 'accepted',
    requestId: 5,
    client: 'x'.repeat(65),
    bbox: [1, 2, 3],
    areaKm2: 'big',
    credits: 125.5,
    quoteId: 'A'.repeat(32),
    idempotencyKey: 'too short',
    upstreamStatus: '200',
    burstId: 'has space',
    durationMs: NaN,
    apiKey: 'CANARY-key',
    body: { secret: 'CANARY-body' },
    text: 'CANARY-text',
  });
  const [line] = parsed();
  assert.deepEqual(Object.keys(line), FIELDS);
  assert.deepEqual(Object.values(line).slice(2), [
    'accepted',
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  assert.equal(JSON.stringify(line).includes('CANARY'), false);
  const { log: again, parsed: more } = capture();
  await again({
    ...EVENT,
    bbox: [1, 2, 3, NaN],
    burstId: 'x'.repeat(65),
    client: 'x'.repeat(64),
    idempotencyKey: 'k'.repeat(64),
  });
  assert.equal(more()[0].bbox, null);
  assert.equal(more()[0].burstId, null);
  assert.equal(more()[0].client, 'x'.repeat(64));
  assert.equal(more()[0].idempotencyKey, 'k'.repeat(64));
});

test('[beemaps-burst-control-030] writes the lines one after the other in the order of the calls', async () => {
  const order = [];
  let running = 0;
  let overlap = 0;
  const log = createAudit({
    now: () => T0,
    append: async (line) => {
      running += 1;
      overlap = Math.max(overlap, running);
      await new Promise((resolve) =>
        setTimeout(resolve, JSON.parse(line).credits === 1 ? 20 : 1),
      );
      order.push(JSON.parse(line).credits);
      running -= 1;
    },
  });
  await Promise.all([
    log({ ...EVENT, credits: 1 }),
    log({ ...EVENT, credits: 2 }),
    log({ ...EVENT, credits: 3 }),
  ]);
  assert.deepEqual(order, [1, 2, 3]);
  assert.equal(overlap, 1);
});

test('[beemaps-burst-control-030] rejects when the write fails and still writes the next line', async () => {
  const lines = [];
  let fail = true;
  const log = createAudit({
    now: () => T0,
    append: async (line) => {
      if (fail) throw new Error('disk full');
      lines.push(line);
    },
  });
  await assert.rejects(log(EVENT), /disk full/);
  fail = false;
  await log(EVENT);
  assert.equal(lines.length, 1);
});

test('[beemaps-burst-control-031] writes to beemaps-bursts.jsonl in the folder .gev-logs of the source root and creates the folder', async (t) => {
  const root = await tempRoot(t);
  const log = createAudit({ sourceRoot: root, now: () => T0 });
  await log(EVENT);
  await log({ ...EVENT, outcome: 'accepted' });
  const text = await fsp.readFile(
    path.join(root, '.gev-logs', 'beemaps-bursts.jsonl'),
    'utf8',
  );
  assert.deepEqual(
    text
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line).outcome),
    ['created', 'accepted'],
  );
});

test('[beemaps-burst-control-031] renames the file to a file with the suffix .1 when a line would make it larger than 4 MiB', async (t) => {
  const root = await tempRoot(t);
  const dir = path.join(root, '.gev-logs');
  const file = path.join(dir, 'beemaps-bursts.jsonl');
  await fsp.mkdir(dir, { recursive: true });
  const line = `${JSON.stringify({ time: '2026-10-15T12:00:00.000Z', ...EVENT })}\n`;
  const size = Buffer.byteLength(line);
  const limit = 4 * 1024 * 1024;
  await fsp.writeFile(file, 'x'.repeat(limit - size));
  const log = createAudit({ sourceRoot: root, now: () => T0 });
  await log(EVENT);
  assert.equal((await fsp.stat(file)).size, limit);
  await assert.rejects(fsp.stat(`${file}.1`));
  await log(EVENT);
  assert.equal((await fsp.stat(file)).size, size);
  assert.equal((await fsp.stat(`${file}.1`)).size, limit);
  await fsp.writeFile(file, 'y'.repeat(limit - 1));
  await log(EVENT);
  assert.equal((await fsp.stat(`${file}.1`)).size, limit - 1);
  assert.equal((await fsp.stat(file)).size, size);
});

test('[beemaps-burst-control-031] rotates when the line would make the file one byte larger than 4 MiB', async (t) => {
  const root = await tempRoot(t);
  const dir = path.join(root, '.gev-logs');
  const file = path.join(dir, 'beemaps-bursts.jsonl');
  await fsp.mkdir(dir, { recursive: true });
  const line = `${JSON.stringify({ time: '2026-10-15T12:00:00.000Z', ...EVENT })}\n`;
  const size = Buffer.byteLength(line);
  const limit = 4 * 1024 * 1024;
  await fsp.writeFile(file, 'x'.repeat(limit - size + 1));
  await createAudit({ sourceRoot: root, now: () => T0 })(EVENT);
  assert.equal((await fsp.stat(`${file}.1`)).size, limit - size + 1);
  assert.equal((await fsp.stat(file)).size, size);
});

test('[beemaps-burst-control-031] counts the bytes of a line and not its characters for the limit of 4 MiB', async (t) => {
  const root = await tempRoot(t);
  const dir = path.join(root, '.gev-logs');
  const file = path.join(dir, 'beemaps-bursts.jsonl');
  await fsp.mkdir(dir, { recursive: true });
  const event = { ...EVENT, client: '\u00e9'.repeat(64) };
  const line = `${JSON.stringify({ time: '2026-10-15T12:00:00.000Z', ...event })}\n`;
  const bytes = Buffer.byteLength(line);
  assert.equal(bytes - line.length >= 64, true);
  const limit = 4 * 1024 * 1024;
  await fsp.writeFile(file, 'x'.repeat(limit - bytes + 1));
  await createAudit({ sourceRoot: root, now: () => T0 })(event);
  assert.equal((await fsp.stat(`${file}.1`)).size, limit - bytes + 1);
  assert.equal((await fsp.stat(file)).size, bytes);
});

test('[beemaps-burst-control-031] keeps a value of the right shape at its limits and writes null just beyond them', async () => {
  const written = async (name, value) => {
    const { log, parsed } = capture();
    await log({ outcome: 'accepted', [name]: value });
    return parsed()[0][name];
  };
  const hex = (n) => 'a'.repeat(n);
  const rows = {
    requestId: [
      ['r', 'r'],
      ['r'.repeat(64), 'r'.repeat(64)],
      ['', null],
      ['r'.repeat(65), null],
      [5, null],
      [['rr'], null],
    ],
    client: [
      ['c', 'c'],
      ['c'.repeat(64), 'c'.repeat(64)],
      ['', null],
      ['c'.repeat(65), null],
      [5, null],
      [['cc'], null],
    ],
    bbox: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [[1, 2, 3, 4, 5], null],
      [[1, 2, 3], null],
      [[1, 2, 3, '4'], null],
      [[1, 2, 3, null], null],
      [[1, 2, 3, Infinity], null],
      [[1, 2, 3, undefined], null],
      ['1234', null],
    ],
    areaKm2: [
      [0.105, 0.105],
      [0, 0],
      ['5', null],
      [Infinity, null],
      [NaN, null],
    ],
    credits: [
      [125, 125],
      [125.5, null],
      ['125', null],
    ],
    quoteId: [
      [hex(32), hex(32)],
      [hex(31), null],
      [hex(33), null],
      [`Z${hex(32)}`, null],
      [`${hex(32)}Z`, null],
      ['A'.repeat(32), null],
      [[hex(32)], null],
    ],
    idempotencyKey: [
      ['k'.repeat(16), 'k'.repeat(16)],
      ['k'.repeat(64), 'k'.repeat(64)],
      [`${'k'.repeat(14)}_-`, `${'k'.repeat(14)}_-`],
      ['k'.repeat(15), null],
      ['k'.repeat(65), null],
      [`${'k'.repeat(15)} `, null],
      [`!${'k'.repeat(16)}`, null],
      [`${'k'.repeat(16)}!`, null],
      [['k'.repeat(16)], null],
    ],
    upstreamStatus: [
      [200, 200],
      [200.5, null],
      ['200', null],
    ],
    burstId: [
      ['b', 'b'],
      ['b'.repeat(64), 'b'.repeat(64)],
      ['b_-', 'b_-'],
      ['', null],
      ['b'.repeat(65), null],
      ['b b', null],
      ['!b', null],
      ['b!', null],
      [['b'], null],
    ],
    durationMs: [
      [0, 0],
      [12.5, 12.5],
      [NaN, null],
      [Infinity, null],
      ['12', null],
    ],
  };
  for (const [name, list] of Object.entries(rows))
    for (const [value, expected] of list)
      assert.deepEqual(
        await written(name, value),
        expected,
        `${name} ${String(value)}`,
      );
});
