# Review: up42-quotes

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-09
Gates: make gates CHANGE=up42-quotes passed
Rounds: 2
Scope: diff 73923c26
Reviewed-Tree: be9cb9ce8c2d7910c50fd6290b9aa52ac7e9c7c75b5633453bd0fdcf959d7d5e

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 73923c26. Both reviewers gave FAIL. Round 2 had the scope diff 73923c26, at the commit 8838b80f. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 2.

Two ratchet runs came after round 1: the first stopped on eight guard tests that wrote into a folder that the gate container does not have, and the lead corrected them to use the system temp folder. The lead restored the coverage entries of unrelated files to the values of main, because their totals changed with no edit in this change. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 73923c26)

- [x] FINDING critical (spec adversary) A product title with a control character in the password passed the safety check and then became the password after normalization. Fixed: the secret check runs on the final output strings, with tests for several removed characters.
- [x] FINDING critical (spec adversary) The wait for response headers had no bound. Fixed: the client races the header wait against the abort signal and cancels a late response with a bounded cancel.
- [x] FINDING critical (spec adversary) The daily reset test passed for a rolling 24-hour counter. Fixed: the test crosses UTC midnight in both directions.
- [x] FINDING major (spec adversary) The source guard read only the root files of the quote folder. Fixed: it scans the whole folder and checks the exact file list.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) The proposal said that the change does not edit the trace ledger, but the ratchet writes trace records. Fixed.
- [x] FINDING minor (STE adversary) Two wording findings in `spec.md`. Fixed.

### Round 2 (commit 8838b80f)

- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) `design.md` line 14 used an -ing word. Fixed after the round.
- [x] FINDING minor (STE adversary) The scenario line 306 of `spec.md` uses the passive voice. Kept: the lead accepts this minor finding under the owner rule, because a change of a scenario needs a new ratchet and the sentence is clear.

## Known limits

The proposal names these limits: no-live-check, unknown-cost, viewer-role-unknown, credits-not-currency, no-binding-quote, count-in-ram, lan-access and plan-gating-unknown.
