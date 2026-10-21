import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { skywatchProxy } from '../../server/providers/skywatch.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 9, 21, 12, 0, 0);
const KEY = 'fixture-key-Q7';
const HOST = '127.0.0.1:5173';
const SEARCH = 'https://api.skywatch.co/earthcache/archive/search';
const BOX = [10, 60, 10.02, 60.01];
const DATES = { start: '2026-10-01', end: '2026-10-20' };
const SCENES = '/api/skywatch/scenes';
const STATUS = '/api/skywatch/status';
const RING = [
  [10, 60],
  [10.02, 60],
  [10.02, 60.01],
  [10, 60.01],
  [10, 60],
];

const row = (n) => ({
  id: `scene-${n}`,
  location: { type: 'Polygon', coordinates: [RING] },
  start_time: new Date(Date.UTC(2026, 9, 1 + n)).toISOString(),
  thumbnail_uri: `https://thumbs.example.invalid/${n}.png?sig=CANARY-uri`,
  preview_uri: `https://previews.example.invalid/${n}.png?sig=CANARY-uri`,
  source: 'Example operator',
  cost: 'Upgrade your plan for price',
});
const json = (status, value, headers = {}) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
const startedAnswer = () => json(200, { data: { id: 'CANARY-search-id' } });
const resultsAnswer = (count = 3) =>
  json(200, {
    data: Array.from({ length: count }, (_, i) => row(i)),
    pagination: { per_page: 50, cursor: {}, total: count, count },
  });
const pendingAnswer = () => json(202, { status: { message: 'in progress' } });
const GOOD_HEADERS = {
  host: HOST,
  origin: `http://${HOST}`,
  'content-type': 'application/json',
};
const boxAt = (n) => [10 + n * 0.1, 60, 10.02 + n * 0.1, 60.01];

/**
 * Install the plugin on a fake middleware list. Date is mocked for the rate
 * limit; the clock of the plugin, the fetch function, the timers and the
 * waits are fakes.
 */
function install(t, { env = {}, respond, preview = false, clock } = {}) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const calls = [];
  const lines = [];
  const waits = [];
  const time = clock ?? { value: NOW };
  const environment = { SKYWATCH_API_KEY: KEY, ...env };
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), method: init?.method, init });
    if (respond) return respond(String(url), init, calls.length);
    return String(url) === SEARCH ? startedAnswer() : resultsAnswer();
  };
  const plugin = skywatchProxy({
    env: environment,
    fetchImpl,
    now: () => time.value,
    setTimer: () => 1,
    clearTimer: () => {},
    wait: async (ms) => {
      waits.push(ms);
    },
    log: (line) => lines.push(line),
  });
  const uses = [];
  const routes = new Map();
  plugin[preview ? 'configurePreviewServer' : 'configureServer']({
    middlewares: {
      use(route, handler) {
        uses.push(route);
        routes.set(route, handler);
      },
    },
  });

  async function request(url, options = {}) {
    const { method = 'POST', body, headers = {}, remote = '127.0.0.1' } = options;
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    const req = Object.assign(Readable.from(body === undefined ? [] : [Buffer.from(text)]), {
      method,
      headers: { ...GOOD_HEADERS, ...headers },
      socket: { remoteAddress: remote },
    });
    const res = {
      headers: {},
      writeHead(code, values) {
        this.statusCode = code;
        for (const [name, value] of Object.entries(values ?? {}))
          this.headers[name.toLowerCase()] = value;
      },
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      end(chunk) {
        this.text = chunk;
      },
    };
    let nexted = false;
    const route = [...routes.keys()].find(
      (base) =>
        url === base ||
        (/^[/?]/.test(url.slice(base.length)) && url.startsWith(base)),
    );
    if (route === undefined) {
      nexted = true;
    } else {
      const rest = url.slice(route.length);
      req.url = rest.startsWith('/') ? rest : `/${rest}`;
      await routes.get(route)(req, res, () => {
        nexted = true;
      });
    }
    return {
      status: res.statusCode,
      headers: res.headers,
      text: res.text,
      body: res.text === undefined ? undefined : JSON.parse(res.text),
      next: nexted,
    };
  }
  const scenes = (body = { bbox: BOX, ...DATES }, options = {}) =>
    request(SCENES, { body, ...options });
  return {
    plugin,
    uses,
    request,
    scenes,
    calls,
    lines,
    waits,
    time,
    advance: (ms) => {
      time.value += ms;
      t.mock.timers.tick(ms);
    },
  };
}

