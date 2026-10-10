## ADDED Requirements

### Requirement: Codex sign-in in the app container
The file `compose.codex.yaml` MUST give the app container the host network and a read-only Codex folder.
The Makefile MUST have the target `up-codex` that starts the app with the files `compose.yaml` and `compose.codex.yaml`. The file `compose.yaml` MUST publish the port "${GEV_PORT:-4173}:4173" and MUST have no `network_mode` and no Codex mount. The target `up` MUST stay as it is.
Origin: spec-first

#### Scenario: Use the host network `app-container-001`
- **WHEN** a test reads the file `compose.codex.yaml`
- **THEN** the service `gods-eye-view` has `network_mode` with the value "host"
- **AND** the list `ports` is reset to an empty list
- **AND** the setting PORT is "${GEV_PORT:-4173}"

#### Scenario: Mount the Codex folder read-only `app-container-002`
- **WHEN** a test reads the file `compose.codex.yaml`
- **THEN** the service `gods-eye-view` has the volume "${HOME}/.codex:/home/node/.codex:ro"
- **AND** the file lists no other volume for the service

#### Scenario: Start the app with the override `app-container-003`
- **WHEN** a test reads the Makefile
- **THEN** the target `up-codex` runs "docker compose -f compose.yaml -f compose.codex.yaml build" and then "docker compose -f compose.yaml -f compose.codex.yaml up --force-recreate"
- **AND** the list `.PHONY` names `up-codex`

#### Scenario: Keep the default setup `app-container-004`
- **WHEN** a test reads the file `compose.yaml` and the Makefile
- **THEN** the file `compose.yaml` publishes the port "${GEV_PORT:-4173}:4173", and it has no `network_mode` and no ".codex"
- **AND** the target `up` runs "docker compose build" and then "docker compose up --force-recreate"
