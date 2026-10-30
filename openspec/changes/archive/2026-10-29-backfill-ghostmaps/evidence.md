# GhostMaps evidence

Source commit: `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
Branch: `backfill-ghostmaps`.

## Results

The host suite passes 276 tests, with 275 tagged tests.
The delta contains 66 scenarios.
The mutation spec contains 430 cases: 410 killed cases and 20 documented equivalents.
The audit contains 170 rows, with 0 open rows.
The command below supplies these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round2.py
```

The audit command is in [evidence.md](evidence.md).

The original ledger contains 23 old GhostMaps tests.
The title sweep keeps every old name.
The original ledger comes from commit `b5a64127667c22af8c68b53706e9f27d866acac0`.
The measurement command reads that ledger with `git show`.

## Count changes

| Item | Before | After |
| --- | ---: | ---: |
| Tests | 275 | 276 |
| Tagged tests | 274 | 275 |
| Scenarios | 35 | 66 |
| Mutations | 386 | 430 |

The commands below supply these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/before-counts.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round2.py
```

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
The lead will repeat the ratchet because the scenario set changes.

## Review corrections

The [baseline results](review-reproductions.json) record each survivor before the test corrections.
The [mutation results](mutation-results.json) record each exact production edit and failed test after the corrections.
The report names no exact edit for F11.
Its reproduction sends the wrong file id through the supported route test.

| Finding | Mutation | Before | After | Failed test |
| --- | --- | --- | --- | --- |
| F1 | `R1F01-id` | SURVIVED | KILLED | `ghostmaps-032` |
| F1 | `R1F01-version` | SURVIVED | KILLED | `ghostmaps-032` |
| F2 | `R1F02-line` | SURVIVED | KILLED | `ghostmaps-030` |
| F2 | `R1F02-point` | SURVIVED | KILLED | `ghostmaps-030` |
| F2 | `R1F02-polygon` | SURVIVED | KILLED | `ghostmaps-030` |
| F2 | `R1F02-hole` | SURVIVED | KILLED | `ghostmaps-030` |
| F3 | `R1F03-stop` | SURVIVED | KILLED | `ghostmaps-020` |
| F4 | `R1F04-read` | SURVIVED | KILLED | `ghostmaps-022` |
| F4 | `R1F04-event` | SURVIVED | KILLED | `ghostmaps-024` |
| F5 | `R1F05-state` | SURVIVED | KILLED | `ghostmaps-024` |
| F6 | `R1F06-cleanup` | SURVIVED | KILLED | `ghostmaps-029` |
| F7 | `R1F07-values` | SURVIVED | KILLED | `ghostmaps-009` |
| F8 | `R1F08-shared` | SURVIVED | KILLED | `ghostmaps-027` |
| F9 | `R1F09-disk` | SURVIVED | KILLED | `ghostmaps-016` |
| F10 | `R1F10-commit` | SURVIVED | KILLED | `ghostmaps-014` |
| F11 | `R1F11-file` | SURVIVED | KILLED | `ghostmaps-037` |

The text below records the exact failed test names.

```text
R1F01-id :: [ghostmaps-032] The layer replaces a changed product after it adds the new data
R1F01-version :: [ghostmaps-032] The layer replaces a changed product after it adds the new data
R1F02-line :: [ghostmaps-030] The layer creates point line and polygon entities
R1F02-point :: [ghostmaps-030] The layer creates point line and polygon entities
R1F02-polygon :: [ghostmaps-030] The layer creates point line and polygon entities
R1F02-hole :: [ghostmaps-030] The layer creates point line and polygon entities
R1F03-stop :: [ghostmaps-020] The watcher coalesces checks and follows its start and stop state
R1F04-read :: [ghostmaps-022] The source returns the catalog and passes its signal
R1F04-event :: [ghostmaps-024] The stream reports the connection state for code 0
R1F05-state :: [ghostmaps-024] The stream reports the connection state for code 0
R1F06-cleanup :: [ghostmaps-029] entity construction failure releases parsed image URLs
R1F07-values :: [ghostmaps-009] field values and counts are bounded
R1F08-shared :: [ghostmaps-027] An inline style replaces the shared values
R1F09-disk :: [ghostmaps-016] the catalog survives a restart from disk, and upstream failures are reported
R1F10-commit :: [ghostmaps-014] a new commit is announced once, naming only the products that changed
R1F11-file :: [ghostmaps-037] The proxy waits for the first catalog and file check
```

The shared-style fixture gave the shared and inline styles the same id.
The inline style now uses an empty id, so the shared lookup keeps its own properties.

## Sweep results

- Catalog reads and event frames hold distinct products with literal expected metadata.
- Stream callbacks report state after the fake changes its state code.
- File requests record product ids and versions, and different editions produce different geometry.
- Entity assertions cover points, lines, polygon boundaries, holes and closed outlines.
- Image cleanup checks distinct URLs after parse cancellation, entity errors, late cancellation and product removal.
- Both watcher timer tests record cancellation of the active timer.
- The event route checks heartbeat timer cancellation and nonempty product frames.
- The cache cleanup test supplies distinct obsolete files.
- Field bounds cover every returned field, and card assertions cover every visible field.
- Marker cache assertions cover both point entities.
- Disk tests compare full product metadata with literal values.
- The tag sweep separates invalid input, route errors, absent data and valid catalog changes.

The [scenario links](test-links.json) list each scenario title and its tagged tests.
The source import sweep reads every repository test file.
It finds only the scoped test files for these production modules.

## Audit

The [audit data](audit.json) records each decision expression and loop.
The Markdown table is `/home/ianblenke/docker/gev-tools/ghostmaps/audit.md`.

Rows: 170. Tested: 151. Equivalent: 19. Default-value: 0. Open: 0.

The [design](design.md#equivalent-mutations) gives the public API proof for each equivalent mutation.

## Known limits

The branch at `src/layers/ghostMaps/index.js:404` cannot reach its early return.
The sole caller needs stable true host references.
Tests tried absent hosts, an absent viewer and repeated enable calls.

The branch at `src/layers/ghostMaps/index.js:405` cannot use its false result.
The sole caller sets a nonempty key immediately before the call.
Tests tried false pick ids, invalid indices and metadata changes during a pick.

The title sweep leaves the old catalog title without a tag because it contains the banned word `malformed`.
The owner forbids a change to that old title.

```text
src/layers/ghostMaps/catalog.test.mjs
oversized, empty, non-KMZ and malformed entries are skipped
```

The [proposal](proposal.md#known-limits) names browser limits for phone width, real horizon visibility, pixels and live repository data.
The browser script proves them.
Local tests prove the callback behavior and pushed product data with custom fakes.

## Decisions for the lead

These unchanged code limits describe commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
The [design](design.md#known-limits) records their source lines and local probes.

- A rejected data source attachment can leave its image URLs outside the product cache.
- A viewer can attach data after the layer calls `disable`.
- A catalog request can apply data after caller cancellation.
- A description with only excluded table rows can return their plain text.

No scenario states that the code must use those behaviors.

## Commands

These commands supply the import, statement audit, coverage and format results.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/imports-round2.py
cd /home/ianblenke/docker/gev-work/ghostmaps && node /home/ianblenke/docker/gev-tools/ghostmaps/inventory.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/audit-round2.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/coverage.py
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/spec/gates.mjs lint
```

