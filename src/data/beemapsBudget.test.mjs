import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fsp } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createBudget } from '../../server/providers/beemaps/budget.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const TODAY = '2026-10-15';
const clock = { t: NOW };

async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'gev-beemaps-'));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}
const fileOf = (dir) => path.join(dir, 'budget.json');
const readFile = async (dir) =>
  JSON.parse(await fsp.readFile(fileOf(dir), 'utf8'));
const make = (dir, env = {}, extra = {}) => {
  clock.t = NOW;
  return createBudget({ dir, env, now: () => clock.t, ...extra });
};
/** A file layer over the real one that lets a test slow down or break an operation. */
function fakeFs(hooks = {}) {
  const events = [];
  let running = 0;
  let overlap = 0;
  return {
    events,
    get overlap() {
      return overlap;
    },
    readFile: async (...args) => {
      if (hooks.readFile) return hooks.readFile(...args);
      return fsp.readFile(...args);
    },
    mkdir: (...args) => fsp.mkdir(...args),
    writeFile: async (file, text, enc) => {
      running += 1;
      overlap = Math.max(overlap, running);
      events.push(`start ${JSON.parse(text).count}`);
      try {
        if (hooks.writeFile) await hooks.writeFile(text);
        await fsp.writeFile(file, text, enc);
      } finally {
        events.push(`end ${JSON.parse(text).count}`);
        running -= 1;
      }
    },
  };
}
const gate = () => {
  let open;
  const opened = new Promise((resolve) => {
    open = resolve;
  });
  return { opened, open };
};

test('[beemaps-source-016] adds 1 to the count of the day, writes the file and then answers', async (t) => {
  const dir = await tempDir(t);
  const budget = make(dir);
  assert.deepEqual(await budget.reserve(), { ok: true, used: 1, limit: 20 });
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 1 });
  assert.deepEqual(await budget.reserve(), { ok: true, used: 2, limit: 20 });
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 2 });
});

test('[beemaps-source-016] waits for the write to end before it answers', async (t) => {
  const dir = await tempDir(t);
  const slow = gate();
  const fs = fakeFs({ writeFile: () => slow.opened });
  const budget = make(dir, {}, { fs });
  let answered = false;
  const pending = budget.reserve().then((result) => {
    answered = true;
    return result;
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(answered, false);
  assert.deepEqual(fs.events, ['start 1']);
  slow.open();
  assert.deepEqual(await pending, { ok: true, used: 1, limit: 20 });
  assert.deepEqual(fs.events, ['start 1', 'end 1']);
});

test('[beemaps-source-016] refuses the 21st call of a day with the default daily limit of 20', async (t) => {
  const dir = await tempDir(t);
  const budget = make(dir);
  for (let i = 1; i <= 20; i++) assert.equal((await budget.reserve()).used, i);
  assert.deepEqual(await budget.reserve(), {
    ok: false,
    reason: 'limit',
    used: 20,
    limit: 20,
  });
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 20 });
  assert.deepEqual(await budget.reserve(), {
    ok: false,
    reason: 'limit',
    used: 20,
    limit: 20,
  });
  assert.deepEqual(budget.current(), { used: 20, limit: 20 });
});

test('[beemaps-source-016] takes the daily limit from digits only that are 1 or more', async (t) => {
  for (const [text, limit] of [
    ['3', 3],
    ['007', 7],
    ['1', 1],
    ['20abc', 20],
    ['1e3', 20],
    ['-5', 20],
    ['+5', 20],
    [' 5', 20],
    ['5 ', 20],
    ['0', 20],
    ['00', 20],
    ['', 20],
    ['3.5', 20],
    [undefined, 20],
  ]) {
    const dir = await tempDir(t);
    await fsp.writeFile(
      fileOf(dir),
      JSON.stringify({ date: TODAY, count: limit - 1 }),
    );
    const budget = make(dir, { BEEMAPS_DAILY_QUERIES: text });
    assert.deepEqual(
      await budget.reserve(),
      { ok: true, used: limit, limit },
      String(text),
    );
    assert.deepEqual(await budget.reserve(), {
      ok: false,
      reason: 'limit',
      used: limit,
      limit,
    });
  }
});

test('[beemaps-source-016] refuses a count above the daily limit and does not add to it', async (t) => {
  const dir = await tempDir(t);
  await fsp.writeFile(fileOf(dir), JSON.stringify({ date: TODAY, count: 5 }));
  const fs = fakeFs();
  const budget = make(dir, { BEEMAPS_DAILY_QUERIES: '3' }, { fs });
  assert.deepEqual(await budget.reserve(), {
    ok: false,
    reason: 'limit',
    used: 5,
    limit: 3,
  });
  assert.deepEqual(fs.events, []);
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 5 });
});

test('[beemaps-source-017] continues from the count of today in the file', async (t) => {
  const dir = await tempDir(t);
  await fsp.writeFile(fileOf(dir), JSON.stringify({ date: TODAY, count: 7 }));
  assert.deepEqual(await make(dir).reserve(), { ok: true, used: 8, limit: 20 });
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 8 });
});

test('[beemaps-source-017] starts at 0 for a file with another date or for a file that is not there', async (t) => {
  for (const date of ['2026-10-14', '2026-10-16', '2025-10-15']) {
    const dir = await tempDir(t);
    await fsp.writeFile(fileOf(dir), JSON.stringify({ date, count: 19 }));
    assert.deepEqual(
      await make(dir).reserve(),
      { ok: true, used: 1, limit: 20 },
      date,
    );
    assert.deepEqual(await readFile(dir), { date: TODAY, count: 1 });
  }
  const dir = await tempDir(t);
  const nested = path.join(dir, 'not', 'there');
  assert.deepEqual(await make(nested).reserve(), {
    ok: true,
    used: 1,
    limit: 20,
  });
  assert.deepEqual(await readFile(nested), { date: TODAY, count: 1 });
});

