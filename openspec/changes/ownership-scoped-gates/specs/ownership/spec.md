## ADDED Requirements

### Requirement: Manifest contract
The gate MUST accept only a version 1 manifest with a unique array of safe relative paths.
Origin: spec-first

#### Scenario: Read a manifest `ownership-001`
- **WHEN** the gate reads valid and invalid manifest files
- **THEN** it accepts valid files and reports OWNERSHIP-MANIFEST for absent or invalid files

### Requirement: Path class
The gate MUST use exact paths and directory prefixes to classify each path.
Origin: spec-first

#### Scenario: Class paths `ownership-002`
- **WHEN** the manifest lists `single.js` and `src/own/`
- **THEN** `single.js` and `src/own/a.js` have the owned class
- **AND** `single.jsx` and `src/owner/a.js` have the upstream class

### Requirement: Class output
The gate MUST print each changed path class and the owned and upstream totals in check and ratchet.
Origin: spec-first

#### Scenario: Show path classes `ownership-003`
- **WHEN** check or ratchet has changed paths
- **THEN** the log names each class and shows Ownership: N owned, M upstream

### Requirement: Owned coverage
The gate MUST reject a coverage gap in an owned code file except a gap covered by valid waivers.
Origin: spec-first

#### Scenario: Check owned gaps `ownership-004`
- **WHEN** an owned code file has a line, branch or function gap
- **THEN** the gate reports COVERAGE-OWNED unless valid waivers cover all gap counts

### Requirement: Diff ranges
The gate MUST select the added line ranges of each current code file against the base.
Origin: spec-first

#### Scenario: Read diff lines `ownership-005`
- **WHEN** the diff has added, edited or deleted lines
- **THEN** the gate selects only the new line numbers and all lines of a new file

### Requirement: Line records
The gate MUST use the covered DA lines of every LCOV record for a file.
Origin: spec-first

#### Scenario: Read line counts `ownership-006`
- **WHEN** a file has duplicate LCOV records
- **THEN** the gate counts a line as covered only if every record covers it

### Requirement: Diff coverage
The gate MUST reject each uncovered changed line in owned and upstream code.
Origin: spec-first

#### Scenario: Check line gaps `ownership-007`
- **WHEN** a changed line has no true covered measurement
- **THEN** the gate reports COVERAGE-DIFF with the file and all uncovered line numbers

### Requirement: Line waivers
The gate MUST accept a line waiver only for its file hash and named lines within its count.
Origin: spec-first

#### Scenario: Check line waivers `ownership-008`
- **WHEN** an uncovered changed line has a waiver
- **THEN** only a true loaded file whose hash matches the waiver with the line metric and sufficient count passes

### Requirement: QA exception
The QA register MUST use a synthetic header only for an upstream script with no first header block.
A header block has a QA tag. Other comment blocks are not QA header blocks.
The purpose is `Check upstream code.`
The run value is `node` plus the file path.
The needs value is: The upstream script needs its own setup.

This exception takes priority over the qa-scripts header scenarios for upstream scripts.
The qa-scripts no-change advice rule applies only to scripts with no synthetic header.
Origin: spec-first

#### Scenario: Use an upstream header `ownership-009`
- **WHEN** an upstream QA script has no first header block
- **THEN** the register uses unmapped: upstream and prints an advisory

### Requirement: QA boundary
The QA register MUST reject an absent owned header and an invalid upstream header.
Origin: spec-first

#### Scenario: Reject a bad QA header `ownership-010`
- **WHEN** an owned script has no header or an upstream script has an invalid first block
- **THEN** the register reports QA-HEADER and keeps all other register checks

### Requirement: Gap report
The report command MUST list owned and upstream code and test gaps separately without a measurement.
Origin: spec-first

#### Scenario: Report gap classes `ownership-011`
- **WHEN** the ledger has owned and upstream code and test gaps
- **THEN** report lists the paths and totals of both classes without a test run

### Requirement: Process boundary
The process text MUST define the manifest, sync review scope and scenario repair rule.
Origin: spec-first

