## Context

The layer shows the position and the newest observations of a system. It shows no video, and it has no panel. `src/data/osh.js` builds the layer with no detail host, so the detail that the layer builds goes to nothing. The change `osh-live-observations` made the detail live, and it made no host for it.

A camera system has a video datastream. The list of datastreams marks it with the result type `coverage` and the observed property `RasterImage`. The server offers the datastream in the formats `application/om+json` and `application/swe+binary`. The observation route returns no observation for it, because a video image is not a set of rows.

The binary format has one message for each video image. A message has a time stamp of 8 bytes, a length of 4 bytes, and the H.264 data of that image. The time stamp is a double in seconds. The H.264 data is in the Annex B format: a start code comes before each NAL unit. A NAL unit is one block of H.264 data with a type. An SPS and a PPS are NAL units with the setup data of the decoder.

A key message is a message whose data has an IDR slice, which is a NAL unit of type 5. The decoder can decode an IDR slice with no earlier message. A key message from a camera normally also has an SPS and a PPS, but it does not have to. The player decodes nothing until a key message has both.

A delta message is a message that is not a key message. Its data normally has slices of type 1. An image can have several slices. The first message after a new connection can be a delta message.

Three rules of `main` limit the design. `osh-004` and `osh-005` say that the provider sends only GET requests and keeps one call site. `osh-007` and `osh-008` say that the credentials stay on the server. The rule of the repository says that no stream metadata of the owner's server appears in a file.

## Goals / Non-Goals

**Goals:**
- Show the live video of a selected camera in a panel.
- Show the detail of the selected system in the same panel.
- Keep the handshake a GET request, send no message frame, and keep the credentials on the server.

**Non-Goals:**
- Decode a codec other than H.264, or play audio.
- Send a command to the camera, such as a pan, tilt or zoom command.
- Show the video in the CCTV layer or on the globe.
- Read the history of a datastream.

## Decisions

### D72 The mark on a datastream

`mapOshDatastreams()` adds `video: true` to a record whose `resultType` is `coverage` and whose `observedProperties` include a name `RasterImage`. It reads each name as the last non-empty part of the `definition`, after a slash, a hash sign or a colon. So it does not depend on the host of a vocabulary. A record that is not a video datastream has no `video` property, so the tests of the other records keep their expected values.

The rule reads the type of the data and not a name. A datastream can have any output name.

### D73 One relay, a second kind of entry

The provider relays video with the same hub as the live observations. The hub keeps one entry for each datastream and each kind. A video entry and an observation entry of one datastream id are two entries. They have two upstream sockets, and both count toward the limit of eight datastreams. `videoUrl()` builds the upstream WebSocket URL of the datastream, as `liveUrl()` does, with the query `f` set to `application/swe+binary`.

The route is `GET /api/osh/video?datastream=<id>`. It has the checks and the headers of the live route. It reads no schema, because the video needs no reader. The hub opens the socket through `oshOpenStream()`, as it does for a live stream. So the handshake is a GET request. No scanned file uses the word `send` outside a comment (`osh-005`).

### D74 The events and the size limit

A video client gets the events `open`, `down` and `unsupported`, as a live client does. It also gets the event `frame` for each message. The data of a `frame` event is the base64 text of the whole message, as one JSON string. A browser reads server-sent events as text, and base64 adds about one third.

The hub ignores four kinds of message. The first kind is a text message. The second kind has less than 12 bytes. The third kind has a wrong length field. The fourth kind has a time stamp that is not a finite number. The length field is right when it equals the size minus 12.

A binary message of more than 2097152 bytes closes the socket. The clients get `unsupported`, and the provider refuses the video route for that datastream for ten minutes, as it does for a live stream. The limit is larger than the limit of the live route, because a key message is larger than an observation.

### D75 The message group for a late client

A client can join a stream at any time. The first message that it gets can be a delta message. The player cannot decode such a message. So the hub keeps the messages from the last key message on, and it gives them to a client that joins. That key message is the first message of the group. A key message starts the group again.

A message is a key message when its H.264 data has a NAL unit of type 5. The hub reads the type with the helper of `src/data/oshVideo.js`. The hub empties the group when the socket closes or fails. The hub empties a group of more than 2097152 bytes, and it keeps no group until the next key message.

### D76 One helper for the server and the browser

`src/data/oshVideo.js`, the helper, is a pure module with no DOM and no network call. It reads the envelope of a message and splits H.264 data into NAL units. The envelope is the time stamp and the length field. The helper builds the codec string and the `avcC` record, and it builds one sample from the slice NAL units. The hub uses the envelope and the NAL types. The player uses all of the functions.

