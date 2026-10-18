# ownership Specification

## Purpose
With a base, a path is owned when the base manifest or the current manifest lists it.
Without a base, the gate uses only the current manifest.
Each owned code file that a change adds or edits, and each owned code file without a ledger entry, needs full coverage.
Each changed line needs coverage, except a line that equals the file in the adopt source in a sync.
The report command lists all ledger gaps of both classes.
## Requirements
### Requirement: Manifest contract
The gate MUST accept only a version 1 manifest with an array of unique paths; each path is relative and safe.
A safe path has only ASCII letters, digits, underscores, dots, hyphens and slashes.
The path has no absolute prefix, repeated slash or dot segment.
Origin: spec-first

#### Scenario: Read a manifest `ownership-001`
- **WHEN** the gate reads valid and invalid manifest files
- **THEN** the gate accepts valid files and prints OWNERSHIP-MANIFEST for absent or invalid files
- **AND** for absent or invalid files, the errors array from readOwnership has an object with the code OWNERSHIP-MANIFEST, the file name and the message
- **AND** when the gate reads the manifest without a base, the gate uses only the current manifest

### Requirement: Path class
The gate MUST use exact paths and directory prefixes to classify each path.
Origin: spec-first

#### Scenario: Classify paths `ownership-002`
- **WHEN** the manifest lists `single.js` and `src/own/`
- **THEN** `single.js` and `src/own/a.js` have the owned class
- **AND** `single.jsx` and `src/owner/a.js` have the upstream class

### Requirement: Class output
The gate MUST print the class of each path in the diff against the base and the owned and upstream totals in check and ratchet.
The owned gap lines apply only to check and ratchet.
A JSON parse error in the history stops before the owned gap lines. The owned gap lines come before the changed line check.
Origin: spec-first

#### Scenario: Show path classes `ownership-003`
- **WHEN** check or ratchet has paths in the diff
- **THEN** the log names each class and shows Ownership: N owned, M upstream

#### Scenario: Omit class and gap lines from CI and init `ownership-053`
- **WHEN** a ledger has a recorded owned gap and the command is ci or init
- **THEN** the gate prints no Class, Ownership or Owned gaps line
- **AND** init stops with an error before the step that prints the owned gap lines, because the ledger exists

### Requirement: Owned coverage
The gate MUST reject gaps in changed owned code files and owned code files without a ledger entry, except valid waivers.
A file mode change does not change code content.
Origin: spec-first

#### Scenario: Check owned gaps `ownership-004`
- **WHEN** a changed owned code file or an owned code file without a ledger entry has a gap
- **THEN** the gate prints COVERAGE-OWNED unless valid waivers waive all gap counts

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
- **THEN** the gate prints COVERAGE-DIFF with the file and all uncovered line numbers

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
For a script at the base, the base script must have no QA tag in its first comment block.
For a new script, a valid adopt record must name the script.

A header block has a QA tag. Other comment blocks are not QA header blocks.
The purpose is `Check upstream code.`
The run value is `node`, a space and the file path.
The needs value is:

```text
The upstream script needs its own setup.
```

The scenario qa-scripts-019 does not apply to a synthetic header: the gate prints the QA advisory when the caller gives no change name. The scenarios qa-scripts-002, qa-scripts-003 and qa-scripts-023 do not apply within this exception.
Origin: spec-first

#### Scenario: Use an upstream header `ownership-009`
- **WHEN** an upstream QA script has no header block at the start of the file
- **AND** the base script had no QA tag, or the script is new and a valid adopt record names the script
- **THEN** the QA register uses the covers item `unmapped: upstream` and prints the QA advisory

### Requirement: QA boundary
The QA register MUST reject an owned script with no header and an upstream script with an invalid header.
Origin: spec-first

#### Scenario: Reject a bad QA header `ownership-010`
- **WHEN** an owned script has no header or an upstream script has an invalid first block
- **THEN** the QA register prints QA-HEADER and keeps all other register checks

### Requirement: Gap report
The report command MUST list owned and upstream code and test gaps separately without a test run.
Origin: spec-first

#### Scenario: Report gap classes `ownership-011`
- **WHEN** the ledger has owned and upstream code and test gaps
- **THEN** the report command lists the paths and totals of both classes without a test run

### Requirement: Process boundary
The process text MUST define the manifest, the sync review scope and the rule for a scenario that a sync breaks.
Origin: spec-first

