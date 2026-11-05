# Review: backfill-voice-panel

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-05
Gates: make gates CHANGE=backfill-voice-panel passed
Rounds: 3
Scope: diff cc3ba51e
Reviewed-Tree: 6c54041f3e0d204f1c35d83c369a15d3d07472e8d28bfbd93882e8da7e8f824e

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 74ec10e0. Both reviewers gave FAIL. Round 2 had the scope diff 74ec10e0, at the commit cc3ba51e. The spec adversary gave PASS and the STE adversary gave FAIL. Round 3 had the scope diff cc3ba51e, at the commit 73f795ad. Both reviewers gave PASS with no findings. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 3.

One ratchet run came after round 1, because the corrections changed tests and scenarios. It gave only `REVIEW-MISSING`. The lead restored the coverage entries of three unrelated files to the values of main, because their branch totals changed with no edit in this change. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 74ec10e0)

- [x] FINDING critical (spec adversary) The mutation record `A036-right` listed 376 tagged tests as failed, but its name filter excludes `voice-panel-070`. Fixed: all mutation records are rebuilt from complete events, and each has no invalid failure link.
- [x] FINDING critical (spec adversary) The `voice-panel-070` tests checked notice counts and property names but not the activity values. Fixed: the tests assert literal callback values.
- [x] FINDING critical (spec adversary) The reentrant teardown test hid a failure of `voice-panel-017`. Fixed: the test asserts the DOM values, and the known limit `voice-panel-reentrant-teardown` states the behavior.
- [x] FINDING critical (spec adversary) Two tests carried tags for scenarios that they did not exercise (`voice-panel-017` and `voice-panel-028`). Fixed: new scenarios 071 and 072 and corrected tags.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) One sentence let "destroys" apply to two objects. Fixed.
- [x] FINDING minor (STE adversary) Two wording findings in `spec.md` and a test title. Fixed.

### Round 2 (commit cc3ba51e)

- [x] FINDING major (STE adversary) One sentence of `review-corrections.md` pointed at the wrong tests. Fixed: the sentence names the teardown probes.
- [x] FINDING minor (STE adversary) The article is absent in "with message" in `spec.md` line 189. Kept: the lead accepts this minor finding under the owner rule, because a change of a scenario needs a new ratchet and the sentence is clear.

### Round 3 (commit 73f795ad)

No findings.

## Known limits

The design file names these limits: `voice-panel-old-titles`, `voice-panel-reentrant-teardown`, `voice-panel-custom-source-notice`, `voice-panel-untracked-delta`, `voice-panel-source-getter`, `voice-panel-symbol-accessor`, `voice-panel-method-origin` and `voice-panel-card-teardown`.
