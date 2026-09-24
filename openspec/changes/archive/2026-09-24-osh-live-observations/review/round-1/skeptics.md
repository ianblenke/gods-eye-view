# Skeptic verdicts of round 1

One skeptic for each major or critical finding. Minor findings had none.

## ste S10: real=True, severity fair=True, fix ok=True

Confirmed. proposal.md:3 reads "The layer polls ... every 15 seconds. ... shows a position that is up to 15 seconds old." design.md:3 reads "The route `/api/osh/observations` caches the answer for 15 seconds. A moving system therefore shows a position that is up to 30 seconds old". The code agrees with design.md. src/layers/osh/index.js:10 has POLL_INTERVAL_MS = 15_000, and index.js:306 uses it in setInterval. server/providers/osh/observations.js:7 has OBS_TTL_MS = 15_000, and it is the ttl of the observation cache at observations.js:89. Worst case: a poll gets an answer cached up to 15 s ago, and the layer shows it until the next poll 15 s later, so the age is up to about 30 s. The worst case is not 15 s. The same proposal at line 39 already says "the observation route caches for 15 seconds", so line 3 disagrees with line 39's premise, with design.md:3 and with the code. The cache and poll lines are unchanged from origin/main, so the change did not alter them. Under the stated definitions this is major: the text does not agree with the code or with the other prose of the change. The fix "up to 30 seconds old" is correct and fits the limits. The edited sentence has 18 words, and the paragraph has 3 sentences. Optional better fix: add "The observation route caches each answer for 15 seconds." before the last sentence and start that sentence with "therefore". Then the 30 is explained and matches design.md:3. It gives 9 and 19 words in a paragraph of 4 sentences, so it still fits. Standing constraints 1 to 5 are not touched by this finding, and I made no file change.

## ste S2: real=True, severity fair=True, fix ok=True

CONFIRMED. The cited text exists: openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:44, and the same line is synced to openspec/specs/osh/spec.md:606 (osh-064). It says "the URL has the query `f` with the value `application/om+json`, encoded as the URL rules say". I ran it in node. The URL rules leave `/` and `+` raw in a query: `u.search='f=application/om+json'` gives `?f=application/om+json`. Only the form serializer encodes them: `new URLSearchParams({f:'application/om+json'}).toString()` gives `f=application%2Fom%2Bjson`. The code uses the form serializer: server/providers/osh/ids.js:187-190 (`OSH_LIVE_QUERY = new URLSearchParams({f: OSH_LIVE_FORMAT}).toString()`), assigned at :208, and checked at :233. All three cited test lines exist and pin the encoded form: src/data/oshIds.test.mjs:313 (`?f=application%2Fom%2Bjson`, message "the slash and the plus sign reach the server encoded"), src/data/oshLive.test.mjs:346 and :1119. The design already says it plainly at design.md:40: "The URL encodes the `/` and the `+` of the value of `f`". So the spec line has two readings. A reader who takes "the URL rules" as the URL Standard for a query would write `f=application/om+json`, and that would fail the three tests and the design. It also matters in practice, because a raw `+` is read as a space by a server that decodes a form (I saw `application/om json` from a parsed raw URL). The severity "major" fits the project's own definition (two meanings, and disagreement with the code and the design prose).

Fix: the proposed wording is correct and fits the limits (the full line is 12 words, under 25 per sentence). A slightly better version keeps the decoded value, which the other scenarios and the assertLiveUrl bullet refer to: "the URL has the query `f` with the value `application/om+json` written as `application%2Fom%2Bjson`" (15 words). Notes for the apply step. (1) Change both line 44 of the archived delta and line 606 of openspec/specs/osh/spec.md, the same way. (2) Only the osh-064 scenario body changes. The requirement text ("Live observations") is unchanged, and osh-064 is new in this unmerged change, so its hash in openspec/trace/ids.json (line 1202) changes and must be ratcheted. Edit that JSON as text. (3) No test needs renaming, because the tests are linked by name and are unchanged. The new text names no stream metadata, so it breaks none of the five standing constraints.

## ste S6: real=True, severity fair=True, fix ok=True

Confirmed. The delta spec line 106 (openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md), scenario osh-074, reads "polls the newest observation of that datastream at each poll interval, as `osh-022` says". `osh-022` (openspec/specs/osh/spec.md:171) is "Serve the newest observation of a datastream", the route scenario. It gives no poll interval. Its requirement text at line 168 says "cached for 15 seconds", which is a cache TTL, not a poll interval. The design keeps the two apart: design.md line 3 says the route caches for 15 seconds, and the poll adds up to 30 seconds of age. The poll and its interval are in `osh-030` (main spec line 314): "reads the newest observation of each, then again every 15 seconds". The code agrees with osh-030: POLL_INTERVAL_MS = 15_000 at src/layers/osh/index.js:10, used by setInterval at line 304. A reader who follows the reference finds no interval, so the text disagrees with the specs. That fits the major definition.

The fix "as `osh-030` says" is correct. The THEN line becomes 16 words, well under 25.

The fix must reach two more places, or the change fails its own gates.
1. The same sentence was synced into the main spec at openspec/specs/osh/spec.md:668. Edit it there too, so the delta and the main spec stay identical.
2. scenarioHash() (scripts/spec/lib/specs.mjs:38) hashes the scenario body. I computed the hash of osh-074 from the current main spec and it equals the stored value at openspec/trace/ids.json:1252 (3838c9e0...). After the edit that stored hash must change. Update it as text with the ratchet, and never round-trip the JSON, per the project memory.

Only the scenario body changes, not the requirement text, so only the osh-074 hash moves. Do not reword the requirement. The other `osh-022` reference, in osh-066 (delta line 56, main spec line 618), is correct: the frame becomes the observation of osh-022. No other prose in the change (design.md, tasks.md, proposal.md) cites osh-022 for the poll interval.

