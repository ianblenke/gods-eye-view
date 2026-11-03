# Share codec evidence

Source commit: `4cf8e3706060658bf303d3d6e49643d0a4cb6a9f`.
The original host snapshot reads commit `5fd416b9ed4a80c9a1ceeded81836aa69f3ebc0c`.
Branch: `backfill-share-codec`.
At the host snapshot, the tests and delta were uncommitted.
The lead later ran the ratchet and archived the change.

## Current host results

The host suite passes 476 tests.
The scenario map records 475 tagged tests and 64 scenarios.
The mutation data records 1259 cases: 1151 fail and 108 give equivalent public results.
The audit records 347 rows with no open row.
The key matrix checks 427 separate cases.

The measurement and audit commands below supply these values.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/review-measure.py
cd /home/ianblenke/docker/gev-work/sharecodec && node /home/ianblenke/docker/gev-tools/sharecodec/test-audit.mjs
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/verify.py
cd /home/ianblenke/docker/gev-work/sharecodec && node /home/ianblenke/docker/gev-tools/sharecodec/worker-coverage.mjs
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/coverage-merge.py
```

The [measurement data](measurement.json) records each count, source hash and import path.
The [scenario map](test-links.json) lists every full test name under its scenario.
The [mutation data](mutation-results.json) records each id, file, exact edit, test pattern and result.

The correction check kills all cases in the [new mutation spec](review-mutations.json).
The [new output](review-mutation-run.txt) records that complete check.
The correction check does not repeat the original mutation suite.
The [audit](audit.md) records each decision and key loop.
The [test audit](test-audit.json) checks assertion methods and each tagged title against the word list.

## Old tests

The ledger at the original host snapshot records 59 old tests in this scope.
This change tags 58 old names and keeps every old title.
The measurement command reads the ledger with `git show`.
The [baseline data](baseline.json) lists every old name and each original coverage gap.
The legacy module contains no coverage gap entry in that ledger.
The host baseline reports full coverage for that module.

This old title keeps no tag because the word list bans `malformed`.
The owner forbids a change to its name.

```text
src/share/viewCodec.test.mjs
malformed input is rejected with a reason, never thrown
```

New tests under `share-codec-034` check invalid payloads with literal reasons.

## Scenarios

The final column records the tests that carry each id.
The scenario map gives their complete names and source lines.

| ID | Title | Tests |
| --- | --- | ---: |
| `share-codec-001` | Base64url bytes | 3 |
| `share-codec-002` | Invalid base64url text | 1 |
| `share-codec-003` | Signed integers | 1 |
| `share-codec-004` | Varint values | 1 |
| `share-codec-005` | Writer bounds | 3 |
| `share-codec-006` | Reader bounds | 1 |
| `share-codec-007` | Tags and lengths | 1 |
| `share-codec-008` | Unknown wire values | 5 |
| `share-codec-009` | Check byte | 1 |
| `share-codec-010` | Permanent tables | 43 |
| `share-codec-011` | Default view | 2 |
| `share-codec-012` | Scalar differences | 27 |
| `share-codec-013` | Camera precision | 1 |
| `share-codec-014` | Style cost | 8 |
| `share-codec-015` | Style parameter values | 22 |
| `share-codec-016` | Layer numbers | 41 |
| `share-codec-017` | Layer presence | 45 |
| `share-codec-018` | Layer options | 65 |
| `share-codec-019` | Panel layout | 17 |
| `share-codec-020` | Place and thing views | 4 |
| `share-codec-021` | Entity identifiers | 23 |
| `share-codec-022` | Tracked entity | 8 |
| `share-codec-023` | Fix time | 8 |
| `share-codec-024` | Local offset | 2 |
| `share-codec-025` | Camera geometry | 8 |
| `share-codec-026` | Character errors | 1 |
| `share-codec-027` | Future share time | 2 |
| `share-codec-028` | Unknown fields | 1 |
| `share-codec-029` | Unknown nested data | 2 |
| `share-codec-030` | Unknown view kind | 4 |
| `share-codec-031` | Unknown entity | 2 |
| `share-codec-032` | Open names | 5 |
| `share-codec-033` | Closed names | 6 |
| `share-codec-034` | Invalid payloads | 25 |
| `share-codec-035` | Corrupt payloads | 1 |
| `share-codec-036` | Canonical state | 4 |
| `share-codec-037` | Permanent example | 1 |
| `share-codec-038` | Earlier links | 1 |
| `share-codec-039` | Tracking conversion | 5 |
| `share-codec-040` | Vessel conversion | 2 |
| `share-codec-041` | Entity layer | 3 |
| `share-codec-042` | Generated links | 1 |
| `share-codec-043` | Own state fields | 29 |
| `share-codec-044` | Legacy keys | 1 |
| `share-codec-045` | Share path | 3 |
| `share-codec-046` | Application root | 2 |
| `share-codec-047` | Share URL | 1 |
| `share-codec-048` | Numeric limits | 40 |
| `share-codec-049` | Future table entries | 5 |
| `share-codec-050` | Invalid options | 11 |
| `share-codec-051` | Invalid fix values | 2 |
| `share-codec-052` | Time bounds | 3 |
| `share-codec-053` | ASCII text | 1 |
| `share-codec-054` | Internal error | 1 |
| `share-codec-055` | Zero distance | 1 |
| `share-codec-056` | Invalid open names | 6 |
| `share-codec-057` | Unknown style | 1 |
| `share-codec-058` | Default sources | 1 |
| `share-codec-059` | Known detection names | 2 |
| `share-codec-060` | Camera example size | 1 |
| `share-codec-061` | Signed angle fields | 5 |
| `share-codec-062` | Known place kind | 2 |
| `share-codec-063` | Fix wire data | 1 |
| `share-codec-064` | Empty thing message | 1 |

## Coverage

The host uses Node `v26.13.0`.
The [coverage output](coverage.txt) records each command and its completed result.
The helper starts one test process per production file.
It excludes the slow random and typo tests from coverage.
The full host suite includes those tests.
Host coverage does not state a gate verdict.

| File | Line % | Branch % | Function % |
| --- | ---: | ---: | ---: |
| `src/share/follow.js` | 100.00 | 100.00 | 100.00 |
| `src/share/legacyShareState.js` | 100.00 | 100.00 | 100.00 |
| `src/share/shareLinkPath.js` | 100.00 | 100.00 | 100.00 |
| `src/share/viewCodec.js` | 100.00 | 98.68 | 100.00 |
| `src/share/wire.js` | 100.00 | 100.00 | 100.00 |

The main report does not include worker branch coverage.
A separate inspector snapshot uses the same source fixture as `share-codec-058`.
The [worker snapshot](worker-coverage.json) records positive counters at lines 544, 866 and 870.
The [combined source ranges](coverage-union.json) leave four private paths without a witness.
The design gives each path, its guard and the attempted inputs.
The coverage merge command above supplies that range count.

| File | Line | Reason | Inputs tried |
| --- | ---: | --- | --- |
| `src/share/viewCodec.js` | 307 | Every fixed option spec names an own absent key. | Absent options, unknown owners and mirror owners. |
| `src/share/viewCodec.js` | 941 | The normalizer and encoder infer the same place or thing kind. | Every entity, future kinds and custom getters. |
| `src/share/viewCodec.js` | 1063 | The caller excludes an absent entry before this helper. | Absent enums, unknown codes and wrong wire types. |
| `src/share/viewCodec.js` | 1211 | The caller returns before this helper when the entry is absent. | Absent ids, future kinds and duplicate ids. |

## Mutation and test audit

Rows: 347. Tested: 341. Equivalent: 4. Default-value: 2. Open: 0.

The original audit names a failed mutation witness for each test at its source commit.
The tests distinguish default values from changed values.
The key matrix checks each scalar, flag, panel, parameter, option and layer.
The source fixtures use distinct values across preset and global tables.
Custom getters check metadata access, entity access and property ownership.
The clock fixture checks that invalid epochs do not read the clock.

The old panel-token test shared its expected table with the parser.
Literal fixtures now make `T055` fail after a token change.
The old mirror test supplied an invalid option value.
It now supplies valid text and checks that the owner keeps its default value.
The original test names keep their text.

The original mutation checks appear in [mutation output](mutation-run.txt).
The initial broad sweep stopped before completion and gives no full verdict.
Later checks cover every case in the final spec.
The final full check covers the original decision cases.
Separate checks cover boundaries, each named key, each other test and negative zero.
The mutation helper restores each production file after each check.

The scope check compares every production byte with the source commit.

## Decisions for the lead

The [design](design.md) names each limit at this source commit.
The [local probes](probes.json) give the current results.

At line 1232, the decoder accepts a fix with one coordinate and gives the other coordinate zero.
At line 658, a style getter can change its value between the two property reads.

No scenario states that these behaviors are correct.
The style test supplies its unknown name as literal payload text.
It does not assert which name the unstable getter selects.

The command below supplies the probe data.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && node /home/ianblenke/docker/gev-tools/sharecodec/probes.mjs
```

