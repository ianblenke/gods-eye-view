## Tree

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.

Code commit: `3fd163cfecba3e681e3f7923dd022a4c23d5b933`.

The mutation results refer to the base commit plus the code of this change.

The host Node version command was taskset -c 0-3 nice -n 19 node --version: `v26.8.2`.

No image command ran. No ledger or archive file changed.

## Public documentation

The commands use `curl -sS -A gods-eye-view-research`.

The sandbox DNS calls failed before a request. The host calls read these pages in order:

1. `https://511on.ca/robots.txt`
2. `https://511on.ca/developers/doc`
3. `https://511on.ca/help/endpoint/cameras`

The robots file excludes account paths and some map data paths.

The developer page names the query parameter `key` and ten calls per 60 seconds.

An account holder can request a key after login at the developer page.

The page links to `/my511/register` for new accounts. It gives no price or further eligibility rule.

The owner expects a free key. The public page does not confirm that price.

The endpoint example gives image IDs 815 and 816.

curl -sS -I -A gods-eye-view-research https://511on.ca/map/Cctv/815 returned HTTP 200 and `image/jpeg` without a key.

This HEAD request downloaded no image. Image content access: not checked.

The task used three GET requests and one HEAD request. No account or credential form opened.

## Fixture tests

Each test command uses taskset -c 0-3 nice -n 19 node --test --test-isolation=none with one file.

The command list and output are in `evidence/before.log` and `evidence/after.log`.

Before: 22 files, 248 tests, 245 passes, three failures.

After the first code group: 23 files, 254 tests, 251 passes, three failures.

All three failures come from sandbox EPERM on loopback listen calls in `cctvMediaRange.test.mjs`.

The host command for that file passed all 21 tests; `evidence/media-host.log` has the output.

At Pass 1, the final Ontario file has eight tests, all pass. At Pass 1, the CCTV total is 256 tests.

The host socket result accounts for all three sandbox failures.

The same command for `src/tooling/bundleCredentials.test.mjs` passed six tests.

The same command for `src/keySetupCore.test.mjs` passed 25 tests.

The bundle fixture reads the new name from `.env.example` and gives it a secret sentinel.

The inventory test includes the new server credential name.

The first Ontario test command failed all eight tests because the helper file did not exist.

The red output is in `evidence/red.log`.

## Coverage

Use the fixture command with `--experimental-test-coverage --test-coverage-include=<file>` for each code file separately.

`evidence/new-coverage-final.log` reports `ontarioRequest.js`: 100% lines, branches and functions.

`evidence/sources-coverage-final.log` reports `sources.js`: 29.07% lines, 43.28% branches and 29.03% functions.

That command tests the Ontario path only. Other pack paths remain outside this fixture.

The requested whole-file 100% result for `sources.js` is not complete.

The lead must assess its current gaps in the image. This task does not change other pack code to close those gaps.

The same coverage command for `src/data/cctvCalgary.test.mjs` gives these whole-file results:

| Tree | Lines | Branches | Functions |
|---|---:|---:|---:|
| Base commit | 51.91% | 47.59% | 69.23% |
| Base plus this change | 51.87% | 47.88% | 69.23% |

The logs are `evidence/sources-before.log` and `evidence/sources-after.log`.

## Named mutations

The command for each row is the Ontario fixture command above after the named source edit.

At Pass 1, each command returned status 1. The JSON files record the failed test names.

| Mutation | Failed test |
|---|---|
| Drop the key parameter | [live-sources-002] send the key parameter |
| Send a request without a key | [live-sources-003] stop without a key |
| Log the key | [live-sources-004] reject the invalid key once |
| Fetch before the absent-key return | [live-sources-003] stop without a key |
| Warn on each absent-key call | [live-sources-003] stop without a key |
| Warn on each error | [live-sources-004] reject the invalid key once and both error tests for 005 |
| Drop the helper call | [live-sources-002] map the Ontario rows |
| Log the camera data error | [live-sources-005] keep the camera data error secret |

The source files returned to their correct content after each mutation.

rg -n 'ONTARIO_511_API_KEY|Ontario 511 camera data error|readOntarioCameraRows' .env.example server/providers/cctv/{sources,ontarioRequest}.js confirms the key name, helper call and fixed text.

## Automatic mutations

The tool commands use taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs.

The generation command names both changed code files and produced 8006 candidates.

A filter selects the 117 helper candidates and 12 candidates on changed source lines 466, 536, 537 and 538.

The final campaign has 129 candidates. Each worker runs one test file per process.

The sandbox campaign stopped at its baseline with no test output. It gave no mutation verdict.

The first host campaign used an earlier test count. The final campaign uses a fresh baseline and the final tests.

The final phase-one command uses run with phase 1 and one job with `final-mutants.json` and the Ontario test file.

The full-test command uses run with phase 2, one job and resume with the same files.

The result files show 120 phase-one kills and nine survivors, then one more kill and eight survivors.

Both phases report zero crashes and zero timeouts. No candidate waits for a result.

The phase-two command serves as the probe for each EQUIVALENT claim below.

Each probe passes all eight fixture tests, with the same rows, request parameters, fixed error text and warning counts.

| IDs | Claim | Probe result and reason |
|---|---|---|
| a0030, a0031 | EQUIVALENT | The private absent-key flag changes from true to a truthy value. Only its truth value has a caller. |
| a0090, a0091 | EQUIVALENT | The private error flag changes from true to a truthy value. Only its truth value has a caller. |
| a0078 | EQUIVALENT | A ReferenceError takes the place of the private Error. The catch block ignores both and returns the same result. |
| a9012, a9013 | EQUIVALENT | The private Error message changes. The catch block reads no message and writes fixed text. |
| a9016 | EQUIVALENT | The log callback starts a nested async fetch. Its catch runs after the flag assignment, with the same one-warning result. |

The absent-key order mutation a9003 fails the callback probe because that path has no async fetch before its flag test.

The source restoration search confirms all code corrections after the probes.

The final Prettier command names only the helper and Ontario test file.

## Prose and OpenSpec

taskset -c 0-3 nice -n 19 node scripts/spec/gates.mjs lint --change fix-ontario-511-key reports zero errors.

At Pass 1, taskset -c 0-3 nice -n 19 openspec show fix-ontario-511-key --json prints JSON with one ADDED requirement.

taskset -c 0-3 nice -n 19 openspec validate fix-ontario-511-key reports that the change is valid.

The proposal section titles match the five required section titles in the nearby defect change.

The design, tasks and evidence use the same `## ` section title level as that change.

## Lead checks

The lead must run the ratchet and final gates in the Node image, then both reviews.

The host task does not archive the change or write `review.md`.

At Pass 1, the final lint command reports zero errors and 540 warnings.

## Pass 2

Read tree commit: `05736e8268541d4deea3e6bbd11e8a80bb9aa32a`.

The first lead log line has the Docker wrapper with the ratchet argument.
The next line is `Command: ratchet`. That run stopped before the comparison end.
It reports 141 uncovered branches against a ledger limit of 107. It gives no final comparison verdict.

The host tests add backfill scenarios `live-sources-006` to `live-sources-009`.
Production code has no change in this pass.

### Branch table

At Pass 2, each title below had its scenario tag in the test file. Pass 3 renamed these tests.
The table includes optional access, short circuit operands, guards and exception paths.
The shared guard at line 404 has the OR paths of its two operands.
The shared coordinate result at line 405 has the AND paths of its four operands.
The URL host name guard has the OR and AND paths of its listed operands.

| Line | Condition | True side test title | False side test title |
|---:|---|---|---|
| 404 | `!Number.isFinite(lat)` | reject row 3 | accept boundary 41 |
| 404 | `!Number.isFinite(lon)` | reject row 4 | accept boundary 41 |
| 405 | `lat >= 41` | accept boundary 41 | reject row 5 |
| 405 | `lat <= 57.5` | accept boundary 57.5 | reject row 6 |
| 405 | `lon >= -95.6` | accept boundary 41 | reject row 7 |
| 405 | `lon <= -74` | accept boundary 57.5 | reject row 8 |
| 416 | value || empty; parse try/catch | select the first view without down | reject URL 0 |
| 418 | `!match; return` | reject URL 3 | set all source fields |
| 421 | `protocol != https` | reject URL 4 | set all source fields |
| 422 | `host != 511on.ca` | select the first view without down | set all source fields |
| 422 | `!host.endsWith(.traveliq.co)` | reject URL 5 | select the first view without down |
| 427 | view ID fails ASCII rule; return | reject URL 7 | set all source fields |
| 429 | URL or decode throws; catch | reject URL 8 | set all source fields |
| 441 | `Array.isArray(views) ternary` | set all source fields | reject row 10 |
| 444 | `Status || status` | set all source fields | select the first view without down |
| 444 | `status || empty` | select the first view without down | reject row 12 |
| 446 | `status equals enabled` | set all source fields | reject row 13 |
| 449 | `Url || url` | set all source fields | select the first view without down |
| 450 | `Description || description` | select the first down view | select the first view without down |
| 450 | `description || empty` | select the first view without down | set all source fields |
| 452 | `view.url filter` | set all source fields | reject URL 2 |
| 453 | `!enabled.length; return` | reject row 11 | set all source fields |
| 455 | `description lacks down` | select the first view without down | select the first down view |
| 455 | `find result || enabled[0]` | select the first view without down | select the first down view |
| 467 | `!Array.isArray(rows); return` | reject data null | set all source fields |
| 470 | `row loop enters` | set all source fields | accept an empty row list |
| 471 | `Id ?? id` | set all source fields | use lower case fields and hash pose |
| 471 | `id ?? empty` | use lower case fields and hash pose | reject row 1 |
| 472 | `!rawId; continue` | reject row 2 | set all source fields |
| 473 | `Latitude ?? latitude` | set all source fields | use lower case fields and hash pose |
| 474 | `Longitude ?? longitude` | set all source fields | use lower case fields and hash pose |
| 475 | `!isLikelyOntarioCoordinate; continue` | reject row 3 | set all source fields |
| 477 | `Views || views` | set all source fields | use lower case fields and hash pose |
| 478 | `!view; continue` | reject row 11 | set all source fields |
| 481 | `Location || location` | set all source fields | use lower case fields and hash pose |
| 481 | `location || empty` | use lower case fields and hash pose | select the first down view |
| 482 | `Roadway || roadway` | set all source fields | use lower case fields and hash pose |
| 482 | `roadway || empty` | use lower case fields and hash pose | select the first down view |
| 484 | `view.description && no down` | select the first view without down | set all source fields |
| 484 | `no down ternary` | select the first view without down | select the first down view |
| 488 | `location || roadway` | set all source fields | use lower case fields and hash pose |
| 488 | `roadway || default name` | use lower case fields and hash pose | select the first down view |
| 493 | `Direction ?? direction` | set all source fields | use lower case fields and hash pose |
| 494 | `!finite heading` | use lower case fields and hash pose | set all source fields |
| 502 | `location || roadway` | set all source fields | use lower case fields and hash pose |
| 502 | `roadway || Ontario` | use lower case fields and hash pose | select the first down view |
| 526 | `env cap || default` | apply cap 3 | apply cap undefined |
| 528 | `finite cap ternary` | apply cap 3 | apply cap bad |
| 536 | `loader try/catch` | return no rows after a data error | set all source fields |
| 507 | `headingDeg hasHeading ternary` | set all source fields | use lower case fields and hash pose |
| 508 | `headingConfidence hasHeading ternary` | set all source fields | use lower case fields and hash pose |
| 509 | `pitchDeg hasHeading ternary` | set all source fields | use lower case fields and hash pose |
| 510 | `fovDeg hasHeading ternary` | set all source fields | use lower case fields and hash pose |
| 511 | `rangeM hasHeading ternary` | set all source fields | use lower case fields and hash pose |
| 512 | `mountHeightM hasHeading ternary` | set all source fields | use lower case fields and hash pose |
| 444 | `view?.Status` | select the first view without down | reject row 12 |
| 444 | `view?.status` | select the first view without down | reject row 12 |
| 449 | `view?.Url` | select the first view without down | No path: the status filter drops null views |
| 449 | `view?.url` | select the first view without down | No path: the status filter drops null views |
| 450 | `view?.Description` | select the first view without down | No path: the status filter drops null views |
| 450 | `view?.description` | select the first view without down | No path: the status filter drops null views |
| 471 | `row?.Id` | use lower case fields and hash pose | reject row 0 |
| 471 | `row?.id` | use lower case fields and hash pose | reject row 0 |
| 473 | `row?.Latitude` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 473 | `row?.latitude` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 474 | `row?.Longitude` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 474 | `row?.longitude` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 477 | `row?.Views` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 477 | `row?.views` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 481 | `row?.Location` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 481 | `row?.location` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 482 | `row?.Roadway` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 482 | `row?.roadway` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 493 | `row?.Direction` | use lower case fields and hash pose | No path: the ID guard drops null rows |
| 493 | `row?.direction` | use lower case fields and hash pose | No path: the ID guard drops null rows |

