import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fsp } from 'node:fs';
import { Readable } from 'node:stream';
import { inspect } from 'node:util';
import os from 'node:os';
import path from 'node:path';
import { beemapsBurstProxy } from '../../server/providers/beemaps-burst.js';
import { createAudit } from '../../server/providers/beemaps-burst/audit.js';
import { localProviderPlugins } from '../../server/providers/local.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const KEY = 'fixture-burst-key-Z9y8';
const HOST = '127.0.0.1:5173';
const BASE = '/api/beemaps/burst';
const STATUS = `${BASE}/status`;
const QUOTE = `${BASE}/quote`;
const CONFIRM = `${BASE}/confirm`;
const LIST = `${BASE}/list`;
const CREATE_URL = 'https://beemaps.com/api/developer/burst/create';
const LIST_URL = 'https://beemaps.com/api/developer/bursts?limit=100';
const BOX = [9.982014, 59.991007, 10.017986, 60.008993];
const GOOD_HEADERS = {
  host: HOST,
  origin: `http://${HOST}`,
  'content-type': 'application/json',
};
const BURST = {
  _id: '6501aa11bb22cc33dd44ee55',
  geojson: {
    type: 'Polygon',
    coordinates: [
      [
        [9.982014, 59.991007],
        [10.017986, 59.991007],
        [10.017986, 60.008993],
        [9.982014, 60.008993],
        [9.982014, 59.991007],
      ],
    ],
  },
  amount: 125,
  status: 'active',
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
  isHit: false,
  createdAt: `CANARY-created ${KEY}`,
};
const created = () =>
  new Response(
    JSON.stringify({ success: true, bursts: [BURST], creditsRemaining: 500 }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
const listing = (bursts = [BURST], total = bursts.length) =>
  new Response(JSON.stringify({ bursts, total }), { status: 200 });
const failure = (code, headers = {}) =>
  new Response(`{"error":"CANARY-echo ${KEY}"}`, { status: code, headers });
const idem = (n) => `key-${String(n).padStart(12, '0')}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(check) {
  for (let i = 0; i < 400 && !check(); i++) await sleep(5);
  assert.equal(check(), true, 'the wait ended before the check was true');
}
const gate = () => {
  let open;
  const opened = new Promise((resolve) => (open = resolve));
  return { opened, open };
};

async function tempDir(t) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'gev-burst-proxy-'));
  t.after(() => fsp.rm(dir, { recursive: true, force: true }));
  return dir;
}
const readJson = async (dir, name) => {
  try {
    return JSON.parse(await fsp.readFile(path.join(dir, name), 'utf8'));
  } catch {
    return null;
  }
};

/**
 * Install the plugin on a fake middleware list. The clock, the timers, the
 * fetch function and the audit file are fake. The two durable files are real,
 * in a temporary folder, and `events` records the order of their writes, of the
 * audit lines and of the fetch calls.
 */
async function install(
  t,
  { env = {}, respond, hooks = {}, cacheDir, preview = false, audit } = {},
) {
  const dir = cacheDir ?? (await tempDir(t));
  const clock = { t: NOW };
  const events = [];
  const calls = [];
  const strays = [];
  const timers = [];
  const cleared = [];
  const lines = [];
  const consoleLines = [];
  const environment = {
    BEEMAPS_BURST_ENABLED: 'true',
    BEEMAPS_BURST_API_KEY: KEY,
    ...env,
  };
  const fetchImpl = async (url, init) => {
    events.push(`fetch ${init.method ?? 'GET'}`);
    calls.push({ url, init });
    if (![CREATE_URL, LIST_URL].includes(String(url))) {
      strays.push(String(url));
      throw new Error('request to another URL');
    }
    if (respond) return respond(url, init, calls.length);
    return String(url) === CREATE_URL ? created() : listing();
  };
  const fsLayer = {
    readFile: (...args) => fsp.readFile(...args),
    mkdir: (...args) => fsp.mkdir(...args),
    writeFile: async (file, text, encoding) => {
      if (hooks.writeFile) await hooks.writeFile(file, text);
      await fsp.writeFile(file, text, encoding);
      events.push(`write ${path.basename(file)}`);
    },
    rename: async (from, to) => {
      await fsp.rename(from, to);
      events.push(`rename ${path.basename(to)}`);
    },
  };
  let counter = 0;
  const plugin = beemapsBurstProxy({
    env: environment,
    fetchImpl,
    now: () => clock.t,
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
    cacheDir: dir,
    audit:
      audit ??
      createAudit({
        now: () => clock.t,
        append: async (line) => {
          if (hooks.audit) await hooks.audit(JSON.parse(line));
          lines.push(JSON.parse(line));
          events.push(`audit ${JSON.parse(line).outcome}`);
        },
      }),
    randomId: () => `request-${++counter}`,
    fs: fsLayer,
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
  for (const method of [
    'log',
    'info',
    'warn',
    'error',
    'debug',
    'dir',
    'trace',
  ]) {
    t.mock.method(console, method, (...args) =>
      consoleLines.push(args.map((arg) => inspect(arg)).join(' ')),
    );
  }

  async function request(url, options = {}) {
    const {
      method = 'POST',
      body,
      headers = {},
      remote = '127.0.0.1',
      failing = false,
      endFails = false,
    } = options;
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    const source = failing
      ? (async function* () {
          yield Buffer.from('{"quoteId":');
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
      get headersSent() {
        return this.statusCode !== undefined;
      },
      end(chunk) {
        this.text = chunk;
        if (endFails) throw new Error('socket closed');
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
  const quote = (bbox = BOX, extra = {}, options = {}) =>
    request(QUOTE, { body: { bbox, ...extra }, ...options });
  const confirm = (quoteId, key, options = {}) =>
    request(CONFIRM, { body: { quoteId, idempotencyKey: key }, ...options });
  /** Ask for a quote, then confirm it with a key. */
  const flow = async (n, bbox = BOX) => {
    const quoted = await quote(bbox);
    assert.equal(quoted.status, 200, quoted.text);
    return confirm(quoted.body.quoteId, idem(n));
  };
  return {
    plugin,
    uses,
    routes,
    request,
    quote,
    confirm,
    flow,
    calls,
    timers,
    cleared,
    events,
    lines,
    consoleLines,
    clock,
    dir,
    env: environment,
    credits: () => readJson(dir, 'credits.json'),
    ledger: () => readJson(dir, 'ledger.json'),
    files: () => fsp.readdir(dir),
  };
}

test('[beemaps-burst-control-001] mounts the four routes and the plugin name is beemaps-burst-proxy', async (t) => {
  const server = await install(t);
  assert.equal(server.plugin.name, 'beemaps-burst-proxy');
  assert.deepEqual(server.uses.sort(), [CONFIRM, LIST, QUOTE, STATUS]);
  const preview = await install(t, { preview: true });
  assert.deepEqual(preview.uses.sort(), [CONFIRM, LIST, QUOTE, STATUS]);
  assert.equal((await preview.request(STATUS, { method: 'GET' })).status, 200);
  assert.equal((await preview.quote()).status, 200);
});

test('[beemaps-burst-control-001] passes every other path to next with no answer', async (t) => {
  const server = await install(t);
  for (const url of [
    `${BASE}/other`,
    BASE,
    `${BASE}/`,
    '/api/beemaps/frames',
    '/api/beemaps/status',
    `${BASE}/quotex`,
    `${BASE}/quote/extra`,
  ]) {
    const result = await server.request(url, { method: 'GET' });
    assert.equal(result.next, true, url);
    assert.equal(result.status, undefined, url);
  }
  assert.equal(
    (await server.request(`${QUOTE}?x=1`, { body: { bbox: BOX } })).status,
    200,
  );
});

test('[beemaps-burst-control-001] puts the plugin once in the list of local provider plugins, after beemaps-proxy', () => {
  const names = localProviderPlugins().map((plugin) => plugin.name);
  assert.equal(
    names.filter((name) => name === 'beemaps-burst-proxy').length,
    1,
  );
  assert.equal(
    names.indexOf('beemaps-burst-proxy'),
    names.indexOf('beemaps-proxy') + 1,
  );
});

test('[beemaps-burst-control-002] reads the flag as exactly true, and refuses quote, confirm and list with burst_off otherwise', async (t) => {
  for (const flag of [
    'TRUE',
    'True',
    '1',
    'yes',
    ' true',
    'true ',
    '',
    undefined,
    'false',
  ]) {
    const server = await install(t, { env: { BEEMAPS_BURST_ENABLED: flag } });
    const status = await server.request(STATUS, { method: 'GET' });
    assert.equal(status.body.enabled, false, String(flag));
    const quoted = await server.quote();
    assert.deepEqual(
      [quoted.status, quoted.body],
      [403, { error: 'burst_off' }],
      String(flag),
    );
    const confirmed = await server.confirm('a'.repeat(32), idem(1));
    assert.deepEqual(
      [confirmed.status, confirmed.body],
      [403, { error: 'burst_off' }],
      String(flag),
    );
    const listed = await server.request(LIST, { body: {} });
    assert.deepEqual(
      [listed.status, listed.body],
      [403, { error: 'burst_off' }],
      String(flag),
    );
    assert.equal(server.calls.length, 0);
    assert.deepEqual(await server.files(), []);
  }
  const on = await install(t, { env: { BEEMAPS_BURST_ENABLED: 'true' } });
  assert.equal(
    (await on.request(STATUS, { method: 'GET' })).body.enabled,
    true,
  );
});

test('[beemaps-burst-control-003] needs the key BEEMAPS_BURST_API_KEY, trimmed, and not the key of the frames provider', async (t) => {
  for (const env of [
    { BEEMAPS_BURST_API_KEY: undefined, BEEMAPS_API_KEY: 'frames-key' },
    { BEEMAPS_BURST_API_KEY: '   ' },
    { BEEMAPS_BURST_API_KEY: '' },
  ]) {
    const server = await install(t, { env });
    assert.equal(
      (await server.request(STATUS, { method: 'GET' })).body.configured,
      false,
    );
    for (const [label, result] of [
      ['quote', await server.quote()],
      ['confirm', await server.confirm('a'.repeat(32), idem(1))],
      ['list', await server.request(LIST, { body: {} })],
    ])
      assert.deepEqual(
        [result.status, result.body],
        [403, { error: 'no_key' }],
        label,
      );
    assert.equal(server.calls.length, 0);
  }
});

test('[beemaps-burst-control-003] sends the trimmed key of its own in the header Authorization', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_BURST_API_KEY: `  ${KEY}  `, BEEMAPS_API_KEY: 'frames-key' },
  });
  assert.equal(
    (await server.request(STATUS, { method: 'GET' })).body.configured,
    true,
  );
  assert.equal((await server.flow(1)).status, 200);
  assert.equal((await server.request(LIST, { body: {} })).status, 200);
  assert.deepEqual(
    server.calls.map((call) => call.init.headers.Authorization),
    [`Basic ${KEY}`, `Basic ${KEY}`],
  );
});

test('[beemaps-burst-control-004] answers the status with exactly five fields and the defaults 125, 125 and 625', async (t) => {
  const server = await install(t);
  const result = await server.request(STATUS, { method: 'GET' });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    enabled: true,
    configured: true,
    minCredits: 125,
    maxCredits: 125,
    dailyCredits: 625,
  });
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(result.text.includes(KEY), false);
  assert.equal(server.calls.length, 0);
});

test('[beemaps-burst-control-004] takes maxCredits and dailyCredits from digits and uses the default for a value below the limit', async (t) => {
  const wide = await install(t, {
    env: {
      BEEMAPS_BURST_MAX_CREDITS: '250',
      BEEMAPS_BURST_DAILY_CREDITS: '1000',
    },
  });
  const a = (await wide.request(STATUS, { method: 'GET' })).body;
  assert.deepEqual([a.maxCredits, a.dailyCredits], [250, 1000]);
  const low = await install(t, {
    env: { BEEMAPS_BURST_MAX_CREDITS: '124', BEEMAPS_BURST_DAILY_CREDITS: '0' },
  });
  const b = (await low.request(STATUS, { method: 'GET' })).body;
  assert.deepEqual([b.maxCredits, b.dailyCredits], [125, 625]);
});

test('[beemaps-burst-control-004] uses the same-site gate and answers 405 to another method', async (t) => {
  const server = await install(t);
  const foreign = await server.request(STATUS, {
    method: 'GET',
    headers: { origin: 'http://evil.example' },
  });
  assert.equal(foreign.status, 403);
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const result = await server.request(STATUS, { method });
    assert.deepEqual(
      [result.status, result.body],
      [405, { error: 'Method not allowed' }],
      method,
    );
  }
});

test('[beemaps-burst-control-005] answers 405 to a GET, a PUT and a DELETE on quote, confirm and list and sends and writes nothing', async (t) => {
  const server = await install(t);
  for (const url of [QUOTE, CONFIRM, LIST])
    for (const method of ['GET', 'PUT', 'DELETE']) {
      const result = await server.request(url, { method, body: undefined });
      assert.deepEqual(
        [result.status, result.body],
        [405, { error: 'Method not allowed' }],
        `${method} ${url}`,
      );
    }
  assert.equal(server.calls.length, 0);
  assert.deepEqual(await server.files(), []);
  assert.deepEqual(server.lines, []);
});

const BREAKS = [
  { remote: '192.168.1.20' },
  { remote: '::ffff:10.0.0.5' },
  { headers: { 'x-forwarded-for': '10.0.0.5' } },
  { headers: { host: 'evil.example', origin: 'http://evil.example' } },
  { headers: { origin: 'http://evil.example' } },
  { headers: { 'content-type': 'text/plain' } },
];

test('[beemaps-burst-control-006] answers 403 cross_origin to a POST that breaks one of the five rules and does not read the body', async (t) => {
  for (const url of [QUOTE, CONFIRM, LIST]) {
    for (const flag of ['true', undefined]) {
      const server = await install(t, { env: { BEEMAPS_BURST_ENABLED: flag } });
      for (const broken of BREAKS) {
        const result = await server.request(url, {
          body: { bbox: BOX },
          ...broken,
        });
        assert.deepEqual(
          [result.status, result.body],
          [403, { error: 'cross_origin' }],
          `${url} ${JSON.stringify(broken)}`,
        );
        assert.notEqual(result.read, true);
      }
      assert.equal(server.calls.length, 0);
      assert.deepEqual(await server.files(), []);
      assert.deepEqual(server.lines, []);
    }
  }
});

test('[beemaps-burst-control-006] passes a POST that keeps the five rules from each loopback address', async (t) => {
  const server = await install(t);
  for (const remote of ['127.0.0.1', '::1', '::ffff:127.0.0.1']) {
    const result = await server.quote(BOX, {}, { remote });
    assert.equal(result.status, 200);
    const other = await server.request(QUOTE, { body: { bbox: BOX }, remote });
    assert.equal(other.status, 200);
  }
});

test('[beemaps-burst-control-006] counts a request from another machine against no rate limit', async (t) => {
  const server = await install(t);
  for (let n = 0; n < 12; n += 1)
    assert.equal(
      (
        await server.request(QUOTE, {
          body: { bbox: BOX },
          remote: '192.168.1.20',
        })
      ).status,
      403,
    );
  assert.equal((await server.quote()).status, 200);
});

/** A fake upstream that can hold the next create call until a test opens it. */
function holdable() {
  const state = { gate: null };
  return {
    hold() {
      state.gate = gate();
      return state.gate;
    },
    respond: () => (state.gate ? state.gate.opened.then(created) : created()),
  };
}
const exhaustRate = async (server, url = CONFIRM, count = 3) => {
  for (let n = 0; n < count; n += 1) await server.request(url, { body: {} });
};

test('[beemaps-burst-control-007] names the first broken step for each pair of neighbours in the list of steps of a confirm', async (t) => {
  const answer = (result) => [result.status, result.body.error];
  // method and local request
  let server = await install(t);
  assert.deepEqual(
    answer(
      await server.request(CONFIRM, { method: 'GET', remote: '192.168.1.20' }),
    ),
    [405, 'Method not allowed'],
  );
  // local request and rate limit
  server = await install(t);
  await exhaustRate(server);
  assert.deepEqual(
    answer(await server.request(CONFIRM, { body: {}, remote: '192.168.1.20' })),
    [403, 'cross_origin'],
  );
  // rate limit and flag
  server = await install(t, { env: { BEEMAPS_BURST_ENABLED: undefined } });
  await exhaustRate(server);
  assert.deepEqual(answer(await server.request(CONFIRM, { body: {} })), [
    429,
    'rate_limited',
  ]);
  // flag and key
  server = await install(t, {
    env: { BEEMAPS_BURST_ENABLED: undefined, BEEMAPS_BURST_API_KEY: undefined },
  });
  assert.deepEqual(answer(await server.request(CONFIRM, { body: {} })), [
    403,
    'burst_off',
  ]);
  // key and body
  server = await install(t, { env: { BEEMAPS_BURST_API_KEY: undefined } });
  assert.deepEqual(
    answer(await server.request(CONFIRM, { body: 'not json' })),
    [403, 'no_key'],
  );
  // body and busy
  const slow = holdable();
  server = await install(t, { respond: slow.respond });
  let opened = slow.hold();
  const quoted = await server.quote();
  const first = server.confirm(quoted.body.quoteId, idem(1));
  await waitFor(() => server.calls.length === 1);
  assert.deepEqual(
    answer(await server.request(CONFIRM, { body: 'not json' })),
    [400, 'bad_body'],
  );
  // busy and idempotency key
  assert.deepEqual(answer(await server.confirm('b'.repeat(32), idem(1))), [
    409,
    'busy',
  ]);
  opened.open();
  assert.equal((await first).status, 200);
  // idempotency key and hold
  server = await install(t, { respond: () => failure(403) });
  const q1 = await server.quote();
  assert.equal((await server.confirm(q1.body.quoteId, idem(1))).status, 403);
  const q2 = await server.quote();
  assert.deepEqual(answer(await server.confirm(q2.body.quoteId, idem(1))), [
    409,
    'key_reused',
  ]);
  // hold and quote
  const held = await server.confirm('c'.repeat(32), idem(2));
  assert.deepEqual(
    [held.status, held.body.error, held.body.held],
    [403, 'key_rejected', true],
  );
  // quote and budget
  server = await install(t, { env: { BEEMAPS_BURST_DAILY_CREDITS: '125' } });
  const used = await server.quote();
  assert.equal((await server.confirm(used.body.quoteId, idem(1))).status, 200);
  assert.deepEqual(answer(await server.confirm('d'.repeat(32), idem(2))), [
    410,
    'quote_expired',
  ]);
});

test('[beemaps-burst-control-007] names the first broken step among the budget, the audit line, the record of the attempt and the upstream request', async (t) => {
  const answer = (result) => [result.status, result.body.error];
  // budget and audit line: the budget is used, and the audit write would fail
  let server = await install(t, {
    env: { BEEMAPS_BURST_DAILY_CREDITS: '125' },
    hooks: {
      audit: async () => {
        throw new Error('disk full');
      },
    },
  });
  const a = await server.quote();
  const b = await server.quote();
  await server.confirm(a.body.quoteId, idem(1));
  const before = server.events.filter((e) => e.startsWith('audit')).length;
  assert.deepEqual(answer(await server.confirm(b.body.quoteId, idem(2))), [
    403,
    'budget_used',
  ]);
  assert.equal(
    server.events.filter((e) => e.startsWith('audit')).length,
    before,
  );
  // audit line and record of the attempt: both writes fail
  let ledgerWrites = 0;
  server = await install(t, {
    hooks: {
      audit: async (line) => {
        if (line.outcome === 'accepted') throw new Error('disk full');
      },
      writeFile: async (file) => {
        if (file.includes('ledger')) {
          ledgerWrites += 1;
          throw new Error('disk full');
        }
      },
    },
  });
  const c = await server.quote();
  assert.deepEqual(answer(await server.confirm(c.body.quoteId, idem(3))), [
    500,
    'log_failed',
  ]);
  assert.equal(ledgerWrites, 0);
  assert.equal(server.calls.length, 0);
  // record of the attempt and upstream request
  server = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (file.includes('ledger')) throw new Error('disk full');
      },
    },
  });
  const d = await server.quote();
  assert.deepEqual(answer(await server.confirm(d.body.quoteId, idem(4))), [
    500,
    'ledger_unavailable',
  ]);
  assert.equal(server.calls.length, 0);
  // all steps pass: one upstream request
  server = await install(t);
  const e = await server.quote();
  assert.equal((await server.confirm(e.body.quoteId, idem(5))).status, 200);
  assert.equal(server.calls.length, 1);
});

test('[beemaps-burst-control-012] gives a quote with the id, 120 seconds, the request and the budget, and sends and writes nothing', async (t) => {
  const server = await install(t);
  const result = await server.quote();
  assert.equal(result.status, 200);
  assert.match(result.body.quoteId, /^[0-9a-f]{32}$/);
  assert.deepEqual(
    { ...result.body, quoteId: 'x' },
    {
      quoteId: 'x',
      expiresInSeconds: 120,
      request: { bbox: BOX, areaKm2: 4, credits: 125 },
      budget: { used: 0, limit: 625, remaining: 625 },
    },
  );
  assert.equal(result.headers['cache-control'], 'no-store');
  assert.equal(server.calls.length, 0);
  assert.deepEqual(await server.files(), []);
});

test('[beemaps-burst-control-012] rounds a box with more than 6 decimals and gives the budget after a confirm', async (t) => {
  const server = await install(t);
  const result = await server.quote([
    9.9820144, 59.9910074, 10.0179856, 60.0089926,
  ]);
  assert.deepEqual(result.body.request.bbox, BOX);
  assert.equal((await server.flow(1)).status, 200);
  assert.deepEqual((await server.quote()).body.budget, {
    used: 125,
    limit: 625,
    remaining: 500,
  });
});

test('[beemaps-burst-control-008] answers 400 bad_body to a body that is too large or fails while it is read, for quote, confirm and list', async (t) => {
  const server = await install(t);
  const big = 'x'.repeat(5000);
  assert.deepEqual((await server.request(QUOTE, { body: big })).body, {
    error: 'bad_body',
  });
  assert.deepEqual(
    (await server.request(CONFIRM, { body: 'y'.repeat(1025) })).body,
    { error: 'bad_body' },
  );
  assert.deepEqual(
    (await server.request(LIST, { body: 'z'.repeat(1025) })).body,
    { error: 'bad_body' },
  );
  for (const url of [QUOTE, CONFIRM, LIST])
    assert.deepEqual(
      (await server.request(url, { failing: true, body: '' })).body,
      { error: 'bad_body' },
      url,
    );
});

test('[beemaps-burst-control-014] refuses a quote that the budget cannot pay with 403 budget_used, and gives a quote for exactly the credits that remain', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_BURST_DAILY_CREDITS: '250' },
  });
  assert.equal((await server.flow(1)).status, 200);
  const exact = await server.quote();
  assert.deepEqual(exact.body.budget, {
    used: 125,
    limit: 250,
    remaining: 125,
  });
  assert.equal((await server.confirm(exact.body.quoteId, idem(2))).status, 200);
  const refused = await server.quote();
  assert.deepEqual(
    [refused.status, refused.body],
    [403, { error: 'budget_used', used: 250, limit: 250 }],
  );
});

test('[beemaps-burst-control-014] answers 500 budget_unavailable to a quote when the budget file cannot be read', async (t) => {
  const dir = await tempDir(t);
  await fsp.writeFile(path.join(dir, 'credits.json'), 'not json');
  const server = await install(t, { cacheDir: dir });
  const refused = await server.quote();
  assert.deepEqual(
    [refused.status, refused.body],
    [500, { error: 'budget_unavailable' }],
  );
  assert.equal(
    await fsp.readFile(path.join(dir, 'credits.json'), 'utf8'),
    'not json',
  );
});

test('[beemaps-burst-control-013] ends a quote 120 seconds after it was made, and uses it up at the quote step for every outcome', async (t) => {
  const server = await install(t);
  const a = await server.quote();
  server.clock.t += 119_999;
  assert.equal((await server.confirm(a.body.quoteId, idem(1))).status, 200);
  const b = await server.quote();
  server.clock.t += 120_000;
  const late = await server.confirm(b.body.quoteId, idem(2));
  assert.deepEqual([late.status, late.body], [410, { error: 'quote_expired' }]);
  const again = await server.confirm(a.body.quoteId, idem(3));
  assert.deepEqual(
    [again.status, again.body],
    [410, { error: 'quote_expired' }],
  );
});

test('[beemaps-burst-control-013] gives quote_expired for the same quote with a new key after the hold of a refusal or of an unknown outcome has ended', async (t) => {
  for (const respond of [() => failure(403), () => failure(500)]) {
    const server = await install(t, { respond });
    const quoted = await server.quote();
    const first = await server.confirm(quoted.body.quoteId, idem(1));
    assert.notEqual(first.status, 200);
    server.clock.t += 601_000;
    const second = await server.confirm(quoted.body.quoteId, idem(2));
    assert.deepEqual(
      [second.status, second.body],
      [410, { error: 'quote_expired' }],
    );
    assert.equal(server.calls.length, 1);
  }
});

const OUTCOMES = {
  created: () => created(),
  'status 400': () => failure(400),
  'status 401': () => failure(401),
  'status 402': () => failure(402),
  'status 403': () => failure(403),
  'status 429': () => failure(429, { 'retry-after': '30' }),
  'status 500': () => failure(500),
  'status 200 without success': () =>
    new Response('{"success":false}', { status: 200 }),
  'a fetch function that rejects': () => {
    throw new TypeError(`fetch failed ${KEY}`);
  },
};

test('[beemaps-burst-control-020] sends exactly one upstream request for each kind of outcome, also after 10 minutes and every timer', async (t) => {
  for (const [label, respond] of Object.entries(OUTCOMES)) {
    const server = await install(t, { respond });
    await server.flow(1);
    assert.equal(server.calls.length, 1, label);
    server.clock.t += 600_000;
    for (const timer of server.timers) timer.fn();
    await sleep(20);
    assert.equal(server.calls.length, 1, label);
  }
});

test('[beemaps-burst-control-020] sends one upstream request and ends in an unknown outcome when the 30 seconds end', async (t) => {
  const stalled = (url, init) =>
    new Promise((resolve, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const server = await install(t, { respond: stalled });
  const quoted = await server.quote();
  const pending = server.confirm(quoted.body.quoteId, idem(1));
  await waitFor(() => server.calls.length === 1);
  assert.equal(server.timers.at(-1).ms, 30000);
  server.timers.at(-1).fn();
  const result = await pending;
  assert.deepEqual(
    [result.status, result.body],
    [502, { ok: false, outcome: 'unknown', error: 'outcome_unknown' }],
  );
  assert.equal(server.calls.length, 1);
});

test('[beemaps-burst-control-020] answers busy to a confirm while another runs, and not after it ends', async (t) => {
  const slow = holdable();
  const server = await install(t, { respond: slow.respond });
  const opened = slow.hold();
  const [q1, q2, q3] = [
    await server.quote(),
    await server.quote(),
    await server.quote(),
  ];
  const first = server.confirm(q1.body.quoteId, idem(1));
  await waitFor(() => server.calls.length === 1);
  const second = await server.confirm(q2.body.quoteId, idem(2));
  assert.deepEqual([second.status, second.body], [409, { error: 'busy' }]);
  assert.equal(server.calls.length, 1);
  opened.open();
  assert.equal((await first).status, 200);
  assert.equal((await server.confirm(q3.body.quoteId, idem(3))).status, 200);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-burst-control-020] gives one upstream request and two answers busy for three confirms at the same time', async (t) => {
  const slow = holdable();
  const server = await install(t, { respond: slow.respond });
  const opened = slow.hold();
  const ids = [];
  for (let n = 0; n < 3; n += 1) ids.push((await server.quote()).body.quoteId);
  const all = ids.map((id, n) => server.confirm(id, idem(n + 1)));
  await sleep(50);
  opened.open();
  const results = await Promise.all(all);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 409, 409]);
  assert.deepEqual(
    results.filter((r) => r.status === 409).map((r) => r.body),
    [{ error: 'busy' }, { error: 'busy' }],
  );
  assert.equal(server.calls.length, 1);
});

test('[beemaps-burst-control-021] writes credits.json with the date and 125 credits before the fake upstream gets its request', async (t) => {
  const server = await install(t);
  await server.flow(1);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 125,
  });
  assert.equal(
    server.events.indexOf('write credits.json') <
      server.events.indexOf('fetch POST'),
    true,
  );
  assert.equal(server.events.indexOf('write credits.json') >= 0, true);
});

test('[beemaps-burst-control-021] keeps the credits counted after a refusal, an unknown outcome, a log failure and a ledger failure', async (t) => {
  for (const respond of [() => failure(403), () => failure(500)]) {
    const server = await install(t, { respond });
    await server.flow(1);
    assert.deepEqual(await server.credits(), {
      date: '2026-10-15',
      credits: 125,
    });
  }
  const noLog = await install(t, {
    hooks: {
      audit: async () => {
        throw new Error('disk full');
      },
    },
  });
  assert.equal((await noLog.flow(1)).body.error, 'log_failed');
  assert.deepEqual(await noLog.credits(), { date: '2026-10-15', credits: 125 });
  const noLedger = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (file.includes('ledger')) throw new Error('disk full');
      },
    },
  });
  assert.equal((await noLedger.flow(1)).body.error, 'ledger_unavailable');
  assert.deepEqual(await noLedger.credits(), {
    date: '2026-10-15',
    credits: 125,
  });
});

test('[beemaps-burst-control-021] continues from the credits in the file with a new plugin, and starts again on a new UTC day', async (t) => {
  const first = await install(t);
  await first.flow(1);
  const second = await install(t, { cacheDir: first.dir });
  assert.deepEqual((await second.quote()).body.budget, {
    used: 125,
    limit: 625,
    remaining: 500,
  });
  second.clock.t = Date.UTC(2026, 9, 16, 0, 0, 0);
  assert.deepEqual((await second.quote()).body.budget, {
    used: 0,
    limit: 625,
    remaining: 625,
  });
});

test('[beemaps-burst-control-022] passes five confirms of 125 credits with the clock moved 61 seconds after each, and refuses the sixth with budget_used', async (t) => {
  const server = await install(t);
  for (let n = 1; n <= 5; n += 1) {
    const result = await server.flow(n);
    assert.equal(result.status, 200, `confirm ${n}`);
    server.clock.t += 61_000;
  }
  const quoted = await server.quote();
  assert.equal(quoted.status, 403);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 625,
  });
  assert.deepEqual(server.calls.length, 5);
});

test('[beemaps-burst-control-022] answers budget_used to a confirm when the daily limit is used and sends no request', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_BURST_DAILY_CREDITS: '125' },
  });
  const a = await server.quote();
  const b = await server.quote();
  assert.equal((await server.confirm(a.body.quoteId, idem(1))).status, 200);
  const refused = await server.confirm(b.body.quoteId, idem(2));
  assert.deepEqual(
    [refused.status, refused.body],
    [403, { error: 'budget_used', used: 125, limit: 125 }],
  );
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 125,
  });
});

test('[beemaps-burst-control-023] answers 500 budget_unavailable to a confirm when the file cannot be written, and sends no request', async (t) => {
  let fail = true;
  const server = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (fail && file.includes('credits')) throw new Error('disk full');
      },
    },
  });
  const quoted = await server.quote();
  const refused = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [refused.status, refused.body],
    [500, { error: 'budget_unavailable' }],
  );
  assert.equal(server.calls.length, 0);
  fail = false;
  const next = await server.quote();
  assert.equal((await server.confirm(next.body.quoteId, idem(2))).status, 200);
});

test('[beemaps-burst-control-024] answers a repeat of a created burst with the same burst, replayed true, and sends nothing', async (t) => {
  const server = await install(t);
  const quoted = await server.quote();
  const first = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(first.body, {
    ok: true,
    outcome: 'created',
    replayed: false,
    burst: {
      id: BURST._id,
      status: 'active',
      validUntil: BURST.validUntil,
      credits: 125,
    },
    creditsRemaining: 500,
  });
  server.clock.t += 60_000;
  const again = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [again.status, again.body],
    [200, { ...first.body, replayed: true }],
  );
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 125,
  });
});

test('[beemaps-burst-control-025] answers a repeat of a refusal with the same status and error and replayed true, and sends nothing', async (t) => {
  for (const [respond, status, error] of [
    [() => failure(401), 403, 'key_rejected'],
    [() => failure(402), 402, 'no_credit'],
    [() => failure(400), 400, 'bad_request'],
  ]) {
    const server = await install(t, { respond });
    const quoted = await server.quote();
    const first = await server.confirm(quoted.body.quoteId, idem(1));
    assert.deepEqual(
      [first.status, first.body],
      [status, { ok: false, outcome: 'refused', error }],
    );
    server.clock.t += 700_000;
    const again = await server.confirm(quoted.body.quoteId, idem(1));
    assert.deepEqual(
      [again.status, again.body],
      [status, { ok: false, outcome: 'refused', error, replayed: true }],
    );
    assert.equal(server.calls.length, 1);
    assert.deepEqual(await server.credits(), {
      date: '2026-10-15',
      credits: 125,
    });
  }
});

test('[beemaps-burst-control-025] keeps retryAfter and the header Retry-After in the answer of a repeat of a 429', async (t) => {
  const server = await install(t, {
    respond: () => failure(429, { 'retry-after': '30' }),
  });
  const quoted = await server.quote();
  const first = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [first.status, first.body, first.headers['retry-after']],
    [
      429,
      {
        ok: false,
        outcome: 'refused',
        error: 'upstream_rate_limit',
        retryAfter: 30,
      },
      '30',
    ],
  );
  server.clock.t += 700_000;
  const again = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [again.status, again.body, again.headers['retry-after']],
    [
      429,
      {
        ok: false,
        outcome: 'refused',
        error: 'upstream_rate_limit',
        retryAfter: 30,
        replayed: true,
      },
      '30',
    ],
  );
});

test('[beemaps-burst-control-026] answers a repeat of an unknown outcome and of a pending record with 409 outcome_unknown and replayed true', async (t) => {
  const server = await install(t, { respond: () => failure(500) });
  const quoted = await server.quote();
  const first = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [first.status, first.body],
    [502, { ok: false, outcome: 'unknown', error: 'outcome_unknown' }],
  );
  const again = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [again.status, again.body],
    [
      409,
      {
        ok: false,
        outcome: 'unknown',
        error: 'outcome_unknown',
        replayed: true,
      },
    ],
  );
  assert.equal(server.calls.length, 1);
  const dir = await tempDir(t);
  await fsp.writeFile(
    path.join(dir, 'ledger.json'),
    JSON.stringify({
      records: [
        {
          key: idem(9),
          quoteId: 'e'.repeat(32),
          state: 'pending',
          time: NOW - 700_000,
        },
      ],
    }),
  );
  const restarted = await install(t, { cacheDir: dir });
  const pending = await restarted.confirm('e'.repeat(32), idem(9));
  assert.deepEqual(
    [pending.status, pending.body],
    [
      409,
      {
        ok: false,
        outcome: 'unknown',
        error: 'outcome_unknown',
        replayed: true,
      },
    ],
  );
  assert.equal(restarted.calls.length, 0);
  assert.equal(await restarted.credits(), null);
});

test('[beemaps-burst-control-027] answers 409 key_reused to a key that has a record, with another quote, before it checks the quote', async (t) => {
  const server = await install(t);
  const a = await server.quote();
  assert.equal((await server.confirm(a.body.quoteId, idem(1))).status, 200);
  const b = await server.quote();
  const reused = await server.confirm(b.body.quoteId, idem(1));
  assert.deepEqual(
    [reused.status, reused.body],
    [409, { error: 'key_reused' }],
  );
  const unknownQuote = await server.confirm('9'.repeat(32), idem(1));
  assert.deepEqual(
    [unknownQuote.status, unknownQuote.body],
    [409, { error: 'key_reused' }],
  );
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 125,
  });
});

test('[beemaps-burst-control-028] writes the record pending before the fake upstream gets its request and changes it to created', async (t) => {
  let snapshot = null;
  let server;
  server = await install(t, {
    respond: async () => {
      snapshot = await server.ledger();
      return created();
    },
  });
  const quoted = await server.quote();
  await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(snapshot, {
    records: [
      {
        key: idem(1),
        quoteId: quoted.body.quoteId,
        state: 'pending',
        time: NOW,
      },
    ],
  });
  assert.deepEqual((await server.ledger()).records, [
    {
      key: idem(1),
      quoteId: quoted.body.quoteId,
      state: 'created',
      time: NOW,
      burst: {
        id: BURST._id,
        status: 'active',
        validUntil: BURST.validUntil,
        credits: 125,
      },
      creditsRemaining: 500,
    },
  ]);
});

test('[beemaps-burst-control-028] answers a repeat after a restart from the record in the file alone', async (t) => {
  const first = await install(t);
  const quoted = await first.quote();
  const original = await first.confirm(quoted.body.quoteId, idem(1));
  const second = await install(t, { cacheDir: first.dir });
  const again = await second.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [again.status, again.body],
    [200, { ...original.body, replayed: true }],
  );
  assert.equal(second.calls.length, 0);
});

test('[beemaps-burst-control-039] answers 500 ledger_unavailable when the file is not valid, cannot be read or the write fails, and sends nothing', async (t) => {
  const dir = await tempDir(t);
  await fsp.writeFile(path.join(dir, 'ledger.json'), 'not json');
  const bad = await install(t, { cacheDir: dir });
  const q = await bad.quote();
  const result = await bad.confirm(q.body.quoteId, idem(1));
  assert.deepEqual(
    [result.status, result.body],
    [500, { error: 'ledger_unavailable' }],
  );
  assert.equal(bad.calls.length, 0);
  assert.equal(
    await fsp.readFile(path.join(dir, 'ledger.json'), 'utf8'),
    'not json',
  );
  assert.equal(await bad.credits(), null);
  await fsp.writeFile(
    path.join(dir, 'ledger.json'),
    JSON.stringify({ records: [] }),
  );
  const q2 = await bad.quote();
  assert.equal((await bad.confirm(q2.body.quoteId, idem(2))).status, 200);
});

test('[beemaps-burst-control-029] refuses every confirm with a new idempotency key during a hold of 300 seconds, 600 seconds or the seconds of Retry-After', async (t) => {
  for (const [respond, seconds, status, error] of [
    [() => failure(401), 300, 403, 'key_rejected'],
    [() => failure(403), 300, 403, 'key_rejected'],
    [() => failure(402), 600, 402, 'no_credit'],
    [
      () => failure(429, { 'retry-after': '30' }),
      30,
      429,
      'upstream_rate_limit',
    ],
  ]) {
    const server = await install(t, { respond });
    assert.equal((await server.flow(1)).status, status);
    server.clock.t += seconds * 1000 - 1;
    const held = await server.flow(2);
    assert.equal(held.status, status);
    assert.equal(held.body.error, error);
    assert.equal(held.body.held, true);
    assert.equal(held.body.ok, false);
    assert.equal(held.body.outcome, 'refused');
    assert.equal(server.calls.length, 1);
    assert.deepEqual(await server.credits(), {
      date: '2026-10-15',
      credits: 250 - 125,
    });
    server.clock.t += 1;
    await server.flow(3);
    assert.equal(server.calls.length, 2);
  }
});

test('[beemaps-burst-control-029] gives retryAfter and the header Retry-After to a confirm held by a 429', async (t) => {
  const server = await install(t, {
    respond: () => failure(429, { 'retry-after': '30' }),
  });
  await server.flow(1);
  server.clock.t += 10_500;
  const held = await server.flow(2);
  assert.deepEqual(held.body, {
    error: 'upstream_rate_limit',
    ok: false,
    outcome: 'refused',
    held: true,
    retryAfter: 20,
  });
  assert.equal(held.headers['retry-after'], '20');
  const other = await install(t, { respond: () => failure(403) });
  await other.flow(1);
  assert.equal(Object.hasOwn((await other.flow(2)).body, 'retryAfter'), false);
});

test('[beemaps-burst-control-029] starts no hold after a 400, and a new plugin has no hold of a refusal', async (t) => {
  const server = await install(t, { respond: () => failure(400) });
  await server.flow(1);
  assert.equal((await server.flow(2)).body.error, 'bad_request');
  assert.equal(server.calls.length, 2);
  const refused = await install(t, { respond: () => failure(403) });
  await refused.flow(1);
  const restarted = await install(t, {
    respond: () => created(),
    cacheDir: refused.dir,
  });
  assert.equal((await restarted.flow(2)).status, 200);
});

test('[beemaps-burst-control-040] refuses every confirm with a new key for 600 seconds after an unknown outcome, from the ledger file', async (t) => {
  const server = await install(t, { respond: () => failure(500) });
  const first = await server.flow(1);
  assert.equal(first.status, 502);
  const held = await server.flow(2);
  assert.deepEqual(
    [held.status, held.body],
    [
      409,
      {
        error: 'outcome_unknown',
        ok: false,
        outcome: 'unknown',
        held: true,
        retryAfter: 600,
      },
    ],
  );
  assert.equal(held.headers['retry-after'], '600');
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 125,
  });
  server.clock.t += 100_000;
  const later = await server.flow(3);
  assert.equal(later.body.retryAfter, 500);
  assert.equal(later.headers['retry-after'], '500');
  server.clock.t += 499_500;
  const last = await server.flow(4);
  assert.equal(last.body.retryAfter, 1);
  assert.equal(last.headers['retry-after'], '1');
});

test('[beemaps-burst-control-040] ends the hold after 600 seconds, keeps it after a restart, and answers a repeat of the key as in scenario 026', async (t) => {
  const server = await install(t, { respond: () => failure(500) });
  const quoted = await server.quote();
  await server.confirm(quoted.body.quoteId, idem(1));
  const restarted = await install(t, {
    respond: () => created(),
    cacheDir: server.dir,
  });
  assert.equal((await restarted.flow(2)).body.held, true);
  const again = await restarted.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(again.body, {
    ok: false,
    outcome: 'unknown',
    error: 'outcome_unknown',
    replayed: true,
  });
  restarted.clock.t += 600_000;
  assert.equal((await restarted.flow(3)).status, 200);
});

test('[beemaps-burst-control-030] writes the audit line accepted, and waits for the write to end, before the fake upstream gets its request', async (t) => {
  const open = gate();
  const server = await install(t, {
    hooks: {
      audit: (line) => (line.outcome === 'accepted' ? open.opened : undefined),
    },
  });
  const quoted = await server.quote();
  const pending = server.confirm(quoted.body.quoteId, idem(1));
  await sleep(50);
  assert.equal(server.calls.length, 0);
  assert.equal(server.events.includes('audit accepted'), false);
  open.open();
  assert.equal((await pending).status, 200);
  const order = server.events;
  assert.equal(
    order.indexOf('audit accepted') < order.indexOf('fetch POST'),
    true,
  );
  assert.equal(
    order.indexOf('fetch POST') < order.indexOf('audit created'),
    true,
  );
  assert.equal(
    order.indexOf('write credits.json') < order.indexOf('audit accepted'),
    true,
  );
});

test('[beemaps-burst-control-030] writes a second line created, refused or unknown when the confirm ends', async (t) => {
  for (const [respond, outcome] of [
    [() => created(), 'created'],
    [() => failure(403), 'refused'],
    [() => failure(500), 'unknown'],
  ]) {
    const server = await install(t, { respond });
    await server.flow(1);
    assert.deepEqual(
      server.lines.map((line) => line.outcome),
      ['accepted', outcome],
    );
  }
});

test('[beemaps-burst-control-030] answers 500 log_failed and sends no request when the write of the first line fails', async (t) => {
  const server = await install(t, {
    hooks: {
      audit: async () => {
        throw new Error('disk full');
      },
    },
  });
  const result = await server.flow(1);
  assert.deepEqual(
    [result.status, result.body],
    [500, { error: 'log_failed' }],
  );
  assert.equal(server.calls.length, 0);
  assert.equal(await server.ledger(), null);
});

const LINE_BASE = {
  time: '2026-10-15T12:00:00.000Z',
  requestId: 'request-1',
  reason: null,
  client: '127.0.0.1',
  bbox: BOX,
  areaKm2: 4,
  credits: 125,
  upstreamStatus: null,
  burstId: null,
  durationMs: null,
};

test('[beemaps-burst-control-031] writes the lines accepted and created with the 13 fields and the values of the attempt', async (t) => {
  const server = await install(t);
  const quoted = await server.quote();
  await server.confirm(quoted.body.quoteId, idem(1));
  const ids = { quoteId: quoted.body.quoteId, idempotencyKey: idem(1) };
  assert.deepEqual(server.lines, [
    { ...LINE_BASE, ...ids, outcome: 'accepted' },
    {
      ...LINE_BASE,
      ...ids,
      outcome: 'created',
      upstreamStatus: 200,
      burstId: BURST._id,
      durationMs: 0,
    },
  ]);
});

test('[beemaps-burst-control-031] writes the outcome refused with the reason and the status of Bee Maps, and unknown with the reason outcome_unknown', async (t) => {
  const refused = await install(t, { respond: () => failure(403) });
  await refused.flow(1);
  assert.deepEqual(
    refused.lines.map((line) => [
      line.outcome,
      line.reason,
      line.upstreamStatus,
      line.burstId,
    ]),
    [
      ['accepted', null, null, null],
      ['refused', 'key_rejected', 403, null],
    ],
  );
  const unknown = await install(t, { respond: () => failure(500) });
  await unknown.flow(1);
  assert.deepEqual(
    unknown.lines.map((line) => [
      line.outcome,
      line.reason,
      line.upstreamStatus,
    ]),
    [
      ['accepted', null, null],
      ['unknown', 'outcome_unknown', 500],
    ],
  );
});

test('[beemaps-burst-control-031] writes a line with the outcome blocked and the reason for each refusal of confirm after the local request', async (t) => {
  const reasons = async (server) =>
    server.lines.filter((l) => l.outcome === 'blocked').map((l) => l.reason);
  let server = await install(t, { env: { BEEMAPS_BURST_ENABLED: undefined } });
  await server.request(CONFIRM, { body: {} });
  assert.deepEqual(await reasons(server), ['burst_off']);
  server = await install(t, { env: { BEEMAPS_BURST_API_KEY: undefined } });
  await server.request(CONFIRM, { body: {} });
  assert.deepEqual(await reasons(server), ['no_key']);
  server = await install(t);
  await server.request(CONFIRM, { body: 'x' });
  await server.confirm('a'.repeat(32), idem(1));
  assert.deepEqual(await reasons(server), ['bad_body', 'quote_expired']);
  const bad = server.lines[0];
  assert.deepEqual(
    [
      bad.quoteId,
      bad.idempotencyKey,
      bad.bbox,
      bad.credits,
      bad.client,
      bad.requestId,
    ],
    [null, null, null, null, '127.0.0.1', 'request-1'],
  );
  const expired = server.lines[1];
  assert.deepEqual(
    [expired.quoteId, expired.idempotencyKey, expired.bbox],
    ['a'.repeat(32), idem(1), null],
  );
  server = await install(t, { env: { BEEMAPS_BURST_DAILY_CREDITS: '125' } });
  const a = await server.quote();
  const b = await server.quote();
  await server.confirm(a.body.quoteId, idem(1));
  await server.confirm(b.body.quoteId, idem(2));
  const budget = server.lines.at(-1);
  assert.deepEqual(
    [
      budget.outcome,
      budget.reason,
      budget.bbox,
      budget.credits,
      budget.areaKm2,
    ],
    ['blocked', 'budget_used', BOX, 125, 4],
  );
  server = await install(t, { respond: () => failure(403) });
  await server.flow(1);
  await server.flow(2);
  assert.equal(server.lines.at(-1).reason, 'key_rejected');
  assert.equal(server.lines.at(-1).outcome, 'blocked');
});

test('[beemaps-burst-control-031] writes no line for a request from another machine, for a method that is not POST and for a repeat of a key', async (t) => {
  const server = await install(t);
  await server.request(CONFIRM, { body: {}, remote: '192.168.1.20' });
  await server.request(CONFIRM, { method: 'GET', body: undefined });
  const quoted = await server.quote();
  await server.confirm(quoted.body.quoteId, idem(1));
  const count = server.lines.length;
  await server.confirm(quoted.body.quoteId, idem(1));
  assert.equal(server.lines.length, count);
  assert.equal(count, 2);
});

test('[beemaps-burst-control-032] keeps the key out of every answer, header, line, file and console line, and in the header Authorization only', async (t) => {
  const outputs = [];
  const everything = [];
  for (const respond of [
    () => created(),
    () => failure(400),
    () => failure(401),
    () => failure(402),
    () => failure(403),
    () => failure(429, { 'retry-after': '30', 'x-echo': KEY }),
    () => failure(500),
    () => new Response(`{"success":false,"detail":"${KEY}"}`, { status: 200 }),
    () => {
      throw new TypeError(`fetch failed for key ${KEY}`);
    },
    () =>
      Promise.reject(
        Object.assign(
          new Error(`redirect to https://x.example/?apiKey=${KEY}`),
          { cause: KEY },
        ),
      ),
  ]) {
    const server = await install(t, { respond });
    const first = await server.flow(1);
    const replay = await server.confirm(
      (await server.ledger()).records[0].quoteId,
      idem(1),
    );
    server.clock.t += 700_000;
    const held = await server.flow(2);
    everything.push(
      first,
      replay,
      held,
      await server.request(STATUS, { method: 'GET' }),
      await server.request(LIST, { body: {} }),
    );
    outputs.push(
      server.lines,
      server.consoleLines,
      await server.ledger(),
      await server.credits(),
    );
    for (const call of server.calls) {
      assert.equal(call.init.headers.Authorization, `Basic ${KEY}`);
      assert.equal(
        JSON.stringify([call.url, call.init.body]).includes(KEY),
        false,
      );
    }
  }
  const text = JSON.stringify([everything, outputs]);
  assert.equal(text.includes(KEY), false);
  assert.equal(text.includes('CANARY'), false);
});

