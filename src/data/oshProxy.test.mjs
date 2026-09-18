import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { OSH_DEFAULT_LOCATION_PROPERTIES, oshProxy } from '../../server/providers/osh.js';
import { OBS_TTL_MS } from '../../server/providers/osh/observations.js';

const SECRET_URL = 'https://osh.example/instance-fixture';
const SECRET_USER = 'fixture-user';
const SECRET_PASS = 'fixture-pass';

const SYSTEMS_BODY = { features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }] };
const DATASTREAMS_BODY = { items: [{ id: 'ds-fixture-1', 'system@id': 'sys-fixture-1' }] };
const OBSERVATION_BODY = {
  items: [{ id: 'obs-fixture-1', phenomenonTime: 't1', resultTime: 't2', result: { temperature: 21 } }],
};
const FOIS_BODY = {
  features: [
    {
      id: 'foi-fixture-1',
      geometry: { type: 'Point', coordinates: [3, 4] },
      properties: {
        'hostedProcedure@link': { href: 'https://osh.example/api/systems/sys-fixture-1' },
      },
    },
  ],
};

// Strip comments first: a JSDoc line describing the one call site, such as
// "The only fetch() call site", is prose, not a second call in the code.
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

/** Drive the middleware once, like a real request, and capture the response. */
async function callOsh(proxy, { method = 'GET', url = '/status', hook = 'configureServer' } = {}) {
  let handler;
  proxy[hook]({
    middlewares: {
      use(path, callback) {
        assert.equal(path, '/api/osh');
        handler = callback;
      },
    },
  });
  let status;
  let headers;
  let body;
  const res = {
    get headersSent() {
      return status !== undefined;
    },
    writeHead(code, sentHeaders) {
      status = code;
      headers = sentHeaders;
    },
    end(value) {
      body = value;
    },
  };
  await handler({ method, url }, res);
  return { status, headers, body, json: body ? JSON.parse(body) : undefined };
}

function jsonResponse(status, payload) {
  return new Response(payload === undefined ? null : JSON.stringify(payload), { status });
}

/** A fetchImpl that answers the OSH probe, systems, datastreams and observations routes. */
function fixtureFetch({ calls = [] } = {}) {
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), options });
    const parsed = new URL(String(url));
    if (parsed.pathname.endsWith('/systems')) return jsonResponse(200, SYSTEMS_BODY);
    if (parsed.pathname.endsWith('/fois')) return jsonResponse(200, FOIS_BODY);
    if (parsed.pathname.endsWith('/datastreams')) return jsonResponse(200, DATASTREAMS_BODY);
    if (parsed.pathname.endsWith('/observations')) return jsonResponse(200, OBSERVATION_BODY);
    return jsonResponse(404);
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}

test('[osh-001] reports no key on the status route when OSH_URL is not set', async () => {
  const calls = [];
  const proxy = oshProxy({ env: {}, fetchImpl: fixtureFetch({ calls }) });
  const { status, json } = await callOsh(proxy, { url: '/status' });
  assert.equal(status, 200);
  assert.equal(json.hasKey, false);
  assert.deepEqual(json.base, { candidate: null, failures: [], probedAt: null });
  assert.equal(calls.length, 0);
});

test('[osh-002] refuses every data route when OSH_URL is not set', async () => {
  const calls = [];
  const proxy = oshProxy({ env: {}, fetchImpl: fixtureFetch({ calls }) });
  for (const url of [
    '/systems',
    '/datastreams',
    '/observations?datastream=ds-fixture-1',
    '/bogus',
  ]) {
    const { status, json } = await callOsh(proxy, { url });
    assert.equal(status, 503, `${url} must answer 503 with no key, even an unknown sub-path`);
    assert.deepEqual(json, { error: 'no_key' });
  }
  assert.equal(calls.length, 0);
});

test('[osh-002] a malformed OSH_URL is also treated as no key', async () => {
  const calls = [];
  const proxy = oshProxy({ env: { OSH_URL: 'not a url' }, fetchImpl: fixtureFetch({ calls }) });
  const { status, json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(status, 503);
  assert.deepEqual(json, { error: 'no_key' });
  assert.equal(calls.length, 0);
});

test('[osh-003] reads the three keys at request time, not at plugin build', async () => {
  const calls = [];
  const env = {};
  const proxy = oshProxy({ env, fetchImpl: fixtureFetch({ calls }) });
  const before = await callOsh(proxy, { url: '/systems' });
  assert.equal(before.status, 503);
  env.OSH_URL = 'https://osh.example/api/';
  const after = await callOsh(proxy, { url: '/systems' });
  assert.equal(after.status, 200);
  assert.equal(after.json.systems.length, 1);
});

test('[osh-004] the probe, the systems, the datastreams and the observations calls are each a recorded GET with no body and an abort signal', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  await callOsh(proxy, { url: '/systems' });
  await callOsh(proxy, { url: '/datastreams' });
  await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.ok(calls.length >= 4, 'expected at least a probe, systems, datastreams and one observation call');
  for (const call of calls) {
    assert.equal(call.options.method, 'GET');
    assert.equal(call.options.body, undefined);
    assert.equal(call.options.redirect, 'manual');
    assert.ok(call.options.signal instanceof AbortSignal);
  }
});