test('[beemaps-source-017] starts again at 0 when the day changes while the plugin runs', async (t) => {
  const dir = await tempDir(t);
  const budget = make(dir, { BEEMAPS_DAILY_QUERIES: '2' });
  await budget.reserve();
  await budget.reserve();
  assert.equal((await budget.reserve()).ok, false);
  assert.deepEqual(budget.current(), { used: 2, limit: 2 });
  clock.t = Date.UTC(2026, 9, 16, 0, 0, 0);
  assert.deepEqual(budget.current(), { used: 0, limit: 2 });
  assert.deepEqual(await budget.reserve(), { ok: true, used: 1, limit: 2 });
  assert.deepEqual(await readFile(dir), { date: '2026-10-16', count: 1 });
});

test('[beemaps-source-017] refuses a file that is not valid JSON or has no date in the form YYYY-MM-DD and no count', async (t) => {
  for (const text of [
    '',
    'not json',
    '{"date":',
    'null',
    '[]',
    '5',
    '{}',
    '{"date":"2026-10-15"}',
    '{"count":3}',
    '{"date":20261015,"count":3}',
    '{"date":["2026-10-15"],"count":3}',
    '{"date":"","count":3}',
    '{"date":"tomorrow","count":3}',
    '{"date":"2026-10-1","count":3}',
    '{"date":"20261015","count":3}',
    '{"date":"2026-10-15T00:00:00Z","count":3}',
    '{"date":"2026-10-15","count":-1}',
    '{"date":"2026-10-15","count":1.5}',
    '{"date":"2026-10-15","count":"3"}',
    '{"date":"2026-10-15","count":null}',
  ]) {
    const dir = await tempDir(t);
    await fsp.writeFile(fileOf(dir), text);
    const fs = fakeFs();
    assert.deepEqual(
      await make(dir, {}, { fs }).reserve(),
      {
        ok: false,
        reason: 'unavailable',
      },
      text,
    );
    assert.deepEqual(fs.events, [], text);
    assert.equal(await fsp.readFile(fileOf(dir), 'utf8'), text);
  }
});

test('[beemaps-source-017] refuses when the file cannot be read for another reason and reads it again later', async (t) => {
  const dir = await tempDir(t);
  let fail = true;
  const fs = fakeFs({
    readFile: async (...args) => {
      if (fail) throw Object.assign(new Error('denied'), { code: 'EACCES' });
      return fsp.readFile(...args);
    },
  });
  const budget = make(dir, {}, { fs });
  assert.deepEqual(await budget.reserve(), {
    ok: false,
    reason: 'unavailable',
  });
  assert.deepEqual(fs.events, []);
  fail = false;
  assert.deepEqual(await budget.reserve(), { ok: true, used: 1, limit: 20 });
});

test('[beemaps-source-017] refuses when the file cannot be written and writes again later', async (t) => {
  const dir = await tempDir(t);
  let fail = true;
  const fs = fakeFs({
    writeFile: async () => {
      if (fail) throw new Error('disk full');
    },
  });
  const budget = make(dir, {}, { fs });
  assert.deepEqual(await budget.reserve(), {
    ok: false,
    reason: 'unavailable',
  });
  fail = false;
  const next = await budget.reserve();
  assert.equal(next.ok, true);
  assert.deepEqual(await readFile(dir), { date: TODAY, count: next.used });
});

test('[beemaps-source-018] lets 2 of 5 requests at the same time pass when the daily limit is 2', async (t) => {
  const dir = await tempDir(t);
  const budget = make(dir, { BEEMAPS_DAILY_QUERIES: '2' });
  const results = await Promise.all(
    Array.from({ length: 5 }, () => budget.reserve()),
  );
  assert.deepEqual(
    results.map((result) => result.ok),
    [true, true, false, false, false],
  );
  assert.deepEqual(
    results.slice(0, 2).map((result) => result.used),
    [1, 2],
  );
  for (const result of results.slice(2))
    assert.deepEqual(result, { ok: false, reason: 'limit', used: 2, limit: 2 });
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 2 });
});

test('[beemaps-source-018] runs the writes one after the other and ends with the last count', async (t) => {
  const dir = await tempDir(t);
  const delays = [30, 5, 15];
  const fs = fakeFs({
    writeFile: (text) =>
      new Promise((resolve) =>
        setTimeout(resolve, delays[JSON.parse(text).count - 1]),
      ),
  });
  const budget = make(dir, {}, { fs });
  const results = await Promise.all([
    budget.reserve(),
    budget.reserve(),
    budget.reserve(),
  ]);
  assert.deepEqual(
    results.map((result) => result.used),
    [1, 2, 3],
  );
  assert.deepEqual(fs.events, [
    'start 1',
    'end 1',
    'start 2',
    'end 2',
    'start 3',
    'end 3',
  ]);
  assert.equal(fs.overlap, 1);
  assert.deepEqual(await readFile(dir), { date: TODAY, count: 3 });
});

test('[beemaps-source-018] answers each request only after its own write ended', async (t) => {
  const dir = await tempDir(t);
  const first = gate();
  const fs = fakeFs({
    writeFile: (text) =>
      JSON.parse(text).count === 1 ? first.opened : Promise.resolve(),
  });
  const budget = make(dir, {}, { fs });
  const order = [];
  const one = budget.reserve().then(() => order.push('one'));
  const two = budget.reserve().then(() => order.push('two'));
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.deepEqual(order, []);
  first.open();
  await Promise.all([one, two]);
  assert.deepEqual(order, ['one', 'two']);
});
