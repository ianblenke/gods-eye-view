import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createClient } from '../../server/providers/up42/auth.js';
import { createSearch } from '../../server/providers/up42/upstream.js';

const TOKEN =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const COLLECTIONS =
  'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100';
const SEARCH = 'https://api.up42.com/catalog/hosts/oneatlas/stac/search';
const json = (value, status = 200) =>
  new Response(JSON.stringify(value), { status });
const token = (name = 'fake-token-A', expires_in = 300) =>
  json({ access_token: name, expires_in });
const collection = (name = 'pneo', host = 'oneatlas', thumbnail = true) => ({
  name,
  integrations: thumbnail
    ? ['SEARCH_AVAILABLE', 'THUMBNAIL_AVAILABLE']
    : ['SEARCH_AVAILABLE'],
  providers: [
    { name: 'producer', roles: ['PRODUCER'] },
    { name: host, roles: ['HOST'] },
  ],
});
const input = (extra = {}) => ({
  box: [10, 60, 10.02, 60.01],
  start: '2026-10-01',
  end: '2026-10-20',
  ...extra,
});
const settle = async () => {
  for (let i = 0; i < 10; i++)
    await new Promise((resolve) => setImmediate(resolve));
};
function setup({
  respond,
  clock = { value: 1000000 },
  setTimer = () => 1,
  clearTimer = () => {},
  env = {},
} = {}) {
  const calls = [];
  const client = createClient({
    env: {
      UP42_USERNAME: ' test-user ',
      UP42_PASSWORD: 'fake-pass &+',
      ...env,
    },
    now: () => clock.value,
    setTimer,
    clearTimer,
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      if (respond) return respond(url, init, calls.length);
      if (url === TOKEN) return token();
      if (url === COLLECTIONS) return json({ content: [collection()] });
      return json({ type: 'FeatureCollection', features: [], links: [] });
    },
  });
  return {
    client,
    calls,
    clock,
    search: createSearch(client, () => clock.value),
  };
}

test('[up42-source-012] sends the password form only to the fixed token host', async () => {
  const s = setup();
  assert.deepEqual(await s.client.search('oneatlas', { limit: 17 }), {
    ok: true,
    value: { type: 'FeatureCollection', features: [], links: [] },
  });
  assert.equal(s.calls.length, 2);
  const [login, api] = s.calls;
  assert.equal(
    login.url,
    'https://auth.up42.com/realms/public/protocol/openid-connect/token',
  );
  assert.equal(login.init.method, 'POST');
  assert.deepEqual(login.init.headers, {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  });
  assert.deepEqual(Object.fromEntries(new URLSearchParams(login.init.body)), {
    grant_type: 'password',
    client_id: 'up42-api',
    username: 'test-user',
    password: 'fake-pass &+',
  });
  assert.equal(
    api.url,
    'https://api.up42.com/catalog/hosts/oneatlas/stac/search',
  );
  assert.equal(api.init.method, 'POST');
  assert.deepEqual(api.init.headers, {
    Authorization: 'Bearer fake-token-A',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  assert.deepEqual(JSON.parse(api.init.body), { limit: 17 });
  for (const { init } of s.calls) {
    assert.equal(Object.hasOwn(init, 'redirect'), true);
    assert.equal(init.redirect, 'error');
    assert.equal(init.signal instanceof AbortSignal, true);
  }
});
for (const status of [400, 401]) {
  test(`[up42-source-012] names token refusal ${status}`, async () => {
    const s = setup({
      respond: () => json({ message: 'fake-pass &+' }, status),
    });
    assert.deepEqual(await s.client.search('oneatlas', {}), {
      ok: false,
      kind: 'credentials_rejected',
    });
    assert.equal(s.calls.length, 1);
  });
}

test('[up42-source-013] reuses one token until the exact time boundary', async () => {
  const s = setup();
  await s.client.search('oneatlas', {});
  s.clock.value += 239999;
  await s.client.search('oneatlas', {});
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 1);
  s.clock.value += 1;
  await s.client.search('oneatlas', {});
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 2);
});

test('[up42-source-013] shares one login across concurrent requests', async () => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = setup({
    respond: async (url) => {
      if (url === TOKEN) {
        await gate;
        return token();
      }
      return json({ features: [] });
    },
  });
  const first = s.client.search('oneatlas', { a: 1 });
  const second = s.client.search('planet', { b: 2 });
  await settle();
  assert.equal(s.calls.length, 1);
  release();
  assert.deepEqual(await Promise.all([first, second]), [
    { ok: true, value: { features: [] } },
    { ok: true, value: { features: [] } },
  ]);
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 1);
  assert.deepEqual(
    s.calls.slice(1).map((c) => [c.url, c.init.headers.Authorization]),
    [
      [SEARCH, 'Bearer fake-token-A'],
      [
        'https://api.up42.com/catalog/hosts/planet/stac/search',
        'Bearer fake-token-A',
      ],
    ],
  );
});

