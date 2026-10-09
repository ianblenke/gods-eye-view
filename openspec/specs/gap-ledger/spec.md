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
- **AND** the entry does not have the conditions of `gap-ledger-092`
- **AND** the entry is for untraced test names, or it is a coverage entry without the conditions of `gap-ledger-087`
- **THEN** the gate stops the build

#### Scenario: Stop for a ledger entry that is larger than the base `gap-ledger-022`
- **WHEN** a ledger entry has more not-covered lines than the same entry in the base ledger
- **AND** the rise is above the waived count of the checked change for the lines of the file
- **AND** the count of the entry is above the adopted count of the file for the lines
- **THEN** the gate stops the build
- **AND** the gate shows the file and the two counts
- **AND** the gate also shows the waived count and the adopted count, each when it is above 0

#### Scenario: Stop for more branches than the base in a changed file `gap-ledger-040`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered branches or functions than the base entry
- **AND** the rise of that metric is above the waived count of the checked change for that metric
- **AND** the count of the entry is above the adopted count of the file for that metric
- **THEN** the gate stops the build
- **AND** the gate shows the file and the two counts
- **AND** the gate also shows the waived count and the adopted count, each when it is above 0

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
- **AND** the conditions of `gap-ledger-098` are not true for the file
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
- **AND** a loss of branches or functions above the tolerance also stops the build

#### Scenario: Make the tolerance from the total of the metric `gap-ledger-071`
- **WHEN** the gate reads the tolerance of a metric of a file
- **THEN** the tolerance is 8 for a total of 200 or more
- **AND** the tolerance is 4% of the total, without the fraction, for a total below 200
- **AND** the tolerance is 0 for a total below 25

#### Scenario: Compare the loss of covered branches with the tolerance `gap-ledger-072`
- **WHEN** a code file has the tolerance conditions
- **AND** its not-covered branch count is above the entry count plus the tolerance
- **AND** its covered branch count is below the covered branch count of its entry minus the tolerance
- **THEN** the gate stops the build, also when the total branch count is not equal to the total of its entry
- **AND** the gate does not stop the build when only one of the two differences is above the tolerance

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

### Requirement: Adoption of merged code
The ledger command `adopt` MUST record the gaps of the files that a merge commit brought into the tree. The gates MUST allow a ledger entry above the base entry, up to the adopted count of each metric. The adopted count of a metric for a file is the largest count in its valid adopt lines, and 0 with no such line. A merged commit is a parent, other than the first parent, of a merge commit between the base commit and HEAD. An adopt line is valid when the scenarios `gap-ledger-095`, `gap-ledger-096` and `gap-ledger-097` do not reject it.
Origin: spec-first

#### Scenario: Record the gaps of the merged files `gap-ledger-089`
- **WHEN** you run the ledger command `adopt` with a change name and the option `--from`
- **AND** the change is active, and the ledger file is there
- **AND** the option names a merged commit
- **AND** the content of a tracked file is not equal to its content in the base commit
- **AND** the merged commit changed the file since its merge base with the base commit
- **AND** the file is a code file with a not-covered count above 0, or a test file with untraced tests
- **THEN** the command writes the ledger entry of the file with the measured counts and the content hash
- **AND** the entry keeps its origin and its date when the ledger had an entry
- **AND** the entry gets the change name and the date when the ledger had none
- **AND** the command adds one line to `openspec/trace/history.jsonl` with the kind `adopt`
- **AND** the line has the date, the change name, the head commit and the file
- **AND** the line also has the full hash of the merged commit and the not-covered counts
- **AND** the line also has the number of untraced tests of the file and the mark for untrue coverage
- **AND** the line has `null` for each not-covered count of a test file
- **AND** the command changes no entry of a file that does not have these conditions
- **AND** the command does not change the registry or the links
- **AND** the command writes nothing when the measurement has an error, such as a failed test

