import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createCredits } from '../../server/providers/beemaps-burst/credits.js';

const DIR = '/fake/beemaps-burst';
const FILE = path.join(DIR, 'credits.json');
const T0 = Date.UTC(2026, 9, 15, 12, 0, 0);

/** A file layer in memory that records its calls and lets a test break one. */
function fakeFs(files = {}, hooks = {}) {
  const events = [];
  return {
    files,
    events,
    readFile: async (file) => {
      events.push(`read ${path.basename(file)}`);
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
  };
}
const make = (fs, limit = 625, clock = { t: T0 }) => ({
  clock,
  credits: createCredits({ dir: DIR, limit, now: () => clock.t, fs }),
});
const saved = (fs) => JSON.parse(fs.files[FILE]);

test('[beemaps-burst-control-021] writes {date, credits} before it answers, and answers with the credits used', async () => {
  let release;
  const gate = new Promise((resolve) => (release = resolve));
  const fs = fakeFs({}, { writeFile: () => gate });
  const { credits } = make(fs);
  let answered = false;
  const pending = credits.reserve(125).then((result) => {
    answered = true;
    return result;
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(answered, false);
  assert.deepEqual(
    fs.events.filter((e) => e.startsWith('write')),
    ['write credits.json'],
  );
  release();
  assert.deepEqual(await pending, { ok: true, used: 125, limit: 625 });
  assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 125 });
});

test('[beemaps-burst-control-021] starts again at 0 credits on a new UTC day and continues from the file in a new instance', async () => {
  const fs = fakeFs();
  const first = make(fs);
  await first.credits.reserve(125);
  await first.credits.reserve(125);
  assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 250 });
  const second = make(fs);
  assert.deepEqual(await second.credits.reserve(125), {
    ok: true,
    used: 375,
    limit: 625,
  });
  second.clock.t = Date.UTC(2026, 9, 16, 0, 0, 0);
  assert.deepEqual(await second.credits.peek(), {
    ok: true,
    used: 0,
    limit: 625,
  });
  assert.deepEqual(await second.credits.reserve(125), {
    ok: true,
    used: 125,
    limit: 625,
  });
  assert.deepEqual(saved(fs), { date: '2026-10-16', credits: 125 });
  second.clock.t = Date.UTC(2026, 9, 15, 23, 59, 59);
  assert.equal(
    (
      await make(
        fakeFs({ [FILE]: JSON.stringify({ date: '2026-10-15', credits: 5 }) }),
        625,
        { t: second.clock.t },
      ).credits.peek()
    ).used,
    5,
  );
});

test('[beemaps-burst-control-021] gives the credits used and the limit with peek, and does not write', async () => {
  const fs = fakeFs();
  const { credits } = make(fs, 625);
  assert.deepEqual(await credits.peek(), { ok: true, used: 0, limit: 625 });
  await credits.reserve(125);
  assert.deepEqual(await credits.peek(), { ok: true, used: 125, limit: 625 });
  assert.equal(fs.events.filter((e) => e.startsWith('write')).length, 1);
});

test('[beemaps-burst-control-022] passes five reserves of 125 credits with a limit of 625 and refuses the sixth', async () => {
  const fs = fakeFs();
  const { credits } = make(fs, 625);
  for (let n = 1; n <= 5; n += 1) {
    assert.deepEqual(await credits.reserve(125), {
      ok: true,
      used: n * 125,
      limit: 625,
    });
  }
  const writes = fs.events.filter((e) => e.startsWith('write')).length;
  assert.deepEqual(await credits.reserve(125), {
    ok: false,
    reason: 'limit',
    used: 625,
    limit: 625,
  });
  assert.equal(fs.events.filter((e) => e.startsWith('write')).length, writes);
  assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 625 });
});

test('[beemaps-burst-control-022] refuses a reserve that is larger than the credits that remain and does not add to the file', async () => {
  const fs = fakeFs({
    [FILE]: JSON.stringify({ date: '2026-10-15', credits: 500 }),
  });
  const { credits } = make(fs, 625);
  assert.deepEqual(await credits.reserve(126), {
    ok: false,
    reason: 'limit',
    used: 500,
    limit: 625,
  });
  assert.deepEqual(await credits.reserve(125), {
    ok: true,
    used: 625,
    limit: 625,
  });
  const over = make(
    fakeFs({ [FILE]: JSON.stringify({ date: '2026-10-15', credits: 700 }) }),
    625,
  );
  assert.deepEqual(await over.credits.reserve(1), {
    ok: false,
    reason: 'limit',
    used: 700,
    limit: 625,
  });
});

test('[beemaps-burst-control-021] starts at 0 credits for a file with another date', async () => {
  for (const date of ['2026-10-14', '2026-10-16', '2025-10-15']) {
    const fs = fakeFs({ [FILE]: JSON.stringify({ date, credits: 500 }) });
    const { credits } = make(fs);
    assert.deepEqual(
      await credits.peek(),
      { ok: true, used: 0, limit: 625 },
      date,
    );
    assert.deepEqual(await credits.reserve(125), {
      ok: true,
      used: 125,
      limit: 625,
    });
    assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 125 });
  }
});

