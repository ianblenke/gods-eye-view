# Review: gdacs-layer

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-19
Gates: make gates CHANGE=gdacs-layer passed
Rounds: 6
Scope: diff 7b45cb8b149f1bb961fdfde675b8a50bdba26b7f
Reviewed-Tree: 882ecd9dbc8dfbe08227ee874d80a2ae8eb82cf1dab8f695de47e87d2755f1d4

## Findings

A plan review came first (one round, both FAIL, at the plan commit 73d113d6). The lead corrected its findings in the plan before the tests. Its reports are outside the repository.

The reports of the earlier rounds are in `review/round-<n>/`. The reports of the last round are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

Round 1 had the scope full, at the commit 9896f1af. Both reviewers gave FAIL. The corrections changed the spec, the code and the tests, so the lead moved the change back from the archive, restored `openspec/specs` from a4c9192a, and ran the faults, the host tests, the browser check and the ratchet again. Round 2 had the scope diff 9896f1af, at the commit 8c12aec5. Both reviewers gave FAIL. The corrections changed the spec and the tests, so the lead moved the change back again, restored `openspec/specs` from d34dae89, and ran all the evidence and the ratchet again. Round 3 had the scope diff 8c12aec5, at the commit b3c77820. Both reviewers gave FAIL, each with one major finding. The owner rule allows a narrow confirmation round only to close a major finding, so rounds 4, 5 and 6 checked only the corrections of the open majors. Round 4 (at 746c6eef) gave PASS and FAIL, round 5 (at 7b45cb8b) gave FAIL and FAIL, and round 6 (at f1ea3798) gave PASS and PASS with no finding. After round 3, no code file and no test file changed: the faults, the host tests, `gates.test.mjs` and the browser check of the evidence commit 60a6d6a4 stay valid.

The first ratchet run stopped with 10 SPEC-LINT-NO-TASK errors, because three tasks named ranges of scenario IDs. The commit ece03055 names each ID. The second ratchet run gave only REVIEW-MISSING.

### Round 1 (commit 9896f1af)

- [x] FINDING major (STE adversary) The duplicate rule "It MUST NOT count a second event with the same `id`" did not say that the normalizer keeps only the first event. Fixed: "It MUST keep only the first event of each `id`, and it MUST NOT count a second event with that `id` toward the limit."
- [x] FINDING major (STE adversary) "emoji" had two meanings. Fixed: the samples say "copies of U+1F30A", as the tests use.
- [x] FINDING major (STE adversary) "the result of its newest request" had no meaning for a failed request. Fixed: "the newest result of the source. When a later request fails, it MUST keep those points and labels."
- [x] FINDING major (spec adversary and STE adversary) The proposal said that design D6 names each test. Fixed: "Tasks 2.6 to 2.16 name each change of these tests."
- [x] FINDING major (spec adversary) The design and `DATA_SOURCES.md` said that the credit holds the disclaimer of the route, but the credit had only its first sentence. Fixed in the code: the credit has both sentences, and scenario 021 and its test check the second sentence (new fault: the credit without the second sentence).
- [x] FINDING minor (spec adversary) The test of 011 did not catch a cut before the sort. Fixed: the test gives 60 events in the reverse order of the sort and checks the 48 ids (new fault: the cut before the sort).
- [x] FINDING minor (spec adversary) No test caught a layer that refuses `init` after `destroy`, or that keeps the error after an unavailable result. Fixed: scenario 002 and scenario 013 have one more line each, with tests and two new faults.
- [x] FINDING minor (spec adversary) Scenario 009 said "a whole number" for `counts.total`, and the code uses a safe whole number. Fixed: "a whole number from 0 to 9007199254740991", with the sample 9007199254740992 (new fault: an unsafe whole number).
- [x] FINDING minor (spec adversary) The browser screenshot showed the loading text "Restoring shared view". Fixed: the browser check waits until that text is gone, and a check of the run says so.
- [x] FINDING minor (STE adversary) Six test titles broke STE rules. Fixed: the titles of 003, 007, 010, 011, 016 and 021.
- [x] FINDING minor (STE adversary) The spec used "run" as a noun, a title had no articles, and "that call" had no noun before it. Fixed: "sequence of white space characters", "Style the points by the alert level and the current flag" and "the call of `setEntries`".
- [x] FINDING minor (STE adversary) `CHANGELOG.md` put the points in the group "Events". Fixed: the layer is in the group.
- [x] FINDING minor (STE adversary) `DATA_SOURCES.md` said that the credits hold the warning, but the credit had one sentence of two. Fixed in the code (see the major finding above), so the sentence is true.
- [x] FINDING minor (STE adversary) The Known limit `no-card` said that a label shows the name. Fixed: the first 32 code points of the name.

### Round 2 (commit 8c12aec5)

