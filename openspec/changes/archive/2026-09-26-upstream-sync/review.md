# Review: upstream-sync

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-25
Gates: make gates CHANGE=upstream-sync stops only for four files with counts that change between runs, see Evidence
Rounds: 4
Scope: diff 9e28f75f99bdc4f7eeb4df29a086a61ca9cc9b9d
Reviewed-Tree: 68e1eef7fdda647828e5315ba910d7b8a559112938eadfdc69ab40fe612b3c90

## Findings

- [x] Round 1 spec-adversary F1 to F4 (major): corrected or named. The test of the own cache of the fork does not apply to the cache of the upstream project, and the known limit `sync-dropped-reverse-cache-test` says so (F1). The hand resolution had dropped the upstream test of the ALPR layer, and the lead restored it (F2). The scenario `osh-096` and its test check the production source and the hosts, and mutations O1 and O2 fail it (F3). The scans of `[osh-034]` and `[osh-005]` name the new files, and mutations Y1 and Y2 fail them (F4).
- [x] Round 1 spec-adversary F5 to F12 (minor): corrected or named as the known limits `sync-test-names`, `sync-ceiling-not-measured`, `sync-share-token`, `sync-third-geocoder-call` and `sync-more-branches-in-unchanged-files`. F7 and F8 are corrected in `docs/CURRENT-STATE.md`, the comment of `src/ui/templates/context.html` and the Impact. The lead checked each finding against the tree (`review/round-1/skeptics.md`).
- [x] Round 1 ste-adversary S1 to S4 (major): corrected in the proposal and the design (one name for the person, the conditions of `adopt`, the rule of the remembered answer with a Google status). Two moved tests of `credential-boundary-014` had names that said the opposite of their assertion. The lead renamed them, see "Decisions of the owner" below.
- [x] Round 1 ste-adversary S5 to S30 (minor): corrected in the documents, the specs and the names of new tests. S26 is the known limit `sync-test-names`.
- [x] Round 2 spec-adversary F1 (major): the three files with adopt lines that the lead edited after the merge are named in the known limit `sync-files-edited-after-the-merge`. The lead read the uncovered items in the coverage report: they are upstream code. The code of this change in these files is covered.
- [x] Round 2 spec-adversary F2 to F7 (minor): corrected or named as the known limits `sync-counts-change-between-runs`, `sync-hand-written-adopt-lines` and `sync-osh-005-file-list`. The test of `osh-096` builds the layer through `createApplicationCatalog`, and mutation C4 fails it.
- [x] Round 2 ste-adversary S1 and S2 (major): corrected with F1, and in the scenario `credential-boundary-014` and D3 of the design (the conditions of the remembered answer).
- [x] Round 2 ste-adversary S3 to S25 (minor): corrected in the proposal, the design, the tasks and the specs. Mutation P5 (the tag `aside` of the panel) fails the test of `osh-094`.
- [x] Round 3 spec-adversary F1 (major): no test asserted the rounding of the coordinate. A new test of `credential-boundary-014` asserts it, and mutations R7 (six decimal places) and R8 (two decimal places) fail it.
- [x] Round 3 spec-adversary F2 to F6 (minor): corrected, or named as the known limit `sync-remembered-statuses`.
- [x] Round 3 ste-adversary S1 (major): the known limit `sync-dropped-reverse-cache-test` and D3 say that the code of the cache is still in `src/voice/gevActions.js` and that no test checks it.
- [x] Round 3 ste-adversary S2 to S15 (minor): corrected in the proposal, the design, the tasks and the specs (the roles, the words "request" and "call", the WHEN of `osh-096`, the new test name of `osh-096`).
- [x] Round 4 spec-adversary F1, F3 and F4 (minor): corrected in the proposal and in task 4.6. The Impact says 9 files, and names the three files with counts that change between runs. Task 4.6 names four files.
- [x] Round 4 spec-adversary F2 (minor): corrected. The rounding test now asserts that a coordinate with the same latitude and another longitude fetches again. Mutation R9 (a key from the latitude only) fails it.
- [x] Round 4 ste-adversary S1 to S11 and S14 (minor): corrected in the proposal, the design and the tasks after the round, with no new round (`review/round-4/skeptics.md`).
- [x] Round 4 ste-adversary S12 (minor): the line of `credential-boundary-014` about the rounding says "decimals" and not "decimal places". A change needs a change of the scenario text, so a new ratchet and a new round. Kept. Accepted by Ian Blenke on 2026-09-25.
- [x] Round 4 ste-adversary S13 (minor): the name of the new rounding test says "the same four decimals". A change needs a change of the test name and of `links.json`, so a new ratchet and a new round. Kept. Accepted by Ian Blenke on 2026-09-25.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `fee3a79`, round 3 since `f89ecdd` and round 4 since `9e28f75`. Round 4 was a narrow confirmation round after the major findings of round 3. The limit of three rounds is exceeded by this one round, for that reason. The lead corrected the minor findings of round 4 after the round with no new round. The corrections changed the documents and added one assertion to a test, and changed no scenario text and no test name.
- [x] Trace: the ratchet passed after each correction. The scenarios `osh-095` and `osh-096` are new. The scenarios `osh-033`, `osh-094`, `credential-boundary-013`, `credential-boundary-014` and `credential-boundary-015` have changed text. The gate shows 379 scenarios verified with 0 open.
- [x] Constraints: the change adds no request method for an OpenSensorHub server, no network call from a test and no name or ID of the owner's server. The scans of `[osh-005]` and `[osh-034]` name the new files. The change runs `adopt` once, for the merged commit of the upstream project.

