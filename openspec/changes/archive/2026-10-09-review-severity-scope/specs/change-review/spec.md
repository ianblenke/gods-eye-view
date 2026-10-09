## ADDED Requirements

### Requirement: Severity of findings
The severity instructions of the STE adversary MUST name the severity minor for two possible meanings in other text that is true under each meaning.
Normative text is a requirement, a scenario, a rule of AGENTS.md or openspec/config.yaml, a message of the gate or the instructions of an agent.
Other text includes proposal.md, design.md, evidence.md, tasks.md, the review.md of the change and the title of a test.
A banned word is a word or a phrase in the lists `words`, `phrases` or `newWords` of `openspec/ste/words.json`. A form of such a word with the suffix -s, -ed or -ing that the lists do not name is also a banned word.

The instructions MUST give the severity major to a banned word in normative text or in a test title.
They MUST keep the severity major for two possible meanings in normative text.
They MUST keep the severity major for a text or a title that does not agree with the code, the specs or the other prose.
They MUST give the severity major to a task with two instructions, except for actions at the same time.
They MUST NOT give the severity major to two possible meanings in other text that is true under each meaning.

Rule 16 of AGENTS.md MUST name the severities critical, major and minor.
Origin: spec-first

#### Scenario: Give minor to two meanings in other text `change-review-034`
- **WHEN** a person reads the severity instructions of the STE adversary
- **THEN** the instructions define normative text and other text with the definitions of normative text and of other text in this requirement
- **AND** the instructions give the severity minor to two possible meanings in other text, when the text is true under each meaning
- **AND** the instructions give the severity minor to a text with one clear meaning and an STE fault that no major item names

#### Scenario: Give major to the faults that the requirement names `change-review-035`
- **WHEN** a person reads the severity instructions of the STE adversary
- **THEN** the instructions define a banned word
- **AND** a banned word in normative text or in a test title is major
- **AND** two possible meanings in normative text are major
- **AND** a text or a title that disagrees with the code, the specs or the other prose is major
- **AND** a task that gives two instructions is major, except for actions at the same time
- **AND** the instructions do not give the severity major to two possible meanings in other text that is true under each meaning
- **AND** the instructions tell the reviewer to report a form of a banned word that the lint does not find
- **AND** the instructions let the evidence for a major finding be a quote of the banned word or of the two instructions of a task

#### Scenario: Name three severities in AGENTS.md `change-review-036`
- **WHEN** a person reads rule 16 of AGENTS.md
- **THEN** the rule names the severities critical, major and minor
- **AND** the rule does not name the severity blocker
