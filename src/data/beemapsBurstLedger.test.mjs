import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createLedger } from '../../server/providers/beemaps-burst/ledger.js';

const DIR = '/fake/beemaps-burst';
const FILE = path.join(DIR, 'ledger.json');
const T0 = Date.UTC(2026, 9, 15, 12, 0, 0);
const KEY = 'k'.repeat(16);
const QUOTE = 'a'.repeat(32);

function fakeFs(files = {}, hooks = {}) {
  const events = [];
  return {
    files,
    events,
    readFile: async (file) => {
      events.push('read');
      if (hooks.readFile) return hooks.readFile(file);
      if (!Object.hasOwn(files, file)) {
        throw Object.assign(new Error('missing'), { code: 'ENOENT' });
      }
      return files[file];
    },
    mkdir: async () => {
      events.push('mkdir');
    },
    writeFile: async (file, text) => {
      events.push(`write ${path.basename(file)}`);
      if (hooks.writeFile) await hooks.writeFile(file, text);
      files[file] = text;
    },
    rename: async (from, to) => {
      events.push(`rename ${path.basename(from)} ${path.basename(to)}`);
      files[to] = files[from];
      delete files[from];
    },
  };
}
const make = (fs, clock = { t: T0 }) => ({
  clock,
  ledger: createLedger({ dir: DIR, now: () => clock.t, fs }),
});
const saved = (fs) => JSON.parse(fs.files[FILE]);
const hold = async (ledger) => (await ledger.find('z'.repeat(16))).holdSeconds;
const record = (n, state, time = T0, extra = {}) => ({
  key: `key-${String(n).padStart(12, '0')}`,
  quoteId: n.toString(16).padStart(32, '0'),
  state,
  time,
  ...extra,
});
const BURST = { id: 'b1', status: 'active', validUntil: 'x', credits: 125 };

test('[beemaps-burst-control-028] writes a pending record with the key, the quoteId, the state and the time before it answers', async () => {
  const fs = fakeFs();
  const { ledger } = make(fs);
  assert.deepEqual(await ledger.find(KEY), {
    ok: true,
    record: null,
    holdSeconds: 0,
  });
  assert.deepEqual(await ledger.begin(KEY, QUOTE), { ok: true });
  assert.deepEqual(saved(fs), {
    records: [{ key: KEY, quoteId: QUOTE, state: 'pending', time: T0 }],
  });
  assert.deepEqual(await ledger.find(KEY), {
    ok: true,
    record: { key: KEY, quoteId: QUOTE, state: 'pending', time: T0 },
    holdSeconds: 600,
  });
});

test('[beemaps-burst-control-028] changes the state to created, refused or unknown with the fields of each state', async () => {
  const fs = fakeFs();
  const { clock, ledger } = make(fs);
  const keys = ['a'.repeat(16), 'b'.repeat(16), 'c'.repeat(16)];
  for (const key of keys) await ledger.begin(key, QUOTE);
  clock.t = T0 + 5000;
  await ledger.finish(keys[0], 'created', {
    burst: BURST,
    creditsRemaining: 500,
  });
  await ledger.finish(keys[1], 'refused', {
    status: 429,
    error: 'upstream_rate_limit',
    retryAfter: 30,
  });
  await ledger.finish(keys[2], 'unknown', {});
  assert.deepEqual(saved(fs).records, [
    {
      key: keys[0],
      quoteId: QUOTE,
      state: 'created',
      time: T0 + 5000,
      burst: BURST,
      creditsRemaining: 500,
    },
    {
      key: keys[1],
      quoteId: QUOTE,
      state: 'refused',
      time: T0 + 5000,
      status: 429,
      error: 'upstream_rate_limit',
      retryAfter: 30,
    },
    { key: keys[2], quoteId: QUOTE, state: 'unknown', time: T0 + 5000 },
  ]);
  const again = make(fs).ledger;
  assert.equal((await again.find(keys[0])).record.burst.id, 'b1');
  assert.equal((await again.find(keys[1])).record.retryAfter, 30);
  assert.equal((await again.find(keys[2])).record.state, 'unknown');
});

test('[beemaps-burst-control-028] gives the pending record to a new ledger that reads the file', async () => {
  const fs = fakeFs();
  await make(fs).ledger.begin(KEY, QUOTE);
  const found = await make(fs).ledger.find(KEY);
  assert.equal(found.record.state, 'pending');
  assert.equal((await make(fs).ledger.find('z'.repeat(16))).record, null);
});