#### Scenario: Stop the adopt command for a fault before it runs a test `gap-ledger-090`
- **WHEN** you run the ledger command `adopt` with a fault
- **AND** a fault is one of these: the change is not active, the option `--from` is not there, or Git cannot find the commit
- **AND** a fault is also one of these: the commit is not a merged commit, or the ledger file is not there
- **THEN** the command stops and shows the fault
- **AND** the command runs no test and does not change `openspec/trace/gaps.json` or `openspec/trace/history.jsonl`

#### Scenario: Adopt no gap of a file that the merged commit did not change `gap-ledger-091`
- **WHEN** you run the ledger command `adopt` with correct options for a file without the conditions of `gap-ledger-100`
- **AND** a code file has a not-covered count above 0, or a test file has untraced tests
- **AND** the content of the file is equal to its content in the base commit, or the merged commit did not change the file
- **THEN** the command writes no entry and no history line for that file

#### Scenario: Allow a ledger entry that the base does not have for an adopted file `gap-ledger-092`
- **WHEN** the ledger has an entry for a file
- **AND** the base ledger has no entry for that file
- **AND** the content of the file is not equal to its content in the base commit
- **AND** the file has one or more valid adopt lines of the checked change
- **AND** for a coverage entry, each not-covered count is not above the adopted count of its metric
- **AND** for an entry of untraced test names, the number of untraced tests is not above the adopted count of untraced tests
- **AND** the entry does not record untrue coverage, or the conditions of `gap-ledger-098` are true for the file
- **THEN** the gate does not stop the build for that entry

#### Scenario: Allow a rise above the base entry up to the adopted count `gap-ledger-093`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered lines, branches or functions than the base entry
- **AND** the count of the entry is not above the adopted count of that metric
- **THEN** the gate does not stop the build for that metric
- **AND** a count above the adopted count and above the base count plus the waived count stops the build

#### Scenario: Allow an entry with more untraced tests than the base entry when its number of untraced tests is not above the adopted count `gap-ledger-094`
- **WHEN** a test file has a ledger entry and a base ledger entry
- **AND** the content of the file is not equal to its content in the base commit
- **AND** the entry has a test name that the base entry does not have, or a name with a higher count
- **AND** the number of untraced tests of the entry is not above the adopted count of untraced tests
- **THEN** the gate does not stop the build for these test names
- **AND** a number above the adopted count stops the build for each of these test names

#### Scenario: Give no adopted count for a line that is not valid `gap-ledger-095`
- **WHEN** an adopt line is in the base history, or it has another change name
- **THEN** the adopted count of its file does not include the line
- **AND** a line whose field `file` or field `from` is not a string gives no adopted count
- **AND** a line with a not-covered count that is not `null` and not a whole number of 0 or more gives no adopted count
- **AND** a line whose number of untraced tests is not a whole number of 0 or more gives no adopted count
- **AND** the gate shows no error for such a line, and it shows the same errors as it shows with no such line
- **AND** the gate does not check the head commit and the date of an adopt line

#### Scenario: Stop for an adopt line with a commit that is not a merged commit `gap-ledger-096`
- **WHEN** an adopt line of the checked change names a commit that is not a merged commit
- **AND** the scenario `gap-ledger-095` does not reject the line
- **AND** the line does not have the field `reached` with the value `true`
- **THEN** the gate stops the build with the code `LEDGER-ADOPT-FROM`
- **AND** the adopted count of the file does not include that line

#### Scenario: Stop for an adopt line with a file that the merged commit did not change `gap-ledger-097`
- **WHEN** an adopt line of the checked change names a merged commit and a file
- **AND** the scenario `gap-ledger-095` does not reject the line
- **AND** the line does not have the field `reached` with the value `true`
- **AND** the file has the same content in the merged commit as at the merge base of that commit and the base commit
- **THEN** the gate stops the build with the code `LEDGER-ADOPT-FILE`
- **AND** the adopted count of the file does not include that line

#### Scenario: Allow untrue coverage of an adopted file `gap-ledger-098`
- **WHEN** a ledger entry records untrue coverage
- **AND** the same entry in the base ledger does not record untrue coverage, or the base ledger has no entry for the file
- **AND** the content of the file is not equal to its content in the base commit
- **AND** a valid adopt line of the checked change names the file and records untrue coverage
- **THEN** the gate does not stop the build for the untrue coverage

