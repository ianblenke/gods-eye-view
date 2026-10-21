## ADDED Requirements

### Requirement: Provider routes
The plugin MUST answer only `/api/skywatch/status` and `/api/skywatch/scenes`. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the two routes `skywatch-source-001`
- **WHEN** a test installs the plugin and sends requests to `/api/skywatch/status`, `/api/skywatch/scenes` and `/api/skywatch/other`
- **THEN** the first two paths get an answer, and the third path goes to `next` with no answer
- **AND** a path below one of the two routes, such as `/api/skywatch/scenes/x`, goes to `next` with no answer

#### Scenario: Report the status `skywatch-source-002`
- **WHEN** a GET request for `/api/skywatch/status` arrives from the same site
- **THEN** the answer is `200` with `{"configured":true}` when `SKYWATCH_API_KEY` holds text that is not blank, and `{"configured":false}` when it does not
- **AND** a request with another method gets `405` with `{"error":"Method not allowed"}`
- **AND** a cross-site request gets `403`, and the answer holds no part of the key

### Requirement: Local requests only
The scenes route MUST accept only a POST request that comes from this machine.
Origin: spec-first

#### Scenario: Refuse a method that is not POST `skywatch-source-003`
- **WHEN** a GET request for `/api/skywatch/scenes` arrives
- **THEN** the answer is `405` with `{"error":"Method not allowed"}`, and the plugin sends no upstream request

#### Scenario: Refuse a request from another machine `skywatch-source-004`
- **WHEN** a POST request for `/api/skywatch/scenes` fails one check of `isLoopbackCommand()`
- **THEN** the answer is `403` with `{"error":"cross_origin"}`, and the plugin sends no upstream request
- **AND** the samples are a socket address of another machine, a forwarding header and a host name that is not a loopback name
- **AND** the samples also include another origin and a content type that is not JSON

### Requirement: Checked input
The scenes route MUST accept only a JSON object with a box and two dates. It MUST refuse each other body before it reads the key.
Origin: spec-first

#### Scenario: Read the body `skywatch-source-005`
- **WHEN** the body has more than 4096 bytes, is not JSON, is not an object, or has a field other than `bbox`, `start` and `end`
- **THEN** the answer is `400` with `{"error":"bad_body"}`
- **AND** a body of exactly 4096 bytes with a valid box and valid dates is accepted

#### Scenario: Read the box `skywatch-source-006`
- **WHEN** the body has the field `bbox`
- **THEN** the route accepts an array of four finite numbers in the order west, south, east and north
- **AND** west is less than east, and south is less than north
- **AND** each longitude is from -180 to 180 and each latitude is from -90 to 90
- **AND** each other value of `bbox`, or a body with no `bbox`, gets `400` with `{"error":"bad_bbox"}`

#### Scenario: Refuse a box of more than 2500 km² `skywatch-source-007`
- **WHEN** the area of the box on a sphere with a radius of 6371008.8 m is more than 2500 km²
- **THEN** the answer is `400` with `{"error":"area_too_large","maxKm2":2500}`
- **AND** a box with an area of 2500 km² or less is accepted

#### Scenario: Read the dates `skywatch-source-008`
- **WHEN** the body has the fields `start` and `end`
- **THEN** the route accepts two calendar dates with the form `YYYY-MM-DD`, with `start` not after `end`
- **AND** `end` is not after the UTC date of the server clock, and the window from `start` to `end` has at most 92 days
- **AND** each other value of `start` or `end`, or a body with one of them missing, gets `400` with `{"error":"bad_dates"}`
- **AND** the samples include the date `2026-02-30`, which is not a calendar date

### Requirement: Key on the server
The plugin MUST read the key from `SKYWATCH_API_KEY` on the server, and it MUST keep the key out of each answer and each log line.
Origin: spec-first

#### Scenario: Refuse a request without a key `skywatch-source-009`
- **WHEN** a valid scenes request arrives and `SKYWATCH_API_KEY` is missing or holds only white space
- **THEN** the answer is `503` with `{"error":"no_key","keyRequired":true}`, and the plugin sends no upstream request

#### Scenario: Keep the key out of the browser `skywatch-source-010`
- **WHEN** the plugin answers requests for each route with a key of fixture text
- **THEN** no answer body and no answer header holds the key text
- **AND** the plugin sends the trimmed key only in the header `x-api-key` of an upstream request

### Requirement: Two fixed upstream requests
The plugin MUST send only two kinds of upstream request, to the origin `https://api.skywatch.co` and the path prefix `/earthcache/archive/search`.
Origin: spec-first

#### Scenario: Start the search `skywatch-source-011`
- **WHEN** the plugin starts an upstream search for a valid request
- **THEN** it sends a POST request to `https://api.skywatch.co/earthcache/archive/search`
- **AND** the body is a JSON object with `location`, `start_date`, `end_date` and `order_by` with the value `-date`
- **AND** `location` is a closed polygon of the five corners of the box
- **AND** the headers are `x-api-key`, `Content-Type: application/json` and `Accept: application/json`, and the request does not follow a redirect

#### Scenario: Read the search results `skywatch-source-012`
- **WHEN** the upstream search answers `200` with a search id that has 1 to 128 letters, digits, hyphens or underscores
- **THEN** the plugin sends GET requests to `https://api.skywatch.co/earthcache/archive/search/<id>/search_results?per_page=50`
- **AND** while the answer is `202`, the plugin waits 2000 ms and sends the request again, at most 10 times in all
- **AND** after the tenth answer `202`, the scenes route answers `504` with `{"error":"search_timeout"}`
- **AND** a search id of another form gives the failure `bad_upstream`, and the plugin sends no results request

