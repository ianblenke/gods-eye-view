# gap-ledger Specification

## Purpose
Record each open gap in coverage and in test links. Stop the build when a gap opens, becomes larger or closes and the ledger does not show it.

## Requirements
### Requirement: Ledger file
The gap ledger MUST be the file `openspec/trace/gaps.json`. For each code file below 100%, it records the content hash, the not-covered lines, branches and functions, the total branches and functions, and untrue coverage. For each test file with untraced tests, it records the name of each untraced test. Each entry records its origin and the date that it opened.
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
The gates MUST stop the build when a gap opens, when a gap becomes larger, or when the ledger does not show the current gaps.
Origin: spec-first

#### Scenario: Stop for a new code file below 100% `gap-ledger-003`
- **WHEN** a code file has no ledger entry
- **AND** the file has a line, a branch or a function that is not covered
- **THEN** the gate stops the build

#### Scenario: Stop for more lines that are not covered `gap-ledger-004`
- **WHEN** a code file has more not-covered lines than its ledger entry
- **THEN** the gate stops the build
- **AND** the gate shows the file, the count in the ledger and the current count

#### Scenario: Stop for more branches that are not covered in a changed file `gap-ledger-017`
- **WHEN** the content hash of a code file is not equal to the hash in its ledger entry
- **AND** the file has more not-covered branches or functions than its entry
- **THEN** the gate stops the build

#### Scenario: Do not stop for branches that a new test shows in an unchanged file `gap-ledger-018`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry, and the entry has no range
- **AND** the file has more not-covered branches than its entry
- **AND** the covered branch count, which is the total minus the not-covered count, is not smaller than in its entry
- **THEN** the gate does not stop the build for the branches

#### Scenario: Stop for fewer covered branches or functions in an unchanged file `gap-ledger-054`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry
- **AND** the entry has no range, or a not-covered count is above the high count of its range
- **AND** the covered branch count or the covered function count is smaller than in its entry
- **THEN** the gate stops the build

#### Scenario: Stop for a ledger entry without the total counts `gap-ledger-055`
- **WHEN** the total branch count or the total function count of a ledger entry of a loaded file is not a number
- **THEN** the gate stops the build, also when the entry has a range
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
- **AND** no other rule stops the build for that entry
- **THEN** the gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Stop when the ledger file is not there `gap-ledger-053`
- **WHEN** you run the gates, the ratchet command or the stability command
- **AND** `openspec/trace/gaps.json` is not there
- **THEN** the command stops and tells you to run the ledger command `init`

### Requirement: Unstable coverage
The stability command MUST record a range of counts only from test runs of a file with the same content. The samples are the kept samples of earlier runs, two new test runs and the ledger entry. A ledger entry for a file with unstable coverage has this range.
Origin: spec-first

#### Scenario: Do not stop for counts in the range of an unstable file `gap-ledger-033`
- **WHEN** a ledger entry has a low count and a high count for a file
- **AND** the content hash did not change and each current count is in the range
- **THEN** the gate does not stop the build for that file
- **AND** the ratchet command keeps the entry when the file is at 100% and each low count in the entry is 0

#### Scenario: Stop for counts below the range of an unstable file `gap-ledger-034`
- **WHEN** a ledger entry has a range for a file
- **AND** a current count is lower than the low count
- **THEN** the gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Record the range of a file with unstable coverage `gap-ledger-035`
- **WHEN** you run `stability --change <name>`
- **AND** the samples of a file with the same content do not have equal counts
- **THEN** the command writes the lowest and the highest counts to the ledger entry of that file
- **AND** the command adds a history line with the reason `unstable`, and a new entry has the origin `unstable`
- **AND** the history line has the low count and the high count of each metric

#### Scenario: Record a file with unstable total counts as unstable `gap-ledger-058`
- **WHEN** you run `stability --change <name>`
- **AND** the samples of a file below 100% with the same content have equal not-covered counts and different total counts
- **THEN** the command writes a range to the ledger entry of that file, with each low count equal to its high count
- **AND** the command adds a history line with the reason `unstable`

#### Scenario: Keep a coverage sample of each test run `gap-ledger-039`
- **WHEN** the gates measure the coverage
- **THEN** the gate adds the counts and the content hash of each code file to `.gev-cache/spec-samples.jsonl`

#### Scenario: Move the range of an unstable file with a smaller count `gap-ledger-045`
- **WHEN** you run the ratchet command for an unstable file with a count below the low count of its metric
- **THEN** the command writes the new count as the low count of that metric
- **AND** the command keeps the width of the range of that metric
- **AND** the command adds a history line for that metric

#### Scenario: Keep the range of a metric with a count in its range `gap-ledger-049`
- **WHEN** you run the ratchet command for an unstable file
- **AND** one count is below the low count of its metric, and another count is in the range of its metric
- **THEN** the command does not change the low count or the high count of the metric with the count in its range

#### Scenario: Move the range of an unstable file up for branches that a new test shows `gap-ledger-050`
- **WHEN** you run the ratchet command for an unchanged unstable file with a branch count above the high count
- **THEN** the command writes the new count as the high count and keeps the width of the range
- **AND** the history line has the reason `shown by test`

#### Scenario: Do not record a changed file as unstable `gap-ledger-036`
- **WHEN** you run the stability command
- **AND** the content of a file with different counts is not equal to its content in the base commit
- **THEN** the command stops and does not change the ledger