const searches = (server) => server.calls.filter((call) => call.url === SEARCH).length;
/** Let the streams and the promises of a request run. Only Date is mocked. */
const settle = async () => {
  for (let i = 0; i < 10; i++) await new Promise((resolve) => setImmediate(resolve));
};

test('[skywatch-source-001] mounts the two routes and passes other paths to next', async (t) => {
  const server = install(t);
  assert.equal(server.plugin.name, 'skywatch-proxy');
  assert.deepEqual(server.uses.sort(), [SCENES, STATUS]);
  const preview = install(t, { preview: true });
  assert.deepEqual(preview.uses.sort(), [SCENES, STATUS]);
  const status = await server.request(STATUS, { method: 'GET' });
  assert.equal(status.status, 200);
  assert.equal(status.next, false);
  const scenes = await server.scenes();
  assert.equal(scenes.status, 200);
  assert.equal(scenes.next, false);
  const other = await server.request('/api/skywatch/other');
  assert.equal(other.next, true);
  assert.equal(other.status, undefined);
  const below = await server.request(`${SCENES}/x`);
  assert.equal(below.next, true);
  assert.equal(below.status, undefined);
  const belowStatus = await server.request(`${STATUS}/x`, { method: 'GET' });
  assert.equal(belowStatus.next, true);
});

test('[skywatch-source-001] localProviderPlugins holds the plugin once', () => {
  const names = localProviderPlugins().map((plugin) => plugin.name);
  assert.equal(names.filter((name) => name === 'skywatch-proxy').length, 1);
});

test('[skywatch-source-002] reports the status of the key, refuses another method and a cross-site request', async (t) => {
  for (const [value, configured] of [
    [KEY, true],
    [` ${KEY} `, true],
    ['x', true],
    ['', false],
    ['   ', false],
    ['\t\n', false],
    [undefined, false],
  ]) {
    const env = value === undefined ? { SKYWATCH_API_KEY: undefined } : { SKYWATCH_API_KEY: value };
    const server = install(t, { env });
    const answer = await server.request(STATUS, { method: 'GET' });
    assert.equal(answer.status, 200, String(value));
    assert.deepEqual(answer.body, { configured }, String(value));
  }
  const server = install(t);
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const answer = await server.request(STATUS, { method });
    assert.equal(answer.status, 405);
    assert.deepEqual(answer.body, { error: 'Method not allowed' });
  }
  const cross = await server.request(STATUS, {
    method: 'GET',
    headers: { 'sec-fetch-site': 'cross-site' },
  });
  assert.equal(cross.status, 403);
  assert.equal(String(cross.text).includes(KEY), false);
  assert.equal(server.calls.length, 0);
});

test('[skywatch-source-003] refuses GET, PUT and DELETE on the scenes route', async (t) => {
  const server = install(t);
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const answer = await server.scenes(undefined, { method });
    assert.equal(answer.status, 405, method);
    assert.deepEqual(answer.body, { error: 'Method not allowed' });
  }
  assert.equal(server.calls.length, 0);
});

test('[skywatch-source-004] refuses a scenes request that fails a check of isLoopbackCommand', async (t) => {
  const server = install(t);
  for (const options of [
    { remote: '192.0.2.10' },
    { headers: { 'x-forwarded-for': '127.0.0.1' } },
    { headers: { host: 'example.test', origin: 'http://example.test' } },
    { headers: { origin: 'http://example.test' } },
    { headers: { 'content-type': 'text/plain' } },
  ]) {
    const answer = await server.scenes(undefined, options);
    assert.equal(answer.status, 403, JSON.stringify(options));
    assert.deepEqual(answer.body, { error: 'cross_origin' });
  }
  assert.equal(server.calls.length, 0);
});

test('[skywatch-source-009] refuses a valid request when the key is not set or holds only white space', async (t) => {
  for (const value of [undefined, '', '  ', '\t']) {
    const server = install(t, { env: { SKYWATCH_API_KEY: value } });
    const answer = await server.scenes();
    assert.equal(answer.status, 503, String(value));
    assert.deepEqual(answer.body, { error: 'no_key', keyRequired: true });
    assert.equal(server.calls.length, 0);
  }
});

