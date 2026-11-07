import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { inspect } from 'node:util';
import { readFile, readdir } from 'node:fs/promises';
import { up42SourcePlugins } from '../../server/providers/up42-thumbnails/plugins.js';
import { up42ThumbnailProxy } from '../../server/providers/up42-thumbnails/thumbnails.js';
import { createClient } from '../../server/providers/up42/auth.js';
import { isSearchId } from '../../server/providers/up42/normalize.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 10, 7, 12);
const TOKEN =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const COLLECTIONS =
  'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100';
const SEARCH = 'https://api.up42.com/catalog/hosts/oneatlas/stac/search';
const THUMB = 'https://api.up42.com/catalog/oneatlas/image/scene.1/thumbnail';
const PNG = [137, 80, 78, 71, 13, 10, 26, 10];
const JPEG = [255, 216, 255];
const WEBP = [82, 73, 70, 70, 1, 0, 0, 0, 87, 69, 66, 80];
const envOf = () => ({
  UP42_USERNAME: 'fake-user-private',
  UP42_PASSWORD: 'fake-pass-private',
  UP42_THUMBNAILS: 'true',
  UP42_DAILY_SEARCHES: '100',
});
const json = (value, status = 200) =>
  new Response(JSON.stringify(value), { status });
const image = (bytes = PNG, type = 'image/png', headers = {}) =>
  new Response(Uint8Array.from(bytes), {
    headers: { 'content-type': type, ...headers },
  });
const body = (extra = {}) => ({
  box: [10, 60, 10.02, 60.01],
  start: '2026-10-01',
  end: '2026-10-20',
  ...extra,
});
const collection = (name = 'pneo', host = 'oneatlas', thumbnail = true) => ({
  name,
  providers: [{ name: host, roles: ['HOST'] }],
  integrations: thumbnail
    ? ['SEARCH_AVAILABLE', 'THUMBNAIL_AVAILABLE']
    : ['SEARCH_AVAILABLE'],
});
const feature = (id = 'scene.1', name = 'pneo') => ({
  properties: { id, collection: name, datetime: '2026-10-01T01:02:03Z' },
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
});
const good = (url) => {
  if (url === TOKEN)
    return json({ access_token: 'fake-token-private', expires_in: 180 });
  if (url === COLLECTIONS) return json({ content: [collection()] });
  if (url.endsWith('/stac/search')) return json({ features: [feature()] });
  return image();
};
const settle = async () => {
  for (let n = 0; n < 8; n++)
    await new Promise((resolve) => setImmediate(resolve));
};

function harness(plugins, hook = 'configureServer') {
  const routes = new Map();
  for (const plugin of plugins)
    plugin[hook]({
      middlewares: { use: (path, fn) => routes.set(path, fn) },
    });
  async function request(
    path,
    {
      suffix = '/',
      method = 'GET',
      value,
      headers = {},
      encrypted = false,
      address = '192.0.2.1',
    } = {},
  ) {
    const req = Object.assign(
      Readable.from(
        value === undefined ? [] : [Buffer.from(JSON.stringify(value))],
      ),
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
    const res = {
      writeHead(status, fields) {
        answer.status = status;
        answer.headers = Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [k.toLowerCase(), v]),
        );
      },
      end(bytes) {
        answer.bytes = Buffer.from(bytes);
        if (answer.headers['content-type'].startsWith('application/json'))
          answer.body = JSON.parse(bytes);
      },
    };
    await routes.get(path)(req, res, () => {
      answer.next = true;
    });
    return answer;
  }
  return {
    routes,
    request,
    get: (id = 'scene.1', options = {}) =>
      request('/api/up42/thumbnail', { suffix: `/${id}`, ...options }),
    scenes: (value = body()) =>
      request('/api/up42/scenes', { method: 'POST', value }),
  };
}
function install(
  t,
  { env = {}, respond = good, timers = {}, standalone, lookup } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const environment = { ...envOf(), ...env };
  const calls = [];
  const options = {
    env: environment,
    now: Date.now,
    setTimer: () => 1,
    clearTimer: () => {},
    log: () => {},
    ...timers,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return respond(url, init, calls.length);
    },
  };
  const client = createClient(options);
  const plugins = standalone
    ? [
        up42ThumbnailProxy({
          env: environment,
          now: Date.now,
          client,
          thumbnailHostOf: lookup,
        }),
      ]
    : up42SourcePlugins(options);
  return {
    ...harness(plugins),
    plugins,
    client,
    env: environment,
    calls,
    advance: (ms) => t.mock.timers.tick(ms),
    images: () => calls.filter((c) => c.url.endsWith('/thumbnail')),
  };
}
const errorOf = (answer, status, error, extra = {}) => {
  assert.equal(answer.status, status);
  assert.deepEqual(answer.body, { error, ...extra });
  assert.equal(
    answer.headers['content-type'],
    'application/json; charset=utf-8',
  );
  assert.equal(answer.headers['cache-control'], 'no-store');
};

