## Context

The fork and the upstream project share the commit `b210ab0`, from the first sync. The upstream branch has 5 new commits. This change merges them with one merge commit.

## Goals and non-goals

- Take the upstream code for the OSM sources, the share-link tokens and the documents.
- Keep the OSH layer, the OSH control layer and the spec gates of the fork.
- Do not change production code. Do not write specs for the new upstream code.

## D1 The merge commit

The merge commit has two parents: the fork tip `253a07d` and the upstream tip `e7707d9`. The three conflicts only add lines on both sides. The merge keeps both sets of lines.

## D2 The share-link token of the OSH layer

The upstream project now keeps a ledger of layer tokens in `src/data/layerStateTokenReservations.json`. A layer without a row in the ledger makes `validateLayerStateRegistry` throw the error `Unreserved layer-state token`. The first sync gave the OSH layer the token `3`, so the ledger gets the row `["osh-systems", "3"]`. The check `layer-token:check` accepts a new one-character token only if it is a digit, and `3` is a digit.

The upstream tests of the ledger assume that the digit `3` is free. The tests now use the next free digit `4`. The same change moves the count of the rows from 28 to 29 in the tests that count them.

## D3 The QA scripts

The upstream project adds 13 QA scripts with no header. The register of the fork needs a header block for each script. The block has four lines: `@purpose`, `@covers`, `@run` and `@needs`. The two helper files `qa-journey-recorder.mjs` and `qa-installation-polish.mjs` are not checks. The first has the value `unmapped:`, and the second names the capability `pending:overlays`.

## D4 Four upstream tests that make the gates stop the build

The test of the flight completion and cancellation hooks starts the camera ground guard. The guard polls with timers, and 1 timer stays live at the end of the process. The test now replaces `setTimeout` with the mock of `node:test`.

The tests of `src/data/militaryInstallations.test.mjs` start 4 timers of 1200 ms in `resolveGroundFloorCellsBounded`. The timers stay live at the end of the process. The file now waits 1300 ms after its last test. The file already clears two other timers, `terrainDelayTimer` and `boundedTimer`. That code comes from the fork. The wait stays necessary for the deadline timers.

The test of the surface keys on unchanged frames counts calls of `Array.prototype.join` in a loop of 1000 frames. The gates wrap each `assert` call, and the wrapper calls `join`. The test now collects the differing frames in the loop and asserts after the loop.

The test of the slow boundary lookup in `src/annotations/regionRing.test.mjs` asserts that the call returns in less than 1 second. The budget of the call is 50 ms. The gates run many test processes at the same time, and the test failed at this ceiling. The ceiling is now 10 seconds.

## D5 What the command `adopt` adopts

The command `adopt` adopts a file when the merge commit changed it since the merge base. The content of the file must differ from its content in the base. The command `adopt` records the gaps of these files with the change name.

## D6 The reached files

The merge commit does not change seven files, but the gates count them as untrue. The test `src/data/trafficTiming.test.mjs` loads the traffic module with Vite. The new imports of the upstream code made the Vite graph larger. The command `adopt` records these seven files as reached files. Each has an import path from a changed file. The path uses an import link that the merged commit adds and the base does not have.

## Mutation results

Each mutation ran in the gate image, and the author restored the file after it.

| Task | Mutation | Result |
|---|---|---|
| 2.1 | Remove the row `osh-systems` from the token ledger. | `layerState.test.mjs` and `layerStateTokenLedger.test.mjs` fail. |
| 2.2 | Remove the `@covers` line of the header of `scripts/qa-terrain-429.mjs`. | `[qa-scripts-023]` fails. |
| 2.3 | Remove the mock of `setTimeout` in the test of the flight hooks. | A live timer remains at the end of the process. |
| 2.4 | Remove the wait after the last test of `militaryInstallations.test.mjs`. | Four live timers remain. |
| 2.5 | Make `trafficSurfaceKey` build the key for each call. | The test of the surface keys fails. |
| 2.6 | Make `resolveRegionRingForQuery` wait for the lookup. | The test does not end. The run stops it after 120 seconds. |

## How the gates measure this change

The gates run on the merge tree. The ledger must record each gap, and the history must name this change.
