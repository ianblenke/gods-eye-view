# Review: up42-search-hosts

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-08
Gates: make gates CHANGE=up42-search-hosts passed
Rounds: 4
Scope: diff bff9adfb
Reviewed-Tree: 31faab19218a376666c11ba9e967caf05c6a700dc674281bdd9d3ba68d8f93b5

Resolved files: none

## Findings

Round 1 had the scope full, at the commit d8901d79. The spec reviewer gave PASS and the STE reviewer gave FAIL. Round 2 had the scope diff d8901d79, at the commit da64265a. Both reviewers gave FAIL. Round 3 had the scope diff da64265a, at the commit bff9adfb. The spec reviewer gave PASS and the STE reviewer gave FAIL. Round 4 had the scope diff bff9adfb, at the commit e7961bdc. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 4.

Four ratchet runs came after round 1, because each correction changed spec text or a test title. The lead restored the coverage entries of unrelated files to the values of main each time, because their totals changed with no edit in this change.

### Round 1 (commit d8901d79)

- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) Scenario `up42-source-017` said all failed hosts give `upstream_failed` with 502, but the code gives a credential rejection priority and the route returns 403. Fixed: the scenario names the credential rejection. The old sentence was the verbatim text of main, so this was a fault that existed before this change; the change now states it correctly.
- [x] FINDING minor (STE adversary) The word "beside" described hosts in one search. Fixed in the scenarios and in the title of the test for `up42-source-031`.
- [x] FINDING minor (STE adversary) A test title used "beside" with no position meaning. Fixed. The lead did not rename the older test of `up42-source-017` for this finding, because the owner forbids a rename of a test of main (see round 2).

### Round 2 (commit da64265a)

- [x] FINDING major (spec adversary) The correction of round 1 renamed a test that exists on main (`up42-source-017`, "... beside failures"). Fixed: the name of main is restored in the test file and in the evidence of test titles.
- [x] FINDING major (STE adversary) The new line of scenario 017 allowed two results when a timeout and a credential rejection both occur. Fixed: the line gives the credential rejection priority.

### Round 3 (commit bff9adfb)

- [x] FINDING major (STE adversary) The line said "all failed hosts" for a scenario with a mix of good and failed hosts. Fixed: the line says "if all hosts fail". The first form of this text had 26 words and failed the sentence limit of 25 in the ratchet; the lead split it into two lines of 11 and 21 words.

### Round 4 (commit e7961bdc)

No findings from either reviewer.

## Known limits

The proposal names these limits: single-collection-hosts, call-cap, first-page, count-in-ram, display-terms and probe-snapshot.
