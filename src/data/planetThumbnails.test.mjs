import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { planetThumbnailProxy } from '../../server/providers/planet/thumbnails.js';
import { planetPlugins } from '../../server/providers/planet.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 9, 22, 12, 0, 0);
const KEY = 'fixture-key-Q7';
const HOST = '127.0.0.1:5173';
const ROUTE = '/api/planet/thumbnail';
const SEARCH =
  'https://api.planet.com/data/v1/quick-search?_page_size=25&_sort=acquired%20desc';
const BOX = [-82.5, 27.9, -82.4, 28];
const DATES = { start: '2026-10-01', end: '2026-10-20' };
const RING = [
  [-82.5, 27.9],
  [-82.4, 27.9],
  [-82.4, 28],
  [-82.5, 28],
  [-82.5, 27.9],
];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff];
const ACCEPT = 'image/png, image/jpeg, image/webp';
const GOOD_HEADERS = { host: HOST, 'sec-fetch-site': 'same-origin' };
const thumbOf = (type, id) =>
  `https://tiles.planet.com/data/v1/item-types/${type}/items/${id}/thumb`;

const bytesOf = (...parts) => Uint8Array.from(parts.flat());
const image = (body = bytesOf(PNG, [1]), type = 'image/png', extra = {}) =>
  new Response(body, {
    status: 200,
    headers: type === null ? extra : { 'content-type': type, ...extra },
  });
const png = () => image(bytesOf(PNG, [1, 2, 3]));
const json = (status, value) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json' },
  });

/** A body stream that gives its chunks only when the test opens the gate. */
function gatedBody(chunks) {
  let open;
  const gate = new Promise((resolve) => {
    open = resolve;
  });
  let pulls = 0;
  const stream = new ReadableStream(
    {
      async pull(controller) {
        pulls += 1;
        await gate;
        const chunk = chunks.shift();
        if (chunk === undefined) controller.close();
        else controller.enqueue(chunk);
      },
    },
    { highWaterMark: 0 },
  );
  return { stream, open, pulls: () => pulls };
}

/** A fake fetch that rejects when the signal of the request aborts. */
const hanging = (init) =>
  new Promise((_, reject) => {
    init.signal.addEventListener('abort', () => reject(init.signal.reason), {
      once: true,
    });
  });

/** Send one request through the routes of a fake middleware list. */
async function send(routes, url, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    remote = '127.0.0.1',
    encrypted = false,
  } = options;
  const req = Object.assign(
    Readable.from(body === undefined ? [] : [Buffer.from(body)]),
    {
      method,
      headers: { ...GOOD_HEADERS, ...headers },
      socket: { remoteAddress: remote, encrypted },
    },
  );
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
      this.chunk = chunk;
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
  const bytes =
    res.chunk === undefined ? undefined : Buffer.from(res.chunk ?? '');
  const isJson = String(res.headers['content-type'] ?? '').startsWith(
    'application/json',
  );
  return {
    status: res.statusCode,
    headers: res.headers,
    bytes,
    body: isJson ? JSON.parse(bytes.toString('utf8')) : undefined,
    next: nexted,
  };
}

/**
 * Install the thumbnail plugin alone on a fake middleware list, with a fake
 * item-type lookup. Date is mocked for the rate limit; the clock, the fetch
 * function and the timers of the plugin are fakes.
 */
function install(
  t,
  { env = {}, types = {}, respond, preview = false, noLookup, noLog } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const calls = [];
  const lines = [];
  const timers = { set: [], cleared: [] };
  const time = { value: NOW };
  const environment = { PLANET_API_KEY: KEY, ...env };
  const options = {
    env: environment,
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init });
      if (respond) return respond(String(url), init, calls.length, time);
      return png();
    },
    now: () => time.value,
    setTimer: (fn, ms) => {
      const id = `timer-${timers.set.length + 1}`;
      timers.set.push({ id, fn, ms });
      return id;
    },
    clearTimer: (id) => timers.cleared.push(id),
    log: (line) => lines.push(line),
    thumbnailTypeOf: (id) => types[id] ?? null,
  };
  if (noLookup) delete options.thumbnailTypeOf;
  if (noLog) delete options.log;
  const plugin = planetThumbnailProxy(options);
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
  const request = (url, opts) => send(routes, url, opts);
  return {
    plugin,
    uses,
    request,
    get: (id, opts) => request(`${ROUTE}/${id}`, opts),
    env: environment,
    calls,
    lines,
    timers,
    time,
    advance: (ms) => {
      time.value += ms;
      t.mock.timers.tick(ms);
    },
  };
}

