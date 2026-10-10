## 1. Plan, merge and host files

- [ ] 1.1 Write the change plan.
- [ ] 1.2 Merge the upstream commit.
- [ ] 1.3 Resolve the six conflicts.
- [ ] 1.4 Commit the merge first.
- [ ] 1.5 Change the layer count of two upstream tests from 30 to 31.
- [ ] 1.6 Run the fault that removes `createApplicationOsh()` from the catalog.

## 2. Host evidence

- [ ] 2.1 Run each test file of `src/tooling/spec` on the host, except `gates.test.mjs`.
- [ ] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [ ] 2.3 Run each test file under `src` outside `src/tooling/spec` on the host.
- [ ] 2.4 Run the four checks of `make precheck` on the host.
- [ ] 2.5 Run the lint on the host.
- [ ] 2.6 Run `openspec validate --specs` on the host.
- [ ] 2.7 Write `evidence/workflow.md` with the result of the four read-only checks.

## 3. Lead work before and in the image

- [ ] 3.1 Check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run `make adopt CHANGE=upstream-sync-5 FROM=591f299d11f38a612629a274463196d57ae3862e`.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-5`.
- [ ] 3.4 Run the two review agents.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-5` on the final tree.
