# Evidence: gates-one-measurement

Tree base: `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02` from `git rev-parse HEAD`.
The evidence covers the uncommitted working tree.

## Design

D1: The ratchet makes one measurement, writes the trace files, then makes all comparisons.
The comparison verdict gives status zero or two. Earlier refusal errors keep their status.
The ratchet keeps the review error when the review file is absent.

D2: Document gates allow tracked and untracked changes only under `openspec/changes/`, `openspec/specs/` and `openspec/trace/`.
Both names of a renamed file take part in the comparison.
Ignored protected files still cause refusal, except dependency and cache folders.
The code inventory at the ratchet commit defines ignored code paths.
Other ignored build files do not cause refusal.

The ratchet compares the working tree with HEAD before its history writes.
History has a sorted `dirty` list when protected files have changes.
A clean history line has no `dirty` field.
The unchanged decision compares the snapshot, commit and dirty list.
Document gates refuse dirty history even after the files return to HEAD.
History readers accept the extra field.

D3: Document refusal gives status two and no gate verdict.
Trusted document comparisons give status zero or one.
The first line names the command or the measurement trust state.
The document mode writes no trace file.

D4: Use Coordinated Universal Time (UTC) for command times.
The UTC start line follows the command line.
The finish line comes last.
Phases above one second show their duration.
The phases are measure, specs, compare, lint and review.
Tests use a clock function with literal times.

D5: Precheck uses the image pattern and all four CI file checks.
D6: Review uses document gates only while all changed files stay under the allowed paths.
The final tree still needs full image gates and CI.
The ratchet image adds ignored protected name markers before the gate command.
The marker definition comes before the immediate Makefile expansion.

## Known limits

- Host coverage cannot replace the pinned image measurement.
- Document gates allow changes only under `openspec/changes/`, `openspec/specs/` and `openspec/trace/`.
- A QA header change in `scripts/qa-*.mjs` at archive time needs another ratchet command or full gates on the final tree.
- Any change outside the three paths needs another ratchet command or full gates on the final tree.
- Dirty ratchet history prevents trust even after the files return to HEAD.
- An absent snapshot needs another ratchet command.
- Snapshot trust depends on history integrity.
- An interrupted command has no comparison verdict.
- The final full gates and CI remain necessary.

The full check command replaces the cache and removes the ratchet snapshot.
Later document gates then need another ratchet command.

## Commands and test results

Each test file has its own Node process.
The commands that supply test counts have no forced exit option.
All Node and Python processes use the selected cores and low priority.
The final native checks use normal child-process pipes.
Temporary repositories stay in the scratch folder.
Host Node is v26.8.2 from the command below.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --version
```

### C1: Unit files

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --test --test-isolation=none src/tooling/spec/<file>
```

The four fixture files also use the host helper below.
The files are runParallel, testGuard, trace and traceReporter.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/fixture-host.mjs --test --test-isolation=none src/tooling/spec/<file>
```

### C2: Gate file and coverage

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem timeout 1800s taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/fixture-host.mjs --test --test-isolation=none --experimental-test-coverage --test-coverage-include='scripts/spec/gates.mjs' --test-coverage-include='scripts/spec/lib/measurement.mjs' --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/gates-onem/native-final-coverage.lcov src/tooling/spec/gates.test.mjs
```

| File | Tests | Pass | Fail |
|---|---:|---:|---:|
| ci.test.mjs | 6 | 6 | 0 |
| ciFiles.test.mjs | 4 | 4 | 0 |
| coverage.test.mjs | 15 | 15 | 0 |
| gates.test.mjs | 153 | 153 | 0 |
| git.test.mjs | 4 | 4 | 0 |
| importReach.test.mjs | 12 | 12 | 0 |
| inventory.test.mjs | 8 | 8 | 0 |
| ledger.test.mjs | 90 | 90 | 0 |
| openspec.test.mjs | 4 | 4 | 0 |
| qaRegister.test.mjs | 31 | 31 | 0 |
| registry.test.mjs | 15 | 15 | 0 |
| review.test.mjs | 33 | 33 | 0 |
| runParallel.test.mjs | 3 | 3 | 0 |
| specLint.test.mjs | 17 | 17 | 0 |
| specs.test.mjs | 20 | 20 | 0 |
| ste.test.mjs | 45 | 45 | 0 |
| testGuard.test.mjs | 31 | 31 | 0 |
| trace.test.mjs | 25 | 25 | 0 |
| traceReporter.test.mjs | 10 | 10 | 0 |
| v8Merge.test.mjs | 11 | 11 | 0 |

C1 and C2 report 537 tests, 537 passed and zero failed.

## Coverage before and after hardening