test('[beemaps-burst-control-028] keeps at most 500 records of created and refused, drops the oldest of those, and never drops pending or unknown', async () => {
  const records = [
    record(1, 'unknown', T0 - 9_000_000),
    record(2, 'pending', T0 - 9_000_000),
  ];
  for (let n = 3; n <= 502; n += 1) {
    records.push(
      record(
        n,
        n % 2 ? 'created' : 'refused',
        T0 - 8_000_000 + n,
        n % 2
          ? { burst: BURST, creditsRemaining: 1 }
          : { status: 402, error: 'no_credit' },
      ),
    );
  }
  const fs = fakeFs({ [FILE]: JSON.stringify({ records }) });
  const { ledger } = make(fs);
  await ledger.begin(KEY, QUOTE);
  await ledger.finish(KEY, 'created', { burst: BURST, creditsRemaining: 1 });
  const after = saved(fs).records;
  const finished = after.filter(
    (r) => r.state === 'created' || r.state === 'refused',
  );
  assert.equal(finished.length, 500);
  assert.equal(after.length, 502);
  assert.equal(after[0].state, 'unknown');
  assert.equal(after[1].state, 'pending');
  assert.equal(
    after.some((r) => r.key === record(3, 'x').key),
    false,
  );
  assert.equal(
    after.some((r) => r.key === record(4, 'x').key),
    true,
  );
  assert.equal(after.at(-1).key, KEY);
});

test('[beemaps-burst-control-039] reads a missing file as an empty ledger and any other read error as a failure, and reads again after a failure', async () => {
  let fail = true;
  const fs = fakeFs(
    {},
    {
      readFile: async () => {
        if (fail) throw Object.assign(new Error('denied'), { code: 'EACCES' });
        throw Object.assign(new Error('missing'), { code: 'ENOENT' });
      },
    },
  );
  const { ledger } = make(fs);
  assert.deepEqual(await ledger.find(KEY), { ok: false });
  assert.deepEqual(await ledger.begin(KEY, QUOTE), { ok: false });
  assert.deepEqual(
    fs.events.filter((e) => e.startsWith('write')),
    [],
  );
  fail = false;
  assert.deepEqual(await ledger.find(KEY), {
    ok: true,
    record: null,
    holdSeconds: 0,
  });
  const reads = fs.events.filter((e) => e === 'read').length;
  await ledger.find(KEY);
  assert.equal(fs.events.filter((e) => e === 'read').length, reads);
});

test('[beemaps-burst-control-039] gives a failure for a file that is not valid JSON, not an object, or has a record that is not valid', async () => {
  const good = record(1, 'created', T0, { burst: BURST, creditsRemaining: 1 });
  for (const text of [
    '',
    'not json',
    '{"records":',
    'null',
    '[]',
    '5',
    '{}',
    '{"records":{}}',
    JSON.stringify({ records: [5] }),
    JSON.stringify({ records: [null] }),
    JSON.stringify({ records: [{ ...good, key: 'short' }] }),
    JSON.stringify({ records: [{ ...good, key: 'k'.repeat(15) }] }),
    JSON.stringify({ records: [{ ...good, key: 'k'.repeat(65) }] }),
    JSON.stringify({ records: [{ ...good, key: `${'k'.repeat(15)} ` }] }),
    JSON.stringify({ records: [{ ...good, key: `${'k'.repeat(16)}!` }] }),
    JSON.stringify({ records: [{ ...good, key: `!${'k'.repeat(16)}` }] }),
    JSON.stringify({ records: [{ ...good, key: 1234567890123456 }] }),
    JSON.stringify({ records: [{ ...good, key: ['k'.repeat(16)] }] }),
    JSON.stringify({ records: [{ ...good, quoteId: 'a'.repeat(31) }] }),
    JSON.stringify({ records: [{ ...good, quoteId: 'a'.repeat(33) }] }),
    JSON.stringify({ records: [{ ...good, quoteId: `Z${'a'.repeat(32)}` }] }),
    JSON.stringify({ records: [{ ...good, quoteId: `${'a'.repeat(32)}Z` }] }),
    JSON.stringify({ records: [{ ...good, quoteId: ['a'.repeat(32)] }] }),
    JSON.stringify({ records: [{ ...good, state: 'done' }] }),
    JSON.stringify({ records: [{ ...good, key: 'bad key bad key bad' }] }),
    JSON.stringify({ records: [{ ...good, quoteId: 'A'.repeat(32) }] }),
    JSON.stringify({ records: [{ ...good, state: 'sent' }] }),
    JSON.stringify({ records: [{ ...good, time: 1.5 }] }),
    JSON.stringify({ records: [{ ...good, time: -1 }] }),
    JSON.stringify({ records: [{ ...good, time: '5' }] }),
    JSON.stringify({ records: [{ ...good, burst: undefined }] }),
    JSON.stringify({ records: [{ ...good, burst: { id: 5 } }] }),
    JSON.stringify({ records: [record(2, 'refused')] }),
    JSON.stringify({
      records: [record(2, 'refused', T0, { status: '429', error: 'x' })],
    }),
    JSON.stringify({ records: [record(2, 'refused', T0, { status: 429 })] }),
  ]) {
    const fs = fakeFs({ [FILE]: text });
    assert.deepEqual(await make(fs).ledger.find(KEY), { ok: false }, text);
    assert.equal(fs.files[FILE], text);
  }
  const fs = fakeFs({ [FILE]: JSON.stringify({ records: [good] }) });
  assert.equal((await make(fs).ledger.find(good.key)).ok, true);
});

