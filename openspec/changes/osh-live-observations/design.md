## Context

The layer polls the newest observation of each datastream of the selected system. The route `/api/osh/observations` caches the answer for 15 seconds. A moving system therefore shows a position that is up to 30 seconds old, and its detail changes in steps.

The server also publishes each datastream as a live stream. The stream URL is the API root with the scheme `ws`, the path `datastreams/<id>/observations` and the query `f=application/om+json`. The server sends one JSON observation in each binary frame. This change relays that stream for the selected system.

Three existing rules limit the design. `osh-004` says that the provider sends only GET requests. `osh-005` says that one file holds the only network call and pins the file counts. `osh-007` and `osh-008` say when Basic authentication is sent and that no response holds a configured value.

## Goals / Non-Goals

**Goals:**
- Show the observations of the selected system live, with polling as the fallback.
- Keep the handshake a GET request and send no frame to the server.
- Keep the credentials and the URL on the server.
- Bound the number of open sockets and clients.

**Non-Goals:**
- Stream the entities that the layer does not select.
- Decode video.
- Send any command to the server.

## Decisions

### D64 Server-sent events to the browser, not a second WebSocket

The browser needs a one-way stream and a GET request. `EventSource` gives both, and it opens the connection again after a break. A WebSocket route on the Vite servers needs an upgrade handler and a server library. `osh-005` forbids the `ws` import.

The route is `GET /api/osh/live?datastream=<id>`. Its answer has the type `text/event-stream`, `Cache-Control: no-store` and `X-Accel-Buffering: no`. The other routes of `/api/osh` keep their rules: a wrong method gives `405`, and no key gives `503`.

### D65 One upstream socket for each datastream, shared

`server/providers/osh/live.js` exports `createOshLiveHub()`. It keeps one entry for each datastream. The entry has the upstream socket, the set of clients and the state. A client joins an entry, and it leaves when its connection closes. The plugin builds one hub, and a test can give its own hub.

The hub closes the upstream socket two seconds after the last client leaves. A client that joins within those two seconds keeps the socket. This stops a new socket for each quick selection.

The limits are eight upstream sockets and sixteen clients for each datastream. A client beyond a limit gets `503` with `{error:'live_busy'}`, and the hub opens no socket for it.

### D66 The handshake is a GET request and the provider sends nothing

`oshOpenStream()` in `get.js` builds the upstream socket. It takes the constructor, the URL and the headers, and it sets `binaryType` to `arraybuffer`. The Node constructor accepts a second argument with a `headers` object, and it sends a GET handshake with those headers. The URL encodes the `/` and the `+` of the value of `f`. So a server that decodes a form reads a plus sign, not a space.

A local test on Node 24.21 and on Node 26 shows three facts. The header reaches the server, the method is GET, and the binary frame arrives as an `ArrayBuffer`. No file calls `send`, and a test scans the source for that call. The hub gives the constructor as an injected option, so a test can record the call.

`assertLiveUrl()` re-checks the built URL against the root and the id, as the other builders do. The scheme is `ws` for an `http` root and `wss` for an `https` root.

### D67 Each frame becomes the observation of osh-022

The hub decodes the frame as UTF-8, whether the frame is binary or text. It parses the JSON and needs an object with a `result` field. It then calls `mapOshObservation()` with the frame and the schema reader that the observation route uses. The result has `phenomenonTime`, `resultTime`, `rows` and `location`. The hub adds `ageMs` at the moment of sending.

A frame that is not JSON or has no `result` gives no event. A frame of more than 65536 bytes closes the upstream socket. The hub then ends the response of each client and refuses the datastream for ten minutes. A request in that time gets `503` with `{error:'live_unsupported'}`. The event `unsupported` comes before the end. This protects the provider from a video datastream, which sends large frames.

### D68 The events

Each event is a `data:` line with one JSON value, after an `event:` line. The events are `observation`, `open`, `down` and `unsupported`. `open` comes after each open of the upstream socket, and a client that joins an open socket gets it at once. `down` comes after each close or failure. A comment line `: hb` comes every 20 seconds, so that a proxy keeps the connection open.

While a client listens and the socket is down, the hub opens a new socket after 1, 2, 4, 8, 16 and then 30 seconds. A socket that stays open for 30 seconds resets the delay.

### D69 No configured value in an event or a log line

An event has only the four names above and an observation. A failure logs a fixed text with the error code. The text never contains the URL, the user name or the password, as `osh-008` says.

### D70 The browser source and the layer

`createOshSource()` gains the method `openLive()`. It takes a datastream id and four callbacks: `onObservation`, `onOpen`, `onDown` and `onUnsupported`. It creates one `EventSource` for the same-origin live route and returns an object with `close()`. The method is optional. A source without it gives the polling behavior of today.

The layer keeps one stream for each datastream of the selected system, at most eight. It opens them when `pollSelected()` first knows the datastreams.

A live observation replaces the observation of its datastream in the detail. The layer moves the entity when the location is fresh and the observation is not ahead of the clock. A datastream whose stream is open, and for which the layer holds an observation, gets no poll. Every other datastream keeps the poll of today. So a slow datastream shows its newest observation from the poll, and the stream then keeps it current. A new selection, a click on empty space and `destroy()` close every stream.

### D71 How the gates measure this change

Coverage: `live.js` and every changed code file stay at 100% line, branch and function coverage. Trace: `osh-063` to `osh-074` tag new tests. `osh-005` has a changed test with its tag. The tests of `osh-004` and `osh-006` stay, and a new `[osh-006]` test covers the live route.

The server tests use a hand-made WebSocket server on the loopback address. It accepts the upgrade, sends binary and text frames, and records the request headers and each frame that it receives. The browser tests use a fake `EventSource`. Every mutation in `tasks.md` names the test that must fail.

## Risks / Trade-offs

- **The provider holds more open connections.** Accepted. The limits are eight sockets and sixteen clients for each datastream, and the last client closes the socket.
- **A stream can stay open on a dead server.** Accepted. The event `down` and the poll cover it, and a heartbeat shows a dead client connection.
- **The `headers` option is an extension of Node.** Accepted and named as `osh-live-header-extension`. A test checks the header on the pinned Node version.
- **The relay adds a second path to the same observations.** Accepted. Both paths use `mapOshObservation()`, so a frame and a poll give the same shape.

## Migration Plan

None. The route is new. A source without `openLive()` keeps the polling behavior.

## Open Questions

None.
