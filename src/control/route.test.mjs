import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { oshControlProxy, createCommandGate, isSameOriginCommand } from '../../server/providers/osh-control.js';
import { resolveCommand, resolveTargets, routeConfig } from '../../server/providers/osh-control/targets.js';
import { oshCommandUrl, assertCommandUrl } from '../../server/providers/osh-control/url.js';
import { oshPostCommand } from '../../server/providers/osh-control/post.js';

function route(env, fetchImpl = async () => { throw new Error('unexpected upstream call'); }, log = async () => {}) {
  let middleware;
  oshControlProxy({ env, fetchImpl, warn: () => {}, log }).configureServer({
    middlewares: { use(path, handler) { assert.equal(path, '/api/control/osh'); middleware = handler; } },
  });
  return async (method, path, body, headers = {}) => {
    const req = { method, url: path, headers: { host: 'localhost:5173', origin: 'http://localhost:5173', 'content-type': 'application/json', ...headers }, socket: { remoteAddress: '127.0.0.1' } };
    const chunks = body === undefined ? [] : [Buffer.from(JSON.stringify(body))];
    req[Symbol.asyncIterator] = async function* () { yield* chunks; };
    const result = { headers: {}, statusCode: 200 };
    const res = { setHeader(name, value) { result.headers[name] = value; }, end(value) { result.body = JSON.parse(value); result.status = result.statusCode; }, get statusCode() { return result.statusCode; }, set statusCode(value) { result.statusCode = value; } };
    await middleware(req, res, () => { throw new Error('route missed'); });
    return result;
  };
}

const enabled = { OSH_CONTROL_ENABLED: 'true', OSH_URL: 'https://fixture.invalid/', OSH_CONTROL_USERNAME: 'operator', OSH_CONTROL_PASSWORD: 'fixture-secret', OSH_USERNAME: 'reader' };
const commandBody = { system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } };
function upstream(options = {}) {
  return async (url, request) => {
    if (request.method === 'POST') return options.post?.(url, request) || new Response(null, { status: 201 });
    if (url.includes('/systems?')) return Response.json({ items: [] });
    if (url.endsWith('/controlstreams')) return options.list || Response.json({ items: [{ id: 'cs-fixture-one' }] });
    return options.schema || Response.json({ parametersSchema: { name: 'mavRTLControl', fields: [{ type: 'Boolean', name: 'rtl' }] } });
  };
}

test('[osh-control-001] Keep the route off without the exact flag', async () => {
  for (const flag of [undefined, '', '1', 'yes', 'TRUE']) {
    const call = route({ ...enabled, OSH_CONTROL_ENABLED: flag });
    assert.deepEqual((await call('GET', '/targets')).body, { enabled: false, reason: 'control_off', commands: {} });
    const result = await call('POST', '/commands', {});
    assert.equal(result.status, 403);
    assert.deepEqual(result.body, { error: 'control_off' });
  }
});

test('[osh-control-002] Refuse the same command account', async () => {
  const call = route({ ...enabled, OSH_CONTROL_USERNAME: ' Operator ', OSH_USERNAME: 'operator' });
  const result = await call('POST', '/commands', { ...commandBody, system: 'bad id' });
  assert.equal(result.status, 403);
  assert.deepEqual(result.body, { error: 'same_account' });
});

test('[osh-control-003] Refuse absent route inputs in order', async () => {
  for (const [change, reason] of [[{ OSH_URL: '::' }, 'no_key'], [{ OSH_CONTROL_USERNAME: '' }, 'no_account'], [{ OSH_CONTROL_PASSWORD: '' }, 'no_account']]) {
    const call = route({ ...enabled, ...change });
    const result = await call('POST', '/commands', {});
    assert.equal(result.status, 403);
    assert.deepEqual(result.body, { error: reason });
  }
  // Two inputs are bad at once. Check the order of the route checks.
  const urlAndAccount = await route({ ...enabled, OSH_URL: '::', OSH_CONTROL_USERNAME: '' })('POST', '/commands', {});
  assert.deepEqual(urlAndAccount.body, { error: 'no_key' });
  const absentAccount = await route({ ...enabled, OSH_CONTROL_USERNAME: '' })('POST', '/commands', {});
  assert.deepEqual(absentAccount.body, { error: 'no_account' });
  assert.equal(routeConfig(enabled).reason, null);
});