#### Scenario: Read the process rules `ownership-012`
- **WHEN** an agent reads AGENTS.md and the OpenSpec context
- **THEN** the text needs owned coverage, changed line coverage, sync adoption and a manual resolution list

### Requirement: Line data source
The measurement MUST store merged V8 line data in the trusted snapshot.
The line records use 1 for a covered line and 0 for an uncovered line.
Origin: spec-first

#### Scenario: Keep line data `ownership-013`
- **WHEN** the gate writes V8 coverage and a measurement snapshot
- **THEN** covered lines have positive DA counts and uncovered lines have zero DA counts
- **AND** the snapshot keeps the line data for document mode

### Requirement: Test instance total
The report MUST count all test instances in each ledger name map.
Origin: spec-first

#### Scenario: Count test instances `ownership-014`
- **WHEN** one test name has a count of 2 and another has a count of 1
- **THEN** the report has a total of 3 tests

### Requirement: QA header source
The register MUST treat a first comment block with no QA tags as no QA header.
Origin: spec-first

#### Scenario: Accept an upstream comment block `ownership-015`
- **WHEN** an upstream QA script starts with a comment block that has no QA tags
- **THEN** the register uses the synthetic upstream header
- **AND** an invalid first block with a QA tag still gives QA-HEADER

### Requirement: Numeric line order
The gate MUST sort line numbers in numeric order.
Origin: spec-first

#### Scenario: Sort line numbers `ownership-016`
- **WHEN** diff ranges or line records have lines 2, 10 and 20
- **THEN** the result has the order 2, 10, 20

### Requirement: Exact line records
The gate MUST accept only whole DA records and diff headers at the start of a line.
Origin: spec-first

#### Scenario: Reject extra record text `ownership-017`
- **WHEN** a DA record has a text prefix or suffix, or a diff header has a text prefix
- **THEN** the gate ignores that record or header

### Requirement: Gap totals
The gate MUST add gap counts and waiver counts across all records of the same class and metric.
Origin: spec-first

#### Scenario: Add gap and waiver counts `ownership-018`
- **WHEN** two owned files have 2 and 3 line gaps, or two line waivers each cover one gap
- **THEN** the report has 5 line gaps and the waivers cover a count of 2

### Requirement: Empty test names
The report MUST count zero test instances for an empty name map.
Origin: spec-first

#### Scenario: Count an empty name map `ownership-019`
- **WHEN** a test file has an empty name map
- **THEN** the report counts zero test instances

### Requirement: Sync line scope
The gate MUST check coverage only for base diff lines that also differ from the adopted upstream source.
This rule takes priority over Diff coverage for lines equal to the upstream source.
A file uses its last adopt source in the change, or the last source in the change if it has none.
Each source must be an ancestor of HEAD.
Origin: spec-first

#### Scenario: Exempt upstream lines `ownership-020`
- **WHEN** a merge brings 5 code lines equal to the adopt source
- **THEN** those lines need no changed line coverage
- **AND** the gate prints 5 changed lines, 5 upstream source lines and 0 lines that need coverage

#### Scenario: Check a manual conflict repair `ownership-021`
- **WHEN** a person resolves a conflict with line 1 that differs from the base and the adopt source
- **THEN** that line needs coverage
- **AND** an uncovered line gives COVERAGE-DIFF

#### Scenario: Check an edit to vendored code `ownership-022`
- **WHEN** a person edits vendored line 2 in the sync change
- **THEN** the line needs coverage if it differs from both sources
- **AND** other lines from the upstream source need no changed line coverage

#### Scenario: Select each file source `ownership-023`
- **WHEN** a change has more than one adopt source
- **THEN** each file uses its last own source and other files use the last source
- **AND** a file absent from its source needs coverage for all its base diff lines

#### Scenario: Reject an invalid source `ownership-024`
- **WHEN** an adopt source is absent or is not an ancestor of HEAD
- **THEN** the gate stops with COVERAGE-DIFF
- **AND** a change with no adopt source keeps the base diff rule

#### Scenario: Check current code paths `ownership-025`
- **WHEN** upstream deletes or renames a code file
- **THEN** deleted paths have no new lines and new paths use their source path without rename detection
- **AND** only current code inventory paths enter the line check
