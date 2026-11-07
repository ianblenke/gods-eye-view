import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createServer, request as httpRequest } from 'node:http';
import { up42Plugins } from '../../server/providers/up42.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 10, 6, 12);
const TOKEN =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const COLLECTIONS =
  'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100';
const SEARCH = 'https://api.up42.com/catalog/hosts/oneatlas/stac/search';
const json = (value, status = 200) =>
  new Response(JSON.stringify(value), { status });
const boxAt = (n) => [10 + n * 0.1, 60, 10.02 + n * 0.1, 60.01];
const body = (extra = {}) => ({
  box: [10, 60, 10.02, 60.01],
  start: '2026-10-01',
  end: '2026-10-20',
  ...extra,
});
const feature = () => ({
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [10, 60],
        [10.02, 60],
        [10.02, 60.01],
        [10, 60.01],
        [10, 60],
      ],
    ],
  },
  properties: {
    id: 'scene.1',
    collection: 'pneo',
    datetime: '2026-10-02T00:00:00Z',
    resolution: 1.2,
    producer: 'Test producer',
    cloudCoverage: 17,
    providerProperties: 'fake-pass-secret fake-token-secret',
  },
});
const respondGood = (url) =>
  url === TOKEN
    ? json({ access_token: 'fake-token-secret', expires_in: 300 })
    : url === COLLECTIONS
      ? json({
          content: [
            {
              name: 'pneo',
              integrations: ['SEARCH_AVAILABLE', 'THUMBNAIL_AVAILABLE'],
              providers: [{ name: 'oneatlas', roles: ['HOST'] }],
            },
            {
              name: 'phr',
              integrations: ['SEARCH_AVAILABLE'],
              providers: [{ name: 'oneatlas', roles: ['HOST'] }],
            },
          ],
        })
      : json({ features: [feature()], links: [] });
const settle = async () => {
  for (let i = 0; i < 10; i++)
    await new Promise((resolve) => setImmediate(resolve));
};
function install(
  t,
  { env = {}, respond = respondGood, preview = false, timers = {} } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const environment = {
    UP42_USERNAME: 'test-user',
    UP42_PASSWORD: 'fake-pass-secret',
    ...env,
  };
  const calls = [];
  const lines = [];
  const plugins = up42Plugins({
    env: environment,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return respond(url, init, calls.length);
    },
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    log: (line) => lines.push(line),
    ...timers,
  });
  const routes = new Map();
  for (const plugin of plugins)
    plugin[preview ? 'configurePreviewServer' : 'configureServer']({
      middlewares: { use: (path, fn) => routes.set(path, fn) },
    });
  async function request(
    path,
    {
      method = 'POST',
      value = body(),
      headers = {},
      encrypted = false,
      suffix = '/',
      stream,
    } = {},
  ) {
    const req = Object.assign(
      stream ??
        Readable.from([
          Buffer.from(
            typeof value === 'string' ? value : JSON.stringify(value),
          ),
        ]),
      {
        url: suffix,
        method,
        headers: {
          host: 'localhost:5173',
          origin: 'http://localhost:5173',
          'content-type': 'application/json',
          ...headers,
        },
        socket: { encrypted },
      },
    );
    const res = {
      headers: {},
      setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
      },
      writeHead(code, fields) {
        this.status = code;
        this.headers = Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [k.toLowerCase(), v]),
        );
      },
      end(text) {
        this.text = text;
      },
    };
    let next = false;
    await routes.get(path)(req, res, () => {
      next = true;
    });
    return {
      status: res.status ?? res.statusCode,
      headers: res.headers,
      text: res.text,
      body: res.text === undefined ? undefined : JSON.parse(res.text),
      next,
    };
  }
  return {
    plugins,
    routes,
    calls,
    lines,
    env: environment,
    request,
    scenes: (value = body(), options = {}) =>
      request('/api/up42/scenes', { value, ...options }),
    advance: (ms) => t.mock.timers.tick(ms),
  };
}

