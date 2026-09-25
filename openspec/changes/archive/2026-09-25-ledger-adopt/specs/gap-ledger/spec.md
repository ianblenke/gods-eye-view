## MODIFIED Requirements

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
- **AND** the gate shows the file, the two counts, the waived count and the adopted count

#### Scenario: Stop for more branches than the base in a changed file `gap-ledger-040`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered branches or functions than the base entry
- **AND** the rise of that metric is above the waived count of the checked change for that metric
- **AND** the count of the entry is above the adopted count of the file for that metric
- **THEN** the gate stops the build
- **AND** the gate shows the file, the two counts, the waived count and the adopted count

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

## ADDED Requirements

### Requirement: Adoption of merged code
The ledger command `adopt` MUST record the gaps of the files that a merge commit brought into the tree. The gates MUST allow a ledger entry above the base entry, up to the adopted count of each metric. The adopted count of a metric for a file is the largest count in its valid adopt lines, and 0 with no such line. A merged commit is a parent, other than the first parent, of a merge commit between the base commit and HEAD. An adopt line is valid when the scenarios `gap-ledger-095`, `gap-ledger-096` and `gap-ledger-097` do not reject it.
Origin: spec-first

#### Scenario: Record the gaps of the merged files `gap-ledger-089`
- **WHEN** you run the ledger command `adopt` with a change name and the option `--from`
- **AND** the change is active, and the ledger file is there
- **AND** the option names a merged commit
- **AND** a tracked file has other content than the base commit, and that commit changed the file since its merge base with the base commit
- **AND** the file is a code file with a not-covered count, or a test file with untraced tests
- **THEN** the command writes the ledger entry of the file with the measured counts and the content hash
- **AND** the entry keeps its origin and its date when the ledger had an entry
- **AND** the entry gets the change name and the date when the ledger had none
- **AND** the command adds one line to `openspec/trace/history.jsonl` with the kind `adopt`
- **AND** the line has the date, the change name, the head commit, the file and the commit of the option
- **AND** the line also has the not-covered counts, the count of untraced tests and the mark for untrue coverage
- **AND** the command changes no entry of another file, and it does not change the registry or the links
- **AND** the command writes nothing when the measurement has an error, such as a failed test

#### Scenario: Stop the adopt command for a fault in its options `gap-ledger-090`
- **WHEN** you run the ledger command `adopt` with a fault in its options
- **AND** a fault is a change that is not active, no option `--from`, or a commit that Git cannot find
- **AND** a fault is also a commit that is not a merged commit
- **AND** a fault is also a ledger file that is not there
- **THEN** the command stops and shows the fault
- **AND** the command runs no test and does not change `openspec/trace/gaps.json` or `openspec/trace/history.jsonl`

#### Scenario: Adopt no gap of a file that the merged commit did not change `gap-ledger-091`
- **WHEN** you run the ledger command `adopt` with correct options
- **AND** a code file has a not-covered count, or a test file has untraced tests
- **AND** the file has the base content, or the commit of the option did not change it since its merge base with the base commit
- **THEN** the command writes no entry and no history line for that file

#### Scenario: Allow a ledger entry that the base does not have for an adopted file `gap-ledger-092`
- **WHEN** the ledger has an entry for a file
- **AND** the base ledger has no entry for that file
- **AND** the content of the file is not equal to its content in the base commit
- **AND** the file has one or more valid adopt lines of the checked change
- **AND** for a coverage entry, each not-covered count is not above the adopted count of its metric
- **AND** for an entry of untraced test names, the number of untraced tests is not above the adopted count of untraced tests
- **THEN** the gate does not stop the build for that entry

#### Scenario: Allow a rise above the base entry up to the adopted count `gap-ledger-093`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered lines, branches or functions than the base entry
- **AND** the count of the entry is not above the adopted count of that metric
- **THEN** the gate does not stop the build for that metric
- **AND** a count above the adopted count and above the base count plus the waived count stops the build

#### Scenario: Allow more untraced tests than the base entry up to the adopted count `gap-ledger-094`
- **WHEN** a test file has a ledger entry and a base ledger entry
- **AND** the content of the file is not equal to its content in the base commit
- **AND** the entry has untraced tests that the base entry does not have
- **AND** the number of these tests is not above the adopted count of untraced tests
- **THEN** the gate does not stop the build for these tests
- **AND** a number above the adopted count stops the build for each of these tests

#### Scenario: Give no adopted count for a line that is not valid `gap-ledger-095`
- **WHEN** an adopt line is in the base history, or it has another change name
- **THEN** the adopted count of its file does not include the line
- **AND** an adopt line with a count that is not a whole number of 0 or more gives no adopted count
- **AND** the gate shows no error for such a line alone

#### Scenario: Stop for an adopt line with a commit that the merge did not bring `gap-ledger-096`
- **WHEN** an adopt line of the checked change names a commit that is not a merged commit
- **THEN** the gate stops the build with the code `LEDGER-ADOPT-FROM`
- **AND** the adopted count of the file does not include that line

#### Scenario: Stop for an adopt line with a file that the commit did not change `gap-ledger-097`
- **WHEN** an adopt line of the checked change names a file
- **AND** the file has the same content in the commit of the line as at the merge base of that commit and the base commit
- **THEN** the gate stops the build with the code `LEDGER-ADOPT-FILE`
- **AND** the adopted count of the file does not include that line

#### Scenario: Allow untrue coverage of an adopted file `gap-ledger-098`
- **WHEN** a ledger entry records untrue coverage
- **AND** the same entry in the base ledger does not record untrue coverage, or the base ledger has no entry for the file
- **AND** a valid adopt line of the checked change names the file and records untrue coverage
- **THEN** the gate does not stop the build for the untrue coverage

#### Scenario: Run the adopt command with make `gap-ledger-099`
- **WHEN** a test reads `Makefile`
- **THEN** the target `adopt` runs the gate command `adopt` in the Docker image with the options `CHANGE`, `BASE` and `FROM`
- **AND** the target uses the same copy and copy-back steps as the target `ratchet`