## ste S5: real=True, severity fair=True, fix ok=False

Real. The requirement (openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:90, synced at openspec/specs/osh/spec.md:652) says "MUST open a live stream for each datastream of the selected system". A reader takes that to mean all datastreams. But osh-072 (delta :95) says "each of at most eight of its datastreams". The code caps it: src/layers/osh/index.js:14 `MAX_LIVE_STREAMS = 8`, and :232 `[...new Set(states)].slice(0, MAX_LIVE_STREAMS)`. The test at src/data/oshLayer.test.mjs:2660 opens the first eight of 10 datastreams. design.md:66 and :78 and tasks.md:70 and :76 all say at most eight. So a system with nine datastreams is a MUST violation under the requirement text but correct under the scenario and the code. That is two meanings and disagreement with the code and the other prose, so major is fair. proposal.md:16 ("It opens a stream for each datastream of the selected system") has the same omission, as the finding says.

The proposed wording is right in meaning but the whole requirement sentence would then have 27 words, over the 25-word limit (the original has 23). The fix must split the sentence, so it needs a small correction.

Correct fix.
- Delta spec.md:90 and main spec.md:652 (both, or the base-vs-delta sync check fails, see scripts/spec/lib/specs.mjs:268): "The layer MUST open a live stream for each of at most eight datastreams of the selected system. The layer MUST close each stream when the selection ends." That is 18 and 10 words.
- proposal.md:16: "It opens a stream for each of at most eight datastreams of the selected system, and it shows each observation in the detail." That is 23 words.

Follow-up cost. The scenario hash includes the requirement name and text (scripts/spec/lib/specs.mjs:29-30, 75). So the edit rehashes osh-072, osh-073 and osh-074, and openspec/trace/ids.json must be ratcheted. Edit that file as text, never by a JSON round trip. The requirement is under ADDED in an unmerged change, so this is not a MODIFIED-requirement rehash of merged scenarios. Optional, not part of this finding: neither the requirement nor osh-072 says that the first eight datastreams are the ones opened, and the code and its test do that.

## ste S4: real=True, severity fair=True, fix ok=False

CONFIRMED. Every citation exists as described.
- spec.md:77 (and its synced copy openspec/specs/osh/spec.md:639) reads "after a delay of 1, 2, 4, 8, 16 and then 30 seconds". The text does not say what happens after the sixth delay.
- server/providers/osh/live.js:89 is `OSH_LIVE_RETRY_MS[Math.min(entry.attempt, length-1)]`, so 30 s repeats. The comment at live.js:31 says "the last delay repeats".
- oshLive.test.mjs:761 loops over `[1,2,4,8,16,30,30,30]`.
- live.js:97-101 is the stableTimer, which sets `attempt = 0` after OSH_LIVE_STABLE_MS = 30000. The test at oshLive.test.mjs:772 checks it. Task V19 is at tasks.md:56.
- The reset is stated in design.md:56 and tasks.md:30. The word "reset" appears nowhere in the delta spec.md. Scenario osh-069 therefore does not agree with its own design and tests.

Mutations run in a private copy (source restored afterwards; the unmutated test file passes 35 of 35):
- V19, no reset: only "[osh-069] a socket that stays open for 30 seconds resets the delay" fails.
- Stop retrying after the sixth delay, which is the other reading of the spec text: only "[osh-069] the delays before a new socket are 1, 2, 4, 8, 16 and 30 seconds" fails.
Both mutants satisfy the spec sentence as written, but the tests reject them. That confirms the two-meaning defect and the missing reset. Major is fair.

Constraints 1 to 5: no violation was found on this line. Nothing in the finding touches them.

The proposed fix is not right as written:
1. It drops the noun "delay" from the first sentence ("after 1, 2, 4, 8 and 16 seconds") and then says "resets the delay", which has no antecedent.
2. "and then after each 30 seconds" is unclear. It can read as a timer that fires every 30 seconds.
3. As one bullet it is 25 words without "AND" and 26 with it, so it is on the limit.
4. It covers only spec.md:77. The wording must also change in three other places, or they stay ambiguous or out of step with the spec:
   - the synced openspec/specs/osh/spec.md:639;
   - design.md:56, which repeats "and then 30 seconds";
   - tasks.md:30, "The delays 1, 2, 4, 8, 16 and 30 seconds".
5. The hash of osh-069 in openspec/trace/ids.json changes when the scenario text changes. The ratchet must record it, and the file must be edited as text, not round-tripped. The requirement "Live observations" is ADDED, so its text is not reworded and only the osh-069 hash moves.

Correct fix: replace the single bullet at spec.md:77 and at openspec/specs/osh/spec.md:639 with three bullets. Each is at most 25 words, and the first is 23 words with "AND":
- **AND** while a client listens, the delay before each new upstream socket is 1, 2, 4, 8 and 16 seconds, in this order
- **AND** the delay is 30 seconds for each new socket after that
- **AND** a socket that stays open for 30 seconds resets the delay to 1 second

Then align design.md:56 with "The delay is 1, 2, 4, 8 and 16 seconds, and then 30 seconds for each later socket. A socket that stays open for 30 seconds resets the delay to 1 second." Align tasks.md:30 with "The delays 1, 2, 4, 8 and 16 seconds, then 30 seconds for each later socket". Re-run the ratchet for the osh-069 hash. No test rename is needed. The tests already carry the osh-069 tag.

## ste S1: real=True, severity fair=True, fix ok=False

