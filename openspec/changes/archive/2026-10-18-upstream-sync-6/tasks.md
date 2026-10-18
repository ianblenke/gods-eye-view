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
- [x] 1.10 Mark the eight fork texts.
- [x] 1.11 Add the Spanish and Russian text of the eight fork texts.
- [x] 1.12 Write again the fork tests that the merge breaks.
- [x] 1.13 Change the test of `credential-boundary-015` to the ID `credential-boundary-019` and the file `server/providers/places/google.js`.
- [x] 1.14 Remove the tests of `credential-boundary-007` and `credential-boundary-013`.
- [x] 1.15 Change the register test of `qa-scripts-023` to expect 99 files.
- [x] 1.16 Run the fault of decision D2.
- [x] 1.17 Make the six upstream test files of decision D9 end with no live timer.
- [x] 1.18 Add the case of decision D10 to the test of `osh-control-031`.
- [x] 1.19 Run the fault of decision D10.
- [x] 1.20 Add the scenario `credential-boundary-020` to the delta spec for `credential-boundary`.
- [x] 1.21 Write the tests of `credential-boundary-020` from the old tests of `credential-boundary-013`.
- [x] 1.22 Write the scenario `credential-boundary-020` again for the upstream behavior.
- [x] 1.23 Write the tests of `credential-boundary-020` again for the upstream behavior.
- [x] 1.24 Use the upstream file `src/search/google.js`.
- [x] 1.25 Run the faults of `evidence/fault-020.txt`.
- [x] 1.26 Add one line to the scenario `cyclones-021` in the delta spec for `cyclones`.
- [x] 1.27 Keep the scenario `cyclones-020` in the delta spec for `cyclones`.
- [x] 1.28 Keep the scenario `cyclones-022` in the delta spec for `cyclones`.
- [x] 1.29 Remove the old CSP bullet from `SECURITY.md`.
- [x] 1.30 Remove the unused import of `t` from `src/app/controls.js`.
- [x] 1.31 Remove the fork comment and the block `omittable` from `src/data/layerStateTokenLedger.test.mjs`.
- [x] 1.32 Write "do not call Google" in the fork note of `docs/CURRENT-STATE.md`.
- [x] 1.33 Change the test name of `perimeters-005` to the words of its scenario.
- [x] 1.34 Give the status test of `credential-boundary-020` a body that reads as an answer for each status.
- [x] 1.35 Run the body fault against each status of that test alone.
- [x] 1.36 Change the test name of `perimeters-005` again.
- [x] 1.37 Change the name of the `credential-boundary-020` test of a search with no browser key.
- [x] 1.38 Check the upstream code files that the fork changed and that upstream did not change after the shared ancestor.

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
- [x] 3.4 Run `make ratchet CHANGE=upstream-sync-6`.
- [x] 3.5 Add the retired IDs to `openspec/trace/retired-ids.json` after the archive.
- [ ] 3.6 Run the two review agents.
- [ ] 3.7 Write review.md.
- [ ] 3.8 Run `make gates CHANGE=upstream-sync-6` on the final tree.
