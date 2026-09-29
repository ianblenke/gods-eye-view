## ADDED Requirements

### Requirement: Command field controls
The command view MUST let the owner select `true` or `false` for a command field of type `boolean`.
Origin: backfill

#### Scenario: Build a true and false option for a boolean field `osh-control-036`
- **WHEN** the command view builds the input of a command field of type `boolean`
- **THEN** the input is a `select` element with one option for `false` and one option for `true`
- **AND** the selected value at build time is `false`
