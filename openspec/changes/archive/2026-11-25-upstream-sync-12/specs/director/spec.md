## ADDED Requirements

### Requirement: Resume inside a flight
The director MUST start a resumed run at the given moment of a camera flight.
Origin: backfill

#### Scenario: Continue from the same moment of the path and the clock `director-111`
- **WHEN** a caller starts one scene with a progress value that falls inside a flight
- **THEN** the scene clock starts at that moment, in the shot of that moment
- **AND** the camera starts between the two shots of the flight
- **AND** the run ends on the last shot
- **AND** the run starts no new flight from the start of the shot of that moment