test('[skywatch-source-010] keeps the key out of each answer and sends the trimmed key in x-api-key', async (t) => {
  const answers = [];
  const failing = [
    () => json(401, { errors: [{ message: `bad key ${KEY}` }] }),
    () => json(429, {}, { 'retry-after': '5' }),
    () => json(500, { errors: [{ message: KEY }] }),
  ];
  const server = install(t, { env: { SKYWATCH_API_KEY: ` ${KEY} ` } });
  answers.push(await server.request(STATUS, { method: 'GET' }));
  answers.push(await server.scenes());
  for (const [n, fail] of failing.entries()) {
    const other = install(t, {
      env: { SKYWATCH_API_KEY: ` ${KEY} ` },
      respond: () => fail(),
    });
    answers.push(await other.scenes({ bbox: boxAt(n + 1), ...DATES }));
    for (const call of other.calls) assert.equal(call.init.headers['x-api-key'], KEY);
  }
  for (const answer of answers) {
    assert.equal(String(answer.text).includes(KEY), false);
    assert.equal(JSON.stringify(answer.headers).includes(KEY), false);
  }
  assert.ok(server.calls.length >= 2);
  for (const call of server.calls) assert.equal(call.init.headers['x-api-key'], KEY);
});

test('[skywatch-source-013] sends only the search request and the result requests in each flow', async (t) => {
  const flows = [
    {},
    { respond: (url) => (url === SEARCH ? json(401, {}) : resultsAnswer()) },
    { respond: (url) => (url === SEARCH ? startedAnswer() : pendingAnswer()) },
    { respond: (url) => (url === SEARCH ? startedAnswer() : json(429, {})) },
    { respond: (url) => (url === SEARCH ? json(200, { data: { id: 'bad id' } }) : resultsAnswer()) },
    { respond: (url) => (url === SEARCH ? startedAnswer() : json(500, {})) },
    {
      respond: () => {
        throw new TypeError('fetch failed');
      },
    },
  ];
  const all = [];
  for (const flow of flows) {
    const server = install(t, flow);
    await server.request(STATUS, { method: 'GET' });
    await server.scenes();
    await server.scenes();
    all.push(...server.calls);
  }
  const results = `${SEARCH}/CANARY-search-id/search_results?per_page=50`;
  for (const call of all) {
    assert.ok(
      (call.url === SEARCH && call.method === 'POST') ||
        (call.url === results && call.method === 'GET'),
      `${call.method} ${call.url}`,
    );
    for (const word of ['pipelines', 'price', 'orders', 'outputs', 'offerings'])
      assert.equal(call.url.includes(word), false, word);
  }
  assert.ok(all.length > 10);
});

test('[skywatch-source-014] counts each new search against the daily limit and refuses at the limit', async (t) => {
  const server = install(t, { env: { SKYWATCH_DAILY_SEARCHES: '2' } });
  const first = await server.scenes({ bbox: boxAt(1), ...DATES });
  assert.deepEqual(first.body.budget, { used: 1, limit: 2 });
  const second = await server.scenes({ bbox: boxAt(2), ...DATES });
  assert.deepEqual(second.body.budget, { used: 2, limit: 2 });
  const third = await server.scenes({ bbox: boxAt(3), ...DATES });
  assert.equal(third.status, 429);
  assert.deepEqual(third.body, { error: 'budget', used: 2, limit: 2 });
  assert.equal(searches(server), 2);
});

test('[skywatch-source-014] counts the search before it sends the request, also for a failed search', async (t) => {
  let usedAtSend;
  const server = install(t, {
    env: { SKYWATCH_DAILY_SEARCHES: '1' },
    respond: (url) => {
      if (url === SEARCH) usedAtSend = 'sent';
      return json(500, {});
    },
  });
  const failed = await server.scenes({ bbox: boxAt(1), ...DATES });
  assert.equal(failed.status, 502);
  assert.equal(usedAtSend, 'sent');
  const refused = await server.scenes({ bbox: boxAt(2), ...DATES });
  assert.deepEqual(refused.body, { error: 'budget', used: 1, limit: 1 });
});

