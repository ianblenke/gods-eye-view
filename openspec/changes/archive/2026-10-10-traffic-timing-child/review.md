# Review: traffic-timing-child

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-10
Gates: make gates CHANGE=traffic-timing-child passed
Rounds: 4
Scope: diff 2142b7f5
Reviewed-Tree: f821c02f1c9ceb931286def05f282ae9640f9987c967dbece1d2c72ba6e6ae88

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.
Before the ratchet, the two agents reviewed the plan and the test twice (pre-reviews 1 and 2). The reports are outside the repository, in `/home/ianblenke/docker/gev-tools/cctv-pensacola/` (`ttc-pre1-spec.md`, `ttc-pre1-ste.md`, `ttc-pre2-spec.md` as the message of the agent, `ttc-pre2-ste.md`).

Verdicts (spec adversary / STE adversary): pre-review 1 FAIL / FAIL; pre-review 2 FAIL / PASS; round 1 PASS / FAIL; round 2 PASS / PASS.
The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

### Pre-reviews 1 and 2

- [x] FINDING major (spec-adversary and ste-adversary) The text "MUST have no guard settings" had two meanings and was false: a setting that the test does not set gets the gate value, so the test must set the value "". Corrected in the requirement and in design D2, after the lead read `withGuardEnv` and `installGuard` in `scripts/spec/lib/test-guard.mjs`.
- [x] FINDING major (spec-adversary) Three parts of `coverage-gate-101` had no fault that fails the test, and the proposal said that the gate stays as strict as before. Corrected: the child writes the file "scenario-done.json" with its process number, the test compares it with the number that `spawnSync` gives, and the Known limit `child-unguarded` says what the gate no longer sees in the child.
- [x] FINDING major (spec-adversary) The design said that each run of `make` deletes the folder of the guard record. Only the gate targets do. Corrected.
- [x] FINDING minor (spec-adversary and ste-adversary) The child inherited NODE_TEST_CONTEXT from the gate and wrote binary frames, the call had no time limit, the guard record had no copy in the change, and some wording was unclear. Corrected in the test, the proposal, the design and the new evidence files.

### Round 1 (scope full) - PASS / FAIL

- [x] FINDING major (ste-adversary) The words "after its last check" had no fault that can make the test fail: a child that wrote the file first would pass. Corrected without a change of the scenario text, so the ratchet stays valid: the child writes the final diagnostics of the traffic timing into the file, and the parent compares the whole file with a literal object. The new fault "Write the file before the scenario runs" fails the test.
- [x] FINDING minor (spec-adversary and ste-adversary) The fault run, the host checks and the timing had no record in the change, the proposal said "no file" for a change that adds evidence files, and the leak check was missing in the Known limit `child-unguarded`. Corrected: the evidence files `mutations-run.txt`, `host-checks.txt` and `timing.txt` hold the records, and the texts say "no code file".

### Round 2 (scope diff 2142b7f5) - PASS / PASS

- [x] FINDING minor (spec-adversary and ste-adversary) The proposal and the design did not list that the parent also checks the final diagnostics, a label of the fault run was wrong, and the fault script had no copy. Corrected: `evidence/mutations-script.txt` holds the script.
- [x] FINDING minor (spec-adversary) The scenario names the process number only, and the test also compares the final diagnostics. The lead keeps the scenario text, because a change of the text needs a new image ratchet. The Known limit `child-unguarded` names it.
- [x] FINDING minor (spec-adversary) The old upstream lines of the comment before the wait of 750 milliseconds say that the test process must show no live timer. The new line below them says that the wait now lets the child exit. The lead keeps the old lines to keep the change to the upstream file small.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=traffic-timing-child` in the Docker image `gods-eye-view:local` on commit `06a0f21ca8e8b718382b6f4bd8c82428664273da`. Its log starts with `Command: ratchet`. The verdict lines are:

```text
Command: ratchet
Trace: 936 scenarios, 936 verified, 0 open. 9685 tests, 3790 traced, 5895 untraced.
QA: scripts/qa-voice-auth-focus.mjs uses the synthetic header with the covers item unmapped: upstream.
QA: scripts/qa-voice-auth.mjs uses the synthetic header with the covers item unmapped: upstream.
QA: no script covers the capabilities of this change.
Coverage: 1068 files, 306 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 769 code files, 56328 lines, 497 test files, 5896 tests.
COVERAGE-DIFF: 0 changed lines, 0 brought by the merged upstream commit, 0 need coverage.
Ratchet: 178 history lines for traffic-timing-child.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 931 warnings.
ERROR REVIEW-MISSING openspec/changes/traffic-timing-child/review.md Change traffic-timing-child has no review.md
Gates failed with 1 errors.
Finished: 2026-10-10T01:12:38.657Z (1652.862 s)
```

The only error was the missing `review.md`. The ratchet recorded 178 lines in `history.jsonl` and the scenario ID `coverage-gate-101` in `ids.json` and `links.json`.
The guard records of that run hold 0 violations in 927 files (`evidence/guard-check.txt`). Before the change, one guard file held 51 violations COVERAGE-FAKE (`evidence/guard-record.txt`).
The ledger changed for 51 entries (`evidence/ledger-change.txt`): the untrue mark is gone from all of them, and the uncovered lines of all entries fell from 56328 to 46573. Nine entries left the ledger. The entry of `src/data/dataCredits.js` fell from 475 to 23 uncovered lines.

The command `make gates-docs CHANGE=traffic-timing-child` on the archived tree (commit `795033ee`) gave these lines. The mode runs no test. It trusts the snapshot of commit `06a0f21c`.

```text
NO TEST RUN: the mode trusts the snapshot of commit 06a0f21ca8e8b718382b6f4bd8c82428664273da
Trace: 936 scenarios, 936 verified, 0 open. 9685 tests, 3790 traced, 5895 untraced.
Coverage: 1068 files, 306 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 760 code files, 46573 lines, 497 test files, 5895 tests.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 936 warnings.
ERROR REVIEW-MISSING openspec/changes/archive/2026-10-10-traffic-timing-child/review.md Change traffic-timing-child has no review.md
Gates failed with 1 errors.
```

After the ratchet the lead changed the test file and documents, without a change of the title, the scenario ID or the scenario text. So the lead ran the final `make gates` on the final tree and did not use `make gates-docs` again.

## Known limits for the owner to confirm

The owner has not yet answered for these entries. The pull request asks for confirmation.

- [x] FINDING minor (lead) The child process has no guard. The gate counts the assertions of the parent test only and checks the leaks of the parent only. A deleted assertion of the scenario in the child does not stop the gate, and a child that writes the expected file by hand also passes (limit `child-unguarded`). The code that the Vite server changes is still not counted.
- [x] FINDING minor (lead) After the ratchet, 39 ledger entries show branch gaps with 377 branches in all, and 20 entries show function gaps with 65 functions in all. The untrue entries had no such numbers. The code of those files did not change (limit `new-numbers`).
- [x] FINDING minor (lead) The test file is upstream code, so a later sync can conflict with this change (limit `upstream-test`). The change to the file is 50 lines.
- [x] FINDING minor (lead) The Pensacola pack can now get its data credit in `src/data/dataCredits.js`, with a test for the changed lines. This is a later change.
- [x] FINDING minor (lead) Tasks 3.3 to 3.5 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
