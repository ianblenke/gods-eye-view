# Coverage count research

Tree read: `d53b57c755cbc168944d4d2280414569e7c64c5b`. The repository has no changed file. The host runs Node `v26.8.2`. The gate uses Node `24.21.0`.

## How the gate measures

`buildTestRuns` puts all tests except two allocation tests in one Node test command. That command enables experimental coverage and gives the lcov reporter one output file. Node starts each test file in its own process and combines its V8 coverage in that lcov file. `executeRuns` starts the main command and the two allocation commands at the same time. The allocation commands do not request coverage. `measure` copies the lcov file to `.gev-cache/spec/lcov.info`. `parseLcov` reads `LF`, `LH`, `BRF`, and `BRH`. It takes the record with the largest gap when one source has more than one URL. `measureCoverage` subtracts covered items from total items. `scripts/run-unit-tests.mjs` runs ordinary tests with `node --test`, then runs allocation tests alone on Node 24. It does not make the gate lcov file.

## Saved reports

The `cyclones` and `qa-register` lcov files have the same SHA-256 source content for all five files. `gev-upstream` has no lcov file. `gev-adopt` has different source. The `gods-eye-view` lcov file predates this code and has no `src/data/lifecycle.js` record. In this table, `C` means `cyclones` and `Q` means `qa-register`. Each cell gives uncovered lines, uncovered branches, and total branches.

| File | C | Q | Exact difference |
|---|---:|---:|---|
| `src/data/lifecycle.js` | 177, 100, 568 | 177, 100, 568 | No raw line or branch change in these two reports. |
| `src/data/labelArbiter.js` | 18, 52, 407 | 18, 50, 405 | `C` has zero-hit `BRDA` records at 140 and 141. `Q` has one extra zero-hit record at 22. No `DA` coverage state changes. |
| `src/layers/wind/rendering.js` | 25, 48, 333 | 25, 48, 333 | No raw change in these two reports. Isolated runs change the branch records at 572. |
| `src/overlays/worldOverlay.js` | 76, 94, 712 | 76, 94, 712 | No raw change in these two reports. A broad run has 711 branches. |
| `server/providers/vessels/ais-store.js` | 40, 30, 76 | 44, 30, 74 | `DA:142` to `DA:145` have two hits in `C` and zero in `Q`. |

For `ais-store.js`, `C` also has `BRDA:117,24,0,2`, `BRDA:141,30,0,2`, and `BRDA:145,31,0,0`. `Q` has `BRDA:141,29,0,0`. Branch block IDs shift between reports. Compare the source line and hit state, not the ID alone.

The exact coverage state changes found in the saved and repeat lcov files are below. `L` is the 20 plain runs of the selected 14-file lifecycle set. `H` is the 20 runs of that set under CPU load. `W` is the 20 isolated wind runs. `B` is the five broad runs. A branch record is present only when shown; its source line, hit count, and presence are the useful fields because V8 can change block IDs.

| File and raw record | Covered or present | Not covered or absent |
|---|---|---|
| lifecycle `DA:2156` through `DA:2162` | `C,Q`: four hits each; `H` 7,11,14,17,19: four each | all 20 `L` and other 15 `H`: zero each |
| lifecycle `DA:2320` and `DA:2321` | `C,Q`: 642 hits each; `L` 6,17 and `H` 3,14,19: 642 each | other 18 `L` and 17 `H`: zero each |
| lifecycle zero-hit `BRDA` at 2154, 2155, 2319 | present in each 186-gap run (`L`: 18; `H`: 14) | `C,Q` and `H` 14,19: all absent; 2154 and 2155 absent when destroy catch gains false hits; 2319 absent when activity catch gains false hits |
| label zero-hit `BRDA` at 22 | `Q`: present | `C` and all five `B`: absent |
| label zero-hit `BRDA` at 140 and 141 | `C`: one and two records present | `Q` and all five `B`: absent |
| wind covered `BRDA` at 572 | `W`: two records in 11 runs | `W`: one record in nine runs; no `DA:572` flip |
| world zero-hit `BRDA` at 520 | `C,Q`: present | all five `B`: absent; no `DA:520` flip |
| AIS `DA:142` through `DA:145` | `C`: two hits each; `B` 1,3,4,5: covered | `Q` and `B` 2: zero hits each |

