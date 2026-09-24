# Skeptic verdicts of round 2

One skeptic for each major or critical finding. Minor findings had none.

## ste S26: real=True, severity fair=True, fix ok=True

CONFIRMED and in scope. The cited text exists as described. Line 89 of openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md and line 621 of openspec/specs/osh/spec.md read "a frame that is not JSON or has no `result` gives no event, and the upstream socket and the client responses stay open". Line 90 (622) reads "a frame with more than 65536 bytes closes the upstream socket, whatever the frame holds, and the client receives the event `unsupported`". An oversize frame that is not JSON matches both lines, and they give opposite outcomes: socket open versus socket closed. The two spec copies are identical for osh-066. In-scope evidence: live-r2.diff hunks at lines 902-905 and 1047-1050 rewrite both lines in this round. Round 1 added "and the upstream socket and the client responses stay open" to line 89 and "whatever the frame holds" to line 90, and moved the size bound out of design.md:53-54 into a sentence that bounds the no-event rule.

The other prose bounds the rule and the spec does not. design.md:54 says "A frame of 65536 bytes or less that is not JSON, or has no `result`, gives no event". The code agrees with design.md, not with line 89. server/providers/osh/live.js:112-117 (relay) checks `bytes > OSH_LIVE_MAX_FRAME_BYTES` before JSON.parse and calls refuse(), which closes the socket and ends the clients. The JSON.parse catch and the `result` check at :118-123 only return, and only for frames of 65536 bytes or less. The test at src/data/oshLive.test.mjs:503-524 asserts that an oversize binary or text frame that is not JSON gives ['open','unsupported'], client.ended 1 and closeCalls 1. The test at :428-454 covers only small frames. I ran `node --test src/data/oshLive.test.mjs`: 40 of 40 pass, so the behaviour is as the finding says. No mutation was needed because the finding claims none.

Severity: major is fair. The scenario has two possible meanings for one input, and it disagrees with design.md:54 and with the code.

Fix: right in substance. The scenario is in the ADDED requirement "Live observations" of an unmerged change, so rewording it does not hit the MODIFIED-requirement rehash rule. Sentence lengths fit: "a frame of 65536 bytes or less that is not JSON, or has no `result`, gives no event" is 18 words, and "the upstream socket and the client responses stay open after that frame" is 13 words. The text agrees with the test at :428, where the frames are small and closeCalls and ended are 0, and with the 65536-byte test at :472, which shows a frame of exactly 65536 bytes is not too large. Apply it as two AND lines in both spec copies, with the same text:
- **AND** a frame of 65536 bytes or less that is not JSON, or has no `result`, gives no event
- **AND** the upstream socket and the client responses stay open after that frame
Leave the line about more than 65536 bytes as it is.

Side effects: the osh-066 hash in openspec/trace/ids.json:1212 will change and needs a ratchet. Edit that file as text, never by JSON round-trip.

Optional and not required: tasks.md:31 and the test name at oshLive.test.mjs:428 stay true for the small frames they use. The test is new in this change, so a rename would be allowed, but it is not needed.

## ste S28: real=True, severity fair=True, fix ok=True

Confirmed. The cited text exists at proposal.md:46 and is a new line in this round's diff (PART 2, proposal.md, the `+` line for `osh-live-no-retry-after-refusal`), so it is in scope. It is a stale carry-over from the eight-stream layer. Round-1 finding F12 (review/round-1/spec-adversary.md:13) said "One selection of 8 streams fills the hub ... A second selection in that time gets live_busy for every stream". The layer now starts at most three streams (index.js:19 MAX_LIVE_STREAMS=3; proposal.md:37 `osh-live-stream-cap`; design.md:70; spec osh-072). The hub limit is still eight (live.js:20, 184-186), and a place lingers 2 s after the last client leaves (live.js:24, 166-169). One selection therefore cannot fill the hub. I ran a simulation in a private copy with the real hub, fake sockets and fake timers, three datastreams per selection with each selection leaving before the next: selection 1 gives ok,ok,ok; selection 2 gives ok,ok,ok; selection 3 gives ok,ok,live_busy; selection 4 gives live_busy x3. A re-selection of the first system within 2 s gives ok,ok,ok, because join() admits a datastream that already has an entry (live.js:183-186). So the sentence is wrong on three points. "Second" is wrong. "For each stream" is wrong when the second selection is the same system. "Within two seconds of a full hub" is not an event, and it could mean either "after a selection that filled it" or "while other clients fill it". That is a major under the stated rubric: two meanings, and it disagrees with the code and with the change's own prose. "Fail for good" is also an idiom. The behaviour it names is real: a 503 makes the EventSource fail the connection, and source.js:109/111 turns `error` into onDown, so the layer polls. `_liveOpened` (index.js:145, 230-231) allows one stream start per selection, so "starts no new stream for the same selection" is correct. Fix: the proposed rewrite is correct and fits the limits. Sentences are 14, 18, 11 and 20 words (limit 25), and there are 4 sentences (limit 6). "Hold a place" matches D65 and osh-068. "Two seconds after its last client leaves" matches live.js:24. "Quick selections can fill the hub" is true, since three selections give 9 > 8. One optional tightening: replace "each new datastream" with "each datastream that holds no place", because "new" has no stated reference point. Otherwise apply it as written.

