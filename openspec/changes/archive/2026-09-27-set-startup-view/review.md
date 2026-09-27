# Review: set-startup-view

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-27
Gates: make gates CHANGE=set-startup-view passed
Rounds: 3
Scope: diff c1abb1ab654d6218b67000c7173d865b0620ef63
Reviewed-Tree: 7de604a6fe67de42e67b13c70e669825235e38d1b262da991fde4682ee322dd2

## Findings

- [x] Round 1 spec-adversary F1 and F2 (critical): no test ran the call of `startApplicationView` in `src/app/controls.js`, and the tests of scenario `startup-view-001` did not show that the application calls `flyToStartView`. The lead first changed `controls.js` so that a test could import it. The ratchet command then stopped with `LEDGER-NO-BASELINE` (a file cannot change and load for the first time in one change) and `LEDGER-LARGER-GAP` for `src/standalone/controls.js`, so the lead went back to the first design. The scenarios now state the behavior of the function `startApplicationView`, which the tests prove, and the untested call in `controls.js` is the known limit `controls-call-untested` (the package `mgrs` fails to load on Node 26). The spec adversary passed this in round 2.
- [x] Round 1 spec-adversary F3 and F4 (minor): F3 is corrected in the proposal. F4 is not a defect (`REVIEW-MISSING` is the reason for the review).
- [x] Round 1 ste-adversary F1 (major) and F2 to F5 (minor): corrected in the proposal, the design, the tasks and the name of the test of scenario `startup-view-003` ("destroyed viewer").
- [x] Round 2 spec-adversary F1 (minor): not a defect (`REVIEW-MISSING`).
- [x] Round 2 ste-adversary F1 and F2 (major): the sentences of the known limit `controls-call-untested` had two possible meanings. Corrected after the round with the wording of the adversary. Round 3 confirms the correction.
- [x] Round 3 (narrow confirmation, both agents): PASS with no finding.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `e51a2df`, and round 3 since `c1abb1a`. All agents ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenarios `startup-view-001` to `startup-view-005` are new. The gate shows 444 scenarios verified with 0 open.
- [x] Constraints: no existing test is edited or renamed, and the old function `flyToAustin` and its test stay unchanged (known limit `austin-start-kept`). The change adds no request method for an OpenSensorHub server and no network call. The six QA scripts that assume an Austin start are listed in the design and not edited.

## Decisions and deviations

- [x] Owner request: the owner asked on 2026-09-26 for the default view on the initial page load: lat 24.18, lon 120.6485, alt 217 m, heading 0, pitch -35, roll 360. The roll 360 is the same angle as 0. The lead kept the cinematic pattern of the old fly-in (a view at 25000 m, then a flight of 4 s that starts after 500 ms), so the final view is the pose of the request. The owner can ask for an immediate view instead.
- [x] Ratchet run: the lead put the four files of `openspec/trace/` back to their content on `origin/main` before each ratchet run of this change, so that the history has one run. The ratchet also wrote two history lines for `src/data/labelArbiter.js`, which this change does not edit. The lead put that entry and those lines back to the values of `main`, by an edit of text with no measurement. The proposal says so.
- [x] The mutation log has 35 results for 12 mutations, all KILLED. Four of them (`001-app-call`, `004-app-share`, `005-app-loader`, `005-app-defer`) belong to the first try that the lead discarded, and they are not in `muts.json` any more. The 8 mutations of the final design are KILLED.

## Evidence

- [x] The gates run before this file (`make gates CHANGE=set-startup-view`, after the archive of round 2) showed `Trace: 444 scenarios, 444 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. After that run, only text of the proposal and the review records changed. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run format:check`, `npm run check:boundaries` and `npm run doctor`. The lead did not run `npm run build` and `npm test`; the gates run all 6275 tests. The lead did not open the application in a browser.

## Coverage of the changed code files

- [x] `src/camera.js`: the new functions (`flyToStartView`, `startApplicationView`) are covered, and its gap stays at 21 lines and 2 functions of the old code. `src/app/controls.js` has no test that imports it (50 lines not covered, 51 before).

## Mutation report

The worker ran the mutations of the code with the host runner (Node 26), and the runner restored each file after each run. The list is in `review/mutations/muts.json`, and the results are in `review/mutations/muts.json.log`. A mutation that no test fails is a finding.

- [x] The 8 mutations of the final design are KILLED: `startup-view-001-lat`, `001-height`, `001-wire`, `002-delay`, `003-clear`, `004-share`, `005-text` and `005-defer`.
