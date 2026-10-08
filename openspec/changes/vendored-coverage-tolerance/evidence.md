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