test('[skywatch-source-014] reads the daily limit from SKYWATCH_DAILY_SEARCHES, and uses 20 for each other value', async (t) => {
  for (const [value, limit] of [
    ['1', 1],
    ['1000', 1000],
    ['0010', 10],
    ['7', 7],
    ['0', 20],
    ['1001', 20],
    [' 7', 20],
    ['7 ', 20],
    ['1e3', 20],
    ['-5', 20],
    ['2.5', 20],
    ['', 20],
    ['many', 20],
    [undefined, 20],
  ]) {
    const server = install(t, { env: { SKYWATCH_DAILY_SEARCHES: value } });
    const answer = await server.scenes();
    assert.deepEqual(answer.body.budget, { used: 1, limit }, String(value));
  }
});

test('[skywatch-source-014] starts the count again at 0 on the next UTC day', async (t) => {
  const clock = { value: Date.UTC(2026, 9, 21, 23, 59, 59, 999) };
  const server = install(t, { env: { SKYWATCH_DAILY_SEARCHES: '1' }, clock });
  assert.equal((await server.scenes({ bbox: boxAt(1), ...DATES })).status, 200);
  assert.equal((await server.scenes({ bbox: boxAt(2), ...DATES })).status, 429);
  clock.value += 1;
  const next = await server.scenes({ bbox: boxAt(3), ...DATES });
  assert.equal(next.status, 200);
  assert.deepEqual(next.body.budget, { used: 1, limit: 1 });
});

test('[skywatch-source-015] answers a repeated request from the store for 599999 ms, with the budget of the new request', async (t) => {
  const server = install(t);
  const first = await server.scenes();
  assert.equal(first.body.cached, false);
  await server.scenes({ bbox: boxAt(1), ...DATES });
  server.advance(599999);
  const again = await server.scenes();
  assert.equal(again.body.cached, true);
  assert.deepEqual(again.body.scenes, first.body.scenes);
  assert.deepEqual(again.body.budget, { used: 2, limit: 20 });
  assert.equal(searches(server), 2);
  server.advance(1);
  const old = await server.scenes();
  assert.equal(old.body.cached, false);
  assert.equal(searches(server), 3);
});

test('[skywatch-source-015] keeps at most 32 answers and removes the oldest answer first', async (t) => {
  const server = install(t, { env: { SKYWATCH_DAILY_SEARCHES: '100' } });
  // 10001 ms between requests keeps each window of 60000 ms under the rate limit.
  for (let n = 0; n < 33; n++) {
    assert.equal((await server.scenes({ bbox: boxAt(n), ...DATES })).status, 200);
    server.advance(10001);
  }
  assert.equal(searches(server), 33);
  assert.equal((await server.scenes({ bbox: boxAt(1), ...DATES })).body.cached, true);
  server.advance(10001);
  assert.equal((await server.scenes({ bbox: boxAt(0), ...DATES })).body.cached, false);
  assert.equal(searches(server), 34);
});

test('[skywatch-source-015 skywatch-source-019] keeps no failure in the store', async (t) => {
  let fail = true;
  const server = install(t, {
    respond: (url) => {
      if (fail) return json(500, {});
      return url === SEARCH ? startedAnswer() : resultsAnswer();
    },
  });
  assert.equal((await server.scenes()).status, 502);
  fail = false;
  const after = await server.scenes();
  assert.equal(after.status, 200);
  assert.equal(after.body.cached, false);
});

test('[skywatch-source-016] shares an upstream search that is in flight', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const server = install(t, {
    respond: async (url) => {
      if (url === SEARCH) {
        await gate;
        return startedAnswer();
      }
      return resultsAnswer();
    },
  });
  const first = server.scenes();
  await settle();
  const second = server.scenes();
  await settle();
  release();
  const [a, b] = await Promise.all([first, second]);
  assert.equal(a.body.cached, false);
  assert.equal(b.body.cached, true);
  assert.deepEqual(b.body.scenes, a.body.scenes);
  assert.equal(searches(server), 1);
  assert.deepEqual(b.body.budget, { used: 1, limit: 20 });
});

test('[skywatch-source-016] gives the failure of a shared search to each request that waits', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const server = install(t, {
    respond: async () => {
      await gate;
      return json(401, {});
    },
  });
  const first = server.scenes();
  await settle();
  const second = server.scenes();
  await settle();
  release();
  const [a, b] = await Promise.all([first, second]);
  for (const answer of [a, b]) {
    assert.equal(answer.status, 403);
    assert.deepEqual(answer.body, { error: 'key_rejected', keyRejected: true });
  }
  assert.equal(searches(server), 1);
});

