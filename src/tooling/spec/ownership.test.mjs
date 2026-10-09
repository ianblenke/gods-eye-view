import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import childProcess, { spawnSync } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { parseOwnership, readOwnership, isAdoptSource, classify, ownershipAdvice, parseDiffLines, changedLines, syncChangedLines, parseLineCoverage, coverageFaults, gapReport } from '../../../scripts/spec/lib/ownership.mjs';
import { readQaRegister, qaAdvice } from '../../../scripts/spec/lib/qa-register.mjs';
import { createCoverage, addProcess, coverageLcov } from '../../../scripts/spec/lib/v8-merge.mjs';
import { writeMeasurement, trustMeasurement } from '../../../scripts/spec/lib/measurement.mjs';

for (const key of Object.keys(process.env)) if (key.startsWith('GIT_')) delete process.env[key];
Object.assign(process.env, {
  GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', LC_ALL: 'C',
  GIT_CONFIG_COUNT: '4', GIT_CONFIG_KEY_0: 'user.name', GIT_CONFIG_VALUE_0: 'Test',
  GIT_CONFIG_KEY_1: 'user.email', GIT_CONFIG_VALUE_1: 'test@example.com',
  GIT_CONFIG_KEY_2: 'safe.directory', GIT_CONFIG_VALUE_2: '*',
  GIT_CONFIG_KEY_3: 'commit.gpgsign', GIT_CONFIG_VALUE_3: 'false',
});

const manifest = { version: 1, owned: ['src/own/', 'single.js'] };
function fixture(fn) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-ownership-'));
  const put = (file, text) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), text); };
  try { return fn({ root, put }); } finally { rmSync(root, { recursive: true, force: true }); }
}
const record = (file = 'src/own/a.js', patch = {}) => ({ file, sha: 'hash', loaded: true, untrue: false, complete: false, lines: { total: 4, uncovered: 1 }, branches: { total: 2, uncovered: 1 }, functions: { total: 1, uncovered: 1 }, ...patch });
const waiver = (metric = 'lines', patch = {}) => ({ file: 'src/own/a.js', sha: 'hash', metric, count: 1, lines: [2], ...patch });
const faults = (patch = {}) => coverageFaults({ manifest, coverage: [record()], changed: {}, lineCoverage: {}, waivers: [], ...patch });