## Decisions of the owner

- [x] Test renames: the lead renamed two moved tests of `credential-boundary-014`, and both names exist on `origin/main`. "a fetch failure gives no place" is now "a fetch failure makes the reverse lookup reject". "a response that is not JSON gives no place" is now "an answer that is not JSON makes the reverse lookup reject". The old names said the opposite of the assertion. Ian Blenke decided on 2026-09-25 that both renames stay.
- [x] Push to `main`: Ian Blenke agreed on 2026-09-25 to merge the change into the main branch of the fork and to push it, and to check all jobs of the CI run.
- [x] Rule 21 of `AGENTS.md`: the lead ran `git ls-remote upstream main` on 2026-09-25. The upstream remote (`https://github.com/bilawalsidhu/gods-eye-view`) has the merged commit `b210ab0fe4d71c7faa0268134e0aa5f3c53fc7fe` as the head of `main`, and `git merge-base --is-ancestor` finds it in `upstream/main`.
- [x] `sync-remembered-statuses`: the owner has not decided if the provider must not remember an answer with a status such as `REQUEST_DENIED`. The provider keeps the behavior of the upstream project, and only the status `ZERO_RESULTS` has a test. The known limit stays open for a later change. The clause `!place &&` in `src/search/http.js` has no test of its own. No test asks twice for a coordinate after an answer with a place. If the clause is removed, the provider remembers that answer, and the second call gives no place.

## Evidence

- [x] The last gates run before this file (`make gates CHANGE=upstream-sync`, after the archive of round 4) showed `Trace: 379 scenarios, 379 verified, 0 open`, `STE: 0 errors` and `Ledger: 1 entries do not match the current gaps`. It had three errors: `LEDGER-LARGER-GAP` for `server/providers/vessels/ais-store.js` (44 lines measured, 40 in the ledger), `LEDGER-STALE` for `src/data/lifecycle.js`, and `REVIEW-MISSING`.
- [x] Errors of the second kind of task 4.6: the counts of `ais-store.js`, `lifecycle.js`, `labelArbiter.js` and `wind/rendering.js` change between runs (`sync-counts-change-between-runs`). The ratchet run writes the count that it measured, and a later run of the gates can measure another count. The gates of the push to `main` use the tolerance for a file with the content of the base. The lead ran the checks of the CI job outside `make gates` on the final tree, in the Docker image of the change. `npm run doctor`, `npm run format:check` (1106 files), `npm run check:boundaries` and `npm run build` passed. `npm test` ran 6125 tests: 6124 passed, 1 was skipped and none failed.
- [x] The lead wrote two adopt lines by hand (lines 1424 and 1425 of `openspec/trace/history.jsonl`, for `ais-store.js` and `lifecycle.js`), and set the entry of `lifecycle.js` in `openspec/trace/gaps.json` by hand before each ratchet run that measured 184 lines. The counts in the Impact are the counts of the 797 lines that the command wrote (`sync-hand-written-adopt-lines`).
- [x] The final `make gates CHANGE=upstream-sync` run after this file (`Trace: 379 scenarios, 379 verified, 0 open`, `STE: 0 errors`) has two errors, and no review error. `LEDGER-LARGER-GAP` names `server/providers/vessels/ais-store.js` (44 lines measured, 40 in the ledger). `LEDGER-STALE` names two entries. The lead compared the coverage of the run with the ledger: `src/data/labelArbiter.js` has 50 branches not covered, and the ledger has 52. `src/layers/wind/rendering.js` has 334 branches in total, and the ledger has 333. The four files of task 4.6 are the only files with an error. The next run can measure other counts for them.

