## Why

The owner asks to remove the Pensacola camera pack (decision of 2026-10-10).
A check on 2026-10-09 found that 17 of the 65 cameras of the pack served a frame. The FL511 terms limit the content to individual non-commercial use, and the layer has no license text.

## What Changes

- Remove the module `server/providers/cctv/pensacola.js` and its test file `src/data/cctvPensacola.test.mjs`.
- Remove the import and the pack entry `pensacola` from `server/providers/cctv/catalog.js`.
- Remove the module from `scripts/package-boundaries.json`, the test file from `scripts/format-scope.json`, and both files from `openspec/ownership.json`.
- Remove the three settings from `.env.example`, the row and the bullet from `DATA_SOURCES.md`, and the pack name from the CCTV rows of `README.md` and `docs/CURRENT-STATE.md`.
- Write an entry in `CHANGELOG.md`.
- Remove the three requirements, and add the retired IDs `live-sources-010` to `live-sources-030` to `openspec/trace/retired-ids.json`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `live-sources`: Remove the requirements "Pensacola camera rows", "Pensacola layer request" and "Pensacola pack settings". The Purpose loses the two sentences about the Pensacola pack.

## Impact

Rule 23: the change removes two paths from `openspec/ownership.json`. The owner asked for the removal of the pack, so the owner reads this diff in the pull request.

The change removes one owned code file and one owned test file. They had no entry in the gap ledger, so no gap closes or opens.
The ledger entry of `server/providers/cctv/catalog.js` loses the totals that the Pensacola lines added. The numbers of its uncovered lines stay the same.

Retired scenarios: the change retires the scenarios `live-sources-010` to `live-sources-030` and deletes their tests with the code. The lead adds the IDs to `openspec/trace/retired-ids.json` after the archive.
The archived change `2026-10-09-cctv-pensacola` stays as history.

## Known limits and later changes

- Known limit `env`: A server that has a CCTV_PENSACOLA setting in its environment ignores it after this change.
- Known limit `pr-605`: Upstream pull request 605 adds a Florida pack from the same layer. If the pull request lands, the Pensacola cameras can return through the Florida pack. A sync then decides whether to keep the Florida pack.
- Known limit `readme-count`: The CCTV row of `README.md` keeps the text "Up to 4,000 public cameras". The catalog cap makes the text true without the pack.
- Later change: None. The data credit for the pack is not needed.
