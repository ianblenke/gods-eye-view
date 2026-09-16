import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  appendHistory,
  compareLedger,
  compareWithBase,
  currentGaps,
  initLedger,
  parseLedger,
  ratchetLedger,
  toleranceOf,
  readLedger,
  writeLedger,
} from '../../../scripts/spec/lib/ledger.mjs';

const DATE = '2026-09-13';
const TOTALS = { lines: 100, branches: 100, functions: 10 };
const NO_TOTALS = { lines: 100, branches: null, functions: null };
// A total of 200 or more gives the largest tolerance, 8. A total of 100 gives 4.
const BIG = { lines: 400, branches: 400, functions: 400 };
const COMMIT = 'abc123';

function loaded(file, lines, branches, functions, sha = 'same', totals = TOTALS) {
  return { file, sha, loaded: true, complete: lines + branches + functions === 0, lines: { total: totals.lines ?? 100, uncovered: lines }, branches: { total: totals.branches, uncovered: branches }, functions: { total: totals.functions, uncovered: functions } };
}

function unloaded(file, lines, sha = 'same', untrue = false) {
  return { file, sha, untrue, loaded: false, complete: false, lines: { total: 100, uncovered: lines }, branches: null, functions: null };
}

function entry(value) {
  return { sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', ...value };
}

function ledgerWith({ coverage = {}, untracedTests = {} } = {}) {
  return {
    version: 4,
    coverage: Object.fromEntries(Object.entries(coverage).map(([file, value]) => [file, entry(value)])),
    untracedTests: Object.fromEntries(Object.entries(untracedTests).map(([file, names]) => [file, { names, origin: 'pre-spec', since: '2026-01-01' }])),
  };
}

const LOADED = (lines, branches, functions, extra = {}) => ({ loaded: true, lines, branches, functions, totals: TOTALS, ...extra });
const UNLOADED = (lines, extra = {}) => ({ loaded: false, lines, branches: null, functions: null, totals: NO_TOTALS, ...extra });
const gaps = (coverage, untraced = []) => currentGaps({ coverage, untraced });
const tests = (file, ...names) => names.map((name) => ({ file, name }));
const codes = (result) => (Array.isArray(result) ? result : result.errors).map((error) => error.code);

function withRoot(body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-ledger-'));
  try {
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function ratchet(ledger, current, extra = {}) {
  return ratchetLedger({ ledger, current, inventory: [...current.coverage.keys(), ...Object.keys(ledger.coverage)], testFiles: [...current.untraced.keys(), ...Object.keys(ledger.untracedTests)], change: 'backfill-orbit', changeActive: true, date: DATE, commit: COMMIT, ...extra });
}

test('[gap-ledger-001] makes the first ledger with each current gap, its hash and the origin pre-spec', () => {
  // The first ledger records the total lines with the total branches and the total functions.
  withRoot((root) => {
    const first = initLedger({ root, current: gaps([loaded('src/orbit.js', 5, 3, 1, 'same', BIG)]), date: DATE, baseHasLedger: false, baseFiles: new Set(['src/orbit.js']) });
    assert.deepEqual(first.coverage['src/orbit.js'].totals, BIG);
  });
  withRoot((root) => {
    const current = gaps([loaded('src/orbit.js', 5, 3, 1, 'h1'), loaded('src/done.js', 0, 0, 0), unloaded('src/ui.js', 30, 'h2', true)], tests('src/a.test.mjs', 'one', 'two', 'two'));
    const ledger = initLedger({ root, current, date: DATE, baseHasLedger: false, baseFiles: new Set(['src/orbit.js', 'src/ui.js', 'src/a.test.mjs']) });
    assert.deepEqual(ledger, {
      version: 4,
      coverage: {
        'src/orbit.js': { loaded: true, lines: 5, branches: 3, functions: 1, totals: TOTALS, sha: 'h1', untrue: false, origin: 'pre-spec', since: DATE },
        'src/ui.js': { loaded: false, lines: 30, branches: null, functions: null, totals: NO_TOTALS, sha: 'h2', untrue: true, origin: 'pre-spec', since: DATE },
      },
      untracedTests: { 'src/a.test.mjs': { names: { one: 1, two: 2 }, origin: 'pre-spec', since: DATE } },
    });
    assert.deepEqual(readLedger(root), ledger);
    assert.equal(parseLedger(null), null);
  });
});

test('[gap-ledger-002] does not replace the current ledger', () => {
  withRoot((root) => {
    const current = gaps([loaded('src/orbit.js', 5, 3, 1)]);
    const input = { root, current, date: DATE, baseHasLedger: false, baseFiles: new Set(['src/orbit.js']) };
    initLedger(input);
    const before = readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8');
    assert.throws(() => initLedger({ ...input, current: gaps([]) }), /gaps\.json exists/);
    assert.equal(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8'), before);
    // The written entry records the total lines with the total branches and the total functions.
    assert.deepEqual(Object.keys(readLedger(root).coverage['src/orbit.js'].totals).sort(), ['branches', 'functions', 'lines']);
  });
  withRoot((root) => assert.equal(readLedger(root), null));
});

test('[gap-ledger-015] does not make a ledger when the base has a ledger', () => {
  withRoot((root) => {
    assert.throws(() => initLedger({ root, current: gaps([]), date: DATE, baseHasLedger: true, baseFiles: new Set() }), /base commit has openspec\/trace\/gaps\.json/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/gaps.json')), false);
    assert.equal(readLedger(root), null, 'the command writes no ledger with the total counts');
  });
});

test('[gap-ledger-016] does not record a new file as pre-spec', () => {
  withRoot((root) => {
    const current = gaps([loaded('scripts/spec/new.mjs', 1, 0, 0)], tests('src/new.test.mjs', 'old'));
    assert.throws(() => initLedger({ root, current, date: DATE, baseHasLedger: false, baseFiles: new Set() }), /not pre-spec: scripts\/spec\/new\.mjs, src\/new\.test\.mjs/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/gaps.json')), false);
    assert.equal(readLedger(root), null, 'the command writes no ledger with the total counts');
  });
});

test('[gap-ledger-003] stops for a new code file below 100%', () => {
  assert.deepEqual(compareLedger({ ledger: ledgerWith(), current: gaps([loaded('src/new.js', 0, 1, 0)]) }).errors, [
    { code: 'LEDGER-NEW-COVERAGE-GAP', file: 'src/new.js', message: 'src/new.js is not at 100%: 0 lines, 1 branches, 0 functions not covered' },
  ]);
  const base = compareLedger({ ledger: ledgerWith(), current: gaps([loaded('src/new.js', 0, 1, 0, 'same', BIG)]), sameAsBase: () => true });
  assert.deepEqual(codes(base), ['LEDGER-NEW-COVERAGE-GAP'], 'a file with no entry gets no tolerance');
  const unloadedNew = compareLedger({ ledger: ledgerWith(), current: gaps([unloaded('src/new.js', 12)]) });
  assert.deepEqual(unloadedNew.errors.map((error) => error.message), ['no test loads src/new.js']);
});

test('[gap-ledger-004] stops for more lines that are not covered and shows both counts', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 6, 3, 1)]) });
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 6, 3, 1)]), sameAsBase: () => true });
  assert.deepEqual(tolerant.errors, [], 'the tolerance of the total 100 is 4');
  assert.deepEqual(result.errors, [{ code: 'LEDGER-LARGER-GAP', file: 'src/orbit.js', message: 'src/orbit.js has 6 lines not covered. The ledger allows 5.' }]);
});

