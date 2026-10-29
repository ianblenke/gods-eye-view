## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit in two steps.
- [x] 1.3 Resolve the seven conflicts.
- [x] 1.4 Add the 20 fork texts to `zh-Hant.json`.
- [x] 1.5 Remove the stale text from `zh-Hant.json`.
- [x] 1.6 Add `zh-Hant.json` to the packages `reticulum` and `osh-layer`.
- [x] 1.7 Commit each merge.
- [x] 1.8 Run the two faults of decision D2.
- [x] 1.9 Change the limit of the timing test of `tool-schema-codepoints.test.mjs` to CPU time.
- [x] 1.10 Run the fault of decision D5.

## 2. Host evidence

- [x] 2.1 Run each test file on the host, except `src/tooling/spec/gates.test.mjs`.
- [x] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [x] 2.3 Run the four checks of `make precheck` on the host.
- [x] 2.4 Run the lint on the host.
- [x] 2.5 Run `openspec validate --specs` on the host.

## 3. Lead work in the image

- [x] 3.1 Check the second parent of each merge commit against the upstream remote.
- [x] 3.2 Run the adopt command with `FROM` set to the merged upstream commit after each merge step.
- [x] 3.3 Run `make ratchet CHANGE=upstream-sync-10`.
- [x] 3.4 Run the two review agents in each round.
- [x] 3.5 Write review.md.
- [x] 3.6 Run `make gates CHANGE=upstream-sync-10` on the final tree.