test('[up42-thumbnails-001] checks the path in both hooks', async (t) => {
  const s = install(t);
  for (const hook of ['configureServer', 'configurePreviewServer']) {
    const hooked = harness([s.plugins[1]], hook);
    assert.deepEqual([...hooked.routes.keys()], ['/api/up42/thumbnail']);
    assert.equal(typeof hooked.routes.get('/api/up42/thumbnail'), 'function');
    for (const id of ['a', 'A_z-9.', 'a'.repeat(128), 'abc?x=1'])
      errorOf(await hooked.get(id), 404, 'unknown_scene');
    for (const id of [
      '',
      'a/b',
      'a\\b',
      'a#b',
      '%41',
      'a'.repeat(129),
      'a\n',
      'a b',
    ]) {
      assert.deepEqual(await hooked.get(id), { next: true });
      assert.equal(isSearchId(id), false);
    }
  }
  assert.equal(s.plugins[1].name, 'up42-thumbnail-proxy');
  assert.equal(isSearchId(undefined), false);
  assert.equal(isSearchId(1), false);
  for (const path of ['/api/up42/status', '/api/up42/scenes'])
    assert.deepEqual(await s.request(path, { suffix: '/child' }), {
      next: true,
    });
  assert.equal(s.calls.length, 0);
});

test('[up42-thumbnails-002] shares scenes through the local provider list', async (t) => {
  const previous = Object.fromEntries(
    Object.keys(envOf()).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, envOf());
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.push({ url, init });
    return good(url);
  });
  t.mock.method(console, 'log', () => {});
  const plugins = localProviderPlugins();
  const names = plugins.map((p) => p.name);
  assert.equal(names.filter((n) => n === 'up42-thumbnail-proxy').length, 1);
  assert.equal(
    names.indexOf('up42-thumbnail-proxy'),
    names.indexOf('up42-proxy') + 1,
  );
  const s = harness(plugins.filter((p) => p.name.startsWith('up42-')));
  errorOf(await s.get(), 404, 'unknown_scene');
  assert.equal((await s.scenes()).status, 200);
  assert.equal((await s.get()).status, 200);
  assert.equal(calls.filter((c) => c.url === TOKEN).length, 1);
  assert.equal(calls.filter((c) => c.url === THUMB).length, 1);
  process.env.UP42_THUMBNAILS = 'false';
  errorOf(await s.get(), 404, 'thumbnails_off');
});

test('[up42-thumbnails-003] checks the site before the method and rate', async (t) => {
  const s = install(t);
  for (let n = 0; n < 35; n++) {
    const headers = [
      { origin: 'http://else.invalid' },
      { origin: 'null' },
      { 'sec-fetch-site': 'cross-site' },
      { 'x-forwarded-for': '127.0.0.1' },
      { origin: 'https://localhost:5173' },
    ][n % 5];
    errorOf(
      await s.get('scene.1', { method: 'POST', headers }),
      403,
      'cross_origin',
    );
  }
  for (const encrypted of [false, true])
    errorOf(
      await s.get('scene.1', {
        encrypted,
        headers: {
          host: 'godseye.example.test',
          origin: `${encrypted ? 'https' : 'http'}://godseye.example.test`,
          'sec-fetch-site': 'same-origin',
        },
      }),
      404,
      'unknown_scene',
    );
  assert.equal(s.calls.length, 0);
});

test('[up42-thumbnails-004] accepts only GET', async (t) => {
  const s = install(t);
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD'])
    errorOf(await s.get('scene.1', { method }), 405, 'Method not allowed');
  assert.equal(s.calls.length, 0);
});

test('[up42-thumbnails-005] keeps each other variable value off before the rate', async (t) => {
  const s = install(t);
  for (const value of [undefined, '', 'false', '1', 'TRUE', 'true ']) {
    s.env.UP42_THUMBNAILS = value;
    for (let n = 0; n < 6; n++) errorOf(await s.get(), 404, 'thumbnails_off');
  }
  s.env.UP42_THUMBNAILS = 'true';
  errorOf(await s.get(), 404, 'unknown_scene');
  assert.equal(s.calls.length, 0);
});

test('[up42-thumbnails-006] counts kept images and both socket addresses', async (t) => {
  const s = install(t);
  await s.scenes();
  for (let n = 0; n < 29; n++)
    assert.equal(
      (await s.get('scene.1', { address: `192.0.2.${(n % 2) + 1}` })).status,
      200,
    );
  s.advance(59999);
  assert.equal((await s.get()).status, 200);
  const limited = await s.get();
  errorOf(limited, 429, 'rate_limited');
  assert.equal(limited.headers['retry-after'], '60');
  s.advance(1);
  assert.equal((await s.get()).status, 200);
  assert.equal(s.images().length, 1);
});