test('[gap-ledger-017] stops for more branches or functions that are not covered in a changed file', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 5, 4, 2, 'edited')]) });
  assert.deepEqual(result.errors.map((error) => error.message), [
    'src/orbit.js has 4 branches not covered. The ledger allows 3.',
    'src/orbit.js has 2 functions not covered. The ledger allows 1.',
  ]);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 5, 4, 2, 'edited')]), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-LARGER-GAP', 'LEDGER-LARGER-GAP'], 'a changed file gets no tolerance');
});

test('[gap-ledger-018] does not stop for branches that a new test shows in an unchanged file', () => {
  const current = gaps([loaded('src/orbit.js', 5, 9, 3, 'same', { branches: 106, functions: 12 })]);
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current });
  assert.deepEqual(codes(result), ['LEDGER-STALE']);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current, sameAsBase: () => true });
  assert.deepEqual(tolerant, { errors: [], stale: [] }, 'the tolerance conditions also give no error');
});

test('[gap-ledger-054] stops for fewer covered branches or functions in an unchanged file', () => {
  const ledger = ledgerWith({ coverage: { 'src/x.js': LOADED(10, 0, 0, { totals: { lines: 100, branches: 5, functions: 2 } }) } });
  const lost = compareLedger({ ledger, current: gaps([loaded('src/x.js', 9, 2, 1, 'same', { lines: 100, branches: 4, functions: 2 })]) });
  assert.deepEqual(lost.errors, [
    { code: 'LEDGER-LOST-COVERAGE', file: 'src/x.js', message: 'src/x.js has 2 covered branches. The ledger records 5.' },
    { code: 'LEDGER-LOST-COVERAGE', file: 'src/x.js', message: 'src/x.js has 1 covered functions. The ledger records 2.' },
  ]);
  assert.throws(() => ratchet(ledger, gaps([loaded('src/x.js', 9, 2, 1, 'same', { branches: 4, functions: 2 })])), /LEDGER-LOST-COVERAGE src\/x\.js/);
  const base = ledgerWith({ coverage: { 'src/x.js': LOADED(10, 0, 0, { totals: { lines: 100, branches: 5, functions: 2 } }) } });
  const hidden = ledgerWith({ coverage: { 'src/x.js': LOADED(9, 2, 0, { totals: { lines: 100, branches: 4, functions: 2 } }) } });
  assert.deepEqual(codes(compareWithBase({ ledger: hidden, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true })), ['LEDGER-TOTALS-NOT-BASE', 'LEDGER-MORE-THAN-BASE']);
});

