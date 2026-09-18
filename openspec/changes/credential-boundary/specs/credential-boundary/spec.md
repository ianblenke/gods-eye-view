## ADDED Requirements

### Requirement: Browser bundle inputs
The browser build MUST expose only three inputs to the browser: the Google Maps browser key, the Cesium ion token and the AIS live knobs. Each comes from an explicit input.
Origin: spec-first

#### Scenario: Build a fixture and find only the allowed sentinels `credential-boundary-001`
- **WHEN** the test builds a fixture page through the real browser config, with a sentinel value set for every credential name
- **THEN** the built output holds the browser-key sentinel, the ion-token sentinel and the `VITE_AIS_LIVE_MAX_ROWS` sentinel, and no other

#### Scenario: Keep an unprefixed `VITE_` value out of the bundle `credential-boundary-002`
- **WHEN** a `VITE_GEV_PROBE_SECRET` sentinel and a `VITE_AIS_LIVE_MAX_ROWS` sentinel are both set on the environment before the build
- **THEN** the built output has no `VITE_GEV_PROBE_SECRET` sentinel
- **AND** the built output has the `VITE_AIS_LIVE_MAX_ROWS` sentinel

#### Scenario: Keep the define list at the two names `credential-boundary-003`
- **WHEN** the test reads `Object.keys()` of the browser config's `define`
- **THEN** it deep-equals the two `import.meta.env.` names, in order
- **AND** with no inputs given, both names define to `undefined`

#### Scenario: Keep key-shaped literals out of browser source `credential-boundary-004`
- **WHEN** the test reads `index.html`, every file under `build/`, and every non-test file under `src/`, as text
- **THEN** none of them match a Google key pattern, an OpenAI key pattern or a JWT pattern
- **AND** each pattern matches a synthetic sample built from itself

#### Scenario: Keep the server key out of the bundle and out of the global `credential-boundary-016`
- **WHEN** `GOOGLE_MAPS_SERVER_API_KEY` carries a sentinel on the environment and the browser sentinel is given as the build's `googleApiKey`
- **THEN** the built output holds no sentinel for `GOOGLE_MAPS_SERVER_API_KEY`, and a failed assertion names it
- **AND** `src/main.js`, read as text, passes only `import.meta.env.GOOGLE_MAPS_API_KEY` as `googleApiKey`, and has no text `SERVER_API_KEY`

### Requirement: Credential registry
The key registry MUST mark as client-exposed exactly the names the browser build defines. Every credential name the server reads MUST appear in the registry or in `.env.example`.
Origin: spec-first

#### Scenario: The registry and the define list agree `credential-boundary-005`
- **WHEN** the test reads every registry entry marked client-exposed, and every name in the browser build's `define`
- **THEN** the two name sets are equal

#### Scenario: Every server credential read is documented `credential-boundary-006`
- **WHEN** the test reads `process.env.NAME` and `env.NAME` under `server/`, `scripts/` and `tools/`, for a name ending in `_KEY`, `_TOKEN`, `_SECRET` or `_PASSWORD`
- **THEN** every name found is in the registry, in `.env.example`, or in both
- **AND** the list of names found nowhere is empty

### Requirement: Google geocoding proxy
The server MUST answer geocoding requests on `/api/google/geocode`, with the server-side Google key. It MUST keep that key out of every response. It MUST send no upstream request when no key is set.
Origin: spec-first

#### Scenario: Answer a keyless request with no upstream call `credential-boundary-007`
- **WHEN** a client sends `GET /api/google/geocode` and no Google key is configured, on the route directly and on the real dev and preview servers
- **THEN** the response is `200` with `{configured:false, error:null, status:null, results:[]}`, and carries `Cache-Control: no-store`
- **AND** the route makes zero upstream calls

#### Scenario: Forward an address lookup with the resolved key `credential-boundary-008`
- **WHEN** a client sends `GET /api/google/geocode?address=...` with an optional `bounds`, under each row of the server-key/browser-key selection table
- **THEN** the upstream query carries the given `address` and `bounds`, and the `key` the table names
- **AND** the response carries the projected result and no key, with `Cache-Control: no-store`

#### Scenario: Reverse a coordinate lookup with the resolved key `credential-boundary-009`
- **WHEN** a client sends `GET /api/google/geocode?lat=...&lon=...`
- **THEN** the upstream query carries `latlng` built from `lat` and `lon`
- **AND** the response carries the projected result

#### Scenario: Refuse malformed input before any upstream call `credential-boundary-010`
- **WHEN** a request names neither mode, both modes, a malformed `bounds`, an out-of-range coordinate, an address past 256 characters, or a non-GET method
- **THEN** a bad-input request answers `400` and a wrong-method request answers `405`, both with zero upstream calls

#### Scenario: Answer upstream trouble without leaking the key `credential-boundary-011`
- **WHEN** the upstream answers a non-ok status, the fetch throws, the body is over the size cap, or the shared rate limiter refuses the request
- **THEN** a non-ok status passes its error through with no key
- **AND** a thrown fetch answers `502`
- **AND** an over-cap body answers with an error, not a thrown exception
- **AND** a refused request answers `429` with `Retry-After`
- **AND** every one of these answers carries `Cache-Control: no-store`

#### Scenario: Project a geocoding result to capped, named fields `credential-boundary-012`
- **WHEN** `projectGeocodeResults(data)` reads an upstream payload
- **THEN** it keeps `status`, and up to 12 results, each with `formatted_address`, up to 20 `address_components`, up to 8 `types` and `geometry`
- **AND** a malformed input gives `{status:null, results:[]}`

### Requirement: Browser geocoding
The browser MUST send geocoding requests only to `/api/google/geocode`, with no API key in the request.
Origin: spec-first

#### Scenario: Send a forward lookup to the server route, with a keyless fallback `credential-boundary-013`
- **WHEN** the standalone place search geocodes a query
- **THEN** its request URL is the same-origin `/api/google/geocode`, with `address` and `bounds`, and no `key`
- **AND** a `configured:false` answer counts as no verdict, and the Photon fallback runs next

#### Scenario: Send a reverse lookup to the server route, and remember a keyless answer `credential-boundary-014`
- **WHEN** the voice reverse-lookup geocodes a coordinate
- **THEN** its fetch URL is `/api/google/geocode?lat=...&lon=...`, built with no global key
- **AND** a `configured:false` answer is remembered for the page's life, so a later call makes no fetch
- **AND** a configured answer gives the same place shape as before this change

#### Scenario: Leave no direct call to Google's geocoding host `credential-boundary-015`
- **WHEN** the test reads every non-test file under `src/`, as text
- **THEN** none of them match `maps.googleapis.com/maps/api/geocode`
- **AND** exactly one file under `server/` matches it
