# Review: osh-live-observations

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-24
Gates: make gates CHANGE=osh-live-observations passed
Rounds: 4
Scope: diff 36d2254
Reviewed-Tree: 1060ca0b626a5b4d12749b9f9bb67a8e0f4cd5dde0ecc61880ffa0627d24fc9f

## Findings

- [x] Round 1 spec-adversary F1 (major): the address scan of the hygiene test read only `http` and `https`. It now reads `ws` and `wss`, and a new test builds a real-looking `wss` address from parts. The mutation V30 fails that test.
- [x] Round 1 spec-adversary F2 (major): the text of `osh-039` said four files, and the delta did not modify its requirement. The delta now modifies "Query construction", with `osh-039` at five files and the three other scenarios carried. Tasks 2.1b and 2.1c name the tests of `osh-039` and `osh-021`.
- [x] Round 1 spec-adversary F3 (major): no test covered a frame that is too large and holds no observation. A new `[osh-066]` test covers a frame that is not JSON and a frame with no `result`. The mutations V24 and V25 fail it.
- [x] Round 1 spec-adversary F4 (major): no test covered the retry timer or the stable timer of an entry. Two new `[osh-069]` tests cover them, and the mutations V26 and V27 fail them.
- [x] Round 1 spec-adversary F5 (critical): `close()` of the hub had no caller in the provider and no test. The hub now closes when the HTTP server closes, the new scenario `osh-075` says so, and two tests cover it. The mutations V28 and V29 fail them.
- [x] Round 1 spec-adversary F6 (major): a browser allows about six connections to one origin over HTTP/1.1, and the layer could hold eight streams. The layer now starts at most three streams. The known limit `osh-live-stream-cap` names the reason and, after round 2, its two consequences.
- [x] Round 1 spec-adversary F7 to F14 (minor): the close frame (see round 2 F1), the text "one function" of the requirement "GET only" (now "one file"), five AND lines, the `send` scan (now `\bsend\b`), arrays as observations, and the three limits of memory, refusal and silence. All corrected, or recorded as the known limits `osh-live-memory`, `osh-live-no-retry-after-refusal` and `osh-live-silent-upstream`. The lint reports no warning for the documents or the new tests of this change.
- [x] Round 1 ste-adversary S1 to S10 (major): the close frame, the encoding of the query, the count of datastreams that hold a place, the delays and their reset, the limit of streams, the reference `osh-030`, the text "one file", the two meanings of "open", the silent upstream socket and the age of a position. All corrected.
- [x] Round 1 ste-adversary S11 to S25 (minor): verbs used as nouns, passive voice, words that end in -ing, words that are not approved, the actor of a sentence, test names and the form of tasks. Corrected at the places that the findings name, including the names of tests that are new in this change.
- [x] Round 1 ste-adversary S15 (minor): kept. It is an opinion about the word "give". S21 and S22 are kept in part, and so are the four "Accepted." lines of the risks, because each has one clear meaning and the STE lint has 0 errors.
- [x] Round 2 spec-adversary F1 (major): the text said that the only frame of the provider is the close frame, and it is false. The runtime also sends a pong for each ping. The text now says that the provider sends no message frame, and that the runtime sends only control frames. The loopback fixture now sends a ping, and the test asserts `[10]` while it listens and `[10, 8]` after the close. The skeptic rated it minor, and the lead corrected it.
- [x] Round 2 spec-adversary F2 (major): two AND lines of `osh-068` had no test. Two new `[osh-068]` tests cover the place of a datastream until two seconds after its last client leaves, and while its socket waits to try again. The mutations V33 to V35 fail them.
- [x] Round 2 spec-adversary F3 to F8 (minor): a test name in the passive voice, the order of the test tasks, the last line of `osh-075`, the WHEN of `osh-004`, two consequences of the cap of three streams, and the log text `code 0`. All corrected. The route test of `osh-004` now drives the live route.
- [x] Round 2 ste-adversary S26 to S28 (major): two lines of `osh-066` gave two answers for a large frame that is not JSON, the frame claim of F1, and a known limit written for eight streams. All corrected.
- [x] Round 2 ste-adversary S29 to S42 (minor): the delays text, the count of datastreams, the words "close", "write", "restart" and "of today", the scope of the WHEN of `osh-004`, the two meanings of `open`, the layer test names and the form of three tasks. All corrected at the places that the findings name.
- [x] Round 3 spec-adversary F1 to F5 (minor): the verdict is PASS. F1, F3 and F5 are corrected. F2 is the new known limit `osh-live-early-place-release`. F4 is answered: the mutation V32 fails both `[osh-004]` tests, so the report below lists V1 to V36.
- [x] Round 3 ste-adversary S43 (major): the THEN of `osh-004` said "each recorded upstream call", which then included the WebSocket call. It now says "each recorded fetch call". The hashes of `osh-004` and `osh-075` and one test name changed, and the trace was edited as text with the hashes of the repository loader.
- [x] Round 3 ste-adversary S44 to S46 (minor): corrected. The test is renamed, and the wording outside the diff is corrected too.
- [x] Round 4: both agents give PASS with no finding. The round is a narrow confirmation of S43.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the commit `20de337`, round 3 since `9600e73`, and round 4 since `36d2254`. Each diff holds the code, the four documents against their earlier text, and the synced spec.
- [x] Trace: the ratchet opens and closes no gap, as the proposal says. The hashes of `osh-004`, `osh-005`, `osh-006` and `osh-039` changed, and `osh-063` to `osh-075` are new.
- [x] Constraints: the provider sends only GET, and no scanned file uses the word `send` outside a comment. Every id in the diff has the prefix `foi-fixture-`, `sys-fixture-` or `ds-fixture-`. Every test server is on the loopback address, and no existing test is renamed. The credentials stay on the server.