#### Scenario: Read the process rules `ownership-012`
- **WHEN** an agent reads AGENTS.md and the OpenSpec context
- **THEN** the text says that a changed owned code file and an owned code file without a ledger entry need full coverage
- **AND** the text says that a changed line needs coverage and that a sync uses `adopt`
- **AND** the text says that review.md lists the files that a person resolved by hand
- **AND** the context says to run the adopt command for an upstream QA script with no current or base QA tag
- **AND** the context says that the command writes the record for that script, also when the script is new
- **AND** the context says not to write history records by hand

### Requirement: Line data
The measurement MUST store merged V8 line data in the trusted snapshot.
The line records use 1 for a covered line and 0 for an uncovered line.
Origin: spec-first

#### Scenario: Keep line data `ownership-013`
- **WHEN** the gate writes V8 coverage and a measurement snapshot
- **THEN** covered lines have the DA count 1 and uncovered lines have the DA count 0
- **AND** the snapshot check reads the line data for document mode

### Requirement: Test instance total
The report command MUST count all test instances in each ledger name map.
Origin: spec-first

#### Scenario: Count test instances `ownership-014`
- **WHEN** one test name has a count of 2 and another has a count of 1
- **THEN** the report command prints a total of 3 test instances

### Requirement: QA header block
The QA register MUST treat a first comment block with no QA tags as no QA header.
Origin: spec-first

#### Scenario: Accept an upstream comment block `ownership-015`
- **WHEN** an upstream QA script starts with a comment block that has no QA tags
- **AND** the script meets the QA exception
- **THEN** the QA register uses the synthetic upstream header
- **AND** an invalid first block with a QA tag still prints QA-HEADER

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
The gate MUST add the line gap counts and the test instance counts of ledger entries of the same class.
The gate must add only positive whole-number counts of waivers that name the file, the file hash and the metric of the gap.
Origin: spec-first

#### Scenario: Add gap and waiver counts `ownership-018`
- **WHEN** a ledger has two owned files with 2 and 3 line gaps
- **AND** two valid line waivers for one file each waive one gap
- **AND** a second ledger has only the owned test files single.js and src/own/a.test.js, with 3 and 4 test instances
- **THEN** the report command prints 5 line gaps for the first ledger and the waivers waive a count of 2
- **AND** for the second ledger, the report command prints "Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests."

### Requirement: Empty test names
The report command MUST count zero test instances for an empty name map.
Origin: spec-first

#### Scenario: Count an empty name map `ownership-019`
- **WHEN** a test file has an empty name map
- **THEN** the report command counts zero test instances

### Requirement: Sync line scope
The gate MUST check coverage only for base diff lines that also differ from the file in the adopt source.
This requirement replaces Diff coverage for lines equal to the file in the adopt source.
A file uses the adopt source of its last valid adopt record in the change.
A file without such a record uses the adopt source of the last valid adopt record in the change.
Each adopt source must come from a valid adopt record.
Origin: spec-first

#### Scenario: Exempt upstream lines `ownership-020`
- **WHEN** a merge brings 5 code lines equal to the file in the adopt source
- **THEN** those lines need no changed line coverage
- **AND** the gate prints this line:

```text
COVERAGE-DIFF: 5 changed lines, 5 brought by the merged upstream commit, 0 need coverage.
```

#### Scenario: Check a conflict that a person resolved by hand `ownership-021`
- **WHEN** a person resolves a conflict and line 1 of the result differs from the base file and the file in the adopt source
- **THEN** that line needs coverage
- **AND** the gate prints COVERAGE-DIFF for an uncovered line

#### Scenario: Check an edit to upstream code `ownership-022`
- **WHEN** a person edits line 2 of an upstream file in the sync change
- **THEN** the line needs coverage if the line differs from the base file and from the file in the adopt source
- **AND** other lines that equal the file in the adopt source need no changed line coverage

#### Scenario: Select each file source `ownership-023`
- **WHEN** a change has more than one adopt source
- **THEN** each file uses the adopt source of its last valid adopt record and other files use the last adopt source
- **AND** a file absent from the adopt source needs coverage for all its base diff lines