The table has 75 table lines. The lcov branch count differs because V8 reports source ranges.

Optional access to a null row after its ID guard has no public path.
Optional access to a null view after its status filter has no public path.
The guard and filter probes use null rows and null views. V8 reports no zero range for these paths.

### Host coverage

Command prefix: taskset -c 8-11 nice -n 19.
The coverage commands use node with --test and one test file.
The after command also uses --test-isolation=none.
Its flags include `--experimental-test-coverage`, `--test-coverage-include=server/providers/cctv/**` and `--test-reporter=lcov`.
The destination flag names `/tmp/ontario-before.lcov` or `/tmp/ontario-after.lcov`.

The before file tests `src/data/cctvOntarioKey.test.mjs` only.
The after file tests `src/data/cctvOntarioRows.test.mjs` only.
The final destination is `/tmp/ontario-after-complete.lcov`.

A Python filter selects sources.js BRDA lines from 403 to 541.
Before: 66 ranges, 38 zero counts. After: 87 ranges, zero zero counts.
Each of the four Ontario functions has a positive FNDA count in both files.
All nine functions in that line range, with the callbacks, have positive counts in the final file.

The final after counts are 7083, 7070, 7074 and 7092 for the coordinate, URL, view and loader functions.
No whole-file coverage claim applies to the other camera packs.

### Test suite

`/tmp/ontario-all-tests.log` records each command before its output.
Each command uses the host prefix and one file with node --test and --test-isolation=none.
The list includes all src/data/cctv files, src/layers/cctv files and src/tooling/mediaProviders.test.mjs.
The first command loop reports 25 files, 303 tests, 303 passes, zero failures and 25 zero exit codes.

The same loop with the next tests writes `/tmp/ontario-all-tests-final.log`.
It reports 25 files, 310 tests, 310 passes, zero failures and 25 zero exit codes.
In the second test loop of Pass 2, the Rows test file has 49 tests. The key file has eight tests.

### Named faults

The command `python3 /tmp/ontario-named-final.py` creates `/tmp/ontario-named-final` from the tree that the worker read plus the new tests.
It changes only the Ontario source range in that scratch tree.
Each test command uses the host prefix and one file with --test and --test-isolation=none.
The command saves the output in `/tmp/ontario-fault-N.log` and the results in `/tmp/ontario-named-results.json`.

The final run has 23 faults. Each fault returns exit code 1 with a failed tagged test.
The JSON result has each exact source change and its failed tests.

| Source fault | Failed test |
|---|---|
| !Number.isFinite(lat) | [live-sources-006] accept boundary 41 |
| !Number.isFinite(lon) | [live-sources-006] accept boundary 41 |
| lat >= 41.0 | [live-sources-006] reject row 5 |
| lat <= 57.5 | [live-sources-006] reject row 6 |
| lon >= -95.6 | [live-sources-006] reject row 7 |
| lon <= -74.0 | [live-sources-006] reject row 8 |
| view URL filter | [live-sources-006] reject URL 0 |
| empty view guard | [live-sources-006] accept boundary 41 |
| view predicate | [live-sources-006] select the first view without down |
| down fallback | [live-sources-006] select the first down view |
| URL path | [live-sources-006] reject URL 3 |
| HTTPS | [live-sources-006] reject URL 4 |
| URL host name | [live-sources-006] reject URL 5 |
| view ID | [live-sources-006] reject URL 7 |
| status | [live-sources-006] accept boundary 41 |
| view choice | [live-sources-006] select the first view without down |
| view array | [live-sources-006] accept boundary 41 |
| dedupe | [live-sources-008] use the last duplicate |
| sort | [live-sources-008] apply cap undefined |
| cap | [live-sources-008] apply cap 3 |
| row array | [live-sources-006] accept boundary 41 |
| non-array result | [live-sources-009] reject data null |
| source fields | [live-sources-007] set all source fields |

The first probe removed each finite guard. Both probes passed.
The later coordinate bounds still reject nonfinite values. These removal faults are EQUIVALENT for the public loader.

The final probes change each finite condition to true. Both fail the boundary test.

The first path probe removes the match guard. It passes because null match access throws into the catch.
That removal fault is EQUIVALENT. The final probe changes the path regex to other and fails the URL test.

### Host checks

The package command uses the host prefix with node scripts/check-package-boundaries.mjs.
It returns exit code 0. Its first output line states that it checked 1159 source files.

The host format command uses node with --import `/home/ianblenke/docker/gev-tools/director-4c/format-host.mjs` and `scripts/format.mjs --check`.
It returns exit code 0. The first direct sandbox attempt stops with `spawnSync git EPERM`.
The new test file uses the parent workspace Prettier binary with --write.

The lint command is node scripts/spec/gates.mjs lint --change fix-ontario-511-key with the host prefix.
`/tmp/ontario-lint7.log` reports zero errors and 543 warnings.

The OpenSpec commands use the host prefix with show fix-ontario-511-key --json and validate fix-ontario-511-key.
The show command prints JSON. The validate command states that the change is valid.
The section title search has the five required proposal section titles in the current file and the adjacent measurement change.

No container, make, ledger, archive, push or gh command ran in this pass.
The lead must run the image checks and the two reviews.

### Automatic faults

The full-file generator attempts stopped before a result. They give no mutation verdict.
The first run stopped in the copy step for the clone .codex path. It gives no mutation verdict.
The final run uses a scratch tree with no branch. Its production source comes from commit `05736e8268541d4deea3e6bbd11e8a80bb9aa32a`.

The command `node /tmp/ontario-gen.mjs` uses the automatic tool generate function on the four Ontario functions.
It restores the source offsets and line numbers in each candidate. It produces 885 candidates.
The command uses the host prefix. The script starts with a purpose comment.

The run commands use node `/home/ianblenke/docker/gev-tools/automut/automut.mjs` with the host prefix.
Both commands use root `/tmp/ontario-named-tree`, mutants `/tmp/ontario-mutants.json`, one job and slow-ms 1000.
Both commands name the row and key test files. Each worker tests one file per process.
Phase 1 uses --phase 1. Phase 2 uses --phase 2 and --resume.

Phase 1 tests the first 42 row tests and eight key tests. It reports 703 kills and 182 survivors.
Phase 2 has fresh baselines for all 65 row tests and eight key tests. It reports 111 more kills and 71 survivors.

Each phase reports zero crashes and zero timeouts. No candidate waits for a result.
The total is 814 kills from 885 candidates. The table below gives an EQUIVALENT claim for each of the other 71 candidates.

The final test file adds direct own-property checks with literal field names.
The equivalent probe copies that file to the scratch tree and clears the baseline bank.
It uses the same phase-two command with mutants `/tmp/ontario-survivors.json` and output `/tmp/ontario-equivalent-results.json`.
The input has the 71 survivors and their actual phase-one records.

The sha256sum command gives test hash `f3920bfe54943954dc0e55e2bc4180abebd1b7998a92d1660b62404a74a6a595`.
The production source hash is `a8b25dfc0e61a1fbfcb9549814d9864f42cce750cf91435cac33b705a9ea7344`.
These hashes identify the final test file and the unchanged source file in the scratch copies.

| IDs | Claim and reason | Probe |
|---|---|---|
| on1 on3 on4 on5 on6 on7 on8 on9 on15 on22 on24 on770 | EQUIVALENT. The coordinate bounds reject all nonfinite numbers. The finite guard, its order and its false return type do not change source output. | Full row and key tests pass for each ID. |
| on35 on40 on45 | EQUIVALENT. The numeric bounds have no side effects. Their AND order does not change the result. | Full row and key tests pass for each ID. |
| on82 on84 on86 on87 on88 | EQUIVALENT. The changed fallback URL strings are invalid absolute URLs. The URL catch returns an empty value for each. | Full row and key tests pass for each ID. |
| on206 on208 on210 on218 on219 | EQUIVALENT. The changed status fallback strings never equal enabled. The status filter drops each. | Full row and key tests pass for each ID. |
| on98 on100 | EQUIVALENT. A null match access throws into the private URL catch. The catch returns the same empty URL. | Full row and key tests pass for each ID. |
| on102 on140 on167 on174 | EQUIVALENT. The URL filter drops both empty strings and undefined values. The private empty return type has no public effect. | Full row and key tests pass for each ID. |
| on108 | EQUIVALENT. The native URL parser already converts the accepted URL host names to lower case. | Full row and key tests pass for each ID. |
| on118 on127 on773 on775 | EQUIVALENT. The native URL fields and URL host name checks have no side effects. Any decode error and any failed URL host name check return the same empty URL. | Full row and key tests pass for each ID. |
| on780 on781 on782 on783 on849 | EQUIVALENT. The ID rule rejects slash, question mark, hash and empty IDs. The path rule and decoder cannot supply an empty accepted ID. | Full row and key tests pass for each ID. |
| on275 on277 on280 on281 on852 | EQUIVALENT. The empty array find result and first item are undefined. The loader drops both null and undefined views. | Full row and key tests pass for each ID. |
| on244 on245 on267 on268 on355 on356 on367 on368 on392 on393 on417 on418 on439 on440 on503 on504 | EQUIVALENT. The ID guard drops null rows. The status filter drops null views. No later optional null path can occur. | Full row and key tests pass for each ID. |
| on448 on451 on452 | EQUIVALENT. The description is a private string. An empty description gives an empty label on each side of the condition. | Full row and key tests pass for each ID. |
| on854 on857 on869 on870 on872 on874 | EQUIVALENT. The moved private calculations use independent local values. They do not change the row values, source fields, errors or logs. | Full row and key tests pass for each ID. |

The hostname command uses node with --input-type=module and new URL for uppercase official and traveliq URL host names.
`/tmp/ontario-host-probe.log` has `https: 511on.ca` and `https: a.traveliq.co`.

The raw candidate, result and output files record each source fault and each failed test title.
The final survivor file lists all 71 IDs. It has no unclassified survivor.

The final equivalent command completes all 71 probes. Each probe passes 65 row tests and eight key tests.
It reports 71 survivors, zero kills, zero crashes and zero timeouts. These passes support the EQUIVALENT claims above.

The last host test loop writes `/tmp/ontario-all-tests-last.log`.
A Python count of its test totals and exit lines reports 25 files, 326 tests, 326 passes and zero failures.
All 25 test processes have exit code 0. The Rows test file has 65 tests.

The last format shim command and the last Prettier test-file command both return exit code 0.
The Prettier command states that all matched files use its code style.

The QA line in the lead log states that no script covers the capabilities of this change.
This pass adds no QA script to the project. Each scratch script has a purpose header.

The final source search lists the Ontario helper declarations, loader and readOntarioCameraRows call.
The source diff has no output. The test search lists the four new scenario tags and the literal own-property checks.

The last package boundary command returns exit code 0.
Its output starts with Checked 1159 source files and lists each package check.
The raw host and mutation artifacts are in `evidence/pass2/`.

The first Node version command is node --version without an affinity prefix. It reports v26.8.2.
All test, coverage, lint and mutation commands use the requested host prefix.

The final lint command uses the host prefix with node scripts/spec/gates.mjs lint --change fix-ontario-511-key.
It reports zero errors and 545 warnings.
The final OpenSpec show command prints JSON. The final validate command states that the change is valid.
The proposal section title search has all five required section titles. The known limits text has no change.

The stored logs have no spaces on empty lines. The source text, counts and test titles have no change.

## Pass 3

### Tree and commands

The worker read branch fix-ontario-511-key at commit `ae2cbaa478e412f1ddd6ec6aeda0bb62b6d078a6` with the Pass 3 corrections.
The scratch tree has no branch. It copies the corrected code and tests from this clone.
The reports in review/pre-review-1 have no change. The trace files have no change.

