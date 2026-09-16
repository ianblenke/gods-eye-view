import { createHash } from 'node:crypto';
import path from 'node:path';

const COUNT_LINE = /^(LF|LH|BRF|BRH|FNF|FNH):(\d+)$/;
const SCRIPT_ELEMENT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const QUOTED_VALUE = /"[^"]*"|'[^']*'/g;
const SRC_ATTRIBUTE = /(?:^|\s)src\s*=/i;
const HANDLER_ATTRIBUTE = /\son[a-z]+\s*=/gi;
const SCRIPT_URL = new RegExp(`${'java' + 'script'}:`, 'gi');
// Built from parts so that this file does not match its own check.
const TEST_IMPORT = new RegExp(`(?:from|import\\(|require\\()\\s*['"][^'"]*\\.${'test'}\\.mjs['"]`);
const FLAG_SCAN_FILE = /\.(js|mjs|cjs|ts|mts|cts|jsx|tsx|html|sh|json|ya?ml)$/;
const FLAG_ALLOWED = new Set(['scripts/spec/gates.mjs', 'src/tooling/spec/gates.test.mjs']);

// Built from parts so that this file does not match its own checks.
const IGNORE = 'ign' + 'ore';
const IGNORE_COMMENT = new RegExp(
  `\\b(?:node:coverage\\s+(?:${IGNORE}|disable|enable)|c8\\s+${IGNORE}|v8\\s+${IGNORE}|istanbul\\s+${IGNORE})\\b`,
);
const COVERAGE_FLAG = new RegExp(`--test-coverage-(?:${'ex' + 'clude'}|${'in' + 'clude'})`);

function relativeFile(file, root) {
  const relative = path.isAbsolute(file) ? path.relative(root, file) : file;
  return relative.split(path.sep).join('/');
}

/**
 * Read the summary counts of each file in an lcov report. A file that the tests load under
 * two or more URLs, for example with a query string, has one record for each URL. For each
 * metric, the result uses the record with the most not-covered items, and then the smallest
 * total. Thus a record that a test adds to the report cannot hide a gap.
 *
 * @param {string} text - lcov text from the node:test lcov reporter.
 * @param {{root: string}} options - Root for absolute source paths.
 * @returns {Map<string, {lines: object, branches: object, functions: object}>}
 */
export function parseLcov(text, { root }) {
  const records = new Map();
  let counts = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('SF:')) {
      const file = relativeFile(line.slice(3), root);
      counts = { LF: 0, LH: 0, BRF: 0, BRH: 0, FNF: 0, FNH: 0 };
      records.set(file, [...(records.get(file) ?? []), counts]);
      continue;
    }
    const match = line.match(COUNT_LINE);
    if (match && counts) counts[match[1]] = Number(match[2]);
  }
  const worst = (list, found, hit) =>
    list
      .map((c) => ({ total: c[found], covered: c[hit] }))
      .reduce((a, b) => {
        const gap = b.total - b.covered - (a.total - a.covered);
        return gap > 0 || (gap === 0 && b.total < a.total) ? b : a;
      });
  const result = new Map();
  for (const [file, list] of records) {
    result.set(file, {
      lines: worst(list, 'LF', 'LH'),
      branches: worst(list, 'BRF', 'BRH'),
      functions: worst(list, 'FNF', 'FNH'),
    });
  }
  return result;
}

function physicalLines(text) {
  if (text === '') return 0;
  return text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length;
}

/**
 * Number of code lines in an HTML file: the non-blank lines of each inline script
 * element, and one line for each event handler attribute and each script URL.
 */
export function inlineScriptLines(html) {
  let count = 0;
  const outside = html.replace(SCRIPT_ELEMENT, (element, attributes, code) => {
    if (!SRC_ATTRIBUTE.test(attributes.replace(QUOTED_VALUE, '""'))) {
      count += code.split('\n').filter((line) => line.trim() !== '').length;
    }
    return '';
  });
  count += (outside.match(HANDLER_ATTRIBUTE) || []).length;
  count += (outside.match(SCRIPT_URL) || []).length;
  return count;
}

/**
 * Find code files that import or require a test file.
 *
 * @returns {object[]} One error for each line with such an import.
 */
