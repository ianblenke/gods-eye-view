import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { planetPlugins, planetProxy } from '../../server/providers/planet.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 9, 22, 12, 0, 0);
const KEY = 'fixture-key-Q7';
const HOST = '127.0.0.1:5173';
const SEARCH =
  'https://api.planet.com/data/v1/quick-search?_page_size=25&_sort=acquired%20desc';
const BOX = [-82.5, 27.9, -82.4, 28];
const DATES = { start: '2026-10-01', end: '2026-10-20' };
const SCENES = '/api/planet/scenes';
const STATUS = '/api/planet/status';
const THUMBS = '/api/planet/thumbnail';
const RING = [
  [-82.5, 27.9],
  [-82.4, 27.9],
  [-82.4, 28],
  [-82.5, 28],
  [-82.5, 27.9],
];
const LINKS = {
  _self: 'https://api.planet.com/data/v1/searches/CANARY-self/results',
  _first: 'https://api.planet.com/data/v1/searches/CANARY-first/results',
  _next: 'https://api.planet.com/data/v1/searches/CANARY-next/results?_page=x',
};
const thumbOf = (type, id) =>
  `https://tiles.planet.com/data/v1/item-types/${type}/items/${id}/thumb`;
const feature = (n, type = 'PSScene') => {
  const id = `20261001_1500${String(n).padStart(2, '0')}_00_${type === 'PSScene' ? '24a1' : 'ssc1'}`;
  return {
    type: 'Feature',
    id,
    geometry: { type: 'Polygon', coordinates: [RING] },
    properties: {
      acquired: new Date(Date.UTC(2026, 9, 1 + n, 15)).toISOString(),
      item_type: type,
      gsd: type === 'PSScene' ? 3.9 : 0.63,
      cloud_percent: 5,
      provider: 'CANARY-provider',
    },
    _links: {
      _self: `https://api.planet.com/data/v1/item-types/${type}/items/CANARY-${n}`,
      assets: `https://api.planet.com/data/v1/item-types/${type}/items/CANARY-${n}/assets/`,
      thumbnail: thumbOf(type, id),
    },
    _permissions: ['CANARY-permission'],
    assets: ['CANARY-asset'],
  };
};
const json = (status, value, headers = {}) =>
  new Response(
    [204, 205, 304].includes(status) ? null : JSON.stringify(value),
    { status, headers: { 'content-type': 'application/json', ...headers } },
  );
const pageOf = (features, links = LINKS) =>
  json(200, { type: 'FeatureCollection', features, _links: links });
const typeOfBody = (init) => JSON.parse(init.body).item_types[0];
/** The default fake Planet: two PSScene features and one SkySatCollect feature. */
const goodPage = (init) =>
  typeOfBody(init) === 'PSScene'
    ? pageOf([feature(1), feature(2)])
    : pageOf([feature(3, 'SkySatCollect')]);
const GOOD_HEADERS = {
  host: HOST,
  origin: `http://${HOST}`,
  'content-type': 'application/json',
};
const boxAt = (n) => [-82.5 + n * 0.1, 27.9, -82.4 + n * 0.1, 28];

function fakeRequest(method, body, headers, remote, encrypted) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  return Object.assign(
    Readable.from(body === undefined ? [] : [Buffer.from(text)]),
    {
      method,
      headers: { ...GOOD_HEADERS, ...headers },
      socket: { remoteAddress: remote, encrypted },
    },
  );
}

