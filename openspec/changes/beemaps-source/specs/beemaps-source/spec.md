## ADDED Requirements

### Requirement: Provider routes
The plugin MUST answer only `/api/beemaps/status` and `/api/beemaps/frames`. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the two routes `beemaps-source-001`
- **WHEN** a test installs the plugin and sends requests to `/api/beemaps/status`, `/api/beemaps/frames` and `/api/beemaps/other`
- **THEN** the first two paths get an answer, and the third path goes to `next` with no answer
- **AND** the plugin name is "beemaps-proxy"
- **AND** `configureServer` and `configurePreviewServer` install the same routes

#### Scenario: Report the status `beemaps-source-002`
- **WHEN** a `GET` goes to `/api/beemaps/status`
- **THEN** the answer is `200` with `{configured}`, and `configured` is true only for a key that is not empty after `trim()`
- **AND** the answer has no other field and does not hold the key text
- **AND** the route uses the same-site gate of the other providers, so a request with a foreign `Origin` gets `403`
- **AND** another method gets `405` with `{error:'Method not allowed'}`

### Requirement: Local requests only
The route `/api/beemaps/frames` MUST answer a POST only. It MUST refuse a request that does not pass `isLoopbackCommand` before it reads the body.
Origin: spec-first

#### Scenario: Refuse a method that is not POST `beemaps-source-003`
- **WHEN** the route gets a `GET`, a `PUT` or a `DELETE`
- **THEN** it answers `405` with `{error:'Method not allowed'}`
- **AND** it sends no upstream request

#### Scenario: Refuse a request from another machine `beemaps-source-004`
- **WHEN** a POST breaks one of the five rules of `isLoopbackCommand`
- **AND** the rules are a loopback socket address, no proxy header, a loopback host, the same origin and the content type `application/json`
- **THEN** the route answers `403` with `{error:'cross_origin'}`, and it does not read the body
- **AND** the route sends no upstream request and does not change the budget file
- **AND** a POST that keeps all five rules passes this step

### Requirement: Checked input
The route MUST accept only a box or one polygon, and the box that holds it MUST NOT be larger than 5 km². It MUST check every input before it spends anything.
Origin: spec-first

#### Scenario: Read the body `beemaps-source-005`
- **WHEN** the body is larger than 8192 bytes, or is not a JSON object, or has a field other than `bbox`, `polygon`, `since` and `limit`
- **THEN** the route answers `400` with `{error:'bad_body'}`
- **AND** a valid request of exactly 8192 bytes passes this step

#### Scenario: Build the polygon from a box `beemaps-source-006`
- **WHEN** the body has `bbox` as a list of the four numbers west, south, east and north
- **THEN** the ring is [west, south], [east, south], [east, north], [west, north] and [west, south], in that order, with the longitude first
- **AND** the route answers `400` with `{error:'bad_area'}` when `bbox` is not a list of four numbers, or when a number is not finite
- **AND** it gives the same answer when west is not less than east, or when south is not less than north
- **AND** it gives the same answer when a longitude is outside -180 to 180, or when a latitude is outside -90 to 90

#### Scenario: Accept a polygon `beemaps-source-007`
- **WHEN** the body has `polygon`, an object with the `type` "Polygon" and `coordinates` that hold one ring
- **AND** the ring has 4 to 101 positions, and its first and last positions are equal
- **AND** each position is a longitude from -180 to 180 followed by a latitude from -90 to 90
- **THEN** the ring goes to the upstream request as it is
- **AND** the route answers `400` with `{error:'bad_area'}` for a `polygon` that is not an object, and for a `type` that is not "Polygon"
- **AND** it gives the same answer for `coordinates` that are not a list of one ring
- **AND** it gives the same answer for a ring with fewer than 4 or more than 101 positions
- **AND** it gives the same answer for a ring whose first and last positions differ
- **AND** it gives the same answer for a position that is not two finite numbers in range

#### Scenario: Need one area `beemaps-source-008`
- **WHEN** the body has both `bbox` and `polygon`, or has neither
- **THEN** the route answers `400` with `{error:'bad_area'}`

