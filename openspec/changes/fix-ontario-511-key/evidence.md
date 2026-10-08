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

This HEAD request downloaded no image. Image content access: unverified.

The task used three GET requests and one HEAD request. No account or credential form opened.

## Fixture tests

Each test command uses taskset -c 0-3 nice -n 19 node --test --test-isolation=none with one file.

The command list and output are in `evidence/before.log` and `evidence/after.log`.

Before: 22 files, 248 tests, 245 passes, three failures.

After the first code group: 23 files, 254 tests, 251 passes, three failures.

All three failures come from sandbox EPERM on loopback listen calls in `cctvMediaRange.test.mjs`.

The host command for that file passed all 21 tests; `evidence/media-host.log` has the output.

The final Ontario file has eight tests, all pass. Thus the final CCTV total is 256 tests.

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

The lead must assess its existing gaps in the image. This task does not change other pack code to close those gaps.

The same coverage command for `src/data/cctvCalgary.test.mjs` gives these whole-file results:

| Tree | Lines | Branches | Functions |
|---|---:|---:|---:|
| Base commit | 51.91% | 47.59% | 69.23% |
| Base plus this change | 51.87% | 47.88% | 69.23% |

The logs are `evidence/sources-before.log` and `evidence/sources-after.log`.

## Named mutations

The command for each row is the Ontario fixture command above after the named source edit.

Each command returned status 1. The JSON files record the failed test names.

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

Both phases report zero crashes and zero timeouts. No candidate remains pending.

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

taskset -c 0-3 nice -n 19 openspec show fix-ontario-511-key --json prints JSON with one ADDED requirement.

taskset -c 0-3 nice -n 19 openspec validate fix-ontario-511-key reports that the change is valid.

The proposal headings match the five required headings in the nearby defect change.

The design, tasks and evidence use the same `## ` heading level as that change.

## Lead checks

The lead must run the ratchet and final gates in the Node image, then both reviews.

The host task does not archive the change or write `review.md`.

The final lint command reports zero errors and 540 warnings.

## Pass 2

Read tree commit: `05736e8268541d4deea3e6bbd11e8a80bb9aa32a`.

The first lead log line has the Docker wrapper with the ratchet argument.
The next line is `Command: ratchet`. That run stopped before the comparison end.
It reports 141 uncovered branches against a ledger limit of 107. It gives no final comparison verdict.

The host tests add backfill scenarios `live-sources-006` to `live-sources-009`.
Production code has no change in this pass.

### Branch table

Each title below has its scenario tag in the test file.
The table includes optional access, short circuit operands, guards and exception paths.
The shared guard at line 404 has the OR paths of its two operands.
The shared coordinate result at line 405 has the AND paths of its four operands.
The URL host guard has the OR and AND paths of its listed operands.

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

The table has 75 rows. The lcov branch count differs because V8 reports source ranges.

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
That row file has 49 tests. The key file has eight tests.

### Named faults

The command `python3 /tmp/ontario-named-final.py` creates `/tmp/ontario-named-final` from the read tree plus the new tests.
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
| host | [live-sources-006] reject URL 5 |
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
The heading search has the five required proposal headings in the current file and the adjacent measurement change.

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

Each phase reports zero crashes and zero timeouts. No candidate remains pending.
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
| on108 | EQUIVALENT. The native URL parser already converts the accepted host names to lower case. | Full row and key tests pass for each ID. |
| on118 on127 on773 on775 | EQUIVALENT. The native URL fields and host checks have no side effects. Any decode error and any failed host check return the same empty URL. | Full row and key tests pass for each ID. |
| on780 on781 on782 on783 on849 | EQUIVALENT. The ID rule rejects slash, question mark, hash and empty IDs. The path rule and decoder cannot supply an empty accepted ID. | Full row and key tests pass for each ID. |
| on275 on277 on280 on281 on852 | EQUIVALENT. The empty array find result and first item are undefined. The loader drops both null and undefined views. | Full row and key tests pass for each ID. |
| on244 on245 on267 on268 on355 on356 on367 on368 on392 on393 on417 on418 on439 on440 on503 on504 | EQUIVALENT. The ID guard drops null rows. The status filter drops null views. No later optional null path can occur. | Full row and key tests pass for each ID. |
| on448 on451 on452 | EQUIVALENT. The description is a private string. An empty description gives an empty label on each side of the condition. | Full row and key tests pass for each ID. |
| on854 on857 on869 on870 on872 on874 | EQUIVALENT. The moved private calculations use independent local values. They do not change the row values, source fields, errors or logs. | Full row and key tests pass for each ID. |

The hostname command uses node with --input-type=module and new URL for uppercase official and traveliq hosts.
`/tmp/ontario-host-probe.log` has `https: 511on.ca` and `https: a.traveliq.co`.

The raw candidate, result and output files record each source fault and each failed test title.
The final survivor file lists all 71 IDs. It has no unclassified survivor.

The final equivalent command completes all 71 probes. Each probe passes 65 row tests and eight key tests.
It reports 71 survivors, zero kills, zero crashes and zero timeouts. These passes support the EQUIVALENT claims above.

The last host test loop writes `/tmp/ontario-all-tests-last.log`.
A Python count of its test totals and exit lines reports 25 files, 326 tests, 326 passes and zero failures.
All 25 test processes have exit code 0. The row file has 65 tests.

The last format shim command and the last Prettier test-file command both return exit code 0.
The Prettier command states that all matched files use its code style.

The lead log QA line states that no script covers the capabilities of this change.
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
The proposal heading search has all five required headings. The known limits text has no change.

The stored logs have no spaces on empty lines. The source text, counts and test titles have no change.
