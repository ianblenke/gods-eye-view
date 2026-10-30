import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import {
  createGhostMapsWatcher,
  ghostMapsPollMs,
  ghostMapsProxy,
} from './ghostMaps.js';

const MASTER =
  'ArcGIS Data for ATAK (KMZs)/Common Intelligence Picture/Master Database/';
const KINETIC =
  'ArcGIS Data for ATAK (KMZs)/Common Intelligence Picture/30-Day Pulls/Kinetic_Activities_Last_30_Days.kmz';
const sha = (c) => c.repeat(40);

/** A fake GitHub: ref advertisement, tree, commit and raw files. */
function fakeGitHub() {
  const repo = { head: sha('1'), trees: new Map(), calls: [] };
  repo.trees.set(sha('1'), [
    {
      path: `${MASTER}S2U_Common_Intelligence_Picture_October_15_2026_Export_1.kmz`,
      type: 'blob',
      size: 4,
      sha: sha('a'),
    },
    { path: KINETIC, type: 'blob', size: 4, sha: sha('b') },
  ]);
  const body = (text, status = 200) =>
    new Response(text, {
      status,
      headers: { 'content-length': String(Buffer.byteLength(text)) },
    });
  const fetchImpl = async (url) => {
    repo.calls.push(url);
    if (url.endsWith('/info/refs?service=git-upload-pack'))
      return body(
        `001e# service=git-upload-pack\n0000\n003d${repo.head} refs/heads/main\n0000`,
      );
    const tree = /git\/trees\/([0-9a-f]{40})/.exec(url);
    if (tree) return body(JSON.stringify({ tree: repo.trees.get(tree[1]) }));
    if (/\/commits\//.test(url))
      return body(
        JSON.stringify({
          commit: {
            message: 'Oct 18 Update\nmore',
            committer: { date: '2026-10-18T00:00:00Z' },
          },
        }),
      );
    if (url.startsWith('https://raw.githubusercontent.com/'))
      return body('KMZ!');
    return body('nope', 404);
  };
  return { repo, fetchImpl };
}

async function withCache(fn) {
  const root = path.join(process.cwd(), '.gev-cache');
  await mkdir(root, { recursive: true });
  const dir = await mkdtemp(path.join(root, 'ghostmaps-test-'));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// checkNow announces the catalog before background warm-up finishes. Join the
// same file reads before changing editions or removing the temporary cache.
async function warmDefaults(watcher) {
  await Promise.all(
    watcher
      .catalog()
      .products.filter((product) => product.defaultOn)
      .map((product) => watcher.file(product.id)),
  );
}

test('[ghostmaps-014] a new commit is announced once, naming only the products that changed', () =>
  withCache(async (cacheDir) => {
    const { repo, fetchImpl } = fakeGitHub();
    const watcher = createGhostMapsWatcher({
      fetchImpl,
      cacheDir,
      log: () => {},
      warn: () => {},
    });
    const events = [];
    watcher.subscribe((catalog) => events.push(catalog));

    assert.equal(await watcher.checkNow(), true);
    await warmDefaults(watcher);
    const first = watcher.catalog();
    assert.equal(first.commit, '1111111111111111111111111111111111111111');
    assert.equal(first.message, 'Oct 18 Update');
    assert.deepEqual(
      first.products.map((p) => p.id),
      ['cip', 'kinetic-30d'],
    );
    assert.equal(events.length, 1);
    assert.equal(events[0].commit, '1111111111111111111111111111111111111111');
    assert.deepEqual(
      events[0].products.map(({ id, version, fileTitle }) => ({
        id,
        version,
        fileTitle,
      })),
      [
        {
          id: 'cip',
          version: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          fileTitle: 'S2U Common Intelligence Picture October 15 2026 Export 1',
        },
        {
          id: 'kinetic-30d',
          version: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          fileTitle: 'Kinetic Activities Last 30 Days',
        },
      ],
    );

    // Same head: one ref read, no REST calls, no event.
    repo.calls.length = 0;
    assert.equal(await watcher.checkNow(), false);
    assert.equal(repo.calls.length, 1);
    assert.equal(events.length, 1);

    // A new upload: the CIP gets a newer edition, the 30-day pull is untouched.
    repo.head = sha('2');
    repo.trees.set(sha('2'), [
      ...repo.trees.get(sha('1')),
      {
        path: `${MASTER}S2U_Common_Intelligence_Picture_October_18_2026_Export_1.kmz`,
        type: 'blob',
        size: 4,
        sha: sha('c'),
      },
    ]);
    assert.equal(await watcher.checkNow(), true);
    await warmDefaults(watcher);
    assert.equal(events.length, 2);
    assert.equal(events[1].commit, '2222222222222222222222222222222222222222');
    assert.deepEqual(
      events[1].products.map(({ id, version, fileTitle }) => ({
        id,
        version,
        fileTitle,
      })),
      [
        {
          id: 'cip',
          version: 'cccccccccccccccccccccccccccccccccccccccc',
          fileTitle: 'S2U Common Intelligence Picture October 18 2026 Export 1',
        },
        {
          id: 'kinetic-30d',
          version: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          fileTitle: 'Kinetic Activities Last 30 Days',
        },
      ],
    );
    const cip = events[1].products.find((p) => p.id === 'cip');
    assert.equal(cip.version, 'cccccccccccccccccccccccccccccccccccccccc');
    assert.match(cip.fileName, /October_18/);
    assert.equal(
      events[1].products.find((p) => p.id === 'kinetic-30d').version,
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    );
    // Repository paths stay on the server.
    assert.equal('path' in cip, false);
    watcher.stop();
  }));

test('[ghostmaps-015] files download by commit-pinned URL, cache by blob, and stale blobs are pruned', () =>
  withCache(async (cacheDir) => {
    const { repo, fetchImpl } = fakeGitHub();
    const watcher = createGhostMapsWatcher({
      fetchImpl,
      cacheDir,
      log: () => {},
      warn: () => {},
    });
    await watcher.checkNow();
    const found = await watcher.file('kinetic-30d');
    assert.equal(found.bytes.toString(), 'KMZ!');
    const raw = repo.calls.filter((url) =>
      url.includes('raw.githubusercontent'),
    );
    assert.ok(
      raw.every((url) =>
        url.includes('/GhostMaps/1111111111111111111111111111111111111111/'),
      ),
    );
    assert.ok(
      raw.some((url) => url.endsWith('/Kinetic_Activities_Last_30_Days.kmz')),
    );
    const before = repo.calls.length;
    await watcher.file('kinetic-30d');
    assert.equal(repo.calls.length, before, 'second read comes from disk');
    assert.equal(await watcher.file('not-a-product'), null);

    // When the edition changes, the old blob leaves the disk cache.
    await watcher.file('cip');
    repo.head = sha('2');
    repo.trees.set(sha('2'), [
      {
        path: `${MASTER}S2U_Common_Intelligence_Picture_October_18_2026_Export_1.kmz`,
        type: 'blob',
        size: 4,
        sha: sha('c'),
      },
      { path: KINETIC, type: 'blob', size: 4, sha: sha('b') },
    ]);
    await watcher.checkNow();
    await watcher.file('cip');
    const files = (await readdir(path.join(cacheDir, 'files'))).sort();
    assert.deepEqual(files, [
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.kmz',
      'cccccccccccccccccccccccccccccccccccccccc.kmz',
    ]);
    watcher.stop();
  }));

test('[ghostmaps-016] the catalog survives a restart from disk, and upstream failures are reported', () =>
  withCache(async (cacheDir) => {
    const { fetchImpl } = fakeGitHub();
    const quiet = { log: () => {}, warn: () => {} };
    const online = createGhostMapsWatcher({ fetchImpl, cacheDir, ...quiet });
    await online.checkNow();
    await warmDefaults(online);
    const offline = createGhostMapsWatcher({
      fetchImpl: async () => new Response('down', { status: 503 }),
      cacheDir,
      ...quiet,
    });
    assert.equal(await offline.checkNow(), false);
    const catalog = offline.catalog();
    assert.equal(catalog.commit, '1111111111111111111111111111111111111111');
    assert.deepEqual(catalog.products, [
      {
        id: 'cip',
        title: 'Common Intelligence Picture',
        defaultOn: true,
        fileName:
          'S2U_Common_Intelligence_Picture_October_15_2026_Export_1.kmz',
        fileTitle: 'S2U Common Intelligence Picture October 15 2026 Export 1',
        version: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        size: 4,
        dateMs: 1792022400000,
      },
      {
        id: 'kinetic-30d',
        title: 'Kinetic Activity (30 days)',
        defaultOn: true,
        fileName: 'Kinetic_Activities_Last_30_Days.kmz',
        fileTitle: 'Kinetic Activities Last 30 Days',
        version: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        size: 4,
        dateMs: null,
      },
    ]);
    assert.match(catalog.error, /HTTP 503/);
  }));

test('[ghostmaps-017] an unchanged head clears an upstream outage and announces recovery once', () =>
  withCache(async (cacheDir) => {
    const { fetchImpl } = fakeGitHub();
    let unavailable = false;
    let checkedAt = 1000;
    const requests = [];
    const watcher = createGhostMapsWatcher({
      cacheDir,
      now: () => checkedAt,
      fetchImpl: async (url, options) => {
        requests.push(url);
        if (unavailable) return new Response('down', { status: 503 });
        return fetchImpl(url, options);
      },
      log: () => {},
      warn: () => {},
    });
    const events = [];
    watcher.subscribe((catalog) => events.push(catalog));
    await watcher.checkNow();
    await Promise.all([watcher.file('cip'), watcher.file('kinetic-30d')]);
    const healthy = watcher.catalog();
    assert.equal(events.length, 1);

    unavailable = true;
    checkedAt = 2000;
    assert.equal(await watcher.checkNow(), false);
    assert.match(watcher.catalog().error, /HTTP 503/);
    assert.equal(events.length, 2);

    unavailable = false;
    checkedAt = 3000;
    requests.length = 0;
    assert.equal(await watcher.checkNow(), false, 'no new edition arrived');
    const recovered = watcher.catalog();
    assert.equal(recovered.error, null);
    assert.equal(recovered.checkedAt, 3000);
    assert.equal(recovered.commit, '1'.repeat(40));
    assert.equal(recovered.changedAt, 1000);
    assert.deepEqual(recovered.products, healthy.products);
    assert.equal(requests.length, 1, 'recovery needs only the ref read');
    assert.match(requests[0], /\/info\/refs\?service=git-upload-pack$/);
    assert.equal(events.length, 3, 'subscribers see the recovered catalog');
    assert.equal(events[2].error, null);
    assert.equal(events[2].checkedAt, 3000);

    checkedAt = 4000;
    assert.equal(await watcher.checkNow(), false);
    assert.equal(events.length, 3, 'healthy unchanged polls stay silent');
    watcher.stop();
  }));

test('[ghostmaps-018] poll interval is configurable with a 5 s floor', () => {
  assert.equal(ghostMapsPollMs(undefined), 15000);
  assert.equal(ghostMapsPollMs('30'), 30000);
  assert.equal(ghostMapsPollMs('1'), 5000);
  assert.equal(ghostMapsPollMs('soon'), 15000);
});

test('[ghostmaps-019] routes: unknown paths and methods are refused without contacting GitHub', async () => {
  let started = 0;
  const watcher = {
    start: () => {
      started += 1;
      return Promise.resolve(false);
    },
    catalog: () => ({ commit: sha('1'), products: [] }),
    file: async () => null,
    subscribe: () => () => {},
    subscribers: () => 0,
  };
  let handler;
  ghostMapsProxy({ watcher }).configureServer({
    middlewares: { use: (_route, fn) => (handler = fn) },
  });
  const call = async (method, url) => {
    const res = {
      destroyed: false,
      writeHead(status, headers) {
        this.status = status;
        this.headers = headers;
      },
      end(body) {
        this.body = String(body ?? '');
      },
    };
    await handler({ method, url }, res);
    return res;
  };
  assert.equal((await call('GET', '/nope')).status, 404);
  assert.equal((await call('POST', '/catalog')).status, 405);
  assert.equal((await call('GET', '/file/../../etc')).status, 404);
  assert.equal(started, 0);
  assert.equal((await call('GET', '/file/cip')).status, 404);
  const catalog = await call('GET', '/catalog');
  assert.equal(catalog.status, 200);
  assert.equal(
    JSON.parse(catalog.body).commit,
    '1111111111111111111111111111111111111111',
  );
  assert.equal(started, 2);
});

function routeFixture(watcher) {
  let handler;
  const plugin = ghostMapsProxy({ watcher });
  plugin.configurePreviewServer({
    middlewares: {
      use: (route, fn) => {
        assert.equal(route, '/api/ghostmaps');
        handler = fn;
      },
    },
  });
  const call = async (url, options = {}) => {
    const callbacks = {};
    const req = {
      method: 'GET',
      url,
      on: (name, fn) => {
        callbacks[`req:${name}`] = fn;
      },
      ...options,
    };
    const res = {
      destroyed: false,
      chunks: [],
      writeHead(status, headers) {
        this.status = status;
        this.headers = headers;
      },
      write(body) {
        this.chunks.push(body);
      },
      end(body) {
        this.body = body;
      },
      on(name, fn) {
        callbacks[`res:${name}`] = fn;
      },
    };
    await handler(req, res);
    return { req, res, callbacks };
  };
  return { call, plugin };
}
const routeWatcher = (options = {}) => ({
  start: async () => false,
  catalog: () => ({
    commit: 'a',
    products: [
      { id: 'cip', version: 'one' },
      { id: 'kinetic-30d', version: 'two' },
    ],
  }),
  file: async () => ({
    product: { version: 'blob' },
    bytes: Buffer.from('KMZ!'),
  }),
  subscribe: () => () => {},
  subscribers: () => 0,
  ...options,
});

test('[ghostmaps-036] The proxy serves current file bytes and cache headers', async () => {
  const { call } = routeFixture(routeWatcher());
  const pinned = (await call('/file/cip?v=blob')).res;
  assert.equal(pinned.status, 200);
  assert.equal(pinned.body.toString(), 'KMZ!');
  assert.deepEqual(pinned.headers, {
    'Content-Type': 'application/vnd.google-earth.kmz',
    'Content-Length': 4,
    'X-GhostMaps-Version': 'blob',
    'Cache-Control': 'private, max-age=31536000, immutable',
  });
  const current = (await call('/file/cip?v=other')).res;
  assert.equal(current.headers['Cache-Control'], 'no-store');
  const error = (await call('/catalog', { method: 'POST' })).res;
  assert.equal(error.headers.Allow, 'GET');
  assert.equal(JSON.parse(error.body).error, 'method_not_allowed');
  const absent = (await call(undefined)).res;
  assert.equal(absent.status, 404);
  assert.equal(absent.headers.Allow, undefined);
});

test('[ghostmaps-037] The proxy waits for the first catalog and file check', async () => {
  let commit = null;
  const files = [];
  const watcher = routeWatcher({
    catalog: () => ({ commit, products: [] }),
    start: async () => {
      await Promise.resolve();
      commit = 'ready';
    },
    file: async (id) => {
      files.push(id);
      assert.equal(commit, 'ready');
      return null;
    },
  });
  const { call } = routeFixture(watcher);
  assert.equal(JSON.parse((await call('/catalog')).res.body).commit, 'ready');
  commit = null;
  assert.equal((await call('/file/cip')).res.status, 404);
  assert.deepEqual(files, ['cip']);
});

test('[ghostmaps-038] The proxy reports file errors', async () => {
  const { call } = routeFixture(
    routeWatcher({
      file: async () => {
        throw new Error('offline');
      },
    }),
  );
  const { res } = await call('/file/cip');
  assert.equal(res.status, 502);
  assert.equal(JSON.parse(res.body).error, 'ghostmaps_unavailable');
});

test('[ghostmaps-039] A destroyed response does not receive JSON', async () => {
  let handler;
  ghostMapsProxy({ watcher: routeWatcher() }).configureServer({
    middlewares: {
      use: (_route, fn) => {
        handler = fn;
      },
    },
  });
  const calls = [];
  await handler(
    { method: 'POST' },
    {
      destroyed: true,
      writeHead: () => calls.push('head'),
      end: () => calls.push('end'),
    },
  );
  assert.deepEqual(calls, []);
});

test('[ghostmaps-021] The event route sends catalogs heartbeats and close callbacks', async (t) => {
  let heartbeat;
  let delay;
  let unsubscribed = 0;
  let listener;
  const timers = [];
  t.mock.method(globalThis, 'setInterval', (fn, ms) => {
    heartbeat = fn;
    delay = ms;
    return { unref: () => timers.push('unref') };
  });
  t.mock.method(globalThis, 'clearInterval', (timer) => timers.push(timer));
  const { call } = routeFixture(
    routeWatcher({
      subscribe: (fn) => {
        listener = fn;
        return () => unsubscribed++;
      },
    }),
  );
  const { res, callbacks } = await call('/events');
  assert.equal(res.status, 200);
  assert.equal(res.headers['Content-Type'], 'text/event-stream');
  assert.deepEqual(res.chunks, [
    'retry: 5000\n\n',
    'event: catalog\ndata: {"commit":"a","products":[{"id":"cip","version":"one"},{"id":"kinetic-30d","version":"two"}]}\n\n',
  ]);
  listener({
    products: [
      { id: 'cip', version: 'three' },
      { id: 'kinetic-30d', version: 'two' },
    ],
    commit: 'b',
  });
  assert.equal(
    res.chunks.at(-1),
    'event: catalog\ndata: {"products":[{"id":"cip","version":"three"},{"id":"kinetic-30d","version":"two"}],"commit":"b"}\n\n',
  );
  assert.equal(delay, 25000);
  heartbeat();
  assert.equal(res.chunks.at(-1), ': ping\n\n');
  callbacks['req:close']();
  assert.equal(unsubscribed, 1);
  callbacks['res:error']();
  assert.equal(unsubscribed, 2);
  assert.equal(timers[0], 'unref');
  assert.equal(typeof timers[1].unref, 'function');
  assert.equal(timers[2], timers[1]);
});

test('[ghostmaps-064] The event route caps subscribers', async () => {
  const { call } = routeFixture(routeWatcher({ subscribers: () => 64 }));
  const { res } = await call('/events');
  assert.equal(res.status, 429);
  assert.equal(JSON.parse(res.body).error, 'too_many_subscribers');
});

function emptyRemote({
  head = sha('1'),
  tree = [],
  commit = {},
  status = 200,
} = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (status !== 200) return new Response('bad', { status });
    if (url.includes('/info/refs?'))
      return new Response(`003d${head} refs/heads/main`);
    if (url.includes('/git/trees/'))
      return new Response(JSON.stringify({ tree }));
    if (url.includes('/commits/')) return new Response(JSON.stringify(commit));
    return new Response('KMZ!');
  };
  return { calls, fetchImpl };
}

test('[ghostmaps-020] The watcher coalesces checks and follows its start and stop state', (t) =>
  withCache(async (cacheDir) => {
    const timers = [];
    t.mock.method(globalThis, 'setTimeout', (fn, ms) => {
      const timer = {
        fn,
        ms,
        unref() {
          this.unreferenced = true;
        },
      };
      timers.push(timer);
      return timer;
    });
    const cleared = [];
    t.mock.method(globalThis, 'clearTimeout', (timer) => cleared.push(timer));
    const remote = emptyRemote();
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl: remote.fetchImpl,
      pollMs: 7000,
      log() {},
      warn() {},
    });
    const first = watcher.start();
    assert.equal(watcher.start(), first);
    assert.equal(watcher.checkNow(), first);
    assert.equal(await first, true);
    assert.equal(timers.length, 1);
    assert.equal(timers[0].ms, 7000);
    assert.equal(timers[0].unreferenced, true);
    assert.equal(await watcher.start(), false);
    await timers[0].fn();
    assert.equal(timers.length, 2);
    watcher.stop();
    assert.equal(cleared.at(-1), timers[1]);
    assert.equal(cleared.filter((timer) => timer === timers[1]).length, 1);
    await timers[1].fn();
    assert.equal(timers.length, 2);
  }));