test('[ownership-001] accepts the manifest contract', () => fixture(({ root, put }) => {
  assert.deepEqual(parseOwnership(JSON.stringify(manifest)), { version: 1, owned: ['src/own/', 'single.js'] });
  assert.deepEqual(parseOwnership('{"version":1,"owned":[]}'), { version: 1, owned: [] });
  put('openspec/ownership.json', JSON.stringify(manifest));
  assert.deepEqual(readOwnership(root), { manifest: { version: 1, owned: ['src/own/', 'single.js'] }, errors: [] });
}));
test('[ownership-001] rejects each bad manifest field', () => {
  for (const bad of [null, [], {}, { ...manifest, version: 2 }, { ...manifest, version: '1' }, { ...manifest, owned: 'src/' }, { ...manifest, extra: 1 }, { ...manifest, owned: ['a', 'a'] }]) {
    assert.throws(() => parseOwnership(JSON.stringify(bad)), /version 1/);
  }
  for (const item of ['', 1, null, '/src/', '../a', './a', 'src/../a', 'src/./a', 'src//a', 'src\\a', 'a\n', 'a*', 'a?', 'a directory/']) {
    assert.throws(() => parseOwnership(JSON.stringify({ version: 1, owned: [item] })), /version 1/);
  }
  assert.throws(() => parseOwnership('{'), SyntaxError);
});
test('[ownership-001] returns an error with the code OWNERSHIP-MANIFEST for an absent or invalid manifest file', () => fixture(({ root, put }) => {
  assert.equal(readOwnership(root).errors[0].code, 'OWNERSHIP-MANIFEST');
  assert.equal(readOwnership(root).errors[0].file, 'openspec/ownership.json');
  assert.equal(typeof readOwnership(root).errors[0].message, 'string');
  assert.notEqual(readOwnership(root).errors[0].message.length, 0);
  put('openspec/ownership.json', '{}');
  assert.deepEqual(readOwnership(root).errors, [{ code: 'OWNERSHIP-MANIFEST', file: 'openspec/ownership.json', message: 'Use version 1 and unique safe relative paths in the owned array.' }]);
}));
test('[ownership-002] classifies exact paths and directory prefixes', () => {
  for (const file of ['single.js', 'src/own/a.js', 'src/own/sub/a.js']) assert.equal(classify(manifest, file), 'owned');
  for (const file of ['single.js/a', 'single.jsx', 'src/own', 'src/owner/a.js', 'other.js']) assert.equal(classify(manifest, file), 'upstream');
  assert.equal(classify({ version: 1, owned: [] }, 'src/own/a.js'), 'upstream');
  assert.equal(classify({ version: 1, owned: ['single.js/'] }, 'single.js/a'), 'owned');
  assert.equal(classify({ version: 1, owned: ['single.js/'] }, 'single.js'), 'upstream');
});
test('[ownership-003] shows each path class and totals', () => {
  assert.deepEqual(ownershipAdvice(manifest, ['single.js', 'other.js', 'src/own/a.js']), ['Class: owned single.js', 'Class: upstream other.js', 'Class: owned src/own/a.js', 'Ownership: 2 owned, 1 upstream']);
  assert.deepEqual(ownershipAdvice(manifest, []), ['Ownership: 0 owned, 0 upstream']);
  assert.deepEqual(ownershipAdvice(manifest, ['deleted.js', 'single.js']), ['Class: upstream deleted.js', 'Class: owned single.js', 'Ownership: 1 owned, 1 upstream']);
});
test('[ownership-004] rejects all owned gap metrics', () => {
  assert.deepEqual(faults(), [{ code: 'COVERAGE-OWNED', file: 'src/own/a.js', message: 'Owned code needs full line, branch and function coverage.' }]);
  for (const metric of ['lines', 'branches', 'functions']) {
    const item = record();
    for (const key of ['lines', 'branches', 'functions']) item[key].uncovered = key === metric ? 1 : 0;
    assert.equal(faults({ coverage: [item] }).length, 1);
  }
  assert.deepEqual(faults({ coverage: [record('other.js')] }), []);
  assert.deepEqual(faults({ coverage: [record(undefined, { complete: true })] }), []);
  assert.deepEqual(faults({ waivers: [waiver(), waiver('branches'), waiver('functions')] }), []);
  for (const patch of [{ sha: 'old' }, { file: 'other.js' }, { count: 0 }, { count: -1 }, { count: 0.5 }]) assert.equal(faults({ waivers: [waiver('lines', patch), waiver('branches'), waiver('functions')] }).length, 1);
  for (const patch of [{ loaded: false }, { untrue: true }, { branches: null }, { functions: null }]) assert.equal(faults({ coverage: [record(undefined, patch)], waivers: [waiver(), waiver('branches'), waiver('functions')] }).length, 1);
});
test('[ownership-005] reads only added diff ranges', () => {
  assert.deepEqual(parseDiffLines('noise\n@@ -2,3 +2,2 @@\n+x\n+y\n@@ -8 +7 @@\n@@ -12,2 +10,0 @@\n@@ -14,0 +11,2 @@\n'), [2, 3, 7, 11, 12]);
  assert.deepEqual(parseDiffLines('@@ -1 +1,1 @@\n@@ -1 +1,1 @@\n'), [1]);
});
test('[ownership-005] reads real edited new and deleted files', () => fixture(({ root, put }) => {
  const git = (...args) => { const result = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: root, encoding: 'utf8' }); assert.equal(result.status, 0, result.stderr); return result.stdout.trim(); };
  git('init', '-q', '-b', 'main'); put('a.js', 'a\nb\nc\n'); put('gone.js', 'old\n'); put('binary.js', 'old\0text\n');
  git('add', '.'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'base');
  const base = git('rev-parse', 'HEAD');
  put('a.js', 'a\nnew\nc\nextra\n'); put('new.js', 'one\ntwo'); put('trail.js', 'one\ntwo\n'); put('empty.js', ''); put('binary.js', 'a\0b\n'); rmSync(path.join(root, 'gone.js'));
  assert.deepEqual(changedLines({ root, base, files: ['a.js', 'new.js', 'empty.js', 'gone.js', 'binary.js', 'trail.js'] }), { 'a.js': [2, 4], 'new.js': [1, 2], 'empty.js': [], 'binary.js': [1], 'trail.js': [1, 2] });
  assert.throws(() => changedLines({ root, base: 'bad-ref', files: ['a.js'] }), /Git cannot read/);
}));
test('[ownership-006] keeps only lines that every duplicate LCOV record covers', () => {
  const text = 'DA:9,1\nSF:/repo/a.js\nDA:1,2\nDA:2,0\nDA:3,1\nend_of_record\nSF:/repo/a.js\nDA:1,1\nDA:2,1\nDA:4,1\nend_of_record\nSF:b.js\nDA:7,1\n';
  assert.deepEqual(parseLineCoverage(text, '/repo'), { 'a.js': [1], 'b.js': [7] });
  assert.deepEqual(parseLineCoverage('SF:a.js\nDA:1,0\nSF:a.js\nDA:1,1\n', '/repo'), { 'a.js': [] });
  assert.deepEqual(parseLineCoverage('', '/repo'), {});
  assert.deepEqual(parseLineCoverage('SF:a.js\nDA:3,1\nDA:1,1\n', '/repo'), { 'a.js': [1, 3] });
});
test('[ownership-007] lists all uncovered changed lines in both classes', () => {
  const input = { coverage: [record('other.js', { complete: true }), record(undefined, { complete: true })], changed: { 'other.js': [1, 2, 3], 'src/own/a.js': [2] }, lineCoverage: { 'other.js': [1] } };
  assert.deepEqual(faults(input), [
    { code: 'COVERAGE-DIFF', file: 'other.js', lines: [2, 3], message: 'Changed lines need coverage: 2, 3.' },
    { code: 'COVERAGE-DIFF', file: 'src/own/a.js', lines: [2], message: 'Changed lines need coverage: 2.' },
  ]);
  for (const patch of [{ loaded: false }, { untrue: true }]) assert.deepEqual(faults({ coverage: [record('other.js', patch)], changed: { 'other.js': [2] }, lineCoverage: { 'other.js': [2] } }), [{ code: 'COVERAGE-DIFF', file: 'other.js', lines: [2], message: 'Changed lines need coverage: 2.' }]);
  assert.equal(faults({ coverage: [], changed: { 'other.js': [2] }, lineCoverage: { 'other.js': [2] } })[0].code, 'COVERAGE-DIFF');
  assert.deepEqual(faults({ coverage: [], changed: { 'gone.js': [] } }), []);
});
test('[ownership-008] limits a line waiver to its file hash, its metric and its count', () => {
  const input = { coverage: [record('other.js')], changed: { 'other.js': [1, 2, 3] }, lineCoverage: { 'other.js': [1] }, waivers: [waiver('lines', { file: 'other.js', count: 2, lines: [2, 3] })] };
  assert.deepEqual(faults(input), []);
  for (const patch of [{ sha: 'old' }, { file: 'wrong.js' }, { metric: 'branches' }, { count: 1 }, { lines: [4, 5] }, { count: 0 }, { count: 1.5 }]) assert.equal(faults({ ...input, waivers: [{ ...input.waivers[0], ...patch }] })[0].code, 'COVERAGE-DIFF');
  assert.deepEqual(faults({ ...input, waivers: [waiver('lines', { file: 'other.js', lines: [2] }), waiver('lines', { file: 'other.js', lines: [3] })] }), []);
  assert.equal(faults({ ...input, coverage: [record('other.js', { untrue: true })] })[0].code, 'COVERAGE-DIFF');
});
test('[ownership-011] separates code and test gaps by class', () => {
  assert.deepEqual(gapReport(manifest, { coverage: { 'src/own/a.js': { lines: 2 }, 'other.js': { lines: 7 } }, untracedTests: { 'src/own/a.test.mjs': { names: { one: 1, two: 1 } }, 'other.test.mjs': { names: { three: 1 } } } }), [
    'Owned gaps: 1 code files, 2 lines, 1 test files, 2 tests.', 'owned code: src/own/a.js', 'owned tests: src/own/a.test.mjs',
    'Upstream gaps: 1 code files, 7 lines, 1 test files, 1 tests.', 'upstream code: other.js', 'upstream tests: other.test.mjs',
  ]);
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: {} }), ['Owned gaps: 0 code files, 0 lines, 0 test files, 0 tests.', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
});
test('[ownership-012] has the process rules and the adopt rules for QA scripts in AGENTS.md and config.yaml', () => {
  const root = new URL('../../../', import.meta.url);
  const text = readFileSync(new URL('AGENTS.md', root), 'utf8');
  assert.match(text, /Keep each owned code file that a change adds or edits at 100% line, branch and function coverage\./);
  assert.match(text, /Each owned code file without a ledger entry also needs full coverage\./);
  assert.match(text, /Keep 100% line coverage for each line that a change adds or edits in a code file\./);
  assert.match(text, /For a sync, a changed line needs no coverage when it equals the file in the commit that the adopt command names\./);
  assert.match(text, /Use `adopt` for each file that the merge brings and that has a coverage gap\./);
  assert.match(text, /23\. `openspec\/ownership.json` lists the owned paths/);
  assert.match(text, /24\..*review.md.*files.*resolved by hand/);
  assert.match(text, /24\..*Resolved files:.*Scope: full/);
  assert.match(text, /25\..*retire the scenario or write it again/);
  assert.match(text, /A backfill is a change that adds specs and tests for old code that another change needs\./);
  assert.match(text, /node scripts\/spec\/gates.mjs report/);
  assert.match(text, /lists all ledger gaps of both classes/);
  assert.match(text, /The owner reads each manifest diff that removes an owned path/);
  assert.match(text, /The command writes the adopt record for that script/);
  const config = readFileSync(new URL('openspec/config.yaml', root), 'utf8');
  assert.match(config, /Each owned code file that a change adds or edits needs 100% line, branch and function coverage\./);
  assert.match(config, /Each owned code file without a ledger entry also needs full coverage\./);
  assert.match(config, /For a sync, a changed line needs no coverage when it equals the file in the commit that the adopt command names\./);
  assert.match(config, /For an upstream QA script with no current or base QA tag, run the adopt command\./);
  assert.match(config, /The adopt command writes the adopt record for that script, also when the script is new\./);
  assert.match(config, /Do not write history records by hand\./);
  assert.match(config, /Use `adopt` to record the gap of upstream code in the ledger\./);
});
test('[ownership-013] writes merged DA counts for each code line', () => {
  const state = createCoverage(() => 'a\nb\nc\n');
  addProcess(state, { result: [{ url: 'file:///repo/a.js', functions: [{ functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: 6, count: 5 }, { startOffset: 2, endOffset: 4, count: 0 }] }] }] });
  assert.match(coverageLcov(state), /DA:1,1\nDA:2,0\nDA:3,1\n/);
});
test('[ownership-013] stores line data in the snapshot', () => fixture(({ root, put }) => {
  put('.gev-cache/spec/empty', '');
  const measured = { coverage: [{ file: 'a.js' }], records: [{ file: 'a.test.mjs' }], assertions: new Map([['a.test.mjs', 2]]), inventory: ['a.js'], testFiles: ['a.test.mjs'], untrue: new Set(['b.js']), lineCoverage: { 'a.js': [1, 3] } };
  writeMeasurement(root, measured);
  const text = readFileSync(path.join(root, '.gev-cache/spec/measurement.json'), 'utf8');
  assert.deepEqual(JSON.parse(text), { coverage: [{ file: 'a.js' }], lineCoverage: { 'a.js': [1, 3] }, records: [{ file: 'a.test.mjs' }], assertions: [['a.test.mjs', 2]], inventory: ['a.js'], testFiles: ['a.test.mjs'], untrue: ['b.js'] });
}));

