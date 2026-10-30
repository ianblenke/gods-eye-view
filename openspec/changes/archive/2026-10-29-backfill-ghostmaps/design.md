## Context

This change reads commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb` on branch `backfill-ghostmaps`.
The proxy checks a GitHub branch and caches product files by blob SHA.
The browser reads the catalog, parses KMZ data and draws reports.
Tests use local data and custom fakes.
Tests do not make network requests.

## Decisions

The new delta uses `ADDED Requirements` because `ghostmaps` is a new capability.
Each requirement records `Origin: backfill`.
The tests exercise public exports.
The mutation helper restores each production file after each check.

The audit records each compound condition, conditional expression, switch and loop.
The final evidence records the host coverage for each file.
Host coverage does not state the gate result.

The lead runs the ratchet, gates and review process.

## QA scope

The header of `scripts/qa-ghostmaps.mjs` describes live load, cards, push events, chip choice, layer removal, phone width and horizon checks.
Unit tests use custom fakes for local behavior.
They do not replace the live browser proof.
This change does not edit the QA script.
The host cannot give the QA purpose lines from the full gates.

## Sweep commands

The scratch folder is `/home/ianblenke/docker/gev-tools/ghostmaps/`.
The evidence gives the exact commands for the test, title, coverage and audit totals.
The original ledger sweep gives 23 old tests across the GhostMaps entries.
The import sweep resolves relative paths across all repository test files.
It includes paths such as `./index.js` that a brand search cannot find.

## Known limits

The evidence will list each limit with its file, line, reason and test attempt.

### Known limit `ghostmaps-source-attach`

This limit describes commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
At `src/layers/ghostMaps/index.js:353`, a rejected data source attachment leaves the new image URLs outside the product cache.
A call to `disable` during that attachment can leave the new data source on the viewer.
The local probe uses a viewer whose `add` method throws or calls `disable`.
No scenario states this behavior.

### Known limit `ghostmaps-caller-signal`

This limit describes commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
At `src/layers/ghostMaps/index.js:599`, a catalog request can succeed after the caller signal aborts.
The layer then applies the catalog with its own lifetime signal.
The local probe aborts the caller signal inside a fake catalog source and returns product data.
No scenario states this behavior.

### Known limit `ghostmaps-empty-table`

This limit describes commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
At `src/layers/ghostMaps/records.js:94`, a description with only excluded table rows can enter the plain text path.
The result includes the text of those rows.
The local probe supplies a table with only a SHAPE row.
No scenario states this behavior.

### Known limit `ghostmaps-private-card-paths`

This limit describes commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
No input can reach the return at `src/layers/ghostMaps/index.js:404`.
Only the installed click handler calls `publishCard`.
The handler needs the overlay host, input factory and pick registry.
Those private references keep their truth values after construction.
The tests try each absent host and a handler before viewer initialization.

No input can reach the false result at `src/layers/ghostMaps/index.js:405`.
The sole caller sets a nonempty feature key immediately before the call.
The tests try invalid indices, false pick ids and a custom catalog that removes the feature during a pick.
The last case reaches the separate empty-feature branch at line 406.

### Known limit `ghostmaps-old-title`

This limit describes commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
The old catalog test below keeps its name because the owner forbids a rename.
The title contains the banned word `malformed`.
The change leaves this test without a tag.
New metadata tests carry `ghostmaps-004`.

```text
oversized, empty, non-KMZ and malformed entries are skipped
```

## Files

The production scope includes these files:

- `server/providers/ghostMaps.js`
- `src/app/layers/ghostMaps.js`
- `src/layers/ghostMaps/catalog.js`
- `src/layers/ghostMaps/index.js`
- `src/layers/ghostMaps/kml.js`
- `src/layers/ghostMaps/records.js`
- `src/layers/ghostMaps/source.js`

The tests use the adjacent test files and `src/layers/ghostMaps/lifecycle.test.mjs`.
The change does not edit the production files.

## Equivalent mutations

The table names each mutation that gives the same public result.
The audit also records the test and result for the other operand of each expression.
These reasons apply to custom public inputs.
These inputs include objects with their own text conversion methods.

| Mutation | File and line | Reason |
| --- | --- | --- |
| `A016-right` | `server/providers/ghostMaps.js:396` | Each false URL value names an unknown route with or without the default. The route check at line 398 rejects both. |
| `A019-right` | `src/layers/ghostMaps/catalog.js:127` | False primitive names cannot match the date or edition patterns at lines 116 and 117. Objects follow the same text conversion path. |
| `A020-left` | `src/layers/ghostMaps/catalog.js:136` | The date pattern at line 116 accepts only month names in the private month list. Text conversion finishes before that pattern check. |
| `A021-true` | `src/layers/ghostMaps/catalog.js:138` | The date ends with a year of four digits. The edition pattern accepts at most three digits after a separator. Both suffix paths match identically. |
| `A029-right` | `src/layers/ghostMaps/catalog.js:175` | Each false SHA value fails the exact hexadecimal pattern at the same line. Objects follow the same path in both versions. |
| `A038-right` | `src/layers/ghostMaps/catalog.js:238` | False primitive values cannot match the ref pattern at line 241. Objects keep the same text conversion in both versions. |
| `A040-right` | `src/layers/ghostMaps/index.js:62` | Null and undefined storage both stop at the optional operations at lines 70 and 79. Neither value supplies a property. |
| `A041-right` | `src/layers/ghostMaps/index.js:70` | Undefined data throws inside JSON parse. The catch at line 72 returns the same null selection as the default JSON text. |
| `A073-right` | `src/layers/ghostMaps/index.js:379` | The stats expression at line 686 replaces every false catalog error value. The layer does not use its source type elsewhere. |
| `A075-right` | `src/layers/ghostMaps/index.js:399` | The feature guard at line 406 rejects every false feature before property access. Custom metadata cannot bypass that guard. |
| `A076-false` | `src/layers/ghostMaps/index.js:405` | The only caller sets a nonempty key at line 520. The next call reaches this expression without an external callback. |
| `A077-right` | `src/layers/ghostMaps/index.js:418` | The link guards at lines 432, 447 and 514 treat null and undefined alike. The parser returns only nonempty links or an absent element. |
| `A123-right` | `src/layers/ghostMaps/kml.js:13` | Each consumer uses a truth test, optional access or the guarded text helper at line 18. None returns this internal sentinel. |
| `A130-right` | `src/layers/ghostMaps/kml.js:28` | The coordinate bounds at lines 35 and 36 reject the text forms of null and undefined. Objects keep the same text conversion. |
| `A132-left` | `src/layers/ghostMaps/kml.js:33` | Numeric conversion creates primitive tuple members. The bounds at lines 35 and 36 reject NaN and infinity without the finite checks. |
| `A133-left` | `src/layers/ghostMaps/kml.js:33` | The longitude bound at line 36 rejects NaN and infinity after primitive numeric conversion. A custom text source cannot bypass that check. |
| `A133-right` | `src/layers/ghostMaps/kml.js:33` | The latitude bound at line 35 rejects NaN and infinity after primitive numeric conversion. A custom text source cannot bypass that check. |
| `A141-right` | `src/layers/ghostMaps/kml.js:95` | An unresolved map gives undefined. The object spread at line 191 adds the same empty set of keys as an empty object. |
| `A148-false` | `src/layers/ghostMaps/kml.js:192` | An absent inline style calls the guarded child helper at lines 45, 52 and 57. That path returns an empty object without an image call. |
| `A164-right` | `src/layers/ghostMaps/records.js:108` | The exact color pattern at line 111 rejects the text forms of null and undefined. Custom text objects follow the same conversion. |

## Purpose at archive time

The lead sets this Purpose at archive time:

Describe how the proxy reads the GhostMaps repository on GitHub, and how the layer shows the KMZ products of that repository on the globe.

## Round one corrections

The correction reads commit `03be515cbbc11ee27a7445b8c628cbc06a1289fb`.
The tests check literal metadata, request arguments, distinct editions and each allocated image URL.
The scenario links separate supported routes from unsupported requests.
The evidence records the host measurements and each mutation result.

## QA links after round one

| QA behavior | Local scenario | Browser limit |
| --- | --- | --- |
| Default products and chips | `ghostmaps-030`, `ghostmaps-034` | `ghostmaps-live-repository` |
| Cards and empty ground | `ghostmaps-033` | `ghostmaps-browser-pixels` |
| Product editions and removal | `ghostmaps-032` | The browser script checks the full app. |
| Product choice after page load | `ghostmaps-031`, `ghostmaps-045` | The browser script checks the full app. |
| Layer removal | `ghostmaps-044` | The browser script checks the full app. |
| Phone width | None | `ghostmaps-phone-layout` |
| Horizon visibility | `ghostmaps-050` | `ghostmaps-browser-horizon` |

## Host measurements

The host suite passes 276 tests, with 275 tagged tests.
The delta contains 66 scenarios.
The mutation spec contains 430 cases: 410 killed cases and 20 documented equivalents.
The audit contains 170 rows, with 0 open rows.
The command below supplies these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round2.py
```

The audit command is in [evidence.md](evidence.md).
