## Context

Base commit: `1d6b70fc5cc761d0ef1b71be5688f47578610f0e`.
Upstream commit: `73aec2e6b2ecfa865ddb7cb8839fa2d40fd0eb66`.
The command `git ls-remote upstream main` returned the upstream commit on 2026-10-17.
The shared ancestor is the commit `591f299d`, which sync 5 merged.

The first parent of the merge commit is the plan commit. The plan commit has the base commit as its parent.
The upstream commit is the second parent.
The lead must record the check of the second parent in `review.md`.

## Conflict resolutions

A trial merge reported 43 files with conflicts. The table gives the resolution of each file.

| File | Resolution |
|---|---|
| `.dockerignore` | Keep the fork lines. Add the upstream lines that the fork does not have. |
| `.env.example` | Keep the fork line about the geocoding routes, then the upstream lines. |
| `CHANGELOG.md` | Keep the fork entries first and the upstream entries after them. |
| `Dockerfile` | Keep the fork file. See decision D3. |
| `README.md` | Keep the upstream line and the fork words "first estimates". |
| `SECURITY.md` | Keep the text of both sides. Name the two upstream geocoding routes. |
| `compose.yaml` | Keep the fork file. See decision D3. |
| `docs/CURRENT-STATE.md` | Keep the upstream line and the fork note about `ONTARIO_511_API_KEY`. |
| `package.json` | Keep the export lines of both sides. |
| `scripts/format-scope.json` | Keep the entries of both sides. |
| `scripts/package-boundaries.json` | Keep the entries of both sides. |
| `server/providers/places/google-key.js` | Use the upstream file. See decision D2. |
| `server/providers/places/google.js` | Use the upstream file. See decision D2. |
| `server/providers/transitHistory.test.mjs` | Use the upstream test, which measures processor time. |
| `src/annotations/annotationResolver.test.mjs` | Use the upstream test. See decision D2. |
| `src/annotations/regionRing.test.mjs` | Use the upstream time limit. |
| `src/app/constructCatalog.js` | Keep the imports and calls of both sides. |
| `src/app/constructCatalog.test.mjs` | Use the layer count 36. See decision D5. |
| `src/app/controls.js` | Keep the fork call `startApplicationView()`. |
| `src/app/sourceComposition.test.mjs` | Use the layer count 36. See decision D5. |
| `src/data/layerState.test.mjs` | Use the merged registry: 35 layers, and the next free token `9`. See decision D1. |
| `src/data/layerStateTokenLedger.test.mjs` | Use the upstream tests with the merged tokens. See decision D1. |
| `src/data/manager.test.mjs` | Use the upstream form of the timer clean-up. |
| `src/director/timeline.test.mjs` | Keep the fork tests and add the upstream test after them. |
| `src/googleGeocodeProxy.test.mjs` | Use the upstream file. See decision D2. |
| `src/googleServerKey.test.mjs` | Use the upstream test. See decision D2. |
| `src/keySetupCore.test.mjs` | Keep the fork tests and add the upstream test after them. |
| `src/layers/perimeters/cards.test.mjs` | Keep the fork scenario IDs in the upstream test names, and add the upstream tests. |
| `src/layers/recentImagery/model.js` | Use the upstream code with the fork lookup `productOf()`. |
| `src/layers/wind/presentation.test.mjs` | Use the upstream sample and the fork test name. |
| `src/locations.js` | Use the upstream file. See decision D4. |
| `src/sdr/controller.test.mjs` | Keep the fork comment. |
| `src/search/defaults.js` | Use the upstream file. See decision D2. |
| `src/search/http.js` | Use the upstream file. See decision D2. |
| `src/search/offlineGeocoders.test.mjs` | Keep the fork test and add the upstream tests after it. Import `CITY_POIS` from `src/cityPois.js`. |
| `src/search/placeSearch.test.mjs` | Use the upstream line. See decision D2. |
| `src/sources/reference.js` | Keep the sources of both sides. |
| `src/sources/reference.test.mjs` | Keep the sources of both sides. |
| `src/ui/layerPanel.js` | Keep the fork layer IDs and the upstream `msg()` label. |
| `src/ui/recentImagery.js` | Use the upstream comment. |
| `src/ui/recentImagery.test.mjs` | Keep the upstream test and the fork test name. |
| `src/voice/gevActions.test.mjs` | Use the upstream test. See decision D2. |
| `style.css` | Keep the imports of both sides. |

## Decisions

### D1: The share link tokens

Upstream gives the token `3` to `gnss-integrity` and the token `4` to `air-quality`.
The fork published the token `3` for `osh-systems` on 2026-09-25 and the token `4` for `reticulum` on 2026-10-13.

The function `validateLayerStateAllocations()` refuses a change to a published token. It also makes each new layer take the next free token.
So in the fork, `gnss-integrity` gets the token `7`, and `air-quality` gets the token `8`.
The change sets these tokens in `src/data/layerState.js` and in `src/data/layerStateTokenReservations.json`.
The upstream tests that use the free digits then use the digit `9` and the two-character tokens.

### D2: The geocoding routes

Upstream adds the routes `/api/google/geocode` and `/api/google/reverse-geocode` in `server/providers/places/google.js`.
The fork route `/api/google/geocode` is in `server/providers/places/geocode.js`. Both sides then add a route on the same path.
The owner decided on 2026-10-17 to use the upstream routes.

