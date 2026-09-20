## 1. Spec and proposal

- [x] 1.1 Write `specs/coverage-gate/spec.md` with one ADDED requirement and the scenarios `coverage-gate-048`, `coverage-gate-049` and `coverage-gate-050`.
  - No requirement is MODIFIED. Quote no base text.
  - Check `openspec/trace/retired-ids.json` for the three IDs before you use them.
- [x] 1.2 Write `proposal.md`: the defect, the two halves, the impact, the limits.
- [x] 1.3 Write `design.md` with D1 to D6 and the file list.
- [x] 1.4 Write `tasks.md` from this list.

## 2. Guard the teardown in `src/data/oshLayer.test.mjs`

Rules for this group. Change no test name. Change no assertion. Do not touch `withClickCapture()`. Do not touch the two tests that make no layer.

- [x] 2.1 Add `(t)` to each test signature that has no parameter and makes a layer. Sixty signatures.
  - Rules out: a test that names `t` inside `t.after()` with no `t` parameter, which throws a `ReferenceError` on every run.
- [x] 2.2 Add `t.after(() => layer.destroy(viewer));` after the `fakeViewer()` line and before `layer.init(viewer)` in each of the 64 tests that make a layer.
  - Remove each trailing `layer.destroy(viewer);` that only tears down.
  - Keep the `destroy` call in `[osh-029] disable hides the data source, destroy removes it, and disable stops more updates`. Keep it in `[osh-029] aborts an update in flight on destroy`. Keep any other call whose effect an assertion reads. List each kept call in the commit message.
  - Record the exact counts: hook lines added, calls removed, calls kept.
- [x] 2.3 Run `node --test src/data/oshLayer.test.mjs`. Confirm 66 tests pass and no test is skipped.
- [x] 2.4 Prove the guard with a temporary failure, then revert it.
  - In `[osh-057] a selected stream-placed system keeps its entity at its last position until deselected`, change `assert.ok(entity, ...)` to `assert.ok(!entity, ...)`.
  - Run `timeout 60 node --test --test-reporter=tap src/data/oshLayer.test.mjs`.
  - Before task 2.2 this run prints `not ok` and never prints `1..66`; `timeout` ends it with status 124. Record that transcript once, before 2.2, as the baseline.
  - After task 2.2 the run prints `not ok` for that test, prints `1..66`, and exits with status 1. This is the mutation for the mechanical half. Report the test that reddened and the exit status.
  - Rules out: a hook that catches the assertion error, which would print `ok` for the mutated test.
- [x] 2.5 Confirm the assertion error is unchanged. In the transcript of 2.4, the failure names the original message text and the `AssertionError` code.

## 3. Guard the teardown in `src/data/localGeojson.test.mjs`

Rules for this group. Change no test name. The file has a ledger entry with untraced names, and a new name stops the ratchet.

- [x] 3.1 Add `(t)` to the four tests with an unguarded `env.layer.destroy(env.viewer)`. On this branch the calls are at lines 366, 463, 472 and 690.
- [x] 3.2 Add `t.after(() => { env.layer.destroy(env.viewer); env.cleanup(); });` after the harness line in each of the four. Remove the trailing `destroy` and `cleanup` pair in the three tests that end with it.
  - Keep the `destroy` call at line 366. An assertion reads the listener count after it. The hook then calls `destroy` a second time.
  - Read the local layer's `destroy()` first. Confirm a second call with no data source and no listener does not throw. If it throws, guard that one test with `try/finally` instead, and say so in the commit message.
- [x] 3.3 Run `node --test src/data/localGeojson.test.mjs`. Confirm each test passes.
- [x] 3.4 Prove the guard with a temporary failure in the test at line 467, then revert it. Change `assert.ok(entities.length > 0, ...)` to `assert.ok(entities.length === 0, ...)`.
  - Run `timeout 60 node --test --test-reporter=tap src/data/localGeojson.test.mjs`. The run exits with status 1 and prints its plan line. Report the test that reddened.
- [x] 3.5 Confirm no other suite changes. The design's D3 lists each site the facts table counted and why it stays.

## 4. The gate exits each run: `coverage-gate-048`

- [x] 4.1 Repeat the probe in the gate image before any gate code changes. Write a synthetic test file in a temporary folder that arms `setInterval` and then fails `assert.equal`. Give it a `process.on('exit')` handler that writes a marker file.
  - First check: run it with `node --test --test-force-exit --test-reporter=tap`. Confirm the marker file exists after the run. The test guard writes its checked files and assertion counts from the same event. If the marker is missing, the option skips that event. Then the option would stop coverage measurement for every file while each run stays green. In that case do not add the option at all, in any file. Stop and report. This is not "the gate half falls". It is "this option must never reach `main`".
  - Second check: in the same run, confirm it prints `not ok`, prints the plan line and exits with status 1.
  - Third check: run it with `node --test --test-reporter=tap`. Confirm it never prints the plan line, and `timeout` ends it.
  - Fourth check: confirm `process.getActiveResourcesInfo()` inside the `exit` handler lists `Timeout`.
  - If a check fails on the pinned Node, stop and report the transcript. Do not add a deadline or a kill. Do not widen the filter to a type you did not see.
  - The plan is severable at one seam. If the first check fails: no option, no group 4, no group 5, no scenario; stop and report. If the run does not exit, or exits before the `fail` record is in the result file: drop groups 4 and 5 and the three scenarios; stop and report before you continue, because the change then has no spec delta. If the run exits and the handler runs, but the list has no `Timeout`: do group 4 and `coverage-gate-048`, drop group 5 and `coverage-gate-049` and `coverage-gate-050`, and add the open limit `green-leak-passes-silently` to the proposal. Group 5 never stands without group 4.
