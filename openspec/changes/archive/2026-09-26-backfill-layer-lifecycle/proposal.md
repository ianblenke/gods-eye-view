## Why

The coverage of `src/data/lifecycle.js` changes between test runs. Two error paths have no direct test. One path handles a failed layer destroy. The other path handles a failed activity listener.

This backfill change records what the old code does. It adds tests that reach both error paths in each run.

## What Changes

- Add the `layer-lifecycle` capability with two scenarios and `Origin: backfill`.
- Add tests for a destroy result of `false`, a destroy error, and an activity listener error.
- Change no production file.

## Capabilities

### New Capabilities

- `layer-lifecycle`: error paths of layer removal and activity events.

### Modified Capabilities

None.

## Impact

- Change `src/data/manager.test.mjs` and add the four files in this change folder.
- Open no ledger gap. Close 2 branches of `src/data/lifecycle.js` in the ledger: the entry on `main` has 102 branches not covered, and the ratchet command writes 100.
- Keep the other counts of the entry: 177 lines and 15 functions not covered. The file stays below full coverage.
- The ledger total of branches for this file changes from 570 to 572. The totals of lines (2324) and functions (116) stay.
- The tests now cover the two catch blocks in each run. The uncovered count of this file is stable between runs.
- The ratchet command also wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. Its branches not covered are 52 (50 on `main`), and its total of branches is 407 (405 on `main`). This is the known limit `branch-record-change`.
- The ratchet command can add two IDs and their test links to `openspec/trace/`.

## Known limits and later changes

- `branch-record-change`: V8 changes branch records in `src/data/labelArbiter.js`, `src/layers/wind/rendering.js`, and `src/overlays/worldOverlay.js`. A test cannot make these records stable.
- `ais-message-time`: Lines 142 to 145 of `server/providers/vessels/ais-store.js` change with message time. A test does not wait for the messages. The later `backfill-vessels` change can address this.
- `host-node-proof`: The repeat runs use host Node 26. The gate uses Node 24, so the repeat runs do not prove the gate result.
- `selected-test-set`: The repeat runs use 14 test files. They do not prove the result of the full test suite.
