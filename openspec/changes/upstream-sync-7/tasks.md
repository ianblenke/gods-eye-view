## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit.
- [x] 1.3 Resolve the conflict in `server/standalone/vite.config.js`.
- [x] 1.4 Commit the merge.
- [x] 1.5 Run the fault of decision D1.
- [x] 1.6 Replace the LAN address in `src/control/route.test.mjs` with the documentation address.
- [x] 1.7 Run the three faults of decision D4.
- [x] 1.8 Check the upstream code files that import a code file that the fork changed.

## 2. Host evidence

- [x] 2.1 Run each test file on the host, except `src/tooling/spec/gates.test.mjs`.
- [x] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [x] 2.3 Run the four checks of `make precheck` on the host.
- [x] 2.4 Run the lint on the host.
- [x] 2.5 Run `openspec validate --specs` on the host.

## 3. Lead work before and in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run `make adopt CHANGE=upstream-sync-7 FROM=93ea088f4556a5a65b3292a2d15142d5a6c562bc` with the image of decision D5.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-7` with the image of decision D5.
- [ ] 3.4 Run the two review agents.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-7` with the image of decision D5 on the final tree.
