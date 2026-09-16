import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { lintSpecs, tasksReader } from '../../../scripts/spec/lib/spec-lint.mjs';
import { parseSpecFile } from '../../../scripts/spec/lib/specs.mjs';

function requirementsOf(lines) {
  return parseSpecFile(lines.join('\n'), { file: 'openspec/specs/demo/spec.md', capability: 'demo', source: 'main' }).requirements;
}

const REQUIREMENT = ['### Requirement: Add', 'The demo MUST add numbers.', 'Origin: spec-first'];
const lint = (lines, changeIds = new Map(), readTasks = () => null) =>
  lintSpecs({ requirements: requirementsOf(lines), changeIds, readTasks });
const codes = (errors) => errors.map((error) => [error.code, error.line]);

test('[spec-lint-001] stops for a scenario without a WHEN line', () => {
  const errors = lint([...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **THEN** the result is 3']);
  assert.deepEqual(codes(errors), [['SPEC-LINT-NO-WHEN', 4]]);
  assert.equal(errors[0].message, 'Scenario "Add" has no WHEN line');
});

test('[spec-lint-002] stops for a scenario with two WHEN lines', () => {
  const errors = lint([...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **WHEN** b', '- **THEN** c']);
  assert.deepEqual(codes(errors), [['SPEC-LINT-TWO-WHEN', 4]]);
});

test('[spec-lint-003] stops for a scenario without a THEN line', () => {
  const errors = lint([...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **AND** b']);
  assert.deepEqual(codes(errors), [['SPEC-LINT-NO-THEN', 4]]);
});

test('[spec-lint-009] stops for a scenario outside a requirement', () => {
  const { requirements, orphans } = parseSpecFile(['## ADDED Requirements', '#### Scenario: Loose `demo-002`', '- **WHEN** a', '- **THEN** b', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b'].join('\n'), { file: 'openspec/specs/demo/spec.md', capability: 'demo', source: 'main' });
  const errors = lintSpecs({ requirements, orphans, changeIds: new Map(), readTasks: () => null });
  assert.deepEqual(errors, [{ code: 'SPEC-LINT-NO-REQUIREMENT', file: 'openspec/specs/demo/spec.md', line: 2, message: 'Scenario "Loose" is not under a requirement' }]);
});

test('[spec-lint-010] stops for a scenario under a renamed requirement', () => {
  const text = ['## RENAMED Requirements', '### Requirement: Anything', 'no must here', '#### Scenario: Loose `demo-001`', '- **AND** x', '## ADDED Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-002`', '- **WHEN** a', '- **THEN** b'].join('\n');
  const result = parseSpecFile(text, { file: 'openspec/changes/demo/specs/demo/spec.md', capability: 'demo', source: 'change:demo' });
  assert.deepEqual(result.errors, [
    { code: 'SPEC-RENAMED-SCENARIO', file: 'openspec/changes/demo/specs/demo/spec.md', line: 4, message: 'Scenario "Loose `demo-001`" is under a renamed requirement. Put it under an added or modified requirement.' },
  ]);
  assert.deepEqual(result.scenarios.map((scenario) => scenario.id), ['demo-002']);
  assert.deepEqual([result.requirements.length, result.orphans.length], [1, 0]);
});

test('[spec-lint-004] stops for a requirement without MUST in its first line', () => {
  const noMust = lint(['### Requirement: Add', 'The demo adds numbers.', 'It MUST work.', 'Origin: spec-first', '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b']);
  assert.deepEqual(codes(noMust), [['SPEC-LINT-NO-MUST', 1]]);
  assert.equal(noMust[0].message, 'The first line of requirement "Add" does not contain MUST');
  const empty = lint(['### Requirement: Add', 'Origin: spec-first', '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b']);
  assert.deepEqual(codes(empty), [['SPEC-LINT-NO-MUST', 1]]);
});

test('[spec-lint-005] stops for a requirement without an origin line', () => {
  const errors = lint(['### Requirement: Add', 'The demo MUST add numbers.', '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b']);
  assert.deepEqual(codes(errors), [['SPEC-LINT-NO-ORIGIN', 1]]);
});

test('[spec-lint-011] stops for a requirement without a scenario', () => {
  const errors = lint(['### Requirement: Stream check', 'The radio MUST stop a stream without audio.', 'Origin: spec-first', '### Requirement: Add', ...REQUIREMENT.slice(1), '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b']);
  assert.deepEqual(errors, [{ code: 'SPEC-LINT-NO-SCENARIO', file: 'openspec/specs/demo/spec.md', line: 1, message: 'Requirement "Stream check" has no scenario' }]);
  assert.deepEqual(lint(['## REMOVED Requirements', '### Requirement: Old', '**Reason**: gone']), []);
});

const MAIN = { file: 'openspec/specs/demo/spec.md', capability: 'demo', source: 'main' };

test('[spec-lint-012] stops for a change section in a main spec', () => {
  const text = ['# demo Specification', '## Purpose', 'Add numbers.', '## Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b', '## REMOVED Requirements', '### Requirement: Stream check', 'The radio MUST stop a stream.', '## renamed requirements', '## ADDED Requirements', '## MODIFIED Requirements'].join('\n');
  const result = parseSpecFile(text, MAIN);
  assert.deepEqual(result.errors.map((error) => [error.code, error.line]), [
    ['SPEC-DELTA-HEADER', 11],
    ['SPEC-REQUIREMENT-OUTSIDE', 12],
    ['SPEC-DELTA-HEADER', 14],
    ['SPEC-DELTA-HEADER', 15],
    ['SPEC-DELTA-HEADER', 16],
  ]);
  assert.equal(result.errors[0].message, 'The main spec has the change section "REMOVED Requirements". Use "Requirements".');
  const delta = parseSpecFile(text, { file: 'openspec/changes/add-demo/specs/demo/spec.md', capability: 'demo', source: 'change:add-demo' });
  assert.deepEqual(delta.errors, []);
});

test('[spec-lint-013] stops for a requirement outside the requirements section of a main spec', () => {
  const text = ['## Purpose', '### Requirement: Stream check', 'The radio MUST stop a stream.', 'Origin: spec-first', '#### Scenario: Stop `demo-002`', '- **WHEN** a', '- **THEN** b'].join('\n');
  const result = parseSpecFile(text, MAIN);
  assert.deepEqual(result.errors, [{ code: 'SPEC-REQUIREMENT-OUTSIDE', file: 'openspec/specs/demo/spec.md', line: 2, message: 'Requirement "Stream check" is not in the section "Requirements"' }]);
  assert.deepEqual(parseSpecFile(text.replace('## Purpose', '## requirements'), MAIN).errors, []);
  assert.deepEqual(parseSpecFile(text.replace('## Purpose\n', ''), MAIN).errors, []);
});

test('[spec-lint-014] reads the requirement headings and the scenario headings in upper case and lower case', () => {
  const text = ['## Requirements', ...REQUIREMENT, '#### scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b', '### requirement: Stream check', 'The radio MUST stop a stream.', 'Origin: spec-first'].join('\n');
  const result = parseSpecFile(text, MAIN);
  assert.deepEqual(result.requirements.map((item) => [item.name, item.scenarios.length]), [['Add', 1], ['Stream check', 0]]);
  assert.deepEqual(result.scenarios.map((item) => item.id), ['demo-001']);
  assert.deepEqual(codes(lintSpecs({ requirements: result.requirements, orphans: result.orphans, changeIds: new Map(), readTasks: () => null })), [['SPEC-LINT-NO-SCENARIO', 8]]);
});

test('[spec-lint-015] ends a fenced code block only at its end fence', () => {
  const lines = (open, inner, close) => ['## Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b', open, inner, '### Requirement: Hidden', 'The demo MUST hide.', close, '### Requirement: Stream check', 'The radio MUST stop a stream.', 'Origin: spec-first', '#### Scenario: Stop `demo-002`', '- **WHEN** a', '- **THEN** b', '### Requirement: Silent', 'The radio MUST stay silent.', 'Origin: spec-first'].join('\n');
  for (const [open, inner, close] of [['````', '```', '````'], ['```', '~~~', '```'], ['~~~~', '~~~ text', '~~~~~'], ['```js', '```` more', '```']]) {
    const result = parseSpecFile(lines(open, inner, close), MAIN);
    assert.deepEqual(result.requirements.map((item) => item.name), ['Add', 'Stream check', 'Silent'], open);
    assert.deepEqual(result.scenarios.map((item) => item.id), ['demo-001', 'demo-002'], open);
    assert.deepEqual(codes(lintSpecs({ requirements: result.requirements, orphans: result.orphans, changeIds: new Map(), readTasks: () => null })), [['SPEC-LINT-NO-SCENARIO', 19]], open);
  }
  const inScenario = parseSpecFile(['## Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '```', '#### Scenario: Not real `demo-009`', '```', '- **THEN** b'].join('\n'), MAIN);
  assert.deepEqual(inScenario.scenarios.map((item) => item.id), ['demo-001']);
});

test('[spec-lint-016] stops for a heading that is not a known heading', () => {
  const text = ['# radio Specification', '## Purpose', 'Play radio.', '## Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b', '### Stream check', 'The radio MUST stop a stream.', '#### Scenario - Stop a silent stream `demo-002`', '- **WHEN** a', '- **THEN** b', '### Requirements', '##### Note', '## Notes'].join('\n');
  const result = parseSpecFile(text, MAIN);
  assert.deepEqual(result.errors.map((error) => [error.code, error.line]), [
    ['SPEC-HEADING', 11],
    ['SPEC-HEADING', 13],
    ['SPEC-HEADING', 16],
    ['SPEC-HEADING', 17],
    ['SPEC-HEADING', 18],
  ]);
  assert.deepEqual(result.errors[0], { code: 'SPEC-HEADING', file: 'openspec/specs/demo/spec.md', line: 11, message: 'The heading "### Stream check" is not a title, a section, a requirement or a scenario heading' });
  const delta = ['## ADDED Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b', '## RENAMED Requirements', '- FROM: `### Requirement: Old`'].join('\n');
  assert.deepEqual(parseSpecFile(delta, { ...MAIN, source: 'change:add-demo' }).errors, []);
});

test('[spec-lint-017] reads the lines of a spec file with each line end', () => {
  const lines = ['## Requirements', ...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b', '### Requirement: Stream check', 'The radio MUST stop a stream.', 'Origin: spec-first', '### Requirement: Silent', 'The radio MUST stay silent.', 'Origin: spec-first', '#### Scenario: Stay silent `demo-002`', '- **WHEN** a', '- **THEN** b'];
  for (const end of ['\r', '\r\n', '\n']) {
    const result = parseSpecFile(lines.join(end), MAIN);
    assert.deepEqual(result.scenarios.map((item) => item.id), ['demo-001', 'demo-002'], JSON.stringify(end));
    assert.deepEqual(codes(lintSpecs({ requirements: result.requirements, orphans: result.orphans, changeIds: new Map(), readTasks: () => null })), [['SPEC-LINT-NO-SCENARIO', 8]], JSON.stringify(end));
  }
});

test('[spec-lint-008] does not check removed requirements', () => {
  const errors = lint(['## REMOVED Requirements', '### Requirement: Old', '**Reason**: gone', '#### Scenario: Old `demo-009`']);
  assert.deepEqual(errors, []);
});

test('[spec-lint-006] stops for a scenario that no task names', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-spec-lint-'));
  try {
    mkdirSync(path.join(root, 'openspec/changes/add-demo'), { recursive: true });
    writeFileSync(path.join(root, 'openspec/changes/add-demo/tasks.md'), '- [ ] 1.1 Write the test for `demo-001`.\n');
    const errors = lintSpecs({
      requirements: [],
      changeIds: new Map([
        ['add-demo', ['demo-001', 'demo-002']],
        ['no-tasks', ['demo-003']],
      ]),
      readTasks: tasksReader(root),
    });
    assert.deepEqual(
      errors.map((error) => [error.code, error.file, error.message]),
      [
        ['SPEC-LINT-NO-TASK', 'openspec/changes/add-demo/tasks.md', 'No task names the scenario ID demo-002'],
        ['SPEC-LINT-NO-TASK', 'openspec/changes/no-tasks/tasks.md', 'No task names the scenario ID demo-003'],
      ],
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[spec-lint-007] does not stop for a change with a task for each scenario', () => {
  const errors = lint(
    [...REQUIREMENT, '#### Scenario: Add `demo-001`', '- **WHEN** a', '- **THEN** b'],
    new Map([['add-demo', ['demo-001']]]),
    () => '- [ ] 1.1 Write the test for `demo-001`.',
  );
  assert.deepEqual(errors, []);
});
