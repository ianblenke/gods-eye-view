# gap-ledger Specification

## Purpose
Record each open gap in coverage and in test links. Stop the build when a gap opens, becomes larger or closes and the ledger does not show it. A loaded code file with true coverage, the content of the base commit and the content hash of its entry has the tolerance conditions. Such a file can differ from its entry by at most the tolerance and can have a smaller gap.

## Requirements
### Requirement: Ledger file
The gap ledger MUST be the file `openspec/trace/gaps.json`. For each code file below 100%, it records the content hash and untrue coverage. It also records the not-covered lines, branches and functions, and the total counts of each loaded file. For each test file with untraced tests, it records the name of each untraced test. Each entry records its origin and the date that it opened.
Origin: spec-first

#### Scenario: Make the first ledger `gap-ledger-001`
- **WHEN** you run the ledger command `init` and `openspec/trace/gaps.json` is not there
- **THEN** the command writes a ledger entry for each current gap
- **AND** each entry has the content hash, the origin `pre-spec` and the date of the run

#### Scenario: Do not replace the current ledger `gap-ledger-002`
- **WHEN** you run the ledger command `init` and `openspec/trace/gaps.json` is there
- **THEN** the command stops and does not change the file

#### Scenario: Do not make a ledger when the base has a ledger `gap-ledger-015`
- **WHEN** you run the ledger command `init` and the base commit has `openspec/trace/gaps.json`
- **THEN** the command stops and does not write a ledger

#### Scenario: Do not record a new file as pre-spec `gap-ledger-016`
- **WHEN** you run the ledger command `init`
- **AND** a code file with a gap is not in the base commit
- **THEN** the command stops and does not write a ledger

#### Scenario: Write the ledger file with sorted keys `gap-ledger-047`
- **WHEN** a command writes `openspec/trace/gaps.json`
- **THEN** the coverage map, the map of untraced tests and the name map of each test file have their keys in sorted order

### Requirement: Ratchet rule
The gates MUST stop the build when a gap opens, when a gap becomes larger, or when the ledger does not show the current gaps. A file with the tolerance conditions is an exception. The requirement "Count tolerance" gives this exception.
Origin: spec-first

#### Scenario: Stop for a new code file below 100% `gap-ledger-003`
- **WHEN** a code file has no ledger entry
- **AND** the file has a line, a branch or a function that is not covered
- **THEN** the gate stops the build

#### Scenario: Stop for more lines that are not covered `gap-ledger-004`
- **WHEN** a code file has more not-covered lines than its ledger entry
- **AND** the file does not have the tolerance conditions, or its count is above the entry count plus the tolerance
- **THEN** the gate stops the build
- **AND** the gate shows the file, the count in the ledger and the current count

#### Scenario: Stop for more branches that are not covered in a changed file `gap-ledger-017`
- **WHEN** the content hash of a code file is not equal to the hash in its ledger entry
- **AND** the file has more not-covered branches or functions than its entry
- **THEN** the gate stops the build

#### Scenario: Do not stop for branches that a new test shows in an unchanged file `gap-ledger-018`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry
- **AND** the file has more not-covered branches than its entry
- **AND** the covered branch count, which is the total minus the not-covered count, is not smaller than in its entry
- **THEN** the gate does not stop the build for the branches

#### Scenario: Stop for fewer covered branches or functions in an unchanged file `gap-ledger-054`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry
- **AND** the covered branch count or the covered function count is smaller than in its entry
- **AND** the file does not have the tolerance conditions, or a covered count is below the covered count of its entry minus the tolerance
- **THEN** the gate stops the build

#### Scenario: Stop for a ledger entry without the total counts `gap-ledger-055`
- **WHEN** the total branch count or the total function count of a ledger entry of a loaded file is not a number
- **THEN** the gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Stop for a changed file that has no branch count `gap-ledger-019`
- **WHEN** a ledger entry shows that no test loaded a file
- **AND** the content hash of the file changed and a test now loads the file
- **THEN** the gate stops the build

#### Scenario: Do not stop for a file that no test loaded and a test now loads `gap-ledger-009`
- **WHEN** a ledger entry shows that no test loaded a file
- **AND** the content hash did not change and a test now loads the file with fewer not-covered lines
- **THEN** the gate does not stop the build for the branch count or the function count of that file

#### Scenario: Stop for a loaded file that no test loads now `gap-ledger-020`
- **WHEN** a ledger entry shows that a test loaded a file
- **AND** no test loads the file now
- **THEN** the gate stops the build

#### Scenario: Do not stop for untrue coverage that the ledger records `gap-ledger-031`
- **WHEN** a test runs code under the name of a code file with other source
- **AND** the ledger entry of that file records untrue coverage
- **THEN** the gate does not stop the build for the untrue coverage

#### Scenario: Stop for a new test file with untraced tests `gap-ledger-005`
- **WHEN** a test file has no ledger entry
- **AND** the test file has one or more untraced tests
- **THEN** the gate stops the build

