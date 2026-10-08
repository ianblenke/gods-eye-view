import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const MANIFEST = 'openspec/ownership.json';
const METRICS = ['lines', 'branches', 'functions'];

/** Read the manifest contract. */
export function parseOwnership(text) {
  const value = JSON.parse(text);
  if (!value || value.version !== 1 || !Array.isArray(value.owned) || Object.keys(value).sort().join(',') !== 'owned,version' ||
      new Set(value.owned).size !== value.owned.length || value.owned.some(item => typeof item !== 'string' ||
        !/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*\/?$/.test(item) || item.split('/').some(part => part === '.' || part === '..'))) {
    throw new Error('Use version 1 and unique safe relative paths in the owned array.');
  }
  return value;
}

/** Read the manifest or return a gate error. */
export function readOwnership(root) {
  try {
    return { manifest: parseOwnership(readFileSync(path.join(root, MANIFEST), 'utf8')), errors: [] };
  } catch (error) {
    return { errors: [{ code: 'OWNERSHIP-MANIFEST', file: MANIFEST, message: error.message }] };
  }
}

/** Class of one path. */
export function classify(manifest, file) {
  return manifest.owned.some(item => item.endsWith('/') ? file.startsWith(item) : file === item) ? 'owned' : 'upstream';
}

/** Class lines and totals for the changed paths. */
export function ownershipAdvice(manifest, files) {
  const owned = files.filter(file => classify(manifest, file) === 'owned').length;
  return [...files.map(file => `Class: ${classify(manifest, file)} ${file}`), `Ownership: ${owned} owned, ${files.length - owned} upstream`];
}

/** New line numbers from a zero-context diff. */
export function parseDiffLines(text) {
  const lines = new Set();
  for (const match of text.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(match[1]);
    const count = match[2] === undefined ? 1 : Number(match[2]);
    for (let line = start; line < start + count; line += 1) lines.add(line);
  }
  return [...lines].sort((a, b) => a - b);
}

/** Read the changed lines of current inventory files. */
export function changedLines({ root, base, files }) {
  const result = {};
  for (const file of files) {
    if (!existsSync(path.join(root, file))) continue;
    const diff = spawnSync('git', ['diff', '--text', '--no-ext-diff', '--no-textconv', '--no-renames', '-U0', base, '--', file], { cwd: root, encoding: 'utf8' });
    if (diff.status !== 0) throw new Error(`Git cannot read the diff of ${file}: ${diff.stderr}`);
    const present = spawnSync('git', ['cat-file', '-e', `${base}:${file}`], { cwd: root });
    if (present.status === 0) result[file] = parseDiffLines(diff.stdout);
    else {
      const text = readFileSync(path.join(root, file), 'utf8');
      const count = text === '' ? 0 : text.split('\n').length - Number(text.endsWith('\n'));
      result[file] = Array.from({ length: count }, (_, index) => index + 1);
    }
  }
  return result;
}

/** Check only author lines in a sync. */
export function syncChangedLines({ root, base, files, history, baseHistory, change }) {
  const adopts = change && history.startsWith(baseHistory) ? history.slice(baseHistory.length).split('\n').filter(Boolean).map(JSON.parse)
    .filter(item => item.kind === 'adopt' && item.change === change && typeof item.from === 'string' && item.from.length > 0) : [];
  for (const from of new Set(adopts.map(item => item.from))) {
    const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', from, 'HEAD'], { cwd: root });
    if (ancestor.status !== 0) throw new Error(`Adopt source ${from} is not an ancestor of HEAD.`);
  }
  const changed = changedLines({ root, base, files });
  const total = Object.values(changed).reduce((sum, lines) => sum + lines.length, 0);
  if (adopts.length > 0) {
    for (const file of Object.keys(changed)) {
      const from = (adopts.findLast(item => item.file === file) ?? adopts.at(-1)).from;
      const author = new Set(changedLines({ root, base: from, files: [file] })[file]);
      changed[file] = changed[file].filter(line => author.has(line));
    }
  }
  const required = Object.values(changed).reduce((sum, lines) => sum + lines.length, 0);
  return { changed, advice: `COVERAGE-DIFF: ${total} changed lines, ${total - required} brought by the merged upstream commit, ${required} need coverage.` };
}