test('[up42-source-001] installs both exact routes in both Vite hooks', async (t) => {
  for (const preview of [false, true]) {
    const s = install(t, { preview });
    assert.deepEqual(
      [...s.routes.keys()],
      ['/api/up42/status', '/api/up42/scenes'],
    );
    assert.equal(s.plugins.length, 1);
    assert.equal(s.plugins[0].name, 'up42-proxy');
    for (const path of s.routes.keys())
      for (const suffix of ['/child', '/child?q=1'])
        assert.equal((await s.request(path, { suffix })).next, true);
    assert.equal(
      (await s.request('/api/up42/status', { method: 'GET', suffix: '/?q=1' }))
        .status,
      200,
    );
    assert.equal(s.calls.length, 0);
  }
  const names = localProviderPlugins().map((p) => p.name);
  assert.equal(names.filter((n) => n === 'up42-proxy').length, 1);
  assert.equal(
    names.indexOf('up42-proxy'),
    names.indexOf('skywatch-thumbnail-proxy') + 1,
  );
});

test('[up42-source-002] gives only the credential state with no upstream call', async (t) => {
  for (const [index, [username, password, configured]] of [
    ['test-user', 'test-pass', true],
    [' user ', ' pass ', true],
    ['', 'test-pass', false],
    ['test-user', '', false],
    [undefined, 'test-pass', false],
    ['test-user', undefined, false],
    ['  ', 'test-pass', false],
    ['test-user', '  ', false],
  ].entries()) {
    const s = install(t, {
      env: { UP42_USERNAME: username, UP42_PASSWORD: password },
    });
    const answer = await s.request('/api/up42/status', { method: 'GET' });
    assert.equal(answer.status, 200, String(index));
    assert.deepEqual(answer.body, { configured });
    assert.equal(s.calls.length, 0);
    assert.equal(
      (await s.request('/api/up42/status', { method: 'PUT' })).status,
      405,
    );
    assert.equal(
      (
        await s.request('/api/up42/status', {
          method: 'PUT',
          headers: { origin: 'http://else.invalid' },
        })
      ).status,
      403,
    );
  }
});

test('[up42-source-003] checks the method before other scenes checks', async (t) => {
  const s = install(t);
  for (const method of ['GET', 'PUT', 'PATCH', 'DELETE']) {
    const a = await s.scenes('bad JSON', {
      method,
      headers: { origin: 'http://else.invalid' },
    });
    assert.equal(a.status, 405);
    assert.deepEqual(a.body, { error: 'Method not allowed' });
  }
  assert.equal(s.calls.length, 0);
});

