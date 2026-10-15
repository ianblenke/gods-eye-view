import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fsp } from 'node:fs';
import { Readable } from 'node:stream';
import os from 'node:os';
import path from 'node:path';
import { beemapsProxy } from '../../server/providers/beemaps.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const KEY = 'fixture-key-Z9y8';
const HOST = '127.0.0.1:5173';
const UPSTREAM = 'https://beemaps.com/api/developer/latest/poly';
const BOX = [10, 60, 10.02, 60.01];
const FRAMES = '/api/beemaps/frames';
const STATUS = '/api/beemaps/status';

/** An upstream item in the documented shape, with made-up values. */
const frame = (n, extra = {}) => ({
  url: `https://cdn.example.invalid/${n}?signed=CANARY-url`,
  timestamp: new Date(Date.UTC(2026, 9, 1) + n * 1000).toISOString(),
  sequence: 'CANARY-sequence',
  device: 'CANARY-device',
  position: { lat: 60 + n / 100000, lon: 10 + n / 100000, hdop: 0.5 },
  imu: { acc_x: 1 },
  ...extra,
});
const document = (count = 3, extra = {}) => ({
  frames: Array.from({ length: count }, (_, i) => frame(i)),
  creditsUsed: 3,
  creditsRemaining: 997,
  cost: 0.5,
  ...extra,
});
const ok = (doc = document()) =>
  new Response(JSON.stringify(doc), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
const failure = (code, headers = {}) =>
  new Response(`{"error":"CANARY-echo ${KEY}"}`, { status: code, headers });
const GOOD_HEADERS = {
  host: HOST,
  origin: `http://${HOST}`,
  'content-type': 'application/json',
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** Wait until the check is true. Real timers run, because only Date is mocked. */
async function waitFor(check) {
  for (let i = 0; i < 400 && !check(); i++) await sleep(5);
  assert.equal(check(), true, 'the wait ended before the check was true');
}
/** A box of the same size at a different place, so each one has its own memory entry. */
const boxAt = (n) => [10 + n * 0.1, 60, 10.02 + n * 0.1, 60.01];

async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'gev-beemaps-proxy-'));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}
const readBudget = async (dir) => {
  try {
    return JSON.parse(
      await fsp.readFile(path.join(dir, 'budget.json'), 'utf8'),
    );
  } catch {
    return null;
  }
};

/** Install the plugin on a fake middleware list. Dates are mocked, requests are fake. */
async function install(
  t,
  { env = {}, respond, cacheDir, preview = false } = {},
) {
  t.mock.timers.reset();
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  const dir = cacheDir ?? (await tempDir(t));
  const calls = [];
  const strays = [];
  const timers = [];
  const cleared = [];
  const environment = { BEEMAPS_API_KEY: KEY, ...env };
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (!String(url).startsWith(`${UPSTREAM}?catalog=true`)) {
      strays.push(String(url));
      throw new Error('request to another URL');
    }
    return respond ? respond(url, init, calls.length) : ok();
  };
  const plugin = beemapsProxy({
    env: environment,
    fetchImpl,
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
    cacheDir: dir,
  });
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
  t.after(() => assert.deepEqual(strays, []));

  async function request(url, options = {}) {
    const {
      method = 'POST',
      body,
      headers = {},
      remote = '127.0.0.1',
      failing = false,
    } = options;
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    const source = failing
      ? (async function* () {
          yield Buffer.from('{"bbox":');
          throw new Error('aborted');
        })()
      : body === undefined
        ? []
        : [Buffer.from(text)];
    const req = Object.assign(Readable.from(source), {
      method,
      headers: { ...GOOD_HEADERS, ...headers },
      socket: { remoteAddress: remote },
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
        this.text = chunk;
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
    return {
      status: res.statusCode,
      headers: res.headers,
      text: res.text,
      body: res.text === undefined ? undefined : JSON.parse(res.text),
      next: nexted,
      read: req.readableDidRead,
    };
  }
  const frames = (body, options = {}) => request(FRAMES, { body, ...options });
  return {
    plugin,
    uses,
    request,
    frames,
    calls,
    timers,
    cleared,
    dir,
    env: environment,
    advance: (ms) => t.mock.timers.tick(ms),
    budget: () => readBudget(dir),
  };
}

test('[beemaps-source-001] mounts the routes status and frames, and the plugin name is beemaps-proxy', async (t) => {
  const server = await install(t);
  assert.equal(server.plugin.name, 'beemaps-proxy');
  assert.deepEqual(server.uses.sort(), [FRAMES, STATUS]);
  const preview = await install(t, { preview: true });
  assert.deepEqual(preview.uses.sort(), [FRAMES, STATUS]);
  assert.equal((await preview.request(STATUS, { method: 'GET' })).status, 200);
  assert.equal((await preview.frames({ bbox: BOX })).status, 200);
});

test('[beemaps-source-001] puts the plugin once in the list of local provider plugins', () => {
  const names = localProviderPlugins().map((plugin) => plugin.name);
  assert.equal(names.filter((name) => name === 'beemaps-proxy').length, 1);
});

test('[beemaps-source-001] passes every other path to next and ignores a query on its own paths', async (t) => {
  const server = await install(t);
  for (const url of [
    '/api/beemaps/other',
    '/api/beemaps/',
    '/api/beemaps',
    '/api/beemaps/frames/extra',
    '/api/beemaps/status/extra',
    '/api/beemaps/framesx',
    '/api/other',
  ]) {
    const result = await server.request(url, { method: 'GET' });
    assert.equal(result.next, true, url);
    assert.equal(result.status, undefined, url);
  }
  assert.equal(server.calls.length, 0);
  const query = await server.request(`${STATUS}?x=1`, { method: 'GET' });
  assert.equal(query.next, false);
  assert.equal(query.status, 200);
  const frames = await server.request(`${FRAMES}?x=1`, { body: { bbox: BOX } });
  assert.equal(frames.next, false);
  assert.equal(frames.status, 200);
});

test('[beemaps-source-002] says configured only for a key that is not empty after trim', async (t) => {
  for (const [key, configured] of [
    [undefined, false],
    ['', false],
    ['   ', false],
    ['\t\n', false],
    ['abc', true],
    ['  abc  ', true],
  ]) {
    const server = await install(t, { env: { BEEMAPS_API_KEY: key } });
    const result = await server.request(STATUS, { method: 'GET' });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, { configured }, String(key));
    assert.equal(result.text, JSON.stringify({ configured }));
  }
});