test('[skywatch-source-017] refuses the 7th request in 60000 ms, and a stored answer counts', async (t) => {
  const server = install(t);
  for (let n = 0; n < 6; n++) {
    const answer = await server.scenes({ bbox: boxAt(n % 2), ...DATES });
    assert.equal(answer.status, 200, String(n));
  }
  assert.equal(searches(server), 2);
  server.advance(59999);
  const refused = await server.scenes({ bbox: boxAt(5), ...DATES });
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, { error: 'rate_limited' });
  assert.equal(refused.headers['retry-after'], '60');
  server.advance(1);
  const passes = await server.scenes({ bbox: boxAt(5), ...DATES });
  assert.equal(passes.status, 200);
});

test('[skywatch-source-018] answers with the first step that fails', async (t) => {
  const server = install(t, { env: { SKYWATCH_API_KEY: '', SKYWATCH_DAILY_SEARCHES: '1' } });
  const badAll = { bbox: [0, 0, 5, 5], start: 'x' };
  assert.equal((await server.scenes(badAll, { method: 'GET', remote: '192.0.2.10' })).status, 405);
  assert.deepEqual((await server.scenes(badAll, { remote: '192.0.2.10' })).body, {
    error: 'cross_origin',
  });
  assert.deepEqual((await server.scenes('{"bbox":', {})).body, { error: 'bad_body' });
  assert.deepEqual((await server.scenes({ bbox: 'x', start: 'x' })).body, { error: 'bad_bbox' });
  assert.deepEqual((await server.scenes({ bbox: [0, 0, 5, 5], start: 'x', end: 'y' })).body, {
    error: 'area_too_large',
    maxKm2: 2500,
  });
  assert.deepEqual((await server.scenes({ bbox: BOX, start: 'x', end: 'y' })).body, {
    error: 'bad_dates',
  });
  assert.deepEqual((await server.scenes()).body, { error: 'no_key', keyRequired: true });
  assert.equal(server.calls.length, 0);
});

test('[skywatch-source-018] checks the rate limit before the body, and the store before the daily count', async (t) => {
  const server = install(t, { env: { SKYWATCH_DAILY_SEARCHES: '1' } });
  assert.equal((await server.scenes()).status, 200);
  const stored = await server.scenes();
  assert.equal(stored.status, 200);
  assert.equal(stored.body.cached, true);
  assert.deepEqual(stored.body.budget, { used: 1, limit: 1 });
  const budget = await server.scenes({ bbox: boxAt(1), ...DATES });
  assert.deepEqual(budget.body, { error: 'budget', used: 1, limit: 1 });
  for (let n = 0; n < 3; n++) await server.scenes('not json');
  const limited = await server.scenes('not json');
  assert.equal(limited.status, 429);
  assert.deepEqual(limited.body, { error: 'rate_limited' });
  assert.equal(searches(server), 1);
});

test('[skywatch-source-019] gives the named failure of the scenes route for each upstream failure', async (t) => {
  const cases = [
    [json(401, {}), 403, { error: 'key_rejected', keyRejected: true }],
    [json(403, {}), 403, { error: 'key_rejected', keyRejected: true }],
    [json(500, {}), 502, { error: 'upstream_failed' }],
    [new Response('not json', { status: 200 }), 502, { error: 'bad_upstream' }],
  ];
  for (const [n, [answer, status, body]] of cases.entries()) {
    const server = install(t, { respond: () => answer });
    const result = await server.scenes({ bbox: boxAt(n), ...DATES });
    assert.equal(result.status, status);
    assert.deepEqual(result.body, body);
  }
  const limited = install(t, { respond: () => json(429, {}, { 'retry-after': '42' }) });
  const result = await limited.scenes();
  assert.equal(result.status, 429);
  assert.deepEqual(result.body, { error: 'upstream_rate_limit', retryAfter: 42 });
  assert.equal(result.headers['retry-after'], '42');
  const timeout = install(t, {
    respond: (url) => (url === SEARCH ? startedAnswer() : pendingAnswer()),
  });
  const slow = await timeout.scenes();
  assert.equal(slow.status, 504);
  assert.deepEqual(slow.body, { error: 'search_timeout' });
  assert.deepEqual(timeout.waits, Array(9).fill(2000));
});