#### Scenario: Run the adopt command with make `gap-ledger-099`
- **WHEN** a test reads `Makefile`
- **THEN** the target `adopt` runs the gate command `adopt` in the Docker image with the options `CHANGE`, `BASE` and `FROM`
- **AND** the target uses the same copy and copy-back steps as the target `ratchet`

#### Scenario: Record a reached file with untrue coverage `gap-ledger-100`
- **WHEN** you run `adopt` with correct options and a merged commit
- **AND** a tracked code file has the same content as in the base commit and measured untrue coverage
- **AND** the base ledger has no entry for the file, or its entry has an `untrue` field that is false
- **AND** a path of static or literal dynamic relative imports leads from a code file that the merged commit changed to the file
- **AND** the path uses the edges of the HEAD graph
- **AND** at least one edge of that path exists in the merged commit graph and is absent in the base graph
- **AND** an edge is a pair of two code files: the file that has the import and the file that it imports
- **THEN** the command writes the measured gap and one adopt line for the file
- **AND** the adopt line has `untrue: true` and `untraced: 0`
- **AND** the entry keeps its origin and date when an entry exists

#### Scenario: Reject a reached file with true coverage `gap-ledger-101`
- **WHEN** a file with the same content as in the base commit has an import path with a new edge but true coverage
- **THEN** the command writes no entry or history line for the file
- **AND** the command also rejects a file whose base entry does not have an `untrue` field that is false

#### Scenario: Reject a file without an import path `gap-ledger-102`
- **WHEN** a code file has the same content as in the base commit and measured untrue coverage
- **AND** no import path with a new edge leads from a code file that the merged commit changed to the file
- **AND** a new edge must exist in the merged commit graph and be absent in the base graph
- **THEN** the command writes no entry or history line for the file
- **AND** a test file cannot supply the import path or become a reached file

#### Scenario: Use the old rule for other content `gap-ledger-103`
- **WHEN** a file has an import path with a new edge from a code file that the merged commit changed
- **AND** its content is not equal to its content in the base commit
- **THEN** the command rejects the reached exception for that file
- **AND** the old rule adopts its gap only when the merged commit changed the file

#### Scenario: Allow a valid reached adopt line `gap-ledger-104`
- **WHEN** a reached adopt line has all the conditions of `gap-ledger-100`
- **THEN** the gate allows a ledger entry up to its adopted counts
- **AND** the gate allows a new entry or a rise above the base entry
- **AND** the gate stops the build for a count above that limit
- **AND** the gate allows the measured null branch and function counts and the new total counts
- **AND** the gate does not stop the build for the untrue coverage of the file with the base content

#### Scenario: Stop for a reached adopt line that is not valid `gap-ledger-105`
- **WHEN** a reached adopt line lacks a condition of `gap-ledger-100`, including its new-edge condition
- **AND** the reached adopt line also lacks a condition when `untrue` is not true or `untraced` is not 0
- **THEN** the gate reports `LEDGER-ADOPT-REACHED` and names the file
- **AND** a reached adopt line that is not valid gives no adopted count
- **AND** this rule replaces the commit and file errors for a reached adopt line

#### Scenario: Record the reached field `gap-ledger-106`
- **WHEN** the command writes an adopt line for a reached file
- **THEN** the reached adopt line has boolean `reached: true` and boolean `untrue: true`
- **AND** the reached adopt line has the same other fields as an old adopt line
- **AND** an adopt line for a changed file has no reached field

#### Scenario: Reject a path with only base edges `gap-ledger-107`
- **WHEN** a code file has the base content and measured untrue coverage
- **AND** every edge of each import path from a code file that the merged commit changed exists in the base graph
- **AND** a new edge must exist in the merged commit graph and be absent in the base graph
- **THEN** the command writes no entry or history line for that file
- **AND** the gate stops the build with `LEDGER-ADOPT-REACHED` for a reached adopt line that names the file

