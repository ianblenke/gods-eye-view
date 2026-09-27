# Review: backfill-perimeters

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-27
Gates: make gates CHANGE=backfill-perimeters passed
Rounds: 3
Scope: diff 7da79647e5730c5e5b23a1690f61ee6e6e0e4b08
Reviewed-Tree: 8868dc20538f85060e56920a189fd6ddffcfd2b25efb24acbed8f63453ca5184

## Findings

- [x] Round 1 spec-adversary F1 (critical): the test `[perimeters-017] a property can mark a page limit` gave an empty page, so it passed even if the proxy ignored the transfer-limit property. Corrected: the test gives one feature and asserts one page when the property is `false` and five pages when it is `true` (the real direction, confirmed against `server/providers/firePerimeters.js:82`). Scenario `perimeters-017` is narrowed to what its own tests prove; the caching claims moved to scenarios `perimeters-020` and `perimeters-021`, which already state and test them.
- [x] Round 1 spec-adversary F2 (critical): scenario `perimeters-018` claimed a numeric page, its cache and an unsafe redirect, but its own tests check only the index route. Narrowed to the index case; the other claims are covered by `perimeters-024`, `perimeters-025` and `perimeters-027`.
- [x] Round 1 spec-adversary F3 (critical): the test `[perimeters-019] a reply on a closed client has no body` set `reply.destroyed = true` as input and asserted the same field, proving nothing. Corrected: the fake reply tracks `writeHead`/`end` calls with flags, and the test asserts both stay `false`.
- [x] Round 1 spec-adversary F4 (major): REJECTED. The finding said that prepending a scenario tag to an old test's existing name is a forbidden rename. `AGENTS.md` rule 3 and `openspec/config.yaml` require every traced test's name to start with its scenario tag, and this is the same mechanism the merged changes `backfill-cyclones` and `backfill-live-sources` already used and their reviewers accepted. The lead compared every old test name in the six affected files, before and after tagging, and found zero wording changes beyond the tag (16 + 9 + 9 + 15 + 7 + 5 names). Round 2 read the whole diff and gave PASS with no finding, confirming this rejection.
- [x] Round 1 spec-adversary F5 and F6 (minor): F5 was not a defect (`REVIEW-MISSING` is the reason for the review). F6 was the same tagging question as F4; the wording findings the STE adversary gave for old test names are the accepted STE warnings, not errors.
- [x] Round 1 ste-adversary F1 to F4 (minor): corrected in `specs/perimeters/spec.md` ("the page age check", "after the layer stops or ends") and in two new test names ("a busy status", "a POST request gets a method error").
- [x] Round 2 spec-adversary: PASS with no finding.
- [x] Round 2 ste-adversary F1 (major) and F2 (minor): the known limit about `src/data/labelArbiter.js` did not name which count changes and used a phrasal verb. Corrected: "The branch count for this file changes between runs. The lead set the entry and the history of that file to the values in `main`, as a text edit with no measurement."
- [x] Round 3 (narrow confirmation, both agents): PASS with no finding.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `c5549fb`, and round 3 since `7da7964`. All agents ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenarios `perimeters-001` to `perimeters-027` are new. The gate shows 472 scenarios verified with 0 open.
- [x] Constraints: `src/layers/perimeters/*.js` and `server/providers/firePerimeters.js` are unchanged (`git diff --numstat origin/main` gives no lines for either). No existing test's wording changed beyond its added tag. The change adds no request method for an OpenSensorHub server and no network call; the new provider tests use a fake `fetchImpl`.

## Decisions and deviations

- [x] A discovery mid-change: `server/providers/firePerimeters.js` already had a test file, `src/data/firePerimetersProxy.test.mjs` (17 untraced test runs), which an earlier phase missed. That phase had written a separate new file and pulled the old file's tests in with a cross-file `import` for its side effect, which broke the gate's per-file test tracking. The lead had the old file's 17 tests tagged directly (`perimeters-020` to `perimeters-027`) and removed the bad import.
- [x] Lead process error: the lead dispatched the round-1 correction worker before saving the round-1 review record into the change folder. The record was reconstructed from the saved reviewer output files and added in a later commit, before any further round ran on the change.
- [x] Ratchet noise: the ratchet command wrote two history lines for `src/data/labelArbiter.js` in one of the three rounds, for a file this change does not edit. The lead set the entry and the history of that file to the values in `main`, by a text edit with no measurement (known limit in the proposal).
- [x] Two unreachable branches stay in the ledger for `src/layers/perimeters/index.js` (lines 137 and 369: an early return when selection is not possible, and the end of a try/catch whose paths all return). A known limit in the proposal also asks the owner to decide whether a polygon-only change to an incident should redraw its entity; the code currently keeps the old geometry in that case.

## Evidence

- [x] The gates run before this file (`make gates CHANGE=backfill-perimeters`, after the archive of round 3) showed `Trace: 472 scenarios, 472 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run format:check`, `npm run check:boundaries` and `npm run doctor`. The lead did not run `npm run build` and `npm test`; the gates run all 6319 tests.

## Coverage of the changed code files

- [x] `cards.js`, `inciweb.js`, `records.js`, `source.js` and `server/providers/firePerimeters.js`: complete. The files have no ledger entry, and the gate shows no gap.
- [x] `index.js`: lines and functions complete, and 2 branches not covered (the ledger entry).

## Mutation report

The workers ran the mutations of the code with the host runner (Node 26), and the runner restored each file after each run. The list is in `review/mutations/muts.json`, and the results are in `review/mutations/muts.json.log`. A mutation that no test fails is a finding.

- [x] The 27 scenarios each have at least one mutation of the production code that a tagged test kills; the round-1 corrections added mutations `perimeters-017`, `perimeters-017-property`, `perimeters-018` and `perimeters-019-closed` for the fixed tests. No survivor remained at the end of round 1.