const feature = (
  id,
  type,
  acquired = '2026-10-05T15:00:00Z',
  thumb = true,
) => ({
  type: 'Feature',
  id,
  geometry: { type: 'Polygon', coordinates: [RING] },
  properties: { acquired, gsd: 3 },
  _links: thumb ? { thumbnail: thumbOf(type, id) } : {},
});
const typeOfBody = (init) => JSON.parse(init.body).item_types[0];

/**
 * Make the two plugins with one call of planetPlugins. Each search gives the
 * next pair of pages of `answers`: the PSScene features and the SkySatCollect
 * features.
 */
function installPair(t, answers) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const calls = [];
  const time = { value: NOW };
  const queue = [...answers];
  let current;
  const plugins = planetPlugins({
    env: { PLANET_API_KEY: KEY, PLANET_DAILY_SEARCHES: '100' },
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init });
      if (String(url) !== SEARCH) return png();
      if (typeOfBody(init) === 'PSScene') current = queue.shift();
      const features =
        typeOfBody(init) === 'PSScene' ? current[0] : (current[1] ?? []);
      return json(200, { features, _links: {} });
    },
    now: () => time.value,
    setTimer: () => 1,
    clearTimer: () => {},
    log: () => {},
  });
  const routes = new Map();
  for (const plugin of plugins) {
    plugin.configureServer({
      middlewares: { use: (route, handler) => routes.set(route, handler) },
    });
  }
  const search = async (bbox = BOX) => {
    const answer = await send(routes, '/api/planet/scenes', {
      method: 'POST',
      body: JSON.stringify({ bbox, ...DATES }),
      headers: { 'content-type': 'application/json' },
    });
    return answer.body;
  };
  return {
    plugins,
    calls,
    time,
    search,
    get: (id) => send(routes, `${ROUTE}/${id}`),
    thumbs: () => calls.filter((call) => call.url !== SEARCH),
    advance: (ms) => {
      time.value += ms;
      t.mock.timers.tick(ms);
    },
  };
}

/** Let the streams and the promises of a request run. Only Date is mocked. */
const settle = async () => {
  for (let i = 0; i < 10; i++)
    await new Promise((resolve) => setImmediate(resolve));
};

// --- Route, same site, method, variable and rate limit ------------------------

test('[planet-source-020] answers a path with an id and passes other paths to next', async (t) => {
  const server = install(t, { types: { abc: 'PSScene' } });
  assert.equal(server.plugin.name, 'planet-thumbnail-proxy');
  assert.deepEqual(server.uses, [ROUTE]);
  assert.deepEqual(install(t, { preview: true }).uses, [ROUTE]);
  for (const path of [`${ROUTE}/abc`, `${ROUTE}/abc?x=1`]) {
    const answer = await server.request(path);
    assert.equal(answer.next, false, path);
    assert.equal(answer.status, 200, path);
  }
  for (const path of [
    ROUTE,
    `${ROUTE}/`,
    `${ROUTE}/a/b`,
    `${ROUTE}/a.b`,
    `${ROUTE}/%41`,
    `${ROUTE}/${'a'.repeat(129)}`,
  ]) {
    const answer = await server.request(path);
    assert.equal(answer.next, true, path);
    assert.equal(answer.status, undefined, path);
  }
  const long = await server.get('a'.repeat(128));
  assert.equal(long.next, false);
  assert.equal(long.status, 404);
  assert.equal(server.calls.length, 2);
});

test('[planet-source-020] is once in localProviderPlugins, directly after planet-proxy', () => {
  const names = localProviderPlugins().map((plugin) => plugin.name);
  assert.equal(
    names.filter((name) => name === 'planet-thumbnail-proxy').length,
    1,
  );
  assert.equal(
    names.indexOf('planet-thumbnail-proxy'),
    names.indexOf('planet-proxy') + 1,
  );
});