The change uses the upstream files for the server and for the browser code of the geocoding.
It removes `server/providers/places/geocode.js`, `server/providers/places/coordinates.js`, `src/googleGeocodeRateLimit.test.mjs` and `src/search/reverseGeocodeRoute.test.mjs`.
It puts back the upstream browser key lines in `src/standalone/application.js` and in four test files. The upstream browser code uses the key only to decide whether to ask Google, and the key does not go in the request.

The delta removes the three fork requirements of the geocoding. Before the archive, the main spec still holds their scenarios, and the trace gate does not ask for their tests. So the IDs go into `openspec/trace/retired-ids.json` only after the archive.

The new requirement "Browser geocoding routes" keeps the one rule that holds for the upstream code: no browser file calls the geocoding host of Google.

The lead removed `resolveApiKey` from `src/standalone/application.js` as a fault. No test failed, because no test calls `createStandaloneApplication()`. The line equals the upstream file. See the Known limit `key-wiring`.

### D3: The Docker files

Upstream adds a `Dockerfile` on Node 24.14.0, a `compose.yaml` with a bind mount and a port on the loopback address only, and a start script.
The fork owns its `Dockerfile` and `compose.yaml`. The spec gates need Node 24.21.0.
With the Codex override on the host network, the upstream start script would trust the LAN router as the gateway.

The owner decided on 2026-10-17 to keep the fork files.
The change removes the upstream test of the upstream Docker contract from `src/dockerLauncher.test.mjs`. The other tests in that file stay.

### D4: The city presets

Upstream moves the table `CITY_POIS` from `src/locations.js` to `src/cityPois.js`.
The fork added the Taiwan and Tampa presets to that table. The change puts them in `src/cityPois.js` before Austin, in the fork order.
The fork tests now import `CITY_POIS` from `src/cityPois.js`.

### D5: The layer counts

The base catalog has 30 layers. The fork adds four layers, and upstream adds two layers. So the catalog tests count 36 layers.
The share link registry has 35 layers: the 29 layers of the base registry, the four fork layers and the two upstream layers.

### D6: The texts in Spanish and Russian

The upstream text check finds eight fork texts that have no mark.
The change marks them with `t()`, `msg()` or `data-i18n-aria-label`, and adds their Spanish and Russian text to the catalogs.
The title of the hidden OSH command row gets the comment `i18n-ignore`, as the upstream product names do.
The change adds the four fork layers to `LAYER_NAME_KEYS` and the Taiwan and Tampa presets to the place names.
It removes the catalog entry `Flying to Austin, TX...`, because no code uses it now.

### D7: Fork tests that the merge breaks

Upstream now puts a no-break space before units and `UTC`, and a word joiner after a hyphen in a word. The change writes these characters into the expected text of the fork tests.

Upstream now needs the header `Data-Present` with the value `true` before it decodes a thumbnail. The change adds this header to the fork test fixtures that expect a thumbnail.

Upstream now writes the panel group labels as `msg('Cameras')` and `msg('Infrastructure')`. The change updates the patterns in the fork registration tests.

The text of each of these scenarios stays as it is.

### D8: The package boundaries

Upstream modules now import `src/i18n/marker.js`. The fork packages that use these modules must own that file too.
The change adds `src/i18n/marker.js` to nine fork packages: `reticulum`, `reticulum-source`, `beemaps`, `beemaps-source`, `beemaps-bursts`, `beemaps-bursts-source`, `osh-provider`, `osh-control-provider` and `osh-layer`.
Decision D6 adds imports of `src/i18n/index.js` to the OSH layer and to the Reticulum layer.
So the packages `osh-layer` and `reticulum` also own `src/i18n/index.js`, `src/i18n/locale.js` and the two catalogs.

### D9: Live timers at the end of upstream tests

The first adopt run stopped with the error `GATES-TEST-LEAK` for six upstream test files.
The gates run the tests with `--test-force-exit`, and a test process must end with no live timer.
The change makes each of these tests clean up the work that it starts:

- `src/layers/airQuality/source.test.mjs`: the test of the large response waits for one Immediate. The cancelled Blob stream then ends first.
- `src/ui/geoFileImport.test.mjs`: after each test, the change destroys each tool that `setup()` made. `destroy()` clears the timer of the ground refresh.
- `src/layers/streetLevel/index.test.mjs`: after each test, the change waits 20 ms, past the 16 ms timer of `whenIdle()`.
- `src/sdr/decoderDiagnostics.test.mjs`, `src/sdr/readPipeline.diag.test.mjs` and `src/sdr/workerAdmission.test.mjs`: the clean-up rejects the open reads of the fake device, as `stop()` stops a real transfer. The read deadline then clears its timer.

The file `evidence/leaks.txt` gives the live timers of each file before and after the change.

### D10: The old gap of the OSH layer

The change edits the owned file `src/layers/osh/index.js` for decision D6. So rule 5 of `AGENTS.md` asks full coverage of that file.
Since 2026-10-03, the ledger has a gap of one branch in that file. The branch is the call `commandView?.clear()` when a feature with no host ends the selection of a system, and a command view is present.
The change adds this case to the test of `osh-control-031`. The scenario says that the layer calls `clear` at deselection, so its text stays as it is.
The fault of this decision removes that call. The test then fails. The file `evidence/fault-d10.txt` gives the run.

## Files and measures

The trace gate checks the scenario IDs and the links. The ledger gate checks the gaps of the upstream files against the adopt records.
The format check, the import direction check, the package boundary check and the layer token check measure the configuration. The prose lint checks STE.
The lead runs the gates in Docker and both review agents on the final tree.