for (const [index, secondStatus] of [200, 401, 403].entries()) {
  test(`[up42-source-013] retries one API refusal case ${index}`, async () => {
    let logins = 0;
    let searches = 0;
    const s = setup({
      respond: (url) => {
        if (url === TOKEN)
          return token(++logins === 1 ? 'fake-token-A' : 'fake-token-B');
        return json({ features: [] }, ++searches === 1 ? 401 : secondStatus);
      },
    });
    assert.deepEqual(
      await s.client.search('oneatlas', { limit: 19 }),
      secondStatus === 200
        ? { ok: true, value: { features: [] } }
        : { ok: false, kind: 'upstream_failed' },
    );
    assert.equal(logins, 2);
    assert.equal(searches, 2);
    assert.deepEqual(
      s.calls
        .filter((c) => c.url === SEARCH)
        .map((c) => [c.init.headers.Authorization, JSON.parse(c.init.body)]),
      [
        ['Bearer fake-token-A', { limit: 19 }],
        ['Bearer fake-token-B', { limit: 19 }],
      ],
    );
  });
}

test('[up42-source-013] shares a new login after concurrent API refusals', async () => {
  let logins = 0;
  const s = setup({
    respond: (url, init) =>
      url === TOKEN
        ? token(`fake-token-${++logins}`)
        : json(
            { features: [] },
            init.headers.Authorization === 'Bearer fake-token-1' ? 401 : 200,
          ),
  });
  await s.client.search('oneatlas', {});
  // The first call also renews; the next two refuse the same current token.
  assert.equal(logins, 2);
  let old;
  const q = setup({
    respond: (url, init) => {
      if (url === TOKEN) return token(`fake-token-${++logins}`);
      if (old === undefined) old = init.headers.Authorization;
      return json(
        { features: [] },
        init.headers.Authorization === old ? 401 : 200,
      );
    },
  });
  const answers = await Promise.all([
    q.client.search('oneatlas', {}),
    q.client.search('planet', {}),
  ]);
  assert.deepEqual(answers, [
    { ok: true, value: { features: [] } },
    { ok: true, value: { features: [] } },
  ]);
  assert.equal(q.calls.filter((c) => c.url === TOKEN).length, 2);
});

test('[up42-source-014] reads the public list without credentials and caches the map for six hours', async () => {
  const s = setup();
  await s.search(input());
  s.clock.value += 21599999;
  await s.search(input());
  assert.equal(s.calls.filter((c) => c.url === COLLECTIONS).length, 1);
  s.clock.value += 1;
  await s.search(input());
  assert.equal(s.calls.filter((c) => c.url === COLLECTIONS).length, 2);
  for (const c of s.calls.filter((c) => c.url === COLLECTIONS)) {
    assert.equal(c.init.method, 'GET');
    assert.deepEqual(c.init.headers, { Accept: 'application/json' });
    assert.equal(Object.hasOwn(c.init, 'body'), false);
    assert.equal(Object.hasOwn(c.init.headers, 'Authorization'), false);
  }
});

test('[up42-source-014] shares a public list request that is in flight', async () => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = setup({
    respond: async (url) => {
      if (url === COLLECTIONS) {
        await gate;
        return json({ content: [collection()] });
      }
      return url === TOKEN ? token() : json({ features: [] });
    },
  });
  const a = s.search(input());
  const b = s.search(input({ maxCloud: 3 }));
  await settle();
  assert.equal(s.calls.length, 1);
  release();
  assert.equal((await a).ok, true);
  assert.equal((await b).ok, true);
  assert.equal(s.calls.filter((c) => c.url === COLLECTIONS).length, 1);
});

for (const [index, content] of [
  null,
  {},
  [],
  [null, {}, { name: 'pneo' }],
  [collection('pneo', '../bad')],
  [collection('pneo', 'UPPER')],
  [collection('pneo', '-start')],
  [collection('pneo', 'a'.repeat(65))],
  [collection('pneo', 'a/b')],
  [collection('', 'oneatlas')],
  [{ ...collection(), integrations: null }],
  [
    {
      ...collection(),
      providers: [null, { name: 'producer', roles: ['PRODUCER'] }],
    },
  ],
].entries()) {
  test(`[up42-source-014] refuses collection list case ${index}`, async () => {
    const s = setup({ respond: () => json({ content }) });
    assert.deepEqual(await s.search(input()), {
      ok: false,
      kind: 'upstream_failed',
    });
    assert.equal(s.calls.length, 1);
  });
}

test('[up42-source-014] skips bad rows and checks each host at the path boundary', async () => {
  const s = setup({
    respond: (url) =>
      url === TOKEN
        ? token()
        : url === COLLECTIONS
          ? json({
              content: [
                null,
                collection('bad', '../bad'),
                collection('good', 'a'.repeat(64)),
                collection('zero', '0'),
              ],
            })
          : json({ features: [] }),
  });
  assert.equal((await s.search(input())).ok, true);
  assert.deepEqual(
    s.calls
      .filter((c) => c.init.method === 'POST' && c.url !== TOKEN)
      .map((c) => c.url),
    [
      `https://api.up42.com/catalog/hosts/${'a'.repeat(64)}/stac/search`,
      'https://api.up42.com/catalog/hosts/0/stac/search',
    ],
  );
  const before = s.calls.length;
  for (const host of ['../bad', 'UPPER', '', 3, 'a'.repeat(65)])
    assert.deepEqual(await s.client.search(host, {}), {
      ok: false,
      kind: 'upstream_failed',
    });
  assert.equal(s.calls.length, before);
});

