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
- Open no ledger gap and close no ledger gap. The file stays below full coverage.
- Keep the uncovered count of `src/data/lifecycle.js` at 177 lines, 100 branches, and 15 functions in the selected test set.
- The ledger has totals of 2324 lines, 568 branches, and 116 functions for this file.
- The ratchet command can add two IDs and their test links to `openspec/trace/`.

## Known limits and later changes

- `branch-record-change`: V8 changes branch records in `src/data/labelArbiter.js`, `src/layers/wind/rendering.js`, and `src/overlays/worldOverlay.js`. A test cannot make these records stable.
- `ais-message-time`: Lines 142 to 145 of `server/providers/vessels/ais-store.js` change with message time. A test does not wait for the messages. The later `backfill-vessels` change can address this.
- `host-node-proof`: The repeat runs use host Node 26. The gate uses Node 24, so the repeat runs do not prove the gate result.
- `selected-test-set`: The repeat runs use 14 test files. They do not prove the result of the full test suite.
