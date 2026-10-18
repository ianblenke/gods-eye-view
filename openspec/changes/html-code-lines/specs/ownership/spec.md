## MODIFIED Requirements

### Requirement: Diff coverage
The gate MUST reject each uncovered changed line in owned and upstream code.
Origin: spec-first

#### Scenario: Check line gaps `ownership-007`
- **WHEN** a changed line has no covered line data from a loaded file whose coverage is not untrue
- **THEN** the gate prints COVERAGE-DIFF with the file and all uncovered line numbers

#### Scenario: Ask coverage only for the code lines of an HTML file `ownership-056`
- **WHEN** a change adds or edits lines of an HTML file
- **THEN** the changed lines of that file are only the added or edited lines that are code lines
- **AND** each line of the start tag of a script element without a src attribute is a code line
- **AND** each line of the text of that element is a code line when the line is not blank
- **AND** each line of an event handler attribute and its value is a code line
- **AND** each line from a `javascript:` URL that starts a quoted value to the end quote is a code line
- **AND** each line of another `javascript:` URL, up to the first quote or `>` after it, is a code line
- **AND** another `javascript:` URL with no quote or `>` after it gives only its own line as a code line
- **AND** the gate prints no COVERAGE-DIFF for an added or edited line of that file that is not a code line
- **AND** the gate prints COVERAGE-DIFF for an added or edited code line of that file, because an HTML file has no covered line data
