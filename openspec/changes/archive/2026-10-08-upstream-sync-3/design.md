## Context

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
Upstream commit: `95fa816232456a6831172befa2f1b34b9ee73794`.
Merge commit: `debfde0982ad21e3359340162dbca25d592c392f`.

The merge commit has the base commit as its first parent. The upstream commit is its second parent.
The command `git ls-remote upstream main` returned the upstream commit on 2026-10-08.
The local ref `upstream/main` has the same value. The lead must record this check in `review.md`.

## Conflict resolutions

The command `git merge-tree` with options `--write-tree --name-only` compares `origin/main` with `upstream/main`. It reports the 16 files below.
The actual merge reports the same list. Git uses rerere.

| File | Resolution |
|---|---|
| `.env.example` | Keep upstream settings and add the fork credential and OSH notes. |
| `.github/workflows/ci.yml` | Keep upstream jobs and add the spec-gates job. |
| `SECURITY.md` | Keep upstream routes and Mapillary notes. Keep the fork geocode and environment prefix notes. |
| `build/vite.js` | Keep upstream CSP and preview headers. Add the AIS environment prefix. |
| `package-lock.json` | Take upstream content. Run npm install --package-lock-only for the OpenSpec dependency. |
| `package.json` | Keep upstream dependencies and exports. Add the spec scripts and OSH exports. |
| `scripts/package-boundaries.json` | Keep upstream groups. Add the fork OSH and geocode entries. |
| `server/providers/local.js` | Keep upstream providers and voice tools. Add the OSH routes. |
| `server/providers/places/google.js` | Keep upstream admission checks and default rate limits. Add the geocode route and shared coordinate module. |
| `server/standalone/vite.config.js` | Keep upstream voice tools and MCP routes. Export the complete plugin list for the credential test. |
| `src/app/constructCatalog.js` | Keep upstream Street Level code. Add the OSH layer after Recent Imagery. |
| `src/data/layerState.test.mjs` | Keep upstream tests. Keep the OSH test. Use 30 rows and free digit 4. |
| `src/data/layerStateTokenLedger.test.mjs` | Keep upstream tests. Use 30 rows and free digits 4 and 5. Expect 71 characters in the width fixture. |
| `src/locations.test.mjs` | Keep upstream tests and add the Taiwan tests. |
| `src/tooling/viteBuild.test.mjs` | Keep upstream tests. Keep the credential test tags and assert the AIS prefix on the config itself. |
| `src/voice/gevRealtime.test.mjs` | Keep upstream tests. Remove the obsolete browser key input. Keep the two timer cleanup blocks after the unchanged upstream check found two leaked timers. |

## Fork additions without conflicts

The merge keeps OSH token `3` in `src/data/layerState.js` and `src/data/layerStateTokenReservations.json`.
Upstream uses token `0` for Street Level. The next free digit is `4`.
The token tests keep the upstream allocation order and account for the OSH reservation.

The merge keeps the Taiwan preset in `src/locations.js` and the OSH style entry in `scripts/format-scope.json`.
The merge keeps the server geocode requests in `src/search/defaults.js` and `src/search/http.js`.
The merge keeps the other credential tests and OSH modules. No OSH code goes upstream.

## QA headers

The current upstream tree adds five QA files without headers. The earlier estimate of 13 does not match this tree.
Each new header has `@purpose`, `@covers`, `@run` and `@needs`.
Each covers line names a future capability with the `pending:` prefix. The register test counts 88 QA files.

| File | Purpose | Covers |
|---|---|---|
| `scripts/qa-browserEvidence.mjs` | Save browser evidence of a failed run, with secret values removed. | `pending:application-shell` |
| `scripts/qa-panelDrag.mjs` | Move app panels and check each header press. | `pending:application-shell` |
| `scripts/qa-panel-resize.mjs` | Check CCTV panel size and position after each resize. | `pending:application-shell` |
| `scripts/qa-street-level.mjs` | Check Street Level tiles and images with browser fixtures. | `pending:street-level` |
| `scripts/qa-voice-bench.mjs` | Compare voice tool choices across providers with the same phrases. | `pending:voice` |

