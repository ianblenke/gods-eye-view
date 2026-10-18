## MODIFIED Requirements

### Requirement: Diff coverage
The gate MUST reject each uncovered changed line in owned and upstream code.
Origin: spec-first

#### Scenario: Check line gaps `ownership-007`
- **WHEN** a changed line has no covered line data from a loaded file whose coverage is not untrue
- **THEN** the gate prints COVERAGE-DIFF with the file and all uncovered line numbers

#### Scenario: Ask coverage only for the code lines of an HTML file `ownership-056`
- **WHEN** a change edits lines of an HTML file
- **THEN** the changed lines of that file are only its code lines
- **AND** a line of code in a script element is a code line when the start tag of that element has no src attribute
- **AND** each line of an event handler attribute and its value is a code line
- **AND** each line of a `javascript:` URL, up to the first quote or `>` after it, is a code line
- **AND** the gate prints no COVERAGE-DIFF for an edited line of that file that is not a code line
- **AND** the gate prints COVERAGE-DIFF for an edited code line of that file, because an HTML file has no covered line data
