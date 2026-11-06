# up42-source Specification

## Purpose
Describe how the server searches the UP42 archive for scene facts while it keeps credentials on the server.
## Requirements
### Requirement: Provider routes

The plugin MUST install the status and scenes routes in both Vite hooks and pass other paths to the next handler.

Origin: spec-first

#### Scenario: Provider routes `up42-source-001`

- **WHEN** install the plugin
- **THEN** both Vite hooks install the two exact routes
- **AND** paths below either route pass to the next handler

### Requirement: Status

The status route MUST give only the credential state, with no upstream call.

Origin: spec-first

#### Scenario: Status `up42-source-002`

- **WHEN** read the status
- **THEN** GET gives 200 and configured is true only when both credential values contain non-space text
- **AND** another method gives 405 after the same-site check

### Requirement: Methods and step order

The scenes route MUST stop at the first failed step in the order that the design names.

Origin: spec-first

#### Scenario: Methods and step order `up42-source-003`

- **WHEN** send a method other than POST
- **THEN** the route gives 405 before any other check
- **AND** a valid POST checks the same site before it uses the rate limit

### Requirement: Same site

The scenes route MUST use the shared same-site rules and accept only the exact JSON content type.

Origin: spec-first

#### Scenario: Same site `up42-source-004`

- **WHEN** send a POST from another origin or with proxy headers or another content type
- **THEN** the route gives 403 with error cross_origin and makes no upstream call
- **AND** matching HTTP and HTTPS origins pass with their corresponding socket protocol

### Requirement: Rate limit

The scenes route MUST allow six admitted requests in each 60000 ms window.

Origin: spec-first

#### Scenario: Rate limit `up42-source-005`

- **WHEN** send seven admitted requests in one minute
- **THEN** the seventh gives 429 with error rate_limited and Retry-After 60
- **AND** bad bodies and kept answers consume the limit, and refused origins do not

### Requirement: Body

The route MUST read at most 4096 bytes and accept only an object with the named request keys.

Origin: spec-first

#### Scenario: Body `up42-source-006`

- **WHEN** send invalid JSON, another body type, an unknown key, excess bytes or a broken body stream
- **THEN** the route gives 400 with error bad_body
- **AND** a body of exactly 4096 bytes passes this step

### Requirement: Box

The box MUST have four finite numbers within the longitude and latitude limits, with west below east and south below north.

Origin: spec-first

#### Scenario: Box `up42-source-007`

- **WHEN** check the box
- **THEN** invalid boxes give 400 with error bad_bbox
- **AND** the limits include longitude -180 and 180 and latitude -90 and 90

### Requirement: Area

The route MUST accept an area of at most 2500 square kilometres on a sphere of radius 6371008.8 metres.

Origin: spec-first

#### Scenario: Area `up42-source-008`

- **WHEN** send a box above the area limit
- **THEN** the route gives 400 with error area_too_large and maxKm2 2500 before the date check
- **AND** a smaller box passes

### Requirement: Dates

The dates MUST be valid YYYY-MM-DD calendar dates in order. The window MUST have at most 92 inclusive days and no future end.

Origin: spec-first

#### Scenario: Dates `up42-source-009`

- **WHEN** check the date window
- **THEN** invalid dates give 400 with error bad_dates
- **AND** 92 inclusive days, one day and an end on the current UTC date pass

### Requirement: Options

The route MUST accept only an integer maxCloud from 0 to 100. A collections filter MUST contain a non-empty array of unique collection names.

Origin: spec-first

#### Scenario: Options `up42-source-010`

- **WHEN** send optional filters
- **THEN** bad forms give 400 with error bad_options
- **AND** absent filters stay absent and each selected collection must exist in the fetched map or give bad_collections with 400

### Requirement: Credential gate

The route MUST refuse a valid search without both credentials before it reads the store.

Origin: spec-first

#### Scenario: Credential gate `up42-source-011`

- **WHEN** remove either credential from a server with a kept answer
- **THEN** the route gives 503 with error no_credentials and keyRequired true
- **AND** the route makes no upstream call

### Requirement: Password grant

The client MUST send the trimmed user name and unchanged password only in a form body to the fixed token URL.

Origin: spec-first

#### Scenario: Password grant `up42-source-012`

- **WHEN** request a token with fake credentials
- **THEN** the body sets grant_type to password and client_id to up42-api with the form content type
- **AND** token status 400 or 401 gives 403 with error credentials_rejected and keyRejected true

### Requirement: Token cache

The client MUST share one login and reuse its token until 60 seconds before expiry. It MUST retry an API 401 once with a new token.

Origin: spec-first

#### Scenario: Token cache `up42-source-013`

- **WHEN** run concurrent API requests and advance the clock to the token boundary
- **THEN** one login serves concurrent calls and a fresh login occurs at the boundary
- **AND** an API 401 causes one login and one retry, while a second 401 gives upstream_failed

