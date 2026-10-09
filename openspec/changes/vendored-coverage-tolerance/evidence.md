## Source

Main commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
Code and test commit: `44131665c233510c0cc40245a0ea2df0fc7808c9`.
The scripts first entered commit `b60b2fdf`. Later commits add test cases.

Final code commit: `a6eeca2a8ddb251aaf9c4be1c7d17d4c91dfbb24`.
That commit only shortens a comment. The gate script has the same bytes as commit 44131665.

## Host method

Command: taskset -c 4-7 nice -n 19 node --version.
Result: v26.8.2. The lead must check the Node 24 image.

Each Node command uses taskset -c 4-7 nice -n 19. Each test process names one test file.

The host uses normal Node test isolation. No command uses --test-isolation=none.
No project container, make command, ratchet command or gate command ran on the host, except the lint command.
Some tests call the gate functions with a temporary Git fixture. Those calls do not change the project ledger.

Host transport: /home/ianblenke/docker/gev-tools/vct/strict-host.mjs.
The transport sends each fixture test file to its own Node process. It keeps the --test option.

It clears the inherited NODE_TEST_CONTEXT for fixture processes. It sends non-test commands to the actual runner.
It also uses temporary files for process output where the host pipe returns EPERM.
The project files contain no transport changes.

The new gate tests use fixed coverage data. Their Git fixtures contain actual merge parents and adopt lines.
The script copy uses the actual CI artifact coverage. The fixture tests use fixed test values.

## Named code faults

Command: python /home/ianblenke/docker/gev-tools/vct/named-review.py.

Each log starts with the Node command. The final records are named-review-results.json in that tool folder.
The final run uses separate named-review logs for all fourteen faults.
Each fault below causes a test failure. No import error counts as a test failure.

| Fault | Failed scenario |
|---|---|
| Drop the adopted source path | gap-ledger-136, gap-ledger-140 |
| Drop the source content check | gap-ledger-137 |
| Accept another change | gap-ledger-139 |
| Accept an invalid from commit | gap-ledger-138 |
| Drop the ledger hash check | gap-ledger-137 |
| Allow an untrue ledger entry | gap-ledger-141 |
| Allow untrue current coverage | gap-ledger-141 |
| Allow an unloaded ledger entry | gap-ledger-141 |
| Allow unloaded current coverage | gap-ledger-141 |
| Remove count limits | gap-ledger-142 |
| Drop the current file check | gap-ledger-145 |
| Drop the ratchet source input | gap-ledger-144 |
| Skip toleranceCounts | gap-ledger-143 |
| Drop the adopt file match | gap-ledger-146 |

## Real CI replay

Sync tree commit: `d17b233e0b28e5173700762443baee4eb5b27b25`.
Artifact folder: /tmp/claude-1000/gcr/pr18-art.
Scratch root: /tmp/claude-1000/gcr/s3-replay.

Command: taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/replay.mjs /tmp/claude-1000/gcr/s3-replay /tmp/claude-1000/gcr/pr18-art.
The replay script adds the same valid adopt predicate to the owner's stale-check-s3.mjs script.

The command before the code change uses the sync scripts. The command after the code change uses this change's scripts.
Logs: /tmp/vct-logs/replay-before.log and /tmp/vct-logs/replay-after.log.

The command before the code change reports four stale coverage entries. At pass 1 the command after the code change reports one stale coverage entry.
At pass 1 the source check clears server/providers/mapillary/tiles.js, src/data/localGeojsonCore.js and src/voice/turnMetrics.js.
At pass 1 the source check does not clear src/keySetupCore.mjs.

Command: git diff 95fa816232456a6831172befa2f1b34b9ee73794 -- src/keySetupCore.mjs in the scratch root.
The fork adds an OSH account block. The adopted upstream commit has no such block.

At pass 1 the source check rejects src/keySetupCore.mjs. Pass 2 clears that file, because only its total counts differ.
The untraced-test and QA results come from the script copy of the gate predicates. They give no project gate verdict.

## Runs that stopped

The full-file host attempts reached their time limits before the test report. They give no test verdict.
The empty coverage summary after a command that stops gives no script coverage result.
The host then runs exact test titles in separate processes and collects only completed command output.
The lead must run the full image gates and read their QA lines.

## Legacy host adapter

Source commits: e2437f94 before; a6eeca2a after.
Command: python /home/ianblenke/docker/gev-tools/vct/legacy-four.py.
This command checks the four documented host cases with the earlier adapter behavior.
Both runs finish with four tests, one pass and three failures. The failed names match.

| Scenario | Before | After |
|---|---|---|
| coverage-gate-024 | fail | fail |
| spec-trace-039, spec-trace-040 | fail | fail |
| coverage-gate-031 | fail | fail |
| coverage-gate-048 | pass | pass |

Logs: /tmp/vct-logs/legacy-four-before.log and /tmp/vct-logs/legacy-four-after.log.
The host copy clears NODE_TEST_CONTEXT. It reproduces three of the four earlier failures.
The strict host transport keeps --test for child files. Those cases pass with that transport.
No project correction addresses those host adapter failures.

## Ledger coverage

Code commit: a6eeca2a.
Command: taskset -c 4-7 nice -n 19 node --experimental-test-coverage --test-coverage-include=scripts/spec/lib/ledger.mjs --test src/tooling/spec/ledger.test.mjs.
Log: /tmp/vct-logs/coverage-ledger-final.log.

The command finishes with 95 tests, 95 passes and no failure.
The ledger script has 100% line, branch and function coverage.

## Gate coverage

Code commit: a6eeca2a. Its gate script has the same bytes as commit 44131665.
The host stores raw V8 coverage for each completed current-tree test command in /tmp/vct-raw-gates.
The merger selects only the actual project URL for scripts/spec/gates.mjs. It excludes scratch and base-tree URLs.

Command: taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct-raw-gates.
Log: /tmp/vct-logs/coverage-gates-aggregate-second.log.

The command reads 903 process files. The merger counts 740 covered lines of 740 lines.
It counts 373 covered branches of 373 branches and 89 covered functions of 89 functions.
The gate script has 100% line, branch and function coverage.

The process file count includes files without the target script. Those files add no coverage for the target script.
The tool uses scripts/spec/lib/v8-merge.mjs from this project. It uses actual raw ranges and counts.

## Automatic code mutations

Mutation tree commit: 44131665. Final code commit: a6eeca2a changes only a comment.
Tool guide: /home/ianblenke/docker/gev-tools/automut/README.md.
The host tool copy removes --test-isolation=none and starts each Node child with taskset and nice.
It changes no project gate or project test source.

The candidate file is /home/ianblenke/docker/gev-tools/vct/mutants.json.
The set contains 322 mutations at lines that this change adds or moves.
The first mutation campaign uses all ledger tests and four focused gate tests.
The second mutation campaign uses all ledger tests, eight focused gate tests and the reached-file test.
The scratch copies skip the other gate tests. The separate host comparison checks those tests.

Both campaigns complete both phases. The final set has 311 killed mutations and 11 survivors.
No final mutation has a crash, a time limit or an incomplete status.
The tool stops a mutant after its first failed test. Such a stop gives that test's failure, not a full-file pass.

### Library equivalence probes

Command: taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/equivalent-lib.mjs.
Code commit: 44131665. Log: /tmp/vct-logs/equivalent-lib.log.

The probe checks 1536 cases for each of seven survivors. It compares results from compareLedger and ratchetLedger.
The total is 10752 cases. All result and error fields match.

| Mutation IDs | Equivalence scope |
|---|---|
| a0733, a0738, a0743, a0748, a0759 | Boolean operand order with plain records and pure predicates |
| a9182 | Independent local values with plain records and pure predicates |
| a3081 | An absent waiver input reaches the same empty default in compareLedger |

These claims need stable inputs. They do not cover callbacks with side effects or records with property getters.

### Gate equivalence probes

Command: python /home/ianblenke/docker/gev-tools/vct/equivalent-gates.py.
Code commit: 44131665. Logs: /tmp/vct-logs/equivalent-gates-*.log.

The main code and each of four mutants pass the same eight test titles. Each command has no test failure.
The probes compare verdicts with actual Git fixtures and fixed coverage counts.

| Mutation ID | Equivalence scope |
|---|---|
| a9038 | File match and file existence checks can change order for string paths in a stable tree |
| a9891 | A closure can precede its source value when no call occurs before that value exists |
| a9892 | The phase start can precede closure creation; only elapsed time can differ |
| a9896 | The two independent comparisons can change order for JSON records and stable source evidence |

These claims cover verdict fields. They do not compare elapsed time, callback effects or stack traces.
The owner can inspect each pass 1 mutation and its final status in proof.json.

## Final test records

Command: python /home/ianblenke/docker/gev-tools/vct/count-verdicts.py.
Command: python /home/ianblenke/docker/gev-tools/vct/final-report.py.
Log: /tmp/vct-logs/final-report.log.

The completed command output covers all 227 base-tree gate test titles and all 235 current-tree titles.
Every title passes with the strict host transport. No title lacks a completed report. No title has results that disagree.

The commands run each exact title or a small group from the same test file.
These totals combine completed reports. They do not claim that a stopped full-file command passed.

The main ledger command has 90 tests and 90 passes. The current ledger command has 95 tests and 95 passes.
The main tree log is /tmp/vct-logs/ledger-before-host.log. The current coverage log names its command above.

Command: python /home/ianblenke/docker/gev-tools/vct/suite.py.
The suite runs the other spec test files one file per process. Its first run has one host transport failure.
That failure is coverage-gate-022 in runParallel.test.mjs. The same transport fails that test on the main tree.

The strict transport sends non-test runner input to the actual runner.
The separate before and after commands then pass all three runParallel tests.
Logs: /tmp/vct-logs/runParallel-before-strict.log and /tmp/vct-logs/runParallel-final-strict.log.
The suite logs give the completed results for the other files.

| Test file | Pass 1 tests | Passes |
|---|---:|---:|
| ci.test.mjs | 6 | 6 |
| ciFiles.test.mjs | 4 | 4 |
| coverage.test.mjs | 15 | 15 |
| git.test.mjs | 4 | 4 |
| importReach.test.mjs | 12 | 12 |
| inventory.test.mjs | 8 | 8 |
| ledger.test.mjs | 95 | 95 |
| openspec.test.mjs | 4 | 4 |
| qaRegister.test.mjs | 31 | 31 |
| registry.test.mjs | 15 | 15 |
| review.test.mjs | 33 | 33 |
| runParallel.test.mjs | 3 | 3 |
| specLint.test.mjs | 17 | 17 |
| specs.test.mjs | 20 | 20 |
| ste.test.mjs | 45 | 45 |
| testGuard.test.mjs | 31 | 31 |
| trace.test.mjs | 25 | 25 |
| traceReporter.test.mjs | 10 | 10 |
| v8Merge.test.mjs | 11 | 11 |

The table uses the strict transport rerun for runParallel.test.mjs.
It includes the ledger file. It excludes the gate file, whose comparison appears above.

