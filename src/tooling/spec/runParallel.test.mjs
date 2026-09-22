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
    // Clear the gate's own guard env before spawning. Left in place, a real gate run
    // would carry it through this process into the two synthetic child processes above,
    // and their own guard would then write a leak record for the second one's timer
    // into the real gate's own outDir — the timer that calls process.exit() from
    // inside its own callback, which still reads as an active resource at that exact
    // synchronous point. Confirmed by reproducing it against the real gate image.
    // NODE_V8_COVERAGE must go too, not just GEV_SPEC_OUT: this process's own guard
    // already wraps child_process globally, and withGuardEnv() re-injects its own
    // GEV_SPEC_OUT into any spawned child's env whenever that child's env still carries
    // NODE_V8_COVERAGE — regardless of what this call's own `env` argument deletes.
    // Verified by restoring NODE_V8_COVERAGE alone in a real make gates run: the same
    // blank-file GATES-TEST-LEAK this fix exists to prevent fired again immediately.
    const env = { ...process.env };
    delete env.NODE_V8_COVERAGE;
    delete env.GEV_SPEC_OUT;
    delete env.GEV_SPEC_ROOT;
    delete env.GEV_SPEC_INVENTORY;
    const result = spawnSync(process.execPath, [RUNNER, runsFile, resultsFile], { env, encoding: 'utf8' });
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
