import test from 'node:test';
import assert from 'node:assert/strict';
import { createOshControlClient } from './client.js';

test('[osh-control-016] Send one browser POST to the fixed same-origin path', async () => {
  const calls = [];
  const client = createOshControlClient({ fetchImpl: async (url, options) => { calls.push({ url, options }); return Response.json({ outcome: 'sent', reason: null, upstreamStatus: 201, requestId: 'fixture' }); } });
  const result = await client.send({ system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } });
  assert.deepEqual(result, { outcome: 'sent', reason: null, upstreamStatus: 201, requestId: 'fixture' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/control/osh/commands');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].options.body), { system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } });
});

test('[osh-control-016] Read the static targets from the same origin', async () => {
  const paths = [];
  const client = createOshControlClient({ fetchImpl: async (url) => { paths.push(url); return Response.json({ enabled: false, reason: 'control_off', targets: [] }); } });
  assert.deepEqual(await client.targets(), { enabled: false, reason: 'control_off', targets: [] });
  assert.deepEqual(paths, ['/api/control/osh/targets']);
});
