## Why

`src/data/oshLayer.test.mjs` calls `layer.destroy(viewer)` after the last assertion of each test. A failed assertion throws before that call. The layer's poll interval stays armed. `node --test` cannot exit while a timer is live. The run prints `not ok` for the failed test and `ok` for the tests after it. The run never prints its plan line, because the process never ends.

Each consumer that waits for the process to end loses the whole result. CI is such a consumer. Each mutation harness that reads stdout at exit is such a consumer. So a real regression in the layer reaches CI as a build timeout, not as a failed test. A timeout reads as an infrastructure fault and gets a retry. Five mutants returned no readable result across two batteries before the review found this cause.

Six other layer suites already guard their teardown with `t.after()` or `finally`. This file is the outlier. Four tests in `src/data/localGeojson.test.mjs` have the same shape and get the same guard.

A guard in one test file does not prevent teardown defects in other test files. A new test file can make the same mistake next month. So this change also makes the gate exit each test run, read the result, and name the file that left a live timer.

## What Changes

- Register `t.after(() => layer.destroy(viewer))` in each test of `src/data/oshLayer.test.mjs` that makes a layer. Remove the final `layer.destroy(viewer)` call if its only purpose is teardown. Keep each `destroy` call whose effect a test asserts. No test name changes.
- Give the same guard to four tests of `src/data/localGeojson.test.mjs`. Three tear down after their last assertion. The fourth also keeps a mid-test `destroy` call whose effect an assertion checks. No test name changes.
- Start each gate test run with `--test-force-exit`. The run then exits when a test leaves a live timer. The result file keeps the record of the failed test.
- Record each timer or immediate that keeps the event loop alive when a guarded test process exits. The gate stops the build for that record and names the test file.
- Add two requirements to `coverage-gate`: "Run exit" with scenarios `coverage-gate-048`, `coverage-gate-049` and `coverage-gate-050`; and "Trace record durability" with scenarios `coverage-gate-051` and `coverage-gate-052`. The second requirement guards the trace reporter's own destination file against loss under `--test-force-exit`.

## Impact

- Changed test files: `src/data/oshLayer.test.mjs` and `src/data/localGeojson.test.mjs`. No test name changes in either file. `src/data/localGeojson.test.mjs` has a ledger entry with untraced names, and that entry does not change.
- Changed code files, each at 100% coverage after the edit: `scripts/spec/gates.mjs`, `scripts/spec/lib/test-guard.mjs` and `scripts/spec/lib/trace-reporter.mjs`.
- Changed gate tests: `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/testGuard.test.mjs` and `src/tooling/spec/traceReporter.test.mjs`. Each new test carries a tag from this change.
- No gap opens in `openspec/trace`. No gap closes. No new source file.
- This change adds two requirements. It changes no text in the base requirements.
- The gate result folder gains one record type. A guard result file gains the key `leaks`.

## Known limits closed

- `oshLayer-teardown-unguarded`: closed. Each test in the file tears down when its assertions fail.
- `gate-hang-on-failed-test`: closed. A failed test with a live timer stops the build with its name, in the time the run takes.

## Known limits left open

- `npm-test-no-force-exit`: `npm test` does not pass `--test-force-exit`. A local run of a file with an unguarded teardown and a failed test still hangs. No capability owns the `npm test` command, and one option is not worth a new capability. Run `node --test --test-force-exit <file>` to read the result of such a file.
- `leak-report-timers-only`: the guard records a `Timeout` and an `Immediate` only. A test that leaves a socket, a child process or a file handle open keeps the loop alive in the same way. The gate exits that run, but records no leak for it. The failed test in that run is still in the result file.
- `green-leak-is-a-red-build`: a test that passes and leaves a live timer now stops the build with the file name. Today such a test hangs the run. This is a change in what a build shows, not in what passes.
- `traffic-timing-wait-unproved`: `src/data/trafficTiming.test.mjs` waits 750ms after `close()` before its process can exit. `vite`'s own `close()` resolves before its internal teardown finishes on its own tick, and exposes no event or promise this test can await instead. The wait held across several whole-project runs, but the leak never reproduced on demand, so no mutation test can prove this correction. The wait stays as an unproved mitigation until `vite` gives a verifiable completion signal.