#### Scenario: Reject an invalid source `ownership-024`
- **WHEN** the adopt source is absent from the repository, or is not a parent, other than the first parent, of a merge after the base
- **THEN** the gate prints LEDGER-ADOPT-FROM and stops
- **AND** a change with no adopt source keeps the base diff rule
- **AND** an invalid source stops before the base ledger JSON check

#### Scenario: Check current code paths `ownership-025`
- **WHEN** the upstream project deletes or renames a code file
- **THEN** deleted paths have no new lines and new paths use the same path in the adopt source without rename detection
- **AND** the line check reads only current code inventory paths

#### Scenario: Keep an old owned gap `ownership-026`
- **WHEN** an unchanged owned code file has a recorded gap
- **THEN** the owned coverage check passes
- **AND** the report and the owned gap lines of check and ratchet list the gap
- **AND** the adopt command prints no owned gap lines

#### Scenario: Reject a changed owned gap `ownership-027`
- **WHEN** a changed owned code file has a recorded gap
- **THEN** the gate prints COVERAGE-OWNED

#### Scenario: Reject a new owned gap `ownership-028`
- **WHEN** a new owned code file has a gap and no ledger entry
- **THEN** the gate prints COVERAGE-OWNED

### Requirement: Base ownership
For a comparison with a base, the gate MUST classify a path as owned when the base manifest or the current manifest lists it.
Origin: spec-first

#### Scenario: Keep base owned paths `ownership-029`
- **WHEN** the current manifest removes or shortens a base owned prefix
- **THEN** paths that the base manifest lists stay owned
- **AND** an absent base manifest is empty and an invalid base manifest gives OWNERSHIP-MANIFEST
- **AND** each path occurs once in the union manifest

#### Scenario: Check the project manifest `ownership-030`
- **WHEN** the gate reads the project manifest openspec/ownership.json
- **THEN** scripts/spec/gates.mjs, src/layers/osh/index.js and server/providers/osh.js are owned

### Requirement: Adopt record boundary
The gate MUST stop for an adopt record for this change with an invalid file or source.
For an adopt record of this change with an invalid `file` or `from`, this requirement replaces gap-ledger-095.
For a reached adopt record whose `from` is not a merge parent, the gate prints LEDGER-ADOPT-FROM and stops.
For such a record, this requirement replaces the LEDGER-ADOPT-REACHED error of gap-ledger-105.
For an adopt record of this change whose `from` is not a merge parent, the gate stops before the ledger comparison.
This requirement replaces the THEN line of gap-ledger-151.

The `file` field must be a string.
The `from` field must be a full hash of 40 lowercase hexadecimal digits of a commit that a merge after the base brought.
The commit must be a parent, other than the first parent, of a merge commit after the base.
The hash pattern is `/^[0-9a-f]{40}$/`.
The source check must not read merge parents for a value that does not match the hash pattern.

A valid adopt record is a record that `adoptsOf` accepts for this change and that meets the next condition.
The record must also name, in `from`, the full hash of a commit that a merge after the base brought.

The adopt source of a record is the commit in its `from` field.
Other records that adoptsOf does not accept give no source.
Origin: spec-first

#### Scenario: Stop the gate for a record without a file `ownership-031`
- **WHEN** an adopt record for this change has no file and its `from` value is `HEAD`
- **THEN** the gate prints LEDGER-ADOPT-FROM
- **AND** a short hash, a branch name, `HEAD^2`, `origin/source`, an uppercase hash and a hash with a space make the gate print LEDGER-ADOPT-FROM
- **AND** no such record exempts a line from COVERAGE-DIFF
- **AND** a reached adopt record with a source that is not a merge parent makes the gate print LEDGER-ADOPT-FROM at openspec/trace/history.jsonl
- **AND** the source check reads no merge parents for values that do not match the hash pattern
- **AND** the gate prints this error line:

```text
ERROR LEDGER-ADOPT-FROM openspec/trace/history.jsonl Use an adopt record with a file name and a full lowercase hash in the from field. A merge after the base must bring that hash.
```

#### Scenario: Stop the gate for a work branch source `ownership-032`
- **WHEN** an adopt record names a work branch commit that no merge brought
- **THEN** the gate prints LEDGER-ADOPT-FROM

#### Scenario: Stop the gate for an ancestor without a merge `ownership-033`
- **WHEN** an adopt record names an ancestor that no merge after the base brought
- **THEN** the gate prints LEDGER-ADOPT-FROM

