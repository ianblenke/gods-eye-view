## MODIFIED Requirements

### Requirement: Browser geocoding
The browser MUST send geocoding requests only to `/api/google/geocode`, with no API key in the request.
Origin: spec-first

#### Scenario: Send a forward lookup to the server route, with a keyless fallback `credential-boundary-013`
- **WHEN** the standalone place search geocodes a query
- **THEN** its request URL is the same-origin `/api/google/geocode`, with `address` and `bounds`, and no `key`
- **AND** a `configured:false` answer gives `{place:null, answered:true}`, and the Photon fallback runs next
- **AND** an HTTP error answer from the route gives `{place:null, answered:false}`, and the Photon fallback runs next

#### Scenario: Send a reverse lookup to the server route, and remember a keyless answer `credential-boundary-014`
- **WHEN** the HTTP geospatial provider reverse-geocodes a coordinate
- **THEN** its fetch URL is `/api/google/geocode?lat=...&lon=...`, with no key. The URL has no key when the page has a browser key too
- **AND** it remembers a `configured:false` answer for the life of the provider, so a later call makes no fetch
- **AND** it remembers an answer that has a Google status and gives no place, so a later call for that coordinate makes no fetch
- **AND** it does not remember an answer with an HTTP error status or with no Google status, so a later call fetches again
- **AND** a configured answer gives the fields `formattedAddress`, `locality`, `region`, `country`, `types`, `labels` and `streetLabels`

#### Scenario: Leave no direct call to the geocoding host of Google `credential-boundary-015`
- **WHEN** the test reads every non-test file under `src/`, as text
- **THEN** none of them match `maps.googleapis.com/maps/api/geocode`
- **AND** exactly one file under `server/` matches it
