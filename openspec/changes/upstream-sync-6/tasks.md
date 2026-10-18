## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Write the delta spec for `credential-boundary`.
- [x] 1.3 Write the delta spec for `qa-scripts`.
- [x] 1.4 Merge the upstream commit.
- [x] 1.5 Resolve the conflicts in the 43 files.
- [x] 1.6 Commit the merge.
- [x] 1.7 Set the token `7` for `gnss-integrity` and the token `8` for `air-quality`.
- [x] 1.8 Remove the fork geocoding route and its four files.
- [x] 1.9 Remove the upstream test of the upstream Docker contract.
- [x] 1.10 Mark the eight fork texts and add their Spanish and Russian text.
- [x] 1.11 Write again the fork tests that the merge breaks.
- [x] 1.12 Change the test of `credential-boundary-015` to the ID `credential-boundary-019` and the file `server/providers/places/google.js`.
- [x] 1.13 Remove the tests of `credential-boundary-007` and `credential-boundary-013`.
- [x] 1.14 Change the register test of `qa-scripts-023` to expect 99 files.
- [x] 1.15 Run the fault of decision D2.
- [x] 1.16 Make the six upstream test files of decision D9 end with no live timer.
- [x] 1.17 Add the case of decision D10 to the test of `osh-control-031`.
- [x] 1.18 Run the fault of decision D10.
- [x] 1.19 Add the scenario `credential-boundary-020` to the delta spec for `credential-boundary`.
- [x] 1.20 Write the tests of `credential-boundary-020` from the old tests of `credential-boundary-013`.
- [x] 1.21 Run a fault for each branch of `src/search/google.js` that the tests of `credential-boundary-020` cover.

## 2. Host evidence

- [x] 2.1 Run each test file of `src/tooling/spec` on the host, except `gates.test.mjs`.
- [x] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [x] 2.3 Run each test file outside `src/tooling/spec` on the host.
- [x] 2.4 Run the four checks of `make precheck` on the host.
- [x] 2.5 Run the lint on the host.
- [x] 2.6 Run `openspec validate` on the host.

## 3. Lead work before and in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [x] 3.2 Run `make adopt CHANGE=upstream-sync-6 FROM=73aec2e6b2ecfa865ddb7cb8839fa2d40fd0eb66`.
- [x] 3.3 Merge the fork main commit `41add05c` into the branch.
- [ ] 3.4 Run `make ratchet CHANGE=upstream-sync-6`.
- [ ] 3.5 Add the retired IDs to `openspec/trace/retired-ids.json` after the archive.
- [ ] 3.6 Run the two review agents.
- [ ] 3.7 Write review.md.
- [ ] 3.8 Run `make gates CHANGE=upstream-sync-6` on the final tree.
