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
- **AND** a script start tag with a src attribute and an event handler attribute gives each line of that tag as a code line
- **AND** a script start tag with a src attribute and a `javascript:` URL gives each line of that tag as a code line
- **AND** outside the script elements, each line of an event handler attribute and its value is a code line
- **AND** outside the script elements, each line of a `javascript:` URL is a code line, up to the end that the next lines give
- **AND** a URL after `=` and one quote, with only white space around that quote, ends at the next quote of the same type
- **AND** such a URL with no next quote of that type ends at the end of the file
- **AND** another URL ends at the first quote or `>` after it, or at the end of its own line when no such character follows
- **AND** the gate prints no COVERAGE-DIFF for an added or edited line of that file that is not a code line
- **AND** the gate prints COVERAGE-DIFF for an added or edited code line of that file, because an HTML file has no covered line data
