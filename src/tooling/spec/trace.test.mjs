import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { assertionKey, evaluateTrace, writeTraceReport } from '../../../scripts/spec/lib/trace.mjs';

function scenario(id, source = 'main') {
  const capability = id.replace(/-\d{3}$/, '');
  return { id, capability, requirement: 'Labels', name: `Scenario ${id}`, origin: 'spec-first', file: `openspec/specs/${capability}/spec.md`, line: 7, source };
}

function specs(list, { retired = [], main } = {}) {
  return {
    scenarios: new Map(list.map((item) => [item.id, item])),
    mainIds: new Set(main || list.filter((item) => item.source === 'main').map((item) => item.id)),
    retired: new Set(retired),
  };
}

function record(name, tags, status = 'pass', extra = {}) {
  return { file: 'src/a.test.mjs', name, fullName: name, title: name, kind: 'test', leaf: true, status, tags, tagError: null, ...extra };
}

/** Give each record one assertion unless the test sets a count. */
function evaluate({ records, counts = {}, ...rest }) {
  const assertions = new Map(records.map((item) => [assertionKey(item.file, item.fullName), counts[item.fullName] ?? 1]));
  return evaluateTrace({ records, assertions, ...rest });
}

const codes = (result) => result.errors.map((error) => error.code);
const FLIGHTS = specs([scenario('flights-004')]);

test('[spec-trace-009] records a leaf test without a tag as untraced and does not stop for it', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('old test', [])] });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.untraced, [{ file: 'src/a.test.mjs', name: 'old test' }]);
});

test('[spec-trace-008] records a subtest without a tag under a parent with a tag as untraced', () => {
  const result = evaluate({
    specs: FLIGHTS,
    records: [record('[flights-004] shows', ['flights-004']), record('parent > child', []), record('parent', [], 'pass', { leaf: false })],
  });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.untraced, [{ file: 'src/a.test.mjs', name: 'parent > child' }]);
});

test('[spec-trace-010] stops for a tag with an unknown ID and shows the file and the test name', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('[flights-099] ghost', ['flights-099'])] });
  assert.deepEqual(result.errors, [
    { code: 'TRACE-UNKNOWN-ID', file: 'src/a.test.mjs', message: 'Test "[flights-099] ghost" names flights-099, but no spec contains this ID' },
  ]);
});

test('[spec-trace-011] stops for a tag with a retired ID', () => {
  const result = evaluate({ specs: specs([scenario('flights-004')], { retired: ['flights-001'] }), records: [record('[flights-004 flights-001] shows', ['flights-004', 'flights-001'])] });
  assert.deepEqual(codes(result), ['TRACE-RETIRED-ID']);
});

test('[spec-trace-012] stops for a main scenario without a test that passes', () => {
  const result = evaluate({ specs: specs([scenario('flights-004'), scenario('flights-005')]), records: [record('[flights-004] shows', ['flights-004'])] });
  assert.deepEqual(result.errors, [
    { code: 'TRACE-UNVERIFIED', file: 'openspec/specs/flights/spec.md', line: 7, message: 'Scenario flights-005 has no passing test with an assertion' },
  ]);
});

test('[spec-trace-012] stops for a main scenario that an active change replaces without a test', () => {
  const result = evaluate({ specs: specs([scenario('flights-004', 'change:bigger-labels')], { main: ['flights-004'] }), records: [] });
  assert.deepEqual(codes(result), ['TRACE-UNVERIFIED']);
  assert.deepEqual(result.pending, []);
});

test('[spec-trace-013] does not count a skipped test', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] skipped', ['flights-004'], 'skip')] });
  assert.deepEqual(codes(result), ['TRACE-SKIPPED-TAG', 'TRACE-UNVERIFIED']);
  assert.deepEqual(result.report.scenarios[0].tests, []);
});

test('[spec-trace-024] does not count a todo test', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] later', ['flights-004'], 'todo')] });
  assert.deepEqual(codes(result), ['TRACE-UNVERIFIED']);
});

test('[spec-trace-025] stops for a skipped test with a tag', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('[flights-004] skipped', ['flights-004'], 'skip')] });
  assert.deepEqual(result.errors, [
    { code: 'TRACE-SKIPPED-TAG', file: 'src/a.test.mjs', message: 'Test "[flights-004] skipped" is skipped and has a tag' },
  ]);
});

