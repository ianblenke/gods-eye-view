## Why

The server can search UP42 scenes but cannot send their thumbnails.
This change adds the second UP42 capability.

## What Changes

- Add a same-site GET route for a scene in a kept answer.
- Keep the route off until `UP42_THUMBNAILS` is true.
- Reuse the token client and generic SkyWatch image checks.
- Keep at most 32 checked images in RAM, each for less than ten minutes.
- Share concurrent requests and allow 30 requests per minute.

## Capabilities

### New Capabilities

- `up42-thumbnails`: Send checked thumbnails for known UP42 scenes.

### Modified Capabilities

None. The source requirements and tests stay unchanged.
The function `up42Plugins()` keeps its one scenes plugin.
The new function `up42SourcePlugins()` supplies both plugins to the local provider list.
The thumbnail modules stay outside `server/providers/up42/`.

## Impact

The change edits `server/providers/up42.js`, `server/providers/up42/auth.js` and `server/providers/up42/normalize.js`.
It adds `server/providers/up42-thumbnails/` and `src/data/up42Thumbnails.test.mjs` to the ownership manifest.
The new folder contains `plugins.js` and `thumbnails.js`.
It edits `server/providers/local.js` to use the combined list.

It edits `.env.example` and `DATA_SOURCES.md`, and adds `changelog.d/1431-up42-thumbnails.md`.
It adds no dependency and closes no old ledger gap.
All new and edited provider files need full host coverage.
The lead must record the trace changes with the calibrated gates.

## Known limits

- Known limit `no-live-check`: No live call confirms the body format, absent-image status or host names. A real response can contain base64 or null.
- Known limit `display-terms`: UP42 terms do not address thumbnail display or its cache. The route stays off by default. RAM keeps images for less than ten minutes.
- Known limit `key-host`: The token goes only to `api.up42.com`.
- Known limit `lan-access`: A LAN client can reach this server without proxy authentication. The same-site and rate checks still apply.
- Known limit `dns-names`: Not applicable. The API host is constant.
- Known limit `count-in-ram`: Not applicable. This route has no daily count.
- Known limit `not-all-hosts`: Only collections with THUMBNAIL_AVAILABLE give a true scene flag.
- Known limit `no-retry-on-429`: The route gives upstream_failed for 429 without a retry.
