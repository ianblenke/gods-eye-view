## Context

SkyWatch EarthCache has an archive search in two steps. The client sends a POST request to `/archive/search` with a polygon and two dates, and gets a search id. Then the client reads `/archive/search/<id>/search_results` until the answer is not `202`.
The public API description (OpenAPI 3.1, version 1.7) gives the fields of each result. `evidence/api-description.txt` gives the address, the date, the version and the SHA-256 of the file that the lead read.

Each request needs the key in the header `x-api-key`. That description names no cost for a search. An order (`/pipelines`), a price request (`/price/calculate`) and a list of offerings (`/products/offerings`) are other paths, and this change sends none of them.

The plugin follows the shape of `server/providers/beemaps.js`. It has a status route, a local route, checked input, a key on the server, a daily count, an answer store and a log.

## Goals / Non-Goals

**Goals:**
- Give the app the archive scenes of SkyWatch for a small box and a date window.
- Keep the key and the image URLs of SkyWatch on the server.
- Send only the two requests of the archive search.

**Non-Goals:**
- A layer, a thumbnail route or a preview. The later change `skywatch-scenes-layer` adds them.
- An order, a price request or a request for a new image.

## Decisions

### D1: The server reads the results

The scenes route starts the search and reads the results in the same request. The browser then sends one request and gets one answer.
The plugin waits 2000 ms after each of the first nine answers `202`, and it sends at most ten result requests. The waits add at most 18 s.

With the time limit of D3, one scenes request ends after at most about 183 s: 11 requests of 15000 ms and the waits.
The alternative was two routes, one to start and one to read. That alternative needs a store of search ids for each browser, so the plugin does not use it.

### D2: The limits of the input

The box has at most 2500 km², about a square of 50 km. The window has at most 92 days.
These limits keep each search small. The API description gives no maximum size for a polygon. The closed ring of the box has five positions.
The area uses a sphere with a radius of 6371008.8 m, the same radius as `server/providers/beemaps/validate.js`.

### D3: The two upstream requests

`server/providers/skywatch/upstream.js` builds each URL from one fixed origin and path, `https://api.skywatch.co/earthcache/archive/search`. The result URL adds the checked search id and `per_page=50`.
Each request has a time limit of 15000 ms and does not follow a redirect. The plugin reads at most 4194304 bytes of each body.
The search body has `order_by` with the value `-date`, so the newest scenes come first on the first page.

### D4: The daily count

The plugin counts each new upstream search against a limit for each UTC day. The default limit is 20, and `SKYWATCH_DAILY_SEARCHES` can set a whole number from 1 to 1000.
The server keeps the count only in RAM. The API description names no cost for a search, so a count that starts again after a restart is acceptable. The Known limit `count-in-ram` names this.

`server/providers/beemaps.js` stops its requests for a time after Bee Maps refuses its key. This plugin does not stop its requests, and the daily count limits the requests after a refusal.

### D5: The answer store

The plugin keeps a good answer for 600000 ms for each box and pair of dates. The store keeps at most 32 answers.
Two requests with the same box and dates share one upstream search that is in flight. The store keeps no failure, so the next request after a failure sends a new search.

### D6: The answer

The answer gives the fields of `skywatch-source-020` for each scene. The upstream fields `preview_uri`, `thumbnail_uri`, `intersection`, `minimum_area_sq_km` and `off_nadir_angle` stay on the server.
The flag `thumbnail` tells the later layer change that a thumbnail exists. The later change adds a route that sends only these thumbnails.
For an account on a test plan of SkyWatch, the upstream `cost` can be the text "Upgrade your plan for price". The answer gives null for each number field whose value does not meet its rule in `skywatch-source-020`.

### D7: The log

Each upstream search writes one line: `[skywatch] ok` or `[skywatch] failed kind=<failure>`, with the count of scenes, the count of result requests and the time. The line holds no key, no search id and no URL.

### D8: The tests

The tests replace the fetch function and the timers. No test sends a request to SkyWatch.
The fixtures follow the fields of the API description. A fault of each check must make a named test fail, and `evidence/faults.txt` gives each fault and the test that fails.

## Files and measures

New owned code files: `server/providers/skywatch.js` and the three files under `server/providers/skywatch/`. New owned test files: the four files `src/data/skywatch*.test.mjs` of the proposal.
Changed files: `server/providers/local.js`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`. The format check finds the new code files under `server/` with the rule of `scripts/format-runtime.json`.

Each new code file must have 100% line, branch and function coverage. The trace gate checks the 22 scenario IDs and their tests. The prose lint checks STE.
The lead runs the four checks of `make precheck` and the gates in Docker, and the two review agents on the final tree.

## Purpose at archive time

Give the app the archive scenes of SkyWatch for a small box and a date window. Keep the key and the image URLs of SkyWatch on the server, and send only the two requests of the archive search.
