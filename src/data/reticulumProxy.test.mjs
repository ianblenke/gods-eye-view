import test from 'node:test';
import assert from 'node:assert/strict';
import {
  reticulumProxy,
  normalizeInterfaces,
} from '../../server/providers/reticulum.js';

const NOW = Date.UTC(2026, 9, 13, 12, 0, 0);
const HOUR = 3600_000;
const DAY = 24 * HOUR;
const HASH = 'ab12cd34ef56ab12' + '0123456789abcdef'.repeat(3);
const heard = (ageMs) => (NOW - ageMs) / 1000;

/** A raw record in the shape that the listener sends, with made-up values. */
function raw(overrides = {}) {
  return {
    type: 'RNodeInterface',
    impl_name: 'RNS',
    version: '1.5.5',
    transport: true,
    name: 'Example Gateway',
    last_heard: heard(HOUR),
    discovery_hash: HASH,
    hops: 3,
    latitude: 12.3456,
    longitude: -45.6789,
    height: 43.4,
    frequency: 914875000,
    bandwidth: 125000,
    sf: 8,
    cr: 5,
    ...overrides,
  };
}
const hash = (n) => n.toString(16).padStart(16, '0') + HASH.slice(16);
const names = (result) => result.interfaces.map((item) => item.name);

test('[reticulum-source-001] keeps the allowed fields of a discovered RNode and sets the radio of other interfaces to null', () => {
  const result = normalizeInterfaces([raw()], NOW);
  assert.equal(result.interfaces.length, 1);
  const [record] = result.interfaces;
  assert.deepEqual(Object.keys(record).sort(), [
    'heightM',
    'hops',
    'id',
    'lastHeard',
    'latitude',
    'longitude',
    'name',
    'radio',
    'status',
    'type',
  ]);
  assert.deepEqual(record, {
    id: 'ab12cd34ef56ab12',
    type: 'rnode',
    name: 'Example Gateway',
    latitude: 12.346,
    longitude: -45.679,
    heightM: 43,
    hops: 3,
    lastHeard: '2026-10-13T11:00:00.000Z',
    status: 'available',
    radio: {
      frequency: 914875000,
      bandwidth: 125000,
      spreadingFactor: 8,
      codingRate: 5,
    },
  });
  const backbone = normalizeInterfaces(
    [raw({ type: 'BackboneInterface', hops: 'x', height: null })],
    NOW,
  ).interfaces[0];
  assert.equal(backbone.type, 'backbone');
  assert.equal(backbone.radio, null);
  assert.equal(backbone.hops, null);
  assert.equal(backbone.heightM, null);
  for (const missing of ['frequency', 'bandwidth', 'sf', 'cr']) {
    const record = normalizeInterfaces([raw({ [missing]: undefined })], NOW)
      .interfaces[0];
    assert.equal(record.radio, null, missing);
  }
  assert.equal(
    normalizeInterfaces([raw({ hops: 256 })], NOW).interfaces[0].hops,
    null,
  );
  assert.equal(
    normalizeInterfaces([raw({ hops: 255 })], NOW).interfaces[0].hops,
    255,
  );
  assert.equal(
    normalizeInterfaces([raw({ hops: 0 })], NOW).interfaces[0].hops,
    0,
  );
  assert.equal(
    normalizeInterfaces([raw({ hops: -1 })], NOW).interfaces[0].hops,
    null,
  );
  assert.equal(
    normalizeInterfaces([raw({ hops: 3.5 })], NOW).interfaces[0].hops,
    null,
  );
  assert.equal(
    normalizeInterfaces([raw({ height: 'tall' })], NOW).interfaces[0].heightM,
    null,
  );
});

test('[reticulum-source-002] drops the address, key and contact fields', () => {
  const canaries = {
    config_entry: 'CANARY-config-entry',
    reachable_on: 'CANARY-host.example',
    port: 7654321,
    ifac_netname: 'CANARY-netname',
    ifac_netkey: 'CANARY-netkey',
    operator_lxmf_address: 'CANARY-lxmf-address',
  };
  const result = normalizeInterfaces([raw(canaries)], NOW);
  assert.equal(result.interfaces.length, 1);
  const text = JSON.stringify(result);
  for (const [field, value] of Object.entries(canaries))
    assert.equal(text.includes(String(value)), false, field);
});

