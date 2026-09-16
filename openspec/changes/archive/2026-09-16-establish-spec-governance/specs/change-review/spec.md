## ADDED Requirements

### Requirement: Review file
Each change MUST have a file `review.md` in its folder before you merge the change. The file records the verdict, the reviewers, the date, the gate result, the reviewed tree hash and each finding. The folder `review/` MUST contain the output of each review agent.
Origin: spec-first

#### Scenario: Do not stop for a passed review `change-review-001`
- **WHEN** `review.md` has one "Verdict: PASS" line, a "Reviewers:" line with the two agents, a "Date:" line, a "Gates:" line and a "Reviewed-Tree:" line
- **AND** each finding has a checked box and each agent output has "Verdict: PASS"
- **THEN** the review gate does not stop the build

#### Scenario: Stop when the review.md file is not there `change-review-002`
- **WHEN** the change folder has no `review.md` file
- **THEN** the review gate stops the build

#### Scenario: Stop for a failed review `change-review-003`
- **WHEN** `review.md` has the line "Verdict: FAIL"
- **THEN** the review gate stops the build

#### Scenario: Stop for a review without a verdict `change-review-010`
- **WHEN** `review.md` has no verdict line
- **THEN** the review gate stops the build

#### Scenario: Stop for two verdict lines `change-review-011`
- **WHEN** `review.md` has two verdict lines
- **THEN** the review gate stops the build

#### Scenario: Stop for an open finding `change-review-004`
- **WHEN** `review.md` has a finding with a box that is not checked
- **AND** the list item of the finding starts with `-`, `*`, `+` or a number
- **THEN** the review gate stops the build
- **AND** the gate shows the finding

#### Scenario: Stop when the reviewers line is not there `change-review-005`
- **WHEN** `review.md` has no "Reviewers:" line
- **THEN** the review gate stops the build

#### Scenario: Stop when the date line is not there `change-review-012`
- **WHEN** `review.md` has no "Date:" line
- **THEN** the review gate stops the build

#### Scenario: Stop when the gates line is not there `change-review-013`
- **WHEN** `review.md` has no "Gates:" line
- **THEN** the review gate stops the build

#### Scenario: Stop for a reviewers line without the two agents `change-review-014`
- **WHEN** the "Reviewers:" line does not name `spec-adversary` and `ste-adversary`
- **THEN** the review gate stops the build

#### Scenario: Stop for a tree hash that is not equal to the current hash `change-review-015`
- **WHEN** the gates run with `--change <name>`
- **AND** the "Reviewed-Tree:" hash is not equal to the hash of the change files and the diff files outside `openspec/changes/` now
- **THEN** the review gate stops the build

#### Scenario: Show the tree hash of a change `change-review-019`
- **WHEN** you run `tree --change <name>`
- **THEN** the command shows the hash of the change files and the diff files outside `openspec/changes/`

#### Scenario: Stop when an agent output is not there `change-review-016`
- **WHEN** the folder `review/` has no output file for one of the two agents
- **THEN** the review gate stops the build

#### Scenario: Stop for an agent output without the verdict PASS `change-review-018`
- **WHEN** the output file of an agent does not have the line "Verdict: PASS"
- **THEN** the review gate stops the build

#### Scenario: Stop for an agent output with more than one verdict line `change-review-022`
- **WHEN** the output file of an agent has two or more lines that start with "Verdict:"
- **THEN** the review gate stops the build

### Requirement: Review gate runs
The review gate MUST check the named change when the gates run with `--change <name>`. It MUST check the verdict, the fields and the findings of each archived change on each run.
Origin: spec-first

#### Scenario: Check the named change `change-review-006`
- **WHEN** the gates run with the option `--change establish-spec-governance`
- **THEN** the review gate checks the `review.md` file of that change

#### Scenario: Check each archived change `change-review-007`
- **WHEN** the gates run
- **THEN** the review gate checks the `review.md` file of each folder in `openspec/changes/archive`

#### Scenario: Stop for a change name that two changes use `change-review-020`
- **WHEN** two change folders, active or archived, have the same change name
- **THEN** the review gate stops the build

### Requirement: Adversarial review agents
The project MUST have two Claude Code review agents: `spec-adversary` and `ste-adversary`. Each agent MUST have only the tools Read, Grep and Glob. The front matter of each agent MUST have only the keys name, description, tools, model and color.
Origin: spec-first

#### Scenario: Do not stop for the spec adversary with read tools `change-review-008`
- **WHEN** `.claude/agents/spec-adversary.md` has the name `spec-adversary`, a description and the tools Read, Grep and Glob
- **THEN** the review gate does not stop the build for the agent

#### Scenario: Do not stop for the STE adversary with read tools `change-review-009`
- **WHEN** `.claude/agents/ste-adversary.md` has the name `ste-adversary`, a description and the tools Read, Grep and Glob
- **THEN** the review gate does not stop the build for the agent

#### Scenario: Stop for an agent with another tool `change-review-017`
- **WHEN** a review agent file lists a tool other than Read, Grep and Glob
- **THEN** the review gate stops the build

#### Scenario: Stop for a review agent file that is not complete `change-review-021`
- **WHEN** a review agent file is not there, or it has no name, no description or no tools line
- **THEN** the review gate stops the build

#### Scenario: Stop for a review agent file with other front matter lines `change-review-023`
- **WHEN** the front matter of a review agent file has an indented line or a key other than name, description, tools, model and color
- **THEN** the review gate stops the build
- **AND** the gate shows each of these lines