test('[beemaps-burst-control-039] reads a record with a time of 0, a key of 16 or 64 characters, and the states pending and unknown', async () => {
  const records = [
    record(1, 'pending', 0),
    { ...record(2, 'unknown'), key: 'k'.repeat(64) },
    { ...record(3, 'unknown'), key: `${'-_'.repeat(8)}` },
  ];
  const { ledger } = make(fakeFs({ [FILE]: JSON.stringify({ records }) }));
  for (const entry of records) {
    const found = await ledger.find(entry.key);
    assert.equal(found.ok, true, entry.key);
    assert.deepEqual(found.record, entry);
  }
});

test('[beemaps-burst-control-039] reads the file once for calls that start together', async () => {
  const fs = fakeFs(
    {},
    {
      readFile: async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw Object.assign(new Error('missing'), { code: 'ENOENT' });
      },
    },
  );
  const { ledger } = make(fs);
  const answers = await Promise.all([
    ledger.find(KEY),
    ledger.find(KEY),
    ledger.find(KEY),
  ]);
  assert.deepEqual(
    answers.map((answer) => answer.ok),
    [true, true, true],
  );
  assert.equal(fs.events.filter((event) => event === 'read').length, 1);
});

test('[beemaps-burst-control-028] runs the writes one after the other and ends with the last records', async () => {
  let running = 0;
  let overlap = 0;
  const delays = [30, 5, 15];
  const fs = fakeFs(
    {},
    {
      writeFile: async (file, text) => {
        running += 1;
        overlap = Math.max(overlap, running);
        await new Promise((resolve) =>
          setTimeout(resolve, delays[JSON.parse(text).records.length - 1]),
        );
        running -= 1;
      },
    },
  );
  const { ledger } = make(fs);
  const keys = [1, 2, 3].map((n) => record(n, 'pending').key);
  const answers = await Promise.all(
    keys.map((key, index) =>
      ledger.begin(key, record(index + 1, 'pending').quoteId),
    ),
  );
  assert.deepEqual(answers, [{ ok: true }, { ok: true }, { ok: true }]);
  assert.equal(overlap, 1);
  assert.deepEqual(
    saved(fs).records.map((entry) => entry.key),
    keys,
  );
});

test('[beemaps-burst-control-028] drops all the finished records above 500 at once, oldest first', async () => {
  const records = Array.from({ length: 503 }, (_, index) =>
    record(index + 1, 'created', T0 - 1000 + index, {
      burst: BURST,
      creditsRemaining: 1,
    }),
  );
  const fs = fakeFs({ [FILE]: JSON.stringify({ records }) });
  const { ledger } = make(fs);
  assert.deepEqual(await ledger.begin(KEY, QUOTE), { ok: true });
  const keys = saved(fs).records.map((entry) => entry.key);
  assert.equal(keys.length, 501);
  assert.deepEqual(keys.slice(0, 2), [record(4).key, record(5).key]);
  assert.equal(keys.at(-1), KEY);
  for (const n of [1, 2, 3])
    assert.equal((await ledger.find(record(n).key)).record, null);
  assert.equal((await ledger.find(record(4).key)).record.state, 'created');
});

test('[beemaps-burst-control-028] gives a copy of a record that the caller cannot change in the store', async () => {
  const entry = record(1, 'created', T0, { burst: BURST, creditsRemaining: 7 });
  const { ledger } = make(
    fakeFs({ [FILE]: JSON.stringify({ records: [entry] }) }),
  );
  const first = (await ledger.find(entry.key)).record;
  assert.deepEqual(first, entry);
  first.state = 'refused';
  first.burst.id = 'changed';
  first.time = 5;
  assert.deepEqual((await ledger.find(entry.key)).record, entry);
});

