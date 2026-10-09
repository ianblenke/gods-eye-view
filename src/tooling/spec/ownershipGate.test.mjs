import test from 'node:test';
import { createHash } from 'node:crypto';
import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, runGates } from '../../../scripts/spec/gates.mjs';

for (const key of Object.keys(process.env)) if (key.startsWith('GIT_')) delete process.env[key];
Object.assign(process.env, {
  GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', LC_ALL: 'C',
  GIT_CONFIG_COUNT: '4', GIT_CONFIG_KEY_0: 'user.name', GIT_CONFIG_VALUE_0: 'Test',
  GIT_CONFIG_KEY_1: 'user.email', GIT_CONFIG_VALUE_1: 'test@example.com',
  GIT_CONFIG_KEY_2: 'safe.directory', GIT_CONFIG_VALUE_2: '*',
  GIT_CONFIG_KEY_3: 'commit.gpgsign', GIT_CONFIG_VALUE_3: 'false',
});

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
      const gap = /return [89]/.test(text) ? [3, 4] : [];
      writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), `SF:${root}/src/math.js\nLF:${count}\nLH:${count - gap.length}\nBRF:1\nBRH:${gap.length ? 0 : 1}\nFNF:1\nFNH:1\n` + Array.from({ length: count }, (_, index) => `DA:${index + 1},${gap.includes(index + 1) ? 0 : 1}\n`).join('') + 'end_of_record\n');
    }
    writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ checked: loaded ? ['src/math.js'] : [], violations: [], assertions: records.map(record => ({ file: record.file, fullName: record.fullName, count: assertions })), leaks: [] }) + '\n');
    return { status: 0 };
  };
  const openSpec = (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : args[0] === 'show' ? JSON.stringify({ deltas: [{ spec: 'demo', operation: 'ADDED', requirement: { scenarios: [{}] } }], requirements: [{ scenarios: [{}] }] }) : '{"items":[]}' });
  return { spawn, openSpec, calls: () => calls };
}

