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
  appendSamples,
  coverageSample,
  readLedger,
  readSamples,
  stabilityLedger,
  writeLedger,
} from '../../../scripts/spec/lib/ledger.mjs';

const DATE = '2026-09-13';
const TOTALS = { branches: 100, functions: 10 };
const NO_TOTALS = { branches: null, functions: null };
const COMMIT = 'abc123';

function loaded(file, lines, branches, functions, sha = 'same', totals = TOTALS) {
  return { file, sha, loaded: true, complete: lines + branches + functions === 0, lines: { total: 100, uncovered: lines }, branches: { total: totals.branches, uncovered: branches }, functions: { total: totals.functions, uncovered: functions } };
}

function unloaded(file, lines, sha = 'same', untrue = false) {
  return { file, sha, untrue, loaded: false, complete: false, lines: { total: lines, uncovered: lines }, branches: null, functions: null };
}

function entry(value) {
  return { sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', ...value };
}

function ledgerWith({ coverage = {}, untracedTests = {} } = {}) {
  return {
    version: 2,
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
  withRoot((root) => {
    const current = gaps([loaded('src/orbit.js', 5, 3, 1, 'h1'), loaded('src/done.js', 0, 0, 0), unloaded('src/ui.js', 30, 'h2', true)], tests('src/a.test.mjs', 'one', 'two', 'two'));
    const ledger = initLedger({ root, current, date: DATE, baseHasLedger: false, baseFiles: new Set(['src/orbit.js', 'src/ui.js', 'src/a.test.mjs']) });
    assert.deepEqual(ledger, {
      version: 3,
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
  });
  withRoot((root) => assert.equal(readLedger(root), null));
});

test('[gap-ledger-015] does not make a ledger when the base has a ledger', () => {
  withRoot((root) => {
    assert.throws(() => initLedger({ root, current: gaps([]), date: DATE, baseHasLedger: true, baseFiles: new Set() }), /base commit has openspec\/trace\/gaps\.json/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/gaps.json')), false);
  });
});

test('[gap-ledger-016] does not record a new file as pre-spec', () => {
  withRoot((root) => {
    const current = gaps([loaded('scripts/spec/new.mjs', 1, 0, 0)], tests('src/new.test.mjs', 'old'));
    assert.throws(() => initLedger({ root, current, date: DATE, baseHasLedger: false, baseFiles: new Set() }), /not pre-spec: scripts\/spec\/new\.mjs, src\/new\.test\.mjs/);
    assert.equal(existsSync(path.join(root, 'openspec/trace/gaps.json')), false);
  });
});

test('[gap-ledger-003] stops for a new code file below 100%', () => {
  assert.deepEqual(compareLedger({ ledger: ledgerWith(), current: gaps([loaded('src/new.js', 0, 1, 0)]) }).errors, [
    { code: 'LEDGER-NEW-COVERAGE-GAP', file: 'src/new.js', message: 'src/new.js is not at 100%: 0 lines, 1 branches, 0 functions not covered' },
  ]);
  const unloadedNew = compareLedger({ ledger: ledgerWith(), current: gaps([unloaded('src/new.js', 12)]) });
  assert.deepEqual(unloadedNew.errors.map((error) => error.message), ['no test loads src/new.js']);
});

test('[gap-ledger-004] stops for more lines that are not covered and shows both counts', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 6, 3, 1)]) });
  assert.deepEqual(result.errors, [{ code: 'LEDGER-LARGER-GAP', file: 'src/orbit.js', message: 'src/orbit.js has 6 lines not covered. The ledger allows 5.' }]);
});

test('[gap-ledger-017] stops for more branches or functions that are not covered in a changed file', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current: gaps([loaded('src/orbit.js', 5, 4, 2, 'edited')]) });
  assert.deepEqual(result.errors.map((error) => error.message), [
    'src/orbit.js has 4 branches not covered. The ledger allows 3.',
    'src/orbit.js has 2 functions not covered. The ledger allows 1.',
  ]);
});

test('[gap-ledger-018] does not stop for branches that a new test shows in an unchanged file', () => {
  const current = gaps([loaded('src/orbit.js', 5, 9, 3, 'same', { branches: 106, functions: 12 })]);
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1) } }), current });
  assert.deepEqual(codes(result), ['LEDGER-STALE']);
});

test('[gap-ledger-054] stops for fewer covered branches or functions in an unchanged file', () => {
  const ledger = ledgerWith({ coverage: { 'src/x.js': LOADED(10, 0, 0, { totals: { branches: 5, functions: 2 } }), 'src/range.js': RANGE(10, 4, 1, { lines: 10, branches: 2, functions: 1 }) } });
  const lost = compareLedger({ ledger, current: gaps([loaded('src/x.js', 9, 2, 1, 'same', { branches: 4, functions: 2 }), loaded('src/range.js', 10, 3, 1)]) });
  assert.deepEqual(lost.errors, [
    { code: 'LEDGER-LOST-COVERAGE', file: 'src/x.js', message: 'src/x.js has 2 covered branches. The ledger records 5.' },
    { code: 'LEDGER-LOST-COVERAGE', file: 'src/x.js', message: 'src/x.js has 1 covered functions. The ledger records 2.' },
  ]);
  const aboveRange = compareLedger({ ledger, current: gaps([loaded('src/x.js', 10, 0, 0, 'same', { branches: 5, functions: 2 }), loaded('src/range.js', 10, 6, 1)]) });
  assert.deepEqual(codes(aboveRange), ['LEDGER-LOST-COVERAGE']);
  assert.throws(() => ratchet(ledger, gaps([loaded('src/x.js', 9, 2, 1, 'same', { branches: 4, functions: 2 })])), /LEDGER-LOST-COVERAGE src\/x\.js/);
  const base = ledgerWith({ coverage: { 'src/x.js': LOADED(10, 0, 0, { totals: { branches: 5, functions: 2 } }) } });
  const hidden = ledgerWith({ coverage: { 'src/x.js': LOADED(9, 2, 0, { totals: { branches: 4, functions: 2 } }) } });
  assert.deepEqual(codes(compareWithBase({ ledger: hidden, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, outsideChanged: true })), ['LEDGER-TOTALS-NOT-BASE', 'LEDGER-MORE-THAN-BASE']);
});

