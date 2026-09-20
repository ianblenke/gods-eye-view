## Why

`teardown-guard` gave the gate a new check: each guarded test run exits with `--test-force-exit`, and the gate records `GATES-TEST-LEAK` for any file whose process leaves a live `Timeout` or `Immediate` at exit. The check ran against the whole project for the first time and found seven files that leave a live timer, none of them touched by `teardown-guard` itself.

Each of these tests races a fast path against a timer, or waits on a fixed delay, without clearing the timer once the test moves past it. `node --test` used to hide this: a run with no force-exit flag waits for the timer anyway, so the process still exits, just later. `--test-force-exit` now ends the process as soon as the file's last test settles, and a timer still armed at that moment is the leak the gate records.

## What Changes

- Clear the timer or interval that outlives its test in each of the seven files below. No test name changes. No assertion changes.
- Prove each fix with the same mutation `teardown-guard` used: run the file with `node --test --test-force-exit --test-reporter=tap <file>`, confirm the plan line and the active-resource list are clean after the fix, and confirm they were not clean before it.

## Impact

- Changed test files, each proven leak-free under `--test-force-exit`:
  - `src/sharelink.celestial.test.mjs`
  - `src/tooling/localServices.test.mjs`
  - `src/voice/gevRealtime.test.mjs`
  - `src/annotations/annotationEngine.test.mjs`
  - `src/data/manager.test.mjs`
  - `src/data/militaryInstallations.test.mjs`
  - `src/tooling/spec/testGuard.test.mjs`
- No code file changes. No requirement changes. No new scenario. No spec delta.
- No test name changes anywhere in scope.

## Known limits

- `src/tooling/spec/testGuard.test.mjs`'s leak did not reproduce in an isolated single run of the file; it surfaced only once, under the full project run's concurrency. The fix locates it by running the file's child-process tests individually under load (repeated runs, or alongside the rest of the suite) rather than from a single clean reproduction.
