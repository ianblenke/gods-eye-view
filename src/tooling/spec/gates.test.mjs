import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildTestRuns, childEnv, parseArgs, runGates } from '../../../scripts/spec/gates.mjs';
import { GUARD_PRELOAD, missingTestContext } from '../../../scripts/spec/lib/test-guard.mjs';

// A test that needs the guard to count assertions needs getTestContext in node:test.
const GUARDED_RUN = { skip: missingTestContext() };
const PROJECT_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const GATES = path.join(PROJECT_ROOT, 'scripts/spec/gates.mjs');
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
  assert.equal(result.status, 0, result.output);
  return result;
}

function reviewFor(root, change, folder = `openspec/changes/${change}`) {
  const tree = run(root, ['tree', '--change', change]).output.trim();
  write(root, {
    [`${folder}/review.md`]: `Verdict: PASS\nReviewers: spec-adversary, ste-adversary\nDate: 2026-09-13\nGates: passed\nRounds: 1\nScope: full\nReviewed-Tree: ${tree}\n`,
    [`${folder}/review/spec-adversary.md`]: 'Verdict: PASS\nFindings: none\n',
    [`${folder}/review/ste-adversary.md`]: 'Verdict: PASS\nFindings: none\n',
  });
}

test('[coverage-gate-003] runs each tracked test file with coverage and the trace reporter', GUARDED_RUN, () => {
  const [main] = buildTestRuns({ testFiles: ['src/a.test.mjs', 'tools/b.test.mjs'], allocationFiles: [], outDir: '/out' });
  assert.deepEqual(main.args.slice(0, 2), ['--test', '--experimental-test-coverage']);
  assert.ok(main.args.includes('--test-reporter-destination=/out/lcov.info'));
  assert.deepEqual([main.output, main.args.slice(-2)], ['/out/tests-main.jsonl', ['src/a.test.mjs', 'tools/b.test.mjs']]);
  assert.deepEqual(buildTestRuns({ testFiles: [], allocationFiles: [], outDir: '/out' }), []);
  withFixture((root) => {
    passes(root, ['init']);
    const files = readFileSync(path.join(root, '.gev-cache/spec/tests-main.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line).file);
    assert.deepEqual(files.sort(), ['src/math.test.mjs', 'tools/other.test.mjs']);
  });
});

test('[coverage-gate-007] runs the allocation tests alone with --expose-gc and no coverage', GUARDED_RUN, () => {
  const runs = buildTestRuns({ testFiles: ['src/a.test.mjs', 'src/alloc.test.mjs'], allocationFiles: ['src/alloc.test.mjs', 'src/other.test.mjs'], outDir: '/out' });
  assert.deepEqual(runs.map((item) => item.kind), ['main', 'allocation']);
  assert.equal(runs[0].args.includes('src/alloc.test.mjs'), false);
  assert.deepEqual(runs[1].args.slice(0, 3), ['--expose-gc', '--test', '--test-concurrency=1']);
  assert.equal(runs[1].args.includes('--experimental-test-coverage'), false);
  assert.equal(runs[1].output, '/out/tests-allocation-0.jsonl');
  const probe = "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('allocation probe', () => {\n  assert.equal(typeof globalThis.gc, 'function');\n});\n";
  withFixture(
    (root) => {
      const result = passes(root, ['init'], { allocationFiles: ['src/alloc.test.mjs'] });
      assert.match(readFileSync(path.join(root, '.gev-cache/spec/tests-allocation-0.jsonl'), 'utf8'), /"status":"pass"/);
      assert.match(result.output, /3 tests, 0 traced, 3 untraced\./);
    },
    { base: { 'src/alloc.test.mjs': probe } },
  );
});

test('[coverage-gate-015] runs the tests without the Node options of the gate environment and with the test guard', () => {
  const env = childEnv({ PATH: '/bin', NODE_OPTIONS: '--require x', NODE_V8_COVERAGE: '/cov', NODE_TEST_CONTEXT: 'child' }, { outDir: '/out', root: '/repo', inventoryHash: 'abc' });
  assert.deepEqual(env, { PATH: '/bin', NODE_OPTIONS: GUARD_PRELOAD, GEV_SPEC_OUT: '/out', GEV_SPEC_ROOT: '/repo', GEV_SPEC_INVENTORY: 'abc' });
});

test('[coverage-gate-016] stops for a Node version that is not the pinned version', () => {
  withFixture((root) => {
    rmSync(path.join(root, '.node-version'));
    assert.match(run(root, ['check']).output, /ERROR GATES-RUNTIME \.node-version Add the file \.node-version with the pinned Node version\./);
  });
  withFixture((root) => {
    const result = run(root, ['check'], { nodeVersion: '0.0.1' });
    assert.equal(result.status, 1);
    assert.match(result.output, new RegExp(`ERROR GATES-RUNTIME \\.node-version .*Run the gates on Node ${NODE.replaceAll('.', '\\.')} \\(make gates\\), not Node 0\\.0\\.1\\.`));
  });
});

test('[gap-ledger-030] stops for a base branch that Git cannot find', () => {
  withFixture((root) => {
    const lines = [];
    const status = runGates({ root, argv: ['check'], log: (line) => lines.push(line) });
    assert.equal(status, 1);
    assert.match(lines.join('\n'), /ERROR GATES-BASE Git cannot find the merge base of HEAD and origin\/main/);
  });
});

test('[gap-ledger-001 gap-ledger-007 spec-trace-030] makes the first ledger, runs the ratchet command for a change and passes the check', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const ledger = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'));
    assert.deepEqual(Object.keys(ledger.untracedTests), ['src/math.test.mjs', 'tools/other.test.mjs']);
    assert.deepEqual(ledger.coverage, {});

    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
    passes(root, ['ratchet', '--change', 'add-demo']);
    assert.deepEqual(Object.keys(JSON.parse(readFileSync(path.join(root, 'openspec/trace/ids.json'), 'utf8'))), ['demo-001']);
    assert.deepEqual(JSON.parse(readFileSync(path.join(root, 'openspec/trace/links.json'), 'utf8')), { 'demo-001': ['src/math.test.mjs › [demo-001] adds two numbers'] });
    write(root, { 'openspec/changes/add-demo/notes.md': 'The file is removed.\n' });
    const check = passes(root, ['check']);
    assert.match(check.output, /WARN STE-PASSIVE openspec\/changes\/add-demo\/notes\.md:1 Check for passive voice: "is removed"/);
    assert.match(check.output, /Trace: 1 scenarios, 1 verified, 0 open\. 2 tests, 1 traced, 1 untraced\./);
    assert.match(check.output, /Coverage: 1 files, 1 complete, 0 not loaded, 0 untrue\./);
    assert.match(check.output, /Gates passed\./);
  });
});

