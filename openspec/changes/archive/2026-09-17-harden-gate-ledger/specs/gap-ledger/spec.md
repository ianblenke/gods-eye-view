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
