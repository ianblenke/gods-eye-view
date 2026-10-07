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
The panel test fails because the panel restores the body scroll position to zero after the scroll request.

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
The earlier Python mutation command reports 20 entries in `cont-mutations.log`.
Each entry gives KILLED because a repository test fails.
The log reports no survivor.

| Scenario | Mutation | Failed test |
| --- | --- | --- |
| `recent-imagery-050` | `050-no-restore` | the body scroll position stays after content updates |
| `recent-imagery-053` | `053-no-delete` | the loader starts a new fetch after an external AbortError |
| `recent-imagery-053` | `053-delete-new` | an old fetch cannot remove a new entry |
| `recent-imagery-053` | `053-delete-proof` | a day with present proof keeps its proof after a loader cancellation |
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
The continuation mutation command reports 20 KILLED results with no survivor.

The direct format commands stop with the operation error (EPERM).
The host adapter reports 1158 source files for each format command.
The logs `evidence/cont-format-write.log` and `evidence/cont-format-check.log` supply those results.
The final lint reports zero errors.
The final predispatch summary contains no finding.

## Corrections of review round 1

The base commit is `81b8bd6`.
The worker read the working tree of the lead.
The command `git rev-parse HEAD` supplies that reference.
The host uses Node `v26.8.2`, from `node --version`.
The round 1 logs are in `evidence/`.

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
The first panel command without the host isolation setting stopped before it gave test results.
That command gave no individual test results.
The first card-method test recorded its setup value in the scroll log.
The corrected test resets that log before the click.

The coverage commands use one test file and one production file per process.
The union command uses `coverage-cont.mjs` and the directory `r1-single-v8`.
The log `r1-single-counts.log` supplies these values.

| Production file | Lines | Branches | Functions |
| --- | --- | --- | --- |
| `src/layers/recentImagery/model.js` | 622/622 | 238/240 | 64/64 |
| `src/layers/recentImagery/thumbnails.js` | 284/284 | 99/100 | 25/25 |
| `src/ui/recentImagery.js` | 1079/1079 | 483/485 | 76/78 |

The branch gaps stay at 2, 1, and 2.
The panel function gap stays at 2.
All line gaps stay at zero.
The values in the after columns of the earlier table in `cont-formatted-counts.log` match these values.
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
| 22 | `055-no-height-guard` | Change the viewport height guard to `false` | a viewport height of zero keeps the body scroll position |
| 23 | `055-no-rectangle-guard` | Change the card method guard to `false` | a card without a getBoundingClientRect method keeps the body scroll position |
| 24 | `056-sparse-ring` | Change `Array.from(ring).every` to `ring.every` | a footprint with an absent point gives unknown coverage |
| 25 | `053-aborted-signal` | Cancel the controller before the fetch | the loader starts a new fetch after an external AbortError |

The mutation of the footprint with an absent point fails the repository test.
The base returns unknown coverage.

The signal state assertion now runs outside the loader catch block.
The signal mutation causes that repository test to fail.
The DETAILS test uses the open state for its rectangle height.
Other tests keep their helper.
All tests tagged 050 assert the body scroll position.

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


## Corrections of review round 2

The base commit is `81b8bd6`.
The worker read the working tree of the lead at Git current commit `ee1b35ee8c2e9074366530346f761fc2ddda5680`.
The command `git rev-parse HEAD` supplies the current commit.
The production files stay unchanged from that commit.
The command `git diff --exit-code HEAD` with the three production paths confirms that result.

### Tests and coverage

The command `node --test` uses one test file per process and no force-exit option.
The host isolation option comes from NODE_OPTIONS.
The logs `evidence/r2-final-*.log` supply these values.

| Test file | Tests | Passed | Failed |
| --- | ---: | ---: | ---: |
| `catalog.test.mjs` | 19 | 19 | 0 |
| `index.test.mjs` | 182 | 182 | 0 |
| `model.test.mjs` | 63 | 63 | 0 |
| `rendering.test.mjs` | 23 | 23 | 0 |
| `testDoubles.test.mjs` | 6 | 6 | 0 |
| `thumbnails.test.mjs` | 25 | 25 | 0 |
| `src/ui/recentImagery.test.mjs` | 127 | 127 | 0 |

The first six files are in `src/layers/recentImagery/`.
The coverage command uses each test file with each production file in a separate process.
The union command reads `r2-single-v8`.
The log `evidence/r2-single-counts.log` supplies these values.

| Production file | Lines | Branches | Functions |
| --- | --- | --- | --- |
| `src/layers/recentImagery/model.js` | 622/622 | 238/240 | 64/64 |
| `src/layers/recentImagery/thumbnails.js` | 284/284 | 99/100 | 25/25 |
| `src/ui/recentImagery.js` | 1079/1079 | 483/485 | 76/78 |

The gap probe uses the same V8 union method as the coverage library.
The log `evidence/r2-gap-probe.log` compares the round 1 and round 2 panel gaps.
The branch gaps stay at lines 122 and 896.
The function gaps stay at lines 183 and 269.
Each branch of revealCard receives coverage.
No gap grows.

### NaN and content-update probes

The base-code probe reads the model from commit `81b8bd6`.
The log `evidence/r2-base-probe.log` records the results.
The two NaN latitude cases give partial and full coverage in the base code.
The NaN longitude case gives partial coverage in the base code.
All three now give unknown coverage.

