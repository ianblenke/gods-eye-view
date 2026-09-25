## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md`: `osh-005`, `osh-072` and `osh-074` MODIFIED, and `osh-076` to `osh-094` ADDED.
  - The requirements "GET only" and "Live layer" keep their text. Keep the tests for `osh-004`, `osh-006` and `osh-073`.
- [x] 1.2 Write `proposal.md` with the Why, the What Changes, the Impact and the limits.
- [x] 1.3 Write `design.md` with D72 to D81.
- [x] 1.4 Write `tasks.md` from this list, with a mutation ledger under each test task.

## 2. The shared helper

Use only synthetic ids and bytes. No test calls a real server. Do not rename a test that exists on `main`, and keep its tag.

- [x] 2.1 Write the `[osh-083]` tests in the new file `src/data/oshVideo.test.mjs`.
  - Cover the envelope: a good length field, a wrong one, a time stamp that is not finite, and a message of less than 12 bytes.
  - Cover the NAL split for start codes of three and four bytes, and for a zero byte at the end of a NAL unit.
  - Cover the type of a NAL unit, the codec string, the `avcC` record and the sample of slice NAL units.
- [x] 2.2 Write `src/data/oshVideo.js` until 2.1 passes. It must not use the word `send`.
- [x] 2.3 Run each mutation below on the helper.
  - H1: accept a length field that is not the size minus 12. `[osh-083]` fails.
  - H2: split at a start code of four bytes only. `[osh-083]` fails.
  - H3: leave a zero byte at the end of a NAL unit. `[osh-083]` fails.
  - H4: write the profile bytes in the wrong order in the codec string. `[osh-083]` fails.
  - H5: remove the length of the SPS or the PPS from the `avcC` record. `[osh-083]` fails.
  - H6: put the SPS and the PPS into the sample. `[osh-083]` fails.
  - H7: write the length of a NAL unit in little-endian order. `[osh-083]` fails.
  - H8: read the type of a NAL unit with a mask of four bits. `[osh-083]` fails.
  - H9: read the type of a NAL unit with a mask of six bits. `[osh-083]` fails.
  - H10: put a NAL unit of type 0 into the sample. `[osh-083]` fails.
  - H11: put a NAL unit of type 6 into the sample. `[osh-083]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 3. The video datastream mark

- [x] 3.1 Write the `[osh-076]` tests in `src/data/oshDatastreams.test.mjs`.
  - A `coverage` result with `RasterImage` gets `video: true`. Each other record has no `video` property.
- [x] 3.2 Change `mapOshDatastreams()` in `src/data/oshDatastreams.js` until 3.1 passes.

## 4. The server

- [x] 4.1 Write the `[osh-078]` tests in `src/data/oshIds.test.mjs` for `videoUrl()` and `assertVideoUrl()`.
- [x] 4.2 Write the tests of `osh-077`, `osh-079` to `osh-081`, `osh-090`, `osh-091` and `osh-092` in `src/data/oshLive.test.mjs`.
  - Use the injected socket constructor and the injected timers of the hub tests.
  - Cover `[osh-079]`: a good message gives an event `frame`. Each kind of bad message gives no event.
  - Cover `[osh-079]` with one loopback test that runs the real WebSocket and a message of 70000 bytes.
  - Cover `[osh-080]`: a late client gets `open` and the messages from the last key message on. A key message starts the group again.
  - Cover `[osh-081]`: the live route and the video route of one id have two entries and two sockets.
  - Cover `[osh-080]`: each video client gets `down` when the socket closes, and `open` when the new socket opens after the delays.
  - Cover `[osh-090]`: the provider destroys the response of a client with more than 8388608 unwritten bytes. The other clients keep their responses.
  - Cover `[osh-090]` with one real HTTP client that does not read, and one that reads.
- [x] 4.3 Change the test `[osh-005]` in `src/data/oshProxy.test.mjs` for six files.
- [x] 4.4 Change the pinned number of OSH test files and the file list of `[osh-034]` in `src/data/oshRepositoryHygiene.test.mjs`.
- [x] 4.5 Add `videoUrl()` and `assertVideoUrl()` to `server/providers/osh/ids.js` until 4.1 passes.
- [x] 4.6 Give the hub of `server/providers/osh/live.js` a video kind until 4.2 passes.
- [x] 4.7 Add the route `/api/osh/video` to `server/providers/osh.js` with the checks of `osh-077`.
- [x] 4.8 Destroy a response that has more than 8388608 unwritten bytes, in `server/providers/osh.js`.
- [x] 4.9 Run each mutation below on the server.
  - V1: skip the bad-id check on the video route. `[osh-077]` fails.
  - V2: let a request with no key open a socket on the video route. `[osh-077]` fails.
  - V3: accept a POST on the video route. `[osh-077]` fails.
  - V4: build `ws` for an `https` root. `[osh-078]` fails.
  - V5: build the video URL with the query of the live route. `[osh-078]` fails.
  - V6: relay a message whose length field is wrong. `[osh-079]` fails.
  - V7: relay a text message. `[osh-079]` fails.
  - V8: remove the size check of the video kind. `[osh-079]` fails.
  - V9: do not refuse the video route after a message that is too large. `[osh-079]` fails.
  - V10: treat a NAL unit of type 1 as a key message. `[osh-080]` fails.
  - V11: keep the group across a key message. `[osh-080]` fails.
  - V12: keep the group after the socket closes. `[osh-080]` fails.
  - V13: remove the size limit of the group. `[osh-080]` fails.
  - V14: give the video entry and the live entry of one id the same key. `[osh-081]` fails.
  - V15: write an event `observation` to a client of the video route. `[osh-081]` fails.
  - V16: remove the check of the unwritten bytes of a client. `[osh-090]` fails.
  - V17: destroy the response at exactly 8388608 unwritten bytes. `[osh-090]` fails.
  - V18: check the bytes and do not destroy the response. `[osh-090]` fails.
  - V19: write the message after the provider destroys the response. `[osh-090]` fails.
  - V20: change the limit to another value. `[osh-090]` fails.
  - V21: relay a text message that is a string of digits. `[osh-079]` fails.
  - V22: cut the size limit of a video message to 65536 bytes. `[osh-079]` fails.
  - V23: close the socket for a text message of more than 2097152 characters. `[osh-079]` fails.
  - V24: skip the event `down` for a video client. `[osh-080]` fails.
  - V25: give the second retry delay of the video entry the value of one second. `[osh-080]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 5. The browser player