test('[osh-control-006] Resolve streams by schema name and keep the map', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.endsWith('/controlstreams')) return Response.json({ items: [{ id: 'cs-fixture-wrong' }, { id: 'cs-fixture-right' }] });
    if (url.endsWith('/cs-fixture-wrong/schema')) return Response.json({ parametersSchema: { name: 'mavRTLControl', fields: [{ type: 'Boolean', name: 'rtl' }] } });
    return Response.json({ parametersSchema: { name: 'mavTakeoffControl', fields: [{ type: 'Quantity', name: 'TakeoffAltitudeAGL' }] } });
  };
  const cache = new Map();
  const root = new URL('https://fixture.invalid/api/');
  const found = await resolveCommand({ cache, root, system: 'sys-fixture-one', command: 'mavTakeoffControl', headers: {}, fetchImpl });
  assert.equal(found.id, 'cs-fixture-right');
  assert.equal((await resolveCommand({ cache, root, system: 'sys-fixture-one', command: 'mavTakeoffControl', headers: {}, fetchImpl })).id, 'cs-fixture-right');
  assert.equal(await resolveCommand({ cache, root, system: 'sys-fixture-one', command: 'mavLandingControl', headers: {}, fetchImpl }), null);
  assert.equal(calls.length, 3);
  const targets = await resolveTargets({ cache, root, system: 'sys-fixture-one', headers: {}, fetchImpl });
  assert.equal(targets.get('mavTakeoffControl').id, 'cs-fixture-right');
  assert.equal(calls.length, 3, 'resolveTargets reads the shared cache, so it makes no new call');
});

test('[osh-control-033] Refuse a malformed system id before a read on both routes', async () => {
  let reads = 0;
  const call = route(enabled, async () => { reads += 1; throw new Error('unexpected read'); });
  for (const system of ['', 'bad/id', 'bad id', 'x'.repeat(65)]) {
    assert.deepEqual((await call('GET', `/targets?system=${encodeURIComponent(system)}`)).body, { enabled: true, reason: 'bad_body', commands: {} });
    assert.deepEqual((await call('POST', '/commands', { ...commandBody, system })).body, { error: 'bad_body' });
  }
  assert.deepEqual((await call('GET', '/targets')).body, { enabled: true, reason: 'bad_body', commands: {} });
  assert.equal(reads, 0);
});

test('[osh-control-034] Give only commands with a matching control stream', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push(String(url));
    if (options.method === 'POST') return new Response(null, { status: 201 });
    if (String(url).includes('/systems?')) return Response.json({ items: [] });
    if (String(url).endsWith('/controlstreams')) return Response.json({ items: [{ id: 'cs-rtl' }, { id: 'cs-other' }, { id: 'cs-takeoff' }] });
    if (String(url).endsWith('/cs-rtl/schema')) return Response.json({ parametersSchema: { name: 'mavRTLControl', fields: [{ name: 'rtl' }] } });
    if (String(url).endsWith('/cs-takeoff/schema')) return Response.json({ parametersSchema: { name: 'mavTakeoffControl', fields: [{ name: 'TakeoffAltitudeAGL' }] } });
    return Response.json({ parametersSchema: { name: 'notInTable', fields: [] } });
  };
  const call = route(enabled, fetchImpl);
  const result = await call('GET', '/targets?system=sys-fixture-one');
  assert.equal(result.status, 200);
  assert.equal(result.body.enabled, true);
  assert.equal(result.body.reason, null);
  assert.deepEqual(Object.keys(result.body.commands).sort(), ['mavRTLControl', 'mavTakeoffControl']);
  assert.deepEqual(result.body.commands.mavRTLControl, { fields: { rtl: { type: 'boolean' } } });
  assert.equal((await call('POST', '/commands', commandBody)).body.outcome, 'sent');
  assert.equal(calls.filter((url) => url.endsWith('/controlstreams')).length, 1);
});

