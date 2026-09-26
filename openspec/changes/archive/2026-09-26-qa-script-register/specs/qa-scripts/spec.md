## ADDED Requirements

### Requirement: QA script header
The register MUST check the first block comment of each tracked file with the name `scripts/qa-*.mjs`.
Origin: spec-first

#### Scenario: Accept the four tags after an optional shebang `qa-scripts-001`
- **WHEN** a tracked QA script has a shebang and then a block with one valid line for each tag
- **THEN** the register reports no header error for the script

#### Scenario: Reject a block that is not first `qa-scripts-002`
- **WHEN** code comes before the header block of a tracked QA script
- **THEN** the register reports `QA-HEADER` for the script

#### Scenario: Reject an absent tag `qa-scripts-003`
- **WHEN** a tracked QA script has no line for one of the four tags
- **THEN** the register reports `QA-HEADER` for the script

#### Scenario: Reject a repeated tag `qa-scripts-004`
- **WHEN** a tracked QA script has two lines with the same tag
- **THEN** the register reports `QA-HEADER` for the script

#### Scenario: Reject an empty tag `qa-scripts-005`
- **WHEN** a tag line of a tracked QA script has no value
- **THEN** the register reports `QA-HEADER` for the script

#### Scenario: Reject a bad covers item `qa-scripts-006`
- **WHEN** an item in the covers list does not match the grammar in the design
- **THEN** the register reports `QA-HEADER` for the script

#### Scenario: Accept a capability folder `qa-scripts-007`
- **WHEN** a covers item names a folder in `openspec/specs/`
- **THEN** the register reports no covers error for that item

#### Scenario: Reject an unknown capability `qa-scripts-008`
- **WHEN** a covers item names a capability without a folder in `openspec/specs/`
- **THEN** the register reports `QA-COVERS-UNKNOWN` for the script

#### Scenario: Accept an open pending area `qa-scripts-009`
- **WHEN** a pending item names an area without a folder in `openspec/specs/`
- **THEN** the register reports no covers error for that item

#### Scenario: Reject a pending area that has a capability folder `qa-scripts-010`
- **WHEN** a pending item names an area with a folder in `openspec/specs/`
- **THEN** the register reports `QA-COVERS-LANDED` for the script

#### Scenario: Accept one unmapped reason `qa-scripts-011`
- **WHEN** the covers line has only one unmapped item with a reason
- **THEN** the register reports no header error for that line

#### Scenario: Reject an unmapped list `qa-scripts-012`
- **WHEN** a covers line has an unmapped item and one more item
- **THEN** the register reports `QA-HEADER` for the script

### Requirement: Coverage inventory
The gate MUST omit only tracked QA scripts with valid headers from the code inventory.
Origin: spec-first

#### Scenario: Omit a valid QA script `qa-scripts-013`
- **WHEN** a tracked QA script has no `QA-HEADER` error
- **THEN** the code inventory omits the script

#### Scenario: Keep a QA script with a bad header `qa-scripts-014`
- **WHEN** a tracked QA script has a `QA-HEADER` error
- **THEN** the code inventory contains the script
- **AND** the gate shows its coverage gap

#### Scenario: Keep other code files `qa-scripts-015`
- **WHEN** the tracked list has a code file outside `scripts/qa-*.mjs`
- **THEN** the code inventory contains that file

### Requirement: Change advice
The gate MUST print the QA advice after the Trace line for a named change.
Origin: spec-first

#### Scenario: Name a script for a delta capability `qa-scripts-016`
- **WHEN** a named change has a delta spec for a capability in a script covers list
- **THEN** the gate prints one QA line with the script, capability and purpose after the Trace line

#### Scenario: Name a script for a backfill area `qa-scripts-017`
- **WHEN** the named change is `backfill-<area>` and a script has that pending area
- **THEN** the gate prints one QA line with the script, area and purpose after the Trace line

#### Scenario: Report no script match `qa-scripts-018`
- **WHEN** a named change matches no covers item
- **THEN** the gate prints the exact no-match QA line from the design after the Trace line

#### Scenario: Omit advice without a change `qa-scripts-019`
- **WHEN** the gate runs without a change name
- **THEN** the gate prints no QA advice line

### Requirement: Project process
The project process MUST make authors and reviewers use the QA advice.
Origin: spec-first

#### Scenario: Tell authors to read the QA lines `qa-scripts-020`
- **WHEN** an author reads rule 22 in `AGENTS.md`
- **THEN** the rule tells the author to read QA lines for a spec change
- **AND** the rule tells the author to avoid a conflict with a listed purpose
- **AND** the rule tells the author to add a header to each new QA script

#### Scenario: Give QA lines to the review agent `qa-scripts-021`
- **WHEN** the review command starts the spec adversary
- **THEN** the command gives the QA lines of the gate output to that agent

#### Scenario: Check each listed QA script `qa-scripts-022`
- **WHEN** the spec adversary reads the gate output
- **THEN** check 11 tells the agent to read each listed script purpose and its checks
- **AND** check 11 asks for a scenario that conflicts with the checks or a proved behavior with no scenario

### Requirement: Repository register
The real repository MUST pass the register check after the headers are complete.
Origin: spec-first

#### Scenario: The real repository passes the register check `qa-scripts-023`
- **WHEN** the register checks the tracked QA scripts of this repository
- **THEN** it checks all 70 tracked QA scripts
- **AND** the register reports no QA error

### Requirement: Register errors stop the gate
The gate MUST stop for each QA register error.
Origin: spec-first

#### Scenario: Stop for a header error `qa-scripts-024`
- **WHEN** a tracked QA script has a `QA-HEADER` error
- **THEN** the gate stops
- **AND** the gate prints the error code and script path

#### Scenario: Stop for a covers error `qa-scripts-025`
- **WHEN** a tracked QA script has `QA-COVERS-UNKNOWN` or `QA-COVERS-LANDED`
- **THEN** the gate stops
- **AND** the gate prints the error code and script path
- **AND** the code inventory omits that script if its header is valid

### Requirement: Advice for archived changes
The gate MUST use the delta specs of an active or archived named change.
Origin: spec-first

#### Scenario: Name a script for an archived change `qa-scripts-026`
- **WHEN** an archived change has a delta spec for a capability in a script covers list
- **THEN** the gate prints the same QA line as for an active change

#### Scenario: Name each matched capability `qa-scripts-027`
- **WHEN** two scripts cover two capabilities in the delta specs of one change
- **THEN** the gate prints one QA line for each capability
- **AND** the lines use script path and capability order

### Requirement: One line per tag
The register MUST reject any header line that does not contain one of the four tags.
Origin: spec-first

#### Scenario: Reject a continuation line `qa-scripts-028`
- **WHEN** a header has a text line after one of its tag lines
- **THEN** the register reports `QA-HEADER` for the script
