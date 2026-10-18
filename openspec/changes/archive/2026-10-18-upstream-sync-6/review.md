# Review: upstream-sync-6

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-18
Gates: make gates CHANGE=upstream-sync-6 passed
Rounds: 3
Scope: diff 3deef1e9f590a9619830199b56b4fa31b9b06fb6
Reviewed-Tree: 0b943e4aed58b065593cf3cfa6a787c894c4637c5e2bd4b0888a52221f7572e4

## Findings

The reports of rounds 1 and 2 are in `review/round-1/` and `review/round-2/`. The reports of round 3 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

Resolved files: the 43 conflict files `.dockerignore`, `.env.example`, `CHANGELOG.md`, `Dockerfile`, `README.md`, `SECURITY.md`, `compose.yaml`, `docs/CURRENT-STATE.md`, `package.json`, `scripts/format-scope.json`, `scripts/package-boundaries.json`, `server/providers/places/google-key.js`, `server/providers/places/google.js`, `server/providers/transitHistory.test.mjs`, `src/annotations/annotationResolver.test.mjs`, `src/annotations/regionRing.test.mjs`, `src/app/constructCatalog.js`, `src/app/constructCatalog.test.mjs`, `src/app/controls.js`, `src/app/sourceComposition.test.mjs`, `src/data/layerState.test.mjs`, `src/data/layerStateTokenLedger.test.mjs`, `src/data/manager.test.mjs`, `src/director/timeline.test.mjs`, `src/googleGeocodeProxy.test.mjs`, `src/googleServerKey.test.mjs`, `src/keySetupCore.test.mjs`, `src/layers/perimeters/cards.test.mjs`, `src/layers/recentImagery/model.js`, `src/layers/wind/presentation.test.mjs`, `src/locations.js`, `src/sdr/controller.test.mjs`, `src/search/defaults.js`, `src/search/http.js`, `src/search/offlineGeocoders.test.mjs`, `src/search/placeSearch.test.mjs`, `src/sources/reference.js`, `src/sources/reference.test.mjs`, `src/ui/layerPanel.js`, `src/ui/recentImagery.js`, `src/ui/recentImagery.test.mjs`, `src/voice/gevActions.test.mjs`, `style.css`. The 15 files with hand edits outside the replayed hunks: `.dockerignore`, `Dockerfile`, `openspec/ownership.json`, `server/providers/places.js`, `server/providers/places/coordinates.js`, `server/providers/places/geocode.js`, `src/cityPois.js`, `src/data/layerState.js`, `src/data/layerState.test.mjs`, `src/data/layerStateTokenLedger.test.mjs`, `src/data/layerStateTokenReservations.json`, `src/data/placeProviderPayloads.js`, `src/googleGeocodeRateLimit.test.mjs`, `src/search/reverseGeocodeRoute.test.mjs`, `src/ui/locationControls.test.mjs`. `evidence/conflicts.txt` gives both lists, and the table in `design.md` gives the resolution of each file. The review also read the files that the commits after the merge change (`evidence/after-merge.txt`) and the change documents.

Round 1 had the scope full, at the commit d35a3015. Both reviewers gave FAIL. Round 2 had the scope diff d35a3015, at the commit 3deef1e9. Both reviewers gave FAIL. Round 3 had the scope diff 3deef1e9, at the commit 9b635bd2. Both reviewers gave PASS with minor findings only.

After round 3, the lead changed only the proposal, the design and `tasks.md`. The lead added each minor finding of the spec adversary to the Known limits of the proposal. The lead corrected the minor findings of the STE adversary in the proposal and the design, or kept them with a reason. A change to a test file or to an evidence file needs another ratchet and another round.

Rule 21: the second parent of the merge commit b4847901 is 73aec2e6. `evidence/upstream-check.txt` shows that 73aec2e6 is an ancestor of upstream main 93ea088f. The adopt records name 73aec2e6 (`make adopt CHANGE=upstream-sync-6 FROM=73aec2e6b2ecfa865ddb7cb8839fa2d40fd0eb66`).

### Round 1 (commit d35a3015)