test('[osh-005] only osh/get.js calls fetch; no other scanned file calls it, names POST, PUT, PATCH or DELETE, sends a body, or imports a raw transport', async () => {
  const providerDir = new URL('../../server/providers/osh/', import.meta.url);
  const discovered = readdirSync(providerDir)
    .filter((name) => name.endsWith('.js'))
    .sort()
    .map((name) => `server/providers/osh/${name}`);
  assert.deepEqual(
    discovered,
    [
      'server/providers/osh/base.js',
      'server/providers/osh/get.js',
      'server/providers/osh/ids.js',
      'server/providers/osh/observations.js',
    ],
    'the file list changed; a new file under server/providers/osh/ must be scanned too',
  );
  const dataDir = new URL('./', import.meta.url);
  const discoveredData = readdirSync(dataDir)
    .filter((name) => /^osh.*\.js$/.test(name) && !name.endsWith('.test.mjs'))
    .sort()
    .map((name) => `src/data/${name}`);
  assert.deepEqual(
    discoveredData,
    [
      'src/data/osh.js',
      'src/data/oshDatastreams.js',
      'src/data/oshFois.js',
      'src/data/oshObservations.js',
      'src/data/oshSystems.js',
    ],
    'the file list changed; a new src/data/osh*.js file must be scanned too',
  );
  const files = [
    'server/providers/osh.js',
    ...discovered,
    ...discoveredData,
    'server/providers/common/http.js',
  ];
  const CALL_TOKEN = /\bfetch(?:Impl)?\s*\(/;
  const CALL_TOKEN_GLOBAL = /\bfetch(?:Impl)?\s*\(/g;
  const BAD_METHOD_TOKEN = /['"](post|put|patch|delete)['"]/i;
  const BODY_TOKEN = /\bbody\s*:|['"]body['"]\s*:/;
  const RAW_TRANSPORT_TOKEN = /['"](node:http|node:https|undici|ws)['"]/;
  const source = new Map(
    files.map((file) => [
      file,
      stripComments(readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8')),
    ]),
  );
  const getJsCalls = source.get('server/providers/osh/get.js').match(CALL_TOKEN_GLOBAL) || [];
  assert.equal(getJsCalls.length, 1, 'get.js must hold exactly one fetch/fetchImpl call');
  assert.match(source.get('server/providers/osh/get.js'), /method:\s*'GET'/);
  assert.match(source.get('server/providers/osh/get.js'), /redirect:\s*'manual'/);
  for (const file of files) {
    const text = source.get(file);
    assert.doesNotMatch(text, BAD_METHOD_TOKEN, `${file} must not name a mutating HTTP method`);
    assert.doesNotMatch(text, BODY_TOKEN, `${file} must not send a request body`);
    assert.doesNotMatch(text, RAW_TRANSPORT_TOKEN, `${file} must not import a raw transport`);
    if (file !== 'server/providers/osh/get.js') {
      assert.doesNotMatch(text, CALL_TOKEN, `${file} must not call fetch directly`);
    }
  }
  assert.match(source.get('server/providers/osh.js'), /from '\.\/osh\/get\.js'/);
  assert.match(source.get('server/providers/osh/base.js'), /from '\.\/get\.js'/);
  assert.match(source.get('server/providers/osh/observations.js'), /from '\.\/get\.js'/);
});

test('[osh-006] refuses a browser request whose method is not GET, on every sub-path', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  for (const url of ['/status', '/systems', '/datastreams', '/observations?datastream=ds-fixture-1', '/nope']) {
    for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
      const { status, headers, json } = await callOsh(proxy, { method, url });
      assert.equal(status, 405);
      assert.equal(headers.Allow, 'GET');
      assert.equal(typeof json.error, 'string');
    }
  }
  assert.equal(calls.length, 0);
});

test('[osh-007] sends Basic authentication only when the username and the password are both set', async () => {
  const combos = [
    { OSH_USERNAME: '', OSH_PASSWORD: '' },
    { OSH_USERNAME: 'fixture-user', OSH_PASSWORD: '' },
    { OSH_USERNAME: '', OSH_PASSWORD: 'fixture-pass' },
    { OSH_USERNAME: 'fixture-user', OSH_PASSWORD: 'fixture-pass' },
  ];
  for (const [index, extra] of combos.entries()) {
    const calls = [];
    const proxy = oshProxy({
      env: { OSH_URL: 'https://osh.example/api/', ...extra },
      fetchImpl: fixtureFetch({ calls }),
    });
    await callOsh(proxy, { url: '/status' });
    const hasAuth = Boolean(calls[0]?.options.headers?.Authorization);
    assert.equal(hasAuth, index === 3, `combo ${index} should ${index === 3 ? '' : 'not '}send auth`);
  }
});

test('[osh-008] keeps the URL, the username and the password out of every response and every log line', async () => {
  const warnCalls = [];
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: SECRET_URL, OSH_USERNAME: SECRET_USER, OSH_PASSWORD: SECRET_PASS },
    fetchImpl: fixtureFetch({ calls }),
    warn: (...args) => warnCalls.push(args.join(' ')),
  });
  const responses = [];
  responses.push(await callOsh(proxy, { url: '/status' }));
  responses.push(await callOsh(proxy, { url: '/systems' }));
  responses.push(await callOsh(proxy, { url: '/datastreams' }));
  responses.push(await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' }));
  responses.push(await callOsh(proxy, { url: '/observations?datastream=not valid' }));
  responses.push(await callOsh(proxy, { url: '/nope' }));

  const failingProxy = oshProxy({
    env: { OSH_URL: SECRET_URL, OSH_USERNAME: SECRET_USER, OSH_PASSWORD: SECRET_PASS },
    fetchImpl: async () => jsonResponse(401),
    warn: (...args) => warnCalls.push(args.join(' ')),
  });
  responses.push(await callOsh(failingProxy, { url: '/status' }));
  responses.push(await callOsh(failingProxy, { url: '/systems' }));

  const haystacks = [...responses.map((r) => r.body || ''), ...warnCalls];
  for (const text of haystacks) {
    assert.doesNotMatch(text, new RegExp(SECRET_USER));
    assert.doesNotMatch(text, new RegExp(SECRET_PASS));
    assert.doesNotMatch(text, /osh\.example\/instance-fixture/);
  }
  const statusPayload = responses[0].json;
  for (const value of Object.values(flatten(statusPayload))) {
    if (typeof value === 'string') assert.doesNotMatch(value, /:\/\//);
  }
});

function flatten(object, out = {}) {
  for (const [key, value] of Object.entries(object || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, out);
    else out[key] = value;
  }
  return out;
}

test('[osh-013] refuses a redirect from a list route, and a 3xx during the probe counts as a miss', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    return new Response(null, { status: 302 });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { status, json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(status, 502);
  assert.equal(json.error, 'base_unresolved');
  assert.equal(calls.length, 3, 'the probe tried all three candidates');
});

test('[osh-014] walks a same-origin next link across the systems and datastreams routes', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/systems' && !parsed.searchParams.has('page')) {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }],
        links: [{ rel: 'next', href: '/api/systems?page=2' }],
      });
    }
    if (parsed.pathname === '/api/systems') {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-2', geometry: { type: 'Point', coordinates: [3, 4] } }],
      });
    }
    if (parsed.pathname === '/api/datastreams') return jsonResponse(200, DATASTREAMS_BODY);
    return jsonResponse(404);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(json.systems.length, 2);
});