test('[ghostmaps-020] The watcher uses bounded failure delays', (t) =>
  withCache(async (cacheDir) => {
    const timers = [];
    t.mock.method(globalThis, 'setTimeout', (fn, ms) => {
      const timer = { fn, ms };
      timers.push(timer);
      return timer;
    });
    const cleared = [];
    t.mock.method(globalThis, 'clearTimeout', (timer) => cleared.push(timer));
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl: emptyRemote({ status: 503 }).fetchImpl,
      log() {},
      warn() {},
    });
    await watcher.start();
    for (let i = 0; i < 5; i++) await timers[i].fn();
    assert.deepEqual(
      timers.map((timer) => timer.ms),
      [15000, 30000, 60000, 120000, 300000, 300000],
    );
    watcher.stop();
    assert.equal(cleared.at(-1), timers[5]);
  }));

for (const [name, token, expected] of [
  ['present', () => 'secret-test', 'Bearer secret-test'],
  ['absent', () => '', undefined],
]) {
  test(`[ghostmaps-052] The API token is ${name}`, () =>
    withCache(async (cacheDir) => {
      const remote = emptyRemote();
      const watcher = createGhostMapsWatcher({
        cacheDir,
        token,
        fetchImpl: remote.fetchImpl,
        log() {},
        warn() {},
      });
      await watcher.checkNow();
      assert.equal(remote.calls[1].options.headers.Authorization, expected);
      assert.equal(remote.calls[0].options.headers.Authorization, undefined);
      assert.equal(remote.calls[0].options.redirect, 'follow');
      assert.ok(remote.calls[0].options.signal instanceof AbortSignal);
    }));
}