#### Scenario: Stop the gate for a number or a name in the `from` field `ownership-041`
- **WHEN** an adopt record has the `from` value 1 and the Git branch named `1` points to a valid adopt source
- **THEN** the gate prints LEDGER-ADOPT-FROM
- **AND** the gate also prints LEDGER-ADOPT-FROM for the string value `1`

#### Scenario: Stop the gate for a later invalid record `ownership-050`
- **WHEN** a valid adopt record comes before a record for this change without a file
- **THEN** the gate prints LEDGER-ADOPT-FROM for the later record

#### Scenario: Stop the gate for a source name with a null byte `ownership-052`
- **WHEN** the `from` string of an adopt record has a null byte
- **THEN** the gate prints LEDGER-ADOPT-FROM with the same message as ownership-031
- **AND** the source check returns false when Git cannot read the merge parents

#### Scenario: Stop the gate before the ledger comparison `ownership-055`
- **WHEN** an adopt record for this change has the full hash of the commit HEAD in its `from` field
- **AND** the file of the record has only a total count difference from the ledger
- **THEN** the gate prints one LEDGER-ADOPT-FROM error at openspec/trace/history.jsonl
- **AND** the gate prints no LEDGER-ADOPT-FROM error for the file of the record
- **AND** the gate prints no LEDGER-STALE error

### Requirement: QA exception boundary
The QA register MUST print QA-HEADER for a script with no current header in these cases.
The script is new and no valid adopt record names the script, or the first comment block of the base script has a QA tag.
Origin: spec-first

#### Scenario: Stop the gate for a new script without a header `ownership-034`
- **WHEN** a new upstream script has no header and no valid adopt record names it
- **THEN** the QA register prints QA-HEADER

#### Scenario: Stop the gate for a deleted header `ownership-035`
- **WHEN** an upstream script had a QA tag at the base and has no header now
- **THEN** the QA register prints QA-HEADER even when a valid adopt record names the script

### Requirement: Diff process bounds
The diff process MUST use a 256 MiB output buffer.
Origin: spec-first

#### Scenario: Set the diff buffer `ownership-036`
- **WHEN** the gate starts the Git diff process
- **THEN** maxBuffer is 268435456 bytes

### Requirement: Gate order
The gate MUST stop after a failed diff or a JSON parse error in the history before later checks.
Origin: spec-first

#### Scenario: Stop the gate for a failed diff `ownership-037`
- **WHEN** Git cannot read a diff
- **THEN** the gate prints COVERAGE-DIFF before the base ledger check

#### Scenario: Stop the gate for a JSON parse error in the history before the owned gap lines `ownership-038`
- **WHEN** history has a line with the text `{`
- **THEN** the run stops before the owned gap lines
- **AND** a run without a change name also stops before the owned gap lines
- **AND** the gate prints the code LEDGER-ADOPT-FROM for openspec/trace/history.jsonl
- **AND** the message starts with this text:

```text
Expected property name or '}' in JSON
```

#### Scenario: Stop the gate for a source fault before a diff fault `ownership-051`
- **WHEN** an adopt source is invalid and Git cannot read the diff
- **THEN** LEDGER-ADOPT-FROM stops the run before the diff process starts

### Requirement: Adopt command source
The adopt command MUST stop for a source commit that no merge after the base brought.
Origin: spec-first

#### Scenario: Stop the gate for a work source in the adopt command `ownership-039`
- **WHEN** the adopt command names a work branch commit that no merge after the base brought
- **THEN** the gate prints GATES-ADOPT before the test run
- **AND** a source named HEAD has this literal error line:

```text
ERROR GATES-ADOPT The commit HEAD is not a merged commit. It must be a parent, other than the first parent, of a merge commit after the base commit.
```

### Requirement: CI source scope
The ci command MUST read the adopt sources of the change that the ci command selects before the measurement.
Origin: spec-first

#### Scenario: Use the CI change for QA sources `ownership-040`
- **WHEN** the ci command selects a change with a valid adopt record for a new upstream QA script
- **THEN** the QA register uses the synthetic header for that script
- **AND** the log has no QA-HEADER error

### Requirement: Base history scope
The history check MUST read only records after the base history prefix.
Origin: spec-first

#### Scenario: Skip a base adopt record `ownership-042`
- **WHEN** a base history record lacks a file and the current history has the same record
- **THEN** the gate prints no LEDGER-ADOPT-FROM error for that record
- **AND** the gate starts the test run

