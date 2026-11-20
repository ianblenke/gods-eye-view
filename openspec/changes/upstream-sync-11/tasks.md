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