REAL. Every cited text exists: delta spec.md:19 ("so the provider sends no frame to the server"), :30 ("MUST send no frame"), :52 ("sends zero frames"), proposal.md:12, design.md:13 and :38, tasks.md:26, and the test name oshLive.test.mjs:1083. Code and test contradict them. server/providers/osh/live.js:75 (`if (socket) socket.close()` in drop(), which refuse() calls at :110) writes a close frame. oshLive.test.mjs:1128 and :1144 assert clientOpcodes deepEqual [8], and the fixture comment at :1000 calls those bytes "the close frame". No file in the change says a close frame is sent. The unbounded MUST at :30 and the "so" deduction at :19 (no `send` call, therefore no frame) are false: the runtime writes control frames without any `send` call. The [] assertion at :1121 is bounded to "while it listened", but the spec text has no such bound. That gives two readings, and one contradicts osh-066/067 (they close the socket) and the code. Standing constraint 1 is not violated: grep finds no `.send(` or socket write in server/providers/osh*, and the [osh-005] scan at oshProxy.test.mjs SEND_TOKEN (:190-:214) bans `send(`. The close frame is a runtime control frame, not a provider write. Stale copies of the same claim also sit in server/providers/osh/get.js:114-115 (comment), oshProxy.test.mjs:214 (assert message "so the provider sends no frame"), the spec.md:48 title ("send nothing"), and openspec/specs/osh/spec.md:41, :592 and :614. SEVERITY: major is fair. The text disagrees with the code and with the change's own test, per the stated definition, and the claim is a normative MUST.

FIX IS WRONG AS WRITTEN. "the only frame it sends is the close frame" is false too. I ran a loopback script in my private folder (Node v26.8.2, global WebSocket, server on 127.0.0.1 sends a ping frame, opcode 9). The client sent opcode 10 (pong) after the ping and 8 after close(): [10] then [10,8]. The finding itself mentions the pong, but its rewrite leaves it out, so the new sentence has the same defect (an "only" that silently omits a case). Also, when the socket is still connecting, close() sends no frame at all. The wording "message frame" is loose. RFC 6455 says "data frame" (text or binary) versus "control frame" (close, ping, pong).

CORRECT FIX, provable by the existing tests. Say "no data frame" and add one bounded clause naming control frames.
- spec.md:52 and tasks.md:26: "The provider sends no data frame, and the runtime sends only control frames." That is 13 words.
- spec.md:30 and design.md:13: "MUST send no data frame to the server".
- spec.md:19: "...so the provider sends no data frame to the server". This is a valid deduction from "no `send` call".
- Titles and text: spec.md:48 gets "send no data frame"; design.md:38 gets "the provider sends no data frame"; proposal.md:12 gets "sends no data frame". Rename the new test at :1083 to "...a GET handshake and no data frame" (allowed, it is new in the unmerged change). Fix the get.js comment and the oshProxy.test.mjs:214 message the same way.
- Optionally add one design.md sentence: the runtime sends the close frame on close and a pong frame for a ping.
- The existing [] (while listening) and [8] assertions already prove "no data frame". A mutation that calls `socket.send` on open puts opcode 1 or 2 in clientOpcodes, so :1121 fails. Only add a pong claim if a test makes the fixture ping.
- Apply the same edits to openspec/specs/osh/spec.md, and edit the trace JSON as text, not through json.dump.

Length checks. Every proposed sentence is 25 words or fewer (longest is 18). The tasks.md:26 sub-bullet is an `item`, not a checkbox task, so the 20-word task limit does not apply to it (scripts/spec/lib/ste.mjs TASK_ITEM). tasks.md:34 and test :374 concern only oshOpenStream(), which never sends or closes, so "never sends a frame" is true there.

## ste S9: real=True, severity fair=True, fix ok=True

CONFIRMED, major is fair, and the proposed fix is right.

Evidence (all cited text and behaviour exist as described):
- design.md:79 reads verbatim: "A stream can stay open on a dead server. Accepted. The event `down` and the poll cover it, and a heartbeat shows a dead client connection."
- The actual file is server/providers/osh/live.js, in the subfolder osh/ (the finding wrote "live.js"). Lines 152-159 are as cited: `down(entry)` is reached only from the `close` and `error` listeners (`gone`) and from a failed constructor (lines 141-145). No timer watches for silence.
- I ran a probe in the private copy. It used the real hub with a fake WebSocket and recorded timers, and fired only `open`. The only timers registered were the client heartbeat interval (20000 ms) and the 30000 ms stable timer, and that timer only resets `attempt`. The socket stayed unclosed and no `event: down` was written.
- src/layers/osh/index.js:280 is `if (state.open && state.observation) continue;`. `onOpen` sets `state.open = true` (line 235) and only `onDown` or `onUnsupported` clears it. So a silent upstream socket gives no `down` and no poll.
- The detail is not recomputed. `ageMs` is fixed at relay time (live.js:132), and detail.js:73 renders `observation.ageMs`. So the age in the detail also stops growing.
- The behaviour is specified (osh-073 and osh-074 say an open stream with an observation stops the poll). The design risk row over-claims: for the one case where a stream "stays open" on a dead server, neither `down` nor the poll happens.
- The row also has a second reading: the browser stream stays open while the hub retries a closed upstream. Under that reading the text is true. Two possible meanings is a major by the stated definition, so the finding holds either way.
- No standing constraint is broken by this. There is no `.send(` in server/providers. The only `.write(` calls are to browser clients (live.js:57, 204, 205; osh.js:700). I saw no host or stream metadata in the added lines I scanned.

Fix check:
- The pattern matches the change, which names limits in the risks table and in "Known limits". Nothing else in the repo pins or lists the limit names (grep found none).
- I applied the candidate below only in the private copy /tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/live-r1/skeptic-ste-S9. `lintMarkdown` gave no new finding (the six -ing warnings in design.md are old), and none of the words is on the banned list. The repo working tree is clean.
- No spec change is needed, so there is no scenario rehash. The scenarios already say what the code does.