test('[gap-ledger-055] stops for a ledger entry without the total counts', () => {
  const ledger = ledgerWith({ coverage: { 'src/x.js': LOADED(10, 1, 1, { totals: undefined }), 'src/ui.js': UNLOADED(30) } });
  const result = compareLedger({ ledger, current: gaps([loaded('src/x.js', 10, 1, 1), unloaded('src/ui.js', 30)]) });
  assert.deepEqual(codes(result), ['LEDGER-NO-TOTALS', 'LEDGER-STALE']);
  assert.match(result.errors[0].message, /Run the ratchet command\.$/);
  assert.deepEqual(ratchet(ledger, gaps([loaded('src/x.js', 10, 1, 1)])).ledger.coverage['src/x.js'].totals, TOTALS);
  for (const totals of [{}, { lines: 100, branches: null, functions: null }, { lines: 100, branches: 5, functions: '1' }]) {
    const wrong = ledgerWith({ coverage: { 'src/w.js': LOADED(10, 4, 1, { totals }) } });
    assert.deepEqual(codes(compareLedger({ ledger: wrong, current: gaps([loaded('src/w.js', 9, 3, 1)]) }))[0], 'LEDGER-NO-TOTALS', JSON.stringify(totals));
  }
});

test('[gap-ledger-019] stops for a changed file that has no branch count', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 20, 5, 1, 'edited')]) });
  assert.deepEqual(codes(result), ['LEDGER-NO-BASELINE']);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 20, 5, 1, 'edited')]), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-NO-BASELINE'], 'a changed file gets no tolerance');
});

test('[gap-ledger-009] does not stop for a file that no test loaded and a test now loads with the same content', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 20, 15, 9)]) });
  assert.deepEqual(codes(result), ['LEDGER-STALE']);
  const larger = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 31, 0, 1)]) });
  assert.deepEqual(codes(larger), ['LEDGER-LARGER-GAP']);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 31, 0, 1)]), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-LARGER-GAP'], 'an entry that no test loaded gets no tolerance');
});

test('[gap-ledger-020] stops for a loaded file that no test loads now', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(50, 3, 1) } }), current: gaps([unloaded('src/orbit.js', 40)]) });
  assert.deepEqual(codes(result), ['LEDGER-UNLOADED']);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(50, 3, 1) } }), current: gaps([unloaded('src/orbit.js', 40)]), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-UNLOADED'], 'a file that no test loads now gets no tolerance');
});

test('[gap-ledger-031 coverage-gate-018] does not stop for untrue coverage that the ledger records and stops for other untrue coverage', () => {
  const recorded = compareLedger({ ledger: ledgerWith({ coverage: { 'src/traffic.js': UNLOADED(40, { untrue: true }) } }), current: gaps([unloaded('src/traffic.js', 40, 'same', true)]) });
  assert.deepEqual(recorded.errors, []);
  const loadedBefore = compareLedger({ ledger: ledgerWith({ coverage: { 'src/traffic.js': LOADED(10, 1, 1) } }), current: gaps([unloaded('src/traffic.js', 40, 'same', true)]) });
  assert.deepEqual(codes(loadedBefore), ['COVERAGE-FAKE', 'LEDGER-LARGER-GAP']);
  const newFile = compareLedger({ ledger: ledgerWith(), current: gaps([unloaded('src/new.js', 4, 'same', true)]) });
  assert.deepEqual(codes(newFile), ['LEDGER-NEW-COVERAGE-GAP', 'COVERAGE-FAKE']);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/traffic.js': LOADED(10, 1, 1, { untrue: true }) } }), current: gaps([{ ...loaded('src/traffic.js', 14, 1, 1), untrue: true }]), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-LARGER-GAP'], 'untrue coverage gets no tolerance');
});

test('[gap-ledger-005] stops for a new test file with untraced tests', () => {
  assert.deepEqual(compareLedger({ ledger: ledgerWith(), current: gaps([], tests('src/new.test.mjs', 'old style')) }).errors, [
    { code: 'LEDGER-NEW-UNTRACED', file: 'src/new.test.mjs', message: 'src/new.test.mjs has 1 untraced test names' },
  ]);
  const tolerant = compareLedger({ ledger: ledgerWith(), current: gaps([], tests('src/new.test.mjs', 'old style')), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-NEW-UNTRACED'], 'the tolerance is only for coverage');
});

test('[gap-ledger-006] stops for a new untraced test name', () => {
  const result = compareLedger({ ledger: ledgerWith({ untracedTests: { 'src/a.test.mjs': { one: 1, two: 1 } } }), current: gaps([], tests('src/a.test.mjs', 'one', 'three')) });
  assert.deepEqual(result.errors, [{ code: 'LEDGER-NEW-UNTRACED-NAME', file: 'src/a.test.mjs', message: 'Untraced test "three" is not in the ledger' }]);
  const tolerant = compareLedger({ ledger: ledgerWith({ untracedTests: { 'src/a.test.mjs': { one: 1 } } }), current: gaps([], tests('src/a.test.mjs', 'one', 'two')), sameAsBase: () => true });
  assert.deepEqual(codes(tolerant), ['LEDGER-NEW-UNTRACED-NAME'], 'the tolerance is only for coverage');
  const repeated = compareLedger({ ledger: ledgerWith({ untracedTests: { 'src/a.test.mjs': { one: 1 } } }), current: gaps([], tests('src/a.test.mjs', 'one', 'one')) });
  assert.deepEqual(codes(repeated), ['LEDGER-NEW-UNTRACED-NAME']);
});

test('[gap-ledger-007] does not stop for gaps that are equal to the ledger', () => {
  const result = compareLedger({
    ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/ui.js': UNLOADED(30) }, untracedTests: { 'src/a.test.mjs': { one: 1 } } }),
    current: gaps([loaded('src/orbit.js', 5, 3, 1), unloaded('src/ui.js', 30)], tests('src/a.test.mjs', 'one')),
  });
  const tolerant = compareLedger({
    ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }),
    current: gaps([loaded('src/orbit.js', 5, 3, 1)]),
    sameAsBase: () => true,
  });
  assert.deepEqual(tolerant, { errors: [], stale: [] });
  assert.deepEqual(result, { errors: [], stale: [] });
});