test('[beemaps-burst-control-023] reads a file of today with 0 credits', async () => {
  const fs = fakeFs({
    [FILE]: JSON.stringify({ date: '2026-10-15', credits: 0 }),
  });
  assert.deepEqual(await make(fs).credits.reserve(125), {
    ok: true,
    used: 125,
    limit: 625,
  });
});

test('[beemaps-burst-control-022] runs the writes one after the other and ends with the last count', async () => {
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
          setTimeout(resolve, delays[JSON.parse(text).credits / 125 - 1]),
        );
        running -= 1;
      },
    },
  );
  const { credits } = make(fs, 625);
  const results = await Promise.all([
    credits.reserve(125),
    credits.reserve(125),
    credits.reserve(125),
  ]);
  assert.deepEqual(
    results.map((result) => result.used),
    [125, 250, 375],
  );
  assert.equal(overlap, 1);
  assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 375 });
});

test('[beemaps-burst-control-022] serializes the writes of reserves that start together and reads the file once', async () => {
  const fs = fakeFs(
    {},
    {
      readFile: async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw Object.assign(new Error('missing'), { code: 'ENOENT' });
      },
    },
  );
  const { credits } = make(fs, 625);
  const results = await Promise.all(
    Array.from({ length: 6 }, () => credits.reserve(125)),
  );
  assert.deepEqual(
    results.map((result) => result.ok),
    [true, true, true, true, true, false],
  );
  assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 625 });
  assert.equal(fs.events.filter((e) => e.startsWith('read')).length, 1);
});

test('[beemaps-burst-control-023] gives unavailable when the file cannot be read, and reads it again at the next call', async () => {
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
  const { credits } = make(fs);
  assert.deepEqual(await credits.reserve(125), {
    ok: false,
    reason: 'unavailable',
  });
  assert.deepEqual(await credits.peek(), { ok: false, reason: 'unavailable' });
  assert.deepEqual(
    fs.events.filter((e) => e.startsWith('write')),
    [],
  );
  fail = false;
  assert.deepEqual(await credits.reserve(125), {
    ok: true,
    used: 125,
    limit: 625,
  });
});

test('[beemaps-burst-control-023] gives unavailable for a file without a valid date and credits', async () => {
  for (const text of [
    '',
    'not json',
    '{"date":',
    'null',
    '[]',
    '5',
    '{}',
    '{"date":"2026-10-15"}',
    '{"credits":5}',
    '{"date":20261015,"credits":5}',
    '{"date":"2026-10-1","credits":5}',
    '{"date":"20261015","credits":5}',
    '{"date":"2026-10-15T00:00:00Z","credits":5}',
    '{"date":"x2026-10-15","credits":5}',
    '{"date":"2026-10-15x","credits":5}',
    '{"date":"2026-10-15","credits":-1}',
    '{"date":"2026-10-15","credits":1.5}',
    '{"date":"2026-10-15","credits":"5"}',
    '{"date":"2026-10-15","credits":null}',
  ]) {
    const fs = fakeFs({ [FILE]: text });
    const { credits } = make(fs);
    assert.deepEqual(
      await credits.reserve(125),
      { ok: false, reason: 'unavailable' },
      text,
    );
    assert.equal(fs.files[FILE], text);
  }
});

test('[beemaps-burst-control-023] gives unavailable when the write fails, writes nothing to the count, and reads the file again later', async () => {
  let fail = true;
  const fs = fakeFs(
    {},
    {
      writeFile: async () => {
        if (fail) throw new Error('disk full');
      },
    },
  );
  const { credits } = make(fs);
  assert.deepEqual(await credits.reserve(125), {
    ok: false,
    reason: 'unavailable',
  });
  fail = false;
  assert.deepEqual(await credits.reserve(125), {
    ok: true,
    used: 125,
    limit: 625,
  });
  assert.deepEqual(saved(fs), { date: '2026-10-15', credits: 125 });
});

test('[beemaps-burst-control-023] creates the folder before it writes', async () => {
  const fs = fakeFs();
  await make(fs).credits.reserve(125);
  assert.deepEqual(fs.events.slice(-2), ['mkdir', 'write credits.json']);
});

test('[beemaps-burst-control-022] reads the limit again at each call when it is a function', async () => {
  const fs = fakeFs();
  const clock = { t: T0 };
  let limit = 250;
  const credits = createCredits({
    dir: DIR,
    limit: () => limit,
    now: () => clock.t,
    fs,
  });
  assert.deepEqual(await credits.peek(), { ok: true, used: 0, limit: 250 });
  assert.deepEqual(await credits.reserve(125), {
    ok: true,
    used: 125,
    limit: 250,
  });
  assert.deepEqual(await credits.reserve(125), {
    ok: true,
    used: 250,
    limit: 250,
  });
  assert.deepEqual(await credits.reserve(125), {
    ok: false,
    reason: 'limit',
    used: 250,
    limit: 250,
  });
  limit = 500;
  assert.deepEqual(await credits.peek(), { ok: true, used: 250, limit: 500 });
  assert.deepEqual(await credits.reserve(125), {
    ok: true,
    used: 375,
    limit: 500,
  });
});