#### Scenario: Allow a path with a new middle edge `gap-ledger-108`
- **WHEN** a code file has all the other conditions of `gap-ledger-100`
- **AND** its import path has an edge of the merged commit graph absent in the base graph, between base edges
- **THEN** the command writes the entry and adopt line for the file
- **AND** the gate allows the valid reached adopt line
- **AND** a cycle ends because the search visits each file and new-edge state once
- **AND** the base graph resolves imports only to tracked code files of the base commit

#### Scenario: Reject a path with only an author-added new edge `gap-ledger-109`
- **WHEN** a code file has all the other conditions of `gap-ledger-100`
- **AND** its HEAD import path has an edge absent in the base graph
- **AND** every such edge is absent in the merged commit graph
- **THEN** the command writes no entry or history line for the file
- **AND** the gate stops the build with `LEDGER-ADOPT-REACHED` for a reached adopt line that names the file

### Requirement: One-time ledger command
The ledger MUST allow one rebaseline step only in the change gates-coverage-race that first adds the exact merge module.
The old values must equal the base values exactly. The new values must stay within the count tolerance of the current measurement.
Origin: spec-first

#### Scenario: The command records unchanged file values `gap-ledger-110`

- **WHEN** the checked change adds the merge module and uses the `rebaseline` command
- **THEN** the command changes lines from 1 to 3 and branches from 1 to 2
- **AND** the command changes functions from 1 to 0 and adds a file with 2 uncovered lines
- **AND** each unchanged file with different metric values gets its measured entry and metric history
- **AND** each history line records old and new values, totals, content hash and change name, and the command lists each file

#### Scenario: The command rejects other changes `gap-ledger-111`

- **WHEN** the command lacks the active gates-coverage-race change or its merge module change
- **THEN** the command stops before any test
- **AND** a base tree that already contains the merge module also stops the command
- **AND** an absent current or base ledger also stops the command

#### Scenario: Changed source files keep the normal rules `gap-ledger-112`

- **WHEN** a source file differs from its base content
- **THEN** the command leaves its entry and history unchanged
- **AND** untrue or unloaded source files also keep the normal rules

#### Scenario: History allows only the recorded values `gap-ledger-113`

- **WHEN** the checked change supplies valid rebaseline history for unchanged source files
- **THEN** the gate uses the recorded entries for its base comparison
- **AND** the temporary base keeps true loaded coverage when the old entry lacked true loaded coverage
- **AND** a later measurement above the ledger by more than the count tolerance still stops the gate
- **AND** the ratchet command stops when the rebaseline history differs from the current measurement by more than the count tolerance

#### Scenario: The gate rejects false history `gap-ledger-114`

- **WHEN** a rebaseline line lacks the checked change, merge module change, base content, exact old values or new values within the count tolerance
- **THEN** the gate gives no allowance from that line
- **AND** the gate gives its LEDGER errors and rejects sets without all three metrics and repeated file metric pairs
- **AND** the gate rejects metric names outside lines, branches and functions

#### Scenario: The command allows one step `gap-ledger-115`

- **WHEN** the checked change already records a rebaseline step
- **THEN** the command stops before any test
- **AND** the command changes no ledger file after a test error
- **AND** the command stops when no metric differs
- **AND** the command stops when the current history lacks the base history prefix

#### Scenario: The real metric differences stay within tolerance `gap-ledger-116`

- **WHEN** the history records lines 44 of 310, branches 30 of 74 and branches 10 of 53
- **THEN** measurements 40 of 310, 30 of 76 and 10 of 54 allow that history

#### Scenario: The tolerance stops a larger difference `gap-ledger-117`

- **WHEN** the history records 49 uncovered lines of 310 and the measurement gives 40
- **THEN** the gate rejects the difference above the tolerance

#### Scenario: Small totals allow no difference `gap-ledger-118`

- **WHEN** the history records 2 uncovered items of 24 and the measurement gives 1
- **THEN** the gate rejects the difference

#### Scenario: The start values and source stay exact `gap-ledger-119`

- **WHEN** the history changes an old value, old total or source hash
- **THEN** the gate rejects each false value
- **AND** the gate accepts only true loaded source files
- **AND** the gate rejects metric values without whole numbers

