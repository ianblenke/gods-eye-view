# Review: up42-scenes-layer

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-09
Gates: make gates CHANGE=up42-scenes-layer passed
Rounds: 2
Scope: diff 0009961f
Reviewed-Tree: 8344c26a117f11373e2abd9714c0d97061e0fcb6e2cb0a1b3c1b382f07dbd49e

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 0009961f. Both reviewers gave FAIL. Round 2 had the scope diff 0009961f, at the commit 2ecfeb30. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 2.

One ratchet run came after round 1, because the corrections changed tests and scenario text. The lead restored the coverage entries of unrelated files to the values of main, because their totals changed with no edit in this change. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 0009961f)

- [x] FINDING critical (spec adversary) The test for the selected footprint checked only the vertex count of the polygon. Fixed: literal checks cover every vertex of the selected polygon and of each footprint, with mutation records.
- [x] FINDING major (spec adversary) The edits to old tests with untraced names had no tagged test for the changed facts. Fixed: new scenario tests `up42-scenes-layer-041` cover them, the old names stay, and `evidence/checks.txt` records the trace exception.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) One test title disagreed with its scenario. Fixed.
- [x] FINDING minor (STE adversary) Wording findings in the design, a task line, the specs and test titles. Fixed. The passive text of the `osh` block is the verbatim old requirement text, and the quoted interface labels stay under the known limit `ui-texts`.

### Round 2 (commit 2ecfeb30)

- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.

## Known limits

The proposal names these limits: no-live-check, display-terms, no-pick, clock-skew, search-time, view-moves, antimeridian, list-length, thumbnails-off, partial-results-note, no-filter-controls, real-service, token, osh-count, image-size, ui-texts, untested-settings, visual and qa-twochar-time.
