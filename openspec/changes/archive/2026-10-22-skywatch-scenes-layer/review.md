# Review: skywatch-scenes-layer

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-22
Gates: make gates CHANGE=skywatch-scenes-layer passed
Rounds: 4
Scope: diff 14f9d252
Reviewed-Tree: 0

## Findings

A plan review came first (FAIL from both reviewers, at the plan commit 553f3e59). The lead corrected its findings in the plan before the code. Its reports are outside the repository.

Round 1 had the scope full, at the commit 95f26aee. Both reviewers gave FAIL. The corrections changed the specs, the tests and the documents, so the lead moved the change back from the archive (c1b7c8f5), restored `openspec/specs` from 73ef093b, ran the faults, the host tests, the checks and the ratchet again, and archived the change again (57a7e804).

Round 2 had the scope diff 95f26aee. Both reviewers gave FAIL. The lead moved the change back again (06369969), restored `openspec/specs` from 8aeaa8d1, made the corrections, ran the checks again and archived the change again (14f9d252).

Round 3 had the scope diff 57a7e804. Both reviewers gave FAIL with one major finding each. The lead moved the change back again (a4970bb6), restored `openspec/specs` from 6b765626, made the corrections, ran the checks again and archived the change again (c4ae480f). Round 4 was a narrow confirmation round for the two major findings of round 3, with the scope diff 14f9d252. Both reviewers gave PASS.

No code file and no QA script changed after the commit d3fcdd69. Only specs, tests and documents changed in the review rounds.

The reports of each round are in `review/round-<n>/`, and the reports of round 4 are also in `review/`. Each file holds the report word for word.

After round 4, the lead changed only `evidence/faults.txt` and `proposal.md` of the archive folder. The final `make gates` checks the final tree.

### Round 1 (commit 95f26aee)

- [x] FINDING major (STE adversary) The requirement "Status of the key" said "at each call of `update`", but `update` reads nothing while the layer is not enabled. Fixed: "at each call of `update` while it is enabled".
- [x] FINDING major (STE adversary) The requirement "Layer display" said "the answer to its newest press" and "release everything when it is disabled". Fixed: the layer shows the footprints of its newest good answer, also after a later press fails. A call of `disable` stops each request and removes the footprints and the card. A call of `destroy` releases everything.
- [x] FINDING major (spec adversary) The fake globe had the ellipsoid `Cesium.Ellipsoid.WGS84`, which is also the default value. So a default value passed the test of 008 (rule 15). Fixed: the fake globe has an ellipsoid of its own, and the faults "pick on the WGS84 ellipsoid" and "pick on the default ellipsoid" are in fault run 4.
- [x] FINDING minor (spec adversary) No test of 005 moved the timers. Fixed: a test with mocked timers, and the fault "search again on a timer after a failure".
- [x] FINDING minor (spec adversary) Four calls of `assert.rejects` had no matcher, and no test read a failure body over the limit. Fixed: the matcher `{name:'AbortError'}`, a test with a failure body of 8388609 bytes, and the fault "cap of a failure body 8388609".
- [x] FINDING minor (spec adversary) Some settings of the card, of `setEntries` and of `init`, and the limit of the status body had no scenario. Fixed: the Known limit `untested-settings` names them.
- [x] FINDING minor (spec adversary and STE adversary) `docs/CURRENT-STATE.md` said "The script proves", and it had the word "explicit". Fixed: "The script checks", and "an OFF action of the user".
- [x] FINDING minor (spec adversary) The proposal said that "00" stays free in each fixture. Fixed: the ledger rows and the registry entries of each fixture.
- [x] FINDING minor (STE adversary) "after the abort of its request" used a verb as a noun. Fixed: "after the layer aborts its request".
- [x] FINDING minor (STE adversary) Five test titles used the passive or "has ended", and one title said "the signal of the caller". Fixed.
- [x] FINDING minor (STE adversary) Four test titles used "row" for a sample of the spec. Fixed: "sample".
- [x] FINDING minor (STE adversary) The UI text "The daily limit of 20 searches is used." is passive. Kept: the lead accepts this minor finding under the owner rule. The merged layer "Bee Maps Frames" uses the same form, "The daily limit of 20 requests is used.".

### Round 2 (commit 57a7e804)

