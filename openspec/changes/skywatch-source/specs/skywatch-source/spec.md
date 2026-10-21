## ADDED Requirements

### Requirement: Provider routes
The plugin MUST answer only `/api/skywatch/status` and `/api/skywatch/scenes`. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the two routes `skywatch-source-001`
- **WHEN** a test installs the plugin and sends requests to `/api/skywatch/status`, `/api/skywatch/scenes` and `/api/skywatch/other`
- **THEN** the first two paths get an answer, and the third path goes to `next` with no answer
- **AND** the path `/api/skywatch/scenes/x` goes to `next` with no answer
- **AND** the plugin name is "skywatch-proxy"
- **AND** `configureServer` and `configurePreviewServer` install the same routes
- **AND** the list that `localProviderPlugins` returns holds this plugin once

#### Scenario: Report the status `skywatch-source-002`
- **WHEN** a GET request for `/api/skywatch/status` arrives from the same site
- **THEN** the answer is `200` with `{"configured":true}` when `SKYWATCH_API_KEY` holds a character that is not white space
- **AND** the answer is `200` with `{"configured":false}` when `SKYWATCH_API_KEY` is not set or holds only white space
- **AND** a request with another method gets `405` with `{"error":"Method not allowed"}`
- **AND** a request with the header `Sec-Fetch-Site: cross-site` gets `403`, and the answer does not hold the key text

### Requirement: Local requests only
The scenes route MUST accept only a POST request that comes from this machine.
Origin: spec-first

#### Scenario: Refuse a method that is not POST `skywatch-source-003`
- **WHEN** a GET, PUT or DELETE request for `/api/skywatch/scenes` arrives
- **THEN** the answer is `405` with `{"error":"Method not allowed"}`, and the plugin sends no upstream request

#### Scenario: Refuse a request from another machine `skywatch-source-004`
- **WHEN** a POST request for `/api/skywatch/scenes` fails one check of `isLoopbackCommand()`
- **THEN** the answer is `403` with `{"error":"cross_origin"}`, and the plugin sends no upstream request
- **AND** the samples include the socket address `192.0.2.10`, the proxy header `X-Forwarded-For` and the host name `example.test`
- **AND** the samples include the origin `http://example.test` and the content type `text/plain`

### Requirement: Checked input
The scenes route MUST accept only a JSON object with a box and two dates. It MUST refuse each other body before it reads the key.
Origin: spec-first

#### Scenario: Read the body `skywatch-source-005`
- **WHEN** the body has more than 4096 bytes, is not JSON, or is not a JSON object
- **THEN** the answer is `400` with `{"error":"bad_body"}`
- **AND** a body with a field other than `bbox`, `start` and `end` gets the same answer
- **AND** a body of exactly 4096 bytes with a valid box and valid dates does not get `bad_body`

#### Scenario: Read the box `skywatch-source-006`
- **WHEN** the body has the field `bbox`
- **THEN** the route accepts an array of four finite numbers in the order west, south, east and north
- **AND** west is less than east, and south is less than north
- **AND** each longitude is from -180 to 180, and each latitude is from -90 to 90
- **AND** each other value of `bbox` gets `400` with `{"error":"bad_bbox"}`
- **AND** a body without `bbox` gets the same answer

#### Scenario: Refuse a box of more than 2500 km² `skywatch-source-007`
- **WHEN** the area of the box on a sphere with a radius of 6371008.8 m is more than 2500 km²
- **THEN** the answer is `400` with `{"error":"area_too_large","maxKm2":2500}`
- **AND** the box `[0,0,0.4497,0.4497]` (about 2500.4 km²) gets that answer
- **AND** the box `[0,0,0.4496,0.4496]` (about 2499.3 km²) does not get that answer

#### Scenario: Read the dates `skywatch-source-008`
- **WHEN** the body has the fields `start` and `end`
- **THEN** the route accepts two calendar dates with the form `YYYY-MM-DD`
- **AND** `start` is not after `end`, and `end` is not after the UTC date of the server clock
- **AND** `end` is at most 91 days after `start`, so the window has at most 92 calendar days
- **AND** the window from `2026-01-01` to `2026-04-02` passes, and the window from `2026-01-01` to `2026-04-03` gets `bad_dates`
- **AND** each other value of `start` or `end` gets `400` with `{"error":"bad_dates"}`
- **AND** a body without one of the two fields gets the same answer
- **AND** the samples include the date `2026-02-30`, which is not a calendar date

### Requirement: Key on the server
The plugin MUST read the key from `SKYWATCH_API_KEY` on the server. It MUST keep the key out of each answer and each log line.
Origin: spec-first

#### Scenario: Refuse a request without a key `skywatch-source-009`
- **WHEN** a valid scenes request arrives, and `SKYWATCH_API_KEY` is not set or holds only white space
- **THEN** the answer is `503` with `{"error":"no_key","keyRequired":true}`, and the plugin sends no upstream request

