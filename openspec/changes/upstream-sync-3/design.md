## Context

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
Upstream commit: `95fa816232456a6831172befa2f1b34b9ee73794`.
Merge commit: `debfde0982ad21e3359340162dbca25d592c392f`.

The merge commit has the base commit as its first parent. The upstream commit is its second parent.
The command `git ls-remote upstream main` returned the upstream commit on 2026-10-08.
The local ref `upstream/main` has the same value. The lead must record this check in `review.md`.

## Conflict resolutions

The command `git merge-tree` with options `--write-tree --name-only` compares `origin/main` with `upstream/main`. It reports the 16 files below.
The actual merge reports the same list. Git rerere is enabled.

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
| `server/providers/places/google.js` | Keep upstream admission checks and default limits. Add the geocode route and shared coordinate module. |
| `server/standalone/vite.config.js` | Keep upstream voice tools and MCP routes. Export the complete plugin list for the credential test. |
| `src/app/constructCatalog.js` | Keep upstream Street Level code. Add the OSH layer after Recent Imagery. |
| `src/data/layerState.test.mjs` | Keep upstream tests. Keep the OSH test. Use 30 rows and free digit 4. |
| `src/data/layerStateTokenLedger.test.mjs` | Keep upstream tests. Use 30 rows and free digits 4 and 5. Count 71 characters in the width fixture. |
| `src/locations.test.mjs` | Keep upstream tests and add the Taiwan tests. |
| `src/tooling/viteBuild.test.mjs` | Keep upstream tests. Keep the credential test tags and assert the AIS prefix on the config itself. |
| `src/voice/gevRealtime.test.mjs` | Keep upstream tests. Remove the obsolete browser key input. Keep the two timer cleanup blocks after the upstream probe found two live deadlines. |

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
Each covers line uses `unmapped:` with a reason. The register test counts 88 QA files.

| File | Purpose | Covers reason |
|---|---|---|
| `scripts/qa-browserEvidence.mjs` | Save browser errors with secret values removed. | Browser evidence has no capability spec. |
| `scripts/qa-panelDrag.mjs` | Move QA panels and check each header press. | Panel test helpers have no capability spec. |
| `scripts/qa-panel-resize.mjs` | Check CCTV panel size and position after each move. | Panel resize has no capability spec. |
| `scripts/qa-street-level.mjs` | Check Street Level tiles and images with browser fixtures. | Street Level has no capability spec. |
| `scripts/qa-voice-bench.mjs` | Compare voice tool choices across providers with the same phrases. | Voice provider comparison has no capability spec. |

## Expected adopt volume

The strategy report estimates 330 to 350 file entries, 5000 to 12000 uncovered lines and about 800 untraced tests.
These are estimates from the report, not measured results. The lead must use the image to measure the actual gaps.

The diff from shared base `e7707d9a0f34d9fbffc300023c319f95caa5be30` to upstream changes 435 files.
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

## Known limits

The lead must run adopt, ratchet, gates and the lock check in the image.
The lead must get both review results and write `review.md`. This host work creates no review file.
The two allocation tests need calibrated Node 24. The runner stops before that phase if the ordinary tests fail.

No browser QA script runs in this task. Timing failures in pristine upstream stay unchanged.

## Timer check

At upstream commit `95fa816232456a6831172befa2f1b34b9ee73794`, the two render tests leave two 400 ms deadline timers.
A host probe checks the pending deadlines at the end of the tests. Its assertion fails with `2 !== 0`.

Keep the existing cleanup blocks in `src/voice/gevRealtime.test.mjs`. Each block clears its deadline timer in `finally`.
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

The delta carries the complete Browser bundle inputs requirement. Only scenario `credential-boundary-003` changes.
Keep the requirement text and the other scenarios equal to the base spec.
List the Google browser key, Cesium ion token and public Mapillary token in that order.

Both list tests use literal names. The build helper must leave each omitted input undefined.
Remove the empty-string default for the Mapillary define. Keep the server Google key checks and the literal scan unchanged.

The fixture credential scan does not supply the new Mapillary token to the build helper.
It does not prove the classification of that public token.

## Pristine baseline result

Tree: `95fa816232456a6831172befa2f1b34b9ee73794`. Host runtime: Node `v26.8.2`.
The command `npm test` completed with exit 1. It ran 6184 tests: 6182 passed, one failed and one was skipped.

