## Why

The owner wants one source of satellite images that gives access to many satellite operators through one account. On 2026-10-21 a scout found that sfera.earth has no public API for images. The owner then selected SkyWatch, which has a public API with one key for many operators.

This change is the first of two changes. It adds a server route that searches the archive of SkyWatch for the scenes of a small box and a date window. A later change adds a layer that shows the scenes on the globe.

The API description of SkyWatch names no cost for a search. An order costs money. So this change adds no route that orders a scene, asks for a price or asks for a new image.

## What Changes

- Add the plugin `skywatchProxy()` in `server/providers/skywatch.js`, with the routes `GET /api/skywatch/status` and `POST /api/skywatch/scenes`.
- The scenes route accepts only a request from this machine. It checks a box of at most 2500 km² and a date window of at most 92 days.
- The plugin reads the key from `SKYWATCH_API_KEY` on the server. It sends one search request and at most ten result requests to the archive search of SkyWatch.
- The plugin limits the searches with a daily count (`SKYWATCH_DAILY_SEARCHES`, 20 by default) and an answer store of 10 minutes. A rate limit allows 6 requests in each minute.
- The answer gives only the id, the footprint, the times, the resolution, the operator and the product of each scene. It also gives the cloud cover, the coverage, the area, the price for each km², the cost and a thumbnail flag. It gives no URL of the upstream.

## Capabilities

### New Capabilities

- `skywatch-source`: The server route that searches the archive of SkyWatch.

### Modified Capabilities

None.

## Impact

New owned code files: `server/providers/skywatch.js`, `server/providers/skywatch/validate.js`, `server/providers/skywatch/upstream.js` and `server/providers/skywatch/normalize.js`. New owned test files: `src/data/skywatchProxy.test.mjs`, `src/data/skywatchInput.test.mjs`, `src/data/skywatchUpstream.test.mjs` and `src/data/skywatchScenes.test.mjs`.
Rule 23: the change adds each new file to `openspec/ownership.json`.

The change edits the upstream file `server/providers/local.js` to add the plugin, and the documents `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`. The format check finds the new code files under `server/` with the rule of `scripts/format-runtime.json`.
The change adds no dependency, no layer, no QA script and no layer token.

## Known limits and later changes

- Known limit `no-live-check`: The owner has no SkyWatch key yet. The tests use fixtures from the public API description of SkyWatch, which `evidence/api-description.txt` names. A later check with a real key can find a difference from that description.
- Known limit `local-only`: The scenes route accepts only a request from this machine. A browser that uses the app through a reverse proxy cannot search.
- Known limit `count-in-ram`: The server keeps the daily count only in RAM, so a restart of the server starts the count again at 0.
- Known limit `search-cost`: SkyWatch states no cost for a search. The owner can confirm with SkyWatch that a search costs no money.
- Known limit `first-page`: The plugin reads only the first page of at most 50 results. When SkyWatch has more results, the answer has `truncated` true.
- Known limit `id-rule`: The API description gives only "string" for the id of a search and of a scene. The plugin accepts 1 to 128 ASCII letters, digits, hyphens or underscores. A real id of another form makes each search fail with `bad_upstream`, or removes each scene.
- Known limit `display-terms`: SkyWatch publishes no terms for the display of footprints and thumbnails. On 2026-10-21 the lead asked the owner to get written terms from SkyWatch. This change shows no image.
- Later change `skywatch-scenes-layer`: A layer that shows the footprints, and a thumbnail route that sends only the thumbnails of the results of this route.
