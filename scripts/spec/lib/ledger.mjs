import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const LEDGER_FILE = 'openspec/trace/gaps.json';
export const HISTORY_FILE = 'openspec/trace/history.jsonl';
export const RETIRED_FILE = 'openspec/trace/retired-ids.json';
const METRICS = ['lines', 'branches', 'functions'];
const VERSION = 4;
// The tolerance of a metric: 8, or 4% of the total of that metric when that is less.
const TOLERANCE_MAX = 8;
const TOLERANCE_PART = 0.04;

function sortedObject(object) {
  return Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]));
}

/** The total line, branch and function counts of a coverage record. */
function totalsOf(record) {
  return { lines: record.lines.total, branches: record.branches ? record.branches.total : null, functions: record.functions ? record.functions.total : null };
}

/**
 * The tolerance of one metric: 8, or 4% of the total of that metric when that is less.
 * The fraction of the percent goes away, so a file below 25 of a metric gets no tolerance.
 * A total that is not a number gives no tolerance.
 *
 * @param {number|null|undefined} total - The total count of the metric.
 * @returns {number}
 */
export function toleranceOf(total) {
  if (!Number.isInteger(total) || total < 0) return 0;
  return Math.min(TOLERANCE_MAX, Math.floor(total * TOLERANCE_PART));
}

/** The covered count of a metric: the total minus the not-covered count. Null without a total. */
function coveredCount(item, metric) {
  if (!item.totals || item.totals[metric] === null || item.totals[metric] === undefined || item[metric] === null) return null;
  return item.totals[metric] - item[metric];
}

/**
 * The loss of a metric of an unchanged file: the smaller of the increase of the not-covered
 * count and the decrease of the covered count. A run can give another total for the same
 * file, and that moves one of the two counts only. A fall of the not-covered count never
 * hides a fall of the covered count, so the loss is then only the fall of the covered count.
 * Null without a covered count.
 */
function lossOf(entry, gap, metric) {
  const before = coveredCount(entry, metric);
  const now = coveredCount(gap, metric);
  if (before === null || now === null) return null;
  const fall = before - now;
  return gap[metric] >= entry[metric] ? Math.min(gap[metric] - entry[metric], fall) : fall;
}

/**
 * Reduce the measurements to the current gaps.
 *
 * @param {{coverage: object[], untraced: {file: string, name: string}[]}} input
 * @returns {{coverage: Map<string, object>, untraced: Map<string, Map<string, number>>, hashes: Map<string, string>}}
 */
export function currentGaps({ coverage, untraced }) {
  const coverageGaps = new Map();
  const hashes = new Map();
  for (const record of coverage) {
    hashes.set(record.file, record.sha);
    if (record.complete) continue;
    coverageGaps.set(record.file, {
      loaded: record.loaded,
      lines: record.lines.uncovered,
      branches: record.branches ? record.branches.uncovered : null,
      functions: record.functions ? record.functions.uncovered : null,
      totals: totalsOf(record),
      sha: record.sha,
      untrue: Boolean(record.untrue),
    });
  }
  const untracedGaps = new Map();
  for (const test of untraced) {
    const names = untracedGaps.get(test.file) || new Map();
    names.set(test.name, (names.get(test.name) || 0) + 1);
    untracedGaps.set(test.file, names);
  }
  return { coverage: coverageGaps, untraced: untracedGaps, hashes };
}

/** Parse ledger text, or null for null text. */
export function parseLedger(text) {
  return text === null ? null : JSON.parse(text);
}

/** Read `openspec/trace/gaps.json`, or null when it does not exist. */
export function readLedger(root) {
  const file = path.join(root, LEDGER_FILE);
  return existsSync(file) ? parseLedger(readFileSync(file, 'utf8')) : null;
}

/** Write the ledger with sorted keys. */
export function writeLedger(root, ledger) {
  const file = path.join(root, LEDGER_FILE);
  mkdirSync(path.dirname(file), { recursive: true });
  const sorted = {
    version: VERSION,
    coverage: sortedObject(ledger.coverage),
    untracedTests: sortedObject(
      Object.fromEntries(Object.entries(ledger.untracedTests).map(([key, entry]) => [key, { ...entry, names: sortedObject(entry.names) }])),
    ),
  };
  writeFileSync(file, `${JSON.stringify(sorted, null, 2)}\n`);
  return sorted;
}

