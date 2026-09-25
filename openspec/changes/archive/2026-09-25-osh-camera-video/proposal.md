## Why

The OpenSensorHub server publishes live video from its cameras. Each video datastream gives H.264 video in the binary messages of a WebSocket. The map shows none of this today.

The OSH layer also has no detail panel. `src/data/osh.js` creates the layer with no host element, so the layer writes its detail to nothing. This includes the live rows of the change `osh-live-observations`.

This change adds a panel to the page. The panel shows the detail of the selected system, and it plays the live video of a camera. The server relays the video to the browser as server-sent events. The browser decodes it with WebCodecs and draws it on a canvas.

## What Changes

- Mark a video datastream with `video: true` in `mapOshDatastreams()`. The mark comes from the result type `coverage` and the observed property `RasterImage`, not from a name.
- Add `videoUrl()` and `assertVideoUrl()` to `server/providers/osh/ids.js`. `videoUrl()` builds the upstream WebSocket URL, as `liveUrl()` does, with the query `f` set to `application/swe+binary`. `assertVideoUrl()` checks that URL.
- Give the hub of `server/providers/osh/live.js` a video kind. It checks the size of each message, keeps the messages from the last key message on, and relays each message as an event `frame`.
- Add the route `GET /api/osh/video?datastream=<id>` to `server/providers/osh.js`. It has the checks of the live route.
- Limit the unwritten bytes of the response of each client of the live route and the video route. The route destroys the response of a client that has more than 8388608 unwritten bytes.
- Add `src/data/oshVideo.js`. It reads the parts of a video message, and the server and the browser both use it.
- Add `openVideo()` to the browser source.
- Add `src/layers/osh/videoPlayer.js`. It decodes the messages with WebCodecs onto a canvas, and it builds the view of the video.
- Change the layer. It shows the panel, plays the video of the selected system, and starts no live stream and no poll for a video datastream.
- Change `src/layers/osh/detail.js` to show a video datastream, add the panel to `index.html` and `style.css`, and find the panel hosts in `src/data/osh.js`.
- Add the requirements "Video datastreams", "Video relay", "Video player" and "Camera panel", with the scenarios `osh-076` to `osh-094`.
- Change the scenario `osh-005` for the new file count. Change `osh-072` and `osh-074` for the video datastream. The requirements "GET only" and "Live layer" keep their text.

## Impact

- Changed configuration: `scripts/package-boundaries.json` gets the two new modules. `index.html` and `style.css` get the panel.
- Changed code files: `server/providers/osh.js`, `server/providers/osh/live.js`, `server/providers/osh/ids.js`, `src/data/oshDatastreams.js`, `src/data/osh.js`, `src/layers/osh/index.js`, `src/layers/osh/source.js`, `src/layers/osh/detail.js` and `src/overlays/worldOverlay.js`. The last file gets one occluder selector.
- New code files: `src/data/oshVideo.js` and `src/layers/osh/videoPlayer.js`. The pinned count of `osh-005` changes from five files to six for `src/data/osh*.js`.
- Changed test files: `src/data/oshDatastreams.test.mjs`, `src/data/oshIds.test.mjs`, `src/data/oshLive.test.mjs`, `src/data/oshProxy.test.mjs`, `src/data/oshLayer.test.mjs`, `src/data/osh.test.mjs`, `src/layers/osh/source.test.mjs`, `src/layers/osh/detail.test.mjs`, `src/overlays/worldOverlay.test.mjs` and `src/data/oshRepositoryHygiene.test.mjs`.
- New test files: `src/data/oshVideo.test.mjs` and `src/layers/osh/videoPlayer.test.mjs`. The hygiene test pins the number of OSH test files, and the count changes from 15 to 17.
- No new request method, no request body and no new environment variable. The handshake is a GET request, and the provider sends no message frame.
- Gaps that this change opens or closes: none. Each new code file must have full coverage.
- The ratchet history has lines for `src/data/labelArbiter.js`: its uncovered branches went from 52 to 50 and back to 52 between runs. No file of this change touches `src/data/labelArbiter.js`. The history of `teardown-guard` shows the same flips, and the final count is 52, the count of `main`.

## Known limits and later changes

- `osh-video-one-per-selection`: the layer plays the first video datastream of the selected system. A system with two cameras shows one.
- `osh-video-h264-only`: the player decodes H.264 only. The data of another codec gives no key message that the player can use, so the status stays `waiting`. The status `unavailable` shows only after the event `unsupported`.
- `osh-video-secure-page`: WebCodecs exists only on a secure page, that is HTTPS or `localhost`. On another page the panel shows the status `unsupported`.
- `osh-video-no-audio`: the provider relays no audio, and the player plays none.
- `osh-video-view-only`: the provider only listens. It sends no command, so the panel cannot move a PTZ camera.
- `osh-video-live-only`: the panel shows the live stream only. It does not read the history of a datastream.
- `osh-video-base64`: the messages go through server-sent events as base64 text, which adds about one third to their size.
- `osh-video-connections`: the video stream uses one more browser connection. With the three live streams of `osh-live-observations`, four of about six connections are in use.
- `osh-video-no-decode-test`: no Node test decodes real H.264. The tests use a fake decoder. The real player ran once in a headless browser on a synthetic clip, and no test repeats that run. A person examines the real picture in the app.
- `osh-video-silent-upstream`: like the live route, the video hub has no timer for a socket that gives no data. The picture stops, and the status stays `live`.
- `osh-video-stale-after-reconnect`: when the upstream socket closes and opens again, the first messages can be delta messages. The player decodes them with the old state of the decoder until the next key message. The picture can look wrong for a short time.
- `osh-video-late-burst`: a late client gets its group in one burst. When the group has more than eight delta messages, the player ignores each later delta message. The picture waits for the next key message.
- `osh-video-status-after-refusal`: when the route answers with the HTTP status 502 or 503, the browser closes the stream and never opens it again. The panel then keeps the status `reconnecting`.
- `osh-panel-late`: for a system, the panel shows after the layer reads the datastreams of the system for the first time, and not at the click.
- `osh-panel-layout-unchecked`: no test checks the position of the panel on the page. A person checks the style by eye. Tests check the ids, the attribute `hidden`, the class `osh-panel` and which elements are inside `osh-panel`. Tests also check the rule for `hidden`, the occluder selector, and the placement of a label clear of the panel.
- `osh-occluder-visible`: the world overlay skips an element of the list that has the attribute `hidden` or that is not visible. `osh-093` does not say so. The effect is small, because a hidden panel has no rectangle.
- `osh-html-test-comments`: the `[osh-094]` test of `index.html` does not remove HTML comments, and it matches the class `osh-panel` as part of a longer name. A commented panel, or a class `osh-panel-old`, passes it.
