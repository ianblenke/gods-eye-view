import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { changedByCommit, diffNames, headCommit, listFilesAt, mergeParents, readFileAt, resolveCommit, resolveMergeBase } from '../../../scripts/spec/lib/git.mjs';

function run(root, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function write(root, files) {
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  }
}

test('[gap-ledger-030 gap-ledger-046] reads the merge base, the base files and the diff with Git', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-git-'));
  try {
    run(root, 'init', '-q', '-b', 'main');
    write(root, { 'a.txt': 'one\n', 'dir/b.txt': 'two\n' });
    run(root, 'add', '.');
    run(root, 'commit', '-q', '-m', 'base');
    const base = headCommit(root);
    run(root, 'checkout', '-q', '-b', 'work');
    write(root, { 'a.txt': 'changed\n', 'c.txt': 'new\n' });
    run(root, 'add', 'c.txt');
    run(root, 'commit', '-q', '-m', 'work');
    write(root, { 'dir/b.txt': 'edited\n', 'untracked.txt': 'u\n' });

    assert.equal(resolveMergeBase(root, 'main'), base);
    assert.throws(() => resolveMergeBase(root, 'origin/nope'), /Git cannot find the merge base of HEAD and origin\/nope/);
    assert.equal(readFileAt(root, base, 'a.txt'), 'one\n');
    assert.equal(readFileAt(root, base, 'c.txt'), null);
    assert.deepEqual(listFilesAt(root, base), ['a.txt', 'dir/b.txt']);
    assert.deepEqual(diffNames(root, base), ['a.txt', 'c.txt', 'dir/b.txt', 'untracked.txt']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function commit(root, message, files) {
  write(root, files);
  run(root, 'add', '-A');
  run(root, 'commit', '-q', '-m', message);
  return run(root, 'rev-parse', 'HEAD');
}

/**
 * A project with two merges. An old merge is in the base. A later merge of the branch `up` into the branch `work`
 * is after the base. The branch `main` moves on after the base, and `up` starts from the base.
 */
function withMerges(body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-git-'));
  try {
    run(root, 'init', '-q', '-b', 'main');
    commit(root, 'first', { 'a.txt': 'one\n' });
    run(root, 'checkout', '-q', '-b', 'old');
    const oldSide = commit(root, 'old side', { 'old.txt': 'old\n' });
    run(root, 'checkout', '-q', 'main');
    run(root, 'merge', '-q', '--no-ff', '-m', 'old merge', 'old');
    const base = run(root, 'rev-parse', 'HEAD');
    run(root, 'checkout', '-q', '-b', 'up');
    const upSide = commit(root, 'up side', { 'up.txt': 'up\n', 'both.txt': 'up\n' });
    run(root, 'checkout', '-q', 'main');
    const mainTip = commit(root, 'main moves on', { 'main-side.txt': 'main\n' });
    run(root, 'checkout', '-q', '-b', 'work', base);
    const workSide = commit(root, 'work side', { 'work.txt': 'work\n' });
    run(root, 'merge', '-q', '--no-ff', '-m', 'merge up', 'up');
    return body({ root, base, oldSide, upSide, mainTip, workSide });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('[gap-ledger-090] finds the full hash of a commit and no hash for a name that is not a commit', () => {
  withMerges(({ root, upSide }) => {
    assert.equal(resolveCommit(root, 'up'), upSide);
    assert.match(resolveCommit(root, 'up'), /^[0-9a-f]{40}$/);
    assert.equal(resolveCommit(root, upSide.slice(0, 8)), upSide);
    assert.equal(resolveCommit(root, 'nope'), null);
    assert.equal(resolveCommit(root, 'HEAD:a.txt'), null, 'a file is not a commit');
  });
});

test('[gap-ledger-090 gap-ledger-096] finds the merged commits after the base commit and not the first parents or the merge commits before the base commit', () => {
  withMerges(({ root, base, upSide, oldSide, workSide }) => {
    const parents = mergeParents(root, base);
    assert.deepEqual([...parents], [upSide]);
    assert.equal(parents.has(oldSide), false, 'the old merge is in the base');
    assert.equal(parents.has(workSide), false, 'the first parent is not a merged commit');
    assert.deepEqual([...mergeParents(root, 'HEAD')], [], 'no merge commit after HEAD');
  });
});

test('[gap-ledger-097] finds the files that a commit changed since its merge base with the base commit', () => {
  withMerges(({ root, mainTip, upSide }) => {
    const changed = changedByCommit(root, mainTip, upSide);
    assert.deepEqual([...changed].sort(), ['both.txt', 'up.txt']);
    assert.equal(changed.has('main-side.txt'), false, 'a file that only the base side changed is not in the set');
    assert.deepEqual([...changedByCommit(root, mainTip, 'nope')], []);
  });
});
