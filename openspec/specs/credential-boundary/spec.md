# credential-boundary Specification

## Purpose
Keep each secret credential on the server. Expose to the browser bundle only the two public credentials and the AIS live settings. Send geocoding requests from the browser only to our server, with no API key.
## Requirements
### Requirement: Browser bundle inputs
The browser build MUST expose to the browser only the two public credentials and the AIS live settings. The two public credentials are the Google Maps browser key and the Cesium ion token, from the parameters of `createBrowserViteConfig()`. The AIS live settings come from environment names that start with `VITE_AIS_LIVE_`.
Origin: spec-first

#### Scenario: Build a fixture and find only the allowed sentinels `credential-boundary-001`
- **WHEN** the test builds a fixture page through the real browser config, with a sentinel value for every credential name
- **THEN** the built output holds the browser-key sentinel, the ion-token sentinel and the `VITE_AIS_LIVE_MAX_ROWS` sentinel, and no other

#### Scenario: Keep an unprefixed `VITE_` value out of the bundle `credential-boundary-002`
- **WHEN** the test puts a `VITE_GEV_PROBE_SECRET` sentinel and a `VITE_AIS_LIVE_MAX_ROWS` sentinel on the environment before the build
- **THEN** the built output has no `VITE_GEV_PROBE_SECRET` sentinel
- **AND** the built output has the `VITE_AIS_LIVE_MAX_ROWS` sentinel

#### Scenario: Keep the `define` list at the two names `credential-boundary-003`
- **WHEN** the test reads `Object.keys()` of the `define` of the browser config
- **THEN** it deep-equals the two `import.meta.env.` names, in order
- **AND** with no parameters, both `define` values are `undefined`

#### Scenario: Keep key-shaped literals out of browser source `credential-boundary-004`
- **WHEN** the test reads `index.html`, every file under `build/`, and every non-test file under `src/`, as text
- **THEN** none of them match a Google key pattern, an OpenAI key pattern or a JWT pattern
- **AND** each pattern matches a synthetic sample built from itself

#### Scenario: Keep the server key out of the bundle and out of `main.js` `credential-boundary-016`
- **WHEN** the environment has a sentinel for `GOOGLE_MAPS_SERVER_API_KEY`, and the test gives the browser sentinel as the `googleApiKey` of the build
- **THEN** the built output holds no sentinel for `GOOGLE_MAPS_SERVER_API_KEY`, and a failed assertion names it
- **AND** `src/main.js`, read as text, gives only `import.meta.env.GOOGLE_MAPS_API_KEY` as `googleApiKey`, and has no text `SERVER_API_KEY`

### Requirement: Credential registry
The key registry MUST mark as client-exposed exactly the names in the `define` of the browser build. Every credential name that the server reads MUST appear in the registry or in `.env.example`.
Origin: spec-first

#### Scenario: The registry and the `define` list agree `credential-boundary-005`
- **WHEN** the test reads every registry entry marked client-exposed, and every name in the `define` of the browser build
- **THEN** the two name sets are equal

#### Scenario: Document each credential name that the server reads `credential-boundary-006`
- **WHEN** the test reads the `.js` and `.mjs` files under `server/`, `scripts/` and `tools/`
- **AND** it finds each name in `process.env.NAME`, `env.NAME`, `env['NAME']`, a destructured `process.env` or `env`, or a quoted string
- **AND** the name ends in `_KEY`, `_TOKEN`, `_SECRET` or `_PASSWORD`
- **THEN** every name found is in the registry, in `.env.example`, or in both
- **AND** the list of names found nowhere is empty
- **AND** the names found include `OPENAI_API_KEY` and `GOOGLE_MAPS_SERVER_API_KEY`

### Requirement: Google geocoding proxy
The server MUST answer geocoding requests on `/api/google/geocode`, with the server-side Google key. It MUST keep that key out of every response. It MUST send no upstream request when it has no Google key.
Origin: spec-first

#### Scenario: Answer a keyless request with no upstream call `credential-boundary-007`
- **WHEN** a client sends `GET /api/google/geocode` and the server has no Google key, on the route directly and on the real dev and preview servers
- **THEN** the response is `200` with `{configured:false, error:null, status:null, results:[]}`, and carries `Cache-Control: no-store`
- **AND** the route makes zero upstream calls

