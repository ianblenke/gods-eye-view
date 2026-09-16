import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  checkArchivedChange,
  readDeltaNames,
  listActiveChanges,
  loadSpecs,
  parseSpecFile,
  scenarioHash,
} from '../../../scripts/spec/lib/specs.mjs';

const SPEC = [
  '## Requirements',
  '',
  '### Requirement: Labels',
  'The globe MUST show a label for each aircraft.',
  'Origin: backfill',
  '',
  '#### Scenario: Show a label `flights-004`',
  '- **WHEN** an aircraft is in view',
  '- **THEN** the globe shows its label',
  '',
].join('\n');

const REQUIREMENT_TEXT = ['The globe MUST show a label for each aircraft.', 'Origin: backfill'];

const WHERE = { file: 'openspec/specs/flights/spec.md', capability: 'flights', source: 'main' };

function withRoot(files, body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-specs-'));
  try {
    for (const [file, text] of Object.entries(files)) {
      const absolute = path.join(root, file);
      mkdirSync(path.dirname(absolute), { recursive: true });
      writeFileSync(absolute, text);
    }
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const codes = (result) => result.errors.map((error) => error.code);

test('[spec-trace-001] reads the ID, the requirement, the scenario, the origin, the file, the line and the hash', () => {
  const result = parseSpecFile(SPEC, WHERE);
  assert.deepEqual(result.errors, []);
  assert.equal(result.scenarios.length, 1);
  const { hash, ...fields } = result.scenarios[0];
  assert.deepEqual(fields, {
    id: 'flights-004',
    capability: 'flights',
    requirement: 'Labels',
    name: 'Show a label',
    origin: 'backfill',
    file: 'openspec/specs/flights/spec.md',
    line: 7,
    source: 'main',
  });
  assert.equal(hash, scenarioHash('Show a label', ['- **WHEN** an aircraft is in view', '- **THEN** the globe shows its label'], { name: 'Labels', text: REQUIREMENT_TEXT }));
  assert.match(hash, /^[0-9a-f]{64}$/);
});

test('[spec-trace-001] records an unknown origin and no requirement when the spec has none', () => {
  const noOrigin = parseSpecFile(SPEC.replace('Origin: backfill\n', ''), WHERE).scenarios[0];
  assert.equal(noOrigin.origin, 'unknown');
  const looseResult = parseSpecFile('#### Scenario: Loose `flights-002`\n- **WHEN** x\n', WHERE);
  const loose = looseResult.scenarios[0];
  assert.equal(loose.requirement, null);
  assert.equal(loose.origin, 'unknown');
  assert.deepEqual(looseResult.orphans, [{ id: 'flights-002', name: 'Loose', file: WHERE.file, line: 1 }]);
});

test('[spec-trace-001] does not read the scenario headings in fenced code and keeps the code lines in the hash', () => {
  const text = [
    '### Requirement: Kept',
    'The globe MUST keep this.',
    '#### Scenario: With code `flights-001`',
    '- **WHEN** x',
    '```',
    '#### Scenario: Example in code',
    '```',
    '### Other heading',
    'Text after the scenario.',
  ].join('\n');
  const result = parseSpecFile(text, WHERE);
  assert.deepEqual(result.errors.map((error) => [error.code, error.line]), [['SPEC-HEADING', 8]]);
  assert.deepEqual(result.scenarios.map((item) => item.id), ['flights-001']);
  assert.equal(
    result.scenarios[0].hash,
    scenarioHash('With code', ['- **WHEN** x', '```', '#### Scenario: Example in code', '```'], { name: 'Kept', text: ['The globe MUST keep this.'] }),
  );
});

test('[spec-trace-001] reads the first line, the origin and the scenario format of each requirement', () => {
  const text = [
    '## ADDED Requirements',
    '### Requirement: Labels',
    '',
    'The globe MUST show labels.',
    'More text.',
    'Origin: spec-first',
    '#### Scenario: One `flights-001`',
    '- **WHEN** a',
    '- **WHEN** b',
    '- **THEN** c',
    '## RENAMED Requirements',
    '### Requirement: Renamed',
    '- FROM: `### Requirement: Old`',
  ].join('\n');
  const { requirements } = parseSpecFile(text, WHERE);
  assert.deepEqual(requirements, [
    {
      name: 'Labels',
      file: WHERE.file,
      line: 2,
      firstLine: 'The globe MUST show labels.',
      origin: 'spec-first',
      scenarios: [{ id: 'flights-001', name: 'One', line: 7, when: 2, then: 1 }],
      removed: false,
      renamed: false,
      hash: scenarioHash('', [], { name: 'Labels', text: ['The globe MUST show labels.', 'More text.', 'Origin: spec-first'] }),
    },
  ]);
});

test('[spec-trace-002] stops for a scenario heading without an ID', () => {
  const result = parseSpecFile(SPEC.replace(' `flights-004`', ''), WHERE);
  assert.deepEqual(result.scenarios, []);
  assert.deepEqual(result.errors, [
    { code: 'SPEC-NO-ID', file: WHERE.file, line: 7, message: 'Scenario "Show a label" has no ID in backticks' },
  ]);
});

test('[spec-trace-003] stops for an ID with the wrong capability', () => {
  const result = parseSpecFile(SPEC.replace('flights-004', 'radio-001'), WHERE);
  assert.deepEqual(result.scenarios, []);
  assert.deepEqual(result.errors.map((error) => [error.code, error.line]), [['SPEC-WRONG-CAPABILITY', 7]]);
});

test('[spec-trace-004] stops for the same ID in two scenarios of the main specs', () => {
  withRoot({ 'openspec/specs/flights/spec.md': `${SPEC}\n${SPEC.split('\n').slice(6).join('\n')}` }, (root) => {
    const result = loadSpecs(root);
    assert.deepEqual(result.errors.map((error) => [error.code, error.line]), [['SPEC-DUPLICATE-ID', 11]]);
    assert.match(result.errors[0].message, /openspec\/specs\/flights\/spec\.md:7/);
  });
});

test('[spec-trace-005] does not stop for the same ID in a change delta and uses the change scenario', () => {
  const changed = SPEC.replace('Show a label', 'Show a large label');
  withRoot(
    {
      'openspec/specs/flights/spec.md': SPEC,
      'openspec/specs/notes/readme.md': 'No spec file in this folder.',
      'openspec/changes/bigger-labels/specs/flights/spec.md': changed,
      'openspec/changes/archive/2026-01-01-old/specs/flights/spec.md': SPEC.replace('flights-004', 'flights-001'),
    },
    (root) => {
      const result = loadSpecs(root);
      assert.deepEqual(result.errors, []);
      assert.deepEqual([...result.scenarios.keys()], ['flights-004']);
      assert.equal(result.scenarios.get('flights-004').name, 'Show a large label');
      assert.equal(result.scenarios.get('flights-004').source, 'change:bigger-labels');
      assert.equal(result.mainIds.has('flights-004'), true);
      assert.deepEqual(result.changeIds.get('bigger-labels'), ['flights-004']);
      assert.deepEqual(listActiveChanges(root), ['bigger-labels']);
    },
  );
});

test('[spec-trace-006] stops for a retired ID in a spec', () => {
  withRoot(
    {
      'openspec/specs/flights/spec.md': SPEC,
      'openspec/trace/retired-ids.json': JSON.stringify(['flights-004']),
    },
    (root) => {
      const result = loadSpecs(root);
      assert.deepEqual(codes(result), ['SPEC-RETIRED-ID']);
      assert.equal(result.retired.has('flights-004'), true);
    },
  );
});

test('[spec-trace-038] reads no retired IDs, specs or changes from an empty project', () => {
  withRoot({}, (root) => {
    const result = loadSpecs(root);
    assert.equal(result.scenarios.size, 0);
    assert.equal(result.retired.size, 0);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.orphans, []);
    assert.deepEqual(listActiveChanges(root), []);
  });
});

test('[spec-trace-018] stops for the same new ID in two active changes', () => {
  withRoot(
    {
      'openspec/changes/a/specs/flights/spec.md': SPEC,
      'openspec/changes/b/specs/flights/spec.md': SPEC,
    },
    (root) => {
      assert.deepEqual(codes(loadSpecs(root)), ['SPEC-DUPLICATE-ID']);
    },
  );
  withRoot({ 'openspec/changes/a/specs/flights/spec.md': `${SPEC}\n${SPEC.split('\n').slice(6).join('\n')}` }, (root) => {
    assert.deepEqual(codes(loadSpecs(root)), ['SPEC-DUPLICATE-ID']);
  });
});

test('[spec-trace-019] stops for a removed scenario that is not retired', () => {
  const removal = [
    '## REMOVED Requirements',
    '### Requirement: Labels',
    '**Reason**: Not needed',
    '#### Scenario: Show a label `flights-004`',
    '#### Scenario: Old example without an ID',
  ].join('\n');
  withRoot({ 'openspec/changes/drop-labels/specs/flights/spec.md': removal }, (root) => {
    const result = loadSpecs(root);
    assert.deepEqual(result.errors.map((error) => [error.code, error.line]), [['SPEC-REMOVED-NOT-RETIRED', 4]]);
    assert.equal(result.scenarios.size, 0);
  });
  withRoot(
    {
      'openspec/changes/drop-labels/specs/flights/spec.md': removal,
      'openspec/trace/retired-ids.json': JSON.stringify(['flights-004']),
    },
    (root) => {
      assert.deepEqual(loadSpecs(root).errors, []);
    },
  );
});

test('[spec-trace-047] changes the hash of each scenario when the name or the text of its requirement changes', () => {
  const hashOf = (text) => parseSpecFile(text, WHERE).scenarios[0].hash;
  const original = hashOf(SPEC);
  assert.notEqual(hashOf(SPEC.replace('Requirement: Labels', 'Requirement: Tags')), original);
  assert.notEqual(hashOf(SPEC.replace('MUST show a label', 'MAY show a label')), original);
  assert.notEqual(hashOf(SPEC.replace('Origin: backfill', 'Origin: spec-first')), original);
  assert.equal(hashOf(SPEC.replace('Origin: backfill\n', 'Origin: backfill\n\n\n')), original);
  const fenced = (formats) => SPEC.replace('Origin: backfill\n', `Origin: backfill\n~~~\n${formats}\n~~~\n`);
  assert.notEqual(hashOf(fenced('mp3\naac\nflac')), hashOf(fenced('mp3\naac')));
  assert.deepEqual(parseSpecFile(fenced('mp3'), WHERE).requirements[0].hash, scenarioHash('', [], { name: 'Labels', text: [...REQUIREMENT_TEXT, '~~~', 'mp3', '~~~'] }));
  assert.notEqual(scenarioHash('Show a label', ['- **WHEN** x']), scenarioHash('Show a label', ['- **WHEN** x'], { name: 'Labels', text: [] }));
  assert.notEqual(hashOf(fenced('if silent:\n  stop()')), hashOf(fenced('if silent:\nstop()')));
  const nested = SPEC.replace('Origin: backfill\n', 'Origin: backfill\n- The globe:\n  - shows the call sign.\n');
  assert.notEqual(hashOf(nested), hashOf(nested.replace('  - shows', '- shows')));
  assert.equal(hashOf(nested), hashOf(nested.replace('call sign.\n', 'call sign.   \n')));
  assert.notEqual(hashOf(SPEC.replace('- **THEN** the globe', '  - **THEN** the globe')), original);
  const moved = SPEC.replace('Origin: backfill\n\n#### Scenario: Show a label', 'Origin: backfill\n\n#### Scenario: The globe MUST NOT hide labels.').replace('`flights-004`\n', '`flights-004`\nShow a label\n');
  const before = SPEC.replace('Origin: backfill\n', 'Origin: backfill\nThe globe MUST NOT hide labels.\n');
  assert.equal(parseSpecFile(moved, WHERE).scenarios[0].name, 'The globe MUST NOT hide labels.');
  assert.notEqual(hashOf(moved), hashOf(before));
  assert.notEqual(scenarioHash('a', ['b']), scenarioHash('a\nb', []));
});

const ARCHIVE = 'openspec/changes/archive/2026-09-14-add-labels';
const DELTA = SPEC.replace('## Requirements', '## ADDED Requirements');

function archivedCheck(files) {
  return withRoot(files, (root) => checkArchivedChange(root, ARCHIVE, loadSpecs(root)).errors.map((error) => [error.code, error.file, error.line, error.message]));
}

test('[spec-trace-048] stops for an archived added or modified scenario that is not in the main specs with the same hash', () => {
  const proposal = { [`${ARCHIVE}/proposal.md`]: '## Why\n' };
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': SPEC, [`${ARCHIVE}/specs/flights/spec.md`]: DELTA }), []);
  assert.deepEqual(archivedCheck({ ...proposal, [`${ARCHIVE}/specs/flights/spec.md`]: DELTA }).slice(1), [
    ['SPEC-DELTA-NOT-APPLIED', `${ARCHIVE}/specs/flights/spec.md`, 7, 'Scenario flights-004 of the archived change is not in openspec/specs'],
  ]);
  const modified = DELTA.replace('ADDED', 'MODIFIED').replace('shows its label', 'shows its call sign');
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': SPEC, [`${ARCHIVE}/specs/flights/spec.md`]: modified }), [
    ['SPEC-DELTA-NOT-APPLIED', `${ARCHIVE}/specs/flights/spec.md`, 7, 'Scenario flights-004 in openspec/specs is not equal to the scenario in the archived change'],
  ]);
  const moved = SPEC.replace('## Requirements', '## Requirements\n\n### Requirement: Other\nThe globe MUST do other things.\nOrigin: backfill\n\n#### Scenario: Other `flights-009`\n- **WHEN** x\n- **THEN** y\n');
  const active = { 'openspec/changes/other/specs/flights/spec.md': DELTA.replace('flights-004', 'flights-005') };
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': SPEC, ...active, [`${ARCHIVE}/specs/flights/spec.md`]: DELTA.replace('flights-004', 'flights-005') }).map((item) => item[0]), ['SPEC-DELTA-NOT-APPLIED', 'SPEC-DELTA-NOT-APPLIED']);
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': moved, [`${ARCHIVE}/specs/flights/spec.md`]: DELTA }), []);
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': SPEC.replace(' `flights-004`', ''), [`${ARCHIVE}/specs/flights/spec.md`]: DELTA.replace(' `flights-004`', '') }).map((item) => item[0]), ['SPEC-NO-ID']);
  assert.deepEqual(archivedCheck(proposal), []);
});

