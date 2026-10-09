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

At Pass 4, tree read: parent commit 25ba5d2d1bce13b0aace29d49a7779043003493a with the Pass 4 corrections as edits.
The pre-review 2 reports read commit 975a62305917a83080c0433ec6ec0a67dfb65367.
The past records above stay as they were. The records below give the corrected titles, tags, words and line pointers.
At Pass 4, the two pre-review folders have no changes.

#### Past record corrections

At Pass 4, the repeated titles script is pass4/check-repeated-titles.py. The script checks current documents and this Pass 4 block.
Past records describe their recorded tree and do not supply current title or tag evidence.

The named mutation for scenario 155 removes the total count guard.
The named mutation for scenario 154 stops the ratchet command before it writes.
The origin of each selected count is the ledger entry or the current gap. Adopted source means only file content.

Pass 2 script commit means the script commit of the recorded pass 2 command.
The pass 3 tree means the tree of the recorded pass 3 command.
At that attempt the line pointers named the tree at code commit 04554050; they do not name the Pass 4 tree.
At the first pass 3 attempt, the red test for scenario 154 stops the work.

Row 35 is at evidence.md:595. Its correction is at evidence.md:467.
The historical row 41 correction concerns the title for scenario 153 at ledger.test.mjs:1606.
The count rule compares current counts with ledger entry counts and uses no time word.

#### Finding corrections

At Pass 4, each row below describes parent commit 25ba5d2d with the Pass 4 corrections as edits.

Command: python /home/ianblenke/docker/gev-tools/vendored-tolerance/pass4/corrections.py.

| Finding | Parent commit | First words | Correction | Search output |
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

At Pass 4, the final count-selection title uses per metric to meet the 25-word sentence limit after the ledger entry correction.
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

### Pass 5

Tree read: branch vendored-tolerance, parent commit `9357d762e05e802c1d74106354aba8b1e2ef6821`, with the Pass 5 corrections as edits.
The pre-review 3 reports read commit caa3075262e47e5f6daebc6b62c9358f368b9c4f.
All three pre-review folders stay as they were.
The code change contains comments only. Test 155 uses a different total count for each metric. Other test edits change titles only.

#### Finding corrections

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/evidence.py.
Each row names the tree above. Search output below comes from the current files.
The historical search output at Pass 4 keeps the add-demo command output. The output lines of the fixture change sync below correct that pointer.

| Finding | Parent commit | Correction | Search output |
| --- | --- | --- | --- |
| X1 / STE major 1 | 9357d762 | Name the total count exception in both clauses. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:126` |
| X2 / STE major 2 / Spec minor 7 | 9357d762 | Put both branch and function conditions before THEN. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:74` |
| X3 / STE major 3 / Spec minors 2 and 3 | 9357d762 | Name current totals of either size and the equal-count total fall. | `openspec/changes/vendored-coverage-tolerance/proposal.md:55` |
| X3 / Spec minor 3 | 9357d762 | Limit ledger entry selection to branches and functions. | `openspec/changes/vendored-coverage-tolerance/proposal.md:62` |
| X4 / STE major 4 | 9357d762 | Give valid adopt line one definition. | `openspec/changes/vendored-coverage-tolerance/design.md:73` |
| S1 / Spec major | 9357d762 | Record the order deviation without a task reorder. | `openspec/changes/vendored-coverage-tolerance/tasks.md:90` |
| S1 / Spec major | 9357d762 | Add the Known limit and the lead decision. | `openspec/changes/vendored-coverage-tolerance/proposal.md:73` |
| S2 / Spec minor 4 | 9357d762 | Name the closed-gap and open-gap code paths. | `openspec/changes/vendored-coverage-tolerance/proposal.md:67` |
| S2 / Spec minor 5 | 9357d762 | Show the sync test output at lines 2839 and 2840. | `src/tooling/spec/gates.test.mjs:2839` |
| S2 / Spec minor 6 | 9357d762 | Use a lines-only ledger total and three different current totals. | `src/tooling/spec/ledger.test.mjs:1673` |
| S2 / Spec minor 8 | 9357d762 | Give the result line an actor and a result. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:103` |
| S2 / Spec minor 9 | 9357d762 | Define content equality at the base commit. | `openspec/changes/vendored-coverage-tolerance/design.md:101` |
| S2 / Spec minor 9 | 9357d762 | Name the absent-file fixture limit. | `openspec/changes/vendored-coverage-tolerance/proposal.md:76` |
| S2 / Spec minor 10 | 9357d762 | Limit the base meanings to a file with base content. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:25` |
| S3 / STE title minors | 9357d762 | Correct all eight ledger titles. | `src/tooling/spec/ledger.test.mjs:1511` |
| S3 / STE title minors | 9357d762 | Correct all three gate titles. | `src/tooling/spec/gates.test.mjs:2689` |
| S3 / STE comment minors | 9357d762 | Make the function the actor. | `scripts/spec/lib/ledger.mjs:233` |
| S3 / STE comment minors | 9357d762 | Use tolerance as the allowed difference. | `scripts/spec/lib/ledger.mjs:401` |
| S3 / STE spec minors | 9357d762 | Name all four adopted-source conditions. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:11` |
| S3 / STE spec minors | 9357d762 | Name the gate and the count result. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:16` |
| S3 / STE spec minors | 9357d762 | Name the base sentence consistently. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:18` |
| S3 / STE spec minors | 9357d762 | Name both actors and the coverage loss errors. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:29` |
| S3 / STE spec minors | 9357d762 | Use the base tolerance conditions once. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:32` |
| S3 / STE spec minors | 9357d762 | Make the command the actor of each write. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:36` |
| S3 / STE spec minors | 9357d762 | Distinguish an absent value from zero. | `openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:42` |
| S3 / STE design minors | 9357d762 | Use limits for the adopted not-covered count. | `openspec/changes/vendored-coverage-tolerance/design.md:29` |
| S3 / STE design minors | 9357d762 | Make the function the actor of count selection. | `openspec/changes/vendored-coverage-tolerance/design.md:31` |
| S3 / STE design minors | 9357d762 | Define the base tolerance conditions. | `openspec/changes/vendored-coverage-tolerance/design.md:102` |
| S3 / STE design minors | 9357d762 | Name the base state not current. | `openspec/changes/vendored-coverage-tolerance/design.md:81` |
| S3 / STE design minors | 9357d762 | Use names in the glossary. | `openspec/changes/vendored-coverage-tolerance/design.md:70` |
| S3 / STE design minors | 9357d762 | Name the main commit. | `openspec/changes/vendored-coverage-tolerance/design.md:89` |
| S3 / STE design minors | 9357d762 | Name both operands and the selected counts. | `openspec/changes/vendored-coverage-tolerance/design.md:94` |
| S3 / STE proposal minors | 9357d762 | Name the tolerance and error rules. | `openspec/changes/vendored-coverage-tolerance/proposal.md:14` |
| S3 / STE proposal minors | 9357d762 | Name the allowed difference. | `openspec/changes/vendored-coverage-tolerance/proposal.md:31` |
| S3 / STE proposal minors | 9357d762 | Make the gate the actor. | `openspec/changes/vendored-coverage-tolerance/proposal.md:35` |
| S3 / STE proposal minors | 9357d762 | Use limit for the total difference. | `openspec/changes/vendored-coverage-tolerance/proposal.md:42` |
| S3 / STE proposal minors | 9357d762 | Name the gate. | `openspec/changes/vendored-coverage-tolerance/proposal.md:50` |
| S3 / STE proposal minors | 9357d762 | Name the required image command. | `openspec/changes/vendored-coverage-tolerance/proposal.md:53` |
| S3 / STE proposal minors | 9357d762 | Name the ledger entry of a tolerant file. | `openspec/changes/vendored-coverage-tolerance/proposal.md:66` |
| S3 / STE proposal minors | 9357d762 | Name the count difference and possible rise. | `openspec/changes/vendored-coverage-tolerance/proposal.md:69` |
| S3 / STE task minors | 9357d762 | Name the document titles and the live test titles. | `openspec/changes/vendored-coverage-tolerance/tasks.md:74` |
| S3 / STE evidence minors | 9357d762 | Give the row and correction separate pointers. | `openspec/changes/vendored-coverage-tolerance/evidence.md:906` |
| S3 / STE evidence minors | 9357d762 | Name the parent commit of the Pass 4 edits. | `openspec/changes/vendored-coverage-tolerance/evidence.md:887` |

Search output:

```text
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:126:This requirement gives the total count exception only to a file with a valid adopt line of the checked change and equal content hashes.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:74:- **AND** for branches and functions, a not-covered count is above the ledger entry count plus the tolerance
openspec/changes/vendored-coverage-tolerance/proposal.md:55:For a file that equals its adopted source and has no base content, neverWorseCounts selects the current total count.
openspec/changes/vendored-coverage-tolerance/proposal.md:62:For a file with base content, toleranceCounts selects ledger entry branch and function counts when the current covered count is smaller.
openspec/changes/vendored-coverage-tolerance/design.md:73:| valid adopt line | Adopt line that meets Adoption of merged code. |
openspec/changes/vendored-coverage-tolerance/tasks.md:90:Pass 4 wrote the test of gap-ledger-156 after the guard code; the mutation run showed the `||` mutant alive, and the test kills it; the red run is zero-red.log.
openspec/changes/vendored-coverage-tolerance/proposal.md:73:Origin spec-first, order deviation named; the lead accepts it by name in review.md.
openspec/changes/vendored-coverage-tolerance/proposal.md:67:See scripts/spec/lib/ledger.mjs:454 for the closed-gap path and :639-640 for an open smaller gap.
src/tooling/spec/gates.test.mjs:2839:    assert.match(result.output, /Ratchet: \d+ history lines for sync\./);
src/tooling/spec/ledger.test.mjs:1673:  const ledger = ledgerWith({ coverage: { [file]: LOADED(10, 10, 10, { totals: { lines: 500 } }) } });
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:103:- **AND** the ratchet command writes current counts for a metric with a current not-covered count at or below the ledger entry not-covered count
openspec/changes/vendored-coverage-tolerance/design.md:101:| file with base content | File with current content equal to its content at the base commit. |
openspec/changes/vendored-coverage-tolerance/proposal.md:76:The gate fixtures cover an absent file at the base commit.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:25:For a file with base content, these scenarios also have their base meanings:
src/tooling/spec/ledger.test.mjs:1511:test('[gap-ledger-137] the gate compares counts with no tolerance for a content hash that differs from the hash in the ledger entry', () => {
src/tooling/spec/ledger.test.mjs:1532:test('[gap-ledger-142] the gate reports an error for counts outside the tolerance', () => {
src/tooling/spec/ledger.test.mjs:1540:test('[gap-ledger-143] the ratchet command writes never-worse counts for a file that equals its adopted source and has no base content', () => {
src/tooling/spec/ledger.test.mjs:1588:test('[gap-ledger-149] the gate records the ledger entry as stale for total differences without a valid adopt line', () => {
src/tooling/spec/ledger.test.mjs:1597:test('[gap-ledger-152] the gate records the ledger entry as stale for a content hash that differs from the hash in the ledger entry', () => {
src/tooling/spec/ledger.test.mjs:1620:test('[gap-ledger-154 gap-ledger-143] the ratchet command writes current counts when the current not-covered count is at or below the ledger entry count and ledger entry counts otherwise', () => {
src/tooling/spec/ledger.test.mjs:1643:test('[gap-ledger-154] the ratchet command writes the total counts of a file that equals its adopted source and has no base content', () => {
src/tooling/spec/ledger.test.mjs:1655:test('[gap-ledger-143] the ratchet command uses toleranceCounts for a file with base content that also equals its adopted source', () => {
src/tooling/spec/ledger.test.mjs:1679:test('[gap-ledger-156] the ratchet command writes a ledger total count of zero for a larger current not-covered count', () => {
src/tooling/spec/gates.test.mjs:2689:test('[gap-ledger-138] the gate gives no tolerance from the requirement "Count tolerance for adopted files" for an invalid adopt line', () => {
src/tooling/spec/gates.test.mjs:2710:test('[gap-ledger-145] the gate gives no tolerance from the requirement "Count tolerance for adopted files" to an absent file with a valid adopt line', () => {
src/tooling/spec/gates.test.mjs:2816:test('[gap-ledger-154] the ratchet command writes no larger count for a file that equals its adopted source and has no base content', () => {
scripts/spec/lib/ledger.mjs:233: * For a metric, the function selects current counts when the current not-covered count is smaller than or equal to the ledger entry not-covered count.
scripts/spec/lib/ledger.mjs:401: * A file that the tolerance applies to has true loaded coverage and the hash of its ledger entry.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:11:The conditions on the content hash, the coverage, the adopt line and the file content are the adopted-source conditions.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:16:For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:18:The exception also extends the stale exception sentence of "Ratchet rule" to that file.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:24:For a file with base content, the stale exception sentence of "Ratchet rule" has its base meaning.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:124:This requirement is an exception to scenario gap-ledger-078 and to the stale exception sentence of the requirement "Ratchet rule".
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:29:The gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance" and report the coverage loss errors of that requirement.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:32:When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:36:For each metric, the ratchet command MUST write current counts.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:39:For a current not-covered count larger than the ledger entry not-covered count, the ratchet command MUST write ledger entry counts.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:42:If the total count is absent from the ledger entry for that metric, the ratchet command MUST write the current gap total count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:133:For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:42:If the total count is absent from the ledger entry for that metric, the ratchet command MUST write the current gap total count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:109:- **AND** the total count is absent from the ledger entry for that metric
openspec/changes/vendored-coverage-tolerance/design.md:29:An adopt line has no total counts. compareWithBase limits a ledger entry without base content by the not-covered counts in the adopt line.
openspec/changes/vendored-coverage-tolerance/design.md:31:neverWorseCounts selects the counts of each metric separately.
openspec/changes/vendored-coverage-tolerance/design.md:33:neverWorseCounts selects current counts when the current not-covered count is smaller than or equal to the ledger entry not-covered count.
openspec/changes/vendored-coverage-tolerance/design.md:35:neverWorseCounts selects ledger entry counts when the current not-covered count is larger than the ledger entry not-covered count.
openspec/changes/vendored-coverage-tolerance/design.md:37:If the ledger entry total count is absent, neverWorseCounts selects the current gap total count.
openspec/changes/vendored-coverage-tolerance/design.md:102:| tolerance conditions | Loaded file, true coverage, base content and equal ledger content hash, from the requirement Count tolerance. |
openspec/changes/vendored-coverage-tolerance/design.md:81:| stale | Ledger entry state that stops the build until the ratchet command runs. The base specs call it not current. |
openspec/changes/vendored-coverage-tolerance/design.md:70:| requirement titles | Labels: Count tolerance for adopted files names adopted-source conditions; Total counts for adopted files names a valid adopt line. |
openspec/changes/vendored-coverage-tolerance/design.md:89:| main commit e2437f94 | Main commit before this change. |
openspec/changes/vendored-coverage-tolerance/design.md:94:| never-worse counts | Current counts when the current not-covered count is smaller than or equal to the ledger entry not-covered count; otherwise, ledger entry counts. |
openspec/changes/vendored-coverage-tolerance/proposal.md:14:- Do not change the tolerance or the coverage error rules.
openspec/changes/vendored-coverage-tolerance/proposal.md:31:This tolerance can hide a real coverage loss within the tolerance.
openspec/changes/vendored-coverage-tolerance/proposal.md:35:The gate gives no count tolerance to a code file that a changed upstream test covers, unless that code file equals its adopted source.
openspec/changes/vendored-coverage-tolerance/proposal.md:42:The requirement "Total counts for adopted files" sets no limit on the size of a total difference.
openspec/changes/vendored-coverage-tolerance/proposal.md:50:The gate refuses the exception for untrue coverage.
openspec/changes/vendored-coverage-tolerance/proposal.md:53:The command `make gates CHANGE=vendored-coverage-tolerance` in the Node image on the upstream-sync-3 tree must supply the project verdict.
openspec/changes/vendored-coverage-tolerance/proposal.md:66:The gate never records the ledger entry of a tolerant file as stale for a smaller gap of any size.
openspec/changes/vendored-coverage-tolerance/proposal.md:69:A partial improvement leaves a difference between the ledger entry count and the current count.
openspec/changes/vendored-coverage-tolerance/tasks.md:74:- [x] Check each title that a document repeats against the live test titles with the repeated titles script.
openspec/changes/vendored-coverage-tolerance/tasks.md:98:- [x] Check each title that a document repeats against the live test titles.
openspec/changes/vendored-coverage-tolerance/evidence.md:906:Row 35 is at evidence.md:595. Its correction is at evidence.md:467.
openspec/changes/vendored-coverage-tolerance/evidence.md:887:At Pass 4, tree read: parent commit 25ba5d2d1bce13b0aace29d49a7779043003493a with the Pass 4 corrections as edits.
openspec/changes/vendored-coverage-tolerance/evidence.md:912:At Pass 4, each row below describes parent commit 25ba5d2d with the Pass 4 corrections as edits.
src/tooling/spec/gates.test.mjs:2839:    assert.match(result.output, /Ratchet: \d+ history lines for sync\./);
src/tooling/spec/gates.test.mjs:2840:    assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);
```

#### Total count question

No numeric total limit comes from compareWithBase or adoptedCovers for a file that equals its adopted source and has no base content.
At equal not-covered counts, lossOf gives zero loss when the total falls.
At smaller not-covered counts, lossOf gives the loss of the covered count.
compareCoverageEntry compares that loss with the tolerance for branches and functions.
The line comparison checks the not-covered line count, not the covered line count.

adoptedCovers checks each not-covered count against its adopted count and checks the untrue mark. It checks no total count.
compareWithBase checks the base and adopted not-covered counts, the untrue mark, the base hash, the history prefix and retired IDs.
For a file with base content, compareWithBase can reject a total change with no totals history line.
That check also needs changed covered counts and no reached adopted count. It sets no numeric total limit.

The ratchet command adds totals history lines when totals change.

The base-content arm uses toleranceCounts, which selects ledger entry branch and function counts when the current covered count is smaller.
The comparison is with the ledger entry covered count.
That arm selects the current total count for lines.
The adopted-source arm without base content uses neverWorseCounts. That function selects current totals at equal or smaller not-covered counts.

#### Order and fixture limits

Pass 4 wrote scenario 156 after the guard code. The test kills the `||` mutation in pass4/zero-red.log.
Tasks keep their recorded order. The order of gap-ledger-156 differs from spec-first. tasks.md and proposal.md name it.
The Known limit names the spec-first order deviation for the lead decision in review.md.

The gate fixtures cover a file absent at the base commit. They do not cover different current content for that condition.

#### Sentence and title checks

I read each changed spec, proposal and design sentence with its adjacent sentences and the code.
The exception clauses each have one subject. The count conditions precede THEN. The count results agree with the metric rules.
The term file with base content means content equality, not file presence.

Scenario 142 agrees with base gap-ledger-072 and compareCoverageEntry. Its test checks all three metric error codes.

The code keeps the base-content arm ahead of the adopted-source arm.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/check-verbs.py.
All 11 changed titles agree with their assertion calls. The table gives each title and all assertion calls from its body.

