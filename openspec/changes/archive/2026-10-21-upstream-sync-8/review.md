# Review: upstream-sync-8

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-21
Gates: make gates CHANGE=upstream-sync-8 passed
Rounds: 2
Scope: diff 08848f26
Reviewed-Tree: ee5507fde4ea11422b6ac4f4fd8426f334549d9cc57a3de31b70037a5ff9b442

## Rule 21 check

The merge commit `4089abfe` has the parents `21a12aef` (the plan commit) and `713285b554bbc99c8ae0261fe307beb3cbeb2adf`. On 2026-10-21, `git ls-remote upstream main` gave `713285b554bbc99c8ae0261fe307beb3cbeb2adf`, so the upstream remote has the second parent. `evidence/upstream-check.txt` gives the commands and their output. The adopt command used `--from 713285b554bbc99c8ae0261fe307beb3cbeb2adf`.

Resolved files: `.env.example`, `DATA_SOURCES.md`, `README.md`, `SECURITY.md`, `docs/CURRENT-STATE.md`, `package.json`, `scripts/qa-panel-resize.mjs`, `scripts/qa-panelDrag.mjs`, `scripts/qa-street-level.mjs`, `server/providers/cctv/constants.js`, `server/providers/cctv/sources.js`, `server/standalone/vite.config.js`, `src/i18n/locales/es.json`, `src/i18n/locales/ru.json`, `src/tooling/mapillaryProvider.test.mjs`, `src/ui/panelDock.test.mjs` and `src/layers/streetLevel/index.test.mjs`.

## Findings

Round 1 had the scope full, at the commit 08848f26. Both reviewers gave FAIL. The corrections changed a test file and `.env.example`, so the lead moved the change back from the archive (0a8d7214), restored `openspec/specs`, `openspec/trace/retired-ids.json` and `openspec/trace/links.json` from 72cfa59d, ran the host tests and the ratchet again, and archived the change again (68dbed1c). Round 2 had the scope diff 08848f26, at the commit 9a4cb5c4. Both reviewers gave PASS.

The reports of round 1 are in `review/round-1/`. Each reviewer sent a second message with more minor findings, on request of the lead, in the files `spec-adversary-more.md` and `ste-adversary-more.md`. The reports of round 2 are in `review/round-2/` and in `review/`. Each file holds the report word for word.

The first ratchet run stopped with `LEDGER-LOST-COVERAGE` for `src/layers/streetLevel/providers/panoramax/decode.js` (design D7). The second and the third ratchet runs gave only REVIEW-MISSING.

### Round 1 (commit 08848f26)

