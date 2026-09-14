import { spawnSync } from 'node:child_process';

function git(root, args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

/** The merge base of HEAD and the base branch. Throws when Git cannot find it. */
export function resolveMergeBase(root, ref) {
  const result = git(root, ['merge-base', 'HEAD', ref]);
  if (result.status !== 0) {
    throw new Error(`Git cannot find the merge base of HEAD and ${ref}: ${result.stderr.trim()}`);
  }
  return result.stdout.trim();
}

/** The commit of HEAD. */
export function headCommit(root) {
  return git(root, ['rev-parse', 'HEAD']).stdout.trim();
}

/** The content of a file in a commit, or null when the commit does not have the file. */
export function readFileAt(root, commit, file) {
  const result = git(root, ['show', `${commit}:${file}`]);
  return result.status === 0 ? result.stdout : null;
}

/** The files of a commit. */
export function listFilesAt(root, commit) {
  return git(root, ['ls-tree', '-r', '-z', '--name-only', commit]).stdout.split('\0').filter(Boolean).sort();
}

/** Files that differ between a commit and the working tree, and untracked files. */
export function diffNames(root, commit) {
  const changed = git(root, ['diff', '--name-only', '-z', commit]).stdout.split('\0');
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard', '-z']).stdout.split('\0');
  return [...new Set([...changed, ...untracked].filter(Boolean))].sort();
}
