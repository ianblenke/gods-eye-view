import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { skywatchThumbnailProxy } from '../../server/providers/skywatch/thumbnails.js';
import { skywatchPlugins } from '../../server/providers/skywatch.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 9, 21, 12, 0, 0);
const KEY = 'fixture-key-Q7';
const HOST = '127.0.0.1:5173';
const ROUTE = '/api/skywatch/thumbnail';
const CDN = 'https://cdn.example.test/CANARY-thumb.png?sig=CANARY-sig';
const SEARCH = 'https://api.skywatch.co/earthcache/archive/search';
const BOX = [10, 60, 10.02, 60.01];
const DATES = { start: '2026-10-01', end: '2026-10-20' };
const RING = [
  [10, 60],
  [10.02, 60],
  [10.02, 60.01],
  [10, 60.01],
  [10, 60],
];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff];
const ACCEPT = 'image/png, image/jpeg, image/webp';
const GOOD_HEADERS = { host: HOST, 'sec-fetch-site': 'same-origin' };

const bytesOf = (...parts) => Uint8Array.from(parts.flat());
const image = (
  body = bytesOf(PNG, [1, 2, 3]),
  type = 'image/png',
  extra = {},
) =>
  new Response(body, {
    status: 200,
    headers: type === null ? extra : { 'content-type': type, ...extra },
  });
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

/**
 * Install the thumbnail plugin on a fake middleware list. Date is mocked for
 * the rate limit; the clock of the plugin, the fetch function and the timers
 * are fakes.
 */
function install(
  t,
  {
    env = {},
    urls = {},
    respond,
    preview = false,
    lookup,
    noLookup,
    noLog,
  } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const calls = [];
  const lines = [];
  const timers = { set: [], cleared: [] };
  const time = { value: NOW };
  const environment = {
    SKYWATCH_API_KEY: KEY,
    SKYWATCH_THUMBNAILS: 'true',
    ...env,
  };
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (respond) return respond(String(url), init, calls.length, time);
    return image();
  };
  const options = {
    env: environment,
    fetchImpl,
    now: () => time.value,
    setTimer: (fn, ms) => {
      const id = `timer-${timers.set.length + 1}`;
      timers.set.push({ id, fn, ms });
      return id;
    },
    clearTimer: (id) => timers.cleared.push(id),
    log: (line) => lines.push(line),
    thumbnailUrlOf: lookup ?? ((id) => urls[id] ?? null),
  };
  if (noLookup) delete options.thumbnailUrlOf;
  if (noLog) delete options.log;
  const plugin = skywatchThumbnailProxy(options);
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