test('[gap-ledger-055] stops for a ledger entry without the total counts', () => {
  const ledger = ledgerWith({ coverage: { 'src/x.js': LOADED(10, 1, 1, { totals: undefined }), 'src/ui.js': UNLOADED(30) } });
  const result = compareLedger({ ledger, current: gaps([loaded('src/x.js', 10, 1, 1), unloaded('src/ui.js', 30)]) });
  assert.deepEqual(result.stale, [{ kind: 'coverage', file: 'src/x.js' }]);
  assert.match(result.errors[0].message, /Run the ratchet command\.$/);
  assert.deepEqual(ratchet(ledger, gaps([loaded('src/x.js', 10, 1, 1)])).ledger.coverage['src/x.js'].totals, TOTALS);
  const ranged = ledgerWith({ coverage: { 'src/range.js': RANGE(10, 4, 1, { lines: 8, branches: 2, functions: 1 }, { totals: undefined }), 'src/half.js': RANGE(9, null, null, { lines: 3, branches: null, functions: null }, { loaded: false, totals: undefined }) } });
  const inRange = compareLedger({ ledger: ranged, current: gaps([loaded('src/range.js', 9, 3, 1), unloaded('src/half.js', 5)]) });
  assert.deepEqual(inRange.stale, [{ kind: 'coverage', file: 'src/range.js' }]);
  for (const totals of [{}, { branches: null, functions: null }, { branches: 5, functions: '1' }]) {
    const wrong = ledgerWith({ coverage: { 'src/range.js': RANGE(10, 4, 1, { lines: 8, branches: 2, functions: 1 }, { totals }) } });
    assert.deepEqual(compareLedger({ ledger: wrong, current: gaps([loaded('src/range.js', 9, 3, 1)]) }).stale, [{ kind: 'coverage', file: 'src/range.js' }], JSON.stringify(totals));
  }
  assert.deepEqual(ratchet(ranged, gaps([loaded('src/range.js', 9, 3, 1), unloaded('src/half.js', 5)])).ledger.coverage['src/range.js'].totals, TOTALS);
});

test('[gap-ledger-019] stops for a changed file that has no branch count', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 20, 5, 1, 'edited')]) });
  assert.deepEqual(codes(result), ['LEDGER-NO-BASELINE']);
});

test('[gap-ledger-009] does not stop for a file that no test loaded and a test now loads with the same content', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 20, 15, 9)]) });
  assert.deepEqual(codes(result), ['LEDGER-STALE']);
  const larger = compareLedger({ ledger: ledgerWith({ coverage: { 'src/ui.js': UNLOADED(30) } }), current: gaps([loaded('src/ui.js', 31, 0, 1)]) });
  assert.deepEqual(codes(larger), ['LEDGER-LARGER-GAP']);
});

test('[gap-ledger-020] stops for a loaded file that no test loads now', () => {
  const result = compareLedger({ ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(50, 3, 1) } }), current: gaps([unloaded('src/orbit.js', 40)]) });
  assert.deepEqual(codes(result), ['LEDGER-UNLOADED']);
});

test('[gap-ledger-031 coverage-gate-018] does not stop for untrue coverage that the ledger records and stops for other untrue coverage', () => {
  const recorded = compareLedger({ ledger: ledgerWith({ coverage: { 'src/traffic.js': UNLOADED(40, { untrue: true }) } }), current: gaps([unloaded('src/traffic.js', 40, 'same', true)]) });
  assert.deepEqual(recorded.errors, []);
  const loadedBefore = compareLedger({ ledger: ledgerWith({ coverage: { 'src/traffic.js': LOADED(10, 1, 1) } }), current: gaps([unloaded('src/traffic.js', 40, 'same', true)]) });
  assert.deepEqual(codes(loadedBefore), ['COVERAGE-FAKE', 'LEDGER-LARGER-GAP']);
  const newFile = compareLedger({ ledger: ledgerWith(), current: gaps([unloaded('src/new.js', 4, 'same', true)]) });
  assert.deepEqual(codes(newFile), ['LEDGER-NEW-COVERAGE-GAP', 'COVERAGE-FAKE']);
});

test('[gap-ledger-005] stops for a new test file with untraced tests', () => {
  assert.deepEqual(compareLedger({ ledger: ledgerWith(), current: gaps([], tests('src/new.test.mjs', 'old style')) }).errors, [
    { code: 'LEDGER-NEW-UNTRACED', file: 'src/new.test.mjs', message: 'src/new.test.mjs has 1 untraced test names' },
  ]);
});

test('[gap-ledger-006] stops for a new untraced test name', () => {
  const result = compareLedger({ ledger: ledgerWith({ untracedTests: { 'src/a.test.mjs': { one: 1, two: 1 } } }), current: gaps([], tests('src/a.test.mjs', 'one', 'three')) });
  assert.deepEqual(result.errors, [{ code: 'LEDGER-NEW-UNTRACED-NAME', file: 'src/a.test.mjs', message: 'Untraced test "three" is not in the ledger' }]);
  const repeated = compareLedger({ ledger: ledgerWith({ untracedTests: { 'src/a.test.mjs': { one: 1 } } }), current: gaps([], tests('src/a.test.mjs', 'one', 'one')) });
  assert.deepEqual(codes(repeated), ['LEDGER-NEW-UNTRACED-NAME']);
});