## Final lint and lead work

Code commit: a6eeca2a.
Command: taskset -c 4-7 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
Log: /tmp/vct-logs/lint-final-correction.log.

Result: STE has zero errors. The report names no issue in this change's prose.
The full project report has 538 WARN items for earlier prose.
The lead must run the Node 24 image checks, the ratchet command and both review agents.
The lead must read the QA lines.
Rule 21 needs the person who merges to check the merged commit against the upstream remote and record the result in review.md.

## Pass 2

Commit read: `125dc3ae92f9687a830e230914ec0e2b393dda18`.

Code commit: `0945baeeb34416d0e607abd184d096486b673eef`.
Test correction commit: `0407e631`.
The correction replaces a fixture-variable comparison with specification literals.
It changes no script bytes.
Command: git rev-parse HEAD. Result at pass 2: 0407e631798afc887de7416c1102cc4ce356d1fb.



Each host Node process uses taskset -c 8-11 nice -n 19. Each test process names one test file.
The host checks use the strict transport at /home/ianblenke/docker/gev-tools/vct/strict-host-2.mjs.
It also applies the CPU and priority settings to each fixture Node process.
It keeps Node test isolation. It changes no project file.

The new adoptedFile predicate reads the same valid adopt lines as adoptedAsIs.
Only the stale decision uses the new predicate. A file that the fork edits keeps exact not-covered counts and all coverage errors.
The ratchet command writes current total counts for those files.

### Named mutations

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-named.py.
Code commit: `0945baee`. Logs: /tmp/vct2-logs/named-*.log.
The command reads failed test names from Node output. It does not read the gate result cache.

| Fault | Failed test scenario |
|---|---|
| Drop equal not-covered counts | gap-ledger-148 |
| Drop valid adopt evidence | gap-ledger-149 |
| Accept another change | gap-ledger-150 |
| Accept an invalid from | gap-ledger-151 |
| Drop the ledger hash check | gap-ledger-152 |
| Allow an untrue entry | gap-ledger-153 |
| Allow an unloaded entry | gap-ledger-153 |
| Drop the total count exception | gap-ledger-147 |
| Drop the gate predicate | gap-ledger-147 |
| Write old ratchet totals | gap-ledger-147 |

The command also removes the guard for an untrue current gap and the guard for an unloaded current gap in separate scratch files.
Those faults do not change a verdict. The errors for the current gap stop the stale decision for those inputs.
The other guards also stop that decision when the ledger entry and current gap have untrue coverage or no test loads the file.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/pass2-probe.mjs.
Code commit: `0945baee`. Log: /tmp/vct2-logs/probe-named.log.

Each guard probe compares 11520 result objects. Both probes give EQUIVALENT within that input set.
The inputs vary source predicates, hashes, loaded states, untrue states, metrics, total counts and not-covered counts.
The probes use plain records and pure predicates. They do not cover property getters or callback side effects.

### Real CI data

Replay tree commit: `d09e034b9c751ebe286e2f5f32773db1af48c0a3`.
Replay main commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
Command: git -C /tmp/vct2-replay rev-parse HEAD origin/main.

The scratch tree is a copy of /home/ianblenke/docker/gev-work/upstream-sync-3.

Command: git -C /tmp/vct2-replay diff --name-only d17b233e d09e034b.
Only the review.md file of the sync change differs from the earlier replay tree.
The code files and the ledger have the same content.

The script copy for pass 2 supplies adoptedAsIs and adoptedFile from the same valid adopt lines as the gate.
The earlier tool copy is /home/ianblenke/docker/gev-tools/vct/stale-check-s3-original.mjs.

Command: git show e2437f94:scripts/spec/lib/ledger.mjs.
The command for the main library uses that library and the gate script from the same commit in the scratch tree.
The command for the pass 2 library uses the scripts from commit `0945baee`.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/vct2-replay /tmp/claude-1000/gcr/pr18-art.
Logs: /tmp/vct2-logs/replay-original.log and /tmp/vct2-logs/replay-final.log.

| Run | Stale coverage files |
|---|---|
| Original library | server/providers/mapillary/tiles.js; src/data/localGeojsonCore.js; src/keySetupCore.mjs; src/voice/turnMetrics.js |
| Pass 2 | None |

The main library command has 4 stale coverage files. The pass 2 library command has 0.
The script copy reports untraced-test and QA results for both commands. The predicates in the script copy cause these results.
Those results give no project gate verdict.

### Runs that stopped

The sandbox hides individual Node test reports. Its file-level reports give no individual test verdict.
The host runs replace those attempts.
Some batch and single-title commands reach their time limits. Those commands give no test verdict.
The final test report must use only commands that finish with individual test verdicts.

The first automatic mutation attempt stops at its baseline time limit before it starts a mutation.
The next attempt uses the new gate scenarios and all ledger tests.

### File check

Code commit: `0945baee`.
Command: rg -n 'adoptedFile|totalsOnly' scripts/spec/gates.mjs scripts/spec/lib/ledger.mjs.
The search shows the predicate in the gate, its input to compareLedger and the total count condition in the library.
Command: git diff --check.
The command reports no format error.

### Host coverage

Script tree commit: `0945baee`. Final test tree commit: `0407e631`.
Command: taskset -c 8-11 nice -n 19 node --experimental-test-coverage --test-coverage-include=scripts/spec/lib/ledger.mjs --test src/tooling/spec/ledger.test.mjs.
Log: /tmp/vct2-logs/ledger-coverage-final.log.

The command reports 100 tests and 100 passes. It reports no failure.
The library has 100% line, branch and function coverage.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct2-raw-gates.
Log: /tmp/vct2-logs/gate-coverage-final.log.
The merger selects only the actual project URL. It uses the project V8 merge library.
The gate script has 100% line, branch and function coverage.
The command reports equal hit and total counts for lines, branches and functions.

Each coverage command selects one script. Neither command reports image coverage.

### Automatic mutations

Script tree commit: `0945baee`. The next test correction changes no script bytes.
The first phase uses the tests of that commit. The second phase uses the tests of `0407e631`.
Tool guide: /home/ianblenke/docker/gev-tools/automut/README.md.
Tool copy: /home/ianblenke/docker/gev-tools/vct/pass2-automut/automut.mjs.

The copy keeps test isolation and applies the host CPU and priority settings.
It selects all ledger tests and the new gate tests. Each process names one test file.
The follow-up command also selects the old base, adopt and waiver scenarios.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-select.py.
Log: /tmp/vct2-logs/mutation-selection.json.
The tool generates 11293 candidates and selects 181 candidates on the changed script lines.

Command:

```text
taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/pass2-automut/automut.mjs run --root /home/ianblenke/docker/gev-work/vendored-tolerance --mutants /home/ianblenke/docker/gev-tools/vct/pass2-automut/mutants.json --tests src/tooling/spec/ledger.test.mjs,src/tooling/spec/gates.test.mjs --phase 1 --jobs 1 --slow-ms 30000 --commit 0945baee --out /home/ianblenke/docker/gev-tools/vct/pass2-automut/results.json
```

Log: /tmp/vct2-logs/automut-phase1-final.log.

The second command uses the same options with --phase 2 and --resume.
Log: /tmp/vct2-logs/automut-phase2.log.
Both phases finish. A mutation that fails a test identifies a killed mutation; it does not give a full test-file pass.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-followup.py.
Logs: /tmp/vct2-logs/followup-*.log.

| Mutation IDs | Fault | Failed scenario |
|---|---|---|
| a9585, a9591 | Remove sameAsBase | gap-ledger-069 |
| a9586, a9592 | Remove adoptedAsIs | gap-ledger-136 |
| a9588, a9594 | Remove waivers | gap-ledger-081 |

The other gate survivors are a9898 and a9903.
The first changes closure order. The second changes the order of independent comparisons.
The pass 2 code and each mutant pass the same 12 test titles with actual Git fixtures and fixed coverage data.
These probes compare verdicts. They do not compare elapsed time or file changes from another process.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/pass2-probe.mjs --automatic.
Log: /tmp/vct2-logs/probe-automatic.log.
The command checks 14 library survivors with 11520 cases each. All result fields match.
The scope is plain records and pure predicates. The named guard proof also applies to the redundant current guards.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-proof.py.
Log: /tmp/vct2-logs/automut-proof.json.
The complete pass 2 proof is proof-pass2.json in this change folder.

| Stage | Killed | Survivors |
|---|---:|---:|
| First phase | 159 | 22 |
| Second phase | 0 | 22 |
| Follow-up tests | 6 | 16 |

The final total is 165 killed mutations and 16 EQUIVALENT mutations.
The proof has 0 unresolved mutations. No final mutation has a crash or time-limit status.
The library probes total 161280 cases. The gate probes use 12 titles for each source version.

### Complete test reports

Pass 1 code and test commit: `125dc3ae`. Current script commit: `0945baee`.
Current test commit: `0407e631`. Each fixture process runs its temporary test file.

Command: taskset -c 8-11 nice -n 19 node --test src/tooling/spec/ledger.test.mjs.
Pass 1 folder: /tmp/vct2-base. Log: /tmp/vct2-logs/ledger-before-host.log.
The pass 1 command reports 95 tests and 95 passes. The current coverage command reports 100 tests and 100 passes.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-exact.py.
Command: python /home/ianblenke/docker/gev-tools/vct/pass2-extra.py.
Command: python /home/ianblenke/docker/gev-tools/vct/pass2-retry.py.
Each command log starts with its Node command. The retry command replaces only the reports that stop at a time limit.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-report.py.
Log: /tmp/vct2-logs/test-report-final.json.

| File | Pass 1 tests | Pass 2 tests | Pass 1 passes | Pass 2 passes |
|---|---:|---:|---:|---:|
| ledger.test.mjs | 95 | 100 | 95 | 100 |
| gates.test.mjs | 235 | 239 | 235 | 239 |

Every gate title has a complete individual verdict. No title fails, lacks a report or has reports that conflict.
The before and after failed-name lists are empty with the same strict transport.
The old host adapter faults give no new failure with that transport.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-suite.py.
Logs: /tmp/vct2-logs/suite-*.log.
All other spec test files pass. The command runs one file per process.

The final gate coverage command reads 674 process files.
It reports 741 hit lines of 741 lines, 387 hit branches of 387 branches and 91 hit functions of 91 functions.
These counts come from /tmp/vct2-logs/gate-coverage-final.log.

### Final document checks

Source commit before the document commit: `0407e631798afc887de7416c1102cc4ce356d1fb`.
Command: taskset -c 8-11 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
Log: /tmp/vct2-logs/lint-final.log.
The final lint reports 0 errors. The lead still runs the image gates and reads their QA lines.

