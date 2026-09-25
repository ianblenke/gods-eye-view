Verdict: FAIL

Findings:
- [ ] F1 (major) The design names a mutation that does not fail the changed test: `design.md:28` says the mutations that "double the limit" fail the test, but a doubled limit passes it. A limit of 16777216 bytes gives a destroy at the 8th message, because each event is about 2666700 bytes (base64 of 2000000 bytes plus framing). That is well inside the cap of 40 messages, so the real-HTTP test stays green. The tasks (`tasks.md:10`) and the lead ran 1677721600, which is 200 times the limit, not double. Fix: write "raise the limit to 1677721600" in `design.md:28`. Add that the exact limit (8388608 stays, 8388609 is destroyed) is pinned by the other `[osh-090]` tests with a fake response, not by this test.
- [ ] F2 (minor) The tasks do not name the test that fails: `tasks.md:8` says "`[osh-090]` fails each time". Five tests carry that tag. B2 fails the first one at once, on `assert.equal(OSH_LIVE_MAX_CLIENT_BUFFER_BYTES, 8_388_608)` at `src/data/oshLive.test.mjs:2078`. B1 and B3 also fail the fake-response tests. AGENTS.md rule 13 says to report the test that failed. Fix: write "the test `[osh-090]` with real HTTP clients fails" in task 1.3, if the lead did see that test fail.
- [ ] F3 (minor) The lagging client reads by default: `src/data/oshLive.test.mjs:2175` gives `onData = () => {}`, and `:2180` adds it as a `data` listener. `ask('lagging')` at `:2187` therefore starts a client that drains its response. Only the cork keeps bytes from it. If a later Node version lets corked bytes out, the test fails with a time-out and does not test a non-reading client. Fix: add the `data` listener only when `onData` is given. Otherwise call `response.pause()`. The test then keeps a non-reading client even without the cork.
- [ ] F4 (minor) The wording is stronger than the wait: `proposal.md:13` says "never holds a backlog", and the test comment at `src/data/oshLive.test.mjs:2206` says the same. The wait `steadyFrames === written` ends when the text `event: frame` arrives, so at the first bytes of the message. The tail of a message of about 2.67 MB can still be unread when the next one is written. The claim in `design.md:20` ("at most one message") is correct, and it is far below the limit. Fix: use "at most one message" in the proposal and in the comment. Also change the assertion text "got message N" to "got the start of message N".
- [ ] F5 (minor) The proposal does not name the reach of the 40-message cap: `proposal.md:23-26`. The test can only see a destroy within 40 messages, about 107 MB (40 times 2666702 bytes). A wrong limit between 8.4 MB and 107 MB passes this test. The old test had the same reach, with 60 messages. Fix: add one known limit that says the fake-response tests pin the exact limit.

Checked:
- **Diagnosis and code.**
  - It fits the failing assertion, `closed.includes('steady') === false` giving `true !== false`.
  - It fits `server/providers/osh.js:713-721`. The check runs before each write, and the old loop gave one `setImmediate` per message.
  - It also needs a reader that is slow relative to the 2.67 MB written per message, because the kernel takes the first bytes first. The proposal does not give that mechanism. It is a hypothesis, and the known limit `osh-buffer-test-cause-unproved` covers it. The fix does not depend on it.
- **Cork mechanics.** I did this from my knowledge of Node, not by running code.
  - `res.cork()` calls `socket.cork()`.
  - `res.writableLength` is `outputSize` plus `socket.writableLength`. The corked writes stay in the socket buffer and are counted.
  - Later writes do not uncork it, and `destroy()` emits `close` on `res`.
  - The check comes before each write. After 3 events the length is about 8.00 MB, below 8388608. After 4 events it is about 10.67 MB, above the limit. So the destroy comes at the 5th message, as the design says.
- **Message limits.** The message is 2000000 bytes, below the message limit of 2097152 bytes. A key message resets the group, so the group limit does not apply. The cap of 40 messages is generous.
- **Backlog of the client that reads.** Its backlog at each check is at most the tail of one message, about 2.67 MB. Even three messages (8.00 MB) are below the limit.
- **Order of joins.** A late join of either client only changes the count by one message. `steadyOpen` is awaited before the first message.
- **The changed test against the scenario.**
  - The real `ServerResponse` is destroyed and `closed` gets `lagging`.
  - The client that reads keeps its events, and `steadyFrames` is asserted for each message.
  - `socket.closeCalls === 0` is kept.
  - The line "the hub removes that client" is asserted only by the fake-response tests. It was the same before.
- **Diff.**
  - The test name line is not in the diff, and it matches `links.json:1467`.
  - The only assertion removed is `steadyFrames === written`. It moved into the loop, and the same check now runs for every message.
  - `node:net` is not used elsewhere in the file. A search for `net` in the file finds nothing.
- **Cleanup at the end of the test.**
  - The hooks close the server and connections, destroy both requests, and close the hub.
  - No timer is left. `until` is always awaited.
  - `oshLive.test.mjs` is not in the format scope (`scripts/format-scope.json`).
- **Standing constraints.**
  - Only `GET` is used, and only on loopback.
  - There is no `send` in the diff, no OSH names or IDs, no `.env` change and no network call to OSH.
  - No test was renamed.
- **STE limits.** I counted the sentence, paragraph and task limits in the proposal, design and tasks, and they hold. Proposal paragraph 3 has exactly 6 sentences, and design D2 has 6.
- **Trace.** There is no trace change, no retired ID and no spec delta. A change with no spec and no code is not a backfill.

Could not check:
- I cannot run code, so I could not run the mutations, the six runs on one core, or the gates run after the archive.
- I could not read the CI logs of the failed run.
- I could not confirm the behavior of `res.cork()` on Node 26.x.
