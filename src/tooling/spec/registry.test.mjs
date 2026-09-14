import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  buildLinks,
  checkLinks,
  checkRegistry,
  compareRegistryWithBase,
  idsOfChangedTests,
  withoutLineEndSpaces,
  readLinks,
  testCallEnd,
  readRegistry,
  updateRegistry,
  writeLinks,
  writeRegistry,
} from '../../../scripts/spec/lib/registry.mjs';

const DATE = '2026-09-13';

function scenarios(entries) {
  return new Map(
    entries.map(([id, hash]) => [id, { id, hash, file: 'openspec/specs/demo/spec.md', line: 7 }]),
  );
}

function withRoot(body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-registry-'));
  try {
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const codes = (errors) => errors.map((error) => error.code);

test('[spec-trace-031] stops for an ID that is not in the registry', () => {
  const errors = checkRegistry({ registry: {}, scenarios: scenarios([['demo-001', 'aaa']]), retired: new Set() });
  assert.deepEqual(errors, [
    {
      code: 'TRACE-ID-UNREGISTERED',
      file: 'openspec/specs/demo/spec.md',
      line: 7,
      message: 'Scenario ID demo-001 is not in openspec/trace/ids.json. Run the ratchet command.',
    },
  ]);
});

test('[spec-trace-035] stops for scenario text with a hash that is not equal to the registry hash', () => {
  const errors = checkRegistry({
    registry: { 'demo-001': { hash: 'old', since: DATE, change: 'a' } },
    scenarios: scenarios([['demo-001', 'new']]),
    retired: new Set(),
  });
  assert.deepEqual(codes(errors), ['TRACE-ID-CHANGED']);
  assert.deepEqual(
    checkRegistry({ registry: { 'demo-001': { hash: 'new' } }, scenarios: scenarios([['demo-001', 'new']]), retired: new Set() }),
    [],
  );
});

test('[spec-trace-032] stops the ratchet command for changed text without a changed test that names the ID', () => {
  const registry = { 'demo-001': { hash: 'old', since: '2026-01-01', change: 'a' }, 'demo-002': { hash: 'same', since: '2026-01-01', change: 'a' } };
  const refused = updateRegistry({
    registry,
    scenarios: scenarios([['demo-001', 'new'], ['demo-002', 'same'], ['demo-003', 'added']]),
    retired: new Set(),
    changedTestIds: new Set(['demo-003']),
    change: 'b',
    date: DATE,
  });
  assert.deepEqual(codes(refused.errors), ['TRACE-ID-CHANGED-NO-TEST']);
  assert.equal(refused.registry['demo-001'].hash, 'old');
  assert.deepEqual(refused.registry['demo-003'], { hash: 'added', since: DATE, change: 'b' });

  const accepted = updateRegistry({
    registry,
    scenarios: scenarios([['demo-001', 'new'], ['demo-002', 'same']]),
    retired: new Set(),
    changedTestIds: new Set(['demo-001']),
    change: 'b',
    date: DATE,
  });
  assert.deepEqual(accepted.errors, []);
  assert.deepEqual(accepted.registry['demo-001'], { hash: 'new', since: '2026-01-01', change: 'a' });
  assert.equal(accepted.registry['demo-002'], registry['demo-002']);
});

test('[spec-trace-033] stops for an ID without a scenario that is not retired', () => {
  const registry = { 'demo-001': { hash: 'a' }, 'demo-002': { hash: 'b' } };
  const errors = checkRegistry({ registry, scenarios: new Map(), retired: new Set(['demo-002']) });
  assert.deepEqual(errors, [
    { code: 'TRACE-ID-DROPPED', file: 'openspec/trace/ids.json', message: 'Scenario ID demo-001 has no scenario and is not retired' },
  ]);
  const update = updateRegistry({ registry, scenarios: new Map(), retired: new Set(['demo-002']), changedTestIds: new Set(), change: 'c', date: DATE });
  assert.deepEqual(codes(update.errors), ['TRACE-ID-DROPPED']);
  assert.deepEqual(Object.keys(update.registry), ['demo-001']);
});

const TESTS_BASE = [
  "import test from 'node:test';",
  "test('[demo-001] adds', () => {",
  '  assert.equal(1 + 1, 2);',
  '});',
  "test('[demo-002] subtracts', () => {",
  '  assert.equal(2 - 1, 1);',
  '});',
  '',
].join('\n');

function tagRecords(file, entries) {
  return entries.map(([name, tags, line]) => ({ file, name, fullName: name, tags, line }));
}

test('[spec-trace-042] does not use a test as changed when only another test in its file changed', () => {
  const current = TESTS_BASE.replace('2 - 1, 1', '3 - 1, 2');
  const records = [
    ...tagRecords('src/a.test.mjs', [['[demo-001] adds', ['demo-001'], 2], ['[demo-002] subtracts', ['demo-002'], 5], ['no line', ['demo-009'], undefined]]),
    ...tagRecords('src/other.test.mjs', [['[demo-003] other', ['demo-003'], 1]]),
  ];
  const ids = idsOfChangedTests({ records, files: ['src/a.test.mjs'], readFile: () => current, readBaseTests: () => [TESTS_BASE] });
  assert.deepEqual([...ids], ['demo-002']);
  const moved = tagRecords('src/a.test.mjs', [['[demo-001] adds', ['demo-001'], 3], ['[demo-002] subtracts', ['demo-002'], 6]]);
  const commentOnly = idsOfChangedTests({ records: moved, files: ['src/a.test.mjs'], readFile: () => `// note\n${TESTS_BASE}`, readBaseTests: () => [TESTS_BASE] });
  assert.deepEqual([...commentOnly], []);
});

test('[spec-trace-042] uses a test as changed when a line inside the test changed', () => {
  const records = tagRecords('src/a.test.mjs', [['[demo-001] adds', ['demo-001'], 2], ['untagged', [], 5]]);
  const current = TESTS_BASE.replace('1 + 1, 2', '1 + 2, 3');
  assert.deepEqual([...idsOfChangedTests({ records, files: ['src/a.test.mjs'], readFile: () => current, readBaseTests: () => [TESTS_BASE] })], ['demo-001']);
  const last = tagRecords('src/a.test.mjs', [['[demo-002] subtracts', ['demo-002'], 5]]);
  const closing = TESTS_BASE.replace("  assert.equal(2 - 1, 1);\n});", "  assert.equal(2 - 1, 1);\n}, { timeout: 5 });");
  assert.deepEqual([...idsOfChangedTests({ records: last, files: ['src/a.test.mjs'], readFile: () => closing, readBaseTests: () => [TESTS_BASE] })], ['demo-002']);
});

test('[spec-trace-042] does not use a test as changed for a comment after the line that closes the test call', () => {
  const last = tagRecords('src/a.test.mjs', [['[demo-002] subtracts', ['demo-002'], 5]]);
  const tail = `${TESTS_BASE}// end\nfunction helper() {}\n`;
  assert.deepEqual([...idsOfChangedTests({ records: last, files: ['src/a.test.mjs'], readFile: () => tail, readBaseTests: () => [TESTS_BASE] })], []);
});

test('[spec-trace-042] finds the line that closes a test call after strings, comments and regular expressions', () => {
  const source = [
    "test('[demo-001] a ) in the name', () => {",
    '  const text = "(" + `)${1}` + \'\\\')\';',
    '  /* ) in a block',
    '     comment ) */ assert.match(text, /\\)/);',
    '  // ) in a line comment',
    '  const half = 4 / 2; assert.equal(half, 2);',
    "  const open = 'no end on this line",
    '});',
    'test(\'next\', () => {});',
  ];
  assert.equal(testCallEnd(source, 1, 1), 8);
  assert.equal(testCallEnd(['  await t.test("child", () => {', '  });'], 1, 11), 2);
  assert.equal(testCallEnd(['describe(() => `a', ')` );'], 1, 1), 2);
});

test('[spec-trace-046] uses the next test when the gate cannot find the line that closes a test call', () => {
  assert.equal(testCallEnd(['test("broken", () => {', '  assert.ok(true);'], 1, 1), null);
  const source = ["test('[demo-001] broken', () => {", '  assert.ok(true);', "test('[demo-002] next', () => {", '  assert.ok(true);', '});', ''].join('\n');
  const base = source.replace("test('[demo-002] next', () => {\n  assert.ok(true);\n});", "test('[demo-002] next', () => {\n  assert.ok(false);\n});");
  const records = tagRecords('src/a.test.mjs', [['[demo-001] broken', ['demo-001'], 1], ['[demo-002] next', ['demo-002'], 3]]);
  assert.deepEqual([...idsOfChangedTests({ records, files: ['src/a.test.mjs'], readFile: () => source, readBaseTests: () => [base] })], ['demo-002']);
  const alone = tagRecords('src/b.test.mjs', [['[demo-003] alone', ['demo-003'], 1]]);
  const open = ["test('[demo-003] alone', () => {", '  assert.ok(true);', ''].join('\n');
  assert.deepEqual([...idsOfChangedTests({ records: alone, files: ['src/b.test.mjs'], readFile: () => `${open}// more\n`, readBaseTests: () => [open] })], ['demo-003']);
});

test('[spec-trace-045] does not use a moved test as changed', () => {
  const moved = ["import test from 'node:test';", "test('[demo-001] adds', () => {", '  assert.equal(1 + 1, 2);', '});', ''].join('\n');
  const records = tagRecords('src/b.test.mjs', [['[demo-001] adds', ['demo-001'], 2]]);
  let reads = 0;
  const readBaseTests = () => {
    reads += 1;
    return ['other text', TESTS_BASE];
  };
  assert.deepEqual([...idsOfChangedTests({ records, files: ['src/b.test.mjs'], readFile: () => moved, readBaseTests })], []);
  assert.equal(reads, 1);
  const spaces = moved.replace('assert.equal(1 + 1, 2);', 'assert.equal(1 + 1, 2);   ');
  assert.deepEqual([...idsOfChangedTests({ records, files: ['src/b.test.mjs'], readFile: () => spaces, readBaseTests: () => [TESTS_BASE] })], []);
  assert.deepEqual([...idsOfChangedTests({ records: [], files: ['src/b.test.mjs'], readFile: () => moved, readBaseTests: () => assert.fail('no read without a tagged test') })], []);
  assert.equal(withoutLineEndSpaces('a  \nb\t\nc'), 'a\nb\nc');
});

test('[spec-trace-043] uses a test with new text as a changed test', () => {
  const records = tagRecords('src/new.test.mjs', [['[demo-001] adds', ['demo-001'], 2], ['[demo-002 demo-004] subtracts', ['demo-002', 'demo-004'], 5], ['untagged', [], 8]]);
  const ids = idsOfChangedTests({ records, files: ['src/new.test.mjs'], readFile: () => TESTS_BASE, readBaseTests: () => [] });
  assert.deepEqual([...ids], ['demo-001', 'demo-002', 'demo-004']);
});

test('[spec-trace-036] stops for a base ID that the registry does not contain', () => {
  const baseRegistry = { 'demo-001': { hash: 'a' }, 'demo-002': { hash: 'b' } };
  const errors = compareRegistryWithBase({ registry: {}, baseRegistry, retired: new Set(['demo-002']), changedTestIds: new Set() });
  assert.deepEqual(errors, [{ code: 'TRACE-ID-BASE-DROPPED', file: 'openspec/trace/ids.json', message: 'The base registry has demo-001, but the registry does not have it and it is not retired' }]);
  assert.deepEqual(compareRegistryWithBase({ registry: {}, baseRegistry: null, retired: new Set(), changedTestIds: new Set() }), []);
});

test('[spec-trace-037] stops for a changed registry hash when no test changed', () => {
  const baseRegistry = { 'demo-001': { hash: 'a' }, 'demo-002': { hash: 'b' }, 'demo-003': { hash: 'c' } };
  const registry = { 'demo-001': { hash: 'edited' }, 'demo-002': { hash: 'edited' }, 'demo-003': { hash: 'c' } };
  const errors = compareRegistryWithBase({ registry, baseRegistry, retired: new Set(), changedTestIds: new Set(['demo-002']) });
  assert.deepEqual(errors, [{ code: 'TRACE-ID-BASE-CHANGED', file: 'openspec/trace/ids.json', message: 'The hash of demo-001 is not the base hash, but no changed test with a tag names the ID' }]);
});

test('[spec-trace-029] stops for a links file that is not current', () => {
  const current = { 'demo-001': ['src/a.test.mjs › [demo-001] adds'], 'demo-002': [] };
  assert.deepEqual(checkLinks({ links: current, current }), []);
  const errors = checkLinks({ links: { 'demo-001': [], 'demo-009': [] }, current });
  assert.deepEqual(errors, [
    {
      code: 'TRACE-LINKS-STALE',
      file: 'openspec/trace/links.json',
      message: '3 scenario links are not current (first: demo-001). Run the ratchet command.',
    },
  ]);
});

test('[spec-trace-030 spec-trace-041] writes the links and the registry with sorted keys', () => {
  withRoot((root) => {
    assert.deepEqual(readLinks(root), {});
    assert.deepEqual(readRegistry(root), {});
    const links = buildLinks({
      scenarios: [
        { id: 'demo-002', tests: [] },
        { id: 'demo-001', tests: ['src/a.test.mjs › [demo-001] adds'] },
      ],
    });
    writeLinks(root, links);
    writeRegistry(root, { 'demo-002': { hash: 'b' }, 'demo-001': { hash: 'a' } });
    assert.equal(
      readFileSync(path.join(root, 'openspec/trace/links.json'), 'utf8'),
      '{\n  "demo-001": [\n    "src/a.test.mjs › [demo-001] adds"\n  ],\n  "demo-002": []\n}\n',
    );
    assert.equal(readFileSync(path.join(root, 'openspec/trace/ids.json'), 'utf8'), '{\n  "demo-001": {\n    "hash": "a"\n  },\n  "demo-002": {\n    "hash": "b"\n  }\n}\n');
    assert.deepEqual(Object.keys(readRegistry(root)), ['demo-001', 'demo-002']);
    assert.deepEqual(readLinks(root), links);
  });
});
