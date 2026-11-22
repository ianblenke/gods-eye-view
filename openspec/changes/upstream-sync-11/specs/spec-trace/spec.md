## ADDED Requirements

### Requirement: Scenario that a modified requirement drops
The trace gate MUST NOT need a passing test for a scenario that a modified requirement of an active change drops. The archive command removes that scenario from the main spec.
Origin: spec-first

#### Scenario: Do not stop for a scenario that a modified requirement drops `spec-trace-055`
- **WHEN** the delta spec of an active change has a modified requirement
- **AND** `openspec/specs/` has a scenario of that requirement that the delta spec does not list
- **THEN** the trace gate does not stop the build for that scenario when it has no test
- **AND** the gate still needs a test for each scenario that the delta spec lists
