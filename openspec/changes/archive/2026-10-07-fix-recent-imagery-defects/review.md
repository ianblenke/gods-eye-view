# Review: fix-recent-imagery-defects

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-07
Gates: make gates CHANGE=fix-recent-imagery-defects passed
Rounds: 3
Scope: diff 21e71ce
Reviewed-Tree: d5e1ecf90baa826b7e05deca0b9f7a5c0673080896422c1e13e38621d37b64cd

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
The reviewers did not read the prose corrections after round 3 again. The lead ran the lint and the predispatch check after them.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary) The AND line of scenario 050 had no test tagged `recent-imagery-050` that asserts the body scroll position. Corrected in pass 2: the tests at the panel and the open DETAILS card carry the 050 tag, and each asserts the body scroll position.
- [x] FINDING major (spec-adversary) The mutation that moves the scroll request before `render()` survived, because every fake rectangle was constant. Corrected in pass 2: the card rectangle depends on the open state and row 21 fails a repository test.
- [x] FINDING minor (spec-adversary, 5 findings) The sparse ring hole, the ledger count noise for `ais-store.js`, a stale proposal paragraph with two missing Known limits, an assertion inside the fetch function that could not fail, and the two meanings of "absent dimensions". Corrected in pass 2.
- [x] FINDING major (ste-adversary, 4 findings) The text "unless DETAILS opens" of scenario 050 was wrong, the proposal paragraph about `model.js:406` was stale, the requirement text of scenario 055 had two meanings, and the words of scenario 053 had two meanings. Corrected in pass 2.
- [x] FINDING minor (ste-adversary, 5 findings) Wording faults in the documents, the tasks and the test names. Corrected in pass 2.

### Round 2 (scope: diff 9c3110a) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING major (ste-adversary) The AND lines "an absent viewport height" and "an absent card rectangle" had two meanings, because the test passes a height of zero and the card has no method. Corrected in pass 3: each AND line states what its test does, and a new test covers a scroller without a viewport height value (row 26).
- [x] FINDING major (ste-adversary) The proposal said that the old NaN result was partial, but the old latitude test expected full coverage. Corrected in pass 3: the old NaN results were full or partial.
- [x] FINDING minor (spec-adversary, 6 findings) The 050 tag on the test that kills row 21, a row for the content update, a test for a card inside the view, the wording of the 055 AND lines, the evidence logs outside the repository, and the missing Known limit for the browser QA script. Corrected in pass 3: rows 27 to 29, the new tests, the 20 cited logs, and the Known limit `qa-details-scroll`.
- [x] FINDING minor (ste-adversary, 6 findings) Nouns made from verbs, missing nouns, one name for one thing, vague tasks and two test names. Corrected in pass 3.

### Round 3 (scope: diff 21e71ce) - PASS (spec-adversary PASS, ste-adversary PASS)

- [x] FINDING minor (spec-adversary) The evidence cited logs and probe sources that were not in the evidence folder. Corrected after round 3: the logs that the text cites by prefix and the four probe sources as text files are in `evidence/`.
- [x] FINDING minor (spec-adversary) The sentence "The base returns unknown coverage" was false for the old commit. Corrected after round 3: "The current code returns unknown coverage."
- [x] FINDING minor (spec-adversary) The default values `|| 0` and the optional chains in `revealCard` have no test and no mutation row. Recorded as the Known limit `reveal-card-defaults` in the proposal. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) The Known limit `ledger-count-noise` named only `upstream-sync`. Corrected after round 3: the proposal names `upstream-sync`, `backfill-director-timing` and this change.
- [x] FINDING minor (ste-adversary, 10 findings) The letters A, C and D without a referent, verbs used as nouns, missing units, second names in the documents, vague tasks and the sentences about the base commit. Corrected after round 3 in the proposal, the design, the tasks and the evidence. The wording faults in the scenario lines ("ends" for a late fetch, "scroller" and "view", the words "from the fetch" in a thumbnail test name) need a new ratchet and stay open: the Known limit `spec-wording-minors` records them. Accepted by Ian Blenke.
