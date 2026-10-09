## Why

Review rounds fail for faults in the words that do not change the meaning of a text.
Archived changes show repeated majors for two possible meanings in evidence files, task lists and notes.
The owner asked on 2026-10-08 for a severity rule for this case.

## What Changes

- Name normative text, other text and a banned word in the instructions of the STE adversary.
- Give the severity minor to two possible meanings in other text, when the text is true under each meaning.
- Give the severity major to a banned word in normative text or in a test title.
- Keep the severity major for two possible meanings in normative text.
- Keep the severity major for a text that disagrees with the code, the specs or the other prose.
- Give the severity major to a task with two instructions, except for actions at the same time.
- Change rule 16 of `AGENTS.md` to name the severities `critical`, `major` and `minor`.

## Capabilities

### Modified Capabilities

- `change-review`: Add one requirement for the severity of findings.

## Impact

The change edits one agent file, `AGENTS.md` and one test file.
The change opens no coverage gap and closes no old gap.
The lead must check the gaps with the gates in the Docker image.
A session that runs keeps the old agent definitions until it starts again.

## Known limits and later changes

- Known limit `judgment`: The reviewer decides if a text is normative text. The lists in the instructions limit this decision.
- Known limit `pin-only`: The tests pin the sentences that the scenarios name. They do not show how a reviewer applies the sentences, and they do not check where a sentence is in the file. The check of the major lines reads only lines that start with `- **major**:`.
- Known limit `other-files`: The instructions of the spec adversary and the review command do not change.
