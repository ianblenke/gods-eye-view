# Review: backfill-share-codec

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-03
Gates: make gates CHANGE=backfill-share-codec passed
Rounds: 3
Scope: diff af2b614e
Reviewed-Tree: 7bfc10f216ee96357c26211c7c0252317c28428c7e9af63293eb1ab1f6718c23

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 4cf8e370. Both reviewers gave FAIL. Round 2 had the scope diff 4cf8e370, at the commit af2b614e. Both reviewers gave FAIL. Round 3 had the scope diff af2b614e, at the commit fa69e420. Both reviewers gave PASS with no findings. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 3.

One ratchet run came after round 1, because the corrections changed tests and scenarios. It gave only `REVIEW-MISSING`. The lead restored the coverage entries of six unrelated files to the values of main, because their branch totals changed with no edit in this change. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 4cf8e370)

- [x] FINDING critical (spec adversary) A tag combination that no single case could prove, and known detection names tagged with the unknown-name scenario. Fixed: tags per case and a new scenario.
- [x] FINDING critical (spec adversary) The size test and the integer-angle tests carried the camera-precision tag but did not check precision. Fixed: new scenarios and correct tags.
- [x] FINDING critical (spec adversary) The `share-codec-034` test checked only `ok` and not the error reason. Fixed: each input asserts its literal reason.
- [x] FINDING major (spec adversary) The canonical-state scenario promised equality for a share time after the decoder clock. Fixed: the scenario states the clock condition.
- [x] FINDING major (spec adversary) `review.md` was absent. Fixed: this file records the review.
- [x] FINDING major (STE adversary) Evidence text disagreed with the committed files. Fixed.
- [x] FINDING minor (STE adversary) Seven wording findings in design, evidence, audit and test titles. Fixed.

### Round 2 (commit af2b614e)

- [x] FINDING major (spec adversary) `review.md` was absent. Fixed: this file records the review.
- [x] FINDING major (STE adversary) `corrections.md` said the changes were uncommitted and that the trace files match commit 4cf8e370. Fixed: the text names the snapshot.
- [x] FINDING major (STE adversary) `evidence.md` said that the trace files match the source commit. Fixed.
- [x] FINDING minor (STE adversary) Articles are absent in two sentences of `spec.md` (lines 134 and 261). Kept: the lead accepts this minor finding under the owner rule, because a change of a scenario needs a new ratchet and the sentences are clear.
- [x] FINDING minor (STE adversary) The article is absent in the title "at clock" of a clock test. Kept: the lead accepts this minor finding under the owner rule, because a change of a test name needs a new ratchet.

### Round 3 (commit fa69e420)

No findings.

## Known limits

The design file names these limits: `share-codec-absent-option`, `share-codec-inferred-view`, `share-codec-enum-entry`, `share-codec-entity-entry`, `share-codec-host-worker-coverage`, `share-codec-partial-fix`, `share-codec-style-getter` and `share-codec-old-title`. The branches of `src/share/viewCodec.js` that no test can reach are named in `evidence.md`.
