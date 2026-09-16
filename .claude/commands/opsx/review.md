---
name: "OPSX: Review"
description: Archive an OpenSpec change, run the two adversarial review agents and write review.md
category: Workflow
tags: [workflow, review, spec-first]
---

Do an adversarial review of one OpenSpec change. The input is the name of the change after `/opsx:review`. If there is no name, run `openspec list --json`. Ask the user to select a change.

The review agents can only read files. You write their output to files. Copy their output exactly. Do not change a verdict or a finding.

## Steps

1. Run `make gates CHANGE=<name>`. The only errors must be review errors. If there are other errors, stop. Correct them first.
2. Run `openspec archive <name> --yes`. Replace each purpose line that starts with "TBD" in `openspec/specs/` with a purpose in STE. The archive command does not change the scenario text, the tests or the code, so you do not run the ratchet command again.
3. Run `make gates CHANGE=<name>` again. Keep the output. Run `git diff --stat origin/main`. Keep the output.
4. Run `git status --porcelain`. Keep the output.
5. Find the scope of the round. The first round of a change has the scope `full`. Each later round has the scope `diff <commit>`, with the Git commit of the round before. Keep the scope and the number of the round.
6. Start the `spec-adversary` agent. Give it the change name, the gate output, the diff output and the scope. For a scope with a diff, give it the diff since that commit.
7. Start the `ste-adversary` agent at the same time. Give it the change name, the STE warnings from the gate output, the names of the new tests and the scope.
8. Run `git status --porcelain` again. If the output is not the same as the output of step 4, stop. Tell the user that an agent changed a file.
9. Write the output of each agent to `review/spec-adversary.md` and `review/ste-adversary.md` in the archived change folder. Before a new round, move the output of the earlier round to `review/round-<n>/`.
10. If one or the two agents give the verdict FAIL, examine all the corrections that you will make. If these corrections change only the proposal, the design, `tasks.md` or files in `.claude/`, do not move the change. Correct each critical finding and each major finding. You can also correct minor findings. Then start again at step 3. If one or more corrections change other files, move the change to its location before the archive command:
   - Move the folder `openspec/changes/archive/<date>-<name>` to `openspec/changes/<name>`.
   - Make the content of `openspec/specs/` the same as in the commit before the archive command. Run the Git command `restore` with the options `--source=<commit>`, `--staged` and `--worktree` for `openspec/specs`. If that commit has no `openspec/specs/` folder, run the Git command `rm` with the options `-r` and `-f` for `openspec/specs`. Remove each file in `openspec/specs/` that Git does not track.
   - Correct each critical finding and each major finding. You can also correct minor findings. Run `make ratchet CHANGE=<name>`. Then start again at step 1.
11. If the two agents give the verdict PASS, do not start a new review round for their minor findings. Add each minor finding of the spec adversary to the section "Known limits and later changes" in the proposal of the archived change. Keep each minor finding of the STE adversary, or correct it in the proposal or the design of the archived change. Then run `make gates CHANGE=<name>`, which must give only review errors. Record your decision for each minor finding in `review.md`.
12. The review has a limit of three rounds. After the third round, ask the user to accept each open finding with the severity minor. Write the severity as the second word of the finding, and the name of that person in the finding. A critical finding or a major finding always stops the build. Do not change a file in `.claude/agents/` or this file inside a round.
13. Run `make tree CHANGE=<name>`. Keep the hash.
14. Write `review.md` in the archived change folder with this content:

```
# Review: <name>

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: <YYYY-MM-DD>
Gates: make gates CHANGE=<name> passed
Rounds: <number of rounds>
Scope: <full, or diff <the Git commit of the round before>>
Reviewed-Tree: <hash from step 13>

## Findings

- [x] <each finding from all review rounds, with its correction, its known limit or the reason to keep it>
- [ ] <each open finding after three rounds with the severity minor, with "Accepted by <the name of the person>">
```

15. Run `make gates CHANGE=<name>`. All gates must pass.
16. Tell the user the result, the number of review rounds and the findings that you corrected.