const padTo = (text, size) => text + ' '.repeat(size - Buffer.byteLength(text));

test('[beemaps-burst-control-008] reads a valid quote body of exactly 4096 bytes and refuses one of 4097 bytes', async (t) => {
  const server = await install(t);
  const text = JSON.stringify({ bbox: BOX });
  assert.equal(
    (await server.request(QUOTE, { body: padTo(text, 4096) })).status,
    200,
  );
  const big = await server.request(QUOTE, { body: padTo(text, 4097) });
  assert.equal(big.status, 400);
  assert.deepEqual(big.body, { error: 'bad_body' });
});

test('[beemaps-burst-control-015] reads a valid confirm body of exactly 1024 bytes and refuses one of 1025 bytes', async (t) => {
  const server = await install(t);
  const quoted = await server.quote();
  const text = JSON.stringify({
    quoteId: quoted.body.quoteId,
    idempotencyKey: idem(1),
  });
  const big = await server.request(CONFIRM, { body: padTo(text, 1025) });
  assert.equal(big.status, 400);
  assert.deepEqual(big.body, { error: 'bad_body' });
  assert.equal(server.calls.length, 0);
  const exact = await server.request(CONFIRM, { body: padTo(text, 1024) });
  assert.equal(exact.status, 200);
  assert.equal(exact.body.ok, true);
  assert.equal(server.calls.length, 1);
});

