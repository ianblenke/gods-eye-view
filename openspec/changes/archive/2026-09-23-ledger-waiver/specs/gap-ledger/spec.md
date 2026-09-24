## MODIFIED Requirements

### Requirement: Ratchet rule
The gates MUST stop the build when a gap opens, when a gap becomes larger, or when the ledger does not show the current gaps. A file with the tolerance conditions is an exception. The requirement "Count tolerance" gives this exception.
Origin: spec-first

#### Scenario: Stop for a new code file below 100% `gap-ledger-003`
- **WHEN** a code file has no ledger entry
- **AND** the file has a line, a branch or a function that is not covered
- **AND** the file does not have the conditions of `gap-ledger-086`
- **THEN** the gate stops the build

#### Scenario: Stop for more lines that are not covered `gap-ledger-004`
- **WHEN** a code file has more not-covered lines than its ledger entry
- **AND** its count is above the entry count plus the tolerance plus the waived line count
- **AND** the tolerance is 0 without the tolerance conditions, and the waived count is 0 without a waiver
- **THEN** the gate stops the build
- **AND** the gate shows the file, the count in the ledger, the waived count and the current count

#### Scenario: Stop for more branches that are not covered in a changed file `gap-ledger-017`
- **WHEN** the content hash of a code file is not equal to the hash in its ledger entry
- **AND** the not-covered branch count or the not-covered function count is above the entry count plus the waived count of that metric
- **AND** the waived count is 0 without a waiver for that metric with the content hash of the file
- **THEN** the gate stops the build
- **AND** the gate shows the file, the count in the ledger, the waived count and the current count

#### Scenario: Do not stop for branches that a new test shows in an unchanged file `gap-ledger-018`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry
- **AND** the file has more not-covered branches than its entry
- **AND** the covered branch count, which is the total minus the not-covered count, is not smaller than in its entry
- **THEN** the gate does not stop the build for the branches

#### Scenario: Do not stop for a smaller total with the same not-covered count in an unchanged file `gap-ledger-078`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry
- **AND** the total branch count or the total function count is smaller than in its entry
- **AND** the not-covered count of that metric is equal to the count in its entry
- **THEN** the gate does not stop the build for that metric
- **AND** with the tolerance conditions, the gate does not record the entry as not current
- **AND** without the tolerance conditions, the gate records the entry as not current, with no error for that metric

#### Scenario: Stop for a loss of covered branches or functions in an unchanged file `gap-ledger-054`
- **WHEN** the content hash of a code file is equal to the hash in its ledger entry
- **AND** for the branches or the functions, the loss is the smaller of the not-covered rise and the covered fall
- **AND** the loss is the fall alone when the not-covered count falls
- **AND** the loss of that metric is above the tolerance, which is 0 without the tolerance conditions
- **THEN** the gate stops the build
- **AND** the gate shows the file, the two current counts and the two counts of the entry

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
- **AND** the entry is for untraced test names, or it is a coverage entry without the conditions of `gap-ledger-087`
- **THEN** the gate stops the build

#### Scenario: Stop for a ledger entry that is larger than the base `gap-ledger-022`
- **WHEN** a ledger entry has more not-covered lines than the same entry in the base ledger
- **AND** the rise is above the waived count of the checked change for the lines of the file
- **THEN** the gate stops the build
- **AND** the gate shows the file, the two counts and the waived count

#### Scenario: Stop for more branches than the base in a changed file `gap-ledger-040`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered branches or functions than the base entry
- **AND** the rise of that metric is above the waived count of the checked change for that metric
- **THEN** the gate stops the build
- **AND** the gate shows the file, the two counts and the waived count

#### Scenario: Stop for more branches than the base with fewer covered branches `gap-ledger-048`
- **WHEN** the content of a file is equal to its content in the base commit
- **AND** its ledger entry has more not-covered branches or functions than the base entry
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
- **AND** for a metric whose total counts differ, a covered count is not known or is not equal to the base covered count
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

#### Scenario: Allow changed total counts of an unchanged file when the covered count agrees `gap-ledger-088`
- **WHEN** the content of a file is equal to its content in the base commit
- **AND** the total counts in its ledger entry are not equal to the total counts in the base entry
- **AND** for each metric whose total counts differ, the covered count is known and is equal to the base covered count
- **THEN** the gate does not stop the build for the changed total counts

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
- **AND** a count of the file is above the entry count plus the tolerance plus the waived count of that metric
- **AND** the tolerance is 0 without the tolerance conditions, and the waived count is 0 without a waiver
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

