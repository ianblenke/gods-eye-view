## Context

The tree starts at commit `ce4280f3`, from the command `git rev-parse HEAD`.
The severity list of the STE adversary is at the end of `.claude/agents/ste-adversary.md`.
The old list gives the severity major to each text with two possible meanings.
Rule 16 of `AGENTS.md` names the severities `blocker` and `minor`. The agents and the review command use `critical`, `major` and `minor`.

## Goals and non-goals

Give a fault in the words of other text the severity minor, so that the fault does not fail a round.
Keep the severity major for a fault that changes a rule.
Give the severity major to the faults that the requirement names.
Make rule 16 agree with the agents.
Do not change the review gate, the verdict rule, the limit of three rounds or the spec adversary.

## Decisions

### D1: Lists

The instructions define normative text with a list.
Normative text is a requirement, a scenario, a rule of `AGENTS.md` or `openspec/config.yaml`, a message of the gate and the instructions of an agent.
The instructions define other text with a second list. The list includes `proposal.md`, `design.md`, `evidence.md`, `tasks.md`, the `review.md` of the change and the title of a test.
A banned word is a word or a phrase that `openspec/ste/words.json` lists, or a form of such a word that the list does not name.

A list lets the reviewer apply one rule. A principle lets the reviewer decide each case.

### D2: The title of a test

A banned word in a test title is major, because a title is a name that the gates read.
Two possible meanings in a title are minor when the title is true under each meaning.
A title that does not agree with the test body is major in all cases.

### D3: Tests pin sentences

The tests read the files of the agent and of `AGENTS.md`, and compare the sentences that the scenarios name with a literal string.
The tests also check that three old lines of the agent file are gone.
A reviewer applies the sentences, so the tests cannot check the result of a review.

### D4: Rule 16

Rule 16 of `AGENTS.md` changes only the list of severity words.
The review gate reads the second word of a finding. It accepts an open finding only with the severity `minor`.