#### Scenario: Keep the key out of the browser `skywatch-source-010`
- **WHEN** `SKYWATCH_API_KEY` holds " fixture-key-Q7 ", and the plugin answers requests for each route
- **THEN** no answer body and no answer header holds the text `fixture-key-Q7`
- **AND** for each upstream request, the headers object that the plugin gives to the fetch function has `x-api-key` with the value `fixture-key-Q7`

### Requirement: Two fixed upstream requests
The plugin MUST send only two kinds of upstream request. Each request MUST go to the origin `https://api.skywatch.co`.
Origin: spec-first

#### Scenario: Start the search `skywatch-source-011`
- **WHEN** the plugin starts an upstream search for the box `[w,s,e,n]` and the dates `start` and `end`
- **THEN** it sends a POST request to `https://api.skywatch.co/earthcache/archive/search`
- **AND** the body is the JSON text of an object with the four members below, and no other member
- **AND** `location` is `{"type":"Polygon","coordinates":[[[w,s],[e,s],[e,n],[w,n],[w,s]]]}`
- **AND** `start_date` is `start`, `end_date` is `end`, and `order_by` is `-date`
- **AND** the headers are `x-api-key`, `Content-Type: application/json` and `Accept: application/json`
- **AND** the request has the option `redirect: 'error'`

#### Scenario: Read the search results `skywatch-source-012`
- **WHEN** SkyWatch answers the search with `200` and a JSON object whose `data.id` has 1 to 128 ASCII letters, digits, hyphens or underscores
- **THEN** the plugin sends a GET request to `https://api.skywatch.co/earthcache/archive/search/<id>/search_results?per_page=50`
- **AND** after each of the first nine answers `202`, the plugin calls its option `wait` with 2000
- **AND** the plugin sends the same request again only after that wait ends
- **AND** when the tenth result request also gets `202`, the scenes route answers `504` with `{"error":"search_timeout"}`
- **AND** each result request has the headers and the option of `skywatch-source-011`, and no body
- **AND** a `data.id` of another form gives `502` with `{"error":"bad_upstream"}`, and the plugin sends no result request

#### Scenario: Send no other upstream request `skywatch-source-013`
- **WHEN** a test runs each route and each failure of this specification through a fetch function that records each URL and method
- **THEN** each recorded request is one of the requests of `skywatch-source-011` and `skywatch-source-012`
- **AND** no recorded URL holds `pipelines`, `price`, `orders`, `outputs` or `offerings`

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
- **WHEN** a scenes request meets more than one step that would answer
- **THEN** the first step in this order answers: method, local request, rate limit, body, box, area, dates, key, store, daily count
- **AND** the store step answers when the store keeps an answer, or when a search for the same box and dates is in flight
- **AND** a request that the store step answers gets its answer when the count of the day is equal to the limit
- **AND** the plugin sends an upstream search only when all ten steps pass

### Requirement: Upstream failures
The plugin MUST give a named failure for each upstream request that does not give a valid document.
Origin: spec-first

#### Scenario: Name the failure `skywatch-source-019`
- **WHEN** SkyWatch answers an upstream request with `401` or `403`
- **THEN** the scenes route answers `403` with `{"error":"key_rejected","keyRejected":true}`
- **AND** an answer `429` gives `429` with `{"error":"upstream_rate_limit","retryAfter":<s>}` and the header `Retry-After: <s>`
- **AND** `<s>` is the number of the upstream header `Retry-After` when the header has only digits and the number is from 1 to 600
- **AND** `<s>` is 600 when the header has only digits and the number is more than 600
- **AND** `<s>` is 60 for each other value of the header, also `0`, and when the upstream answer has no `Retry-After` header
- **AND** each other status gives `502` with `{"error":"upstream_failed"}`, with the exceptions of `200` for each request and `202` for a result request
- **AND** a network error and a redirect give the same answer
- **AND** before each upstream request, the plugin starts a timer of 15000 ms, and it clears the timer after it reads the body
- **AND** when the timer fires, the plugin stops the request, and the scenes route gives `upstream_failed`
- **AND** the plugin reads the body only of an answer `200`
- **AND** a body that is not JSON and a body of more than 4194304 bytes give `502` with `{"error":"bad_upstream"}`
- **AND** the plugin reads a body of exactly 4194304 bytes
- **AND** a search document that is not an object, or that has no object `data`, gives the same answer
- **AND** a results document that is not an object, or whose `data` is not an array, gives the same answer
- **AND** the store keeps no failure

### Requirement: Filtered answer
The scenes route MUST give only the allowed fields of each scene. It MUST keep the upstream fields `preview_uri`, `thumbnail_uri`, `intersection`, `minimum_area_sq_km` and `off_nadir_angle` out of the answer.
Origin: spec-first