test('[ownership-004 ownership-008] ignores fractional and negative waiver counts', () => {
  assert.deepEqual(faults({ waivers: [waiver('lines', { count: 1.5 }), waiver('branches'), waiver('functions')] }).map(item => item.code), ['COVERAGE-OWNED']);
  assert.deepEqual(faults({ waivers: [waiver(), waiver('branches'), waiver('functions'), waiver('lines', { count: -1 })] }), []);
  const input = { coverage: [record('other.js')], changed: { 'other.js': [2, 3] }, lineCoverage: {}, waivers: [waiver('lines', { file: 'other.js', count: 2.5, lines: [2, 3] })] };
  assert.deepEqual(faults(input).map(item => item.lines), [[2, 3]]);
});

test('[ownership-007 ownership-008] rejects all line waivers for an untrue file', () => {
  const result = faults({ coverage: [record('other.js', { untrue: true })], changed: { 'other.js': [1, 2, 3] }, lineCoverage: { 'other.js': [1] }, waivers: [waiver('lines', { file: 'other.js', count: 2, lines: [2, 3] })] });
  assert.deepEqual(result, [{ code: 'COVERAGE-DIFF', file: 'other.js', lines: [1, 2, 3], message: 'Changed lines need coverage: 1, 2, 3.' }]);
});

