## Why

The Spec gates job of CI stopped on `main` after the merge `d9ccf91`. The gates reported `LEDGER-STALE` for two entries of the ledger. The files are `src/app/layers/alprCameras.js` and `src/annotations/resolver.js`.

The counts of these files change between runs. CI measured 0 lines not covered for `alprCameras.js`, and the ledger has 3. CI measured 314 lines not covered for `resolver.js`, and the ledger has 359. The difference is above the tolerance.

## What Changes

- Run the ratchet command. The command writes the measured counts of both files to the ledger.
- Do not change code, tests or scenarios.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. No scenario text changes.

## Impact

- The ledger file `openspec/trace/gaps.json` changes for the entries that the ratchet writes.
- The history file `openspec/trace/history.jsonl` gets the lines of the ratchet.

## Known limits and later changes

- `refresh-may-flip`: The counts of these files change between runs. A later CI run can measure other counts, and the gates can stop again.
- `refresh-cause`: A later change must find the cause of the changing counts. The cause can be coverage of a test process that the gates lose in some runs.
