## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit `7646568a9`.
- [x] 1.3 Resolve the 12 conflicts of the merge.
- [x] 1.4 Check the share tokens of each new upstream layer.
- [x] 1.5 Change the fork tests to agree with the merged code.
- [x] 1.6 Retire the two pill scenarios of `location-presets`.
- [x] 1.7 Keep these scenario IDs of `location-presets`: location-presets-004, location-presets-008.
- [x] 1.8 Write the tests of startup-view-001, startup-view-006 and startup-view-007.
- [x] 1.9 End the opening on the Taiwan pose when the page has no share state.
- [x] 1.10 Keep these scenario IDs of `startup-view`: startup-view-001, startup-view-006, startup-view-007.
- [x] 1.11 Give the two Purpose lines of D2 and D4 to the archive step.

## 2. Host evidence

- [x] 2.1 Run each test file alone in the image.
- [x] 2.2 Run `make precheck`.
- [x] 2.3 Run `make lint`.
- [x] 2.4 Run `openspec validate --specs`.

## 3. Lead work in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [x] 3.2 Run the adopt command for each upstream file with a coverage gap.
- [x] 3.3 Run `make ratchet CHANGE=upstream-sync-13`.
- [ ] 3.4 Run the two review agents in each round.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-13` on the final tree.
- [ ] 3.7 Open the pull request.
- [ ] 3.8 Merge the pull request only when the owner says so.
