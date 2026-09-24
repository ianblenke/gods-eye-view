## Why

The CI workflow of `main` failed on each push from 2026-09-22 to 2026-09-24. Two faults remain in the last three runs. Both faults are in test files.

The first fault: `npm run format:check` names `src/tooling/previewServing.test.mjs`. This check is the first step of the Node 24, Node 26 and Windows jobs, so those jobs stop there.

The second fault: the gate `GATES-TEST-LEAK` fails in the job "Spec gates". It names three test files: `src/data/trackedModelRegime.test.mjs` (one live timer), `src/tooling/previewServing.test.mjs` (two) and `src/data/trafficTiming.test.mjs` (one, not on each run). The gates that run in the Docker image showed neither fault, so `make gates` passed while CI failed.

A tracer on the GitHub runner named each timer. Each test process exits with a force-exit flag, and a timer that has not yet fired at that moment stays live. A faster or slower machine changes which timers have fired by then. This is why the local run hid the fault.

## What Changes

- Format `src/tooling/previewServing.test.mjs` with the project formatter.
- In `src/tooling/previewServing.test.mjs`, turn off the dependency discovery and the file watcher of each Vite dev server that the tests start.
- Make the same change in `src/data/trafficTiming.test.mjs` for its Vite server.
- In `src/data/trackedModelRegime.test.mjs`, use a mock `setTimeout` in the two fleet-loader tests. The flights layer parks a drip timer in these tests, and the real one stays live.
- No test name changes. No assertion changes. No code file changes. No spec delta.

## Impact

- Changed test files: `src/tooling/previewServing.test.mjs`, `src/data/trafficTiming.test.mjs` and `src/data/trackedModelRegime.test.mjs`.
- Each fix is proven leak-free with the tracer on the GitHub runner, and with the gates in the Docker image.
- Gaps that this change opens or closes: none.
- The change makes the CI jobs pass on `main` again. It does not change what a job checks.

## Known limits and later changes

- `gates-skip-ci-steps`: `make gates` does not run `npm run format:check` or `npm run check:boundaries`, and CI runs both. A later change can add them to the local command.
- `leak-is-timing-dependent`: a leaked timer shows only when it has not fired at process exit. The three files pass on the runner after this change. A new test that leaves a timer can still pass on one machine and fail on another.
- `trafficTiming-timer-unnamed`: the tracer named no timer for `src/data/trafficTiming.test.mjs`, because this file leaks on some runs only. The fix removes the same two sources that the other Vite tests had. One run on the runner then showed no leak.
