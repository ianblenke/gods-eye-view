## Source

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
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

The new gate tests use fixed coverage data. Their Git fixtures contain actual merge parents and adopt records.
The real CI replay uses the actual artifact coverage, not those fixed test values.

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

Sync source commit: `d17b233e0b28e5173700762443baee4eb5b27b25`.
Artifact folder: /tmp/claude-1000/gcr/pr18-art.
Replay root: /tmp/claude-1000/gcr/s3-replay.

Command: taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/replay.mjs /tmp/claude-1000/gcr/s3-replay /tmp/claude-1000/gcr/pr18-art.
The replay script adds the same valid adopt predicate to the owner's stale-check-s3.mjs script.

The before run uses the sync scripts. The after run uses this change's scripts.
Logs: /tmp/vct-logs/replay-before.log and /tmp/vct-logs/replay-after.log.

The before run reports four stale coverage entries. The after run reports one stale coverage entry.
The new rule clears server/providers/mapillary/tiles.js, src/data/localGeojsonCore.js and src/voice/turnMetrics.js.
It does not clear src/keySetupCore.mjs.

Command: git diff 95fa816232456a6831172befa2f1b34b9ee73794 -- src/keySetupCore.mjs in the replay root.
The fork adds an OSH account block. The adopted upstream commit has no such block.

The source check must reject that file. A zero-stale result for all four files would conflict with the owner's rule.
The replay's untraced-test and QA results come from its approximations. They give no project gate verdict.

## Runs that stopped

The full-file host attempts reached their time limits before the test report. They give no test verdict.
The empty coverage summary after such a stop gives no script coverage result.
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

Source commit: a6eeca2a.
Command: taskset -c 4-7 nice -n 19 node --experimental-test-coverage --test-coverage-include=scripts/spec/lib/ledger.mjs --test src/tooling/spec/ledger.test.mjs.
Log: /tmp/vct-logs/coverage-ledger-final.log.

The command finishes with 95 tests, 95 passes and no failure.
The ledger script has 100% line, branch and function coverage.

## Gate coverage

Source commit: a6eeca2a. Its gate script has the same bytes as commit 44131665.
The host stores raw V8 coverage for each completed current-tree test command in /tmp/vct-raw-gates.
The merger selects only the actual project URL for scripts/spec/gates.mjs. It excludes scratch and base-tree URLs.

Command: taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/coverage-detail.mjs scripts/spec/gates.mjs /tmp/vct-raw-gates.
Log: /tmp/vct-logs/coverage-gates-aggregate-second.log.

The command reads 903 process files. The merger counts 740 covered lines of 740 lines.
It counts 373 covered branches of 373 branches and 89 covered functions of 89 functions.
Thus the gate script has 100% line, branch and function coverage.

The process file count includes files without the target script. Those files add no coverage for the target script.
The tool uses scripts/spec/lib/v8-merge.mjs from this project. It uses actual raw ranges and counts.

## Automatic code mutations

Mutation source commit: 44131665. Final code commit: a6eeca2a changes only a comment.
Tool guide: /home/ianblenke/docker/gev-tools/automut/README.md.
The host tool copy removes --test-isolation=none and starts each Node child with taskset and nice.
It changes no project gate or project test source.

The candidate file is /home/ianblenke/docker/gev-tools/vct/mutants.json.
The set contains 322 mutations at lines that this change adds or moves.
The first campaign uses all ledger tests and four focused gate tests.
The second campaign uses all ledger tests, eight focused gate tests and the reached-file test.
The scratch copies skip the other gate tests. The separate host comparison checks those tests.

Both campaigns complete both phases. The final set has 311 killed mutations and 11 survivors.
No final mutation has a crash, a time limit or an incomplete status.
The tool stops a mutant after its first failed test. Such a stop gives that test's failure, not a full-file pass.

### Library equivalence probes

Command: taskset -c 4-7 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/equivalent-lib.mjs.
Source commit: 44131665. Log: /tmp/vct-logs/equivalent-lib.log.

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
Source commit: 44131665. Logs: /tmp/vct-logs/equivalent-gates-*.log.

The base and each of four mutants pass the same eight test titles. Each command has no test failure.
The probes compare verdicts with actual Git fixtures and fixed coverage counts.

| Mutation ID | Equivalence scope |
|---|---|
| a9038 | File match and file existence checks can change order for string paths in a stable tree |
| a9891 | A closure can precede its source value when no call occurs before that value exists |
| a9892 | The phase start can precede closure creation; only elapsed time can differ |
| a9896 | The two independent comparisons can change order for JSON records and stable source evidence |

These claims cover verdict fields. They do not compare elapsed time, callback effects or stack traces.
The owner can inspect each mutation and its final status in proof.json.

## Final test records

