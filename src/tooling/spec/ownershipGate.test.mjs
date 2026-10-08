import test from 'node:test';
import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, runGates } from '../../../scripts/spec/gates.mjs';

const PROJECT_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const DATE = new Date('2026-09-13T12:00:00Z');
const NODE = process.versions.node;

const MATH_TEST = (name = 'adds two numbers', extra = '') =>
  ["import test from 'node:test';", "import assert from 'node:assert/strict';", "import { add } from './math.js';", `test('${name}', () => {`, '  assert.equal(add(1, 2), 3);', '});', extra, ''].join('\n');

const SPEC = ['## ADDED Requirements', '', '### Requirement: Add numbers', 'The demo MUST add two numbers.', 'Origin: spec-first', '', '#### Scenario: Add two numbers `demo-001`', '- **WHEN** you add 1 and 2', '- **THEN** the result is 3', ''].join('\n');

const CHANGE = {
  'openspec/changes/add-demo/proposal.md': '## Why\n\nThe demo adds numbers so that the gates have a change to check.\n\n## What Changes\n\n- Add a function that adds two numbers.\n',
  'openspec/changes/add-demo/tasks.md': '## 1. Demo\n\n- [ ] 1.1 Write the test for `demo-001`.\n',
  'openspec/changes/add-demo/specs/demo/spec.md': SPEC,
};

function git(root, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function write(root, files) {
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  }
}

function commitAll(root, message) {
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', message);
}

/** A project with a base commit on main and a work branch. */
function withFixture(body, { base = {} } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-gates-'));
  try {
    git(root, 'init', '-q', '-b', 'main');
    write(root, {
      '.gitignore': '.gev-cache/\n',
      'openspec/ownership.json': '{"version":1,"owned":[]}\n',
      '.node-version': `${NODE}\n`,
      'src/math.js': 'export function add(a, b) {\n  return a + b;\n}\n',
      'src/math.test.mjs': MATH_TEST(),
      'tools/other.test.mjs': "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('runs outside src', () => {\n  assert.ok(true);\n});\n",
      'openspec/ste/words.json': readFileSync(path.join(PROJECT_ROOT, 'openspec/ste/words.json'), 'utf8'),
      ...base,
    });
    for (const agent of ['spec-adversary', 'ste-adversary']) {
      mkdirSync(path.join(root, '.claude/agents'), { recursive: true });
      copyFileSync(path.join(PROJECT_ROOT, `.claude/agents/${agent}.md`), path.join(root, `.claude/agents/${agent}.md`));
    }
    mkdirSync(path.join(root, '.claude/commands/opsx'), { recursive: true });
    copyFileSync(path.join(PROJECT_ROOT, '.claude/commands/opsx/review.md'), path.join(root, '.claude/commands/opsx/review.md'));
    commitAll(root, 'base');
    git(root, 'checkout', '-q', '-b', 'work');
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function run(root, argv, options = {}) {
  const lines = [];
  const status = runGates({ root, argv: [...argv, '--base', 'main'], now: DATE, log: (line) => lines.push(line), allocationFiles: [], ...options });
  return { status, output: lines.join('\n') };
}

function passes(root, argv, options) {
  const result = run(root, argv, options);
  if (argv[0] === 'ratchet' && result.status === 2) {
    const errors = result.output.split('\n').filter(line => line.startsWith('ERROR '));
    assert.ok(errors.length > 0);
    assert.equal(errors.every(line => /^ERROR REVIEW-/.test(line)), true, result.output);
  } else {
    assert.equal(result.status, 0, result.output);
  }
  return result;
}

function oneMeasurement(root, { loaded = true, assertions = 1 } = {}) {
  let calls = 0;
  const spawn = (_command, args) => {
    calls += 1;
    const runs = JSON.parse(readFileSync(args[1], 'utf8'));
    writeFileSync(args[2], JSON.stringify(runs.map(() => ({ status: 0, error: null }))));
    const records = ['src/math.test.mjs', 'tools/other.test.mjs'].map((file, index) => {
      const tagged = index === 0 && readFileSync(path.join(root, file), 'utf8').includes('[demo-001]');
      const name = index === 0 ? (tagged ? '[demo-001] adds two numbers' : 'adds two numbers') : 'runs outside src';
      return { file, name, fullName: name, title: name.replace('[demo-001] ', ''), kind: 'test', status: 'pass', tags: tagged ? ['demo-001'] : [], tagError: null, line: 4, column: 1, leaf: true };
    });
    writeFileSync(path.join(path.dirname(args[1]), 'tests-main.jsonl.sync'), records.map(record => JSON.stringify(record) + '\n').join(''));
    if (loaded) {
      writeFileSync(path.join(runs[0].env.NODE_V8_COVERAGE, 'coverage-1-1-0.json'), '{"result":[]}');
      const text = readFileSync(path.join(root, 'src/math.js'), 'utf8');
      const count = text.split('\n').length - 1;
      const gap = text.includes('return 8') ? [3, 4] : [];
      writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), `SF:${root}/src/math.js\nLF:${count}\nLH:${count - gap.length}\nBRF:1\nBRH:${gap.length ? 0 : 1}\nFNF:1\nFNH:1\n` + Array.from({ length: count }, (_, index) => `DA:${index + 1},${gap.includes(index + 1) ? 0 : 1}\n`).join('') + 'end_of_record\n');
    }
    writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ checked: loaded ? ['src/math.js'] : [], violations: [], assertions: records.map(record => ({ file: record.file, fullName: record.fullName, count: assertions })), leaks: [] }) + '\n');
    return { status: 0 };
  };
  const openSpec = (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : args[0] === 'show' ? JSON.stringify({ deltas: [{ spec: 'demo', operation: 'ADDED', requirement: { scenarios: [{}] } }], requirements: [{ scenarios: [{}] }] }) : '{"items":[]}' });
  return { spawn, openSpec, calls: () => calls };
}

