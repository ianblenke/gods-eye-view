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
| Spec major 2 | At Pass 4, both fixtures watch warn, log, error, info and debug. Scenarios 004 and 005 name console channels and state that no thrown error escapes the pack. |
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
The scratch tree has no branch. It copies this code and the Pass 5 tests.
Pass 5 changes no production code. The three pre-review folders and the trace files stay unchanged.

### Corrections of pre-review 3

| Finding | Correction |
|---|---|
| Spec major 1 and F1 | Both fixtures record pairs of console method and text. Each warning and source count assertion checks both values. |
| Spec major 2 and STE major 3 | Both fixtures also replace console.dir. The glossary names the six methods. The spec and tasks use those terms. |
| STE majors 1 and 2 | The Roadway title names the capitalized field. The requirement names the key twice, with no unclear pronoun. |
| Spec minor: README | The CCTV table line has the words from e2437f94, with only the banned noun replaced by first estimates. |
| Spec minor: Windsor record | The old log has a Pass 5 note, the removed line and input hashes. The new run repeats the old test that passes. |
| Spec minor: Pass 4 count | The record states why the three layer files and their 16 tests did not run at Pass 4. |
| Spec minor: past counts | The Pass 3 counts and final campaign claims have Pass 3 markers. The old numbers stay unchanged. |
| Spec minor: anchor limits | Known limits name a seventh distant anchor and a move of less than about 3 kilometers. |
| Spec minor: empty list | Scenario 004 and its HTTP error test name the empty row list. |
| Spec minor: unrun channel cases | The named runs include debug, log and dir in the request catch, and error and dir in the loader catch. |
| STE part 2 | The spec names status text, letter case, field choice, the loader result and the view description. Error throw checks have separate items. |
| Other STE part 2 | Impact names three other functions. Known limits state the warning advice and the removed HTTP status log. |
| STE part 3 | The evidence uses mutation, test bodies and time markers. CURRENT-STATE loses the repeated date. README names the key. |
| Past image word | Known limits accept image in the Pass 3 and Pass 3B records by name. Those records stay unchanged. |

The README line follows decision A4. It keeps the old count and the old sentence form.
Decision A4 takes precedence over the STE replacement for that line.
The old source at e2437f94 writes resp.status through console.warn when the Ontario response is not OK.

### Red runs for the console method checks

The named.py command changes one scratch file, runs one test file and restores the source for each mutation.
Each test command uses taskset -c 8-11 nice -n 19 node --test --test-isolation=none and a test name pattern.
All 14 runs return exit code 1. Each fails the test below. The logs show the assertion differences.
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
Mutation D fails both tests with without a warning in their titles.
The pairs restore the method distinction that Pass 4 lost.

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

The fixture watches table, group labels, count, timeLog and timeEnd indirectly through console.log.
It watches trace through console.error and a failed assert through console.warn.
The host dirxml writes directly to stdout. The six mocks do not watch that method.
GroupEnd, a valid countReset and time write no text in this probe.

Direct writes to process.stdout and process.stderr are not console channels. The fixtures do not watch those writes.
The lead must check these routes on Node 24.14.0.

### Old Windsor case

The windsor.py command loads the old Rows test from commit 1911403e and removes the Windsor anchor on a scratch copy.
The new run is windsor-old-rerun.log. It records both input hashes and this removed line:

```js
{ lat: 42.3149, lon: -83.0364 }, // Windsor
```

The old scenario 008 test still passes. The Pass 4 record has the same input data as a new Pass 5 note.

### Runs that stopped

The first scratch copy stopped at a stale node_modules link. It gave no test result.
The first automatic command stopped at the child baseline with no test output. It gave no mutation verdict.

The sandbox check loop had three listen EPERM failures in the media range file.
The loop then stopped during the format command. It gave no format verdict and no completed loop total.
The host commands repeat these checks.

The first limit paragraph has nine sentences. The prose lint reports one error for that paragraph.
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
The four Ontario functions have 87 branch ranges. None has a zero count.
The host probe gives no Docker image gate verdict.

### Automatic mutations

Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/gen.mjs
The generator selects the request helper and the changed loader catch.
Its output is:

```json
{"helper":131,"catch":9,"total":140}
```

The automut command uses root /tmp/ont-pass5-tree, the Pass 5 mutants.json file and one job.
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

The repeated title script reads 83 live titles and checks 14 current references. It reports zero flags.
The clause script reads all 83 test bodies. It reports one absent-key fixture flag.
That fixture sets no key value and asserts the literal absent-key warning from its table.

The script also names D-invalid and D-numeric for the two titles with without a warning.
Both named runs fail on the method pair assertion.

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

The section title diff keeps all proposal headings.
Design changes Pass 4 words to Pass 5 words. Evidence adds Pass 5. No other section title changes.

The server diff against 05736e82 matches the Pass 4 server diff byte for byte.
It shows only the Ontario comment, reset hook and two warning strings.
Pass 5 adds no server change.

### Limits of this pass

No Docker command, make command, ratchet, gate comparison, ledger change, archive, push, gh command or review command ran.
The lead must run the Node 24.14.0 Docker image checks and both reviews before merge.
The host results do not replace those checks.
