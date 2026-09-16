import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REVIEW_COMMAND,
  changeFolder,
  checkAgents,
  checkChangeNames,
  checkArchivedReviews,
  checkChangeReview,
  checkReviewCommand,
  computeTreeHash,
  parseReview,
  readAgentDefinition,
} from '../../../scripts/spec/lib/review.mjs';

const PROJECT_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
// Each agent file must name the scope of a round and the limit of three rounds.
const SCOPE_PROMPT = '## Scope of a round\n\nRead the diff since the round before. The review has a limit of three rounds.\n';
const TREE = 'a'.repeat(64);

const PASSED = [
  '# Review: add-radio',
  '',
  'Verdict: PASS',
  'Reviewers: spec-adversary, ste-adversary',
  'Date: 2026-09-13',
  'Gates: make gates CHANGE=add-radio passed',
  'Rounds: 3',
  'Scope: diff 1a2b3c4',
  `Reviewed-Tree: ${TREE}`,
  '',
  '## Findings',
  '',
  '- [x] F1 The test for radio-002 did not check the THEN line. Fixed.',
  '- [X] S1 A sentence had 27 words. Fixed.',
  '',
].join('\n');

const AGENT_PASS = 'Verdict: PASS\nFindings: none\n';

function reviewFiles(directory, review = PASSED, outputs = { 'spec-adversary': AGENT_PASS, 'ste-adversary': AGENT_PASS }) {
  const files = { [`${directory}/review.md`]: review };
  for (const [agent, text] of Object.entries(outputs)) files[`${directory}/review/${agent}.md`] = text;
  return files;
}

function withRoot(files, body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-review-'));
  try {
    for (const [file, text] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), text);
    }
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const ACTIVE = 'openspec/changes/add-radio';
const codes = (errors) => errors.map((error) => error.code);
const check = (review, outputs, options) => withRoot(reviewFiles(ACTIVE, review, outputs), (root) => checkChangeReview(root, 'add-radio', options));

test('[change-review-001] does not stop for a passed review with all the fields, the closed findings and the agent outputs', () => {
  assert.deepEqual(parseReview(PASSED), {
    verdicts: ['PASS'],
    reviewers: 'spec-adversary, ste-adversary',
    date: '2026-09-13',
    gates: 'make gates CHANGE=add-radio passed',
    rounds: '3',
    scope: 'diff 1a2b3c4',
    tree: TREE,
    findings: [
      { line: 13, checked: true, text: 'F1 The test for radio-002 did not check the THEN line. Fixed.' },
      { line: 14, checked: true, text: 'S1 A sentence had 27 words. Fixed.' },
    ],
  });
  assert.deepEqual(check(PASSED, undefined, { treeHash: TREE }), []);
});

test('[change-review-002] stops when the review.md file is not there', () => {
  withRoot({ [`${ACTIVE}/proposal.md`]: '# Proposal' }, (root) => {
    assert.deepEqual(checkChangeReview(root, 'add-radio'), [{ code: 'REVIEW-MISSING', file: `${ACTIVE}/review.md`, message: 'Change add-radio has no review.md' }]);
  });
  withRoot({}, (root) => assert.deepEqual(codes(checkChangeReview(root, 'nope')), ['REVIEW-MISSING']));
});

test('[change-review-003] stops for a failed review', () => {
  assert.deepEqual(check(PASSED.replace('Verdict: PASS', 'Verdict: FAIL')), [
    { code: 'REVIEW-NOT-PASS', file: `${ACTIVE}/review.md`, message: 'The verdict of add-radio is FAIL, not PASS' },
  ]);
});

test('[change-review-010] stops for a review without a verdict', () => {
  assert.deepEqual(codes(check(PASSED.replace('Verdict: PASS\n', ''))), ['REVIEW-NO-VERDICT']);
});

test('[change-review-011] stops for two verdict lines', () => {
  assert.deepEqual(codes(check(PASSED.replace('Verdict: PASS', 'Verdict: PASS\nVerdict: FAIL'))), ['REVIEW-TWO-VERDICTS']);
});

