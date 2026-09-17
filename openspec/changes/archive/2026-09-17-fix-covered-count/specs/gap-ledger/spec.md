## MODIFIED Requirements

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
