## Why

`teardown-guard` gave the gate a new check. Each guarded test run exits with `--test-force-exit`. The gate records `GATES-TEST-LEAK` for a file with a process that leaves a live timer at exit. The check ran against the whole project for the first time. It found seven files that leave a live timer. `teardown-guard` itself does not touch any of the seven.

Each of these tests races a fast path against a timer, or waits on a fixed delay. None clears the timer once the test moves past it. A plain `node --test` run used to hide this. Such a run has no force-exit flag, so it waits for the live timer anyway, and the process still exits, just later. The force-exit flag now ends the process as soon as the file's last test settles. A live timer at that moment is the leak the gate records.

## What Changes

- Clear the timer or interval that outlives its test, in each of the seven files below. No test name changes. No file adds an assertion, except one line noted under Impact.
- Prove each fix with the mutation method `teardown-guard` used. Run the file with the force-exit flag and the tap reporter. Confirm the plan line prints and the active-resource list is clean after the fix. Confirm both were not true before it.

## Impact

- Changed test files, each proven leak-free under the force-exit flag:
  - `src/sharelink.celestial.test.mjs`
  - `src/tooling/localServices.test.mjs`
  - `src/voice/gevRealtime.test.mjs`
  - `src/annotations/annotationEngine.test.mjs`
  - `src/data/manager.test.mjs`
  - `src/data/militaryInstallations.test.mjs`
  - `src/tooling/spec/testGuard.test.mjs`
- No code file changes. No requirement changes. No new scenario. No spec delta.
- No test name changes anywhere in scope.
- `src/annotations/annotationEngine.test.mjs` gains one assertion. Two earlier drafts of its fix each skipped, in a different way, the real retry wait `isStale()` reads `clear()`'s generation counter after. The final fix mocks the clock instead of clearing a real timer, and the new assertion confirms the read happens. This is the one exception to "no assertion changes" in this whole change. `design.md`'s D1 has the full account.

## Known limits

- `src/tooling/spec/testGuard.test.mjs`'s leak did not reproduce in one isolated run of the file. It surfaced once, under the full project run's own concurrency. The fix locates it by many runs of the file's child-process tests under load instead. That means several repeats, and a run beside the rest of the suite, not one clean reproduction.
