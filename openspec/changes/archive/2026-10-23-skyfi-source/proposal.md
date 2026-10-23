## Why

The owner has a SkyFi account and wants the archive scenes of SkyFi in the app. On 2026-10-22 the owner asked for Planet and SkyFi next to SkyWatch, and selected one layer for each provider.

This change is the second of three changes. The change `planet-source` added the routes of Planet. This change adds the server routes for the search and the thumbnails of SkyFi. The change `scene-layers` adds the layers "Planet Scenes" and "SkyFi Scenes".

The key of SkyFi is not read-only. The same key can place orders that cost money. So the plugins of this change send to SkyFi only one kind of request with the key: the archive search. A thumbnail of SkyFi is a public image, so a thumbnail request has no key.

## What Changes

- Add the plugin `skyfiProxy()` in `server/providers/skyfi.js`, with the routes `GET /api/skyfi/status` and `POST /api/skyfi/scenes`.
- The scenes route accepts only a request from the same site, as the SkyWatch and Planet scenes routes do. It uses the checks of the SkyWatch route for the body, the box and the dates.
- The plugin reads the key from `SKYFI_API_KEY` on the server. For each new upstream search, it sends one archive search request for the 50 scenes of the box and the dates.
- The plugin limits the upstream searches with a daily count (`SKYFI_DAILY_SEARCHES`, 20 by default) and an answer store of 10 minutes. A rate limit allows 6 requests in each minute.
- The answer gives the id, the time, the footprint and the resolution of each scene.
- The answer also gives the provider code, the product type, the cloud percent and a thumbnail flag of each scene.
- The answer gives no upstream URL and no price.
- Add the plugin `skyfiThumbnailProxy()` with the route `GET /api/skyfi/thumbnail/<id>`. It sends the thumbnail of a scene of a kept answer, and it keeps no copy of the image. Its upstream request has no key.
- Add the function `skyfiPlugins()`. It makes the two plugins from one set of options, and the thumbnail plugin gets the function `thumbnailUrlOf` of the scenes plugin.
- With `SKYFI_THUMBNAILS=false`, the thumbnail route answers `404` and sends no request to SkyFi.

## Capabilities

### New Capabilities

- `skyfi-source`: The server routes that search the archive of SkyFi and send the thumbnails of the scenes.

### Modified Capabilities

None.

## Impact

New owned code files: `server/providers/skyfi.js`, `server/providers/skyfi/upstream.js`, `server/providers/skyfi/normalize.js` and `server/providers/skyfi/thumbnails.js`.
New owned test files: `src/data/skyfiProxy.test.mjs`, `src/data/skyfiUpstream.test.mjs`, `src/data/skyfiScenes.test.mjs` and `src/data/skyfiThumbnails.test.mjs`.
Rule 23: the change adds each new file to `openspec/ownership.json`.

The new files import the checks of the SkyWatch provider from `server/providers/skywatch/validate.js`, `server/providers/skywatch/image.js` and `server/providers/skywatch/same-site.js`. The change does not edit these files.
The change edits the upstream file `server/providers/local.js` to add the two plugins, and the documents `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.
The format check finds the new code files under `server/` with the rule of `scripts/format-runtime.json`. The change adds no dependency, no layer, no QA script and no layer token.
The change opens no gap and closes no gap in `openspec/trace`.

## Known limits and later changes

- Known limit `count-in-ram`: The server keeps the daily count only in RAM, so a restart of the server starts the count again at 0.
- Known limit `first-page`: The plugin reads only the first page of the search. The documents of SkyFi give no sort order, so the 50 scenes of that page are not always the 50 newest scenes of the window.
- Known limit `open-data`: The search has no filter for open data. On 2026-10-23, 19 of the 50 scenes of the probe were open data scenes of Sentinel-1 and Sentinel-2, and they can fill a page.
- Known limit `one-polygon`: The plugin keeps only the footprints of the type `POLYGON`. All 50 footprints of the probe had this type. A footprint of another type removes its scene.
- Known limit `time-zone`: The probe gave capture times with an offset (`-04:00` and `-06:00`). The plugin converts each time to UTC, and it removes a scene with a time that has no offset. The documents of SkyFi do not say if the offset is the time zone of the place.
- Known limit `time-format`: The plugin reads a time with the function `Date.parse`, after it checks the end of the text for `Z` or an offset. So a text of another form that `Date.parse` reads, and that ends with an offset, also gives a scene. The probe gave only the ISO form.
- Known limit `gsd-unit`: The documents of SkyFi do not give the unit of `gsd`. The probe gave 34 and 1000, so the plugin takes centimeters.
- Known limit `personal-use`: The terms of SkyFi give a personal and non-commercial license, and they forbid a public display, except where they allow it. They have no clause for thumbnails, footprints or search data. The owner uses the app alone.
- Known limit `order-key`: The key of SkyFi can also place orders. The plugins send only the archive search with the key, and the tests check each request. The owner must keep no payment card on the account of SkyFi, or must set a budget with SkyFi.
- Known limit `credit-line`: The change `scene-layers` shows the credit of SkyFi and of the provider of each scene. This change shows no image.
- Known limit `live-probe`: On 2026-10-22 the owner allowed a small probe with the key, and the lead ran it on 2026-10-23. `evidence/probe.txt` gives its 5 requests and the shape of the answers. The tests use fixtures of that shape.
- Later change `scene-layers`: One layer module for the three providers, and the layers "Planet Scenes" and "SkyFi Scenes".