test('[planet-source-020] reads process.env in localProviderPlugins, and finds a scene of the planet-proxy plugin of the same list', async (t) => {
  const names = [
    'PLANET_API_KEY',
    'PLANET_THUMBNAILS',
    'PLANET_DAILY_SEARCHES',
  ];
  const saved = names.map((name) => process.env[name]);
  t.after(() => {
    names.forEach((name, i) => {
      if (saved[i] === undefined) delete process.env[name];
      else process.env[name] = saved[i];
    });
  });
  process.env.PLANET_API_KEY = KEY;
  delete process.env.PLANET_THUMBNAILS;
  delete process.env.PLANET_DAILY_SEARCHES;
  const fetched = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    fetched.push({ url: String(url), init });
    if (String(url) === SEARCH) {
      const type = typeOfBody(init);
      const features = type === 'PSScene' ? [feature('p1', 'PSScene')] : [];
      return json(200, { features, _links: {} });
    }
    return png();
  });
  t.mock.method(console, 'log', () => {});
  const plugins = localProviderPlugins();
  const routes = new Map();
  for (const name of ['planet-proxy', 'planet-thumbnail-proxy']) {
    plugins
      .find((plugin) => plugin.name === name)
      .configureServer({
        middlewares: { use: (route, handler) => routes.set(route, handler) },
      });
  }
  const answer = await send(routes, '/api/planet/scenes', {
    method: 'POST',
    body: JSON.stringify({ bbox: BOX, ...DATES }),
    headers: { 'content-type': 'application/json' },
  });
  assert.equal(answer.body.scenes[0].id, 'p1');
  const thumb = await send(routes, `${ROUTE}/p1`);
  assert.equal(thumb.status, 200);
  assert.equal(thumb.headers['content-type'], 'image/png');
  assert.equal(fetched.at(-1).url, thumbOf('PSScene', 'p1'));
  assert.equal(fetched.at(-1).init.headers.Authorization, `api-key ${KEY}`);
});

test('[planet-source-021] refuses a request that fails a check of admitSameSiteRequest', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  for (const headers of [
    { 'sec-fetch-site': 'cross-site' },
    { 'x-forwarded-for': '127.0.0.1' },
    { origin: 'null' },
    { host: 'localhost:5173', origin: 'http://example.test' },
    { host: 'godseye.example.test', origin: 'https://godseye.example.test' },
  ]) {
    const answer = await server.get('a', { headers });
    assert.equal(answer.status, 403, JSON.stringify(headers));
    assert.deepEqual(answer.body, { error: 'cross_origin' });
  }
  assert.equal(server.calls.length, 0);
});

test('[planet-source-021] accepts an https origin on an encrypted socket', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  const answer = await server.get('a', {
    encrypted: true,
    headers: {
      host: 'godseye.example.test',
      origin: 'https://godseye.example.test',
    },
  });
  assert.equal(answer.status, 200);
  assert.equal(server.calls.length, 1);
});

test('[planet-source-021] accepts a same-origin request through the reverse proxy', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  const answer = await server.get('a', {
    remote: '192.0.2.10',
    headers: {
      host: 'godseye.example.test',
      origin: 'http://godseye.example.test',
      'sec-fetch-site': 'same-origin',
    },
  });
  assert.equal(answer.status, 200);
  assert.equal(server.calls.length, 1);
});

test('[planet-source-021] refuses POST, PUT, DELETE and HEAD after the same-site step', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD']) {
    const answer = await server.get('a', { method });
    assert.equal(answer.status, 405, method);
    assert.deepEqual(answer.body, { error: 'Method not allowed' });
  }
  const cross = await server.get('a', {
    method: 'POST',
    headers: { 'sec-fetch-site': 'cross-site' },
  });
  assert.equal(cross.status, 403);
  assert.equal(server.calls.length, 0);
});

test('[planet-source-022] answers thumbnails_off only when PLANET_THUMBNAILS is exactly the text false', async (t) => {
  const off = install(t, {
    types: { a: 'PSScene' },
    env: { PLANET_THUMBNAILS: 'false' },
  });
  const answer = await off.get('a');
  assert.equal(answer.status, 404);
  assert.deepEqual(answer.body, { error: 'thumbnails_off' });
  assert.equal(off.calls.length, 0);
  for (const value of [
    undefined,
    '',
    'true',
    'FALSE',
    '0',
    'false ',
    ' false',
    'no',
  ]) {
    const server = install(t, {
      types: { a: 'PSScene' },
      env: { PLANET_THUMBNAILS: value },
    });
    const on = await server.get('a');
    assert.equal(on.status, 200, String(value));
    assert.equal(server.calls.length, 1, String(value));
  }
});

