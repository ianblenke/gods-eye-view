## Why

The owner uses the app through a reverse proxy with authentication. The scenes route of `skywatch-source` accepts only a request from the machine that runs the server. So a browser that uses that reverse proxy cannot search. On 2026-10-21 the owner allowed the SkyWatch search through the reverse proxy and asked for the thumbnail route now.

The change `skywatch-thumbnails` is the second of three changes for SkyWatch. It changes the check of the scenes route and adds a route for the thumbnails of the scenes. The third change, `skywatch-scenes-layer`, adds the layer.

## What Changes

- The scenes route accepts a POST request that passes `admitSameSiteRequest()`, as the route of the HUD summary does. The header `Content-Type` must be exactly `application/json`.
- Add the plugin `skywatchThumbnailProxy()` with the route `GET /api/skywatch/thumbnail/<id>`. The route sends the thumbnail of a scene that a kept answer of the scenes route gave.
- The thumbnail route is off until `.env` has `SKYWATCH_THUMBNAILS=true`.
- The function `skywatchPlugins()` makes the scenes plugin and the thumbnail plugin, and `localProviderPlugins` uses it.
- The thumbnail route checks the URL before the request. It checks the media type, the size and the first bytes of each image.
- The thumbnail route keeps at most 32 good images, each for less than 10 minutes. A rate limit allows 30 requests in each minute.

## Capabilities

### New Capabilities

- `skywatch-thumbnails`: The server route that sends the thumbnails of SkyWatch scenes.

### Modified Capabilities

- `skywatch-source`: The requirement "Local requests only" gets the name "Same-site requests only". Its scenarios `skywatch-source-003` and `skywatch-source-004` change, and it gets the new scenario `skywatch-source-023`. The scenario `skywatch-source-018` names the same-site step in place of the local step.

## Impact

New owned code files: `server/providers/skywatch/thumbnails.js`, `server/providers/skywatch/image.js` and `server/providers/skywatch/same-site.js`. The manifest `openspec/ownership.json` lists the folder `server/providers/skywatch/` as owned. New owned test files: `src/data/skywatchThumbnails.test.mjs` and `src/data/skywatchImage.test.mjs`.
Rule 23: the change adds each new test file to `openspec/ownership.json`.

The change edits the owned files `server/providers/skywatch.js`, `server/providers/skywatch/normalize.js`, `src/data/skywatchProxy.test.mjs` and `src/data/skywatchScenes.test.mjs`. It edits the upstream file `server/providers/local.js`, and the documents `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.
The change adds no dependency, no layer, no QA script and no layer token.

## Known limits and later changes

- Known limit `no-live-check`: The owner has no SkyWatch key yet. The API description gives no host and no form for the URL of a thumbnail. A later check with a real key can find a difference.
- Known limit `lan-access`: `compose.yaml` and `Dockerfile` set `HOST=0.0.0.0`, so the server accepts connections on each address of the machine. A machine on the local network can send a request with no `Origin` header directly to the server, without the authentication of the reverse proxy. The daily limit and the rate limits stay. The route of the HUD summary has the same known limit.
- Known limit `display-terms`: SkyWatch publishes no terms for the display of thumbnails. The thumbnail route stays off until the owner sets `SKYWATCH_THUMBNAILS=true`.
- Known limit `dns-names`: The URL check does not resolve the host name. A name that resolves to an address on the local network passes the check.
- Known limit `key-host`: The plugin sends the key only to the host `api.skywatch.co`. When a thumbnail on another host needs the key, each request for it fails with `upstream_failed` or `bad_upstream`.
- Known limit `thumbnail-only`: The route sends only the image of `thumbnail_uri`, which the API description gives as 100 × 100 pixels. It sends no image of `preview_uri`.
- Later change `skywatch-scenes-layer`: A layer that searches the box under the view, shows the footprints and shows the thumbnail of a selected scene.
- Review minor `round3-wording` (round 3): four sentences of `evidence/faults.txt`, `design.md` and `CHANGELOG.md` had two meanings, a phrasal verb or more than 25 words. The lead corrected them after round 3.
