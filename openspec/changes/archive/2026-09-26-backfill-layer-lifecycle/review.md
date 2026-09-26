# Review: backfill-layer-lifecycle

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-26
Gates: make gates CHANGE=backfill-layer-lifecycle passed
Rounds: 2
Scope: diff ba4175d6dea12165c065f5c3a0b105136ac20e51
Reviewed-Tree: cd9a77a50120ff5f23f81f8046aa56d3860176817578ee57d8c5d299d7baa4da

## Findings

- [x] Round 1 spec-adversary F1 (critical): the test of `layer-lifecycle-002` compared only the value of the event, and the scenario says that the next listener gets the same event. Corrected: the first listener keeps the event that it got, and the test checks with `assert.equal` that the next listener got that same object. The new mutation `002-copy` (pass a copy of the event to each listener) fails the test.
- [x] Round 1 spec-adversary F2 and F3 (minor): F2 is corrected in the proposal. F3 is not a defect (`REVIEW-MISSING` is the reason for the review).
- [x] Round 1 ste-adversary F1 and F2 (minor): corrected. The proposal says "is stable between runs", and the two tests of `layer-lifecycle-001` say "when the destroy function returns false" and "when the destroy function throws".
- [x] Round 2 spec-adversary F1 (minor): the ratchet command wrote the count 52 for the branches of `src/data/labelArbiter.js` (50 on `main`) and two history lines. This change does not edit that file, and the count changes between runs (known limit `branch-record-change`). The lead did not edit the ledger by hand. The proposal names the two lines in its Impact.
- [x] Round 2 ste-adversary F1 (minor): corrected in the proposal after the round, with no new round.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the round-1 commit `ba4175d`. Both agents of both rounds ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenarios `layer-lifecycle-001` and `layer-lifecycle-002` are new. The gate shows 434 scenarios verified with 0 open.
- [x] Constraints: the change edits no production file (`git diff --name-only origin/main` lists only files of `openspec/` and `src/data/manager.test.mjs`). It adds no request method for an OpenSensorHub server, no network call and no name or ID of a server of the owner. No existing test is renamed or edited: the diff of `manager.test.mjs` has only added lines.

## Decisions and deviations

- [x] Purpose of the change: the count of uncovered lines of `src/data/lifecycle.js` changed between 177 and 186 from run to run, and the tolerance of the gate is 8. The research is in `review/research/report-1.md`. The two new tests always cover the two catch blocks that other tests reached only sometimes.
- [x] Ratchet run: after the round-1 corrections, the lead put the four files of `openspec/trace/` back to their content on `origin/main` and ran the ratchet command again, so that the history has one run (4 lines). The four files are output of the command, with no hand edit. The ratchet closes 2 branches of `lifecycle.js` in the ledger (102 on `main`, 100 now), because the entry on `main` came from a noisy run.
- [x] A flaky test that is not part of this change: one gates run stopped with `GATES-TEST-LEAK` for `src/voice/gevActions.test.mjs` (a live timer of type `Immediate`). The next gates run did not show it. The lead ran the gates again, and did not change the test.
- [x] Proof of stability: the design has a table of 40 runs (20 plain and 20 under CPU load) on host Node 26: both catch blocks are covered in 40 of 40 runs after the change. The gates use Node 24, and the runs use 14 test files (known limits `host-node-proof` and `selected-test-set`).

## Evidence

- [x] The last gates run before this file (`make gates CHANGE=backfill-layer-lifecycle`, after the archive of round 2) showed `Trace: 434 scenarios, 434 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run format:check`, `npm run check:boundaries` and `npm run doctor`, and the three new tests of `manager.test.mjs` outside the gates. The lead did not run `npm run build` and `npm test`; the change edits only a test file, and the gates run all 6264 tests.

## Coverage of the changed code files

- [x] The change edits no code file. `src/data/lifecycle.js` keeps its ledger entry with 177 lines, 100 branches and 15 functions not covered, and both catch blocks are now always covered.

## Mutation report

The worker ran the mutations of the code with the host runner (Node 26), and the runner restored the file after each run. The list is in `review/mutations/muts.json`, and the results are in `review/mutations/muts.json.log`. A mutation that no test fails is a finding.

- [x] 12 results: 11 KILLED and 1 SKIP. The skip is the first try of `002-copy`, whose anchor text occurred three times. The lead made the anchor unique and ran the mutation again: KILLED. The latest result of each of the 10 different mutations is KILLED.
- [x] The mutations for scenario `layer-lifecycle-001` are `001-false-result`, `001-return-value`, `001-keep-layer`, `001-reset-destroying`, `001-reset-intent`, `001-settle-state` and `001-status-event`. The mutations for scenario `layer-lifecycle-002` are `002-catch`, `002-warning` and `002-copy`.
