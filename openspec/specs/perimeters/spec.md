# perimeters Specification

## Purpose
Show fire perimeters from the WFIGS feed. Link an incident card to InciWeb when it applies. Own the perimeter entities and their selection on the globe.
## Requirements
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
- **THEN** the page age check uses its origin date or recent change date
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
- **AND** a late response after the layer stops or ends changes no entities

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

#### Scenario: Page the perimeter feed `perimeters-017`
- **WHEN** a client requests the perimeter route
- **THEN** the proxy reads at most five pages and returns normalized rows
- **AND** the transfer limit property controls the next page read

#### Scenario: Serve an InciWeb index `perimeters-018`
- **WHEN** a client requests the index
- **THEN** the proxy returns rows when the response is an array
- **AND** the proxy rejects a response that is not an array

#### Scenario: Reject a bad proxy request `perimeters-019`
- **WHEN** a client sends a bad method, route, id or too many requests
- **THEN** the proxy sends a status and an error without upstream data
- **AND** a bad upstream response gives a sanitized error

### Requirement: Feed request bounds
The proxy MUST read no more than five feed pages and MUST set a size limit for each response.
Origin: backfill

#### Scenario: Page and bound the WFIGS feed `perimeters-020`
- **WHEN** the feed has more rows after a page
- **THEN** the proxy reads up to five pages and combines the normalized rows
- **AND** a false transfer flag stops the next page
- **AND** a fresh cache stops a new fetch
- **AND** a body above the feed size limit gives status 502 and stops the body read

### Requirement: Feed failure cache
The proxy MUST keep the last good feed result and MUST reject bad feed data.
Origin: backfill

#### Scenario: Keep good rows after a feed error `perimeters-021`
- **WHEN** a feed refresh fails or returns a bad payload
- **THEN** the proxy serves the last good rows as stale data if they exist
- **AND** it does not cache a bad payload as an empty result

### Requirement: Shared upstream work
The proxy MUST share one active request for each route.
Origin: backfill

#### Scenario: Share concurrent requests `perimeters-022`
- **WHEN** two clients request the same route at the same time
- **THEN** the proxy starts one upstream operation for that route

### Requirement: Request input
The proxy MUST check the method and publication id before it fetches upstream data.
Origin: backfill

#### Scenario: Reject bad input before a fetch `perimeters-023`
- **WHEN** a client sends a bad publication id or a method other than GET
- **THEN** the proxy sends status 400 or 405 and makes no upstream request

### Requirement: InciWeb index bounds
The proxy MUST use a fixed POST for the index and MUST limit its response size.
Origin: backfill

#### Scenario: Cache and bound the index `perimeters-024`
- **WHEN** a client requests the InciWeb index
- **THEN** the proxy sends the fixed POST body and caches the rows for one hour
- **AND** it can serve stale rows after an upstream error
- **AND** an index body above its size limit gives status 502

### Requirement: Incident page cache
The proxy MUST cache a page only if it has a valid origin or change time and MUST limit the page body size.
Origin: backfill

#### Scenario: Cache and bound an incident page `perimeters-025`
- **WHEN** a client requests an incident page
- **THEN** the proxy accepts a direct page with at least one valid time
- **AND** it caches a valid page for 30 minutes and removes the oldest entry above 256 entries
- **AND** it does not cache a page with no valid time
- **AND** a page body above its size limit gives status 502 and stops the body read

### Requirement: Client rate limit
The proxy MUST count requests for each client on its routes.
Origin: backfill

#### Scenario: Limit one client `perimeters-026`
- **WHEN** a client sends more than 60 feed requests in one minute
- **THEN** the proxy sends status 429 to that client
- **AND** another client can read the cache

### Requirement: Publication redirects
The proxy MUST check a publication redirect before it reads the page.
Origin: backfill

#### Scenario: Follow a safe page redirect `perimeters-027`
- **WHEN** a publication route returns a redirect
- **THEN** the proxy stops the redirect body and uses one abort signal for both requests
- **AND** it fetches a safe location through HTTPS
- **AND** it rejects an unsafe location before a second fetch

