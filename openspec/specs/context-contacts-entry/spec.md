# context-contacts-entry Specification

## Purpose
A Contacts request keeps the aircraft that the viewer tracks.
## Requirements
### Requirement: Contacts entry
A Contacts request MUST start the Contacts mode and MUST keep the tracked aircraft.
Origin: backfill

#### Scenario: Start Contacts with a tracked aircraft `context-contacts-entry-001`
- **WHEN** the context controls get a request for the Contacts mode while the viewer tracks an aircraft
- **THEN** the stored Contacts mode is `flights`
- **AND** the controls enable the military awareness layer
- **AND** the viewer tracks the same aircraft, and the controls do not disable the flight layer

