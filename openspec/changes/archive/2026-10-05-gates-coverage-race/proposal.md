## Why

Node changes coverage values with the order of process files. Its range merge also reports coverage that no process records.

## What Changes

- Add an exact process union without Node internals or a new dependency.
- Replace loaded lcov records after the main test process exits.
- Delete the raw coverage folder after the merge.
- Add one bounded ledger baseline step for unchanged source files. The check of its history uses the count tolerance.

## Capabilities

### Modified Capabilities

- `coverage-gate`: add an exact process union.
- `gap-ledger`: add one explicit baseline step.

## Impact

The change adds a merge module and tests. It changes the gates, parallel helper and ledger library. The lead measures each ledger gap in the image. This change does not edit trace JSON files.

Some uncovered values rise because the old Node merge reported coverage that no process recorded. The baseline step records each file by name.

The gate deletes the raw folder after the merge because CI uploads the output folder.

## Known limits

The tolerance stays unchanged. The scratch command `node bench.mjs` measures 1056405189 raw bytes and 46512.85 milliseconds for the gate merge. Raw files exist only during the measurement, with about one GB on disk at the peak. The scratch Python command totals the raw JSON file sizes for this disk value. Host values differ from image values. The design records the results of the image checks.
