# Review: backfill-director-packs-sharing

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-09
Gates: make gates CHANGE=backfill-director-packs-sharing passed
Rounds: 12
Scope: diff 0a0d9975
Reviewed-Tree: 1b877727be9a7a624d28a73c602c6ea5e7b80aaa99a2c78e5d6c360ad6f59f18

## Findings

Full agent reports: `review/round-1/` to `review/round-6/` (rounds 1 to 6), `review/pre-review-7/` to `review/pre-review-11/` (five pre-reviews of the working tree), and `review/spec-adversary.md` and `review/ste-adversary.md` (the confirming round on the archived tree, scope `diff 0a0d9975`).
The image ratchet passed before the archive: 825 scenarios verified, 0 open, 0 ledger mismatches. The only error was the missing review.md.
The reviewers did not read the corrections after the confirming round again. The lead ran the lint after them.

### Rounds 1 to 6 (reports in review/round-1/ to review/round-6/)

- [x] FINDING major (spec-adversary rounds 1 to 5: 19 findings; ste-adversary rounds 1 to 6: 30 findings) Titles that claimed more than their test bodies assert, scenario text that did not state what the tests check, missing hand rows for limit sides, and words with two meanings. Each was corrected in the next pass; the pass tables in evidence.md record every correction.
- [x] FINDING minor (spec-adversary rounds 1 to 6: 26 findings; ste-adversary rounds 1 to 6: 60 findings) Audit rows, stale numbers, Known limits, derived forms of the owner words, vague sentences and verbs used as nouns. Corrected in the next pass, or recorded as Known limits in the proposal.

### Pre-reviews 7 to 11 (reports in review/pre-review-7/ to review/pre-review-11/)

- [x] FINDING major (spec-adversary pre-reviews 7 to 9: 5 findings; ste-adversary pre-reviews 7 to 10: 18 findings) Test titles whose clause no body line asserts (for example the title of the test for director-107), "Old = New" evidence records, a false sentence about tag cells, an ambiguous word in a title and a task with two instructions. Each was corrected in the next pass. The test of director-107 now has a settled marker, and a hand row (m480) kills the hoist of its signal check.
- [x] FINDING minor (spec-adversary pre-reviews 7 to 11: 32 findings; ste-adversary pre-reviews 7 to 11: 75 findings) Wording, labels, counts, glossary rows and the delta line numbers. Corrected in the next pass, or recorded below as Known limits.

### Confirming round (PASS / PASS)

- [x] FINDING minor (spec-adversary) The two new Known limits (`digest-asset-result-check-order`, `second-text-signal-error`) named none of the four mutations of the probe. Corrected after the round: limit 1 names the three hoists at bundle.js:93-94, 150-154 and 160-161, limit 2 names the catch at bundle.js:129, and both cite the mutation file in the evidence folder. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (spec-adversary) The probe output had no killed control. Corrected after the round: evidence/probe-signal-check-order.txt shows that the same harness kills the hoist at bundle.js:128 (m480, test director-107), and the control mutation file is in the evidence folder.
- [x] FINDING minor (ste-adversary, F1 and F2) "all four mutations survive" had no antecedent in the proposal, and the quote "They reject cancellation." had no antecedent for "They". Corrected after the round, in the same edit as the finding above.
- [x] FINDING minor (ste-adversary, F3 to F8: six findings) Evidence wording (the filter text, the labels, the lines below the pass 13 table, "follow the calls that they await", "does not detect" against "kills") and task wording (14.18 names two commands, the sections 15 and 16 have the same text for tasks 15.1 and 16.1, the heading of section 16). Recorded as a known limit; the owner confirms in the pull request.

### Known limits that the lead keeps

- [x] FINDING minor (lead) The Known limit `digest-asset-result-check-order`: a signal check moved between the call and its await at bundle.js:93-94, 150-154 or 160-161 passes each test. The probe in the evidence folder shows it. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) The Known limit `second-text-signal-error`: a change that catches the error of the second signal check at bundle.js:129 passes each test. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) The trace line of src/data/aisStreamAdapter.js (total branches 155 to 156) is a measurement shift in a file that this change does not own. The ratchet recorded it as a history line. No gap opens or closes.
- [x] FINDING minor (lead) Tasks 3.2 to 3.4 of tasks.md stay open, like in the archived changes before, because tasks.md is part of the reviewed tree. The final gate run and this file are the records.
- [x] FINDING minor (lead) The area backfill campaign for the scene director closes with this change. The sentence "Later backfill changes add the other parts of the scene director." in the Purpose of the director capability stays true: other parts are gaps in the ledger.
