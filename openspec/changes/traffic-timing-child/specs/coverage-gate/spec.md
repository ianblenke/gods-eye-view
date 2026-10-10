## ADDED Requirements

### Requirement: Transformed code outside the guard
A test that loads project code through a server that changes the source MUST run that code in a child process.
The child process MUST have a folder of its own for V8 coverage and MUST have no guard settings. So the gate counts no code that runs under the name of a file with other source.
Origin: spec-first

#### Scenario: Run the traffic timing scenario in a child process `coverage-gate-101`
- **WHEN** the test of traffic timing runs and the setting GEV_TRAFFIC_TIMING_CHILD is not set
- **THEN** the test starts one child process that runs the same test file
- **AND** the child process has the setting NODE_V8_COVERAGE with a new folder, and the settings GEV_SPEC_OUT, GEV_SPEC_ROOT and GEV_SPEC_INVENTORY with the value ""
- **AND** the setting GEV_TRAFFIC_TIMING_CHILD of the child process names that folder
- **AND** the child process exits with the status 0, and the folder holds a file whose name starts with "coverage-"
- **AND** the test starts no Vite server in its own process
