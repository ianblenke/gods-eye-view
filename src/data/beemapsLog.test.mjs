import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fsp } from 'node:fs';
import { Readable } from 'node:stream';
import os from 'node:os';
import path from 'node:path';
import { beemapsProxy } from '../../server/providers/beemaps.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const KEY = 'fixture-key-Z9y8';
const HOST = '127.0.0.1:5173';
const FRAMES = '/api/beemaps/frames';
const GOOD_HEADERS = {
  host: HOST,
  origin: `http://${HOST}`,
  'content-type': 'application/json',
};
const JSON_HEADERS = { 'content-type': 'application/json' };

/** A box of the same size at a place of its own, so each one has its own memory entry. */
const boxAt = (n) => [10 + n * 0.1, 60, 10.02 + n * 0.1, 60.01];
const frame = (n) => ({
  timestamp: new Date(Date.UTC(2026, 3, 6, 1, 7, n)).toISOString(),
  sequence: 'CANARY-sequence',
  position: { lat: 31.337313 + n / 1e6, lon: 4.242424 + n / 1e6 },
});
/** The text of a JSON document padded with a `note` to an exact number of bytes. */
function sized(doc, size) {
  const base = JSON.stringify({ ...doc, note: '' });
  const pad = size - Buffer.byteLength(base);
  assert.equal(pad >= 0, true);
  return JSON.stringify({ ...doc, note: 'x'.repeat(pad) });
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** Wait until the check is true. Real timers run, because only Date is mocked. */
async function waitFor(check) {
  for (let i = 0; i < 400 && !check(); i++) await sleep(5);
  assert.equal(check(), true, 'the wait ended before the check was true');
}
const ok = (text) => new Response(text, { status: 200, headers: JSON_HEADERS });
/** A good answer whose body moves the clock by `ms` when the plugin reads it. */
function slowBody(t, text, ms) {
  const stream = new ReadableStream(
    {
      pull(controller) {
        t.mock.timers.tick(ms);
        controller.enqueue(new TextEncoder().encode(text));
        controller.close();
      },
    },
    { highWaterMark: 0 },
  );
  return new Response(stream, { status: 200, headers: JSON_HEADERS });
}

async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'gev-beemaps-log-'));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}

/** Install the plugin on a fake middleware list. Dates are mocked, requests are fake. */
async function install(
  t,
  { env = {}, respond, log = true, cacheDir, dir: ownDir } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const dir = ownDir ?? (await tempDir(t));
  const calls = [];
  const lines = [];
  const timers = [];
  const plugin = beemapsProxy({
    env: { BEEMAPS_API_KEY: KEY, ...env },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return respond(url, init, calls.length);
    },
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: () => {},
    cacheDir: cacheDir ?? dir,
    ...(log ? { log: (line) => lines.push(line) } : {}),
  });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (route, handler) => routes.set(route, handler) },
  });

  async function request(bbox = boxAt(0), extra = {}) {
    const text = JSON.stringify({ bbox, ...extra });
    const req = Object.assign(Readable.from([Buffer.from(text)]), {
      method: 'POST',
      url: '/',
      headers: GOOD_HEADERS,
      socket: { remoteAddress: '127.0.0.1' },
    });
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
    return {
      status: res.statusCode,
      text: res.text,
      body: JSON.parse(res.text),
    };
  }
  return { request, calls, lines, timers, dir };
}

/** One request to a fresh plugin: the lines that it wrote and its answer. */
async function once(t, respond, { env, extra } = {}) {
  const server = await install(t, { respond, env });
  const answer = await server.request(boxAt(0), extra);
  return { lines: server.lines, answer, calls: server.calls };
}

/** A frame with the fields that the route reads and no more. */
const tiny = (n) => ({
  timestamp: frame(n).timestamp,
  position: frame(n).position,
});
const GOOD_DOC = {
  frames: [tiny(1), tiny(2), tiny(3), {}, 7],
  creditsUsed: 99,
  creditsRemaining: -0.25,
  cost: 0,
  notEnoughCredits: true,
};

