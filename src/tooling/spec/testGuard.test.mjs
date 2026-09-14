import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import {
  GUARD_PRELOAD,
  createGuard,
  fileOfScriptUrl,
  installGuard,
  isChildProcessRunner,
  lockGuardEnv,
  withGuardEnv,
  wrapAssertModules,
  wrapChildProcess,
} from '../../../scripts/spec/lib/test-guard.mjs';

const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const ROOT = mkdtempSync(path.join(tmpdir(), 'gev-guard-'));
const OUT = path.join(ROOT, '.gev-cache/spec');
const FILES = {
  'src/real.mjs': 'export const real = 1;\n',
  'src/faked.mjs': 'export function faked() {\n  return 1;\n}\n',
  'src/hooked.mjs': 'export const hooked = 1;\n',
  'src/swapped.mjs': 'export const swapped = 1;\n',
};
mkdirSync(OUT, { recursive: true });
for (const [file, text] of Object.entries(FILES)) {
  mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
  writeFileSync(path.join(ROOT, file), text);
}
const INVENTORY = JSON.stringify(Object.fromEntries(Object.entries(FILES).map(([file, text]) => [file, sha256(text)])));
writeFileSync(path.join(OUT, 'inventory.json'), INVENTORY);
const ENV = { GEV_SPEC_OUT: OUT, GEV_SPEC_ROOT: ROOT, GEV_SPEC_INVENTORY: sha256(INVENTORY) };
const OWN_COVERAGE = path.join(ROOT, 'coverage');
const guard = installGuard({ env: ENV });

// Exit listeners run in order, so the guard writes its results before this cleanup.
process.on('exit', () => rmSync(ROOT, { recursive: true, force: true }));

const violationFiles = () => guard.results().violations.map((item) => item.file);

test('[coverage-gate-019] does not stop for code that a test imports from a code file', async () => {
  const { real } = await import(pathToFileURL(path.join(ROOT, 'src/real.mjs')).href);
  await nextTurn();
  assert.equal(real, 1);
  assert.equal(violationFiles().includes('src/real.mjs'), false);
  assert.equal(guard.results().checked.includes('src/real.mjs'), true);
});

test('[coverage-gate-018] records code that runs under the name of a code file with other source', async () => {
  const url = pathToFileURL(path.join(ROOT, 'src/faked.mjs')).href;
  new Function(`return 1;\n//# sourceURL=${url}`)();
  await nextTurn();
  assert.deepEqual(guard.results().violations.find((item) => item.file === 'src/faked.mjs'), {
    code: 'COVERAGE-FAKE',
    file: 'src/faked.mjs',
    message: 'A test ran code under the name src/faked.mjs, but the code is not the file content',
  });
});

test('[coverage-gate-018] compares the source with the content hash at the start of the run', async () => {
  const file = path.join(ROOT, 'src/swapped.mjs');
  writeFileSync(file, 'export const swapped = 2;\n');
  const { swapped } = await import(pathToFileURL(file).href);
  writeFileSync(file, FILES['src/swapped.mjs']);
  await nextTurn();
  assert.equal(swapped, 2);
  assert.equal(violationFiles().includes('src/swapped.mjs'), true);
  assert.equal(guard.results().checked.includes('src/swapped.mjs'), false);
});

test('[coverage-gate-020] records a module hook that loads other source for a code file', async () => {
  const url = pathToFileURL(path.join(ROOT, 'src/hooked.mjs')).href;
  registerHooks({
    load(target, context, next) {
      if (target === url) return { format: 'module', source: 'export const hooked = 2;\n', shortCircuit: true };
      return next(target, context);
    },
  });
  const { hooked } = await import(url);
  await nextTurn();
  assert.equal(hooked, 2);
  assert.equal(violationFiles().includes('src/hooked.mjs'), true);
});

