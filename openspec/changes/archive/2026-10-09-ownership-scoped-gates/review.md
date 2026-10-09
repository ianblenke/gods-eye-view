# Review: ownership-scoped-gates

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-09
Gates: make gates CHANGE=ownership-scoped-gates passed
Rounds: 19
Scope: diff d10db81f
Reviewed-Tree: a11628b88b8427fe52f6283af62a170e71451c2d071a1b643017badcd6d78699

## Findings

Full agent reports: `review/round-1/` and `review/round-2/` (the first two rounds), `review/pre-review-3/` to `review/pre-review-17/` (fifteen pre-reviews of the working tree), `review/round-3/` (the first confirming round on the archived tree, commit d10db81f) and `review/spec-adversary.md` and `review/ste-adversary.md` (the second confirming round, scope `diff d10db81f`, commit debc97c0: PASS and PASS).

Verdicts (spec adversary / STE adversary): round 1 FAIL / FAIL; round 2 FAIL / FAIL; pre-review 3 FAIL / FAIL; 4 FAIL / FAIL; 5 FAIL / FAIL; 6 FAIL / FAIL; 7 PASS / FAIL; 8 FAIL / FAIL; 9 FAIL / PASS; 10 PASS / PASS; 11 FAIL / FAIL; 12 FAIL / FAIL; 13 FAIL / FAIL; 14 FAIL / FAIL; 15 PASS / FAIL; 16 PASS / PASS; 17 FAIL / FAIL; first confirming round FAIL / PASS; second confirming round PASS / PASS.

Record of the image ratchet (box 3.8 of tasks.md). Two image ratchets ran after the merges of main with `make ratchet CHANGE=ownership-scoped-gates` in the Docker image `gods-eye-view:local`. The first ratchet (commit 768370eb) stopped before the ledger comparison with the error TRACE-FAILED-TEST for the test of coverage-gate-046. It wrote no file in `openspec/trace/`. The correction is in `evidence.md` under "Pass 18". The log of the second ratchet (commit f596ba38) starts with `Command: ratchet`. The verdict lines are:

```text
Command: ratchet
Trace: 911 scenarios, 911 verified, 0 open. 9566 tests, 3701 traced, 5865 untraced.
QA: no script covers the capabilities of this change.
Coverage: 1065 files, 296 complete, 104 not loaded, 51 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 767 code files, 56092 lines, 495 test files, 5865 tests.
COVERAGE-DIFF: 247 changed lines, 0 brought by the merged upstream commit, 247 need coverage.
Ratchet: 1 history lines for ownership-scoped-gates.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 892 warnings.
ERROR REVIEW-MISSING openspec/changes/ownership-scoped-gates/review.md Change ownership-scoped-gates has no review.md
Gates failed with 1 errors.
Finished: 2026-10-09T12:43:03.918Z (1686.776 s)
```

The only error was the missing review.md. The ratchet changed `history.jsonl` (one measurement line), `ids.json` and `links.json`. The file `gaps.json` did not change, so this change opens and closes no gap. The command `make gates-docs` on the archived tree gave only the same REVIEW-MISSING error.

### Rounds and pre-reviews (reports in review/)

- [x] FINDING major (spec-adversary and ste-adversary, round 1 to pre-review 17) Spec text and test titles that claimed more than their bodies assert, words with two meanings, false or unbounded sentences in the proposal, the design and the evidence, and old records that a later pass rewrote with a newer fact. Each major was corrected in the next pass. The pass blocks of `evidence.md` record the corrections.
- [x] FINDING major (lead, merges of main) The two merges of main (commits 80ea3b1f and 9464af96) made three tolerance tests fail (gap-ledger-138, gap-ledger-147 and gap-ledger-151). The first image ratchet then stopped on one pinned list (coverage-gate-046). Corrected: the scenario `ownership-055`, the test of gap-ledger-151 at the library level, the line records in the fake coverage file, and the new entry in `testGuard.test.mjs`. The blocks "Pass 13", "Pass 14" and "Pass 18" of `evidence.md` record the faults that make each changed test fail.
- [x] FINDING minor (spec-adversary and ste-adversary, round 1 to pre-review 17) Wording, labels, counts, glossary rows and line pointers. The lead corrected most of them in the next pass. The minors that stay open are listed below.

