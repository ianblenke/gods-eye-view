## MODIFIED Requirements

### Requirement: GET only
The provider MUST send only GET requests to the OpenSensorHub server, through one function, and MUST refuse a browser request whose method is not GET.
Origin: spec-first

#### Scenario: Send every upstream request as a recorded GET `osh-004`
- **WHEN** a client requests the systems, datastreams and observations routes, so that the base probe, the list fetch and the observation fetch each run
- **THEN** each recorded upstream call has method `GET`, no body and an `AbortSignal`

#### Scenario: Keep one upstream call site `osh-005`
- **WHEN** the test discovers every file that matches `server/providers/osh/*.js` and every file that matches `src/data/osh*.js`
- **AND** it reads, as text, `server/providers/osh.js`, the discovered files, and `server/providers/common/http.js`
- **THEN** the first discovered set is five files and the second is five files, both pinned counts
- **AND** only `server/providers/osh/get.js` contains a call to `fetch`, `fetchImpl` or `WebSocket`
- **AND** `get.js` sets `method: 'GET'` and `redirect: 'manual'` on the fetch call
- **AND** no file has `post`, `put`, `patch` or `delete` as a quoted string, in any letter case, and no file has a `body:` key
- **AND** no file imports `node:http`, `node:https`, `undici` or `ws`
- **AND** no file calls `send` on a socket, so the provider sends no frame to the server
- **AND** every other file that sends an upstream request imports `oshGet`, `oshPages` or `oshOpenStream` from `./get.js` or `./osh/get.js`

#### Scenario: Refuse a non-GET browser request `osh-006`
- **WHEN** a client sends `POST`, `PUT`, `PATCH` or `DELETE` to any sub-path of `/api/osh`
- **THEN** the response is `405` with the header `Allow: GET`
- **AND** the provider sends zero upstream requests

## ADDED Requirements

### Requirement: Live observations
The provider MUST relay the live observations of one datastream as server-sent events, from one upstream WebSocket for each datastream. The handshake MUST be a GET, and the provider MUST send no frame to the server. The layer MUST update the detail of the selected system from the stream, and MUST poll a datastream whose stream is not open.
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
- **AND** the URL has the query `f=application/om+json`
- **AND** `assertLiveUrl()` throws for another host, path, query, user name, password or fragment

#### Scenario: Open one upstream WebSocket as a GET and send nothing `osh-065`
- **WHEN** a client opens the live route for a datastream with the key set
- **THEN** the provider opens one upstream WebSocket with `binaryType` set to `arraybuffer`, and the handshake is a GET request
- **AND** the handshake carries `Authorization: Basic` only when both credentials are set, as `osh-007` says
- **AND** the provider sends zero frames to the upstream server

#### Scenario: Relay each frame as an observation event `osh-066`
- **WHEN** the upstream socket delivers a binary frame or a text frame that holds one JSON observation
- **THEN** the client receives an event `observation`, and its data is the observation of `osh-022` for that datastream, with the `ageMs` of that moment
- **AND** a frame that is not JSON, has no `result`, or has more than 65536 bytes gives no event, and the stream stays open
- **AND** a frame with more than 65536 bytes closes the upstream socket, and the client receives the event `unsupported`
- **AND** the provider refuses the live route for that datastream for ten minutes

#### Scenario: Share one upstream socket and close it after the last client `osh-067`
- **WHEN** two clients open the live route for one datastream, and both close
- **THEN** the provider opens one upstream socket, and both clients receive each frame
- **AND** the provider closes the upstream socket two seconds after the last client leaves
- **AND** a client that opens the route within those two seconds keeps the same socket

#### Scenario: Bound the number of streams `osh-068`
- **WHEN** eight upstream sockets are open, or sixteen clients listen to one datastream
- **THEN** a new client for another datastream, or a seventeenth client for that datastream, gets `503` with `{error:'live_busy'}`
- **AND** the provider opens no new upstream socket for that client

#### Scenario: Tell the client when the upstream opens and closes, and reconnect `osh-069`
- **WHEN** the upstream socket opens, closes or fails while a client listens
- **THEN** the client receives the event `open` after each open, and the event `down` after each close or failure
- **AND** while a client listens, the provider opens a new upstream socket after a delay of 1, 2, 4, 8, 16 and then 30 seconds
- **AND** the response carries a comment line every 20 seconds, so that a proxy keeps the connection open

#### Scenario: Keep the URL and the credentials out of the live route `osh-070`
- **WHEN** the upstream socket fails, and the provider logs a warning
- **THEN** none of the three configured values appears in an event, in a response header or in a log line

#### Scenario: Open the stream from the browser source with a same-origin GET `osh-071`
- **WHEN** the browser source opens a live stream for a datastream id, and later closes it
- **THEN** it creates one `EventSource` for the same-origin path `/api/osh/live?datastream=<id>`, with no credentials in the URL
- **AND** it gives the observation, open, down and unsupported events to its callbacks, and `close()` closes the `EventSource`

### Requirement: Live layer
The layer MUST open a live stream for each datastream of the selected system, and MUST close each stream when the selection ends.
Origin: spec-first

#### Scenario: Open and close the streams with the selection `osh-072`
- **WHEN** a system is selected and its datastreams are known
- **THEN** the layer opens one live stream for each of at most eight of its datastreams
- **AND** a new selection, a click on empty space and `destroy()` each close every open stream

#### Scenario: Update the detail and the entity from a live observation `osh-073`
- **WHEN** a live stream delivers an observation for a datastream of the selected system
- **THEN** the detail shows that observation in the block of its datastream, with its age
- **AND** the entity of the system moves to its location when the location is fresh, and not when the observation is ahead of the clock
- **AND** the layer reads no second observation for that datastream while its stream is open

#### Scenario: Poll a datastream whose stream is not open `osh-074`
- **WHEN** a live stream is not open, or reports `down` or `unsupported`
- **THEN** the layer polls the newest observation of that datastream at each poll interval, as `osh-022` says
- **AND** a stream that opens again stops that poll