test('[reticulum-source-003] drops the identity, stamp and software fields', () => {
  const canaries = {
    transport_id: 'CANARY-transport-id',
    network_id: 'CANARY-network-id',
    stamp: 'CANARY-stamp',
    value: 8675309,
    impl_name: 'CANARY-impl-name',
    version: 'CANARY-version',
  };
  const result = normalizeInterfaces([raw(canaries)], NOW);
  assert.equal(result.interfaces.length, 1);
  const text = JSON.stringify(result);
  for (const [field, value] of Object.entries(canaries))
    assert.equal(text.includes(String(value)), false, field);
});

test('[reticulum-source-004] drops the records that are not valid and counts all of them', () => {
  const valid = raw({ discovery_hash: hash(1) });
  const result = normalizeInterfaces(
    [
      valid,
      raw({ type: 'x'.repeat(41) }),
      raw({ type: 'x'.repeat(35) + 'Interface' }),
      raw({ type: 'Bad Type!' }),
      raw({ type: 'Interface' }),
      raw({ discovery_hash: 'short' }),
      raw({ discovery_hash: HASH.toUpperCase() }),
      raw({ discovery_hash: HASH + 'a' }),
      raw({ discovery_hash: HASH.slice(0, 63) }),
      raw({ discovery_hash: undefined }),
      raw({ last_heard: 'soon' }),
      raw({ last_heard: String(heard(HOUR)) }),
      raw({ last_heard: 1e20 }),
      'text',
      null,
      7,
    ],
    NOW,
  );
  assert.deepEqual(names(result), ['Example Gateway']);
  assert.equal(result.interfaces[0].id, hash(1).slice(0, 16));
  assert.equal(result.counts.total, 16);
  assert.equal(result.counts.positioned, 1);
  for (const [label, overrides] of [
    ['type 40', { type: 'x'.repeat(40) }],
    ['type 1', { type: 'x' }],
    ['raw type 40', { type: 'x'.repeat(31) + 'Interface' }],
    ['digits', { type: 'Rnode2' }],
  ])
    assert.equal(
      normalizeInterfaces([raw(overrides)], NOW).interfaces.length,
      1,
      label,
    );
});

test('[reticulum-source-005] lists only records with a valid position and rounds it to three decimals', () => {
  const invalid = [
    { latitude: undefined },
    { longitude: undefined },
    { latitude: null },
    { latitude: '12.3' },
    { longitude: '1.2' },
    { latitude: Number.NaN },
    { longitude: Number.POSITIVE_INFINITY },
    { latitude: 90.001 },
    { latitude: -90.001 },
    { longitude: 180.001 },
    { longitude: -180.001 },
    { latitude: 0, longitude: 0 },
  ];
  const list = [
    ...invalid.map((overrides, index) =>
      raw({ ...overrides, discovery_hash: hash(index) }),
    ),
    raw({ latitude: 90, longitude: 180, discovery_hash: hash(100) }),
    raw({ latitude: -90, longitude: -180, discovery_hash: hash(101) }),
    raw({ latitude: 0, longitude: 5.5555, discovery_hash: hash(102) }),
    raw({ latitude: 5.5555, longitude: 0, discovery_hash: hash(103) }),
    raw({ latitude: -0.0004, longitude: 7, discovery_hash: hash(104) }),
  ];
  const result = normalizeInterfaces(list, NOW);
  assert.equal(list.length, 17);
  assert.deepEqual(result.counts, {
    total: 17,
    positioned: 5,
    byType: { rnode: 5 },
  });
  const places = result.interfaces
    .map((item) => [item.latitude, item.longitude])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  assert.deepEqual(places, [
    [-90, -180],
    [0, 5.556],
    [0, 7],
    [5.556, 0],
    [90, 180],
  ]);
});