function fakeResponse() {
  return {
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
}

/** Send one request to the routes of a fake middleware list. */
async function send(routes, url, options = {}) {
  const {
    method = 'POST',
    body,
    headers = {},
    remote = '127.0.0.1',
    encrypted = false,
  } = options;
  const req = fakeRequest(method, body, headers, remote, encrypted);
  const res = fakeResponse();
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
  const isJson = String(res.headers['content-type']).startsWith(
    'application/json',
  );
  return {
    status: res.statusCode,
    headers: res.headers,
    text: res.text,
    body: res.text !== undefined && isJson ? JSON.parse(res.text) : undefined,
    next: nexted,
  };
}

/**
 * Install the scenes plugin (or both plugins) on a fake middleware list. Date
 * is mocked for the rate limit; the clock, the fetch function and the timers
 * of the plugins are fakes.
 */
function install(
  t,
  { env = {}, respond, preview = false, clock, both = false } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const calls = [];
  const lines = [];
  const time = clock ?? { value: NOW };
  const environment = { PLANET_API_KEY: KEY, ...env };
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), method: init?.method, init });
    if (respond) return respond(String(url), init, calls.length);
    if (String(url) === SEARCH) return goodPage(init);
    return new Response(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      {
        status: 200,
        headers: { 'content-type': 'image/png' },
      },
    );
  };
  const options = {
    env: environment,
    fetchImpl,
    now: () => time.value,
    setTimer: () => 1,
    clearTimer: () => {},
    log: (line) => lines.push(line),
  };
  const plugins = both ? planetPlugins(options) : [planetProxy(options)];
  const uses = [];
  const routes = new Map();
  for (const plugin of plugins) {
    plugin[preview ? 'configurePreviewServer' : 'configureServer']({
      middlewares: {
        use(route, handler) {
          uses.push(route);
          routes.set(route, handler);
        },
      },
    });
  }
  const request = (url, opts) => send(routes, url, opts);
  const scenes = (body = { bbox: BOX, ...DATES }, opts = {}) =>
    request(SCENES, { body, ...opts });
  return {
    plugin: plugins[0],
    uses,
    request,
    scenes,
    env: environment,
    calls,
    lines,
    time,
    advance: (ms) => {
      time.value += ms;
      t.mock.timers.tick(ms);
    },
  };
}

const searches = (server) =>
  server.calls.filter((call) => call.url === SEARCH).length;
/** Let the streams and the promises of a request run. Only Date is mocked. */
const settle = async () => {
  for (let i = 0; i < 10; i++)
    await new Promise((resolve) => setImmediate(resolve));
};

test('[planet-source-001] mounts the two routes and passes other paths to next', async (t) => {
  const server = install(t);
  assert.equal(server.plugin.name, 'planet-proxy');
  assert.deepEqual(server.uses.sort(), [SCENES, STATUS]);
  const preview = install(t, { preview: true });
  assert.deepEqual(preview.uses.sort(), [SCENES, STATUS]);
  const status = await server.request(STATUS, { method: 'GET' });
  assert.equal(status.status, 200);
  assert.equal(status.next, false);
  const scenes = await server.scenes();
  assert.equal(scenes.status, 200);
  assert.equal(scenes.next, false);
  const other = await server.request('/api/planet/other');
  assert.equal(other.next, true);
  assert.equal(other.status, undefined);
  const below = await server.request(`${SCENES}/x`);
  assert.equal(below.next, true);
  assert.equal(below.status, undefined);
  const belowStatus = await server.request(`${STATUS}/x`, { method: 'GET' });
  assert.equal(belowStatus.next, true);
  assert.equal(belowStatus.status, undefined);
  const belowCross = await server.request(`${STATUS}/x`, {
    method: 'GET',
    headers: { 'sec-fetch-site': 'cross-site' },
  });
  assert.equal(belowCross.next, true);
  assert.equal(belowCross.status, undefined);
});

test('[planet-source-001] localProviderPlugins holds the scenes plugin once', () => {
  const names = localProviderPlugins().map((plugin) => plugin.name);
  assert.equal(names.filter((name) => name === 'planet-proxy').length, 1);
});

