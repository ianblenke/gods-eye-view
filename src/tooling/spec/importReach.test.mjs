import test from 'node:test';
import assert from 'node:assert/strict';
import { importReach, adoptableReached } from '../../../scripts/spec/lib/import-reach.mjs';
import { adoptLedger, checkAdopts, adoptedCounts, compareWithBase } from '../../../scripts/spec/lib/ledger.mjs';

const FILE = 'src/leaf.js';
const GAP = { loaded: false, lines: 9, branches: null, functions: null, totals: { lines: 9, branches: null, functions: null }, sha: 'base', untrue: true };
const OLD = { ...GAP, loaded: true, lines: 1, branches: 1, functions: 1, totals: { lines: 9, branches: 2, functions: 2 }, untrue: false, origin: 'pre-spec', since: '2026-09-01' };
const BASE = { version: 4, coverage: { [FILE]: OLD }, untracedTests: {} };
const CURRENT = { coverage: new Map([[FILE, GAP]]), untraced: new Map(), hashes: new Map() };
const LINE = { date: '2026-09-30', change: 'sync', commit: 'head', kind: 'adopt', file: FILE, from: 'up', lines: 9, branches: null, functions: null, untraced: 0, untrue: true, reached: true };
const rule = (extra = {}) => adoptableReached({ file: FILE, codeFiles: new Set([FILE]), sameAsBase: () => true, current: CURRENT, baseLedger: BASE, reached: new Set([FILE]), ...extra });
const record = (reached) => adoptLedger({ ledger: BASE, current: CURRENT, eligible: () => false, reached, date: '2026-09-30', change: 'sync', commit: 'head', from: 'up' });

// Literal import paths include cycles and exports. Other paths supply no edge.
test('[gap-ledger-100 gap-ledger-102] The import paths reach only tracked code descendants', () => {
  const sources = new Map([
    ['src/root.js', "import './mid'; import './plain'; import 'pkg'; import 'node:fs'; import './missing'; import './spec.test.mjs';"],
    ['src/mid.mjs', "export * from './folder'; import('./leaf.js');"],
    ['src/folder/index.js', "import '../root.js'; import '../other';"],
    ['src/other/index.mjs', "export const value = 1;"],
    [FILE, "export const value = 1;"],
    ['src/spec.test.mjs', "import './alone.js';"],
    ['src/alone.js', 'export const value = 1;'],
    ['src/plain.js', 'export const value = 1;'],
    ['src/bad.js', 'import('],
    ['src/page.html', '<html></html>'],
    ['src/dynamic.js', 'import(name);'],
  ]);
  const graph = importReach({ files: [...sources.keys()], readFile: (file) => sources.get(file), baseFiles: [], readBaseFile: () => { throw new Error("No base files"); } });
  assert.deepEqual([...graph(new Set(['src/root.js', 'src/spec.test.mjs', 'absent']))].sort(), ['src/folder/index.js', 'src/leaf.js', 'src/mid.mjs', 'src/other/index.mjs', 'src/plain.js', 'src/root.js']);
  assert.deepEqual([...graph(new Set(['src/alone.js', 'src/bad.js', 'src/page.html', 'src/dynamic.js']))], []);
  assert.equal(rule(), true);
  assert.equal(rule({ baseLedger: null }), true);
  assert.equal(rule({ baseLedger: { coverage: {} } }), true);
});

test('[gap-ledger-100 gap-ledger-106] The ledger records the reached gap and its own marks', () => {
  const result = record(() => rule());
  assert.deepEqual(result.ledger.coverage[FILE], { loaded: false, lines: 9, branches: null, functions: null, totals: { lines: 9, branches: null, functions: null }, sha: 'base', untrue: true, origin: 'pre-spec', since: '2026-09-01' });
  assert.deepEqual(result.history, [{ date: '2026-09-30', change: 'sync', commit: 'head', kind: 'adopt', file: 'src/leaf.js', from: 'up', lines: 9, branches: null, functions: null, untraced: 0, untrue: true, reached: true }]);
  assert.equal(Object.hasOwn(result.history[0], 'reached'), true);
  assert.equal(Object.hasOwn(result.history[0], 'untrue'), true);
  const changed = adoptLedger({ ledger: { coverage: {}, untracedTests: {} }, current: CURRENT, eligible: () => true, reached: () => true, date: '2026-09-30', change: 'sync', commit: 'head', from: 'up' });
  assert.equal(Object.hasOwn(changed.history[0], 'reached'), false);
  assert.equal(changed.ledger.coverage[FILE].origin, 'sync');
});