#### Scenario: Send no other upstream request `skywatch-source-013`
- **WHEN** a test runs each route and each failure of this specification through a fetch function that records each URL and method
- **THEN** each recorded request is one of the two requests of `skywatch-source-011` and `skywatch-source-012`
- **AND** no recorded URL holds `pipelines`, `price`, `orders`, `outputs` or `offerings`

### Requirement: Search control
The plugin MUST limit the upstream searches with a daily count, a memory of answers and a rate limit.
Origin: spec-first

#### Scenario: Count the searches of the day `skywatch-source-014`
- **WHEN** a valid scenes request needs a new upstream search
- **THEN** the plugin counts the search against the limit of the UTC day before it sends the request
- **AND** the limit is the whole number in `SKYWATCH_DAILY_SEARCHES` from 1 to 1000, or 20 when the value is missing or not such a number
- **AND** when the count of the day has reached the limit, the answer is `429` with `{"error":"budget","used":<count>,"limit":<limit>}`, and the plugin sends no upstream request
- **AND** the count starts again at 0 on the next UTC day

#### Scenario: Answer a repeat from memory `skywatch-source-015`
- **WHEN** a scenes request has the same box and dates as a good answer of the last 600000 ms
- **THEN** the plugin gives that answer with `cached` true, does not count a search and sends no upstream request
- **AND** the memory keeps at most 32 answers and drops the oldest answer first

#### Scenario: Share an upstream search that is in flight `skywatch-source-016`
- **WHEN** two scenes requests with the same box and dates arrive before the first upstream search ends
- **THEN** the plugin sends one upstream search and counts one search, and both requests get the answer

#### Scenario: Limit the requests `skywatch-source-017`
- **WHEN** more than 6 scenes requests from this machine arrive in 60000 ms
- **THEN** each request after the sixth gets `429` with `{"error":"rate_limited"}` and the header `Retry-After: 60`

#### Scenario: Run the steps in order `skywatch-source-018`
- **WHEN** a scenes request fails more than one step
- **THEN** the answer is the answer of the first step that fails
- **AND** the order of the steps is method, local request, rate limit, body, box, area, dates, key, memory, daily count and upstream

### Requirement: Upstream failures
The plugin MUST give a named failure for each upstream request that does not give a valid document.
Origin: spec-first

#### Scenario: Name the failure `skywatch-source-019`
- **WHEN** an upstream request answers `401` or `403`
- **THEN** the scenes route answers `403` with `{"error":"key_rejected","keyRejected":true}`
- **AND** an answer `429` gives `429` with `{"error":"upstream_rate_limit","retryAfter":<s>}` and the header `Retry-After`
- **AND** the number of seconds is the whole number of the upstream header, at most 600
- **AND** the number is 60 when the upstream header is missing, is not a whole number or is less than 1
- **AND** each other status, a network error, a time of more than 15000 ms for one request and a redirect give `502` with `{"error":"upstream_failed"}`
- **AND** a body that is not JSON, a body of more than 4194304 bytes and a document of the wrong shape give `502` with `{"error":"bad_upstream"}`
- **AND** a failure is not kept in the memory

### Requirement: Filtered answer
The scenes route MUST give only the allowed fields of each scene. It MUST keep the upstream image URLs and the order fields of the upstream out of the answer.
Origin: spec-first

#### Scenario: Keep only the allowed fields `skywatch-source-020`
- **WHEN** the results document has a `data` array of scenes
- **THEN** each scene of the answer has only `id`, `start`, `end`, `footprint`, `resolutionM`, `provider`, `product`, `cloudPercent`, `coveragePercent`, `areaKm2`, `pricePerKm2`, `cost` and `thumbnail`
- **AND** `thumbnail` is true when the upstream `thumbnail_uri` is an HTTPS URL, and false when it is not
- **AND** `cost` is null when the upstream `cost` is not a finite number, and the same rule applies to each number field
- **AND** `provider` and `product` are the upstream `source` and `product_name` with control characters removed and at most 120 code points
- **AND** the route drops a scene with an `id` that does not match the rule of `skywatch-source-012`
- **AND** the route drops a scene with a `start_time` that is not a valid time
- **AND** the route drops a scene with a `location` that is not a valid polygon or multipolygon
- **AND** a valid polygon has rings of 4 to 2000 positions
- **AND** each position has a finite longitude from -180 to 180 and a finite latitude from -90 to 90

#### Scenario: Give the shape of the answer `skywatch-source-021`
- **WHEN** the scenes route gives a good answer
- **THEN** the answer is `200` with `source` `SkyWatch`, `scenes`, `count`, `total`, `truncated`, `cached` and `budget` (`used` and `limit` of the day)
- **AND** the scenes are in the order of the newest `start` first, and the order of `id` for an equal `start`
- **AND** `total` is the upstream `pagination.total` when it is a whole number not less than the count of the scenes
- **AND** `total` is the count of the scenes when the upstream value is not such a number
- **AND** `truncated` is true when `total` is more than `count`

### Requirement: Request log
The plugin MUST write one log line for each upstream search, and the line MUST hold no key and no URL of the upstream.
Origin: spec-first

#### Scenario: Log each upstream search `skywatch-source-022`
- **WHEN** an upstream search ends
- **THEN** for a good answer, the plugin writes one line that starts with `[skywatch] ok`
- **AND** the line holds the count of scenes, the count of result requests and the time in milliseconds
- **AND** the plugin writes one line that starts with `[skywatch] failed kind=<failure>` with the same counts and the time, when the search fails
- **AND** no line holds the key text, a search id or a part of an upstream URL
