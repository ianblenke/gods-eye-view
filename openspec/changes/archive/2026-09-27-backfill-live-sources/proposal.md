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

- Open no ledger gap and close no ledger gap. The ledger already records full coverage for this file.
- The ratchet can change the untraced test count for this file. The lead will report the exact ledger effect.
- Add the change documents and one test to the project.

## Known limits

- `live-sources-lcov-merge`: The gate can omit or duplicate a line record across runs. The cause is not yet clear.
- The [research report](/home/ianblenke/docker/gev-tools/ci-stability/report-1.md#coverage-path) describes how Node merges per-process lcov data. It also describes how `parseLcov()` selects the worst duplicate record.
- This test covers one real path. It can leave some coverage count changes.
