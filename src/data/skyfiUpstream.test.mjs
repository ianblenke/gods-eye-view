import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { skyfiProxy } from '../../server/providers/skyfi.js';
import { runSearch } from '../../server/providers/skyfi/upstream.js';

const NOW = Date.UTC(2026, 9, 22, 12, 0, 0);
const KEY = 'fixture-key-Q7';
const SEARCH = 'https://app.skyfi.com/platform-api/archives';
const BOX = [-82.5, 27.9, -82.4, 28];
const DATES = { start: '2026-10-01', end: '2026-10-20' };
const json = (status, value, headers = {}) =>
  new Response(
    [204, 205, 304].includes(status) ? null : JSON.stringify(value),
    { status, headers: { 'content-type': 'application/json', ...headers } },
  );
const page = (archives = [{ archiveId: 'a1' }]) =>
  json(200, { archives, nextPage: null, total: null });

/** Run the search with a fake fetch; the timers record their calls. */
async function run({
  respond,
  bbox = BOX,
  start = DATES.start,
  end = DATES.end,
} = {}) {
  const calls = [];
  const timers = [];
  const cleared = [];
  const events = [];
  const result = await runSearch({
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init });
      events.push('fetch');
      return respond ? respond(String(url), init, calls.length) : page();
    },
    key: KEY,
    bbox,
    start,
    end,
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      events.push(`timer ${ms}`);
      return timers.length;
    },
    clearTimer: (id) => {
      cleared.push(id);
      events.push(`clear ${id}`);
    },
  });
  return { result, calls, timers, cleared, events };
}

test('[skyfi-source-009] sends one search with the fixed URL, body, headers and option', async () => {
  const { result, calls } = await run();
  assert.equal(result.ok, true);
  assert.equal(result.requests, 1);
  assert.equal(calls.length, 1);
  const { url, init } = calls[0];
  assert.equal(url, 'https://app.skyfi.com/platform-api/archives');
  assert.equal(init.method, 'POST');
  assert.equal(init.redirect, 'error');
  assert.ok(init.signal instanceof AbortSignal);
  assert.deepEqual(Object.keys(init).sort(), [
    'body',
    'headers',
    'method',
    'redirect',
    'signal',
  ]);
  assert.deepEqual(init.headers, {
    'X-Skyfi-Api-Key': 'fixture-key-Q7',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  assert.equal(typeof init.body, 'string');
  const body = JSON.parse(init.body);
  assert.deepEqual(Object.keys(body), [
    'aoi',
    'fromDate',
    'toDate',
    'pageSize',
  ]);
  assert.deepEqual(body, {
    aoi: 'POLYGON ((-82.500000 27.900000, -82.400000 27.900000, -82.400000 28.000000, -82.500000 28.000000, -82.500000 27.900000))',
    fromDate: '2026-10-01T00:00:00+00:00',
    toDate: '2026-10-20T23:59:59+00:00',
    pageSize: 50,
  });
  assert.deepEqual(result.page, {
    archives: [{ archiveId: 'a1' }],
    nextPage: null,
    total: null,
  });
});

test('[skyfi-source-009] writes each number of the area with 6 digits after the decimal point and no exponent', async () => {
  for (const [bbox, aoi] of [
    [
      [-82.701264, 27.735005, -82.213136, 28.166195],
      'POLYGON ((-82.701264 27.735005, -82.213136 27.735005, -82.213136 28.166195, -82.701264 28.166195, -82.701264 27.735005))',
    ],
    [
      [0.0000001, 0, 1, 1],
      'POLYGON ((0.000000 0.000000, 1.000000 0.000000, 1.000000 1.000000, 0.000000 1.000000, 0.000000 0.000000))',
    ],
    [
      [0, 0, 0.0000009, 1],
      'POLYGON ((0.000000 0.000000, 0.000001 0.000000, 0.000001 1.000000, 0.000000 1.000000, 0.000000 0.000000))',
    ],
    [
      [-0.0000001, 0, 1, 1],
      'POLYGON ((-0.000000 0.000000, 1.000000 0.000000, 1.000000 1.000000, -0.000000 1.000000, -0.000000 0.000000))',
    ],
  ]) {
    const { calls } = await run({ bbox });
    assert.equal(JSON.parse(calls[0].init.body).aoi, aoi);
  }
});

test('[skyfi-source-009] sends the dates as the start and the end of the UTC days', async () => {
  for (const [start, end] of [
    ['2026-02-01', '2026-02-28'],
    ['2026-12-01', '2026-12-31'],
    ['2026-04-30', '2026-04-30'],
  ]) {
    const { calls } = await run({ start, end });
    const body = JSON.parse(calls[0].init.body);
    assert.equal(body.fromDate, `${start}T00:00:00+00:00`);
    assert.equal(body.toDate, `${end}T23:59:59+00:00`);
  }
});

test('[skyfi-source-016] starts a timer of 15000 ms before the search request and clears it after the body', async () => {
  const { events, timers } = await run();
  assert.deepEqual(events, ['timer 15000', 'fetch', 'clear 1']);
  assert.equal(timers.length, 1);
});

test('[skyfi-source-016] clears the timer after the body, not before it', async () => {
  const events = [];
  await runSearch({
    fetchImpl: async () => {
      const text = JSON.stringify({ archives: [] });
      const body = new ReadableStream(
        {
          pull(controller) {
            events.push('body read');
            controller.enqueue(new TextEncoder().encode(text));
            controller.close();
          },
        },
        { highWaterMark: 0 },
      );
      return new Response(body, { status: 200 });
    },
    key: KEY,
    bbox: BOX,
    ...DATES,
    setTimer: () => 1,
    clearTimer: () => events.push('clear'),
  });
  assert.deepEqual(events, ['body read', 'clear']);
});

test('[skyfi-source-016] stops the request when the time limit ends, and gives upstream_failed', async () => {
  const timers = [];
  const done = runSearch({
    fetchImpl: (url, init) =>
      new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(init.signal.reason));
      }),
    key: KEY,
    bbox: BOX,
    ...DATES,
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return 1;
    },
    clearTimer: () => {},
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 15000);
  timers[0].fn();
  const result = await done;
  assert.deepEqual(result, { ok: false, kind: 'upstream_failed', requests: 1 });
});

