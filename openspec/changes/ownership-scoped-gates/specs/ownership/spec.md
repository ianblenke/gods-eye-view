## ADDED Requirements

### Requirement: Manifest contract
The gate MUST accept only a version 1 manifest with an array of unique paths; each path is relative and safe.
A safe path has only ASCII letters, digits, underscores, dots, hyphens and slashes.
It has no absolute prefix, repeated slash or dot segment.
Origin: spec-first

#### Scenario: Read a manifest `ownership-001`
- **WHEN** the gate reads valid and invalid manifest files
- **THEN** it accepts valid files and reports OWNERSHIP-MANIFEST for absent or invalid files
- **AND** a read without a base uses only the current manifest

### Requirement: Path class
The gate MUST use exact paths and directory prefixes to classify each path.
Origin: spec-first

#### Scenario: Classify paths `ownership-002`
- **WHEN** the manifest lists `single.js` and `src/own/`
- **THEN** `single.js` and `src/own/a.js` have the owned class
- **AND** `single.jsx` and `src/owner/a.js` have the upstream class

### Requirement: Class output
The gate MUST print the class of each path in the diff against the base and the owned and upstream totals in check and ratchet.
The owned gap advice applies only to check and ratchet.
Invalid history stops before the owned gap advice. The owned gap advice comes before the changed line check.
Origin: spec-first

#### Scenario: Show path classes `ownership-003`
- **WHEN** check or ratchet has paths in the diff
- **THEN** the log names each class and shows Ownership: N owned, M upstream

#### Scenario: Omit advice from CI and init `ownership-053`
- **WHEN** a ledger has a recorded owned gap and the command is ci or init
- **THEN** the output has no Class, Ownership or Owned gaps line

### Requirement: Owned coverage
The gate MUST reject gaps in changed owned code files and owned code files without a ledger entry, except valid waivers.
A file mode change does not change code content.
Origin: spec-first

#### Scenario: Check owned gaps `ownership-004`
- **WHEN** a changed owned code file or an owned code file without a ledger entry has a gap
- **THEN** the gate reports COVERAGE-OWNED unless valid waivers waive all gap counts

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
- **WHEN** a changed line has no covered line data from a loaded file whose coverage is not untrue
- **THEN** the gate reports COVERAGE-DIFF with the file and all uncovered line numbers

### Requirement: Line waivers
The gate MUST accept a line waiver only for its file hash and named lines within its count.
Origin: spec-first

#### Scenario: Check line waivers `ownership-008`
- **WHEN** an uncovered changed line has a waiver
- **THEN** the file is loaded
- **AND** its coverage is not untrue
- **AND** its hash equals the waiver hash
- **AND** the waiver metric is lines
- **AND** the waiver count is not below the number of waived lines

### Requirement: QA exception
The QA register MUST limit the synthetic header to upstream scripts with no QA tag in their first comment block.
The script must exist at the base without such a tag, or a valid adopt record must name it.
A header block has a QA tag. Other comment blocks are not QA header blocks.
The purpose is `Check upstream code.`
The run value is `node`, a space and the file path.
The needs value is:

```text
The upstream script needs its own setup.
```

The scenario qa-scripts-019 does not apply to a synthetic header: the gate prints the synthetic header advisory when no change name is given. The scenarios qa-scripts-002 and qa-scripts-003 do not apply within this exception.
The base script must have no QA tag in its first comment block, or a valid adopt record must name it.
Origin: spec-first

#### Scenario: Use an upstream header `ownership-009`
- **WHEN** an upstream QA script has no header block at the start of the file
- **AND** its base had no QA tag, or a valid adopt record names it
- **THEN** the register uses the covers item `unmapped: upstream` and prints an advisory

### Requirement: QA boundary
The QA register MUST reject an absent owned header and an invalid upstream header.
Origin: spec-first

#### Scenario: Reject a bad QA header `ownership-010`
- **WHEN** an owned script has no header or an upstream script has an invalid first block
- **THEN** the register reports QA-HEADER and keeps all other register checks