No label, wind, or world overlay line changes from covered to uncovered in these reports. Their changing branch records are extra V8 records, not a test that newly executes a source path.

Five broad runs with this code have 711 world overlay branches. It has `BRDA:520,101,0,1`. Both saved reports add `BRDA:520,105,0,0`. All three reports give `DA:520,5176`. All five broad runs also have 404 label arbiter branches. Its covered branch count is 355, as in both saved reports. The extra label records are zero-hit records.

## Cause and test evidence

- **Lifecycle:** `destroyLayer` catches a rejected `destroy()` at lines 2156–2162; `_publishActivity` catches a thrown callback at 2320–2321. The 40 runs of one 14-file set give four forms: 186 uncovered lines in 32 runs; 184 in three; 179 in three; and 177 in two. When the first catch gains hits, its two zero-hit branch records disappear. When the second catch gains hits, its zero-hit branch record disappears. The saved 177-line reports also omit all three records. All 40 test runs passed; no log has the warning from either catch. A scratch test that makes both errors occur gives one hit to each path and a covered branch at 2319. Thus the hundreds of apparent catch hits are V8 coverage attribution, not evidence that errors occurred. The precise range or merge step is unknown. No existing test line proves that it executes either catch path. `src/data/manager.test.mjs:2042` and `:3485` are the nearest tests. Static imports can load this code through `manager.js` or `app/data.js` from `src/app/{catalog,constructCatalog}.test.mjs`, `src/data/{aisLiveVessels,bhoteKoshiEvent,detectionRenderDemand,earthquakes,layerSnapshot,layerState,localGeojson,manager,traffic}.test.mjs`, `src/ui/layerKeyRequirement.test.mjs`, and `src/voice/{gevActions,gevRealtime}.test.mjs`.
- **Label arbiter:** `demandEntries` uses `Object.entries(demandByLayer || {})` at line 22. The weighted remainder loop uses `quotas.get(entry.layerId) || 0` at line 140 and a quota comparison at 141. `src/data/labelArbiter.test.mjs:54–59` calls that path with an object and a Map. `src/data/labelArbiterDifferential.test.mjs` also imports the module. The line hit counts are the same in the saved reports. Only zero-hit branch records change. There is no timer in these tests. The exact V8 range cause is not known.
- **Wind:** `paint` tests particle age and view position at line 572. `src/layers/wind/rendering.test.mjs:614–617` calls the stored frame callback with fixed times. The line has `DA:572,24182` in both isolated forms. One form has one covered `BRDA` record. The other has two covered records. The branch total changes by one with no line execution change. This is a reporter artifact.
- **World overlay:** `normalizeOverlayEntry` selects `sourceAlpha` at line 520. `src/overlays/worldOverlay.test.mjs:984` creates a normalized entry, and line 1876 supplies a function value. The 711 and 712 reports both give line 520 exactly 5,176 hits. `src/data/detectionHost.test.mjs`, `src/data/firmsHorizonCull.test.mjs`, and `src/layers/cyclones/labels.test.mjs` also import this module. The 712 report adds one zero-hit branch. This is a branch record artifact. The exact V8 trigger is not known.
- **AIS store:** `appendAisTrackSample` reaches lines 142–145 after a track already exists. `src/tooling/liveProviders.test.mjs:175–203` sends two fixes per socket. Lines 228–231 restart the socket and wait only for a second connection. The test ends before it waits for the second pair of messages. Those messages sometimes reach the store before forced test exit. The five sentinel tests at `src/data/aisStreamSentinels.test.mjs:26–65` use different vessel IDs and do not reach this path.

