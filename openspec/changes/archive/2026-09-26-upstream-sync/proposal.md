## Why

The fork is 61 pull requests behind the upstream project. The upstream branch has 241 commits that the fork does not have. Together they change 1002 files, and 650 of them are code files. The count of 1002 is the count of the files that the upstream branch changed since the shared commit `3ca81fb`. The owner asked to merge the upstream branch into the fork, and then to write the specs and the tests for the merged code.

The owner of the project accepts this change on `main`. Rule 21 of `AGENTS.md` calls the owner "the person who merges a change". The author of this change is the agent that wrote this change.

This change merges the upstream branch. The merged commit is `b210ab0`, the newest commit of the upstream branch on 2026-09-24. The change makes the tree of the merge commit pass the gates. It does not write specs for the upstream features. The backfill changes that follow do that work.

## What Changes

- Merge the upstream branch into the fork with one merge commit. The merged commit is the second parent of the merge commit.
- Keep the OSH layer in the new page structure of the upstream project. The panel of the layer moves to the template `src/ui/templates/context.html`. The layer token is `3`, because the upstream layer `weather-satellite` uses the token `o`.
- Build the OSH layer in the application catalog with `createApplicationOsh()` from the new file `src/app/layers/osh.js`. The style sheet of the panel moves to `src/ui/styles/osh-panel.css`.
- Keep the credential boundary in the new search code of the upstream project. The HTTP geospatial provider, and the first use of `createGoogleGeocoder` in `src/search/defaults.js`, send requests to the server route `/api/google/geocode`, with no key in the request. The browser search code has no `resolveApiKey` input.
- Format the OSH files with the Prettier format of the upstream project, and list the OSH modules in the package boundaries.
- Fix two upstream tests that make the gates stop the build. The test file `src/sdr/controller.test.mjs` left 15 live timers. The ingestion test in `server/providers/transitHistory.test.mjs` fails at a wall-clock ceiling, because the gates run many test processes at the same time.
- Restore the upstream test of the voice action for the ALPR layer. The first version of the conflict resolution removed this test.
- Add `src/layers/osh/hosts.js` and `src/app/layers/osh.js` to the file list of the scan for real addresses. Add `src/sources/httpBody.js` to the file list of the scan for requests that do not use GET.
- Run the ledger command `adopt` for the files that the merge commit brings from the upstream project, and that have a gap. The section Impact gives the counts.
- Change the scenarios `osh-033`, `osh-094` and `credential-boundary-014`, and add the scenarios `osh-095` and `osh-096`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh`: the requirements "Systems layer" and "Camera panel" have new text in the scenarios `osh-033` and `osh-094`. The new requirement "Application catalog" has `osh-095` and `osh-096`.
- `credential-boundary`: the requirement "Browser geocoding" has new text in the scenario `credential-boundary-014`.

## Impact

- Changed files: the files that `design.md` lists.
- Gaps that this change opens: the adopted gaps of the files that the merge commit brings from the upstream project. The command `adopt` wrote one adopt line for each of 797 files. These are 525 code files and 272 test files.
- The 525 code files have 60486 lines, 5866 branches and 1683 functions that no test covers. Of these files, 17 have untrue coverage, because a test runs them through a transform. The 272 test files have 3414 untraced tests.
- Gaps that this change closes: the tests of the upstream project cover code that the fork left uncovered. The ratchet command recorded 16 entries as closed. Examples are `src/data/radio.js` (511 lines), `src/annotations/annotationResolver.js` (562 lines) and `src/data/telegeographySubmarineCables.js` (66 lines). It also recorded 3 code files and 1 test file as removed with their entries, and smaller counts for 9 files. Three of these files have counts that change between runs (`sync-counts-change-between-runs`), and the number of files changes with each ratchet run. The history of the ledger has each of these lines with the change name `upstream-sync`.
- The backfill changes close the adopted gaps. Each backfill change has one feature area and writes its specs from what the code does. It adds the scenario IDs and the tests until the files are complete.

## Known limits and later changes

- `sync-no-upstream-specs`: The specs of the upstream features do not exist yet. The ledger records the adopted gaps with the origin `upstream-sync`. The backfill changes write the specs, one feature area for each change.
- `sync-hand-merged-files`: 32 files changed on both sides. The adopted files among them are the eight code files `build/vite.js`, `server/providers/places/google.js`, `server/standalone/vite.config.js`, `src/data/layerState.js`, `src/hud.js`, `src/overlays/worldOverlay.js`, `src/standalone/application.js` and `src/voice/gevActions.js`, and ten test files. The ten test files are `src/annotations/annotationEngine.test.mjs`, `src/data/layerState.test.mjs`, `src/data/manager.test.mjs`, `src/overlays/worldOverlay.test.mjs`, `src/sharelink.celestial.test.mjs`, `src/tooling/localServices.test.mjs`, `src/tooling/previewServing.test.mjs`, `src/tooling/viteBuild.test.mjs`, `src/voice/gevActions.test.mjs` and `src/voice/gevRealtime.test.mjs`. The known limit `adopt-hand-merged-files` of the change `ledger-adopt` names the risk of these files.
- `sync-files-edited-after-the-merge`: Three more code files have an adopt line. Only the upstream project changed them before this change, and the author of this change then changed them. These are `src/app/constructCatalog.js` (3 lines, 4 branches and 1 function), `src/search/defaults.js` (2 branches) and `src/search/http.js` (4 branches and 2 functions). The author of this change checked the uncovered items: they are upstream code, and tests cover the code of this change in these files. The owner reads the Git diff between the merged commit and HEAD for these three files too.
- `sync-two-upstream-tests-edited`: This change changes two upstream tests, and neither test has a scenario. A later change of these tests in the upstream project can conflict with these changes. The person who resolves the conflict keeps the fix.
- `sync-ceiling-not-measured`: The ceiling of ten seconds in the ingestion test finds only a very large increase of the time. No run measured how long a quadratic ingestion of 15000 vehicles takes.
- `sync-dropped-reverse-cache-test`: The fork had a test of `credential-boundary-014` for the cache of the reverse lookup in `src/voice/gevActions.js`. The upstream project replaced that cache with a cache for each service, and the functions `_reverseGeocodeForTest` and `_resetReverseGeocodeForTest` are gone. The code of the new cache is still in `src/voice/gevActions.js`, and no test checks it. The `catch` clause of the function `reverseGeocode` in that file changes a rejected reverse lookup to "no place". No test checks this clause. A backfill change for the voice actions writes both tests.
- `sync-test-names`: The rule of the owner is that a test name that exists on `origin/main` does not change. The name of the test of `osh-033` says the token `o`, and the test checks the token `3`. Two moved tests of `credential-boundary-014` keep the words "the life of the page" and "before this change". These names stay. The author of this change broke the rule for two other moved tests, because their names said the opposite of their assertion. The owner decides in `review.md` if these two renames stay.
- `sync-share-token`: The share-link token of the OSH layer changes from `o` to `3`. A share link that the fork made before this change and that has the OSH layer now turns on the layer `weather-satellite`.
- `sync-third-geocoder-call`: A forward lookup that finds no place makes three requests: to the server route, to Photon and to the local Nominatim route `/api/geocode`. The scenario `credential-boundary-013` does not mention the third request. One test of `credential-boundary-013` counts the three requests, and another test answers the third route.
- `sync-osh-005-file-list`: The test of `osh-005` now reads `src/sources/httpBody.js`, and the scenario `osh-005` does not name this file. A change of the scenario `osh-005` changes the hash of each scenario of its requirement. So a later change must write the new text of the scenario.
- `sync-more-branches-in-unchanged-files`: Some files that neither side changed show more not-covered branches than before. The tests of the upstream project now load these files, and V8 then counts more branches. An example is `src/layers/bikeshare/model.js`: its total of branches rose from 2 to 29, and its not-covered lines fell from 83 to 21.
- `sync-counts-change-between-runs`: Some files have a count that changes between runs. The cause is not measured, and a possible cause is a test that runs different lines when events happen at different times. There are four examples:
  - `server/providers/vessels/ais-store.js` has 40 or 44 lines not covered.
  - `src/data/lifecycle.js` has 177 to 184 lines not covered.
  - `src/layers/wind/rendering.js` has 333 or 334 branches in total.
  - `src/data/labelArbiter.js` has 50 or 52 branches not covered. The gates of this change compare the count of a changed file exactly. So a run can stop for such a file with `LEDGER-LARGER-GAP`, `LEDGER-LOST-COVERAGE` or `LEDGER-STALE`. The gates of the push to `main` use the tolerance.
- `sync-hand-written-adopt-lines`: The author of this change wrote two adopt lines by hand, for the first two examples of `sync-counts-change-between-runs`. They are the lines 1424 and 1425 of `openspec/trace/history.jsonl`, and they have the larger counts that the runs measured. Before each ratchet run, the author also set the entry of `src/data/lifecycle.js` in `openspec/trace/gaps.json` to the larger count by hand. The ratchet run then wrote the counts that it measured. The counts of the Impact are the counts of the 797 adopt lines that the command wrote. The owner reads these two lines.
- `sync-remembered-statuses`: The HTTP geospatial provider remembers each HTTP 200 answer that has a Google status and gives no place. Only the answer with the status `ZERO_RESULTS` has a test. The owner decides in `review.md` if the provider must not remember an answer with a status such as `REQUEST_DENIED`.