#### Scenario: Keep only the allowed fields `skywatch-source-020`
- **WHEN** the results document is an object with an array `data`
- **THEN** each scene of the answer has only the fields of the list below, from the upstream field after the arrow
- **AND** the list is `id` ← `id`, `start` ← `start_time`, `end` ← `end_time`, `footprint` ← `location` and `resolutionM` ← `resolution`
- **AND** the list continues with `provider` ← `source`, `product` ← `product_name`, `cloudPercent` ← `result_cloud_cover_percentage` and `coveragePercent` ← `location_coverage_percentage`
- **AND** the list ends with `areaKm2` ← `area_sq_km`, `pricePerKm2` ← `price_per_sq_km`, `cost` ← `cost` and `thumbnail` ← `thumbnail_uri`
- **AND** a valid time is a text that `Date.parse` reads as a finite number, and `start` and `end` are the `toISOString()` text of that time
- **AND** `end` is null when `end_time` is not a valid time
- **AND** `cloudPercent` and `coveragePercent` are finite numbers from 0 to 100, and the other number fields are finite numbers of 0 or more
- **AND** each number field is null when the upstream value does not meet its rule, so the text "Upgrade your plan for price" gives null
- **AND** the samples that give null include null, "7", true, -1 and a value that JSON reads as Infinity
- **AND** `provider` and `product` are null when the upstream value is not a text
- **AND** for a text, the route removes each character from U+0000 to U+001F and from U+007F to U+009F
- **AND** the route then removes the white space at the start and at the end, and keeps the first 120 code points
- **AND** each of `provider` and `product` is null when no text stays
- **AND** a text of 120 code points stays the same, and a text of 121 code points loses its last code point
- **AND** `thumbnail` is true when `thumbnail_uri` is an absolute URL with the scheme `https:`, and false when it is not
- **AND** `footprint` is `{"type":"Polygon","coordinates":[ring]}`, where the ring has the longitude and the latitude of each upstream position, with no third number
- **AND** the route removes an item of `data` that is not an object
- **AND** the route removes a scene with an `id` that does not meet the rule of `skywatch-source-012`
- **AND** the route removes a scene with a `start_time` that is not a valid time
- **AND** the route removes a scene with a `location` that is not a polygon with exactly one ring
- **AND** a valid ring has 4 to 2000 positions
- **AND** the longitude and the latitude of the first position are equal to those of the last position
- **AND** each position has 2 or 3 numbers, a finite longitude from -180 to 180 and a finite latitude from -90 to 90

#### Scenario: Give the shape of the answer `skywatch-source-021`
- **WHEN** the scenes route gives a good answer
- **THEN** the answer is `200` with the fields `source`, `scenes`, `count`, `total`, `truncated`, `cached` and `budget`
- **AND** `cached` is false for the answer of a new search
- **AND** `source` is "SkyWatch", and `budget` is an object with `used`, the count of the day, and `limit`, the daily limit
- **AND** the route sorts all kept scenes, with the newest `start` first
- **AND** scenes with an equal `start` are in the code-unit order of `id`, from low to high
- **AND** `scenes` holds the first 50 scenes of that order
- **AND** `count` is the length of `scenes`
- **AND** `total` is the upstream `pagination.total` when it is a whole number not less than the length of the upstream `data`
- **AND** `total` is the length of the upstream `data` when the upstream value is not such a number
- **AND** `truncated` is true when `total` is more than the length of the upstream `data`, or when more than 50 scenes stay after the checks
- **AND** `truncated` is false in each other case
- **AND** each answer of `/api/skywatch/scenes` has the headers `Content-Type: application/json; charset=utf-8` and `Cache-Control: no-store`

### Requirement: Request log
The plugin MUST write one log line for each upstream search that it starts. A line MUST NOT hold the key text, a search id, a URL or a host name.
Origin: spec-first

#### Scenario: Log each upstream search `skywatch-source-022`
- **WHEN** a test gives the plugin the options `log`, `now`, `wait` and a fake fetch function
- **AND** `ms` is the value of `now` when the search ends, less its value when the search starts
- **AND** the fake `now` gives 1000 before the search, the fake fetch moves it to 1040, and the fake `wait` ends at once
- **THEN** a good answer after 2 result requests gives "[skywatch] ok scenes=3 polls=2 ms=40"
- **AND** that answer has 4 items in `data`, and the route removes one of them
- **AND** `scenes` is the `count` of the answer
- **AND** a failure gives exactly one line, "[skywatch] failed kind=<failure> polls=<n> ms=40", where `<n>` is the number of result requests that the plugin sent
- **AND** an answer `401` to the search request gives "[skywatch] failed kind=key_rejected polls=0 ms=40"
- **AND** ten answers `202` give "[skywatch] failed kind=search_timeout polls=10 ms=40"
- **AND** no line holds the key text, the search id, `https://` or `api.skywatch.co`
- **AND** a request that does not start an upstream search writes no line