The [measurement data](measurement.json) records the derived totals.
The coverage script starts one Node process at a time.
The full host test command writes the records for the measurement script.
The command starts with empty scratch record files.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --test-reporter=spec --test-reporter-destination=stdout --test-reporter=./scripts/spec/lib/trace-reporter.mjs --test-reporter-destination=/home/ianblenke/docker/gev-tools/ghostmaps/round2-records.jsonl server/providers/ghostMaps.test.mjs src/app/layers/ghostMaps.test.mjs src/layers/ghostMaps/{catalog,records,kml,source,lifecycle}.test.mjs
```

The mutation helper restores each source file after its test.
The [complete output](mutation-run.txt) records the final full pass.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_OPTIONS=--test-isolation=none NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/ghostmaps/node-cache python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/ghostmaps /home/ianblenke/docker/gev-tools/ghostmaps/muts.json
```

The early full passes stopped before completion during the pattern correction.
They give no verdict.
The final full pass checks each saved mutation against the final tests.

## Format and STE

The final command logs give the format and STE results.
Both standard format commands pass for 1673 source files.
The STE command reports 0 errors.
The correction does not run Docker, full gates or ratchet.
The lead owns the final gate and review verdicts.

## Final tree

This status describes the correction from the source commit.
The archived change already includes the capability spec and trace records.
This correction changes tests, archive files and the copied capability spec.
The production files and QA scripts match the source commit.
The trace files keep their bytes.
The command `git status --short` supplies the text below.

```text
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/audit.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/coverage.txt
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/design.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/evidence.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/measurement.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/mutation-results.json
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/proposal.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/specs/ghostmaps/spec.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/tasks.md
 M openspec/changes/archive/2026-10-29-backfill-ghostmaps/test-links.json
 M openspec/specs/ghostmaps/spec.md
 M server/providers/ghostMaps.test.mjs
 M src/layers/ghostMaps/catalog.test.mjs
 M src/layers/ghostMaps/kml.test.mjs
 M src/layers/ghostMaps/lifecycle.test.mjs
 M src/layers/ghostMaps/records.test.mjs
 M src/layers/ghostMaps/source.test.mjs
?? openspec/changes/archive/2026-10-29-backfill-ghostmaps/mutation-run.txt
?? openspec/changes/archive/2026-10-29-backfill-ghostmaps/review-reproductions.json
```
