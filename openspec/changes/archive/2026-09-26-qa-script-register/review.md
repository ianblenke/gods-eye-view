# Review: qa-script-register

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-26
Gates: make gates CHANGE=qa-script-register passed
Rounds: 2
Scope: diff 4b9dee65d5301c1f0ee7244ad8e1c5ed2d149c09
Reviewed-Tree: 580dcb0c0578c921b2bab373c5f20653b40d1e6432b59be19229c8b3a9cfb327

## Findings

- [x] Round 1 spec-adversary F1 (minor): the advice reads each entry of the `specs` folder of a change as a capability name, and a file there gives a false name. The names of real deltas are folders. The lead named this limit `qa-advice-delta-files` in the proposal.
- [x] Round 1 spec-adversary F2 and F3 (minor): F2 is corrected with the findings of the STE adversary. F3 is not a defect (`REVIEW-MISSING` is the reason for the review).
- [x] Round 1 ste-adversary F1 (major): the name of the test of `qa-scripts-025` said that the gate omits headers, and the spec says that it omits scripts. Corrected: the test says "omits scripts with valid QA headers", and the list of the guard test `[coverage-gate-046]` has the new name.
- [x] Round 1 ste-adversary F2 to F6 (minor): corrected in the design, the tasks, the spec and the tests. Task 5.1 and task 5.2 have one instruction each. The header of `scripts/qa-draw-tool.mjs` and 62 `@needs` values are corrected. The title of scenario `qa-scripts-010` and the name of its test say "a pending area that has a capability folder".
- [x] Round 2 spec-adversary F1 (minor): the word "pending" ends in -ing, so the STE lint gives warnings for it. It is the name of a state of `@covers`. The lead named this limit `qa-pending-warning` in the proposal, with no new round.
- [x] Round 2 ste-adversary F1 and F2 (minor): corrected in `tasks.md` and in `review/round-1/skeptics.md`, with no new round.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the round-1 commit `4b9dee6`. Both agents of both rounds ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenarios `qa-scripts-001` to `qa-scripts-028` are new. The gate shows 432 scenarios verified with 0 open.
- [x] Constraints: the change adds no request method for an OpenSensorHub server, no network call and no name or ID of a server of the owner. No existing test is renamed. The 70 QA scripts have only inserted lines compared with `origin/main`, and the change runs no QA script.

## Decisions and deviations

- [x] Grammar change of the worker: in phase 2 the worker changed one regular expression of D1 in the design. The old expression allowed a comma inside an `unmapped:` reason, and scenario `qa-scripts-012` needs the comma as the separator of the list. Both agents read the corrected design.
- [x] An existing test changed: the list of guarded tests in the test `[coverage-gate-046]` of `src/tooling/spec/testGuard.test.mjs` has the four new guarded tests of `gates.test.mjs`. The name of that test is the same. The ratchet run failed on that test until the list had the four names.
- [x] Ratchet run: the ratchet command refuses a gap that is larger than its entry, and `src/data/lifecycle.js` measured 186 lines in one run (the entry allows 185). The lead ran the ratchet command again. After the round-1 corrections, the lead put the four files of `openspec/trace/` back to their content on `origin/main` and ran the ratchet command once more, so that the history has one clean run (76 lines). The four files are output of the command, with no hand edit.
- [x] Ledger lines for files that this change does not edit: `src/data/labelArbiter.js` and `src/data/lifecycle.js` (known limit `qa-ratchet-noise`). The file `scripts/spec/gates.mjs`, which this change edits, gets a new hash and new totals. Its one branch that no test can reach is the branch that the ledger already records for this file.
- [x] Coverage: the module `scripts/spec/lib/qa-register.mjs` and the file `scripts/spec/lib/inventory.mjs` have no ledger entry, so the gate shows no gap for them.

## Evidence

- [x] The last gates run before this file (`make gates CHANGE=qa-script-register`, after the archive of round 2) showed `Trace: 432 scenarios, 432 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run format:check`, `npm run check:boundaries` and `npm run doctor`. The lead also ran the test files `qaRegister.test.mjs`, `inventory.test.mjs` and `testGuard.test.mjs`, and the four tests of `gates.test.mjs` for `qa-scripts`, in the image outside the gates: all 74 pass. The lead did not run `npm run build` and `npm test`; the change edits no production file of the application, and the gates run all 6261 tests.
- [x] The register check runs on the real repository in the test `[qa-scripts-023]`: 70 valid headers and 0 errors.

## Mutation report

The worker ran the mutations of the code with the host runner (Node 26), and the runner restored each file after each run. The list is in `review/mutations/muts.json`, and the results are in `review/mutations/muts.json.log`. A mutation that no test fails is a finding.

- [x] 52 runs: 51 KILLED and 1 SURVIVED. The survivor `022-checks` showed a weak assertion. The worker corrected the test and ran the mutation again. The latest result of each of the 50 different mutations is KILLED.
- [x] The tasks name the mutations for each scenario `qa-scripts-001` to `qa-scripts-028`.