test('[up42-thumbnails-007] selects the newest answer with the id', async (t) => {
  let stage = 0;
  const s = install(t, {
    respond: (url) => {
      if (url === COLLECTIONS)
        return json({
          content: [
            collection(),
            collection('other', 'planet'),
            collection('none', 'spectra', false),
          ],
        });
      if (url.endsWith('/stac/search'))
        return json({
          features:
            stage === 3
              ? []
              : [feature('scene.1', ['pneo', 'other', 'none'][stage])],
        });
      return good(url);
    },
  });
  assert.equal(s.plugins[0].thumbnailHostOf('scene.1'), null);
  await s.scenes(body({ collections: ['pneo'] }));
  assert.equal(s.plugins[0].thumbnailHostOf('scene.1'), 'oneatlas');
  stage = 1;
  await s.scenes(body({ collections: ['other'] }));
  assert.equal(s.plugins[0].thumbnailHostOf('scene.1'), 'planet');
  await s.get();
  assert.equal(
    s.images()[0].url,
    'https://api.up42.com/catalog/planet/image/scene.1/thumbnail',
  );
  stage = 3;
  await s.scenes(body({ maxCloud: 3, collections: ['pneo'] }));
  assert.equal(s.plugins[0].thumbnailHostOf('scene.1'), 'planet');
  stage = 2;
  await s.scenes(body({ collections: ['none'] }));
  assert.equal(s.plugins[0].thumbnailHostOf('scene.1'), null);
  errorOf(await s.get(), 404, 'unknown_scene');
  assert.equal(s.images().length, 1);
});

test('[up42-thumbnails-007] uses the first scene and isolates plugin lists', async (t) => {
  const s = install(t, {
    respond: (url) =>
      url === COLLECTIONS
        ? json({ content: [collection('no', 'oneatlas', false), collection()] })
        : url === SEARCH
          ? json({ features: [feature('scene.1', 'no'), feature()] })
          : good(url),
  });
  await s.scenes();
  errorOf(await s.get(), 404, 'unknown_scene');
  const q = install(t);
  errorOf(await q.get(), 404, 'unknown_scene');
  assert.equal(s.images().length, 0);
  assert.equal(q.calls.length, 0);
  const bare = harness([up42ThumbnailProxy()]);
  errorOf(await bare.get(), 404, 'thumbnails_off');
  const noLookup = harness([
    up42ThumbnailProxy({ env: { UP42_THUMBNAILS: 'true' } }),
  ]);
  errorOf(await noLookup.get(), 404, 'unknown_scene');
});

test('[up42-thumbnails-007] rejects expired and evicted scenes before image bytes', async (t) => {
  const s = install(t, {
    respond: (url, init) =>
      url === SEARCH
        ? json({
            features: [
              feature(`i${JSON.parse(init.body).query.cloudCoverage.LTE}`),
            ],
          })
        : good(url),
  });
  await s.scenes(body({ maxCloud: 0 }));
  await s.get('i0');
  s.advance(599999);
  assert.equal(s.plugins[0].thumbnailHostOf('i0'), 'oneatlas');
  s.advance(1);
  assert.equal(s.plugins[0].thumbnailHostOf('i0'), null);
  errorOf(await s.get('i0'), 404, 'unknown_scene');
  for (let n = 0; n < 33; n++) {
    await s.scenes(body({ maxCloud: n }));
    if (n === 0) assert.equal((await s.get('i0')).status, 200);
    s.advance(10001);
  }
  assert.equal(s.plugins[0].thumbnailHostOf('i0'), null);
  assert.equal(s.plugins[0].thumbnailHostOf('i1'), 'oneatlas');
  errorOf(await s.get('i0'), 404, 'unknown_scene');
  assert.equal(s.images().length, 2);
});

test('[up42-thumbnails-008] sets the exact authenticated GET fields', async (t) => {
  const s = install(t);
  await s.scenes();
  assert.equal(
    (await s.get('scene.1?host=evil&url=https://evil.invalid')).status,
    200,
  );
  assert.equal(s.images().length, 1);
  const call = s.images()[0];
  assert.equal(
    call.url,
    'https://api.up42.com/catalog/oneatlas/image/scene.1/thumbnail',
  );
  assert.equal(call.init.method, 'GET');
  assert.deepEqual(call.init.headers, {
    Authorization: 'Bearer fake-token-private',
    Accept: 'image/png, image/jpeg, image/webp',
  });
  assert.equal(Object.hasOwn(call.init, 'body'), false);
  assert.equal(Object.hasOwn(call.init, 'redirect'), true);
  assert.equal(call.init.redirect, 'error');
  assert.equal(call.init.signal instanceof AbortSignal, true);
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 1);
});

