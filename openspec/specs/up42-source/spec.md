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
- **THEN** the route gives 403 with the error cross_origin and makes no upstream call
- **AND** HTTP and HTTPS origins pass when each origin matches the request host and socket protocol

### Requirement: Rate limit

The scenes route MUST allow six admitted requests in each 60000 ms window.

Origin: spec-first

#### Scenario: Rate limit `up42-source-005`

- **WHEN** send seven admitted requests in one minute
- **THEN** the seventh gives 429 with the error rate_limited and Retry-After 60
- **AND** bad bodies and kept answers consume the limit, and refused origins do not

### Requirement: Body

The route MUST keep at most 4096 request bytes and accept only an object with the named request keys.

Origin: spec-first

#### Scenario: Body `up42-source-006`

- **WHEN** send invalid JSON, another body type, an unknown key, excess bytes or a broken body stream
- **THEN** the route gives 400 with the error bad_body
- **AND** a body of exactly 4096 bytes passes this step

#### Scenario: Excess body response `up42-source-027`

- **WHEN** an HTTP client sends more than 4096 bytes but no more than 65536 bytes
- **THEN** the route discards the excess bytes and gives 400 with the error bad_body
- **AND** the reader returns null when the total exceeds 65536 bytes

### Requirement: Box

The box MUST have four finite numbers within the longitude and latitude limits, with west below east and south below north.

Origin: spec-first

#### Scenario: Box `up42-source-007`

- **WHEN** check the box
- **THEN** invalid boxes give 400 with the error bad_bbox
- **AND** the limits include longitude -180 and 180 and latitude -90 and 90

### Requirement: Area

The route MUST accept an area of at most 2500 square kilometres on a sphere of radius 6371008.8 metres.

Origin: spec-first

#### Scenario: Area `up42-source-008`

- **WHEN** send a box above the area limit
- **THEN** the route gives 400 with the error area_too_large and maxKm2 2500 before the date check
- **AND** a smaller box passes

### Requirement: Dates

The dates MUST be valid YYYY-MM-DD calendar dates in order. The window MUST have at most 92 inclusive days and no future end.

Origin: spec-first

#### Scenario: Dates `up42-source-009`

- **WHEN** check the date window
- **THEN** invalid dates give 400 with the error bad_dates
- **AND** 92 inclusive days, one day and an end on the current UTC date pass

### Requirement: Options

The route MUST accept only an integer maxCloud from 0 to 100. A collections filter MUST contain a non-empty array of unique collection names.

Origin: spec-first

#### Scenario: Options `up42-source-010`

- **WHEN** send optional filters
- **THEN** bad forms give 400 with the error bad_options
- **AND** absent filters stay absent and each selected collection must exist in the fetched map or give bad_collections with 400

### Requirement: Credential gate

The route MUST refuse a valid search without both credentials before it reads the store.

Origin: spec-first

#### Scenario: Credential gate `up42-source-011`

- **WHEN** remove either credential from a server with a kept answer
- **THEN** the route gives 503 with the error no_credentials and keyRequired true
- **AND** the route makes no upstream call

### Requirement: Password grant

The client MUST send the trimmed user name and unchanged password only in a form body to the fixed token URL.

Origin: spec-first

#### Scenario: Password grant `up42-source-012`

- **WHEN** request a token with fake credentials
- **THEN** the body sets grant_type to password and client_id to up42-api with the form content type
- **AND** token status 400 or 401 gives 403 with the error credentials_rejected and keyRejected true

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
- **AND** the client skips invalid rows, host names must match ^[a-z0-9][a-z0-9-]{0,63}$ and an empty or invalid list gives upstream_failed

### Requirement: Host search

The client MUST group wanted collections in collection-map order and send at most four search calls at one time.

Origin: spec-first

#### Scenario: Host search `up42-source-015`

- **WHEN** search distinct hosts with optional cloud and collection filters in an order that differs from the collection map
- **THEN** each POST has collections, the RFC 3339 interval, a closed longitude-latitude box Polygon and limit 50
- **AND** query.cloudCoverage.LTE exists only when maxCloud exists, and no other request body fields exist
- **AND** the collection map sets the host order and collection order; each call counts against concurrency

### Requirement: Incomplete answer

The client MUST send at most 24 search calls and mark an answer as truncated when it omits excess calls or reads a next link.

Origin: spec-first

#### Scenario: Incomplete answer `up42-source-016`

- **WHEN** a search needs 25 calls or a page has a next link
- **THEN** at most 24 calls receive a request and truncated is true
- **AND** complete pages within the call cap give truncated false and no next request

### Requirement: Host failures

The client MUST keep scenes from good calls and list each host once in failedHosts only when all its sent calls fail.

Origin: spec-first

#### Scenario: Host failures `up42-source-017`