Before hardening, the first pass wrote coverage-after.lcov with the host coverage options below.
The first audit records the covered counts.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --test --test-force-exit --experimental-test-coverage --test-coverage-include='scripts/spec/gates.mjs' --test-coverage-include='scripts/spec/lib/measurement.mjs' src/tooling/spec/gates.test.mjs
```

C2 supplies the results after hardening.
The table gives covered counts divided by total counts.
Each file has full line, branch and function coverage.

| File | Stage | Lines | Branches | Functions |
|---|---|---:|---:|---:|
| scripts/spec/gates.mjs | Before | 733/733 | 311/311 | 87/87 |
| scripts/spec/lib/measurement.mjs | Before | 57/57 | 41/41 | 6/6 |
| scripts/spec/gates.mjs | After | 737/737 | 317/317 | 87/87 |
| scripts/spec/lib/measurement.mjs | After | 65/65 | 53/53 | 8/8 |

## Scenario to test map

The map comes from the scenario headings and C1 and C2 test output.
The test tags carry the scenario identifiers (IDs).

```text
ID | Scenario | File | Test
| change-review-033 | Keep the final measurement | gates.test.mjs | [change-review-033] keep the final measurement |
| ci-gates-011 | Add fast checks before review | gates.test.mjs | [ci-gates-011] add fast checks before review |
| ci-gates-012 | Add a document gate target | gates.test.mjs | [ci-gates-012] add a document gate target |
| coverage-gate-068 | Trust a changed document | gates.test.mjs | [coverage-gate-068] trust a changed document |
| coverage-gate-068 | Trust a changed document | gates.test.mjs | [coverage-gate-068] set the document option on the options object |
| coverage-gate-069 | Refuse a changed inventory file | gates.test.mjs | [coverage-gate-069] refuse a changed inventory file |
| coverage-gate-069 | Refuse a changed inventory file | gates.test.mjs | [coverage-gate-069] refuse a deleted protected file |
| coverage-gate-069 | Refuse a changed inventory file | gates.test.mjs | [coverage-gate-069] refuse a new tracked inventory file |
| coverage-gate-069 | Refuse a changed inventory file | gates.test.mjs | [coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory |
| coverage-gate-069 | Refuse a changed inventory file | gates.test.mjs | [coverage-gate-069] refuse a deleted test file |
| coverage-gate-069 | Refuse a changed inventory file | gates.test.mjs | [coverage-gate-069 coverage-gate-092] refuse a code file move |
| coverage-gate-070 | Refuse a changed test file | gates.test.mjs | [coverage-gate-070] refuse a changed test file |
| coverage-gate-070 | Refuse a changed test file | gates.test.mjs | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| coverage-gate-071 | Refuse a changed QA script | gates.test.mjs | [coverage-gate-071] refuse a changed QA script |
| coverage-gate-071 | Refuse a changed QA script | gates.test.mjs | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs |
| coverage-gate-072 | Refuse a changed package lock | gates.test.mjs | [coverage-gate-072] refuse a changed package lock |
| coverage-gate-072 | Refuse a changed package lock | gates.test.mjs | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json |
| coverage-gate-073 | Refuse a changed Node version | gates.test.mjs | [coverage-gate-073] refuse a changed Node version |
| coverage-gate-073 | Refuse a changed Node version | gates.test.mjs | [coverage-gate-073 coverage-gate-078] classify the ignored Node version |
| coverage-gate-074 | Refuse a changed Makefile | gates.test.mjs | [coverage-gate-074] refuse a changed Makefile |
| coverage-gate-074 | Refuse a changed Makefile | gates.test.mjs | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile |
| coverage-gate-075 | Refuse a changed Dockerfile | gates.test.mjs | [coverage-gate-075] refuse a changed Dockerfile |
| coverage-gate-075 | Refuse a changed Dockerfile | gates.test.mjs | [coverage-gate-075] refuse a changed Dockerfile at `containers/Dockerfile.gates` |
| coverage-gate-075 | Refuse a changed Dockerfile | gates.test.mjs | [coverage-gate-075] refuse a changed Dockerfile at `Dockerfileprod` |
| coverage-gate-075 | Refuse a changed Dockerfile | gates.test.mjs | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile |
| coverage-gate-076 | Refuse a changed compose file | gates.test.mjs | [coverage-gate-076] refuse a changed compose file |
| coverage-gate-076 | Refuse a changed compose file | gates.test.mjs | [coverage-gate-076] refuse a changed compose file at `docker-compose.yml` |
| coverage-gate-076 | Refuse a changed compose file | gates.test.mjs | [coverage-gate-076] refuse a changed compose file at `containers/compose.gates.yaml` |
| coverage-gate-076 | Refuse a changed compose file | gates.test.mjs | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| coverage-gate-077 | Refuse a changed gate file | gates.test.mjs | [coverage-gate-077] refuse a changed gate file |
| coverage-gate-077 | Refuse a changed gate file | gates.test.mjs | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-078] refuse an untracked protected file |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-078] refuse an ignored protected file |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-078] refuse an untracked code file |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| coverage-gate-078 | Refuse an untracked protected file | gates.test.mjs | [coverage-gate-073 coverage-gate-078] classify the ignored Node version |
| coverage-gate-079 | Refuse without ratchet history | gates.test.mjs | [coverage-gate-079] refuse without ratchet history |
| coverage-gate-079 | Refuse without ratchet history | gates.test.mjs | [coverage-gate-079] refuse history from another change or command |
| coverage-gate-079 | Refuse without ratchet history | gates.test.mjs | [coverage-gate-079] refuse without a change name |
| coverage-gate-080 | Refuse a commit that Git cannot find | gates.test.mjs | [coverage-gate-080] refuse a commit that Git cannot find |
| coverage-gate-081 | Refuse a changed word list | gates.test.mjs | [coverage-gate-081] refuse a changed word list |
| coverage-gate-082 | Refuse an absent measurement snapshot | gates.test.mjs | [coverage-gate-082] refuse an absent measurement snapshot |
| coverage-gate-083 | Show command times | gates.test.mjs | [coverage-gate-083] show command times |
| coverage-gate-084 | Show slow phase times | gates.test.mjs | [coverage-gate-084] show slow phase times |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] keep every file gate |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] check OpenSpec without tests |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] check coverage filters without tests |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] check archived specs without tests |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] report a change folder that is absent |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] compare the ledger with the base without tests |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] check the base registry without tests |
| coverage-gate-085 | Keep every file gate | gates.test.mjs | [coverage-gate-085] check all review files without tests |
| coverage-gate-086 | Refuse changed package metadata | gates.test.mjs | [coverage-gate-086] refuse changed package metadata |
| coverage-gate-086 | Refuse changed package metadata | gates.test.mjs | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json |
| coverage-gate-087 | Refuse a failed Git comparison | gates.test.mjs | [coverage-gate-087] refuse a failed Git comparison |
| coverage-gate-088 | Refuse an omitted protected file | gates.test.mjs | [coverage-gate-088] refuse an omitted protected file |
| coverage-gate-089 | Trust each allowed prefix | gates.test.mjs | [coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md |
| coverage-gate-089 | Trust each allowed prefix | gates.test.mjs | [coverage-gate-089] trust a changed file at openspec/specs/x.md |
| coverage-gate-089 | Trust each allowed prefix | gates.test.mjs | [coverage-gate-089] trust a changed file at openspec/trace/gaps.json |
| coverage-gate-089 | Trust each allowed prefix | gates.test.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at AGENTS.md |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/commands/opsx/review.md |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at docs/x.md |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .github/workflows/x.yaml |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at fixtures/x.json |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/config.yaml |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/other.yaml |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/specs.md |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090] refuse a staged file edit |
| coverage-gate-090 | Refuse other file inputs | gates.test.mjs | [coverage-gate-090] refuse an untracked document |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at AGENTS.md |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/commands/opsx/review.md |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at docs/x.md |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .github/workflows/x.yaml |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at fixtures/x.json |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/config.yaml |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/other.yaml |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md |
| coverage-gate-091 | Refuse a false prefix | gates.test.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/specs.md |
| coverage-gate-092 | Refuse both rename directions | gates.test.mjs | [coverage-gate-092] refuse a file move from openspec/changes/add-demo/design.md |
| coverage-gate-092 | Refuse both rename directions | gates.test.mjs | [coverage-gate-092] refuse a file move from docs/base.md |
| coverage-gate-092 | Refuse both rename directions | gates.test.mjs | [coverage-gate-069 coverage-gate-092] refuse a code file move |
| coverage-gate-093 | Refuse a dirty ratchet | gates.test.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their return to HEAD |
| gap-ledger-123 | Compare one ratchet measurement | gates.test.mjs | [gap-ledger-123] compare one ratchet measurement |
| gap-ledger-124 | Fail for an absent review | gates.test.mjs | [gap-ledger-124] fail for an absent review |
| gap-ledger-125 | Pass after all comparisons | gates.test.mjs | [gap-ledger-125] pass after all comparisons |
| gap-ledger-126 | Compare repaired ledger values | gates.test.mjs | [gap-ledger-126] compare repaired ledger values |
| gap-ledger-126 | Compare repaired ledger values | gates.test.mjs | [gap-ledger-126] repair absent totals and stale test names |
| gap-ledger-127 | Record a snapshot without a changed gap | gates.test.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| gap-ledger-128 | Keep history for an identical snapshot | gates.test.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| gap-ledger-129 | Record a different snapshot | gates.test.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| gap-ledger-129 | Record a different snapshot | gates.test.mjs | [gap-ledger-129] record a different hash without a changed gap |
| gap-ledger-129 | Record a different snapshot | gates.test.mjs | [gap-ledger-129] record a different change without a changed gap |
| gap-ledger-130 | Record dirty input paths | gates.test.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their return to HEAD |
| gap-ledger-130 | Record dirty input paths | gates.test.mjs | [gap-ledger-130] refuse a failed ratchet file comparison |
| gap-ledger-130 | Record dirty input paths | gates.test.mjs | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history |
| gap-ledger-131 | Omit dirty paths for a clean ratchet | gates.test.mjs | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field |
| gap-ledger-132 | Record a different dirty list | gates.test.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their return to HEAD |
| gap-ledger-132 | Record a different dirty list | gates.test.mjs | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history |
| gap-ledger-133 | Accept the extra history field | gates.test.mjs | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field |
| gap-ledger-133 | Accept the extra history field | ledger.test.mjs | [gap-ledger-133] accept dirty history in each reader |
| gap-ledger-134 | Keep ignored names for ratchet history | gates.test.mjs | [gap-ledger-134] add ignored name markers before the ratchet command |
```

## Mutation proof

### C3: Whole mutation file

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem NODE_OPTIONS='--test-isolation=none' taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/gates-onem/.gev-cache/hardening-copy /home/ianblenke/docker/gev-tools/gates-onem/muts.json
```