#### Scenario: Do not stop for an unstable range that the history records `gap-ledger-037`
- **WHEN** a ledger entry has a range that is wider than the range of the base entry
- **AND** the file content is equal to the base
- **AND** the history after the base has an `unstable` line for the file with the name of the checked change
- **AND** the diff changes only files in `openspec/`
- **THEN** the gate does not stop the build for the comparison with the base

#### Scenario: Stop for an unstable range without a history line `gap-ledger-038`
- **WHEN** a ledger entry has a range that is wider than the range of the base entry
- **AND** the history after the base has no `unstable` line for the file with the name of the checked change
- **THEN** the gate stops the build

#### Scenario: Stop for an unstable range in a diff that changes a file outside openspec `gap-ledger-042`
- **WHEN** a ledger entry has a range that is wider than the range of the base entry
- **AND** the diff against the base changes a file that is not in `openspec/`
- **THEN** the gate stops the build

#### Scenario: Use the rules of a wider range for a new range `gap-ledger-059`
- **WHEN** a ledger entry has a range and the base entry has no range, also when each low count is equal to its high count
- **THEN** the gate uses the rules of a range that is wider than the range of the base entry
- **AND** the gate stops the build for the new range without an `unstable` history line from the checked change

#### Scenario: Stop for an unstable range that moves above the base range `gap-ledger-060`
- **WHEN** the content of a file is equal to its content in the base commit
- **AND** its ledger entry and its base entry have a range, and the range is not wider than the base range
- **AND** a high count of the entry is above the high count of the base entry
- **THEN** the gate stops the build

#### Scenario: Stop for a range that is not correct `gap-ledger-061`
- **WHEN** a ledger entry has a range
- **AND** a low count has no high count, or a low count is not an integer from 0 to its high count
- **THEN** the gate stops the build

#### Scenario: Use the low counts for a changed file with a range `gap-ledger-062`
- **WHEN** the content hash of a code file is not equal to the hash in its ledger entry, and the entry has a range
- **THEN** the gate stops the build for a not-covered count above the low count of its metric
- **AND** the ratchet command removes the range from the entry

#### Scenario: Use the base low counts for a changed unstable file `gap-ledger-063`
- **WHEN** the content of a file is not equal to its content in the base commit, and its base entry has a range
- **THEN** the gate compares the not-covered counts of the ledger entry with the low counts of the base entry
- **AND** the gate stops the build when the ledger entry of that file has a range

#### Scenario: Close the gap of a changed unstable file at 100% `gap-ledger-064`
- **WHEN** a file is at 100% and its ledger entry has a range with each low count at 0
- **AND** the content hash of the file is not equal to the hash in its entry
- **THEN** the gate stops the build and tells you to run the ratchet command
- **AND** the ratchet command removes the entry and adds a history line with the reason `closed`

#### Scenario: Stop for an unstable range that is too wide `gap-ledger-043`
- **WHEN** the high count of a metric in a ledger entry minus its low count is more than 5
- **AND** that difference is also more than 2% of the low count
- **THEN** the gate stops the build

#### Scenario: Stop for a wider unstable range of a changed file `gap-ledger-051`
- **WHEN** a ledger entry has a range that is wider than the range of the base entry
- **AND** the file content is not equal to the base
- **THEN** the gate stops the build

#### Scenario: Stop for an unstable high count that is too far above the base `gap-ledger-052`
- **WHEN** a ledger entry has a range that is wider than the range of the base entry
- **AND** a high count is more than the base count plus 5 and more than the base count plus 2% of the base count
- **THEN** the gate stops the build

### Requirement: Comparison with the base commit
The gates MUST compare the ledger files with the same files in the merge base of the current commit and the base branch. The default base branch is `origin/main`.
Origin: spec-first

#### Scenario: Stop for a ledger entry that the base does not have `gap-ledger-021`
- **WHEN** the ledger has an entry without a range for a file
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
- **THEN** the command stops and does not change the ledger

#### Scenario: Stop the ratchet command without a change name `gap-ledger-014`
- **WHEN** you run the ratchet command without `--change`
- **THEN** the command stops and does not change the ledger

#### Scenario: Stop the ratchet command for a change that is not active `gap-ledger-027`
- **WHEN** you run the ratchet command with a name that has no folder with a `proposal.md` file in `openspec/changes`
- **THEN** the command stops and does not change the ledger

#### Scenario: Record branches that a new test shows `gap-ledger-028`
- **WHEN** you run the ratchet command for an unchanged file with more not-covered branches and a covered branch count that is not smaller
- **THEN** the command writes the larger branch count and the larger total branch count
- **AND** the history line has the reason `shown by test`

#### Scenario: Record the hash of a changed file `gap-ledger-029`
- **WHEN** you run the ratchet command for a changed file with counts that are equal to or smaller than its entry
- **THEN** the command writes the new content hash and the counts

#### Scenario: Record changed total counts `gap-ledger-057`
- **WHEN** you run the ratchet command for an entry without a range, or for an entry with a count outside its range
- **AND** the total branch count or the total function count of a file is not equal to the count in its entry
- **THEN** the command writes the new total counts
- **AND** the command adds a history line with the metric `totals`, the old total counts, the new total counts and the reason `totals changed`

