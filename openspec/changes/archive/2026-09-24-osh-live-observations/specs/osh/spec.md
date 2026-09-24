## MODIFIED Requirements

### Requirement: GET only
The provider MUST send only GET requests to the OpenSensorHub server, through one file, and MUST refuse a browser request whose method is not GET.
Origin: spec-first

#### Scenario: Send every upstream request as a recorded GET `osh-004`
- **WHEN** a client requests the systems, datastreams, observations and live routes, so that each upstream call runs
- **THEN** each recorded upstream call has method `GET`, no body and an `AbortSignal`
- **AND** `oshOpenStream()` passes the URL and an option object with only `headers`, so the handshake is a GET with no body

#### Scenario: Keep one upstream call site `osh-005`
- **WHEN** the test discovers every file that matches `server/providers/osh/*.js` and every file that matches `src/data/osh*.js`
- **AND** it reads, as text, `server/providers/osh.js`, the discovered files, and `server/providers/common/http.js`
- **THEN** the first discovered set is five files and the second is five files, both pinned counts
- **AND** only `server/providers/osh/get.js` contains a call to `fetch`, `fetchImpl` or `WebSocket`
- **AND** `get.js` sets `method: 'GET'` and `redirect: 'manual'` on the fetch call
- **AND** no file has `post`, `put`, `patch` or `delete` as a quoted string, in any letter case, and no file has a `body:` key
- **AND** no file imports `node:http`, `node:https`, `undici` or `ws`
- **AND** no scanned file uses the word `send` outside a comment, so the provider sends no message frame to the server
- **AND** every other file that sends an upstream request imports `oshGet`, `oshPages` or `oshOpenStream` from `./get.js` or `./osh/get.js`

#### Scenario: Refuse a non-GET browser request `osh-006`
- **WHEN** a client sends `POST`, `PUT`, `PATCH` or `DELETE` to any sub-path of `/api/osh`
- **THEN** the response is `405` with the header `Allow: GET`
- **AND** the provider sends zero upstream requests

### Requirement: Query construction
The provider MUST build the query of every upstream list URL from named keys and values with `URLSearchParams`. It MUST NOT write a URL with a literal query, and MUST NOT write a query value with a hand-encoded byte.
Origin: spec-first

#### Scenario: Build every list URL from parts `osh-037`
- **WHEN** the provider builds the URL of the base probe, the systems list or the datastreams list
- **THEN** `oshListUrl(root, path, query)` gives a URL on the root's origin, with the root's path plus `path`, and a query of the `URLSearchParams` form of `query`
- **AND** `oshListUrl()` throws when the built URL leaves the root's origin or the root's path
- **AND** a value with `+`, `/`, `&` or a space reaches the query as `%2B`, `%2F`, `%26` or `+`
- **AND** the probe query is `limit=1&f=application%2Fgeo%2Bjson`, the systems query is `limit=100&f=application%2Fgeo%2Bjson` and the datastreams query is `limit=100`
- **AND** `OSH_LIST_FORMAT` is `application/geo+json`

#### Scenario: Send each upstream query in its canonical form `osh-038`
- **WHEN** a client requests the systems, datastreams and observations routes, so that the probe, the two list fetches and the observation fetch each run
- **THEN** the query of each recorded upstream URL equals its own `URLSearchParams` round trip, byte for byte
- **AND** each recorded URL with an `f` key decodes that key to `application/geo+json`
- **AND** no decoded query value holds a space

#### Scenario: Keep the provider files free of a literal query `osh-039`
- **WHEN** the test reads, as text, `server/providers/osh.js` and the five files that `osh-005` discovers under `server/providers/osh/`, with comments removed
- **THEN** no quoted string in those files holds a `key=value` pair whose value has `+`, `%`, `#` or a space
- **AND** no quoted string in those files holds `?` followed by a `key=value` pair

#### Scenario: Keep the provider's own format on a walked next-page link `osh-040`
- **WHEN** a next-page link carries an `f` key, omits it, or carries it twice
- **THEN** the walked request's `f` value is `OSH_LIST_FORMAT`, written once, when the current page asked for one
- **AND** the walked request carries no `f` key at all when the current page asked for none
- **AND** that format holds across every later page of the same walk, and the walk never takes that format from a link
- **AND** the query reaches the wire as `application%2Fgeo%2Bjson`, even when a link's raw value holds a literal `+`

## ADDED Requirements

### Requirement: Live observations
The provider MUST relay the live observations of one datastream as server-sent events, from one upstream WebSocket for each datastream. The handshake MUST be a GET, and the provider MUST send no message frame to the server. The layer MUST update the detail of the selected system from the stream, and MUST poll a datastream whose stream is not open.
Origin: spec-first

#### Scenario: Refuse the live route with no key, a bad id or a wrong method `osh-063`
- **WHEN** a client requests `/api/osh/live` with no key set, with a bad `datastream` value, or with a method other than GET
- **THEN** the answer is `503` with `{error:'no_key'}` for no key, and `400` with `{error:'bad_datastream'}` for a bad id
- **AND** the answer is `405` with the header `Allow: GET` for a wrong method
- **AND** a bad id is a value outside the pattern of `osh-020`
- **AND** in each of the three cases the provider opens no upstream socket

#### Scenario: Build the live URL to its fixed shape `osh-064`
- **WHEN** the provider builds the live URL for a datastream id and a resolved root
- **THEN** the URL has the scheme `ws` for an `http` root and `wss` for an `https` root
- **AND** the URL has the host and the port of the root, and the path `datastreams/<id>/observations`
- **AND** the URL has the query `f` with the value `application/om+json`, written as `application%2Fom%2Bjson`
- **AND** the URL has no user name and no password, and this holds when the root has them
- **AND** `assertLiveUrl()` throws for another scheme, host, port, path, query, user name, password or fragment