test('[spec-trace-049] stops for an archived removed scenario that is still in the main specs or is not retired', () => {
  const removal = ['## REMOVED Requirements', '### Requirement: Labels', '**Reason**: Not needed', '#### Scenario: Show a label `flights-004`', ''].join('\n');
  const files = { [`${ARCHIVE}/proposal.md`]: '## Why\n', [`${ARCHIVE}/specs/flights/spec.md`]: removal };
  assert.deepEqual(archivedCheck({ ...files, 'openspec/specs/flights/spec.md': SPEC }), [
    ['SPEC-DELTA-NOT-APPLIED', `${ARCHIVE}/specs/flights/spec.md`, 4, 'The archived change removes scenario flights-004, but openspec/specs still has it'],
    ['SPEC-DELTA-NOT-APPLIED', `${ARCHIVE}/specs/flights/spec.md`, undefined, 'The archived change removes requirement "Labels", but openspec/specs/flights/spec.md still has it'],
  ]);
  assert.deepEqual(archivedCheck(files), [
    ['SPEC-REMOVED-NOT-RETIRED', `${ARCHIVE}/specs/flights/spec.md`, 4, 'Add the removed scenario ID flights-004 to openspec/trace/retired-ids.json'],
  ]);
  assert.deepEqual(archivedCheck({ ...files, 'openspec/trace/retired-ids.json': '["flights-004"]' }), []);
});

