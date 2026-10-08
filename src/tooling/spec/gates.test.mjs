import test from 'node:test';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, renameSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildTestRuns, childEnv, mergeRawCoverage, parseArgs, runGates } from '../../../scripts/spec/gates.mjs';
import { protectedInput } from '../../../scripts/spec/lib/measurement.mjs';
import { parseLcov, contentHash } from '../../../scripts/spec/lib/coverage.mjs';
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
  if (argv[0] === 'ratchet' && result.status === 2) {
    const errors = result.output.split('\n').filter(line => line.startsWith('ERROR '));
    assert.ok(errors.length > 0);
    assert.equal(errors.every(line => /^ERROR REVIEW-/.test(line)), true, result.output);
  } else {
    assert.equal(result.status, 0, result.output);
  }
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
  assert.deepEqual([main.output, main.rawOutput, main.args.slice(-2)], ['/out/tests-main.jsonl.sync', '/out/tests-main.jsonl', ['src/a.test.mjs', 'tools/b.test.mjs']]);
  assert.deepEqual(buildTestRuns({ testFiles: [], allocationFiles: [], outDir: '/out' }), []);
  withFixture((root) => {
    passes(root, ['init']);
    const raw = readFileSync(path.join(root, '.gev-cache/spec/tests-main.jsonl'), 'utf8');
    const sync = readFileSync(path.join(root, '.gev-cache/spec/tests-main.jsonl.sync'), 'utf8');
    assert.equal(sync, raw, 'the reporter\'s own synchronous write must match what Node\'s destination stream wrote');
    const files = raw.trim().split('\n').map((line) => JSON.parse(line).file);
    assert.deepEqual(files.sort(), ['src/math.test.mjs', 'tools/other.test.mjs']);
  });
});

test('[coverage-gate-007] runs the allocation tests alone with --expose-gc and no coverage', GUARDED_RUN, () => {
  const runs = buildTestRuns({ testFiles: ['src/a.test.mjs', 'src/alloc.test.mjs'], allocationFiles: ['src/alloc.test.mjs', 'src/other.test.mjs'], outDir: '/out' });
  assert.deepEqual(runs.map((item) => item.kind), ['main', 'allocation']);
  assert.equal(runs[0].args.includes('src/alloc.test.mjs'), false);
  assert.deepEqual(runs[1].args.slice(0, 3), ['--expose-gc', '--test', '--test-concurrency=1']);
  assert.equal(runs[1].args.includes('--experimental-test-coverage'), false);
  assert.deepEqual([runs[1].output, runs[1].rawOutput], ['/out/tests-allocation-0.jsonl.sync', '/out/tests-allocation-0.jsonl']);
  const probe = "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('allocation probe', () => {\n  assert.equal(typeof globalThis.gc, 'function');\n});\n";
  withFixture(
    (root) => {
      const result = passes(root, ['init'], { allocationFiles: ['src/alloc.test.mjs'] });
      const raw = readFileSync(path.join(root, '.gev-cache/spec/tests-allocation-0.jsonl'), 'utf8');
      const sync = readFileSync(path.join(root, '.gev-cache/spec/tests-allocation-0.jsonl.sync'), 'utf8');
      assert.match(raw, /"status":"pass"/);
      assert.equal(sync, raw, 'the reporter\'s own synchronous write must match what Node\'s destination stream wrote');
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

test('[gap-ledger-077] runs the ratchet command for an archived change', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, {
      'openspec/changes/archive/2026-09-16-add-demo/proposal.md': CHANGE['openspec/changes/add-demo/proposal.md'],
      'openspec/changes/archive/2026-09-16-add-demo/tasks.md': CHANGE['openspec/changes/add-demo/tasks.md'],
      'openspec/changes/archive/2026-09-16-add-demo/specs/demo/spec.md': CHANGE['openspec/changes/add-demo/specs/demo/spec.md'],
      'openspec/specs/demo/spec.md': `# demo Specification\n\n## Purpose\nAdd two numbers and give the result, so that the gates have a demo capability to check.\n\n${SPEC.replace('## ADDED Requirements', '## Requirements')}`,
      'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'),
    });
    // The init run recorded the test of src/math.test.mjs as untraced. The tag above removes it.
    const ledgerFile = path.join(root, 'openspec/trace/gaps.json');
    assert.ok(JSON.parse(readFileSync(ledgerFile, 'utf8')).untracedTests['src/math.test.mjs'], 'the first ledger has the untraced test');
    const result = passes(root, ['ratchet', '--change', 'add-demo']);
    assert.match(result.output, /Ratchet: \d+ history lines for add-demo\./);
    assert.ok(JSON.parse(readFileSync(path.join(root, 'openspec/trace/links.json'), 'utf8'))['demo-001']);
    assert.ok(JSON.parse(readFileSync(path.join(root, 'openspec/trace/ids.json'), 'utf8'))['demo-001']);
    assert.equal(JSON.parse(readFileSync(ledgerFile, 'utf8')).untracedTests['src/math.test.mjs'], undefined, 'the command writes the ledger again');
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

// 30 one-line functions, so the total of each metric is above 25 and the tolerance is 1.
const SHAPE_NAMES = Array.from({ length: 30 }, (unused, index) => `f${index}`);
const SHAPES = `${SHAPE_NAMES.map((name, index) => `export function ${name}() { return ${index}; }`).join('\n')}\n`;
const SHAPES_TEST = (called) =>
  [
    "import test from 'node:test';",
    "import assert from 'node:assert/strict';",
    `import { ${SHAPE_NAMES.join(', ')} } from './shapes.js';`,
    "test('measures shapes', () => {",
    ...SHAPE_NAMES.slice(0, called).map((name, index) => `  assert.equal(${name}(), ${index});`),
    ...SHAPE_NAMES.slice(called).map((name) => `  assert.equal(typeof ${name}, 'function');`),
    '});',
    '',
  ].join('\n');

test('[gap-ledger-069 gap-ledger-073] uses the tolerance of a file in the check and in the ratchet command', GUARDED_RUN, () => {
  const base = { 'src/shapes.js': SHAPES, 'src/shapes.test.mjs': SHAPES_TEST(29) };
  withFixture(
    (root) => {
      passes(root, ['init']);
      const entry = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/shapes.js'];
      assert.deepEqual([entry.functions, entry.totals.functions], [1, 30]);
      // One more function that no test calls: inside the tolerance of 1, so the gate does not stop.
      write(root, { 'src/shapes.test.mjs': SHAPES_TEST(28) });
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
    // The gate creates each run's own `.sync` result file empty before any test process
    // starts (see measure() in gates.mjs), so a run whose process never even produced
    // output is indistinguishable, by file existence alone, from one that ran and passed
    // nothing: both report through checkFailedRuns()'s message, not this shorter one.
    const failedRun = run(root, ['init'], { spawn: fakeRunner([{ status: 5, error: null }]) });
    assert.match(failedRun.output, /ERROR GATES-TEST-RUN The main test run stopped with status 5, but no test in its result file failed$/m);
    const brokenRun = run(root, ['init'], { spawn: fakeRunner([{ status: null, error: 'no node' }]) });
    assert.match(brokenRun.output, /ERROR GATES-TEST-RUN The main test run stopped with status null: no node$/m);
  });
});

test('[coverage-gate-035] stops for a failed test run without a failed test in its result file', () => {
  withFixture((root) => {
    const entry = (status) => JSON.stringify({ file: 'src/math.test.mjs', name: 'adds two numbers', title: 'adds two numbers', kind: 'test', status, tags: [], tagError: null, line: 4, column: 1, fullName: 'adds two numbers', leaf: true });
    const runner = (status, lines) => (command, args) => {
      writeFileSync(path.join(path.dirname(args[2]), 'tests-main.jsonl.sync'), lines.map((line) => `${line}\n`).join(''));
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
      "  const destination = `${option.slice(option.indexOf('=') + 1)}.sync`;",
      "  const record = { file: 'src/math.test.mjs', name: '[demo-001] adds two numbers', title: 'adds two numbers', kind: 'test', status: 'pass', tags: ['demo-002'], tagError: null, line: 5, fullName: '[demo-001] adds two numbers', leaf: true };",
      "  appendFileSync(destination, `${'\\n'.repeat(100000)}${JSON.stringify(record)}\\n`);",
      '  assert.ok(destination.endsWith(\'tests-main.jsonl.sync\'));',
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

test('[gap-ledger-053] stops the check and the ratchet command when the ledger file is not there', () => {
  withFixture((root) => {
    write(root, CHANGE);
    for (const argv of [['check'], ['ratchet', '--change', 'add-demo']]) {
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

const MATH_BRANCH_SRC = 'export function add(a, b) {\n  if (a < 0) return 0;\n  return a + b;\n}\n';

function withWaiverFixture(body) {
  return withFixture(
    (root) => {
      passes(root, ['init']);
      mergeToMain(root, 'waiver-work');
      return body(root);
    },
    { base: { 'src/math.js': MATH_BRANCH_SRC } },
  );
}

test('[gap-ledger-079] records a coverage waiver, allows the rise in the ratchet command and passes the check', GUARDED_RUN, () => {
  withWaiverFixture((root) => {
    write(root, {
      ...CHANGE,
      'src/math.js': 'export function add(a, b) {\n  if (a < 0) return 0;\n  if (b < 0) return 0;\n  return a + b;\n}\n',
      'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'),
    });
    // A commit on the work branch makes the head commit differ from the base commit.
    commitAll(root, 'work on add-demo');

    // Running ratchet command without waiver stops with LEDGER-LARGER-GAP.
    const withoutWaiver = run(root, ['ratchet', '--change', 'add-demo']);
    assert.equal(withoutWaiver.status, 1);
    assert.match(withoutWaiver.output, /LEDGER-LARGER-GAP src\/math\.js has 2 branches not covered\. The ledger allows 1\./);

    // Run waive command. It runs no test and does not change the ledger file.
    const ledgerBefore = readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8');
    const historyFile = path.join(root, 'openspec/trace/history.jsonl');
    const historyBefore = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : '';
    const waiveResult = passes(root, ['waive', '--change', 'add-demo', '--file', 'src/math.js', '--metric', 'branches', '--lines', '3', '--count', '1', '--reason', 'phantom branch']);
    assert.match(waiveResult.output, /Gates passed\./);
    assert.doesNotMatch(waiveResult.output, /Trace:/, 'the waive command runs no test');
    assert.equal(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'), ledgerBefore, 'the waive command does not change openspec/trace/gaps.json');

    // Read history line and assert all required fields.
    const historyText = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8');
    assert.ok(historyText.startsWith(historyBefore), 'the waive command only appends');
    const added = historyText.slice(historyBefore.length).trim().split('\n').map(JSON.parse);
    assert.equal(added.length, 1, 'the waive command adds exactly one line');
    const [waiver] = added;
    assert.equal(waiver.kind, 'waiver');
    assert.equal(waiver.date, '2026-09-13');
    assert.equal(waiver.change, 'add-demo');
    assert.equal(waiver.kind, 'waiver');
    assert.equal(waiver.file, 'src/math.js');
    assert.equal(waiver.metric, 'branches');
    assert.equal(waiver.commit, git(root, 'rev-parse', 'HEAD'));
    assert.notEqual(waiver.commit, git(root, 'merge-base', 'HEAD', 'main'));
    assert.match(waiver.sha, /^[0-9a-f]{64}$/);
    assert.deepEqual(waiver.lines, [3]);
    assert.equal(waiver.count, 1);
    assert.equal(waiver.reason, 'phantom branch');

    // Before the ratchet, the check reads the waiver: the rise is allowed, and the entry is only not current.
    reviewFor(root, 'add-demo');
    const beforeRatchet = run(root, ['check', '--change', 'add-demo']);
    assert.doesNotMatch(beforeRatchet.output, /LEDGER-LARGER-GAP/);
    assert.match(beforeRatchet.output, /LEDGER-STALE/);

    // Ratchet command with waiver passes.
    passes(root, ['ratchet', '--change', 'add-demo']);

    // Check with change name passes.
    reviewFor(root, 'add-demo');
    passes(root, ['check', '--change', 'add-demo']);
  });
});

test('[gap-ledger-080] stops the waive command for a fault in its options', GUARDED_RUN, () => {
  withWaiverFixture((root) => {
    write(root, {
      ...CHANGE,
      'src/math.js': 'export function add(a, b) {\n  if (a < 0) return 0;\n  if (b < 0) return 0;\n  return a + b;\n}\n',
      'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'),
    });
    const historyFile = path.join(root, 'openspec/trace/history.jsonl');
    const historyBefore = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : null;

    // 1. Change not active
    const fault1 = run(root, ['waive', '--change', 'inactive', '--file', 'src/math.js', '--metric', 'branches', '--lines', '3', '--count', '1', '--reason', 'test']);
    assert.equal(fault1.status, 1);
    assert.match(fault1.output, /ERROR GATES-WAIVE src\/math\.js Change "inactive" has no folder with a proposal\.md file/);

    const absentFile = run(root, ['waive', '--change', 'add-demo', '--metric', 'branches', '--lines', '3', '--count', '1', '--reason', 'test']);
    assert.equal(absentFile.status, 1);
    assert.match(absentFile.output, /ERROR GATES-WAIVE Git does not track undefined/);

    // 2. File not tracked
    const fault2 = run(root, ['waive', '--change', 'add-demo', '--file', 'src/missing.js', '--metric', 'branches', '--lines', '3', '--count', '1', '--reason', 'test']);
    assert.equal(fault2.status, 1);
    assert.match(fault2.output, /ERROR GATES-WAIVE src\/missing\.js Git does not track src\/missing\.js/);

    // 3. File with base content
    const fault3 = run(root, ['waive', '--change', 'add-demo', '--file', 'tools/other.test.mjs', '--metric', 'branches', '--lines', '3', '--count', '1', '--reason', 'test']);
    assert.equal(fault3.status, 1);
    assert.match(fault3.output, /ERROR GATES-WAIVE tools\/other\.test\.mjs tools\/other\.test\.mjs has the base content/);

    // 4. Unknown metric
    const fault4 = run(root, ['waive', '--change', 'add-demo', '--file', 'src/math.js', '--metric', 'unknown', '--lines', '3', '--count', '1', '--reason', 'test']);
    assert.equal(fault4.status, 1);
    assert.match(fault4.output, /ERROR GATES-WAIVE src\/math\.js Unknown metric "unknown"/);

    // 5. Line not a positive whole number
    const fault5 = run(root, ['waive', '--change', 'add-demo', '--file', 'src/math.js', '--metric', 'branches', '--lines', '0', '--count', '1', '--reason', 'test']);
    assert.equal(fault5.status, 1);
    assert.match(fault5.output, /ERROR GATES-WAIVE src\/math\.js Line "0" is not a positive whole number/);

    // 5b. --lines not given at all
    const fault5b = run(root, ['waive', '--change', 'add-demo', '--file', 'src/math.js', '--metric', 'branches', '--count', '1', '--reason', 'test']);
    assert.equal(fault5b.status, 1);
    assert.match(fault5b.output, /ERROR GATES-WAIVE src\/math\.js Line "undefined" is not a positive whole number/);

    // 6. Count not a positive whole number
    const fault6 = run(root, ['waive', '--change', 'add-demo', '--file', 'src/math.js', '--metric', 'branches', '--lines', '3', '--count', '0', '--reason', 'test']);
    assert.equal(fault6.status, 1);
    assert.match(fault6.output, /ERROR GATES-WAIVE src\/math\.js Count "0" is not a positive whole number/);

    // 7. Empty reason
    const fault7 = run(root, ['waive', '--change', 'add-demo', '--file', 'src/math.js', '--metric', 'branches', '--lines', '3', '--count', '1', '--reason', '   ']);
    assert.equal(fault7.status, 1);
    assert.match(fault7.output, /ERROR GATES-WAIVE src\/math\.js Reason is empty/);

    // Assert history file was not changed
    const historyAfter = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : null;
    assert.equal(historyAfter, historyBefore);
  });
});

test('[coverage-gate-048] exits a test run that leaves a live timer', () => {
  const runs = buildTestRuns({ testFiles: ['src/a.test.mjs', 'src/alloc.test.mjs'], allocationFiles: ['src/alloc.test.mjs'], outDir: '/out' });
  assert.equal(runs[0].args.includes('--test-force-exit'), true);
  assert.equal(runs[1].args.includes('--test-force-exit'), true);

  const root = mkdtempSync(path.join(tmpdir(), 'gev-force-exit-'));
  const outDir = path.join(root, 'out');
  mkdirSync(outDir, { recursive: true });
  const testFile = path.join(root, 'leak.test.mjs');
  writeFileSync(
    testFile,
    "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('fails and leaks', () => {\n  setInterval(() => {}, 1000);\n  assert.equal(1, 2);\n});\n",
  );
  try {
    const [mainRun] = buildTestRuns({ testFiles: [testFile], allocationFiles: [], outDir });
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    // A real gate run sets GEV_SPEC_OUT on this test's own process, and this process's
    // own guard wraps child_process globally. withGuardEnv() (test-guard.mjs) always adds
    // the guard preload to NODE_OPTIONS when NODE_V8_COVERAGE is present, but only
    // re-injects its own closed-over GEV_SPEC_OUT when the child's NODE_V8_COVERAGE points
    // at the real gate's own coverage folder. Give this spawn its own coverage folder so
    // that check is false: real coverage still collects for this run's own fixture and
    // preloads, isolated from the real gate run, and the injected preload finds an empty
    // GEV_SPEC_OUT and installs nothing — so this fixture's deliberate leak lands only in
    // this test's own outDir, never the real gate run's.
    const coverageDir = path.join(root, 'coverage');
    mkdirSync(coverageDir, { recursive: true });
    env.NODE_V8_COVERAGE = coverageDir;
    env.GEV_SPEC_OUT = '';
    env.GEV_SPEC_ROOT = '';
    env.GEV_SPEC_INVENTORY = '';
    const result = spawnSync(process.execPath, mainRun.args, { env, timeout: 30_000, encoding: 'utf8' });
    assert.equal(result.status, 1);
    // Real coverage still ran, isolated from the real gate's own coverage folder: V8
    // itself writes one or more coverage-*.json files there whenever NODE_V8_COVERAGE
    // names a real directory, independent of this project's own guard.
    assert.ok(readdirSync(coverageDir).some((file) => file.startsWith('coverage-')), 'the isolated coverage folder must hold real V8 coverage output');
    // Read mainRun.output, the `.sync` file: measure() reads this file, not the raw
    // destination, because a forced exit can end the process before Node's own
    // destination stream flushes. See the "Trace record durability" requirement.
    const jsonl = readFileSync(mainRun.output, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    assert.equal(jsonl.length, 1);
    assert.equal(jsonl[0].file, path.relative(process.cwd(), testFile).split(path.sep).join('/'));
    assert.equal(jsonl[0].fullName, 'fails and leaks');
    assert.equal(jsonl[0].status, 'fail');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[coverage-gate-049] stops for a test that leaves a live timer', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const stub = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(
        path.join(root, '.gev-cache/spec/guard-999.jsonl'),
        `${JSON.stringify({ violations: [], checked: [], assertions: [], leaks: [{ file: 'src/math.test.mjs', resources: ['Timeout'] }] })}\n`,
      );
      return result;
    };
    const check = run(root, ['check'], { spawn: stub });
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR GATES-TEST-LEAK src\/math\.test\.mjs/);
    assert.doesNotMatch(check.output, /COVERAGE-FAKE/);
    assert.match(check.output, /0 untrue/);
  });
});

test('[coverage-gate-050] does not stop for a test process without a live timer', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    const stub = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(
        path.join(root, '.gev-cache/spec/guard-999.jsonl'),
        `${JSON.stringify({ violations: [], checked: [], assertions: [], leaks: [] })}\n`,
      );
      return result;
    };
    const check = run(root, ['check'], { spawn: stub });
    assert.equal(check.status, 0);
    assert.doesNotMatch(check.output, /GATES-TEST-LEAK/);
  });
});

test('[coverage-gate-049] stops for a real child process that leaves a live timer, with no stub', GUARDED_RUN, () => {
  withFixture((root) => {
    passes(root, ['init']);
    write(root, { 'src/leaky.test.mjs': "import test from 'node:test';\ntest('passes and leaves a timer live', () => {\n  setInterval(() => {}, 1000);\n});\n" });
    commitAll(root, 'add a leaky test');
    const check = run(root, ['check']);
    assert.equal(check.status, 1);
    assert.match(check.output, /ERROR GATES-TEST-LEAK src\/leaky\.test\.mjs/);
    // The guard's leak record is not a `violation`: untrueFiles() must not read it, so
    // this real leaky test process does not cost src/math.js its true coverage.
    assert.doesNotMatch(check.output, /COVERAGE-FAKE/);
    assert.match(check.output, /0 untrue/);
  });
});

const UNIT_TEST = (module, name, extra = '') =>
  ["import test from 'node:test';", "import assert from 'node:assert/strict';", `import { ${module} } from './${module}.js';`, `test('${name}', () => {`, `  assert.equal(${module}(1), 1);`, '});', extra, ''].join('\n');
const BRANCH_SRC = (name, extra = '') => `export function ${name}(a) {\n  if (a < 0) return 0;\n${extra}  return a;\n}\n`;
const SYNC_CHANGE = {
  'openspec/changes/sync/proposal.md': '## Why\n\nThe merge brings code with gaps, so that the gates have a change to check.\n\n## What Changes\n\n- Merge the branch.\n',
  'openspec/changes/sync/tasks.md': '## 1. Merge\n\n- [ ] 1.1 Merge the branch.\n',
};

/**
 * A base commit on main with a ledger, a branch `up` that adds code with gaps, and a work branch that merges `up`.
 * The merge commit is the head. The work branch also adds its own files with gaps. The working tree keeps the base
 * content of `src/legacy.js`, which `up` changed.
 */
function withMergeFixture(body, base = {}, upstream = {}, options = {}) {
  return withFixture(
    (root) => {
      passes(root, ['init'], options);
      commitAll(root, 'ledger');
      git(root, 'checkout', '-q', 'main');
      git(root, 'merge', '-q', '--ff-only', 'work');
      git(root, 'checkout', '-q', '-b', 'up');
      write(root, {
        'src/merged.js': BRANCH_SRC('merged'),
        'src/merged.test.mjs': UNIT_TEST('merged', 'runs merged'),
        'src/legacy.js': BRANCH_SRC('legacy', '  if (a > 9) return 9;\n'),
        'src/math.test.mjs': MATH_TEST('adds two numbers', "test('adds negative numbers', () => {\n  assert.equal(add(-1, -2), -3);\n});"),
      });
      write(root, upstream);
      commitAll(root, 'upstream work');
      git(root, 'checkout', '-q', 'work');
      write(root, { ...SYNC_CHANGE, 'src/own.js': BRANCH_SRC('own'), 'src/own.test.mjs': UNIT_TEST('own', 'runs own') });
      commitAll(root, 'own work');
      git(root, 'merge', '-q', '--no-ff', '-m', 'merge up', 'up');
      git(root, 'checkout', '-q', 'main', '--', 'src/legacy.js');
      return body(root);
    },
    { base: { 'src/legacy.js': BRANCH_SRC('legacy'), 'src/legacy.test.mjs': UNIT_TEST('legacy', 'runs legacy'), ...base } },
  );
}

const ADOPT_LINE = (root, file, extra) => ({ date: '2026-09-13', change: 'sync', commit: git(root, 'rev-parse', 'HEAD'), kind: 'adopt', file, from: git(root, 'rev-parse', 'up'), ...extra });
const historyLines = (root, from = 0) =>
  readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8')
    .slice(from)
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));

test('[gap-ledger-089 gap-ledger-091] adopts the gaps of the merged files and gives no error in the ratchet command and in the check', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    const ledgerFile = path.join(root, 'openspec/trace/gaps.json');
    const before = JSON.parse(readFileSync(ledgerFile, 'utf8'));
    assert.deepEqual(parseArgs(['adopt', '--change', 'sync', '--from', 'up']), { command: 'adopt', change: 'sync', base: undefined, root: undefined, from: 'up' });

    // A failed test stops the command before it writes.
    const historyFile = path.join(root, 'openspec/trace/history.jsonl');
    const historyBefore = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : null;
    write(root, { 'src/broken.test.mjs': "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('fails', () => {\n  assert.equal(1, 2);\n});\n" });
    git(root, 'add', 'src/broken.test.mjs');
    const broken = run(root, ['adopt', '--change', 'sync', '--from', 'up']);
    assert.equal(broken.status, 1, broken.output);
    assert.match(broken.output, /ERROR TRACE-FAILED-TEST src\/broken\.test\.mjs/);
    assert.equal(readFileSync(ledgerFile, 'utf8'), JSON.stringify(before, null, 2) + '\n', 'the command does not write the ledger');
    assert.equal(existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : null, historyBefore, 'the command does not write the history');
    git(root, 'rm', '-q', '-f', 'src/broken.test.mjs');

    const traceFile = (name) => (existsSync(path.join(root, 'openspec/trace', name)) ? readFileSync(path.join(root, 'openspec/trace', name), 'utf8') : null);
    const registryBefore = [traceFile('ids.json'), traceFile('links.json')];
    const result = passes(root, ['adopt', '--change', 'sync', '--from', 'up']);
    assert.match(result.output, /Adopt: 3 files from [0-9a-f]{40}\./);
    assert.deepEqual([traceFile('ids.json'), traceFile('links.json')], registryBefore, 'the command does not change the registry or the links');
    assert.notEqual(git(root, 'rev-parse', 'up'), git(root, 'rev-parse', 'HEAD'));
    const none = { lines: null, branches: null, functions: null, untrue: false };
    const added = historyLines(root).sort((a, b) => a.file.localeCompare(b.file));
    assert.deepEqual(added, [
      ADOPT_LINE(root, 'src/math.test.mjs', { ...none, untraced: 2 }),
      ADOPT_LINE(root, 'src/merged.js', { lines: 0, branches: 1, functions: 0, untraced: 0, untrue: false }),
      ADOPT_LINE(root, 'src/merged.test.mjs', { ...none, untraced: 1 }),
    ]);

    const ledger = JSON.parse(readFileSync(ledgerFile, 'utf8'));
    assert.equal(ledger.coverage['src/merged.js'].origin, 'sync');
    assert.equal(ledger.coverage['src/merged.js'].branches, 1);
    assert.deepEqual(ledger.coverage['src/legacy.js'], before.coverage['src/legacy.js'], 'the file with the base content is not adopted');
    assert.equal(ledger.coverage['src/own.js'], undefined, 'the merged commit did not change src/own.js');
    assert.deepEqual(Object.keys(ledger.untracedTests['src/math.test.mjs'].names).sort(), ['adds negative numbers', 'adds two numbers']);
    assert.equal(ledger.untracedTests['src/math.test.mjs'].origin, 'pre-spec', 'an entry that exists keeps its origin');
    assert.equal(ledger.untracedTests['src/merged.test.mjs'].origin, 'sync');
    assert.equal(ledger.untracedTests['src/own.test.mjs'], undefined);

    // The check stops for the gaps of the work branch and for no adopted gap.
    const stops = run(root, ['check', '--change', 'sync']);
    const errors = stops.output.split('\n').filter((line) => line.startsWith('ERROR'));
    assert.ok(errors.some((line) => line.startsWith('ERROR LEDGER-NEW-COVERAGE-GAP src/own.js')), stops.output);
    assert.ok(errors.some((line) => line.startsWith('ERROR LEDGER-NEW-UNTRACED src/own.test.mjs')), stops.output);
    assert.deepEqual(errors.filter((line) => /merged|math\.test|legacy/.test(line)), []);

    rmSync(path.join(root, 'src/own.js'));
    rmSync(path.join(root, 'src/own.test.mjs'));
    passes(root, ['ratchet', '--change', 'sync']);
    reviewFor(root, 'sync');
    passes(root, ['check', '--change', 'sync']);
  });
});