test('[ownership-001] stops the gate for an absent manifest', () => withFixture(root => {
  rmSync(path.join(root, 'openspec/ownership.json'));
  const result = run(root, ['check'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 1);
  assert.match(result.output, /ERROR OWNERSHIP-MANIFEST openspec\/ownership.json/);
}));

test('[ownership-011] report reads the ledger without tests or a base', () => withFixture(root => {
  write(root, { 'openspec/trace/gaps.json': JSON.stringify({ version: 4, coverage: {}, untracedTests: {} }) });
  const result = run(root, ['report', '--base', 'absent'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 0, result.output);
  assert.equal(result.output, 'Owned gaps: 0 code files, 0 lines, 0 test files, 0 tests.\nUpstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.');
  rmSync(path.join(root, 'openspec/trace/gaps.json'));
  assert.equal(run(root, ['report']).output, 'ERROR GATES-NO-LEDGER openspec/trace/gaps.json The report needs the ledger file.\nGates failed with 1 errors.');
  assert.equal(parseArgs(['report']).command, 'report');
}));

test('[ownership-003 ownership-007] check prints classes and rejects an upstream line gap', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, CHANGE);
  write(root, { 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  const result = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(result.output, /Class: upstream src\/math.js/);
  assert.match(result.output, /Ownership: 0 owned, 5 upstream/);
  assert.match(result.output, /ERROR COVERAGE-DIFF src\/math.js Changed lines need coverage: 3, 4\./);
  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR COVERAGE-DIFF')), ['ERROR COVERAGE-DIFF src/math.js Changed lines need coverage: 3, 4.']);
  assert.equal(result.status, 1);
}));

test('[ownership-003 ownership-004] ratchet rejects an owned gap before a ledger write', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, CHANGE);
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["src/"]}', 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  const ledger = readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8');
  const result = run(root, ['ratchet', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(result.output, /Class: owned src\/math.js/);
  assert.match(result.output, /ERROR COVERAGE-OWNED src\/math.js/);
  assert.equal(result.status, 1);
  assert.equal(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'), ledger);
}));

test('[ownership-007] ci checks changed upstream lines', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  const archive = 'openspec/changes/archive/2026-10-08-add-demo';
  write(root, {
    [`${archive}/proposal.md`]: CHANGE['openspec/changes/add-demo/proposal.md'],
    [`${archive}/tasks.md`]: CHANGE['openspec/changes/add-demo/tasks.md'],
    [`${archive}/specs/demo/spec.md`]: SPEC,
    'openspec/specs/demo/spec.md': SPEC.replace('## ADDED Requirements', '## Requirements'),
    'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n',
  });
  const result = run(root, ['ci'], oneMeasurement(root));
  assert.match(result.output, /ERROR COVERAGE-DIFF src\/math.js Changed lines need coverage: 3, 4\./);
  assert.equal(result.status, 1);
}));

