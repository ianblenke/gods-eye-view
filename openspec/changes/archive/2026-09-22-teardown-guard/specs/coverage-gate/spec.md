## ADDED Requirements

### Requirement: Run exit
The coverage gate MUST start each test run with the option `--test-force-exit`. A run then exits when a test leaves a live timer. The test guard MUST record each timer or immediate that keeps the event loop alive when a test process exits. The gate MUST stop the build for that record.
Origin: spec-first

#### Scenario: Exit a test run that leaves a live timer `coverage-gate-048`
- **WHEN** the gate starts a test run with the arguments of `buildTestRuns()`
- **AND** a test in that run arms an interval and then fails an assertion
- **THEN** the run exits with the status 1
- **AND** the result file of the run has the record of the failed test with the status `fail`

#### Scenario: Record a live timer at the exit of a test process `coverage-gate-049`
- **WHEN** a test process with the guard exits
- **AND** a `Timeout` or an `Immediate` keeps the event loop alive at that time
- **THEN** the guard writes a leak record with the test file and the kept resource types to the guard folder
- **AND** the coverage gate stops the build with the error `GATES-TEST-LEAK` and shows the test file
- **AND** the gate does not record untrue coverage for any code file because of that record

#### Scenario: Record no leak for a test process without a live timer `coverage-gate-050`
- **WHEN** a test process with the guard exits
- **AND** no `Timeout` and no `Immediate` keeps the event loop alive at that time
- **THEN** the guard writes an empty leak list
- **AND** the coverage gate reports no live-timer error for that process

### Requirement: Trace record durability
The trace reporter MUST write each finished test record itself, synchronously, to a `.sync` file beside its own destination. That record then survives a `--test-force-exit` that ends the process before Node's own destination stream flushes. The reporter MUST open that file only when the signal option is a real `AbortSignal` and the process arguments name its own destination. Without this check, a direct call could open the file with no such signal. That call could then corrupt the real destination of a run in the same process.
Origin: spec-first

#### Scenario: findOwnDestination pairs a reporter flag with its own destination `coverage-gate-051`
- **WHEN** `findOwnDestination()` reads an argument list with several `--test-reporter`/`--test-reporter-destination` pairs
- **THEN** it returns the destination paired with the reporter whose path matches the given module path
- **AND** it returns null for an argument list that names no reporter whose path matches the given module path

#### Scenario: only a real AbortSignal opens the reporter's own destination `coverage-gate-052`
- **WHEN** the reporter runs with a `signal` option that is a real `AbortSignal`, and `process.execArgv` names this module's own destination
- **THEN** it opens and writes that destination's `.sync` file
- **AND** the same call with no `AbortSignal` opens no file, even with the same `process.execArgv`