test('[gap-ledger-008] stops for a ledger that does not show a closed gap or a new hash', () => {
  const result = compareLedger({
    ledger: ledgerWith({
      coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/done.js': LOADED(2, 0, 0), 'src/hash.js': LOADED(1, 1, 1) },
      untracedTests: { 'src/a.test.mjs': { one: 1, two: 1 }, 'src/b.test.mjs': { gone: 1 } },
    }),
    current: gaps([loaded('src/orbit.js', 4, 3, 1), loaded('src/hash.js', 1, 1, 1, 'edited')], tests('src/a.test.mjs', 'one')),
  });
  assert.deepEqual(result.stale, [
    { kind: 'coverage', file: 'src/orbit.js' },
    { kind: 'coverage', file: 'src/hash.js' },
    { kind: 'coverage', file: 'src/done.js' },
    { kind: 'untraced', file: 'src/a.test.mjs' },
    { kind: 'untraced', file: 'src/b.test.mjs' },
  ]);
  assert.deepEqual(result.errors, [
    { code: 'LEDGER-STALE', file: 'openspec/trace/gaps.json', message: '5 ledger entries do not match the current gaps (first: src/orbit.js). Run the ratchet command.' },
  ]);
  const tolerant = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 4, 3, 1)]), sameAsBase: () => true });
  assert.deepEqual(tolerant.stale, [], 'a smaller gap of a file with the tolerance conditions is not stale');
});

const BASE = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/traffic.js': UNLOADED(40, { untrue: true }) }, untracedTests: { 'src/a.test.mjs': { one: 1 } } });
const base = (overrides = {}) => compareWithBase({ ledger: BASE, baseLedger: BASE, retired: ['x-001'], baseRetired: ['x-001'], history: 'a\nb\n', baseHistory: 'a\n', ...overrides });

test('[gap-ledger-021] stops for a ledger entry that the base does not have', () => {
  // The tolerance changes no rule of the comparison with the base commit.
  const tolerant = compareWithBase({ ledger: ledgerWith({ coverage: { 'src/new.js': LOADED(1, 0, 0) } }), baseLedger: ledgerWith(), retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true });
  assert.deepEqual(tolerant.map((error) => error.code), ['LEDGER-NOT-IN-BASE']);
  assert.deepEqual(base(), []);
  const ledger = ledgerWith({ coverage: { ...BASE.coverage, 'src/hidden.js': LOADED(400, 0, 0) }, untracedTests: { 'src/a.test.mjs': { one: 1, sneaky: 1 }, 'src/b.test.mjs': { new: 1 } } });
  assert.deepEqual(base({ ledger }).map((error) => [error.code, error.file]), [
    ['LEDGER-NOT-IN-BASE', 'src/hidden.js'],
    ['LEDGER-NOT-IN-BASE', 'src/a.test.mjs'],
    ['LEDGER-NOT-IN-BASE', 'src/b.test.mjs'],
  ]);
});

test('[gap-ledger-022] stops for a ledger entry that is larger than the base', () => {
  const ledger = ledgerWith({ coverage: { ...BASE.coverage, 'src/orbit.js': LOADED(9, 3, 1) }, untracedTests: BASE.untracedTests });
  assert.deepEqual(base({ ledger }), [{ code: 'LEDGER-LARGER-THAN-BASE', file: 'src/orbit.js', message: 'The ledger allows 9 lines for src/orbit.js. The base ledger allows 5.' }]);
});

test('[gap-ledger-032] stops for untrue coverage that the base does not record', () => {
  const ledger = ledgerWith({ coverage: { ...BASE.coverage, 'src/orbit.js': LOADED(5, 3, 1, { untrue: true }) }, untracedTests: BASE.untracedTests });
  assert.deepEqual(codes(base({ ledger })), ['LEDGER-UNTRUE-NOT-IN-BASE']);
});

test('[gap-ledger-023] stops for a removed ledger', () => {
  assert.deepEqual(codes(base({ ledger: null })), ['LEDGER-REMOVED']);
});

test('[gap-ledger-024] stops for a removed retired ID', () => {
  assert.deepEqual(base({ retired: [] }), [{ code: 'LEDGER-RETIRED-REMOVED', file: 'openspec/trace/retired-ids.json', message: 'The retired ID x-001 is in the base but not in the current file' }]);
});