The cache copy has the same production modules, Makefile, process documents and test files as the working tree.
The main code stays unchanged during C3.
Each source text occurs once.
Each row below failed a repository test.
No row stopped at its time limit.

C3 killed 114 rows. Survivors and open rows are zero.

The change folder also has mutations.json with the exact source and replacement text.
The table uses JSON strings for that text.
The final column gives the first failed repository test.

```text
ID | File | Source text | Replacement text | Failed repository test
068-tests | scripts/spec/gates.mjs | "? documentMeasurement({ root, change, openSpec, snapshot, phase })" | "? phase('measure', () => measure({ root, spawn, env, allocationFiles, change, openSpec, phase }))" | [coverage-gate-068] trust a changed document
123-twice | scripts/spec/gates.mjs | "  const { counts } = measured.trace.report;" | "  if (command === 'ratchet') measure({ root, spawn, env, allocationFiles, change, openSpec, phase });\n  const { counts } = measured.trace.report;" | [gap-ledger-123] compare one ratchet measurement
124-review | scripts/spec/gates.mjs | "...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles }) }) : [])," | "...[]," | [gap-ledger-124] fail for an absent review
125-status | scripts/spec/gates.mjs | "return command === 'ratchet' && status !== 0 ? 2 : status;" | "return command === 'ratchet' ? 2 : status;" | [gap-ledger-125] pass after all comparisons
126-ledger | scripts/spec/gates.mjs | "    ledger = readLedger(root);" | "    ledger = ledger;" | [gap-ledger-126] compare repaired ledger values
069-path | scripts/spec/lib/measurement.mjs | "  return inventory.has(file);" | "  return false;" | [coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory
070-path | scripts/spec/lib/measurement.mjs | "  if (isTestFile(file)) return true;" | "  if (isTestFile(file)) return false;" | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs
071-path | scripts/spec/lib/measurement.mjs | "  if (/^scripts\\/qa-.*\\.mjs$/.test(file)) return true;" | "  if (/^scripts\\/qa-.*\\.mjs$/.test(file)) return false;" | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs
072-path | scripts/spec/lib/measurement.mjs | "  if (file === 'package-lock.json') return true;" | "  if (file === 'package-lock.json') return false;" | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json
073-path | scripts/spec/lib/measurement.mjs | "  if (file === '.node-version') return true;" | "  if (file === '.node-version') return false;" | [coverage-gate-073 coverage-gate-078] classify the ignored Node version
074-path | scripts/spec/lib/measurement.mjs | "  if (file === 'Makefile') return true;" | "  if (file === 'Makefile') return false;" | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile
075-path | scripts/spec/lib/measurement.mjs | "  if (/(^|\\/)Dockerfile[^/]*$/.test(file)) return true;" | "  if (/(^|\\/)Dockerfile[^/]*$/.test(file)) return false;" | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile
076-path | scripts/spec/lib/measurement.mjs | "  if (/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/.test(file)) return true;" | "  if (/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/.test(file)) return false;" | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml
077-path | scripts/spec/lib/measurement.mjs | "  if (file.startsWith('scripts/spec/')) return true;" | "  if (file.startsWith('scripts/spec/')) return false;" | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt
078-untracked | scripts/spec/lib/measurement.mjs | "const others = spawn('git', ['ls-files', '--others', '--exclude-standard', '-z'], options);" | "const others = { status: 0, stdout: '' };" | [coverage-gate-078] refuse an untracked code file
079-history | scripts/spec/lib/measurement.mjs | "['coverage', 'untraced', 'measurement'].includes(item.kind)" | "true" | [coverage-gate-079] refuse history from another change or command
079-change | scripts/spec/lib/measurement.mjs | "item.change === change &&" | "true &&" | [coverage-gate-079] refuse history from another change or command
080-commit | scripts/spec/lib/measurement.mjs | "const commit = resolveCommit(root, line.commit);" | "const commit = resolveCommit(root, 'HEAD');" | [coverage-gate-080] refuse a commit that Git cannot find
081-words | scripts/spec/lib/measurement.mjs | "file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | "file && file !== 'openspec/ste/words.json' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | [coverage-gate-081] refuse a changed word list
082-hash | scripts/spec/lib/measurement.mjs | "if (contentHash(text) !== line.measurement)" | "if (false)" | [coverage-gate-082] refuse an absent measurement snapshot
082-absent | scripts/spec/lib/measurement.mjs | "if (!existsSync(absolute)) return" | "if (false) return" | [coverage-gate-082] refuse an absent measurement snapshot
083-start | scripts/spec/gates.mjs | "  log(`Started: ${started.toISOString()}`);" | "  log('Started: wrong');" | [coverage-gate-083] show command times
083-finish | scripts/spec/gates.mjs | "log(`Finished: ${finished.toISOString()} (${(finished.getTime() - started.getTime()) / 1000} s)`);" | "log('Finished: wrong');" | [coverage-gate-083] show command times
084-cutoff | scripts/spec/gates.mjs | "if (seconds > 1) log" | "if (seconds >= 1) log" | [coverage-gate-084] show slow phase times
084-phase | scripts/spec/gates.mjs | "log(`Phase ${name}: ${seconds} s`)" | "log(`Phase wrong: ${seconds} s`)" | [coverage-gate-084] show slow phase times
085-links | scripts/spec/gates.mjs | "...checkLinks({ links: readLinks(root), current: measured.links })," | "...[]," | [coverage-gate-085] keep every file gate
085-registry | scripts/spec/gates.mjs | "...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired })," | "...[]," | [coverage-gate-085] check the base registry without tests
085-specs | scripts/spec/gates.mjs | "errors.push(...lintSpecs({ requirements: specs.requirements, orphans: specs.orphans, changeIds: specs.changeIds, readTasks: tasksReader(root) }));" | "errors.push();" | [coverage-gate-085] keep every file gate
085-lint | scripts/spec/gates.mjs | "const lint = phase('lint', () => lintFindings(root, measured.records));" | "const lint = { errors: [], warnings: [], failed: false };" | [coverage-gate-085] keep every file gate
011-precheck | Makefile | "node scripts/check-import-directions.mjs &&" | "true &&" | [ci-gates-011] add fast checks before review
012-docs | Makefile | "check --no-measure $(CHANGE_ARG) $(BASE_ARG)" | "check $(CHANGE_ARG) $(BASE_ARG)" | [ci-gates-012] add a document gate target
033-final | .claude/commands/opsx/review.md | "Then run `make gates CHANGE=<name>` on the final tree." | "Then continue on the final tree." | [change-review-033] keep the final measurement
068-own-option | scripts/spec/gates.mjs | "options.noMeasure = true;" | "options.noMeasure = undefined;" | [coverage-gate-068] set the document option on the options object
068-dependencies | scripts/spec/lib/measurement.mjs | "!/(^|\\/)node_modules\\//.test(file) && " | "" | [coverage-gate-078 coverage-gate-089] trust other ignored files
086-package | scripts/spec/lib/measurement.mjs | "  if (file === 'package.json') return true;" | "  if (file === 'package.json') return false;" | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json
087-diff | scripts/spec/lib/measurement.mjs | "diff.status !== 0 || others.status !== 0" | "false || others.status !== 0" | [coverage-gate-087] refuse a failed Git comparison
087-others | scripts/spec/lib/measurement.mjs | "diff.status !== 0 || others.status !== 0" | "diff.status !== 0 || false" | [coverage-gate-087] refuse a failed Git comparison
085-openspec | scripts/spec/gates.mjs | "errors.push(...checkOpenSpec({ root, specs, run: (args) => openSpec(root, args) }));" | "errors.push();" | [coverage-gate-085] check OpenSpec without tests
085-archive | scripts/spec/gates.mjs | "errors.push(...archived.errors, ...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));" | "errors.push(...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));" | [coverage-gate-085] check archived specs without tests
085-filters | scripts/spec/gates.mjs | "errors.push(...findCoverageFlags({ tracked, readFile }));" | "errors.push();" | [coverage-gate-085] check coverage filters without tests
126-totals | scripts/spec/lib/ledger.mjs | "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'" | "'LEDGER-STALE', 'LEDGER-VERSION'" | [gap-ledger-126] repair absent totals and stale test names
126-stale | scripts/spec/lib/ledger.mjs | "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'" | "'LEDGER-NO-TOTALS', 'LEDGER-VERSION'" | [gap-ledger-126] compare repaired ledger values
126-version | scripts/spec/lib/ledger.mjs | "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'" | "'LEDGER-STALE', 'LEDGER-NO-TOTALS'" | [gap-ledger-126] compare repaired ledger values
012-copy | Makefile | "cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json" | "true" | [ci-gates-012] add a document gate target
068-command-option | scripts/spec/gates.mjs | "key === '--no-measure' && command === 'check'" | "key === '--no-measure' && true" | [coverage-gate-068] set the document option on the options object
124-status | scripts/spec/gates.mjs | "return command === 'ratchet' && status !== 0 ? 2 : status;" | "return status;" | [gap-ledger-124] fail for an absent review
083-check-time | scripts/spec/gates.mjs | "const timed = parsed.command === 'check' || parsed.command === 'ratchet';" | "const timed = parsed.command === 'ratchet';" | [coverage-gate-083] show command times
083-ratchet-time | scripts/spec/gates.mjs | "const timed = parsed.command === 'check' || parsed.command === 'ratchet';" | "const timed = parsed.command === 'check';" | [coverage-gate-083] show command times
084-elapsed | scripts/spec/gates.mjs | "(finished.getTime() - started.getTime()) / 1000" | "(finished.getTime() - started.getTime()) / 1" | [coverage-gate-084] show slow phase times
127-history | scripts/spec/gates.mjs | "unchanged ? [] : [{ date, change, commit: headCommit(root), kind: 'measurement' }]" | "[]" | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes
127-stamp | scripts/spec/gates.mjs | "history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) }))" | "history.map(line => ({ ...line, ...(dirty.length > 0 ? { dirty } : {}) }))" | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes
128-same | scripts/spec/gates.mjs | "const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);" | "const unchanged = false;" | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes
129-hash | scripts/spec/gates.mjs | "previous?.measurement === measurement && previous.commit === headCommit(root)" | "true && previous.commit === headCommit(root)" | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes
129-commit | scripts/spec/gates.mjs | "previous?.measurement === measurement && previous.commit === headCommit(root)" | "previous?.measurement === measurement && true" | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes
129-change | scripts/spec/gates.mjs | "findLast(line => line.change === change)" | "findLast(line => true)" | [gap-ledger-129] record a different change without a changed gap
011-format | Makefile | "node scripts/format.mjs --check &&" | "true &&" | [ci-gates-011] add fast checks before review
011-boundaries | Makefile | "node scripts/check-package-boundaries.mjs &&" | "true &&" | [ci-gates-011] add fast checks before review
011-tokens | Makefile | "node scripts/check-layer-state-tokens.mjs --base-ref origin/main" | "true" | [ci-gates-011] add fast checks before review
069-tracked | scripts/spec/lib/measurement.mjs | "file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | "file && file !== 'src/new.js' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | [coverage-gate-069] refuse a new tracked inventory file
069-base | scripts/spec/lib/measurement.mjs | "file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | "file && file !== 'src/math.js' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | [coverage-gate-069 coverage-gate-092] refuse a code file move
078-inventory | scripts/spec/lib/measurement.mjs | "file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | "file && file !== 'src/new.js' && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))" | [coverage-gate-078] refuse an untracked code file
085-base | scripts/spec/gates.mjs | "const baseErrors = compareWithBase({" | "const baseErrors = (() => [])({" | [coverage-gate-085] compare the ledger with the base without tests
085-ledger | scripts/spec/gates.mjs | "const comparison = compareLedger({ ledger, current: measured.current, sameAsBase, waivers });" | "const comparison = { errors: [], stale: [] };" | [coverage-gate-085] compare the ledger with the base without tests
085-base-registry | scripts/spec/gates.mjs | "...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) })," | "...[]," | [coverage-gate-085] check the base registry without tests
085-archive-reviews | scripts/spec/gates.mjs | "...checkArchivedReviews(root, { except: folder })," | "...[]," | [coverage-gate-085] check all review files without tests
085-names | scripts/spec/gates.mjs | "...checkChangeNames(root)," | "...[]," | [coverage-gate-085] check all review files without tests
085-agents | scripts/spec/gates.mjs | "...checkAgents(root)," | "...[]," | [coverage-gate-085] check all review files without tests
085-command | scripts/spec/gates.mjs | "...checkReviewCommand(root)," | "...[]," | [coverage-gate-085] check all review files without tests
033-precheck | .claude/commands/opsx/review.md | "1. Run `make precheck`." | "1. Continue." | [change-review-033] keep the final measurement
033-step1 | .claude/commands/opsx/review.md | "or run `make gates-docs CHANGE=<name>`." | "or continue." | [change-review-033] keep the final measurement
033-step3 | .claude/commands/opsx/review.md | "3. Run `make gates-docs CHANGE=<name>` again." | "3. Continue again." | [change-review-033] keep the final measurement
033-step10 | .claude/commands/opsx/review.md | "Use `make gates-docs CHANGE=<name>` and start again at step 3." | "Start again at step 3." | [change-review-033] keep the final measurement
033-step11 | .claude/commands/opsx/review.md | "Then run `make gates-docs CHANGE=<name>`, which must give only review errors." | "Then continue." | [change-review-033] keep the final measurement
033-step15 | .claude/commands/opsx/review.md | "15. Run `make gates-docs CHANGE=<name>`." | "15. Continue." | [change-review-033] keep the final measurement
033-ci | .claude/commands/opsx/review.md | "CI must also pass before you merge." | "Continue." | [change-review-033] keep the final measurement
005-ci-phase | scripts/spec/gates.mjs | "phase: (_name, fn) => fn ? fn() : () => {}" | "phase: (_name, fn) => fn()" | [ci-gates-005] keep the CI verdict without command times
127-summary | scripts/spec/gates.mjs | "log(`Ratchet: ${history.length} history lines for ${change}.`);" | "log(`Ratchet: ${result.history.length} history lines for ${change}.`);" | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes
068-trace-write | scripts/spec/gates.mjs | "  return { ...snapshot, specs, trace, qaScripts:" | "  writeLinks(root, buildLinks(trace.report));\n  return { ...snapshot, specs, trace, qaScripts:" | [coverage-gate-068] trust a changed document
033-review-inputs | .claude/commands/opsx/review.md | "Commit the protected inputs before the ratchet command." | "Continue with the protected inputs." | [change-review-033] keep the final measurement
033-agent-inputs | AGENTS.md | "Commit the protected inputs before the ratchet command." | "Continue with the protected inputs." | [change-review-033] keep the final measurement
012-docs-back | Makefile | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates" | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; $(GATES_BACK) || exit 2' gates" | [ci-gates-012] add a document gate target
012-docs-copy | Makefile | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates" | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c 'true || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates" | [ci-gates-012] add a document gate target
012-docs-env | Makefile | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates" | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; node scripts/spec/gates.mjs \"$$@\"' gates" | [ci-gates-012] add a document gate target
012-change | Makefile | "$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)" | "$(GATES_DOCS) check --no-measure $(BASE_ARG)" | [ci-gates-012] add a document gate target
012-base | Makefile | "$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)" | "$(GATES_DOCS) check --no-measure $(CHANGE_ARG)" | [ci-gates-012] add a document gate target
012-markers | Makefile | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates" | "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates" | [ci-gates-012] add a document gate target
088-names | Makefile | "cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | "cd /src && git ls-files --others --exclude-standard -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | [coverage-gate-088] refuse an omitted protected file
088-file | Makefile | "cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | "cd /tmp/work" | [coverage-gate-088] refuse an omitted protected file
088-content | Makefile | "cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | "cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"source\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | [coverage-gate-088] refuse an omitted protected file
088-exists | Makefile | "cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | "cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | [coverage-gate-088] refuse an omitted protected file
089-changes | scripts/spec/lib/measurement.mjs | "'openspec/changes/'" | "'no/changes/'" | [coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md
089-specs | scripts/spec/lib/measurement.mjs | "'openspec/specs/'" | "'no/specs/'" | [coverage-gate-089] trust a changed file at openspec/specs/x.md
089-trace | scripts/spec/lib/measurement.mjs | "'openspec/trace/'" | "'no/trace/'" | [coverage-gate-078 coverage-gate-089] trust other ignored files
091-slash | scripts/spec/lib/measurement.mjs | "file.startsWith(prefix)" | "file.startsWith(prefix.slice(0, -1))" | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md
092-second-name | scripts/spec/lib/measurement.mjs | "'--no-renames'" | "'--find-renames'" | [coverage-gate-069 coverage-gate-092] refuse a code file move
090-all-paths | scripts/spec/lib/measurement.mjs | "const changed = [...diff.stdout.split('\\0'), ...others.stdout.split('\\0')]" | "const changed = []" | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md
078-ignored | scripts/spec/lib/measurement.mjs | "const ignored = spawn('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '-z'], options);" | "const ignored = { status: 0, stdout: '' };" | [coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory
078-cache | scripts/spec/lib/measurement.mjs | "!file.startsWith('.gev-cache/') && " | "" | [coverage-gate-078 coverage-gate-089] trust other ignored files
087-ignored-status | scripts/spec/lib/measurement.mjs | " || ignored.status !== 0" | "" | [coverage-gate-087] refuse a failed Git comparison
093-dirty | scripts/spec/lib/measurement.mjs | "if (line.dirty?.length > 0)" | "if (false)" | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their return to HEAD
130-dirty-field | scripts/spec/gates.mjs | "...(dirty.length > 0 ? { dirty } : {})" | "...{}" | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their return to HEAD
131-empty-field | scripts/spec/gates.mjs | "...(dirty.length > 0 ? { dirty } : {})" | "...{ dirty }" | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field
132-dirty-equality | scripts/spec/gates.mjs | " && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty)" | "" | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history
130-dirty-paths | scripts/spec/gates.mjs | "const dirty = difference.files;" | "const dirty = [];" | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their return to HEAD
130-git-failure | scripts/spec/gates.mjs | "if (difference.reason) return report(log, [{ code: 'GATES-RATCHET', file: HISTORY_FILE, message: difference.reason }]);" | "" | [gap-ledger-130] refuse a failed ratchet file comparison
133-reader | scripts/spec/lib/ledger.mjs | ".map((line) => JSON.parse(line));" | ".map((line) => JSON.parse(line)).filter(line => !line.dirty);" | [gap-ledger-133] accept dirty history in each reader
134-image-markers | Makefile | "if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi;" | ":" | [gap-ledger-134] add ignored name markers before the ratchet command
078-root-deps | scripts/spec/lib/measurement.mjs | "(^|\\/)node_modules" | "(\\/)node_modules" | [coverage-gate-078 coverage-gate-089] trust other ignored files
078-nested-deps | scripts/spec/lib/measurement.mjs | "(^|\\/)node_modules" | "(^)node_modules" | [coverage-gate-078 coverage-gate-089] trust other ignored files
078-deps-slash | scripts/spec/lib/measurement.mjs | "node_modules\\//.test(file)" | "node_modules/.test(file)" | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs
134-definition-order | Makefile | "GATES_DOCS_MARKERS := cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work\nGATES := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates" | "GATES := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates\nGATES_DOCS_MARKERS := cd /src && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work" | [gap-ledger-134] add ignored name markers before the ratchet command
134-command | Makefile | "if [ \"$$1\" != ratchet ]" | "if [ \"$$1\" = ratchet ]" | [gap-ledger-134] add ignored name markers before the ratchet command
130-sort | scripts/spec/lib/measurement.mjs | "[...new Set([...changed, ...protectedIgnored])].sort()" | "[...new Set([...changed, ...protectedIgnored])]" | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history
078-inventory-source | scripts/spec/lib/measurement.mjs | "codeInventory(listFilesAt(root, commit))" | "codeInventory(ignored.stdout.split('\\0'))" | [coverage-gate-078 coverage-gate-089] trust other ignored files
```