Correct wording:
- design.md line 79 becomes: "- **An upstream socket can stay open and send nothing.** Accepted and named as `osh-live-silent-upstream`. No timer ends it, so the event `down` does not come, and the layer keeps its last observation. A heartbeat shows a dead client connection." (longest sentence is 22 words).
- Append to proposal.md "Known limits and later changes": "- `osh-live-silent-upstream`: the hub has no timer for an upstream socket that stays open and sends nothing. The event `down` does not come, so the layer keeps the last observation, with its first age, and reads no poll. A later change can close a socket that is silent for a set time." (longest sentence is 21 words).
- Do not keep the old "and the poll cover it" wording. Do not claim that the heartbeat covers a silent upstream. It only shows a dead browser connection, because the hub writes `: hb` whatever the upstream does.

## ste S8: real=True, severity fair=True, fix ok=False

REAL. Every citation exists as described. In the delta spec.md, osh-072 uses "opens one live stream" (:95) and requirement text :90 for "create the stream" (index.js:224-246 calls source.openLive). osh-073 (:102) and osh-074 (:105, :107) use "is open" and "not open" for a state. That state is state.open: onOpen sets it true (index.js:235-237), and onDown and onUnsupported set it false (:238-244). The poll skip is `if (state.open && state.observation) continue;` (:280). The cited proposal.md:16 and design.md:66-68 have the same clash, and the event `open` is a third use.

The two readings give different behaviour, and the tests pin the state reading. In a private copy I replaced `state.open` with `state.stream` at index.js:280, which is the "opened = created" reading. Four tests then fail: the osh-074 tests "polls a datastream that has no open live stream", "reports down", "reports unsupported" and "a live stream that opens again stops the poll". The first one asserts "a stream that is still opening does not stop the poll". So a reader of the "created" meaning would build a layer that stops polling a stream that is still connecting. Major is fair: it matches the definition "the text has two possible meanings", and the difference is observable.

Two small overstatements in the finding do not change the verdict. First, "osh-074 never polls a stream that the layer opened" is too strong, because the WHEN clauses "reports down or unsupported" still poll a created stream. The real gap is a stream that is created, has sent no `open` event and holds an observation. Second, the poll rule sits in osh-073 and osh-074 and the "Live observations" requirement, and none of them defines "open".

FIX IS INCOMPLETE, so fixOk=false as written. Adding "A stream is open from the event `open` until the event `down` or `unsupported`" makes the unchanged osh-072 line :96 ("each close every open stream") wrong. Under that definition, a stream still opening or already down would not be closed by the spec, but the code closes every stream (index.js:138, `state.stream?.close()`).

Correct fix, all as edits to text that this change adds, so rewording is allowed:
1. Requirement "Live layer" (:90): "The layer MUST start a live stream for each datastream of the selected system, and MUST close each stream when the selection ends. A stream is open from the event `open` until the event `down` or `unsupported`." The sentences have 23 and 14 words.
2. osh-072 THEN (:95): "the layer starts one live stream for each of at most eight of its datastreams" (15 words).
3. osh-072 AND (:96): "close every stream" instead of "close every open stream" (14 words).
4. Title of osh-072: "Start and close the streams with the selection".
5. Put the definition once, in the requirement text or as the first AND of osh-074. Keep :102, :105 and :107 unchanged.
6. Apply the same wording to proposal.md:16 ("It starts a stream ..."), design.md:66 ("It starts them ...") and tasks.md lines 70 and 76-79 ("start a stream", "leave the streams open" stays valid).
7. Rename the new osh-072 tests that say "opens one live stream" or "closes every open live stream" (oshLayer.test.mjs:2660, 2682, 2700, 2735, 2757, 2775). They are new and unmerged, so renaming is allowed.
8. Copy the change into openspec/specs/osh/spec.md (:655-669 and the requirement text at :651) and rehash osh-072 in openspec/trace/ids.json. Edit ids.json as text, never round-trip it as JSON.

Note that osh-071 does not say that a browser `error` event also gives `down` (source.js:104-108), so "until the event `down`" is narrower than the code. That is a separate gap in osh-071, not part of this finding.

I changed no file in the repository. The mutation ran only in /tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/live-r1/skeptic-ste-S8.

## ste S3: real=True, severity fair=True, fix ok=False

REAL, and major is fair. Every cited fact checks out.

Evidence
- The text is at openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:69. It is also at openspec/specs/osh/spec.md:630 (WHEN line at 631). The line reads "eight upstream sockets are open".
- server/providers/osh/live.js:183-185 is `existing ? existing.clients.size >= OSH_LIVE_MAX_CLIENTS : entries.size >= OSH_LIVE_MAX_SOCKETS`. This counts entries in the `entries` map, not open sockets.
- A datastream enters `entries` at `entries.set(id, entry)` (live.js:201). It leaves only in `drop()` (live.js:66). `connect()` runs after that (live.js:206). So the place is held while the socket connects, while `down()` waits on `retryTimer` (live.js:91) with no socket, and during the 2 s idle window.
- src/data/oshLive.test.mjs:638 is `[osh-068] a ninth datastream gets live_busy...`. It joins eight datastreams and never calls `emit('open')`. The fake sockets are only constructed (FakeSocket, lines 103-130). The ninth still gets `live_busy`. Under osh-069, where `open` is an event, no socket is open, so the WHEN clause is false while the test passes.
- I ran a probe in my private copy, /tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/live-r1/skeptic-ste-S3. It joined eight datastreams and emitted `close` on all eight sockets. That leaves zero sockets, all in retry wait. The ninth join returned `{"error":"live_busy"}`. So the disagreement holds even if "open" is read loosely as "created by the provider", because in retry wait no socket exists.
- The text also has the "another datastream" gap the finding names. The test at :638-659 shows that a client for a datastream that already holds a place is still served, so "another" means "not among the eight". The text does not say that.
- Related prose: osh-072 (spec.md:95) and tasks.md:29 already say "datastreams". proposal.md:29, design.md:36 and design.md:78 say "sockets" as shorthand. That is loose but not a contradiction.