Command: python /home/ianblenke/docker/gev-tools/vct/count-verdicts.py.
Command: python /home/ianblenke/docker/gev-tools/vct/final-report.py.
Log: /tmp/vct-logs/final-report.log.

The completed command output covers all 227 base-tree gate test titles and all 235 current-tree titles.
Every title passes with the strict host transport. No title lacks a completed report. No title has results that disagree.

The commands run each exact title or a small group from the same test file.
These totals combine completed reports. They do not claim that a stopped full-file command passed.

The base ledger command has 90 tests and 90 passes. The current ledger command has 95 tests and 95 passes.
The base log is /tmp/vct-logs/ledger-before-host.log. The current coverage log names its command above.

Command: python /home/ianblenke/docker/gev-tools/vct/suite.py.
The suite runs the other spec test files one file per process. Its first run has one host transport failure.
That failure is coverage-gate-022 in runParallel.test.mjs. The same transport fails that test on the base tree.

The strict transport sends non-test runner input to the actual runner.
The separate before and after commands then pass all three runParallel tests.
Logs: /tmp/vct-logs/runParallel-before-strict.log and /tmp/vct-logs/runParallel-final-strict.log.
The suite logs give the completed results for the other files.

| Test file | Current tests | Passes |
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

Source commit: a6eeca2a.
Command: taskset -c 4-7 nice -n 19 node scripts/spec/gates.mjs lint --change vendored-coverage-tolerance.
Log: /tmp/vct-logs/lint-final-correction.log.

Result: STE has zero errors. The report names no issue in this change's prose.
The full project report has 538 WARN items for earlier prose.
The lead must run the Node 24 image checks, the ratchet command and both review agents.
The lead must read the QA lines and check the upstream remote for each merge second parent under rule 21.

## Pass 2

Read commit: `125dc3ae92f9687a830e230914ec0e2b393dda18`.
Code commit: `0945baeeb34416d0e607abd184d096486b673eef`.
Test correction commit: `0407e631`.
The correction replaces a fixture-variable comparison with specification literals.
It changes no script bytes.
Command: git rev-parse HEAD.

Each host Node process uses taskset -c 8-11 nice -n 19. Each test process names one test file.
The host checks use the strict transport at /home/ianblenke/docker/gev-tools/vct/strict-host-2.mjs.
It also applies the CPU and priority settings to each fixture Node process.
It keeps Node test isolation. It changes no project file.

The new adoptedFile predicate reads the same valid adopt records as adoptedAsIs.
Only the stale decision uses the new predicate. Fork edits keep exact not-covered counts and all coverage errors.
The ratchet command writes current totals for those edits.

### Named mutations

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-named.py.
Source commit: `0945baee`. Logs: /tmp/vct2-logs/named-*.log.
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

The command also removes the current untrue guard and the current loaded guard in separate scratch files.
Those faults do not change a verdict. The current errors stop the stale decision for those inputs.
The other guards also stop that decision when both records have untrue coverage or no test loads them.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/pass2-probe.mjs.
Source commit: `0945baee`. Log: /tmp/vct2-logs/probe-named.log.

Each guard probe compares 11520 result objects. Both probes give EQUIVALENT within that input set.
The inputs vary source predicates, hashes, loaded states, untrue states, metrics, total counts and not-covered counts.
The probes use plain records and pure predicates. They do not cover property getters or callback side effects.

### Real CI data

Replay tree commit: `d09e034b9c751ebe286e2f5f32773db1af48c0a3`.
Replay base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
Command: git -C /tmp/vct2-replay rev-parse HEAD origin/main.

The scratch tree is a copy of /home/ianblenke/docker/gev-work/upstream-sync-3.

Command: git -C /tmp/vct2-replay diff --name-only d17b233e d09e034b.
Only the review.md file of the sync change differs from the earlier replay tree.
The production files and the ledger have the same content.

The replay tool now supplies adoptedAsIs and adoptedFile from the same valid adopt records as the gate.
The earlier tool copy is /home/ianblenke/docker/gev-tools/vct/stale-check-s3-original.mjs.

Command: git show e2437f94:scripts/spec/lib/ledger.mjs.
The original replay uses that library and the gate script from the same commit in the scratch tree.
The next replay uses the scripts from commit `0945baee`.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/stale-check-s3.mjs /tmp/vct2-replay /tmp/claude-1000/gcr/pr18-art.
Logs: /tmp/vct2-logs/replay-original.log and /tmp/vct2-logs/replay-final.log.

| Run | Stale coverage files |
|---|---|
| Original library | server/providers/mapillary/tiles.js; src/data/localGeojsonCore.js; src/keySetupCore.mjs; src/voice/turnMetrics.js |
| Pass 2 | None |

The original run has 4 stale coverage files. The new run has 0.
The replay has untraced-test and QA script noise in both runs. Its approximations cause that noise.
Those results give no project gate verdict.

### Runs that stopped

