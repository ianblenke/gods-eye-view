## Why

The CI job `Spec gates` stopped on `main` after merge commit `d9ccf91`. The gates reported `LEDGER-STALE` for two entries of the ledger. The files are `src/app/layers/alprCameras.js` and `src/annotations/resolver.js`.

The counts of these files change between runs of the same tree. CI measured 0 lines not covered for `alprCameras.js`, and the ledger records 3. CI measured 314 lines not covered for `resolver.js`, and the ledger records 359. Each difference is more than the tolerance of the gates.

## What Changes

- Run the ratchet command on the tree of `d9ccf91`. The command writes the counts that it measures to the ledger for each file that differs.
- Keep each line that the ratchet command writes. Do not change code, tests or scenarios.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. No scenario text changes.

## Impact

- The ledger file `openspec/trace/gaps.json` changes for 13 files. The history file `openspec/trace/history.jsonl` receives 29 lines. All 29 lines have the kind `coverage` and the change name `ledger-refresh`.
- The ratchet command wrote 342 lines not covered for `src/annotations/resolver.js`. CI measured 314. CI can stay red with `LEDGER-STALE` for this file after the merge, because the difference of 28 is more than the tolerance of 8.
- Four entries leave the ledger, because their gaps closed. They are `src/app/layers/alprCameras.js`, `server/providers/regional/http.js`, `src/data/retryableLoad.js` and `src/layers/alpr/visuals.js`. The history has no line for the old function and branch gaps of `retryableLoad.js` and `visuals.js`. Their entries left the ledger with no such line.
- Six more files have smaller counts of lines not covered: `server/providers/overpass/cache.js`, `server/providers/overpass/query.js`, `server/providers/regional/briefing.js`, `server/providers/regional/news.js`, `src/layers/awareness/model.js` and `src/sources/overpass.js`. These changes do not repair a stale entry.
- For `briefing.js`, `news.js` and `src/data/regionalModel.js`, the count of branches not covered rises, and the count of all branches rises with it. The count of covered branches does not fall. Each history line of these files says "shown by test".
- For `src/overlays/worldOverlayDraw.js`, only the count of all branches changes, from 305 to 306.

## Known limits and later changes

- `refresh-may-flip`: The counts of these files change between runs. A later CI run can measure other counts, and the gates can stop again with `LEDGER-STALE`. The count 342 for `resolver.js` can be noise of this run. The four closed entries can open again as gaps.
- `refresh-cause`: A later change must find the cause of the counts that change. The gates can lose the coverage data of a test process in some runs. This can be the cause.
