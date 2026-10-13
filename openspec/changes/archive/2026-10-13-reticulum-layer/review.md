# Review: reticulum-layer

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-13
Gates: make gates CHANGE=reticulum-layer passed
Rounds: 3
Scope: diff ebf95ecfd36e8c49966694eb223429d0addc1441
Reviewed-Tree: f53f196751e83f17388316df342e94e6f8db5a8d182d091897ee8c29af7ebf96

## Findings

The reports of round 1 are in `review/round-1/`, and the reports of round 2 are in `review/round-2/`. The reports of round 3 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word. In round 1 the spec adversary sent a first message, which is `review/round-1/spec-adversary-first-message.md`, and then a full report that replaces it, which is `review/round-1/spec-adversary.md`.
The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each round gave the severity rule of the owner, and the reports follow that rule.
Nine short pre-reviews ran: five before the first ratchet and four after round 1. They are listed in the last section. Tasks 4.2 to 4.4 stay open in `tasks.md`, as in the earlier changes.
The reviewers sent later messages that correct line numbers or word counts in their own reports. The verdicts and the findings stay. The report files keep the first text, except in round 1, where the full report replaces the first message.
The brief of round 3 named 37a3809e as the last test change and spoke of two later commits. The last code and test commit is d58140d7, and one commit (78d1e982) follows the full gates run. The reviewers noted this, and the lead sent a correction.
The 221 faults did not run again after the test lines of d58140d7, and `evidence/mutations-run.txt` says so. The command `make gates CHANGE=reticulum-layer` on the archived tree after those lines gave the one error REVIEW-MISSING and no change of the trace files.

Verdicts (spec adversary / STE adversary): round 1 FAIL / FAIL; round 2 FAIL / PASS; round 3 PASS / PASS.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING critical (spec-adversary) The scenario `osh-033` said that the registry has 30 entries, and the test with that tag asserted 31. Corrected: the delta `specs/osh/spec.md` modifies the requirement "Systems layer" with its 9 scenarios word for word, and only the count is 31. Tasks 1.9 and 1.10 name the IDs, the proposal and design D6 say so, and the Known limit `osh-count` says that each new layer needs a new delta.
- [x] FINDING major (spec-adversary) Scenario 005 said "exactly the fields", and no test input had a field outside the list. Corrected: the test has `host` and `key` in the record and in the radio, and two faults copy every field (`evidence/mutations-round2.txt`).
- [x] FINDING major (spec-adversary) "A value is not a date if it does not meet both rules" had two meanings. Corrected after three more pre-reviews: "A value that is not a text, or for which `Date.parse` gives no finite number, is not a date."
- [x] FINDING major (spec-adversary) "the `collisionGroup` and the `paintLane` "ambient-label"" had two meanings. Corrected: scenario 010 gives each key its own value.
- [x] FINDING minor (spec-adversary) No sentence said what `disable` does to the sources. Corrected: an AND in scenario 015.
- [x] FINDING minor (spec-adversary) The fallback of `meta.total` had no sentence. Corrected: two ANDs in scenario 008, and a fault.
- [x] FINDING minor (spec-adversary) The title of the ledger test named 4 and 5, and the body used 5 and 6. Corrected, see the major finding of the STE adversary below.
- [x] FINDING minor (spec-adversary) The totals of `src/data/layerState.js` in the ledger grew by 2 branches, and the reason was open. Explained: `layerState.test.mjs` alone gives 274 branches and 228 hit branches on main and on the branch, and the lines go from 1082 to 1087. So the 2 extra branches appear only in the merged measurement of the whole project, and the uncovered counts of the file equal those of main.
- [x] FINDING minor (spec-adversary, first message) `evidence/host-checks.txt` and `evidence/mutations-round2-run.txt` listed the later changes of the ledger test in two ways. Corrected: one list in all evidence files.
- [x] FINDING major (ste-adversary) The title "PR B manually replaces provisional 4 with 5 after PR A publishes 4" did not agree with the fixture, which used 5 and 6. The ledger holds the title, so a rename opens a gap (the first ratchet stopped with LEDGER-NEW-UNTRACED-NAME). Corrected: the test has its title and its original digits again. The helper `writeCodecFixture` leaves out the registry entry of the layer when the rows do not reserve it, and the test uses the rows without the layer.
- [x] FINDING minor (ste-adversary) The fault history gave 224, four duplicates and two new faults, and 221. Corrected: 224 - 8 + 5 = 221, with the names of the groups.
- [x] FINDING minor (ste-adversary) "a comment in layerStateTokenLedger.test.mjs" omitted the title. Corrected with the lists of the evidence files.
- [x] FINDING minor (ste-adversary) "the 48 most important interfaces" in `proposal.md` was vague. Corrected: "the best status first, then the newest".
- [x] FINDING minor (ste-adversary) "missing" in scenarios 001, 005 and 008, and in the titles of tests 001 and 005. Corrected.
- [x] FINDING minor (ste-adversary) Passive voice in scenarios 002 and 006. Corrected.

