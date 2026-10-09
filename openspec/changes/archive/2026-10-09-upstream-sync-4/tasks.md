## 1. Merge and host files

- [x] 1.1 Write the change plan.
- [x] 1.2 Write the delta spec for `qa-scripts-023`.
- [x] 1.3 Merge the upstream commit.
- [x] 1.4 Resolve the three conflicts.
- [x] 1.5 Commit the merge first.
- [x] 1.6 Change the register test of `qa-scripts-023` to expect 90 files.

## 2. Host evidence

- [x] 2.1 Run each test file of `src/tooling/spec` on the host, except `gates.test.mjs`.
- [x] 2.2 Run the tests of `gates.test.mjs` with `change-review-03` or `qa-scripts` in their names on the host.
- [x] 2.3 Run each test file under `src` outside `src/tooling/spec` on the host.
- [x] 2.4 Run the format check, the import direction check, the package boundary check and the layer token check on the host.
- [x] 2.5 Run the lint on the host.
- [x] 2.6 Run `openspec validate` on the host.

## 3. Lead work before and in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [x] 3.2 Run `make adopt CHANGE=upstream-sync-4 FROM=6be25595b16491ce01ffd8d81e66921f321ee200`.
- [x] 3.3 Run `make ratchet CHANGE=upstream-sync-4`.
- [ ] 3.4 Run the two review agents.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-4` on the final tree.