test('[up42-thumbnails-008] rejects invalid path parts before login', async (t) => {
  const s = install(t);
  for (const host of [
    undefined,
    3,
    '',
    '../bad',
    'UPPER',
    '-a',
    'a'.repeat(65),
    'oneatlas\n',
  ])
    assert.deepEqual(await s.client.thumbnail(host, 'scene.1'), {
      ok: false,
      kind: 'bad_upstream',
    });
  for (const id of [
    undefined,
    3,
    '',
    '../bad/path',
    'a\\b',
    'a?b',
    'a#b',
    '%41',
    'a'.repeat(129),
    'a\n',
  ])
    assert.deepEqual(await s.client.thumbnail('oneatlas', id), {
      ok: false,
      kind: 'bad_upstream',
    });
  assert.equal(s.calls.length, 0);
  for (const host of ['0', 'a'.repeat(64)])
    assert.equal((await s.client.thumbnail(host, 'A_z-9.')).ok, true);
  const q = install(t, { standalone: true, lookup: () => '../bad' });
  errorOf(await q.get(), 502, 'bad_upstream');
  assert.equal(q.calls.length, 0);
});

test('[up42-thumbnails-009] shares one login and uses the token expiry', async (t) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = install(t, {
    respond: async (url) => {
      if (url === TOKEN) await gate;
      return good(url);
    },
  });
  const one = s.client.thumbnail('oneatlas', 'a');
  const two = s.client.thumbnail('planet', 'b');
  await settle();
  assert.equal(s.calls.length, 1);
  release();
  assert.deepEqual(
    (await Promise.all([one, two])).map((v) => v.ok),
    [true, true],
  );
  s.advance(119999);
  await s.client.thumbnail('oneatlas', 'c');
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 1);
  s.advance(1);
  await s.client.thumbnail('oneatlas', 'd');
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 2);
});

for (const [index, second] of [200, 401, 403].entries())
  test(`[up42-thumbnails-009] retries one API refusal case ${index}`, async (t) => {
    let logins = 0;
    let attempts = 0;
    const s = install(t, {
      respond: (url) =>
        url === TOKEN
          ? json({ access_token: `fake-token-${++logins}`, expires_in: 300 })
          : ++attempts === 1
            ? json({}, 401)
            : second === 200
              ? image()
              : json({}, second),
    });
    const result = await s.client.thumbnail('oneatlas', 'scene.1');
    if (second === 200) assert.equal(result.ok, true);
    else
      assert.deepEqual(result, {
        ok: false,
        kind: second === 401 ? 'credentials_rejected' : 'upstream_failed',
      });
    assert.equal(logins, 2);
    assert.equal(attempts, 2);
    assert.deepEqual(
      s.images().map((c) => c.init.headers.Authorization),
      ['Bearer fake-token-1', 'Bearer fake-token-2'],
    );
  });

for (const phase of ['first', 'second'])
  test(`[up42-thumbnails-009] stops after a refused ${phase} login`, async (t) => {
    let logins = 0;
    const s = install(t, {
      respond: (url) =>
        url === TOKEN
          ? ++logins === 1 && phase === 'second'
            ? good(url)
            : json({}, 400)
          : json({}, 401),
    });
    assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
      ok: false,
      kind: 'credentials_rejected',
    });
    assert.equal(s.images().length, phase === 'first' ? 0 : 1);
    assert.equal(logins, phase === 'first' ? 1 : 2);
  });

for (const [index, [bytes, type, expectedType]] of [
  [PNG, 'Image/PNG; charset=x', 'image/png'],
  [PNG, 'image/png ;x', 'image/png'],
  [JPEG, 'IMAGE/JPEG', 'image/jpeg'],
  [WEBP, 'image/webp', 'image/webp'],
].entries())
  test(`[up42-thumbnails-010] accepts image case ${index}`, async (t) => {
    const s = install(t, {
      standalone: true,
      lookup: () => 'oneatlas',
      respond: (url) => (url === TOKEN ? good(url) : image(bytes, type)),
    });
    const a = await s.get();
    assert.equal(a.status, 200);
    assert.deepEqual([...a.bytes], bytes);
    assert.equal(a.headers['content-type'], expectedType);
  });

for (const [index, respond] of [
  () => image(PNG, 'text/html'),
  () => image(PNG, 'image/svg+xml'),
  () => new Response(Uint8Array.from(PNG)),
  () => image([], 'image/png'),
  () => image(JPEG, 'image/png'),
  () => image(WEBP.slice(0, 11), 'image/webp'),
  () => image([...WEBP.slice(0, 8), 87, 65, 86, 69], 'image/webp'),
  () => image([...PNG, ...new Array(1048569).fill(0)]),
  () => image(PNG, 'image/png', { 'content-length': '1048577' }),
  () => new Response(null, { headers: { 'content-type': 'image/png' } }),
].entries())
  test(`[up42-thumbnails-010] refuses bad image case ${index}`, async (t) => {
    const s = install(t, {
      standalone: true,
      lookup: () => 'oneatlas',
      respond: (url) => (url === TOKEN ? good(url) : respond()),
    });
    errorOf(await s.get(), 502, 'bad_upstream');
  });

