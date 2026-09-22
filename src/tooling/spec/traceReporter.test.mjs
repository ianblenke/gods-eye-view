import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import traceReporter, { findOwnDestination, parseTags, TraceCollector } from '../../../scripts/spec/lib/trace-reporter.mjs';

const REPORTER = fileURLToPath(new URL('../../../scripts/spec/lib/trace-reporter.mjs', import.meta.url));

/** A child `node --test` inside a test run needs no parent test context. */
function withoutTestContext() {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  return env;
}

function event(name, nesting, extra = {}, type = 'test:pass') {
  return { type, data: { name, nesting, file: '/repo/src/a.test.mjs', details: { type: 'test' }, ...extra } };
}

async function collect(events) {
  async function* source() {
    yield* events;
  }
  const lines = [];
  for await (const chunk of traceReporter(source(), { cwd: '/repo' })) lines.push(chunk);
  return lines.join('').trim().split('\n').filter(Boolean).map(JSON.parse);
}

test('[spec-trace-007] reads the tags from a test name', () => {
  assert.deepEqual(parseTags('[flights-004 radio-002] shows the label'), {
    tags: ['flights-004', 'radio-002'],
    title: 'shows the label',
    error: null,
  });
  assert.deepEqual(parseTags('shows the label'), { tags: [], title: 'shows the label', error: null });
});

test('[spec-trace-020] marks a tag with a bad format', () => {
  for (const name of ['[not a tag] x', '[flights-04] x', '[flights-004,radio-002] x', '[flights-004  radio-002] x', '[Flights-004] x', '[ flights-004] x', '[flights-004 x', '[] x']) {
    assert.equal(parseTags(name).error, 'bad', name);
    assert.deepEqual(parseTags(name).tags, [], name);
  }
});

test('[spec-trace-021] marks a tag with more than three IDs', () => {
  const parsed = parseTags('[a-001 a-002 a-003 a-004] x');
  assert.equal(parsed.error, 'too-many');
  assert.equal(parsed.tags.length, 4);
  assert.equal(parseTags('[a-001 a-002 a-003] x').error, null);
});

test('[spec-trace-007] writes one entry for each test with its tags, its status, its leaf flag and its full name', async () => {
  const records = await collect([
    event('[flights-004 radio-002] shows the label', 0),
    event('breaks', 0, {}, 'test:fail'),
    event('skipped', 0, { skip: true }),
    event('later', 0, { todo: 'not yet' }),
    { type: 'test:diagnostic', data: { message: 'tests 4' } },
  ]);
  assert.deepEqual(records, [
    { file: 'src/a.test.mjs', name: '[flights-004 radio-002] shows the label', title: 'shows the label', kind: 'test', status: 'pass', tags: ['flights-004', 'radio-002'], tagError: null, line: null, column: null, fullName: '[flights-004 radio-002] shows the label', leaf: true },
    { file: 'src/a.test.mjs', name: 'breaks', title: 'breaks', kind: 'test', status: 'fail', tags: [], tagError: null, line: null, column: null, fullName: 'breaks', leaf: true },
    { file: 'src/a.test.mjs', name: 'skipped', title: 'skipped', kind: 'test', status: 'skip', tags: [], tagError: null, line: null, column: null, fullName: 'skipped', leaf: true },
    { file: 'src/a.test.mjs', name: 'later', title: 'later', kind: 'test', status: 'todo', tags: [], tagError: null, line: null, column: null, fullName: 'later', leaf: true },
  ]);
});

test('[spec-trace-008] does not give the parent tags to subtests', async () => {
  const records = await collect([
    event('grandchild', 2),
    event('[radio-002] child', 1),
    event('other child', 1),
    event('[flights-004] parent', 0),
    event('inside suite', 1),
    event('[flights-005] suite', 0, { details: { type: 'suite' } }),
  ]);
  assert.deepEqual(
    records.map((record) => [record.fullName, record.kind, record.leaf, record.tags]),
    [
      ['[flights-004] parent > [radio-002] child > grandchild', 'test', true, []],
      ['[flights-004] parent > [radio-002] child', 'test', false, ['radio-002']],
      ['[flights-004] parent > other child', 'test', true, []],
      ['[flights-004] parent', 'test', false, ['flights-004']],
      ['[flights-005] suite > inside suite', 'test', true, []],
      ['[flights-005] suite', 'suite', false, ['flights-005']],
    ],
  );
});