#### Scenario: Stop for a new untraced test name `gap-ledger-006`
- **WHEN** a test file has an untraced test with a name that its ledger entry does not contain
- **THEN** the gate stops the build

#### Scenario: Do not stop for gaps that are equal to the ledger `gap-ledger-007`
- **WHEN** each current gap and each content hash is equal to its ledger entry
- **THEN** the gate does not stop the build for the ledger

#### Scenario: Stop for a ledger that does not show a closed gap `gap-ledger-008`
- **WHEN** a current gap is smaller than its ledger entry, or a content hash is not equal to its entry
- **AND** no other rule stops the build for that entry, and the file does not have the tolerance conditions
- **THEN** the gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Stop when the ledger file is not there `gap-ledger-053`
- **WHEN** you run the gates or the ratchet command
- **AND** `openspec/trace/gaps.json` is not there
- **THEN** the command stops and tells you to run the ledger command `init`

### Requirement: Comparison with the base commit
The gates MUST compare the ledger files with the same files in the merge base of the current commit and the base branch. The default base branch is `origin/main`.
Origin: spec-first

#### Scenario: Stop for a ledger entry that the base does not have `gap-ledger-021`
- **WHEN** the ledger has an entry for a file
- **AND** the base ledger has no entry for that file
- **THEN** the gate stops the build

#### Scenario: Stop for a ledger entry that is larger than the base `gap-ledger-022`
- **WHEN** a ledger entry has more not-covered lines than the same entry in the base ledger
- **THEN** the gate stops the build

#### Scenario: Stop for more branches than the base in a changed file `gap-ledger-040`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered branches or functions than the base entry
- **THEN** the gate stops the build

#### Scenario: Stop for more branches than the base with fewer covered branches `gap-ledger-048`
- **WHEN** a ledger entry has more not-covered branches or functions than the base entry
- **AND** the covered count of that metric is smaller than in the base entry, or one of the two entries has no total count
- **THEN** the gate stops the build

#### Scenario: Stop for a ledger hash that is not equal to the base hash for an unchanged file `gap-ledger-041`
- **WHEN** the content of a file is equal to its content in the base commit
- **AND** the content hash in its ledger entry is not equal to the hash in the base entry
- **THEN** the gate stops the build

#### Scenario: Stop for changed total counts of an unchanged file without a history line `gap-ledger-056`
- **WHEN** the content of a file is equal to its content in the base commit
- **AND** the total counts in its ledger entry are not equal to the total counts in the base entry
- **AND** the history after the base has no line with the metric `totals` for the file from the checked change
- **THEN** the gate stops the build

#### Scenario: Stop for untrue coverage that the base does not record `gap-ledger-032`
- **WHEN** a ledger entry records untrue coverage
- **AND** the same entry in the base ledger does not record untrue coverage
- **THEN** the gate stops the build

#### Scenario: Stop for a removed ledger `gap-ledger-023`
- **WHEN** `openspec/trace/gaps.json` is not there
- **AND** the base commit has `openspec/trace/gaps.json`
- **THEN** the gate stops the build

#### Scenario: Stop for a removed retired ID `gap-ledger-024`
- **WHEN** the base `openspec/trace/retired-ids.json` has an ID that the current file does not have
- **THEN** the gate stops the build

#### Scenario: Stop for a changed history `gap-ledger-025`
- **WHEN** the current `openspec/trace/history.jsonl` does not start with the full content of the base file
- **THEN** the gate stops the build

#### Scenario: Do not compare with the base when the base has no ledger `gap-ledger-026`
- **WHEN** the base commit has no `openspec/trace/gaps.json`
- **THEN** the gate does not compare the ledger files with the base

#### Scenario: Read a file of the base commit `gap-ledger-046`
- **WHEN** the gate reads a file of the base commit and the base commit does not have that file
- **THEN** the gate reads no content for that file

#### Scenario: Stop for a base branch that Git cannot find `gap-ledger-030`
- **WHEN** Git cannot find the base branch
- **THEN** the gate stops the build

### Requirement: Ratchet command
The ledger command `ratchet` MUST record the current gaps when no gap is larger. It MUST record each changed entry in `openspec/trace/history.jsonl` with the change name and the commit that the command ran on.
Origin: spec-first

#### Scenario: Make ledger entries smaller `gap-ledger-010`
- **WHEN** you run `ratchet --change backfill-orbit` and `src/orbit.js` has fewer not-covered lines than its entry
- **THEN** the command writes the smaller count to the ledger
- **AND** the command adds a history line with the date, the change name, the commit, the file, the old count and the new count

#### Scenario: Remove an entry that is at zero `gap-ledger-011`
- **WHEN** you run the ratchet command and a gap is at zero
- **THEN** the command removes the entry from the ledger
- **AND** the command adds a history line for the closed gap

