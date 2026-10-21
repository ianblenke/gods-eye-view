## 1. Plan, merge and fork edits

- [ ] 1.1 Write the change plan.
- [ ] 1.2 Merge the upstream commit.
- [ ] 1.3 Resolve the conflicts by the table in `design.md`.
- [ ] 1.4 Commit the merge.
- [ ] 1.5 Run the fault of decision D1.
- [ ] 1.6 Remove `server/providers/cctv/ontarioRequest.js`.
- [ ] 1.7 Remove the test file `src/data/cctvOntarioKey.test.mjs`.
- [ ] 1.8 Remove the tests of `live-sources-003`, `live-sources-004` and `live-sources-005` from `src/data/cctvOntarioRows.test.mjs`.
- [ ] 1.9 Remove the path of `ontarioRequest.js` from `scripts/package-boundaries.json`.
- [ ] 1.10 Retire the scenarios `live-sources-002`, `live-sources-003`, `live-sources-004` and `live-sources-005`.
- [ ] 1.11 Change the test of `qa-scripts-023` to 97 QA scripts.
- [ ] 1.12 Use the upstream file of `src/layers/streetLevel/index.test.mjs`.
- [ ] 1.13 Check the upstream code files that import a code file that the fork changed.

## 2. Host evidence

- [ ] 2.1 Run each test file on the host, except `src/tooling/spec/gates.test.mjs`.
- [ ] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [ ] 2.3 Run the four checks of `make precheck` on the host.
- [ ] 2.4 Run the lint on the host.
- [ ] 2.5 Run `openspec validate --specs` on the host.

## 3. Lead work before and in the image

- [ ] 3.1 Check the second parent of the merge commit against the upstream remote.
- [ ] 3.2 Run `make adopt CHANGE=upstream-sync-8 FROM=713285b554bbc99c8ae0261fe307beb3cbeb2adf` with the image of decision D7.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-8` with the image of decision D7.
- [ ] 3.4 Write the Purpose of `live-sources` from `design.md`.
- [ ] 3.5 Run the two review agents.
- [ ] 3.6 Write review.md.
- [ ] 3.7 Run `make gates CHANGE=upstream-sync-8` with the image of decision D7 on the final tree.