#### Scenario: Refuse an area of more than 5 km² `beemaps-source-009`
- **WHEN** the area of the smallest box that holds the ring is more than 5 km²
- **THEN** the route answers `400` with `{error:'area_too_large', maxKm2:5}`
- **AND** the area is the radius squared, times the width of the box in radians
- **AND** that product is times the sine of the north edge minus the sine of the south edge, and the radius is 6371008.8 metres
- **AND** the box [0, 0, 0.0201, 0.02] has the area 4.9705 km² and passes
- **AND** the box [0, 0, 0.0204, 0.02] has the area 5.0447 km² and is refused
- **AND** a ring that runs clockwise passes or fails by the same rule as a ring that runs counter-clockwise
- **AND** a ring that crosses itself is refused when its box has more than 5 km²
- **AND** the bow tie with the corners [0, 0], [0.03, 0.03], [0.03, 0] and [0, 0.03] has a box of 11.1279 km² and is refused

#### Scenario: Read the date `beemaps-source-010`
- **WHEN** the body has `since` as a text `YYYY-MM-DD`
- **THEN** the route sends it as `min_week` in the upstream request, and it keeps only the frames at or after 00:00:00 UTC of that day
- **AND** the route answers `400` with `{error:'bad_since'}` for a `since` that is not a text
- **AND** it gives the same answer for a text that is not a real calendar date
- **AND** it gives the same answer for a date before 2020-01-01, and for a date after today (UTC)

#### Scenario: Read the limit `beemaps-source-011`
- **WHEN** the body has `limit`
- **THEN** the value is a whole number from 1 to 200, and the default is 100
- **AND** the route answers `400` with `{error:'bad_limit'}` for any other value, and for a `limit` that is not a number

### Requirement: Key on the server
The key MUST come from the server variable `BEEMAPS_API_KEY`. It MUST NOT reach the browser, an answer or a console line.
Origin: spec-first

#### Scenario: Refuse a request without a key `beemaps-source-012`
- **WHEN** a valid request arrives and `BEEMAPS_API_KEY` is not set, is empty or has only spaces
- **THEN** the route answers `503` with `{error:'no_key', keyRequired:true}`
- **AND** it sends no upstream request and does not change the budget file

#### Scenario: Keep the key out of the browser `beemaps-source-013`
- **WHEN** a test sets `BEEMAPS_API_KEY` to a fixture text, makes a request that succeeds and makes a request that the upstream refuses
- **THEN** the key text is in no answer body, no answer header and no console line
- **AND** the browser config of the build has no define that holds the key text
- **AND** the upstream request has the key only in the header `Authorization`, as "Basic " followed by the key after `trim()`

### Requirement: One fixed upstream request
The provider MUST send each upstream request to one fixed URL. It MUST hold no code that creates a Burst.
Origin: spec-first

#### Scenario: Send the upstream request `beemaps-source-014`
- **WHEN** a valid request passes every step
- **THEN** the provider sends one `POST` to `https://beemaps.com/api/developer/latest/poly?catalog=true`, with `&min_week=` and the date when the body has `since`
- **AND** the body of the request is the JSON of `{"type":"Polygon","coordinates":[ring]}`
- **AND** the headers are `Authorization`, `Content-Type` "application/json" and `Accept` "application/json", and the option `redirect` is "error"
- **AND** the request has a signal that aborts after 20 seconds

#### Scenario: Pin the upstream and keep Bursts out `beemaps-source-015`
- **WHEN** a test reads the source files of the provider
- **THEN** the files hold the host `beemaps.com` and the path `/api/developer/latest/poly` once, and no other URL
- **AND** no file holds the text "burst" in any letter case
- **AND** a fake fetch function that gets any other URL fails the test

### Requirement: Spend control
The provider MUST count each upstream call before it sends the call. It MUST refuse a call when the daily limit is used.
Origin: spec-first