### Requirement: Adopt records outside this change
The history check MUST skip records outside the current change and records before the end of the base history prefix.
Origin: spec-first

#### Scenario: Skip records outside this change `ownership-043`
- **WHEN** an invalid adopt record names another change, the gate selects no change, or the history does not start with the base history
- **THEN** the line check keeps the base diff rule without LEDGER-ADOPT-FROM

### Requirement: Snapshot QA source scope
The snapshot check MUST use the current valid adopt records for QA headers.
Origin: spec-first

#### Scenario: Use an adopt source with a snapshot `ownership-044`
- **WHEN** a trusted snapshot has a new QA script with no header and a valid adopt record
- **THEN** the snapshot check uses the synthetic header without QA-HEADER
- **AND** the snapshot check prints this text because the selected change has one scenario with one passed test:

```text
Trace: 1 scenarios, 1 verified, 0 open.
```

### Requirement: Measurement phase name
The gate MUST print the time of the measurement phase under the name measure.
Origin: backfill

#### Scenario: Name the measurement phase `ownership-045`
- **WHEN** a measurement takes 2 seconds on the test clock
- **THEN** the gate prints this line:

```text
Phase measure: 2 s
```

### Requirement: Adopt input faults
The adopt command MUST stop before tests for an absent source commit or an absent ledger.
Origin: backfill

#### Scenario: Stop the gate for an absent adopt commit `ownership-046`
- **WHEN** the adopt command names a commit `absent` that the repository lacks
- **THEN** the gate prints this error line:

```text
ERROR GATES-ADOPT Git cannot find the commit absent
```

#### Scenario: Stop the gate for an absent adopt ledger `ownership-047`
- **WHEN** the adopt command names a valid adopt source and no ledger exists
- **THEN** the gate prints this error line:

```text
ERROR GATES-ADOPT openspec/trace/gaps.json is not there. Run: node scripts/spec/gates.mjs init
```

### Requirement: Measurement inputs
The measurement MUST use the caller environment and allocation file list.
Origin: backfill

#### Scenario: Pass the measurement inputs `ownership-048`
- **WHEN** the caller sets MEASUREMENT_TOKEN to token and lists tools/other.test.mjs as an allocation file
- **THEN** the child environment has MEASUREMENT_TOKEN with the value token
- **AND** the allocation run names tools/other.test.mjs and uses --expose-gc

### Requirement: Selected change trace
The measurement and the snapshot check MUST check the scenarios of the selected change.
Origin: backfill

#### Scenario: Stop the gate for an untraced change scenario `ownership-049`
- **WHEN** a measurement or a trusted snapshot has no assertion for scenario demo-001 of the selected active change
- **THEN** the gate prints TRACE-UNVERIFIED for demo-001

### Requirement: Adopt QA record
The adopt command MUST write one zero-count adopt record for each merged upstream QA script that can use the QA exception.
The script must have no QA tag in its first comment block now.
The base script must also have no QA tag, or the script must be new.
The record has lines 0, branches 0, functions 0, untraced 0 and untrue false.
A QA-HEADER error for such a script must not stop the adopt command.
In the adopt command, for such a script, this requirement replaces qa-scripts-024 and gap-ledger-089.

Any other error must stop the adopt command.

The adopt command resolves its `--from` option and writes the full hash.
Origin: spec-first

#### Scenario: Write the QA adopt record `ownership-054`
- **WHEN** a merge brings one or more new upstream QA scripts with no QA tag and the adopt command names `HEAD^2`
- **THEN** the adopt command writes one record for each script with the full hash of the second parent
- **AND** lines, branches, functions and untraced are 0 and untrue is false
- **AND** the next gate run uses the synthetic header
- **AND** an owned script with no header, or a new script that the second parent did not change, prints QA-HEADER
- **AND** an invalid current header or a deleted base QA header prints QA-HEADER
- **AND** the adopt command writes one zero-count adopt record for a merged upstream base script with no current or base QA tag
- **AND** any other error stops the adopt command without a new record
- **AND** a coverage ignore comment in one of the new upstream QA scripts with no QA tag makes the gate print COVERAGE-IGNORE. The adopt command writes no adopt record for that script.
- **AND** the adopt command writes no QA record for an absent current file

