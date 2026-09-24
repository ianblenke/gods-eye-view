Verdict: PASS

I had only Read, Grep and Glob in this session. I ran no test, mutation or lint, and I could not read the commit id. I read the working tree of `/home/ianblenke/docker/gev-live`, branch `osh-live-observations`. I checked the tests, the STE limits (25-word sentences, 20-word tasks) and the mutations V33 to V36 by hand.

Round-2 corrections that I checked and that are right:
- **Spec F1 and S27:** all six "only frame" places now say "no message frame" plus "the runtime sends only control frames". No "only frame" wording is left outside the review folder. The loopback fixture sends a ping. The test asserts opcodes `[10]` while it listens and `[10, 8]` after the close. `closeFrameAt` fixes the old timing check.
- **Spec F2:** the two new `[osh-068]` tests fail V33, V34 and V35 by hand trace. The 1999 ms and 2000 ms steps pin the lower and upper bound.
- **Spec F3 and F4, S29 to S42:** the renames give no STE finding by hand check. Every renamed test is new in this change. The task order is right: 2.1e, 2.4d and 2.4e come before 2.5, and 2.8b is a code task.
- **Spec F5 to F8, S26, S28:** the scenario texts are bounded. The `[osh-004]` route test in `oshProxy.test.mjs` fails on V32 by hand trace.
- **Trace and constraints:** the trace links agree with the new tests. Standing constraints 1 to 5 hold: no `send` call, no stream metadata, and loopback on 127.0.0.1 only.

Minor findings, to accept by name or to correct:
- [ ] F1 minor `/home/ianblenke/docker/gev-live/server/providers/osh/live.js:20` The comment "At most this many datastreams hold an upstream socket" is wrong under the new text. The spec, D65 and proposal now say a datastream counts while its socket connects or waits to try again, and in that wait it holds no socket. The changed comments at lines 7 to 11 are in the same file. The exported name `OSH_LIVE_MAX_SOCKETS` has the same wording. Fix: write "At most this many datastreams count toward the limit". Renaming the constant is optional.
- [ ] F2 minor `openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:107` "counts ... until two seconds after its last client leaves" is written as an exact bound, but the code frees the place earlier. The same text is in synced `openspec/specs/osh/spec.md:639`, design.md:36 and proposal.md:46 ("keeps its place for two seconds").
  - `down()` drops the entry at once when the socket closes or fails while no client listens (live.js:86-89). The test at `oshLive.test.mjs:907` shows this path.
  - `refuse()` drops the entry at once (live.js:111).
  - No socket stays open in either case, so the effect is harmless, and no test asserts the count on these paths. Fix: write "for at most two seconds", or name the two early drops.
- [ ] F3 minor `openspec/changes/archive/2026-09-24-osh-live-observations/proposal.md:31` "Each datastream holds one upstream socket" is false while the datastream waits to try again, and design.md:36 says so. Write "at most one upstream socket".
- [ ] F4 minor `openspec/changes/archive/2026-09-24-osh-live-observations/tasks.md:84` The list of mutations ends at V36, but the round report names V33 to V37. Add the V37 line to task 2.9, or make the mutation report of `review.md` list only V1 to V36. Task 2.9b needs the two lists to agree.
- [ ] F5 minor `openspec/changes/archive/2026-09-24-osh-live-observations/design.md:80` D71 says the fixture "sends binary and text frames". It now also sends a ping, and the pong claim of osh-065 depends on that ping. tasks.md:29 already says so. Add "and a ping".

The only gate error is REVIEW-MISSING, which is expected until the caller writes `review.md`.