All Node commands use taskset -c 8-11 nice -n 19. Each test process names one test file.
The test commands use node --test --test-isolation=none. Each Python script has a purpose comment.
The scripts are in `/home/ianblenke/docker/gev-tools/fix-ontario-511/pass3/`.

The raw output is in evidence/pass3. The JSON files record the counts and failed test titles.

### Corrections

| Decision | Correction |
|---|---|
| O1 | At Pass 3, each key test imports a fresh request helper. Each warning test checks the exact text and the absence of the key text. |
| O2 | Scenario 005 names fetch, JSON and row errors. Both test files check the row warning. |
| O3 | Both dated entries match main again. New entries state the key rule for 2026-10-08. The other documents state the server key rule. |
| O4 | Impact lists the closed gap and the lead counts. Known limits list each case in the task and the reader issue below. |
| O5 | Design names files and measures. Each task has one instruction. Lead checks form the last group. |
| O6 | Scenarios name actors, the key trim, Accept, timeout, ASCII IDs, URL text and field order. Test titles name causes. |
| O7 | A lead task names the Purpose sentence for archive time. The current capability spec has no change. |
| O8 | Time prefixes mark the old counts. Pass 3 stores new output in a separate block. |

The glossary gives each actor and object one meaning. The two warning texts are:

- "[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY."
- "[CCTV] Ontario 511 camera data has an error."

Scenario 004 states that the first request error writes the warning and later request errors write none.
Scenario 005 states the same request rule and the separate row error rule.
Scenario 002 names application/json and 15000 milliseconds. Scenarios 006 and 007 name the URL and field rules that the tests check.

The IDs stay live-sources-002 to live-sources-009. No scenario in openspec/specs changes.

### Tests and named mutations

The first ordinary test processes returned a file failure with no assertion output. They gave no assertion result.
The next commands used --test-isolation=none. Five key tests and one row test failed on the old warning text.
The code then changed the two warning strings. The code has no other runtime correction in Pass 3.

At Pass 3, the final key file has 12 tests. The final Rows test file has 69 tests. Each passes.
The run-alone.py command runs each of the 12 key tests with an exact --test-name-pattern. Each process returns zero.
The reverse.mjs command reverses the key test groups and the fetch/JSON case order on the scratch tree.

The reverse test process passes all 12 tests.

The all-tests.py and layer-tests.py commands run each current CCTV file and mediaProviders.test.mjs.
The sandbox has three loopback failures in cctvMediaRange.test.mjs. The host repeat passes all 21 tests in that file.
At Pass 3, the final counts use that repeat once and the final key file once:

```json
{
  "files": 25,
  "tests": 334,
  "pass": 334,
  "fail": 0,
  "nonzero_exit": 0
}
```

The pre-review files had eight key tests and 65 row tests. Pass 3 adds four key tests and four URL cases.
The new key tests cover trim, timeout, Accept and key text inside a longer error message.
The new URL cases cover x511on.ca, www.511on.ca, %20 and a non-ASCII ID character.

The named.py command makes each mutation on a scratch copy and restores the source after each process.
All 13 mutations return exit code 1 and fail the named target test.

At Pass 3, the tests had these titles. Pass 4 renamed five of them.

| Mutation | Failed test |
|---|---|
| warn-each-error | [live-sources-004] write one warning for an invalid key |
| hide-first-error-warning | [live-sources-005] keep the fetch error secret |
| put-error-message-in-warning-with-key | [live-sources-005] keep the fetch error secret |
| put-embedded-error-message-in-warning-with-key | [live-sources-005] keep key text inside a fetch error out of the warning |
| put-json-error-message-in-warning-with-key | [live-sources-005] keep the json error secret |
| omit-row-error-warning | [live-sources-005] write the warning for a row error with the key text |
| no-key-trim | [live-sources-002] trim spaces from the key |
| timeout-one | [live-sources-002] use a timeout of 15000 milliseconds |
| wrong-Accept | [live-sources-002] send the application/json Accept header |
| accept-x511on.ca | [live-sources-006] return an empty list for the x511on.ca URL host name |
| accept-www.511on.ca | [live-sources-006] return an empty list for the www.511on.ca URL host name |
| accept-ID-space | [live-sources-006] return an empty list for an ID with a space |
| accept-ID-non-ASCII | [live-sources-006] return an empty list for an ID with a non-ASCII character |

### Coverage and reader issue

The row coverage command uses --experimental-test-coverage and the lcov reporter with sources.js as its include file.
The four Ontario functions have 87 branch ranges and zero zero-count ranges. No function has a zero count.
The coverage output records these function counts:

```text
FNDA:7087,isLikelyOntarioCoordinate
FNDA:7074,normalizeOntarioCctvUrl
FNDA:7078,pickOntarioCctvView
FNDA:7096,loadOntarioSourcesFromOpenData
```

The helper command uses NODE_V8_COVERAGE and the key test file. coverage.mjs reads the raw V8 output.
At Pass 3, it uses the project addProcess method to combine the 13 copies under the same physical file name.
The combined result is 100% lines, branches and functions:

```json
{
  "file:///home/ianblenke/docker/gev-work/fix-ontario-511/server/providers/cctv/ontarioRequest.js": {
    "LF": 36,
    "LH": 36,
    "BRF": 11,
    "BRH": 11,
    "FNF": 1,
    "FNH": 1
  }
}
```

The same script probes the current reader with separate module URLs. parseLcov selects the least covered record for each metric.
That probe gives these counts:

```json
{
  "server/providers/cctv/ontarioRequest.js": {
    "lines": {
      "total": 36,
      "covered": 9
    },
    "branches": {
      "total": 6,
      "covered": 2
    },
    "functions": {
      "total": 1,
      "covered": 0
    }
  }
}
```

The host probe shows an instrument issue with the required fresh module tests. It gives no image gate verdict.
The worker told the lead. At Pass 3, the worker made no test change and no gate change to satisfy the instrument.
At Pass 3, the lead must resolve this issue before the next ratchet can close the change.

### Repeated titles and verbs

The check-verbs.py command checks every live test title against its assertion body.
It checks exception verbs, result verbs, literal result claims and named objects. Its output is:

```json
{
  "tests": 81,
  "flags": []
}
```

The check-repeated-titles.py command compares quoted scenario test titles with the live titles in both files.
It omits old records and the reports. Its output is:

```json
{
  "live_titles": 81,
  "references": 17,
  "flags": []
}
```

### Automatic mutations

The first sandbox campaign stopped before its baseline gave test output. It gave no mutation verdict.
The first generator attempt stopped on a parse error. The corrected gen.mjs command produced 116 helper candidates and nine catch candidates.
The catch candidates cover the only runtime source line that Pass 3 changes in sources.js.

The run command uses the automut tool, root /tmp/ont-pass3-tree, mutants pass3/mutants.json, one job and slow-ms 1000.
It names the key and Rows test files, with one file per process. Phase 1 uses --phase 1.
Phase 2 uses --phase 2 and --resume with the same output file.

At Pass 3, the first host campaign had 11 key tests. The final campaign has fresh baselines for 12 key tests and 69 row tests.
At Pass 3, the final output is results-final.json. Each full-test probe passes all 81 Ontario tests.
The totals from that file are:

```json
{
  "candidates": 125,
  "phase_one": {
    "KILLED": 117,
    "SURVIVED": 8
  },
  "full_test_probes": {
    "SURVIVED": 8
  },
  "crashes": 0,
  "timeouts": 0,
  "pending": 0
}
```

| IDs | Claim | Full-test probe and reason |
|---|---|---|
| h29, h30 | EQUIVALENT | Each passes. The private absent-key flag changes from true to another truthy value. |
| h89, h90 | EQUIVALENT | Each passes. The private request-error flag changes from true to another truthy value. |
| h77 | EQUIVALENT | It passes. A ReferenceError replaces the private Error. The catch returns the same list and warning. |
| h111, h112 | EQUIVALENT | Each passes. The private Error message changes, but the catch reads no message. |
| h115 | EQUIVALENT | It passes. The nested request awaits fetch before its error check, so the flag assignment still comes first. |

All eight survivors have a claim and a full-test probe. The absent-key order mutation fails the test with the nested warning call.
The rows and helper code match the clone after the named mutations. The scratch test files have the final assertions.

### Source searches and section titles

The command git diff 05736e82 -- server/providers/cctv/sources.js gives only the catch string change:

```diff
diff --git a/server/providers/cctv/sources.js b/server/providers/cctv/sources.js
index f97b9efe..fb206d71 100644
--- a/server/providers/cctv/sources.js
+++ b/server/providers/cctv/sources.js
@@ -534,7 +534,7 @@ export async function loadOntarioSourcesFromOpenData() {
     );
     return prioritized;
   } catch {
-    console.warn('[CCTV] Ontario 511 camera data error.');
+    console.warn('[CCTV] Ontario 511 camera data has an error.');
     return [];
   }
 }

```

The source search after the corrections gives this output:

```text
server/providers/cctv/sources.js:537:    console.warn('[CCTV] Ontario 511 camera data has an error.');
server/providers/cctv/ontarioRequest.js:10:  const key = (process.env.ONTARIO_511_API_KEY || '').trim();
server/providers/cctv/ontarioRequest.js:14:      console.warn('[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.');
server/providers/cctv/ontarioRequest.js:25:    if (!response.ok) throw new Error('Ontario camera request failed');
server/providers/cctv/ontarioRequest.js:31:        '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',

```

The test title search gives this output:

```text
src/data/cctvOntarioRows.test.mjs:96:  'the x511on.ca URL host name',
src/data/cctvOntarioRows.test.mjs:97:  'the www.511on.ca URL host name',
src/data/cctvOntarioRows.test.mjs:98:  'an ID with a space',
src/data/cctvOntarioRows.test.mjs:99:  'an ID with a non-ASCII character',
src/data/cctvOntarioRows.test.mjs:115:  'https://x511on.ca/map/Cctv/A',
src/data/cctvOntarioRows.test.mjs:116:  'https://www.511on.ca/map/Cctv/A',
src/data/cctvOntarioRows.test.mjs:491:  'URL text with spaces at the start and end',
src/data/cctvOntarioKey.test.mjs:164:test('[live-sources-002] trim spaces from the key', async (t) => {
src/data/cctvOntarioKey.test.mjs:176:test('[live-sources-002] use a timeout of 15000 milliseconds', async (t) => {
src/data/cctvOntarioKey.test.mjs:189:test('[live-sources-002] send the application/json Accept header', async (t) => {
src/data/cctvOntarioKey.test.mjs:195:test('[live-sources-005] keep key text inside a fetch error out of the warning', async (t) => {

```

The history probe compares the dated entries with git show e2437f94 for each file. Both old entries match main.
The new entries state the 2026-10-08 key rule. history.json has both results and the exact new text.
The sources.js diff and the dev-fresh.sh diff each have one string or comment change.
The constants.js diff changes only the Ontario comment.

The headings.py command compares every changed Markdown document with commit ae2cbaa478e412f1ddd6ec6aeda0bb62b6d078a6.
Its output is:

```text
CHANGELOG.md: same
DATA_SOURCES.md: same
README.md: same
SECURITY.md: same
docs/CURRENT-STATE.md: same
openspec/changes/fix-ontario-511-key/design.md: changed
--- ae2cbaa478e412f1ddd6ec6aeda0bb62b6d078a6
+++ Pass 3
@@ -3,3 +3,6 @@
 ## Health decision
 ## Documents
 ## Checks
+## Pass 3 words
+## Files and measures
+## Purpose at archive time
openspec/changes/fix-ontario-511-key/evidence.md: changed
--- ae2cbaa478e412f1ddd6ec6aeda0bb62b6d078a6
+++ Pass 3
@@ -7,3 +7,4 @@
 ## Prose and OpenSpec
 ## Lead checks
 ## Pass 2
+## Pass 3
openspec/changes/fix-ontario-511-key/proposal.md: same
openspec/changes/fix-ontario-511-key/specs/live-sources/spec.md: same
openspec/changes/fix-ontario-511-key/tasks.md: changed
--- ae2cbaa478e412f1ddd6ec6aeda0bb62b6d078a6
+++ Pass 3
@@ -1,4 +1,5 @@
 ## 1. Spec and tests
 ## 2. Code and host checks
-## 3. Lead checks
-## 4. Pass 2
+## 3. Pass 2
+## 4. Pass 3
+## 5. Lead checks

```

