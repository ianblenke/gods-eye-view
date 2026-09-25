# How the lead handled the findings of round 1

The lead read each finding against the code and ran the mutations. Round 1 gave two FAIL verdicts: spec adversary F1 (major) and STE adversary S1 to S8 (major).

## Spec adversary

- F1 major: corrected. The test of `gap-ledger-089` compares `ids.json` and `links.json` before and after `adopt`. The test of `gap-ledger-090` compares `gaps.json` after each fault. Mutations H19 (write the links file), H20 (write the ledger file in a fault path) and H21 (write the registry) fail these tests.
- F2 minor: corrected. The proposal has the known limit `adopt-own-merge-commit`, and `AGENTS.md` has rule 21.
- F3 minor: corrected in the code. The adopted count of untraced tests is now compared with the total of the entry, so the slack is gone. Mutations U3 (rise) and U4 (number of names) fail `gap-ledger-094`. The known limit `adopt-later-edit` has the corrected rule.
- F4 minor: corrected. `gap-ledger-092` and `gap-ledger-098` state the untrue-coverage condition and the base-content condition.
- F5 minor: corrected. The unit test of `gap-ledger-089` has a closed name, and mutation A12 fails it.
- F6 minor: corrected. The check of the order of the calls is gone, and `adoptedFor` has no separate guard. The known limit `adopt-sameasbase-reads` names the cost.
- F7 minor: corrected. The tests of `gap-ledger-022` and `gap-ledger-040` have a message with a waiver and an adopted count. Mutations N1 and N2 fail them. The scenarios say "each when it is above 0".
- F8 minor: named in the Impact of the proposal.

## STE adversary

- S1 to S3 major: corrected in the scenarios `gap-ledger-089`, `gap-ledger-092`, `gap-ledger-095` and `gap-ledger-098`.
- S4 major: corrected in the known limit `adopt-later-edit` and in D4 of the design, with one rule.
- S5 major: corrected in the proposal (origin of a new entry).
- S6 to S8 major: the numbers are corrected: 813 and 10 errors, 121 code files with 158 errors, about 1800 untraced tests, and no kilobyte number.
- S9 to S28 minor: corrected in the proposal, the design, the tasks and the spec. The corrections include "merge commit" and "merged commit" as the two terms, "allow" for "admit", "adopted count" for "ceiling", the order of the facts about the merge commit, and the split of the tasks with two instructions. The new traced test names were renamed for S28. The renamed names are new in this change, and the host lint of the new names has no finding.
