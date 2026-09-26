## Context

The layer `src/layers/cyclones/` came from the upstream project with the commit `0251c74`. It has four code files that work as one chain:

- `source.js` reads `/api/cyclones` and checks the snapshot. `src/standalone/layerSources.js` creates it.
- `index.js` is the layer. It keeps the snapshot, the selection and the row controls. `src/app/constructCatalog.js` creates it with the source as its `feed`.
- `rendering.js` draws the Cesium entities of the snapshot, and it hides them beyond the horizon.
- `labels.js` publishes the storm cards and the lead-hour labels to the shared world overlay.

The ledger has gaps for all four files, and 32 untraced tests. The tests use `node:test`, fake objects and one real Cesium object. The gates run in the image `gods-eye-view:upstream`.

## Goals

- Write a spec for the layer from the behavior that the code and the tests show now.
- Give each old test a scenario ID.
- Bring each code file to 100% lines, branches and functions, where a test can reach the code.
- Prove each scenario with a mutation of the code that makes a test fail.

## Non-goals

- Do not change a production file. A defect that the tests show goes to the report of the change.
- Do not add a behavior or change a text of the layer.
- Do not rename an old test, except to add its tag.
- Do not add a new test file. Keep the tests in the four test files.

## Decisions

### D1 One capability for the four files

The four files make one feature. The layer needs the source, the renderer and the labels, and a person reads them in that order. So the spec has one capability, `cyclones`, with 9 requirements:

- Snapshot projection, snapshot bounds and snapshot acquisition describe `source.js`.
- Storm labels describes `labels.js`.
- Storm geometry on the globe and renderer ownership and release describe `rendering.js`.
- Layer life cycle, layer data states and storm selection describe `index.js`.

### D2 Scenario size

There are 25 scenarios. A scenario is one behavior with one WHEN line. The scenarios of the validator have long lists of AND lines, because the tests use one table of wrong values for each scenario. One scenario has some tests. A test has at most three IDs.

The spec says only what a test checks. A scenario line that no test checks is a fault of this change. The task list names the mutation for each scenario.

### D3 Test doubles

- `source.test.mjs` uses fake `fetch` functions and `Response` objects. It mocks the timers of `node:test` for the deadline. No test makes a network request.
- `labels.test.mjs` uses a fake host, and one test uses the real world overlay module.
- `rendering.test.mjs` uses a fake Cesium object and a fake viewer. One old test uses the real Cesium library.
- `index.test.mjs` uses a fake renderer, a fake click handler and a fake canvas. New tests replace the global `matchMedia` and `open`, and they remove them after each test.

### D4 Compare with literal values

Each new test compares a value with the literal value that the spec names, and not with the constant of the code. This makes a wrong constant fail a test. The row controls tests compare whole texts.

### D5 The one branch that no test reaches

V8 counts the end of the `try`, `catch` and `finally` statement of `update()` in `index.js` as a branch. Each path returns, so no test can reach it. The change does not edit the code. The ledger keeps this one branch. The proposal names it as the known limit `cyclones-finally-continuation`.

### D6 Redundant guards

Some guards of the code repeat another guard. A mutation that removes such a guard cannot fail a test. The proposal lists them as known limits, and it names each mutation that no test fails.

## How the gates measure the requirement

- The trace gate needs at least one test with the tag of each scenario ID, and each tagged test needs a `node:assert` call. The spec-lint gate needs a task that names each ID.
- The coverage gate reads the coverage of the four files. The ratchet command writes the new counts to `openspec/trace/gaps.json`. The counts fall, and no count rises.
- The STE lint checks the prose of this change and the names of the tagged tests.
- The mutation checks are manual. The tasks record each mutation and the test that fails.

## Related browser QA scripts

- `scripts/qa-weather-journey.mjs`: It uses the page controls to show cyclones, select a storm and view it from the camera.
- `scripts/qa-weather-teardown.mjs`: It selects a storm and checks that scene resources return to the first count after weather layers stop.
- Not in the spec: The journey records screenshots and render counts while other weather layers and cyclones appear together.
- Not in the spec: The teardown compares render rates, long tasks and console errors of other layers after weather use.

## Files that the change adds or changes

- `src/layers/cyclones/source.test.mjs`, `src/layers/cyclones/labels.test.mjs`, `src/layers/cyclones/rendering.test.mjs` and `src/layers/cyclones/index.test.mjs`: the tags and the new tests.
- `openspec/changes/backfill-cyclones/`: the proposal, the design, the tasks and the delta spec of `cyclones`.
- `openspec/trace/`: the four ledger files, when the ratchet command runs.