test('[gap-ledger-025] stops for a changed history', () => {
  assert.deepEqual(codes(base({ history: 'rewritten\n' })), ['LEDGER-HISTORY-CHANGED']);
});

test('[gap-ledger-026] does not compare with the base when the base has no ledger', () => {
  assert.deepEqual(base({ baseLedger: null, ledger: null, history: 'x' }), []);
});

test('[gap-ledger-010] makes the ledger entries smaller and records the change and the commit', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) }, untracedTests: { 'src/a.test.mjs': { one: 1, two: 1 }, 'src/same.test.mjs': { kept: 1 } } });
  const result = ratchet(ledger, gaps([loaded('src/orbit.js', 2, 2, 1)], [...tests('src/a.test.mjs', 'one'), ...tests('src/same.test.mjs', 'kept')]));
  assert.deepEqual(result.ledger.coverage['src/orbit.js'], { loaded: true, lines: 2, branches: 2, functions: 1, totals: TOTALS, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01' });
  assert.deepEqual(result.ledger.untracedTests['src/a.test.mjs'].names, { one: 1 });
  assert.deepEqual(result.ledger.untracedTests['src/same.test.mjs'].names, { kept: 1 });
  assert.deepEqual(result.history, [
    { date: DATE, change: 'backfill-orbit', commit: COMMIT, kind: 'coverage', file: 'src/orbit.js', metric: 'lines', before: 5, after: 2, reason: 'smaller' },
    { date: DATE, change: 'backfill-orbit', commit: COMMIT, kind: 'coverage', file: 'src/orbit.js', metric: 'branches', before: 3, after: 2, reason: 'smaller' },
    { date: DATE, change: 'backfill-orbit', commit: COMMIT, kind: 'untraced', file: 'src/a.test.mjs', metric: 'count', before: 2, after: 1, reason: 'smaller' },
  ]);
});

test('[gap-ledger-047] writes the maps of the ledger with sorted keys and adds history lines', () => {
  withRoot((root) => {
    const names = (list) => ({ names: list, origin: 'pre-spec', since: DATE });
    const written = writeLedger(root, { coverage: { 'b.js': entry(LOADED(1, 0, 0)), 'a.js': entry(LOADED(1, 0, 0)) }, untracedTests: { 't.test.mjs': names({ z: 1, a: 1 }), 'a.test.mjs': names({ b: 1 }) } });
    assert.deepEqual(Object.keys(written.coverage), ['a.js', 'b.js']);
    assert.deepEqual(Object.keys(readLedger(root).untracedTests), ['a.test.mjs', 't.test.mjs']);
    assert.deepEqual(Object.keys(readLedger(root).untracedTests['t.test.mjs'].names), ['a', 'z']);
    assert.deepEqual(readLedger(root).version, 4);
    appendHistory(root, [{ change: 'a' }]);
    appendHistory(root, [{ change: 'b' }]);
    appendHistory(root, []);
    assert.equal(readFileSync(path.join(root, 'openspec/trace/history.jsonl'), 'utf8'), '{"change":"a"}\n{"change":"b"}\n');
  });
});

test('[gap-ledger-011] removes an entry that is at zero and records the closed gap', () => {
  const ledger = ledgerWith({ coverage: { 'src/done.js': LOADED(2, 1, 0) }, untracedTests: { 'src/a.test.mjs': { one: 1 } } });
  const result = ratchet(ledger, gaps([loaded('src/done.js', 0, 0, 0)]));
  assert.deepEqual([result.ledger.coverage, result.ledger.untracedTests], [{}, {}]);
  assert.deepEqual(result.history.map((line) => [line.kind, line.file, line.before, line.after, line.reason]), [
    ['coverage', 'src/done.js', 2, 0, 'closed'],
    ['untraced', 'src/a.test.mjs', 1, 0, 'closed'],
  ]);
});

test('[gap-ledger-012] removes the entry of a deleted file with the reason file removed', () => {
  const ledger = ledgerWith({ coverage: { 'src/gone.js': UNLOADED(9) }, untracedTests: { 'src/gone.test.mjs': { old: 4 } } });
  const result = ratchetLedger({ ledger, current: gaps([]), inventory: [], testFiles: [], change: 'remove-gone', changeActive: true, date: DATE, commit: COMMIT });
  assert.deepEqual([result.ledger.coverage, result.ledger.untracedTests], [{}, {}]);
  assert.deepEqual(result.history.map((line) => [line.file, line.before, line.reason]), [
    ['src/gone.js', 9, 'file removed'],
    ['src/gone.test.mjs', 4, 'file removed'],
  ]);
});

test('[gap-ledger-013] stops the ratchet command when a gap is larger', () => {
  // A file with the tolerance conditions and a count inside the tolerance does not stop the command.
  const inside = ratchet(ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { totals: BIG }) } }), gaps([loaded('src/orbit.js', 12, 3, 1, 'same', BIG)]), { sameAsBase: () => true });
  assert.deepEqual(inside.ledger.coverage['src/orbit.js'].lines, 5);
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } });
  assert.throws(() => ratchet(ledger, gaps([loaded('src/orbit.js', 6, 3, 1)])), /LEDGER-LARGER-GAP/);
  assert.equal(ledger.coverage['src/orbit.js'].lines, 5);
});

