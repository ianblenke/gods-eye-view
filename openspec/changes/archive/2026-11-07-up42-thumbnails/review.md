# Review: up42-thumbnails

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-08
Gates: make gates CHANGE=up42-thumbnails passed
Rounds: 3
Scope: diff ade36a5c
Reviewed-Tree: TREE

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 71cb2d10. The spec adversary gave FAIL and the STE adversary gave PASS. Round 2 had the scope diff 71cb2d10, at the commit ade36a5c. The spec adversary gave FAIL and the STE adversary gave PASS. Round 3 had the scope diff ade36a5c, at the commit 1731b556. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 3.

Three ratchet runs came after the first commit, because the corrections changed code, tests and scenario text. The lead restored the coverage entries of unrelated files to the values of main, because their totals changed with no edit in this change. The file `src/sources/httpBody.js` keeps its entry with 83 branches instead of 81, because the new tests run code paths of that upstream file that no test ran before. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 71cb2d10)

- [x] FINDING critical (spec adversary) The hook test sent requests through one hook only. Fixed: both hook handlers receive valid and invalid requests.
- [x] FINDING critical (spec adversary) The cache-hit tests did not check the stored bytes. Fixed: new scenario 018 compares the stored answer with literal bytes, type and length.
- [x] FINDING critical (spec adversary) The no-secret test captured five console methods. Fixed: the test captures all console functions.
- [x] FINDING critical (spec adversary) No test changed the user name or the password. Fixed: separate tests refuse the previous user name and the previous password.
- [x] FINDING critical (spec adversary) The evidence held an executable program. Fixed: prose records replace it.
- [x] FINDING major (spec adversary) The cancel of an error body could outlast the time limit. Fixed: the abort signal bounds the cancel operation.
- [x] FINDING minor (spec adversary) An id of dots only changed the request path and sent the token to another path. Fixed: new scenario 019 refuses such an id before the login, and the URL uses the encoded id.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) Two wording findings in the design and the spec. Fixed.

### Round 2 (commit ade36a5c)

- [x] FINDING major (spec adversary) A cancel that never ends held an image read that was over the size limit. Fixed: the image read and the JSON read race the abort signal.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) Four generated test titles lacked an article. Fixed.

### Round 3 (commit 1731b556)

- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) The scenario line 163 of `spec.md` uses "read" as a noun. Kept: the lead accepts this minor finding under the owner rule, because a change of a scenario needs a new ratchet and the sentence is clear.
- [x] FINDING minor (STE adversary) The scenario line 164 of `spec.md` omits an article before "cancel". Kept: the lead accepts this minor finding for the same reason.
- [x] FINDING minor (STE adversary) A test title uses "read" as a noun. Kept: the lead accepts this minor finding for the same reason.

## Known limits

The proposal names these limits: no-live-check, display-terms, key-host, lan-access, not-all-hosts and no-retry-on-429.
