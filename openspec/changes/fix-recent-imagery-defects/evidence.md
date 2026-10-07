## Source

The original source commit is `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02`.
The command `node --version` gives host version `v26.8.2`.
The measurements use the branch with the code changes in this directory.
The command logs in `evidence/` record the results.
The mutation file also exists at `/home/ianblenke/docker/gev-tools/fix-ri/muts.json`.

## Tests before code

The logs with the prefix `red-` show test failures against the old production code.
The model tests fail for parent product keys and invalid footprint coordinates.
The thumbnail tests fail for the stale entry after an external AbortError.
The panel test fails because DETAILS restores zero after the scroll request.

## Earlier test results

The command uses no force-exit option and tests one file per process.

| Test file | Tests | Passed | Failed |
| --- | ---: | ---: | ---: |
| `src/layers/recentImagery/catalog.test.mjs` | 19 | 19 | 0 |
| `src/layers/recentImagery/index.test.mjs` | 182 | 182 | 0 |
| `src/layers/recentImagery/model.test.mjs` | 62 | 62 | 0 |
| `src/layers/recentImagery/rendering.test.mjs` | 23 | 23 | 0 |
| `src/layers/recentImagery/testDoubles.test.mjs` | 6 | 6 | 0 |
| `src/layers/recentImagery/thumbnails.test.mjs` | 25 | 25 | 0 |
| `src/ui/recentImagery.test.mjs` | 125 | 125 | 0 |

The logs with the prefix `cont-final-` supply the table values.

## Coverage

The coverage commands test each area file in a separate process.
The union command combines the V8 data through `scripts/spec/lib/v8-merge.mjs`.
The logs `evidence/cont-before-counts.log` and `evidence/cont-formatted-counts.log` supply the values.
The before values include the four defect corrections but still include the divisor default.
The after values exclude that default.

| Production file | Lines before / after | Branches before / after | Functions before / after |
| --- | --- | --- | --- |
| `src/layers/recentImagery/model.js` | 623/623 / 622/622 | 238/241 / 238/240 | 64/64 / 64/64 |
| `src/layers/recentImagery/thumbnails.js` | 284/284 / 284/284 | 99/100 / 99/100 | 25/25 / 25/25 |
| `src/ui/recentImagery.js` | 1079/1079 / 1079/1079 | 483/485 / 483/485 | 76/78 / 76/78 |

The model branch gap decreases from 3 to 2.
The thumbnail branch gap stays at 1.
The panel branch gap stays at 2, and its function gap stays at 2.
All line gaps stay at zero.
Each remaining gap matches the ledger.
The divisor decision records the proof for removal of the divisor default.

## Earlier mutations

The JSON file `evidence/muts.json` names each exact production edit and each test file.
The log `evidence/cont-mutations.log` names the failed tests.
The Python command below reads the mutation file and reports 20 entries.
Each entry gives KILLED because a repository test fails.
The log reports no survivor.

| Scenario | Mutation | Failed test |
| --- | --- | --- |
| `recent-imagery-050` | `050-no-restore` | the body scroll position stays after content updates |
| `recent-imagery-053` | `053-no-delete` | the loader starts a new fetch after an external AbortError |
| `recent-imagery-053` | `053-delete-new` | an old fetch cannot remove a new entry |
| `recent-imagery-053` | `053-delete-proof` | a present day keeps proof after a loader cancellation |
| `recent-imagery-053` | `053-delete-success` | the loader starts a new fetch after an external AbortError |
| `recent-imagery-054` | `054-own` | the model rejects parent product keys |
| `recent-imagery-054` | `054-group` | the model rejects parent product keys |
| `recent-imagery-054` | `054-rank` | the model rejects parent product keys |
| `recent-imagery-054` | `054-readout` | the model rejects parent product keys |
| `recent-imagery-054` | `054-gibs` | the model rejects parent product keys |
| `recent-imagery-054` | `054-wvs` | the model rejects parent product keys |
| `recent-imagery-054` | `054-no-products` | absent lists and footprints have known results |
| `recent-imagery-055` | `055-no-scroll-request` | the panel shows the DETAILS card when DETAILS opens |
| `recent-imagery-055` | `055-close-scroll-request` | DETAILS does not move the body when it closes |
| `recent-imagery-055` | `055-restore` | the panel shows the DETAILS card when DETAILS opens |
| `recent-imagery-056` | `056-lon` | the invalid coordinates give unknown coverage |
| `recent-imagery-056` | `056-lat` | a latitude that is not finite gives unknown coverage |
| `recent-imagery-056` | `056-every` | a latitude that is not finite gives unknown coverage |
| `recent-imagery-056` | `056-array` | coverage samples the box corners and centre against the union of footprints |
| `recent-imagery-056` | `056-length` | a short polygon alone gives unknown coverage |