Command: taskset -c 8-11 nice -n 19 node /usr/lib/openspec/bin/openspec.js show vendored-coverage-tolerance --json.
Command: taskset -c 8-11 nice -n 19 node /usr/lib/openspec/bin/openspec.js validate vendored-coverage-tolerance.
Logs: /tmp/vct2-logs/openspec-final.json and /tmp/vct2-logs/openspec-final-validate.log.
The first command prints JSON. The second command accepts the active change.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-headings.py.
Log: /tmp/vct2-logs/headings-final.json.
The design and task headings match the previous commit. The proposal uses each exact heading that the owner names.
Only the Known limits and later changes heading differs from that commit.

The lead must run make ratchet CHANGE=vendored-coverage-tolerance in the Node image.
Rule 21 needs the person who merges to check the merged commit against the upstream remote and record the result in review.md.
The lead must get both review passes before the merge.
The lead must run make gates CHANGE=vendored-coverage-tolerance on the final image tree.

## Pass 3

Commit read: `045540504b2f69b7e2cf91275992683dded249c8`.
At that attempt, the code files equal this commit. The pre-review reports have no changes.

At the first pass 3 attempt, T3 stops the work. The lead must decide the correction for the design defect.
At that attempt, the other findings have no correction.

The test for `gap-ledger-154` runs the ratchet command in a fixture.
The file equals its adopted source. The branch split adds one not-covered branch and one total branch.
The test checks the literal counts `[2, 101]` after the ratchet command writes the ledger.
The test then checks the output from the base comparison.

Command:

```sh
taskset -c 0-3 nice -n 19 node --test-name-pattern='gap-ledger-154' src/tooling/spec/gates.test.mjs
```

Host Node: `26.8.2`. Result: 1 test, 0 pass, 1 fail. Exit status: 1.
Log: `/home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/t3-direct.log`.

The gate output starts with `Command: ratchet`.
The command reaches the base comparison. The output contains these lines:

```text
Ratchet: 2 history lines for sync.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 0 warnings.
ERROR LEDGER-NOT-IN-BASE src/merged.js The ledger entry for src/merged.js is not in the base ledger
ERROR REVIEW-MISSING openspec/changes/sync/review.md Change sync has no review.md
Gates failed with 2 errors.
```

The missing review belongs to the test fixture. The test fails for LEDGER-NOT-IN-BASE.
The literal count assertion passes before the base comparison assertion fails.
No code mutation runs: the code already fails this test.
The named fault is a toleranceCounts change that writes the larger branch count after an equal covered count.
The code at commit 04554050 already has that fault.

The `node --test` command reports only a file-level failure on this host.
The direct command above gives the assertion and the gate output.
The first test draft used the wrong fixture cache path and failed with ENOENT.
The corrected test uses the cache path from the spawn arguments.

The word table is in design.md. The test and scenario use the same file condition and outcome.
At that attempt, full test suites, coverage, automatic mutations and the echo script do not run after the T3 failure.
That attempt stops before the other corrections and their checks.

Final checks for this partial pass:

- The host lint command reports 0 errors and 539 warnings. The log is pass3/lint.log in the tools folder.
- The command `openspec show` with the change name and `--json` returns JSON. Python json.loads accepts that output.
- The command `openspec validate` with the change name reports that the change is valid.
- The Python comparison of each document with commit 04554050 finds no removed or renamed level-two title.
- Only evidence.md adds a level-two title: Pass 3. The proposal titles have no changes.

The search `rg` shows the word table at design.md:50 and the scenario at specs/gap-ledger/spec.md:55.
The search shows the test at gates.test.mjs:2816 and the completed test tasks at tasks.md:59 and tasks.md:60.
The search shows the failure output at evidence.md:499. These results apply to code commit 04554050.

### Pass 3 continued

Commit read: `c4ba0585500149193c8fced3984bf2d576c70787`.
The lead supplied T3-FIX after the first pass 3 attempt.
The corrections below apply to that commit plus the current changes.
The pre-review reports have no changes.

#### Spec findings

| Finding | Correction | Search result |
| --- | --- | --- |
| Pass 1 contradicts | T1 names Count tolerance and gap-ledger-074 in a bounded exception. | `specs/gap-ledger/spec.md:10` |
| Pass 2 contradicts | T1 names gap-ledger-078 and the Ratchet rule sentence in a bounded exception. | `specs/gap-ledger/spec.md:88` |
| The ratchet command | T2 separates edited files, adopted source files and base content files. | `specs/gap-ledger/spec.md:95` |
| Test 153 asserts | T5 asserts each exact error or stale result. The two current gap guards are EQUIVALENT. | `../../../src/tooling/spec/ledger.test.mjs:1613` |
| toleranceCounts keeps | T3 adds neverWorseCounts and its tests before the code. | `../../../scripts/spec/lib/ledger.mjs:235` |
| Pass 2 sets | T4 states the unbounded total difference and the other limits. | `proposal.md:40` |
| This file holds | T6 copies proof-pass2.json into this change folder. | `evidence.md:406` |
| MUST satisfy | T7 cites Adoption of merged code and names the two coverage records. | `specs/gap-ledger/spec.md:7` |

#### STE findings

The row numbers follow the report order. Each row gives the first words and the file search after the correction.

| Row | First words | Correction | Search result |
| --- | --- | --- | --- |
| 1 | `adopted file` | Use the two file names from the glossary. | `design.md:67` |
| 2 | `source` | Name the adopt line and its adopted source separately. | `specs/gap-ledger/spec.md:7` |
| 3 | `Both records` | Name the ledger entry and the current gap. | `specs/gap-ledger/spec.md:6` |
| 4 | `that file` | Bound the current total count rule to a file that differs from its adopted source. | `specs/gap-ledger/spec.md:95` |
| 5 | `A zero-stale result for` | Name the pass 1 result and the pass 2 correction. | `evidence.md:75` |
| 6 | `Count tolerance applies only` | Name both base content and adopted source content. | `proposal.md:32` |
| 7 | `an adopted file with` | Name the adopted source tolerance conditions and the bounded exception. | `specs/gap-ledger/spec.md:12` |
| 8 | `that adopted file` | Name the file condition and the exact error results. | `specs/gap-ledger/spec.md:113` |
| 9 | `stale` | Use the ledger entry as the object of stale. | `specs/gap-ledger/spec.md:119` |
| 10 | `This rule hides no` | State the total count and covered count limit. | `proposal.md:39` |
| 11 | `the owner` | Name the person who merges and the review.md duty. | `proposal.md:36` |
| 12 | `base` | Use main commit and pass 1 commit for the historical trees. | `evidence.md:420` |
| 13 | `equals ... its ledger` | Compare the content hash with the entry hash. | `specs/gap-ledger/spec.md:5` |
| 14 | `valid adopted file` | Attach valid to adopt line. | `specs/gap-ledger/spec.md:83` |
| 15 | `the same count tolerance` | Cite Count tolerance by its requirement title. | `specs/gap-ledger/spec.md:14` |
| 16 | `no new tolerance` | Use the bounded requirement name instead of a time label. | `specs/gap-ledger/spec.md:30` |
| 17 | `of this change` | Name the checked change. | `specs/gap-ledger/spec.md:4` |
| 18 | `such as 399 or` | Use current total counts and entry total literals. | `specs/gap-ledger/spec.md:106` |
| 19 | `ci, check or the` | Name each command and both checks. | `specs/gap-ledger/spec.md:64` |
| 20 | `that current file` | Name the absent file and the read result. | `specs/gap-ledger/spec.md:67` |
| 21 | `keep` | Use apply, report, compare and write for their separate actions. | `specs/gap-ledger/spec.md:130` |
| 22 | `no merge after the` | Use merged commit. | `design.md:13` |
| 23 | `production file` | Use code file. | `specs/gap-ledger/spec.md:70` |
| 24 | `equal not-covered counts` | Name lines, branches and functions. | `specs/gap-ledger/spec.md:85` |
| 25 | `git show at the` | State the content comparison and the conflict case. | `design.md:19` |
| 26 | `All three commands` | Name the ci, check and ratchet commands. | `design.md:24` |
| 27 | `each eligible entry` | Name each file class and its count function. | `design.md:28` |
| 28 | `it` | Name the gate and adoptedFile. | `design.md:41` |
| 29 | `its current total count` | Use existing for the unchanged rule. | `design.md:45` |
| 30 | `Read commit:` | Use Commit read as the label. | `design.md:3` |
| 31 | `Fork edits can also` | Use file as the object with counts. | `proposal.md:5` |
| 32 | `Total counts for adopted` | Name both requirements. | `proposal.md:20` |
| 33 | `The second rule` | Use the requirement title in all three documents. | `tasks.md:18` |
| 34 | `whichever is less` | Name timers and use smaller of the two numbers. | `proposal.md:29` |
| 35 | `Thus` | Delete the two unnecessary words. | `evidence.md:467` |
| 36 | `edits` | Use command actions and concrete file objects. | `tasks.md:46` |
| 37 | `Commit the change` | Name the code, tests and change folder in the commit task. | `tasks.md:37` |
| 38 | `Run each named code` | Use named mutation in both task groups. | `tasks.md:33` |
| 39 | `the source file record` | Name the code file adopt line and the design commit. | `tasks.md:16` |
| 40 | `names three documents` | Split the document task into three tasks. | `tasks.md:3` |
| 41 | `count noise` | Correct each new test title. | `../../../src/tooling/spec/ledger.test.mjs:1606` |
| 42 | `its entry hash` | Shorten the comments and cite all three requirements. | `../../../scripts/spec/lib/ledger.mjs:402` |
| 43 | `noise` | Name the script copy, current gap guards, command result and temporary test file. | `evidence.md:421` |

#### Base scenario search

Command: rg -n with the scenario IDs and the phrase tolerance conditions in openspec/specs/gap-ledger/spec.md.
Output:

```text 4:Record each open`gap-ledger-004`45:- **AND** the tolerance`gap-ledger-054`74:- **AND** the loss`gap-ledger-008`118:- **AND** no other`gap-ledger-013`232:- **AND** the tolerance`gap-ledger-057`258:- **WHEN** you run`gap-ledger-069`268:- **WHEN** a code`gap-ledger-070`275:- **WHEN** a code`gap-ledger-071`286:#### Scenario: Compare the`gap-ledger-072`287:- **WHEN** a code`gap-ledger-073`294:- **WHEN** you run`gap-ledger-074`
```

The base scenarios keep the base content meaning.
Scenarios 136, 140, 142, 143 and 154 name the adopted source tolerance conditions.
Scenarios 137 to 139, 141, 145 and 146 name the bounded exception or its rejected inputs.
Scenarios 147 to 153 name the valid adopt line exception and its rejected inputs.

#### Self-check

The actors use the glossary words: gate, ratchet command, ci command, check command and person who merges.
The clauses name the ledger entry, current gap, adopt line, adopted source and content hash separately.
Each changed scenario has a changed tagged test. The tests use methods of node:assert.
Each new test title names an actor and a result verb.

The title for scenario 137 names a file that differs from its adopted source.
The code comments name the file and the ledger entry.

The metric tests use literal counts and distinct total counts from the two records.
The named mutations change the source of each selected count and total count.
The checks cover larger, equal, smaller and mixed metric counts.
The base content test covers a file that also equals its adopted source.

