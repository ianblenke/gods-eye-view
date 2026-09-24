## Context

The test guard reads `process.getActiveResourcesInfo()` when a test process exits, and the gate `GATES-TEST-LEAK` reports each live timer. The gate starts each test process with a force-exit flag. A timer that is live at that moment is a leak. It does not matter what the timer does later.

The leaks of the three files show on the GitHub runner (Ubuntu 24.04, four CPUs, Node 24.21.0). The gates in the Docker image use the same Node version and pass. The likely cause of the difference is the time at which each timer fires, and no run measured it. A timer that fires before the process exits is not live.

The lead pushed a temporary branch with a tracer to a fork of the repository on GitHub. The tracer records the creation stack of each timer with `async_hooks`, and it lists the timers that are live at exit. The first version of the tracer also listed timers that fired before the exit. The list of active resources from the runtime showed which timers were live, and it agreed with the gate. The tracer then skipped destroyed timers.

## Goals / Non-Goals

**Goals:**
- Remove each live timer that the gate names, in the three files.
- Keep every test name and every assertion.

**Non-Goals:**
- Change a production code file. Every timer that the tracer named is a timer of Vite or of the flights layer, and a test starts both.
- Change the gate or the force-exit flag.
- Add a scenario. The requirement of `coverage-gate` already checks for a live timer.

## Decisions

### D1 Stop the Vite features that a test does not need

Two Vite timers are live in `src/tooling/previewServing.test.mjs` on the runner. The dependency optimizer starts a timer of 200 ms in `runOptimizer` and a timer of 50 ms in `waitForRequestsIdle`. When the optimizer does not run, a third timer shows: the file watcher throttles its directory reads for 1000 ms.

The two tests in `src/tooling/previewServing.test.mjs` serve a fixture page and provider JSON. The page has no script, so they need no dependency optimizer and no file watcher. Each Vite config now sets `noDiscovery` to true and `include` to an empty list under `optimizeDeps`. It also sets `watch` to null under `server`. The test in `src/data/trafficTiming.test.mjs` starts a Vite server in middleware mode over the project root. It loads one module with `ssrLoadModule`, and it gets the same three settings.

A longer wait after `server.close()` is a fix that this change does not use. `src/data/trafficTiming.test.mjs` already waits 750 ms, and the leak still showed on the runner in some runs. A wait lets a short timer fire, but it does not stop a long timer. The wait remains in that file, because the source of Vite 6.4.3 shows that a module request can still start a timer of 50 ms. No run of this change confirmed it.

### D2 A mock timer for the flights enrichment

The `flights` fleet-loader test in `src/data/trackedModelRegime.test.mjs` calls the fleet loader of the flights layer. The loader queues a type enrichment and sets one drip timer of about 165 ms. The layer clears that timer only in its own teardown, and the test does not run the teardown. The `militaryFlights` test sets no timer. It gets the same mock, because both tests use one test body.

A mock `setTimeout` from the test context makes no real timer. The mock resets at the end of each test. The layer keeps the mock timer in `_enrichDripTimer` until its teardown, so the enrichment queue does not drain in the later tests of this file. No later test needs a drained queue, and no test in the file waits for a real timer. A change to the layer, such as a cleanup on abort, is a code change, and this change makes none.

### D3 The evidence is a run on the runner

The acceptance test is to run the gate `GATES-TEST-LEAK` the way CI runs it. The runner ran `node scripts/spec/gates.mjs ci` on the fix branch, without the tracer. The run listed no `GATES-TEST-LEAK`. On the same branch, the tracer listed no pending timer for the three files, and `npm run format:check` printed no error.

The gates run reported errors only for the tracer file and for a temporary workflow file. This change does not contain those two files. The gates on a branch without the fixes listed `GATES-TEST-LEAK` for the three files. So the two runs show the fault and the fix.

## How the gates measure this change

Coverage: no code file changes. The mock timer stops the drip callback of `src/layers/flights/enrichment.js` from running in `src/data/trackedModelRegime.test.mjs`, so a coverage total of that file can move. The gates in the Docker image reported no ledger change.

Trace: no test name changes, no scenario changes and no gap changes. The ratchet has nothing to record, and `make gates` confirms it with no stale-trace error.

The gate `GATES-TEST-LEAK` must name none of the three files. `npm run format:check` must pass. The gates in the Docker image and on the runner run the same test files.

## Risks / Trade-offs

- **A leak that depends on the time at which a timer fires can come back.** A future test can leave a timer that fires early on a fast machine. The tracer method of this design finds it on the runner.
- **With `noDiscovery`, a test cannot find a dependency problem.** This is unlikely to matter: the two tests in `src/tooling/previewServing.test.mjs` serve fixture pages and provider JSON, and the test in `src/data/trafficTiming.test.mjs` loads one module. None of the three tests checks the optimizer.
- **A mock timer can remove a timer that a test needs.** No test in `src/data/trackedModelRegime.test.mjs` waits for a real timer. The whole file passes with the same assertions.

## Migration Plan

None. Each change is in a test file.

## Open Questions

None.
