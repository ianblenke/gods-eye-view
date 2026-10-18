## REMOVED Requirements

### Requirement: Google geocoding proxy
**Reason**: Upstream adds its own geocoding routes in `server/providers/places/google.js`, on the same path. The owner decided on 2026-10-17 to use the upstream routes. This change retires the scenarios `credential-boundary-007` to `credential-boundary-012`.
**Migration**: The upstream routes `/api/google/geocode` and `/api/google/reverse-geocode` answer geocoding requests with the server-side Google key.

### Requirement: Browser geocoding
**Reason**: The upstream browser code sends reverse lookups to `/api/google/reverse-geocode`, and the reverse lookup does not keep earlier answers. This change retires the scenarios `credential-boundary-013` to `credential-boundary-015`.

**Migration**: The requirement "Browser geocoding routes" replaces it. Its scenario `credential-boundary-019` has the text of `credential-boundary-015`. Its scenario `credential-boundary-020` describes the forward lookup of the upstream code. It differs from `credential-boundary-013`. A `configured:false` answer gives `answered:false`, and the place search then does not keep the miss in its own cache. Without a browser key, the search sends no request to the Google route.

### Requirement: Same-site geocode admission
**Reason**: The change removes the fork route. The upstream geocoding routes call `admitSameSite()` first. This change retires the scenarios `credential-boundary-017` and `credential-boundary-018`.
**Migration**: None.

## ADDED Requirements

### Requirement: Browser geocoding routes
The browser MUST send Google geocoding requests only to `/api/google/geocode` and `/api/google/reverse-geocode`, with no API key in the request. When the forward route answers `configured:false` or an HTTP error, the place search MUST ask the next geocoder.
Origin: spec-first

#### Scenario: Leave no direct call to the geocoding host of Google `credential-boundary-019`
- **WHEN** the test reads every non-test file under `src/`, as text
- **THEN** none of them match `maps.googleapis.com/maps/api/geocode`
- **AND** exactly one file under `server/` matches it

#### Scenario: Send a forward lookup to the server route, with a keyless fallback `credential-boundary-020`
- **WHEN** the standalone place search geocodes a query
- **THEN** with a browser key, its request URL is the same-origin `/api/google/geocode`, with `address` and `bounds`, and no `key`
- **AND** without a browser key, it sends no request to that route, and the Google step gives `{place:null, answered:true}`
- **AND** a `configured:false` answer gives `{place:null, answered:false}`, and the Photon fallback runs next
- **AND** an HTTP error answer from the route gives `{place:null, answered:false}`, and the Photon fallback runs next
- **AND** after the Google step gives `answered:false`, the place search does not keep the miss in its own cache
- **AND** the next search with the same query then asks the route again
