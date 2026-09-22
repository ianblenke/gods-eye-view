## 1. Spec and proposal

- [x] 1.1 Write `specs/coverage-gate/spec.md` with one ADDED requirement and the scenarios `coverage-gate-048`, `coverage-gate-049` and `coverage-gate-050`.
  - No requirement is MODIFIED. Quote no base text.
  - Check `openspec/trace/retired-ids.json` for the three IDs before you use them.
- [x] 1.2 Write `proposal.md`: the defect, the two halves, the impact, the limits.
- [x] 1.3 Write `design.md` with D1 to D6 and the file list.
- [x] 1.4 Write `tasks.md` from this list.
- [x] 1.5 Add a second ADDED requirement to `specs/coverage-gate/spec.md`: scenarios `coverage-gate-051`, `coverage-gate-052`.
  - We added this requirement after a run with resource contention showed that `--test-force-exit` could lose reporter output. See 5.10.
  - Tag the two tests of that fix's own safety logic with these IDs.
  - An untagged test here could never pass `make gates`. `compareWithBase()`'s untraced check has no ratchet escape for a new name in an unmerged change.

## 2. Guard the teardown in `src/data/oshLayer.test.mjs`

Rules for this group. Change no test name. Change no assertion. Do not touch `withClickCapture()`. Do not touch the two tests that make no layer.

- [x] 2.1 Add `(t)` to each test signature that has no parameter and makes a layer. Sixty signatures.
  - Rules out: a test that names `t` inside `t.after()` with no `t` parameter, which throws a `ReferenceError` on every run.
- [x] 2.2 Add `t.after(() => layer.destroy(viewer));` after the `fakeViewer()` line and before `layer.init(viewer)` in each of the 64 tests that make a layer.
  - Remove each final `layer.destroy(viewer);` that only tears down.
  - Keep the `destroy` call in the two tests that assert its effect directly: the disable-and-destroy test, and the abort-on-destroy test.
  - Keep any other call whose effect an assertion reads. List each kept call in the commit message.
  - Record the exact counts: hook lines added, calls removed, calls kept.
- [x] 2.3 Run `node --test src/data/oshLayer.test.mjs`. Confirm that all 66 tests pass and the runner skips none.
  - The file had 66 tests at this task's own time, 64 with a layer. Other, already-merged work later added more tests to the file. Task 6.4 records the file's current total.
- [x] 2.4 Prove the guard with a temporary failure. Remove the temporary failure.
  - In the selected-entity-stays test tagged `osh-057`, invert the entity assertion so it expects no entity.
  - Run `node --test` on the file, under a 60-second `timeout`, with the `tap` reporter.
  - Before task 2.2 this run prints `not ok` and never prints `1..66`. `timeout` ends it with status 124.
  - Record that transcript once, before 2.2, as the baseline.
  - After task 2.2 the run prints `not ok` for that test, prints `1..66`, and exits with status 1. This is the mutation for the mechanical half. Report the test that failed and the exit status.
  - Rules out: a hook that catches the assertion error, which would print `ok` for the mutated test.
- [x] 2.5 Confirm the assertion error is unchanged.
  - In the transcript of 2.4, the failure names the original message text and the `AssertionError` code.

## 3. Guard the teardown in `src/data/localGeojson.test.mjs`

Rules for this group. Change no test name. The file has a ledger entry with untraced names, and a new name stops the ratchet.

- [x] 3.1 Add `(t)` to the four tests with an unguarded destroy call.
  - On this branch the calls are at lines 366, 463, 472 and 690.
- [x] 3.2 Add the destroy-and-cleanup hook after the harness line in each of the four tests.
  - Remove the final `destroy` and `cleanup` pair in the three tests that end with it.
  - Keep the `destroy` call at line 366. An assertion reads the listener count after it. The hook then calls `destroy` a second time.
  - Read the local layer's `destroy()` first. Confirm a second call with no data source and no listener does not throw. If it throws, guard that one test with `try/finally` instead, and say so in the commit message.
- [x] 3.3 Run `node --test src/data/localGeojson.test.mjs`. Confirm that each test passes.
- [x] 3.4 Prove the guard with a temporary failure in the test at line 467. Remove the temporary failure.
  - Invert the entity-count assertion so it expects zero entities instead of more than zero.
  - Run the same command on `localGeojson.test.mjs`.
  - The run exits with status 1 and prints its plan line. Report the test that failed.
- [x] 3.5 Confirm no other suite changes. The design's D3 lists each site the facts table counted and why it stays.

## 4. The gate exits each run: `coverage-gate-048`