test('[spec-trace-014] shows the untested scenarios of an active change as open', () => {
  const result = evaluate({ specs: specs([scenario('radio-001', 'change:add-radio')]), records: [] });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.pending, ['radio-001']);
});

test('[spec-trace-015] stops for an untested scenario of the named change', () => {
  const result = evaluate({ specs: specs([scenario('radio-001', 'change:add-radio'), scenario('cctv-001', 'change:other')]), records: [], change: 'add-radio' });
  assert.deepEqual(codes(result), ['TRACE-UNVERIFIED']);
  assert.deepEqual(result.pending, ['cctv-001']);
});

test('[spec-trace-026] stops for an unknown change name', () => {
  const result = evaluate({ specs: specs([]), records: [], change: 'nope', changeFound: false });
  assert.deepEqual(result.errors, [{ code: 'TRACE-UNKNOWN-CHANGE', file: 'openspec/changes', message: 'No active or archived change has the name nope' }]);
});

test('[spec-trace-016] stops for a failed test', () => {
  const result = evaluate({
    specs: FLIGHTS,
    records: [record('[flights-004] shows', ['flights-004']), record('[flights-004] breaks', ['flights-004'], 'fail'), record('suite', [], 'fail', { kind: 'suite', leaf: false })],
  });
  assert.deepEqual(result.errors, [
    { code: 'TRACE-FAILED-TEST', file: 'src/a.test.mjs', message: 'Test "[flights-004] breaks" failed' },
    { code: 'TRACE-FAILED-TEST', file: 'src/a.test.mjs', message: 'Test "suite" failed' },
  ]);
});

test('[spec-trace-020] stops for a tag with a bad format and does not count the test as untraced', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('[flights-04] typo', [], 'pass', { tagError: 'bad' })] });
  assert.deepEqual(result.errors, [{ code: 'TRACE-BAD-TAG', file: 'src/a.test.mjs', message: 'Test "[flights-04] typo" has a tag with a bad format' }]);
  assert.deepEqual(result.untraced, []);
});

test('[spec-trace-021] stops for a tag with more than three IDs', () => {
  const ids = ['flights-004', 'flights-004', 'flights-004', 'flights-004'];
  const result = evaluate({ specs: FLIGHTS, records: [record(`[${ids.join(' ')}] x`, ids, 'pass', { tagError: 'too-many' })] });
  assert.deepEqual(codes(result), ['TRACE-TOO-MANY-TAGS']);
});

test('[spec-trace-022] stops for a tag on a parent test', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('[flights-004] parent', ['flights-004'], 'pass', { leaf: false })] });
  assert.deepEqual(codes(result), ['TRACE-PARENT-TAG']);
});

test('[spec-trace-034] stops for a tag on a suite', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('[flights-004] suite', ['flights-004'], 'pass', { kind: 'suite', leaf: false })] });
  assert.deepEqual(codes(result), ['TRACE-SUITE-TAG']);
});

test('[spec-trace-023] stops for a test outside a test file', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004']), record('helper test', [], 'pass', { file: 'src/helpers.mjs' })] });
  assert.deepEqual(result.errors, [{ code: 'TRACE-OUTSIDE-TEST-FILE', file: 'src/helpers.mjs', message: 'Test "helper test" is not in a file that ends with .test.mjs' }]);
});

test('[spec-trace-027] stops for a traced test without an assertion', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] asserts nothing', ['flights-004'])], counts: { '[flights-004] asserts nothing': 0 } });
  assert.deepEqual(codes(result), ['TRACE-NO-ASSERTION', 'TRACE-UNVERIFIED']);
  const noCount = evaluateTrace({ specs: FLIGHTS, records: [record('[flights-004] unknown', ['flights-004'])], assertions: new Map() });
  assert.deepEqual(codes(noCount), ['TRACE-NO-ASSERTION', 'TRACE-UNVERIFIED']);
});