## spec F2: real=True, severity fair=True, fix ok=True

CONFIRMED. The finding gave no explicit fix; I judged the natural fix, which is extra [osh-068] assertions, and it is correct. Both AND lines are new in the diff (delta spec.md:105-106 and synced openspec/specs/osh/spec.md:637-638), so they are in scope. The only tests tagged osh-068 are src/data/oshLive.test.mjs:661 (ninth datastream) and :690 (seventeenth client), and openspec/trace/links.json:1220-1222 links only those two. No other test mentions live_busy. The count is server/providers/osh/live.js:183-185, `entries.size >= OSH_LIVE_MAX_SOCKETS`. An entry exists from the first join until drop() runs (idle timer at live.js:167, 2s after the last client leaves), so it stays through connecting and retry-wait.

Mutations, run in a private copy at .../live-r2/skeptic-spec-F2 with the count expression replaced:
- MA, `[...entries.values()].filter(e => e.clients.size > 0).length` (an entry with no clients stops counting during the 2s). Survives: 40/40 in oshLive.test.mjs, and 130/130 with oshProxy.test.mjs and oshRepositoryHygiene.test.mjs. Line 105 is unasserted. Test :661 frees the place only after advance(2000), so it checks the upper bound and never the lower bound (still counted at 1999ms).
- MB, `filter(e => !e.retryTimer)` (an entry waiting to try again stops counting). Survives 130/130. The "waits to try again" half of line 106 is unasserted.
- MD, `filter(e => e.socket)` (count only entries holding a socket). Survives 130/130. This is a usual edit, since the old spec text said "eight upstream sockets".
- MC, `filter(e => e.open)`, and ME, `filter(e => e.open || e.retryTimer)`, are killed by test :661. It never emits 'open', so the "connects" half of line 106 is asserted. The finding is slightly broad on that half, but line 105 and the retry-wait half are real gaps, and the hub can then hold more than eight sockets.

Severity major is fair: usual edits hide the gap and the gates do not stop them.

Fix, verified in the copy. Add two [osh-068] tests, or extend :661, which is new in this unmerged change so it may be edited or renamed.
(a) Join ds-fixture-1..8, `joined[0].leave()`, `advance(1999)`. Assert that joining ds-fixture-9 returns `{error:'live_busy'}` and sockets stay at 8. Then `advance(1)` and assert that the join returns a leave function. MA fails on this.
(b) Join eight datastreams, `sockets.instances[0].emit('close',{code:1006})`, `advance(999)`. Assert that ds-fixture-9 gets `live_busy` and sockets stay at 8. MB and MD fail on this.
With both tests added, the original code passes 42/42 and MA, MB and MD each fail exactly one new test. If new tests are added, edit openspec/trace/links.json as text (never round-trip the JSON) to link them under osh-068. The test-file count pinned by osh-034 does not change.

I changed nothing in the repository; git status shows only the pre-existing untracked review/ directory.

## ste S27: real=True, severity fair=True, fix ok=False

REAL and in scope. Every cited text exists and is in the round-2 diff (round-1 corrections). It is at archive spec.md:83, openspec/specs/osh/spec.md:615, design.md:46 ("That is the only frame that the provider sends"; the line before says "the runtime sends the close frame"), proposal.md:39, get.js:115-116 and live.js:10. The test asserts sit at oshLive.test.mjs:1238 and :1254, and the `[]` assert at :1231. The round-1 skeptic (skeptics.md, ste S1) already said the "only frame ... is the close frame" wording was false and asked for "no data frame" plus a bounded control-frame clause. The lead kept the "only".

Mutation in a private copy (Node v26.8.2, real hub and real WebSocket, loopback server only). I made the fixture send a ping (`wsFrame(9, Buffer.alloc(0))`) first. The `[]` assertion at :1231 fails with actual `[10]`. With `[]` changed to `[10]`, the `[8]` at :1238 would not hold either, so the fixture proves "only" only because it never pings. A standalone loopback probe shows: server ping gives `[10]`; ping then `close()` gives `[10,8]`. A server that sends a close frame while the provider calls nothing gives `[8]`. So the runtime sends a pong, and a close frame that answers the server's own close. The text disagrees with the runtime, and design.md:46 also contradicts itself, because a pong is a runtime frame. Major is fair: the text does not agree with the code.