## Measured adopt volume

The image adopt run records 338 entries. The trace ledger records the measured gaps.

The diff from shared ancestor `e7707d9a0f34d9fbffc300023c319f95caa5be30` to upstream changes 435 files.
It has 249 JavaScript code candidates outside QA files and 129 test file candidates.
Not all 378 candidates have gaps. These counts do not include reached files or prove adopt eligibility.
Use the upstream commit as FROM. Do not use the merge commit as FROM.

## Host checks

Both dependency installs use `npm ci`. The lock file uses the upstream content and `npm install --package-lock-only`.
All Node and npm processes use `taskset -c 0-3` and `nice -n 19`.
The pristine worktree reads the upstream commit. Both trees use `npm test` with default process isolation.
The tests under `src/tooling/spec/` each have their own process.

The host format check and boundary check use the package scripts.
The host lint uses `node scripts/spec/gates.mjs lint` with options `--change upstream-sync-3`.
The host results do not give a coverage or gate verdict for the image.

## Known limits and later changes

The lead must run adopt, ratchet, gates and the lock check in the image.
The lead must get both review results and write `review.md`. This host work creates no review file.
The two allocation tests need calibrated Node 24. The runner stops before that phase if the ordinary tests fail.

No browser QA script runs in this task. Pass 4 raises the ranking ceiling to 4000 ms.

## Timer check

At upstream commit `95fa816232456a6831172befa2f1b34b9ee73794`, the two render tests leave two 400 ms deadline timers.
A host probe checks the leaked timers at the end of the tests. Its assertion fails with `2 !== 0`.

Keep the current cleanup blocks in `src/voice/gevRealtime.test.mjs`. Each block clears its deadline timer in `finally`.
The production timer code stays equal to upstream. The lead must check the image timer result.

## Upstream settings

The upstream tree adds `mapillary-js` with version range `^4.1.2`. The package version changes to `0.2.1`.
The upstream tree adds the public browser credential `MAPILLARY_CLIENT_TOKEN`. The fork adds no new credential.
The upstream tree adds `OPENAI_REALTIME_TRANSCRIBE_MODEL`, `GEV_VOICE_LOG_CONTENT` and `GEV_ALLOWED_HOSTS` to the environment example.
It also adds `GEV_EMBED_FRAME_ANCESTORS` and four `CCTV_VEGVESEN_` settings.

The upstream example changes the AIS browser route to `/api/vessels`.
The Google default limit is 120 requests per minute. The OpenAI default limit is 30.
A value of zero removes each limit. The server geocode route shares the Google limit.

Upstream adds standalone MCP and voice tool routes. The fork keeps those routes and the OSH routes.

## Pristine baseline result

Tree: `95fa816232456a6831172befa2f1b34b9ee73794`. Host runtime: Node `v26.8.2`.
The command `npm test` completed with exit 1. It ran 6184 tests: 6182 passed, one test failsed and one was skipped.

The failed test is `src/data/analystEngine.test.mjs`, line 632, the ranking test for 250000 rows.
Its assertion reports 864 ms. The suite duration is about 869 seconds under host load.
The allocation phase did not run after the test failure. This result is the upstream baseline.

The token width fixture serializes the added OSH digit and its separator. Its literal length changes from 69 to 71.
The first merged subset run found the old length assertion. This is a merge defect, and the test now expects 71.

## Fault results

