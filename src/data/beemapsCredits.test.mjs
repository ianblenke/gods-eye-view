import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fsp } from 'node:fs';
import { Readable } from 'node:stream';
import os from 'node:os';
import path from 'node:path';
import { beemapsProxy } from '../../server/providers/beemaps.js';
import {
  createCredits,
  creditLimit,
  creditsOf,
} from '../../server/providers/beemaps/credits.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const TODAY = '2026-10-15';
const KEY = 'fixture-key-Z9y8';
const HOST = '127.0.0.1:5173';
const FRAMES = '/api/beemaps/frames';
const GOOD_HEADERS = {
  host: HOST,
  origin: `http://${HOST}`,
  'content-type': 'application/json',
};
const JSON_HEADERS = { 'content-type': 'application/json' };
const DAY = 24 * 3600 * 1000;

const boxAt = (n) => [10 + n * 0.1, 60, 10.02 + n * 0.1, 60.01];
const ok = (text) => new Response(text, { status: 200, headers: JSON_HEADERS });
const used = (n) => ok(JSON.stringify({ frames: [], creditsUsed: n }));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(check) {
  for (let i = 0; i < 400 && !check(); i++) await sleep(5);
  assert.equal(check(), true, 'the wait ended before the check was true');
}
const gate = () => {
  let open;
  const opened = new Promise((resolve) => {
    open = resolve;
  });
  return { opened, open };
};

async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'gev-beemaps-cr-'));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}
const creditFile = (dir) => path.join(dir, 'credits.json');
const budgetFile = (dir) => path.join(dir, 'budget.json');
const readJson = async (file) => JSON.parse(await fsp.readFile(file, 'utf8'));
const readText = (file) => fsp.readFile(file, 'utf8');
const exists = (file) =>
  fsp.access(file).then(
    () => true,
    () => false,
  );
const seed = (dir, value) =>
  fsp.writeFile(
    creditFile(dir),
    typeof value === 'string' ? value : JSON.stringify(value),
  );

/** A file layer over the real one that lets a test slow down or break the credit file. */
function fakeFs(hooks = {}) {
  const events = [];
  let running = 0;
  let overlap = 0;
  return {
    events,
    get overlap() {
      return overlap;
    },
    readFile: (...args) => fsp.readFile(...args),
    mkdir: (...args) => fsp.mkdir(...args),
    writeFile: async (file, text, encoding) => {
      running += 1;
      overlap = Math.max(overlap, running);
      events.push(`start ${JSON.parse(text).used}`);
      try {
        if (hooks.writeFile) await hooks.writeFile(text);
        await fsp.writeFile(file, text, encoding);
      } finally {
        events.push(`end ${JSON.parse(text).used}`);
        running -= 1;
      }
    },
  };
}

/** Install the plugin on a fake middleware list. Dates are mocked, requests are fake. */
async function install(t, { env = {}, respond, dir: ownDir, fs, now } = {}) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const dir = ownDir ?? (await tempDir(t));
  const calls = [];
  const lines = [];
  const plugin = beemapsProxy({
    env: { BEEMAPS_API_KEY: KEY, ...env },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return respond(url, init, calls.length);
    },
    setTimer: () => 1,
    clearTimer: () => {},
    cacheDir: dir,
    log: (line) => lines.push(line),
    ...(fs ? { fs } : {}),
    ...(now ? { now } : {}),
  });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (route, handler) => routes.set(route, handler) },
  });
  async function request(bbox = boxAt(0)) {
    const req = Object.assign(
      Readable.from([Buffer.from(JSON.stringify({ bbox }))]),
      {
        method: 'POST',
        url: '/',
        headers: GOOD_HEADERS,
        socket: { remoteAddress: '127.0.0.1' },
      },
    );
    const res = {
      headers: {},
      writeHead(code, values) {
        this.statusCode = code;
        Object.assign(this.headers, values);
      },
      end(chunk) {
        this.text = chunk;
      },
    };
    await routes.get(FRAMES)(req, res, () => {});
    return { status: res.statusCode, body: JSON.parse(res.text) };
  }
  return { request, calls, lines, dir, tick: (ms) => t.mock.timers.tick(ms) };
}

