## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit `fca2c81d8`.
- [x] 1.3 Resolve the 13 conflicts of the merge.
- [x] 1.4 Check that the merge adds no layer that needs a share token.
- [x] 1.5 Adapt the fork tests to the merged code.
- [x] 1.6 Keep these scenarios of `live-sources`: live-sources-006, live-sources-007, live-sources-008, live-sources-009.
- [x] 1.7 Keep these scenarios of `perimeters`: perimeters-001, perimeters-002.
- [x] 1.8 Write the backfill scenarios for the lost coverage: director-111 and context-contacts-entry-001.

## 2. Host evidence

- [x] 2.1 Run each test file alone in the image.
- [x] 2.2 Run `make precheck`.
- [x] 2.3 Run `make lint`.
- [x] 2.4 Run `openspec validate --specs`.

## 3. Lead work in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [x] 3.2 Run the adopt command for each upstream file with a coverage gap.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-12`.
- [ ] 3.4 Run the two review agents in each round.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-12` on the final tree.
- [ ] 3.7 Open the pull request.
- [ ] 3.8 Merge the pull request only when the owner says so.