### Replaced rows

The first pass had ninety rows.
The lead reported that all rows were killed.
The hardening command repeated the whole file after the changes.

| Row | Reason |
|---|---|
| 078-untracked | Compare all untracked paths through the path rule. |
| 068-dependencies | Test the dependency exception for ignored files. |
| 127-stamp | Include the dirty field in the history source text. |
| 128-same | Include the dirty list in the unchanged source text. |
| 069-tracked | Test the new tracked code path through the path rule. |
| 069-base | Test the deleted code path through the path rule. |
| 078-inventory | Test the untracked code path through the path rule. |
| 081-words | Refuse the word list path instead of adding a redundant refusal. |

Ignored protected class rows now use ignored-file tests.
The class rule still uses the code inventory at the ratchet commit.
The added inventory source row prevents extra refusal for ignored build files.

## Lead probe cases

### C4: Probe script

The lead supplied probe-trust.mjs.
The copy changes the module path and puts temporary repositories in the scratch folder.
The copy uses spawnSync for Git because the sandbox gave false execFileSync errors.
The probe calls the production snapshot and trust functions.
Probe results do not prove a killed mutation.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/gates-onem/harden-probe.mjs
```

The lead reported trust for document changes under the old path rule.
C4 refuses those document paths under the new rule.
The clean tree and ignored dependency case still have trust.
C4 reports 22 cases: two trusted and twenty refused.

```text
TRUSTED  clean tree
REFUSED  docs only change (tracked) — Protected files differ from the ratchet commit ["docs/readme.md"]
REFUSED  new untracked doc — Protected files differ from the ratchet commit ["docs/new.md"]
REFUSED  edit test file — Protected files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  edit code file — Protected files differ from the ratchet commit ["src/a.js"]
REFUSED  edit Makefile — Protected files differ from the ratchet commit ["Makefile"]
REFUSED  edit package.json — Protected files differ from the ratchet commit ["package.json"]
REFUSED  new untracked test — Protected files differ from the ratchet commit ["src/b.test.mjs"]
REFUSED  new untracked code file — Protected files differ from the ratchet commit ["src/b.js"]
REFUSED  new IGNORED test — Protected files differ from the ratchet commit ["ignored.test.mjs"]
REFUSED  delete test — Protected files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  delete code — Protected files differ from the ratchet commit ["src/a.js"]
REFUSED  rename code — Protected files differ from the ratchet commit ["src/a.js","src/c.js"]
REFUSED  staged code edit — Protected files differ from the ratchet commit ["src/a.js"]
REFUSED  edit scripts/spec file — Protected files differ from the ratchet commit ["scripts/spec/g.mjs"]
REFUSED  edit qa script — Protected files differ from the ratchet commit ["scripts/qa-x.mjs"]
REFUSED  edit snapshot — The snapshot hash differs from history
REFUSED  remove snapshot — The ratchet snapshot is absent
REFUSED  edit a .env-like and a nested Dockerfile — Protected files differ from the ratchet commit ["app/Dockerfile.dev"]
REFUSED  untracked compose yml — Protected files differ from the ratchet commit ["docker-compose.override.yml"]
TRUSTED  new untracked file in node_modules code
REFUSED  other change — The change has no ratchet history line
```

## Host helper

The helper makes fixture bundles serial.
Main fixture tests keep process isolation.
Nested test processes use no isolation to keep the process total within the host limit.
The final native checks need no pipe repair.

```js
import childProcess from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { fileURLToPath } from 'node:url';
const preload = fileURLToPath(import.meta.url);
const nativeSync = childProcess.spawnSync;
function nodeArgs(args) {
  const next = ['--import', preload, ...args];
  if (args.includes('--test')) {
    if (!args.some(arg => arg.startsWith('--test-concurrency='))) next.unshift('--test-concurrency=1');
    if (process.env.NODE_TEST_CONTEXT === 'child-v8' && !args.some(arg => arg.startsWith('--test-isolation='))) next.unshift('--test-isolation=none');
  }
  return next;
}
childProcess.spawnSync = function(command, args, options) {
  if (command === process.execPath && Array.isArray(args)) {
    if (args[0]?.endsWith('/scripts/spec/lib/run-parallel.mjs')) {
      const runs = JSON.parse(readFileSync(args[1], 'utf8'));
      const results = runs.map(run => {
        const result = nativeSync(command, nodeArgs(run.args), { cwd: run.cwd, env: run.env ? { ...options.env, ...run.env } : options.env, stdio: ['ignore', 'ignore', 'inherit'] });
        return { status: result.status, error: result.error?.message ?? null };
      });
      writeFileSync(args[2], JSON.stringify(results));
      return { status: 0 };
    }
    args = nodeArgs(args);
  }
  return nativeSync.call(this, command, args, options);
};
const nativeSpawn = childProcess.spawn;
childProcess.spawn = function(command, args, options) {
  if (command === process.execPath && Array.isArray(args)) args = nodeArgs(args);
  return nativeSpawn.call(this, command, args, options);
};
syncBuiltinESMExports();
```

## Other checks

### C5: Format

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```

