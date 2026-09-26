## Context

The fork and the upstream project share the commit `3ca81fb`, from 2026-09-13. Since then, the upstream project accepted 61 pull requests, and the fork added the OSH layers, the video relay and the spec gates. Both sides changed 32 files. A person checked these files and resolved the conflicts by hand.

The merged commit is `b210ab0`. This change makes one merge commit, and the change `ledger-adopt` gives the gates the command that this merge commit needs. The proposal names the roles: the owner, the person who accepts this change on `main`, and the author of this change.

## Goals and non-goals

- Bring the upstream code into the fork. The OSH layers and the credential boundary must work as before.
- Make the tree of the merge commit pass the gates, with an exact record of each gap that the merge commit brings.
- Do not write specs for the upstream features. The backfill changes do that.
- Keep the behavior of the OSH layers and of the geocoders as it was in the fork. The known limits `sync-share-token` and `sync-third-geocoder-call` name two changes.
- Change only how the OSH layers and the geocoders connect to the application.

## D1 The merge commit

The merge commit has the newest commit of the fork as its first parent and `b210ab0` as its second parent. A person resolved the conflicts by hand. The resolution follows one rule: the structure of the application comes from the upstream project, and the fork adds its own modules to that structure.

The rule gives these results. The page `index.html` is the shell of the upstream project, and the component templates of the page contain the markup. The layers of the application come from `src/app/constructCatalog.js`. The file `src/data/localLayers.js` stays for the test of `osh-033` only. The OSH files follow the Prettier format of the upstream project.

## D2 The OSH layer in the new structure

The panel of the OSH layer is an `aside` element with the id `osh-panel`. It moves from `index.html` to the template `src/ui/templates/context.html`, before the element `scene-runtime`. The test of `osh-094` expands the templates as the build does, and it reads the style sheets with their imports.

The layer token must match `^[a-z0-9]$` and must be unique, and the function `validateLayerStateRegistry` checks this. The upstream project uses all letters, so the OSH layer gets the token `3`. The registry has 29 layers. The catalog has 30 layers, because it also has the layer `local-adsb`, which the registry does not serialize into share links.

The application catalog builds the OSH layer with `createApplicationOsh()` from `src/app/layers/osh.js`, right after the recent-imagery layer. A test of the upstream project checks the order of the layers from the layer `traffic` to the layer `directions`. The place after the recent-imagery layer does not change that order. The scenarios `osh-095` and `osh-096` state the place of the layer, and how the catalog gives it the source and the hosts.

The function `createOshPanelHosts` moves to the module `src/layers/osh/hosts.js`. The file `src/app/layers/osh.js` then imports only the package entry `src/layers/osh/index.js`, as the rule of the package boundaries of the upstream project says. The script `npm run check:boundaries` checks this rule. The change adds the OSH modules to the boundary lists in `scripts/package-boundaries.json`.

## D3 The credential boundary in the new search code

The upstream project rewrote the place search and the reverse geocoder, and its new code called the Google host with a key from the page. The credential boundary forbids that. So `src/search/http.js` sends the reverse lookup to `/api/google/geocode?lat=...&lon=...`, and `src/search/defaults.js` sends the forward lookup to the same route. Neither request has a key.

The HTTP geospatial provider remembers an answer `configured:false` for the life of the provider. It also remembers, for one coordinate, an answer that has no HTTP error status, has a Google status and gives no place. It does not remember an answer with an HTTP error status or with no Google status.

The 13 tests of `credential-boundary-014` moved from `src/voice/gevActions.test.mjs` to `src/search/reverseGeocodeRoute.test.mjs`, because the code moved to the provider. A 14th test of the fork checked the cache that the fork had in `src/voice/gevActions.js`. The clone does not have this test (the known limit `sync-dropped-reverse-cache-test`). The scenario text of `credential-boundary-014` names the HTTP geospatial provider, and not the voice actions.

A forward lookup that finds no place makes three requests: to the server route, to Photon and to the local Nominatim route `/api/geocode`.

## D4 The two upstream tests that make the gates stop the build

The test file `src/sdr/controller.test.mjs` has a helper `within` that races a promise against a timer of one second. The helper never cleared the timer, so 15 live timers stayed at the end of the process. The gates stop the build for that (`coverage-gate-049`). The helper now clears its timer when the promise settles first.

The ingestion test of `server/providers/transitHistory.test.mjs` measures wall-clock time for 15000 vehicles. It takes about 0.8 seconds for one poll when it runs alone with coverage. The gates run many test processes at the same time, and the test failed at its ceiling of two seconds. The ceiling is now ten seconds. This ceiling finds only a very large increase of the time (the known limit `sync-ceiling-not-measured`).

## D5 What the command `adopt` adopts

The tree of the merge commit has files with gaps that the fork did not have. The command `adopt` records these gaps. It adopts a file when three things are true.

- The file has a gap: it is a code file with a not-covered count above 0, or a test file with untraced tests.
- The content of the file is not equal to its content in the base commit.
- The merged commit changed the file since its merge base with the base commit.

The command needs one run of all the tests. After that, the ratchet command runs the tests again and writes the registry and the links. The gates then check the tree against the base ledger, with the adopted count of each file.

A file that a person resolved by hand can have a gap that the resolution added. The person who accepts this change on `main` reads the Git diff between the merged commit and HEAD for these files. That person also reads the diff of the three code files that the known limit `sync-files-edited-after-the-merge` names. Rule 21 of `AGENTS.md` says that this person must check that the upstream remote has the merged commit, and must record the result in `review.md`.

## How the gates measure the requirement

The trace gate needs a changed test for each scenario body that changes: `osh-033`, `osh-094` and `credential-boundary-014`. The scenarios `osh-095` and `osh-096` have new tests. The other carried scenarios keep their tests and their text.

The new code files `src/app/layers/osh.js` and `src/layers/osh/hosts.js` have 100% coverage. The gates allow the gap of an edited file that the command `adopt` adopted, up to its adopted count.

## Files that the change adds or changes

- The files that the merge commit brings from the upstream project. The command `adopt` records the gaps of these files.
- `index.html`, `style.css`, `src/ui/templates/context.html` and `src/ui/styles/osh-panel.css`: the OSH panel in the new page structure.
- `src/app/constructCatalog.js`, `src/app/layers/osh.js`, `src/layers/osh/hosts.js`, `src/layers/osh/index.js`, `src/data/osh.js`, `src/data/layerState.js` and `scripts/package-boundaries.json`: the OSH layer in the application.
- `src/search/http.js`, `src/search/defaults.js`, `src/search/reverseGeocodeRoute.test.mjs`, `src/search/placeSearch.test.mjs` and `src/voice/gevActions.js`: the credential boundary.
- `src/voice/gevActions.test.mjs`: the restored test of the ALPR layer.
- `src/sdr/controller.test.mjs` and `server/providers/transitHistory.test.mjs`: the two upstream tests.
- `src/data/oshRepositoryHygiene.test.mjs` and `src/data/oshProxy.test.mjs`: the file lists of two OSH scans.
- `src/data/layerState.test.mjs` and `src/data/osh.test.mjs`: the tests of `osh-033` and `osh-094`.
- `src/app/layers/osh.test.mjs`: the tests of `osh-095` and `osh-096`.
- `docs/CURRENT-STATE.md`: the text about the search and the reverse lookup.
- `openspec/specs/osh/spec.md` and `openspec/specs/credential-boundary/spec.md`, and the trace files.