test('[gap-ledger-090] stops the adopt command for a fault before it runs a test', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    const ledgerFile = path.join(root, 'openspec/trace/gaps.json');
    const historyFile = path.join(root, 'openspec/trace/history.jsonl');
    const ledgerText = readFileSync(ledgerFile, 'utf8');
    const historyText = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : null;
    const fault = (argv, message) => {
      const result = run(root, ['adopt', ...argv]);
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, message);
      assert.doesNotMatch(result.output, /Trace:/, 'the adopt command runs no test for a fault');
    };
    fault(['--change', 'nope', '--from', 'up'], /ERROR GATES-ADOPT Change "nope" has no folder with a proposal\.md file/);
    assert.equal(readFileSync(ledgerFile, 'utf8'), ledgerText, 'a fault does not change the ledger');
    fault(['--from', 'up'], /ERROR GATES-ADOPT Change "undefined" has no folder/);
    fault(['--change', 'sync'], /ERROR GATES-ADOPT The adopt command needs --from with the merged commit/);
    fault(['--change', 'sync', '--from', 'nope'], /ERROR GATES-ADOPT Git cannot find the commit nope/);
    fault(['--change', 'sync', '--from', 'main'], /ERROR GATES-ADOPT The commit main is not a merged commit\./);
    fault(['--change', 'sync', '--from', 'HEAD^1'], /ERROR GATES-ADOPT The commit HEAD\^1 is not a merged commit\./);
    assert.equal(readFileSync(ledgerFile, 'utf8'), ledgerText, 'a fault does not change the ledger');
    rmSync(ledgerFile);
    fault(['--change', 'sync', '--from', 'up'], /ERROR GATES-ADOPT openspec\/trace\/gaps\.json is not there/);
    assert.equal(existsSync(ledgerFile), false, 'a fault does not write the ledger');
    writeFileSync(ledgerFile, ledgerText);
    assert.equal(existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : null, historyText, 'the command does not change the history');
  });
});

test('[gap-ledger-096 gap-ledger-097] stops the check for an adopt line when its commit is not a merged commit, or when the merged commit did not change its file', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    passes(root, ['adopt', '--change', 'sync', '--from', 'up']);
    const ledgerFile = path.join(root, 'openspec/trace/gaps.json');
    const ledger = JSON.parse(readFileSync(ledgerFile, 'utf8'));
    // The work branch changed src/own.js, and `up` did not. The entry below needs an adopted count that no valid line gives.
    ledger.coverage['src/own.js'] = { loaded: true, lines: 0, branches: 1, functions: 0, totals: { lines: 4, branches: 2, functions: 1 }, sha: 'x', untrue: false, origin: 'sync', since: '2026-09-13' };
    writeFileSync(ledgerFile, `${JSON.stringify(ledger, null, 2)}\n`);
    const counts = { lines: 0, branches: 1, functions: 0, untraced: 0, untrue: false };
    // The line for src/merged.js has a commit that is not a merged commit and a negative count, which gap-ledger-095 rejects. It gives no error of its own.
    const rejected = ADOPT_LINE(root, 'src/merged.js', { ...counts, lines: -1, from: git(root, 'rev-parse', 'main') });
    appendFileSync(
      path.join(root, 'openspec/trace/history.jsonl'),
      [ADOPT_LINE(root, 'src/math.js', { ...counts, from: git(root, 'rev-parse', 'main') }), ADOPT_LINE(root, 'src/own.js', counts), rejected].map((line) => `${JSON.stringify(line)}\n`).join(''),
    );
    const check = run(root, ['check', '--change', 'sync']);
    assert.equal(check.status, 1);
    assert.match(check.output, new RegExp(`ERROR LEDGER-ADOPT-FROM src/math\\.js The adopt line for src/math\\.js names the commit ${git(root, 'rev-parse', 'main')}, and no merge commit`));
    assert.match(check.output, /ERROR LEDGER-ADOPT-FILE src\/own\.js The adopt line for src\/own\.js names the commit [0-9a-f]{40}, and that commit did not change src\/own\.js/);
    assert.match(check.output, /ERROR LEDGER-NOT-IN-BASE src\/own\.js The ledger entry for src\/own\.js is not in the base ledger/, 'the line with a file that the commit did not change gives no adopted count');
    assert.doesNotMatch(check.output, /LEDGER-ADOPT-[A-Z]+ src\/merged\.js/, 'a line that gap-ledger-095 rejects gives no adopt error');
  });
});

