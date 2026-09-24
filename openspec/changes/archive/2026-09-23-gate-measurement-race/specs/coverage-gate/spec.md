## ADDED Requirements

### Requirement: Reporter output durability
A test-file child process of a gate run MUST keep its standard output in blocking mode. Node marks such a process with the environment variable `NODE_TEST_CONTEXT=child-v8`. With blocking mode, `--test-force-exit` cannot end that process before its queued reporter output reaches the parent. Without blocking mode, the process can exit before a queued part of its reporter output reaches the parent, and the parent gets no error. Then the gate counts too few tests and scenario links for the test file of that process.
Origin: spec-first

#### Scenario: Set the standard output of a test-file child to blocking mode `coverage-gate-053`
- **WHEN** the test guard starts with `GEV_SPEC_OUT` in a process where `NODE_TEST_CONTEXT` is equal to `child-v8`
- **THEN** the guard sets the standard output of that process to blocking mode
- **AND** when that standard output has no blocking-mode function, the guard gives no error

#### Scenario: Do not change the standard output of another process `coverage-gate-054`
- **WHEN** the test guard starts in a process without `GEV_SPEC_OUT`, or in a process where `NODE_TEST_CONTEXT` is not set or is not equal to `child-v8`
- **THEN** the guard does not change the standard output of that process
