import test from 'node:test';
import assert from 'node:assert/strict';
import { planCi } from '../../../scripts/spec/lib/ci.mjs';

const BASE = new Set(['src/app.js', 'openspec/changes/archive/2026-09-01-old/proposal.md']);
const plan = (diffFiles, activeChanges = []) => planCi({ activeChanges, diffFiles, baseFiles: BASE });

test('[ci-gates-001] stops for a code diff without an archived change', () => {
  assert.deepEqual(plan(['src/app.js']), {
    change: undefined,
    errors: [{ code: 'CI-NO-CHANGE', file: 'openspec/changes/archive', message: 'The diff changes code, tests, specs or process files, but it adds no archived change' }],
  });
  assert.deepEqual(plan(['src/app.test.mjs']).errors.map((error) => error.code), ['CI-NO-CHANGE']);
  assert.deepEqual(plan(['openspec/specs/radio/spec.md', 'openspec/changes/archive/2026-09-01-old/proposal.md']).errors.map((error) => error.code), ['CI-NO-CHANGE']);
});

test('[ci-gates-010] stops for a process file diff without an archived change', () => {
  for (const file of ['AGENTS.md', '.claude/agents/spec-adversary.md', '.github/workflows/ci.yml', 'Makefile', 'Dockerfile', '.node-version', 'package.json', 'package-lock.json']) {
    assert.deepEqual(plan([file]).errors.map((error) => error.code), ['CI-NO-CHANGE'], file);
  }
  assert.deepEqual(plan(['docs/AGENTS.md', 'docs/package-lock.json']).errors, []);
});

test('[ci-gates-002] stops for a diff with two archived changes', () => {
  const result = plan(['openspec/changes/archive/2026-09-13-a/proposal.md', 'openspec/changes/archive/2026-09-14-b/proposal.md', 'openspec/changes/archive/2026-09-14-b/tasks.md']);
  assert.equal(result.change, undefined);
  assert.deepEqual(result.errors, [
    { code: 'CI-TWO-CHANGES', file: 'openspec/changes/archive', message: 'The diff adds 2 archived changes: 2026-09-13-a, 2026-09-14-b. Put each change in its own pull request.' },
  ]);
});

test('[ci-gates-003] stops for an active change', () => {
  const result = plan(['openspec/changes/archive/2026-09-13-a/proposal.md'], ['draft']);
  assert.deepEqual(result.errors, [
    { code: 'CI-ACTIVE-CHANGE', file: 'openspec/changes/draft', message: 'Change draft is not archived. Run openspec archive draft before you merge it.' },
  ]);
});

test('[ci-gates-004] checks the archived change of the diff', () => {
  assert.deepEqual(plan(['src/app.js', 'openspec/changes/archive/2026-09-13-add-radio/review.md']), { change: 'add-radio', errors: [] });
});

test('[ci-gates-005] checks a diff that changes no code, without a change name', () => {
  assert.deepEqual(plan(['README.md', 'docs/media/a.gif']), { change: undefined, errors: [] });
  assert.deepEqual(plan([]), { change: undefined, errors: [] });
});