test('[ownership-004] adopt records a gap before the owned file check', () => withFixture(root => {
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["src/math.js"]}' });
  passes(root, ['init'], oneMeasurement(root));
  git(root, 'checkout', '-qb', 'upstream', 'main');
  write(root, { 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  commitAll(root, 'upstream');
  const from = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', 'work');
  git(root, 'merge', '--no-ff', '-qm', 'sync', from);
  write(root, { 'openspec/changes/upstream-sync/proposal.md': '## Why\n\nImport upstream code.\n' });
  const fake = oneMeasurement(root);
  const result = run(root, ['adopt', '--change', 'upstream-sync', '--from', from], {
    spawn: fake.spawn,
    openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : '{"items":[],"deltas":[],"requirements":[]}' }),
  });
  assert.equal(result.status, 0, result.output);
  assert.equal(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/math.js'].lines, 2);
}));

test('[ownership-007] stops when Git cannot read a code diff', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, { 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n' });
  const original = childProcess.spawnSync;
  childProcess.spawnSync = (command, args, options) => command === 'git' && args.includes('-U0') ? { status: 128, stderr: 'Diff fault.' } : original(command, args, options);
  syncBuiltinESMExports();
  try {
    const result = run(root, ['check'], oneMeasurement(root));
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR COVERAGE-DIFF Git cannot read the diff of src\/math.js: Diff fault\./);
  } finally {
    childProcess.spawnSync = original;
    syncBuiltinESMExports();
  }
}));

test('[ownership-009 ownership-013] document mode uses the manifest and snapshot line data', () => withFixture(root => {
  const fake = oneMeasurement(root);
  passes(root, ['init'], fake);
  write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'), 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n', 'scripts/qa-upstream.mjs': 'export {};\n' });
  commitAll(root, 'inputs');
  const ratchet = passes(root, ['ratchet', '--change', 'add-demo'], fake);
  assert.match(ratchet.output, /QA: scripts\/qa-upstream.mjs uses the synthetic header unmapped: upstream\./);
  assert.doesNotMatch(ratchet.output, /ERROR QA-HEADER|ERROR COVERAGE-DIFF|ERROR COVERAGE-OWNED/);
  assert.deepEqual(JSON.parse(readFileSync(path.join(root, '.gev-cache/spec/measurement.json'), 'utf8')).lineCoverage, { 'src/math.js': [1, 2, 3] });
  write(root, { 'openspec/changes/add-demo/design.md': 'The demo adds numbers.\n' });
  const docs = run(root, ['check', '--no-measure', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: () => assert.fail('No test run') });
  assert.match(docs.output, /NO TEST RUN: the mode trusts the snapshot of commit/);
  assert.match(docs.output, /QA: scripts\/qa-upstream.mjs uses the synthetic header unmapped: upstream\./);
  assert.doesNotMatch(docs.output, /ERROR QA-HEADER|ERROR COVERAGE-DIFF|ERROR COVERAGE-OWNED/);
}));

test('[ownership-013] init accepts an absent line report', () => withFixture(root => {
  const result = passes(root, ['init'], oneMeasurement(root, { loaded: false }));
  assert.match(result.output, /Coverage: 1 files, 0 complete, 1 not loaded, 0 untrue\./);
  assert.equal(result.status, 0);
}));

test('[ownership-011] report uses the manifest for ledger paths', () => withFixture(root => {
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["src/"]}', 'openspec/trace/gaps.json': JSON.stringify({ version: 4, coverage: { 'src/math.js': { loaded: true, sha: 'hash', untrue: false, lines: 2, branches: 0, functions: 0, totals: { lines: 3, branches: 1, functions: 1 }, origin: 'pre-spec', since: '2026-01-01' } }, untracedTests: {} }) });
  const result = run(root, ['report'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 0, result.output);
  assert.equal(result.output, 'Owned gaps: 1 code files, 2 lines, 0 test files, 0 tests.\nowned code: src/math.js\nUpstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.');
}));
test('[ownership-010] check keeps QA header errors', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["scripts/qa-demo.mjs"]}', 'scripts/qa-demo.mjs': 'export {};\n' });
  git(root, 'add', 'scripts/qa-demo.mjs');
  const result = run(root, ['check'], oneMeasurement(root));
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /ERROR QA-HEADER scripts\/qa-demo.mjs/);
}));