test('[beemaps-source-002] uses the same-site gate and answers 405 to another method', async (t) => {
  const server = await install(t);
  const foreign = await server.request(STATUS, {
    method: 'GET',
    headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' },
  });
  assert.equal(foreign.status, 403);
  assert.equal(foreign.text.includes('configured'), false);
  const local = await server.request(STATUS, {
    method: 'GET',
    headers: { origin: undefined },
  });
  assert.equal(local.status, 200);
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const result = await server.request(STATUS, { method });
    assert.equal(result.status, 405, method);
    assert.deepEqual(result.body, { error: 'Method not allowed' });
  }
});

test('[beemaps-source-003] answers 405 to a GET, a PUT and a DELETE and sends no request', async (t) => {
  const server = await install(t);
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const result = await server.frames({ bbox: BOX }, { method });
    assert.equal(result.status, 405, method);
    assert.deepEqual(result.body, { error: 'Method not allowed' });
    assert.equal(result.read, false);
  }
  const foreign = await server.frames(
    { bbox: BOX },
    { method: 'GET', headers: { origin: 'https://evil.example' } },
  );
  assert.equal(foreign.status, 405);
  assert.equal(server.calls.length, 0);
  assert.equal(await server.budget(), null);
});

test('[beemaps-source-004] refuses a POST that breaks one of the five rules and does not read the body', async (t) => {
  const server = await install(t);
  const broken = [
    { remote: '192.168.1.5' },
    { remote: '8.8.8.8' },
    { headers: { 'x-forwarded-for': '127.0.0.1' } },
    { headers: { forwarded: 'for=127.0.0.1' } },
    { headers: { host: 'example.com' } },
    {
      headers: { host: 'beemaps.com:5173', origin: 'http://beemaps.com:5173' },
    },
    { headers: { origin: 'http://evil.example' } },
    { headers: { origin: undefined } },
    { headers: { 'content-type': 'text/plain' } },
    { headers: { 'content-type': undefined } },
  ];
  for (const options of broken) {
    const result = await server.frames({ bbox: BOX }, options);
    assert.equal(result.status, 403, JSON.stringify(options));
    assert.deepEqual(result.body, { error: 'cross_origin' });
    assert.equal(result.read, false);
  }
  assert.equal(server.calls.length, 0);
  assert.equal(await server.budget(), null);
});

test('[beemaps-source-004] passes a POST that keeps the five rules from each loopback address', async (t) => {
  const server = await install(t, { env: { BEEMAPS_DAILY_QUERIES: '10' } });
  const forms = [
    { remote: '127.0.0.1' },
    {
      remote: '::1',
      headers: { host: '[::1]:5173', origin: 'http://[::1]:5173' },
    },
    { remote: '::ffff:127.0.0.1' },
    {
      remote: '127.0.0.1',
      headers: { host: 'localhost:5173', origin: 'http://localhost:5173' },
    },
  ];
  for (const [index, options] of forms.entries()) {
    const result = await server.frames({ bbox: boxAt(index) }, options);
    assert.equal(result.status, 200, JSON.stringify(options));
  }
});