test('[reticulum-source-006] sets the status from the age and drops records heard more than 7 days ago', () => {
  const at = (ageMs, n) =>
    raw({ last_heard: heard(ageMs), discovery_hash: hash(n) });
  const status = (ageMs) =>
    normalizeInterfaces([at(ageMs, 1)], NOW).interfaces[0]?.status ?? 'dropped';
  assert.equal(status(23 * HOUR), 'available');
  assert.equal(status(25 * HOUR), 'unknown');
  assert.equal(status(73 * HOUR), 'stale');
  assert.equal(status(169 * HOUR), 'dropped');
  assert.equal(status(0), 'available');
  assert.equal(status(DAY), 'available');
  assert.equal(status(DAY + 1000), 'unknown');
  assert.equal(status(3 * DAY), 'unknown');
  assert.equal(status(3 * DAY + 1000), 'stale');
  assert.equal(status(7 * DAY), 'stale');
  assert.equal(status(7 * DAY + 1000), 'dropped');
  const result = normalizeInterfaces([at(169 * HOUR, 2)], NOW);
  assert.deepEqual(result.counts, { total: 1, positioned: 0, byType: {} });
});

test('[reticulum-source-007] cleans the names and keeps at most 5000 interfaces, newest first', () => {
  const clean = (name) =>
    normalizeInterfaces([raw({ name })], NOW).interfaces[0].name;
  assert.equal(clean('A\u0000B\u001fC\u007fD<script>E'), 'ABCDscriptE');
  assert.equal(clean('A\u0080B\u009fC'), 'ABC');
  assert.equal(clean('A\u00a0B A'), 'A\u00a0B A');
  assert.equal(clean('  spaced  '), 'spaced');
  assert.equal(clean('x'.repeat(100)), 'x'.repeat(80));
  assert.equal(clean('z'.repeat(79) + ' tail'), 'z'.repeat(79));
  assert.equal(clean('y'.repeat(80)), 'y'.repeat(80));
  assert.equal(clean(''), 'Unnamed rnode');
  assert.equal(clean('   '), 'Unnamed rnode');
  assert.equal(clean('<>'), 'Unnamed rnode');
  assert.equal(clean(42), 'Unnamed rnode');
  assert.equal(clean(undefined), 'Unnamed rnode');
  const many = [];
  for (let n = 0; n < 5001; n += 1)
    many.push(
      raw({
        name: `node ${n}`,
        discovery_hash: hash(n),
        last_heard: heard(HOUR + n * 1000),
      }),
    );
  const result = normalizeInterfaces(many.reverse(), NOW);
  assert.equal(result.interfaces.length, 5000);
  assert.equal(result.counts.total, 5001);
  assert.equal(result.counts.positioned, 5000);
  assert.equal(names(result)[0], 'node 0');
  assert.equal(names(result)[4999], 'node 4999');
  assert.equal(names(result).includes('node 5000'), false);
});

const ADDRESS = '127.0.0.1:8081';
function install(options = {}, preview = false) {
  let handler;
  const clock = { t: NOW };
  const timers = [];
  const cleared = [];
  const { useRealTimers, ...rest } = options;
  const plugin = reticulumProxy({
    now: () => clock.t,
    env: { RETICULUM_LISTENER: ADDRESS },
    ...(useRealTimers
      ? {}
      : {
          setTimer: (fn, ms) => {
            timers.push({ fn, ms });
            return timers.length;
          },
          clearTimer: (id) => cleared.push(id),
        }),
    ...rest,
  });
  plugin[preview ? 'configurePreviewServer' : 'configureServer']({
    middlewares: {
      use(path, callback) {
        assert.equal(path, '/api/reticulum');
        handler = callback;
      },
    },
  });
  const request = async (url = '/', method = 'GET') => {
    const res = {};
    res.writeHead = (code, headers) => {
      res.statusCode = code;
      res.headers = headers;
    };
    res.end = (body) => {
      res.body = JSON.parse(body);
    };
    await handler({ url, method }, res);
    return res;
  };
  return { request, clock, plugin, timers, cleared };
}
function listFetch(list, calls = []) {
  return async (url, options) => {
    calls.push({ url: String(url), options });
    return Response.json(list);
  };
}