The parent getter test proves that the model does not read parent product values.

## Commands

Each shell command starts in the clone directory.
The test and coverage loops use one process per file.

```sh
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 openspec new change fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --test --test-isolation=none "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --test --test-isolation=none --test-force-exit --experimental-test-coverage --test-coverage-include="$production_file" --test-coverage-exclude='**/*.test.mjs' "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/fix-ri /home/ianblenke/docker/gev-tools/fix-ri/muts.json
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 python3 -c "import json; print(len(json.load(open('/home/ianblenke/docker/gev-tools/fix-ri/muts.json'))))"
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```

The direct format command stops with `spawnSync git EPERM`.
The host adapter completes both format commands.
The lint reports zero errors and gives warnings for old prose.
The predispatch summary contains no finding.
The ratchet, complete gates, reviews, and commits remain for the lead.

## Continuation commands

The source commit remains `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02`.
The Git current commit (HEAD) supplies the source reference.
The source search finds one caller of the model function and no export.
The other source files contain separate polygon functions.

```sh
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n pointInPolygon src
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_V8_COVERAGE="$data_dir" taskset -c 12-15 nice -n 19 node --test --test-isolation=none --test-force-exit --experimental-test-coverage "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ri/coverage-cont.mjs /home/ianblenke/docker/gev-tools/fix-ri/cont-before-v8
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ri/coverage-cont.mjs /home/ianblenke/docker/gev-tools/fix-ri/cont-formatted-v8
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/fix-ri && git diff --name-only HEAD
```

The coverage commands use all seven test files from the table.
The test commands without force-exit supply the test totals.
The mutation command tests all rows again and reports 20 KILLED results with no survivor.

The direct format commands stop with the operation error (EPERM).
The host adapter reports 1158 source files for each format command.
The logs `evidence/cont-format-write.log` and `evidence/cont-format-check.log` supply those results.
The final lint reports zero errors.
The final predispatch summary contains no finding.

## Corrections of review round 1

The tree read is commit `c913d8cf820a0d3947a0f5b120449f1946e3544e`.
The command `git rev-parse HEAD` supplies that reference.
The host uses Node `v26.8.2`, from `node --version`.
The round 1 logs are in `/home/ianblenke/docker/gev-tools/fix-ri/`.

The test commands use `NODE_OPTIONS=--test-isolation=none` and no force-exit option.
Each process tests one file.
The logs with the prefix `r1-final-` supply these results.

| Test file | Tests | Passed | Failed |
| --- | ---: | ---: | ---: |
| `catalog.test.mjs` | 19 | 19 | 0 |
| `index.test.mjs` | 182 | 182 | 0 |
| `model.test.mjs` | 63 | 63 | 0 |
| `rendering.test.mjs` | 23 | 23 | 0 |
| `testDoubles.test.mjs` | 6 | 6 | 0 |
| `thumbnails.test.mjs` | 25 | 25 | 0 |
| `src/ui/recentImagery.test.mjs` | 125 | 125 | 0 |

The first six test files are in `src/layers/recentImagery/`.
The first panel command without the host isolation setting failed at the test-process boundary.
That command gave no individual test results.
The first absent rectangle test recorded its setup value in the scroll log.
The corrected test resets that log before the click.

The coverage commands use one test file and one production file per process.
The union command uses `coverage-cont.mjs` and the directory `r1-single-v8`.
The log `r1-single-counts.log` supplies these values.

