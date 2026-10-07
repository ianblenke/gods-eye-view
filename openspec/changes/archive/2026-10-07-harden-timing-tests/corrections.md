## Terms

OpenSensorHub (OSH) names the sensor service.
Closed-circuit television (CCTV) names the camera service.
The universal serial bus (USB) connects the receiver.
The Domain Name System (DNS) supplies network addresses.
The central processing unit (CPU) supplies processor time.

The Hypertext Transfer Protocol (HTTP) carries web requests.
HTTP Live Streaming (HLS) names the media format.
An application programming interface (API) defines calls between software parts.
JavaScript Object Notation (JSON) is a data format.
An identifier (ID) names one item.

# Round 2 corrections

Base commit 290b5d2. The work started at commit 3b72650. The checks include the changes in commit b95b44f. The command `git diff` between commits b95b44f and d923d4d, limited to the folder `src`, prints nothing.

| Review item: first words | Correction |
|---|---|
| ``The `[osh-015]` cap test`` | Await rejection; remove the unused clock; add mutation 46. |
| `Task 8 is checked` | Use a mock deadline and the TimeoutError signal reason; repeat mutation 40. |
| `proposal.md:37 says the design` | Add the CCTV delay, the OSH guard and the USB guards; name 50 ms. |
| ``Each `Date.now() - startedAt`` | Compare exact elapsed literals: 20, 25, 20 and 20 ms. |
| `await requestStarted has no` | Add cleared 2000 ms guards; add mutations 48 and 49. |
| `No mutation proves` | Add mutations 50, 51 and 52; check that production clears the timer at its source; prove the absence checks with rows 53 and 54. |
| `Tasks 13, 16 and` | Mark the tasks from lead3-tests.log; the checks come after the round 2 edits. |
| `The command rg` | Search all 17 files; add the seventh absence delay. |
| `const rejected` | Restore the original awaited rejection in the cap test. |
| `the factor in the` | Use the factor 20 and file names. |
| `complete gates assessment` | Use "gates run". |
| `array identity checks` | Use "surface identity checks and measurement load". |
| `short real wait` | Use "short real delay". |
| `takes precedence` | Use "has priority". |
| `Mutation: Report` | Use "Make production" for each mutation note. |
| `holding the test open` | State that the deadline assertion fails, so the test cannot stay open. |
| `Change device deadlines` | Add articles; place mutation notes outside task instructions. |
| `Its fixed delay` | Name the fixture and the production file. |
| `Run the predispatch check` | Name predispatch.py and scripts/format.mjs. |
| `with room for CPU` | Use "long enough for CPU load" in both comments. |
| `with a missing clock` | Use "when a clock callback does not run". |
| `lets promise callbacks finish` | Use "allows the promise callbacks to finish". |

The cap correction follows the lead instruction to restore await assert.rejects.
The alternative await rejected has the same result, but is unnecessary.
The sentence about test completion uses active verbs to avoid a new STE warning.
The other corrections follow the review replacements.

## File checks

Command: `round2-check.py` starts one Node process per file without the force-exit flag.
Each Node process uses the CPU set 12-15 and nice priority 19.
The measurement load uses three Node load loops, or three shell load loops for launcher files.
Each loop stops after its file run.
The full output is in `round2-checks` in the tools directory.
The JSON summary is `round2-check-results.json`.

| File | No-load tests/pass/fail | Load tests per process | Test processes under load | Load failures |
|---|---|---:|---:|---:|
| `src/sdr/controller.test.mjs` | 24/24/0 | 24 | 5 | 0 |
| `src/cameraGroundGuard.test.mjs` | 20/20/0 | 20 | 5 | 0 |
| `src/data/cctvHlsStream.test.mjs` | 10/10/0 | 10 | 5 | 0 |
| `src/data/cctvMediaRange.test.mjs` | 21/18/3 | 18 | 5 | 0 |
| `src/data/cctvProxy.test.mjs` | 14/14/0 | 14 | 5 | 0 |
| `src/data/gbfsProxy.test.mjs` | 11/11/0 | 11 | 5 | 0 |
| `src/data/localReceiversProxy.test.mjs` | 12/10/2 | 10 | 5 | 0 |
| `src/services/requests.test.mjs` | 6/6/0 | 6 | 5 | 0 |
| `src/data/directions.test.mjs` | 24/24/0 | 24 | 5 | 0 |
| `src/ui/localSdrControls.test.mjs` | 4/4/0 | 4 | 5 | 0 |
| `src/tooling/nominatimSearchRoute.test.mjs` | 10/10/0 | 10 | 5 | 0 |
| `src/tooling/localServices.test.mjs` | 10/9/1 | 9 | 5 | 0 |
| `src/devCctv.test.mjs` | 4/4/0 | 4 | 5 | 0 |
| `src/toolProjectRoot.test.mjs` | 3/3/0 | 3 | 5 | 0 |
| `src/data/oshGet.test.mjs` | 35/35/0 | 35 | 5 | 0 |
| `src/layers/traffic/navigation.test.mjs` | 15/15/0 | 15 | 5 | 0 |
| `src/app/layers/osh.test.mjs` | 4/4/0 | 4 | 5 | 0 |

The complete checks of three socket files have six failures from `listen EPERM`.
The filtered checks pass; the lead log `lead3-tests.log` records complete checks after the round 2 changes.
All 85 test processes under load have zero failures and no stopped process.
The test processes under load report 1105 tests in total.

## New mutation rows

Command: `mutate.py` checks the complete 54-row file in the separate copy.
The final run has 54 failed selected tests and no stopped process.
Row 40 makes the converted OSH timeout test fail.
Each row below links to the command output that names the failed test.
The log files are in the tools directory at `mutation-real`.

| ID | Test file | Production change | Failed test |
|---|---|---|---|
| 46 | `src/data/oshGet.test.mjs` | Ignore the declared body cap. | [[osh-015] fails a request](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/46.log) |
| 47 | `src/data/cctvProxy.test.mjs` | Use the wrong frame deadline reason. | [CCTV upstream frame fetch](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/47.log) |
| 48 | `src/tooling/nominatimSearchRoute.test.mjs` | Do not call the search upstream. | [identical searches in flight](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/48.log) |
| 49 | `src/tooling/localServices.test.mjs` | Do not call the weather upstream. | [weather-only requests share upstream](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/49.log) |
| 50 | `src/sdr/controller.test.mjs` | Do not clear the expired device deadline. | [a stalled USB read](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/50.log) |
| 51 | `src/data/cctvHlsStream.test.mjs` | Do not clear the poll timer on expiry. | [idle cleanup stops all](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/51.log) |
| 52 | `src/data/localReceiversProxy.test.mjs` | Accept a DNS answer after the deadline. | [a stalled DNS lookup](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/52.log) |
| 53 | `src/data/cctvHlsStream.test.mjs` | Continue downloads after lease expiry. | [idle cleanup stops all](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/53.log) |
| 54 | `src/data/localReceiversProxy.test.mjs` | Fetch the feed after a late DNS answer. | [a stalled DNS lookup](/home/ianblenke/docker/gev-tools/harden-timing/mutation-real/54.log) |

## Other checks

The commands `compare-coverage.py` and `compare-counts.py` report 995 comparisons.
The comparisons show no lost covered lines and no smaller covered branch or function totals.
The normal format commands stop at `spawnSync git EPERM`.
With the preload file `format-host.mjs`, both format commands finish for 1158 files.
The source diff has no production file, scenario text or review report change.

## Files changed in round 2

The round 2 record used `git status --short` before the archive.
The list below gives those files at their current paths.

- `openspec/changes/archive/2026-10-07-harden-timing-tests/design.md`
- `openspec/changes/archive/2026-10-07-harden-timing-tests/proposal.md`
- `openspec/changes/archive/2026-10-07-harden-timing-tests/tasks.md`
- `src/data/cctvHlsStream.test.mjs`
- `src/data/cctvProxy.test.mjs`
- `src/data/gbfsProxy.test.mjs`
- `src/data/localReceiversProxy.test.mjs`
- `src/data/oshGet.test.mjs`
- `src/devCctv.test.mjs`
- `src/sdr/controller.test.mjs`
- `src/services/requests.test.mjs`
- `src/toolProjectRoot.test.mjs`
- `src/tooling/localServices.test.mjs`
- `src/tooling/nominatimSearchRoute.test.mjs`
- `openspec/changes/archive/2026-10-07-harden-timing-tests/corrections.md`

## Prose checks

Command:

```text
taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint
```

The lint reports 0 errors.

Command:

```text
taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/archive/2026-10-07-harden-timing-tests
```

The predispatch error summary is empty.