test('[spec-trace-050] stops for an archived change without a proposal', () => {
  assert.deepEqual(archivedCheck({ [`${ARCHIVE}/specs/flights/spec.md`]: DELTA, 'openspec/specs/flights/spec.md': SPEC }), [
    ['SPEC-ARCHIVE-NO-PROPOSAL', ARCHIVE, undefined, `The archived change ${ARCHIVE} has no proposal.md`],
  ]);
});

test('[spec-trace-051] stops for an archived requirement that the main spec does not have with the same name, the same text and the same scenario IDs', () => {
  const proposal = { [`${ARCHIVE}/proposal.md`]: '## Why\n' };
  const stream = '### Requirement: Stream check\nThe radio MUST stop a stream that has no audio for ten seconds.\nOrigin: spec-first\n';
  const file = `${ARCHIVE}/specs/flights/spec.md`;
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': SPEC, [file]: `${DELTA}\n${stream}` }), [
    ['SPEC-DELTA-NOT-APPLIED', file, 11, 'Requirement "Stream check" of the archived change is not in openspec/specs/flights/spec.md'],
  ]);
  const changedText = SPEC.replace('MUST show a label for each aircraft', 'MUST show a label for some aircraft');
  const notEqual = ['SPEC-DELTA-NOT-APPLIED', file, 3, 'Requirement "Labels" in openspec/specs/flights/spec.md is not equal to the requirement in the archived change'];
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': changedText, [file]: DELTA.replace('ADDED', 'MODIFIED') }), [
    notEqual,
    ['SPEC-DELTA-NOT-APPLIED', file, 7, 'Scenario flights-004 in openspec/specs is not equal to the scenario in the archived change'],
  ]);
  const extraScenario = `${SPEC}#### Scenario: Hide a label \`flights-005\`\n- **WHEN** x\n- **THEN** y\n`;
  assert.deepEqual(archivedCheck({ ...proposal, 'openspec/specs/flights/spec.md': extraScenario, [file]: DELTA }), [notEqual]);
  withRoot({ ...proposal, 'openspec/specs/flights/spec.md': SPEC, [file]: `${DELTA}\n#### Scenario: Loose \`flights-006\`\n` }, (root) => {
    const archived = checkArchivedChange(root, ARCHIVE, loadSpecs(root));
    assert.deepEqual(archived.ids, ['flights-004', 'flights-006']);
    assert.deepEqual(archived.requirements.map((item) => [item.name, item.file]), [['Labels', file]]);
    assert.deepEqual(archived.orphans, []);
    assert.equal(archived.requirements[0].scenarios.length, 2);
  });
  withRoot({ ...proposal, [file]: '#### Scenario: Loose `flights-007`\n- **WHEN** x\n' }, (root) => {
    assert.deepEqual(checkArchivedChange(root, ARCHIVE, loadSpecs(root)).orphans, [{ id: 'flights-007', name: 'Loose', file, line: 1 }]);
  });
});