### Requirement: Gap report
The report command MUST list owned and upstream code and test gaps separately without a test run.
Origin: spec-first

#### Scenario: Report gap classes `ownership-011`
- **WHEN** the ledger has owned and upstream code and test gaps
- **THEN** the report lists the paths and totals of both classes without a test run

### Requirement: Process boundary
The process text MUST define the manifest, the sync review scope and the rule for a scenario that a sync breaks.
Origin: spec-first

#### Scenario: Read the process rules `ownership-012`
- **WHEN** an agent reads AGENTS.md and the OpenSpec context
- **THEN** the text says that a changed owned code file and an owned code file without a ledger entry need full coverage
- **AND** it says that a changed line needs coverage and that a sync uses `adopt`
- **AND** review.md lists the files that a person resolved by hand

### Requirement: Line data
The measurement MUST store merged V8 line data in the trusted snapshot.
The line records use 1 for a covered line and 0 for an uncovered line.
Origin: spec-first

#### Scenario: Keep line data `ownership-013`
- **WHEN** the gate writes V8 coverage and a measurement snapshot
- **THEN** covered lines have the DA count 1 and uncovered lines have the DA count 0
- **AND** the snapshot keeps the line data for document mode

### Requirement: Test instance total
The report MUST count all test instances in each ledger name map.
Origin: spec-first

#### Scenario: Count test instances `ownership-014`
- **WHEN** one test name has a count of 2 and another has a count of 1
- **THEN** the report has a total of 3 tests

### Requirement: QA header block
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

#### Scenario: Ignore extra record text `ownership-017`
- **WHEN** a DA record has a text prefix or suffix, or a diff header has a text prefix
- **THEN** the gate ignores that record or header

### Requirement: Gap totals
The gate MUST add gap counts and waiver counts across all records of the same class and metric.
Origin: spec-first

#### Scenario: Add gap and waiver counts `ownership-018`
- **WHEN** two owned files have 2 and 3 line gaps and two line waivers each waive one gap
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
Each adopt source must come from a record that passes the ledger record checks. Its `from` commit must be a parent, other than the first parent, of a merge commit after the base commit.
Origin: spec-first

#### Scenario: Exempt upstream lines `ownership-020`
- **WHEN** a merge brings 5 code lines equal to the adopt source
- **THEN** those lines need no changed line coverage
- **AND** the gate prints this line:

```text
COVERAGE-DIFF: 5 changed lines, 5 brought by the merged upstream commit, 0 need coverage.
```

#### Scenario: Check a conflict that a person resolved by hand `ownership-021`
- **WHEN** a person resolves a conflict and line 1 of the result differs from the base and the adopt source
- **THEN** that line needs coverage
- **AND** an uncovered line gives COVERAGE-DIFF

#### Scenario: Check an edit to vendored code `ownership-022`
- **WHEN** a person edits vendored line 2 in the sync change
- **THEN** the line needs coverage if it differs from the base and from the adopt source
- **AND** other lines that equal the adopt source need no changed line coverage

#### Scenario: Select each file source `ownership-023`
- **WHEN** a change has more than one adopt source
- **THEN** each file uses its last adopt source and other files use the last source
- **AND** a file absent from its source needs coverage for all its base diff lines

#### Scenario: Reject an invalid source `ownership-024`
- **WHEN** an adopt source commit is not in the repository or is not a merge parent after the base
- **THEN** the gate stops with LEDGER-ADOPT-FROM
- **AND** a change with no adopt source keeps the base diff rule
- **AND** an invalid source stops before the base ledger JSON check

#### Scenario: Check current code paths `ownership-025`
- **WHEN** the upstream project deletes or renames a code file
- **THEN** deleted paths have no new lines and new paths use the same path in the adopt source without rename detection
- **AND** the line check reads only current code inventory paths

#### Scenario: Keep an old owned gap `ownership-026`
- **WHEN** an unchanged owned code file has a recorded gap
- **THEN** the owned coverage check passes
- **AND** the report and the owned gap advice of check and ratchet list the gap
- **AND** adopt gives no owned gap advice