test('[beemaps-source-032] takes the credit limit from digits only that are 1 or more', () => {
  for (const [text, limit] of [
    ['1', 1],
    ['75', 75],
    ['100000', 100000],
    ['007', 7],
    [undefined, 500],
    ['', 500],
    ['0', 500],
    ['00', 500],
    ['-3', 500],
    ['+5', 500],
    ['12.5', 500],
    ['7 ', 500],
    [' 7', 500],
    ['1e3', 500],
    ['abc', 500],
    ['20abc', 500],
  ]) {
    assert.equal(
      creditLimit({ BEEMAPS_DAILY_CREDITS: text }),
      limit,
      String(text),
    );
  }
  assert.equal(creditLimit({}), 500);
});

test('[beemaps-source-032] keeps the credit limit apart from the daily request limit', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 75 });
  const server = await install(t, {
    dir,
    env: { BEEMAPS_DAILY_CREDITS: '75', BEEMAPS_DAILY_QUERIES: '3' },
    respond: () => used(1),
  });
  const answer = await server.request();
  assert.equal(answer.status, 429);
  assert.deepEqual(answer.body, {
    error: 'credit_budget',
    used: 75,
    limit: 75,
  });
  const other = await tempDir(t);
  await seed(other, { date: TODAY, used: 75 });
  const wide = await install(t, {
    dir: other,
    env: { BEEMAPS_DAILY_QUERIES: '1' },
    respond: () => used(1),
  });
  assert.equal((await wide.request()).status, 200);
  assert.equal((await wide.request(boxAt(1))).body.error, 'budget');
});

test('[beemaps-source-033] adds the credits of an answer, writes the credit file and sums two answers', async (t) => {
  const dir = await tempDir(t);
  const server = await install(t, {
    dir,
    respond: (url, init, n) => used(n === 1 ? 99 : 0.5),
  });
  assert.equal((await server.request(boxAt(0))).status, 200);
  assert.equal(
    await readText(creditFile(dir)),
    '{"date":"2026-10-15","used":99}',
  );
  assert.equal((await server.request(boxAt(1))).status, 200);
  assert.equal(
    await readText(creditFile(dir)),
    '{"date":"2026-10-15","used":99.5}',
  );
});

test('[beemaps-source-033] adds 0 for a number that is not 0 or more and writes no file', async (t) => {
  for (const text of [
    '{"frames":[],"creditsUsed":-5}',
    '{"frames":[],"creditsUsed":"7"}',
    '{"frames":[],"creditsUsed":null}',
    '{"frames":[],"creditsUsed":1e999}',
    '{"frames":[],"creditsUsed":0}',
    '{"frames":[]}',
  ]) {
    const dir = await tempDir(t);
    const server = await install(t, { dir, respond: () => ok(text) });
    assert.equal((await server.request()).status, 200, text);
    assert.equal(await exists(creditFile(dir)), false, text);
  }
});

test('[beemaps-source-033] adds 0 for a failure, and adds the credits of a document of the wrong shape', async (t) => {
  const rows = [
    [
      'a failure by status',
      () => new Response('{"creditsUsed":99}', { status: 500 }),
      502,
      false,
    ],
    [
      'a thrown error',
      () => {
        throw new Error('down');
      },
      502,
      false,
    ],
    ['a body that is not JSON', () => ok('not json'), 502, false],
    ['the body null', () => ok('null'), 502, false],
    ['the body []', () => ok('[]'), 502, false],
    [
      'frames that is a number',
      () => ok('{"frames":5,"creditsUsed":4}'),
      502,
      true,
    ],
  ];
  for (const [name, respond, status, written] of rows) {
    const dir = await tempDir(t);
    const server = await install(t, { dir, respond });
    assert.equal((await server.request()).status, status, name);
    if (written) {
      assert.deepEqual(await readJson(creditFile(dir)), {
        date: TODAY,
        used: 4,
      });
    } else {
      assert.equal(await exists(creditFile(dir)), false, name);
    }
  }
});

test('[beemaps-source-033] adds nothing for a request that the memory answers or that waits for one in flight', async (t) => {
  const dir = await tempDir(t);
  const hold = gate();
  const server = await install(t, {
    dir,
    respond: async () => {
      await hold.opened;
      return used(4);
    },
  });
  const first = server.request(boxAt(0));
  await waitFor(() => server.calls.length === 1);
  const second = server.request(boxAt(0));
  await sleep(20);
  hold.open();
  assert.equal((await second).body.cached, true);
  await first;
  assert.equal((await server.request(boxAt(0))).body.cached, true);
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 4 });
});