- [x] 4.1 Repeat the probe in the gate image before any gate code changes.
  - Write a synthetic test file in a temporary folder that arms a timer and then fails one assertion.
  - Give it an exit handler that writes a marker file.
  - First check: run it with the exit-flag option, and confirm the marker file exists after the run.
  - The test guard writes its checked files and its assertion counts from the same exit event. If the marker is absent, the option skips that event.
  - An absent marker means that the option could prevent coverage measurement for every file while each run still passes.
  - In that case do not add the option at all, in any file. Stop and report.
  - This is not "the gate half falls". It is "this option must never reach `main`".
  - Second check: in the same run, confirm it prints `not ok`, prints the plan line and exits with status 1.
  - Third check: run it with `node --test --test-reporter=tap`. Confirm it never prints the plan line, and `timeout` ends it.
  - Fourth check: confirm `process.getActiveResourcesInfo()` inside the `exit` handler lists `Timeout`.
  - If a check fails on the pinned Node, stop and report the transcript. Do not add a deadline or a kill. Do not widen the filter to a type you did not see.
  - The plan has one decision point, after the checks above.
  - If the first check fails: no option, no group 4, no group 5, no scenario. Stop and report.
  - The run can fail to exit at all, or can exit before the fail record is in the result file.
  - In either case, drop groups 4 and 5 and the three scenarios.
  - Stop and report, because the change then has no spec delta.
  - The run can exit after the handler runs, but the resource list can still omit the timer.
  - In that case, do group 4 and its one scenario, and drop group 5 and its two scenarios.
  - Add an open limit to the proposal that names the risk.
  - Group 5 never stands without group 4.
- [x] 4.2 Write the `[coverage-gate-048]` test in `src/tooling/spec/gates.test.mjs`.
  - Assert `buildTestRuns()` puts `--test-force-exit` in the arguments of the main run and of each allocation run.
  - Write a synthetic test file in a temporary folder that arms `setInterval` and then fails one assertion. Run `process.execPath` with the main run args from `buildTestRuns()` for that file, with `spawnSync` and `timeout: 30_000`, and a temporary `outDir`.
  - Assert the status is 1, not null. Assert the `tests-main.jsonl` file has one record with `status: 'fail'`.
  - Rules out: a run that hangs, which `spawnSync` ends with a null status. Also rules out: a run that exits before the trace reporter writes its last line.
- [x] 4.3 Add `--test-force-exit` to the main run and to each allocation run in `buildTestRuns()` until the test in task 4.2 passes.
- [x] 4.4 Remove `--test-force-exit` from the main run arguments for the mutation test.
  - The `[coverage-gate-048]` test fails on the null status. Put it back. Report the test that failed.

## 5. The guard records a live timer: `coverage-gate-049` and `coverage-gate-050`

- [x] 5.1 Write the `[coverage-gate-049]` test in `src/tooling/spec/testGuard.test.mjs`.
  - Make a guard whose resource list holds a pipe, a timer and an immediate, with a test file name.
  - Assert `results().leaks` names that file, contains only the timer and the immediate, and excludes the pipe.
  - Rules out: a guard that keeps `PipeWrap`; a guard that names no file.
- [x] 5.2 Write the `[coverage-gate-050]` test in the same file. With `getActiveResources: () => ['PipeWrap']`, assert `results().leaks` is `[]`.
  - Change the `deepEqual` on the full `results()` shape to include `leaks: []`.
  - Rules out: a guard that records a leak for a pipe.
- [x] 5.3 Write the `[coverage-gate-049]` gate test in `gates.test.mjs`.
  - Write a guard file with one `leaks` entry into the output folder of a stubbed run.
  - Assert the gate output has `ERROR GATES-TEST-LEAK` with the test file, and no untrue-coverage entry for any code file.
  - Rules out: a gate that reads `leaks` as a violation.
- [x] 5.4 Write the `[coverage-gate-050]` gate test in the same file.
  - With a guard file with `leaks: []`, assert no `GATES-TEST-LEAK` error.
- [x] 5.5 Add the guard's new input, its new output field, and its exit-event read.
  - Do this until the tests in tasks 5.1 and 5.2 pass.
  - Name the test file from `process.argv[1]`, relative to the root.
- [x] 5.6 Add the `GATES-TEST-LEAK` error to `measure()` until the tests in tasks 5.3 and 5.4 pass.
- [x] 5.7 Remove the `Timeout` filter for the mutation test, so `results().leaks` keeps every resource.
  - The `[coverage-gate-050]` guard test fails. Put it back. Report the test that failed.
- [x] 5.8 Make `measure()` skip the `leaks` read for the mutation test.
  - The `[coverage-gate-049]` gate test fails. Put it back. Report the test that failed.
- [x] 5.9 Prove the chain end to end, in the gate image, with a temporary file.
  - Add a test file under `src/` that arms a timer and then fails. Run `make gates`.
  - Confirm the output has the fail record for that test and one `GATES-TEST-LEAK` error with that file. Remove the file. Report the two lines.
  - One line contains a `TRACE-FAILED-TEST` error that names the test and file. The other line contains a `GATES-TEST-LEAK` error for the same file, with a live `Timeout`.
  - A first attempt left the file untracked. `COVERAGE-UNTRACKED` fired, but the file never ran — test-file discovery selects only tracked files. `git add` fixed it.
  - A second, blank-named `GATES-TEST-LEAK` line also appeared in the same run. The investigation found a separate defect that caused this error. `src/tooling/spec/runParallel.test.mjs`'s `[coverage-gate-022]` test spawned a real child with no guard-env isolation. A real gate run's env then cascaded two hops deep into a synthetic probe process. Fixed at commit `ddcd304`, confirmed absent across several later runs.