- [x] FINDING major (spec adversary) A keyless route answer read as an answered miss, so the place search kept the miss in its cache, against the upstream comments. Fixed in code: `src/search/google.js` is now the upstream file, and `credential-boundary-020` describes the upstream behavior, with a new test for a search with no browser key.
- [x] FINDING major (spec adversary) The old CSP bullet of `SECURITY.md` said "no other script origin" after the bullet that adds the Maps script origin. Fixed: the old bullet is removed.
- [x] FINDING major (spec adversary) The layer counts of D5 used the shared ancestor as the base. Fixed: 34 + 2 = 36 catalog layers, and 33 + 2 = 35 registry rows.
- [x] FINDING major (spec adversary) Task 1.10 had two instructions. Fixed: tasks 1.10 and 1.11.
- [x] FINDING major (spec adversary) The scenario `cyclones-021` had two meanings for the spaces of the issue time. Fixed: a delta spec for `cyclones` adds one line that names the word joiner and the no-break spaces.
- [x] FINDING major (spec adversary) A comment and a block of `src/data/layerStateTokenLedger.test.mjs` were false and dead after the merge. Fixed: both are removed.
- [x] FINDING minor (spec adversary) No scenario checks the reverse route. Added as the Known limit `reverse-route-test`.
- [x] FINDING minor (spec adversary) The design said that ls-remote gave the upstream commit, with no output. Fixed: the design names the later output in `evidence/upstream-check.txt`.
- [x] FINDING minor (spec adversary) Tasks 3.4 and 3.5 were done but not checked. Fixed: each task has its check mark after its step.
- [x] FINDING minor (spec adversary) "17 other scenarios" left out `osh-control-031`. Fixed: the proposal names it for D10.
- [x] FINDING minor (spec adversary) `src/app/controls.js` had an import of `t` with no use. Fixed: the import is removed.
- [x] FINDING major (STE adversary) The same layer counts of D5. Fixed as above.
- [x] FINDING major (STE adversary) "edits the tests of 17 other scenarios" was false. Fixed with the replacement text, the sentence about `osh-control-031` and the line of `cyclones-021`.
- [x] FINDING major (STE adversary) "a new file name" was false for the test of `credential-boundary-019`. Fixed with the replacement text.
- [x] FINDING major (STE adversary) The same task 1.10. Fixed as above.
- [x] FINDING major (STE adversary) Task 1.21 said "a fault for each branch". Fixed: the task names the faults of `evidence/fault-020.txt`.
- [x] FINDING major (STE adversary) The comment of `src/search/defaults.js` was false in the merged tree. Fixed as the first finding of this round.
- [x] FINDING minor (STE adversary) Phrasal verbs and nouns made from verbs in the design. Fixed, with one more case at `design.md` line 40.
- [x] FINDING minor (STE adversary) "install" as a noun and "goes away" in the proposal and the delta spec. Fixed.
- [x] FINDING minor (STE adversary) "At the archive" was not exact. Fixed: "After the archive".
- [x] FINDING minor (STE adversary) The same ls-remote sentence. Fixed as above.
- [x] FINDING minor (STE adversary) "upstream call" in a fork line of `docs/CURRENT-STATE.md`. Fixed: "and do not call Google".

### Round 2 (commit 3deef1e9)

- [x] FINDING major (spec adversary) The 502 case of the status test could not fail under the body fault, and two comments were false. Fixed: the status test gives a body that reads as an answer for each status, the comments name the error bodies of the upstream route, and two faults check each status alone.
- [x] FINDING major (spec adversary) "It differs ... in one point" was false. Fixed: the proposal and the delta spec name each difference, with no count.
- [x] FINDING minor (spec adversary) The cache line did not say which cache. Fixed: two lines name the cache of the place search and the next request to the route.
- [x] FINDING minor (spec adversary) A comment of the fault script said "five tests". Fixed in the round-2 script. The earlier sections of the evidence file stay as records.
- [x] FINDING major (STE adversary) The same "in one point". Fixed as above.
- [x] FINDING major (STE adversary) "outside the change folder and `openspec/trace/`" was false. Fixed: "outside `openspec/`".
- [x] FINDING minor (STE adversary) The test name of `perimeters-005` used "anchors" as a verb. Fixed with the replacement text.
- [x] FINDING minor (STE adversary) "sends no request to the route" had two meanings. Fixed: "the Google route".
- [x] FINDING minor (STE adversary) "it does not keep earlier answers" had no clear subject. Fixed: "the reverse lookup".

### Round 3 (commit 9b635bd2)

- [x] FINDING minor (spec adversary) The design counted four files, but the check read only a part of the code files. Fixed in the design, and added as the Known limit `silent-files-subset`. The Known limit also says that the evidence file shows the filter as `grep -v test`, but that the filter that ran removes only the test files.
- [x] FINDING minor (spec adversary) The list of test changes did not name two changes to the test of the `configured:false` answer. Fixed in the proposal, and added as the Known limit `test-change-list`.
- [x] FINDING minor (spec adversary) One sentence of `evidence/scenario-tests.txt` about the error bodies is not exact. Added as the Known limit `evidence-error-bodies`. The evidence file stays as it is.
- [x] FINDING minor (STE adversary) The same four files. Fixed in the design. Kept in `evidence/silent-files.txt`, because the evidence file needs another round.
- [x] FINDING minor (STE adversary) "upstream fetch" in a comment of `src/search/placeSearch.test.mjs` means Google. Kept: a change to the test file needs another ratchet, and the comment names the route file.
- [x] FINDING minor (STE adversary) The status test had three names. Fixed in the proposal: "the status test". Kept in the test comment, `tasks.md` and the evidence files, because the sentences are true under each name.
- [x] FINDING minor (STE adversary) The same sentence of `evidence/scenario-tests.txt`. Kept, and added as the Known limit `evidence-error-bodies`.
- [x] FINDING minor (STE adversary) "two faults run the body fault" uses a fault as the subject of "run". Kept: the evidence file needs another round, and the sentence is clear.