Standing constraints. This finding touches none of them. The code never calls `send`. The fixtures use ds-fixture-*. No real host appears. The change is a wording error only.

FIX: the direction is right (count datastreams, not sockets), but the proposed wording is not fully right.
1. "the provider serves eight datastreams" does not cover the idle window. For up to 2 s after the last client leaves, no client is served, yet the place is still held. The test only advances the full 2000 ms (:655-656), so it does not show this. "Serves" also does not say what holds a place.
2. It changes "that datastream" to "for one datastream". That drops the link to the WHEN clause. A full datastream must not block another one (test at :667-681).
3. It drops `with {error:'live_busy'}`. The test asserts that JSON (:647 and :653), so it must stay.

Correct fix, with the bullets under 25 words each:
- **WHEN** eight datastreams each hold a place, or sixteen clients listen to one datastream
- **THEN** a client for a ninth datastream, or a seventeenth client for that datastream, gets `503` with `{error:'live_busy'}`
- **AND** a datastream holds a place from its first client until the provider closes its upstream socket
- **AND** it holds the place also while that socket connects, or while the provider waits to open it again
- **AND** the provider opens no new upstream socket for that client

Apply it in both spec copies (the archive delta and openspec/specs/osh/spec.md), keeping the osh-068 ID. The requirement "Live observations" is ADDED, so rewording it is safe. Update the osh-068 hash in openspec/trace/ids.json by editing it as text, as the ratchet would. Optionally change "eight upstream sockets" in proposal.md:29 and design.md:36 and :78 to "eight datastreams", to match.

## ste S7: real=True, severity fair=True, fix ok=True

REAL. Every cited line checks out.

Evidence:
- Delta spec.md:4 (and synced openspec/specs/osh/spec.md:26) says "through one function".
- get.js:55 is oshGet(), the only fetch call. get.js:122 is oshOpenStream(), the only WebSocket call. The code comments say the same: get.js:4-8, live.js:9, proposal.md:12.
- The [osh-005] test (oshProxy.test.mjs:202-205) asserts get.js holds exactly one fetch call and exactly one WebSocket call. I ran it and it passes. That is two call sites in two functions.
- The WebSocket handshake counts as a request under this requirement: osh-005 sits under "GET only" and now scans for `WebSocket`, and design D66 and osh-065 treat the handshake as a GET.
- The osh-005 steps count files: "five files", "only get.js contains a call to fetch, fetchImpl or WebSocket". The scenario step at spec.md:20 names three functions (oshGet, oshPages, oshOpenStream).
- design.md:7 already says "one file holds the only network call", so the requirement disagrees with the design prose.
- At base the sentence was true, because get.js held one fetch call. This change makes it false.
- proposal.md:18 ("Its requirement text stays the same") and tasks.md 1.1 ("Its text stays the same") record a deliberate keep, but no reason is given, and the disagreement remains.

Severity: major is fair. The text disagrees with the code and with the design prose, or at best has two readings, "one function" versus "one file".

Fix: "through one file" is correct.
- osh-005 and design.md:7 both use "one file".
- The sentence is 25 words, within the limit.
- The STE lint of the reworded requirement in a private copy reports nothing on those lines.

Costs I verified in a private copy:
- The scenario hash includes the requirement name and text (specs.mjs:38, :75). After the reword, the hashes of osh-004, osh-005 and osh-006 all change.
- osh-005 and osh-006 already have a changed tagged test. That is the new `[osh-006]` live-route test (oshProxy.test.mjs, task 2.2) and the modified `[osh-005]` test, so they need no new test.
- osh-004 has no changed tagged test in this diff. The updateRegistry check and compareRegistryWithBase (registry.mjs:52, :113) then fail with TRACE-ID-CHANGED-NO-TEST and TRACE-ID-BASE-CHANGED.
- So the finding overstates osh-006. Only osh-004 needs a new `[osh-004]` test. The test must be new because existing names cannot change. For example, in oshLive.test.mjs, show that the live route's base probe is a recorded GET with no body and an abort signal.
- The SPEC-LINT-NO-TASK gate already passes for osh-004, because tasks.md 1.1 names it. But 1.1 ("carries osh-004 and osh-006 byte for byte, its text stays the same") and proposal.md:18 become false. Rewrite both, and add a task line for the new `[osh-004]` test.
- Apply the reword identically in both files, the delta spec.md:4 and openspec/specs/osh/spec.md:26.
- Paragraph and task-line limits: a proposal bullet such as "Change the requirement "GET only" to say "through one file", because get.js now holds two call sites: oshGet() and oshOpenStream()." is 20 words.

## spec F1: real=True, severity fair=True, fix ok=True

CONFIRMED by mutation in a private copy. src/data/oshRepositoryHygiene.test.mjs:140 is `text.match(/https?:\/\/[^\s'"`)]+/g)`, so `assertOnlyFixtureAddress` never looks at `ws://` or `wss://`. The spec scenario osh-034 (openspec/specs/osh/spec.md:390) says "every scheme-qualified address in them names localhost, a reserved *.example host, or ...", so the test does not prove what the scenario claims for the scheme this change adds. The change's design.md and proposal "Known limits" name no such gap. The cited code exists: `wss://osh.example/...` at src/data/oshLive.test.mjs:346 and ws URL building at server/providers/osh/ids.js:201-204.