```text
| Test title | Body result assertions |
| --- | --- |
| `[gap-ledger-137] the gate compares counts with no tolerance for a content hash that differs from the hash in the ledger entry` | `assert.deepEqual(codes(compareLedger({ ledger, current, adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LARGER-GAP', 'LEDGER-LARGER-GAP']);` |
| `[gap-ledger-142] the gate reports an error for counts outside the tolerance` | `assert.deepEqual(codes(compareLedger({ ledger, current: gaps([loaded(file, 19, 19, 19, 'same', BIG)]), adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);`; `assert.deepEqual(codes(compareLedger({ ledger: small, current: gaps([loaded(file, 2, 2, 2, 'same', { lines: 24, branches: 24, functions: 24 })]), adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);` |
| `[gap-ledger-143] the ratchet command writes never-worse counts for a file that equals its adopted source and has no base content` | `assert.deepEqual(result.ledger.coverage[file], { sha: 'same', untrue: false, origin: 'pre-spec', since: '2026-01-01', loaded: true, lines: 10, branches: 10, functions: 10, totals: { lines: 400, branches: 400, functions: 400 } });`; `assert.deepEqual(result.history, []);`; `assert.equal(better.ledger.coverage[file].lines, 9);`; `assert.equal(better.ledger.coverage[file].branches, 9);`; `assert.equal(better.ledger.coverage[file].functions, 9);` |
| `[gap-ledger-149] the gate records the ledger entry as stale for total differences without a valid adopt line` | `assert.deepEqual(codes(result), ['LEDGER-STALE']);`; `assert.deepEqual(result.stale, [{ kind: 'coverage', file: 'src/new.js' }]);` |
| `[gap-ledger-152] the gate records the ledger entry as stale for a content hash that differs from the hash in the ledger entry` | `assert.deepEqual(codes(result), ['LEDGER-STALE']);`; `assert.deepEqual(result.stale, [{ kind: 'coverage', file: 'src/new.js' }]);` |
| `[gap-ledger-154 gap-ledger-143] the ratchet command writes current counts when the current not-covered count is at or below the ledger entry count and ledger entry counts otherwise` | `assert.deepEqual(current.coverage.get(file).totals, { lines: 401, branches: 401, functions: 401 });`; `assert.equal(next[metric], count === 11 ? 10 : count === 9 ? 9 : 10);`; `assert.equal(next.totals[metric], count === 11 ? 400 : 401);`; `assert.equal(next[other], 10);`; `assert.equal(next.totals[other], 401);`; `assert.deepEqual([next.lines, next.branches, next.functions], [10, 10, 9]);`; `assert.deepEqual(next.totals, { lines: 400, branches: 399, functions: 399 });` |
| `[gap-ledger-154] the ratchet command writes the total counts of a file that equals its adopted source and has no base content` | `assert.deepEqual(larger.ledger.coverage[file].totals, { lines: 400, branches: 400, functions: 400 });`; `assert.deepEqual(equal.ledger.coverage[file].totals, { lines: 399, branches: 399, functions: 399 });`; `assert.deepEqual([smaller.ledger.coverage[file].lines, smaller.ledger.coverage[file].branches, smaller.ledger.coverage[file].functions], [9, 9, 9]);`; `assert.deepEqual(smaller.ledger.coverage[file].totals, { lines: 398, branches: 398, functions: 398 });` |
| `[gap-ledger-156] the ratchet command writes a ledger total count of zero for a larger current not-covered count` | `assert.deepEqual([next.lines, next.branches, next.functions], [0, 0, 0]);`; `assert.deepEqual(next.totals, { lines: 0, branches: 0, functions: 0 });` |
| `[gap-ledger-138] the gate gives no tolerance from the requirement "Count tolerance for adopted files" for an invalid adopt line` | `assert.match(result.output, /ERROR LEDGER-ADOPT-FROM src\/merged\.js/);`; `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-145] the gate gives no tolerance from the requirement "Count tolerance for adopted files" to an absent file with a valid adopt line` | `assert.match(result.output, /ERROR LEDGER-STALE [^\n]+first: src\/merged\.js/);` |
| `[gap-ledger-154] the ratchet command writes no larger count for a file that equals its adopted source and has no base content` | `assert.notEqual(split, text);`; `assert.deepEqual([next.branches, next.totals.branches], [1, 100]);`; `assert.equal(next.lines, 0);`; `assert.deepEqual(written.map(line => [line.before, line.after]), [[1, 0]]);`; `assert.match(result.output, /Ratchet: \d+ history lines for sync\./);`; `assert.match(result.output, /Ledger: 0 entries do not match the current gaps\./);`; `assert.doesNotMatch(result.output, /ERROR LEDGER-(?:NOT-IN-BASE&#124;MORE-THAN-BASE)/, result.output);` |
```

#### Code search and named mutations

The search reads parent commit 9357d762 with the Pass 5 edits.

Command and search output:

```text
Command: rg -n 'no numeric|adoptedCovers|compareWithBase|METRICS.every|unchanged &&|totalsHistory|totalsAgreeOnCoverage|ceiling.reached' scripts/spec/lib/ledger.mjs
46:function totalsAgreeOnCoverage(entry, base) {
48:  return METRICS.every((metric) => {
170:  return Boolean(entry.totals) && METRICS.every((metric) => Number.isInteger(entry.totals[metric]));
179:    METRICS.every((metric) => entry[metric] === gap[metric])
201:  return METRICS.every((metric) => record[metric] <= waived(metric));
293:      METRICS.every((metric) => line[metric] === null || isCount(line[metric])) &&
358:function adoptedCovers(entry, counts) {
359:  return Boolean(counts) && METRICS.every((metric) => entry[metric] <= counts[metric]) && (!entry.untrue || counts.untrue);
448:      !entry.untrue && !gap.untrue && METRICS.every(metric => entry[metric] === gap[metric]);
502:export function compareWithBase({ ledger, baseLedger, retired, baseRetired, history, baseHistory, sameAsBase = () => false, change, adopted = new Map() }) {
515:  const totalsHistory = new Set(changeLines.filter((line) => line.metric === 'totals').map((line) => line.file));
523:      if (!waiversCover(file, entry, waivers, sameAsBase) && !adoptedCovers(entry, adoptedFor(file))) {
545:    if (unchanged && entry.sha !== base.sha) {
549:      unchanged &&
551:      !ceiling.reached &&
552:      !totalsHistory.has(file) &&
553:      !totalsAgreeOnCoverage(entry, base)
825:    if (METRICS.every(metric => entry[metric] === 0)) {
833:      if (!METRICS.every(metric => baselineMetric(current[metric], current.totals[metric], record[metric]))) return invalid();
```

Command and search output:

```text
Command: rg -n 'valid adopt lines of the checked change|An adopt line is valid' openspec/specs/gap-ledger/spec.md
388:The ledger command `adopt` MUST record the gaps of the files that a merge commit brought into the tree. The gates MUST allow a ledger entry above the base entry, up to the adopted count of each metric. The adopted count of a metric for a file is the largest count in its valid adopt lines, and 0 with no such line. A merged commit is a parent, other than the first parent, of a merge commit between the base commit and HEAD. An adopt line is valid when the scenarios `gap-ledger-095`, `gap-ledger-096` and `gap-ledger-097` do not reject it.
427:- **AND** the file has one or more valid adopt lines of the checked change
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/named.py.
The scratch tree uses parent commit 9357d762 and the Pass 5 test.
Both wrong metric keys fail scenario 155 before the green ledger run.
The wrong ledger key writes 500 for branches and functions. The wrong gap key writes 400 for branches and functions.
The assertions name 300 and 200.

```text
Command: taskset -c 0-3 nice -n 19 node --test --test-name-pattern=gap-ledger-155 src/tooling/spec/ledger.test.mjs
✖ [gap-ledger-155] the ratchet command writes current total counts when ledger total counts are absent (28.770539ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 445.786457

✖ failing tests:

test at src/tooling/spec/ledger.test.mjs:1665:1
✖ [gap-ledger-155] the ratchet command writes current total counts when ledger total counts are absent (28.770539ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

    {
  +   branches: 500,
  +   functions: 500,
  -   branches: 300,
  -   functions: 200,
      lines: 500
    }

      at TestContext.<anonymous> (file:///tmp/vct5-named/src/tooling/spec/ledger.test.mjs:1676:10)
      at Test.runInAsyncScope (node:async_hooks:226:14)
      at Test.run (node:internal/test_runner/test:1402:25)
      at Test.start (node:internal/test_runner/test:1262:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:387:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: { lines: 500, branches: 500, functions: 500 },
    expected: { lines: 500, branches: 300, functions: 200 },
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
```

```text
Command: taskset -c 0-3 nice -n 19 node --test --test-name-pattern=gap-ledger-155 src/tooling/spec/ledger.test.mjs
✖ [gap-ledger-155] the ratchet command writes current total counts when ledger total counts are absent (28.251017ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 448.406442

✖ failing tests:

test at src/tooling/spec/ledger.test.mjs:1665:1
✖ [gap-ledger-155] the ratchet command writes current total counts when ledger total counts are absent (28.251017ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

    {
  +   branches: 400,
  +   functions: 400,
  -   branches: 300,
  -   functions: 200,
      lines: 400
    }

      at TestContext.<anonymous> (file:///tmp/vct5-named/src/tooling/spec/ledger.test.mjs:1671:12)
      at Test.runInAsyncScope (node:async_hooks:226:14)
      at Test.run (node:internal/test_runner/test:1402:25)
      at Test.start (node:internal/test_runner/test:1262:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:387:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: { lines: 400, branches: 400, functions: 400 },
    expected: { lines: 400, branches: 300, functions: 200 },
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
```

The full ledger run reports 105 tests, 105 passes and no failed or cancelled test.

```text
Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/ledger.test.mjs
✔ [gap-ledger-156] the ratchet command writes a ledger total count of zero for a larger current not-covered count (1.392121ms)
ℹ tests 105
ℹ suites 0
ℹ pass 105
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1378.469191
```

#### Host checks

Tree read: parent commit 9357d762e05e802c1d74106354aba8b1e2ef6821 with the Pass 5 edits.
The host uses Node 26.8.2. The Pass 5 test edits add no node:test API.

The first sandbox attempts gave no per-test verdict. The host runs below supply complete ledger and named mutation reports.
The full gate file run stopped before the end after 689635 milliseconds. It supplies no gate test verdict.
The separate gate title runs supply the test reports.

```text
Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/gates.test.mjs

Interrupted while running:

⚠ src/tooling/spec/gates.test.mjs (src/tooling/spec/gates.test.mjs:1:1)
✖ src/tooling/spec/gates.test.mjs (689601.254627ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 0
ℹ cancelled 1
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 689635.270245

✖ failing tests:

test at src/tooling/spec/gates.test.mjs:1:1
✖ src/tooling/spec/gates.test.mjs (689601.254627ms)
  'Promise resolution is still pending but the event loop has already resolved'
```

The AST check finds no code change after it removes source offsets. The comment check reports no STE fault.

```text
Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/code-check.mjs
{
  "astEqual": true,
  "findings": []
}
```

The ledger coverage command reports 100% lines, branches and functions.

```text
Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/lib/ledger.mjs /tmp/vct5-raw-ledger
{"file":"scripts/spec/lib/ledger.mjs","processes":1,"counts":{"LF":837,"LH":837,"BRF":546,"BRH":546,"FNF":100,"FNH":100},"missingLines":[],"missingFunctions":[]}
```

The generator reports 5457 mutations across ledger.mjs. No candidate touches a changed comment line.

```text
Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs gen --root /home/ianblenke/docker/gev-work/vendored-tolerance --files scripts/spec/lib/ledger.mjs --out /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/all-mutants.json
5457 mutants
```

The changed-line selection reads git diff against parent commit 9357d762.

```json
{
  "generated": 5457,
  "changed_lines": [
    233,
    234,
    235,
    401,
    403
  ],
  "candidates": []
}
```

The CI replay has no stale coverage entry for any target file.
The 495 untraced entries come from the script approximations; they do not supply a project verdict.

```text
Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/claude-1000/gcr/s3-replay5 /tmp/claude-1000/gcr/pr18-art
```

```json
{
  "targets": {
    "server/providers/mapillary/tiles.js": false,
    "src/data/localGeojsonCore.js": false,
    "src/keySetupCore.mjs": false,
    "src/voice/turnMetrics.js": false
  },
  "coverage_stale": [],
  "untraced": 495
}
```

#### Complete gate reports and coverage

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/exact.py.
The command reports 237 complete passes. The runs at indexes 10, 45 and 52 stopped before the end and give no test verdict.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/retry.py.
The command repeats those three titles, one at a time. Each output reports one pass and no failed or cancelled test.

```text
Command: taskset -c 0-3 nice -n 19 node --test --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs '--test-name-pattern=^\[spec\-trace\-032\ spec\-trace\-036\ spec\-trace\-037\]\ stops\ for\ changed\ scenario\ text\ and\ a\ changed\ registry\ without\ a\ changed\ test$' src/tooling/spec/gates.test.mjs
✔ [spec-trace-032 spec-trace-036 spec-trace-037] stops for changed scenario text and a changed registry without a changed test (117052.434439ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 118732.445798
```

```text
Command: taskset -c 0-3 nice -n 19 node --test --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs '--test-name-pattern=^\[gap\-ledger\-089\ gap\-ledger\-091\]\ adopts\ the\ gaps\ of\ the\ merged\ files\ and\ gives\ no\ error\ in\ the\ ratchet\ command\ and\ in\ the\ check$' src/tooling/spec/gates.test.mjs
✔ [gap-ledger-089 gap-ledger-091] adopts the gaps of the merged files and gives no error in the ratchet command and in the check (77643.661141ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 78945.555177
```

```text
Command: taskset -c 0-3 nice -n 19 node --test --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs '--test-name-pattern=^\[gap\-ledger\-100\ gap\-ledger\-104\ gap\-ledger\-106\]\ The\ command\ and\ gate\ allow\ a\ reached\ file\ with\ the\ base\ content$' src/tooling/spec/gates.test.mjs
✔ [gap-ledger-100 gap-ledger-104 gap-ledger-106] The command and gate allow a reached file with the base content (40828.422266ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 41614.061429
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/summary.py.
The script reads all 240 verdicts from Node output and checks each command line and complete test count.
It does not read .gev-cache/spec/results.json.

```json
{
  "tests": 240,
  "pass": 240,
  "fail": 0,
  "complete": 240,
  "repeats": [
    10,
    45,
    52
  ]
}
```

The gate coverage command reports 100% lines, branches and functions.

```text
Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct5-raw-gates
{"file":"scripts/spec/gates.mjs","processes":737,"counts":{"LF":741,"LH":741,"BRF":387,"BRH":387,"FNF":91,"FNH":91},"missingLines":[],"missingFunctions":[]}
```

#### Final document checks

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/openspec.py.

```json
[
  {
    "command": "taskset -c 0-3 nice -n 19 openspec show vendored-coverage-tolerance --json",
    "exit": 0
  },
  {
    "command": "taskset -c 0-3 nice -n 19 openspec validate vendored-coverage-tolerance",
    "exit": 0
  }
]
```

```text
Show JSON: vendored-coverage-tolerance
Change 'vendored-coverage-tolerance' is valid
```

The show command writes the full JSON to pass5/show-final.json. The validate command accepts the active change.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/headings.py.
Level 2 headings agree in all five documents. Level 3 headings change in design.md, tasks.md and evidence.md.
Design changes Pass 4 words to Pass 5 words. Tasks and evidence each add Pass 5.
Proposal and spec headings agree at both levels.

```text
openspec/changes/vendored-coverage-tolerance/proposal.md: level 2: equal
openspec/changes/vendored-coverage-tolerance/proposal.md: level 3: equal
openspec/changes/vendored-coverage-tolerance/design.md: level 2: equal
openspec/changes/vendored-coverage-tolerance/design.md: level 3: changed
--- openspec/changes/vendored-coverage-tolerance/design.md parent 9357d762 level 3
+++ openspec/changes/vendored-coverage-tolerance/design.md current level 3
@@ -1,2 +1,2 @@
 ### Total count exception
-### Pass 4 words
+### Pass 5 words
openspec/changes/vendored-coverage-tolerance/tasks.md: level 2: equal
openspec/changes/vendored-coverage-tolerance/tasks.md: level 3: changed
--- openspec/changes/vendored-coverage-tolerance/tasks.md parent 9357d762 level 3
+++ openspec/changes/vendored-coverage-tolerance/tasks.md current level 3
@@ -1,2 +1,3 @@
 ### Pass 3
 ### Pass 4
+### Pass 5
openspec/changes/vendored-coverage-tolerance/evidence.md: level 2: equal
openspec/changes/vendored-coverage-tolerance/evidence.md: level 3: changed
--- openspec/changes/vendored-coverage-tolerance/evidence.md parent 9357d762 level 3
+++ openspec/changes/vendored-coverage-tolerance/evidence.md current level 3
@@ -10,3 +10,4 @@
 ### Final document checks
 ### Pass 3 continued
 ### Pass 4
+### Pass 5
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md: level 2: equal
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md: level 3: equal
```

The lead still runs the image commands and both review agents. This pass gives no image gate or review verdict.
This pass runs no archive, current-tree ratchet command, push or remote contribution command.

#### Final self-check

Tree read: parent commit 9357d762e05e802c1d74106354aba8b1e2ef6821 with the Pass 5 edits.
I read all changed spec, proposal and design sentences once more with their adjacent sentences.
The conditions and results agree with lossOf, compareCoverageEntry, neverWorseCounts, toleranceCounts and the totalsOnly arm.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/check-repeated-titles.py.

```json
{
  "live_titles": 345,
  "repeated_titles": 23,
  "stale_labels": [],
  "scope": "Current documents and Pass 5 evidence; past records stay unchanged."
}
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/check-words.py.

```json
{
  "command": "git diff --unified=0 9357d762",
  "banned_word_forms": [],
  "scope": "Added document, test and code lines."
}
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vendored-tolerance/pass5/check-test-titles.mjs.

```json
{
  "titles": 11,
  "errors": [],
  "warnings": []
}
```

Command: node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
The correction groups each have a passed lint run after their corrections.
The final records are lint-complete.log and lint-table.log. Both outputs report the line below.

```text
STE: 0 errors, 544 warnings.
```

The final lint command writes pass5/lint-final.log.
The headings diff writes pass5/headings-diff-final.log and gives the same level 2 and level 3 results above.
The Git diff check reports no whitespace fault. All three pre-review folders have no changed file.

### Pass 6

Tree read: commit `a20922f947fa4fb99fc9810d8f30072ae0181f0c`, with Pass 6 edits.


D1 restores the file scope of the three count rules. The spec defines never-worse counts once.
The adopted-source conditions need equal hashes. The path that writes a waived larger count (ledger.mjs:643) needs a changed hash, so a file with the adopted-source conditions cannot reach it.

D2 restores the checked change in the glossary rows. The term valid adopt line has one definition.

D3 cites compareLedger at lines 436, 449 and 454. These lines carry the open and closed gap decisions.

D4 removes the prose fence and names the mutation run. The task order stays as recorded.
The lead decides in review.md whether to accept the order by name.

D5 restores the Pass 4 table row and all its command fences from caa30752.

D6 states the covered-count limit per ratchet run and the not-covered count limit for each metric.
The tolerance applies to all three metrics through gapTolerance. Totals below 25 give zero tolerance.

D7 moves the other metric condition before THEN and changes four titles. Each clause has a body assertion.

D8 changes two comment lines only. D9 corrects the glossary rows and the lines that the search output below lists.

Past proof files and logs keep their recorded titles.
The search for the words "red" and "Historical record" found no prose fence in the current tasks.
A red test is a test run that fails before the code exists. zero-red.log records the run against the logical operator mutation.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass6/audit.py.
The output follows. The Pass 6 scope check assigned scope labels by line number. It did not extract scope words from the text.

```text
D5 fence differences:
D5 table row equal: True
Comment-only source equal: True
Test bodies equal: True
TITLE: [gap-ledger-142] the gate reports errors for counts outside the tolerance
assert.deepEqual(codes(compareLedger({ ledger, current: gaps([loaded(file, 19, 19, 19, 'same', BIG)]), adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);
assert.deepEqual(codes(compareLedger({ ledger: small, current: gaps([loaded(file, 2, 2, 2, 'same', { lines: 24, branches: 24, functions: 24 })]), adoptedAsIs: () => true })), ['LEDGER-LARGER-GAP', 'LEDGER-LOST-COVERAGE', 'LEDGER-LOST-COVERAGE']);
TITLE: [gap-ledger-154 gap-ledger-143] the ratchet command writes current counts when the current not-covered count is not above the ledger entry not-covered count and ledger entry counts if not
assert.deepEqual(current.coverage.get(file).totals, { lines: 401, branches: 401, functions: 401 });
assert.equal(next[metric], count === 11 ? 10 : count === 9 ? 9 : 10);
assert.equal(next.totals[metric], count === 11 ? 400 : 401);
assert.equal(next[other], 10);
assert.equal(next.totals[other], 401);
assert.deepEqual([next.lines, next.branches, next.functions], [10, 10, 9]);
assert.deepEqual(next.totals, { lines: 400, branches: 399, functions: 399 });
TITLE: [gap-ledger-155] the ratchet command writes current total counts for a file with no base content when ledger total counts are absent
assert.deepEqual([next.lines, next.branches, next.functions], [10, 10, 10]);
assert.deepEqual(next.totals, { lines: 400, branches: 300, functions: 200 });
assert.deepEqual([next.lines, next.branches, next.functions], [10, 10, 10]);
assert.deepEqual(next.totals, { lines: 500, branches: 300, functions: 200 });
TITLE: [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a larger current not-covered count
assert.deepEqual([next.lines, next.branches, next.functions], [0, 0, 0]);
assert.deepEqual(next.totals, { lines: 0, branches: 0, functions: 0 });
Scope check:
4: The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change. [scope: Count tolerance for adopted files; file of the checked change]
5: The content hash MUST equal the hash in the ledger entry. [scope: Count tolerance for adopted files; file of the checked change]
6: Both the ledger entry and the current gap MUST show true coverage from a test that loads the file. [scope: Count tolerance for adopted files; file of the checked change]
8: The file MUST have a valid adopt line of the checked change. [scope: Count tolerance for adopted files; file of the checked change]
9: The file content MUST equal its content at the `from` commit. [scope: Count tolerance for adopted files; file of the checked change]
29: The gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance" and report the coverage loss errors of that requirement. [scope: Count tolerance for adopted files; file of the checked change]
30: The gate MUST NOT record a ledger entry as stale for counts inside the tolerance. [scope: Count tolerance for adopted files; file of the checked change]
32: When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts. [scope: file with tolerance conditions; base content]
34: When a file has the adopted-source conditions and no base content, the ratchet command MUST use never-worse counts. [scope: file with adopted-source conditions and no base content]
37: For each metric of a file with the adopted-source conditions and no base content, the ratchet command MUST write current counts. [scope: file with adopted-source conditions and no base content]
41: For that file, when the current not-covered count is larger than the ledger entry not-covered count, the ratchet command MUST write ledger entry counts. [scope: file with adopted-source conditions and no base content]
43: For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count. [scope: file with adopted-source conditions and no base content]
121: The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change. [scope: total-only difference; valid adopt line of the checked change; equal hashes and not-covered counts; true loaded coverage]
122: The gate MUST NOT record the ledger entry as stale for that difference. [scope: total-only difference; valid adopt line of the checked change; equal hashes and not-covered counts; true loaded coverage]
123: Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions. [scope: total-only difference; valid adopt line of the checked change; equal hashes and not-covered counts; true loaded coverage]
124: Both the ledger entry and the current gap MUST have equal content hashes and true coverage from a test that loads the file. [scope: total-only difference; valid adopt line of the checked change; equal hashes and not-covered counts; true loaded coverage]
129: Both records MUST have true coverage from a test that loads the file. [scope: total-only difference; valid adopt line of the checked change; equal hashes and not-covered counts; true loaded coverage]
130: The ledger entry and current gap MUST also have equal not-covered counts of lines, branches and functions. [scope: total-only difference; valid adopt line of the checked change; equal hashes and not-covered counts; true loaded coverage]
134: This requirement MUST NOT extend count tolerance to a file that differs from its adopted source. [scope: file that differs from its adopted source]
135: For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source. [scope: file without base content that differs from its adopted source]
136: For a file that equals its adopted source, the ratchet command MUST apply the count rules of "Count tolerance for adopted files". [scope: file that equals its adopted source]
Repeated titles:
stale labels: 0
Banned forms in added prose:
0 hits
proposal.md level 2 equal
proposal.md level 3 equal
design.md level 2 equal
design.md level 3 equal
tasks.md level 2 equal
tasks.md level 3 equal
evidence.md level 2 equal
evidence.md level 3 changed
--- evidence.md parent a20922f9
+++ evidence.md current
@@ -11,3 +11,4 @@
 ### Pass 3 continued
 ### Pass 4
 ### Pass 5
+### Pass 6
spec.md level 2 equal
spec.md level 3 equal
```

The first lint run reports 26 words for the title that pre-review 4 proposed.
The title uses "not above" in place of "at or below". Both phrases mean smaller than or equal to.
The final title lint reports four titles and zero errors. The test bodies stay equal.
Scenario 154 names the metric with the larger count to remove the two possible antecedents of that metric.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass6/named.py.
proof-pass6.json records the code changes and the failed titles.
The past proof files stay as recorded.

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/ledger.test.mjs.
The final ledger output extract follows.

```text
✔ [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a larger current not-covered count (0.837689ms)
ℹ tests 105
ℹ suites 0
ℹ pass 105
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1039.123089
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/lib/ledger.mjs /tmp/vct6-raw-ledger.
The ledger coverage output follows. Equal hit and found counts give 100% lines, branches and functions.

```json
{"file":"scripts/spec/lib/ledger.mjs","processes":3,"counts":{"LF":837,"LH":837,"BRF":546,"BRH":546,"FNF":100,"FNH":100},"missingLines":[],"missingFunctions":[]}
```

The first sandbox ledger attempt reports only the file process. The attempt gives no individual test verdict.
The host commands above replace that attempt.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/claude-1000/gcr/s3-replay6 /tmp/claude-1000/gcr/pr18-art.
Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass6/replay-summary.py.
The replay summary follows. False means that the file has no stale coverage entry.
The untraced and QA output of the script copy gives no project gate verdict.

```json
{
  "targets": {
    "server/providers/mapillary/tiles.js": false,
    "src/data/localGeojsonCore.js": false,
    "src/keySetupCore.mjs": false,
    "src/voice/turnMetrics.js": false
  },
  "coverage_stale": [],
  "untraced": 495
}
```

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/gates.test.mjs.
The full gate file runs once to the end. The run gives a complete verdict.
The final output extract follows.

```text
✔ [gap-ledger-154] the ratchet command writes no larger count for a file that equals its adopted source and has no base content (1632.558093ms)
ℹ tests 240
ℹ suites 0
ℹ pass 240
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1003422.537754
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct6-raw-gates.
The gate coverage output follows. Equal hit and found counts give 100% lines, branches and functions.

```json
{"file":"scripts/spec/gates.mjs","processes":304,"counts":{"LF":741,"LH":741,"BRF":344,"BRH":344,"FNF":91,"FNH":91},"missingLines":[],"missingFunctions":[]}
```

Command: taskset -c 0-3 nice -n 19 openspec show vendored-coverage-tolerance --json.
The command returns valid JSON with id vendored-coverage-tolerance. The output file is pass6/show-end.json.
Command: taskset -c 0-3 nice -n 19 openspec validate vendored-coverage-tolerance.

```text
Change 'vendored-coverage-tolerance' is valid
```

The level 2 headings all agree with a20922f9.
At level 3, only evidence.md adds Pass 6. The other four files agree.

The repeated-title check includes the Pass 6 proof and gives zero stale labels.
The added-text word check gives zero banned forms. The four renamed titles have zero STE errors.
The code comparison after comment removal is equal. The test bodies are equal.

The final source diff has two comment lines and four title lines. The four pre-review folders have no changed file.
The final whitespace check has no error.
The host checks do not supply the image gate verdict. The lead runs the image gates and the reviews.

Search output: pass6/corrections-search-final.log.
The rg command reads the delta spec, proposal, design, tasks and ledger library.
The output names the live correction lines.

```text
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:4:The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:8:The file MUST have a valid adopt line of the checked change.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:14:For that file, gap-ledger-028 does not direct the ratchet command to write the larger count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:15:For that file, gap-ledger-073 does not direct the ratchet command to write ledger entry counts for a smaller covered count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:16:For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:19:For that file, the clauses in gap-ledger-004, gap-ledger-013 and gap-ledger-054 use the adopted-source conditions instead of the tolerance conditions.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:37:For each metric of a file with the adopted-source conditions and no base content, the ratchet command MUST write current counts.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:41:For that file, when the current not-covered count is larger than the ledger entry not-covered count, the ratchet command MUST write ledger entry counts.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:43:For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:74:- **AND** a not-covered line count is above the ledger entry count plus the tolerance
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:75:- **AND** for branches and functions, a not-covered count is above the ledger entry count plus the tolerance
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:102:- **AND** another metric has a current not-covered count at or below its ledger entry not-covered count
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:103:- **THEN** the ratchet command writes ledger entry counts for the metric with the larger current not-covered count
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:105:- **AND** the ratchet command writes current counts for that other metric
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:121:The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:128:This requirement gives the total count exception only to a file with a valid adopt line of the checked change and equal content hashes.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:140:- **WHEN** a file with a valid adopt line of the checked change differs from its adopted source
scripts/spec/lib/ledger.mjs:234: * If not, the function selects ledger entry counts.
scripts/spec/lib/ledger.mjs:235: * If the ledger entry total count is absent, the function selects the current gap total count.
scripts/spec/lib/ledger.mjs:410: * @param {object[]} [input.waivers] - Waiver lines for the checked change.
scripts/spec/lib/ledger.mjs:495: * @param {string} [input.change] - The checked change. A changed total count with a changed covered
scripts/spec/lib/ledger.mjs:497: * @param {Map<string, object>} [input.adopted] - The adopted counts of the checked change, from `adoptedCounts`.
scripts/spec/lib/ledger.mjs:610: * @param {object[]} [input.waivers] - Waiver lines for the checked change.
openspec/changes/vendored-coverage-tolerance/design.md:12:The gate reads adopt lines through adoptsOf for the checked change after the base history prefix.
openspec/changes/vendored-coverage-tolerance/design.md:30:compareWithBase limits the ledger entry of a file with no base content by the not-covered counts in the adopt line.
openspec/changes/vendored-coverage-tolerance/design.md:31:If the base ledger also has that file, compareWithBase uses the larger of the adopt count and the base count plus waived counts.
openspec/changes/vendored-coverage-tolerance/design.md:73:| title Total counts for adopted files | Adopted files means files with a valid adopt line of the checked change. |
openspec/changes/vendored-coverage-tolerance/design.md:74:| file with a valid adopt line | File that a valid adopt line of the checked change names, with any current content. |
openspec/changes/vendored-coverage-tolerance/design.md:77:| adopted-source conditions | Loaded file, true coverage, equal ledger content hash, and content equal to its adopted source through a valid adopt line of the checked change. |
openspec/changes/vendored-coverage-tolerance/design.md:100:| adoptedFile | Predicate for a file with a valid adopt line of the checked change. |
openspec/changes/vendored-coverage-tolerance/design.md:111:| adoptsOf | Function that selects adopt lines of the checked change. |
openspec/changes/vendored-coverage-tolerance/tasks.md:91:The lead decides in review.md whether to accept it by name.
openspec/changes/vendored-coverage-tolerance/tasks.md:126:- [x] Compare the level 2 and level 3 headings with parent commit 9357d762.
openspec/changes/vendored-coverage-tolerance/proposal.md:5:A file that the fork edits can also have different total counts and equal not-covered counts.
openspec/changes/vendored-coverage-tolerance/proposal.md:60:For branches and functions, when the not-covered count falls, the covered count can fall by at most the tolerance per ratchet run.
openspec/changes/vendored-coverage-tolerance/proposal.md:62:When the ratchet command writes a lower total for that file, the next check starts from that total.
openspec/changes/vendored-coverage-tolerance/proposal.md:70:See scripts/spec/lib/ledger.mjs:454 for the closed-gap path and :436 and :449 for an open smaller gap.
openspec/changes/vendored-coverage-tolerance/proposal.md:73:For each metric, the not-covered count can then rise to the ledger entry count plus the tolerance with no error.
openspec/changes/vendored-coverage-tolerance/proposal.md:76:This order differs from spec-first. The lead decides in review.md whether to accept it by name.
```

Command: taskset -c 0-3 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
The final lint output extract follows.

```text
STE: 0 errors, 545 warnings.
```

### Pass 7

Tree read: commit `fa34f8cb28d4cd31cbca72771ddc5796424f4533`, with Pass 7 edits.

G1 restores the metric scope next to the file scope. Each count rule uses a named metric and two counts.

G2 names the metric and its ledger entry not-covered count in scenario 154. Scenarios 155 and 156 name their metric before THEN.

G3 adds the absent-total case to never-worse counts. The glossary defines the three count noun groups.
The Known limits name the accepted title for gap-ledger-143 and gap-ledger-154.

G4 names the two numbers of the base limit. The second number is the base count plus the waived count.

G5 adds file scope to the tolerance rules and corrects the Pass 6 scope record.
The Pass 6 script assigned labels by line number. The Pass 7 script extracts words from the text.
At Pass 7, the proposal and tasks cite proof-pass6.json for mutation gap-ledger-156. The tasks record D1 through D9 and this pass.

G6 corrects the listed prose and the title for gap-ledger-156. The test body stays as it was.

I read these corrections against ledger.mjs:62-68, 188, 217-246, 374, 389-394, 413-454, 523-563 and 639-651.
I also read scenarios 136-146 and 154-156, the test loop for 143 and 154, and the test bodies for 155 and 156.

neverWorseCounts decides each metric separately. If a total is absent, neverWorseCounts selects the current gap total count. A total of zero is not absent.

compareWithBase uses the larger of the adopted count and the sum of the base count and the waived count.
The optional predicates change the scope of compareLedger. They change which files get the tolerance and the stale exception. They do not change the conditions of a coverage error.

For lines, the not-covered count decides. For branches and functions with equal hashes, lossOf supplies the covered-count rule.

The first lint run reports four sentence errors. The next run reports one paragraph error.
I split the sentences and the paragraph without a rule change. The next lint run reports zero errors.

The sandbox ledger attempt reports only the file process. The attempt gives no individual test verdict.
The host ledger run below supplies the individual results.

The scope check flags each MUST without a direct file word and prints the file scope from the text around it.
The four flagged lines use that text scope. No count comparison lacks a named metric.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/scope-check.py.

```text
Requirement: Count tolerance for adopted files
4: MUST The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
  words: file
  file scope (direct): The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
5: MUST The content hash MUST equal the hash in the ledger entry.
  words: ledger entry
  file scope (text context): The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
  FLAG line 5: no direct file scope word; file scope comes from text context above.
6: MUST Both the ledger entry and the current gap MUST show true coverage from a test that loads the file.
  words: ledger entry, file
  file scope (direct): Both the ledger entry and the current gap MUST show true coverage from a test that loads the file.
8: MUST The file MUST have a valid adopt line of the checked change.
  words: file
  file scope (direct): The file MUST have a valid adopt line of the checked change.
9: MUST The file content MUST equal its content at the `from` commit.
  words: file
  file scope (direct): The file content MUST equal its content at the `from` commit.
29: MUST For a file with the adopted-source conditions, the gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance".
  words: file, adopted-source conditions
  file scope (direct): For a file with the adopted-source conditions, the gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance".
30: MUST For that file, the gate and the ratchet command MUST report the coverage loss errors of that requirement.
  words: file
  file scope (direct): For that file, the gate and the ratchet command MUST report the coverage loss errors of that requirement.
31: MUST For that file, the gate MUST NOT record the ledger entry as stale for counts inside the tolerance.
  words: file, ledger entry
  file scope (direct): For that file, the gate MUST NOT record the ledger entry as stale for counts inside the tolerance.
33: MUST When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts.
  words: file
  file scope (direct): When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts.
35: MUST When a file has the adopted-source conditions and no base content, the ratchet command MUST use never-worse counts.
  words: file, adopted-source conditions
  file scope (direct): When a file has the adopted-source conditions and no base content, the ratchet command MUST use never-worse counts.
38: MUST For each metric of a file with the adopted-source conditions and no base content, the ratchet command MUST write current counts.
  words: metric, file, adopted-source conditions, ledger entry
  file scope (direct): For each metric of a file with the adopted-source conditions and no base content, the ratchet command MUST write current counts.
  metric scope: metric
42: MUST For that file, the ratchet command MUST write ledger entry counts for a metric.
  words: file, ledger entry, metric
  file scope (direct): For that file, the ratchet command MUST write ledger entry counts for a metric.
  metric scope: metric
45: MUST For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count instead.
  words: file, metric, ledger entry
  file scope (direct): For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count instead.
Requirement: Total counts for adopted files
123: MUST The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
  words: file
  file scope (direct): The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
124: MUST The gate MUST NOT record the ledger entry as stale for that difference.
  words: ledger entry
  file scope (text context): The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
  FLAG line 124: no direct file scope word; file scope comes from text context above.
125: MUST Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
  words: ledger entry
  file scope (text context): The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
  FLAG line 125: no direct file scope word; file scope comes from text context above.
  metric scope: lines, branches and functions
126: MUST Both the ledger entry and the current gap MUST have equal content hashes and true coverage from a test that loads the file.
  words: ledger entry, file
  file scope (direct): Both the ledger entry and the current gap MUST have equal content hashes and true coverage from a test that loads the file.
131: MUST Both records MUST have true coverage from a test that loads the file.
  words: file
  file scope (direct): Both records MUST have true coverage from a test that loads the file.
132: MUST The ledger entry and current gap MUST also have equal not-covered counts of lines, branches and functions.
  words: ledger entry, file
  file scope (text context): Both records MUST have true coverage from a test that loads the file.
  FLAG line 132: no direct file scope word; file scope comes from text context above.
  metric scope: lines, branches and functions
136: MUST This requirement MUST NOT extend count tolerance to a file that differs from its adopted source.
  words: file
  file scope (direct): This requirement MUST NOT extend count tolerance to a file that differs from its adopted source.
137: MUST For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source.
  words: file
  file scope (direct): For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source.
138: MUST For a file that equals its adopted source, the ratchet command MUST apply the count rules of "Count tolerance for adopted files".
  words: file
  file scope (direct): For a file that equals its adopted source, the ratchet command MUST apply the count rules of "Count tolerance for adopted files".
MUST rules: 22; direct file scope flags: 4; unresolved flags: 0
Direct file scope flag lines: 5, 124, 125, 132
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/audit.py.

```text
Tree read: fa34f8cb28d4cd31cbca72771ddc5796424f4533 with Pass 7 edits
Test bodies equal: True
TITLE: [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count
Words: 24
assert.deepEqual([next.lines, next.branches, next.functions], [0, 0, 0]);
assert.deepEqual(next.totals, { lines: 0, branches: 0, functions: 0 });
File scope: adoptedAsIs true; sameAsBase default false.
Repeated titles:
stale labels: 0
proposal.md level 2 equal
proposal.md level 3 equal
design.md level 2 equal
design.md level 3 changed
--- design.md fa34f8cb
+++ design.md Pass 7
@@ -1,2 +1,3 @@
 ### Total count exception
 ### Pass 5 words
+### Pass 7 words
tasks.md level 2 equal
tasks.md level 3 changed
--- tasks.md fa34f8cb
+++ tasks.md Pass 7
@@ -1,3 +1,5 @@
 ### Pass 3
 ### Pass 4
 ### Pass 5
+### Pass 6
+### Pass 7
evidence.md level 2 equal
evidence.md level 3 changed
--- evidence.md fa34f8cb
+++ evidence.md Pass 7
@@ -12,3 +12,4 @@
 ### Pass 4
 ### Pass 5
 ### Pass 6
+### Pass 7
spec.md level 2 equal
spec.md level 3 equal
Past command fences equal: True
diff --git a/src/tooling/spec/ledger.test.mjs b/src/tooling/spec/ledger.test.mjs
index e06f76d4..d884e7e3 100644
--- a/src/tooling/spec/ledger.test.mjs
+++ b/src/tooling/spec/ledger.test.mjs
@@ -1679 +1679 @@ test('[gap-ledger-155] the ratchet command writes current total counts for a fil
-test('[gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a larger current not-covered count', () => {
+test('[gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count', () => {
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/check-words.py.

```json
{
  "command": "git diff --unified=0 fa34f8cb",
  "banned_word_forms": [],
  "scope": "Added document, test and code lines."
}
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/search.py.

```text
Command: rg -n "For a file with the adopted-source conditions|For that file|of that metric|Never-worse counts|larger of two numbers|These numbers|never-worse counts \||adopted count \||base count \||ledger entry not-covered count,|error rules of|current gap total count|For lines, the not-covered|For branches and functions, the covered|proof-pass6.json|title of the test|scope labels by line number|pre-review 4 proposed|attempt gives|run gives|term valid adopt line|search output below lists|red test is|### Pass [67]" openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md openspec/changes/vendored-coverage-tolerance/design.md openspec/changes/vendored-coverage-tolerance/proposal.md openspec/changes/vendored-coverage-tolerance/tasks.md openspec/changes/vendored-coverage-tolerance/evidence.md
openspec/changes/vendored-coverage-tolerance/proposal.md:56:For a file that equals its adopted source and has no base content, neverWorseCounts selects the current gap total count.
openspec/changes/vendored-coverage-tolerance/proposal.md:58:The current gap total count can be larger or smaller than the ledger entry total count.
openspec/changes/vendored-coverage-tolerance/proposal.md:60:This applies when the current gap total count is smaller than the ledger entry total count.
openspec/changes/vendored-coverage-tolerance/proposal.md:74:For lines, the not-covered count can then rise to the ledger entry not-covered count plus the tolerance with no error.
openspec/changes/vendored-coverage-tolerance/proposal.md:75:For branches and functions, the covered count decides, as the lines above state.
openspec/changes/vendored-coverage-tolerance/proposal.md:79:The test fails when the code has the `||` mutation; proof-pass6.json records that run for mutation gap-ledger-156.
openspec/changes/vendored-coverage-tolerance/proposal.md:84:The title of the test for gap-ledger-143 and gap-ledger-154 uses the words not above in place of smaller than or equal to.
openspec/changes/vendored-coverage-tolerance/evidence.md:759:The first automatic mutation attempt stops at its empty baseline. That attempt gives no mutation verdict.
openspec/changes/vendored-coverage-tolerance/evidence.md:945:| STE minor 14 | 25ba5d2d | never-worse counts | Define counts, rather than an instruction. | `openspec/changes/vendored-coverage-tolerance/design.md:94` |
openspec/changes/vendored-coverage-tolerance/evidence.md:996:STE minor 3: openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:38: For a current not-covered count larger than the ledger entry not-covered count, never-worse counts MUST write ledger entry counts.
openspec/changes/vendored-coverage-tolerance/evidence.md:1007:STE minor 14: openspec/changes/vendored-coverage-tolerance/design.md:94: | never-worse counts | Counts that use current counts when the current not-covered count does not exceed the ledger entry not-covered count; otherwise, ledger entry counts. |
openspec/changes/vendored-coverage-tolerance/evidence.md:1121:The guard writes the current gap total count for each absent metric.
openspec/changes/vendored-coverage-tolerance/evidence.md:1125:The scratch command first stops at a missing host dependency. That attempt gives no mutation verdict.
openspec/changes/vendored-coverage-tolerance/evidence.md:1403:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:16:For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.
openspec/changes/vendored-coverage-tolerance/evidence.md:1410:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:39:For a current not-covered count larger than the ledger entry not-covered count, the ratchet command MUST write ledger entry counts.
openspec/changes/vendored-coverage-tolerance/evidence.md:1411:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:42:If the total count is absent from the ledger entry for that metric, the ratchet command MUST write the current gap total count.
openspec/changes/vendored-coverage-tolerance/evidence.md:1413:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:42:If the total count is absent from the ledger entry for that metric, the ratchet command MUST write the current gap total count.
openspec/changes/vendored-coverage-tolerance/evidence.md:1419:openspec/changes/vendored-coverage-tolerance/design.md:37:If the ledger entry total count is absent, neverWorseCounts selects the current gap total count.
openspec/changes/vendored-coverage-tolerance/evidence.md:1424:openspec/changes/vendored-coverage-tolerance/design.md:94:| never-worse counts | Current counts when the current not-covered count is smaller than or equal to the ledger entry not-covered count; otherwise, ledger entry counts. |
openspec/changes/vendored-coverage-tolerance/evidence.md:1916:### Pass 6
openspec/changes/vendored-coverage-tolerance/evidence.md:1924:D2 restores the checked change in the glossary rows. The term valid adopt line has one definition.
openspec/changes/vendored-coverage-tolerance/evidence.md:1938:D8 changes two comment lines only. D9 corrects the glossary rows and the lines that the search output below lists.
openspec/changes/vendored-coverage-tolerance/evidence.md:1942:A red test is a test run that fails before the code exists. zero-red.log records the run against the logical operator mutation.
openspec/changes/vendored-coverage-tolerance/evidence.md:1945:The output follows. The Pass 6 scope check assigned scope labels by line number. It did not extract scope words from the text.
openspec/changes/vendored-coverage-tolerance/evidence.md:1982:41: For that file, when the current not-covered count is larger than the ledger entry not-covered count, the ratchet command MUST write ledger entry counts. [scope: file with adopted-source conditions and no base content]
openspec/changes/vendored-coverage-tolerance/evidence.md:1983:43: For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count. [scope: file with adopted-source conditions and no base content]
openspec/changes/vendored-coverage-tolerance/evidence.md:2011:+### Pass 6
openspec/changes/vendored-coverage-tolerance/evidence.md:2016:The first lint run reports 26 words for the title that pre-review 4 proposed.
openspec/changes/vendored-coverage-tolerance/evidence.md:2019:Scenario 154 names the metric with the larger count to remove the two possible antecedents of that metric.
openspec/changes/vendored-coverage-tolerance/evidence.md:2022:The four mutations fail the four renamed tests. proof-pass6.json records the code changes and the failed titles.
openspec/changes/vendored-coverage-tolerance/evidence.md:2047:The first sandbox ledger attempt reports only the file process. The attempt gives no individual test verdict.
openspec/changes/vendored-coverage-tolerance/evidence.md:2069:The full gate file runs once to the end. The run gives a complete verdict.
openspec/changes/vendored-coverage-tolerance/evidence.md:2117:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:14:For that file, gap-ledger-028 does not direct the ratchet command to write the larger count.
openspec/changes/vendored-coverage-tolerance/evidence.md:2118:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:15:For that file, gap-ledger-073 does not direct the ratchet command to write ledger entry counts for a smaller covered count.
openspec/changes/vendored-coverage-tolerance/evidence.md:2119:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:16:For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.
openspec/changes/vendored-coverage-tolerance/evidence.md:2120:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:19:For that file, the clauses in gap-ledger-004, gap-ledger-013 and gap-ledger-054 use the adopted-source conditions instead of the tolerance conditions.
openspec/changes/vendored-coverage-tolerance/evidence.md:2122:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:41:For that file, when the current not-covered count is larger than the ledger entry not-covered count, the ratchet command MUST write ledger entry counts.
openspec/changes/vendored-coverage-tolerance/evidence.md:2123:openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:43:For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count.
openspec/changes/vendored-coverage-tolerance/evidence.md:2133:scripts/spec/lib/ledger.mjs:235: * If the ledger entry total count is absent, the function selects the current gap total count.
openspec/changes/vendored-coverage-tolerance/design.md:28:For a file with the adopted-source conditions and no base content, the ratchet command uses neverWorseCounts.
openspec/changes/vendored-coverage-tolerance/design.md:31:If the base ledger also has that file, the limit is the larger of two numbers.
openspec/changes/vendored-coverage-tolerance/design.md:32:These numbers are the adopted count, and the base count plus the waived count.
openspec/changes/vendored-coverage-tolerance/design.md:41:If the ledger entry total count is absent, neverWorseCounts selects the current gap total count.
openspec/changes/vendored-coverage-tolerance/design.md:42:This change leaves the error rules of compareLedger, compareWithBase and toleranceOf as they are.
openspec/changes/vendored-coverage-tolerance/design.md:99:| never-worse counts | Current counts for a current not-covered count smaller than or equal to the ledger entry not-covered count. Ledger entry counts if not. The current gap total count if the ledger entry total count is absent. |
openspec/changes/vendored-coverage-tolerance/design.md:136:### Pass 7 words
openspec/changes/vendored-coverage-tolerance/design.md:140:| adopted count | Largest not-covered count of a metric for a file in its valid adopt lines. Zero with no such line. |
openspec/changes/vendored-coverage-tolerance/design.md:141:| base count | Not-covered count of a metric for a file in the base ledger. |
openspec/changes/vendored-coverage-tolerance/design.md:142:| ledger entry not-covered count, ledger entry total count, current gap total count | The not-covered count or the total count of a ledger entry, or of the current gap. |
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:14:For that file, gap-ledger-028 does not direct the ratchet command to write the larger count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:15:For that file, gap-ledger-073 does not direct the ratchet command to write ledger entry counts for a smaller covered count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:16:For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:19:For that file, the clauses in gap-ledger-004, gap-ledger-013 and gap-ledger-054 use the adopted-source conditions instead of the tolerance conditions.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:29:For a file with the adopted-source conditions, the gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance".
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:30:For that file, the gate and the ratchet command MUST report the coverage loss errors of that requirement.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:31:For that file, the gate MUST NOT record the ledger entry as stale for counts inside the tolerance.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:37:Never-worse counts are the counts that the next three rules direct the ratchet command to write.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:39:This applies when the current not-covered count of that metric is smaller than or equal to the ledger entry not-covered count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:42:For that file, the ratchet command MUST write ledger entry counts for a metric.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:43:This applies when the current not-covered count of that metric is larger than the ledger entry not-covered count.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:45:For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count instead.
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:113:- **AND** the ledger entry total count of that metric is absent
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:114:- **THEN** the ratchet command writes the ledger entry not-covered count and the current gap total count
openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:119:- **AND** the ledger entry total count of that metric is zero
openspec/changes/vendored-coverage-tolerance/tasks.md:89:The test fails with that mutation; proof-pass6.json records that run for mutation gap-ledger-156.
openspec/changes/vendored-coverage-tolerance/tasks.md:130:### Pass 6
openspec/changes/vendored-coverage-tolerance/tasks.md:142:### Pass 7
```

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/ledger.test.mjs.

```text
✔ [gap-ledger-154] the ratchet command writes the total counts of a file that equals its adopted source and has no base content (2.069547ms)
✔ [gap-ledger-143] the ratchet command uses toleranceCounts for a file with base content that also equals its adopted source (1.437186ms)
✔ [gap-ledger-155] the ratchet command writes current total counts for a file with no base content when ledger total counts are absent (1.75693ms)
✔ [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count (0.903282ms)
ℹ tests 105
ℹ suites 0
ℹ pass 105
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 938.573159
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/lib/ledger.mjs /tmp/vct7-raw-ledger.

```json
{"file":"scripts/spec/lib/ledger.mjs","processes":2,"counts":{"LF":837,"LH":837,"BRF":546,"BRH":546,"FNF":100,"FNH":100},"missingLines":[],"missingFunctions":[]}
```

Equal hit and found counts give 100% line, branch and function coverage of ledger.mjs.


Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/named.py.
The mutation replaces `??` with `||` in neverWorseCounts in a scratch root.
The mutation makes the test for gap-ledger-156 fail: the actual totals are 400, but the test expects zero for each metric.
proof-pass7.json records the live title and exit 1. gap-ledger-156-mutation.log records the command and its output.

The first proof script attempt counted the same failed title twice. I corrected the parser and repeated the mutation run.

```text
Command: taskset -c 0-3 nice -n 19 node --test --test-name-pattern=gap-ledger-156 src/tooling/spec/ledger.test.mjs
✖ [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count (28.66537ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 464.454095

✖ failing tests:

test at src/tooling/spec/ledger.test.mjs:1679:1
✖ [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count (28.66537ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected
    {
  +   branches: 400,
  +   functions: 400,
  +   lines: 400
  -   branches: 0,
  -   functions: 0,
  -   lines: 0
    }
      at TestContext.<anonymous> (file:///tmp/vct7-named/src/tooling/spec/ledger.test.mjs:1684:10)
      at Test.runInAsyncScope (node:async_hooks:226:14)
      at Test.run (node:internal/test_runner/test:1402:25)
      at Test.start (node:internal/test_runner/test:1262:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:387:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: { lines: 400, branches: 400, functions: 400 },
    expected: { lines: 0, branches: 0, functions: 0 },
    operator: 'deepStrictEqual',
    diff: 'simple'
  }
```


Command: node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
These extracts record the text correction groups and their lint corrections.
Each log starts with the command above.

```text
lint-docs.log: STE: 4 errors, 544 warnings.
lint-docs2.log: STE: 1 errors, 544 warnings.
lint-docs3.log: STE: 0 errors, 544 warnings.
lint-title.log: STE: 0 errors, 544 warnings.
lint-evidence.log: STE: 3 errors, 545 warnings.
lint-evidence2.log: STE: 0 errors, 545 warnings.
lint-format.log: STE: 0 errors, 545 warnings.
lint-mutation.log: STE: 1 errors, 545 warnings.
lint-mutation2.log: STE: 0 errors, 545 warnings.
```


The stale-check script uses a scratch root from upstream-sync-3 commit `d09e034b9c751ebe286e2f5f32773db1af48c0a3`.
I copied ledger.mjs and gates.mjs from commit fa34f8cb into that root. These code files have no Pass 7 change.

Command: cp -a --reflink=auto /home/ianblenke/docker/gev-work/upstream-sync-3 /tmp/claude-1000/gcr/s3-replay7.
Command: cp scripts/spec/lib/ledger.mjs /tmp/claude-1000/gcr/s3-replay7/scripts/spec/lib/ledger.mjs.
Command: cp scripts/spec/gates.mjs /tmp/claude-1000/gcr/s3-replay7/scripts/spec/gates.mjs.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/claude-1000/gcr/s3-replay7 /tmp/claude-1000/gcr/pr18-art.
Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/replay-summary.py.
The stale-check script ended with exit zero. The summary script reads the stale records from the output of the stale-check script.
False means that the file has no stale coverage entry. The script copy gives no project gate verdict.

```json
{
  "targets": {
    "server/providers/mapillary/tiles.js": false,
    "src/data/localGeojsonCore.js": false,
    "src/keySetupCore.mjs": false,
    "src/voice/turnMetrics.js": false
  },
  "coverage_stale": [],
  "untraced": 495
}
```


Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/gates.test.mjs.
The full gate test file ran once to the end. The run gives a complete verdict.
The output extract follows.

```text
✔ [gap-ledger-149] the gate records the ledger entry as stale when no valid adopt line names the file (1287.697106ms)
✔ [gap-ledger-150] the gate ignores another change for total differences (1277.995436ms)
✔ [gap-ledger-151] the gate records the ledger entry as stale and reports LEDGER-ADOPT-FROM for an invalid from commit (1305.169968ms)
✔ [gap-ledger-154] the ratchet command writes no larger count for a file that equals its adopted source and has no base content (1628.500236ms)
ℹ tests 240
ℹ suites 0
ℹ pass 240
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1001960.886247
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct7-raw-gates.

```json
{"file":"scripts/spec/gates.mjs","processes":304,"counts":{"LF":741,"LH":741,"BRF":344,"BRH":344,"FNF":91,"FNH":91},"missingLines":[],"missingFunctions":[]}
```

Equal hit and found counts give 100% line, branch and function coverage of gates.mjs.
The host uses Node v26.8.2. No code file changed in Pass 7.
The image gates and both review agents remain for the lead, as the pass brief directs.

Command: node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.

```text
STE: 0 errors, 545 warnings.
```

Command: openspec show vendored-coverage-tolerance --json.
The command ended with exit zero and gave a JSON document. show-final.log records the output.

Command: openspec validate vendored-coverage-tolerance.

```text
Change 'vendored-coverage-tolerance' is valid
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/scope-check.py.

```text
MUST rules: 22; direct file scope flags: 4; unresolved flags: 0
Direct file scope flag lines: 5, 124, 125, 132
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/audit.py.
The final title and headings output follows.

```text
Tree read: fa34f8cb28d4cd31cbca72771ddc5796424f4533 with Pass 7 edits
Test bodies equal: True
TITLE: [gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count
Words: 24
assert.deepEqual([next.lines, next.branches, next.functions], [0, 0, 0]);
assert.deepEqual(next.totals, { lines: 0, branches: 0, functions: 0 });
File scope: adoptedAsIs true; sameAsBase default false.
Repeated titles:
stale labels: 0
proposal.md level 2 equal
proposal.md level 3 equal
design.md level 2 equal
design.md level 3 changed
--- design.md fa34f8cb
+++ design.md Pass 7
@@ -1,2 +1,3 @@
 ### Total count exception
 ### Pass 5 words
+### Pass 7 words
tasks.md level 2 equal
tasks.md level 3 changed
--- tasks.md fa34f8cb
+++ tasks.md Pass 7
@@ -1,3 +1,5 @@
 ### Pass 3
 ### Pass 4
 ### Pass 5
+### Pass 6
+### Pass 7
evidence.md level 2 equal
evidence.md level 3 changed
--- evidence.md fa34f8cb
+++ evidence.md Pass 7
@@ -12,3 +12,4 @@
 ### Pass 4
 ### Pass 5
 ### Pass 6
+### Pass 7
spec.md level 2 equal
spec.md level 3 equal
Past command fences equal: True
diff --git a/src/tooling/spec/ledger.test.mjs b/src/tooling/spec/ledger.test.mjs
index e06f76d4..d884e7e3 100644
--- a/src/tooling/spec/ledger.test.mjs
+++ b/src/tooling/spec/ledger.test.mjs
@@ -1679 +1679 @@ test('[gap-ledger-155] the ratchet command writes current total counts for a fil
-test('[gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a larger current not-covered count', () => {
+test('[gap-ledger-156] the ratchet command writes the ledger entry total count of zero for a file with no base content and a larger current not-covered count', () => {
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/check-words.py.

```json
{
  "command": "git diff --unified=0 fa34f8cb",
  "banned_word_forms": [],
  "scope": "Added document, test and code lines."
}
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vendored-tolerance/pass7/check-test-titles.mjs.

```json
{
  "titles": 1,
  "errors": [],
  "warnings": []
}
```

### Pass 8

Tree read: commit `4b0a44bc21a98e48689ccb59b12e1aa9e823c24c`, with Pass 8 edits.

| Finding | Correction |
| --- | --- |
| T1 | Split tasks with two verbs or two objects. |
| T2 | Name the metric of both counts in each changed count rule. |
| T3 | Delete the false sentence about blank lines. |
| T4 | Add the metric test for gap-ledger-154 with six literal assertions. |
| T5 | Cite proof-pass7.json, check the file scope of each MUST and state the stale exception. |
| T6 | Correct the glossary and prose. Name the accepted scope of the title for gap-ledger-156. |

The tagged title for gap-ledger-155 stays as it was. It uses current total counts and ledger total counts.
The new test passes on current code. Each of the five mutations makes that test fail.
proof-pass8.json and metric-key-mutations.log record those runs.

| Mutation | Test result |
| --- | --- |
| a: `gap[metric] <= entry.functions` | FAIL; exit 1 |
| b: `gap[metric] <= entry.lines` | FAIL; exit 1 |
| c: `next[metric] = entry.lines` | FAIL; exit 1 |
| d: `next[metric] = entry.functions` | FAIL; exit 1 |
| e: `gap.lines <= entry[metric]` | FAIL; exit 1 |

The scope check reports 22 MUST rules and flags lines 5, 124, 125 and 132.
I read each flag: lines 5, 124 and 132 use the file in the sentence directly before them.
Line 125 uses the same file as lines 123 and 124 in its paragraph. The script gives no local file scope for line 125.
Each count comparison in the changed rules names its metric on both sides.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass8/scope-check.py.

```text
Requirement: Count tolerance for adopted files
4: file=direct; metric comparands=PASS
5: file=previous sentence; metric comparands=PASS
  FLAG: The content hash MUST equal the hash in the ledger entry.
  Previous: The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
6: file=direct; metric comparands=PASS
8: file=direct; metric comparands=PASS
9: file=direct; metric comparands=PASS
29: file=direct; metric comparands=PASS
30: file=direct; metric comparands=PASS
31: file=direct; metric comparands=PASS
33: file=direct; metric comparands=PASS
35: file=direct; metric comparands=PASS
38: file=direct; metric comparands=PASS
42: file=direct; metric comparands=PASS
45: file=direct; metric comparands=PASS
Requirement: Total counts for adopted files
123: file=direct; metric comparands=PASS
124: file=previous sentence; metric comparands=PASS
  FLAG: The gate MUST NOT record the ledger entry as stale for that difference.
  Previous: The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
125: file=FLAG; metric comparands=PASS
  FLAG: Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
  Previous: The gate MUST NOT record the ledger entry as stale for that difference.
126: file=direct; metric comparands=PASS
131: file=direct; metric comparands=PASS
132: file=previous sentence; metric comparands=PASS
  FLAG: The ledger entry and current gap MUST also have equal not-covered counts of lines, branches and functions.
  Previous: Both records MUST have true coverage from a test that loads the file.
136: file=direct; metric comparands=PASS
137: file=direct; metric comparands=PASS
138: file=direct; metric comparands=PASS
MUST rules: 22
File flags: 5,124,125,132
```

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/ledger.test.mjs.

```text
ℹ tests 106
ℹ suites 0
ℹ pass 106
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 976.42161
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vendored-tolerance/pass8/check-test-titles.mjs.

```json
{
  "titles": 1,
  "errors": [],
  "warnings": []
}
```

Scratch root: commit `d09e034b9c751ebe286e2f5f32773db1af48c0a3`, with ledger.mjs and gates.mjs from commit `4b0a44bc`.

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/s3-replay8 /tmp/claude-1000/gcr/pr18-art. Exit: 0.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass8/replay-summary.py.

```json
{
  "targets": {
    "server/providers/mapillary/tiles.js": false,
    "src/data/localGeojsonCore.js": false,
    "src/keySetupCore.mjs": false,
    "src/voice/turnMetrics.js": false
  },
  "coverage_stale": [],
  "untraced": 495
}
```

Command: openspec validate vendored-coverage-tolerance.

```text
Change 'vendored-coverage-tolerance' is valid
```

Command: openspec show vendored-coverage-tolerance --json. Exit: 0. The parser read the JSON without an error.

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/gates.test.mjs.

```text
ℹ tests 240
ℹ suites 0
ℹ pass 240
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1011471.956329
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/lib/ledger.mjs /tmp/vct8-raw-ledger.

```text
{"file":"scripts/spec/lib/ledger.mjs","processes":2,"counts":{"LF":837,"LH":837,"BRF":546,"BRH":546,"FNF":100,"FNH":100},"missingLines":[],"missingFunctions":[]}
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct8-raw-gates.

```text
{"file":"scripts/spec/gates.mjs","processes":304,"counts":{"LF":741,"LH":741,"BRF":344,"BRH":344,"FNF":91,"FNH":91},"missingLines":[],"missingFunctions":[]}
```
Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass8/audit.py.

The extract omits the first 13 lines.

```text
proposal.md level 2 equal
proposal.md level 3 equal
design.md level 2 equal
design.md level 3 equal
tasks.md level 2 equal
tasks.md level 3 changed
--- tasks.md 4b0a44bc
+++ tasks.md Pass 8
@@ -3,3 +3,4 @@
 ### Pass 5
 ### Pass 6
 ### Pass 7
+### Pass 8
evidence.md level 2 equal
evidence.md level 3 changed
--- evidence.md 4b0a44bc
+++ evidence.md Pass 8
@@ -13,3 +13,4 @@
 ### Pass 5
 ### Pass 6
 ### Pass 7
+### Pass 8
spec.md level 2 equal
spec.md level 3 equal
Past command fences equal: True
Live 105 references:
Pass 6 and Pass 7 task verb flags:
[]
scripts diff: empty
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass8/check-words.py.

```text
{
  "command": "git diff --unified=0 4b0a44bc",
  "banned_word_forms": [],
  "scope": "Added document, test and code lines."
}
```

Command: taskset -c 0-3 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.

```text
STE: 0 errors, 544 warnings.
```

### Pass 9

Tree read: commit `78a0fc149515f698e03a67dceaec58f81a43d424`, with Pass 9 edits. Host Node: ledger and mutations 24.14.0; gates 26.8.2.

| Finding | Correction |
| --- | --- |
| U1 | Replace the false design sentences. Count tolerance for adopted files changes file scope and stale records. Total counts for adopted files changes stale records only. |
| U2 | Restore two Pass 7 records. Pass 8 moves the citation to proof-pass7.json. Pass 7 gave the second comparand no metric. Pass 8 names the metric on both comparands. |
| U3 | Name current gap total counts and ledger entry total counts in test 155. The accepted title list has no test 155. |
| U4 | Name the written counts in test 154. proof-pass9.json and metric-key-mutations-pass9.log record seven failed mutations and a passed run with no mutation. |
| U5 | Name each count and metric in the design and both ADDED requirements. Add current not-covered count and waived count to the glossary. |
| U6 | Name the line count comparands, LEDGER-LOST-COVERAGE and the omitted adopted-source conditions in the proposal. |
| U7 | Name the task checks. The clause output below records the title check against the six body assertions. |
| U8 | Correct the listed Pass 7 and Pass 8 prose. State the 13 omitted lines before the Pass 8 audit extract. |
| U9 | Print n/a for a rule without a matched comparison. The metric check proves rules 38 and 42, which compare counts; the lead read the other rules by hand. |
| U10 | Name the metric on both comparands of scenario 142. Its ID, tagged test title and body stay the same. |

| Mutation | Test result | First failed assertion |
| --- | --- | --- |
| a: compare with entry.functions | FAIL; exit 1 | lines: 30 against 20 |
| b: compare with entry.lines | FAIL; exit 1 | branches: 11 against 10 |
| c: write entry.lines | FAIL; exit 1 | branches: 30 against 10 |
| d: write entry.functions | FAIL; exit 1 | branches: 5 against 10 |
| e: compare gap.lines | FAIL; exit 1 | functions total: 200 against 199 |
| f: use entry.totals?.lines | FAIL; exit 1 | branches total: 400 against 300 |
| g: use < in place of <= | FAIL; exit 1 | functions total: 200 against 199 |
| No mutation | PASS; exit 0 | None |

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/scope-check.py.

```text
Requirement: Count tolerance for adopted files
4: file=direct; metric comparands=n/a
5: file=previous sentence; metric comparands=n/a
  FLAG: The content hash MUST equal the hash in the ledger entry.
  Previous: The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
6: file=direct; metric comparands=n/a
8: file=direct; metric comparands=n/a
9: file=direct; metric comparands=n/a
29: file=direct; metric comparands=n/a
30: file=direct; metric comparands=n/a
31: file=direct; metric comparands=n/a
33: file=direct; metric comparands=n/a
35: file=direct; metric comparands=n/a
38: file=direct; metric comparands=PASS
42: file=direct; metric comparands=PASS
45: file=direct; metric comparands=n/a
Requirement: Total counts for adopted files
123: file=direct; metric comparands=n/a
124: file=previous sentence; metric comparands=n/a
  FLAG: The gate MUST NOT record the ledger entry as stale for that difference.
  Previous: The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
125: file=FLAG; metric comparands=n/a
  FLAG: Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
  Previous: The gate MUST NOT record the ledger entry as stale for that difference.
126: file=direct; metric comparands=n/a
131: file=direct; metric comparands=n/a
132: file=previous sentence; metric comparands=n/a
  FLAG: The ledger entry and current gap MUST also have equal not-covered counts of lines, branches and functions.
  Previous: Both records MUST have true coverage from a test that loads the file.
136: file=direct; metric comparands=n/a
137: file=direct; metric comparands=n/a
138: file=direct; metric comparands=n/a
MUST rules: 22
File flags: 5,124,125,132
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/audit.py.

```text
Stale titles: 0
Live title: [gap-ledger-155] the ratchet command writes current gap total counts for a file with no base content when ledger entry total counts are absent
Live title: [gap-ledger-154] the ratchet command writes ledger entry counts or current counts for each metric by the ledger entry not-covered count of that metric
Clause check:
test('[gap-ledger-154] the ratchet command writes ledger entry counts or current counts for each metric by the ledger entry not-covered count of that metric', () => {
  const file = 'src/new.js';
  const ledger = ledgerWith({ coverage: { [file]: LOADED(30, 10, 5, { totals: { lines: 400, branches: 300, functions: 200 } }) } });
  const next = ratchet(ledger, gaps([loaded(file, 20, 11, 5, 'same', { lines: 401, branches: 301, functions: 199 })]), { adoptedAsIs: () => true }).ledger.coverage[file];
  assert.equal(next.lines, 20);
  assert.equal(next.totals.lines, 401);
  assert.equal(next.branches, 10);
  assert.equal(next.totals.branches, 300);
  assert.equal(next.functions, 5);
  assert.equal(next.totals.functions, 199);
});
```

Scenario 142 text at commit 9b5652a6 and with Pass 9 edits:

```text
Old scenario 142:
- **WHEN** a file meets the adopted-source conditions
- **AND** a not-covered line count is above the ledger entry not-covered count plus the tolerance
- **AND** for branches and functions, a not-covered count is above the ledger entry not-covered count plus the tolerance
- **AND** for branches and functions, a covered count is below the ledger entry covered count minus the tolerance
- **THEN** the gate reports LEDGER-LARGER-GAP for lines
- **AND** the gate reports LEDGER-LOST-COVERAGE for branches and functions
New scenario 142:
- **WHEN** a file meets the adopted-source conditions
- **AND** for the lines metric, the current not-covered count of that metric is above the ledger entry not-covered count of that metric plus the tolerance
- **AND** for branches and functions, the current not-covered count of that metric is above the ledger entry not-covered count of that metric plus the tolerance
- **AND** for branches and functions, the current covered count of that metric is below the ledger entry covered count of that metric minus the tolerance
- **THEN** the gate reports LEDGER-LARGER-GAP for lines
- **AND** the gate reports LEDGER-LOST-COVERAGE for branches and functions
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/audit-u2.py.

```text
1940: deletion-of-a-false-sentence: Pass 6 titles use live titles.
2022: deletion-of-a-false-sentence: Four mutations fail four renamed tests.
2167: fix: next to; two counts.
2178: restore: Pass 7 citation to proof-pass6.json.
2185: fix: absent total selection; zero is not absent.
2188: fix: file tolerance and stale exception; coverage error conditions.
2198: fix: text around the rule.
2199: restore: No count comparison lacks a named metric.
2450: deletion-of-a-false-sentence: Extract omits blank lines.
2512: fix: stale-check script uses a scratch root.
2521: fix: stale-check output supplies the summary.
Changed old lines: 11
Pass 7 fact restores: 2
```

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/ledger.test.mjs.

```text
ℹ tests 106
ℹ suites 0
ℹ pass 106
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1968.830102
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/lib/ledger.mjs /tmp/vct9-raw-ledger.

```text
{"file":"scripts/spec/lib/ledger.mjs","processes":1,"counts":{"LF":837,"LH":837,"BRF":546,"BRH":546,"FNF":100,"FNH":100},"missingLines":[],"missingFunctions":[]}
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/check-test-titles.mjs.

```json
{
  "titles": 2,
  "errors": [],
  "warnings": []
}
```

Host Node 24.14.0 skips 44 tests because node:test has no getTestContext function. The project guard sets these skips.

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/gates.test.mjs.

```text
ℹ tests 240
ℹ suites 0
ℹ pass 196
ℹ fail 0
ℹ cancelled 0
ℹ skipped 44
ℹ todo 0
ℹ duration_ms 222227.624954
```

Command: taskset -c 0-3 nice -n 19 node --import /home/ianblenke/docker/gev-tools/vendored-tolerance/pass3/strict-host.mjs --test src/tooling/spec/gates.test.mjs.

```text
ℹ tests 240
ℹ suites 0
ℹ pass 240
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1007589.725554
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct9-raw-gates.

```text
{"file":"scripts/spec/gates.mjs","processes":304,"counts":{"LF":741,"LH":741,"BRF":344,"BRH":344,"FNF":91,"FNH":91},"missingLines":[],"missingFunctions":[]}
```

Scratch root: upstream-sync-3 commit `d09e034b9c751ebe286e2f5f32773db1af48c0a3`, with ledger.mjs and gates.mjs from commit `78a0fc14`.

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/replay-summary.py.

```json
{
  "targets": {
    "server/providers/mapillary/tiles.js": false,
    "src/data/localGeojsonCore.js": false,
    "src/keySetupCore.mjs": false,
    "src/voice/turnMetrics.js": false
  },
  "coverage_stale": [],
  "untraced": 495
}
```

Command: taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/s3-replay9 /tmp/claude-1000/gcr/pr18-art. Exit: 0.

Command: openspec show vendored-coverage-tolerance --json. Exit: 0. The parser read the JSON without an error.

Command: openspec validate vendored-coverage-tolerance.

```text
Change 'vendored-coverage-tolerance' is valid
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/audit.py.

```text
proposal.md level 2 equal
proposal.md level 3 equal
design.md level 2 equal
design.md level 3 equal
tasks.md level 2 equal
tasks.md level 3 changed
--- tasks.md 4b0a44bc
+++ tasks.md Pass 9
@@ -3,3 +3,4 @@
 ### Pass 5
 ### Pass 6
 ### Pass 7
+### Pass 8
evidence.md level 2 equal
evidence.md level 3 changed
--- evidence.md 4b0a44bc
+++ evidence.md Pass 9
@@ -13,3 +13,5 @@
 ### Pass 5
 ### Pass 6
 ### Pass 7
+### Pass 8
+### Pass 9
spec.md level 2 equal
spec.md level 3 equal
Past command fences equal: True
Task verb flags: []
Task counts:
Pass 3 17
Pass 4 17
Pass 5 21
Pass 6 12
Pass 7 16
Pass 8 17
scripts diff: empty
src diff: two test titles only
Scenario IDs and headings: equal
proposal.md 42 It accepts a difference in the total counts and the covered counts that follow.
proposal.md 87 The lead accepts these words by name.
proposal.md 89 The lead accepts this omission by name.
tasks.md 83 - [x] Write the test for gap-ledger-155 before its code.
tasks.md 110 - [x] Strengthen the test for gap-ledger-155.
```

Command: python3 /home/ianblenke/docker/gev-tools/vendored-tolerance/pass9/check-words.py.

```json
{
  "command": "git diff --unified=0 9b5652a6",
  "banned_word_forms": [],
  "scope": "Added document, test and code lines."
}
```

Command: taskset -c 0-3 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.

```text
STE: 0 errors, 544 warnings.
```