test('[coverage-gate-018] checks only the files in the inventory inside the root and does not stop for a byte order mark', () => {
  const local = createGuard({
    root: '/repo',
    inventory: new Map([['src/a.js', sha256('﻿export {};\n')], ['src/b.js', sha256('export {};\n')]]),
    getContext: () => undefined,
  });
  local.checkScript('node:internal/modules/run_main', 'x');
  local.checkScript('file:///repo/src/other.js', 'x');
  local.checkScript('file:///elsewhere/src/a.js', 'x');
  local.checkScript('/repo/src/a.js', 'export {};\n');
  local.checkScript('file:///repo/src/b.js', 'export {};\n');
  assert.deepEqual(local.results(), { violations: [], checked: ['src/a.js', 'src/b.js'], assertions: [] });
  local.onSource('/repo/src/b.js')(new Error('no source'), undefined);
  assert.deepEqual(local.results().violations.map((item) => item.file), ['src/b.js']);
  local.onSource('/repo/src/a.js')(null, { scriptSource: 'export {};\n' });
  assert.deepEqual(local.results().checked, ['src/a.js', 'src/b.js']);
});

test('[coverage-gate-018] reads the relative file of a script URL', () => {
  assert.equal(fileOfScriptUrl('file:///repo/src/a.js', '/repo'), 'src/a.js');
  assert.equal(fileOfScriptUrl('/repo/src/a.js', '/repo'), 'src/a.js');
  assert.equal(fileOfScriptUrl('file://host%/bad', '/repo'), null);
  assert.equal(fileOfScriptUrl('evalmachine.<anonymous>', '/repo'), null);
  assert.equal(fileOfScriptUrl('/other/a.js', '/repo'), null);
});

test('[spec-trace-027] counts the assertions of each test', () => {
  assert.equal(1, 1);
  assert.ok(true);
  const file = path.relative(ROOT, fileURLToPath(import.meta.url)).split(path.sep).join('/');
  const entry = guard.results().assertions.find((item) => item.fullName === '[spec-trace-027] counts the assertions of each test');
  assert.deepEqual([entry.file, entry.count], [file, 2]);
});

test('[spec-trace-027] wraps the assert methods and does not count calls outside a test', () => {
  let calls = 0;
  let context;
  const counter = createGuard({ root: '/repo', inventory: new Map(), getContext: () => context });
  const mod = { equal: (a, b) => a === b, Thrower: class {}, strict: {}, value: 3 };
  wrapAssertModules([mod], () => {
    calls += 1;
    counter.countAssertion();
  });
  assert.equal(mod.equal(1, 1), true);
  context = { filePath: '/repo/src/a.test.mjs', fullName: 'parent > child' };
  mod.equal(2, 2);
  context = { fullName: 'no file' };
  mod.equal(3, 3);
  assert.equal(calls, 3);
  assert.deepEqual(counter.results().assertions, [{ file: 'src/a.test.mjs', fullName: 'parent > child', count: 1 }]);
  assert.equal(typeof mod.Thrower, 'function');
  assert.equal(mod.value, 3);
});

const GUARD_ENV = { GEV_SPEC_OUT: '/out', GEV_SPEC_ROOT: '/repo', GEV_SPEC_INVENTORY: 'gate' };

function fakeChildProcess(seen) {
  const execFile = (...args) => seen.push(args);
  execFile[promisify.custom] = (...args) => Promise.resolve({ stdout: 'out', stderr: '', args });
  execFile.marker = 'kept';
  const record = (...args) => seen.push(args);
  return { spawnSync: record, spawn: record, execFile, execFileSync: record, exec: record, execSync: record, fork: record };
}

