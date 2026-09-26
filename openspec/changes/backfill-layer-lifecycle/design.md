## Context

Commit `d53b57c755cbc168944d4d2280414569e7c64c5b` has no direct test for two error paths in `src/data/lifecycle.js`. The selected test set gives 177 to 186 uncovered lines. The two paths account for nine lines.

## Goals

- Reach both error paths in each test run.
- Check the result, layer state, activity event, and warning text after a failed destroy.
- Check that an error from one activity listener does not stop the next listener.
- Kill a code mutation for each result that the tests claim.

## Non-goals

- Change production code or old test names.
- Fix the branch records of other files or the message time of the AIS store.

## Decisions

### D1 Use the manager test file

Add the tests to `src/data/manager.test.mjs`. This file has the manager fixture and tests for layer removal and activity events. A new file would add one test process with no need.

### D2 Check the source of state

Each test reads the entry after `destroyLayer()` returns. The destroy function changes the intent, and the test sets a transition state. The test checks that the catch resets both values. It also checks the `status` event.

### D3 Check both destroy failures

One test uses a destroy result of `false`. One test uses a thrown error. Each test checks the same result and warning text. The tests restore `console.warn` after the call.

### D4 Compare literal results

The tests compare results with literal values from the spec. They do not use a constant from the code as the expected value.

## How the gates measure the requirement

- The trace gate checks the two IDs and the `node:assert` calls in the tagged tests.
- The coverage gate counts lines and branches in `src/data/lifecycle.js`.
- The STE lint checks these documents and tagged test names.
- The host test run and mutation log check the two error paths. The gate uses Node 24; the host run uses Node 26.

## Stability on the host

The selected set has 14 test files. Each row counts a complete run with a hit on every line of the path.

| Path | Before, plain | Before, CPU load | After, plain | After, CPU load |
|---|---:|---:|---:|---:|
| Destroy catch, lines 2156 to 2162 | 0 of 20 | 5 of 20 | 20 of 20 | 20 of 20 |
| Activity catch, lines 2320 to 2321 | 2 of 20 | 3 of 20 | 20 of 20 | 20 of 20 |

All 40 new runs exit with code 0. Each run has 177 uncovered lines in `src/data/lifecycle.js`. The nine mutations in `muts.json` all make a tagged test fail. The raw host logs are in `/home/ianblenke/docker/gev-tools/steady-lifecycle/`.

## Files

- `openspec/changes/backfill-layer-lifecycle/` has this proposal, design, tasks, and delta spec.
- `src/data/manager.test.mjs` gets the new tests.
- `openspec/trace/` can change when the ratchet command runs.