The proposal keeps all five required section titles. Design adds the glossary, files and measures, and Purpose sentence sections.
Evidence adds Pass 3. Tasks add Pass 3 and move Lead checks to the last group.
The other section titles have no change.

### Limits of this run

The worker ran no Docker, make, ratchet, archive, push or gh command. The trace files have no change.
The lead must repeat the ratchet after these corrections and run the final image gates and both reviews.
The helper reader issue above needs a lead decision. This report gives no new ledger or review verdict.
No worker used a real Ontario key or downloaded an image in this pass.

### Final host checks

The format shim command checks scripts/format.mjs with --check. It returns zero and prints "Checked 1159 source files."
The package boundary command returns zero. It lists the cctv-provider group with 19 owned modules and each other group.
The helper and both test files pass Prettier after the last test addition.

The lint command returns zero with 0 errors and 540 warnings. The worker read the warnings for the change files.
The OpenSpec show command prints JSON with deltaCount 2. The OpenSpec validate command states that the change is valid.
The final title checks report 81 tests and zero flags. The repeated titles check has 17 references and zero flags.

The raw log copies have no spaces at line ends. Their text and counts match the command output.
The diff check gives no whitespace error. The source and test searches above show the completed corrections.

The two change warnings concern the old JavaScript undefined record and the exact phrase in scenario 005 from O2.
The new scenario clauses use the loader as the actor.

## Pass 3B

Tree read: `0720b2d8ccb6152a5d8d866fc5d03bd15453d129`, branch `fix-ontario-511-key`, with the Pass 3B edits.
Past records stay unchanged.

Pass 3B replaces the fresh module copies with a reset hook.
The parseLcov reader selects the least covered record of one file under several module URLs.

The key tests import the request module once. The beforeEach callback calls the reset hook before each test.
The absent-key test also calls the reset hook after its first warning. The next call must write that warning again.
The reset hook has no scenario of its own. It is a test helper.

At Pass 9, the glossary uses the name reset hook for this test helper.

The command prefix for every Node process is taskset -c 8-11 nice -n 19.
The test command is node --test --test-isolation=none src/data/cctvOntarioKey.test.mjs.
The red run in `evidence/pass3b/red.log` has 12 tests, 0 passes and 12 failures.
Each test fails because `_resetOntarioRequestForTest` is not a function.
The green run in `evidence/pass3b/green.log` has 12 tests, 12 passes and 0 failures.

The checks.py command runs each test file in one process. Its file path is `/home/ianblenke/docker/gev-tools/fix-ontario-511/pass3b/checks.py`.
The final runs have these counts:

| File log | Tests | Pass | Fail |
|---|---:|---:|---:|
| cctv.test.log | 55 | 55 | 0 |
| cctvCalgary.test.log | 13 | 13 | 0 |
| cctvCards.test.log | 23 | 23 | 0 |
| cctvCatalogCap.test.log | 7 | 7 | 0 |
| cctvDisplayCode.test.log | 2 | 2 | 0 |
| cctvDriveBcSource.test.log | 6 | 6 | 0 |
| cctvEstonia.test.log | 3 | 3 | 0 |
| cctvFintraffic.test.log | 8 | 8 | 0 |
| cctvFootprint.test.log | 3 | 3 | 0 |
| cctvGizmo.test.log | 10 | 10 | 0 |
| cctvGroundHeights.test.log | 2 | 2 | 0 |
| cctvHlsStream.test.log | 10 | 10 | 0 |
| cctvLod.test.log | 29 | 29 | 0 |
| cctvMediaRange.test.log | 21 | 21 | 0 |
| cctvNswSource.test.log | 6 | 6 | 0 |
| cctvOntarioKey.test.log | 12 | 12 | 0 |
| cctvOntarioRows.test.log | 69 | 69 | 0 |
| cctvProxy.test.log | 14 | 14 | 0 |
| cctvTxdotSource.test.log | 10 | 10 | 0 |
| cctvViewshed.test.log | 7 | 7 | 0 |
| cctvWarendorf.test.log | 3 | 3 | 0 |
| mediaProviders.test.log | 5 | 5 | 0 |

The checks.py loop runs each key test in its own process with an exact `--test-name-pattern`.
The 12 test logs each show 1 pass and 0 failures.
The reverse.mjs command writes the test groups in reverse order on `/tmp/ont-pass3b-tree`.
The reverse test command runs its one test file. It shows 12 passes and 0 failures in `reverse.log`.

The coverage commands use `--experimental-test-coverage`, `--test-reporter=lcov` and `--test-reporter-destination`.
The key command includes `server/providers/cctv/ontarioRequest.js`; the Rows command includes `server/providers/cctv/sources.js`.
The destinations are `evidence/pass3b/key.lcov` and `evidence/pass3b/rows.lcov`.
The probe.mjs command calls the current parseLcov reader on the new lcov. It changes no gate.
Its output is:

```json
{
  "moduleRecords": [
    "SF:server/providers/cctv/ontarioRequest.js"
  ],
  "counts": {
    "lines": {
      "total": 41,
      "covered": 41
    },
    "branches": {
      "total": 12,
      "covered": 12
    },
    "functions": {
      "total": 2,
      "covered": 2
    }
  },
  "gaps": {
    "lines": 0,
    "branches": 0,
    "functions": 0
  },
  "result": "NO GAP",
  "Ontario": [
    {
      "name": "isLikelyOntarioCoordinate",
      "start": 403,
      "end": 413,
      "branches": 7,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7087,isLikelyOntarioCoordinate"
    },
    {
      "name": "normalizeOntarioCctvUrl",
      "start": 414,
      "end": 439,
      "branches": 11,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7074,normalizeOntarioCctvUrl"
    },
    {
      "name": "pickOntarioCctvView",
      "start": 440,
      "end": 463,
      "branches": 17,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7078,pickOntarioCctvView"
    },
    {
      "name": "loadOntarioSourcesFromOpenData",
      "start": 464,
      "end": 540,
      "branches": 52,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7096,loadOntarioSourcesFromOpenData"
    }
  ]
}
```

The request helper has 100% line, branch and function coverage. The lcov has one module record.
The green command also sets `NODE_V8_COVERAGE=/tmp/ont-pass3b-v8`.
The module-urls.py probe reads each JSON file in that directory. Its output in `module-urls.json` has one URL with no query string.

The named.py command changes the reset hook on the scratch tree and runs the key test file.
At first, the reset-error-only mutation passed. The extra check in the absent-key test makes that mutation fail.
The final named.json records these mutations:

| Mutation | Code change | Test that fails |
|---|---|---|
| reset-error-only | Delete the reset of warnedMissingKey. | "[live-sources-003] make no request without a key" |
| reset-missing-only | Delete the reset of warnedRequestError. | "[live-sources-005] keep the fetch error secret" |
| no-reset | Delete both resets. | "[live-sources-003] make no request without a key" |

The gen.mjs command generates 15 automatic mutations for the changed hook lines.
The automatic tool runs phase 1 and phase 2 with one job on the scratch tree.
Its commands use `automut.mjs run`, the Pass 3B mutants.json, and `--tests src/data/cctvOntarioKey.test.mjs`.
Phase 1 has 14 kills and 1 survivor. Phase 2 has 1 survivor, b14, which swaps the two reset statements.

The equivalent.mjs probe checks each of the four initial flag states for both statement orders.
Each result equals the literal array `[false, false]`. The statements have no call between them.
Mutation b14 is EQUIVALENT. The run has no timeout or crash.
The result files are `automatic-results.json` and `equivalent.json`.

The sandbox automatic runs stopped at the baseline with no test output. They gave no mutation verdict.
The sandbox check run stopped before the format command ended. It gave no final format verdict.
The host repeats complete these checks.

The Pass 3 repeated-title and verb commands are `python3` with `pass3/check-repeated-titles.py` and `pass3/check-verbs.py`.
The repeated-title command reports 81 live titles, 17 references and 0 flags.
The verb command reports 81 tests and 0 flags.
Their outputs are `titles.json` and `verbs.json`.

The host format shim command uses node --import with `/home/ianblenke/docker/gev-tools/director-4c/format-host.mjs` and `scripts/format.mjs --check`.
It returns exit code 0 and prints "Checked 1159 source files."
The host checks.py run stops at the package boundary command. The separate coverage commands complete after that stop.
The package boundary command also has a separate host run.

The section title probe compares each change document with commit `0720b2d8`.
It checks 7 documents and finds 0 unexpected changes. Only evidence.md adds the Pass 3B section title.
The proposal keeps all its required section titles. The probe also checks that the past evidence text stays unchanged.

The OpenSpec show command uses `openspec show fix-ontario-511-key --json`. It returns exit code 0 and valid JSON.
The validate command uses `openspec validate fix-ontario-511-key`. It returns exit code 0 and states that the change is valid.

The final repeated-title command checks 20 references and reports 0 flags. The final verb command reports 0 flags.
The final prose lint command reports 0 errors and 542 warnings.

The separate host package boundary command returns exit code 0. Its output lists each package group in `boundaries-host.log`.
The earlier package boundary runs stopped before the end. They give no package boundary verdict.
No image gate, ratchet, archive, push or review command ran in Pass 3B.
The lead must run the image gates and both reviews before a merge.

## Pass 4

Tree read: `1911403e1798366a39d9bba455f4b1ac7ffa03ae`, branch `fix-ontario-511-key`, with the Pass 4 edits.

The scratch tree has no branch. It copies the code and tests from that commit and adds the edits of Pass 4.

Pass 4 changes no production code. Both pre-review folders stay unchanged.

The records above describe past runs. Their new time markers do not change their counts.


### Corrections of pre-review 2

| Finding | Correction |
|---|---|
| Spec major 1 | Scenario 008 has a control row about 3 kilometers from Kitchener, after all six anchor rows. Its order assertion names all eight sources. |
| Spec major 2 | At Pass 4, both fixtures watch warn, log, error, info and debug. At Pass 4, scenarios 004 and 005 named console channels and stated that no thrown error escaped the pack. |
| Spec minors | The 003 test loses its unused key assertion. Impact names the loader and three other functions. Scenario 006 names the trim of status text, letter case and field choice. |
| Other spec minors | Scenario 007 needs a view description that is not empty for the dash. Known limits name stderr, all kinds of request error and the reset hook. |
| Records and tasks | Pass 3 records have time markers. The fresh module tasks name their replacement. The coverage reader task stays unchecked until the Docker image ratchet. |
| STE major 1 | The 49-test sentence names the second test loop of Pass 2. |
| STE major 2 | Each Pass 3B check has its own task. Pass 3B has its own section. |
| STE majors 3 to 5 | The title names the view description. The spec distinguishes a views list from a view. All six URL titles name the view ID. |
| STE major 6 | At Pass 4, README says that poses are first estimates. The sources publish positions, and a user moves a gizmo. |
| STE minors | The glossary defines the developer key, view ID, two image terms, two empty lists, request helper, reset hook and beforeEach callback. |
| Other STE minors | The prose uses mutations, absent-key, prose lint and format check. The current-state entry follows the section title style. Past evidence has time markers. |

### Tests and named mutations

The command prefix for each test process is taskset -c 8-11 nice -n 19.

The checks.py command runs each data test file and the media provider test file in a separate process.

The initial loop has 318 tests and 315 tests pass. Three media range tests fail at `listen EPERM` in the sandbox.

The separate host run of cctvMediaRange.test.mjs has 21 tests and 21 tests pass.

The final Rows test file has two new tests for the initial warning flags. All 71 tests pass.

The key file has 12 tests and all 12 tests pass. Each key test also passes alone. All 12 tests pass in the reverse run.

At Pass 4, all 320 tests in 22 files pass. test-summary.json records this total.
The three src/layers/cctv test files, with 16 tests, did not run at Pass 4.
The Pass 4 command selected the data files and mediaProviders.test.mjs, as the Pass 4 brief instructed.


The Windsor mutation runs first, against the old scenario 008 test. The old test still passes.

The named.py command then runs the six removals with the control row. Each removal makes the scenario 008 test fail.

No mutation enters the commit.


