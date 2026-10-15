## Context

Base commit: `b3f5d61e` (main, after the merge of `osh-control-loopback`).
The Mapillary provider (`server/providers/mapillary/routes.js`) is the model for a route with a key that stays in the server. The TomTom provider (`server/providers/traffic.js`) is the model for a daily budget that survives a restart.
The OSH control route is the model for a route that sends a request to an outside system. It uses `isLoopbackCommand`.

The Bee Maps API has one read call for new frames: `POST /latest/poly` with a GeoJSON polygon of at most 5 km². The key goes in the header `Authorization`. The answer holds signed image URLs, and each unique view of such a URL costs $0.005.

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

The provider has one constant for the host and the path. The plugin takes a fetch function, so a test gives it a fake. No setting changes the URL.
Alternative: a setting for the base URL. A wrong value could send the key to another host, and a test would not see it.

### D2: Ask for the catalog

The request has `catalog=true`, so the answer has no signed image URL. A frame has a position and a time, and that is enough for a point on the globe.
The documents do not say what a catalog call costs. The budget counts one unit for each call.

### D3: Count before the call

The provider adds one to the count of the day and waits for the write of the file `.gev-cache/beemaps/budget.json`. Then it sends the request. A failed call still counts. When the file cannot be written, the provider refuses the call.
Alternative: count after the answer. A crash between the call and the count would lose a charge.

### D4: Answers stay in memory

An answer stays for 600 seconds, and the memory holds 32 answers. The key of an answer is the polygon, the date and the limit. A repeat costs nothing.
The memory is not a disk cache. The terms do not allow a copy of the data for other viewers.

### D5: Local requests only

The route calls `isLoopbackCommand` from `server/providers/common/loopback-command.js`. The function needs a loopback socket, a loopback host, the same origin and the content type `application/json`. The browser code of change 2 sends such a request.
Alternative: the same-site gate of the other providers. It lets a device on the LAN pass when the owner opens the LAN address. This route spends money.

### D6: The filter keeps four fields

Each frame in the answer has `id`, `lat`, `lon` and `timestamp`. The `id` is the first 16 hex characters of the SHA-256 of the text `timestamp|lat|lon`. The provider drops all other fields, so a change of the upstream shape cannot add a field to the answer.

### D7: The order of the checks

The provider runs ten checks in this order. They are the method, the local request, the rate limit, the body, the area, the date, the limit, the key, the memory and the budget. A check that costs nothing comes before a check that reads a file. The upstream call comes last.

### D8: Tests send no request

The tests give the plugin a fake fetch function and a fake clock. The fake fetch function fails the test for any URL other than the fixed URL. The budget file lives in a temporary folder.

## Risks / Trade-offs

- [The real answer has another shape] → The filter drops a frame that has no position or time, and the Known limit `contract` says so. The owner can run one call by hand.
- [The daily limit is too low or too high] → `BEEMAPS_DAILY_QUERIES` sets it. The default is 20.
- [A browser on another origin calls the route] → The gate refuses it with `403`.
