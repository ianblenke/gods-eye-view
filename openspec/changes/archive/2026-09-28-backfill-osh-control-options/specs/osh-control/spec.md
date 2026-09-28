## ADDED Requirements

### Requirement: Command field controls
The confirmation panel MUST give the owner a real, selectable choice for a boolean command field.
Origin: backfill

#### Scenario: Render a real true and false choice for a boolean field `osh-control-036`
- **WHEN** the confirmation panel builds the input of a command field of type `boolean`
- **THEN** the input is a `select` element with one option for `false` and one option for `true`
- **AND** the selected value at build time is `false`