test('[coverage-gate-025] gives the guard to a child process that collects coverage', () => {
  const where = { processEnv: {} };
  assert.equal(withGuardEnv(undefined, GUARD_ENV, where), undefined);
  const noEnv = { cwd: '/x' };
  assert.equal(withGuardEnv(noEnv, GUARD_ENV, where), noEnv);
  const noCoverage = { env: { PATH: '/bin' } };
  assert.equal(withGuardEnv(noCoverage, GUARD_ENV, where), noCoverage);
  assert.deepEqual(withGuardEnv({ env: { NODE_V8_COVERAGE: '/cov' } }, GUARD_ENV, where).env, {
    NODE_V8_COVERAGE: '/cov',
    ...GUARD_ENV,
    NODE_OPTIONS: GUARD_PRELOAD,
  });
  const text = withGuardEnv({ env: { NODE_V8_COVERAGE: '/cov', NODE_OPTIONS: `--title="x ${GUARD_PRELOAD}"` } }, GUARD_ENV, where);
  assert.equal(text.env.NODE_OPTIONS, `${GUARD_PRELOAD} --title="x ${GUARD_PRELOAD}"`);
  const inherited = withGuardEnv({ cwd: '/x' }, GUARD_ENV, { processEnv: { NODE_V8_COVERAGE: '/cov', PATH: '/bin' } });
  assert.deepEqual(inherited, { cwd: '/x', env: { ...GUARD_ENV, NODE_V8_COVERAGE: '/cov', PATH: '/bin', NODE_OPTIONS: GUARD_PRELOAD } });
});

test('[coverage-gate-025] wraps each child_process function and keeps its properties and its promisify result', () => {
  const seen = [];
  const fake = fakeChildProcess(seen);
  wrapChildProcess(fake, GUARD_ENV, { processEnv: {} });
  fake.spawnSync('node', ['-v'], { env: { NODE_V8_COVERAGE: '/cov' } });
  fake.spawnSync('node', ['-v']);
  assert.equal(seen[0][2].env.NODE_OPTIONS, GUARD_PRELOAD);
  assert.deepEqual(seen[1], ['node', ['-v']]);
  assert.equal(fake.execFile.marker, 'kept');
  return promisify(fake.execFile)('node', ['-v'], { env: { NODE_V8_COVERAGE: '/cov' } }).then((result) => {
    assert.equal(result.stdout, 'out');
    assert.equal(result.args[2].env.NODE_OPTIONS, GUARD_PRELOAD);
  });
});

test('[coverage-gate-025] keeps the result of util.promisify for the real execFile', async () => {
  const { execFile } = await import('node:child_process');
  const { stdout, stderr } = await promisify(execFile)(process.execPath, ['-e', 'process.stdout.write("ok")'], { env: { ...process.env } });
  assert.deepEqual([stdout, stderr], ['ok', '']);
});

test('[coverage-gate-031] gives the gate values to a child process that writes coverage to the coverage folder of the test process', () => {
  const coverageDir = path.join(ROOT, 'gate-coverage');
  mkdirSync(coverageDir, { recursive: true });
  const where = { coverageDir, processEnv: {} };
  const own = { NODE_V8_COVERAGE: coverageDir, GEV_SPEC_OUT: '', GEV_SPEC_ROOT: '/elsewhere', GEV_SPEC_INVENTORY: 'forged', NODE_OPTIONS: '--trace-warnings' };
  assert.deepEqual(withGuardEnv({ env: own }, GUARD_ENV, where).env, { ...own, ...GUARD_ENV, NODE_OPTIONS: `${GUARD_PRELOAD} --trace-warnings` });
  const relative = withGuardEnv({ cwd: ROOT, env: { NODE_V8_COVERAGE: 'gate-coverage/../gate-coverage', GEV_SPEC_OUT: '' } }, GUARD_ENV, where);
  assert.equal(relative.env.GEV_SPEC_OUT, '/out');

  const seen = [];
  const fake = fakeChildProcess(seen);
  const processEnv = { NODE_V8_COVERAGE: coverageDir, GEV_SPEC_OUT: '', NODE_OPTIONS: '' };
  wrapChildProcess(fake, GUARD_ENV, { coverageDir, processEnv });
  const callback = () => {};
  fake.spawnSync('node');
  fake.exec('node -v', callback);
  fake.execFile('node', ['-v'], undefined, callback);
  fake.fork('child.mjs', { cwd: '/x' });
  const expected = { ...processEnv, ...GUARD_ENV, NODE_OPTIONS: GUARD_PRELOAD };
  assert.deepEqual(seen[0], ['node', { env: expected }]);
  assert.deepEqual(seen[1], ['node -v', { env: expected }, callback]);
  assert.deepEqual(seen[2], ['node', ['-v'], { env: expected }, callback]);
  assert.deepEqual(seen[3], ['child.mjs', { cwd: '/x', env: expected }]);
});

