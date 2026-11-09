# Review: up42-scene-overlay

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-08
Gates: make gates CHANGE=up42-scene-overlay pending
Rounds: 3
Scope: diff 7341547c
Reviewed-Tree: PENDING

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 54f953fa. Both reviewers gave FAIL. Round 2 had the scope diff 54f953fa, at the commit 7341547c. The spec reviewer gave PASS and the STE reviewer gave FAIL. Round 3 had the scope diff 7341547c, at the commit 62209c06. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 3.

Three ratchet runs came after round 1 (one of them failed on four unrelated timing tests while other containers loaded the host, and the lead ran it again on the same tree). The lead restored the coverage entries of unrelated files to the values of main each time, because their totals changed with no edit in this change. The lead ran the browser check in the sandboxed Chrome again on the corrected code: 23 checks passed.

### Round 1 (commit 54f953fa)

- [x] FINDING critical (spec adversary) A body that passes the server checks but cannot decode counted as a shown image. Fixed: the layer decodes the image before it adds the entity, counts one failure, and releases a late decode. New scenario `up42-scene-overlay-021` and tests with mutation records cover it.
- [x] FINDING critical (spec adversary) The test of scenario 012 did not check the outline of the selected scene. Fixed: literal width and colour assertions follow each selection, including no selection, with mutation records.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) The report in the change folder said the browser check was pending. Fixed: the duplicate report is deleted and the evidence records the 23 passed checks.
- [x] FINDING minor (STE adversary) Tense and passive wording in the proposal, the design and the spec. Fixed.

### Round 2 (commit 7341547c)

- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) A test title said the decoder returns "reject" while the test makes it throw. Fixed: two titles say that the decoder rejects and that the decoder returns null.

### Round 3 (commit 62209c06)

No findings from either reviewer.

## Known limits

The proposal names these limits: approximate-fit, display-terms, image-cap, rate-limit, ui-texts, no-live-check and memory.
