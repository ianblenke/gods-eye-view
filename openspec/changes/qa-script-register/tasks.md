## 1. Change documents

- [x] 1.1 Write the proposal, delta spec and design before tests or code.

## 2. Tests before code

- [ ] 2.1 Write `[qa-scripts-001]` test for valid shebang and tags with a temporary folder where possible.
  - Mutation: Make the parser reject the optional shebang. The test must fail.
  - Mutation: Make the parser omit the needs tag from its result. The test must fail.
- [ ] 2.2 Write `[qa-scripts-002]` test for first block with a temporary folder where possible.
  - Mutation: Let the parser skip code before the first block. The test must fail.
- [ ] 2.3 Write `[qa-scripts-003]` test for absent tag with a temporary folder where possible.
  - Mutation: Let the parser accept a header without the needs tag. The test must fail.
- [ ] 2.4 Write `[qa-scripts-004]` test for repeated tag with a temporary folder where possible.
  - Mutation: Let the parser accept two purpose tags. The test must fail.
- [ ] 2.5 Write `[qa-scripts-005]` test for empty tag with a temporary folder where possible.
  - Mutation: Let the parser accept an empty run value. The test must fail.
- [ ] 2.6 Write `[qa-scripts-006]` test for bad covers item with a temporary folder where possible.
  - Mutation: Let the parser accept a covers item with a space. The test must fail.
- [ ] 2.7 Write `[qa-scripts-007]` test for capability folder with a temporary folder where possible.
  - Mutation: Make the folder check reject a capability folder that exists. The test must fail.
- [ ] 2.8 Write `[qa-scripts-008]` test for unknown capability with a temporary folder where possible.
  - Mutation: Make the folder check accept a capability folder that does not exist. The test must fail.
- [ ] 2.9 Write `[qa-scripts-009]` test for open pending area with a temporary folder where possible.
  - Mutation: Make the pending check reject an area without a folder. The test must fail.
- [ ] 2.10 Write `[qa-scripts-010]` test for landed pending area with a temporary folder where possible.
  - Mutation: Make the pending check accept an area with a folder. The test must fail.
- [ ] 2.11 Write `[qa-scripts-011]` test for unmapped reason with a temporary folder where possible.
  - Mutation: Make the parser reject one unmapped item with a reason. The test must fail.
- [ ] 2.12 Write `[qa-scripts-012]` test for unmapped list with a temporary folder where possible.
  - Mutation: Make the parser accept an unmapped item beside a capability. The test must fail.
- [ ] 2.13 Write `[qa-scripts-013]` test for valid script omission with a temporary folder where possible.
  - Mutation: Keep a valid QA script in codeInventory. The test must fail.
- [ ] 2.14 Write `[qa-scripts-014]` test for invalid script retention with a temporary folder where possible.
  - Mutation: Omit an invalid QA script from codeInventory. The test must fail.
  - Mutation: Suppress the coverage gap for an invalid QA script. The test must fail.
- [ ] 2.15 Write `[qa-scripts-015]` test for other code retention with a temporary folder where possible.
  - Mutation: Omit a non-QA code file from codeInventory. The test must fail.
- [ ] 2.16 Write `[qa-scripts-016]` test for delta advice with a temporary folder where possible.
  - Mutation: Skip delta folder matches. The test must fail.
  - Mutation: Remove the purpose from a QA line. The test must fail.
  - Mutation: Print advice before Trace. The test must fail.
- [ ] 2.17 Write `[qa-scripts-017]` test for backfill advice with a temporary folder where possible.
  - Mutation: Skip the backfill name match. The test must fail.
  - Mutation: Keep the pending prefix in a QA line. The test must fail.
- [ ] 2.18 Write `[qa-scripts-018]` test for no match advice with a temporary folder where possible.
  - Mutation: Suppress the no-match QA line. The test must fail.
- [ ] 2.19 Write `[qa-scripts-019]` test for no change advice with a temporary folder where possible.
  - Mutation: Print the no-match QA line without a change. The test must fail.
- [ ] 2.20 Write `[qa-scripts-020]` test for author rule with a temporary folder where possible.
  - Mutation: Remove the QA line instruction from rule 22. The test must fail.
  - Mutation: Remove the purpose conflict instruction from rule 22. The test must fail.
  - Mutation: Remove the new header instruction from rule 22. The test must fail.
- [ ] 2.21 Write `[qa-scripts-021]` test for review command input with a temporary folder where possible.
  - Mutation: Remove QA lines from the spec adversary input in the review command. The test must fail.
- [ ] 2.22 Write `[qa-scripts-022]` test for adversary check with a temporary folder where possible.
  - Mutation: Remove the purpose read from check 11. The test must fail.
  - Mutation: Remove the script check read from check 11. The test must fail.
  - Mutation: Remove the conflict or absent scenario instruction from check 11. The test must fail.
- [ ] 2.23 Write `[qa-scripts-023]` test that checks all tracked QA scripts of this repository.
  - Mutation: Make the register skip one tracked QA script in the repository. The test must fail.
- [ ] 2.24 Write `[qa-scripts-024]` test for gate failure after a header error.
  - Mutation: Remove QA header errors from the gate error list. The test must fail.
  - Mutation: Remove the script path from the error. The test must fail.
- [ ] 2.25 Write `[qa-scripts-025]` test for both covers errors and inventory omission.
  - Mutation: Remove `QA-COVERS-UNKNOWN` from the gate error list. The test must fail.
  - Mutation: Remove `QA-COVERS-LANDED` from the gate error list. The test must fail.
  - Mutation: Remove the script path from a covers error. The test must fail.
  - Mutation: Keep a valid script with a covers error in the inventory. The test must fail.
- [ ] 2.26 Write `[qa-scripts-026]` test for advice from an archived change.
  - Mutation: Make the advice code search only active changes. The test must fail.
- [ ] 2.27 Write `[qa-scripts-027]` test for two capabilities and line order.
  - Mutation: Print only the first capability of each script. The test must fail.
  - Mutation: Sort advice by capability before script path. The test must fail.
- [ ] 2.28 Write `[qa-scripts-028]` test for a header continuation line.
  - Mutation: Let the parser skip a text line after a tag. The test must fail.

## 3. Register and gate code

- [ ] 3.1 Add the register module with header, covers and advice checks.
- [ ] 3.2 Wire the register errors and advice into `scripts/spec/gates.mjs`.
- [ ] 3.3 Pass valid QA scripts to `codeInventory` in `scripts/spec/lib/inventory.mjs`.

## 4. Process text and headers

- [ ] 4.1 Add rule 22 to `AGENTS.md` for QA advice, purpose conflicts and new headers.
- [ ] 4.2 Give QA lines to the spec adversary in the review command.
- [ ] 4.3 Add check 11 for QA scripts to the spec adversary prompt.
- [ ] 4.4 Add the 70 headers from the design table to the tracked QA scripts.

## 5. Gates and review

- [ ] 5.1 Run `make ratchet CHANGE=qa-script-register` and inspect its 70 closed entries.
- [ ] 5.2 Run `make gates CHANGE=qa-script-register` and correct non-review errors.
- [ ] 5.3 Run `/opsx:review qa-script-register` with both review agents.
- [ ] 5.4 Write `review.md` with the passed review and tree hash.