#### Scenario: An unchanged metric stays within its limit `gap-ledger-120`

- **WHEN** the history records a metric that equals the base in the current measurement
- **THEN** the gate accepts a difference at the tolerance and rejects a larger difference

#### Scenario: The ledger snapshot stays within tolerance `gap-ledger-121`

- **WHEN** a ledger entry differs from the current measurement
- **THEN** the gate accepts differences within tolerance and rejects larger differences and false source properties

#### Scenario: A fully covered file gets no new allowance `gap-ledger-122`

- **WHEN** a history line names a file without a base entry and all three measured uncovered values equal zero
- **THEN** the gate rejects the history of the change with LEDGER-REBASELINE
- **AND** a gap in any metric prevents this rejection
- **AND** a fully covered file with a base entry can close its gap

### Requirement: Ratchet comparison verdict
The ratchet command MUST use one measurement.
The command writes the files and runs all gate comparisons with that measurement.
The command writes the trace files before the comparisons.
The comparison verdict decides status 0 for success or status 2 for errors.
The command keeps the errors that stop it before it writes the files, with status 1.

The command keeps `REVIEW-MISSING` when the review file is absent.
The first output line is `Command: ratchet`.
The comparisons use the repaired ledger, history, registry and links.
The set `RATCHET_FIXES` applies only before the command writes the files.
Origin: spec-first

#### Scenario: Compare one ratchet measurement `gap-ledger-123`
- **WHEN** the ratchet writes the ledger, history, registry and links
- **THEN** the command uses its own measurement for all comparisons

#### Scenario: Fail for an absent review `gap-ledger-124`
- **WHEN** the ratchet writes the files but the change has no review file
- **THEN** the command reports `REVIEW-MISSING` and exits with status 2

#### Scenario: Pass after all comparisons `gap-ledger-125`
- **WHEN** the ratchet completes all comparisons without an error
- **THEN** the command prints `Gates passed.` and exits with status 0

#### Scenario: Compare repaired ledger values `gap-ledger-126`
- **WHEN** the ratchet repairs stale entries, absent totals or the ledger version
- **THEN** the comparisons use the repaired ledger and keep all other errors
- **AND** the comparisons read the history line that the ratchet adds for absent totals

### Requirement: Ratchet measurement record
The ratchet MUST record the snapshot hash, commit and change even when no ledger gap changes.
The ratchet summary MUST give the number of history lines that the command writes.
The ratchet MUST keep history unchanged when the last line for this change has the same snapshot hash, commit and dirty list.
Origin: spec-first

#### Scenario: Record a snapshot without a changed gap `gap-ledger-127`
- **WHEN** the ratchet has no changed gap and no snapshot record for this change
- **THEN** the command adds a history line with kind `measurement`, the snapshot hash, the commit and the change
- **AND** the summary includes that line

#### Scenario: Keep history for an identical snapshot `gap-ledger-128`
- **WHEN** the last history line for this change has the same snapshot hash, commit and dirty list
- **THEN** the ratchet keeps history unchanged

#### Scenario: Record a different snapshot `gap-ledger-129`
- **WHEN** the snapshot hash, commit or change name differs from the last snapshot record
- **THEN** the ratchet adds a line with the current snapshot hash, commit and change

### Requirement: Ratchet input state
The ratchet MUST record changed files outside `openspec/changes/`, `openspec/specs/` and `openspec/trace/` in the history field `dirty`.
Compare current files with HEAD, with the same path rule as the document mode.
Include protected ignored files with the same exceptions.
Changed code files and test files under the three allowed paths also cause a dirty list.
A clean ratchet MUST have no `dirty` field.
The decision to keep history unchanged MUST compare the snapshot, commit and sorted dirty list.

History readers MUST accept the extra field.
Origin: spec-first

#### Scenario: Record dirty input paths `gap-ledger-130`
- **WHEN** a file outside the allowed paths differs from HEAD at the ratchet
- **THEN** the history line has the sorted `dirty` list

