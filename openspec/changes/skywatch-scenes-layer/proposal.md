## Why

On 2026-10-21 the owner asked for a satellite imagery aggregator, and chose SkyWatch EarthCache. Change 1, `skywatch-source`, added the route `/api/skywatch/scenes`. Change 2, `skywatch-thumbnails`, let that route accept requests through the reverse proxy, and added the route `/api/skywatch/thumbnail/<id>`. Nothing shows the scenes on the globe yet.

This is change 3 of 3. It adds the layer "SkyWatch Scenes". A press of the chip "Search scenes here" sends one search. The search is for a box of 48 km by 48 km at the view centre, and for the last 92 days. The layer draws the footprint of each scene on the ground, and the row of the layer lists the scenes. A click on an item of the list selects that scene and shows its thumbnail as a card on the globe.

## What Changes

- Add the folder `src/layers/skywatchScenes/` with the files `box.js`, `records.js`, `source.js`, `messages.js`, `model.js` and `index.js`, and add the file `src/app/layers/skywatchScenes.js`.
- Add the capability `skywatch-scenes-layer` with 37 scenarios, `skywatch-scenes-layer-001` to `skywatch-scenes-layer-037`.
- Register the layer in the catalog, the source composition, the reference sources, the share link and the token ledger.
- Add the layer to the layer panel, the credits, the layer names and the voice-off list.
- Add a Spanish text and a Russian text for the name of the layer.
- Change the count in the scenario `osh-033` of the capability `osh` from 36 to 37.
- Add the test files `box.test.mjs`, `records.test.mjs`, `source.test.mjs`, `messages.test.mjs`, `model.test.mjs`, `layer.test.mjs` and `registration.test.mjs` in the new folder.
- Update the tests that count layers, list the reference sources, or use the token "00" as a free token or as an unknown token. Tasks 2.11 to 2.22 name each change of these tests.
- Make the QA script `scripts/qa-layer-token-twochar.mjs` use the next free token of two characters in place of "00".
- Update the paragraph about that QA script in `docs/CURRENT-STATE.md`.
- Write one entry in `CHANGELOG.md`. Name the layer in the SkyWatch section of `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `skywatch-scenes-layer`: Eleven requirements. Six of them cover the layer record, the press, the status of the key, the box and the dates, the source and the records. The other five cover the messages, the display model, the layer display, the scene selection and the registration.

### Modified Capabilities

- `osh`: The scenario `osh-033` says that the registry has 37 entries now. The delta carries the whole requirement "Systems layer", and the other eight scenarios stay as they are.

## Impact

The new files are files that the fork writes. So the change adds their paths to `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.

The share token is "00". Each token of one character has an owner, and the check of `make precheck` needs the next free token. So there is no choice. The tests of the token ledger use "00" as the next free token. Their fixtures do not include the layer `skywatch-scenes`, so "00" stays free in each fixture and each test title stays true. `design.md` D10 gives the details.

The QA script `scripts/qa-layer-token-twochar.mjs` adds a fixture layer with the token "00" to a browser, and it stops when the production ledger has "00". The change makes the script use the next free token of two characters, so the fixture gets "01". `docs/CURRENT-STATE.md` asks that the first real layer with "00" passes its own check of a share link and a new page load. Task 4.6 does that check in a headless Chrome.

The layer sends requests only to the status route and the scenes route of change 1, and to the thumbnail route of change 2. The change adds no route, no dependency and no server file.

## Known limits and later changes

- Known limit `display-terms`: SkyWatch publishes no terms for the display of footprints or thumbnails. The credit of the layer tells the person to use the data only for themselves. The owner must get the terms before another person sees the layer.
- Known limit `no-pick`: A click on a footprint does nothing. A person selects a scene in the list of the row.
- Known limit `clock-skew`: The layer takes the dates from the clock of the browser. When that clock is ahead of the clock of the server near midnight UTC, the server refuses the dates. The message tells the person to check the clock.
- Known limit `search-time`: The layer stops a search after 60 seconds. The server continues the search, and it keeps a good answer for 10 minutes. A press with the same view on the same UTC day then gets that answer and does not use the daily limit.
- Known limit `view-moves`: The layer searches the box of the view at the time of the press. When the view moves, the footprints stay where they are until the next press.
- Known limit `antimeridian`: The card of a footprint goes to the mean of the positions of its ring. For a footprint that crosses the 180th meridian, the card and the polygon are not correct. The box of a search never crosses that meridian, but a footprint can.
- Known limit `list-length`: The row lists up to 50 scenes.
- Known limit `thumbnails-off`: The route of the thumbnails is off until `SKYWATCH_THUMBNAILS=true` is in `.env`. Until then, a selection shows a message and no card.
- Known limit `real-service`: No test and no check sends a request to SkyWatch, because the project has no key. The lead looks at the layer with a stored answer and a stored image.
- Known limit `token`: The share token "00" is the first token of two characters. If upstream gives "00" to an upstream layer, an upstream share link with "00" opens this layer in the fork.
- Known limit `image-size`: The layer does not limit the pixel size of a decoded thumbnail. The route sends at most 1 MiB, and the card shows the image at a longer side of 192 pixels. The API description of SkyWatch gives 100 by 100 pixels for a thumbnail.
- Known limit `ui-texts`: The chip label "Searching…" and the text "Loading the thumbnail…" use -ing words. The layer "Bee Maps Frames" has the label "Fetching…".
- Known limit `osh-count`: The scenario `osh-033` names the count of the registry, so each new layer needs a new delta of the capability `osh`.
- Known limit `visual`: The lead looks at the layer on one machine in one headless Chrome. No test draws the footprints or the card.
