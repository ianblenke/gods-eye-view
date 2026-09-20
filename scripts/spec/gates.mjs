#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ALLOCATION_TEST_FILES } from '../run-unit-tests.mjs';
import { planCi } from './lib/ci.mjs';
import { contentHash, findCoverageFlags, findIgnoreComments, findTestImports, measureCoverage, parseLcov, untrueFiles } from './lib/coverage.mjs';
import { diffNames, headCommit, listFilesAt, readFileAt, resolveMergeBase } from './lib/git.mjs';
import { checkUntracked, codeInventory, isTestFile, listTrackedFiles, listUntrackedFiles, testInventory } from './lib/inventory.mjs';
import {
  HISTORY_FILE,
  LEDGER_FILE,
  RETIRED_FILE,
  appendHistory,
  compareLedger,
  compareWithBase,
  currentGaps,
  initLedger,
  parseLedger,
  ratchetLedger,
  readLedger,
  writeLedger,
} from './lib/ledger.mjs';
import { buildLinks, checkLinks, checkRegistry, compareRegistryWithBase, idsOfChangedTests, readLinks, readRegistry, updateRegistry, writeLinks, writeRegistry } from './lib/registry.mjs';
import { changeFolder, checkAgents, checkArchivedReviews, checkChangeNames, checkChangeReview, checkReviewCommand, computeTreeHash } from './lib/review.mjs';
import { lintSpecs, tasksReader } from './lib/spec-lint.mjs';
import { checkOpenSpec, runOpenSpec } from './lib/openspec.mjs';
import { checkArchivedChange, listActiveChanges, loadSpecs } from './lib/specs.mjs';
import { hasErrors, lintProject } from './lib/ste.mjs';
import { GUARD_PRELOAD } from './lib/test-guard.mjs';
import { assertionKey, evaluateTrace, writeTraceReport } from './lib/trace.mjs';

const REPORTER = fileURLToPath(new URL('./lib/trace-reporter.mjs', import.meta.url));
const RUNNER = fileURLToPath(new URL('./lib/run-parallel.mjs', import.meta.url));
const OUT_DIR = '.gev-cache/spec';
const DEFAULT_BASE = 'origin/main';
const LOCAL_ENV_FILE = /^\.env(\..+)?$/;
const COMMANDS = new Set(['check', 'ci', 'init', 'ratchet', 'lint', 'tree']);
const OPTIONS = new Set(['--change', '--base', '--root']);
const USAGE = 'Usage: node scripts/spec/gates.mjs <check|ci|init|ratchet|lint|tree> [--change <name>] [--base <ref>] [--root <dir>]';

