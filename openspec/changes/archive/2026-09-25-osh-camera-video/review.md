# Review: osh-camera-video

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-25
Gates: make gates CHANGE=osh-camera-video passed
Rounds: 4
Scope: diff e0c8b7f
Reviewed-Tree: 08048edd21e5185711665ea685b00e90227230c9252ae4e3cc3e23a012f8480d

## Findings

- [x] Round 1 spec-adversary F1 to F4 (major): a client that does not read grew an unbounded write buffer (new scenario `osh-090`, decision D81, the limit of 8388608 unwritten bytes); nothing checked the markup of the panel (new `index.html` test); the occluder line had no scenario and no test (new scenario and tests); the spec, the code and the tests disagreed about a time stamp that is not finite (`osh-079`, `osh-083`, D74). All corrected with mutations that fail the new tests.
- [x] Round 1 ste-adversary S1 to S7 (major): `key frame` and `key message` for one thing, a drop rule with two readings, the origin of the time stamp, the four kinds of message that the hub ignores, the rule for the name of the video mark, the status in a known limit, and the condition that shows the panel. All corrected in the spec, the design, the proposal, the tasks and the test names. The lead checked each finding against the code (`review/round-1/skeptics.md`).
- [x] Round 1 minor findings (spec F5 to F14, STE S8 to S27): corrected, or named as known limits (`osh-video-stale-after-reconnect`, `osh-video-late-burst`, `osh-video-status-after-refusal`, `osh-panel-late`). The new tests are a string of digits as a text message, the NAL type mask, `videoPlayer.js` in the scanned files, and a loopback test with the real WebSocket for a video message.
- [x] Round 2 ste-adversary S1 to S3 (major): two definitions of `key message`, a wrong `live_busy` line in `osh-091` (now the scenario `osh-092` with a WHEN for each case), and a test name that still said `frames` for chunks. All corrected.
- [x] Round 2 spec-adversary F1 to F9 and ste-adversary S4 to S21 (minor): corrected. The main points are the conditions of `osh-084`, a text message of any size, a test with a real HTTP client that does not read, the events `down` and `open` of the video entry, the word `destroy` for the response, and the scenarios `osh-093` and `osh-094`. The drift of the ledger for `src/data/labelArbiter.js` is named in the proposal.
- [x] Round 3 spec-adversary F1 and ste-adversary S1 (major): the text of `osh-093` and D79 said that the world overlay hides an entry under the panel. The code places a label or a card clear of the panel when it can. Both texts now say so, and a new `[osh-093]` test uses the shipped `.osh-panel` stacking and checks the placement. Corrected.
- [x] Round 3 minor findings (spec F2 to F8, STE S2 to S13): corrected. The main points are the WHEN of `osh-092` and `osh-080`, a read boundary in the real-client test, the check of the class `osh-panel` and the comment strip in the style test, the second retry delay of the video entry, the word `valid`, and the order of the page tasks.
- [x] Round 4 spec-adversary F1 (minor): the world overlay skips an element of the list that is hidden. Named as the known limit `osh-occluder-visible`.
- [x] Round 4 spec-adversary F2 (minor): the `[osh-094]` test of `index.html` keeps HTML comments, and it matches the class as part of a longer name. Named as the known limit `osh-html-test-comments`.
- [x] Round 4 spec-adversary F3 and F4 (minor): the tasks name both `[osh-093]` tests and use the word `valid`. Corrected in `tasks.md`, `proposal.md` and `design.md`.
- [x] Round 4 spec-adversary F5 (minor): this file records the run of the real player, see the evidence below.
- [x] Round 4 ste-adversary S7 to S11, S14 and S15 (minor): corrected in `tasks.md`, `proposal.md` and `design.md`.
- [x] Round 4 ste-adversary S1 to S6, S12, S13 and S16 (minor): kept. Each needs a change of the scenario text, of a test name or of a comment in a test file, and so a new ratchet and a new round for a wording point. The list is in `review/round-4/skeptics.md`. Accepted by Ian Blenke on 2026-09-24.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `6e9e079`, round 3 since `fa2d1cd`, and round 4 since `e0c8b7f`. Round 4 was a narrow confirmation round after the major finding of round 3. The limit of three rounds is exceeded by this one round, for that reason.
- [x] Trace: the ratchet passed after each correction. The scenarios `osh-076` to `osh-094` are new, `osh-005`, `osh-072` and `osh-074` have one changed line each, and 366 scenarios are verified with 0 open. The ledger records two flips of the uncovered branches of `src/data/labelArbiter.js` (52 to 50 and back to 52), which no file of this change touches.
- [x] Constraints: the change adds no request method other than GET, no `send` outside a comment in the scanned files, no network call to an OpenSensorHub server, and no name or ID of the owner's server. No test that exists on `main` is renamed.
- [x] Open task: task 7.6, the look at the panel in the full app, stays open. It is the check of the person who merges.