test('[spec-trace-052] stops for an archived removed requirement that the main spec still has', () => {
  const removal = ['## REMOVED Requirements', '### Requirement: Labels', '**Reason**: Not needed', ''].join('\n');
  const file = `${ARCHIVE}/specs/flights/spec.md`;
  const files = { [`${ARCHIVE}/proposal.md`]: '## Why\n', [file]: removal };
  const stillHas = ['SPEC-DELTA-NOT-APPLIED', file, undefined, 'The archived change removes requirement "Labels", but openspec/specs/flights/spec.md still has it'];
  assert.deepEqual(archivedCheck({ ...files, 'openspec/specs/flights/spec.md': SPEC }), [stillHas]);
  assert.deepEqual(archivedCheck(files), []);
  for (const form of ['- `### Requirement: Labels`', '###Requirement: Labels', '  - ### Requirement: Labels']) {
    const other = { [`${ARCHIVE}/proposal.md`]: '## Why\n', [file]: `## REMOVED Requirements\n${form}\n`, 'openspec/specs/flights/spec.md': SPEC };
    assert.deepEqual(archivedCheck(other), [stillHas], form);
  }
  assert.deepEqual(readDeltaNames('## Removed requirements\r\n- ### Requirement: A \r\n## ADDED Requirements\n### Requirement: B\n'), { removed: ['A'], renamed: [] });
});