- [x] FINDING major (spec adversary and STE adversary) The requirement "Layer display" said "the footprints of its newest good answer", and it did not say that `disable` forgets the answer. It also said "stop" where scenario 026 says "abort". Fixed: "the footprints of the newest good answer that it keeps", and "A call of `disable` MUST abort each request, forget the answer, and remove the footprints and the card."
- [x] FINDING major (STE adversary) Scenario 005 said that the fake clock and the mocked timers move 10 minutes, but one test moved only the clock and another moved only the timers, for one case. Fixed: one test moves the fake clock and the mocked timers 10 minutes for each of the three cases. The faults "search again on a timer after a rejection" and "search again on a timer after search_timeout" are in fault run 6.
- [x] FINDING minor (spec adversary) The mocked-timer test used one case and did not move the clock. Fixed with the major finding above.
- [x] FINDING minor (spec adversary and STE adversary) The Known limit `untested-settings` said "copied from the CCTV card", but `interactive` differs, and "the card paints" had no object. Fixed: "The change took them from an active CCTV card, except `interactive` false", and "the overlay host paints the card".
- [x] FINDING minor (spec adversary) `evidence/faults.txt` said that runs 4 and 5 have four more faults, but run 4 stopped before the fourth. Fixed: the fault list of runs 4 and 5 has four more faults, and run 4 killed two of them.
- [x] FINDING minor (spec adversary) Task 1.13 did not name `docs/CURRENT-STATE.md`. Fixed, and task 1.14 names the corrections of round 2.
- [x] FINDING minor (STE adversary) "after the layer aborts its request" can refer to each request of the layer. Fixed in scenario 032 and in its test title: "after the layer aborts the request of that image".

### Round 3 (commit 14f9d252)

- [x] FINDING major (STE adversary) "A call of `disable` MUST abort each request" can also mean a request that ended, but scenario 026 says that `disable` does not abort a status request that ended. Fixed: "abort each request that runs".
- [x] FINDING major (spec adversary) The test of 005 read the chip only after `disable` and `enable`, so a fault that keeps the search request after a failure passed. The merge of the two tests of 005 in round 2 removed that check. Fixed: the test reads the chip and its label after the clock and the timers move, and the fault "search request kept after a failure" is in fault run 7.
- [x] FINDING minor (spec adversary) "abort each request" also in the minor list. Fixed with the major finding above.
- [x] FINDING minor (spec adversary) The requirement "Layer display" has no sentence for the listener calls of 028 or the calls of `requestRender` of 024. Kept: the lead accepts this minor finding under the owner rule. The scenarios 024 and 028 state each call, and a new sentence in the last round can add a new fault.
- [x] FINDING minor (spec adversary) No fault isolated the case "upstream_rate_limit" of 005. Fixed: the fault "search again on a timer after upstream_rate_limit" is in fault run 7.
- [x] FINDING minor (spec adversary) Task 1.14 did not name `evidence/faults.txt`. Fixed, and task 1.15 names the corrections of round 3.
- [x] FINDING minor (STE adversary) The title of the test of 005 had a clause with two meanings and said "the clock". Fixed: "sends no search after an error while the fake clock and the mocked timers move 10 minutes, and sends one search at the next press".
- [x] FINDING minor (STE adversary) The Known limit `untested-settings` had "They" with two meanings and "except `interactive` false" with no verb. Fixed.
- [x] FINDING minor (STE adversary) `evidence/faults.txt` used "puts ... into" and "a search again". Fixed: "replaces the two tests ... with one test", and one sentence for each fault.

### Round 4 (commit c4ae480f)

Both reviewers gave PASS. Each major finding of round 3 is closed.

- [x] FINDING minor (STE adversary) A sentence of `evidence/faults.txt` used "before disable and enable" with two meanings. Fixed: "between the error and the calls of disable and enable".
- [x] FINDING minor (STE adversary) Scenario 027 says "each request in flight", and the requirement says "each request that runs". Kept: the lead accepts this minor finding under the owner rule. A new text of 027 changes its hash and needs another ratchet.
- [x] FINDING minor (spec adversary) No test presses the chip again right after a failed search, without `disable` and `enable` first. Kept: the lead accepts this minor finding under the owner rule, and the proposal names it as the Known limit `press-after-error`.
- [x] FINDING minor (spec adversary) The comment of `createSkywatchScenesLayer` in `src/layers/skywatchScenes/index.js` says that the layer never sends a search again after an error, but a press after an error sends one. Kept: the lead accepts this minor finding under the owner rule. `design.md` D2 says "by itself", and a change of the comment is a change of a code file.