test('[change-review-004] stops for an open finding and shows it', () => {
  assert.deepEqual(check(PASSED.replace('- [X] S1', '- [ ] S1')), [
    { code: 'REVIEW-OPEN-FINDING', file: `${ACTIVE}/review.md`, line: 14, message: 'Open finding: S1 A sentence had 27 words. Fixed.' },
  ]);
});

test('[change-review-004] stops for an open finding in a list with another list marker', () => {
  const review = PASSED.replace('- [X] S1', '* [ ] S1').replace('- [x] F1', '  2. [ ] F1');
  assert.deepEqual(check(review).map((error) => [error.code, error.line]), [
    ['REVIEW-OPEN-FINDING', 13],
    ['REVIEW-OPEN-FINDING', 14],
  ]);
  assert.deepEqual(codes(check(PASSED.replace('- [X] S1', '+ [ ] S1').replace('- [x] F1', '3) [ ] F1'))), ['REVIEW-OPEN-FINDING', 'REVIEW-OPEN-FINDING']);
});

test('[change-review-005] stops when the reviewers line is not there', () => {
  assert.deepEqual(check(PASSED.replace(/^Reviewers:.*\n/m, '')).map((error) => error.message), ['review.md has no "Reviewers:" line']);
});

test('[change-review-012] stops when the date line is not there', () => {
  assert.deepEqual(check(PASSED.replace(/^Date:.*\n/m, '')).map((error) => error.message), ['review.md has no "Date:" line']);
});

test('[change-review-013] stops when the gates line is not there', () => {
  assert.deepEqual(check(PASSED.replace(/^Gates:.*\n/m, '')).map((error) => error.message), ['review.md has no "Gates:" line']);
});

test('[change-review-014] stops for a reviewers line without the two agents', () => {
  assert.deepEqual(codes(check(PASSED.replace('spec-adversary, ste-adversary', 'spec-adversary and a friend'))), ['REVIEW-REVIEWERS']);
});

test('[change-review-015] stops for a tree hash that is not equal to the current hash', () => {
  assert.deepEqual(codes(check(PASSED, undefined, { treeHash: 'b'.repeat(64) })), ['REVIEW-TREE']);
  assert.deepEqual(check(PASSED.replace(/^Reviewed-Tree:.*\n/m, ''), undefined, { treeHash: TREE }).map((error) => error.message), ['review.md has no "Reviewed-Tree:" line']);
  assert.deepEqual(check(PASSED.replace(/^Reviewed-Tree:.*\n/m, '')), []);
});

test('[change-review-015] calculates the tree hash from the change files and the diff files', () => {
  withRoot(
    {
      [`${ACTIVE}/proposal.md`]: 'proposal',
      [`${ACTIVE}/review.md`]: 'review one',
      [`${ACTIVE}/review/spec-adversary.md`]: 'output one',
      'src/radio.js': 'code',
      'openspec/changes/archive/2026-01-01-old/proposal.md': 'old',
    },
    (root) => {
      const input = { root, changeDir: ACTIVE, diffFiles: ['src/radio.js', 'src/deleted.js', 'openspec/changes/archive/2026-01-01-old/proposal.md'] };
      const first = computeTreeHash(input);
      assert.match(first, /^[0-9a-f]{64}$/);
      writeFileSync(path.join(root, `${ACTIVE}/review.md`), 'review two');
      writeFileSync(path.join(root, `${ACTIVE}/review/spec-adversary.md`), 'output two');
      writeFileSync(path.join(root, 'openspec/changes/archive/2026-01-01-old/proposal.md'), 'changed');
      assert.equal(computeTreeHash(input), first);
      writeFileSync(path.join(root, 'src/radio.js'), 'new code');
      assert.notEqual(computeTreeHash(input), first);
      assert.match(computeTreeHash({ root, changeDir: 'openspec/changes/none', diffFiles: [] }), /^[0-9a-f]{64}$/);
    },
  );
});

test('[change-review-016] stops when an agent output is not there', () => {
  assert.deepEqual(check(PASSED, { 'spec-adversary': AGENT_PASS }), [
    { code: 'REVIEW-AGENT-OUTPUT', file: `${ACTIVE}/review/ste-adversary.md`, message: 'The output of ste-adversary is not there' },
  ]);
});

