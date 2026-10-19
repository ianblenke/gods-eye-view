## Why

Change 1, `gdacs-source`, added the route `/api/gdacs`. The route gives recent flood, drought, volcano and tropical cyclone alerts of GDACS. Nothing shows them on the globe yet.

This is change 2 of 2. On 2026-10-18 the owner told the lead to build it. It adds the layer "Disaster Alerts". A point marks each event. The color shows the alert level, and the size and the alpha show whether the event is current. A label shows the name of up to 48 events: the current events first, then the highest alert level, then the newest.

The names come from GDACS. The layer treats each name as untrusted text and cleans it again in the browser.

## What Changes

- Add the folder `src/layers/gdacs/` with the files `records.js`, `source.js`, `model.js` and `index.js`, and add the file `src/app/layers/gdacs.js`.
- Add the capability `gdacs-layer` with 22 scenarios, `gdacs-layer-001` to `gdacs-layer-022`.
- Register the layer in the catalog, the source composition, the reference sources, the share link and the token ledger.
- Add the layer to the layer panel, the credits, the layer names and the voice-off list.
- Add the Spanish and Russian texts of the three new texts of the layer.
- Change the count in the scenario `osh-033` of the capability `osh` from 33 to 36.
- Add the test files `src/layers/gdacs/records.test.mjs`, `source.test.mjs`, `model.test.mjs`, `layer.test.mjs` and `registration.test.mjs`.
- Update the tests that count layers or use the token "9" as a free token. Write one entry in `CHANGELOG.md` and one paragraph in `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `gdacs-layer`: Six requirements. They cover the layer record, the browser source, the event records, the display model, the layer display and the registration.

### Modified Capabilities

- `osh`: The scenario `osh-033` says that the registry has 36 entries now. The delta carries the whole requirement "Systems layer", and the other eight scenarios stay as they are.

## Impact

The new files are files that the fork writes, so they go into `openspec/ownership.json` and `scripts/format-scope.json`. The upstream files get as few new lines as possible.

The share token is "9". The check of `make precheck` needs the next free digit, so there is no choice.
Five tests of the token ledger use "9" as a free token in their fixtures. They change to "00", which is the next free token after "9".

The scenario `osh-033` says 33 entries, but its test checks 35 entries since sync 6. Sync 6 added two upstream layers and changed only the test. This change makes the scenario and the test say 36.

The change adds no route, no dependency and no server file.

## Known limits and later changes

- Known limit `no-card`: The layer has no detail card. The viewer has no info box, and the earthquake layer and the Reticulum layer have none either. A label shows the name of an event, and a click does nothing. The layer does not show the country, the dates, the severity or the report link of an event.
- Known limit `names`: The normalizer removes U+200C and U+200D from a name, so a name in a language that uses joiners loses them. Other invisible characters stay, for example U+00AD, U+180E, U+2800, U+3164 and U+E0000 to U+E007F.
- Known limit `labels`: The layer shows at most 48 labels. The overlay host decides which of them fit on the screen.
- Known limit `voice`: The layer is in the list `VOICE_OFF_LAYERS`, and it has no analyst entry.
- Known limit `token`: The share token "9" is the last free digit in this fork. The next layer gets a token of two characters. When upstream gives "9" to an upstream layer, an upstream share link with "9" opens the GDACS layer in the fork.
- Known limit `stale`: The layer keeps the points of a stale document, and the panel shows no sign of it.
- Known limit `position`: GDACS gives one point for each event. A drought or a flood covers an area, and the point shows only one place in it.
- Known limit `refresh`: The layer asks the route every 10 minutes, and the provider caches its document for 10 minutes. So a point can show a state that is up to 20 minutes old.
- Known limit `osh-count`: The scenario `osh-033` names the count of the registry, so each new layer needs a new delta of the capability `osh`.
- Known limit `visual`: The author looks at the layer on one machine in one headless Chrome with a stored document. No test draws the points.
