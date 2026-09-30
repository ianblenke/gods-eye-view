# Review: backfill-recent-imagery

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-30
Gates: make gates CHANGE=backfill-recent-imagery passed
Rounds: 3
Scope: diff dd17f2b
Reviewed-Tree: 10fcba7128e5efa9d76115e6462180b3c3766cdcd6fc01f239056ac2001b2f54

## Findings

### Round 1 (scope: full) - FAIL

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] critical (spec-adversary) Four mutations of `index.js` and `recentImagery.js` (057-true, 058-right, 049-false, 077-right, 465-right) were called equivalent. Each is observable with a fake layer or a different call order. Corrected: a new killing test for each, proved by mutation.
- [x] major (spec-adversary) Two more UI mutations (452-right, 454-right) were observable through the disabled controls. Corrected: new tests, proved by mutation.
- [x] minor (spec-adversary) Five minor UI mutations (385, 422, 423, 444, 451) were observable with a stub snapshot. Corrected: new tests, proved by mutation.
- [x] major (spec-adversary) Only one of the equivalent claims was in the Known limits. Corrected: every remaining equivalent claim has a bullet in `proposal.md`.
- [x] major (spec-adversary) Four tests tagged `recent-imagery-028` tested only test doubles. Corrected: retagged to `recent-imagery-052` with AND lines.
- [x] minor (spec-adversary) Reason for `model.js:239`, the untagged hint-text test, the QA script claims, the rendering timer title, the two-tests-one-claim pair, the blank lines before AND lines. Corrected in the proposal, the design, the spec and the tests.
- [x] major (ste-adversary) Contradictory statements about the QA header, a stale ledger sentence, "notice" with two meanings, words that are not approved, "rejects" and "refuses" for one meaning, and titles with no article at the start. Corrected in the spec, the prose and the new test names.
- [x] minor (ste-adversary) Nine wording items in the proposal, the design, the tasks and new test names. Corrected. Old test names stay as they are (Known limits).

### Round 2 (scope: diff fef8c46) - FAIL

Full agent reports: `review/round-2/spec-adversary.md`, `review/round-2/ste-adversary.md`.

- [x] major (spec-adversary) The claim `expression-065-right` was wrongly called equivalent. Corrected: the new test `[recent-imagery-039] an empty automatic preview does not choose a day that a pin holds` kills it.
- [x] minor (spec-adversary) The reasons of `default-323-dom-children` and `expression-065-left` and a stray full stop in scenario 052. Corrected.
- [x] major (ste-adversary) `dESTROY` case error, a mode title that disagreed with the spec, a share-mode title, the ENABLE condition in two titles, and "preserves". Corrected in the spec and the test titles.
- [x] minor (ste-adversary) 17 wording items: "nonfunction", "cancelled", "hls", "viirs", "publication", "stock", "retag" and others. Corrected in the spec, the prose and the new titles. Old titles were not renamed.

### Round 3 (scope: diff dd17f2b) - PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] minor (spec-adversary, proposal.md:76) The claim `expression-065-left` rests on the `_auto` invariant, and no test pins it. Kept: it is a named Known limit in `proposal.md`.
- [ ] minor (spec-adversary, index.test.mjs:2257) The new 065-right test does not prove the ranking of `S18` above `L16`. Its first assertion gives that ranking. No action. Accepted by Ian Blenke.
- [x] minor (ste-adversary, proposal.md) "nonfinite" in three sentences of the proposal. Corrected to "not finite".
- [ ] minor (ste-adversary, spec.md:364-365) "nonfinite" in the spec text of scenario 036. A spec edit needs a new ratchet and archive. Accepted by Ian Blenke.
- [ ] minor (ste-adversary, spec.md:359) "does not send them back" and "publish" name one thing in two words. Accepted by Ian Blenke.
- [ ] minor (ste-adversary, index.test.mjs:3204) The title states a condition that the spec AND line does not state. The spec claims less than the test proves. Accepted by Ian Blenke.
