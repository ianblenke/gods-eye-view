## Context

`teardown-guard` added `GATES-TEST-LEAK`. Each guarded test run now exits with a force-exit flag. The gate records the file with a process that still holds a live timer at exit. `make ratchet` ran this check against the whole project for the first time. It found seven files with a live timer at exit. None of the seven are files that `teardown-guard` touches.

Each finding is a test that races a fast path against a fixed-delay timer, or that awaits a delay directly. Each never clears its timer once the test has moved past it. A run with no force-exit flag hid this. The process still exited, once the live timer itself fired, so the only cost was a slower run. The force-exit flag now ends the process the moment the file's tests settle. A live timer at that moment is what the gate now reports.

## Goals / Non-Goals

**Goals:**
- Clear the timer or interval that outlives its test, in each of the seven named files.
- Change no test name and no assertion. The fix removes a live timer. It does not change what a test checks.

**Non-Goals:**
- Change any production code file. Every finding is in test code.
- Change the gate, the guard, or the force-exit flag. `teardown-guard` owns those.
- Add a scenario. This change fixes a defect the coverage-gate requirement already checks for. It adds no new rule.

## Decisions

### One fix shape per file, not one shared helper

The seven leaks take two shapes. The first is a direct await on a fixed delay, one a failed assertion can skip past before it ever settles. The second is a race between two paths, where the timer on the side that loses stays live after the side that wins resolves. The fix for the first shape moves the wait behind whatever guard already exists, or clears the timer inside a hook that always runs. The fix for the second shape captures the timer id and clears it once the race settles, on whichever side loses.

This change considered and rejected a single shared teardown helper. The seven files share no other test-harness code. A helper built for seven unrelated call shapes would carry more branches than the fix it replaces.

### The `testGuard.test.mjs` leak is found by repetition, not by one clean run

One isolated run of this file left no leak in the guard's own result. `teardown-guard`'s own guard environment, run directly against the file, confirmed this. The leak only appeared once, inside the full project run's own concurrency. The fix locates the exact test by many runs of the file, and beside the rest of the suite, rather than from one clean reproduction. This gap matches the one `teardown-guard`'s own known limit already names, for a resource type the guard does not track.

## How the gates measure this change

Coverage: no code file changes, so the ledger's per-file gap count does not move for any file this change does not test. A test-only change can still move a coverage total for a file it exercises differently. `src/data/groundFloor.js` gains one covered branch here. Its own source is byte-identical before and after, and its open-gap count stays the same. Trace: no new scenario, no requirement text change, so the trace gate sees no new tag to place. Spec lint and STE lint run on this change's own prose files, as on any change.

The new `GATES-TEST-LEAK` check is the acceptance test. It names all seven files today. It must name none of them once this change lands. `make ratchet` for this change must record no new untraced test name in the process.

## The commands the tasks name in prose

The diagnostic run and the mutation proof of `tasks.md` both use one command shape, run inside the gate image:

```
node --test --test-force-exit --test-reporter=tap <file>
```

A run under a 60-second limit uses the `timeout` command in front of it. A plain run to confirm a fix keeps every test's name and assertion uses `node --test <file>` alone, with neither flag.

## Risks / Trade-offs

- **A cleared timer did useful work.** Unlikely for the shapes found. Each is a fixed delay used as a wait, or a give-up case, not a poll that a feature depends on and that repeats. Each file's own test run, and the mutation proof in `tasks.md`, confirms the same tests pass after the clear.
- **The `testGuard.test.mjs` leak stays unproven if it never happens again.** If several repeats, and a run under load, find nothing, `tasks.md` task 8.1 calls for a report of that fact. It does not call for a guess at a fix with no case that fails, to prove it against.
