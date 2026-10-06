## ADDED Requirements

### Requirement: Exact process coverage
The coverage gate MUST replace loaded lcov records with the exact merge of per-process V8 coverage.

The lcov report names LF as lines found.
The lcov report names LH as lines hit.
The lcov report names BRF as branches found.
The lcov report names BRH as branches hit.
The lcov report names FNF as functions found.
The lcov report names FNH as functions hit.

SF names the source file.

The merge module MUST give equal values for every process order and group order. Each process first supplies its own line values. A line contributes to the merge when any process covers it. Function identities use the name and first range extent. Branch identities also use the range extent and its occurrence within equal extents.

A listed branch uses its range value. An absent branch uses the innermost listed range that contains it. A function without block coverage supplies its first range value. An absent function supplies zero. The merge keeps every function identity and every block branch identity.

The merge module splits the source after each line feed and keeps CRLF offsets. Empty lines start with a positive value. Each later range replaces the value of each whole line that it contains. Ignored lines contribute to LH. Every block range contributes to BRF. Each function after the first contributes to FNF when it holds a range.

Origin: spec-first

#### Scenario: A process gives exact line values `coverage-gate-055`

- **WHEN** a source holds an outer positive range and an inner zero range
- **THEN** the inner range gives no covered line
- **AND** the split keeps line feed and CRLF offsets, and empty lines start with a positive value
- **AND** The first fixture gives LF 3, LH 2, BRF 2, BRH 1, FNF 0 and FNH 0.
- **AND** a positive whole range covers both lines of the two-line fixture.

#### Scenario: Comments set the line state `coverage-gate-056`

- **WHEN** a source holds next-line and disable comments
- **THEN** ignored lines contribute to LH
- **AND** an enable comment resets the next-line state after its own line
- **AND** The combined comment fixture gives LH 4.

#### Scenario: A process gives branch and function values `coverage-gate-057`

- **WHEN** a script holds block ranges and a function after its first function
- **THEN** each block range contributes to BRF
- **AND** the first range of each later function contributes to FNF, and ignored ranges contribute to the covered values
- **AND** The function fixture gives LF 3, LH 1, BRF 3, BRH 1, FNF 2 and FNH 1.

#### Scenario: The merge keeps real line coverage `coverage-gate-058`

- **WHEN** one process covers a line and another process does not
- **THEN** the merge covers that line
- **AND** an inner zero range in every process stays uncovered
- **AND** The line merge fixture gives LF 3, LH 2, BRF 4, BRH 3, FNF 0 and FNH 0.

#### Scenario: Function identities use names and extents `coverage-gate-059`

- **WHEN** functions share a name but differ in their first range extent
- **THEN** the merge keeps each identity
- **AND** a function absent from one process gets no coverage from that process
- **AND** The identity fixture gives FNF 3 and FNH 2.

#### Scenario: An absent branch uses its parent value `coverage-gate-060`

- **WHEN** one process lists a branch and another process lists only its parent
- **THEN** the absent branch uses the innermost parent value
- **AND** a function without block coverage supplies its first range value
- **AND** The parent fixture gives BRF 2 and BRH 2.
- **AND** the later listed parent supplies the value when two parents have equal widths
- **AND** the equal parent fixture gives LF 2, LH 0, BRF 3, BRH 1, FNF 0 and FNH 0

#### Scenario: Equal extents keep occurrence identities `coverage-gate-061`

- **WHEN** one function lists two ranges with equal extents
- **THEN** the merge keeps both occurrence identities
- **AND** each occurrence uses its own listed value before the parent fallback
- **AND** The duplicate fixture gives BRF 2 and BRH 1 before the second process.

#### Scenario: Process order and groups give equal values `coverage-gate-062`

- **WHEN** a seeded generator permutes the same process fixtures
- **THEN** each permutation gives equal line, branch and function values
- **AND** separate groups give the same merge as the whole input
- **AND** a group with two URLs keeps both records, each with LF 1, BRF 1 and FNF 0
- **AND** the first URL gives LH 1 and BRH 1; the second gives LH 0 and BRH 0
- **AND** Each order gives LF 3, LH 2, BRF 4, BRH 3, FNF 0 and FNH 0.

#### Scenario: The merge module gives lcov records `coverage-gate-063`

- **WHEN** the merge holds separate source URLs
- **THEN** the merge module writes SF, LF, LH, BRF, BRH, FNF and FNH records
- **AND** each URL keeps its own record and end marker
- **AND** The two URL records each give LF 1, BRF 1 and FNF 0.

#### Scenario: Only the main process gets raw coverage `coverage-gate-064`

- **WHEN** the gate prepares a main process and allocation processes
- **THEN** only the main process gets NODE_V8_COVERAGE
- **AND** the runs file holds only the environment overlay of each process, with no inherited variable
- **AND** allocation processes get no environment key in the runs file
- **AND** the helper adds each overlay to its own environment and keeps its old default

#### Scenario: The gate keeps unloaded records `coverage-gate-065`

- **WHEN** the gate replaces loaded lcov records with the exact merge
- **THEN** the loaded record gives the merge values
- **AND** records of unloaded files stay unchanged and excluded raw URLs give no records
- **AND** The loaded fixture gives LF 3 and LH 3 in the gate test.
- **AND** the replacement removes the old records for separate loaded paths.

#### Scenario: The gate removes its raw folder `coverage-gate-066`

- **WHEN** the gate measures coverage with lcov text, without lcov text, or with a coverage merge error
- **THEN** its random raw folder lies in the system temporary folder, outside the root and output folder
- **AND** only the main process gets that path
- **AND** each measurement uses a different name with a non-empty suffix after `gev-spec-v8-`
- **AND** the raw folder does not exist after the measurement ends normally or after an error inside it
- **AND** the gate keeps the other output files after a measurement without a coverage merge error

#### Scenario: The gate reports absent raw files `coverage-gate-067`

- **WHEN** lcov text exists but the raw folder is absent or holds no coverage JSON file
- **THEN** the gate gives COVERAGE-RAW-MISSING with an empty file name
- **AND** the message states that absent raw files prevent replacement of the Node records
- **AND** the gate still uses the Node text for the other checks
- **AND** raw files prevent this error, and absent lcov text causes no such error, also with no raw files