test('[gap-ledger-091 gap-ledger-101] The rule rejects true coverage and old untrue coverage', () => {
  const current = { ...CURRENT, coverage: new Map([[FILE, { ...GAP, untrue: false }]]) };
  assert.equal(rule({ current }), false);
  assert.equal(rule({ current: { ...CURRENT, coverage: new Map() } }), false);
  assert.equal(rule({ baseLedger: { coverage: { [FILE]: { ...OLD, untrue: true } } } }), false);
  assert.equal(rule({ baseLedger: { coverage: { [FILE]: {} } } }), false);
  assert.deepEqual(record(() => rule({ current })).history, []);
});

test('[gap-ledger-102] The rule rejects absent paths and files outside the code set', () => {
  assert.equal(rule({ reached: new Set() }), false);
  assert.equal(rule({ codeFiles: new Set() }), false);
  assert.deepEqual(record(() => rule({ reached: new Set() })).history, []);
});

test('[gap-ledger-103] The rule rejects other content for the reached exception', () => {
  assert.equal(rule({ sameAsBase: () => false }), false);
  assert.deepEqual(record(() => rule({ sameAsBase: () => false })).history, []);
  const result = adoptLedger({ ledger: BASE, current: CURRENT, eligible: () => true, date: '2026-09-30', change: 'sync', commit: 'head', from: 'up' });
  assert.equal(result.history.length, 1);
  assert.equal(Object.hasOwn(result.history[0], 'reached'), false);
  const changed = new Set(['src/root.js']);
  const rejected = adoptLedger({ ledger: BASE, current: CURRENT, eligible: (file) => changed.has(file), reached: () => rule({ sameAsBase: () => false }), date: '2026-09-30', change: 'sync', commit: 'head', from: 'up' });
  assert.deepEqual(rejected.history, []);
  assert.equal(rejected.ledger.coverage[FILE].lines, 1);
});

const check = (extra = {}) => checkAdopts({ adopts: [LINE], isMergedCommit: () => true, changedFiles: () => new Set(['src/root.js']), reachedValid: () => rule(), ...extra });
const compare = (ledger, baseLedger, lines) => compareWithBase({ ledger, baseLedger, retired: [], baseRetired: [], history: '', baseHistory: '', sameAsBase: () => true, adopted: adoptedCounts(lines) });

test('[gap-ledger-104] The gate allows valid reached counts and rejects a larger count', () => {
  const checked = check();
  assert.equal(checked.valid.length, 1);
  assert.equal(checked.valid[0].file, 'src/leaf.js');
  assert.deepEqual(checked.errors, []);
  assert.equal(adoptedCounts([LINE, { ...LINE, reached: false }]).get(FILE).reached, true);
  const ledger = { ...BASE, coverage: { [FILE]: { ...GAP, origin: 'pre-spec', since: '2026-09-01' } } };
  assert.deepEqual(compare(ledger, BASE, check().valid), []);
  assert.equal(compare(ledger, BASE, check().valid).some((error) => error.code === 'LEDGER-UNTRUE-NOT-IN-BASE'), false);
  assert.equal(compare(ledger, BASE, []).some((error) => error.code === 'LEDGER-UNTRUE-NOT-IN-BASE'), true);
  assert.deepEqual(compare(ledger, { ...BASE, coverage: {} }, check().valid), []);
  assert.deepEqual(compare({ ...ledger, coverage: { [FILE]: { ...GAP, lines: 10 } } }, BASE, [LINE]).map((e) => e.code), ['LEDGER-LARGER-THAN-BASE']);
  const metrics = { ...ledger, coverage: { [FILE]: { ...GAP, branches: 2, functions: 2 } } };
  assert.deepEqual(compare(metrics, BASE, [{ ...LINE, branches: 2, functions: 2 }]), []);
  assert.deepEqual(compare(metrics, BASE, [LINE]).map((e) => e.code), ['LEDGER-MORE-THAN-BASE', 'LEDGER-MORE-THAN-BASE']);
});