/** Add history lines to `openspec/trace/history.jsonl`. */
export function appendHistory(root, lines) {
  if (lines.length === 0) return;
  const file = path.join(root, HISTORY_FILE);
  mkdirSync(path.dirname(file), { recursive: true });
  appendFileSync(file, lines.map((line) => `${JSON.stringify(line)}\n`).join(''));
}

/**
 * Make the first ledger.
 *
 * @param {object} input
 * @param {Set<string>} input.baseFiles - Files of the base commit.
 * @param {boolean} input.baseHasLedger - True when the base commit has a ledger.
 * @returns {object} The ledger that was written.
 */
export function initLedger({ root, current, date, baseHasLedger, baseFiles }) {
  if (existsSync(path.join(root, LEDGER_FILE))) {
    throw new Error(`${LEDGER_FILE} exists. The init command does not replace it.`);
  }
  if (baseHasLedger) {
    throw new Error(`The base commit has ${LEDGER_FILE}. The init command runs only one time for a project.`);
  }
  const newFiles = [...current.coverage.keys(), ...current.untraced.keys()].filter((file) => !baseFiles.has(file));
  if (newFiles.length > 0) {
    throw new Error(`These files have gaps but are not in the base commit, so they are not pre-spec: ${newFiles.join(', ')}`);
  }
  const origin = { origin: 'pre-spec', since: date };
  const coverage = {};
  for (const [file, gap] of current.coverage) coverage[file] = { ...gap, ...origin };
  const untracedTests = {};
  for (const [file, names] of current.untraced) {
    untracedTests[file] = { names: Object.fromEntries(names), ...origin };
  }
  return writeLedger(root, { coverage, untracedTests });
}

function describeGap(file, gap) {
  if (!gap.loaded) return `no test loads ${file}`;
  return `${file} is not at 100%: ${gap.lines} lines, ${gap.branches} branches, ${gap.functions} functions not covered`;
}

function hasTotals(entry) {
  return Boolean(entry.totals) && METRICS.every((metric) => Number.isInteger(entry.totals[metric]));
}

function sameGap(entry, gap) {
  return (
    entry.loaded === gap.loaded &&
    entry.sha === gap.sha &&
    Boolean(entry.untrue) === gap.untrue &&
    JSON.stringify(entry.totals ?? null) === JSON.stringify(gap.totals) &&
    METRICS.every((metric) => entry[metric] === gap[metric])
  );
}

/**
 * True for a file with the tolerance conditions: a loaded code file with true coverage,
 * the content of the base commit and the content hash of its ledger entry.
 */
function hasTolerance(file, entry, gap, sameAsBase) {
  return sameAsBase(file) && gap.sha === entry.sha && entry.loaded && gap.loaded && !entry.untrue && !gap.untrue;
}

/**
 * The tolerance of each metric, from the measured total counts of the file. The measurement
 * gives the real total, and the entry records the same number for a file that no change edits.
 */
function gapTolerance(gap) {
  return (metric) => toleranceOf(gap.totals[metric]);
}

/**
 * The counts that the ratchet command writes for a file with the tolerance conditions. It never
 * writes a worse count: it writes the smaller not-covered line count, and for branches and
 * functions it keeps the entry counts when the covered count is smaller than in the entry.
 */
function toleranceCounts(entry, gap) {
  const next = { ...gap, lines: Math.min(entry.lines, gap.lines), totals: { ...gap.totals } };
  for (const metric of ['branches', 'functions']) {
    const before = coveredCount(entry, metric);
    const now = coveredCount(gap, metric);
    const keep = before === null || now === null ? gap[metric] > entry[metric] : now < before;
    if (!keep) continue;
    next[metric] = entry[metric];
    next.totals[metric] = entry.totals ? entry.totals[metric] : gap.totals[metric];
  }
  return next;
}