test('[beemaps-source-005] answers 400 bad_body for a body of 8193 bytes and passes a body of 8192 bytes', async (t) => {
  const server = await install(t);
  const head = JSON.stringify({ bbox: BOX });
  const pad = (size) =>
    head.slice(0, -1) + ' '.repeat(size - head.length) + '}';
  const exact = await server.frames(pad(8192));
  assert.equal(exact.status, 200);
  const over = await server.frames(pad(8193));
  assert.equal(over.status, 400);
  assert.deepEqual(over.body, { error: 'bad_body' });
  assert.equal(server.calls.length, 1);
});

test('[beemaps-source-005] answers 400 bad_body when the request body fails while the route reads it', async (t) => {
  const server = await install(t);
  const result = await server.frames(undefined, { failing: true });
  assert.equal(result.status, 400);
  assert.deepEqual(result.body, { error: 'bad_body' });
  assert.equal(server.calls.length, 0);
});

test('[beemaps-source-012] refuses a valid request without a key and sends no request', async (t) => {
  for (const key of [undefined, '', '   ', '\n']) {
    const server = await install(t, { env: { BEEMAPS_API_KEY: key } });
    const result = await server.frames({ bbox: BOX });
    assert.equal(result.status, 503, String(key));
    assert.deepEqual(result.body, { error: 'no_key', keyRequired: true });
    assert.equal(server.calls.length, 0);
    assert.equal(await server.budget(), null);
  }
});

test('[beemaps-source-012] reads the key when the request comes and trims it', async (t) => {
  const server = await install(t, { env: { BEEMAPS_API_KEY: undefined } });
  assert.equal((await server.frames({ bbox: BOX })).status, 503);
  server.env.BEEMAPS_API_KEY = `  ${KEY}\n`;
  assert.equal((await server.frames({ bbox: BOX })).status, 200);
  assert.equal(server.calls[0].init.headers.Authorization, `Basic ${KEY}`);
});

test('[beemaps-source-013] keeps the key out of every answer, header and console line', async (t) => {
  const lines = [];
  for (const name of ['log', 'info', 'warn', 'error', 'debug'])
    t.mock.method(console, name, (...args) => lines.push(args.join(' ')));
  const refused = await install(t, { respond: () => failure(403) });
  const bad = await refused.frames({ bbox: BOX });
  const good = await install(t);
  const fine = await good.frames({ bbox: BOX });
  const status = await good.request(STATUS, { method: 'GET' });
  for (const result of [bad, fine, status]) {
    assert.equal(JSON.stringify(result).includes(KEY), false);
    assert.equal(result.text.includes('CANARY'), false);
  }
  assert.equal(refused.calls[0].init.headers.Authorization, `Basic ${KEY}`);
  assert.deepEqual(
    lines.filter((line) => line.includes(KEY)),
    [],
  );
});

test('[beemaps-source-013] keeps the key out of the browser config of the build', async () => {
  const before = process.env.BEEMAPS_API_KEY;
  process.env.BEEMAPS_API_KEY = KEY;
  try {
    const { createBrowserViteConfig } = await import('../../build/vite.js');
    const { default: standaloneConfig } = await import('../../vite.config.js');
    for (const config of [
      createBrowserViteConfig(),
      createBrowserViteConfig({
        googleApiKey: 'g',
        cesiumToken: 'c',
        mapillaryToken: 'm',
      }),
      standaloneConfig({ mode: 'test' }),
    ]) {
      assert.equal(JSON.stringify(config.define).includes(KEY), false);
      assert.equal(JSON.stringify(config.define).includes('BEEMAPS'), false);
      assert.equal(config.envPrefix, 'VITE_AIS_LIVE_');
    }
  } finally {
    if (before === undefined) delete process.env.BEEMAPS_API_KEY;
    else process.env.BEEMAPS_API_KEY = before;
  }
});

test('[beemaps-source-019] answers a repeat from memory with the new limit and does not change the count', async (t) => {
  const server = await install(t, { respond: () => ok(document(5)) });
  const first = await server.frames({ bbox: BOX, limit: 3 });
  assert.equal(first.body.cached, false);
  assert.equal(first.body.count, 3);
  const second = await server.frames({ bbox: BOX, limit: 2 });
  assert.equal(second.body.cached, true);
  assert.deepEqual(second.body.frames, first.body.frames.slice(0, 2));
  assert.equal(second.body.count, 2);
  assert.equal(second.body.total, 5);
  assert.deepEqual(second.body.credits, first.body.credits);
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 1 });
  assert.deepEqual(second.body.budget, { used: 1, limit: 20 });
});

test('[beemaps-source-019] shares an answer between a box and the same ring and keys it by the date', async (t) => {
  const server = await install(t);
  const ring = [
    [10, 60],
    [10.02, 60],
    [10.02, 60.01],
    [10, 60.01],
    [10, 60],
  ];
  await server.frames({ bbox: BOX });
  const same = await server.frames({
    polygon: { type: 'Polygon', coordinates: [ring] },
  });
  assert.equal(same.body.cached, true);
  assert.equal(server.calls.length, 1);
  const dated = await server.frames({ bbox: BOX, since: '2026-10-01' });
  assert.equal(dated.body.cached, false);
  assert.equal(server.calls.length, 2);
  const shifted = await server.frames({ bbox: [10, 60, 10.02, 60.0100001] });
  assert.equal(shifted.body.cached, false);
  assert.equal(server.calls.length, 3);
  assert.equal(
    (await server.frames({ bbox: BOX, since: '2026-10-01', limit: 1 })).body
      .cached,
    true,
  );
  assert.equal(
    (await server.frames({ bbox: BOX, since: '2026-10-02' })).body.cached,
    false,
  );
});