test('[beemaps-burst-control-028] writes a refused record without retryAfter when the answer had none', async () => {
  const fs = fakeFs();
  const { ledger } = make(fs);
  await ledger.begin(KEY, QUOTE);
  await ledger.finish(KEY, 'refused', { status: 402, error: 'no_credit' });
  const expected = {
    key: KEY,
    quoteId: QUOTE,
    state: 'refused',
    time: T0,
    status: 402,
    error: 'no_credit',
  };
  assert.deepEqual(saved(fs).records, [expected]);
  assert.deepEqual((await ledger.find(KEY)).record, expected);
  const other = 'm'.repeat(16);
  await ledger.begin(other, QUOTE);
  await ledger.finish(other, 'refused', {
    status: 429,
    error: 'upstream_rate_limit',
    retryAfter: 77,
  });
  assert.equal((await ledger.find(other)).record.retryAfter, 77);
});

test('[beemaps-burst-control-028] writes only the fields of the new state and takes the state and the time from the call', async () => {
  const fs = fakeFs();
  const { clock, ledger } = make(fs);
  await ledger.begin(KEY, QUOTE);
  clock.t = T0 + 5000;
  await ledger.finish(KEY, 'created', {
    burst: BURST,
    creditsRemaining: 5,
    extra: 1,
    status: 402,
    state: 'refused',
    time: 7,
  });
  assert.deepEqual(saved(fs).records, [
    {
      key: KEY,
      quoteId: QUOTE,
      state: 'created',
      time: T0 + 5000,
      burst: BURST,
      creditsRemaining: 5,
    },
  ]);
});

test('[beemaps-burst-control-039] gives a failure when the write fails and keeps no record of the attempt in memory', async () => {
  let fail = true;
  const fs = fakeFs(
    {},
    {
      writeFile: async () => {
        if (fail) throw new Error('disk full');
      },
    },
  );
  const { ledger } = make(fs);
  assert.deepEqual(await ledger.begin(KEY, QUOTE), { ok: false });
  fail = false;
  assert.deepEqual(await ledger.find(KEY), {
    ok: true,
    record: null,
    holdSeconds: 0,
  });
  assert.deepEqual(await ledger.begin(KEY, QUOTE), { ok: true });
});

test('[beemaps-burst-control-039] writes a temporary file first and then renames it to ledger.json', async () => {
  const fs = fakeFs();
  const { ledger } = make(fs);
  await ledger.begin(KEY, QUOTE);
  assert.deepEqual(fs.events.slice(-3), [
    'mkdir',
    'write ledger.json.tmp',
    'rename ledger.json.tmp ledger.json',
  ]);
  assert.equal(Object.hasOwn(fs.files, `${FILE}.tmp`), false);
});

test('[beemaps-burst-control-040] gives the seconds that remain of 600 for the newest record that is unknown or pending, rounded up', async () => {
  const fs = fakeFs();
  const { clock, ledger } = make(fs);
  assert.equal(await hold(ledger), 0);
  await ledger.begin(KEY, QUOTE);
  assert.equal(await hold(ledger), 600);
  clock.t = T0 + 100_000;
  assert.equal(await hold(ledger), 500);
  clock.t = T0 + 599_500;
  assert.equal(await hold(ledger), 1);
  clock.t = T0 + 599_999;
  assert.equal(await hold(ledger), 1);
  clock.t = T0 + 599_600;
  assert.equal(await hold(ledger), 1);
  clock.t = T0 + 598_600;
  assert.equal(await hold(ledger), 2);
  clock.t = T0 + 600_000;
  assert.equal(await hold(ledger), 0);
  clock.t = T0 + 700_000;
  assert.equal(await hold(ledger), 0);
});

test('[beemaps-burst-control-040] gives no hold for created and refused records and takes the largest hold of several records', async () => {
  const records = [
    record(1, 'created', T0 - 10_000, { burst: BURST, creditsRemaining: 1 }),
    record(2, 'refused', T0 - 10_000, { status: 402, error: 'no_credit' }),
    record(3, 'pending', T0 - 100_000),
    record(4, 'unknown', T0 - 400_000),
  ];
  const fs = fakeFs({ [FILE]: JSON.stringify({ records }) });
  const { ledger } = make(fs);
  assert.equal(await hold(ledger), 500);
  const quiet = make(
    fakeFs({ [FILE]: JSON.stringify({ records: records.slice(0, 2) }) }),
  );
  assert.equal(await hold(quiet.ledger), 0);
});