test('[planet-source-023] refuses the 31st request at 59999 ms after 30 requests at 0 ms, and lets it pass at 60000 ms', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  for (let n = 0; n < 30; n++) {
    assert.equal((await server.get('a')).status, 200, String(n));
  }
  server.advance(59999);
  const refused = await server.get('a');
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, { error: 'rate_limited' });
  assert.equal(refused.headers['retry-after'], '60');
  server.advance(1);
  assert.equal((await server.get('a')).status, 200);
});

test('[planet-source-023] lets the 30th request pass, and has one count for all socket addresses', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  for (let n = 0; n < 29; n++) {
    const remote = n % 2 === 0 ? '127.0.0.1' : '192.0.2.10';
    assert.equal((await server.get('a', { remote })).status, 200);
  }
  server.advance(59999);
  assert.equal((await server.get('a', { remote: '192.0.2.10' })).status, 200);
  const refused = await server.get('a', { remote: '198.51.100.7' });
  assert.equal(refused.status, 429);
  assert.equal(server.calls.length, 30);
});

// --- Known scenes and the request -------------------------------------------

test('[planet-source-024] gives the thumbnail of a scene of a kept answer of planetPlugins', async (t) => {
  const pair = installPair(t, [
    [[feature('p1', 'PSScene')], [feature('s1', 'SkySatCollect')]],
  ]);
  assert.deepEqual(
    pair.plugins.map((plugin) => plugin.name),
    ['planet-proxy', 'planet-thumbnail-proxy'],
  );
  assert.equal(typeof pair.plugins[0].thumbnailTypeOf, 'function');
  const answer = await pair.search();
  assert.deepEqual(
    answer.scenes.map((scene) => scene.id),
    ['p1', 's1'],
  );
  for (const [id, type] of [
    ['p1', 'PSScene'],
    ['s1', 'SkySatCollect'],
  ]) {
    const thumb = await pair.get(id);
    assert.equal(thumb.status, 200, id);
    assert.equal(pair.thumbs().at(-1).url, thumbOf(type, id));
  }
});

test('[planet-source-024] uses the newest kept answer that has the id, and the item type of its page', async (t) => {
  const pair = installPair(t, [
    [[feature('x1', 'PSScene', '2026-10-05T15:00:00Z')], []],
    [[], [feature('x1', 'SkySatCollect', '2026-10-06T15:00:00Z')]],
  ]);
  await pair.search([-82.5, 27.9, -82.4, 28]);
  assert.equal((await pair.get('x1')).status, 200);
  assert.equal(pair.thumbs().at(-1).url, thumbOf('PSScene', 'x1'));
  await pair.search([-82.4, 27.9, -82.3, 28]);
  assert.equal((await pair.get('x1')).status, 200);
  assert.equal(pair.thumbs().at(-1).url, thumbOf('SkySatCollect', 'x1'));
});

test('[planet-source-024] uses the first scene of an answer with the id and with thumbnail true', async (t) => {
  const pair = installPair(t, [
    [
      [feature('d1', 'PSScene', '2026-10-07T00:00:00Z', false)],
      [
        feature('d1', 'SkySatCollect', '2026-10-06T00:00:00Z'),
        feature('d1', 'SkySatCollect', '2026-10-05T00:00:00Z'),
      ],
    ],
  ]);
  const answer = await pair.search();
  assert.deepEqual(
    answer.scenes.map((scene) => scene.thumbnail),
    [false, true, true],
  );
  assert.equal((await pair.get('d1')).status, 200);
  assert.equal(pair.thumbs().at(-1).url, thumbOf('SkySatCollect', 'd1'));
});