/** Read the command line. Throws the usage text for a bad command line. */
export function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!COMMANDS.has(command)) throw new Error(USAGE);
  const options = { command, change: undefined, base: undefined, root: undefined };
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index];
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
export function buildTestRuns({ testFiles, allocationFiles = ALLOCATION_TEST_FILES, outDir }) {
  const allocation = new Set(allocationFiles);
  const main = testFiles.filter((file) => !allocation.has(file));
  const runs = [];
  if (main.length > 0) {
    runs.push({
      kind: 'main',
      output: `${outDir}/tests-main.jsonl`,
      args: [
        '--test',
        '--experimental-test-coverage',
        '--test-force-exit',
        '--test-coverage-exclude=**/*.test.mjs',
        '--test-reporter=dot',
        '--test-reporter-destination=stdout',
        '--test-reporter=lcov',
        `--test-reporter-destination=${outDir}/lcov.info`,
        `--test-reporter=${REPORTER}`,
        `--test-reporter-destination=${outDir}/tests-main.jsonl`,
        ...main,
      ],
    });
  }
  testFiles
    .filter((file) => allocation.has(file))
    .forEach((file, index) => {
      const output = `${outDir}/tests-allocation-${index}.jsonl`;
      runs.push({
        kind: 'allocation',
        output,
        args: [
          '--expose-gc',
          '--test',
          '--test-concurrency=1',
          '--test-force-exit',
          '--test-reporter=dot',
          '--test-reporter-destination=stdout',
          `--test-reporter=${REPORTER}`,
          `--test-reporter-destination=${output}`,
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

function readJsonLines(directory, files) {
  return files.flatMap((file) => {
    const absolute = path.join(directory, file);
    return existsSync(absolute) ? readFileSync(absolute, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
  });
}

/** Start the test runs at the same time with the parallel runner. */
function executeRuns({ runs, root, outDir, resultsDir, env, spawn, inventoryHash }) {
  const runsFile = path.join(resultsDir, 'runs.json');
  const resultsFile = path.join(resultsDir, 'results.json');
  writeFileSync(runsFile, JSON.stringify(runs.map((run) => ({ args: run.args, cwd: root }))));
  const result = spawn(process.execPath, [RUNNER, runsFile, resultsFile], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'], env: childEnv(env, { outDir, root, inventoryHash }) });
  if (result.error || result.status !== 0 || !existsSync(resultsFile)) {
    const detail = result.error ? `: ${result.error.message}` : '';
    return { errors: [{ code: 'GATES-TEST-RUN', file: '', message: `The test runner stopped with status ${result.status}${detail}` }], results: [] };
  }
  const results = JSON.parse(readFileSync(resultsFile, 'utf8'));
  const errors = runs.flatMap((run, index) => {
    const { status, error } = results[index];
    if (!error && (status === 0 || existsSync(run.output))) return [];
    return [{ code: 'GATES-TEST-RUN', file: '', message: `The ${run.kind} test run stopped with status ${status}${error ? `: ${error}` : ''}` }];
  });
  return { errors, results };
}

/** A run with a status that is not 0 must have a failed test in its result file. */
function checkFailedRuns(runs, results, recordsByRun) {
  return runs.flatMap((run, index) => {
    const result = results[index];
    if (!result || result.error || result.status === 0 || !existsSync(run.output)) return [];
    if (recordsByRun[index].some((record) => record.status === 'fail')) return [];
    return [{ code: 'GATES-TEST-RUN', file: '', message: `The ${run.kind} test run stopped with status ${result.status}, but no test in its result file failed` }];
  });
}

/** Run the tests and measure specs, trace and coverage. */
function measure({ root, spawn, env, allocationFiles, change, openSpec }) {
  const errors = [];
  const tracked = listTrackedFiles(root).filter((file) => existsSync(path.join(root, file)));
  const inventory = codeInventory(tracked);
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
  const runs = buildTestRuns({ testFiles, allocationFiles, outDir: resultsDir });
  const execution = executeRuns({ runs, root, outDir, resultsDir, env, spawn, inventoryHash: contentHash(inventoryText) });
  errors.push(...execution.errors);
  if (!existsSync(inventoryFile) || readFileSync(inventoryFile, 'utf8') !== inventoryText) {
    errors.push({ code: 'COVERAGE-INVENTORY-CHANGED', file: path.relative(root, inventoryFile), message: 'The inventory file changed during the test run' });
  }

  const named = new Set(['runs.json', 'results.json', 'lcov.info', ...runs.map((run) => path.basename(run.output))]);
  for (const file of readdirSync(resultsDir).filter((name) => !named.has(name)).sort()) {
    errors.push({ code: 'COVERAGE-EXTRA-RESULT', file, message: `The result folder has ${file}, but the gate did not name it. The gate does not read it.` });
  }
  const recordsByRun = runs.map((run) => readJsonLines(resultsDir, [path.basename(run.output)]));
  const records = recordsByRun.flat();
  errors.push(...checkFailedRuns(runs, execution.results, recordsByRun));
  const lcovText = existsSync(path.join(resultsDir, 'lcov.info')) ? readFileSync(path.join(resultsDir, 'lcov.info'), 'utf8') : null;
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

  return { errors, inventory, testFiles, records, coverage, specs, trace, links: buildLinks(trace.report), untrue, current: currentGaps({ coverage, untraced: trace.untraced }) };
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
export function runGates({
  root,
  argv,
  nodeVersion = process.versions.node,
  spawn = spawnSync,
  now = new Date(),
  log = console.log,
  allocationFiles = ALLOCATION_TEST_FILES,
  env = process.env,
  openSpec = runOpenSpec,
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

  let base;
  try {
    base = resolveMergeBase(root, options.base || DEFAULT_BASE);
  } catch (error) {
    return report(log, [{ code: 'GATES-BASE', file: '', message: error.message }]);
  }

  if (command === 'tree') {
    const folder = change && changeFolder(root, change);
    if (!folder) return report(log, [{ code: 'GATES-USAGE', file: '', message: 'The tree command needs --change with the name of a change' }]);
    log(computeTreeHash({ root, changeDir: folder, diffFiles: diffNames(root, base) }));
    return 0;
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

  const measured = measure({ root, spawn, env, allocationFiles, change, openSpec });
  const { counts } = measured.trace.report;
  log(`Trace: ${counts.scenarios} scenarios, ${counts.verified} verified, ${counts.pending} open. ${counts.tests} tests, ${counts.traced} traced, ${counts.untraced} untraced.`);
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

  const ledger = readLedger(root);
  if (!ledger) return report(log, [...measured.errors, { code: 'GATES-NO-LEDGER', file: LEDGER_FILE, message: 'Run: node scripts/spec/gates.mjs init' }]);

  if (command === 'ratchet') {
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
      });
    } catch (error) {
      return report(log, [{ code: 'GATES-RATCHET', file: LEDGER_FILE, message: error.message }]);
    }
    writeLedger(root, result.ledger);
    appendHistory(root, result.history);
    writeRegistry(root, registry.registry);
    writeLinks(root, measured.links);
    log(`Ratchet: ${result.history.length} history lines for ${change}.`);
    return report(log, []);
  }

  const comparison = compareLedger({ ledger, current: measured.current, sameAsBase });
  const baseErrors = compareWithBase({
    ledger,
    baseLedger: parseLedger(readFileAt(root, base, LEDGER_FILE)),
    retired: [...measured.specs.retired],
    baseRetired: JSON.parse(readFileAt(root, base, RETIRED_FILE) ?? '[]'),
    history: readOptional(root, HISTORY_FILE) ?? '',
    baseHistory: readFileAt(root, base, HISTORY_FILE) ?? '',
    sameAsBase,
    change,
  });
  const registry = readRegistry(root);
  const registryErrors = [
    ...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),
    ...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),
    ...checkLinks({ links: readLinks(root), current: measured.links }),
  ];
  const lint = lintFindings(root, measured.records);
  const folder = change ? changeFolder(root, change) : null;
  const reviews = [
    ...checkArchivedReviews(root, { except: folder }),
    ...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles }) }) : []),
    ...checkChangeNames(root),
    ...checkAgents(root),
    ...checkReviewCommand(root),
  ];
  log(`Ledger: ${comparison.stale.length} entries do not match the current gaps.`);
  log(`STE: ${lint.errors.length} errors, ${lint.warnings.length} warnings.`);
  return report(log, [...measured.errors, ...comparison.errors, ...baseErrors, ...registryErrors, ...lint.errors, ...reviews], lint.warnings);
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
