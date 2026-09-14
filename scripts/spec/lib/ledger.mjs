import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const LEDGER_FILE = 'openspec/trace/gaps.json';
export const HISTORY_FILE = 'openspec/trace/history.jsonl';
export const RETIRED_FILE = 'openspec/trace/retired-ids.json';
const METRICS = ['lines', 'branches', 'functions'];
const VERSION = 3;

function sortedObject(object) {
  return Object.fromEntries(Object.keys(object).sort().map((key) => [key, object[key]]));
}

/** The total branch count and the total function count of a coverage record. */
function totalsOf(record) {
  return { branches: record.branches ? record.branches.total : null, functions: record.functions ? record.functions.total : null };
}

/** The covered count of a metric: the total minus the not-covered count. Null without a total. */
function coveredCount(item, metric) {
  if (!item.totals || item.totals[metric] === null || item.totals[metric] === undefined || item[metric] === null) return null;
  return item.totals[metric] - item[metric];
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

/** True for an entry with a range at 0 for a file at 100% with the content of the entry. */
function completeInRange(entry, hash) {
  return Boolean(entry.low) && METRICS.every((metric) => entry.low[metric] === 0) && hash === entry.sha;
}

function inRange(entry, gap, metric) {
  if (!entry.low) return entry[metric] === gap[metric];
  if (entry[metric] === null || gap[metric] === null) return entry[metric] === gap[metric];
  return gap[metric] >= entry.low[metric] && gap[metric] <= entry[metric];
}

/** True when each low count is an integer from 0 to its high count, and null only with a null high count. */
function correctRange(entry) {
  if (typeof entry.low !== 'object') return false;
  return METRICS.every((metric) => {
    const low = entry.low[metric];
    if (entry[metric] === null) return low === null;
    return Number.isInteger(low) && low >= 0 && low <= entry[metric];
  });
}

function hasTotals(entry) {
  return Boolean(entry.totals) && Number.isInteger(entry.totals.branches) && Number.isInteger(entry.totals.functions);
}

function sameTotals(entry, gap) {
  if (entry.low) return !entry.loaded || hasTotals(entry);
  return JSON.stringify(entry.totals ?? null) === JSON.stringify(gap.totals);
}

function sameGap(entry, gap) {
  return (
    entry.loaded === gap.loaded &&
    entry.sha === gap.sha &&
    Boolean(entry.untrue) === gap.untrue &&
    sameTotals(entry, gap) &&
    METRICS.every((metric) => inRange(entry, gap, metric))
  );
}

function compareCoverageEntry(file, entry, gap) {
  const errors = [];
  const error = (code, message) => errors.push({ code, file, message });
  if (gap.untrue && !entry.untrue) {
    error('COVERAGE-FAKE', `A test ran code under the name ${file}, but the code is not the file content`);
  }
  if (entry.loaded && !gap.loaded && !gap.untrue) {
    error('LEDGER-UNLOADED', `No test loads ${file} now. The ledger records it as loaded.`);
  }
  const changed = gap.sha !== entry.sha;
  const allowed = (metric) => (changed && entry.low ? entry.low[metric] : entry[metric]);
  if (gap.lines > allowed('lines')) {
    error('LEDGER-LARGER-GAP', `${file} has ${gap.lines} lines not covered. The ledger allows ${allowed('lines')}.`);
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
      if (entry.low && gap[metric] <= entry[metric]) continue;
      const before = coveredCount(entry, metric);
      const now = coveredCount(gap, metric);
      if (before !== null && now !== null && now < before) {
        error('LEDGER-LOST-COVERAGE', `${file} has ${now} covered ${metric}. The ledger records ${before}.`);
      }
    }
  }
  return errors;
}

/**
 * Compare the current gaps with the ledger.
 *
 * @returns {{errors: object[], stale: object[]}}
 */