test('[spec-trace-028] stops for a test file without tests', () => {
  const result = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004'])], testFiles: ['src/a.test.mjs', 'src/empty.test.mjs'] });
  assert.deepEqual(result.errors, [{ code: 'TRACE-EMPTY-TEST-FILE', file: 'src/empty.test.mjs', message: 'src/empty.test.mjs reports no tests' }]);
});

test('[spec-trace-039] stops for a test entry with tags that do not agree with its name', () => {
  const forged = record('[flights-004] real test', ['flights-005']);
  const result = evaluate({ specs: specs([scenario('flights-004'), scenario('flights-005')]), records: [record('[flights-004] real test', ['flights-004']), forged, record('[flights-005] other', ['flights-005'])] });
  assert.deepEqual(result.errors, [
    { code: 'TRACE-RECORD-NAME', file: 'src/a.test.mjs', message: 'Test "[flights-004] real test" has a result record with tags or a full name that do not agree with its name' },
    { code: 'TRACE-DUPLICATE-NAME', file: 'src/a.test.mjs', message: 'Test "[flights-004] real test" has a tag and the same full name as another test in its file' },
  ]);
  const badError = evaluate({ specs: FLIGHTS, records: [record('[flights-004] shows', ['flights-004'], 'pass', { tagError: 'bad' })] });
  assert.deepEqual(codes(badError), ['TRACE-RECORD-NAME', 'TRACE-BAD-TAG']);
});

test('[spec-trace-039] stops for a test entry with a full name that does not end with its name', () => {
  const records = [
    record('[flights-004] shows', ['flights-004']),
    record('[flights-004] parent > child', [], 'pass', { name: 'child' }),
    record('[flights-004] parent > xchild', [], 'pass', { name: 'child' }),
  ];
  const result = evaluate({ specs: FLIGHTS, records });
  assert.deepEqual(result.errors, [{ code: 'TRACE-RECORD-NAME', file: 'src/a.test.mjs', message: 'Test "[flights-004] parent > xchild" has a result record with tags or a full name that do not agree with its name' }]);
});

test('[spec-trace-040] stops for two traced tests with the same full name in one file', () => {
  const records = [
    record('[flights-004] shows', ['flights-004']),
    record('[flights-004] shows', ['flights-004']),
    record('[flights-004] shows', ['flights-004'], 'pass', { file: 'src/b.test.mjs' }),
    record('old', []),
    record('old', []),
  ];
  const result = evaluate({ specs: FLIGHTS, records });
  assert.deepEqual(result.errors, [{ code: 'TRACE-DUPLICATE-NAME', file: 'src/a.test.mjs', message: 'Test "[flights-004] shows" has a tag and the same full name as another test in its file' }]);
});

test('[spec-trace-017] writes the scenario links, the origins and the untraced tests to the report', () => {
  const result = evaluate({
    specs: specs([scenario('flights-004'), scenario('radio-001', 'change:add-radio')]),
    records: [record('[flights-004] shows', ['flights-004']), record('[flights-004] hides', ['flights-004']), record('old test', []), record('parent', [], 'pass', { leaf: false })],
  });
  assert.deepEqual(result.report, {
    counts: { scenarios: 2, verified: 1, pending: 1, tests: 3, traced: 2, untraced: 1 },
    scenarios: [
      { id: 'flights-004', capability: 'flights', requirement: 'Labels', name: 'Scenario flights-004', origin: 'spec-first', source: 'main', file: 'openspec/specs/flights/spec.md', line: 7, tests: ['src/a.test.mjs › [flights-004] hides', 'src/a.test.mjs › [flights-004] shows'] },
      { id: 'radio-001', capability: 'radio', requirement: 'Labels', name: 'Scenario radio-001', origin: 'spec-first', source: 'change:add-radio', file: 'openspec/specs/radio/spec.md', line: 7, tests: [] },
    ],
    untraced: [{ file: 'src/a.test.mjs', name: 'old test' }],
    pending: ['radio-001'],
  });
  const root = mkdtempSync(path.join(tmpdir(), 'gev-report-'));
  try {
    const file = writeTraceReport(root, result.report);
    assert.equal(file, path.join(root, '.gev-cache', 'spec', 'trace-report.json'));
    assert.deepEqual(JSON.parse(readFileSync(file, 'utf8')), result.report);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