test('[beemaps-source-033] waits for the write of the credit file before it sends its answer', async (t) => {
  const dir = await tempDir(t);
  const hold = gate();
  const fs = fakeFs({ writeFile: () => hold.opened });
  const server = await install(t, { dir, fs, respond: () => used(3) });
  let done = false;
  const pending = server.request().then((answer) => {
    done = true;
    return answer;
  });
  await waitFor(() => fs.events.length === 1);
  await sleep(30);
  assert.equal(done, false);
  hold.open();
  assert.equal((await pending).status, 200);
  assert.deepEqual(fs.events, ['start 3', 'end 3']);
});

test('[beemaps-source-033] adds the amounts of two requests that end together and writes the sum, one write at a time', async (t) => {
  const dir = await tempDir(t);
  const fs = fakeFs();
  const gates = [gate(), gate()];
  const server = await install(t, {
    dir,
    fs,
    respond: async (url, init, n) => {
      await gates[n - 1].opened;
      return used(n === 1 ? 5 : 7);
    },
  });
  const first = server.request(boxAt(0));
  const second = server.request(boxAt(1));
  await waitFor(() => server.calls.length === 2);
  gates[0].open();
  gates[1].open();
  await Promise.all([first, second]);
  assert.equal(fs.overlap, 1);
  assert.deepEqual(fs.events, ['start 5', 'end 5', 'start 12', 'end 12']);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 12 });
});

test('[beemaps-source-033] books an answer that the plugin adds after midnight UTC on the next date', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 40 });
  const server = await install(t, {
    dir,
    respond: () => {
      t.mock.timers.tick(DAY - 12 * 3600 * 1000 + 1000);
      return used(7);
    },
  });
  assert.equal((await server.request()).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), {
    date: '2026-10-16',
    used: 7,
  });
});

test('[beemaps-source-033] reads the credits of an upstream document', () => {
  assert.equal(creditsOf({ creditsUsed: 99 }), 99);
  assert.equal(creditsOf({ creditsUsed: 0.5 }), 0.5);
  for (const document of [
    null,
    undefined,
    5,
    'text',
    [],
    {},
    { creditsUsed: 0 },
    { creditsUsed: -1 },
    { creditsUsed: -0.5 },
    { creditsUsed: '7' },
    { creditsUsed: null },
    { creditsUsed: Infinity },
    { creditsUsed: NaN },
  ]) {
    assert.equal(creditsOf(document), 0, JSON.stringify(document));
  }
});

test('[beemaps-source-035] continues from the used credits of today in the credit file', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 99.5 });
  const server = await install(t, { dir, respond: () => used(0.5) });
  assert.equal((await server.request()).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 100 });
});

test('[beemaps-source-035] starts at 0 for another date or no file and starts again when the date changes', async (t) => {
  const old = await tempDir(t);
  await seed(old, { date: '2026-10-14', used: 400 });
  const server = await install(t, { dir: old, respond: () => used(3) });
  assert.equal((await server.request()).status, 200);
  assert.deepEqual(await readJson(creditFile(old)), { date: TODAY, used: 3 });
  server.tick(DAY);
  assert.equal((await server.request(boxAt(1))).status, 200);
  assert.deepEqual(await readJson(creditFile(old)), {
    date: '2026-10-16',
    used: 3,
  });
  const none = await tempDir(t);
  const fresh = await install(t, { dir: none, respond: () => used(2) });
  assert.equal((await fresh.request()).status, 200);
  assert.deepEqual(await readJson(creditFile(none)), { date: TODAY, used: 2 });
});