- [x] FINDING major (spec adversary) D2 called the upstream Ontario loader "the same function", but it does not keep two rules of the fork: one warning in each process, and the key text out of each warning. Fixed: D2 and the REMOVED Reason name the two rules, and the proposal has the Known limits `ontario-warnings` and `ontario-error-text`. The lead told the owner in chat.
- [x] FINDING major (spec adversary) The D7 assertion could not fail: three faults passed it. Fixed: the test uses two pass-through mock functions and asserts more than 20 calls of `setTimeout()` with 0 ms and of `performance.now()`. `evidence/fault-d7.txt` gives the three faults, and each fault fails the test.
- [x] FINDING major (spec adversary) The proposal said "one provider with docked panels" for Street Level. Fixed: the text follows `changelog.d/974-street-level-slim.md`.
- [x] FINDING major (STE adversary) The change name `fix-ontario-511` was wrong. Fixed: `fix-ontario-511-key` in the proposal and the design.
- [x] FINDING major (STE adversary) `evidence/leaks.txt` called the 87 files the files of the merge. Fixed in place: the sentence names the range of the branch at 4b35414c (85 files of the merge commit and two fork test files). The count and the file list did not change. A round 2 section gives the command for the number 85.
- [x] FINDING minor (spec adversary) No document named the FL511 decision of the owner. Fixed: Known limit `fl511`.
- [x] FINDING minor (spec adversary) `SECURITY.md` names no Gemini key and no Gemini route. Kept: the upstream file names neither (`evidence/resolutions.txt`). Known limit `security-gemini`.
- [x] FINDING minor (spec adversary) `.env.example` had two lines for `GEMINI_API_KEY` and for `ONTARIO_511_API_KEY`. Fixed in 098d2bd1: one line for each key.
- [x] FINDING minor (spec adversary) The documents used "tests" for the test files of D6. Fixed: "test files".
- [x] FINDING minor (spec adversary) No command supported the counts 268, 74 and 18 and the ownership sentence. Fixed: `evidence/merge-files.txt`.
- [x] FINDING minor (spec adversary) No task recorded the edits of `retired-ids.json` and `links.json`. Fixed: tasks 3.5 and 3.6, and one sentence in D2.
- [x] FINDING minor (spec adversary) No check showed that two files are the upstream files. Fixed: `evidence/resolutions.txt` section 1.
- [x] FINDING minor (spec adversary) `evidence/silent-files.txt` did not state its limits or its result. Fixed: a round 1 section of the file and the Known limit `silent-files`.
- [x] FINDING minor (spec adversary) D2 read as a general rule of the owner. Fixed: D2 names the sync 6 decision for the geocoding route.
- [x] FINDING minor (spec adversary) `.env.example` had two comments for the Launch Library 2 token. Fixed in 098d2bd1: only the upstream comment stays.
- [x] FINDING minor (spec adversary) `evidence/decode-coverage.txt` gave no test counts after the D7 edit. Fixed: a round 1 section with three counted runs.
- [x] FINDING minor (STE adversary) "test" had two meanings in the proposal. Fixed: "test files" for D6, and one sentence for each of D6 and D7.
- [x] FINDING minor (STE adversary) The spec delta and the design used two names for `ONTARIO_511_API_KEY`. Fixed: "key" in each place.
- [x] FINDING minor (STE adversary) D2 and the REMOVED Reason read as a general rule. Fixed with the finding of the spec adversary above.
- [x] FINDING minor (STE adversary) Verbs: "had added", "turn on", "to sync", "decode" as a noun, "turn" with two meanings, and "the assertion decodes". Fixed in the design, the tasks, the proposal and `evidence/street-level.txt`.
- [x] FINDING minor (STE adversary) "It" in D3 had no clear noun. Fixed: "Upstream also removes".
- [x] FINDING minor (STE adversary) "The change counts 97 scripts" gave the action to the change. Fixed: "The changed scenario counts".
- [x] FINDING minor (STE adversary) "opt-in" and "model-free" are not STE words. Fixed: the proposal names the setting `CCTV_FLORIDA_ENABLED` and the voice tool `get_current_view_state`.
- [x] FINDING minor (STE adversary) "provenance" is not an STE word. Fixed: the proposal says that the layer list shows cached data as stale.
- [x] FINDING minor (STE adversary) Three names for the CCTV packs. Fixed: "CCTV packs", defined one time in the proposal and in the design.
- [x] FINDING minor (STE adversary) "This" in the Known limit `osh-source` had no noun. Fixed in round 1 as "This gap", and in round 2 as "This limit".
- [x] FINDING minor (STE adversary) "the first edit" in D5 had two meanings. Fixed: "the wait of 20 ms of sync 6".
- [x] FINDING minor (STE adversary) "in one go" is an idiom. Fixed in the prose of D7. The upstream test title keeps it.
- [x] FINDING minor (STE adversary) "goes into" in D8 was a phrasal verb. Fixed: the sentence is removed, and the Context section gives the rule.
- [x] FINDING minor (STE adversary) "Files and measures" did not name `scripts/package-boundaries.json`. Fixed: the section names it and `.env.example`.
- [x] FINDING minor (STE adversary) The Purpose said "requirements" for one requirement. Fixed: "the requirement "Ontario row rules"", in the design and in `openspec/specs/live-sources/spec.md`.
- [x] FINDING minor (STE adversary) The AND line of `qa-scripts-023` had no article. Fixed: "the script qa-browserEvidence". The test of the scenario changed in 4b35414c, and the third ratchet passed.
- [x] FINDING minor (STE adversary) "Run" is not the verb for a fault. Fixed: "Test the fault" in tasks 1.5 and 1.17.
- [x] FINDING minor (STE adversary) "by the table" in task 1.3 was not clear. Fixed: "with the table".

### Round 2 (commit 9a4cb5c4)

Both reviewers gave PASS and closed each major finding of round 1. The lead corrected the minor findings in the archived documents and evidence, and recorded each minor finding of the spec adversary in the proposal.

- [x] FINDING minor (spec adversary) "sets `CCTV_FLORIDA_ENABLED`" had two meanings. Fixed: "to 1", in two places. Round 2 minor `fl511-value` in the proposal.
- [x] FINDING minor (spec adversary and STE adversary) "for the same reason" named no reason. Fixed: D2 and the REMOVED Reason now give the reason: upstream adds the same key in the same parameter. Round 2 minor `d2-reason`.
- [x] FINDING minor (spec adversary) No task named the two mock functions of D7 or the comment lines of `.env.example`. Fixed: tasks 1.16 and 1.18. Round 2 minor `d7-tasks`.
- [x] FINDING minor (spec adversary) No command supported the number 85 in `evidence/leaks.txt`. Fixed: a round 2 section of that file. Round 2 minor `leaks-count`.
- [x] FINDING minor (spec adversary) `evidence/fault-d7.txt` did not name the version of the test file. Fixed: a round 2 section gives the blob, which is the same in 03260b95 and on the branch head. Round 2 minor `fault-d7-blob`.
- [x] FINDING minor (STE adversary) "D6" in the host run 3 sentence of `evidence/host-run.txt`. Fixed: "after the round 1 corrections of D7 and .env.example".
- [x] FINDING minor (STE adversary) "gap" in the Known limit `osh-source`. Fixed: "This limit".
- [x] FINDING minor (STE adversary) "goes into the log" is a phrasal verb. Fixed: "the loader writes the key text to the log", in the design and the proposal.
- [x] FINDING minor (STE adversary) "For a missing key". Fixed: "When the server has no key".
- [x] FINDING minor (STE adversary) The further items of the report: "It asserts", the action of a scenario, "spies", "requests" and "download", "entries" and "links", and "each of these keys". Fixed: "The test asserts", "The fork code of the retired scenario", "mock functions", "downloads", "links" and "each of these keys, and the text of Launch Library 2".
