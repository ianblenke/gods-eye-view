## Context

A test's teardown matters only when the test fails. A test that passes reaches its last line and tears down. A test that fails throws before that line. `oshLayer.test.mjs` tears down on its last line in 64 tests. Thirty of those tests select a system, and the layer arms a real timer for that system's poll.

A failed assertion in one of those thirty leaves the timer live. The process cannot exit. The run prints every result and never prints its plan line.

The gate starts one `node --test` run for all main test files, through `run-parallel.mjs`. That runner waits for `close` with no deadline. The trace reporter streams one JSON line per test to a result file.

So the failed test is in the result file, and the gate never reads it. CI stops the job at 30 minutes. The artifact step keeps the file. Nobody reads it.

A synthetic probe on this branch reproduced the whole chain. One file with a test that arms a timer and then fails hangs `node --test`. The same file with the exit flag on exits with status 1.

Its exit event fires. The active-resource list names the timer at that moment. The plan line prints. That probe ran on the machine's Node, not the pinned one. Task 4.1 repeats it in the gate image.

## Goals / Non-Goals

**Goals:**
- Tear down each test of `src/data/oshLayer.test.mjs` when its assertions fail, and change no test name.
- Give the same guard to the four tests of `src/data/localGeojson.test.mjs` with the same shape.
- Make each gate test run exit when a test leaves a live timer, and keep the failed test in the result.
- Name the test file that leaves a live timer, whether the tests pass or fail.

**Non-Goals:**
- Change `src/layers/osh/index.js`. The layer clears its interval in `destroy()`. The defect is in the tests.
- Change any test name. The gap ledger records untraced names for `src/data/localGeojson.test.mjs`, and a new name stops the ratchet.
- Change `withClickCapture()` in `src/data/oshLayer.test.mjs`. Its `finally` restores a Cesium prototype. It is not the layer's teardown.
- Add a deadline to `run-parallel.mjs`. D4 rejects it.
- Change `scripts/run-unit-tests.mjs`. The proposal lists this as an open limit.

## Decisions

### D1 `t.after()` for each teardown, not `try/finally`

Each test that makes a layer registers `t.after(() => layer.destroy(viewer))`. The line goes after `fakeViewer()` and before `layer.init(viewer)`. So a throw in `init` still tears down. Remove the final `layer.destroy(viewer)` call if its only purpose is teardown. The test then ends on its last assertion.

Sixty of the 66 tests take no `t` parameter today. Each of those gains `(t)`. That is a change to the signature, not to the name. The trace gate reads the name only. The `t.after()` line adds one line per test and moves no other line.

A `try/finally` would indent 64 test bodies and make the diff unreadable. Two other test files already use `t.after()` for this same purpose. `finally` in the other suites restores a global, such as `fetch`, not a layer.

`t.after()` runs after the body settles, on a pass and on a fail. The original assertion error is the test's result. The hook does not catch it and does not change it. A throw inside the hook is a second error on the same test. That is the same rule node:test gives every `after` hook.

### D2 Keep a `destroy` call whose effect a test asserts

Two tests call `destroy()` as the behaviour under test. One asserts the data source count after the call, and one asserts that an in-flight update aborts. Both keep their call and also get the `t.after()` line.

A second `destroy()` is safe. The first call clears four internal fields or sets them to null, so the second call does nothing further. Task 2.2 lists each kept call by test name.

Two further tests make no layer at all. One throws before any source exists. One checks the layer does nothing before init or while disabled. Neither changes.

### D3 The other suites: four sites in `localGeojson.test.mjs`, none elsewhere

The facts table counted the literal `destroy(viewer)`. `localGeojson.test.mjs` writes `destroy` and a cleanup call together instead, at the tests at lines 366, 463, 472 and 690 on this branch. Three of the four end that way after their last assertion. The fourth keeps a call whose effect an assertion checks before that.

Each gains `(t)` and one destroy-and-cleanup hook line after its harness call. That is the exact line the file's other tests already use. One of the four, the disable-and-re-enable test, also keeps its own mid-test `destroy()` call. An assertion reads the settle-listener count right after it, the same pattern D2 describes for `oshLayer.test.mjs`. The hook then calls `destroy` a second time on that test.

Each other site the table lists is not a teardown. One file asserts the data source count after `destroy`. Another asserts only that `destroy` does not throw. A third already has `t.after()` in its harness.

A fourth destroys while a load is in flight and asserts the result. A fifth calls its cleanup inside `finally` already. None of these five changes.

### D4 The gate exits each run with `--test-force-exit`, and rejects a deadline