test('[beemaps-burst-control-033] reads a valid list body of exactly 1024 bytes and refuses one of 1025 bytes', async (t) => {
  const server = await install(t);
  const text = JSON.stringify({ limit: 5 });
  assert.equal(
    (await server.request(LIST, { body: padTo(text, 1024) })).status,
    200,
  );
  const big = await server.request(LIST, { body: padTo(text, 1025) });
  assert.equal(big.status, 400);
  assert.deepEqual(big.body, { error: 'bad_body' });
});

test('[beemaps-burst-control-033] answers 400 bad_body to a list body that is too large, is not an object, has another field or has a bad limit', async (t) => {
  const server = await install(t);
  for (const body of [
    'z'.repeat(1025),
    'x',
    'null',
    '[]',
    '{"skip":1}',
    '{"limit":0}',
    '{"limit":101}',
    '{"limit":1.5}',
    '{"limit":"5"}',
  ]) {
    assert.deepEqual(
      (await server.request(LIST, { body })).body,
      { error: 'bad_body' },
      body,
    );
    server.clock.t += 61_000;
  }
  assert.equal(server.calls.length, 0);
});

test('[beemaps-burst-control-033] names the first broken step for each pair of neighbours in the list of steps of a list request', async (t) => {
  const answer = (result) => [result.status, result.body.error];
  let server = await install(t, { env: { BEEMAPS_BURST_ENABLED: undefined } });
  for (let n = 0; n < 6; n += 1) await server.request(LIST, { body: {} });
  assert.deepEqual(answer(await server.request(LIST, { body: {} })), [
    429,
    'rate_limited',
  ]);
  server = await install(t, {
    env: { BEEMAPS_BURST_ENABLED: undefined, BEEMAPS_BURST_API_KEY: undefined },
  });
  assert.deepEqual(answer(await server.request(LIST, { body: {} })), [
    403,
    'burst_off',
  ]);
  server = await install(t, { env: { BEEMAPS_BURST_API_KEY: undefined } });
  assert.deepEqual(answer(await server.request(LIST, { body: 'x' })), [
    403,
    'no_key',
  ]);
  server = await install(t);
  assert.equal((await server.request(LIST, { body: {} })).status, 200);
  assert.deepEqual(answer(await server.request(LIST, { body: 'x' })), [
    400,
    'bad_body',
  ]);
  assert.equal(server.calls.length, 1);
});