test('[osh-015] a body over the cap or a timed-out probe surfaces as a base resolution failure', async () => {
  const fetchImpl = async () => {
    const response = new Response('{"features":[]}', { status: 200 });
    response.headers.set('Content-Length', String(8 * 1024 * 1024 + 1));
    return response;
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { status, json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(status, 502);
  assert.equal(json.error, 'base_unresolved');
});

test('[osh-016] serves the list cache inside the TTL, with separate caches for systems and datastreams', async () => {
  const calls = [];
  let now = 0;
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
    now: () => now,
  });
  const first = await callOsh(proxy, { url: '/systems' });
  const callsAfterFirst = calls.length;
  const second = await callOsh(proxy, { url: '/systems' });
  assert.equal(calls.length, callsAfterFirst, 'a second request inside the TTL makes no new call');
  assert.equal(first.json.stale, false);
  assert.equal(second.json.stale, false);
  const datastreams = await callOsh(proxy, { url: '/datastreams' });
  assert.ok(calls.length > callsAfterFirst, 'the datastreams cache is separate from the systems cache');
  assert.equal(datastreams.json.datastreams.length, 1);
});

test('[osh-017] shares one refresh between concurrent list requests', async () => {
  let inflightCount = 0;
  let maxInflight = 0;
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/systems') {
      inflightCount += 1;
      maxInflight = Math.max(maxInflight, inflightCount);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inflightCount -= 1;
      return jsonResponse(200, SYSTEMS_BODY);
    }
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  await Promise.all([callOsh(proxy, { url: '/systems' }), callOsh(proxy, { url: '/systems' })]);
  assert.equal(maxInflight, 1, 'only one systems request should reach the upstream at a time');
});

test('[osh-018] serves the stale list when the server fails, and 502 when there is no cache', async () => {
  let succeed = true;
  let now = 0;
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/systems') {
      if (!succeed) throw new Error('upstream down');
      return jsonResponse(200, SYSTEMS_BODY);
    }
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl,
    now: () => now,
  });
  const first = await callOsh(proxy, { url: '/systems' });
  assert.equal(first.status, 200);
  succeed = false;
  now += OSH_LIST_TTL_MS_TEST + 1;
  const second = await callOsh(proxy, { url: '/systems' });
  assert.equal(second.status, 200);
  assert.equal(second.json.stale, true);

  const emptyProxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: async (url) => {
      const parsed = new URL(String(url));
      if (parsed.searchParams.get('limit') === '1') return jsonResponse(200, SYSTEMS_BODY);
      throw new Error('always down');
    },
  });
  const noCache = await callOsh(emptyProxy, { url: '/systems' });
  assert.equal(noCache.status, 502);
  assert.deepEqual(noCache.json, { error: 'upstream_failed' });
});
const OSH_LIST_TTL_MS_TEST = 5 * 60_000;

test('[osh-019] answers 404 for an unknown sub-path', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch(),
  });
  const { status, json } = await callOsh(proxy, { url: '/bogus' });
  assert.equal(status, 404);
  assert.deepEqual(json, { error: 'not_found' });
});

test('[osh-016] the status route reports the systems and datastreams cache once each has been fetched', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  await callOsh(proxy, { url: '/systems' });
  const { json } = await callOsh(proxy, { url: '/status' });
  assert.equal(json.systems.count, 1);
  assert.equal(json.systems.stale, false);
  assert.equal(typeof json.systems.lastFetch, 'number');
});

test('[osh-043] serves the feature list, shaped and cached like the other lists', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  const first = await callOsh(proxy, { url: '/fois' });
  assert.equal(first.status, 200);
  assert.deepEqual(Object.keys(first.json).sort(), [
    'count',
    'fetchedAt',
    'fois',
    'stale',
    'truncated',
    'ttlMs',
  ]);
  assert.equal(first.json.count, 1);
  assert.equal(first.json.truncated, false);
  assert.equal(first.json.fois[0].id, 'foi-fixture-1');
  assert.equal(first.json.fois[0].systemId, 'sys-fixture-1');

  const callsAfterFirst = calls.length;
  await callOsh(proxy, { url: '/fois' });
  assert.equal(calls.length, callsAfterFirst, 'a second request inside the TTL makes no new call');

  const foisCall = calls.find((call) => call.url.includes('/fois'));
  assert.equal(foisCall.options.method, 'GET');
  assert.equal(foisCall.options.body, undefined);
  assert.ok(foisCall.options.signal instanceof AbortSignal);
  const foisUrl = new URL(foisCall.url);
  assert.equal(foisUrl.search, '?limit=200&f=application%2Fgeo%2Bjson');
  const params = new URLSearchParams(foisUrl.search);
  assert.equal(foisUrl.search, `?${params.toString()}`);

  const { json: statusJson } = await callOsh(proxy, { url: '/status' });
  assert.equal(statusJson.fois.count, 1);
  assert.equal(statusJson.fois.stale, false);
  assert.equal(typeof statusJson.fois.lastFetch, 'number');
});

test('[osh-043] shares one walk between concurrent requests, and serves the stale snapshot on failure', async () => {
  let succeed = true;
  let calls = 0;
  const fetchImpl = async (url) => {
    calls += 1;
    if (String(url).includes('/fois')) {
      if (!succeed) return jsonResponse(500);
      return jsonResponse(200, FOIS_BODY);
    }
    return jsonResponse(200, SYSTEMS_BODY);
  };
  let now = 0;
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl, now: () => now });
  const [a, b] = await Promise.all([callOsh(proxy, { url: '/fois' }), callOsh(proxy, { url: '/fois' })]);
  assert.equal(a.json.count, 1);
  assert.equal(b.json.count, 1);

  succeed = false;
  now += 5 * 60_000 + 1;
  const stale = await callOsh(proxy, { url: '/fois' });
  assert.equal(stale.json.stale, true);
  assert.equal(stale.json.count, 1);
});

