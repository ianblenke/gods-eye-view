## Context

Base commit: `2f53da248ca36889c1465d0fb22d4c5be9b96419` (main, after the merge of `upstream-sync-6`).
The route `/api/gdacs` gives a document with the schema version 1. The layer reads the fields `schemaVersion`, `events`, `counts`, `unavailable`, `stale`, `reason` and `fetchedAt` of the document.
Each event of the route has 18 fields. The layer reads `id`, `type`, `name`, `alert`, `current`, `latitude`, `longitude` and `modified`.

This layer copies the Reticulum layer: static points, labels through the overlay host, a stats object and no detail card.

## Decisions

### D1: Modules without Cesium

The files `records.js`, `source.js` and `model.js` do not import Cesium. They hold the rules for the records, the request, the styles and the choice of the labels.
Only `index.js` imports Cesium. All tests run on the host and in the image.

### D2: The layer treats names as untrusted text

The provider of the route removes control characters and the characters `<` and `>` from a name. It cuts the name to 120 UTF-16 code units.

The layer cleans the names again in the browser. It removes the code points that the requirement "Event records" lists.
The overlay draws a title with `fillText` of a canvas. So a name cannot inject HTML.
The layer has no function `getAnalystRecords` and no voice tools.

### D3: The rules of an event

The browser rules check the type and the alert level as the route writes them. The id rule also limits the event id to 16 digits. So the layer drops an id that the route builds from a larger number (Known limit `long-id`).

The rules do not drop the position (0, 0). The route keeps a position near (0, 0), for example (0.0004, 0.0004), and rounds it to (0, 0). So (0, 0) can come from a valid record.
A `modified` value that is not a date gives null, and the event stays. The labels need `modified` only for their order.

### D4: Unavailable and stale documents

The layer removes all points when `meta.unavailable` is true. It sets the guidance status `idle` with the reason as `statusMessage`, or with the text "GDACS unavailable" when the document gives no reason. So the panel shows the reason as a prompt and not as a red error. The next result that is not unavailable removes the guidance status.
The layer keeps the points of a document with `stale` true. When a request fails, the layer keeps the last points and sets `error`.

### D5: The style

The color shows the alert level, because GDACS rates each event with the levels green, orange and red.
An event with `current` true has a full alpha and a larger point. An event with `current` false has a lower alpha and a smaller point. GDACS can list such an event in the window of 14 days.

### D6: Registrations and the tests that change

The catalog places the layer right after `gnss-integrity`. The share token is "9", the next free digit. The ledger file `src/data/layerStateTokenReservations.json` gets the row of the layer.
The layer panel puts the layer at the end of the group "Events", after `gnss-integrity`.
The credit names GDACS and its two partners, and it holds the disclaimer of the route.

The layer name, the error text "GDACS source unavailable" and the prompt text "GDACS unavailable" get Spanish and Russian texts. The text tests of `src/i18n/` check each text that `msg()` marks.

The tests that count layers need new counts: 37 layers in the catalog and 36 entries in the registry. The test of the reference sources lists their names, and it gets "gdacs".

The tests of the token ledger in `src/data/layerStateTokenLedger.test.mjs` use "9" as the last free digit. Their fixture rows leave out the row of `gdacs`. The helper `writeCodecFixture` removes the registry entry of `gdacs` from its copy of `src/data/layerState.js`. So "9" stays free in each fixture, and each test title stays true.
The test of the complete ledger reads all rows: it counts 36 rows and expects `gdacs` with "9". One fixture compares its ledger with the published ledger without `gdacs`.

The test "production registry is exact, canonical, and rejects incomplete contracts" in `src/data/layerState.test.mjs` reads the real ledger. The real ledger gives the next free token "00". The samples of that test that need a free digit use the ledger without `gdacs`.

### D7: The count in the OSH scenario

The scenario `osh-033` says that the registry has 33 entries. Sync 6 added two layers, changed the test of `osh-033` to 35 entries, and did not change the scenario.
The delta of the capability `osh` changes that number to 36. It carries the whole requirement "Systems layer" and the other eight scenarios unchanged, so their hashes stay the same.

### D8: Tests and checks

Each scenario has a test with its ID. A named fault for each rule, limit and color must make a test fail. The faults run on the host.
The visual check runs without a container. The lead starts a Vite server from a copy of the commit with a stored document, and drives a headless Chrome. The lead does not touch the app container of the owner.

## Files and measures

The trace gate checks that the tests carry the IDs `gdacs-layer-001` to `gdacs-layer-022`. The coverage gate needs 100% of lines, branches and functions in each new code file. Each changed line of an upstream code file needs line coverage.
The named faults measure whether a change of a rule, a limit or a color makes a test fail. The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show, as points on the globe, the recent flood, drought, volcano and tropical cyclone events of GDACS. Treat every name as untrusted text, and keep the layer out of voice."
