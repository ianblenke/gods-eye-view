## ADDED Requirements

### Requirement: Scenario IDs
Each scenario in a spec MUST have one stable ID at the end of its heading. The ID format is `<capability>-<NNN>`. `<capability>` is the name of the spec folder and `<NNN>` is three digits.
Origin: spec-first

#### Scenario: Read the ID from a scenario heading `spec-trace-001`
- **WHEN** a spec file in the folder `flights` has a scenario heading that ends with the ID `flights-004` in backticks
- **THEN** the trace gate records the ID `flights-004`
- **AND** the gate also records the capability, the requirement name, the scenario name, the file and the line

#### Scenario: Stop for a scenario without an ID `spec-trace-002`
- **WHEN** a scenario heading in a spec file has no ID in backticks
- **THEN** the trace gate stops the build
- **AND** the gate shows the file and the line of the heading

#### Scenario: Stop for an ID with the wrong capability `spec-trace-003`
- **WHEN** a scenario in the folder `flights` has the ID `radio-001`
- **THEN** the trace gate stops the build

#### Scenario: Stop for the same ID in two scenarios of the main specs `spec-trace-004`
- **WHEN** two scenarios in `openspec/specs` have the same ID
- **THEN** the trace gate stops the build
- **AND** the gate shows the two locations

#### Scenario: Do not stop for the same ID in a change delta `spec-trace-005`
- **WHEN** a delta spec in an active change has a scenario with an ID from `openspec/specs` in the same capability
- **THEN** the trace gate does not stop the build
- **AND** the gate uses the scenario from the change

#### Scenario: Stop for a retired ID in a spec `spec-trace-006`
- **WHEN** a spec has a scenario ID that is in `openspec/trace/retired-ids.json`
- **THEN** the trace gate stops the build

#### Scenario: Read no scenarios from a project without specs `spec-trace-038`
- **WHEN** the project has no spec folders and no `openspec/trace/retired-ids.json` file
- **THEN** the trace gate reads no scenarios and no retired IDs

#### Scenario: Stop for the same new ID in two active changes `spec-trace-018`
- **WHEN** two active changes add a scenario with the same ID
- **AND** `openspec/specs` does not have that ID
- **THEN** the trace gate stops the build

#### Scenario: Stop for a removed scenario that is not retired `spec-trace-019`
- **WHEN** a delta spec has a scenario ID under "REMOVED Requirements"
- **AND** `openspec/trace/retired-ids.json` does not contain the ID
- **THEN** the trace gate stops the build

### Requirement: Test tags
Each leaf test MUST name one, two or three scenario IDs in square brackets at the start of its name. A leaf test is a test without subtests. A test does not get the IDs of its parent test.
Origin: spec-first

#### Scenario: Read the tags from a test name `spec-trace-007`
- **WHEN** a test name starts with the tag `[flights-004 radio-002]`
- **THEN** the trace gate links the test to `flights-004` and to `radio-002`

#### Scenario: Do not give the parent tags to a subtest `spec-trace-008`
- **WHEN** a parent test has a subtest with no tag
- **THEN** the trace gate records the subtest as untraced

#### Scenario: Record the first line of each test `spec-trace-044`
- **WHEN** node:test reports a test with the line and the column of its definition
- **THEN** the trace reporter writes that line and its column in the entry of the test

#### Scenario: Record a leaf test without a tag as untraced `spec-trace-009`
- **WHEN** a leaf test has no tag
- **THEN** the trace gate records the test as untraced in the trace report
- **AND** the gap ledger rules control the result of the build

#### Scenario: Stop for a tag with an unknown ID `spec-trace-010`
- **WHEN** a test name has a tag with an ID that no spec contains
- **THEN** the trace gate stops the build
- **AND** the gate shows the test file and the test name

#### Scenario: Stop for a tag with a retired ID `spec-trace-011`
- **WHEN** a test name has a tag with an ID from `openspec/trace/retired-ids.json`
- **THEN** the trace gate stops the build

#### Scenario: Stop for a tag with a bad format `spec-trace-020`
- **WHEN** a test name starts with `[`
- **AND** the text in the brackets is not a list of IDs with one space between the IDs
- **THEN** the trace gate stops the build

#### Scenario: Stop for a tag with more than three IDs `spec-trace-021`
- **WHEN** a test name has a tag with four IDs
- **THEN** the trace gate stops the build

#### Scenario: Stop for a tag on a parent test `spec-trace-022`
- **WHEN** a test with subtests has a tag
- **THEN** the trace gate stops the build

#### Scenario: Stop for a tag on a suite `spec-trace-034`
- **WHEN** a `describe` suite has a tag
- **THEN** the trace gate stops the build

#### Scenario: Stop for a test outside a test file `spec-trace-023`
- **WHEN** a module with a name that does not end with `.test.mjs` defines a test
- **THEN** the trace gate stops the build