test('[osh-043] a failed walk with no earlier snapshot answers 502 with upstream_failed', async () => {
  const fetchImpl = async (url) => {
    if (String(url).includes('/fois')) return jsonResponse(500);
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { status, json } = await callOsh(proxy, { url: '/fois' });
  assert.equal(status, 502);
  assert.deepEqual(json, { error: 'upstream_failed' });
});

test('[osh-044] the fois route reports truncated when the walk stopped with a next link still named', async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (!parsed.pathname.endsWith('/fois')) return jsonResponse(200, SYSTEMS_BODY);
    const page = Number(parsed.searchParams.get('page') || '1');
    return jsonResponse(200, {
      features: [{ id: `foi-fixture-${page}`, geometry: { type: 'Point', coordinates: [1, 2] } }],
      links: [{ rel: 'next', href: `fois?limit=200&page=${page + 1}` }],
    });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/fois' });
  assert.equal(json.truncated, true);
  assert.equal(json.count, 60, 'the feature walk stops at its own cap of 60 pages');
});

const SYSTEM_ID_REJECTED_VALUES = [
  '../systems',
  '..%2Fsystems',
  'https://osh.example/x',
  '//osh.example/x',
  'http:x',
  'javascript:x',
  'a?limit=1',
  'a&limit=1',
  'a#f',
  'a/b',
  'a%2Fb',
  'a.b',
  'a b',
  'a'.repeat(65),
];

test('[osh-047] the datastreams route rejects an empty, repeated or malformed system id with no upstream call', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  for (const url of [
    '/datastreams?system=',
    '/datastreams?system=sys-fixture-1&system=sys-fixture-2',
    ...SYSTEM_ID_REJECTED_VALUES.map((value) => `/datastreams?system=${encodeURIComponent(value)}`),
  ]) {
    const { status, json } = await callOsh(proxy, { url });
    assert.equal(status, 400, `${url} must be refused`);
    assert.deepEqual(json, { error: 'bad_system' });
  }
  assert.equal(calls.length, 0, 'a refused system id must cause zero upstream requests');
});

test('[osh-047] a request with no system key at all serves the global datastreams list, as osh-016 says', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  const { status, json } = await callOsh(proxy, { url: '/datastreams' });
  assert.equal(status, 200);
  assert.ok(Array.isArray(json.datastreams));
  assert.equal(json.system, undefined, 'the global list response carries no system field');
});

test('[osh-048] the per-system datastreams route records the fixed URL, with no f key', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  const { status, json } = await callOsh(proxy, { url: '/datastreams?system=sys-fixture-1' });
  assert.equal(status, 200);
  assert.deepEqual(Object.keys(json).sort(), [
    'count',
    'datastreams',
    'fetchedAt',
    'stale',
    'system',
    'ttlMs',
  ]);
  assert.equal(json.system, 'sys-fixture-1');
  assert.equal(json.count, 1);

  const call = calls.find((c) => c.url.includes('/systems/sys-fixture-1/datastreams'));
  assert.ok(call, 'expected a recorded call to the per-system route');
  assert.equal(call.options.method, 'GET');
  assert.equal(call.options.body, undefined);
  assert.ok(call.options.signal instanceof AbortSignal);
  const calledUrl = new URL(call.url);
  assert.equal(calledUrl.pathname, '/api/systems/sys-fixture-1/datastreams');
  assert.equal(calledUrl.search, '?limit=100');
  assert.equal(calledUrl.searchParams.has('f'), false, 'the per-system list must send no f key');
  const params = new URLSearchParams(calledUrl.search);
  assert.equal(calledUrl.search, `?${params.toString()}`);
});

test('[osh-048] caches the per-system datastreams per id, and the status route reports the cache size', async () => {
  const callsById = new Map();
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    const match = parsed.pathname.match(/systems\/([^/]+)\/datastreams/);
    if (match) {
      callsById.set(match[1], (callsById.get(match[1]) || 0) + 1);
      return jsonResponse(200, DATASTREAMS_BODY);
    }
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  await Promise.all([
    callOsh(proxy, { url: '/datastreams?system=sys-fixture-1' }),
    callOsh(proxy, { url: '/datastreams?system=sys-fixture-1' }),
  ]);
  assert.equal(callsById.get('sys-fixture-1'), 1);
  await callOsh(proxy, { url: '/datastreams?system=sys-fixture-2' });
  assert.equal(callsById.get('sys-fixture-2'), 1);

  const { json: statusJson } = await callOsh(proxy, { url: '/status' });
  assert.equal(statusJson.datastreamsBySystem.cached, 2);
});

test('[osh-048] serves the stale snapshot for a system on a failed walk, and 502 with none', async () => {
  let succeed = true;
  let now = 0;
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.includes('/systems/') && parsed.pathname.endsWith('/datastreams')) {
      if (!succeed) return jsonResponse(500);
      return jsonResponse(200, DATASTREAMS_BODY);
    }
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl, now: () => now });
  await callOsh(proxy, { url: '/datastreams?system=sys-fixture-1' });
  succeed = false;
  now += 5 * 60_000 + 1;
  const stale = await callOsh(proxy, { url: '/datastreams?system=sys-fixture-1' });
  assert.equal(stale.json.stale, true);

  const failed = await callOsh(proxy, { url: '/datastreams?system=sys-fixture-new' });
  assert.equal(failed.status, 502);
  assert.deepEqual(failed.json, { error: 'upstream_failed' });
});

test('[osh-014] a malformed page payload with no known list key contributes no records', async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.searchParams.get('limit') === '1') return jsonResponse(200, SYSTEMS_BODY);
    return jsonResponse(200, {});
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const systems = await callOsh(proxy, { url: '/systems' });
  assert.deepEqual(systems.json.systems, []);
  const datastreams = await callOsh(proxy, { url: '/datastreams' });
  assert.deepEqual(datastreams.json.datastreams, []);
});

test('[osh-014] the systems and datastreams page readers also accept their secondary list key', async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.searchParams.get('limit') === '1') return jsonResponse(200, SYSTEMS_BODY);
    if (parsed.pathname === '/api/systems') return jsonResponse(200, { items: SYSTEMS_BODY.features });
    return jsonResponse(200, { datastreams: DATASTREAMS_BODY.items });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const systems = await callOsh(proxy, { url: '/systems' });
  assert.equal(systems.json.systems.length, 1);
  const datastreams = await callOsh(proxy, { url: '/datastreams' });
  assert.equal(datastreams.json.datastreams.length, 1);
});

