import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
    // Isolate the gate's own guard identity before spawning, without stopping coverage
    // of RUNNER itself. Left in place, a real gate run would carry GEV_SPEC_OUT through
    // this process into the two synthetic child processes above, and their own guard
    // would then write a leak record for the second one's timer into the real gate's
    // own outDir — the timer that calls process.exit() from inside its own callback,
    // which still reads as an active resource at that exact synchronous point.
    // Confirmed by reproducing it against the real gate image.
    //
    // This process's own guard already wraps child_process globally. withGuardEnv()
    // (scripts/spec/lib/test-guard.mjs) always adds NODE_OPTIONS's guard preload when
    // NODE_V8_COVERAGE is present, but only re-injects its own closed-over GEV_SPEC_OUT
    // when the child's NODE_V8_COVERAGE points at the real gate's own coverage folder
    // (its `gateRun` check). A separate coverage folder for this spawn makes that check
    // false, so this call's own explicit env values win instead — real V8 coverage
    // still collects for RUNNER, in an isolated folder, and the injected guard preload
    // finds an empty GEV_SPEC_OUT and installs nothing.
    const coverageDir = path.join(directory, 'coverage');
    mkdirSync(coverageDir, { recursive: true });
    const env = { ...process.env, NODE_V8_COVERAGE: coverageDir, GEV_SPEC_OUT: '', GEV_SPEC_ROOT: '', GEV_SPEC_INVENTORY: '' };
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