test('[gap-ledger-007] does not stop for gaps that are equal to the ledger', () => {
  const result = compareLedger({
    ledger: ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/ui.js': UNLOADED(30) }, untracedTests: { 'src/a.test.mjs': { one: 1 } } }),
    current: gaps([loaded('src/orbit.js', 5, 3, 1), unloaded('src/ui.js', 30)], tests('src/a.test.mjs', 'one')),
  });
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
});

const BASE = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/traffic.js': UNLOADED(40, { untrue: true }) }, untracedTests: { 'src/a.test.mjs': { one: 1 } } });
const base = (overrides = {}) => compareWithBase({ ledger: BASE, baseLedger: BASE, retired: ['x-001'], baseRetired: ['x-001'], history: 'a\nb\n', baseHistory: 'a\n', ...overrides });

test('[gap-ledger-021] stops for a ledger entry that the base does not have', () => {
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
  const shown = { branches: 104, functions: 10 };
  const result = ratchet(ledger, gaps([loaded('src/orbit.js', 4, 7, 1, 'same', shown), loaded('src/ui.js', 20, 15, 9)]));
  assert.deepEqual([result.ledger.coverage['src/orbit.js'].branches, result.ledger.coverage['src/orbit.js'].totals], [7, shown]);
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
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(5, 3, 1), 'src/same.js': LOADED(5, 3, 1), 'src/legacy.js': LOADED(5, 3, 1, { totals: undefined }) } });
  const more = { branches: 101, functions: 11 };
  const result = ratchet(ledger, gaps([loaded('src/orbit.js', 5, 3, 1, 'same', more), loaded('src/same.js', 4, 3, 1), loaded('src/legacy.js', 5, 3, 1)]));
  assert.deepEqual(result.ledger.coverage['src/orbit.js'].totals, more);
  assert.deepEqual(
    result.history.filter((line) => line.metric === 'totals').map((line) => [line.file, line.before, line.after, line.reason, line.change]),
    [
      ['src/orbit.js', TOTALS, more, 'totals changed', 'backfill-orbit'],
      ['src/legacy.js', null, TOTALS, 'totals changed', 'backfill-orbit'],
    ],
  );
  const ranged = ledgerWith({ coverage: { 'src/range.js': RANGE(10, 4, 1, { lines: 8, branches: 2, functions: 1 }) } });
  const inRange = ratchet(ranged, gaps([loaded('src/range.js', 9, 3, 1, 'same', { branches: 102, functions: 10 })]));
  assert.deepEqual([inRange.ledger.coverage['src/range.js'].totals, inRange.history], [TOTALS, []]);
  const outside = ratchet(ranged, gaps([loaded('src/range.js', 7, 3, 1, 'same', { branches: 102, functions: 10 })]));
  assert.deepEqual(outside.history.filter((line) => line.metric === 'totals').map((line) => [line.before, line.after]), [[TOTALS, { branches: 102, functions: 10 }]]);
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

const RANGE = (lines, branches, functions, low, extra = {}) => ({ loaded: true, lines, branches, functions, totals: TOTALS, low, ...extra });

test('[gap-ledger-033] does not stop for counts in the range of an unstable file', () => {
  const ledger = ledgerWith({ coverage: { 'src/label.js': RANGE(44, 52, 3, { lines: 40, branches: 50, functions: 3 }), 'src/flaky.js': RANGE(2, 1, 0, { lines: 0, branches: 0, functions: 0 }) } });
  for (const run of [loaded('src/label.js', 40, 50, 3), loaded('src/label.js', 44, 52, 3), loaded('src/label.js', 42, 51, 3)]) {
    assert.deepEqual(compareLedger({ ledger, current: gaps([run, loaded('src/flaky.js', 1, 1, 0)]) }), { errors: [], stale: [] });
  }
  assert.deepEqual(compareLedger({ ledger, current: gaps([loaded('src/label.js', 40, 50, 3), loaded('src/flaky.js', 0, 0, 0)]) }), { errors: [], stale: [] });
  const unloadedRange = ledgerWith({ coverage: { 'src/half.js': RANGE(9, null, null, { lines: 3, branches: null, functions: null }, { loaded: false }) } });
  assert.deepEqual(compareLedger({ ledger: unloadedRange, current: gaps([unloaded('src/half.js', 5)]) }), { errors: [], stale: [] });
  const kept = ratchet(ledger, gaps([loaded('src/label.js', 42, 51, 3), loaded('src/flaky.js', 0, 0, 0)]));
  assert.deepEqual([kept.ledger.coverage, kept.history], [ledger.coverage, []]);
});

test('[gap-ledger-034] stops for counts below the range of an unstable file', () => {
  const ledger = ledgerWith({ coverage: { 'src/label.js': RANGE(44, 52, 3, { lines: 40, branches: 50, functions: 3 }) } });
  const result = compareLedger({ ledger, current: gaps([loaded('src/label.js', 30, 50, 3)]) });
  assert.deepEqual(codes(result), ['LEDGER-STALE']);
  assert.match(result.errors[0].message, /Run the ratchet command\.$/);
  const above = compareLedger({ ledger, current: gaps([loaded('src/label.js', 45, 50, 3)]) });
  assert.deepEqual(codes(above), ['LEDGER-LARGER-GAP']);
});