The failed test is `src/data/analystEngine.test.mjs`, line 632, the ranking test for 250000 rows.
Its assertion reports 864 ms. The suite duration is about 869 seconds under host load.
The allocation phase did not run after the test failure. This result is the upstream baseline.

The token width fixture serializes the added OSH digit and its separator. Its literal length changes from 69 to 71.
The first merged subset run found the old length assertion. This is a merge defect, and the test now expects 71.

## Mutation results

The host checks read code commit `1e208673978cffe1c6413a3f42316d7ce93479ab` with the stated mutation.
The ledger mutation also uses the width correction from code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`.
Each check restores the source files after the mutation.

| Mutation | Failed test |
|---|---|
| Remove the covers tag from qa-browserEvidence. | `[qa-scripts-023]` |
| Change the environment prefix to VITE_. | `[credential-boundary-003]` |
| Change the OSH token and reservation to 4. | `[osh-033]` |
| Remove the OSH registration and reservation. | The ledger row count and width fixture tests. |
| Use upstream render tests without cleanup. | The timer probe reports two pending deadlines. |

The timer probe with the cleanup passes. It reports zero pending render deadlines.
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
The API key stays on the server. The browser receives an expiring secret for WebRTC.

## Voice manifest correction

At code commit `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`, the upstream voice manifest test finds the missing layer `osh-systems`.
OSH has no voice tools. Add its ID to `VOICE_OFF_LAYERS` in `src/voice/layerManifest.js`.
The entry keeps the current OSH behavior. It adds no voice alias or tool.
The existing upstream test must fail if the entry is removed.

## Full merged host result

Tree: `81da1e1f6ac0a0a65ca2983240cb182f1a19841b`. The command `npm test` completed with exit 1.
The output reports 8670 tests: 8664 passed, five failed and one was skipped.
The suite duration is about 1500 seconds. The allocation phase did not run after the failure.

| Failed test | Cause | Next action |
|---|---|---|
| Catalog construction | The old assertion expects 30 layers. | Expect 31. |
| Ranking 250000 rows | The assertion reports 561 ms. The pristine run also fails. | Keep the upstream test. |
| `[credential-boundary-003]` in googleServerKey | The old spec needs two public defines. Upstream has three. | Keep the check and record the spec conflict. |
| `[credential-boundary-006]` | The Gemini script credential has no documentation. | Add its name to the environment example. |
| Voice manifest | OSH has no manifest entry. | Mark OSH explicitly voice-off. |

The full run precedes these last corrections. Report the affected-file results separately from the full-run counts.

## Final affected-file checks

Code tree: `f00556ebeb386396aa784cf10dd17d411bf5ee7a`.
The catalog, key registry, voice manifest and bundle files pass all 37 tests after the last corrections.
The final format check reports `Checked 1327 source files.` The earlier boundary check passes, including the three OSH groups.
The last correction adds no import or export. The token helper reports `sync-check: 4`.

The separate Google-key file has six tests: five pass and `[credential-boundary-003]` fails.
The test keeps the old two-key requirement. No spec delta or weaker assertion resolves that conflict in this task.
The full merged suite does not run again after these last corrections. Its counts above belong to the earlier code tree.

The pristine ranking test also fails in an isolated host process. Its assertion reports 546 ms.
This evidence does not prove that only load causes the failure. Keep the upstream test and its 400 ms limit.
The host checks do not give an image gate verdict.

## Last mutation checks

Tree: `f00556ebeb386396aa784cf10dd17d411bf5ee7a` with each stated mutation.
Remove the OSH voice-off entry: the existing voice manifest test fails and names `osh-systems`.
Remove the OSH catalog call: the existing catalog count test fails.
Remove the Gemini environment example line: `[credential-boundary-006]` fails and names `GEMINI_API_KEY`.

The source files are restored. The search shows the OSH entry, the catalog count 31 and the Gemini line.
The command `git diff --exit-code` confirms that no code correction remains outside its commit.

## Handoff

The final code commit is `f00556ebeb386396aa784cf10dd17d411bf5ee7a`. The change documents have their own commit.
The host task runs no project adopt, ratchet, full gate or image lock check. The lead must run them in the image.

The lead must resolve the old two-key spec conflict before those checks can accept the Mapillary code.
The owner request for no spec delta remains in force. This task keeps the failed check and reports its cause.