- [x] FINDING major (spec adversary and STE adversary) "keep only the first event of each `id`" had two meanings when the first event with that id does not meet the rules. Fixed: "Of the events that meet the rules, it MUST keep only the first event of each `id`", with the sample of an invalid "FL-8" before a valid "FL-8" in 006 and its test (new fault: a second id checked before the rules).
- [x] FINDING major (STE adversary) The requirement "Layer display" had no rule for a result with `meta.unavailable` true. Fixed: "For a result with `meta.unavailable` true, it MUST remove all points and labels", and the unavailable result of 013 and its test now hold 2 events (new fault: events shown when unavailable).
- [x] FINDING major (spec adversary) "the newest result of the source" had two meanings, and no fault showed that the layer ignores an aborted answer. Fixed: "the result of its newest call of `update`. It MUST ignore an answer to a request that it aborted", one more line in 016, and the fault "answer of an aborted request used".
- [x] FINDING minor (spec adversary) After `disable` and `enable`, the layer shows its old points with no labels until an update succeeds. Kept: Known limit `labels-after-enable`.
- [x] FINDING minor (spec adversary) The browser check of the loading text passed when the page gave no text. Fixed: the check needs a text that is not empty.
- [x] FINDING minor (STE adversary) The fault "credit without the disclaimer" removed only the first sentence. Fixed: its new name is "credit without the first sentence of the disclaimer". Each run writes `evidence/faults.txt` for the commit of that run, and the output of the earlier runs stays in the Git history.
- [x] FINDING minor (STE adversary) "works" and "can show points again" in 002 were vague. Fixed: "after `destroy`, a call of `init`, `enable` and `update` adds one data source and shows 3 points", and the title says "accepts a call of init after destroy".
- [x] FINDING minor (STE adversary) The title of 010 used "style" as a verb. Fixed: "Give the points the color of the alert level and the size and the alpha of the current flag".
- [x] FINDING minor (STE adversary) In 009, "when that is" had no noun, and in 011, "the reverse order" did not name the order. Fixed: "when that value is" and "the reverse order of that sort".

### Round 3 (commit b3c77820)

- [x] FINDING major (spec adversary) The test of 016 let the new request answer first, so a fault that clears the pending request in each `finally` passed each test, and no test showed that the layer ignores an aborted answer that arrives first. Fixed: the test of 016 lets the aborted request answer before the newest call and checks that the newest result counts (new fault: the aborted answer clears the newest request).
- [x] FINDING major (STE adversary) The first sentence of the requirement "Layer display" said that the layer shows the labels of its newest result, and the Known limit `labels-after-enable` says that it shows no labels after `disable` and `enable`. Fixed: "the layer MUST show the points of the last result that it accepted. It MUST show the labels of that result until the next call of `disable`. It MUST NOT accept an answer to a request that it aborted."
- [x] FINDING minor (spec adversary) The failure path of an aborted request had no named fault. Fixed: the fault "error of an aborted request used".
- [x] FINDING minor (STE adversary) "When a later request fails" had no base, and "points and labels" had no article. Fixed: "When a request fails, it MUST keep the points and the labels that it shows" and "remove all the points and the labels".
- [x] FINDING minor (STE adversary) The title of 006 said "keeps the first of two equal ids". Fixed: "keeps the first valid event of each id".
- [x] FINDING minor (STE adversary) In 002, "a call of `init`, `enable` and `update` adds" named three calls with a singular noun. Fixed: "calls of `init`, `enable` and `update` add one data source and show 3 points".

### Round 4 (confirmation round, commit 746c6eef)

The owner rule allows a narrow confirmation round only to close a major finding after round 3. Round 4 checked only the corrections of the two round-3 majors and the four round-3 minors. The spec adversary gave PASS, and the STE adversary gave FAIL.

- [x] FINDING major (STE adversary) The requirement "Layer display" named only `disable` as the end of the labels, while scenario 017 removes them with `destroy`, and it did not say which rule wins for an accepted result with `meta.unavailable` true. Fixed: the requirement now gives one rule for each event: an accepted unavailable result, another accepted result, a failed request, `disable` and `destroy`.
- [x] FINDING minor (spec adversary) The same sentence had no limit for `destroy`. Fixed with the major finding above.
- [x] FINDING minor (STE adversary) Paragraph 2 started with "it" after "a request". Fixed: each sentence names the layer.

### Round 5 (confirmation round, commit 7b45cb8b)

Round 5 checked only the new text of the requirement "Layer display". Both reviewers gave FAIL with the same major finding.

- [x] FINDING major (spec adversary and STE adversary) "The layer MUST accept the answer to its newest call of `update`" had no limit, so it conflicted with "MUST NOT accept an answer to a request that it aborted" when `disable` or `destroy` aborts the request of the newest call. Fixed: "The layer MUST NOT accept an answer to a request that it aborted. If the layer did not abort the request of its newest call of `update`, it MUST accept the answer to that request."
- [x] FINDING minor (STE adversary) "another result" can mean "one more result". Fixed: "a result with `meta.unavailable` false".

### Round 6 (confirmation round, commit f1ea3798)

Round 6 checked only the requirement "Layer display" after the correction of round 5. Both reviewers gave PASS with no finding.