const QA_HEADER = (covers) => `/**\n * @purpose Prove that the layer works.\n * @covers ${covers}\n * @run node scripts/qa-example.mjs\n * @needs A browser and a server.\n */\nexport {};\n`;

test('[qa-scripts-024] stops the gate for a QA header error', GUARDED_RUN, () => {
  withFixture((root) => {
    write(root, { 'scripts/qa-example.mjs': 'export {};\n' });
    git(root, 'add', 'scripts/qa-example.mjs');
    const result = run(root, ['check']);
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR QA-HEADER scripts\/qa-example\.mjs/);
    assert.match(result.output, /scripts\/qa-example\.mjs: add one first block/);
    assert.match(result.output, /Coverage: [0-9]+ files, [0-9]+ complete, [1-9][0-9]* not loaded/);
  });
});

test('[qa-scripts-025] stops for both covers errors and omits scripts with valid QA headers', GUARDED_RUN, () => {
  withFixture((root) => {
    write(root, {
      'scripts/qa-example.mjs': QA_HEADER('unknown,pending:landed'),
      'openspec/specs/landed/spec.md': '## Requirements\n\n### Requirement: Landed\nThis area MUST work.\nOrigin: backfill\n',
    });
    git(root, 'add', 'scripts/qa-example.mjs', 'openspec/specs/landed/spec.md');
    const result = run(root, ['check']);
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR QA-COVERS-UNKNOWN scripts\/qa-example\.mjs/);
    assert.match(result.output, /ERROR QA-COVERS-LANDED scripts\/qa-example\.mjs/);
    assert.match(result.output, /Coverage: 1 files,/);
  });
});

test('[qa-scripts-016] prints QA advice after Trace', GUARDED_RUN, () => {
  withFixture((root) => {
    write(root, {
      'scripts/qa-example.mjs': QA_HEADER('demo'),
      'openspec/changes/add-demo/specs/demo/spec.md': SPEC,
      'openspec/specs/demo/spec.md': SPEC.replace('## ADDED Requirements', '## Requirements'),
    });
    git(root, 'add', 'scripts/qa-example.mjs', 'openspec/specs/demo/spec.md');
    const result = run(root, ['check', '--change', 'add-demo']);
    assert.match(result.output, /Trace: [^\n]+\nQA: scripts\/qa-example\.mjs covers demo: Prove that the layer works\./);
  });
});

test('[qa-scripts-014] keeps the coverage gap for a QA script with a bad header', GUARDED_RUN, () => {
  withFixture((root) => {
    const openSpec = (_root, args) => ({ status: 0, error: null, stdout: args[0] === '--version' ? '1.3.1\n' : '{"items":[]}' });
    const initial = run(root, ['init'], { openSpec });
    assert.equal(initial.status, 0, initial.output);
    write(root, { 'scripts/qa-example.mjs': 'export {};\n' });
    git(root, 'add', 'scripts/qa-example.mjs');
    const result = run(root, ['check'], { openSpec });
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR QA-HEADER scripts\/qa-example\.mjs/);
    assert.match(result.output, /ERROR LEDGER-NEW-COVERAGE-GAP scripts\/qa-example\.mjs/);
  });
});

test('[gap-ledger-100 gap-ledger-104 gap-ledger-106] The command and gate allow a reached file with the base content', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    const stub = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ violations: [{ file: 'src/legacy.js' }], checked: [], assertions: [], leaks: [] }) + '\n');
      return result;
    };
    passes(root, ['adopt', '--change', 'sync', '--from', 'up'], { spawn: stub });
    const ledger = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'));
    assert.deepEqual(ledger.coverage['src/legacy.js'], { loaded: false, lines: 4, branches: null, functions: null, totals: { lines: 4, branches: null, functions: null }, sha: 'a375defeef081c39e15e8d4581da7b3da6bca0af070a8bf501b029762b70c3df', untrue: true, origin: 'pre-spec', since: '2026-09-13' });
    const line = historyLines(root).find((item) => item.file === 'src/legacy.js');
    assert.deepEqual(line, { date: '2026-09-13', change: 'sync', commit: git(root, 'rev-parse', 'HEAD'), kind: 'adopt', file: 'src/legacy.js', from: git(root, 'rev-parse', 'up'), lines: 4, branches: null, functions: null, untraced: 0, untrue: true, reached: true });
    const check = run(root, ['check', '--change', 'sync'], { spawn: stub });
    assert.doesNotMatch(check.output, /ERROR [A-Z-]+ src\/legacy\.js/);
    assert.doesNotMatch(check.output, /ERROR LEDGER-TOTALS-NOT-BASE src\/legacy\.js/);
    // A later source edit breaks the reached condition without a new measurement fault.
    write(root, { 'src/legacy.js': BRANCH_SRC('legacy', '  if (a > 9) return 9;\n') });
    assert.match(run(root, ['check', '--change', 'sync'], { spawn: stub }).output, /ERROR LEDGER-ADOPT-REACHED src\/legacy\.js/);
  }, {}, { 'src/merged.js': "import './legacy.js';\n" + BRANCH_SRC('merged') });
});

test('[gap-ledger-107] The command writes no entry for a file that only base edges reach', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    const stub = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ violations: [{ file: 'src/leaf.js' }], checked: [], assertions: [], leaks: [] }) + '\n');
      return result;
    };
    const before = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/leaf.js'];
    passes(root, ['adopt', '--change', 'sync', '--from', 'up'], { spawn: stub });
    assert.deepEqual(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/leaf.js'], before);
    assert.equal(historyLines(root).some((line) => line.file === 'src/leaf.js'), false);
    appendFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify(ADOPT_LINE(root, 'src/leaf.js', { lines: 4, branches: null, functions: null, untraced: 0, untrue: true, reached: true })) + '\n');
    assert.match(run(root, ['check', '--change', 'sync'], { spawn: stub }).output, /ERROR LEDGER-ADOPT-REACHED src\/leaf\.js/);
  }, { 'src/legacy.js': "import './leaf.js';\n" + BRANCH_SRC('legacy'), 'src/leaf.js': BRANCH_SRC('leaf'), 'src/leaf.test.mjs': UNIT_TEST('leaf', 'runs leaf') });
});

test('[gap-ledger-108] The command and gate allow a path with a new middle edge', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    const stub = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ violations: [{ file: 'src/leaf.js' }], checked: [], assertions: [], leaks: [] }) + '\n');
      return result;
    };
    passes(root, ['adopt', '--change', 'sync', '--from', 'up'], { spawn: stub });
    const entry = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/leaf.js'];
    assert.equal(entry.untrue, true);
    assert.equal(entry.lines, 4);
    assert.equal(historyLines(root).find((line) => line.file === 'src/leaf.js').reached, true);
    assert.doesNotMatch(run(root, ['check', '--change', 'sync'], { spawn: stub }).output, /ERROR [A-Z-]+ src\/leaf\.js/);
  }, {
    'src/legacy.js': "import './mid.js';\n" + BRANCH_SRC('legacy'),
    'src/mid.js': BRANCH_SRC('mid'), 'src/mid.test.mjs': UNIT_TEST('mid', 'runs mid'),
    'src/next.js': "import './leaf.js';\n" + BRANCH_SRC('next'), 'src/next.test.mjs': UNIT_TEST('next', 'runs next'),
    'src/leaf.js': BRANCH_SRC('leaf'), 'src/leaf.test.mjs': UNIT_TEST('leaf', 'runs leaf'),
  }, { 'src/mid.js': "import './next.js';\n" + BRANCH_SRC('mid') });
});

test('[gap-ledger-109] The command writes no entry for an edge that only HEAD has', GUARDED_RUN, () => {
  withMergeFixture((root) => {
    write(root, { 'src/merged.js': "import './legacy.js';\n" + BRANCH_SRC('merged') });
    const stub = (command, args, options) => {
      const result = spawnSync(command, args, options);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ violations: [{ file: 'src/legacy.js' }], checked: [], assertions: [], leaks: [] }) + '\n');
      return result;
    };
    const before = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/legacy.js'];
    passes(root, ['adopt', '--change', 'sync', '--from', 'up'], { spawn: stub });
    assert.deepEqual(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/legacy.js'], before);
    assert.equal(historyLines(root).some((line) => line.file === 'src/legacy.js'), false);
    appendFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify(ADOPT_LINE(root, 'src/legacy.js', { lines: 4, branches: null, functions: null, untraced: 0, untrue: true, reached: true })) + '\n');
    const result = run(root, ['check', '--change', 'sync'], { spawn: stub });
    assert.equal(result.status, 1);
    assert.match(result.output, /ERROR LEDGER-ADOPT-REACHED src\/legacy\.js/);
  });
});

test('[coverage-gate-064 coverage-gate-065] The gate assigns raw coverage and replaces loaded values', () => {
  withFixture((root) => {
    const calls = [];
    const fakeSpawn = (command, args, options) => {
      const runs = JSON.parse(readFileSync(args[1], 'utf8'));
      calls.push(runs);
      const directory = path.dirname(args[1]);
      writeFileSync(args[2], JSON.stringify(runs.map(() => ({ status: 0, error: null }))));
      writeFileSync(path.join(directory, 'lcov.info'), `SF:${root}/src/math.js\nLF:3\nLH:0\nBRF:1\nBRH:0\nFNF:1\nFNH:0\nend_of_record\nSF:${root}/unloaded.js\nLF:7\nLH:0\nend_of_record\n`);
      const raw = runs[0].env.NODE_V8_COVERAGE;
      assert.equal(raw.startsWith(path.join(tmpdir(), 'gev-spec-v8-')), true);
      assert.equal(raw.startsWith(root + path.sep), false);
      mkdirSync(raw, { recursive: true });
      const fn = { functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: 45, count: 1 }] };
      writeFileSync(path.join(raw, 'coverage-1-1-0.json'), JSON.stringify({ result: [{ url: pathToFileURL(path.join(root, 'src/math.js')).href, functions: [fn] }, { url: pathToFileURL(path.join(root, 'src/math.test.mjs')).href, functions: [fn] }, { url: 'node:fs', functions: [fn] }, { url: 'file:///outside.js', functions: [fn] }, { url: pathToFileURL(path.join(root, 'node_modules/a.js')).href, functions: [fn] }, { url: pathToFileURL(path.join(root, 'src/math.js')).href + '?node-test-mock=1', functions: [fn] }] }));
      return { status: 0 };
    };
    const result = run(root, ['init'], { spawn: fakeSpawn, allocationFiles: ['tools/other.test.mjs'], env: { A: 'value', NODE_V8_COVERAGE: '/wrong' }, openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : '{"items":[]}' }) });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0].env.NODE_V8_COVERAGE.startsWith(path.join(tmpdir(), 'gev-spec-v8-')), true);
    assert.equal(calls[0][0].env.NODE_V8_COVERAGE.startsWith(root + path.sep), false);
    assert.equal(Object.hasOwn(calls[0][0].env, 'NODE_V8_COVERAGE'), true);
    assert.equal(Object.hasOwn(calls[0][1], 'env'), false);
    assert.deepEqual(Object.keys(calls[0][0].env), ['NODE_V8_COVERAGE']);
    assert.equal(Object.hasOwn(JSON.parse(readFileSync(path.join(root, '.gev-cache/spec/runs.json'), 'utf8'))[0].env, 'A'), false);
    const lcov = readFileSync(path.join(root, '.gev-cache/spec/lcov.info'), 'utf8');
    assert.match(lcov, /LF:3\nLH:3\nBRF:1\nBRH:1\nFNF:0\nFNH:0/);
    assert.match(lcov, /unloaded\.js\nLF:7\nLH:0\nend_of_record/);
    assert.doesNotMatch(lcov, /SF:.*math\.test|SF:.*outside|SF:.*node_modules/);
    assert.doesNotMatch(result.output, /COVERAGE-EXTRA-RESULT/);
  });
});