const MANY = (count) =>
  Array.from({ length: count }, (_, n) => ({
    ...BURST,
    _id: `b${String(n).padStart(3, '0')}`,
  }));

test('[beemaps-burst-control-034] asks Bee Maps for 100 whatever the limit is, and cuts the answer to the limit, with 20 for an empty object', async (t) => {
  const server = await install(t, { respond: () => listing(MANY(30), 30) });
  const five = await server.request(LIST, { body: { limit: 5 } });
  assert.equal(five.status, 200);
  assert.deepEqual(
    five.body.bursts.map((b) => b.id),
    ['b000', 'b001', 'b002', 'b003', 'b004'],
  );
  assert.deepEqual([five.body.total, five.body.cached], [30, false]);
  assert.deepEqual(Object.keys(five.body.bursts[0]), [
    'id',
    'status',
    'isHit',
    'latestHitAt',
    'validUntil',
    'credits',
    'bbox',
  ]);
  assert.deepEqual(
    server.calls.map((call) => call.url),
    [LIST_URL],
  );
  assert.equal(five.headers['cache-control'], 'no-store');
  const dflt = await server.request(LIST, { body: {} });
  assert.equal(dflt.body.bursts.length, 20);
  const all = await server.request(LIST, { body: { limit: 100 } });
  assert.equal(all.body.bursts.length, 30);
  assert.equal(server.calls.length, 1);
});