test('[up42-source-004] refuses each failed same-site or content check', async (t) => {
  const s = install(t);
  for (const headers of [
    { origin: 'http://else.invalid' },
    { origin: 'null' },
    { 'sec-fetch-site': 'cross-site' },
    { 'sec-fetch-site': 'same-site' },
    { 'x-forwarded-for': '127.0.0.1' },
    { 'content-type': 'text/plain' },
    { 'content-type': 'application/json; charset=utf-8' },
    { 'content-type': undefined },
  ]) {
    const answer = await s.scenes(undefined, { headers });
    assert.equal(answer.status, 403);
    assert.deepEqual(answer.body, { error: 'cross_origin' });
  }
  assert.equal(s.calls.length, 0);
  assert.equal((await s.scenes()).status, 200);
  assert.equal(
    (
      await s.scenes(body({ maxCloud: 7 }), {
        encrypted: true,
        headers: { origin: 'https://localhost:5173' },
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await s.scenes(undefined, {
        headers: { origin: 'https://localhost:5173' },
      })
    ).status,
    403,
  );
});

test('[up42-source-005] counts bad bodies and kept answers and resets at 60000 ms', async (t) => {
  const s = install(t);
  assert.equal((await s.scenes()).status, 200);
  assert.equal((await s.scenes()).body.cached, true);
  for (let i = 0; i < 4; i++)
    assert.deepEqual((await s.scenes('bad JSON')).body, { error: 'bad_body' });
  s.advance(59999);
  const a = await s.scenes('bad JSON');
  assert.equal(a.status, 429);
  assert.deepEqual(a.body, { error: 'rate_limited' });
  assert.equal(a.headers['retry-after'], '60');
  s.advance(1);
  assert.equal((await s.scenes()).status, 200);
});

test('[up42-source-003] refuses other origins before the rate limit', async (t) => {
  const s = install(t);
  for (let i = 0; i < 7; i++)
    assert.equal(
      (
        await s.scenes(undefined, {
          headers: { origin: 'http://else.invalid' },
        })
      ).status,
      403,
    );
  assert.equal((await s.scenes()).status, 200);
});

test('[up42-source-006] gives body failures before the credential check', async (t) => {
  const s = install(t, { env: { UP42_USERNAME: '' } });
  assert.deepEqual((await s.scenes('x'.repeat(4097))).body, {
    error: 'bad_body',
  });
  const broken = Readable.from(
    (async function* () {
      yield Buffer.from('x');
      throw new Error('test');
    })(),
  );
  assert.deepEqual((await s.scenes(undefined, { stream: broken })).body, {
    error: 'bad_body',
  });
  assert.deepEqual((await s.scenes('bad JSON')).body, { error: 'bad_body' });
  assert.deepEqual((await s.scenes(body({ box: [] }))).body, {
    error: 'bad_bbox',
  });
  assert.deepEqual((await s.scenes(body({ start: 'x' }))).body, {
    error: 'bad_dates',
  });
  assert.equal(s.calls.length, 0);
});

test('[up42-source-011] checks both credentials before the store', async (t) => {
  for (const field of ['UP42_USERNAME', 'UP42_PASSWORD']) {
    const s = install(t);
    assert.equal((await s.scenes()).body.cached, false);
    const count = s.calls.length;
    s.env[field] = '';
    const a = await s.scenes();
    assert.equal(a.status, 503);
    assert.deepEqual(a.body, { error: 'no_credentials', keyRequired: true });
    assert.equal(s.calls.length, count);
  }
});

for (const [index, [status, expected]] of [
  [400, [403, { error: 'credentials_rejected', keyRejected: true }]],
  [401, [403, { error: 'credentials_rejected', keyRejected: true }]],
].entries()) {
  test(`[up42-source-012] gives the route failure case ${index}`, async (t) => {
    const s = install(t, {
      respond: (url) =>
        url === TOKEN
          ? json({ message: 'fake-pass-secret fake-token-secret' }, status)
          : respondGood(url),
    });
    const a = await s.scenes();
    assert.equal(a.status, expected[0]);
    assert.deepEqual(a.body, expected[1]);
  });
}

test('[up42-source-017] gives 502 when the host fails', async (t) => {
  const s = install(t, {
    respond: (url) => (url === SEARCH ? json({}, 500) : respondGood(url)),
  });
  const answer = await s.scenes();
  assert.equal(answer.status, 502);
  assert.deepEqual(answer.body, { error: 'upstream_failed' });
});

test('[up42-source-013] uses one new login after an API 401 then stops', async (t) => {
  const s = install(t, {
    respond: (url) => (url === SEARCH ? json({}, 401) : respondGood(url)),
  });
  const answer = await s.scenes();
  assert.equal(answer.status, 502);
  assert.deepEqual(answer.body, { error: 'upstream_failed' });
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 2);
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 2);
});

test('[up42-source-010] gives the collection refusal from the fetched list', async (t) => {
  const s = install(t);
  const a = await s.scenes(body({ collections: ['missing'] }));
  assert.equal(a.status, 400);
  assert.deepEqual(a.body, { error: 'bad_collections' });
  assert.deepEqual(
    s.calls.map((c) => c.url),
    [COLLECTIONS],
  );
});

test(
  '[up42-source-017] gives 504 when all host calls time out',
  { timeout: 3000 },
  async (t) => {
    const timers = new Map();
    let id = 0;
    const s = install(t, {
      timers: {
        setTimer: (fn) => {
          timers.set(++id, fn);
          return id;
        },
        clearTimer: (key) => timers.delete(key),
      },
      respond: (url, init) =>
        url !== SEARCH
          ? respondGood(url)
          : new Promise((_resolve, reject) =>
              init.signal.addEventListener('abort', () =>
                reject(new Error('test')),
              ),
            ),
    });
    const run = s.scenes();
    await settle();
    assert.equal(timers.size, 1);
    for (const fire of timers.values()) fire();
    const a = await run;
    assert.equal(a.status, 504);
    assert.deepEqual(a.body, { error: 'search_timeout' });
    assert.equal(timers.size, 0);
  },
);