### Requirement: Collection map

The client MUST fetch the public archive collection list without credentials and keep a valid map for six hours.

Origin: spec-first

#### Scenario: Collection map `up42-source-014`

- **WHEN** read the collection list
- **THEN** the map selects the HOST role and the THUMBNAIL_AVAILABLE integration
- **AND** invalid rows are skipped, host names must match ^[a-z0-9][a-z0-9-]{0,63}$ and an empty or invalid list gives upstream_failed

### Requirement: Host search

The client MUST group wanted collections by host and send one search for each host with at most four calls at one time.

Origin: spec-first

#### Scenario: Host search `up42-source-015`

- **WHEN** search distinct hosts with optional cloud and collection filters
- **THEN** each POST has collections, the RFC 3339 interval, a closed longitude-latitude box Polygon and limit 50
- **AND** query.cloudCoverage.LTE exists only when maxCloud exists, and no other request body fields exist

### Requirement: Incomplete answer

The client MUST mark an answer as truncated when it omits hosts above ten or a host has a next link.

Origin: spec-first

#### Scenario: Incomplete answer `up42-source-016`

- **WHEN** search eleven hosts or read a page with a next link
- **THEN** at most ten hosts receive a call and truncated is true
- **AND** a complete page below the host cap gives truncated false and no next request

### Requirement: Host failures

The client MUST skip failed hosts and return their names only in failedHosts.

Origin: spec-first

#### Scenario: Host failures `up42-source-017`

- **WHEN** search a mix of good and failed hosts
- **THEN** the answer contains all good scenes and the failed host names
- **AND** all failed hosts give upstream_failed with 502, except that a timeout gives search_timeout with 504

### Requirement: Transport failures

The client MUST cap response bodies at 4194304 bytes and refuse redirects. It MUST stop each call after 15000 ms through its body.

Origin: spec-first

#### Scenario: Transport failures `up42-source-018`

- **WHEN** send a redirect, bad JSON, excess bytes, a network failure or a timeout through the fake fetch
- **THEN** the client gives fixed failure names without the upstream error text
- **AND** the timer clears only after the body ends and an invalid token document gives upstream_failed

### Requirement: Scene fields

The route MUST give only the specified scene fields from the named upstream fields.

Origin: spec-first

#### Scenario: Scene fields `up42-source-019`

- **WHEN** read valid features with distinct field values
- **THEN** each scene has id, host, collection, start, end, footprint, resolutionM, provider, cloudPercent and thumbnail
- **AND** times use start_datetime and end_datetime else datetime; provider uses producer else constellation; thumbnail comes from the collection map

### Requirement: Dropped features

The route MUST drop a feature with an invalid identity, collection, time or Polygon and count it in dropped.

Origin: spec-first

#### Scenario: Dropped features `up42-source-020`

- **WHEN** read good and invalid features
- **THEN** only good features remain and dropped equals the invalid feature count
- **AND** ids have 1 to 128 ASCII letters, digits, underscores, hyphens or dots; invalid optional numbers give null

### Requirement: Answer store

The route MUST keep at most 32 good answers for less than ten minutes. It MUST share identical searches that are in flight.

Origin: spec-first

#### Scenario: Answer store `up42-source-021`

- **WHEN** repeat a search before and at the store boundary, with distinct filters and concurrent calls
- **THEN** only identical current answers use cached true and no new daily count
- **AND** expired answers and changed filters start new work, the oldest excess answer leaves the store, and failures do not enter it

### Requirement: Daily count

The route MUST count each new search before its first upstream call against a UTC daily limit from 1 to 1000.

Origin: spec-first

#### Scenario: Daily count `up42-source-022`

- **WHEN** reach the daily limit with good or failed searches
- **THEN** a new search gives 429 with error budget, used and limit, while a kept answer still passes
- **AND** the default is 20 for invalid settings and the next UTC day starts a new count

### Requirement: Secret output

The route MUST keep passwords and tokens out of answers, thrown errors and console output.

Origin: spec-first

#### Scenario: Secret output `up42-source-023`

- **WHEN** capture answers and console output for good searches and failures with fake secrets
- **THEN** no captured text contains the fake password or fake tokens
- **AND** each new search writes only a fixed success or failure line and no kept answer writes a line

### Requirement: Read-only requests

The provider MUST send only the three literal allowed request forms and contain none of the forbidden source literals.

Origin: spec-first

#### Scenario: Read-only requests `up42-source-024`

- **WHEN** record requests for good searches and failures and inspect all six provider source files
- **THEN** only POST token, GET public collections and POST host archive search occur
- **AND** the source contains none of /v2/orders, quotation, PATCH, download-url, eulas or execution

