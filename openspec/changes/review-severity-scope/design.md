## Context

The tree starts at commit `ce4280f3`, from the command `git rev-parse HEAD`.
The severity list of the STE adversary is at the end of `.claude/agents/ste-adversary.md`.
It gives the severity major to each text with two possible meanings.
Rule 16 of `AGENTS.md` names the severities `blocker` and `minor`. The agents and the review command use `critical`, `major` and `minor`.

## Goals and non-goals

Give a wording fault in other text the severity minor, so that it does not fail a round.
Keep the severity major for a fault that changes a rule or a verdict.
Make rule 16 agree with the agents.
Do not change the review gate, the verdict rule, the limit of three rounds or the spec adversary.

## Decisions

### D1: Two lists

The instructions define normative text with a list.
Normative text is a requirement, a scenario, a rule of `AGENTS.md` or `openspec/config.yaml`, a message of the gate and the instructions of an agent.
The instructions define other text with a second list. The list includes `evidence.md`, `tasks.md`, the notes and tables of `design.md`, `review.md` and the title of a test.
A list gives a reviewer one rule to apply. A principle would leave each case to the reviewer.

### D2: The title of a test

A banned word in a test title is major, because a title is a name that the gates read.
Two possible meanings in a title are minor when the title is true under each meaning.
A title that the test body does not support is major in all cases.

### D3: Tests pin sentences

The tests read the files of the agent and of `AGENTS.md`, and compare each sentence with a literal string.
A reviewer applies the sentences, so the tests cannot check the result of a review.

### D4: Rule 16

Rule 16 of `AGENTS.md` changes only the list of severity words.
The review gate reads the second word of a finding. It accepts an open finding only with the severity `minor`.