test('[beemaps-source-029] writes one ok line with the status, the size, the frame count, the time and the credits', async (t) => {
  const text = sized(GOOD_DOC, 412);
  const server = await install(t, {
    respond: () => {
      t.mock.timers.tick(2000);
      return slowBody(t, text, 826);
    },
  });
  const answer = await server.request(boxAt(0), { limit: 1 });
  assert.equal(answer.status, 200);
  assert.equal(answer.body.frames.length, 1);
  assert.equal(answer.body.total, 3);
  assert.deepEqual(server.lines, [
    '[beemaps] ok status=200 bytes=412 frames=5 ms=2826 creditsUsed=99 creditsRemaining=-0.25 cost=0 notEnoughCredits=true',
  ]);
});

test('[beemaps-source-029] writes the flag only when it is exactly true', async (t) => {
  for (const flag of [false, 'true', 1, undefined]) {
    const doc = {
      frames: [],
      creditsUsed: 99,
      creditsRemaining: 5,
      cost: 0,
      notEnoughCredits: flag,
    };
    const { lines } = await once(t, () => ok(JSON.stringify(doc)));
    assert.equal(lines.length, 1);
    assert.equal(
      lines[0].endsWith(' cost=0'),
      true,
      `${String(flag)}: ${lines[0]}`,
    );
  }
});

test('[beemaps-source-029] writes the text of a finite credit number, also a negative one, and none for anything else', async (t) => {
  const rows = [
    [
      '{"frames":[],"creditsUsed":"7","creditsRemaining":null,"cost":1e999}',
      'creditsUsed=none creditsRemaining=none cost=none',
    ],
    [
      '{"frames":[],"creditsUsed":-5,"creditsRemaining":-0.25,"cost":0.5}',
      'creditsUsed=-5 creditsRemaining=-0.25 cost=0.5',
    ],
    ['{"frames":[]}', 'creditsUsed=none creditsRemaining=none cost=none'],
    [
      '{"frames":[],"creditsUsed":[],"creditsRemaining":true,"cost":{}}',
      'creditsUsed=none creditsRemaining=none cost=none',
    ],
    [
      '{"frames":[],"creditsUsed":1e999,"creditsRemaining":"1","cost":null}',
      'creditsUsed=none creditsRemaining=none cost=none',
    ],
  ];
  for (const [text, tail] of rows) {
    const { lines } = await once(t, () => ok(text));
    assert.equal(lines.length, 1);
    assert.equal(lines[0].endsWith(` ${tail}`), true, `${text} ${lines[0]}`);
  }
});

test('[beemaps-source-029] writes the status of any good answer as it is', async (t) => {
  const { lines } = await once(
    t,
    () => new Response('{"frames":[]}', { status: 206, headers: JSON_HEADERS }),
  );
  assert.equal(lines.length, 1);
  assert.equal(lines[0].startsWith('[beemaps] ok status=206 bytes=13 '), true);
});

test('[beemaps-source-029] counts the bytes of the body in UTF-8 and the frames as the length of the list', async (t) => {
  const base = JSON.stringify({ frames: [], note: 'é' });
  const text = JSON.stringify({
    frames: [],
    note: `é${'x'.repeat(411 - base.length)}`,
  });
  assert.equal(text.length, 411);
  assert.equal(Buffer.byteLength(text), 412);
  const { lines } = await once(t, () => ok(text));
  assert.equal(
    lines[0].startsWith('[beemaps] ok status=200 bytes=412 frames=0 '),
    true,
    lines[0],
  );
});

test('[beemaps-source-029] accepts a body of exactly 4194304 bytes and writes its size', async (t) => {
  const text = sized({ frames: [] }, 4194304);
  const { lines, answer } = await once(t, () => ok(text));
  assert.equal(answer.status, 200);
  assert.deepEqual(lines, [
    '[beemaps] ok status=200 bytes=4194304 frames=0 ms=0 creditsUsed=none creditsRemaining=none cost=none',
  ]);
});

