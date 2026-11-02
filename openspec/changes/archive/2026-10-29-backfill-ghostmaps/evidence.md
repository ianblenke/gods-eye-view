# GhostMaps evidence

Source commit: `9714441e9f3cc9fe4348d09a63ddba7f31f538f8`.
Branch: `backfill-ghostmaps`.
This report describes the uncommitted correction after round two.

## Results

The host suite passes 285 tests, with 284 tagged tests.
The delta contains 68 scenarios.
The mutation spec contains 527 cases: 507 killed cases and 20 documented equivalents.
The audit contains 170 rows, with 0 open rows.

The systematic sweep checks 284 tests across 7 files.
The commands below supply these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/audit-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/sweep-round3.py
```

The original ledger contains 23 old GhostMaps tests.
The title sweep keeps every old name.
The measurement command reads that ledger with `git show`.
The ledger commit is `b5a64127667c22af8c68b53706e9f27d866acac0`.

## Count changes

| Item | Before | After |
| --- | ---: | ---: |
| Tests | 276 | 285 |
| Tagged tests | 275 | 284 |
| Scenarios | 66 | 68 |
| Mutations | 430 | 527 |

The commands below supply the values from the reviewed commit and the current files.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/count-before-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round3.py
```

## Review corrections

The [baseline results](review-reproductions.json) record each survivor before the test corrections.
The [mutation results](mutation-results.json) record each exact edit and failed test after the corrections.
The report supplies exact code edits for F3 through F7.
The F1 mutation adds a wait before the initial event response.
The F2 mutation clears the card on every chip change.
These two edits test the conditions that the report corrects.

| Finding | Mutation | Before | After | Test |
| --- | --- | --- | --- | --- |
| F1 | `R2F01-events` | SURVIVED | KILLED | [ghostmaps-067] The event route sends the current catalog before the first check completes |
| F2 | `R2F02-chip` | SURVIVED | KILLED | [ghostmaps-055] An inactive product chip keeps the current card when it becomes active |
| F3 | `R2F03-activate` | SURVIVED | KILLED | [ghostmaps-047] The card stays plain with an absent external host |
| F4 | `R2F04-tree` | SURVIVED | KILLED | [ghostmaps-058] The watcher handles a truncated tree |
| F5 | `R2F05-storage` | SURVIVED | KILLED | [ghostmaps-045] The layer reads the id list case from storage |
| F6 | `R2F06-id` | SURVIVED | KILLED | [ghostmaps-036] The proxy serves current file bytes and cache headers |
| F7 | `R2F07-commit` | SURVIVED | KILLED | [ghostmaps-052] The API token is absent |

Both plain-card cases assert that the card object lacks the activation and accessibility properties.
The extra case `SW3-plain-link` checks the absent-link branch.
The removal case `SW3-removal-request` checks that removal does not request replacement bytes.
The version condition names active products because the sync guard excludes inactive products.
F8 stays with the lead because this correction does not run the formal review or gates.

## Systematic sweep

The table is `/home/ianblenke/docker/gev-tools/ghostmaps/sweep-round3.md`.
Each row names a test and records checks for shapes a through f.
The table covers each scoped test file.
The JSON data in [audit.json](audit.json) includes the table data.

| Shape | Tests checked | Correction mutations |
| --- | ---: | ---: |
| a | 284 | 28 |
| b | 284 | 22 |
| c | 284 | 14 |
| d | 284 | 8 |
| e | 284 | 38 |
| f | 284 | 5 |

The sweep links 97 distinct correction mutations.
Some mutations test more than one shape.
The mutation results name the exact edits and failed tests.
Each corrected initial-card assertion also gets a mutation with its own test pattern.
The storage fake records its key for an assertion outside the catch block.
An assertion inside that fake alone cannot prove the key because the reader catches its error.

## Coverage