test('[up42-thumbnails-010] accepts exactly 1048576 bytes', async (t) => {
  const bytes = [...PNG, ...new Array(1048568).fill(0)];
  const s = install(t, {
    standalone: true,
    lookup: () => 'oneatlas',
    respond: (url) => (url === TOKEN ? good(url) : image(bytes)),
  });
  const a = await s.get();
  assert.equal(a.status, 200);
  assert.equal(a.bytes.length, 1048576);
  assert.deepEqual([...a.bytes], bytes);
});

test('[up42-thumbnails-010] cancels a non-image body before it reads bytes', async (t) => {
  let cancels = 0;
  let reads = 0;
  const s = install(t, {
    respond: (url) =>
      url === TOKEN
        ? good(url)
        : {
            status: 200,
            headers: new Headers({ 'content-type': 'application/json' }),
            body: {
              cancel: async () => {
                cancels++;
              },
            },
            arrayBuffer() {
              reads++;
              throw new Error('test');
            },
          },
  });
  assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
    ok: false,
    kind: 'bad_upstream',
  });
  assert.equal(cancels, 1);
  assert.equal(reads, 0);
});

for (const [index, status] of [
  201, 204, 302, 404, 401, 429, 500, 542,
].entries())
  test(`[up42-thumbnails-011] names status case ${index}`, async (t) => {
    const s = install(t, {
      standalone: true,
      lookup: () => 'oneatlas',
      respond: (url) =>
        url === TOKEN ? good(url) : new Response(null, { status }),
    });
    const expected =
      status === 404
        ? [404, 'not_found', {}]
        : status === 401
          ? [403, 'credentials_rejected', { keyRejected: true }]
          : [502, 'upstream_failed', {}];
    errorOf(await s.get(), ...expected);
    assert.equal(s.images().length, status === 401 ? 2 : 1);
  });

for (const [index, respond] of [
  () => {
    throw new Error('fake-pass-private');
  },
  () =>
    new Response(
      new ReadableStream({
        start(c) {
          c.error(new Error('fake-token-private'));
        },
      }),
      { headers: { 'content-type': 'image/png' } },
    ),
].entries())
  test(`[up42-thumbnails-011] names transport case ${index}`, async (t) => {
    const s = install(t, {
      standalone: true,
      lookup: () => 'oneatlas',
      respond: (url) => (url === TOKEN ? good(url) : respond()),
    });
    errorOf(await s.get(), 502, 'upstream_failed');
  });

for (const phase of ['headers', 'body'])
  test(
    `[up42-thumbnails-012] stops during the ${phase} phase`,
    { timeout: 2000 },
    async (t) => {
      const timers = new Map();
      let serial = 0;
      const s = install(t, {
        standalone: true,
        lookup: () => 'oneatlas',
        timers: {
          setTimer: (fn, ms) => {
            assert.equal(ms, 15000);
            timers.set(++serial, fn);
            return serial;
          },
          clearTimer: (id) => timers.delete(id),
        },
        respond: (url, init) =>
          url === TOKEN
            ? good(url)
            : phase === 'headers'
              ? new Promise((_resolve, reject) =>
                  init.signal.addEventListener('abort', () =>
                    reject(new Error('test')),
                  ),
                )
              : new Response(
                  new ReadableStream({
                    start(c) {
                      c.enqueue(Uint8Array.from(PNG));
                    },
                  }),
                  { headers: { 'content-type': 'image/png' } },
                ),
      });
      const run = s.get();
      await settle();
      assert.equal(timers.size, 1);
      for (const fire of timers.values()) fire();
      errorOf(await run, 504, 'search_timeout');
      assert.equal(timers.size, 0);
    },
  );

for (const cancelFails of [false, true])
  test(`[up42-thumbnails-012] discards error bodies with cancel failure ${cancelFails}`, async (t) => {
    const events = [];
    let active = 0;
    const s = install(t, {
      timers: {
        setTimer: () => ++active,
        clearTimer: () => {
          events.push('clear');
          active--;
        },
      },
      respond: (url) =>
        url === TOKEN
          ? good(url)
          : new Response(
              new ReadableStream({
                async cancel() {
                  events.push(['cancel', active]);
                  await settle();
                  events.push('discard');
                  if (cancelFails) throw new Error('fake-pass-private');
                },
              }),
              { status: 404 },
            ),
    });
    assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
      ok: false,
      kind: 'not_found',
    });
    assert.deepEqual(events.slice(-3), [['cancel', 1], 'discard', 'clear']);
    assert.equal(active, 0);
  });

