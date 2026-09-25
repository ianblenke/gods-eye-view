## MODIFIED Requirements

### Requirement: GET only
The provider MUST send only GET requests to the OpenSensorHub server, through one file, and MUST refuse a browser request whose method is not GET.
Origin: spec-first

#### Scenario: Send every upstream request as a recorded GET `osh-004`
- **WHEN** a client requests the systems, datastreams, observations and live routes, so that each upstream call runs
- **THEN** each recorded fetch call has method `GET`, no body and an `AbortSignal`
- **AND** `oshOpenStream()` passes the URL and an option object with only `headers`, so the handshake is a GET with no body

#### Scenario: Keep one upstream call site `osh-005`
- **WHEN** the test discovers every file that matches `server/providers/osh/*.js` and every file that matches `src/data/osh*.js`
- **AND** it reads, as text, `server/providers/osh.js`, the discovered files, and `server/providers/common/http.js`
- **THEN** the first discovered set is five files and the second is six files, both pinned counts
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

### Requirement: Live layer
The layer MUST start a live stream for each of at most three datastreams of the selected system. It MUST close each stream when the selection ends. A stream is open from its event `open` until its event `down` or `unsupported`.
Origin: spec-first

#### Scenario: Start and close the streams with the selection `osh-072`
- **WHEN** the user selects a system and the layer reads its datastreams
- **THEN** the layer starts one live stream for each of at most three of its datastreams
- **AND** a new selection, a click on empty space and `destroy()` each close every stream
- **AND** a datastream with `video: true` gets no live stream, and it does not count toward the limit of three

#### Scenario: Update the detail and the entity from a live observation `osh-073`
- **WHEN** a live stream delivers an observation for a datastream of the selected system
- **THEN** the detail shows that observation in the block of its datastream, with its age
- **AND** the entity of the system moves to its location when the location is fresh, and not when the observation is ahead of the clock
- **AND** the layer reads no observation by poll for that datastream, while its stream is open and the layer holds an observation for it

#### Scenario: Poll a datastream whose stream is not open `osh-074`
- **WHEN** a live stream is not open, the layer holds no observation for its datastream, or the stream reports `down` or `unsupported`
- **THEN** the layer polls the newest observation of that datastream at each poll interval, as `osh-030` says
- **AND** a stream that is open, for a datastream that has an observation, stops that poll
- **AND** a datastream with `video: true` gets no poll

## ADDED Requirements

### Requirement: Video datastreams
The adapter MUST mark a datastream that carries video.
Origin: spec-first

#### Scenario: Mark a datastream that carries video `osh-076`
- **WHEN** the adapter maps a datastream list
- **THEN** a record whose `resultType` is `coverage` and whose `observedProperties` name `RasterImage` has `video: true`
- **AND** the adapter reads each name as the last non-empty part of the `definition`, split at a slash, a hash sign or a colon
- **AND** any other record has no `video` property

### Requirement: Video relay
The provider MUST relay the video of one datastream as server-sent events, from one upstream WebSocket. The handshake MUST be a GET, and the provider MUST send no message frame to the server.
Origin: spec-first

#### Scenario: Refuse the video route with no key, a bad id or a wrong method `osh-077`
- **WHEN** a client requests `/api/osh/video` with no key set, with a bad `datastream` value, or with a method other than GET
- **THEN** the answer is `503` with `{error:'no_key'}` when no key is set
- **AND** the answer is `400` with `{error:'bad_datastream'}` for a bad id
- **AND** the answer is `405` with the header `Allow: GET` for a wrong method
- **AND** in each of these three cases the provider opens no upstream socket

