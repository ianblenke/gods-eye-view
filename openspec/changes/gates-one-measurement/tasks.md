## 1. Scenario tests

- [x] 1.1 Write the tests for `change-review-033`.
- [x] 1.2 Write the tests for `ci-gates-011`.
- [x] 1.3 Write the tests for `ci-gates-012`.
- [x] 1.4 Write the tests for `coverage-gate-068`.
- [x] 1.5 Write the tests for `coverage-gate-069`.
- [x] 1.6 Write the tests for `coverage-gate-070`.
- [x] 1.7 Write the tests for `coverage-gate-071`.
- [x] 1.8 Write the tests for `coverage-gate-072`.
- [x] 1.9 Write the tests for `coverage-gate-073`.
- [x] 1.10 Write the tests for `coverage-gate-074`.
- [x] 1.11 Write the tests for `coverage-gate-075`.
- [x] 1.12 Write the tests for `coverage-gate-076`.
- [x] 1.13 Write the tests for `coverage-gate-077`.
- [x] 1.14 Write the tests for `coverage-gate-078`.
- [x] 1.15 Write the tests for `coverage-gate-079`.
- [x] 1.16 Write the tests for `coverage-gate-080`.
- [x] 1.17 Write the tests for `coverage-gate-081`.
- [x] 1.18 Write the tests for `coverage-gate-082`.
- [x] 1.19 Write the tests for `coverage-gate-083`.
- [x] 1.20 Write the tests for `coverage-gate-084`.
- [x] 1.21 Write the tests for `coverage-gate-085`.
- [x] 1.22 Write the tests for `coverage-gate-086`.
- [x] 1.23 Write the tests for `coverage-gate-087`.
- [x] 1.24 Write the tests for `coverage-gate-088`.
- [x] 1.25 Write the tests for `coverage-gate-089`.
- [x] 1.26 Write the tests for `coverage-gate-090`.
- [x] 1.27 Write the tests for `coverage-gate-091`.
- [x] 1.28 Write the tests for `coverage-gate-092`.
- [x] 1.29 Write the tests for `coverage-gate-093`.
- [x] 1.30 Write the tests for `coverage-gate-094`.
- [x] 1.31 Write the tests for `coverage-gate-097`.
- [x] 1.32 Write the tests for `coverage-gate-095`.
- [x] 1.33 Write the tests for `coverage-gate-096`.
- [x] 1.34 Write the tests for `gap-ledger-123`.
- [x] 1.35 Write the tests for `gap-ledger-124`.
- [x] 1.36 Write the tests for `gap-ledger-125`.
- [x] 1.37 Write the tests for `gap-ledger-126`.
- [x] 1.38 Write the tests for `gap-ledger-127`.
- [x] 1.39 Write the tests for `gap-ledger-128`.
- [x] 1.40 Write the tests for `gap-ledger-129`.
- [x] 1.41 Write the tests for `gap-ledger-130`.
- [x] 1.42 Write the tests for `gap-ledger-131`.
- [x] 1.43 Write the tests for `gap-ledger-132`.
- [x] 1.44 Write the tests for `gap-ledger-133`.
- [x] 1.45 Write the tests for `gap-ledger-134`.

## 1A. Mutation tests

- [x] 1A.1 Test mutation `068-tests`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ? documentMeasurement({ root, change, openSpec, snapshot, phase })
  ```

  ```text
  ? phase('measure', () => measure({ root, spawn, env, allocationFiles, change, openSpec, phase }))
  ```

- [x] 1A.2 Test mutation `123-twice`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
    const { counts } = measured.trace.report;
  ```

  ```text
    if (command === 'ratchet') measure({ root, spawn, env, allocationFiles, change, openSpec, phase });
    const { counts } = measured.trace.report;
  ```

- [x] 1A.3 Test mutation `124-review`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles }) }) : []),
  ```

  ```text
  ...[],
  ```

- [x] 1A.4 Test mutation `125-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  return command === 'ratchet' && status !== 0 ? 2 : status;
  ```

  ```text
  return command === 'ratchet' ? 2 : status;
  ```

- [x] 1A.5 Test mutation `126-ledger`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
      ledger = readLedger(root);
  ```

  ```text
      ledger = ledger;
  ```