test('[osh-control-034] Give an empty command object when no stream matches', async () => {
  const call = route(enabled, upstream({ list: Response.json({ items: [] }) }));
  const result = await call('GET', '/targets?system=sys-fixture-one');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { enabled: true, reason: null, commands: {} });
});

test('[osh-control-035] Give upstream_failed when the control-stream read fails', async () => {
  const call = route(enabled, upstream({ list: new Response(null, { status: 503 }) }));
  const result = await call('GET', '/targets?system=sys-fixture-one');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { enabled: true, reason: 'upstream_failed', commands: {} });
  const noRoot = route(enabled, async () => new Response(null, { status: 503 }));
  assert.deepEqual((await noRoot('GET', '/targets?system=sys-fixture-one')).body, { enabled: true, reason: 'upstream_failed', commands: {} });
});

test('[osh-control-018] Enforce four commands for each system and eight for all systems within one minute', () => {
  const gate = createCommandGate();
  for (let index = 0; index < 4; index += 1) { assert.equal(gate.enter('sys-fixture-one'), null); gate.leave('sys-fixture-one'); }
  assert.equal(gate.enter('sys-fixture-one'), 'rate_limited');
  for (let index = 0; index < 4; index += 1) { assert.equal(gate.enter('sys-fixture-two'), null); gate.leave('sys-fixture-two'); }
  assert.equal(gate.enter('sys-fixture-three'), 'rate_limited');
});

test('[osh-control-019] Keep one command in flight for each system', () => {
  const gate = createCommandGate();
  assert.equal(gate.enter('sys-fixture-one'), null);
  assert.equal(gate.enter('sys-fixture-one'), 'busy');
  gate.leave('sys-fixture-one');
  assert.equal(gate.enter('sys-fixture-one'), null);
});

test('[osh-control-024] Build only the literal commands path with no query', () => {
  const root = new URL('https://fixture.invalid/api/');
  const url = oshCommandUrl(root, 'cs-fixture-one');
  assert.equal(String(url), 'https://fixture.invalid/api/controlstreams/cs-fixture-one/commands');
  assert.equal(url.search, '');
  assert.doesNotThrow(() => assertCommandUrl(url, root, 'cs-fixture-one'));
});

test('[osh-control-025] Reject each unsafe command URL component', () => {
  const root = new URL('https://fixture.invalid/api/');
  const expected = oshCommandUrl(root, 'cs-fixture-one');
  for (const value of ['https://other.invalid/api/controlstreams/cs-fixture-one/commands', 'https://fixture.invalid/other/controlstreams/cs-fixture-one/commands', 'https://fixture.invalid/api/controlstreams/cs-fixture-two/commands', `${expected}?x=1`, 'https://user@fixture.invalid/api/controlstreams/cs-fixture-one/commands', 'https://fixture.invalid/api/controlstreams/cs-fixture-one/commands#part']) assert.throws(() => assertCommandUrl(new URL(value), root, 'cs-fixture-one'));
  const withPassword = new URL(expected);
  withPassword.username = 'user'; withPassword.password = 'secret';
  assert.throws(() => assertCommandUrl(withPassword, root, 'cs-fixture-one'));
});

test('[osh-control-026] Return only the small command result fields', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (options.method === 'POST') return Response.json({ secret: 'upstream-secret' }, { status: 201 });
    if (url.endsWith('/systems?limit=1&f=application%2Fgeo%2Bjson')) return Response.json({ items: [] });
    if (url.endsWith('/controlstreams')) return Response.json({ items: [{ id: 'cs-fixture-one' }] });
    return Response.json({ parametersSchema: { name: 'mavRTLControl', fields: [{ type: 'Boolean', name: 'rtl' }] } });
  };
  const call = route(enabled, fetchImpl);
  const result = await call('POST', '/commands', { system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } });
  assert.deepEqual(Object.keys(result.body).sort(), ['outcome', 'reason', 'requestId', 'upstreamStatus']);
  assert.equal(result.body.outcome, 'sent');
  assert.equal(result.body.upstreamStatus, 201);
  assert.equal(JSON.stringify(result.body).includes('upstream-secret'), false);
  const posts = calls.filter((item) => item.options.method === 'POST');
  assert.equal(posts.length, 1);
  const [{ options: postOptions }] = posts;
  assert.equal(
    postOptions.headers.Authorization,
    `Basic ${Buffer.from(`${enabled.OSH_CONTROL_USERNAME}:${enabled.OSH_CONTROL_PASSWORD}`).toString('base64')}`,
  );
  assert.equal(postOptions.headers['Content-Type'], 'application/json');
  assert.equal(postOptions.redirect, 'manual');
  assert.deepEqual(JSON.parse(postOptions.body), { parameters: { rtl: true } });
});