#### Scenario: Answer a good request to the video route as the live route does `osh-091`
- **WHEN** a client requests `/api/osh/video?datastream=<id>` with a key set and a good id
- **THEN** the provider writes the response head of the live route, and it opens one upstream socket for the video URL
- **AND** the socket has the header `Authorization` only when both credentials are set, and its option `binaryType` is `arraybuffer`
- **AND** the provider reads no schema, and every request that it makes to the server is a GET
- **AND** the answer is `502` with the error code of the root when no root answers, and `503` with `{error:'live_busy'}` when eight datastreams are open
- **AND** the hub removes the client when its connection closes, and it opens no socket for a client that has already left

#### Scenario: Build the video URL to its fixed shape `osh-078`
- **WHEN** the provider builds the video URL for a datastream id and a resolved root
- **THEN** the URL has the scheme `ws` for an `http` root and `wss` for an `https` root
- **AND** the URL has the URL host and the port of the root, and the path `datastreams/<id>/observations`
- **AND** the URL has the query `f` with the value `application/swe+binary`, written as `application%2Fswe%2Bbinary`
- **AND** the URL has no user name and no password, and this holds when the root has them
- **AND** `assertVideoUrl()` throws for another scheme, host, port, path, query, user name, password or fragment

#### Scenario: Relay each video message as a frame event `osh-079`
- **WHEN** the upstream socket delivers a message
- **THEN** the client receives one event `frame` for each good message
- **AND** a good message is binary, and it has 12 to 2097152 bytes
- **AND** a good message has a length field that equals its size minus 12, and a time stamp that is a finite number
- **AND** the data of the event is the base64 text of the whole message, as one JSON string
- **AND** a text message gives no event
- **AND** a message of less than 12 bytes gives no event
- **AND** a message whose length field does not equal its size minus 12 gives no event
- **AND** a message whose time stamp is not a finite number gives no event
- **AND** a message of more than 2097152 bytes closes the upstream socket, and the client receives the event `unsupported`
- **AND** the provider ends the response of each client of the video entry
- **AND** for ten minutes the video route for that datastream answers `503` with `{error:'live_unsupported'}`

#### Scenario: Replay the current message group to a late client `osh-080`
- **WHEN** a client joins a video stream that has already relayed messages
- **THEN** the client receives the event `open`, and then one event `frame` for each message of the group, in order
- **AND** the group starts with the last key message, and it has each message after that key message
- **AND** a message is a key message when its H.264 data has a NAL unit of type 5
- **AND** the hub starts the group again at each key message, and it empties the group when the upstream socket closes or fails
- **AND** the hub empties a group of more than 2097152 bytes, and it keeps no group until the next key message

#### Scenario: Keep the video stream apart from the live stream `osh-081`
- **WHEN** clients open the live route and the video route for one datastream id
- **THEN** the hub has two entries and opens two upstream sockets, one for each URL
- **AND** each entry counts toward the limit of eight datastreams
- **AND** a client of the video route gets no event `observation`, and a client of the live route gets no event `frame`
- **AND** a refusal or a close of one entry leaves the other entry of the same id open

#### Scenario: End a client that does not read `osh-090`
- **WHEN** the hub writes to a client of the live route or the video route
- **AND** the response of that client has more than 8388608 bytes not yet written
- **THEN** the provider destroys the response of that client, and the hub removes it
- **AND** the other clients of the entry keep their events, and the upstream socket stays open
- **AND** a client that has exactly 8388608 bytes not yet written, or fewer, keeps its response

### Requirement: Video player
The browser MUST decode the video messages of one camera onto a canvas, and MUST show a status when it cannot decode them.
Origin: spec-first

#### Scenario: Open the video stream from the browser source `osh-082`
- **WHEN** the browser source opens a video stream for a datastream id, and later closes it
- **THEN** it creates one `EventSource` for the same-origin path `/api/osh/video?datastream=<id>`, with no credentials in the URL
- **AND** it calls `onFrame` with the bytes that the base64 text of each `frame` event encodes
- **AND** it calls its other callbacks for the events `open`, `down` and `unsupported`, and for the `error` event of the `EventSource`, as `osh-071` says
- **AND** a `frame` event whose data is not one JSON string of base64 text calls no callback
- **AND** `close()` closes the `EventSource`