test('[beemaps-burst-control-036] keeps one answer for 60 seconds for every limit and sends a new request after 60 seconds', async (t) => {
  const server = await install(t);
  assert.equal(
    (await server.request(LIST, { body: { limit: 1 } })).body.cached,
    false,
  );
  assert.equal(
    (await server.request(LIST, { body: { limit: 1 } })).body.cached,
    true,
  );
  assert.equal(
    (await server.request(LIST, { body: { limit: 50 } })).body.cached,
    true,
  );
  server.clock.t += 59_999;
  assert.equal((await server.request(LIST, { body: {} })).body.cached, true);
  assert.equal(server.calls.length, 1);
  server.clock.t += 1;
  assert.equal((await server.request(LIST, { body: {} })).body.cached, false);
  assert.equal(server.calls.length, 2);
});

test('[beemaps-burst-control-036] does not keep a failed answer, sends no second request after a failure, and names key_rejected and upstream_failed', async (t) => {
  for (const [respond, status, error] of [
    [() => failure(401), 403, 'key_rejected'],
    [() => failure(403), 403, 'key_rejected'],
    [() => failure(500), 502, 'upstream_failed'],
    [() => failure(429), 502, 'upstream_failed'],
    [
      () => {
        throw new TypeError('fetch failed');
      },
      502,
      'upstream_failed',
    ],
  ]) {
    const server = await install(t, { respond });
    const first = await server.request(LIST, { body: {} });
    assert.deepEqual([first.status, first.body], [status, { error }]);
    assert.equal(server.calls.length, 1);
    await server.request(LIST, { body: {} });
    assert.equal(server.calls.length, 2);
  }
});