test('[reticulum-source-008] answers a GET request with the document', async () => {
  for (const preview of [false, true]) {
    const calls = [];
    const { request, plugin, timers, cleared } = install(
      { fetchImpl: listFetch([raw()], calls) },
      preview,
    );
    assert.equal(plugin.name, 'reticulum');
    const res = await request('/');
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    assert.equal(res.headers['Content-Type'], 'application/json');
    assert.deepEqual(Object.keys(res.body).sort(), [
      'attribution',
      'counts',
      'coverage',
      'fetchedAt',
      'interfaces',
      'reason',
      'schemaVersion',
      'source',
      'stale',
      'unavailable',
    ]);
    assert.equal(res.body.schemaVersion, 1);
    assert.equal(res.body.source, 'Reticulum interface discovery');
    assert.equal(res.body.stale, false);
    assert.equal(res.body.unavailable, false);
    assert.equal(res.body.reason, null);
    assert.equal(res.body.fetchedAt, '2026-10-13T12:00:00.000Z');
    assert.equal(typeof res.body.attribution, 'string');
    assert.equal(typeof res.body.coverage, 'string');
    assert.deepEqual(res.body.counts, {
      total: 1,
      positioned: 1,
      byType: { rnode: 1 },
    });
    assert.equal(res.body.interfaces.length, 1);
    assert.equal(res.body.interfaces[0].name, 'Example Gateway');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'http://127.0.0.1:8081/interfaces.json');
    assert.equal(timers.length, 1);
    assert.equal(timers[0].ms, 8000);
    assert.deepEqual(cleared, [1]);
    assert.equal((await request('')).statusCode, 200);
  }
  const typed = install({
    fetchImpl: listFetch([
      raw({ type: 'Constructor', discovery_hash: hash(1) }),
      raw({ type: 'Constructor', discovery_hash: hash(2) }),
      raw({ type: 'LoRaInterface', discovery_hash: hash(3) }),
    ]),
  });
  assert.deepEqual((await typed.request('/')).body.counts.byType, {
    constructor: 2,
    lora: 1,
  });
  const real = install({
    fetchImpl: listFetch([raw()]),
    useRealTimers: true,
  });
  assert.equal((await real.request('/')).body.unavailable, false);
  assert.equal(reticulumProxy().name, 'reticulum');
});

test('[reticulum-source-009] refuses the methods other than GET and sends no request', async () => {
  const calls = [];
  const { request } = install({ fetchImpl: listFetch([raw()], calls) });
  const post = await request('/', 'POST');
  assert.equal(post.statusCode, 405);
  assert.deepEqual(post.body, { error: 'method_not_allowed' });
  for (const method of ['DELETE', 'PUT', 'HEAD']) {
    const res = await request('/x', method);
    assert.equal(res.statusCode, 405, method);
    assert.deepEqual(res.body, { error: 'method_not_allowed' });
  }
  assert.equal(calls.length, 0);
});

test('[reticulum-source-010] refuses a query or a sub-path and sends no request', async () => {
  const calls = [];
  const { request } = install({ fetchImpl: listFetch([raw()], calls) });
  for (const url of ['/?x=1', '/other', '/?']) {
    const res = await request(url);
    assert.equal(res.statusCode, 400, url);
    assert.deepEqual(res.body, { error: 'invalid_reticulum_query' });
  }
  assert.equal(calls.length, 0);
});