#### Scenario: Send a forward lookup to Google with the selected key `credential-boundary-008`
- **WHEN** a client sends `GET /api/google/geocode?address=...` with an optional `bounds`, with a server key, a browser key, or both
- **THEN** the upstream query carries the given `address` and `bounds`, and the server key when it is not blank, else the browser key
- **AND** the response carries the projected result and no key, with `Cache-Control: no-store`

#### Scenario: Send a reverse lookup to Google `credential-boundary-009`
- **WHEN** a client sends `GET /api/google/geocode?lat=...&lon=...`
- **THEN** the upstream query carries `latlng` built from `lat` and `lon`
- **AND** the response carries the projected result

#### Scenario: Refuse a bad request before any upstream call `credential-boundary-010`
- **WHEN** a request has a fault, or has a method other than `GET`
- **AND** these are faults: neither mode, both modes, a bad `bounds`, and a missing or out-of-range coordinate
- **AND** these are faults: a blank address, and an address of more than 256 characters
- **THEN** with a Google key on the server, a request with a fault answers `400` with zero upstream calls
- **AND** a request with a method other than `GET` answers `405` with zero upstream calls, with or without a key

#### Scenario: Answer an upstream problem and keep the key out of the response `credential-boundary-011`
- **WHEN** an upstream call fails, or the shared rate limiter refuses the request
- **THEN** an HTTP error status from Google gives the same status, with the Google error text or a fixed text when Google gives none
- **AND** the route removes the key from that text
- **AND** when the fetch throws or gets no answer in 5 s, the route answers `502` with a fixed error text
- **AND** a body that is not JSON, larger than 1 MB, or not complete in 5 s gives a fixed error text
- **AND** when the rate limiter refuses the request, the route answers `429` with `Retry-After`
- **AND** every one of these answers carries `Cache-Control: no-store`

#### Scenario: Project a geocoding result to named fields, with a maximum length for each list `credential-boundary-012`
- **WHEN** `projectGeocodeResults(data)` reads an upstream payload
- **THEN** it keeps `status`, and at most 12 results, each with `formatted_address`, at most 20 `address_components`, at most 8 `types` and `geometry`
- **AND** each address component keeps only `long_name` and at most 8 `types`
- **AND** `geometry` keeps only `location`, `bounds` and `viewport`
- **AND** `location` is `{lat, lng}`, and `bounds` and `viewport` are `{northeast, southwest}` boxes of such points
- **AND** a point or a box with a coordinate that is not a finite number gives null
- **AND** a result with no fields gets a default value for each field
- **AND** a `status` that is not a string gives `null`, and a `results` value that is not a list gives an empty list

### Requirement: Browser geocoding
The browser MUST send geocoding requests only to `/api/google/geocode`, with no API key in the request.
Origin: spec-first

#### Scenario: Send a forward lookup to the server route, with a keyless fallback `credential-boundary-013`
- **WHEN** the standalone place search geocodes a query
- **THEN** its request URL is the same-origin `/api/google/geocode`, with `address` and `bounds`, and no `key`
- **AND** a `configured:false` answer gives `{place:null, answered:true}`, and the Photon fallback runs next
- **AND** an HTTP error answer from the route gives `{place:null, answered:false}`, and the Photon fallback runs next

#### Scenario: Send a reverse lookup to the server route, and remember some answers `credential-boundary-014`
- **WHEN** the HTTP geospatial provider reverse-geocodes a coordinate
- **THEN** its fetch URL is `/api/google/geocode?lat=...&lon=...`, with no key. The URL has no key when the page has a browser key too
- **AND** it remembers a `configured:false` answer for the life of the provider, so a later call makes no fetch
- **AND** it remembers an answer that has no HTTP error status, has a Google status and gives no place
- **AND** a later call for the same coordinate, rounded to four decimals, then makes no fetch
- **AND** it does not remember an answer with an HTTP error status or with no Google status, so a later call fetches again
- **AND** a fetch failure, or an answer that is not JSON, makes the reverse lookup reject
- **AND** a configured answer gives the fields `formattedAddress`, `locality`, `region`, `country`, `types`, `labels` and `streetLabels`

#### Scenario: Leave no direct call to the geocoding host of Google `credential-boundary-015`
- **WHEN** the test reads every non-test file under `src/`, as text
- **THEN** none of them match `maps.googleapis.com/maps/api/geocode`
- **AND** exactly one file under `server/` matches it