## Repeat runs and rates

The host has 16 cores. Each CPU load run used 16 busy Node loops. The scripts killed the loop PIDs at exit. Each named test file ran in its own Node process. These rates use only completed runs with exit status zero.

| Run set | Plain, 20 runs | CPU load, 20 runs |
|---|---:|---:|
| Ten named files together: AIS lines 142–145 covered | 20 | 4 |
| Ten named files together: wind line 572 has two covered branch records | 13 | 9 |
| Ten named files together: lifecycle catch lines change | 0 | 0 |
| Ten named files together: label or world branch count changes | 0 | 0 |
| `liveProviders.test.mjs` alone: AIS lines 142–145 covered | 20 | 15 |
| Fourteen lifecycle files together: activity catch lines 2320–2321 covered | 2 | 3 |
| Fourteen lifecycle files together: destroy catch lines 2156–2162 covered | 0 | 5 |

The ten-file and 14-file plain and load sets each passed all 20 runs. Under load, the 14-file lifecycle set gave gaps of 186 in 14 runs, 184 in one, 179 in three, and 177 in two. Its branch totals were 571, 570, 569, and 568, in the same order. The plain set gave gaps of 186 in 18 and 184 in two. Five broad runs also passed. They omit only the two allocation tests and `gates.test.mjs`. Their lifecycle gap was 177 in all five runs. Their label branch total was 404 in all five runs. Their world branch total was 711 in all five runs. Wind had 333 branches in two runs and 334 in three. AIS had 40 uncovered lines in four runs and 44 in one. The isolated `manager`, `bhoteKoshiEvent`, `constructCatalog`, `detectionRenderDemand`, `labelArbiter`, `labelArbiterDifferential`, `worldOverlay`, and `aisStreamSentinels` files each had 20 plain runs with fixed coverage. The first 20 `liveProviders` runs in the network sandbox failed at `listen EPERM`. The rates above use 40 later runs with local loopback access. The first attempt at a complete suite stopped before the end. Its gate test file ran a prohibited nested gate command. It has no verdict.

## Smallest changes to test

1. Add two scenarios before any code or test change. Add tests beside `src/data/manager.test.mjs:2042` and `:3485`. Make `destroy()` return false. Check that `destroyLayer()` returns false and keeps the layer. Make one activity listener throw, then check that a second listener still receives `status`. A scratch copy passes both tests. Removing the false-return rejection at `src/data/lifecycle.js:2153` fails the first test. Rethrowing at line 2320 fails the second test. These tests always execute the nine catch lines.
2. Add a timed three-fix test beside `src/data/aisStreamSentinels.test.mjs:58`. Use a fake `Date.now()`, distinct positions, and 60-second fix gaps. Check that `readAisTrack()` has three samples. A scratch copy passes. Replacing the last-epoch check at `ais-store.js:145` with an unconditional return fails the test. This test always executes lines 142–145.
3. Do not use a split `if` at `wind/rendering.js:572` as a fix. A scratch copy passed the existing rendering test in 20 runs. Its branch total still changed between 334 and 335, and its covered line count also changed. No test-only or source fix for this V8 record shape is proved.
4. The label and world differences involve zero-hit branch records. No test-only fix is proved for their total branch counts. The lead can test a simpler expression at `labelArbiter.js:22,140–141` and a single stored alpha value at `worldOverlay.js:519–521`. Repeat reporter trials before changing the ledger. The gate must keep its coverage check.

## Limits

The saved files do not contain a high-count lifecycle report. The 14-file repeat identifies both catch regions and gives a 177-to-186 range, but it does not give the reported 185 variant. This selected set omits many tests, so it does not prove a full-suite flip. Node 26 can give different V8 coverage shapes from gate Node 24. The broad trials omit `src/tooling/spec/gates.test.mjs` to obey the command limit. I stopped an earlier broad run when `gates.test.mjs` started nested gate commands. I used no data from that stopped run. No repository file changed.
