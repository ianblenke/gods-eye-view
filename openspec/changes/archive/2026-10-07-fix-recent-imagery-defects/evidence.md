## Source

The source commit is `81b8bd6c4eb9e2abae1cf6cc9a2447bc16accb02`.
The command `node --version` gives host version `v26.8.2`.
The measurements use the branch with the code changes in this directory.
The command logs in `evidence/` record the results.
The mutation file also exists at `/home/ianblenke/docker/gev-tools/fix-ri/muts.json`.

## Tests before code

The logs with the prefix `red-` show test failures against the old production code.
The model tests fail for parent product keys and invalid footprint coordinates.
The thumbnail tests fail for the stale entry after external AbortError.
The panel test fails because DETAILS restores zero after the card reveal.

## Final test results

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
D5 records the proof for removal of the divisor default.

## Mutations

The JSON file `evidence/muts.json` names each exact production edit and each test file.
The log `evidence/cont-mutations.log` names the failed tests.
The Python command below reads the mutation file and reports 20 entries.
Each entry gives KILLED because a repository test fails.
The log reports no survivor.

| Scenario | Mutation | Failed test |
| --- | --- | --- |
| `recent-imagery-050` | `050-no-restore` | the body scroll position survives content updates |
| `recent-imagery-053` | `053-no-delete` | a later request starts after external AbortError |
| `recent-imagery-053` | `053-delete-new` | an old fetch cannot remove a new entry |
| `recent-imagery-053` | `053-delete-proof` | a present day keeps proof after fetch cancellation |
| `recent-imagery-053` | `053-delete-success` | a later request starts after external AbortError |
| `recent-imagery-054` | `054-own` | the model rejects parent product keys |
| `recent-imagery-054` | `054-group` | the model rejects parent product keys |
| `recent-imagery-054` | `054-rank` | the model rejects parent product keys |
| `recent-imagery-054` | `054-readout` | the model rejects parent product keys |
| `recent-imagery-054` | `054-gibs` | the model rejects parent product keys |
| `recent-imagery-054` | `054-wvs` | the model rejects parent product keys |
| `recent-imagery-054` | `054-no-products` | absent lists and footprints have known results |
| `recent-imagery-055` | `055-no-reveal` | DETAILS keeps the card position |
| `recent-imagery-055` | `055-close-reveal` | DETAILS does not move the body when it closes |
| `recent-imagery-055` | `055-restore` | DETAILS keeps the card position |
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
