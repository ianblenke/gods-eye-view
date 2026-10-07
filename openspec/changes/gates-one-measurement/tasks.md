## 1. Scenario tests

- [x] 1.1 Write the test for `change-review-033`.

  Mutation `033-final` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  Then run `make gates CHANGE=<name>` on the final tree.
  ```

  ```text
  Then continue on the final tree.
  ```

  Mutation `033-precheck` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  1. Run `make precheck`.
  ```

  ```text
  1. Continue.
  ```

  Mutation `033-step1` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  or run `make gates-docs CHANGE=<name>`.
  ```

  ```text
  or continue.
  ```

  Mutation `033-step3` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  3. Run `make gates-docs CHANGE=<name>` again.
  ```

  ```text
  3. Continue again.
  ```

  Mutation `033-step10` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  Use `make gates-docs CHANGE=<name>` and start again at step 3.
  ```

  ```text
  Start again at step 3.
  ```

  Mutation `033-step11` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  Then run `make gates-docs CHANGE=<name>`, which must give only review errors.
  ```

  ```text
  Then continue.
  ```

  Mutation `033-step15` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  15. Run `make gates-docs CHANGE=<name>`.
  ```

  ```text
  15. Continue.
  ```

  Mutation `033-ci` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  CI must also pass before you merge.
  ```

  ```text
  Continue.
  ```

  Mutation `033-review-inputs` changes `.claude/commands/opsx/review.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  Commit the protected inputs before the ratchet command.
  ```

  ```text
  Continue with the protected inputs.
  ```

  Mutation `033-agent-inputs` changes `AGENTS.md`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  Commit the protected inputs before the ratchet command.
  ```

  ```text
  Continue with the protected inputs.
  ```


- [x] 1.2 Write the test for `ci-gates-011`.

  Mutation `011-precheck` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  node scripts/check-import-directions.mjs &&
  ```

  ```text
  true &&
  ```

  Mutation `011-format` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  node scripts/format.mjs --check &&
  ```

  ```text
  true &&
  ```

  Mutation `011-boundaries` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  node scripts/check-package-boundaries.mjs &&
  ```

  ```text
  true &&
  ```

  Mutation `011-tokens` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  node scripts/check-layer-state-tokens.mjs --base-ref origin/main
  ```

  ```text
  true
  ```

  Mutation `005-ci-phase` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  phase: (_name, fn) => fn ? fn() : () => {}
  ```

  ```text
  phase: (_name, fn) => fn()
  ```


