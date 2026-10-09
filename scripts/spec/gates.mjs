#!/usr/bin/env node
import { readOwnership, isAdoptSource, validAdoptSources, ownershipAdvice, syncChangedLines, parseLineCoverage, coverageFaults, gapReport } from './lib/ownership.mjs';
import { changedInputs, trustMeasurement, writeMeasurement } from './lib/measurement.mjs';
import { importReach, adoptableReached } from './lib/import-reach.mjs';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ALLOCATION_TEST_FILES } from '../run-unit-tests.mjs';
import { planCi } from './lib/ci.mjs';
import { contentHash, findCoverageFlags, findIgnoreComments, findTestImports, measureCoverage, parseLcov, untrueFiles } from './lib/coverage.mjs';
import { changedByCommit, diffNames, headCommit, listFilesAt, readFileAt, resolveCommit, resolveMergeBase } from './lib/git.mjs';
import { adoptableQaScript, qaAdvice, readQaRegister } from './lib/qa-register.mjs';
import { checkUntracked, codeInventory, isTestFile, listTrackedFiles, listUntrackedFiles, testInventory } from './lib/inventory.mjs';
import {
  baselineFault,
  rebaselineLedger,
  checkRebaseline,
  HISTORY_FILE,
  LEDGER_FILE,
  RETIRED_FILE,
  adoptLedger,
  adoptedCounts,
  adoptsOf,
  appendHistory,
  checkAdopts,
  compareLedger,
  compareWithBase,
  currentGaps,
  initLedger,
  parseLedger,
  ratchetLedger,
  readLedger,
  waiversOf,
  writeLedger,
} from './lib/ledger.mjs';
import { buildLinks, checkLinks, checkRegistry, compareRegistryWithBase, idsOfChangedTests, readLinks, readRegistry, updateRegistry, writeLinks, writeRegistry } from './lib/registry.mjs';
import { changeFolder, checkAgents, checkArchivedReviews, checkChangeNames, checkChangeReview, checkReviewCommand, computeTreeHash } from './lib/review.mjs';
import { lintSpecs, tasksReader } from './lib/spec-lint.mjs';
import { checkOpenSpec, runOpenSpec } from './lib/openspec.mjs';
import { checkArchivedChange, listActiveChanges, loadSpecs } from './lib/specs.mjs';
import { hasErrors, lintProject } from './lib/ste.mjs';
import { addProcess, createCoverage, replaceLcov } from './lib/v8-merge.mjs';
import { GUARD_PRELOAD, fileOfScriptUrl } from './lib/test-guard.mjs';
import { assertionKey, evaluateTrace, writeTraceReport } from './lib/trace.mjs';

const REPORTER = fileURLToPath(new URL('./lib/trace-reporter.mjs', import.meta.url));
const RUNNER = fileURLToPath(new URL('./lib/run-parallel.mjs', import.meta.url));
const OUT_DIR = '.gev-cache/spec';
const DEFAULT_BASE = 'origin/main';
const LOCAL_ENV_FILE = /^\.env(\..+)?$/;
const COMMANDS = new Set(['check', 'ci', 'init', 'ratchet', 'lint', 'tree', 'waive', 'adopt', 'rebaseline', 'report']);
const OPTIONS = new Set(['--change', '--base', '--root', '--file', '--metric', '--lines', '--count', '--reason', '--from']);
const USAGE = 'Usage: node scripts/spec/gates.mjs <check|ci|init|ratchet|lint|tree|waive|adopt|rebaseline|report> [--no-measure] [--change <name>] [--base <ref>] [--root <dir>] [--file <path>] [--metric <lines|branches|functions>] [--lines <n,n>] [--count <n>] [--reason <text>] [--from <commit>]';

/**
 * Read the command line. Throws the usage text for a bad command line.
 *
 * @param {string[]} argv - Arguments from the command line.
 * @returns {object} Parsed options.
 */
export function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw new Error(USAGE);
  const options = { command, change: undefined, base: undefined, root: undefined };
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index];
    if (key === '--no-measure' && command === 'check') {
      options.noMeasure = true;
      index -= 1;
      continue;
    }
    const value = rest[index + 1];
    if (!OPTIONS.has(key) || value === undefined) throw new Error(USAGE);
    options[key.slice(2)] = value;
  }
  return options;
}

/**
 * The dotenv files in the project root that Git does not track and that are not empty. A link to
 * a file that does not exist is not in the result, because a test cannot read it.
 * Vite and the key setup can read these files, so they can change the coverage of the tests.
 * A tracked file is the same in each checkout, so it is not in the result.
 *
 * @param {string} root - Project root.
 * @param {Set<string>} tracked - The tracked files.
 * @returns {string[]} File names.
 */
export function localEnvFiles(root, tracked) {
  return readdirSync(root)
    .filter((name) => LOCAL_ENV_FILE.test(name) && !tracked.has(name))
    .filter((name) => existsSync(path.join(root, name)) && statSync(path.join(root, name)).isFile() && statSync(path.join(root, name)).size > 0)
    .sort();
}

