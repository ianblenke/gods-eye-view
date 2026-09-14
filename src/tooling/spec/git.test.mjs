import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { diffNames, headCommit, listFilesAt, readFileAt, resolveMergeBase } from '../../../scripts/spec/lib/git.mjs';

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