The glossary defines never-worse counts. The design explains why an adopt line has no total counts.
The count function decision follows the lead decision. compareLedger and compareWithBase have no code changes.
The gate and tolerance size have no changes.

The reached probe compares the result with and without the valid reached adopt line in adoptedFile.
The named mutation is: drop the reached adopt line from adoptedFile. The result is EQUIVALENT for base content.
The probe checks 24 cases and reports no effect from the reached adopt line.

With true coverage, the base content tolerance already accepts the total count difference.
With untrue coverage, the total-only guards reject the exception.
The two current gap guard probes each compare 11520 cases and report EQUIVALENT.

Those probes use plain records and pure predicates. The probes make no claim for property getters or callback effects.

#### Live test titles

Command: python pass3/check-echoes.py in the tools folder.
The script checks each quoted title and each bracketed scenario label against the live titles.
The script has a QA purpose header.

Command: rg with the new scenario tags in the two test files.
Output:

```text
test('[gap-ledger-136 gap-ledger-140] the gate allows a count difference inside tolerance for a file that equals its adopted source', ...);
test('[gap-ledger-137] the gate compares another ledger hash with no tolerance', ...);
test('[gap-ledger-141] the gate compares untrue or unloaded coverage with no tolerance', ...);
test('[gap-ledger-142] the gate reports an error for counts outside the count limits', ...);
test('[gap-ledger-143] the ratchet command writes better counts for a file that equals its adopted source', ...);
test('[gap-ledger-147] the gate accepts total differences for a file with a valid adopt line', ...);
test('[gap-ledger-148] the gate compares not-covered counts with no tolerance for a file that differs from its adopted source', ...);
test('[gap-ledger-149] the gate records total differences as stale without an adopt line', ...);
test('[gap-ledger-152] the gate records another ledger hash as stale for total differences', ...);
test('[gap-ledger-153] the gate reports the exact result for untrue or unloaded coverage', ...);
test('[gap-ledger-154 gap-ledger-143] the ratchet command selects larger equal and smaller counts per metric', ...);
test('[gap-ledger-154 gap-ledger-147] the ratchet command selects totals for a file that equals its adopted source', ...);
test('[gap-ledger-143 gap-ledger-154] the ratchet command uses base content counts when both source predicates are true', ...);
test('[gap-ledger-136 gap-ledger-140 gap-ledger-144] the gate uses the adopted source in the check, ci and ratchet commands', ...);
test('[gap-ledger-137] the gate gives no count tolerance to a file that differs from its adopted source', ...);
test('[gap-ledger-138] the gate uses no tolerance from the adopted source requirement for an invalid adopt line', ...);
test('[gap-ledger-139] the gate uses no tolerance from the adopted source requirement from another change', ...);
test('[gap-ledger-145] the gate gives no tolerance from the adopted source requirement to an absent file with a valid adopt line', ...);
test('[gap-ledger-146] the gate needs the code file in a valid adopt line', ...);
test('[gap-ledger-147] the gate accepts total differences for a file with a valid adopt line in the check, ci and ratchet commands', ...);
test('[gap-ledger-149] the gate needs a valid adopt line for total differences', ...);
test('[gap-ledger-150] the gate ignores another change for total differences', ...);
test('[gap-ledger-151] the gate rejects an invalid from commit for total differences', ...);
test('[gap-ledger-154] the ratchet command writes no larger count for a file that equals its adopted source', ...);
test('[gap-ledger-069] the gate applies count tolerance to a file with base content', ...);
test('[gap-ledger-081] the gate applies the waived count to a file that differs from its adopted source', ...);
```

#### Correction search output

Command: Python file search in pass3/evidence-corrections.py.
Output:

```text
specs/gap-ledger/spec.md:10: This requirement is an exception to the base content condition of the requirement "Count tolerance" and to scenario gap-ledger-074.
specs/gap-ledger/spec.md:88: This requirement is an exception to scenario gap-ledger-078 and to the stale exception sentence of the requirement "Ratchet rule".
specs/gap-ledger/spec.md:95: For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source.
../../../src/tooling/spec/ledger.test.mjs:1613: assert.deepEqual(codes(result), side === 'entry' ? ['LEDGER-STALE'] : [extra.untrue ? 'COVERAGE-FAKE' : 'LEDGER-UNLOADED']);
../../../scripts/spec/lib/ledger.mjs:235: function neverWorseCounts(entry, gap) {
proposal.md:40: Pass 2 sets no bound on the size of a total difference. The covered baseline can lag.
evidence.md:406: The complete pass 2 proof is proof-pass2.json in this change folder.
specs/gap-ledger/spec.md:7: The adopt line MUST meet the requirement "Adoption of merged code".
design.md:67: | file with a valid adopt line | File that the valid adopt line names, with any current content. |
specs/gap-ledger/spec.md:7: The adopt line MUST meet the requirement "Adoption of merged code".
specs/gap-ledger/spec.md:6: Both the ledger entry and the current gap MUST show true coverage from a test that loads the file.
specs/gap-ledger/spec.md:95: For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source.
evidence.md:75: At pass 1 the source check rejects src/keySetupCore.mjs. Pass 2 clears that file, because only its total counts differ.
proposal.md:32: Count tolerance applies to a file with base content and to a file that equals its adopted source.
specs/gap-ledger/spec.md:12: These are the tolerance conditions of a file that equals its adopted source.
specs/gap-ledger/spec.md:113: - **THEN** the gate reports LEDGER-LARGER-GAP or LEDGER-LOST-COVERAGE for a larger count
specs/gap-ledger/spec.md:119: - **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs
proposal.md:39: It accepts a difference in the total counts and the covered counts that follow.
proposal.md:36: Rule 21 needs the person who merges to check the merged commit against the upstream remote and record the result in review.md.
evidence.md:420: Pass 1 code and test commit: `125dc3ae`. Current script commit: `0945baee`.
specs/gap-ledger/spec.md:5: The content hash MUST equal the hash in the ledger entry.
specs/gap-ledger/spec.md:83: The gates MUST accept a total-only difference for a file with a valid adopt line of the checked change.
specs/gap-ledger/spec.md:14: The commands MUST apply the count tolerance of the requirement "Count tolerance" and its coverage loss errors.
specs/gap-ledger/spec.md:30: - **THEN** the gate compares the file with no tolerance from this requirement
specs/gap-ledger/spec.md:4: The gates and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
specs/gap-ledger/spec.md:106: - **AND** the ratchet command writes the current total counts, for example 399 or 401 for an entry total of 400
specs/gap-ledger/spec.md:64: - **AND** each command compares the file content with its content at the `from` commit in the same way
specs/gap-ledger/spec.md:67: - **WHEN** a valid adopt line names a file that the current tree does not have
specs/gap-ledger/spec.md:130: #### Scenario: Compare a different hash with no tolerance `gap-ledger-152`
design.md:13: The gate uses checkAdopts to check the merged commit, the changed file set and the reached rule.
specs/gap-ledger/spec.md:70: #### Scenario: Need the code file in the adopt line `gap-ledger-146`
specs/gap-ledger/spec.md:85: Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
design.md:19: This includes a conflict that a person resolves by hand.
design.md:24: The ci command selects the change first. The ci, check and ratchet commands use the same predicate.
design.md:28: For a file that equals its adopted source without base content, the ratchet command uses neverWorseCounts.
design.md:41: The gate computes adoptedFile from the same valid adopt lines as adoptedAsIs, without an adopted source content check.
design.md:45: The comparison applies all coverage error rules. The ratchet command applies its existing rule for total counts to files without base content that differ from their adopted source.
design.md:3: Commit read: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
proposal.md:5: A file that the fork edits can also have different total counts and equal not-covered counts.
proposal.md:20: - `gap-ledger`: add "Count tolerance for adopted files" and "Total counts for adopted files".
tasks.md:18: - [x] Add the requirement "Total counts for adopted files".
proposal.md:29: The count tolerance is 8 counts or 4% of the metric total, the smaller of the two numbers.
evidence.md:467: Only the Known limits and later changes heading differs from that commit.
tasks.md:46: - [x] Check the JSON output of openspec show.
tasks.md:37: - [x] Commit the code, the tests and the change folder.
tasks.md:33: - [x] Run each named mutation.
tasks.md:16: - [x] Add the test for the adopt line of the code file with `gap-ledger-146`.
tasks.md:3: - [x] Write the proposal.
../../../src/tooling/spec/ledger.test.mjs:1606: test('[gap-ledger-153] the gate reports the exact result for untrue or unloaded coverage', () => {
../../../scripts/spec/lib/ledger.mjs:402: * See "Count tolerance", "Count tolerance for adopted files" and "Total counts for adopted files".
evidence.md:421: Current test commit: `0407e631`. Each fixture process runs its temporary test file.
```

The automatic mutations found two cases that share current gap totals instead of a copy.
The metric test now checks that the current gap keeps its measured total counts after the ratchet command.
This assertion compares the current gap with literal totals. The assertion checks the source of the selected totals.
The scenario states that the current gap keeps its current total counts.


#### Host commands and verdicts

All paths below start at /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3 unless the text names another root.
Each host Node process uses taskset -c 0-3 nice -n 19. Each test process names one test file.
The host Node version is 26.8.2. These results give no Node image verdict.

The first sandbox test attempts give no complete individual reports. The full-file host attempts stop before a final report.
Those attempts give no suite verdict. The exact host commands replace them.

The first automatic mutation attempt stops at its empty baseline. That attempt gives no mutation verdict.
The successful host campaign completes both phases.

The format command on the host checks 1158 source files. The earlier sandbox format command stops with spawnSync git EPERM.
The format files exclude scripts/spec and src/tooling/spec. The command changes no project file.

The red scenario 154 command is in t3-red-direct-continued.log. The first line names its Node command.
The command reads commit c4ba0585 before any code change.
The test reports one failure. The gate reaches the base comparison and reports LEDGER-NOT-IN-BASE for src/merged.js.
The ratchet command writes the literal branch counts 2 and 101.

The red command after the count assertion correction is in t3-red-final-edit.log.
That test expects the literal counts 1 and 100 and fails against the same code.

The green command is in t3-green.log. The test reports one pass and no failure.
The ratchet command writes the literal branch counts 1 and 100.
The base comparison reports no LEDGER-NOT-IN-BASE and no LEDGER-MORE-THAN-BASE.
The fixture still has no review.md. This test result gives no full fixture gate pass.

The ledger commands are in ledger-before.log and ledger-final-check.log.
The first command reports 100 tests and 100 passes on commit c4ba0585.
The final command reports 103 tests and 103 passes, with no failure.
The final library has 100% line, branch and function coverage.

The code diff adds neverWorseCounts and changes ratchetLedger to select the count function by base content.
The toleranceCounts and compareLedger comments change. Their code does not change.
The code of compareWithBase, scripts/spec/gates.mjs and toleranceOf does not change.
Command: git diff c4ba0585 -- scripts/spec/lib/ledger.mjs.
The search shows neverWorseCounts at line 235 and the count function selection at line 638.