test('[ownership-004] prints each owned gap after an upstream file', () => {
  assert.deepEqual(faults({ coverage: [record('other.js'), record(), record('single.js')] }).map(item => item.file), ['src/own/a.js', 'single.js']);
});

test('[ownership-014] counts every test instance', () => {
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: { one: 2, two: 1 } }, 'other.test.mjs': { names: { three: 4 } } } }), [
    'Owned gaps: 0 code files, 0 lines, 1 test files, 3 tests.', 'owned tests: single.js',
    'Upstream gaps: 0 code files, 0 lines, 1 test files, 4 tests.', 'upstream tests: other.test.mjs',
  ]);
});

test('[ownership-001] accepts the first and last characters of each allowed character range', () => {
  assert.deepEqual(parseOwnership('{"version":1,"owned":["AZaz09_.-/Zz9/"]}'), { version: 1, owned: ['AZaz09_.-/Zz9/'] });
});
test('[ownership-016] sorts all line numbers as numbers', () => {
  assert.deepEqual(parseDiffLines('@@ -1 +20 @@\n@@ -1 +2 @@\n@@ -1 +10 @@\n'), [2, 10, 20]);
  assert.deepEqual(parseLineCoverage('SF:a.js\nDA:20,1\nDA:2,1\nDA:10,1\n', '/repo'), { 'a.js': [2, 10, 20] });
});
test('[ownership-017] ignores a DA record with a text prefix or suffix and a diff header with a text prefix', () => {
  assert.deepEqual(parseDiffLines('prefix@@ -1 +2 @@\n'), []);
  assert.deepEqual(parseLineCoverage('SF:a.js\nprefixDA:2,1\nDA:3,1suffix\n', '/repo'), { 'a.js': [] });
});
test('[ownership-018] adds owned file gaps across ledger entries and adds the waiver counts of one file', () => {
  assert.deepEqual(gapReport(manifest, { coverage: { 'src/own/a.js': { lines: 2 }, 'src/own/b.js': { lines: 3 } }, untracedTests: {} }), ['Owned gaps: 2 code files, 5 lines, 0 test files, 0 tests.', 'owned code: src/own/a.js', 'owned code: src/own/b.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
  assert.deepEqual(faults({ coverage: [record(undefined, { lines: { total: 4, uncovered: 2 } })], waivers: [waiver(), waiver('lines', { lines: [3] }), waiver('branches'), waiver('functions')] }), []);
  assert.deepEqual(faults({ coverage: [record(undefined, { lines: { total: 4, uncovered: 2 } })], waivers: [waiver('lines', { count: 2, lines: [2, 3] }), waiver('branches'), waiver('functions')] }), []);
});

test('[ownership-005] uses each Git diff option', () => fixture(({ root, put }) => {
  put('a.js', 'one\n');
  const native = childProcess.spawnSync;
  const calls = [];
  childProcess.spawnSync = (command, args) => { calls.push([command, args]); return { status: 0, stdout: '@@ -1 +2 @@\n', stderr: '' }; };
  syncBuiltinESMExports();
  try {
    assert.deepEqual(changedLines({ root, base: 'base-hash', files: ['a.js'] }), { 'a.js': [2] });
    assert.deepEqual(calls, [['git', ['diff', '--text', '--no-ext-diff', '--no-textconv', '--no-renames', '-U0', 'base-hash', '--', 'a.js']], ['git', ['cat-file', '-e', 'base-hash:a.js']]]);
  } finally { childProcess.spawnSync = native; syncBuiltinESMExports(); }
}));

test('[ownership-018] adds test counts across owned files', () => {
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: { one: 2, two: 1 } }, 'src/own/a.test.js': { names: { three: 4 } } } }), ['Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests.', 'owned tests: single.js', 'owned tests: src/own/a.test.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
});
test('[ownership-019] counts zero instances for an empty name map', () => {
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: {} } } }), ['Owned gaps: 0 code files, 0 lines, 1 test files, 0 tests.', 'owned tests: single.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
});