test('[up42-source-019] gives the complete answer and the response headers', async (t) => {
  const s = install(t);
  const a = await s.scenes();
  assert.equal(a.status, 200);
  assert.deepEqual(a.body, {
    source: 'UP42',
    scenes: [
      {
        id: 'scene.1',
        host: 'oneatlas',
        collection: 'pneo',
        start: '2026-10-02T00:00:00.000Z',
        end: '2026-10-02T00:00:00.000Z',
        footprint: {
          type: 'Polygon',
          coordinates: [
            [
              [10, 60],
              [10.02, 60],
              [10.02, 60.01],
              [10, 60.01],
              [10, 60],
            ],
          ],
        },
        resolutionM: 1.2,
        provider: 'Test producer',
        cloudPercent: 17,
        thumbnail: true,
      },
    ],
    count: 1,
    dropped: 0,
    failedHosts: [],
    truncated: false,
    cached: false,
    budget: { used: 1, limit: 20 },
  });
  for (const result of [
    a,
    await s.scenes('bad JSON'),
    await s.scenes(undefined, { method: 'GET' }),
  ]) {
    assert.equal(
      result.headers['content-type'],
      'application/json; charset=utf-8',
    );
    assert.equal(result.headers['cache-control'], 'no-store');
  }
});

test('[up42-source-021] keeps good answers until the exact store boundary', async (t) => {
  const s = install(t);
  const first = await s.scenes();
  assert.equal(first.body.cached, false);
  s.advance(599999);
  const kept = await s.scenes();
  assert.equal(kept.body.cached, true);
  assert.deepEqual(kept.body.scenes, first.body.scenes);
  assert.deepEqual(kept.body.budget, { used: 1, limit: 20 });
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 1);
  s.advance(1);
  assert.equal((await s.scenes()).body.cached, false);
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 2);
});

test('[up42-source-021] uses each filter in the store key', async (t) => {
  const s = install(t);
  for (const extra of [
    {},
    { maxCloud: 0 },
    { maxCloud: 1 },
    { collections: ['pneo'] },
    { collections: ['phr'] },
    { start: '2026-10-02' },
  ])
    assert.equal((await s.scenes(body(extra))).body.cached, false);
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 6);
  s.advance(60000);
  for (const extra of [
    {},
    { maxCloud: 0 },
    { maxCloud: 1 },
    { collections: ['pneo'] },
    { collections: ['phr'] },
    { start: '2026-10-02' },
  ])
    assert.equal((await s.scenes(body(extra))).body.cached, true);
});

test('[up42-source-021] starts a new search when only the end date changes', async (t) => {
  const s = install(t);
  const first = await s.scenes();
  assert.equal(first.body.cached, false);
  assert.deepEqual(first.body.budget, { used: 1, limit: 20 });
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 1);
  const changed = await s.scenes(body({ end: '2026-10-21' }));
  assert.equal(changed.status, 200);
  assert.equal(changed.body.cached, false);
  assert.deepEqual(changed.body.budget, { used: 2, limit: 20 });
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 2);
});

test('[up42-source-025] starts one search for two simultaneous store misses', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = install(t, {
    respond: async (url) => {
      if (url === SEARCH) await gate;
      return respondGood(url);
    },
  });
  assert.equal(s.calls.length, 0);
  const first = s.scenes();
  const second = s.scenes();
  await settle();
  const started = s.calls.filter((c) => c.url === SEARCH).length;
  release();
  const [a, b] = await Promise.all([first, second]);
  assert.equal(started, 1);
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 1);
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
  assert.equal(a.body.cached, false);
  assert.equal(b.body.cached, true);
  assert.deepEqual(a.body.scenes, b.body.scenes);
  assert.deepEqual(a.body.budget, { used: 1, limit: 20 });
  assert.deepEqual(b.body.budget, { used: 1, limit: 20 });
});

test('[up42-source-021] removes the oldest answer after 32 entries', async (t) => {
  const s = install(t, { env: { UP42_DAILY_SEARCHES: '100' } });
  for (let i = 0; i < 33; i++) {
    assert.equal((await s.scenes(body({ box: boxAt(i) }))).body.cached, false);
    s.advance(10001);
  }
  assert.equal((await s.scenes(body({ box: boxAt(1) }))).body.cached, true);
  s.advance(10001);
  assert.equal((await s.scenes()).body.cached, false);
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 34);
});
for (const success of [true, false]) {
  test(`[up42-source-021] shares a search with success ${success}`, async (t) => {
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const s = install(t, {
      respond: async (url) => {
        if (url === SEARCH) {
          await gate;
          return success ? respondGood(url) : json({}, 500);
        }
        return respondGood(url);
      },
    });
    const first = s.scenes();
    await settle();
    const second = s.scenes();
    await settle();
    assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 1);
    release();
    const [a, b] = await Promise.all([first, second]);
    assert.equal(a.status, success ? 200 : 502);
    assert.equal(b.status, success ? 200 : 502);
    if (success) {
      assert.equal(a.body.cached, false);
      assert.equal(b.body.cached, true);
      assert.deepEqual(b.body.budget, { used: 1, limit: 20 });
      assert.deepEqual(a.body.scenes, b.body.scenes);
    } else assert.deepEqual(b.body, { error: 'upstream_failed' });
  });
}

