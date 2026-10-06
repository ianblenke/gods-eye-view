## Why

Node changes coverage values with the order of process files. Its range merge also reports coverage that no process records.

## What Changes

- Add an exact process merge without Node internals or a new dependency.
- Replace loaded lcov records after the main test process exits.
- Delete the raw coverage folder after the merge.
- Add one limited ledger rebaseline step for unchanged source files. The check of its history uses the count tolerance.

## Capabilities

### Modified Capabilities

- `coverage-gate`: add an exact process merge.
- `gap-ledger`: add one explicit rebaseline step.

## Impact

The change adds a merge module and tests. It changes the gates, parallel helper and ledger library. The lead measures each ledger gap in the image. The rebaseline and ratchet commands write `gaps.json`, `history.jsonl`, `ids.json` and `links.json`. The lead ran them in the image.

Some uncovered values rise because the old Node merge reported coverage that no process recorded. The rebaseline step records each file by name.

The raw folder lies outside the repository root and output folder. The gate removes it after the measurement on every path.

## Known limits

The tolerance stays unchanged. The scratch command `node bench.mjs` measures 1056405189 raw bytes and 46512.85 milliseconds for the gate merge. Raw files exist only during the measurement, with about two GB on disk at the peak, because Node copies its temporary files. The scratch command `node round-1-evidence.mjs` totals 1056405189 raw bytes. Two copies can occupy 2112810378 bytes at the peak.

Host values differ from image values. The design records the results of the image checks.

D1 allows a recorded unchanged metric within one tolerance. It does not prove that the metric differed in the earlier measurement.

Known limits `image-test-timing` and `traffic-navigation-timing` remain. The design records the image evidence.
The command records a rise that a test removed in the same change causes. No gate compares removed tests.
After this change joins main, the base holds the module. The `rebaseline` command stays in the tree but cannot run again.
