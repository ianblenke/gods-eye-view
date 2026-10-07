## ADDED Requirements

### Requirement: Fast local checks
The Makefile MUST supply `precheck` and `gates-docs` with the pinned image pattern.
The target `precheck` MUST run all four CI file checks without `gates.mjs`.
The target `gates-docs` MUST pass `CHANGE` and `BASE` to the document mode.
The container copy MUST include the ratchet snapshot when that file exists.
The document target MUST NOT copy any trace file back to the source folder.
Origin: spec-first

#### Scenario: Add fast checks before review `ci-gates-011`
- **WHEN** the Makefile defines `precheck`
- **THEN** the target runs format, import direction, package boundary and layer token checks without the gate command

#### Scenario: Add a document gate target `ci-gates-012`
- **WHEN** the Makefile defines `gates-docs`
- **THEN** the target calls the mode with `CHANGE` and `BASE`
- **AND** the target copies no trace file back to the source folder
- **AND** the copy includes the ratchet snapshot when that file exists