#### Scenario: Read the parts of a video message `osh-083`
- **WHEN** `src/data/oshVideo.js`, the helper, gets the bytes of a video message
- **THEN** it returns the time stamp in milliseconds and the H.264 data of a good message
- **AND** a message is good when it has at least 12 bytes and its time stamp is a finite number
- **AND** the length field of a good message equals its size minus 12
- **AND** it returns null for every other message
- **AND** the time stamp in the message is a double in seconds, and the length field has four bytes, most significant byte first
- **AND** it splits the H.264 data into NAL units at each start code of three or four bytes
- **AND** it builds the codec string `avc1.` and the three bytes after the NAL header of the SPS, in hexadecimal
- **AND** it builds the `avcC` record from the SPS and the PPS
- **AND** it builds one sample from the slice NAL units of types 1 to 5
- **AND** each slice in the sample has its length in four bytes before it, most significant byte first

#### Scenario: Decode the messages onto a canvas `osh-084`
- **WHEN** the player gets the messages of a video stream
- **THEN** it decodes nothing until a key message with an SPS and a PPS arrives
- **AND** it reports the status `waiting` until then
- **AND** it configures the decoder with the codec string and the `avcC` record of that key message
- **AND** it decodes each message from that key message on, as a key chunk or a delta chunk
- **AND** the time stamp of a chunk is in microseconds after the time stamp of the first decoded message
- **AND** it sets the size of the canvas from a decoded frame, and it draws the frame on the canvas
- **AND** it closes the frame, and it reports the status `live` at the first drawn frame
- **AND** it closes the frame also when the draw throws
- **AND** when the decoder queue holds more than eight chunks, it ignores each delta message until the next key message
- **AND** it configures the decoder again when the SPS changes
- **AND** after a decoder error it reports the status `error` and then `waiting`, resets the decoder, and waits for a key message
- **AND** it treats an exception from `configure` or `decode`, or from the constructor of the decoder, as a decoder error

#### Scenario: Show when the browser cannot decode `osh-085`
- **WHEN** the browser has no `VideoDecoder` or no `EncodedVideoChunk`
- **THEN** the player decodes nothing and reports the status `unsupported`

### Requirement: Camera panel
The layer MUST show the detail and the video of the selected system in a panel, and MUST hide the panel when the selection ends.
Origin: spec-first

#### Scenario: Show and hide the panel with the selection `osh-086`
- **WHEN** the user selects a system or a feature, and later selects nothing
- **THEN** the layer shows the panel host while it has a detail for the selection, and the detail host has that detail
- **AND** the layer hides the panel host and empties the detail host when the selection ends
- **AND** the world overlay treats the panel host as an occluder

#### Scenario: Play the video of the selected system `osh-087`
- **WHEN** the datastreams of the selected system have a datastream with `video: true`
- **THEN** the layer starts one video stream for the first such datastream, and it creates one video view and one player
- **AND** the layer passes each message of the stream to the player
- **AND** the view shows the name of the datastream, or its id when it has no name, and the status of the player
- **AND** a new selection, a click on empty space and `destroy()` each close the video stream and the player, and remove the view
- **AND** the event `down` shows the status `reconnecting`, and the event `unsupported` shows the status `unavailable` and closes the stream
- **AND** the layer starts no video stream when the player reports the status `unsupported`

#### Scenario: Show a video datastream in the detail `osh-088`
- **WHEN** the detail has a datastream with `video: true`
- **THEN** its block shows the name, or the id when it has no name, and the word `Video`
- **AND** the block shows no row `No data`, no time and no age

#### Scenario: Find the hosts of the panel `osh-089`
- **WHEN** the default layer looks for its hosts in a page
- **THEN** it uses the elements with the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`
- **AND** it uses no host when there is no document, or when the page has no element for an id
- **AND** `index.html` has the element `osh-panel` with the attribute `hidden`, and the two other elements are inside it
