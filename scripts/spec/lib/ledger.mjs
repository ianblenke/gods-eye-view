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
 * True when every metric whose total in `entry` differs from `base` has the same covered
 * count in both. A total that moves with no change of the covered count cannot mean a lost
 * test. False when either side has no totals, or when a changed metric has no covered count.
 */
function totalsAgreeOnCoverage(entry, base) {
  if (!entry.totals || !base.totals) return false;
  return METRICS.every((metric) => {
    if (entry.totals[metric] === base.totals[metric]) return true;
    const covered = coveredCount(entry, metric);
    return covered !== null && covered === coveredCount(base, metric);
  });
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
 * True when waivers cover each not-covered count of a file that has no entry to compare with.
 * The record must be loaded, the file must not have the base content, and one or more waivers
 * must name the file and the content hash of the record.
 */
function waiversCover(file, record, waivers, sameAsBase) {
  if (!record.loaded || sameAsBase(file)) return false;
  const own = waivers.filter((item) => item.file === file && item.sha === record.sha);
  if (own.length === 0) return false;
  const waived = (metric) => own.filter((item) => item.metric === metric).reduce((sum, item) => sum + item.count, 0);
  return METRICS.every((metric) => record[metric] <= waived(metric));
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

/**
 * The history lines of one active change after the base commit. Each line is a parsed object.
 * The result is empty without a change name or when the history does not start with the base history.
 */
function historyLinesOf(history, baseHistory, change) {
  if (!change || !history.startsWith(baseHistory)) return [];
  return history
    .slice(baseHistory.length)
    .split('\n')
    .filter((line) => line.startsWith('{'))
    .map((line) => JSON.parse(line));
}

/**
 * The waiver lines of one active change after the base commit. A person can write a history line
 * by hand, so a line with a count that is not a positive whole number gives no waived count.
 *
 * @param {string} history - Current history text.
 * @param {string} baseHistory - Base history text.
 * @param {string} change - Active change name.
 * @returns {object[]} Waiver lines.
 */
export function waiversOf(history, baseHistory, change) {
  return historyLinesOf(history, baseHistory, change).filter((line) => line.kind === 'waiver' && line.change === change && Number.isInteger(line.count) && line.count > 0);
}

const NO_ADOPTED = Object.freeze({ lines: 0, branches: 0, functions: 0, untraced: 0, untrue: false });
const isCount = (value) => Number.isInteger(value) && value >= 0;

/**
 * The adopt lines of one active change after the base commit. A line with the wrong kind, the wrong
 * change name, no file or commit, or a count that is not a whole number of 0 or more gives no adopted count.
 * A metric can be `null` for a file that has no count of that metric.
 *
 * @param {string} history - Current history text.
 * @param {string} baseHistory - Base history text.
 * @param {string} change - Active change name.
 * @returns {object[]} Adopt lines.
 */
export function adoptsOf(history, baseHistory, change) {
  return historyLinesOf(history, baseHistory, change).filter(
    (line) =>
      line.kind === 'adopt' &&
      line.change === change &&
      typeof line.file === 'string' &&
      typeof line.from === 'string' &&
      METRICS.every((metric) => line[metric] === null || isCount(line[metric])) &&
      isCount(line.untraced),
  );
}

/**
 * Separate the valid adopt lines from the lines with a commit or a file that the merge did not bring.
 * The function asks for the changed files of a commit one time, also for many lines with that commit.
 *
 * @param {object} input
 * @param {object[]} input.adopts - The adopt lines from `adoptsOf`.
 * @param {(from: string) => boolean} input.isMergedCommit - True for a parent, other than the first parent, of a merge commit after the base.
 * @param {(from: string) => Set<string>} input.changedFiles - The files that the commit changed since its merge base with the base.
 * @returns {{valid: object[], errors: object[]}}
 */
export function checkAdopts({ adopts, isMergedCommit, changedFiles }) {
  const valid = [];
  const errors = [];
  const changed = new Map();
  for (const line of adopts) {
    const { file, from } = line;
    const merged = isMergedCommit(from);
    if (merged && !changed.has(from)) changed.set(from, changedFiles(from));
    if (!merged) {
      errors.push({ code: 'LEDGER-ADOPT-FROM', file, message: `The adopt line for ${file} names the commit ${from}, and no merge commit after the base commit brought that commit` });
    } else if (!changed.get(from).has(file)) {
      errors.push({ code: 'LEDGER-ADOPT-FILE', file, message: `The adopt line for ${file} names the commit ${from}, and that commit did not change ${file} since its merge base with the base commit` });
    } else {
      valid.push(line);
    }
  }
  return { valid, errors };
}

/**
 * The adopted count of each metric for each file: the largest count in the valid adopt lines of the file.
 * A file with no valid line has no entry in the map. The mark for untrue coverage is true when one line has it.
 *
 * @param {object[]} lines - Valid adopt lines.
 * @returns {Map<string, {lines: number, branches: number, functions: number, untraced: number, untrue: boolean}>}
 */
export function adoptedCounts(lines) {
  const counts = new Map();
  for (const line of lines) {
    const before = counts.get(line.file) ?? NO_ADOPTED;
    counts.set(line.file, {
      lines: Math.max(before.lines, line.lines ?? 0),
      branches: Math.max(before.branches, line.branches ?? 0),
      functions: Math.max(before.functions, line.functions ?? 0),
      untraced: Math.max(before.untraced, line.untraced),
      untrue: before.untrue || line.untrue === true,
    });
  }
  return counts;
}

/**
 * True when each count of a ledger entry is at or below the adopted count, and untrue coverage of the entry has the mark
 * in an adopt line. A count that is `null` is 0 in the comparison, so it is never above the adopted count.
 */
function adoptedCovers(entry, counts) {
  return Boolean(counts) && METRICS.every((metric) => entry[metric] <= counts[metric]) && (!entry.untrue || counts.untrue);
}

function compareCoverageEntry(file, entry, gap, tolerance = () => 0, waived) {
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
  const waivedLines = waived('lines');
  if (gap.lines > allowed('lines') + tolerance('lines') + waivedLines) {
    const extra = waivedLines > 0 ? ` A waiver allows ${waivedLines} more.` : '';
    error('LEDGER-LARGER-GAP', `${file} has ${gap.lines} lines not covered. The ledger allows ${allowed('lines') + tolerance('lines')}.${extra}`);
  }
  if (changed && !entry.loaded && gap.loaded) {
    error('LEDGER-NO-BASELINE', `${file} changed in the same change that first loads it. Load it in one change and edit it in a later change.`);
  } else if (changed && entry.loaded && gap.loaded) {
    for (const metric of ['branches', 'functions']) {
      const waivedMetric = waived(metric);
      if (gap[metric] > allowed(metric) + waivedMetric) {
        const extra = waivedMetric > 0 ? ` A waiver allows ${waivedMetric} more.` : '';
        error('LEDGER-LARGER-GAP', `${file} has ${gap[metric]} ${metric} not covered. The ledger allows ${allowed(metric)}.${extra}`);
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
 * @param {object[]} [input.waivers] - Waiver lines for the checked change.
 * @returns {{errors: object[], stale: object[]}}
 */
export function compareLedger({ ledger, current, sameAsBase = () => false, waivers = [] }) {
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
      // A waived file with no entry is not current until the ratchet command adds its entry.
      if (waiversCover(file, gap, waivers, sameAsBase)) stale.push({ kind: 'coverage', file });
      else errors.push({ code: 'LEDGER-NEW-COVERAGE-GAP', file, message: describeGap(file, gap) });
      if (gap.untrue) {
        errors.push({ code: 'COVERAGE-FAKE', file, message: `A test ran code under the name ${file}, but the code is not the file content` });
      }
      continue;
    }
    // The counts of a file can be different in each run, so they can move inside the tolerance.
    const tolerant = hasTolerance(file, entry, gap, sameAsBase);
    const changed = gap.sha !== entry.sha;
    const waived = (metric) => {
      if (!changed || !entry.loaded || !gap.loaded) return 0;
      return waivers
        .filter((item) => item.file === file && item.metric === metric && item.sha === gap.sha)
        .reduce((sum, item) => sum + item.count, 0);
    };
    const entryErrors = compareCoverageEntry(file, entry, gap, tolerant ? gapTolerance(gap) : undefined, waived);
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
 * @param {object|null} input.ledger - Current ledger.
 * @param {object|null} input.baseLedger - Base commit ledger.
 * @param {string[]} input.retired - Retired scenario IDs.
 * @param {string[]} input.baseRetired - Base retired scenario IDs.
 * @param {string} input.history - Current history text.
 * @param {string} input.baseHistory - Base history text.
 * @param {(file: string) => boolean} [input.sameAsBase] - True for a file with the content of the base.
 * @param {string} [input.change] - The checked change. A changed total count with a changed covered
 *   count needs a history line with this name.
 * @param {Map<string, object>} [input.adopted] - The adopted counts of the checked change, from `adoptedCounts`.
 *   A file with other content than the base has an allowance up to its adopted count. The larger of this
 *   count and the base count plus the waived count applies. See the requirement "Adoption of merged code".
 * @returns {object[]} Errors.
 */
export function compareWithBase({ ledger, baseLedger, retired, baseRetired, history, baseHistory, sameAsBase = () => false, change, adopted = new Map() }) {
  if (baseLedger === null) return [];
  if (ledger === null) {
    return [{ code: 'LEDGER-REMOVED', file: LEDGER_FILE, message: `The base commit has ${LEDGER_FILE}, but the current tree does not` }];
  }
  const errors = [];
  const error = (code, file, message) => errors.push({ code, file, message });
  const waivers = waiversOf(history, baseHistory, change);
  const changeLines = (history.startsWith(baseHistory) ? history.slice(baseHistory.length) : '')
    .split('\n')
    .filter((line) => line.startsWith('{'))
    .map((line) => JSON.parse(line))
    .filter((line) => Boolean(change) && line.change === change);
  const totalsHistory = new Set(changeLines.filter((line) => line.metric === 'totals').map((line) => line.file));
  const moreThan = (entry, base, metric) => entry[metric] !== null && base[metric] !== null && entry[metric] > base[metric];
  // The adopted counts of a file with other content than the base. A file with the base content has none.
  const adoptedFor = (file) => (sameAsBase(file) ? undefined : adopted.get(file));
  const adoptedNote = (count) => (count > 0 ? ` The adopted count is ${count}.` : '');
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    const base = baseLedger.coverage[file];
    if (!base) {
      if (!waiversCover(file, entry, waivers, sameAsBase) && !adoptedCovers(entry, adoptedFor(file))) {
        error('LEDGER-NOT-IN-BASE', file, `The ledger entry for ${file} is not in the base ledger`);
      }
      continue;
    }
    const ceiling = adoptedFor(file) ?? NO_ADOPTED;
    const unchanged = sameAsBase(file);
    const baseAllowed = base;
    const waived = (metric) => {
      if (unchanged || !entry.loaded) return 0;
      return waivers
        .filter((w) => w.file === file && w.metric === metric && w.sha === entry.sha)
        .reduce((sum, w) => sum + w.count, 0);
    };
    const waivedLines = waived('lines');
    if (entry.lines > Math.max(baseAllowed.lines + waivedLines, ceiling.lines)) {
      const extra = waivedLines > 0 ? ` A waiver allows ${waivedLines} more.` : '';
      error('LEDGER-LARGER-THAN-BASE', file, `The ledger allows ${entry.lines} lines for ${file}. The base ledger allows ${baseAllowed.lines}.${extra}${adoptedNote(ceiling.lines)}`);
    }
    if (entry.untrue && !base.untrue && !ceiling.untrue) {
      error('LEDGER-UNTRUE-NOT-IN-BASE', file, `The ledger records untrue coverage for ${file}, but the base ledger does not`);
    }
    if (unchanged && entry.sha !== base.sha) {
      error('LEDGER-HASH-NOT-BASE', file, `The content of ${file} is the base content, but its ledger hash is not the base hash`);
    }
    if (
      unchanged &&
      JSON.stringify(entry.totals ?? null) !== JSON.stringify(base.totals ?? null) &&
      !totalsHistory.has(file) &&
      !totalsAgreeOnCoverage(entry, base)
    ) {
      error('LEDGER-TOTALS-NOT-BASE', file, `The total counts of ${file} are not the base total counts, but the history has no totals line for it from the change ${change}`);
    }
    for (const metric of ['branches', 'functions']) {
      if (!moreThan(entry, baseAllowed, metric)) continue;
      const covered = coveredCount(entry, metric);
      const baseCovered = coveredCount(base, metric);
      const waivedMetric = waived(metric);
      if (!unchanged) {
        if (entry[metric] > Math.max(baseAllowed[metric] + waivedMetric, ceiling[metric])) {
          const extra = waivedMetric > 0 ? ` A waiver allows ${waivedMetric} more.` : '';
          error('LEDGER-MORE-THAN-BASE', file, `${file} changed, and the ledger allows ${entry[metric]} ${metric}. The base ledger allows ${baseAllowed[metric]}.${extra}${adoptedNote(ceiling[metric])}`);
        }
      } else if (covered === null || baseCovered === null || covered < baseCovered) {
        error('LEDGER-MORE-THAN-BASE', file, `The ledger allows ${entry[metric]} ${metric} for ${file} with ${covered} covered ${metric}. The base ledger allows ${base[metric]} with ${baseCovered} covered.`);
      }
    }
  }
  for (const [file, entry] of Object.entries(ledger.untracedTests)) {
    const baseNames = baseLedger.untracedTests[file] ? baseLedger.untracedTests[file].names : {};
    const extra = Object.entries(entry.names).filter(([name, count]) => count > (baseNames[name] || 0));
    // The adopted count of untraced tests is the number of untraced tests of the file, and not the rise above the base entry.
    const total = Object.values(entry.names).reduce((sum, count) => sum + count, 0);
    if (total <= (adoptedFor(file) ?? NO_ADOPTED).untraced) continue;
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
 * @param {object} input
 * @param {object} input.ledger - The current ledger.
 * @param {object} input.current - The measured gaps.
 * @param {string[]} input.inventory - Tracked code files.
 * @param {string[]} input.testFiles - Tracked test files.
 * @param {string} input.change - Active change name.
 * @param {boolean} input.changeActive - True when the change is active.
 * @param {string} input.date - Today's date.
 * @param {string} input.commit - Head commit hash.
 * @param {(file: string) => boolean} [input.sameAsBase] - True for a file with the content of the base.
 * @param {object[]} [input.waivers] - Waiver lines for the checked change.
 * @returns {{ledger: object, history: object[]}}
 */
export function ratchetLedger({ ledger, current, inventory, testFiles, change, changeActive, date, commit, sameAsBase = () => false, waivers = [] }) {
  if (!change) throw new Error('The ratchet command needs --change <name>');
  if (!changeActive) throw new Error(`Change "${change}" has no folder with a proposal.md file in openspec/changes`);
  // The ratchet command writes the version and the total counts again, so these are not blocking.
  const RATCHET_FIXES = new Set(['LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION']);
  const blocking = compareLedger({ ledger, current, sameAsBase, waivers }).errors.filter((error) => !RATCHET_FIXES.has(error.code));
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
    else if (next.lines > entry.lines) record('coverage', file, 'lines', entry.lines, next.lines, 'waived');
    if (!entry.loaded && gap.loaded) record('coverage', file, 'loaded', false, true, 'loaded');
    if (entry.untrue && !gap.untrue) record('coverage', file, 'untrue', true, false, 'true coverage');
    for (const metric of ['branches', 'functions']) {
      if (entry[metric] === null || next[metric] === null || entry[metric] === next[metric]) continue;
      record('coverage', file, metric, entry[metric], next[metric], next[metric] > entry[metric] ? (gap.sha !== entry.sha ? 'waived' : 'shown by test') : 'smaller');
    }
    if (gap.sha !== entry.sha) record('coverage', file, 'hash', entry.sha, gap.sha, 'content changed');
    if (JSON.stringify(entry.totals ?? null) !== JSON.stringify(next.totals)) record('coverage', file, 'totals', entry.totals ?? null, next.totals, 'totals changed');
    coverage[file] = next;
  }
  for (const [file, gap] of current.coverage) {
    if (file in ledger.coverage) continue;
    for (const metric of METRICS) {
      if (gap[metric] > 0) record('coverage', file, metric, 0, gap[metric], 'waived');
    }
    coverage[file] = { ...gap, origin: change, since: date };
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

/**
 * Record the gaps of the files that a merge brought in. The command writes a ledger entry and one
 * history line for each eligible file with a gap. An entry that exists keeps its origin and its date.
 * It does not close any gap and writes no registry or link file. See the requirement "Adoption of merged code".
 *
 * @param {object} input
 * @param {object} input.ledger - The current ledger.
 * @param {object} input.current - The measured gaps.
 * @param {(file: string) => boolean} input.eligible - True for a file that the merged commit changed and that has other content than the base.
 * @param {string} input.change - Active change name.
 * @param {string} input.date - Today's date.
 * @param {string} input.commit - Head commit hash.
 * @param {string} input.from - The merged commit.
 * @returns {{ledger: object, history: object[]}}
 */
export function adoptLedger({ ledger, current, eligible, change, date, commit, from }) {
  const coverage = { ...ledger.coverage };
  const untracedTests = { ...ledger.untracedTests };
  const history = [];
  const record = (file, counts) => history.push({ date, change, commit, kind: 'adopt', file, from, ...counts });
  for (const [file, gap] of current.coverage) {
    if (!eligible(file)) continue;
    const entry = ledger.coverage[file];
    coverage[file] = { ...gap, origin: entry ? entry.origin : change, since: entry ? entry.since : date };
    record(file, { lines: gap.lines, branches: gap.branches, functions: gap.functions, untraced: 0, untrue: gap.untrue });
  }
  for (const [file, names] of current.untraced) {
    if (!eligible(file)) continue;
    const entry = ledger.untracedTests[file];
    untracedTests[file] = { names: Object.fromEntries(names), origin: entry ? entry.origin : change, since: entry ? entry.since : date };
    record(file, { lines: null, branches: null, functions: null, untraced: [...names.values()].reduce((total, count) => total + count, 0), untrue: false });
  }
  return { ledger: { coverage, untracedTests }, history };
}
