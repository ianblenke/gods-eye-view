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
          collections: ['phr', 'pneo'],
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

for (const [index, [hosts, links, expected]] of [
  [11, [], true],
  [10, [], false],
  [1, [{ rel: 'next', href: 'https://untrusted.invalid/page' }], true],
  [1, [{ rel: 'self' }], false],
  [1, undefined, false],
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
      Math.min(hosts, 10),
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
