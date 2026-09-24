Verdict: FAIL
- [ ] S43 major openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:9 "each recorded upstream call has method `GET`, no body and an `AbortSignal`" Two meanings, and the line disagrees with line 10 and with the code. This is a new fault from the F6 correction. The WHEN (line 8) now says "the systems, datastreams, observations and live routes, so that each upstream call runs". So "each recorded upstream call" now includes the WebSocket call. That call has no method, no body and no `AbortSignal`, because `oshOpenStream()` (get.js:124) passes `{ headers }` only. Line 10 says exactly that, so lines 9 and 10 contradict each other for the live call. The extended [osh-004] test in oshProxy.test.mjs asserts method, redirect and `AbortSignal` for the fetch calls only, and `['headers']` for the socket. The same text is at openspec/specs/osh/spec.md:31. Write: "**THEN** each recorded fetch call has method `GET`, no body and an `AbortSignal`". Keep the WHEN and the AND as they are. Edit both spec copies in the same way. The osh-004 hash in the trace changes, so ratchet it, and edit the trace file as text.
- [ ] S44 minor openspec/changes/archive/2026-09-24-osh-live-observations/proposal.md:44 "So a socket that no longer works leaves the last observation in the detail, with the age that the hub sent." This is round-2 S32 with only half of the correction applied. The socket does not leave an observation in the detail, and design.md:85 now says something different for the same fact. Write: "So the detail keeps the last observation, with the age that the hub sent."
- [ ] S45 minor openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:132 "clears each timer of the hub" This is round-2 S36 with only half of the correction applied. The two AND lines below it now say "the provider". So "the hub" is a second name for one thing in the same scenario, and it is the only use of "hub" in the spec. Write: "the provider ends the response of each client and clears each of its timers". The same text is at openspec/specs/osh/spec.md:664.
- [ ] S46 minor src/data/oshLive.test.mjs:850 "the hub clears the wait for a new socket when the entry drops after the last client leaves" Verbs. "wait" is a verb that the name uses as a noun, and "the entry drops" gives the entry an action that the hub does. My round-2 S40 text had this fault. The test is new in this change, so a rename is allowed. Write: "the hub clears the timer of the next socket when it removes the entry after the last client leaves". Ratchet the trace after the rename.

Note: I had no shell in this session (Read, Grep and Glob only), so I ran no test and no mutation. I checked the changed code and tests by reading them.

Checked and correct:
- S26 (osh-066 bounded lines) is correct in the spec, design and tasks, and in the test names.
- S27 (control frames) is correct, and the ping fixture matches the claim.
- S28, S29 to S35, S37 to S39, S41 and S42 are applied as written.
- F5 (osh-075 timers), F7 and F8 (`code 0`) agree with live.js and the tests.
- The renamed tests are new in this change. The existing [osh-004] test in oshProxy.test.mjs keeps its name.
- The five standing constraints hold: no `send` call, a loopback server only, synthetic ids only, and no credential in the browser.

Outside the diff (not findings, no severity):
- proposal.md:42 "the poll runs as today" is the S35 defect ("as today" refers to a date). The diff corrects the other places only.
- tasks.md:93 still says "The `open` event of the connection". The spec line 127 now says "the event `open` that the browser raises with no data".
- design.md:80 (D71) says the loopback server "sends binary and text frames". The fixture now also sends a ping, as tasks.md:29 says.
- tasks.md lists V33 to V36 and has no V37. The lead's summary names V33 to V37. Add the V37 line if that mutation ran.