test('[change-review-018] stops for an agent output without the verdict PASS', () => {
  assert.deepEqual(codes(check(PASSED, { 'spec-adversary': AGENT_PASS, 'ste-adversary': 'Verdict: FAIL\n- [ ] S1 fix\n' })), ['REVIEW-AGENT-NOT-PASS']);
});

test('[change-review-022] stops for an agent output with more than one verdict line', () => {
  const twoLines = 'Verdict: FAIL\n- [ ] S1 fix\nVerdict: PASS\n';
  assert.deepEqual(check(PASSED, { 'spec-adversary': twoLines, 'ste-adversary': AGENT_PASS }), [
    {
      code: 'REVIEW-AGENT-NOT-PASS',
      file: `${ACTIVE}/review/spec-adversary.md`,
      message: 'The output of spec-adversary must have one verdict line, and that line must be "Verdict: PASS"',
    },
  ]);
  assert.deepEqual(codes(check(PASSED, { 'spec-adversary': 'Verdict: PASS\n  verdict: fail\n', 'ste-adversary': AGENT_PASS })), ['REVIEW-AGENT-NOT-PASS']);
  assert.deepEqual(codes(check(PASSED, { 'spec-adversary': 'Findings: none\n', 'ste-adversary': AGENT_PASS })), ['REVIEW-AGENT-NOT-PASS']);
  assert.deepEqual(check(PASSED, { 'spec-adversary': '\n\nVerdict: PASS\nFindings: none\n', 'ste-adversary': AGENT_PASS }), []);
});

test('[change-review-006] checks the review of the named change, active or archived', () => {
  withRoot(
    {
      ...reviewFiles('openspec/changes/establish-spec-governance'),
      ...reviewFiles('openspec/changes/archive/2026-09-13-old', PASSED.replace('Verdict: PASS', 'Verdict: FAIL')),
      'openspec/changes/archive/README': 'not a change',
    },
    (root) => {
      assert.deepEqual(checkChangeReview(root, 'establish-spec-governance'), []);
      assert.deepEqual(checkChangeReview(root, 'old').map((error) => [error.code, error.file]), [['REVIEW-NOT-PASS', 'openspec/changes/archive/2026-09-13-old/review.md']]);
      assert.equal(changeFolder(root, 'old'), 'openspec/changes/archive/2026-09-13-old');
      assert.equal(changeFolder(root, 'archive'), null);
      assert.equal(changeFolder(root, 'nope'), null);
    },
  );
});

test('[change-review-007] checks the review.md file of each archived change', () => {
  withRoot(
    {
      ...reviewFiles('openspec/changes/archive/2026-09-13-good'),
      'openspec/changes/archive/2026-09-14-bad/proposal.md': '# Proposal',
      'openspec/changes/active/proposal.md': '# Not archived',
    },
    (root) => {
      assert.deepEqual(checkArchivedReviews(root).map((error) => [error.code, error.file]), [['REVIEW-MISSING', 'openspec/changes/archive/2026-09-14-bad/review.md']]);
      assert.deepEqual(checkArchivedReviews(root, { except: 'openspec/changes/archive/2026-09-14-bad' }), []);
    },
  );
  withRoot({}, (root) => assert.deepEqual(checkArchivedReviews(root), []));
});

test('[change-review-020] stops for a change name that two change folders use', () => {
  withRoot(
    {
      'openspec/changes/add-radio/proposal.md': '# New',
      'openspec/changes/archive/2026-01-01-add-radio/proposal.md': '# Old',
      'openspec/changes/archive/2026-02-01-other/proposal.md': '# Other',
      'openspec/changes/archive/2026-03-01-other/proposal.md': '# Other again',
      'openspec/changes/archive/2026-04-01-single/proposal.md': '# Single',
    },
    (root) => {
      assert.deepEqual(checkChangeNames(root), [
        { code: 'REVIEW-NAME-REUSED', file: 'openspec/changes', message: 'Two change folders have the change name add-radio. Give each change its own name.' },
        { code: 'REVIEW-NAME-REUSED', file: 'openspec/changes', message: 'Two change folders have the change name other. Give each change its own name.' },
      ]);
    },
  );
  withRoot({}, (root) => assert.deepEqual(checkChangeNames(root), []));
});

