# Review: harden-gate-ledger

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-17
Gates: make gates CHANGE=harden-gate-ledger passed
Rounds: 4
Scope: full
Reviewed-Tree: 4833ff16edbf0cd61ddd43e8403ccae6443848a0c2afb36fe841706ebcdec1e6

The output of each round is in `review/round-<n>/`. The output in `review/` is the output of round 4, where both agents gave the verdict PASS.

The number of findings decreased in each round: 18 in round 1, 14 in round 2, 3 in round 3 and 2 in round 4. Round 4 was a narrow round for the one known limit that round 3 corrected. The spec adversary gave the verdict PASS in round 3 with no finding, so its round-3 output is also its output in `review/`.

The change `simplify-ledger` closed most of the work that the review of `establish-spec-governance` gave this change. The review of round 1 showed that two more items were still open, so this change is larger than its first version.

## Findings

### Round 1: spec-adversary

- [x] F1 major The Impact said that the change opens no gap, but the first ratchet run wrote 52 not-covered branches for `src/data/labelArbiter.js` in place of 50. The Impact now records the two runs and the four history lines, and the proposal has the known limit `banked-branch-count`. A later ratchet run measured 50 again, so `openspec/trace/gaps.json` is the same as the base.
- [x] F2 major Four more known limits of `establish-spec-governance` still described the ranges and the band. All seven now name the change that closed them, in the simple past.
- [x] F3 minor The new assertion could not fail. It now makes its expected value from `node:test`, without `missingTestContext`.
- [x] F4 minor The test now also reads each other test file of `src/tooling/spec/`. It cannot name the tests of another folder. See the known limit `guarded-test-list`.
- [x] F5 minor The fault of S220 was still in `gap-ledger-054`. This change corrects the words.
- [x] F6 minor The known limit `sample-identity` is in the simple past and gives no later change.
- [x] F7 minor The review record of `establish-spec-governance` records the sample tool as without a purpose. See the known limit `ci-sample-tool`.

### Round 1: ste-adversary

- [x] S1 to S11 All 11 findings corrected: one group of words for the tests that need the guard to count assertions, the seven known limits in the simple past and the active voice, "changes the proposal", "says that", and the words of the design.

### Round 2: spec-adversary

- [x] F1 major The proposal now names the capability `gap-ledger`.
- [x] F2 major The section "Changed files" of the design names each changed file.
- [x] F3 minor The Impact names the two files of `openspec/trace/` that the change changes.
- [x] F4 minor The Why says "Three items stay open".
- [x] F5 minor The test cannot name each test that needs the guard. The proposal has the known limit `guarded-test-list`.

### Round 2: ste-adversary

- [x] S1 to S9 All nine findings corrected: the capability `gap-ledger`, the two files of `openspec/trace/`, the file list of the design, the two scenarios with a new hash, "the last **AND** line", "told this change to make a tool", "records the same effect", and the two test comments.

### Round 3: spec-adversary (Verdict: PASS)

- [x] No finding.

### Round 3: ste-adversary

- [x] S1 major The known limit `guarded-test-list` gave the same tests two more groups of words. It now uses one group.
- [x] S2 minor The limit now says that the test reads each test file of `src/tooling/spec/`.
- [x] S3 minor The limit no longer uses the word "tie".

### Round 4: spec-adversary (Verdict: PASS)

- [x] No finding.

### Round 4: ste-adversary (Verdict: PASS)

- [x] S1 minor The limit now gives the test as the actor: "The test does not check a test with an inline skip option".
- [x] S2 minor The limit now says "it names each test that needs the guard to count assertions".