Command: python pass3/named.py. The records are in named-results.json.
The command reports nine killed named mutations and two EQUIVALENT current gap guard mutations.
The guard-probe.mjs command checks 11520 cases for each current gap guard.
The reached-probe.mjs command checks 24 cases with base content and both untrue states.
The order-probe.mjs command checks 5760 cases and compares returned results and input records.

| Named mutation | Failed scenario |
| --- | --- |
| Use less than instead of less than or equal | gap-ledger-154 |
| Always write the current gap | gap-ledger-154 |
| Always write the ledger entry | gap-ledger-154 |
| Use toleranceCounts for adopted source content without base content | gap-ledger-154 |
| Use neverWorseCounts for base content | gap-ledger-143, gap-ledger-154 |
| Write the current total for a larger not-covered count | gap-ledger-154 |
| Write entry totals for a file that differs from its adopted source | gap-ledger-147 |
| Allow an untrue ledger entry | gap-ledger-153 |
| Allow an unloaded ledger entry | gap-ledger-153 |
| Share current gap totals instead of a copy | gap-ledger-143, gap-ledger-154 |

The last mutation has two automatic forms. Each form fails the metric test in automatic-followup.json.
The failed tests use the live titles in the title output above.

The automatic generator makes 11336 candidates. The changed line selection has 64 candidates.
The records are in automut/results.json. The complete final proof is proof-pass3.json in this change folder.

| Stage | Killed | Candidates that pass |
| --- | ---: | ---: |
| Phase 1 | 61 | 3 |
| Phase 2 | 0 | 3 |
| Current gap total assertion | 2 | 1 |

The final result is 63 killed mutations and one EQUIVALENT mutation. No mutation has an unresolved status.
The EQUIVALENT mutation changes the order of two independent assignments to plain records.
The probe checks both the returned result and the input ledger and current gap.
The claim does not apply to property getters, property setters or callbacks with side effects.

Command: cp -a /home/ianblenke/docker/gev-work/upstream-sync-3 /tmp/claude-1000/gcr/s3-replay3.
The scratch tree has the sync commit d09e034b9c751ebe286e2f5f32773db1af48c0a3.
The command copies the final ledger.mjs and gates.mjs from this tree into the scratch tree.
Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/claude-1000/gcr/s3-replay3 /tmp/claude-1000/gcr/pr18-art.
The logs are replay-main.log and replay-final-tree.log.

The main library reports four stale coverage entries. The final library reports no stale coverage entry for those four files.
Those files are server/providers/mapillary/tiles.js, src/data/localGeojsonCore.js, src/keySetupCore.mjs and src/voice/turnMetrics.js.
The untraced entries and LEDGER-NEW-COVERAGE-GAP lines come from the script copy of the predicates.
These lines give no project gate verdict. The lead must run all gates in the image on the sync tree.


The final toleranceCounts comment names base content. That correction changes no JavaScript statement.
Command: taskset -c 0-3 nice -n 19 node pass3/check-code-ast.mjs.
The command compares the code AST of the tested library with the final library, without source offsets.
The command reports equal code ASTs. proof-pass3.json records the AST hash and the final source hash.

The mutation offsets in the final proof match the final source.
The final order probe still reports 5760 EQUIVALENT cases.

The echo script extracts literal titles from the JavaScript AST of both test files.
The script also reads the exact gate title list to include the loop cases.
This method excludes fixture text inside strings.
The echo result reports 343 live titles, 27 bracketed labels, 27 quoted titles and no old title.


Scenario 148 names equal total counts for its larger-count error case.
With equal totals, a larger not-covered count also gives a smaller covered count for branches and functions.
The test checks literal total counts of 400 before the comparison.
This condition matches the test and the coverage loss rule. The condition changes no code rule.


The final scenario check bounds scenario 142 by the count rise and covered count loss rules of Count tolerance.
Scenarios 147 and 148 name files without base content.
A file with base content keeps toleranceCounts, also when its adopted source differs.
These clauses prevent an overlap with the base content rule. They change no code rule.


The final exact gate test reports are in gate-report.json, from exact-results.json and retry-results.json.
The command runs each exact test title in one test file per process.
Commit c4ba0585 has 240 tests: 239 pass and scenario 154 fails.
The current tree has 240 tests and 240 passes. Both reports have no missing test.

Ten timed-out attempts stop before a report. Their complete replacements pass.
Those stopped attempts give no verdict.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs.
The final coverage output is in gate-coverage-complete.log.
The gate script covers 741 of 741 lines, 388 of 388 branches and 91 of 91 functions.
The coverage command reads the actual source URL from 896 fixture process reports.
The gate script has 100% line, branch and function coverage.

The final lint command reports zero errors and 543 warnings.
The echo script reports 343 live titles, 27 bracketed labels, 27 quoted titles and no old title.
The document headings match commit c4ba0585 in all five documents.

OpenSpec show gives valid JSON. OpenSpec validate passes.
Git diff --check reports no error.
The lead must run the image commands and both review agents. This host pass gives no image or review verdict.

### Pass 4

Tree read: branch vendored-tolerance, commit 25ba5d2d1bce13b0aace29d49a7779043003493a, with the Pass 4 corrections.
The pre-review 2 reports read commit 975a62305917a83080c0433ec6ec0a67dfb65367.
The past records above stay as they were. The records below give the corrected titles, tags, words and line pointers.
The two pre-review folders have no changes.

#### Past record corrections

The repeated titles script is pass4/check-repeated-titles.py. The script checks current documents and this Pass 4 block.
Past records describe their recorded tree and do not supply current title or tag evidence.

The named mutation for scenario 155 removes the total count guard.
The named mutation for scenario 154 stops the ratchet command before it writes.
The origin of each selected count is the ledger entry or the current gap. Adopted source means only file content.

Pass 2 script commit means the script commit of the recorded pass 2 command.
The pass 3 tree means the tree of the recorded pass 3 command.
At that attempt the line pointers named the tree at code commit 04554050; they do not name the Pass 4 tree.
At the first pass 3 attempt, the red test for scenario 154 stops the work.

The historical row 35 correction is at evidence.md:595. Its owner heading correction points to evidence.md:467.
The historical row 41 correction concerns the title for scenario 153 at ledger.test.mjs:1606.
The count rule compares current counts with ledger entry counts and uses no time word.

#### Finding corrections

Each row below describes commit 25ba5d2d with the Pass 4 corrections.

Command: python /home/ianblenke/docker/gev-tools/vendored-tolerance/pass4/corrections.py.

