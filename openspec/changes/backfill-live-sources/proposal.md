## Why

Line 93 of `src/sources/live/contract.js` has no direct test for a transport abort error. Its branch count changes between CI runs. This twice made an unrelated push fail with `LEDGER-NEW-COVERAGE-GAP`.

## What Changes

- Add one `live-sources` scenario for the same abort error object.
- Add one test to `src/sources/live/contract.test.mjs`.
- Change no production file.

## Capabilities

### New Capabilities

- `live-sources`: transport abort errors from a live source.

### Modified Capabilities

None.

## Impact

- Open no ledger gap and close no ledger gap. The file has no ledger entry, because the gate measures it at full coverage.
- The ratchet can change the untraced test count for this file. The lead will report the exact ledger effect.
- Add the change documents and one test to the project.

## Known limits

- `live-sources-lcov-merge`: The gate can omit or duplicate a line record across runs. The cause is not yet clear.
- `live-sources-ratchet-noise`: The ratchet command wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. Its count changes between runs. The lead put the entry and the history of that file back to the content of `main`, as a text edit with no measurement.
- The [research report](/home/ianblenke/docker/gev-tools/ci-stability/report-1.md#coverage-path) describes how Node merges per-process lcov data. It also describes how `parseLcov()` selects the worst duplicate record.
- This test covers one real path. It can leave some coverage count changes.
