import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseTags } from './trace-reporter.mjs';

/** Key for the assertion count of one test. */
export function assertionKey(file, fullName) {
  return `${file}\0${fullName}`;
}

function testError(code, item, message) {
  return { code, file: item.file, message: `Test "${item.fullName}" ${message}` };
}

/**
 * Link the test results to the spec scenarios and find the trace errors.
 *
 * @param {object} input
 * @param {{scenarios: Map<string, object>, mainIds: Set<string>, retired: Set<string>}} input.specs
 * @param {object[]} input.records - Records from the trace reporter.
 * @param {Map<string, number>} input.assertions - Assertion count for each test, by assertionKey.
 * @param {string[]} [input.testFiles] - Test files that the gate ran.
 * @param {string} [input.change] - Name of the change that must be complete.
 * @param {boolean} [input.changeFound] - False when no change has that name.
 */
export function evaluateTrace({ specs, records, assertions, testFiles = [], change, changeFound = true }) {
  const errors = [];
  const untraced = [];
  const verified = new Map();

  if (change && !changeFound) {
    errors.push({ code: 'TRACE-UNKNOWN-CHANGE', file: 'openspec/changes', message: `No active or archived change has the name ${change}` });
  }

  for (const item of records) {
    const parsed = parseTags(item.name);
    const name = String(item.name);
    const nameAgrees = item.fullName === name || String(item.fullName).endsWith(` > ${name}`);
    if (!nameAgrees || parsed.error !== item.tagError || parsed.tags.join(' ') !== item.tags.join(' ')) {
      errors.push(testError('TRACE-RECORD-NAME', item, 'has a result record with tags or a full name that do not agree with its name'));
    }
    if (item.status === 'fail') errors.push(testError('TRACE-FAILED-TEST', item, 'failed'));
    if (!item.file.endsWith('.test.mjs')) {
      errors.push(testError('TRACE-OUTSIDE-TEST-FILE', item, 'is not in a file that ends with .test.mjs'));
    }
    if (item.tagError === 'bad') errors.push(testError('TRACE-BAD-TAG', item, 'has a tag with a bad format'));
    if (item.tagError === 'too-many') errors.push(testError('TRACE-TOO-MANY-TAGS', item, 'has more than three IDs in its tag'));
    if (item.tags.length > 0 && item.kind === 'suite') {
      errors.push(testError('TRACE-SUITE-TAG', item, 'is a suite with a tag. Put the tag on each leaf test.'));
    }
    if (item.tags.length > 0 && item.kind === 'test' && !item.leaf) {
      errors.push(testError('TRACE-PARENT-TAG', item, 'has subtests and a tag. Put the tag on each leaf test.'));
    }
  }

  const leaves = records.filter((item) => item.kind === 'test' && item.leaf);
  const tagged = new Set();
  for (const item of leaves.filter((leaf) => leaf.tags.length > 0)) {
    const key = assertionKey(item.file, item.fullName);
    if (tagged.has(key)) errors.push(testError('TRACE-DUPLICATE-NAME', item, 'has a tag and the same full name as another test in its file'));
    tagged.add(key);
  }
  for (const item of leaves) {
    if (item.tags.length === 0) {
      if (item.tagError !== 'bad') untraced.push({ file: item.file, name: item.fullName });
      continue;
    }
    if (item.status === 'skip') errors.push(testError('TRACE-SKIPPED-TAG', item, 'is skipped and has a tag'));
    const count = assertions.get(assertionKey(item.file, item.fullName)) ?? 0;
    const passed = item.status === 'pass';
    if (passed && count === 0) {
      errors.push(testError('TRACE-NO-ASSERTION', item, 'has a tag but calls no node:assert function'));
    }
    for (const id of item.tags) {
      if (specs.retired.has(id)) {
        errors.push(testError('TRACE-RETIRED-ID', item, `names ${id}, but this ID is retired`));
      } else if (!specs.scenarios.has(id)) {
        errors.push(testError('TRACE-UNKNOWN-ID', item, `names ${id}, but no spec contains this ID`));
      } else if (passed && count > 0) {
        const names = verified.get(id) || [];
        names.push(`${item.file} › ${item.fullName}`);
        verified.set(id, names);
      }
    }
  }

  const filesWithTests = new Set(records.map((item) => item.file));
  for (const file of testFiles) {
    if (!filesWithTests.has(file)) {
      errors.push({ code: 'TRACE-EMPTY-TEST-FILE', file, message: `${file} reports no tests` });
    }
  }

  const pending = [];
  const scenarios = [...specs.scenarios.values()].sort((a, b) => a.id.localeCompare(b.id));
  for (const scenario of scenarios) {
    if (verified.has(scenario.id)) continue;
    const required = specs.mainIds.has(scenario.id) || scenario.source === `change:${change}`;
    if (!required) {
      pending.push(scenario.id);
      continue;
    }
    errors.push({
      code: 'TRACE-UNVERIFIED',
      file: scenario.file,
      line: scenario.line,
      message: `Scenario ${scenario.id} has no passing test with an assertion`,
    });
  }

  const report = {
    counts: {
      scenarios: scenarios.length,
      verified: scenarios.filter((item) => verified.has(item.id)).length,
      pending: pending.length,
      tests: leaves.length,
      traced: leaves.filter((item) => item.tags.length > 0).length,
      untraced: untraced.length,
    },
    scenarios: scenarios.map((item) => ({
      id: item.id,
      capability: item.capability,
      requirement: item.requirement,
      name: item.name,
      origin: item.origin,
      source: item.source,
      file: item.file,
      line: item.line,
      tests: (verified.get(item.id) || []).sort(),
    })),
    untraced,
    pending,
  };

  return { errors, untraced, pending, report };
}

/**
 * Write the trace report to `.gev-cache/spec/trace-report.json`.
 *
 * @returns {string} Path of the report file.
 */
export function writeTraceReport(root, report) {
  const file = path.join(root, '.gev-cache', 'spec', 'trace-report.json');
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  return file;
}
