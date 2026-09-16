import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REGISTRY_FILE = 'openspec/trace/ids.json';
const LINKS_FILE = 'openspec/trace/links.json';

function readJson(root, file) {
  const absolute = path.join(root, file);
  return existsSync(absolute) ? JSON.parse(readFileSync(absolute, 'utf8')) : null;
}

function writeSortedJson(root, file, object) {
  const absolute = path.join(root, file);
  mkdirSync(path.dirname(absolute), { recursive: true });
  const sorted = Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]));
  writeFileSync(absolute, `${JSON.stringify(sorted, null, 2)}\n`);
  return sorted;
}

/** Read `openspec/trace/ids.json`. */
export function readRegistry(root) {
  return readJson(root, REGISTRY_FILE) ?? {};
}

/** Write `openspec/trace/ids.json` with sorted keys. */
export function writeRegistry(root, registry) {
  return writeSortedJson(root, REGISTRY_FILE, registry);
}

/** Read `openspec/trace/links.json`. */
export function readLinks(root) {
  return readJson(root, LINKS_FILE) ?? {};
}

/** Write `openspec/trace/links.json` with sorted keys. */
export function writeLinks(root, links) {
  return writeSortedJson(root, LINKS_FILE, links);
}

/**
 * Compare the scenarios with the ID registry.
 *
 * @returns {object[]} Errors.
 */
export function checkRegistry({ registry, scenarios, retired }) {
  const errors = [];
  for (const scenario of scenarios.values()) {
    const entry = registry[scenario.id];
    const at = { file: scenario.file, line: scenario.line };
    if (!entry) {
      errors.push({ code: 'TRACE-ID-UNREGISTERED', ...at, message: `Scenario ID ${scenario.id} is not in ${REGISTRY_FILE}. Run the ratchet command.` });
    } else if (entry.hash !== scenario.hash) {
      errors.push({ code: 'TRACE-ID-CHANGED', ...at, message: `The text of scenario ${scenario.id} does not match ${REGISTRY_FILE}. Run the ratchet command.` });
    }
  }
  for (const id of Object.keys(registry).sort()) {
    if (scenarios.has(id) || retired.has(id)) continue;
    errors.push({ code: 'TRACE-ID-DROPPED', file: REGISTRY_FILE, message: `Scenario ID ${id} has no scenario and is not retired` });
  }
  return errors;
}

/**
 * Make the registry agree with the scenarios. A changed text needs a changed test with a tag that names the ID.
 *
 * @returns {{registry: object, errors: object[]}}
 */
export function updateRegistry({ registry, scenarios, retired, changedTestIds, change, date }) {
  const errors = [];
  const next = {};
  for (const scenario of scenarios.values()) {
    const entry = registry[scenario.id];
    if (!entry) {
      next[scenario.id] = { hash: scenario.hash, since: date, change };
    } else if (entry.hash === scenario.hash) {
      next[scenario.id] = entry;
    } else if (changedTestIds.has(scenario.id)) {
      next[scenario.id] = { ...entry, hash: scenario.hash };
    } else {
      next[scenario.id] = entry;
      errors.push({
        code: 'TRACE-ID-CHANGED-NO-TEST',
        file: scenario.file,
        line: scenario.line,
        message: `The text of scenario ${scenario.id} changed, but no changed test with a tag names the ID`,
      });
    }
  }
  for (const id of Object.keys(registry)) {
    if (scenarios.has(id) || retired.has(id)) continue;
    next[id] = registry[id];
    errors.push({ code: 'TRACE-ID-DROPPED', file: REGISTRY_FILE, message: `Scenario ID ${id} has no scenario and is not retired` });
  }
  return { registry: next, errors };
}

/**
 * Compare the registry with the registry of the base commit.
 *
 * @param {object} input
 * @param {object|null} input.baseRegistry - The base registry, or null when the base has none.
 * @param {Set<string>} input.changedTestIds - IDs in the tags of changed tests.
 * @returns {object[]} Errors.
 */
export function compareRegistryWithBase({ registry, baseRegistry, retired, changedTestIds }) {
  if (baseRegistry === null) return [];
  const errors = [];
  for (const [id, base] of Object.entries(baseRegistry)) {
    const entry = registry[id];
    if (!entry) {
      if (!retired.has(id)) errors.push({ code: 'TRACE-ID-BASE-DROPPED', file: REGISTRY_FILE, message: `The base registry has ${id}, but the registry does not have it and it is not retired` });
    } else if (entry.hash !== base.hash && !changedTestIds.has(id)) {
      errors.push({ code: 'TRACE-ID-BASE-CHANGED', file: REGISTRY_FILE, message: `The hash of ${id} is not the base hash, but no changed test with a tag names the ID` });
    }
  }
  return errors;
}