test('[change-review-008] does not stop for the spec adversary with read tools', () => {
  const agent = readAgentDefinition(path.join(PROJECT_ROOT, '.claude/agents/spec-adversary.md'));
  assert.deepEqual([agent.name, agent.tools], ['spec-adversary', ['Read', 'Grep', 'Glob']]);
  assert.ok(agent.description.length > 0 && agent.prompt.length > 0);
});

test('[change-review-009] does not stop for the STE adversary with read tools', () => {
  const agent = readAgentDefinition(path.join(PROJECT_ROOT, '.claude/agents/ste-adversary.md'));
  assert.deepEqual([agent.name, agent.tools], ['ste-adversary', ['Read', 'Grep', 'Glob']]);
  assert.deepEqual(checkAgents(PROJECT_ROOT), []);
});

test('[change-review-017] stops for an agent with another tool', () => {
  withRoot(
    {
      '.claude/agents/spec-adversary.md': `---\nname: spec-adversary\ndescription: Finds gaps\ntools: Read, Bash, *\n---\n${SCOPE_PROMPT}`,
      '.claude/agents/ste-adversary.md': `---\nname: ste-adversary\ndescription: Checks prose\ntools: Read, Grep, Glob\n---\n${SCOPE_PROMPT}`,
    },
    (root) => {
      assert.deepEqual(checkAgents(root).map((error) => error.message), [
        'spec-adversary has the tool Bash. Use only Read, Grep and Glob.',
        'spec-adversary has the tool *. Use only Read, Grep and Glob.',
      ]);
    },
  );
});

test('[change-review-021] stops for a review agent file that is not complete', () => {
  withRoot(
    {
      '.claude/agents/spec-adversary.md': `---\nname: spec-adversary\ndescription: Finds gaps\n---\n${SCOPE_PROMPT}`,
      '.claude/agents/ste-adversary.md': 'No front matter here.\n',
    },
    (root) => {
      assert.deepEqual(checkAgents(root).map((error) => [error.code, error.file, error.message]), [
        ['REVIEW-AGENT', '.claude/agents/spec-adversary.md', 'spec-adversary has no tools'],
        ['REVIEW-AGENT', '.claude/agents/ste-adversary.md', 'ste-adversary has no name'],
        ['REVIEW-AGENT', '.claude/agents/ste-adversary.md', 'ste-adversary has no description'],
        ['REVIEW-AGENT', '.claude/agents/ste-adversary.md', 'ste-adversary has no tools'],
        ['REVIEW-AGENT', '.claude/agents/ste-adversary.md', 'ste-adversary does not name the scope of a round and the limit of three rounds'],
      ]);
      assert.equal(readAgentDefinition(path.join(root, '.claude/agents/ste-adversary.md')).prompt, '');
    },
  );
  withRoot({}, (root) => assert.deepEqual(checkAgents(root).map((error) => error.message), ['spec-adversary has no agent file', 'ste-adversary has no agent file']));
});

test('[change-review-023] stops for a review agent file with other front matter lines', () => {
  const hooks = ['hooks:', '  PreToolUse:', '    - matcher: Read', 'mcpServers:', '  - files', 'skills: review'].join('\n');
  withRoot(
    {
      '.claude/agents/spec-adversary.md': `---\nname: spec-adversary\ndescription: Finds gaps\ntools: Read, Grep, Glob\n${hooks}\n---\n${SCOPE_PROMPT}`,
      '.claude/agents/ste-adversary.md': `---\nname: ste-adversary\ndescription: Checks prose\ntools: Read, Grep, Glob\nmodel: opus\ncolor: blue\n\n---\n${SCOPE_PROMPT}`,
    },
    (root) => {
      assert.deepEqual(checkAgents(root).map((error) => [error.file, error.message]), [
        ['.claude/agents/spec-adversary.md', 'spec-adversary has the front matter line "hooks:". Use only the keys name, description, tools, model and color.'],
        ['.claude/agents/spec-adversary.md', 'spec-adversary has the front matter line "PreToolUse:". Use only the keys name, description, tools, model and color.'],
        ['.claude/agents/spec-adversary.md', 'spec-adversary has the front matter line "- matcher: Read". Use only the keys name, description, tools, model and color.'],
        ['.claude/agents/spec-adversary.md', 'spec-adversary has the front matter line "mcpServers:". Use only the keys name, description, tools, model and color.'],
        ['.claude/agents/spec-adversary.md', 'spec-adversary has the front matter line "- files". Use only the keys name, description, tools, model and color.'],
        ['.claude/agents/spec-adversary.md', 'spec-adversary has the front matter line "skills: review". Use only the keys name, description, tools, model and color.'],
      ]);
      assert.deepEqual(readAgentDefinition(path.join(root, '.claude/agents/ste-adversary.md')).others, []);
    },
  );
});

