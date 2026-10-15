## Context

Base commit: `b3f5d61e` (main, after the merge of `osh-control-loopback`).
The Mapillary provider (`server/providers/mapillary/routes.js`) is the model for a route with a key that stays in the server. The TomTom provider (`server/providers/traffic.js`) is the model for a daily budget that survives a restart.
The OSH control route is the model for a route that sends a request to an outside system. It uses `isLoopbackCommand`.

The Bee Maps API has one read call for new frames: `POST /latest/poly` with a GeoJSON polygon whose area is at most 5 km². The key goes in the header `Authorization`. The answer holds `frames`, `creditsUsed`, `creditsRemaining` and `cost`. Each frame has a signed image URL, and each unique view of such a URL costs $0.005.

## Goals / Non-Goals

**Goals:**
- A call that costs at most one unit of the daily budget, with a hard limit on the area and on the number of frames.
- No signed URL, no device id and no sensor data in the answer.
- A test that fails when the provider calls any other URL.

**Non-Goals:**
- Images. A later change adds the image route.
- Bursts. The key can create them, so this change holds no code for them.
- A panel for the key. The key is in `.env`.

## Decisions

### D1: One fixed upstream URL

The provider has one constant for the host and the path. The plugin takes a fetch function, so a test gives it a fake. No option changes the URL.
Alternative: an option for the base URL. A wrong value could send the key to another host, and a test would not see it.

### D2: Ask for the catalog

The request has `catalog=true`, so the answer has no signed image URL. A frame has a position and a time, and that is enough for a point on the globe.
The documents do not say what a catalog query uses. The budget counts one unit for each call, and the answer of the route shows the `credits` of the upstream answer.

### D3: Count before the call

The provider checks the count against the daily limit and adds 1 in one step, with no wait between the two. Then it writes the file `.gev-cache/beemaps/budget.json` and waits for the write. Then it sends the request.

Two requests that arrive together cannot both pass the check at the last unit. The writes run one after the other, so the last write holds the last count.

A failed call still counts. When the file is there and cannot be read, or cannot be written, the provider refuses the call. A file that is not there gives the count 0.

A file that is not valid JSON also gives a refusal. A count of 0 in its place would hide the spend.

### D4: Answers stay in memory

An answer stays for 600 seconds, and the memory holds 32 answers. The memory finds an answer by the polygon and the date. It does not use the `limit`, because the provider cuts the frames to the `limit` after it reads the memory.

The memory is not a disk cache. The terms do not say whether the app can keep a copy for other viewers, so the memory stays in the process.

A second request for the same polygon and date can arrive while the first request is in flight. It waits for the first request, and both requests use one upstream call.

### D5: Local requests only

The route calls `isLoopbackCommand` from `server/providers/common/loopback-command.js`. The function needs five things.

The five things are a loopback socket address, no proxy header, a loopback host, the same origin and the content type `application/json`. The browser code of change 2 sends such a request.

Alternative: the same-site gate of the other providers. It lets a device on the LAN pass when the owner opens the LAN address. This route spends money.

The status route spends nothing and shows only whether a key is set. It uses the same-site gate, like the Mapillary status route.

### D6: The filter keeps four fields

Each frame in the answer has `id`, `lat`, `lon` and `timestamp`. The `timestamp` is the ISO text of the upstream time. The `lat` and `lon` are rounded to 6 decimals.

The `id` is the first 16 hex characters of the SHA-256 of the three values joined by "|". The provider drops all other fields. A change of the upstream shape cannot add a field to the answer.

The documented shape is a `frames` list of items with a `timestamp` text and a `position` with `lat` and `lon`. An item of another shape is dropped.

### D7: The order of the steps

The provider runs eleven steps in this order.

The steps are: method, local request, rate limit, body, area, date, `limit`, key, memory, hold and budget. The first step that answers ends the sequence.

A step that costs nothing comes before a step that reads a file. The memory step comes before the hold and the budget, so a repeat costs nothing and gets its answer. The upstream call comes last.

### D8: One rate-limit count

Every request that reaches the rate-limit step comes from this machine. The rate limit therefore keeps one count, not one count for each address. The route allows 6 requests in 60 seconds.

### D9: The area is the area of the box

The provider measures the smallest box that holds the ring, on a sphere. A clockwise ring and a ring that crosses itself both have a box with a defined area. The area of the ring itself can be negative or near 0 for such a ring.
The cost is that a long, thin polygon can be refused although its own area is small.

### D10: Tests send no request

The tests give the plugin a fake fetch function and a fake clock. The fake fetch function fails the test for any URL other than the fixed URL. The budget file lives in a temporary folder.

## Risks / Trade-offs

- [The real answer has another shape] → The filter drops an item of another shape, and the Known limit `contract` says so. The owner can run one call by hand.
- [The daily limit is too low or too high] → `BEEMAPS_DAILY_QUERIES` sets it. The default is 20.
- [A browser on another origin calls the route] → The gate refuses it with `403`.