export function findTestImports({ inventory, readFile }) {
  const errors = [];
  for (const file of inventory) {
    readFile(file)
      .split('\n')
      .forEach((line, index) => {
        if (!TEST_IMPORT.test(line)) return;
        errors.push({ code: 'COVERAGE-TEST-IMPORT', file, line: index + 1, message: 'Move the code out of the test file. The gates do not measure test files.' });
      });
  }
  return errors;
}

/**
 * Files with untrue coverage: files with a guard error, and files in the coverage report that no guard checked.
 *
 * @param {object} input
 * @param {Map<string, object>} input.entries - Result of parseLcov.
 * @param {string[]} input.inventory - Code files.
 * @param {Set<string>} input.checked - Files that a guard checked.
 * @param {Set<string>} input.violations - Files with a guard error.
 * @returns {Set<string>}
 */
export function untrueFiles({ entries, inventory, checked, violations }) {
  const untrue = new Set(violations);
  for (const file of inventory) {
    if (entries.has(file) && !checked.has(file)) untrue.add(file);
  }
  return untrue;
}

/** SHA-256 hash of a file content. */
export function contentHash(text) {
  return createHash('sha256').update(text).digest('hex');
}

function notLoaded(file, sha, total, untrue = false) {
  return { file, sha, untrue, loaded: false, complete: false, lines: { total, uncovered: total }, branches: null, functions: null };
}

/**
 * Make the coverage record for each file in the inventory.
 *
 * @param {object} input
 * @param {string[]} input.inventory - Code files.
 * @param {Map<string, object>} input.entries - Result of parseLcov.
 * @param {(file: string) => string} input.readFile - Reads a code file.
 * @param {Set<string>} [input.untrue] - Files with code that ran under their name with other source.
 * @returns {object[]}
 */
export function measureCoverage({ inventory, entries, readFile, untrue = new Set() }) {
  return inventory.map((file) => {
    const text = readFile(file);
    const sha = contentHash(text);
    if (untrue.has(file)) return notLoaded(file, sha, physicalLines(text), true);
    if (file.endsWith('.html')) {
      const total = inlineScriptLines(text);
      if (total === 0) {
        return { file, sha, untrue: false, loaded: false, complete: true, lines: { total: 0, uncovered: 0 }, branches: null, functions: null };
      }
      return notLoaded(file, sha, total);
    }
    const entry = file.endsWith('.sh') ? undefined : entries.get(file);
    if (!entry) return notLoaded(file, sha, physicalLines(text));
    const gap = ({ total, covered }) => ({ total, uncovered: total - covered });
    const lines = gap(entry.lines);
    const branches = gap(entry.branches);
    const functions = gap(entry.functions);
    return {
      file,
      sha,
      untrue: false,
      loaded: true,
      complete: lines.uncovered === 0 && branches.uncovered === 0 && functions.uncovered === 0,
      lines,
      branches,
      functions,
    };
  });
}

/**
 * Find comments that tell a coverage tool to ignore code.
 *
 * @returns {object[]} One error for each comment.
 */
export function findIgnoreComments({ inventory, readFile }) {
  const errors = [];
  for (const file of inventory) {
    readFile(file)
      .split('\n')
      .forEach((line, index) => {
        if (!IGNORE_COMMENT.test(line)) return;
        errors.push({ code: 'COVERAGE-IGNORE', file, line: index + 1, message: 'Remove the coverage ignore comment and test the code' });
      });
  }
  return errors;
}

/**
 * Find node:test coverage filter options outside the gate command.
 *
 * @returns {object[]} One error for each line with an option.
 */
export function findCoverageFlags({ tracked, readFile }) {
  const errors = [];
  for (const file of tracked) {
    if (!FLAG_SCAN_FILE.test(file) || FLAG_ALLOWED.has(file)) continue;
    readFile(file)
      .split('\n')
      .forEach((line, index) => {
        if (!COVERAGE_FLAG.test(line)) return;
        errors.push({ code: 'COVERAGE-FLAG', file, line: index + 1, message: 'Remove the coverage filter option. Only scripts/spec/gates.mjs can set it.' });
      });
  }
  return errors;
}