test('[ownership-001] gate stops for an absent manifest', () => withFixture(root => {
  rmSync(path.join(root, 'openspec/ownership.json'));
  const result = run(root, ['check'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 1);
  assert.match(result.output, /ERROR OWNERSHIP-MANIFEST openspec\/ownership.json/);
}));

test('[ownership-011] gate reads the ledger without tests or a base', () => withFixture(root => {
  write(root, { 'openspec/trace/gaps.json': JSON.stringify({ version: 4, coverage: {}, untracedTests: {} }) });
  const result = run(root, ['report', '--base', 'absent'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 0, result.output);
  assert.equal(result.output, 'Owned gaps: 0 code files, 0 lines, 0 test files, 0 tests.\nUpstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.');
  rmSync(path.join(root, 'openspec/trace/gaps.json'));
  assert.equal(run(root, ['report']).output, 'ERROR GATES-NO-LEDGER openspec/trace/gaps.json The report needs the ledger file.\nGates failed with 1 errors.');
  assert.equal(parseArgs(['report']).command, 'report');
}));

test('[ownership-003 ownership-007] gate prints classes and rejects an upstream line gap', () => withFixture(root => {
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

test('[ownership-003 ownership-004] gate rejects an owned gap before the ratchet command writes the ledger', () => withFixture(root => {
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

test('[ownership-007] gate rejects uncovered changed upstream lines in CI', () => withFixture(root => {
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

test('[ownership-026] gate records a gap with the adopt command and prints no owned gap lines', () => withFixture(root => {
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
  assert.doesNotMatch(result.output, /Owned gaps:/);
}));

test('[ownership-037] gate stops when Git cannot read a code diff', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  const ledger = readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8');
  write(root, { 'openspec/trace/gaps.json': '{' });
  commitAll(root, 'bad base ledger');
  git(root, 'branch', '-f', 'main', 'HEAD');
  write(root, { 'openspec/trace/gaps.json': ledger });
  write(root, { 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n' });
  const original = childProcess.spawnSync;
  childProcess.spawnSync = (command, args, options) => command === 'git' && args.includes('-U0') ? { status: 128, stderr: 'Diff fault.' } : original(command, args, options);
  syncBuiltinESMExports();
  try {
    const result = run(root, ['check'], oneMeasurement(root));
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR COVERAGE-DIFF Git cannot read the diff of src\/math.js: Diff fault\./);
    assert.match(result.output, /Owned gaps: 0 code files/);
  } finally {
    childProcess.spawnSync = original;
    syncBuiltinESMExports();
  }
}));

test('[ownership-009 ownership-013] gate uses the manifest and snapshot line data', () => withFixture(root => {
  write(root, { 'scripts/qa-upstream.mjs': 'export {};\n' });
  commitAll(root, 'base QA script');
  git(root, 'branch', '-f', 'main', 'HEAD');
  const fake = oneMeasurement(root);
  passes(root, ['init'], fake);
  write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'), 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n', 'scripts/qa-upstream.mjs': 'export {};\n' });
  commitAll(root, 'inputs');
  const ratchet = passes(root, ['ratchet', '--change', 'add-demo'], fake);
  assert.match(ratchet.output, /QA: scripts\/qa-upstream.mjs uses the synthetic header with the covers item unmapped: upstream\./);
  assert.doesNotMatch(ratchet.output, /ERROR QA-HEADER|ERROR COVERAGE-DIFF|ERROR COVERAGE-OWNED/);
  assert.deepEqual(JSON.parse(readFileSync(path.join(root, '.gev-cache/spec/measurement.json'), 'utf8')).lineCoverage, { 'src/math.js': [1, 2, 3] });
  write(root, { 'openspec/changes/add-demo/design.md': 'The demo adds numbers.\n' });
  const docs = run(root, ['check', '--no-measure', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: () => assert.fail('No test run') });
  assert.match(docs.output, /NO TEST RUN: the mode trusts the snapshot of commit/);
  assert.match(docs.output, /QA: scripts\/qa-upstream.mjs uses the synthetic header with the covers item unmapped: upstream\./);
  assert.doesNotMatch(docs.output, /ERROR QA-HEADER|ERROR COVERAGE-DIFF|ERROR COVERAGE-OWNED/);
}));

test('[ownership-013] gate accepts a run with no line data', () => withFixture(root => {
  const result = passes(root, ['init'], oneMeasurement(root, { loaded: false }));
  assert.match(result.output, /Coverage: 1 files, 0 complete, 1 not loaded, 0 untrue\./);
  assert.equal(result.status, 0);
}));

test('[ownership-011] gate uses the manifest for ledger paths', () => withFixture(root => {
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["src/"]}', 'openspec/trace/gaps.json': JSON.stringify({ version: 4, coverage: { 'src/math.js': { loaded: true, sha: 'hash', untrue: false, lines: 2, branches: 0, functions: 0, totals: { lines: 3, branches: 1, functions: 1 }, origin: 'pre-spec', since: '2026-01-01' } }, untracedTests: {} }) });
  const result = run(root, ['report'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 0, result.output);
  assert.equal(result.output, 'Owned gaps: 1 code files, 2 lines, 0 test files, 0 tests.\nowned code: src/math.js\nUpstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.');
}));
test('[ownership-010] gate still prints QA-HEADER errors', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["scripts/qa-demo.mjs"]}', 'scripts/qa-demo.mjs': 'export {};\n' });
  git(root, 'add', 'scripts/qa-demo.mjs');
  const result = run(root, ['check'], oneMeasurement(root));
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /ERROR QA-HEADER scripts\/qa-demo.mjs/);
}));

test('[ownership-020 ownership-022] gate accepts merged lines and rejects an author line', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  git(root, 'checkout', '-qb', 'source', 'main');
  write(root, { 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  commitAll(root, 'upstream');
  const from = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', 'work');
  git(root, 'merge', '--no-ff', '-qm', 'sync', from);
  const historyFile = path.join(root, 'openspec/trace/history.jsonl');
  const history = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : '';
  write(root, { ...CHANGE, 'openspec/trace/history.jsonl': history + JSON.stringify({ kind: 'adopt', change: 'add-demo', file: 'src/math.js', from, lines: 2, branches: 1, functions: 0, untraced: 0 }) + '\n' });
  const imported = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(imported.output, /COVERAGE-DIFF: 3 changed lines, 3 brought by the merged upstream commit, 0 need coverage\./);
  assert.doesNotMatch(imported.output, /ERROR COVERAGE-DIFF|ERROR LEDGER-ADOPT-FROM/);
  write(root, { 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8 + 0;\n  }\n  return a + b;\n}\n' });
  const edited = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(edited.output, /COVERAGE-DIFF: 3 changed lines, 2 brought by the merged upstream commit, 1 need coverage\./);
  assert.deepEqual(edited.output.split('\n').filter(line => line.startsWith('ERROR COVERAGE-DIFF')), ['ERROR COVERAGE-DIFF src/math.js Changed lines need coverage: 3.']);
}));

for (const [id, edit, mode] of [['026', false], ['027', true], ['026', false, true]]) {
  test(`[ownership-${id}] gate ${edit ? 'rejects a recorded gap in an edited owned file' : 'accepts a recorded gap in an unchanged owned file'}${mode ? ' with a new file mode' : ''}`, () => withFixture(root => {
    const source = 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n';
    write(root, { 'src/math.js': source, 'openspec/ownership.json': '{"version":1,"owned":["src/math.js"]}' });
    passes(root, ['init'], oneMeasurement(root));
    commitAll(root, 'old gap');
    git(root, 'branch', '-f', 'main', 'HEAD');
    write(root, CHANGE);
    if (edit) write(root, { 'src/math.js': source.replace('return 8', 'return 9') });
    if (mode) {
      chmodSync(path.join(root, 'src/math.js'), 0o755);
      assert.equal(git(root, 'diff', '--numstat', 'main', '--', 'src/math.js'), '0\t0\tsrc/math.js');
      assert.match(git(root, 'diff', '--summary', 'main', '--', 'src/math.js'), /mode change 100644 => 100755/);
    }
    const result = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
    if (edit) assert.match(result.output, /ERROR COVERAGE-OWNED src\/math.js/);
    else {
      assert.doesNotMatch(result.output, /ERROR COVERAGE-OWNED/);
      assert.match(result.output, /Owned gaps: 1 code files/);
      assert.match(result.output, /owned code: src\/math.js/);
      const ratchet = run(root, ['ratchet', '--change', 'add-demo'], oneMeasurement(root));
      assert.doesNotMatch(ratchet.output, /ERROR COVERAGE-OWNED/);
      assert.match(ratchet.output, /Owned gaps: 1 code files/);
      assert.match(ratchet.output, /owned code: src\/math.js/);
    }
  }));
}
test('[ownership-028] gate rejects a new owned gap without a ledger entry', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  git(root, 'rm', 'src/math.js');
  commitAll(root, 'base without code');
  git(root, 'branch', '-f', 'main', 'HEAD');
  write(root, CHANGE);
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["src/math.js"]}', 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  git(root, 'add', 'src/math.js');
  const result = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(result.output, /ERROR COVERAGE-OWNED src\/math.js/);
}));

test('[ownership-031 ownership-024] gate checks the adopt source commit before a bad base ledger', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  const ledger = readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8');
  write(root, { 'openspec/trace/gaps.json': '{' });
  commitAll(root, 'bad base ledger');
  git(root, 'branch', '-f', 'main', 'HEAD');
  write(root, CHANGE);
  write(root, { 'openspec/trace/gaps.json': ledger, 'openspec/trace/history.jsonl': JSON.stringify({ kind: 'adopt', change: 'add-demo', from: 'HEAD' }) + '\n' });
  const result = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.equal(result.status, 1);
  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ['ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Use an adopt record with a string file, a full lowercase from hash and a source that a merge after the base brought.']);
}));
test('[ownership-038] gate stops for bad history before the owned gap lines', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, CHANGE);
  write(root, { 'openspec/trace/history.jsonl': '{\n' });
  const lines = [];
  assert.equal(runGates({ root, argv: ['check', '--base', 'main', '--change', 'add-demo'], now: DATE, log: line => lines.push(line), allocationFiles: [], ...oneMeasurement(root) }), 1);
  assert.match(lines.join('\n'), /ERROR LEDGER-ADOPT-FROM/);
  assert.doesNotMatch(lines.join('\n'), /Owned gaps:/);
}));