test('[gap-ledger-014] stops the ratchet command without a change name', () => {
  assert.throws(() => ratchet(ledgerWith(), gaps([]), { change: undefined }), /needs --change <name>/);
});

test('[gap-ledger-027] stops the ratchet command for a change that is not active', () => {
  assert.throws(() => ratchet(ledgerWith(), gaps([]), { change: 'archive', changeActive: false }), /Change "archive" has no folder with a proposal\.md file/);
});

test('[gap-ledger-028] records branches that a new test shows', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/ui.js': UNLOADED(30) } });
  const shown = { lines: 100, branches: 104, functions: 10 };
  const result = ratchet(ledger, gaps([loaded('src/orbit.js', 4, 7, 1, 'same', shown), loaded('src/ui.js', 20, 15, 9)]));
  assert.deepEqual([result.ledger.coverage['src/orbit.js'].branches, result.ledger.coverage['src/orbit.js'].totals], [7, shown]);
  const band = ratchet(ledger, gaps([loaded('src/orbit.js', 4, 7, 1, 'same', shown), loaded('src/ui.js', 20, 15, 9)]), { sameAsBase: () => true });
  assert.deepEqual(band.ledger, result.ledger);
  assert.deepEqual(result.ledger.coverage['src/ui.js'], { loaded: true, lines: 20, branches: 15, functions: 9, totals: TOTALS, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01' });
  assert.deepEqual(result.history.map((line) => [line.file, line.metric, line.before, line.after, line.reason]), [
    ['src/orbit.js', 'lines', 5, 4, 'smaller'],
    ['src/orbit.js', 'branches', 3, 7, 'shown by test'],
    ['src/orbit.js', 'totals', TOTALS, shown, 'totals changed'],
    ['src/ui.js', 'lines', 30, 20, 'smaller'],
    ['src/ui.js', 'loaded', false, true, 'loaded'],
    ['src/ui.js', 'totals', NO_TOTALS, TOTALS, 'totals changed'],
  ]);
});

test('[gap-ledger-057] records changed total counts', () => {
  // A file with the tolerance conditions keeps its entry counts, so the command writes no totals line.
  const tolerant = ratchet(ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { totals: BIG }) } }), gaps([loaded('src/orbit.js', 7, 5, 2, 'same', { lines: 400, branches: 398, functions: 400 })]), { sameAsBase: () => true });
  assert.deepEqual(tolerant.history.filter((line) => line.metric === 'totals'), []);
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/same.js': LOADED(5, 3, 1), 'src/legacy.js': LOADED(5, 3, 1, { totals: undefined }) } });
  const more = { lines: 100, branches: 101, functions: 11 };
  const result = ratchet(ledger, gaps([loaded('src/orbit.js', 5, 3, 1, 'same', more), loaded('src/same.js', 4, 3, 1), loaded('src/legacy.js', 5, 3, 1)]));
  assert.deepEqual(result.ledger.coverage['src/orbit.js'].totals, more);
  assert.deepEqual(
    result.history.filter((line) => line.metric === 'totals').map((line) => [line.file, line.before, line.after, line.reason, line.change]),
    [
      ['src/orbit.js', TOTALS, more, 'totals changed', 'backfill-orbit'],
      ['src/legacy.js', null, TOTALS, 'totals changed', 'backfill-orbit'],
    ],
  );
});

test('[gap-ledger-056] stops for changed total counts of an unchanged file without a history line', () => {
  const base = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/edited.js': LOADED(5, 3, 1) } });
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { totals: { branches: 5, functions: 10 } }), 'src/edited.js': LOADED(5, 3, 1, { totals: { branches: 5, functions: 10 } }) } });
  const compare = (extra) => compareWithBase({ ledger, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: (file) => file === 'src/orbit.js', change: 'backfill-orbit', ...extra });
  assert.deepEqual(compare({}), [
    { code: 'LEDGER-TOTALS-NOT-BASE', file: 'src/orbit.js', message: 'The total counts of src/orbit.js are not the base total counts, but the history has no totals line for it from the change backfill-orbit' },
  ]);
  const other = `${JSON.stringify({ change: 'other', file: 'src/orbit.js', metric: 'totals' })}\n`;
  assert.deepEqual(codes(compare({ history: other })), ['LEDGER-TOTALS-NOT-BASE']);
  const lines = `${JSON.stringify({ change: 'backfill-orbit', file: 'src/orbit.js', metric: 'lines' })}\n`;
  assert.deepEqual(codes(compare({ history: lines })), ['LEDGER-TOTALS-NOT-BASE']);
  const own = `${JSON.stringify({ change: 'backfill-orbit', file: 'src/orbit.js', metric: 'totals' })}\n`;
  assert.deepEqual(compare({ history: own }), []);
  const legacy = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { totals: undefined }) } });
  assert.deepEqual(codes(compareWithBase({ ledger: legacy, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, change: 'backfill-orbit' })), ['LEDGER-TOTALS-NOT-BASE']);
});