test('[beemaps-burst-control-036] gives one upstream request for two list requests at the same time', async (t) => {
  const open = gate();
  const server = await install(t, {
    respond: () => open.opened.then(() => listing()),
  });
  const a = server.request(LIST, { body: {} });
  const b = server.request(LIST, { body: {} });
  await waitFor(() => server.calls.length === 1);
  await sleep(20);
  open.open();
  const [x, y] = await Promise.all([a, b]);
  assert.deepEqual([x.status, y.status], [200, 200]);
  assert.deepEqual([x.body.cached, y.body.cached].sort(), [false, true]);
  assert.equal(server.calls.length, 1);
  const failing = await install(t, {
    respond: () => open.opened.then(() => failure(500)),
  });
  const c = failing.request(LIST, { body: {} });
  const d = failing.request(LIST, { body: {} });
  await waitFor(() => failing.calls.length === 1);
  await sleep(20);
  const [p, q] = await Promise.all([c, d]);
  assert.deepEqual([p.status, q.status], [502, 502]);
  assert.equal(failing.calls.length, 1);
});

test('[beemaps-burst-control-037] allows 10 quotes, 3 confirms and 6 lists in 60 seconds and answers 429 rate_limited with Retry-After 60 to the next one', async (t) => {
  const server = await install(t);
  for (let n = 0; n < 10; n += 1)
    assert.equal((await server.quote()).status, 200);
  const quoted = await server.quote();
  assert.deepEqual(
    [quoted.status, quoted.body, quoted.headers['retry-after']],
    [429, { error: 'rate_limited' }, '60'],
  );
  for (let n = 0; n < 6; n += 1)
    assert.equal((await server.request(LIST, { body: {} })).status, 200);
  const listed = await server.request(LIST, { body: {} });
  assert.deepEqual(
    [listed.status, listed.body, listed.headers['retry-after']],
    [429, { error: 'rate_limited' }, '60'],
  );
  for (let n = 0; n < 3; n += 1)
    assert.equal((await server.request(CONFIRM, { body: {} })).status, 400);
  const linesBefore = server.lines.length;
  const confirmed = await server.request(CONFIRM, { body: {} });
  assert.deepEqual(
    [confirmed.status, confirmed.body, confirmed.headers['retry-after']],
    [429, { error: 'rate_limited' }, '60'],
  );
  assert.equal(server.lines.length, linesBefore);
  assert.equal(linesBefore, 3);
  assert.equal(server.calls.length, 1);
  assert.deepEqual(await server.files(), []);
});

test('[beemaps-burst-control-037] frees the window 60 seconds after the first request and sets no limit on the status route', async (t) => {
  const server = await install(t);
  for (let n = 0; n < 10; n += 1) await server.quote();
  server.clock.t += 59_999;
  assert.equal((await server.quote()).status, 429);
  server.clock.t += 1;
  assert.equal((await server.quote()).status, 200);
  for (let n = 0; n < 30; n += 1)
    assert.equal((await server.request(STATUS, { method: 'GET' })).status, 200);
});

test('[beemaps-burst-control-001] passes a path below each of the four routes to next with no answer', async (t) => {
  const server = await install(t);
  for (const route of [STATUS, QUOTE, CONFIRM, LIST]) {
    const result = await server.request(`${route}/extra`, {
      method: route === STATUS ? 'GET' : 'POST',
      body: {},
    });
    assert.equal(result.next, true, route);
    assert.equal(result.status, undefined, route);
  }
  assert.equal(server.calls.length, 0);
});

test('[beemaps-burst-control-010] answers the refusals of the box, of the area and of the credits at the route quote, and keeps no quote', async (t) => {
  const server = await install(t);
  const refusals = [
    [{ bbox: [1, 2, 3] }, { error: 'bad_area' }],
    [{ bbox: [10, 60, 10.05, 60.02] }, { error: 'area_too_large', maxKm2: 5 }],
    [{ bbox: BOX, credits: 124 }, { error: 'bad_credits' }],
    [{ bbox: BOX, other: 1 }, { error: 'bad_body' }],
  ];
  for (const [body, expected] of refusals) {
    const result = await server.request(QUOTE, { body });
    assert.deepEqual(
      [result.status, result.body],
      [400, expected],
      JSON.stringify(body),
    );
  }
  assert.deepEqual(await server.files(), []);
  assert.equal(server.calls.length, 0);
});

test('[beemaps-burst-control-030] answers as usual when the write of a line after the first line fails', async (t) => {
  const hooks = {
    audit: async (line) => {
      if (line.outcome !== 'accepted') throw new Error('disk full');
    },
  };
  const rows = [
    [() => created(), 200, undefined],
    [() => failure(403), 403, 'key_rejected'],
    [() => failure(500), 502, 'outcome_unknown'],
  ];
  for (const [respond, status, error] of rows) {
    const server = await install(t, { respond, hooks });
    const result = await server.flow(1);
    assert.deepEqual([result.status, result.body.error], [status, error]);
    assert.equal((await server.ledger()).records[0].state === 'pending', false);
  }
  const server = await install(t, { hooks });
  const blocked = await server.request(CONFIRM, { body: 'x' });
  assert.deepEqual(
    [blocked.status, blocked.body],
    [400, { error: 'bad_body' }],
  );
});

test('[beemaps-burst-control-028] answers with the outcome of the send when the write of the record after the send fails, and keeps the state pending in the file', async (t) => {
  const hooks = {
    writeFile: async (file, text) => {
      if (file.includes('ledger') && !text.includes('"pending"'))
        throw new Error('disk full');
    },
  };
  const server = await install(t, { hooks });
  const quoted = await server.quote();
  const result = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual([result.status, result.body.outcome], [200, 'created']);
  assert.equal(server.calls.length, 1);
  assert.equal((await server.ledger()).records[0].state, 'pending');
  const restarted = await install(t, { cacheDir: server.dir });
  const replay = await restarted.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [replay.status, replay.body.outcome, replay.body.replayed],
    [409, 'unknown', true],
  );
  const other = await restarted.flow(2);
  assert.deepEqual(
    [other.status, other.body.held, other.body.error],
    [409, true, 'outcome_unknown'],
  );
  assert.equal(restarted.calls.length, 0);
});