- [x] 5.1 Write the `[osh-082]` tests in `src/layers/osh/source.test.mjs` with a fake `EventSource`.
- [x] 5.2 Add `openVideo()` to `src/layers/osh/source.js` until 5.1 passes.
- [x] 5.3 Write the tests of `osh-084` and `osh-085` in the new file `src/layers/osh/videoPlayer.test.mjs`.
  - Use a fake `VideoDecoder`, a fake `EncodedVideoChunk` and a fake canvas. No test decodes real H.264.
  - Cover how the player waits for a key message, calls `configure`, and sets the chunk types and the time stamps.
  - Cover how the player draws and closes each frame.
  - Cover the ignored delta messages: a queue of more than eight chunks starts them, and the next key message ends them.
  - Cover how the player configures again for a new SPS and resets after an error.
  - Cover the status `unsupported` on a page with no decoder class.
- [x] 5.4 Write `src/layers/osh/videoPlayer.js` with `createVideoPlayer()` until 5.3 passes.
- [x] 5.5 Run each mutation below on the source and the player.
  - P1: decode a delta message before the first key message. `[osh-084]` fails.
  - P2: configure the decoder with the wrong codec string. `[osh-084]` fails.
  - P3: give every chunk the type key. `[osh-084]` fails.
  - P4: use milliseconds for the time stamp. `[osh-084]` fails.
  - P5: draw a decoded frame and not close it. `[osh-084]` fails.
  - P6: never ignore a delta message when the decoder queue holds more than eight chunks. `[osh-084]` fails.
  - P7: never configure again for a new SPS. `[osh-084]` fails.
  - P8: do not reset the decoder after a decoder error. `[osh-084]` fails.
  - P9: use `VideoDecoder` without a check. `[osh-085]` fails.
  - P10: put a user name in the `EventSource` URL of `openVideo()`. `[osh-082]` fails.
  - P11: call `onFrame` for data that is not base64 text. `[osh-082]` fails.
  - P12: let an exception from `configure` leave the player. `[osh-084]` fails.
  - P13: let an exception from `decode` leave the player. `[osh-084]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 6. The layer and the panel

- [x] 6.1 Write the tests of `osh-086`, `osh-087`, `osh-072` and `osh-074` in `src/data/oshLayer.test.mjs`.
  - Register `t.after(() => layer.destroy(viewer))` in each test, and use a fake source, a fake view and a fake player.
- [x] 6.2 Write the `[osh-088]` tests in `src/layers/osh/detail.test.mjs`.
- [x] 6.3 Write the `[osh-089]` tests in `src/data/osh.test.mjs`.
- [x] 6.4 Change `src/layers/osh/detail.js` until 6.2 passes.
- [x] 6.5 Change `src/layers/osh/index.js` until 6.1 passes. A source with no `openVideo()` plays no video.
- [x] 6.6 Change `src/data/osh.js` until 6.3 passes.
- [x] 6.7 Add `src/data/oshVideo.js` and `src/layers/osh/videoPlayer.js` to `scripts/package-boundaries.json`.
- [x] 6.8 Write the `[osh-093]` test of the occluder selector in `src/overlays/worldOverlay.test.mjs`.
- [x] 6.9 Run each mutation below on the layer.
  - L1: show the panel with no selection. `[osh-086]` fails.
  - L2: leave the panel shown after the selection ends. `[osh-086]` fails.
  - L3: start no video stream for a video datastream. `[osh-087]` fails.
  - L4: start a video stream for a datastream with no `video: true`. `[osh-087]` fails.
  - L5: start two video streams for one selection. `[osh-087]` fails.
  - L6: leave the video stream open after a new selection. `[osh-087]` fails.
  - L7: leave the video stream open after `destroy()`. `[osh-087]` fails.
  - L8: leave the view in the panel after the selection ends. `[osh-087]` fails.
  - L9: ignore the event `unsupported`. `[osh-087]` fails.
  - L10: start a live stream for a video datastream. `[osh-072]` fails.
  - L11: poll a video datastream. `[osh-074]` fails.
  - L12: show `No data` for a video datastream. `[osh-088]` fails.
  - L13: use a wrong element id for the panel host. `[osh-089]` fails.
  - L14: start a video stream when the player reports `unsupported`. `[osh-087]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 7. The page

