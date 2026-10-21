## Context

The scenes route of `skywatch-source` uses `isLoopbackCommand()`. That check needs a loopback socket address, a loopback host name and the origin of that host. The reverse proxy of the owner connects from another address and sends the public host name. So the check refuses each request through the reverse proxy.

The route of the HUD summary uses `admitSameSite()` from `server/providers/common/same-site.js`. That check refuses a proxy header, a cross-site `Sec-Fetch-Site` and an origin that is not the origin of the request. The reverse proxy of the owner removes the proxy headers. It also changes its own `https` origin to the `http` origin of the request, so a request through it passes.

A scene of the results of SkyWatch can have `thumbnail_uri`, which the API description gives as a 100 × 100 pixel thumbnail. The answer of the scenes route gives only the flag `thumbnail`, and the URL stays on the server.

## Goals / Non-Goals

**Goals:**
- Let a browser that uses the reverse proxy of the owner search the scenes.
- Give the browser the thumbnail of a scene that the scenes route gave, with no URL of SkyWatch in the browser.
- Send only an image that has the type that its first bytes show.

**Non-Goals:**
- A layer. The later change `skywatch-scenes-layer` adds it.
- The image of `preview_uri`, an order or a price request.

## Decisions

### D1: The same-site step of the scenes route

The new file `server/providers/skywatch/same-site.js` calls `admitSameSiteRequest()` from `src/localRequestGate.mjs`. It gives the fields `hostHeader`, `origin`, `secFetchSite` and `proxyHeaders` from the request, as `admitSameSite()` does. The field `protocol` is `https:` for an encrypted socket, and `http:` for another socket.

The scenes route also needs the exact header text `application/json`, the same text that `isLoopbackCommand()` needs.
A browser must send a CORS preflight before a cross-origin POST with that content type, and this server answers no preflight. A refused request gets `403` with `{"error":"cross_origin"}`, so the error of `skywatch-source-004` stays the same for the layer. The thumbnail route uses the same call of `admitSameSiteRequest()` with no check of the header `Content-Type`, and it gives the same answer.

### D2: A second plugin

The thumbnail route is in a second plugin, `skywatch-thumbnail-proxy`. So the requirements "Provider routes" and "Two fixed upstream requests" of `skywatch-source` stay true. The scenes plugin answers its two routes, and it sends only the archive requests.
The function `skywatchPlugins(options)` makes the two plugins with the same options. It gives the function `thumbnailUrlOf` of the scenes plugin to the thumbnail plugin. `server/providers/local.js` adds the two plugins with `...skywatchPlugins()`.

### D3: The URLs stay in the answer store

`normalizeScenes()` also gives the field `thumbnailUrls`. It is a map from the id to a `thumbnail_uri` text. For each id, the text comes from the first scene in `scenes` that has that id and has `thumbnail` true. The answer store of the scenes route keeps that map with each answer, and no answer gives the map to the browser.

One test of `skywatch-source-021` in `src/data/skywatchScenes.test.mjs` compares the result of `normalizeScenes()`, with the fields `scenes` and `thumbnailUrls` left out of the comparison. The tests of `skywatch-thumbnails-006` check the map.
`thumbnailUrlOf(id)` reads the kept answers from the newest to the oldest. It uses the same age rule as the store step of `skywatch-source-015`. So the thumbnail route knows only the scenes that the browser can know.

### D4: The URL check

The URL comes from SkyWatch, and not from the browser. The plugin still refuses a parsed URL with a scheme other than `https:`, a user name, a password or a port. It also refuses a host name that is an IP address, `localhost` or a name below `localhost`.
The tests of the URL check give the thumbnail plugin a fake `thumbnailUrlOf`, because the scenes plugin gives only a URL with the scheme `https:`.

The WHATWG URL parser changes a host such as `2130706433` to `127.0.0.1`, so the check reads the parsed host name. The check does not resolve a host name. The Known limit `dns-names` names this.

### D5: The key

The plugin sends `x-api-key` only to the host `api.skywatch.co`. A thumbnail URL on another host, such as a storage service, gets no key, so the key does not go to another company.

### D6: The image check

The route sends the bytes to the browser on the origin of the app. An SVG image or an HTML page can hold a script, so the route sends only PNG, JPEG and WebP.
The plugin checks the media type before it reads the body. It accepts at most 1048576 bytes with `readResponseBytesCapped()`, and then it checks the first bytes. The answer has `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'none'`.

### D7: The image store and the limits

The thumbnail plugin keeps at most 32 good images, each for less than 600000 ms. The image store finds an image by the `href` text of the URL. Two requests for the same URL share one upstream request that is in flight. The store keeps no failure.

A layer asks for the thumbnail of one selected scene at a time, so a rate limit of 30 requests in 60000 ms is enough. The plugin has one count for all requests. The route has no daily count, because a thumbnail is a file of the search results and not a search.

### D8: The variable `SKYWATCH_THUMBNAILS`

`SKYWATCH_THUMBNAILS` must be the text `true`. SkyWatch publishes no terms for the display of thumbnails, so the owner decides when the route sends them.

### D9: The log

Each upstream request writes one line: `[skywatch] thumbnail ok` with the bytes and the time, or `[skywatch] thumbnail failed kind=<failure>` with the time. The line holds no key, no scene id and no URL.

### D10: The tests

The tests replace the fetch function, the clock and the timers. No test sends a request to SkyWatch or to another host.
A fault of each check must make a named test fail, and `evidence/faults.txt` gives each fault and the test that fails.

## Files and measures

New owned code files: `server/providers/skywatch/thumbnails.js`, `server/providers/skywatch/image.js` and `server/providers/skywatch/same-site.js`. New owned test files: `src/data/skywatchThumbnails.test.mjs` and `src/data/skywatchImage.test.mjs`.
Changed files: `server/providers/skywatch.js`, `server/providers/skywatch/normalize.js`, `src/data/skywatchProxy.test.mjs`, `src/data/skywatchScenes.test.mjs`, `server/providers/local.js`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.

Each new or changed code file must have 100% line, branch and function coverage. The trace gate checks the scenario IDs and their tests. The prose lint checks STE.
The lead runs the four checks of `make precheck` and the gates in Docker, and the two review agents on the final tree.

## Purpose at archive time

Give the browser the thumbnail of a SkyWatch scene that the scenes route gave. Keep the thumbnail URL and the key on the server, and send only a checked image.
