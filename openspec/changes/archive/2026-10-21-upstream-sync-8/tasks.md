## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit.
- [x] 1.3 Resolve the conflicts with the table in `design.md`.
- [x] 1.4 Commit the merge.
- [x] 1.5 Test the fault of decision D1.
- [x] 1.6 Remove `server/providers/cctv/ontarioRequest.js`.
- [x] 1.7 Remove the test file `src/data/cctvOntarioKey.test.mjs`.
- [x] 1.8 Remove the tests of `live-sources-003`, `live-sources-004` and `live-sources-005` from `src/data/cctvOntarioRows.test.mjs`.
- [x] 1.9 Remove the path of `ontarioRequest.js` from `scripts/package-boundaries.json`.
- [x] 1.10 Write the REMOVED requirement for `live-sources-002`, `live-sources-003`, `live-sources-004` and `live-sources-005`.
- [x] 1.11 Change the test of `qa-scripts-023` to 97 QA scripts.
- [x] 1.12 Use the upstream file of `src/layers/streetLevel/index.test.mjs`.
- [x] 1.13 Make three upstream test files wait for one immediate after they close their servers.
- [x] 1.14 Check the upstream code files that import a code file that the fork changed.
- [x] 1.15 Add a call of `decodeCoverageTileSliced()` with the default pause function and clock to one upstream test.
- [x] 1.16 Add two pass-through mock functions and their two count assertions to the same test.
- [x] 1.17 Test the three faults of decision D7.
- [x] 1.18 Remove the fork lines of the Gemini key and the Ontario key from `.env.example`, with their comments.
- [x] 1.19 Remove the old comment of Launch Library 2 from `.env.example`.

## 2. Host evidence

- [x] 2.1 Run each test file on the host, except `src/tooling/spec/gates.test.mjs`.
- [x] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [x] 2.3 Run the four checks of `make precheck` on the host.
- [x] 2.4 Run the lint on the host.
- [x] 2.5 Run `openspec validate --specs` on the host.

## 3. Lead work before and in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [x] 3.2 Run `make adopt CHANGE=upstream-sync-8 FROM=713285b554bbc99c8ae0261fe307beb3cbeb2adf` with the image of decision D9.
- [x] 3.3 Run `make ratchet CHANGE=upstream-sync-8` with the image of decision D9.
- [x] 3.4 Write the Purpose of `live-sources` from `design.md`.
- [x] 3.5 Add the four retired IDs to `openspec/trace/retired-ids.json`.
- [x] 3.6 Remove the four empty links of these IDs from `openspec/trace/links.json`.
- [x] 3.7 Run the two review agents.
- [x] 3.8 Write review.md.
- [ ] 3.9 Run `make gates CHANGE=upstream-sync-8` with the image of decision D9 on the final tree.