test('[up42-thumbnails-012] keeps the timer through all image bytes', async (t) => {
  let done = false;
  const states = [];
  const s = install(t, {
    timers: { clearTimer: () => states.push(done) },
    respond: (url) =>
      url === TOKEN
        ? good(url)
        : new Response(
            new ReadableStream({
              async pull(c) {
                await settle();
                c.enqueue(Uint8Array.from(PNG));
                done = true;
                c.close();
              },
            }),
            { headers: { 'content-type': 'image/png' } },
          ),
  });
  assert.equal((await s.client.thumbnail('oneatlas', 'scene.1')).ok, true);
  assert.deepEqual(states, [false, true]);
});

test('[up42-thumbnails-013] sends bytes with only its own headers', async (t) => {
  const s = install(t, {
    respond: (url) =>
      url.endsWith('/thumbnail')
        ? image([...JPEG, 7], 'image/jpeg; charset=x', {
            'set-cookie': 'CANARY',
            'x-source': 'CANARY',
            'cache-control': 'public',
          })
        : good(url),
  });
  await s.scenes();
  const a = await s.get();
  assert.equal(a.status, 200);
  assert.deepEqual([...a.bytes], [255, 216, 255, 7]);
  assert.deepEqual(a.headers, {
    'content-type': 'image/jpeg',
    'content-length': '4',
    'cache-control': 'private, max-age=600',
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'",
  });
});

test('[up42-thumbnails-014] uses the image age and no daily count', async (t) => {
  const s = install(t, { env: { UP42_DAILY_SEARCHES: '1' } });
  assert.deepEqual((await s.scenes()).body.budget, { used: 1, limit: 1 });
  await s.get();
  s.advance(599999);
  assert.equal((await s.get()).status, 200);
  assert.equal(s.images().length, 1);
  assert.deepEqual((await s.scenes()).body.budget, { used: 1, limit: 1 });
  // Keep scene access independent from the image age for this boundary.
  const q = install(t, { standalone: true, lookup: () => 'oneatlas' });
  await q.get();
  q.advance(599999);
  await q.get();
  assert.equal(q.images().length, 1);
  q.advance(1);
  await q.get();
  assert.equal(q.images().length, 2);
});

test('[up42-thumbnails-014] keys images by both host and id', async (t) => {
  let host = 'oneatlas';
  const s = install(t, { standalone: true, lookup: () => host });
  await s.get();
  host = 'planet';
  await s.get();
  await s.get('other');
  host = 'oneatlas';
  await s.get();
  assert.deepEqual(
    s.images().map((c) => c.url),
    [
      THUMB,
      'https://api.up42.com/catalog/planet/image/scene.1/thumbnail',
      'https://api.up42.com/catalog/planet/image/other/thumbnail',
    ],
  );
});

test('[up42-thumbnails-014] removes the oldest of 33 images', async (t) => {
  const s = install(t, { standalone: true, lookup: () => 'oneatlas' });
  for (let n = 0; n < 33; n++) {
    assert.equal((await s.get(`i${n}`)).status, 200);
    s.advance(2001);
  }
  await s.get('i1');
  assert.equal(s.images().length, 33);
  s.advance(2001);
  assert.equal((await s.get('i0')).status, 200);
  assert.equal(s.images().length, 34);
  assert.equal(
    s.images().at(-1).url,
    'https://api.up42.com/catalog/oneatlas/image/i0/thumbnail',
  );
});

test('[up42-thumbnails-014] makes an expired image newest after a refresh', async (t) => {
  const s = install(t, { standalone: true, lookup: () => 'oneatlas' });
  const get = async (id) => {
    assert.equal((await s.get(id)).status, 200);
    s.advance(2001);
  };
  await get('x');
  await get('i0');
  s.advance(600000);
  for (let n = 1; n <= 30; n++) await get(`i${n}`);
  await get('i0');
  await get('i31');
  await get('i32');
  assert.equal(s.images().length, 35);
  await get('i0');
  assert.equal(s.images().length, 35);
  await get('i1');
  assert.equal(s.images().length, 36);
});

for (const success of [true, false])
  test(`[up42-thumbnails-015] claims simultaneous requests with success ${success}`, async (t) => {
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const s = install(t, {
      respond: async (url) => {
        if (url.endsWith('/thumbnail')) {
          await gate;
          return success ? image() : json({}, 500);
        }
        return good(url);
      },
    });
    await s.scenes();
    assert.equal(s.images().length, 0);
    const first = s.get();
    const second = s.get();
    await settle();
    const started = s.images().length;
    release();
    const [a, b] = await Promise.all([first, second]);
    assert.equal(started, 1);
    assert.equal(a.status, success ? 200 : 502);
    assert.equal(b.status, success ? 200 : 502);
    assert.deepEqual(a.bytes, b.bytes);
    assert.equal(s.images().length, 1);
    await s.get();
    assert.equal(s.images().length, success ? 1 : 2);
  });