The sandbox hides individual Node test reports. Its file-level reports give no individual test verdict.
The host runs replace those attempts.
Some batch and single-title commands reach their time limits. Those commands give no test verdict.
The final test report must use only commands that finish with individual test verdicts.

The first automatic mutation attempt stops at its baseline time limit before it starts a mutation.
The next attempt uses the new gate scenarios and all ledger tests.

### File check

Source commit: `0945baee`.
Command: rg -n 'adoptedFile|totalsOnly' scripts/spec/gates.mjs scripts/spec/lib/ledger.mjs.
The search shows the predicate in the gate, its input to compareLedger and the total count condition in the library.
Command: git diff --check.
The command reports no format error.

### Host coverage

Script source commit: `0945baee`. Final test source commit: `0407e631`.
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

Script source commit: `0945baee`. The next test correction changes no script bytes.
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
Both phases finish. A failed-test stop identifies a killed mutation; it does not give a full test-file pass.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-followup.py.
Logs: /tmp/vct2-logs/followup-*.log.

| Mutation IDs | Fault | Failed scenario |
|---|---|---|
| a9585, a9591 | Remove sameAsBase | gap-ledger-069 |
| a9586, a9592 | Remove adoptedAsIs | gap-ledger-136 |
| a9588, a9594 | Remove waivers | gap-ledger-081 |

The other gate survivors are a9898 and a9903.
The first changes closure order. The second changes the order of independent comparisons.
The base and each mutant pass the same 12 test titles with actual Git fixtures and fixed coverage data.
These probes compare verdicts. They do not compare elapsed time or file changes from another process.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/vct/pass2-probe.mjs --automatic.
Log: /tmp/vct2-logs/probe-automatic.log.
The command checks 14 library survivors with 11520 cases each. All result fields match.
The scope is plain records and pure predicates. The named guard proof also applies to the redundant current guards.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-proof.py.
Log: /tmp/vct2-logs/automut-proof.json.
The complete proof is /home/ianblenke/docker/gev-tools/vct/pass2-automut/proof.json.

| Stage | Killed | Survivors |
|---|---:|---:|
| First phase | 159 | 22 |
| Second phase | 0 | 22 |
| Follow-up tests | 6 | 16 |

The final total is 165 killed mutations and 16 EQUIVALENT mutations.
The proof has 0 unresolved mutations. No final mutation has a crash or time-limit status.
The library probes total 161280 cases. The gate probes use 12 titles for each source version.

### Complete test reports

Base code and test commit: `125dc3ae`. Current script commit: `0945baee`.
Current test commit: `0407e631`. The fixture processes use their own spec files.

Command: taskset -c 8-11 nice -n 19 node --test src/tooling/spec/ledger.test.mjs.
Base folder: /tmp/vct2-base. Log: /tmp/vct2-logs/ledger-before-host.log.
The base command reports 95 tests and 95 passes. The current coverage command reports 100 tests and 100 passes.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-exact.py.
Command: python /home/ianblenke/docker/gev-tools/vct/pass2-extra.py.
Command: python /home/ianblenke/docker/gev-tools/vct/pass2-retry.py.
Each command log starts with its Node command. The retry command replaces only the reports that stop at a time limit.

Command: python /home/ianblenke/docker/gev-tools/vct/pass2-report.py.
Log: /tmp/vct2-logs/test-report-final.json.

| File | Base tests | Current tests | Base passes | Current passes |
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
Only the required Known limits and later changes heading differs from that commit.

The lead must run make ratchet CHANGE=vendored-coverage-tolerance in the Node image.
The lead must check the upstream remote and merge second parents under rule 21.
The lead must get both review passes before the merge.
The lead must run make gates CHANGE=vendored-coverage-tolerance on the final image tree.

## Pass 3

Commit read: `045540504b2f69b7e2cf91275992683dded249c8`.
The code files still equal this commit. The pre-review reports have no changes.

T3 stops this pass. The lead must decide the correction for the design defect.
The other findings have no correction in this pass.

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
Full test suites, coverage, automatic mutations and the echo script do not run after the T3 failure.
The pass stops before the other corrections and their checks.

Final checks for this partial pass:

- The host lint command reports 0 errors and 539 warnings. The log is pass3/lint.log in the tools folder.
- The command `openspec show` with the change name and `--json` returns JSON. Python json.loads accepts that output.
- The command `openspec validate` with the change name reports that the change is valid.
- The Python comparison of each document with commit 04554050 finds no removed or renamed level-two title.
- Only evidence.md adds a level-two title: Pass 3. The proposal titles have no changes.

The search `rg` shows the word table at design.md:50 and the scenario at specs/gap-ledger/spec.md:55.
The search shows the test at gates.test.mjs:2816 and the completed test tasks at tasks.md:59 and tasks.md:60.
The search shows the failure output at evidence.md:499. These results apply to code commit 04554050.
