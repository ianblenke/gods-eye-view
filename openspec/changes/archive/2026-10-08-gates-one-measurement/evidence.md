# Evidence for review round two corrections

The correction tree starts at commit `e4cf164097969d4f971afa46e757a34aac0179bb`.
The command `git rev-parse HEAD` gives that commit.
The change was active under `openspec/changes/gates-one-measurement/` during these checks.
The earlier change was active at that path at the commit of the earlier evidence.
No commit command ran in this correction task.

## Host limits

All Node and Python processes use cores 12 to 15 and priority 19.
The host version command gave `v26.8.2`.
The plain test, format and probe commands stopped or gave EPERM errors.
Those attempts give no check verdict.

The first complete host suite had failures in child process tests.
The passed gate, guard and reporter commands ran without the sandbox child process errors.
The parent arguments and child environment have the test isolation setting.
The host helpers use the actual child status and output when the host adds an EPERM error.
The helpers do not change repository tests or gate rules.

The probes use a fresh scratch copy instead of `gonem-verify`.
The brief limits file changes to the clone and scratch folder.
The original lead probe files stay unchanged.
Container gates, CI, archive and the two review agents remain tasks for the lead.
Tasks 3.1 to 3.4 stay unchecked.

The report labels CG, GL and CR name coverage-gate, gap-ledger and change-review.

## Review correction map

Each round two row applies to changes on commit `e4cf164097969d4f971afa46e757a34aac0179bb`.

| Report | First words | Correction | Commit |
|---|---|---|---|
| Spec | Makefile:11 GATES_DOCS_MARKERS | Add a table with every class and extension. Check the real shell command, marker contents, exclusions and class pathspecs. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec | gates.mjs:344 The requirement | Add current QA capability tests. Remove the source import and coverage comment calls. Keep the coverage filter gate for allowed JSON files. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec | measurement.mjs:62 file.startsWith | Add each nested false prefix and the includes mutation. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec | gates.mjs:692 Scenario 083 | Check no time lines for lint, init, adopt, waive, rebaseline, tree and ci. Add a row for each command. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec | gates.mjs:677 The ratchet reviews | Read changed file names again after trace files change. Test equal review errors from ratchet and check. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec | measurement.mjs:38 Ratchet commit | Assert the commit line for each refusal class. State none for absent history. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec | proposal.md:41 Only the document mode | Name the snapshot file comparison and the ratchet history hash separately. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec note | AGENTS.md rule 9 | Pin the verdict rule and final gate step with sentence tests and mutations. | e4cf164097969d4f971afa46e757a34aac0179bb |
| Spec note | CI on Ubuntu | Record the shell comparison limit and the image proof from the lead brief. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | P:41 Only the document mode | Correct the hash sentence in the proposal and evidence. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | GL:54,80 ignored input files | Use protected ignored files in the ledger, design, evidence and container titles. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | D:76 Use the ratchet verdict | Start review with make gates-docs after precheck. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | CG:5,7,25 trusts the snapshot | Define ratchet commit once beside the history line. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | AGENTS.md:62 The mode | Use the command and name code files and test files. The word them can mean all changed files. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | CG:167 an agent file | Name files under docs. Define input file once and point to that definition from each guide. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | CG:204-205 D:107 file class test | Use checks the file class before the path. Use check for the commit ancestry operation. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | CI:5 all four CI file checks | Use all four CI checks. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | GL:4 to write the files | State one measurement for files and comparisons. Name check and ratchet in the time scenario. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | gates.mjs:698 CG:30 is trusted | Use the active snapshot trust message in code, tests and specs. Name files that differ from HEAD. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | P:38 CR:5,7,12 one name | Use the three allowed paths, document steps, all gates, moved, dirty list and pinned container. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | gates.test.mjs:2492 titles | Correct commit hash, ignored file, changed ratchet and marker removal titles. | e4cf164097969d4f971afa46e757a34aac0179bb |
| STE | evidence.md:5,52 The change is active | Use past tense for the earlier commit. Name the current correction commit separately. | e4cf164097969d4f971afa46e757a34aac0179bb |

The AGENTS sentence uses the full file class names instead of the suggested pronoun.
The changes include all other corrections.

### Earlier correction map

All rows apply to the commit in the last column.
The changes include every STE correction.

| Report | First words | Correction | Commit |
|---|---|---|---|
| Spec | Makefile:10 GATES_DOCS_MARKERS | Exclude cache files. Remove created markers before the container copies files back. Test cache and trace contents. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.test.mjs:2216 Operand mutations | Test every prefix boundary and ignored Docker and compose operand. Add negative name cases. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.test.mjs:1825 Scenario 080 | Assert the ratchet commit line with forty literal zero digits. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | measurement.mjs:62 The prefix test | Refuse code and tests under each allowed path before the prefix test. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | measurement.mjs:40 resolveCommit | Use forty hexadecimal digits. State the ancestry decision and who reads the snapshot hash. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.mjs:700 Command: check | Assert the full check header. State other command times and the exception limit. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | Makefile:44 In precheck | Assert the exact command text with all conjunctions. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | coverage-gate/spec.md:12 class list | Define protected ignored files once. Use input files for files outside the allowed paths. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | measurement.mjs:57 git diff | State the Git index flag limit in the proposal. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.mjs:643 history | Test the new totals history line against a base ledger. Add the snapshot copy result to the scenario. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gap-ledger/spec.md:34,43 same snapshot | Add the dirty list to both descriptions of unchanged history. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gates.mjs:698 output | Use NO TEST RUN and snapshot in the log and tests. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gates.mjs:718 commit line | Use Ratchet commit in refusals and their tests. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | AGENTS.md:62 document steps | Name the three allowed paths. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | AGENTS.md:60 input files | Use the requested commit instruction and input file term. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | review.md:14,16 ratchet sequence | Start after the ratchet. Test the new sentences and the second ratchet instruction. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gap-ledger/spec.md:7 status | State status 1 for errors before the ratchet writes files. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | design.md:17 conditional tense | Use simple present tense and verb clauses for file actions. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | coverage-gate/spec.md:137-144 container names | Use container for the Docker process. Use file checks and steps. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | AGENTS.md:45,46,22,76-78 | Remove now and the semicolon. Add a heading after the backfill steps. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gap-ledger/spec.md:55 design.md:31 decision | Use the requested decision, clock, error line, empty list and trace copy terms. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | evidence.md:4,574,580-582 tree | Name the current commit and active path. Correct the Makefile comment. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | evidence.md:115,117,124 test corrections | Use direct test-failure terms. Correct the source comments. | c87e7eb88b263791c21277a604ec23c745aafd0e |

## Tests and coverage

The command below starts one process per file without a forced exit option.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/gates-onem/round3-tests.py
```

| File | Tests | Pass | Fail | Skip |
|---|---:|---:|---:|---:|
| ci.test.mjs | 6 | 6 | 0 | 0 |
| ciFiles.test.mjs | 4 | 4 | 0 | 0 |
| coverage.test.mjs | 15 | 15 | 0 | 0 |
| gates.test.mjs | 227 | 227 | 0 | 0 |
| git.test.mjs | 4 | 4 | 0 | 0 |
| importReach.test.mjs | 12 | 12 | 0 | 0 |
| inventory.test.mjs | 8 | 8 | 0 | 0 |
| ledger.test.mjs | 90 | 90 | 0 | 0 |
| openspec.test.mjs | 4 | 4 | 0 | 0 |
| qaRegister.test.mjs | 31 | 31 | 0 | 0 |
| registry.test.mjs | 15 | 15 | 0 | 0 |
| review.test.mjs | 33 | 33 | 0 | 0 |
| runParallel.test.mjs | 3 | 3 | 0 | 0 |
| specLint.test.mjs | 17 | 17 | 0 | 0 |
| specs.test.mjs | 20 | 20 | 0 | 0 |
| ste.test.mjs | 45 | 45 | 0 | 0 |
| testGuard.test.mjs | 31 | 31 | 0 | 0 |
| trace.test.mjs | 25 | 25 | 0 | 0 |
| traceReporter.test.mjs | 10 | 10 | 0 | 0 |
| v8Merge.test.mjs | 11 | 11 | 0 | 0 |
| Total | 611 | 611 | 0 | 0 |

The process output gives each total.
The gate test process also supplies the coverage output.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ci.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-isolation=none src/tooling/spec/ciFiles.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/coverage.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none --experimental-test-coverage --test-coverage-include=scripts/spec/gates.mjs --test-coverage-include=scripts/spec/lib/measurement.mjs --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/gates-onem/round3-coverage.lcov src/tooling/spec/gates.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/git.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/importReach.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/inventory.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ledger.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/openspec.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/qaRegister.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/registry.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/review.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/runParallel.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/specLint.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/specs.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ste.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-isolation=none src/tooling/spec/testGuard.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/trace.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-isolation=none src/tooling/spec/traceReporter.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/v8Merge.test.mjs
```

| File | Lines | Branches | Functions |
|---|---:|---:|---:|
| scripts/spec/gates.mjs | 735/735 (100%) | 321/321 (100%) | 87/87 (100%) |
| scripts/spec/lib/measurement.mjs | 65/65 (100%) | 57/57 (100%) | 8/8 (100%) |

### Earlier host coverage

The earlier evidence supplied the following baseline command and results.
The current task did not repeat that baseline command.

The final gate test command supplies the current coverage file.
The baseline command below uses the scratch tree from the named base commit.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none --experimental-test-coverage --test-coverage-include=/home/ianblenke/docker/gev-tools/gates-onem/round1-base-c87e7eb/scripts/spec/gates.mjs --test-coverage-include=/home/ianblenke/docker/gev-tools/gates-onem/round1-base-c87e7eb/scripts/spec/lib/measurement.mjs --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/gates-onem/round1-baseline.lcov /home/ianblenke/docker/gev-tools/gates-onem/round1-base-c87e7eb/src/tooling/spec/gates.test.mjs
```

| Tree | File | Lines | Branches | Functions |
|---|---|---:|---:|---:|
| Before | gates.mjs | 737/737 (100%) | 317/317 (100%) | 87/87 (100%) |
| Before | measurement.mjs | 65/65 (100%) | 53/53 (100%) | 8/8 (100%) |
| After | gates.mjs | 737/737 (100%) | 317/317 (100%) | 87/87 (100%) |
| After | measurement.mjs | 65/65 (100%) | 57/57 (100%) | 8/8 (100%) |

## Mutations

The complete mutation command ran after the code changes.
A repository test failed for each row.
No row timed out, and no row has absent or repeated old text.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/gates-onem /home/ianblenke/docker/gev-tools/gates-onem/muts.json
```