FIX IS WRONG AS WRITTEN, for three reasons.
1. Length: the one sentence has 32 words by hand count. The project linter (`lintMarkdown` from scripts/spec/lib/ste.mjs, run in the copy) reports "The sentence has 33 words. The limit is 25."
2. It omits a case: "the close frame when the provider closes a socket" does not cover the close frame that the runtime sends when the server closes first. That gives `[8]` with no `close()` call (loopback probe), so the new "only" is false again.
3. It adds a pong claim that no test proves. A pong claim needs a ping in the fixture. If the test adds a ping, `clientBytes()` and `firstClientByteAt` in startUpstream must wait for opcode 8. Today the pong makes the "closed after -6 ms, too early" assert fail.

CORRECT FIX. Split it, and say "when a socket closes", not "when the provider closes a socket".
- Spec bullet at archive spec.md:83 and openspec/specs/osh/spec.md:615: two bullets. "- **AND** the provider sends no message frame to the upstream server" and "- **AND** the runtime sends only control frames: a pong frame for each ping, and a close frame when a socket closes". Linter: no findings.
- design.md:46: "The provider closes a socket with `close()`. The provider sends no message frame. The runtime sends only control frames: a pong frame for each ping, and a close frame when a socket closes." Linter: no findings.
- proposal.md:39: "... and the server accepts none. The runtime sends only control frames: a pong frame for each ping, and a close frame when a socket closes."
- get.js and live.js comments: same wording.
- Test: add a ping frame (opcode 9) to the first loopback fixture. Assert `[10]` while listening, and `[10, 8]` after the client leaves. Make `clientBytes()` and `firstClientByteAt` wait for opcode 8. Rename the `[]` message from "no frame" to "no message frame". The name is new in this change, so a rename is allowed. Then the "only control frames" claim is proven for the ping and close cases.
- Fallback with no test change: drop the pong and close-reply detail, say only "no message frame" (or "no data frame", the RFC 6455 term), and drop the "only" claim in all six places.

No standing-constraint violation: no `send`, GET only, loopback only, and I made no change in the repository.

## spec F1: real=True, severity fair=False, fix ok=True

REAL, but minor rather than major.

Cited text: every citation matches. Archive spec.md:83, synced specs/osh/spec.md:615, design.md:46, proposal.md:39, get.js:116, live.js:10 and oshLive.test.mjs:1238 all say the close frame is the only frame the provider sends. The get.js and live.js comments and the spec.md scenario lines are new in the diff (live-r2.diff lines 27, 44, 896, 1041), so the claim is in scope.

Behaviour: it is false. I ran a loopback-only probe with Node v26.8.2's global WebSocket against a raw net server on 127.0.0.1, at scratchpad/live-r2/skeptic-spec-F1/probe.mjs. No repo file was changed.
- Server sends a ping (opcode 9): the client sent opcode 10, a pong. RFC 6455 requires this, and the runtime does it with no call from the provider.
- Server closes first: the client sent opcode 8, an echo close frame for a socket the server closed. This one is arguable against "a socket that it closes".
- Idle socket: the client sent nothing until close().

So "its only frame is the close frame of a socket that it closes" is not true for a server that pings. The provider still sends no message (data) frame and never calls send: get.js and live.js contain no `send` call, and the only `send` in server/providers/osh* is inside the comments. The first half of osh-065 ("no message frame") is true, since a pong is a control frame. The fixture in oshLive.test.mjs (startUpstream, lines 1054-1121) never pings, so the [] and [8] assertions at lines 1231 and 1238 hold only for that fixture.

Severity: not major. Standing constraints (1) to (5) are not violated. Constraint 1 is GET-only and never calling send, and the runtime's pong is not a provider call. No test or tag hides a gap, and no usual author edit hides one. The mismatch appears only when the server pings, so at most it is an over-broad "only" in prose. The nearest project pattern is the "exception clause must bound itself" one (osh-057). The behavioural effect there was a system counted nowhere. Here the effect is nil, so minor.

Fix: rewording is the right fix. Osh-065 is under "## ADDED Requirements > Live observations" in this unmerged change, so it can be reworded. Do not touch the MODIFIED "GET only" requirement. Change all seven places together to a bounded claim, for example: "the provider sends no message frame (no text or binary frame) and never calls send. The only frames it can send are the control frames that the runtime sends by protocol: the close frame when it closes a socket, the close echo when the server closes first, and a pong for a ping." Keep the scenario line free of the words "only frame" unless bounded. The test names, including the one in links.json, can stay. The message at oshLive.test.mjs:1238 should say that the fixture sends no ping. Optionally add a ping frame to the loopback fixture and assert that no opcode 0, 1 or 2 is ever sent, which is the guarantee that matters. That optional test would be new in the unmerged change, so a new test name is allowed.