`buildTestRuns()` in `scripts/spec/gates.mjs` adds `--test-force-exit` to the main run and to each allocation run. node:test then exits the process when the tests are complete, also when a timer keeps the loop alive. The runner passes the option to each child process. The trace reporter writes the failed test's line before the process exits. The gate reads it, and `checkFailedRuns()` finds the `fail` record. The build stops with the test's name, in the time the run takes.

A deadline in `run-parallel.mjs` was the other option. This design rejects it. It needs a number. A fixed number is too short on a slow CI box and too long on a fast one.

An idle deadline needs the runner to watch the result file, and both kinds keep the hang for the length of the deadline. The exit flag is one option in one function, and the hang is gone entirely.

The option hides one signal. A test that passes and leaves a timer live hangs today. With the option alone, it passes in silence. D5 restores that signal in a readable form.

### D5 The guard records a live timer at exit

`createGuard()` in `scripts/spec/lib/test-guard.mjs` gains a `getActiveResources` input, with `process.getActiveResourcesInfo` as the default. At the `exit` event, `results()` reads the list and keeps each `Timeout` and `Immediate`. With one or more kept, `results()` has a `leaks` entry with the test file and the kept types. The test file is `process.argv[1]`, relative to the root. Each test process of a runner gets its file there. With none kept, `leaks` is an empty list.

`measure()` in `scripts/spec/gates.mjs` reads `leaks` from each guard file. It pushes one error `GATES-TEST-LEAK` for each entry, with the file. The entry is not a `violation`. So `untrueFiles()` does not read it, and no code file loses its coverage for it. The guard's `results()` shape gains the key `leaks`. The one `deepEqual` on that shape in `src/tooling/spec/testGuard.test.mjs` changes with it.

`process.getActiveResourcesInfo()` lists the resources that keep the loop alive. An `unref()` timer is not in it. A pipe to the reporter is a `PipeWrap`, and the filter drops it. The runner process holds its children as `ProcessWrap`, and the filter drops those too. The probe in Context showed `["PipeWrap","PipeWrap","Timeout"]` for the test file that left a live timer.

### D6 Options that this design rejects, and why

- **A fixture suite as a gate over the real suites.** A fixture file shows what node:test does with a live timer. It does not read `src/data/oshLayer.test.mjs`. It fails or passes the same way before and after the fix. It cannot fail today and pass after the fix. The fixture is the right tool for one thing: to prove the gate's own option, in `coverage-gate-048`.
- **A second run of every suite with each first assertion forced to fail.** The guard already wraps `node:assert`, so the injection is possible. It doubles the run. It misses a bare `assert()` call and a named import. It conflicts with the assertion counts of `coverage-gate-045`. Too much gate for one class of test defect.
- **A static rule on `destroy` inside a test body.** Five sites across four suites call `destroy` as the behaviour under test. A rule needs a list of exceptions, and it reads names only. `env.cleanup()` and `globalThis.fetch = original` are teardown too, and the rule cannot know them.
- **`unref()` on the poll interval in the layer.** A browser has no `unref()`. The layer is correct. The test skipped its teardown.
- **A scenario for the mechanical half.** No gate can see an unguarded teardown on a run where the tests pass. The named mutation in task 2.4 checks the rule that a test tears down when it fails, not a scenario.

## Files

- `src/data/oshLayer.test.mjs`: one `t.after()` line in each of the 64 tests that make a layer. `(t)` on the 60 signatures without it. Remove the final `destroy` calls whose only purpose is teardown. Task 2.2 records the exact counts.
- `src/data/localGeojson.test.mjs`: four `t.after()` lines, four signatures, three final teardown pairs removed.
- `scripts/spec/gates.mjs`: `buildTestRuns()` and `measure()`.
- `scripts/spec/lib/test-guard.mjs`: `createGuard()` and `installGuard()`.
- `scripts/spec/lib/trace-reporter.mjs`: `findOwnDestination()` and its `AbortSignal` self-registration guard.
- `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/testGuard.test.mjs`: the tests of `coverage-gate-048` to `coverage-gate-050`.
- `src/tooling/spec/traceReporter.test.mjs`: the tests of `coverage-gate-051` and `coverage-gate-052`.
- `openspec/specs/coverage-gate/spec.md`: two ADDED requirements.

## How the gates measure this change

Coverage: `scripts/spec/gates.mjs`, `scripts/spec/lib/test-guard.mjs` and `scripts/spec/lib/trace-reporter.mjs` stay at 100% line, branch and function coverage. The `getActiveResources` input makes the leak branch testable without a real leak. Trace: each new scenario has one tagged test. Spec lint: `tasks.md` names each of the five IDs. STE lint: each prose file. The ratchet: no untraced name is new in any pre-spec file.