test('[planet-source-024] knows the scene of an answer that is 599999 ms old, and not of one that is 600000 ms old', async (t) => {
  const pair = installPair(t, [[[feature('p1', 'PSScene')], []]]);
  await pair.search();
  pair.advance(599999);
  assert.equal((await pair.get('p1')).status, 200);
  pair.advance(1);
  const old = await pair.get('p1');
  assert.equal(old.status, 404);
  assert.deepEqual(old.body, { error: 'unknown_scene' });
  assert.equal(pair.thumbs().length, 1);
});

test('[planet-source-024] sends one GET request with only Authorization and Accept, and no redirect', async (t) => {
  const server = install(t, {
    types: { s1: 'SkySatCollect' },
    env: { PLANET_API_KEY: `  ${KEY}\t` },
  });
  const answer = await server.get('s1');
  assert.equal(answer.status, 200);
  assert.equal(server.calls.length, 1);
  const [{ url, init }] = server.calls;
  assert.equal(
    url,
    'https://tiles.planet.com/data/v1/item-types/SkySatCollect/items/s1/thumb',
  );
  assert.equal(init.method, 'GET');
  assert.equal(init.redirect, 'error');
  assert.ok(init.signal instanceof AbortSignal);
  assert.deepEqual(Object.keys(init).sort(), [
    'headers',
    'method',
    'redirect',
    'signal',
  ]);
  assert.deepEqual(init.headers, {
    Authorization: 'api-key fixture-key-Q7',
    Accept: ACCEPT,
  });
});

test('[planet-source-025] answers unknown_scene for a scene with thumbnail false, a scene after the first 50, and a scene of another call', async (t) => {
  const many = Array.from({ length: 51 }, (_, i) =>
    feature(
      `m${String(i).padStart(2, '0')}`,
      'PSScene',
      new Date(Date.UTC(2026, 9, 10) - i * 3600_000).toISOString(),
    ),
  );
  const pair = installPair(t, [
    [many, [feature('off', 'SkySatCollect', undefined, false)]],
  ]);
  const answer = await pair.search();
  assert.equal(answer.scenes.length, 50);
  assert.equal(answer.truncated, true);
  assert.equal((await pair.get('m00')).status, 200);
  for (const id of ['m50', 'off', 'never']) {
    const refused = await pair.get(id);
    assert.equal(refused.status, 404, id);
    assert.deepEqual(refused.body, { error: 'unknown_scene' });
  }
  const other = installPair(t, [[[feature('q1', 'PSScene')], []]]);
  await other.search();
  assert.equal((await other.get('m00')).status, 404);
  assert.equal(pair.thumbs().length, 1);
  assert.equal(other.thumbs().length, 0);
});

test('[planet-source-025] knows no scene without the option thumbnailTypeOf', async (t) => {
  const server = install(t, { noLookup: true });
  for (const id of ['a', 'p1', '20261005_150000_00_24a1']) {
    const answer = await server.get(id);
    assert.equal(answer.status, 404, id);
    assert.deepEqual(answer.body, { error: 'unknown_scene' });
  }
  assert.equal(server.calls.length, 0);
});

test('[planet-source-026] answers no_key when the key is not set or holds only white space', async (t) => {
  for (const value of [undefined, '', '  ', '\t']) {
    const server = install(t, {
      types: { a: 'PSScene' },
      env: { PLANET_API_KEY: value },
    });
    const answer = await server.get('a');
    assert.equal(answer.status, 503, String(value));
    assert.deepEqual(answer.body, { error: 'no_key', keyRequired: true });
    assert.equal(server.calls.length, 0);
  }
});

// --- Image check and failures -------------------------------------------------

test('[planet-source-027] passes a PNG image of 9 bytes and the other image types of the SkyWatch check', async (t) => {
  const largest = new Uint8Array(1048576);
  largest.set(PNG);
  for (const [name, respond, type, length] of [
    [
      'png 9 bytes',
      () => image(bytesOf(PNG, [1]), 'image/png'),
      'image/png',
      9,
    ],
    ['1048576 bytes', () => image(largest, 'image/png'), 'image/png', 1048576],
    ['jpeg', () => image(bytesOf(JPEG, [0]), 'IMAGE/JPEG'), 'image/jpeg', 4],
    [
      'webp',
      () =>
        image(
          bytesOf([0x52, 0x49, 0x46, 0x46, 4, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]),
          'image/webp',
        ),
      'image/webp',
      12,
    ],
  ]) {
    const server = install(t, { types: { a: 'PSScene' }, respond });
    const answer = await server.get('a');
    assert.equal(answer.status, 200, name);
    assert.equal(answer.headers['content-type'], type, name);
    assert.equal(answer.bytes.length, length, name);
  }
});