```text
Formatted 1158 source files.
Checked 1158 source files.
```

### C6: STE

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change gates-one-measurement 2>&1 | grep -E "^(ERROR|STE)"
```

### C7: Predispatch

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/gates-one-measurement
```

C6 reports zero STE errors.
C7 has no real word, pronoun, task or number error.
The abbreviation hits name Git symbols and required code or output text.
The name pairs have different meanings.

### C8: Source search

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && rg -n -e ALLOWED_PATHS -e "uncommitted protected files" -e --no-renames -e previous.dirty -e dirty.length scripts/spec/lib/measurement.mjs scripts/spec/gates.mjs
```

```text
scripts/spec/gates.mjs:636:    const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);
scripts/spec/gates.mjs:638:    appendHistory(root, history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) })));
scripts/spec/lib/measurement.mjs:10:const ALLOWED_PATHS = ['openspec/changes/', 'openspec/specs/', 'openspec/trace/'];
scripts/spec/lib/measurement.mjs:39:  if (line.dirty?.length > 0) return { reason: 'The ratchet ran with uncommitted protected files', files: line.dirty, commit: line.commit };
scripts/spec/lib/measurement.mjs:57:  const diff = spawn('git', ['diff', '--name-only', '--no-renames', '-z', commit, '--'], options);
scripts/spec/lib/measurement.mjs:62:  const changed = [...diff.stdout.split('\0'), ...others.stdout.split('\0')].filter(file => file && !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)));
```

## Earlier attempts

The first sandbox attempt stopped before a per-test result was available.
No passed verdict applies to that attempt.
Other sandbox attempts gave false child-process errors or changed old fixture behavior through the host helper.
The affected old fixture tests passed with normal pipes and the first helper.

The first native whole-file check stopped before the end for the ignored-file correction.
That check has no test or coverage verdict.
C2 is the final check on the fixed source.

## Changed files

```text
 M .claude/commands/opsx/review.md
 M AGENTS.md
 M Makefile
 M docs/roadmap/mcp-agent-backends.md
 M scripts/spec/gates.mjs
 M src/tooling/spec/ciFiles.test.mjs
 M src/tooling/spec/gates.test.mjs
 M src/tooling/spec/ledger.test.mjs
?? openspec/changes/gates-one-measurement/
?? scripts/spec/lib/measurement.mjs
```

## Remaining work

The pinned image gates, CI and two-agent review are not part of these host results.
The final gate and review tasks stay unchecked.
The task made no real measurement, trace edit, commit, push, make command or Docker command.