test('[coverage-gate-032] keeps the values from the test in a child process with its own coverage folder', () => {
  const where = { coverageDir: path.join(ROOT, 'gate-coverage'), processEnv: {} };
  const own = { NODE_V8_COVERAGE: OWN_COVERAGE, GEV_SPEC_OUT: '/own', GEV_SPEC_ROOT: '/own-root', GEV_SPEC_INVENTORY: 'own' };
  assert.deepEqual(withGuardEnv({ env: own }, GUARD_ENV, where).env, { ...own, NODE_OPTIONS: GUARD_PRELOAD });
  assert.deepEqual(withGuardEnv({ env: { NODE_V8_COVERAGE: OWN_COVERAGE } }, GUARD_ENV, { processEnv: {} }).env, { ...GUARD_ENV, NODE_V8_COVERAGE: OWN_COVERAGE, NODE_OPTIONS: GUARD_PRELOAD });
});

test('[coverage-gate-033] stops a process with an inventory.json file that is not the file of the gate', () => {
  const out = path.join(ROOT, 'changed-out');
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'inventory.json'), '{}');
  assert.throws(() => installGuard({ env: { ...ENV, GEV_SPEC_OUT: out } }), /The test guard stopped: the hash of .*changed-out\/inventory\.json is not the hash in GEV_SPEC_INVENTORY/);
  const { GEV_SPEC_INVENTORY, ...withoutHash } = ENV;
  assert.equal(typeof GEV_SPEC_INVENTORY, 'string');
  assert.throws(() => installGuard({ env: { ...withoutHash, GEV_SPEC_OUT: out } }), /is not the hash in GEV_SPEC_INVENTORY/);
  const result = spawnSync(process.execPath, ['-e', 'process.exit(0)'], {
    env: { ...process.env, ...ENV, GEV_SPEC_OUT: out, NODE_V8_COVERAGE: OWN_COVERAGE, NODE_OPTIONS: GUARD_PRELOAD },
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /The test guard stopped/);
  assert.equal(existsSync(path.join(out, `guard-${result.pid}.jsonl`)), false);
});

test('[coverage-gate-028] writes the checked files, the errors and the assertion counts of a child process at the end of the process', () => {
  const script = `import(${JSON.stringify(pathToFileURL(path.join(ROOT, 'src/real.mjs')).href)}).then(() => import('node:assert/strict'));`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    env: { ...process.env, ...ENV, NODE_V8_COVERAGE: OWN_COVERAGE, NODE_OPTIONS: '' },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  const file = path.join(OUT, `guard-${result.pid}.jsonl`);
  assert.equal(existsSync(file), true);
  const [line] = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(line, { violations: [], checked: ['src/real.mjs'], assertions: [] });
});

test('[coverage-gate-036] loads the guard before the other preloads of a child process', async () => {
  const strip = path.join(ROOT, 'strip.cjs');
  writeFileSync(strip, 'delete process.env.GEV_SPEC_OUT;\n');
  const { spawnSync: guardedSpawnSync } = await import('node:child_process');
  const script = `import(${JSON.stringify(pathToFileURL(path.join(ROOT, 'src/real.mjs')).href)});`;
  const env = { ...process.env, ...ENV, NODE_V8_COVERAGE: OWN_COVERAGE };
  const inOptions = guardedSpawnSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...env, NODE_OPTIONS: `--require=${JSON.stringify(strip)}` }, encoding: 'utf8' });
  const onCommandLine = guardedSpawnSync(process.execPath, ['--require', strip, '--input-type=module', '-e', script], { env: { ...env, NODE_OPTIONS: '' }, encoding: 'utf8' });
  for (const result of [inOptions, onCommandLine]) {
    assert.equal(result.status, 0, result.stderr);
    const [line] = readFileSync(path.join(OUT, `guard-${result.pid}.jsonl`), 'utf8').trim().split('\n').map(JSON.parse);
    assert.deepEqual(line.checked, ['src/real.mjs']);
  }
});