for (const [name, saved] of [
  [
    'valid',
    {
      commit: sha('1'),
      products: [
        {
          id: 'saved-product',
          version: 'saved-version',
          title: 'Saved product',
          defaultOn: false,
          fileName: 'saved.kmz',
          fileTitle: 'Saved edition',
          size: 7,
          dateMs: 123,
        },
      ],
      error: 'old',
      message: 'saved',
    },
  ],
  ['invalid commit', { commit: 'bad', products: [], message: 'saved' }],
  ['invalid products', { commit: sha('1'), products: {}, message: 'saved' }],
]) {
  test(`[${name === 'valid' ? 'ghostmaps-016' : 'ghostmaps-057'}] The disk catalog checks ${name} data`, () =>
    withCache(async (cacheDir) => {
      const fsp = await import('node:fs/promises');
      await fsp.writeFile(
        path.join(cacheDir, 'catalog.json'),
        JSON.stringify(saved),
      );
      const watcher = createGhostMapsWatcher({
        cacheDir,
        fetchImpl: emptyRemote({ status: 503 }).fetchImpl,
        log() {},
        warn() {},
      });
      await watcher.checkNow();
      assert.equal(
        watcher.catalog().commit,
        name === 'valid' ? '1'.repeat(40) : null,
      );
      assert.equal(
        watcher.catalog().message,
        name === 'valid' ? 'saved' : null,
      );
      assert.deepEqual(
        watcher.catalog().products,
        name === 'valid'
          ? [
              {
                id: 'saved-product',
                version: 'saved-version',
                title: 'Saved product',
                defaultOn: false,
                fileName: 'saved.kmz',
                fileTitle: 'Saved edition',
                size: 7,
                dateMs: 123,
              },
            ]
          : [],
      );
    }));
}