test('[change-review-024] stops for a review file without a rounds line or a scope line', () => {
  assert.deepEqual(check(PASSED.replace(/^Rounds:.*\n/m, '')).map((error) => [error.code, error.message]), [['REVIEW-FIELD', 'review.md has no "Rounds:" line']]);
  assert.deepEqual(check(PASSED.replace(/^Scope:.*\n/m, '')).map((error) => [error.code, error.message]), [['REVIEW-FIELD', 'review.md has no "Scope:" line']]);
});

test('[change-review-025] does not stop for a correct scope line', () => {
  assert.deepEqual(parseReview(PASSED).scope, 'diff 1a2b3c4');
  assert.deepEqual(parseReview(PASSED.replace('Scope: diff 1a2b3c4', 'Scope: full')).scope, 'full');
  assert.deepEqual(check(PASSED.replace('Scope: diff 1a2b3c4', 'Scope: full')), []);
  assert.deepEqual(check(PASSED.replace('Scope: diff 1a2b3c4', `Scope: diff ${'0'.repeat(40)}`)), []);
});

test('[change-review-029] stops for a scope line that the gate does not accept', () => {
  for (const bad of ['Scope: diff 12345', 'Scope: diff zzzzzzz', 'Scope: diff A1B2C3D', 'Scope: partial', 'Scope: diff', `Scope: diff ${'0'.repeat(41)}`]) {
    assert.deepEqual(
      check(PASSED.replace('Scope: diff 1a2b3c4', bad)).map((error) => [error.code, error.message]),
      [['REVIEW-SCOPE', `The "Scope:" line must be "full" or "diff <commit>" with 7 to 40 lowercase hexadecimal characters, not "${bad.slice('Scope: '.length)}"`]],
      bad,
    );
  }
});

test('[change-review-030] stops for a first round with a scope that is not the full change', () => {
  const first = PASSED.replace('Rounds: 3', 'Rounds: 1');
  assert.deepEqual(check(first).map((error) => [error.code, error.message]), [
    ['REVIEW-SCOPE', 'The first round reads the whole change, so its "Scope:" line must be "full"'],
  ]);
  assert.deepEqual(check(first.replace('Scope: diff 1a2b3c4', 'Scope: full')), []);
  assert.deepEqual(check(PASSED.replace('Rounds: 3', 'Rounds: 2')), []);
});

test('[change-review-031] stops for a rounds line with a number less than 1', () => {
  assert.deepEqual(check(PASSED.replace('Rounds: 3', 'Rounds: 0')).map((error) => [error.code, error.message]), [
    ['REVIEW-ROUNDS', 'The "Rounds:" line must have a number of 1 or more'],
  ]);
});

test('[change-review-026] does not stop for an open finding that a person accepts after three rounds', () => {
  const accepted = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] F1 minor The gate reads no worker thread. Accepted by Ian Blenke.');
  assert.deepEqual(check(accepted), []);
  assert.deepEqual(parseReview(accepted).findings[0], { line: 13, checked: false, text: 'F1 minor The gate reads no worker thread. Accepted by Ian Blenke.' });
  assert.deepEqual(check(accepted.replace('Rounds: 3', 'Rounds: 4')), []);
});

