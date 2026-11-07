## Why

The UP42 routes give archive scenes and thumbnails. The browser has no layer for those scenes.
A person needs one search at the view centre and a list that selects a preview.

## What Changes

- Add `src/layers/up42Scenes/` and `src/app/layers/up42Scenes.js` from the SkyWatch pattern.
- Import the SkyWatch box and date helpers without a change to those helpers.
- Add 40 scenarios for `up42-scenes-layer` with `Origin: spec-first`.
- Register the layer in the catalog, source contracts, reference sources, panel, names, credits, voice list and translations.
- Add the two Chinese texts that the current catalog check needs.
- Reserve token "04" for `up42-scenes`; the next free QA fixture token becomes "05".
- Change the registry count from 40 to 41 in `osh-033` with the whole current requirement copied verbatim.
- Change the catalog counts from 41 to 42 in `src/app/constructCatalog.test.mjs` and `src/app/sourceComposition.test.mjs`.
- Add the reference source to `src/sources/reference.test.mjs`.
- Change counts and free-token fixtures in `src/data/layerState.test.mjs` and `src/data/layerStateTokenLedger.test.mjs`.
- Remove the new layer from the ledger rows and registry entries of those isolated fixtures.
- Change the free-token comment in `scripts/qa-layer-token-twochar.mjs` and the paragraph in `docs/CURRENT-STATE.md`.
- Add the new paths to the ownership, format and package manifests.
- Update `CHANGELOG.md` and the UP42 section of `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `up42-scenes-layer`: Show archive scenes and previews through the local UP42 routes.

### Modified Capabilities

- `osh`: Change only the registry count of `osh-033` to 41.

## Impact

The change adds six owned code files and seven test files. The manifests record these paths.
The change adds no server route, dependency, credential field or order action.
It does not use or change the shared scene module or the merged layer tests except the five registration test files above.
It opens no intended coverage gap. The lead must run the calibrated gates before a merge.

## Known limits and later changes

- Known limit `no-live-check`: The shapes come from documentation fixtures.
- Known limit `display-terms`: UP42 terms do not address the display of previews. Use the data for yourself only.
- Known limit `no-pick`: Select a scene in the row. A footprint click does nothing.
- Known limit `clock-skew`: The browser clock supplies the dates. A clock ahead of the server can cause refusal.
- Known limit `search-time`: The browser stops after 60 seconds. The server can continue and store the answer.
- Known limit `view-moves`: Footprints stay at the search position until the next press.
- Known limit `antimeridian`: A footprint across the meridian can have a wrong polygon or card position.
- Known limit `list-length`: The row lists at most 50 scenes.
- Known limit `thumbnails-off`: The route stays off until `UP42_THUMBNAILS=true` in `.env`.
- Known limit `partial-results-note`: The layer shows a note, with no retry for each host.
- Known limit `no-filter-controls`: The request sends no cloud or collection filters.
- Known limit `real-service`: No check sends a request to UP42.
- Known limit `token`: An upstream use of token "04" can cause a share link conflict.
- Known limit `osh-count`: Each new layer needs a delta for the count in `osh-033`.
- Known limit `image-size`: The byte cap is 1 MiB. The layer does not cap the decoded pixel count.
- Known limit `ui-texts`: The inherited labels "Searching…" and "Loading the thumbnail…" have words with the suffix -ing.
- Known limit `untested-settings`: No scenario names the secondary card fields that follow. They are `paintLane`, `details`, `priority`, `protected`, `active`, `interactive`, `collisionGroup`, `zIndex`, `minDistance`, `horizonCull` and `terrainOcclusion`. The limit also applies to the options of `setEntries` and the initial call of `setVisible` with false. It also applies to the 1 MiB cap of the status body.
- Known limit `visual`: The lead checked the browser with a stored answer. The file evidence/browser.txt gives the result. No check used the real service.
- Known limit `qa-twochar-time`: The browser QA script printed two PASS lines and then stopped at its page-load time limit on the machine of the lead. The file evidence/browser.txt gives the run.
