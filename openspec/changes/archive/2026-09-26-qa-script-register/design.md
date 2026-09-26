## Context

The browser QA scripts test real app behavior. The code inventory now measures them as code files. Most scripts do not run in the unit suite. This leaves 70 ledger gaps. The owner wants a spec link for each script.

## Goals and non-goals

- Keep a purpose and a capability link with each tracked QA script.
- Stop the gate for a bad header or an old pending name.
- Remove valid QA scripts from code coverage counts.
- Tell an author which QA scripts matter to a change.
- Do not run browser QA scripts in the unit gate.
- Do not infer behavior from a header.

## D1 Header grammar

The first bytes can be one shebang line. The next bytes must start a block comment. No blank line, line comment or code can come before that block. The block has only four tag lines, in any order. A tag value cannot continue on a second line.

Use these regular expressions on each line after the first `/*` and before the first `*/`. Strip one optional first `*` and one space first. Do not strip text after the value.

```text
shebang: ^#![^\r\n]*\r?\n
block start: ^/\*(?:\*?\r?\n)
tag: ^@(purpose|covers|run|needs) (\S.*)$
purpose value: ^\S[^.!?\r\n]*[.!?]$
run value: ^\S[^\r\n]*$
needs value: ^\S[^\r\n]*$
slug: ^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$
capability item: ^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$
pending item: ^pending:[a-z][a-z0-9]*(?:-[a-z0-9]+)*$
unmapped item: ^unmapped: [^,\s](?:[^,]*[^,\s])?$
covers list: ^ITEM(?:,ITEM)*$
```

`ITEM` is one capability item or one pending item. The unmapped item replaces the full list. A comma has no space on either side. A purpose is one sentence with a final mark. The register checks its shape, not its grammar or truth.

Each of the four tags occurs exactly once. The values cannot be empty. Reject any other line. A blank line and a continuation line are other lines.

Example:

```text
/**
 * @purpose Prove that wind pixels appear on the real canvas.
 * @covers pending:wind
 * @run node scripts/qa-wind-canvas.mjs
 * @needs A browser and a server.
 */
```

## D2 Register errors

`scripts/spec/lib/qa-register.mjs` reads the tracked QA file list. It reads each script and the capability folders in `openspec/specs/`. It returns errors and the set of scripts without a `QA-HEADER` error. It sorts files and errors by file and code.

| Code | Message form |
|---|---|
| `QA-HEADER` | See message A below. |
| `QA-COVERS-UNKNOWN` | See message B below. |
| `QA-COVERS-LANDED` | See message C below. |

```text
A: <script>: add one first block with one nonempty line for each QA tag and valid covers items.
B: <script>: <item> has no capability folder in openspec/specs/.
C: <script>: replace pending:<area> with <area>; its capability folder exists.
```

A script with a valid header can still have an unknown covers item, or a pending item that has a capability folder. It leaves the code inventory, but the covers error stops the gate. A script with a bad header stays in the inventory. The gate reports its header error and coverage gap.

## D3 Coverage inventory and ledger

`codeInventory` takes tracked files and the set of QA scripts with valid headers. It omits only those scripts. `measure` calls the register before it makes the inventory. The register errors join the gate errors before the test run. Tests that import QA helpers still run. Their imported script code no longer contributes to measured coverage.

The ratchet sees the excluded scripts as absent from the code inventory. It removes their 70 ledger entries. It writes one `closed` history line for each entry, with metric `lines`, after value zero and reason `file removed`. This reason comes from the present ratchet code. It does not mean Git removed a file. Five entries have `loaded: true`; the ratchet removes that field with each entry.

This is a known limit.

The inventory also drives the ignore comment check, test import check, file hash check and true coverage check. These checks cease for valid QA scripts. The register does not replace those checks.

## D4 Change advice

Resolve a named change with `changeFolder`, so active and archived folders work. Read the delta spec folders under that change folder. For each QA covers capability equal to a delta folder name, print one line. For `backfill-<area>`, also match `pending:<area>`. Sort by script path and then capability. Do not print the same script and capability pair twice.

Print after the `Trace:` line:

```text
QA: <script> covers <capability>: <purpose>
```

`<script>` is the repository path. `<capability>` has no `pending:` prefix. `<purpose>` is the header value. If no pair matches, print the no-match line below. Print no QA advice without a change name.

```text
QA: no script covers the capabilities of this change.
```
 Advice does not stop the gate. Invalid covers items give errors but no advice.

## D5 Author and reviewer process

Rule 22 in `AGENTS.md` tells authors to read QA lines for a spec change. It tells them to avoid a conflict with a listed purpose. It also tells them to add a header to each new QA script. The review command gives the QA lines from its gate output to the spec adversary. Check 11 makes that agent read each listed script purpose and checks. It asks for a scenario that conflicts with the checks or a proved behavior with no scenario.

Keep the tools list in the agent file. It has Read, Grep and Glob. Keep the heading Scope of a round, the phrase `limit of three rounds` and `diff since the round` in the agent prompt. Keep `Scope:`, `Rounds:`, `limit of three rounds` and `Find the scope` in the review command. `checkAgents`, `checkReviewCommand`, `AGENT_SCOPE` and `COMMAND_SCOPE` need these words.