test('[beemaps-source-019] serves an answer that is 599.999 seconds old and not one that is 600 seconds old', async (t) => {
  const server = await install(t);
  await server.frames({ bbox: BOX });
  server.advance(599_999);
  assert.equal((await server.frames({ bbox: BOX })).body.cached, true);
  server.advance(1);
  const late = await server.frames({ bbox: BOX });
  assert.equal(late.body.cached, false);
  assert.equal(server.calls.length, 2);
  server.advance(599_999);
  assert.equal((await server.frames({ bbox: BOX })).body.cached, true);
});

test('[beemaps-source-019] holds at most 32 answers and drops the one that it stored first', async (t) => {
  const server = await install(t, { env: { BEEMAPS_DAILY_QUERIES: '100' } });
  let sent = 0;
  const send = async (n) => {
    if (sent++ % 5 === 0) server.advance(61_000);
    return server.frames({ bbox: boxAt(n) });
  };
  for (let n = 0; n < 32; n++) assert.equal((await send(n)).body.cached, false);
  assert.equal(server.calls.length, 32);
  assert.equal((await send(0)).body.cached, true);
  assert.equal(server.calls.length, 32);
  assert.equal((await send(32)).body.cached, false);
  assert.equal(server.calls.length, 33);
  assert.equal((await send(1)).body.cached, true);
  assert.equal(server.calls.length, 33);
  assert.equal((await send(0)).body.cached, false);
  assert.equal(server.calls.length, 34);
});

test('[beemaps-source-019] counts an answer that is stored again as the newest', async (t) => {
  const server = await install(t, { env: { BEEMAPS_DAILY_QUERIES: '100' } });
  let sent = 0;
  const send = async (n) => {
    if (sent++ % 5 === 0) server.advance(61_000);
    return server.frames({ bbox: boxAt(n) });
  };
  const oldest = 0;
  const second = 1;
  const middle = 2;
  assert.equal((await send(oldest)).body.cached, false);
  assert.equal((await send(second)).body.cached, false);
  server.advance(590_000);
  assert.equal((await send(middle)).body.cached, false);
  server.advance(15_000);
  assert.equal((await send(second)).body.cached, false);
  for (let n = 3; n < 32; n++) assert.equal((await send(n)).body.cached, false);
  assert.equal((await send(32)).body.cached, false);
  assert.equal((await send(33)).body.cached, false);
  assert.equal(server.calls.length, 35);
  assert.equal((await send(second)).body.cached, true);
  assert.equal((await send(middle)).body.cached, false);
  assert.equal(server.calls.length, 36);
});

test('[beemaps-source-019] keeps an error answer out of the memory', async (t) => {
  const server = await install(t, {
    respond: (url, init, call) => (call === 1 ? failure(500) : ok()),
  });
  const first = await server.frames({ bbox: BOX });
  assert.equal(first.status, 502);
  const second = await server.frames({ bbox: BOX });
  assert.equal(second.status, 200);
  assert.equal(second.body.cached, false);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-020] shares one upstream request between two requests for one area that arrive together', async (t) => {
  let release;
  const slow = new Promise((resolve) => {
    release = resolve;
  });
  const server = await install(t, {
    respond: () => slow.then(() => ok(document(5))),
  });
  const one = server.frames({ bbox: BOX, limit: 4 });
  await waitFor(() => server.calls.length === 1);
  const two = server.frames({ bbox: BOX, limit: 2 });
  await sleep(100);
  assert.equal(server.calls.length, 1);
  release();
  const [first, second] = await Promise.all([one, two]);
  assert.equal(first.body.cached, false);
  assert.equal(first.body.count, 4);
  assert.equal(second.body.cached, true);
  assert.equal(second.body.count, 2);
  assert.deepEqual(second.body.frames, first.body.frames.slice(0, 2));
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 1 });
});