## Coverage of the changed code files

The gates ran in the Docker image (Node 24).

- [x] `server/providers/osh.js`: 761 of 761 lines, 203 of 203 branches, 40 of 40 functions.
- [x] `server/providers/osh/get.js`: 270 of 270 lines, 73 of 73 branches, 10 of 10 functions.
- [x] `server/providers/osh/ids.js`: 274 of 274 lines, 54 of 54 branches, 14 of 14 functions.
- [x] `server/providers/osh/live.js`: 220 of 220 lines, 62 of 62 branches, 23 of 23 functions.
- [x] `src/layers/osh/index.js`: 717 of 717 lines, 224 of 224 branches, 50 of 50 functions.
- [x] `src/layers/osh/source.js`: 115 of 115 lines, 62 of 62 branches, 16 of 16 functions.

## Mutation report

Each mutation ran on the final code, in a private copy, with the host `node --test` (Node 26) on the test files that the ledger names. The baselines passed, and each file was restored after its run. Each mutation failed the test that the ledger names. A mutation with more than one variant ran in each variant.

The 23 extra mutations of the server and the 20 extra mutations of the layer each fail at least one test. The batteries are `V1` to `V36` for the server and `B1` to `B15` for the layer.

- [x] V1: 1 test failed, including `[osh-063]` the live route gives 400 with bad_datastream for a.
- [x] V2: 2 variants, and each failed at least one test, including `[osh-063]` the live route gives 503 with no_key when no.
- [x] V3: 2 tests failed, including `[osh-006]` refuses a browser request whose method is not GET and 1 more.
- [x] V4: 12 tests failed, including `[osh-064]` liveUrl() builds a ws URL for an http root and 11 more.
- [x] V5: 7 variants, and each failed at least one test, including `[osh-064]` assertLiveUrl() throws for another scheme, host, port, path, query.
- [x] V6: 2 tests failed, including `[osh-065]` the handshake carries Authorization only when both credentials are and 1 more.
- [x] V7: 5 tests failed, including `[osh-065]` the route opens one upstream socket with binaryType set and 4 more.
- [x] V8: 4 tests failed, including `[osh-065]` the route opens one upstream socket with binaryType set and 3 more.
- [x] V9: 10 tests failed, including `[osh-066]` a binary frame gives an observation event with the and 9 more.
- [x] V10: 1 test failed, including `[osh-066]` a frame of 65536 bytes or less that is.
- [x] V11: 5 tests failed, including `[osh-066]` a frame of more than 65536 bytes that holds and 4 more.
- [x] V12: 2 tests failed, including `[osh-066]` the hub refuses the datastream for ten minutes after and 1 more.
- [x] V13: 9 tests failed, including `[osh-067]` two clients share one upstream socket and both receive and 8 more.
- [x] V14: 6 tests failed, including `[osh-067]` the socket closes two seconds after the last client and 5 more.
- [x] V15: 8 tests failed, including `[osh-067]` the socket closes two seconds after the last client and 7 more.
- [x] V16: 2 variants, and each failed at least one test, including `[osh-068]` a client for a ninth datastream gets live_busy, and.
- [x] V17: 2 variants, and each failed at least one test, including `[osh-069]` the client receives open each time the socket opens.
- [x] V18: 4 tests failed, including `[osh-069]` the delays before a new socket are 1, 2 and 3 more.
- [x] V19: 1 test failed, including `[osh-069]` a socket that stays open for 30 seconds resets.
- [x] V20: 2 tests failed, including `[osh-069]` the response carries a heartbeat comment every 20 seconds and 1 more.
- [x] V21: 2 tests failed, including `[osh-070]` no event, header or log line holds the URL and 1 more.
- [x] V22: 2 tests failed, including `[osh-070]` no event, header or log line holds the URL and 1 more.
- [x] V23: 3 tests failed, including `[osh-069]` a client that joins an open socket gets the and 2 more.
- [x] V24: 1 test failed, including `[osh-066]` a frame of more than 65536 bytes closes the.
- [x] V25: 1 test failed, including `[osh-066]` a frame of more than 65536 bytes closes the.
- [x] V26: 2 tests failed, including `[osh-069]` the hub clears the timer of the next socket and 1 more.
- [x] V27: 1 test failed, including `[osh-069]` a socket that closes less than 30 seconds after.
- [x] V28: 3 variants, and each failed at least one test, including `[osh-075]` the hub ends each client, clears each timer and.
- [x] V29: 1 test failed, including `[osh-075]` the provider closes the hub when the HTTP server.
- [x] V30: 1 test failed, including `[osh-034]` the address check catches a real-looking WebSocket address, and.
- [x] V31: 2 variants, and each failed at least one test, including `[osh-005]` only osh/get.js calls fetch; no other scanned file calls.
- [x] V32: 2 variants, and each failed at least one test, including `[osh-004]` oshOpenStream() gives the constructor the URL and an option.
- [x] V33: 1 test failed, including `[osh-068]` a datastream keeps its place until two seconds after.
- [x] V34: 1 test failed, including `[osh-068]` a datastream keeps its place while its socket waits.
- [x] V35: 1 test failed, including `[osh-068]` a datastream keeps its place while its socket waits.
- [x] V36: 2 tests failed, including `[osh-065 osh-066 osh-067]` a loopback server sees a GET handshake and no and 1 more.
- [x] B1: 2 tests failed, including `[osh-072]` the layer starts one live stream for each of and 1 more.
- [x] B2: 1 test failed, including `[osh-072]` a new selection closes every live stream and starts.
- [x] B3: 3 tests failed, including `[osh-072]` a click on empty space closes every live stream and 2 more.
- [x] B4: 1 test failed, including `[osh-072]` the destroy method closes every live stream.
- [x] B5: 9 tests failed, including `[osh-073]` a live observation replaces the observation of its datastream and 8 more.
- [x] B6: 5 tests failed, including `[osh-073]` a live observation that is ahead of the clock and 4 more.
- [x] B7: 2 tests failed, including `[osh-073]` a live observation that is ahead of the clock and 1 more.
- [x] B8: 6 tests failed, including `[osh-073]` the layer reads no second observation for a datastream and 5 more.
- [x] B9: 2 tests failed, including `[osh-074]` a live stream that opens again stops the poll and 1 more.
- [x] B10: 1 test failed, including `[osh-074]` the layer polls a datastream whose live stream reports.
- [x] B11: 1 test failed, including `[osh-074]` a live stream that opens again stops the poll.
- [x] B12: 2 tests failed, including `[osh-071]` the default event source is the global constructor and 1 more.
- [x] B13: 1 test failed, including `[osh-071]` the close method closes the event source, and only.
- [x] B14: 2 tests failed, including `[osh-074]` an open live stream stops the poll of its and 1 more.
- [x] B15: 1 test failed, including `[osh-071]` the source ignores an observation event whose data is.