function compareCoverageEntry(file, entry, gap, tolerance = () => 0) {
  const errors = [];
  const error = (code, message) => errors.push({ code, file, message });
  if (gap.untrue && !entry.untrue) {
    error('COVERAGE-FAKE', `A test ran code under the name ${file}, but the code is not the file content`);
  }
  if (entry.loaded && !gap.loaded && !gap.untrue) {
    error('LEDGER-UNLOADED', `No test loads ${file} now. The ledger records it as loaded.`);
  }
  const changed = gap.sha !== entry.sha;
  const allowed = (metric) => entry[metric];
  if (gap.lines > allowed('lines') + tolerance('lines')) {
    error('LEDGER-LARGER-GAP', `${file} has ${gap.lines} lines not covered. The ledger allows ${allowed('lines') + tolerance('lines')}.`);
  }
  if (changed && !entry.loaded && gap.loaded) {
    error('LEDGER-NO-BASELINE', `${file} changed in the same change that first loads it. Load it in one change and edit it in a later change.`);
  } else if (changed && entry.loaded && gap.loaded) {
    for (const metric of ['branches', 'functions']) {
      if (gap[metric] > allowed(metric)) {
        error('LEDGER-LARGER-GAP', `${file} has ${gap[metric]} ${metric} not covered. The ledger allows ${allowed(metric)}.`);
      }
    }
  } else if (entry.loaded && gap.loaded) {
    for (const metric of ['branches', 'functions']) {
      const loss = lossOf(entry, gap, metric);
      if (loss !== null && loss > tolerance(metric)) {
        error('LEDGER-LOST-COVERAGE', `${file} has ${gap[metric]} ${metric} not covered and ${coveredCount(gap, metric)} covered. The ledger records ${entry[metric]} and ${coveredCount(entry, metric)}.`);
      }
    }
  }
  return errors;
}

/**
 * Compare the current gaps with the ledger. A file with the tolerance conditions is a loaded code
 * file with true coverage that has the content of the base commit and of its entry. Its not-covered
 * line count can be above the entry by at most the tolerance. The loss of its covered branches and
 * of its covered functions can be at most the tolerance. The gate does not record the entry of
 * such a file as not current for a smaller gap. See the requirement "Count tolerance".
 *
 * @param {object} input
 * @param {(file: string) => boolean} [input.sameAsBase] - True for a file with the content of the base.
 * @returns {{errors: object[], stale: object[]}}
 */
export function compareLedger({ ledger, current, sameAsBase = () => false }) {
  const errors = [];
  const stale = [];
  if (ledger.version !== VERSION) {
    errors.push({ code: 'LEDGER-VERSION', file: LEDGER_FILE, message: `${LEDGER_FILE} has the version ${ledger.version}. The gates need the version ${VERSION}.` });
  }
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    if (entry.loaded && !hasTotals(entry)) {
      errors.push({ code: 'LEDGER-NO-TOTALS', file, message: `The ledger entry for ${file} has no total line, branch and function counts. Run the ratchet command.` });
    }
  }
  for (const [file, gap] of current.coverage) {
    const entry = ledger.coverage[file];
    if (!entry) {
      errors.push({ code: 'LEDGER-NEW-COVERAGE-GAP', file, message: describeGap(file, gap) });
      if (gap.untrue) {
        errors.push({ code: 'COVERAGE-FAKE', file, message: `A test ran code under the name ${file}, but the code is not the file content` });
      }
      continue;
    }
    // The counts of a file can be different in each run, so they can move inside the tolerance.
    const tolerant = hasTolerance(file, entry, gap, sameAsBase);
    const entryErrors = compareCoverageEntry(file, entry, gap, tolerant ? gapTolerance(gap) : undefined);
    errors.push(...entryErrors);
    if (entryErrors.length === 0 && !sameGap(entry, gap) && !tolerant) stale.push({ kind: 'coverage', file });
  }
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    if (current.coverage.has(file)) continue;
    const complete = { loaded: true, untrue: false, sha: current.hashes.get(file) };
    if (!hasTolerance(file, entry, complete, sameAsBase)) stale.push({ kind: 'coverage', file });
  }

  for (const [file, names] of current.untraced) {
    const entry = ledger.untracedTests[file];
    if (!entry) {
      errors.push({ code: 'LEDGER-NEW-UNTRACED', file, message: `${file} has ${names.size} untraced test names` });
      continue;
    }
    const added = [...names].filter(([name, count]) => count > (entry.names[name] || 0));
    for (const [name] of added) {
      errors.push({ code: 'LEDGER-NEW-UNTRACED-NAME', file, message: `Untraced test "${name}" is not in the ledger` });
    }
    const smaller = Object.entries(entry.names).some(([name, count]) => (names.get(name) || 0) < count);
    if (added.length === 0 && smaller) stale.push({ kind: 'untraced', file });
  }
  for (const file of Object.keys(ledger.untracedTests)) {
    if (!current.untraced.has(file)) stale.push({ kind: 'untraced', file });
  }

  if (stale.length > 0) {
    errors.push({
      code: 'LEDGER-STALE',
      file: LEDGER_FILE,
      message: `${stale.length} ledger entries do not match the current gaps (first: ${stale[0].file}). Run the ratchet command.`,
    });
  }
  return { errors, stale };
}

