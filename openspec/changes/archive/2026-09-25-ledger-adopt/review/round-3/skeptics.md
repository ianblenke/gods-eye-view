# How the lead handled the findings of round 3

Round 3 gave PASS from the spec adversary (F1 to F4, minor) and FAIL from the STE adversary (S1 and S2 major, S3 to S15 minor). The lead read each finding against the code and ran the mutations.

## STE adversary

- S1 major: corrected. `gap-ledger-095` and D3 of the design say that the gate rejects a line whose field `file` or field `from` is not a string. The code (`adoptsOf`) checks exactly that. The text of the full hash is gone.
- S2 major: corrected in D5 of the design and in the known limit `adopt-untraced-total`. Both give the reason with "because".
- S3 to S7: corrected in the scenarios `gap-ledger-094`, `gap-ledger-095`, `gap-ledger-096` and `gap-ledger-097` and in D3, D4 and D5 of the design.
- S8 to S12, S15: corrected in `AGENTS.md`, the proposal, the design and the tasks. One role name is used: the person who merges the change.
- S14: corrected. Task 3.3 has the mutation for the line with no head commit and no date, and mutations V1 and V2 fail the test.
- S13 minor: kept. The corrected test names are at the limit of 25 words, and a longer name needs a change of the test structure. The person who merges the change decides if the finding stays open in `review.md`.

## Spec adversary

- F1 minor: corrected with STE S1.
- F2 minor: corrected. The proposal, the design and rule 21 name the person who merges the change, and the place of the record (`review.md`).
- F3 minor: corrected. The test of `gap-ledger-096` and `gap-ledger-097` in `gates.test.mjs` writes a line with a negative count and a commit that is not a merged commit. It asserts that the gate gives no adopt error for that line. Mutation H22 (drop the shape checks) fails it.
- F4 minor: corrected in D6 of the design.
