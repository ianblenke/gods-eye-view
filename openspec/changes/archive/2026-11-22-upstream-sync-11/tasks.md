## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit `42559db10`.
- [x] 1.3 Resolve the 69 conflicts of the first merge.
- [x] 1.4 Merge the later upstream commit `7f2dc81cf`.
- [x] 1.5 Keep the fork tokens.
- [x] 1.6 Give the new upstream layers the tokens `05` to `0b`.
- [x] 1.7 Remove the classification banner from the new HUD.
- [x] 1.8 Keep the Taiwan start flight on the camera port.
- [x] 1.9 Add the 21 fork texts to the nine new locales.
- [x] 1.10 Make `zh-Hant.json` again with the i18n script.
- [x] 1.11 Move the nine fork layer files to the renderer ports.
- [x] 1.12 Adapt the fork tests to the merged code.
- [x] 1.13 Delete the fork backfill tests that fail against the upstream code.
- [x] 1.14 Rename the fork changelog fragments that repeat an upstream number.
- [x] 1.15 Keep the remaining scenarios of the modified requirements, listed in the tasks that follow.
- [x] 1.16 Keep these scenarios of `gdacs-layer`: gdacs-layer-018, gdacs-layer-019, gdacs-layer-020, gdacs-layer-021, gdacs-layer-022.
- [x] 1.17 Keep these scenarios of `ghostmaps`: ghostmaps-036, ghostmaps-037, ghostmaps-038, ghostmaps-039, ghostmaps-040, ghostmaps-041, ghostmaps-042, ghostmaps-048.
- [x] 1.18 Keep these scenarios of `ghostmaps`: ghostmaps-049, ghostmaps-051.
- [x] 1.19 Keep these scenarios of `ghostmaps`: ghostmaps-052, ghostmaps-053, ghostmaps-057, ghostmaps-058, ghostmaps-062, ghostmaps-063, ghostmaps-064, ghostmaps-066.
- [x] 1.20 Keep these scenarios of `ghostmaps`: ghostmaps-067.
- [x] 1.21 Keep these scenarios of `reticulum-layer`: reticulum-layer-017, reticulum-layer-018, reticulum-layer-019, reticulum-layer-020.
- [x] 1.22 Keep these scenarios of `share-codec`: share-codec-001, share-codec-002, share-codec-003, share-codec-004, share-codec-005, share-codec-006, share-codec-007, share-codec-008.
- [x] 1.23 Keep these scenarios of `share-codec`: share-codec-009.
- [x] 1.24 Keep these scenarios of `voice-panel`: voice-panel-001, voice-panel-002, voice-panel-003, voice-panel-004, voice-panel-005, voice-panel-006, voice-panel-007, voice-panel-008.
- [x] 1.25 Keep these scenarios of `voice-panel`: voice-panel-009, voice-panel-010.
- [x] 1.26 Keep these scenarios of `voice-panel`: voice-panel-011, voice-panel-030, voice-panel-031, voice-panel-033, voice-panel-034, voice-panel-035, voice-panel-036, voice-panel-037.
- [x] 1.27 Keep these scenarios of `voice-panel`: voice-panel-038, voice-panel-039.
- [x] 1.28 Keep these scenarios of `voice-panel`: voice-panel-040, voice-panel-041, voice-panel-042, voice-panel-043, voice-panel-045, voice-panel-046, voice-panel-047, voice-panel-060.
- [x] 1.29 Keep these scenarios of `osh`: osh-028, osh-029, osh-030, osh-031, osh-032, osh-033, osh-046, osh-049.
- [x] 1.30 Keep these scenarios of `osh`: osh-057, osh-031, osh-059, osh-061, osh-062.
- [x] 1.31 Keep these scenarios of `up42-scene-overlay`: up42-scene-overlay-001, up42-scene-overlay-002, up42-scene-overlay-003, up42-scene-overlay-004, up42-scene-overlay-005, up42-scene-overlay-006, up42-scene-overlay-007, up42-scene-overlay-008.
- [x] 1.32 Keep these scenarios of `up42-scene-overlay`: up42-scene-overlay-009, up42-scene-overlay-010, up42-scene-overlay-011, up42-scene-overlay-012, up42-scene-overlay-013, up42-scene-overlay-014, up42-scene-overlay-015, up42-scene-overlay-016.
- [x] 1.33 Keep these scenarios of `up42-scene-overlay`: up42-scene-overlay-017, up42-scene-overlay-018, up42-scene-overlay-019, up42-scene-overlay-020, up42-scene-overlay-021.
- [x] 1.34 Keep these scenarios of `hud-markings`: hud-markings-001, hud-markings-002, hud-markings-004.
- [x] 1.35 Add the Vue loader to each test run of the gate: coverage-gate-102.
- [x] 1.36 Limit the parallel test processes of the gate to half of the processors: coverage-gate-107.
- [x] 1.37 Stop the trace gate from needing a test for a scenario that a modified requirement drops: spec-trace-055.
- [x] 1.38 Write the backfill scenarios for two upstream files: cable-bundled-source-001 and cockpit-contact-dot-001.
- [x] 1.39 Record the findings of upstream test files: coverage-gate-103, coverage-gate-104, coverage-gate-105 and coverage-gate-106.

## 2. Host evidence

- [x] 2.1 Run each test file alone in the image.
- [x] 2.2 Run the four checks of `make precheck`.
- [x] 2.3 Run `make lint`.
- [x] 2.4 Run `openspec validate --specs`.

## 3. Lead work in the image

- [x] 3.1 Check the second parent of each merge commit against the upstream remote.
- [x] 3.2 Run the adopt command for each upstream file with a coverage gap.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-11`.
- [ ] 3.4 Run the two review agents in each round.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-11` on the final tree.
- [ ] 3.7 Open the pull request.
- [ ] 3.8 Merge the pull request only when the owner says so.