test('[beemaps-source-035] answers 503 and sends no request for a credit file that is not usable', async (t) => {
  const bad = [
    'not json',
    '',
    'null',
    '[]',
    '{"used":5}',
    '{"date":"today","used":5}',
    '{"date":"2026-10-15"}',
    '{"date":"2026-10-15","used":-1}',
    '{"date":"2026-10-15","used":"5"}',
    '{"date":"2026-10-15","used":null}',
    '{"date":"2026-10-15","used":1e999}',
    '{"date":20261015,"used":5}',
    '{"date":["2026-10-15"],"used":5}',
    '{"date":"x2026-10-15","used":5}',
    '{"date":"2026-10-15x","used":5}',
    '{"date":"12026-10-15","used":5}',
    '{"date":"2026-10-155","used":5}',
    '{"date":"2026/10/15","used":5}',
    '{"date":"26-10-15","used":5}',
    '{"date":"2026-10-5","used":5}',
    '{"date":"abcd-ef-gh","used":5}',
    '{"date":"2026-1-15","used":5}',
    '{"date":"2026-100-15","used":5}',
  ];
  for (const text of bad) {
    const dir = await tempDir(t);
    await seed(dir, text);
    const server = await install(t, { dir, respond: () => used(1) });
    const answer = await server.request();
    assert.equal(answer.status, 503, text);
    assert.deepEqual(answer.body, { error: 'budget_unavailable' }, text);
    assert.equal(server.calls.length, 0, text);
    assert.deepEqual(server.lines, [], text);
    assert.equal(await exists(budgetFile(dir)), false, text);
  }
  const blocker = await tempDir(t);
  await fsp.writeFile(path.join(blocker, 'file'), 'x');
  const server = await install(t, {
    dir: path.join(blocker, 'file', 'x'),
    respond: () => used(1),
  });
  const answer = await server.request();
  assert.equal(answer.status, 503);
  assert.deepEqual(answer.body, { error: 'budget_unavailable' });
  assert.equal(server.calls.length, 0);
});

test('[beemaps-source-035] keeps the count in the plugin and answers when the credit file cannot be written', async (t) => {
  const dir = await tempDir(t);
  let writes = 0;
  const fs = fakeFs({
    writeFile: async () => {
      writes += 1;
      throw new Error('disk full');
    },
  });
  const server = await install(t, {
    dir,
    fs,
    env: { BEEMAPS_DAILY_CREDITS: '500' },
    respond: () => used(300),
  });
  const first = await server.request(boxAt(0));
  assert.equal(first.status, 200);
  const second = await server.request(boxAt(1));
  assert.equal(second.status, 200);
  assert.equal(writes, 2);
  assert.deepEqual(server.lines, [
    '[beemaps] credits file not written',
    '[beemaps] ok status=200 bytes=31 frames=0 ms=0 creditsUsed=300 creditsRemaining=none cost=none',
    '[beemaps] credits file not written',
    '[beemaps] ok status=200 bytes=31 frames=0 ms=0 creditsUsed=300 creditsRemaining=none cost=none',
  ]);
  const third = await server.request(boxAt(2));
  assert.equal(third.status, 429);
  assert.deepEqual(third.body, {
    error: 'credit_budget',
    used: 600,
    limit: 500,
  });
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-035] writes the credit file for one addition at a time, and the last addition gives the final text', async (t) => {
  const dir = await tempDir(t);
  const events = [];
  let running = 0;
  let overlap = 0;
  const delays = [30, 5, 15];
  const fs = {
    readFile: (...args) => fsp.readFile(...args),
    mkdir: (...args) => fsp.mkdir(...args),
    writeFile: async (file, text, encoding) => {
      running += 1;
      overlap = Math.max(overlap, running);
      const n = JSON.parse(text).used;
      events.push(`start ${n}`);
      await sleep(delays.shift() ?? 0);
      await fsp.writeFile(file, text, encoding);
      events.push(`end ${n}`);
      running -= 1;
    },
  };
  const credits = createCredits({
    dir,
    env: {},
    now: () => NOW,
    fs,
  });
  assert.deepEqual(await credits.check(), { ok: true });
  const writes = await Promise.all([
    credits.add(1),
    credits.add(2),
    credits.add(4),
  ]);
  assert.deepEqual(writes, [true, true, true]);
  assert.equal(overlap, 1);
  assert.deepEqual(events, [
    'start 1',
    'end 1',
    'start 3',
    'end 3',
    'start 7',
    'end 7',
  ]);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 7 });
});