## Coverage of the changed code files

- [x] `src/app/layers/osh.js` and `src/layers/osh/hosts.js`: complete. The files have no ledger entry, and the gate shows no gap.
- [x] `src/app/constructCatalog.js` (3 lines, 4 branches, 1 function), `src/search/defaults.js` (2 branches) and `src/search/http.js` (4 branches, 2 functions): the ledger records gaps, and the lead read them. They are upstream code. The code of this change in these files is covered (`sync-files-edited-after-the-merge`).
- [x] `build/vite.js`, `src/data/layerState.js` and `src/standalone/application.js`: the ledger keeps the gaps of the base, and this change adds no gap. `src/ui/hud.js` and `src/layers/worldOverlay.js` have no ledger entry.

## Mutation report

Each mutation ran in the working tree of the clone with the named test file, and the runner restored the file after each run. The lead ran the whole battery again on the final tree. A mutation that no test fails is a finding. No mutation survived.

- [x] `osh-033`: T1 (the token `4` for the OSH layer in `src/data/layerState.js`) fails `[osh-033] registers the OSH systems layer with the token o, and localLayers.js exports it`.
- [x] `osh-094`: P1 (change the id `osh-panel`), P2 (remove the attribute `hidden`), P3 (change the id `osh-panel-video`) and P5 (the tag `aside`) fail `[osh-094] index.html has one element osh-panel, hidden at the start, and one video host`. P4 (the selector of the rule `.osh-panel[hidden]`) fails `[osh-094] the stylesheet gives the panel with the attribute hidden the display none`.
- [x] `osh-095`: C1 (remove `createApplicationOsh()` from the catalog), C2 (move it before `createApplicationRecentImagery()`) and C3 (build the layer two times) fail `[osh-095] builds the OSH systems layer in the application catalog right after the recent-imagery layer`. C1 and C3 also fail `[osh-096]`.
- [x] `osh-096`: O1 (no hosts in `src/app/layers/osh.js`), O2 (another source) and C4 (the catalog builds the layer with no hosts) fail `[osh-096] builds the OSH systems layer in the catalog with the production source and the hosts of the page`.
- [x] `credential-boundary-014`: R1 (a key in the request URL) fails `reverseGeocode fetches the server route, with no key`. R2 and R5 (do not remember `configured:false`) fail `the reverse lookup remembers a configured:false answer for the life of the page`. R10 (remove the check of the HTTP status, so an HTTP 500 answer with a Google status is remembered) fails `a later call fetches again after an HTTP 500 answer with a Google status`. R3 (remember each answer that gives no place, with or without a Google status) fails the tests of the HTTP 200 answers with a null status and with no status field. R4 (remove the check `noPlace.has(key)`) and R6 (remove the line that remembers the coordinate) fail `a later call makes no fetch after an HTTP 200 ZERO_RESULTS answer`. R7 (six decimal places), R8 (two decimal places) and R9 (a key from the latitude only) fail the rounding test.
- [x] `osh-034`: Y1 (an address that looks real in `src/layers/osh/hosts.js`) fails `[osh-034] the provider, adapter and layer files have no real address`.
- [x] `osh-005`: Y2 (the text of a request method that is not GET in `src/sources/httpBody.js`) fails `[osh-005] only osh/get.js calls fetch; no other scanned file calls it, names POST, PUT, PATCH or DELETE`.