function syncFixture(body) {
  return fixture(({ root, put }) => {
    const git = (...args) => {
      const result = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      return result.stdout.trim();
    };
    const commit = () => { git('add', '-A'); git('commit', '-qm', 'test'); return git('rev-parse', 'HEAD'); };
    git('init', '-qb', 'main');
    put('a.js', 'base\n'); put('no-gap.js', 'base\n'); put('gone.js', 'base\n');
    const base = commit();
    git('checkout', '-qb', 'upstream');
    put('a.js', 'upstream\nextra\n'); put('no-gap.js', 'upstream\n');
    git('mv', 'gone.js', 'renamed.js'); put('binary.js', 'a\0b\n');
    const from = commit();
    git('checkout', '-qb', 'work', base);
    git('merge', '--no-ff', '-qm', 'sync', from);
    const adopt = (file = 'a.js', source = from, change = 'sync') => JSON.stringify({ kind: 'adopt', change, file, from: source, lines: 1, branches: 0, functions: 0, untraced: 0 }) + '\n';
    const input = { root, base, files: ['a.js', 'no-gap.js', 'gone.js', 'renamed.js', 'binary.js'], history: adopt(), baseHistory: '', change: 'sync' };
    body({ root, put, git, commit, base, from, adopt, input });
  });
}

test('[ownership-020 ownership-025] needs no coverage for lines that equal the file in the adopt source', () => syncFixture(({ input }) => {
  assert.deepEqual(syncChangedLines(input), {
    changed: { 'a.js': [], 'no-gap.js': [], 'renamed.js': [], 'binary.js': [] },
    advice: 'COVERAGE-DIFF: 5 changed lines, 5 brought by the merged upstream commit, 0 need coverage.',
  });
}));

test('[ownership-021] needs coverage for a line that a person resolved by hand', () => syncFixture(({ root, put, git, commit, base, from, input }) => {
  git('checkout', '-qb', 'conflict', base); put('a.js', 'author\n'); commit();
  const merge = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '--no-ff', '--no-commit', from], { cwd: root, encoding: 'utf8' });
  assert.equal(merge.status, 1);
  put('a.js', 'resolved\nextra\n'); commit();
  const result = syncChangedLines(input);
  assert.deepEqual(result.changed['a.js'], [1]);
  assert.deepEqual(faults({ changed: result.changed, coverage: [], lineCoverage: {} }).map(item => [item.file, item.lines]), [['a.js', [1]]]);
  assert.equal(result.advice, 'COVERAGE-DIFF: 5 changed lines, 4 brought by the merged upstream commit, 1 need coverage.');
}));

test('[ownership-022] needs coverage for an author edit to an upstream line', () => syncFixture(({ put, commit, input }) => {
  put('a.js', 'upstream\nauthor\n'); commit();
  const result = syncChangedLines(input);
  assert.deepEqual(result.changed['a.js'], [2]);
  assert.deepEqual(faults({ changed: result.changed, coverage: [], lineCoverage: {} }).map(item => item.lines), [[2]]);
  assert.deepEqual(faults({ changed: result.changed, coverage: [record('a.js')], lineCoverage: { 'a.js': [2] } }), []);
}));