## ADDED Requirements

### Requirement: Coverage waiver
A waiver MUST record a not-covered count that a person allows for one metric of one changed code file. The waiver names the content hash of the file, the lines, the change name and a reason. The gates and the ratchet command MUST allow that metric to be above the entry count by at most the waived count. This applies to a file with the content hash of the waiver. The gates MUST give no waived count to a file with other content, to a file with the base content, or to another change.
Origin: spec-first

#### Scenario: Record a waiver `gap-ledger-079`
- **WHEN** you run the ledger command `waive` with a change name, a file, a metric, one or more lines, a count and a reason
- **AND** the change is active, and the file is a tracked code file with other content than the base commit
- **AND** each line and the count are positive whole numbers, and the reason is not empty
- **THEN** the command adds one line to `openspec/trace/history.jsonl` with the kind `waiver`
- **AND** the line has the date, the change name, the commit, the file, the metric and the content hash of the file
- **AND** the line has the lines, the count and the reason
- **AND** the command runs no test and does not change `openspec/trace/gaps.json`

#### Scenario: Stop the waive command for a fault in its options `gap-ledger-080`
- **WHEN** you run the ledger command `waive` with a fault in its options
- **AND** a fault is a change that is not active, a file that Git does not track, or a file with the base content
- **AND** a fault is also an unknown metric, a line or a count that is not a positive whole number, or an empty reason
- **THEN** the command stops and shows the fault
- **AND** the command does not change `openspec/trace/history.jsonl`

#### Scenario: Allow the waived count for a changed file with the content hash of the waiver `gap-ledger-081`
- **WHEN** the content hash of a code file is not equal to the hash in its ledger entry
- **AND** one or more waivers for the file have the content hash of the file
- **AND** the not-covered count of the metric of those waivers is not above the entry count plus the sum of their counts
- **THEN** the gate does not stop the build for that metric
- **AND** the gate records the entry as not current, so the ratchet command writes the current count

#### Scenario: Give no waived count for other content `gap-ledger-082`
- **WHEN** a waiver for a code file does not have the content hash of the file, or the file has the hash of its entry
- **THEN** the gate compares the counts of the file with the counts of its entry, and the waived count is 0
- **AND** a file that no test loads also gets a waived count of 0

#### Scenario: Allow a rise above the base by the waived count of the checked change `gap-ledger-083`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has a larger not-covered count of a metric than the base entry
- **AND** the history after the base has one or more waiver lines from the checked change for the file and the metric
- **AND** those lines have the content hash of the entry, and the rise is not above the sum of their counts
- **THEN** the gate does not stop the build for that metric

#### Scenario: Give no waived count in the base comparison for other waiver lines `gap-ledger-084`
- **WHEN** a waiver line is in the base history, has another change name, or has another content hash than the ledger entry
- **THEN** the waived count of the checked change for that file and that metric does not include the line
- **AND** the waived count of a file with the base content is 0, also with a waiver line of the checked change for its hash
- **AND** the waived count of a file that no test loads is 0
- **AND** a waiver line with a count that is not a positive whole number gives no waived count

#### Scenario: Record a waived rise `gap-ledger-085`
- **WHEN** you run the ratchet command for a changed file with a not-covered count above its entry
- **AND** a waiver with the content hash of the file allows the rise
- **THEN** the command writes the larger count and the new content hash
- **AND** the history line for that metric has the reason `waived`

#### Scenario: Allow the waived count for a file with no entry `gap-ledger-086`
- **WHEN** a loaded code file with a not-covered count has no entry in the ledger
- **AND** the content of the file is not equal to its content in the base commit
- **AND** one or more waivers for the file have the content hash of the file
- **AND** the not-covered count of each metric of the file is not above the sum of the counts of its waivers for that metric
- **THEN** the gate does not stop the build for that count
- **AND** the gate records the file as not current, so the build stops until the ratchet command runs
- **AND** the ratchet command adds an entry for the file with its measured counts and the content hash
- **AND** the ratchet command adds one history line for each not-covered metric, with the reason `waived`

#### Scenario: Allow the waived count for a ledger entry that the base does not have `gap-ledger-087`
- **WHEN** the ledger has an entry for a loaded file
- **AND** the base ledger has no entry for that file
- **AND** the content of the file is not equal to its content in the base commit
- **AND** one or more waivers of the checked change for the file have the content hash of the entry
- **AND** the not-covered count of each metric of the entry is not above the sum of the counts of its waivers for that metric
- **THEN** the gate does not stop the build for that file
