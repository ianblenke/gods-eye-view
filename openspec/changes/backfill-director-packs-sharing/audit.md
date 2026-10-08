# Automatic mutation audit

Base commit: `290b5d2`.

MIME means Multipurpose Internet Mail Extensions.

ASCII means American Standard Code for Information Interchange.

## Method

The automatic tool is `/home/ianblenke/docker/gev-tools/automut/automut.mjs`.
The automatic tool generates mutations by operator class.
The source files stay unchanged.

Campaign 2 phase 1 excludes six slow tests.
Campaign 2 phase 2 uses those tests for mutations on affected lines.
Pass 4 correction check 2 checks every former survivor with all tests.
The [survivor table](survivors.md) gives one result for each former survivor.

Campaign 2 records this source commit:

```text
76371da7d595106f2e8046da5a10923155ab9646
```

The tests are:

- `src/director/packs/backfill.test.mjs`
- `src/director/packs/packs.test.mjs`
- `src/director/sharing/sharing.test.mjs`

The tool files are `mutants.json`, `results.json` and `phase2-results.json` in the automatic tool directory.
The script below reads those files.
The output gives each total in this audit.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass4/build-audit.py
```

## Source results

The tool generated 3849 mutations.
Campaign 2 phase 1 reports 3392 killed, 111 timeout, 11 crash and 335 survived results.
Campaign 2 phase 2 killed 75 of 193 selected mutations.
The other 118 selected mutations survived.
The unselected mutations and these results give 260 former survivors.

The pass policy counts timeouts and crashes as kills, as Stryker does.
That rule gives 3514 Campaign 2 phase 1 kills and 3589 kills after the second phase.
The tool README keeps timeouts unresolved and crashes separate.
This audit records each status instead of a test failure for those cases.

The automatic and hand runs cover all review round 2 survivors that a person found in the code.
The hand table also checks mutations that the automatic tool cannot reproduce.
The [hand mutation report](mutations.md) keeps those results.

## Final rerun

The lead ran the final rerun on the committed clone after pass 5.
The command used the complete suite for each mutation and a deadline of 45 seconds.
It ran the extension set first and the old set second.

```sh
cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants director-3-final2/<set>.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --order "src/director/packs/*.js=backfill,packs,sharing;src/director/sharing/*.js=sharing,backfill,packs" --jobs 4 --timeout 45 --slow-ms 100000 --out director-3-final2/results-<set>.json
```

The extension set has 711 mutations. It gives 644 killed and 67 survived results, with no timeout and no crash.
The 67 survived results are the 67 equivalent cases of the extension run in the [survivor table](survivors.md).

The old set has 3849 mutations. It gives 3718 killed, 64 timeout, 3 crash and 64 survived results.
The 64 survived results are the 60 equivalent cases and the four Known limit cases of the survivor table.
No other mutation survived, and no killed case of the table survives.

Pass policy counts timeouts and crashes as kills.
The tool does not record them as failed tests.

The ids of the 64 timeout results of the old set are:

```text
a1325 a1327 a1329 a1330 a1338 a1339 a1340 a1341 a1349 a1350 a1352 a1353 a1355 a1386 a1399 a1400 a1401 a1402 a1416 a1418 a1419 a1427 a1428 a1429 a1430 a1468 a1469 a1470 a1471 a1689 a1690 a1693 a2379 a2387 a2388 a2390 a3029 a3031 a3106 a3108 a3568 a3569 a3570 a3571 a3572 a3573 a3575 a3576 a3578 a3582 a3583 a3584 a3585 a3586 a3602 a3603 a3604 a3605 a3612 a3616 a3627 a3628 a3629 a3630
```

The ids of the 3 crash results of the old set are:

```text
a3558 a3559 a3560
```

## Rerun after pass 4

The lead ran the rerun after pass 4 on the committed clone with the pass 4 tests.
The command used the complete suite for each mutation and a deadline of 45 seconds.

```sh
cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants director-3-final/mutants.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --order "src/director/packs/*.js=backfill,packs,sharing;src/director/sharing/*.js=sharing,backfill,packs" --jobs 4 --timeout 45 --slow-ms 100000 --out director-3-final/results.json
```

The command ended with exit status 0 after it tested 3849 mutations.
It gives 3667 killed, 105 timeout, 9 crash and 68 survived results.
Pass 4 labeled the 68 survived results as 64 equivalent cases and four Known limit cases.
Pass 5 kills four of those cases with the large JSON test.
The other cases give 60 equivalent and four Known limit results in the old [survivor table](survivors.md).

The lead rerun after pass 4 kept all 192 pass 4 killed results.
The rerun after pass 4 reports fewer timeout and crash results than campaign 2, because the tests are faster and the deadline is lower.

Pass policy counts timeouts and crashes as kills.
The tool records countsAsKill as false for all 114 timeout and crash results of the rerun after pass 4.
These results do not report a failed test.

The rerun after pass 4 gives these 105 timeout IDs:

```text
a1325 a1327 a1329 a1330 a1338 a1339 a1340 a1341 a1345 a1346 a1347 a1348 a1349 a1350 a1352 a1353 a1355 a1364 a1366 a1367 a1368 a1369 a1370 a1386 a1399 a1400 a1401 a1402 a1416 a1418 a1419 a1427 a1428 a1429 a1430 a1468 a1469 a1470 a1471 a1515 a1516 a1517 a1518 a1554 a1555 a1556 a1557 a1678 a1679 a1680 a1681 a1682 a1683 a1688 a1689 a1690 a1693 a2145 a2146 a2147 a2148 a2149 a2379 a2387 a2388 a2389 a2390 a3029 a3031 a3106 a3108 a3524 a3526 a3543 a3544 a3545 a3546 a3564 a3565 a3566 a3567 a3568 a3569 a3570 a3571 a3572 a3573 a3575 a3576 a3578 a3582 a3583 a3584 a3585 a3586 a3602 a3603 a3604 a3605 a3612 a3616 a3627 a3628 a3629 a3630
```

The rerun after pass 4 gives these 9 crash IDs:

```text
a3554 a3555 a3556 a3557 a3558 a3559 a3560 a3561 a3562
```

## Operator totals

| class | mutations |
| --- | ---: |
| `argument-drop` | 360 |
| `arguments` | 359 |
| `arith` | 60 |
| `boolean` | 20 |
| `branch` | 85 |
| `call-value` | 137 |
| `callback` | 93 |
| `condition` | 180 |
| `constant` | 16 |
| `default` | 52 |
| `equality` | 41 |
| `exception` | 19 |
| `implicit-default` | 4 |
| `iteration` | 12 |
| `limit` | 38 |
| `logical` | 74 |
| `method` | 28 |
| `method-remove` | 10 |
| `negation` | 37 |
| `number` | 350 |
| `object` | 343 |
| `operand` | 158 |
| `operand-drop` | 148 |
| `operand-order` | 74 |
| `optional` | 25 |
| `ownership` | 1 |
| `predicate` | 122 |
| `regex` | 29 |
| `relational` | 52 |
| `statement` | 661 |
| `string` | 107 |
| `value` | 154 |

## Extension run

Campaign 1 stopped during baseline work and gave no mutation result.
Campaign 2 is the original check of 3849 mutations.
The final rerun is the lead check of those 3849 mutations.
The extension run checks 711 new mutations in four extension checks.
It keeps every old mutation ID and adds IDs from a9000.

The latest result for each new ID gives 644 killed and 67 survived results.
Each survived result is equivalent within the bound in the extension probe.
The latest results contain no timeout, crash, Known limit or open case.

| extension check | mutations | killed | survived | timeout | crash |
| --- | ---: | ---: | ---: | ---: | ---: |
| Extension check 1 | 367 | 235 | 131 | 1 | 0 |
| Extension check 2 | 195 | 122 | 72 | 1 | 0 |
| Extension check 3 | 104 | 37 | 67 | 0 | 0 |
| Extension check 4 | 317 | 250 | 67 | 0 | 0 |

Extension check 2 also kills the four old JSON mutations.
Its full input has 199 mutations and 126 killed results.
Extension check 3 repeats the former survivors and adds 31 constructor mutations.
It kills the former timeout with a tagged test.

Extension check 4 adds 250 range character mutations and repeats all 67 survivors.
It also kills the four old JSON mutations.
Its full input has 321 mutations and 254 killed results.

The [survivor table](survivors.md) gives the failed test for each kill.
The [extension probe](evidence/probe-extension.txt) gives each equivalent bound.
The [probe range table](probe-ranges.md) checks each old probe group.

| new class | mutations | killed | equivalent |
| --- | ---: | ---: | ---: |
| `new-argument` | 38 | 37 | 1 |
| `await-remove` | 12 | 12 | 0 |
| `statement-order` | 207 | 172 | 35 |
| `regex-member` | 24 | 24 | 0 |
| `regex-alternative` | 0 | 0 | 0 |
| `spread-remove` | 1 | 1 | 0 |
| `destructure-remove` | 24 | 24 | 0 |
| `default-shape` | 61 | 42 | 19 |
| `optional-argument` | 0 | 0 | 0 |
| `optional-call` | 0 | 0 | 0 |
| `new-error-argument` | 38 | 28 | 10 |
| `call-spread-remove` | 1 | 1 | 0 |
| `template-expression` | 20 | 20 | 0 |
| `regex-quantifier` | 4 | 3 | 1 |
| `constructor` | 31 | 30 | 1 |
| `regex-character` | 250 | 250 | 0 |

The old optional class already generates the same optional call mutations in scope.
Deduplication keeps those old IDs.
The source files have no regex alternation, so that new class has no input in scope.
The seven tool tests pass and check every new class with a small fixture.

## Tool limits

The closed sets are:

| set | file:line | accepted members |
| --- | --- | --- |
| MIME types | bundle.js:11 | application/json, application/geo+json, image/png, video/mp4, video/webm, audio/mpeg, audio/ogg, audio/wav, audio/webm |
| Data pack formats | manifest.js:46 | geojson, image, media |
| Directory protocols | source.js:10 | http:, https: |

The tool does not add members to arrays or Sets.
This additive edits limit covers the nine MIME types at bundle.js:11 to 21, formats at manifest.js:46 and protocols at source.js:10.
Hand rows m413 to m415 add one unlisted member to each closed set.
The tool does not narrow a collection with slice or move a call outside its loop.
The loop table names the separate hand rows for these mutations.

The tool mutates the 32 old classes in the operator table and the 16 new classes above.
Constructor argument removal includes Map snapshots and error constructor messages.
Await removal covers each await expression in scope.
Statement order mutations swap adjacent statements of a block.
Regex mutations remove each class member and each complete range.
The range character class also removes each letter and digit within a range.

Default mutations cover object, array, spread and destructured forms in scope.
Optional mutations cover call arguments and optional calls.

The tool does not swap nonadjacent statements or statements across blocks.
It does not remove the new keyword, change arbitrary constructor names or replace arbitrary property names.
It does not remove nested regex alternatives or change regex flags.
It does not remove one character from a non-ASCII range or a range across character categories.
These source files have no nested regex alternatives, regex flags or such ranges.

The fixed operators do not generate all mutations across multiple code sites or all domain-specific call mutations.
The hand report lists those separate cases.
Error text replacement stays an optional old class, apart from the new error argument removal class.
The audit does not claim that the tool generates every possible code change.

Known limit `session-listener-timer` concerns caller cancellation during listener registration.
The [timer probe](evidence/probe-listener-timer.txt) shows a timer after the caller destroys the session.
Later change `fix-director-listener-timer` addresses that Known limit.

## TIMEOUT results

Campaign 2 gives 111 results with this status. The Final rerun section gives the list from the command after pass 5.

| id | status |
| --- | --- |
| `a1925` | `TIMEOUT` |
| `a1985` | `TIMEOUT` |
| `a1327` | `TIMEOUT` |
| `a1386` | `TIMEOUT` |
| `a1416` | `TIMEOUT` |
| `a1457` | `TIMEOUT` |
| `a1604` | `TIMEOUT` |
| `a1617` | `TIMEOUT` |
| `a1915` | `TIMEOUT` |
| `a1982` | `TIMEOUT` |
| `a2379` | `TIMEOUT` |
| `a3524` | `TIMEOUT` |
| `a1330` | `TIMEOUT` |
| `a1419` | `TIMEOUT` |
| `a1349` | `TIMEOUT` |
| `a1350` | `TIMEOUT` |
| `a1370` | `TIMEOUT` |
| `a3029` | `TIMEOUT` |
| `a3106` | `TIMEOUT` |
| `a3572` | `TIMEOUT` |
| `a3573` | `TIMEOUT` |
| `a3586` | `TIMEOUT` |
| `a1329` | `TIMEOUT` |
| `a1338` | `TIMEOUT` |
| `a1339` | `TIMEOUT` |
| `a1340` | `TIMEOUT` |
| `a1341` | `TIMEOUT` |
| `a1345` | `TIMEOUT` |
| `a1346` | `TIMEOUT` |
| `a1347` | `TIMEOUT` |
| `a1348` | `TIMEOUT` |
| `a1364` | `TIMEOUT` |
| `a1366` | `TIMEOUT` |
| `a1367` | `TIMEOUT` |
| `a1368` | `TIMEOUT` |
| `a1369` | `TIMEOUT` |
| `a1399` | `TIMEOUT` |
| `a1400` | `TIMEOUT` |
| `a1401` | `TIMEOUT` |
| `a1402` | `TIMEOUT` |
| `a1418` | `TIMEOUT` |
| `a1427` | `TIMEOUT` |
| `a1428` | `TIMEOUT` |
| `a1429` | `TIMEOUT` |
| `a1430` | `TIMEOUT` |
| `a1468` | `TIMEOUT` |
| `a1469` | `TIMEOUT` |
| `a1470` | `TIMEOUT` |
| `a1471` | `TIMEOUT` |
| `a1515` | `TIMEOUT` |
| `a1516` | `TIMEOUT` |
| `a1517` | `TIMEOUT` |
| `a1518` | `TIMEOUT` |
| `a1554` | `TIMEOUT` |
| `a1555` | `TIMEOUT` |
| `a1556` | `TIMEOUT` |
| `a1557` | `TIMEOUT` |
| `a1678` | `TIMEOUT` |
| `a1679` | `TIMEOUT` |
| `a1680` | `TIMEOUT` |
| `a1681` | `TIMEOUT` |
| `a2145` | `TIMEOUT` |
| `a2146` | `TIMEOUT` |
| `a2147` | `TIMEOUT` |
| `a2148` | `TIMEOUT` |
| `a3543` | `TIMEOUT` |
| `a3544` | `TIMEOUT` |
| `a3545` | `TIMEOUT` |
| `a3546` | `TIMEOUT` |
| `a3564` | `TIMEOUT` |
| `a3565` | `TIMEOUT` |
| `a3566` | `TIMEOUT` |
| `a3567` | `TIMEOUT` |
| `a3568` | `TIMEOUT` |
| `a3569` | `TIMEOUT` |
| `a3570` | `TIMEOUT` |
| `a3571` | `TIMEOUT` |
| `a3582` | `TIMEOUT` |
| `a3583` | `TIMEOUT` |
| `a3584` | `TIMEOUT` |
| `a3585` | `TIMEOUT` |
| `a3602` | `TIMEOUT` |
| `a3603` | `TIMEOUT` |
| `a3604` | `TIMEOUT` |
| `a3605` | `TIMEOUT` |
| `a3627` | `TIMEOUT` |
| `a3628` | `TIMEOUT` |
| `a3629` | `TIMEOUT` |
| `a3630` | `TIMEOUT` |
| `a1688` | `TIMEOUT` |
| `a1693` | `TIMEOUT` |
| `a2149` | `TIMEOUT` |
| `a3612` | `TIMEOUT` |
| `a3616` | `TIMEOUT` |
| `a1325` | `TIMEOUT` |
| `a2387` | `TIMEOUT` |
| `a1352` | `TIMEOUT` |
| `a1353` | `TIMEOUT` |
| `a1682` | `TIMEOUT` |
| `a1683` | `TIMEOUT` |
| `a1689` | `TIMEOUT` |
| `a1690` | `TIMEOUT` |
| `a2388` | `TIMEOUT` |
| `a2390` | `TIMEOUT` |
| `a3031` | `TIMEOUT` |
| `a3108` | `TIMEOUT` |
| `a3526` | `TIMEOUT` |
| `a3575` | `TIMEOUT` |
| `a3576` | `TIMEOUT` |
| `a1355` | `TIMEOUT` |
| `a3578` | `TIMEOUT` |

## Process crash results

Campaign 2 gives 11 results with this status. The Final rerun section gives the list from the command after pass 5.

| id | status |
| --- | --- |
| `a3558` | `CRASH` |
| `a3561` | `CRASH` |
| `a3554` | `CRASH` |
| `a3555` | `CRASH` |
| `a3557` | `CRASH` |
| `a3556` | `CRASH` |
| `a1645` | `CRASH` |
| `a1644` | `CRASH` |
| `a3559` | `CRASH` |
| `a3560` | `CRASH` |
| `a3562` | `CRASH` |

## Loop table

The table covers each collection loop in the seven source files.
Each test reaches at least two items or rejects a later item.
The lifetime.js file has no collection loop.
Each mutation narrows a collection or moves a per-item check outside its loop.
The final hand command gives each result.

| loop | file:line | test with 2 items | mutation row or Known limit |
| --- | --- | --- | --- |
| Path segments | src/director/packs/manifest.js:24 | [director-076] The path rejects its second segment | m425 |
| Bounds coordinates | src/director/packs/manifest.js:103 | [director-080] The image rejects bounds field 3 | m424 |
| Scene anchors | src/director/packs/manifest.js:123 | [director-081] The manifest uses the second anchor | m417 |
| Scene data packs | src/director/packs/manifest.js:125 | [director-077 director-082] The manifest validates the second data pack | m416 |
| Scene shots | src/director/packs/manifest.js:131 | [director-082] The manifest rejects the second shot reference | m411, m412 |
| Shot reference IDs | src/director/packs/manifest.js:134 | [director-082] The manifest checks the second reference ID | m418 |
| Position coordinates | src/director/packs/geojson.js:20 | [director-085] The position rejects its second nonfinite coordinate | m426 |
| Line positions | src/director/packs/geojson.js:32 | [director-085 director-086] The decoder rejects the second line position | m420 |
| Ring end coordinates | src/director/packs/geojson.js:33 | [director-086] The ring rejects unclosed field 2 | m427 |
| Features | src/director/packs/geojson.js:37 | [director-084] The decoder rejects the second feature | m419 |
| Polygon rings | src/director/packs/geojson.js:58 | [director-087] The decoder rejects the second ring | m421 |
| Resource handles | src/director/packs/session.js:52 | [director-089] The session keeps every data pack handle | m428 |
| Session anchors | src/director/packs/session.js:70 | [director-081 director-093] The session uses the second anchor | m423 |
| Session declarations | src/director/packs/session.js:71 | [director-088] The session validates the second data pack before source access | m422 |
| Session data packs | src/director/packs/session.js:94 | [director-092] The session removes resources after a later error | m429 |
| Stream chunks | src/director/packs/source.js:41 | [director-097] The source cancels before it reads the second chunk | m445 |
| Output chunks | src/director/packs/source.js:55 | [director-096] The source joins chunks of different lengths | m430 |
| Project scenes and their data packs | src/director/sharing/bundle.js:23 | [director-101] The export reaches the second scene; [director-101] The export writes each asset index and filename | m431, m432 |
| Base64 byte chunks | src/director/sharing/bundle.js:32 | [director-101] The export encodes the second byte chunk | m446 |
| Import assets | src/director/sharing/bundle.js:84 | [director-107] The import stops before the second asset; [director-107] The import stops after the second digest | m409, m447 |
| Import references | src/director/sharing/bundle.js:99 | [director-100] The bundle checks its second asset reference | m433 |
| Export data packs | src/director/sharing/bundle.js:143 | [director-107] The export stops before the second asset; [director-101] The export writes each asset index and filename; [director-107] The export stops after the second digest | m410, m434, m448 |
| Export entries | src/director/sharing/bundle.js:190 | [director-101] The export writes each asset index and filename | m435 |
| Stored asset bytes | src/director/sharing/bundle.js:210 | [director-104] The store counts the second asset | m436 |
| Preview scenes for data packs | src/director/sharing/preview.js:10 | [director-108 director-110] The preview reaches the second scene and shot | m437 |
| Preview data packs | src/director/sharing/preview.js:11 | [director-108] The preview reaches the second data pack | m438 |
| Preview scenes for shot totals | src/director/sharing/preview.js:28 | [director-108 director-110] The preview reaches the second scene and shot | m439 |
| Preview scenes for layers | src/director/sharing/preview.js:32 | [director-108 director-110] The preview reaches the second scene and shot | m440 |
| Preview shots for layers | src/director/sharing/preview.js:33 | [director-108 director-110] The preview reaches the second scene and shot | m441 |
| Preview scenes for external content | src/director/sharing/preview.js:37 | [director-108 director-110] The preview reaches the second scene and shot | m442 |
| Preview shots for external content | src/director/sharing/preview.js:39 | [director-108 director-110] The preview reaches the second scene and shot | m443 |
| Preview asset bytes | src/director/sharing/preview.js:41 | [director-108 director-110] The preview reaches the second scene and shot | m444 |

The loop table has 32 rows.
All 32 rows have repository tests and hand mutations.
No loop row has an open gap or a Known limit.

The stream test supplies two chunks and stops at the next loop check after its first chunk.
It expects the source to read once because cancellation must stop the second stream call.
The byte chunk test reaches index 32768 and checks the last encoded bytes.
The import and export tests also stop after the second digest and expect two digests.