test('[beemaps-source-034] passes at 499.5 credits and refuses at 500 without a request and without a change of either count', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 499.5 });
  const server = await install(t, { dir, respond: () => used(0.5) });
  assert.equal((await server.request(boxAt(0))).status, 200);
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 500 });
  const budgetBefore = await readJson(budgetFile(dir));
  const creditBefore = await readText(creditFile(dir));
  const refused = await server.request(boxAt(1));
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, {
    error: 'credit_budget',
    used: 500,
    limit: 500,
  });
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await readJson(budgetFile(dir)), budgetBefore);
  assert.equal(await readText(creditFile(dir)), creditBefore);
  assert.equal((await server.request(boxAt(0))).body.cached, true);
});

test('[beemaps-source-034] gives credit_budget when both limits are used and budget when only the request limit is used', async (t) => {
  const both = await tempDir(t);
  await seed(both, { date: TODAY, used: 10 });
  const server = await install(t, {
    dir: both,
    env: { BEEMAPS_DAILY_CREDITS: '10', BEEMAPS_DAILY_QUERIES: '1' },
    respond: () => used(1),
  });
  await fsp.writeFile(
    budgetFile(both),
    JSON.stringify({ date: TODAY, count: 1 }),
  );
  assert.equal((await server.request()).body.error, 'credit_budget');
  assert.equal(server.calls.length, 0);
  const one = await tempDir(t);
  await fsp.writeFile(
    budgetFile(one),
    JSON.stringify({ date: TODAY, count: 1 }),
  );
  const queries = await install(t, {
    dir: one,
    env: { BEEMAPS_DAILY_QUERIES: '1' },
    respond: () => used(1),
  });
  assert.equal((await queries.request()).body.error, 'budget');
});

test('[beemaps-source-034] counts 499 plus 99 as 598 and refuses the next area, and starts again on the next date', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 499 });
  const server = await install(t, { dir, respond: () => used(99) });
  assert.equal((await server.request(boxAt(0))).status, 200);
  const refused = await server.request(boxAt(1));
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, {
    error: 'credit_budget',
    used: 598,
    limit: 500,
  });
  server.tick(DAY);
  assert.equal((await server.request(boxAt(2))).status, 200);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-034] answers from the stored hold before the credit limit', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 499 });
  const gates = [gate(), gate()];
  const server = await install(t, {
    dir,
    respond: async (url, init, n) => {
      await gates[n - 1].opened;
      return n === 1 ? used(99) : new Response('x', { status: 401 });
    },
  });
  const first = server.request(boxAt(0));
  const second = server.request(boxAt(1));
  await waitFor(() => server.calls.length === 2);
  gates[0].open();
  await first;
  gates[1].open();
  await second;
  const third = await server.request(boxAt(2));
  assert.equal(third.status, 403);
  assert.equal(third.body.error, 'key_rejected');
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-035] answers 503 when the plugin cannot read the credit file for another reason than a missing file', async (t) => {
  const dir = await tempDir(t);
  const fs = {
    readFile: async () => {
      throw Object.assign(new Error('denied'), { code: 'EACCES' });
    },
    mkdir: (...args) => fsp.mkdir(...args),
    writeFile: (...args) => fsp.writeFile(...args),
  };
  const server = await install(t, { dir, fs, respond: () => used(1) });
  const answer = await server.request();
  assert.equal(answer.status, 503);
  assert.deepEqual(answer.body, { error: 'budget_unavailable' });
  assert.equal(server.calls.length, 0);
  assert.equal(await exists(budgetFile(dir)), false);
  assert.deepEqual(server.lines, []);
});

test('[beemaps-source-035] accepts a saved count of 0 and of 0.5, a count of an earlier date and a count of a later date', async (t) => {
  for (const [value, date, expected] of [
    [0, TODAY, 2],
    [0.5, TODAY, 2.5],
    [400, '2026-10-16', 2],
    [400, '2026-10-14', 2],
  ]) {
    const dir = await tempDir(t);
    await seed(dir, { date, used: value });
    const server = await install(t, { dir, respond: () => used(2) });
    assert.equal((await server.request()).status, 200);
    assert.deepEqual(
      await readJson(creditFile(dir)),
      { date: TODAY, used: expected },
      `${value} ${date}`,
    );
  }
});

