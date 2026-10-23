## Why

The owner has a Planet account and wants the archive scenes of Planet in the app. On 2026-10-22 the owner asked for Planet and SkyFi next to SkyWatch, and selected one layer for each provider.

This change is the first of three changes. It adds the server routes for the search and the thumbnails of Planet. The change `skyfi-source` adds the routes of SkyFi. The change `scene-layers` adds the layers "Planet Scenes" and "SkyFi Scenes".

Planet states that a quick search and a thumbnail use no credits. An order, an activation, a subscription and a tile use credits or money. So the plugins of this change send to Planet only quick search requests and thumbnail requests.

## What Changes

- Add the plugin `planetProxy()` in `server/providers/planet.js`, with the routes `GET /api/planet/status` and `POST /api/planet/scenes`.
- The scenes route accepts only a request from the same site, as the SkyWatch scenes route does. It uses the checks of the SkyWatch route for the body, the box and the dates.
- The plugin reads the key from `PLANET_API_KEY` on the server. For each new upstream search, it sends one quick search request for the item type `PSScene` and one for `SkySatCollect`.
- Each search request asks for the 25 newest scenes of its item type.
- The plugin limits the upstream searches with a daily count (`PLANET_DAILY_SEARCHES`, 20 by default) and an answer store of 10 minutes. A rate limit allows 6 requests in each minute.
- The answer gives the id, the time, the footprint, the resolution, the provider name, the cloud percent and a thumbnail flag of each scene. It gives no upstream URL.
- Add the plugin `planetThumbnailProxy()` with the route `GET /api/planet/thumbnail/<id>`. It sends the thumbnail of a scene of a kept answer, and it keeps no copy of the image.
- With `PLANET_THUMBNAILS=false`, the thumbnail route answers `404` and sends no request to Planet.

## Capabilities

### New Capabilities

- `planet-source`: The server routes that search the archive of Planet and send the thumbnails of the scenes.

### Modified Capabilities

None.

## Impact

New owned code files: `server/providers/planet.js`, `server/providers/planet/upstream.js`, `server/providers/planet/normalize.js` and `server/providers/planet/thumbnails.js`.
New owned test files: `src/data/planetProxy.test.mjs`, `src/data/planetUpstream.test.mjs`, `src/data/planetScenes.test.mjs` and `src/data/planetThumbnails.test.mjs`.
Rule 23: the change adds each new file to `openspec/ownership.json`.

The new files import the checks of the SkyWatch provider from `server/providers/skywatch/validate.js`, `server/providers/skywatch/image.js` and `server/providers/skywatch/same-site.js`. The change does not edit these files.
The change edits the upstream file `server/providers/local.js` to add the two plugins, and the documents `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.
The format check finds the new code files under `server/` with the rule of `scripts/format-runtime.json`. The change adds no dependency, no layer, no QA script and no layer token.
The change opens no gap and closes no gap in `openspec/trace`.

## Known limits and later changes

- Known limit `count-in-ram`: The server keeps the daily count only in RAM, so a restart of the server starts the count again at 0.
- Known limit `first-page`: The plugin reads only the first page of each search request. PlanetScope gives many scenes each day, so the 25 newest `PSScene` scenes can cover only a few days.
- Known limit `item-types`: The plugin searches only `PSScene` and `SkySatCollect`. On 2026-10-22 the account of the owner had both item types.
- Known limit `one-user`: The terms of Planet do not allow a cache when the app sends Planet data to more than one user. They also do not allow source images for other users without an agreement.
- In `one-user`, the scenes route keeps each answer for 10 minutes, and the thumbnail route sends source images. The owner uses the app alone. A site with more users must not use these routes.
- Known limit `saved-searches`: Planet keeps each quick search for 30 days in the account. So each upstream search adds two searches to the list of searches of the owner.
- Known limit `credit-line`: The terms of Planet ask for a copyright notice that names Planet. This change shows no image. The change `scene-layers` adds the credit.
- Known limit `api-key`: Planet plans to replace the API keys with OAuth. Planet gives no date. Then the plugin needs a new way to send the key.
- Known limit `live-probe`: On 2026-10-22 the owner allowed a small probe with the key. `evidence/probe.txt` gives its 4 requests and the shape of the answers. The tests use fixtures of that shape.
- Later change `skyfi-source`: The routes of SkyFi, after the owner adds `SKYFI_API_KEY`.
- Later change `scene-layers`: One layer module for the three providers, and the layers "Planet Scenes" and "SkyFi Scenes".
