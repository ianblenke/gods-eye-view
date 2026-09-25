Verdict: PASS

Findings:
- [ ] F1 (minor) Known limit does not name the wording that stays in the test: `proposal.md:27` names `osh-buffer-test-comments` for the words "reader" and "the result" only. Three wordings stay in `src/data/oshLive.test.mjs` and are not named in any known limit.
  - The comment at line 2206 says the client that reads "never holds a backlog of its own". The proposal now says "at most one message of unwritten bytes at a check".
  - The assertion text at line 2207 says "got message N". The wait ends at the start of the message, and design D1 now says so.
  - The comment at line 2163 says a corked response acts "as the response of a client that does not read does". The proposal (What Changes, bullet 2) now says a real client grows `writableLength` only after the kernel buffers are full.
  - `skeptics.md` records that the comment at 2206 "stays". Check 10 needs the gap in the section "Known limits and later changes". Fix: add these three wordings to `osh-buffer-test-comments`. A later change can correct them, together with a new ratchet.
- [ ] F2 (minor) The known limit `osh-buffer-test-cork` is loose: `proposal.md:26` says "The provider sees the same `writableLength`". That is not the same value. The cork makes the value grow at once, and a real client grows it only after the kernel buffers fill. This is round-1 S12, second part, and it is not corrected. It also disagrees with `proposal.md:14`. Fix: write "The provider reads the same `writableLength` and calls the same `destroy()`. The value grows earlier than for a real client, and the test checks that."
- [ ] F3 (minor) A rounded number is written as exact: `design.md:28` says "the response has 10666800 unwritten bytes".
  - From the code, each message is 2666691 characters. That is 2666668 base64 characters plus 23 characters of `event: frame` framing. Four messages give 10666764.
  - The real value also holds the response headers, the event `open` and the chunk framing.
  - The count at the fifth message is right: 3 messages give about 8.0 MB, below the limit, and 4 messages give about 10.67 MB, above it. Fix: write "about 10666800 unwritten bytes".

Checked, and correct:
- **Round-1 F1 and S1.** `design.md:32` now says "raise the limit to 1677721600". 1677721600 is 200 times 8388608. It is not a doubled limit.
  - The note that the fake-response tests pin the exact limit is true. Line 2078 asserts the constant, line 2088 uses 8388609, and line 2101 uses exactly 8388608, which keeps the response. Line 2123 uses 8388609 for the live route.
  - B2 raises the limit to 1677721600. 40 messages are about 107 MB, so no destroy comes and the test fails at the `until` wait for `lagging`.
  - B3 keeps the check and removes the destroy. `closed` never gets `lagging`, so the test fails there too.
  - B1 removes the check and fails the same way.
- **Round-1 F2 and S2.** Task 1.3 names the test `[osh-090]` with real HTTP clients. Only that test title contains "real HTTP client", so the name is unique. The task names the real files and lines: `server/providers/osh.js:716-717` and `server/providers/osh/live.js:38`.
- **Mutations removed.** I read both provider files in place. The check, the `res.destroy()` call and the constant `8_388_608` are all intact.
- **Round-1 S3.** The loop is `while (written < 40 && !closed.includes('lagging'))`. The proposal, the design and task 1.1 now say the test stops at the destroy, and after 40 messages only when there is no destroy, and then it fails.
- **Round-1 S4.** The proposal now separates the proven fact, the likely reason and the unproved reason. It says a local run cannot prove the reason. The failed assertion proves the client that reads had a response over the limit. No other path closes that response in this test, because the messages are 2000000 bytes and the message limit is 2097152.
- **Round-1 F3, F4 (comment part) and F5.** All are kept as known limits. `osh-buffer-test-exact-limit` is correct: 40 messages of 2666701 bytes are about 107 MB. `osh-buffer-test-lagging-reads` is correct: line 2180 adds the `data` listener to the client that does not read.
- **STE limits.**
  - I counted each paragraph. Proposal paragraph 4 has 6 sentences, which is at the limit. Design D2 paragraph 2 has 5.
  - Task 1.3 has 20 words, which is at the limit. The other tasks are shorter.
  - Sentences are 25 words or fewer, and inline code is 4 words or fewer.
- **The diff and the constraints.**
  - The diff is documents only. The test file is unchanged since round 1.
  - No test is renamed. The title at line 2147 is unchanged.
  - The import of `node:net` is gone. The imports at lines 1-6 of the test file do not include it.
  - No `.env` value, no OSH name or ID, and no network call appear in the diff.
  - The word "sends" in a known limit is in a document. `[osh-005]` scans only the provider and data `.js` files.
- **Facts in the text.** The CI job names match `.github/workflows/ci.yml`. "Spec gates" runs on the pinned Node, not in the Docker image. That agrees with the text "did not fail in the Docker image".

Could not check:
- I cannot run code. I could not run the six one-core runs or the three mutations, and I could not confirm the gate output after the archive. I relied on the lead's report for those.
- I could not confirm the behavior of `res.cork()` on Node 24 or Node 26. It follows from my knowledge of Node.
- I could not read the CI logs. I could not confirm the reason for the failure, which the documents say is unproved.
- I did not open the `.env` file or any OSH server, as the constraints say.
- Files I read and that matter: `/home/ianblenke/docker/gev-video/src/data/oshLive.test.mjs`, `/home/ianblenke/docker/gev-video/server/providers/osh.js`, `/home/ianblenke/docker/gev-video/server/providers/osh/live.js`, and the three documents in `/home/ianblenke/docker/gev-video/openspec/changes/archive/2026-09-25-osh-buffer-test-steady/`.
