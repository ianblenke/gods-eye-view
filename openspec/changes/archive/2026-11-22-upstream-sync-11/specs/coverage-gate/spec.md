## ADDED Requirements

### Requirement: Vue loader in test runs
The gate MUST give each test run the Vue loader of the project, when the project has one. Then a test can import a single-file component.
Origin: spec-first

#### Scenario: Load the Vue loader `coverage-gate-102`
- **WHEN** the project has the file `build/registerVue.js`
- **THEN** each test run of the gate starts with the option `--import=./build/registerVue.js`
- **AND** a test run for a project with no such file has no `--import` option

### Requirement: Recorded findings of upstream test files
The gate MUST give no error for one of three findings of an upstream test file. The record `openspec/trace/upstream-test-findings.json` must list the file with the code of the finding. The gate MUST NOT give such an exception for an owned file.
- A live timer at the end of its test process (`GATES-TEST-LEAK`).
- A test that a helper file registers (`TRACE-OUTSIDE-TEST-FILE`).
- A test file that reports no tests (`TRACE-EMPTY-TEST-FILE`).

Origin: spec-first

#### Scenario: Give no error for a recorded finding of an upstream file `coverage-gate-103`
- **WHEN** a finding names an upstream file, and the record lists the file with the code of the finding
- **THEN** the gate gives no error for the finding

#### Scenario: Stop for a finding that the record does not list `coverage-gate-104`
- **WHEN** a finding names an upstream file, and the record lists no such code for the file
- **THEN** the gate keeps the error of the finding
- **AND** a finding for an owned file always keeps its error

#### Scenario: Stop for a record that no longer fits `coverage-gate-105`
- **WHEN** the record lists an owned file, or lists a code other than `GATES-TEST-LEAK` that the run did not find for the file
- **THEN** the gate stops with the error `GATES-FINDING-OWNED` for the owned file
- **AND** the gate stops with the error `GATES-FINDING-STALE` for the code that the run did not find
- **AND** the gate gives no stale error for `GATES-TEST-LEAK`, because the run time decides whether a live timer occurs

#### Scenario: Write the record with the findings command `coverage-gate-106`
- **WHEN** the findings command runs
- **THEN** the command stops for each error except `GATES-FINDING-STALE`, `QA-HEADER` and the findings of upstream files that it records
- **AND** when no other error remains, the command writes the record with each finding of an upstream file, sorted by file and by code

### Requirement: Limit of parallel test processes
The main test run of the gate MUST use at most half of the processors at the same time, and at least two. Then a test with a time limit meets less load from the other tests.
Origin: spec-first

#### Scenario: Run half of the processors `coverage-gate-107`
- **WHEN** the gate builds the main test run
- **THEN** the run has the option `--test-concurrency` with half of the processors, rounded down, and at least 2
