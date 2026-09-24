## Context

The gate `GATES-TEST-LEAK` reads `process.getActiveResourcesInfo()` when a test process exits. Each guarded run uses a force-exit flag. A timer that is live at that moment is a leak, whatever it does later.

The three leaks show only on the GitHub runner (Ubuntu 24.04, four CPUs, Node 24.21.0). The gates in the Docker image use the same Node version and pass. The difference is timing. A timer that has fired before the process exits is not live.

The lead pushed a temporary branch with a tracer to the fork. The tracer records the creation stack of each timer with `async_hooks`, and it lists the timers that are live at exit. The first version of the tracer also listed timers that had already fired. The runtime list of active resources settled that: it agreed with the gate, and the tracer then skipped destroyed timers.

## Goals / Non-Goals

**Goals:**
- Remove each live timer that the gate names, in the three files.
- Keep every test name and every assertion.

**Non-Goals:**
- Change a production code file. Every leak is in test code, or in a library that a test starts.
- Change the gate or the force-exit flag.
- Add a scenario. The requirement of `coverage-gate` already checks for a leaked timer.

## Decisions

### D1 Turn off what a test does not need in Vite

Two Vite timers are live in `src/tooling/previewServing.test.mjs` on the runner. The dependency optimizer arms a timer of 200 ms in `runOptimizer` and a timer of 50 ms in `waitForRequestsIdle`. With the optimizer off, a third timer shows: the file watcher throttles its directory reads for 1000 ms.

The page of each fixture has no script, so the tests need no dependency discovery and no file watcher. Each Vite config now sets `noDiscovery` to true and `include` to an empty list under `optimizeDeps`. It also sets `watch` to null under `server`. The test in `src/data/trafficTiming.test.mjs` starts a Vite server in middleware mode over the project root, and it gets the same two options.

A longer wait after `server.close()` is the other fix. `src/data/trafficTiming.test.mjs` already waits 750 ms, and the leak still showed once under load. A wait does not remove a timer, so this change does not extend it.

### D2 A mock timer for the flights enrichment

The two fleet-loader tests in `src/data/trackedModelRegime.test.mjs` call the fleet loader of a flights layer. The loader queues a type enrichment. The queue parks one drip timer of about 165 ms. The layer clears that timer only in its own teardown, and these tests do not run it.

A mock `setTimeout` from the test context keeps the real event loop free of this timer. The mock resets at the end of each test. No test in the file waits on a real timer. A change to the layer, such as a cleanup on abort, is a code change, and this change makes none.

### D3 The evidence is a run on the runner

The acceptance test is the gate `GATES-TEST-LEAK`, run as CI runs it. The fix branch ran on the runner with the plain gates against `HEAD`. The run listed no `GATES-TEST-LEAK` and no formatting error. Its only errors were the two temporary diagnostic files, which this change does not contain.

## How the gates measure this change

Coverage: no code file changes, so no coverage total moves. Trace: no test name changes, and the ratchet must record no new untraced test name.

The gate `GATES-TEST-LEAK` must name none of the three files. `npm run format:check` must pass. The Docker image gates and the runner both run the same test files.

## Risks / Trade-offs

- **A leak that depends on timing can come back.** A future test can leave a timer that fires early on a fast machine. The tracer method of this design finds it on the runner.
- **`noDiscovery` hides a dependency problem.** Unlikely: the three tests serve fixture pages and provider JSON. They do not test the optimizer.
- **A mock timer hides a timer that a test needs.** No test in `src/data/trackedModelRegime.test.mjs` awaits a real timer. The whole file passes with the same assertions.

## Migration Plan

None. Each change is in a test file.

## Open Questions

None.
