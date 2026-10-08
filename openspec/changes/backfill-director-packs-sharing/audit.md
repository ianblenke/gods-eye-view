# Automatic mutation audit

Base commit: `290b5d2`.

## Method

The automatic tool is `/home/ianblenke/docker/gev-tools/automut/automut.mjs`.
The automatic tool generates code changes by operator class.
The source files stay unchanged.

The first phase excludes six slow tests.
The second phase uses those tests for candidates on affected lines.
The final pass checks every former survivor with all tests.
The [survivor table](survivors.md) gives one result for each former survivor.

The tool records this source commit:

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
The first phase reports 3392 killed, 111 timeout, 11 crash and 335 survived results.
The second phase killed 75 of 193 selected candidates.
The other 118 selected candidates survived.
The unselected candidates and these results give 260 former survivors.

The pass brief counts timeouts and crashes as kills, as Stryker does.
That rule gives 3514 first-phase kills and 3589 kills after the second phase.
The tool README keeps timeouts unresolved and crashes separate.
This audit records each status instead of a test failure for those cases.

The automatic and hand runs cover all review round 2 survivors found by code reading.
The hand table also checks changes that the automatic tool cannot reproduce.
The [hand mutation report](mutations.md) keeps those results.

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

## TIMEOUT results

The source command gives 111 results with this status.

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

The source command gives 11 results with this status.

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