The file is in `src/data/osh*.js`, so the scan of `osh-005` covers it. The pinned count of that set changes from five files to six.

### D77 The player

`createVideoPlayer()` in `src/layers/osh/videoPlayer.js` takes a canvas. It also takes the classes `VideoDecoder` and `EncodedVideoChunk`. It waits for a key message with an SPS and a PPS. Then it configures the decoder with the codec string and the `avcC` record.

The player converts each message to one sample. Each slice has its length in four bytes, most significant byte first, before it. The player makes one chunk, an `EncodedVideoChunk`, from the sample of each message. The chunk is a key chunk or a delta chunk. The time stamp of a chunk is in microseconds after the time stamp of the first decoded message.

The decoder calls back with a decoded frame. The player sets the size of the canvas, draws the frame, closes it, and reports the status `live`. When the decoder queue holds more than eight chunks, the player ignores each delta message until the next key message. A later delta message would refer to a delta message that the decoder never got.

A key message with a PPS and a new SPS starts a new configuration. After a decoder error the player reports the status `error` and then `waiting`. It resets the decoder and waits for a key message. An exception from `configure`, from `decode` or from the constructor of the decoder is a decoder error too.

A page that is not secure has no `VideoDecoder`. The player then decodes nothing and reports the status `unsupported`. The classes are options, so the tests use fakes, and the real decoder runs only in a browser.

### D78 The panel and the layer

The layer has three new options: the panel host, the detail host and the video host. `src/data/osh.js` finds them by the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`. It uses none when the page has no document.

The layer shows the panel host while it has a detail for the selection, and it hides the panel host when the selection ends. For a system, the detail comes after the layer reads the datastreams of the system for the first time. The video host is a separate element from the detail host. The layer writes the detail as HTML again at each change, and that would remove a canvas.

The layer creates one video view and one player for the first datastream with `video: true`. It closes them when the selection ends, as it closes a live stream. When the player reports `unsupported`, the layer starts no video stream, because the browser cannot show the picture.

A video datastream gets no live stream and no poll. It does not count toward the limit of three live streams. The block of the detail shows its name and the word `Video`.

### D79 The page

`index.html` gets one panel element with two hosts. `style.css` docks the panel left of the right rail and right of the left stack. On a window narrower than 1060px the panel can cover the edge of an open left panel. The world overlay treats the panel as an occluder: it places each label or card clear of the panel when it can.

Tests check the ids, the attribute `hidden`, the class `osh-panel` and the elements inside `osh-panel` in `index.html`. Tests also check the rule for `hidden` in `style.css`, the occluder selector, and the placement of a label clear of the panel. No test checks the position of the panel on the page. A person examines the panel in a browser and reports the status and the picture.

### D80 How the gates measure this change

Coverage: each new and changed code file stays at 100% line, branch and function coverage. The DOM code takes the document and the element factory as options, and the tests use small fakes. Trace: `osh-076` to `osh-094` tag new tests. The scenarios `osh-005`, `osh-072` and `osh-074` have a changed test with their tag.

The server tests use the injected socket constructor and timers of the hub tests. One loopback test runs the real WebSocket. The player tests use a fake decoder. Every mutation in `tasks.md` names the test that must fail.

### D81 The unwritten data of a client

A client that does not read makes Node keep every message of its response in memory. A video message can have up to 2097152 bytes. So the route reads `writableLength` of the response at each write. When the response has more than 8388608 unwritten bytes, the route destroys it, and the hub removes the client.

The browser opens the stream again and gets the group of messages. The limit is four times the limit of a group. The live route has the same check, because the two routes use one write function.

## Risks / Trade-offs

- **The real decoder is not tested.** Accepted, and named as `osh-video-no-decode-test`. A person examines the picture in a browser.
- **A secure page is a condition.** Accepted, and named as `osh-video-secure-page`. The app runs on `localhost` in the normal way.
- **The video needs one more connection.** Accepted, and named as `osh-video-connections`. Only one video stream runs for a selection.
- **The hub keeps up to two megabytes of messages for each video stream.** The hub counts binary bytes, but it stores each message as base64 text, which is one third larger. At most eight entries exist, so the worst case is about twenty-two megabytes.

## Migration Plan

None. The route and the panel are new. A source without `openVideo()` plays no video, and the page without the panel elements shows no panel.

## Open Questions

None.
