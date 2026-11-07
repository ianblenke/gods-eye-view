# up42-quotes Specification

## ADDED Requirements

### Requirement: Routes

The plugin MUST provide both Vite hooks and answer only the two exact quote paths.

Origin: spec-first

#### Scenario: Use both hooks `up42-quotes-001`

- **WHEN** both hooks receive valid requests, child paths and query text
- **THEN** both hooks answer POST /api/up42/quote and GET /api/up42/quote/products; child paths go to next

### Requirement: Plugin list

The combined list MUST keep the source plugins and add one quotes plugin with the same client.

Origin: spec-first

#### Scenario: Share the client `up42-quotes-002`

- **WHEN** the local list serves scenes, thumbnails and quotes
- **THEN** one up42-quotes follows up42-thumbnail-proxy; all three plugins share one token; the old list functions keep their names and counts

### Requirement: Method

The routes MUST check the method before the site and all later gates.

Origin: spec-first

#### Scenario: Check the method `up42-quotes-003`

- **WHEN** a request has another method and an invalid origin
- **THEN** the route gives 405 with the error Method not allowed without an upstream call

### Requirement: Site

The quote route MUST accept only same-site JSON requests. The products route MUST accept only same-site requests.

Origin: spec-first

#### Scenario: Check the site `up42-quotes-004`

- **WHEN** requests have invalid origins, proxy headers, fetch metadata or quote content types
- **THEN** the routes give 403 with the error cross_origin before the switch and rate checks; valid HTTP and HTTPS origins pass

### Requirement: Switch

Both routes MUST stay off unless UP42_QUOTES is exactly true.

Origin: spec-first

#### Scenario: Keep the routes off `up42-quotes-005`

- **WHEN** UP42_QUOTES is absent or differs from true
- **THEN** both routes give 404 with the error quotes_off and consume no rate count

### Requirement: Rate

Both routes MUST share a limit of six admitted requests per 60000 ms.

Origin: spec-first

#### Scenario: Limit the rate `up42-quotes-006`

- **WHEN** requests use both routes and distinct socket addresses
- **THEN** the seventh gives 429 with the error rate_limited and Retry-After 60; the limit resets at 60000 ms, not 59999 ms

### Requirement: Body

The quote route MUST keep at most 4096 request bytes and accept only the four named keys.

Origin: spec-first

#### Scenario: Check the body `up42-quotes-007`

- **WHEN** the body stream fails or the body has excess bytes, invalid JSON, another type or an extra key
- **THEN** the route gives 400 with the error bad_body before credentials; the shared reader discards excess bytes through 65536 bytes

### Requirement: Product identity

The request MUST contain a UUID with 36 characters and ASCII hexadecimal digits.

Origin: spec-first

#### Scenario: Check the UUID `up42-quotes-008`

- **WHEN** dataProduct is absent or has an invalid type, length or form
- **THEN** the route gives 400 with the error bad_body before login; upper and lower case digits pass

### Requirement: Box

The box MUST use the scenes coordinate rules.

Origin: spec-first

#### Scenario: Check the box `up42-quotes-009`

- **WHEN** the box has invalid coordinates, order, length or types
- **THEN** the route gives 400 with the error bad_bbox; the longitude and latitude boundary values pass

### Requirement: Area

The box MUST have an area above zero and at most 2500 square kilometres.

Origin: spec-first

#### Scenario: Check the area `up42-quotes-010`

- **WHEN** a valid coordinate box exceeds the area limit or has zero computed area
- **THEN** the route refuses it before login; excess area gives area_too_large with maxKm2 2500; zero area gives bad_bbox

### Requirement: Parameters

The params object MUST contain only the eleven allowed keys and scalar values of the specified forms.

The allowed keys are spectralBands, radiometricProcessing, geometricProcessing, pixelCoding, priority, maxIncidenceAngle, maxCloudCover, projection, acquisitionMode, acquisitionStart and acquisitionEnd.
Strings use ASCII letters, digits, underscore, dot, colon, plus, space and hyphen only.

Origin: spec-first

#### Scenario: Check the parameters `up42-quotes-011`

- **WHEN** params has unknown keys, more than eleven keys, invalid values or an invalid object type
- **THEN** the route gives 400 with the error bad_body; strings of at most 64 allowed characters, finite numbers and booleans pass

### Requirement: Checks

The checks array MUST contain one or more unique names from validation, estimate, feasibility and opportunities.

Origin: spec-first

#### Scenario: Select the checks `up42-quotes-012`