- [x] 1.3 Write the test for `ci-gates-012`.

  Mutation `012-docs` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  check --no-measure $(CHANGE_ARG) $(BASE_ARG)
  ```

  ```text
  check $(CHANGE_ARG) $(BASE_ARG)
  ```

  Mutation `012-copy` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json
  ```

  ```text
  true
  ```

  Mutation `012-docs-back` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; $(GATES_BACK) || exit 2' gates
  ```

  Mutation `012-docs-copy` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c 'true || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  Mutation `012-docs-env` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; node scripts/spec/gates.mjs "$$@"' gates
  ```

  Mutation `012-change` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  $(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)
  ```

  ```text
  $(GATES_DOCS) check --no-measure $(BASE_ARG)
  ```

  Mutation `012-base` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  $(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)
  ```

  ```text
  $(GATES_DOCS) check --no-measure $(CHANGE_ARG)
  ```

  Mutation `012-markers` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```

  ```text
  GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates
  ```


- [x] 1.4 Write the test for `coverage-gate-068`.

  Mutation `068-tests` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ? documentMeasurement({ root, change, openSpec, snapshot, phase })
  ```

  ```text
  ? phase('measure', () => measure({ root, spawn, env, allocationFiles, change, openSpec, phase }))
  ```

  Mutation `068-own-option` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  options.noMeasure = true;
  ```

  ```text
  options.noMeasure = undefined;
  ```

  Mutation `068-command-option` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  key === '--no-measure' && command === 'check'
  ```

  ```text
  key === '--no-measure' && true
  ```

  Mutation `068-trace-write` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    return { ...snapshot, specs, trace, qaScripts:
  ```

  ```text
    writeLinks(root, buildLinks(trace.report));
    return { ...snapshot, specs, trace, qaScripts:
  ```


- [x] 1.5 Write the test for `coverage-gate-069`.

  Mutation `069-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    return inventory.has(file);
  ```

  ```text
    return false;
  ```

  Mutation `069-tracked` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```

  ```text
  file && file !== 'src/new.js' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```

  Mutation `069-base` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```

  ```text
  file && file !== 'src/math.js' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```


- [x] 1.6 Write the test for `coverage-gate-070`.

  Mutation `070-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (isTestFile(file)) return true;
  ```

  ```text
    if (isTestFile(file)) return false;
  ```


- [x] 1.7 Write the test for `coverage-gate-071`.

  Mutation `071-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (/^scripts\/qa-.*\.mjs$/.test(file)) return true;
  ```

  ```text
    if (/^scripts\/qa-.*\.mjs$/.test(file)) return false;
  ```


- [x] 1.8 Write the test for `coverage-gate-072`.

  Mutation `072-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (file === 'package-lock.json') return true;
  ```

  ```text
    if (file === 'package-lock.json') return false;
  ```


- [x] 1.9 Write the test for `coverage-gate-073`.

  Mutation `073-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (file === '.node-version') return true;
  ```

  ```text
    if (file === '.node-version') return false;
  ```


- [x] 1.10 Write the test for `coverage-gate-074`.

  Mutation `074-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (file === 'Makefile') return true;
  ```

  ```text
    if (file === 'Makefile') return false;
  ```


- [x] 1.11 Write the test for `coverage-gate-075`.

  Mutation `075-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (/(^|\/)Dockerfile[^/]*$/.test(file)) return true;
  ```

  ```text
    if (/(^|\/)Dockerfile[^/]*$/.test(file)) return false;
  ```


- [x] 1.12 Write the test for `coverage-gate-076`.

  Mutation `076-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (/(^|\/)[^/]*compose[^/]*\.ya?ml$/.test(file)) return true;
  ```

  ```text
    if (/(^|\/)[^/]*compose[^/]*\.ya?ml$/.test(file)) return false;
  ```


- [x] 1.13 Write the test for `coverage-gate-077`.

  Mutation `077-path` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (file.startsWith('scripts/spec/')) return true;
  ```

  ```text
    if (file.startsWith('scripts/spec/')) return false;
  ```


- [x] 1.14 Write the test for `coverage-gate-078`.

  Mutation `078-untracked` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const others = spawn('git', ['ls-files', '--others', '--exclude-standard', '-z'], options);
  ```

  ```text
  const others = { status: 0, stdout: '' };
  ```

  Mutation `068-dependencies` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  !/(^|\/)node_modules\//.test(file) && 
  ```

  ```text
  ```

  Mutation `078-inventory` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```

  ```text
  file && file !== 'src/new.js' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```

  Mutation `078-ignored` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const ignored = spawn('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '-z'], options);
  ```

  ```text
  const ignored = { status: 0, stdout: '' };
  ```

  Mutation `078-cache` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  !file.startsWith('.gev-cache/') && 
  ```

  ```text
  ```

  Mutation `078-root-deps` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  (^|\/)node_modules
  ```

  ```text
  (\/)node_modules
  ```

  Mutation `078-nested-deps` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  (^|\/)node_modules
  ```

  ```text
  (^)node_modules
  ```

  Mutation `078-deps-slash` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  node_modules\//.test(file)
  ```

  ```text
  node_modules/.test(file)
  ```


- [x] 1.15 Write the test for `coverage-gate-079`.

  Mutation `079-history` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ['coverage', 'untraced', 'measurement'].includes(item.kind)
  ```

  ```text
  true
  ```

  Mutation `079-change` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  item.change === change &&
  ```

  ```text
  true &&
  ```


- [x] 1.16 Write the test for `coverage-gate-080`.

  Mutation `080-commit` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const commit = resolveCommit(root, line.commit);
  ```

  ```text
  const commit = resolveCommit(root, 'HEAD');
  ```


- [x] 1.17 Write the test for `coverage-gate-081`.

  Mutation `081-words` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```

  ```text
  file && file !== 'openspec/ste/words.json' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))
  ```


- [x] 1.18 Write the test for `coverage-gate-082`.

  Mutation `082-hash` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if (contentHash(text) !== line.measurement)
  ```

  ```text
  if (false)
  ```

  Mutation `082-absent` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if (!existsSync(absolute)) return
  ```

  ```text
  if (false) return
  ```


- [x] 1.19 Write the test for `coverage-gate-083`.

  Mutation `083-start` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    log(`Started: ${started.toISOString()}`);
  ```

  ```text
    log('Started: wrong');
  ```

  Mutation `083-finish` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  log(`Finished: ${finished.toISOString()} (${(finished.getTime() - started.getTime()) / 1000} s)`);
  ```

  ```text
  log('Finished: wrong');
  ```

  Mutation `083-check-time` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const timed = parsed.command === 'check' || parsed.command === 'ratchet';
  ```

  ```text
  const timed = parsed.command === 'ratchet';
  ```

  Mutation `083-ratchet-time` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const timed = parsed.command === 'check' || parsed.command === 'ratchet';
  ```

  ```text
  const timed = parsed.command === 'check';
  ```


- [x] 1.20 Write the test for `coverage-gate-084`.

  Mutation `084-cutoff` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if (seconds > 1) log
  ```

  ```text
  if (seconds >= 1) log
  ```

  Mutation `084-phase` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  log(`Phase ${name}: ${seconds} s`)
  ```

  ```text
  log(`Phase wrong: ${seconds} s`)
  ```

  Mutation `084-elapsed` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  (finished.getTime() - started.getTime()) / 1000
  ```

  ```text
  (finished.getTime() - started.getTime()) / 1
  ```


- [x] 1.21 Write the test for `coverage-gate-085`.

  Mutation `085-links` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...checkLinks({ links: readLinks(root), current: measured.links }),
  ```

  ```text
  ...[],
  ```

  Mutation `085-registry` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),
  ```

  ```text
  ...[],
  ```

  Mutation `085-specs` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  errors.push(...lintSpecs({ requirements: specs.requirements, orphans: specs.orphans, changeIds: specs.changeIds, readTasks: tasksReader(root) }));
  ```

  ```text
  errors.push();
  ```

  Mutation `085-lint` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const lint = phase('lint', () => lintFindings(root, measured.records));
  ```

  ```text
  const lint = { errors: [], warnings: [], failed: false };
  ```

  Mutation `085-openspec` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  errors.push(...checkOpenSpec({ root, specs, run: (args) => openSpec(root, args) }));
  ```

  ```text
  errors.push();
  ```

  Mutation `085-archive` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  errors.push(...archived.errors, ...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));
  ```

  ```text
  errors.push(...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));
  ```

  Mutation `085-filters` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  errors.push(...findCoverageFlags({ tracked, readFile }));
  ```

  ```text
  errors.push();
  ```

  Mutation `085-base` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const baseErrors = compareWithBase({
  ```

  ```text
  const baseErrors = (() => [])({
  ```

  Mutation `085-ledger` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const comparison = compareLedger({ ledger, current: measured.current, sameAsBase, waivers });
  ```

  ```text
  const comparison = { errors: [], stale: [] };
  ```

  Mutation `085-base-registry` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),
  ```

  ```text
  ...[],
  ```

  Mutation `085-archive-reviews` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...checkArchivedReviews(root, { except: folder }),
  ```

  ```text
  ...[],
  ```

  Mutation `085-names` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...checkChangeNames(root),
  ```

  ```text
  ...[],
  ```

  Mutation `085-agents` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...checkAgents(root),
  ```

  ```text
  ...[],
  ```

  Mutation `085-command` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...checkReviewCommand(root),
  ```

  ```text
  ...[],
  ```


- [x] 1.22 Write the test for `coverage-gate-086`.

  Mutation `086-package` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    if (file === 'package.json') return true;
  ```

  ```text
    if (file === 'package.json') return false;
  ```


- [x] 1.23 Write the test for `coverage-gate-087`.

  Mutation `087-diff` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  diff.status !== 0 || others.status !== 0
  ```

  ```text
  false || others.status !== 0
  ```

  Mutation `087-others` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  diff.status !== 0 || others.status !== 0
  ```

  ```text
  diff.status !== 0 || false
  ```

  Mutation `087-ignored-status` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
   || ignored.status !== 0
  ```

  ```text
  ```


- [x] 1.24 Write the test for `coverage-gate-088`.

  Mutation `088-names` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /src && git ls-files --others --exclude-standard -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  Mutation `088-file` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /tmp/work
  ```

  Mutation `088-content` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"source\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  Mutation `088-exists` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  ```text
  cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```


- [x] 1.25 Write the test for `coverage-gate-089`.

  Mutation `089-changes` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  'openspec/changes/'
  ```

  ```text
  'no/changes/'
  ```

  Mutation `089-specs` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  'openspec/specs/'
  ```

  ```text
  'no/specs/'
  ```

  Mutation `089-trace` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  'openspec/trace/'
  ```

  ```text
  'no/trace/'
  ```


- [x] 1.26 Write the test for `coverage-gate-090`.

  Mutation `090-all-paths` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const changed = [...diff.stdout.split('\0'), ...others.stdout.split('\0')]
  ```

  ```text
  const changed = []
  ```


- [x] 1.27 Write the test for `coverage-gate-091`.

  Mutation `091-slash` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  file.startsWith(prefix)
  ```

  ```text
  file.startsWith(prefix.slice(0, -1))
  ```


- [x] 1.28 Write the test for `coverage-gate-092`.

  Mutation `092-second-name` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  '--no-renames'
  ```

  ```text
  '--find-renames'
  ```


- [x] 1.29 Write the test for `coverage-gate-093`.

  Mutation `093-dirty` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if (line.dirty?.length > 0)
  ```

  ```text
  if (false)
  ```


- [x] 1.30 Write the test for `gap-ledger-123`.

  Mutation `123-twice` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
    const { counts } = measured.trace.report;
  ```

  ```text
    if (command === 'ratchet') measure({ root, spawn, env, allocationFiles, change, openSpec, phase });
    const { counts } = measured.trace.report;
  ```


- [x] 1.31 Write the test for `gap-ledger-124`.

  Mutation `124-review` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles }) }) : []),
  ```

  ```text
  ...[],
  ```

  Mutation `124-status` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  return command === 'ratchet' && status !== 0 ? 2 : status;
  ```

  ```text
  return status;
  ```


- [x] 1.32 Write the test for `gap-ledger-125`.

  Mutation `125-status` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  return command === 'ratchet' && status !== 0 ? 2 : status;
  ```

  ```text
  return command === 'ratchet' ? 2 : status;
  ```


- [x] 1.33 Write the test for `gap-ledger-126`.

  Mutation `126-ledger` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
      ledger = readLedger(root);
  ```

  ```text
      ledger = ledger;
  ```

  Mutation `126-totals` changes `scripts/spec/lib/ledger.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  ```text
  'LEDGER-STALE', 'LEDGER-VERSION'
  ```

  Mutation `126-stale` changes `scripts/spec/lib/ledger.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  ```text
  'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  Mutation `126-version` changes `scripts/spec/lib/ledger.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'
  ```

  ```text
  'LEDGER-STALE', 'LEDGER-NO-TOTALS'
  ```


- [x] 1.34 Write the test for `gap-ledger-127`.

  Mutation `127-history` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  unchanged ? [] : [{ date, change, commit: headCommit(root), kind: 'measurement' }]
  ```

  ```text
  []
  ```

  Mutation `127-stamp` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) }))
  ```

  ```text
  history.map(line => ({ ...line, ...(dirty.length > 0 ? { dirty } : {}) }))
  ```

  Mutation `127-summary` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  log(`Ratchet: ${history.length} history lines for ${change}.`);
  ```

  ```text
  log(`Ratchet: ${result.history.length} history lines for ${change}.`);
  ```


