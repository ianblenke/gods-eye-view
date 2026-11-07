/**
 * @purpose Check quote routes, fixed destinations and private credentials.
 * @covers pending:up42-quotes
 * @run node --test --test-force-exit src/data/up42Quotes.test.mjs
 * @needs Host Node with fake fetch and fake credentials.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  readFile,
  readdir,
  mkdtemp,
  mkdir,
  writeFile,
  rm,
} from 'node:fs/promises';
import { inspect } from 'node:util';
import { getEventListeners } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { up42AllPlugins } from '../../server/providers/up42-quotes/plugins.js';
import { up42QuoteProxy } from '../../server/providers/up42-quotes/quotes.js';
import { validateQuote } from '../../server/providers/up42-quotes/validate.js';
import {
  normalizeCheck,
  normalizeProducts,
} from '../../server/providers/up42-quotes/normalize.js';
import { createClient } from '../../server/providers/up42/auth.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const ID = '12345678-abcd-1234-abcd-123456789abc';
const OTHER = '87654321-abcd-1234-abcd-123456789abc';
const TOKEN =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const PRODUCTS = 'https://api.up42.com/v2/data-products?type=TASKING&size=100';
const URLS = {
  validation: 'https://api.up42.com/v2/orders/validation',
  estimate: 'https://api.up42.com/v2/orders/estimate',
  feasibility: 'https://api.up42.com/v2/tasking/orders/feasibility',
  opportunities: 'https://api.up42.com/v2/tasking/orders/opportunities',
};
const NAMES = ['validation', 'estimate', 'feasibility', 'opportunities'];
const envOf = () => ({
  UP42_QUOTES: 'true',
  UP42_USERNAME: 'fake-user-quote',
  UP42_PASSWORD: 'fake-pass-quote',
});
const input = (extra = {}) => ({
  dataProduct: ID,
  box: [10, 60, 10.02, 60.01],
  ...extra,
});
const json = (v, status = 200) => new Response(JSON.stringify(v), { status });
const pass = (i = 0) => ({
  id: `pass.${i}`,
  properties: {
    start_datetime: `2026-11-${String((i % 20) + 1).padStart(2, '0')}T01:02:03Z`,
    end_datetime: `2026-11-${String((i % 20) + 1).padStart(2, '0')}T02:03:04Z`,
    'view:incidence_angle': i + 0.5,
    'view:off_nadir': i + 1.5,
    hidden: 'CANARY',
  },
  geometry: 'CANARY',
});
const facts = (name) =>
  ({
    validation: {
      'gev-quote': {
        status: 'INVALID',
        errors: [{ errorReason: 'Area limit' }],
        unavailabilityReason: 'No access',
        hidden: 'CANARY',
      },
    },
    estimate: {
      summary: {
        totalCredits: 37,
        totalSize: 2.75,
        unit: 'SQ_KM',
        creditsPerEur: 100,
      },
      results: [{ credits: 999 }],
      errors: [{ message: 'Size limit', details: 'CANARY' }],
    },
    feasibility: {
      results: [
        {
          index: 0,
          feasibilityStudyRequired: false,
          difficulty: 'HIGH',
          feasibilityOutcome: 'NOT_FEASIBLE',
          comment: 'Try another date',
          hidden: 'CANARY',
        },
      ],
      errors: [],
    },
    opportunities: {
      results: [
        {
          index: 0,
          opportunities: {
            type: 'FeatureCollection',
            status: 'OK',
            features: [pass(), pass(1)],
          },
        },
      ],
      errors: [],
    },
  })[name];
const expected = {
  validation: {
    ok: true,
    status: 'INVALID',
    errors: ['Area limit', 'No access'],
  },
  estimate: {
    ok: true,
    credits: 37,
    size: 2.75,
    unit: 'SQ_KM',
    errors: ['Size limit'],
  },
  feasibility: {
    ok: true,
    feasibilityStudyRequired: false,
    difficulty: 'HIGH',
    outcome: 'NOT_FEASIBLE',
    comment: 'Try another date',
  },
  opportunities: {
    ok: true,
    count: 2,
    opportunities: [
      {
        id: 'pass.0',
        start: '2026-11-01T01:02:03Z',
        end: '2026-11-01T02:03:04Z',
        incidenceAngle: 0.5,
        offNadir: 1.5,
      },
      {
        id: 'pass.1',
        start: '2026-11-02T01:02:03Z',
        end: '2026-11-02T02:03:04Z',
        incidenceAngle: 1.5,
        offNadir: 2.5,
      },
    ],
    truncated: false,
  },
};
function good(url) {
  if (url === TOKEN)
    return json({ access_token: 'fake-token-quote', expires_in: 180 });
  if (url === PRODUCTS)
    return json({
      content: [
        {
          id: ID,
          title: 'Product A',
          collection: 'Collection B',
          hidden: 'CANARY',
        },
        { id: OTHER },
      ],
    });
  const name = NAMES.find((n) => URLS[n] === url);
  assert.notEqual(name, undefined, url);
  return json(
    facts(name),
    name === 'validation' || name === 'estimate' ? 200 : 207,
  );
}
const settle = async () => {
  for (let i = 0; i < 8; i++) await new Promise((r) => setImmediate(r));
};
function harness(plugins, hook = 'configureServer') {
  const routes = new Map();
  for (const p of plugins)
    p[hook]({ middlewares: { use: (path, fn) => routes.set(path, fn) } });
  async function request({
    products = false,
    method = products ? 'GET' : 'POST',
    suffix = '/',
    value = input(),
    headers = {},
    encrypted = false,
    address = '192.0.2.1',
    stream,
    path,
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
        socket: { encrypted, remoteAddress: address },
      },
    );
    const answer = { next: false };
    await routes.get(
      path ?? (products ? '/api/up42/quote/products' : '/api/up42/quote'),
    )(
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
  return { request, routes };
}
function setup(
  t,
  {
    env = {},
    respond = good,
    hook,
    timers = {},
    client,
    defaults = false,
  } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: Date.UTC(2026, 10, 7, 12) });
  const calls = [];
  const environment = { ...envOf(), ...env };
  const options = {
    env: environment,
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    log: () => {},
    ...timers,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      // The token grant is the existing client operation, outside the five API forms.
      const allowed =
        url === TOKEN
          ? init.method === 'POST'
          : url === PRODUCTS
            ? init.method === 'GET'
            : Object.values(URLS).includes(url) && init.method === 'POST';
      assert.equal(allowed, true, `${init.method} ${url}`);
      return respond(url, init, calls.length);
    },
  };
  const shared = client ?? createClient(options);
  const plugins = defaults
    ? [up42QuoteProxy()]
    : up42AllPlugins({ ...options, client: shared });
  return {
    ...harness(plugins, hook),
    plugins,
    client: shared,
    env: environment,
    calls,
    advance: (ms) => t.mock.timers.tick(ms),
    api: () => calls.filter((c) => c.url !== TOKEN && c.url !== PRODUCTS),
  };
}
function errorOf(a, status, error, extra = {}) {
  assert.equal(a.status, status);
  assert.deepEqual(a.body, { error, ...extra });
  assert.equal(a.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.equal(a.headers['Cache-Control'], 'no-store');
}
const check = (value) =>
  validateQuote(typeof value === 'string' ? value : JSON.stringify(value));

test('[up42-quotes-001] serves both paths in both hooks', async (t) => {
  for (const hook of ['configureServer', 'configurePreviewServer']) {
    const s = setup(t, { hook });
    assert.deepEqual(
      [...s.routes.keys()],
      [
        '/api/up42/status',
        '/api/up42/scenes',
        '/api/up42/thumbnail',
        '/api/up42/quote/products',
        '/api/up42/quote',
      ],
    );
    assert.equal((await s.request({ suffix: '/?x=1' })).status, 200);
    assert.equal(
      (await s.request({ products: true, suffix: '/?x=1' })).status,
      200,
    );
    for (const products of [true, false])
      for (const suffix of ['/child', '/child?q=1', '/products/child'])
        assert.deepEqual(await s.request({ products, suffix }), { next: true });
  }
});

test('[up42-quotes-002] shares one token through the local list', async (t) => {
  const vars = { ...envOf(), UP42_THUMBNAILS: 'true' };
  const old = Object.fromEntries(
    Object.keys(vars).map((k) => [k, process.env[k]]),
  );
  Object.assign(process.env, vars);
  t.after(() => {
    for (const [k, v] of Object.entries(old)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });
  let logins = 0;
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url === TOKEN) logins++;
    if (url.includes('/collections?'))
      return json({
        content: [
          {
            name: 'pneo',
            providers: [{ name: 'oneatlas', roles: ['HOST'] }],
            integrations: ['THUMBNAIL_AVAILABLE'],
          },
        ],
      });
    if (url.endsWith('/stac/search'))
      return json({
        features: [
          {
            properties: {
              id: 'scene.1',
              collection: 'pneo',
              datetime: '2026-11-01',
            },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [10, 60],
                  [10.02, 60],
                  [10.02, 60.01],
                  [10, 60],
                ],
              ],
            },
          },
        ],
      });
    if (url.endsWith('/thumbnail'))
      return new Response(Uint8Array.from([255, 216, 255]), {
        headers: { 'content-type': 'image/jpeg' },
      });
    return good(url);
  });
  t.mock.method(console, 'log', () => {});
  const plugins = localProviderPlugins({ gemini: {} });
  const names = plugins.map((p) => p.name);
  assert.equal(names.filter((n) => n === 'up42-quotes').length, 1);
  assert.equal(
    names.indexOf('up42-quotes'),
    names.indexOf('up42-thumbnail-proxy') + 1,
  );
  const h = harness(plugins.filter((p) => p.name.startsWith('up42-')));
  assert.equal(
    (
      await h.request({
        path: '/api/up42/scenes',
        value: {
          box: [10, 60, 10.02, 60.01],
          start: '2026-10-01',
          end: '2026-10-02',
        },
      })
    ).status,
    200,
  );
  // The thumbnail response is binary, so check it with a separate response object.
  const req = {
    url: '/scene.1',
    method: 'GET',
    headers: { host: 'localhost:5173', origin: 'http://localhost:5173' },
    socket: { encrypted: false },
  };
  let bytes;
  await h.routes.get('/api/up42/thumbnail')(
    req,
    {
      writeHead(code) {
        assert.equal(code, 200);
      },
      end(v) {
        bytes = [...v];
      },
    },
    () => assert.fail(),
  );
  assert.deepEqual(bytes, [255, 216, 255]);
  assert.equal((await h.request()).status, 200);
  assert.equal(logins, 1);
  // Exercise the combined defaults, without an upstream request.
  delete process.env.UP42_QUOTES;
  const bare = harness(up42AllPlugins());
  errorOf(await bare.request(), 404, 'quotes_off');
  errorOf(await harness([up42QuoteProxy()]).request(), 404, 'quotes_off');
});

test('[up42-quotes-003] checks each method before the site', async (t) => {
  const s = setup(t);
  for (const products of [true, false])
    for (const method of [
      'PUT',
      'DELETE',
      'PATCH',
      'HEAD',
      products ? 'POST' : 'GET',
    ])
      errorOf(
        await s.request({
          products,
          method,
          headers: { origin: 'http://other.invalid' },
        }),
        405,
        'Method not allowed',
      );
  assert.equal(s.calls.length, 0);
});
test('[up42-quotes-004] checks the site before the switch and rate', async (t) => {
  const s = setup(t, { env: { UP42_QUOTES: '' } });
  for (const products of [true, false])
    for (const headers of [
      { origin: 'null' },
      { origin: 'http://other.invalid' },
      { 'x-forwarded-for': '127.0.0.1' },
      { 'sec-fetch-site': 'cross-site' },
      { 'sec-fetch-site': 'same-site' },
      { origin: 'https://localhost:5173' },
    ])
      errorOf(await s.request({ products, headers }), 403, 'cross_origin');
  for (const type of [
    undefined,
    'text/plain',
    'application/json; charset=utf-8',
  ])
    errorOf(
      await s.request({ headers: { 'content-type': type } }),
      403,
      'cross_origin',
    );
  s.env.UP42_QUOTES = 'true';
  for (const encrypted of [false, true])
    assert.equal(
      (
        await s.request({
          encrypted,
          headers: {
            origin: `${encrypted ? 'https' : 'http'}://localhost:5173`,
          },
        })
      ).status,
      200,
    );
  assert.equal(
    (
      await s.request({
        products: true,
        headers: { 'content-type': undefined },
      })
    ).status,
    200,
  );
});
test('[up42-quotes-005] keeps both routes off before the rate', async (t) => {
  const s = setup(t);
  for (const v of [undefined, '', 'false', '1', 'TRUE', 'true ']) {
    s.env.UP42_QUOTES = v;
    for (const products of [true, false])
      errorOf(await s.request({ products }), 404, 'quotes_off');
  }
  assert.equal(s.calls.length, 0);
  s.env.UP42_QUOTES = 'true';
  assert.equal((await s.request()).status, 200);
});
test('[up42-quotes-006] counts both routes and resets at the boundary', async (t) => {
  const s = setup(t);
  for (let i = 0; i < 6; i++)
    assert.equal(
      (
        await s.request({
          products: i % 2 === 0,
          address: `192.0.2.${(i % 2) + 1}`,
        })
      ).status,
      200,
    );
  s.advance(59999);
  const a = await s.request({ value: 'bad' });
  errorOf(a, 429, 'rate_limited');
  assert.equal(a.headers['Retry-After'], '60');
  s.advance(1);
  assert.equal((await s.request()).status, 200);
});
for (const [i, value] of [
  '{',
  'null',
  '[]',
  '1',
  'true',
  '"x"',
  input({ other: true }),
  input({ url: 'https://evil.invalid' }),
].entries())
  test(`[up42-quotes-007] refuses body case ${i}`, async (t) => {
    const s = setup(t, { env: { UP42_USERNAME: '' } });
    errorOf(await s.request({ value }), 400, 'bad_body');
    assert.equal(s.calls.length, 0);
  });
test('[up42-quotes-007] refuses excess bytes and a broken stream', async (t) => {
  const s = setup(t);
  errorOf(await s.request({ value: 'x'.repeat(4097) }), 400, 'bad_body');
  const stream = Readable.from(
    (async function* () {
      yield Buffer.from('{');
      throw Error('fake-pass-quote');
    })(),
  );
  errorOf(await s.request({ stream }), 400, 'bad_body');
  const v = JSON.stringify(input());
  assert.equal(
    (await s.request({ value: v + ' '.repeat(4096 - v.length) })).status,
    200,
  );
});
for (const [i, dataProduct] of [
  undefined,
  null,
  5,
  '',
  ID + 'x',
  ID + '\n',
  ID.replace('-', '/'),
  '..',
  '%2e',
  'https://evil.invalid',
].entries())
  test(`[up42-quotes-008] refuses product id case ${i}`, async (t) => {
    const s = setup(t);
    errorOf(
      await s.request({ value: input({ dataProduct }) }),
      400,
      'bad_body',
    );
    assert.equal(s.calls.length, 0);
  });
for (const [i, box] of [
  null,
  [],
  {},
  'box',
  [1, 2, 3],
  [1, 2, 3, 4, 5],
  [1, 2, '3', 4],
  [-181, 0, 0, 1],
  [0, 0, 181, 1],
  [0, -91, 1, 1],
  [0, 0, 1, 91],
  [1, 0, 0, 1],
  [0, 1, 1, 0],
  [0, 0, 0, 1],
  [0, 0, 1, 0],
].entries())
  test(`[up42-quotes-009] refuses box case ${i}`, () =>
    assert.deepEqual(check(input({ box })), { ok: false, error: 'bad_bbox' }));
test('[up42-quotes-009] accepts the coordinate limits', () => {
  for (const box of [
    [-180, -90, -179.99, -89.99],
    [179.99, 89.99, 180, 90],
  ])
    assert.equal(check(input({ box })).ok, true);
  assert.deepEqual(
    validateQuote(
      '{"dataProduct":"12345678-abcd-1234-abcd-123456789abc","box":[0,0,1,1e400]}',
    ),
    { ok: false, error: 'bad_bbox' },
  );
});
test('[up42-quotes-010] refuses excess and zero area', async (t) => {
  const s = setup(t);
  errorOf(
    await s.request({ value: input({ box: [0, 0, 0.4497, 0.4497] }) }),
    400,
    'area_too_large',
    { maxKm2: 2500 },
  );
  assert.equal(
    (await s.request({ value: input({ box: [0, 0, 0.4496, 0.4496] }) })).status,
    200,
  );
  errorOf(
    await s.request({ value: input({ box: [0, 89.99999999999999, 0.1, 90] }) }),
    400,
    'bad_bbox',
  );
});
for (const [i, params] of [
  null,
  [],
  'x',
  { unknown: 1 },
  { priority: null },
  { priority: [] },
  { priority: {} },
  { priority: 'x'.repeat(65) },
  { priority: 'bad/' },
  { priority: 'bad\n' },
  { priority: 'é' },
].entries())
  test(`[up42-quotes-011] refuses parameter case ${i}`, () =>
    assert.deepEqual(check(input({ params })), {
      ok: false,
      error: 'bad_body',
    }));
test('[up42-quotes-011] keeps each allowed parameter type', () => {
  const params = {
    spectralBands: 'RGB',
    radiometricProcessing: 'x'.repeat(64),
    geometricProcessing: 'A_b.c:+ -9',
    pixelCoding: '',
    priority: true,
    maxIncidenceAngle: 37.25,
    maxCloudCover: 0,
    projection: false,
    acquisitionMode: 'mono',
    acquisitionStart: '2026-11-01',
    acquisitionEnd: '2026-11-02',
  };
  assert.deepEqual(check(input({ params })).params, {
    spectralBands: 'RGB',
    radiometricProcessing:
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    geometricProcessing: 'A_b.c:+ -9',
    pixelCoding: '',
    priority: true,
    maxIncidenceAngle: 37.25,
    maxCloudCover: 0,
    projection: false,
    acquisitionMode: 'mono',
    acquisitionStart: '2026-11-01',
    acquisitionEnd: '2026-11-02',
  });
  assert.deepEqual(check(input()).params, {});
  assert.deepEqual(
    validateQuote(
      JSON.stringify(input()).slice(0, -1) + ',"params":{"priority":1e400}}',
    ),
    { ok: false, error: 'bad_body' },
  );
});
for (const [i, checks] of [
  null,
  {},
  'estimate',
  [],
  ['other'],
  ['estimate', 'estimate'],
  [null],
].entries())
  test(`[up42-quotes-012] refuses checks case ${i}`, () =>
    assert.deepEqual(check(input({ checks })), {
      ok: false,
      error: 'bad_body',
    }));
test('[up42-quotes-012] selects the default checks and a subset', async (t) => {
  assert.deepEqual(check(input()).checks, [
    'validation',
    'estimate',
    'feasibility',
    'opportunities',
  ]);
  const s = setup(t);
  const a = await s.request({
    value: input({ checks: ['estimate', 'validation'] }),
  });
  assert.deepEqual(Object.keys(a.body.results).sort(), [
    'estimate',
    'validation',
  ]);
  assert.deepEqual(
    s.api().map((c) => c.url),
    [
      'https://api.up42.com/v2/orders/validation',
      'https://api.up42.com/v2/orders/estimate',
    ],
  );
});
test('[up42-quotes-013] checks either credential before the store', async (t) => {
  for (const key of ['UP42_USERNAME', 'UP42_PASSWORD'])
    for (const v of [undefined, '', '  ']) {
      const s = setup(t);
      assert.equal((await s.request()).status, 200);
      const count = s.calls.length;
      s.env[key] = v;
      errorOf(await s.request(), 503, 'no_credentials', { keyRequired: true });
      assert.equal(s.calls.length, count);
    }
});
test('[up42-quotes-014] gives only public product facts without credentials', async (t) => {
  const s = setup(t, {
    env: { UP42_USERNAME: undefined, UP42_PASSWORD: undefined },
  });
  const a = await s.request({ products: true });
  assert.equal(a.status, 200);
  assert.deepEqual(a.body, {
    products: [
      {
        id: '12345678-abcd-1234-abcd-123456789abc',
        title: 'Product A',
        collection: 'Collection B',
      },
      {
        id: '87654321-abcd-1234-abcd-123456789abc',
        title: '87654321-abcd-1234-abcd-123456789abc',
      },
    ],
  });
  assert.equal(s.calls.length, 1);
  assert.deepEqual(s.calls[0].init.headers, { Accept: 'application/json' });
  assert.equal(Object.hasOwn(s.calls[0].init, 'body'), false);
  assert.equal(Object.hasOwn(s.calls[0].init, 'redirect'), true);
  assert.equal(s.calls[0].init.redirect, 'error');
});
test('[up42-quotes-015] shares the public list and uses its exact expiry', async (t) => {
  let release;
  const gate = new Promise((r) => {
    release = r;
  });
  const s = setup(t, {
    respond: async (url) => {
      if (url === PRODUCTS) await gate;
      return good(url);
    },
  });
  const a = s.request({ products: true });
  const b = s.request();
  await settle();
  assert.equal(s.calls.length, 1);
  release();
  assert.equal((await a).status, 200);
  assert.equal((await b).status, 200);
  s.advance(21599999);
  assert.equal((await s.request({ products: true })).status, 200);
  assert.equal(s.calls.filter((c) => c.url === PRODUCTS).length, 1);
  s.advance(1);
  await s.request({ products: true });
  assert.equal(s.calls.filter((c) => c.url === PRODUCTS).length, 2);
});
for (const [i, value] of [
  null,
  [],
  {},
  { content: null },
  { content: [null] },
  { content: [{ id: 'bad' }] },
  { content: [{ id: ID, title: 7 }] },
  { content: [{ id: ID, collection: {} }] },
].entries())
  test(`[up42-quotes-015] refuses public shape case ${i}`, async (t) => {
    const s = setup(t, { respond: () => json(value) });
    errorOf(await s.request({ products: true }), 502, 'bad_upstream');
    assert.equal(s.calls.length, 1);
  });
test('[up42-quotes-016] refuses an unknown product before login', async (t) => {
  const s = setup(t);
  errorOf(
    await s.request({
      value: input({ dataProduct: '00000000-0000-0000-0000-000000000000' }),
    }),
    404,
    'unknown_product',
  );
  assert.deepEqual(
    s.calls.map((c) => c.url),
    ['https://api.up42.com/v2/data-products?type=TASKING&size=100'],
  );
  assert.equal(
    (await s.request({ value: input({ dataProduct: ID.toUpperCase() }) }))
      .status,
    200,
  );
});
test('[up42-quotes-017] sets the exact body for every check', async (t) => {
  const s = setup(t);
  const a = await s.request({
    value: input({
      box: [-1.5, 2.25, -1.25, 2.5],
      params: { priority: 'LOW', maxCloudCover: 17 },
    }),
  });
  assert.equal(a.status, 200);
  assert.equal(s.api().length, 4);
  for (const c of s.api()) {
    assert.deepEqual(JSON.parse(c.init.body), {
      dataProduct: '12345678-abcd-1234-abcd-123456789abc',
      displayName: 'gev-quote',
      featureCollection: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-1.5, 2.25],
                  [-1.25, 2.25],
                  [-1.25, 2.5],
                  [-1.5, 2.5],
                  [-1.5, 2.25],
                ],
              ],
            },
            properties: {},
          },
        ],
      },
      params: { maxCloudCover: 17, priority: 'LOW' },
    });
    assert.deepEqual(c.init.headers, {
      Authorization: 'Bearer fake-token-quote',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    assert.equal(Object.hasOwn(c.init, 'redirect'), true);
    assert.equal(c.init.redirect, 'error');
    assert.equal(c.init.signal instanceof AbortSignal, true);
  }
  const q = setup(t);
  await q.request();
  for (const c of q.api()) assert.deepEqual(JSON.parse(c.init.body).params, {});
});
for (const [name, id] of [
  ['validation', '018'],
  ['estimate', '019'],
  ['feasibility', '020'],
  ['opportunities', '021'],
])
  test(`[up42-quotes-${id}] gives literal ${name} facts`, async (t) => {
    const s = setup(t);
    const a = await s.request({ value: input({ checks: [name] }) });
    assert.equal(a.status, 200);
    assert.deepEqual(a.body.results, { [name]: expected[name] });
  });
test('[up42-quotes-018] reads each validation state and empty errors', () => {
  for (const status of ['VALID', 'INVALID', 'UNAVAILABLE'])
    assert.deepEqual(normalizeCheck('validation', { x: { status } }), {
      ok: true,
      status,
      errors: [],
    });
});
test('[up42-quotes-019] accepts null and scene units', () => {
  for (const unit of [null, 'SCENE'])
    assert.deepEqual(
      normalizeCheck('estimate', {
        summary: { totalCredits: 0, totalSize: 0, unit },
      }),
      { ok: true, credits: 0, size: 0, unit, errors: [] },
    );
});
test('[up42-quotes-020] drops optional facts with invalid types', () => {
  assert.deepEqual(
    normalizeCheck('feasibility', {
      results: [
        {
          feasibilityStudyRequired: true,
          difficulty: 7,
          feasibilityOutcome: {},
          comment: false,
        },
      ],
    }),
    { ok: true, feasibilityStudyRequired: true },
  );
  assert.deepEqual(
    normalizeCheck('feasibility', {
      results: [
        {
          feasibilityStudyRequired: false,
          difficulty: null,
          feasibilityOutcome: null,
          comment: 'x'.repeat(161),
        },
      ],
    }),
    {
      ok: true,
      feasibilityStudyRequired: false,
      difficulty: null,
      outcome: null,
      comment: 'x'.repeat(160),
    },
  );
});
test('[up42-quotes-021] caps pass facts and marks truncation', () => {
  const v = facts('opportunities');
  v.results[0].opportunities.features = Array.from({ length: 51 }, (_, i) =>
    pass(i),
  );
  const a = normalizeCheck('opportunities', v);
  assert.equal(a.count, 50);
  assert.equal(a.truncated, true);
  assert.equal(a.opportunities.at(-1).id, 'pass.49');
  const empty = facts('opportunities');
  empty.results[0].opportunities.features = [];
  assert.deepEqual(normalizeCheck('opportunities', empty), {
    ok: true,
    count: 0,
    opportunities: [],
    truncated: false,
  });
  const odd = facts('opportunities');
  odd.results[0].opportunities.features = [
    {
      id: 'x'.repeat(161),
      properties: {
        start_datetime: 'a'.repeat(161),
        end_datetime: 7,
        'view:incidence_angle': '7',
        'view:off_nadir': null,
      },
    },
  ];
  assert.deepEqual(normalizeCheck('opportunities', odd).opportunities, [
    { id: 'x'.repeat(160), start: 'a'.repeat(160) },
  ]);
});
for (const status of [200, 207])
  test(`[up42-quotes-022] reads geometry errors at status ${status}`, async (t) => {
    const s = setup(t, {
      respond: (url) => {
        const name = NAMES.find((n) => URLS[n] === url);
        if (!name) return good(url);
        const v = facts(name);
        if (name === 'validation') return json(v, status);
        v.errors = [{ message: 'Reason ' + 'x'.repeat(170) }];
        return json(v, status);
      },
    });
    const a = await s.request();
    assert.equal(a.status, 200);
    assert.deepEqual(a.body.results.validation, expected.validation);
    assert.deepEqual(a.body.results.estimate.errors, [
      'Reason ' + 'x'.repeat(153),
    ]);
    for (const name of ['feasibility', 'opportunities'])
      assert.deepEqual(a.body.results[name], {
        ok: false,
        error: 'geometry_errors',
      });
  });
for (const [i, value] of [
  null,
  [],
  3,
  {},
  { results: [] },
  { results: [null] },
  { results: [{ feasibilityStudyRequired: 'true' }] },
].entries())
  test(`[up42-quotes-023] refuses result shape case ${i}`, () => {
    for (const name of NAMES)
      assert.deepEqual(normalizeCheck(name, value), {
        ok: false,
        error: 'bad_upstream',
      });
  });
for (const [i, errors] of [null, {}, [null], [{}], [{ message: 7 }]].entries())
  test(`[up42-quotes-022] refuses error shape case ${i}`, () => {
    for (const name of ['estimate', 'feasibility', 'opportunities'])
      assert.deepEqual(normalizeCheck(name, { ...facts(name), errors }), {
        ok: false,
        error: 'bad_upstream',
      });
  });
test('[up42-quotes-023] checks required facts and caps product text', () => {
  const bad = { ok: false, error: 'bad_upstream' };
  for (const v of [
    {},
    { x: null },
    { x: [] },
    { x: { status: 'OTHER' } },
    { x: { status: 'VALID', errors: [{}] } },
    { x: { status: 'VALID', errors: null } },
    { x: { status: 'VALID' }, y: { status: 'VALID' } },
  ])
    assert.deepEqual(normalizeCheck('validation', v), bad);
  assert.deepEqual(
    normalizeCheck('validation', {
      x: {
        status: 'VALID',
        errors: [{ errorReason: 'x'.repeat(161) }],
        unavailabilityReason: 7,
      },
    }),
    { ok: true, status: 'VALID', errors: ['x'.repeat(160)] },
  );
  for (const summary of [
    null,
    {},
    { totalCredits: -1, totalSize: 1, unit: 'SCENE' },
    { totalCredits: '1', totalSize: 1, unit: 'SCENE' },
    { totalCredits: 1, totalSize: -1, unit: 'SCENE' },
    { totalCredits: 1, totalSize: 1, unit: 'OTHER' },
  ])
    assert.deepEqual(normalizeCheck('estimate', { summary }), bad);
  for (const opportunities of [
    null,
    {},
    { features: null },
    { features: [null] },
    { features: [{ id: 7, properties: {} }] },
    { features: [{ id: 'p', properties: null }] },
  ])
    assert.deepEqual(
      normalizeCheck('opportunities', { results: [{ opportunities }] }),
      bad,
    );
  assert.deepEqual(
    normalizeProducts({
      content: [
        { id: ID, title: 't'.repeat(161), collection: 'c'.repeat(161) },
        { id: OTHER, title: '' },
      ],
    }),
    [
      {
        id: '12345678-abcd-1234-abcd-123456789abc',
        title: 't'.repeat(160),
        collection: 'c'.repeat(160),
      },
      {
        id: '87654321-abcd-1234-abcd-123456789abc',
        title: '87654321-abcd-1234-abcd-123456789abc',
      },
    ],
  );
  assert.deepEqual(normalizeProducts({ content: [] }), []);
});
test('[up42-quotes-024] runs later checks after an independent failure', async (t) => {
  const s = setup(t, {
    respond: (url) => (url === URLS.estimate ? json({}, 542) : good(url)),
  });
  const a = await s.request();
  assert.equal(a.status, 200);
  assert.deepEqual(a.body.results, {
    ...expected,
    estimate: { ok: false, error: 'upstream_failed' },
  });
  assert.equal(s.api().length, 4);
});
for (const mode of ['credentials', 'api', 'mixed', 'login'])
  test(`[up42-quotes-025] names the total failure case ${mode}`, async (t) => {
    const s = setup(t, {
      respond: (url) =>
        url === PRODUCTS
          ? good(url)
          : mode === 'login' && url === TOKEN
            ? json({}, 400)
            : url === TOKEN
              ? good(url)
              : json(
                  {},
                  mode === 'credentials' ||
                    (mode === 'mixed' && url === URLS.validation)
                    ? 401
                    : 542,
                ),
    });
    errorOf(
      await s.request(),
      mode === 'credentials' || mode === 'login' ? 403 : 502,
      mode === 'credentials' || mode === 'login'
        ? 'credentials_rejected'
        : 'upstream_failed',
      mode === 'credentials' || mode === 'login' ? { keyRejected: true } : {},
    );
    if (mode === 'credentials')
      assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 5);
  });
for (const [i, respond] of [
  () => json({}, 302),
  () => json({}, 429),
  () => json({}, 542),
  () => new Response('bad JSON'),
  () => {
    throw Error('fake-pass-quote');
  },
  () => new Response('{}', { headers: { 'content-length': '4194305' } }),
  () => new Response('{"pad":"' + 'x'.repeat(4194295) + '"}'),
].entries())
  test(`[up42-quotes-026] refuses transport case ${i}`, async (t) => {
    const s = setup(t, {
      respond: (url) =>
        url === TOKEN || url === PRODUCTS ? good(url) : respond(),
    });
    errorOf(await s.request(), 502, 'upstream_failed');
    assert.equal(s.api().length, 4);
  });
test('[up42-quotes-026] retries each API 401 once with a fresh token', async (t) => {
  let logins = 0;
  const attempts = new Map();
  const s = setup(t, {
    respond: (url) => {
      if (url === TOKEN)
        return json({
          access_token: `fake-token-${++logins}`,
          expires_in: 180,
        });
      if (url === PRODUCTS) return good(url);
      const n = (attempts.get(url) ?? 0) + 1;
      attempts.set(url, n);
      return n === 1 ? json({}, 401) : good(url);
    },
  });
  assert.equal((await s.request()).status, 200);
  assert.equal(logins, 5);
  assert.deepEqual([...attempts.values()], [2, 2, 2, 2]);
  assert.deepEqual(
    s
      .api()
      .filter((c) => c.url === URLS.validation)
      .map((c) => c.init.headers.Authorization),
    ['Bearer fake-token-1', 'Bearer fake-token-2'],
  );
});
for (const phase of ['headers', 'body', 'cancel', 'after-abort'])
  test(
    `[up42-quotes-027] limits the wait during the ${phase} phase`,
    { timeout: 2000 },
    async (t) => {
      const timers = new Map();
      let serial = 0;
      let finish;
      let cancelled = 0;
      const s = setup(t, {
        timers: {
          setTimer: (fn, ms) => {
            assert.equal(ms, 15000);
            timers.set(++serial, fn);
            return serial;
          },
          clearTimer: (id) => timers.delete(id),
        },
        respond: (url, init) => {
          if (url === TOKEN || url === PRODUCTS) return good(url);
          if (phase === 'headers') return new Promise(() => {});
          return new Response(
            new ReadableStream({
              start(c) {
                if (phase === 'body') c.enqueue(new TextEncoder().encode('{'));
              },
              cancel() {
                cancelled++;
                return new Promise((r) => {
                  finish = r;
                });
              },
            }),
            { status: phase === 'body' ? 207 : 542 },
          );
        },
      });
      const run = s.request({
        value: input({ checks: ['estimate', 'validation'] }),
      });
      for (let i = 0; i < 2; i++) {
        await settle();
        assert.equal(timers.size, 1);
        const end = finish;
        for (const fire of timers.values()) fire();
        await settle();
        if (phase === 'after-abort') end();
      }
      errorOf(await run, 502, 'upstream_failed');
      assert.equal(timers.size, 0);
      if (phase !== 'headers') assert.equal(cancelled, 2);
    },
  );
test('[up42-quotes-027] keeps a timeout as a separate check result', async (t) => {
  let fire;
  const s = setup(t, {
    timers: {
      setTimer: (fn) => {
        fire = fn;
        return 1;
      },
    },
    respond: (url) =>
      url === URLS.estimate ? new Response(new ReadableStream({})) : good(url),
  });
  const run = s.request();
  await settle();
  fire();
  const a = await run;
  assert.equal(a.status, 200);
  assert.deepEqual(a.body.results.estimate, {
    ok: false,
    error: 'search_timeout',
  });
});
test('[up42-quotes-027] discards error bodies before the timer clears', async (t) => {
  for (const broken of [false, true]) {
    const events = [];
    const s = setup(t, {
      timers: { clearTimer: () => events.push('clear') },
      respond: (url) =>
        url === TOKEN || url === PRODUCTS
          ? good(url)
          : new Response(
              new ReadableStream({
                cancel() {
                  events.push('cancel');
                  if (broken) throw Error('fake-pass-quote');
                },
              }),
              { status: 542 },
            ),
    });
    errorOf(await s.request(), 502, 'upstream_failed');
    assert.deepEqual(events.slice(-8), [
      'cancel',
      'clear',
      'cancel',
      'clear',
      'cancel',
      'clear',
      'cancel',
      'clear',
    ]);
  }
});
test('[up42-quotes-028] sends literal facts from the store until expiry', async (t) => {
  const s = setup(t);
  const a = await s.request();
  assert.equal(a.body.cached, false);
  assert.deepEqual(a.body.budget, { used: 1, limit: 20 });
  s.advance(599999);
  const b = await s.request();
  assert.deepEqual(b.body, {
    results: expected,
    cached: true,
    budget: { used: 1, limit: 20 },
  });
  assert.equal(s.api().length, 4);
  s.advance(1);
  assert.equal((await s.request()).body.cached, false);
  assert.equal(s.api().length, 8);
});
test('[up42-quotes-028] removes the oldest of sixteen answers', async (t) => {
  const s = setup(t, { env: { UP42_DAILY_QUOTES: '200' } });
  for (let i = 0; i < 17; i++) {
    assert.equal(
      (await s.request({ value: input({ params: { priority: i } }) })).body
        .cached,
      false,
    );
    s.advance(10001);
  }
  assert.equal(
    (await s.request({ value: input({ params: { priority: 1 } }) })).body
      .cached,
    true,
  );
  s.advance(10001);
  assert.equal(
    (await s.request({ value: input({ params: { priority: 0 } }) })).body
      .cached,
    false,
  );
  assert.equal(s.api().length, 72);
});
test('[up42-quotes-029] uses every input value in the store key', async (t) => {
  const s = setup(t);
  for (const extra of [
    {},
    { dataProduct: OTHER },
    { box: [11, 60, 11.02, 60.01] },
    { params: { priority: 'LOW' } },
    { checks: ['estimate'] },
  ]) {
    assert.equal((await s.request({ value: input(extra) })).body.cached, false);
  }
  assert.equal(s.api().length, 17);
  s.advance(60000);
  await s.request({
    value: input({
      params: { priority: 'HIGH', maxCloudCover: 7 },
      checks: ['estimate', 'validation'],
    }),
  });
  const a = await s.request({
    value: input({
      params: { maxCloudCover: 7, priority: 'HIGH' },
      checks: ['validation', 'estimate'],
    }),
  });
  assert.equal(a.body.cached, true);
  assert.equal(s.api().length, 19);
});
for (const success of [true, false])
  test(`[up42-quotes-030] shares simultaneous work with success ${success}`, async (t) => {
    let release;
    const gate = new Promise((r) => {
      release = r;
    });
    const s = setup(t, {
      respond: async (url) => {
        if (url === PRODUCTS) await gate;
        return success || url === PRODUCTS || url === TOKEN
          ? good(url)
          : json({}, 542);
      },
    });
    assert.equal(s.calls.length, 0);
    const a = s.request();
    const b = s.request();
    await settle();
    assert.equal(s.calls.length, 1);
    release();
    const [x, y] = await Promise.all([a, b]);
    assert.equal(s.api().length, 4);
    if (success) {
      assert.deepEqual(x.body.results, expected);
      assert.deepEqual(y.body, {
        results: expected,
        cached: true,
        budget: { used: 1, limit: 20 },
      });
      assert.equal(x.body.cached, false);
    } else {
      errorOf(x, 502, 'upstream_failed');
      errorOf(y, 502, 'upstream_failed');
      await s.request();
      assert.equal(s.api().length, 8);
    }
  });
test('[up42-quotes-031] checks the store before the budget and resets the day', async (t) => {
  const s = setup(t, { env: { UP42_DAILY_QUOTES: '1' } });
  s.advance(43199000);
  assert.equal(new Date().toISOString(), '2026-11-07T23:59:59.000Z');
  assert.equal((await s.request({ products: true })).status, 200);
  assert.deepEqual((await s.request()).body.budget, { used: 1, limit: 1 });
  assert.equal((await s.request()).body.cached, true);
  errorOf(
    await s.request({ value: input({ dataProduct: OTHER }) }),
    429,
    'budget',
    { used: 1, limit: 1 },
  );
  assert.equal(s.api().length, 4);
  s.advance(1001);
  assert.equal(new Date().toISOString(), '2026-11-08T00:00:00.001Z');
  const next = await s.request({ value: input({ dataProduct: OTHER }) });
  assert.equal(next.status, 200);
  assert.equal(next.body.cached, false);
  assert.deepEqual(next.body.budget, { used: 1, limit: 1 });
  assert.equal(s.api().length, 8);
  const q = setup(t, {
    env: { UP42_DAILY_QUOTES: '1' },
    respond: () => json({}, 542),
  });
  errorOf(await q.request(), 502, 'upstream_failed');
  errorOf(await q.request(), 429, 'budget', { used: 1, limit: 1 });
});
for (const [i, [value, limit]] of [
  [undefined, 20],
  ['', 20],
  ['0', 20],
  ['201', 20],
  ['-1', 20],
  ['2.5', 20],
  ['2\n', 20],
  [7, 20],
  ['200', 200],
  ['0007', 7],
].entries())
  test(`[up42-quotes-031] sets the daily limit case ${i}`, async (t) => {
    const s = setup(t, { env: { UP42_DAILY_QUOTES: value } });
    assert.deepEqual((await s.request()).body.budget, { used: 1, limit });
  });
test('[up42-quotes-031] reserves the count before public discovery', async (t) => {
  let release;
  const gate = new Promise((r) => {
    release = r;
  });
  const s = setup(t, {
    env: { UP42_DAILY_QUOTES: '1' },
    respond: async (url) => {
      await gate;
      return good(url);
    },
  });
  const a = s.request();
  await settle();
  const b = s.request({ value: input({ dataProduct: OTHER }) });
  await settle();
  release();
  const [first, second] = await Promise.all([a, b]);
  errorOf(second, 429, 'budget', { used: 1, limit: 1 });
  assert.equal(first.status, 200);
});
test('[up42-quotes-032] keeps all fake secrets out of all output', async (t) => {
  const output = [];
  for (const method of Object.keys(console))
    if (typeof console[method] === 'function')
      t.mock.method(console, method, (...args) =>
        output.push(
          inspect(args, {
            depth: null,
            maxArrayLength: null,
            maxStringLength: null,
          }),
        ),
      );
  const answers = [];
  for (const secret of [
    'fake-user-quote',
    'fake-pass-quote',
    'fake-token-quote',
  ])
    for (const mode of [
      'good',
      'reason',
      'comment',
      'product',
      'error',
      'throw',
    ]) {
      const s = setup(t, {
        respond: (url) => {
          if (url === TOKEN) return good(url);
          if (mode === 'product' && url === PRODUCTS)
            return json({ content: [{ id: ID, title: secret }] });
          if (url === PRODUCTS) return good(url);
          if (mode === 'error') return json({ message: secret }, 542);
          if (mode === 'throw') throw Error(secret);
          if (mode === 'reason' && url === URLS.validation)
            return json({
              x: { status: 'INVALID', errors: [{ errorReason: secret }] },
            });
          if (mode === 'comment' && url === URLS.feasibility)
            return json({
              results: [{ feasibilityStudyRequired: false, comment: secret }],
            });
          return good(url);
        },
      });
      if (mode === 'product')
        assert.equal((await s.client.post(URLS.validation, {})).ok, true);
      const quote = await s.request();
      const products = await s.request({ products: true });
      answers.push(quote, products);
      if (mode === 'reason' || mode === 'comment') {
        assert.equal(quote.status, 200);
        assert.deepEqual(quote.body.results, {
          ...expected,
          [mode === 'reason' ? 'validation' : 'feasibility']: {
            ok: false,
            error: 'bad_upstream',
          },
        });
      } else if (mode === 'good')
        assert.deepEqual(quote.body.results, expected);
      else
        errorOf(
          quote,
          502,
          mode === 'product' ? 'bad_upstream' : 'upstream_failed',
        );
      if (mode === 'product') errorOf(products, 502, 'bad_upstream');
      else assert.equal(products.status, 200);
    }
  const text = JSON.stringify({ answers, output });
  for (const secret of [
    'fake-user-quote',
    'fake-pass-quote',
    'fake-token-quote',
  ])
    assert.equal(text.includes(secret), false);
});
for (const [key, old, next] of [
  ['UP42_USERNAME', 'fake-user-quote', 'fake-next-user'],
  ['UP42_PASSWORD', 'fake-pass-quote', 'fake-next-pass'],
  ['token', 'fake-token-1', 'fake-token-2'],
])
  test(`[up42-quotes-033] refuses the previous secret after ${key} changes`, async (t) => {
    let logins = 0;
    let echo = false;
    const s = setup(t, {
      respond: (url) => {
        if (url === TOKEN)
          return json({
            access_token:
              key === 'token'
                ? `fake-token-${++logins}`
                : (logins++, 'fake-token-quote'),
            expires_in: 180,
          });
        if (url === PRODUCTS) return good(url);
        if (echo && url === URLS.feasibility)
          return json({
            results: [{ feasibilityStudyRequired: false, comment: old }],
          });
        return good(url);
      },
    });
    assert.equal((await s.request()).status, 200);
    if (key === 'token') s.advance(120000);
    else s.env[key] = next;
    echo = true;
    const a = await s.request({ value: input({ params: { priority: 1 } }) });
    assert.equal(a.status, 200);
    assert.deepEqual(a.body.results.feasibility, {
      ok: false,
      error: 'bad_upstream',
    });
    assert.equal(logins, 2);
  });
test('[up42-quotes-032] checks a kept answer against new credentials', async (t) => {
  const s = setup(t);
  assert.equal((await s.request()).status, 200);
  s.env.UP42_PASSWORD = 'Try another date';
  errorOf(await s.request(), 502, 'upstream_failed');
  assert.equal(s.api().length, 4);
});
for (let mask = 1; mask < 16; mask++)
  for (const mode of ['good', '401', '429', '542', '207', 'redirect'])
    test(`[up42-quotes-034] allows only fixed requests for subset ${mask} case ${mode}`, async (t) => {
      const checks = NAMES.filter((_, i) => (mask & (1 << i)) !== 0);
      const s = setup(t, {
        respond: (url) => {
          if (url === PRODUCTS || url === TOKEN) return good(url);
          if (mode === 'good') return good(url);
          if (mode === '207') {
            const name = NAMES.find((n) => URLS[n] === url);
            const v = facts(name);
            if (name !== 'validation') v.errors = [{ message: 'No access' }];
            return json(v, 207);
          }
          return json({}, mode === 'redirect' ? 302 : Number(mode));
        },
      });
      await s.request({
        value: input({
          checks,
          params: {
            priority: 'https: api.up42.com',
            projection: 'workspaceId',
          },
        }),
      });
      assert.deepEqual(
        [...new Set(s.api().map((c) => c.url))],
        NAMES.filter((n) => checks.includes(n)).map((n) => URLS[n]),
      );
      for (const c of s.calls) {
        assert.equal(c.init.redirect, 'error');
        assert.equal(
          c.url === TOKEN
            ? c.init.method === 'POST'
            : c.url === PRODUCTS
              ? c.init.method === 'GET'
              : Object.values(URLS).includes(c.url) && c.init.method === 'POST',
          true,
          `${c.init.method} ${c.url}`,
        );
      }
    });
async function scanQuoteSource(root) {
  const names = [];
  let text = '';
  async function visit(prefix = '') {
    for (const entry of await readdir(new URL(prefix, root), {
      withFileTypes: true,
    })) {
      const name = prefix + entry.name;
      if (entry.isDirectory()) await visit(name + '/');
      else {
        names.push(name);
        if (/\.(?:js|mjs|cjs|ts|json|html|sh)$/.test(name))
          text += await readFile(new URL(name, root), 'utf8');
      }
    }
  }
  await visit();
  assert.deepEqual(names.sort(), [
    'normalize.js',
    'plugins.js',
    'quotes.js',
    'upstream.js',
    'validate.js',
  ]);
  const occurrences = [...text.matchAll(/\/v2\/orders[^\s'"`)]*/g)].map(
    (m) => m[0],
  );
  assert.deepEqual(occurrences.sort(), [
    '/v2/orders/estimate',
    '/v2/orders/validation',
  ]);
  for (const forbidden of [
    'quotation',
    'PATCH',
    'ACCEPTED',
    'download-url',
    'eulas',
    'execution',
    'cancellation',
    'extensions',
  ])
    assert.equal(text.includes(forbidden), false, forbidden);
  assert.equal(/method\s*:\s*['"](?:DELETE|PUT)['"]/.test(text), false);
  const urls = [...text.matchAll(/https?:[^\s'"`]+/g)].map((m) => m[0]).sort();
  assert.deepEqual(urls, [
    'https://api.up42.com/v2/data-products?type=TASKING&size=100',
    'https://api.up42.com/v2/orders/estimate',
    'https://api.up42.com/v2/orders/validation',
    'https://api.up42.com/v2/tasking/orders/feasibility',
    'https://api.up42.com/v2/tasking/orders/opportunities',
  ]);
  assert.equal(/(?:new URL|fetch(?:Impl)?\s*\()/.test(text), false);
}
test('[up42-quotes-035] scans all quote source text for forbidden forms', async () => {
  await scanQuoteSource(
    new URL('../../server/providers/up42-quotes/', import.meta.url),
  );
});
for (const extension of ['js', 'mjs', 'cjs', 'ts', 'json', 'html', 'sh', 'txt'])
  test(`[up42-quotes-035] refuses an extra nested ${extension} file`, async (t) => {
    const path = await mkdtemp(join(tmpdir(), 'gev-up42-quotes-guard-'));
    t.after(() => rm(path, { recursive: true, force: true }));
    const root = new URL('file://' + path + '/');
    const source = new URL(
      '../../server/providers/up42-quotes/',
      import.meta.url,
    );
    for (const name of [
      'normalize.js',
      'plugins.js',
      'quotes.js',
      'upstream.js',
      'validate.js',
    ])
      await writeFile(
        new URL(name, root),
        await readFile(new URL(name, source)),
      );
    await scanQuoteSource(root);
    await mkdir(new URL('nested/', root));
    await writeFile(new URL(`nested/extra.${extension}`, root), 'PATCH');
    await assert.rejects(() => scanQuoteSource(root), {
      code: 'ERR_ASSERTION',
    });
  });
test('[up42-quotes-036] refuses other origins before login', async (t) => {
  const s = setup(t);
  for (const url of [
    'bad',
    'http://api.up42.com/v2/test',
    'https://evil.invalid/v2/test',
    'https://api.up42.com.evil.invalid/x',
    'https://api.up42.com:444/x',
    null,
  ])
    for (const method of ['post', 'getPublic'])
      assert.deepEqual(await s.client[method](url, {}), {
        ok: false,
        kind: 'bad_upstream',
      });
  assert.equal(s.calls.length, 0);
  assert.equal((await s.client.getPublic(PRODUCTS)).ok, true);
  assert.equal((await s.client.post(URLS.estimate, {})).ok, true);
});

test('[up42-quotes-026] stops after the retry login fails', async (t) => {
  let logins = 0;
  const s = setup(t, {
    respond: (url) =>
      url === PRODUCTS
        ? good(url)
        : url === TOKEN
          ? ++logins === 1
            ? good(url)
            : json({}, 400)
          : json({}, 401),
  });
  errorOf(
    await s.request({ value: input({ checks: ['estimate'] }) }),
    403,
    'credentials_rejected',
    { keyRejected: true },
  );
  assert.equal(s.api().length, 1);
  assert.equal(logins, 2);
});

for (const phase of ['headers', 'body', 'cancel', 'after-abort'])
  test(
    `[up42-quotes-027] gives the exact client timeout during the ${phase} phase`,
    { timeout: 2000 },
    async (t) => {
      let fire;
      let finish;
      let ended = false;
      const s = setup(t, {
        timers: {
          setTimer: (fn, ms) => {
            assert.equal(ms, 15000);
            fire = fn;
            return 1;
          },
          clearTimer: () => {
            ended = true;
          },
        },
        respond: (url, init) => {
          if (url === TOKEN) return good(url);
          if (phase === 'headers') return new Promise(() => {});
          if (phase === 'body')
            return {
              status: 207,
              headers: new Headers(),
              body: {
                getReader: () => ({
                  read: () => new Promise(() => {}),
                  cancel: () => new Promise(() => {}),
                  releaseLock() {},
                }),
              },
            };
          return new Response(
            new ReadableStream({
              cancel() {
                return new Promise((r) => {
                  finish = r;
                });
              },
            }),
            { status: phase === 'body' ? 207 : 542 },
          );
        },
      });
      let answer;
      const run = s.client.post(URLS.estimate, {}).then((v) => {
        answer = v;
      });
      await settle();
      ended = false;
      fire();
      if (phase === 'after-abort') finish();
      await settle();
      assert.deepEqual(answer, { ok: false, kind: 'search_timeout' });
      await run;
      assert.equal(ended, true);
    },
  );

test('[up42-quotes-020] keeps distinct feasible and low facts', () => {
  assert.deepEqual(
    normalizeCheck('feasibility', {
      results: [
        {
          feasibilityStudyRequired: true,
          difficulty: 'LOW',
          feasibilityOutcome: 'FEASIBLE',
          comment: 'Study A',
        },
      ],
    }),
    {
      ok: true,
      feasibilityStudyRequired: true,
      difficulty: 'LOW',
      outcome: 'FEASIBLE',
      comment: 'Study A',
    },
  );
});
test('[up42-quotes-011] refuses a twelfth parameter', () => {
  const params = Object.fromEntries(
    [
      'spectralBands',
      'radiometricProcessing',
      'geometricProcessing',
      'pixelCoding',
      'priority',
      'maxIncidenceAngle',
      'maxCloudCover',
      'projection',
      'acquisitionMode',
      'acquisitionStart',
      'acquisitionEnd',
      'other',
    ].map((k) => [k, true]),
  );
  assert.deepEqual(check(input({ params })), { ok: false, error: 'bad_body' });
});
for (const [secret, separator] of [
  ['fake-pass-quote', '\u0000'],
  ['fake-user-quote', '\u007f'],
  ['fake-token-quote', '\u0085'],
])
  for (const field of [
    'title',
    'collection',
    'errorReason',
    'unavailabilityReason',
    'message',
    'comment',
    'id',
    'start_datetime',
    'end_datetime',
  ])
    test(`[up42-quotes-032] refuses the final ${field} with ${secret}`, async (t) => {
      const split = secret.slice(0, 10) + separator + secret.slice(10);
      const product = field === 'title' || field === 'collection';
      const name = product
        ? null
        : ['errorReason', 'unavailabilityReason'].includes(field)
          ? 'validation'
          : field === 'message'
            ? 'estimate'
            : field === 'comment'
              ? 'feasibility'
              : 'opportunities';
      let echo = false;
      const s = setup(t, {
        respond: (url) => {
          if (!echo || url === TOKEN) return good(url);
          if (product && url === PRODUCTS)
            return json({
              content: [{ id: ID, title: 'Product A', [field]: split }],
            });
          if (url !== URLS[name]) return good(url);
          const v = facts(name);
          if (field === 'errorReason')
            v['gev-quote'].errors[0].errorReason = split;
          else if (field === 'unavailabilityReason')
            v['gev-quote'].unavailabilityReason = split;
          else if (field === 'message') v.errors[0].message = split;
          else if (field === 'comment') v.results[0].comment = split;
          else {
            const feature = v.results[0].opportunities.features[0];
            if (field === 'id') feature.id = split;
            else feature.properties[field] = split;
          }
          return json(v);
        },
      });
      assert.equal((await s.client.post(URLS.validation, {})).ok, true);
      echo = true;
      for (let i = 0; i < 2; i++) {
        const a = await s.request({ products: product });
        if (product) errorOf(a, 502, 'bad_upstream');
        else {
          assert.equal(a.status, 200);
          assert.deepEqual(a.body.results, {
            ...expected,
            [name]: { ok: false, error: 'bad_upstream' },
          });
          assert.equal(a.body.cached, i === 1);
        }
        assert.equal(JSON.stringify(a).includes(secret), false);
      }
      if (product)
        assert.equal(s.calls.filter((c) => c.url === PRODUCTS).length, 2);
    });

test('[up42-quotes-032] checks the product id after case conversion', async (t) => {
  const s = setup(t, {
    env: { UP42_PASSWORD: '12345678-abcd-1234-abcd-123456789abc' },
    respond: (url) =>
      url === PRODUCTS
        ? json({
            content: [
              {
                id: '12345678-ABCD-1234-ABCD-123456789ABC',
                title: 'Product A',
              },
            ],
          })
        : good(url),
  });
  errorOf(await s.request({ products: true }), 502, 'bad_upstream');
  errorOf(await s.request({ products: true }), 502, 'bad_upstream');
  assert.equal(s.calls.length, 2);
});

for (const path of [
  'post',
  'getPublic',
  'search',
  'thumbnail',
  'collections',
  'login',
])
  for (const phase of [
    'pending',
    'late-pending',
    'late-resolve',
    'late-reject',
    'late-no-body',
  ])
    test(
      `[up42-quotes-027] bounds ${path} headers in the ${phase} case`,
      { timeout: 2000 },
      async () => {
        const timers = new Map();
        let serial = 0;
        let release;
        let cancelled = 0;
        let reads = 0;
        let signal;
        const client = createClient({
          env: envOf(),
          now: () => 0,
          setTimer: (fn, ms) => {
            assert.equal(ms, 15000);
            timers.set(++serial, fn);
            return serial;
          },
          clearTimer: (id) => timers.delete(id),
          fetchImpl: (url, init) => {
            if (url === TOKEN && path !== 'login') return good(url);
            signal = init.signal;
            return new Promise((resolve) => {
              release = resolve;
            });
          },
        });
        let answer;
        const run = (
          path === 'getPublic'
            ? client.getPublic(PRODUCTS)
            : path === 'search'
              ? client.search('host-a', {})
              : path === 'thumbnail'
                ? client.thumbnail('host-a', 'scene.1')
                : path === 'collections'
                  ? client.collections()
                  : client.post(URLS.estimate, {})
        ).then((v) => {
          answer = v;
        });
        await settle();
        assert.equal(timers.size, 1);
        assert.equal(answer, undefined);
        for (const fire of timers.values()) fire();
        await settle();
        assert.equal(signal.aborted, true);
        assert.deepEqual(answer, { ok: false, kind: 'search_timeout' });
        assert.equal(timers.size, 0);
        assert.equal(getEventListeners(signal, 'abort').length, 0);
        if (phase !== 'pending') {
          release({
            status: 200,
            headers: new Headers({ 'content-type': 'image/png' }),
            body:
              phase === 'late-no-body'
                ? null
                : {
                    getReader() {
                      reads++;
                      throw Error('Body must not be read');
                    },
                    cancel() {
                      cancelled++;
                      if (phase === 'late-reject')
                        return Promise.reject(Error('Cancel failed'));
                      if (phase === 'late-resolve') return Promise.resolve();
                      return new Promise(() => {});
                    },
                  },
          });
          await settle();
          assert.equal(cancelled, phase === 'late-no-body' ? 0 : 1);
          assert.equal(reads, 0);
          assert.deepEqual(answer, { ok: false, kind: 'search_timeout' });
          assert.equal(timers.size, 0);
          assert.equal(getEventListeners(signal, 'abort').length, 0);
        }
        await run;
      },
    );

test('[up42-quotes-032] checks public facts against changed credentials', async (t) => {
  const s = setup(t);
  assert.equal((await s.request({ products: true })).status, 200);
  s.env.UP42_USERNAME = 'Product A';
  errorOf(await s.request({ products: true }), 502, 'bad_upstream');
  assert.equal(s.calls.length, 1);
});

test('[up42-quotes-026] refuses valid excess JSON bytes', async (t) => {
  const prefix =
    '{"summary":{"totalCredits":37,"totalSize":2.75,"unit":"SQ_KM"},"pad":"';
  const body = prefix + 'x'.repeat(4194305 - prefix.length - 2) + '"}';
  assert.equal(Buffer.byteLength(body), 4194305);
  const s = setup(t, {
    respond: (url) => (url === TOKEN ? good(url) : new Response(body)),
  });
  assert.deepEqual(await s.client.post(URLS.estimate, {}), {
    ok: false,
    kind: 'upstream_failed',
  });
});
test('[up42-quotes-026] accepts the exact JSON byte cap', async (t) => {
  const prefix =
    '{"summary":{"totalCredits":37,"totalSize":2.75,"unit":"SQ_KM"},"pad":"';
  const body = prefix + 'x'.repeat(4194304 - prefix.length - 2) + '"}';
  const s = setup(t, {
    respond: (url) =>
      url === TOKEN || url === PRODUCTS ? good(url) : new Response(body),
  });
  const a = await s.request({ value: input({ checks: ['estimate'] }) });
  assert.equal(a.status, 200);
  assert.deepEqual(a.body.results, {
    estimate: { ok: true, credits: 37, size: 2.75, unit: 'SQ_KM', errors: [] },
  });
});