#### Scenario: Omit dirty list for a clean ratchet `gap-ledger-131`
- **WHEN** no input file, code file or test file differs from HEAD
- **THEN** the history line has no `dirty` field

#### Scenario: Record a different dirty list `gap-ledger-132`
- **WHEN** the snapshot and commit stay the same but the dirty list changes
- **THEN** the ratchet adds a history line

#### Scenario: Accept the extra history field `gap-ledger-133`
- **WHEN** a real history line has the extra `dirty` field
- **THEN** ledger comparisons accept the line

### Requirement: Dirty names in the ratchet container
The ratchet container MUST add the same protected ignored file markers as the document container.
The history comparison then sees protected ignored files that the container copy omits.
Origin: spec-first

#### Scenario: Keep ignored names for ratchet history `gap-ledger-134`
- **WHEN** the container copy omits a protected ignored file before the ratchet
- **THEN** the ratchet container adds its name marker before the gate command
- **AND** the marker definition comes before the immediate command expansion

### Requirement: Current review tree
The ratchet MUST read changed file names again after it writes the trace files.
The review gate MUST use that list for the tree hash.
Origin: spec-first

#### Scenario: Include changed trace files in the review tree `gap-ledger-135`
- **WHEN** a trace file equals the base before the ratchet and differs after the ratchet writes it
- **THEN** the review tree hash includes that file
- **AND** the ratchet and full check give the same review tree error

### Requirement: Count tolerance for adopted files
The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
The content hash MUST equal the hash in the ledger entry.
Both the ledger entry and the current gap MUST show true coverage from a test that loads the file.
A valid adopt line is an adopt line that meets the requirement "Adoption of merged code".
The file MUST have a valid adopt line of the checked change.
The file content MUST equal its content at the `from` commit.

The conditions on the content hash, the coverage, the adopt line and the file content are the adopted-source conditions.
This requirement is an exception to the base content condition of "Count tolerance" and to gap-ledger-028, gap-ledger-073 and gap-ledger-074.
The exception applies only to a file with the adopted-source conditions and no base content.
For that file, gap-ledger-028 does not direct the ratchet command to write the larger count.
For that file, gap-ledger-073 does not direct the ratchet command to write ledger entry counts for a smaller covered count.
For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.

The exception also extends the stale exception sentence of "Ratchet rule" to that file.
For that file, the clauses in gap-ledger-004, gap-ledger-013 and gap-ledger-054 use the adopted-source conditions instead of the tolerance conditions.
The stale clauses in gap-ledger-008 and gap-ledger-078 use the adopted-source conditions instead of the tolerance conditions.
The count clauses in gap-ledger-057, gap-ledger-069, gap-ledger-070 and gap-ledger-072 use the adopted-source conditions instead of the tolerance conditions.
The term "tolerance conditions" has only the meaning from the base requirement "Count tolerance".

For a file with base content, the stale exception sentence of "Ratchet rule" has its base meaning.
For a file with base content, these scenarios also have their base meanings:
gap-ledger-004, gap-ledger-008, gap-ledger-013, gap-ledger-054, gap-ledger-057, gap-ledger-069, gap-ledger-070, gap-ledger-072 and gap-ledger-078.
Scenario gap-ledger-071 does not use that term. Its tolerance sizes have their base meaning for all files.

For a file with the adopted-source conditions, the gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance".
For that file, the gate and the ratchet command MUST report the coverage loss errors of that requirement.
For that file, the gate MUST NOT record the ledger entry as stale for counts inside the tolerance.

When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts.
This also applies when the file equals its adopted source.
When a file has the adopted-source conditions and no base content, the ratchet command MUST use never-worse counts.

Never-worse counts are the counts that the next three rules direct the ratchet command to write.
For each metric of a file with the adopted-source conditions and no base content, the ratchet command MUST write current counts.
This applies when the current not-covered count of that metric is smaller than or equal to the ledger entry not-covered count of that metric.
Current counts are the current not-covered count and the current gap total count.