test('[skywatch-source-021] gives the shape of a good answer and the headers of each answer', async (t) => {
  const server = install(t);
  const answer = await server.scenes();
  assert.equal(answer.status, 200);
  assert.deepEqual(Object.keys(answer.body).sort(), [
    'budget',
    'cached',
    'count',
    'scenes',
    'source',
    'total',
    'truncated',
  ]);
  assert.equal(answer.body.source, 'SkyWatch');
  assert.equal(answer.body.count, 3);
  assert.equal(answer.body.scenes.length, 3);
  assert.equal(answer.body.total, 3);
  assert.equal(answer.body.truncated, false);
  assert.equal(answer.body.cached, false);
  assert.deepEqual(answer.body.budget, { used: 1, limit: 20 });
  assert.equal(answer.body.scenes[0].id, 'scene-2');
  assert.equal(answer.body.scenes[0].cost, null);
  assert.equal(answer.text.includes('CANARY'), false);
  for (const result of [answer, await server.scenes('not json'), await server.scenes(undefined, { method: 'GET' })]) {
    assert.equal(result.headers['content-type'], 'application/json; charset=utf-8');
    assert.equal(result.headers['cache-control'], 'no-store');
  }
});

test('[skywatch-source-022] writes one line for a good search, with the count of the answer, the polls and the time', async (t) => {
  const clock = { value: 1000 };
  const server = install(t, {
    clock,
    respond: (url, _init, n) => {
      if (url === SEARCH) return startedAnswer();
      if (n === 2) return pendingAnswer();
      clock.value = 1040;
      return json(200, { data: [row(1), row(2), row(3), null] });
    },
  });
  const answer = await server.scenes();
  assert.equal(answer.body.count, 3);
  assert.deepEqual(server.lines, ['[skywatch] ok scenes=3 polls=2 ms=40']);
});

test('[skywatch-source-022] writes one line for each failure, with the number of result requests', async (t) => {
  const cases = [
    [(url) => json(401, {}), '[skywatch] failed kind=key_rejected polls=0 ms=40'],
    [
      (url) => (url === SEARCH ? startedAnswer() : pendingAnswer()),
      '[skywatch] failed kind=search_timeout polls=10 ms=40',
    ],
    [
      (url) => (url === SEARCH ? startedAnswer() : json(500, {})),
      '[skywatch] failed kind=upstream_failed polls=1 ms=40',
    ],
    [
      (url) => (url === SEARCH ? startedAnswer() : json(429, {})),
      '[skywatch] failed kind=upstream_rate_limit polls=1 ms=40',
    ],
    [
      (url) => (url === SEARCH ? json(200, { data: { id: 'bad id' } }) : resultsAnswer()),
      '[skywatch] failed kind=bad_upstream polls=0 ms=40',
    ],
  ];
  for (const [respond, line] of cases) {
    const clock = { value: 1000 };
    const server = install(t, {
      clock,
      respond: (url) => {
        clock.value = 1040;
        return respond(url);
      },
    });
    await server.scenes();
    assert.deepEqual(server.lines, [line]);
  }
});

test('[skywatch-source-022] writes no key, search id, URL or host name, and no line for a request with no search', async (t) => {
  const server = install(t, {
    respond: (url) => {
      if (url === SEARCH) return startedAnswer();
      throw new TypeError(`fetch failed ${KEY} ${url}`);
    },
  });
  await server.scenes();
  await server.scenes({ bbox: boxAt(1), ...DATES });
  const good = install(t);
  await good.scenes();
  await good.scenes();
  await good.scenes('not json');
  await good.scenes(undefined, { method: 'GET' });
  await good.scenes(undefined, { remote: '192.0.2.10' });
  assert.equal(good.lines.length, 1);
  const lines = [...server.lines, ...good.lines].join('\n');
  for (const word of [KEY, 'CANARY-search-id', 'https://', 'api.skywatch.co', 'thumbs.example'])
    assert.equal(lines.includes(word), false, word);
  const limited = install(t, { env: { SKYWATCH_DAILY_SEARCHES: '1' } });
  await limited.scenes();
  await limited.scenes({ bbox: boxAt(1), ...DATES });
  assert.equal(limited.lines.length, 1);
});