test('[ownership-029] gate stops for an invalid base manifest before the test run', () => withFixture(root => {
  write(root, { 'openspec/ownership.json': '{}' });
  commitAll(root, 'bad manifest');
  git(root, 'branch', '-f', 'main', 'HEAD');
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":[]}' });
  const result = run(root, ['check'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 1);
  assert.match(result.output, /ERROR OWNERSHIP-MANIFEST openspec\/ownership.json/);
}));
test('[ownership-029 ownership-027] gate rejects a gap after its base owned path is removed', () => withFixture(root => {
  const source = 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n';
  write(root, { 'src/math.js': source, 'openspec/ownership.json': '{"version":1,"owned":["src/"]}' });
  passes(root, ['init'], oneMeasurement(root));
  commitAll(root, 'old owned gap');
  git(root, 'branch', '-f', 'main', 'HEAD');
  write(root, { ...CHANGE, 'src/math.js': source.replace('return 8', 'return 9'), 'openspec/ownership.json': '{"version":1,"owned":[]}' });
  const result = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.equal(result.status, 1);
  assert.match(result.output, /Class: owned src\/math.js/);
  assert.match(result.output, /ERROR COVERAGE-OWNED src\/math.js/);
}));

test('[ownership-039] gate stops for a work source in the adopt command', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, { 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n' });
  commitAll(root, 'work source');
  write(root, CHANGE);
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', 'HEAD'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 1);
  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ['ERROR GATES-ADOPT The commit HEAD is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.']);
  assert.doesNotMatch(result.output, /Trace:/);
}));

