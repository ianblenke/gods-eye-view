# Review: osh-buffer-test-steady

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-25
Gates: make gates CHANGE=osh-buffer-test-steady passed
Rounds: 2
Scope: diff 44118df
Reviewed-Tree: b031e01609981efbbb06712420052d065c0101ff43f02f3697adcfc172c0b943

## Findings

- [x] Round 1 spec-adversary F1 (major) and ste-adversary S1 to S4 (major): the design said "double the limit" for a mutation that raises the limit 200 times; the tasks named `[osh-090]`, which five tests carry; "stops after 40 messages" had two readings; and the text did not separate the proven fact from the likely reason. All corrected. The lead ran the three mutations again on the test with real HTTP clients alone, and it failed each time.
- [x] Round 1 minor findings (spec F2 to F5, STE S5 to S23): corrected in the three documents, or named as the known limits `osh-buffer-test-comments`, `osh-buffer-test-exact-limit` and `osh-buffer-test-lagging-reads`. A change of a comment in the test file needs a new ratchet, so the comments stay.
- [x] Round 2 spec-adversary F1 to F3 and ste-adversary S1 to S14 (minor): both verdicts are PASS. The lead corrected each finding in the three documents, and no code file or test changed.
- [x] Scope: round 1 read the whole change, and round 2 read the diff since the commit `44118df`. The code and the test did not change in round 2.
- [x] Trace: no test name, scenario or gap changes. The ratchet passed with 366 scenarios verified and 0 open, and the trace files are unchanged.
- [x] Constraints: the change edits one test file. It adds no request method other than GET, no `send` in a provider file, no network call except on loopback, and no name or ID of the owner's server. No test is renamed.

## Evidence

- [x] In the CI run after the merge of `osh-camera-video` (run 36087382532), the jobs "Spec gates" and "Node 24.14.0" failed at the test `[osh-090]` with real HTTP clients, on the assertion `closed.includes('steady')` with `true !== false`. The job "Node 26.x" passed.
- [x] The old test passed on the machine of the lead, in the Docker image of `make gates`, and on one CPU core with a slow client that reads. The reason for the failure is not proved (known limit `osh-buffer-test-cause-unproved`). The acceptance is the CI run of the push of this change.
- [x] The fixed test passed six times on one CPU core. Mutations B1 (no check), B2 (limit of 1677721600) and B3 (no call of `res.destroy()`) each fail the fixed test.

## Coverage of the changed code files

No code file changes. The changed file is a test file, `src/data/oshLive.test.mjs`.
