# Review: review-severity-scope

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-09
Gates: make gates CHANGE=review-severity-scope passed
Rounds: 5
Scope: diff b30303ef
Reviewed-Tree: 07dad33ce16ab87a89e9d72ca31f8ecd9a920256e9a67c594880d682d89c7a82

## Findings

Full agent reports: `review/pre-review-1/` to `review/pre-review-4/` (four reviews of the working tree) and `review/spec-adversary.md` and `review/ste-adversary.md` (the confirming round on the archived tree, scope `diff b30303ef`, commit 44ab6c18: PASS and PASS).

Verdicts (spec adversary / STE adversary): pre-review 1 FAIL / FAIL; pre-review 2 FAIL / FAIL; pre-review 3 FAIL / PASS; pre-review 4 PASS / PASS; confirming round PASS / PASS.

The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the rule of the owner for wording faults, and the reports follow that rule.

Record of the image ratchet (box 3.6 of tasks.md). The image ratchet ran with `make ratchet CHANGE=review-severity-scope` in the Docker image `gods-eye-view:local` at commit 05741a7a. The code files and test files are those of commit d7e4e6b8. Its log starts with `Command: ratchet`. The verdict lines are:

```text
Command: ratchet
Trace: 914 scenarios, 914 verified, 0 open. 9569 tests, 3704 traced, 5865 untraced.
QA: no script covers the capabilities of this change.
Coverage: 1065 files, 296 complete, 104 not loaded, 51 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 767 code files, 56092 lines, 495 test files, 5865 tests.
COVERAGE-DIFF: 0 changed lines, 0 brought by the merged upstream commit, 0 need coverage.
Ratchet: 1 history lines for review-severity-scope.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 898 warnings.
ERROR REVIEW-MISSING openspec/changes/review-severity-scope/review.md Change review-severity-scope has no review.md
Gates failed with 1 errors.
Finished: 2026-10-09T15:22:19.714Z (1655.149 s)
```

The only error was the missing review.md. The ratchet changed `history.jsonl` (one measurement line), `ids.json` (the IDs change-review-034 to change-review-036) and `links.json`. The file `gaps.json` did not change, so this change opens and closes no gap.

The command `make gates-docs CHANGE=review-severity-scope` on the archived tree (commit 0c2734b8) gave these lines. The mode runs no tests. It trusts the snapshot of commit 05741a7a.

```text
NO TEST RUN: the mode trusts the snapshot of commit 05741a7a2448c5855c0fa6f6db0336d4733f342f
Trace: 914 scenarios, 914 verified, 0 open. 9569 tests, 3704 traced, 5865 untraced.
Coverage: 1065 files, 296 complete, 104 not loaded, 51 untrue.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 897 warnings.
ERROR REVIEW-MISSING openspec/changes/archive/2026-10-09-review-severity-scope/review.md Change review-severity-scope has no review.md
Gates failed with 1 errors.
```

### Pre-reviews (reports in review/pre-review-1/ to review/pre-review-4/)

- [x] FINDING major (spec-adversary and ste-adversary, pre-reviews 1 to 3) The new instructions contradicted old lines of the same file, and a banned word and a task with two instructions came out as minor. The word "keep" was false for the two new classes. The term "banned word" had no definition, and then it named lists that hold approved words. The phrase "a form of such a word" had two meanings. Two sentences had no scenario line and no pin, and a task box had no record. Each major was corrected in the next pass. The tests now pin the sentences that the scenarios name, and they check that the three old lines are gone and that the major lines are exactly four.
- [x] FINDING minor (spec-adversary and ste-adversary, pre-reviews 1 to 4) Wording, labels, counts and the position of pins. The lead corrected most of them in the next pass. The minors that stay open are Known limits in `proposal.md` and in the list below.

### Confirming round (PASS / PASS)

- [x] The spec adversary compared the requirement in `openspec/specs/change-review/spec.md` with the archived delta spec line by line. The text is the same. The archive holds every file of the change. The ids and links in `openspec/trace/` agree with the change, and no gate became weaker.
- [x] FINDING minor (ste-adversary) The Known limits `derived-words` and `spelling` of `proposal.md` had unclear wording. Corrected in `proposal.md`: the text now says that the reviewer reports a word that comes from a banned word as an STE fault under the rules of check 1, and that the reviewer reports a form with a changed spelling as a banned word.
- [x] FINDING minor (spec-adversary) The checks paragraph of the instructions says "a form of a banned word" without the suffix limit. The definition of a banned word sets the limit. Recorded as the Known limit `form-in-checks` in `proposal.md`.

### Known limits that the lead keeps

- [x] FINDING minor (spec-adversary and ste-adversary, pre-review 4 and the confirming round) The pins in the tests compare sentences with the whole file. A pinned sentence in the example block would pass. The check of the major lines reads only lines that start with `- **major**:`. Recorded in the Known limit `pin-only`; the owner confirms in the pull request.
- [x] FINDING minor (ste-adversary, pre-review 3) The tasks 1.2 to 1.4 have nested lines "Run ..." under one task. The lead reads the nested lines as the check of the one task, as in earlier changes. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (spec-adversary, confirming round) The file `openspec/specs/change-review/spec.md` has two AND lines after a blank line, below scenario change-review-033 (lines 185 and 186). They are in the base, and this change does not touch them. A later change can fix them.
- [x] FINDING minor (lead) The limits of `proposal.md` stay as written: `judgment`, `pin-only`, `derived-words`, `spelling`, `form-in-checks` and `other-files`. A session that runs keeps the old agent definitions until it starts again.
- [x] FINDING minor (lead) Tasks 3.7 to 3.9 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
