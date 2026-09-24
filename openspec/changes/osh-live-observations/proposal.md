## Why

The layer polls the newest observation of each datastream of the selected system every 15 seconds. The detail changes only at each poll. The observation route caches each answer for 15 seconds. A system that moves, such as a drone, therefore shows a position that is up to 30 seconds old.

The server offers each datastream as a live stream over a WebSocket. It sends each observation as one JSON message in a binary frame. A handler that waits for a text frame never sees it, and this delayed the change by one day. A test on a local fixture shows that the Node global `WebSocket` reads such a frame on Node 24 and on Node 26.

This change uses the live stream for the selected system. The provider relays it to the browser as server-sent events. The browser then needs only a same-origin GET.

## What Changes

- Add the route `GET /api/osh/live?datastream=<id>`. It answers with server-sent events. The provider opens one upstream WebSocket for each datastream, and all clients of that datastream share it.
- Add `oshOpenStream()` to `server/providers/osh/get.js`. It is the only place that builds a WebSocket. The handshake is a GET request, and the provider sends no message frame.
- Add `liveUrl()` and `assertLiveUrl()` to `server/providers/osh/ids.js`, with the same checks as the other URL builders.
- Add `server/providers/osh/live.js`. It shares sockets, limits their number, sends a heartbeat comment to each client, and opens a socket again after a failure. It closes every client, timer and socket when the HTTP server closes.
- Add `openLive()` to the browser source. It creates one `EventSource` for the same-origin route.
- Change the layer. It starts a stream for each of at most three datastreams of the selected system, and it shows each observation in the detail. It moves the entity for a fresh location. It polls a datastream whose stream is not open.
- Add the requirements "Live observations" and "Live layer", with the scenarios `osh-063` to `osh-075`.
- Change the text of the requirement "GET only" from "one function" to "one file". The file `get.js` now holds a fetch call and a WebSocket call. The scenarios `osh-004`, `osh-005` and `osh-006` change with it.
- Change the scenario `osh-004` to check the option object of `oshOpenStream()`. Change `osh-005` for the new call site and the new file count.
- Change the scenario `osh-039` from four files to five files. Its requirement "Query construction" keeps its text.

## Impact

- Changed configuration: `scripts/package-boundaries.json` gets `live.js` in the group `osh-provider`.
- Changed code files: `server/providers/osh.js`, `server/providers/osh/get.js`, `server/providers/osh/ids.js`, `src/layers/osh/source.js` and `src/layers/osh/index.js`.
- New code file: `server/providers/osh/live.js`. The pinned count of `osh-005` changes from four files to five.
- Changed test files: `src/data/oshGet.test.mjs`, `src/data/oshProxy.test.mjs`, `src/data/oshIds.test.mjs`, `src/data/oshLayer.test.mjs`, `src/layers/osh/source.test.mjs` and `src/data/oshRepositoryHygiene.test.mjs`.
- The hygiene test pins the number of OSH test files. The new test file changes that number from 14 to 15. The address scan of the hygiene test now reads the schemes `ws` and `wss`.
- New test file: `src/data/oshLive.test.mjs`. It uses a fixture WebSocket server on the loopback address. No test calls a real server.
- No new request method, no request body and no new environment variable. The list routes and the observation route do not change.
- The provider holds more open connections. The limits are eight datastreams in all, and sixteen clients for each datastream. Each datastream holds one upstream socket.
- Gaps that this change opens or closes: none. Each new code file must have full coverage.

## Known limits and later changes

- `osh-live-selected-only`: only the datastreams of the selected system stream. The positions of the other entities still change at each refresh.
- `osh-live-stream-cap`: the layer starts at most three streams. Each stream holds one connection, and a browser allows about six connections to one origin over HTTP/1.1. A system with more datastreams streams the first three and polls the others. All tabs of one origin share the six connections. The first three datastreams take the streams, also when they are video. A video stream reports `unsupported`, and the layer starts no stream for another datastream.
- `osh-live-video-not-decoded`: a video datastream sends frames of more than 65536 bytes. The provider closes its socket, refuses the route for that datastream for ten minutes, and the layer polls it. A later change can decode the video.
- `osh-live-one-way`: the provider only listens. It sends no command and no message frame, and the server accepts none. The runtime sends only control frames: a pong for each ping, and a close frame when a socket closes.
- `osh-live-header-extension`: the `headers` option of the `WebSocket` constructor is an extension of Node. A different runtime can ignore it, and the handshake then carries no credentials.
- `osh-live-no-live-test`: no test proves that the owner's server behaves like the fixture. Every fixture is synthetic.
- `osh-live-poll-after-down`: after a `down` event, the poll runs as today. It can replace a newer live observation with an older cached one, because the observation route caches for 15 seconds. A later change can order the two by `phenomenonTime`.
- `osh-live-first-client-reader`: the hub keeps the URL, the headers and the schema reader of the first client for the life of the entry of a datastream. The entry lives until two seconds after the last client leaves. The hub does not use the reader of a later client.
- `osh-live-silent-upstream`: the hub has no timer for an upstream socket that sends no data, because a datastream can send no data for a long time. The event `down` comes only when the socket closes or fails. While a stream is open and the layer holds an observation, the layer does not poll. So a socket that no longer works leaves the last observation in the detail, with the age that the hub sent.
- `osh-live-memory`: the hub receives a whole frame before it checks its size. The map of refused datastreams keeps every entry. The provider does not check the result of `write()` for a client, so a slow client can make its buffer grow.
- `osh-live-no-retry-after-refusal`: an answer `503` makes the `EventSource` stop, and it does not try again. The layer treats it as `down`, polls the datastream, and starts no new stream for the same selection. When eight datastreams hold a place, each new datastream gets `live_busy`. A datastream keeps its place for two seconds after its last client leaves, so quick selections can fill the hub.