test('[beemaps-source-020] sends an error answer of the shared request to every request that waits', async (t) => {
  let release;
  const slow = new Promise((resolve) => {
    release = resolve;
  });
  const server = await install(t, {
    respond: (url, init, call) =>
      call === 1 ? slow.then(() => failure(500)) : ok(),
  });
  const one = server.frames({ bbox: BOX });
  await waitFor(() => server.calls.length === 1);
  const two = server.frames({ bbox: BOX, limit: 1 });
  await sleep(100);
  release();
  const [first, second] = await Promise.all([one, two]);
  for (const result of [first, second]) {
    assert.equal(result.status, 502);
    assert.deepEqual(result.body, { error: 'upstream_failed' });
  }
  assert.equal(server.calls.length, 1);
  const third = await server.frames({ bbox: BOX });
  assert.equal(third.status, 200);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-020] sends one request for each different area that is in flight', async (t) => {
  let release;
  const slow = new Promise((resolve) => {
    release = resolve;
  });
  const server = await install(t, { respond: () => slow.then(() => ok()) });
  const one = server.frames({ bbox: BOX });
  const two = server.frames({ bbox: boxAt(1) });
  const three = server.frames({ bbox: BOX, since: '2026-10-01' });
  await waitFor(() => server.calls.length === 3);
  release();
  await Promise.all([one, two, three]);
  assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 3 });
});

test('[beemaps-source-021] refuses the 7th request in 60 seconds and lets it pass at the 60th second', async (t) => {
  const server = await install(t);
  for (let i = 0; i < 6; i++) {
    const result = await server.frames('not json');
    assert.equal(result.status, 400);
  }
  server.advance(59_999);
  const refused = await server.frames('not json');
  assert.equal(refused.status, 429);
  assert.deepEqual(refused.body, { error: 'rate_limited' });
  assert.equal(refused.headers['retry-after'], '60');
  assert.equal(refused.read, false);
  server.advance(1);
  assert.equal((await server.frames('not json')).status, 400);
});

test('[beemaps-source-021] counts a request that gets its answer from memory', async (t) => {
  const server = await install(t);
  assert.equal((await server.frames({ bbox: BOX })).body.cached, false);
  for (let i = 0; i < 5; i++)
    assert.equal((await server.frames({ bbox: BOX })).body.cached, true);
  const refused = await server.frames({ bbox: BOX });
  assert.equal(refused.status, 429);
  assert.equal(server.calls.length, 1);
});

test('[beemaps-source-021] keeps one count for all loopback addresses and skips refused methods and origins', async (t) => {
  const server = await install(t);
  for (let i = 0; i < 10; i++) {
    await server.frames({ bbox: BOX }, { method: 'GET' });
    await server.frames({ bbox: BOX }, { remote: '10.0.0.9' });
  }
  const addresses = [
    ['127.0.0.1', HOST],
    ['::1', '[::1]:5173'],
    ['::ffff:127.0.0.1', HOST],
  ];
  for (const [remote, host] of addresses) {
    for (let i = 0; i < 2; i++) {
      const result = await server.frames('x', {
        remote,
        headers: { host, origin: `http://${host}` },
      });
      assert.equal(result.status, 400);
    }
  }
  const seventh = await server.frames('x');
  assert.equal(seventh.status, 429);
});

test('[beemaps-source-022] answers the method before the local request and the local request before the rate limit', async (t) => {
  const server = await install(t);
  for (let i = 0; i < 6; i++) await server.frames('x');
  assert.equal((await server.frames('x')).status, 429);
  const method = await server.frames('x', {
    method: 'GET',
    headers: { origin: 'http://evil.example' },
  });
  assert.equal(method.status, 405);
  const local = await server.frames('x', {
    headers: { origin: 'http://evil.example' },
  });
  assert.equal(local.status, 403);
  const limited = await server.frames('x');
  assert.equal(limited.status, 429);
});

test('[beemaps-source-022] answers the rate limit before the body and the body before the area', async (t) => {
  const server = await install(t);
  const body = await server.frames('{"bbox":[0,0,1,1],"extra":1}');
  assert.deepEqual(body.body, { error: 'bad_body' });
  const area = await server.frames({
    bbox: [0, 0, 1, 1],
    since: 'x',
    limit: 0,
  });
  assert.deepEqual(area.body, { error: 'area_too_large', maxKm2: 5 });
  const date = await server.frames({ bbox: BOX, since: 'x', limit: 0 });
  assert.deepEqual(date.body, { error: 'bad_since' });
  const limit = await server.frames({ bbox: BOX, limit: 0 });
  assert.deepEqual(limit.body, { error: 'bad_limit' });
  for (let i = 0; i < 2; i++) await server.frames('x');
  assert.equal((await server.frames('x')).status, 429);
  const early = await server.frames({ bbox: BOX, extra: 1 });
  assert.equal(early.status, 429);
  const oversize = await server.frames(' '.repeat(8193));
  assert.equal(oversize.status, 429);
  assert.equal(oversize.read, false);
});

