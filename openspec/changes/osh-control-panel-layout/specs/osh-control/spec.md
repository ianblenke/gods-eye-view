## ADDED Requirements

### Requirement: Command group layout
The command view MUST group each command's own fields and its send button under that command's own name.
Origin: spec-first

#### Scenario: Group each command under its own name `osh-control-037`
- **WHEN** the command view builds the controls of one command
- **THEN** it wraps that command's fields and its send button in one `fieldset` element
- **AND** the `fieldset`'s first child is a `legend` element with the command's own name
- **AND** the send button keeps the command's own name as its own text

#### Scenario: Put one field on its own line `osh-control-038`
- **WHEN** a command has more than one field
- **THEN** each field's label and input are the only content of their own line inside the command's group