test('[ghostmaps-014] A subscriber error does not stop the next subscriber', () =>
  withCache(async (cacheDir) => {
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl: emptyRemote().fetchImpl,
      log() {},
      warn() {},
    });
    const stop = watcher.subscribe(() => {
      throw new Error('subscriber');
    });
    const events = [];
    watcher.subscribe((catalog) => events.push(catalog));
    assert.equal(watcher.subscribers(), 2);
    await watcher.checkNow();
    assert.equal(events.length, 1);
    stop();
    assert.equal(watcher.subscribers(), 1);
  }));

for (const name of [
  'invalid refs',
  'invalid tree',
  'commit error',
  'truncated tree',
  'invalid date',
  'empty message',
]) {
  test(`[${['invalid refs', 'invalid tree'].includes(name) ? 'ghostmaps-048' : name === 'truncated tree' ? 'ghostmaps-058' : 'ghostmaps-049'}] The watcher handles ${{ 'invalid tree': 'an invalid tree', 'commit error': 'a commit error', 'truncated tree': 'a truncated tree', 'invalid date': 'an invalid date', 'empty message': 'an empty message' }[name] || name}`, () =>
    withCache(async (cacheDir) => {
      const warnings = [];
      const remote = emptyRemote();
      const watcher = createGhostMapsWatcher({
        cacheDir,
        token: () => '',
        log() {},
        warn: (...args) => warnings.push(args),
        fetchImpl: async (url, options) => {
          if (name === 'invalid refs' && url.includes('/info/refs?'))
            return new Response('no refs');
          if (name === 'invalid tree' && url.includes('/git/trees/'))
            return new Response('{"tree":null}');
          if (name === 'truncated tree' && url.includes('/git/trees/'))
            return new Response('{"tree":[],"truncated":true}');
          if (url.includes('/commits/')) {
            if (name === 'commit error')
              return new Response('bad', { status: 503 });
            return new Response(
              JSON.stringify({
                commit: { committer: { date: 'invalid' }, message: '' },
              }),
            );
          }
          return remote.fetchImpl(url, options);
        },
      });
      const changed = await watcher.checkNow();
      assert.equal(changed, !['invalid refs', 'invalid tree'].includes(name));
      assert.equal(watcher.catalog().committedAt, null);
      assert.equal(
        watcher.catalog().message,
        name === 'commit error' || !changed ? null : '',
      );
      if (name === 'invalid refs')
        assert.equal(
          watcher.catalog().error,
          'GhostMaps branch head not advertised',
        );
      if (name === 'invalid tree')
        assert.equal(watcher.catalog().error, 'GhostMaps tree malformed');
      if (name === 'truncated tree')
        assert.equal(
          warnings[0][0],
          '[ghostmaps] repository tree listing truncated',
        );
    }));
}

