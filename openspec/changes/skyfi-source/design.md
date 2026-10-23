## Context

The Platform API of SkyFi has an archive search: `POST https://app.skyfi.com/platform-api/archives`. The answer is one page of archive items and a text `nextPage` for the next page. The client sends one request and gets one page.
The key goes in the header `X-Skyfi-Api-Key`. SkyFi gives no key for only a search. The same key can place orders, and an order costs money.

`evidence/api-description.txt` names each document of SkyFi that the lead read. On 2026-10-23 the owner allowed a probe with the key. `evidence/probe.txt` gives the result. A search of a box at Tampa gave 50 scenes on one page, and the page had a `nextPage` text.
Each thumbnail request of the probe got `200` with no key. So a thumbnail of SkyFi is a public image on one of two hosts of SkyFi.

The plugin follows the shape of `server/providers/planet.js`. It has a status route, a same-site scenes route, checked input, a key on the server, a daily count, an answer store and a log. The thumbnail plugin follows `server/providers/planet/thumbnails.js`.

## Goals / Non-Goals

**Goals:**
- Give the app the archive scenes of SkyFi for a small box and a date window.
- Give the app the thumbnail of each scene of a kept answer.
- Send to SkyFi only the archive search with the key, and send a thumbnail request with no key.

**Non-Goals:**
- A layer. The change `scene-layers` adds it.
- An order, a validation of an order, a tasking request, a tile, a notification, a saved area or a call of `/auth/whoami`.
- A request to a link of an upstream answer, except the thumbnail link of a scene that the checks of D3 accept.

## Decisions

### D1: One search request

For each upstream search, the plugin sends one request with a page size of 50. The page has all providers of SkyFi. The plugin sends no second request for the next page.
The area of the search is the box as a WKT polygon of five positions. Each number has 6 digits after the decimal point, so the text never has an exponent.
The dates are `<start>T00:00:00+00:00` and `<end>T23:59:59+00:00`, so the window has whole UTC days and the plugin does not calculate the day after.

### D2: The checks of the SkyWatch route

The scenes route uses `readBodyText()` and `validateRequest()` from `server/providers/skywatch/validate.js`. So the box has at most 2500 km², and the window has at most 92 days.
The scenes route also uses `isSameSite()` from `server/providers/skywatch/same-site.js`. The thumbnail route uses the image checks of `server/providers/skywatch/image.js`.
This change does not edit these three files. The tests examine these checks through the routes of SkyFi.

### D3: Only two kinds of upstream request

`server/providers/skyfi/upstream.js` makes the search URL from one fixed text. The plugin sends the key only with this request.

The thumbnail link is a text of the upstream answer. The plugin accepts it only when it starts with `https://app.skyfi.com/` or with `https://thumbnails.skyfi.com/`. The link has no `#`, no `@`, no backslash and no white space, and it has at most 2048 characters. A text check and not a URL parser decides this, so a port or a user name never passes.

The plugin takes the URL from the member `300x300` of `thumbnailUrls`. It keeps the URL on the server, and the answer holds only a flag. The plugin never sends a request to `tilesUrl`, to `nextPage` or to another link.

Each request has a time limit of 15000 ms and does not follow a redirect. The plugins read at most 4194304 bytes of a page and 1048576 bytes of an image.

### D4: Search control

The daily count, the answer store and the rate limit have the values of the Planet route. One new upstream search adds 1 to the count. The documents of SkyFi give no rate limit for the search.

### D5: The answer

The answer gives the fields of `skyfi-source-017` for each scene. The price fields, `tilesUrl`, the thumbnail links and the other upstream fields stay on the server.
`resolutionM` is `gsd` divided by 100. The probe gave 34 for a scene of the resolution "SUPER HIGH" and 1000 for a scene of Sentinel-2, so the plugin takes centimeters. `cloudPercent` comes from `cloudCoveragePercent`.

`provider` is the upstream code, such as `VANTOR` or `SENTINEL2_CREODIAS`, when it has only capital letters, digits and underscores. The layer shows the name of the provider.

The footprint is a WKT text. The plugin reads only the type `POLYGON` and keeps the first ring as GeoJSON. A footprint of 4357 characters was the longest of the probe, so the plugin reads at most 20000 characters.
The answer has no `total`, because the answer of SkyFi gives `total` as null. `truncated` is true when `nextPage` is a text that is not empty.

### D6: Thumbnails

The thumbnail route is on by default. A thumbnail is a public image. The terms of SkyFi have no clause for it. With `SKYFI_THUMBNAILS=false`, the route answers `404`.

The route finds the URL of an id in the kept answers of the scenes plugin of the same `skyfiPlugins()` call. The route keeps no image, and its answer has `Cache-Control: no-store`.
The upstream request of a thumbnail has no key, no cookie and no `Authorization` header. So the thumbnail route does not need the key.

### D7: The log

Each upstream search writes one line: `[skyfi] ok` or `[skyfi] failed kind=<failure>`, with the count of scenes, the count of search requests and the time. Each upstream request of the thumbnail plugin writes one line.
A line holds no key, no scene id, no URL and no host name.

### D8: The tests

The tests replace the fetch function and the timers. No test sends a request to SkyFi.
The fixtures follow the shape of `evidence/probe.txt`. A fault of each check must make a named test fail, and `evidence/faults.txt` gives each fault and the test that fails.
A test records each request, and it checks that each request is the search request of `skyfi-source-009` or a thumbnail request of `skyfi-source-024`.

## Files and measures

New owned code files: `server/providers/skyfi.js` and the three files under `server/providers/skyfi/`. New owned test files: the four files `src/data/skyfi*.test.mjs` of the proposal.
Changed files: `server/providers/local.js`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`. The format check finds the new code files with the rule of `scripts/format-runtime.json`.

Each new code file must have 100% line, branch and function coverage. The trace gate checks the 32 scenario IDs and their tests. The prose lint checks STE.
The lead runs the four checks of `make precheck` on the host, and the gates in Docker. The two review agents read the final tree.

## Purpose at archive time

Give the app the archive scenes of SkyFi for a small box and a date window, and the thumbnail of each scene. Send to SkyFi only the archive search with the key, and send a thumbnail request with no key.
