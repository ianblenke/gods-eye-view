import { isCodeFile, isTestFile } from './inventory.mjs';

const ARCHIVED_FILE = /^openspec\/changes\/archive\/([^/]+)\//;
const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;
const PROCESS_FILE = /^(AGENTS\.md|Makefile|Dockerfile|\.node-version|package\.json|package-lock\.json|\.claude\/.+|\.github\/.+)$/;

/**
 * Find the change that CI must check for a diff.
 *
 * @param {object} input
 * @param {string[]} input.activeChanges - Active change folders in the tree.
 * @param {string[]} input.diffFiles - Files that differ from the base.
 * @param {Set<string>} input.baseFiles - Files of the base commit.
 * @returns {{change: string|undefined, errors: object[]}}
 */
export function planCi({ activeChanges, diffFiles, baseFiles }) {
  const errors = activeChanges.map((name) => ({
    code: 'CI-ACTIVE-CHANGE',
    file: `openspec/changes/${name}`,
    message: `Change ${name} is not archived. Run openspec archive ${name} before you merge it.`,
  }));
  const baseFolders = new Set([...baseFiles].map((file) => file.match(ARCHIVED_FILE)?.[1]).filter(Boolean));
  const added = [...new Set(diffFiles.map((file) => file.match(ARCHIVED_FILE)?.[1]).filter((folder) => folder && !baseFolders.has(folder)))].sort();
  const touched = diffFiles.some((file) => isCodeFile(file) || isTestFile(file) || file.startsWith('openspec/') || PROCESS_FILE.test(file));

  if (added.length > 1) {
    errors.push({ code: 'CI-TWO-CHANGES', file: 'openspec/changes/archive', message: `The diff adds ${added.length} archived changes: ${added.join(', ')}. Put each change in its own pull request.` });
    return { change: undefined, errors };
  }
  if (added.length === 1) return { change: added[0].replace(DATE_PREFIX, ''), errors };
  if (touched) {
    errors.push({ code: 'CI-NO-CHANGE', file: 'openspec/changes/archive', message: 'The diff changes code, tests, specs or process files, but it adds no archived change' });
  }
  return { change: undefined, errors };
}