test('[gap-ledger-105] The gate stops for each false reached condition and names the file', () => {
  const cases = [
    { isMergedCommit: () => false },
    { reachedValid: () => rule({ sameAsBase: () => false }) },
    { reachedValid: () => rule({ reached: new Set() }) },
    { reachedValid: () => rule({ codeFiles: new Set() }) },
    { reachedValid: () => rule({ current: { ...CURRENT, coverage: new Map([[FILE, { ...GAP, untrue: false }]]) } }) },
    { reachedValid: () => rule({ baseLedger: { coverage: { [FILE]: GAP } } }) },
    { adopts: [{ ...LINE, untrue: false }] },
    { adopts: [{ ...LINE, untraced: 1 }] },
    { reachedValid: undefined },
  ];
  for (const options of cases) {
    const result = check(options);
    assert.deepEqual(result.valid, []);
    assert.equal(adoptedCounts(result.valid).has('src/leaf.js'), false);
    assert.equal(compare({ ...BASE, coverage: { [FILE]: GAP } }, BASE, result.valid).some((error) => error.code === 'LEDGER-LARGER-THAN-BASE'), true);
    assert.deepEqual(result.errors.map((e) => [e.code, e.file]), [['LEDGER-ADOPT-REACHED', 'src/leaf.js']]);
    assert.match(result.errors[0].message, /src\/leaf\.js/);
  }
});

const descendants = (head, base) => importReach({ files: [...head.keys()], readFile: (file) => head.get(file), baseFiles: [...base.keys()], readBaseFile: (file) => base.get(file) });

test('[gap-ledger-107] The command and gate reject a path with only base edges', () => {
  const base = new Map([['src/root.js', "import './mid.js';"], ['src/mid.js', "import './leaf.js';"], [FILE, 'export const value = 1;']]);
  const head = new Map(base);
  head.set('src/root.js', "import './mid.js'; export const value = 2;");
  const reached = descendants(head, base)(new Set(['src/root.js']));
  assert.deepEqual([...reached], []);
  const result = record(() => rule({ reached }));
  assert.deepEqual(result.history, []);
  assert.equal(result.ledger.coverage[FILE].lines, 1);
  const checked = check({ reachedValid: () => rule({ reached }) });
  assert.deepEqual(checked.valid, []);
  assert.deepEqual(checked.errors.map((error) => error.code), ['LEDGER-ADOPT-REACHED']);
});

test('[gap-ledger-108] The command and gate allow a new edge between base edges', () => {
  const base = new Map([['src/root.js', "import './mid.js';"], ['src/mid.js', 'export const value = 1;'], ['src/next.js', "import './leaf.js';"], [FILE, 'export const value = 1;']]);
  const head = new Map(base);
  head.set('src/mid.js', "import './next.js';");
  const reached = descendants(head, base)(new Set(['src/root.js']));
  assert.deepEqual([...reached].sort(), ['src/leaf.js', 'src/next.js']);
  assert.equal(record(() => rule({ reached })).history[0].reached, true);
  assert.deepEqual(check({ reachedValid: () => rule({ reached }) }).errors, []);
});

test('[gap-ledger-108] The search visits both states of a file in a cycle', () => {
  const base = new Map([['src/root.js', "import './mid.js';"], ['src/mid.js', "import './leaf.js';"], [FILE, 'export const value = 1;']]);
  const head = new Map(base);
  head.set(FILE, "import './root.js';");
  assert.deepEqual([...descendants(head, base)(new Set(['src/root.js']))].sort(), ['src/leaf.js', 'src/mid.js', 'src/root.js']);
});

test('[gap-ledger-108] The base graph resolves imports only to base files', () => {
  const base = new Map([['src/root.js', "import './new.js';"]]);
  const head = new Map([...base, ['src/new.js', "import './leaf.js';"], [FILE, 'export const value = 1;']]);
  assert.deepEqual([...descendants(head, base)(new Set(['src/root.js']))].sort(), ['src/leaf.js', 'src/new.js']);
});
