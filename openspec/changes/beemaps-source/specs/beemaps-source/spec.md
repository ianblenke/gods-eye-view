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
- **THEN** the answer is `200` with `{configured, used, limit}`, and `configured` is true only for a key that has text after trimming
- **AND** `used` is the number of upstream calls of today (UTC), and `limit` is the daily limit
- **AND** the key text is not in the answer
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
- **AND** a POST from a loopback socket, with a loopback host and the same origin, passes this check

### Requirement: Checked input
The route MUST accept only a box or one polygon of at most 5 km². It MUST check every input before it spends anything.
Origin: spec-first

#### Scenario: Read the body `beemaps-source-005`
- **WHEN** the body is larger than 8192 bytes, or is not a JSON object, or has a field other than `bbox`, `polygon`, `since` and `limit`
- **THEN** the route answers `400` with `{error:'bad_body'}`
- **AND** a valid request of exactly 8192 bytes passes this check

#### Scenario: Build the polygon from a box `beemaps-source-006`
- **WHEN** the body has `bbox` as the four numbers west, south, east and north
- **THEN** the ring is [west, south], [east, south], [east, north], [west, north] and [west, south], in that order, with the longitude first
- **AND** the route answers `400` with `{error:'bad_area'}` when a number is not finite
- **AND** it gives the same answer when west is not less than east, or when south is not less than north
- **AND** it gives the same answer when a longitude is outside -180 to 180, or when a latitude is outside -90 to 90

#### Scenario: Accept a polygon `beemaps-source-007`
- **WHEN** the body has `polygon`, an object with the `type` "Polygon" and `coordinates` that hold one ring
- **AND** the ring has 4 to 101 positions, and its first and last positions are equal
- **AND** each position is a longitude from -180 to 180 followed by a latitude from -90 to 90
- **THEN** the ring goes to the upstream request as it is
- **AND** the route answers `400` with `{error:'bad_area'}` for a `type` that is not "Polygon", and for more than one ring
- **AND** it gives the same answer for a ring with fewer than 4 or more than 101 positions
- **AND** it gives the same answer for a ring whose first and last positions differ
- **AND** it gives the same answer for a position that is not two finite numbers in range

#### Scenario: Need one area `beemaps-source-008`
- **WHEN** the body has both `bbox` and `polygon`, or has neither
- **THEN** the route answers `400` with `{error:'bad_area'}`

#### Scenario: Refuse an area of more than 5 km² `beemaps-source-009`
- **WHEN** the area of the ring is more than 5 km², computed on a sphere of radius 6371008.8 metres
- **THEN** the route answers `400` with `{error:'area_too_large', maxKm2:5}`
- **AND** the box [0, 0, 0.0201, 0.02] has the area 4.9705 km² and passes
- **AND** the box [0, 0, 0.0204, 0.02] has the area 5.0447 km² and is refused

#### Scenario: Read the date `beemaps-source-010`
- **WHEN** the body has `since` as a text `YYYY-MM-DD`
- **THEN** the route sends it as `min_week` in the upstream request, and it keeps only the frames at or after 00:00:00 UTC of that day
- **AND** the route answers `400` with `{error:'bad_since'}` for a text that is not a real calendar date
- **AND** it gives the same answer for a date before 2020-01-01, and for a date after today (UTC)

#### Scenario: Read the limit `beemaps-source-011`
- **WHEN** the body has `limit`
- **THEN** the value is a whole number from 1 to 200, and the default is 100
- **AND** the route answers `400` with `{error:'bad_limit'}` for any other value

### Requirement: Key on the server
The key MUST come from the server variable `BEEMAPS_API_KEY`. It MUST NOT reach the browser, an answer or a console line.
Origin: spec-first

#### Scenario: Refuse a request without a key `beemaps-source-012`
- **WHEN** a valid request arrives and `BEEMAPS_API_KEY` is missing, empty or only spaces
- **THEN** the route answers `503` with `{error:'no_key', keyRequired:true}`
- **AND** it sends no upstream request and does not change the budget file

#### Scenario: Keep the key out of the browser `beemaps-source-013`
- **WHEN** a test sets `BEEMAPS_API_KEY` to a fixture text, makes a request that succeeds and makes a request that the upstream refuses
- **THEN** the key text is in no answer body, no answer header and no console line
- **AND** the browser config of the build has no define that holds the key text
- **AND** the upstream request has the key only in the header `Authorization`, as "Basic " followed by the key

### Requirement: One fixed upstream request
The provider MUST send each upstream request to one fixed URL. It MUST hold no code that creates a Burst.
Origin: spec-first

#### Scenario: Send the upstream request `beemaps-source-014`
- **WHEN** a valid request passes every check
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
- **THEN** it adds one to the count of the day in `.gev-cache/beemaps/budget.json`, it waits for the write, and then it sends the request
- **AND** the limit is the whole number in `BEEMAPS_DAILY_QUERIES`. The limit is 20 when that variable is missing, or is not a whole number of 1 or more
- **AND** when the count equals the limit, the route answers `429` with `{error:'budget', used, limit}` and sends no request