The source search shows that coversBox rejects only partial coverage.
Thus only an old partial result changes tier when it becomes unknown.

The content-update probe uses row `055-scroll-on-content` and the repository test of an open DETAILS card.
The probe command uses `node --test --test-name-pattern` with that row pattern and test file.
The log `evidence/r2-content-probe.log` records the exact assertion failure.
The actual body scroll position is 20, and the requests are `[20]`.
The test expects a body scroll position of 10 and requests `[]`.
The production file returns to its original text after the probe.

### New tests and mutation rows

The two new tests carry `recent-imagery-055`.
The height test removes clientHeight and uses a card top of -10 pixels.
The card-inside-view test uses a card top of 10 pixels and a height of 20 pixels.
Both tests expect a body scroll position of 40 and no scroll request.
The scroll spy kills the zero-delta mutation through the extra write of 40.
That mutation is not equivalent.

| Row | ID | Code change | Failed test |
| --- | --- | --- | --- |
| 26 | `055-undefined-height` | Change the height guard to `height === 0` | a scroller without a viewport height value keeps the body scroll position |
| 27 | `055-scroll-on-content` | Move the scroll request into `render()` | an open DETAILS card does not request scroll again |
| 28 | `055-no-clamp` | Remove `Math.max(0, ...)` | a card inside the view keeps the body scroll position |
| 29 | `055-zero-delta-write` | Change `if (delta)` to `if (true)` | a card inside the view keeps the body scroll position |

The zero-height test and card-method test use the same terms as the scenario.
Rows 22 and 23 test those guards.
The open-state card test now also carries `recent-imagery-050`.
Row 21 tests its scroll request order.
The thumbnail test names and their document links use the same terms.

The proposal names `qa-details-scroll` because the browser QA script sets its own scroll position.
The source search confirms the product readers, rank rule, ledger values, and QA limit.

### Round 2 commands

Each shell command first changes to the clone directory.
Each Node and Python process uses `taskset -c 12-15` and `nice -n 19`.
The test_file values are the seven paths in the test table.
The production_file values are the three paths in the coverage table.
The commands below show the full forms.

```sh
cd /home/ianblenke/docker/gev-work/fix-ri && git rev-parse HEAD
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none NODE_V8_COVERAGE=/home/ianblenke/docker/gev-tools/fix-ri/r2-single-v8 taskset -c 12-15 nice -n 19 node --test --test-force-exit --experimental-test-coverage --test-coverage-include="$production_file" --test-coverage-exclude='**/*.test.mjs' "$test_file"
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ri/coverage-cont.mjs /home/ianblenke/docker/gev-tools/fix-ri/r2-single-v8
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ri/r2-gap-probe.mjs
cd /home/ianblenke/docker/gev-work/fix-ri && git show 81b8bd6:src/layers/recentImagery/model.js > /home/ianblenke/docker/gev-tools/fix-ri/r2-base-model.mjs
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/fix-ri/r2-base-probe.mjs
cd /home/ianblenke/docker/gev-work/fix-ri && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/fix-ri /home/ianblenke/docker/gev-work/fix-ri/openspec/changes/fix-recent-imagery-defects/evidence/muts.json
cd /home/ianblenke/docker/gev-work/fix-ri && cmp openspec/changes/fix-recent-imagery-defects/evidence/muts.json /home/ianblenke/docker/gev-tools/fix-ri/muts.json
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/fix-recent-imagery-defects
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n 'PRODUCTS\[|coversBox' src/layers/recentImagery/{catalog,rendering,index,model}.js src/ui/recentImagery.js
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n ais-store openspec/trace/history.jsonl
cd /home/ianblenke/docker/gev-work/fix-ri && rg -n 'scrollTop|DETAILS|header' scripts/qa-recent-imagery.mjs
cd /home/ianblenke/docker/gev-work/fix-ri && git diff --exit-code HEAD -- src/layers/recentImagery/model.js src/layers/recentImagery/thumbnails.js src/ui/recentImagery.js
cd /home/ianblenke/docker/gev-work/fix-ri && git diff --name-only HEAD
```


### Final results of round 2

The complete mutation command records 29 KILLED results and no survivor.
Each result comes from a repository test failure.
The log `evidence/mutations-final.log` contains only the final complete command results.
The log `evidence/r2-row-audit.log` records the row and source-match audit.
The audit command uses Python with `r2-row-audit.py`.
The command `cmp` confirms that the two mutation files match.

The direct format command stops with `spawnSync git EPERM`.
The host adapter completes both format commands for 1158 source files.
The logs `evidence/r2-format-write.log` and `evidence/r2-format-check.log` supply those results.
The final lint and predispatch logs record their results.
The final source search records the corrected terms and test tags.

Corrections A and C give exact AND text.
Those lines keep that text instead of the general panel-agent form in correction D.
All other requested STE edits receive corrections.
The base spec, trace files, QA scripts, and review folder stay unchanged.
The ratchet, full gates, browser QA, and round 3 reviews remain for the lead.
No commit or push occurs in this round.


The probe sources also exist in `evidence/` as text files.
Those copies supply the source for the scratch commands.
The content probe uses the same test command as its first form.

```sh
cd /home/ianblenke/docker/gev-work/fix-ri && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/fix-ri/r2-row-audit.py
```
