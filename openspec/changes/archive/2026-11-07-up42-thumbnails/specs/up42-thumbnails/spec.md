## ADDED Requirements

### Requirement: Route

The thumbnail plugin MUST answer only a valid scene id path under `/api/up42/thumbnail`. It MUST provide both Vite hooks.

Origin: spec-first

#### Scenario: Mount the route `up42-thumbnails-001`

- **WHEN** install both hooks and send paths with and without query text
- **THEN** valid ids of 1 through 128 ASCII letters, digits, underscores, hyphens or dots receive an answer
- **AND** empty ids, excess ids, encoded ids, line breaks and child paths go to next without an answer
- **AND** the scenes plugin still passes child paths of its own routes to next

### Requirement: Plugin list

The function `up42SourcePlugins()` MUST return the scenes plugin followed by the thumbnail plugin with one shared client and answer store.
The function `up42Plugins()` MUST keep its one scenes plugin.
The thumbnail modules MUST stay outside `server/providers/up42/`.

Origin: spec-first

#### Scenario: Use the local plugin list `up42-thumbnails-002`

- **WHEN** use the local provider list with fake process credentials and fake fetch
- **THEN** the list has one up42-thumbnail-proxy directly after up42-proxy
- **AND** the thumbnail route finds a scene from that list and reads the process variable

### Requirement: Same site

The thumbnail route MUST use `isSameSite` before the method check.

Origin: spec-first

#### Scenario: Check the site `up42-thumbnails-003`

- **WHEN** send another origin, cross-site fetch metadata, proxy headers or an origin with the wrong socket protocol
- **THEN** the route gives 403 with the error cross_origin and sends no upstream request
- **AND** valid HTTP and HTTPS origins pass, and refused requests consume no rate count

### Requirement: Method

The thumbnail route MUST accept only GET.

Origin: spec-first

#### Scenario: Check the method `up42-thumbnails-004`

- **WHEN** send POST, PUT, DELETE or HEAD after the site check
- **THEN** the route gives 405 with the error Method not allowed and sends no upstream request

### Requirement: Variable

The thumbnail route MUST stay off unless `UP42_THUMBNAILS` is exactly the text true.

Origin: spec-first

#### Scenario: Keep the route off `up42-thumbnails-005`

- **WHEN** send an admitted GET with an absent, empty, false, 1, TRUE or true-space variable
- **THEN** the route gives 404 with the error thumbnails_off and sends no upstream request
- **AND** these requests consume no rate count

### Requirement: Rate

The thumbnail route MUST admit at most 30 requests in each 60000 ms window after the variable check.

Origin: spec-first

#### Scenario: Limit requests `up42-thumbnails-006`

- **WHEN** send 31 admitted requests from two socket addresses
- **THEN** the first 30 pass and the last gives 429 with the error rate_limited and Retry-After 60
- **AND** the limit still applies at 59999 ms and resets at 60000 ms; kept images consume the limit

### Requirement: Scene lookup

The scenes plugin MUST export a lookup that finds the newest kept answer with the id and needs its thumbnail flag to be true.

Origin: spec-first

#### Scenario: Find the scene host `up42-thumbnails-007`

- **WHEN** keep distinct answers with the same id, distinct hosts and distinct thumbnail flags
- **THEN** the lookup uses the first scene with that id in the newest answer that has it
- **AND** a false flag, unknown id, expired answer or evicted answer gives no host, even when the image store has bytes
- **AND** an age of 599999 ms passes and 600000 ms fails; separate plugin lists share no scenes

### Requirement: Destination

The client MUST send an authenticated GET only to the fixed thumbnail path on `api.up42.com`.

Origin: spec-first

#### Scenario: Build the fixed request `up42-thumbnails-008`

- **WHEN** request a known thumbnail or call the client with invalid path parts
- **THEN** the GET URL is https://api.up42.com/catalog/oneatlas/image/scene.1/thumbnail for host oneatlas and id scene.1
- **AND** the host passes the source host regex and the id passes the source id rule before any login
- **AND** the request sets only Authorization with the bearer token and Accept with image/png, image/jpeg, image/webp
- **AND** the request explicitly refuses redirects and has no body; client query text cannot set a host or URL

### Requirement: Token

The thumbnail client MUST use the scenes token cache, share a login and retry a 401 once.

Origin: spec-first

#### Scenario: Share the token `up42-thumbnails-009`

