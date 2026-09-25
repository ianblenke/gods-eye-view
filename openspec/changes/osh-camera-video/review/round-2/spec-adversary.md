Verdict: PASS

The round-1 findings are corrected or named as limits. I found no critical or major finding. Nine minor findings stay open. The author can fix them or record them by name at round 3.

Findings:
- [ ] F1 (minor) Ledger drift on a file the change does not touch: `/home/ianblenke/docker/gev-video/openspec/trace/gaps.json:2659` now holds `src/data/labelArbiter.js` at branches 50 and totals 405. Main holds 52 and 407. `history.jsonl:616-617` record "smaller" for it under `osh-camera-video`. No test in the change explains this entry, and the proposal says the change closes no gap. The V8 drift of that file is the cause. The earlier change `osh-draw-unheld-features` kept this entry equal to main (its `review.md:33`). Fix: restore the entry to 52 and 407 and delete `history.jsonl:616-617`, editing the JSON as text. Or name the drift in the proposal Impact.
- [ ] F2 (minor) Three `osh-084` lines do not match the code and tests at their edges, in `/home/ianblenke/docker/gev-video/openspec/changes/archive/2026-09-25-osh-camera-video/specs/osh/spec.md:157-161`, and the same lines in `/home/ianblenke/docker/gev-video/openspec/specs/osh/spec.md`.
  - "it configures the decoder again when the SPS changes" is unconditional. The code (`videoPlayer.js:109`) needs a PPS in the same key message. The test at `videoPlayer.test.mjs:372` asserts no new configuration for a changed SPS with no PPS.
  - "it sets the size of the canvas from a decoded frame" is stated for every frame. The test at `videoPlayer.test.mjs:247` asserts that a frame of the same size leaves the canvas alone.
  - Three behaviours have tests but no line. A message that is not good, or has no slice, gives no chunk (tests at :158, :226 and :324). The time stamp of a chunk is rounded to whole microseconds (:207).
  - Fix: add the conditions to the scenario lines.
- [ ] F3 (minor) `osh-079` line 99 says "a message of more than 2097152 bytes closes the upstream socket". `live.js:187` returns for any text message before it checks the size. A text message of 3 MB gives no event and the socket stays open. The size test uses only binary messages. Fix: write "a binary message of more than 2097152 bytes" and add a test for a large text message. Or change the code.
- [ ] F4 (minor) The wording of the new scenario `osh-091` is wrong in one place and loose in another (delta spec.md:73-79).
  - "its option `binaryType`": `binaryType` is a property of the socket (`get.js:125`). `osh-004` says the option object has only `headers`. Write "the property `binaryType` of the socket".
  - The WHEN names a good request with a key. Two AND lines then set other conditions: no root answers, and eight datastreams open. Fix: give each of those its own WHEN.
- [ ] F5 (minor) Round-1 F12 is only partly corrected. Some behaviour has a test and code but no scenario line.
  - `createVideoView` shows `Video` when the name is empty (`videoPlayer.js:174`, test :665).
  - The event `open` restores the last player status (`index.js:308`, `oshLayer.test.mjs:3573`).
  - No video stream starts when the source has no `openVideo()` or the page has no video host (tests at :3460 and :3475).
  - Design D74 says a video client gets `down`, and the retry timers run for it. No video test in `oshLive.test.mjs` asserts a `down` event. A change that skips the `down` broadcast for the video kind fails no test.
  - Fix: add AND lines, or add a video test for `down`.