test('[ownership-023] uses the last adopt source for each file and the last source for other files', () => syncFixture(({ put, git, commit, from, adopt, input }) => {
  git('checkout', '-qb', 'upstream2');
  put('a.js', 'second\nextra\n'); put('no-gap.js', 'second\n');
  const second = commit();
  git('checkout', '-q', 'work'); git('merge', '--no-ff', '-qm', 'sync2', second);
  put('ours.js', 'one\ntwo'); put('empty.js', ''); commit();
  const result = syncChangedLines({ ...input, files: [...input.files, 'ours.js', 'empty.js'], history: adopt('anchor.js', from) + adopt('a.js', second) + adopt('a.js', from) + adopt('other.js', second) });
  assert.deepEqual(result.changed, { 'a.js': [1], 'no-gap.js': [], 'renamed.js': [], 'binary.js': [], 'ours.js': [1, 2], 'empty.js': [] });
  assert.equal(result.advice, 'COVERAGE-DIFF: 7 changed lines, 4 brought by the merged upstream commit, 3 need coverage.');
}));

test('[ownership-024] stops for a source commit that the repository lacks or that no merge brought', () => syncFixture(({ git, put, commit, input, adopt, base }) => {
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', 'absent') }), error => error.code === 'LEDGER-ADOPT-FROM');
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', 'x') }), error => error.code === 'LEDGER-ADOPT-FROM');
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', '0123456789abcdef0123456789abcdef01234567') }), error => error.code === 'LEDGER-ADOPT-FROM');
  git('checkout', '-qb', 'separate', base); put('separate.js', 'one\n'); const separate = commit();
  git('checkout', '-q', 'work');
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', separate) }), error => error.code === 'LEDGER-ADOPT-FROM');
}));

test('[ownership-024] keeps the base diff rule without current adopt sources', () => syncFixture(({ input, adopt }) => {
  for (const patch of [{}, { change: '', history: adopt('a.js', undefined, '') }, { history: adopt('a.js', undefined, 'other') }, { history: '{"kind":"waiver","change":"sync","from":"absent"}\n' }, { baseHistory: input.history }, { baseHistory: 'not a prefix' }]) {
    const result = syncChangedLines({ ...input, history: '', ...patch });
    assert.deepEqual(result.changed, { 'a.js': [1, 2], 'no-gap.js': [1], 'renamed.js': [1], 'binary.js': [1] });
    assert.equal(result.advice, 'COVERAGE-DIFF: 5 changed lines, 0 brought by the merged upstream commit, 5 need coverage.');
  }
}));


test('[ownership-024] skips base adopt records and stops for non-string source values', () => syncFixture(({ input, adopt }) => {
  const baseHistory = adopt('a.js', 'absent');
  const result = syncChangedLines({ ...input, baseHistory, history: baseHistory + input.history });
  assert.deepEqual(result.changed, { 'a.js': [], 'no-gap.js': [], 'renamed.js': [], 'binary.js': [] });
  assert.equal(result.advice, 'COVERAGE-DIFF: 5 changed lines, 5 brought by the merged upstream commit, 0 need coverage.');
  const foreignPrefix = input.history.replace('"sync"', '"else"');
  assert.deepEqual(syncChangedLines({ ...input, history: input.history + input.history, baseHistory: foreignPrefix }).changed['a.js'], [1, 2]);
  for (const from of [null, 1, {}, [], false]) {
    assert.throws(() => syncChangedLines({ ...input, history: JSON.stringify({ kind: 'adopt', change: 'sync', file: 'a.js', from }) + '\n' }), error => error.code === 'LEDGER-ADOPT-FROM');
  }
}));

test('[ownership-025] checks each line of an author rename absent from the source', () => syncFixture(({ git, commit, input }) => {
  git('mv', 'a.js', 'author-name.js'); commit();
  const result = syncChangedLines({ ...input, files: [...input.files, 'author-name.js'] });
  assert.deepEqual(result.changed, { 'no-gap.js': [], 'renamed.js': [], 'binary.js': [], 'author-name.js': [1, 2] });
  assert.equal(result.advice, 'COVERAGE-DIFF: 5 changed lines, 3 brought by the merged upstream commit, 2 need coverage.');
}));