#### Scenario: Open one upstream WebSocket as a GET and send no message frame `osh-065`
- **WHEN** a client opens the live route for a datastream with the key set
- **THEN** the provider opens one upstream WebSocket with `binaryType` set to `arraybuffer`, and the handshake is a GET request
- **AND** the handshake carries `Authorization: Basic` only when both credentials are set, as `osh-007` says
- **AND** the provider sends no message frame to the upstream server
- **AND** the runtime sends only control frames: a pong for each ping, and a close frame when a socket closes
- **AND** the response has the type `text/event-stream`, `Cache-Control: no-store` and `X-Accel-Buffering: no`

#### Scenario: Relay each frame as an observation event `osh-066`
- **WHEN** the upstream socket delivers a binary frame or a text frame that holds one JSON observation
- **THEN** the client receives an event `observation`, and its data is the observation of `osh-022` for that datastream, with the `ageMs` of that moment
- **AND** a frame of 65536 bytes or less that is not JSON, or has no `result`, gives no event
- **AND** after such a frame, the upstream socket and the client responses stay open
- **AND** a frame with more than 65536 bytes closes the upstream socket, with any content, and the client receives the event `unsupported`
- **AND** the provider ends the response of each client of that datastream
- **AND** a request for that datastream in the next ten minutes gets `503` with `{error:'live_unsupported'}`

#### Scenario: Share one upstream socket and close it after the last client `osh-067`
- **WHEN** two clients open the live route for one datastream, and both close
- **THEN** the provider opens one upstream socket, and both clients receive each frame
- **AND** the provider closes the upstream socket two seconds after the last client leaves
- **AND** a client that opens the route within those two seconds keeps the same socket
- **AND** a client whose connection closed before the provider answers gets no response head and opens no socket

#### Scenario: Limit the number of streams `osh-068`
- **WHEN** the provider serves eight datastreams, or sixteen clients listen to one datastream
- **THEN** a client for a ninth datastream, or a seventeenth client for one datastream, gets `503` with `{error:'live_busy'}`
- **AND** the provider opens no upstream socket for that client
- **AND** a datastream counts toward the limit of eight from its first client until two seconds after its last client leaves
- **AND** a datastream counts toward that limit while its socket connects or waits to try again

#### Scenario: Tell the client when the upstream opens and closes, and open a new socket `osh-069`
- **WHEN** the upstream socket opens, closes or fails while a client listens
- **THEN** the client receives the event `open` each time the upstream socket opens, and the event `down` each time it closes or fails
- **AND** a client that joins while the upstream socket is open receives the event `open` at once
- **AND** while a client listens, the delay before each new socket is 1, 2, 4, 8 and 16 seconds, and then 30 seconds each time
- **AND** a socket that stays open for 30 seconds resets that delay to 1 second
- **AND** the response carries a comment line every 20 seconds, so that a proxy keeps the connection open

#### Scenario: Keep the URL and the credentials out of the live route `osh-070`
- **WHEN** the upstream socket fails, and the provider logs a warning
- **THEN** none of the three configured values appears in an event, in a response header or in a log line

#### Scenario: Open the stream from the browser source with a same-origin GET `osh-071`
- **WHEN** the browser source opens a live stream for a datastream id, and later closes it
- **THEN** it creates one `EventSource` for the same-origin path `/api/osh/live?datastream=<id>`, with no credentials in the URL
- **AND** it calls its callbacks for the events `observation`, `open`, `down` and `unsupported`, and `close()` closes the `EventSource`
- **AND** the `error` event of the `EventSource` also calls the callback for `down`
- **AND** the event `open` that the browser raises with no data calls no callback
- **AND** an `observation` event whose data is not one JSON object calls no callback

#### Scenario: Close every live stream when the server closes `osh-075`
- **WHEN** the HTTP server of the provider closes while clients listen
- **THEN** the provider ends the response of each client and clears each timer of the hub
- **AND** the provider closes each upstream socket that it holds
- **AND** no timer of the provider opens a new upstream socket after that

### Requirement: Live layer
The layer MUST start a live stream for each of at most three datastreams of the selected system. It MUST close each stream when the selection ends. A stream is open from its event `open` until its event `down` or `unsupported`.
Origin: spec-first

#### Scenario: Start and close the streams with the selection `osh-072`
- **WHEN** the user selects a system and the layer reads its datastreams
- **THEN** the layer starts one live stream for each of at most three of its datastreams
- **AND** a new selection, a click on empty space and `destroy()` each close every stream

#### Scenario: Update the detail and the entity from a live observation `osh-073`
- **WHEN** a live stream delivers an observation for a datastream of the selected system
- **THEN** the detail shows that observation in the block of its datastream, with its age
- **AND** the entity of the system moves to its location when the location is fresh, and not when the observation is ahead of the clock
- **AND** the layer reads no observation by poll for that datastream, while its stream is open and the layer holds an observation for it

#### Scenario: Poll a datastream whose stream is not open `osh-074`
- **WHEN** a live stream is not open, the layer holds no observation for its datastream, or the stream reports `down` or `unsupported`
- **THEN** the layer polls the newest observation of that datastream at each poll interval, as `osh-030` says
- **AND** a stream that is open, for a datastream that has an observation, stops that poll