test('[gap-ledger-111 gap-ledger-115] The command rejects an absent condition before tests', () => {
  withFixture((root) => {
    const proposal = 'openspec/changes/gates-coverage-race/proposal.md';
    write(root, { [proposal]: '## Why\n\nThe values must agree.\n', 'openspec/trace/gaps.json': '{"version":4,"coverage":{},"untracedTests":{}}\n' });
    let calls = 0;
    const spawn = () => { calls += 1; return { status: 9 }; };
    for (const args of [['rebaseline'], ['rebaseline', '--change', 'other'], ['rebaseline', '--change', 'gates-coverage-race']]) {
      assert.match(run(root, args, { spawn }).output, /GATES-REBASELINE/);
    }
    write(root, { 'scripts/spec/lib/v8-merge.mjs': 'export {};\n' });
    git(root, 'add', 'scripts/spec/lib/v8-merge.mjs');
    write(root, { 'openspec/trace/history.jsonl': '{"kind":"rebaseline","change":"gates-coverage-race"}\n' });
    assert.match(run(root, ['rebaseline', '--change', 'gates-coverage-race'], { spawn }).output, /already records its baseline step/);
    assert.equal(calls, 0);
    assert.equal(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'), '{"version":4,"coverage":{},"untracedTests":{}}\n');
  });
});

test('[gap-ledger-110 gap-ledger-113 gap-ledger-115] The command records one step and keeps data after a test error', () => {
  const baseLedger = { version: 4, coverage: { 'src/math.js': { loaded: true, sha: '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d', untrue: false, lines: 1, branches: 0, functions: 0, totals: { lines: 3, branches: 1, functions: 1 }, origin: 'pre-spec', since: '2026-01-01' } }, untracedTests: {} };
  withFixture((root) => {
    write(root, { 'scripts/spec/lib/v8-merge.mjs': 'export {};\n', 'openspec/changes/gates-coverage-race/proposal.md': '## Why\n\nThe values must agree.\n' });
    git(root, 'add', 'scripts/spec/lib/v8-merge.mjs');
    const file = path.join(root, 'openspec/trace/gaps.json');
    const before = readFileSync(file, 'utf8');
    let failed = true;
    let coveredLines = 1;
    const fakeSpawn = (command, args) => {
      const runs = JSON.parse(readFileSync(args[1], 'utf8'));
      const directory = path.dirname(args[1]);
      writeFileSync(path.join(runs[0].env.NODE_V8_COVERAGE, 'coverage-1-1-0.json'), JSON.stringify({ result: [] }));
      writeFileSync(args[2], JSON.stringify(runs.map(() => ({ status: failed ? 1 : 0, error: null }))));
      const records = ['src/math.test.mjs', 'tools/other.test.mjs'].map((file, index) => ({ file, name: index === 0 ? 'adds two numbers' : 'runs outside src', title: index === 0 ? 'adds two numbers' : 'runs outside src', kind: 'test', status: failed ? 'fail' : 'pass', tags: [], tagError: null, line: 4, column: 1, fullName: index === 0 ? 'adds two numbers' : 'runs outside src', leaf: true }));
      writeFileSync(path.join(directory, 'tests-main.jsonl.sync'), records.map(record => JSON.stringify(record) + '\n').join(''));
      writeFileSync(path.join(directory, 'lcov.info'), `SF:${root}/src/math.js\nLF:3\nLH:${coveredLines}\nBRF:1\nBRH:1\nFNF:1\nFNH:1\nend_of_record\nSF:${root}/scripts/spec/lib/v8-merge.mjs\nLF:1\nLH:1\nBRF:0\nBRH:0\nFNF:0\nFNH:0\nend_of_record\n`);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ checked: ['src/math.js', 'scripts/spec/lib/v8-merge.mjs'], violations: [], assertions: records.map(record => ({ file: record.file, fullName: record.fullName, count: 1 })), leaks: [] }) + '\n');
      return { status: 0 };
    };
    const options = { spawn: fakeSpawn, openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : args[0] === 'show' ? '{"deltas":[]}' : '{"items":[]}' }) };
    const error = run(root, ['rebaseline', '--change', 'gates-coverage-race'], options);
    assert.equal(error.status, 1);
    assert.match(error.output, /TRACE-FAILED-TEST/);
    assert.equal(readFileSync(file, 'utf8'), before);
    assert.equal(existsSync(path.join(root, 'openspec/trace/history.jsonl')), false);
    failed = false;
    coveredLines = 2;
    const equal = run(root, ['rebaseline', '--change', 'gates-coverage-race'], options);
    assert.equal(equal.status, 1);
    assert.match(equal.output, /no different metric values/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/history.jsonl')), false);
    coveredLines = 1;
    const result = run(root, ['rebaseline', '--change', 'gates-coverage-race'], options);
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /Baseline: src\/math\.js\./);
    const ledger = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(ledger.coverage['src/math.js'].lines, 2);
    const history = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8');
    const line = JSON.parse(history.trim());
    assert.equal(line.kind, 'rebaseline');
    assert.equal(line.sha, '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d');
    assert.equal(line.old, 1);
    assert.equal(line.new, 2);
    assert.equal(line.change, 'gates-coverage-race');
    assert.match(run(root, ['rebaseline', '--change', 'gates-coverage-race'], options).output, /already records its baseline step/);
    assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), history);
    coveredLines = 0;
    assert.match(run(root, ['ratchet', '--change', 'gates-coverage-race'], options).output, /ERROR LEDGER-REBASELINE/);
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).coverage['src/math.js'].lines, 2);
    coveredLines = 1;
    const check = run(root, ['check', '--change', 'gates-coverage-race'], options);
    assert.doesNotMatch(check.output, /ERROR LEDGER-(LARGER|MORE|NOT-IN-BASE|REBASELINE|TOTALS|HASH)/);
  }, { base: { 'openspec/trace/gaps.json': JSON.stringify(baseLedger) + '\n' } });
});


test('[coverage-gate-065] The raw reader excludes test and dependency URLs', () => {
  withFixture(root => {
    const directory = path.join(root, 'raw');
    mkdirSync(directory);
    const fn = { functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: 45, count: 1 }] };
    const urls = [pathToFileURL(path.join(root, 'src/math.js')).href, pathToFileURL(path.join(root, 'src/math.test.mjs')).href, pathToFileURL(path.join(root, 'node_modules/a.js')).href, 'file://host/a.js', path.join(root, 'src/math.js'), pathToFileURL(path.join(root, 'src/math.js')).href + '?node-test-mock=1', 'node:fs', pathToFileURL(path.join(root, 'absent.js')).href];
    writeFileSync(path.join(directory, 'notes.txt'), 'not coverage');
    writeFileSync(path.join(directory, 'coverage-1-1-0.json'), JSON.stringify({ result: urls.map(url => ({ url, functions: [fn] })) }));
    const inventory = ['src/math.js', 'src/math.test.mjs', 'node_modules/a.js'];
    assert.equal(mergeRawCoverage({ root, directory, inventory, text: '' }), `SF:${root}/src/math.js\nLF:3\nLH:3\nBRF:1\nBRH:1\nFNF:0\nFNH:0\nend_of_record\n`);
    assert.equal(mergeRawCoverage({ root, directory: path.join(root, 'none'), inventory, text: 'original' }), 'original');
    assert.equal(mergeRawCoverage({ root, directory, inventory: [null], text: '' }), '');
  });
});


test('[gap-ledger-114] The gate reports false baseline history', () => {
  const baseLedger = { version: 4, coverage: { 'src/math.js': { loaded: true, sha: '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d', untrue: false, lines: 1, branches: 0, functions: 0, totals: { lines: 3, branches: 1, functions: 1 }, origin: 'pre-spec', since: '2026-01-01' } }, untracedTests: {} };
  withFixture(root => {
    write(root, { 'scripts/spec/lib/v8-merge.mjs': 'export {};\n', 'openspec/changes/gates-coverage-race/proposal.md': '## Why\n\nThe values must agree.\n' });
    git(root, 'add', 'scripts/spec/lib/v8-merge.mjs');
    const current = structuredClone(baseLedger); current.coverage['src/math.js'].lines = 3;
    writeFileSync(path.join(root, 'openspec/trace/gaps.json'), JSON.stringify(current));
    writeFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify({ kind: 'rebaseline', change: 'gates-coverage-race', file: 'src/math.js', sha: '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d', metric: 'lines', old: 1, new: 3, oldTotal: 3, newTotal: 3 }) + '\n');
    const spawn = (command, args) => {
      writeFileSync(args[2], '[{"status":0,"error":null}]');
      writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), `SF:${root}/src/math.js\nLF:3\nLH:1\nBRF:1\nBRH:1\nFNF:1\nFNH:1\nend_of_record\n`);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), '{"checked":["src/math.js"],"violations":[],"assertions":[],"leaks":[]}\n');
      return { status: 0 };
    };
    const result = run(root, ['check', '--change', 'gates-coverage-race'], { spawn, openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : args[0] === 'show' ? '{"deltas":[]}' : '{"items":[]}' }) });
    assert.match(result.output, /ERROR LEDGER-REBASELINE/);
    assert.match(result.output, /ERROR LEDGER-LARGER-THAN-BASE src\/math\.js/);
    current.coverage['src/math.js'].lines = 2;
    writeFileSync(path.join(root, 'openspec/trace/gaps.json'), JSON.stringify(current));
    writeFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify({ kind: 'rebaseline', change: 'gates-coverage-race', file: 'src/math.js', sha: '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d', metric: 'lines', old: 1, new: 2, oldTotal: 3, newTotal: 3 }) + '\n');
    rmSync(path.join(root, 'openspec/changes/gates-coverage-race/proposal.md'));
    assert.match(run(root, ['check', '--change', 'gates-coverage-race'], { spawn, openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : '{"items":[]}' }) }).output, /ERROR LEDGER-REBASELINE/);
  }, { base: { 'openspec/trace/gaps.json': JSON.stringify(baseLedger) + '\n' } });
});


test('[gap-ledger-111] The command needs both ledger files before tests', () => {
  withFixture(root => {
    write(root, { 'scripts/spec/lib/v8-merge.mjs': 'export {};\n', 'openspec/changes/gates-coverage-race/proposal.md': '## Why\n\nThe values must agree.\n' });
    git(root, 'add', 'scripts/spec/lib/v8-merge.mjs');
    let calls = 0;
    const spawn = () => { calls += 1; return { status: 9 }; };
    assert.match(run(root, ['rebaseline', '--change', 'gates-coverage-race'], { spawn }).output, /The baseline needs the ledger file/);
    write(root, { 'openspec/trace/gaps.json': '{"version":4,"coverage":{},"untracedTests":{}}\n' });
    assert.match(run(root, ['rebaseline', '--change', 'gates-coverage-race'], { spawn }).output, /The baseline needs the base ledger/);
    assert.equal(calls, 0);
  });
});

test('[gap-ledger-115] The command keeps the base history prefix', () => {
  withFixture(root => {
    write(root, { 'scripts/spec/lib/v8-merge.mjs': 'export {};\n', 'openspec/changes/gates-coverage-race/proposal.md': '## Why\n\nThe values must agree.\n', 'openspec/trace/history.jsonl': '{"kind":"waiver","change":"other"}\n' });
    git(root, 'add', 'scripts/spec/lib/v8-merge.mjs');
    let calls = 0;
    const spawn = () => { calls += 1; return { status: 9 }; };
    assert.match(run(root, ['rebaseline', '--change', 'gates-coverage-race'], { spawn }).output, /unchanged base history prefix/);
    assert.equal(calls, 0);
    assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), '{"kind":"waiver","change":"other"}\n');
  }, { base: { 'openspec/trace/history.jsonl': '{"kind":"waiver","change":"old"}\n' } });
});


test('[coverage-gate-066 coverage-gate-067] The gate removes its raw folder and reports absent raw files', () => {
  const rawNames = [];
  for (const mode of ['loaded', 'no-lcov', 'no-lcov-no-raw', 'empty', 'absent', 'error']) {
    withFixture((root) => {
      let raw;
      const fakeSpawn = (_command, args) => {
        const runs = JSON.parse(readFileSync(args[1], 'utf8'));
        raw = runs[0].env.NODE_V8_COVERAGE;
        rawNames.push(path.basename(raw));
        assert.match(path.basename(raw), /^gev-spec-v8-.+$/);
        assert.equal(raw.startsWith(path.join(tmpdir(), 'gev-spec-v8-')), true);
        assert.equal(raw.startsWith(root + path.sep), false);
        writeFileSync(args[2], JSON.stringify(runs.map(() => ({ status: 0, error: null }))));
        if (mode !== 'no-lcov' && mode !== 'no-lcov-no-raw') writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), `SF:${root}/src/math.js\nLF:3\nLH:0\nend_of_record\n`);
        if (mode === 'absent') rmSync(raw, { recursive: true });
        else if (mode !== 'empty' && mode !== 'no-lcov-no-raw') {
          writeFileSync(path.join(raw, 'coverage-1-1-0.json'), mode === 'error' ? '{' : JSON.stringify({ result: [{
            url: pathToFileURL(path.join(root, 'src/math.js')).href,
            functions: [{ functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: 45, count: 1 }] }],
          }] }));
        } else if (mode === 'empty') writeFileSync(path.join(raw, 'other.json'), '{}');
        return { status: 0 };
      };
      const options = { spawn: fakeSpawn, openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : '{"items":[]}' }) };
      if (mode === 'error') assert.throws(() => run(root, ['init'], options), SyntaxError);
      else {
        const result = run(root, ['init'], options);
        if (mode === 'empty' || mode === 'absent') {
          assert.match(result.output, /ERROR COVERAGE-RAW-MISSING/);
          assert.match(result.output, /^ERROR COVERAGE-RAW-MISSING The raw coverage files of the main run are absent, so the merge cannot replace the Node records$/m);
          assert.match(readFileSync(path.join(root, '.gev-cache/spec/lcov.info'), 'utf8'), /LF:3\nLH:0/);
        } else assert.doesNotMatch(result.output, /COVERAGE-RAW-MISSING/);
        assert.equal(existsSync(path.join(root, '.gev-cache/spec/inventory.json')), true);
        assert.equal(existsSync(path.join(root, '.gev-cache/spec/results.json')), true);
        if (mode === 'loaded') assert.match(readFileSync(path.join(root, '.gev-cache/spec/lcov.info'), 'utf8'), /LF:3\nLH:3/);
      }
      assert.equal(existsSync(raw), false);
      assert.equal(existsSync(path.join(root, '.gev-cache/spec/v8')), false);
      assert.equal(existsSync(root), true);
    });
  }
  assert.equal(rawNames.length, 6);
  assert.equal(new Set(rawNames).size, 6);
});

test('[gap-ledger-116 gap-ledger-117] The ratchet applies the count tolerance', () => {
  const sha = '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d';
  const baseLedger = { version: 4, coverage: { 'src/math.js': { loaded: true, sha, untrue: false, lines: 1, branches: 0, functions: 0, totals: { lines: 310, branches: 1, functions: 1 }, origin: 'pre-spec', since: '2026-01-01' } }, untracedTests: {} };
  withFixture(root => {
    write(root, { 'scripts/spec/lib/v8-merge.mjs': 'export {};\n', 'openspec/changes/gates-coverage-race/proposal.md': '## Why\n\nThe values must agree.\n' });
    git(root, 'add', 'scripts/spec/lib/v8-merge.mjs');
    const current = structuredClone(baseLedger); current.coverage['src/math.js'].lines = 44;
    writeFileSync(path.join(root, 'openspec/trace/gaps.json'), JSON.stringify(current));
    const line = { kind: 'rebaseline', change: 'gates-coverage-race', file: 'src/math.js', sha, metric: 'lines', old: 1, new: 44, oldTotal: 310, newTotal: 310 };
    const historyFile = path.join(root, 'openspec/trace/history.jsonl');
    writeFileSync(historyFile, JSON.stringify(line) + '\n');
    const spawn = (command, args) => {
      writeFileSync(args[2], '[{"status":0,"error":null}]');
      writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), `SF:${root}/src/math.js\nLF:310\nLH:270\nBRF:1\nBRH:1\nFNF:1\nFNH:1\nend_of_record\n`);
      writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), '{"checked":["src/math.js"],"violations":[],"assertions":[],"leaks":[]}\n');
      return { status: 0 };
    };
    const options = { spawn, openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : args[0] === 'show' ? '{"deltas":[]}' : '{"items":[]}' }) };
    assert.doesNotMatch(run(root, ['ratchet', '--change', 'gates-coverage-race'], options).output, /ERROR LEDGER-REBASELINE/);
    writeFileSync(historyFile, JSON.stringify({ ...line, new: 49 }) + '\n');
    assert.match(run(root, ['ratchet', '--change', 'gates-coverage-race'], options).output, /ERROR LEDGER-REBASELINE/);
  }, { base: { 'openspec/trace/gaps.json': JSON.stringify(baseLedger) + '\n' } });
});

test('[ste-lint-023] keeps a success status for the lint command with a noun warning', () => {
  withFixture((root) => {
    write(root, { 'openspec/specs/demo/notes.md': 'The read fails.\n' });
    const result = run(root, ['lint']);
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /^WARN STE-NOUN openspec\/specs\/demo\/notes\.md:1 Check for a verb used as a noun: "read"$/m);
  });
});


test('[ste-lint-037 ste-lint-012] keeps a success status for the lint command with an old prose warning', () => {
  withFixture((root) => {
    write(root, { 'openspec/specs/demo/notes.md': 'Retain the file.\n' });
    const result = run(root, ['lint', '--change', 'ste-new-prose-words']);
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /^WARN STE-WORD-OLD openspec\/specs\/demo\/notes\.md:1 Use "keep", not "retain"$/m);
    assert.match(result.output, /STE: 0 errors, 1 warnings\./);
  });
});

// Fake test results keep the new scenarios independent of host measurement counts.
function oneMeasurement(root, { loaded = false, assertions = 1 } = {}) {
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
      writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), `SF:${root}/src/math.js\nLF:3\nLH:2\nBRF:1\nBRH:1\nFNF:1\nFNH:1\nend_of_record\n`);
    }
    writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ checked: loaded ? ['src/math.js'] : [], violations: [], assertions: records.map(record => ({ file: record.file, fullName: record.fullName, count: assertions })), leaks: [] }) + '\n');
    return { status: 0 };
  };
  const openSpec = (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : args[0] === 'show' ? JSON.stringify({ deltas: [{ spec: 'demo', operation: 'ADDED', requirement: { scenarios: [{}] } }], requirements: [{ scenarios: [{}] }] }) : '{"items":[]}' });
  return { spawn, openSpec, calls: () => calls };
}