test('[gap-ledger-003 spec-trace-016 coverage-gate-010] stops the check for a new gap, a failed test and an untracked file', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, {
      'src/math.js': 'export function add(a, b) {\n  if (a > 100) return 0;\n  return a + b;\n}\n',
      'src/math.test.mjs': MATH_TEST('adds two numbers', "test('breaks', () => {\n  assert.equal(1, 2);\n});"),
      'src/draft.js': 'export {};\n',
    });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-UNTRACKED src\/draft\.js/);
    assert.match(check.output, /ERROR TRACE-FAILED-TEST src\/math\.test\.mjs Test "breaks" failed/);
    assert.match(check.output, /ERROR LEDGER-NEW-COVERAGE-GAP src\/math\.js/);
    assert.match(check.output, /ERROR LEDGER-NEW-UNTRACED-NAME src\/math\.test\.mjs/);
  });
});

test('[coverage-gate-018 coverage-gate-021 spec-trace-027] stops the check for untrue coverage and a test without an assertion', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const fake = `test('[demo-001] fakes the coverage', () => {\n  new Function('return 1;\\n//# sourceURL=${pathToFileURL(path.join(root, 'src/math.js')).href}')();\n});`;
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('adds two numbers', fake) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /Coverage: 1 files, 0 complete, 1 not loaded, 1 untrue\./);
    assert.match(check.output, /ERROR TRACE-NO-ASSERTION src\/math\.test\.mjs/);
    assert.match(check.output, /ERROR COVERAGE-FAKE src\/math\.js/);
  });
});

test('[gap-ledger-008 change-review-006 change-review-015] runs the ratchet command for a change, checks its review and its tree hash', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
    const stale = run(root, ['check', '--change', 'add-demo']);
    assert.equal(stale.status, 1);
    for (const code of ['LEDGER-STALE', 'TRACE-ID-UNREGISTERED', 'TRACE-LINKS-STALE', 'REVIEW-MISSING']) assert.match(stale.output, new RegExp(`ERROR ${code}`));

    passes(root, ['ratchet', '--change', 'add-demo']);
    const history = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.deepEqual(history.map((line) => [line.change, line.file, line.reason]), [['add-demo', 'src/math.test.mjs', 'closed']]);
    assert.match(history[0].commit, /^[0-9a-f]{40}$/);

    reviewFor(root, 'add-demo');
    passes(root, ['check', '--change', 'add-demo']);
    write(root, { 'src/math.js': 'export function add(a, b) {\n  return b + a;\n}\n' });
    const edited = run(root, ['check', '--change', 'add-demo']);
    assert.equal(edited.status, 1);
    assert.match(edited.output, /ERROR REVIEW-TREE/);
  });
});

test('[gap-ledger-021] stops the check for a ledger entry that the base does not have', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    commitAll(root, 'ledger');
    git(root, 'checkout', '-q', 'main');
    git(root, 'merge', '-q', '--ff-only', 'work');
    git(root, 'checkout', '-q', '-b', 'tamper');
    const ledger = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'));
    ledger.untracedTests['tools/other.test.mjs'].names['a hidden test'] = 1;
    write(root, { 'openspec/trace/gaps.json': JSON.stringify(ledger) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR LEDGER-NOT-IN-BASE tools\/other\.test\.mjs Untraced test "a hidden test" is not in the base ledger/);
  });
});

