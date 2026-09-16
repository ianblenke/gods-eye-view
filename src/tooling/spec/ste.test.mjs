import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  hasErrors,
  lintMarkdown,
  lintProject,
  lintTestNames,
  listMarkdownFiles,
  readWordList,
} from '../../../scripts/spec/lib/ste.mjs';

const WORDS = {
  words: { should: 'must', via: 'through', 'e.g': 'for example' },
  phrases: { 'in order to': 'to' },
  allowedIng: ['string', 'during'],
};

const lint = (text, file = 'openspec/specs/a/spec.md') =>
  lintMarkdown(text, { file, words: WORDS });
const rules = (findings) => findings.map((finding) => [finding.rule, finding.line]);
const sentence = (count) => `${Array.from({ length: count }, () => 'word').join(' ')}.`;

function tempRoot(files) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-ste-'));
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  }
  return root;
}

test('[ste-lint-001] checks each Markdown file in openspec', () => {
  const root = tempRoot({
    'openspec/specs/a/spec.md': 'The gate stops the build.\n',
    'openspec/changes/b/tasks.md': '- [ ] 1.1 Write the test.\n',
    'openspec/changes/archive/2026-01-01-c/proposal.md': 'You should stop.\n',
    'openspec/config.yaml': 'context: you should not lint this\n',
    'docs/readme.md': 'You should not lint this file.\n',
    'openspec/ste/words.json': JSON.stringify(WORDS),
  });
  try {
    assert.deepEqual(listMarkdownFiles(root), [
      'openspec/changes/archive/2026-01-01-c/proposal.md',
      'openspec/changes/b/tasks.md',
      'openspec/specs/a/spec.md',
    ]);
    const findings = lintProject({ root, records: [] });
    assert.deepEqual(
      findings.map((finding) => [finding.rule, finding.file]),
      [['STE-WORD', 'openspec/changes/archive/2026-01-01-c/proposal.md']],
    );
    assert.deepEqual(readWordList(root), WORDS);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[ste-lint-017] checks only the process files in a project without an openspec folder', () => {
  const root = tempRoot({ 'AGENTS.md': 'Read this.\n' });
  try {
    assert.deepEqual(listMarkdownFiles(root), ['AGENTS.md']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[ste-lint-018] does not check the review files', () => {
  const root = tempRoot({
    'openspec/changes/a/review.md': 'You should not lint this.\n',
    'openspec/changes/a/review/spec-adversary.md': 'You should not lint this.\n',
    'openspec/changes/a/review/round-1/ste-adversary.md': 'You should not lint this.\n',
    'openspec/changes/a/proposal.md': 'The gate stops.\n',
  });
  try {
    assert.deepEqual(listMarkdownFiles(root), ['openspec/changes/a/proposal.md']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[ste-lint-018] does not check the review files of an archived change', () => {
  const root = tempRoot({
    'openspec/changes/archive/2026-01-01-a/review.md': 'You should not lint this.\n',
    'openspec/changes/archive/2026-01-01-a/review/spec-adversary.md': 'You should not lint this.\n',
    'openspec/changes/archive/2026-01-01-a/design.md': 'The gate stops.\n',
  });
  try {
    assert.deepEqual(listMarkdownFiles(root), ['openspec/changes/archive/2026-01-01-a/design.md']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[ste-lint-019] checks a review file that is not directly in a change folder', () => {
  const root = tempRoot({
    'openspec/specs/review/spec.md': 'A spec.\n',
    'openspec/specs/a/review.md': 'A review file in a spec.\n',
    'openspec/review.md': 'A review file at the top.\n',
    'openspec/changes/review/proposal.md': 'A change with the name review.\n',
    'openspec/changes/archive/review.md': 'A file in the archive folder.\n',
    'openspec/changes/a/specs/review/spec.md': 'A delta spec.\n',
    'openspec/changes/a/notes/review.md': 'A review file in a subfolder.\n',
  });
  try {
    assert.deepEqual(listMarkdownFiles(root), [
      'openspec/changes/a/notes/review.md',
      'openspec/changes/a/specs/review/spec.md',
      'openspec/changes/archive/review.md',
      'openspec/changes/review/proposal.md',
      'openspec/review.md',
      'openspec/specs/a/review.md',
      'openspec/specs/review/spec.md',
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[ste-lint-002] checks the names of traced tests without the tag', () => {
  const findings = lintTestNames(
    [
      { file: 'src/a.test.mjs', name: '[a-001] it should stop', title: 'it should stop', kind: 'test', tags: ['a-001'] },
      { file: 'src/a.test.mjs', name: 'old test should stay', title: 'old test should stay', kind: 'test', tags: [] },
      { file: 'src/a.test.mjs', name: '[a-001] suite should', title: 'suite should', kind: 'suite', tags: ['a-001'] },
    ],
    WORDS,
  );
  assert.deepEqual(findings, [
    {
      rule: 'STE-WORD',
      level: 'error',
      file: 'src/a.test.mjs',
      line: 0,
      message: 'Test "[a-001] it should stop": use "must", not "should"',
    },
  ]);
});

test('[ste-lint-003] does not check fenced code, inline code, URLs or scenario IDs', () => {
  const text = [
    '```',
    'You should not check this code, e.g. here.',
    '```',
    'Use `should` in code and https://example.com/should-via only.',
    '#### Scenario: Show a label `should-001`',
    'See [the guide](https://example.com/via) for the rules.',
    '| Rule | Limit |',
    '|---|---|',
    '| `STE-WORD` | one word |',
  ].join('\n');
  assert.deepEqual(lint(text), []);
});

test('[ste-lint-013] checks AGENTS.md, the agent files and the review command', () => {
  const root = tempRoot({
    'AGENTS.md': 'You should read this.\n',
    '.claude/agents/spec-adversary.md': '---\nname: spec-adversary\n---\nYou should check.\n',
    '.claude/agents/nested/other.md': 'You should not lint this.\n',
    '.claude/commands/opsx/review.md': 'You should run it.\n',
    '.claude/commands/opsx/apply.md': 'You should not lint this.\n',
    '.claude/skills/openspec-propose/SKILL.md': 'You should not lint this.\n',
    'openspec/ste/words.json': JSON.stringify(WORDS),
  });
  try {
    assert.deepEqual(listMarkdownFiles(root), ['.claude/agents/spec-adversary.md', '.claude/commands/opsx/review.md', 'AGENTS.md']);
    assert.deepEqual(
      lintProject({ root, records: [] }).map((finding) => finding.file),
      ['.claude/agents/spec-adversary.md', '.claude/commands/opsx/review.md', 'AGENTS.md'],
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[ste-lint-015] records STE-CODE-SPAN for inline code with more than 4 words', () => {
  const text = ['Run `make gates CHANGE=a` now.', 'Do not hide `a whole long sentence in code here`.', '```', '`this fenced line has many words in it`', '```'].join('\n');
  assert.deepEqual(
    lint(text).map((finding) => [finding.rule, finding.line, finding.message]),
    [['STE-CODE-SPAN', 2, 'The inline code has 7 words. The limit is 4. Write the words as prose.']],
  );
});

test('[ste-lint-014] ends a sentence at a period after inline code or a URL', () => {
  const text = `${sentence(20).slice(0, -1)} \`file.json\`. ${sentence(20).slice(0, -1)} https://example.com/a. ${sentence(20)}`;
  assert.deepEqual(lint(text), []);
});

test('[ste-lint-004] records STE-SENTENCE for a sentence with more than 25 words', () => {
  const text = `${sentence(25)} ${sentence(26)}\n\n- ${sentence(26)}`;
  const findings = lint(text);
  assert.deepEqual(rules(findings), [
    ['STE-SENTENCE', 1],
    ['STE-SENTENCE', 3],
  ]);
  assert.equal(findings[0].level, 'error');
  assert.match(findings[0].message, /26 words/);
});

test('[ste-lint-004] finds the line where a long sentence starts', () => {
  const text = `Short start.\n${sentence(10)}\n${sentence(26)}`;
  assert.deepEqual(rules(lint(text)), [['STE-SENTENCE', 3]]);
});

test('[ste-lint-005] records STE-INSTRUCTION for a task line with more than 20 words', () => {
  const text = [
    `- [ ] 1.1 ${sentence(20)}`,
    `- [x] 1.2 ${sentence(21)}`,
    `${sentence(21)}`,
  ].join('\n\n');
  assert.deepEqual(rules(lint(text, 'openspec/changes/a/tasks.md')), [
    ['STE-INSTRUCTION', 3],
  ]);
  assert.deepEqual(rules(lint(`- [ ] 1.1 ${sentence(21)}`)), []);
});

test('[ste-lint-006] records STE-PARAGRAPH for a paragraph with more than 6 sentences', () => {
  const six = Array.from({ length: 6 }, () => 'Stop the gate.').join(' ');
  const seven = Array.from({ length: 7 }, () => 'Stop the gate.').join('\n');
  assert.deepEqual(rules(lint(`${six}\n\n${seven}`)), [['STE-PARAGRAPH', 3]]);
});

test('[ste-lint-007] records STE-CONTRACTION for a contraction', () => {
  const text = [
    "Don't stop.",
    'It’s here.',
    "The file's name stays.",
    "We'll see and they're here.",
  ].join('\n\n');
  assert.deepEqual(rules(lint(text)), [
    ['STE-CONTRACTION', 1],
    ['STE-CONTRACTION', 3],
    ['STE-CONTRACTION', 7],
    ['STE-CONTRACTION', 7],
  ]);
});

test('[ste-lint-008] records STE-WORD with the word to use', () => {
  const findings = lint('Send it via the gate in order to stop, e.g. now. Should works.');
  assert.deepEqual(
    findings.map((finding) => [finding.rule, finding.message]),
    [
      ['STE-WORD', 'Use "through", not "via"'],
      ['STE-WORD', 'Use "for example", not "e.g"'],
      ['STE-WORD', 'Use "must", not "should"'],
      ['STE-WORD', 'Use "to", not "in order to"'],
    ],
  );
});

test('[ste-lint-009] records the warning STE-PASSIVE for possible passive voice', () => {
  const findings = lint('The file is removed. The key was hidden. It is then open.');
  assert.deepEqual(
    findings.map((finding) => [finding.rule, finding.level]),
    [
      ['STE-PASSIVE', 'warning'],
      ['STE-PASSIVE', 'warning'],
    ],
  );
});

test('[ste-lint-010] records the warning STE-ING for an -ing word that the allowed list does not contain', () => {
  const findings = lint('Using a string during the run is loading.');
  assert.deepEqual(
    findings.map((finding) => [finding.rule, finding.level, finding.message]),
    [
      ['STE-ING', 'warning', 'Check the -ing word "Using"'],
      ['STE-ING', 'warning', 'Check the -ing word "loading"'],
    ],
  );
});

test('[ste-lint-011] gives a failure status when there are errors', () => {
  assert.equal(hasErrors(lint('You should stop.')), true);
});

test('[ste-lint-012] gives a success status for warnings only', () => {
  const findings = lint('The file is removed.');
  assert.equal(findings.length, 1);
  assert.equal(hasErrors(findings), false);
  assert.equal(hasErrors([]), false);
});