test('[osh-009] the status route reports no probe time when the constant clock reads zero', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch(),
    now: () => 0,
  });
  const { json } = await callOsh(proxy, { url: '/status' });
  assert.equal(json.base.probedAt, null);
});

test('[osh-019] a request with no url falls back to the empty sub-path and answers 404', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch(),
  });
  let handler;
  proxy.configureServer({
    middlewares: {
      use(_path, callback) {
        handler = callback;
      },
    },
  });
  let status;
  await handler(
    { method: 'GET' },
    {
      writeHead(code) {
        status = code;
      },
      end() {},
    },
  );
  assert.equal(status, 404);
});

test('[osh-022] the observations route answers the full 200 payload for a datastream', async () => {
  let now = 5000;
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch(),
    now: () => now,
  });
  const { status, json } = await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.equal(status, 200);
  assert.equal(json.datastream, 'ds-fixture-1');
  assert.equal(json.fetchedAt, 5000);
  assert.equal(json.stale, false);
  assert.equal(json.ttlMs, 15_000);
  assert.equal(json.observation.phenomenonTime, 't1');
  assert.equal(json.observation.resultTime, 't2');
  assert.ok(json.observation.rows.some((row) => row.path === 'temperature' && row.value === 21));
  assert.equal(json.observation.location, null);
});

test('[osh-022] an empty upstream item list gives observation:null', async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.endsWith('/observations')) return jsonResponse(200, { items: [] });
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { status, json } = await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.equal(status, 200);
  assert.equal(json.observation, null);
});

test('[osh-022] an observation failure with no numeric status reports upstreamStatus:null', async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.endsWith('/observations')) throw new Error('socket hang up');
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { status, json } = await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.equal(status, 502);
  assert.deepEqual(json, { error: 'observation_failed', upstreamStatus: null });
});

test('[osh-008] an internal error with no message still logs and answers 500', async () => {
  const warnCalls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch(),
    now: () => {
      throw new Error();
    },
    warn: (...args) => warnCalls.push(args.join(' ')),
  });
  const { status, json } = await callOsh(proxy, { url: '/status' });
  assert.equal(status, 500);
  assert.deepEqual(json, { error: 'osh proxy error' });
  assert.ok(warnCalls.some((line) => line.includes('internal error')));
});

test('[osh-020] the observations route rejects a bad datastream id with no upstream call', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch({ calls }),
  });
  const { status, json } = await callOsh(proxy, { url: '/observations?datastream=a%2Fb' });
  assert.equal(status, 400);
  assert.deepEqual(json, { error: 'bad_datastream' });
  assert.equal(calls.length, 0);
});

test('[osh-021] a caller cannot replace the URL builder or its safety check', () => {
  const accessed = new Set();
  const optionsProxy = new Proxy(
    { env: {}, fetchImpl: async () => new Response(null, { status: 404 }), now: () => 0, warn: () => {} },
    {
      get(target, prop) {
        accessed.add(prop);
        return target[prop];
      },
    },
  );
  oshProxy(optionsProxy);
  assert.deepEqual(
    [...accessed].sort(),
    ['env', 'fetchImpl', 'now', 'warn'],
    'oshProxy() must destructure only these four options; any other name it reads could be a reintroduced seam',
  );
  const oshJsSource = readFileSync(new URL('../../server/providers/osh.js', import.meta.url), 'utf8');
  // The signature ends right after its one destructured parameter, so a
  // second parameter cannot hide there either.
  assert.match(
    oshJsSource,
    /export function oshProxy\(\{[^)]*\} = \{\}\) \{/,
    'oshProxy() must take exactly one parameter, so a seam cannot hide in a second one',
  );
  assert.match(oshJsSource, /\bobservationUrl\(/);
  assert.match(oshJsSource, /\bassertObservationUrl\(/);
  assert.match(oshJsSource, /from '\.\/osh\/ids\.js'/);
});

test('[osh-022] the observations route answers 502 with the upstream status on an upstream failure', async () => {
  const fetchImpl = async (url) => {
    const parsed = new URL(String(url));
    if (parsed.pathname.endsWith('/observations')) return jsonResponse(400);
    return jsonResponse(200, SYSTEMS_BODY);
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { status, json } = await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.equal(status, 502);
  assert.deepEqual(json, { error: 'observation_failed', upstreamStatus: 400 });
});

test('[osh-012] the datastreams route answers base_unresolved and auth_failed as appropriate', async () => {
  const authProxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: async () => jsonResponse(401),
  });
  const auth = await callOsh(authProxy, { url: '/datastreams' });
  assert.equal(auth.status, 502);
  assert.deepEqual(auth.json, { error: 'auth_failed' });
});

test('[osh-012] the observations route reports base_unresolved when the root cannot be resolved', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: async () => jsonResponse(404),
  });
  const { status, json } = await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.equal(status, 502);
  assert.deepEqual(json, { error: 'base_unresolved' });
});

test('[osh-012] the per-system datastreams route reports base_unresolved when the root cannot be resolved', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: async () => jsonResponse(404),
  });
  const { status, json } = await callOsh(proxy, { url: '/datastreams?system=sys-fixture-1' });
  assert.equal(status, 502);
  assert.deepEqual(json, { error: 'base_unresolved' });
});

test('[osh-012] the fois route reports base_unresolved when the root cannot be resolved', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: async () => jsonResponse(404),
  });
  const { status, json } = await callOsh(proxy, { url: '/fois' });
  assert.equal(status, 502);
  assert.deepEqual(json, { error: 'base_unresolved' });
});

test('[osh-035] both configureServer and configurePreviewServer install the same middleware', async () => {
  for (const hook of ['configureServer', 'configurePreviewServer']) {
    const proxy = oshProxy({ env: {}, fetchImpl: fixtureFetch() });
    const { status } = await callOsh(proxy, { url: '/status', hook });
    assert.equal(status, 200);
  }
});