test('[spec-trace-032 spec-trace-036 spec-trace-037] stops for changed scenario text and a changed registry without a changed test', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
    passes(root, ['ratchet', '--change', 'add-demo']);
    commitAll(root, 'change');
    git(root, 'checkout', '-q', 'main');
    git(root, 'merge', '-q', '--ff-only', 'work');
    git(root, 'checkout', '-q', '-b', 'reword');
    write(root, { 'openspec/changes/add-demo/specs/demo/spec.md': SPEC.replace('the result is 3', 'the result is three') });
    const registryBefore = readFileSync(path.join(root, 'openspec/trace/ids.json'), 'utf8');
    const result = run(root, ['ratchet', '--change', 'add-demo']);
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR TRACE-ID-CHANGED-NO-TEST openspec\/changes\/add-demo\/specs\/demo\/spec\.md:7/);
    assert.equal(readFileSync(path.join(root, 'openspec/trace/ids.json'), 'utf8'), registryBefore);
    write(root, { 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers').replace("import { add } from './math.js';", "import { add } from './math.js';\n// Only this line changed.") });
    assert.match(run(root, ['ratchet', '--change', 'add-demo']).output, /ERROR TRACE-ID-CHANGED-NO-TEST/);
    const check = run(root, ['check']);
    assert.match(check.output, /ERROR TRACE-ID-CHANGED openspec\/changes\/add-demo\/specs\/demo\/spec\.md:7/);
    const registry = JSON.parse(registryBefore);
    registry['demo-001'].hash = 'forged';
    write(root, { 'openspec/trace/ids.json': JSON.stringify(registry) });
    assert.match(run(root, ['check']).output, /ERROR TRACE-ID-BASE-CHANGED openspec\/trace\/ids\.json The hash of demo-001 is not the base hash/);
    write(root, { 'openspec/trace/ids.json': '{}' });
    assert.match(run(root, ['check']).output, /ERROR TRACE-ID-BASE-DROPPED openspec\/trace\/ids\.json The base registry has demo-001/);
    write(root, { 'openspec/trace/ids.json': registryBefore, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers').replace('add(1, 2), 3', 'add(2, 1), 3') });
    passes(root, ['ratchet', '--change', 'add-demo']);
  });
});

test('[gap-ledger-013 gap-ledger-014 gap-ledger-027] stops the ratchet command for a larger gap, without a change name or for a change that is not active', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', "test('breaks', () => {\n  assert.equal(1, 2);\n});") });
    assert.match(run(root, ['ratchet', '--change', 'add-demo']).output, /ERROR TRACE-FAILED-TEST/);
    write(root, { 'src/math.test.mjs': MATH_TEST() });
    assert.match(run(root, ['ratchet']).output, /ERROR GATES-USAGE The ratchet command needs --change <name>/);
    write(root, { 'openspec/changes/empty/notes.md': 'No proposal here.\n' });
    assert.match(run(root, ['ratchet', '--change', 'empty']).output, /ERROR GATES-RATCHET .*has no folder with a proposal\.md file/);
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'), 'src/math.js': 'export function add(a, b) {\n  if (a > 100) return 0;\n  return a + b;\n}\n' });
    const larger = run(root, ['ratchet', '--change', 'add-demo']);
    assert.equal(larger.status, 1);
    assert.match(larger.output, /ERROR GATES-RATCHET openspec\/trace\/gaps\.json The ratchet command cannot run while gaps are larger:\nLEDGER-NEW-COVERAGE-GAP src\/math\.js/);
  });
});

test('[gap-ledger-002 gap-ledger-015 gap-ledger-016] stops the init command for a ledger, a base ledger or a new file with a gap', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    assert.match(run(root, ['init']).output, /ERROR GATES-INIT .*gaps\.json exists/);
    commitAll(root, 'ledger');
    git(root, 'checkout', '-q', 'main');
    git(root, 'merge', '-q', '--ff-only', 'work');
    git(root, 'checkout', '-q', '-b', 'again');
    rmSync(path.join(root, 'openspec/trace/gaps.json'));
    assert.match(run(root, ['init']).output, /ERROR GATES-INIT openspec\/trace\/gaps\.json The base commit has openspec\/trace\/gaps\.json/);
  });
  withFixture((root) => {
    write(root, { 'src/new.test.mjs': "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('new untraced', () => {\n  assert.ok(true);\n});\n" });
    git(root, 'add', '-A');
    const result = run(root, ['init']);
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR GATES-INIT .*not pre-spec: src\/new\.test\.mjs/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/gaps.json')), false);
  });
  withFixture((root) => {
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', "test('breaks', () => {\n  assert.equal(1, 2);\n});") });
    const result = run(root, ['init']);
    assert.match(result.output, /ERROR TRACE-FAILED-TEST/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/gaps.json')), false);
  });
});

test('[spec-trace-002 coverage-gate-008 coverage-gate-017] reports spec, comment, option and ledger errors', () => {
  const ignore = ['c8', 'ignore'].join(' ');
  withFixture((root) => {
    write(root, {
      'src/math.js': `export function add(a, b) {\n  /* ${ignore} next */\n  return a + b;\n}\n`,
      'package.json': `{"scripts":{"test":"node --test --test-coverage-${'ex' + 'clude'}=x"}}\n`,
      'openspec/specs/broken/spec.md': '### Requirement: X\nThe x MUST work.\nOrigin: spec-first\n#### Scenario: No id\n- **WHEN** a\n- **THEN** b\n',
      'openspec/changes/archive/2026-09-01-old/proposal.md': '## Why\n\nOld.\n',
    });
    git(root, 'add', '-A');
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    for (const pattern of [/ERROR SPEC-NO-ID openspec\/specs\/broken\/spec\.md:4/, /ERROR COVERAGE-IGNORE src\/math\.js:2/, /ERROR COVERAGE-FLAG package\.json:1/, /ERROR GATES-NO-LEDGER/]) {
      assert.match(check.output, pattern);
    }
    passes(root, ['lint']);
  });
});

test('[change-review-007] reports an archived change without a review in the check', GUARDED_RUN, () => {
  withFixture((root) => {
    write(root, { 'openspec/changes/archive/2026-09-01-old/proposal.md': '## Why\n\nOld.\n' });
    passes(root, ['init']);
    assert.match(run(root, ['check']).output, /ERROR REVIEW-MISSING openspec\/changes\/archive\/2026-09-01-old\/review\.md/);
  });
});