test('[coverage-gate-037] writes an error for a process that collects coverage without an inspector', () => {
  const out = path.join(ROOT, 'no-inspector-out');
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'inventory.json'), INVENTORY);
  const noInspector = () => {
    throw new Error('This Environment was initialized without a V8::Inspector');
  };
  const isolationNone = { env: { ...ENV, GEV_SPEC_OUT: out, NODE_V8_COVERAGE: OWN_COVERAGE, NODE_OPTIONS: '--test-isolation=none' }, createSession: noInspector, execArgv: ['--test'], childProcess: fakeChildProcess([]) };
  assert.equal(installGuard(isolationNone), null);
  const [line] = readFileSync(path.join(out, `guard-${process.pid}.jsonl`), 'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(line, {
    violations: [{ code: 'COVERAGE-NO-INSPECTOR', file: '', message: `Process ${process.pid} collects coverage, but the test guard cannot start an inspector session: This Environment was initialized without a V8::Inspector` }],
    checked: [],
    assertions: [],
  });
});

test('[coverage-gate-038] does not check the sources in a test runner or a process without coverage that has no inspector', () => {
  const out = path.join(ROOT, 'runner-out');
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'inventory.json'), INVENTORY);
  const noInspector = () => {
    throw new Error('no inspector');
  };
  const { NODE_V8_COVERAGE, ...withoutCoverage } = { ...ENV, GEV_SPEC_OUT: out, NODE_V8_COVERAGE: 'unused' };
  assert.equal(NODE_V8_COVERAGE, 'unused');
  const plainSeen = [];
  const plainChildProcess = fakeChildProcess(plainSeen);
  assert.equal(installGuard({ env: withoutCoverage, createSession: noInspector, execArgv: [], childProcess: plainChildProcess }), null);
  plainChildProcess.spawn(process.execPath, ['-v'], { env: { NODE_V8_COVERAGE: OWN_COVERAGE } });
  assert.deepEqual(plainSeen[0][2].env, { GEV_SPEC_OUT: out, GEV_SPEC_ROOT: ROOT, GEV_SPEC_INVENTORY: ENV.GEV_SPEC_INVENTORY, NODE_V8_COVERAGE: OWN_COVERAGE, NODE_OPTIONS: GUARD_PRELOAD });
  const runnerSeen = [];
  const runnerChildProcess = fakeChildProcess(runnerSeen);
  const runner = { env: { ...withoutCoverage, NODE_V8_COVERAGE: OWN_COVERAGE }, createSession: noInspector, execArgv: ['--test', '--experimental-test-coverage'], childProcess: runnerChildProcess, processObject: { env: {} } };
  assert.equal(installGuard(runner), null);
  runnerChildProcess.spawn(process.execPath, ['--test'], { env: { NODE_V8_COVERAGE: OWN_COVERAGE, GEV_SPEC_OUT: '' } });
  assert.equal(runnerSeen[0][2].env.GEV_SPEC_OUT, out);
  assert.equal(runnerSeen[0][2].env.NODE_OPTIONS, GUARD_PRELOAD);
  assert.equal(existsSync(path.join(out, `guard-${process.pid}.jsonl`)), false);
  assert.equal(isChildProcessRunner(['--test', '--test-isolation=none']), false);
  assert.equal(isChildProcessRunner(['--expose-gc']), false);
  assert.equal(isChildProcessRunner(['--test']), true);
});