test('[beemaps-burst-control-040] gives a failure with the hold when the file fails', async () => {
  const fs = fakeFs({ [FILE]: 'not json' });
  assert.deepEqual(await make(fs).ledger.find(KEY), { ok: false });
});

test('[beemaps-burst-control-028] gives a failure for a finish of a key that has no record', async () => {
  const { ledger } = make(fakeFs());
  assert.deepEqual(await ledger.finish(KEY, 'unknown', {}), { ok: false });
  await ledger.find(KEY);
  assert.deepEqual(await ledger.finish(KEY, 'unknown', {}), { ok: false });
});

test('[beemaps-burst-control-039] gives a failure when the write of a finish fails and keeps the new state in memory', async () => {
  let fail = false;
  const fs = fakeFs(
    {},
    {
      writeFile: async () => {
        if (fail) throw new Error('disk full');
      },
    },
  );
  const { ledger } = make(fs);
  await ledger.begin(KEY, QUOTE);
  fail = true;
  assert.deepEqual(await ledger.finish(KEY, 'unknown', {}), { ok: false });
  assert.equal((await ledger.find(KEY)).record.state, 'unknown');
  assert.equal(saved(fs).records[0].state, 'pending');
});

test('[beemaps-burst-control-028] reads a created record that has no creditsRemaining with null', async () => {
  const text = JSON.stringify({
    records: [record(1, 'created', T0, { burst: BURST })],
  });
  const found = await make(fakeFs({ [FILE]: text })).ledger.find(
    record(1, 'x').key,
  );
  assert.equal(found.record.creditsRemaining, null);
  assert.equal(found.record.burst.id, 'b1');
});

test('[beemaps-burst-control-039] drops the fields of a record that its state does not have when it reads the file', async () => {
  const stray = {
    ...record(1, 'pending'),
    burst: BURST,
    status: 402,
    extra: 'x',
  };
  const fs = fakeFs({ [FILE]: JSON.stringify({ records: [stray] }) });
  const { ledger } = make(fs);
  assert.deepEqual(await ledger.begin(KEY, QUOTE), { ok: true });
  assert.deepEqual(saved(fs).records[0], record(1, 'pending'));
  assert.deepEqual(
    (await ledger.find(record(1, 'pending').key)).record,
    record(1, 'pending'),
  );
});

test('[beemaps-burst-control-028] drops the fields of the old state when a record changes its state again', async () => {
  const fs = fakeFs();
  const { clock, ledger } = make(fs);
  await ledger.begin(KEY, QUOTE);
  await ledger.finish(KEY, 'created', { burst: BURST, creditsRemaining: 5 });
  clock.t = T0 + 1000;
  await ledger.finish(KEY, 'unknown', {});
  assert.deepEqual(saved(fs).records, [
    { key: KEY, quoteId: QUOTE, state: 'unknown', time: T0 + 1000 },
  ]);
  await ledger.finish(KEY, 'refused', {
    status: 429,
    error: 'x',
    retryAfter: 9,
  });
  await ledger.finish(KEY, 'created', { burst: BURST, creditsRemaining: 1 });
  assert.deepEqual(Object.keys(saved(fs).records[0]), [
    'key',
    'quoteId',
    'state',
    'time',
    'burst',
    'creditsRemaining',
  ]);
});

test('[beemaps-burst-control-039] reads a refused record with a status from 400 to 599 and a retryAfter from 1 to 600 and refuses the others', async () => {
  const refused = (extra) =>
    record(2, 'refused', T0, { status: 429, error: 'x', ...extra });
  for (const extra of [
    { status: 400 },
    { status: 599 },
    { retryAfter: 1 },
    { retryAfter: 600 },
    {},
  ]) {
    const entry = refused(extra);
    const fs = fakeFs({ [FILE]: JSON.stringify({ records: [entry] }) });
    const found = await make(fs).ledger.find(entry.key);
    assert.equal(found.ok, true, JSON.stringify(extra));
    assert.deepEqual(found.record, entry);
  }
  for (const extra of [
    { status: 399 },
    { status: 600 },
    { status: 0 },
    { status: 200 },
    { retryAfter: 0 },
    { retryAfter: 601 },
    { retryAfter: -1 },
    { retryAfter: 1.5 },
    { retryAfter: '5' },
    { retryAfter: null },
    { error: 5 },
    { error: null },
    { error: ['x'] },
  ]) {
    const fs = fakeFs({
      [FILE]: JSON.stringify({ records: [refused(extra)] }),
    });
    assert.deepEqual(
      await make(fs).ledger.find(KEY),
      { ok: false },
      JSON.stringify(extra),
    );
  }
});