test('[up42-thumbnails-016] keeps all fake secrets out of output', async (t) => {
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
    'fake-user-private',
    'fake-pass-private',
    'fake-token-private',
  ]) {
    for (const mode of ['good', 'image', 'error', 'throw']) {
      const s = install(t, {
        standalone: true,
        lookup: () => 'oneatlas',
        respond: (url) => {
          if (url === TOKEN) return good(url);
          if (mode === 'image') return image([...PNG, ...Buffer.from(secret)]);
          if (mode === 'error') return json({ message: secret }, 500);
          if (mode === 'throw') throw new Error(secret);
          return image();
        },
      });
      const a = await s.get();
      answers.push({
        status: a.status,
        headers: a.headers,
        text: a.bytes.toString(),
      });
      assert.equal(a.status, mode === 'good' ? 200 : 502);
    }
  }
  const text = JSON.stringify({ answers, output });
  for (const secret of [
    'fake-user-private',
    'fake-pass-private',
    'fake-token-private',
  ])
    assert.equal(text.includes(secret), false, secret);
});

test('[up42-thumbnails-016] refuses a previous secret in image bytes', async (t) => {
  let logins = 0;
  const s = install(t, {
    respond: (url) =>
      url === TOKEN
        ? json({ access_token: `fake-old-token-${++logins}`, expires_in: 180 })
        : image([...PNG, ...Buffer.from('fake-old-token-1')]),
  });
  assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
    ok: false,
    kind: 'bad_upstream',
  });
  s.advance(120000);
  assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
    ok: false,
    kind: 'bad_upstream',
  });
  assert.equal(logins, 2);
});

test('[up42-thumbnails-017] allows only the four literal request forms', async (t) => {
  const recorded = [];
  const permitted = (url, init) =>
    (url ===
      'https://auth.up42.com/realms/public/protocol/openid-connect/token' &&
      init.method === 'POST') ||
    (url ===
      'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100' &&
      init.method === 'GET') ||
    (/^https:\/\/api\.up42\.com\/catalog\/hosts\/[a-z0-9][a-z0-9-]{0,63}\/stac\/search$/.test(
      url,
    ) &&
      init.method === 'POST') ||
    (/^https:\/\/api\.up42\.com\/catalog\/[a-z0-9][a-z0-9-]{0,63}\/image\/[A-Za-z0-9_.-]{1,128}\/thumbnail$/.test(
      url,
    ) &&
      init.method === 'GET');
  for (const status of [200, 401, 404, 429, 500, 542, 302]) {
    const s = install(t, {
      respond: (url, init) => {
        recorded.push([url, init]);
        assert.equal(permitted(url, init), true);
        return url.endsWith('/thumbnail') && status !== 200
          ? json({}, status)
          : good(url);
      },
    });
    assert.equal((await s.scenes()).status, 200);
    await s.get();
  }
  assert.equal(
    recorded.filter(([url]) => url.endsWith('/thumbnail')).length,
    8,
  );
  for (const [url, init] of recorded)
    assert.equal(permitted(url, init), true, `${init.method} ${url}`);
  const root = new URL('../../server/providers/', import.meta.url);
  const paths = [
    'up42.js',
    ...(await readdir(new URL('up42/', root)))
      .filter((name) => name.endsWith('.js'))
      .map((name) => `up42/${name}`),
  ];
  paths.push(
    ...(await readdir(new URL('up42-thumbnails/', root)))
      .filter((name) => name.endsWith('.js'))
      .map((name) => `up42-thumbnails/${name}`),
  );
  assert.equal(paths.includes('up42-thumbnails/thumbnails.js'), true);
  assert.equal(paths.includes('up42-thumbnails/plugins.js'), true);
  for (const path of paths) {
    const source = await readFile(new URL(path, root), 'utf8');
    for (const literal of [
      '/v2/orders',
      'quotation',
      'PATCH',
      'download-url',
      'eulas',
      'execution',
    ])
      assert.equal(source.includes(literal), false, `${path}: ${literal}`);
  }
});

for (const bodyKind of ['absent', 'cancel-error'])
  test(`[up42-thumbnails-010] refuses a non-image with body case ${bodyKind}`, async (t) => {
    let cancelled = false;
    const s = install(t, {
      respond: (url) =>
        url === TOKEN
          ? good(url)
          : {
              status: 200,
              headers: new Headers({ 'content-type': 'application/json' }),
              body:
                bodyKind === 'absent'
                  ? null
                  : {
                      cancel: async () => {
                        cancelled = true;
                        throw new Error('fake-pass-private');
                      },
                    },
            },
    });
    assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
      ok: false,
      kind: 'bad_upstream',
    });
    assert.equal(cancelled, bodyKind === 'cancel-error');
  });

