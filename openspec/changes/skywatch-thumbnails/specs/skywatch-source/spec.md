## RENAMED Requirements

- FROM: ### Requirement: Local requests only
- TO: ### Requirement: Same-site requests only

## MODIFIED Requirements

### Requirement: Same-site requests only
The scenes route MUST accept only a POST request from the same site with the content type `application/json`.
Origin: spec-first

#### Scenario: Refuse a method that is not POST `skywatch-source-003`
- **WHEN** a GET, PUT, PATCH or DELETE request for `/api/skywatch/scenes` arrives
- **THEN** the answer is `405` with `{"error":"Method not allowed"}`, and the plugin sends no upstream request

#### Scenario: Refuse a request from another site `skywatch-source-004`
- **WHEN** a POST request for `/api/skywatch/scenes` fails one check of `admitSameSiteRequest()`, or its content type is not `application/json`
- **THEN** the answer is `403` with `{"error":"cross_origin"}`, and the plugin sends no upstream request
- **AND** the samples include the header `Sec-Fetch-Site: cross-site`, the proxy header `X-Forwarded-For` and the origin `null`
- **AND** the samples include the origin `http://example.test` with the host `localhost:5173`, and the content type `text/plain`

#### Scenario: Accept a request through the reverse proxy `skywatch-source-023`
- **WHEN** a valid POST request for `/api/skywatch/scenes` comes from the socket address `192.0.2.10` with the host `godseye.example.test`
- **AND** the request has the origin `http://godseye.example.test`, the header `Sec-Fetch-Site: same-origin` and no proxy header
- **AND** the request has the content type `application/json`, and `SKYWATCH_API_KEY` holds a key
- **THEN** the plugin sends the upstream search, and the answer is `200`
- **AND** a request from `127.0.0.1` with the host `localhost:5173`, the origin `http://localhost:5173` and no `Sec-Fetch-Site` header also gets `200`

### Requirement: Search control
The plugin MUST limit the upstream searches with a daily count, an answer store and a rate limit.
Origin: spec-first

#### Scenario: Count the searches of the day `skywatch-source-014`
- **WHEN** a valid scenes request needs a new upstream search
- **THEN** the plugin adds 1 to the count of the UTC day before it sends the search request
- **AND** the daily limit is the number of `SKYWATCH_DAILY_SEARCHES` when that text has only digits and its number is from 1 to 1000
- **AND** the daily limit is 20 for each other value, and when the variable is not set
- **AND** when the count of the day is equal to the limit, the answer is `429` with `{"error":"budget","used":<count>,"limit":<limit>}`, and the plugin sends no upstream request
- **AND** the count is 0 at the start of each UTC day

#### Scenario: Answer a repeated request from the store `skywatch-source-015`
- **WHEN** a scenes request has the same box and dates as a good answer that the store keeps
- **THEN** the plugin gives the scenes of that answer with `cached` true, does not change the count and sends no upstream request
- **AND** the `budget` of the new answer has the count of the day at the time of the new request
- **AND** the store gives an answer that is 599999 ms old, and it does not give an answer that is 600000 ms old
- **AND** the store keeps at most 32 answers, and it removes the oldest answer first

#### Scenario: Share an upstream search that is in flight `skywatch-source-016`
- **WHEN** a scenes request arrives while an upstream search for the same box and dates has not ended
- **THEN** the request waits for that search, the plugin sends no other request, and the count does not change
- **AND** the request gets the scenes of that search with `cached` true, or the failure of that search

#### Scenario: Limit the requests `skywatch-source-017`
- **WHEN** more than 6 scenes requests reach the rate-limit step in 60000 ms
- **THEN** each request after the sixth gets `429` with `{"error":"rate_limited"}` and the header `Retry-After: 60`
- **AND** after 6 requests at the time 0 ms, the 7th request at 59999 ms gets that answer
- **AND** after 6 requests at the time 0 ms, the 7th request at 60000 ms passes
- **AND** a request that the store answers counts for this limit

#### Scenario: Run the steps in order `skywatch-source-018`
- **WHEN** a scenes request meets more than one step that can answer
- **THEN** the first step in this order answers: method, same site, rate limit, body, box, area, dates, key, store, daily count
- **AND** the store step answers when the store keeps an answer, or when a search for the same box and dates is in flight
- **AND** a request that the store step answers gets its answer when the count of the day is equal to the limit
- **AND** the plugin sends an upstream search only when all ten steps pass