test('[ghostmaps-014] A disk write error does not stop catalog events', () =>
  withCache(async (cacheDir) => {
    const fsp = await import('node:fs/promises');
    const blocked = path.join(cacheDir, 'blocked');
    await fsp.writeFile(blocked, 'file');
    const warnings = [];
    const watcher = createGhostMapsWatcher({
      cacheDir: blocked,
      fetchImpl: emptyRemote().fetchImpl,
      log() {},
      warn: (...args) => warnings.push(args),
    });
    const events = [];
    watcher.subscribe((catalog) => events.push(catalog));
    assert.equal(await watcher.checkNow(), true);
    assert.equal(events[0].commit, '1111111111111111111111111111111111111111');
    assert.equal(warnings[0][0], '[ghostmaps] could not save catalog:');
  }));

test('[ghostmaps-015] The file cache keeps temporary files and current blobs', () =>
  withCache(async (cacheDir) => {
    const fsp = await import('node:fs/promises');
    await fsp.mkdir(path.join(cacheDir, 'files'));
    await fsp.writeFile(path.join(cacheDir, 'files', 'keep.tmp'), 'temp');
    await fsp.writeFile(path.join(cacheDir, 'files', 'stale.kmz'), 'stale');
    await fsp.writeFile(path.join(cacheDir, 'files', 'other.kmz'), 'other');
    const { fetchImpl } = fakeGitHub();
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl,
      log() {},
      warn() {},
    });
    await watcher.checkNow();
    await warmDefaults(watcher);
    assert.deepEqual((await readdir(path.join(cacheDir, 'files'))).sort(), [
      `${'a'.repeat(40)}.kmz`,
      `${'b'.repeat(40)}.kmz`,
      'keep.tmp',
    ]);
  }));