Mutations (hygiene test run after each, then restored):
- `// ...wss://osh-prod.corp-internal.net/sensorhub/api/...` (no port) appended to server/providers/osh/live.js: all 7 tests pass (survives).
- `const REAL = 'wss://osh-prod.corp-internal.net/...'` (no port) appended to src/data/oshLive.test.mjs: passes (survives).
- The same with `:8443` in the test file: passes (survives), because BARE_HOST_TOKEN runs only on PROVIDER_FILES.
- The same with `:8443` in a provider file: caught, but only by the bare-host port check, not by the address check.
- Control: `https://osh-prod.corp-internal.net/...` in the test file fails "no OSH test file has a real address", as it should.
- `ws://10.20.30.40/api` in ids.js is caught only by the IPv4 check, again not by the address check.

So constraints 2 and 3 are open for ws and wss in every OSH test file, and in provider files for any host with no port. The diff itself is clean: every added scheme-qualified address is osh.example, app.example or localhost, and no real address is present today. The finding is about the scan gap, not a leak. Severity major is fair: this feature is a WebSocket one, so pasting a live wss URL into a comment or test is a usual edit that no gate or known limit stops.

Proposed fix: OK. In the copy, the regex `(?:https?|wss?):\/\/[^\s'"`)]+` keeps all 7 hygiene tests passing (the hygiene file's own scan is clean because the pattern is written `:\/\/`). It fails every survivor above, and `ws://osh.example/...` and `wss://localhost:9/...` still pass. One minor side effect: `wss?` also matches inside `news://x.y`, which then reads as a real host. A lookbehind such as `(?<![a-z])(?:https?|wss?):\/\/` avoids that; this is optional. In test files `ws://127.0.0.1:port` would also fail, the same as `http://127.0.0.1` does today, so loopback tests must keep using `localhost` in URL text, as oshLive.test.mjs already does. The self-check test must build its `wss://` host from parts, because oshRepositoryHygiene.test.mjs is itself scanned by `oshTestFiles()` (its name starts with "osh"). A new `[osh-034]` test needs its trace link and a ratchet run. No requirement or scenario text needs rewording, because the scenario already says "scheme-qualified".

## spec F5: real=True, severity fair=True, fix ok=True

CONFIRMED. server/providers/osh/live.js:210-216 defines close(), which calls endClients() and drop() on every entry, and line 218 exports it as `{ join, close }`. The only callers are tests. Production has none: in server/providers/osh.js, `hub` is used only at lines 230, 692 and 708, and installMiddleware at lines 482 and 754-758 never touches httpServer. The callers are `t.after(() => rig.hub.close())` about 45 times in src/data/oshLive.test.mjs, `hub.close()` at oshLive.test.mjs:1036 in startProvider's cleanup, and `t.after(() => hub.close())` at oshProxy.test.mjs:257. No scenario names it. openspec/specs/osh/spec.md has osh-067 (last client leaves, 2 s idle close), osh-066 (oversize frame) and osh-069, and none says "end every client, clear every timer, close every socket". The design D65-D71 and the known-limits list do not name it either. No test name mentions it, and nothing asserts on it: the only client `ended` checks are on the unsupported path. Mutation run in a private copy (/tmp/.../live-r1/skeptic-spec-F5): baseline oshLive+oshProxy 117/117 pass. With `function close() {}`, oshLive+oshProxy 117/117 pass, and all 15 osh test files (src/data/osh*.test.mjs, src/layers/osh/*.test.mjs) give 495/495 pass, 0 fail. So the mutation survives; the body's coverage comes from the cleanup hooks only. Severity critical fits the given definition ("code has no scenario or no test"). The real-world impact is small: when the HTTP server closes, each res 'close' event runs leave(), and the 2 s idle timer then drops the entry. Standing constraints 1-5: no violation found in the code this finding cites (no send, no non-GET, no metadata, no real host, no credentials). Fix judgement: the finding's alternatives are sound, and I prefer wiring. (a) Wire it: in installMiddleware, or in configureServer and configurePreviewServer, add `server.httpServer?.on('close', () => hub.close())`. server/providers/vessels/ais-live.js:163-170 already does this for the same reason (in-process Vite restart stacks sockets and timers). Then add an ADDED scenario to the change, with a new osh id and a trace entry, saying that closing the provider ends every client, clears every timer and closes every socket. Add a hub test with the existing rig (makeRig, fakeClient with `ended`, `socket.closeCalls`, `rig.timers.pending()`). It joins two datastreams, opens one socket, and leaves one entry with a retry or stable timer pending. After hub.close() it asserts each client `ended === 1`, each socket `closeCalls === 1`, `rig.timers.pending() === 0`, a later `leave()` is a no-op, and a later join opens a fresh socket. Add a second test where a fake httpServer (an EventEmitter) emits 'close', or a route-level test, so the new wiring line is not itself unasserted. Run mutations `close(){}`, dropping `endClients`, and dropping `drop`; each must fail a test. (b) Removing close() and cleaning up via leave() also works, but it touches about 45 test hooks. The real-timer loopback test would then rely on the 2 s idle timer after the test ends, and production would have no deterministic shutdown. So (a) is the better option. Either is acceptable, and keeping close() with no scenario and no test is not.

## spec F6: real=True, severity fair=True, fix ok=True