- [x] 5.10 Confirm a green run records no leak.
  - Run `make gates` on the clean tree. Confirm no `GATES-TEST-LEAK` error appears for any file.
  - Confirmed clean. These checks also found intermittent failures in tests of the full project. `osh-layer`/`osh-systems` scenarios intermittently read as unverified across several runs. None of these ever reproduced in isolation, and none touch any file this change edits.
  - An application container used much CPU time. The failures continued after we stopped it. The other cause remains unknown. At the user's request, we repeated the check until a run passed.
  - Some full-project runs reported a live `Timeout` in `src/data/trafficTiming.test.mjs`. Isolated runs did not. The test correctly called the server's `close()` method in `finally`.
  - The cause: `close()`'s promise resolves before vite's own internal teardown (dependency-optimizer service, file watcher) finishes on its own tick. This only shows under real event-loop contention.
  - Fixed with a short real-timer wait after `close()` and all other teardown (commit `0758c37`). We could not reproduce the leak on demand, so we could not verify the correction with a mutation test.
  - A later verification run of the full project reported no errors. No `GATES-TEST-LEAK`, no other error. The fix held.

## 6. Gates and review

- [x] 6.1 Run `make lint` until no STE error remains.
- [x] 6.2 Run `make ratchet CHANGE=teardown-guard`. Confirm it records no new untraced name in `src/data/localGeojson.test.mjs`.
  - `Gates passed.` All scenarios verified, four history lines recorded, no untraced-name error for `localGeojson.test.mjs` or any file.
- [x] 6.3 Run `make gates CHANGE=teardown-guard`. Confirm `scripts/spec/gates.mjs` and `scripts/spec/lib/test-guard.mjs` stay at 100%. Read the command output for the verdict, not `results.json`.
  - A clean run took a long saga. The later gate runs also had errors in the ledger. These errors were separate from the failures described in task 5.10.
  - A rare, real defect undercounted a file's own untagged names on some whole-project runs. It struck eight distinct files, one of them three times, and once during `make ratchet` itself. For each affected file, we extracted the correct test names from the source with a regular expression. We merged and committed the names.
  - `--trace-warnings` identified Node's reporter pipeline as the source of a `MaxListenersExceededWarning` on every run, not this project's code. We removed the cosmetic `dot` reporter, and the warning stopped for good. It did not stop the drift; that recurred once with the warning absent. The warning was a correlated symptom, not the sole cause.
  - Also fixed along the way: a real coverage gap in `gates.mjs` itself, found from measured lcov data, not guessed.
  - `openspec/trace/history.jsonl` records `src/data/labelArbiter.js`'s branch count moving between 50 and 52 on almost every ratchet run tagged `teardown-guard`, and `src/data/localGeojsonCore.js` gaining one total branch once. Neither file is in this change's own file list. The pattern predates this change. The same 50/52 flip on `labelArbiter.js` starts at commit `2069f913f` on 2026-09-15, before `teardown-guard` began.
  - Each flip reverses on the very next ratchet run. The gate's own count tolerance absorbs each one; none ever stopped a build. The cause of these branch-count changes is unknown. Task 5.10 records a separate live-timer error.
  - And a structural gap: `LEDGER-NOT-IN-BASE` has no ratchet escape for a new untagged name in an unmerged change. We added scenario tags `coverage-gate-051` and `coverage-gate-052` to the two new safety tests.
  - `Gates passed.` with only the expected `REVIEW-MISSING`. `scripts/spec/gates.mjs` and `scripts/spec/lib/test-guard.mjs` stayed at 100%.
- [ ] 6.4 Run the spec-adversary and STE-adversary review. Correct the findings. Record the result in `review.md`.
  - `src/data/oshLayer.test.mjs` now has 77 tests. 75 have the `t.after()` teardown guard. Two make no layer at all, matching design.md's stated exception.
  - Task 6.3's undercounting bug recurred three more times during this review's own ratchet runs. `src/scopeMask.test.mjs` shrank 22 to 20; restored at commit `d94964e`. `src/cockpitMarkup.test.mjs` shrank 38 to 16, its fourth recurrence this session; restored at commit `f30b40c`. `src/data/flights.test.mjs` shrank 54 to 19; restored at commit `8a7c1c0`. All three used the same regular-expression fix as task 6.3.
  - Two further ledger errors hit this review's own runs. `src/data/aisLiveVessels.test.mjs` gave `LEDGER-STALE`, and `src/annotations/annotationResolver.test.mjs` showed 24 in the ledger against 20 measured. Both self-corrected on a bare retry, with no code change. Neither needed the regular-expression fix.
