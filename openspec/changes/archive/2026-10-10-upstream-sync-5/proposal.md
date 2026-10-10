## Why

The owner wants a sync more often than once each week. On 2026-10-10 the owner answered "Yes" to a fifth sync.
Upstream has 23 commits after the fourth sync.
The commits come from five pull requests (#982 to #986). They make the sources of Street Level, Directions and Recent Imagery replaceable. They keep custom Street Level provider switches in share links, and they accept healthy empty vessel coverage.

## What Changes

- Merge upstream commit `591f299d11f38a612629a274463196d57ae3862e` into the plan commit. The plan commit has the base commit `13d715511b4c1aabf943de9c2ba25cb174d3db45` as its parent.
- Resolve six content conflicts in `CHANGELOG.md`, `docs/CURRENT-STATE.md`, `src/app/constructCatalog.js`, `src/data/layerState.test.mjs`, `src/layers/recentImagery/rendering.test.mjs` and `src/layers/recentImagery/thumbnails.test.mjs`.
- Change the layer count in two upstream tests from 30 to 31, because the fork adds the OSH layer.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Keep the upstream code as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

The merge changes 50 files and adds nine of them. None of the 50 files is in `openspec/ownership.json`. The merge changes no file under `server/`.

Rule 23: the nine added files are upstream code, because the fork does not write them. The manifest lists only paths that the fork writes.
The nine added files are `src/app/layers/streetLevel.test.mjs`, `src/app/sourceComposition.js`, `src/app/sourceComposition.test.mjs`, `src/data/idSwitches.js`, `src/layers/directions/source.js`, `src/layers/directions/source.test.mjs`, `src/layers/recentImagery/source.js`, `src/layers/recentImagery/source.test.mjs` and `src/layers/streetLevel/providerSwitches.test.mjs`.

Rule 25: the merge breaks no test with a scenario ID. The change retires no scenario and writes none again.
The tests that the merge adds or changes have no scenario ID. This includes one added test in each of the files `src/layers/recentImagery/rendering.test.mjs` and `src/layers/recentImagery/thumbnails.test.mjs`, The two files have fork tests with scenario IDs.
The change opens no new coverage gap for owned code. The adopt command records the gaps of the upstream files that the merge brings.

The upstream code adds no route and no dependency. It adds two export lines to `package.json` for the new source modules.
The change has no spec delta, because the merge changes no requirement of the fork.

## Known limits and later changes

- Known limit `host-node`: Host tests run on Node 26, and the image uses Node 24.21.0. Host coverage cannot replace the image measurement.
- Known limit `host-skip`: Two test files skip 14 tests on the host, because the host has Node 26 and the tests need Node 24. They are `src/data/focusAllocations.test.mjs` (1) and `src/overlays/worldOverlayAllocation.test.mjs` (13). The image runs them. One Windows test in `src/keySetupHardening.test.mjs` skips on Linux.
- Known limit `osh-source`: The OSH layer is not in the new catalog source contracts. With no sources set, the OSH layer stays available, while the upstream layers with a contract report unavailable. The fork does not change this.
- Known limit `credit`: Recent Imagery passes the credit of its source to Cesium. Cesium turns a text credit into HTML (`Credit.js`, `div.innerHTML`). Only code that builds the catalog sets the credit, and no URL or share link reaches it.
- Known limit `empty-vessels`: The upstream text says that vessel sources can report healthy empty coverage. In the stock adapter, a response with no observation time has the freshness `unknown`, so only a custom source reaches the healthy empty state.
- Known limit `share-options`: `docs/CURRENT-STATE.md` has the upstream text about the `r` option of Street Level. The older Street Level section lists the share options `m`, `p` and `s` and does not list `r`. The fork does not edit the text of upstream.
- Known limit `catalog-count`: The fork edits the layer count of two upstream tests from 30 to 31. A later sync conflicts in these two lines when upstream changes the count.
- Known limit `token-collision`: Upstream has 29 reserved layer tokens and none is `3`. The next new upstream layer can take `3`, which the OSH layer owns. The conflict then shows in `src/data/layerStateTokenReservations.json` at the next sync.
- Known limit `manifest-path`: `openspec/ownership.json` lists `src/layers/oshTasking/`, and that folder does not exist. This is older than this change.
