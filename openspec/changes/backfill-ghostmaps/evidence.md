# GhostMaps evidence

Source commit: `b5a64127667c22af8c68b53706e9f27d866acac0`.
Branch: `backfill-ghostmaps`.

## Results

The host tests pass: 275 tests, with 274 tagged tests.
The delta contains 35 scenarios.
The ledger and title sweep finds 23 old tests and keeps every old name.
The commands below supply these values.

Every scoped file reaches full line and function coverage on the host.
The host uses Node `v26.11.1`.
The gate image can give different branch values.
The lead still needs the ratchet, gates and formal review.

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

The [coverage data](coverage.json) records each exact command and its test result.

## Paths that cannot run

The design records each [private card limit](design.md#known-limit-ghostmaps-private-card-paths).
The host reports no uncovered source line.
It reports these unreachable branch results:

| File and line | Path | Reason | Tests tried |
| --- | --- | --- | --- |
| `src/layers/ghostMaps/index.js:404` | The early return | The sole caller needs stable true host references. | Absent hosts, absent viewer and repeated enable calls |
| `src/layers/ghostMaps/index.js:405` | The false arm | The caller sets a nonempty key immediately before the call. | Invalid indices, false pick ids and metadata that removes the feature |

## Old title without a tag

The sweep finds 1 old test without a tag.
The title contains the banned word `malformed`.
The owner rule forbids a rename.
New metadata tests carry `ghostmaps-004`.

```text
src/layers/ghostMaps/catalog.test.mjs
oversized, empty, non-KMZ and malformed entries are skipped
```

## Mutations

The helper checked 386 saved mutations.
The latest results record 366 killed cases and 20 equivalent cases.
The [mutation results](mutation-results.json) give each id, file, exact code change and failed test name.
The [design](design.md#equivalent-mutations) gives the public API proof for each equivalent case.
The helper restores each production file after each test.

The product, label, color, entity, excluded-label and empty-value cases each select their own test.
The results name the failed test for each killed case.
The later loop cases keep only the first entry to check each other entry.

## Audit

The audit contains 170 rows.
Tested: 151. Equivalent: 19. Default-value: 0. Open: 0.

The [audit data](audit.json) records each statement, test and mutation.
The Markdown table also lives at `/home/ianblenke/docker/gev-tools/ghostmaps/audit.md`.

## Decisions for the lead

These limits describe commit `b5a64127667c22af8c68b53706e9f27d866acac0`.
The local probes confirm each behavior.
They do not add a scenario that states the behavior as a requirement.

- A rejected data source can leave image URLs outside the product cache, at `src/layers/ghostMaps/index.js:353`.
- A viewer can attach new data after `disable`, at `src/layers/ghostMaps/index.js:353`.
- A successful catalog request can apply data after caller cancellation, at `src/layers/ghostMaps/index.js:599`.
- A description with only excluded table rows can return their plain text, at `src/layers/ghostMaps/records.js:94`.

The design names these [known limits](design.md#known-limits).
The local probe log records the results in the scratch folder.

## Format and STE

Both standard format commands stopped before they gave a format verdict.
Each command reported `spawnSync git EPERM`.
The direct Prettier check passed for the changed test files.
STE lint reports 0 errors and 1164 warnings across the repository prose.
The title sweep reports no banned word or length error in a tagged title.

## Commands

The commands use the project directory.
The first command supplies the test, title, scenario and mutation values.
The next commands supply the statement audit and per-file coverage values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/sweep.py
cd /home/ianblenke/docker/gev-work/ghostmaps && node /home/ianblenke/docker/gev-tools/ghostmaps/inventory.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/audit.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 -u /home/ianblenke/docker/gev-tools/ghostmaps/coverage.py
```

The coverage script starts one Node process at a time.
Each command in the coverage data uses the coverage flags and the test files that load the target.

The mutation helper uses the saved spec and named tests.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/ghostmaps/node-cache NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/ghostmaps /home/ianblenke/docker/gev-tools/ghostmaps/muts.json
```

The checks below supply the format and prose results.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/ghostmaps && node ../node_modules/prettier/bin/prettier.cjs --check server/providers/ghostMaps.test.mjs src/app/layers/ghostMaps.test.mjs src/layers/ghostMaps/{catalog,records,kml,source,lifecycle}.test.mjs
cd /home/ianblenke/docker/gev-work/ghostmaps && node scripts/spec/gates.mjs lint --change backfill-ghostmaps 2>&1 | grep -E "^(ERROR|STE)"
```

The complete test command writes the trace records that the title sweep reads.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --test-reporter=spec --test-reporter-destination=stdout --test-reporter=./scripts/spec/lib/trace-reporter.mjs --test-reporter-destination=/home/ianblenke/docker/gev-tools/ghostmaps/records.jsonl server/providers/ghostMaps.test.mjs src/app/layers/ghostMaps.test.mjs src/layers/ghostMaps/{catalog,records,kml,source,lifecycle}.test.mjs
```

The scratch probes check the code limits without a network request.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit /home/ianblenke/docker/gev-tools/ghostmaps/limits.test.mjs
```

## Scenario links

The list gives each id, title and tagged test.
The [test links](test-links.json) supply the same data as JSON.

### ghostmaps-001: Read edition dates

```text
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-001] editions read the date and export/version number written in the name
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-001] The edition parser accepts an absent name
```

### ghostmaps-002: Select a product edition

```text
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] each product keeps its newest edition by date, then edition number
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects by path
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects by date over an undated file
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects by date over a later undated file
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects by edition
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects the cip product
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects the kinetic-30d product
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects the border-crisis product
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects the iran-cip product
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects the iran-kinetic product
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog selects the yemen-flot product
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-002] The catalog rejects a lower path after an undated edition
```

### ghostmaps-003: Select the latest incident

```text
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] latest drop is the newest dated incident file outside curated, archived and base data
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] The incident catalog excludes 0_Archive
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] The incident catalog excludes Basedata
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] The incident catalog excludes Reference Material
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] The incident catalog checks the root
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] The incident catalog checks the date
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] The incident catalog checks the older date
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-003] A newer incident replaces an older incident
```

### ghostmaps-004: Reject invalid entries

```text
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid tree
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid path
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid SHA
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid finite size
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid positive size
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid maximum size
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects an invalid extension
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-004] The catalog rejects a path object with a KMZ string value
```

### ghostmaps-005: Build file URLs

```text
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-005] raw URLs are pinned to the commit and encode every path segment
```

### ghostmaps-006: Read branch refs

```text
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-006] the branch head comes from the smart-HTTP ref advertisement
src/layers/ghostMaps/catalog.test.mjs :: [ghostmaps-006] The ref parser accepts an absent advertisement
```

### ghostmaps-007: Read table fields

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] ArcGIS popup tables become plain label/value fields and http links
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the shape label
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the objectid label
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the fid label
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the globalid label
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the empty label
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the empty value
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the &lt;null&gt; value
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the null value
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the n/a value
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the - value
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser excludes the &lt;blank&gt; value
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] The table parser keeps one copy of each valid link
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-007] A link table does not add a duplicate text field
```