test('[planet-source-027] gives bad_upstream for a media type, a size or first bytes that fail the check', async (t) => {
  const big = new Uint8Array(1048577);
  big.set(PNG);
  for (const [name, respond] of [
    ['html', () => image(bytesOf(PNG), 'text/html')],
    ['svg', () => image(bytesOf(PNG), 'image/svg+xml')],
    ['no type', () => image(bytesOf(PNG), null)],
    ['0 bytes', () => image(new Uint8Array(0), 'image/png')],
    ['1048577 bytes', () => image(big, 'image/png')],
    ['png type, jpeg bytes', () => image(bytesOf(JPEG, [0]), 'image/png')],
    ['png type, 4 bytes', () => image(bytesOf(PNG.slice(0, 4)), 'image/png')],
  ]) {
    const server = install(t, { types: { a: 'PSScene' }, respond });
    const answer = await server.get('a');
    assert.equal(answer.status, 502, name);
    assert.deepEqual(answer.body, { error: 'bad_upstream' }, name);
  }
});

test('[planet-source-027 planet-source-028] gives upstream_failed when the body cannot be read, also at the end of the time limit', async (t) => {
  const broken = install(t, {
    types: { a: 'PSScene' },
    respond: () =>
      new Response(
        new ReadableStream({
          pull(controller) {
            controller.error(new Error('reset'));
          },
        }),
        { headers: { 'content-type': 'image/png' } },
      ),
  });
  const failed = await broken.get('a');
  assert.equal(failed.status, 502);
  assert.deepEqual(failed.body, { error: 'upstream_failed' });
  const body = gatedBody([Uint8Array.from(PNG)]);
  const slow = install(t, {
    types: { a: 'PSScene' },
    respond: () =>
      new Response(body.stream, { headers: { 'content-type': 'image/png' } }),
  });
  const pending = slow.get('a');
  await settle();
  slow.timers.set[0].fn();
  const late = await pending;
  assert.equal(late.status, 502);
  assert.deepEqual(late.body, { error: 'upstream_failed' });
});

test('[planet-source-028] gives upstream_failed for a status that is not 200, a fetch error, a redirect and the time limit', async (t) => {
  for (const status of [204, 302, 401, 404, 500]) {
    const server = install(t, {
      types: { a: 'PSScene' },
      respond: () =>
        new Response(status === 204 ? null : 'x', {
          status,
          headers: { 'content-type': 'image/png' },
        }),
    });
    const answer = await server.get('a');
    assert.equal(answer.status, 502, String(status));
    assert.deepEqual(answer.body, { error: 'upstream_failed' });
  }
  for (const error of [
    new TypeError('fetch failed'),
    new TypeError('redirect mode is set to error'),
  ]) {
    const server = install(t, {
      types: { a: 'PSScene' },
      respond: () => {
        throw error;
      },
    });
    assert.deepEqual((await server.get('a')).body, {
      error: 'upstream_failed',
    });
  }
  const server = install(t, {
    types: { a: 'PSScene' },
    respond: (url, init) => hanging(init),
  });
  const pending = server.get('a');
  await settle();
  assert.equal(server.timers.set.length, 1);
  assert.equal(server.timers.set[0].ms, 15000);
  server.timers.set[0].fn();
  assert.deepEqual((await pending).body, { error: 'upstream_failed' });
});

test('[planet-source-028] sets a time limit of 15000 ms, and does not clear it before it reads all of the body', async (t) => {
  const body = gatedBody([Uint8Array.from(PNG), Uint8Array.from([1])]);
  const server = install(t, {
    types: { a: 'PSScene' },
    respond: () =>
      new Response(body.stream, { headers: { 'content-type': 'image/png' } }),
  });
  const pending = server.get('a');
  await settle();
  assert.equal(server.timers.set.length, 1);
  assert.equal(server.timers.set[0].ms, 15000);
  assert.deepEqual(server.timers.cleared, []);
  assert.equal(body.pulls() > 0, true);
  body.open();
  const answer = await pending;
  assert.equal(answer.status, 200);
  assert.deepEqual([...answer.bytes], [...PNG, 1]);
  assert.deepEqual(server.timers.cleared, ['timer-1']);
});

