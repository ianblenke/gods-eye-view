/**
 * @purpose Check the UP42 order routes, the guards, the ledger and the fixed destinations.
 * @covers pending:up42-orders
 * @run node --test --test-force-exit src/data/up42Orders.test.mjs
 * @needs Host Node with fake fetch, fake credentials and a temporary folder.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  writeFile,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { up42OrderProxy } from '../../server/providers/up42-orders/orders.js';
import { up42TaskingPlugins } from '../../server/providers/up42-orders/plugins.js';
import { createLedger } from '../../server/providers/up42-orders/ledger.js';
import {
  capOf,
  validateAccept,
  validateOrder,
  validateReject,
} from '../../server/providers/up42-orders/validate.js';
import { createClient } from '../../server/providers/up42/auth.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const PRODUCT = '12345678-abcd-1234-abcd-123456789abc';
const ORDER = 'aaaaaaaa-1111-2222-3333-444444444444';
const QUOTE = 'bbbbbbbb-1111-2222-3333-444444444444';
const OTHER_ORDER = 'cccccccc-1111-2222-3333-444444444444';
const TOKEN =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const ESTIMATE = 'https://api.up42.com/v2/orders/estimate';
const ORDER_URL = 'https://api.up42.com/v2/orders';
const LIST = 'https://api.up42.com/v2/tasking/quotation?page=0&size=100';
const QUOTE_URL = `https://api.up42.com/v2/tasking/quotation/${QUOTE}`;
const MERGE = 'application/merge-patch+json';
const request = (extra = {}) => ({
  dataProduct: PRODUCT,
  box: [10, 60, 10.02, 60.01],
  approvedCredits: 50,
  ...extra,
});
const json = (v, status = 200) => new Response(JSON.stringify(v), { status });
const empty = (status) => new Response(null, { status });
const quote = (extra = {}) => ({
  id: QUOTE,
  orderId: ORDER,
  creditsPrice: 40,
  decision: 'NOT_DECIDED',
  ...extra,
});
function good(url, init) {
  if (url === TOKEN)
    return json({ access_token: 'fake-token-ord', expires_in: 180 });
  if (url === ESTIMATE) return json({ summary: { totalCredits: 50 } });
  if (url.startsWith(ORDER_URL) && init.method === 'POST')
    return json({ results: [{ id: ORDER }] }, 202);
  if (url === LIST) return json({ content: [quote()] });
  if (url === QUOTE_URL && init.method === 'PATCH') return empty(200);
  assert.fail(`${init.method} ${url}`);
}
const settle = async () => {
  for (let i = 0; i < 8; i++) await new Promise((r) => setImmediate(r));
};
const envOf = (dir, extra = {}) => ({
  UP42_ORDERS: 'true',
  UP42_ORDER_MAX_CREDITS: '100',
  UP42_USERNAME: 'fake-user-ord',
  UP42_PASSWORD: 'fake-pass-ord',
  UP42_DATA_DIR: dir,
  ...extra,
});
function harness(plugins, hook = 'configureServer') {
  const routes = new Map();
  for (const p of plugins)
    p[hook]({ middlewares: { use: (path, fn) => routes.set(path, fn) } });
  async function send({
    route = 'order',
    method = route === 'quotation' ? 'GET' : 'POST',
    suffix = '/',
    value = request(),
    headers = {},
    encrypted = false,
    stream,
  } = {}) {
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
        socket: { encrypted, remoteAddress: '192.0.2.1' },
      },
    );
    const answer = { next: false };
    const path =
      route === 'order' ? '/api/up42/order' : `/api/up42/order/${route}`;
    await routes.get(path)(
      req,
      {
        writeHead(status, fields) {
          answer.status = status;
          answer.headers = fields;
        },
        end(text) {
          answer.body = JSON.parse(text);
        },
      },
      () => {
        answer.next = true;
      },
    );
    return answer;
  }
  return { send, routes };
}
async function setup(
  t,
  { env = {}, respond = good, hook, dir, plugin = true, fs } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: Date.UTC(2026, 10, 14, 12) });
  const folder = dir ?? (await mkdtemp(join(tmpdir(), 'gev-up42-orders-')));
  t.after(() => rm(folder, { recursive: true, force: true }).catch(() => {}));
  const calls = [];
  const environment = envOf(folder, env);
  const allowed = (url, init) =>
    url === TOKEN ||
    (url === ESTIMATE && init.method === 'POST') ||
    (url.startsWith(`${ORDER_URL}?workspaceId=`) && init.method === 'POST') ||
    (url === ORDER_URL && init.method === 'POST') ||
    (url === LIST && init.method === 'GET') ||
    (url === QUOTE_URL && init.method === 'PATCH');
  const options = {
    env: environment,
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      assert.equal(allowed(url, init), true, `${init.method} ${url}`);
      return respond(url, init, calls.length);
    },
  };
  const client = createClient(options);
  const proxy = up42OrderProxy({ ...options, client, fs });
  return {
    ...harness(plugin ? [proxy] : [], hook),
    env: environment,
    folder,
    calls,
    client,
    advance: (ms) => t.mock.timers.tick(ms),
    api: () => calls.filter((c) => c.url !== TOKEN),
    file: () => readFile(join(folder, 'orders.json'), 'utf8').then(JSON.parse),
  };
}
function errorOf(a, status, error, extra = {}) {
  assert.equal(a.status, status);
  assert.deepEqual(a.body, { error, ...extra });
  assert.equal(a.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.equal(a.headers['Cache-Control'], 'no-store');
}
async function placed(s) {
  const a = await s.send();
  assert.equal(a.status, 200);
  return a;
}

test('[up42-orders-001] serves the four paths in both hooks', async (t) => {
  for (const hook of ['configureServer', 'configurePreviewServer']) {
    const s = await setup(t, { hook });
    assert.deepEqual(
      [...s.routes.keys()],
      [
        '/api/up42/order/quotation',
        '/api/up42/order/accept',
        '/api/up42/order/reject',
        '/api/up42/order',
      ],
    );
    assert.equal((await s.send({ suffix: '/?x=1' })).status, 200);
    assert.equal(
      (
        await s.send({
          route: 'quotation',
          suffix: `/?orderId=${ORDER}`,
        })
      ).status,
      200,
    );
    for (const route of ['order', 'quotation', 'accept', 'reject'])
      for (const suffix of ['/child', '/child?q=1'])
        assert.deepEqual(await s.send({ route, suffix }), { next: true });
  }
});

test('[up42-orders-002] checks each method before the site', async (t) => {
  const s = await setup(t);
  for (const [route, method] of [
    ['order', 'GET'],
    ['accept', 'GET'],
    ['reject', 'PUT'],
    ['quotation', 'POST'],
  ])
    errorOf(
      await s.send({ route, method, headers: { origin: 'http://evil.test' } }),
      405,
      'Method not allowed',
    );
  assert.equal(s.calls.length, 0);
});

test('[up42-orders-003] checks the site before the switch and rate', async (t) => {
  const s = await setup(t, { env: { UP42_ORDERS: 'false' } });
  const bad = [
    { headers: { origin: 'http://evil.test' } },
    { headers: { 'x-forwarded-for': '203.0.113.9' } },
    { headers: { 'sec-fetch-site': 'cross-site' } },
  ];
  for (const route of ['order', 'accept', 'reject', 'quotation'])
    for (const extra of bad)
      errorOf(await s.send({ route, ...extra }), 403, 'cross_origin');
  for (const route of ['order', 'accept', 'reject'])
    errorOf(
      await s.send({ route, headers: { 'content-type': 'text/plain' } }),
      403,
      'cross_origin',
    );
  // A GET has no content type, and both protocols pass the site check.
  errorOf(
    await s.send({ route: 'quotation', headers: { 'content-type': 'x/y' } }),
    404,
    'orders_off',
  );
  errorOf(
    await s.send({
      encrypted: true,
      headers: { origin: 'https://localhost:5173' },
    }),
    404,
    'orders_off',
  );
});

test('[up42-orders-004] keeps all routes off and spends no rate count', async (t) => {
  for (const value of [undefined, '', 'TRUE', '1', 'false']) {
    const env = { UP42_ORDERS: value };
    const s = await setup(t, { env });
    if (value === undefined) delete s.env.UP42_ORDERS;
    for (let i = 0; i < 8; i++)
      for (const route of ['order', 'accept', 'reject', 'quotation'])
        errorOf(await s.send({ route }), 404, 'orders_off');
    assert.equal(s.calls.length, 0);
  }
  const s = await setup(t);
  for (let i = 0; i < 6; i++)
    assert.notEqual((await s.send({ value: '{' })).status, 429);
});

test('[up42-orders-005] refuses each spending route with no valid cap', async (t) => {
  for (const cap of [
    undefined,
    '',
    '0',
    '-1',
    '1.5',
    '1000001',
    'abc',
    '10000000',
  ]) {
    const s = await setup(t, { env: { UP42_ORDER_MAX_CREDITS: cap } });
    if (cap === undefined) delete s.env.UP42_ORDER_MAX_CREDITS;
    for (const route of ['order', 'accept', 'reject'])
      errorOf(await s.send({ route }), 503, 'no_cap');
    assert.equal(s.calls.length, 0);
  }
  for (const cap of ['1', '1000000']) {
    const s = await setup(t, { env: { UP42_ORDER_MAX_CREDITS: cap } });
    assert.notEqual((await s.send({ value: '{' })).status, 503);
  }
  assert.equal(capOf(100), null);
  assert.equal(capOf('1000000'), 1000000);
});

test('[up42-orders-006] limits all routes together to six a minute', async (t) => {
  const s = await setup(t);
  for (let i = 0; i < 3; i++)
    assert.equal((await s.send({ value: '{' })).status, 400);
  for (let i = 0; i < 3; i++)
    assert.equal(
      (await s.send({ route: 'quotation', suffix: '/?orderId=x' })).status,
      400,
    );
  const last = await s.send({ value: '{' });
  errorOf(last, 429, 'rate_limited');
  assert.equal(last.headers['Retry-After'], '60');
  s.advance(60001);
  assert.equal((await s.send({ value: '{' })).status, 400);
});

const ORDER_CASES = [
  ['not JSON', '{'],
  ['an array', '[]'],
  ['an extra key', request({ checks: ['estimate'] })],
  ['no product', request({ dataProduct: undefined })],
  ['a bad product', request({ dataProduct: 'x' })],
  ['no credits', request({ approvedCredits: undefined })],
  ['zero credits', request({ approvedCredits: 0 })],
  ['negative credits', request({ approvedCredits: -1 })],
  ['text credits', request({ approvedCredits: '50' })],
  ['credits above the cap', request({ approvedCredits: 101 })],
  ['a bad parameter', request({ params: { nope: 1 } })],
];
for (const [name, value] of ORDER_CASES)
  test(`[up42-orders-007] refuses an order with ${name}`, async (t) => {
    const s = await setup(t);
    errorOf(await s.send({ value }), 400, 'bad_body');
    assert.equal(s.calls.length, 0);
  });
test('[up42-orders-007] gives the box errors and keeps the facts', async (t) => {
  const s = await setup(t);
  errorOf(
    await s.send({ value: request({ box: [1, 1, 0, 0] }) }),
    400,
    'bad_bbox',
  );
  errorOf(
    await s.send({ value: request({ box: [0, 0, 5, 5] }) }),
    400,
    'area_too_large',
    { maxKm2: 2500 },
  );
  assert.equal(
    (await s.send({ stream: Readable.from([Buffer.alloc(70000)]) })).status,
    400,
  );
  assert.equal(s.calls.length, 0);
  const ok = validateOrder(
    JSON.stringify(
      request({
        dataProduct: PRODUCT.toUpperCase(),
        params: { priority: 'HIGH', maxCloudCover: 10 },
      }),
    ),
    100,
  );
  assert.deepEqual(ok, {
    ok: true,
    dataProduct: PRODUCT,
    box: [10, 60, 10.02, 60.01],
    params: { maxCloudCover: 10, priority: 'HIGH' },
    approvedCredits: 50,
  });
  assert.equal(
    validateOrder(JSON.stringify(request({ approvedCredits: 100 })), 100).ok,
    true,
  );
});

test('[up42-orders-008] refuses each route with no credentials', async (t) => {
  for (const key of ['UP42_USERNAME', 'UP42_PASSWORD'])
    for (const value of [undefined, '', '  ']) {
      const s = await setup(t, { env: { [key]: value } });
      if (value === undefined) delete s.env[key];
      for (const [route, body] of [
        ['order', request()],
        ['accept', { quotationId: QUOTE, approvedCredits: 40 }],
        ['reject', { quotationId: QUOTE }],
      ])
        errorOf(await s.send({ route, value: body }), 503, 'no_credentials', {
          keyRequired: true,
        });
      errorOf(
        await s.send({ route: 'quotation', suffix: `/?orderId=${ORDER}` }),
        503,
        'no_credentials',
        { keyRequired: true },
      );
      assert.equal(s.calls.length, 0);
    }
});

test('[up42-orders-009] checks the price before the order call', async (t) => {
  const cases = [
    [{ summary: { totalCredits: 51 } }, 50, 100, 409, 'over_approved'],
    [{ summary: { totalCredits: 101 } }, 100, 100, 409, 'over_cap'],
    [{ summary: { totalCredits: 'x' } }, 50, 100, 502, 'bad_upstream'],
    [{ summary: { totalCredits: -1 } }, 50, 100, 502, 'bad_upstream'],
    [{}, 50, 100, 502, 'bad_upstream'],
    [
      { summary: { totalCredits: 5 }, note: 'fake-pass-ord' },
      50,
      100,
      502,
      'bad_upstream',
    ],
  ];
  for (const [body, approved, cap, status, error] of cases) {
    const s = await setup(t, {
      env: { UP42_ORDER_MAX_CREDITS: String(cap) },
      respond: (url, init) => (url === ESTIMATE ? json(body) : good(url, init)),
    });
    errorOf(
      await s.send({ value: request({ approvedCredits: approved }) }),
      status,
      error,
    );
    assert.deepEqual(
      s.api().map((c) => c.url),
      [ESTIMATE],
    );
  }
  for (const make of [() => json({}, 500), () => json({}, 404)]) {
    const s = await setup(t, {
      respond: (u, i) => (u === ESTIMATE ? make() : good(u, i)),
    });
    errorOf(await s.send(), 502, 'upstream_failed');
    assert.equal(s.api().length, 1);
  }
  const equal = await setup(t, {
    env: { UP42_ORDER_MAX_CREDITS: '50' },
  });
  assert.equal((await equal.send()).status, 200);
});

test('[up42-orders-010] places one order with the body of the quote', async (t) => {
  const s = await setup(t);
  const a = await s.send({ value: request({ params: { priority: 'HIGH' } }) });
  assert.equal(a.status, 200);
  assert.deepEqual(a.body, { orderId: ORDER, credits: 50, spent: false });
  const [est, order] = s.api();
  assert.deepEqual([est.url, est.init.method], [ESTIMATE, 'POST']);
  assert.deepEqual([order.url, order.init.method], [ORDER_URL, 'POST']);
  assert.equal(order.init.headers['Content-Type'], 'application/json');
  assert.equal(order.init.headers.Authorization, 'Bearer fake-token-ord');
  assert.deepEqual(JSON.parse(order.init.body), {
    dataProduct: PRODUCT,
    displayName: 'gev-order',
    featureCollection: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
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
          properties: {},
        },
      ],
    },
    params: { priority: 'HIGH' },
  });
  assert.equal(est.init.body, order.init.body);
  assert.equal(s.api().length, 2);
  const w = '99999999-aaaa-bbbb-cccc-dddddddddddd';
  const withSpace = await setup(t, { env: { UP42_WORKSPACE_ID: w } });
  await placed(withSpace);
  assert.equal(withSpace.api()[1].url, `${ORDER_URL}?workspaceId=${w}`);
  for (const bad of ['x', `${w}&a=1`, '../x']) {
    const s2 = await setup(t, { env: { UP42_WORKSPACE_ID: bad } });
    errorOf(await s2.send(), 503, 'bad_workspace');
    assert.equal(s2.calls.length, 0);
  }
});

const UNCLEAR = [
  ['a 500 answer', () => json({}, 500)],
  ['a 503 answer', () => json({}, 503)],
  ['a fault', () => Promise.reject(new Error('down'))],
  ['no id', () => json({ results: [{}] }, 202)],
  ['no results', () => json({}, 202)],
  ['a bad id', () => json({ results: [{ id: 'x' }] }, 202)],
  [
    'a secret',
    () => json({ results: [{ id: ORDER }], n: 'fake-user-ord' }, 202),
  ],
];
for (const [name, make] of UNCLEAR)
  test(`[up42-orders-011] stops after an order with ${name}`, async (t) => {
    const s = await setup(t, {
      respond: (u, i) => (u === ORDER_URL ? make() : good(u, i)),
    });
    errorOf(await s.send(), 502, 'order_unclear');
    assert.equal(s.api().filter((c) => c.url === ORDER_URL).length, 1);
    const again = await s.send();
    assert.notEqual(again.status, 409);
    assert.equal(s.api().filter((c) => c.url === ORDER_URL).length, 2);
    assert.equal((await s.file()).orders.length, 0);
  });
test('[up42-orders-011] reports a refused order and keeps the rest', async (t) => {
  for (const [status, error] of [
    [400, 'order_refused'],
    [404, 'order_refused'],
    [402, 'insufficient_balance'],
  ]) {
    const s = await setup(t, {
      respond: (u, i) => (u === ORDER_URL ? json({}, status) : good(u, i)),
    });
    errorOf(
      await s.send(),
      error === 'insufficient_balance' ? 402 : 502,
      error,
    );
    assert.equal(s.api().filter((c) => c.url === ORDER_URL).length, 1);
  }
});

test('[up42-orders-012] refuses a duplicate and a simultaneous order', async (t) => {
  let release;
  const gate = new Promise((r) => (release = r));
  const s = await setup(t, {
    env: { UP42_DAILY_ORDERS: '5' },
    respond: async (u, i) => {
      if (u === ORDER_URL) await gate;
      return good(u, i);
    },
  });
  const first = s.send();
  await settle();
  errorOf(await s.send(), 409, 'busy');
  release();
  assert.equal((await first).status, 200);
  const calls = s.calls.length;
  errorOf(await s.send(), 409, 'duplicate', { orderId: ORDER });
  assert.equal(s.calls.length, calls);
  errorOf(
    await s.send({ value: request({ approvedCredits: 60 }) }),
    409,
    'duplicate',
    { orderId: ORDER },
  );
  assert.equal(
    (await s.send({ value: request({ box: [10, 60, 10.03, 60.01] }) })).status,
    200,
  );
  s.advance(599999);
  assert.equal((await s.send()).status, 409);
  s.advance(1);
  assert.equal((await s.send()).status, 200);
});

test('[up42-orders-013] counts the orders and resets at the day change', async (t) => {
  const cases = [
    [undefined, 2],
    ['0', 2],
    ['21', 2],
    ['1.5', 2],
    ['20', 20],
    ['3', 3],
  ];
  for (const [value, limit] of cases) {
    const s = await setup(t, { env: { UP42_DAILY_ORDERS: value } });
    if (value === undefined) delete s.env.UP42_DAILY_ORDERS;
    for (let i = 0; i < limit; i++) {
      s.advance(600001);
      const box = [10, 60, 10.02 + i / 1000, 60.01];
      assert.equal((await s.send({ value: request({ box }) })).status, 200);
      s.advance(0);
      if (i % 5 === 4) s.advance(60001);
    }
    s.advance(600001);
    const before = s.calls.length;
    const a = await s.send({ value: request({ box: [10, 60, 10.5, 60.01] }) });
    errorOf(a, 429, 'budget', { used: limit, limit });
    assert.equal(s.calls.length, before);
  }
  const s = await setup(t);
  for (let i = 0; i < 2; i++)
    await s.send({ value: request({ box: [10, 60, 10.02 + i / 100, 60.01] }) });
  s.advance(24 * 3600000);
  assert.equal(
    (await s.send({ value: request({ box: [10, 60, 10.2, 60.01] }) })).status,
    200,
  );
  assert.equal((await s.file()).counts.orders, 1);
});

test('[up42-orders-014] reads the quotation of an own order', async (t) => {
  const s = await setup(t);
  const url = (id) => ({ route: 'quotation', suffix: `/?orderId=${id}` });
  errorOf(await s.send(url('x')), 400, 'bad_body');
  errorOf(await s.send({ route: 'quotation' }), 400, 'bad_body');
  errorOf(await s.send(url(ORDER)), 404, 'unknown_order');
  assert.equal(s.calls.length, 0);
  await placed(s);
  const a = await s.send(url(ORDER.toUpperCase()));
  assert.equal(a.status, 200);
  assert.deepEqual(a.body, {
    quotation: { id: QUOTE, credits: 40, decision: 'NOT_DECIDED' },
  });
  const last = s.api().at(-1);
  assert.deepEqual([last.url, last.init.method], [LIST, 'GET']);
  assert.equal(last.init.body, undefined);
  assert.equal(last.init.headers['Content-Type'], undefined);
  const none = await setup(t, {
    respond: (u, i) =>
      u === LIST
        ? json({
            content: [
              quote({ orderId: OTHER_ORDER }),
              { id: 'x' },
              quote({ id: 'q' }),
              quote({ creditsPrice: -1 }),
              quote({ decision: 5 }),
            ],
          })
        : good(u, i),
  });
  await placed(none);
  assert.deepEqual((await none.send(url(ORDER))).body, { quotation: null });
  for (const make of [
    () => json({}),
    () => json({ content: [], n: 'fake-pass-ord' }),
  ]) {
    const bad = await setup(t, {
      respond: (u, i) => (u === LIST ? make() : good(u, i)),
    });
    await placed(bad);
    errorOf(await bad.send(url(ORDER)), 502, 'bad_upstream');
  }
  const down = await setup(t, {
    respond: (u, i) => (u === LIST ? json({}, 500) : good(u, i)),
  });
  await placed(down);
  errorOf(await down.send(url(ORDER)), 502, 'upstream_failed');
});

test('[up42-orders-015] refuses an accept request with a bad body', async (t) => {
  const s = await setup(t);
  for (const value of [
    '{',
    '[]',
    { quotationId: QUOTE },
    { approvedCredits: 40 },
    { quotationId: 'x', approvedCredits: 40 },
    { quotationId: QUOTE, approvedCredits: 0 },
    { quotationId: QUOTE, approvedCredits: '40' },
    { quotationId: QUOTE, approvedCredits: 40, extra: 1 },
  ]) {
    s.advance(60001);
    errorOf(await s.send({ route: 'accept', value }), 400, 'bad_body');
  }
  for (const value of [
    '{',
    { quotationId: 'x' },
    { quotationId: QUOTE, a: 1 },
    {},
  ]) {
    s.advance(60001);
    errorOf(await s.send({ route: 'reject', value }), 400, 'bad_body');
  }
  assert.equal(s.calls.length, 0);
  assert.deepEqual(
    validateAccept(
      JSON.stringify({
        quotationId: QUOTE.toUpperCase(),
        approvedCredits: 4.5,
      }),
    ),
    {
      ok: true,
      quotationId: QUOTE,
      approvedCredits: 4.5,
    },
  );
  assert.deepEqual(
    validateReject(JSON.stringify({ quotationId: QUOTE.toUpperCase() })),
    {
      ok: true,
      quotationId: QUOTE,
    },
  );
});

const ACCEPT = { quotationId: QUOTE, approvedCredits: 40 };
const CHECKS = [
  ['no quotation', [], 404, 'unknown_quotation'],
  ['another order', [quote({ orderId: OTHER_ORDER })], 409, 'not_ours'],
  ['an accepted quotation', [quote({ decision: 'ACCEPTED' })], 409, 'decided'],
  ['a rejected quotation', [quote({ decision: 'REJECTED' })], 409, 'decided'],
  ['a price above the cap', [quote({ creditsPrice: 101 })], 409, 'over_cap'],
  [
    'a price above the approval',
    [quote({ creditsPrice: 40.5 })],
    409,
    'over_approved',
  ],
];
for (const [name, content, status, error] of CHECKS)
  test(`[up42-orders-016] refuses to accept ${name}`, async (t) => {
    const s = await setup(t, {
      respond: (u, i) => (u === LIST ? json({ content }) : good(u, i)),
    });
    await placed(s);
    // The order of this test uses the order id of the ledger.
    const answer = await s.send({ route: 'accept', value: ACCEPT });
    errorOf(answer, status, error);
    assert.equal(
      s.api().some((c) => c.init.method === 'PATCH'),
      false,
    );
  });
test('[up42-orders-016] reads the list first and lets an equal price pass', async (t) => {
  const s = await setup(t, {
    env: { UP42_ORDER_MAX_CREDITS: '40' },
    respond: (u, i) =>
      u === ESTIMATE ? json({ summary: { totalCredits: 40 } }) : good(u, i),
  });
  assert.equal(
    (await s.send({ value: request({ approvedCredits: 40 }) })).status,
    200,
  );
  const a = await s.send({ route: 'accept', value: ACCEPT });
  assert.equal(a.status, 200);
  const calls = s.api().map((c) => c.init.method);
  assert.deepEqual(calls.slice(-2), ['GET', 'PATCH']);
  const down = await setup(t, {
    respond: (u, i) => (u === LIST ? json({}, 500) : good(u, i)),
  });
  await placed(down);
  errorOf(
    await down.send({ route: 'accept', value: ACCEPT }),
    502,
    'upstream_failed',
  );
});

test('[up42-orders-017] accepts one quotation with one PATCH', async (t) => {
  const s = await setup(t);
  await placed(s);
  const a = await s.send({
    route: 'accept',
    value: { quotationId: QUOTE.toUpperCase(), approvedCredits: 40 },
  });
  assert.equal(a.status, 200);
  assert.deepEqual(a.body, { accepted: true, credits: 40 });
  const patches = s.api().filter((c) => c.init.method === 'PATCH');
  assert.equal(patches.length, 1);
  assert.equal(patches[0].url, QUOTE_URL);
  assert.equal(patches[0].init.headers['Content-Type'], MERGE);
  assert.equal(patches[0].init.body, '{"decision":"ACCEPTED"}');
  const nocontent = await setup(t, {
    respond: (u, i) => (i.method === 'PATCH' ? empty(204) : good(u, i)),
  });
  await placed(nocontent);
  assert.equal(
    (await nocontent.send({ route: 'accept', value: ACCEPT })).status,
    200,
  );
  const poor = await setup(t, {
    respond: (u, i) => (i.method === 'PATCH' ? json({}, 402) : good(u, i)),
  });
  await placed(poor);
  errorOf(
    await poor.send({ route: 'accept', value: ACCEPT }),
    402,
    'insufficient_balance',
  );
  const refused = await setup(t, {
    respond: (u, i) => (i.method === 'PATCH' ? json({}, 409) : good(u, i)),
  });
  await placed(refused);
  errorOf(
    await refused.send({ route: 'accept', value: ACCEPT }),
    502,
    'accept_refused',
  );
});

test('[up42-orders-018] stops after an unclear accept', async (t) => {
  for (const make of [
    () => json({}, 500),
    () => Promise.reject(new Error('down')),
    () => json({}, 502),
  ]) {
    let accepted = false;
    const s = await setup(t, {
      respond: (u, i) => {
        if (i.method === 'PATCH') {
          accepted = true;
          return make();
        }
        if (u === LIST && accepted)
          return json({ content: [quote({ decision: 'ACCEPTED' })] });
        return good(u, i);
      },
    });
    await placed(s);
    errorOf(
      await s.send({ route: 'accept', value: ACCEPT }),
      502,
      'accept_unclear',
      { maySpend: true },
    );
    assert.equal(s.api().filter((c) => c.init.method === 'PATCH').length, 1);
    s.advance(60001);
    errorOf(await s.send({ route: 'accept', value: ACCEPT }), 409, 'decided');
    assert.equal(s.api().filter((c) => c.init.method === 'PATCH').length, 1);
  }
});

test('[up42-orders-019] counts the accepts with an own count', async (t) => {
  const s = await setup(t, { env: { UP42_DAILY_ORDERS: '1' } });
  await placed(s);
  const down = await setup(t, {
    respond: (u, i) => (i.method === 'PATCH' ? json({}, 500) : good(u, i)),
    env: { UP42_DAILY_ORDERS: '1' },
  });
  await placed(down);
  errorOf(
    await down.send({ route: 'accept', value: ACCEPT }),
    502,
    'accept_unclear',
    { maySpend: true },
  );
  down.advance(60001);
  const patches = () =>
    down.api().filter((c) => c.init.method === 'PATCH').length;
  errorOf(await down.send({ route: 'accept', value: ACCEPT }), 429, 'budget', {
    used: 1,
    limit: 1,
  });
  assert.equal(patches(), 1);
  assert.equal((await s.send({ route: 'accept', value: ACCEPT })).status, 200);
  assert.deepEqual((await s.file()).counts, { orders: 1, accepts: 1 });
});

test('[up42-orders-020] refuses a second accept while the first runs', async (t) => {
  let release;
  const gate = new Promise((r) => (release = r));
  const s = await setup(t, {
    respond: async (u, i) => {
      if (i.method === 'PATCH') await gate;
      return good(u, i);
    },
  });
  await placed(s);
  const first = s.send({ route: 'accept', value: ACCEPT });
  await settle();
  errorOf(await s.send({ route: 'accept', value: ACCEPT }), 409, 'busy');
  errorOf(
    await s.send({ route: 'reject', value: { quotationId: QUOTE } }),
    409,
    'busy',
  );
  release();
  assert.equal((await first).status, 200);
  assert.equal(s.api().filter((c) => c.init.method === 'PATCH').length, 1);
});

test('[up42-orders-021] reports rejected credentials', async (t) => {
  for (const [route, value] of [
    ['order', request()],
    ['accept', ACCEPT],
    ['reject', { quotationId: QUOTE }],
    ['quotation', null],
  ]) {
    let ready = false;
    const s = await setup(t, {
      respond: (u, i) => {
        if (ready && u !== TOKEN) return json({}, 401);
        return good(u, i);
      },
    });
    await placed(s);
    ready = true;
    s.advance(60001);
    errorOf(
      await s.send(
        route === 'quotation'
          ? { route, suffix: `/?orderId=${ORDER}` }
          : {
              route,
              value:
                route === 'order'
                  ? request({ box: [10, 60, 10.04, 60.01] })
                  : value,
            },
      ),
      403,
      'credentials_rejected',
      { keyRejected: true },
    );
  }
  for (const route of ['accept', 'reject']) {
    const p = await setup(t, {
      respond: (u, i) => (i.method === 'PATCH' ? json({}, 401) : good(u, i)),
    });
    await placed(p);
    errorOf(
      await p.send({
        route,
        value: route === 'accept' ? ACCEPT : { quotationId: QUOTE },
      }),
      403,
      'credentials_rejected',
      { keyRejected: true },
    );
  }
  const s = await setup(t, {
    respond: (u, i) => (u === TOKEN ? json({}, 401) : good(u, i)),
  });
  errorOf(await s.send(), 403, 'credentials_rejected', { keyRejected: true });
  assert.equal(s.calls.filter((c) => c.url !== TOKEN).length, 0);
});

test('[up42-orders-022] sends only the five listed calls', async (t) => {
  const seen = new Set();
  const shapes = [
    () => good,
    () => (u, i) => (u === ORDER_URL ? json({}, 500) : good(u, i)),
    () => (u, i) => (i.method === 'PATCH' ? json({}, 500) : good(u, i)),
    () => (u, i) => (u === LIST ? json({}, 401) : good(u, i)),
  ];
  for (const make of shapes) {
    const s = await setup(t, { respond: make() });
    for (const send of [
      { value: request() },
      { value: request({ box: [10, 60, 10.03, 60.01] }) },
      { route: 'quotation', suffix: `/?orderId=${ORDER}` },
      { route: 'accept', value: ACCEPT },
      { route: 'reject', value: { quotationId: QUOTE } },
    ]) {
      s.advance(60001);
      await s.send(send);
    }
    for (const c of s.api()) seen.add(`${c.init.method} ${c.url}`);
  }
  assert.deepEqual(
    [...seen].sort(),
    [
      `GET ${LIST}`,
      `PATCH ${QUOTE_URL}`,
      `POST ${ORDER_URL}`,
      `POST ${ESTIMATE}`,
    ].sort(),
  );
  const dir = new URL('../../server/providers/up42-orders/', import.meta.url);
  let text = '';
  for (const name of await readdir(dir))
    text += await readFile(new URL(name, dir), 'utf8');
  const one = (re) => (text.match(re) ?? []).length;
  assert.equal(
    one(/extensions|cancellation|eulas|download-url|'DELETE'|'PUT'/g),
    0,
  );
  assert.equal(one(/\bACCEPTED\b/g), 1);
  assert.equal(one(/\bREJECTED\b/g), 1);
  assert.deepEqual(
    text.match(/\/v2\/[a-z/?=&0-9]+/g).sort(),
    [
      '/v2/orders',
      '/v2/orders/estimate',
      '/v2/tasking/quotation/',
      '/v2/tasking/quotation?page=0&size=100',
    ].sort(),
  );
});

test('[up42-orders-023] keeps secrets out of the answers and the log', async (t) => {
  const logs = [];
  for (const m of ['log', 'info', 'warn', 'error', 'debug', 'trace', 'dir'])
    t.mock.method(console, m, (...a) => logs.push(a.join(' ')));
  const s = await setup(t, {
    respond: (u, i) =>
      u === ESTIMATE
        ? json({ summary: { totalCredits: 1 }, x: 'fake-pass-ord' })
        : good(u, i),
  });
  const a = await s.send();
  errorOf(a, 502, 'bad_upstream');
  const text = JSON.stringify(a) + logs.join('\n');
  for (const secret of ['fake-user-ord', 'fake-pass-ord', 'fake-token-ord'])
    assert.equal(text.includes(secret), false);
});

test('[up42-orders-024] shares one client in the local list', async (t) => {
  const old = { ...process.env };
  Object.assign(
    process.env,
    envOf(await mkdtemp(join(tmpdir(), 'gev-up42-list-'))),
  );
  t.after(() => {
    for (const k of Object.keys(process.env))
      if (!(k in old)) delete process.env[k];
    Object.assign(process.env, old);
  });
  let logins = 0;
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    if (url === TOKEN) logins++;
    return good(url, init);
  });
  t.mock.method(console, 'log', () => {});
  const names = localProviderPlugins({ gemini: {} }).map((p) => p.name);
  assert.equal(names.filter((n) => n === 'up42-orders').length, 1);
  assert.equal(names.indexOf('up42-orders'), names.indexOf('up42-quotes') + 1);
  const plugins = up42TaskingPlugins();
  const h = harness(plugins.filter((p) => p.name === 'up42-orders'));
  assert.equal((await h.send()).status, 200);
  assert.equal(logins, 1);
  const own = up42TaskingPlugins({
    client: createClient({
      env: process.env,
      fetchImpl: fetch,
      now: Date.now,
      setTimer: () => 1,
      clearTimer: () => {},
    }),
  });
  assert.equal(own.length, plugins.length);
  assert.equal(own.at(-1).name, 'up42-orders');
  delete process.env.UP42_ORDERS;
  errorOf(
    await harness([up42OrderProxy({ client: {} })]).send(),
    404,
    'orders_off',
  );
});

test('[up42-orders-025] rejects one quotation with one PATCH', async (t) => {
  const s = await setup(t, {
    env: { UP42_DAILY_ORDERS: '1', UP42_ORDER_MAX_CREDITS: '1' },
  });
  // The cap and the count do not apply to a reject.
  const ok = await setup(t, { env: { UP42_DAILY_ORDERS: '1' } });
  await placed(ok);
  const a = await ok.send({ route: 'reject', value: { quotationId: QUOTE } });
  assert.equal(a.status, 200);
  assert.deepEqual(a.body, { rejected: true });
  const patch = ok.api().filter((c) => c.init.method === 'PATCH');
  assert.equal(patch.length, 1);
  assert.equal(patch[0].url, QUOTE_URL);
  assert.equal(patch[0].init.headers['Content-Type'], MERGE);
  assert.equal(patch[0].init.body, '{"decision":"REJECTED"}');
  assert.deepEqual((await ok.file()).counts, { orders: 1, accepts: 0 });
  assert.equal(s.calls.length, 0);
  for (const [content, status, error] of [
    [[], 404, 'unknown_quotation'],
    [[quote({ orderId: OTHER_ORDER })], 409, 'not_ours'],
    [[quote({ decision: 'ACCEPTED' })], 409, 'decided'],
  ]) {
    const x = await setup(t, {
      respond: (u, i) => (u === LIST ? json({ content }) : good(u, i)),
    });
    await placed(x);
    errorOf(
      await x.send({ route: 'reject', value: { quotationId: QUOTE } }),
      status,
      error,
    );
    assert.equal(
      x.api().some((c) => c.init.method === 'PATCH'),
      false,
    );
  }
  for (const [make, error, extra] of [
    [() => json({}, 500), 'reject_unclear', {}],
    [() => json({}, 400), 'reject_refused', {}],
  ]) {
    const y = await setup(t, {
      respond: (u, i) => (i.method === 'PATCH' ? make() : good(u, i)),
    });
    await placed(y);
    errorOf(
      await y.send({ route: 'reject', value: { quotationId: QUOTE } }),
      502,
      error,
      extra,
    );
    assert.equal(y.api().filter((c) => c.init.method === 'PATCH').length, 1);
  }
});

test('[up42-orders-026] keeps the ledger over a restart', async (t) => {
  const first = await setup(t);
  await placed(first);
  const second = await setup(t, { dir: first.folder });
  errorOf(await second.send(), 409, 'duplicate', { orderId: ORDER });
  const a = await second.send({
    route: 'quotation',
    suffix: `/?orderId=${ORDER}`,
  });
  assert.equal(a.status, 200);
  assert.equal(
    (await second.send({ route: 'accept', value: ACCEPT })).status,
    200,
  );
  assert.deepEqual((await second.file()).counts, { orders: 1, accepts: 1 });
  second.advance(24 * 3600000);
  const third = await setup(t, { dir: first.folder });
  third.advance(24 * 3600000);
  assert.equal(
    (await third.send({ value: request({ box: [10, 60, 10.5, 60.01] }) }))
      .status,
    200,
  );
  assert.deepEqual((await third.file()).counts, { orders: 1, accepts: 0 });
  const files = await readdir(first.folder);
  assert.deepEqual(files, ['orders.json']);
  const fresh = await setup(t);
  assert.equal((await fresh.send()).status, 200);
  const ledger = createLedger({ dir: first.folder, now: Date.now });
  assert.equal(await ledger.ready(), true);
  assert.equal(await ledger.ready(), true);
  for (let i = 0; i < 501; i++)
    await ledger.add({ id: ORDER, key: `k${i}`, credits: 1 });
  assert.equal(
    (await readFile(join(first.folder, 'orders.json'), 'utf8')).split('"key"')
      .length - 1,
    500,
  );
});

test('[up42-orders-027] stops when the ledger fails', async (t) => {
  const bodies = [
    [
      'an invalid file',
      async (d) => writeFile(join(d, 'orders.json'), '{"day":1}'),
    ],
    ['a broken file', async (d) => writeFile(join(d, 'orders.json'), '{')],
    [
      'a bad order',
      async (d) =>
        writeFile(
          join(d, 'orders.json'),
          JSON.stringify({
            day: '2026-11-14',
            counts: { orders: 0, accepts: 0 },
            orders: [{ id: 'x' }],
          }),
        ),
    ],
    [
      'a bad count',
      async (d) =>
        writeFile(
          join(d, 'orders.json'),
          JSON.stringify({
            day: '2026-11-14',
            counts: { orders: -1, accepts: 0 },
            orders: [],
          }),
        ),
    ],
    ['a read fault', async (d) => mkdir(join(d, 'orders.json'))],
  ];
  for (const [, prepare] of bodies) {
    const dir = await mkdtemp(join(tmpdir(), 'gev-up42-bad-'));
    await prepare(dir);
    const s = await setup(t, { dir });
    for (const [route, value] of [
      ['order', request()],
      ['accept', ACCEPT],
      ['reject', { quotationId: QUOTE }],
    ])
      errorOf(await s.send({ route, value }), 503, 'store_failed');
    errorOf(
      await s.send({ route: 'quotation', suffix: `/?orderId=${ORDER}` }),
      503,
      'store_failed',
    );
    assert.equal(s.calls.length, 0);
  }
  const dir = await mkdtemp(join(tmpdir(), 'gev-up42-file-'));
  await writeFile(join(dir, 'blocker'), 'x');
  const s = await setup(t, { dir: join(dir, 'blocker', 'sub') });
  errorOf(await s.send(), 503, 'store_failed');
  assert.equal(s.calls.length, 0);
  // A write fault after an order keeps the order in memory.
  const late = await setup(t);
  const a = await late.send({
    value: request({ box: [10, 60, 10.01, 60.01] }),
  });
  assert.equal(a.status, 200);
  await rm(late.folder, { recursive: true });
  await writeFile(late.folder, 'x');
  const b = await late.send({
    route: 'quotation',
    suffix: `/?orderId=${ORDER}`,
  });
  assert.equal(b.status, 200);
  await rm(late.folder);
});

test('[up42-orders-027] stops with no call when a count cannot be written', async (t) => {
  const fs = {
    readFile: async () =>
      Promise.reject(Object.assign(new Error('none'), { code: 'ENOENT' })),
    mkdir: async () => {},
    writeFile: async () => Promise.reject(new Error('full')),
    rename: async () => {},
  };
  const s = await setup(t, { fs });
  errorOf(await s.send(), 503, 'store_failed');
  errorOf(await s.send(), 503, 'store_failed');
  assert.equal(s.calls.length, 0);
  const ok = { ...fs, writeFile: async () => {} };
  let write = ok.writeFile;
  const flaky = {
    ...ok,
    writeFile: (...a) => write(...a),
    readFile: async () =>
      Promise.reject(Object.assign(new Error('none'), { code: 'ENOENT' })),
  };
  const f = await setup(t, { fs: flaky });
  await placed(f);
  write = async () => Promise.reject(new Error('full'));
  f.advance(60001);
  errorOf(
    await f.send({ route: 'accept', value: ACCEPT }),
    503,
    'store_failed',
  );
  assert.equal(
    f.api().some((c) => c.init.method === 'PATCH'),
    false,
  );
});

test('[up42-orders-028] mounts the volume for the ledger', async () => {
  const read = (p) => readFile(new URL(`../../${p}`, import.meta.url), 'utf8');
  const compose = await read('compose.yaml');
  assert.match(compose, /^ {6}- gev-up42:\/app\/\.gev-up42$/m);
  assert.match(compose, /^ {2}gev-up42:$/m);
  assert.match(await read('Dockerfile'), /\.gev-up42/);
  assert.match(
    await read('server/standalone/unwatched-cache.js'),
    /\*\*\/\.gev-up42\/\*\*/,
  );
  assert.match(await read('build/vite.js'), /\*\*\/\.gev-up42\/\*\*/);
});