test('[planet-source-002] reports the status of the key, refuses another method and a cross-site request', async (t) => {
  for (const [value, configured] of [
    [KEY, true],
    [` ${KEY} `, true],
    ['x', true],
    ['', false],
    ['   ', false],
    ['\t\n', false],
    [undefined, false],
  ]) {
    const server = install(t, { env: { PLANET_API_KEY: value } });
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

test('[planet-source-003] refuses GET, PUT, PATCH and DELETE on the scenes route', async (t) => {
  const server = install(t);
  for (const method of ['GET', 'PUT', 'PATCH', 'DELETE']) {
    const answer = await server.scenes(undefined, { method });
    assert.equal(answer.status, 405, method);
    assert.deepEqual(answer.body, { error: 'Method not allowed' });
  }
  assert.equal(server.calls.length, 0);
});

test('[planet-source-004] refuses a scenes request that fails a check of admitSameSiteRequest or has another Content-Type', async (t) => {
  const server = install(t);
  for (const options of [
    { headers: { 'sec-fetch-site': 'cross-site' } },
    { headers: { 'sec-fetch-site': 'same-site' } },
    { headers: { 'x-forwarded-for': '127.0.0.1' } },
    { headers: { origin: 'null' } },
    { headers: { host: 'localhost:5173', origin: 'http://example.test' } },
    { headers: { origin: 'http://example.test' } },
    { headers: { 'content-type': 'text/plain' } },
    { headers: { 'content-type': 'application/json; charset=utf-8' } },
    { headers: { 'content-type': undefined } },
  ]) {
    const answer = await server.scenes(undefined, options);
    assert.equal(answer.status, 403, JSON.stringify(options));
    assert.deepEqual(answer.body, { error: 'cross_origin' });
  }
  assert.equal(server.calls.length, 0);
});

test('[planet-source-005] accepts a request through the reverse proxy and a request from this machine', async (t) => {
  const server = install(t);
  const proxied = await server.scenes(undefined, {
    remote: '192.0.2.10',
    headers: {
      host: 'godseye.example.test',
      origin: 'http://godseye.example.test',
      'sec-fetch-site': 'same-origin',
    },
  });
  assert.equal(proxied.status, 200);
  assert.equal(searches(server), 2);
  const local = await server.scenes(
    { bbox: boxAt(1), ...DATES },
    { headers: { host: 'localhost:5173', origin: 'http://localhost:5173' } },
  );
  assert.equal(local.status, 200);
  assert.equal(local.body.cached, false);
  assert.equal(searches(server), 4);
  const proxyHeaders = {
    host: 'godseye.example.test',
    origin: 'https://godseye.example.test',
    'sec-fetch-site': 'same-origin',
  };
  const encrypted = await server.scenes(
    { bbox: boxAt(2), ...DATES },
    { headers: proxyHeaders, encrypted: true },
  );
  assert.equal(encrypted.status, 200);
  assert.equal(searches(server), 6);
  const plain = await server.scenes(
    { bbox: boxAt(3), ...DATES },
    { headers: proxyHeaders },
  );
  assert.equal(plain.status, 403);
  assert.deepEqual(plain.body, { error: 'cross_origin' });
  assert.equal(searches(server), 6);
});

test('[planet-source-006] refuses each body that fails a check of the SkyWatch route and sends no upstream request', async (t) => {
  const head = JSON.stringify({ bbox: BOX, ...DATES });
  const over = head.slice(0, -1) + ' '.repeat(4097 - head.length) + '}';
  assert.equal(Buffer.byteLength(over), 4097);
  const cases = [
    [over, { error: 'bad_body' }],
    [{ bbox: BOX, ...DATES, x: 1 }, { error: 'bad_body' }],
    [{ bbox: [1, 0, 0, 1], ...DATES }, { error: 'bad_bbox' }],
    [
      { bbox: [0, 0, 0.4497, 0.4497], ...DATES },
      { error: 'area_too_large', maxKm2: 2500 },
    ],
    [
      { bbox: BOX, start: '2026-01-01', end: '2026-04-03' },
      { error: 'bad_dates' },
    ],
  ];
  for (const [body, error] of cases) {
    const server = install(t);
    const answer = await server.scenes(body);
    assert.equal(answer.status, 400, JSON.stringify(error));
    assert.deepEqual(answer.body, error);
    assert.equal(server.calls.length, 0);
  }
  const server = install(t);
  const passes = await server.scenes({
    bbox: [0, 0, 0.4496, 0.4496],
    start: '2026-01-01',
    end: '2026-04-02',
  });
  assert.equal(passes.status, 200);
  assert.equal(searches(server), 2);
  const exact = head.slice(0, -1) + ' '.repeat(4096 - head.length) + '}';
  assert.equal(Buffer.byteLength(exact), 4096);
  const fits = install(t);
  assert.equal((await fits.scenes(exact)).status, 200);
});

test('[planet-source-006] checks the end date against the UTC date of the option now, not of Date', async (t) => {
  const server = install(t, {
    clock: { value: Date.UTC(2026, 9, 22, 23, 59) },
  });
  t.mock.timers.setTime(Date.UTC(2026, 9, 25, 12, 0));
  const today = await server.scenes({
    bbox: BOX,
    start: '2026-10-01',
    end: '2026-10-22',
  });
  assert.equal(today.status, 200);
  const tomorrow = await server.scenes({
    bbox: boxAt(1),
    start: '2026-10-01',
    end: '2026-10-23',
  });
  assert.equal(tomorrow.status, 400);
  assert.deepEqual(tomorrow.body, { error: 'bad_dates' });
  assert.equal(searches(server), 2);
});

test('[planet-source-007] refuses a valid request when the key is not set or holds only white space', async (t) => {
  for (const value of [undefined, '', '  ', '\t']) {
    const server = install(t, { env: { PLANET_API_KEY: value } });
    const answer = await server.scenes();
    assert.equal(answer.status, 503, String(value));
    assert.deepEqual(answer.body, { error: 'no_key', keyRequired: true });
    assert.equal(server.calls.length, 0);
  }
});

test('[planet-source-008] keeps the key out of each answer and sends the trimmed key in Authorization', async (t) => {
  const answers = [];
  const failing = [
    () => json(401, { message: `bad key ${KEY}` }),
    () => json(429, {}, { 'retry-after': '5' }),
    () => json(500, { message: KEY }),
  ];
  const env = { PLANET_API_KEY: ` ${KEY} ` };
  const server = install(t, { env, both: true });
  answers.push(await server.request(STATUS, { method: 'GET' }));
  const good = await server.scenes();
  answers.push(good);
  for (const scene of good.body.scenes)
    answers.push(
      await server.request(`${THUMBS}/${scene.id}`, { method: 'GET' }),
    );
  for (const [n, fail] of failing.entries()) {
    const other = install(t, { env, respond: () => fail() });
    answers.push(await other.scenes({ bbox: boxAt(n + 1), ...DATES }));
    assert.equal(other.calls.length, 1);
    for (const call of other.calls)
      assert.equal(call.init.headers.Authorization, `api-key ${KEY}`);
  }
  for (const answer of answers) {
    assert.equal(String(answer.text).includes(KEY), false);
    assert.equal(JSON.stringify(answer.headers).includes(KEY), false);
  }
  assert.equal(server.calls.length, 5);
  for (const call of server.calls)
    assert.equal(call.init.headers.Authorization, `api-key ${KEY}`);
});

test('[planet-source-010] sends only the search requests and the thumbnail requests, and no request to a URL of the links', async (t) => {
  const image = () =>
    new Response(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      {
        status: 200,
        headers: { 'content-type': 'image/png' },
      },
    );
  const flows = [
    {},
    { respond: () => json(401, {}) },
    { respond: () => json(403, {}) },
    { respond: () => json(429, {}, { 'retry-after': '9' }) },
    { respond: () => json(500, {}) },
    { respond: () => new Response('not json', { status: 200 }) },
    { respond: () => json(200, { features: {} }) },
    { respond: () => new Response('x'.repeat(4194305), { status: 200 }) },
    {
      respond: () => {
        throw new TypeError('fetch failed');
      },
    },
    {
      respond: (url, init) =>
        url === SEARCH && typeOfBody(init) === 'PSScene'
          ? goodPage(init)
          : json(500, {}),
    },
    {
      respond: (url, init) => (url === SEARCH ? goodPage(init) : json(404, {})),
    },
    {
      respond: (url, init) =>
        url === SEARCH
          ? goodPage(init)
          : new Response('<html>', {
              headers: { 'content-type': 'text/html' },
            }),
    },
    {
      respond: (url, init) => {
        if (url === SEARCH) return goodPage(init);
        throw new TypeError('redirect mode is set to error');
      },
    },
    {
      env: { PLANET_THUMBNAILS: 'false' },
      respond: (url, init) => (url === SEARCH ? goodPage(init) : image()),
    },
  ];
  const all = [];
  const ids = [feature(1).id, feature(3, 'SkySatCollect').id, 'unknown-id'];
  for (const flow of flows) {
    const server = install(t, { ...flow, both: true });
    await server.request(STATUS, { method: 'GET' });
    await server.scenes();
    await server.scenes();
    for (const id of ids)
      await server.request(`${THUMBS}/${id}`, { method: 'GET' });
    all.push(...server.calls);
  }
  const thumbs = [
    thumbOf('PSScene', feature(1).id),
    thumbOf('SkySatCollect', feature(3, 'SkySatCollect').id),
  ];
  const links = [
    ...Object.values(LINKS),
    ...[feature(1), feature(2), feature(3, 'SkySatCollect')].flatMap((f) => [
      f._links._self,
      f._links.assets,
    ]),
  ];
  for (const call of all) {
    assert.ok(
      (call.url === SEARCH && call.method === 'POST') ||
        (thumbs.includes(call.url) && call.method === 'GET'),
      `${call.method} ${call.url}`,
    );
    assert.equal(links.includes(call.url), false, call.url);
  }
  assert.ok(all.filter((call) => call.url === SEARCH).length > 14);
  assert.ok(all.filter((call) => thumbs.includes(call.url)).length >= 8);
});

test('[planet-source-011] counts each new search once against the daily limit and refuses at the limit', async (t) => {
  const server = install(t, { env: { PLANET_DAILY_SEARCHES: '2' } });
  const first = await server.scenes({ bbox: boxAt(1), ...DATES });
  assert.deepEqual(first.body.budget, { used: 1, limit: 2 });
  assert.equal(searches(server), 2);
  const second = await server.scenes({ bbox: boxAt(2), ...DATES });
  assert.deepEqual(second.body.budget, { used: 2, limit: 2 });
  const third = await server.scenes({ bbox: boxAt(3), ...DATES });
  assert.equal(third.status, 429);
  assert.deepEqual(third.body, { error: 'budget', used: 2, limit: 2 });
  assert.equal(searches(server), 4);
});

test('[planet-source-011] counts a failed search against the daily limit', async (t) => {
  const server = install(t, {
    env: { PLANET_DAILY_SEARCHES: '1' },
    respond: () => json(500, {}),
  });
  const failed = await server.scenes({ bbox: boxAt(1), ...DATES });
  assert.equal(failed.status, 502);
  const refused = await server.scenes({ bbox: boxAt(2), ...DATES });
  assert.deepEqual(refused.body, { error: 'budget', used: 1, limit: 1 });
  assert.equal(searches(server), 1);
});

test('[planet-source-011] reads the daily limit from PLANET_DAILY_SEARCHES, and uses 20 for each other value', async (t) => {
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
    const server = install(t, { env: { PLANET_DAILY_SEARCHES: value } });
    const answer = await server.scenes();
    assert.deepEqual(answer.body.budget, { used: 1, limit }, String(value));
  }
});

test('[planet-source-011] starts the count again at 0 on the next UTC day', async (t) => {
  const clock = { value: Date.UTC(2026, 9, 21, 23, 59, 59, 999) };
  const server = install(t, { env: { PLANET_DAILY_SEARCHES: '1' }, clock });
  assert.equal((await server.scenes({ bbox: boxAt(1), ...DATES })).status, 200);
  assert.equal((await server.scenes({ bbox: boxAt(2), ...DATES })).status, 429);
  clock.value += 1;
  const next = await server.scenes({ bbox: boxAt(3), ...DATES });
  assert.equal(next.status, 200);
  assert.deepEqual(next.body.budget, { used: 1, limit: 1 });
});

test('[planet-source-011] counts a search while it is in flight, so a second box gets the budget refusal', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const server = install(t, {
    env: { PLANET_DAILY_SEARCHES: '1' },
    respond: async (url, init) => {
      await gate;
      return goodPage(init);
    },
  });
  const first = server.scenes({ bbox: boxAt(1), ...DATES });
  await settle();
  const pending = server.scenes({ bbox: boxAt(2), ...DATES });
  await settle();
  release();
  const [done, second] = await Promise.all([first, pending]);
  assert.deepEqual(second.body, { error: 'budget', used: 1, limit: 1 });
  assert.equal(done.status, 200);
  assert.equal(searches(server), 2);
});

test('[planet-source-012] answers a repeated request from the store for 599999 ms, with the budget of the new request', async (t) => {
  const server = install(t);
  const first = await server.scenes();
  assert.equal(first.body.cached, false);
  await server.scenes({ bbox: boxAt(1), ...DATES });
  server.advance(599999);
  const again = await server.scenes();
  assert.equal(again.body.cached, true);
  assert.deepEqual(again.body.scenes, first.body.scenes);
  assert.deepEqual(again.body.budget, { used: 2, limit: 20 });
  assert.equal(searches(server), 4);
  server.advance(1);
  const old = await server.scenes();
  assert.equal(old.body.cached, false);
  assert.equal(searches(server), 6);
});

test('[planet-source-012] keeps at most 32 answers and removes the oldest answer first', async (t) => {
  const server = install(t, { env: { PLANET_DAILY_SEARCHES: '100' } });
  // 10001 ms between requests keeps each window of 60000 ms under the rate limit.
  for (let n = 0; n < 33; n++) {
    assert.equal(
      (await server.scenes({ bbox: boxAt(n), ...DATES })).status,
      200,
    );
    server.advance(10001);
  }
  assert.equal(searches(server), 66);
  assert.equal(
    (await server.scenes({ bbox: boxAt(1), ...DATES })).body.cached,
    true,
  );
  server.advance(10001);
  assert.equal(
    (await server.scenes({ bbox: boxAt(0), ...DATES })).body.cached,
    false,
  );
  assert.equal(searches(server), 68);
});

test('[planet-source-012 planet-source-016] keeps no failure in the store', async (t) => {
  let fail = true;
  const server = install(t, {
    respond: (url, init) => (fail ? json(500, {}) : goodPage(init)),
  });
  assert.equal((await server.scenes()).status, 502);
  fail = false;
  const after = await server.scenes();
  assert.equal(after.status, 200);
  assert.equal(after.body.cached, false);
});

test('[planet-source-013] shares an upstream search that is in flight', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const server = install(t, {
    respond: async (url, init) => {
      await gate;
      return goodPage(init);
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
  assert.equal(searches(server), 2);
  assert.deepEqual(b.body.budget, { used: 1, limit: 20 });
});

test('[planet-source-015] shares an upstream search that is in flight when the count equals the limit', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const server = install(t, {
    env: { PLANET_DAILY_SEARCHES: '1' },
    respond: async (url, init) => {
      await gate;
      return goodPage(init);
    },
  });
  const first = server.scenes();
  await settle();
  const second = server.scenes();
  await settle();
  release();
  const [a, b] = await Promise.all([first, second]);
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
  assert.equal(b.body.cached, true);
  assert.deepEqual(b.body.budget, { used: 1, limit: 1 });
  assert.equal(searches(server), 2);
});

test('[planet-source-013] gives the failure of a shared search to each request that waits', async (t) => {
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

test('[planet-source-014] refuses the 7th request in 60000 ms, and a stored answer counts', async (t) => {
  const server = install(t);
  for (let n = 0; n < 6; n++) {
    const answer = await server.scenes({ bbox: boxAt(n % 2), ...DATES });
    assert.equal(answer.status, 200, String(n));
  }
  assert.equal(searches(server), 4);
  server.advance(59999);
  const refused = await server.scenes({ bbox: boxAt(5), ...DATES });
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, { error: 'rate_limited' });
  assert.equal(refused.headers['retry-after'], '60');
  server.advance(1);
  const passes = await server.scenes({ bbox: boxAt(5), ...DATES });
  assert.equal(passes.status, 200);
});

test('[planet-source-014] lets the 6th request pass at 59999 ms after 5 requests at 0 ms', async (t) => {
  const server = install(t);
  for (let n = 0; n < 5; n++) {
    assert.equal((await server.scenes()).status, 200, String(n));
  }
  server.advance(59999);
  assert.equal((await server.scenes()).status, 200);
  assert.equal((await server.scenes()).status, 429);
});

test('[planet-source-014] counts a request that the body step refuses', async (t) => {
  const server = install(t);
  const over = JSON.stringify({ bbox: BOX, ...DATES }).padEnd(4097, ' ');
  for (let n = 0; n < 6; n++) {
    assert.deepEqual((await server.scenes(over)).body, { error: 'bad_body' });
  }
  const limited = await server.scenes(over);
  assert.equal(limited.status, 429);
  assert.deepEqual(limited.body, { error: 'rate_limited' });
});

test('[planet-source-015] answers with the first step that fails', async (t) => {
  const server = install(t, {
    env: { PLANET_API_KEY: '', PLANET_DAILY_SEARCHES: '1' },
  });
  const badAll = { bbox: [0, 0, 5, 5], start: 'x' };
  const crossSite = { 'sec-fetch-site': 'cross-site' };
  assert.equal(
    (await server.scenes(badAll, { method: 'GET', headers: crossSite })).status,
    405,
  );
  assert.deepEqual((await server.scenes(badAll, { headers: crossSite })).body, {
    error: 'cross_origin',
  });
  assert.deepEqual((await server.scenes('{"bbox":')).body, {
    error: 'bad_body',
  });
  assert.deepEqual((await server.scenes({ bbox: 'x', start: 'x' })).body, {
    error: 'bad_bbox',
  });
  assert.deepEqual(
    (await server.scenes({ bbox: [0, 0, 5, 5], start: 'x', end: 'y' })).body,
    { error: 'area_too_large', maxKm2: 2500 },
  );
  assert.deepEqual(
    (await server.scenes({ bbox: BOX, start: 'x', end: 'y' })).body,
    { error: 'bad_dates' },
  );
  assert.deepEqual((await server.scenes()).body, {
    error: 'no_key',
    keyRequired: true,
  });
  assert.equal(server.calls.length, 0);
});

test('[planet-source-015] checks the rate limit before the body, and the store before the daily count', async (t) => {
  const server = install(t, { env: { PLANET_DAILY_SEARCHES: '1' } });
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
  assert.equal(searches(server), 2);
});

test('[planet-source-015] refuses a request from another site, or with another Content-Type, before the rate limit', async (t) => {
  const server = install(t);
  for (let n = 0; n < 7; n++) {
    const answer = await server.scenes(undefined, {
      headers: { 'sec-fetch-site': 'cross-site' },
    });
    assert.deepEqual(answer.body, { error: 'cross_origin' });
  }
  for (let n = 0; n < 7; n++) {
    const answer = await server.scenes(undefined, {
      headers: { 'content-type': 'text/plain' },
    });
    assert.deepEqual(answer.body, { error: 'cross_origin' });
  }
  const local = await server.scenes();
  assert.equal(local.status, 200);
});

test('[planet-source-015] checks the key before the store', async (t) => {
  const server = install(t);
  assert.equal((await server.scenes()).status, 200);
  server.env.PLANET_API_KEY = '';
  const stored = await server.scenes();
  assert.equal(stored.status, 503);
  assert.deepEqual(stored.body, { error: 'no_key', keyRequired: true });
});

test('[planet-source-031] writes one line for a good search, with the count of the answer, the number of search requests and the time', async (t) => {
  const clock = { value: NOW };
  const server = install(t, {
    clock,
    respond: (url, init) => {
      clock.value = NOW + 40;
      return typeOfBody(init) === 'PSScene'
        ? pageOf([feature(1), feature(2), null])
        : pageOf([feature(3, 'SkySatCollect')]);
    },
  });
  const answer = await server.scenes();
  assert.equal(answer.body.count, 3);
  assert.deepEqual(server.lines, ['[planet] ok scenes=3 requests=2 ms=40']);
});

test('[planet-source-031] writes one line for each failure, with the number of search requests', async (t) => {
  const cases = [
    [() => json(401, {}), '[planet] failed kind=key_rejected requests=1 ms=40'],
    [
      (init) =>
        typeOfBody(init) === 'PSScene' ? goodPage(init) : json(500, {}),
      '[planet] failed kind=upstream_failed requests=2 ms=40',
    ],
    [
      () => json(429, {}),
      '[planet] failed kind=upstream_rate_limit requests=1 ms=40',
    ],
    [
      (init) =>
        typeOfBody(init) === 'PSScene'
          ? goodPage(init)
          : json(200, { features: 'x' }),
      '[planet] failed kind=bad_upstream requests=2 ms=40',
    ],
  ];
  for (const [respond, line] of cases) {
    const clock = { value: NOW };
    const server = install(t, {
      clock,
      respond: (url, init) => {
        clock.value = NOW + 40;
        return respond(init);
      },
    });
    await server.scenes();
    assert.deepEqual(server.lines, [line]);
  }
});

test('[planet-source-031] writes no key, scene id, URL or host name, and no line for a request with no search', async (t) => {
  const server = install(t, {
    respond: () => {
      throw new TypeError(`fetch failed ${KEY} ${SEARCH}`);
    },
  });
  await server.scenes();
  const good = install(t);
  await good.scenes();
  await good.scenes();
  await good.scenes('not json');
  await good.scenes(undefined, { method: 'GET' });
  await good.scenes(undefined, { headers: { 'sec-fetch-site': 'cross-site' } });
  assert.equal(good.lines.length, 1);
  const lines = [...server.lines, ...good.lines].join('\n');
  for (const word of [
    KEY,
    feature(1).id,
    feature(3, 'SkySatCollect').id,
    'https://',
    'api.planet.com',
    'tiles.planet.com',
  ])
    assert.equal(lines.includes(word), false, word);
  const limited = install(t, { env: { PLANET_DAILY_SEARCHES: '1' } });
  await limited.scenes();
  await limited.scenes({ bbox: boxAt(1), ...DATES });
  assert.equal(limited.lines.length, 1);
});

test('[planet-source-031] logs with console.log when the test gives no option log', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const lines = [];
  t.mock.method(console, 'log', (line) => lines.push(line));
  const plugin = planetProxy({
    env: { PLANET_API_KEY: KEY },
    fetchImpl: async (url, init) => goodPage(init),
  });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (route, handler) => routes.set(route, handler) },
  });
  const answer = await send(routes, SCENES, { body: { bbox: BOX, ...DATES } });
  assert.equal(answer.status, 200);
  assert.deepEqual(lines, ['[planet] ok scenes=3 requests=2 ms=0']);
});
