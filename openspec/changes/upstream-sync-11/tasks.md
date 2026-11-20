## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit `42559db10` and resolve the 69 conflicts.
- [x] 1.3 Keep the fork tokens and give the new upstream layers the tokens `05` to `0b`.
- [x] 1.4 Remove the classification banner from the new HUD.
- [x] 1.5 Keep the Taiwan start flight on the camera port.
- [x] 1.6 Add the 21 fork texts to the nine new locales and regenerate `zh-Hant.json`.
- [x] 1.7 Port the nine fork layer files to the renderer ports.
- [x] 1.8 Adapt the fork tests, and delete the fork backfill tests that fail against the upstream code.
- [x] 1.9 Rename the fork changelog fragments that repeat an upstream number.
- [x] 1.10 Keep the remaining scenarios of the modified requirements. They are listed by capability in the tasks 1.11 to 1.15.
- [x] 1.11 Keep the scenarios of `gdacs-layer`: gdacs-layer-018, gdacs-layer-019, gdacs-layer-020, gdacs-layer-021, gdacs-layer-022.
- [x] 1.12 Keep the scenarios of `ghostmaps`: ghostmaps-036, ghostmaps-037, ghostmaps-038, ghostmaps-039, ghostmaps-040, ghostmaps-041, ghostmaps-042, ghostmaps-048, ghostmaps-049, ghostmaps-051, ghostmaps-052, ghostmaps-053, ghostmaps-057, ghostmaps-058, ghostmaps-062, ghostmaps-063, ghostmaps-064, ghostmaps-066, ghostmaps-067.
- [x] 1.13 Keep the scenarios of `reticulum-layer`: reticulum-layer-017, reticulum-layer-018, reticulum-layer-019, reticulum-layer-020.
- [x] 1.14 Keep the scenarios of `share-codec`: share-codec-001, share-codec-002, share-codec-003, share-codec-004, share-codec-005, share-codec-006, share-codec-007, share-codec-008, share-codec-009, share-codec-062, share-codec-064.
- [x] 1.15 Keep the scenarios of `voice-panel`: voice-panel-002, voice-panel-004, voice-panel-005, voice-panel-006, voice-panel-007, voice-panel-008, voice-panel-010, voice-panel-030, voice-panel-031, voice-panel-033, voice-panel-034, voice-panel-035, voice-panel-036, voice-panel-037, voice-panel-038, voice-panel-039, voice-panel-040, voice-panel-041, voice-panel-042, voice-panel-043, voice-panel-045, voice-panel-046, voice-panel-047, voice-panel-067.
- [x] 1.16 Add the Vue loader to each test run of the gate: coverage-gate-102.

## 2. Host evidence

- [ ] 2.1 Run each test file alone in the image.
- [ ] 2.2 Run the four checks of `make precheck`.
- [ ] 2.3 Run `make lint`.
- [ ] 2.4 Run `openspec validate --specs`.

## 3. Lead work in the image

- [ ] 3.1 Fetch upstream again and check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run the adopt command for each upstream file with a coverage gap.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-11`.
- [ ] 3.4 Run the two review agents in each round.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-11` on the final tree.
- [ ] 3.7 Open the pull request. Do not merge it without the owner.