test('[ownership-026 ownership-027 ownership-028] accepts only unchanged owned gaps with a ledger entry', () => {
  assert.deepEqual(faults({ ledger: { coverage: { 'src/own/a.js': {} } }, changedFiles: [] }), []);
  assert.equal(faults({ ledger: { coverage: { 'src/own/a.js': {} } }, changed: { 'src/own/a.js': [] } })[0].code, 'COVERAGE-OWNED');
  assert.deepEqual(faults({ ledger: { coverage: { 'src/own/a.js': {} } }, changed: { 'src/own/a.js.extra.js': [] } }), []);
  assert.equal(faults({ ledger: { coverage: { 'src/own/a.js': {} } }, changedFiles: ['src/own/a.js'] })[0].code, 'COVERAGE-OWNED');
  assert.equal(faults({ ledger: { coverage: {} }, changedFiles: [] })[0].code, 'COVERAGE-OWNED');
  assert.equal(faults({ ledger: { coverage: Object.create({ 'src/own/a.js': {} }) }, changedFiles: [] })[0].code, 'COVERAGE-OWNED');
});

test('[ownership-029 ownership-001] keeps base paths after a change removes or shortens a manifest path', () => syncFixture(({ root, put, git, base: absentBase }) => {
  put('openspec/ownership.json', '{"version":1,"owned":["src/","single.js"]}'); git('add', '.'); git('commit', '-qm', 'manifest');
  const base = git('rev-parse', 'HEAD');
  git('branch', 'undefined', base);
  put('openspec/ownership.json', '{"version":1,"owned":[]}');
  assert.deepEqual(readOwnership(root).manifest.owned, []);
  put('openspec/ownership.json', '{"version":1,"owned":["src/narrow/"]}');
  const result = readOwnership(root, base);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.manifest.owned, ['src/', 'single.js', 'src/narrow/']);
  assert.equal(classify(result.manifest, 'src/wide/a.js'), 'owned');
  assert.equal(classify(result.manifest, 'single.js'), 'owned');
  assert.equal(classify(result.manifest, 'other.js'), 'upstream');
  put('openspec/ownership.json', '{"version":1,"owned":["src/narrow/","src/"]}');
  assert.deepEqual(readOwnership(root, base).manifest.owned, ['src/', 'single.js', 'src/narrow/']);
  put('openspec/ownership.json', '{}'); git('add', '.'); git('commit', '-qm', 'bad manifest');
  const bad = git('rev-parse', 'HEAD');
  put('openspec/ownership.json', '{"version":1,"owned":[]}');
  assert.equal(readOwnership(root, bad).errors[0].code, 'OWNERSHIP-MANIFEST');
  assert.deepEqual(readOwnership(root, absentBase).manifest, { version: 1, owned: [] });
}));
test('[ownership-030] classifies the gate script, the OSH layer and the OSH provider as owned paths', () => {
  const value = parseOwnership(readFileSync(new URL('../../../openspec/ownership.json', import.meta.url), 'utf8'));
  for (const file of ['scripts/spec/gates.mjs', 'src/layers/osh/index.js', 'server/providers/osh.js']) assert.equal(classify(value, file), 'owned');
});
test('[ownership-031] stops for an adopt record without a file and with the hash of HEAD', () => syncFixture(({ input, git }) => {
  assert.throws(() => syncChangedLines({ ...input, history: JSON.stringify({ kind: 'adopt', change: 'sync', from: git('rev-parse', 'HEAD') }) + '\n' }), error => {
    assert.equal(error.code, 'LEDGER-ADOPT-FROM');
    assert.equal(error.message, 'Use an adopt record with a file name and a full lowercase hash in the from field. A merge after the base must bring that hash.');
    return true;
  });
}));
test('[ownership-032] stops for a work branch adopt source', () => syncFixture(({ input, put, commit, adopt }) => {
  put('a.js', 'author\n'); const from = commit();
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', from) }), error => error.code === 'LEDGER-ADOPT-FROM');
}));
test('[ownership-033] stops for an ancestor that no merge brought', () => syncFixture(({ input, base, adopt }) => {
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', base) }), error => error.code === 'LEDGER-ADOPT-FROM');
}));
test('[ownership-036] gives the diff a 256 MiB buffer', () => fixture(({ root, put }) => {
  put('a.js', 'one\n');
  const native = childProcess.spawnSync;
  let buffer;
  childProcess.spawnSync = (command, args, options) => { if (args[0] === 'diff') buffer = options.maxBuffer; return { status: 0, stdout: '', stderr: '' }; };
  syncBuiltinESMExports();
  try { changedLines({ root, base: 'base', files: ['a.js'] }); assert.equal(buffer, 268435456); }
  finally { childProcess.spawnSync = native; syncBuiltinESMExports(); }
}));

test('[ownership-031 ownership-024] stops for an invalid file or source and skips records with invalid counts', () => syncFixture(({ input, from, adopt }) => {
  const line = JSON.parse(adopt());
  for (const patch of [{ file: undefined }, { from: '' }]) {
    assert.throws(() => syncChangedLines({ ...input, history: JSON.stringify({ ...line, ...patch }) + '\n' }), error => error.code === 'LEDGER-ADOPT-FROM');
  }
  for (const patch of [{ untraced: undefined }, { lines: undefined }, { lines: -1 }]) {
    assert.deepEqual(syncChangedLines({ ...input, history: JSON.stringify({ ...line, ...patch }) + '\n' }).changed['a.js'], [1, 2]);
  }
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', from.slice(0, 12)) }), error => error.code === 'LEDGER-ADOPT-FROM');
}));

