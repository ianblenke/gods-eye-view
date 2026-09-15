## ADDED Requirements

### Requirement: CI command
The command `node scripts/spec/gates.mjs ci` MUST find the change of the diff against the base branch and run all gates for it. A diff that changes a code file, a test file, a process file or a file in `openspec/` MUST add one archived change.
Origin: spec-first

#### Scenario: Stop for a code diff without an archived change `ci-gates-001`
- **WHEN** the diff against the base changes a code file
- **AND** the diff adds no folder in `openspec/changes/archive`
- **THEN** the CI command stops the build

#### Scenario: Stop for a process file diff without an archived change `ci-gates-010`
- **WHEN** the diff against the base changes `AGENTS.md`, a file in `.claude/` or `.github/`, `Makefile`, `Dockerfile`, `.node-version`, `package.json` or `package-lock.json`
- **AND** the diff adds no folder in `openspec/changes/archive`
- **THEN** the CI command stops the build

#### Scenario: Stop for a diff with two archived changes `ci-gates-002`
- **WHEN** the diff against the base adds two folders in `openspec/changes/archive`
- **THEN** the CI command stops the build

#### Scenario: Stop for an active change `ci-gates-003`
- **WHEN** `openspec/changes` has a folder other than `archive`
- **THEN** the CI command stops the build
- **AND** the command tells you to archive the change before you merge it

#### Scenario: Check the archived change of the diff `ci-gates-004`
- **WHEN** the diff against the base adds one folder in `openspec/changes/archive`
- **THEN** the CI command runs the gates with `--change` and the name of that change

#### Scenario: Check a diff that changes no code `ci-gates-005`
- **WHEN** the diff against the base changes no code file, no test file, no process file and no file in `openspec/`
- **THEN** the CI command runs the gates without `--change`

### Requirement: Command line
The gate command MUST show its usage and exit with the status 2 for a command line that it cannot read.
Origin: spec-first

#### Scenario: Show the usage for a bad command line `ci-gates-009`
- **WHEN** you run the gate command with an unknown command or an option without a value
- **THEN** the command shows its usage
- **AND** the command exits with the status 2

### Requirement: CI workflow
The CI workflow MUST run the CI command on the pinned Node version with the full Git history. The Makefile MUST run the gates in the pinned Node image.
Origin: spec-first

#### Scenario: Run the CI command in the workflow `ci-gates-006`
- **WHEN** a test reads `.github/workflows/ci.yml`
- **THEN** the workflow has a `spec-gates` job that runs `node scripts/spec/gates.mjs ci`
- **AND** the job uses `.node-version` and a checkout with `fetch-depth: 0`

#### Scenario: Run the gates with make `ci-gates-007`
- **WHEN** a test reads `Makefile`
- **THEN** the `gates` target runs `scripts/spec/gates.mjs` in the Docker image
- **AND** the targets `gates-init`, `ratchet`, `stability`, `lint` and `tree` run their gate commands with the `CHANGE` and `BASE` options that the command uses

#### Scenario: Pin the Node version of the image `ci-gates-008`
- **WHEN** a test reads `Dockerfile` and `.node-version`
- **THEN** the Docker base image has the Node version from `.node-version`
- **AND** the image has Git