test('[reticulum-source-011] reports a listener that is not set or not local and sends no request', async () => {
  const unusable = [
    ['', 'Reticulum listener not configured'],
    [undefined, 'Reticulum listener not configured'],
    ['   ', 'Reticulum listener not configured'],
    ['8.8.8.8:8081', 'Reticulum listener address not allowed'],
    ['example.com:8081', 'Reticulum listener address not allowed'],
    ['http://127.0.0.1:8081', 'Reticulum listener address not allowed'],
    ['127.0.0.1', 'Reticulum listener address not allowed'],
    ['169.254.169.254:80', 'Reticulum listener address not allowed'],
    ['[::1]:8081', 'Reticulum listener address not allowed'],
    ['100.64.0.1:8081', 'Reticulum listener address not allowed'],
    ['11.0.0.1:8081', 'Reticulum listener address not allowed'],
    ['172.15.0.1:8081', 'Reticulum listener address not allowed'],
    ['172.32.0.1:8081', 'Reticulum listener address not allowed'],
    ['192.169.0.1:8081', 'Reticulum listener address not allowed'],
    ['010.0.0.1:8081', 'Reticulum listener address not allowed'],
    ['172.016.0.1:8081', 'Reticulum listener address not allowed'],
    ['10.0.0.01:8081', 'Reticulum listener address not allowed'],
    ['10.00.0.1:8081', 'Reticulum listener address not allowed'],
  ];
  for (const [value, reason] of unusable) {
    const calls = [];
    const { request } = install({
      env: { RETICULUM_LISTENER: value },
      fetchImpl: listFetch([raw()], calls),
    });
    const res = await request('/');
    assert.equal(res.statusCode, 200, String(value));
    assert.equal(res.body.unavailable, true, String(value));
    assert.equal(res.body.reason, reason, String(value));
    assert.equal(res.body.stale, false);
    assert.equal(res.body.fetchedAt, null);
    assert.deepEqual(res.body.counts, { total: 0, positioned: 0, byType: {} });
    assert.deepEqual(res.body.interfaces, []);
    assert.equal(calls.length, 0, String(value));
  }
  for (const [value, url] of [
    ['127.0.0.1:8081', 'http://127.0.0.1:8081/interfaces.json'],
    ['localhost:9000', 'http://localhost:9000/interfaces.json'],
    ['192.168.1.5:8081', 'http://192.168.1.5:8081/interfaces.json'],
    ['127.1.2.3:8081', 'http://127.1.2.3:8081/interfaces.json'],
    ['10.1.2.3:8081', 'http://10.1.2.3:8081/interfaces.json'],
    ['172.16.0.1:8081', 'http://172.16.0.1:8081/interfaces.json'],
    ['172.31.255.254:8081', 'http://172.31.255.254:8081/interfaces.json'],
    ['listener.local:8081', 'http://listener.local:8081/interfaces.json'],
  ]) {
    const calls = [];
    const { request } = install({
      env: { RETICULUM_LISTENER: value },
      fetchImpl: listFetch([raw()], calls),
    });
    const res = await request('/');
    assert.equal(res.body.unavailable, false, value);
    assert.equal(calls[0].url, url);
  }
});

const GOOD = [raw()];
/** A valid JSON list of exactly 4 MiB (2097150 zeros, then padding). */
const EXACT = '[' + '0,'.repeat(2097150) + '0]' + ' ';
/** A valid JSON list of 4 MiB and one byte. */
const OVER = EXACT + ' ';
/** A listener that sends a redirect to a host that serves a good list. */
const redirectFetch = async (url, { redirect }) => {
  if (redirect === 'error') throw new TypeError('redirect refused');
  if (redirect === 'manual') return new Response(null, { status: 302 });
  return Response.json(GOOD);
};
function failures() {
  const timeoutFetch = (url, { signal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () =>
        reject(new DOMException('The operation was aborted', 'AbortError')),
      );
    });
  return [
    ['network error', async () => Promise.reject(new Error('refused')), {}],
    ['error status', async () => new Response('no', { status: 503 }), {}],
    [
      'error status with a list',
      async () => new Response(JSON.stringify(GOOD), { status: 503 }),
      {},
    ],
    [
      'declared size',
      async () =>
        new Response('[]', {
          headers: { 'content-length': String(4 * 1024 * 1024 + 1) },
        }),
      {},
    ],
    ['streamed size', async () => new Response(OVER), {}],
    ['redirect', redirectFetch, {}],
    ['not json', async () => new Response('not json at all'), {}],
    ['not a list', async () => Response.json({ interfaces: [] }), {}],
    ['a JSON string', async () => Response.json('text'), {}],
    ['timeout', timeoutFetch, {}, true],
    [
      'body stalls after the headers',
      async () =>
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode('['));
            },
          }),
        ),
      {},
      true,
    ],
  ];
}