test('[spec-trace-053] stops for an archived renamed requirement that the main spec has with the old name or does not have with the new name', () => {
  const file = `${ARCHIVE}/specs/flights/spec.md`;
  const rename = ['## RENAMED Requirements', '- FROM: `### Requirement: Labels`', '- TO: `### Requirement: Tags`', ''].join('\n');
  const files = { [`${ARCHIVE}/proposal.md`]: '## Why\n', [file]: rename };
  const renames = 'The archived change renames requirement "Labels" to "Tags"';
  assert.deepEqual(archivedCheck({ ...files, 'openspec/specs/flights/spec.md': SPEC }), [
    ['SPEC-DELTA-NOT-APPLIED', file, undefined, `${renames}, but openspec/specs/flights/spec.md still has "Labels"`],
    ['SPEC-DELTA-NOT-APPLIED', file, undefined, `${renames}, but openspec/specs/flights/spec.md does not have "Tags"`],
  ]);
  assert.deepEqual(archivedCheck({ ...files, 'openspec/specs/flights/spec.md': SPEC.replace('Requirement: Labels', 'Requirement: Tags') }), []);
  assert.deepEqual(readDeltaNames('## RENAMED Requirements\nTO: ### Requirement: Lost\nFROM:### Requirement: A\n  - TO: `### Requirement: B`\n'), { removed: [], renamed: [{ from: 'A', to: 'B' }] });
  withRoot({ [`${ARCHIVE}/proposal.md`]: '## Why\n', [`${ARCHIVE}/specs/empty/notes.md`]: '# Notes\n' }, (root) => {
    assert.deepEqual(checkArchivedChange(root, ARCHIVE, loadSpecs(root)).errors, []);
  });
});


