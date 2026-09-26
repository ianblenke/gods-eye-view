import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  checkUntracked,
  codeInventory,
  isCodeFile,
  listTrackedFiles,
  listUntrackedFiles,
  testInventory,
} from '../../../scripts/spec/lib/inventory.mjs';

function withGitRepo(tracked, untracked, body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-inventory-'));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  };
  const write = (entries) => {
    for (const [file, text] of Object.entries(entries)) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), text);
    }
  };
  try {
    git('init', '-q');
    write(tracked);
    git('add', '.');
    write(untracked);
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('[coverage-gate-001] includes each tracked JS and TypeScript file in the inventory', () => {
  withGitRepo(
    {
      'vite.config.js': 'export default {};\n',
      'src/ui.js': 'export const ui = 1;\n',
      'scripts/format.mjs': 'export {};\n',
      'src/types.ts': 'export type A = 1;\n',
      'pinokio/start.cjs': 'module.exports = {};\n',
      'src/view.tsx': 'export {};\n',
      'docs/readme.md': '# Docs\n',
      'dir with space/tool.js': 'export {};\n',
    },
    {},
    (root) => {
      assert.deepEqual(codeInventory(listTrackedFiles(root)), [
        'dir with space/tool.js',
        'pinokio/start.cjs',
        'scripts/format.mjs',
        'src/types.ts',
        'src/ui.js',
        'src/view.tsx',
        'vite.config.js',
      ]);
    },
  );
});

test('[coverage-gate-002] does not include test files in the inventory', () => {
  withGitRepo({ 'src/orbit.js': 'export {};\n', 'src/orbit.test.mjs': "import test from 'node:test';\n" }, {}, (root) => {
    const tracked = listTrackedFiles(root);
    assert.deepEqual(codeInventory(tracked), ['src/orbit.js']);
    assert.deepEqual(testInventory(tracked), ['src/orbit.test.mjs']);
  });
});

test('[coverage-gate-011] includes HTML files and shell files in the inventory', () => {
  assert.equal(isCodeFile('index.html'), true);
  assert.equal(isCodeFile('scripts/dev-fresh.sh'), true);
  assert.equal(isCodeFile('style.css'), false);
  assert.deepEqual(codeInventory(['index.html', 'scripts/dev-fresh.sh', 'package.json']), ['index.html', 'scripts/dev-fresh.sh']);
});

test('[coverage-gate-010] stops for an untracked code file that Git does not ignore', () => {
  withGitRepo(
    { 'src/orbit.js': 'export {};\n', '.gitignore': 'ignored.js\n' },
    { 'src/draft.js': 'export {};\n', 'src/draft.test.mjs': '', 'ignored.js': 'export {};\n', 'notes.txt': 'text\n' },
    (root) => {
      const untracked = listUntrackedFiles(root);
      assert.deepEqual(untracked, ['notes.txt', 'src/draft.js', 'src/draft.test.mjs']);
      assert.deepEqual(checkUntracked(untracked), [
        { code: 'COVERAGE-UNTRACKED', file: 'src/draft.js', message: 'Add src/draft.js to Git or to .gitignore. The gates measure only tracked files.' },
        { code: 'COVERAGE-UNTRACKED', file: 'src/draft.test.mjs', message: 'Add src/draft.test.mjs to Git or to .gitignore. The gates measure only tracked files.' },
      ]);
    },
  );
});

test('[coverage-gate-029] stops when Git cannot list the files', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-not-git-'));
  try {
    assert.throws(() => listTrackedFiles(root), /git ls-files failed: fatal/);
    assert.throws(() => listUntrackedFiles(root, { git: 'gev-no-such-git' }), /git ls-files failed: spawnSync gev-no-such-git ENOENT/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('[qa-scripts-013] omits a QA script with a valid header', () => {
  assert.deepEqual(codeInventory(['scripts/qa-example.mjs'], new Set(['scripts/qa-example.mjs'])), []);
});

test('[qa-scripts-014] keeps a QA script with a bad header', () => {
  assert.deepEqual(codeInventory(['scripts/qa-example.mjs'], new Set()), ['scripts/qa-example.mjs']);
});

test('[qa-scripts-015] keeps other code files', () => {
  assert.deepEqual(codeInventory(['src/main.js', 'scripts/qa-example.mjs'], new Set(['scripts/qa-example.mjs'])), ['src/main.js']);
});