test('[ghostmaps-018] The poll helper checks zero negative and fractional settings', () => {
  assert.equal(ghostMapsPollMs(''), 15000);
  assert.equal(ghostMapsPollMs('0'), 5000);
  assert.equal(ghostMapsPollMs('-1'), 5000);
  assert.equal(ghostMapsPollMs('5.0006'), 5001);
  assert.equal(ghostMapsPollMs('Infinity'), 15000);
});

test('[ghostmaps-014 ghostmaps-048] The default helpers use fetch log and warning callbacks', (t) =>
  withCache(async (cacheDir) => {
    const remote = emptyRemote();
    const logs = [];
    const warnings = [];
    t.mock.method(globalThis, 'fetch', remote.fetchImpl);
    t.mock.method(console, 'log', (...args) => logs.push(args));
    t.mock.method(console, 'warn', (...args) => warnings.push(args));
    const watcher = createGhostMapsWatcher({ cacheDir });
    const events = [];
    watcher.subscribe((catalog) => events.push(catalog));
    assert.equal(await watcher.checkNow(), true);
    assert.equal(events[0].commit, '1111111111111111111111111111111111111111');
    assert.match(logs[0][0], /updated: none/);
    t.mock.method(
      globalThis,
      'fetch',
      async () => new Response('bad', { status: 503 }),
    );
    assert.equal(await watcher.checkNow(), false);
    assert.equal(warnings[0][0], '[ghostmaps] check failed:');
  }));