test('[skyfi-source-016] names the failure of each status that is not 200, and reads no body of such an answer', async () => {
  for (const status of [201, 202, 204, 302, 400, 404, 422, 500, 503]) {
    let read = false;
    const body = [204, 304].includes(status)
      ? null
      : new ReadableStream(
          {
            pull(controller) {
              read = true;
              controller.enqueue(new TextEncoder().encode('{}'));
              controller.close();
            },
          },
          { highWaterMark: 0 },
        );
    const { result, calls } = await run({
      respond: () => new Response(body, { status }),
    });
    assert.deepEqual(
      result,
      { ok: false, kind: 'upstream_failed', requests: 1 },
      String(status),
    );
    assert.equal(read, false, String(status));
    assert.equal(calls.length, 1);
  }
  for (const status of [401, 403]) {
    const { result } = await run({ respond: () => json(status, {}) });
    assert.deepEqual(result, { ok: false, kind: 'key_rejected', requests: 1 });
  }
});

test('[skyfi-source-016] reads Retry-After of an answer 429: digits from 1 to 600, 600 for more, else 60', async () => {
  for (const [header, seconds] of [
    ['1', 1],
    ['42', 42],
    ['600', 600],
    ['601', 600],
    ['86400', 600],
    ['0', 60],
    ['00', 60],
    ['-5', 60],
    ['1.5', 60],
    ['abc', 60],
    ['Wed, 21 Oct 2026 07:28:00 GMT', 60],
    [undefined, 60],
  ]) {
    const headers = header === undefined ? {} : { 'retry-after': header };
    const { result } = await run({ respond: () => json(429, {}, headers) });
    assert.deepEqual(
      result,
      {
        ok: false,
        kind: 'upstream_rate_limit',
        retryAfter: seconds,
        requests: 1,
      },
      String(header),
    );
  }
});

test('[skyfi-source-016] gives upstream_failed for a network error and a redirect', async () => {
  for (const error of [
    new TypeError('fetch failed'),
    new TypeError('redirect mode is set to error'),
  ]) {
    const { result } = await run({
      respond: () => {
        throw error;
      },
    });
    assert.deepEqual(result, {
      ok: false,
      kind: 'upstream_failed',
      requests: 1,
    });
  }
});

test('[skyfi-source-016] gives bad_upstream for a body that is not JSON, a body over 4194304 bytes, and a page of the wrong shape', async () => {
  const over = new Response('x'.repeat(4194305), { status: 200 });
  const shapes = [
    () => new Response('not json', { status: 200 }),
    () => over,
    () => json(200, null),
    () => json(200, []),
    () => json(200, 'x'),
    () => json(200, 5),
    () => json(200, {}),
    () => json(200, { archives: {} }),
    () => json(200, { archives: 'x' }),
    () => json(200, { archives: null }),
    () => json(200, { features: [] }),
  ];
  for (const [n, respond] of shapes.entries()) {
    const { result, calls } = await run({ respond });
    assert.deepEqual(
      result,
      { ok: false, kind: 'bad_upstream', requests: 1 },
      String(n),
    );
    assert.equal(calls.length, 1);
  }
});