test('[spec-trace-026] stops the check for an unknown change name', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    assert.match(run(root, ['check', '--change', 'nope']).output, /ERROR TRACE-UNKNOWN-CHANGE openspec\/changes No active or archived change has the name nope/);
    assert.match(run(root, ['tree', '--change', 'nope']).output, /ERROR GATES-USAGE The tree command needs --change/);
  });
});

test('[ste-lint-011 ste-lint-012 ste-lint-016] checks only Markdown with the lint command', () => {
  withFixture((root) => {
    write(root, { '.gev-cache/spec/tests-main.jsonl': `${JSON.stringify({ file: 'src/a.test.mjs', name: '[a-001] it should stop', fullName: '[a-001] it should stop', title: 'it should stop', kind: 'test', leaf: true, status: 'pass', tags: ['a-001'], tagError: null })}\n` });
    assert.match(passes(root, ['lint']).output, /STE: 0 errors, 0 warnings\./);
    write(root, { 'openspec/specs/demo/notes.md': 'The file is removed.\n' });
    const warning = passes(root, ['lint']);
    assert.match(warning.output, /WARN STE-PASSIVE openspec\/specs\/demo\/notes\.md:1/);
    write(root, { 'openspec/specs/demo/notes.md': 'You should stop.\n' });
    const error = run(root, ['lint']);
    assert.equal(error.status, 1);
    assert.match(error.output, /ERROR STE-WORD openspec\/specs\/demo\/notes\.md:1 Use "must", not "should"/);
  });
});

test('[ci-gates-001 ci-gates-003 ci-gates-004] finds the change of a CI diff and checks it', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    commitAll(root, 'ledger');
    git(root, 'checkout', '-q', 'main');
    git(root, 'merge', '-q', '--ff-only', 'work');
    git(root, 'checkout', '-q', '-b', 'feature');

    write(root, { 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
    assert.match(run(root, ['ci']).output, /ERROR CI-NO-CHANGE/);
    write(root, CHANGE);
    assert.match(run(root, ['ci']).output, /ERROR CI-ACTIVE-CHANGE openspec\/changes\/add-demo/);

    passes(root, ['ratchet', '--change', 'add-demo']);
    const archived = 'openspec/changes/archive/2026-09-13-add-demo';
    mkdirSync(path.join(root, 'openspec/changes/archive'), { recursive: true });
    git(root, 'add', '-A');
    git(root, 'mv', 'openspec/changes/add-demo', archived);
    assert.match(run(root, ['ci']).output, /ERROR SPEC-DELTA-NOT-APPLIED openspec\/changes\/archive\/2026-09-13-add-demo\/specs\/demo\/spec\.md:\d+ Scenario demo-001 of the archived change is not in openspec\/specs/);
    write(root, { 'openspec/specs/demo/spec.md': SPEC.replace('## ADDED Requirements', '## Purpose\n\nThe demo adds two numbers so that the gates have a spec to check.\n\n## Requirements') });
    reviewFor(root, 'add-demo', archived);
    const ci = run(root, ['ci']);
    assert.equal(ci.status, 0, ci.output);
    assert.match(ci.output, /CI: check the change add-demo\./);
  });
});

test('[spec-lint-021 spec-lint-022] checks the tasks and the requirement format of the archived change that the gates check', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const archived = 'openspec/changes/archive/2026-09-13-add-demo';
    const stream = '### Requirement: Stream check\nThe demo MUST stop a stream that has no audio.\nOrigin: spec-first\n';
    write(root, {
      [`${archived}/proposal.md`]: CHANGE['openspec/changes/add-demo/proposal.md'],
      [`${archived}/tasks.md`]: '## 1. Demo\n\n- [ ] 1.1 Write the code.\n',
      [`${archived}/specs/demo/spec.md`]: `${SPEC}\n${stream}`,
    });
    const output = run(root, ['check', '--change', 'add-demo']).output;
    assert.match(output, /ERROR SPEC-LINT-NO-TASK openspec\/changes\/archive\/2026-09-13-add-demo\/tasks\.md No task names the scenario ID demo-001/);
    assert.match(output, /ERROR SPEC-LINT-NO-SCENARIO openspec\/changes\/archive\/2026-09-13-add-demo\/specs\/demo\/spec\.md:11 Requirement "Stream check" has no scenario/);
    assert.match(output, /ERROR SPEC-DELTA-NOT-APPLIED openspec\/changes\/archive\/2026-09-13-add-demo\/specs\/demo\/spec\.md:3 Requirement "Add numbers" of the archived change is not in openspec\/specs\/demo\/spec\.md/);
  });
});

const SHAPES = 'export function area(w, h) {\n  return w * h;\n}\nexport function perimeter(w, h) {\n  return 2 * (w + h);\n}\nexport function unused() {\n  return 0;\n}\n';
const SHAPES_TEST = (calls) => ["import test from 'node:test';", "import assert from 'node:assert/strict';", "import { area, perimeter } from './shapes.js';", "test('measures shapes', () => {", ...calls, '});', ''].join('\n');