test('[osh-control-027] Fail a redirect or timeout without a second POST', async () => {
  const url = new URL('https://fixture.invalid/api/controlstreams/cs-fixture-one/commands');
  let redirects = 0;
  await assert.rejects(oshPostCommand(async () => { redirects += 1; return new Response(null, { status: 302 }); }, url, { headers: {}, body: { parameters: { rtl: true } } }), /redirect/);
  assert.equal(redirects, 1);
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    let calls = 0;
    const promise = oshPostCommand((_url, options) => { calls += 1; return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason))); }, url, { headers: {}, body: { parameters: { rtl: true } } });
    mock.timers.tick(15_000);
    await assert.rejects(promise, /timeout/);
    assert.equal(calls, 1);
  } finally { mock.timers.reset(); }
});

test('[osh-control-028] Refuse a cross-origin or untrusted-host POST', async () => {
  const body = { system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } };
  for (const headers of [{ host: 'other.invalid', origin: 'http://other.invalid' }, { host: 'device.local.evil', origin: 'http://device.local.evil' }, { origin: undefined }, { origin: 'https://localhost:5173' }, { origin: 'http://other.local:5173' }]) {
    const result = await route(enabled)('POST', '/commands', body, headers);
    assert.equal(result.status, 403);
    assert.deepEqual(result.body, { error: 'cross_origin' });
  }
});

test('[osh-control-029] Refuse a POST without JSON content type', async () => {
  const body = { system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } };
  for (const type of ['text/plain', undefined, 'application/json; charset=utf-8']) {
    const result = await route(enabled)('POST', '/commands', body, { 'content-type': type });
    assert.equal(result.status, 403);
    assert.deepEqual(result.body, { error: 'cross_origin' });
  }
});

test('[osh-control-007 osh-control-009] Refuse bad command bodies before a read', async () => {
  const call = route(enabled);
  assert.deepEqual((await call('POST', '/commands')).body, { error: 'bad_body' });
  assert.deepEqual((await call('POST', '/commands', { ...commandBody, extra: true })).body, { error: 'bad_body' });
  assert.deepEqual((await call('POST', '/commands', { ...commandBody, command: 'mavShellControl' })).body, { error: 'unknown_command' });
  assert.deepEqual((await call('POST', '/commands', { ...commandBody, parameters: { rtl: 'true' } })).body, { error: 'bad_parameter' });
  assert.deepEqual((await call('POST', '/commands', { ...commandBody, parameters: { rtl: 'x'.repeat(4096) } })).body, { error: 'bad_body' });
});

test('[osh-control-014] Refuse a command when the schema lacks a table field', async () => {
  const call = route(enabled, upstream({ schema: Response.json({ parametersSchema: { name: 'mavRTLControl', fields: [{ type: 'Boolean', name: 'wrong' }] } }) }));
  assert.deepEqual((await call('POST', '/commands', commandBody)).body, { error: 'schema_mismatch' });
});

test('[osh-control-006] Refuse an absent command stream', async () => {
  const call = route(enabled, upstream({ list: Response.json({ items: [] }) }));
  assert.deepEqual((await call('POST', '/commands', commandBody)).body, { error: 'command_not_found' });
});