test('[beemaps-source-022] answers the input and the key before the memory and the memory before the hold and the budget', async (t) => {
  const server = await install(t, { env: { BEEMAPS_DAILY_QUERIES: '2' } });
  assert.equal((await server.frames({ bbox: BOX })).status, 200);
  server.env.BEEMAPS_API_KEY = '';
  const noKey = await server.frames({ bbox: BOX });
  assert.equal(noKey.status, 503);
  assert.deepEqual(noKey.body, { error: 'no_key', keyRequired: true });
  const badLimit = await server.frames({ bbox: BOX, limit: 0 });
  assert.equal(badLimit.status, 400);
  server.env.BEEMAPS_API_KEY = KEY;
  assert.equal((await server.frames({ bbox: boxAt(1) })).status, 200);
  const spent = await server.frames({ bbox: boxAt(2) });
  assert.equal(spent.status, 429);
  assert.deepEqual(spent.body, { error: 'budget', used: 2, limit: 2 });
  const memory = await server.frames({ bbox: BOX });
  assert.equal(memory.status, 200);
  assert.equal(memory.body.cached, true);
  assert.deepEqual(memory.body.budget, { used: 2, limit: 2 });
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-022] answers a memory hit during a hold and the hold before the budget', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_DAILY_QUERIES: '2' },
    respond: (url, init, call) => (call === 1 ? ok() : failure(401)),
  });
  assert.equal((await server.frames({ bbox: BOX })).status, 200);
  assert.equal((await server.frames({ bbox: boxAt(1) })).status, 403);
  const hit = await server.frames({ bbox: BOX });
  assert.equal(hit.status, 200);
  assert.equal(hit.body.cached, true);
  const held = await server.frames({ bbox: boxAt(2) });
  assert.equal(held.status, 403);
  assert.deepEqual(held.body, { error: 'key_rejected', keyRejected: true });
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-023] names the failure of the upstream and counts the call', async (t) => {
  const cases = [
    [() => failure(401), 403, { error: 'key_rejected', keyRejected: true }],
    [() => failure(403), 403, { error: 'key_rejected', keyRejected: true }],
    [() => failure(402), 402, { error: 'no_credit' }],
    [() => failure(400), 502, { error: 'upstream_failed' }],
    [() => failure(500), 502, { error: 'upstream_failed' }],
    [() => failure(404), 502, { error: 'upstream_failed' }],
    [
      () => {
        throw new Error(`down ${KEY}`);
      },
      502,
      { error: 'upstream_failed' },
    ],
    [() => new Response('not json'), 502, { error: 'bad_upstream' }],
    [() => ok({ frames: 'x' }), 502, { error: 'bad_upstream' }],
    [() => ok({}), 502, { error: 'bad_upstream' }],
    [() => new Response('null'), 502, { error: 'bad_upstream' }],
  ];
  for (const [respond, status, body] of cases) {
    const server = await install(t, { respond });
    const result = await server.frames({ bbox: BOX });
    assert.equal(result.status, status);
    assert.deepEqual(result.body, body);
    assert.equal(result.text.includes('CANARY'), false);
    assert.equal(result.text.includes(KEY), false);
    assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 1 });
  }
});

test('[beemaps-source-023] counts each failed call against the daily limit', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_DAILY_QUERIES: '2' },
    respond: () => failure(500),
  });
  assert.equal((await server.frames({ bbox: BOX })).status, 502);
  assert.equal((await server.frames({ bbox: boxAt(1) })).status, 502);
  const spent = await server.frames({ bbox: boxAt(2) });
  assert.equal(spent.status, 429);
  assert.deepEqual(spent.body, { error: 'budget', used: 2, limit: 2 });
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-023] gives upstream_failed for a timeout and clears the timer', async (t) => {
  const server = await install(t, {
    respond: (url, init) =>
      new Promise((resolve, reject) =>
        init.signal.addEventListener('abort', () =>
          reject(new Error('aborted')),
        ),
      ),
  });
  const pending = server.frames({ bbox: BOX });
  await waitFor(() => server.timers.length === 1);
  assert.equal(server.timers[0].ms, 20000);
  server.timers[0].fn();
  const result = await pending;
  assert.equal(result.status, 502);
  assert.deepEqual(result.body, { error: 'upstream_failed' });
  assert.deepEqual(server.cleared, [1]);
});

test('[beemaps-source-023] gives 429 with retryAfter and the header Retry-After for an upstream 429', async (t) => {
  for (const [header, seconds] of [
    ['30', 30],
    ['601', 600],
    ['0', 60],
    [undefined, 60],
  ]) {
    const server = await install(t, {
      respond: () =>
        failure(429, header === undefined ? {} : { 'retry-after': header }),
    });
    const result = await server.frames({ bbox: BOX });
    assert.equal(result.status, 429);
    assert.deepEqual(result.body, {
      error: 'upstream_rate_limit',
      retryAfter: seconds,
    });
    assert.equal(result.headers['retry-after'], String(seconds));
  }
});

test('[beemaps-source-024] holds for 300 seconds after 401 and 403 and sends the next request at 300 seconds', async (t) => {
  for (const code of [401, 403]) {
    const server = await install(t, {
      respond: (url, init, call) => (call === 1 ? failure(code) : ok()),
    });
    assert.equal((await server.frames({ bbox: BOX })).status, 403);
    server.advance(299_999);
    const held = await server.frames({ bbox: boxAt(1) });
    assert.equal(held.status, 403, String(code));
    assert.deepEqual(held.body, { error: 'key_rejected', keyRejected: true });
    assert.equal(server.calls.length, 1);
    assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 1 });
    server.advance(1);
    const next = await server.frames({ bbox: boxAt(1) });
    assert.equal(next.status, 200);
    assert.equal(server.calls.length, 2);
    assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 2 });
  }
});