test('[gap-ledger-065 gap-ledger-068] uses the count bands of a band file in the check and in the ratchet command', GUARDED_RUN, () => {
  const base = { 'src/shapes.js': SHAPES, 'src/shapes.test.mjs': SHAPES_TEST(['  assert.equal(area(2, 3), 6);', '  assert.equal(perimeter(2, 3), 10);']) };
  withFixture(
    (root) => {
      passes(root, ['init']);
      const entry = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/shapes.js'];
      assert.equal(entry.functions, 1);
      write(root, { 'src/shapes.test.mjs': SHAPES_TEST(['  assert.equal(area(2, 3), 6);', '  assert.equal(typeof perimeter, "function");']) });
      const check = passes(root, ['check']);
      assert.match(check.output, /Ledger: 0 entries do not match the current gaps\./);
      write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
      passes(root, ['ratchet', '--change', 'add-demo']);
      assert.deepEqual(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/shapes.js'], entry);
    },
    { base },
  );
});

test('[ci-gates-005] checks a diff that changes no code, without a change name', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    commitAll(root, 'ledger');
    git(root, 'checkout', '-q', 'main');
    git(root, 'merge', '-q', '--ff-only', 'work');
    git(root, 'checkout', '-q', '-b', 'docs');
    write(root, { 'README.md': '# Readme\n' });
    assert.match(passes(root, ['ci']).output, /CI: check without a change\./);
  });
});

test('[coverage-gate-047] stops for a local dotenv file that is not empty before the gate starts the test runs', () => {
  withFixture((root) => {
    const spawned = [];
    const spawn = (...args) => {
      spawned.push(args);
      return { status: 9, error: new Error('spawn failed') };
    };
    write(root, { '.env': 'GOOGLE_MAPS_API_KEY=local\n', '.env.local': 'A=1\n', '.env.example': 'A=\n', '.env.empty': '' });
    mkdirSync(path.join(root, '.env.d'));
    symlinkSync(path.join(root, 'no-such-file'), path.join(root, '.env.link'));
    git(root, 'add', '-f', '.env.example');
    const stopped = run(root, ['check'], { spawn });
    assert.equal(stopped.status, 1);
    assert.deepEqual(spawned, []);
    assert.deepEqual(stopped.output.split('\n').filter((line) => line.startsWith('ERROR')), [
      'ERROR GATES-LOCAL-ENV .env The file .env can change the coverage of the tests. Make the file empty. When Git ignores the file, you can also run the gates with make.',
      'ERROR GATES-LOCAL-ENV .env.local The file .env.local can change the coverage of the tests. Make the file empty. When Git ignores the file, you can also run the gates with make.',
    ]);
    write(root, { '.env': '', '.env.local': '' });
    assert.match(run(root, ['check'], { spawn }).output, /ERROR GATES-TEST-RUN The test runner stopped with status 9: spawn failed/);
    assert.equal(spawned.length, 1);
  });
});

test('[coverage-gate-026] stops when the test runner or a test run cannot start', () => {
  withFixture((root) => {
    const result = run(root, ['init'], { spawn: () => ({ status: 9, error: new Error('spawn failed') }) });
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR GATES-TEST-RUN The test runner stopped with status 9: spawn failed/);
    const noResults = run(root, ['init'], { spawn: () => ({ status: 0 }) });
    assert.match(noResults.output, /ERROR GATES-TEST-RUN The test runner stopped with status 0$/m);
    const fakeRunner = (results) => (command, args) => {
      writeFileSync(args[2], JSON.stringify(results));
      return { status: 0 };
    };
    const failedRun = run(root, ['init'], { spawn: fakeRunner([{ status: 5, error: null }]) });
    assert.match(failedRun.output, /ERROR GATES-TEST-RUN The main test run stopped with status 5$/m);
    const brokenRun = run(root, ['init'], { spawn: fakeRunner([{ status: null, error: 'no node' }]) });
    assert.match(brokenRun.output, /ERROR GATES-TEST-RUN The main test run stopped with status null: no node$/m);
  });
});

test('[coverage-gate-035] stops for a failed test run without a failed test in its result file', () => {
  withFixture((root) => {
    const entry = (status) => JSON.stringify({ file: 'src/math.test.mjs', name: 'adds two numbers', title: 'adds two numbers', kind: 'test', status, tags: [], tagError: null, line: 4, column: 1, fullName: 'adds two numbers', leaf: true });
    const runner = (status, lines) => (command, args) => {
      writeFileSync(path.join(path.dirname(args[2]), 'tests-main.jsonl'), lines.map((line) => `${line}\n`).join(''));
      writeFileSync(args[2], JSON.stringify([{ status, error: null }]));
      return { status: 0 };
    };
    const message = /ERROR GATES-TEST-RUN The main test run stopped with status 1, but no test in its result file failed/;
    assert.match(run(root, ['init'], { spawn: runner(1, [entry('pass')]) }).output, message);
    assert.match(run(root, ['init'], { spawn: runner(1, []) }).output, message);
    const failed = run(root, ['init'], { spawn: runner(1, [entry('fail')]) });
    assert.doesNotMatch(failed.output, message);
    assert.match(failed.output, /ERROR TRACE-FAILED-TEST src\/math\.test\.mjs/);
    assert.doesNotMatch(run(root, ['init'], { spawn: runner(0, [entry('pass')]) }).output, /GATES-TEST-RUN/);
  });
});