#### Scenario: Reject a changed owned gap `ownership-027`
- **WHEN** a changed owned code file has a recorded gap
- **THEN** the gate reports COVERAGE-OWNED

#### Scenario: Reject a new owned gap `ownership-028`
- **WHEN** a new owned code file has a gap and no ledger entry
- **THEN** the gate reports COVERAGE-OWNED

### Requirement: Base ownership
For a comparison with a base, the gate MUST classify a path as owned when the base manifest or the current manifest lists it.
Origin: spec-first

#### Scenario: Keep base owned paths `ownership-029`
- **WHEN** the current manifest removes or shortens a base owned prefix
- **THEN** paths that the base manifest lists stay owned
- **AND** an absent base manifest is empty and an invalid base manifest gives OWNERSHIP-MANIFEST
- **AND** each path occurs once in the union manifest

#### Scenario: Check the project manifest `ownership-030`
- **WHEN** the test reads the project manifest
- **THEN** scripts/spec/gates.mjs, src/layers/osh/index.js and server/providers/osh.js are owned

### Requirement: Adopt record boundary
The gate MUST stop an adopt record for this change with an invalid file or source.
The file and from fields must be strings. A merge after the base must bring the source.
This rule takes priority over gap-ledger-095 for those records.
Other records that adoptsOf does not accept give no source.
Origin: spec-first

#### Scenario: Stop a record without a file `ownership-031`
- **WHEN** an adopt record for this change has no file and its from value is HEAD
- **THEN** the gate gives LEDGER-ADOPT-FROM
- **AND** its log line is:

```text
ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl LEDGER-ADOPT-FROM: Use a complete adopt record with a source that a merge after the base brought.
```

#### Scenario: Stop a work branch source `ownership-032`
- **WHEN** an adopt record names a work branch commit that no merge brought
- **THEN** the gate gives LEDGER-ADOPT-FROM

#### Scenario: Stop an ancestor without a merge `ownership-033`
- **WHEN** an adopt record names an ancestor that no merge after the base brought
- **THEN** the gate gives LEDGER-ADOPT-FROM

#### Scenario: Stop a number in the source field `ownership-041`
- **WHEN** an adopt record has the from value 1 and branch 1 names a valid merged source
- **THEN** the gate gives LEDGER-ADOPT-FROM
- **AND** the string value 1 is a valid source name

#### Scenario: Stop a later invalid record `ownership-050`
- **WHEN** a valid adopt record comes before a record for this change without a file
- **THEN** the gate gives LEDGER-ADOPT-FROM for the later record

#### Scenario: Stop a source name with a null byte `ownership-052`
- **WHEN** the from string of an adopt record has a null byte
- **THEN** the gate gives LEDGER-ADOPT-FROM with the same message as ownership-031

### Requirement: QA exception boundary
The register MUST keep QA-HEADER for a new script or a script whose base header has a QA tag.
Origin: spec-first

#### Scenario: Stop a new script without a header `ownership-034`
- **WHEN** a new upstream script has no header and no valid adopt record names it
- **THEN** the register gives QA-HEADER

#### Scenario: Stop a deleted header `ownership-035`
- **WHEN** an upstream script had a QA tag at the base and has no header now
- **THEN** the register gives QA-HEADER

### Requirement: Diff process bounds
The diff process MUST use a 256 MiB output buffer.
Origin: spec-first

#### Scenario: Set the diff buffer `ownership-036`
- **WHEN** the gate starts the Git diff process
- **THEN** maxBuffer is 268435456 bytes

### Requirement: Gate order
The gate MUST stop after a failed diff or invalid history before later checks.
Origin: spec-first

#### Scenario: Stop a failed diff `ownership-037`
- **WHEN** Git cannot read a diff
- **THEN** the gate gives COVERAGE-DIFF before the base ledger check

