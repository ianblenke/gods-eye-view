## ADDED Requirements

### Requirement: Contacts entry
A Contacts request MUST start the Contacts mode and MUST keep the tracked aircraft.
Origin: backfill

#### Scenario: Enter Contacts with a tracked aircraft `context-contacts-entry-001`
- **WHEN** the context controls get a request for the Contacts mode while the viewer tracks an aircraft
- **THEN** the mode is `flights`
- **AND** the controls turn the military awareness layer on
- **AND** the viewer tracks the same aircraft, and the controls do not turn the flight layer off
