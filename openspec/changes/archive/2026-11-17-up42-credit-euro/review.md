# Review: up42-credit-euro

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-17
Gates: make gates CHANGE=up42-credit-euro passed
Rounds: 2
Scope: diff 9b76b87aa4bc7929a6e357d2909ad9685b4d00d7
Reviewed-Tree: 577367f82ff76c2965f616784036c7abf7ead3d203249bf75cd561db7fe3272d

## Findings

- [x] FINDING minor: Round 1, spec adversary: no test sets a credit amount that is not whole, zero or large. Kept as the Known limit `rounding-test` in proposal.md. Round 2 found it true.
- [x] FINDING minor: Round 1, spec adversary: the Known limit `not-everywhere` did not name the reject confirm. Added the reject confirm to it. Round 2 found the correction true.
- [x] FINDING major: Round 1, STE adversary: the proposal and the changelog said "each credit amount" but the sentence "This spends 90 credits." has no euro amount. Corrected both texts to "the first credit amount of each text", and named the sentence in the known limit.
- [x] FINDING major: Round 1, STE adversary: task 3.1 had two instructions. Split into tasks 3.1 and 3.2.
- [x] FINDING major: Round 1, STE adversary: task 4.2 had two instructions. Split into tasks 4.2 and 4.3.
- [x] FINDING minor: Round 1, STE adversary: facts about outside systems had no source. Added "The author read" with the source in the proposal, and the spec name in the design.
- [x] FINDING minor: Round 1, STE adversary: the mutation claim had no result. The design now records the result: 10 tests failed.
- [x] FINDING minor: Round 1, STE adversary: the word "page" had two meanings. Now "layer".
- [x] FINDING minor: Round 1, STE adversary: "a reject" as a noun, "ask for a decision" for the quote line, a vague estimate line, an unclear changelog and "a part of a credit". All five corrected.
- [x] FINDING minor: Round 2, STE adversary: "confirm" is a noun in "order confirm", "accept confirm" and "reject confirm". Kept. These are the names of the requirements in the spec and of the functions in the code. The lines agree with each other.
- [x] FINDING minor: Round 2, spec adversary: the `rounding-test` limit is true and needs no change. Kept as a known limit.
