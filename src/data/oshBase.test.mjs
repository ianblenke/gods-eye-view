import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BASE_HOLD_MS, baseErrorCode, createOshBase } from '../../server/providers/osh/base.js';

function jsonResponse(status, body) {
  return new Response(body === undefined ? null : JSON.stringify(body), { status });
}

test('[osh-009] uses the configured value when it answers with a system list', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    return jsonResponse(200, { features: [] });
  };
  const base = createOshBase({ fetchImpl });
  const state = await base.resolveRoot('https://osh.example/api/');
  assert.equal(state.candidate, 'root');
  assert.equal(state.root.href, 'https://osh.example/api/');
  assert.deepEqual(state.failures, []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0], 'https://osh.example/api/systems?limit=1&f=application/geo+json');
});

test('[osh-010] tries the next candidate after a miss, in a fixed order', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    if (calls.length === 1) return jsonResponse(404);
    if (calls.length === 2) return new Response('<html></html>', { status: 200 });
    return jsonResponse(200, { items: [] });
  };
  const base = createOshBase({ fetchImpl });
  const state = await base.resolveRoot('https://osh.example');
  assert.equal(calls.length, 3);
  assert.match(calls[0], /^https:\/\/osh\.example\/systems/);
  assert.match(calls[1], /^https:\/\/osh\.example\/api\/systems/);
  assert.match(calls[2], /^https:\/\/osh\.example\/sensorhub\/api\/systems/);
  assert.equal(state.candidate, 'sensorhub-api');
  assert.deepEqual(state.failures, [
    { candidate: 'root', status: 404 },
    { candidate: 'api', status: 200, reason: 'not_a_list' },
  ]);
});

test('[osh-011] probes once per process and shares one pass between concurrent callers', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse(200, { items: [] });
  };
  const base = createOshBase({ fetchImpl });
  const [a, b] = await Promise.all([
    base.resolveRoot('https://osh.example/'),
    base.resolveRoot('https://osh.example/'),
  ]);
  assert.equal(calls, 1);
  assert.equal(a.candidate, 'root');
  assert.equal(b.candidate, 'root');
  await base.resolveRoot('https://osh.example/');
  assert.equal(calls, 1, 'a resolved root is reused with no new probe');
});

test('[osh-011] probes again after OSH_URL changes', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse(200, { items: [] });
  };
  const base = createOshBase({ fetchImpl });
  await base.resolveRoot('https://osh.example/');
  assert.equal(calls, 1);
  const state = await base.resolveRoot('https://other.example/');
  assert.equal(calls, 2);
  assert.equal(state.root.origin, 'https://other.example');
});

test('[osh-012] reports failure with candidate:null when every candidate misses, and holds before a retry', async () => {
  let calls = 0;
  let now = 1_000;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse(401);
  };
  const base = createOshBase({ fetchImpl, now: () => now });
  const state = await base.resolveRoot('https://osh.example/');
  assert.equal(state.candidate, null);
  assert.equal(state.root, null);
  assert.equal(state.failures.length, 3);
  assert.equal(baseErrorCode(state.failures), 'auth_failed');
  assert.equal(calls, 3);

  now += BASE_HOLD_MS - 1;
  await base.resolveRoot('https://osh.example/');
  assert.equal(calls, 3, 'no new probe inside the hold');

  now += 2;
  await base.resolveRoot('https://osh.example/');
  assert.equal(calls, 6, 'a new pass runs after the hold');
});

test('[osh-012] base_unresolved when no failure carries 401 or 403', () => {
  assert.equal(baseErrorCode([{ candidate: 'root', status: 404 }]), 'base_unresolved');
  assert.equal(baseErrorCode([{ candidate: 'root', status: 403 }]), 'auth_failed');
  assert.equal(baseErrorCode([]), 'base_unresolved');
});

test('[osh-010] a redirect, a timeout and an oversized body during the probe each count as a miss', async () => {
  let call = 0;
  const fetchImpl = async () => {
    call += 1;
    if (call === 1) return new Response(null, { status: 302 });
    if (call === 2) throw Object.assign(new Error('too big'), { code: 'OSH_TOO_LARGE' });
    throw new Error('connection reset');
  };
  const base = createOshBase({ fetchImpl });
  const state = await base.resolveRoot('https://osh.example/');
  assert.deepEqual(
    state.failures.map((failure) => failure.reason),
    ['redirect', 'too_large', 'network_error'],
  );
});

test('[osh-010] an AbortError and a TimeoutError during the probe both count as a timeout miss', async () => {
  let call = 0;
  const fetchImpl = async () => {
    call += 1;
    if (call === 1) throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    throw Object.assign(new Error('timed out'), { name: 'TimeoutError' });
  };
  const base = createOshBase({ fetchImpl });
  const state = await base.resolveRoot('https://osh.example/api');
  assert.deepEqual(
    state.failures.slice(0, 2).map((failure) => failure.reason),
    ['timeout', 'timeout'],
  );
});

test('[osh-009] adds a slash at the end of a configured value that has none, and exposes getState()', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    return jsonResponse(200, { items: [] });
  };
  const base = createOshBase({ fetchImpl });
  assert.deepEqual(base.getState(), {
    configured: null,
    root: null,
    candidate: null,
    failures: [],
    probedAt: 0,
  });
  await base.resolveRoot('https://osh.example/sensorhub');
  assert.match(calls[0], /^https:\/\/osh\.example\/sensorhub\/systems/);
  assert.equal(base.getState().candidate, 'root');
});