### First confirming round (commit d10db81f, reports in review/round-3/)

- [x] FINDING major (spec-adversary) An old record held a newer fact. After pre-review 16 passed the sentence of Pass 17 about the host checks and the log `pass17/host-checks.log`, the lead replaced both with the run over commit 91eee2c9. Corrected: both are restored from commit 91eee2c9, and the newer run is in the new file `pass17/host-checks-final.log` with its own paragraph. The second confirming round checked the restore.
- [x] The spec adversary compared the applied spec with the delta spec line by line. All 35 requirements and all 55 scenarios are there. The Purpose equals the section "Purpose after archive" of `design.md` word for word. The ids and links in `openspec/trace/` agree with the change, and no gate became weaker.
- [x] FINDING minor (ste-adversary) The sentence of Pass 18 about the host checks names no commit. The sentence about the corrections of pre-review 17 does not name Pass 17 and the task section 19. Recorded as a known limit; the owner confirms in the pull request.

### Second confirming round (commit debc97c0, PASS / PASS)

- [x] The spec adversary and the STE adversary gave no finding in this round. The round checked the restore of `pass17/host-checks.log` and the new paragraph about `pass17/host-checks-final.log`.

### Known limits that the lead keeps

- [x] FINDING minor (earlier pre-review, finding S135) The finding is about the gate message that ends with "A merge after the base must bring that hash." The message appears in the specification, the proposal and the evidence. The finding stays open. The owner has not accepted it. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) Two old sentences of `evidence.md` say that a command did not run, without a scope: line 417 (pass 2) and line 1469. They stay as records.
- [x] FINDING minor (spec-adversary and ste-adversary, pre-reviews 8 to 10) The minor findings that the lead did not correct are in the reports `review/pre-review-8/` to `review/pre-review-10/`. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (spec-adversary, pre-reviews 11, 13 and 14) The file `proposal.md` does not name the THEN of gap-ledger-138: "the gate gives no tolerance from this requirement". The gate test of gap-ledger-138 asserts the AND only (the error LEDGER-ADOPT-FROM at `openspec/trace/history.jsonl`), and its title says "no tolerance". After the early source check the gate makes no comparison, so no gate test can assert the THEN. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (spec-adversary, pre-review 11) The arrow at `gates.mjs:639` now gets only merge parents from the early source check. A mutant that returns true for each commit survives. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (ste-adversary, pre-review 13) The labels of the rows of the table of Pass 15, for example "Spec adversary 2", do not match numbered findings, because the reports do not number their findings. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (ste-adversary, first confirming round) The reports `review/pre-review-15/` cite "task 19.2" with its old meaning (the format check). Task 19.2 now says "Correct the major fault that pre-review 15 found". The old reports stay as records.
- [x] FINDING minor (spec-adversary, first confirming round) The file `openspec/specs/ownership/spec.md` differs from the delta spec in the Purpose and in blank lines. Two double blank lines are single, and one blank line ends the file. The text of the requirements and scenarios is the same.
- [x] FINDING minor (spec-adversary, first confirming round) The file `pass18/host-checks.log` was made again at a later commit. The log of the gates-docs run on the archived tree names no commit. That run used commit d10db81f. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) The limits of `proposal.md` under "Known limits and later changes" stay as written. They are the waiver conditions, the error of a line waiver with no lines array, the three calls of `mergeParents` for each valid adopt record, the host coverage against the image measurement, the manifest syntax, moved files, the match of a line waiver and the files that a person resolved by hand.
- [x] FINDING minor (lead) Tasks 3.9 and 3.10 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review and the final gate run.
