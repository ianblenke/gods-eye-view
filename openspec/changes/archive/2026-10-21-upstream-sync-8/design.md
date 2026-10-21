## Context

Base commit: `67342d000c56204abd2e08a1cf05d19dd2e99b69`.
Upstream commit: `713285b554bbc99c8ae0261fe307beb3cbeb2adf`.
The lead took the upstream commit from the output of `git ls-remote upstream main` on 2026-10-21.
The shared ancestor is the commit `93ea088f`, which sync 7 merged.

The first parent of the merge commit is the plan commit. The plan commit has the base commit as its parent.
The upstream commit is the second parent.
The lead must record the check of the second parent in `review.md`.

The merge brings 21 pull requests and four direct commits of upstream. `evidence/upstream-check.txt` lists them.

## Conflict resolutions

A merge of the plan commit and the upstream commit in memory reports 16 files with a conflict. The file `evidence/conflicts.txt` shows the conflict list.

| File | Resolution |
|---|---|
| `.env.example` | Keep the fork lines of the OpenSky user name and password. Use the upstream text of Launch Library 2. Remove the fork lines of the Gemini key and the Ontario key, so that each key is on one line. |
| `DATA_SOURCES.md` | Keep the fork row of GDACS (Global Disaster Alert and Coordination System). Use the upstream row of Mapillary. Use the upstream text of Ontario 511. |
| `README.md` | Use the upstream row of the CCTV (traffic camera) packs. |
| `SECURITY.md` | Keep the fork text of the debug log and of the gated routes. Add the upstream sentence about the terrain route. |
| `docs/CURRENT-STATE.md` | Use the upstream row of the CCTV packs, and keep the key name `ONTARIO_511_API_KEY` from the fork row. |
| `package.json` | Keep the fork exports of OSH (OpenSensorHub). Add the upstream export `./agent/world-packet`. |
| `scripts/qa-panel-resize.mjs` | Remove the file, as upstream does. See decision D3. |
| `scripts/qa-panelDrag.mjs` | Remove the file, as upstream does. See decision D3. |
| `scripts/qa-street-level.mjs` | Keep the fork QA header. Use the upstream first line of the description. |
| `server/providers/cctv/constants.js` | Use the upstream comment of Ontario 511. See decision D2. |
| `server/providers/cctv/sources.js` | Use the upstream file. See decision D2. |
| `server/standalone/vite.config.js` | Keep the fork function `standalonePlugins()`. Give it the voice tools of the config and the upstream Gemini option. See decision D1. |
| `src/i18n/locales/es.json` | Keep the fork texts and add the upstream texts. |
| `src/i18n/locales/ru.json` | Keep the fork texts and add the upstream texts. |
| `src/tooling/mapillaryProvider.test.mjs` | Use the upstream file. See decision D4. |
| `src/ui/panelDock.test.mjs` | Remove the file, as upstream does. See decision D3. |

## Decisions

### D1: The plugin list of the standalone server

The fork moved the plugin list of `server/standalone/vite.config.js` into the function `standalonePlugins()`. The fork test `src/tooling/bundleCredentials.test.mjs` builds a page with that list.
Upstream gives the same voice tools to the OpenAI provider and to the new Gemini provider in the call of `localProviderPlugins()`.
The change gives `standalonePlugins()` the parameter `tools`, with the value `standaloneVoiceTools()` when the caller gives no value. The config calls `standalonePlugins(tools)`.
The config then has the same plugins in the same order as upstream.

The fault is to remove the option `gemini` from `standalonePlugins()`. The upstream test of the order of the standalone providers in `src/tooling/viteBuild.test.mjs` must then fail.

### D2: The Ontario 511 key

The change `fix-ontario-511-key` added the module `server/providers/cctv/ontarioRequest.js`. The module reads `ONTARIO_511_API_KEY` and sends it in the parameter `key`.
Upstream pull request #1228 adds the same key, in the same parameter, to `loadOntarioSourcesFromOpenData()` in `server/providers/cctv/sources.js`. It adds the upstream test file `server/providers/cctv/ontario511.test.mjs`.

In sync 6, upstream and the fork each added a geocoding route on the same path, and the owner decided to use the upstream routes. Here upstream and the fork each add the same key in the same parameter. So the lead uses the upstream Ontario code as a default. The owner can change this decision.

The upstream code does not keep two rules of the fork requirement "Ontario camera key":
- The fork wrote one warning in each process for the failed downloads (`live-sources-004`). The upstream code writes a warning for each failed download.
- The fork kept the key text out of each warning (`live-sources-005`). The upstream code writes the message of each error that it catches. When an error message holds the key text, the loader writes the key text to the log.

The Known limits `ontario-warnings` and `ontario-error-text` of the proposal name these rules.

The change removes `server/providers/cctv/ontarioRequest.js` and its test file `src/data/cctvOntarioKey.test.mjs`. It removes the requirement "Ontario camera key" and retires its four scenarios: `live-sources-002`, `live-sources-003`, `live-sources-004` and `live-sources-005`.
After the archive, the lead adds the four IDs to `openspec/trace/retired-ids.json`. The lead also removes their four empty links from `openspec/trace/links.json`.