### ghostmaps-008: Read free text

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-008] free-form descriptions become one unlabelled field; scripts are dropped
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-008] The text helper accepts absent markup
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-008] The text helper excludes script content
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-008] The description parser excludes rows inside script markup
```

### ghostmaps-009: Bound report fields

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-009] field values and counts are bounded
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-009] The parser caps source links and free text
```

### ghostmaps-010: Decode text

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] entities and tags decode to text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks lowercase hex
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks uppercase hex
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks decimal
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks zero
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks upper bound
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks low surrogate bound
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks high surrogate bound
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks below surrogate
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks above surrogate
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks unknown name
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks absent text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks amp
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks lt
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks gt
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks quot
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks apos
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-010] The decoder checks nbsp
```

### ghostmaps-011: Read KML colors

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-011] KML aabbggrr colors convert to rgba
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-011] The color parser accepts absent text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-011] The color parser returns the blue channel
```

### ghostmaps-012: Wrap card text

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-012] card text wraps on words, cuts long words and marks truncation
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-012] The wrapper places a short word before a long word
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-012] The wrapper accepts absent text and its default width
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-012] The wrapper checks the final line limit before it adds text
```

### ghostmaps-013: Format field labels

```text
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-013] CamelCase field labels read as words
src/layers/ghostMaps/records.test.mjs :: [ghostmaps-013] The label helper accepts absent text
```

### ghostmaps-014: Announce commits

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] a new commit is announced once, naming only the products that changed
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The API token is present
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The API token is absent
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] A subscriber error does not stop the next subscriber
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher handles invalid refs
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher handles invalid tree
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher handles commit error
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher handles truncated tree
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher handles invalid date
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher handles empty message
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] A disk write error does not stop catalog events
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The default helpers use fetch log and warning callbacks
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] A failed response tolerates a body cancel error
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The default token helper checks the present token
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The default token helper checks the absent token
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher records the message and date
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher records the empty message and date
server/providers/ghostMaps.test.mjs :: [ghostmaps-014] The watcher log names each changed product
```

