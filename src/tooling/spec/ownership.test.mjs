import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import childProcess, { spawnSync } from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { parseOwnership, readOwnership, classify, ownershipAdvice, parseDiffLines, changedLines, parseLineCoverage, coverageFaults, gapReport } from '../../../scripts/spec/lib/ownership.mjs';
import { readQaRegister, qaAdvice } from '../../../scripts/spec/lib/qa-register.mjs';
import { createCoverage, addProcess, coverageLcov } from '../../../scripts/spec/lib/v8-merge.mjs';
import { writeMeasurement, trustMeasurement } from '../../../scripts/spec/lib/measurement.mjs';

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
  for (const item of ['', 1, null, '/src/', '../a', './a', 'src/../a', 'src/./a', 'src//a', 'src\\a', 'a\n', 'a*', 'a?']) {
    assert.throws(() => parseOwnership(JSON.stringify({ version: 1, owned: [item] })), /version 1/);
  }
  assert.throws(() => parseOwnership('{'), SyntaxError);
});
test('[ownership-001] reports an absent or bad manifest file', () => fixture(({ root, put }) => {
  assert.equal(readOwnership(root).errors[0].code, 'OWNERSHIP-MANIFEST');
  assert.equal(readOwnership(root).errors[0].file, 'openspec/ownership.json');
  put('openspec/ownership.json', '{}');
  assert.deepEqual(readOwnership(root).errors, [{ code: 'OWNERSHIP-MANIFEST', file: 'openspec/ownership.json', message: 'Use version 1 and unique safe relative paths in the owned array.' }]);
}));
test('[ownership-002] uses exact paths and prefix boundaries', () => {
  for (const file of ['single.js', 'src/own/a.js', 'src/own/sub/a.js']) assert.equal(classify(manifest, file), 'owned');
  for (const file of ['single.js/a', 'single.jsx', 'src/own', 'src/owner/a.js', 'other.js']) assert.equal(classify(manifest, file), 'upstream');
});
test('[ownership-003] shows each path class and totals', () => {
  assert.deepEqual(ownershipAdvice(manifest, ['single.js', 'other.js', 'src/own/a.js']), ['Class: owned single.js', 'Class: upstream other.js', 'Class: owned src/own/a.js', 'Ownership: 2 owned, 1 upstream']);
  assert.deepEqual(ownershipAdvice(manifest, []), ['Ownership: 0 owned, 0 upstream']);
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
  const git = (...args) => { const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' }); assert.equal(result.status, 0, result.stderr); return result.stdout.trim(); };
  git('init', '-q'); put('a.js', 'a\nb\nc\n'); put('gone.js', 'old\n'); put('binary.js', 'old\0text\n');
  git('add', '.'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'base');
  const base = git('rev-parse', 'HEAD');
  put('a.js', 'a\nnew\nc\nextra\n'); put('new.js', 'one\ntwo'); put('trail.js', 'one\ntwo\n'); put('empty.js', ''); put('binary.js', 'a\0b\n'); rmSync(path.join(root, 'gone.js'));
  assert.deepEqual(changedLines({ root, base, files: ['a.js', 'new.js', 'empty.js', 'gone.js', 'binary.js', 'trail.js'] }), { 'a.js': [2, 4], 'new.js': [1, 2], 'empty.js': [], 'binary.js': [1], 'trail.js': [1, 2] });
  assert.throws(() => changedLines({ root, base: 'bad-ref', files: ['a.js'] }), /Git cannot read/);
}));
test('[ownership-006] intersects duplicate line records', () => {
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
  for (const patch of [{ loaded: false }, { untrue: true }]) assert.equal(faults({ coverage: [record('other.js', patch)], changed: { 'other.js': [2] }, lineCoverage: { 'other.js': [2] } })[0].code, 'COVERAGE-DIFF');
  assert.equal(faults({ coverage: [], changed: { 'other.js': [2] }, lineCoverage: { 'other.js': [2] } })[0].code, 'COVERAGE-DIFF');
  assert.deepEqual(faults({ coverage: [], changed: { 'gone.js': [] } }), []);
});
test('[ownership-008] bounds a line waiver by hash metric and count', () => {
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
test('[ownership-012] fixes the process boundary text', () => {
  const root = new URL('../../../', import.meta.url);
  const text = readFileSync(new URL('AGENTS.md', root), 'utf8');
  assert.match(text, /5\. Keep each owned code file at 100% line, branch and function coverage\. Keep each line that a change adds or edits at 100%, in every file\./);
  assert.match(text, /Each sync change uses `adopt` for every file the merge brings\./);
  assert.match(text, /23\. `openspec\/ownership.json` lists the owned paths/);
  assert.match(text, /24\..*review.md.*files resolved by hand/);
  assert.match(text, /24\..*Resolved files:.*Scope: full/);
  assert.match(text, /25\..*retires the scenario or rewrites it/);
  assert.match(text, /The campaign order of 2026-09-26 is closed\./);
  const config = readFileSync(new URL('openspec/config.yaml', root), 'utf8');
  assert.match(config, /All owned JS code and every changed line has 100%/);
  assert.match(config, /Upstream code enters the ledger by `adopt` and keeps its recorded gap\./);
});
test('[ownership-013] writes merged DA counts for each source line', () => {
  const state = createCoverage(() => 'a\nb\nc\n');
  addProcess(state, { result: [{ url: 'file:///repo/a.js', functions: [{ functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: 6, count: 1 }, { startOffset: 2, endOffset: 4, count: 0 }] }] }] });
  assert.match(coverageLcov(state), /DA:1,1\nDA:2,0\nDA:3,1\n/);
});
test('[ownership-013] stores line data in the snapshot', () => fixture(({ root, put }) => {
  put('.gev-cache/spec/empty', '');
  const measured = { coverage: [{ file: 'a.js' }], records: [{ file: 'a.test.mjs' }], assertions: new Map([['a.test.mjs', 2]]), inventory: ['a.js'], testFiles: ['a.test.mjs'], untrue: new Set(['b.js']), lineCoverage: { 'a.js': [1, 3] } };
  writeMeasurement(root, measured);
  const text = readFileSync(path.join(root, '.gev-cache/spec/measurement.json'), 'utf8');
  assert.deepEqual(JSON.parse(text), { coverage: [{ file: 'a.js' }], lineCoverage: { 'a.js': [1, 3] }, records: [{ file: 'a.test.mjs' }], assertions: [['a.test.mjs', 2]], inventory: ['a.js'], testFiles: ['a.test.mjs'], untrue: ['b.js'] });
}));