### Requirement: Scenario tests
Each scenario in `openspec/specs` MUST have one or more leaf tests that pass, call a method of `node:assert` and name its ID. A skipped test or a todo test does not test a scenario.
Origin: spec-first

#### Scenario: Stop for a scenario without a test that passes `spec-trace-012`
- **WHEN** a scenario in `openspec/specs` has no test that passes and names its ID
- **THEN** the trace gate stops the build
- **AND** the gate shows the scenario ID and the spec file

#### Scenario: Do not count a skipped test `spec-trace-013`
- **WHEN** the only test with a scenario ID is a skipped test
- **THEN** the trace gate records the scenario as not tested

#### Scenario: Do not count a todo test `spec-trace-024`
- **WHEN** the only test with a scenario ID is a todo test
- **THEN** the trace gate records the scenario as not tested

#### Scenario: Stop for a skipped test with a tag `spec-trace-025`
- **WHEN** the test runner skips a test with a tag
- **THEN** the trace gate stops the build

#### Scenario: Show the untested scenarios of an active change as open `spec-trace-014`
- **WHEN** a scenario in an active change has no test that passes
- **AND** the gate runs without the `--change` option
- **THEN** the trace gate shows the scenario as open and does not stop the build

#### Scenario: Stop for an untested scenario of the named change `spec-trace-015`
- **WHEN** the gate runs with the option `--change <name>`
- **AND** a scenario in that change has no test that passes
- **THEN** the trace gate stops the build

#### Scenario: Stop for an unknown change name `spec-trace-026`
- **WHEN** the gate runs with `--change <name>`
- **AND** no active change and no archived change has that name
- **THEN** the trace gate stops the build

#### Scenario: Stop for a failed test `spec-trace-016`
- **WHEN** one test fails
- **THEN** the trace gate stops the build

#### Scenario: Stop for a traced test without an assertion `spec-trace-027`
- **WHEN** a traced leaf test passes
- **AND** the test calls no method of `node:assert` or `node:assert/strict`
- **THEN** the trace gate stops the build

#### Scenario: Stop for a test file without tests `spec-trace-028`
- **WHEN** the gate runs a tracked test file
- **AND** the file reports no tests
- **THEN** the trace gate stops the build

#### Scenario: Stop for a test entry that does not agree with its name `spec-trace-039`
- **WHEN** the tags of a test entry are not the tags in its name, or its full name does not end with its name
- **THEN** the trace gate stops the build

#### Scenario: Stop for two traced tests with the same full name `spec-trace-040`
- **WHEN** two leaf tests with a tag in the same test file have the same full name
- **THEN** the trace gate stops the build

### Requirement: Trace report and links
The trace gate MUST write a trace report to `.gev-cache/spec/trace-report.json` after each run. The file `openspec/trace/links.json` MUST contain the current link from each scenario to its tests.
Origin: spec-first

#### Scenario: Write the links and the origin of each scenario `spec-trace-017`
- **WHEN** a run of the trace gate is complete
- **THEN** the report lists each scenario with its origin and the names of its tests that pass
- **AND** the report lists each untraced test with its file

#### Scenario: Stop for a links file that is not current `spec-trace-029`
- **WHEN** the links from the test run are not equal to `openspec/trace/links.json`
- **THEN** the trace gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Write the links file with the ratchet command `spec-trace-030`
- **WHEN** you run the ratchet command
- **THEN** the command writes the links from the test run to `openspec/trace/links.json`

#### Scenario: Write the registry and the links file with sorted keys `spec-trace-041`
- **WHEN** a command writes `openspec/trace/ids.json` or `openspec/trace/links.json`
- **THEN** the file has its keys in sorted order

### Requirement: Scenario ID registry
The file `openspec/trace/ids.json` MUST record each scenario ID with a hash of the scenario text. The hash MUST also contain the name and the text of the requirement of the scenario. When the text of a scenario changes, a test with a tag that names the ID MUST also change.
Origin: spec-first

#### Scenario: Change the hash when the requirement changes `spec-trace-047`
- **WHEN** the name or the text of a requirement changes
- **THEN** the hash of each scenario of that requirement changes
- **AND** empty lines in the requirement text do not change the hash
- **AND** the requirement text includes the lines of a fenced code block before the first scenario
- **AND** a change to the spaces at the start of a line changes the hash
- **AND** a change to the spaces at the end of a line does not change the hash
- **AND** a line that moves from the requirement text to the scenario name changes the hash

#### Scenario: Stop for an ID that is not in the registry `spec-trace-031`
- **WHEN** a scenario ID is not in `openspec/trace/ids.json`
- **THEN** the trace gate stops the build
- **AND** the gate tells you to run the ratchet command