test('[gap-ledger-045] moves the range of each metric with a smaller count, keeps its width and records it', () => {
  const ledger = ledgerWith({ coverage: { 'src/label.js': RANGE(44, 52, 3, { lines: 40, branches: 50, functions: 3 }) } });
  const moved = ratchet(ledger, gaps([loaded('src/label.js', 30, 48, 3)]));
  assert.deepEqual(moved.ledger.coverage['src/label.js'], { loaded: true, lines: 34, branches: 50, functions: 3, totals: TOTALS, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', low: { lines: 30, branches: 48, functions: 3 } });
  assert.deepEqual(moved.history.map((line) => [line.metric, line.before, line.after, line.reason]), [
    ['lines', 44, 34, 'smaller'],
    ['branches', 52, 50, 'smaller'],
  ]);
});

test('[gap-ledger-049] keeps the range of a metric with a count in its range', () => {
  const ledger = ledgerWith({ coverage: { 'src/data/labelArbiter.js': RANGE(18, 52, 3, { lines: 18, branches: 50, functions: 3 }), 'src/half.js': RANGE(9, null, null, { lines: 3, branches: null, functions: null }, { loaded: false }) } });
  const current = gaps([loaded('src/data/labelArbiter.js', 10, 52, 3), loaded('src/half.js', 5, 2, 1)]);
  const result = ratchet(ledger, current);
  assert.deepEqual(result.ledger.coverage['src/data/labelArbiter.js'], { loaded: true, lines: 10, branches: 52, functions: 3, totals: TOTALS, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', low: { lines: 10, branches: 50, functions: 3 } });
  assert.deepEqual(result.ledger.coverage['src/half.js'], { loaded: true, lines: 9, branches: 2, functions: 1, totals: TOTALS, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', low: { lines: 3, branches: 2, functions: 1 } });
  assert.deepEqual(result.history.map((line) => [line.file, line.metric, line.before, line.after]), [
    ['src/data/labelArbiter.js', 'lines', 18, 10],
    ['src/half.js', 'loaded', false, true],
  ]);
  assert.deepEqual(compareLedger({ ledger: result.ledger, current }), { errors: [], stale: [] });
  const base = ledgerWith({ coverage: { 'src/data/labelArbiter.js': RANGE(18, 52, 3, { lines: 18, branches: 50, functions: 3 }) } });
  const own = { ...result.ledger, coverage: { 'src/data/labelArbiter.js': result.ledger.coverage['src/data/labelArbiter.js'] } };
  assert.deepEqual(compareWithBase({ ledger: own, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, change: 'backfill-orbit', outsideChanged: true }), []);
});

test('[gap-ledger-050] moves the range of an unstable file up for branches that a new test shows', () => {
  const ledger = ledgerWith({ coverage: { 'src/label.js': RANGE(44, 52, 3, { lines: 40, branches: 50, functions: 3 }) } });
  const result = ratchet(ledger, gaps([loaded('src/label.js', 42, 55, 3, 'same', { branches: 103, functions: 10 })]));
  assert.deepEqual([result.ledger.coverage['src/label.js'].branches, result.ledger.coverage['src/label.js'].low], [55, { lines: 40, branches: 53, functions: 3 }]);
  assert.equal(result.ledger.coverage['src/label.js'].lines, 44);
  assert.deepEqual(result.history.map((line) => [line.metric, line.before, line.after, line.reason]), [
    ['branches', 52, 55, 'shown by test'],
    ['totals', TOTALS, { branches: 103, functions: 10 }, 'totals changed'],
  ]);
});

const STABILITY = { change: 'establish-spec-governance', changeActive: true, date: DATE, commit: COMMIT, sameAsBase: () => true };

/** Group coverage records by file. The last record gives the current content hash. */
function samplesOf(...runs) {
  const samples = new Map();
  for (const record of runs.flat()) {
    const sample = coverageSample(record);
    const item = samples.get(record.file) || { sha: record.sha, list: [] };
    item.sha = record.sha;
    item.list.push(sample);
    samples.set(record.file, item);
  }
  return samples;
}

const stability = (ledger, runs, extra = {}) => stabilityLedger({ ledger, samples: samplesOf(...runs), ...STABILITY, ...extra });

test('[gap-ledger-035] records the range of a file with unstable coverage', () => {
  const ledger = ledgerWith({ coverage: { 'src/label.js': LOADED(44, 50, 3), 'src/steady.js': LOADED(5, 1, 0) } });
  const runA = [loaded('src/label.js', 44, 52, 3), loaded('src/steady.js', 5, 1, 0), unloaded('src/ui.js', 10), loaded('src/once.js', 2, 0, 0), loaded('src/flaky.js', 0, 0, 0)];
  const runB = [loaded('src/label.js', 40, 50, 3), loaded('src/steady.js', 5, 1, 0), loaded('src/flaky.js', 1, 0, 0), unloaded('src/ui.js', 10), loaded('src/once.js', 0, 0, 0), loaded('src/done.js', 0, 0, 0)];
  const result = stability(ledger, [runA, runB]);
  assert.deepEqual(result.ledger.coverage['src/label.js'], { loaded: true, lines: 44, branches: 52, functions: 3, totals: TOTALS, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', low: { lines: 40, branches: 50, functions: 3 } });
  assert.deepEqual(result.ledger.coverage['src/flaky.js'], { loaded: true, lines: 1, branches: 0, functions: 0, totals: TOTALS, sha: 'same', untrue: false, origin: 'unstable', since: DATE, low: { lines: 0, branches: 0, functions: 0 } });
  assert.equal(result.ledger.coverage['src/steady.js'], ledger.coverage['src/steady.js']);
  assert.equal(result.ledger.coverage['src/done.js'], undefined);
  assert.deepEqual(result.ledger.coverage['src/once.js'].low, { lines: 0, branches: 0, functions: 0 });
  assert.deepEqual(result.history, [
    { date: DATE, change: 'establish-spec-governance', commit: COMMIT, kind: 'coverage', file: 'src/flaky.js', metric: 'range', before: null, after: { lines: [0, 1], branches: [0, 0], functions: [0, 0] }, reason: 'unstable' },
    { date: DATE, change: 'establish-spec-governance', commit: COMMIT, kind: 'coverage', file: 'src/label.js', metric: 'range', before: { lines: 44, branches: 50, functions: 3 }, after: { lines: [40, 44], branches: [50, 52], functions: [3, 3] }, reason: 'unstable' },
    { date: DATE, change: 'establish-spec-governance', commit: COMMIT, kind: 'coverage', file: 'src/once.js', metric: 'range', before: null, after: { lines: [0, 2], branches: [0, 0], functions: [0, 0] }, reason: 'unstable' },
  ]);
  const again = stability(result.ledger, [[loaded('src/label.js', 46, 51, 3)], [loaded('src/label.js', 41, 51, 3)]]);
  assert.deepEqual([again.ledger.coverage['src/label.js'].lines, again.ledger.coverage['src/label.js'].low.lines], [46, 40]);
  const loadedOnce = stability(ledger, [[unloaded('src/half.js', 9)], [loaded('src/half.js', 3, 1, 1)]]);
  assert.deepEqual([loadedOnce.ledger.coverage['src/half.js'].branches, loadedOnce.ledger.coverage['src/half.js'].low.lines, loadedOnce.ledger.coverage['src/half.js'].totals], [null, 3, TOTALS]);
  const oldSamples = new Map([['src/old.js', { sha: 'same', list: [{ file: 'src/old.js', sha: 'same', loaded: true, lines: 1, branches: 0, functions: 0, untrue: false }, { file: 'src/old.js', sha: 'same', loaded: true, lines: 2, branches: 0, functions: 0, untrue: false }] }]]);
  assert.equal(stabilityLedger({ ledger: ledgerWith(), samples: oldSamples, ...STABILITY }).ledger.coverage['src/old.js'].totals, null);
  const entrySample = stability(ledgerWith({ coverage: { 'src/store.js': LOADED(40, 1, 0) } }), [[loaded('src/store.js', 44, 1, 0)], [loaded('src/store.js', 44, 1, 0)]]);
  assert.deepEqual([entrySample.ledger.coverage['src/store.js'].low.lines, entrySample.ledger.coverage['src/store.js'].lines], [40, 44]);
  const inside = stability(result.ledger, [[loaded('src/label.js', 41, 51, 3)], [loaded('src/label.js', 43, 50, 3)]]);
  assert.deepEqual(inside.history, []);
  const edited = stability(result.ledger, [[loaded('src/label.js', 41, 51, 3, 'edited')], [loaded('src/label.js', 41, 51, 3, 'edited')]]);
  assert.deepEqual(edited.history, []);
  const oldSample = stability(ledger, [[loaded('src/label.js', 30, 50, 3, 'old')], [loaded('src/label.js', 44, 50, 3)]]);
  assert.deepEqual(oldSample.history, []);
  assert.throws(() => stability(ledger, [runA, runB], { change: undefined }), /needs --change/);
  assert.throws(() => stability(ledger, [runA, runB], { changeActive: false }), /no folder with a proposal\.md/);
});

test('[gap-ledger-058] records a file with unstable total counts as unstable', () => {
  const ledger = ledgerWith({ coverage: { 'src/geocoder.js': LOADED(4, 5, 1, { totals: { branches: 118, functions: 16 } }), 'src/old.js': LOADED(2, 1, 0) } });
  const runA = [loaded('src/geocoder.js', 4, 5, 1, 'same', { branches: 118, functions: 16 }), loaded('src/old.js', 2, 1, 0)];
  const runB = [loaded('src/geocoder.js', 4, 5, 1, 'same', { branches: 117, functions: 16 }), loaded('src/old.js', 2, 1, 0)];
  const result = stability(ledger, [runA, runB]);
  assert.deepEqual(result.ledger.coverage['src/geocoder.js'], { loaded: true, lines: 4, branches: 5, functions: 1, totals: { branches: 118, functions: 16 }, sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', low: { lines: 4, branches: 5, functions: 1 } });
  assert.deepEqual(result.history.map((line) => [line.file, line.reason, line.after]), [['src/geocoder.js', 'unstable', { lines: [4, 4], branches: [5, 5], functions: [1, 1] }]]);
  const oldSamples = new Map([['src/old.js', { sha: 'same', list: [{ file: 'src/old.js', sha: 'same', loaded: true, lines: 2, branches: 1, functions: 0, untrue: false }] }]]);
  assert.deepEqual(stabilityLedger({ ledger, samples: oldSamples, ...STABILITY }).history, []);
  const complete = stability(ledger, [[loaded('src/done.js', 0, 0, 0, 'same', { branches: 20, functions: 2 })], [loaded('src/done.js', 0, 0, 0, 'same', { branches: 21, functions: 2 })]]);
  assert.deepEqual([complete.ledger.coverage['src/done.js'], complete.history], [undefined, []]);
  assert.deepEqual(compareLedger({ ledger: result.ledger, current: gaps([loaded('src/geocoder.js', 4, 5, 1, 'same', { branches: 117, functions: 16 }), loaded('src/old.js', 2, 1, 0)]) }), { errors: [], stale: [] });
});

test('[gap-ledger-036] does not record a changed file as unstable', () => {
  const ledger = ledgerWith({ coverage: { 'src/label.js': LOADED(44, 50, 3) } });
  assert.throws(() => stability(ledger, [[loaded('src/label.js', 44, 50, 3)], [loaded('src/label.js', 40, 50, 3)]], { sameAsBase: () => false }), /content is not the base content: src\/label\.js/);
});

test('[gap-ledger-039] keeps a coverage sample of each code file and reads the samples by file', () => {
  withRoot((root) => {
    assert.deepEqual(readSamples(root), new Map());
    appendSamples(root, [loaded('src/label.js', 44, 50, 3), unloaded('src/ui.js', 10)]);
    appendSamples(root, [loaded('src/label.js', 40, 50, 3)]);
    assert.equal(readFileSync(path.join(root, '.gev-cache/spec-samples.jsonl'), 'utf8').trim().split('\n').length, 3);
    assert.deepEqual(readSamples(root).get('src/label.js'), [
      { file: 'src/label.js', sha: 'same', loaded: true, lines: 44, branches: 50, functions: 3, totals: TOTALS, untrue: false },
      { file: 'src/label.js', sha: 'same', loaded: true, lines: 40, branches: 50, functions: 3, totals: TOTALS, untrue: false },
    ]);
    assert.deepEqual(readSamples(root).get('src/ui.js'), [{ file: 'src/ui.js', sha: 'same', loaded: false, lines: 10, branches: null, functions: null, totals: NO_TOTALS, untrue: false }]);
  });
});

const RANGE_BASE = ledgerWith({ coverage: { 'src/label.js': LOADED(40, 50, 3) } });
const withRange = ledgerWith({ coverage: { 'src/label.js': RANGE(44, 52, 3, { lines: 40, branches: 50, functions: 3 }), 'src/flaky.js': RANGE(1, 0, 0, { lines: 0, branches: 0, functions: 0 }) } });
const unstableLine = (file, change = 'record-flaky') => `${JSON.stringify({ date: DATE, change, commit: COMMIT, file, reason: 'unstable' })}\n`;
const BOTH_LINES = `a\n${unstableLine('src/label.js')}${unstableLine('src/flaky.js')}`;
const compareRange = (extra) => compareWithBase({ ledger: withRange, baseLedger: RANGE_BASE, retired: [], baseRetired: [], history: BOTH_LINES, baseHistory: 'a\n', sameAsBase: () => true, change: 'record-flaky', ...extra });

test('[gap-ledger-037] does not stop for an unstable range that the history of the checked change records', () => {
  assert.deepEqual(compareRange({}), []);
  const narrower = ledgerWith({ coverage: { 'src/label.js': RANGE(43, 52, 3, { lines: 40, branches: 50, functions: 3 }) } });
  assert.deepEqual(compareWithBase({ ledger: narrower, baseLedger: withRange, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, outsideChanged: true }), []);
});

test('[gap-ledger-051] stops for a wider unstable range of a changed file', () => {
  assert.deepEqual(compareRange({ sameAsBase: () => false }), [
    { code: 'LEDGER-UNSTABLE-CHANGED', file: 'src/label.js', message: 'The unstable range for src/label.js is wider than the base, but the file content is not the base content' },
    { code: 'LEDGER-UNSTABLE-CHANGED', file: 'src/flaky.js', message: 'The unstable range for src/flaky.js is wider than the base, but the file content is not the base content' },
  ]);
});

test('[gap-ledger-042] stops for an unstable range in a diff that changes a file outside openspec', () => {
  assert.deepEqual(compareRange({ outsideChanged: true }), [
    { code: 'LEDGER-UNSTABLE-FILE-CHANGE', file: 'src/label.js', message: 'The unstable range for src/label.js is wider than the base, and the diff changes a file that is not in openspec/' },
    { code: 'LEDGER-UNSTABLE-FILE-CHANGE', file: 'src/flaky.js', message: 'The unstable range for src/flaky.js is wider than the base, and the diff changes a file that is not in openspec/' },
  ]);
});

test('[gap-ledger-059] uses the rules of a wider range for a new range with equal low and high counts', () => {
  const base = ledgerWith({ coverage: { 'src/orbit.js': LOADED(10, 3, 1, { totals: { branches: 50, functions: 10 } }) } });
  const ledger = ledgerWith({ coverage: { 'src/orbit.js': LOADED(10, 3, 1, { totals: { branches: 50, functions: 10 }, low: { lines: 10, branches: 3, functions: 1 } }) } });
  const compare = (extra) => compareWithBase({ ledger, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, change: 'record-flaky', ...extra });
  assert.deepEqual(codes(compare({ outsideChanged: true })), ['LEDGER-UNSTABLE-NO-HISTORY', 'LEDGER-UNSTABLE-FILE-CHANGE']);
  assert.deepEqual(compare({ history: unstableLine('src/orbit.js') }), []);
  assert.deepEqual(codes(compareWithBase({ ledger, baseLedger: ledger, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, outsideChanged: true })), []);
});

test('[gap-ledger-060] stops for an unstable range that moves above the base range', () => {
  const base = ledgerWith({ coverage: { 'src/geocoder.js': LOADED(4, 5, 1, { totals: { branches: 118, functions: 16 }, low: { lines: 4, branches: 5, functions: 1 } }) } });
  const moved = ledgerWith({ coverage: { 'src/geocoder.js': LOADED(4, 8, 1, { totals: { branches: 121, functions: 16 }, low: { lines: 4, branches: 8, functions: 1 } }) } });
  const forged = `${JSON.stringify({ change: 'backfill-x', file: 'src/geocoder.js', metric: 'totals' })}\n`;
  const compare = (extra) => compareWithBase({ ledger: moved, baseLedger: base, retired: [], baseRetired: [], history: forged, baseHistory: '', sameAsBase: () => true, change: 'backfill-x', outsideChanged: true, ...extra });
  assert.deepEqual(compare({}), [
    { code: 'LEDGER-UNSTABLE-MOVED-UP', file: 'src/geocoder.js', message: 'The unstable range for src/geocoder.js allows 8 branches. The base range allows 5.' },
  ]);
  assert.deepEqual(compare({ sameAsBase: () => false }).map((error) => error.code), ['LEDGER-UNSTABLE-CHANGED', 'LEDGER-MORE-THAN-BASE']);
  const down = ledgerWith({ coverage: { 'src/geocoder.js': LOADED(4, 4, 1, { totals: { branches: 118, functions: 16 }, low: { lines: 4, branches: 4, functions: 1 } }) } });
  assert.deepEqual(compareWithBase({ ledger: down, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true }), []);
});

test('[gap-ledger-061] stops for a range that is not correct', () => {
  const bad = (low, extra = {}) => ledgerWith({ coverage: { 'src/actions.js': RANGE(1304, 221, 65, low, extra) } });
  const run = gaps([loaded('src/actions.js', 1303, 100, 65, 'same', { branches: 800, functions: 157 })]);
  const cases = [
    { lines: 1302, branches: null, functions: 65 },
    { lines: 1302, branches: 222, functions: 65 },
    { lines: -1, branches: 219, functions: 65 },
    { lines: 1302.5, branches: 219, functions: 65 },
    { lines: 1302, functions: 65 },
    'x',
  ];
  for (const low of cases) {
    const result = compareLedger({ ledger: bad(low), current: run });
    assert.deepEqual(result.errors[0], { code: 'LEDGER-BAD-RANGE', file: 'src/actions.js', message: 'The range of src/actions.js has a low count that is not an integer from 0 to its high count' }, JSON.stringify(low));
    assert.throws(() => ratchet(bad(low), run), /LEDGER-BAD-RANGE/);
  }
  const halfBad = ledgerWith({ coverage: { 'src/half.js': RANGE(9, null, null, { lines: 3, branches: 0, functions: null }, { loaded: false }) } });
  assert.deepEqual(codes(compareLedger({ ledger: halfBad, current: gaps([unloaded('src/half.js', 5)]) })), ['LEDGER-BAD-RANGE']);
  const halfGood = ledgerWith({ coverage: { 'src/half.js': RANGE(9, null, null, { lines: 3, branches: null, functions: null }, { loaded: false }) } });
  assert.deepEqual(compareLedger({ ledger: halfGood, current: gaps([unloaded('src/half.js', 5)]) }), { errors: [], stale: [] });
});

test('[gap-ledger-062] uses the low counts for a changed file with a range and removes the range in the ratchet command', () => {
  const ledger = ledgerWith({ coverage: { 'src/actions.js': RANGE(1304, 221, 65, { lines: 1302, branches: 219, functions: 65 }, { totals: { branches: 798, functions: 157 } }) } });
  const slack = gaps([loaded('src/actions.js', 1304, 221, 65, 'edited', { branches: 800, functions: 157 })]);
  assert.deepEqual(compareLedger({ ledger, current: slack }).errors.map((error) => error.message), [
    'src/actions.js has 1304 lines not covered. The ledger allows 1302.',
    'src/actions.js has 221 branches not covered. The ledger allows 219.',
  ]);
  const atLow = gaps([loaded('src/actions.js', 1302, 219, 65, 'edited', { branches: 798, functions: 157 })]);
  assert.deepEqual(codes(compareLedger({ ledger, current: atLow })), ['LEDGER-STALE']);
  const result = ratchet(ledger, atLow);
  assert.equal(result.ledger.coverage['src/actions.js'].low, undefined);
  assert.deepEqual([result.ledger.coverage['src/actions.js'].lines, result.ledger.coverage['src/actions.js'].branches], [1302, 219]);
  assert.deepEqual(result.history.filter((line) => line.metric === 'range').map((line) => [line.before, line.after, line.reason]), [[{ lines: 1302, branches: 219, functions: 65 }, null, 'content changed']]);
  assert.deepEqual(compareLedger({ ledger: result.ledger, current: atLow }), { errors: [], stale: [] });
});

test('[gap-ledger-063] uses the base low counts for a changed unstable file', () => {
  const base = ledgerWith({ coverage: { 'src/actions.js': RANGE(1304, 221, 65, { lines: 1302, branches: 219, functions: 65 }, { totals: { branches: 798, functions: 157 } }) } });
  const compare = (ledger, extra = {}) => compareWithBase({ ledger, baseLedger: base, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => false, outsideChanged: true, ...extra });
  const editA = ledgerWith({ coverage: { 'src/actions.js': RANGE(1304, 221, 65, { lines: 1302, branches: 219, functions: 65 }, { sha: 'edited', totals: { branches: 800, functions: 157 } }) } });
  assert.deepEqual(codes(compare(editA)), ['LEDGER-UNSTABLE-CHANGED', 'LEDGER-LARGER-THAN-BASE', 'LEDGER-MORE-THAN-BASE']);
  const editB = ledgerWith({ coverage: { 'src/actions.js': LOADED(1304, 221, 65, { sha: 'edited', totals: { branches: 800, functions: 157 } }) } });
  assert.deepEqual(compare(editB), [
    { code: 'LEDGER-LARGER-THAN-BASE', file: 'src/actions.js', message: 'The ledger allows 1304 lines for src/actions.js. The base ledger allows 1302.' },
    { code: 'LEDGER-MORE-THAN-BASE', file: 'src/actions.js', message: 'src/actions.js changed, and the ledger allows 221 branches. The base ledger allows 219.' },
  ]);
  const atLow = ledgerWith({ coverage: { 'src/actions.js': LOADED(1302, 219, 65, { sha: 'edited', totals: { branches: 798, functions: 157 } }) } });
  assert.deepEqual(compare(atLow), []);
  const sameContent = ledgerWith({ coverage: { 'src/actions.js': LOADED(1303, 220, 65, { totals: { branches: 798, functions: 157 } }) } });
  assert.deepEqual(codes(compare(sameContent, { sameAsBase: () => true })), []);
});

test('[gap-ledger-064] closes the gap of a changed unstable file at 100%', () => {
  const ledger = ledgerWith({ coverage: { 'src/flaky.js': RANGE(2, 1, 0, { lines: 0, branches: 0, functions: 0 }) } });
  const same = gaps([loaded('src/flaky.js', 0, 0, 0)]);
  assert.deepEqual(compareLedger({ ledger, current: same }), { errors: [], stale: [] });
  const changed = gaps([loaded('src/flaky.js', 0, 0, 0, 'edited')]);
  const result = compareLedger({ ledger, current: changed });
  assert.deepEqual(result.stale, [{ kind: 'coverage', file: 'src/flaky.js' }]);
  assert.match(result.errors[0].message, /Run the ratchet command\.$/);
  const closed = ratchet(ledger, changed);
  assert.deepEqual(closed.ledger.coverage, {});
  assert.deepEqual(closed.history.map((line) => [line.file, line.before, line.after, line.reason]), [['src/flaky.js', 2, 0, 'closed']]);
  assert.deepEqual(ratchet(ledger, same).ledger.coverage, ledger.coverage);
});

test('[gap-ledger-043] stops for an unstable range that is too wide', () => {
  const ledger = ledgerWith({ coverage: { 'src/big.js': RANGE(1030, 50, 3, { lines: 1000, branches: 50, functions: 3 }), 'src/small.js': RANGE(46, 50, 9, { lines: 40, branches: 50, functions: 3 }), 'src/fits.js': RANGE(1020, 5, 3, { lines: 1000, branches: 0, functions: 3 }), 'src/half.js': RANGE(9, null, null, { lines: 3, branches: null, functions: null }, { loaded: false }) } });
  const errors = compareWithBase({ ledger, baseLedger: ledger, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true });
  assert.deepEqual(errors.map((error) => [error.code, error.message]), [
    ['LEDGER-UNSTABLE-TOO-WIDE', 'The unstable range for src/big.js is 30 lines wide. The limit is 20.'],
    ['LEDGER-UNSTABLE-TOO-WIDE', 'The unstable range for src/small.js is 6 lines wide. The limit is 5.'],
    ['LEDGER-UNSTABLE-TOO-WIDE', 'The unstable range for src/small.js is 6 functions wide. The limit is 5.'],
    ['LEDGER-UNSTABLE-TOO-WIDE', 'The unstable range for src/half.js is 6 lines wide. The limit is 5.'],
  ]);
});

test('[gap-ledger-052] stops for an unstable high count that is too far above the base', () => {
  const ledger = ledgerWith({ coverage: { 'src/big.js': RANGE(1030, 50, 3, { lines: 1010, branches: 50, functions: 3 }), 'src/small.js': RANGE(46, 50, 9, { lines: 41, branches: 50, functions: 4 }), 'src/new.js': RANGE(6, 0, 0, { lines: 1, branches: 0, functions: 0 }), 'src/half.js': RANGE(9, null, null, { lines: 4, branches: null, functions: null }, { loaded: false }) } });
  const baseLedger = ledgerWith({ coverage: { 'src/big.js': LOADED(1000, 50, 3), 'src/small.js': LOADED(40, 50, 3), 'src/half.js': UNLOADED(4) } });
  const history = ['src/big.js', 'src/small.js', 'src/new.js', 'src/half.js'].map((file) => unstableLine(file)).join('');
  const errors = compareWithBase({ ledger, baseLedger, retired: [], baseRetired: [], history, baseHistory: '', sameAsBase: () => true, change: 'record-flaky' });
  assert.deepEqual(errors.map((error) => [error.code, error.message]), [
    ['LEDGER-UNSTABLE-ABOVE-BASE', 'The unstable range for src/big.js allows 1030 lines. The limit is 1020.'],
    ['LEDGER-UNSTABLE-ABOVE-BASE', 'The unstable range for src/small.js allows 46 lines. The limit is 45.'],
    ['LEDGER-UNSTABLE-ABOVE-BASE', 'The unstable range for src/small.js allows 9 functions. The limit is 8.'],
    ['LEDGER-UNSTABLE-ABOVE-BASE', 'The unstable range for src/new.js allows 6 lines. The limit is 5.'],
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

test('[gap-ledger-038] stops for an unstable range without a history line from the checked change', () => {
  const errors = compareRange({ history: 'rewritten\n' });
  assert.deepEqual(codes(errors), ['LEDGER-UNSTABLE-NO-HISTORY', 'LEDGER-UNSTABLE-NO-HISTORY', 'LEDGER-HISTORY-CHANGED']);
  const otherChange = compareRange({ history: `a\n${unstableLine('src/label.js', 'other')}${JSON.stringify({ file: 'src/flaky.js', reason: 'unstable' })}\n` });
  assert.deepEqual(otherChange.map((error) => error.message), [
    'The unstable range for src/label.js is wider than the base, but the history has no unstable line for it from the change record-flaky',
    'The unstable range for src/flaky.js is wider than the base, but the history has no unstable line for it from the change record-flaky',
  ]);
  assert.deepEqual(codes(compareRange({ change: undefined })), ['LEDGER-UNSTABLE-NO-HISTORY', 'LEDGER-UNSTABLE-NO-HISTORY']);
});
