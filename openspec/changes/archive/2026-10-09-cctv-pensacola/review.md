# Review: cctv-pensacola

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-09
Gates: make gates CHANGE=cctv-pensacola passed
Rounds: 5
Scope: diff 228f7221
Reviewed-Tree: 304e3acc14a798f3e2b92cfc8ea64c02ea54470074ef5628b018c7044fe59c9b

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.
Before the code, the two agents reviewed the plan three times (pre-reviews 1 to 3). The reports are outside the repository, in `/home/ianblenke/docker/gev-tools/cctv-pensacola/` (`pre1-spec.md` to `pre3-ste.md`).

Verdicts (spec adversary / STE adversary): pre-review 1 FAIL / FAIL; pre-review 2 FAIL / FAIL; pre-review 3 FAIL / FAIL; round 1 FAIL / FAIL; round 2 PASS / PASS.
The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

### Plan pre-reviews 1 to 3

- [x] FINDING major (spec-adversary and ste-adversary) The plan had false or open statements: a requirement that contradicted the cap scenario, an AND line after WHEN that read as a second condition, a false cap sum, a text longitude and the north and west edges that no case tested, and pose, timeout and field values that no scenario pinned. Each major was corrected in the next pass. The plan grew from 17 to 21 scenarios.
- [x] FINDING minor (spec-adversary and ste-adversary) Wording, labels, undecided inputs and counts. The lead corrected most of them.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING major (spec-adversary and ste-adversary) The fault list named a failing test, "handles HTTP error with body", that does not exist after the titles gained the status. Corrected: the lead ran the fault of live-sources-021 again on the final tests, and checked each failing-test title of the file against the 85 real titles.
- [x] FINDING major (spec-adversary) Box 5.2 was checked, but only dead channels had gone through the frame route. Corrected: `evidence/live-check.txt` has a third run with two channels that serve a frame (HTTP 200, image/jpeg, source upstream-image).
- [x] FINDING major (spec-adversary and ste-adversary) The Known limit `mutants` said that a catch block covers two optional calls. It covers one. Corrected in `proposal.md`.
- [x] FINDING minor (spec-adversary) A JSON body of null, the warning count, the environment of the catalog tests, and three behaviors with no scenario. Recorded as the Known limits `null-body`, `warning-count`, `test-env` and `unpinned` of `proposal.md`.
- [x] FINDING minor (spec-adversary and ste-adversary) Two claims of the documents had no evidence in the change ("720x480", "FDOT does not host the layer"), and some wording was unclear. Corrected: the documents lost the first claim, and `evidence/research-2026-10-08.txt` quotes the research for the second.

### Round 2 (scope diff 228f7221) - PASS / PASS

- [x] FINDING minor (spec-adversary and ste-adversary) The facts of the research of 2026-10-08 had no file in the change, a bullet of `DATA_SOURCES.md` had 7 sentences, and some words could refer to two things. Corrected in `proposal.md`, `DATA_SOURCES.md`, `.env.example` and the new evidence file. The same research shows that its figure of 60 fresh frames had no probe record.
- [x] FINDING minor (ste-adversary) The 85 test titles lack articles and some use vague verbs, and the comment in `server/providers/cctv/pensacola.js` has a sentence of 30 words. The lead keeps both: a change of a title or a code file needs a new image ratchet. The agents rate them minor.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=cctv-pensacola` in the Docker image `gods-eye-view:local` on commit `732decc3e58b262067b73c0f05ca113dfa3664d0`. Its log starts with `Command: ratchet`. The verdict lines are:

```text
Command: ratchet
Trace: 935 scenarios, 935 verified, 0 open. 9685 tests, 3789 traced, 5896 untraced.
QA: scripts/qa-voice-auth-focus.mjs uses the synthetic header with the covers item unmapped: upstream.
QA: scripts/qa-voice-auth.mjs uses the synthetic header with the covers item unmapped: upstream.
QA: no script covers the capabilities of this change.
Coverage: 1068 files, 297 complete, 104 not loaded, 51 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 769 code files, 56328 lines, 497 test files, 5896 tests.
COVERAGE-DIFF: 161 changed lines, 0 brought by the merged upstream commit, 161 need coverage.
Ratchet: 2 history lines for cctv-pensacola.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 908 warnings.
ERROR REVIEW-MISSING openspec/changes/cctv-pensacola/review.md Change cctv-pensacola has no review.md
Gates failed with 1 errors.
Finished: 2026-10-09T23:04:26.569Z (1657.558 s)
```

The only error was the missing `review.md`. The ratchet added two lines to `history.jsonl` (the hash and the totals of `catalog.js`) and recorded the IDs `live-sources-010` to `live-sources-030` in `ids.json` and the links in `links.json`. The gap of `catalog.js` stayed at 17 lines, 6 branches and 0 functions, so this change opens and closes no gap.

The command `make gates-docs CHANGE=cctv-pensacola` on the archived tree (commit `228f7221`) gave these lines. The mode runs no test. It trusts the snapshot of commit `732decc3`.

```text
NO TEST RUN: the mode trusts the snapshot of commit 732decc3e58b262067b73c0f05ca113dfa3664d0
Trace: 935 scenarios, 935 verified, 0 open. 9685 tests, 3789 traced, 5896 untraced.
Coverage: 1068 files, 297 complete, 104 not loaded, 51 untrue.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 919 warnings.
ERROR REVIEW-MISSING openspec/changes/archive/2026-10-09-cctv-pensacola/review.md Change cctv-pensacola has no review.md
Gates failed with 1 errors.
```

After the ratchet the lead changed only documents and evidence, and some of them lie outside the three paths of the document gates. So the lead ran the final `make gates` on the final tree and did not use `make gates-docs` again.

## Known limits for the owner to confirm

The owner has not yet answered for these entries. The pull request asks for confirmation.

- [x] FINDING minor (lead) Only 17 of the 65 cameras of the pack area serve a frame today. The other 48 answer HTTP 404, and the frame route shows a placeholder for them. The file `evidence/frame-census.txt` lists each channel. The owner decides whether 17 cameras justify the pack.
- [x] FINDING minor (lead) FL511 limits its content to individual non-commercial use. The layer comes from an account that is not FDOT and has no license text. Each camera carries the limit in its `license` field, and `DATA_SOURCES.md` names it. The owner decides whether to keep the pack.
- [x] FINDING minor (lead) The change adds no entry to `src/data/dataCredits.js`, because the coverage of that file is untrue and a changed line there raises an error that no waiver clears. The Known limit `credit` of `proposal.md` records it.
- [x] FINDING minor (lead) Upstream pull request 605 adds a Florida pack from the same layer with the same ids. A later change retires this pack after the sync that brings that pull request (limit `florida-pack`).
- [x] FINDING minor (lead) The 22 changes of the automatic mutation run that no test fails are in `evidence/automatic-mutations.txt` (limit `mutants`). The lead classified all of them.
- [x] FINDING minor (lead) Tasks 5.5 to 5.7 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
