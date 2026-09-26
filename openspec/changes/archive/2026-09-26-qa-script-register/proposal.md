## Why

The project has 70 browser QA scripts. They use a live app, a real browser, or both. Unit tests cannot measure most of their behavior. The ledger records their uncovered code as gaps. The owner needs a spec link for each script, so authors can consider its purpose when they change a capability.

## What Changes

- Give each tracked QA script a header with purpose, covers, run and needs tags.
- Check each header and each capability name in the gate.
- Remove QA scripts with valid headers from the code coverage inventory.
- Print QA advice for each change with a delta spec or a named backfill area.
- Add rule 22 for authors and a QA check for the spec adversary.

## Capabilities

### New Capabilities

- `qa-scripts`: the register, coverage rule and change advice.

### Modified Capabilities

None.

## Impact

The change closes the coverage entries below. The counts come from `openspec/trace/gaps.json` at commit `703bd80fd8d03791494c5ef12a6434988defab81`. A host Node script selected the 70 keys that match `scripts/qa-*.mjs`. It added each non-null metric. A null branch or function count contributes zero.

| Gap | Lines | Branches | Functions |
|---|---:|---:|---:|
| `scripts/qa-application.mjs` | 116 | 0 | 0 |
| `scripts/qa-attribution-b12.mjs` | 406 | 0 | 0 |
| `scripts/qa-cables-overlay.mjs` | 238 | 0 | 0 |
| `scripts/qa-cables-render-probe.mjs` | 116 | 0 | 0 |
| `scripts/qa-cables-shot.mjs` | 74 | 0 | 0 |
| `scripts/qa-camera-controls.mjs` | 413 | 0 | 0 |
| `scripts/qa-cctv-v2.mjs` | 1999 | 0 | 0 |
| `scripts/qa-cockpit-plates.mjs` | 557 | 0 | 0 |
| `scripts/qa-cockpit-utility.mjs` | 2345 | 0 | 0 |
| `scripts/qa-directions.mjs` | 842 | 0 | 0 |
| `scripts/qa-director-camera.mjs` | 210 | 0 | 0 |
| `scripts/qa-director-interactions.mjs` | 364 | 0 | 0 |
| `scripts/qa-director-packs.mjs` | 359 | 0 | 0 |
| `scripts/qa-director-sharing.mjs` | 482 | 0 | 0 |
| `scripts/qa-director-timing.mjs` | 137 | 0 | 0 |
| `scripts/qa-draw-tool.mjs` | 876 | 0 | 0 |
| `scripts/qa-enrich-ambient.mjs` | 582 | 0 | 0 |
| `scripts/qa-failstate-b10.mjs` | 570 | 0 | 0 |
| `scripts/qa-firms.mjs` | 521 | 0 | 0 |
| `scripts/qa-firstrun-mutations.mjs` | 521 | 0 | 0 |
| `scripts/qa-firstrun.mjs` | 902 | 0 | 0 |
| `scripts/qa-floor-hold.mjs` | 274 | 0 | 0 |
| `scripts/qa-floor-verify.mjs` | 163 | 0 | 0 |
| `scripts/qa-floorhold-mutations.mjs` | 322 | 0 | 0 |
| `scripts/qa-floorhold-probe-cost.mjs` | 62 | 0 | 0 |
| `scripts/qa-floorhold-staircase.mjs` | 145 | 0 | 0 |
| `scripts/qa-flyroute-cinema.mjs` | 605 | 0 | 0 |
| `scripts/qa-flyroute-mutations.mjs` | 163 | 0 | 0 |
| `scripts/qa-focus-evidence.mjs` | 721 | 0 | 0 |
| `scripts/qa-heading-b3.mjs` | 1115 | 0 | 0 |
| `scripts/qa-height-datum.mjs` | 727 | 0 | 0 |
| `scripts/qa-infra-lod.mjs` | 343 | 0 | 0 |
| `scripts/qa-l9-matrix.mjs` | 1550 | 18 | 50 |
| `scripts/qa-label-readability.mjs` | 422 | 0 | 0 |
| `scripts/qa-labels.mjs` | 600 | 0 | 0 |
| `scripts/qa-layer-panel.mjs` | 133 | 0 | 0 |
| `scripts/qa-location-controls.mjs` | 262 | 0 | 0 |
| `scripts/qa-map-source-controls.mjs` | 202 | 0 | 0 |
| `scripts/qa-map-source-tray.mjs` | 1662 | 0 | 0 |
| `scripts/qa-nepal-media-playback.mjs` | 204 | 0 | 0 |
| `scripts/qa-overlay-baseline.mjs` | 943 | 0 | 0 |
| `scripts/qa-perf.mjs` | 413 | 0 | 0 |
| `scripts/qa-radio.mjs` | 4752 | 0 | 0 |
| `scripts/qa-recent-imagery.mjs` | 1480 | 0 | 0 |
| `scripts/qa-scene-controls.mjs` | 448 | 0 | 0 |
| `scripts/qa-sprites-b5.mjs` | 578 | 0 | 0 |
| `scripts/qa-traffic-baseline.mjs` | 477 | 0 | 0 |
| `scripts/qa-traffic-jamviz-ab.mjs` | 254 | 0 | 0 |
| `scripts/qa-traffic-navigation.mjs` | 125 | 0 | 0 |
| `scripts/qa-traffic-preset-ab.mjs` | 284 | 0 | 0 |
| `scripts/qa-traffic.mjs` | 334 | 0 | 0 |
| `scripts/qa-transit-browser.mjs` | 79 | 37 | 7 |
| `scripts/qa-transit-controls.mjs` | 12 | 7 | 3 |
| `scripts/qa-transit-heading.mjs` | 156 | 0 | 0 |
| `scripts/qa-transit-recovery.mjs` | 330 | 0 | 0 |
| `scripts/qa-transit-scenes.mjs` | 967 | 3 | 4 |
| `scripts/qa-transit.mjs` | 1972 | 0 | 0 |
| `scripts/qa-ui-disposal.mjs` | 289 | 0 | 0 |
| `scripts/qa-vessel-cards.mjs` | 247 | 14 | 5 |
| `scripts/qa-vessel-datum.mjs` | 282 | 0 | 0 |
| `scripts/qa-view-target-prewarm.mjs` | 355 | 0 | 0 |
| `scripts/qa-visual-effects.mjs` | 239 | 0 | 0 |
| `scripts/qa-visual-input.mjs` | 251 | 0 | 0 |
| `scripts/qa-voice-routing.mjs` | 1025 | 0 | 0 |
| `scripts/qa-voice-wav.mjs` | 161 | 0 | 0 |
| `scripts/qa-weather-journey.mjs` | 423 | 0 | 0 |
| `scripts/qa-weather-perf.mjs` | 568 | 0 | 0 |
| `scripts/qa-weather-swap.mjs` | 203 | 0 | 0 |
| `scripts/qa-weather-teardown.mjs` | 341 | 0 | 0 |
| `scripts/qa-wind-canvas.mjs` | 44 | 0 | 0 |
| Total, 70 entries | 40337 | 79 | 69 |

