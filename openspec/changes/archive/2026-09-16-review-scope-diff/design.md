## Context

The review of `establish-spec-governance` needed 38 rounds and gave 376 findings. The numbers of the examination are in the proposal. Three causes made new rounds. Each round read the whole change again. The same rule was in many places. The change also changed the instructions of its own reviewers.

## Goals / Non-Goals

**Goals:**
- Make the number of findings of a round decrease to zero in a few rounds.
- Do not make the gate weaker: a critical finding or a major finding always stops the build.

**Non-Goals:**
- Change the checks of the agents.
- Change the gap ledger. The change `simplify-ledger` will do this.

## Changed files

`scripts/spec/lib/review.mjs`, `scripts/spec/gates.mjs`, `src/tooling/spec/review.test.mjs`, `src/tooling/spec/gates.test.mjs`, `.claude/agents/spec-adversary.md`, `.claude/agents/ste-adversary.md` and `.claude/commands/opsx/review.md`. The change also adds the two new lines to `openspec/changes/archive/2026-09-16-establish-spec-governance/review.md`.

## Decisions

### Scope of a round

`review.md` has two new lines: `Rounds: <n>` and `Scope: full` or `Scope: diff <commit>`. The first round of a change reads the whole change. Each later round reads the diff against the Git commit of the round before. The agent also reads the text that a changed line makes wrong. The command `/opsx:review` gives the agents the diff and the scope.

### One place for each rule

A rule is in a spec scenario. The design and the known limits name the scenario ID, for example "see `gap-ledger-066`", and they do not repeat the words of the rule. No gate stops a text that repeats the words of a scenario. The author obeys this rule. The STE agent reads the delta specs of the change. The new lines of the main specs are copies of them.

### Round limit and acceptance

After three rounds, each open finding with the severity minor stays open in `review.md` with the name of the person who accepts the finding. A critical finding or a major finding always stops the build.

### Agent files

Do not change `.claude/agents/` or `.claude/commands/opsx/review.md` inside a round. The author makes such an edit before the first round, or in its own change.