test('[ownership-004 ownership-008] rejects fractional waiver counts and ignores negative counts', () => {
  assert.deepEqual(faults({ waivers: [waiver('lines', { count: 1.5 }), waiver('branches'), waiver('functions')] }).map(item => item.code), ['COVERAGE-OWNED']);
  assert.deepEqual(faults({ waivers: [waiver(), waiver('branches'), waiver('functions'), waiver('lines', { count: -1 })] }), []);
  const input = { coverage: [record('other.js')], changed: { 'other.js': [2, 3] }, lineCoverage: {}, waivers: [waiver('lines', { file: 'other.js', count: 2.5, lines: [2, 3] })] };
  assert.deepEqual(faults(input).map(item => item.lines), [[2, 3]]);
});

test('[ownership-007 ownership-008] rejects all line waivers for an untrue file', () => {
  const result = faults({ coverage: [record('other.js', { untrue: true })], changed: { 'other.js': [1, 2, 3] }, lineCoverage: { 'other.js': [1] }, waivers: [waiver('lines', { file: 'other.js', count: 2, lines: [2, 3] })] });
  assert.deepEqual(result, [{ code: 'COVERAGE-DIFF', file: 'other.js', lines: [1, 2, 3], message: 'Changed lines need coverage: 1, 2, 3.' }]);
});

test('[ownership-004] checks each owned file after an upstream file', () => {
  assert.deepEqual(faults({ coverage: [record('other.js'), record(), record('single.js')] }).map(item => item.file), ['src/own/a.js', 'single.js']);
});

test('[ownership-014] counts every test instance', () => {
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: { one: 2, two: 1 } }, 'other.test.mjs': { names: { three: 4 } } } }), [
    'Owned gaps: 0 code files, 0 lines, 1 test files, 3 tests.', 'owned tests: single.js',
    'Upstream gaps: 0 code files, 0 lines, 1 test files, 4 tests.', 'upstream tests: other.test.mjs',
  ]);
});

test('[ownership-001] accepts each ASCII range end', () => {
  assert.deepEqual(parseOwnership('{"version":1,"owned":["AZaz09_.-/Zz9/"]}'), { version: 1, owned: ['AZaz09_.-/Zz9/'] });
});
test('[ownership-016] sorts all line numbers as numbers', () => {
  assert.deepEqual(parseDiffLines('@@ -1 +20 @@\n@@ -1 +2 @@\n@@ -1 +10 @@\n'), [2, 10, 20]);
  assert.deepEqual(parseLineCoverage('SF:a.js\nDA:20,1\nDA:2,1\nDA:10,1\n', '/repo'), { 'a.js': [2, 10, 20] });
});
test('[ownership-017] rejects extra line record text', () => {
  assert.deepEqual(parseDiffLines('prefix@@ -1 +2 @@\n'), []);
  assert.deepEqual(parseLineCoverage('SF:a.js\nprefixDA:2,1\nDA:3,1suffix\n', '/repo'), { 'a.js': [] });
});
test('[ownership-018] sums owned file gaps and waiver counts', () => {
  assert.deepEqual(gapReport(manifest, { coverage: { 'src/own/a.js': { lines: 2 }, 'src/own/b.js': { lines: 3 } }, untracedTests: {} }), ['Owned gaps: 2 code files, 5 lines, 0 test files, 0 tests.', 'owned code: src/own/a.js', 'owned code: src/own/b.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
  assert.deepEqual(faults({ coverage: [record(undefined, { lines: { total: 4, uncovered: 2 } })], waivers: [waiver(), waiver('lines', { lines: [3] }), waiver('branches'), waiver('functions')] }), []);
  assert.deepEqual(faults({ coverage: [record(undefined, { lines: { total: 4, uncovered: 2 } })], waivers: [waiver('lines', { count: 2, lines: [2, 3] }), waiver('branches'), waiver('functions')] }), []);
});

test('[ownership-005] sets each Git diff option', () => fixture(({ root, put }) => {
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

test('[ownership-018] sums test counts across owned files', () => {
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: { one: 2, two: 1 } }, 'src/own/a.test.js': { names: { three: 4 } } } }), ['Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests.', 'owned tests: single.js', 'owned tests: src/own/a.test.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
});
test('[ownership-019] counts zero instances for an empty name map', () => {
  assert.deepEqual(gapReport(manifest, { coverage: {}, untracedTests: { 'single.js': { names: {} } } }), ['Owned gaps: 0 code files, 0 lines, 1 test files, 0 tests.', 'owned tests: single.js', 'Upstream gaps: 0 code files, 0 lines, 0 test files, 0 tests.']);
});
