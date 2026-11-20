## REMOVED Requirements

### Requirement: Transformed code outside the guard
**Reason**: Upstream rewrote the traffic timing test, and the new test runs in the same process. The scenario named the child process of the old test. This change retires the scenarios `coverage-gate-101`.
**Migration**: None.


## ADDED Requirements

### Requirement: Vue loader in test runs
The gate MUST give each test run the Vue loader of the project, when the project has one, so a test can import a single-file component.
Origin: spec-first

#### Scenario: Load the Vue loader `coverage-gate-102`
- **WHEN** the project has the file `build/registerVue.js`
- **THEN** each test run of the gate starts with the option `--import=./build/registerVue.js`
- **AND** a test run for a project with no such file has no `--import` option