| Finding | Commit with Pass 4 corrections | First words | Correction | Search output |
| --- | --- | --- | --- | --- |
| Spec major | 25ba5d2d | The exception names | Name each base clause and limit the exception to adopted-source conditions without base content. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:12` |
| Spec minor 1 | 25ba5d2d | neverWorseCounts reads | Write the current total count when ledger total counts are absent. | `scripts/spec/lib/ledger.mjs:242` |
| Spec minor 2 | 25ba5d2d | The expected | Check the LCOV replacement and both positive ratchet reports. | `src/tooling/spec/gates.test.mjs:301` |
| Spec minor 3 | 25ba5d2d | neverWorseCounts writes | Name the covered count fall at each ratchet run. | `openspec/changes/vendored-coverage-tolerance/proposal.md:56` |
| Spec minor 4 | 25ba5d2d | The limit names | Name slack after a partial improvement. | `openspec/changes/vendored-coverage-tolerance/proposal.md:62` |
| Spec minor 5 | 25ba5d2d | The typo | Restore the comment to the main text. | `src/tooling/spec/ledger.test.mjs:716` |
| STE major 1 | 25ba5d2d | when the not-covered | Name both operands of each count comparison. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:36` |
| STE major 2 | 25ba5d2d | MUST use toleranceCounts | Bound both count functions by their conditions. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:34` |
| STE major 3 | 25ba5d2d | names the tolerance | Name all total-only conditions and the stale exception. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:124` |
| STE major 4 | 25ba5d2d | adopt line | Define adopt line and valid adopt line separately. | `openspec/changes/vendored-coverage-tolerance/design.md:73` |
| STE major 5 | 25ba5d2d | records total differences | Make the ledger entry the object of stale. | `src/tooling/spec/ledger.test.mjs:1588` |
| STE major 6 | 25ba5d2d | selects larger equal | Name the count result and toleranceCounts in the titles. | `src/tooling/spec/ledger.test.mjs:1620` |
| STE major 7 | 25ba5d2d | tags | Remove the two tags that name other WHEN conditions. | `src/tooling/spec/ledger.test.mjs:1643` |
| STE major 8 | 25ba5d2d | Correct | Use two tasks with the real finding names. | `openspec/changes/vendored-coverage-tolerance/tasks.md:64` |
| STE minor 1 | 25ba5d2d | These are | Define adopted-source conditions once. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:11` |
| STE minor 2 | 25ba5d2d | MUST apply | Apply rules and report errors with one actor name. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:29` |
| STE minor 3 | 25ba5d2d | keep | Use write for ledger values and do not change for fixed code. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:38` |
| STE minor 4 | 25ba5d2d | smaller or equal | Name both count operands in the design. | `openspec/changes/vendored-coverage-tolerance/design.md:33` |
| STE minor 5 | 25ba5d2d | the not-covered count rise | Use rises and falls as verbs. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:73` |
| STE minor 6 | 25ba5d2d | count tolerance | Use tolerance for the number and count tolerance for the rule. | `openspec/changes/vendored-coverage-tolerance/design.md:83` |
| STE minor 7 | 25ba5d2d | entry | Use ledger entry throughout current prose. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:71` |
| STE minor 8 | 25ba5d2d | the base comparison reports | Name the ratchet command as the actor. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:99` |
| STE minor 9 | 25ba5d2d | the current gap still | State that the ratchet command does not change current totals. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:102` |
| STE minor 10 | 25ba5d2d | MUST not | Use MUST NOT. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:30` |
| STE minor 11 | 25ba5d2d | the titles | Define both requirement titles as labels. | `openspec/changes/vendored-coverage-tolerance/design.md:70` |
| STE minor 12 | 25ba5d2d | an entry total | Use ledger entry total count. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:142` |
| STE minor 13 | 25ba5d2d | merged commit | Define merged commit and base commit without a cycle. | `openspec/changes/vendored-coverage-tolerance/design.md:87` |
| STE minor 14 | 25ba5d2d | never-worse counts | Define counts, rather than an instruction. | `openspec/changes/vendored-coverage-tolerance/design.md:94` |
| STE minor 15 | 25ba5d2d | lead | Add image checks and both review passes to the lead duties. | `openspec/changes/vendored-coverage-tolerance/design.md:110` |
| STE minor 16 | 25ba5d2d | CI artifact | Use CI run for the artifact origin. | `openspec/changes/vendored-coverage-tolerance/design.md:117` |
| STE minor 17 | 25ba5d2d | blank lines | Write one continuous glossary table. | `openspec/changes/vendored-coverage-tolerance/design.md:111` |
| STE minor 18 | 25ba5d2d | adopt line not-covered | Name counts in the adopt line and compareLedger. | `openspec/changes/vendored-coverage-tolerance/design.md:29` |
| STE minor 19 | 25ba5d2d | sets no bound | Name the requirement and both covered counts. | `openspec/changes/vendored-coverage-tolerance/proposal.md:42` |
| STE minor 20 | 25ba5d2d | gives no tolerance | Name the count tolerance requirement in the limit. | `openspec/changes/vendored-coverage-tolerance/proposal.md:36` |
| STE minor 21 | 25ba5d2d | This has no effect | Name base content, true coverage and refusal for untrue coverage. | `openspec/changes/vendored-coverage-tolerance/proposal.md:49` |
| STE minor 22 | 25ba5d2d | The full gate command | Name the actual image command and remove the timer cause. | `openspec/changes/vendored-coverage-tolerance/proposal.md:53` |
| STE minor 23 | 25ba5d2d | Run all host checks | Point to Host commands and verdicts in this change. | `openspec/changes/vendored-coverage-tolerance/tasks.md:71` |
| STE minor 24 | 25ba5d2d | Check the title | Use repeated titles and the Pass 4 script. | `openspec/changes/vendored-coverage-tolerance/tasks.md:74` |
| STE minor 25 | 25ba5d2d | Run the CI artifact | Use Replay the real CI data. | `openspec/changes/vendored-coverage-tolerance/tasks.md:76` |
| STE minor 26 | 25ba5d2d | metric tests | Name lines, branches and functions. | `openspec/changes/vendored-coverage-tolerance/tasks.md:67` |
| STE minor 27 | 25ba5d2d | the script | Use the repeated titles script in the Pass 4 record. | `openspec/changes/vendored-coverage-tolerance/evidence.md:894` |
| STE minor 28 | 25ba5d2d | The named | Use named mutation for each test fault. | `openspec/changes/vendored-coverage-tolerance/evidence.md:897` |
| STE minor 29 | 25ba5d2d | the source of each | Use origin of a value. | `openspec/changes/vendored-coverage-tolerance/evidence.md:899` |
| STE minor 30 | 25ba5d2d | Current script commit | Label the historical commits by pass. | `openspec/changes/vendored-coverage-tolerance/evidence.md:901` |
| STE minor 31 | 25ba5d2d | the pointers | Limit old line pointers to their recorded attempt. | `openspec/changes/vendored-coverage-tolerance/evidence.md:903` |
| STE minor 32 | 25ba5d2d | stops the work | Name the red test as the actor. | `openspec/changes/vendored-coverage-tolerance/evidence.md:904` |
| STE minor 33 | 25ba5d2d | the pointers of rows | Correct both historical pointer meanings in this block. | `openspec/changes/vendored-coverage-tolerance/evidence.md:906` |
| STE minor 34 | 25ba5d2d | time word | State the comparator without a time word. | `openspec/changes/vendored-coverage-tolerance/evidence.md:908` |
| STE minor 35 | 25ba5d2d | the gate givess | Restore gives from main. | `src/tooling/spec/ledger.test.mjs:716` |
| STE minor 36 | 25ba5d2d | A valid adopt line allows | Make the gate the actor of acceptance. | `scripts/spec/lib/ledger.mjs:446` |
| STE minor 37 | 25ba5d2d | keeps the entry counts | Use write and name both covered counts. | `scripts/spec/lib/ledger.mjs:215` |
| STE minor 38 | 25ba5d2d | writes better counts | Use never-worse counts in the scenario and title. | `src/tooling/spec/ledger.test.mjs:1540` |
| STE minor 39 | 25ba5d2d | reports the exact result | Name no total count exception as the result. | `src/tooling/spec/ledger.test.mjs:1606` |
| STE minor 40 | 25ba5d2d | another ledger hash | Name the content hash and ledger entry hash. | `src/tooling/spec/ledger.test.mjs:1511` |
| STE minor 41 | 25ba5d2d | outside the count limits | Use outside the count tolerance. | `src/tooling/spec/ledger.test.mjs:1532` |
| STE minor 42 | 25ba5d2d | the adopted source requirement | Name the requirement and another change outcome. | `src/tooling/spec/gates.test.mjs:2700` |
| STE minor 43 | 25ba5d2d | the gate needs | Name no tolerance or a stale ledger entry as the result. | `src/tooling/spec/gates.test.mjs:2785` |
| STE minor 44 | 25ba5d2d | rejects an invalid from | Name the stale ledger entry and LEDGER-ADOPT-FROM. | `src/tooling/spec/gates.test.mjs:2805` |

Search output:

```text
Spec major: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:12: This requirement is an exception to the base content condition of "Count tolerance" and to gap-ledger-028, gap-ledger-073 and gap-ledger-074.
Spec minor 1: scripts/spec/lib/ledger.mjs:242:     next.totals[metric] = entry.totals?.[metric] ?? gap.totals[metric];
Spec minor 2: src/tooling/spec/gates.test.mjs:301:     assert.match(result.output, /Ratchet: \d+ history lines for add-demo\./);
Spec minor 3: openspec/changes/vendored-coverage-tolerance/proposal.md:56: The covered count can fall by up to the tolerance at each ratchet run.
Spec minor 4: openspec/changes/vendored-coverage-tolerance/proposal.md:62: A partial improvement leaves slack that can hide a later fall back to the old count.
Spec minor 5: src/tooling/spec/ledger.test.mjs:716:   // count is still not a loss, so the gate gives no LEDGER-LOST-COVERAGE, only LEDGER-STALE.
STE major 1: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:36: For each metric, never-worse counts MUST write current counts when the current not-covered count is smaller than or equal to the ledger entry not-covered count.
STE major 2: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:34: When a file has the adopted-source conditions and no base content, the ratchet command MUST use never-worse counts.
STE major 3: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:124: The exception applies only to a file with a valid adopt line of the checked change and equal content hashes.
STE major 4: openspec/changes/vendored-coverage-tolerance/design.md:73: | valid adopt line | Adopt line of the checked change that meets Adoption of merged code. |
STE major 5: src/tooling/spec/ledger.test.mjs:1588: test('[gap-ledger-149] the gate records the ledger entry as stale for total differences without an adopt line', () => {
STE major 6: src/tooling/spec/ledger.test.mjs:1620: test('[gap-ledger-154 gap-ledger-143] the ratchet command writes the current count for a smaller or equal not-covered count and the ledger entry count for a larger count, per metric', () => {
STE major 7: src/tooling/spec/ledger.test.mjs:1643: test('[gap-ledger-154] the ratchet command selects totals for a file that equals its adopted source', () => {
STE major 8: openspec/changes/vendored-coverage-tolerance/tasks.md:64: - [x] Correct the eight spec findings of pre-review 1.
STE minor 1: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:11: The four conditions above are the adopted-source conditions.
STE minor 2: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:29: Each command MUST apply the count tolerance of the requirement "Count tolerance" and report its coverage loss errors.
STE minor 3: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:38: For a current not-covered count larger than the ledger entry not-covered count, never-worse counts MUST write ledger entry counts.
STE minor 4: openspec/changes/vendored-coverage-tolerance/design.md:33: A current not-covered count smaller than or equal to the ledger entry not-covered count selects current counts.
STE minor 5: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:73: - **AND** when the not-covered count rises by more than the tolerance and the covered count falls by more than the tolerance
STE minor 6: openspec/changes/vendored-coverage-tolerance/design.md:83: | count tolerance | Rule from the requirement Count tolerance. |
STE minor 7: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:71: - **AND** a not-covered line count is above the ledger entry count plus the tolerance
STE minor 8: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:99: - **AND** the ratchet command reports no LEDGER-NOT-IN-BASE and no LEDGER-MORE-THAN-BASE
STE minor 9: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:102: - **AND** the ratchet command does not change the total counts of the current gap
STE minor 10: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:30: The gate MUST NOT record a ledger entry as stale for counts inside this count tolerance.
STE minor 11: openspec/changes/vendored-coverage-tolerance/design.md:70: | requirement titles | Labels: Count tolerance for adopted files uses adopted-source conditions; Total counts for adopted files uses a valid adopt line. |
STE minor 12: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:142: - **AND** the ratchet command writes the current total counts, for example 399 or 401 for a ledger entry total count of 400
STE minor 13: openspec/changes/vendored-coverage-tolerance/design.md:87: | merged commit | A parent of a merge commit, except the first parent. |
STE minor 14: openspec/changes/vendored-coverage-tolerance/design.md:94: | never-worse counts | Counts that use current counts when the current not-covered count does not exceed the ledger entry not-covered count; otherwise, ledger entry counts. |
STE minor 15: openspec/changes/vendored-coverage-tolerance/design.md:110: | lead | Person who decides design corrections, runs image checks and gets both review passes. |
STE minor 16: openspec/changes/vendored-coverage-tolerance/design.md:117: | CI artifact | Coverage and guard files from the CI run. |
STE minor 17: openspec/changes/vendored-coverage-tolerance/design.md:111: | metric | Lines, branches or functions. |
STE minor 18: openspec/changes/vendored-coverage-tolerance/design.md:29: An adopt line has no total counts. compareWithBase bounds a ledger entry without base content by the not-covered counts in the adopt line.
STE minor 19: openspec/changes/vendored-coverage-tolerance/proposal.md:42: The requirement "Total counts for adopted files" sets no bound on the size of a total difference.
STE minor 20: openspec/changes/vendored-coverage-tolerance/proposal.md:36: This limit applies to the requirement "Count tolerance for adopted files".
STE minor 21: openspec/changes/vendored-coverage-tolerance/proposal.md:49: A file with base content already gets this exception from "Count tolerance" when its coverage is true.
STE minor 22: openspec/changes/vendored-coverage-tolerance/proposal.md:53: make gates CHANGE=vendored-coverage-tolerance in the Node image on the upstream-sync-3 tree must supply the project verdict.
STE minor 23: openspec/changes/vendored-coverage-tolerance/tasks.md:71: - [x] Run the host checks that evidence.md lists under Host commands and verdicts.
STE minor 24: openspec/changes/vendored-coverage-tolerance/tasks.md:74: - [x] Check each document title against the live test titles with the repeated titles script.
STE minor 25: openspec/changes/vendored-coverage-tolerance/tasks.md:76: - [x] Replay the real CI data on s3-replay3.
STE minor 26: openspec/changes/vendored-coverage-tolerance/tasks.md:67: - [x] Write the tests of lines, branches and functions for gap-ledger-154 before its code.
STE minor 27: openspec/changes/vendored-coverage-tolerance/evidence.md:894: The repeated titles script is pass4/check-repeated-titles.py. The script checks current documents and this Pass 4 block.
STE minor 28: openspec/changes/vendored-coverage-tolerance/evidence.md:897: The named mutation for scenario 155 removes the total count guard.
STE minor 29: openspec/changes/vendored-coverage-tolerance/evidence.md:899: The origin of each selected count is the ledger entry or the current gap. Adopted source means only file content.
STE minor 30: openspec/changes/vendored-coverage-tolerance/evidence.md:901: Pass 2 script commit means the script commit of the recorded pass 2 command.
STE minor 31: openspec/changes/vendored-coverage-tolerance/evidence.md:903: At that attempt the line pointers named the tree at code commit 04554050; they do not name the Pass 4 tree.
STE minor 32: openspec/changes/vendored-coverage-tolerance/evidence.md:904: At the first pass 3 attempt, the red test for scenario 154 stops the work.
STE minor 33: openspec/changes/vendored-coverage-tolerance/evidence.md:906: The historical row 35 correction is at evidence.md:595. Its owner heading correction points to evidence.md:467.
STE minor 34: openspec/changes/vendored-coverage-tolerance/evidence.md:908: The count rule compares current counts with ledger entry counts and uses no time word.
STE minor 35: src/tooling/spec/ledger.test.mjs:716:   // count is still not a loss, so the gate gives no LEDGER-LOST-COVERAGE, only LEDGER-STALE.
STE minor 36: scripts/spec/lib/ledger.mjs:446:     // The gate accepts a total-only difference for a file with a valid adopt line when the not-covered counts are equal.
STE minor 37: scripts/spec/lib/ledger.mjs:215:  * For branches and functions, the command writes ledger entry counts when the current covered count is smaller than the ledger entry covered count.
STE minor 38: src/tooling/spec/ledger.test.mjs:1540: test('[gap-ledger-143] the ratchet command writes never-worse counts for a file that equals its adopted source', () => {
STE minor 39: src/tooling/spec/ledger.test.mjs:1606: test('[gap-ledger-153] the gate gives no total count exception for untrue or unloaded coverage', () => {
STE minor 40: src/tooling/spec/ledger.test.mjs:1511: test('[gap-ledger-137] the gate compares a content hash that differs from the hash in the ledger entry with no tolerance', () => {
STE minor 41: src/tooling/spec/ledger.test.mjs:1532: test('[gap-ledger-142] the gate reports an error for counts outside the count tolerance', () => {
STE minor 42: src/tooling/spec/gates.test.mjs:2700: test('[gap-ledger-139] the gate gives no tolerance for an adopt line of another change', () => {
STE minor 43: src/tooling/spec/gates.test.mjs:2785: test('[gap-ledger-149] the gate records the ledger entry as stale when no valid adopt line names the file', () => {
STE minor 44: src/tooling/spec/gates.test.mjs:2805: test('[gap-ledger-151] the gate records the ledger entry as stale and reports LEDGER-ADOPT-FROM for an invalid from commit', () => {
```

#### Title and body check

Command: python /home/ianblenke/docker/gev-tools/vendored-tolerance/pass4/check-verbs.py.

The command lists every test title that differs from main, with each body assertion.
The table below names the actual results: written counts, stale ledger entries, error reports and refusal of exceptions.
For each title, the body asserts the result that its verb names.
The count tests assert literal values. The metric test also checks that the ratchet command does not change current gap totals.
The base content test asserts toleranceCounts results when both content predicates return true.

```text
| Test title | Body result assertions |
| --- | --- |
| `[gap-ledger-136 gap-ledger-140] the gate allows a count difference inside tolerance for a file that equals its adopted source` | `assert.deepEqual(compareLedger({ ledger, current, adoptedAsIs: (name) => name === file }), { errors: [], stale: [] });`; `assert.deepEqual(codes(compareLedger({ ledger, current })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);`; `assert.deepEqual(compareLedger({ ledger, current: smaller, adoptedAsIs: () => true }), { errors: [], stale: [] });`; `assert.deepEqual(compareLedger({ ledger, current: complete, adoptedAsIs: name => name === file }), { errors: [], stale: [] });` |
| `[gap-ledger-137] the gate compares a content hash that differs from the hash in the ledger entry with no tolerance` | `assert.deepEqual(codes(compareLedger({ ledger, current, adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LARGER-GAP', 'LEDGER-LARGER-GAP']);` |
| `[gap-ledger-141] the gate compares untrue or unloaded coverage with no tolerance` | `assert.equal(codes(compareLedger({ ledger, current, adoptedAsIs: () => true })).includes('LEDGER-LARGER-GAP'), true);`; `assert.equal(codes(compareLedger({ ledger, current: gaps([record]), adoptedAsIs: () => true })).includes('LEDGER-LARGER-GAP'), true);` |
| `[gap-ledger-142] the gate reports an error for counts outside the count tolerance` | `assert.deepEqual(codes(compareLedger({ ledger, current: gaps([loaded(file, 19, 19, 19, 'same', BIG)]), adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);`; `assert.deepEqual(codes(compareLedger({ ledger: small, current: gaps([loaded(file, 2, 2, 2, 'same', { lines: 24, branches: 24, functions: 24 })]), adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);` |
| `[gap-ledger-143] the ratchet command writes never-worse counts for a file that equals its adopted source` | `assert.deepEqual(result.ledger.coverage[file], { sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', loaded: true, lines: 10, branches: 10, functions: 10, totals: { lines: 400, branches: 400, functions: 400 } });`; `assert.deepEqual(result.history, []);`; `assert.equal(better.ledger.coverage[file].lines, 9);`; `assert.equal(better.ledger.coverage[file].branches, 9);`; `assert.equal(better.ledger.coverage[file].functions, 9);` |
| `[gap-ledger-147] the gate accepts total differences for a file with a valid adopt line` | `assert.deepEqual(compareLedger({ ledger, current, adoptedFile: name => name === file }), { errors: [], stale: [] });`; `assert.deepEqual(compareLedger({ ledger, current }).stale, [{ kind: 'coverage', file: 'src/new.js' }]);`; `assert.deepEqual(ratchet(ledger, lower).ledger.coverage[file].totals, { lines: 399, branches: 399, functions: 399 });`; `assert.deepEqual(ratchet(ledger, higher).ledger.coverage[file].totals, { lines: 401, branches: 401, functions: 401 });` |
| `[gap-ledger-148] the gate compares not-covered counts with no tolerance for a file that differs from its adopted source` | `assert.deepEqual(current.coverage.get(file).totals, { lines: 400, branches: 400, functions: 400 });`; `assert.deepEqual(codes(result), [metric === 'lines' ? 'LEDGER-LARGER-GAP' : 'LEDGER-LOST-COVERAGE']);`; `assert.deepEqual(codes(better), ['LEDGER-STALE']);`; `assert.deepEqual(better.stale, [{ kind: 'coverage', file: 'src/new.js' }]);`; `assert.deepEqual(codes(compareLedger({ ledger: ledgerWith(), current, adoptedFile: () => true })), ['LEDGER-NEW-COVERAGE-GAP']);` |
| `[gap-ledger-149] the gate records the ledger entry as stale for total differences without an adopt line` | `assert.deepEqual(codes(result), ['LEDGER-STALE']);`; `assert.deepEqual(result.stale, [{ kind: 'coverage', file: 'src/new.js' }]);` |
| `[gap-ledger-152] the gate records the ledger entry as stale for a content hash that differs from the ledger entry` | `assert.deepEqual(codes(result), ['LEDGER-STALE']);`; `assert.deepEqual(result.stale, [{ kind: 'coverage', file: 'src/new.js' }]);` |
| `[gap-ledger-153] the gate gives no total count exception for untrue or unloaded coverage` | `assert.deepEqual(codes(result), side === 'entry' ? ['LEDGER-STALE'] : [extra.untrue ? 'COVERAGE-FAKE' : 'LEDGER-UNLOADED']);`; `assert.deepEqual(result.stale, side === 'entry' ? [{ kind: 'coverage', file: 'src/new.js' }] : []);` |
| `[gap-ledger-154 gap-ledger-143] the ratchet command writes the current count for a smaller or equal not-covered count and the ledger entry count for a larger count, per metric` | `assert.deepEqual(current.coverage.get(file).totals, { lines: 401, branches: 401, functions: 401 });`; `assert.equal(next[metric], count === 11 ? 10 : count === 9 ? 9 : 10);`; `assert.equal(next.totals[metric], count === 11 ? 400 : 401);`; `assert.equal(next[other], 10);`; `assert.equal(next.totals[other], 401);`; `assert.deepEqual([next.lines, next.branches, next.functions], [10, 10, 9]);`; `assert.deepEqual(next.totals, { lines: 400, branches: 399, functions: 399 });` |
| `[gap-ledger-154] the ratchet command selects totals for a file that equals its adopted source` | `assert.deepEqual(larger.ledger.coverage[file].totals, { lines: 400, branches: 400, functions: 400 });`; `assert.deepEqual(equal.ledger.coverage[file].totals, { lines: 399, branches: 399, functions: 399 });`; `assert.deepEqual([smaller.ledger.coverage[file].lines, smaller.ledger.coverage[file].branches, smaller.ledger.coverage[file].functions], [9, 9, 9]);`; `assert.deepEqual(smaller.ledger.coverage[file].totals, { lines: 398, branches: 398, functions: 398 });` |
| `[gap-ledger-143] the ratchet command uses toleranceCounts for a file with base content that also equals its adopted source` | `assert.deepEqual([next.lines, next.branches, next.functions], [10, 11, 11]);`; `assert.deepEqual(next.totals, { lines: 401, branches: 401, functions: 401 });`; `assert.deepEqual(lower.totals, { lines: 399, branches: 400, functions: 400 });` |
| `[gap-ledger-155] the ratchet command writes current total counts when ledger total counts are absent` | `assert.deepEqual([next.lines, next.branches, next.functions], [10, 10, 10]);`; `assert.deepEqual(next.totals, { lines: 400, branches: 400, functions: 400 });` |
| `[gap-ledger-156] the ratchet command writes a ledger total count of zero for a larger count` | `assert.deepEqual([next.lines, next.branches, next.functions], [0, 0, 0]);`; `assert.deepEqual(next.totals, { lines: 0, branches: 0, functions: 0 });` |
| `[gap-ledger-136 gap-ledger-140 gap-ledger-144] the gate uses the adopted source in the check, ci and ratchet commands` | `assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);`; `assert.doesNotMatch(result.output, /ERROR GATES-RATCHET/);`; `assert.doesNotMatch(result.output, /ERROR LEDGER-(?:STALE&#124;LARGER-GAP&#124;LOST-COVERAGE)[^\n]*src\/merged\.js/);`; `assert.equal(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/merged.js'].branches, 0);` |
| `[gap-ledger-137] the gate gives no count tolerance to a file that differs from its adopted source` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-138] the gate uses no tolerance from the requirement Count tolerance for adopted files for an invalid adopt line` | `assert.match(result.output, /ERROR LEDGER-ADOPT-FROM src\/merged\.js/);`; `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-139] the gate gives no tolerance for an adopt line of another change` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-145] the gate gives no tolerance from the requirement Count tolerance for adopted files to an absent file with a valid adopt line` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-146] the gate gives no tolerance to a code file that no valid adopt line names` | `assert.equal(lines.length, 1);`; `assert.equal(lines[0].file, 'src/merged.test.mjs');`; `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-069] the gate applies count tolerance to a file with base content` | `assert.doesNotMatch(result.output, /ERROR LEDGER-(?:STALE&#124;LOST-COVERAGE)[^\n]*src\/legacy\.js/);`; `assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);` |
| `[gap-ledger-081] the gate applies the waived count to a file that differs from its adopted source` | `assert.doesNotMatch(result.output, /ERROR LEDGER-LARGER-GAP src\/merged\.js/);`; `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-147] the gate accepts total differences for a file with a valid adopt line in the check, ci and ratchet commands` | `assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);`; `assert.doesNotMatch(result.output, /ERROR LEDGER-(?:STALE&#124;LARGER-GAP&#124;LOST-COVERAGE)[^\n]*src\/merged\.js/);`; `assert.equal(JSON.parse(readFileSync(path.join(root, 'openspec/trace/gaps.json'), 'utf8')).coverage['src/merged.js'].totals.branches, 100);` |
| `[gap-ledger-149] the gate records the ledger entry as stale when no valid adopt line names the file` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-150] the gate ignores another change for total differences` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-151] the gate records the ledger entry as stale and reports LEDGER-ADOPT-FROM for an invalid from commit` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);`; `assert.match(result.output, /ERROR LEDGER-ADOPT-FROM src\/merged\.js/);` |
| `[gap-ledger-154] the ratchet command writes no larger count for a file that equals its adopted source` | `assert.notEqual(split, text);`; `assert.deepEqual([next.branches, next.totals.branches], [1, 100]);`; `assert.equal(next.lines, 0);`; `assert.deepEqual(written.map(line => [line.before, line.after]), [[1, 0]]);`; `assert.match(result.output, /Ratchet: \d+ history lines for sync\./);`; `assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);`; `assert.doesNotMatch(result.output, /ERROR LEDGER-(?:NOT-IN-BASE&#124;MORE-THAN-BASE)/, result.output);` |
```

#### Base clauses and QA

Command: rg -n 'tolerance conditions' openspec/specs/gap-ledger/spec.md.

The base clauses at lines 45, 68, 74, 118, 232 and 258 name scenarios 004, 078, 054, 008, 013 and 057.
The clauses at lines 268, 275, 287 and 294 name scenarios 069, 070, 072 and 073.
Scenario 071 does not use the term; its tolerance sizes do not change.
Scenario 074 names the base content restriction. Scenario 028 directs the ratchet command to write the larger branch count.

The exception clauses name all of these bounds. Base content still uses the base rules.

The scenario 154 mutation output has this QA line:

```text
QA: no script covers the capabilities of this change.
```

No project QA script changes. Each Pass 4 tool script has a QA purpose header.

#### Host commands and verdicts

All tool paths below start at /home/ianblenke/docker/gev-tools/vendored-tolerance/pass4.
Each host Node process uses taskset -c 0-3 nice -n 19. Each test process names one test file.
The host Node version is 26.8.2. No test uses an API absent from Node 24.14.0.

The first sandbox attempt at scenario 155 gives no individual test report. It gives no test verdict.
The direct host command before the code change reports the expected TypeError.

Command: taskset -c 0-3 nice -n 19 node --test-name-pattern=gap-ledger-155 src/tooling/spec/ledger.test.mjs.


```text
✖ [gap-ledger-155] the ratchet command writes current total counts when ledger total counts are absent
TypeError: Cannot read properties of undefined (reading 'lines')
```

The same host command after the guard change reports one test and one pass.
The test uses both absent totals and an empty totals object.
The guard writes the current gap total count for each absent metric.

Command: python pass4/run-checks.py named.

The scratch command first stops at a missing host dependency. That attempt gives no mutation verdict.
The repeated scratch command uses /home/ianblenke/docker/gev-work/node_modules.
The command output in named-guard.log reports scenario 155 as a failed test and shows the TypeError.
The command output in named-stop.log reports scenario 154 as a failed test at its literal written line count assertion.
The stopped fixture ratchet gives no comparison verdict.

Command: taskset -c 0-3 nice -n 19 node --import pass3/strict-host.mjs --test-name-pattern=gap-ledger-154 src/tooling/spec/gates.test.mjs.

The actual command uses the full path of pass3/strict-host.mjs.
The output in gate-green.log reports one test and one pass.
The test checks the LCOV replacement, the literal pair 1 and 100, and both positive command reports.

Command: taskset -c 0-3 nice -n 19 node --test-name-pattern=gap-ledger-156 src/tooling/spec/ledger.test.mjs.

The scratch tree uses the logical operator mutation for this command.
The output in zero-red.log reports scenario 156 as a failed test.
The mutation writes total counts of 400 instead of the literal total counts of 0.

Command: taskset -c 0-3 nice -n 19 node --test src/tooling/spec/ledger.test.mjs.

The output in ledger-final.log reports 105 tests, 105 passes and no failure.
The recorded pass 3 command reports 103 tests. Scenarios 155 and 156 add two tests.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/lib/ledger.mjs /tmp/vct4-raw-ledger.

The output in ledger-coverage-final.log reports the literal counts below.

```json
{"file":"scripts/spec/lib/ledger.mjs","processes":2,"counts":{"LF":837,"LH":837,"BRF":546,"BRH":546,"FNF":100,"FNH":100},"missingLines":[],"missingFunctions":[]}
```

The library has 100% line, branch and function coverage.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs gen --root . --files scripts/spec/lib/ledger.mjs --out pass4/all-mutants.json.

The actual command uses the full project root and full output path.
The generator output in automut-gen.log reports 5457 candidates.

Command: python pass4/automatic.py.

The runner selects the 14 candidates on the changed guard line. Comment changes supply no code mutations.
The first run kills 13 candidates. The logical operator mutation passes that run.

Scenario 156 then fails against that mutation and passes against the correct code.
The repeated campaign kills all 14 candidates with the full ledger test file. No candidate has an unresolved status.

The proof is proof-pass4.json. Automatic results and each actual command output are in the Pass 4 tools folder.

| Named mutation | Failed test |
| --- | --- |
| Remove the total count guard | gap-ledger-155 |
| Stop the ratchet command before it writes | gap-ledger-154 |
| Use logical OR instead of nullish fallback | gap-ledger-156 |

Command: cp -a /home/ianblenke/docker/gev-work/upstream-sync-3 /tmp/claude-1000/gcr/s3-replay4.

The scratch tree receives ledger.mjs and gates.mjs from the Pass 4 tree.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/claude-1000/gcr/s3-replay4 /tmp/claude-1000/gcr/pr18-art.

The output in replay.log has no stale coverage record for the four target files.
The untraced records and QA errors from the script copy give no project gate verdict.

| File | Stale coverage record |
| --- | --- |
| server/providers/mapillary/tiles.js | None |
| src/data/localGeojsonCore.js | None |
| src/keySetupCore.mjs | None |
| src/voice/turnMetrics.js | None |

#### Complete gate test reports

Command: python pass4/run-checks.py tests.
The ledger file completes. The full gate file attempt stops before a final report and gives no suite verdict.

Command: python pass4/exact.py.
Each Node process names only gates.test.mjs and one test title.
The command reads each verdict from Node output. It records 238 complete passes.
Tests at indexes 10 and 45 reach the time limit and give no verdict.

Command: python pass4/retry.py.
The command repeats those two titles, one at a time. Both output logs report one test, one pass and no cancellation.
The merged complete reports give the counts below. The gate file test count stays at 240.

```json
{
  "tests": 240,
  "pass": 240,
  "fail": 0,
  "complete": 240
}
```

The complete reports are exact-results.json and retry-results.json, with the actual Node output in each named log.
These files are tool records, not .gev-cache/spec/results.json.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct4-raw-gates.

The output in gate-coverage-complete.log reports the literal counts below.

```json
{"file": "scripts/spec/gates.mjs", "processes": 659, "counts": {"LF": 741, "LH": 741, "BRF": 387, "BRH": 387, "FNF": 91, "FNH": 91}, "missingLines": [], "missingFunctions": []}
```

The gate script has 100% line, branch and function coverage.
The progress coverage command has one uncovered branch; the complete reports cover that branch.
No code changes make that branch smaller or remove it.

#### Self-check and lead work

Command: python pass4/check-repeated-titles.py.

```json
{
  "live_titles": 345,
  "repeated_titles": 38,
  "stale_labels": [],
  "scope": "Current documents and Pass 4 evidence; past records stay unchanged."
}
```

Command: python pass4/check-words.py.

```json
{
  "command": "git diff --unified=0 25ba5d2d",
  "banned_word_forms": [],
  "scope": "Added document, test and code lines."
}
```

The word check includes prefixed forms on all added document, test and code lines.
The glossary has no blank row inside its table.
The comment at ledger.test.mjs:716 equals main. The diff against main has no comment change there.
Scenarios 155 and 156 have no match in the base specs, archive, ID registry or retired ID registry.

Command: python pass4/final-checks.py.

```text
Show JSON: vendored-coverage-tolerance
Change 'vendored-coverage-tolerance' is valid
Document headings: all five files match commit 25ba5d2d.
```

The show command prints JSON. The validate command accepts the active change.
The five documents have the same level two headings as commit 25ba5d2d.
The Pass 4 evidence block uses a level three heading so that the past level two headings do not change.

Command: taskset -c 0-3 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
The final lint output goes in lint-final.log.
The correction attempts that exceed paragraph or code span limits have no passed lint verdict.
The corrected prose passes the lint command before the commit.

The lead still runs the Node image ratchet command, image gates and both review agents.
This pass runs no image, archive, current-tree ratchet command, push or remote contribution command.
The host test reports give no Node image gate verdict.

The final count-selection title uses per metric to meet the 25-word sentence limit after the ledger entry correction.
The command logs and mutation proof record the title that existed for each actual run.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vendored-tolerance/pass4/check-test-titles.mjs.

The title lint checks each title that differs from main.

```json
{
  "titles": 28,
  "errors": [],
  "warnings": []
}
```

Command: taskset -c 0-3 nice -n 19 node --test src/tooling/spec/ledger.test.mjs.

The output in ledger-title-final.log reports 105 tests, 105 passes and no failure with the final title.

Command: taskset -c 0-3 nice -n 19 node --import pass3/strict-host.mjs --test-name-pattern=gap-ledger-154 src/tooling/spec/gates.test.mjs.

The actual command uses the full path of pass3/strict-host.mjs.
The output in gate-history-final.log reports one test, one pass and no failure.
The final fixture has a ledger line count of 1 before the ratchet command. The command must write the literal line count 0.
The test also asserts the actual history pair 1 and 0 for the coverage line record.
A stopped ratchet command leaves 1 and writes no history pair; the repeated named mutation fails this test.

The final gate reports consist of the 239 other complete tests and the final scenario 154 command above.
The total stays at 240 complete passes. Neither the gate code nor its coverage counts change.