test('[change-review-028] stops for an open finding that a person accepts before three rounds or without the severity minor', () => {
  const accepted = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] F1 minor The gate reads no worker thread. Accepted by Ian Blenke.');
  assert.deepEqual(check(accepted.replace('Rounds: 3', 'Rounds: 2')).map((error) => [error.code, error.message]), [
    ['REVIEW-OPEN-FINDING', 'Open finding: F1 minor The gate reads no worker thread. Accepted by Ian Blenke.'],
  ]);
  const major = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] F1 major A test hides a gap. Accepted by Ian Blenke.');
  assert.deepEqual(codes(check(major)), ['REVIEW-OPEN-FINDING']);
  const critical = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] F1 critical A test hides a gap. This is not a minor problem. Accepted by Ian Blenke.');
  assert.deepEqual(codes(check(critical)), ['REVIEW-OPEN-FINDING']);
  const noSeverity = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] A test hides a gap. Accepted by Ian Blenke.');
  assert.deepEqual(codes(check(noSeverity)), ['REVIEW-OPEN-FINDING']);
  const upper = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] F1 Minor The gate reads no worker thread. Accepted by Ian Blenke.');
  assert.deepEqual(check(upper), []);
  const noName = PASSED.replace('- [x] F1 The test for radio-002 did not check the THEN line. Fixed.', '- [ ] F1 minor The gate reads no worker thread. Accepted by .');
  assert.deepEqual(codes(check(noName)), ['REVIEW-OPEN-FINDING']);
  const first = accepted.replace('Rounds: 3', 'Rounds: 1').replace('Scope: diff 1a2b3c4', 'Scope: full');
  assert.deepEqual(codes(check(first)), ['REVIEW-OPEN-FINDING']);
});

test('[change-review-027] stops for an agent file without the scope rules', () => {
  const full = (name, extra) => `---\nname: ${name}\ndescription: Finds gaps\ntools: Read, Grep, Glob\n---\nReview.\n${extra}`;
  withRoot(
    {
      '.claude/agents/spec-adversary.md': full('spec-adversary', SCOPE_PROMPT),
      '.claude/agents/ste-adversary.md': full('ste-adversary', '## Scope\n\nRead the diff since the round before. The review has a limit of three rounds.\n'),
    },
    (root) => {
      assert.deepEqual(checkAgents(root).map((error) => error.message), ['ste-adversary does not name the scope of a round and the limit of three rounds']);
    },
  );
  withRoot(
    {
      '.claude/agents/spec-adversary.md': full('spec-adversary', '## Scope of a round\n\nRead the diff since the round before.\n'),
      '.claude/agents/ste-adversary.md': full('ste-adversary', '## Scope of a round\n\nThe review has a limit of three rounds.\n'),
    },
    (root) => {
      assert.deepEqual(checkAgents(root).map((error) => error.file), ['.claude/agents/spec-adversary.md', '.claude/agents/ste-adversary.md']);
    },
  );
  assert.deepEqual(checkAgents(PROJECT_ROOT), []);
});

test('[change-review-032] stops for a review command without the scope rules', () => {
  withRoot({}, (root) => {
    assert.deepEqual(checkReviewCommand(root), [{ code: 'REVIEW-COMMAND', file: REVIEW_COMMAND, message: 'The review command file is not there' }]);
  });
  const message = 'The review command does not name the scope of a round, the two review.md lines and the limit of three rounds';
  const good = '5. Find the scope of the round.\n\n```\nRounds: <n>\nScope: full\n```\n\nThe review has a limit of three rounds.\n';
  withRoot({ [REVIEW_COMMAND]: good }, (root) => assert.deepEqual(checkReviewCommand(root), []));
  for (const bad of [good.replace('5. Find the scope of the round.\n', ''), good.replace('Rounds: <n>\n', ''), good.replace('Scope: full\n', ''), good.replace('The review has a limit of three rounds.\n', '')]) {
    withRoot({ [REVIEW_COMMAND]: bad }, (root) => {
      assert.deepEqual(checkReviewCommand(root).map((error) => [error.code, error.message]), [['REVIEW-COMMAND', message]], bad);
    });
  }
  assert.deepEqual(checkReviewCommand(PROJECT_ROOT), []);
});