test('[up42-source-010] refuses an unknown collection before a host search', async () => {
  const s = setup();
  assert.deepEqual(await s.search(input({ collections: ['missing'] })), {
    ok: false,
    kind: 'bad_collections',
  });
  assert.deepEqual(
    s.calls.map((c) => c.url),
    [COLLECTIONS],
  );
});

test('[up42-source-015] groups collections and sets each body field with no extra field', async () => {
  const s = setup({
    respond: (url) =>
      url === COLLECTIONS
        ? json({
            content: [
              collection(),
              collection('phr', 'oneatlas', false),
              collection('skysat', 'planet'),
            ],
          })
        : url === TOKEN
          ? token()
          : json({ features: [] }),
  });
  assert.deepEqual(
    await s.search(
      input({ maxCloud: 37, collections: ['phr', 'skysat', 'pneo'] }),
    ),
    { ok: true, scenes: [], dropped: 0, truncated: false, failedHosts: [] },
  );
  assert.deepEqual(
    s.calls
      .filter((c) => c.url !== TOKEN && c.url !== COLLECTIONS)
      .map((c) => [c.url, JSON.parse(c.init.body)]),
    [
      [
        SEARCH,
        {
          collections: ['pneo', 'phr'],
          datetime: '2026-10-01T00:00:00.000Z/2026-10-20T23:59:59.999Z',
          intersects: {
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
          limit: 50,
          query: { cloudCoverage: { LTE: 37 } },
        },
      ],
      [
        'https://api.up42.com/catalog/hosts/planet/stac/search',
        {
          collections: ['skysat'],
          datetime: '2026-10-01T00:00:00.000Z/2026-10-20T23:59:59.999Z',
          intersects: {
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
          limit: 50,
          query: { cloudCoverage: { LTE: 37 } },
        },
      ],
    ],
  );
  const q = setup();
  await q.search(input());
  assert.equal(
    Object.hasOwn(JSON.parse(q.calls.at(-1).init.body), 'query'),
    false,
  );
  await q.search(input({ maxCloud: 0 }));
  assert.deepEqual(JSON.parse(q.calls.at(-1).init.body).query, {
    cloudCoverage: { LTE: 0 },
  });
});

test('[up42-source-015] allows at most four host calls at one time', async () => {
  let active = 0;
  let maximum = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const s = setup({
    respond: async (url) => {
      if (url === COLLECTIONS)
        return json({
          content: Array.from({ length: 7 }, (_, i) =>
            collection(`c${i}`, `h${i}`),
          ),
        });
      if (url === TOKEN) return token();
      active++;
      maximum = Math.max(maximum, active);
      await gate;
      active--;
      return json({ features: [] });
    },
  });
  const run = s.search(input());
  await settle();
  assert.equal(active, 4);
  assert.equal(s.calls.filter((c) => c.url.includes('/catalog/')).length, 4);
  release();
  assert.equal((await run).ok, true);
  assert.equal(maximum, 4);
  assert.equal(s.calls.filter((c) => c.url.includes('/catalog/')).length, 7);
});

for (const [index, [hosts, links, expected, calls]] of [
  [25, [], true, 24],
  [24, [], false, 24],
  [11, [], false, 11],
  [1, [{ rel: 'next', href: 'https://untrusted.invalid/page' }], true, 1],
  [1, [{ rel: 'self' }], false, 1],
  [1, undefined, false, 1],
].entries()) {
  test(`[up42-source-016] marks the page limit case ${index}`, async () => {
    const s = setup({
      respond: (url) =>
        url === COLLECTIONS
          ? json({
              content: Array.from({ length: hosts }, (_, i) =>
                collection(`c${i}`, `h${i}`),
              ),
            })
          : url === TOKEN
            ? token()
            : json({ features: [], links }),
    });
    const answer = await s.search(input());
    assert.equal(answer.truncated, expected);
    assert.equal(
      s.calls.filter((c) => c.url.includes('/catalog/')).length,
      calls,
    );
    assert.equal(
      s.calls.some((c) => c.url.includes('untrusted')),
      false,
    );
  });
}

test('[up42-source-017] keeps good hosts and lists all failed hosts by name', async () => {
  const s = setup({
    respond: (url) =>
      url === COLLECTIONS
        ? json({
            content: [
              collection(),
              collection('a', 'broken-a'),
              collection('b', 'broken-b'),
            ],
          })
        : url === TOKEN
          ? token()
          : url === SEARCH
            ? json({ features: [] })
            : json({ message: 'HIDDEN' }, 542),
  });
  assert.deepEqual(await s.search(input()), {
    ok: true,
    scenes: [],
    dropped: 0,
    truncated: false,
    failedHosts: ['broken-a', 'broken-b'],
  });
});
for (const [index, document] of [
  null,
  {},
  { features: {} },
  { features: [], links: null },
  { features: [], links: [null] },
].entries()) {
  test(`[up42-source-017] refuses host document case ${index}`, async () => {
    const s = setup({
      respond: (url) =>
        url === TOKEN
          ? token()
          : url === COLLECTIONS
            ? json({ content: [collection()] })
            : json(document),
    });
    assert.deepEqual(await s.search(input()), {
      ok: false,
      kind: 'upstream_failed',
      failedHosts: ['oneatlas'],
    });
  });
}

test('[up42-source-018] keeps the timer through the body and clears it at the end', async () => {
  const states = [];
  const timers = [];
  let done = false;
  const s = setup({
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => states.push([id, done]),
    respond: () =>
      new Response(
        new ReadableStream({
          async pull(c) {
            await settle();
            c.enqueue(new TextEncoder().encode('{"content":[]}'));
            done = true;
            c.close();
          },
        }),
      ),
  });
  assert.deepEqual(await s.client.collections(), {
    ok: true,
    value: { content: [] },
  });
  assert.deepEqual(
    timers.map((t) => t.ms),
    [15000],
  );
  assert.deepEqual(states, [[1, true]]);
});
for (const phase of ['headers', 'body']) {
  test(
    `[up42-source-018] stops the call during the ${phase} phase`,
    { timeout: 3000 },
    async () => {
      let fire;
      const s = setup({
        setTimer: (fn) => {
          fire = fn;
          return 1;
        },
        respond: (_url, init) =>
          phase === 'headers'
            ? new Promise((_resolve, reject) =>
                init.signal.addEventListener('abort', () =>
                  reject(new Error('fake-pass &+')),
                ),
              )
            : new Response(
                new ReadableStream({
                  start(c) {
                    c.enqueue(new TextEncoder().encode('{'));
                  },
                }),
              ),
      });
      const run = s.client.collections();
      await settle();
      fire();
      assert.deepEqual(await run, { ok: false, kind: 'search_timeout' });
    },
  );
}

for (const [index, response] of [
  () => new Response('bad JSON'),
  () => json({}, 302),
  () => json({}, 429),
  () => json({}, 500),
  () => {
    throw new Error('fake-pass &+ fake-token-A');
  },
  () => new Response('x'.repeat(4194305)),
  () => new Response('{}', { headers: { 'content-length': '4194305' } }),
].entries()) {
  test(`[up42-source-018] gives a fixed failure for transport case ${index}`, async () => {
    const s = setup({ respond: response });
    assert.deepEqual(await s.client.collections(), {
      ok: false,
      kind: 'upstream_failed',
    });
    assert.equal(s.calls[0].init.redirect, 'error');
  });
}

test('[up42-source-018] accepts exactly 4194304 response bytes', async () => {
  const s = setup({
    respond: () => new Response('{"pad":"' + 'x'.repeat(4194294) + '"}'),
  });
  const result = await s.client.collections();
  assert.equal(result.ok, true);
  assert.equal(result.value.pad.length, 4194294);
});
for (const [index, value] of [
  null,
  7,
  {},
  { access_token: '', expires_in: 300 },
  { access_token: 1, expires_in: 300 },
  { access_token: 'bad token', expires_in: 300 },
  { access_token: 'fake-token-A', expires_in: '300' },
  { access_token: 'fake-token-A', expires_in: 0 },
].entries()) {
  test(`[up42-source-018] refuses token document case ${index}`, async () => {
    const s = setup({ respond: () => json(value) });
    assert.deepEqual(await s.client.search('oneatlas', {}), {
      ok: false,
      kind: 'upstream_failed',
    });
    assert.equal(s.calls.length, 1);
  });
}

test('[up42-source-024] records only the literal allowed request forms', async () => {
  const all = [];
  for (const status of [200, 400, 401, 403, 429, 500, 542, 302]) {
    const s = setup({
      respond: (url, init) => {
        assert.equal(
          (url ===
            'https://auth.up42.com/realms/public/protocol/openid-connect/token' &&
            init.method === 'POST') ||
            (url ===
              'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100' &&
              init.method === 'GET') ||
            (/^https:\/\/api\.up42\.com\/catalog\/hosts\/[a-z0-9][a-z0-9-]{0,63}\/stac\/search$/.test(
              url,
            ) &&
              init.method === 'POST'),
          true,
        );
        return url === COLLECTIONS
          ? json({ content: [collection()] })
          : url === TOKEN
            ? token()
            : json({ features: [] }, status);
      },
    });
    await s.search(input());
    all.push(...s.calls);
  }
  assert.ok(all.length > 20);
  for (const { url, init } of all) {
    const permitted =
      (url ===
        'https://auth.up42.com/realms/public/protocol/openid-connect/token' &&
        init.method === 'POST') ||
      (url ===
        'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100' &&
        init.method === 'GET') ||
      (/^https:\/\/api\.up42\.com\/catalog\/hosts\/[a-z0-9][a-z0-9-]{0,63}\/stac\/search$/.test(
        url,
      ) &&
        init.method === 'POST');
    assert.equal(permitted, true, `${init.method} ${url}`);
  }
});

test('[up42-source-024] excludes all forbidden source literals', async () => {
  const root = new URL('../../server/providers/', import.meta.url);
  const paths = [
    'up42.js',
    ...(await readdir(new URL('up42/', root)))
      .filter((name) => name.endsWith('.js'))
      .map((name) => `up42/${name}`),
  ];
  assert.equal(paths.length, 6);
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

test('[up42-source-013] stops after a refused new login', async () => {
  let logins = 0;
  const s = setup({
    respond: (url) =>
      url === TOKEN
        ? ++logins === 1
          ? token()
          : json({}, 400)
        : json({}, 401),
  });
  assert.deepEqual(await s.client.search('oneatlas', {}), {
    ok: false,
    kind: 'credentials_rejected',
  });
  assert.equal(s.calls.length, 3);
});

test('[up42-source-012] encodes absent credentials as empty form values', async () => {
  const s = setup({
    env: { UP42_USERNAME: undefined, UP42_PASSWORD: undefined },
    respond: () => json({}, 400),
  });
  assert.deepEqual(await s.client.search('oneatlas', {}), {
    ok: false,
    kind: 'credentials_rejected',
  });
  assert.deepEqual(
    Object.fromEntries(new URLSearchParams(s.calls[0].init.body)),
    {
      grant_type: 'password',
      client_id: 'up42-api',
      username: '',
      password: '',
    },
  );
  assert.equal(s.client.isSafe({ value: 'public' }), true);
});

test('[up42-source-023] refuses a password in a scene field', async () => {
  const s = setup();
  assert.equal(s.client.isSafe({ provider: 'fake-pass &+' }), false);
  await s.client.search('oneatlas', {});
  assert.equal(s.client.isSafe({ provider: 'fake-token-A' }), false);
  assert.equal(s.client.isSafe({ provider: 'public' }), true);
});

test('[up42-source-018] refuses a public list 401 without a login', async () => {
  const s = setup({ respond: () => json({ message: 'fake-pass &+' }, 401) });
  assert.deepEqual(await s.search(input()), {
    ok: false,
    kind: 'upstream_failed',
  });
  assert.deepEqual(
    s.calls.map((c) => [c.url, c.init.method]),
    [
      [
        'https://api.up42.com/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100',
        'GET',
      ],
    ],
  );
});

test('[up42-source-015] uses distinct box and date values from the request', async () => {
  const s = setup();
  await s.search(
    input({
      box: [-1.5, 2.25, -1.25, 2.5],
      start: '2025-01-02',
      end: '2025-02-03',
      maxCloud: 100,
    }),
  );
  assert.deepEqual(JSON.parse(s.calls.at(-1).init.body), {
    collections: ['pneo'],
    datetime: '2025-01-02T00:00:00.000Z/2025-02-03T23:59:59.999Z',
    intersects: {
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
    limit: 50,
    query: { cloudCoverage: { LTE: 100 } },
  });
});

test('[up42-source-017] keeps all scenes from distinct good hosts beside failures', async () => {
  const feature = (id, collection, cloudCoverage) => ({
    properties: {
      id,
      collection,
      datetime: '2026-10-01T00:00:00Z',
      cloudCoverage,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [1.1, 2],
          [1.1, 2.1],
          [1, 2],
        ],
      ],
    },
  });
  const s = setup({
    respond: (url) => {
      if (url === COLLECTIONS)
        return json({
          content: [
            collection(),
            collection('skysat', 'planet', false),
            collection('bad', 'broken'),
          ],
        });
      if (url === TOKEN) return token();
      if (url === SEARCH)
        return json({
          features: [
            feature('first', 'pneo', 3),
            feature('second', 'pneo', 7),
            null,
          ],
        });
      if (url === 'https://api.up42.com/catalog/hosts/planet/stac/search')
        return json({ features: [feature('third', 'skysat', 11)] });
      return json({}, 542);
    },
  });
  const answer = await s.search(input());
  assert.deepEqual(
    answer.scenes.map(({ id, host, collection, cloudPercent, thumbnail }) => ({
      id,
      host,
      collection,
      cloudPercent,
      thumbnail,
    })),
    [
      {
        id: 'first',
        host: 'oneatlas',
        collection: 'pneo',
        cloudPercent: 3,
        thumbnail: true,
      },
      {
        id: 'second',
        host: 'oneatlas',
        collection: 'pneo',
        cloudPercent: 7,
        thumbnail: true,
      },
      {
        id: 'third',
        host: 'planet',
        collection: 'skysat',
        cloudPercent: 11,
        thumbnail: false,
      },
    ],
  );
  assert.deepEqual(answer.failedHosts, ['broken']);
  assert.equal(answer.dropped, 1);
  assert.equal(answer.truncated, false);
});

test('[up42-source-014] refuses a host with a final line break', async () => {
  const s = setup({
    respond: () => json({ content: [collection('pneo', 'oneatlas\n')] }),
  });
  assert.deepEqual(await s.search(input()), {
    ok: false,
    kind: 'upstream_failed',
  });
  assert.equal(s.calls.length, 1);
  assert.deepEqual(await s.client.search('oneatlas\n', {}), {
    ok: false,
    kind: 'upstream_failed',
  });
  assert.equal(s.calls.length, 1);
});

test('[up42-source-018] refuses a token with a final line break', async () => {
  const s = setup({ respond: () => token('fake-token-A\n') });
  assert.deepEqual(await s.client.search('oneatlas', {}), {
    ok: false,
    kind: 'upstream_failed',
  });
  assert.equal(s.calls.length, 1);
});

test('[up42-source-023] checks secrets in JSON text', async () => {
  const s = setup({ env: { UP42_PASSWORD: 'fake-quote"pass' } });
  assert.equal(s.client.isSafe({ provider: 'fake-quote"pass' }), false);
  assert.equal(s.client.isSafe({ provider: 'public' }), true);
});

test('[up42-source-014] removes bad hosts before it calls the client', async () => {
  const calls = [];
  const run = createSearch(
    {
      collections: async () => ({
        ok: true,
        value: { content: [collection('bad', '../bad'), collection()] },
      }),
      search: async (host, body) => {
        calls.push({ host, body });
        return { ok: true, value: { features: [] } };
      },
    },
    () => 1,
  );
  assert.deepEqual(await run(input()), {
    ok: true,
    scenes: [],
    dropped: 0,
    truncated: false,
    failedHosts: [],
  });
  assert.deepEqual(
    calls.map(({ host, body }) => [host, body.collections]),
    [['oneatlas', ['pneo']]],
  );
});

test('[up42-source-018] refuses a valid JSON body of 4194305 bytes', async () => {
  const s = setup({
    respond: () => new Response('{"pad":"' + 'x'.repeat(4194295) + '"}'),
  });
  assert.deepEqual(await s.client.collections(), {
    ok: false,
    kind: 'upstream_failed',
  });
});

test('[up42-source-012] keeps spaces at both ends of the password', async () => {
  const s = setup({ env: { UP42_PASSWORD: ' test-pass ' } });
  assert.equal((await s.client.search('oneatlas', {})).ok, true);
  assert.equal(
    new URLSearchParams(s.calls[0].init.body).get('password'),
    ' test-pass ',
  );
});

test('[up42-source-013] uses the token lifetime from the answer', async () => {
  const s = setup({
    respond: (url) =>
      url === TOKEN ? token('fake-short-token', 180) : json({ features: [] }),
  });
  assert.equal((await s.client.search('oneatlas', {})).ok, true);
  s.clock.value += 119999;
  assert.equal((await s.client.search('oneatlas', {})).ok, true);
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 1);
  s.clock.value += 1;
  assert.equal((await s.client.search('oneatlas', {})).ok, true);
  assert.equal(s.calls.filter((c) => c.url === TOKEN).length, 2);
});

for (const [index, [point, status, kind]] of [
  ['token', 400, 'credentials_rejected'],
  ['token', 401, 'credentials_rejected'],
  ['api', 401, 'upstream_failed'],
  ['collections', 503, 'upstream_failed'],
].entries()) {
  for (const cancelFails of [false, true]) {
    test(
      `[up42-source-026] discards an error body case ${index} with cancel failure ${cancelFails}`,
      { timeout: 3000 },
      async () => {
        const timers = new Set();
        const errorTimers = new Set();
        const events = [];
        let next = 0;
        const s = setup({
          setTimer: (_fn, ms) => {
            assert.equal(ms, 15000);
            timers.add(++next);
            return next;
          },
          clearTimer: (id) => {
            timers.delete(id);
            if (errorTimers.has(id)) events.push('clear');
          },
          respond: (url) => {
            if (url === TOKEN && point !== 'token') return token();
            errorTimers.add(next);
            return new Response(
              new ReadableStream({
                async cancel() {
                  events.push(['cancel', timers.size]);
                  await settle();
                  events.push('discard');
                  if (cancelFails) throw new Error('fake-pass &+');
                },
              }),
              { status },
            );
          },
        });
        const result =
          point === 'collections'
            ? await s.client.collections()
            : await s.client.search('oneatlas', {});
        assert.deepEqual(result, { ok: false, kind });
        const attempts = point === 'api' ? 2 : 1;
        assert.equal(events.filter((e) => Array.isArray(e)).length, attempts);
        for (let i = 0; i < attempts; i++)
          assert.deepEqual(events.slice(-3 * (i + 1), events.length - 3 * i), [
            ['cancel', 1],
            'discard',
            'clear',
          ]);
        assert.equal(timers.size, 0);
      },
    );
  }
}

test('[up42-source-026] accepts an error response with no body', async () => {
  const s = setup({ respond: () => new Response(null, { status: 503 }) });
  assert.deepEqual(await s.client.collections(), {
    ok: false,
    kind: 'upstream_failed',
  });
});

// The probe gives host names and counts; collection names below are test fixtures.
const probeCollections = () => [
  collection('hd', 'vantor-hd'),
  collection('v', 'vantor'),
  collection('elevation', 'airbus-elevation'),
  collection('3d-a', 'vantor-3d'),
  collection('3d-b', 'vantor-3d'),
  collection('3d-c', 'vantor-3d'),
  collection('vexcel-a', 'vexcel-v2'),
  collection('vexcel-b', 'vexcel-v2'),
  collection('vexcel-c', 'vexcel-v2'),
  collection('vexcel-d', 'vexcel-v2'),
  collection('vexcel-e', 'vexcel-v2'),
  collection('oblique', 'vexcel-v2-oblique'),
  collection('21', '21at'),
  collection('pneo', 'oneatlas'),
  collection('sky', 'planet'),
  collection('earth', 'earthsearch-aws'),
  collection('advanced', 'oneatlas-advanced'),
  collection('inter', 'intermap'),
  collection('hex', 'hexagon'),
  collection('capella', 'capellaspace'),
  collection('spectra', 'spectra'),
];
const sceneFeature = (id, name, resolution) => ({
  properties: {
    id,
    collection: name,
    datetime: '2026-10-01T00:00:00Z',
    resolution,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [1, 2],
        [1.1, 2],
        [1.1, 2.1],
        [1, 2],
      ],
    ],
  },
});

