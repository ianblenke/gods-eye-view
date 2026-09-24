## Context

The layer shows the position and the newest observations of a system. It shows no video, and it has no panel. `src/data/osh.js` builds the layer with no detail host, so the detail that the layer builds goes to nothing. The change `osh-live-observations` made the detail live, and it made no host for it.

A camera system has a video datastream. The list of datastreams marks it with the result type `coverage` and the observed property `RasterImage`. The server offers the datastream in the formats `application/om+json` and `application/swe+binary`. The observation route returns no observation for it, because a picture is not a set of rows.

The binary format has one message for each picture. A message has a time stamp of 8 bytes, a length of 4 bytes, and the H.264 data of the picture in Annex B framing. The data of a key message holds an SPS, a PPS and the slices of an IDR picture. The data of another message holds slices of type 1. A picture can have several slices. The first message after a new connection can be a message that is not a key message.

Three rules of `main` limit the design. `osh-004` and `osh-005` say that the provider sends only GET requests and keeps one call site. `osh-007` and `osh-008` say that the credentials stay on the server. The rule of the repository says that no stream metadata of the owner's server appears in a file.

## Goals / Non-Goals

**Goals:**
- Show the live video of a selected camera in a panel.
- Show the detail of the selected system in the same panel.
- Keep the handshake a GET request, send no message frame, and keep the credentials on the server.

**Non-Goals:**
- Decode a codec other than H.264, or play audio.
- Send a command to the camera, such as a move of the PTZ.
- Show the video in the CCTV layer or on the globe.
- Read the history of a datastream.

## Decisions

### D72 The mark on a datastream

`mapOshDatastreams()` adds `video: true` to a record whose `resultType` is `coverage` and whose `observedProperties` include a name `RasterImage`. It reads the name from the last path segment of the `definition`, so it does not depend on the host of a vocabulary. A record that is not a video datastream has no `video` key, so the tests of the other records keep their expected values.

The rule reads the type of the data and not a name. A datastream can have any output name.

### D73 One relay, a second kind of entry

The provider relays video with the same hub as the live observations. The hub keeps one entry for each datastream and each kind. A video entry and an observation entry of one datastream id are two entries. They have two upstream sockets, and both count toward the limit of eight datastreams. The video URL is the live URL with another query. The query `f` has the value `application/swe+binary`.

The route is `GET /api/osh/video?datastream=<id>`. It has the checks and the headers of the live route. It reads no schema, because the video needs no reader. The hub opens the socket through `oshOpenStream()`, as it does for a live stream. So the handshake is a GET request. No file uses the word `send`.

### D74 The events and the size limit

A video client gets the events `open`, `down` and `unsupported`, as a live client does. It also gets the event `frame` for each message. The data of a `frame` event is the base64 text of the whole message, as one JSON string. A browser reads server-sent events as text, and base64 adds about one third. The hub drops three kinds of message: a text message, a message of less than 12 bytes, and a message with a wrong length field. The length field is right when it equals the size minus 12.

A message of more than 2097152 bytes closes the socket. The clients get `unsupported`, and the route refuses the datastream for ten minutes, as it does for a live stream. The limit is larger than the limit of the live route, because a key picture is larger than an observation.

### D75 The frame group for a late client

A client can join a stream at any time. The first message that it gets can be a message that is not a key message. The player cannot decode such a message. So the hub keeps the messages since the last key message, and it gives them to a client that joins. A key message starts the group again. A close or a failure of the socket empties the group.

A message is a key message when its H.264 data holds a NAL unit of type 5. The hub reads the type with the helper of `src/data/oshVideo.js`. A group of more than 2097152 bytes is dropped, and the stream holds no group until the next key message.

### D76 One helper for the server and the browser

`src/data/oshVideo.js` is a pure module with no DOM and no network call. It reads the envelope of a message and splits H.264 data into NAL units. It builds the codec string and the `avcC` record. It builds one sample from the slice NAL units. The hub uses the envelope and the NAL types. The player uses all of the functions.

The file is in `src/data/osh*.js`, so the scan of `osh-005` covers it. The pinned count of that set changes from five files to six.

### D77 The player

`createVideoPlayer()` in `src/layers/osh/videoPlayer.js` takes a canvas. It also takes the classes `VideoDecoder` and `EncodedVideoChunk`. It waits for a key message with an SPS and a PPS. Then it configures the decoder with the codec string and the `avcC` record.

The player converts each message to one sample, with a length of four bytes before each slice. It gives the decoder a key chunk or a delta chunk. The time stamp is in microseconds from the first message.

The decoder calls back with a frame. The player draws the frame on the canvas, closes it, and reports the status `live`. It drops delta messages while the queue of the decoder holds more than eight frames, until the next key message. A new SPS starts a new configuration. A decoder error resets the decoder, and the player waits for a key message.

A page that is not secure has no `VideoDecoder`. The player then decodes nothing and reports the status `unsupported`. The classes are options, so the tests use fakes, and the real decoder runs only in a browser.

### D78 The panel and the layer

The layer has three new options: the panel host, the detail host and the video host. `src/data/osh.js` finds them by the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`. It uses none when the page has no document.

The panel host shows while a selection exists, and it hides when the selection ends. The video host is apart from the detail host. The layer writes the detail as HTML again at each change, and that would remove a canvas. The layer creates one video view and one player for the first datastream with `video: true`. It closes them when the selection ends, as it closes a live stream.

A video datastream gets no live stream and no poll. It does not count toward the limit of three live streams. The block of the detail shows its name and the word `Video`.

### D79 The page

`index.html` gets one panel element with two hosts. `style.css` docks the panel at the right of the globe, clear of the other panels, and the world overlay treats it as an occluder. No test checks the place of the panel. The lead looks at it in a browser and reports what it shows.

### D80 How the gates measure this change

Coverage: each new and changed code file stays at 100% line, branch and function coverage. The DOM code takes the document and the element factory as options, and the tests use small fakes. Trace: `osh-076` to `osh-089` tag new tests. The scenarios `osh-005`, `osh-072` and `osh-074` have a changed test with their tag.

The server tests use the injected socket constructor and timers of the hub tests. The player tests use a fake decoder. Every mutation in `tasks.md` names the test that must fail.

## Risks / Trade-offs

- **The real decoder is not tested.** Accepted, and named as `osh-video-no-decode-test`. The lead checks the picture in a browser.
- **A secure page is a condition.** Accepted, and named as `osh-video-secure-page`. The app runs on `localhost` in the normal way.
- **The video holds one more connection.** Accepted, and named as `osh-video-connections`. Only one video stream runs for a selection.
- **The hub holds up to two megabytes of frames for each video stream.** Accepted. At most eight entries exist, so the worst case is sixteen megabytes.

## Migration Plan

None. The route and the panel are new. A source without `openVideo()` plays no video, and the page without the panel elements shows no panel.

## Open Questions

None.