test('[osh-control-018] Give a rate limit response with Retry-After', async () => {
  const call = route(enabled, upstream());
  for (let index = 0; index < 4; index += 1) assert.equal((await call('POST', '/commands', commandBody)).body.outcome, 'sent');
  const result = await call('POST', '/commands', commandBody);
  assert.equal(result.status, 429);
  assert.equal(result.headers['Retry-After'], '60');
  assert.deepEqual(result.body, { error: 'rate_limited' });
});

test('[osh-control-019] Give busy during one open upstream call', async () => {
  let release;
  let started;
  const ready = new Promise((resolve) => { started = resolve; });
  const pending = new Promise((resolve) => { release = resolve; });
  const call = route(enabled, upstream({ post: async () => { started(); await pending; return new Response(null, { status: 201 }); } }));
  const first = call('POST', '/commands', commandBody);
  await ready;
  assert.deepEqual((await call('POST', '/commands', commandBody)).body, { error: 'busy' });
  release();
  assert.equal((await first).body.outcome, 'sent');
});

test('[osh-control-021] Give log_failed before an upstream command', async () => {
  let posts = 0;
  const fetchImpl = upstream({ post: () => { posts += 1; return new Response(null, { status: 201 }); } });
  const call = route(enabled, fetchImpl, async (event) => { if (event.outcome === 'accepted') throw new Error('disk failed'); });
  const result = await call('POST', '/commands', commandBody);
  assert.equal(result.status, 500);
  assert.deepEqual(Object.keys(result.body).sort(), ['outcome', 'reason', 'requestId', 'upstreamStatus']);
  assert.equal(result.body.reason, 'log_failed');
  assert.equal(posts, 0);
});

test('[osh-control-026] Give a small failed result when the upstream POST fails', async () => {
  const call = route(enabled, upstream({ post: () => new Response(null, { status: 500 }) }));
  const result = await call('POST', '/commands', commandBody);
  assert.equal(result.status, 502);
  assert.equal(result.body.outcome, 'failed');
  assert.equal(result.body.upstreamStatus, 500);
});

test('[osh-control-027] Refuse an absent API root or a failed control stream GET', async () => {
  const noRoot = route(enabled, async () => new Response(null, { status: 503 }));
  assert.deepEqual((await noRoot('POST', '/commands', commandBody)).body, { error: 'upstream_failed' });
  const badList = route(enabled, upstream({ list: new Response(null, { status: 503 }) }));
  assert.deepEqual((await badList('POST', '/commands', commandBody)).body, { error: 'upstream_failed' });
});

test('[osh-control-028] Accept local hosts when the origin equals the host', () => {
  for (const host of ['localhost:5173', '127.0.0.1:5173', '[::1]:5173', 'drone.local:5173']) assert.equal(isSameOriginCommand({ headers: { host, origin: `http://${host}`, 'content-type': 'application/json' }, socket: {} }), true);
  assert.equal(isSameOriginCommand({ headers: { host: 'localhost:5173', origin: 'https://localhost:5173', 'content-type': 'application/json' }, socket: { encrypted: true } }), true);
});

test('[osh-control-028] Refuse malformed host values', () => {
  for (const host of ['bad host', 'user@localhost', 'localhost/path']) assert.equal(isSameOriginCommand({ headers: { host, origin: `http://${host}`, 'content-type': 'application/json' }, socket: {} }), false);
});

test('[osh-control-001] Pass unknown paths to the next middleware and refuse another method', async () => {
  let middleware;
  oshControlProxy({ env: enabled, fetchImpl: async () => { throw new Error('unexpected'); }, warn: () => {}, log: async () => {} }).configureServer({ middlewares: { use(_path, handler) { middleware = handler; } } });
  let next = 0;
  await middleware({ method: 'GET', url: '/other' }, {}, () => { next += 1; });
  await middleware({ method: 'GET' }, {}, () => { next += 1; });
  assert.equal(next, 2);
  const res = { statusCode: 200, setHeader() {}, end(text) { this.body = JSON.parse(text); } };
  await middleware({ method: 'GET', url: '/commands' }, res);
  assert.equal(res.statusCode, 405);
  assert.deepEqual(res.body, { error: 'method_not_allowed' });
});

