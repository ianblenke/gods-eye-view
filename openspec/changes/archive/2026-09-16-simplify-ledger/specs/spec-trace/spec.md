## ADDED Requirements

### Requirement: Removal of a requirement
The trace gate MUST NOT need a test that passes for a scenario of a main requirement that an active change removes. The archive command removes that requirement from the main spec.
Origin: spec-first

#### Scenario: Do not stop for a scenario that an active change removes `spec-trace-054`
- **WHEN** the delta spec of an active change has a requirement under "## REMOVED Requirements"
- **AND** `openspec/specs/` still has that requirement with one or more scenarios
- **THEN** the trace gate does not stop the build for a scenario of that requirement with no test
- **AND** the gate counts that scenario with the scenarios that wait for a test
