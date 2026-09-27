# Review: add-taiwan-location

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-27
Gates: make gates CHANGE=add-taiwan-location passed
Rounds: 3
Scope: diff bd15c48735e7f512108f928562c3c5a94171edea
Reviewed-Tree: a8d20fe4ca2c28477263a84f407857e055c6fe8439a2f709ab3fb09a062f2f3d

## Findings

- [x] Round 1 spec-adversary F1 (critical): no test showed that a click on the Taiwan pill starts the flight, because the pill test used an empty click handler. Corrected: a second test of scenario `location-presets-004` in `src/ui/locationControls.test.mjs` clicks the Taiwan pill, checks that the handler got the id `taiwan`, and checks the range, the pitch, the heading and the target of the flight. The mutation `004-click-id` (the pill passes `austin`) fails it.
- [x] Round 1 spec-adversary F2 (minor): not a defect (`REVIEW-MISSING` is the reason for the review).
- [x] Round 1 ste-adversary F1 and F2 (major): corrected. The design says that the gate reports that no QA script covers this change, and the requirement of scenario `location-presets-005` says "answer a search for the city name or id".
- [x] Round 1 ste-adversary F3 (minor): corrected in the design.
- [x] Round 2 spec-adversary F1 (major): the ratchet command wrote two history lines and a lower count of branches for `src/data/labelArbiter.js`, which this change does not edit. At the request of the adversary, the lead put the entry and the history of that file back to the content of `main`, by an edit of two text files with no measurement. The values are those of `main`, so no gap is hidden. The proposal says so in its Impact.
- [x] Round 2 ste-adversary F1 and F2 (minor): corrected in the proposal after the round.
- [x] Round 3 (narrow confirmation, both agents): PASS with no finding.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `9979384`, and round 3 since `bd15c48`. All agents ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenarios `location-presets-001` to `location-presets-005` are new. The gate shows 439 scenarios verified with 0 open.
- [x] Constraints: no existing test is edited or renamed (the diff of every test file has only added lines). The change adds no request method for an OpenSensorHub server, no network call and no name or ID of a server of the owner.

## Decisions and deviations

- [x] Owner request: the owner asked on 2026-09-26 for a TAIWAN pill at the left of AUSTIN in the location bar. The first point of the preset is an island view (range 700000 m), so that the pill gives the view that a typed "Taiwan" gives. The owner can judge this in a browser (known limit `taiwan-default-view`). The POI coordinates are approximate camera frames.
- [x] Ratchet run: after the round-1 corrections, the lead put the four files of `openspec/trace/` back to their content on `origin/main` and ran the ratchet command again, so that the history has one run. After round 2, the lead edited two of these files by hand for `src/data/labelArbiter.js` (see the finding of round 2).
- [x] The archive folder has the date 2026-09-27 (UTC), and the record of round 1 was written before the date changed.

## Evidence

- [x] The gates run before this file (`make gates CHANGE=add-taiwan-location`, after the archive of round 3) showed `Trace: 439 scenarios, 439 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run format:check`, `npm run check:boundaries` and `npm run doctor`. The lead did not run `npm run build` and `npm test`; the gates run all 6270 tests.

## Coverage of the changed code files

- [x] `src/locations.js` keeps its ledger entry (288 lines, 45 branches, 16 functions not covered, one branch fewer than before), and the 55 new lines are covered. `src/ui/locationControls.js` has one function fewer not covered (7, 8 before).

## Mutation report

The worker ran the mutations of the code with the host runner (Node 26), and the runner restored each file after each run. The list is in `review/mutations/muts.json`, and the results are in `review/mutations/muts.json.log`. A mutation that no test fails is a finding.

- [x] 6 runs: 6 KILLED, and no survivor. The mutations are: `location-presets-001` (move `taiwan` after `austin`), `002` (change the data), `003` (change the pill name), `004` (change the first range), `005` (change the preset name) and `004-click-id`.