test('[osh-008] an unexpected internal error answers 500 and is logged without the request URL', async () => {
  const warnCalls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: fixtureFetch(),
    now: () => {
      throw new Error('now is broken');
    },
    warn: (...args) => warnCalls.push(args.join(' ')),
  });
  const { status, json } = await callOsh(proxy, { url: '/status' });
  assert.equal(status, 500);
  assert.deepEqual(json, { error: 'osh proxy error' });
  assert.ok(warnCalls.some((line) => line.includes('now is broken')));
});

test('[osh-037] the probe, the systems list and the datastreams list send the queries that oshListUrl builds', async () => {
  const calls = [];
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl: fixtureFetch({ calls }) });
  await callOsh(proxy, { url: '/systems' });
  await callOsh(proxy, { url: '/datastreams' });
  const queries = calls.map((call) => new URL(call.url).search.slice(1));
  assert.equal(queries[0], 'limit=1&f=application%2Fgeo%2Bjson', 'the base probe');
  assert.equal(queries[1], 'limit=100&f=application%2Fgeo%2Bjson', 'the systems list');
  assert.equal(queries[2], 'limit=100', 'the datastreams list');
});

test('[osh-038] each recorded upstream query round-trips through URLSearchParams, decodes f to the GeoJSON format and holds no space', async () => {
  const calls = [];
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl: fixtureFetch({ calls }) });
  await callOsh(proxy, { url: '/systems' });
  await callOsh(proxy, { url: '/datastreams' });
  await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.ok(calls.length >= 4, 'expected at least a probe, a systems, a datastreams and one observation call');
  for (const call of calls) {
    const url = new URL(call.url);
    const params = new URLSearchParams(url.search);
    const expected = params.size === 0 ? '' : `?${params.toString()}`;
    assert.equal(url.search, expected, `${call.url} must round-trip through URLSearchParams byte for byte`);
    for (const value of params.values()) {
      assert.doesNotMatch(value, / /, `${call.url} must decode to no space in any query value`);
    }
    if (params.has('f')) {
      assert.equal(params.get('f'), 'application/geo+json', `${call.url} must decode f to the GeoJSON format`);
    }
  }
});