For that file, the ratchet command MUST write ledger entry counts for a metric.
This applies when the current not-covered count of that metric is larger than the ledger entry not-covered count of that metric.
Ledger entry counts are the ledger entry not-covered count and the ledger entry total count.
For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count instead.
Origin: spec-first

#### Scenario: Allow a file that equals its adopted source `gap-ledger-136`
- **WHEN** a file meets the adopted-source conditions
- **THEN** the gate applies the count tolerance of the requirement "Count tolerance"
- **AND** the gate does not record the ledger entry as stale for counts inside the tolerance

#### Scenario: Use no tolerance after an edit `gap-ledger-137`
- **WHEN** a file differs from its adopted source or its content hash differs from the hash in its ledger entry
- **THEN** the gate compares the file with no tolerance from this requirement

#### Scenario: Reject an invalid adopt line `gap-ledger-138`
- **WHEN** an adopt line names a `from` commit that is not a merged commit
- **THEN** the gate gives no tolerance from this requirement
- **AND** the gate still reports the error LEDGER-ADOPT-FROM

#### Scenario: Ignore another change `gap-ledger-139`
- **WHEN** an adopt line names another change
- **THEN** the gate gives no tolerance from that adopt line

#### Scenario: Allow an upstream file without base content `gap-ledger-140`
- **WHEN** a file has no base content and meets the adopted-source conditions
- **THEN** the gate applies the count tolerance of the requirement "Count tolerance"

#### Scenario: Use no tolerance for untrue coverage `gap-ledger-141`
- **WHEN** a file equals its adopted source but the ledger entry or the current gap has untrue coverage or no test loads the file
- **THEN** the gate gives no tolerance from this requirement

#### Scenario: Apply the count tolerance `gap-ledger-142`
- **WHEN** a file meets the adopted-source conditions
- **AND** for the lines metric, the current not-covered count of that metric is above the ledger entry not-covered count of that metric plus the tolerance
- **AND** for branches and functions, the current not-covered count of that metric is above the ledger entry not-covered count of that metric plus the tolerance
- **AND** for branches and functions, the current covered count of that metric is below the ledger entry covered count of that metric minus the tolerance
- **THEN** the gate reports LEDGER-LARGER-GAP for lines
- **AND** the gate reports LEDGER-LOST-COVERAGE for branches and functions

#### Scenario: Write never-worse counts `gap-ledger-143`
- **WHEN** the ratchet command compares a ledger entry with a file that meets the adopted-source conditions
- **THEN** the ratchet command uses never-worse counts for a file without base content
- **AND** the ratchet command uses toleranceCounts for a file with base content
- **AND** the ratchet command writes the smaller of the current and ledger entry not-covered counts of each metric for a file without base content

#### Scenario: Use one adopted source rule `gap-ledger-144`
- **WHEN** the ci command, the check command or the ratchet command runs for a change with adopt lines
- **THEN** each command checks the adopt line in the same way
- **AND** each command compares the file content with its content at the `from` commit in the same way

#### Scenario: Give no tolerance to an absent file `gap-ledger-145`
- **WHEN** a valid adopt line names a file that the current tree does not have
- **THEN** the gate gives no tolerance from this requirement and does not read the file

#### Scenario: Need the code file in the adopt line `gap-ledger-146`
- **WHEN** valid adopt lines name other files but do not name the code file
- **THEN** the gate gives that code file no tolerance from this requirement

#### Scenario: Write no larger count for a file that equals its adopted source `gap-ledger-154`
- **WHEN** a file equals its adopted source, has no base content and meets the adopted-source conditions
- **AND** a metric has a current not-covered count larger than its ledger entry not-covered count inside the tolerance
- **AND** another metric has a current not-covered count smaller than or equal to its ledger entry not-covered count
- **THEN** the ratchet command writes ledger entry counts for the metric with the current not-covered count larger than its ledger entry not-covered count
- **AND** the ratchet command reports no LEDGER-NOT-IN-BASE and no LEDGER-MORE-THAN-BASE
- **AND** the ratchet command writes current counts for that other metric
- **AND** the ratchet command does not change the total counts of the current gap