- [x] 4.2 Write the `[coverage-gate-048]` test in `src/tooling/spec/gates.test.mjs`.
  - Assert `buildTestRuns()` puts `--test-force-exit` in the main run args and in each allocation run args.
  - Write a synthetic test file in a temporary folder that arms `setInterval` and then fails one assertion. Run `process.execPath` with the main run args from `buildTestRuns()` for that file, with `spawnSync` and `timeout: 30_000`, and a temporary `outDir`.
  - Assert the status is 1, not null. Assert the `tests-main.jsonl` file has one record with `status: 'fail'`.
  - Rules out: a run that hangs, which `spawnSync` ends with a null status. Also rules out: a run that exits before the trace reporter writes its last line.
- [x] 4.3 Add `--test-force-exit` to the main run and to each allocation run in `buildTestRuns()` until 4.2 is green.
- [x] 4.4 Mutation: remove `--test-force-exit` from the main run args. The `[coverage-gate-048]` test reddens on the null status. Put it back. Report the test that reddened.

## 5. The guard records a live timer: `coverage-gate-049` and `coverage-gate-050`

- [x] 5.1 Write the `[coverage-gate-049]` test in `src/tooling/spec/testGuard.test.mjs`.
  - Make a guard with `getActiveResources: () => ['PipeWrap', 'Timeout', 'Immediate']` and a test file name. Assert `results().leaks` is `[{ file: 'src/a.test.mjs', resources: ['Timeout', 'Immediate'] }]`.
  - Rules out: a guard that keeps `PipeWrap`; a guard that names no file.
- [x] 5.2 Write the `[coverage-gate-050]` test in the same file. With `getActiveResources: () => ['PipeWrap']`, assert `results().leaks` is `[]`.
  - Change the `deepEqual` on the full `results()` shape to include `leaks: []`.
  - Rules out: a guard that records a leak for a pipe.
- [x] 5.3 Write the `[coverage-gate-049]` gate test in `src/tooling/spec/gates.test.mjs`. Write a guard file with one `leaks` entry into the output folder of a stubbed run. Assert the gate output has `ERROR GATES-TEST-LEAK` with the test file, and no untrue-coverage entry for any code file.
  - Rules out: a gate that reads `leaks` as a violation.
- [x] 5.4 Write the `[coverage-gate-050]` gate test in the same file. With a guard file with `leaks: []`, assert no `GATES-TEST-LEAK` error.
- [x] 5.5 Add the `getActiveResources` input to `createGuard()`, the `leaks` list to `results()`, and the read at the `exit` event in `installGuard()`, until 5.1 and 5.2 are green. Name the test file from `process.argv[1]`, relative to the root.
- [x] 5.6 Add the `GATES-TEST-LEAK` error to `measure()` until 5.3 and 5.4 are green.
- [x] 5.7 Mutation: remove the `Timeout` filter, so `results().leaks` keeps every resource. The `[coverage-gate-050]` guard test reddens. Put it back. Report the test that reddened.
- [x] 5.8 Mutation: make `measure()` skip the `leaks` read. The `[coverage-gate-049]` gate test reddens. Put it back. Report the test that reddened.
- [ ] 5.9 Prove the chain end to end, in the gate image, with a temporary file. Add a test file under `src/` that arms `setInterval` and then fails. Run `make gates`. Confirm the output has the `fail` record for that test and one `GATES-TEST-LEAK` error with that file. Remove the file. Report the two lines.
- [ ] 5.10 Confirm a green run records no leak. Run `make gates` on the clean tree. Confirm no `GATES-TEST-LEAK` error appears for any file.

## 6. Gates and review

- [ ] 6.1 Run `make lint` until no STE error remains.
- [ ] 6.2 Run `make ratchet CHANGE=teardown-guard`. Confirm it records no new untraced name in `src/data/localGeojson.test.mjs`.
- [ ] 6.3 Run `make gates CHANGE=teardown-guard`. Confirm `scripts/spec/gates.mjs` and `scripts/spec/lib/test-guard.mjs` stay at 100%. Read the command output for the verdict, not `results.json`.
- [ ] 6.4 Run the spec-adversary and STE-adversary review. Correct the findings. Record the result in `review.md`.
