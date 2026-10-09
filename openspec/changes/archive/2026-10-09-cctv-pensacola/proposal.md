## Why

The owner asks for traffic cameras of the Pensacola area. The FL511 layer has more than 60 still-image cameras in Escambia County and Santa Rosa County. No pack of the catalog covers Florida.

## What Changes

- Add the module `server/providers/cctv/pensacola.js`. It loads the cameras of the Pensacola area from the FL511 layer.
- Add the pack `pensacola` to `server/providers/cctv/catalog.js`, after the pack `vegvesen`.
- Add the settings `CCTV_PENSACOLA_ENABLED`, `CCTV_PENSACOLA_MAX_SOURCES` and `CCTV_PENSACOLA_ROWS_URL` to `.env.example`.
- Write the notice of the FL511 use limit in `DATA_SOURCES.md`.
- Add the Pensacola pack to the CCTV rows of `README.md` and `docs/CURRENT-STATE.md`. The README row states the catalog cap of 4,000 cameras.
- Write an entry in `CHANGELOG.md`.
- Add the module and its test file to `openspec/ownership.json`, the module to `scripts/package-boundaries.json` and the test file to `scripts/format-scope.json`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `live-sources`: Add the requirements "Pensacola camera rows", "Pensacola layer request" and "Pensacola pack settings". The scenarios are `live-sources-010` to `live-sources-030`.

## Impact

Rule 23: the module `pensacola.js` and the test file `src/data/cctvPensacola.test.mjs` are code that the fork writes. They go into `openspec/ownership.json`, so they need 100% line, branch and function coverage.

The change edits one current code file, `server/providers/cctv/catalog.js`. The new lines are the import and the pack entry. The tests call the function `enabled` of the entry, so the gap of `catalog.js` does not grow.

The change does not edit `constants.js`, `normalize.js` or `sources.js`. Upstream pull request 605 changes these files, so a later sync has fewer conflicts.

No gap opens in `openspec/trace`. The ratchet records the new scenario IDs and the test links.

## Known limits and later changes

- Known limit `terms`: FL511 limits its content to individual non-commercial use. The research of 2026-10-08 found that FDOT does not host the layer and that another ArcGIS account does. The layer metadata has no license text. Each camera carries the use limit in its `license` field, and `DATA_SOURCES.md` names it. The owner decides whether to keep the pack.
- Known limit `credit`: The change adds no entry to `src/data/dataCredits.js`. The coverage of that file is untrue, and a changed line there raises a coverage error that no waiver clears. The cause of the untrue coverage is not known. A later change can look for it.
- Known limit `layer-age`: The layer shows 2026-07-20 as its last edit. A camera that FDOT added after that date is absent.
- Known limit `heading`: The field DIRECTION can differ from the camera heading. A check of 59 descriptions found 4 that disagree with the field. The check cannot tell whether the field gives the travel direction or the direction of the camera. The pack uses the field as an estimate and sets the confidence "low".
- Known limit `florida-pack`: Upstream pull request 605 adds a Florida pack from the same layer. Both packs use the ids "fl-" and the channel number, so a camera appears once. The pose values and the heading confidence differ. A later change retires this pack after the sync that brings pull request 605.
- Known limit `caps`: The default caps of all packs sum to 4955. This pack adds 120, so the sum is 5075, above the ceiling of 5000. The catalog cap of 4000 already cuts the number of cameras of the packs.
- Known limit `dead-frames`: A check on 2026-10-09 found that 17 of 65 frames answer HTTP 200 and 48 answer HTTP 404. The frame route shows a fallback image for each dead frame. The file `evidence/frame-census.txt` lists each channel. A check on 2026-10-08 had found 5 dead frames of 66, so the count changes between days. The owner decides whether 17 cameras justify the pack.
- Known limit `one-page`: The pack reads one page of 200 rows and ignores the flag exceededTransferLimit. A probe of 2026-10-09 found 83 rows in an area that reaches farther east.
- Known limit `mutants`: The automatic mutation run of `pensacola.js` has 656 changes, and tests fail for 634 of them. The 22 changes that no test fails have no effect on a real FL511 answer. They are 17 swaps of independent statements or conditions and one change for the numeric description 0. They are also two optional accesses and two changes for the status 299. A catch block covers one optional access, and the other one matters only for a thrown null or undefined. The file `evidence/automatic-mutations.txt` lists them.
- Known limit `null-body`: A JSON body of null makes the pack write the warning "download error" and return an empty list. Scenario 025 names the warning "answered with an error" for a body with no features list.
- Known limit `warning-count`: The tests of live-sources-022 to live-sources-025 read the first warning only, so they do not pin that the pack writes one warning.
- Known limit `test-env`: The catalog tests of live-sources-027 and live-sources-028 do not clear the settings CCTV_SOURCES_FILE, CCTV_SOURCES_JSON, CCTV_PREFER_AUSTIN and CCTV_MAX_SOURCES. A value of one of them in the environment can fail the tests.
- Known limit `unpinned`: Three behaviors have no scenario. The first is the pack name "pensacola" and its place after "vegvesen" in the catalog. The second is the trim of a description that has letters. The third is a layer address that is not valid, and it gives the warning "download error".
- Known limit `live-check`: The tests use fake responses. The lead checks one real layer answer and two real frames through the frame route, and stores the output in `evidence/live-check.txt`.