test('[spec-trace-008] keeps the subtests of each file separate', () => {
  const collector = new TraceCollector({ cwd: '/repo' });
  assert.deepEqual(collector.add(event('child in a', 1).data, 'pass'), []);
  const [parentInB] = collector.add({ ...event('parent in b', 0).data, file: '/repo/src/b.test.mjs' }, 'pass');
  assert.deepEqual([parentInB.file, parentInB.leaf], ['src/b.test.mjs', true]);
  const [noFile] = collector.add({ name: 'load failure', details: { type: 'test' } }, 'fail');
  assert.deepEqual([noFile.file, noFile.status], ['', 'fail']);
  const parentInA = collector.add({ ...event('parent in a', 0).data, details: undefined }, 'pass');
  assert.deepEqual(parentInA.map((record) => [record.fullName, record.kind]), [
    ['parent in a > child in a', 'test'],
    ['parent in a', 'test'],
  ]);
});

test('[coverage-gate-051] pairs each --test-reporter with the --test-reporter-destination that follows it', () => {
  const argv = [
    '/usr/bin/node',
    '--test',
    '--test-reporter=dot',
    '--test-reporter-destination=stdout',
    '--test-reporter=lcov',
    '--test-reporter-destination=/out/lcov.info',
    `--test-reporter=${REPORTER}`,
    '--test-reporter-destination=/out/tests-main.jsonl',
    'src/a.test.mjs',
  ];
  assert.equal(findOwnDestination(argv, REPORTER), '/out/tests-main.jsonl');
  assert.equal(findOwnDestination(argv, '/other/reporter.mjs'), null);
  assert.equal(findOwnDestination(['--test-reporter=dot'], REPORTER), null);
});

test('[coverage-gate-052] registers its destination only with a real AbortSignal at options.signal, even when process.execArgv names the module\'s destination', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'gev-trace-direct-'));
  const originalExecArgv = process.execArgv;
  try {
    const destination = path.join(directory, 'tests-main.jsonl');
    process.execArgv = [...originalExecArgv, `--test-reporter=${REPORTER}`, `--test-reporter-destination=${destination}`];

    await collect([event('[flights-004] shows the label', 0)]);
    assert.equal(existsSync(`${destination}.sync`), false, 'a call with no signal, like this file\'s own fake calls, must not self-register a destination');

    const lines = [];
    for await (const chunk of traceReporter(
      (async function* () {
        yield event('[flights-004] shows the label', 0);
      })(),
      { signal: new AbortController().signal },
    )) {
      lines.push(chunk);
    }
    assert.equal(existsSync(`${destination}.sync`), true, 'a call with a real AbortSignal, matching Node\'s own CLI shape, must self-register and write its destination');
    assert.equal(readFileSync(`${destination}.sync`, 'utf8'), lines.join(''));
  } finally {
    process.execArgv = originalExecArgv;
    rmSync(directory, { recursive: true, force: true });
  }
});

test('[spec-trace-044] writes the line and the column of the definition of each test', async () => {
  const records = await collect([event('[flights-004] shows the label', 0, { line: 12, column: 3 }), event('no line', 0, { line: 'x', column: 'y' })]);
  assert.deepEqual(records.map((record) => [record.name, record.line, record.column]), [
    ['[flights-004] shows the label', 12, 3],
    ['no line', null, null],
  ]);
});

test('[spec-trace-008 spec-trace-044] records the subtests and their lines from a real node:test run', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'gev-trace-'));
  try {
    const testFile = path.join(directory, 'fixture.test.mjs');
    const output = path.join(directory, 'tests.jsonl');
    writeFileSync(
      testFile,
      [
        "import test from 'node:test';",
        "test('[flights-004] parent', async (t) => {",
        "  await t.test('child', () => {});",
        '});',
        "test('untagged', () => {});",
      ].join('\n'),
    );
    const result = spawnSync(process.execPath, ['--test', `--test-reporter=${REPORTER}`, `--test-reporter-destination=${output}`, testFile], {
      cwd: directory,
      encoding: 'utf8',
      env: withoutTestContext(),
    });
    assert.equal(result.status, 0, result.stderr);
    const raw = readFileSync(output, 'utf8');
    const sync = readFileSync(`${output}.sync`, 'utf8');
    assert.equal(sync, raw, 'the reporter\'s own synchronous write must match what Node\'s destination stream wrote');
    const records = raw.trim().split('\n').map(JSON.parse);
    assert.deepEqual(
      records.map((record) => [record.file, record.fullName, record.leaf, record.tags, record.line, record.column]),
      [
        ['fixture.test.mjs', '[flights-004] parent > child', true, [], 3, 11],
        ['fixture.test.mjs', '[flights-004] parent', false, ['flights-004'], 2, 1],
        ['fixture.test.mjs', 'untagged', true, [], 5, 1],
      ],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