#### Scenario: Count the calls of the day `beemaps-source-016`
- **WHEN** the provider is about to send an upstream request
- **THEN** it checks the count of the day against the daily limit and adds 1 in one step, with no wait between the two
- **AND** it writes the count to `.gev-cache/beemaps/budget.json`, waits for the write to end, and then it sends the request
- **AND** the daily limit is the number in `BEEMAPS_DAILY_QUERIES` when that text has digits only and is 1 or more. In all other cases it is 20
- **AND** when the count is at least the daily limit, the route answers `429` with `{error:'budget', used, limit}`
- **AND** in that case the route sends no request and does not add to the count

#### Scenario: Keep the count across restarts and days `beemaps-source-017`
- **WHEN** a new plugin starts and the file has the date of today (UTC) and a count
- **THEN** the plugin continues from that count
- **AND** a file with another date, or a file that is not there, gives the count 0
- **AND** the route answers `503` with `{error:'budget_unavailable'}` and sends no request when the file is not valid JSON
- **AND** it gives the same answer when the count in the file is not a whole number of 0 or more
- **AND** it gives the same answer when the file cannot be read for another reason, or cannot be written

#### Scenario: Count requests that overlap `beemaps-source-018`
- **WHEN** 5 requests with 5 different polygons arrive at the same time, and the daily limit is 2 with the count 0
- **THEN** 2 requests go upstream, and the other 3 get `429` with `{error:'budget'}`
- **AND** the file ends with the count 2
- **AND** the writes of the file run one after the other, and the last write holds the last count

#### Scenario: Answer a repeat from memory `beemaps-source-019`
- **WHEN** the same polygon and the same `since` arrive again within 600 seconds of the first answer, with any `limit`
- **THEN** the route gives the frames cut to the new `limit`, with `cached` true, sends no request and does not change the count
- **AND** the answer holds the `credits` of the upstream answer that filled the memory
- **AND** an answer that is 599 seconds old is served from memory, and an answer that is 600 seconds old is not
- **AND** the memory holds at most 32 answers. When a 33rd answer arrives, the memory drops the answer that it stored first
- **AND** an error answer stays out of the memory

#### Scenario: Share an upstream request that is in flight `beemaps-source-020`
- **WHEN** a request arrives while an upstream request for the same polygon and the same `since` has not ended
- **THEN** the route waits for that request, sends no other request and adds nothing to the count
- **AND** each waiting request gets the frames cut to its own `limit`, with `cached` true
- **AND** an error answer of the upstream request goes to each waiting request

#### Scenario: Limit the requests `beemaps-source-021`
- **WHEN** more than 6 requests reach the rate-limit step in 60 seconds
- **THEN** the route answers `429` with `{error:'rate_limited'}` and the header `Retry-After` 60
- **AND** all requests come from this machine, so the route keeps one count and not one count for each address
- **AND** a request that gets its answer from memory counts for this limit
- **AND** after 6 requests at the second 0, the 7th request at the second 59 is refused
- **AND** the 7th request at the second 60 passes

#### Scenario: Run the steps in order `beemaps-source-022`
- **WHEN** a request meets more than one step that would answer
- **THEN** the first step in this order answers: method, local request, rate limit, body, area, date, `limit`, key, memory, hold, budget
- **AND** the memory step answers when an answer is in memory or an upstream request for the same polygon and `since` is in flight
- **AND** a request with an answer in memory gets that answer during a hold and when the daily limit is used
- **AND** the route sends an upstream request only when all eleven steps pass

### Requirement: Upstream failures
The route MUST answer an upstream failure with a fixed error and MUST NOT send another request while the hold of that failure lasts.
Origin: spec-first

#### Scenario: Name the failure `beemaps-source-023`
- **WHEN** the upstream answers `401` or `403`
- **THEN** the route answers `403` with `{error:'key_rejected', keyRejected:true}`
- **AND** an upstream `402` gives `402` with `{error:'no_credit'}`
- **AND** an upstream `429` gives `429` with `{error:'upstream_rate_limit', retryAfter}` and the header `Retry-After`
- **AND** `retryAfter` is the upstream header `Retry-After` when it has digits only and is from 1 to 600. A value above 600 gives 600, and any other value gives 60
- **AND** any other status that is not `2xx`, a thrown error and a timeout give `502` with `{error:'upstream_failed'}`
- **AND** a body that is not JSON, or that is larger than 4194304 bytes, gives `502` with `{error:'bad_upstream'}`
- **AND** each of these calls counts against the daily limit

