## Why

The fork is 61 pull requests behind the upstream project. The upstream branch has 241 commits that the fork does not have. Together they change 1002 files, and 650 of them are code files. The owner asked to merge the upstream branch into the fork, and then to write the specs and the tests for the merged code.

This change makes the merge. The merged commit is `b210ab0`, the newest commit of the upstream branch on 2026-09-24. The change makes the merged tree pass the gates. It does not write specs for the upstream features. The backfill changes that follow do that work.

## What Changes

- Merge the upstream branch into the fork with one merge commit. The merged commit is the second parent of the merge commit.
- Keep the OSH layer in the new page structure of upstream. The panel of the layer moves to the template `src/ui/templates/context.html`. The layer token is `3`, because the upstream layer `weather-satellite` owns the token `o`. The application catalog builds the layer in the new file `src/app/layers/osh.js`, and its style sheet moves to `src/ui/styles/osh-panel.css`.
- Keep the credential boundary in the new search code of upstream. The reverse geocoder and the Google forward geocoder call the server route `/api/google/geocode`, with no key in the request. The function `resolveApiKey` is gone.
- Format the OSH files with the Prettier version of upstream, and list the OSH modules in the package boundaries of upstream.
- Fix two upstream tests that the gates stop. The test file `src/sdr/controller.test.mjs` left 15 live timers. The ingestion test in `server/providers/transitHistory.test.mjs` has a wall-clock ceiling that fails under the load of the gates.
- Run the ledger command `adopt` for the merged files that have a gap. The section Impact gives the counts.
- Change the scenarios `osh-033`, `osh-094` and `credential-boundary-014` for the new structure, and add the scenario `osh-095` for the application catalog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh`: the requirements "Systems layer" and "Camera panel" get new text in the scenarios `osh-033` and `osh-094`. The new requirement "Application catalog" gets `osh-095`.
- `credential-boundary`: the requirement "Browser geocoding" gets new text in the scenario `credential-boundary-014`.

## Impact

- Changed files: 1002 files of upstream, the conflict resolutions in 16 files, the files of the sections above, `openspec/specs/osh/spec.md`, `openspec/specs/credential-boundary/spec.md` and the trace files.
- Gaps that this change opens: the adopted gaps of the merged upstream files. The command `adopt` wrote one history line for each of 797 files. These are 525 code files and 272 test files.
- The 525 code files have 60497 lines, 5868 branches and 1683 functions that no test covers. Of these files, 17 have untrue coverage, because a test runs them through a transform. The 272 test files have 3413 tests without a scenario ID. Rule 21 of `AGENTS.md` limits the command to merged upstream code. The person who merges this change checks the merged commit against the upstream remote.
- Gaps that this change closes: none.
- The backfill changes close the adopted gaps. Each backfill change takes one feature area and writes its specs from what the code does. It adds the scenario IDs and the tests until the files are complete.

## Known limits and later changes

- `sync-no-upstream-specs`: The specs of the upstream features do not exist yet. The ledger records the adopted gaps with the origin `upstream-sync`. The backfill changes write the specs, one feature area for each change.
- `sync-hand-merged-files`: 16 merged files have a hand resolution: the eight code files `build/vite.js`, `src/data/layerState.js`, `src/hud.js`, `src/overlays/worldOverlay.js`, `src/standalone/application.js`, `src/app/constructCatalog.js`, `src/search/defaults.js` and `src/search/http.js`, and eight test files. The command `adopt` adopts the whole gap of these files. The known limit `adopt-hand-merged-files` of the change `ledger-adopt` names this.
- `sync-two-upstream-tests-edited`: The change edits two upstream tests without a scenario. A later upstream merge can conflict with these edits, and the person who resolves the conflict keeps the fix.
