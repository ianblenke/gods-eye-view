import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { oshProxy } from '../../server/providers/osh.js';

const SECRET_URL = 'https://osh.example/instance-fixture';
const SECRET_USER = 'fixture-user';
const SECRET_PASS = 'fixture-pass';

const SYSTEMS_BODY = { features: [{ id: 'sys-fixture-1', geometry: { type: 'Point', coordinates: [1, 2] } }] };
const DATASTREAMS_BODY = { items: [{ id: 'ds-fixture-1', 'system@id': 'sys-fixture-1' }] };
const OBSERVATION_BODY = {
  items: [{ id: 'obs-fixture-1', phenomenonTime: 't1', resultTime: 't2', result: { temperature: 21 } }],
};

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
    ['src/data/osh.js', 'src/data/oshDatastreams.js', 'src/data/oshObservations.js', 'src/data/oshSystems.js'],
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
  // Strip comments first: a JSDoc line describing the one call site, such as
  // "The only fetch() call site", is prose, not a second call in the code.
  const stripComments = (text) =>
    text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
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