function trustedFixture(body, extra = {}, base = {}) {
  withFixture(root => {
    const fake = oneMeasurement(root);
    passes(root, ['init'], { openSpec: fake.openSpec, spawn: fake.spawn });
    write(root, { ...CHANGE, 'src/math.test.mjs': MATH_TEST('[demo-001] adds two numbers'), ...extra });
    git(root, 'add', '-A');
    // Fixture commits supply the Git content comparison that the scenarios need.
    commitAll(root, 'inputs');
    const ratchet = run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
    body({ root, fake, ratchet, commit: git(root, 'rev-parse', 'HEAD'), docs: (options = {}) => run(root, ['check', '--no-measure', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: () => { assert.fail('The document mode started tests'); }, ...options }) });
  }, { base });
}

test('[gap-ledger-123] compare one ratchet measurement', () => trustedFixture(({ fake, ratchet }) => {
  assert.equal(fake.calls(), 2);
  assert.match(ratchet.output, /^Command: ratchet\n/);
  assert.match(ratchet.output, /Ledger: 0 entries do not match the current gaps\./);
  assert.match(ratchet.output, /STE: 0 errors,/);
}));
test('[gap-ledger-124] fail for an absent review', () => trustedFixture(({ ratchet }) => {
  assert.equal(ratchet.status, 2);
  assert.match(ratchet.output, /ERROR REVIEW-MISSING/);
  assert.match(ratchet.output, /Gates failed with 1 errors\./);
}));
test('[gap-ledger-125] pass after all comparisons', () => trustedFixture(({ root, fake }) => {
  reviewFor(root, 'add-demo');
  const result = run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /Gates passed\./);
  assert.equal(fake.calls(), 3);
}));
test('[gap-ledger-126] compare repaired ledger values', () => trustedFixture(({ root, fake }) => {
  const file = path.join(root, 'openspec/trace/gaps.json');
  const ledger = JSON.parse(readFileSync(file, 'utf8'));
  ledger.version = 1;
  writeFileSync(file, JSON.stringify(ledger));
  const result = run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).version, 4);
  assert.doesNotMatch(result.output, /ERROR LEDGER-VERSION/);
  assert.match(result.output, /ERROR REVIEW-MISSING/);
}));

test('[coverage-gate-068] trust a changed document', () => trustedFixture(({ root, docs, commit }) => {
  write(root, { 'openspec/changes/add-demo/design.md': 'The demo adds numbers.\n' });

  write(root, { 'node_modules/dep/example.test.mjs': '// A dependency test.\n' });
  reviewFor(root, 'add-demo');
  const before = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8');
  const trace = readFileSync(path.join(root, '.gev-cache/spec/trace-report.json'), 'utf8');
  const originalWrite = fs.writeFileSync;
  let traceWrites = 0;
  fs.writeFileSync = (file, ...args) => {
    if (String(file).startsWith(path.join(root, 'openspec/trace/')) || String(file).startsWith(path.join(root, '.gev-cache/spec/'))) traceWrites += 1;
    return originalWrite(file, ...args);
  };
  syncBuiltinESMExports();
  let result;
  try {
    result = docs();
  } finally {
    fs.writeFileSync = originalWrite;
    syncBuiltinESMExports();
  }
  assert.equal(traceWrites, 0);
  assert.equal(result.status, 0, result.output);
  assert.equal(result.output.split('\n')[0], `NO TEST RUN: the mode trusts the snapshot of commit ${commit}`);
  assert.match(result.output, /Gates passed\./);
  assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), before);
  assert.equal(readFileSync(path.join(root, '.gev-cache/spec/trace-report.json'), 'utf8'), trace);
}, { '.gitignore': '.gev-cache/\nnode_modules/\n' }));

test("[coverage-gate-069] refuse a changed inventory file", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "src/math.js": "export {};\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["src/math.js"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {}));
test("[coverage-gate-070] refuse a changed test file", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "src/math.test.mjs": "// changed\n// changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["src/math.test.mjs"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {}));
test("[coverage-gate-071] refuse a changed QA script", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "scripts/qa-demo.mjs": "/**\n * @purpose Prove the demo.\n * @covers unmapped: Demo\n * @run node scripts/qa-demo.mjs\n * @needs Node.\n */\n// changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["scripts/qa-demo.mjs"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"scripts/qa-demo.mjs": "/**\n * @purpose Prove the demo.\n * @covers unmapped: Demo\n * @run node scripts/qa-demo.mjs\n * @needs Node.\n */\n"}));
test("[coverage-gate-072] refuse a changed package lock", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "package-lock.json": "{}\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["package-lock.json"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"package-lock.json": "base\n"}));
test("[coverage-gate-073] refuse a changed Node version", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { ".node-version": "0.0.0\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), [".node-version"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {}));
test("[coverage-gate-074] refuse a changed Makefile", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "Makefile": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["Makefile"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"Makefile": "base\n"}));
test("[coverage-gate-075] refuse a changed Dockerfile", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "Dockerfile": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["Dockerfile"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"Dockerfile": "base\n"}));
test("[coverage-gate-075] refuse a changed Dockerfile at `containers/Dockerfile.gates`", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "containers/Dockerfile.gates": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["containers/Dockerfile.gates"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"containers/Dockerfile.gates": "base\n"}));
test("[coverage-gate-075] refuse a changed Dockerfile at `Dockerfileprod`", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "Dockerfileprod": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["Dockerfileprod"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"Dockerfileprod": "base\n"}));
test("[coverage-gate-076] refuse a changed compose file", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "compose.yaml": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["compose.yaml"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"compose.yaml": "base\n"}));
test("[coverage-gate-076] refuse a changed compose file at `docker-compose.yml`", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "docker-compose.yml": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["docker-compose.yml"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"docker-compose.yml": "base\n"}));
test("[coverage-gate-076] refuse a changed compose file at `containers/compose.gates.yaml`", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "containers/compose.gates.yaml": "# changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["containers/compose.gates.yaml"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"containers/compose.gates.yaml": "base\n"}));
test("[coverage-gate-077] refuse a changed gate input file", () => trustedFixture(({ root, docs, commit }) => {
  write(root, { "scripts/spec/config.txt": "changed\n" });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.equal(result.output.split('\n')[0], 'NO TEST RUN: refused');
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["scripts/spec/config.txt"]);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, {"scripts/spec/config.txt": "base\n"}));
test('[coverage-gate-078] refuse an untracked input file', () => trustedFixture(({ root, docs }) => {
  write(root, { 'scripts/spec/new.txt': 'new\n' });
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('scripts/spec/new.txt'));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}));
test('[coverage-gate-079] refuse without ratchet history', () => withFixture(root => {
  const result = run(root, ['check', '--no-measure', '--change', 'add-demo']);
  assert.equal(result.status, 2);
  assert.match(result.output, /^NO TEST RUN: refused\n/);
  assert.match(result.output, /The change has no ratchet history line/);
  assert.ok(result.output.split('\n').includes('Ratchet commit: none'));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}));
test('[coverage-gate-080] refuse a commit that Git cannot find', () => trustedFixture(({ root, docs }) => {
  const file = path.join(root, 'openspec/trace/history.jsonl');
  const history = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
  history[history.length - 1].commit = '0'.repeat(40);
  writeFileSync(file, history.map(line => JSON.stringify(line) + '\n').join(''));
  const result = docs();
  assert.equal(result.status, 2);
  assert.match(result.output, /Git cannot find the ratchet commit/);
  assert.ok(result.output.split('\n').includes('Ratchet commit: 0000000000000000000000000000000000000000'));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}));
