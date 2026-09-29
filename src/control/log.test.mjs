import test from 'node:test';
import assert from 'node:assert/strict';
import { createCommandLog, runLoggedCommand } from '../../server/providers/osh-control/log.js';
import { mkdtemp, readFile, writeFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

test('[osh-control-020] Record safe refused, accepted, sent, and failed lines', async () => {
  const lines = [];
  const log = createCommandLog({ append: async (line) => lines.push(line) });
  const event = { requestId: 'fixture-request', client: '127.0.0.1', system: 'sys-fixture-one', controlStream: 'cs-fixture-one', command: 'mavRTLControl', parameters: { rtl: true }, body: 'raw-secret', Authorization: 'secret-header', url: 'https://secret.invalid/' };
  await log({ ...event, outcome: 'refused', reason: 'bad_body', system: 'secret invalid', command: 'secret command', parameters: { text: 'secret' } });
  await runLoggedCommand({ log, event, send: async () => ({ status: 201 }) });
  await runLoggedCommand({ log, event: { ...event, requestId: 'fixture-failed' }, send: async () => { throw new Error('upstream secret'); } });
  const records = lines.map((line) => JSON.parse(line));
  assert.deepEqual(records.map((record) => record.outcome), ['refused', 'accepted', 'sent', 'accepted', 'failed']);
  assert.equal(records[1].requestId, records[2].requestId);
  assert.equal(records[3].requestId, records[4].requestId);
  assert.equal(records[0].system, null);
  assert.equal(records[0].command, null);
  assert.equal(records[0].parameters, null);
  assert.deepEqual(records[1].parameters, { rtl: true });
  assert.equal(lines.join('').includes('secret'), false);
  assert.deepEqual(Object.keys(records[1]).sort(), ['client', 'command', 'controlStream', 'durationMs', 'outcome', 'parameters', 'reason', 'requestId', 'system', 'time', 'upstreamStatus'].sort());
});

test('[osh-control-021] Stop before POST when the accepted log fails', async () => {
  let sent = 0;
  const log = createCommandLog({ append: async () => { throw new Error('disk failed'); } });
  const result = await runLoggedCommand({ log, event: { requestId: 'fixture-request', system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } }, send: async () => { sent += 1; return { status: 201 }; } });
  assert.deepEqual(result, { outcome: 'refused', reason: 'log_failed', upstreamStatus: null, requestId: 'fixture-request' });
  assert.equal(sent, 0);
});

test('[osh-control-020] Append and rotate one generation of the command log', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'osh-control-log-'));
  try {
    const log = createCommandLog({ sourceRoot: root });
    await log({ outcome: 'refused', reason: 'bad_body' });
    const file = path.join(root, '.gev-logs', 'osh-commands.jsonl');
    assert.equal((await readFile(file, 'utf8')).split('\n').length, 2);
    await writeFile(file, 'x'.repeat(4 * 1024 * 1024));
    await log({ outcome: 'refused', reason: 'bad_body' });
    assert.equal((await stat(`${file}.1`)).size, 4 * 1024 * 1024);
    assert.equal(JSON.parse(await readFile(file, 'utf8')).outcome, 'refused');
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('[osh-control-020] Recover the append queue after a write failure', async () => {
  let calls = 0;
  const log = createCommandLog({ append: async () => { calls += 1; if (calls === 1) throw new Error('disk failed'); } });
  await assert.rejects(log({ outcome: 'refused' }));
  await assert.doesNotReject(log({ outcome: 'refused' }));
  assert.equal(calls, 2);
});

test('[osh-control-027] Record redirect, timeout, and network failure reasons', async () => {
  const log = createCommandLog({ append: async () => {} });
  for (const [error, reason, status] of [
    [Object.assign(new Error('redirect'), { code: 'OSH_REDIRECT', status: 302 }), 'redirect', 302],
    [new DOMException('timeout', 'TimeoutError'), 'timeout', null],
    [new Error('network'), 'upstream_failed', null],
  ]) {
    const result = await runLoggedCommand({ log, event: { requestId: 'fixture-request' }, send: async () => { throw error; } });
    assert.equal(result.outcome, 'failed');
    assert.equal(result.reason, reason);
    assert.equal(result.upstreamStatus, status);
  }
});
