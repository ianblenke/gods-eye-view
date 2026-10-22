## Context

The Data API of Planet has a quick search: `POST https://api.planet.com/data/v1/quick-search`. The answer is one page of GeoJSON features, with no search id and no wait. A feature has an id, a geometry, properties and links.
The key goes in the header `Authorization: api-key <key>`. Planet gives no key for only a search. The same key can order, activate assets and stream tiles, and these actions use credits.

The documents of Planet state that a quick search and a thumbnail use no credits. Item tiles and basemap tiles use credits. `evidence/api-description.txt` names each document that the lead read.
On 2026-10-22 the owner allowed a probe with the key. `evidence/probe.txt` gives the result. The 50 newest scenes of a box at Tampa covered only 4 days, and 47 of them were `PSScene`.

The plugin follows the shape of `server/providers/skywatch.js`. It has a status route, a same-site scenes route, checked input, a key on the server, a daily count, an answer store and a log. The thumbnail plugin follows `server/providers/skywatch/thumbnails.js`.

## Goals / Non-Goals

**Goals:**
- Give the app the archive scenes of Planet for a small box and a date window.
- Give the app the thumbnail of each scene of a kept answer.
- Keep the key on the server, and send only the search request and the thumbnail request.

**Non-Goals:**
- A layer. The change `scene-layers` adds it.
- An order, an activation, a download, a subscription, a tile or a basemap.
- A request to a URL from the links of an upstream answer.

## Decisions

### D1: Two searches, one for each item type

The plugin sends one quick search for `PSScene` and then one for `SkySatCollect`, each with a page size of 25. PlanetScope gives many scenes each day, so one search for the two item types gives almost only `PSScene` scenes.
The plugin sends the second search only after a good first page. A failure of one search is the failure of the scenes request, so the answer never holds only a part of the result.

The quick search sorts by the time of the image, with the newest first (`_sort=acquired desc`). A filter keeps only scenes with `quality_category` "standard". On 2026-10-22, 8 of 50 scenes had the category "test".
The date filter starts at 00:00 UTC of the first day. It ends before 00:00 UTC of the day after the last day, so the window has whole UTC days.

### D2: The checks of the SkyWatch route

The scenes route uses `readBodyText()` and `validateRequest()` from `server/providers/skywatch/validate.js`. So the box has at most 2500 km², and the window has at most 92 days.
The scenes route also uses `isSameSite()` from `server/providers/skywatch/same-site.js`. The thumbnail route uses the image checks of `server/providers/skywatch/image.js`.
This change does not edit these three files. `planet-source-006` and `planet-source-027` test the checks through the routes of Planet.

### D3: Only two kinds of upstream request

`server/providers/planet/upstream.js` builds the search URL from one fixed text. The thumbnail URL has one fixed origin and path, with an item type of the plugin and a checked id.
The plugin never reads a URL from an upstream answer. It does not follow `_next`, `assets`, `activate` or `location`.

Each request has a time limit of 15000 ms and does not follow a redirect. The plugin reads at most 4194304 bytes of a page and 1048576 bytes of an image.

### D4: Search control

The daily count, the answer store and the rate limit have the values of the SkyWatch route. One new upstream search adds 1 to the count, also when it sends two search requests.
The documents of Planet give a limit of 5 search requests in each second. The rate limit of the route allows 6 scenes requests in each minute, so the plugin stays below the limit of Planet.

### D5: The answer

The answer gives the fields of `planet-source-017` for each scene. The upstream `_links`, `_permissions` and `assets` stay on the server.
`provider` comes from the item type of the page and not from the upstream text, so the layer always shows "PlanetScope" or "SkySat". `cloudPercent` comes from `cloud_percent`, because `cloud_cover` is a ratio from 0 to 1.
A SkySat footprint can be a `MultiPolygon`, and the probe found one. The answer keeps the outer ring of each polygon, so the layer can draw each part.

The answer has no `total`, because a quick search gives no count. `truncated` is true when a page has a link to a next page.

### D6: Thumbnails

The thumbnail route is on by default. The terms of Planet allow the licensee to view Planet data in a third-party application, and a thumbnail uses no credits. `PLANET_THUMBNAILS=false` turns the route off.
The route finds the item type of the id in the kept answers of the scenes plugin of the same `planetPlugins()` call. It then builds the URL, so it never reads a URL from an upstream answer.

The terms of Planet do not allow a cache of Planet data for more than one user. So the route keeps no image, and its answer has `Cache-Control: no-store`. The Known limit `one-user` names the answer store of the scenes route.
On 2026-10-22, each scene of the probe had an empty `_permissions` array, and the thumbnails of a `PSScene` and of a `SkySatCollect` scene answered `200`.

### D7: The log

Each upstream search writes one line: `[planet] ok` or `[planet] failed kind=<failure>`, with the count of scenes, the count of search requests and the time. Each thumbnail request to Planet writes one line.
A line holds no key, no scene id, no URL and no host name.

### D8: The tests

The tests replace the fetch function and the timers. No test sends a request to Planet.
The fixtures follow the shape of `evidence/probe.txt`. A fault of each check must make a named test fail, and `evidence/faults.txt` gives each fault and the test that fails.

## Files and measures

New owned code files: `server/providers/planet.js` and the three files under `server/providers/planet/`. New owned test files: the four files `src/data/planet*.test.mjs` of the proposal.
Changed files: `server/providers/local.js`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`. The format check finds the new code files with the rule of `scripts/format-runtime.json`.

Each new code file must have 100% line, branch and function coverage. The trace gate checks the 32 scenario IDs and their tests. The prose lint checks STE.
The lead runs the four checks of `make precheck` and the gates in Docker, and the two review agents on the final tree.

## Purpose at archive time

Give the app the archive scenes of Planet for a small box and a date window, and the thumbnail of each scene. Keep the key on the server, and send only the search request and the thumbnail request.
