# Review: backfill-live-sources

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-27
Gates: make gates CHANGE=backfill-live-sources passed
Rounds: 4
Scope: diff b613bee67e2d977b149470c18d1fd13383a4180b
Reviewed-Tree: 0d32d12401e9d3d8ddb8b4c9f9103db529ff564be3f642061b2e2c434dac31d1

## Findings

- [x] Round 1 spec-adversary F1 (critical): the scenario also covered a signal that aborts during the fetch, which can throw a different error at a different line. Corrected: the requirement and the scenario now say "no external abort signal aborts the request", and the test uses a live `AbortController` signal, asserting it stays unaborted before and after the call.
- [x] Round 1 spec-adversary F2 to F4 (minor): corrected in the proposal and the design. F4 was not a defect (`REVIEW-MISSING` is the reason for the review).
- [x] Round 1 ste-adversary F1 (major): corrected in the requirement wording.
- [x] Round 1 ste-adversary F2 to F4 (minor): corrected in the design and the tasks.
- [x] Round 2 spec-adversary F1 (critical): the phrase "with no external abort signal" read as "no signal option is given", but the test gives a live signal. Corrected: the requirement and the scenario now say "No external abort signal aborts the request", which is exactly what the test proves.
- [x] Round 2 ste-adversary F1 (major): the same wording problem, corrected with the wording that the adversary itself suggested.
- [x] Round 3 spec-adversary F1 (minor): the requirement's first sentence had no MUST, and `openspec/config.yaml` reads only the first sentence as the requirement. Corrected: the requirement is now one sentence with MUST first.
- [x] Round 3 ste-adversary: PASS with no finding.
- [x] Round 4 (narrow confirmation, both agents): PASS with no finding.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `34a3b33`, round 3 since `b62ef5e`, and round 4 since `b613bee`. All agents ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenario `live-sources-001` is new. The gate shows 445 scenarios verified with 0 open.
- [x] Constraints: `src/sources/live/contract.js` is unchanged (confirmed by `git diff --numstat origin/main`: 0 lines added or removed). No existing test is edited or renamed. The change adds no request method for an OpenSensorHub server and no network call.

## Decisions and deviations

- [x] Purpose: the coverage count of `src/sources/live/contract.js` (a file with no ledger entry, measured at full coverage) twice made an unrelated push fail CI with `LEDGER-NEW-COVERAGE-GAP`, because one branch (the transport `AbortError` re-throw in `readResponse()`) had no test. This change adds that one test. It does not fully explain or fix the underlying coverage-merge behavior; the known limit `live-sources-lcov-merge` says so.
- [x] Ratchet noise: the ratchet command wrote two history lines for `src/data/labelArbiter.js` in three of the four rounds, for a file this change does not edit. The lead put the entry and the history of that file back to the content of `main` each time, by a text edit with no measurement (known limit `live-sources-ratchet-noise`).
- [x] Lead error and correction: an `openspec archive` command piped through `tail` masked one failed attempt (the active change still held the old delta spec, so the archive command's own conflict check failed silently). The lead found the resulting duplicate folder before running any review round on it, moved the stray review record into the correct folder, and reran the archive command checking its exit code directly. No round was reviewed on the duplicated state.

## Evidence

- [x] The gates run before this file (`make gates CHANGE=backfill-live-sources`, after the archive of round 4) showed `Trace: 445 scenarios, 445 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run format:check`, `npm run check:boundaries` and `npm run doctor`. The lead did not run `npm run build` and `npm test`; the gates run all 6276 tests.

## Coverage of the changed code files

- [x] The change edits no code file. `src/sources/live/contract.js` has no ledger entry, and the gate shows no gap.

## Mutation report

The worker ran the mutation with the host runner (Node 26), and the runner restored the file after the run. The list is in `review/mutations/muts.json`, and the result is in `review/mutations/muts.json.log`.

- [x] `live-sources-001-abort-arm` (replace the abort check with `if (false) throw error;`): KILLED, both before and after the test was strengthened with the live `AbortController` signal.