/** Make the node:test runs for the gates. */
export function buildTestRuns({ testFiles, allocationFiles = ALLOCATION_TEST_FILES, outDir, coverageDir }) {
  const allocation = new Set(allocationFiles);
  const main = testFiles.filter((file) => !allocation.has(file));
  const runs = [];
  if (main.length > 0) {
    const rawOutput = `${outDir}/tests-main.jsonl`;
    runs.push({
      kind: 'main',
      env: { NODE_V8_COVERAGE: coverageDir },
      output: `${rawOutput}.sync`,
      rawOutput,
      args: [
        '--test',
        '--experimental-test-coverage',
        '--test-force-exit',
        '--test-coverage-exclude=**/*.test.mjs',
        '--test-reporter=lcov',
        `--test-reporter-destination=${outDir}/lcov.info`,
        `--test-reporter=${REPORTER}`,
        `--test-reporter-destination=${rawOutput}`,
        ...main,
      ],
    });
  }
  testFiles
    .filter((file) => allocation.has(file))
    .forEach((file, index) => {
      const rawOutput = `${outDir}/tests-allocation-${index}.jsonl`;
      runs.push({
        kind: 'allocation',
        output: `${rawOutput}.sync`,
        rawOutput,
        args: [
          '--expose-gc',
          '--test',
          '--test-concurrency=1',
          '--test-force-exit',
          '--test-reporter=dot',
          '--test-reporter-destination=stdout',
          `--test-reporter=${REPORTER}`,
          `--test-reporter-destination=${rawOutput}`,
          file,
        ],
      });
    });
  return runs;
}

/** The environment for a test run: no inherited Node options, the test guard and the inventory hash. */
export function childEnv(env, { outDir, root, inventoryHash }) {
  const next = { ...env };
  delete next.NODE_OPTIONS;
  delete next.NODE_V8_COVERAGE;
  delete next.NODE_TEST_CONTEXT;
  return { ...next, NODE_OPTIONS: GUARD_PRELOAD, GEV_SPEC_OUT: outDir, GEV_SPEC_ROOT: root, GEV_SPEC_INVENTORY: inventoryHash };
}

