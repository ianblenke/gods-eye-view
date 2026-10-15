## Why

The app shows no fresh street-level imagery that contributors upload. Bee Maps (formerly Hivemapper) sells an API for it. The owner wants fresh frames on the map and, later, a way to ask for an area to be mapped again.

This is change 1 of 4. It adds the read-only server provider. It holds no code that creates a Burst. A query can cost money: the API description gives `creditsUsed` and `cost` in an answer, and an image view costs $0.005. The description does not say what a query with `catalog=true` uses. The provider therefore limits every call.

## What Changes

- Add the plugin `beemapsProxy` in `server/providers/beemaps.js` and the folder `server/providers/beemaps/` with the files `validate.js`, `upstream.js`, `normalize.js` and `budget.js`. Add the plugin to `server/providers/local.js`.
- Add the route `GET /api/beemaps/status`. It tells whether a key is set.
- Add the route `POST /api/beemaps/frames`. It takes a box or a polygon and an optional date. The smallest box that holds the area is at most 5 km². The route asks Bee Maps for the newest frames and returns only the id, the position and the time of each frame.
- Limit every call. The request must come from the machine that runs the server, and the key stays in the server. The daily limit is 20 upstream calls. An answer stays in memory for 10 minutes. A test pins one fixed upstream URL.
- Keep signed image URLs out of every answer. Add the capability `beemaps-source` with 28 scenarios.
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

- Known limit `contract`: The request, the key header and the shape of the answer come from the public API description, version 1.3.0. No call used a key. The first real call can show a difference, and the owner can run one call by hand.
- Known limit `status-sources`: The description lists the answers 200, 400 and 403 for this path. The answers 402 and 429, and the header `Retry-After`, come from one other source, the file `llms-full.txt` and the older version 1.0.0 of the description. No source names the answer 401. The provider treats it like 403.
- Known limit `description-fetch`: The lead made one `GET` of the public API description, without a key, to read the field shapes. `evidence/api-description.txt` has its address, its date and its SHA-256.
- Known limit `key-header`: The description names the header `Authorization` with the form "Basic" and the key, and the query parameter `apiKey`. The provider uses the header only, because a key in a URL can reach a log.
- Known limit `catalog-shape`: The description says that `catalog=true` returns metadata without signed image URLs. It gives no separate schema for that answer. The provider reads the same fields, `timestamp` and `position`. If the catalog answer has another shape, the answer holds no frames or the error `bad_upstream`.
- Known limit `catalog-cost`: The documents do not say what a query with `catalog=true` uses. The answer of the route shows the `credits` of the upstream answer, so the first real call can tell. The daily limit counts each call as one unit, not as dollars.
- Known limit `key-scope`: No read-only key scope was found, so the key can also create Bursts. This change holds no Burst code, and a test pins the one upstream URL. A later change uses a separate key variable for Bursts.
- Known limit `images`: This change returns no image and no signed URL. Change 2 adds the image route.
- Known limit `licence`: The terms allow use in an app that you build, and they ban resale. They do not say whether other viewers can see the data. Use it for yourself only, and keep no copy on disk.
- Known limit `week`: The upstream time filter works by week. The provider also cuts the frames by their exact time.
- Known limit `box-area`: The provider measures the smallest box that holds the ring. A long, thin polygon with a small area can be refused, and a ring across the 180th meridian is refused as too large.
- Known limit `ring-order`: The provider sends the ring as it got it. It does not turn a clockwise ring into a counter-clockwise ring, and it does not test a ring that crosses itself.
- Known limit `no-failure-hold`: An upstream answer of 500 or of the wrong shape starts no hold. A failing upstream lets 6 requests in 60 seconds use the daily limit of 20 in about 3 minutes.
- Known limit `status-gate`: The status route uses the same-site gate. A device on the LAN can read `configured` when the owner opens the LAN address.
- Known limit `no-settings-panel`: The key goes in `.env` only. The Provider Settings panel has no entry for it.
- Known limit `scripts-as-text`: The files in `evidence/` that hold scripts hold them as text. No gate measures them.