- [x] 7.1 Write the `[osh-094]` tests of `index.html` and `style.css` in `src/data/osh.test.mjs`.
- [x] 7.2 Add the panel element and its two hosts to `index.html`.
- [x] 7.3 Add the style of the panel to `style.css`.
  - The panel must not cover another panel on a window of 1060px or more.
- [x] 7.4 Add `#osh-panel` to the occluders in `src/overlays/worldOverlay.js`.
- [x] 7.5 Run each mutation below on the page and the world overlay.
  - L15: remove the attribute `hidden` from the panel in `index.html`. `[osh-094]` fails.
  - L16: rename the video host in `index.html`. `[osh-094]` fails.
  - L17: put the detail host outside the panel in `index.html`. `[osh-094]` fails.
  - L18: rename the panel in `index.html`. `[osh-094]` fails.
  - L19: remove `#osh-panel` from the occluders of the world overlay. `[osh-093]` fails.
  - L20: remove the rule `.osh-panel[hidden]` from `style.css`. `[osh-094]` fails.
  - L21: give the rule `.osh-panel[hidden]` the display `block`. `[osh-094]` fails.
  - L22: remove the class `osh-panel` from the panel in `index.html`. `[osh-094]` fails.
  - L23: replace the rule `.osh-panel[hidden]` with a comment. `[osh-094]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.
- [ ] 7.6 Run the app, select a camera, and report what the panel shows.

## 8. Gates and review

- [x] 8.1 Run `make lint` until no STE error remains.
- [x] 8.2 Run `make ratchet CHANGE=osh-camera-video`.
- [ ] 8.3 Run `make gates CHANGE=osh-camera-video`.
- [ ] 8.4 Confirm that each changed code file has full coverage.
- [ ] 8.5 Run `npm run format:check` and `npm run check:boundaries`.
- [ ] 8.6 Run `/opsx:review osh-camera-video`.
- [ ] 8.7 Correct the findings.
- [ ] 8.8 Record the result in `review.md`.