#### Scenario: Stop bad history before advice `ownership-038`
- **WHEN** history has invalid JSON
- **THEN** the run stops before the owned gap advice
- **AND** a run without a change name also stops before that advice


#### Scenario: Stop a source fault before a diff fault `ownership-051`
- **WHEN** an adopt source is invalid and Git cannot read the diff
- **THEN** LEDGER-ADOPT-FROM stops the run before the diff process starts

### Requirement: Adopt command source
The adopt command MUST stop for a source commit that no merge after the base brought.
Origin: spec-first

#### Scenario: Stop a work source in the adopt command `ownership-039`
- **WHEN** the adopt command names a work branch commit that no merge after the base brought
- **THEN** the gate gives GATES-ADOPT before the test run
- **AND** a source named HEAD has this literal error line:

```text
ERROR GATES-ADOPT The commit HEAD is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.
```


### Requirement: CI source scope
CI MUST use its selected change name for the adopt source list before the measurement.
Origin: spec-first

#### Scenario: Use the CI change for QA sources `ownership-040`
- **WHEN** CI selects a change with a valid adopt record for a new upstream QA script
- **THEN** the register uses the synthetic header for that script
- **AND** the log has no QA-HEADER error

### Requirement: Base history scope
The adopt source check MUST read only records after the base history prefix.
Origin: spec-first

#### Scenario: Skip a base adopt record `ownership-042`
- **WHEN** a base history record lacks a file and the current history has the same record
- **THEN** the gate gives no LEDGER-ADOPT-FROM error for that record
- **AND** the test run starts

### Requirement: Adopt records outside this change
The source check MUST skip records outside the current change and records outside the accepted history suffix.
Origin: spec-first

#### Scenario: Skip records outside this change `ownership-043`
- **WHEN** an invalid adopt record names another change, no change is selected, or the base history prefix differs
- **THEN** the line check keeps the base diff rule without LEDGER-ADOPT-FROM

### Requirement: Snapshot QA source scope
The snapshot check MUST use the current valid adopt records for QA headers.
Origin: spec-first

#### Scenario: Use an adopt source with a snapshot `ownership-044`
- **WHEN** a trusted snapshot has a new QA script with no header and a valid adopt record
- **THEN** the snapshot check uses the synthetic header without QA-HEADER
- **AND** it reads the selected change and reports this literal text for its one passed test:

```text
Trace: 1 scenarios, 1 verified, 0 open.
```

### Requirement: Measurement phase name
The host measurement MUST keep the measure phase name.
Origin: spec-first

#### Scenario: Name the measurement phase `ownership-045`
- **WHEN** a measurement takes 2 seconds on the test clock
- **THEN** the log has the literal text Phase measure: 2 s

### Requirement: Adopt input faults
The adopt command MUST stop before tests for an absent source commit or an absent ledger.
Origin: spec-first

#### Scenario: Stop an absent adopt commit `ownership-046`
- **WHEN** the adopt command names the absent commit absent
- **THEN** GATES-ADOPT has the message Git cannot find the commit absent

#### Scenario: Stop an absent adopt ledger `ownership-047`
- **WHEN** the adopt command names a valid merged source and no ledger exists
- **THEN** GATES-ADOPT has the message openspec/trace/gaps.json is not there. Run: node scripts/spec/gates.mjs init

### Requirement: Measurement inputs
The measurement MUST use the caller environment and allocation file list.
Origin: spec-first

#### Scenario: Pass the measurement inputs `ownership-048`
- **WHEN** the caller sets PASS4_TOKEN to token and lists tools/other.test.mjs as an allocation file
- **THEN** the child environment has PASS4_TOKEN with the value token
- **AND** the allocation run names tools/other.test.mjs and uses --expose-gc

### Requirement: Selected change trace
Both measurement modes MUST check the scenarios of the selected active change.
Origin: spec-first

#### Scenario: Stop an untraced change scenario `ownership-049`
- **WHEN** a measurement or a trusted snapshot has no assertion for scenario demo-001 of the selected active change
- **THEN** the gate gives TRACE-UNVERIFIED for demo-001