The host checks read code commit `1e208673978cffe1c6413a3f42316d7ce93479ab` with the stated fault.
The ledger fault also uses the width correction from code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`.
Each check restores the source files after the fault.

| Fault | Failed test |
|---|---|
| Remove the covers tag from qa-browserEvidence. | `[qa-scripts-023]` |
| Change the environment prefix to VITE_. | `[credential-boundary-003]` |
| Change the OSH token and reservation to 4. | `[osh-033]` |
| Remove the OSH registration and reservation. | The ledger row count and width fixture tests. |
| Use upstream render tests without cleanup. | The timer probe reports two leaked timers. |

The timer probe with the cleanup passes. It reports zero leaked render timers.
The fixed ledger file passes all eight tests. The full merged suite uses code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`.

## Catalog count correction

Both canonical main and upstream expect 30 layers in `src/app/constructCatalog.test.mjs`.
Git accepts that equal line without a conflict. The merged catalog has 31 layers, including OSH and Street Level.
At code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`, the isolated test confirms `31 !== 30`.
The corrected assertion must expect the literal 31. The full suite continues on the earlier code commit.

## Credential inventory correction

At code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`, `[credential-boundary-006]` finds the undocumented name `GEMINI_API_KEY`.
The upstream helper `scripts/voice-bench/keys.mjs` reads this name for the optional Gemini voice comparison.
Add the name to `.env.example` as an optional script credential. Keep the inventory assertion unchanged.

The conflict resolution must also keep the fork note about the OpenAI client secret in `SECURITY.md`.
The API key stays on the server. The browser receives an short-lived secret for WebRTC.

## Voice manifest correction

