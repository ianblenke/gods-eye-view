import { spawnSync } from 'node:child_process';

const CODE_FILE = /\.(js|mjs|cjs|ts|mts|cts|jsx|tsx|html|sh)$/;
const TEST_FILE = /\.test\.mjs$/;

function gitList(root, args, git) {
  const result = spawnSync(git, args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    const detail = result.error ? result.error.message : result.stderr;
    throw new Error(`git ${args[0]} failed: ${detail}`);
  }
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * List the files that Git tracks, relative to the project root.
 *
 * @param {string} root - Project root.
 * @param {{git?: string}} [options] - Git command to run.
 * @returns {string[]} Sorted file paths with forward slashes.
 */
export function listTrackedFiles(root, { git = 'git' } = {}) {
  return gitList(root, ['ls-files', '-z'], git);
}

/** List the files that Git does not track and does not ignore. */
export function listUntrackedFiles(root, { git = 'git' } = {}) {
  return gitList(root, ['ls-files', '--others', '--exclude-standard', '-z'], git);
}

/** True for a code file name: one of the code extensions and not a test file. */
export function isCodeFile(file) {
  return CODE_FILE.test(file) && !TEST_FILE.test(file);
}

/** True for a test file name. */
export function isTestFile(file) {
  return TEST_FILE.test(file);
}

/** Code files in the coverage inventory. */
export function codeInventory(tracked) {
  return tracked.filter(isCodeFile);
}

/** Tracked test files. */
export function testInventory(tracked) {
  return tracked.filter(isTestFile);
}

/** One error for each untracked code file or test file. */
export function checkUntracked(untracked) {
  return untracked
    .filter((file) => isCodeFile(file) || isTestFile(file))
    .map((file) => ({
      code: 'COVERAGE-UNTRACKED',
      file,
      message: `Add ${file} to Git or to .gitignore. The gates measure only tracked files.`,
    }));
}