test('[up42-source-021] keeps no failure in the store', async (t) => {
  let fail = true;
  const s = install(t, {
    respond: (url) =>
      url === SEARCH && fail ? json({}, 500) : respondGood(url),
  });
  assert.equal((await s.scenes()).status, 502);
  fail = false;
  const a = await s.scenes();
  assert.equal(a.status, 200);
  assert.equal(a.body.cached, false);
  assert.deepEqual(a.body.budget, { used: 2, limit: 20 });
});

test('[up42-source-022] checks the store before the daily count and counts failures', async (t) => {
  const s = install(t, { env: { UP42_DAILY_SEARCHES: '1' } });
  assert.deepEqual((await s.scenes()).body.budget, { used: 1, limit: 1 });
  assert.equal((await s.scenes()).body.cached, true);
  const limited = await s.scenes(body({ box: boxAt(1) }));
  assert.equal(limited.status, 429);
  assert.deepEqual(limited.body, { error: 'budget', used: 1, limit: 1 });
  s.advance(86400000);
  assert.deepEqual((await s.scenes(body({ box: boxAt(1) }))).body.budget, {
    used: 1,
    limit: 1,
  });
  const q = install(t, {
    env: { UP42_DAILY_SEARCHES: '1' },
    respond: () => json({}, 500),
  });
  assert.equal((await q.scenes()).status, 502);
  assert.deepEqual((await q.scenes()).body, {
    error: 'budget',
    used: 1,
    limit: 1,
  });
});

test('[up42-source-022] reserves the count before the first upstream call', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = install(t, {
    env: { UP42_DAILY_SEARCHES: '1' },
    respond: async (url) => {
      await gate;
      return respondGood(url);
    },
  });
  const first = s.scenes();
  await settle();
  const second = s.scenes(body({ box: boxAt(1) }));
  await settle();
  release();
  const [a, b] = await Promise.all([first, second]);
  assert.equal(a.status, 200);
  assert.equal(b.status, 429);
  assert.deepEqual(b.body, { error: 'budget', used: 1, limit: 1 });
  assert.equal(s.calls.filter((c) => c.url === SEARCH).length, 1);
});
for (const [index, [value, expected]] of [
  [undefined, 20],
  ['', 20],
  ['0', 20],
  ['1001', 20],
  [' 2', 20],
  ['2 ', 20],
  ['-1', 20],
  ['2.5', 20],
  ['1e3', 20],
  [1, 20],
  ['1', 1],
  ['1000', 1000],
  ['0007', 7],
].entries()) {
  test(`[up42-source-022] sets the daily limit case ${index}`, async (t) => {
    const s = install(t, { env: { UP42_DAILY_SEARCHES: value } });
    assert.deepEqual((await s.scenes()).body.budget, {
      used: 1,
      limit: expected,
    });
  });
}

test('[up42-source-023] keeps fake secrets out of every answer and console line', async (t) => {
  const output = [];
  for (const method of ['log', 'warn', 'error', 'info', 'debug'])
    t.mock.method(console, method, (...args) => output.push(args.join(' ')));
  const answers = [];
  const lines = [];
  for (const flow of ['good', 'login', 'api', 'throw', 'echo']) {
    const s = install(t, {
      respond: (url) => {
        if (flow === 'login' && url === TOKEN)
          return json({ message: 'fake-pass-secret' }, 401);
        if (flow === 'api' && url === SEARCH)
          return json({ message: 'fake-token-secret' }, 500);
        if (flow === 'throw' && url === SEARCH)
          throw new Error('fake-pass-secret fake-token-secret');
        if (flow === 'echo' && url === SEARCH) {
          const f = feature();
          f.properties.producer = 'fake-token-secret';
          return json({ features: [f] });
        }
        return respondGood(url);
      },
    });
    answers.push(
      await s.request('/api/up42/status', { method: 'GET' }),
      await s.scenes(),
      await s.scenes(),
    );
    lines.push(...s.lines);
    assert.equal(s.lines[0], flow === 'good' ? '[up42] ok' : '[up42] failed');
    assert.equal(s.lines.length, flow === 'good' ? 1 : 2);
  }
  const captured = JSON.stringify({ answers, lines, output });
  assert.equal(captured.includes('fake-pass-secret'), false);
  assert.equal(captured.includes('fake-token-secret'), false);
});

