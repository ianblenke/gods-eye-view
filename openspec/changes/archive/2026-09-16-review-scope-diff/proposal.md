## Why

The change `establish-spec-governance` needed 38 review rounds. An examination of the rounds gave these numbers. About 25% of the findings were gaps in the first version. A correction of an earlier finding gave about 35%. About 30% were prose that repeats a rule in another place.

Each round reads the whole change again, so a correction in one round makes findings in the next round. This change gives the review of each later change fewer rounds and gives the review an end.

## What Changes

- Give each review round a scope: the diff since the Git commit of the round before, or the full change for the first round.
- Make the specs the one place for each rule. The design and the known limits name a scenario ID and do not repeat the words of the scenario.
- Give the review a limit of three rounds. After the third round, each open finding with the severity minor stays open in `review.md` with the name of the person who accepts it.
- Stop an edit of the files of the review agents and of the review command inside a round. The author makes such an edit before the first round, or in its own change.
- Record the number of rounds and the scope of the last round in `review.md`.

## Capabilities

### Modified Capabilities
- `change-review`: the number of rounds, the scope of a round, and the acceptance by a person. The capability also gives the scope rules of the review command and of the agent files.

## Impact

- Changed files: `.claude/agents/spec-adversary.md`, `.claude/agents/ste-adversary.md`, `.claude/commands/opsx/review.md`, `scripts/spec/lib/review.mjs`, `scripts/spec/gates.mjs`, `src/tooling/spec/review.test.mjs` and `src/tooling/spec/gates.test.mjs`.
- The two new fields also go into `review.md` of the archived change `establish-spec-governance`.
- The review gate reads two new lines in `review.md`: `Rounds:` and `Scope:`.
- The code of the app stays the same.
- Gaps that this change opens: none. The new code starts at 100% coverage.

## Known limits and later changes

- `review-scope-blind`: A round reads only the diff since the round before. A gap in a file that the diff does not change stays open until a later change changes that file. The first round of each change reads the whole change, so this limit is only for the rounds after the first.
- `scope-commit-unchecked`: The review gate reads the form of the commit in the "Scope:" line. It does not ask Git for that commit, so a commit that is not in the repository passes.
- `one-place-by-hand`: No gate stops a text in the design or the known limits that repeats the words of a scenario.
- `agent-file-freeze`: No gate finds an edit of a review agent file or of the review command between two rounds. Only the tree hash finds an edit after `review.md` is there.
- `severity-self-reported`: No gate compares the severity of a finding in `review.md` with the output of the review agents.
- `rounds-self-reported`: The author writes the "Rounds:" line by hand. No gate compares that number with the folders `review/round-<n>/`.
- `human-acceptance`: A person can accept an open finding with the severity minor after three rounds. The review gate does not check who that person is. The pull request shows the name.
