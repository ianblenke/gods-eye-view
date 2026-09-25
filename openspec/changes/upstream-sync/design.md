## Context

The fork and the upstream project share the commit `3ca81fb`, from 2026-09-13. Since then, the upstream project merged 61 pull requests, and the fork added the OSH layers, the video relay and the spec gates. The two branches changed 106 files in the same way or in a way that conflicts.

The merged commit is `b210ab0`. This change makes one merge commit, and the change `ledger-adopt` gives the gates the command that this merge needs.

## Goals and non-goals

- Bring the upstream code into the fork, with the OSH work and the credential boundary intact.
- Make the merged tree pass the gates, with an exact record of each gap that comes with the merge.
- Do not write specs for the upstream features. The backfill changes do that.
- Do not change the behavior of the OSH layers or of the geocoding, only the place where they connect.

## D1 The merge commit

The merge commit has the fork as its first parent and `b210ab0` as its second parent. A person resolved the conflicts by hand. The resolution follows one rule: upstream owns the structure of the application, and the fork adds its own modules to that structure.

The rule gives these results. The page `index.html` is the shell of upstream, and the templates of upstream hold the markup. The layers of the application come from `src/app/constructCatalog.js`, and the file `src/data/localLayers.js` stays for the test of `osh-033` only. The runtime files follow the format of upstream.

## D2 The OSH layer in the new structure

The panel of the OSH layer is an `aside` element with the id `osh-panel`. It moves from `index.html` to the template `src/ui/templates/context.html`, before the element `scene-runtime`. The test of `osh-094` expands the templates as the build does, and it reads the style sheets with their imports.

The layer token must match `^[a-z0-9]$` and must be unique. Upstream uses all letters, so the OSH layer gets the token `3`. The registry has 29 layers, and the application catalog has 30 layers.

The application catalog builds the OSH layer with `createApplicationOsh()` from `src/app/layers/osh.js`, right after the recent-imagery layer. A test of upstream pins the order of the layers from traffic to directions, so the place after recent imagery does not change that order. The scenario `osh-095` states this place.

The module `createOshPanelHosts` moves to `src/layers/osh/hosts.js`. The application wrapper then imports only the package entry `src/layers/osh/index.js`, as the package boundaries of upstream demand. The boundary lists in `scripts/package-boundaries.json` get the OSH modules.

## D3 The credential boundary in the new search code

Upstream rewrote the place search and the reverse geocoder, and its new code called the Google host with a key from the page. The credential boundary forbids that. So `src/search/http.js` sends the reverse lookup to `/api/google/geocode?lat=...&lon=...`, and `src/search/defaults.js` sends the forward lookup to the same route. Neither request has a key.

The reverse geocoder remembers an answer `configured:false` for the life of the page. It also remembers a definitive answer with a Google status for one coordinate. It never remembers an error answer. The 13 tests of `credential-boundary-014` moved from `src/voice/gevActions.test.mjs` to `src/search/reverseGeocodeRoute.test.mjs`, because the code moved to the provider. Upstream also has a Nominatim provider as a last resort, so a miss makes three calls. The scenario text of `credential-boundary-014` names the provider, and no more the voice actions.

## D4 The two upstream tests that the gates stop

The test file `src/sdr/controller.test.mjs` has a helper `within` that races a promise against a timer of one second. The helper never cleared the timer, so 15 timers were alive at the end of the process. The gates stop for that (`coverage-gate-049`). The helper now clears its timer when the promise wins.

The ingestion test of `server/providers/transitHistory.test.mjs` measures wall-clock time for 15000 vehicles. It takes about 0.8 seconds for one poll when it runs alone with coverage. The gates run many test processes at the same time, and the test failed with its ceiling of two seconds. The ceiling is now ten seconds. A quadratic ingestion of 15,000 rows still takes far longer than that.

## D5 What the command `adopt` adopts

The merged tree has files with gaps that the fork did not have: code files below 100% and test files without scenario IDs. The command `adopt` records these gaps. It adopts a file when two things are true. First, the merged commit changed the file since its merge base with the base commit. Second, the content of the file is not equal to its content in the base commit.

The command needs one run of all the tests. After that, the ratchet command runs the tests again and writes the registry and the links. The gates then check the merged tree against the base ledger, with the adopted count of each file.

Files that the merge commit changed by hand can have a gap that the resolution added. The reviewer reads the Git diff between the merged commit and HEAD for these files. Rule 21 of `AGENTS.md` asks the person who merges this change to check that the upstream remote has the merged commit.

## How the gates measure the requirement

The trace gate needs a changed test for each scenario body that changes: `osh-033`, `osh-094` and `credential-boundary-014`. The scenario `osh-095` has a new test. The other carried scenarios keep their tests and their text.

The code files that this change adds or edits by hand keep the rules of the gates. The new files are `src/app/layers/osh.js` and `src/layers/osh/hosts.js`, and both stay at 100% coverage. The gap of a hand-merged file is inside the adopted count of that file.

## Files that the change adds or changes

- The files that the merge brings from upstream. The command `adopt` records the gaps of these files.
- `index.html`, `style.css`, `src/ui/templates/context.html` and `src/ui/styles/osh-panel.css`: the OSH panel in the new page structure.
- `src/app/constructCatalog.js`, `src/app/layers/osh.js`, `src/layers/osh/hosts.js`, `src/layers/osh/index.js`, `src/data/osh.js`, `src/data/layerState.js` and `scripts/package-boundaries.json`: the OSH layer in the application.
- `src/search/http.js`, `src/search/defaults.js`, `src/search/reverseGeocodeRoute.test.mjs`, `src/search/placeSearch.test.mjs` and `src/voice/gevActions.js`: the credential boundary.
- `src/sdr/controller.test.mjs` and `server/providers/transitHistory.test.mjs`: the two upstream tests.
- `src/app/layers/osh.test.mjs`: the test of `osh-095`.
- `openspec/specs/osh/spec.md` and `openspec/specs/credential-boundary/spec.md`, and the trace files.