test('[ownership-040] gate uses the CI change for a file that a valid adopt record names', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  commitAll(root, 'base ledger');
  git(root, 'branch', '-f', 'main', 'HEAD');
  git(root, 'checkout', '-qb', 'source');
  write(root, { 'scripts/qa-merge.mjs': 'export {};\n' });
  commitAll(root, 'upstream QA');
  const from = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', 'work');
  git(root, 'merge', '--no-ff', '-qm', 'sync', from);
  const archived = Object.fromEntries(Object.entries(CHANGE).map(([file, text]) => [file.replace('openspec/changes/add-demo/', 'openspec/changes/archive/2026-09-13-add-demo/'), text]));
  write(root, { ...archived, 'openspec/trace/history.jsonl': JSON.stringify({ kind: 'adopt', change: 'add-demo', file: 'scripts/qa-merge.mjs', from, lines: 1, branches: 0, functions: 0, untraced: 0 }) + '\n' });
  const result = run(root, ['ci'], oneMeasurement(root));
  assert.match(result.output, /CI: check the change add-demo\./);
  assert.match(result.output, /QA: scripts\/qa-merge.mjs uses the synthetic header with the covers item unmapped: upstream\./);
  assert.doesNotMatch(result.output, /ERROR QA-HEADER|ERROR LEDGER-ADOPT-FROM/);
}));