/**
 * Compare the ledger files with the same files in the base commit.
 *
 * @param {object} input
 * @param {string} [input.change] - The checked change. A changed total count needs a history line with this name.
 * @returns {object[]} Errors.
 */
export function compareWithBase({ ledger, baseLedger, retired, baseRetired, history, baseHistory, sameAsBase = () => false, change }) {
  if (baseLedger === null) return [];
  if (ledger === null) {
    return [{ code: 'LEDGER-REMOVED', file: LEDGER_FILE, message: `The base commit has ${LEDGER_FILE}, but the current tree does not` }];
  }
  const errors = [];
  const error = (code, file, message) => errors.push({ code, file, message });
  const changeLines = (history.startsWith(baseHistory) ? history.slice(baseHistory.length) : '')
    .split('\n')
    .filter((line) => line.startsWith('{'))
    .map((line) => JSON.parse(line))
    .filter((line) => Boolean(change) && line.change === change);
  const totalsHistory = new Set(changeLines.filter((line) => line.metric === 'totals').map((line) => line.file));
  const moreThan = (entry, base, metric) => entry[metric] !== null && base[metric] !== null && entry[metric] > base[metric];
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    const base = baseLedger.coverage[file];
    if (!base) {
      error('LEDGER-NOT-IN-BASE', file, `The ledger entry for ${file} is not in the base ledger`);
      continue;
    }
    const unchanged = sameAsBase(file);
    const baseAllowed = base;
    if (entry.lines > baseAllowed.lines) {
      error('LEDGER-LARGER-THAN-BASE', file, `The ledger allows ${entry.lines} lines for ${file}. The base ledger allows ${baseAllowed.lines}.`);
    }
    if (entry.untrue && !base.untrue) {
      error('LEDGER-UNTRUE-NOT-IN-BASE', file, `The ledger records untrue coverage for ${file}, but the base ledger does not`);
    }
    if (unchanged && entry.sha !== base.sha) {
      error('LEDGER-HASH-NOT-BASE', file, `The content of ${file} is the base content, but its ledger hash is not the base hash`);
    }
    if (unchanged && JSON.stringify(entry.totals ?? null) !== JSON.stringify(base.totals ?? null) && !totalsHistory.has(file)) {
      error('LEDGER-TOTALS-NOT-BASE', file, `The total counts of ${file} are not the base total counts, but the history has no totals line for it from the change ${change}`);
    }
    for (const metric of ['branches', 'functions']) {
      if (!moreThan(entry, baseAllowed, metric)) continue;
      const covered = coveredCount(entry, metric);
      const baseCovered = coveredCount(base, metric);
      if (!unchanged) {
        error('LEDGER-MORE-THAN-BASE', file, `${file} changed, and the ledger allows ${entry[metric]} ${metric}. The base ledger allows ${baseAllowed[metric]}.`);
      } else if (covered === null || baseCovered === null || covered < baseCovered) {
        error('LEDGER-MORE-THAN-BASE', file, `The ledger allows ${entry[metric]} ${metric} for ${file} with ${covered} covered ${metric}. The base ledger allows ${base[metric]} with ${baseCovered} covered.`);
      }
    }
  }
  for (const [file, entry] of Object.entries(ledger.untracedTests)) {
    const base = baseLedger.untracedTests[file];
    const extra = Object.entries(entry.names).filter(([name, count]) => !base || count > (base.names[name] || 0));
    for (const [name] of extra) {
      error('LEDGER-NOT-IN-BASE', file, `Untraced test "${name}" is not in the base ledger`);
    }
  }
  const current = new Set(retired);
  for (const id of baseRetired) {
    if (!current.has(id)) error('LEDGER-RETIRED-REMOVED', RETIRED_FILE, `The retired ID ${id} is in the base but not in the current file`);
  }
  if (!history.startsWith(baseHistory)) {
    error('LEDGER-HISTORY-CHANGED', HISTORY_FILE, `${HISTORY_FILE} does not start with the content of the base file`);
  }
  return errors;
}

