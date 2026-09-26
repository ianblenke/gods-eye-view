## Why

The layer `src/layers/cyclones/` shows the storm advisories of the National Hurricane Center on the globe. It has four code files: `source.js`, `labels.js`, `rendering.js` and `index.js`. The upstream project wrote them. They came into this project with the change `upstream-sync`.

The upstream project has no scenario IDs. The 32 tests of the layer have no tag. The ledger records these gaps for the four files:

- `index.js` has 24 branches and 2 functions that no test covers.
- `labels.js` has 1 branch that no test covers.
- `rendering.js` has 4 lines and 8 branches that no test covers.
- `source.js` has 3 lines, 16 branches and 2 functions that no test covers.
- The four test files have 32 untraced tests.

This is a backfill change. It writes a spec from what the code does now. It tags the old tests and adds tests for each line, branch and function that a test can reach.

## What Changes

- Add the capability `cyclones` with 9 requirements and the 25 scenarios `cyclones-001` to `cyclones-025`. Each requirement has `Origin: backfill`.
- Tag the 32 old tests with scenario IDs. The tag is the only change of an old name.
- Add 78 tests to the four test files of the layer. Each new test has a tag and at least one `node:assert` call.
- Run a mutation of the code for each scenario, and record the test that fails. The task list has the mutations.
- Change no production file. The change does not fix any defect and does not add any behavior.

## Capabilities

### New Capabilities

- `cyclones`: the source of the cyclone snapshot, the labels, the rendering and the layer of the cyclone advisories.

### Modified Capabilities

None.

## Impact

- Changed files: `src/layers/cyclones/source.test.mjs`, `src/layers/cyclones/labels.test.mjs`, `src/layers/cyclones/rendering.test.mjs` and `src/layers/cyclones/index.test.mjs`.
- New files: the four files of this change folder, and the spec `openspec/changes/backfill-cyclones/specs/cyclones/spec.md`.
- When you run the ratchet command, it also changes `openspec/trace/gaps.json`, `openspec/trace/ids.json`, `openspec/trace/links.json` and `openspec/trace/history.jsonl`.
- Gaps that this change opens: none.
- Gaps that this change closes, with the count before and after:
  - `src/layers/cyclones/index.js` branches: 24 before, 1 after. The one branch has the known limit `cyclones-finally-continuation`.
  - `src/layers/cyclones/index.js` functions: 2 before, 0 after. Lines stay at 0.
  - `src/layers/cyclones/labels.js` branches: 1 before, 0 after.
  - `src/layers/cyclones/rendering.js` lines: 4 before, 0 after. Its branches: 8 before, 0 after.
  - `src/layers/cyclones/source.js` lines: 3 before, 0 after. Its branches: 16 before, 0 after. Its functions: 2 before, 0 after.
  - Untraced tests: 32 before, 0 after. That is 11 in `index.test.mjs`, 4 in `labels.test.mjs`, 12 in `rendering.test.mjs` and 5 in `source.test.mjs`.
- The ledger keeps one entry for the layer: `index.js` with 1 branch. The entries of the three other files leave the ledger.
- The registry gets 25 new scenario IDs.
- The ratchet command also wrote history lines for two files that this change does not edit. `src/data/labelArbiter.js` has 50 branches not covered, and it had 52 before. This count changes between runs (`sync-counts-change-between-runs` of the change `upstream-sync`). The total number of branches of `src/data/labelArbiter.js` and of `src/overlays/worldOverlay.js` changed in the same run.
- The ledger total of branches of `src/layers/cyclones/index.js` changes from 193 to 240.

## Known limits and later changes

- `cyclones-equivalent-mutants`:
  - `005l`, `source.js`: The track and cone checks use the same coordinate count, so they reject every value above 25000.
  - `017j`, `rendering.js`: After clear, the source is null, and the next snapshot replaces the set of entity IDs.
  - `019b`, `index.js`: After disable, the pick owner returns false, and the next enable replaces its registry entry.
  - `024p`, `index.js`: After disable, the click handler is null, so the owner check rejects each old click.
  - `025m`, `index.js`: Each change of the selected storm also changes the navigation generation.
  - `025n`, `index.js`: Disable and destroy change the navigation generation before a queued flight can run.
- `cyclones-finally-continuation`: `index.js` has one branch that no test can reach. It is the end of the `try`, `catch` and `finally` statement in `update()`. Each path of the `try` and of the `catch` returns, so no path reaches the code after the `finally`. V8 counts this end as a branch with a count of 0. The change does not edit the code.
- `cyclones-destroyed-guard-redundant`: `rendering.js` tests `destroyed` in two places of `setSnapshot()`, next to `generation !== owner`. `destroy()` calls `clear()`, and `clear()` raises `generation`. So the test of `destroyed` never decides alone. A mutation that removes it survives.
- `cyclones-pick-guards-redundant`: `pickStorm()` tests `source`, `entity` and `typeof entity === 'object'`. `ownsPickId()` tests `source !== null` and `typeof id === 'string'`. A `WeakMap` and a `Set` give no match for the inputs that these tests exclude. A mutation that removes one of them survives.
- `cyclones-request-identity-redundant`: `update()` tests `request !== controller` after each wait. A newer request or `disable()` aborts the old controller first. So `controller.signal.aborted` decides alone. A mutation that removes the identity test survives.
- `cyclones-focus-guard-redundant`: the queued focus function tests `!enabled`, `destroyed` and `selectedId !== storm.id` next to `generation !== navigationGeneration`. `disable()`, `destroy()` and each change of the selection raise `navigationGeneration`. A mutation that removes one of the three tests survives.
- `cyclones-enable-guard-redundant`: `enable()` tests `!enabled`. A second call only registers the same pick owner again, and `installSelection()` refuses a second handler. The second `destroy()` of the layer also does nothing that a test can see, because the renderer is `null`. Mutations of these two guards survive.
- `cyclones-stormid-type-redundant`: `setParams()` tests `typeof params.stormId === 'string'` before it searches the snapshot. A value that is not a string never matches a storm id. A mutation that removes the type test survives.
- `cyclones-forecast-budget-shadowed`: `source.js` counts each forecast point in the limit of 25000 coordinates. The count of the track and the cone follows in the same storm, and it gives the same error. A test can reach the check of the forecast points, but no test can show that the check runs.
- `cyclones-abort-after-read-timing`: the test of an abort after the body read uses the order of the microtasks of `httpBody.js`. A change of that file can break the test with no defect in `source.js`.
- `cyclones-fake-viewer`: the tests of `index.js` and of `rendering.js` use a fake viewer, a fake click handler and a fake Cesium object. Only one test of `rendering.js` uses the real Cesium library. No test runs the layer in a browser.
- `cyclones-shared-overlay-state`: one test of `labels.js` uses the shared world overlay with no host option. It reads the entry count of the source `weather-cyclones` in module state. A later test in the same process that uses the same source would change the count.
- `cyclones-link-text-error`: a link text that is not a URL makes the validator throw a `TypeError` from the `URL` class, and not the error `Malformed cyclone snapshot`. The spec and the test say this. A person can decide to change it in a later change.
- `cyclones-info-coverage`: the row controls of a `null` snapshot show a default coverage text, and the text does not say that coverage data is not available. The tests check the text. They do not judge it.
- `cyclones-old-test-names`: the 32 old tests keep their names, and each one got only a tag. Some of these names have words that end in -ing or passive verbs, and the STE lint gives warnings for them. The rule of the owner is that an old test name does not change. A later change can decide.