test('[osh-039] the provider files write no query as a literal string, and no query value as a hand-encoded byte', () => {
  const providerDir = new URL('../../server/providers/osh/', import.meta.url);
  const discovered = readdirSync(providerDir)
    .filter((name) => name.endsWith('.js'))
    .sort()
    .map((name) => `server/providers/osh/${name}`);
  assert.deepEqual(
    discovered,
    [
      'server/providers/osh/base.js',
      'server/providers/osh/get.js',
      'server/providers/osh/ids.js',
      'server/providers/osh/observations.js',
    ],
    'the file list changed; a new file under server/providers/osh/ must be scanned too',
  );
  const files = ['server/providers/osh.js', ...discovered];
  const QUOTED_STRING = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`/g;
  const PAIR_TOKEN = /(?:^|[?&])[^&=\s]+=([^&]*)/g;
  const BAD_BYTE = /[+%# ]/;
  const LITERAL_QUERY = /\?[^&=\s]+=/;
  for (const file of files) {
    const text = stripComments(readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8'));
    for (const literal of text.match(QUOTED_STRING) || []) {
      const body = literal.slice(1, -1);
      assert.doesNotMatch(body, LITERAL_QUERY, `${file} must not write a URL with a literal query: ${literal}`);
      for (const pair of body.matchAll(PAIR_TOKEN)) {
        assert.doesNotMatch(pair[1], BAD_BYTE, `${file} must not write a hand-encoded query value: ${literal}`);
      }
    }
  }
});

test('[osh-040] the next-page walk keeps the provider\'s own format, even when a server writes a different f value', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/systems' && !parsed.searchParams.has('page')) {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }],
        links: [{ rel: 'next', href: 'systems?page=2&f=application/geo+json' }],
      });
    }
    return jsonResponse(200, {
      features: [{ id: 'sys-fixture-2', geometry: { type: 'Point', coordinates: [3, 4] } }],
    });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(json.systems.length, 2);
  const page2 = calls.find((call) => new URL(call).searchParams.get('page') === '2');
  assert.ok(page2, 'expected a second page request');
  assert.match(new URL(page2).search, /f=application%2Fgeo%2Bjson/, 'page 2 must carry the provider\'s own encoded format');
  assert.equal(new URL(page2).searchParams.get('f'), 'application/geo+json', 'page 2 must decode f to the GeoJSON format, not the value the server wrote');
});

test('[osh-040] the walk still ends at the provider\'s own format, even when a next link\'s f value is different but valid', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/systems' && !parsed.searchParams.has('page')) {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }],
        links: [{ rel: 'next', href: 'systems?page=2&f=json' }],
      });
    }
    return jsonResponse(200, {
      features: [{ id: 'sys-fixture-2', geometry: { type: 'Point', coordinates: [3, 4] } }],
    });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(json.systems.length, 2);
  const page2 = calls.find((call) => new URL(call).searchParams.get('page') === '2');
  assert.ok(page2, 'expected a second page request');
  assert.equal(
    new URL(page2).searchParams.get('f'),
    'application/geo+json',
    'page 2 must replace a legitimately different f value, not repair it in place',
  );
});

test('[osh-040] the datastreams walk keeps no f key, even when a next link writes one', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/datastreams' && !parsed.searchParams.has('page')) {
      return jsonResponse(200, {
        items: [{ id: 'ds-fixture-1', 'system@id': 'sys-fixture-1' }],
        links: [{ rel: 'next', href: 'datastreams?page=2&f=application/geo+json' }],
      });
    }
    return jsonResponse(200, { items: [{ id: 'ds-fixture-2', 'system@id': 'sys-fixture-1' }] });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/datastreams' });
  assert.equal(json.datastreams.length, 2);
  const page2 = calls.find((call) => new URL(call).searchParams.get('page') === '2');
  assert.ok(page2, 'expected a second page request');
  assert.equal(new URL(page2).searchParams.has('f'), false, 'the datastreams list never asks for a format, so page 2 must carry no f key');
});

test('[osh-040] a systems next link that omits f entirely still gets the provider\'s own format', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    if (parsed.pathname === '/api/systems' && !parsed.searchParams.has('page')) {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }],
        links: [{ rel: 'next', href: 'systems?page=2' }],
      });
    }
    return jsonResponse(200, {
      features: [{ id: 'sys-fixture-2', geometry: { type: 'Point', coordinates: [3, 4] } }],
    });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(json.systems.length, 2);
  const page2 = calls.find((call) => new URL(call).searchParams.get('page') === '2');
  assert.ok(page2, 'expected a second page request');
  assert.equal(
    new URL(page2).searchParams.get('f'),
    'application/geo+json',
    'page 1 asked for a format, so page 2 must carry ours even when the link omits the key entirely',
  );
});

test('[osh-040] the format stays on every page of a multi-page systems walk', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    const page = parsed.searchParams.get('page');
    if (!page) {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }],
        links: [{ rel: 'next', href: 'systems?page=2' }],
      });
    }
    if (page === '2') {
      return jsonResponse(200, {
        features: [{ id: 'sys-fixture-2', geometry: { type: 'Point', coordinates: [3, 4] } }],
        links: [{ rel: 'next', href: 'systems?page=3' }],
      });
    }
    return jsonResponse(200, {
      features: [{ id: 'sys-fixture-3', geometry: { type: 'Point', coordinates: [5, 6] } }],
    });
  };
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl });
  const { json } = await callOsh(proxy, { url: '/systems' });
  assert.equal(json.systems.length, 3);
  const page3 = calls.find((call) => new URL(call).searchParams.get('page') === '3');
  assert.ok(page3, 'expected a third page request');
  assert.equal(
    new URL(page3).searchParams.get('f'),
    'application/geo+json',
    'page 1 asked for a format, so page 3 must still carry ours even though the page 2 link omitted it',
  );
});

// --- osh-055 / osh-056: location discovery and the /locations route ------

const SCHEMA_NO_LOCATION = { resultSchema: { type: 'DataRecord', fields: [] } };
const SCHEMA_VECTOR = JSON.parse(
  readFileSync(new URL('./fixtures/osh-schema-vector.json', import.meta.url), 'utf8'),
);
const LATEST_PAGE = JSON.parse(
  readFileSync(new URL('./fixtures/osh-latest-page.json', import.meta.url), 'utf8'),
);

/**
 * A fetchImpl that answers every route the location pass touches. Every
 * candidate's schema answers SCHEMA_NO_LOCATION by default, so the pass
 * never reaches a page read (and so never needs Part B's oshObservationAgeMs,
 * still to be merged) unless a test opts a specific id into
 * `withLocationSchemaIds`.
 */
function locationsFetch({
  filterByUri = {},
  systemsBody = { features: [] },
  foisBody = { features: [] },
  systemDatastreamsById = {},
  withLocationSchemaIds = new Set(),
  systemById = {},
  calls = [],
} = {}) {
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), options });
    const parsed = new URL(String(url));
    if (parsed.pathname.endsWith('/systems') && !parsed.pathname.includes('/systems/')) {
      return jsonResponse(200, systemsBody);
    }
    if (parsed.pathname.endsWith('/fois')) return jsonResponse(200, foisBody);
    const systemMatch = parsed.pathname.match(/\/systems\/([^/]+)$/);
    if (systemMatch) {
      const record = systemById[systemMatch[1]];
      return record ? jsonResponse(200, { properties: { name: record.name } }) : jsonResponse(404);
    }
    const perSystemMatch = parsed.pathname.match(/\/systems\/([^/]+)\/datastreams$/);
    if (perSystemMatch) {
      const items = systemDatastreamsById[perSystemMatch[1]] || [];
      return jsonResponse(200, { items });
    }
    if (parsed.pathname.endsWith('/datastreams') && parsed.searchParams.has('observedProperty')) {
      const items = filterByUri[parsed.searchParams.get('observedProperty')] || [];
      return jsonResponse(200, { items });
    }
    const schemaMatch = parsed.pathname.match(/\/datastreams\/([^/]+)\/schema$/);
    if (schemaMatch) {
      return jsonResponse(200, withLocationSchemaIds.has(schemaMatch[1]) ? SCHEMA_VECTOR : SCHEMA_NO_LOCATION);
    }
    const latestMatch = parsed.pathname.match(/\/datastreams\/([^/]+)\/observations$/);
    if (latestMatch) return jsonResponse(200, LATEST_PAGE);
    return jsonResponse(404);
  };
  fetchImpl.calls = calls;
  return fetchImpl;
}

test('[osh-055] sends one request per default URI, built with limit and observedProperty, cached per URI', async () => {
  const calls = [];
  const [uriA, uriB] = OSH_DEFAULT_LOCATION_PROPERTIES;
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: locationsFetch({
      calls,
      filterByUri: {
        [uriA]: [{ id: 'ds-fixture-a', 'system@id': 'sys-fixture-9' }],
        [uriB]: [{ id: 'ds-fixture-b', 'system@id': 'sys-fixture-9' }],
      },
    }),
  });
  const { status, json } = await callOsh(proxy, { url: '/locations' });
  assert.equal(status, 200);
  assert.equal(json.streams, 2);
  assert.equal(json.failed, 2, 'neither candidate schema carries a location in this stub');
  assert.equal(json.count, 0);

  const filterCalls = calls.filter((call) => call.url.includes('observedProperty'));
  assert.equal(filterCalls.length, 2);
  for (const call of filterCalls) {
    const url = new URL(call.url);
    assert.equal(url.searchParams.get('limit'), '200');
    assert.ok([uriA, uriB].includes(url.searchParams.get('observedProperty')));
  }

  const bodyText = JSON.stringify(json);
  assert.ok(!bodyText.includes(uriA) && !bodyText.includes(uriB), 'no response ever carries a property URI');
});

test('[osh-055] appends an accepted OSH_LOCATION_PROPERTIES entry and skips a refused one with a positional warning', async () => {
  const calls = [];
  const warnCalls = [];
  const proxy = oshProxy({
    env: {
      OSH_URL: 'https://osh.example/api/',
      OSH_LOCATION_PROPERTIES: 'urn:osh:def:fixture:position:3.0.0#location,not a uri',
    },
    fetchImpl: locationsFetch({ calls }),
    warn: (...args) => warnCalls.push(args.join(' ')),
  });
  await callOsh(proxy, { url: '/locations' });
  const filterCalls = calls.filter((call) => call.url.includes('observedProperty'));
  assert.equal(filterCalls.length, 3, 'two defaults plus the one accepted appended URI');
  assert.ok(
    warnCalls.some((line) => line.includes('position 1') && !line.includes('not a uri')),
    'the warning names the position, never the refused text',
  );
});

test('[osh-055] a candidate found only by the filter, whose system is in no systems snapshot, is served like any other', async () => {
  const [uriA] = OSH_DEFAULT_LOCATION_PROPERTIES;
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: locationsFetch({
      filterByUri: { [uriA]: [{ id: 'ds-fixture-a', 'system@id': 'sys-fixture-unseen' }] },
    }),
  });
  const { json } = await callOsh(proxy, { url: '/locations' });
  assert.equal(json.streams, 1, 'the candidate is counted even though its system is unseen');
});

test('[osh-055] the status route reports the count of location properties', async () => {
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/', OSH_LOCATION_PROPERTIES: 'urn:osh:def:fixture:position:1#p' },
    fetchImpl: locationsFetch(),
  });
  const { json } = await callOsh(proxy, { url: '/status' });
  assert.equal(json.locationProperties.count, 3);
});

test('[osh-056] the response shape is {fetchedAt, stale, ttlMs, count, streams, failed, locations}', async () => {
  const proxy = oshProxy({ env: { OSH_URL: 'https://osh.example/api/' }, fetchImpl: locationsFetch() });
  const { status, json } = await callOsh(proxy, { url: '/locations' });
  assert.equal(status, 200);
  assert.deepEqual(Object.keys(json).sort(), [
    'count',
    'failed',
    'fetchedAt',
    'locations',
    'stale',
    'streams',
    'ttlMs',
  ]);
  assert.equal(json.ttlMs, OBS_TTL_MS);
});

test('[osh-056] unites the property filter, the feature hosts and the Point systems, without duplicates', async () => {
  const [uriA] = OSH_DEFAULT_LOCATION_PROPERTIES;
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: locationsFetch({
      filterByUri: { [uriA]: [{ id: 'ds-shared', 'system@id': 'sys-fixture-1' }] },
      systemsBody: {
        features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }],
      },
      foisBody: {
        features: [
          {
            id: 'foi-fixture-1',
            geometry: { type: 'Point', coordinates: [3, 4] },
            properties: {
              'hostedProcedure@link': { href: 'https://osh.example/api/systems/sys-fixture-2' },
            },
          },
        ],
      },
      systemDatastreamsById: {
        'sys-fixture-1': [{ id: 'ds-shared', 'system@id': 'sys-fixture-1' }],
        'sys-fixture-2': [{ id: 'ds-fixture-mesh', 'system@id': 'sys-fixture-2' }],
      },
    }),
  });
  const { json } = await callOsh(proxy, { url: '/locations' });
  assert.equal(json.streams, 2, 'ds-shared, named by both the filter and the Point system, counts once');
});

test('[osh-056] with no candidate at all, it answers count:0 and sends no schema and no page request', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: locationsFetch({ calls }),
  });
  const { json } = await callOsh(proxy, { url: '/locations' });
  assert.equal(json.count, 0);
  assert.equal(json.streams, 0);
  assert.ok(!calls.some((call) => call.url.includes('/schema')));
  assert.ok(!calls.some((call) => call.url.includes('resultTime=latest')));
});

test('[osh-056] caches the whole pass for its own fifteen-second TTL, and shares one refresh across concurrent requests', async () => {
  let refreshes = 0;
  let now = 0;
  const fetchImpl = locationsFetch();
  const wrappedFetch = async (...args) => {
    if (new URL(String(args[0])).searchParams.has('observedProperty')) refreshes += 1;
    return fetchImpl(...args);
  };
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: wrappedFetch,
    now: () => now,
  });
  const [a, b] = await Promise.all([
    callOsh(proxy, { url: '/locations' }),
    callOsh(proxy, { url: '/locations' }),
  ]);
  assert.equal(a.json.fetchedAt, b.json.fetchedAt, 'two concurrent loads inside the TTL share one refresh');
  const afterFirst = refreshes;
  assert.ok(afterFirst > 0);

  now += OBS_TTL_MS - 1;
  const secondCall = await callOsh(proxy, { url: '/locations' });
  assert.equal(secondCall.json.fetchedAt, a.json.fetchedAt, 'a load inside the TTL reuses the cached pass');
  assert.equal(refreshes, afterFirst, 'and so sends no new upstream request');

  now += 2;
  const thirdCall = await callOsh(proxy, { url: '/locations' });
  assert.notEqual(thirdCall.json.fetchedAt, a.json.fetchedAt, 'a load past the TTL runs a fresh pass');
});

test('[osh-056] the observations route reads a candidate schema before it serves the observation', async () => {
  const calls = [];
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: locationsFetch({ calls, withLocationSchemaIds: new Set(['ds-fixture-1']) }),
  });
  await callOsh(proxy, { url: '/observations?datastream=ds-fixture-1' });
  assert.ok(calls.some((call) => call.url.includes('/datastreams/ds-fixture-1/schema')));
});

test('[osh-056] the happy path: a candidate with a location-bearing schema yields folded location records (needs osh-observation-age merged for ageMs)', async () => {
  const [uriA] = OSH_DEFAULT_LOCATION_PROPERTIES;
  const proxy = oshProxy({
    env: { OSH_URL: 'https://osh.example/api/' },
    fetchImpl: locationsFetch({
      filterByUri: { [uriA]: [{ id: 'ds-aircraft', 'system@id': 'sys-fixture-9', name: 'Aircraft Position' }] },
      withLocationSchemaIds: new Set(['ds-aircraft']),
      systemById: { 'sys-fixture-9': { name: 'Fixture Aircraft' } },
    }),
  });
  const { json } = await callOsh(proxy, { url: '/locations' });
  assert.equal(json.streams, 1);
  assert.equal(json.failed, 0);
  assert.equal(json.locations.length, 2, 'the fixture page has two items with a location out of three');
  const first = json.locations[0];
  assert.equal(first.systemId, 'sys-fixture-9');
  assert.equal(first.systemName, 'Fixture Aircraft');
  assert.equal(first.datastreamId, 'ds-aircraft');
  assert.equal(first.datastreamName, 'Aircraft Position');
  assert.equal(typeof first.ageMs, 'number');
});