- [x] 1.35 Write the test for `gap-ledger-128`.

  Mutation `128-same` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);
  ```

  ```text
  const unchanged = false;
  ```


- [x] 1.36 Write the test for `gap-ledger-129`.

  Mutation `129-hash` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  previous?.measurement === measurement && previous.commit === headCommit(root)
  ```

  ```text
  true && previous.commit === headCommit(root)
  ```

  Mutation `129-commit` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  previous?.measurement === measurement && previous.commit === headCommit(root)
  ```

  ```text
  previous?.measurement === measurement && true
  ```

  Mutation `129-change` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  findLast(line => line.change === change)
  ```

  ```text
  findLast(line => true)
  ```


- [x] 1.37 Write the test for `gap-ledger-130`.

  Mutation `130-dirty-field` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...(dirty.length > 0 ? { dirty } : {})
  ```

  ```text
  ...{}
  ```

  Mutation `130-dirty-paths` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  const dirty = difference.files;
  ```

  ```text
  const dirty = [];
  ```

  Mutation `130-git-failure` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if (difference.reason) return report(log, [{ code: 'GATES-RATCHET', file: HISTORY_FILE, message: difference.reason }]);
  ```

  ```text
  ```

  Mutation `130-sort` changes `scripts/spec/lib/measurement.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  [...new Set([...changed, ...protectedIgnored])].sort()
  ```

  ```text
  [...new Set([...changed, ...protectedIgnored])]
  ```


- [x] 1.38 Write the test for `gap-ledger-131`.

  Mutation `131-empty-field` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  ...(dirty.length > 0 ? { dirty } : {})
  ```

  ```text
  ...{ dirty }
  ```


