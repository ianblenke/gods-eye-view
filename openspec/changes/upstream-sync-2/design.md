## Context

The fork and the upstream project share the commit `b210ab0`, from the first sync. The upstream branch has 5 new commits. This change merges them with one merge commit.

## Goals and non-goals

- Take the upstream code for the OSM sources, the share-link tokens and the documents.
- Keep the OSH layer, the OSH control layer and the spec gates of the fork.
- Do not change production code. Do not write specs for the new upstream code.

## D1 The merge commit

The merge commit has two parents: the fork tip `253a07d` and the upstream tip `e7707d9`. The three conflicts only add lines on both sides. The merge keeps both sets of lines.

## D2 The share-link token of the OSH layer

The upstream project now keeps a ledger of layer tokens in `src/data/layerStateTokenReservations.json`. A layer without a row in the ledger makes `validateLayerStateRegistry` throw the error `Unreserved layer-state token`. The OSH layer has the token `3` since the first sync, so the ledger gets the row `["osh-systems", "3"]`. The check `layer-token:check` accepts a new one-character token only if it is a digit, and `3` is a digit.

The upstream tests of the ledger assume that the digit `3` is free. The tests now use the next free digit `4`. The same change moves the count of the rows from 28 to 29 in the tests that count them.

## D3 The QA scripts

The upstream project adds 13 QA scripts with no header. The register of the fork needs a header block for each script. The block has four lines: `@purpose`, `@covers`, `@run` and `@needs`. The two helper files `qa-journey-recorder.mjs` and `qa-installation-polish.mjs` are not checks. The first has the value `unmapped:`, and the second names the capability `pending:overlays`.

## D4 Five tests that make the gates stop the build

The test of the flight completion and cancellation hooks starts the camera ground guard. The guard polls with timers, and 1 timer stays live at the end of the process. The test now replaces `setTimeout` with the mock of `node:test`.

The tests of `src/data/militaryInstallations.test.mjs` start 4 timers of 1200 ms in `resolveGroundFloorCellsBounded`. The timers stay live at the end of the process. The file now waits 1300 ms after its last test.

The test of the surface keys on unchanged frames counts calls of `Array.prototype.join` in a loop of 1000 frames. The gates wrap each `assert` call, and the wrapper calls `join`. The test now collects the differing frames in the loop and asserts after the loop.

The test of the slow boundary lookup in `src/annotations/regionRing.test.mjs` asserts that the call returns in less than 1 second. The budget of the call is 50 ms. The gates run many test processes at the same time, and the test failed at this ceiling. The ceiling is now 10 seconds.

The test of the traffic timing in `src/data/trafficTiming.test.mjs` loads the traffic module with Vite, because it changes the source of `src/layers/traffic/index.js`. A file that Vite loads counts as untrue in the gates. The new imports of the upstream traffic code made the Vite graph grow to 51 files. Seven of them did not change, and the ledger records them as true. The test now has a Vite plugin that loads each other relative import as a native module. Only `src/data/traffic.js` and `src/layers/traffic/index.js` stay in Vite.

## D5 What the command `adopt` adopts

The command `adopt` adopts a file when the merge commit changed it since the merge base. The content of the file must differ from its content in the base. The tool records the gaps of these files with the change name.

## How the gates measure the requirement

The gates run on the merge tree. The ledger must record each gap, and the history must name this change.