- **WHEN** search a mix of good and failed hosts
- **THEN** the answer contains all good scenes and the names of hosts whose calls all failed
- **AND** a credential rejection gives credentials_rejected with 403
- **AND** if all hosts fail without a credential rejection, a timeout gives search_timeout with 504 and other failures give upstream_failed with 502

### Requirement: Transport failures

The client MUST cap response bodies at 4194304 bytes and refuse redirects. It MUST stop each call after 15000 ms through its body.

Origin: spec-first

#### Scenario: Transport failures `up42-source-018`

- **WHEN** send a redirect, bad JSON, excess bytes, a network failure or a timeout through the fake fetch
- **THEN** the client gives fixed failure names without the upstream error text
- **AND** the timer clears only after the body ends and an invalid token document gives upstream_failed

#### Scenario: Error body discard `up42-source-026`

- **WHEN** a non-200 response has a body that does not end
- **THEN** the client cancels the body before it clears the timer and the call ends with the fixed failure
- **AND** a cancel error does not change the fixed failure

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

#### Scenario: Concurrent identical requests `up42-source-025`

- **WHEN** two identical requests miss the store at the same time
- **THEN** the route starts one upstream search and adds one daily count
- **AND** both requests receive the same scenes and the second answer has cached true

### Requirement: Daily count

The route MUST count each new search before its first upstream call against a UTC daily limit from 1 to 1000.

Origin: spec-first

#### Scenario: Daily count `up42-source-022`

- **WHEN** reach the daily limit with good or failed searches
- **THEN** a new search gives 429 with the error budget and the fields used and limit, while a kept answer still passes
- **AND** the default is 20 for invalid settings and the next UTC day starts a new count

### Requirement: Secret output

The route MUST keep passwords and tokens out of answers, thrown errors and console output.

Origin: spec-first

#### Scenario: Secret output `up42-source-023`

- **WHEN** capture answers and all console methods for good searches and failures with fake secrets
- **THEN** no captured text contains the fake user name, password or tokens
- **AND** each new search writes only fixed log forms with fixed kinds and checked host names; no kept answer writes a line

### Requirement: Read-only requests

The provider MUST send only the three literal allowed request forms and contain none of the forbidden source literals.

Origin: spec-first

#### Scenario: Read-only requests `up42-source-024`

- **WHEN** record requests for good searches and failures and inspect all six provider source files
- **THEN** only POST token, GET public collections and POST host archive search occur
- **AND** the source contains none of /v2/orders, quotation, PATCH, download-url, eulas or execution

### Requirement: Single collection calls

The client MUST send one call per wanted collection for vantor-3d and vexcel-v2 and merge their good scenes.

Origin: spec-first

#### Scenario: Split restricted hosts `up42-source-028`

- **WHEN** select two collections of vantor-3d and two collections of vexcel-v2 with a normal host
- **THEN** each restricted call body has exactly one collection with its exact name
- **AND** the normal host receives one call with both its collections
- **AND** scenes from both calls of each restricted host remain in the answer

#### Scenario: Search all archive hosts `up42-source-029`

- **WHEN** the collection map has the 15 probe hosts with three vantor-3d collections and five vexcel-v2 collections
- **THEN** all 15 hosts receive their calls, for a total of 21 calls
- **AND** complete pages give truncated false and an empty failedHosts array

#### Scenario: Keep a partial host `up42-source-030`

- **WHEN** one call of a restricted host fails and another call succeeds
- **THEN** the answer keeps the good scenes and sets truncated true
- **AND** failedHosts does not contain that host

#### Scenario: List a failed host once `up42-source-031`

- **WHEN** all calls of a restricted host fail with a good host
- **THEN** failedHosts contains the restricted host once and the answer keeps the good scenes
- **AND** an unknown host with the same one-collection rule has a normal host failure

#### Scenario: Count concurrent calls `up42-source-032`

- **WHEN** a restricted host needs five calls with another host
- **THEN** four calls start before a gate opens and no fifth call starts
- **AND** all six calls finish with at most four calls active at one time

### Requirement: Search call count

The route MUST add one daily count per new search regardless of its upstream search call count.

Origin: spec-first

#### Scenario: Count one accepted search `up42-source-033`

- **WHEN** a new search needs 21 calls and the daily limit is one
- **THEN** the answer has budget used 1 and limit 1
- **AND** a kept answer sends no new call and adds no count
- **AND** a different search receives 429 with the error budget before any new upstream call

### Requirement: Failure logs

The route MUST log fixed failure kinds and checked failed host names without other request or upstream text.

Origin: spec-first

#### Scenario: Name search failures `up42-source-034`

- **WHEN** a search fails or gives a good answer with failedHosts
- **THEN** a failure writes `[up42] failed kind=<kind>` and writes `[up42] failed hosts=<list>` when hosts failed
- **AND** a good answer writes `[up42] ok` and writes `[up42] partial hosts=<list>` when hosts failed
- **AND** each list has checked host names with commas between names; kept answers write no line

