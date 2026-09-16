## MODIFIED Requirements

### Requirement: CI workflow
The CI workflow MUST run the CI command on the pinned Node version with the full Git history. The Makefile MUST run the gates in the pinned Node image.
Origin: spec-first

#### Scenario: Run the CI command in the workflow `ci-gates-006`
- **WHEN** a test reads `.github/workflows/ci.yml`
- **THEN** the workflow has a `spec-gates` job that runs `node scripts/spec/gates.mjs ci`
- **AND** the job uses `.node-version` and a checkout with `fetch-depth: 0`
- **AND** the job keeps the gate results in `.gev-cache/spec/` as an artifact, also when the gates stop the build

#### Scenario: Run the gates with make `ci-gates-007`
- **WHEN** a test reads `Makefile`
- **THEN** the `gates` target runs `scripts/spec/gates.mjs` in the Docker image on a copy of the files that Git tracks or does not ignore
- **AND** the copy also gets `.git`, and the container command removes `NODE_ENV`, `HOST` and `PORT`
- **AND** each copy step stops the target when it fails, and the target copies `openspec/trace/` and `.gev-cache/` back to the project
- **AND** the targets `gates-init`, `ratchet`, `lint` and `tree` run their gate commands with the `CHANGE` and `BASE` options that the command uses

#### Scenario: Pin the Node version of the image `ci-gates-008`
- **WHEN** a test reads `Dockerfile` and `.node-version`
- **THEN** the Docker base image has the Node version from `.node-version`
- **AND** the image has Git
