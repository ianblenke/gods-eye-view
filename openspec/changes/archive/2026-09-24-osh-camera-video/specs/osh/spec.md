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
- **AND** the adapter reads each name from the last path segment of the `definition` of an observed property
- **AND** any other record has no `video` key

### Requirement: Video relay
The provider MUST relay the video of one datastream as server-sent events, from one upstream WebSocket. The handshake MUST be a GET, and the provider MUST send no message frame to the server.
Origin: spec-first

#### Scenario: Refuse the video route with no key, a bad id or a wrong method `osh-077`
- **WHEN** a client requests `/api/osh/video` with no key set, with a bad `datastream` value, or with a method other than GET
- **THEN** the answer is `503` with `{error:'no_key'}` for no key, and `400` with `{error:'bad_datastream'}` for a bad id
- **AND** the answer is `405` with the header `Allow: GET` for a wrong method
- **AND** in each of the three cases the provider opens no upstream socket

#### Scenario: Build the video URL to its fixed shape `osh-078`
- **WHEN** the provider builds the video URL for a datastream id and a resolved root
- **THEN** the URL has the scheme `ws` for an `http` root and `wss` for an `https` root
- **AND** the URL has the host and the port of the root, and the path `datastreams/<id>/observations`
- **AND** the URL has the query `f` with the value `application/swe+binary`, written as `application%2Fswe%2Bbinary`
- **AND** the URL has no user name and no password, and this holds when the root has them
- **AND** `assertVideoUrl()` throws for another scheme, host, port, path, query, user name, password or fragment

#### Scenario: Relay each video message as a frame event `osh-079`
- **WHEN** the upstream socket delivers a binary message of at least 12 bytes whose length field equals its size minus 12
- **THEN** the client receives an event `frame`, and its data is the base64 text of the whole message, as one JSON string
- **AND** a text message gives no event
- **AND** a message of less than 12 bytes gives no event
- **AND** a message whose length field does not equal its size minus 12 gives no event
- **AND** a message of more than 2097152 bytes closes the upstream socket, and the client receives the event `unsupported`
- **AND** the provider ends the response of each client of that datastream, and it refuses the datastream for ten minutes with `503` and `{error:'live_unsupported'}`

#### Scenario: Replay the current frame group to a late client `osh-080`
- **WHEN** a client joins a video stream that already holds frames
- **THEN** the client receives the event `open`, and then each frame since the last key frame, in order
- **AND** a frame is a key frame when its H.264 data holds a NAL unit of type 5
- **AND** the stored group starts again at each key frame, and it is empty when the upstream socket closes or fails
- **AND** a group of more than 2097152 bytes is dropped, and the stream then holds no group until the next key frame

#### Scenario: Keep the video stream apart from the live stream `osh-081`
- **WHEN** clients open the live route and the video route for one datastream id
- **THEN** the hub holds two entries and opens two upstream sockets, one for each URL
- **AND** each entry counts toward the limit of eight datastreams
- **AND** a client of the video route gets no event `observation`, and a client of the live route gets no event `frame`

### Requirement: Video player
The browser MUST decode the video frames of one camera onto a canvas, and MUST show when it cannot.
Origin: spec-first

#### Scenario: Open the video stream from the browser source `osh-082`
- **WHEN** the browser source opens a video stream for a datastream id, and later closes it
- **THEN** it creates one `EventSource` for the same-origin path `/api/osh/video?datastream=<id>`, with no credentials in the URL
- **AND** it calls `onFrame` with the bytes of the base64 text of each `frame` event
- **AND** it calls its other callbacks for the events `open`, `down` and `unsupported`, and for the `error` event of the `EventSource`, as `osh-071` says
- **AND** a `frame` event whose data is not one JSON string of base64 text calls no callback
- **AND** `close()` closes the `EventSource`

#### Scenario: Read the parts of a video message `osh-083`
- **WHEN** the reader gets the bytes of a video message
- **THEN** it returns the time stamp and the H.264 data when the length field equals the size minus 12, and null in every other case
- **AND** it splits the H.264 data into NAL units at each start code of three or four bytes
- **AND** it builds the codec string `avc1.` and the three bytes after the NAL header of the SPS, in hexadecimal
- **AND** it builds the `avcC` record from the SPS and the PPS
- **AND** it builds one sample from the slice NAL units of types 1 to 5, each with a length of four bytes before it

#### Scenario: Decode the frames onto a canvas `osh-084`
- **WHEN** the player gets the messages of a video stream
- **THEN** it decodes nothing until a key frame with an SPS and a PPS arrives
- **AND** it reports the status `waiting` until then
- **AND** it configures the decoder with the codec string and the `avcC` record of that key frame
- **AND** it decodes each later message as a key chunk or a delta chunk, with the time stamp in microseconds from the first message
- **AND** it draws each decoded frame on the canvas, closes the frame, and reports the status `live`
- **AND** it drops delta frames while the queue of the decoder holds more than eight frames, until the next key frame
- **AND** it configures the decoder again when the SPS changes, and it resets the decoder and waits for a key frame after a decoder error
- **AND** it treats an exception from `configure` or `decode`, or from the constructor of the decoder, as a decoder error

#### Scenario: Show when the browser cannot decode `osh-085`
- **WHEN** the browser has no `VideoDecoder` or no `EncodedVideoChunk`
- **THEN** the player decodes nothing and reports the status `unsupported`

### Requirement: Camera panel
The layer MUST show the detail and the video of the selected system in a panel, and MUST hide the panel when the selection ends.
Origin: spec-first

#### Scenario: Show and hide the panel with the selection `osh-086`
- **WHEN** the user selects a system or a feature, and later selects nothing
- **THEN** the panel host is shown while a selection exists, and the detail host holds the detail of the selection
- **AND** the panel host is hidden, and the detail host is empty, when the selection ends

#### Scenario: Play the video of the selected system `osh-087`
- **WHEN** the datastreams of the selected system hold a datastream with `video: true`
- **THEN** the layer starts one video stream for the first such datastream, and it creates one video view and one player
- **AND** the layer passes each frame of the stream to the player
- **AND** the view shows the name of the datastream and the status of the player
- **AND** a new selection, a click on empty space and `destroy()` each close the video stream and the player, and remove the view
- **AND** the event `down` shows the status `reconnecting`, and the event `unsupported` shows the status `unavailable` and closes the stream
- **AND** the layer starts no video stream when the player reports the status `unsupported`

#### Scenario: Show a video datastream in the detail `osh-088`
- **WHEN** the detail holds a datastream with `video: true`
- **THEN** its block shows the name and the word `Video`, and it shows no row `No data`

#### Scenario: Find the hosts of the panel `osh-089`
- **WHEN** the default layer looks for its hosts in a page
- **THEN** it uses the elements with the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`
- **AND** it uses no host when there is no document, or when an element is missing
