## 1. Plan, merge and fork edits

- [ ] 1.1 Write the change plan.
- [ ] 1.2 Write the delta spec for `credential-boundary`.
- [ ] 1.3 Write the delta spec for `qa-scripts`.
- [ ] 1.4 Merge the upstream commit.
- [ ] 1.5 Resolve the conflicts in the 43 files.
- [ ] 1.6 Commit the merge.
- [ ] 1.7 Set the token `7` for `gnss-integrity` and the token `8` for `air-quality`.
- [ ] 1.8 Remove the fork geocoding route and its four files.
- [ ] 1.9 Remove the upstream test of the upstream Docker contract.
- [ ] 1.10 Mark the eight fork texts and add their Spanish and Russian text.
- [ ] 1.11 Write again the fork tests that the merge breaks.
- [ ] 1.12 Change the test of `credential-boundary-015` to name `server/providers/places/google.js`.
- [ ] 1.13 Remove the tests of `credential-boundary-007` and `credential-boundary-013`.
- [ ] 1.14 Change the register test of `qa-scripts-023` to expect 99 files.
- [ ] 1.15 Add the retired IDs to `openspec/trace/retired-ids.json`.
- [ ] 1.16 Run the fault of decision D2.

## 2. Host evidence

- [ ] 2.1 Run each test file of `src/tooling/spec` on the host, except `gates.test.mjs`.
- [ ] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [ ] 2.3 Run each test file outside `src/tooling/spec` on the host.
- [ ] 2.4 Run the four checks of `make precheck` on the host.
- [ ] 2.5 Run the lint on the host.
- [ ] 2.6 Run `openspec validate` on the host.

## 3. Lead work before and in the image

- [ ] 3.1 Check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run `make adopt CHANGE=upstream-sync-6 FROM=73aec2e6b2ecfa865ddb7cb8839fa2d40fd0eb66`.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-6`.
- [ ] 3.4 Run the two review agents.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-6` on the final tree.
