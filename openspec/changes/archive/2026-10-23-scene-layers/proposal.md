## Why

The owner has accounts at Planet and SkyFi. The changes `planet-source` and `skyfi-source` added the server routes for both services. This change, the third of three, adds the layers that show their scenes. On 2026-10-22 the owner selected one layer for each service, on one shared layer module. The layer "SkyWatch Scenes" and its token stay as they are.

The two layers copy the behavior of the layer "SkyWatch Scenes". A person presses a chip, and the layer sends one search for a box of about 48 km at the view centre. The layer draws the footprint of each scene on the ground. A click on a scene in the list shows its thumbnail as a card.

The change adds no server code and sends no request to a service. The layers call only the routes of this app.

## What Changes

- Add the shared module `src/layers/sceneLayer/`. It holds a function that makes a source and a function that makes a layer. It also holds the rules for the records, the texts and the display, and the values of the two services.
- Add the layer "Planet Scenes" (`planet-scenes`, token "01") and the layer "SkyFi Scenes" (`skyfi-scenes`, token "02"). Each layer has the source `/api/planet/*` or `/api/skyfi/*` of its service.
- A scene can have more than one footprint part. A scene of Planet can be a `MultiPolygon` of up to 16 parts. The layer draws each part.
- The layer shows the name of the satellite provider that SkyFi gives for a scene, for example "Vantor" or "Sentinel-2".
- Register both layers in the catalog, the reference sources, the share link, the layer panel and the credits.
- Add the Spanish and the Russian texts, and put both layers in the list of layers without voice.
- The credit of "Planet Scenes" has the copyright notice that names Planet, as the terms of Planet ask. The credit of "SkyFi Scenes" gives the limit of the terms of SkyFi.
- Correct the comment of `scripts/qa-layer-token-twochar.mjs`. Its fixture token becomes "03" by itself, because the two layers take "01" and "02".

## Capabilities

### New Capabilities

- `scene-layers`: The shared module and the two layers "Planet Scenes" and "SkyFi Scenes".

### Modified Capabilities

None.

## Impact

New owned code files: `src/layers/sceneLayer/{records,messages,model,source,index,services}.js` and `src/app/layers/sceneLayers.js`.
New owned test files: `src/layers/sceneLayer/{records,messages,model,source,layer,registration}.test.mjs`.
Rule 23: the change adds each new file to `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.

The shared module imports `scenesBox` and `searchWindow` from `src/layers/skywatchScenes/box.js`, and it does not edit that file. The change edits the upstream files that list the layers: `src/app/constructCatalog.js`, `src/app/sourceComposition.js`, `src/sources/reference.js`, `src/data/layerState.js`, `src/data/layerStateTokenReservations.json`, `src/ui/layerPanel.js`, `src/ui/layerNames.js`, `src/voice/layerManifest.js`, `src/data/dataCredits.js` and the files `es.json` and `ru.json`. It edits the upstream tests `src/data/layerState.test.mjs`, `src/data/layerStateTokenLedger.test.mjs`, `src/app/constructCatalog.test.mjs`, `src/app/sourceComposition.test.mjs` and `src/sources/reference.test.mjs`, and the QA script. It edits the documents `docs/CURRENT-STATE.md`, `CHANGELOG.md` and `DATA_SOURCES.md`.
The change adds no dependency. It opens no gap and closes no gap in `openspec/trace`.

## Known limits and later changes

- Known limit `no-product-type`: The routes give the product type of a SkyFi scene (optical, radar). The layer does not show it.
- Known limit `service-names`: The layer knows the names of four satellite providers of SkyFi. For another code, it shows the code with each underscore changed to a space.
- Known limit `thumbnail-only-first-part`: The card of a scene is at the centre of the first footprint part.
- Known limit `thumbnail-id`: The source puts the id of a scene into the thumbnail URL as it is. The records rule lets only ids of letters, digits, hyphens and underscores pass, so a bad id never reaches the URL.
- Known limit `thumbnail-codes`: The thumbnail routes can answer `no_key` or `key_rejected`. The layer has no text for them and shows the text for an unknown error.
- Known limit `one-user`: The terms of Planet and SkyFi allow the owner to view the data. The layers keep no image, but the routes do not suit a site with more users.
- Known limit `press-after-error`: As in the layer "SkyWatch Scenes", no test presses the chip again after a failed search. The tests call `disable` and `enable` first.
- Known limit `live-check`: The tests use fake sources. One check in a real browser with a fake upstream shows both layers (`evidence/browser.txt`).