test('[up42-orders-029] calls the API with a fixed origin', async (t) => {
  const calls = [];
  let status = 200;
  let logins = 0;
  const client = createClient({
    env: { UP42_USERNAME: 'fake-user-ord', UP42_PASSWORD: 'fake-pass-ord' },
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      if (url === TOKEN) {
        logins++;
        return json({ access_token: `fake-token-${logins}`, expires_in: 180 });
      }
      return typeof status === 'function'
        ? status(init)
        : json({ a: 1 }, status);
    },
  });
  const opts = { statuses: [200] };
  for (const method of ['DELETE', 'PUT', 'get', '']) {
    assert.deepEqual(await client.call(method, ESTIMATE, opts), {
      ok: false,
      kind: 'bad_upstream',
    });
  }
  for (const url of [
    'http://api.up42.com/x',
    'https://api.up42.com.evil.test/x',
    'https://auth.up42.com/x',
    'nope',
  ])
    assert.deepEqual(await client.call('GET', url, opts), {
      ok: false,
      kind: 'bad_upstream',
    });
  assert.equal(calls.length, 0);
  assert.deepEqual(await client.call('GET', LIST, opts), {
    ok: true,
    value: { a: 1 },
  });
  const get = calls.at(-1);
  assert.equal(get.init.body, undefined);
  assert.equal(get.init.headers['Content-Type'], undefined);
  await client.call('POST', ESTIMATE, { ...opts, body: { b: 2 } });
  assert.equal(calls.at(-1).init.headers['Content-Type'], 'application/json');
  assert.equal(calls.at(-1).init.body, '{"b":2}');
  await client.call('PATCH', QUOTE_URL, {
    ...opts,
    body: { c: 3 },
    type: MERGE,
  });
  assert.equal(calls.at(-1).init.headers['Content-Type'], MERGE);
  assert.deepEqual(await client.call('GET', LIST, { statuses: [202] }), {
    ok: false,
    kind: 'upstream_failed',
    status: 200,
  });
  status = () => json({}, 404);
  assert.deepEqual(await client.call('GET', LIST, opts), {
    ok: false,
    kind: 'upstream_failed',
    status: 404,
  });
  let n = 0;
  status = () => (n++ === 0 ? json({}, 401) : json({ again: 1 }));
  assert.deepEqual(await client.call('GET', LIST, opts), {
    ok: true,
    value: { again: 1 },
  });
  assert.equal(logins, 2);
  status = () => json({}, 401);
  assert.deepEqual(await client.call('GET', LIST, opts), {
    ok: false,
    kind: 'credentials_rejected',
  });
  status = () => empty(204);
  assert.deepEqual(
    await client.call('PATCH', QUOTE_URL, {
      statuses: [204],
      discard: true,
      body: {},
    }),
    { ok: true, value: null },
  );
  logins = 0;
  const second = createClient({
    env: { UP42_USERNAME: 'fake-user-ord', UP42_PASSWORD: 'fake-pass-ord' },
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    fetchImpl: async (url) => {
      if (url === TOKEN) {
        logins++;
        return logins === 1
          ? json({ access_token: 'fake-token-x', expires_in: 180 })
          : json({}, 401);
      }
      return json({}, 401);
    },
  });
  assert.deepEqual(await second.call('GET', LIST, opts), {
    ok: false,
    kind: 'credentials_rejected',
  });
  assert.equal(logins, 2);
  const bad = createClient({
    env: {},
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    fetchImpl: async () => json({}, 401),
  });
  assert.deepEqual(await bad.call('GET', LIST, opts), {
    ok: false,
    kind: 'credentials_rejected',
  });
});