// Both call sites pass files that already exist: measure() creates every run's own `.sync`
// file before any run starts, and the guard-*.jsonl names come from a readdirSync() of the
// same directory. No caller can pass a name that is not already there.
function readJsonLines(directory, files) {
  return files.flatMap((file) => {
    const absolute = path.join(directory, file);
    return readFileSync(absolute, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  });
}

/** Start the test runs at the same time with the parallel runner. */
function executeRuns({ runs, root, outDir, resultsDir, env, spawn, inventoryHash }) {
  const runsFile = path.join(resultsDir, 'runs.json');
  const resultsFile = path.join(resultsDir, 'results.json');
  writeFileSync(runsFile, JSON.stringify(runs.map((run) => ({ args: run.args, cwd: root, ...(run.env ? { env: run.env } : {}) }))));
  const result = spawn(process.execPath, [RUNNER, runsFile, resultsFile], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'], env: childEnv(env, { outDir, root, inventoryHash }) });
  if (result.error || result.status !== 0 || !existsSync(resultsFile)) {
    const detail = result.error ? `: ${result.error.message}` : '';
    return { errors: [{ code: 'GATES-TEST-RUN', file: '', message: `The test runner stopped with status ${result.status}${detail}` }], results: [] };
  }
  const results = JSON.parse(readFileSync(resultsFile, 'utf8'));
  // measure() creates every run's own `.sync` output file before any run starts, so
  // `run.output` always exists here; a nonzero status with no real error defers entirely
  // to checkFailedRuns(), which reads that file to say whether anything in it explains it.
  const errors = runs.flatMap((run, index) => {
    const { status, error } = results[index];
    if (!error) return [];
    return [{ code: 'GATES-TEST-RUN', file: '', message: `The ${run.kind} test run stopped with status ${status}: ${error}` }];
  });
  return { errors, results };
}

/** A run with a status that is not 0 must have a failed test in its result file. */
function checkFailedRuns(runs, results, recordsByRun) {
  return runs.flatMap((run, index) => {
    const result = results[index];
    if (!result || result.error || result.status === 0) return [];
    if (recordsByRun[index].some((record) => record.status === 'fail')) return [];
    return [{ code: 'GATES-TEST-RUN', file: '', message: `The ${run.kind} test run stopped with status ${result.status}, but no test in its result file failed` }];
  });
}

export function mergeRawCoverage({ root, directory, text, inventory }) {
  if (!existsSync(directory)) return text;
  const allowed = new Set(inventory);
  const merged = createCoverage((url) => readFileSync(fileURLToPath(url), 'utf8'));
  const accept = (url) => {
    if (!url.startsWith('file:')) return false;
    const file = fileOfScriptUrl(url, root);
    if (!file) return false;
    if (!allowed.has(file)) return false;
    if (file.split('/').includes('node_modules')) return false;
    if (file.endsWith('.test.mjs')) return false;
    return !new URL(url).searchParams.get('node-test-mock');
  };
  for (const name of readdirSync(directory).sort()) {
    if (!/^coverage-.*\.json$/.test(name)) continue;
    addProcess(merged, JSON.parse(readFileSync(path.join(directory, name), 'utf8')), accept);
  }
  return replaceLcov(text, merged);
}

/** Run the tests and measure specs, trace and coverage. */
function measure({ root, spawn, env, allocationFiles, change, openSpec, phase, manifest, base, adopts }) {
  const errors = [];
  const tracked = listTrackedFiles(root).filter((file) => existsSync(path.join(root, file)));
  const qaRegister = readQaRegister({ root, tracked, manifest, readBaseFile: file => readFileAt(root, base, file), adopts });
  errors.push(...qaRegister.errors);
  const inventory = codeInventory(tracked, qaRegister.validQaScripts);
  const testFiles = testInventory(tracked);
  const read = (file) => readFileSync(path.join(root, file), 'utf8');
  errors.push(...checkUntracked(listUntrackedFiles(root)));
  errors.push(...findIgnoreComments({ inventory, readFile: read }));
  errors.push(...findTestImports({ inventory, readFile: read }));
  errors.push(...findCoverageFlags({ tracked, readFile: read }));

  const outDir = path.join(root, OUT_DIR);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const hashes = Object.fromEntries(inventory.map((file) => [file, contentHash(read(file))]));
  const inventoryFile = path.join(outDir, 'inventory.json');
  const inventoryText = JSON.stringify(hashes);
  writeFileSync(inventoryFile, inventoryText);
  const resultsDir = mkdtempSync(path.join(tmpdir(), 'gev-spec-results-'));
  const coverageDir = mkdtempSync(path.join(tmpdir(), 'gev-spec-v8-'));
  try {
    const runs = buildTestRuns({ testFiles, allocationFiles, outDir: resultsDir, coverageDir });
    // Each run's own trace reporter opens its `.sync` file lazily, on its first record, which
    // is not necessarily the first thing that touches that path: a test can write into it too
    // (src/tooling/spec/gates.test.mjs's [spec-trace-039 spec-trace-040] deliberately does, to
    // check that the gate catches a forged record). Creating the file empty here, before any
    // test process starts, lets the reporter open it in append mode and never truncate content
    // a test already wrote.
    for (const run of runs) writeFileSync(run.output, '');
    const execution = executeRuns({ runs, root, outDir, resultsDir, env, spawn, inventoryHash: contentHash(inventoryText) });
    errors.push(...execution.errors);
    if (!existsSync(inventoryFile) || readFileSync(inventoryFile, 'utf8') !== inventoryText) {
      errors.push({ code: 'COVERAGE-INVENTORY-CHANGED', file: path.relative(root, inventoryFile), message: 'The inventory file changed during the test run' });
    }

    const named = new Set([
      'runs.json',
      'results.json',
      'lcov.info',
      ...runs.map((run) => path.basename(run.output)),
      ...runs.map((run) => path.basename(run.rawOutput)),
    ]);
    for (const file of readdirSync(resultsDir).filter((name) => !named.has(name)).sort()) {
      errors.push({ code: 'COVERAGE-EXTRA-RESULT', file, message: `The result folder has ${file}, but the gate did not name it. The gate does not read it.` });
    }
    const recordsByRun = runs.map((run) => readJsonLines(resultsDir, [path.basename(run.output)]));
    const records = recordsByRun.flat();
    errors.push(...checkFailedRuns(runs, execution.results, recordsByRun));
    let lcovText = existsSync(path.join(resultsDir, 'lcov.info')) ? readFileSync(path.join(resultsDir, 'lcov.info'), 'utf8') : null;
    if (lcovText !== null) {
      const rawFiles = existsSync(coverageDir) && readdirSync(coverageDir).some((name) => /^coverage-.*\.json$/.test(name));
      if (!rawFiles) errors.push({ code: 'COVERAGE-RAW-MISSING', file: '', message: 'The raw coverage files of the main run are absent, so the merge cannot replace the Node records' });
      lcovText = mergeRawCoverage({ root, directory: coverageDir, text: lcovText, inventory });
      writeFileSync(path.join(resultsDir, 'lcov.info'), lcovText);
    }

    for (const file of [...named].filter((name) => existsSync(path.join(resultsDir, name)))) copyFileSync(path.join(resultsDir, file), path.join(outDir, file));
    rmSync(resultsDir, { recursive: true, force: true });

    for (const file of inventory) {
      if (contentHash(read(file)) !== hashes[file]) {
        errors.push({ code: 'COVERAGE-FILE-CHANGED', file, message: `${file} changed during the test run` });
      }
    }
    const guardResults = readJsonLines(outDir, readdirSync(outDir).filter((file) => /^guard-\d+\.jsonl$/.test(file)).sort());
    for (const violation of guardResults.flatMap((result) => result.violations).filter((item) => !item.file)) {
      errors.push({ code: violation.code, file: '', message: violation.message });
    }
    for (const leak of guardResults.flatMap((result) => result.leaks || [])) {
      errors.push({ code: 'GATES-TEST-LEAK', file: leak.file, message: `A test process left a live timer: ${leak.resources.join(', ')}` });
    }
    const assertions = new Map();
    for (const item of guardResults.flatMap((result) => result.assertions)) {
      const key = assertionKey(item.file, item.fullName);
      assertions.set(key, (assertions.get(key) || 0) + item.count);
    }
    const entries = parseLcov(lcovText ?? '', { root });
    const untrue = untrueFiles({
      entries,
      inventory,
      checked: new Set(guardResults.flatMap((result) => result.checked)),
      violations: new Set(guardResults.flatMap((result) => result.violations.map((item) => item.file))),
    });
    const coverage = measureCoverage({ inventory, entries, readFile: read, untrue });

    const { specs, errors: specErrors } = phase('specs', () => fileSpecs({ root, change, openSpec }));
    errors.push(...specErrors);
    const folder = change ? changeFolder(root, change) : null;
    const trace = evaluateTrace({
      specs,
      records,
      assertions,
      testFiles,
      change,
      changeFound: !change || folder !== null,
    });
    errors.push(...trace.errors);
    writeTraceReport(root, trace.report);

    return { errors, inventory, lineCoverage: parseLineCoverage(lcovText ?? '', root), qaScripts: qaRegister.scripts, testFiles, records, assertions, coverage, specs, trace, links: buildLinks(trace.report), untrue, current: currentGaps({ coverage, untraced: trace.untraced }) };
  } finally {
    rmSync(coverageDir, { recursive: true, force: true });
  }
}

function fileSpecs({ root, change, openSpec }) {
  const errors = [];
  const specs = loadSpecs(root);
  errors.push(...specs.errors);
  const folder = change ? changeFolder(root, change) : null;
  errors.push(...checkOpenSpec({ root, specs, run: (args) => openSpec(root, args) }));
  errors.push(...lintSpecs({ requirements: specs.requirements, orphans: specs.orphans, changeIds: specs.changeIds, readTasks: tasksReader(root) }));
  if (folder && folder.startsWith('openspec/changes/archive/')) {
    const archived = checkArchivedChange(root, folder, specs);
    const changeIds = new Map([[folder.slice('openspec/changes/'.length), archived.ids]]);
    errors.push(...archived.errors, ...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));
  }
  return { specs, errors };
}

function documentMeasurement({ root, change, openSpec, snapshot, phase, manifest, base, adopts }) {
  const { specs, errors } = phase('specs', () => fileSpecs({ root, change, openSpec }));
  const folder = changeFolder(root, change);
  const trace = evaluateTrace({ specs, records: snapshot.records, assertions: snapshot.assertions, testFiles: snapshot.testFiles, change, changeFound: folder !== null });
  const qa = readQaRegister({ root, tracked: listTrackedFiles(root), manifest, readBaseFile: file => readFileAt(root, base, file), adopts });
  const tracked = listTrackedFiles(root).filter(file => existsSync(path.join(root, file)));
  const readFile = file => readFileSync(path.join(root, file), 'utf8');
  errors.push(...checkUntracked(listUntrackedFiles(root)));
  errors.push(...findCoverageFlags({ tracked, readFile }));
  return { ...snapshot, specs, trace, qaScripts: qa.scripts, errors: [...errors, ...trace.errors, ...qa.errors], links: buildLinks(trace.report), current: currentGaps({ coverage: snapshot.coverage, untraced: trace.untraced }) };
}

function location(item) {
  if (!item.file) return '';
  return item.line ? ` ${item.file}:${item.line}` : ` ${item.file}`;
}

function report(log, errors, warnings = []) {
  for (const item of warnings) log(`WARN ${item.code}${location(item)} ${item.message}`);
  for (const item of errors) log(`ERROR ${item.code}${location(item)} ${item.message}`);
  if (errors.length === 0) {
    log('Gates passed.');
    return 0;
  }
  log(`Gates failed with ${errors.length} errors.`);
  return 1;
}

function lintFindings(root, records) {
  const findings = lintProject({ root, records });
  const asItem = (item) => ({ code: item.rule, file: item.file, line: item.line, message: item.message });
  return {
    errors: findings.filter((item) => item.level === 'error').map(asItem),
    warnings: findings.filter((item) => item.level === 'warning').map(asItem),
    failed: hasErrors(findings),
  };
}

function readOptional(root, file) {
  const absolute = path.join(root, file);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : null;
}

/**
 * Run one gate command.
 *
 * @returns {number} Exit status.
 */
function runGateCommand({
  root,
  argv,
  nodeVersion = process.versions.node,
  spawn = spawnSync,
  now = new Date(),
  log = console.log,
  allocationFiles = ALLOCATION_TEST_FILES,
  env = process.env,
  openSpec = runOpenSpec,
  snapshot,
  gitSpawn,
  phase,
}) {
  const options = parseArgs(argv);
  const { command } = options;
  let { change } = options;
  const date = now.toISOString().slice(0, 10);

  if (command === 'lint') {
    const lint = lintFindings(root, []);
    for (const item of lint.warnings) log(`WARN ${item.code}${location(item)} ${item.message}`);
    for (const item of lint.errors) log(`ERROR ${item.code}${location(item)} ${item.message}`);
    log(`STE: ${lint.errors.length} errors, ${lint.warnings.length} warnings.`);
    return lint.failed ? 1 : 0;
  }

  const ownership = readOwnership(root);
  if (ownership.errors.length > 0) return report(log, ownership.errors);
  let { manifest } = ownership;
  if (command === 'report') {
    const ledger = readLedger(root);
    if (!ledger) return report(log, [{ code: 'GATES-NO-LEDGER', file: LEDGER_FILE, message: 'The report needs the ledger file.' }]);
    for (const line of gapReport(manifest, ledger)) log(line);
    return 0;
  }

  let base;
  try {
    base = resolveMergeBase(root, options.base || DEFAULT_BASE);
  } catch (error) {
    return report(log, [{ code: 'GATES-BASE', file: '', message: error.message }]);
  }

  const baseOwnership = readOwnership(root, base);
  if (baseOwnership.errors.length > 0) return report(log, baseOwnership.errors);
  manifest = baseOwnership.manifest;
  if (command === 'tree') {
    const folder = change && changeFolder(root, change);
    if (!folder) return report(log, [{ code: 'GATES-USAGE', file: '', message: 'The tree command needs --change with the name of a change' }]);
    log(computeTreeHash({ root, changeDir: folder, diffFiles: diffNames(root, base) }));
    return 0;
  }

  if (command === 'waive') {
    const { file, metric, lines, count, reason } = options;
    const tracked = new Set(listTrackedFiles(root));
    const isTracked = Boolean(file) && tracked.has(file);
    const sameAsBaseFile = isTracked && existsSync(path.join(root, file)) && readFileAt(root, base, file) === readFileSync(path.join(root, file), 'utf8');
    const folder = change && changeFolder(root, change);
    const active = Boolean(change) && Boolean(folder) && existsSync(path.join(root, folder, 'proposal.md'));
    const validMetric = ['lines', 'branches', 'functions'].includes(metric);
    const parsedLines = lines ? lines.split(',').map((item) => Number(item)) : [];
    const validLines = parsedLines.length > 0 && parsedLines.every((n) => Number.isInteger(n) && n > 0);
    const parsedCount = Number(count);
    const validCount = Number.isInteger(parsedCount) && parsedCount > 0;
    const validReason = Boolean(reason) && reason.trim().length > 0;

    const faults = [
      [!active, `Change "${change}" has no folder with a proposal.md file in openspec/changes`],
      [!isTracked, `Git does not track ${file}`],
      [sameAsBaseFile, `${file} has the base content. A waiver needs a changed file.`],
      [!validMetric, `Unknown metric "${metric}". The metrics are lines, branches, functions.`],
      [!validLines, `Line "${lines}" is not a positive whole number`],
      [!validCount, `Count "${count}" is not a positive whole number`],
      [!validReason, 'Reason is empty'],
    ];
    const fault = faults.find(([bad]) => bad);
    if (fault) {
      return report(log, [{ code: 'GATES-WAIVE', file: file || '', message: fault[1] }]);
    }

    const sha = contentHash(readFileSync(path.join(root, file), 'utf8'));
    const commit = headCommit(root);
    const waiverLine = { date, change, commit, kind: 'waiver', file, metric, sha, lines: parsedLines, count: parsedCount, reason };
    appendHistory(root, [waiverLine]);
    log(`Waiver: recorded ${parsedCount} ${metric} for ${file}.`);
    return report(log, []);
  }

  // The adopt command stops for a fault in its options before it runs a test. See the requirement "Adoption of merged code".
  const fromCommit = command === 'adopt' && options.from ? resolveCommit(root, options.from) : null;
  if (command === 'adopt') {
    const folder = change && changeFolder(root, change);
    const active = Boolean(change) && Boolean(folder) && existsSync(path.join(root, folder, 'proposal.md'));
    const faults = [
      [!active, `Change "${change}" has no folder with a proposal.md file in openspec/changes`],
      [!options.from, 'The adopt command needs --from with the merged commit'],
      [Boolean(options.from) && !fromCommit, `Git cannot find the commit ${options.from}`],
      [Boolean(fromCommit) && !isAdoptSource(root, base, fromCommit), `The commit ${options.from} is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.`],
      [!existsSync(path.join(root, LEDGER_FILE)), `${LEDGER_FILE} is not there. Run: node scripts/spec/gates.mjs init`],
    ];
    const fault = faults.find(([bad]) => bad);
    if (fault) return report(log, [{ code: 'GATES-ADOPT', file: '', message: fault[1] }]);
  }

  const pinned = readOptional(root, '.node-version');
  if (pinned === null) {
    return report(log, [{ code: 'GATES-RUNTIME', file: '.node-version', message: 'Add the file .node-version with the pinned Node version.' }]);
  }
  if (pinned.trim().replace(/^v/, '') !== nodeVersion) {
    return report(log, [{ code: 'GATES-RUNTIME', file: '.node-version', message: `Coverage counts differ between V8 versions. Run the gates on Node ${pinned.trim()} (make gates), not Node ${nodeVersion}.` }]);
  }
  const envFiles = localEnvFiles(root, new Set(listTrackedFiles(root)));
  if (envFiles.length > 0) {
    return report(
      log,
      envFiles.map((name) => ({ code: 'GATES-LOCAL-ENV', file: name, message: `The file ${name} can change the coverage of the tests. Make the file empty. When Git ignores the file, you can also run the gates with make.` })),
    );
  }
  if (command === 'ratchet' && !change) {
    return report(log, [{ code: 'GATES-USAGE', file: '', message: 'The ratchet command needs --change <name>' }]);
  }

  const diffFiles = diffNames(root, base);
  if (command === 'check' || command === 'ratchet') for (const line of ownershipAdvice(manifest, diffFiles)) log(line);
  const baseFiles = new Set(listFilesAt(root, base));
  const changedTests = diffFiles.filter((file) => isTestFile(file) && existsSync(path.join(root, file)));
  const readBaseTests = () => [...baseFiles].filter(isTestFile).map((file) => readFileAt(root, base, file));
  const changedTestIds = (records) =>
    idsOfChangedTests({ records, files: changedTests, readFile: (file) => readFileSync(path.join(root, file), 'utf8'), readBaseTests });
  const sameAsBase = (file) => existsSync(path.join(root, file)) && readFileAt(root, base, file) === readFileSync(path.join(root, file), 'utf8');
  // The ratchet command also runs for an archived change, because the archive command can remove
  // a requirement, and the trace files then need the scenarios and the links of the new specs.
  const changeFolderOf = changeFolder(root, change);
  const changeActive = Boolean(change) && change !== 'archive' && Boolean(changeFolderOf) && existsSync(path.join(root, changeFolderOf, 'proposal.md'));

  if (command === 'ci') {
    const plan = planCi({ activeChanges: listActiveChanges(root), diffFiles, baseFiles });
    if (plan.errors.length > 0) return report(log, plan.errors);
    change = plan.change;
    log(`CI: ${change ? `check the change ${change}` : 'check without a change'}.`);
  }

  let adopts;
  try {
    adopts = validAdoptSources({ root, base, history: readOptional(root, HISTORY_FILE) ?? '', baseHistory: readFileAt(root, base, HISTORY_FILE) ?? '', change });
  } catch (error) {
    return report(log, [{ code: error.code ?? 'LEDGER-ADOPT-FROM', file: HISTORY_FILE, message: error.message }]);
  }

  const baselineFolder = changeFolder(root, change);
  const baselineOptions = { change, changeActive: Boolean(baselineFolder) && existsSync(path.join(root, baselineFolder, 'proposal.md')), diffFiles, baseFiles, history: readOptional(root, HISTORY_FILE) ?? '', baseHistory: readFileAt(root, base, HISTORY_FILE) ?? '' };
  if (command === 'rebaseline') {
    const fault = baselineFault({ ...baselineOptions, changeActive: existsSync(path.join(root, 'openspec/changes', String(change), 'proposal.md')) });
    if (fault) return report(log, [{ code: 'GATES-REBASELINE', file: '', message: fault }]);
    if (!existsSync(path.join(root, LEDGER_FILE))) return report(log, [{ code: 'GATES-REBASELINE', file: LEDGER_FILE, message: 'The baseline needs the ledger file.' }]);
    if (readFileAt(root, base, LEDGER_FILE) === null) return report(log, [{ code: 'GATES-REBASELINE', file: LEDGER_FILE, message: 'The baseline needs the base ledger.' }]);
  }

  const measured = options.noMeasure
    ? documentMeasurement({ root, change, openSpec, snapshot, phase, manifest, base, adopts })
    : phase('measure', () => measure({ root, spawn, env, allocationFiles, change, openSpec, phase, manifest, base, adopts }));
  const { counts } = measured.trace.report;
  log(`Trace: ${counts.scenarios} scenarios, ${counts.verified} verified, ${counts.pending} open. ${counts.tests} tests, ${counts.traced} traced, ${counts.untraced} untraced.`);
  for (const line of qaAdvice({ root, change, scripts: measured.qaScripts })) log(line);
  const notLoaded = measured.coverage.filter((item) => !item.loaded && !item.complete).length;
  const complete = measured.coverage.filter((item) => item.complete).length;
  log(`Coverage: ${measured.coverage.length} files, ${complete} complete, ${notLoaded} not loaded, ${measured.untrue.size} untrue.`);

  if (command === 'init') {
    if (measured.errors.length > 0) return report(log, measured.errors);
    try {
      initLedger({ root, current: measured.current, date, baseHasLedger: readFileAt(root, base, LEDGER_FILE) !== null, baseFiles });
    } catch (error) {
      return report(log, [{ code: 'GATES-INIT', file: LEDGER_FILE, message: error.message }]);
    }
    log(`Ledger: wrote ${LEDGER_FILE}.`);
    return report(log, []);
  }

  let ledger = readLedger(root);
  if (!ledger) return report(log, [...measured.errors, { code: 'GATES-NO-LEDGER', file: LEDGER_FILE, message: 'Run: node scripts/spec/gates.mjs init' }]);

  let historyText = readOptional(root, HISTORY_FILE) ?? '';
  const baseHistoryText = readFileAt(root, base, HISTORY_FILE) ?? '';
  const waivers = waiversOf(historyText, baseHistoryText, change);
  if (command === 'check' || command === 'ratchet') for (const line of gapReport(manifest, ledger)) log(line);

  if (command === 'check' || command === 'ratchet' || command === 'ci') {
    let changed;
    try {
      const scoped = syncChangedLines({ root, base, files: diffFiles.filter(file => measured.inventory.includes(file)), history: historyText, baseHistory: baseHistoryText, change });
      changed = scoped.changed;
      log(scoped.advice);
    } catch (error) {
      return report(log, [{ code: 'COVERAGE-DIFF', file: '', message: error.message }]);
    }
    measured.errors.push(...coverageFaults({ manifest, coverage: measured.coverage, changed, lineCoverage: measured.lineCoverage, waivers, ledger, changedFiles: diffFiles.filter(file => !sameAsBase(file)) }));
  }

  const baseLedger = parseLedger(readFileAt(root, base, LEDGER_FILE));
  const codeFiles = new Set(codeInventory(listTrackedFiles(root)));
  const reachedByCommit = new Map();
  const reachedValid = (file, from, changed) => {
    if (!reachedByCommit.has(from)) {
      const reachOf = importReach({ files: [...codeFiles], readFile: (name) => readFileSync(path.join(root, name), 'utf8'), baseFiles: listFilesAt(root, base), readBaseFile: (name) => readFileAt(root, base, name), fromFiles: listFilesAt(root, from), readFromFile: (name) => readFileAt(root, from, name) });
      reachedByCommit.set(from, reachOf(changed));
    }
    return adoptableReached({ file, codeFiles, sameAsBase, current: measured.current, baseLedger, reached: reachedByCommit.get(from) });
  };

  if (command === 'rebaseline') {
    if (measured.errors.length > 0) return report(log, measured.errors);
    const result = rebaselineLedger({ ledger, baseLedger, coverage: measured.coverage, sameAsBase, change, date, commit: headCommit(root) });
    if (result.history.length === 0) return report(log, [{ code: 'GATES-REBASELINE', file: LEDGER_FILE, message: 'The baseline gives no different metric values.' }]);
    writeLedger(root, result.ledger);
    appendHistory(root, result.history);
    for (const file of result.files) log(`Baseline: ${file}.`);
    return report(log, []);
  }

  if (command === 'adopt') {
    const merged = changedByCommit(root, base, fromCommit);
    const qaCandidates = [...measured.qaScripts.map(script => script.file), ...measured.errors.filter(error => error.code === 'QA-HEADER').map(error => error.file)];
    const qaFiles = qaCandidates.filter(file => merged.has(file) &&
      adoptableQaScript({ file, text: readFileSync(path.join(root, file), 'utf8'), baseText: readFileAt(root, base, file), manifest }));
    const errors = measured.errors.filter(error => error.code !== 'QA-HEADER' || !qaFiles.includes(error.file));
    if (errors.length > 0) return report(log, errors);
    const result = adoptLedger({
      ledger,
      current: { ...measured.current, coverage: new Map([...measured.current.coverage].filter(([file]) => !qaFiles.includes(file))) },
      eligible: (file) => merged.has(file) && !sameAsBase(file),
      reached: (file) => reachedValid(file, fromCommit, merged),
      change,
      date,
      commit: headCommit(root),
      from: fromCommit,
    });
    for (const file of qaFiles) {
      result.history.push({ date, change, commit: headCommit(root), kind: 'adopt', file, from: fromCommit, lines: 0, branches: 0, functions: 0, untraced: 0, untrue: false });
    }
    writeLedger(root, result.ledger);
    appendHistory(root, result.history);
    log(`Adopt: ${result.history.length} files from ${fromCommit}.`);
    return report(log, []);
  }

  const compareStart = phase('compare');
  let baseline = checkRebaseline({ ...baselineOptions, change, ledger, baseLedger, coverage: measured.coverage, sameAsBase });

  if (command === 'ratchet') {
    if (baseline.errors.length > 0) return report(log, baseline.errors);
    if (measured.errors.length > 0) return report(log, measured.errors);
    const registry = updateRegistry({
      registry: readRegistry(root),
      scenarios: measured.specs.scenarios,
      retired: measured.specs.retired,
      changedTestIds: changedTestIds(measured.records),
      change,
      date,
    });
    if (registry.errors.length > 0) return report(log, registry.errors);
    let result;
    try {
      result = ratchetLedger({
        sameAsBase,
        ledger,
        current: measured.current,
        inventory: measured.inventory,
        testFiles: measured.testFiles,
        change,
        changeActive,
        date,
        commit: headCommit(root),
        waivers,
      });
    } catch (error) {
      return report(log, [{ code: 'GATES-RATCHET', file: LEDGER_FILE, message: error.message }]);
    }
    const difference = changedInputs(root, headCommit(root), gitSpawn);
    if (difference.reason) return report(log, [{ code: 'GATES-RATCHET', file: HISTORY_FILE, message: difference.reason }]);
    const dirty = difference.files;
    writeLedger(root, result.ledger);
    const measurement = writeMeasurement(root, measured);
    const previous = historyText.split('\n').filter(Boolean).map(JSON.parse).findLast(line => line.change === change);
    const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);
    const history = result.history.length > 0 ? result.history : unchanged ? [] : [{ date, change, commit: headCommit(root), kind: 'measurement' }];
    appendHistory(root, history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) })));
    writeRegistry(root, registry.registry);
    writeLinks(root, measured.links);
    log(`Ratchet: ${history.length} history lines for ${change}.`);
    ledger = readLedger(root);
    historyText = readOptional(root, HISTORY_FILE);
    baseline = checkRebaseline({ ...baselineOptions, history: historyText, change, ledger, baseLedger, coverage: measured.coverage, sameAsBase });
  }

  const comparison = compareLedger({ ledger, current: measured.current, sameAsBase, waivers });
  const adoption = checkAdopts({
    adopts: adoptsOf(historyText, baseHistoryText, change),
    isMergedCommit: (from) => isAdoptSource(root, base, from),
    changedFiles: (from) => changedByCommit(root, base, from),
    reachedValid,
  });
  const baseErrors = compareWithBase({
    ledger,
    baseLedger: baseline.baseLedger,
    retired: [...measured.specs.retired],
    baseRetired: JSON.parse(readFileAt(root, base, RETIRED_FILE) ?? '[]'),
    history: historyText,
    baseHistory: baseHistoryText,
    sameAsBase,
    change,
    adopted: adoptedCounts(adoption.valid),
  });
  const registry = readRegistry(root);
  const registryErrors = [
    ...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),
    ...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),
    ...checkLinks({ links: readLinks(root), current: measured.links }),
  ];
  compareStart();
  const lint = phase('lint', () => lintFindings(root, measured.records));
  const folder = change ? changeFolder(root, change) : null;
  const reviewFiles = command === 'ratchet' ? diffNames(root, base) : diffFiles;
  const reviews = phase('review', () => [
    ...checkArchivedReviews(root, { except: folder }),
    ...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles: reviewFiles }) }) : []),
    ...checkChangeNames(root),
    ...checkAgents(root),
    ...checkReviewCommand(root),
  ]);
  log(`Ledger: ${comparison.stale.length} entries do not match the current gaps.`);
  log(`STE: ${lint.errors.length} errors, ${lint.warnings.length} warnings.`);
  const status = report(log, [...measured.errors, ...comparison.errors, ...baseErrors, ...baseline.errors, ...adoption.errors, ...registryErrors, ...lint.errors, ...reviews], lint.warnings);
  return command === 'ratchet' && status !== 0 ? 2 : status;
}