#### Scenario: Remove the entry of a deleted file `gap-ledger-012`
- **WHEN** you run the ratchet command and Git does not track the file of an entry
- **THEN** the command removes the entry
- **AND** the command adds a history line with the reason `file removed`

#### Scenario: Stop the ratchet command when a gap is larger `gap-ledger-013`
- **WHEN** you run the ratchet command and a current gap is larger than its entry
- **AND** the file does not have the tolerance conditions, or a count of the file is outside the tolerance
- **THEN** the command stops and does not change the ledger

#### Scenario: Stop the ratchet command without a change name `gap-ledger-014`
- **WHEN** you run the ratchet command without `--change`
- **THEN** the command stops and does not change the ledger

#### Scenario: Stop the ratchet command for a change that is not active `gap-ledger-027`
- **WHEN** you run the ratchet command with a name that has no folder with a `proposal.md` file in `openspec/changes`
- **THEN** the command stops and does not change the ledger

#### Scenario: Run the ratchet command for an archived change `gap-ledger-077`
- **WHEN** you run the ratchet command with the name of an archived change
- **THEN** the command writes the ledger, the ID registry and the scenario links
- **AND** the command does not stop the build, because the archive command can remove a requirement

#### Scenario: Record branches that a new test shows `gap-ledger-028`
- **WHEN** you run the ratchet command for an unchanged file with more not-covered branches and a covered branch count that is not smaller
- **THEN** the command writes the larger branch count and the larger total branch count
- **AND** the history line has the reason `shown by test`

#### Scenario: Record the hash of a changed file `gap-ledger-029`
- **WHEN** you run the ratchet command for a changed file with counts that are equal to or smaller than its entry
- **THEN** the command writes the new content hash and the counts

#### Scenario: Record changed total counts `gap-ledger-057`
- **WHEN** you run the ratchet command for an entry of a file without the tolerance conditions
- **AND** the total branch count or the total function count of a file is not equal to the count in its entry
- **THEN** the command writes the new total counts
- **AND** the command adds a history line with the metric `totals`, the old total counts, the new total counts and the reason `totals changed`

### Requirement: Count tolerance
The gates and the ratchet command MUST allow a count difference of at most the tolerance for a file with the tolerance conditions. The tolerance of a metric is 8, or 4% of the total of that metric when that is less. A file has the tolerance conditions when a test loads it and its coverage is true. That file must also have the content of the base commit and the content hash of its ledger entry.
Origin: spec-first

#### Scenario: Do not stop for counts inside the tolerance `gap-ledger-069`
- **WHEN** a code file has the tolerance conditions
- **AND** its not-covered line count is not above the entry count plus the tolerance
- **AND** the covered branch count and the covered function count are not below the covered counts of its entry minus the tolerance
- **THEN** the gate does not stop the build for that file
- **AND** the gate does not record the entry as not current

#### Scenario: Stop for a count outside the tolerance `gap-ledger-070`
- **WHEN** a code file has the tolerance conditions
- **AND** its not-covered line count is above the entry count plus the tolerance
- **THEN** the gate stops the build
- **AND** a covered count below the covered count of its entry minus the tolerance also stops the build

#### Scenario: Make the tolerance from the total of the metric `gap-ledger-071`
- **WHEN** the gate reads the tolerance of a metric of a file
- **THEN** the tolerance is 8 for a total of 200 or more
- **AND** the tolerance is 4% of the total, without the fraction, for a total below 200
- **AND** the tolerance is 0 for a total below 25

#### Scenario: Compare the covered counts with the tolerance `gap-ledger-072`
- **WHEN** a code file has the tolerance conditions
- **AND** its covered branch count is below the covered branch count of its entry minus the tolerance
- **THEN** the gate stops the build, also when the not-covered count is not larger

#### Scenario: Do not write a worse count for a file with the tolerance conditions `gap-ledger-073`
- **WHEN** you run the ratchet command for a file with the tolerance conditions
- **AND** its not-covered line count is larger than the entry count, or a covered count is smaller than in the entry
- **THEN** the command keeps the entry count of each metric with a worse current count
- **AND** the command writes the current count of a metric that is not worse than the entry count

#### Scenario: Use no tolerance for a file without the tolerance conditions `gap-ledger-074`
- **WHEN** a code file has other content than the base commit or its ledger entry
- **THEN** the gate compares the counts of the file with its entry with no tolerance
- **AND** a file that no test loads, or a file with untrue coverage, also gets no tolerance

### Requirement: Total counts of the ledger
Each ledger entry of a loaded code file MUST record the total lines, the total branches and the total functions. The version of the ledger file MUST be 4.
Origin: spec-first

#### Scenario: Stop for a ledger entry without the total line count `gap-ledger-075`
- **WHEN** the total line count of a ledger entry of a loaded file is not a number
- **THEN** the gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Stop for a ledger file with another version `gap-ledger-076`
- **WHEN** `openspec/trace/gaps.json` does not have the version 4
- **THEN** the gate stops the build