#### Scenario: Keep the count across restarts and days `beemaps-source-017`
- **WHEN** a new plugin starts and the file has a count for today (UTC)
- **THEN** the plugin continues from that count
- **AND** a count with another date starts again at 0
- **AND** when the file cannot be written, the route answers `503` with `{error:'budget_unavailable'}` and sends no request

#### Scenario: Answer a repeat from memory `beemaps-source-018`
- **WHEN** the same polygon, date and limit arrive again within 600 seconds of the first answer
- **THEN** the route gives the same frames with `cached` true, it sends no request and it does not change the count
- **AND** the memory holds at most 32 answers, and the oldest answer goes first
- **AND** an answer that was an error stays out of the memory

#### Scenario: Limit the requests `beemaps-source-019`
- **WHEN** one client sends more than 6 requests in 60 seconds, or all clients send more than 24
- **THEN** the route answers `429` with `{error:'rate_limited'}` and the header `Retry-After` 10
- **AND** an answer from memory counts for this limit

#### Scenario: Run the checks in order `beemaps-source-020`
- **WHEN** a request fails two checks
- **THEN** the answer names the first failed check in this order: method, local request, rate limit, body, area, date, limit, key, memory, budget
- **AND** the route sends no upstream request when any check fails

### Requirement: Upstream failures
The route MUST answer an upstream failure with a fixed error and MUST NOT send another request while the hold of that failure lasts.
Origin: spec-first

#### Scenario: Name the failure `beemaps-source-021`
- **WHEN** the upstream answers `401` or `403`
- **THEN** the route answers `403` with `{error:'key_rejected', keyRejected:true}`
- **AND** an upstream `402` gives `402` with `{error:'no_credit'}`
- **AND** an upstream `429` gives `429` with `{error:'upstream_rate_limit', retryAfter}` and the header `Retry-After`
- **AND** `retryAfter` is the number of seconds in the upstream header `Retry-After`, with 60 when the header is missing and at most 600
- **AND** any other status that is not `2xx`, a thrown error and a timeout give `502` with `{error:'upstream_failed'}`
- **AND** a body that is not JSON, or that is larger than 4 MiB, gives `502` with `{error:'bad_upstream'}`
- **AND** each of these calls counted against the budget

#### Scenario: Hold after a refusal `beemaps-source-022`
- **WHEN** the upstream answered `401`, `403`, `402` or `429`
- **THEN** the route gives the same answer for 300 seconds after `401` or `403`, and for 600 seconds after `402`
- **AND** it gives the same answer for the `Retry-After` seconds after `429`
- **AND** during the hold the route sends no request and does not change the count
- **AND** after the hold the next request goes to the upstream

### Requirement: Filtered answer
The answer MUST hold only the id, the position and the time of each frame. It MUST NOT hold a URL, a device or a sensor value.
Origin: spec-first

#### Scenario: Keep only the allowed fields `beemaps-source-023`
- **WHEN** the upstream document has frames with `url`, `device`, `imu`, `width`, `height`, `sequence`, `idx` and other fields
- **THEN** each frame of the answer has exactly the fields `id`, `lat`, `lon` and `timestamp`
- **AND** `lat` and `lon` are `position.lat` and `position.lon` rounded to 6 decimals, and `timestamp` is the frame time in the form of `toISOString()`
- **AND** `id` is the first 16 hex characters of the SHA-256 of the text `timestamp|lat|lon`
- **AND** a frame without a finite position in range or without a valid time is dropped
- **AND** the text of the answer has no "http"

#### Scenario: Cut, order and limit the frames `beemaps-source-024`
- **WHEN** the body has `since` and `limit`
- **THEN** a frame with a time before 00:00:00 UTC of `since` is dropped
- **AND** the frames are ordered with the newest first, and with the smaller `id` first for equal times
- **AND** the answer holds at most `limit` frames
- **AND** `total` is the number of frames after the cut, and `truncated` is true when `total` is more than `limit`

#### Scenario: Refuse a document of the wrong shape `beemaps-source-025`
- **WHEN** the upstream JSON is not an object with the list `frames`
- **THEN** the route answers `502` with `{error:'bad_upstream'}`
- **AND** an item of the list that is not an object is skipped
- **AND** the route reads at most the first 5000 items, and `truncated` is true when it left items out

#### Scenario: Give the shape of the answer `beemaps-source-026`
- **WHEN** a request succeeds
- **THEN** the answer is `200` with the fields `source`, `frames`, `count`, `total`, `truncated`, `cached`, `since` and `budget`
- **AND** `source` is "Bee Maps", and `budget` is an object with `used` and `limit`
- **AND** `count` is the length of `frames`, and `since` is the text of the body or null
- **AND** the headers are `Content-Type` "application/json; charset=utf-8" and `Cache-Control` "no-store"