test('[ci-gates-009] shows the usage for a bad command line and reads the root option', () => {
  assert.deepEqual(parseArgs(['check', '--change', 'a', '--base', 'main', '--root', '/x']), { command: 'check', change: 'a', base: 'main', root: '/x' });
  for (const argv of [[], ['deploy'], ['check', '--change'], ['check', '--bogus', 'x']]) assert.throws(() => parseArgs(argv), /Usage/);
  const usage = spawnSync(process.execPath, [GATES, 'nope'], { encoding: 'utf8' });
  assert.equal(usage.status, 2);
  assert.match(usage.stderr, /Usage: node scripts\/spec\/gates\.mjs/);
  withFixture((root) => {
    const lint = spawnSync(process.execPath, [GATES, 'lint', '--root', root], { encoding: 'utf8' });
    assert.equal(lint.status, 0, lint.stderr);
    assert.match(lint.stdout, /STE: 0 errors, 0 warnings\./);
    const inCwd = spawnSync(process.execPath, [GATES, 'lint'], { cwd: root, encoding: 'utf8' });
    assert.match(inCwd.stdout, /STE: 0 errors, 0 warnings\./);
  });
});

/** A test that covers a different branch on each run, so its coverage is unstable. */
const FLIP = {
  'src/flip.js': 'export function flip(first) {\n  if (first) {\n    const word = "a";\n    return word;\n  }\n  return "b";\n}\n',
  'src/flip.test.mjs': [
    "import test from 'node:test';",
    "import assert from 'node:assert/strict';",
    "import { existsSync, rmSync, writeFileSync } from 'node:fs';",
    "import { flip } from './flip.js';",
    "test('flips the branch on each run', () => {",
    "  const marker = new URL('../.gev-cache/flip.marker', import.meta.url);",
    '  const first = !existsSync(marker);',
    "  if (first) writeFileSync(marker, 'x');",
    '  else rmSync(marker);',
    "  assert.equal(flip(first), first ? 'a' : 'b');",
    '});',
    '',
  ].join('\n'),
};

function mergeToMain(root, branch) {
  commitAll(root, `commit on ${branch}`);
  git(root, 'checkout', '-q', 'main');
  git(root, 'merge', '-q', '--ff-only', 'work');
  git(root, 'checkout', '-q', '-b', branch);
}

test('[gap-ledger-035 gap-ledger-037 gap-ledger-039] records unstable coverage from the kept samples and does not stop for it in the check against a base ledger', GUARDED_RUN, () => {
  withFixture(
    (root) => {
      passes(root, ['init']);
      mergeToMain(root, 'stable');
      write(root, { 'openspec/changes/record-flip/proposal.md': '## Why\n\nThe flip test has unstable coverage, so the ledger records a range.\n\n## What Changes\n\n- Record the range of the flip file.\n' });
      assert.match(run(root, ['stability']).output, /ERROR GATES-USAGE The stability command needs --change <name>/);
      const stability = passes(root, ['stability', '--change', 'record-flip']);
      assert.match(stability.output, /Stability: 1 files with unstable coverage for record-flip\./);
      const kept = readFileSync(path.join(root, '.gev-cache/spec-samples.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
      assert.deepEqual(kept.filter((sample) => sample.file === 'src/flip.js').length, 3);
      const entry = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/flip.js'];
      assert.deepEqual([entry.low.lines, entry.lines], [1, 3]);
      assert.match(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), /"change":"record-flip".*"reason":"unstable"/);
      reviewFor(root, 'record-flip');
      passes(root, ['check', '--change', 'record-flip']);
      passes(root, ['check', '--change', 'record-flip']);
      assert.match(run(root, ['check']).output, /ERROR LEDGER-UNSTABLE-NO-HISTORY src\/flip\.js/);
    },
    { base: FLIP },
  );
});

test('[gap-ledger-036] stops the stability command for a changed file with unstable coverage', GUARDED_RUN, () => {
  withFixture(
    (root) => {
      passes(root, ['init']);
      write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'), 'src/flip.js': FLIP['src/flip.js'].replace('"b"', '"c"'), 'src/flip.test.mjs': FLIP['src/flip.test.mjs'].replace("'b'", "'c'") });
      const ledgerBefore = readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8');
      const result = run(root, ['stability', '--change', 'add-demo']);
      assert.equal(result.status, 1);
      assert.match(result.output, /ERROR GATES-STABILITY .*content is not the base content: src\/flip\.js/);
      assert.equal(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'), ledgerBefore);
    },
    { base: FLIP },
  );
  withFixture((root) => {
    write(root, CHANGE);
    assert.match(run(root, ['stability', '--change', 'add-demo']).output, /ERROR GATES-NO-LEDGER/);
    passes(root, ['init']);
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', "test('breaks', () => {\n  assert.equal(1, 2);\n});") });
    assert.match(run(root, ['stability', '--change', 'add-demo']).output, /ERROR TRACE-FAILED-TEST/);
  });
});

test('[coverage-gate-030] stops for a result file that the gate did not name', () => {
  withFixture((root) => {
    const forger = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(path.join(path.dirname(args[2]), 'tests-forged.jsonl'), `${JSON.stringify({ file: 'src/math.test.mjs', name: '[demo-001] forged', fullName: '[demo-001] forged', title: 'forged', kind: 'test', leaf: true, status: 'pass', tags: ['demo-001'], tagError: null })}\n`);
      return result;
    };
    const result = run(root, ['init'], { spawn: forger });
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR COVERAGE-EXTRA-RESULT tests-forged\.jsonl The result folder has tests-forged\.jsonl, but the gate did not name it/);
    assert.match(result.output, /Trace: 0 scenarios, 0 verified, 0 open\. 2 tests, 0 traced, 2 untraced\./);
  });
});

