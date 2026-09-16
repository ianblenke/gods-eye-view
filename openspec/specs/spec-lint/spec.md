# spec-lint Specification

## Purpose
Check the format of scenarios, requirements and tasks in the OpenSpec files.

## Requirements
### Requirement: Scenario format
Each scenario in `openspec/specs` and in the active changes MUST be under a requirement. It MUST have one WHEN line and one or more THEN lines.
Origin: spec-first

#### Scenario: Stop for a scenario without a WHEN line `spec-lint-001`
- **WHEN** a scenario has no line that starts with `- **WHEN**`
- **THEN** the spec lint stops the build

#### Scenario: Stop for a scenario with two WHEN lines `spec-lint-002`
- **WHEN** a scenario has two lines that start with `- **WHEN**`
- **THEN** the spec lint stops the build

#### Scenario: Stop for a scenario without a THEN line `spec-lint-003`
- **WHEN** a scenario has no line that starts with `- **THEN**`
- **THEN** the spec lint stops the build

#### Scenario: Stop for a scenario outside a requirement `spec-lint-009`
- **WHEN** a scenario heading is before the first requirement heading of its section
- **THEN** the spec lint stops the build

#### Scenario: Stop for a scenario under a renamed requirement `spec-lint-010`
- **WHEN** a scenario is under a requirement in the section "RENAMED Requirements"
- **THEN** the spec lint stops the build
- **AND** the trace gate does not read the scenario

### Requirement: Requirement format
The first line of each requirement MUST contain MUST. Each requirement MUST have an origin line. The spec lint MUST also check the requirements of the archived change that the gates check.
Origin: spec-first

#### Scenario: Check the requirements of the archived change that the gates check `spec-lint-022`
- **WHEN** the gates check an archived change
- **AND** a delta spec of the change has a requirement with no scenario
- **THEN** the spec lint stops the build
- **AND** the gate shows the file and the line of the requirement in the archived change

#### Scenario: Stop for a requirement without MUST in its first line `spec-lint-004`
- **WHEN** the first line of a requirement does not contain `MUST`
- **THEN** the spec lint stops the build

#### Scenario: Stop for a requirement without an origin line `spec-lint-005`
- **WHEN** a requirement has no line "Origin: spec-first" and no line "Origin: backfill"
- **THEN** the spec lint stops the build

#### Scenario: Stop for a requirement without a scenario `spec-lint-011`
- **WHEN** a requirement that is not under "REMOVED Requirements" has no scenario
- **THEN** the spec lint stops the build

#### Scenario: Stop for a change section in a main spec `spec-lint-012`
- **WHEN** a file in `openspec/specs/` has the section "ADDED Requirements", "MODIFIED Requirements", "REMOVED Requirements" or "RENAMED Requirements"
- **THEN** the spec lint stops the build

#### Scenario: Stop for a requirement outside the requirements section of a main spec `spec-lint-013`
- **WHEN** a requirement heading in a file in `openspec/specs/` is in a section with a name other than "Requirements"
- **THEN** the spec lint stops the build

#### Scenario: Read the requirement headings and the scenario headings in upper case and lower case `spec-lint-014`
- **WHEN** a heading starts with `### requirement:` or `#### scenario:` in lower case
- **THEN** the spec lint reads the heading as a requirement heading or a scenario heading

#### Scenario: End a fenced code block only at its end fence `spec-lint-015`
- **WHEN** a fenced code block contains a fence line with another character, or with fewer characters than the first fence line
- **THEN** the spec lint reads the next lines as part of the fenced code block
- **AND** the spec lint reads the headings after the end fence line
- **AND** the end fence line has the same character and the same number of characters or more characters

#### Scenario: Stop for a heading that is not a known heading `spec-lint-016`
- **WHEN** a spec file has a heading of level 2 to 6
- **AND** the heading is not "Purpose", a requirements section, a requirement heading of level 3 or a scenario heading of level 4
- **THEN** the spec lint stops the build
- **AND** the gate shows the file and the line

#### Scenario: Read the lines of a spec file with each line end `spec-lint-017`
- **WHEN** a spec file has lines that end with a carriage return, with or without a line feed
- **THEN** the spec lint reads each line in the same way as a line that ends with a line feed

#### Scenario: Do not check removed requirements `spec-lint-008`
- **WHEN** a delta spec has a requirement under "REMOVED Requirements"
- **THEN** the spec lint does not check the format of that requirement

### Requirement: Tasks for scenarios
The `tasks.md` file of an active change MUST name each scenario ID of that change. The `tasks.md` file of the archived change that the gates check MUST also name each scenario ID of that change.
Origin: spec-first

#### Scenario: Stop for a scenario that no task names `spec-lint-006`
- **WHEN** an active change has a scenario ID
- **AND** its `tasks.md` file does not contain that ID
- **THEN** the spec lint stops the build

#### Scenario: Stop for a scenario of the archived change that no task names `spec-lint-021`
- **WHEN** the gates check an archived change
- **AND** the `tasks.md` file of the change does not contain a scenario ID of its delta specs
- **THEN** the spec lint stops the build
- **AND** the gate shows the `tasks.md` file of the archived change

#### Scenario: Do not stop for a change with a task for each scenario `spec-lint-007`
- **WHEN** the `tasks.md` file of an active change contains each scenario ID of that change
- **THEN** the spec lint does not stop the build for the tasks

### Requirement: OpenSpec check
The spec lint MUST check the specs and the active changes with the OpenSpec CLI at the pinned version. The CLI and the gates MUST read the same requirements and scenarios.
Origin: spec-first

#### Scenario: Stop for a spec that OpenSpec does not accept `spec-lint-018`
- **WHEN** `openspec validate --specs --strict` does not accept a spec in `openspec/specs/`
- **THEN** the spec lint stops the build
- **AND** the gate shows the file and the problems that OpenSpec reports

#### Scenario: Stop when OpenSpec and the gates read a different number of requirements or scenarios `spec-lint-019`
- **WHEN** OpenSpec and the gates read a different number of requirements, or of scenarios in a requirement, in a spec file
- **AND** the file is a main spec or a delta spec of an active change with a `proposal.md` file
- **THEN** the spec lint stops the build
- **AND** the gate shows the file and the two counts

#### Scenario: Stop when the OpenSpec CLI does not have the pinned version `spec-lint-020`
- **WHEN** the OpenSpec CLI is not there, or its version is not the pinned version
- **THEN** the spec lint stops the build