- [x] 1.39 Write the test for `gap-ledger-132`.

  Mutation `132-dirty-equality` changes `scripts/spec/gates.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
   && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty)
  ```

  ```text
  ```


- [x] 1.40 Write the test for `gap-ledger-133`.

  Mutation `133-reader` changes `scripts/spec/lib/ledger.mjs`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  .map((line) => JSON.parse(line));
  ```

  ```text
  .map((line) => JSON.parse(line)).filter(line => !line.dirty);
  ```


- [x] 1.41 Write the test for `gap-ledger-134`.

  Mutation `134-image-markers` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi;
  ```

  ```text
  :
  ```

  Mutation `134-definition-order` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  GATES_DOCS_MARKERS := cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  GATES := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates
  ```

  ```text
  GATES := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates
  GATES_DOCS_MARKERS := cd /src && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
  ```

  Mutation `134-command` changes `Makefile`.
  Run the mutation that replaces the first code block with the second code block. The test must fail.

  ```text
  if [ "$$1" != ratchet ]
  ```

  ```text
  if [ "$$1" = ratchet ]
  ```


- [x] 1.42 Test ignored build files for `coverage-gate-078`.
  - Run the mutation that uses all ignored names for the code inventory. The test must fail.

## 2. Code and host checks

- [x] 2.1 Add the ratchet comparisons and dirty history.
- [x] 2.2 Add the document path rule.
- [x] 2.3 Add command times.
- [x] 2.4 Add the Makefile targets and name markers.
- [x] 2.5 Update the review sequence and gate guidance.
- [x] 2.6 Complete all mutation checks.
- [x] 2.7 Measure host coverage.
- [x] 2.8 Test each spec test file.
- [x] 2.9 Check the file format.
- [x] 2.10 Check the STE prose.
- [x] 2.11 Check the change with predispatch.
- [x] 2.12 Record the host results in evidence.md.

- [x] 2.13 Test the CI helper for `ci-gates-005`.

## 3. Gates and review

- [ ] 3.1 Run the ratchet command in the pinned image.
- [ ] 3.2 Run the full gates in the pinned image.
- [ ] 3.3 Run the two review agents.
- [ ] 3.4 Write `review.md`.