#### Scenario: Stop for scenario text with a hash that is not equal to the registry hash `spec-trace-035`
- **WHEN** the hash of a scenario text is not equal to its hash in `openspec/trace/ids.json`
- **THEN** the trace gate stops the build

#### Scenario: Stop the ratchet command for changed text when no test changed `spec-trace-032`
- **WHEN** you run the ratchet command and the text of a scenario changed
- **AND** no test with a tag that names the ID changed against the base
- **THEN** the command stops and does not change the registry

#### Scenario: Stop for an ID without a scenario `spec-trace-033`
- **WHEN** an ID in `openspec/trace/ids.json` has no scenario in the specs or in the active changes
- **AND** `openspec/trace/retired-ids.json` does not contain the ID
- **THEN** the trace gate stops the build

### Requirement: Comparison of the registry with the base
The trace gate MUST compare `openspec/trace/ids.json` with the same file in the base commit.
Origin: spec-first

#### Scenario: Stop for a base ID that the registry does not contain `spec-trace-036`
- **WHEN** the base registry has an ID that the current registry does not have
- **AND** `openspec/trace/retired-ids.json` does not contain the ID
- **THEN** the trace gate stops the build

#### Scenario: Stop for a changed registry hash when no test changed `spec-trace-037`
- **WHEN** the hash of an ID in the current registry is not equal to its hash in the base registry
- **AND** no test with a tag that names the ID changed against the base
- **THEN** the trace gate stops the build

#### Scenario: Do not use a test as changed when only other text in its file changed `spec-trace-042`
- **WHEN** a test file changed against the base
- **AND** a test file of the base contains the text of a test with a tag
- **AND** the gate does not compare the spaces at the end of each line
- **AND** that text starts at the first line of the test and stops at the line that closes the test call
- **THEN** the gate does not use that test as a changed test for its IDs

#### Scenario: Use a test with new text as a changed test `spec-trace-043`
- **WHEN** no test file of the base contains the text of a test with a tag
- **AND** the gate does not compare the spaces at the end of each line
- **THEN** the gate uses the test as a changed test for its IDs

#### Scenario: Do not use a moved test as changed `spec-trace-045`
- **WHEN** a test with a tag moves to another test file or to a renamed test file
- **AND** the text of the test does not change
- **THEN** the gate finds the text of the test in a test file of the base
- **AND** the gate does not use that test as a changed test for its IDs

#### Scenario: Use the next test when the end of a test call is not clear `spec-trace-046`
- **WHEN** the gate cannot find the line that closes a test call
- **THEN** the text of the test stops before the next test in its file or at the end of the file

### Requirement: Archived change specs
When the gates check an archived change, the main specs MUST contain each added or modified requirement and scenario of that change. The main specs MUST NOT contain a removed requirement or a removed scenario of that change. The main specs MUST contain each renamed requirement of that change with its new name and MUST NOT contain it with its old name.
Origin: spec-first

#### Scenario: Stop for an archived scenario that is not in the main specs `spec-trace-048`
- **WHEN** the gates check an archived change
- **AND** a delta spec of the change adds or modifies a scenario
- **AND** `openspec/specs` does not have a scenario with that ID and the same hash
- **THEN** the trace gate stops the build
- **AND** the gate shows the file and the line of the scenario in the change

#### Scenario: Stop for an archived removed scenario that the main specs still have `spec-trace-049`
- **WHEN** the gates check an archived change
- **AND** a delta spec of the change removes a scenario
- **AND** `openspec/specs` still has the ID, or `openspec/trace/retired-ids.json` does not contain the ID
- **THEN** the trace gate stops the build

#### Scenario: Stop for an archived requirement that is not in the main spec `spec-trace-051`
- **WHEN** the gates check an archived change
- **AND** a delta spec of the change adds or modifies a requirement
- **AND** the main spec of that capability does not have a requirement with the same name, the same text and the same scenario IDs
- **THEN** the trace gate stops the build
- **AND** the gate shows the file and the line of the requirement in the change

#### Scenario: Stop for an archived removed requirement that the main spec still has `spec-trace-052`
- **WHEN** the gates check an archived change
- **AND** a delta spec of the change removes a requirement with a requirement heading or with a list item that OpenSpec accepts
- **AND** the main spec of that capability still has a requirement with that name
- **THEN** the trace gate stops the build

#### Scenario: Stop for an archived renamed requirement that the main spec has with the old name or does not have with the new name `spec-trace-053`
- **WHEN** the gates check an archived change
- **AND** a delta spec of the change renames a requirement with a FROM line and a TO line
- **AND** the main spec of that capability still has a requirement with the old name, or does not have a requirement with the new name
- **THEN** the trace gate stops the build

#### Scenario: Stop for an archived change without a proposal `spec-trace-050`
- **WHEN** the gates check an archived change
- **AND** the change folder has no `proposal.md` file
- **THEN** the trace gate stops the build