- [x] 1A.6 Test mutation `069-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    return inventory.has(file);
  ```

  ```text
    return false;
  ```

- [x] 1A.7 Test mutation `070-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (isTestFile(file)) return true;
  ```

  ```text
    if (isTestFile(file)) return false;
  ```

- [x] 1A.8 Test mutation `071-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (/^scripts\/qa-.*\.mjs$/.test(file)) return true;
  ```

  ```text
    if (/^scripts\/qa-.*\.mjs$/.test(file)) return false;
  ```

- [x] 1A.9 Test mutation `072-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (file === 'package-lock.json') return true;
  ```

  ```text
    if (file === 'package-lock.json') return false;
  ```

- [x] 1A.10 Test mutation `073-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (file === '.node-version') return true;
  ```

  ```text
    if (file === '.node-version') return false;
  ```

- [x] 1A.11 Test mutation `074-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (file === 'Makefile') return true;
  ```

  ```text
    if (file === 'Makefile') return false;
  ```

- [x] 1A.12 Test mutation `075-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (/(^|\/)Dockerfile[^/]*$/.test(file)) return true;
  ```

  ```text
    if (/(^|\/)Dockerfile[^/]*$/.test(file)) return false;
  ```

- [x] 1A.13 Test mutation `076-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (/(^|\/)[^/]*compose[^/]*\.ya?ml$/.test(file)) return true;
  ```

  ```text
    if (/(^|\/)[^/]*compose[^/]*\.ya?ml$/.test(file)) return false;
  ```

- [x] 1A.14 Test mutation `077-path`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (file.startsWith('scripts/spec/')) return true;
  ```

  ```text
    if (file.startsWith('scripts/spec/')) return false;
  ```

- [x] 1A.15 Test mutation `078-untracked`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  const others = spawn('git', ['ls-files', '--others', '--exclude-standard', '-z'], options);
  ```

  ```text
  const others = { status: 0, stdout: '' };
  ```

- [x] 1A.16 Test mutation `079-history`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  ['coverage', 'untraced', 'measurement'].includes(item.kind)
  ```

  ```text
  true
  ```

- [x] 1A.17 Test mutation `079-change`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  item.change === change &&
  ```

  ```text
  true &&
  ```

- [x] 1A.18 Test mutation `080-commit`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  resolveCommit(root, line.commit) : null
  ```

  ```text
  resolveCommit(root, 'HEAD') : null
  ```

- [x] 1A.19 Test mutation `081-words`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

  ```text
  file && file !== 'openspec/ste/words.json' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

- [x] 1A.20 Test mutation `082-hash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  if (contentHash(text) !== line.measurement)
  ```

  ```text
  if (false)
  ```

- [x] 1A.21 Test mutation `082-absent`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  if (!existsSync(absolute)) return
  ```

  ```text
  if (false) return
  ```

- [x] 1A.22 Test mutation `083-start`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
    log(`Started: ${started.toISOString()}`);
  ```

  ```text
    log('Started: wrong');
  ```

- [x] 1A.23 Test mutation `083-finish`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  log(`Finished: ${finished.toISOString()} (${(finished.getTime() - started.getTime()) / 1000} s)`);
  ```

  ```text
  log('Finished: wrong');
  ```

- [x] 1A.24 Test mutation `084-cutoff`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  if (seconds > 1) log
  ```

  ```text
  if (seconds >= 1) log
  ```

- [x] 1A.25 Test mutation `084-phase`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  log(`Phase ${name}: ${seconds} s`)
  ```

  ```text
  log(`Phase wrong: ${seconds} s`)
  ```

- [x] 1A.26 Test mutation `085-links`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...checkLinks({ links: readLinks(root), current: measured.links }),
  ```

  ```text
  ...[],
  ```

- [x] 1A.27 Test mutation `085-registry`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),
  ```

  ```text
  ...[],
  ```

- [x] 1A.28 Test mutation `085-specs`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  errors.push(...lintSpecs({ requirements: specs.requirements, orphans: specs.orphans, changeIds: specs.changeIds, readTasks: tasksReader(root) }));
  ```

  ```text
  errors.push();
  ```

