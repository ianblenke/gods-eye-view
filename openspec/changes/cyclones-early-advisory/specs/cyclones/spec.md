## ADDED Requirements

### Requirement: Advisory time window of the status route
`parseCycloneStatus()` of the server MUST accept an advisory time and a position time that are up to 90 minutes ahead of its clock.
It MUST reject a time that is more than 90 minutes ahead.
Origin: spec-first

#### Scenario: Accept a time up to 90 minutes ahead `cyclones-026`
- **WHEN** `parseCycloneStatus()` gets a status whose advisory time `forecastAdvisory.issuance` or whose position time `lastUpdate` is 26 minutes or 90 minutes ahead of its clock
- **THEN** it gives the storm
- **AND** the storm has the time as `issuedAt` or as `positionAt`

#### Scenario: Reject a time more than 90 minutes ahead `cyclones-027`
- **WHEN** `parseCycloneStatus()` gets a status whose advisory time or position time is 90 minutes and 1 millisecond ahead of its clock
- **THEN** it throws the error `invalid_cyclone_data`
