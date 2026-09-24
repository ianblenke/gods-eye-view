## Why

The CI workflow of `main` failed on each push from 2026-09-22 to 2026-09-24. Two faults remain in the last three runs. Both faults are in test files.

The first fault: `npm run format:check` names `src/tooling/previewServing.test.mjs`. This check is a step of the jobs "Node 24.14.0", "Node 26.x" and "Windows onboarding". When the check fails, the job stops and the later steps do not run.

The second fault: the gate `GATES-TEST-LEAK` fails in the job "Spec gates". It names three test files: `src/data/trackedModelRegime.test.mjs` (one live timer), `src/tooling/previewServing.test.mjs` (two) and `src/data/trafficTiming.test.mjs` (one, on some runs only).

The gates in the Docker image did not show the second fault. `make gates` does not run the format check. So `make gates` passed while CI failed.

A tracer on the GitHub runner named the timers of `src/tooling/previewServing.test.mjs` and `src/data/trackedModelRegime.test.mjs`. The gate starts each test process with a force-exit flag. A timer that does not fire before the process exits remains live. The likely cause of the difference is the time at which each timer fires on each machine. No run measured it. So the gates in the Docker image did not show the second fault.

## What Changes

- Format `src/tooling/previewServing.test.mjs` with the project formatter.
- In `src/tooling/previewServing.test.mjs`, set the options that stop the dependency optimizer and the file watcher in each Vite dev server that the tests start.
- Set the same options in `src/data/trafficTiming.test.mjs` for its Vite server, and correct the comment about its wait.
- In `src/data/trackedModelRegime.test.mjs`, enable a mock `setTimeout` in the fleet-loader test body. The body runs once for `flights` and once for `militaryFlights`. Without the mock, the `flights` test leaves a live timer.
- No test name changes. No assertion changes. No code file changes. No spec delta.

## Impact

- Changed test files: `src/tooling/previewServing.test.mjs`, `src/data/trafficTiming.test.mjs` and `src/data/trackedModelRegime.test.mjs`.
- One run of the gates on the GitHub runner, without the tracer, listed no `GATES-TEST-LEAK`.
- On the same branch, the tracer on the runner listed no pending timer for the three files, and `npm run format:check` printed no error.
- The tracer in the Docker image listed no `Timeout` for `src/tooling/previewServing.test.mjs` and `src/data/trackedModelRegime.test.mjs`.
- Gaps that this change opens or closes: none.
- The change removes the two faults. It does not change what a job checks.

## Known limits and later changes

- `gates-skip-ci-steps`: `make gates` does not run `npm run format:check` or `npm run check:boundaries`, and CI runs both. A later change can add them to `make gates`.
- `leak-is-timing-dependent`: a timer is a leak only when it is live at process exit. The three files passed on the runner after this change. A new test can leave a timer, pass in the Docker image and fail on the runner.
- `local-gates-cannot-prove-it`: if you revert one fix, `make gates` in the Docker image still passes. The proof is a run on the GitHub runner. The tracer branch was temporary, and this repository does not keep it.
- `trafficTiming-timer-unnamed`: the tracer named no timer for `src/data/trafficTiming.test.mjs`, because this file leaks on some runs only. The fix stops the two Vite features that started timers in the other tests. The wait of 750 ms remains, because the source of Vite 6.4.3 shows that a module request can still start a timer of 50 ms. No run confirmed it. One run on the runner then showed no leak.
- `flights-drip-timer-mocked`: the mock replaces the drip timer of the flights layer with a mock timer. This change adds no cleanup to the layer. The layer clears the drip timer only in its own teardown. The `militaryFlights` test has no such timer, and it gets the mock only because it shares the test body.
- `enrichment-queue-stops`: after the mock, the layer keeps the mock timer in `_enrichDripTimer` until its teardown. The enrichment queue does not drain in the later tests of `src/data/trackedModelRegime.test.mjs`. No later test needs a drained queue.
- `enrichment-coverage-moves`: the mock does not run the drip callback of `src/layers/flights/enrichment.js` in `src/data/trackedModelRegime.test.mjs`. A coverage total of `src/layers/flights/enrichment.js` can move. The gates in the Docker image reported no ledger change.
