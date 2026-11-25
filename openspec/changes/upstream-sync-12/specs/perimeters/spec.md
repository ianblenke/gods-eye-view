## MODIFIED Requirements

### Requirement: Perimeter snapshot
The source MUST return the fires and the pieces of a valid same-origin response and MUST reject a bad response.
Origin: backfill

#### Scenario: Read a complete snapshot `perimeters-001`
- **WHEN** the source gets a valid response
- **THEN** it returns one fire for each row of the response, with one piece for each polygon of the row
- **AND** it uses the same-origin route

#### Scenario: Reject a bad source response `perimeters-002`
- **WHEN** the source gets an HTTP error or a response with no `rows` list
- **THEN** it rejects the response
- **AND** an abort after the body read rejects the response

### Requirement: Incident card
The card model MUST show available facts, a containment color and an anchor from the largest polygon.
Origin: backfill

#### Scenario: Set the card anchor `perimeters-005`
- **WHEN** an incident has more than one polygon
- **THEN** the anchor is the mean of the outer vertices of the largest polygon

#### Scenario: Show incident facts `perimeters-006`
- **WHEN** the card model gets a fire of the snapshot
- **THEN** it shows available facts, age and cost
- **AND** it uses the reported containment to set the accent
- **AND** a card with a link is interactive

### Requirement: Feed failure cache
The proxy MUST keep the last good feed result and MUST reject bad feed data.
Origin: backfill

#### Scenario: Keep good rows after a feed error `perimeters-021`
- **WHEN** a feed refresh fails or returns a bad payload
- **THEN** the proxy serves the last good rows as stale data if they exist, except old rows of the perimeter route
- **AND** it does not cache a bad payload as an empty result
- **AND** the perimeter route serves stale rows with an age of 24 hours or less, and gives status 502 for older rows