### ghostmaps-015: Cache file bytes

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-015] files download by commit-pinned URL, cache by blob, and stale blobs are pruned
server/providers/ghostMaps.test.mjs :: [ghostmaps-015] The file cache keeps temporary files and current blobs
server/providers/ghostMaps.test.mjs :: [ghostmaps-015] A default file error does not reject the catalog check
server/providers/ghostMaps.test.mjs :: [ghostmaps-015] The file cache tolerates a readdir error
server/providers/ghostMaps.test.mjs :: [ghostmaps-015] The file cache tolerates a rm error
server/providers/ghostMaps.test.mjs :: [ghostmaps-015] The watcher warms only the default products
```

### ghostmaps-016: Restore the catalog

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-016] the catalog survives a restart from disk, and upstream failures are reported
server/providers/ghostMaps.test.mjs :: [ghostmaps-016] The disk catalog checks valid data
server/providers/ghostMaps.test.mjs :: [ghostmaps-016] The disk catalog checks invalid commit data
server/providers/ghostMaps.test.mjs :: [ghostmaps-016] The disk catalog checks invalid products data
```

### ghostmaps-017: Report recovery

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-017] an unchanged head clears an upstream outage and announces recovery once
```

### ghostmaps-018: Set the poll interval

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-018] poll interval is configurable with a 5 s floor
server/providers/ghostMaps.test.mjs :: [ghostmaps-018] The poll helper checks zero negative and fractional settings
```

### ghostmaps-019: Route local requests

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-019] routes: unknown paths and methods are refused without contacting GitHub
server/providers/ghostMaps.test.mjs :: [ghostmaps-019] The proxy serves current file bytes and cache headers
server/providers/ghostMaps.test.mjs :: [ghostmaps-019] The proxy waits for the first catalog and file check
server/providers/ghostMaps.test.mjs :: [ghostmaps-019] The proxy reports file errors
server/providers/ghostMaps.test.mjs :: [ghostmaps-019] A destroyed response does not receive JSON
server/providers/ghostMaps.test.mjs :: [ghostmaps-019] The proxy creates local routes before it starts the watcher
```

### ghostmaps-020: Schedule branch checks

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-020] The watcher coalesces checks and follows its start and stop state
server/providers/ghostMaps.test.mjs :: [ghostmaps-020] The watcher uses bounded failure delays
```

### ghostmaps-021: Send catalog events

```text
server/providers/ghostMaps.test.mjs :: [ghostmaps-021] The event route sends catalogs heartbeats and close callbacks
server/providers/ghostMaps.test.mjs :: [ghostmaps-021] The event route caps subscribers
```

### ghostmaps-022: Read the local catalog

```text
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022] The source returns the catalog and passes its signal
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022] The source rejects a catalog with an HTTP error
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022] The source rejects a catalog with null data
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022] The source rejects a catalog with absent products
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022] The source rejects a catalog with invalid products
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022 ghostmaps-023] The default source calls the global fetch helper
```

### ghostmaps-023: Read local file bytes

```text
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-023] The source encodes file values and returns bytes
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-023] The source rejects a file response error
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-022 ghostmaps-023] The default source calls the global fetch helper
```

### ghostmaps-024: Follow catalog events

```text
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-024] The stream reports the connection state for code 0
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-024] The stream reports the connection state for code 1
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-024] The stream reports the connection state for code 2
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-024] The stream reports the connection state for code 9
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-024] An absent event source reports a closed stream
src/layers/ghostMaps/source.test.mjs :: [ghostmaps-024] The stream accepts an absent state callback
```

### ghostmaps-025: Read coordinates

```text
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks finite longitude
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks finite latitude
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks north bound
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks south bound
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks east bound
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks west bound
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks bounds
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks altitude
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-025] The coordinate parser checks absent text
```

### ghostmaps-026: Read geometry

```text
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader accepts Point
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader accepts LineString
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader accepts LinearRing
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader accepts Polygon
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader accepts MultiGeometry
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader excludes an invalid point
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader excludes an invalid line
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader excludes an invalid polygon
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader excludes an invalid model
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader excludes an invalid network link
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader excludes hidden placemarks
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader uses the nearest named folder or document
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader caps report names and folder names
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-026] The reader accepts an absent document
```

### ghostmaps-027: Resolve styles

```text
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the line style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the polygon style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the polygon defaults style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the icon style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the icon defaults style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the invalid number style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader resolves the absent number style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the normal map
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the inline map
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the absent map id
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the absent normal pair
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the absent style id
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the remote style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the cycle
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the unknown style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader checks the absent style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] An inline style replaces the shared values
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The default resolver rejects an image URL
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] A style map without children gives an empty style
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-027] The reader accepts a null style URL from a custom element
```

### ghostmaps-028: Bound KML data

```text
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-028] The reader caps the feature total
src/layers/ghostMaps/kml.test.mjs :: [ghostmaps-028] The reader caps the position total
```

### ghostmaps-029: Own image URLs

```text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] cancelling a file read does not allocate packed-image URLs
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] cancellation during parsing releases every packed-image URL
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] entity construction failure releases parsed image URLs
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] A KMZ without a KML document reports an error
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] The layer frees constructed icons after the signal changes
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] The layer frees constructed icons after the disabled flag changes
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-029] The layer frees constructed icons after the old signal changes
```

