## Context

Base commit: `2f53da248ca36889c1465d0fb22d4c5be9b96419` (main, after the merge of `upstream-sync-6`).
The route `/api/gdacs` gives a document with the schema version 1. The layer reads the list `events`, the object `counts` and the fields `unavailable`, `stale`, `reason` and `fetchedAt` of the document.
Each event of the route has 18 fields. The layer reads `id`, `type`, `name`, `alert`, `current`, `latitude`, `longitude` and `modified`.

The Reticulum layer is the model: static points, labels through the overlay host, a stats object and no click card.

## Decisions

### D1: Modules without Cesium

The files `records.js`, `source.js` and `model.js` do not import Cesium. They hold the rules for the records, the request, the styles and the choice of the labels.
Only `index.js` imports Cesium. All tests run on the host and in the image.

### D2: The layer treats names as untrusted text

The provider of the route removes control characters and the characters `<` and `>` from a name, and it cuts the name to 120 characters.
The layer cleans the names again in the browser. It removes the code points that the requirement "Event records" lists.
The overlay draws a title with `fillText` of a canvas. So a name cannot inject HTML.
The layer has no analyst entry and no voice entry.

### D3: The rules of an event

The browser rules repeat the rules of the route for the type, the id and the alert level. The route builds the id from the type and the event id, and the event id can have 16 digits.

The rules do not drop the position (0, 0). The route keeps a position near (0, 0), for example (0.0004, 0.0004), and rounds it to (0, 0). So (0, 0) can come from a valid record.
A `modified` value that is not a date gives null, and the event stays. The labels need `modified` only for their order.

### D4: Unavailable and stale documents

A document with `unavailable` true has no events. The layer shows no point. It sets the guidance status `idle` with the reason as `statusMessage`, so the panel shows a prompt and no red fault.
A document with `stale` true keeps its points. A request that fails keeps the last points and sets `error`.

### D5: The style

The color shows the alert level, because GDACS rates each event with the levels green, orange and red.
A current event has a full alpha and a larger point. An event that is not current has a lower alpha and a smaller point. GDACS can list such an event in the window of 14 days.

### D6: Registrations

The catalog places the layer right after `gnss-integrity`. The share token is "9", the next free digit. The ledger file `src/data/layerStateTokenReservations.json` gets the row of the layer.
The layer panel puts the layer at the end of the group "Events", after `gnss-integrity`.
The credit names GDACS, its two partners and the warning that a machine makes the estimates. The layer name and the two error texts get Spanish and Russian texts, because the upstream text check finds each text of `msg()`.

The tests that count layers need new counts: 37 layers in the catalog and 36 entries in the registry.
Five tests of the token ledger use "9" as a free token. They change to "00".

### D7: The count in the OSH scenario

The scenario `osh-033` says that the registry has 33 entries. Its test checks 35 entries since sync 6, which added two layers and did not change the scenario.
The delta of the capability `osh` changes that number to 36. It carries the whole requirement "Systems layer" and the other eight scenarios unchanged, so their hashes stay the same.

### D8: Tests and checks

Each scenario has a test with its ID. A named fault for each rule, limit and color must make a test fail. The faults run on the host.
The visual check runs without a container. The lead starts a Vite server from a copy of the commit with a stored document, and drives a headless Chrome. The app container of the owner is not touched.

## Files and measures

The trace gate checks that the tests carry the IDs `gdacs-layer-001` to `gdacs-layer-022`. The coverage gate needs 100% of lines, branches and functions in each new code file, and in each changed line of an upstream code file.
The named faults measure whether a change of a rule, a limit or a color makes a test fail. The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show, as points on the globe, the recent flood, drought, volcano and storm alerts of GDACS. Treat every name as untrusted text, and keep the layer out of voice."