The command made repository tests fail for all 192 rows.
Rows 152 to 192 are new.

Row 124-review now names reviewFiles in the tree hash call.
Row 130-sort uses the new test title pattern.
Rows 075-boundary, 075-end and 075-no-slash use the new ignored file title.
Rows 076-suffix-no-slash, 076-dot and 076-end use that title too.
Row 096-length uses the short commit hash title.

The first full file had seven selectors that matched no test.
The corrected selectors made repository tests fail, then the complete file ran again.

The mutation command cuts long test names. The unit output gives their full names.
No old row names either removed document mode call.
The two message changes had no old message row. Rows 191 and 192 test the new messages.

The class pathspec assertions also catch deletion of redundant globs.
The marker table still runs the real command and checks its file contents.

| ID | File | Failed repository test |
|---|---|---|
| 068-tests | scripts/spec/gates.mjs | [coverage-gate-068] trust a changed document |
| 123-twice | scripts/spec/gates.mjs | [gap-ledger-123] compare one ratchet measurement |
| 124-review | scripts/spec/gates.mjs | [gap-ledger-124] fail for an absent review |
| 125-status | scripts/spec/gates.mjs | [gap-ledger-125] pass after all comparisons |
| 126-ledger | scripts/spec/gates.mjs | [gap-ledger-126] compare repaired ledger values |
| 069-path | scripts/spec/lib/measurement.mjs | [coverage-gate-069 coverage-gate-078] classify a protected ignored code file |
| 070-path | scripts/spec/lib/measurement.mjs | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| 071-path | scripts/spec/lib/measurement.mjs | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs |
| 072-path | scripts/spec/lib/measurement.mjs | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json |
| 073-path | scripts/spec/lib/measurement.mjs | [coverage-gate-073 coverage-gate-078] classify the ignored Node version |
| 074-path | scripts/spec/lib/measurement.mjs | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile |
| 075-path | scripts/spec/lib/measurement.mjs | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile |
| 076-path | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| 077-path | scripts/spec/lib/measurement.mjs | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt |
| 078-untracked | scripts/spec/lib/measurement.mjs | [coverage-gate-078] refuse an untracked code file |
| 079-history | scripts/spec/lib/measurement.mjs | [coverage-gate-079] refuse history from another change or command |
| 079-change | scripts/spec/lib/measurement.mjs | [coverage-gate-079] refuse history from another change or command |
| 080-commit | scripts/spec/lib/measurement.mjs | [coverage-gate-080] refuse a commit that Git cannot find |
| 081-words | scripts/spec/lib/measurement.mjs | [coverage-gate-081] refuse a changed word list |
| 082-hash | scripts/spec/lib/measurement.mjs | [coverage-gate-082] refuse an absent snapshot |
| 082-absent | scripts/spec/lib/measurement.mjs | [coverage-gate-082] refuse an absent snapshot |
| 083-start | scripts/spec/gates.mjs | [coverage-gate-083] show command times |
| 083-finish | scripts/spec/gates.mjs | [coverage-gate-083] show command times |
| 084-cutoff | scripts/spec/gates.mjs | [coverage-gate-084] show slow phase times |
| 084-phase | scripts/spec/gates.mjs | [coverage-gate-084] show slow phase times |
| 085-links | scripts/spec/gates.mjs | [coverage-gate-085] keep every file check |
| 085-registry | scripts/spec/gates.mjs | [coverage-gate-085] check the base registry without tests |
| 085-specs | scripts/spec/gates.mjs | [coverage-gate-085] keep every file check |
| 085-lint | scripts/spec/gates.mjs | [coverage-gate-085] keep every file check |
| 011-precheck | Makefile | [ci-gates-011] add fast checks before review |
| 012-docs | Makefile | [ci-gates-012] add a document gate target |
| 033-final | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 068-own-option | scripts/spec/gates.mjs | [coverage-gate-068] set the document option on the options object |
| 068-dependencies | scripts/spec/lib/measurement.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 086-package | scripts/spec/lib/measurement.mjs | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json |
| 087-diff | scripts/spec/lib/measurement.mjs | [coverage-gate-087] refuse a failed Git comparison |
| 087-others | scripts/spec/lib/measurement.mjs | [coverage-gate-087] refuse a failed Git comparison |
| 085-openspec | scripts/spec/gates.mjs | [coverage-gate-085] check OpenSpec without tests |
| 085-archive | scripts/spec/gates.mjs | [coverage-gate-085] check archived specs without tests |
| 085-filters | scripts/spec/gates.mjs | [coverage-gate-085] check coverage filters without tests |
| 126-totals | scripts/spec/lib/ledger.mjs | [gap-ledger-126] repair absent totals and stale test names |
| 126-stale | scripts/spec/lib/ledger.mjs | [gap-ledger-126] compare repaired ledger values |
| 126-version | scripts/spec/lib/ledger.mjs | [gap-ledger-126] compare repaired ledger values |
| 012-copy | Makefile | [ci-gates-012] add a document gate target |
| 068-command-option | scripts/spec/gates.mjs | [coverage-gate-068] set the document option on the options object |
| 124-status | scripts/spec/gates.mjs | [gap-ledger-124] fail for an absent review |
| 083-check-time | scripts/spec/gates.mjs | [coverage-gate-083] name the full check command |
| 083-ratchet-time | scripts/spec/gates.mjs | [coverage-gate-083] show command times |
| 084-elapsed | scripts/spec/gates.mjs | [coverage-gate-084] show slow phase times |
| 127-history | scripts/spec/gates.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 127-stamp | scripts/spec/gates.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 128-same | scripts/spec/gates.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 129-hash | scripts/spec/gates.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 129-commit | scripts/spec/gates.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 129-change | scripts/spec/gates.mjs | [gap-ledger-129] record a different change without a changed gap |
| 011-format | Makefile | [ci-gates-011] add fast checks before review |
| 011-boundaries | Makefile | [ci-gates-011] add fast checks before review |
| 011-tokens | Makefile | [ci-gates-011] add fast checks before review |
| 069-tracked | scripts/spec/lib/measurement.mjs | [coverage-gate-069] refuse a new tracked inventory file |
| 069-base | scripts/spec/lib/measurement.mjs | [coverage-gate-069 coverage-gate-092] refuse a moved code file |
| 078-inventory | scripts/spec/lib/measurement.mjs | [coverage-gate-078] refuse an untracked code file |
| 085-base | scripts/spec/gates.mjs | [coverage-gate-085] compare the ledger with the base without tests |
| 085-ledger | scripts/spec/gates.mjs | [coverage-gate-085] compare the ledger with the base without tests |
| 085-base-registry | scripts/spec/gates.mjs | [coverage-gate-085] check the base registry without tests |
| 085-archive-reviews | scripts/spec/gates.mjs | [coverage-gate-085] check all review files without tests |
| 085-names | scripts/spec/gates.mjs | [coverage-gate-085] check all review files without tests |
| 085-agents | scripts/spec/gates.mjs | [coverage-gate-085] check all review files without tests |
| 085-command | scripts/spec/gates.mjs | [coverage-gate-085] check all review files without tests |
| 033-precheck | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-step1 | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-step3 | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-step10 | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-step11 | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-step15 | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-ci | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 005-ci-phase | scripts/spec/gates.mjs | [ci-gates-005 coverage-gate-083] keep the CI verdict without command times |
| 127-summary | scripts/spec/gates.mjs | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 068-trace-write | scripts/spec/gates.mjs | [coverage-gate-068] trust a changed document |
| 033-review-inputs | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 033-agent-inputs | AGENTS.md | [change-review-033] keep the final measurement |
| 012-docs-back | Makefile | [ci-gates-012] add a document gate target |
| 012-docs-copy | Makefile | [ci-gates-012] add a document gate target |
| 012-docs-env | Makefile | [ci-gates-012] add a document gate target |
| 012-change | Makefile | [ci-gates-012] add a document gate target |
| 012-base | Makefile | [ci-gates-012] add a document gate target |
| 012-markers | Makefile | [ci-gates-012] add a document gate target |
| 088-names | Makefile | [coverage-gate-088] refuse an omitted protected ignored file |
| 088-file | Makefile | [coverage-gate-088] refuse an omitted protected ignored file |
| 088-content | Makefile | [coverage-gate-088] refuse an omitted protected ignored file |
| 088-exists | Makefile | [coverage-gate-088] refuse an omitted protected ignored file |
| 089-changes | scripts/spec/lib/measurement.mjs | [coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md |
| 089-specs | scripts/spec/lib/measurement.mjs | [coverage-gate-089] trust a changed file at openspec/specs/x.md |
| 089-trace | scripts/spec/lib/measurement.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 091-slash | scripts/spec/lib/measurement.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md |
| 092-second-name | scripts/spec/lib/measurement.mjs | [coverage-gate-069 coverage-gate-092] refuse a moved code file |
| 090-all-paths | scripts/spec/lib/measurement.mjs | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md |
| 078-ignored | scripts/spec/lib/measurement.mjs | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| 078-cache | scripts/spec/lib/measurement.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 087-ignored-status | scripts/spec/lib/measurement.mjs | [coverage-gate-087] refuse a failed Git comparison |
| 093-dirty | scripts/spec/lib/measurement.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD |
| 130-dirty-field | scripts/spec/gates.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD |
| 131-empty-field | scripts/spec/gates.mjs | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field |
| 132-dirty-equality | scripts/spec/gates.mjs | [gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history |
| 130-dirty-paths | scripts/spec/gates.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD |
| 130-git-failure | scripts/spec/gates.mjs | [gap-ledger-130] refuse a failed ratchet file comparison |
| 133-reader | scripts/spec/lib/ledger.mjs | [gap-ledger-133] accept dirty history in each reader |
| 134-image-markers | Makefile | [gap-ledger-134] add ignored name markers before the ratchet command |
| 078-root-deps | scripts/spec/lib/measurement.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 078-nested-deps | scripts/spec/lib/measurement.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 078-deps-slash | scripts/spec/lib/measurement.mjs | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| 134-definition-order | Makefile | [gap-ledger-134] add ignored name markers before the ratchet command |
| 134-command | Makefile | [gap-ledger-134] add ignored name markers before the ratchet command |
| 130-sort | scripts/spec/lib/measurement.mjs | [gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history |
| 078-inventory-source | scripts/spec/lib/measurement.mjs | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 094-cache-marker | Makefile | [coverage-gate-094] keep cache source contents after the container ends |
| 094-cache-back | Makefile | [coverage-gate-094] keep cache source contents after the container ends |
| 091-trace-slash | scripts/spec/lib/measurement.mjs | [coverage-gate-091] refuse the input file at openspec/tracex/f.md |
| 078-cache-slash | scripts/spec/lib/measurement.mjs | [coverage-gate-078] refuse the input file at .gev-cachex/ignored.test.mjs |
| 080-commit-name | scripts/spec/lib/measurement.mjs | [coverage-gate-080] refuse a commit that Git cannot find |
| 095-test-class | scripts/spec/lib/measurement.mjs | [coverage-gate-095] refuse a new test file at openspec/changes/code.test.mjs |
| 095-code-class | scripts/spec/lib/measurement.mjs | [coverage-gate-095] refuse a new code file at openspec/changes/code.js |
| 096-commit-hash | scripts/spec/lib/measurement.mjs | [coverage-gate-096] refuse a commit ref in history |
| 083-check-command | scripts/spec/gates.mjs | [coverage-gate-083] name the full check command |
| 011-precheck-status | Makefile | [ci-gates-011] add fast checks before review |
| 126-history-after | scripts/spec/gates.mjs | [gap-ledger-126] read the new totals history line for the base ledger |
| 075-root | scripts/spec/lib/measurement.mjs | [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod |
| 075-nested | scripts/spec/lib/measurement.mjs | [coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates |
| 075-suffix | scripts/spec/lib/measurement.mjs | [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod |
| 076-root | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml |
| 076-prefix | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| 076-suffix | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml |
| 076-yaml | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| 076-yml | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| 075-boundary | scripts/spec/lib/measurement.mjs | [coverage-gate-075] do not protect the ignored file MyDockerfile |
| 075-end | scripts/spec/lib/measurement.mjs | [coverage-gate-075] do not protect the ignored file Dockerfile.dir/notes.txt |
| 075-no-slash | scripts/spec/lib/measurement.mjs | [coverage-gate-075] do not protect the ignored file Dockerfile.dir/notes.txt |
| 076-prefix-characters | scripts/spec/lib/measurement.mjs | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| 076-suffix-no-slash | scripts/spec/lib/measurement.mjs | [coverage-gate-076] do not protect the ignored file compose/other.yaml |
| 076-dot | scripts/spec/lib/measurement.mjs | [coverage-gate-076] do not protect the ignored file composeyml |
| 076-end | scripts/spec/lib/measurement.mjs | [coverage-gate-076] do not protect the ignored file compose.yaml.extra |
| 096-start | scripts/spec/lib/measurement.mjs | [coverage-gate-096] refuse a commit hash with prefix |
| 096-end | scripts/spec/lib/measurement.mjs | [coverage-gate-096] refuse a commit hash with suffix |
| 096-length | scripts/spec/lib/measurement.mjs | [coverage-gate-096] refuse a short commit hash |
| 096-hex | scripts/spec/lib/measurement.mjs | [coverage-gate-096] refuse a commit hash with letters |
| 033-input-correction | .claude/commands/opsx/review.md | [change-review-033] keep the final measurement |
| 094-marker-cleanup | Makefile | [coverage-gate-094] keep cache source contents after the container ends |
| 094-marker-list | Makefile | [coverage-gate-094] keep cache source contents after the container ends |
| 094-marker-no-list | Makefile | [coverage-gate-094] copy cache contents without a marker list |
| 097-copy-status | Makefile | [coverage-gate-097] stop before the container copies files when a marker cannot be removed |
| 011-precheck-import-status | Makefile | [ci-gates-011] add fast checks before review |
| 011-precheck-boundary-status | Makefile | [ci-gates-011] add fast checks before review |
| 152 | Makefile | [coverage-gate-099] check the marker class at scripts/spec/x.mjs |
| 153 | Makefile | [coverage-gate-099] check the marker class at package.json |
| 154 | Makefile | [coverage-gate-099] check the marker class at package-lock.json |
| 155 | Makefile | [coverage-gate-099] check the marker class at .node-version |
| 156 | Makefile | [coverage-gate-099] check the marker class at Makefile |
| 157 | Makefile | [coverage-gate-099] check the marker class at scripts/qa-x.mjs |
| 158 | Makefile | [coverage-gate-099] check the marker class at src/a.test.mjs |
| 159 | Makefile | [coverage-gate-099] check the marker class at Dockerfile |
| 160 | Makefile | [coverage-gate-099] check the marker class at compose.yaml |
| 161 | Makefile | [coverage-gate-099] check the marker class at containers/compose.gates.yml |
| 162 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.js |
| 163 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.mjs |
| 164 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.cjs |
| 165 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.ts |
| 166 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.mts |
| 167 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.cts |
| 168 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.jsx |
| 169 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.tsx |
| 170 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.html |
| 171 | Makefile | [coverage-gate-099] check the marker class at src/deep/x.sh |
| 172 | Makefile | [coverage-gate-099] check the marker class at node_modules/x.js |
| 173 | Makefile | [coverage-gate-099] check the marker class at .gev-cache/x.js |
| 174 | scripts/spec/gates.mjs | [coverage-gate-100] check QA capability names without tests |
| 175 | scripts/spec/lib/measurement.mjs | [coverage-gate-098] refuse a prefix inside docs/openspec/changes/x.md |
| 176 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for lint |
| 177 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for init |
| 178 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for adopt |
| 179 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for waive |
| 180 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for rebaseline |
| 181 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for tree |
| 182 | scripts/spec/gates.mjs | [coverage-gate-083] omit time lines for ci |
| 183 | scripts/spec/gates.mjs | [gap-ledger-135] include new trace content in the review tree |
| 184 | scripts/spec/lib/measurement.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD |
| 185 | scripts/spec/lib/measurement.mjs | [coverage-gate-087] refuse a failed Git comparison |
| 186 | scripts/spec/lib/measurement.mjs | [coverage-gate-082] refuse an absent snapshot |
| 187 | scripts/spec/lib/measurement.mjs | [coverage-gate-082] refuse an absent snapshot |
| 188 | scripts/spec/lib/measurement.mjs | [coverage-gate-079] refuse without a change name |
| 189 | AGENTS.md | [change-review-033] pin the agent verdict and final tree instructions |
| 190 | AGENTS.md | [change-review-033] pin the agent verdict and final tree instructions |
| 191 | scripts/spec/gates.mjs | [coverage-gate-068] trust a changed document |
| 192 | scripts/spec/lib/measurement.mjs | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD |

### Exact mutation changes

```json
[
  {
    "id": "068-tests",
    "file": "scripts/spec/gates.mjs",
    "old": "? documentMeasurement({ root, change, openSpec, snapshot, phase })",
    "new": "? phase('measure', () => measure({ root, spawn, env, allocationFiles, change, openSpec, phase }))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] trust a changed document"
  },
  {
    "id": "123-twice",
    "file": "scripts/spec/gates.mjs",
    "old": "  const { counts } = measured.trace.report;",
    "new": "  if (command === 'ratchet') measure({ root, spawn, env, allocationFiles, change, openSpec, phase });\n  const { counts } = measured.trace.report;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-123",
    "failed_test": "[gap-ledger-123] compare one ratchet measurement"
  },
  {
    "id": "124-review",
    "file": "scripts/spec/gates.mjs",
    "old": "...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles: reviewFiles }) }) : []),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-124",
    "failed_test": "[gap-ledger-124] fail for an absent review"
  },
  {
    "id": "125-status",
    "file": "scripts/spec/gates.mjs",
    "old": "return command === 'ratchet' && status !== 0 ? 2 : status;",
    "new": "return command === 'ratchet' ? 2 : status;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-125",
    "failed_test": "[gap-ledger-125] pass after all comparisons"
  },
  {
    "id": "126-ledger",
    "file": "scripts/spec/gates.mjs",
    "old": "    ledger = readLedger(root);",
    "new": "    ledger = ledger;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] compare repaired ledger values; [gap-ledger-126] repair absent totals and stale test names"
  },
  {
    "id": "069-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  return inventory.has(file);",
    "new": "  return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-069",
    "failed_test": "[coverage-gate-069 coverage-gate-078] classify a protected ignored code file"
  },
  {
    "id": "070-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (isTestFile(file)) return true;",
    "new": "  if (isTestFile(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-070",
    "failed_test": "[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs"
  },
  {
    "id": "071-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (/^scripts\\/qa-.*\\.mjs$/.test(file)) return true;",
    "new": "  if (/^scripts\\/qa-.*\\.mjs$/.test(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-071",
    "failed_test": "[coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs"
  },
  {
    "id": "072-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === 'package-lock.json') return true;",
    "new": "  if (file === 'package-lock.json') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-072",
    "failed_test": "[coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json"
  },
  {
    "id": "073-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === '.node-version') return true;",
    "new": "  if (file === '.node-version') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-073",
    "failed_test": "[coverage-gate-073 coverage-gate-078] classify the ignored Node version"
  },
  {
    "id": "074-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === 'Makefile') return true;",
    "new": "  if (file === 'Makefile') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-074",
    "failed_test": "[coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile"
  },
  {
    "id": "075-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (/(^|\\/)Dockerfile[^/]*$/.test(file)) return true;",
    "new": "  if (/(^|\\/)Dockerfile[^/]*$/.test(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-075",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile; [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod; [coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates"
  },
  {
    "id": "076-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/.test(file)) return true;",
    "new": "  if (/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/.test(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-076",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml; [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml; [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "077-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file.startsWith('scripts/spec/')) return true;",
    "new": "  if (file.startsWith('scripts/spec/')) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-077",
    "failed_test": "[coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt"
  },
  {
    "id": "078-untracked",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "const others = spawn('git', ['ls-files', '--others', '--exclude-standard', '-z'], options);",
    "new": "const others = { status: 0, stdout: '' };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-078",
    "failed_test": "[coverage-gate-078] refuse an untracked code file; [coverage-gate-078] refuse an untracked input file"
  },
  {
    "id": "079-history",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "['coverage', 'untraced', 'measurement'].includes(item.kind)",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-079",
    "failed_test": "[coverage-gate-079] refuse history from another change or command"
  },
  {
    "id": "079-change",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "item.change === change &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-079",
    "failed_test": "[coverage-gate-079] refuse history from another change or command; [coverage-gate-079] refuse without a change name"
  },
  {
    "id": "080-commit",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "resolveCommit(root, line.commit) : null",
    "new": "resolveCommit(root, 'HEAD') : null",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-080",
    "failed_test": "[coverage-gate-080] refuse a commit that Git cannot find"
  },
  {
    "id": "081-words",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'openspec/ste/words.json' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-081",
    "failed_test": "[coverage-gate-081] refuse a changed word list"
  },
  {
    "id": "082-hash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "if (contentHash(text) !== line.measurement)",
    "new": "if (false)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-082",
    "failed_test": "[coverage-gate-082] refuse an absent snapshot"
  },
  {
    "id": "082-absent",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "if (!existsSync(absolute)) return",
    "new": "if (false) return",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-082",
    "failed_test": "[coverage-gate-082] refuse an absent snapshot"
  },
  {
    "id": "083-start",
    "file": "scripts/spec/gates.mjs",
    "old": "  log(`Started: ${started.toISOString()}`);",
    "new": "  log('Started: wrong');",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] show command times"
  },
  {
    "id": "083-finish",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Finished: ${finished.toISOString()} (${(finished.getTime() - started.getTime()) / 1000} s)`);",
    "new": "log('Finished: wrong');",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] show command times"
  },
  {
    "id": "084-cutoff",
    "file": "scripts/spec/gates.mjs",
    "old": "if (seconds > 1) log",
    "new": "if (seconds >= 1) log",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-084",
    "failed_test": "[coverage-gate-084] show slow phase times"
  },
  {
    "id": "084-phase",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Phase ${name}: ${seconds} s`)",
    "new": "log(`Phase wrong: ${seconds} s`)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-084",
    "failed_test": "[coverage-gate-084] show slow phase times"
  },
  {
    "id": "085-links",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkLinks({ links: readLinks(root), current: measured.links }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] keep every file check"
  },
  {
    "id": "085-registry",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check the base registry without tests; [coverage-gate-085] keep every file check"
  },
  {
    "id": "085-specs",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...lintSpecs({ requirements: specs.requirements, orphans: specs.orphans, changeIds: specs.changeIds, readTasks: tasksReader(root) }));",
    "new": "errors.push();",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] keep every file check"
  },
  {
    "id": "085-lint",
    "file": "scripts/spec/gates.mjs",
    "old": "const lint = phase('lint', () => lintFindings(root, measured.records));",
    "new": "const lint = { errors: [], warnings: [], failed: false };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] keep every file check"
  },
  {
    "id": "011-precheck",
    "file": "Makefile",
    "old": "node scripts/check-import-directions.mjs &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "012-docs",
    "file": "Makefile",
    "old": "check --no-measure $(CHANGE_ARG) $(BASE_ARG)",
    "new": "check $(CHANGE_ARG) $(BASE_ARG)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "033-final",
    "file": ".claude/commands/opsx/review.md",
    "old": "Then run `make gates CHANGE=<name>` on the final tree.",
    "new": "Then continue on the final tree.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "068-own-option",
    "file": "scripts/spec/gates.mjs",
    "old": "options.noMeasure = true;",
    "new": "options.noMeasure = undefined;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] set the document option on the options object; [coverage-gate-068] trust a changed document"
  },
  {
    "id": "068-dependencies",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "!/(^|\\/)node_modules\\//.test(file) && ",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "086-package",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === 'package.json') return true;",
    "new": "  if (file === 'package.json') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-086",
    "failed_test": "[coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json"
  },
  {
    "id": "087-diff",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "diff.status !== 0 || others.status !== 0",
    "new": "false || others.status !== 0",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "087-others",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "diff.status !== 0 || others.status !== 0",
    "new": "diff.status !== 0 || false",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "085-openspec",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...checkOpenSpec({ root, specs, run: (args) => openSpec(root, args) }));",
    "new": "errors.push();",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check OpenSpec without tests"
  },
  {
    "id": "085-archive",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...archived.errors, ...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));",
    "new": "errors.push(...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check archived specs without tests"
  },
  {
    "id": "085-filters",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...findCoverageFlags({ tracked, readFile }));",
    "new": "errors.push();",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check coverage filters without tests"
  },
  {
    "id": "126-totals",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "new": "'LEDGER-STALE', 'LEDGER-VERSION'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] repair absent totals and stale test names"
  },
  {
    "id": "126-stale",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "new": "'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] compare repaired ledger values; [gap-ledger-126] repair absent totals and stale test names"
  },
  {
    "id": "126-version",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "new": "'LEDGER-STALE', 'LEDGER-NO-TOTALS'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] compare repaired ledger values"
  },
  {
    "id": "012-copy",
    "file": "Makefile",
    "old": "cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "068-command-option",
    "file": "scripts/spec/gates.mjs",
    "old": "key === '--no-measure' && command === 'check'",
    "new": "key === '--no-measure' && true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] set the document option on the options object"
  },
  {
    "id": "124-status",
    "file": "scripts/spec/gates.mjs",
    "old": "return command === 'ratchet' && status !== 0 ? 2 : status;",
    "new": "return status;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-124",
    "failed_test": "[gap-ledger-124] fail for an absent review"
  },
  {
    "id": "083-check-time",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] name the full check command; [coverage-gate-083] show command times"
  },
  {
    "id": "083-ratchet-time",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'check';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] show command times"
  },
  {
    "id": "084-elapsed",
    "file": "scripts/spec/gates.mjs",
    "old": "(finished.getTime() - started.getTime()) / 1000",
    "new": "(finished.getTime() - started.getTime()) / 1",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-084",
    "failed_test": "[coverage-gate-084] show slow phase times"
  },
  {
    "id": "127-history",
    "file": "scripts/spec/gates.mjs",
    "old": "unchanged ? [] : [{ date, change, commit: headCommit(root), kind: 'measurement' }]",
    "new": "[]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-127",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "127-stamp",
    "file": "scripts/spec/gates.mjs",
    "old": "history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) }))",
    "new": "history.map(line => ({ ...line, ...(dirty.length > 0 ? { dirty } : {}) }))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-127",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "128-same",
    "file": "scripts/spec/gates.mjs",
    "old": "const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);",
    "new": "const unchanged = false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-128",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "129-hash",
    "file": "scripts/spec/gates.mjs",
    "old": "previous?.measurement === measurement && previous.commit === headCommit(root)",
    "new": "true && previous.commit === headCommit(root)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-129",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes; [gap-ledger-129] record a different change without a changed gap; [gap-ledger-129] record a different hash without a changed gap"
  },
  {
    "id": "129-commit",
    "file": "scripts/spec/gates.mjs",
    "old": "previous?.measurement === measurement && previous.commit === headCommit(root)",
    "new": "previous?.measurement === measurement && true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-129",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "129-change",
    "file": "scripts/spec/gates.mjs",
    "old": "findLast(line => line.change === change)",
    "new": "findLast(line => true)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-129",
    "failed_test": "[gap-ledger-129] record a different change without a changed gap"
  },
  {
    "id": "011-format",
    "file": "Makefile",
    "old": "node scripts/format.mjs --check &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "011-boundaries",
    "file": "Makefile",
    "old": "node scripts/check-package-boundaries.mjs &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "011-tokens",
    "file": "Makefile",
    "old": "node scripts/check-layer-state-tokens.mjs --base-ref origin/main",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "069-tracked",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'src/new.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-069",
    "failed_test": "[coverage-gate-069] refuse a new tracked inventory file"
  },
  {
    "id": "069-base",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'src/math.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-069",
    "failed_test": "[coverage-gate-069 coverage-gate-092] refuse a moved code file; [coverage-gate-069] refuse a changed inventory file; [coverage-gate-069] refuse a deleted input file"
  },
  {
    "id": "078-inventory",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'src/new.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-078",
    "failed_test": "[coverage-gate-078] refuse an untracked code file"
  },
  {
    "id": "085-base",
    "file": "scripts/spec/gates.mjs",
    "old": "const baseErrors = compareWithBase({",
    "new": "const baseErrors = (() => [])({",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] compare the ledger with the base without tests"
  },
  {
    "id": "085-ledger",
    "file": "scripts/spec/gates.mjs",
    "old": "const comparison = compareLedger({ ledger, current: measured.current, sameAsBase, waivers });",
    "new": "const comparison = { errors: [], stale: [] };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] compare the ledger with the base without tests"
  },
  {
    "id": "085-base-registry",
    "file": "scripts/spec/gates.mjs",
    "old": "...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check the base registry without tests"
  },
  {
    "id": "085-archive-reviews",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkArchivedReviews(root, { except: folder }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "085-names",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkChangeNames(root),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "085-agents",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkAgents(root),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "085-command",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkReviewCommand(root),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "033-precheck",
    "file": ".claude/commands/opsx/review.md",
    "old": "1. Run `make precheck`.",
    "new": "1. Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step1",
    "file": ".claude/commands/opsx/review.md",
    "old": "Then run `make gates-docs CHANGE=<name>`.",
    "new": "Then continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step3",
    "file": ".claude/commands/opsx/review.md",
    "old": "3. Run `make gates-docs CHANGE=<name>` again.",
    "new": "3. Continue again.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step10",
    "file": ".claude/commands/opsx/review.md",
    "old": "Use `make gates-docs CHANGE=<name>` and start again at step 3.",
    "new": "Start again at step 3.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step11",
    "file": ".claude/commands/opsx/review.md",
    "old": "Then run `make gates-docs CHANGE=<name>`, which must give only review errors.",
    "new": "Then continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step15",
    "file": ".claude/commands/opsx/review.md",
    "old": "15. Run `make gates-docs CHANGE=<name>`.",
    "new": "15. Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-ci",
    "file": ".claude/commands/opsx/review.md",
    "old": "CI must also pass before you merge.",
    "new": "Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "005-ci-phase",
    "file": "scripts/spec/gates.mjs",
    "old": "phase: (_name, fn) => fn ? fn() : () => {}",
    "new": "phase: (_name, fn) => fn()",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "keep the CI verdict",
    "failed_test": "[ci-gates-005 coverage-gate-083] keep the CI verdict without command times"
  },
  {
    "id": "127-summary",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Ratchet: ${history.length} history lines for ${change}.`);",
    "new": "log(`Ratchet: ${result.history.length} history lines for ${change}.`);",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-127",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "068-trace-write",
    "file": "scripts/spec/gates.mjs",
    "old": "  return { ...snapshot, specs, trace, qaScripts:",
    "new": "  writeLinks(root, buildLinks(trace.report));\n  return { ...snapshot, specs, trace, qaScripts:",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] trust a changed document"
  },
  {
    "id": "033-review-inputs",
    "file": ".claude/commands/opsx/review.md",
    "old": "Make sure that the ratchet commit has all input files.",
    "new": "Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-agent-inputs",
    "file": "AGENTS.md",
    "old": "Commit each file outside openspec/changes/, openspec/specs/ and openspec/trace/.",
    "new": "Continue with input files.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "012-docs-back",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; $(GATES_BACK) || exit 2' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-docs-copy",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c 'true || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-docs-env",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; node scripts/spec/gates.mjs \"$$@\"' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-change",
    "file": "Makefile",
    "old": "$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)",
    "new": "$(GATES_DOCS) check --no-measure $(BASE_ARG)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-base",
    "file": "Makefile",
    "old": "$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)",
    "new": "$(GATES_DOCS) check --no-measure $(CHANGE_ARG)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-markers",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "088-names",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /src && : > /tmp/doc-markers && git ls-files --others --exclude-standard -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted protected ignored file"
  },
  {
    "id": "088-file",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted protected ignored file"
  },
  {
    "id": "088-content",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"source\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted protected ignored file"
  },
  {
    "id": "088-exists",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted protected ignored file"
  },
  {
    "id": "089-changes",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/changes/'",
    "new": "'no/changes/'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-089",
    "failed_test": "[coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md"
  },
  {
    "id": "089-specs",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/specs/'",
    "new": "'no/specs/'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-089",
    "failed_test": "[coverage-gate-089] trust a changed file at openspec/specs/x.md"
  },
  {
    "id": "089-trace",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/trace/'",
    "new": "'no/trace/'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-089",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files; [coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md; [coverage-gate-089] trust a changed file at openspec/specs/x.md; [coverage-gate-089] trust a changed file at openspec/trace/gaps.json"
  },
  {
    "id": "091-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file.startsWith(prefix)",
    "new": "file.startsWith(prefix.slice(0, -1))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-091",
    "failed_test": "[coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md; [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/specs.md; [coverage-gate-091] refuse the input file at openspec/tracex/f.md"
  },
  {
    "id": "092-second-name",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'--no-renames'",
    "new": "'--find-renames'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-092",
    "failed_test": "[coverage-gate-069 coverage-gate-092] refuse a moved code file; [coverage-gate-092] refuse a moved file from docs/base.md"
  },
  {
    "id": "090-all-paths",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "const changed = [...diff.stdout.split('\\0'), ...others.stdout.split('\\0')]",
    "new": "const changed = []",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-090",
    "failed_test": "[coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md; [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/commands/opsx/review.md; [coverage-gate-090 coverage-gate-091] refuse a changed file at .github/workflows/x.yaml; [coverage-gate-090 coverage-gat"
  },
  {
    "id": "078-ignored",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "const ignored = spawn('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '-z'], options);",
    "new": "const ignored = { status: 0, stdout: '' };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file",
    "failed_test": "[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs; [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs; [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json; [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile"
  },
  {
    "id": "078-cache",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "!file.startsWith('.gev-cache/') && ",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "087-ignored-status",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": " || ignored.status !== 0",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "093-dirty",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "if (line.dirty?.length > 0)",
    "new": "if (false)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-093",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD"
  },
  {
    "id": "130-dirty-field",
    "file": "scripts/spec/gates.mjs",
    "old": "...(dirty.length > 0 ? { dirty } : {})",
    "new": "...{}",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-130",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD; [gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history"
  },
  {
    "id": "131-empty-field",
    "file": "scripts/spec/gates.mjs",
    "old": "...(dirty.length > 0 ? { dirty } : {})",
    "new": "...{ dirty }",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-131",
    "failed_test": "[gap-ledger-131 gap-ledger-133] accept clean history without a dirty field"
  },
  {
    "id": "132-dirty-equality",
    "file": "scripts/spec/gates.mjs",
    "old": " && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty)",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-132",
    "failed_test": "[gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history"
  },
  {
    "id": "130-dirty-paths",
    "file": "scripts/spec/gates.mjs",
    "old": "const dirty = difference.files;",
    "new": "const dirty = [];",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-130",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD; [gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history"
  },
  {
    "id": "130-git-failure",
    "file": "scripts/spec/gates.mjs",
    "old": "if (difference.reason) return report(log, [{ code: 'GATES-RATCHET', file: HISTORY_FILE, message: difference.reason }]);",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "failed ratchet file comparison",
    "failed_test": "[gap-ledger-130] refuse a failed ratchet file comparison"
  },
  {
    "id": "133-reader",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": ".map((line) => JSON.parse(line));",
    "new": ".map((line) => JSON.parse(line)).filter(line => !line.dirty);",
    "test": [
      "src/tooling/spec/ledger.test.mjs"
    ],
    "pattern": "gap-ledger-133",
    "failed_test": "[gap-ledger-133] accept dirty history in each reader"
  },
  {
    "id": "134-image-markers",
    "file": "Makefile",
    "old": "if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi;",
    "new": ":",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-134",
    "failed_test": "[gap-ledger-134] add ignored name markers before the ratchet command"
  },
  {
    "id": "078-root-deps",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "(^|\\/)node_modules",
    "new": "(\\/)node_modules",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "078-nested-deps",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "(^|\\/)node_modules",
    "new": "(^)node_modules",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "078-deps-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "node_modules\\//.test(file)",
    "new": "node_modules/.test(file)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file",
    "failed_test": "[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs"
  },
  {
    "id": "134-definition-order",
    "file": "Makefile",
    "old": "GATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work\nGATES := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates",
    "new": "GATES := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates\nGATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-134",
    "failed_test": "[gap-ledger-134] add ignored name markers before the ratchet command"
  },
  {
    "id": "134-command",
    "file": "Makefile",
    "old": "if [ \"$$1\" != ratchet ]",
    "new": "if [ \"$$1\" = ratchet ]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-134",
    "failed_test": "[gap-ledger-134] add ignored name markers before the ratchet command"
  },
  {
    "id": "130-sort",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "[...new Set([...changed, ...protectedIgnored])].sort()",
    "new": "[...new Set([...changed, ...protectedIgnored])]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "sort the dirty list",
    "failed_test": "[gap-ledger-130 gap-ledger-132] sort the dirty list and compare repeated history"
  },
  {
    "id": "078-inventory-source",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "codeInventory(listFilesAt(root, commit))",
    "new": "codeInventory(ignored.stdout.split('\\0'))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "094-cache-marker",
    "file": "Makefile",
    "old": " \":(exclude,glob).gev-cache/**\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-094",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "094-cache-back",
    "file": "Makefile",
    "old": "cp -a /tmp/work/.gev-cache/spec/. /src/.gev-cache/spec/",
    "new": "cp -a /tmp/work/.gev-cache/. /src/.gev-cache/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-094",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "091-trace-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/trace/'",
    "new": "'openspec/trace'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-091",
    "failed_test": "[coverage-gate-091] refuse the input file at openspec/tracex/f.md"
  },
  {
    "id": "078-cache-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'.gev-cache/'",
    "new": "'.gev-cache'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "refuse the input file",
    "failed_test": "[coverage-gate-078] refuse the input file at .gev-cachex/ignored.test.mjs"
  },
  {
    "id": "080-commit-name",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "files: [], commit: line.commit };\n  const difference",
    "new": "files: [], commit: 'none' };\n  const difference",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-080",
    "failed_test": "[coverage-gate-080] refuse a commit that Git cannot find"
  },
  {
    "id": "095-test-class",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "isTestFile(file) || isCodeFile(file) ||",
    "new": "isCodeFile(file) ||",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-095",
    "failed_test": "[coverage-gate-095] refuse a new test file at openspec/changes/code.test.mjs; [coverage-gate-095] refuse a new test file at openspec/specs/code.test.mjs; [coverage-gate-095] refuse a new test file at openspec/trace/code.test.mjs; [coverage-gate-095] refuse a tracked test file at openspec/changes/code.test.mjs"
  },
  {
    "id": "095-code-class",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "isTestFile(file) || isCodeFile(file) ||",
    "new": "isTestFile(file) ||",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-095",
    "failed_test": "[coverage-gate-095] refuse a new code file at openspec/changes/code.js; [coverage-gate-095] refuse a new code file at openspec/specs/code.js; [coverage-gate-095] refuse a new code file at openspec/trace/code.js; [coverage-gate-095] refuse a tracked code file at openspec/changes/code.js; [coverage-ga"
  },
  {
    "id": "096-commit-hash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/.test(line.commit)",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit ref in history",
    "failed_test": "[coverage-gate-096] refuse a commit ref in history"
  },
  {
    "id": "083-check-command",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Command: ${parsed.command}`);",
    "new": "log('Command: ratchet');",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "name the full check command",
    "failed_test": "[coverage-gate-083] name the full check command"
  },
  {
    "id": "011-precheck-status",
    "file": "Makefile",
    "old": "node scripts/format.mjs --check &&",
    "new": "node scripts/format.mjs --check ;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "126-history-after",
    "file": "scripts/spec/gates.mjs",
    "old": "historyText = readOptional(root, HISTORY_FILE);\n    baseline",
    "new": "historyText = historyText;\n    baseline",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "read the new totals history",
    "failed_test": "[gap-ledger-126] read the new totals history line for the base ledger"
  },
  {
    "id": "075-root",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/^Dockerfile$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at Dockerfileprod",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod"
  },
  {
    "id": "075-nested",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/^Dockerfile[^/]*$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at containers/Dockerfile.gates",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates"
  },
  {
    "id": "075-suffix",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/(^|\\/)Dockerfile$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at Dockerfileprod",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod"
  },
  {
    "id": "076-root",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/^[^/]*compose[^/]*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at containers/compose.gates.yaml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml"
  },
  {
    "id": "076-prefix",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)compose[^/]*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at docker-compose.yml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "076-suffix",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)[^/]*compose\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at containers/compose.gates.yaml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml"
  },
  {
    "id": "076-yaml",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$",
    "new": "\\.yml$",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file at compose.yaml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml"
  },
  {
    "id": "076-yml",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$",
    "new": "\\.yaml$",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at docker-compose.yml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "075-boundary",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/Dockerfile[^/]*$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file MyDockerfile",
    "failed_test": "[coverage-gate-075] do not protect the ignored file MyDockerfile"
  },
  {
    "id": "075-end",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/(^|\\/)Dockerfile[^/]*/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file Dockerfile.dir/notes.txt",
    "failed_test": "[coverage-gate-075] do not protect the ignored file Dockerfile.dir/notes.txt"
  },
  {
    "id": "075-no-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/(^|\\/)Dockerfile.*$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file Dockerfile.dir/notes.txt",
    "failed_test": "[coverage-gate-075] do not protect the ignored file Dockerfile.dir/notes.txt"
  },
  {
    "id": "076-prefix-characters",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)[^/-]*compose[^/]*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at docker-compose.yml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "076-suffix-no-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)[^/]*compose.*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file compose/other.yaml",
    "failed_test": "[coverage-gate-076] do not protect the ignored file compose/other.yaml"
  },
  {
    "id": "076-dot",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$",
    "new": "ya?ml$",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file composeyml",
    "failed_test": "[coverage-gate-076] do not protect the ignored file composeyml"
  },
  {
    "id": "076-end",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$/",
    "new": "\\.ya?ml/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file compose.yaml.extra",
    "failed_test": "[coverage-gate-076] do not protect the ignored file compose.yaml.extra"
  },
  {
    "id": "096-start",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/[a-fA-F0-9]{40}$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with prefix",
    "failed_test": "[coverage-gate-096] refuse a commit hash with prefix"
  },
  {
    "id": "096-end",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/^[a-fA-F0-9]{40}/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with suffix",
    "failed_test": "[coverage-gate-096] refuse a commit hash with suffix"
  },
  {
    "id": "096-length",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/^[a-fA-F0-9]+$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "refuse a short commit hash",
    "failed_test": "[coverage-gate-096] refuse a short commit hash"
  },
  {
    "id": "096-hex",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/^[a-zA-Z0-9]{40}$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with letters",
    "failed_test": "[coverage-gate-096] refuse a commit hash with letters"
  },
  {
    "id": "033-input-correction",
    "file": ".claude/commands/opsx/review.md",
    "old": "If not, commit them and run the ratchet command again.",
    "new": "Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "094-marker-cleanup",
    "file": "Makefile",
    "old": "cd /tmp/work && xargs -0 -r rm -f -- < /tmp/doc-markers",
    "new": ":",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "keep cache source contents",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "094-marker-list",
    "file": "Makefile",
    "old": "&& printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "keep cache source contents",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "094-marker-no-list",
    "file": "Makefile",
    "old": "if [ ! -f /tmp/doc-markers ]",
    "new": "if [ -f /tmp/doc-markers ]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "copy cache contents without a marker list",
    "failed_test": "[coverage-gate-094] copy cache contents without a marker list"
  },
  {
    "id": "097-copy-status",
    "file": "Makefile",
    "old": "; fi && rm -rf /src/.gev-cache/spec",
    "new": "; fi; rm -rf /src/.gev-cache/spec",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-097",
    "failed_test": "[coverage-gate-097] stop before the container copies files when a marker cannot be removed"
  },
  {
    "id": "011-precheck-import-status",
    "file": "Makefile",
    "old": "node scripts/check-import-directions.mjs &&",
    "new": "node scripts/check-import-directions.mjs ;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "011-precheck-boundary-status",
    "file": "Makefile",
    "old": "node scripts/check-package-boundaries.mjs &&",
    "new": "node scripts/check-package-boundaries.mjs ;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "152",
    "file": "Makefile",
    "old": " \"scripts/spec\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at scripts/spec/x.mjs"
  },
  {
    "id": "153",
    "file": "Makefile",
    "old": " \"package.json\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at package.json"
  },
  {
    "id": "154",
    "file": "Makefile",
    "old": " \"package-lock.json\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at package-lock.json"
  },
  {
    "id": "155",
    "file": "Makefile",
    "old": " \".node-version\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at .node-version"
  },
  {
    "id": "156",
    "file": "Makefile",
    "old": " \"Makefile\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at Makefile"
  },
  {
    "id": "157",
    "file": "Makefile",
    "old": " \":(glob)scripts/qa-*.mjs\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at scripts/qa-x.mjs"
  },
  {
    "id": "158",
    "file": "Makefile",
    "old": " \":(glob)**/*.test.mjs\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/a.test.mjs"
  },
  {
    "id": "159",
    "file": "Makefile",
    "old": " \":(glob)**/Dockerfile*\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at Dockerfile; [coverage-gate-099] check the marker class at containers/Dockerfile.gates"
  },
  {
    "id": "160",
    "file": "Makefile",
    "old": " \":(glob)**/*compose*.yaml\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at compose.yaml; [coverage-gate-099] check the marker class at containers/compose.gates.yaml"
  },
  {
    "id": "161",
    "file": "Makefile",
    "old": " \":(glob)**/*compose*.yml\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at containers/compose.gates.yml; [coverage-gate-099] check the marker class at docker-compose.yml"
  },
  {
    "id": "162",
    "file": "Makefile",
    "old": " \":(glob)**/*.js\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.js"
  },
  {
    "id": "163",
    "file": "Makefile",
    "old": " \":(glob)**/*.mjs\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.mjs"
  },
  {
    "id": "164",
    "file": "Makefile",
    "old": " \":(glob)**/*.cjs\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.cjs"
  },
  {
    "id": "165",
    "file": "Makefile",
    "old": " \":(glob)**/*.ts\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.ts"
  },
  {
    "id": "166",
    "file": "Makefile",
    "old": " \":(glob)**/*.mts\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.mts"
  },
  {
    "id": "167",
    "file": "Makefile",
    "old": " \":(glob)**/*.cts\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.cts"
  },
  {
    "id": "168",
    "file": "Makefile",
    "old": " \":(glob)**/*.jsx\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.jsx"
  },
  {
    "id": "169",
    "file": "Makefile",
    "old": " \":(glob)**/*.tsx\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.tsx"
  },
  {
    "id": "170",
    "file": "Makefile",
    "old": " \":(glob)**/*.html\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.html"
  },
  {
    "id": "171",
    "file": "Makefile",
    "old": " \":(glob)**/*.sh\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at src/deep/x.sh"
  },
  {
    "id": "172",
    "file": "Makefile",
    "old": " \":(exclude,glob)**/node_modules/**\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at node_modules/x.js"
  },
  {
    "id": "173",
    "file": "Makefile",
    "old": " \":(exclude,glob).gev-cache/**\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-099",
    "failed_test": "[coverage-gate-099] check the marker class at .gev-cache/x.js"
  },
  {
    "id": "174",
    "file": "scripts/spec/gates.mjs",
    "old": "...trace.errors, ...qa.errors], links:",
    "new": "...trace.errors], links:",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-100",
    "failed_test": "[coverage-gate-100] check QA capability names without tests"
  },
  {
    "id": "175",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file.startsWith(prefix)",
    "new": "file.includes(prefix)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-098",
    "failed_test": "[coverage-gate-098] refuse a prefix inside docs/openspec/changes/x.md; [coverage-gate-098] refuse a prefix inside docs/openspec/trace/x.md; [coverage-gate-098] refuse a prefix inside src/openspec/specs/x.md"
  },
  {
    "id": "176",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'lint' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for lint",
    "failed_test": "[coverage-gate-083] omit time lines for lint"
  },
  {
    "id": "177",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'init' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for init",
    "failed_test": "[coverage-gate-083] omit time lines for init"
  },
  {
    "id": "178",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'adopt' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for adopt",
    "failed_test": "[coverage-gate-083] omit time lines for adopt"
  },
  {
    "id": "179",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'waive' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for waive",
    "failed_test": "[coverage-gate-083] omit time lines for waive"
  },
  {
    "id": "180",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'rebaseline' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for rebaseline",
    "failed_test": "[coverage-gate-083] omit time lines for rebaseline"
  },
  {
    "id": "181",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'tree' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for tree",
    "failed_test": "[coverage-gate-083] omit time lines for tree"
  },
  {
    "id": "182",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'ci' || parsed.command === 'check' || parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "omit time lines for ci",
    "failed_test": "[coverage-gate-083] omit time lines for ci"
  },
  {
    "id": "183",
    "file": "scripts/spec/gates.mjs",
    "old": "const reviewFiles = command === 'ratchet' ? diffNames(root, base) : diffFiles;",
    "new": "const reviewFiles = diffFiles;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-135",
    "failed_test": "[gap-ledger-135] include new trace content in the review tree"
  },
  {
    "id": "184",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "files: line.dirty, commit: line.commit",
    "new": "files: line.dirty, commit: 'none'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-093",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD"
  },
  {
    "id": "185",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "return { ...difference, commit };",
    "new": "return { ...difference, commit: 'none' };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "186",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "reason: 'The ratchet snapshot is absent', files: [], commit",
    "new": "reason: 'The ratchet snapshot is absent', files: [], commit: 'none'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-082",
    "failed_test": "[coverage-gate-082] refuse an absent snapshot"
  },
  {
    "id": "187",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "reason: 'The snapshot hash differs from history', files: [], commit",
    "new": "reason: 'The snapshot hash differs from history', files: [], commit: 'none'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-082",
    "failed_test": "[coverage-gate-082] refuse an absent snapshot"
  },
  {
    "id": "188",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "reason: 'The change has no ratchet history line', files: [], commit: 'none'",
    "new": "reason: 'The change has no ratchet history line', files: [], commit: 'HEAD'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-079",
    "failed_test": "[coverage-gate-079] refuse without a change name; [coverage-gate-079] refuse without ratchet history"
  },
  {
    "id": "189",
    "file": "AGENTS.md",
    "old": "9. Read the first line of the log to find which command ran.",
    "new": "9. Read the last line of the log to find which command ran.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "pin the agent",
    "failed_test": "[change-review-033] pin the agent verdict and final tree instructions"
  },
  {
    "id": "190",
    "file": "AGENTS.md",
    "old": "6. Run `make gates CHANGE=<name>` on the final tree.",
    "new": "6. Read the final tree.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "pin the agent",
    "failed_test": "[change-review-033] pin the agent verdict and final tree instructions"
  },
  {
    "id": "191",
    "file": "scripts/spec/gates.mjs",
    "old": "NO TEST RUN: the mode trusts the snapshot of commit ${trusted.commit}",
    "new": "NO TEST RUN: the snapshot of commit ${trusted.commit} is trusted",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] trust a changed document"
  },
  {
    "id": "192",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "The ratchet ran with input files, code files or test files that differ from HEAD",
    "new": "The ratchet ran with changed files",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-093",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse a ratchet with changed files after their content returns to HEAD"
  }
]
```

## Scenario map

| Scenario | Test |
|---|---|
| gap-ledger-123 | compare one ratchet measurement |
| gap-ledger-124 | fail for an absent review |
| gap-ledger-125 | pass after all comparisons |
| gap-ledger-126 | compare repaired ledger values |
| coverage-gate-068 | trust a changed document |
| coverage-gate-069 | refuse a changed inventory file |
| coverage-gate-070 | refuse a changed test file |
| coverage-gate-071 | refuse a changed QA script |
| coverage-gate-072 | refuse a changed package lock |
| coverage-gate-073 | refuse a changed Node version |
| coverage-gate-074 | refuse a changed Makefile |
| coverage-gate-075 | refuse a changed Dockerfile |
| coverage-gate-075 | refuse a changed Dockerfile at `containers/Dockerfile.gates` |
| coverage-gate-075 | refuse a changed Dockerfile at `Dockerfileprod` |
| coverage-gate-076 | refuse a changed compose file |
| coverage-gate-076 | refuse a changed compose file at `docker-compose.yml` |
| coverage-gate-076 | refuse a changed compose file at `containers/compose.gates.yaml` |
| coverage-gate-077 | refuse a changed gate input file |
| coverage-gate-078 | refuse an untracked input file |
| coverage-gate-079 | refuse without ratchet history |
| coverage-gate-080 | refuse a commit that Git cannot find |
| coverage-gate-081 | refuse a changed word list |
| coverage-gate-082 | refuse an absent snapshot |
| coverage-gate-083 | show command times |
| coverage-gate-084 | show slow phase times |
| coverage-gate-085 | keep every file check |
| ci-gates-011 | add fast checks before review |
| ci-gates-012 | add a document gate target |
| change-review-033 | keep the final measurement |
| coverage-gate-079 | refuse history from another change or command |
| coverage-gate-085 | check OpenSpec without tests |
| coverage-gate-085 | check coverage filters without tests |
| coverage-gate-085 | check archived specs without tests |
| coverage-gate-069 | refuse a deleted input file |
| gap-ledger-127 | record a snapshot when no gap changes |
| gap-ledger-128 | record a snapshot when no gap changes |
| gap-ledger-129 | record a snapshot when no gap changes |
| gap-ledger-126 | repair absent totals and stale test names |
| coverage-gate-078 | refuse a protected ignored file |
| coverage-gate-086 | refuse changed package metadata |
| coverage-gate-087 | refuse a failed Git comparison |
| coverage-gate-068 | set the document option on the options object |
| gap-ledger-129 | record a different hash without a changed gap |
| gap-ledger-129 | record a different change without a changed gap |
| coverage-gate-085 | report a change folder that is absent |
| coverage-gate-079 | refuse without a change name |
| coverage-gate-085 | compare the ledger with the base without tests |
| coverage-gate-069 | refuse a new tracked inventory file |
| coverage-gate-078 | refuse an untracked code file |
| coverage-gate-085 | check the base registry without tests |
| coverage-gate-085 | check all review files without tests |
| coverage-gate-083 | keep the CI verdict without command times |
| coverage-gate-088 | refuse an omitted protected ignored file |
| coverage-gate-090 | refuse a changed file at AGENTS.md |
| coverage-gate-091 | refuse a changed file at AGENTS.md |
| coverage-gate-090 | refuse a changed file at .claude/commands/opsx/review.md |
| coverage-gate-091 | refuse a changed file at .claude/commands/opsx/review.md |
| coverage-gate-090 | refuse a changed file at .claude/agents/x.md |
| coverage-gate-091 | refuse a changed file at .claude/agents/x.md |
| coverage-gate-090 | refuse a changed file at docs/x.md |
| coverage-gate-091 | refuse a changed file at docs/x.md |
| coverage-gate-090 | refuse a changed file at .github/workflows/x.yaml |
| coverage-gate-091 | refuse a changed file at .github/workflows/x.yaml |
| coverage-gate-090 | refuse a changed file at fixtures/x.json |
| coverage-gate-091 | refuse a changed file at fixtures/x.json |
| coverage-gate-090 | refuse a changed file at openspec/config.yaml |
| coverage-gate-091 | refuse a changed file at openspec/config.yaml |
| coverage-gate-090 | refuse a changed file at openspec/other.yaml |
| coverage-gate-091 | refuse a changed file at openspec/other.yaml |
| coverage-gate-090 | refuse a changed file at openspec/changes-old/x.md |
| coverage-gate-091 | refuse a changed file at openspec/changes-old/x.md |
| coverage-gate-090 | refuse a changed file at openspec/specs.md |
| coverage-gate-091 | refuse a changed file at openspec/specs.md |
| coverage-gate-089 | trust a changed file at openspec/changes/archive/x/notes.md |
| coverage-gate-089 | trust a changed file at openspec/specs/x.md |
| coverage-gate-089 | trust a changed file at openspec/trace/gaps.json |
| coverage-gate-092 | refuse a moved file from openspec/changes/add-demo/design.md |
| coverage-gate-092 | refuse a moved file from docs/base.md |
| coverage-gate-093 | refuse a ratchet with changed files after their content returns to HEAD |
| gap-ledger-130 | refuse a ratchet with changed files after their content returns to HEAD |
| gap-ledger-132 | refuse a ratchet with changed files after their content returns to HEAD |
| gap-ledger-131 | accept clean history without a dirty field |
| gap-ledger-133 | accept clean history without a dirty field |
| coverage-gate-069 | refuse an ignored file from the code inventory |
| coverage-gate-078 | refuse an ignored file from the code inventory |
| coverage-gate-070 | refuse an ignored file at node_modules-old/ignored.test.mjs |
| coverage-gate-078 | refuse an ignored file at node_modules-old/ignored.test.mjs |
| coverage-gate-071 | refuse an ignored file at scripts/qa-ignored.mjs |
| coverage-gate-078 | refuse an ignored file at scripts/qa-ignored.mjs |
| coverage-gate-072 | refuse an ignored file at package-lock.json |
| coverage-gate-078 | refuse an ignored file at package-lock.json |
| coverage-gate-074 | refuse an ignored file at Makefile |
| coverage-gate-078 | refuse an ignored file at Makefile |
| coverage-gate-075 | refuse an ignored file at Dockerfile |
| coverage-gate-078 | refuse an ignored file at Dockerfile |
| coverage-gate-076 | refuse an ignored file at compose.yaml |
| coverage-gate-078 | refuse an ignored file at compose.yaml |
| coverage-gate-077 | refuse an ignored file at scripts/spec/ignored.txt |
| coverage-gate-078 | refuse an ignored file at scripts/spec/ignored.txt |
| coverage-gate-086 | refuse an ignored file at package.json |
| coverage-gate-078 | refuse an ignored file at package.json |
| coverage-gate-078 | trust other ignored files |
| coverage-gate-089 | trust other ignored files |
| coverage-gate-090 | refuse a staged file edit |
| coverage-gate-090 | refuse an untracked input file |
| coverage-gate-069 | refuse a deleted test file |
| coverage-gate-073 | classify the ignored Node version |
| coverage-gate-078 | classify the ignored Node version |
| gap-ledger-130 | refuse a failed ratchet file comparison |
| gap-ledger-130 | sort the dirty list and compare repeated history |
| gap-ledger-132 | sort the dirty list and compare repeated history |
| gap-ledger-134 | add ignored name markers before the ratchet command |
| coverage-gate-069 | refuse a moved code file |
| coverage-gate-092 | refuse a moved code file |
| coverage-gate-094 | keep cache source contents after the container ends |
| coverage-gate-091 | refuse the input file at openspec/tracex/f.md |
| coverage-gate-078 | refuse the input file at .gev-cachex/ignored.test.mjs |
| coverage-gate-075 | refuse the input file at containers/Dockerfile.gates |
| coverage-gate-078 | refuse the input file at containers/Dockerfile.gates |
| coverage-gate-075 | refuse the input file at Dockerfileprod |
| coverage-gate-078 | refuse the input file at Dockerfileprod |
| coverage-gate-076 | refuse the input file at docker-compose.yml |
| coverage-gate-078 | refuse the input file at docker-compose.yml |
| coverage-gate-076 | refuse the input file at containers/compose.gates.yaml |
| coverage-gate-078 | refuse the input file at containers/compose.gates.yaml |
| coverage-gate-095 | refuse a new code file at openspec/changes/code.js |
| coverage-gate-095 | refuse a tracked code file at openspec/changes/code.js |
| coverage-gate-095 | refuse a new test file at openspec/changes/code.test.mjs |
| coverage-gate-095 | refuse a tracked test file at openspec/changes/code.test.mjs |
| coverage-gate-095 | refuse a new code file at openspec/specs/code.js |
| coverage-gate-095 | refuse a tracked code file at openspec/specs/code.js |
| coverage-gate-095 | refuse a new test file at openspec/specs/code.test.mjs |
| coverage-gate-095 | refuse a tracked test file at openspec/specs/code.test.mjs |
| coverage-gate-095 | refuse a new code file at openspec/trace/code.js |
| coverage-gate-095 | refuse a tracked code file at openspec/trace/code.js |
| coverage-gate-095 | refuse a new test file at openspec/trace/code.test.mjs |
| coverage-gate-095 | refuse a tracked test file at openspec/trace/code.test.mjs |
| coverage-gate-096 | refuse a commit ref in history |
| coverage-gate-083 | name the full check command |
| gap-ledger-126 | read the new totals history line for the base ledger |
| coverage-gate-069 | classify a protected ignored code file |
| coverage-gate-078 | classify a protected ignored code file |
| coverage-gate-075 | do not protect the ignored file MyDockerfile |
| coverage-gate-075 | do not protect the ignored file nested/MyDockerfile |
| coverage-gate-075 | do not protect the ignored file Dockerfile.dir/notes.txt |
| coverage-gate-076 | do not protect the ignored file compose-dir/file.yaml |
| coverage-gate-076 | do not protect the ignored file compose/other.yaml |
| coverage-gate-076 | do not protect the ignored file composeyml |
| coverage-gate-076 | do not protect the ignored file compose.yaml.extra |
| coverage-gate-096 | refuse a short commit hash |
| coverage-gate-096 | refuse a commit hash with suffix |
| coverage-gate-096 | refuse a commit hash with prefix |
| coverage-gate-096 | refuse a commit hash with letters |
| coverage-gate-094 | copy cache contents without a marker list |
| coverage-gate-097 | stop before the container copies files when a marker cannot be removed |
| coverage-gate-098 | refuse a prefix inside docs/openspec/trace/x.md |
| coverage-gate-098 | refuse a prefix inside docs/openspec/changes/x.md |
| coverage-gate-098 | refuse a prefix inside src/openspec/specs/x.md |
| coverage-gate-083 | omit time lines for lint |
| coverage-gate-083 | omit time lines for init |
| coverage-gate-083 | omit time lines for adopt |
| coverage-gate-083 | omit time lines for waive |
| coverage-gate-083 | omit time lines for rebaseline |
| coverage-gate-083 | omit time lines for tree |
| coverage-gate-083 | omit time lines for ci |
| coverage-gate-099 | check the marker class at Makefile |
| coverage-gate-099 | check the marker class at .node-version |
| coverage-gate-099 | check the marker class at package.json |
| coverage-gate-099 | check the marker class at package-lock.json |
| coverage-gate-099 | check the marker class at containers/Dockerfile.gates |
| coverage-gate-099 | check the marker class at Dockerfile |
| coverage-gate-099 | check the marker class at docker-compose.yml |
| coverage-gate-099 | check the marker class at compose.yaml |
| coverage-gate-099 | check the marker class at containers/compose.gates.yaml |
| coverage-gate-099 | check the marker class at containers/compose.gates.yml |
| coverage-gate-099 | check the marker class at scripts/qa-x.mjs |
| coverage-gate-099 | check the marker class at src/a.test.mjs |
| coverage-gate-099 | check the marker class at scripts/spec/x.mjs |
| coverage-gate-099 | check the marker class at src/deep/x.js |
| coverage-gate-099 | check the marker class at src/deep/x.cjs |
| coverage-gate-099 | check the marker class at src/deep/x.ts |
| coverage-gate-099 | check the marker class at src/deep/x.mts |
| coverage-gate-099 | check the marker class at src/deep/x.cts |
| coverage-gate-099 | check the marker class at src/deep/x.jsx |
| coverage-gate-099 | check the marker class at src/deep/x.tsx |
| coverage-gate-099 | check the marker class at src/deep/x.html |
| coverage-gate-099 | check the marker class at src/deep/x.sh |
| coverage-gate-099 | check the marker class at src/deep/x.mjs |
| coverage-gate-099 | check the marker class at .gev-cache/x.js |
| coverage-gate-099 | check the marker class at node_modules/x.js |
| coverage-gate-100 | check QA capability names without tests |
| gap-ledger-135 | include new trace content in the review tree |
| change-review-033 | pin the agent verdict and final tree instructions |

The table test expands MARKER_FILES into one test for each path.
The nested prefix, command time and commit hash loops also have one test per value.
The test process output names every expanded test.

## Lead probes

The copy command uses the clone content in the scratch folder.
The copied probe scripts change only their import path.
The host helper reads Git output when the host reports EPERM with status zero.
A Git error with a different status still stops the probe.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/round3-probe-host.mjs /home/ianblenke/docker/gev-tools/gates-onem/round3-probe-trust2.mjs
```

```text
TRUSTED  EXPECT TRUSTED: clean tree
TRUSTED  EXPECT TRUSTED: edit archived change doc
TRUSTED  EXPECT TRUSTED: new untracked change doc
TRUSTED  EXPECT TRUSTED: edit spec
TRUSTED  EXPECT TRUSTED: edit trace json
TRUSTED  EXPECT TRUSTED: node_modules file
REFUSED  EXPECT REFUSED: docs/readme.md edit — Input files, code files or test files differ from the ratchet commit ["docs/readme.md"]
REFUSED  EXPECT REFUSED: AGENTS.md edit — Input files, code files or test files differ from the ratchet commit ["AGENTS.md"]
REFUSED  EXPECT REFUSED: .claude agent edit — Input files, code files or test files differ from the ratchet commit [".claude/agents/a.md"]
REFUSED  EXPECT REFUSED: openspec/config.yaml edit — Input files, code files or test files differ from the ratchet commit ["openspec/config.yaml"]
REFUSED  EXPECT REFUSED: openspec/changes-old/x.md (prefix needs slash) — Input files, code files or test files differ from the ratchet commit ["openspec/changes-old/x.md"]
REFUSED  EXPECT REFUSED: openspec/specs.md — Input files, code files or test files differ from the ratchet commit ["openspec/specs.md"]
REFUSED  EXPECT REFUSED: openspec/tracex/f.md — Input files, code files or test files differ from the ratchet commit ["openspec/tracex/f.md"]
REFUSED  EXPECT REFUSED: edit test file — Input files, code files or test files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  EXPECT REFUSED: edit code file — Input files, code files or test files differ from the ratchet commit ["src/a.js"]
REFUSED  EXPECT REFUSED: edit Makefile — Input files, code files or test files differ from the ratchet commit ["Makefile"]
REFUSED  EXPECT REFUSED: untracked json fixture — Input files, code files or test files differ from the ratchet commit ["src/fixtures/data.json"]
REFUSED  EXPECT REFUSED: untracked yaml workflow — Input files, code files or test files differ from the ratchet commit [".github/workflows/ci.yml"]
REFUSED  EXPECT REFUSED: new IGNORED test — Input files, code files or test files differ from the ratchet commit ["ignored.test.mjs"]
REFUSED  EXPECT REFUSED: rename allowed -> refused — Input files, code files or test files differ from the ratchet commit ["docs/s.md"]
REFUSED  EXPECT REFUSED: rename refused -> allowed — Input files, code files or test files differ from the ratchet commit ["docs/readme.md"]
REFUSED  EXPECT REFUSED: delete test — Input files, code files or test files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  EXPECT REFUSED: staged code edit — Input files, code files or test files differ from the ratchet commit ["src/a.js"]
REFUSED  EXPECT REFUSED: edit snapshot — The snapshot hash differs from history
REFUSED  EXPECT REFUSED: remove snapshot — The ratchet snapshot is absent
REFUSED  other change — The change has no ratchet history line
```

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/round3-probe-host.mjs /home/ianblenke/docker/gev-tools/gates-onem/round3-probe-trust3.mjs
```

```text
TRUSTED  EXPECT TRUSTED: clean tree
TRUSTED  EXPECT TRUSTED: edit archived change doc
TRUSTED  EXPECT TRUSTED: new untracked change doc
TRUSTED  EXPECT TRUSTED: edit spec
TRUSTED  EXPECT TRUSTED: edit trace json
TRUSTED  EXPECT TRUSTED: node_modules file
REFUSED  EXPECT REFUSED: docs/readme.md edit — Input files, code files or test files differ from the ratchet commit ["docs/readme.md"]
REFUSED  EXPECT REFUSED: AGENTS.md edit — Input files, code files or test files differ from the ratchet commit ["AGENTS.md"]
REFUSED  EXPECT REFUSED: .claude agent edit — Input files, code files or test files differ from the ratchet commit [".claude/agents/a.md"]
REFUSED  EXPECT REFUSED: openspec/config.yaml edit — Input files, code files or test files differ from the ratchet commit ["openspec/config.yaml"]
REFUSED  EXPECT REFUSED: openspec/changes-old/x.md (prefix needs slash) — Input files, code files or test files differ from the ratchet commit ["openspec/changes-old/x.md"]
REFUSED  EXPECT REFUSED: openspec/specs.md — Input files, code files or test files differ from the ratchet commit ["openspec/specs.md"]
REFUSED  EXPECT REFUSED: openspec/tracex/f.md — Input files, code files or test files differ from the ratchet commit ["openspec/tracex/f.md"]
REFUSED  EXPECT REFUSED: edit test file — Input files, code files or test files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  EXPECT REFUSED: edit code file — Input files, code files or test files differ from the ratchet commit ["src/a.js"]
REFUSED  EXPECT REFUSED: edit Makefile — Input files, code files or test files differ from the ratchet commit ["Makefile"]
REFUSED  EXPECT REFUSED: untracked json fixture — Input files, code files or test files differ from the ratchet commit ["src/fixtures/data.json"]
REFUSED  EXPECT REFUSED: untracked yaml workflow — Input files, code files or test files differ from the ratchet commit [".github/workflows/ci.yml"]
REFUSED  EXPECT REFUSED: new IGNORED test — Input files, code files or test files differ from the ratchet commit ["ignored.test.mjs"]
REFUSED  EXPECT REFUSED: rename allowed -> refused — Input files, code files or test files differ from the ratchet commit ["docs/s.md"]
REFUSED  EXPECT REFUSED: rename refused -> allowed — Input files, code files or test files differ from the ratchet commit ["docs/readme.md"]
REFUSED  EXPECT REFUSED: delete test — Input files, code files or test files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  EXPECT REFUSED: staged code edit — Input files, code files or test files differ from the ratchet commit ["src/a.js"]
REFUSED  EXPECT REFUSED: edit snapshot — The snapshot hash differs from history
REFUSED  EXPECT REFUSED: remove snapshot — The ratchet snapshot is absent
REFUSED  EXPECT REFUSED: untracked test under openspec/changes — Input files, code files or test files differ from the ratchet commit ["openspec/changes/new/q.test.mjs"]
REFUSED  EXPECT REFUSED: untracked code under openspec/specs — Input files, code files or test files differ from the ratchet commit ["openspec/specs/z.js"]
REFUSED  EXPECT REFUSED: untracked code under openspec/trace — Input files, code files or test files differ from the ratchet commit ["openspec/trace/z.mjs"]
TRUSTED  EXPECT TRUSTED: json under openspec/trace
REFUSED  other change — The change has no ratchet history line
```

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/round3-probe-host.mjs /home/ianblenke/docker/gev-tools/gates-onem/round3-probe-history.mjs
```

```text
REFUSED  commit HEAD (ref) — Git cannot find the ratchet commit
REFUSED  commit abbreviated — Git cannot find the ratchet commit
REFUSED  dirty field — The ratchet ran with input files, code files or test files that differ from HEAD ["src/a.test.mjs"]
TRUSTED  clean full hash
```

Each EXPECT label agrees with its result.
The history probe refuses refs, short hashes and dirty history, and trusts the full clean hash.

## Format and prose

The plain format command gave EPERM. The host format commands passed.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
```

```text
Formatted 1158 source files.
```

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```

```text
Checked 1158 source files.
```

The final lint and predispatch commands follow.
The lint output has zero errors and 541 warnings.
Predispatch gives no real hit. Its hints name Git refs, software messages, report labels and code values.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change gates-one-measurement
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/gates-one-measurement
```

## Final files

The following command gives the changed file list.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && git status --short
```

```text
M .claude/commands/opsx/review.md
 M AGENTS.md
 M Makefile
 M docs/roadmap/mcp-agent-backends.md
 M openspec/changes/gates-one-measurement/design.md
 M openspec/changes/gates-one-measurement/evidence.md
 M openspec/changes/gates-one-measurement/mutations.json
 M openspec/changes/gates-one-measurement/proposal.md
 M openspec/changes/gates-one-measurement/specs/change-review/spec.md
 M openspec/changes/gates-one-measurement/specs/ci-gates/spec.md
 M openspec/changes/gates-one-measurement/specs/coverage-gate/spec.md
 M openspec/changes/gates-one-measurement/specs/gap-ledger/spec.md
 M openspec/changes/gates-one-measurement/tasks.md
 M scripts/spec/gates.mjs
 M scripts/spec/lib/measurement.mjs
 M src/tooling/spec/gates.test.mjs
```

Only the allowed files changed.
The command cmp confirms that both mutation files have the same content.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && cmp openspec/changes/gates-one-measurement/mutations.json /home/ianblenke/docker/gev-tools/gates-onem/muts.json
```