- **WHEN** checks is absent, valid or invalid
- **THEN** absent checks select all four; a valid subset selects only its names; invalid arrays give bad_body before login

### Requirement: Credentials

The quote route MUST check both credentials before its store.

Origin: spec-first

#### Scenario: Check the credentials `up42-quotes-013`

- **WHEN** either credential is absent, empty or blank after an answer enters the store
- **THEN** the route gives 503 with the error no_credentials and keyRequired true without more upstream work

### Requirement: Public products

The products route MUST give only products with id, title and an optional collection string from the public TASKING list.

Origin: spec-first

#### Scenario: Read the products `up42-quotes-014`

- **WHEN** the public response contains content with UUID ids, optional titles and collection strings
- **THEN** the route gives products without credentials or a daily count; absent titles use the id; strings have at most 160 characters

### Requirement: Product cache

The product list MUST stay in RAM for less than six hours and share concurrent requests.

Origin: spec-first

#### Scenario: Keep the products `up42-quotes-015`

- **WHEN** two requests overlap and later requests reach the six-hour boundary
- **THEN** one public call serves concurrent requests; 21599999 ms uses the cache and 21600000 ms starts another call; invalid shapes give bad_upstream

### Requirement: Product membership

The quote route MUST refuse a UUID outside the public TASKING list before login.

Origin: spec-first

#### Scenario: Refuse an unknown product `up42-quotes-016`

- **WHEN** a valid UUID is absent from the public list
- **THEN** the route gives 404 with the error unknown_product and sends no authenticated call; case differences do not change membership

### Requirement: Upstream body

Each check MUST send the same specified body to its complete constant URL.

Origin: spec-first

#### Scenario: Set the request fields `up42-quotes-017`

- **WHEN** a quote uses distinct coordinates and params
- **THEN** each POST sets dataProduct, displayName gev-quote, a closed box FeatureCollection and params only; absent params become an empty object

### Requirement: Validation facts

Validation MUST give only status and capped error reason strings with ok true.

Origin: spec-first

#### Scenario: Read validation facts `up42-quotes-018`

- **WHEN** the validation response has one feature result
- **THEN** status comes from VALID, INVALID or UNAVAILABLE; errors come from errorReason and unavailabilityReason; other fields do not pass

### Requirement: Credit estimate

Estimate MUST give only credits, size, unit and capped errors with ok true.

Origin: spec-first

#### Scenario: Read credit facts `up42-quotes-019`

- **WHEN** the estimate response has a summary and errors
- **THEN** credits comes from totalCredits, size from totalSize and unit from SQ_KM, SCENE or null; creditsPerEur and currency do not pass

### Requirement: Feasibility facts

Feasibility MUST give only the four named facts with ok true.

Origin: spec-first

#### Scenario: Read feasibility facts `up42-quotes-020`

- **WHEN** the response has one geometry result
- **THEN** the answer maps feasibilityOutcome to outcome and keeps feasibilityStudyRequired, difficulty and capped comment; unknown fields do not pass

### Requirement: Opportunity facts

Opportunities MUST give at most 50 passes with only the five named fields.

Origin: spec-first

#### Scenario: Read pass facts `up42-quotes-021`

- **WHEN** a response contains distinct pass features
- **THEN** the answer maps id, start_datetime, end_datetime, view:incidence_angle and view:off_nadir; count equals kept passes and truncated marks excess passes

### Requirement: Geometry errors

Each check MUST read per-geometry errors in both 200 and 207 responses.

Origin: spec-first

#### Scenario: Read geometry errors `up42-quotes-022`

- **WHEN** a response has geometry errors or an invalid error structure
- **THEN** estimate keeps capped reasons; feasibility and opportunities give ok false with the error geometry_errors; invalid errors give bad_upstream

### Requirement: Response shapes

Each check MUST refuse invalid required facts and drop oddly typed optional facts.

Origin: spec-first

#### Scenario: Check response types `up42-quotes-023`

- **WHEN** a response has null, arrays, wrong types, invalid numbers or unknown fields
- **THEN** the check gives bad_upstream for invalid required facts; optional facts of the wrong type do not pass; strings have at most 160 characters

### Requirement: Partial failure

The quote MUST run checks in sequence and keep each independent result.

Origin: spec-first

#### Scenario: Keep separate results `up42-quotes-024`

- **WHEN** one selected check fails and the others pass
- **THEN** the route gives 200 with results that contain each selected name and its own ok value or fixed error; later checks still run

### Requirement: Total failure

The quote MUST give fixed failure answers when every selected check fails.

Origin: spec-first

#### Scenario: Name a total failure `up42-quotes-025`