test('[spec-trace-054] gives the scenarios of a main requirement that an active change removes', () => {
  const removal = ['## REMOVED Requirements', '### Requirement: Labels', '**Reason**: Not needed'].join('\n');
  withRoot(
    {
      'openspec/specs/flights/spec.md': SPEC,
      'openspec/changes/drop-labels/specs/flights/spec.md': removal,
      'openspec/trace/retired-ids.json': JSON.stringify(['flights-004']),
    },
    (root) => {
      const result = loadSpecs(root);
      assert.deepEqual([...result.removedIds], ['flights-004']);
      assert.ok(result.mainIds.has('flights-004'));
    },
  );
  withRoot({ 'openspec/specs/flights/spec.md': SPEC }, (root) => assert.deepEqual([...loadSpecs(root).removedIds], []));
  withRoot(
    {
      'openspec/specs/flights/spec.md': SPEC,
      'openspec/changes/empty/specs/flights/notes.md': 'No spec file here.\n',
    },
    (root) => assert.deepEqual([...loadSpecs(root).removedIds], []),
  );
  withRoot(
    {
      'openspec/specs/flights/spec.md': SPEC,
      'openspec/changes/other/specs/radio/spec.md': removal,
    },
    (root) => assert.deepEqual([...loadSpecs(root).removedIds], []),
  );
});
