# Review: review-scope-diff

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-16
Gates: make gates CHANGE=review-scope-diff passed
Rounds: 4
Scope: full
Reviewed-Tree: 1f82c71cd89825fc507669eb18b288c634d113b9bd304c78148079f64e675bd4

The output of each round is in `review/round-<n>/`. The output in `review/` is the output of round 4, where both agents gave the verdict PASS.

This change builds the diff scope of a round, so no commit records the tree of an earlier round. Each of its four rounds had the scope `full`. A later change records a commit for each round and uses the scope `diff <commit>`.

The number of findings decreased in each round: 46 in round 1, 31 in round 2, 10 in round 3 and 2 in round 4. Round 4 was a narrow round for the corrections of round 3.

## Findings

### Round 1: spec-adversary

- [x] F1 major The check of the agent files found the word "scope" in any sentence. The gate now needs the heading "## Scope of a round", the words "diff since the round" and the words "limit of three rounds". A new test gives an agent file with the heading "## Scope".
- [x] F2 major The gate accepted an open finding in each round. It now needs the number 3 or more in the "Rounds:" line. See `change-review-028`.
- [x] F3 major The gate read the severity from free prose, and it did not read the case. It now reads the second word of the finding text, without case. See `change-review-026` and `change-review-028`.
- [x] F4 major The acceptance is now only for a finding with the severity minor, so the verdict PASS of each agent output stays true.
- [x] F5 major The gate now stops for a first round with a scope that is not the full change. See `change-review-030`. The gate does not ask Git for the commit: known limit `scope-commit-unchecked`.
- [x] F6 major Added the scenario `change-review-029` for a scope line that the gate does not accept.
- [x] F7 major The STE agent file no longer names `openspec/specs/`; it reads the delta specs in the change folder. No gate makes the one place for each rule true: known limit `one-place-by-hand`.
- [x] F8 minor Added the known limit `agent-file-freeze`.
- [x] F9 minor Added the error REVIEW-ROUNDS for a number less than 1. See `change-review-031`.
- [x] F10 minor Removed the number of rounds from the prose line of the archived governance `review.md`.

### Round 1: ste-adversary

- [x] S1 to S36 All 36 findings corrected in the proposal, the design, the two agent files, `.claude/commands/opsx/review.md` and the delta spec. The corrections include: "the diff since the round before" in each place; "a limit of three rounds" without "for each mechanism"; the heading "### Modified Capabilities"; "acceptance" in place of "sign-off"; "lowercase hexadecimal characters"; the heading "## Texts to check" in the STE agent file; and the round limit as a numbered step of the review command.

### Round 2: spec-adversary

- [x] F1 major The gate read the word "minor" in any place of the finding text. It now reads the second word. New tests: a critical finding with the word "minor" in its text, a finding with no severity word, and the word "Minor".
- [x] F2 major The review command and the two agent files told the author to accept a finding that is not critical, which the gate stopped. All seven places now write "with the severity minor".
- [x] F3 major No gate read `.claude/commands/opsx/review.md`. Added the requirement "Scope rules of the review command", the scenario `change-review-032`, the function `checkReviewCommand` and its call in `gates.mjs`.
- [x] F4 minor Added the known limit `rounds-self-reported`.
- [x] F5 minor The known limit `agent-file-freeze` now gives the gap and not the rule.
- [x] F6 minor The known limit `one-place-by-hand` now gives the gap and not a control that no file has.
- [x] F7 minor Added `src/tooling/spec/gates.test.mjs` and the governance `review.md` to the Impact section.

### Round 2: ste-adversary

- [x] S1 to S24 All 24 findings corrected. The corrections include: "with the severity minor" in each of the seven places; "the second word of the finding text" in the two scenarios, which agrees with the new code; "the Git commit of the round before" in the spec and the design; the words that the code needs in the requirement for the agent files; no `**OR**` line in a scenario; the round limit as step 12, before the step that writes `review.md`; and 17 wording corrections in the proposal, the design, the agent files and three scenario titles.

### Round 3: spec-adversary (Verdict: PASS)

- [x] F1 minor Added the known limit `severity-self-reported`.
- [x] F2 minor `tasks.md` now has each test task before the code task.
- [x] F3 minor Added `scripts/spec/gates.mjs` to the Impact section and a section "Changed files" to the design.
- [x] F4 minor The comment in `review.mjs` now writes "the Git commit of the round before".

### Round 3: ste-adversary

- [x] S1 major The known limit `human-acceptance` now writes "with the severity minor".
- [x] S2 major The design now writes "a critical finding or a major finding always stops the build" in the two places.
- [x] S3 minor The scenario `change-review-028` now writes "a number less than 3".
- [x] S4 minor The design now writes "The author obeys this rule."
- [x] S5 minor The AND line of `change-review-027` now gives a condition.
- [x] S6 minor The capability line now names the review command and the agent files.

### Round 4: spec-adversary (Verdict: PASS)

- [x] F1 minor The section "Changed files" of the design now also names the governance `review.md`.

### Round 4: ste-adversary (Verdict: PASS)

- [x] S1 minor The capability line now starts with "The capability" and not with "It".