| Production file | Lines | Branches | Functions |
| --- | --- | --- | --- |
| `src/layers/recentImagery/model.js` | 622/622 | 238/240 | 64/64 |
| `src/layers/recentImagery/thumbnails.js` | 284/284 | 99/100 | 25/25 |
| `src/ui/recentImagery.js` | 1079/1079 | 483/485 | 76/78 |

The branch gaps stay at 2, 1, and 2; the panel function gap stays at 2.
All line gaps stay at zero.
The earlier after values in `cont-formatted-counts.log` match these values.
The ledger gaps do not grow.

### Round 1 commands

```sh
cd /home/ianblenke/docker/gev-work/fix-ri && git rev-parse HEAD
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --version
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none NODE_V8_COVERAGE=/home/ianblenke/docker/gev-tools/fix-ri/r1-single-v8 taskset -c 12-15 nice -n 19 node --test --test-force-exit --experimental-test-coverage --test-coverage-include="$production_file" --test-coverage-exclude='**/*.test.mjs' "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ri/coverage-cont.mjs /home/ianblenke/docker/gev-tools/fix-ri/r1-single-v8
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/fix-ri /home/ianblenke/docker/gev-work/fix-ri/openspec/changes/fix-recent-imagery-defects/evidence/muts.json
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n 'PRODUCTS\[|coversBox' src/layers/recentImagery/{catalog,rendering,index,model}.js src/ui/recentImagery.js
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n recent-imagery-050 src/ui/recentImagery.test.mjs
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n 'ais-store|aisStore' openspec/trace/history.jsonl
cd /home/ianblenke/docker/gev-work/fix-ri && git diff --name-only HEAD
```

The direct format command failed with `spawnSync git EPERM`.
The host adapter completed the write and check commands for 1158 source files.
The logs `r1-format-write.log` and `r1-format-check.log` supply those results.
The source search confirms the product readers and rank rule in the proposal.
The history search confirms the unrelated ledger values and their other changes.

The production diff from HEAD contains no change to code or comments.
The base requirement sentence and THEN line stay unchanged.
The scenario IDs stay at 050 and 053 through 056.

### Final mutation results

The log `r1-mutations-final.log` records the complete mutation command.
All 25 rows give KILLED from a repository test failure.
No row reaches a time limit or lacks a source match.
The two mutation files contain the same data.
The Python row audit below supplies the row total and checks each source match.

| Row | ID | Code change | Failed test |
| --- | --- | --- | --- |
| 21 | `055-scroll-before-render` | Move the scroll request before render | the panel shows the DETAILS card when DETAILS opens |
| 22 | `055-no-height-guard` | Change the viewport height guard to false | DETAILS without a viewport height keeps the body scroll position |
| 23 | `055-no-rectangle-guard` | Change the card rectangle guard to false | an absent card rectangle alone does not allow a scroll request |
| 24 | `056-sparse-ring` | Change Array.from(ring).every to ring.every | a footprint with an absent point gives unknown coverage |
| 25 | `053-aborted-signal` | Cancel the controller before fetch | the loader starts a new fetch after an external AbortError |

The sparse ring mutant fails the repository test; the base returns unknown coverage.
The signal state assertion now runs outside the loader catch block.
The signal mutation causes that repository test to fail.
The DETAILS test uses the open state for its rectangle height; other tests keep their helper.
Both tests tagged 050 assert the body scroll position.

```sh
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/fix-ri/r1-row-audit.py
cd /home/ianblenke/docker/gev-work/fix-ri && cmp openspec/changes/fix-recent-imagery-defects/evidence/muts.json /home/ianblenke/docker/gev-tools/fix-ri/muts.json
```

All round 1 findings receive corrections.
No STE correction needs an exception.
The base spec and trace files stay unchanged.
The lead must run the ratchet, full gates, and two reviews.
No commit or push occurs in this round.

The final lint command reports zero errors.
The final predispatch command reports no findings.
Their logs are `r1-final-lint.log` and `r1-final-predispatch.log`.