At code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`, the upstream voice manifest test finds the absent layer `osh-systems`.
OSH has no voice tools. Add its ID to `VOICE_OFF_LAYERS` in `src/voice/layerManifest.js`.
The entry keeps the current OSH behavior. It adds no voice alias or tool.
The current upstream test must fail if a fault removes the entry.

## Full merged host result

Tree: `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`. The command `npm test` completed with exit 1.
The output reports 8670 tests: 8664 passed, five failed and one was skipped.
The suite duration is about 1500 seconds. The allocation phase did not run after the failure.

| Failed test | Cause | Next action |
|---|---|---|
| Catalog construction | The old assertion expects 30 layers. | Expect 31. |
| Ranking 250000 rows | The assertion reports 561 ms. The pristine run also fails. | Pass 4 sets a 4000 ms ceiling. |
| `[credential-boundary-003]` in googleServerKey | The old spec needs two public defines. Upstream has three. | Pass 3 resolves the spec conflict. |
| `[credential-boundary-006]` | The Gemini script credential has no documentation. | Add its name to the environment example. |
| Voice manifest | OSH has no manifest entry. | Add OSH to the voice-off list. |

The full run precedes these last corrections. Report the affected-file results separately from the full-run counts.

## Final affected-file checks

Code tree: `f00556ebeb386396aa784cf10dd17d411bf5ee7a`.
The catalog, key registry, voice manifest and bundle files pass all 37 tests after the last corrections.
The final format check reports `Checked 1327 source files.` The earlier boundary check passes, including the three OSH groups.
The last correction adds no import or export. The token helper reports `sync-check: 4`.

The separate Google-key file has six tests: five pass and `[credential-boundary-003]` fails.
The test keeps the old two-key requirement. Pass 3 supersedes this result and resolves the conflict with the complete spec delta.
The full merged suite does not run again after these last corrections. Its counts above belong to the earlier code tree.

The pristine ranking test also fails in an isolated host process. Its assertion reports 546 ms.
This evidence does not prove that only load causes the failure. Pass 4 supersedes this limit with a 4000 ms ceiling.
The host checks do not give an image gate verdict.

## Last fault checks

Tree: `f00556ebeb386396aa784cf10dd17d411bf5ee7a` with each stated fault.
Remove the OSH voice-off entry: the current voice manifest test fails and names `osh-systems`.
Remove the OSH catalog call: the current catalog count test fails.
Remove the Gemini environment example line: `[credential-boundary-006]` fails and names `GEMINI_API_KEY`.

Each fault check restores its source files. The search shows the OSH entry, the catalog count 31 and the Gemini line.
The command `git diff --exit-code` confirms that no code correction remains outside its commit.

## Work for the lead

The final code commit is `f00556ebeb386396aa784cf10dd17d411bf5ee7a`. The change documents have their own commit.
The host task runs no project adopt, ratchet, full gate or image lock check. The lead must run them in the image.

Pass 3 replaces the earlier two-key requirement. The owner authorizes the complete delta and all five test changes.

## Pass 2 host result

Code and spec commit: `bba5fc6adc0bae823022b404e06a839511d35fa2`. Host runtime: Node `v26.8.2`.

The two test files pass all 12 tests. The full host suite completes with exit 1.
It reports 8670 tests: 8668 pass, one test fails and one is skipped.
The only failure is the unchanged upstream test for 250000 rows. It reports 1018 ms against the time budget.

The pristine baseline has the same failed test. The allocation phase does not run after this failure.

Format passes for 1327 source files. The boundary checks pass.
The token check against `origin/main` reports 29 published tokens and one new token.
The first restricted checks stop at child process access. The restricted suite stops before the end and has no final verdict.
The complete host suite runs once after that stop.

Remove the Mapillary define: both list tests fail for `credential-boundary-003`.
Change the name order: both list tests fail for `credential-boundary-003`.
Add the server Google define: both list tests fail for `credential-boundary-003`.
Restore the empty-string default: the build-input test fails for `credential-boundary-003`.
Each fault restores `build/vite.js`. The source diff after the faults is empty.

The prose lint reports one error and 563 warnings.
It rejects `expose` in the required unchanged sentence of the new delta file.
Pass 3 corrects this sentence and changes the tests for all five scenario hashes. The word list stays unchanged.

## Pass 3 decision

Source commit: `07bf094e8df16abfe6e8b1847d2c1157b7e9ecf0`.
The third credential supports the Mapillary viewer and direct Graph API requests.
SECURITY.md states that the client token is public. The server provider uses the same token for tiles.
The browser helper receives it through `mapillaryToken`. The standalone config reads `MAPILLARY_CLIENT_TOKEN` from the environment.

The requirement now names three credentials. All five carried scenarios need changed tests with their scenario tags.
The fixture tests check the Mapillary sentinel. The literal scan checks the upstream shape `MLY|1|abc` and a synthetic sample.
The config tests check clear values and reject environment defaults. Secret credentials remain on the server.

## Purpose text for archive

Keep each secret credential on the server. Put only the three public credentials and the AIS live settings in the browser bundle.
Send geocoding requests from the browser only to our server, with no API key.

## Pass 3 checks

Change `src/tooling/bundleCredentials.test.mjs`, `src/googleServerKey.test.mjs` and `src/tooling/viteBuild.test.mjs`.
Run each file in one host process. Run the full unit suite once and compare it with the pristine baseline.
Run host lint, format, boundary and layer token checks. Prove each changed test with a fault and restore each file.
The lead must run the image checks and the two review agents before merge.

## Pass 3 host result

Spec and test commit: `7f424c6081bf26845aa8c985e8920749296d0ab9`. Source commit: `07bf094e8df16abfe6e8b1847d2c1157b7e9ecf0`.
The three separate test processes pass all 18 tests. Each changed test fails with a stated fault.

Remove Mapillary: tests for `001`, `002`, `003` and `016` fail. Add the server define: `001`, `003` and `016` fail.
Remove the Mapillary pattern or add a token literal to main.js: `004` fails.
Add a Mapillary environment default: the second helper test for `003` fails. Each fault check restores its files.

The full host suite runs once and completes with exit 1. It reports 8670 tests, 8668 pass, one test fails and one test is skipped.
Only the unchanged upstream row test fails. Its assertion reports 1379 ms; the whole test takes about 2039 ms.

The pristine baseline has 6184 tests, 6182 pass, one test fails and one test is skipped. It has the same failed test.
The row test file has no diff from upstream commit `95fa816232456a6831172befa2f1b34b9ee73794`.
The allocation phase does not run after the failure. These host results give no image coverage verdict.

Lint reports zero errors and 565 warnings. Format passes for 1327 source files. Boundary checks pass.
The token check against origin/main reports 29 published tokens and one new token.
Host logs are in `gev-tools/upstream-sync-3/pass-3-host/`. The lead still must complete the image checks and both reviews.

## Pass 4 plan

Source tree: `7adfc97a7cea727249269c75070bcfdeac24dea4`.
The adopt log reports seven test files with leaked timers and one test failsed row test.
The host probe uses the gate preload, inventory hash and environment variables. Each file runs in a separate process.
The probe uses `--test-force-exit` to check timers at test completion.

Clear test timers through cleanup hooks or a finally block. Stop controller resources after each test.
Use mock timers for private deadlines when the test cannot clear them through an owner.
Keep all assertions.

Add a scheduler margin to the row budget. Test the original CPU budget before the final clock choice.
Keep the page yield and cancellation assertions.

Run the probe before and after each correction. Check every test file that differs from the base.
Run the changed tests, format checks, boundary checks and the full unit suite. Compare failures with the pristine baseline.
The lead must run the image checks and both reviews before merge.

The first CPU check fails at 771 milliseconds on the host. Process CPU time includes runtime work across threads.
Use a wall clock ceiling of 4000 milliseconds instead. The ceiling allows 3600 milliseconds more than the original ceiling.
The test still checks the row count, top row, page yield and cancellation. The limit `ranking-ceiling-not-measured` records the unmeasured slowdown below 10 times the old ceiling.

## Pass 4 test corrections

Source tree: `7adfc97a7cea727249269c75070bcfdeac24dea4`, with host test corrections.
No production file changes. The tests keep all assertions. No timer uses `unref()`.

| File | Live resource | Correction | Send upstream? |
|---|---|---|---|
| `src/layers/streetLevel/index.test.mjs` | A 16 ms idle callback after layer enable. | Save timer handles. Clear them in `t.after` and restore the timer function. | yes |
| `src/locations.test.mjs` | A 600 ms ground guard callback after flight completion. | Save timer handles. Clear them in `t.after` and restore the timer function. | yes |
| `src/ui/panelDock.test.mjs` | Two click suppression callbacks after pointer release. | Use test mock timers for the two drag tests. Node restores the clock after each test. | yes |
| `src/ui/streetLevelControls.test.mjs` | An animation frame callback from destroy. | Let the DOM fixture own its timer handles. Clear them before the fixture restores globals. | yes |
| `src/voice/gevRealtime.test.mjs` | 56 metric deadlines and 10 narration deadlines. | Register metric flush and narration cancel hooks for each controller fixture. | yes |
| `src/voice/pointerCrop.test.mjs` | A 400 ms render deadline after a successful frame. | Save timer handles. Clear them in finally and restore the timer function. | yes |
| `src/voice/realtimeNarration.test.mjs` | One narration deadline and one metric deadline. | Register metric flush and narration cancel hooks in the controller fixture. | yes |
| `src/data/analystEngine.test.mjs` | No timer leak. The wall clock ceiling fails under load. | Use a 4000 ms ceiling. Clear the page interval in `t.after` if the query fails. | yes |
| `src/tools/mcpPanelKey.test.mjs` | No timer leak. Two tests start child processes that race for one key file. Each run takes other branches. The branch count of `server/mcp/panelKey.js` changed between image runs. | Remove `NODE_V8_COVERAGE` from the environment of those children. Ten image runs then give the same coverage records. | yes |

The first fixture correction tries full UI removal. The fake UI has no remove method, so this correction fails.
The final hooks call the two timer owners directly. The host probe confirms that both owners release their timers.

### Pass 5 coverage race

The first ratchet stopped with `LEDGER-LOST-COVERAGE` for `server/mcp/panelKey.js`.
The adopt run measured 5 uncovered and 28 covered branches. The ratchet run measured 6 and 26.

The cause is the child processes of `src/tools/mcpPanelKey.test.mjs`. They race for the key file.
The winner takes different branches in each run.

The row above removes their coverage records. The tests still check that all processes agree on one key.
The race branches stay uncovered, and the ledger records that gap.

The lead ran the five panel key test files ten times in the image before and after the correction.
The records of the child processes varied before it and are stable after it.
The lead then ran adopt again, because the first adopt recorded the old counts.

## Pass 4 normal tests and baseline

The initial probe reproduces all seven leaks on host Node 26.8.2. It reports counts of 1, 1, 2, 1, 66, 1 and 2.
The row test has no timer leak. Its first probe passes the original ceiling during this run.
The pristine baseline from pass 1 fails the same row test at 864 milliseconds. Its separate row test fails at 546 milliseconds.

Those baseline logs name upstream commit `95fa816232456a6831172befa2f1b34b9ee73794`.

The normal host run passes all 315 tests in the eight changed files. Format checks pass for 1327 source files.
Boundary checks pass for 967 modules and 76 portable entries. Prose lint reports zero errors.
The final results appear below.

## Pass 4 fault checks

Fault copies read tree `7adfc97a7cea727249269c75070bcfdeac24dea4`. They have no branch and stay outside this clone.
Restore each of the seven original test files in these copies. The timer guard reports a leak for each file.
The counts are 1, 1, 2, 1, 66, 1 and 2. The unit assertions still pass, but the guard rejects the live resources.

Set the corrected row ceiling to zero in a copy. The row test fails.
Its failed assertion reports 436 milliseconds.

The clone keeps the corrected files throughout these fault checks.

The first timer batch stops during one shell invocation after a script edit. This partial run gives no complete scan result.
Compare the result file list with the 132-file input list. Run all absent files before the final report.

## Pass 4 final timer result

Source tree: `7adfc97a7cea727249269c75070bcfdeac24dea4`, with the nine test corrections above.
The final probe uses the raw coverage environment, coverage options and two reporters from the main gate test run.
It uses the gate QA register to build the source inventory. All eight changed test processes pass with no leaks.

The final scan checks all 132 test files that differ from base `e2437f94`. No input file is absent or repeated.
Each file runs in its own process. Two batches use CPUs 0 through 3 with nice level 19.

All 132 processes pass. All guard records have no leaked timers or immediate callbacks.
The scan reports no more files outside the sandbox.

The first sandbox scan flags `src/tools/localRoute.test.mjs` with three timers after its test process fails.
A second sandbox probe with coverage flags reports three immediate callbacks and a failed process for that file.
The same file passes outside the sandbox with no leak. This task makes no correction to that file.
The first scan command exits 123 after the script edit. Its 132 file records do not give a passed command result.

The fault check with the complete coverage environment reproduces all seven original timer counts.
The row fault with a zero ceiling fails. The nine files keep the same assertion method counts as read tree `7adfc97a`.
Host logs and the fault copies are in `gev-tools/upstream-sync-3/pass-4-host/`.
The reproducible script is `gev-tools/upstream-sync-3/leakcheck.sh`.

## Pass 4 full host result

Source tree: `7adfc97a7cea727249269c75070bcfdeac24dea4`, with the nine test corrections above.
The full npm test command runs once and completes with exit zero.
It reports 8670 tests, 8669 passes, zero failures and one test is skipped. The row test passes.

The pass 1 pristine baseline reports 6184 tests, 6182 passes, one test failure and one test is skipped.
Its only failure is the row test. The corrected host run has no baseline failure left.

Host Node 26.8.2 skips two allocation test files because their budgets need Node 24.
This host run gives no image coverage verdict. The lead must run the Node 24 image checks and both review agents.
Format and boundary checks pass. The first sandbox attempts stop with a Git subprocess error, so only the complete host checks give these results.

Test correction commit: `588956a7dfaae7d5c3137fdb1cacf9197c8ce9c4`.
Prose lint reports zero errors and 572 warnings. The final document commit changes no test code.

## Round 1 decisions

Source tree: `1b9eaa0c8ce1eb4505e79e48006fa1d26789b52d`.
The geocode handler calls `admitSameSite` first. The shared install serves dev and preview.
The gate sends the same 403 body and no-store header as Google Places. It writes no log.

It checks Origin, Sec-Fetch-Site and proxy headers. The key resolver runs only after admission.

| File | Fork decision |
|---|---|
| `build/vite.js` | Omit upstream `?? ''` for the Mapillary define. Without a token the define is `undefined`. `layerSources.js` uses `|| ''`, so runtime behavior is equal. |

The QA voice bench command needs `--provider ollama --model <id>` to run a provider comparison.
The OSH registry scenario now expects 30 entries. The QA register scenario now expects 88 scripts.
The requirement sentences stay unchanged. Each delta keeps all scenarios of its requirement.

### Tests for the six variable gaps

| Code file | Test imports |
|---|---|
| `server/providers/mapillary/tiles.js` | `src/tooling/mapillaryProvider.test.mjs` imports this file. |
| `src/data/bhoteKoshiEmbeddedMedia.js` | `src/data/bhoteKoshiEmbeddedMedia.test.mjs`, `src/data/bhoteKoshiEvent.test.mjs` and `src/tooling/viteBuild.test.mjs` import this file. |
| `src/layers/flights/motion.js` and `src/layers/flights/rendering.js` | `src/layers/flights/ownership.test.mjs` imports index.js, which imports these files. `src/data/flights.test.mjs` reaches them through the app layer. |
| `src/layers/military/queries.js` and `src/layers/military/rendering.js` | `src/layers/military/ownership.test.mjs` imports index.js, which imports these files. `src/data/militaryFlights.test.mjs` reaches them through the app layer. |

The lead must run these files in the image and check the final gate and CI counts.
A return to larger gaps needs a ledger-refresh change. The production code stays equal to upstream.
The owner accepts the absent child coverage of both panel key race tests. Record this fact in `review.md`.

## Round 1 host result

Source code tree: `77b57e88aa1084f7851dd2838f0370370a14c0e8`. Host runtime: Node `26.8.2`.
The full host command `npm test` completes with exit zero.
It reports 8674 tests: 8673 pass, zero fail, and one test is skipped.
The two allocation probes need Node 24, so the host runner skips them.

The first restricted suite stops before the end after local server access errors. It has no final result.

The seven changed test files pass 148 tests in separate processes. All seven pass the timer guard with no leaks.
The final bundle, Google title and QA register edits also pass separate tests and guard checks.
The geocode report covers all 200 lines, 55 branches and seven functions.
Format checks pass for 1327 files. Boundary checks pass for 967 modules and 76 portable entries.

The final prose lint reports zero errors.

Remove the geocode gate: both `credential-boundary-017` tests fail.
Move the gate after fetch: both `credential-boundary-017` tests fail because the key read count is one.
Invert the gate check: both new scenarios fail in both installs.

The first inversion run stops before the end. The filtered scratch run completes with four failed tests.
Restore `unmapped:` in the panelDrag header in a scratch copy: `qa-scripts-023` fails.
Each scratch copy has no branch. The clone keeps the correct gate and QA headers.

The lead must run ratchet and final gates in the Node 24 image, and get both review results.
These corrections change no adopted upstream code file. Adopt needs no new run.
The lead must set the Purpose after archive and record the accepted panel key child coverage gap in `review.md`.