- [x] 1A.29 Test mutation `085-lint`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const lint = phase('lint', () => lintFindings(root, measured.records));
  ```

  ```text
  const lint = { errors: [], warnings: [], failed: false };
  ```

- [x] 1A.30 Test mutation `011-precheck`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/check-import-directions.mjs &&
  ```

  ```text
  true &&
  ```

- [x] 1A.31 Test mutation `012-docs`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  check --no-measure $(CHANGE_ARG) $(BASE_ARG)
  ```

  ```text
  check $(CHANGE_ARG) $(BASE_ARG)
  ```

- [x] 1A.32 Test mutation `033-final`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  Then run `make gates CHANGE=<name>` on the final tree.
  ```

  ```text
  Then continue on the final tree.
  ```

- [x] 1A.33 Test mutation `068-own-option`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  options.noMeasure = true;
  ```

  ```text
  options.noMeasure = undefined;
  ```

- [x] 1A.34 Test mutation `068-dependencies`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  !/(^|\/)node_modules\//.test(file) &&
  ```

  ```text
  ```

- [x] 1A.35 Test mutation `086-package`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
    if (file === 'package.json') return true;
  ```

  ```text
    if (file === 'package.json') return false;
  ```

- [x] 1A.36 Test mutation `087-diff`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  diff.status !== 0 || others.status !== 0
  ```

  ```text
  false || others.status !== 0
  ```

- [x] 1A.37 Test mutation `087-others`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  diff.status !== 0 || others.status !== 0
  ```

  ```text
  diff.status !== 0 || false
  ```

- [x] 1A.38 Test mutation `085-openspec`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  errors.push(...checkOpenSpec({ root, specs, run: (args) => openSpec(root, args) }));
  ```

  ```text
  errors.push();
  ```

- [x] 1A.39 Test mutation `085-archive`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  errors.push(...archived.errors, ...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));
  ```

  ```text
  errors.push(...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));
  ```

- [x] 1A.40 Test mutation `085-filters`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  errors.push(...findCoverageFlags({ tracked, readFile }));
  ```

  ```text
  errors.push();
  ```

- [x] 1A.41 Test mutation `126-totals`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/ledger.mjs`.

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  ```text
  'LEDGER-STALE', 'LEDGER-VERSION'
  ```

- [x] 1A.42 Test mutation `126-stale`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/ledger.mjs`.

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  ```text
  'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

- [x] 1A.43 Test mutation `126-version`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/ledger.mjs`.

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS'
  ```

- [x] 1A.44 Test mutation `012-copy`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json
  ```

  ```text
  true
  ```

- [x] 1A.45 Test mutation `068-command-option`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  key === '--no-measure' && command === 'check'
  ```

  ```text
  key === '--no-measure' && true
  ```

- [x] 1A.46 Test mutation `124-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  return command === 'ratchet' && status !== 0 ? 2 : status;
  ```

  ```text
  return status;
  ```

- [x] 1A.47 Test mutation `083-check-time`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const timed = parsed.command === 'check' || parsed.command === 'ratchet';
  ```

  ```text
  const timed = parsed.command === 'ratchet';
  ```

- [x] 1A.48 Test mutation `083-ratchet-time`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const timed = parsed.command === 'check' || parsed.command === 'ratchet';
  ```

  ```text
  const timed = parsed.command === 'check';
  ```

- [x] 1A.49 Test mutation `084-elapsed`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  (finished.getTime() - started.getTime()) / 1000
  ```

  ```text
  (finished.getTime() - started.getTime()) / 1
  ```

- [x] 1A.50 Test mutation `127-history`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  unchanged ? [] : [{ date, change, commit: headCommit(root), kind: 'measurement' }]
  ```

  ```text
  []
  ```

- [x] 1A.51 Test mutation `127-stamp`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) }))
  ```

  ```text
  history.map(line => ({ ...line, ...(dirty.length > 0 ? { dirty } : {}) }))
  ```

- [x] 1A.52 Test mutation `128-same`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);
  ```

  ```text
  const unchanged = false;
  ```

- [x] 1A.53 Test mutation `129-hash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  previous?.measurement === measurement && previous.commit === headCommit(root)
  ```

  ```text
  true && previous.commit === headCommit(root)
  ```

- [x] 1A.54 Test mutation `129-commit`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  previous?.measurement === measurement && previous.commit === headCommit(root)
  ```

  ```text
  previous?.measurement === measurement && true
  ```