The change also removes three tests from `src/data/cctvOntarioRows.test.mjs`: one test of `live-sources-003`, one test of `live-sources-004` and one test of `live-sources-005`. The first two tests import the removed module. The upstream code writes the text of an error to the warning, so the third test fails on the merged tree.
The change removes the path of the module from `scripts/package-boundaries.json`.
The requirement "Ontario row rules" stays. Its tests set the key and replace the fetch function, so they test the upstream code.

### D3: The movable panels

Upstream removes the movable panels of the rail. The user could move these panels out of the rail and change their size. Upstream also removes the QA scripts `scripts/qa-panel-resize.mjs` and `scripts/qa-panelDrag.mjs` and the test file `src/ui/panelDock.test.mjs`.
The fork changed those three files only to add QA headers and to stop timers in two tests. The change removes the three files, as upstream does.

The scenario `qa-scripts-023` counts 99 tracked QA scripts and names `qa-panel-resize` and `qa-panelDrag`. The changed scenario counts 97 scripts and names only `qa-browserEvidence`.

### D4: The test of the Mapillary proxy

Upstream keeps the coverage tiles of Mapillary only in memory and removes the tile files on disk. Upstream writes `src/tooling/mapillaryProvider.test.mjs` again.
The fork changed that test file only in the tests of the sweep of the tile files. Those tests are not in the upstream file. The change uses the upstream file.

### D5: The test of the Street Level layer

The file `src/layers/streetLevel/index.test.mjs` merged with no conflict. The fork added two edits to it. Sync 6 added a wait of 20 ms after each test, because `whenIdle()` in `view.js` waited 16 ms on a timer. Sync 3 stopped the timers of one test.

Upstream removes `whenIdle()` from `view.js`. Two new upstream tests use mock timers. So the wait of 20 ms of sync 6 never ends, and the two tests stop at their time limit.
The change uses the upstream file. `evidence/street-level.txt` shows that the upstream file passes on the host and leaves no live timer when the process ends.

### D6: Live immediates at the end of three upstream test files

The gates run the tests with `--test-force-exit`, and a test process must end with no live timer or immediate.
A host probe found one live immediate at the end of each of three upstream test files: `src/layers/launches/ingestion.test.mjs`, `src/layers/satellites/stale.test.mjs` and `src/tooling/ll2Integration.test.mjs`.
Each of these files sends requests with the fetch function of Node to a test server. The stack of each live immediate starts in WebAssembly code.

The change makes each of these test files wait for one immediate after it closes its servers. The probe then finds no live immediate.
The file `evidence/leaks.txt` gives the probe results and the stacks before and after the change.

### D7: The coverage of the sliced Panoramax decoder

The upstream function `decodeCoverageTileSliced()` in `src/layers/streetLevel/providers/panoramax/decode.js` decodes a tile in slices. When a slice takes 8 ms or more, the function calls its pause function, so that the page can do other work.
The default pause function is `nextTask()`, and the default clock is `performance.now()`.
Before this change, only the provider called `decodeCoverageTileSliced()` with the default pause function and clock. So `nextTask()` ran only when the machine was slow.

Thus the function coverage of `decode.js` was not the same each time that the tests ran. The adopt run measured no function without coverage in `decode.js`. The first ratchet run measured one function without coverage and stopped with the error `LEDGER-LOST-COVERAGE`.

The change adds assertions to an upstream test in `src/layers/streetLevel/providers/panoramax/decode.test.mjs`. The name of the test is "a sliced decode gives the page turns and decodes the same as one in one go".
The test calls `decodeCoverageTileSliced()` again with a slice of 0 ms and the default pause function and clock. It compares the result with the result of `decodeCoverageTile()`.

The test replaces `setTimeout()` and `performance.now()` with mock functions. Each mock function records each call and then calls the real function. The test asserts more than 20 calls of `setTimeout()` with 0 ms and more than 20 calls of `performance.now()`.

A slice of 0 ms calls the pause function at each step, so `nextTask()` and the default clock run each time that the test runs.
`evidence/decode-coverage.txt` gives the ratchet error and the function counts before and after the change. `evidence/fault-d7.txt` gives three faults in `decode.js`, and each fault makes the test fail.

### D8: The adopt command

The merge brings upstream tests with no scenario ID and upstream files with a coverage gap.
The adopt command records them.

### D9: The image of the gates

The merge does not change `package-lock.json`. The lead runs each Docker command of this change with the image `gods-eye-view:local`.

## Files and measures

The change removes one fork code file and one fork test file. It edits two fork test files, four upstream test files, `.env.example` and `scripts/package-boundaries.json`. It adds the plan, the evidence and the review files. The merge changes 268 files.

The trace gate checks the scenario IDs and the links. The ledger gate checks the gaps of the upstream files against the adopt records.
The four checks of `make precheck` check the format, the import directions, the package boundaries and the layer tokens. The prose lint checks STE.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave. The capability also has the requirement "Ontario row rules".