test('[ghostmaps-048] A failed response tolerates a body cancel error', () =>
  withCache(async (cacheDir) => {
    let cancelled = 0;
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl: async () => ({
        ok: false,
        status: 503,
        body: {
          cancel: async () => {
            cancelled++;
            throw new Error('cancel');
          },
        },
      }),
      warn() {},
    });
    await watcher.checkNow();
    assert.equal(cancelled, 1);
    assert.match(watcher.catalog().error, /HTTP 503/);
  }));

test('[ghostmaps-015] A default file error does not reject the catalog check', () =>
  withCache(async (cacheDir) => {
    const remote = fakeGitHub();
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl: async (url, options) =>
        url.includes('raw.githubusercontent')
          ? new Response('bad', { status: 503 })
          : remote.fetchImpl(url, options),
      log() {},
      warn() {},
    });
    assert.equal(await watcher.checkNow(), true);
    await assert.rejects(watcher.file('cip'), /HTTP 503/);
    await assert.rejects(watcher.file('kinetic-30d'), /HTTP 503/);
  }));

for (const operation of ['readdir', 'rm']) {
  test(`[ghostmaps-015] The file cache tolerates a ${operation} error`, async (t) =>
    withCache(async (cacheDir) => {
      const { default: fsp } = await import('node:fs/promises');
      await fsp.mkdir(path.join(cacheDir, 'files'));
      await fsp.writeFile(path.join(cacheDir, 'files', 'stale.kmz'), 'stale');
      const original = fsp[operation];
      t.mock.method(fsp, operation, async (...args) => {
        if (operation === 'readdir' || args[0].endsWith('stale.kmz'))
          throw new Error('disk');
        return original(...args);
      });
      const watcher = createGhostMapsWatcher({
        cacheDir,
        fetchImpl: fakeGitHub().fetchImpl,
        log() {},
        warn() {},
      });
      await watcher.checkNow();
      await warmDefaults(watcher);
      assert.equal((await watcher.file('cip')).bytes.toString(), 'KMZ!');
      t.mock.restoreAll();
    }));
}

