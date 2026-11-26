## 1. Plan, merge and fork edits

- [ ] 1.1 Write the change plan.
- [ ] 1.2 Merge the upstream commit `7646568a9`.
- [ ] 1.3 Resolve the 12 conflicts of the merge.
- [ ] 1.4 Check the share tokens of each new upstream layer.
- [ ] 1.5 Adapt the fork tests to the merged code.

## 2. Host evidence

- [ ] 2.1 Run each test file alone in the image.
- [ ] 2.2 Run `make precheck`.
- [ ] 2.3 Run `make lint`.
- [ ] 2.4 Run `openspec validate --specs`.

## 3. Lead work in the image

- [ ] 3.1 Check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run the adopt command for each upstream file with a coverage gap.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-13`.
- [ ] 3.4 Run the two review agents in each round.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-13` on the final tree.
- [ ] 3.7 Open the pull request.
- [ ] 3.8 Merge the pull request only when the owner says so.
