## MODIFIED Requirements

### Requirement: Test guard
The test guard MUST load into each process of a gate test run. It MUST record the files that it checked, the errors that it found and the assertion counts of each test.
Origin: spec-first

#### Scenario: Give the guard to a child process that collects coverage `coverage-gate-025`
- **WHEN** a test starts a child process with `NODE_V8_COVERAGE` in its environment
- **THEN** the child process gets the test guard as the first preload in `NODE_OPTIONS`, also when `NODE_OPTIONS` already loads the guard
- **AND** the child process keeps the result of `util.promisify` for `execFile`

#### Scenario: Do not check the sources in a worker thread `coverage-gate-039`
- **WHEN** the test guard loads into a worker thread of a gate run, and the worker thread has the environment of its process
- **THEN** the guard does not check the sources, does not count the assertions and writes no results
- **AND** the guard gives the gate values to the child processes that the worker thread starts

#### Scenario: Give the gate values to the child processes of a test runner without an inspector `coverage-gate-040`
- **WHEN** a node:test runner without an inspector starts a child process that writes coverage to the coverage folder of the runner
- **AND** a preload of the runner removed `GEV_SPEC_OUT` from the environment of the runner
- **THEN** the child process gets the gate values and gets the test guard as the first preload

#### Scenario: Do nothing in a process that is not part of a gate run `coverage-gate-027`
- **WHEN** a process loads the test guard without `GEV_SPEC_OUT` in its environment
- **THEN** the guard does nothing

#### Scenario: Write the guard results of each process `coverage-gate-028`
- **WHEN** a process with the test guard exits
- **THEN** the guard writes the checked files, the errors and the assertion counts to a file in the guard folder

#### Scenario: Give the gate values to a child process that writes coverage to the coverage folder of the test process `coverage-gate-031`
- **WHEN** a test starts a child process that writes coverage to the coverage folder of the test process
- **THEN** the child process gets the gate values of `GEV_SPEC_OUT`, `GEV_SPEC_ROOT` and `GEV_SPEC_INVENTORY`
- **AND** the gate values replace the values from the test, also when the child process gets the environment of the test process

#### Scenario: Keep the values from the test in a child process with its own coverage folder `coverage-gate-032`
- **WHEN** a test starts a child process that writes coverage to a different folder
- **THEN** the child process keeps the values of `GEV_SPEC_OUT`, `GEV_SPEC_ROOT` and `GEV_SPEC_INVENTORY` from the test

#### Scenario: Stop a process with a changed `inventory.json` file `coverage-gate-033`
- **WHEN** the test guard starts in a process with `GEV_SPEC_OUT` in its environment
- **AND** the hash of `inventory.json` is not equal to the hash in `GEV_SPEC_INVENTORY`
- **THEN** the guard stops the process with an error

#### Scenario: Stop for an `inventory.json` file that changes during the run `coverage-gate-034`
- **WHEN** the content of `.gev-cache/spec/inventory.json` after the test runs is not equal to its content before the runs
- **THEN** the coverage gate stops the build

#### Scenario: Load the guard before the other preloads of a child process `coverage-gate-036`
- **WHEN** a test starts a child process with a preload that removes `GEV_SPEC_OUT`, in `NODE_OPTIONS` or on the command line
- **THEN** the guard of the child process loads before that preload
- **AND** the guard writes its results to the guard folder

#### Scenario: Stop for a process that collects coverage without an inspector `coverage-gate-037`
- **WHEN** a process with `GEV_SPEC_OUT` and `NODE_V8_COVERAGE` in its environment cannot start an inspector session
- **AND** the process is not a node:test runner that runs its tests in child processes
- **THEN** the guard writes an error that names no file to the guard folder
- **AND** the coverage gate stops the build for that error

#### Scenario: Do not check the sources in a test runner or a process without coverage that has no inspector `coverage-gate-038`
- **WHEN** a process with `GEV_SPEC_OUT` in its environment cannot start an inspector session
- **AND** the process is a node:test runner that runs its tests in child processes, or it has no `NODE_V8_COVERAGE`
- **THEN** the guard does not check the sources, does not count the assertions and writes no results
- **AND** the guard gives the gate values to the child processes that collect coverage

#### Scenario: Keep the assertion results on a Node version without the test context function `coverage-gate-045`
- **WHEN** the test guard starts in the main thread of a process with an inspector session and `GEV_SPEC_OUT`
- **AND** `node:test` has no function `getTestContext`
- **THEN** the guard does not count the assertions, and each assertion gives its usual result
- **AND** the guard writes an error that names no file to the guard folder, so the coverage gate stops the build

#### Scenario: Skip the tests that need assertion counts on a Node version without the test context function `coverage-gate-046`
- **WHEN** the tests of the gates run on a Node version with a `node:test` module without the function `getTestContext`
- **THEN** each test that needs the guard to count assertions has a skip reason that names the Node version and the function
- **AND** the other tests of the gates have no skip reason
- **AND** on a Node version with the function, the skip option of each test that needs the guard to count assertions is false