test('[ghostmaps-015] The watcher warms only the default products', async (t) =>
  withCache(async (cacheDir) => {
    const { default: fsp } = await import('node:fs/promises');
    const readFile = fsp.readFile;
    t.mock.method(fsp, 'readFile', async (...args) => {
      if (args[0].includes('/files/')) throw new Error('cache miss');
      return readFile(...args);
    });
    const { repo, fetchImpl } = fakeGitHub();
    repo.trees.get(sha('1')).push({
      path: 'ArcGIS Data for ATAK (KMZs)/Border Crisis Map/S2Underground_Border_Crisis_Map.kmz',
      type: 'blob',
      size: 4,
      sha: sha('c'),
    });
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl,
      log() {},
      warn() {},
    });
    await watcher.checkNow();
    await Promise.resolve();
    const raw = repo.calls.filter((url) =>
      url.startsWith('https://raw.githubusercontent.com/'),
    );
    assert.equal(raw.length, 2);
    assert.ok(raw.some((url) => url.includes('Master%20Database')));
    assert.ok(raw.some((url) => url.includes('Kinetic_Activities')));
    assert.equal(
      raw.some((url) => url.includes('Border_Crisis')),
      false,
    );
    await warmDefaults(watcher);
  }));

for (const name of ['present', 'absent']) {
  test(`[ghostmaps-052] The default token helper checks the ${name} token`, async (t) =>
    withCache(async (cacheDir) => {
      const old = process.env.GITHUB_TOKEN;
      if (name === 'present') process.env.GITHUB_TOKEN = ' test-token ';
      else delete process.env.GITHUB_TOKEN;
      t.after(() => {
        if (old === undefined) delete process.env.GITHUB_TOKEN;
        else process.env.GITHUB_TOKEN = old;
      });
      const remote = emptyRemote();
      const watcher = createGhostMapsWatcher({
        cacheDir,
        fetchImpl: remote.fetchImpl,
        log() {},
        warn() {},
      });
      await watcher.checkNow();
      assert.equal(
        remote.calls[1].options.headers.Authorization,
        name === 'present' ? 'Bearer test-token' : undefined,
      );
    }));
}

for (const [name, commit, text, date] of [
  [
    'message',
    {
      commit: {
        message: 'Title\nSecond line',
        committer: { date: '2026-10-18T00:00:00Z' },
      },
    },
    'Title',
    1792281600000,
  ],
  ['empty message', {}, '', null],
]) {
  test(`[ghostmaps-049] The watcher records the ${name} and date`, () =>
    withCache(async (cacheDir) => {
      const logs = [];
      const watcher = createGhostMapsWatcher({
        cacheDir,
        fetchImpl: emptyRemote({ commit }).fetchImpl,
        log: (text) => logs.push(text),
        warn() {},
      });
      await watcher.checkNow();
      assert.equal(watcher.catalog().message, text);
      assert.equal(watcher.catalog().committedAt, date);
      assert.equal(
        logs[0],
        name === 'message'
          ? `[ghostmaps] commit 11111111 "Title"; updated: none`
          : '[ghostmaps] commit 11111111; updated: none',
      );
    }));
}

test('[ghostmaps-014] The watcher log names each changed product', () =>
  withCache(async (cacheDir) => {
    const logs = [];
    const watcher = createGhostMapsWatcher({
      cacheDir,
      fetchImpl: fakeGitHub().fetchImpl,
      log: (text) => logs.push(text),
      warn() {},
    });
    const events = [];
    watcher.subscribe((catalog) => events.push(catalog));
    await watcher.checkNow();
    assert.equal(events[0].commit, '1111111111111111111111111111111111111111');
    assert.equal(
      logs[0],
      '[ghostmaps] commit 11111111 "Oct 18 Update"; updated: cip, kinetic-30d',
    );
    await warmDefaults(watcher);
  }));

test('[ghostmaps-040] The proxy creates local routes before it starts the watcher', async (t) => {
  const { default: fsp } = await import('node:fs/promises');
  t.mock.method(fsp, 'readFile', async () => {
    throw new Error('absent catalog');
  });
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    requests++;
    throw new Error('network');
  });
  const plugin = ghostMapsProxy();
  const paths = [];
  const middlewares = {
    use: (path, handler) => {
      paths.push(path);
      assert.equal(typeof handler, 'function');
    },
  };
  plugin.configureServer({ middlewares });
  plugin.configurePreviewServer({ middlewares });
  assert.equal(plugin.name, 'ghostmaps');
  assert.deepEqual(paths, ['/api/ghostmaps', '/api/ghostmaps']);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests, 0);
  let starts = 0;
  const supplied = ghostMapsProxy({
    watcher: routeWatcher({
      start: () => {
        starts++;
        return Promise.resolve(false);
      },
    }),
  });
  supplied.configureServer({ middlewares: { use() {} } });
  supplied.configurePreviewServer({ middlewares: { use() {} } });
  assert.equal(starts, 0);
});
