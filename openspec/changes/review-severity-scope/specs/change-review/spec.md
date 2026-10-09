## ADDED Requirements

### Requirement: Severity of findings
The severity instructions of the STE adversary MUST name minor for two possible meanings in other text that is true under each meaning.
Normative text is a requirement, a scenario, a rule of AGENTS.md or openspec/config.yaml, a message of the gate or the instructions of an agent.
Other text includes evidence.md, tasks.md, the notes and tables of design.md, review.md and the title of a test.

The instructions MUST keep the severity major for a banned word in normative text or in a test title.
They MUST keep the severity major for two possible meanings in normative text.
They MUST keep the severity major for a text or a title that does not agree with the code, the specs or the other prose.
They MUST keep the severity major for a task with two instructions.

Rule 16 of AGENTS.md MUST name the severities critical, major and minor.
Origin: spec-first

#### Scenario: Give minor to two meanings in other text `change-review-034`
- **WHEN** a person reads the severity instructions of the STE adversary
- **THEN** they define normative text and other text with the lists of this requirement
- **AND** they give the severity minor to two possible meanings in other text, when the text is true under each meaning

#### Scenario: Keep major for the faults that change a rule or a verdict `change-review-035`
- **WHEN** a person reads the severity instructions of the STE adversary
- **THEN** a banned word in normative text or in a test title is major
- **AND** two possible meanings in normative text are major
- **AND** a text or a title that does not agree with the code, the specs or the other prose is major
- **AND** a task that gives two instructions is major

#### Scenario: Name three severities in AGENTS.md `change-review-036`
- **WHEN** a person reads rule 16 of AGENTS.md
- **THEN** the rule names the severities critical, major and minor
- **AND** the rule does not name the severity blocker
