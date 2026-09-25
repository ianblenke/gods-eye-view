# How the lead handled the findings of round 2

Round 2 gave PASS from the spec adversary (F1 to F3, minor) and FAIL from the STE adversary (S1 major, S2 to S21 minor). The lead read each finding against the code and ran the mutations.

## Spec adversary

- F1 minor: corrected. The test of `gap-ledger-094` has a name that keeps its base count. Mutation U7 (count only the new names and the names with a higher count) fails it.
- F2 minor: corrected. `gap-ledger-095` says "no file, or no full hash of a commit", and it says that the gate does not check the head commit and the date. The test of `gap-ledger-095` has a valid line with no head commit and no date. Mutations V1 and V2 (check the head commit, check the date) fail it.
- F3 minor: corrected. Rule 21 of `AGENTS.md` and the known limit `adopt-own-merge-commit` name the person who merges the change, and say that this person records the result in `review.md`.

## STE adversary

- S1 major: corrected in D1 of the design. The text gives the 423 code files that the errors name, and no longer says that the merged tree has 423 code files with a gap.
- S2 to S7: corrected in the design and in the scenarios `gap-ledger-094` to `gap-ledger-097`. The title and the test name of `gap-ledger-094` say the rule of the total. `gap-ledger-096` and `gap-ledger-097` say that the line has no fault that `gap-ledger-095` names.
- S8: corrected. The names of the tests of `gap-ledger-096`, `gap-ledger-097` and the test in `git.test.mjs` use the terms of the spec. The names are new in this change.
- S9 to S20: corrected in the proposal, the design and `AGENTS.md`.
- S21: corrected. The mutation lines of the tasks have the right order.