## Format and STE

The first format command stopped at `spawnSync git EPERM` before it gave a format verdict.
The formatter then completed with permission for the local Git child process.
The [saved output](format-and-ste.txt) records the format and STE results.
The title audit separately checks the tagged names.
The STE lint reports zero errors.
The title audit reports zero errors and 28 warnings.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/sharecodec && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/sharecodec && node ../node_modules/prettier/bin/prettier.cjs --check src/share/*.test.mjs
cd /home/ianblenke/docker/gev-work/sharecodec && node scripts/spec/gates.mjs lint 2>&1 | grep -E "^ERROR"
```

## Earlier host scope

The production files and QA scripts match the source commit.
The trace files keep their original bytes.
The tracked diff contains only test files.
The untracked paths contain only test files and this change folder.
The measurement command checks both path lists.

This work does not use Docker.
At the host snapshot, the worker did not run full gates, ratchet or archive.
The lead later ran the ratchet and archived the change.
It does not create a commit or push.
The final gate and formal review tasks stay unchecked.

The commands below supply the scope evidence.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && git branch --show-current
cd /home/ianblenke/docker/gev-work/sharecodec && git rev-parse HEAD
cd /home/ianblenke/docker/gev-work/sharecodec && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/sharecodec && git ls-files --others --exclude-standard
cd /home/ianblenke/docker/gev-work/sharecodec && git diff --name-only HEAD -- src/share/follow.js src/share/legacyShareState.js src/share/shareLinkPath.js src/share/viewCodec.js src/share/wire.js scripts/qa-*.mjs openspec/trace/
cd /home/ianblenke/docker/gev-work/sharecodec && git status --short
```

The tracked diff reports:

```text
src/share/legacyShareState.test.mjs
src/share/shareLinkPath.test.mjs
src/share/viewCodec.test.mjs
src/share/wire.test.mjs
```

The status reports:

```text
 M src/share/legacyShareState.test.mjs
 M src/share/shareLinkPath.test.mjs
 M src/share/viewCodec.test.mjs
 M src/share/wire.test.mjs
?? openspec/changes/backfill-share-codec/
?? src/share/backfill.test.mjs
```

## Correction checks

The correction reads commit `4cf8e370` with host Node `v26.13.0`.
The full host suite passes 476 leaf tests.
The correction adds 40 mutation cases and kills each case.
The original mutation records keep their historical results.

The formatter writes and checks 1673 source files.
The separate format check accepts all share test files.
The full prose lint reports zero errors and 1275 warnings.
The title audit reports zero errors and 28 warnings.
The [check output](review-validation.txt) records the commands and results.

The [correction report](corrections.md) gives each file, line and proof.
The live and archived requirement bodies match.
The Purpose paragraph keeps its original bytes.
At the correction host snapshot, production files, QA scripts and trace files matched commit `4cf8e370`. The lead later changed the trace files in `af2b614e`.
