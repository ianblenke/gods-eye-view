## Source

Base commit: `629bbfdd` (main, after the merge of sync 4).
The capability `live-sources` holds the requirements for the CCTV packs. The Ontario change added its first CCTV requirements there, so this change adds requirements to it.
The pack follows the pattern of the Calgary loader in `server/providers/cctv/sources.js`. That pattern has a request that needs no key, a manual redirect mode, a size limit and a pure row mapper.

## Key decisions

### D1: One new module

The loader, the row mapper, the area bounds and the constants are in the new module `server/providers/cctv/pensacola.js`.
Upstream pull request 605 changes `constants.js`, `normalize.js` and `sources.js` for a Florida pack. This change leaves those files as they are.
The only edit to a current code file is the import and the pack entry in `catalog.js`.

### D2: Ids and frame address

The id is "fl-" and the channel number. The channel number is the digits of `chan-<digits>_h.jpg` in the image address.
The field ID of the layer repeats across regions, so the pack does not ask for it.

The pack builds the frame address from the channel number: "https://images-dis.divas.cloud/DGI/chan-<digits>_h.jpg". It never copies the address of the row.

A row with another host, another scheme, a port, user information, a suffix after the file name or no channel number gives no source. The layer has such a row, a trailer camera on another host.

### D3: Area and position

The area is the latitude range 30.20 to 30.85 and the longitude range -87.65 to -86.80. The ranges include both ends.
The query asks for the same envelope. The mapper checks the position again, because the layer can give a row at the edge or a row with a bad position.

The pack reads the fields LATITUDE and LONGITUDE and not the geometry. The query sets returnGeometry to false, and the answer is smaller.
A latitude or a longitude that is text gives no source, even when the text holds a number.

### D4: Heading

The 83 rows of the probe have only the directions N, S, E and W. The pack trims spaces at both ends of the value.
The pack maps N, E, S and W to 0, 90, 180 and 270 degrees with the confidence "low". Any other value uses the fallback heading of the id, also with the confidence "low".
The pose values are the low-confidence values of the other still packs: pitch -18, field of view 44, range 145 and mount height 8. The ground height is 5 meters.

### D5: Request and failure

The pack sends one request with a timeout of 15000 milliseconds, the Accept header and the manual redirect mode.
The query asks for 200 rows. The layer limit is 2000 rows, so the pack reads one page and ignores the flag exceededTransferLimit.

The pack reads at most 1048576 bytes. Each failure gives an empty list, and the pack cancels the body of an answer that it does not read.
ArcGIS can answer HTTP 200 with an error member. The pack treats that answer as a failure.

### D6: Settings and caps

`CCTV_PENSACOLA_ENABLED` is on unless the value is "0". `CCTV_PENSACOLA_MAX_SOURCES` has the default 120 and the range 8 to 200. `CCTV_PENSACOLA_ROWS_URL` replaces the layer address.
The pack keeps the sources nearest to the point 30.4213 and -87.2169, nearest first. The point is the city center of Pensacola.

### D7: Ownership and credit

The module and its test file are in `openspec/ownership.json`, because the fork writes them. The coverage rule for owned files applies to them.
The change adds no entry to `src/data/dataCredits.js`. See the Known limit `credit` in the proposal.

## Files and measures

The change adds `server/providers/cctv/pensacola.js` and `src/data/cctvPensacola.test.mjs`. It changes `server/providers/cctv/catalog.js`, `scripts/package-boundaries.json`, `scripts/format-scope.json`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md`, `README.md`, `docs/CURRENT-STATE.md` and `CHANGELOG.md`.

The coverage gate measures the new module. It has no ledger entry, so it needs 100% line, branch and function coverage.
The ledger gate compares the gap of `catalog.js` with the recorded gap. The new lines must add no gap.

The trace gate checks that the tests carry the scenario IDs `live-sources-010` to `live-sources-029`.
The package boundary check measures the import directions of the new module. The format check finds files that do not use the project code style.

The prose lint checks STE. The OpenSpec commands check the change structure.
The named faults measure whether a code fault makes each test fail. The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead adds these sentences to the live-sources Purpose at archive time:
"The capability also has requirements for the Pensacola camera pack. It has requirements for the layer request and the pack settings."
