No skeptic agent ran in round 1. The lead checked each major finding against the code and the text. Result for each finding:

- S1 (major) confirmed. The spec says `key frame`, and the design and the code say `key message`. Corrected in every file: `key message`, `delta message`, `chunk` and `decoded frame`.
- S2 (major) confirmed. `decodeQueueSize` counts chunks, and the code ignores each delta message until the next key message. The spec, the design, the tasks and the test names now say so.
- S3 (major) confirmed. `originMs` is the time stamp of the first decoded message. The spec and the design now say so.
- S4 and F4 (major) confirmed. `readOshVideoMessage()` returns null for a time stamp that is not finite, and the hub relays nothing then. `osh-079`, `osh-083` and D74 now name the four kinds of message.
- S5 (major) confirmed. `isVideoEntry()` cuts a definition at a slash, a hash sign or a colon. `osh-076` and D72 now say so.
- S6 (major) confirmed. The layer shows `unavailable` only after the event `unsupported`. After a decoder error the status is `error` and then `waiting`, and the data of another codec keeps the status `waiting`. The proposal is corrected.
- S7 (major) confirmed. `writeDetail()` sets `hidden` from the detail, and a system gets its detail after the first read of its datastreams. `osh-086`, D78 and the two comments now say so, and the known limit `osh-panel-late` names the delay.
- F1 (major) confirmed. The route ignored the result of `res.write()` and `res.writableLength`. New scenario `osh-090`, decision D81, the constant `OSH_LIVE_MAX_CLIENT_BUFFER_BYTES` and the tests `[osh-090]`. Mutations V16 to V20 fail those tests.
- F2 (major) confirmed. New `[osh-089]` test that reads `index.html`, and mutations L15 to L18.
- F3 (major) confirmed. `osh-086` has a new line for the occluder, a new `[osh-086]` test in `worldOverlay.test.mjs`, mutation L19, and the proposal lists the file.
- Minor findings: corrected where the text or the code was wrong, or named as a known limit in the proposal (`osh-video-stale-after-reconnect`, `osh-video-late-burst`, `osh-video-status-after-refusal`, `osh-panel-late`). F5, F6, F7 and F14 got tests: a string of digits as a text message (V21), the NAL type mask and the type 0 unit (H8 to H11), `videoPlayer.js` in the scanned files, and a loopback test with the real WebSocket (V22). The good-request tests of the video route now have the new scenario `osh-091`.
