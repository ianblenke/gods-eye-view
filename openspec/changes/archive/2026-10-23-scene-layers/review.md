# Review: scene-layers

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-23
Gates: make gates CHANGE=scene-layers passed
Rounds: 2
Scope: diff 69dca8f9
Reviewed-Tree: 4cf872d796b018efc8ce4c95bb8f5bd29af9b22ee12b8aed1b73357a7b2fa3e6

## Findings

A plan review came first (FAIL from both reviewers, at the plan commit 17d695ae). The lead corrected its findings in the plan before the tests and the code. Its reports are outside the repository.

Round 1 had the scope full, at the commit 69dca8f9. Both reviewers gave FAIL. The corrections changed tests, one code file and documents, so the lead moved the change back from the archive, restored `openspec/specs` from the ratchet commit, ran the faults (runs 4 and 5), the host tests, the checks, the browser run and the ratchet again, and archived the change again (c243ed4c).

Round 2 had the scope diff 69dca8f9. Both reviewers gave PASS.

The reports of each round are in `review/round-<n>/`, and the reports of round 2 are also in `review/`. Each file holds the report in the shape of the reviewer.

### Round 1 (commit 69dca8f9)

- [x] FINDING major (spec adversary) No test of this change asserted most lines of the scenarios 008 and 009. Fixed: tests tagged 008 and 009 with the three box samples, the window at the clock, the limit samples of the latitude and the longitude, the east value 180 and the west value -180, the order of the reasons and a view centre that is not valid. The faults for the code that these tests reach are in fault run 5.
- [x] FINDING major (STE adversary) The design called the argument `provider`. Fixed: `service`.
- [x] FINDING major (STE adversary) The design said that `services.js` has a list label. Fixed: `model.js` chooses the label of the list by the name of the service.
- [x] FINDING major (STE adversary) The design said 35 scenario IDs. Fixed: 36.
- [x] FINDING major (STE adversary) The word "rejection" had two meanings in the source scenarios. Fixed: "a rejection of the fetch function, except an abort by the signal of the call".
- [x] FINDING minor (spec adversary) The line "the routes of Planet and SkyFi use that function" had no test. Fixed: the line is now in the design.
- [x] FINDING minor (spec adversary) "an earlier scene" had two meanings. Fixed: "an earlier kept scene".
- [x] FINDING minor (spec adversary) The order of the sample pairs. Fixed: latitude and longitude are named.
- [x] FINDING minor (spec adversary) The id goes into the thumbnail URL as it is. Fixed: the Known limit `thumbnail-id`.
- [x] FINDING minor (STE adversary) "the layer throws" in place of `createSceneLayer`, the pair (60.0, 10.0), and "way of working". Fixed.
- [x] FINDING minor (STE adversary) The passive "The daily limit of 20 searches is used.", "source" with four meanings, and "centre" next to "color". Kept: the lead accepts these minor findings under the owner rule. A change of the message is a change of a code file and of many tests.
- [x] FINDING minor (the lead, from the new tests) `viewCentre` threw for a point that is not valid. Fixed in `src/layers/sceneLayer/index.js`: the function catches it and gives the reason "sky". The same code is in the layer "SkyWatch Scenes", which this change does not change.

### Round 2 (commit c243ed4c)

Both reviewers gave PASS. Each major finding of round 1 is closed.

- [x] FINDING minor (spec adversary) No test passes a non-finite latitude or longitude to `scenesBox`. Kept: the lead accepts this minor finding under the owner rule. The function is in the layer "SkyWatch Scenes", and its own tests check it.
- [x] FINDING minor (spec adversary) The order "sky" before "latitude" cannot be tested for "sky". Kept: the lead accepts this minor finding under the owner rule.
- [x] FINDING minor (spec adversary) Runs 4 and 5 share a commit, and the runner is outside the repository. Kept: the lead accepts this minor finding under the owner rule. `evidence/faults.txt` says it.
- [x] FINDING minor (STE adversary) Eight small wording points: "behavior", "label" and "names", "the middle of the view", "the first of", the grid before the check, "lets ... pass", the tense of the browser text, and "option now". Kept: the lead accepts these minor findings under the owner rule. Each change of a test title needs another ratchet.
