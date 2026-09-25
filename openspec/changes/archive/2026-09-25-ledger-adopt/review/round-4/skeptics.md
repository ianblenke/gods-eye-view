# How the lead handled the findings of round 4

Round 4 was a narrow confirmation round after the major findings of round 3. Both agents gave PASS. The spec adversary gave F1 to F4 (minor) and the STE adversary gave S1 to S10 (minor).

## Spec adversary

- F1 minor: named as the known limit `adopt-from-text`. A change of scenarios 089 and 096 needs a new ratchet and a new round.
- F2 minor: named as the known limit `adopt-gate-test-tag`. Task 5.4 has the new Mutation 2 (drop the shape checks from the adopt lines), and the lead ran it as mutation H22: the test failed.
- F3 minor: corrected in D1 of the design.
- F4 minor: named as the known limit `adopt-rejected-line-totals`.

## STE adversary

- S1 to S4: corrected in `AGENTS.md`, the proposal and the design. Rule 21 uses "must", and one wording names the check: the upstream remote has the merged commit.
- S5 minor: corrected in D3 of the design (the field `from`). The scenario text (`spec.md`) stays, see F1 above.
- S6 to S9: corrected in the design.
- S10 minor: kept. It needs a change of the text of scenario 094, so it needs a new ratchet and a new round. Accepted by Ian Blenke on 2026-09-25.
