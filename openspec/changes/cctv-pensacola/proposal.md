## Why

The owner asks for traffic cameras of the Pensacola area. The FL511 layer has more than 60 still-image cameras in Escambia County and Santa Rosa County. No pack of the catalog covers Florida.

## What Changes

- Add the module `server/providers/cctv/pensacola.js`. It loads the cameras of the Pensacola area from the FL511 layer.
- Add the pack `pensacola` to `server/providers/cctv/catalog.js`, after the pack `vegvesen`.
- Add the settings `CCTV_PENSACOLA_ENABLED`, `CCTV_PENSACOLA_MAX_SOURCES` and `CCTV_PENSACOLA_ROWS_URL` to `.env.example`.
- Write the notice of the FL511 use limit in `DATA_SOURCES.md`.
- Add the Pensacola pack to the CCTV rows of `README.md` and `docs/CURRENT-STATE.md`, and write an entry in `CHANGELOG.md`.
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

- Known limit `terms`: FL511 limits its content to individual non-commercial use. FDOT does not host the layer. Another ArcGIS account hosts it. The layer metadata has no license text. Each camera carries the use limit in its `license` field, and `DATA_SOURCES.md` names it. The owner decides whether to keep the pack.
- Known limit `credit`: The change adds no entry to `src/data/dataCredits.js`. The coverage of that file is untrue, and a changed line there raises a coverage error that no waiver clears. The cause of the untrue coverage is not known. A later change can look for it.
- Known limit `layer-age`: The layer shows 2026-07-20 as its last edit. A camera that FDOT added after that date is absent.
- Known limit `heading`: The field DIRECTION can differ from the camera heading. A check of 59 descriptions found 4 that disagree with the field. The check cannot tell whether the field gives the travel direction or the direction of the camera. The pack uses the field as an estimate and sets the confidence "low".
- Known limit `florida-pack`: Upstream pull request 605 adds a Florida pack from the same layer. Both packs use the ids "fl-" and the channel number, so a camera appears once. The pose values and the heading confidence differ. A later change retires this pack after the sync that brings pull request 605.
- Known limit `caps`: The default caps of all packs sum to 4955. This pack adds 120, so the sum is 5075, above the ceiling of 5000. The catalog cap of 4000 already cuts the number of cameras of the packs.
- Known limit `dead-frames`: A check on 2026-10-08 found 5 of 66 frames with HTTP 404. The frame route then shows a fallback image.
- Known limit `one-page`: The pack reads one page of 200 rows and ignores the flag exceededTransferLimit. A probe of 2026-10-09 found 83 rows in an area that reaches farther east.
- Known limit `live-check`: The tests use fake responses. The lead checks one real layer answer and one real frame, and stores the output in `evidence/live-check.txt`.