export function compareLedger({ ledger, current }) {
  const errors = [];
  const stale = [];
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    if (entry.low && !correctRange(entry)) {
      errors.push({ code: 'LEDGER-BAD-RANGE', file, message: `The range of ${file} has a low count that is not an integer from 0 to its high count` });
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
    const entryErrors = compareCoverageEntry(file, entry, gap);
    errors.push(...entryErrors);
    if (entryErrors.length === 0 && !sameGap(entry, gap)) stale.push({ kind: 'coverage', file });
  }
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    if (!current.coverage.has(file) && !completeInRange(entry, current.hashes.get(file))) stale.push({ kind: 'coverage', file });
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

function width(entry, metric) {
  if (!entry || !entry.low || entry[metric] === null || entry.low[metric] === null) return 0;
  return entry[metric] - entry.low[metric];
}

function rangeLimit(count) {
  return Math.max(5, Math.ceil(count * 0.02));
}

/**
 * Compare the ledger files with the same files in the base commit.
 *
 * @param {object} input
 * @param {string} [input.change] - The checked change. A wider range needs an `unstable` history line with this name.
 * @param {boolean} [input.outsideChanged] - True when the diff changes a file that is not in `openspec/`.
 * @returns {object[]} Errors.
 */
export function compareWithBase({ ledger, baseLedger, retired, baseRetired, history, baseHistory, sameAsBase = () => false, change, outsideChanged = false }) {
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
  const unstableHistory = new Set(changeLines.filter((line) => line.reason === 'unstable').map((line) => line.file));
  const totalsHistory = new Set(changeLines.filter((line) => line.metric === 'totals').map((line) => line.file));
  const moreThan = (entry, base, metric) => entry[metric] !== null && base[metric] !== null && entry[metric] > base[metric];
  for (const [file, entry] of Object.entries(ledger.coverage)) {
    const base = baseLedger.coverage[file];
    for (const metric of METRICS.filter((item) => entry.low && width(entry, item) > rangeLimit(entry.low[item]))) {
      error('LEDGER-UNSTABLE-TOO-WIDE', file, `The unstable range for ${file} is ${width(entry, metric)} ${metric} wide. The limit is ${rangeLimit(entry.low[metric])}.`);
    }
    const newRange = Boolean(entry.low) && !(base && base.low);
    const wider = newRange || METRICS.some((metric) => width(entry, metric) > width(base, metric));
    if (wider) {
      if (!unstableHistory.has(file)) {
        error('LEDGER-UNSTABLE-NO-HISTORY', file, `The unstable range for ${file} is wider than the base, but the history has no unstable line for it from the change ${change}`);
      }
      if (!sameAsBase(file)) {
        error('LEDGER-UNSTABLE-CHANGED', file, `The unstable range for ${file} is wider than the base, but the file content is not the base content`);
      }
      if (outsideChanged) {
        error('LEDGER-UNSTABLE-FILE-CHANGE', file, `The unstable range for ${file} is wider than the base, and the diff changes a file that is not in openspec/`);
      }
      for (const metric of METRICS) {
        const baseCount = base ? base[metric] : 0;
        if (entry[metric] === null || baseCount === null) continue;
        const limit = baseCount + rangeLimit(baseCount);
        if (entry[metric] > limit) {
          error('LEDGER-UNSTABLE-ABOVE-BASE', file, `The unstable range for ${file} allows ${entry[metric]} ${metric}. The limit is ${limit}.`);
        }
      }
      continue;
    }
    if (!base) {
      error('LEDGER-NOT-IN-BASE', file, `The ledger entry for ${file} is not in the base ledger`);
      continue;
    }
    const unchanged = sameAsBase(file);
    if (entry.low && unchanged) {
      for (const metric of METRICS.filter((item) => moreThan(entry, base, item))) {
        error('LEDGER-UNSTABLE-MOVED-UP', file, `The unstable range for ${file} allows ${entry[metric]} ${metric}. The base range allows ${base[metric]}.`);
      }
    }
    if (entry.low && !unchanged) {
      error('LEDGER-UNSTABLE-CHANGED', file, `The ledger entry for ${file} has a range, but the file content is not the base content`);
    }
    const baseAllowed = !unchanged && base.low ? { ...base, ...base.low } : base;
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
export function ratchetLedger({ ledger, current, inventory, testFiles, change, changeActive, date, commit }) {
  if (!change) throw new Error('The ratchet command needs --change <name>');
  if (!changeActive) throw new Error(`Change "${change}" has no folder with a proposal.md file in openspec/changes`);
  const blocking = compareLedger({ ledger, current }).errors.filter((error) => error.code !== 'LEDGER-STALE');
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
    if (!gap && completeInRange(entry, current.hashes.get(file))) {
      coverage[file] = entry;
      continue;
    }
    if (!gap) {
      record('coverage', file, 'lines', entry.lines, 0, 'closed');
      continue;
    }
    if (entry.low && sameGap(entry, gap)) {
      coverage[file] = entry;
      continue;
    }
    const next = { ...gap, origin: entry.origin, since: entry.since };
    const keepRange = Boolean(entry.low) && gap.sha === entry.sha;
    if (keepRange) next.low = {};
    for (const metric of METRICS.filter(() => keepRange)) {
      const low = entry.low[metric];
      if (gap[metric] === null || entry[metric] === null || low === null) {
        next.low[metric] = gap[metric];
      } else if (gap[metric] < low) {
        next.low[metric] = gap[metric];
        next[metric] = gap[metric] + width(entry, metric);
      } else if (gap[metric] > entry[metric]) {
        next.low[metric] = gap[metric] - width(entry, metric);
      } else {
        next.low[metric] = low;
        next[metric] = entry[metric];
      }
    }
    if (next.lines < entry.lines) record('coverage', file, 'lines', entry.lines, next.lines, 'smaller');
    if (!entry.loaded && gap.loaded) record('coverage', file, 'loaded', false, true, 'loaded');
    if (entry.untrue && !gap.untrue) record('coverage', file, 'untrue', true, false, 'true coverage');
    for (const metric of ['branches', 'functions']) {
      if (entry[metric] === null || next[metric] === null || entry[metric] === next[metric]) continue;
      record('coverage', file, metric, entry[metric], next[metric], next[metric] > entry[metric] ? 'shown by test' : 'smaller');
    }
    if (gap.sha !== entry.sha) record('coverage', file, 'hash', entry.sha, gap.sha, 'content changed');
    if (entry.low && !keepRange) record('coverage', file, 'range', entry.low, null, 'content changed');
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

export const SAMPLES_FILE = '.gev-cache/spec-samples.jsonl';

/** The counts of one coverage record as a sample. A complete file has zero counts. */
export function coverageSample(record) {
  return {
    file: record.file,
    sha: record.sha,
    loaded: record.loaded,
    lines: record.lines.uncovered,
    branches: record.branches ? record.branches.uncovered : null,
    functions: record.functions ? record.functions.uncovered : null,
    totals: totalsOf(record),
    untrue: Boolean(record.untrue),
  };
}

/** Add one sample for each coverage record to `.gev-cache/spec-samples.jsonl`. */
export function appendSamples(root, records) {
  const file = path.join(root, SAMPLES_FILE);
  mkdirSync(path.dirname(file), { recursive: true });
  appendFileSync(file, records.map((record) => `${JSON.stringify(coverageSample(record))}\n`).join(''));
}

/** Read the kept samples, grouped by file. */
export function readSamples(root) {
  const file = path.join(root, SAMPLES_FILE);
  const samples = new Map();
  if (!existsSync(file)) return samples;
  for (const line of readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
    const sample = JSON.parse(line);
    samples.set(sample.file, [...(samples.get(sample.file) || []), sample]);
  }
  return samples;
}

function extreme(values, pick) {
  if (values.some((value) => value === null)) return null;
  return pick(...values);
}

/**
 * Record a range for each file with coverage that changes between runs of the same content.
 *
 * @param {object} input
 * @param {Map<string, {sha: string, list: object[]}>} input.samples - The current content hash and the samples of each file.
 * @param {(file: string) => boolean} input.sameAsBase - True when the file content is the base content.
 * @returns {{ledger: object, history: object[]}}
 */
export function stabilityLedger({ ledger, samples, sameAsBase, change, changeActive, date, commit }) {
  if (!change) throw new Error('The stability command needs --change <name>');
  if (!changeActive) throw new Error(`Change "${change}" has no folder with a proposal.md file in openspec/changes`);
  const changed = [];
  const coverage = { ...ledger.coverage };
  const history = [];
  const equalTotals = (x, y) => !x.totals || !y.totals || JSON.stringify(x.totals) === JSON.stringify(y.totals);
  const sameCounts = (x, y) => x.loaded === y.loaded && METRICS.every((metric) => x[metric] === y[metric]) && equalTotals(x, y);
  for (const file of [...samples.keys()].sort()) {
    const { sha, list } = samples.get(file);
    const current = list.filter((sample) => sample.sha === sha);
    const entry = ledger.coverage[file];
    const unchanged = Boolean(entry) && entry.sha === sha;
    if (unchanged && entry.low && current.every((sample) => sameGap(entry, { ...sample, sha: entry.sha, untrue: Boolean(entry.untrue) }))) continue;
    if (!entry && current.every((sample) => METRICS.every((metric) => !sample[metric]))) continue;
    const values = unchanged ? [entry, ...current] : current;
    if (values.every((value) => sameCounts(value, values[0]))) continue;
    if (!sameAsBase(file)) {
      changed.push(file);
      continue;
    }
    const lows = unchanged && entry.low ? [entry.low, ...current] : values;
    const next = {
      loaded: values.some((value) => value.loaded),
      lines: extreme(values.map((item) => item.lines), Math.max),
      branches: extreme(values.map((item) => item.branches), Math.max),
      functions: extreme(values.map((item) => item.functions), Math.max),
      totals: unchanged && entry.totals ? entry.totals : (current[current.length - 1].totals ?? null),
      sha,
      untrue: values.some((value) => Boolean(value.untrue)),
      origin: entry ? entry.origin : 'unstable',
      since: entry ? entry.since : date,
      low: Object.fromEntries(METRICS.map((metric) => [metric, extreme(lows.map((item) => item[metric]), Math.min)])),
    };
    coverage[file] = next;
    const before = entry ? Object.fromEntries(METRICS.map((metric) => [metric, entry[metric]])) : null;
    const after = Object.fromEntries(METRICS.map((metric) => [metric, [next.low[metric], next[metric]]]));
    history.push({ date, change, commit, kind: 'coverage', file, metric: 'range', before, after, reason: 'unstable' });
  }
  if (changed.length > 0) {
    throw new Error(`These files have coverage that changed between runs, but their content is not the base content: ${changed.join(', ')}`);
  }
  return { ledger: { coverage, untracedTests: ledger.untracedTests }, history };
}