test('[up42-source-028] splits both restricted hosts and merges their scenes', async () => {
  const s = setup({
    respond: (url, init) => {
      if (url === TOKEN) return token();
      if (url === COLLECTIONS)
        return json({
          content: [
            collection('3d-a', 'vantor-3d'),
            collection('3d-b', 'vantor-3d'),
            collection('vexcel-a', 'vexcel-v2'),
            collection('vexcel-b', 'vexcel-v2'),
            collection('pneo'),
            collection('phr'),
          ],
        });
      const names = JSON.parse(init.body).collections;
      // A multi-collection request to these two hosts is refused, as in the probe.
      if (!url.includes('/oneatlas/') && names.length !== 1)
        return json({}, 422);
      return json({
        features: names.map((name) =>
          sceneFeature(
            name,
            name,
            name === '3d-a'
              ? 1
              : name === '3d-b'
                ? 2
                : name === 'vexcel-a'
                  ? 3
                  : name === 'vexcel-b'
                    ? 4
                    : name === 'pneo'
                      ? 5
                      : 6,
          ),
        ),
      });
    },
  });
  const answer = await s.search(
    input({
      collections: ['phr', 'vexcel-b', '3d-b', 'pneo', 'vexcel-a', '3d-a'],
      maxCloud: 17,
    }),
  );
  assert.equal(answer.ok, true);
  assert.equal(answer.truncated, false);
  assert.deepEqual(answer.failedHosts, []);
  assert.equal(answer.dropped, 0);
  assert.deepEqual(
    answer.scenes.map(({ id, host, collection, resolutionM }) => [
      id,
      host,
      collection,
      resolutionM,
    ]),
    [
      ['3d-a', 'vantor-3d', '3d-a', 1],
      ['3d-b', 'vantor-3d', '3d-b', 2],
      ['vexcel-a', 'vexcel-v2', 'vexcel-a', 3],
      ['vexcel-b', 'vexcel-v2', 'vexcel-b', 4],
      ['pneo', 'oneatlas', 'pneo', 5],
      ['phr', 'oneatlas', 'phr', 6],
    ],
  );
  const calls = s.calls.filter((c) => c.url.includes('/catalog/'));
  assert.equal(calls.length, 5);
  assert.deepEqual(
    calls.map((c) => c.url),
    [
      'https://api.up42.com/catalog/hosts/vantor-3d/stac/search',
      'https://api.up42.com/catalog/hosts/vantor-3d/stac/search',
      'https://api.up42.com/catalog/hosts/vexcel-v2/stac/search',
      'https://api.up42.com/catalog/hosts/vexcel-v2/stac/search',
      'https://api.up42.com/catalog/hosts/oneatlas/stac/search',
    ],
  );
  for (const [index, names] of [
    ['3d-a'],
    ['3d-b'],
    ['vexcel-a'],
    ['vexcel-b'],
    ['pneo', 'phr'],
  ].entries()) {
    assert.equal(calls[index].init.method, 'POST');
    assert.deepEqual(JSON.parse(calls[index].init.body), {
      collections: names,
      datetime: '2026-10-01T00:00:00.000Z/2026-10-20T23:59:59.999Z',
      intersects: {
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
      limit: 50,
      query: { cloudCoverage: { LTE: 17 } },
    });
  }
});

test('[up42-source-029] searches all fifteen hosts with twenty-one calls', async () => {
  const s = setup({
    respond: (url) =>
      url === COLLECTIONS
        ? json({ content: probeCollections() })
        : url === TOKEN
          ? token()
          : json({ type: 'FeatureCollection', features: [], links: [] }),
  });
  const answer = await s.search(input());
  assert.deepEqual(answer, {
    ok: true,
    scenes: [],
    dropped: 0,
    truncated: false,
    failedHosts: [],
  });
  const calls = s.calls.filter((c) => c.url.includes('/catalog/'));
  assert.equal(calls.length, 21);
  assert.deepEqual(
    calls.map((c) => new URL(c.url).pathname.split('/')[3]),
    [
      'vantor-hd',
      'vantor',
      'airbus-elevation',
      'vantor-3d',
      'vantor-3d',
      'vantor-3d',
      'vexcel-v2',
      'vexcel-v2',
      'vexcel-v2',
      'vexcel-v2',
      'vexcel-v2',
      'vexcel-v2-oblique',
      '21at',
      'oneatlas',
      'planet',
      'earthsearch-aws',
      'oneatlas-advanced',
      'intermap',
      'hexagon',
      'capellaspace',
      'spectra',
    ],
  );
});

for (const [index, failure] of ['status', 'page', 'timeout'].entries()) {
  test(`[up42-source-030] keeps good scenes of a partial host case ${index}`, async () => {
    const client = {
      collections: async () => ({
        ok: true,
        value: {
          content: [
            collection('3d-a', 'vantor-3d'),
            collection('3d-b', 'vantor-3d'),
          ],
        },
      }),
      search: async (_host, body) =>
        body.collections[0] === '3d-a'
          ? failure === 'page'
            ? { ok: true, value: null }
            : {
                ok: false,
                kind:
                  failure === 'timeout' ? 'search_timeout' : 'upstream_failed',
              }
          : {
              ok: true,
              value: { features: [sceneFeature('kept', '3d-b', 2), null] },
            },
    };
    const answer = await createSearch(client, () => 0)(input());
    assert.equal(answer.ok, true);
    assert.deepEqual(
      answer.scenes.map(({ id, collection, host, resolutionM }) => [
        id,
        collection,
        host,
        resolutionM,
      ]),
      [['kept', '3d-b', 'vantor-3d', 2]],
    );
    assert.equal(answer.truncated, true);
    assert.equal(answer.dropped, 1);
    assert.deepEqual(answer.failedHosts, []);
  });
}

test('[up42-source-031] lists a failed restricted host once beside good scenes', async () => {
  const s = setup({
    respond: (url, init) => {
      if (url === COLLECTIONS)
        return json({
          content: [
            collection('3d-a', 'vantor-3d'),
            collection('3d-b', 'vantor-3d'),
            collection('pneo'),
            collection('new-a', 'new-host'),
            collection('new-b', 'new-host'),
          ],
        });
      if (url === TOKEN) return token();
      if (url === SEARCH)
        return json({ features: [sceneFeature('kept', 'pneo', 7)] });
      if (url.includes('/new-host/'))
        assert.deepEqual(JSON.parse(init.body).collections, ['new-a', 'new-b']);
      return json({ message: 'Multiple collections are not allowed' }, 422);
    },
  });
  const answer = await s.search(input());
  assert.equal(answer.ok, true);
  assert.deepEqual(answer.failedHosts, ['vantor-3d', 'new-host']);
  assert.deepEqual(
    answer.scenes.map((row) => row.id),
    ['kept'],
  );
  assert.equal(answer.truncated, false);
  assert.equal(s.calls.filter((c) => c.url.includes('/catalog/')).length, 4);
});

test('[up42-source-031] returns one host name when all restricted calls fail', async () => {
  const client = {
    collections: async () => ({
      ok: true,
      value: {
        content: [
          collection('3d-a', 'vantor-3d'),
          collection('3d-b', 'vantor-3d'),
        ],
      },
    }),
    search: async () => ({ ok: false, kind: 'upstream_failed' }),
  };
  assert.deepEqual(await createSearch(client, () => 0)(input()), {
    ok: false,
    kind: 'upstream_failed',
    failedHosts: ['vantor-3d'],
  });
});

for (const [index, kind] of [
  'credentials_rejected',
  'search_timeout',
].entries()) {
  test(`[up42-source-017] keeps the fixed aggregate failure case ${index}`, async () => {
    const client = {
      collections: async () => ({
        ok: true,
        value: {
          content: [
            collection('3d-a', 'vantor-3d'),
            collection('3d-b', 'vantor-3d'),
            collection('pneo'),
          ],
        },
      }),
      search: async (host) =>
        host === 'oneatlas'
          ? { ok: false, kind: 'upstream_failed' }
          : { ok: false, kind },
    };
    assert.deepEqual(await createSearch(client, () => 0)(input()), {
      ok: false,
      kind,
      failedHosts: ['vantor-3d', 'oneatlas'],
    });
  });
}

test('[up42-source-032] counts each restricted call within the four-call limit', async () => {
  let active = 0;
  let maximum = 0;
  const starts = [];
  const releases = [];
  const client = {
    collections: async () => ({
      ok: true,
      value: {
        content: [
          collection('a', 'vexcel-v2'),
          collection('b', 'vexcel-v2'),
          collection('c', 'vexcel-v2'),
          collection('d', 'vexcel-v2'),
          collection('e', 'vexcel-v2'),
          collection('pneo'),
        ],
      },
    }),
    search: async (host, body) => {
      starts.push([host, body.collections]);
      active++;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => releases.push(resolve));
      active--;
      return { ok: true, value: { features: [] } };
    },
  };
  assert.deepEqual(starts, []);
  const run = createSearch(client, () => 0)(input());
  await settle();
  const first = starts.slice();
  const firstActive = active;
  // Release before assertions, so a fault cannot leave the search pending.
  for (let i = 0; i < 6; i++) {
    releases.splice(0).forEach((release) => release());
    await settle();
  }
  assert.equal((await run).ok, true);
  assert.equal(firstActive, 4);
  assert.deepEqual(first, [
    ['vexcel-v2', ['a']],
    ['vexcel-v2', ['b']],
    ['vexcel-v2', ['c']],
    ['vexcel-v2', ['d']],
  ]);
  assert.deepEqual(starts, [
    ['vexcel-v2', ['a']],
    ['vexcel-v2', ['b']],
    ['vexcel-v2', ['c']],
    ['vexcel-v2', ['d']],
    ['vexcel-v2', ['e']],
    ['oneatlas', ['pneo']],
  ]);
  assert.equal(maximum, 4);
});

for (const [index, count, expectedCalls, truncated] of [
  [0, 24, 24, false],
  [1, 25, 24, true],
]) {
  test(`[up42-source-016] caps restricted calls in map order case ${index}`, async () => {
    const calls = [];
    const client = {
      collections: async () => ({
        ok: true,
        value: {
          content: Array.from({ length: count }, (_, i) =>
            collection(`c${i}`, 'vexcel-v2'),
          ),
        },
      }),
      search: async (host, body) => {
        calls.push([host, body.collections]);
        return { ok: true, value: { features: [] } };
      },
    };
    const answer = await createSearch(client, () => 0)(input());
    assert.equal(answer.ok, true);
    assert.equal(answer.truncated, truncated);
    assert.deepEqual(answer.failedHosts, []);
    assert.equal(calls.length, expectedCalls);
    assert.deepEqual(calls[0], ['vexcel-v2', ['c0']]);
    assert.deepEqual(calls.at(-1), ['vexcel-v2', ['c23']]);
  });
}
