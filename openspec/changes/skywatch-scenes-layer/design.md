## Context

The route `/api/skywatch/scenes` of `skywatch-source` accepts a POST request with a box of at most 2500 km² and a window of at most 92 days. It gives at most 50 scenes, the newest first, with the footprint of each scene. It counts each new upstream search against a daily limit. The route `/api/skywatch/status` tells if the server has a key. The route `/api/skywatch/thumbnail/<id>` of `skywatch-thumbnails` gives the thumbnail of a scene of a kept answer, when `SKYWATCH_THUMBNAILS=true` is in `.env`.

The layer "Bee Maps Frames" (`src/layers/beemaps/`) also sends one request for each press of a chip. It reads the status at each `update`, and it has the update interval 0. This change uses its shape.

The viewer of the app has no info box. The overlay host of the app (`src/app/layers/overlayHost.js`) paints cards on the globe, and the variant `thumbnail` paints an image with a title. The CCTV layer uses that variant for its still images.

## Goals / Non-Goals

**Goals:**
- Show the footprints of the archive scenes at the view centre, after a press and only after a press.
- Let a person select a scene and see its thumbnail.
- Name each failure of the three routes in the row of the layer.

**Non-Goals:**
- An order, a price request or the image of `preview_uri`.
- A click on a footprint on the globe.
- A search that follows the view.

## Decisions

### D1: The layer record

The layer has the id `skywatch-scenes`, the name "SkyWatch Scenes", the icon "🖼" and the source name "SkyWatch". No other layer uses the icon "🖼". The update interval is 0, so the manager calls `update` only when it enables the layer. The layer is in the group "Cameras" right after "Recent Imagery", because both layers show images of satellites. That place keeps the scenario `beemaps-frames-025` true, because the group still ends with the two Bee Maps layers.

### D2: The press

The chip "search" sends one search for each press, as in "Bee Maps Frames". While a search runs, the chip has the label "Searching…" and is disabled. The layer never sends a search again by itself. When the status says that there is no key, the chip is disabled.

### D3: The box

The function `scenesBox` puts the centre on a grid of 0.01 degrees. So a small move of the view gives the same box, and the answer store of the server can answer. The half side is 24000 m. The layer refuses a centre above 80 degrees or below -80 degrees. It also refuses a box that goes past the 180th meridian, as the Bee Maps layers do.

Let h be the half height in radians. The half width is h divided by the cosine of the latitude. Then the area on a sphere of radius R is 4 R² h sin(h). That value is always less than (2 R h)², so the area is less than 2304 km² before the values are rounded. The test of `skywatch-scenes-layer-010` gets areas from 2303.99 to 2304.01 km² from the function of the server. The limit of the server is 2500 km².

### D4: The dates

The function `searchWindow` gives the UTC date of the clock of the layer as `end`, and the date 91 days before it as `start`. So the window has 92 calendar days, which is the limit of the server. The answer gives the newest scenes first, so a long window loses only old scenes when the route cuts the list to 50.

### D5: The browser source

The source has three functions. `getStatus` and `searchScenes` work as `getStatus` and `getFrames` of the Bee Maps source. `searchScenes` stops after 60 seconds, because the server can poll SkyWatch up to ten times. It reads at most 8388608 bytes, because 50 footprints of up to 2000 positions can make a large answer. `getThumbnail` stops after 20 seconds, and it reads at most 1048576 bytes, the limit of the thumbnail route. It gives a `Blob` with the media type of the answer.

### D6: The answer records

The records check the answer again, because the layer does not trust the network. They keep only the fields that the layer shows: `id`, `time`, `ring`, `resolutionM`, `provider`, `cloudPercent` and `thumbnail`. They use the same rules for the id and the ring as the route.

### D7: The footprints

Each scene gets one entity with a polyline on the ground through its ring. A footprint that is not selected has no fill, so 50 footprints that overlap stay readable. The selected footprint gets another color, a wider line and a polygon with a fill. The layer calls `requestRender` after each change of the entities, as the layer "Bee Maps Bursts" does.

### D8: The selection

The row of the layer has the list of `sceneList`. The layer panel sends the `params` of an item to `setLayerParams` with the origin "user", and the manager gives them to `setParams`. The item of the selected scene has the `params` `{scene:null}`, so a second click removes the selection. The registry entry of the layer has no `optionOwner`, so the share link and the stored state do not keep the selection.

### D9: The thumbnail card

A selection of a scene with `thumbnail` true sends one thumbnail request. The option `decodeImage` makes an image from the blob, and its default is `createImageBitmap`. The layer gives the overlay host one entry with the variant `thumbnail`, at the centre of the footprint. The function `thumbnailSize` fits the image in a square of 192 pixels. The layer calls `close` of each image that it stops to show, so the memory of the image is released.

### D10: The share token and the tests of the ledger

Each token of one character has an owner. The function `nextLayerStateToken` gives "00". The check of `make precheck` needs the next free token, so the layer gets "00".

The tests of the token ledger use "00" as the next free token. Their fixtures now leave out the row of `skywatch-scenes` and its registry entry, as they already do for `gdacs`. So each fixture has the free digit "9" and the free token "00" again, and each test title stays true. The test of the complete ledger reads all rows, counts 37 rows and expects `skywatch-scenes` with "00". The registry test expects the next free token "01" from the real ledger.

### D11: The texts

The texts of the layer are English, as in the Bee Maps layers. Only the name of the layer goes through the translation, so the change adds a Spanish text and a Russian text for it.

### D12: The tests

The tests use a fake source, a fake overlay host, a fake clock and a fake `decodeImage`. The test of `skywatch-scenes-layer-010` imports `validateRequest` and `boxAreaKm2` from the server. A test file can import server code, and a code file of the layer cannot. The lead runs a named fault for each check of the code, and records the test that each fault makes fail.

## Files and measures

The change adds six code files in `src/layers/skywatchScenes/` and the file `src/app/layers/skywatchScenes.js`. It edits the registration files of the catalog, the share link, the layer panel, the layer names, the voice list and the credits. Each new code file and each edited owned file needs 100% line, branch and function coverage.

The lead runs the named faults, each test file and the four checks of `make precheck` on the host. The lead also looks at the layer in a headless Chrome with a stored answer and a stored image. The lead runs the gates in Docker, and the two review agents on the final tree.

## Purpose at archive time

Show the archive scenes of SkyWatch at the view centre on the globe. Search only when a person presses the chip, and show the thumbnail of the scene that a person selects.