- [x] 1A.55 Test mutation `129-change`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  findLast(line => line.change === change)
  ```

  ```text
  findLast(line => true)
  ```

- [x] 1A.56 Test mutation `011-format`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/format.mjs --check &&
  ```

  ```text
  true &&
  ```

- [x] 1A.57 Test mutation `011-boundaries`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/check-package-boundaries.mjs &&
  ```

  ```text
  true &&
  ```

- [x] 1A.58 Test mutation `011-tokens`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/check-layer-state-tokens.mjs --base-ref origin/main
  ```

  ```text
  true
  ```

- [x] 1A.59 Test mutation `069-tracked`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

  ```text
  file && file !== 'src/new.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

- [x] 1A.60 Test mutation `069-base`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

  ```text
  file && file !== 'src/math.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

- [x] 1A.61 Test mutation `078-inventory`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

  ```text
  file && file !== 'src/new.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))
  ```

- [x] 1A.62 Test mutation `085-base`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const baseErrors = compareWithBase({
  ```

  ```text
  const baseErrors = (() => [])({
  ```

- [x] 1A.63 Test mutation `085-ledger`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const comparison = compareLedger({ ledger, current: measured.current, sameAsBase, waivers });
  ```

  ```text
  const comparison = { errors: [], stale: [] };
  ```

- [x] 1A.64 Test mutation `085-base-registry`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),
  ```

  ```text
  ...[],
  ```

- [x] 1A.65 Test mutation `085-archive-reviews`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...checkArchivedReviews(root, { except: folder }),
  ```

  ```text
  ...[],
  ```

- [x] 1A.66 Test mutation `085-names`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...checkChangeNames(root),
  ```

  ```text
  ...[],
  ```

- [x] 1A.67 Test mutation `085-agents`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...checkAgents(root),
  ```

  ```text
  ...[],
  ```

- [x] 1A.68 Test mutation `085-command`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...checkReviewCommand(root),
  ```

  ```text
  ...[],
  ```

- [x] 1A.69 Test mutation `033-precheck`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  1. Run `make precheck`.
  ```

  ```text
  1. Continue.
  ```

- [x] 1A.70 Test mutation `033-step1`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  Then run `make gates-docs CHANGE=<name>`.
  ```

  ```text
  Then continue.
  ```

- [x] 1A.71 Test mutation `033-step3`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  3. Run `make gates-docs CHANGE=<name>` again.
  ```

  ```text
  3. Continue again.
  ```

- [x] 1A.72 Test mutation `033-step10`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  Use `make gates-docs CHANGE=<name>` and start again at step 3.
  ```

  ```text
  Start again at step 3.
  ```

- [x] 1A.73 Test mutation `033-step11`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  Then run `make gates-docs CHANGE=<name>`, which must give only review errors.
  ```

  ```text
  Then continue.
  ```

- [x] 1A.74 Test mutation `033-step15`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  15. Run `make gates-docs CHANGE=<name>`.
  ```

  ```text
  15. Continue.
  ```

- [x] 1A.75 Test mutation `033-ci`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  CI must also pass before you merge.
  ```

  ```text
  Continue.
  ```

- [x] 1A.76 Test mutation `005-ci-phase`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  phase: (_name, fn) => fn ? fn() : () => {}
  ```

  ```text
  phase: (_name, fn) => fn()
  ```

- [x] 1A.77 Test mutation `127-summary`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  log(`Ratchet: ${history.length} history lines for ${change}.`);
  ```

  ```text
  log(`Ratchet: ${result.history.length} history lines for ${change}.`);
  ```

- [x] 1A.78 Test mutation `068-trace-write`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
    return { ...snapshot, specs, trace, qaScripts:
  ```

  ```text
    writeLinks(root, buildLinks(trace.report));
    return { ...snapshot, specs, trace, qaScripts:
  ```

- [x] 1A.79 Test mutation `033-review-inputs`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  Make sure that the ratchet commit has all input files.
  ```

  ```text
  Continue.
  ```

- [x] 1A.80 Test mutation `033-agent-inputs`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `AGENTS.md`.

  ```text
  Commit each file outside openspec/changes/, openspec/specs/ and openspec/trace/.
  ```

  ```text
  Continue with input files.
  ```

- [x] 1A.81 Test mutation `012-docs-back`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; $(GATES_BACK) || exit 2' gates
  ```

- [x] 1A.82 Test mutation `012-docs-copy`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c 'true || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

- [x] 1A.83 Test mutation `012-docs-env`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; node scripts/spec/gates.mjs "$$@"' gates
  ```

- [x] 1A.84 Test mutation `012-change`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  $(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)
  ```

  ```text
  $(GATES_DOCS) check --no-measure $(BASE_ARG)
  ```

- [x] 1A.85 Test mutation `012-base`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  $(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)
  ```

  ```text
  $(GATES_DOCS) check --no-measure $(CHANGE_ARG)
  ```

- [x] 1A.86 Test mutation `012-markers`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

- [x] 1A.87 Test mutation `088-names`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others --exclude-standard -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

- [x] 1A.88 Test mutation `088-file`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /tmp/work
  ```

- [x] 1A.89 Test mutation `088-content`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"source\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

- [x] 1A.90 Test mutation `088-exists`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

- [x] 1A.91 Test mutation `089-changes`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  'openspec/changes/'
  ```

  ```text
  'no/changes/'
  ```

- [x] 1A.92 Test mutation `089-specs`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  'openspec/specs/'
  ```

  ```text
  'no/specs/'
  ```

- [x] 1A.93 Test mutation `089-trace`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  'openspec/trace/'
  ```

  ```text
  'no/trace/'
  ```

- [x] 1A.94 Test mutation `091-slash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  file.startsWith(prefix)
  ```

  ```text
  file.startsWith(prefix.slice(0, -1))
  ```

- [x] 1A.95 Test mutation `092-second-name`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  '--no-renames'
  ```

  ```text
  '--find-renames'
  ```

- [x] 1A.96 Test mutation `090-all-paths`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  const changed = [...diff.stdout.split('\0'), ...others.stdout.split('\0')]
  ```

  ```text
  const changed = []
  ```

- [x] 1A.97 Test mutation `078-ignored`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  const ignored = spawn('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '-z'], options);
  ```

  ```text
  const ignored = { status: 0, stdout: '' };
  ```

- [x] 1A.98 Test mutation `078-cache`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  !file.startsWith('.gev-cache/') &&
  ```

  ```text
  ```

- [x] 1A.99 Test mutation `087-ignored-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
   || ignored.status !== 0
  ```

  ```text
  ```

- [x] 1A.100 Test mutation `093-dirty`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  if (line.dirty?.length > 0)
  ```

  ```text
  if (false)
  ```

- [x] 1A.101 Test mutation `130-dirty-field`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...(dirty.length > 0 ? { dirty } : {})
  ```

  ```text
  ...{}
  ```

- [x] 1A.102 Test mutation `131-empty-field`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  ...(dirty.length > 0 ? { dirty } : {})
  ```

  ```text
  ...{ dirty }
  ```

- [x] 1A.103 Test mutation `132-dirty-equality`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
   && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty)
  ```

  ```text
  ```

- [x] 1A.104 Test mutation `130-dirty-paths`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  const dirty = difference.files;
  ```

  ```text
  const dirty = [];
  ```

- [x] 1A.105 Test mutation `130-git-failure`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  if (difference.reason) return report(log, [{ code: 'GATES-RATCHET', file: HISTORY_FILE, message: difference.reason }]);
  ```

  ```text
  ```

- [x] 1A.106 Test mutation `133-reader`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/ledger.mjs`.

  ```text
  .map((line) => JSON.parse(line));
  ```

  ```text
  .map((line) => JSON.parse(line)).filter(line => !line.dirty);
  ```

- [x] 1A.107 Test mutation `134-image-markers`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi;
  ```

  ```text
  :
  ```

- [x] 1A.108 Test mutation `078-root-deps`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  (^|\/)node_modules
  ```

  ```text
  (\/)node_modules
  ```

- [x] 1A.109 Test mutation `078-nested-deps`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  (^|\/)node_modules
  ```

  ```text
  (^)node_modules
  ```

- [x] 1A.110 Test mutation `078-deps-slash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  node_modules\//.test(file)
  ```

  ```text
  node_modules/.test(file)
  ```

- [x] 1A.111 Test mutation `134-definition-order`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  GATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  GATES := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates
  ```

  ```text
  GATES := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates
  GATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

- [x] 1A.112 Test mutation `134-command`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  if [ "$$1" != ratchet ]
  ```

  ```text
  if [ "$$1" = ratchet ]
  ```

- [x] 1A.113 Test mutation `130-sort`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  [...new Set([...changed, ...protectedIgnored])].sort()
  ```

  ```text
  [...new Set([...changed, ...protectedIgnored])]
  ```

- [x] 1A.114 Test mutation `078-inventory-source`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  codeInventory(listFilesAt(root, commit))
  ```

  ```text
  codeInventory(ignored.stdout.split('\0'))
  ```

- [x] 1A.115 Test mutation `094-cache-marker`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
   ":(exclude,glob).gev-cache/**"
  ```

  ```text
  ```

- [x] 1A.116 Test mutation `094-cache-back`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cp -a /tmp/work/.gev-cache/spec/. /src/.gev-cache/spec/
  ```

  ```text
  cp -a /tmp/work/.gev-cache/. /src/.gev-cache/
  ```

- [x] 1A.117 Test mutation `091-trace-slash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  'openspec/trace/'
  ```

  ```text
  'openspec/trace'
  ```

- [x] 1A.118 Test mutation `078-cache-slash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  '.gev-cache/'
  ```

  ```text
  '.gev-cache'
  ```

- [x] 1A.119 Test mutation `080-commit-name`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  files: [], commit: line.commit };
    const difference
  ```

  ```text
  files: [], commit: 'none' };
    const difference
  ```

- [x] 1A.120 Test mutation `095-test-class`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  isTestFile(file) || isCodeFile(file) ||
  ```

  ```text
  isCodeFile(file) ||
  ```

- [x] 1A.121 Test mutation `095-code-class`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  isTestFile(file) || isCodeFile(file) ||
  ```

  ```text
  isTestFile(file) ||
  ```

- [x] 1A.122 Test mutation `096-commit-hash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /^[a-fA-F0-9]{40}$/.test(line.commit)
  ```

  ```text
  true
  ```

- [x] 1A.123 Test mutation `083-check-command`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  log(`Command: ${parsed.command}`);
  ```

  ```text
  log('Command: ratchet');
  ```

- [x] 1A.124 Test mutation `011-precheck-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/format.mjs --check &&
  ```

  ```text
  node scripts/format.mjs --check ;
  ```

- [x] 1A.125 Test mutation `126-history-after`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/gates.mjs`.

  ```text
  historyText = readOptional(root, HISTORY_FILE);
      baseline
  ```

  ```text
  historyText = historyText;
      baseline
  ```

- [x] 1A.126 Test mutation `075-root`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)Dockerfile[^/]*$/
  ```

  ```text
  /^Dockerfile$/
  ```

- [x] 1A.127 Test mutation `075-nested`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)Dockerfile[^/]*$/
  ```

  ```text
  /^Dockerfile[^/]*$/
  ```

- [x] 1A.128 Test mutation `075-suffix`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)Dockerfile[^/]*$/
  ```

  ```text
  /(^|\/)Dockerfile$/
  ```

- [x] 1A.129 Test mutation `076-root`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)[^/]*compose[^/]*\.ya?ml$/
  ```

  ```text
  /^[^/]*compose[^/]*\.ya?ml$/
  ```

- [x] 1A.130 Test mutation `076-prefix`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)[^/]*compose[^/]*\.ya?ml$/
  ```

  ```text
  /(^|\/)compose[^/]*\.ya?ml$/
  ```

- [x] 1A.131 Test mutation `076-suffix`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)[^/]*compose[^/]*\.ya?ml$/
  ```

  ```text
  /(^|\/)[^/]*compose\.ya?ml$/
  ```

- [x] 1A.132 Test mutation `076-yaml`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  \.ya?ml$
  ```

  ```text
  \.yml$
  ```

- [x] 1A.133 Test mutation `076-yml`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  \.ya?ml$
  ```

  ```text
  \.yaml$
  ```

- [x] 1A.134 Test mutation `075-boundary`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)Dockerfile[^/]*$/
  ```

  ```text
  /Dockerfile[^/]*$/
  ```

- [x] 1A.135 Test mutation `075-end`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)Dockerfile[^/]*$/
  ```

  ```text
  /(^|\/)Dockerfile[^/]*/
  ```

- [x] 1A.136 Test mutation `075-no-slash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)Dockerfile[^/]*$/
  ```

  ```text
  /(^|\/)Dockerfile.*$/
  ```

- [x] 1A.137 Test mutation `076-prefix-characters`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)[^/]*compose[^/]*\.ya?ml$/
  ```

  ```text
  /(^|\/)[^/-]*compose[^/]*\.ya?ml$/
  ```

- [x] 1A.138 Test mutation `076-suffix-no-slash`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /(^|\/)[^/]*compose[^/]*\.ya?ml$/
  ```

  ```text
  /(^|\/)[^/]*compose.*\.ya?ml$/
  ```

- [x] 1A.139 Test mutation `076-dot`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  \.ya?ml$
  ```

  ```text
  ya?ml$
  ```

- [x] 1A.140 Test mutation `076-end`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  \.ya?ml$/
  ```

  ```text
  \.ya?ml/
  ```

- [x] 1A.141 Test mutation `096-start`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /^[a-fA-F0-9]{40}$/
  ```

  ```text
  /[a-fA-F0-9]{40}$/
  ```

- [x] 1A.142 Test mutation `096-end`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /^[a-fA-F0-9]{40}$/
  ```

  ```text
  /^[a-fA-F0-9]{40}/
  ```

- [x] 1A.143 Test mutation `096-length`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /^[a-fA-F0-9]{40}$/
  ```

  ```text
  /^[a-fA-F0-9]+$/
  ```

- [x] 1A.144 Test mutation `096-hex`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `scripts/spec/lib/measurement.mjs`.

  ```text
  /^[a-fA-F0-9]{40}$/
  ```

  ```text
  /^[a-zA-Z0-9]{40}$/
  ```

- [x] 1A.145 Test mutation `033-input-correction`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `.claude/commands/opsx/review.md`.

  ```text
  If not, commit them and run the ratchet command again.
  ```

  ```text
  Continue.
  ```

- [x] 1A.146 Test mutation `094-marker-cleanup`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  cd /tmp/work && xargs -0 -r rm -f -- < /tmp/doc-markers
  ```

  ```text
  :
  ```

- [x] 1A.147 Test mutation `094-marker-list`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers
  ```

  ```text
  ```

- [x] 1A.148 Test mutation `094-marker-no-list`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  if [ ! -f /tmp/doc-markers ]
  ```

  ```text
  if [ -f /tmp/doc-markers ]
  ```

- [x] 1A.149 Test mutation `097-copy-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  ; fi && rm -rf /src/.gev-cache/spec
  ```

  ```text
  ; fi; rm -rf /src/.gev-cache/spec
  ```

- [x] 1A.150 Test mutation `011-precheck-import-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/check-import-directions.mjs &&
  ```

  ```text
  node scripts/check-import-directions.mjs ;
  ```

- [x] 1A.151 Test mutation `011-precheck-boundary-status`.
  - Run the mutation that replaces the first code block with the second. The test must fail.

  File: `Makefile`.

  ```text
  node scripts/check-package-boundaries.mjs &&
  ```

  ```text
  node scripts/check-package-boundaries.mjs ;
  ```

## 2. Code and host checks

- [x] 2.1 Correct the container commands for cache markers.
- [x] 2.2 Correct input file classes and commit hashes.
- [x] 2.3 Correct log messages and process guidance.
- [x] 2.4 Test each spec test file.
- [x] 2.5 Measure host coverage.
- [x] 2.6 Check the file format.
- [x] 2.7 Check the STE prose.
- [x] 2.8 Check the change with predispatch.
- [x] 2.9 Record the host results in evidence.md.

## 3. Gates and review

The lead checks these tasks at the end.

- [ ] 3.1 Run the ratchet command in the pinned container.
- [ ] 3.2 Run the full gates in the pinned container.
- [ ] 3.3 Run the two review agents.
- [ ] 3.4 Write `review.md`.
