## Context

The fork has its own Docker setup, its own layers and its own tokens for share links. Upstream changed some of the same files. A trial merge in a clone gave 19 conflicts.
After the resolutions, the test files of the host showed 13 failing files. Decisions D1 to D11 give the cause and the fix of each failure.
The lock file `package-lock.json` is the same on both sides, so the image of the fork (`gods-eye-view:local`, Node 24.22.1) runs the gates.

## Goals / Non-Goals

**Goals:**
- Bring the upstream code into the fork with the fork layers, tokens and Docker files intact.
- Keep every test of the host green, except the timing test of the Known limit `host-timing`.
- Record the coverage gaps of the new upstream files with the adopt command.

**Non-Goals:**
- Specs and tests for the new upstream code. Later backfill changes add them.
- The health check of the Docker image and the SELinux flag of upstream.
- A change of the code of upstream, except for the two edits of D3.

## Decisions

### D1: Docker files of the fork

The merge keeps `Dockerfile`, `compose.yaml` and `SECURITY.md` of the fork. The fork runs `npm run dev` with named volumes. It does not use the launcher `scripts/docker-start.mjs`.

The test of the compose file in `src/dockerTrustedPeers.test.mjs` reads the compose file of upstream. It fails for the compose file of the fork, so the change removes this one test. The other three tests of the file stay.
The fork already removed the matching test in `src/dockerLauncher.test.mjs` in an earlier sync, so the merge keeps that removal.

### D2: Token of the layer s2-ghostmaps

Upstream gives the layer `s2-ghostmaps` the token `5`. The fork gave `5` to the layer `beemaps` before. A second owner of one token breaks every share link of the fork.

The fork gives `s2-ghostmaps` the next free token `03`. The next free token is then `04`. The ledger and the registry hold 40 layers, and the catalog holds 41 layers.
The tests of the ledger leave out the layer `s2-ghostmaps` from their fixtures, as they leave out `gdacs` and the three scene layers.

### D3: HUD, standalone plugins and CSS

Upstream wraps each HUD readout in a `hud-readout` element for the Scope controls. The merged `src/hud.js` has the wrappers and has no classification text, because the fork removed the markings.

Upstream adds the plugin `googleTokenUnavailablePlugin()` to the inline list of plugins. The fork moved that list into `standalonePlugins()`, so the change adds the plugin there.
The CSS rule `.hud-readout:has(> :is(.hud-classification, .hud-system))` in `src/ui/styles/overlays.css` names the removed element. The change shortens it to `.hud-readout:has(> .hud-system)`, so the test of `hud-markings-004` passes. The rule in `cyber.css` stays as upstream has it, because a test of upstream reads it.

### D4: Upstream wins for four files

The merge takes the upstream version of `build/vite.js`. Its deny list is the list of the fork, plus the root-anchored `dist` rule. The merge also takes the upstream version of `src/camera.js`, because upstream removes the unused presets. The merge takes the added import line of `scripts/qa-transit-scenes.mjs` too.
The merge removes `src/data/localLayers.js`, because upstream removes it and nothing in the fork reads it.

### D5: The scenario osh-033

The scenario named `src/data/localLayers.js` and said that the registry has 37 entries. The file is gone, and the registry has 40 entries. The delta spec changes the scenario. The requirement text stays as it is. The test of `osh-033` no longer imports the file.

### D6: Cyclone labels

Upstream corrects the NHC codes: `PTC` is "Post-tropical cyclone", `PC` is "Potential tropical cyclone", and the subtropical codes are `STS` and `STD`. It also stops to export `cycloneStormEntry` and `cycloneLeadEntry`.
The fork tests expect "Potential tropical cyclone" for `PTC` in five places. The change updates them. The test of `labels.js` reaches the two builders through `cycloneOverlayEntries()`.

### D7: Wind update and Recent Imagery tab index

Upstream changes `src/layers/wind/index.js`. A replaced update now returns true while the layer stays on. The test of `wind-010` expects true for the first update.
Upstream builds the mode buttons of Recent Imagery with `syncSegmentedControl()`. It sets the attribute `tabindex`. The test of `recent-imagery-044` reads the attribute in place of the property `tabIndex`.

### D8: Order of the Events group

The panel group "Events" ends with `gdacs`, as `gdacs-layer-019` says. The layer `s2-ghostmaps` comes before `gdacs`. The test expects the last two entries `s2-ghostmaps` and `gdacs`.

### D9: Chinese texts

Upstream adds the catalog `zh-CN`. The catalog test needs a text for each message of the code. The fork has 20 messages that upstream does not have. The lead wrote the 20 Chinese texts.

The message "Flying to Austin, TX..." has no user in the fork any more, so the change removes its entry.
Two packages of `scripts/package-boundaries.json` list the locale files `es.json` and `ru.json`. The change adds `zh-CN.json` to both lists, because the boundary check refuses an unowned module.

### D10: Credential names

The GhostMaps watcher reads `GITHUB_TOKEN` on the server. The test of `credential-boundary-006` needs each name in the registry or in `.env.example`. The change adds a comment block for `GITHUB_TOKEN` to `.env.example`.

### D11: Count of QA scripts

Upstream adds nine QA scripts. The scenario `qa-scripts-023` counts 106 tracked QA scripts. The test of `src/tooling/spec/qaRegister.test.mjs` counts 106.
The nine new scripts have no covers tag. The adopt command writes the records that give them the header `unmapped: upstream`.

### D12: Image

The lock file does not change, so the gates run in the image `gods-eye-view:local`. A test of the host run reads the same lock file.

## Files and measures

The trace gate checks the scenario IDs `osh-033` and `qa-scripts-023`. The prose lint checks STE.
The lead runs every test file of the host, then the four checks of `make precheck`, then the adopt command and the gates in Docker. The two review agents read the final tree.
