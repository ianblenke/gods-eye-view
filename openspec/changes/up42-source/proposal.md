## Why

The owner needs one archive search for satellite scenes from many operators through UP42.
This change adds server routes for a small box and a date window.
The change adds no image display.

## What Changes

- Add `up42Plugins()` with `GET /api/up42/status` and `POST /api/up42/scenes`.
- Check the same site, JSON body, box, dates, cloud limit and collection names.
- Keep the console password and bearer tokens on the server.
- Limit each search to ten hosts, with four requests at one time.
- Keep good answers for ten minutes and collection facts for six hours.
- Count new searches against a daily limit of 20 by default, with a maximum of 1000.

## Capabilities

### New Capabilities

- `up42-source`: Read the archive scenes of UP42.

### Modified Capabilities

None.

## Impact

New owned code: `server/providers/up42.js` and five helpers under `server/providers/up42/`.
The helpers are `auth.js`, `validate.js`, `upstream.js`, `normalize.js` and `same-site.js`.
New owned tests: `src/data/up42Input.test.mjs`, `src/data/up42Scenes.test.mjs`, `src/data/up42Upstream.test.mjs` and `src/data/up42Proxy.test.mjs`.
Each new file has an entry in `openspec/ownership.json`.
The change edits `server/providers/local.js`, `.env.example` and `DATA_SOURCES.md`, and adds a changelog fragment.

The change closes no old gap in `openspec/trace/`.
At the host snapshot, `auth.js` has one branch gap at a space before `finally`.
The lead must check the gap with the calibrated Node image.
The change does not edit the gap ledger.
The host checks measure only this change. The lead must run the full gates with the calibrated Node image.

## Known limits and later changes

- Known limit `no-live-check`: Tests use made-up values in the response shapes of the scout report dated 2026-11-05. No live call checks these assumptions.
- Known limit `password-grant`: The server holds a console password. A dedicated Viewer-role user must supply it. MFA can break this grant.
- Known limit `local-only`: The same-site gate refuses proxy headers. A reverse proxy must remove them and supply a matching origin.
- Known limit `count-in-ram`: A server restart sets the daily count to zero.
- Known limit `first-page`: Each host gives only its first page of at most 50 scenes.
- Known limit `display-terms`: UP42 terms do not address footprint display or its cache. This change shows no image.
- Known limit `search-cost`: The cost of search is unknown.
- Known limit `viewer-role-unknown`: The scout did not confirm that a Viewer-role user can search.
- Known limit `host-cap`: A search uses at most ten hosts. The answer marks a larger set as incomplete.
- Later changes `up42-thumbnails` and `up42-quotes` add separate routes.
