## Why

Change 1, `gdacs-source`, added the route `/api/gdacs`. The route gives recent flood, drought, volcano and tropical cyclone events of GDACS. Nothing shows them on the globe yet.

This is change 2 of 2. On 2026-10-18 the owner told the lead to build it. It adds the layer "Disaster Alerts".

A point marks each event. The color shows the alert level, and the size and the alpha show the value of the field `current`. A label shows the first 32 code points of the name of up to 48 events. The events with `current` true come first, then the highest alert level, then the newest.

The names come from GDACS. The layer treats each name as untrusted text and cleans it again in the browser.

## What Changes

- Add the folder `src/layers/gdacs/` with the files `records.js`, `source.js`, `model.js` and `index.js`, and add the file `src/app/layers/gdacs.js`.
- Add the capability `gdacs-layer` with 22 scenarios, `gdacs-layer-001` to `gdacs-layer-022`.
- Register the layer in the catalog, the source composition, the reference sources, the share link and the token ledger.
- Add the layer to the layer panel, the credits, the layer names and the voice-off list.
- Add a Spanish text and a Russian text for each of the three new English texts of the layer.
- Change the count in the scenario `osh-033` of the capability `osh` from 33 to 36.
- Add the test files `src/layers/gdacs/records.test.mjs`, `source.test.mjs`, `model.test.mjs`, `layer.test.mjs` and `registration.test.mjs`.
- Update the tests that count layers, list the reference sources, or use the token "9" as a free token. Tasks 2.6 to 2.16 name each change of these tests.
- Write one entry in `CHANGELOG.md`. Name the layer in the GDACS row and in the GDACS section of `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `gdacs-layer`: Six requirements. They cover the layer record, the browser source, the event records, the display model, the layer display and the registration.

### Modified Capabilities

- `osh`: The scenario `osh-033` says that the registry has 36 entries now. The delta carries the whole requirement "Systems layer", and the other eight scenarios stay as they are.

## Impact

The new files are files that the fork writes. So the change adds their paths to `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.

The share token is "9". The check of `make precheck` needs the next free digit, so there is no choice.
The tests of the token ledger use "9" as the last free digit. Their fixtures leave out the layer `gdacs`, so "9" stays free in each fixture and each test title stays true. `design.md` D6 gives the details.

The scenario `osh-033` says 33 entries. Sync 6 added two upstream layers, changed the test of `osh-033` to 35 entries, and did not change the scenario. This change makes the scenario and the test say 36.

The change adds no route, no dependency and no server file.

## Known limits and later changes

- Known limit `no-card`: The layer has no detail card. The viewer has no info box, and the earthquake layer and the Reticulum layer have none either. A label shows the first 32 code points of the name of an event, and a click does nothing. The layer does not show the fields `country`, `from`, `to`, `severity` or `reportUrl`.
- Known limit `long-id`: The route accepts each positive whole number as an event id. An id of more than 16 digits does not meet the rules of the layer. An id that JavaScript writes with an exponent does not meet them either. The layer drops such an event. The 65 records of 2026-10-16 have ids of 7 digits.
- Known limit `names`: The normalizer removes U+200C and U+200D from a name, so a name in a language that uses joiners loses them. Other invisible characters stay, for example U+00AD, U+180E, U+2800, U+3164 and U+E0000 to U+E007F.
- Known limit `labels`: The layer shows at most 48 labels. The overlay host decides which of them fit on the screen.
- Known limit `voice`: The layer is in the list `VOICE_OFF_LAYERS`, and it has no function `getAnalystRecords`.
- Known limit `token`: The share token "9" is the last free digit in this fork. The next layer gets a token of two characters. If upstream gives "9" to an upstream layer, an upstream share link with "9" opens the GDACS layer in the fork.
- Known limit `stale`: The layer keeps the points of a stale document, and the panel does not show that the document is stale.
- Known limit `position`: GDACS gives one point for each event. A drought or a flood covers an area, and the point shows only one place in it.
- Known limit `refresh`: The layer asks the route every 10 minutes, and the provider caches its document for 10 minutes. So a point of a good document can show a state that is up to 20 minutes old. A point of a stale document can be up to 70 minutes old. After a failed request, the layer keeps the last points until a request succeeds.
- Known limit `labels-after-enable`: `disable` removes the labels, and `enable` does not give them again. So after `disable` and `enable`, the layer shows its old points with no labels until a call of `update` succeeds. The layer manager calls `update` right after `enable`, and it disables the layer when that call fails.
- Known limit `osh-count`: The scenario `osh-033` names the count of the registry, so each new layer needs a new delta of the capability `osh`.
- Known limit `visual`: The lead looks at the layer on one machine in one headless Chrome with a stored document. No test draws the points.