#### Scenario: Write current gap total counts when ledger entry total counts are absent `gap-ledger-155`
- **WHEN** a file has the adopted-source conditions and no base content
- **AND** a metric has a current not-covered count larger than its ledger entry not-covered count inside the tolerance
- **AND** the ledger entry total count of that metric is absent
- **THEN** the ratchet command writes the ledger entry not-covered count and the current gap total count

#### Scenario: Write a ledger entry total count of zero for a larger count `gap-ledger-156`
- **WHEN** a file has the adopted-source conditions and no base content
- **AND** a metric has a current not-covered count larger than its ledger entry not-covered count inside the tolerance
- **AND** the ledger entry total count of that metric is zero
- **THEN** the ratchet command writes the ledger entry total count of zero

### Requirement: Total counts for adopted files
The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
The gate MUST NOT record the ledger entry as stale for that difference.
Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
Both the ledger entry and the current gap MUST have equal content hashes and true coverage from a test that loads the file.

This requirement is an exception to scenario gap-ledger-078 and to the stale exception sentence of the requirement "Ratchet rule".
That sentence names the tolerance conditions as an exception to the stale rule.
This requirement gives the total count exception only to a file with a valid adopt line of the checked change and equal content hashes.
Both records MUST have true coverage from a test that loads the file.
The ledger entry and current gap MUST also have equal not-covered counts of lines, branches and functions.
The total count exception applies to no other file.

This requirement MUST NOT extend count tolerance to a file that differs from its adopted source.
For a file without base content, the ratchet command MUST write current gap total counts when that file differs from its adopted source.
For a file that equals its adopted source, the ratchet command MUST apply the count rules of "Count tolerance for adopted files".
Origin: spec-first

#### Scenario: Accept total count differences `gap-ledger-147`
- **WHEN** a file with a valid adopt line of the checked change differs from its adopted source
- **AND** the file has no base content
- **AND** its content hash equals the hash in its ledger entry
- **AND** the ledger entry and the current gap have true loaded coverage and equal not-covered counts of lines, branches and functions
- **AND** their total counts differ
- **THEN** the gate does not record the ledger entry as stale
- **AND** the ratchet command writes the current gap total counts, for example 399 or 401 for a ledger entry total count of 400

#### Scenario: Compare not-covered counts with no tolerance `gap-ledger-148`
- **WHEN** a file with a valid adopt line differs from its adopted source and has no base content
- **AND** the ledger entry and the current gap have equal content hashes and true loaded coverage
- **AND** a not-covered count differs from the ledger entry
- **AND** the current gap and the ledger entry have equal total counts
- **THEN** the gate reports LEDGER-LARGER-GAP or LEDGER-LOST-COVERAGE for a larger count
- **AND** the gate records the ledger entry as stale for a smaller count
- **AND** the build stops until the ratchet command runs for the smaller count

#### Scenario: Need a valid adopt line `gap-ledger-149`
- **WHEN** no valid adopt line names a file without base content and only its total counts differ from its ledger entry
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs

#### Scenario: Ignore another change line `gap-ledger-150`
- **WHEN** an adopt line names another change and only total counts differ for a file without base content
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs

#### Scenario: Reject an invalid from commit `gap-ledger-151`
- **WHEN** an adopt line has a `from` commit that is not a merged commit and only total counts differ for a file without base content
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs
- **AND** the gate still reports LEDGER-ADOPT-FROM

#### Scenario: Compare a different hash with no tolerance `gap-ledger-152`
- **WHEN** a file with a valid adopt line has a content hash that differs from the hash in its ledger entry
- **AND** its total counts differ
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs

#### Scenario: Compare untrue or unloaded coverage with no total count exception `gap-ledger-153`
- **WHEN** the ledger entry or the current gap has untrue coverage or no test loads the file
- **AND** the total counts differ for a file with a valid adopt line
- **THEN** the gate gives no total count exception
- **AND** the gate reports COVERAGE-FAKE for an untrue current gap or LEDGER-UNLOADED for an unloaded current gap
- **AND** the gate records the ledger entry as stale when only the ledger entry has untrue or unloaded coverage

