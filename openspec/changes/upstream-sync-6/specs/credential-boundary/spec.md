## REMOVED Requirements

### Requirement: Google geocoding proxy
**Reason**: Upstream adds its own geocoding routes in `server/providers/places/google.js`, on the same path. The owner decided on 2026-10-17 to use the upstream routes. This change retires the scenarios `credential-boundary-007` to `credential-boundary-012`.
**Migration**: The upstream routes `/api/google/geocode` and `/api/google/reverse-geocode` answer geocoding requests with the server-side Google key.

### Requirement: Browser geocoding
**Reason**: The upstream browser code sends reverse lookups to `/api/google/reverse-geocode`, and it does not keep earlier answers. This change retires the scenarios `credential-boundary-013` to `credential-boundary-015`.
**Migration**: The requirement "Browser geocoding routes" replaces it. Its scenario `credential-boundary-019` has the text of `credential-boundary-015`.

### Requirement: Same-site geocode admission
**Reason**: The fork route goes away. The upstream geocoding routes call `admitSameSite()` first. This change retires the scenarios `credential-boundary-017` and `credential-boundary-018`.
**Migration**: None.

## ADDED Requirements

### Requirement: Browser geocoding routes
The browser MUST send geocoding requests only to `/api/google/geocode` and `/api/google/reverse-geocode`, with no API key in the request.
Origin: spec-first

#### Scenario: Leave no direct call to the geocoding host of Google `credential-boundary-019`
- **WHEN** the test reads every non-test file under `src/`, as text
- **THEN** none of them match `maps.googleapis.com/maps/api/geocode`
- **AND** exactly one file under `server/` matches it
