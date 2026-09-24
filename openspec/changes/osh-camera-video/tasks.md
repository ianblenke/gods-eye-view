## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md`: `osh-005`, `osh-072` and `osh-074` MODIFIED, and `osh-076` to `osh-089` ADDED.
  - The requirements "GET only" and "Live layer" keep their text. Keep the tests for `osh-004`, `osh-006` and `osh-073`.
- [x] 1.2 Write `proposal.md` with the Why, the What Changes, the Impact and the limits.
- [x] 1.3 Write `design.md` with D72 to D80.
- [x] 1.4 Write `tasks.md` from this list, with a mutation ledger under each test task.

## 2. The shared helper

Use only synthetic ids and bytes. No test calls a real server. Do not rename a test that exists on `main`.

- [ ] 2.1 Write the `[osh-083]` tests in the new file `src/data/oshVideo.test.mjs`.
  - The envelope: a good length field, a wrong one, and a message of less than 12 bytes.
  - The NAL split for three-byte and four-byte start codes, and for a trailing zero byte.
  - The codec string, the `avcC` record and the sample of slice NAL units.
- [ ] 2.2 Write `src/data/oshVideo.js` until 2.1 passes. It must not use the word `send`.
- [ ] 2.3 Run each mutation below on the helper.
  - H1: accept a length field that is not the size minus 12. `[osh-083]` fails.
  - H2: split at a start code of four bytes only. `[osh-083]` fails.
  - H3: leave the trailing zero byte in a NAL unit. `[osh-083]` fails.
  - H4: write the profile bytes in the wrong order in the codec string. `[osh-083]` fails.
  - H5: leave the length of the SPS or the PPS out of the `avcC` record. `[osh-083]` fails.
  - H6: put the SPS and the PPS into the sample. `[osh-083]` fails.
  - H7: write the length of a NAL unit in little-endian order. `[osh-083]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 3. The video datastream mark

- [ ] 3.1 Write the `[osh-076]` tests in `src/data/oshDatastreams.test.mjs`.
  - A `coverage` result with `RasterImage` gets `video: true`. Each other record has no `video` key.
- [ ] 3.2 Change `mapOshDatastreams()` in `src/data/oshDatastreams.js` until 3.1 passes.

## 4. The server

- [ ] 4.1 Write the `[osh-078]` tests in `src/data/oshIds.test.mjs` for `videoUrl()` and `assertVideoUrl()`.
- [ ] 4.2 Write the tests of `osh-077`, `osh-079`, `osh-080` and `osh-081` in `src/data/oshLive.test.mjs`.
  - Use the injected socket constructor and the injected timers of the hub tests.
  - `[osh-079]` a good message gives an event `frame`. A text message, a short message and a wrong length field give no event. A message of more than 2097152 bytes gives `unsupported`.
  - `[osh-080]` a late client gets `open` and the frames since the last key frame. A key frame starts the group again. A close or a failure empties it. A group of more than 2097152 bytes is dropped.
  - `[osh-081]` the live route and the video route of one id hold two entries and two sockets.
- [ ] 4.3 Change the test `[osh-005]` in `src/data/oshProxy.test.mjs` for six files. Keep its name and its tag.
- [ ] 4.4 Change the pinned OSH test file count and the file list of `[osh-034]` in `src/data/oshRepositoryHygiene.test.mjs`. Keep its name.
- [ ] 4.5 Add `videoUrl()` and `assertVideoUrl()` to `server/providers/osh/ids.js` until 4.1 passes.
- [ ] 4.6 Give the hub of `server/providers/osh/live.js` a video kind until 4.2 passes.
- [ ] 4.7 Add the route `/api/osh/video` to `server/providers/osh.js` with the checks of `osh-077`.
- [ ] 4.8 Run each mutation below on the server.
  - V1: skip the bad-id check on the video route. `[osh-077]` fails.
  - V2: let the keyless path open a socket on the video route. `[osh-077]` fails.
  - V3: accept a POST on the video route. `[osh-077]` fails.
  - V4: build `ws` for an `https` root. `[osh-078]` fails.
  - V5: build the video URL with the query of the live route. `[osh-078]` fails.
  - V6: relay a message whose length field is wrong. `[osh-079]` fails.
  - V7: relay a text message. `[osh-079]` fails.
  - V8: remove the size check of the video kind. `[osh-079]` fails.
  - V9: do not refuse the datastream after a message that is too large. `[osh-079]` fails.
  - V10: treat a NAL unit of type 1 as a key frame. `[osh-080]` fails.
  - V11: keep the group across a key frame. `[osh-080]` fails.
  - V12: keep the group after the socket closes. `[osh-080]` fails.
  - V13: remove the size limit of the group. `[osh-080]` fails.
  - V14: give the video entry and the live entry of one id the same key. `[osh-081]` fails.
  - V15: send an event `observation` to a client of the video route. `[osh-081]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 5. The browser player