| Mutation | Test that fails |
|---|---|
| Remove Kitchener | [live-sources-008] use each nearest anchor |
| Remove Toronto | [live-sources-008] use each nearest anchor |
| Remove Ottawa | [live-sources-008] use each nearest anchor |
| Remove Hamilton | [live-sources-008] use each nearest anchor |
| Remove London | [live-sources-008] use each nearest anchor |
| Remove Windsor | [live-sources-008] use each nearest anchor |
| Add console.error(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |
| Add console.info(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |

The first automatic run shows two survivors that set an initial warning flag to true.

The reset hook sets both flags to false before each key test, so the key tests do not see those mutations.
Two new Rows tests run without that hook.

The initial.py command sets one initial flag to true on the scratch tree for each run. Each run makes one test fail.
The unchanged code passes both tests.

The first test expects the literal absent-key warning. The second expects the literal request-error warning from scenario 004.


| Mutation | Test that fails |
|---|---|
| Set warnedMissingKey to true at module load | [live-sources-003] write the first warning for an absent key |
| Set warnedRequestError to true at module load | [live-sources-004] write the first warning for an HTTP error |

### Coverage

The two lcov commands measure one test file per process. probe.mjs reads key.lcov and rows.lcov.

Its output is coverage-probe.json:


```json
{
  "moduleRecords": [
    "SF:server/providers/cctv/ontarioRequest.js"
  ],
  "counts": {
    "lines": {
      "total": 41,
      "covered": 41
    },
    "branches": {
      "total": 12,
      "covered": 12
    },
    "functions": {
      "total": 2,
      "covered": 2
    }
  },
  "gaps": {
    "lines": 0,
    "branches": 0,
    "functions": 0
  },
  "result": "NO GAP",
  "Ontario": [
    {
      "name": "isLikelyOntarioCoordinate",
      "start": 403,
      "end": 413,
      "branches": 7,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7088,isLikelyOntarioCoordinate"
    },
    {
      "name": "normalizeOntarioCctvUrl",
      "start": 414,
      "end": 439,
      "branches": 11,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7075,normalizeOntarioCctvUrl"
    },
    {
      "name": "pickOntarioCctvView",
      "start": 440,
      "end": 463,
      "branches": 17,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7079,pickOntarioCctvView"
    },
    {
      "name": "loadOntarioSourcesFromOpenData",
      "start": 464,
      "end": 540,
      "branches": 52,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7097,loadOntarioSourcesFromOpenData"
    }
  ]
}
```

The request helper has 100% line, branch and function coverage. parseLcov reports no gap and one module record.

The four Ontario functions have 87 branch ranges and no zero-count range. Each function runs.

No Docker image coverage verdict exists for this tree.


### Automatic mutations

The gen.mjs command makes 140 candidates: 131 for the request helper and 9 for the loader catch.

The first sandbox command stops at an empty baseline. It gives no mutation verdict.

The next clone run completes with 129 kills and 11 survivors. It uses the tests before the two initial-flag tests.

A later clone run stops while it copies .codex. It gives no mutation verdict.

The final command uses the scratch tree and both final test files. Phase 1 has 131 kills and 9 survivors.

Phase 2 runs all tests for the nine survivors. automatic-summary.json records its result.


The equivalent.mjs command tests each survivor with absent, blank, HTTP, fetch and JSON fixtures.

Each fixture runs with and without a nested warning call. The reset probe checks all four initial flag states.

Each mutation and the unchanged code pass all 28 probe cases. The probe asserts the literal warning and empty row list.


| ID | EQUIVALENT reason |
|---|---|
| h43, h44 | The private absent-key flag remains true in each condition. |
| h103, h104 | The private request-error flag remains true in each condition. |
| h91 | A ReferenceError replaces the Error. The same catch writes the constant warning and returns an empty row list. |
| h126, h127 | The catch reads no Error message. Both error text changes give the same warning and empty row list. |
| h113 | The two reset assignments have no dependency. All four initial flag states end at false, false. |
| h130 | A nested request must pass its fetch await before it reads the warning flag. The outer call sets the flag first. |

### Title and prose checks

The repeated titles script reads 83 live titles and finds no stale reference in current prose.

It excludes past evidence and review reports. Its output is repeated-titles.json.

The verb script reads all 83 test bodies. It also lists clauses with a negative word, the word after, the word at, or a result verb, with their assertions.

The worker reads each listed body. Each changed title has an assertion for every result clause.

The output is verbs.json. One flag names the absent-key fixture. It does not show a false title.

The body deletes ONTARIO_511_API_KEY and asserts the literal absent-key warning through its fixture table. The test sets no key value.

The body of the HTTP error test asserts the literal request-error warning through the other fixture table item.

The body of the Roadway test asserts Upper road, Upper road - East and heading 90 after a blank Direction value.

The no-break-space title has a no-break-space fixture. The view ID titles name URL path values.

The bodies of the empty source list tests assert an empty source list.
Their warning clauses assert the exact list of console output.


The banned-word search finds no new prose hit. Its only hit is an old code quotation in Pass 3.

The output is banned-words.json. The search checks prefixed forms and added user-document lines.

The section title diff compares each change document with commit `1911403e`. The proposal titles have no change.

Design changes Pass 3 words to Pass 4 words. Tasks add Pass 3B and Pass 4 sections and renumber Lead checks.

Evidence adds this Pass 4 section. CURRENT-STATE adds the dated Ontario section that its file style needs.


### Host checks and limits

The format check with the host shim passes. It prints "Checked 1159 source files."

The package boundary check passes. The prose lint has zero errors after each correction group.

The OpenSpec show command prints valid JSON. The OpenSpec validate command states that the change is valid.

The sources.js diff against commit `05736e82` shows only a change of the catch string to "[CCTV] Ontario 511 camera data has an error."

The named mutation logs and probes hold their command output under evidence/pass4.


An early format command has no mode argument and returns the usage error. The final format check completes.

An early coverage probe runs before the lcov files exist and stops. The final coverage probe completes.

One separate package check stops at its 50-second limit. It gives no package verdict.

The complete checks.py package command passes. Its full output is boundaries.log.

The lead still must run the Docker image ratchet and both reviews. The change stays active.

No Docker command, make command, ratchet, ledger change, archive, push or gh command ran in this pass.


### Command output

The final script commands give these summaries:

The test-summary.json output is:

```json
{
  "files": 22,
  "tests": 320,
  "pass": 320,
  "fail": 0,
  "filesWithErrors": [],
  "keyAlone": 12
}
```

The automatic-summary.json output is:

```json
{
  "phase-1-KILLED": 131,
  "phase-1-SURVIVED": 9,
  "phase-2-SURVIVED": 9
}
```

The repeated-titles.json output is:

```json
{
  "live_titles": 83,
  "references": 11,
  "flags": []
}
```

The verb summary is:

```json
{
  "tests": 83,
  "flags": [
    {
      "file": "cctvOntarioRows.test.mjs",
      "title": "[live-sources-003] write the first warning for an absent key",
      "flag": "named thing has no assertion: key"
    }
  ],
  "clauseBodies": 57
}
```

The one flag has the body explanation above.

The section title diff is:

```diff
--- openspec/changes/fix-ontario-511-key/design.md @1911403e
+++ openspec/changes/fix-ontario-511-key/design.md Pass 4
@@ -3,6 +3,6 @@
 ## Health decision
 ## Documents
 ## Checks
-## Pass 3 words
+## Pass 4 words
 ## Files and measures
 ## Purpose at archive time
--- openspec/changes/fix-ontario-511-key/tasks.md @1911403e
+++ openspec/changes/fix-ontario-511-key/tasks.md Pass 4
@@ -2,4 +2,6 @@
 ## 2. Code and host checks
 ## 3. Pass 2
 ## 4. Pass 3
-## 5. Lead checks
+## 5. Pass 3B
+## 6. Pass 4
+## 7. Lead checks
--- openspec/changes/fix-ontario-511-key/evidence.md @1911403e
+++ openspec/changes/fix-ontario-511-key/evidence.md Pass 4
@@ -9,3 +9,4 @@
 ## Pass 2
 ## Pass 3
 ## Pass 3B
+## Pass 4
--- docs/CURRENT-STATE.md @1911403e
+++ docs/CURRENT-STATE.md Pass 4
@@ -1,3 +1,4 @@
+## Ontario 511 key — October 8, 2026
 ## Cyber HUD — September 23, 2026
 ## Vessel components and sources
 ## Military-flight components and aircraft mechanics
```

The prose lint prints "STE: 0 errors, 540 warnings."


## Pass 5

Tree read: `ede1c684b94a133d7c699c7a45e5860d4c3dd5a6`, branch `fix-ontario-511-key`, with the Pass 5 edits.
At Pass 5, the scratch tree has no branch. It copies this code and the Pass 5 tests.

Pass 6 found that the Pass 5 automatic mutation run used a copy of the tests from before the Pass 5 channel changes. See S18.
Pass 5 changes no production code. The three pre-review folders and the trace files stay unchanged.

### Corrections of pre-review 3

| Finding | Correction |
|---|---|
| Spec major 1 and F1 | Both fixtures record pairs of console channel and text. Each warning and source count assertion checks both values. |
| Spec major 2 and STE major 3 | Both fixtures also replace `console.dir`. The glossary names the six console channels. The spec and tasks use those terms. |
| STE majors 1 and 2 | The Roadway title names the capitalized field. The requirement names the key twice, with no unclear pronoun. |
| Spec minor: README | At Pass 5, the lead chose the words from e2437f94 with only a change of the banned noun. See S3. |
| Spec minor: Windsor record | The old log file has a Pass 5 note, the removed line and input hashes. The new run repeats the old test that passes. |
| Spec minor: Pass 4 count | The record states why the three layer files and their 16 tests did not run at Pass 4. |
| Spec minor: past counts | The Pass 3 counts and final campaign claims have Pass 3 markers. The old numbers stay unchanged. |
| Spec minor: anchor limits | At Pass 5, Known limits name a seventh distant anchor and an anchor that moves by less than about 3 kilometers. |
| Spec minor: empty list | Scenario 004 and its HTTP error test name the empty row list. |
| Spec minor: unrun channel cases | The named runs include debug, log and dir in the request catch, and error and dir in the loader catch. |
| STE part 2 | The spec names status text, letter case, field choice, the loader result and the view description. At Pass 5, the check that the request helper and the loader throw no error has its own item. |
| Other STE part 2 | Impact names three other functions. Known limits state the warning advice and the HTTP status that the code no longer writes. |
| STE part 3 | The evidence uses mutation, test bodies and time markers. CURRENT-STATE has no repeated date. README names the key. |
| Past image word | Known limits accept image in the Pass 3 and Pass 3B records by name. Those records stay unchanged. |

At Pass 5, the lead decided to keep the words of that line on main, except for the banned word.
At Pass 5, this decision overrode the STE replacement.
At Pass 6, the line has that replacement (see S3). The lead accepts that the line now also drops the word estimated.
The old code at e2437f94 writes resp.status through console.warn when the Ontario response is not OK.

### Red runs for the console channel checks

The named.py command changes one scratch file, runs one test file and restores the code file for each mutation.
Each test command uses taskset -c 8-11 nice -n 19 node --test --test-isolation=none and a test name pattern.
All 14 runs return exit code 1. In each run, the test below fails. The log files show the assertion differences.
No mutation enters the commit.

| Mutation | Test that fails |
|---|---|
| A: absent-key warn to error | [live-sources-003] make no request without a key |
| A2: absent-key warn to log | [live-sources-003] make no request without a key |
| B: request-error warn to error | [live-sources-004] return an empty row list for an HTTP error with JSON rows |
| C: loader warn to error | [live-sources-005] keep the camera data error secret |
| D: count log to warn | [live-sources-008] log both source counts |
| D: count log to warn, invalid rows and views | [live-sources-006] return an empty source list without a warning for invalid rows and views |
| D: count log to warn, numeric status | [live-sources-006] return an empty source list without a warning for a numeric status |
| Add console.debug(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |
| Add console.log(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |
| Add console.dir(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |
| Add console.error(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |
| Add console.info(error) in the request catch | [live-sources-005] keep the key text of a fetch error out of the warning |
| Add console.error(error) in the loader catch | [live-sources-005] write the warning for a row error with the key text |
| Add console.dir(error) in the loader catch | [live-sources-005] write the warning for a row error with the key text |

Mutation B runs the HTTP error test with JSON rows. That test has no call count assertion.
Its deepEqual fails on error versus warn. The warning text stays equal.

Mutation D makes two tests fail. The titles of both tests have the words without a warning.
The pairs show the console channel of each line again. The Pass 4 lists had only the text.

### Console method probe

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/console-probe.mjs
The command runs once on Node v26.8.2. Its output is console-probe.json.

```json
{
  "node": "v26.8.2",
  "results": [
    {
      "method": "table",
      "watchedVia": [
        "log"
      ],
      "direct": []
    },
    {
      "method": "group",
      "watchedVia": [
        "log"
      ],
      "direct": []
    },
    {
      "method": "groupCollapsed",
      "watchedVia": [
        "log"
      ],
      "direct": []
    },
    {
      "method": "groupEnd",
      "watchedVia": [],
      "direct": []
    },
    {
      "method": "count",
      "watchedVia": [
        "log"
      ],
      "direct": []
    },
    {
      "method": "countReset",
      "watchedVia": [],
      "direct": []
    },
    {
      "method": "time",
      "watchedVia": [],
      "direct": []
    },
    {
      "method": "timeLog",
      "watchedVia": [
        "log"
      ],
      "direct": []
    },
    {
      "method": "timeEnd",
      "watchedVia": [
        "log"
      ],
      "direct": []
    },
    {
      "method": "dirxml",
      "watchedVia": [],
      "direct": [
        [
          "stdout",
          "probe\n"
        ]
      ]
    },
    {
      "method": "trace",
      "watchedVia": [
        "error"
      ],
      "direct": []
    },
    {
      "method": "assert",
      "watchedVia": [
        "warn"
      ],
      "direct": []
    },
    {
      "method": "dir",
      "watchedVia": [
        "dir"
      ],
      "direct": []
    }
  ]
}
```

Both fixtures watch `console.table`, the labels of `console.group`, `console.count`, `console.timeLog` and `console.timeEnd` indirectly through `console.log`.
They watch `console.trace` through `console.error` and a failed `console.assert` through `console.warn`.
On Node v26.8.2, `console.dirxml` writes directly to stdout. The six mocks do not watch that method.
`console.groupEnd`, a valid `console.countReset` and `console.time` write no text in this probe.

The fixtures do not watch text that code writes directly to process.stdout and process.stderr.
At Pass 6, the lead ran the same probe in the base image (Node v24.21.0). The results are the same (C2).

### Old Windsor case

The windsor.py command loads the old Rows test from commit 1911403e and removes the Windsor anchor on a scratch copy.
The log of the new run is windsor-old-rerun.log. It records both input hashes and this removed line:

```js
{ lat: 42.3149, lon: -83.0364 }, // Windsor
```

The old scenario 008 test still passes. The Pass 4 log has a Pass 5 note. The note gives the same input hashes as windsor-old-rerun.log.

### Runs that stopped

The first scratch copy stopped at an old node_modules link. It gave no test result.
The first automatic command stopped at the child baseline with no test output. It gave no mutation verdict.

The sandbox check loop had three listen EPERM failures in the media range file.
The loop then stopped during the format command. It gave no format verdict and no completed loop total.
The host commands repeat these checks.

The first draft of the Known limits paragraph in proposal.md has nine sentences. The prose lint reports one error for that paragraph.
The correction splits the paragraph. The next lint command reports zero errors.


### Host tests and coverage

Command: python /home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/checks.py
The host loop runs each data CCTV file, mediaProviders.test.mjs and each of the three CCTV layer files in a separate process.
Each Node command uses taskset -c 8-11 nice -n 19. checks.json records the exit codes and test counts.
The host total is:

```json
{
  "files": 25,
  "tests": 336,
  "pass": 336,
  "fail": 0,
  "nonzero_exit": 0
}
```

The key file has 12 tests. The Rows file has 71 tests. All 83 Ontario tests pass.
Each of the 12 key tests also passes alone with an exact test name pattern.
The reverse.mjs command reverses the test groups and the fetch and JSON cases on the scratch tree.
All 12 tests pass in reverse.log.

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/probe.mjs
The coverage command measures the key file and the Rows file in separate processes.
The probe reads their lcov files and calls the project parseLcov function.
Its output is:

```json
{
  "moduleRecords": [
    "SF:server/providers/cctv/ontarioRequest.js"
  ],
  "counts": {
    "lines": {
      "total": 41,
      "covered": 41
    },
    "branches": {
      "total": 12,
      "covered": 12
    },
    "functions": {
      "total": 2,
      "covered": 2
    }
  },
  "gaps": {
    "lines": 0,
    "branches": 0,
    "functions": 0
  },
  "result": "NO GAP",
  "Ontario": [
    {
      "name": "isLikelyOntarioCoordinate",
      "start": 403,
      "end": 413,
      "branches": 7,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7088,isLikelyOntarioCoordinate"
    },
    {
      "name": "normalizeOntarioCctvUrl",
      "start": 414,
      "end": 439,
      "branches": 11,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7075,normalizeOntarioCctvUrl"
    },
    {
      "name": "pickOntarioCctvView",
      "start": 440,
      "end": 463,
      "branches": 17,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7079,pickOntarioCctvView"
    },
    {
      "name": "loadOntarioSourcesFromOpenData",
      "start": 464,
      "end": 540,
      "branches": 52,
      "zeroCountRanges": 0,
      "functionCount": "FNDA:7097,loadOntarioSourcesFromOpenData"
    }
  ]
}
```

The request helper has 100% line, branch and function coverage. It has one module record.
The four Ontario functions have 87 branch ranges. No branch range has a zero count.
The host probe gives no Docker image gate verdict.

### Automatic mutations

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/gen.mjs
The generator selects the request helper and the changed loader catch.
Its output is:

```json
{"helper":131,"catch":9,"total":140}
```

The automut command uses root /tmp/ont-pass5-tree, the Pass 5 mutants.json file and one job.

Pass 6 found that the Pass 5 automatic mutation run used a copy of the tests from before the Pass 5 channel changes. See S18.
It runs each Ontario test file in its own process. Phase 2 uses resume after Phase 1 completes.
The command lines and output are in automatic-phase1-host.log and automatic-phase2-host.log.
The completed counts from automatic-results.json are:

```json
{
  "phaseComplete": {
    "1": true,
    "2": true
  },
  "phases": {
    "1": {
      "KILLED": 131,
      "SURVIVED": 9,
      "CRASH": 0,
      "TIMEOUT": 0
    },
    "2": {
      "KILLED": 0,
      "SURVIVED": 9,
      "CRASH": 0,
      "TIMEOUT": 0
    }
  },
  "survivors": [
    "h43",
    "h44",
    "h91",
    "h103",
    "h104",
    "h113",
    "h126",
    "h127",
    "h130"
  ]
}
```

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/equivalent.mjs
The equivalent probe passes all 28 cases for each survivor and the unchanged code.
The output is equivalent-probe.json. The nine IDs and reasons match the Pass 4 table.

The two private flags accept truthy values. The two reset assignments have no dependency.
The catch reads no Error message. A nested request reads the warning flag after the outer call sets it.
No survivor changes the required result in those cases.

### Title, prose and structure checks

The repeated title script reads 83 live titles and checks 14 current references. It finds no stale title.
The clause script reads all 83 test bodies. It lists one test: the absent-key test.
That test sets no key value and asserts the literal absent-key warning from its table.

The script also names D-invalid and D-numeric for the two titles that have the words without a warning.
Both named runs fail on the channel pair assertion.

The banned-word script checks prefixed forms in the change prose, tests and added user-document lines.
It finds no new prose hit. Its one hit is an old code quote at evidence.md:674.
The final search reads the corrected files again. Its output is corrections-search.log.

The format shim command prints:

```text
Checked 1159 source files.
```

The node scripts/check-package-boundaries.mjs command returns exit code 0.
Its output lists each package group in boundaries.log.
The prose lint runs after each correction group. The final command prints:

```text
STE: 0 errors, 540 warnings.
```

The new evidence had two paragraph errors. The corrections split both paragraphs and remove two nontechnical words with -ing forms.
The next lint command has zero errors.

The result summary then had three paragraph errors. The correction splits those paragraphs.
The final lint output is lint-final.log.

The openspec show fix-ontario-511-key --json command prints valid JSON.
The openspec validate fix-ontario-511-key command prints:

```text
Change 'fix-ontario-511-key' is valid
```

The section title diff keeps all proposal section titles.
Design changes Pass 4 words to Pass 5 words. Evidence adds Pass 5. No other section title changes.

The server diff against 05736e82 matches the Pass 4 server diff byte for byte.
It shows only the Ontario comment, reset hook and two warning strings.
Pass 5 adds no server change.

### Limits of this pass

No Docker command, make command, ratchet, gate comparison, ledger change, archive, push, gh command or review command ran.
At Pass 5, the lead must run the Node 24.14.0 Docker image checks and both reviews before merge.
This sentence was wrong at Pass 5: the Dockerfile already used Node 24.21.0 (C2).
The host results do not replace those checks.


## Pass 6

Tree read: `d0b0c776b48f7a9f2173704573c64013501088dd`, branch `fix-ontario-511-key`, with the Pass 6 text changes.
The four pre-review folders and the trace files stay unchanged.

### Text corrections

C1: Scenario 004 names only the request helper. Scenario 005 names the request helper for fetch and JSON errors and the loader for row errors.
Each tagged test awaits that call. If the call throws an error, the test fails.
Each test asserts the empty result of the call.

The Known limit for the loader log line now names both the absent-key case and request errors. No scenario covers those loader cases.

C2: The Docker image uses Node 24.21.0. The lead ran the console probe in the base image on 2026-10-08.
Pass 6 copies the script and the output of the probe in the base image to evidence/pass6. The lead's stderr file is empty.

Pass 7 adds console-probe-image.err and console-probe-image-command.txt to evidence/pass6.
The command file names the Docker command, the name and ID of the base image, and the exit code.

The comparison reads both JSON files and compares their 13 result objects.
`console.dirxml` still writes directly to stdout.

```text
Command: python /tmp/pass6-check.py (console comparison)
13 routes equal: Node v26.8.2 = Node v24.21.0
dirxml: direct stdout on both versions
```

The lead must run the Docker image checks (Node 24.21.0) and both reviews before merge.
The Node 24.14.0 sentence in Pass 5 has an "At Pass 5," prefix. The review reports stay unchanged.
No current check assigns the console probe to the lead. That probe is complete.

C3: Tasks section 6 names five channels for Pass 4. Section 7 records the Pass 5 work from its evidence.
Section 8 records Pass 6. Section 9 has the lead checks. Only the lead ran the probe in the base image.

C4: Only the Windsor anchor has the stated small-distance limit. The control row is about 3.16 kilometers north of Kitchener.
The six anchor rows have distance zero. The sort breaks equal distances by row index. Windsor is last in that group.

S3: The README phrase is now "poses are first estimates". Against e2437f94, this phrase removes estimated and replaces the banned noun.
The other words of that table row stay unchanged. The phrase of pre-review 2 and a change of the banned noun alone cannot both hold.
The lead accepts that the line now also drops the word estimated.

S4: The evidence names the lead and the README decision.
S5: The evidence says that each test fails and names both titles with the words without a warning.
S6 and S7: The proposal names Windsor alone and gives the warning text and error causes in separate sentences.
S8 and S9: Console names have code marks. The limits name text that code writes directly to the streams and both Node versions.

S10 to S12: The evidence distinguishes code files, log files and console channels.
S13: The no-error item has an "At Pass 5," prefix because C1 changes its scope.
S14: The glossary row for fixture names the function in each Ontario test file.
S15: The Windsor file has a label for its Pass 5 hash block. The evidence names the new log file and equal input hashes.
S16 to S17: The evidence names the old dependency link, the proposal draft, branch ranges and proposal section titles.

### S18: The automatic test copy

The first line of automatic-phase1-host.log names /tmp/ont-pass5-tree as the root of the automatic run.
Pass 6 compares both test files at that root with the live test files. The differences are not only a title rename.
Both copies have five console channels and text-only lists. The live tests have six channels and channel-text pairs.

The Key copy has the old HTTP title. The Rows copy has the old Roadway title.
The full diff output follows. The automatic-results.json record stays unchanged. These differences do not prove equal assertions.

```diff
Command: diff -u /tmp/ont-pass5-tree/src/data/cctvOntarioKey.test.mjs src/data/cctvOntarioKey.test.mjs
--- /tmp/ont-pass5-tree/src/data/cctvOntarioKey.test.mjs	2026-10-08 20:41:33.665557113 -0400
+++ src/data/cctvOntarioKey.test.mjs	2026-10-08 21:10:32.639429362 -0400
@@ -20,11 +20,12 @@
     if (response instanceof Error) throw response;
     return response;
   });
-  t.mock.method(console, 'warn', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'log', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'error', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'info', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'debug', (...args) => logs.push(args.join(' ')));
+  t.mock.method(console, 'warn', (...args) => logs.push(['warn', args.join(' ')]));
+  t.mock.method(console, 'log', (...args) => logs.push(['log', args.join(' ')]));
+  t.mock.method(console, 'error', (...args) => logs.push(['error', args.join(' ')]));
+  t.mock.method(console, 'info', (...args) => logs.push(['info', args.join(' ')]));
+  t.mock.method(console, 'debug', (...args) => logs.push(['debug', args.join(' ')]));
+  t.mock.method(console, 'dir', (...args) => logs.push(['dir', args.join(' ')]));
   return { ...ontarioRequest, calls, logs };
 }

@@ -51,7 +52,7 @@
   const f = await fixture(t, undefined, { ok: true, json: async () => [] });
   let nested;
   t.mock.method(console, 'warn', (...args) => {
-    f.logs.push(args.join(' '));
+    f.logs.push(['warn', args.join(' ')]);
     if (f.logs.length === 1) nested = f.readOntarioCameraRows();
   });
   for (const value of [undefined, '', '   ']) {
@@ -62,11 +63,11 @@
   }
   await nested;
   assert.equal(f.calls.length, 0);
-  assert.deepEqual(f.logs, ['[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.']);
+  assert.deepEqual(f.logs, [['warn', '[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.']]);
   ontarioRequest._resetOntarioRequestForTest();
   f.logs.length = 0;
   assert.deepEqual(await f.readOntarioCameraRows(), []);
-  assert.deepEqual(f.logs, ['[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.']);
+  assert.deepEqual(f.logs, [['warn', '[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.']]);
 });

 test('[live-sources-004] write one warning for an invalid key', async (t) => {
@@ -79,7 +80,7 @@
   );
   let nested;
   t.mock.method(console, 'warn', (...args) => {
-    f.logs.push(args.join(' '));
+    f.logs.push(['warn', args.join(' ')]);
     if (f.logs.length === 1) nested = f.readOntarioCameraRows();
   });
   assert.deepEqual(await f.readOntarioCameraRows(), []);
@@ -87,7 +88,7 @@
   assert.deepEqual(await f.readOntarioCameraRows(), []);
   assert.equal(f.calls.length, 3);
   assert.deepEqual(f.logs, [
-    '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
+    ['warn', '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.'],
   ]);
   assert.equal(f.logs.join().includes(key), false);
 });
@@ -108,7 +109,7 @@
     assert.deepEqual(await f.readOntarioCameraRows(), []);
     assert.equal(f.logs.join().includes(key), false);
     assert.deepEqual(f.logs, [
-      '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
+      ['warn', '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.'],
     ]);
     assert.deepEqual(await f.readOntarioCameraRows(), []);
     assert.equal(f.logs.length, 1);
@@ -149,18 +150,18 @@
   const { loadOntarioSourcesFromOpenData } =
     await import('../../server/providers/cctv/sources.js');
   assert.deepEqual(await loadOntarioSourcesFromOpenData(), []);
-  assert.deepEqual(f.logs, ['[CCTV] Ontario 511 camera data has an error.']);
+  assert.deepEqual(f.logs, [['warn', '[CCTV] Ontario 511 camera data has an error.']]);
   assert.equal(f.logs.join().includes(key), false);
 });

-test('[live-sources-004] return an empty list for an HTTP error with JSON rows', async (t) => {
+test('[live-sources-004] return an empty row list for an HTTP error with JSON rows', async (t) => {
   const f = await fixture(t, key, {
     ok: false,
     json: async () => [{ Id: 455 }],
   });
   assert.deepEqual(await f.readOntarioCameraRows(), []);
   assert.deepEqual(f.logs, [
-    '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
+    ['warn', '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.'],
   ]);
   assert.equal(f.logs.join().includes(key), false);
 });
@@ -200,7 +201,7 @@
   const f = await fixture(t, key, new Error('Request for ' + key + ' failed'));
   assert.deepEqual(await f.readOntarioCameraRows(), []);
   assert.deepEqual(f.logs, [
-    '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
+    ['warn', '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.'],
   ]);
   assert.equal(f.logs.join().includes(key), false);
 });
```

```diff
Command: diff -u /tmp/ont-pass5-tree/src/data/cctvOntarioRows.test.mjs src/data/cctvOntarioRows.test.mjs
--- /tmp/ont-pass5-tree/src/data/cctvOntarioRows.test.mjs	2026-10-08 21:13:42.527498118 -0400
+++ src/data/cctvOntarioRows.test.mjs	2026-10-08 21:10:42.642093362 -0400
@@ -32,11 +32,12 @@
     ok: true,
     json: async () => rows,
   }));
-  t.mock.method(console, 'log', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'error', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'info', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'debug', (...args) => logs.push(args.join(' ')));
-  t.mock.method(console, 'warn', (...args) => logs.push(args.join(' ')));
+  t.mock.method(console, 'log', (...args) => logs.push(['log', args.join(' ')]));
+  t.mock.method(console, 'error', (...args) => logs.push(['error', args.join(' ')]));
+  t.mock.method(console, 'info', (...args) => logs.push(['info', args.join(' ')]));
+  t.mock.method(console, 'debug', (...args) => logs.push(['debug', args.join(' ')]));
+  t.mock.method(console, 'dir', (...args) => logs.push(['dir', args.join(' ')]));
+  t.mock.method(console, 'warn', (...args) => logs.push(['warn', args.join(' ')]));
   return loadOntarioSourcesFromOpenData();
 }
 const rowCauses = [
@@ -314,7 +315,7 @@
     ),
     [],
   );
-  assert.deepEqual(logs, ['[CCTV] Ontario 511 camera data has an error.']);
+  assert.deepEqual(logs, [['warn', '[CCTV] Ontario 511 camera data has an error.']]);
   assert.equal(logs.join().includes('FAKE_ROW_KEY'), false);
 });

@@ -375,7 +376,7 @@
 test('[live-sources-006] return an empty source list for null ID fields', async (t) => {
   assert.deepEqual(await load(t, [row({ Id: null, id: null })]), []);
 });
-test('[live-sources-007] use the Roadway text first and the view description after a blank Direction value', async (t) => {
+test('[live-sources-007] use the capitalized Roadway text and the view description after a blank Direction value', async (t) => {
   const [source] = await load(t, [
     row({
       Roadway: ' Upper road ',
@@ -405,7 +406,7 @@
   rows.push(row({ Id: '0' }));
   assert.equal((await load(t, rows, '8', logs)).length, 8);
   assert.deepEqual(logs, [
-    '[CCTV] Loaded Ontario 511 camera sources: 9 enabled (using nearest 8)',
+    ['log', '[CCTV] Loaded Ontario 511 camera sources: 9 enabled (using nearest 8)'],
   ]);
 });

@@ -428,7 +429,7 @@
     [],
   );
   assert.deepEqual(logs, [
-    '[CCTV] Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)',
+    ['log', '[CCTV] Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)'],
   ]);
 });

@@ -487,7 +488,7 @@
     [],
   );
   assert.deepEqual(logs, [
-    '[CCTV] Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)',
+    ['log', '[CCTV] Loaded Ontario 511 camera sources: 0 enabled (using nearest 0)'],
   ]);
 });
 for (const title of [
@@ -597,7 +598,7 @@
   assert.equal(result.length, 1);
   assert.equal(result[0].id, 'on-1');
   assert.deepEqual(logs, [
-    '[CCTV] Loaded Ontario 511 camera sources: 1 enabled (using nearest 1)',
+    ['log', '[CCTV] Loaded Ontario 511 camera sources: 1 enabled (using nearest 1)'],
   ]);
 });

@@ -644,13 +645,13 @@
     if (value === undefined) delete process.env.ONTARIO_511_API_KEY;
     else process.env.ONTARIO_511_API_KEY = value;
     const logs = [];
-    for (const channel of ['warn', 'log', 'error', 'info', 'debug']) {
-      t.mock.method(console, channel, (...args) => logs.push(args.join(' ')));
+    for (const channel of ['warn', 'log', 'error', 'info', 'debug', 'dir']) {
+      t.mock.method(console, channel, (...args) => logs.push([channel, args.join(' ')]));
     }
     t.mock.method(globalThis, 'fetch', async () => ({ ok: false }));
     const { readOntarioCameraRows } =
       await import('../../server/providers/cctv/ontarioRequest.js');
     assert.deepEqual(await readOntarioCameraRows(), []);
-    assert.deepEqual(logs, [warning]);
+    assert.deepEqual(logs, [['warn', warning]]);
   });
 }
```

### Host checks

Command: python /tmp/pass6-check.py
The loop ran 25 files, one process per file, under taskset -c 8-11 nice -n 19.
In the Ontario files, 12 and 71 tests passed, 83 in all. The sandbox denied three local socket tests in the media range file.
The loop then stopped at its total assertion. It gave no all-pass result and ran no later checks.

The host repeat of that file passed all 21 tests. In the final set, 336 tests pass and none fail.
The original checks.json keeps the sandbox results. test-summary.json records the host repeat separately.

```json
{
  "files": 25,
  "tests": 336,
  "sandboxPass": 333,
  "sandboxFail": 3,
  "hostRepeat": {
    "tests": 21,
    "pass": 21,
    "fail": 0
  },
  "finalPass": 336,
  "finalFail": 0
}
```

Command: python /tmp/pass6-finish.py
This command runs the other format, boundary, title and OpenSpec checks.
Each command and its output has a file in evidence/pass6.

### Limits

No worker ran a Docker, make, ratchet, gate, ledger, archive, push, gh or review command in Pass 6.
The lead ran the console probe in the base image (C2).
After Pass 6, the lead ran the automatic mutations on the live tests on the host (see the last block of this pass).
The host checks give no Docker image gate verdict.

### Final text checks

The title script excludes diff records of old text. It checks 83 live titles and 14 current references and finds zero stale labels.
The verb script checks 83 bodies. Its one item is the absent-key test, which sets no key and asserts the literal warning.
The added text has no banned-word match. The search covered the owner's prefixed forms.

The format check passes: "Checked 1159 source files." OpenSpec show gives valid JSON. OpenSpec validate says the change is valid.

The diff of the proposal section titles is empty against d0b0c776. The diff for src, server and scripts is also empty.
The search output in corrections-search.log shows the three no-error clauses, five Pass 4 channels and task sections 7, 8 and 9.
The prose lint passes with zero errors and 542 warnings after the paragraph corrections.

The package boundary check completed with exit code 0. Its output lists all package groups in boundaries.log.

### Automatic mutations on the live tests

The Pass 5 automatic mutations ran on a test copy from before the Pass 5 channel changes, as the S18 diff above shows.
After Pass 6, the lead ran the same 140 mutations again on a new copy of the live tree at commit 4f0be16d.

The file automatic-live-copy-check.log shows that the copy has the same two Ontario test files and the same two server files as the live tree.
The command lines are in automatic-phase1-live.log and automatic-phase2-live.log.
They use the same mutants.json file, the same two test files, one job and cores 8 to 11.

Phase 1 kills 131 mutations, and nine survive. Phase 2 runs all 83 live tests for each of the nine survivors, and all nine survive.
The survivors are h43, h44, h91, h103, h104, h113, h126, h127 and h130.
The file automatic-live-compare.log compares the 149 records with the Pass 5 records. The status of each record is the same.

The live tests do not contradict the Pass 5 equivalence claims for these nine survivors: the same nine survive.
The lead did not run the equivalence probes again.

The command line has the option --commit ede1c684.
The option is a label of the results file only; the copy is at commit 4f0be16d.


## Pass 7

Tree read: `731ae58318635cd98e66f50c9bd85c1d97c7fb45`, branch `fix-ontario-511-key`, with the Pass 7 text changes.
The five pre-review folders, README, code, tests, scripts and trace files stay unchanged.

### Corrections of pre-review 5

E1 and S1: The README decision now uses the past tense and an "At Pass 5," prefix.
The lead accepts that the README line drops the word estimated.
E2 and S7: The Limits paragraph of Pass 6 names the worker.
The lead ran the console probe in the base image and the host mutations.

E3: Pass 7 adds evidence/pass6/console-probe-image.err and evidence/pass6/console-probe-image-command.txt.
The first file is empty. The second file names the command, the name and ID of the base image, and the exit code.

E4: automut.mjs stores the value of the --commit option in the results file.
When a run resumes, automut.mjs compares that value with the new option. The option does not select a commit. The evidence names the label ede1c684 and the copy commit 4f0be16d.

E5: Past facts have Pass 5 or Pass 6 markers. Known limits name the CI version with no console probe.
E6: The lead accepts the channel gap by name in Known limits. The scenario text stays unchanged.

E7: The Pass 5 evidence, commit 33118620 and codex-6.txt show no order for the changes to the tests and the changes to the scenario text. The lead decides in review.md whether to accept this limit by name.
The task boxes stay in their current order.

S2 to S6 and S8 to S21: The text uses the glossary terms, correct S labels and past-pass markers.
The glossary defines host and fixture. The request helper, the reset hook and the fixture have separate names.
The Windsor limit names the anchor that moves. The sentence about the nine survivors states only what the live tests show.

### Host checks

The command output is in evidence/pass7. Each test file runs in one process under taskset -c 8-11 nice -n 19.
No worker runs Docker, make, ratchet, ledger, archive, push, gh or review commands in Pass 7.
The host results give no Docker image gate verdict or review verdict.

The 25-file loop stopped at its total assertion after three socket errors. It ran no later checks.
In the Ontario files, 12 and 71 tests passed, 83 in all. The sandbox set has 333 tests that pass.

The host repeat of the media range file passed all 21 tests.
These 21 tests include the three tests that the sandbox denied. In the final set, 336 tests pass.

The original checks.json keeps the sandbox results. media-range-host.log records the host repeat.

The text search checks the new lines and the owner's prefixed forms.
At Pass 5, the lead chose the words of the README line. The table line Spec minor: README of the table Corrections of pre-review 3 and the paragraph after that table record this choice.
The search excludes file names from the check for the word image without Docker.


The format check prints "Checked 1159 source files." OpenSpec show prints JSON, and OpenSpec validate says the change is valid.
The proposal section titles do not differ from 731ae583.
The design adds the section Pass 7 words. The evidence adds the section Pass 7.
The diff against 731ae583 for src, server and scripts is empty.

The first title script lists two old titles inside the S18 diff record.
The current-title check excludes those diff records. It checks 83 titles and 14 references with zero stale labels.
The verb script reads 83 test bodies. Its one item is the absent-key test that asserts the literal warning.
The correction search lists the new text in corrections-search.log.

The final prose lint prints "STE: 0 errors, 540 warnings."

## Pass 8

Tree read: `3ac3af223da36067a6bef8cdeacb6cbd4d36d9c4`, branch `fix-ontario-511-key`, with the Pass 8 text changes.
The change stays active. Pass 8 changes no README, code, test, server, script, trace file or review report.

### Corrections of pre-review 6

P1: The loader sentence names calls from the catalog and the cache that is not empty.
The empty cache does not meet that condition. At Pass 9, catalog.js lines 156 to 201, lines 245 to 257 and constants.js line 248 support these sentences.

P2: The channel limit names only the clauses at spec.md lines 21, 29, 31 and 83.
The tests assert the two channels. The lead accepts the gap.
Pass 8 moves the reference to spec.md lines 21, 29 and 31 into its own sentence, so that no sentence has more than 25 words.
Pass 8 writes log line in place of count line to match the glossary.

P3: At Pass 9, the CI limit names the Node versions of the CI matrix and the newest Node 26 release.
P4: At Pass 9, Known limits state that the evidence does not show the order of the Pass 5 changes. These changes concern the tests and the scenario text.

P5: The glossary adds base image and anchor. The host row distinguishes a URL host name.
The records of the probe name the base image. The Pass 3 and Pass 3B records stay unchanged.

P6: The reset hook and fixture have separate names. The coverage gate still counts the reset hook.
P7: The task and evidence state that the live automatic mutations ran after Pass 6.

P8: The other text corrections name the request, commit option, test totals and past-pass facts.
The STE corrections split a long sentence and two long paragraphs. Past run counts and command output stay unchanged.

### Host checks

The command output is in evidence/pass8. Each Ontario test file ran in one process under taskset -c 8-11 nice -n 19.
The key file passed 12 tests. The rows file passed 71 tests. All 83 tests passed.

The title script found 83 live titles, 14 references and zero stale labels.
The verb script read 83 bodies. Its one item names the absent-key test, which asserts the literal warning.
The search found zero banned words or prefixed forms in the new text.
corrections-search.log shows the corrected sentences and the references to code files and to documents.

The other matches for the word routes are a file name and old command output. At Pass 10, no current text uses the name test function for the reset hook or the fixture.

OpenSpec show printed JSON. OpenSpec validate printed "Change 'fix-ontario-511-key' is valid".
The proposal section titles do not differ from 3ac3af22. The diff for README.md, src, server and scripts against that commit is empty.

Pass 8 did not run the 25-file set because no code or test changed.
No Docker, make, ratchet, gate comparison, mutation, ledger, archive, push, gh or review command ran in Pass 8.
The host checks give no coverage, Docker gate or review verdict.

The format check printed "Checked 1159 source files."
The final prose lint printed "STE: 0 errors, 542 warnings."
The final status check found no ignored file in the change folder.

## Pass 9

Tree read: `73bf05b3d758ff44272a1eecff2efdcc6fd98975`, branch `fix-ontario-511-key`, with the Pass 9 text changes.
The change stays active.

### Corrections of pre-review 7

Q1: The CI text names both matrix versions and the newest Node 26 release.
The text follows ci.yml lines 23 and 57.

Q2: Both notes say that Pass 6 found the test copy fault in the Pass 5 run.

Q3: The design names the reset hook as the subject of both sentences.
The Pass 3B record keeps its text. One new sentence gives the glossary name at Pass 9.

Q4: The text names section titles, the cache of the catalog and the output of the probe.
The other STE corrections add articles, name the objects and remove the false sentence about P1 and P2.
No separate index file exists for these logs. Pass 9 removes the sentence about index entries.

Q5: The catalog citation includes lines 245 to 257, which keep the cache and set its time.
The proposal names the empty cache case and the path of the spec of this change.
The request clauses are at lines 21, 29 and 31 of that spec. The loader clause is at line 83.

The spec path stays in a separate sentence to meet the 25-word limit.
Paragraph breaks keep the Pass 3B record and the Pass 5 record within the six-sentence limit.

### Host checks

The command output is in evidence/pass9.
Each Ontario test file ran once in its own process under taskset -c 8-11 nice -n 19.
The key file passed 12 tests. The rows file passed 71 tests. All 83 tests passed.

The title script found 83 live titles, 14 references and zero stale labels.
The verb script read 83 bodies. Its one item names the absent-key test, which asserts the literal warning.

OpenSpec show printed JSON. OpenSpec validate printed "Change 'fix-ontario-511-key' is valid".
The first format run stopped at "spawnSync git EPERM". That run gives no format verdict.
The host retry printed "Checked 1159 source files."

The search found no banned word or prefixed form in the new text.
The three searches for the old CI terms and section title term found no match before this block.
corrections-search.log shows the corrected sentences after the edits.
The check of the files reads ci.yml, catalog.js, the spec clauses and design.md lines 80 to 90.

The proposal section titles do not differ from 73bf05b3.
The diff for README.md, src, server and scripts against that commit is empty.

Prose lint found paragraph errors in two runs (three errors in all). Paragraph breaks correct each error.
The final prose lint printed "STE: 0 errors, 540 warnings."
The status check found no ignored file in the change folder. The diff for the filed review reports is empty.

Pass 9 did not run the 25-file set because no code or test changed.
No Docker, make, ratchet, gate comparison, mutation, ledger, archive, push, gh or review command ran in Pass 9.
The host checks give no coverage, Docker gate or review verdict.

## Pass 10

### Corrections of pre-review 8

Tree read: `12e359c7d9f3b4e0e1e3bc959d2e04f82a142cac`, branch `fix-ontario-511-key`, with the Pass 10 text changes.

| Finding | Correction |
|---|---|
| R1 README | The note on the README sentence names a table line and a table. It gives no line number. |
| R2 Counts | The lint count names two runs and three errors. |
| R3 Cache | The proposal names the cache that is not empty and the new refresh that an empty cache starts. |
| R4 Copy | One note names the Pass 5 automatic mutation run. |
| R5 Names | The Pass 9 text has "At Pass 9," prefixes. The notes on the reset hook use one name. The Pass 3B text "test helper" stays as a record. |
| R6 Objects | The notes on the check of the files and on the paragraph breaks name the files and the paragraphs. |

```text
Command: git rev-parse HEAD
12e359c7d9f3b4e0e1e3bc959d2e04f82a142cac

Command: taskset -c 8-11 nice -n 19 node --test --test-isolation=none src/data/cctvOntarioKey.test.mjs
ℹ tests 12
ℹ pass 12
ℹ fail 0

Command: taskset -c 8-11 nice -n 19 node --test --test-isolation=none src/data/cctvOntarioRows.test.mjs
ℹ tests 71
ℹ pass 71
ℹ fail 0

Command: python3 /tmp/pass10-titles.py
{
  "live_titles": 83,
  "references": 14,
  "flags": []
}

Command: taskset -c 8-11 nice -n 19 openspec validate fix-ontario-511-key
Change 'fix-ontario-511-key' is valid

Command: git diff 12e359c7 -- README.md src server scripts

Command: git diff 12e359c7 -- openspec/changes/fix-ontario-511-key/review
```

[OpenSpec show output](evidence/pass10/openspec-show.json)

[Output of the first OpenSpec show command: it stopped with MODULE_NOT_FOUND and gives no verdict](evidence/pass10/openspec-show-first.log)

[Section-title diff](evidence/pass10/section-titles.diff)

[Text search output](evidence/pass10/text-search.json)

[Correction search output](evidence/pass10/corrections-search.log)

[Prose lint output](evidence/pass10/lint-final.log)

[Output of the status check for ignored files](evidence/pass10/status-ignored.log)


[Output of the search for the reset hook name](evidence/pass10/test-function-search.log)

No Docker, make, ratchet, gate comparison, mutation, ledger, archive, push, gh or review command ran in Pass 10.

## Pass 11

### Corrections of pre-review 9

Tree read: `96ccff93b30a23f7954f1a50edd9e7753d93195f`, branch `fix-ontario-511-key`, with the Pass 11 text changes.

| Finding | Correction |
|---|---|
| S1 | Both notes name the test copy from before the Pass 5 channel changes. Pass 11 deletes the false scratch tree sentence. |
| S2 | The proposal names the cache that is not empty and the two loader cases without scenarios. |
| S3 | The README note names the Pass 5 choice and the table that records it. |
| S4 | The cache and order notes use clear words. P9 becomes P8. The links name each command. |
| S5 | Pass 10 has a correction title, tree commit, labels and command records. The script and search output are in evidence/pass10. |

No Docker, make, ratchet, gate comparison, mutation, ledger, archive, push, gh or review command ran in Pass 11.

```text
Command: taskset -c 8-11 nice -n 19 node --test --test-isolation=none src/data/cctvOntarioKey.test.mjs
ℹ tests 12
ℹ pass 12
ℹ fail 0

Command: taskset -c 8-11 nice -n 19 node --test --test-isolation=none src/data/cctvOntarioRows.test.mjs
ℹ tests 71
ℹ pass 71
ℹ fail 0
```

[Key test output](evidence/pass11/cctvOntarioKey.test.log)

[Rows test output](evidence/pass11/cctvOntarioRows.test.log)

[First group lint output](evidence/pass11/lint-group-first.log)

[Corrected group lint output](evidence/pass11/lint-group-fixed.log)

[Final lint output](evidence/pass11/lint-final.log)

[OpenSpec show output](evidence/pass11/openspec-show.json)

[OpenSpec validate output](evidence/pass11/openspec-validate.log)

[Title check output](evidence/pass11/repeated-titles.json)

[Text check output](evidence/pass11/text-check.json)

[Diff of README.md, src, server and scripts](evidence/pass11/code.diff)

[Diff of the review reports](evidence/pass11/review.diff)

[Output of the status check for ignored files](evidence/pass11/status-ignored.log)

[Section-title diff](evidence/pass11/section-titles.diff)