const FAILURES = [
  [
    'the status 401',
    () => new Response('x', { status: 401 }),
    '[beemaps] failed kind=key_rejected status=401 bytes=none ms=7',
  ],
  [
    'the status 403',
    () => new Response('x', { status: 403 }),
    '[beemaps] failed kind=key_rejected status=403 bytes=none ms=7',
  ],
  [
    'the status 402',
    () => new Response('x', { status: 402 }),
    '[beemaps] failed kind=no_credit status=402 bytes=none ms=7',
  ],
  [
    'the status 429',
    () => new Response('x', { status: 429, headers: { 'Retry-After': '30' } }),
    '[beemaps] failed kind=upstream_rate_limit status=429 bytes=none ms=7',
  ],
  [
    'the status 500',
    () => new Response('x', { status: 500 }),
    '[beemaps] failed kind=upstream_failed status=500 bytes=none ms=7',
  ],
  [
    'a thrown error',
    () => {
      throw new Error(`down ${KEY} https://beemaps.com/api/developer/x`);
    },
    '[beemaps] failed kind=upstream_failed status=none bytes=none ms=7',
  ],
  [
    'the body not json',
    () => ok('not json'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=8 ms=7',
  ],
  [
    'a body of 4194305 bytes',
    () => ok(sized({ frames: [] }, 4194305)),
    '[beemaps] failed kind=bad_upstream status=200 bytes=over-limit ms=7',
  ],
  [
    'a JSON body with frames that is a number',
    () => ok('{"frames":5}'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=12 ms=7 creditsUsed=none',
  ],
  [
    'a JSON body with creditsUsed 4',
    () => ok('{"frames":5,"creditsUsed":4}'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=28 ms=7 creditsUsed=4',
  ],
  [
    'a JSON body with creditsUsed -5',
    () => ok('{"frames":5,"creditsUsed":-5}'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=29 ms=7 creditsUsed=-5',
  ],
  [
    'a JSON body with creditsUsed "7"',
    () => ok('{"frames":5,"creditsUsed":"7"}'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=30 ms=7 creditsUsed=none',
  ],
  [
    'a JSON body with creditsUsed 1e999',
    () => ok('{"frames":5,"creditsUsed":1e999}'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=32 ms=7 creditsUsed=none',
  ],
  [
    'the JSON body null',
    () => ok('null'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=4 ms=7 creditsUsed=none',
  ],
  [
    'the JSON body []',
    () => ok('[]'),
    '[beemaps] failed kind=bad_upstream status=200 bytes=2 ms=7 creditsUsed=none',
  ],
];

test('[beemaps-source-030] writes one failed line for each way that the upstream request fails', async (t) => {
  for (const [name, answerWith, line] of FAILURES) {
    const { lines } = await once(t, () => {
      t.mock.timers.tick(7);
      return answerWith();
    });
    assert.deepEqual(lines, [line], name);
  }
});

test('[beemaps-source-030] writes the same line for a timeout before the headers as for a thrown error', async (t) => {
  const server = await install(t, {
    respond: (url, init) =>
      new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () =>
          reject(new DOMException('The operation was aborted.', 'AbortError')),
        );
      }),
  });
  const pending = server.request(boxAt(0));
  await waitFor(() => server.calls.length === 1);
  t.mock.timers.tick(7);
  server.timers[0].fn();
  const answer = await pending;
  assert.equal(answer.status, 502);
  assert.deepEqual(server.lines, [
    '[beemaps] failed kind=upstream_failed status=none bytes=none ms=7',
  ]);
});

test('[beemaps-source-030] writes the status 200 for a timeout while the plugin reads the body', async (t) => {
  let waiting = false;
  const stream = new ReadableStream(
    {
      pull() {
        waiting = true;
        return new Promise(() => {});
      },
    },
    { highWaterMark: 0 },
  );
  const server = await install(t, {
    respond: () => new Response(stream, { status: 200, headers: JSON_HEADERS }),
  });
  const pending = server.request(boxAt(0));
  await waitFor(() => waiting);
  t.mock.timers.tick(7);
  server.timers[0].fn();
  const answer = await pending;
  assert.equal(answer.status, 502);
  assert.deepEqual(server.lines, [
    '[beemaps] failed kind=upstream_failed status=200 bytes=none ms=7',
  ]);
});

test('[beemaps-source-031] keeps the key, the address, the frames and the text of the body out of every line', async (t) => {
  const CANARY = 'CANARY-body-text';
  const lines = [];
  const doc = {
    frames: [frame(1), frame(2)],
    creditsUsed: 4,
    creditsRemaining: 10,
    cost: 0,
    note: CANARY,
  };
  const good = await once(t, () => ok(JSON.stringify(doc)));
  lines.push(...good.lines);
  const ids = good.answer.body.frames.map((entry) => entry.id);
  assert.equal(ids.length, 2);
  for (const [, answerWith] of FAILURES) {
    const { lines: failed } = await once(t, () => {
      const response = answerWith();
      return response;
    });
    lines.push(...failed);
  }
  const wrong = await once(t, () =>
    ok(JSON.stringify({ frames: 5, creditsUsed: 4, note: CANARY })),
  );
  lines.push(...wrong.lines);
  assert.equal(lines.length, 2 + FAILURES.length);
  const forbidden = [
    KEY,
    'beemaps.com',
    'http',
    CANARY,
    '31.337',
    '4.2424',
    ...ids,
    'CANARY-sequence',
  ];
  for (const line of lines) {
    for (const text of forbidden) {
      assert.equal(line.includes(text), false, `${text} in ${line}`);
    }
    assert.equal(line.startsWith('[beemaps] '), true);
  }
});

test('[beemaps-source-031] writes no line for a request that the plugin does not send', async (t) => {
  const answerGood = () => ok('{"frames":[],"creditsUsed":1}');
  // Memory: the same area again gets the stored answer.
  const memory = await install(t, { respond: answerGood });
  await memory.request(boxAt(0));
  assert.equal(memory.lines.length, 1);
  assert.equal((await memory.request(boxAt(0))).body.cached, true);
  assert.equal(memory.lines.length, 1);
  assert.equal(memory.calls.length, 1);
  // A request that waits for one in flight.
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const shared = await install(t, {
    respond: async () => {
      await gate;
      return answerGood();
    },
  });
  const first = shared.request(boxAt(0));
  await waitFor(() => shared.calls.length === 1);
  const second = shared.request(boxAt(0));
  await sleep(20);
  release();
  assert.equal((await second).body.cached, true);
  await first;
  assert.equal(shared.lines.length, 1);
  assert.equal(shared.calls.length, 1);
  // The hold after a refusal of the key.
  const held = await install(t, {
    respond: () => new Response('x', { status: 401 }),
  });
  await held.request(boxAt(0));
  assert.equal(held.lines.length, 1);
  assert.equal((await held.request(boxAt(1))).status, 403);
  assert.equal(held.lines.length, 1);
  assert.equal(held.calls.length, 1);
  // The daily request limit.
  const daily = await install(t, {
    env: { BEEMAPS_DAILY_QUERIES: '1' },
    respond: answerGood,
  });
  await daily.request(boxAt(0));
  assert.equal((await daily.request(boxAt(1))).body.error, 'budget');
  assert.equal(daily.lines.length, 1);
  // The credit limit.
  const credit = await install(t, {
    env: { BEEMAPS_DAILY_CREDITS: '1' },
    respond: answerGood,
  });
  await credit.request(boxAt(0));
  assert.equal((await credit.request(boxAt(1))).body.error, 'credit_budget');
  assert.equal(credit.lines.length, 1);
  // No key.
  const keyless = await install(t, {
    env: { BEEMAPS_API_KEY: '' },
    respond: answerGood,
  });
  assert.equal((await keyless.request(boxAt(0))).status, 503);
  assert.deepEqual(keyless.lines, []);
  assert.equal(keyless.calls.length, 0);
});

test('[beemaps-source-031] writes no line when a file of the budget is not usable', async (t) => {
  for (const name of ['budget.json', 'credits.json']) {
    const dir = await tempDir(t);
    await fsp.writeFile(path.join(dir, name), 'not json');
    const server = await install(t, {
      dir,
      respond: () => ok('{"frames":[]}'),
    });
    const answer = await server.request(boxAt(0));
    assert.equal(answer.status, 503);
    assert.equal(answer.body.error, 'budget_unavailable');
    assert.deepEqual(server.lines, []);
    assert.equal(server.calls.length, 0);
  }
});

test('[beemaps-source-031] writes the same lines with console.log when the plugin gets no option log', async (t) => {
  const written = [];
  t.mock.method(console, 'log', (line) => written.push(line));
  const server = await install(t, {
    log: false,
    respond: () => ok('{"frames":[],"creditsUsed":2,"cost":0}'),
  });
  await server.request(boxAt(0));
  assert.deepEqual(written, [
    '[beemaps] ok status=200 bytes=38 frames=0 ms=0 creditsUsed=2 creditsRemaining=none cost=0',
  ]);
});
