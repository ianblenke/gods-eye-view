# Review: upstream-sync-12

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-25
Gates: make gates CHANGE=upstream-sync-12 passed
Rounds: 3
Scope: diff 693a5a757
Reviewed-Tree: a66f69168bfcae4eb1b3ebc79992f3870824039139f8e74a06333a181efc7c32

## Rule 21 check

The merge commit `35394ebbd` has the parents `1ab583259` and `fca2c81d8`. `git branch -r --contains` shows that the second parent is in `upstream/main`.

Resolved files: `.env.example`, `DATA_SOURCES.md`, `openspec/ownership.json`, `openspec/trace/upstream-test-findings.json`, `scripts/format-scope.json`, `scripts/package-boundaries.json`, `src/data/cctvOntarioRows.test.mjs`, `src/i18n/same-as-english.json`, `src/layers/cyclones/labels.test.mjs`, `src/layers/cyclones/source.test.mjs`, `src/layers/perimeters/cards.forkBackfill.test.mjs`, `src/layers/perimeters/inciweb.test.mjs`, `src/layers/perimeters/records.test.mjs`, `src/layers/perimeters/source.test.mjs`, `src/layers/recentImagery/catalog.test.mjs`, `src/layers/recentImagery/model.test.mjs`, `src/layers/recentImagery/thumbnails.test.mjs`, `src/scenes/director.test.mjs`, `src/tooling/blenderCameraPartialWrite.test.mjs`, `src/ui/contextActions.forkBackfill.test.mjs`

## Findings

Round 1 and round 2 gave FAIL from both reviewers. The lead corrected each finding of these two rounds. Round 3 gave PASS from both reviewers. The reports are in `review/`, `review/round-1/` and `review/round-2/`.

- [x] FINDING critical (spec adversary, round 1) The Contacts test had a viewer check that was not able to fail. The test now connects the viewer to the flight layer.
- [x] FINDING critical (spec adversary, round 1) No test of `perimeters-001` checked the pieces. A new test checks each fire and each piece.
- [x] FINDING major (spec adversary, round 1) The `cyclones` spec did not name the JTWC storms. The change writes the scenarios again.
- [x] FINDING major (spec adversary, round 1) The `cyclones` spec did not name the area label. The change writes the scenarios again.
- [x] FINDING major (spec adversary, round 1) The scenario `perimeters-021` did not give the age limit of stale rows. The scenario now gives it, and a test checks the two sides.
- [x] FINDING minor (spec adversary, round 1) The proposal did not record the limit of the exporter test. It now records it.
- [x] FINDING minor (spec adversary, round 1) A comment in the director test was wrong. It now agrees with the code.
- [x] FINDING minor (spec adversary, round 1) `DATA_SOURCES.md` had a different dash in the Ontario license. It now has the dash of the code.
- [x] FINDING major (STE adversary, round 1) The director scenario had two meanings for the last shot. It now has two lines.
- [x] FINDING major (STE adversary, round 1) The words about a response with no rows had two meanings. They now name the `rows` list.
- [x] FINDING major (STE adversary, round 1) The scenario `perimeters-006` used the word row for a fire. It now says fire.
- [x] FINDING major (STE adversary, round 1) A test title of `perimeters-001` disagreed with the scenario. It now agrees.
- [x] FINDING minor (STE adversary, round 1) Director heading wording. Corrected.
- [x] FINDING minor (STE adversary, round 1) Director test title wording. Corrected.
- [x] FINDING minor (STE adversary, round 1) Contacts scenario terms. Corrected.
- [x] FINDING minor (STE adversary, round 1) Contacts test title terms. Corrected.
- [x] FINDING minor (STE adversary, round 1) Proposal wording on timing. Corrected.
- [x] FINDING minor (STE adversary, round 1) Design wording on the merge. Corrected.
- [x] FINDING minor (STE adversary, round 1) Task wording on scenario IDs. Corrected.
- [x] FINDING minor (STE adversary, round 1) Comment wording in the exporter test. Corrected.
- [x] FINDING critical (spec adversary, round 2) No test gave the validator a wrong danger area. A new test does.
- [x] FINDING major (spec adversary, round 2) The wrong JTWC id case was not able to fail for its reason. The case now changes the basin too.
- [x] FINDING major (spec adversary, round 2) No test rejected a wrong JTWC outlook path. The test now rejects these paths.
- [x] FINDING minor (spec adversary, round 2) The first line of `perimeters-021` had no age limit. It now has an exception.
- [x] FINDING minor (spec adversary, round 2) No test checked the card fields of the area label. The test now checks them.
- [x] FINDING minor (spec adversary, round 2) The proposal list of tests was not complete. It now names each scenario.
- [x] FINDING major (STE adversary, round 2) The JTWC id line had two meanings. Corrected.
- [x] FINDING major (STE adversary, round 2) The two lines of `perimeters-021` disagreed. Corrected.
- [x] FINDING major (STE adversary, round 2) The proposal list of tests disagreed with the tests. Corrected.
- [x] FINDING minor (STE adversary, round 2) Proposal wording on the child process. Corrected.
- [x] FINDING minor (STE adversary, round 2) The card colour line now names storm cards.
- [x] FINDING minor (STE adversary, round 2) Label test titles. Corrected.
- [x] FINDING minor (STE adversary, round 2) JTWC test titles. Corrected.
- [x] FINDING minor (STE adversary, round 2) Perimeter test titles. Corrected.
- [x] FINDING minor (STE adversary, round 2) Card test title. Corrected.
- [x] FINDING minor (STE adversary, round 3) The proposal words on the child process had two meanings. The lead corrected the proposal.
- [ ] FINDING minor (spec adversary, round 3) No test rejects a JTWC storm id with five or seven digits. Known limit `jtwc-digits`. Accepted by Ian Blenke.
- [ ] FINDING minor (STE adversary, round 3) The words "except old rows" in `perimeters-021` get the age limit only from the next line. Accepted by Ian Blenke.
- [ ] FINDING minor (STE adversary, round 3) One JTWC test title ends with a clause with no verb. Accepted by Ian Blenke.