test('[coverage-gate-023] stops for a code file that changes during the run', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const change = "test('changes the code', () => {\n  appendFileSync(new URL('./math.js', import.meta.url), '// changed\\n');\n  assert.ok(true);\n});";
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', change).replace("import { add } from './math.js';", "import { add } from './math.js';\nimport { appendFileSync } from 'node:fs';") });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-FILE-CHANGED src\/math\.js src\/math\.js changed during the test run/);
  });
});

test('[coverage-gate-024] gives 0% coverage to a file that only a worker thread loads', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const workerTest = [
      "import test from 'node:test';",
      "import assert from 'node:assert/strict';",
      "import { Worker } from 'node:worker_threads';",
      "test('adds two numbers in a worker', async () => {",
      "  const url = new URL('./math.js', import.meta.url).href;",
      "  const worker = new Worker(`import(${JSON.stringify(url)}).then((m) => require('node:worker_threads').parentPort.postMessage(m.add(1, 2)))`, { eval: true });",
      "  const result = await new Promise((resolve) => worker.once('message', resolve));",
      '  await worker.terminate();',
      '  assert.equal(result, 3);',
      '});',
      '',
    ].join('\n');
    write(root, { 'src/math.test.mjs': workerTest });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /Coverage: 1 files, 0 complete, 1 not loaded, 1 untrue\./);
    assert.match(check.output, /ERROR COVERAGE-FAKE src\/math\.js/);
  });
});

test('[change-review-019 change-review-020] shows the tree hash of a change and stops for a change name that two folders use', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, CHANGE);
    const tree = run(root, ['tree', '--change', 'add-demo']);
    assert.equal(tree.status, 0);
    assert.match(tree.output, /^[0-9a-f]{64}$/);
    write(root, { 'openspec/changes/archive/2026-01-01-add-demo/proposal.md': '## Why\n\nOld demo.\n' });
    assert.match(run(root, ['check']).output, /ERROR REVIEW-NAME-REUSED openspec\/changes Two change folders have the change name add-demo/);
  });
});

test('[spec-trace-039 spec-trace-040] stops for a result entry that a test writes in the result folder', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const forge = [
      "test('writes a result entry', () => {",
      "  const args = readFileSync(`/proc/${process.ppid}/cmdline`, 'utf8').split('\\0');",
      "  const option = args.find((arg) => arg.startsWith('--test-reporter-destination=') && arg.endsWith('tests-main.jsonl'));",
      "  const destination = option.slice(option.indexOf('=') + 1);",
      "  const record = { file: 'src/math.test.mjs', name: '[demo-001] adds two numbers', title: 'adds two numbers', kind: 'test', status: 'pass', tags: ['demo-002'], tagError: null, line: 5, fullName: '[demo-001] adds two numbers', leaf: true };",
      "  appendFileSync(destination, `${'\\n'.repeat(100000)}${JSON.stringify(record)}\\n`);",
      '  assert.ok(destination.endsWith(\'tests-main.jsonl\'));',
      '});',
    ].join('\n');
    const imports = "import { add } from './math.js';\nimport { appendFileSync, readFileSync } from 'node:fs';";
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers', forge).replace("import { add } from './math.js';", imports) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR TRACE-RECORD-NAME src\/math\.test\.mjs Test "\[demo-001\] adds two numbers" has a result record with tags or a full name that do not agree with its name/);
    assert.match(check.output, /ERROR TRACE-DUPLICATE-NAME src\/math\.test\.mjs Test "\[demo-001\] adds two numbers"/);
  });
});

test('[coverage-gate-031] stops for untrue coverage from a child process that a test starts with other values for the gate variables', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const hide = [
      "test('hides untrue coverage in child processes', () => {",
      "  const url = new URL('./math.js', import.meta.url).href;",
      "  const fake = `new Function(${JSON.stringify(`return 1;\\n//# sourceURL=${url}`)})();`;",
      "  const own = spawnSync(process.execPath, ['-e', fake], { env: { ...process.env, GEV_SPEC_OUT: '', GEV_SPEC_INVENTORY: 'x' } });",
      "  process.env.GEV_SPEC_OUT = '';",
      "  process.env.NODE_OPTIONS = '';",
      "  const inherited = spawnSync(process.execPath, ['-e', fake]);",
      '  assert.deepEqual([own.status, inherited.status], [0, 0]);',
      '});',
    ].join('\n');
    const imports = "import { add } from './math.js';\nimport { spawnSync } from 'node:child_process';";
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', hide).replace("import { add } from './math.js';", imports) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /Coverage: 1 files, 0 complete, 1 not loaded, 1 untrue\./);
    assert.match(check.output, /ERROR COVERAGE-FAKE src\/math\.js/);
  });
});

test('[coverage-gate-034] stops for an inventory.json file that changes during the run', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const change = "test('changes the inventory', () => {\n  writeFileSync(path.join(process.env.GEV_SPEC_OUT, 'inventory.json'), '{}');\n  assert.ok(true);\n});";
    const imports = "import { add } from './math.js';\nimport { writeFileSync } from 'node:fs';\nimport path from 'node:path';";
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', change).replace("import { add } from './math.js';", imports) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-INVENTORY-CHANGED \.gev-cache\/spec\/inventory\.json The inventory file changed during the test run/);
  });
});