test('[ownership-041] stops for a number or a name that is not a full hash in the from field', () => syncFixture(({ input, git, from, adopt }) => {
  git('branch', '1', from);
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', 1) }), error => error.code === 'LEDGER-ADOPT-FROM');
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', '1') }), error => error.code === 'LEDGER-ADOPT-FROM');
}));


test('[ownership-043] skips invalid adopt records outside the change', () => syncFixture(({ input }) => {
  const invalid = JSON.stringify({ kind: 'adopt', change: 'other', from: 'HEAD' }) + '\n';
  for (const patch of [
    { history: invalid },
    { history: invalid.replace('other', 'sync'), change: undefined },
    { history: JSON.stringify({ kind: 'adopt', from: 'HEAD' }) + '\n', change: undefined },
    { history: invalid.replace('other', ''), change: '' },
    { history: invalid.replace('other', 'sync'), baseHistory: '{"kind":"measurement"}\n' },
  ]) {
    assert.deepEqual(syncChangedLines({ ...input, ...patch }).changed['a.js'], [1, 2]);
  }
}));

test('[ownership-050] stops for an invalid record after a valid record', () => syncFixture(({ input, from }) => {
  const invalid = JSON.stringify({ kind: 'adopt', change: 'sync', from }) + '\n';
  assert.throws(() => syncChangedLines({ ...input, history: input.history + invalid }), error => error.code === 'LEDGER-ADOPT-FROM');
}));

test('[ownership-051 ownership-024] stops for an invalid source before a diff fault', () => syncFixture(({ input }) => {
  const native = childProcess.spawnSync;
  let calls = 0;
  childProcess.spawnSync = (command, args, options) => {
    if (command === 'git' && args.includes('-U0')) {
      calls += 1;
      return { status: 128, stderr: 'Diff fault.' };
    }
    return native(command, args, options);
  };
  syncBuiltinESMExports();
  try {
    const history = JSON.stringify({ kind: 'adopt', change: 'sync', from: 'HEAD' }) + '\n';
    assert.throws(() => syncChangedLines({ ...input, history }), error => error.code === 'LEDGER-ADOPT-FROM');
    assert.equal(calls, 0);
  } finally {
    childProcess.spawnSync = native;
    syncBuiltinESMExports();
  }
}));

test('[ownership-052] stops for a source name with a null byte', () => syncFixture(({ input, adopt }) => {
  assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', '\0') }), error => {
    assert.equal(error.code, 'LEDGER-ADOPT-FROM');
    assert.equal(error.message, 'Use an adopt record with a file name and a full lowercase hash in the from field. A merge after the base must bring that hash.');
    return true;
  });
}));

test('[ownership-031 ownership-041] stops for a name that is not a full hash when HEAD is a merge commit', () => syncFixture(({ input, git, from, adopt }) => {
  assert.equal(git('rev-parse', 'HEAD^1'), input.base);
  assert.equal(git('rev-parse', 'HEAD^2'), from);
  git('update-ref', 'refs/remotes/origin/source', from);
  for (const source of ['HEAD^2', 'upstream', from.slice(0, 12), 'origin/source', from.toUpperCase(), `${from} `, `${from}\n`]) {
    assert.throws(() => syncChangedLines({ ...input, history: adopt('a.js', source) }), error => {
      assert.equal(error.code, 'LEDGER-ADOPT-FROM');
      return true;
    }, source);
  }
}));

test('[ownership-052] returns false when Git cannot read the merge parents', () => {
  const native = childProcess.spawnSync;
  let calls = 0;
  childProcess.spawnSync = () => { calls += 1; throw new Error('Git cannot start.'); };
  syncBuiltinESMExports();
  try {
    assert.equal(isAdoptSource('/tmp', 'base', '0123456789abcdef0123456789abcdef01234567'), false);
    assert.equal(calls, 1);
  }
  finally { childProcess.spawnSync = native; syncBuiltinESMExports(); }
});

test('[ownership-031 ownership-041] rejects values outside the hash pattern and reads no merge parents', () => {
  const native = childProcess.spawnSync;
  let calls = 0;
  childProcess.spawnSync = () => { calls += 1; throw new Error('Git must not start.'); };
  syncBuiltinESMExports();
  try {
    for (const from of ['HEAD^2', 'source', '01234567', 'origin/source', 'ABCDEF0123456789ABCDEF0123456789ABCDEF01', '0123456789abcdef0123456789abcdef01234567 ', 'x0123456789abcdef0123456789abcdef01234567', '00123456789abcdef0123456789abcdef01234567', null, 1]) {
      assert.equal(isAdoptSource('/tmp', 'base', from), false);
    }
    assert.equal(calls, 0);
  } finally { childProcess.spawnSync = native; syncBuiltinESMExports(); }
});