- **WHEN** all selected checks fail
- **THEN** all credentials_rejected results give 403 with the error credentials_rejected and keyRejected true
- **AND** other total failures give 502 with the error upstream_failed

### Requirement: Transport

The client MUST refuse redirects and cap JSON bodies at 4194304 bytes.

Origin: spec-first

#### Scenario: Bound the transport `up42-quotes-026`

- **WHEN** upstream gives a redirect, bad JSON, excess bytes, 429, 542 or a network error
- **THEN** the check has a fixed failure without upstream text; no redirect or 429 retry occurs; an API 401 causes one login and retry

### Requirement: Time limit

Each call MUST stop at 15000 ms through headers, body and error cancellation.

Origin: spec-first

#### Scenario: Bound the wait `up42-quotes-027`

- **WHEN** headers, JSON data or a cancel operation never ends or ends after abort
- **THEN** the check gives search_timeout; the timer clears after completion; a cancel error keeps the fixed failure

### Requirement: Answer store

The quote store MUST keep at most sixteen good answers for less than 600000 ms.

Origin: spec-first

#### Scenario: Keep quote facts `up42-quotes-028`

- **WHEN** requests repeat before and at expiry or exceed sixteen distinct entries
- **THEN** the kept answer has literal expected facts and cached true; expiry and oldest-entry removal cause new work; total failures do not enter the store

### Requirement: Store identity

The store key MUST include product, box, params and checks.

Origin: spec-first

#### Scenario: Check the store key `up42-quotes-029`

- **WHEN** one request field changes or object key order changes
- **THEN** changed values cause new upstream work; equivalent key order and check order share the same answer

### Requirement: Concurrent quotes

The route MUST claim a quote before its first wait after a store miss.

Origin: spec-first

#### Scenario: Share a quote `up42-quotes-030`

- **WHEN** two identical requests miss the store simultaneously
- **THEN** one upstream round and one daily count serve both answers; the second has cached true; a shared failure allows new work

### Requirement: Daily count

The quote route MUST count new upstream rounds against a UTC daily limit of 20 by default and at most 200.

Origin: spec-first

#### Scenario: Count quote rounds `up42-quotes-031`

- **WHEN** a quote reaches UP42, fails, hits the store or reaches the next day
- **THEN** new rounds count once for discovery and failures; store hits do not count; budget gives 429 with used and limit; invalid limits use 20

### Requirement: Secret output

The provider MUST keep credentials and tokens out of answers, headers, errors and every console method.

Origin: spec-first

#### Scenario: Keep secrets private `up42-quotes-032`

- **WHEN** upstream returns or throws fake secrets and tests capture all console methods
- **THEN** no output contains a fake secret; a check that echoes a secret gives a fixed failure; the route checks a stored answer again

### Requirement: Previous secrets

The client MUST keep previous credentials and tokens for its output safety check.

Origin: spec-first

#### Scenario: Refuse previous secrets `up42-quotes-033`

- **WHEN** the user name, password or token changes before upstream echoes the previous value
- **THEN** the route refuses the old secret; each credential change causes a fresh login

### Requirement: Request guard

The quote code MUST use only the five complete constant URLs and the specified methods.

The POST URLs are `https://api.up42.com/v2/orders/validation`, `https://api.up42.com/v2/orders/estimate`, `https://api.up42.com/v2/tasking/orders/feasibility` and `https://api.up42.com/v2/tasking/orders/opportunities`.
The public GET URL is `https://api.up42.com/v2/data-products?type=TASKING&size=100`.

Origin: spec-first

#### Scenario: Check every request form `up42-quotes-034`

- **WHEN** a fake fetch that records requests receives all check subsets, request forms and failure kinds
- **THEN** only the four allowed POST forms and public products GET pass, apart from the fixed token login; request data cannot change a URL

### Requirement: Source guard

The new folder MUST contain no forbidden operation text or URL construction from request data.

Origin: spec-first

#### Scenario: Scan the source `up42-quotes-035`

- **WHEN** the test scans every quote source file
- **THEN** every /v2/orders occurrence is exactly the validation or estimate path; forbidden words and PUT or DELETE methods are absent; only five URL literals exist

### Requirement: Client origin

The generic client hooks MUST refuse destinations outside the exact HTTPS API origin before login.

Origin: spec-first

#### Scenario: Check the client origin `up42-quotes-036`

- **WHEN** a hook receives a invalid URL, HTTP URL, other origin or deceptive host
- **THEN** it gives bad_upstream without fetch; valid public calls have no bearer and valid POST calls use the shared token