test('[skyfi-source-016] reads a body of exactly 4194304 bytes, and refuses a valid page of 4194305 bytes', async () => {
  const text = JSON.stringify({ archives: [] });
  const exact = text.slice(0, -1) + ' '.repeat(4194304 - text.length) + '}';
  assert.equal(Buffer.byteLength(exact), 4194304);
  const { result } = await run({
    respond: () => new Response(exact, { status: 200 }),
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.page, { archives: [] });
  const over = text.slice(0, -1) + ' '.repeat(4194305 - text.length) + '}';
  assert.equal(Buffer.byteLength(over), 4194305);
  const refused = await run({
    respond: () => new Response(over, { status: 200 }),
  });
  assert.deepEqual(refused.result, {
    ok: false,
    kind: 'bad_upstream',
    requests: 1,
  });
});

test('[skyfi-source-016] gives upstream_failed when the body cannot be read', async () => {
  const { result } = await run({
    respond: () =>
      new Response(
        new ReadableStream({
          pull(controller) {
            controller.error(new Error('reset'));
          },
        }),
        { status: 200 },
      ),
  });
  assert.deepEqual(result, { ok: false, kind: 'upstream_failed', requests: 1 });
});

/** Install the scenes plugin with a fake fetch and send one scenes request. */
async function routeAnswer(t, respond) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const calls = [];
  const plugin = skyfiProxy({
    env: { SKYFI_API_KEY: KEY },
    fetchImpl: async (url, init) => {
      calls.push(String(url));
      return respond(init);
    },
    now: () => NOW,
    setTimer: () => 1,
    clearTimer: () => {},
    log: () => {},
  });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (route, handler) => routes.set(route, handler) },
  });
  const text = JSON.stringify({ bbox: BOX, ...DATES });
  const req = Object.assign(Readable.from([Buffer.from(text)]), {
    method: 'POST',
    url: '/',
    headers: {
      host: '127.0.0.1:5173',
      origin: 'http://127.0.0.1:5173',
      'content-type': 'application/json',
    },
    socket: { remoteAddress: '127.0.0.1', encrypted: false },
  });
  const res = {
    headers: {},
    writeHead(code, values) {
      this.statusCode = code;
      for (const [name, value] of Object.entries(values ?? {}))
        this.headers[name.toLowerCase()] = value;
    },
    end(chunk) {
      this.text = chunk;
    },
  };
  await routes.get('/api/skyfi/scenes')(req, res, () => {});
  return {
    status: res.statusCode,
    headers: res.headers,
    body: JSON.parse(res.text),
    calls,
  };
}

test('[skyfi-source-016] gives the named answer of the scenes route for each failure', async (t) => {
  const cases = [
    [() => json(401, {}), 403, { error: 'key_rejected', keyRejected: true }],
    [() => json(403, {}), 403, { error: 'key_rejected', keyRejected: true }],
    [() => json(500, {}), 502, { error: 'upstream_failed' }],
    [() => json(422, {}), 502, { error: 'upstream_failed' }],
    [() => json(302, {}), 502, { error: 'upstream_failed' }],
    [
      () => new Response('not json', { status: 200 }),
      502,
      { error: 'bad_upstream' },
    ],
    [() => json(200, { archives: 1 }), 502, { error: 'bad_upstream' }],
  ];
  for (const [n, [respond, status, body]] of cases.entries()) {
    const answer = await routeAnswer(t, respond);
    assert.equal(answer.status, status, String(n));
    assert.deepEqual(answer.body, body, String(n));
  }
  const limited = await routeAnswer(t, () =>
    json(429, {}, { 'retry-after': '42' }),
  );
  assert.equal(limited.status, 429);
  assert.deepEqual(limited.body, {
    error: 'upstream_rate_limit',
    retryAfter: 42,
  });
  assert.equal(limited.headers['retry-after'], '42');
  const late = await routeAnswer(t, () =>
    json(429, {}, { 'retry-after': '700' }),
  );
  assert.deepEqual(late.body, {
    error: 'upstream_rate_limit',
    retryAfter: 600,
  });
  assert.equal(late.headers['retry-after'], '600');
  assert.deepEqual(late.calls, [SEARCH]);
  assert.equal(JSON.stringify(late.body).includes('a1'), false);
});