## Evidence

- [x] The lead ran the real player, source and hub in headless Chrome on a synthetic H.264 clip made with ffmpeg (a test pattern, 320 by 240, 30 messages). The player reported `waiting` and then `live`. A second run used the real hub with a fake upstream socket: a late client got the messages from the last key message on, and the canvas showed the test pattern. The panel, with the real `style.css` and a decoded picture, showed the title, the canvas, the status and the detail. The scripts are not in the repository, and no test repeats the run.
- [x] The gates run after the archive passed with 366 scenarios verified and 0 open. The only error before this file existed was `REVIEW-MISSING`.

## Coverage of the changed code files

- [x] `server/providers/osh.js`: lines 779 of 779, branches 208 of 208, functions 40 of 40
- [x] `server/providers/osh/ids.js`: lines 325 of 325, branches 67 of 67, functions 16 of 16
- [x] `server/providers/osh/live.js`: lines 292 of 292, branches 82 of 82, functions 26 of 26
- [x] `src/data/osh.js`: lines 30 of 30, branches 7 of 7, functions 3 of 3
- [x] `src/data/osh.js`: lines 30 of 30, branches 5 of 5, functions 3 of 3
- [x] `src/data/oshDatastreams.js`: lines 89 of 89, branches 58 of 58, functions 6 of 6
- [x] `src/data/oshVideo.js`: lines 140 of 140, branches 40 of 40, functions 16 of 16
- [x] `src/layers/osh/detail.js`: lines 146 of 146, branches 67 of 67, functions 12 of 12
- [x] `src/layers/osh/index.js`: lines 808 of 808, branches 252 of 252, functions 60 of 60
- [x] `src/layers/osh/source.js`: lines 164 of 164, branches 77 of 77, functions 21 of 21
- [x] `src/layers/osh/videoPlayer.js`: lines 195 of 195, branches 59 of 59, functions 13 of 13
- [x] `src/overlays/worldOverlay.js`: lines 2311 of 2368, branches 572 of 653, functions 89 of 92

Each file has full coverage, except `src/overlays/worldOverlay.js`. It is an older file with earlier gaps in the ledger. This change adds one selector line there, and that line runs when the module loads, so the uncovered counts do not change. The file `src/data/osh.js` has two records, because a test imports a second copy of the module to test its default export. Both records are complete.

## Mutation report

Each mutation ran in a private copy of the tree, and a mutation that no test of the named tag fails is a finding. The batteries ran again on the final code after round 4.

- [x] Helper `src/data/oshVideo.js`: H1 to H11 all fail their `[osh-083]` tests (H8 to H11 are the NAL type mask of four and six bits, and the sample with a NAL unit of type 0 or 6).
- [x] Server: 79 mutations in the battery (V1 to V15 and the extra mutations on the route, the URL guard and the hub), no survivor. The mutations V16 to V25 are in a second script: the check of the unwritten bytes (V16 to V20 fail the `[osh-090]` tests, one of them with a real HTTP client), the string of digits (V21), the size limit of 65536 bytes (V22), a text message of 2097153 characters (V23), no `down` for a video client (V24), and the second retry delay (V25).
- [x] Player and source: 117 mutations, 116 killed and 1 proved equivalent (X6, the close method with no decoder: the call fails inside the guard and changes nothing). P12 and P13 (an exception from `configure` or `decode`) are H1 to H5 of the hardening script, all killed.
- [x] Layer and page: 77 mutations on the layer, no survivor (L13e is killed only because `osh.test.mjs` fails to load; the test `every host is null when there is no document` would fail too). The page mutations L15 to L23 all fail their `[osh-094]` or `[osh-093]` tests.