test('[gap-ledger-053] stops the check, the ratchet command and the stability command when the ledger file is not there', () => {
  withFixture((root) => {
    write(root, CHANGE);
    for (const argv of [['check'], ['ratchet', '--change', 'add-demo'], ['stability', '--change', 'add-demo']]) {
      const result = run(root, argv);
      assert.equal(result.status, 1);
      assert.match(result.output, /ERROR GATES-NO-LEDGER openspec\/trace\/gaps\.json Run: node scripts\/spec\/gates\.mjs init/);
    }
  });
});

test('[coverage-gate-037] stops for a guard error that names no file', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const report = "test('reports a process without an inspector', () => {\n  const violation = { code: 'COVERAGE-NO-INSPECTOR', file: '', message: 'Process 1 collects coverage, but the test guard cannot start an inspector session' };\n  writeFileSync(path.join(process.env.GEV_SPEC_OUT, 'guard-1.jsonl'), `${JSON.stringify({ violations: [violation], checked: [], assertions: [] })}\\n`);\n  assert.ok(true);\n});";
    const imports = "import { add } from './math.js';\nimport { writeFileSync } from 'node:fs';\nimport path from 'node:path';";
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', report).replace("import { add } from './math.js';", imports) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-NO-INSPECTOR Process 1 collects coverage, but the test guard cannot start an inspector session/);
  });
});

test('[coverage-gate-040] stops for untrue coverage from a test runner that a test starts, with a preload that removes the gate values', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const nested = [
      "test('runs a nested test runner', () => {",
      "  const url = new URL('./math.js', import.meta.url).href;",
      "  writeFileSync(new URL('../.gev-cache/strip.cjs', import.meta.url), 'delete process.env.GEV_SPEC_OUT;\\n');",
      "  const fake = `import test from 'node:test';\\ntest('fakes', () => { new Function(${JSON.stringify(`return 1;\\n//# sourceURL=${url}`)})(); });\\n`;",
      "  writeFileSync(new URL('../.gev-cache/fake.test.mjs', import.meta.url), fake);",
      '  const withoutContext = { ...process.env };',
      '  delete withoutContext.NODE_TEST_CONTEXT;',
      "  const result = spawnSync(process.execPath, ['--require', fileURLToPath(new URL('../.gev-cache/strip.cjs', import.meta.url)), '--test', fileURLToPath(new URL('../.gev-cache/fake.test.mjs', import.meta.url))], { env: withoutContext, encoding: 'utf8' });",
      '  assert.equal(result.status, 0, result.stdout + result.stderr);',
      '});',
    ].join('\n');
    const imports = "import { add } from './math.js';\nimport { spawnSync } from 'node:child_process';\nimport { writeFileSync } from 'node:fs';\nimport { fileURLToPath } from 'node:url';";
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', nested).replace("import { add } from './math.js';", imports) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-FAKE src\/math\.js/);
  });
});

test('[coverage-gate-039] stops for untrue coverage from a child process that a worker thread starts', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const workerSpawn = [
      "test('starts a child process from a worker', async () => {",
      "  const url = new URL('./math.js', import.meta.url).href;",
      "  const fake = `new Function(${JSON.stringify(`return 1;\\n//# sourceURL=${url}`)})();`;",
      "  const code = `const { spawnSync } = require('node:child_process'); const r = spawnSync(process.execPath, ['-e', ${JSON.stringify(fake)}], { env: { NODE_V8_COVERAGE: process.env.NODE_V8_COVERAGE } }); require('node:worker_threads').parentPort.postMessage(r.status);`;",
      '  const worker = new Worker(code, { eval: true });',
      "  const status = await new Promise((resolve) => worker.once('message', resolve));",
      '  await worker.terminate();',
      '  assert.equal(status, 0);',
      '});',
    ].join('\n');
    const imports = "import { add } from './math.js';\nimport { Worker } from 'node:worker_threads';";
    write(root, { 'src/math.test.mjs': MATH_TEST('adds two numbers', workerSpawn).replace("import { add } from './math.js';", imports) });
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-FAKE src\/math\.js/);
  });
});

test('[spec-trace-045] stops for changed scenario text when a test only moved to a renamed test file', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers') });
    passes(root, ['ratchet', '--change', 'add-demo']);
    mergeToMain(root, 'move');
    write(root, { 'openspec/changes/add-demo/specs/demo/spec.md': SPEC.replace('the result is 3', 'the result is three') });
    git(root, 'mv', 'src/math.test.mjs', 'src/sum.test.mjs');
    const moved = run(root, ['ratchet', '--change', 'add-demo']);
    assert.equal(moved.status, 1);
    assert.match(moved.output, /ERROR TRACE-ID-CHANGED-NO-TEST openspec\/changes\/add-demo\/specs\/demo\/spec\.md:7/);
    write(root, { 'src/sum.test.mjs': MATH_TEST('[demo-001] adds two numbers').replace('add(1, 2), 3', 'add(2, 1), 3') });
    passes(root, ['ratchet', '--change', 'add-demo']);
  });
});

test('[coverage-gate-043] stops the check for a code file that imports a test file', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, { 'src/helper.test.mjs': "import test from 'node:test';\nimport assert from 'node:assert/strict';\nexport const helper = 1;\ntest('helper', () => {\n  assert.ok(true);\n});\n", 'src/uses.js': "import { helper } from './helper.test.mjs';\nexport const uses = helper;\n" });
    git(root, 'add', '-A');
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR COVERAGE-TEST-IMPORT src\/uses\.js:1 Move the code out of the test file\. The gates do not measure test files\./);
  });
});