/** Covered lines common to all source records. */
export function parseLineCoverage(text, root) {
  const records = {};
  let lines;
  for (const line of text.split('\n')) {
    if (line.startsWith('SF:')) {
      const source = line.slice(3);
      const file = path.isAbsolute(source) ? path.relative(root, source).split(path.sep).join('/') : source;
      lines = new Set();
      (records[file] ??= []).push(lines);
    } else {
      const hit = line.match(/^DA:(\d+),(\d+)$/);
      if (hit && lines && Number(hit[2]) > 0) lines.add(Number(hit[1]));
    }
  }
  return Object.fromEntries(Object.entries(records).map(([file, list]) => [file, [...list[0]].filter(line => list.every(item => item.has(line))).sort((a, b) => a - b)]));
}

/** Coverage boundary errors, in addition to all ledger comparisons. */
export function coverageFaults({ manifest, coverage, changed, lineCoverage, waivers, ledger = { coverage: {} }, changedFiles = Object.keys(changed) }) {
  const errors = [];
  const records = new Map(coverage.map(item => [item.file, item]));
  const ownWaivers = item => waivers.filter(waiver => waiver.file === item.file && waiver.sha === item.sha && Number.isInteger(waiver.count) && waiver.count > 0);
  for (const item of coverage) {
    if (classify(manifest, item.file) !== 'owned' || item.complete) continue;
    if (!changedFiles.includes(item.file) && Object.hasOwn(ledger.coverage, item.file)) continue;
    const valid = ownWaivers(item);
    if (item.loaded && !item.untrue && METRICS.every(metric => item[metric] !== null && item[metric].uncovered <= valid.filter(waiver => waiver.metric === metric).reduce((sum, waiver) => sum + waiver.count, 0))) continue;
    errors.push({ code: 'COVERAGE-OWNED', file: item.file, message: 'Owned code needs full line, branch and function coverage.' });
  }
  for (const [file, lines] of Object.entries(changed)) {
    const item = records.get(file);
    const trueFile = item && item.loaded && !item.untrue;
    const covered = new Set(trueFile ? lineCoverage[file] ?? [] : []);
    const waived = new Set(trueFile ? ownWaivers(item).filter(waiver => waiver.metric === 'lines' && waiver.lines.length <= waiver.count).flatMap(waiver => waiver.lines) : []);
    const uncovered = lines.filter(line => !covered.has(line) && !waived.has(line));
    if (uncovered.length > 0) errors.push({ code: 'COVERAGE-DIFF', file, lines: uncovered, message: `Changed lines need coverage: ${uncovered.join(', ')}.` });
  }
  return errors;
}

/** Ledger gaps by path class. */
export function gapReport(manifest, ledger) {
  const result = [];
  for (const group of ['owned', 'upstream']) {
    const code = Object.keys(ledger.coverage).filter(file => classify(manifest, file) === group).sort();
    const tests = Object.keys(ledger.untracedTests).filter(file => classify(manifest, file) === group).sort();
    const lines = code.reduce((sum, file) => sum + ledger.coverage[file].lines, 0);
    const names = tests.reduce((sum, file) => sum + Object.values(ledger.untracedTests[file].names).reduce((total, count) => total + count, 0), 0);
    result.push(`${group === 'owned' ? 'Owned' : 'Upstream'} gaps: ${code.length} code files, ${lines} lines, ${tests.length} test files, ${names} tests.`);
    result.push(...code.map(file => `${group} code: ${file}`), ...tests.map(file => `${group} tests: ${file}`));
  }
  return result;
}