test('[beemaps-source-024] holds for 600 seconds after 402', async (t) => {
  const server = await install(t, {
    respond: (url, init, call) => (call === 1 ? failure(402) : ok()),
  });
  assert.equal((await server.frames({ bbox: BOX })).status, 402);
  server.advance(599_999);
  const held = await server.frames({ bbox: boxAt(1) });
  assert.equal(held.status, 402);
  assert.deepEqual(held.body, { error: 'no_credit' });
  assert.equal(server.calls.length, 1);
  server.advance(1);
  assert.equal((await server.frames({ bbox: boxAt(1) })).status, 200);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-024] holds for the retryAfter seconds after 429 and gives the seconds that remain', async (t) => {
  const server = await install(t, {
    respond: (url, init, call) =>
      call === 1 ? failure(429, { 'retry-after': '30' }) : ok(),
  });
  const first = await server.frames({ bbox: BOX });
  assert.deepEqual(first.body, {
    error: 'upstream_rate_limit',
    retryAfter: 30,
  });
  server.advance(10_000);
  const ten = await server.frames({ bbox: boxAt(1) });
  assert.equal(ten.status, 429);
  assert.deepEqual(ten.body, { error: 'upstream_rate_limit', retryAfter: 20 });
  assert.equal(ten.headers['retry-after'], '20');
  server.advance(600);
  const rounded = await server.frames({ bbox: boxAt(1) });
  assert.equal(rounded.body.retryAfter, 20);
  assert.equal(rounded.headers['retry-after'], '20');
  server.advance(19_000);
  const last = await server.frames({ bbox: boxAt(1) });
  assert.equal(last.body.retryAfter, 1);
  assert.equal(server.calls.length, 1);
  server.advance(500);
  assert.equal((await server.frames({ bbox: boxAt(1) })).status, 200);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-source-024] sends the next request at once after a failure that has no hold', async (t) => {
  for (const respond of [
    () => failure(500),
    () => new Response('not json'),
    () => {
      throw new Error('down');
    },
  ]) {
    const server = await install(t, { respond });
    await server.frames({ bbox: BOX });
    await server.frames({ bbox: boxAt(1) });
    assert.equal(server.calls.length, 2);
  }
});

test('[beemaps-source-016] sends no request when the daily limit is used and answers 429 with the count', async (t) => {
  const server = await install(t, { env: { BEEMAPS_DAILY_QUERIES: '1' } });
  assert.equal((await server.frames({ bbox: BOX })).status, 200);
  const spent = await server.frames({ bbox: boxAt(1) });
  assert.equal(spent.status, 429);
  assert.deepEqual(spent.body, { error: 'budget', used: 1, limit: 1 });
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 1 });
});

test('[beemaps-source-016] writes the budget file before it sends the request', async (t) => {
  const dir = await tempDir(t);
  const seen = [];
  const server = await install(t, {
    cacheDir: dir,
    respond: async () => {
      seen.push(await readBudget(dir));
      return ok();
    },
  });
  await server.frames({ bbox: BOX });
  assert.deepEqual(seen, [{ date: '2026-10-15', count: 1 }]);
});

test('[beemaps-source-016] keeps the budget file in .gev-cache/beemaps under the current folder by default', async (t) => {
  const home = await tempDir(t);
  const before = process.cwd();
  process.chdir(home);
  try {
    t.mock.timers.enable({ apis: ['Date'], now: NOW });
    const plugin = beemapsProxy({
      env: { BEEMAPS_API_KEY: KEY },
      fetchImpl: async () => ok(),
    });
    let handler;
    plugin.configureServer({
      middlewares: { use: (route, fn) => route === FRAMES && (handler = fn) },
    });
    const req = Object.assign(
      Readable.from([Buffer.from(JSON.stringify({ bbox: BOX }))]),
      {
        method: 'POST',
        url: '/',
        headers: GOOD_HEADERS,
        socket: { remoteAddress: '127.0.0.1' },
      },
    );
    await handler(req, { writeHead() {}, setHeader() {}, end() {} }, () => {});
    const saved = await fsp.readFile(
      path.join(home, '.gev-cache', 'beemaps', 'budget.json'),
      'utf8',
    );
    assert.deepEqual(JSON.parse(saved), { date: '2026-10-15', count: 1 });
  } finally {
    process.chdir(before);
  }
});