test('[planet-source-028] clears the timer at once and reads no body for a status that is not 200 or another media type', async (t) => {
  for (const [status, type] of [
    [404, 'image/png'],
    [500, 'image/png'],
    [200, 'text/html'],
    [200, null],
  ]) {
    const body = gatedBody([Uint8Array.from(PNG)]);
    const server = install(t, {
      types: { a: 'PSScene' },
      respond: () =>
        new Response(body.stream, {
          status,
          headers: type === null ? {} : { 'content-type': type },
        }),
    });
    const answer = await server.get('a');
    assert.equal(answer.status, 502, `${status} ${type}`);
    assert.deepEqual(server.timers.cleared, ['timer-1']);
    assert.equal(body.pulls(), 0, `${status} ${type}`);
  }
});

test('[planet-source-028] holds no URL, host name or key text in a failure answer or a header', async (t) => {
  for (const respond of [
    () => json(404, { error: `CANARY ${KEY} tiles.planet.com` }),
    () => {
      throw new TypeError(`fetch failed ${KEY} https://tiles.planet.com/x`);
    },
    () => image(bytesOf(PNG), 'text/html'),
  ]) {
    const server = install(t, { types: { a: 'PSScene' }, respond });
    const answer = await server.get('a');
    const text = `${answer.bytes.toString('utf8')} ${JSON.stringify(answer.headers)}`;
    for (const word of [KEY, 'tiles.planet.com', 'https://', 'CANARY'])
      assert.equal(text.includes(word), false, word);
  }
});

// --- Answer, steps and log ----------------------------------------------------

test('[planet-source-029] sends the bytes with only its own headers, and copies no upstream header', async (t) => {
  const server = install(t, {
    types: { a: 'PSScene' },
    respond: () =>
      image(bytesOf(PNG, [9]), 'image/png; charset=x', {
        'cache-control': 'public, max-age=86400',
        'set-cookie': 'CANARY=1',
        'x-planet-trace-id': 'CANARY',
      }),
  });
  const answer = await server.get('a');
  assert.equal(answer.status, 200);
  assert.deepEqual([...answer.bytes], [...PNG, 9]);
  assert.deepEqual(answer.headers, {
    'content-type': 'image/png',
    'content-length': '9',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'",
  });
});

test('[planet-source-029] gives each JSON answer after the path step Content-Type and Cache-Control', async (t) => {
  const answers = [];
  const server = install(t, { types: { a: 'PSScene' } });
  answers.push(
    await server.get('a', { headers: { 'sec-fetch-site': 'cross-site' } }),
  );
  answers.push(await server.get('a', { method: 'POST' }));
  answers.push(await server.get('unknown'));
  answers.push(
    await install(t, {
      types: { a: 'PSScene' },
      env: { PLANET_THUMBNAILS: 'false' },
    }).get('a'),
  );
  answers.push(
    await install(t, {
      types: { a: 'PSScene' },
      env: { PLANET_API_KEY: '' },
    }).get('a'),
  );
  answers.push(
    await install(t, {
      types: { a: 'PSScene' },
      respond: () => json(500, {}),
    }).get('a'),
  );
  for (let n = 0; n < 30; n++) await server.get('a');
  answers.push(await server.get('a'));
  assert.deepEqual(
    answers.map((answer) => answer.status),
    [403, 405, 404, 404, 503, 502, 429],
  );
  for (const answer of answers) {
    assert.equal(
      answer.headers['content-type'],
      'application/json; charset=utf-8',
    );
    assert.equal(answer.headers['cache-control'], 'no-store');
  }
});

test('[planet-source-029] keeps no image, so two requests for the same id send two upstream requests', async (t) => {
  const server = install(t, { types: { a: 'PSScene' } });
  assert.equal((await server.get('a')).status, 200);
  assert.equal((await server.get('a')).status, 200);
  assert.equal(server.calls.length, 2);
  const parallel = install(t, { types: { a: 'PSScene' } });
  const answers = await Promise.all([parallel.get('a'), parallel.get('a')]);
  assert.deepEqual(
    answers.map((answer) => answer.status),
    [200, 200],
  );
  assert.equal(parallel.calls.length, 2);
});