/** Send one request through the routes of a fake middleware list. */
async function send(routes, url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    remote = '127.0.0.1',
    encrypted = false,
  } = options;
  const req = Object.assign(Readable.from([]), {
    method,
    headers: { ...GOOD_HEADERS, ...headers },
    socket: { remoteAddress: remote, encrypted },
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

/** Let the streams and the promises of a request run. Only Date is mocked. */
const settle = async () => {
  for (let i = 0; i < 10; i++)
    await new Promise((resolve) => setImmediate(resolve));
};

// --- Route, same site, method and variable ---------------------------------

test('[skywatch-thumbnails-001] answers a path with an id and passes other paths to next', async (t) => {
  for (const preview of [false, true]) {
    const server = install(t, { preview });
    assert.deepEqual(server.uses, [ROUTE]);
    assert.equal(server.plugin.name, 'skywatch-thumbnail-proxy');
    for (const path of [`${ROUTE}/abc`, `${ROUTE}/abc?x=1`]) {
      const answer = await server.request(path);
      assert.equal(answer.next, false, path);
      assert.equal(answer.status, 404, path);
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
    const longest = await server.get('a'.repeat(128));
    assert.equal(longest.next, false);
    assert.equal(longest.status, 404);
    assert.equal(server.calls.length, 0);
  }
});

test('[skywatch-thumbnails-001] localProviderPlugins holds the plugin once, directly after skywatch-proxy', () => {
  const names = localProviderPlugins().map((plugin) => plugin.name);
  assert.equal(
    names.filter((name) => name === 'skywatch-thumbnail-proxy').length,
    1,
  );
  assert.equal(
    names.indexOf('skywatch-thumbnail-proxy'),
    names.indexOf('skywatch-proxy') + 1,
  );
});

test('[skywatch-thumbnails-002] refuses a request that fails a check of admitSameSiteRequest', async (t) => {
  const server = install(t, { urls: { a: CDN } });
  for (const headers of [
    { 'sec-fetch-site': 'cross-site' },
    { 'sec-fetch-site': 'same-site' },
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

test('[skywatch-thumbnails-002] accepts a request through the reverse proxy', async (t) => {
  const server = install(t, { urls: { a: CDN } });
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
  const encrypted = await server.get('a', {
    encrypted: true,
    headers: {
      host: 'godseye.example.test',
      origin: 'https://godseye.example.test',
      'sec-fetch-site': 'same-origin',
    },
  });
  assert.equal(encrypted.status, 200);
});

test('[skywatch-thumbnails-003] refuses POST, PUT, DELETE and HEAD', async (t) => {
  const server = install(t, { urls: { a: CDN } });
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD']) {
    const answer = await server.get('a', { method });
    assert.equal(answer.status, 405, method);
    assert.deepEqual(answer.body, { error: 'Method not allowed' });
  }
  assert.equal(server.calls.length, 0);
});

test('[skywatch-thumbnails-004] answers thumbnails_off when SKYWATCH_THUMBNAILS is not the text true', async (t) => {
  for (const value of [undefined, '', '1', 'yes', 'TRUE', 'true ', ' true']) {
    const server = install(t, {
      urls: { a: CDN },
      env: { SKYWATCH_THUMBNAILS: value },
    });
    if (value === undefined) delete server.env.SKYWATCH_THUMBNAILS;
    const answer = await server.get('a');
    assert.equal(answer.status, 404, JSON.stringify(value));
    assert.deepEqual(answer.body, { error: 'thumbnails_off' });
    assert.equal(server.calls.length, 0);
  }
});

// --- Rate limit -------------------------------------------------------------

test('[skywatch-thumbnails-005] lets the 30th request pass at 59999 ms after 29 requests at 0 ms', async (t) => {
  const server = install(t);
  for (let n = 0; n < 29; n++) {
    assert.equal((await server.get(`x${n}`)).status, 404);
  }
  server.advance(59999);
  const passed = await server.get('x29');
  assert.equal(passed.status, 404);
  assert.deepEqual(passed.body, { error: 'unknown_scene' });
});

test('[skywatch-thumbnails-005] refuses the 31st request at 59999 ms after 30 requests at 0 ms, and lets it pass at 60000 ms', async (t) => {
  const server = install(t);
  for (let n = 0; n < 30; n++) {
    assert.equal((await server.get(`x${n}`)).status, 404);
  }
  server.advance(59999);
  const refused = await server.get('x30');
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, { error: 'rate_limited' });
  assert.equal(refused.headers['retry-after'], '60');
  server.advance(1);
  const passed = await server.get('x30');
  assert.equal(passed.status, 404);
  assert.deepEqual(passed.body, { error: 'unknown_scene' });
});

test('[skywatch-thumbnails-005] has one count for all socket addresses, and an answer of the image store counts', async (t) => {
  const server = install(t, { urls: { a: CDN } });
  for (let n = 0; n < 30; n++) {
    const answer = await server.get('a', {
      remote: n % 2 === 0 ? '127.0.0.1' : '192.0.2.10',
    });
    assert.equal(answer.status, 200, String(n));
  }
  assert.equal(server.calls.length, 1);
  const refused = await server.get('a', { remote: '192.0.2.11' });
  assert.equal(refused.status, 429);
});

// --- Known scenes -----------------------------------------------------------

const scene = (id, start, extra = {}) => ({
  id,
  location: { type: 'Polygon', coordinates: [RING] },
  start_time: new Date(start).toISOString(),
  thumbnail_uri: `https://thumbs.example.test/${id}.png`,
  ...extra,
});

/**
 * Make the two plugins with skywatchPlugins(). The fake fetch answers each
 * search with the next list of `searches`, and each other URL with a PNG image.
 */
function installPair(t, searches) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const time = { value: NOW };
  const calls = [];
  const lists = [...searches];
  let current = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url) === SEARCH) {
      current = lists.shift();
      return json(200, { data: { id: 'search-1' } });
    }
    if (String(url).startsWith(`${SEARCH}/`)) {
      return json(200, {
        data: current,
        pagination: { total: current.length },
      });
    }
    return image();
  };
  const plugins = skywatchPlugins({
    env: { SKYWATCH_API_KEY: KEY, SKYWATCH_THUMBNAILS: 'true' },
    fetchImpl,
    now: () => time.value,
    setTimer: () => 1,
    clearTimer: () => {},
    wait: async () => {},
    log: () => {},
  });
  const routes = new Map();
  for (const plugin of plugins)
    plugin.configureServer({
      middlewares: { use: (route, handler) => routes.set(route, handler) },
    });
  const searchBox = async (bbox) => {
    const req = Object.assign(
      Readable.from([Buffer.from(JSON.stringify({ bbox, ...DATES }))]),
      {
        method: 'POST',
        url: '/',
        headers: {
          host: HOST,
          origin: `http://${HOST}`,
          'content-type': 'application/json',
        },
        socket: { remoteAddress: '127.0.0.1' },
      },
    );
    const res = {
      writeHead() {},
      end(text) {
        this.text = text;
      },
    };
    await routes.get('/api/skywatch/scenes')(req, res, () => {});
    return JSON.parse(res.text);
  };
  return {
    plugins,
    calls,
    time,
    searchBox,
    get: (id) => send(routes, `${ROUTE}/${id}`),
    fetched: () =>
      calls.map((call) => call.url).filter((url) => !url.startsWith(SEARCH)),
  };
}

const boxAt = (n) => [10 + n * 0.1, 60, 10.02 + n * 0.1, 60.01];

test('[skywatch-thumbnails-006] gives the thumbnail of a scene of a kept answer of skywatchPlugins', async (t) => {
  const pair = installPair(t, [[scene('s1', Date.UTC(2026, 9, 5))]]);
  assert.deepEqual(
    pair.plugins.map((plugin) => plugin.name),
    ['skywatch-proxy', 'skywatch-thumbnail-proxy'],
  );
  assert.equal(typeof pair.plugins[0].thumbnailUrlOf, 'function');
  const answer = await pair.searchBox(BOX);
  assert.equal(answer.scenes[0].id, 's1');
  assert.equal(JSON.stringify(answer).includes('thumbs.example.test'), false);
  const thumb = await pair.get('s1');
  assert.equal(thumb.status, 200);
  assert.deepEqual(pair.fetched(), ['https://thumbs.example.test/s1.png']);
  const unknown = await pair.get('s2');
  assert.equal(unknown.status, 404);
  assert.deepEqual(unknown.body, { error: 'unknown_scene' });
  assert.deepEqual(pair.fetched(), ['https://thumbs.example.test/s1.png']);
});

test('[skywatch-thumbnails-006] uses the newest kept answer, and the first scene with thumbnail true in scenes', async (t) => {
  const older = Date.UTC(2026, 9, 3);
  const newer = Date.UTC(2026, 9, 7);
  const pair = installPair(t, [
    [scene('one', older, { thumbnail_uri: 'https://a.example.test/one.png' })],
    [
      scene('one', older, { thumbnail_uri: 'https://b.example.test/one.png' }),
      scene('dup', older, {
        thumbnail_uri: 'https://b.example.test/dup-old.png',
      }),
      scene('dup', newer, {
        thumbnail_uri: 'https://b.example.test/dup-new.png',
      }),
      scene('half', newer + 1, {
        thumbnail_uri: 'http://b.example.test/half.png',
      }),
      scene('half', newer, {
        thumbnail_uri: 'https://b.example.test/half.png',
      }),
    ],
  ]);
  await pair.searchBox(boxAt(0));
  await pair.searchBox(boxAt(1));
  assert.equal((await pair.get('one')).status, 200);
  assert.equal((await pair.get('dup')).status, 200);
  assert.equal((await pair.get('half')).status, 200);
  assert.deepEqual(pair.fetched(), [
    'https://b.example.test/one.png',
    'https://b.example.test/dup-new.png',
    'https://b.example.test/half.png',
  ]);
});

test('[skywatch-thumbnails-006] a second call of skywatchPlugins does not find a scene of the first call', async (t) => {
  const first = installPair(t, [[scene('s1', Date.UTC(2026, 9, 5))]]);
  await first.searchBox(BOX);
  assert.equal((await first.get('s1')).status, 200);
  const second = installPair(t, []);
  const answer = await second.get('s1');
  assert.equal(answer.status, 404);
  assert.deepEqual(answer.body, { error: 'unknown_scene' });
  assert.deepEqual(second.fetched(), []);
});

test('[skywatch-thumbnails-006] gives the URL of an answer that is 599999 ms old, and not of one that is 600000 ms old', async (t) => {
  const pair = installPair(t, [[scene('s1', Date.UTC(2026, 9, 5))]]);
  await pair.searchBox(BOX);
  pair.time.value += 599999;
  assert.equal((await pair.get('s1')).status, 200);
  pair.time.value += 1;
  const old = await pair.get('s1');
  assert.equal(old.status, 404);
  assert.deepEqual(old.body, { error: 'unknown_scene' });
});

test('[skywatch-thumbnails-006] knows no scene after the first 50 scenes and no scene with thumbnail false', async (t) => {
  const many = Array.from({ length: 49 }, (_, i) =>
    scene(`m${i}`, Date.UTC(2026, 9, 1) + i * 60000),
  );
  many.push(
    scene('plain', Date.UTC(2026, 9, 20), {
      thumbnail_uri: 'http://thumbs.example.test/plain.png',
    }),
    scene('none', Date.UTC(2026, 9, 20), { thumbnail_uri: undefined }),
  );
  const pair = installPair(t, [many]);
  const answer = await pair.searchBox(BOX);
  assert.equal(answer.scenes.length, 50);
  assert.equal(answer.truncated, true);
  const ids = answer.scenes.map((s) => s.id);
  assert.deepEqual(ids.slice(0, 2), ['none', 'plain']);
  assert.deepEqual(
    answer.scenes.slice(0, 2).map((s) => s.thumbnail),
    [false, false],
  );
  assert.equal(ids.includes('m1'), true);
  assert.equal(ids.includes('m0'), false);
  for (const id of ['m0', 'plain', 'none']) {
    const thumb = await pair.get(id);
    assert.equal(thumb.status, 404, id);
    assert.deepEqual(thumb.body, { error: 'unknown_scene' });
  }
  assert.equal((await pair.get('m1')).status, 200);
  assert.deepEqual(pair.fetched(), ['https://thumbs.example.test/m1.png']);
});

test('[skywatch-thumbnails-006] a thumbnail plugin with no thumbnailUrlOf knows no scene', async (t) => {
  const server = install(t, { noLookup: true });
  for (const id of ['a', 's1', 'scene-0']) {
    const answer = await server.get(id);
    assert.equal(answer.status, 404, id);
    assert.deepEqual(answer.body, { error: 'unknown_scene' });
  }
  assert.equal(server.calls.length, 0);
});

// --- URL check --------------------------------------------------------------

test('[skywatch-thumbnails-007] refuses each URL that fails the URL check, with no upstream request', async (t) => {
  for (const url of [
    'not a url',
    'http://cdn.example.test/t.png',
    'https://user@cdn.example.test/t.png',
    'https://:pw@cdn.example.test/t.png',
    'https://cdn.example.test:8443/t.png',
    'https://127.0.0.1/t.png',
    'https://[::1]/t.png',
    'https://2130706433/t.png',
    'https://localhost/t.png',
    'https://localhost./t.png',
    'https://a.localhost/t.png',
  ]) {
    const server = install(t, { urls: { a: url } });
    const answer = await server.get('a');
    assert.equal(answer.status, 502, url);
    assert.deepEqual(answer.body, { error: 'bad_upstream' });
    assert.equal(server.calls.length, 0, url);
    assert.deepEqual(server.lines, [], url);
  }
});

test('[skywatch-thumbnails-007] accepts the port 443, because the URL parser removes it', async (t) => {
  const server = install(t, {
    urls: { a: 'https://cdn.example.test:443/t.png' },
  });
  assert.equal((await server.get('a')).status, 200);
  assert.deepEqual(
    server.calls.map((call) => call.url),
    ['https://cdn.example.test/t.png'],
  );
});

// --- Upstream request -------------------------------------------------------

test('[skywatch-thumbnails-008] sends one GET request with Accept, no redirect and no other header', async (t) => {
  const server = install(t, { urls: { a: CDN } });
  assert.equal((await server.get('a')).status, 200);
  assert.equal(server.calls.length, 1);
  const [{ url, init }] = server.calls;
  assert.equal(url, CDN);
  assert.deepEqual(Object.keys(init).sort(), [
    'headers',
    'method',
    'redirect',
    'signal',
  ]);
  assert.equal(init.method, 'GET');
  assert.equal(init.redirect, 'error');
  assert.deepEqual(init.headers, { Accept: ACCEPT });
  assert.equal(init.signal instanceof AbortSignal, true);
});

test('[skywatch-thumbnails-008] sends the trimmed key only to api.skywatch.co', async (t) => {
  const own = 'https://api.skywatch.co/earthcache/thumbs/t.png';
  for (const [key, host, headers] of [
    [KEY, own, { Accept: ACCEPT, 'x-api-key': KEY }],
    [`  ${KEY}  `, own, { Accept: ACCEPT, 'x-api-key': KEY }],
    ['   ', own, { Accept: ACCEPT }],
    [undefined, own, { Accept: ACCEPT }],
    [KEY, 'https://api.skywatch.co.example.test/t.png', { Accept: ACCEPT }],
    [KEY, 'https://xapi.skywatch.co/t.png', { Accept: ACCEPT }],
    [KEY, 'https://skywatch.co/t.png', { Accept: ACCEPT }],
    [KEY, CDN, { Accept: ACCEPT }],
  ]) {
    const server = install(t, {
      urls: { a: host },
      env: { SKYWATCH_API_KEY: key },
    });
    if (key === undefined) delete server.env.SKYWATCH_API_KEY;
    assert.equal((await server.get('a')).status, 200);
    assert.deepEqual(server.calls[0].init.headers, headers, `${key} ${host}`);
  }
});

test('[skywatch-thumbnails-008] sets a time limit of 15000 ms and clears it only after it reads the body', async (t) => {
  const body = gatedBody([Uint8Array.from(JPEG), Uint8Array.from([1])]);
  const server = install(t, {
    urls: { a: CDN },
    respond: () =>
      new Response(body.stream, { headers: { 'content-type': 'image/jpeg' } }),
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
  assert.deepEqual([...answer.bytes], [...JPEG, 1]);
  assert.deepEqual(server.timers.cleared, ['timer-1']);
});

test('[skywatch-thumbnails-008 skywatch-thumbnails-009] clears the timer at once and reads no body for a status that is not 200 or another media type', async (t) => {
  for (const [status, type] of [
    [404, 'image/png'],
    [500, 'image/png'],
    [200, 'text/html'],
    [200, null],
  ]) {
    const body = gatedBody([Uint8Array.from(PNG)]);
    const server = install(t, {
      urls: { a: CDN },
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

// --- Image check and failures -----------------------------------------------

test('[skywatch-thumbnails-009] gives bad_upstream for a media type, a size or first bytes that fail the check', async (t) => {
  const big = new Uint8Array(1048577);
  big.set(PNG);
  for (const [name, respond] of [
    ['svg', () => image(bytesOf(PNG), 'image/svg+xml')],
    ['html', () => image(bytesOf(PNG), 'text/html')],
    ['no type', () => image(bytesOf(PNG), null)],
    ['0 bytes', () => image(new Uint8Array(0), 'image/png')],
    ['1048577 bytes', () => image(big, 'image/png')],
    [
      'Content-Length: 1048577',
      () => image(bytesOf(PNG), 'image/png', { 'content-length': '1048577' }),
    ],
    ['png type, jpeg bytes', () => image(bytesOf(JPEG, [0]), 'image/png')],
    [
      'webp type, WAVE bytes',
      () =>
        image(
          bytesOf([0x52, 0x49, 0x46, 0x46, 4, 0, 0, 0, 0x57, 0x41, 0x56, 0x45]),
          'image/webp',
        ),
    ],
  ]) {
    const server = install(t, { urls: { a: CDN }, respond });
    const answer = await server.get('a');
    assert.equal(answer.status, 502, name);
    assert.deepEqual(answer.body, { error: 'bad_upstream' }, name);
  }
});

test('[skywatch-thumbnails-009] passes a body of 1048576 bytes and reads the media type of a header with parameters', async (t) => {
  const largest = new Uint8Array(1048576);
  largest.set(PNG);
  for (const [name, respond, type] of [
    ['1048576 bytes', () => image(largest, 'image/png'), 'image/png'],
    [
      'Image/PNG; charset=x',
      () => image(bytesOf(PNG), 'Image/PNG; charset=x'),
      'image/png',
    ],
    ['image/png ;x', () => image(bytesOf(PNG), 'image/png ;x'), 'image/png'],
    ['jpeg', () => image(bytesOf(JPEG, [0]), 'image/jpeg'), 'image/jpeg'],
    [
      'webp',
      () =>
        image(
          bytesOf([0x52, 0x49, 0x46, 0x46, 4, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]),
          'image/webp',
        ),
      'image/webp',
    ],
  ]) {
    const server = install(t, { urls: { a: CDN }, respond });
    const answer = await server.get('a');
    assert.equal(answer.status, 200, name);
    assert.equal(answer.headers['content-type'], type, name);
  }
});

test('[skywatch-thumbnails-009 skywatch-thumbnails-010] gives upstream_failed when the time limit ends during the body', async (t) => {
  const body = gatedBody([Uint8Array.from(PNG)]);
  const server = install(t, {
    urls: { a: CDN },
    respond: () =>
      new Response(body.stream, { headers: { 'content-type': 'image/png' } }),
  });
  const pending = server.get('a');
  await settle();
  server.timers.set[0].fn();
  const answer = await pending;
  assert.equal(answer.status, 502);
  assert.deepEqual(answer.body, { error: 'upstream_failed' });
  assert.deepEqual(server.lines, [
    '[skywatch] thumbnail failed kind=upstream_failed ms=0',
  ]);
});

test('[skywatch-thumbnails-010] gives upstream_failed for a status that is not 200, a fetch error, a redirect and the time limit', async (t) => {
  for (const [name, respond, fire] of [
    ['404', () => json(404, { error: 'CANARY-sig' })],
    ['500', () => json(500, {})],
    ['204', () => new Response(null, { status: 204 })],
    [
      '302',
      () => new Response(null, { status: 302, headers: { location: CDN } }),
    ],
    [
      'fetch error',
      () => Promise.reject(new TypeError('fetch failed CANARY-thumb')),
    ],
    ['redirect', () => Promise.reject(new TypeError('unexpected redirect'))],
    ['time limit', (url, init) => hanging(init), true],
  ]) {
    const server = install(t, { urls: { a: CDN }, respond });
    const pending = server.get('a');
    if (fire) {
      await settle();
      server.timers.set[0].fn();
    }
    const answer = await pending;
    assert.equal(answer.status, 502, name);
    assert.deepEqual(answer.body, { error: 'upstream_failed' }, name);
  }
});

test('[skywatch-thumbnails-010] holds no URL, host name or key text in a failure answer or a header', async (t) => {
  const own = 'https://api.skywatch.co/earthcache/thumbs/CANARY-thumb.png';
  for (const respond of [
    () => json(403, { error: CDN }),
    () => Promise.reject(new TypeError(`fetch failed ${own} ${KEY}`)),
    () => image(bytesOf(PNG), 'text/html'),
    () => image(bytesOf(JPEG), 'image/png'),
    () => image(bytesOf(PNG), 'image/png', { 'x-source': own }),
  ]) {
    const server = install(t, { urls: { a: own }, respond });
    const answer = await server.get('a');
    const text = `${answer.bytes.toString('latin1')} ${JSON.stringify(answer.headers)}`;
    for (const secret of [
      'CANARY',
      'api.skywatch.co',
      'earthcache',
      KEY,
      'x-source',
    ]) {
      assert.equal(text.includes(secret), false, `${secret} in ${text}`);
    }
  }
});

// --- Answer, store and order ------------------------------------------------

test('[skywatch-thumbnails-011] sends the bytes with only its own headers', async (t) => {
  const body = bytesOf(PNG, [9, 8, 7]);
  const server = install(t, {
    urls: { a: CDN },
    respond: () =>
      image(body, 'image/png; charset=binary', {
        'set-cookie': 'session=CANARY',
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=31536000',
      }),
  });
  const answer = await server.get('a');
  assert.equal(answer.status, 200);
  assert.deepEqual([...answer.bytes], [...body]);
  assert.deepEqual(answer.headers, {
    'content-type': 'image/png',
    'content-length': '11',
    'cache-control': 'private, max-age=600',
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'",
  });
});

test('[skywatch-thumbnails-011] gives each JSON answer after the path step Content-Type and Cache-Control', async (t) => {
  const answers = [];
  const off = install(t, { env: { SKYWATCH_THUMBNAILS: 'no' } });
  answers.push(await off.get('a'));
  const server = install(t, {
    urls: { bad: 'http://cdn.example.test/t.png', fail: CDN },
    respond: () => json(500, {}),
  });
  answers.push(
    await server.get('a', { headers: { 'sec-fetch-site': 'cross-site' } }),
  );
  answers.push(await server.get('a', { method: 'POST' }));
  answers.push(await server.get('unknown'));
  answers.push(await server.get('bad'));
  answers.push(await server.get('fail'));
  for (let n = 0; n < 30; n++) await server.get('unknown');
  answers.push(await server.get('unknown'));
  assert.deepEqual(
    answers.map((answer) => answer.status),
    [404, 403, 405, 404, 502, 502, 429],
  );
  for (const answer of answers) {
    assert.equal(
      answer.headers['content-type'],
      'application/json; charset=utf-8',
    );
    assert.equal(answer.headers['cache-control'], 'no-store');
  }
});

test('[skywatch-thumbnails-012] answers a repeated URL from the image store, found by the href text', async (t) => {
  const server = install(t, {
    urls: {
      a: CDN,
      b: 'https://cdn.example.test:443/same.png',
      c: 'https://cdn.example.test/same.png',
    },
  });
  const first = await server.get('a');
  const again = await server.get('a');
  assert.deepEqual(again.headers, first.headers);
  assert.deepEqual([...again.bytes], [...first.bytes]);
  assert.equal(server.calls.length, 1);
  assert.equal((await server.get('b')).status, 200);
  assert.equal((await server.get('c')).status, 200);
  assert.equal(server.calls.length, 2);
});

test('[skywatch-thumbnails-012] keeps an image for 599999 ms and not for 600000 ms', async (t) => {
  const server = install(t, { urls: { a: CDN } });
  await server.get('a');
  server.time.value += 599999;
  await server.get('a');
  assert.equal(server.calls.length, 1);
  server.time.value += 1;
  await server.get('a');
  assert.equal(server.calls.length, 2);
});

test('[skywatch-thumbnails-012] keeps at most 32 images and removes the oldest image first', async (t) => {
  const urls = {};
  for (let n = 0; n < 33; n++)
    urls[`i${n}`] = `https://cdn.example.test/${n}.png`;
  const server = install(t, { urls });
  const get = async (id) => {
    const answer = await server.get(id);
    assert.equal(answer.status, 200, id);
    server.advance(2001);
  };
  for (let n = 0; n < 32; n++) await get(`i${n}`);
  assert.equal(server.calls.length, 32);
  await get('i31');
  assert.equal(server.calls.length, 32);
  await get('i32');
  assert.equal(server.calls.length, 33);
  await get('i1');
  assert.equal(server.calls.length, 33);
  await get('i0');
  assert.equal(server.calls.length, 34);
  assert.equal(server.calls[33].url, 'https://cdn.example.test/0.png');
});

test('[skywatch-thumbnails-012] keeps no failure', async (t) => {
  const server = install(t, {
    urls: { a: CDN },
    respond: (url, init, n) => (n === 1 ? json(500, {}) : image()),
  });
  assert.equal((await server.get('a')).status, 502);
  assert.equal((await server.get('a')).status, 200);
  assert.equal(server.calls.length, 2);
});

test('[skywatch-thumbnails-013] shares an upstream request that is in flight, with its image or its failure', async (t) => {
  for (const result of [image(), json(500, {})]) {
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const server = install(t, {
      urls: { a: CDN, b: CDN },
      respond: async () => {
        await gate;
        return result;
      },
    });
    const first = server.get('a');
    await settle();
    const second = server.get('b');
    await settle();
    assert.equal(server.calls.length, 1);
    release();
    const [one, two] = await Promise.all([first, second]);
    assert.equal(one.status, two.status);
    assert.deepEqual([...one.bytes], [...two.bytes]);
    assert.equal(server.calls.length, 1);
  }
});

test('[skywatch-thumbnails-014] answers with the first step that fails', async (t) => {
  const server = install(t, {
    urls: { a: CDN, bad: 'http://cdn.example.test/t.png' },
    env: { SKYWATCH_THUMBNAILS: 'no' },
  });
  const cross = { 'sec-fetch-site': 'cross-site' };
  assert.equal(
    (await server.request(`${ROUTE}/a/b`, { method: 'POST', headers: cross }))
      .next,
    true,
  );
  assert.equal(
    (await server.get('a', { method: 'POST', headers: cross })).status,
    403,
  );
  assert.equal((await server.get('a', { method: 'POST' })).status, 405);
  for (let n = 0; n < 31; n++) {
    assert.deepEqual((await server.get('unknown')).body, {
      error: 'thumbnails_off',
    });
  }
  server.env.SKYWATCH_THUMBNAILS = 'true';
  assert.deepEqual((await server.get('unknown')).body, {
    error: 'unknown_scene',
  });
  for (let n = 0; n < 29; n++) await server.get('a');
  assert.deepEqual((await server.get('unknown')).body, {
    error: 'rate_limited',
  });
  assert.equal(server.calls.length, 1);
});

test('[skywatch-thumbnails-014] checks the rate limit before the scene, and the image store before the upstream request', async (t) => {
  const server = install(t, { urls: { a: CDN } });
  for (let n = 0; n < 30; n++) await server.get(n === 0 ? 'a' : 'unknown');
  const limited = await server.get('a');
  assert.deepEqual(limited.body, { error: 'rate_limited' });
  server.advance(60000);
  const stored = await server.get('a');
  assert.equal(stored.status, 200);
  assert.equal(server.calls.length, 1);
});

// --- Log --------------------------------------------------------------------

test('[skywatch-thumbnails-015] writes one line for a good image and for each failure, with the time', async (t) => {
  for (const [respond, line] of [
    [
      () => image(bytesOf(JPEG, [0]), 'image/jpeg'),
      '[skywatch] thumbnail ok bytes=4 ms=25',
    ],
    [
      () => json(500, {}),
      '[skywatch] thumbnail failed kind=upstream_failed ms=25',
    ],
    [
      () => image(bytesOf(PNG), 'text/html'),
      '[skywatch] thumbnail failed kind=bad_upstream ms=25',
    ],
  ]) {
    const server = install(t, {
      urls: { a: CDN },
      respond: (url, init, n, time) => {
        time.value += 25;
        return respond();
      },
    });
    await server.get('a');
    assert.deepEqual(server.lines, [line]);
  }
});

test('[skywatch-thumbnails-015] writes no line for an answer of the image store or of a step before the upstream request', async (t) => {
  const server = install(t, {
    urls: { a: CDN, bad: 'http://cdn.example.test/t.png' },
  });
  await server.get('a');
  assert.equal(server.lines.length, 1);
  await server.get('a');
  await server.get('bad');
  await server.get('unknown');
  await server.get('a', { method: 'POST' });
  await server.get('a', { headers: { 'sec-fetch-site': 'cross-site' } });
  assert.equal(server.lines.length, 1);
  for (const secret of ['CANARY', 'cdn.example.test', KEY, "'a'", ' a ']) {
    assert.equal(server.lines[0].includes(secret), false, secret);
  }
});

test('[skywatch-thumbnails-015] logs with console.log when the test gives no log option', async (t) => {
  const logged = t.mock.method(console, 'log', () => {});
  const server = install(t, { urls: { a: CDN }, noLog: true });
  assert.equal((await server.get('a')).status, 200);
  assert.equal(logged.mock.callCount(), 1);
  assert.match(
    logged.mock.calls[0].arguments[0],
    /^\[skywatch\] thumbnail ok bytes=11 ms=0$/,
  );
});