test('[coverage-gate-039] does not check the sources in a worker thread and gives the gate values to its child processes', async () => {
  const out = path.join(ROOT, 'worker-out');
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'inventory.json'), INVENTORY);
  const seen = [];
  const workerEnv = { ...ENV, GEV_SPEC_OUT: out, NODE_V8_COVERAGE: OWN_COVERAGE };
  assert.equal(installGuard({ env: workerEnv, mainThread: false, childProcess: fakeChildProcess(seen), createSession: () => assert.fail('no session in a worker') }), null);
  assert.equal(existsSync(path.join(out, `guard-${process.pid}.jsonl`)), false);
  assert.equal(seen.length, 0);
  const { Worker } = await import('node:worker_threads');
  const guardUrl = new URL('../../../scripts/spec/lib/test-guard.mjs', import.meta.url).href;
  const code = `import(${JSON.stringify(guardUrl)}).then((m) => require('node:worker_threads').parentPort.postMessage(m.installGuard({ env: ${JSON.stringify({ ...ENV, GEV_SPEC_OUT: out })} })))`;
  const worker = new Worker(code, { eval: true });
  const result = await new Promise((resolve) => worker.once('message', resolve));
  await worker.terminate();
  assert.equal(result, null);
  assert.equal(existsSync(path.join(out, `guard-${process.pid}.jsonl`)), false);
});

test('[coverage-gate-039 coverage-gate-040] gives the gate values to a child process of a worker thread or of a test runner without an inspector', () => {
  const out = path.join(ROOT, 'nested-out');
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'inventory.json'), INVENTORY);
  const gateCoverage = path.join(ROOT, 'nested-coverage');
  mkdirSync(gateCoverage, { recursive: true });
  const gateEnv = { ...ENV, GEV_SPEC_OUT: out, NODE_V8_COVERAGE: gateCoverage };
  const expected = { GEV_SPEC_OUT: out, GEV_SPEC_ROOT: ROOT, GEV_SPEC_INVENTORY: ENV.GEV_SPEC_INVENTORY };
  const noInspector = () => {
    throw new Error('no inspector');
  };
  for (const options of [{ mainThread: false }, { createSession: noInspector, execArgv: ['--test'], processObject: { env: { ...gateEnv } } }]) {
    const seen = [];
    const childProcess = fakeChildProcess(seen);
    assert.equal(installGuard({ env: gateEnv, childProcess, ...options }), null);
    const { GEV_SPEC_OUT, ...stripped } = gateEnv;
    assert.equal(GEV_SPEC_OUT, out);
    childProcess.spawn(process.execPath, ['--test', 'fake.test.mjs'], { env: { ...stripped, NODE_OPTIONS: '--require=strip.cjs' } });
    assert.deepEqual(seen[0][2].env, { ...stripped, ...expected, NODE_OPTIONS: `${GUARD_PRELOAD} --require=strip.cjs` });
  }
  assert.equal(existsSync(path.join(out, `guard-${process.pid}.jsonl`)), false);
});

test('[coverage-gate-027] does nothing in a process without GEV_SPEC_OUT and returns the same guard for the same folder', () => {
  assert.equal(installGuard({ env: {} }), null);
  assert.equal(installGuard({ env: ENV }), guard);
});

test('[coverage-gate-040] keeps the gate values in the environment of a test runner', () => {
  const runnerProcess = { env: { ...ENV, PATH: '/bin' } };
  lockGuardEnv(runnerProcess);
  delete runnerProcess.env.GEV_SPEC_OUT;
  runnerProcess.env.GEV_SPEC_ROOT = '/elsewhere';
  Object.defineProperty(runnerProcess.env, 'GEV_SPEC_INVENTORY', { value: 'forged' });
  runnerProcess.env = {};
  runnerProcess.env.OTHER = 'kept';
  delete runnerProcess.env.PATH;
  Object.defineProperty(runnerProcess.env, 'DEFINED', { value: 'yes', enumerable: true, configurable: true, writable: true });
  assert.throws(() => Object.defineProperty(runnerProcess, 'env', { value: {} }), /Cannot redefine property: env/);
  assert.deepEqual({ ...runnerProcess.env }, { GEV_SPEC_OUT: OUT, GEV_SPEC_ROOT: ROOT, GEV_SPEC_INVENTORY: ENV.GEV_SPEC_INVENTORY, OTHER: 'kept', DEFINED: 'yes' });
  assert.equal(runnerProcess.env.GEV_SPEC_OUT, OUT);
});

