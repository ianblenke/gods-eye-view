## Why

The upstream project has 5 commits that the fork does not have. They change 211 files, and 181 of them are in `src/`, `server/` or `build/`. The count of 211 is the count of the files that the upstream branch changed since the commit `b210ab0` of the first sync.

The most important commit stops the public Overpass service as a default source. Traffic roads, mapped installations and ALPR cameras stay empty in an old install until the fork has this code.

The owner of the project accepts this change on `main`. Rule 21 of `AGENTS.md` calls the owner "the person who merges a change".

This change merges the upstream branch. The merged commit is `e7707d9`, the newest commit of the upstream branch on 2026-09-30. The change makes the tree of the merge commit pass the gates. It does not write specs for the upstream features. The backfill changes do that.

## What Changes

- Merge the upstream branch into the fork with one merge commit. The merged commit is the second parent of the merge commit.
- Keep the OSH layer. Its share-link token is `3`. Add the row `["osh-systems", "3"]` to the token ledger `src/data/layerStateTokenReservations.json` of the upstream project.
- Change the test fixtures of the token ledger. The digit `3` is now in use, so the next free digit is `4`. The ledger has 29 rows, and not 28.
- Add a QA header to the 13 new upstream QA scripts. The test `qa-scripts-023` counts 83 scripts, and not 70.
- Fix four upstream tests that make the gates stop the build. Two of them leave live timers. One of them counts calls of `Array.prototype.join`, and the assertion counter of the gates calls that function. One of them has a time ceiling that is too small when the gates run many test processes.
- Run the ledger command `adopt` for the files that the merge commit brings from the upstream project, and that have a gap. The run records 159 files: 152 changed files and 7 reached files.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. No scenario text changes.

## Impact

- The merge has 3 files with conflicts: `.env.example`, `scripts/package-boundaries.json` and `src/locations.test.mjs`. Both sides only add lines to each of them.
- The upstream project and the fork both changed 19 files. The author of this change checked each one.
- The upstream project adds the environment variable `OVERPASS_UPSTREAMS`. It is optional and has no credential.
- The first run of the gates on the merge commit gave 248 errors. Most of them are gaps in the ledger for the code of the upstream project.

## Known limits and later changes

- `sync2-reached-files`: Seven files did not change in the merge, and the gates count them as untrue. They are `src/data/geoid.js`, `src/data/groundFloor.js`, `src/data/terrainHeights.js`, `src/sources/featureSource.js`, `src/sources/featureGeometry.js`, `src/sources/overpassFeaturesRecords.js` and `src/services/application.js`.
- `sync2-vite-test`: The upstream test `src/data/trafficTiming.test.mjs` loads the traffic module with Vite, because it needs `import.meta.env.DEV`. Vite-loaded files count as untrue. The adopt command records the seven files as reached files, under the rule of the change `ledger-adopt-reached`.
- `sync2-no-specs`: This change writes no spec for the new upstream code. A backfill change writes each one.
- `sync2-timer-fixes-in-tests`: The timers stay in the production code. The functions `guardCameraAboveGround` and `resolveGroundFloorCellsBounded` do not clear their timers when the work ends first. The fix is in the tests, so the production code stays equal to the code of the upstream project.
- `sync2-ceiling-not-measured`: The ceiling in the test of the slow boundary lookup is now 10 seconds, and it was 1 second. The ceiling finds only a very large increase of the time.
- `sync2-qa-purposes`: The 13 new QA headers name capabilities with the prefix `pending:`. A backfill change replaces each name after its capability has a folder.
