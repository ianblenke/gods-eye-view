import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runParallel } from '../../../scripts/spec/lib/run-parallel.mjs';

const RUNNER = fileURLToPath(new URL('../../../scripts/spec/lib/run-parallel.mjs', import.meta.url));

test('[coverage-gate-022] starts the runs at the same time and waits until each run is complete', async () => {
  const started = [];
  const children = [];
  const spawnProcess = (command, args, options) => {
    const child = new EventEmitter();
    started.push({ command, args, options });
    children.push(child);
    return child;
  };
  const pending = runParallel(
    [
      { args: ['--test', 'a.test.mjs'], cwd: '/repo' },
      { args: ['--expose-gc', '--test', 'b.test.mjs'], cwd: '/repo' },
      { args: ['--test', 'c.test.mjs'], cwd: '/repo' },
    ],
    { spawnProcess, env: { A: '1' } },
  );
  assert.equal(started.length, 3);
  assert.deepEqual(started[1].args, ['--expose-gc', '--test', 'b.test.mjs']);
  assert.deepEqual(started[0].options, { cwd: '/repo', env: { A: '1' }, stdio: ['ignore', 'ignore', 'inherit'] });
  children[2].emit('close', 1);
  children[0].emit('close', 0);
  children[1].emit('error', new Error('no node'));
  assert.deepEqual(await pending, [
    { status: 0, error: null },
    { status: null, error: 'no node' },
    { status: 1, error: null },
  ]);
});

test('[coverage-gate-022] runs real processes from a runs file and writes the results file', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'gev-parallel-'));
  try {
    const runsFile = path.join(directory, 'runs.json');
    const resultsFile = path.join(directory, 'results.json');
    writeFileSync(
      runsFile,
      JSON.stringify([
        { args: ['-e', 'setTimeout(() => process.exit(0), 200)'], cwd: directory },
        { args: ['-e', 'process.exit(4)'], cwd: directory },
      ]),
    );
    const started = Date.now();
    const result = spawnSync(process.execPath, [RUNNER, runsFile, resultsFile], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.ok(Date.now() - started < 5000);
    assert.deepEqual(JSON.parse(readFileSync(resultsFile, 'utf8')), [
      { status: 0, error: null },
      { status: 4, error: null },
    ]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