| File | Line % | Branch % | Function % |
| --- | ---: | ---: | ---: |
| `server/providers/ghostMaps.js` | 100.00 | 100.00 | 100.00 |
| `src/app/layers/ghostMaps.js` | 100.00 | 100.00 | 100.00 |
| `src/layers/ghostMaps/catalog.js` | 100.00 | 100.00 | 100.00 |
| `src/layers/ghostMaps/index.js` | 100.00 | 99.30 | 100.00 |
| `src/layers/ghostMaps/kml.js` | 100.00 | 100.00 | 100.00 |
| `src/layers/ghostMaps/records.js` | 100.00 | 100.00 | 100.00 |
| `src/layers/ghostMaps/source.js` | 100.00 | 100.00 | 100.00 |

The [coverage data](coverage.txt) records the exact command and test result for each file.
The host uses Node `v26.12.1`.
Host coverage does not state a gate verdict.

## Audit

Rows: 170. Tested: 151. Equivalent: 19. Default-value: 0. Open: 0.

The [audit data](audit.json) records each decision expression, loop, test and mutation.
The table is `/home/ianblenke/docker/gev-tools/ghostmaps/audit.md`.
The [design](design.md#equivalent-mutations) gives the public API proof for each equivalent case.
The [scenario links](test-links.json) list every scenario title and each tagged test.

## Known limits

No input can reach the early return at `src/layers/ghostMaps/index.js:404`.
The sole caller needs stable true host references.
Tests tried absent hosts, an absent viewer and repeated enable calls.

No input can reach the false result at `src/layers/ghostMaps/index.js:405`.
The sole caller sets a nonempty key immediately before the call.
Tests tried false pick ids, invalid indices and metadata changes during a pick.

The old catalog title stays without a tag because it contains the banned word `malformed`.
The owner forbids a change to that old title.

```text
src/layers/ghostMaps/catalog.test.mjs
oversized, empty, non-KMZ and malformed entries are skipped
```

The [proposal](proposal.md#known-limits) records browser limits for phone width, real horizon visibility, pixels and live repository data.
Local tests use custom fakes.

## Decisions for the lead

These code limits describe commit `9714441e9f3cc9fe4348d09a63ddba7f31f538f8`.
The [design](design.md#known-limits) records their source lines and local probes.

- A rejected data source attachment can leave its image URLs outside the product cache.
- A viewer can attach data after the layer calls `disable`.
- A catalog request can apply data after caller cancellation.
- A description with only excluded table rows can return their plain text.

No scenario states that the code must use those behaviors.

## Commands

The full test command writes fresh records for the measurement and sweep scripts.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && rm -f /home/ianblenke/docker/gev-tools/ghostmaps/round3-records.jsonl /home/ianblenke/docker/gev-tools/ghostmaps/round3-records.jsonl.sync
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --test-reporter=spec --test-reporter-destination=stdout --test-reporter=./scripts/spec/lib/trace-reporter.mjs --test-reporter-destination=/home/ianblenke/docker/gev-tools/ghostmaps/round3-records.jsonl server/providers/ghostMaps.test.mjs src/app/layers/ghostMaps.test.mjs src/layers/ghostMaps/{catalog,records,kml,source,lifecycle}.test.mjs
```

These commands supply the import, statement, test-body and coverage data.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/imports-round2.py
cd /home/ianblenke/docker/gev-work/ghostmaps && node /home/ianblenke/docker/gev-tools/ghostmaps/inventory.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && node /home/ianblenke/docker/gev-tools/ghostmaps/round3-test-bodies.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/coverage.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-coverage-round3.py
```

The import sweep resolves relative paths in every repository test file.
It finds the scoped test files for these production modules.
The coverage script starts one Node process at a time.

The [complete mutation output](mutation-run.txt) records the final full pass.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_OPTIONS=--test-isolation=none NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/ghostmaps/node-cache PYTHONUNBUFFERED=1 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/ghostmaps /home/ianblenke/docker/gev-tools/ghostmaps/muts.json
```

The first full pass checks the earlier event assertion.
The next full pass stops before completion during the sweep.
It gives no verdict.
The final full pass repeats every case after the sweep corrections.

The case `SW3-event-send` delays the bytes but keeps the catalog read at once.
The event test checks the actual chunks before it completes the first check.
The map tests distinguish later map ids and normal pairs after highlight pairs.

The card fields hold distinct values.
The application card test supplies distinct picked ids and source URLs.

The pick and overlay fakes check coordinates and source ids.
The default fetch tests check their options.
The signal test checks the value and the object that owns its property.
The later commit tests distinguish both API metadata and raw URLs.

The geometry tests distinguish point positions and valid polygon holes.
The visibility tests use text `0` and text `1`.
The far pin test checks pin state before attachment.
The cache test rejects extra file requests for current products.

The early sweep kept a wrong storage key.
The corrected assertion kills that mutation.

The [baseline data](review-reproductions.json) also records the map, card, callback and collection checks.
The initial horizon control already fails before the new assertion of initial state.
The final full pass checks each saved mutation against the final tests.

## Format and STE

The first format command stopped at `spawnSync git EPERM` before it gave a verdict.
The next format commands passed with permission for the child Git command.
The format logs record 1673 source files.
The direct test format check also passed.
The final STE command reports 0 errors.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/ghostmaps && node ../node_modules/prettier/bin/prettier.cjs --check server/providers/ghostMaps.test.mjs src/app/layers/ghostMaps.test.mjs src/layers/ghostMaps/{catalog,records,kml,source,lifecycle}.test.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/spec/gates.mjs lint
```

The correction does not run Docker, gates or ratchet.
It does not make a commit.
The lead owns the final gate and review verdicts.

## Final tree

The final change from `03be515c` changes tests, archive files, the capability spec and four trace files.
This correction from `9714441e` does not edit the trace files.
The production files and QA scripts match both source commits.
The scope check records the Git commands that prove those claims.
The command `git status --short` supplies the text below.

```text
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/audit.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/coverage.txt
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/design.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/evidence.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/measurement.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/mutation-results.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/mutation-run.txt
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/proposal.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/review-reproductions.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/specs/ghostmaps/spec.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/tasks.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/test-links.json
 M openspec/specs/ghostmaps/spec.md
 M server/providers/ghostMaps.test.mjs
 M src/app/layers/ghostMaps.test.mjs
 M src/layers/ghostMaps/catalog.test.mjs
 M src/layers/ghostMaps/kml.test.mjs
 M src/layers/ghostMaps/lifecycle.test.mjs
 M src/layers/ghostMaps/records.test.mjs
 M src/layers/ghostMaps/source.test.mjs
```

## Scope commands

Round 3 adds one test for `ghostmaps-050`. The test places two pins on opposite sides of the planet and moves the camera. The reviewer names the mutation `R3F01-position`, which gives each pin the position of the first pin. The new test fails under this mutation, and the lead restores the production file. The 527 cases of the mutation spec do not include this mutation.

The commands below check each claim about the source files and trace files.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && git branch --show-current
cd /home/ianblenke/docker/gev-work/ghostmaps && git diff --name-only HEAD -- server/providers/ghostMaps.js src/app/layers/ghostMaps.js src/layers/ghostMaps/catalog.js src/layers/ghostMaps/index.js src/layers/ghostMaps/kml.js src/layers/ghostMaps/records.js src/layers/ghostMaps/source.js scripts/qa-*.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && git diff --name-only 03be515c -- server/providers/ghostMaps.js src/app/layers/ghostMaps.js src/layers/ghostMaps/catalog.js src/layers/ghostMaps/index.js src/layers/ghostMaps/kml.js src/layers/ghostMaps/records.js src/layers/ghostMaps/source.js scripts/qa-*.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && git diff --name-only HEAD -- openspec/trace/
cd /home/ianblenke/docker/gev-work/ghostmaps && git diff --name-only 03be515c HEAD -- openspec/trace/
cd /home/ianblenke/docker/gev-work/ghostmaps && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/ghostmaps && git status --short
```