test('[gap-ledger-029] records the hash of a changed file and the end of untrue coverage', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/traffic.js': UNLOADED(40, { untrue: true }) } });
  const result = ratchet(ledger, gaps([loaded('src/orbit.js', 5, 3, 1, 'edited'), unloaded('src/traffic.js', 40)]));
  assert.equal(result.ledger.coverage['src/orbit.js'].sha, 'edited');
  assert.equal(result.ledger.coverage['src/traffic.js'].untrue, false);
  assert.deepEqual(result.history.map((line) => [line.file, line.metric, line.reason]), [
    ['src/orbit.js', 'hash', 'content changed'],
    ['src/traffic.js', 'untrue', 'true coverage'],
  ]);
});

test('[gap-ledger-040] stops for more branches than the base in a changed file', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 7, 3, { sha: 'new' }) } });
  const baseLedger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { sha: 'old' }) } });
  const errors = compareWithBase({ ledger, baseLedger, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => false });
  assert.deepEqual(errors.map((error) => [error.code, error.message]), [
    ['LEDGER-MORE-THAN-BASE', 'src/orbit.js changed, and the ledger allows 7 branches. The base ledger allows 3.'],
    ['LEDGER-MORE-THAN-BASE', 'src/orbit.js changed, and the ledger allows 3 functions. The base ledger allows 1.'],
  ]);
});

test('[gap-ledger-048] stops for more branches than the base with fewer covered branches', () => {
  const baseLedger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/shown.js': LOADED(9, 3, 1), 'src/loaded.js': UNLOADED(20), 'src/old.js': LOADED(5, 1, 1, { totals: undefined }) } });
  const ledger = ledgerWith({
    coverage: {
      'src/orbit.js': LOADED(5, 4, 1),
      'src/shown.js': LOADED(9, 6, 2, { totals: { branches: 103, functions: 11 } }),
      'src/loaded.js': LOADED(10, 4, 2),
      'src/old.js': LOADED(5, 2, 1),
    },
  });
  const history = ['src/shown.js', 'src/loaded.js', 'src/old.js'].map((file) => `${JSON.stringify({ change: 'backfill-orbit', file, metric: 'totals', reason: 'totals changed' })}\n`).join('');
  const errors = compareWithBase({ ledger, baseLedger, retired: [], baseRetired: [], history, baseHistory: '', sameAsBase: () => true, change: 'backfill-orbit' });
  assert.deepEqual(errors, [
    { code: 'LEDGER-MORE-THAN-BASE', file: 'src/orbit.js', message: 'The ledger allows 4 branches for src/orbit.js with 96 covered branches. The base ledger allows 3 with 97 covered.' },
    { code: 'LEDGER-MORE-THAN-BASE', file: 'src/old.js', message: 'The ledger allows 2 branches for src/old.js with 98 covered branches. The base ledger allows 1 with null covered.' },
  ]);
});

test('[gap-ledger-041] stops for a ledger hash that is not equal to the base hash for an unchanged file', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { sha: 'forged' }) } });
  const baseLedger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1, { sha: 'real' }) } });
  assert.deepEqual(compareWithBase({ ledger, baseLedger, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true }), [
    { code: 'LEDGER-HASH-NOT-BASE', file: 'src/orbit.js', message: 'The content of src/orbit.js is the base content, but its ledger hash is not the base hash' },
  ]);
  assert.deepEqual(compareWithBase({ ledger, baseLedger, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => false }), []);
});

const SAME = () => true;

// The tolerance conditions: a loaded file with true coverage, the content of the base and of its entry.
const TOLERANT = { sameAsBase: () => true };

test('[gap-ledger-069] does not stop for counts inside the tolerance and does not record the entry as not current', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG }) } });
  const inside = compareLedger({ ledger, current: gaps([loaded('src/orbit.js', 28, 38, 4, 'same', BIG)]), ...TOLERANT });
  assert.deepEqual([inside.errors, inside.stale], [[], []]);
  const smaller = compareLedger({ ledger, current: gaps([loaded('src/orbit.js', 1, 2, 0, 'same', BIG)]), ...TOLERANT });
  assert.deepEqual([smaller.errors, smaller.stale], [[], []]);
});

test('[gap-ledger-070] stops for a count outside the tolerance', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG }) } });
  const lines = compareLedger({ ledger, current: gaps([loaded('src/orbit.js', 29, 30, 4, 'same', BIG)]), ...TOLERANT });
  assert.deepEqual(lines.errors, [{ code: 'LEDGER-LARGER-GAP', file: 'src/orbit.js', message: 'src/orbit.js has 29 lines not covered. The ledger allows 28.' }]);
  const covered = compareLedger({ ledger, current: gaps([loaded('src/orbit.js', 20, 39, 4, 'same', BIG)]), ...TOLERANT });
  assert.deepEqual(covered.errors, [{ code: 'LEDGER-LOST-COVERAGE', file: 'src/orbit.js', message: 'src/orbit.js has 361 covered branches. The ledger records 370.' }]);
});

