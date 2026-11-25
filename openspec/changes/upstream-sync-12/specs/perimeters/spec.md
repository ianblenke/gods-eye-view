## MODIFIED Requirements

### Requirement: Perimeter snapshot
The source MUST return the fires and the pieces of a valid same-origin response and MUST reject a bad response.
Origin: spec-first

#### Scenario: Read a complete snapshot `perimeters-001`
- **WHEN** the source gets a valid response
- **THEN** it returns one fire for each row of the response, with one piece for each polygon of the row
- **AND** it uses the same-origin route

#### Scenario: Reject a bad source response `perimeters-002`
- **WHEN** the source gets an HTTP error or a response with no rows
- **THEN** it rejects the response
- **AND** an abort after the body read rejects the response