test('[beemaps-source-035] reads the credit file once for two requests that arrive together', async (t) => {
  const dir = await tempDir(t);
  let reads = 0;
  const fs = {
    readFile: (...args) => {
      reads += 1;
      return fsp.readFile(...args);
    },
    mkdir: (...args) => fsp.mkdir(...args),
    writeFile: (...args) => fsp.writeFile(...args),
  };
  const server = await install(t, { dir, fs, respond: () => used(1) });
  await Promise.all([server.request(boxAt(0)), server.request(boxAt(1))]);
  assert.equal(reads, 1);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 2 });
});

test('[beemaps-source-035] passes the next request after a person repairs an unusable credit file', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, 'not json');
  const server = await install(t, { dir, respond: () => used(1) });
  assert.equal((await server.request(boxAt(0))).status, 503);
  await seed(dir, { date: TODAY, used: 5 });
  assert.equal((await server.request(boxAt(1))).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 6 });
  const blocker = await tempDir(t);
  await fsp.writeFile(path.join(blocker, 'file'), 'x');
  const credits = createCredits({
    dir: path.join(blocker, 'file', 'x'),
    env: {},
    now: () => NOW,
  });
  assert.deepEqual(await credits.check(), { ok: false, reason: 'unavailable' });
});

test('[beemaps-source-033] writes the credit file into a folder that is not there yet', async (t) => {
  const dir = path.join(await tempDir(t), 'new', 'sub');
  const credits = createCredits({ dir, env: {}, now: () => NOW });
  assert.deepEqual(await credits.check(), { ok: true });
  assert.equal(await credits.add(1), true);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 1 });
});

test('[beemaps-source-033] books an answer on the date of the last second before midnight UTC', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 40 });
  const server = await install(t, {
    dir,
    respond: () => {
      t.mock.timers.tick(12 * 3600 * 1000 - 1000);
      return used(7);
    },
  });
  assert.equal((await server.request()).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 47 });
});

test('[beemaps-source-033] takes the date of an addition from the option now', async (t) => {
  const dir = await tempDir(t);
  const server = await install(t, {
    dir,
    now: () => NOW + DAY,
    respond: () => used(3),
  });
  assert.equal((await server.request()).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), {
    date: '2026-10-16',
    used: 3,
  });
});

test('[beemaps-source-034] refuses each request for another area while the credit limit is used, with no hold', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 500 });
  const server = await install(t, { dir, respond: () => used(1) });
  for (const n of [0, 1, 2]) {
    const answer = await server.request(boxAt(n));
    assert.equal(answer.status, 429);
    assert.deepEqual(answer.body, {
      error: 'credit_budget',
      used: 500,
      limit: 500,
    });
  }
  assert.equal(server.calls.length, 0);
});

test('[beemaps-source-034] writes a count that is not a whole number into the refusal and the limit that the environment gives', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 500.5 });
  const server = await install(t, { dir, respond: () => used(1) });
  assert.deepEqual((await server.request()).body, {
    error: 'credit_budget',
    used: 500.5,
    limit: 500,
  });
  const other = await tempDir(t);
  await seed(other, { date: TODAY, used: 75 });
  const small = await install(t, {
    dir: other,
    env: { BEEMAPS_DAILY_CREDITS: '75' },
    respond: () => used(1),
  });
  const answer = await small.request();
  assert.equal(answer.status, 429);
  assert.deepEqual(answer.body, {
    error: 'credit_budget',
    used: 75,
    limit: 75,
  });
  assert.equal(small.calls.length, 0);
});

test('[beemaps-source-034] gives the shape of a refusal and of an unusable file when the plugin checks the limit', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: TODAY, used: 500 });
  const credits = createCredits({ dir, env: {}, now: () => NOW });
  assert.deepEqual(await credits.check(), {
    ok: false,
    reason: 'limit',
    used: 500,
    limit: 500,
  });
});

test('[beemaps-source-035] keeps the credits of the new date after the date changes while the plugin runs', async (t) => {
  const dir = await tempDir(t);
  await seed(dir, { date: '2026-10-14', used: 400 });
  const server = await install(t, { dir, respond: () => used(300) });
  assert.equal((await server.request(boxAt(0))).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 300 });
  assert.equal((await server.request(boxAt(1))).status, 200);
  assert.deepEqual(await readJson(creditFile(dir)), { date: TODAY, used: 600 });
  const refused = await server.request(boxAt(2));
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, {
    error: 'credit_budget',
    used: 600,
    limit: 500,
  });
});