/** Run a gate command with its command name and UTC times. */
export function runGates(options) {
  const parsed = parseArgs(options.argv);
  const log = options.log ?? console.log;
  const timed = parsed.command === 'check' || parsed.command === 'ratchet';
  if (!timed) return runGateCommand({ ...options, phase: (_name, fn) => fn ? fn() : () => {} });
  const clock = options.clock ?? (() => new Date());
  const started = clock();
  const trusted = parsed.noMeasure ? trustMeasurement(options.root, parsed.change, options.gitSpawn) : null;
  if (parsed.noMeasure) {
    log(trusted.reason ? 'NO TEST RUN: refused' : `NO TEST RUN: the mode trusts the snapshot of commit ${trusted.commit}`);
  } else {
    log(`Command: ${parsed.command}`);
  }
  log(`Started: ${started.toISOString()}`);
  const phase = (name, fn) => {
    const start = clock();
    const finish = () => {
      const seconds = (clock().getTime() - start.getTime()) / 1000;
      if (seconds > 1) log(`Phase ${name}: ${seconds} s`);
    };
    if (!fn) return finish;
    const result = fn();
    finish();
    return result;
  };
  try {
    if (trusted?.reason) {
      log(trusted.reason);
      for (const file of trusted.files) log(file);
      log(`Ratchet commit: ${trusted.commit}`);
      return 2;
    }
    return runGateCommand({ ...options, phase, snapshot: trusted?.measured });
  } finally {
    const finished = clock();
    log(`Finished: ${finished.toISOString()} (${(finished.getTime() - started.getTime()) / 1000} s)`);
  }
}

if (import.meta.url === pathToFileURL(path.resolve(String(process.argv[1]))).href) {
  try {
    const { root } = parseArgs(process.argv.slice(2));
    const argv = process.argv.slice(2).filter((arg, index, all) => arg !== '--root' && all[index - 1] !== '--root');
    process.exitCode = runGates({ root: path.resolve(root || process.cwd()), argv });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