test('[planet-source-030] answers with the first step that fails', async (t) => {
  const server = install(t, {
    env: { PLANET_THUMBNAILS: 'false', PLANET_API_KEY: '' },
  });
  const cross = { 'sec-fetch-site': 'cross-site' };
  assert.equal(
    (await server.get('a', { method: 'POST', headers: cross })).status,
    403,
  );
  assert.equal((await server.get('a', { method: 'POST' })).status, 405);
  assert.deepEqual((await server.get('a')).body, { error: 'thumbnails_off' });
  const keyless = install(t, { env: { PLANET_API_KEY: '' } });
  assert.deepEqual((await keyless.get('unknown')).body, {
    error: 'no_key',
    keyRequired: true,
  });
  const known = install(t);
  assert.deepEqual((await known.get('unknown')).body, {
    error: 'unknown_scene',
  });
  for (const plugin of [server, keyless, known])
    assert.equal(plugin.calls.length, 0);
});

test('[planet-source-030] checks the rate limit before the key and the scene', async (t) => {
  const server = install(t, { env: { PLANET_API_KEY: '' } });
  for (let n = 0; n < 30; n++) {
    assert.equal((await server.get('unknown')).status, 503);
  }
  const limited = await server.get('unknown');
  assert.equal(limited.status, 429);
  assert.deepEqual(limited.body, { error: 'rate_limited' });
  const off = install(t, { env: { PLANET_THUMBNAILS: 'false' } });
  for (let n = 0; n < 31; n++) {
    assert.deepEqual((await off.get('a')).body, { error: 'thumbnails_off' });
  }
});

test('[planet-source-032] writes one line for a good image and for each failure, with the time', async (t) => {
  for (const [respond, line] of [
    [
      () => image(bytesOf(PNG.slice(0, 4)), 'image/png'),
      '[planet] thumbnail failed kind=bad_upstream ms=25',
    ],
    [
      () => image(bytesOf(PNG.slice(0, 4)), 'image/jpeg'),
      '[planet] thumbnail failed kind=bad_upstream ms=25',
    ],
    [
      () => json(500, {}),
      '[planet] thumbnail failed kind=upstream_failed ms=25',
    ],
    [
      () => image(bytesOf(JPEG, [0]), 'image/jpeg'),
      '[planet] thumbnail ok bytes=4 ms=25',
    ],
  ]) {
    const server = install(t, {
      types: { a: 'PSScene' },
      respond: (url, init, n, time) => {
        time.value = NOW + 25;
        return respond();
      },
    });
    await server.get('a');
    assert.deepEqual(server.lines, [line]);
  }
});

test('[planet-source-032] writes no line for a step before the upstream request, and no key, id, URL or host name', async (t) => {
  const quiet = [
    install(t, {
      types: { a: 'PSScene' },
      env: { PLANET_THUMBNAILS: 'false' },
    }),
    install(t, { types: {} }),
  ];
  for (const server of quiet) await server.get('a');
  const limited = install(t, { types: { a: 'PSScene' } });
  for (let n = 0; n < 31; n++) await limited.get('a');
  assert.equal(limited.lines.length, 30);
  for (const server of quiet) assert.deepEqual(server.lines, []);
  const failing = install(t, {
    types: { '20261005_150000_00_24a1': 'PSScene' },
    respond: () => {
      throw new TypeError(`fetch failed ${KEY} ${thumbOf('PSScene', 'x')}`);
    },
  });
  await failing.get('20261005_150000_00_24a1');
  const lines = [...limited.lines, ...failing.lines].join('\n');
  for (const word of [
    KEY,
    '20261005_150000_00_24a1',
    'https://',
    'api.planet.com',
    'tiles.planet.com',
  ])
    assert.equal(lines.includes(word), false, word);
});

test('[planet-source-032] logs with console.log when the test gives no log option', async (t) => {
  const lines = [];
  t.mock.method(console, 'log', (line) => lines.push(line));
  const server = install(t, { types: { a: 'PSScene' }, noLog: true });
  assert.equal((await server.get('a')).status, 200);
  assert.deepEqual(lines, ['[planet] thumbnail ok bytes=11 ms=0']);
});