test('[beemaps-burst-control-001] answers every route with the content type JSON and the cache control no-store', async (t) => {
  const server = await install(t, { respond: () => failure(403) });
  const quoted = await server.quote();
  const results = [
    await server.request(STATUS, { method: 'GET' }),
    await server.request(STATUS, { method: 'POST' }),
    quoted,
    await server.quote([1, 2, 3]),
    await server.confirm(quoted.body.quoteId, idem(1)),
    await server.flow(2),
    await server.request(LIST, { body: {} }),
    await server.request(LIST, { body: 'x' }),
    await server.request(CONFIRM, { body: {}, remote: '192.168.1.20' }),
  ];
  for (const result of results) {
    assert.equal(
      result.headers['content-type'],
      'application/json; charset=utf-8',
      result.text,
    );
    assert.equal(result.headers['cache-control'], 'no-store', result.text);
  }
});

test('[beemaps-burst-control-037] does not count a refused request and frees all the requests of the window together', async (t) => {
  const server = await install(t);
  const status = async () =>
    (await server.request(CONFIRM, { body: {} })).status;
  for (let n = 0; n < 3; n += 1) assert.equal(await status(), 400);
  server.clock.t += 30_000;
  for (let n = 0; n < 3; n += 1) assert.equal(await status(), 429);
  server.clock.t += 31_000;
  for (let n = 0; n < 3; n += 1) assert.equal(await status(), 400);
  assert.equal(await status(), 429);
});

test('[beemaps-burst-control-025] answers a repeat of a 402 with no retryAfter and no Retry-After header', async (t) => {
  const server = await install(t, { respond: () => failure(402) });
  const quoted = await server.quote();
  const first = await server.confirm(quoted.body.quoteId, idem(1));
  assert.equal(first.status, 402);
  const replay = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [replay.status, replay.body, replay.headers['retry-after']],
    [
      402,
      { ok: false, outcome: 'refused', error: 'no_credit', replayed: true },
      undefined,
    ],
  );
});

test('[beemaps-burst-control-029] answers a confirm held by a 402 with no retryAfter and no Retry-After header', async (t) => {
  const server = await install(t, { respond: () => failure(402) });
  assert.equal((await server.flow(1)).status, 402);
  const held = await server.flow(2);
  assert.deepEqual(
    [held.status, held.body, held.headers['retry-after']],
    [
      402,
      { error: 'no_credit', ok: false, outcome: 'refused', held: true },
      undefined,
    ],
  );
});

test('[beemaps-burst-control-014] refuses a quote one credit over the credits that remain, and checks the credits against the maximum of the settings', async (t) => {
  const server = await install(t, {
    env: {
      BEEMAPS_BURST_DAILY_CREDITS: '200',
      BEEMAPS_BURST_MAX_CREDITS: '500',
    },
  });
  const over = await server.quote(BOX, { credits: 201 });
  assert.deepEqual(
    [over.status, over.body],
    [403, { error: 'budget_used', used: 0, limit: 200 }],
  );
  const exact = await server.quote(BOX, { credits: 200 });
  assert.equal(exact.status, 200);
  assert.equal(exact.body.request.credits, 200);
});

test('[beemaps-burst-control-014] keeps no quote for a request that the budget cannot pay', async (t) => {
  const server = await install(t, {
    env: {
      BEEMAPS_BURST_DAILY_CREDITS: '250',
      BEEMAPS_BURST_MAX_CREDITS: '200',
    },
  });
  const first = await server.quote();
  const second = await server.quote();
  assert.equal(
    (await server.confirm(second.body.quoteId, idem(1))).status,
    200,
  );
  for (let n = 0; n < 8; n += 1)
    assert.equal((await server.quote(BOX, { credits: 200 })).status, 403);
  assert.equal((await server.confirm(first.body.quoteId, idem(2))).status, 200);
});

test('[beemaps-burst-control-030] writes the blocked line, and waits for the write to end, before it answers', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_BURST_ENABLED: undefined },
    hooks: { audit: async () => sleep(20) },
  });
  const result = await server.request(CONFIRM, { body: {} });
  assert.equal(result.status, 403);
  assert.equal(server.lines.length, 1);
  assert.equal(server.lines[0].reason, 'burst_off');
});

test('[beemaps-burst-control-031] writes a blocked line for a confirm body that is too large', async (t) => {
  const server = await install(t);
  const result = await server.request(CONFIRM, { body: 'y'.repeat(1025) });
  assert.deepEqual([result.status, result.body], [400, { error: 'bad_body' }]);
  assert.deepEqual(
    server.lines.map((line) => [line.outcome, line.reason]),
    [['blocked', 'bad_body']],
  );
});

test('[beemaps-burst-control-020] lets a confirm run while a list request is in flight', async (t) => {
  const open = gate();
  const server = await install(t, {
    respond: async (url) => {
      if (String(url) === LIST_URL) {
        await open.opened;
        return listing();
      }
      return created();
    },
  });
  const pending = server.request(LIST, { body: {} });
  await waitFor(() => server.calls.length === 1);
  const result = await server.flow(1);
  assert.equal(result.status, 200);
  open.open();
  assert.equal((await pending).status, 200);
});

test('[beemaps-burst-control-001] answers 500 internal_error when a route fails with an error that nobody expects, and does not answer twice', async (t) => {
  const server = await install(t);
  Object.defineProperty(server.env, 'BEEMAPS_BURST_ENABLED', {
    get() {
      throw new Error('boom');
    },
  });
  for (const [url, body] of [
    [QUOTE, { bbox: BOX }],
    [CONFIRM, {}],
    [LIST, {}],
  ]) {
    const result = await server.request(url, { body });
    assert.deepEqual(
      [result.status, result.body],
      [500, { error: 'internal_error' }],
      url,
    );
  }
  Object.defineProperty(server.env, 'BEEMAPS_BURST_ENABLED', {
    value: 'true',
    writable: true,
  });
  const sent = await server.request(QUOTE, {
    body: { bbox: BOX },
    endFails: true,
  });
  assert.deepEqual([sent.status, typeof sent.text], [200, 'string']);
  assert.equal(server.consoleLines.length, 0);
});

test('[beemaps-burst-control-020] ends the lock of a confirm that fails with an error that nobody expects', async (t) => {
  const server = await install(t);
  const first = await server.quote();
  const second = await server.quote();
  let reads = 0;
  Object.defineProperty(server.env, 'BEEMAPS_BURST_DAILY_CREDITS', {
    configurable: true,
    get() {
      reads += 1;
      if (reads === 2) throw new Error('boom');
      return undefined;
    },
  });
  const failed = await server.confirm(first.body.quoteId, idem(1));
  assert.deepEqual(
    [failed.status, failed.body],
    [500, { error: 'internal_error' }],
  );
  assert.equal(server.calls.length, 0);
  const next = await server.confirm(second.body.quoteId, idem(2));
  assert.equal(next.status, 200);
  assert.equal(server.calls.length, 1);
});

test('[beemaps-burst-control-030] tries a blocked line with the reason log_failed when the first line fails', async (t) => {
  let writes = 0;
  const server = await install(t, {
    hooks: {
      audit: async () => {
        writes += 1;
        if (writes === 1) throw new Error('disk full');
      },
    },
  });
  const result = await server.flow(1);
  assert.deepEqual(
    [result.status, result.body],
    [500, { error: 'log_failed' }],
  );
  assert.equal(server.calls.length, 0);
  assert.deepEqual(
    server.lines.map((line) => [line.outcome, line.reason]),
    [['blocked', 'log_failed']],
  );
});

test('[beemaps-burst-control-016] reserves, writes and sends the credits and the box of the quote', async (t) => {
  const server = await install(t, {
    env: { BEEMAPS_BURST_MAX_CREDITS: '200' },
  });
  const quoted = await server.quote(BOX, { credits: 200 });
  const result = await server.confirm(quoted.body.quoteId, idem(1));
  assert.equal(result.status, 200);
  assert.deepEqual(await server.credits(), {
    date: '2026-10-15',
    credits: 200,
  });
  const sent = JSON.parse(server.calls[0].init.body);
  assert.equal(sent[0].credits, 200);
  assert.deepEqual(sent[0].geojson.coordinates[0], [
    [9.982014, 59.991007],
    [10.017986, 59.991007],
    [10.017986, 60.008993],
    [9.982014, 60.008993],
    [9.982014, 59.991007],
  ]);
});

test('[beemaps-burst-control-031] gives the duration of the send in the second line', async (t) => {
  let server;
  server = await install(t, {
    respond: () => {
      server.clock.t += 250;
      return created();
    },
  });
  await server.flow(1);
  assert.equal(server.lines.at(-1).outcome, 'created');
  assert.equal(server.lines.at(-1).durationMs, 250);
});

test('[beemaps-burst-control-030] waits for the second line of each outcome, and writes it after the record', async (t) => {
  for (const [respond, outcome] of [
    [() => created(), 'created'],
    [() => failure(403), 'refused'],
    [() => failure(500), 'unknown'],
  ]) {
    const server = await install(t, {
      respond,
      hooks: {
        audit: async (line) => {
          if (line.outcome !== 'accepted') await sleep(20);
        },
      },
    });
    await server.flow(1);
    assert.equal(server.lines.at(-1).outcome, outcome);
    const names = server.events;
    assert.equal(
      names.lastIndexOf(`audit ${outcome}`) >
        names.lastIndexOf('rename ledger.json'),
      true,
      outcome,
    );
  }
});

test('[beemaps-burst-control-036] gives the answer of the new request to a request that shares it after the stored list has ended', async (t) => {
  const open = gate();
  let round = 0;
  const server = await install(t, {
    respond: async () => {
      round += 1;
      if (round === 2) await open.opened;
      return listing([{ ...BURST, _id: `round${round}` }]);
    },
  });
  assert.equal(
    (await server.request(LIST, { body: {} })).body.bursts[0].id,
    'round1',
  );
  server.clock.t += 61_000;
  const first = server.request(LIST, { body: {} });
  await waitFor(() => server.calls.length === 2);
  const second = server.request(LIST, { body: {} });
  await sleep(20);
  open.open();
  const answers = await Promise.all([first, second]);
  assert.deepEqual(
    answers.map((answer) => answer.body.bursts[0].id),
    ['round2', 'round2'],
  );
  assert.equal(server.calls.length, 2);
});

