# Review: up42-source

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-07
Gates: make gates CHANGE=up42-source passed
Rounds: 3
Scope: diff feb483b4
Reviewed-Tree: 2d2ed2b435e1e14b03278db9ba2e24cfee14a9ba3e7fdce0c3c866c6e0dce860

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 15458d85. Both reviewers gave FAIL. Round 2 had the scope diff 15458d85, at the commit feb483b4. The spec adversary gave PASS and the STE adversary gave FAIL. Round 3 had the scope diff feb483b4, at the commit e80b3c05. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 3.

Two ratchet runs came after round 1 and one after round 2, because the corrections changed code, tests and scenario text. The lead restored the coverage entries of unrelated files to the values of main, because their totals changed with no edit in this change. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 15458d85)

- [x] FINDING critical (spec adversary) Two API failure tests carried the tag of the password-grant scenario. Fixed: the cases are split, each has the matching tag, and the test asserts the retry count of an API 401.
- [x] FINDING critical (spec adversary) No test changed only the end date to prove that it changes the store key. Fixed: a new test and a mutation record.
- [x] FINDING major (spec adversary) Two simultaneous cache misses started two searches. Fixed: the route claims the search before it yields. New scenario 025 and a test.
- [x] FINDING major (spec adversary) An error response body of the API stayed open after the timer cleared. Fixed: the client discards the body. New scenario 026 and tests.
- [x] FINDING major (spec adversary) An oversize request body closed the socket before the 400 answer. Fixed: the reader discards the excess up to 65536 bytes. New scenario 027 and a test through a real HTTP server. The same pattern in the SkyWatch route stays unchanged.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) Two task lines each held two instructions. Fixed: four tasks of one instruction.
- [x] FINDING minor (STE adversary) Seven wording findings in the design, the proposal, the spec and two test titles. Fixed.

### Round 2 (commit feb483b4)

- [x] FINDING major (STE adversary) The Body requirement said the route reads at most 4096 bytes, but scenario 027 reads more bytes and discards them. Fixed: the requirement says the route keeps at most 4096 request bytes. A ratchet followed.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.

### Round 3 (commit e80b3c05)

- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.

## Known limits

The proposal names these limits: no-live-check, password-grant, local-only, count-in-ram, first-page, display-terms, search-cost, viewer-role-unknown and host-cap.