- **WHEN** run concurrent authenticated calls and advance the clock to the token expiry boundary
- **THEN** the calls share one login and reuse the token until 60 seconds before expiry
- **AND** a 401 causes one new login and retry; a second 401 gives credentials_rejected
- **AND** a refused login ends the call without a later image request

### Requirement: Image

The client MUST accept only PNG, JPEG or WebP with at most 1048576 bytes and the correct first bytes.

Origin: spec-first

#### Scenario: Check the image `up42-thumbnails-010`

- **WHEN** read image responses with valid and invalid types, sizes and first bytes
- **THEN** the client ignores content type parameters and case and sends only a valid image
- **AND** PNG starts with 89 50 4E 47 0D 0A 1A 0A; JPEG starts with FF D8 FF
- **AND** WebP starts with RIFF and has WEBP at bytes 9 through 12
- **AND** a non-image type, empty body, null body, wrong signature or excess size gives bad_upstream with 502
- **AND** exactly 1048576 bytes pass; the client cancels a non-image body without reading it

### Requirement: Failure

The route MUST give fixed failure names without upstream text.

Origin: spec-first

#### Scenario: Name upstream failures `up42-thumbnails-011`

- **WHEN** fake each upstream failure
- **THEN** 404 gives 404 with the error not_found; two API 401 answers give 403 with credentials_rejected and keyRejected true
- **AND** other non-200 statuses, network errors and redirects give 502 with upstream_failed
- **AND** 429 gives upstream_failed with no retry; bad images give 502 with bad_upstream

### Requirement: Timeout

The client MUST limit each call to 15000 ms through the body and cancel non-200 bodies before it clears the timer.

Origin: spec-first

#### Scenario: Keep the timer through the body `up42-thumbnails-012`

- **WHEN** expire the timer during headers or the body, or send a non-200 body
- **THEN** a timeout gives 504 with search_timeout and clears the timer
- **AND** a non-200 body receives cancel before the timer clears; a cancel error keeps the fixed failure

### Requirement: Answer

The route MUST send checked bytes with only its own headers.

Origin: spec-first

#### Scenario: Send checked bytes `up42-thumbnails-013`

- **WHEN** fetch a valid image with hostile upstream headers
- **THEN** the answer sends the same bytes with the media type and decimal Content-Length
- **AND** the answer sets `Cache-Control: private, max-age=600` and `X-Content-Type-Options: nosniff`
- **AND** the answer sets `Content-Security-Policy` to `default-src 'none'`
- **AND** no upstream header passes; each JSON refusal has application/json; charset=utf-8 and Cache-Control no-store

### Requirement: Image store

The route MUST keep at most 32 good images, each for less than 600000 ms, by host and id.

Origin: spec-first

#### Scenario: Bound the image store `up42-thumbnails-014`

- **WHEN** repeat thumbnail requests with distinct hosts and ids and advance the clock
- **THEN** a kept image sends no upstream request at 599999 ms, and a request at 600000 ms starts new work
- **AND** the oldest image leaves at entry 33; a refreshed image becomes newest; failures never enter the store
- **AND** a thumbnail request adds no daily search count

### Requirement: Concurrent requests

The thumbnail route MUST claim new work before any await after a store miss.

Origin: spec-first

#### Scenario: Claim work before a wait `up42-thumbnails-015`

- **WHEN** send two simultaneous requests for the same id before upstream work starts
- **THEN** one upstream image call serves both requests with the same image or the same failure
- **AND** the next request after a shared failure starts new work

### Requirement: Secret output

The provider MUST keep the user name, password and tokens out of answers, response headers, errors and logs.

Origin: spec-first

#### Scenario: Keep secrets private `up42-thumbnails-016`

- **WHEN** capture good answers, secret image bodies, failures, thrown errors and all console methods with fake secrets
- **THEN** no captured output contains a fake user name, password or token
- **AND** the client refuses an image whose bytes contain a current or previous fake secret

### Requirement: Read only

The provider MUST use only the three source request forms and the new literal thumbnail GET form.

Origin: spec-first

#### Scenario: Check the request list `up42-thumbnails-017`

- **WHEN** record good and failed requests and scan all provider source files
- **THEN** the only added form is GET https://api.up42.com/catalog/<host>/image/<id>/thumbnail
- **AND** the source has no forbidden source literal from the source guard; no other UP42 URL or method passes