test('[ownership-038] gate stops for bad JSON without a change before the owned gap lines', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, { 'openspec/trace/history.jsonl': '{\n' });
  const result = run(root, ['check'], oneMeasurement(root));
  assert.equal(result.status, 1);
  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ["ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Expected property name or '}' in JSON at position 1 (line 1 column 2)"]);
  assert.doesNotMatch(result.output, /Owned gaps:/);
}));


test('[ownership-042] gate skips a base adopt record before the test run', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, { 'openspec/trace/history.jsonl': JSON.stringify({ kind: 'adopt', change: 'add-demo', from: 'HEAD' }) + '\n' });
  commitAll(root, 'base history');
  git(root, 'branch', '-f', 'main', 'HEAD');
  write(root, CHANGE);
  const fake = oneMeasurement(root);
  const result = run(root, ['check', '--change', 'add-demo'], fake);
  assert.equal(fake.calls(), 1);
  assert.doesNotMatch(result.output, /ERROR LEDGER-ADOPT-FROM/);
  assert.match(result.output, /Trace:/);
}));


test('[ownership-044] gate uses the synthetic header with a snapshot and a valid adopt record', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  commitAll(root, 'base ledger');
  git(root, 'branch', '-f', 'main', 'HEAD');
  git(root, 'checkout', '-qb', 'source');
  write(root, { 'scripts/qa-merge.mjs': 'export {};\n' });
  commitAll(root, 'upstream QA');
  const from = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', 'work');
  git(root, 'merge', '--no-ff', '-qm', 'sync', from);
  write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'), 'openspec/trace/history.jsonl': JSON.stringify({ kind: 'adopt', change: 'add-demo', file: 'scripts/qa-merge.mjs', from, lines: 0, branches: 0, functions: 0, untraced: 0 }) + '\n' });
  commitAll(root, 'inputs');
  const fake = oneMeasurement(root);
  passes(root, ['ratchet', '--change', 'add-demo'], fake);
  const result = run(root, ['check', '--no-measure', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: () => assert.fail('No test run') });
  assert.match(result.output, /QA: scripts\/qa-merge.mjs uses the synthetic header with the covers item unmapped: upstream\./);
  assert.doesNotMatch(result.output, /ERROR QA-HEADER/);
  assert.match(result.output, /Trace: 1 scenarios, 1 verified, 0 open\./);
}));

test('[ownership-045] gate names the measurement phase', () => withFixture(root => {
  let elapsed = 0;
  const fake = oneMeasurement(root);
  const result = run(root, ['check'], { ...fake, spawn: (...args) => {
    elapsed += 2000;
    return fake.spawn(...args);
  }, clock: () => new Date(DATE.getTime() + elapsed) });
  assert.match(result.output, /^Phase measure: 2 s$/m);
}));


test('[ownership-046] gate stops for an absent adopt source commit', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, CHANGE);
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', 'absent'], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 1);
  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ['ERROR GATES-ADOPT Git cannot find the commit absent']);
}));

