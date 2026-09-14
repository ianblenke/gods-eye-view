# coverage-gate Specification

## Purpose
Measure line, branch and function coverage for each tracked code file. Count only coverage from the real source of each file.

## Requirements
### Requirement: Code inventory
The coverage gate MUST measure each code file that Git tracks. A code file has one of these extensions: `.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`, `.jsx`, `.tsx`, `.html` or `.sh`. A file with a name that ends with `.test.mjs` is a test file and is not in the inventory.
Origin: spec-first

#### Scenario: Include each tracked JS file `coverage-gate-001`
- **WHEN** Git tracks `vite.config.js`, `src/ui.js`, `scripts/format.mjs` and `src/types.ts`
- **THEN** the inventory contains the four files

#### Scenario: Do not include test files `coverage-gate-002`
- **WHEN** Git tracks `src/orbit.test.mjs`
- **THEN** the inventory does not contain the file

#### Scenario: Include HTML files and shell files `coverage-gate-011`
- **WHEN** Git tracks `index.html` and `scripts/dev-fresh.sh`
- **THEN** the inventory contains the two files

#### Scenario: Stop for an untracked code file `coverage-gate-010`
- **WHEN** the project has the code file `src/draft.js`
- **AND** Git does not track or ignore the file
- **THEN** the coverage gate stops the build

#### Scenario: Stop when Git cannot list the files `coverage-gate-029`
- **WHEN** Git cannot list the tracked files or the untracked files
- **THEN** the coverage gate stops with a message from Git

### Requirement: Coverage measurement
The coverage gate MUST run each tracked test file with node:test coverage, except the allocation test files. It MUST record the line, branch and function counts for each file in the inventory.
Origin: spec-first

#### Scenario: Run each tracked test file `coverage-gate-003`
- **WHEN** Git tracks test files in `src` and in other folders
- **THEN** the coverage gate runs each tracked test file that is not an allocation test file

#### Scenario: Read the counts for a loaded file `coverage-gate-004`
- **WHEN** the coverage report has an entry for `src/orbit.js`
- **THEN** the gate records the total and the covered lines, branches and functions from that entry

#### Scenario: Use the worst entry for a file with two or more entries `coverage-gate-044`
- **WHEN** the coverage report has two or more entries for one file
- **THEN** for each metric, the gate uses the entry with the most not-covered items
- **AND** when two entries have the same number of not-covered items, the gate uses the entry with the smaller total

#### Scenario: Give 0% coverage to a JS file that no test loads `coverage-gate-005`
- **WHEN** no test loads `src/ui.js`
- **THEN** the gate records `src/ui.js` as not loaded
- **AND** the gate records each physical line of the file as not covered

#### Scenario: Mark a file with all counts covered as complete `coverage-gate-006`
- **WHEN** a file has all its lines, branches and functions covered
- **THEN** the gate records the file as complete

#### Scenario: Run the allocation tests without coverage `coverage-gate-007`
- **WHEN** the gate runs
- **THEN** the gate runs each allocation test file in its own process with `--expose-gc` and without coverage
- **AND** the trace gate uses the results of these tests

#### Scenario: Run the allocation tests at the same time as the main run `coverage-gate-022`
- **WHEN** the gate starts the test runs
- **THEN** the gate starts the main run and each allocation run at the same time
- **AND** the gate waits until each run is complete

#### Scenario: Stop when a test run cannot start `coverage-gate-026`
- **WHEN** the test runner or one test run stops with an error or writes no result file
- **THEN** the coverage gate stops the build
- **AND** the gate shows the status of the run

#### Scenario: Stop for a failed test run without a failed test `coverage-gate-035`
- **WHEN** a test run stops with a status that is not 0
- **AND** its result file has no test with the status `fail`
- **THEN** the coverage gate stops the build

#### Scenario: Mark an HTML file without inline scripts as complete `coverage-gate-012`
- **WHEN** an HTML file has no script element with code in it, no event handler attribute and no `javascript:` URL
- **THEN** the gate records the file as complete

#### Scenario: Measure a script element with a src text that is not the src attribute `coverage-gate-041`
- **WHEN** the start tag of a script element has the text `src=` only in another attribute name or in a quoted value
- **THEN** the gate records each line of the code in that script element as not covered

#### Scenario: Give 0% coverage to event handler attributes and javascript URLs `coverage-gate-042`
- **WHEN** an HTML file has an event handler attribute, such as `onclick`, or a `javascript:` URL
- **THEN** the gate records the file as not loaded
- **AND** the gate records one not-covered line for each attribute and each URL