test('[beemaps-burst-control-001] uses the environment, the clock, the fetch function and the folders of the process when it gets no options', async (t) => {
  const cwd = await tempDir(t);
  const root = await tempDir(t);
  t.mock.method(process, 'cwd', () => cwd);
  t.mock.timers.enable({ apis: ['Date'], now: NOW });
  for (const [name, value] of Object.entries({
    BEEMAPS_BURST_ENABLED: 'true',
    BEEMAPS_BURST_API_KEY: KEY,
  })) {
    const before = process.env[name];
    process.env[name] = value;
    t.after(() => {
      if (before === undefined) delete process.env[name];
      else process.env[name] = before;
    });
  }
  const urls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(String(url));
    return created();
  });
  const plugin = beemapsBurstProxy({ sourceRoot: root });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (route, handler) => routes.set(route, handler) },
  });
  const call = async (route, body) => {
    const req = Object.assign(
      Readable.from([Buffer.from(JSON.stringify(body))]),
      {
        method: 'POST',
        headers: GOOD_HEADERS,
        socket: { remoteAddress: '127.0.0.1' },
        url: '/',
      },
    );
    const res = {
      headers: {},
      writeHead(code) {
        this.statusCode = code;
      },
      end(chunk) {
        this.text = chunk;
      },
    };
    await routes.get(route)(req, res, () => {});
    return JSON.parse(res.text);
  };
  const quoted = await call(QUOTE, { bbox: BOX });
  const confirmed = await call(CONFIRM, {
    quoteId: quoted.quoteId,
    idempotencyKey: idem(1),
  });
  assert.equal(confirmed.outcome, 'created');
  assert.deepEqual(urls, [CREATE_URL]);
  const folder = path.join(cwd, '.gev-cache', 'beemaps-burst');
  assert.deepEqual((await fsp.readdir(folder)).sort(), [
    'credits.json',
    'ledger.json',
  ]);
  const lines = (
    await fsp.readFile(
      path.join(root, '.gev-logs', 'beemaps-bursts.jsonl'),
      'utf8',
    )
  )
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  assert.deepEqual(
    lines.map((line) => [line.time, line.outcome]),
    [
      ['2026-10-15T12:00:00.000Z', 'accepted'],
      ['2026-10-15T12:00:00.000Z', 'created'],
    ],
  );
  assert.match(lines[0].requestId, /^[0-9a-f-]{36}$/);
});

test('[beemaps-burst-control-022] reads the daily limit again at each request', async (t) => {
  const server = await install(t);
  assert.equal((await server.quote()).body.budget.limit, 625);
  server.env.BEEMAPS_BURST_DAILY_CREDITS = '300';
  assert.equal((await server.quote()).body.budget.limit, 300);
});

test('[beemaps-burst-control-030] gives the clock of the plugin to the audit it makes', async (t) => {
  const cwd = await tempDir(t);
  const root = await tempDir(t);
  const plugin = beemapsBurstProxy({
    env: { BEEMAPS_BURST_ENABLED: undefined },
    now: () => NOW + 5000,
    cacheDir: cwd,
    sourceRoot: root,
  });
  const routes = new Map();
  plugin.configureServer({
    middlewares: { use: (route, handler) => routes.set(route, handler) },
  });
  const req = Object.assign(Readable.from([Buffer.from('{}')]), {
    method: 'POST',
    headers: GOOD_HEADERS,
    socket: { remoteAddress: '127.0.0.1' },
    url: '/',
  });
  const res = {
    writeHead() {},
    end() {},
  };
  await routes.get(CONFIRM)(req, res, () => {});
  const text = await fsp.readFile(
    path.join(root, '.gev-logs', 'beemaps-bursts.jsonl'),
    'utf8',
  );
  assert.equal(JSON.parse(text).time, '2026-10-15T12:00:05.000Z');
});

test('[beemaps-burst-control-036] gives a failure of the new request to a request that shares it, and not the stored list that has ended', async (t) => {
  const open = gate();
  let round = 0;
  const server = await install(t, {
    respond: async () => {
      round += 1;
      if (round === 2) {
        await open.opened;
        return failure(500);
      }
      return listing([{ ...BURST, _id: 'round1' }]);
    },
  });
  assert.equal((await server.request(LIST, { body: {} })).status, 200);
  server.clock.t += 61_000;
  const first = server.request(LIST, { body: {} });
  await waitFor(() => server.calls.length === 2);
  const second = server.request(LIST, { body: {} });
  await sleep(20);
  open.open();
  const answers = await Promise.all([first, second]);
  assert.deepEqual(
    answers.map((answer) => [answer.status, answer.body.error]),
    [
      [502, 'upstream_failed'],
      [502, 'upstream_failed'],
    ],
  );
  assert.equal(server.calls.length, 2);
});

test('[beemaps-burst-control-031] writes a blocked line for busy, key_reused, the hold after an unknown outcome, budget_unavailable and ledger_unavailable', async (t) => {
  const lastLine = (server) => {
    const line = server.lines.at(-1);
    return [line.outcome, line.reason];
  };
  const slow = holdable();
  let server = await install(t, { respond: slow.respond });
  const opened = slow.hold();
  const quoted = await server.quote();
  const first = server.confirm(quoted.body.quoteId, idem(1));
  await waitFor(() => server.calls.length === 1);
  assert.equal(
    (await server.confirm('b'.repeat(32), idem(2))).body.error,
    'busy',
  );
  assert.deepEqual(lastLine(server), ['blocked', 'busy']);
  opened.open();
  await first;

  server = await install(t);
  const one = await server.quote();
  const two = await server.quote();
  assert.equal((await server.confirm(one.body.quoteId, idem(1))).status, 200);
  const reused = await server.confirm(two.body.quoteId, idem(1));
  assert.equal(reused.body.error, 'key_reused');
  assert.deepEqual(lastLine(server), ['blocked', 'key_reused']);
  assert.deepEqual(
    [server.lines.at(-1).quoteId, server.lines.at(-1).idempotencyKey],
    [two.body.quoteId, idem(1)],
  );

  server = await install(t, { respond: () => failure(500) });
  assert.equal((await server.flow(1)).status, 502);
  assert.equal((await server.flow(2)).body.error, 'outcome_unknown');
  assert.deepEqual(lastLine(server), ['blocked', 'outcome_unknown']);

  server = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (file.includes('credits')) throw new Error('disk full');
      },
    },
  });
  assert.equal((await server.flow(1)).body.error, 'budget_unavailable');
  assert.deepEqual(lastLine(server), ['blocked', 'budget_unavailable']);

  const dir = await tempDir(t);
  await fsp.writeFile(path.join(dir, 'ledger.json'), 'not json');
  server = await install(t, { cacheDir: dir });
  assert.equal((await server.flow(1)).body.error, 'ledger_unavailable');
  assert.deepEqual(lastLine(server), ['blocked', 'ledger_unavailable']);

  server = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (file.includes('ledger')) throw new Error('disk full');
      },
    },
  });
  assert.equal((await server.flow(1)).body.error, 'ledger_unavailable');
  assert.deepEqual(lastLine(server), ['blocked', 'ledger_unavailable']);
});

test('[beemaps-burst-control-013] gives quote_expired at once for the same quote with a new key, after every outcome that is not a hold', async (t) => {
  const again = async (server, quoteId, n) => {
    const calls = server.calls.length;
    const result = await server.confirm(quoteId, idem(n));
    assert.deepEqual(
      [result.status, result.body],
      [410, { error: 'quote_expired' }],
    );
    assert.equal(server.calls.length, calls);
  };
  let server = await install(t);
  let quoted = await server.quote();
  assert.equal(
    (await server.confirm(quoted.body.quoteId, idem(1))).status,
    200,
  );
  await again(server, quoted.body.quoteId, 2);

  server = await install(t, { respond: () => failure(400) });
  quoted = await server.quote();
  assert.equal(
    (await server.confirm(quoted.body.quoteId, idem(1))).status,
    400,
  );
  await again(server, quoted.body.quoteId, 2);

  server = await install(t, { env: { BEEMAPS_BURST_DAILY_CREDITS: '125' } });
  const used = await server.quote();
  quoted = await server.quote();
  assert.equal((await server.confirm(used.body.quoteId, idem(1))).status, 200);
  assert.equal(
    (await server.confirm(quoted.body.quoteId, idem(2))).body.error,
    'budget_used',
  );
  await again(server, quoted.body.quoteId, 3);

  let failing = true;
  server = await install(t, {
    hooks: {
      audit: async () => {
        if (failing) {
          failing = false;
          throw new Error('disk full');
        }
      },
    },
  });
  quoted = await server.quote();
  assert.equal(
    (await server.confirm(quoted.body.quoteId, idem(1))).body.error,
    'log_failed',
  );
  await again(server, quoted.body.quoteId, 2);

  failing = true;
  server = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (file.includes('ledger') && failing) {
          failing = false;
          throw new Error('disk full');
        }
      },
    },
  });
  quoted = await server.quote();
  assert.equal(
    (await server.confirm(quoted.body.quoteId, idem(1))).body.error,
    'ledger_unavailable',
  );
  await again(server, quoted.body.quoteId, 2);

  failing = true;
  server = await install(t, {
    hooks: {
      writeFile: async (file) => {
        if (file.includes('credits') && failing) {
          failing = false;
          throw new Error('disk full');
        }
      },
    },
  });
  quoted = await server.quote();
  assert.equal(
    (await server.confirm(quoted.body.quoteId, idem(1))).body.error,
    'budget_unavailable',
  );
  await again(server, quoted.body.quoteId, 2);
});

test('[beemaps-burst-control-007] gives the hold after an unknown outcome before the check of the quote, and writes no credits for a quote that does not exist', async (t) => {
  const server = await install(t, { respond: () => failure(500) });
  assert.equal((await server.flow(1)).status, 502);
  const held = await server.confirm('e'.repeat(32), idem(2));
  assert.deepEqual(
    [held.status, held.body.error, held.body.held],
    [409, 'outcome_unknown', true],
  );
  const fresh = await install(t);
  const expired = await fresh.confirm('f'.repeat(32), idem(1));
  assert.deepEqual(
    [expired.status, expired.body],
    [410, { error: 'quote_expired' }],
  );
  assert.equal(await fresh.credits(), null);
  assert.equal(await fresh.ledger(), null);
});

test('[beemaps-burst-control-001] answers 500 internal_error for an error after the send, and the record keeps the state of that time', async (t) => {
  const server = await install(t, {
    audit: (event) => {
      if (event.outcome === 'accepted') return Promise.resolve();
      throw new Error('boom');
    },
  });
  const quoted = await server.quote();
  const result = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual(
    [result.status, result.body],
    [500, { error: 'internal_error' }],
  );
  assert.equal(server.calls.length, 1);
  assert.equal((await server.ledger()).records[0].state, 'created');
  const replay = await server.confirm(quoted.body.quoteId, idem(1));
  assert.deepEqual([replay.status, replay.body.replayed], [200, true]);
  assert.equal(server.calls.length, 1);
});