function sum(names) {
  return Object.values(names).reduce((total, count) => total + count, 0);
}

/**
 * Record the current gaps in the ledger. Stops when a gap is larger.
 *
 * @returns {{ledger: object, history: object[]}}
 */
export function ratchetLedger({ ledger, current, inventory, testFiles, change, changeActive, date, commit, sameAsBase = () => false }) {
  if (!change) throw new Error('The ratchet command needs --change <name>');
  if (!changeActive) throw new Error(`Change "${change}" has no folder with a proposal.md file in openspec/changes`);
  // The ratchet command writes the version and the total counts again, so these are not blocking.
  const RATCHET_FIXES = new Set(['LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION']);
  const blocking = compareLedger({ ledger, current, sameAsBase }).errors.filter((error) => !RATCHET_FIXES.has(error.code));
  if (blocking.length > 0) {
    throw new Error(`The ratchet command cannot run while gaps are larger:\n${blocking.map((error) => `${error.code} ${error.message}`).join('\n')}`);
  }

  const history = [];
  const record = (kind, file, metric, before, after, reason) => history.push({ date, change, commit, kind, file, metric, before, after, reason });
  const codeFiles = new Set(inventory);
  const tests = new Set(testFiles);

  const coverage = {};
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    const gap = current.coverage.get(file);
    if (!codeFiles.has(file)) {
      record('coverage', file, 'lines', entry.lines, 0, 'file removed');
      continue;
    }
    if (!gap) {
      record('coverage', file, 'lines', entry.lines, 0, 'closed');
      continue;
    }
    const tolerant = hasTolerance(file, entry, gap, sameAsBase);
    const next = { ...(tolerant ? toleranceCounts(entry, gap) : gap), origin: entry.origin, since: entry.since };
    if (next.lines < entry.lines) record('coverage', file, 'lines', entry.lines, next.lines, 'smaller');
    if (!entry.loaded && gap.loaded) record('coverage', file, 'loaded', false, true, 'loaded');
    if (entry.untrue && !gap.untrue) record('coverage', file, 'untrue', true, false, 'true coverage');
    for (const metric of ['branches', 'functions']) {
      if (entry[metric] === null || next[metric] === null || entry[metric] === next[metric]) continue;
      record('coverage', file, metric, entry[metric], next[metric], next[metric] > entry[metric] ? 'shown by test' : 'smaller');
    }
    if (gap.sha !== entry.sha) record('coverage', file, 'hash', entry.sha, gap.sha, 'content changed');
    if (JSON.stringify(entry.totals ?? null) !== JSON.stringify(next.totals)) record('coverage', file, 'totals', entry.totals ?? null, next.totals, 'totals changed');
    coverage[file] = next;
  }

  const untracedTests = {};
  for (const [file, entry] of Object.entries(ledger.untracedTests)) {
    const names = current.untraced.get(file);
    if (!tests.has(file)) {
      record('untraced', file, 'count', sum(entry.names), 0, 'file removed');
    } else if (!names) {
      record('untraced', file, 'count', sum(entry.names), 0, 'closed');
    } else {
      const next = Object.fromEntries(names);
      if (sum(next) < sum(entry.names)) record('untraced', file, 'count', sum(entry.names), sum(next), 'smaller');
      untracedTests[file] = { ...entry, names: next };
    }
  }

  return { ledger: { coverage, untracedTests }, history };
}
