# Review: backfill-director-timing

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-07
Gates: make gates CHANGE=backfill-director-timing passed
Rounds: 3
Scope: diff ce6edb6
Reviewed-Tree: 52f0e07fac1fd998b84870812189282847729bd8c2b3ebccb18c04d77987269f

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
The reviewers did not read the prose corrections after round 3 again. The lead ran the lint and the predispatch check after them.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary PASS)

- [x] FINDING critical (spec-adversary, 2 findings) The queue scenario `director-036` (wrap order, unknown start ID, shot identity) and the shortest arc scenario `director-033` (wrap of heading and roll) had their results asserted only by untagged tests, and the operands `+ 540`, `% 360` and `- 180` had no mutation row. Corrected in pass 2: tagged tests with literal values and the rows m289 to m295.
- [x] FINDING major (spec-adversary, 3 findings) Six calls for unknown fields and duplicate IDs in `document.js` had no test, the accept side of the version limits at versions 4 and 5 had no test, and tests tagged `director-023`, `director-024`, `director-026` and `director-027` asserted results that no THEN or AND line states. Corrected in pass 2: the tests and the rows m296 to m305, and the AND lines.
- [x] FINDING minor (spec-adversary, 4 findings) A restored old test body, the audit sweep, the archive header step with the QA known limit, and missing known limits. Corrected in pass 2 in the tests and the documents.
- [x] FINDING minor (ste-adversary, 13 findings) Wording faults in the documents and in names of tests and terms. Corrected in pass 2.

### Round 2 (scope: diff b2c82a2) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING major (ste-adversary) The THEN line of `director-036` stated only the wrap order, but its WHEN also names a single scene. Corrected in pass 3: the scenario states each queue result, with a new test and the rows m313 and m314.
- [x] FINDING major (ste-adversary) The word "round" had two meanings: a worker step and a review round. Corrected in pass 3: "pass" names a worker step and "review round" names a review.
- [x] FINDING minor (spec-adversary, 8 findings) Single scene queue AND lines, the WHEN of `director-003`, AND lines for `director-023` and `director-024`, the shot IDs of `director-037`, the accept side of the interactions limit at version 6, the columns of mutations.md, a stale commit hash and the ledger count noise. Corrected in pass 3: tests, rows m313 to m318, the AND lines, the columns, the base commit and the Known limit `ledger-count-noise`.
- [x] FINDING minor (ste-adversary, 8 findings) Verbs used as nouns, missing nouns in titles, one name for one thing, units and noun groups. Corrected in pass 3.

### Round 3 (scope: diff ce6edb6) - PASS (spec-adversary PASS, ste-adversary PASS)

- [x] FINDING minor (spec-adversary) The summary table of mutations.md stops at m310. No change: the table lists the 30 rows m289 to m318 (the command `grep -c` of the row pattern gives 30).
- [x] FINDING minor (spec-adversary) The last line of `director-032` does not name the absent shot as its input. Recorded as the Known limit `absent-shot-input` in the proposal. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) Unchanged tests tagged `director-003` assert results that no THEN or AND line states. Recorded as the Known limit `director-003-extra-results` in the proposal. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) The Known limit `ledger-count-noise` cites line numbers that move. Corrected in the proposal: the entry names the search command and each entry names its change.
- [x] FINDING minor (ste-adversary, 11 findings) Names of gates, the term for visual control, "later subscriber" and "snapshot", the queue wording, "before the last scene", the passive voice and the term "lead's branch" in the documents, the wording of the Known limit, and one task with four instructions. Corrected after round 3 in the design, the tasks, the evidence and the proposal. Wording faults in the delta spec (the lines for `director-006`, `director-032`, `director-036` and `director-037` and the scene duration names) and in two test titles need a new ratchet and stay open: the Known limit `spec-wording-minors` records them. Accepted by Ian Blenke.
