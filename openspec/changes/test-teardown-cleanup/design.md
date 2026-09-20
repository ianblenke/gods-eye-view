## Context

`teardown-guard` added `GATES-TEST-LEAK`: each guarded test run now exits with `--test-force-exit`, and the gate records the file whose process still holds a live `Timeout` or `Immediate` at exit. `make ratchet` ran this check against the whole project for the first time and found seven files with a live timer at exit, none of them files `teardown-guard` touches.

Each finding is a test that races a fast path against a fixed-delay `setTimeout`, or that awaits a delay directly, and never clears it once the test has moved past it. A run with no force-exit flag hid this: the process still exited, once the dangling timer itself fired, so the only cost was a slower run. `--test-force-exit` now ends the process the moment the file's tests settle, and a timer still armed at that moment is what the gate now reports.

## Goals / Non-Goals

**Goals:**
- Clear the timer or interval that outlives its test, in each of the seven named files.
- Change no test name and no assertion. The fix removes a stray resource; it does not change what a test checks.

**Non-Goals:**
- Change any production code file. Every finding is in test code.
- Change the gate, the guard, or the `--test-force-exit` option. `teardown-guard` owns those.
- Add a scenario. This change fixes a defect the existing `coverage-gate` requirement already checks for; it adds no new rule.

## Decisions

### One fix shape per file, not one shared helper

The seven leaks take two shapes: a direct `await new Promise((resolve) => setTimeout(resolve, N))` that a failed assertion can skip past without ever settling, and a `Promise.race` (or equivalent) where the losing side's `setTimeout` keeps running after the winning side resolves. The first shape is fixed by moving the wait behind whatever guard already exists, or by clearing it in a `t.after()`/`finally`. The second is fixed by capturing the timer id and calling `clearTimeout` once the race settles, on whichever side loses.

A single shared teardown helper was considered and rejected: the seven files have no other test-harness code in common, and a helper built for seven unrelated call shapes would carry more branches than the fix it replaces.

### `src/tooling/spec/testGuard.test.mjs`'s leak is found by repetition, not by a single clean run

A single isolated run of this file left no leak in `results().leaks` (confirmed by reproducing `teardown-guard`'s own guard environment against the file directly). The leak only appeared once, inside the full project run's concurrency. The fix locates the exact test by running the file repeatedly, and alongside the rest of the suite, rather than from one clean reproduction — the same diagnostic gap `teardown-guard`'s own `leak-report-timers-only` known limit already names for resources the guard does not track.

## How the gates measure this change

Coverage: no code file changes, so no coverage requirement moves. Trace: no new scenario, no requirement text change, so the trace gate sees no new tag to place. Spec lint and STE lint run on `proposal.md`, `design.md` and `tasks.md` as on any change. The ratchet's new `GATES-TEST-LEAK` check is the acceptance test: it names all seven files today, and it must name none of them after this change, with `make ratchet CHANGE=test-teardown-cleanup` recording no new untraced test name in the process.

## Risks / Trade-offs

- **A timer this change clears was doing useful work.** Unlikely for the shapes found: each is a fixed delay used as a "wait" or a "give up" case, not a repeating poll a feature depends on. Each file's own test run, and the mutation proof in `tasks.md`, confirms the same tests pass after the clear.
- **`testGuard.test.mjs`'s leak stays unproven if it does not reproduce again.** If several repeated runs and a run under load find nothing, `tasks.md` 8.1 calls for reporting that instead of guessing at a fix with no failing case to prove it against.