test('[beemaps-source-017] answers 503 budget_unavailable and sends no request when the file is not valid or cannot be written', async (t) => {
  const bad = await tempDir(t);
  await fsp.writeFile(path.join(bad, 'budget.json'), 'not json');
  const invalid = await install(t, { cacheDir: bad });
  const result = await invalid.frames({ bbox: BOX });
  assert.equal(result.status, 503);
  assert.deepEqual(result.body, { error: 'budget_unavailable' });
  assert.equal(invalid.calls.length, 0);
  const blocked = await tempDir(t);
  await fsp.writeFile(
    path.join(blocked, 'x'),
    'a file where the folder should be',
  );
  const unwritable = await install(t, { cacheDir: path.join(blocked, 'x') });
  const second = await unwritable.frames({ bbox: BOX });
  assert.equal(second.status, 503);
  assert.deepEqual(second.body, { error: 'budget_unavailable' });
  assert.equal(unwritable.calls.length, 0);
});

test('[beemaps-source-018] sends 2 of 5 requests at the same time and answers 429 to the others when the daily limit is 2', async (t) => {
  const server = await install(t, { env: { BEEMAPS_DAILY_QUERIES: '2' } });
  const results = await Promise.all(
    [0, 1, 2, 3, 4].map((n) => server.frames({ bbox: boxAt(n) })),
  );
  assert.deepEqual(
    results.map((r) => r.status).sort(),
    [200, 200, 429, 429, 429],
  );
  assert.equal(server.calls.length, 2);
  assert.deepEqual(await server.budget(), { date: '2026-10-15', count: 2 });
});

test('[beemaps-source-028] gives the shape of the answer with the budget and the credits', async (t) => {
  const server = await install(t);
  const result = await server.frames({
    bbox: BOX,
    since: '2026-10-01',
    limit: 2,
  });
  assert.equal(result.status, 200);
  assert.deepEqual(Object.keys(result.body).sort(), [
    'budget',
    'cached',
    'count',
    'credits',
    'frames',
    'since',
    'source',
    'total',
    'truncated',
  ]);
  assert.equal(result.body.source, 'Bee Maps');
  assert.equal(result.body.count, 2);
  assert.equal(result.body.total, 3);
  assert.equal(result.body.since, '2026-10-01');
  assert.equal(result.body.cached, false);
  assert.deepEqual(result.body.budget, { used: 1, limit: 20 });
  assert.deepEqual(result.body.credits, { used: 3, remaining: 997, cost: 0.5 });
  assert.equal(result.body.frames.length, 2);
  assert.equal((await server.frames({ bbox: boxAt(1) })).body.since, null);
});

test('[beemaps-source-028] sets truncated when the total is above the limit or the list is above 5000 items', async (t) => {
  const cases = [
    [3, 2, true],
    [3, 3, false],
    [3, 100, false],
    [5000, 200, true],
    [5001, 200, true],
  ];
  for (const [items, limit, truncated] of cases) {
    const server = await install(t, { respond: () => ok(document(items)) });
    const result = await server.frames({ bbox: BOX, limit });
    assert.equal(result.body.truncated, truncated, `${items} ${limit}`);
    assert.equal(result.body.total, Math.min(items, 5000));
  }
  const exact = await install(t, { respond: () => ok(document(200)) });
  assert.equal(
    (await exact.frames({ bbox: BOX, limit: 200 })).body.truncated,
    false,
  );
  const same = (count) =>
    ok({ frames: Array.from({ length: count }, () => frame(0)) });
  const repeated = await install(t, { respond: () => same(5001) });
  const cut = await repeated.frames({ bbox: BOX, limit: 200 });
  assert.equal(cut.body.total, 1);
  assert.equal(cut.body.truncated, true);
  const fewer = await install(t, { respond: () => same(5000) });
  const whole = await fewer.frames({ bbox: BOX, limit: 200 });
  assert.equal(whole.body.total, 1);
  assert.equal(whole.body.truncated, false);
  const over = await install(t, { respond: () => ok(document(5001)) });
  const result = await over.frames({ bbox: BOX, limit: 200 });
  assert.equal(result.body.total, 5000);
  assert.equal(
    (await over.frames({ bbox: BOX, limit: 5 })).body.truncated,
    true,
  );
});

test('[beemaps-source-028] sets the headers Content-Type and Cache-Control on each answer of the frames route', async (t) => {
  const server = await install(t, { env: { BEEMAPS_API_KEY: '' } });
  const answers = [
    await server.frames({ bbox: BOX }, { method: 'GET' }),
    await server.frames(
      { bbox: BOX },
      { headers: { origin: 'http://evil.example' } },
    ),
    await server.frames('x'),
    await server.frames({ bbox: BOX }),
  ];
  server.env.BEEMAPS_API_KEY = KEY;
  answers.push(await server.frames({ bbox: BOX }));
  answers.push(await server.frames({ bbox: BOX }));
  assert.deepEqual(
    answers.map((a) => a.status),
    [405, 403, 400, 503, 200, 200],
  );
  for (const answer of answers) {
    assert.equal(
      answer.headers['content-type'],
      'application/json; charset=utf-8',
    );
    assert.equal(answer.headers['cache-control'], 'no-store');
  }
});