test('[gap-ledger-071] makes the tolerance from the total of the metric', () => {
  assert.deepEqual([200, 240, 2002].map(toleranceOf), [8, 8, 8]);
  assert.deepEqual([25, 50, 100, 199].map(toleranceOf), [1, 2, 4, 7]);
  assert.deepEqual([0, 1, 24, null, undefined, -5, 1.5].map(toleranceOf), [0, 0, 0, 0, 0, 0, 0]);
  const small = ledgerWith({ coverage: { 'src/small.js': LOADED(2, 3, 0, { totals: { lines: 25, branches: 25, functions: 25 } }) } });
  const current = (lines) => gaps([loaded('src/small.js', lines, 3, 0, 'same', { lines: 25, branches: 25, functions: 25 })]);
  assert.deepEqual(compareLedger({ ledger: small, current: current(3), ...TOLERANT }).errors, []);
  assert.deepEqual(codes(compareLedger({ ledger: small, current: current(4), ...TOLERANT })), ['LEDGER-LARGER-GAP']);
});

test('[gap-ledger-072] compares the covered counts with the tolerance, also without a larger gap', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG }) } });
  const more = gaps([loaded('src/orbit.js', 20, 30, 4, 'same', { lines: 400, branches: 391, functions: 400 })]);
  const result = compareLedger({ ledger, current: more, ...TOLERANT });
  assert.deepEqual(result.errors, [{ code: 'LEDGER-LOST-COVERAGE', file: 'src/orbit.js', message: 'src/orbit.js has 361 covered branches. The ledger records 370.' }]);
  const edge = gaps([loaded('src/orbit.js', 20, 30, 4, 'same', { lines: 400, branches: 392, functions: 400 })]);
  assert.deepEqual(compareLedger({ ledger, current: edge, ...TOLERANT }).errors, []);
});

test('[gap-ledger-073] does not write a worse count for a file with the tolerance conditions', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG }) } });
  const worse = ratchet(ledger, gaps([loaded('src/orbit.js', 26, 35, 6, 'same', BIG)]), TOLERANT);
  assert.deepEqual(worse.ledger.coverage['src/orbit.js'], { ...entry(LOADED(20, 30, 4, { totals: BIG })) });
  assert.deepEqual(worse.history, []);
  const better = ratchet(ledger, gaps([loaded('src/orbit.js', 14, 24, 1, 'same', BIG)]), TOLERANT);
  assert.deepEqual([better.ledger.coverage['src/orbit.js'].lines, better.ledger.coverage['src/orbit.js'].branches], [14, 24]);
  // An entry of an older ledger has no total counts, so the command takes the measured totals.
  const older = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: undefined }) } });
  const filled = ratchet(older, gaps([loaded('src/orbit.js', 26, 35, 6, 'same', BIG)]), TOLERANT);
  assert.deepEqual(filled.ledger.coverage['src/orbit.js'].totals, BIG);
});

test('[gap-ledger-074] uses no tolerance for a file without the tolerance conditions', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG }) } });
  const current = gaps([loaded('src/orbit.js', 24, 30, 4, 'same', BIG)]);
  assert.deepEqual(codes(compareLedger({ ledger, current })), ['LEDGER-LARGER-GAP']);
  const changed = gaps([loaded('src/orbit.js', 24, 30, 4, 'edited', BIG)]);
  assert.deepEqual(codes(compareLedger({ ledger, current: changed, ...TOLERANT })), ['LEDGER-LARGER-GAP']);
  const neverLoaded = ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } });
  assert.deepEqual(codes(compareLedger({ ledger: neverLoaded, current: gaps([unloaded('src/ui.js', 34)]), ...TOLERANT })), ['LEDGER-LARGER-GAP'], 'a file that no test loads gets no tolerance');
  const untrue = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG, untrue: true }) } });
  const fake = gaps([{ ...loaded('src/orbit.js', 24, 30, 4, 'same', BIG), untrue: true }]);
  assert.deepEqual(codes(compareLedger({ ledger: untrue, current: fake, ...TOLERANT })), ['LEDGER-LARGER-GAP']);
});

test('[gap-ledger-075] stops for a ledger entry without the total line count', () => {
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: { branches: 400, functions: 400 } }) } });
  const result = compareLedger({ ledger, current: gaps([loaded('src/orbit.js', 20, 30, 4, 'same', BIG)]), ...TOLERANT });
  assert.deepEqual(result.errors, [{ code: 'LEDGER-NO-TOTALS', file: 'src/orbit.js', message: 'The ledger entry for src/orbit.js has no total line, branch and function counts. Run the ratchet command.' }]);
  assert.deepEqual(ratchet(ledger, gaps([loaded('src/orbit.js', 20, 30, 4, 'same', BIG)]), TOLERANT).ledger.coverage['src/orbit.js'].totals, BIG);
});

test('[gap-ledger-076] stops for a ledger file with another version', () => {
  const ledger = { ...ledgerWith({ coverage: { 'src/orbit.js': LOADED(20, 30, 4, { totals: BIG }) } }), version: 3 };
  const current = gaps([loaded('src/orbit.js', 20, 30, 4, 'same', BIG)]);
  assert.deepEqual(compareLedger({ ledger, current, ...TOLERANT }).errors, [
    { code: 'LEDGER-VERSION', file: 'openspec/trace/gaps.json', message: 'openspec/trace/gaps.json has the version 3. The gates need the version 4.' },
  ]);
  withRoot((root) => assert.equal(writeLedger(root, ratchet(ledger, current, TOLERANT).ledger).version, 4));
});