test('[reticulum-source-012] serves the last good document for 2 hours when the listener fails', async () => {
  for (const [label, failing, extra, hangs] of failures()) {
    let mode = 'good';
    const signals = [];
    const fetchImpl = (url, options) => {
      signals.push(options.signal);
      return mode === 'good' ? Response.json(GOOD) : failing(url, options);
    };
    const { request, clock, timers, cleared } = install({
      fetchImpl,
      ...extra,
    });
    const attempt = async () => {
      const run = request('/');
      if (hangs) {
        await new Promise((resolve) => setImmediate(resolve));
        assert.equal(timers.at(-1).ms, 8000, label);
        assert.equal(cleared.length, timers.length - 1, label);
        assert.equal(signals.at(-1).aborted, false, label);
        timers.at(-1).fn();
        assert.equal(signals.at(-1).aborted, true, label);
      }
      return run;
    };
    const first = await request('/');
    assert.equal(first.body.unavailable, false, label);
    mode = 'bad';
    clock.t = NOW + 90_000;
    const stale = await attempt();
    assert.equal(stale.body.stale, true, label);
    assert.equal(stale.body.unavailable, false, label);
    assert.equal(stale.body.fetchedAt, '2026-10-13T12:00:00.000Z', label);
    assert.equal(stale.body.interfaces.length, 1, label);
    clock.t = NOW + 2 * HOUR - 1;
    assert.equal((await attempt()).body.stale, true, label);
    clock.t = NOW + 2 * HOUR;
    const gone = await attempt();
    assert.equal(gone.body.unavailable, true, label);
    assert.equal(gone.body.stale, false, label);
    assert.equal(gone.body.reason, 'Reticulum listener unavailable', label);
    assert.deepEqual(gone.body.interfaces, [], label);
    assert.equal(timers.length, 4, label);
    assert.deepEqual(cleared, [1, 2, 3, 4], label);
  }
  assert.equal(Buffer.byteLength(OVER), 4194305);
  let calls = 0;
  let healthy = false;
  const { request } = install({
    fetchImpl: async () => {
      calls += 1;
      return healthy
        ? Response.json(GOOD)
        : new Response('no', { status: 500 });
    },
  });
  assert.equal((await request('/')).body.unavailable, true);
  healthy = true;
  const retried = await request('/');
  assert.equal(calls, 2);
  assert.equal(retried.body.unavailable, false);
});

test('[reticulum-source-013] caches the document for 60 seconds and shares one request', async () => {
  const calls = [];
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const { request, clock } = install({
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      await gate;
      return Response.json(GOOD);
    },
  });
  const first = request('/');
  const second = request('/');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.length, 1);
  release();
  const [one, two] = await Promise.all([first, second]);
  assert.equal(calls.length, 1);
  assert.equal(one.body.fetchedAt, '2026-10-13T12:00:00.000Z');
  assert.equal(two.body.fetchedAt, '2026-10-13T12:00:00.000Z');
  clock.t = NOW + 59_999;
  const third = await request('/');
  assert.equal(calls.length, 1);
  assert.equal(third.body.fetchedAt, '2026-10-13T12:00:00.000Z');
  clock.t = NOW + 60_000;
  const fourth = await request('/');
  assert.equal(calls.length, 2);
  assert.equal(fourth.body.fetchedAt, '2026-10-13T12:01:00.000Z');
  clock.t = NOW + 90_000;
  const fifth = await request('/');
  assert.equal(calls.length, 2);
  assert.equal(fifth.body.fetchedAt, '2026-10-13T12:01:00.000Z');
});

test('[reticulum-source-014] accepts a list of exactly 4 MiB', async () => {
  assert.equal(Buffer.byteLength(EXACT), 4194304);
  const { request } = install({ fetchImpl: async () => new Response(EXACT) });
  const res = await request('/');
  assert.equal(res.body.unavailable, false);
  assert.equal(res.body.stale, false);
  assert.equal(res.body.counts.total, 2097151);
  assert.deepEqual(res.body.interfaces, []);
});