CONFIRMED. Every cited line is as described. src/layers/osh/index.js:14 sets MAX_LIVE_STREAMS = 8; :232 opens one source.openLive() (one EventSource, src/layers/osh/source.js) per datastream, up to 8. index.js:282 is the poll's `await source.getObservation(state.id)`; a state with no observation is always fetched, so on the first poll all of them are. :293 `_shownStates = states` runs only after that loop. The only two detail writers are :216 (guarded by `if (_shownStates)`) and :294 (after the loop), and applySelection writes no detail for a system, so a hung poll leaves the detail blank whatever the streams deliver. Nothing sets https or http2: build/vite.js (which server/standalone/vite.config.js calls) has no such key, Vite 6.4.3 serves plain HTTP/1.1, and the Dockerfile runs `npm run dev`. compose.yaml publishes that Vite port directly, and README, SECURITY.md and docs document no TLS or HTTP/2 front. Browsers keep about 6 connections per origin over HTTP/1.1, and a never-ending EventSource holds its slot. src/layers/osh/source.js is the only EventSource user in src/ and server/, so these are the app's first long-lived same-origin connections. The streams are created before the first getObservation in the same tick, so they take the slots first. With 6 or more datastreams, the poll fetch, the 15-second getDatastreams poll (index.js:249) and every other same-origin /api fetch of every layer queue behind streams that never end. Nothing in the repo names the limit: I grepped design.md, proposal.md (known limits list), the delta spec and the synced spec, the tests and the source for six, connection limit, per origin, HTTP/1 and HTTP/2, and only matched the unrelated 8-socket and 16-client hub limits. The tests use a fake EventSource and cannot show it. I modelled it in a private copy (scratchpad/live-r1/skeptic-spec-F6). A fake source whose getObservation never resolves once 6 streams are open, with 8 datastreams and every stream open and delivering a live observation, gave 8 streams opened and detail.innerHTML of length 0. So the layer has no path that draws the detail without the poll finishing. Severity major is fair: a normal system with 6 or more datastreams triggers it, no gate stops it, and no known limit names it. Fix is acceptable, with corrections. (1) The sound fix is one multiplexed stream per selection: `/api/osh/live?system=<id>` or repeated `datastream=` parameters, with each event carrying its datastream id and the hub joining the one client to each datastream entry. That uses 1 connection whatever the count. (2) A cap of 3 or fewer works and is a one-line change, because a datastream with no open stream (`state.open` false) already gets the poll. It only halves the per-origin pool, and the limit is per browser across tabs, so two tabs selecting OSH systems still fill it. It also means editing the scenario text 'at most eight' in osh-072 (design.md D70 and the delta spec), the MAX_LIVE_STREAMS comment and the test title 'first eight'. That edit is safe here because the requirement is ADDED in this unmerged change, not MODIFIED. (3) A cheap extra hardening is to set `_shownStates` and draw the detail as soon as the datastreams are known, so live events never wait on the poll loop. (4) Whichever fix is chosen, name the residual limit in the proposal's known-limits list (for example `osh-live-browser-connection-limit`) with the number.

## spec F3: real=True, severity fair=True, fix ok=True

CONFIRMED by mutation. Cited text exists: server/providers/osh/live.js:113-119 (relay) runs the size check on line 114-116 before JSON.parse. Every oversize test frame is a valid JSON observation with a `result`. That is the table at src/data/oshLive.test.mjs:475-501 (binaryOf(frameOfSize(65537)), JSON.stringify(frameOfSize(65537)), a two-byte-character JSON with a result), the tests at :503 and :525 (binaryOf(frameOfSize(70_000))), and the loopback test at :1131 (wsFrame(2, JSON.stringify(frameOfSize(70_000)))). frameOfSize (:181-184) always returns {...FRAME, result:{pad}}. The non-JSON and no-result tests at :428-451 use tiny frames and only assert that no event comes and the stream stays open.

I ran mutations in a private copy (/tmp/.../live-r1/skeptic-spec-F3/copy), running oshLive, oshProxy and oshRepositoryHygiene tests (124 tests each run). Baseline 124/124 pass. Mutation A, size check after JSON.parse: 124/124 pass, survives. Mutation B, size check only after the `result` check: 124/124 pass, survives. No other test file uses live.js. The spec scenario osh-066 says "a frame with more than 65536 bytes closes the upstream socket" with no condition on content, and design.md:50 says the check exists to protect from a video datastream. A video frame is not JSON, so under A or B it would be dropped by the catch and the stream would never send `unsupported`. The mutation battery V11/V12 in tasks.md names only "remove the size check" and "do not refuse", and the known limits (osh-live-video-not-decoded etc.) do not name the order. So an author can hide the gap with a usual reorder that the gates do not stop. Major is fair: the motivating input, a binary non-JSON video frame, is the untested one.

Proposed fix works. I added four cases to the existing table in the private copy: a 65537-byte binary non-JSON (Uint8Array fill 0xff, .buffer), a 65537-char text non-JSON, a text JSON with no `result` and 65537 bytes of pad, and a binary JSON with no `result`. The tests pass on the real code (35/35). They fail on mutation A, mutation B, mutation C (binary checked first, text parsed first) and mutation D (the reverse). Each of the finding's three cases is needed: the JSON-no-result case is the only one that kills mutation G (the catch block also checks size, but the check stays after the `result` check), which survives with only the two non-JSON cases. Recommended: extend the table in '[osh-066] a frame of more than 65536 bytes closes the socket and gives the event unsupported' (keeps the name, and the loop already asserts closeCalls===1, ended===1, no pending timers), using synthetic data only. Optionally add a loopback variant with wsFrame(2, Buffer.alloc(70000, 0xff)); the wsFrame helper already supports the 64-bit length. No repository file was changed; the private copy's live.js was restored.

## spec F4: real=True, severity fair=True, fix ok=True

CONFIRMED. All citations exist as described: live.js:67 is the `[entry.idleTimer, entry.retryTimer, entry.stableTimer]` list in drop(), live.js:80-81 is `timers.clearTimeout(entry.stableTimer); entry.stableTimer = null;` in down(), and the reset test is src/data/oshLive.test.mjs:772-795 (the finding writes only the basename). I mutated a private copy (/tmp/.../live-r1/skeptic-spec-F4); the repo is untouched.