test('[up42-source-023] uses fake process credentials and the default console function', async (t) => {
  const previous = {
    UP42_USERNAME: process.env.UP42_USERNAME,
    UP42_PASSWORD: process.env.UP42_PASSWORD,
    UP42_DAILY_SEARCHES: process.env.UP42_DAILY_SEARCHES,
  };
  Object.assign(process.env, {
    UP42_USERNAME: 'test-user',
    UP42_PASSWORD: 'fake-pass-secret',
    UP42_DAILY_SEARCHES: '3',
  });
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  const calls = [];
  const lines = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.push({ url, init });
    return respondGood(url);
  });
  t.mock.method(console, 'log', (line) => lines.push(line));
  const [plugin] = up42Plugins();
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (path, fn) => routes.set(path, fn) },
  });
  const req = Object.assign(
    Readable.from([Buffer.from(JSON.stringify(body()))]),
    {
      url: '/',
      method: 'POST',
      headers: {
        host: 'localhost:5173',
        origin: 'http://localhost:5173',
        'content-type': 'application/json',
      },
      socket: { encrypted: false },
    },
  );
  let answer;
  await routes.get('/api/up42/scenes')(
    req,
    {
      writeHead(code) {
        assert.equal(code, 200);
      },
      end(text) {
        answer = JSON.parse(text);
      },
    },
    () => assert.fail('unexpected next'),
  );
  assert.deepEqual(answer.budget, { used: 1, limit: 3 });
  assert.deepEqual(lines, ['[up42] ok']);
  assert.equal(calls.length, 3);
  assert.equal(
    JSON.stringify({ answer, lines }).includes('fake-pass-secret'),
    false,
  );
  assert.equal(
    JSON.stringify({ answer, lines }).includes('fake-token-secret'),
    false,
  );
});

test('[up42-source-018] gives a fixed route failure for a public list 401', async (t) => {
  const s = install(t, {
    respond: () => json({ message: 'fake-pass-secret' }, 401),
  });
  const answer = await s.scenes();
  assert.equal(answer.status, 502);
  assert.deepEqual(answer.body, { error: 'upstream_failed' });
});

test('[up42-source-022] uses the default for a daily limit with a line break', async (t) => {
  const s = install(t, { env: { UP42_DAILY_SEARCHES: '7\n' } });
  assert.deepEqual((await s.scenes()).body.budget, { used: 1, limit: 20 });
});

test(
  '[up42-source-027] gives an HTTP client 400 for a body above the cap',
  { timeout: 3000 },
  async (t) => {
    const s = install(t);
    let client;
    let bodyEnded = false;
    const server = createServer((req, res) => {
      req.once('end', () => {
        bodyEnded = true;
      });
      req.once('data', () => setImmediate(() => client.end('x')));
      void s.routes.get('/api/up42/scenes')(req, res, () =>
        assert.fail('unexpected next'),
      );
    });
    t.after(
      () =>
        new Promise((resolve) => {
          server.closeAllConnections();
          server.close(resolve);
        }),
    );
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const port = server.address().port;
    const answer = await new Promise((resolve, reject) => {
      client = httpRequest(
        {
          host: '127.0.0.1',
          port,
          path: '/',
          method: 'POST',
          headers: {
            origin: `http://127.0.0.1:${port}`,
            'content-type': 'application/json',
          },
        },
        (res) => {
          let text = '';
          res.on('data', (chunk) => {
            text += chunk;
          });
          res.on('error', reject);
          res.on('end', () =>
            resolve({ status: res.statusCode, body: JSON.parse(text) }),
          );
        },
      );
      client.on('error', reject);
      t.after(() => client.destroy());
      client.write('x'.repeat(4097));
    });
    assert.equal(answer.status, 400);
    assert.deepEqual(answer.body, { error: 'bad_body' });
    assert.equal(bodyEnded, true);
    assert.equal(s.calls.length, 0);
  },
);