test('[osh-control-003] Refuse a blank URL and accept a distinct account', async () => {
  assert.deepEqual((await route({ ...enabled, OSH_URL: '' })('GET', '/targets')).body, { enabled: false, reason: 'no_key', commands: {} });
  const result = await route({ ...enabled, OSH_USERNAME: '' })('GET', '/targets');
  assert.equal(result.body.enabled, true);
});

test('[osh-control-006] Skip invalid streams and unreadable schemas', async () => {
  const root = new URL('https://fixture.invalid/api/');
  const cache = new Map();
  const fetchImpl = async (url) => url.endsWith('/controlstreams') ? Response.json({ features: [{ id: 'bad id' }, { id: 'cs-fixture-one' }] }) : new Response(null, { status: 503 });
  assert.equal(await resolveCommand({ cache, root, system: 'sys-fixture-one', command: 'mavRTLControl', headers: {}, fetchImpl }), null);
  assert.equal(await resolveCommand({ cache: new Map(), root, system: 'sys-fixture-two', command: 'mavRTLControl', headers: {}, fetchImpl: async () => Response.json({}) }), null);
});

test('[osh-control-024] Refuse a command URL with credentials in its root', () => {
  assert.throws(() => oshCommandUrl(new URL('https://user@fixture.invalid/api/'), 'cs-fixture-one'));
});

test('[osh-control-027] Return from a POST with no response body', async () => {
  assert.deepEqual(await oshPostCommand(async () => new Response(null, { status: 204 }), new URL('https://fixture.invalid/api/controlstreams/cs-fixture-one/commands'), { headers: {}, body: { parameters: { rtl: true } } }), { status: 204 });
});

test('[osh-control-027] Cancel a redirected response body', async () => {
  let cancelled = 0;
  await assert.rejects(oshPostCommand(async () => ({ status: 302, body: { cancel() { cancelled += 1; return Promise.reject(new Error('cancel failed')); } } }), new URL('https://fixture.invalid/api/controlstreams/cs-fixture-one/commands'), { headers: {}, body: { parameters: { rtl: true } } }), /redirect/);
  await Promise.resolve();
  assert.equal(cancelled, 1);
});

test('[osh-control-027] Stop a command response body at the 15 second limit', async () => {
  const realSetTimeout = globalThis.setTimeout;
  const realClearTimeout = globalThis.clearTimeout;
  mock.timers.enable({ apis: ['setTimeout'] });
  let guard;
  try {
    const response = new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array([123])); } }), { status: 201 });
    const promise = oshPostCommand(async () => response, new URL('https://fixture.invalid/api/controlstreams/cs-fixture-one/commands'), { headers: {}, body: { parameters: { rtl: true } } });
    await Promise.resolve();
    mock.timers.tick(15_000);
    const guardPromise = new Promise((_resolve, reject) => { guard = realSetTimeout(() => reject(new Error('no abort')), 100); });
    await assert.rejects(Promise.race([promise, guardPromise]), { name: 'TimeoutError' });
  } finally {
    realClearTimeout(guard);
    mock.timers.reset();
  }
});

test('[osh-control-027] Stop a command response body above 64 KiB', async () => {
  const promise = oshPostCommand(async () => new Response('x'.repeat(64 * 1024 + 1), { status: 201 }), new URL('https://fixture.invalid/api/controlstreams/cs-fixture-one/commands'), { headers: {}, body: { parameters: { rtl: true } } });
  await assert.rejects(promise, /too large/);
});

test('[osh-control-027] Return failed with no upstream status after a POST timeout', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    let started;
    let posts = 0;
    const ready = new Promise((resolve) => { started = resolve; });
    const call = route(enabled, upstream({ post: (_url, options) => { posts += 1; started(); return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason))); } }));
    const pending = call('POST', '/commands', commandBody);
    await ready;
    mock.timers.tick(15_000);
    const result = await pending;
    assert.equal(result.status, 502);
    assert.equal(result.body.outcome, 'failed');
    assert.equal(result.body.reason, 'timeout');
    assert.equal(result.body.upstreamStatus, null);
    assert.equal(posts, 1);
  } finally { mock.timers.reset(); }
});
