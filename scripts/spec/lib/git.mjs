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

/** The full hash of the commit that a name gives, or null when the name is not a commit. */
export function resolveCommit(root, ref) {
  const result = git(root, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  return result.status === 0 ? result.stdout.trim() : null;
}

/**
 * The merged commits: the parents, other than the first parent, of the merge commits between the base commit and HEAD.
 * A commit with one parent has no such parent, so the list needs no filter for merge commits.
 */
export function mergeParents(root, base) {
  const lines = git(root, ['rev-list', '--parents', `${base}..HEAD`]).stdout.split('\n').filter(Boolean);
  return new Set(lines.flatMap((line) => line.split(' ').slice(2)));
}

/** The files that a commit changed since its merge base with the base commit. The set is empty when Git finds no merge base. */
export function changedByCommit(root, base, commit) {
  const mergeBase = git(root, ['merge-base', base, commit]);
  if (mergeBase.status !== 0) return new Set();
  return new Set(git(root, ['diff', '--name-only', '-z', mergeBase.stdout.trim(), commit]).stdout.split('\0').filter(Boolean));
}