- [ ] 5.1 Write the `[osh-082]` tests in `src/layers/osh/source.test.mjs` with a fake `EventSource`.
- [ ] 5.2 Add `openVideo()` to `src/layers/osh/source.js` until 5.1 passes.
- [ ] 5.3 Write the tests of `osh-084` and `osh-085` in the new file `src/layers/osh/videoPlayer.test.mjs`.
  - Use a fake `VideoDecoder`, a fake `EncodedVideoChunk` and a fake canvas. No test decodes real H.264.
  - Cover the wait for a key frame, the configure call, and the chunk types and time stamps.
  - Cover the draw and close of each frame, and the drop while the queue is long.
  - Cover the new configure for a new SPS, the reset after an error, and the missing decoder.
- [ ] 5.4 Write `src/layers/osh/videoPlayer.js` with `createVideoPlayer()` until 5.3 passes.
- [ ] 5.5 Run each mutation below on the source and the player.
  - P1: decode a delta frame before the first key frame. `[osh-084]` fails.
  - P2: configure the decoder with the wrong codec string. `[osh-084]` fails.
  - P3: give every chunk the type key. `[osh-084]` fails.
  - P4: use milliseconds for the time stamp. `[osh-084]` fails.
  - P5: draw a frame and not close it. `[osh-084]` fails.
  - P6: never drop a frame while the queue is long. `[osh-084]` fails.
  - P7: never configure again for a new SPS. `[osh-084]` fails.
  - P8: keep decoding after a decoder error. `[osh-084]` fails.
  - P9: use `VideoDecoder` without a check. `[osh-085]` fails.
  - P10: put a user name in the `EventSource` URL of `openVideo()`. `[osh-082]` fails.
  - P11: call `onFrame` for data that is not base64 text. `[osh-082]` fails.
  - P12: let an exception from `configure` leave the player. `[osh-084]` fails.
  - P13: let an exception from `decode` leave the player. `[osh-084]` fails.
  - A mutation that no test fails is a finding: add a test that fails for it.

## 6. The layer and the panel

- [ ] 6.1 Write the tests of `osh-086`, `osh-087`, `osh-072` and `osh-074` in `src/data/oshLayer.test.mjs`.
  - Register `t.after(() => layer.destroy(viewer))` in each test, and use a fake source, a fake view and a fake player.
- [ ] 6.2 Write the `[osh-088]` tests in `src/layers/osh/detail.test.mjs`.
- [ ] 6.3 Write the `[osh-089]` tests in `src/data/osh.test.mjs`.
- [ ] 6.4 Change `src/layers/osh/detail.js` until 6.2 passes.
- [ ] 6.5 Change `src/layers/osh/index.js` until 6.1 passes. A source with no `openVideo()` plays no video.
- [ ] 6.6 Change `src/data/osh.js` until 6.3 passes.
- [ ] 6.7 Add `src/data/oshVideo.js` and `src/layers/osh/videoPlayer.js` to `scripts/package-boundaries.json`.
- [ ] 6.8 Run each mutation below on the layer.
  - L1: show the panel with no selection. `[osh-086]` fails.
  - L2: leave the panel shown after the selection ends. `[osh-086]` fails.
  - L3: start no video stream for a video datastream. `[osh-087]` fails.
  - L4: start a video stream for a datastream with no `video` mark. `[osh-087]` fails.
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

- [ ] 7.1 Add the panel element and its two hosts to `index.html`.
- [ ] 7.2 Add the style of the panel to `style.css`.
  - Keep the panel clear of the other panels, and add its selector to the occluders of the world overlay.
- [ ] 7.3 Run the app and look at the panel with a selected camera. Report what you see.

## 8. Gates and review

- [ ] 8.1 Run `make lint` until no STE error remains.
- [ ] 8.2 Run `make ratchet CHANGE=osh-camera-video`.
- [ ] 8.3 Run `make gates CHANGE=osh-camera-video`. Confirm that each changed code file has full coverage.
- [ ] 8.4 Run `npm run format:check` and `npm run check:boundaries`.
- [ ] 8.5 Run `/opsx:review osh-camera-video`.
- [ ] 8.6 Correct the findings.
- [ ] 8.7 Record the result in `review.md`.