### Round 2 (scope diff bbf01a82) - FAIL / PASS

- [x] FINDING major (spec-adversary) No test asserted the reason text of an unavailable document that has a reason, so a fault that always gives the default reason survived. Corrected: test 008 asserts the text 'Down', and the fault "Use the default reason for every unavailable document" is caught by test 008.
- [x] FINDING minor (spec-adversary) No fault removed the part "is not a text" of the date rule. Corrected: the tests have the number 2026 for `lastHeard` and `fetchedAt`, and the fault "Accept a date that is not a text" is caught by tests 006 and 008.
- [x] FINDING minor (ste-adversary) "the result keeps only the first interface with the same `id`" in scenario 006 has no referent for "the same". Accepted by the lead: a change of the scenario needs another ratchet. Test 006 pins the meaning (the result keeps the first interface), and both reviewers read the text again in round 3 and raised no new finding.
- [x] FINDING minor (ste-adversary) "the overlay host gets `setVisible` with false" in scenario 002 names a function as the thing that the host gets. Accepted by the lead: a change of the scenario needs another ratchet. Test 002 records the calls of `setVisible`, and round 3 raised no new finding.
- [x] FINDING minor (ste-adversary) Sentences of more than 25 words in the evidence files. Corrected: the sentences are split.
- [x] FINDING minor (ste-adversary) `evidence/host-checks.txt` omitted the trace files in its list of later changes. Corrected: the same list in all evidence files.

### Round 3 (scope diff ebf95ecf) - PASS / PASS

- [x] FINDING minor (spec-adversary) The brief of round 3 named 37a3809e as the last test change, and the last test commit is d58140d7. This is a note of the reviewer and not a finding of the change. The lead sent a correction of the count of later commits, and this file names the commits.

### Pre-reviews, before the first ratchet (1 to 5)

- [x] FINDING major (spec-adversary, pre-review 1) No fault targeted scenario 013 and no fault changed the share disposition. Corrected: supplement faults in `evidence/mutations-round2.txt`.
- [x] FINDING major (both, pre-review 1) The terms of the cleaning, the position, the date and the order of the ids had more than one meaning, and `docs/fork/reticulum-docker.md` said that the layer comes later. Corrected: the requirement lists the removed code points, defines a position and a date, and the documents are true.
- [x] FINDING major (ste-adversary, pre-review 1) `proposal.md` said that the panel group and the credits are not tested. Corrected.
- [x] FINDING major (both, pre-reviews 2 and 3) "the last answer that the source returns", "A cleaned name cannot hide or reorder other text" and "has no direction mark and no zero width character" were false or had two meanings. Scenario 010 also had two meanings ("keeps at most 48 interfaces" and the order), and a false sentence about the contract assertions stood in the evidence. Corrected in the requirement "Layer display", in design D2, in scenario 010 and in the evidence.
- [x] FINDING major (spec-adversary, pre-review 3) `evidence/visual-check.txt` recorded the name of a real operator. Corrected: the evidence gives screen positions only.
- [x] FINDING major (both, pre-reviews 4 and 5) design D2 line 18 had the same fault as line 19, "white space at the start and the end" had two meanings, and `evidence/host-checks.txt` named an older commit. Corrected.
- [x] FINDING minor (both, pre-reviews 1 to 5) Several minor findings: the Known limits `names` and `scripts-as-text`, the order of the ledger rows, the claim about open upstream pull requests (now `evidence/upstream-token-claims.txt`, at least 3 of 293), the scenarios for the catalog order and the source contract, the wording of several lines. Corrected.

### Pre-reviews, after round 1 (6 to 9)

- [x] FINDING major (spec-adversary, pre-review 6) "is not a finite number" was wider than the radio test, "has no text for it, or the text is empty" had two meanings, and the evidence named commits that did not match the files. Corrected: the radio test gives each number undefined, NaN, Infinity and the text "8"; the reason rule is on the cleaned text; the evidence names the commits.
- [x] FINDING major (ste-adversary, pre-review 6) The evidence said which files each run covered, and it was false in four places. Corrected: the faults, the host checks and the evidence ran again on the final files, and the statements name the commits.
- [x] FINDING minor (both, pre-reviews 7 to 9) The reason rule on an empty cleaned text, the title of test 005, the date sentence, three cases for the reason and the date, and the words that name the new case and the new assertions. Corrected.