test('[ownership-047] gate stops for a valid adopt source without a ledger', () => withFixture(root => {
  git(root, 'checkout', '-qb', 'source');
  write(root, { 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n' });
  commitAll(root, 'upstream');
  const from = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', 'work');
  git(root, 'merge', '--no-ff', '-qm', 'sync', from);
  write(root, CHANGE);
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', from], { spawn: () => assert.fail('No test run') });
  assert.equal(result.status, 1);
  assert.deepEqual(result.output.split('\n').filter(line => line.startsWith('ERROR ')), ['ERROR GATES-ADOPT openspec/trace/gaps.json is not there. Run: node scripts/spec/gates.mjs init']);
}));

test('[ownership-048] gate passes the measurement environment and allocation list', () => withFixture(root => {
  const fake = oneMeasurement(root);
  let calls = 0;
  run(root, ['check'], { ...fake, env: { MEASUREMENT_TOKEN: 'token' }, allocationFiles: ['tools/other.test.mjs'], spawn: (command, args, options) => {
    calls += 1;
    assert.equal(options.env.MEASUREMENT_TOKEN, 'token');
    const runs = JSON.parse(readFileSync(args[1], 'utf8'));
    assert.equal(runs.length, 2);
    assert.equal(runs[1].args.at(-1), 'tools/other.test.mjs');
    assert.equal(runs[1].args.includes('--expose-gc'), true);
    return fake.spawn(command, args, options);
  } });
  assert.equal(calls, 1);
}));


test('[ownership-049] gate stops for an untraced change scenario in both measurement modes', () => withFixture(root => {
  passes(root, ['init'], oneMeasurement(root));
  write(root, CHANGE);
  const measured = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(measured.output, /ERROR TRACE-UNVERIFIED .*Scenario demo-001/);
  write(root, { 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
  commitAll(root, 'inputs');
  const fake = oneMeasurement(root);
  passes(root, ['ratchet', '--change', 'add-demo'], fake);
  const snapshotFile = path.join(root, '.gev-cache/spec/measurement.json');
  const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));
  snapshot.assertions = [];
  const text = JSON.stringify(snapshot);
  writeFileSync(snapshotFile, text);
  const historyFile = path.join(root, 'openspec/trace/history.jsonl');
  const history = readFileSync(historyFile, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
  history.at(-1).measurement = createHash('sha256').update(text).digest('hex');
  writeFileSync(historyFile, history.map(item => JSON.stringify(item)).join('\n') + '\n');
  const trusted = run(root, ['check', '--no-measure', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: () => assert.fail('No test run') });
  assert.match(trusted.output, /NO TEST RUN: the mode trusts/);
  assert.match(trusted.output, /ERROR TRACE-UNVERIFIED .*Scenario demo-001/);
}));

test('[gap-ledger-111] stops an invalid baseline before the test run', () => withFixture(root => {
  write(root, CHANGE);
  let calls = 0;
  const fake = oneMeasurement(root);
  const result = run(root, ['rebaseline', '--change', 'add-demo'], { ...fake, spawn: (...args) => {
    calls += 1;
    return fake.spawn(...args);
  } });
  assert.equal(result.status, 1);
  assert.match(result.output, /ERROR GATES-REBASELINE/);
  assert.equal(calls, 0);
}));

test('[ownership-053] gate omits the Class, Ownership and Owned gaps lines from CI and init', () => withFixture(root => {
  write(root, { 'openspec/ownership.json': '{"version":1,"owned":["src/math.js"]}', 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  commitAll(root, 'owned base gap');
  git(root, 'branch', '-f', 'main', 'HEAD');
  passes(root, ['init'], oneMeasurement(root));
  assert.equal(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/math.js'].lines, 2);
  commitAll(root, 'base ledger');
  git(root, 'branch', '-f', 'main', 'HEAD');
  for (const [command, status] of [['ci', 0], ['init', 1]]) {
    const result = run(root, [command], oneMeasurement(root));
    assert.equal(result.status, status, result.output);
    assert.doesNotMatch(result.output, /^(Class:|Ownership:|Owned gaps:)/m);
  }
}));

function mergeQa(root, files = { 'scripts/qa-merge.mjs': 'export {};\n' }) {
  passes(root, ['init'], oneMeasurement(root));
  commitAll(root, 'base ledger');
  git(root, 'branch', '-f', 'main', 'HEAD');
  git(root, 'checkout', '-qb', 'source');
  write(root, files);
  commitAll(root, 'upstream QA');
  const from = git(root, 'rev-parse', 'HEAD');
  git(root, 'checkout', '-q', 'work');
  git(root, 'merge', '--no-ff', '-qm', 'sync', from);
  write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
  return from;
}

test('[ownership-031 ownership-041] gate stops for revision names in CI merge HEAD history', () => withFixture(root => {
  const from = mergeQa(root, { 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n' });
  assert.equal(git(root, 'rev-parse', 'HEAD^1'), git(root, 'rev-parse', 'main'));
  assert.equal(git(root, 'rev-parse', 'HEAD^2'), from);
  git(root, 'update-ref', 'refs/remotes/origin/source', from);
  for (const source of ['HEAD^2', 'source', from.slice(0, 12), 'origin/source', from.toUpperCase(), `${from} `, `${from}\n`]) {
    write(root, { 'openspec/trace/history.jsonl': JSON.stringify({ kind: 'adopt', change: 'add-demo', file: 'src/math.js', from: source, lines: 0, branches: 0, functions: 0, untraced: 0, untrue: false }) + '\n' });
    const fake = oneMeasurement(root);
    const result = run(root, ['check', '--change', 'add-demo'], fake);
    assert.equal(result.status, 1, source);
    assert.match(result.output, /ERROR LEDGER-ADOPT-FROM/);
    assert.doesNotMatch(result.output, /COVERAGE-DIFF:.*brought/);
    assert.equal(fake.calls(), 0);
  }
}));

test('[ownership-054] gate writes the QA adopt record with a full hash from HEAD^2', () => withFixture(root => {
  const from = mergeQa(root);
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', 'HEAD^2'], oneMeasurement(root));
  assert.equal(result.status, 0, result.output);
  const records = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse).filter(item => item.kind === 'adopt');
  assert.equal(records.length, 1);
  assert.deepEqual(records[0], { date: '2026-09-13', change: 'add-demo', commit: git(root, 'rev-parse', 'HEAD'), kind: 'adopt', file: 'scripts/qa-merge.mjs', from, lines: 0, branches: 0, functions: 0, untraced: 0, untrue: false });
  const next = run(root, ['check', '--change', 'add-demo'], oneMeasurement(root));
  assert.match(next.output, /QA: scripts\/qa-merge.mjs uses the synthetic header/);
  assert.doesNotMatch(next.output, /ERROR QA-HEADER|ERROR LEDGER-ADOPT-FROM/);
}));

test('[ownership-054] gate writes the QA adopt record beside a coverage gap record', () => withFixture(root => {
  const from = mergeQa(root, { 'scripts/qa-merge.mjs': 'export {};\n', 'src/math.js': 'export function add(a, b) {\n  if (a < 0) {\n    return 8;\n  }\n  return a + b;\n}\n' });
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', 'source'], oneMeasurement(root));
  assert.equal(result.status, 0, result.output);
  const records = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse).filter(item => item.kind === 'adopt');
  assert.deepEqual(records.map(item => [item.file, item.from, item.lines]), [['src/math.js', from, 2], ['scripts/qa-merge.mjs', from, 0]]);
}));

test('[ownership-054 ownership-035] gate stops the adopt command for QA files outside the exception', () => {
  const tag = '/**\n * @purpose Check a file.\n * @covers unmapped: upstream\n * @run node scripts/qa-merge.mjs\n * @needs None.\n */\n';
  for (const mode of ['owned', 'base-tag', 'current-tag', 'not-merged', 'other-error']) withFixture(root => {
    if (mode === 'base-tag') { write(root, { 'scripts/qa-merge.mjs': tag }); commitAll(root, 'base tag'); }
    if (mode === 'owned') { write(root, { 'openspec/ownership.json': '{"version":1,"owned":["scripts/"]}' }); commitAll(root, 'owned'); }
    const from = mergeQa(root, mode === 'not-merged' ? { 'src/math.js': 'export function add(a, b) {\n  return a + b + 0;\n}\n' } : { 'scripts/qa-merge.mjs': mode === 'current-tag' ? '/**\n * @purpose Bad.\n */\n' : 'export {};\n' });
    if (mode === 'not-merged') { write(root, { 'scripts/qa-merge.mjs': 'export {};\n' }); git(root, 'add', 'scripts/qa-merge.mjs'); }
    const historyFile = path.join(root, 'openspec/trace/history.jsonl');
    const history = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : '';
    const result = run(root, ['adopt', '--change', 'add-demo', '--from', from], oneMeasurement(root, mode === 'other-error' ? { assertions: 0 } : {}));
    assert.equal(result.status, 1, mode + result.output);
    assert.match(result.output, mode === 'other-error' ? /ERROR TRACE-NO-ASSERTION/ : /ERROR QA-HEADER/);
    assert.equal(existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : '', history);
  });
});

test('[ownership-054] gate writes a QA adopt record for a base script without a QA tag', () => withFixture(root => {
  write(root, { 'scripts/qa-merge.mjs': '/* Base license. */\nexport {};\n' });
  commitAll(root, 'base QA');
  git(root, 'branch', '-f', 'main', 'HEAD');
  const from = mergeQa(root);
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', from], oneMeasurement(root));
  assert.equal(result.status, 0, result.output);
  const records = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse).filter(item => item.kind === 'adopt');
  assert.deepEqual(records.map(item => [item.file, item.from, item.lines, item.branches, item.functions, item.untraced, item.untrue]), [['scripts/qa-merge.mjs', from, 0, 0, 0, 0, false]]);
}));

test('[ownership-054] adopt command writes no QA record for an absent current file', () => withFixture(root => {
  const from = mergeQa(root);
  rmSync(path.join(root, 'scripts/qa-merge.mjs'));
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', from], oneMeasurement(root));
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /Adopt: 0 files from/);
  const historyFile = path.join(root, 'openspec/trace/history.jsonl');
  const history = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : '';
  assert.deepEqual(history.split('\n').filter(Boolean).map(JSON.parse).filter(record => record.kind === 'adopt'), []);
}));


test('[ownership-054] adopt command stops for a coverage ignore error in the eligible QA file', () => withFixture(root => {
  const from = mergeQa(root, { 'scripts/qa-merge.mjs': '/* node:coverage ignore next */\nexport {};\n' });
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', from], oneMeasurement(root));
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /ERROR COVERAGE-IGNORE scripts\/qa-merge.mjs/);
  const file = path.join(root, 'openspec/trace/history.jsonl');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
  assert.deepEqual(text.split('\n').filter(Boolean).map(JSON.parse).filter(record => record.kind === 'adopt'), []);
}));



test('[ownership-054] adopt command writes one record for each QA file from both candidate lists', () => withFixture(root => {
  write(root, { 'scripts/qa-base-a.mjs': '/* Base license. */\nexport {};\n', 'scripts/qa-base-b.mjs': '/* Base license. */\nexport {};\n' });
  commitAll(root, 'base QA');
  git(root, 'branch', '-f', 'main', 'HEAD');
  const from = mergeQa(root, { 'scripts/qa-base-a.mjs': 'export {};\n', 'scripts/qa-base-b.mjs': 'export {};\n', 'scripts/qa-new-a.mjs': 'export {};\n', 'scripts/qa-new-b.mjs': 'export {};\n' });
  const result = run(root, ['adopt', '--change', 'add-demo', '--from', 'HEAD^2'], oneMeasurement(root));
  assert.equal(result.status, 0, result.output);
  const records = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse).filter(record => record.kind === 'adopt');
  assert.deepEqual(records.map(record => [record.file, record.from, record.lines, record.branches, record.functions, record.untraced, record.untrue]), [
    ['scripts/qa-base-a.mjs', from, 0, 0, 0, 0, false],
    ['scripts/qa-base-b.mjs', from, 0, 0, 0, 0, false],
    ['scripts/qa-new-a.mjs', from, 0, 0, 0, 0, false],
    ['scripts/qa-new-b.mjs', from, 0, 0, 0, 0, false],
  ]);
}));