### ghostmaps-030: Draw product geometry

```text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] successful load keeps icons until the product is disabled
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer creates point line and polygon entities
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer anchors a line at its mean coordinates
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer anchors a polygon at its mean coordinates
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer applies the line width
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer applies the polygon color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer applies the polygon fill
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer applies the polygon outline
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer checks the packed icon
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer checks the absent icon
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer checks the large icon
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer checks the maximum icon
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The layer uses a canvas marker and caches its image
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The horizon callback updates point visibility after a camera change
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The cip product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The kinetic-30d product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The border-crisis product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The iran-cip product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The iran-kinetic product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The yemen-flot product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The latest-drop product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030] The polygon alpha value takes precedence over the inherited color alpha
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-032 ghostmaps-034] The layer owns all products and all report records
```

### ghostmaps-031: Store product choice

```text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] A chip change stores the whole current selection
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The layer reads the empty list case from storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The layer reads the id list case from storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The layer reads the invalid JSON case from storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The layer reads the object case from storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The layer reads the blocked storage case from storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The default storage handles absent storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The default storage handles valid storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] The default storage handles blocked storage
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] A saved chip callback accepts an absent catalog after destruction
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-031] A stored object cannot use an inherited array method
```

### ghostmaps-032: Sync product data

```text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The layer replaces a changed product after it adds the new data
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] A disabled layer rejects updates and removes its records
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The layer rejects an absent catalog source
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] An aborted signal rejects the catalog update
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The layer rejects a late catalog after cancellation
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The layer rejects a late error after cancellation
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The layer rejects a signal error after cancellation
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The layer accepts an update before a viewer exists
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] A row callback error does not block the next catalog
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] A stale chip cannot load data without a catalog
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] A product getter can cancel before its file request
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] An absent viewer prevents access to catalog products
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] The disabled state prevents access to catalog products
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-032] A row callback can remove the catalog before synchronization
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-032 ghostmaps-034] The layer owns all products and all report records
```

### ghostmaps-033: Select report cards

```text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] A selected marker publishes a card and opens its source link
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card closes for the number pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card closes for the foreign prefix pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card closes for the lookalike prefix pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card closes for the absent index pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card closes for the empty ground pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card closes for the empty id pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The pointer owner and foreign picks keep the current card
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card uses the folder title
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card uses the default title
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card uses the custom product
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card caps fields and excludes the repeated feature name
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] A plain description gives an unlabelled card line
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] An absent overlayHost prevents card input
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] An absent screenSpaceEventHandlerFactory prevents card input
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] An absent pick registry prevents card input
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] A chip change removes the selected card
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] A custom catalog can remove the feature during a pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] A custom catalog can remove product metadata during a pick
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card stays plain with an absent link
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The card stays plain with an absent external host
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The application accepts an absent host
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The application accepts an absent factory
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The application accepts an absent registry
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The cip product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The kinetic-30d product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The border-crisis product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The iran-cip product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The iran-kinetic product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The yemen-flot product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The latest-drop product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] An invalid feature index prevents access to product metadata
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The layer does not create an input handler without a viewer
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] The layer keeps one input handler after a repeated enable call
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] An empty pick id does not call another owner
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] A false product value does not supply an inherited title
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-033] An absent product label stays empty with a custom locale
```

### ghostmaps-034: Report layer state

```text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-034] A file error uses its template
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-034] A file error uses its message
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-034] A file error uses its default text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-034] A catalog error uses its message
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-034] A catalog error uses its default text
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-034] The layer reports initial state and live stream data
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The cip product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The kinetic-30d product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The border-crisis product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The iran-cip product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The iran-kinetic product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The yemen-flot product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-033 ghostmaps-034] The latest-drop product uses its label and color
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-030 ghostmaps-032 ghostmaps-034] The layer owns all products and all report records
```

### ghostmaps-035: Connect the application layer

```text
src/app/layers/ghostMaps.test.mjs :: [ghostmaps-035] The application factory accepts a source and host options
src/app/layers/ghostMaps.test.mjs :: [ghostmaps-035] The application factory creates the standard input handler
src/layers/ghostMaps/lifecycle.test.mjs :: [ghostmaps-035] The application card opens the link through the window host
```

## Final tree

The final tree changes only test files and this change folder.
The production files and QA scripts match the source commit.
The command `git status --short` gives this result.

```text
 M server/providers/ghostMaps.test.mjs
 M src/layers/ghostMaps/catalog.test.mjs
 M src/layers/ghostMaps/lifecycle.test.mjs
 M src/layers/ghostMaps/records.test.mjs
?? openspec/changes/backfill-ghostmaps/
?? src/app/layers/ghostMaps.test.mjs
?? src/layers/ghostMaps/kml.test.mjs
?? src/layers/ghostMaps/source.test.mjs
```
