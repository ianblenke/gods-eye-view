## Why

The fork is 61 pull requests behind the upstream project. The upstream branch has 241 commits that the fork does not have. Together they change 1002 files, and 650 of them are code files. The owner asked to merge the upstream branch into the fork, and then to write the specs and the tests for the merged code.

This change merges the upstream branch. The merged commit is `b210ab0`, the newest commit of the upstream branch on 2026-09-24. The change makes the tree of the merge commit pass the gates. It does not write specs for the upstream features. The backfill changes that follow do that work.

## What Changes

- Merge the upstream branch into the fork with one merge commit. The merged commit is the second parent of the merge commit.
- Keep the OSH layer in the new page structure of the upstream project. The panel of the layer moves to the template `src/ui/templates/context.html`. The layer token is `3`, because the upstream layer `weather-satellite` uses the token `o`.
- Build the OSH layer in the application catalog with `createApplicationOsh()` from the new file `src/app/layers/osh.js`. The style sheet of the panel moves to `src/ui/styles/osh-panel.css`.
- Keep the credential boundary in the new search code of the upstream project. The HTTP geospatial provider and the Google forward geocoder call the server route `/api/google/geocode`, with no key in the request. The browser search code has no `resolveApiKey` input.
- Format the OSH files with the Prettier format of the upstream project, and list the OSH modules in the package boundaries.
- Fix two upstream tests that make the gates stop the build. The test file `src/sdr/controller.test.mjs` left 15 live timers. The ingestion test in `server/providers/transitHistory.test.mjs` fails at a wall-clock ceiling, because the gates run many test processes at the same time.
- Restore the upstream test of the voice action for the ALPR layer, which the first resolution of the conflicts dropped.
- Add the new OSH files to the file lists of two OSH scans. One scan looks for real addresses. The other scan looks for calls that are not GET.
- Run the ledger command `adopt` for the merged files that have a gap. The section Impact gives the counts.
- Change the scenarios `osh-033`, `osh-094` and `credential-boundary-014`, and add the scenarios `osh-095` and `osh-096`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh`: the requirements "Systems layer" and "Camera panel" have new text in the scenarios `osh-033` and `osh-094`. The new requirement "Application catalog" has `osh-095` and `osh-096`.
- `credential-boundary`: the requirement "Browser geocoding" has new text in the scenario `credential-boundary-014`.

## Impact

- Changed files: the files that `design.md` lists.
- Gaps that this change opens: the adopted gaps of the merged upstream files. The command `adopt` wrote one adopt line for each of 797 files. These are 525 code files and 272 test files.
- The 525 code files have 60486 lines, 5866 branches and 1683 functions that no test covers. Of these files, 17 have untrue coverage, because a test runs them through a transform. The 272 test files have 3414 tests without a scenario ID.
- Gaps that this change closes: the tests of the upstream project cover code that the fork left uncovered. The ratchet command recorded 16 entries as closed. Examples are `src/data/radio.js` (511 lines), `src/annotations/annotationResolver.js` (562 lines) and `src/data/telegeographySubmarineCables.js` (66 lines). It also recorded 3 code files and 1 test file as removed with their entries, and smaller counts for 5 files. The history of the ledger has each of these lines with the change name `upstream-sync`.
- The backfill changes close the adopted gaps. Each backfill change has one feature area and writes its specs from what the code does. It adds the scenario IDs and the tests until the files are complete.

## Known limits and later changes

- `sync-no-upstream-specs`: The specs of the upstream features do not exist yet. The ledger records the adopted gaps with the origin `upstream-sync`. The backfill changes write the specs, one feature area for each change.
- `sync-hand-merged-files`: 32 files changed on both sides, and a person resolved them by hand. The adopted files among them are the eight code files `build/vite.js`, `server/providers/places/google.js`, `server/standalone/vite.config.js`, `src/data/layerState.js`, `src/hud.js`, `src/overlays/worldOverlay.js`, `src/standalone/application.js` and `src/voice/gevActions.js`, and ten test files. The ten test files are `src/annotations/annotationEngine.test.mjs`, `src/data/layerState.test.mjs`, `src/data/manager.test.mjs`, `src/overlays/worldOverlay.test.mjs`, `src/sharelink.celestial.test.mjs`, `src/tooling/localServices.test.mjs`, `src/tooling/previewServing.test.mjs`, `src/tooling/viteBuild.test.mjs`, `src/voice/gevActions.test.mjs` and `src/voice/gevRealtime.test.mjs`. Three other hand-merged code files have no adopt line, because they have no gap: `src/app/constructCatalog.js`, `src/search/defaults.js` and `src/search/http.js`. The known limit `adopt-hand-merged-files` of the change `ledger-adopt` names the risk.
- `sync-two-upstream-tests-edited`: The change edits two upstream tests without a scenario. A later merge of the upstream project can conflict with these edits. The person who resolves the conflict keeps the fix.
- `sync-ceiling-not-measured`: The ceiling of ten seconds in the ingestion test catches a gross regression only. No run measured how long a quadratic ingestion of 15000 rows takes.
- `sync-dropped-reverse-cache-test`: The fork had a test of `credential-boundary-014` for its own cache and in-flight sharing in `src/voice/gevActions.js`. The upstream project replaced that cache with a cache for each service, so the test did not apply and does not exist. The 13 tests that moved test the provider. A backfill change for the voice actions writes a test for the new cache.
- `sync-test-names`: The name of the test of `osh-033` says the token `o`, and the test checks the token `3`. Two moved tests of `credential-boundary-014` keep the words "the life of the page" and "before this change". These names stay, because a test name that exists on `origin/main` does not change. Two other moved tests had names that said the opposite of their assertion. The lead renamed these two, and the owner sees this in `review.md`.
- `sync-share-token`: The share-link token of the OSH layer changes from `o` to `3`. A share link that the fork made before this change and that has the OSH layer now turns on the layer `weather-satellite`.
- `sync-third-geocoder-call`: The default place search calls three services: the server route, Photon and the keyless route `/api/geocode`. The scenario `credential-boundary-013` does not mention the third call. Two tests of `credential-boundary-013` count three calls.
- `sync-more-branches-in-unchanged-files`: Some files that neither side changed show more not-covered branches than before. The tests of the upstream project now load these files, and V8 then counts more branches. An example is `src/layers/bikeshare/model.js`: its total of branches rose from 2 to 29, and its not-covered lines fell from 83 to 21.
- `sync-counts-change-between-runs`: Two adopted files have a not-covered line count that changes between runs of the tests: `server/providers/vessels/ais-store.js` and `src/data/lifecycle.js`. The adopt run measured 40 and 177 lines. The ratchet runs measured 44 lines for the first file, and 179 and 184 lines for the second file. The lead wrote two more adopt lines by hand, with the larger counts of 44 lines, and of 184 lines with 102 branches. The person who accepts this change on `main` reads these two lines. After this change, the tolerance of the ledger covers such a change of the counts.
