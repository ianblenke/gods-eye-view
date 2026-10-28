## 1. Plan, merge and fork edits

- [ ] 1.1 Write the change plan.
- [ ] 1.2 Merge the upstream commit in two steps.
- [ ] 1.3 Resolve the seven conflicts.
- [ ] 1.4 Add the 20 fork texts to `zh-Hant.json` and remove its stale text.
- [ ] 1.5 Add `zh-Hant.json` to the packages `reticulum` and `osh-layer`.
- [ ] 1.6 Commit the merge.
- [ ] 1.7 Run the fault of decision D2.

## 2. Host evidence

- [ ] 2.1 Run each test file on the host, except `src/tooling/spec/gates.test.mjs`.
- [ ] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [ ] 2.3 Run the four checks of `make precheck` on the host.
- [ ] 2.4 Run the lint on the host.
- [ ] 2.5 Run `openspec validate --specs` on the host.

## 3. Lead work in the image

- [ ] 3.1 Check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run `make adopt CHANGE=upstream-sync-10 FROM=2bcdca1c9a2bc0a34074577cc5f4de01d4759233`.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-10`.
- [ ] 3.4 Run the two review agents.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-10` on the final tree.