#### Scenario: Hold after a refusal `beemaps-source-024`
- **WHEN** the upstream answered `401`, `403`, `402` or `429`
- **THEN** a request that reaches the hold step gets the same answer for 300 seconds after `401` or `403`, and for 600 seconds after `402`
- **AND** it gets the same answer for the `retryAfter` seconds after `429`
- **AND** that answer holds the seconds that remain, rounded up, as `retryAfter` and as the header `Retry-After`
- **AND** during the hold the route sends no request and does not change the count
- **AND** after 299 seconds of a 300 second hold the route still holds, and after 300 seconds the next request goes to the upstream

### Requirement: Filtered answer
The answer MUST hold only the id, the position and the time of each frame. It MUST NOT hold a URL, a device or a sensor value.
Origin: spec-first

#### Scenario: Keep only the allowed fields `beemaps-source-025`
- **WHEN** the upstream document has the list `frames` with items that have `url`, `device`, `imu`, `width`, `height`, `sequence`, `idx`, `position` and `timestamp`
- **THEN** each frame of the answer has exactly the fields `id`, `lat`, `lon` and `timestamp`
- **AND** `lat` and `lon` are `position.lat` and `position.lon`, each as `Number(value.toFixed(6))`
- **AND** `timestamp` is `toISOString()` of the date that the upstream `timestamp` text gives
- **AND** `id` is the first 16 lowercase hexadecimal characters of a SHA-256 hash
- **AND** the hash is of the answer values `timestamp`, `lat` and `lon`, each written as text and joined by "|"
- **AND** the item with the `timestamp` "2026-10-01T12:00:00Z", `position.lat` 10.5 and `position.lon` 20.25 gives the `timestamp` "2026-10-01T12:00:00.000Z" and the `id` "e79cd5d7c1102b08"
- **AND** an item is dropped when its `timestamp` is not a text that gives a valid date
- **AND** an item is dropped when `position.lat` is not a finite number from -90 to 90
- **AND** an item is dropped when `position.lon` is not a finite number from -180 to 180
- **AND** the text of the answer has no "http"

#### Scenario: Cut, order and limit the frames `beemaps-source-026`
- **WHEN** the body has `since` and `limit`
- **THEN** a frame with a time before 00:00:00 UTC of `since` is dropped
- **AND** a frame with an `id` that an earlier frame already has is dropped
- **AND** the frames are ordered with the newest first, and with the smaller `id` first for equal times
- **AND** the answer holds at most `limit` frames, and `total` is the number of frames after the cut and the drop

#### Scenario: Refuse a document of the wrong shape `beemaps-source-027`
- **WHEN** the upstream JSON is not an object, or its `frames` is not a list
- **THEN** the route answers `502` with `{error:'bad_upstream'}`
- **AND** the route reads at most the first 5000 items of the list
- **AND** an item of the list that is not an object is dropped

#### Scenario: Give the shape of the answer `beemaps-source-028`
- **WHEN** a request succeeds
- **THEN** the answer is `200` with the fields `source`, `frames`, `count`, `total`, `truncated`, `cached`, `since`, `budget` and `credits`
- **AND** `source` is "Bee Maps", `count` is the length of `frames`, and `since` is the text of the body or null
- **AND** `budget` is an object with `used`, the count of the day, and `limit`, the daily limit
- **AND** `credits` is an object with `used`, `remaining` and `cost`, from the upstream `creditsUsed`, `creditsRemaining` and `cost`. Each is the number when it is finite and 0 or more, and null in all other cases
- **AND** `truncated` is true when `total` is more than `limit`, or when the upstream list has more than 5000 items. It is false in all other cases
- **AND** each answer of `/api/beemaps/frames` has the headers `Content-Type` "application/json; charset=utf-8" and `Cache-Control` "no-store"
