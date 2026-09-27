# Fire perimeters specification

## ADDED Requirements

### Requirement: Perimeter snapshot
The source MUST return rows from a valid same-origin response and MUST reject a bad response.
Origin: backfill

#### Scenario: Read a complete snapshot `perimeters-001`
- **WHEN** the source gets a valid response
- **THEN** it returns the rows from the response
- **AND** it uses the same-origin route

#### Scenario: Reject a bad source response `perimeters-002`
- **WHEN** the source gets an HTTP error or a response with no rows
- **THEN** it rejects the response
- **AND** an abort after the body read rejects the response

### Requirement: Incident records
The record parser MUST keep valid polygons and facts and MUST skip bad features.
Origin: backfill

#### Scenario: Keep valid incident facts `perimeters-003`
- **WHEN** the parser gets a valid feature collection
- **THEN** it returns one row for each distinct incident
- **AND** it keeps polygon rings and converts absent optional facts to null

#### Scenario: Skip bad features `perimeters-004`
- **WHEN** the parser gets a bad feature in a valid collection
- **THEN** it skips that feature and keeps the other rows
- **AND** it returns null if the payload has no feature array

### Requirement: Incident card
The card model MUST show available facts, a containment color and an anchor from the largest polygon.
Origin: backfill

#### Scenario: Set the card anchor `perimeters-005`
- **WHEN** an incident has more than one polygon
- **THEN** the anchor is the mean of the outer vertices of the largest polygon

#### Scenario: Show incident facts `perimeters-006`
- **WHEN** the card model gets an incident row
- **THEN** it shows available facts, age and cost
- **AND** it uses the reported containment to set the accent
- **AND** a card with a link is interactive

### Requirement: InciWeb links
The link source MUST match an incident by title and state and MUST check that its page is current.
Origin: backfill

#### Scenario: Match a publication `perimeters-007`
- **WHEN** the catalog has a title that matches an incident
- **THEN** the link uses the state match and the newest id
- **AND** a complex member can use the page of its complex

#### Scenario: Check publication time `perimeters-008`
- **WHEN** a matched page has valid dates
- **THEN** the currency check uses its origin date or recent change date
- **AND** it rejects a page with no usable date

#### Scenario: Read an InciWeb catalog or page `perimeters-009`
- **WHEN** an InciWeb source gets a response
- **THEN** it returns the catalog or page dates when the response is valid
- **AND** it rejects an HTTP error or an abort

### Requirement: Layer entities
The layer MUST draw polygons and MUST keep its source and selection state in step with each snapshot.
Origin: backfill

#### Scenario: Draw the perimeter entities `perimeters-010`
- **WHEN** the layer accepts a snapshot
- **THEN** it makes one filled entity and one fire line for each polygon
- **AND** the legend counts incidents in four containment bands

#### Scenario: Keep current entity identity `perimeters-011`
- **WHEN** a new snapshot has the same incident facts in a new order
- **THEN** the layer keeps the entity objects
- **AND** the analyst records have facts and anchor coordinates but no polygons

#### Scenario: Own the layer life cycle `perimeters-012`
- **WHEN** the layer starts, stops or ends
- **THEN** it shows or hides the data source and the card
- **AND** a late response after stop or end changes no entities

#### Scenario: Select an incident on a map click `perimeters-013`
- **WHEN** a person clicks a perimeter or empty map space
- **THEN** the layer shows the incident card or clears it
- **AND** a pick owned by another layer keeps the card

#### Scenario: Resolve the selected card link `perimeters-014`
- **WHEN** a person selects an incident with a matched page
- **THEN** the card gets a link only after the page passes the time check
- **AND** a page error or a stale page leaves the card without a link

#### Scenario: Stop a late link check `perimeters-015`
- **WHEN** selection, disable or destroy stops a page check
- **THEN** a late result does not add a link to the card

#### Scenario: Keep the perimeter refresh independent `perimeters-016`
- **WHEN** the catalog request has an error or does not end
- **THEN** the perimeter update can complete

### Requirement: Provider proxy
The proxy MUST use fixed upstream routes, a bounded read and a cache for each route.
Origin: backfill

#### Scenario: Page and cache the perimeter feed `perimeters-017`
- **WHEN** a client requests the perimeter route
- **THEN** the proxy reads at most five pages and returns normalized rows
- **AND** a fresh cache prevents another upstream request
- **AND** a failed refresh can return stale rows

#### Scenario: Serve an InciWeb index and page `perimeters-018`
- **WHEN** a client requests an index or a numeric page id
- **THEN** the proxy returns valid data and caches it
- **AND** it rejects an unsafe page redirect

#### Scenario: Reject a bad proxy request `perimeters-019`
- **WHEN** a client sends a bad method, route, id or too many requests
- **THEN** the proxy sends a status and an error without upstream data
- **AND** a bad upstream response gives a sanitized error