- [ ] F6 (minor) The `osh-090` tests use a fake response. `bufferedRes()` (`oshLive.test.mjs:2056`) sets `writableLength` itself and makes `destroy()` emit `close` at once. No test uses a real HTTP response that lags. Real Node `destroy()` emits `close` later. The earlier limit `osh-live-memory` is only partly closed and is not named. Fix: add a known limit for this, or one test with a real client that does not read.
- [ ] F7 (minor) Round-1 wording findings are not fully corrected, and one regression exists. `skeptics.md:4` says "the test names now say so" for S2, but they do not.
  - `proposal.md:44` says "The lead ran the real player". S25 asked to remove that undefined role, and the claim has no record in the repository.
  - `design.md:84` still says "clear of" (S19).
  - `live.js:33` still says "key picture" (S1).
  - Old words remain in test names, and `videoPlayer.test.mjs:288` still says "eight frames" (S2):
    - `videoPlayer.test.mjs:288` and `:299` ("drops", "eight frames", "keeps the drop")
    - `videoPlayer.test.mjs:197` ("from the first message")
    - `videoPlayer.test.mjs:215` and `:226` ("dropped", "drops")
    - `oshLive.test.mjs:1466` ("each frame since the last key message", S9)
  - Fix: use the words of the corrected spec.
- [ ] F8 (minor) Task order is wrong in `tasks.md`.
  - Task 6.6 says "until 6.3 passes", but 6.3 has the `index.html` test, and 7.1 makes that panel later.
  - Task 6.9 holds L15 to L19, which need 7.1 and 7.3 first.
  - Fix: move 6.9 after 7.3, and say in 6.6 which tests it needs.
- [ ] F9 (minor) `style.css:37` sets `display: flex` on `.osh-panel`, and that overrides the `hidden` attribute. Only `.osh-panel[hidden] { display: none }` (`style.css:65-67`) makes the hide of `osh-086` work. No test reads this rule. Deleting it leaves every test green and the empty panel always visible. The limit `osh-panel-layout-unchecked` names "place" and "style" only. Fix: name this rule in that limit, or add a test that reads `style.css`.

Checked (Read, Grep and Glob only; repository root `/home/ianblenke/docker/gev-video`):
- **Round-1 findings.** I compared all 14 findings of the spec adversary and all 27 of the STE adversary with the current tree.
  - F1 to F4 and S1 to S7 are corrected in the spec, the design, the proposal and the code.
  - F5, F6, F7 and F14 got tests, and F8 and F13 are corrected.
  - F9 to F11 are true known limits.
  - The named tests for the H8 to H11 and V21 changes fail when their code breaks.
- **`osh-090`.** The tests cover the exact limit (8388608 stays, 8388609 is destroyed), both routes, removal by the hub, the other client, and the open socket. I read V16 to V20 against them.
- **`osh-091`.** Each THEN and AND has a test in `oshLive.test.mjs` that fails when the code breaks. V22 fails on the loopback test with a message of 70000 bytes.
- **Base text.**
  - The requirements "GET only" and "Live layer" keep their text.
  - All base scenarios are carried. Only the count line of `osh-005` changes.
  - The synced spec has 115 scenarios and requirements against 95 on main. The difference is exactly 16 scenarios and 4 requirements.
  - I read the synced added section and it matches the delta.
- **Trace and counts.**
  - `links.json` has all new and renamed test names, 20 of 20 spot checks.
  - `ids.json` has `osh-090` and `osh-091`.
  - `history.jsonl:614-618` all name this change. The `worldOverlay.js` hashes chain, and its uncovered counts are unchanged.
  - The pinned counts are 5 and 6 for `osh-005`, and 17 OSH test files.
  - `retired-ids.json` is untouched.
- **Constraints.**
  - I found no `send` outside a comment in the scanned files.
  - I found no non-GET method, no network call, and no real host or stream metadata.
  - The new tests start no child process and write no result files.
  - I did not check the `.env` constraint against the whole repository.
- **STE by grep.** I found no passive form, no `-ing` warning, no banned word, and no sentence over 25 words in the new prose. The longest sub-bullet has exactly 25 words.

Could not check:
- I could not run code, lint, format, the mutations, or the gates after the archive. I know only that lint has 0 errors, and I did not see its warnings.
- I could not see the `npm run format:check` result for `style.css`. `format-scope.json` lists it.
- I could not check real Node behaviour of `writableLength` and `destroy()`, or the headless Chrome run and the panel look.
- The real VideoDecoder is a known limit and not a finding.
- Task 7.4 is still open.