- Untraced tests closed: none.
- Gaps opened: none.
- The ratchet removes the 70 entries. It records 76 history lines: 70 for the removed entries, and 6 that the next bullet names.
- The other 6 history lines are for three files. `scripts/spec/gates.mjs` gets a new hash and new totals, because this change edits it. `src/data/labelArbiter.js` has 50 branches not covered (52 before), and its total of branches is 405 (407 before). `src/data/lifecycle.js` has 102 branches not covered (100 before), and its total of branches is 570 (568 before). This change does not edit the last two files (known limit `qa-ratchet-noise`).
- The change adds a delta spec, a register module, gate and inventory changes, tests and 70 headers.
- The change also changes `AGENTS.md`, the review command and the spec adversary prompt.
- The ratchet changes the trace ledger, ID registry, links and history files.

## Known limits and later changes

- `qa-helper-coverage`: Five QA scripts export helpers with unit tests. Those tests still run, but coverage no longer measures their imports.
- `qa-header-truth`: A header can name a purpose that the script does not test. The register checks text and folders, not behavior.
- `qa-pending-name`: A pending area must equal its later capability name. A different name leaves no automatic link.
- `qa-purpose-review`: The gate prints advice. Only an author or reviewer can judge a conflict with a script purpose.
- `qa-other-inventory-checks`: An excluded script leaves all checks that use the code inventory, such as ignore comments and test imports.
- `qa-ledger-history`: The present ratchet writes the reason `file removed` for an excluded script, even though its file stays tracked.
- `qa-loaded-flag`: The ratchet removes the entry and its `loaded` value. Five loaded helper scripts lose that ledger fact.
- `qa-runtime`: The gate does not run a browser QA script. A separate browser run must prove its runtime behavior.
- `qa-ratchet-noise`: The counts of `src/data/labelArbiter.js` and `src/data/lifecycle.js` change between runs (see `sync-counts-change-between-runs` of the change `upstream-sync`). No test of this change closes these gaps, and the ledger records the counts that the ratchet measured.
- `qa-advice-delta-files`: The advice reads each entry of the `specs` folder of a change as a capability name. A file in that folder, and not a folder, gives a false name. The names of real deltas are folders, so this input is unusual.
