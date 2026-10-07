# Round 2 corrections

Tree read: `3b726505157e146cf3ee07326044abb200d37f8b`.

| Review item: first words | Correction |
|---|---|
| `The cap test asserts` | Await rejection; remove the unused clock; add mutation 46. |
| `Task 8 is checked` | Use a mock deadline and the TimeoutError signal reason; repeat mutation 40. |
| `proposal.md says the design` | Add the CCTV delay, OSH guard and USB guards; name 50 ms. |
| `Each Date.now check` | Compare exact elapsed literals: 20, 25 and 20 ms. |
| `await requestStarted has no` | Add cleared 2000 ms guards; add mutations 48 and 49. |
| `No mutation proves` | Add mutations 50, 51 and 52; check timer closure at its source; prove the absence checks with rows 53 and 54. |
| `Tasks 13, 16 and` | Check the tasks from the lead host log; name that evidence as before the round 2 edits. |
| `The command rg` | Search all 17 files; add the seventh absence delay. |
| `const rejected` | Restore the original awaited rejection in the cap test. |
| `the factor in the` | Use factor 20 and file names. |
| `complete gates assessment` | Use gates run. |
| `array identity checks` | Use surface identity checks and measurement load. |
| `short real wait` | Use short real delay. |
| `takes precedence` | Use has priority. |
| `Mutation: Report` | Use Make production for each mutation note. |
| `holding the test open` | State that the deadline assertion fails, so the test cannot stay open. |
| `Change device deadlines` | Add articles; place mutation notes outside task instructions. |
| `Its fixed delay` | Name the fixture and the production file. |
| `Run the predispatch check` | Name predispatch.py and scripts/format.mjs. |
| `with room for CPU` | Use long enough for CPU load in both comments. |
| `with a missing clock` | Use when a clock callback does not run. |
| `lets promise callbacks finish` | Use allows the promise callbacks to finish. |

The cap correction follows the lead instruction to restore await assert.rejects.
The alternative await rejected has the same result, but is unnecessary.
The sentence about test completion uses active verbs to avoid a new STE warning.
The other corrections follow the review replacements.

## Terms

OpenSensorHub (OSH) names the sensor service.
Closed-circuit television (CCTV) names the camera service.
The universal serial bus (USB) connects the receiver.
The Domain Name System (DNS) supplies network addresses.
HTTP Live Streaming (HLS) names the media format.
The central processing unit (CPU) supplies processor time.

The Hypertext Transfer Protocol (HTTP) carries web requests.

## File checks

Command: `round2-check.py` starts one Node process per file without the force-exit flag.
Each Node process uses cores 12-15 and nice priority 19.
The measurement load uses three Node loops, or three shell loops for launcher files.
Each loop stops after its file assessment.
The full output is in `round2-checks` in the tools directory.
The JSON summary is `round2-check-results.json`.

| File | No-load tests/pass/fail | Load tests per process | Load processes | Load failures |
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
The filtered checks pass; the host must repeat the complete socket files after the round 2 changes.
All 85 load processes have zero failures and no stopped process.
The load processes report 1105 tests in total.

## New mutation rows

Command: `mutate.py` checks the complete 54-row file in the separate clone.
The final assessment has 54 failed selected tests and no stopped process.
Row 40 fails the converted OSH timeout test.
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
The host preload completes both format commands for 1158 files.
The source diff has no production file, scenario text or review report change.

## Files changed in round 2

Command: `git status --short` for the current tree.
The diff from `HEAD` changes these test files and prose files.

- `openspec/changes/harden-timing-tests/design.md`
- `openspec/changes/harden-timing-tests/proposal.md`
- `openspec/changes/harden-timing-tests/tasks.md`
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
- `openspec/changes/harden-timing-tests/corrections.md`

## Prose checks

Command:

```text
taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change harden-timing-tests
```

The lint reports 0 errors and 435 warnings.

Command:

```text
taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/harden-timing-tests
```

The predispatch error summary is empty.