## Header of each script

The table gives the exact covers value and the proposed purpose sentence for each later header. The later phase must add the run and needs values from each script's actual use. No row uses unmapped, because each script fits a named area. A filename can retain an old place name; new prose does not name a place.

| Script | `@covers` value | One-line purpose |
|---|---|---|
| `scripts/qa-application.mjs` | `pending:application-shell` | Prove that the app starts and releases browser resources. |
| `scripts/qa-attribution-b12.mjs` | `pending:overlays,pending:application-shell` | Prove that data and map credits stay visible in each display mode. |
| `scripts/qa-cables-overlay.mjs` | `pending:submarine-cables,pending:overlays,pending:performance` | Prove that cable labels use the shared host and leave no idle work. |
| `scripts/qa-cables-render-probe.mjs` | `pending:submarine-cables,pending:performance` | Measure cable frame cost with the layer on and off. |
| `scripts/qa-cables-shot.mjs` | `pending:submarine-cables` | Capture the cable layer from fixed views for visual checks. |
| `scripts/qa-camera-controls.mjs` | `pending:application-shell` | Prove that camera controls use the selected source and terrain. |
| `scripts/qa-cctv-v2.mjs` | `pending:cctv` | Prove that camera markers and feeds work in the real browser. |
| `scripts/qa-cockpit-plates.mjs` | `pending:overlays` | Prove that callout plates fit the image behind each label. |
| `scripts/qa-cockpit-utility.mjs` | `pending:application-shell,pending:radio` | Prove that cockpit display and radio controls fit and respond. |
| `scripts/qa-directions.mjs` | `pending:directions` | Prove that route controls, map picks and camera travel work. |
| `scripts/qa-director-camera.mjs` | `pending:director` | Prove that imported camera paths and camera control agree. |
| `scripts/qa-director-interactions.mjs` | `pending:director` | Prove that pointer and key actions control an authored scene. |
| `scripts/qa-director-packs.mjs` | `pending:director` | Prove that pack import, display and resource cleanup work. |
| `scripts/qa-director-sharing.mjs` | `pending:director` | Prove that an author can share a scene with local assets. |
| `scripts/qa-director-timing.mjs` | `pending:director,pending:scenes` | Prove that scene time and seek control work in the browser. |
| `scripts/qa-draw-tool.mjs` | `pending:annotations` | Prove that draw controls accept pointer and key actions and release their resources. |
| `scripts/qa-enrich-ambient.mjs` | `pending:local-adsb` | Prove that ambient aircraft get the correct type image. |
| `scripts/qa-failstate-b10.mjs` | `pending:application-shell` | Prove that a failed feed shows a visible error state. |
| `scripts/qa-firms.mjs` | `pending:firms` | Prove that the fire layer shows live data and failed feed states. |
| `scripts/qa-firstrun-mutations.mjs` | `pending:application-shell` | Prove that first run tests detect each named defect. |
| `scripts/qa-firstrun.mjs` | `pending:application-shell` | Prove that first run choices activate the correct layers and view. |
| `scripts/qa-floor-hold.mjs` | `pending:local-adsb` | Prove that a ground contact keeps its floor during a terrain fault. |
| `scripts/qa-floor-verify.mjs` | `pending:local-adsb` | Compare aircraft display height with the visible terrain mesh. |
| `scripts/qa-floorhold-mutations.mjs` | `pending:local-adsb` | Prove that floor tests detect each named defect. |
| `scripts/qa-floorhold-probe-cost.mjs` | `pending:local-adsb,pending:performance` | Measure the cost of nearby floor probes. |
| `scripts/qa-floorhold-staircase.mjs` | `pending:local-adsb` | Prove that a ground contact reaches its floor without a visible jump. |
| `scripts/qa-flyroute-cinema.mjs` | `pending:voice,pending:directions` | Prove that a voice route gives the intended camera path. |
| `scripts/qa-flyroute-mutations.mjs` | `pending:voice,pending:directions` | Prove that route tests detect each named camera defect. |
| `scripts/qa-focus-evidence.mjs` | `pending:local-adsb,pending:overlays` | Capture how focus changes aircraft and labels in the real view. |
| `scripts/qa-heading-b3.mjs` | `pending:local-adsb` | Prove that an aircraft turn changes its display course. |
| `scripts/qa-height-datum.mjs` | `pending:local-adsb` | Prove that aircraft height uses the correct terrain datum. |
| `scripts/qa-infra-lod.mjs` | `pending:datacenters,pending:dams,pending:submarine-cables` | Prove that infrastructure markers stay within the view limit. |
| `scripts/qa-l9-matrix.mjs` | `pending:application-shell` | Run the release browser checks and report their results. |
| `scripts/qa-label-readability.mjs` | `pending:overlays` | Capture label contrast over a bright map surface. |
| `scripts/qa-labels.mjs` | `pending:overlays` | Prove that detection labels stay within their display limit. |
| `scripts/qa-layer-panel.mjs` | `pending:application-shell` | Prove that the layer panel owns and releases its controls. |
| `scripts/qa-location-controls.mjs` | `pending:application-shell` | Prove that location controls handle result order and errors. |
| `scripts/qa-map-source-controls.mjs` | `pending:application-shell` | Prove that map source controls show the true active source. |
| `scripts/qa-map-source-tray.mjs` | `pending:application-shell` | Prove that the map source tray works across layouts and key states. |
| `scripts/qa-nepal-media-playback.mjs` | `pending:scenes` | Prove that scene media starts and stops with scene time. |
| `scripts/qa-overlay-baseline.mjs` | `pending:overlays,pending:performance` | Measure the cost of world overlays in fixed views. |
| `scripts/qa-perf.mjs` | `pending:performance` | Prove that the render governor stops idle work. |
| `scripts/qa-radio.mjs` | `pending:radio` | Prove that radio markers and media controls work in the browser. |
| `scripts/qa-recent-imagery.mjs` | `pending:recent-imagery` | Prove that image search, compare modes and controls work. |
| `scripts/qa-scene-controls.mjs` | `pending:scenes` | Prove that scene controls handle project and play actions. |
| `scripts/qa-sprites-b5.mjs` | `pending:local-adsb` | Prove that aircraft types get the correct images and scale. |
| `scripts/qa-traffic-baseline.mjs` | `pending:traffic,pending:performance` | Measure traffic cache work after map travel. |
| `scripts/qa-traffic-jamviz-ab.mjs` | `pending:traffic` | Compare traffic display modes from the same view. |
| `scripts/qa-traffic-navigation.mjs` | `pending:traffic` | Prove that traffic data follows city travel. |
| `scripts/qa-traffic-preset-ab.mjs` | `pending:traffic` | Compare traffic colors across visual styles. |
| `scripts/qa-traffic.mjs` | `pending:traffic` | Prove that live traffic and keyless states work. |
| `scripts/qa-transit-browser.mjs` | `pending:transit` | Keep browser actions within time limits for transit checks. |
| `scripts/qa-transit-controls.mjs` | `pending:transit` | Prove that transit controls give clear pass and fail results. |
| `scripts/qa-transit-heading.mjs` | `pending:transit` | Prove that transit headings show stop and travel states. |
| `scripts/qa-transit-recovery.mjs` | `pending:transit` | Prove that transit data recovers after a camera move. |
| `scripts/qa-transit-scenes.mjs` | `pending:transit,pending:scenes` | Prove that transit scenes use private data and release resources. |
| `scripts/qa-transit.mjs` | `pending:transit` | Prove that the transit layer and context controls work. |
| `scripts/qa-ui-disposal.mjs` | `pending:application-shell` | Prove that UI disposal releases each owned resource. |
| `scripts/qa-vessel-cards.mjs` | `pending:vessels,pending:overlays` | Prove that vessel cards use the shared overlay host. |
| `scripts/qa-vessel-datum.mjs` | `pending:vessels` | Prove that vessel height matches the visible water surface. |
| `scripts/qa-view-target-prewarm.mjs` | `pending:application-shell` | Prove that a sky pick does not stop view target setup. |
| `scripts/qa-visual-effects.mjs` | `pending:overlays` | Prove that display effects change and release their state. |
| `scripts/qa-visual-input.mjs` | `pending:application-shell` | Prove that keys and value controls change the real app. |
| `scripts/qa-voice-routing.mjs` | `pending:voice` | Prove that voice text selects the intended app action. |
| `scripts/qa-voice-wav.mjs` | `pending:voice` | Prove that microphone input drives voice controls. |
| `scripts/qa-weather-journey.mjs` | `cyclones,pending:wind,pending:weather` | Prove that weather controls and storm selection work together. |
| `scripts/qa-weather-perf.mjs` | `pending:wind,pending:weather,pending:performance` | Measure weather frame cost across fixed views. |
| `scripts/qa-weather-swap.mjs` | `pending:weather` | Prove that a weather frame swap keeps the globe visible. |
| `scripts/qa-weather-teardown.mjs` | `cyclones,pending:wind,pending:weather` | Prove that weather layers release resources after use. |
| `scripts/qa-wind-canvas.mjs` | `pending:wind` | Prove that wind pixels appear on the real canvas. |

## Files that change

- `scripts/spec/lib/qa-register.mjs`: header check, covers check and advice selection.
- `scripts/spec/lib/inventory.mjs`: omit valid QA scripts from the code inventory.
- `scripts/spec/gates.mjs`: call the register and print advice after Trace.
- `src/tooling/spec/qaRegister.test.mjs`: test the scenarios with temporary folders.
- `src/tooling/spec/inventory.test.mjs`: test inventory results with temporary folders.
- `src/tooling/spec/gates.test.mjs`: test advice order and gate errors.
- `AGENTS.md`: rule 22.
- `.claude/commands/opsx/review.md`: pass QA lines to the spec adversary.
- `.claude/agents/spec-adversary.md`: check 11.
- `scripts/qa-*.mjs`: add the 70 headers.
- `openspec/trace/`: record the new IDs, links and closed gaps.
