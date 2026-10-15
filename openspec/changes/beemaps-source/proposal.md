## Why

The app shows no fresh street-level imagery that contributors upload. Bee Maps (formerly Hivemapper) sells an API for it. The owner wants fresh frames on the map and, later, a way to ask for an area to be mapped again.

This is change 1 of 4. It adds the read-only server provider. It holds no code that creates a Burst. A read costs money: each call uses credits, and an image view costs $0.005. The provider therefore limits every call.

## What Changes

- Add the plugin `beemapsProxy` in `server/providers/beemaps.js` and the folder `server/providers/beemaps/` with the files `validate.js`, `upstream.js`, `normalize.js` and `budget.js`. Add the plugin to `server/providers/local.js`.
- Add the route `GET /api/beemaps/status`. It tells whether a key is set and how many upstream calls the day has used.
- Add the route `POST /api/beemaps/frames`. It takes a box or a polygon of at most 5 km² and an optional date. It asks Bee Maps for the newest frames and returns only the id, the position and the time of each frame.
- Limit every call. The request must come from the machine that runs the server, and the key stays in the server. The daily limit is 20 upstream calls. An answer stays in memory for 10 minutes. A test pins one fixed upstream URL.
- Keep signed image URLs out of every answer. Add the capability `beemaps-source` with 26 scenarios.
- Add one entry to `CHANGELOG.md`, one paragraph to `DATA_SOURCES.md` and one block to `.env.example`.

## Capabilities

### New Capabilities

- `beemaps-source`: The routes, the checks of the input, the key, the upstream request, the spend control, the upstream failures and the filtered answer.

### Modified Capabilities

None.

## Impact

No browser code changes. The routes serve the later changes: the frames layer (change 2), the Burst route (change 3) and the Burst panel (change 4).
The new files are files that the fork writes, so they go into `openspec/ownership.json` and `scripts/format-scope.json`. The upstream file `server/providers/local.js` gets two lines.
The tests use a fake fetch function. No test sends a request to Bee Maps, and the owner has no account for it yet.

## Known limits and later changes

- Known limit `contract`: The request, the key header and the shape of the answer come from the public documents of Bee Maps. No call was made. The first real call can show a difference, and the owner can run that test by hand.
- Known limit `catalog-cost`: The documents say that `catalog=true` returns no signed image URL. They do not say what a catalog call costs. The budget counts each call as one unit, not as dollars.
- Known limit `key-scope`: No read-only key scope was found, so the key can also create Bursts. This change holds no Burst code, and a test pins the one upstream URL. A later change uses a separate key variable for Bursts.
- Known limit `images`: This change returns no image and no signed URL. Change 2 adds the image route.
- Known limit `licence`: The terms allow use in an app that you build, and they ban resale. They do not say whether other viewers can see the data. Use it for yourself only, and keep no copy on disk.
- Known limit `week`: The upstream time filter works by week. The provider also cuts the frames by their exact time.
- Known limit `spec-drift`: The live API description changed on 2026-10-13 without a new version. `evidence/openapi-hash.txt` has its hash and its date.
- Known limit `no-settings-panel`: The key goes in `.env` only. The Provider Settings panel has no entry for it.
- Known limit `scripts-as-text`: The files in `evidence/` that hold scripts hold them as text. No gate measures them.
