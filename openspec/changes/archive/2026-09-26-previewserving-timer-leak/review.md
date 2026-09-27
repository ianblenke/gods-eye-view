# Review: previewserving-timer-leak

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-26
Gates: make gates CHANGE=previewserving-timer-leak passed
Rounds: 1
Scope: full
Reviewed-Tree: c3265844f2410331f7cb2c46b0eaa4ff47ab93547f8f24b35443ea419277bf62

## Findings

- [x] Round 1 spec-adversary F1 (minor): the cause of the `Timeout` in the CI run is not proved, because the CI record has no stack, the local hook found a Vite timer and an `Immediate`, and the unchanged test did not leak on this host. The lead named this limit `timer-owner` in the proposal, after the round.
- [x] Round 1 spec-adversary F2 (minor): not a defect. The error `REVIEW-MISSING` is the reason for the review.
- [x] Round 1 ste-adversary F1 to F3 (minor): corrected in `design.md` after the round, with no new round. The verb "closes" replaces the noun "close", and "temporary" replaces "scratch".
- [x] Scope: round 1 read the whole change. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-1/` without change.
- [x] Constraints: the change edits one test file (`src/tooling/previewServing.test.mjs`) and adds two lines. No test is renamed and no assertion changes. It edits no production file, adds no request method for an OpenSensorHub server and adds no network call.

## Decisions and deviations

- [x] Proof: the leak appeared in 2 of 3 CI runs of `Spec gates` on `main` (commit `ba9555a`), and it did not appear in 130 guarded runs of the unchanged test on the host (30 plain and 100 under CPU load). The proof of the fix is the mechanism (a Vite timer of 50 ms that stays armed after `server.close()`, and the wait of 60 ms that follows it) and a temporary test in which the guard found an `Immediate` in 5 of 5 runs without the wait and in 0 of 5 runs with it. The lead will check the next CI runs after the merge.
- [x] The temporary scripts of the research (`repro.mjs`, `timer-hook.mjs`) are code files, so the lead kept them out of the repository. They are in `/home/ianblenke/docker/gev-tools/leakfix/` of the lead.
- [x] The change has no spec delta, and it needs no mutation of the code: it changes only a test file. The known limits of the proposal name the Node version and the load of the CI runner.

## Evidence

- [x] The gates run before this file (`make gates CHANGE=previewserving-timer-leak`, after the archive) showed `Trace: 434 scenarios, 434 verified, 0 open`, `Ledger: 0 entries do not match the current gaps` and `STE: 0 errors`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran `node scripts/format.mjs --check` on the tree: 1106 files checked, no file to format.

## Coverage of the changed code files

- [x] The change edits no code file, and it opens and closes no gap.