(a) Mutation: remove `entry.retryTimer` from the drop() list. All 495 tests of src/data/osh*.test.mjs and src/layers/osh/*.test.mjs still pass. No test leaves the last client while a retry wait longer than 2 s is pending. The 1 s and 2 s waits fire before or at the idle drop, and the 2 s retry is inserted before the idle timer, so it wins the tie. The consequences are real. In my run, a retry pending at the idle drop fires `connect()` on the dropped entry and opens an orphan socket. That socket has closeCalls 0 and is not counted in `entries`, so the limit of 8 ignores it. A third join then opens a duplicate socket, because the orphan's later `down` runs `entries.delete(id)` and removes the newer live entry. `hub.close()` then reaches only one socket and leaves the other two open. The mutant violates osh-067 (socket closes 2 s after the last client leaves) and osh-069 (reconnect only "while a client listens"). Neither the V1-V23 ledger in tasks.md nor the known limits in proposal.md names this gap.

(b) Mutation: remove the stableTimer clear and null in down(). All 495 tests still pass. Trace: the test closes at 29.999 s and picks the 8 s delay before the stale timer fires, and the stale reset to attempt=0 is never observed because a real reset follows after 30 s of open. With the mutant, a socket that closed before 30 s (open at 0, close at 10 s) has its stale timer reset the backoff to 0 at 30 s. The next failed socket then waits 1 s instead of 2 s. That contradicts D68 ("a socket that stays open for 30 seconds resets the delay"). Removing the other timers from drop() (idleTimer or stableTimer) is killed by the existing tests, so only retryTimer in drop() and the stableTimer clear in down() are the gaps.

Severity major is fair. Each gap is a one-token deletion of a clean-up call. 100% line and branch coverage cannot stop it because the lines still run. The design and tasks name neither gap. The code does have scenarios and tests, so critical does not apply. It is not minor either, because it needs no unusual input.

Fix is right. I ran the proposed tests. On the original code both pass. Test (a) is: fail sockets 0, 1 and 2 with waits of 1 s and 2 s, so a 4 s retry is pending; leave; advance 60 s; assert instances.length === 3. It fails on mutant (a), and my extra test of the orphan deleting a newer entry fails too. Test (b) is: open, close at 10 s, wait 1 s for socket 1, advance to 30 s after the first open, fail socket 1, assert no socket at 1999 ms and one at 2000 ms. It fails on mutant (b). Two notes on wording. The pending() === 0 assertion in (a) does not catch the mutant, because the orphan fake socket sets no timer. The socket-count assertion does the work, so keep it. The "fail again at 30 s" in (b) must be measured from the first open, or later. Tag the new tests [osh-067]/[osh-069] and add the ids to openspec/trace as text (never round-trip the JSON).

Standing constraints spot-check: no `send` call in server/providers/osh (only comments); oshOpenStream is the only socket builder. Nothing else was checked for this finding.

## spec F2: real=True, severity fair=True, fix ok=True

CONFIRMED for osh-039; the [osh-021] half is only a minor task-line gap. Details:

**What is real**
- openspec/specs/osh/spec.md:424 (osh-039 WHEN) says "the four files that `osh-005` discovers". The same change makes osh-005 pin five files (spec.md:36; proposal.md:24 says "four files to five").
- The [osh-039] test (src/data/oshProxy.test.mjs:1038-1055) pins five files with live.js and scans it. The base pinned four; `git diff origin/main` adds only the live.js line.
- The delta (archive/2026-09-24-osh-live-observations/specs/osh/spec.md) has a MODIFIED entry only for "GET only" (osh-004, 005, 006). There is none for "Query construction" (osh-037 to 040).
- tasks.md 2.1 names only [osh-005]. Nothing mentions [osh-039].
- No gate catches this. In a private copy at .../scratchpad/live-r1/skeptic-spec-F2, loadSpecs and checkArchivedChange gave 0 errors on the stale text. The registry check in registry.mjs runs one way only: changed spec text needs a changed test, but a changed test with stale text passes.
- Neither the proposal's known limits nor design.md D71 names the stale count.
- So the "major" rating fits: a usual edit (bumping a pinned count in a test) leaves the spec wrong and the gates pass.

**The osh-021 part is weaker**
- The [osh-021] allowlist did change to `['env','fetchImpl','liveHub','now','warn']` (oshProxy.test.mjs:911-916).
- The osh-021 scenario text names no option list, so it is not stale and needs no MODIFIED entry. The route still uses the fixed pair `observationUrl`/`assertObservationUrl`.
- A task line for it is documentation only. No gate requires one, because SPEC-LINT-NO-TASK checks only IDs that are in the delta.
- tasks.md 2.4b already records the same kind of edit for [osh-034].

**Fix**
- I applied the fix in the private copy. checkArchivedChange gave 0 errors, and scenario osh-039 was the only one whose hash differed from ids.json.
- The existing [osh-039] test diff already satisfies the changed-test rule (idsOfChangedTests compares test text with the base), so no new test edit is needed.
- Correct fix:
  1. Add a MODIFIED "Query construction" to the delta, copied byte for byte from origin/main (spec-base-from-main). Do not reword the requirement text: it is part of every scenario hash, so osh-037, 038 and 040 would rehash and need changed tests. Change only the osh-039 WHEN line, to "the five files that `osh-005` discovers" or, more robustly, drop the count.
  2. Sync the same text into the main spec and run `make ratchet` (only osh-039's hash changes in ids.json).
  3. tasks.md must name all four IDs osh-037, osh-038, osh-039 and osh-040 in 1.1, as it does for osh-004 and osh-006. The finding's "task lines for [osh-039]" is not enough. I ran lintSpecs on the corrected delta and it gave SPEC-LINT-NO-TASK for all four.
  4. Add a proposal.md line for the osh-039 change.
  5. A task line for [osh-021] is optional.

**Constraint scan (not exhaustive)**
- The provider files have no `send(` call.
- The added URLs are only osh.example, app.example, localhost and fixture credentials.
- I found no violation of constraints 1 to 5.