#### Scenario: Give 0% coverage to the inline scripts of an HTML file `coverage-gate-013`
- **WHEN** an HTML file has script elements with code in them
- **THEN** the gate records the file as not loaded
- **AND** the gate records each line of that code as not covered

#### Scenario: Give 0% coverage to a shell file `coverage-gate-014`
- **WHEN** the inventory contains `scripts/dev-fresh.sh`
- **THEN** the gate records the file as not loaded
- **AND** the gate records each physical line of the file as not covered

#### Scenario: Run the tests without the Node options of the gate environment `coverage-gate-015`
- **WHEN** the environment of the gate has `NODE_OPTIONS`, `NODE_V8_COVERAGE` or `NODE_TEST_CONTEXT`
- **THEN** the test runs do not get these values from the gate environment
- **AND** each test run gets the test guard in `NODE_OPTIONS`
- **AND** each test run gets the hash of `inventory.json` in `GEV_SPEC_INVENTORY`

#### Scenario: Stop for a Node version that is not the pinned version `coverage-gate-016`
- **WHEN** the Node version is not equal to the version in `.node-version`
- **THEN** the coverage gate stops the build

### Requirement: Test results
The coverage gate MUST read test results only from the result files that it named for its test runs. It makes a new result folder for each measurement.
Origin: spec-first

#### Scenario: Stop for a result file that the gate did not name `coverage-gate-030`
- **WHEN** the result folder has a test result file that the gate did not name
- **THEN** the coverage gate stops the build
- **AND** the gate does not read that file

### Requirement: No coverage ignore comments or filter options
A tracked file MUST NOT remove code from the coverage measurement. The coverage filter options of node:test are `--test-coverage-exclude` and `--test-coverage-include`.
Origin: spec-first

#### Scenario: Stop for a code file that imports a test file `coverage-gate-043`
- **WHEN** a file in the inventory loads a file with a name that ends with `.test.mjs` with `import` or `require`
- **THEN** the coverage gate stops the build
- **AND** the gate shows the file and the line

#### Scenario: Stop for a coverage ignore comment `coverage-gate-008`
- **WHEN** a file in the inventory has a `node:coverage` ignore, disable or enable comment, or a `c8`, `v8` or `istanbul` ignore comment
- **THEN** the coverage gate stops the build
- **AND** the gate shows the file and the line

#### Scenario: Stop for a coverage filter option `coverage-gate-017`
- **WHEN** a tracked code file, JSON file or YAML file other than `scripts/spec/gates.mjs` and its test file contains a coverage filter option of node:test
- **THEN** the coverage gate stops the build

### Requirement: True coverage
The coverage gate MUST count only code that runs from the real source of a code file. The gate calculates the content hash of each code file before the test runs start.
Origin: spec-first

#### Scenario: Stop for code that runs under the name of a code file `coverage-gate-018`
- **WHEN** a test runs code with the file name or URL of a file in the inventory
- **AND** the code is not equal to the content of that file at the start of the run
- **AND** the ledger entry of that file does not record untrue coverage
- **THEN** the coverage gate stops the build
- **AND** the gate shows the file

#### Scenario: Do not stop for code that a test imports from a code file `coverage-gate-019`
- **WHEN** a test imports a file in the inventory
- **THEN** the coverage gate does not stop the build for that file

#### Scenario: Give 0% coverage to a file with untrue coverage `coverage-gate-021`
- **WHEN** a test runs code with the file name of a file in the inventory and the code is not equal to the file
- **THEN** the gate records the file as not loaded
- **AND** the gate records each physical line of the file as not covered

#### Scenario: Stop for a module hook that changes a code file `coverage-gate-020`
- **WHEN** a test registers a module hook that loads other source for a file in the inventory
- **THEN** the coverage gate stops the build

#### Scenario: Stop for a code file that changes during the run `coverage-gate-023`
- **WHEN** the content hash of a file in the inventory after the test runs is not equal to its hash before the runs
- **THEN** the coverage gate stops the build
- **AND** the gate shows the file

#### Scenario: Give 0% coverage to a file that no guard checked `coverage-gate-024`
- **WHEN** the coverage report has an entry for a file in the inventory
- **AND** no test guard checked the source of that file
- **THEN** the gate records the file as not loaded and as untrue

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