test('[up42-thumbnails-007] refuses an expired scene with a fresh image', async (t) => {
  const s = install(t);
  assert.equal((await s.scenes()).status, 200);
  s.advance(599999);
  assert.equal((await s.get()).status, 200);
  assert.equal(s.images().length, 1);
  s.advance(1);
  errorOf(await s.get(), 404, 'unknown_scene');
  assert.equal(s.images().length, 1);
});

test('[up42-thumbnails-018] sends literal bytes and headers from the store', async (t) => {
  const s = install(t, {
    respond: (url) =>
      url.endsWith('/thumbnail')
        ? image([255, 216, 255, 7], 'image/jpeg')
        : good(url),
  });
  assert.equal((await s.scenes()).status, 200);
  assert.equal((await s.get()).status, 200);
  const second = await s.get();
  assert.equal(second.status, 200);
  assert.deepEqual([...second.bytes], [255, 216, 255, 7]);
  assert.equal(second.headers['content-type'], 'image/jpeg');
  assert.equal(second.headers['content-length'], '4');
  assert.equal(s.images().length, 1);
});

for (const [key, previous, next] of [
  ['UP42_USERNAME', 'fake-user-private', 'fake-next-user'],
  ['UP42_PASSWORD', 'fake-pass-private', 'fake-next-pass'],
])
  test(`[up42-thumbnails-016] refuses the previous secret after ${key} changes`, async (t) => {
    const credentials = [];
    const s = install(t, {
      respond: (url, init) => {
        if (url === TOKEN) {
          const form = new URLSearchParams(init.body);
          credentials.push([form.get('username'), form.get('password')]);
          return good(url);
        }
        return image([...PNG, ...Buffer.from(previous)]);
      },
    });
    assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
      ok: false,
      kind: 'bad_upstream',
    });
    s.env[key] = next;
    assert.deepEqual(await s.client.thumbnail('oneatlas', 'scene.1'), {
      ok: false,
      kind: 'bad_upstream',
    });
    assert.deepEqual(credentials, [
      ['fake-user-private', 'fake-pass-private'],
      key === 'UP42_USERNAME'
        ? ['fake-next-user', 'fake-pass-private']
        : ['fake-user-private', 'fake-next-pass'],
    ]);
    assert.equal(s.images().length, 2);
  });

for (const status of [404, 200])
  for (const completion of ['never', 'after-abort'])
    test(
      `[up42-thumbnails-012] limits cancel at status ${status} with end ${completion}`,
      { timeout: 2000 },
      async (t) => {
        const timers = new Map();
        let serial = 0;
        let finish;
        let cancelled = false;
        let finished = false;
        const s = install(t, {
          standalone: true,
          lookup: () => 'oneatlas',
          timers: {
            setTimer: (fn, ms) => {
              assert.equal(ms, 15000);
              timers.set(++serial, fn);
              return serial;
            },
            clearTimer: (id) => timers.delete(id),
          },
          respond: (url) =>
            url === TOKEN
              ? good(url)
              : {
                  status,
                  headers: new Headers({ 'content-type': 'text/plain' }),
                  body: {
                    cancel() {
                      cancelled = true;
                      return new Promise((resolve) => {
                        finish = resolve;
                      });
                    },
                  },
                },
        });
        const run = s.get().then((answer) => {
          finished = true;
          return answer;
        });
        await settle();
        assert.equal(cancelled, true);
        assert.equal(finished, false);
        assert.equal(timers.size, 1);
        for (const fire of timers.values()) fire();
        await settle();
        if (completion === 'after-abort') finish();
        errorOf(await run, 504, 'search_timeout');
        assert.equal(timers.size, 0);
      },
    );

test('[up42-thumbnails-019] refuses ids of dots only before login', async (t) => {
  const s = install(t, { standalone: true, lookup: () => 'oneatlas' });
  const unknown = install(t);
  const expected = await unknown.get('unknown');
  errorOf(expected, 404, 'unknown_scene');
  for (const id of ['.', '..', '...', '.'.repeat(128)]) {
    assert.deepEqual(await s.get(id), expected);
    assert.deepEqual(await s.client.thumbnail('oneatlas', id), {
      ok: false,
      kind: 'bad_upstream',
    });
  }
  assert.equal(s.calls.length, 0);
  assert.equal(unknown.calls.length, 0);
});

test('[up42-thumbnails-019] keeps dots inside the literal destination', async (t) => {
  const s = install(t, { standalone: true, lookup: () => 'oneatlas' });
  assert.equal((await s.get('scene.1')).status, 200);
  assert.equal(
    s.images()[0].url,
    'https://api.up42.com/catalog/oneatlas/image/scene.1/thumbnail',
  );
  assert.equal(
    new URL(s.images()[0].url).href,
    'https://api.up42.com/catalog/oneatlas/image/scene.1/thumbnail',
  );
});