const REGEX_BEFORE = '(,=:[!&|?{};';

/**
 * The line that closes a test call, or null when the scan cannot find it. The scan
 * starts at the line and the column of the call. It skips strings, template
 * literals, comments and regular expressions.
 *
 * @param {string[]} lines - The lines of the test file.
 * @param {number} line - The first line of the test call, from 1.
 * @param {number} column - The column of the test call, from 1.
 * @returns {number|null}
 */
export function testCallEnd(lines, line, column) {
  let depth = 0;
  let state = null;
  let previous = '';
  for (let row = line - 1; row < lines.length; row += 1) {
    const text = lines[row];
    for (let col = row === line - 1 ? column - 1 : 0; col < text.length; col += 1) {
      const char = text[col];
      const next = text[col + 1];
      if (state === 'block') {
        if (char === '*' && next === '/') {
          state = null;
          col += 1;
        }
        continue;
      }
      if (state !== null) {
        if (char === '\\') col += 1;
        else if (char === state) {
          state = null;
          previous = char;
        }
        continue;
      }
      if (char === '/' && next === '/') break;
      if (char === '/' && next === '*') {
        state = 'block';
        col += 1;
        continue;
      }
      if (char === "'" || char === '"' || char === '`') {
        state = char;
        continue;
      }
      if (char === '/' && REGEX_BEFORE.includes(previous)) {
        state = '/';
        continue;
      }
      if (char === '(') depth += 1;
      if (char === ')') {
        depth -= 1;
        if (depth === 0) return row + 1;
      }
      if (char.trim()) previous = char;
    }
    if (state !== 'block' && state !== '`') state = null;
  }
  return null;
}

/** Remove the spaces at the end of each line. */
export function withoutLineEndSpaces(text) {
  return text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
}

/**
 * Scenario IDs in the tags of the changed tests. The text of a test starts at its
 * first line and stops at the line that closes the test call. When the scan cannot
 * find that line, the text stops before the next test in its file, or at the end of
 * the file. A test changed when no test file of the base contains that text.
 *
 * @param {object} input
 * @param {object[]} input.records - Records from the trace reporter.
 * @param {string[]} input.files - Test files that changed against the base.
 * @param {(file: string) => string} input.readFile - Reads the current file.
 * @param {() => string[]} input.readBaseTests - Reads the text of each test file of the base.
 * @returns {Set<string>}
 */
export function idsOfChangedTests({ records, files, readFile, readBaseTests }) {
  const ids = new Set();
  let baseTests = null;
  for (const file of files) {
    const inFile = records.filter((item) => item.file === file && Number.isInteger(item.line));
    const starts = [...new Set(inFile.map((item) => item.line))].sort((a, b) => a - b);
    const lines = readFile(file).split('\n');
    for (const item of inFile.filter((record) => record.tags.length > 0)) {
      const next = starts.find((line) => line > item.line);
      const end = testCallEnd(lines, item.line, item.column ?? 1) ?? (next === undefined ? lines.length : next - 1);
      const text = withoutLineEndSpaces(lines.slice(item.line - 1, end).join('\n')).trimEnd();
      baseTests ??= readBaseTests().map(withoutLineEndSpaces);
      if (!baseTests.some((base) => base.includes(text))) item.tags.forEach((id) => ids.add(id));
    }
  }
  return ids;
}

/** Links from each scenario ID to the tests that verify it, from the trace report. */
export function buildLinks(report) {
  return Object.fromEntries(report.scenarios.map((scenario) => [scenario.id, scenario.tests]));
}

/** Compare the links of the test run with `openspec/trace/links.json`. */
export function checkLinks({ links, current }) {
  const ids = [...new Set([...Object.keys(links), ...Object.keys(current)])].sort();
  const different = ids.filter((id) => JSON.stringify(links[id] ?? null) !== JSON.stringify(current[id] ?? null));
  if (different.length === 0) return [];
  return [
    {
      code: 'TRACE-LINKS-STALE',
      file: LINKS_FILE,
      message: `${different.length} scenario links are not current (first: ${different[0]}). Run the ratchet command.`,
    },
  ];
}