test('[coverage-gate-081] refuse a changed word list', () => trustedFixture(({ root, docs }) => {
  const words = JSON.parse(readFileSync(path.join(root, 'openspec/ste/words.json'), 'utf8'));
  words.words.demo = 'example';
  write(root, { 'openspec/ste/words.json': JSON.stringify(words) });
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('openspec/ste/words.json'));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}));
test('[coverage-gate-082] refuse an absent snapshot', () => trustedFixture(({ root, docs, commit }) => {
  const file = path.join(root, '.gev-cache/spec/measurement.json');
  writeFileSync(file, '{}');
  const different = docs();
  assert.equal(different.status, 2);
  assert.match(different.output, /The snapshot hash differs from history/);
  assert.ok(different.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(different.output, /Gates passed|Gates failed/);
  rmSync(file);
  const result = docs();
  assert.equal(result.status, 2);
  assert.match(result.output, /The ratchet snapshot is absent/);
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}));
test('[coverage-gate-083] show command times', () => trustedFixture(({ root, fake, docs }) => {
  for (const command of ['check', 'ratchet', 'docs']) {
    const result = command === 'docs' ? docs({ clock: () => DATE }) : run(root, [command, '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn, clock: () => DATE });
    assert.equal(result.output.split('\n')[1], 'Started: 2026-09-13T12:00:00.000Z');
    assert.equal(result.output.split('\n').at(-1), 'Finished: 2026-09-13T12:00:00.000Z (0 s)');
    assert.doesNotMatch(result.output, /Phase /);
  }
}));
test('[coverage-gate-084] show slow phase times', () => trustedFixture(({ root, fake }) => {
  let tick = 0;
  const result = run(root, ['check', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn, clock: () => new Date(DATE.getTime() + tick++ * 2000) });
  assert.match(result.output, /Phase measure: 6 s/);
  for (const name of ['specs', 'compare', 'lint', 'review']) assert.match(result.output, new RegExp(`Phase ${name}: 2 s`));
  assert.equal(result.output.split('\n').at(-1), 'Finished: 2026-09-13T12:00:22.000Z (22 s)');
  let exact = 0;
  const fast = run(root, ['check', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn, clock: () => new Date(DATE.getTime() + exact++ * 1000) });
  assert.doesNotMatch(fast.output, /Phase (specs|compare|lint|review):/);
}));
test('[coverage-gate-085] keep every file check', () => trustedFixture(({ root, docs }) => {
  write(root, { 'openspec/trace/links.json': '{}\n', 'openspec/trace/ids.json': '{}\n', 'openspec/changes/add-demo/notes.md': 'You should use the demo.\n' });
  const result = docs();
  for (const code of ['TRACE-ID-UNREGISTERED', 'TRACE-LINKS-STALE', 'STE-WORD', 'REVIEW-MISSING']) assert.match(result.output, new RegExp(`ERROR ${code}`));
  write(root, { 'openspec/changes/add-demo/specs/demo/spec.md': SPEC.replace('MUST', 'can') });
  assert.match(docs().output, /ERROR SPEC-LINT-NO-MUST/);
}));

test('[ci-gates-011] add fast checks before review', () => {
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  const target = text.match(/^precheck:.*\n(?:\t.*\n)+/m)?.[0] || '';
  assert.ok(target.includes('node scripts/format.mjs --check && node scripts/check-import-directions.mjs && node scripts/check-package-boundaries.mjs && node scripts/check-layer-state-tokens.mjs --base-ref origin/main'));
  for (const command of ['node scripts/format.mjs --check', 'node scripts/check-import-directions.mjs', 'node scripts/check-package-boundaries.mjs', 'node scripts/check-layer-state-tokens.mjs --base-ref origin/main']) assert.ok(target.includes(command), command);
  assert.ok(target.includes('docker run --rm -v "$(CURDIR)":/src $(IMAGE)'));
  assert.ok(target.includes('$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT sh -c'));
  assert.doesNotMatch(target, /gates\.mjs|\$\(GATES\)/);
});
test('[ci-gates-012] add a document gate target', () => {
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  assert.match(text, /^gates-docs: ensure-image\n\t\$\(GATES_DOCS\) check --no-measure \$\(CHANGE_ARG\) \$\(BASE_ARG\)/m);
  assert.ok(text.includes('mkdir -p /tmp/work/.gev-cache/spec'));
  assert.ok(text.includes('cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json'));
  const docsCommand = text.match(/^GATES_DOCS := .*$/m)?.[0] || '';
  assert.ok(docsCommand.includes('$(GATES_COPY) || exit 2;'));
  assert.ok(docsCommand.includes('$(GATES_DOCS_MARKERS) || exit 2;'));
  assert.ok(docsCommand.includes('env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs'));
  assert.doesNotMatch(docsCommand, /\$\(GATES_BACK\)/);
});
test('[change-review-033] keep the final measurement', () => {
  const text = readFileSync(path.join(PROJECT_ROOT, '.claude/commands/opsx/review.md'), 'utf8');
  assert.match(text, /^1\..*make precheck/m);
  assert.match(text, /^1\..*Make sure that the ratchet commit has all input files\./m);
  assert.ok(text.includes('If not, commit them and run the ratchet command again. Then run `make gates-docs CHANGE=<name>`.'));
  assert.ok(readFileSync(path.join(PROJECT_ROOT, 'AGENTS.md'), 'utf8').includes('Commit each file outside openspec/changes/, openspec/specs/ and openspec/trace/.'));
  for (const step of [1, 3, 11, 15]) assert.match(text, new RegExp(`^${step}\\..*make gates-docs`, 'm'));
  assert.match(text, /^10\..*make gates-docs/m);
  assert.match(text, /^15\..*make gates CHANGE=<name>/m);
  assert.match(text, /CI.*before.*merge/);
});

test('[coverage-gate-079] refuse history from another change or command', () => trustedFixture(({ root, docs }) => {
  const file = path.join(root, 'openspec/trace/history.jsonl');
  const original = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
  writeFileSync(file, original.map(line => JSON.stringify({ ...line, change: 'other' }) + '\n').join(''));
  assert.match(docs().output, /The change has no ratchet history line/);
  writeFileSync(file, original.map(line => JSON.stringify({ ...line, kind: 'waiver' }) + '\n').join(''));
  assert.match(docs().output, /The change has no ratchet history line/);
}));

test('[coverage-gate-085] check OpenSpec without tests', () => trustedFixture(({ docs }) => {
  const result = docs({ openSpec: () => ({ status: 1, stdout: '0.0.0' }) });
  assert.match(result.output, /ERROR GATES-OPENSPEC/);
  assert.equal(result.status, 1);
}));

test('[coverage-gate-085] check coverage filters without tests', () => trustedFixture(({ root, docs }) => {
  write(root, { 'openspec/changes/add-demo/config.json': '{"option":"--test-coverage-exclude=src/math.js"}\n' });
  git(root, 'add', 'openspec/changes/add-demo/config.json');
  const result = docs();
  assert.match(result.output, /ERROR COVERAGE-FLAG openspec\/changes\/add-demo\/config.json/);
  assert.equal(result.status, 1);
  assert.match(docs({ nodeVersion: '0.0.0' }).output, /ERROR GATES-RUNTIME/);
}));

test('[coverage-gate-085] check archived specs without tests', () => trustedFixture(({ root, docs }) => {
  const folder = 'openspec/changes/archive/2026-09-13-add-demo';
  mkdirSync(path.join(root, 'openspec/changes/archive'), { recursive: true });
  git(root, 'mv', 'openspec/changes/add-demo', folder);
  write(root, { 'openspec/specs/demo/spec.md': '# Demo\n\n## Purpose\n\nAdd numbers.\n\n' + SPEC.replace('## ADDED Requirements', '## Requirements').replace('result is 3', 'result is 4') });
  const result = docs();
  assert.match(result.output, /ERROR SPEC-DELTA-NOT-APPLIED/);
  assert.equal(result.status, 1);
}));

test('[coverage-gate-069] refuse a deleted input file', () => trustedFixture(({ root, docs }) => {
  git(root, 'rm', '-q', 'src/math.js');
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('src/math.js'));
}));

test('[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes', () => withFixture(root => {
  const fake = oneMeasurement(root);
  passes(root, ['init'], { openSpec: fake.openSpec, spawn: fake.spawn });
  write(root, { 'openspec/changes/docs/proposal.md': 'The demo adds numbers.\n' });
  commitAll(root, 'docs');
  const first = run(root, ['ratchet', '--change', 'docs'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.match(first.output, /Ratchet: 1 history lines for docs/);
  const history = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8');
  const firstLine = JSON.parse(history);
  assert.equal(firstLine.kind, 'measurement');
  assert.equal(firstLine.change, 'docs');
  assert.equal(firstLine.commit, git(root, 'rev-parse', 'HEAD'));
  assert.equal(Object.hasOwn(firstLine, 'measurement'), true);
  assert.match(firstLine.measurement, /^[0-9a-f]{64}$/);
  reviewFor(root, 'docs');
  const second = run(root, ['ratchet', '--change', 'docs'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.equal(second.status, 0, second.output);
  assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), history);
  commitAll(root, 'review');
  run(root, ['ratchet', '--change', 'docs'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').length, 2);
}));

test('[gap-ledger-126] repair absent totals and stale test names', () => withFixture(root => {
  const fake = oneMeasurement(root, { loaded: true });
  const options = { spawn: fake.spawn, openSpec: fake.openSpec };
  passes(root, ['init'], options);
  write(root, { 'openspec/changes/docs/proposal.md': 'The demo adds numbers.\n' });
  const file = path.join(root, 'openspec/trace/gaps.json');
  const ledger = JSON.parse(readFileSync(file, 'utf8'));
  delete ledger.coverage['src/math.js'].totals;
  ledger.untracedTests['src/math.test.mjs'].names.obsolete = 1;
  writeFileSync(file, JSON.stringify(ledger));
  const result = run(root, ['ratchet', '--change', 'docs'], options);
  const repaired = JSON.parse(readFileSync(file, 'utf8'));
  assert.deepEqual(repaired.coverage['src/math.js'].totals, { lines: 3, branches: 1, functions: 1 });
  assert.deepEqual(repaired.untracedTests['src/math.test.mjs'].names, { 'adds two numbers': 1 });
  assert.doesNotMatch(result.output, /ERROR LEDGER-NO-TOTALS|ERROR LEDGER-STALE/);
  assert.equal(result.status, 2);
  assert.match(result.output, /ERROR REVIEW-MISSING/);
}));

test('[coverage-gate-078] refuse a protected ignored file', () => trustedFixture(({ root, docs }) => {
  appendFileSync(path.join(root, '.gitignore'), 'scripts/spec/hidden.txt\n');
  write(root, { 'scripts/spec/hidden.txt': 'hidden\n' });
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('scripts/spec/hidden.txt'));
}));

test('[coverage-gate-086] refuse changed package metadata', () => trustedFixture(({ root, docs }) => {
  write(root, { 'package.json': '{"type":"commonjs"}\n' });
  git(root, 'add', 'package.json');
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('package.json'));
}));

test('[coverage-gate-087] refuse a failed Git comparison', () => trustedFixture(({ docs, commit }) => {
  for (const failed of ['diff', 'others', 'ignored']) {
    const result = docs({ gitSpawn: (_command, args) => ({ status: (failed === 'diff' ? args[0] === 'diff' : failed === 'ignored' ? args.includes('--ignored') : args[0] === 'ls-files' && !args.includes('--ignored')) ? 1 : 0, stdout: '' }) });
    assert.equal(result.status, 2);
    assert.match(result.output, /Git cannot compare input files, code files or test files/);
    assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
    assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
  }
}));

test('[coverage-gate-068] set the document option on the options object', () => {
  const options = parseArgs(['check', '--no-measure', '--change', 'docs']);
  assert.equal(Object.hasOwn(options, 'noMeasure'), true);
  assert.deepEqual(options, { command: 'check', change: 'docs', base: undefined, root: undefined, noMeasure: true });
  assert.throws(() => parseArgs(['ratchet', '--no-measure']), /Usage:/);
});

test('[gap-ledger-129] record a different hash without a changed gap', () => withFixture(root => {
  const fake = oneMeasurement(root);
  const options = { spawn: fake.spawn, openSpec: fake.openSpec };
  passes(root, ['init'], options);
  write(root, { 'openspec/changes/docs/proposal.md': 'The demo adds numbers.\n' });
  run(root, ['ratchet', '--change', 'docs'], options);
  const next = oneMeasurement(root, { assertions: 2 });
  run(root, ['ratchet', '--change', 'docs'], { spawn: next.spawn, openSpec: next.openSpec });
  assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').length, 2);
  const result = run(root, ['check', '--no-measure', '--change', 'docs'], options);
  assert.match(result.output, /^NO TEST RUN: the mode trusts the snapshot of commit /);
}));

test('[gap-ledger-129] record a different change without a changed gap', () => withFixture(root => {
  const fake = oneMeasurement(root);
  const options = { spawn: fake.spawn, openSpec: fake.openSpec };
  passes(root, ['init'], options);
  write(root, { 'openspec/changes/alpha/proposal.md': 'The demo adds numbers.\n' });
  run(root, ['ratchet', '--change', 'alpha'], options);
  write(root, { 'openspec/changes/beta/proposal.md': 'The demo adds numbers.\n' });
  run(root, ['ratchet', '--change', 'beta'], options);
  const history = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(history.map(line => line.change), ['alpha', 'beta']);
  assert.equal(Object.hasOwn(history[1], 'measurement'), true);
  assert.match(history[1].measurement, /^[0-9a-f]{64}$/);
}));

test('[coverage-gate-085] report a change folder that is absent', () => trustedFixture(({ root, docs }) => {
  git(root, 'rm', '-r', '-q', 'openspec/changes/add-demo');
  const result = docs();
  assert.equal(result.status, 1);
  assert.match(result.output, /ERROR TRACE-UNKNOWN-CHANGE/);
}));

test('[coverage-gate-079] refuse without a change name', () => trustedFixture(({ root, fake }) => {
  const result = run(root, ['check', '--no-measure'], { spawn: fake.spawn, openSpec: fake.openSpec });
  assert.equal(result.status, 2);
  assert.match(result.output, /The change has no ratchet history line/);
  assert.ok(result.output.split('\n').includes('Ratchet commit: none'));
}));

test('[coverage-gate-085] compare the ledger with the base without tests', () => withFixture(root => {
  const fake = oneMeasurement(root);
  const options = { spawn: fake.spawn, openSpec: fake.openSpec };
  passes(root, ['init'], options);
  commitAll(root, 'ledger');
  git(root, 'checkout', '-q', 'main');
  git(root, 'merge', '-q', '--ff-only', 'work');
  git(root, 'checkout', '-q', 'work');
  write(root, { 'openspec/changes/docs/proposal.md': 'The demo adds numbers.\n' });
  run(root, ['ratchet', '--change', 'docs'], options);
  const file = path.join(root, 'openspec/trace/gaps.json');
  const ledger = JSON.parse(readFileSync(file, 'utf8'));
  ledger.coverage['src/math.js'].lines = 4;
  writeFileSync(file, JSON.stringify(ledger));
  const result = run(root, ['check', '--no-measure', '--change', 'docs'], options);
  assert.equal(result.status, 1);
  assert.match(result.output, /ERROR LEDGER-LARGER-THAN-BASE/);
  assert.match(result.output, /ERROR LEDGER-STALE/);
}));

test('[coverage-gate-069] refuse a new tracked inventory file', () => trustedFixture(({ root, docs }) => {
  write(root, { 'src/new.js': 'export {};\n' });
  git(root, 'add', 'src/new.js');
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('src/new.js'));
}));

test('[coverage-gate-078] refuse an untracked code file', () => trustedFixture(({ root, docs }) => {
  write(root, { 'src/new.js': 'export {};\n' });
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('src/new.js'));
}));

test('[coverage-gate-085] check the base registry without tests', () => trustedFixture(({ root, docs }) => {
  commitAll(root, 'trace');
  git(root, 'checkout', '-q', 'main');
  git(root, 'merge', '-q', '--ff-only', 'work');
  git(root, 'checkout', '-q', 'work');
  const file = path.join(root, 'openspec/trace/ids.json');
  const registry = JSON.parse(readFileSync(file, 'utf8'));
  registry['demo-001'].hash = 'wrong';
  writeFileSync(file, JSON.stringify(registry));
  const result = docs();
  assert.match(result.output, /ERROR TRACE-ID-BASE-CHANGED/);
  assert.match(result.output, /ERROR TRACE-ID-CHANGED/);
}));

test('[coverage-gate-085] check all review files without tests', () => trustedFixture(({ root, fake, docs }) => {
  write(root, {
    'openspec/changes/archive/2026-09-13-add-demo/proposal.md': 'The demo adds numbers.\n',
    '.claude/agents/spec-adversary.md': '---\nname: spec-adversary\ndescription: Review\ntools: Write\n---\nReview.\n',
    '.claude/commands/opsx/review.md': 'Review.\n',
  });
  commitAll(root, 'review inputs');
  run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  const result = docs();
  assert.match(result.output, /ERROR REVIEW-MISSING openspec\/changes\/archive\/2026-09-13-add-demo\/review.md/);
  assert.match(result.output, /ERROR REVIEW-NAME-REUSED/);
  assert.match(result.output, /ERROR REVIEW-AGENT .claude\/agents\/spec-adversary.md/);
  assert.match(result.output, /ERROR REVIEW-COMMAND/);
}));

test('[ci-gates-005 coverage-gate-083] keep the CI verdict without command times', () => withFixture(root => {
  const fake = oneMeasurement(root);
  const options = { spawn: fake.spawn, openSpec: fake.openSpec };
  passes(root, ['init'], options);
  commitAll(root, 'ledger');
  git(root, 'checkout', '-q', 'main');
  git(root, 'merge', '-q', '--ff-only', 'work');
  git(root, 'checkout', '-q', 'work');
  write(root, { 'README.md': '# Docs\n' });
  const result = run(root, ['ci'], options);
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /^CI: check without a change\./);
  assert.doesNotMatch(result.output, /Started:|Finished:|Phase /);
}));

test('[coverage-gate-088] refuse an omitted protected ignored file', () => withFixture(source => trustedFixture(({ root, docs }) => {
  appendFileSync(path.join(source, '.gitignore'), 'scripts/spec/hidden name.txt\n');
  write(source, { 'scripts/spec/hidden name.txt': 'Source contents must not enter the container.\n', 'scripts/spec/visible name.txt': 'Copied contents.\n' });
  write(root, { 'scripts/spec/visible name.txt': 'Copied contents.\n' });
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  const command = text.match(/^GATES_DOCS_MARKERS := (.*)$/m)[1].replaceAll('$$', '$').replaceAll('/src', source).replaceAll('/tmp/work', root).replaceAll('/tmp/doc-inputs', path.join(source, 'doc-inputs')).replaceAll('/tmp/doc-markers', path.join(source, 'doc-markers'));
  const result = spawnSync('sh', ['-c', command], { cwd: source, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(path.join(root, 'scripts/spec/hidden name.txt'), 'utf8'), '{}');
  assert.equal(readFileSync(path.join(root, 'scripts/spec/visible name.txt'), 'utf8'), 'Copied contents.\n');
  const verdict = docs();
  assert.equal(verdict.status, 2);
  assert.ok(verdict.output.split('\n').includes('scripts/spec/hidden name.txt'));
  assert.doesNotMatch(verdict.output, /Gates passed|Gates failed/);
})));

test("[coverage-gate-090 coverage-gate-091] refuse a changed file at AGENTS.md", () => trustedFixture(({ root, docs }) => {
  write(root, { "AGENTS.md": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["AGENTS.md"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "AGENTS.md": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/commands/opsx/review.md", () => trustedFixture(({ root, docs }) => {
  write(root, { ".claude/commands/opsx/review.md": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), [".claude/commands/opsx/review.md"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { ".claude/commands/opsx/review.md": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md", () => trustedFixture(({ root, docs }) => {
  write(root, { ".claude/agents/x.md": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), [".claude/agents/x.md"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { ".claude/agents/x.md": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at docs/x.md", () => trustedFixture(({ root, docs }) => {
  write(root, { "docs/x.md": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["docs/x.md"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "docs/x.md": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at .github/workflows/x.yaml", () => trustedFixture(({ root, docs }) => {
  write(root, { ".github/workflows/x.yaml": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), [".github/workflows/x.yaml"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { ".github/workflows/x.yaml": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at fixtures/x.json", () => trustedFixture(({ root, docs }) => {
  write(root, { "fixtures/x.json": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["fixtures/x.json"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "fixtures/x.json": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/config.yaml", () => trustedFixture(({ root, docs }) => {
  write(root, { "openspec/config.yaml": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["openspec/config.yaml"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "openspec/config.yaml": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/other.yaml", () => trustedFixture(({ root, docs }) => {
  write(root, { "openspec/other.yaml": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["openspec/other.yaml"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "openspec/other.yaml": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md", () => trustedFixture(({ root, docs }) => {
  write(root, { "openspec/changes-old/x.md": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["openspec/changes-old/x.md"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "openspec/changes-old/x.md": 'Base.\n' }));
test("[coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/specs.md", () => trustedFixture(({ root, docs }) => {
  write(root, { "openspec/specs.md": 'Changed.\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["openspec/specs.md"]);
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}, { "openspec/specs.md": 'Base.\n' }));
for (const file of ['openspec/changes/archive/x/notes.md', 'openspec/specs/x.md', 'openspec/trace/gaps.json']) {
  test(`[coverage-gate-089] trust a changed file at ${file}`, () => trustedFixture(({ root, docs, commit }) => {
    appendFileSync(path.join(root, file), '\n');
    assert.equal(docs().output.split('\n')[0], `NO TEST RUN: the mode trusts the snapshot of commit ${commit}`);
  }, file === 'openspec/trace/gaps.json' ? {} : { [file]: 'Base.\n' }));
}
for (const [from, to] of [['openspec/changes/add-demo/design.md', 'docs/moved.md'], ['docs/base.md', 'openspec/changes/add-demo/moved.md']]) {
  test(`[coverage-gate-092] refuse a moved file from ${from}`, () => trustedFixture(({ root, docs }) => {
    mkdirSync(path.dirname(path.join(root, to)), { recursive: true });
    renameSync(path.join(root, from), path.join(root, to));
    git(root, 'add', '-A');
    const result = docs();
    assert.equal(result.status, 2, result.output);
    assert.ok(result.output.split('\n').includes(from.startsWith('docs/') ? 'docs/base.md' : 'docs/moved.md'));
  }, { [from]: 'Base.\n' }));
}
test('[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD', () => trustedFixture(({ root, fake, docs, commit }) => {
  const file = path.join(root, 'src/math.js');
  const original = readFileSync(file, 'utf8');
  writeFileSync(file, original.replace('a + b', 'b + a'));
  const historyFile = path.join(root, 'openspec/trace/history.jsonl');
  const before = readFileSync(historyFile, 'utf8').trim().split('\n').length;
  const ratchet = run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.match(ratchet.output, /Ratchet:/, ratchet.output);
  const lines = readFileSync(historyFile, 'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(lines.length, before + 1);
  assert.deepEqual(lines.at(-1).dirty, ['src/math.js']);
  writeFileSync(file, original);
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.ok(result.output.split('\n').includes('The ratchet ran with input files, code files or test files that differ from HEAD'));
  assert.ok(result.output.split('\n').includes('src/math.js'));
  assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
  run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  const clean = JSON.parse(readFileSync(historyFile, 'utf8').trim().split('\n').at(-1));
  assert.equal(Object.hasOwn(clean, 'dirty'), false);
  assert.match(docs().output, /^NO TEST RUN: the mode trusts the snapshot of commit /);
}));
test('[gap-ledger-131 gap-ledger-133] accept clean history without a dirty field', () => trustedFixture(({ root, fake }) => {
  const lines = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(Object.hasOwn(lines.at(-1), 'dirty'), false);
  lines.at(-1).dirty = ['src/math.js'];
  writeFileSync(path.join(root, 'openspec/trace/history.jsonl'), lines.map(line => JSON.stringify(line) + '\n').join(''));
  const result = run(root, ['check', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.doesNotMatch(result.output, /ERROR (HISTORY|LEDGER|WAIVER|REBASELINE)/);
  assert.match(result.output, /ERROR REVIEW-MISSING/);
}));

test('[coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory', () => trustedFixture(({ root, fake, docs }) => {
  appendFileSync(path.join(root, '.gitignore'), 'openspec/changes/add-demo/old.js\n');
  commitAll(root, 'ignore pattern');
  run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  git(root, 'rm', '--cached', 'openspec/changes/add-demo/old.js');
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ['openspec/changes/add-demo/old.js']);
}, {}, { 'openspec/changes/add-demo/old.js': 'export {};\n' }));
test("[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs", () => trustedFixture(({ root, docs }) => {
  write(root, { "node_modules-old/ignored.test.mjs": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["node_modules-old/ignored.test.mjs"]);
}, { '.gitignore': ".gev-cache/\nnode_modules-old/ignored.test.mjs\n" }));
test("[coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs", () => trustedFixture(({ root, docs }) => {
  write(root, { "scripts/qa-ignored.mjs": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["scripts/qa-ignored.mjs"]);
}, { '.gitignore': ".gev-cache/\nscripts/qa-ignored.mjs\n" }));
test("[coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json", () => trustedFixture(({ root, docs }) => {
  write(root, { "package-lock.json": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["package-lock.json"]);
}, { '.gitignore': ".gev-cache/\npackage-lock.json\n" }));
test("[coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile", () => trustedFixture(({ root, docs }) => {
  write(root, { "Makefile": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["Makefile"]);
}, { '.gitignore': ".gev-cache/\nMakefile\n" }));
test("[coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile", () => trustedFixture(({ root, docs }) => {
  write(root, { "Dockerfile": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["Dockerfile"]);
}, { '.gitignore': ".gev-cache/\nDockerfile\n" }));
test("[coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml", () => trustedFixture(({ root, docs }) => {
  write(root, { "compose.yaml": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["compose.yaml"]);
}, { '.gitignore': ".gev-cache/\ncompose.yaml\n" }));
test("[coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt", () => trustedFixture(({ root, docs }) => {
  write(root, { "scripts/spec/ignored.txt": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["scripts/spec/ignored.txt"]);
}, { '.gitignore': ".gev-cache/\nscripts/spec/ignored.txt\n" }));
test("[coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json", () => trustedFixture(({ root, docs }) => {
  write(root, { "package.json": '{}\n' });
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ["package.json"]);
}, { '.gitignore': ".gev-cache/\npackage.json\n" }));
test('[coverage-gate-078 coverage-gate-089] trust other ignored files', () => trustedFixture(({ root, docs, commit }) => {
  write(root, { 'ignored.txt': 'Text.\n', '.gev-cache/ignored.test.mjs': '{}\n', 'node_modules/p/x.test.mjs': '{}\n', 'packages/p/node_modules/x.test.mjs': '{}\n', 'dist/app.js': 'export {};\n', 'ignored.js': 'export {};\n' });
  assert.equal(docs().output.split('\n')[0], `NO TEST RUN: the mode trusts the snapshot of commit ${commit}`);
}, { '.gitignore': '.gev-cache/\nnode_modules/\n**/node_modules/\nignored.txt\ndist/\nignored.js\n' }));
test('[coverage-gate-090] refuse a staged file edit', () => trustedFixture(({ root, docs }) => {
  write(root, { 'src/math.js': 'export {};\n' });
  git(root, 'add', 'src/math.js');
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('src/math.js'));
}));
test('[coverage-gate-090] refuse an untracked input file', () => trustedFixture(({ root, docs }) => {
  write(root, { 'docs/new.md': 'New.\n' });
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('docs/new.md'));
}));
test('[coverage-gate-069] refuse a deleted test file', () => trustedFixture(({ root, docs }) => {
  rmSync(path.join(root, 'src/math.test.mjs'));
  const result = docs();
  assert.equal(result.status, 2);
  assert.ok(result.output.split('\n').includes('src/math.test.mjs'));
}));

test('[coverage-gate-073 coverage-gate-078] classify the ignored Node version', () => {
  assert.equal(protectedInput('.node-version', new Set()), true);
});
test('[gap-ledger-130] refuse a failed ratchet file comparison', () => trustedFixture(({ root, fake }) => {
  const before = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8');
  const result = run(root, ['ratchet', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn, gitSpawn: () => ({ status: 1, stdout: '' }) });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /ERROR GATES-RATCHET.*Git cannot compare input files, code files or test files/);
  assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), before);
}));
test('[gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history', () => trustedFixture(({ root, fake }) => {
  const code = readFileSync(path.join(root, 'src/math.js'), 'utf8');
  write(root, { 'src/math.js': code.replace('a + b', 'b + a'), 'docs/z.md': 'Z.\n', 'docs/a.md': 'A.\n', 'scripts/spec/ignored.txt': '{}\n' });
  const options = { openSpec: fake.openSpec, spawn: fake.spawn };
  const historyFile = path.join(root, 'openspec/trace/history.jsonl');
  run(root, ['ratchet', '--change', 'add-demo'], options);
  const before = readFileSync(historyFile, 'utf8');
  assert.deepEqual(JSON.parse(before.trim().split('\n').at(-1)).dirty, ['docs/a.md', 'docs/z.md', 'scripts/spec/ignored.txt', 'src/math.js']);
  run(root, ['ratchet', '--change', 'add-demo'], options);
  assert.equal(readFileSync(historyFile, 'utf8'), before);
  rmSync(path.join(root, 'docs/z.md'));
  run(root, ['ratchet', '--change', 'add-demo'], options);
  const after = readFileSync(historyFile, 'utf8');
  assert.equal(after.trim().split('\n').length, before.trim().split('\n').length + 1);
  assert.deepEqual(JSON.parse(after.trim().split('\n').at(-1)).dirty, ['docs/a.md', 'scripts/spec/ignored.txt', 'src/math.js']);
}, { '.gitignore': '.gev-cache/\nscripts/spec/ignored.txt\n' }));

test('[gap-ledger-134] add ignored name markers before the ratchet command', () => {
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  const command = text.match(/^GATES := .*$/m)?.[0] || '';
  assert.ok(text.indexOf('GATES_DOCS_MARKERS :=') < text.indexOf('GATES :='));
  assert.ok(command.includes('if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi;'));
});

test('[coverage-gate-069 coverage-gate-092] refuse a moved code file', () => trustedFixture(({ root, docs }) => {
  renameSync(path.join(root, 'src/math.js'), path.join(root, 'src/other.js'));
  git(root, 'add', '-A');
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.deepEqual(result.output.split('\n').slice(3, -2), ['src/math.js', 'src/other.js']);
}));


test('[coverage-gate-094] keep cache source contents after the container ends', () => withFixture(source => withFixture(root => {
  mkdirSync(path.join(source, 'openspec/trace'), { recursive: true });
  mkdirSync(path.join(root, 'openspec/trace'), { recursive: true });
  appendFileSync(path.join(source, '.gitignore'), 'openspec/trace/hidden.test.mjs\n');
  write(source, { '.gev-cache/private/app.js': 'Source contents.\n', 'openspec/trace/hidden.test.mjs': 'Trace source contents.\n', 'openspec/trace/visible.js': 'Copied contents.\n' });
  write(root, { 'openspec/trace/visible.js': 'Copied contents.\n' });
  write(root, { '.gev-cache/private/app.js': '{}', '.gev-cache/spec/measurement.json': 'Snapshot.\n' });
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  const expand = command => command.replaceAll('$$', '$').replaceAll('/src', source).replaceAll('/tmp/work', root).replaceAll('/tmp/doc-inputs', path.join(source, 'doc-inputs')).replaceAll('/tmp/doc-markers', path.join(source, 'doc-markers'));
  const markers = spawnSync('sh', ['-c', expand(text.match(/^GATES_DOCS_MARKERS := (.*)$/m)[1])], { encoding: 'utf8' });
  assert.equal(markers.status, 0, markers.stderr);
  assert.equal(readFileSync(path.join(source, 'doc-inputs'), 'utf8').includes('.gev-cache/private/app.js'), false);
  assert.deepEqual(readFileSync(path.join(source, 'doc-markers'), 'utf8').split('\0').filter(Boolean), ['openspec/trace/hidden.test.mjs']);
  assert.equal(readFileSync(path.join(root, 'openspec/trace/hidden.test.mjs'), 'utf8'), '{}');
  const back = spawnSync('sh', ['-c', expand(text.match(/^GATES_BACK := (.*)$/m)[1])], { encoding: 'utf8' });
  assert.equal(back.status, 0, back.stderr);
  assert.equal(readFileSync(path.join(source, '.gev-cache/private/app.js'), 'utf8'), 'Source contents.\n');
  assert.equal(readFileSync(path.join(source, 'openspec/trace/hidden.test.mjs'), 'utf8'), 'Trace source contents.\n');
  assert.equal(readFileSync(path.join(root, 'openspec/trace/visible.js'), 'utf8'), 'Copied contents.\n');
  assert.equal(existsSync(path.join(root, 'openspec/trace/hidden.test.mjs')), false);
  assert.equal(readFileSync(path.join(source, '.gev-cache/spec/measurement.json'), 'utf8'), 'Snapshot.\n');
})));

for (const [file, ids] of [['openspec/tracex/f.md', 'coverage-gate-091'], ['.gev-cachex/ignored.test.mjs', 'coverage-gate-078'], ['containers/Dockerfile.gates', 'coverage-gate-075 coverage-gate-078'], ['Dockerfileprod', 'coverage-gate-075 coverage-gate-078'], ['docker-compose.yml', 'coverage-gate-076 coverage-gate-078'], ['containers/compose.gates.yaml', 'coverage-gate-076 coverage-gate-078']]) {
  test(`[${ids}] refuse the input file at ${file}`, () => trustedFixture(({ root, docs }) => {
    write(root, { [file]: '{}\n' });
    const result = docs();
    assert.equal(result.status, 2, result.output);
    assert.ok(result.output.split('\n').includes(file));
    assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
  }, file === 'openspec/tracex/f.md' ? {} : { '.gitignore': `.gev-cache/\n${file}\n` }));
}
for (const prefix of ['openspec/changes/', 'openspec/specs/', 'openspec/trace/']) {
  for (const suffix of ['code.js', 'code.test.mjs']) {
    for (const tracked of [false, true]) {
      const file = prefix + suffix;
      test(`[coverage-gate-095] refuse a ${tracked ? 'tracked' : 'new'} ${suffix === 'code.js' ? 'code' : 'test'} file at ${file}`, () => trustedFixture(({ root, docs }) => {
        write(root, { [file]: 'export {};\n' });
        if (tracked) git(root, 'add', file);
        const result = docs();
        assert.equal(result.status, 2, result.output);
        assert.ok(result.output.split('\n').includes(file));
        assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
      }));
    }
  }
}
test('[coverage-gate-096] refuse a commit ref in history', () => trustedFixture(({ root, docs }) => {
  const file = path.join(root, 'openspec/trace/history.jsonl');
  const lines = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
  lines.at(-1).commit = 'HEAD';
  writeFileSync(file, lines.map(line => JSON.stringify(line) + '\n').join(''));
  const result = docs();
  assert.equal(result.status, 2, result.output);
  assert.ok(result.output.split('\n').includes('Ratchet commit: HEAD'));
  assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
}));
test('[coverage-gate-083] name the full check command', () => trustedFixture(({ root, fake }) => {
  const result = run(root, ['check', '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
  assert.match(result.output, /^Command: check\n/);
}));

test('[gap-ledger-126] read the new totals history line for the base ledger', () => {
  const baseLedger = { version: 4, coverage: { 'src/math.js': { loaded: true, sha: '5b63136552577a64d788dc3cd4552739d0d60f9e1adb63ec4dfb6932d56fc75d', untrue: false, lines: 1, branches: 0, functions: 0, totals: { lines: 4, branches: 1, functions: 1 }, origin: 'pre-spec', since: '2026-01-01' } }, untracedTests: { 'src/math.test.mjs': { names: { 'adds two numbers': 1 }, origin: 'pre-spec', since: '2026-01-01' }, 'tools/other.test.mjs': { names: { 'runs outside src': 1 }, origin: 'pre-spec', since: '2026-01-01' } } };
  withFixture(root => {
    const fake = oneMeasurement(root, { loaded: true });
    write(root, { 'openspec/changes/docs/proposal.md': 'The demo adds numbers.\n' });
    const result = run(root, ['ratchet', '--change', 'docs'], { spawn: fake.spawn, openSpec: fake.openSpec });
    assert.equal(existsSync(path.join(root, 'openspec/trace/history.jsonl')), true, result.output);
    const lines = readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(lines.some(line => line.file === 'src/math.js' && line.metric === 'totals'), true);
    assert.doesNotMatch(result.output, /ERROR LEDGER-TOTALS-NOT-BASE/);
    assert.match(result.output, /ERROR REVIEW-MISSING/);
  }, { base: { 'openspec/trace/gaps.json': JSON.stringify(baseLedger) + '\n' } });
});

test('[coverage-gate-069 coverage-gate-078] classify a protected ignored code file', () => {
  assert.equal(protectedInput('old.js', new Set(['old.js'])), true);
  assert.equal(protectedInput('new.js', new Set(['old.js'])), false);
});

for (const file of ['MyDockerfile', 'nested/MyDockerfile', 'Dockerfile.dir/notes.txt', 'compose-dir/file.yaml', 'compose/other.yaml', 'composeyml', 'compose.yaml.extra']) {
  test(`[${file.includes('Dockerfile') ? 'coverage-gate-075' : 'coverage-gate-076'}] do not protect the ignored file ${file}`, () => {
    assert.equal(protectedInput(file, new Set()), false);
  });
}
for (const form of ['short', 'suffix', 'prefix', 'letters']) {
  test(`[coverage-gate-096] refuse ${form === 'short' ? 'a short commit hash' : `a commit hash with ${form}`}`, () => trustedFixture(({ root, docs, commit }) => {
    git(root, 'branch', commit);
    git(root, 'branch', 'g'.repeat(40));
    const file = path.join(root, 'openspec/trace/history.jsonl');
    const lines = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse);
    const value = { short: commit.slice(0, 7), suffix: `${commit}^{commit}`, prefix: `refs/heads/${commit}`, letters: 'g'.repeat(40) }[form];
    lines.at(-1).commit = value;
    writeFileSync(file, lines.map(line => JSON.stringify(line) + '\n').join(''));
    const result = docs();
    assert.equal(result.status, 2, result.output);
    assert.ok(result.output.split('\n').includes(`Ratchet commit: ${value}`));
    assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
  }));
}

test('[coverage-gate-094] copy cache contents without a marker list', () => withFixture(source => withFixture(root => {
  mkdirSync(path.join(source, 'openspec/trace'), { recursive: true });
  mkdirSync(path.join(root, 'openspec/trace'), { recursive: true });
  write(source, { '.gev-cache/private/app.js': 'Source contents.\n' });
  write(root, { '.gev-cache/spec/measurement.json': 'Snapshot.\n' });
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  const command = text.match(/^GATES_BACK := (.*)$/m)[1].replaceAll('/src', source).replaceAll('/tmp/work', root).replaceAll('/tmp/doc-markers', path.join(source, 'doc-markers'));
  const result = spawnSync('sh', ['-c', command], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(readFileSync(path.join(source, '.gev-cache/private/app.js'), 'utf8'), 'Source contents.\n');
  assert.equal(readFileSync(path.join(source, '.gev-cache/spec/measurement.json'), 'utf8'), 'Snapshot.\n');
})));

test('[coverage-gate-097] stop before the container copies files when a marker cannot be removed', () => withFixture(source => withFixture(root => {
  mkdirSync(path.join(source, 'openspec/trace'), { recursive: true });
  mkdirSync(path.join(root, 'openspec/trace/bad.test.mjs'), { recursive: true });
  write(source, { '.gev-cache/spec/measurement.json': 'Old snapshot.\n', 'doc-markers': 'openspec/trace/bad.test.mjs\0' });
  write(root, { '.gev-cache/spec/measurement.json': 'New snapshot.\n' });
  const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
  const command = text.match(/^GATES_BACK := (.*)$/m)[1].replaceAll('/src', source).replaceAll('/tmp/work', root).replaceAll('/tmp/doc-markers', path.join(source, 'doc-markers'));
  const result = spawnSync('sh', ['-c', command], { encoding: 'utf8' });
  assert.notEqual(result.status, 0, result.stderr);
  assert.equal(readFileSync(path.join(source, '.gev-cache/spec/measurement.json'), 'utf8'), 'Old snapshot.\n');
})));

for (const file of ['docs/openspec/trace/x.md', 'docs/openspec/changes/x.md', 'src/openspec/specs/x.md']) {
  test(`[coverage-gate-098] refuse a prefix inside ${file}`, () => trustedFixture(({ root, docs, commit }) => {
    write(root, { [file]: 'Changed.\n' });
    const result = docs();
    assert.equal(result.status, 2, result.output);
    assert.deepEqual(result.output.split('\n').slice(3, -2), [file]);
    assert.ok(result.output.split('\n').includes(`Ratchet commit: ${commit}`));
    assert.doesNotMatch(result.output, /Gates passed|Gates failed/);
  }));
}

for (const command of ['lint', 'init', 'adopt', 'waive', 'rebaseline', 'tree', 'ci']) {
  test(`[coverage-gate-083] omit time lines for ${command}`, () => withFixture(root => {
    const fake = oneMeasurement(root);
    const result = run(root, [command, '--change', 'add-demo'], { openSpec: fake.openSpec, spawn: fake.spawn });
    assert.doesNotMatch(result.output, /Started:|Finished:|Phase /);
  }));
}

const MARKER_FILES = ['Makefile', '.node-version', 'package.json', 'package-lock.json', 'containers/Dockerfile.gates', 'Dockerfile', 'docker-compose.yml', 'compose.yaml', 'containers/compose.gates.yaml', 'containers/compose.gates.yml', 'scripts/qa-x.mjs', 'src/a.test.mjs', 'scripts/spec/x.mjs', ...['js', 'cjs', 'ts', 'mts', 'cts', 'jsx', 'tsx', 'html', 'sh', 'mjs'].map(ext => `src/deep/x.${ext}`), '.gev-cache/x.js', 'node_modules/x.js'];
for (const file of MARKER_FILES) {
  test(`[coverage-gate-099] check the marker class at ${file}`, () => withFixture(source => withFixture(root => {
    git(source, 'rm', '-r', '--cached', '.');
    write(source, { '.gitignore': `${file}\n`, [file]: 'Source contents.\n' });
    rmSync(path.join(root, file), { force: true });
    const text = readFileSync(path.join(PROJECT_ROOT, 'Makefile'), 'utf8');
    const markerLine = text.match(/^GATES_DOCS_MARKERS := (.*)$/m)[1];
    const pathspec = {
      'Makefile': 'Makefile', '.node-version': '.node-version', 'package.json': 'package.json', 'package-lock.json': 'package-lock.json',
      'containers/Dockerfile.gates': ':(glob)**/Dockerfile*', 'Dockerfile': ':(glob)**/Dockerfile*',
      'docker-compose.yml': ':(glob)**/*compose*.yml', 'compose.yaml': ':(glob)**/*compose*.yaml',
      'containers/compose.gates.yaml': ':(glob)**/*compose*.yaml', 'containers/compose.gates.yml': ':(glob)**/*compose*.yml',
      'scripts/qa-x.mjs': ':(glob)scripts/qa-*.mjs', 'src/a.test.mjs': ':(glob)**/*.test.mjs', 'scripts/spec/x.mjs': 'scripts/spec',
      '.gev-cache/x.js': ':(exclude,glob).gev-cache/**', 'node_modules/x.js': ':(exclude,glob)**/node_modules/**',
    }[file] ?? `:(glob)**/*.${file.split('.').at(-1)}`;
    assert.ok(markerLine.includes(`"${pathspec}"`), pathspec);
    const command = text.match(/^GATES_DOCS_MARKERS := (.*)$/m)[1].replaceAll('$$', '$').replaceAll('/src', source).replaceAll('/tmp/work', root).replaceAll('/tmp/doc-inputs', path.join(source, 'doc-inputs')).replaceAll('/tmp/doc-markers', path.join(source, 'doc-markers'));
    const result = spawnSync('sh', ['-c', command], { cwd: source, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const excluded = file.startsWith('.gev-cache/') || file.startsWith('node_modules/');
    assert.equal(existsSync(path.join(root, file)), !excluded);
    assert.deepEqual(readFileSync(path.join(source, 'doc-markers'), 'utf8').split('\0').filter(Boolean), excluded ? [] : [file]);
    if (!excluded) assert.equal(readFileSync(path.join(root, file), 'utf8'), '{}');
  })));
}

test('[coverage-gate-100] check QA capability names without tests', () => trustedFixture(({ root, docs }) => {
  write(root, { 'openspec/specs/x/.gitkeep': '' });
  rmSync(path.join(root, 'openspec/specs/unknown'), { recursive: true });
  const result = docs();
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /ERROR QA-COVERS-LANDED scripts\/qa-example\.mjs/);
  assert.match(result.output, /ERROR QA-COVERS-UNKNOWN scripts\/qa-example\.mjs/);
}, { 'scripts/qa-example.mjs': QA_HEADER('unknown,pending:x'), 'openspec/specs/unknown/.gitkeep': '' }));

test('[gap-ledger-135] include new trace content in the review tree', () => trustedFixture(({ root, fake }) => {
  commitAll(root, 'trace');
  git(root, 'checkout', '-q', 'main');
  git(root, 'merge', '-q', '--ff-only', 'work');
  git(root, 'checkout', '-q', 'work');
  const file = path.join(root, 'openspec/trace/links.json');
  writeFileSync(file, '{}\n');
  commitAll(root, 'base links');
  git(root, 'branch', '-f', 'main', 'HEAD');
  reviewFor(root, 'add-demo');
  const options = { spawn: fake.spawn, openSpec: fake.openSpec };
  const ratchet = run(root, ['ratchet', '--change', 'add-demo'], options);
  const check = run(root, ['check', '--change', 'add-demo'], options);
  assert.match(ratchet.output, /ERROR REVIEW-TREE/);
  assert.equal(ratchet.output.split('\n').find(line => line.startsWith('ERROR REVIEW-TREE')), check.output.split('\n').find(line => line.startsWith('ERROR REVIEW-TREE')));
  assert.notEqual(readFileSync(file, 'utf8'), '{}\n');
}));

test('[change-review-033] pin the agent verdict and final tree instructions', () => {
  const text = readFileSync(path.join(PROJECT_ROOT, 'AGENTS.md'), 'utf8');
  assert.ok(text.includes('9. Read the first line of the log to find which command ran. The ratchet command gives the comparison verdict after it writes the files. A ratchet command that stops before the comparisons gives no comparison verdict.'));
  assert.ok(text.includes('Run `make gates CHANGE=<name>` on the final tree.'));
});

const TOLERANCE_OPTIONS = {
  openSpec: (_root, args) => ({ status: 0, stdout: args[0] === '--version' ? '1.3.1' : '{"items":[]}' }),
  spawn: (_command, args, options) => {
    const root = options.cwd;
    const runs = JSON.parse(readFileSync(args[1], 'utf8'));
    const files = Object.keys(JSON.parse(readFileSync(path.join(root, '.gev-cache/spec/inventory.json'), 'utf8')));
    const text = files.map(file => `SF:${root}/${file}\nLF:100\nLH:100\nBRF:100\nBRH:${file === 'src/merged.js' || file === 'src/legacy.js' ? 99 : 100}\nFNF:100\nFNH:100\nend_of_record\n`).join('');
    writeFileSync(path.join(path.dirname(args[1]), 'lcov.info'), text);
    writeFileSync(path.join(runs[0].env.NODE_V8_COVERAGE, 'coverage-1-1-0.json'), '{"result":[]}');
    writeFileSync(path.join(root, '.gev-cache/spec/guard-999.jsonl'), JSON.stringify({ checked: files, violations: [], assertions: [], leaks: [] }) + '\n');
    const records = runs.flatMap(run => run.args.filter(arg => !arg.startsWith('--') && arg.endsWith('.test.mjs')).map(file => ({ file, name: 'fixture', title: 'fixture', kind: 'test', status: 'pass', tags: [], tagError: null, line: 1, column: 1, fullName: 'fixture', leaf: true })));
    writeFileSync(path.join(path.dirname(args[1]), 'tests-main.jsonl.sync'), records.map(record => JSON.stringify(record) + '\n').join(''));
    writeFileSync(args[2], JSON.stringify(runs.map(() => ({ status: 0, error: null }))));
    return { status: 0 };
  },
};

function adoptedNoise(root, worse = false) {
  const file = 'src/merged.js';
  rmSync(path.join(root, 'src/own.js'));
  rmSync(path.join(root, 'src/own.test.mjs'));
  write(root, { 'src/math.test.mjs': MATH_TEST() });
  run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
  const measured = parseLcov(readFileSync(path.join(root, '.gev-cache/spec/lcov.info'), 'utf8'), { root }).get(file);
  const ledger = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'));
  ledger.coverage[file] = {
    loaded: true, untrue: false, sha: contentHash(readFileSync(path.join(root, file), 'utf8')),
    lines: measured.lines.total - measured.lines.covered + 1,
    branches: measured.branches.total - measured.branches.covered - (worse ? 1 : 0),
    functions: measured.functions.total - measured.functions.covered,
    totals: { lines: measured.lines.total, branches: measured.branches.total, functions: measured.functions.total },
    origin: 'sync', since: '2026-09-13',
  };
  ledger.untracedTests['src/merged.test.mjs'] = { names: { fixture: 1 }, origin: 'sync', since: '2026-09-13' };
  write(root, { 'openspec/trace/gaps.json': JSON.stringify(ledger) + '\n' });
  appendFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify(ADOPT_LINE(root, 'src/merged.test.mjs', { lines: null, branches: null, functions: null, untraced: 1, untrue: false })) + '\n');
  const line = ADOPT_LINE(root, file, { lines: ledger.coverage[file].lines, branches: ledger.coverage[file].branches, functions: ledger.coverage[file].functions, untraced: 0, untrue: false });
  appendFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify(line) + '\n');
  return line;
}

const NOISE_SOURCE = BRANCH_SRC('merged') + '\n'.repeat(60);

test('[gap-ledger-136 gap-ledger-140 gap-ledger-144] use the adopted source in check ci and the ratchet command', () => {
  withMergeFixture((root) => {
    adoptedNoise(root, true);
    write(root, { 'openspec/changes/sync/tasks.md': '## 1. Merge\n\n- [x] Merge the branch.\n' });
    mkdirSync(path.join(root, 'openspec/changes/archive'));
    renameSync(path.join(root, 'openspec/changes/sync'), path.join(root, 'openspec/changes/archive/2026-09-13-sync'));
    commitAll(root, 'record source counts');
    for (const command of ['check', 'ci', 'ratchet']) {
      const result = run(root, command === 'ci' ? [command] : [command, '--change', 'sync'], TOLERANCE_OPTIONS);
      assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);
      assert.doesNotMatch(result.output, /ERROR GATES-RATCHET/);
      assert.doesNotMatch(result.output, /ERROR LEDGER-(?:STALE|LARGER-GAP|LOST-COVERAGE)[^\n]*src\/merged\.js/);
    }
    assert.equal(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/merged.js'].branches, 0);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-137] use no new tolerance after an adopted source edit', () => {
  withMergeFixture((root) => {
    write(root, { 'src/merged.js': NOISE_SOURCE + '// Local edit.\n' });
    adoptedNoise(root);
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-138] use no new tolerance for an invalid adopt source', () => {
  withMergeFixture((root) => {
    const line = adoptedNoise(root);
    line.from = git(root, 'rev-parse', 'HEAD');
    write(root, { 'openspec/trace/history.jsonl': JSON.stringify(line) + '\n' });
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.match(result.output, /ERROR LEDGER-ADOPT-FROM src\/merged\.js/);
    assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-139] use no new tolerance from another change', () => {
  withMergeFixture((root) => {
    const line = adoptedNoise(root);
    line.change = 'another';
    write(root, { 'openspec/trace/history.jsonl': JSON.stringify(line) + '\n' });
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-145] give no new tolerance to an absent adopted file', () => {
  withMergeFixture((root) => {
    adoptedNoise(root);
    rmSync(path.join(root, 'src/merged.js'));
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-146] need the production file in a valid adopt record', () => {
  withMergeFixture((root) => {
    adoptedNoise(root);
    const lines = historyLines(root).filter(line => line.file !== 'src/merged.js');
    assert.equal(lines.length, 1);
    assert.equal(lines[0].file, 'src/merged.test.mjs');
    write(root, { 'openspec/trace/history.jsonl': lines.map(line => JSON.stringify(line) + '\n').join('') });
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-069] keep count tolerance for base content in the gate', () => {
  withMergeFixture((root) => {
    adoptedNoise(root);
    const file = 'src/legacy.js';
    const ledger = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'));
    ledger.coverage[file].branches = 0;
    write(root, { 'openspec/trace/gaps.json': JSON.stringify(ledger) + '\n' });
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.doesNotMatch(result.output, /ERROR LEDGER-(?:STALE|LOST-COVERAGE)[^\n]*src\/legacy\.js/);
    assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});

test('[gap-ledger-081] keep the waiver count for an edited adopted file in the gate', () => {
  withMergeFixture((root) => {
    adoptedNoise(root);
    const file = 'src/merged.js';
    const ledger = JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'));
    ledger.coverage[file].branches = 0;
    write(root, { 'openspec/trace/gaps.json': JSON.stringify(ledger) + '\n', [file]: NOISE_SOURCE + '// Local edit.\n' });
    appendFileSync(path.join(root, 'openspec/trace/history.jsonl'), JSON.stringify({ kind: 'waiver', change: 'sync', file, metric: 'branches', count: 1, sha: contentHash(readFileSync(path.join(root, file), 'utf8')) }) + '\n');
    const result = run(root, ['check', '--change', 'sync'], TOLERANCE_OPTIONS);
    assert.doesNotMatch(result.output, /ERROR LEDGER-LARGER-GAP src\/merged\.js/);
    assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);
  }, {}, { 'src/merged.js': NOISE_SOURCE }, TOLERANCE_OPTIONS);
});
