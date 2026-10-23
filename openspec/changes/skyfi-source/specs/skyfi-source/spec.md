## ADDED Requirements
### Requirement: Provider routes
The plugin `skyfi-proxy` MUST answer only `/api/skyfi/status` and `/api/skyfi/scenes`. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the two routes `skyfi-source-001`
- **WHEN** a test installs the plugin and sends requests to `/api/skyfi/status`, `/api/skyfi/scenes` and `/api/skyfi/other`
- **THEN** the first two paths get an answer, and the third path goes to `next` with no answer
- **AND** the path `/api/skyfi/scenes/x` goes to `next` with no answer
- **AND** the path `/api/skyfi/status/x` goes to `next` with no answer, also with the header `Sec-Fetch-Site: cross-site`
- **AND** the plugin name is "skyfi-proxy"
- **AND** `configureServer` and `configurePreviewServer` install the same routes
- **AND** the list that `localProviderPlugins` returns holds this plugin once

#### Scenario: Report the status `skyfi-source-002`
- **WHEN** a GET request for `/api/skyfi/status` arrives from the same site
- **THEN** the answer is `200` with `{"configured":true}` when `SKYFI_API_KEY` holds a character that is not white space
- **AND** the answer is `200` with `{"configured":false}` when `SKYFI_API_KEY` is not set or holds only white space
- **AND** a request with another method gets `405` with `{"error":"Method not allowed"}`
- **AND** a request with the header `Sec-Fetch-Site: cross-site` gets `403`, and the answer does not hold the key text
- **AND** the status route sends no upstream request

### Requirement: Same-site requests only
The scenes route MUST accept only a POST request that passes `admitSameSiteRequest()` and has the header `Content-Type: application/json`.
Origin: spec-first

#### Scenario: Refuse a method that is not POST `skyfi-source-003`
- **WHEN** a GET, PUT, PATCH or DELETE request for `/api/skyfi/scenes` arrives
- **THEN** the answer is `405` with `{"error":"Method not allowed"}`, and the plugin sends no upstream request

#### Scenario: Refuse a request from another site `skyfi-source-004`
- **WHEN** a POST request for `/api/skyfi/scenes` fails one check of `admitSameSiteRequest()`, or its header `Content-Type` is not exactly `application/json`
- **THEN** the answer is `403` with `{"error":"cross_origin"}`, and the plugin sends no upstream request
- **AND** the samples include the header `Sec-Fetch-Site: cross-site`, the proxy header `X-Forwarded-For` and the origin `null`
- **AND** the samples include the origin `http://example.test` with the host `localhost:5173`
- **AND** the samples include the header texts `text/plain` and `application/json; charset=utf-8`, and a request with no header `Content-Type`

#### Scenario: Accept a request through the reverse proxy `skyfi-source-005`
- **WHEN** a valid POST request for `/api/skyfi/scenes` comes from the socket address `192.0.2.10` with the host `godseye.example.test`
- **AND** the request has the origin `http://godseye.example.test`, the header `Sec-Fetch-Site: same-origin` and no proxy header
- **AND** the request has the header `Content-Type: application/json`, and `SKYFI_API_KEY` holds a key
- **THEN** the plugin sends the search request, and the answer is `200`
- **AND** a request from `127.0.0.1` with the host `localhost:5173`, the origin `http://localhost:5173` and no `Sec-Fetch-Site` header also gets `200`
- **AND** a request with the origin `https://godseye.example.test` on an encrypted socket also gets `200`
- **AND** a request with the origin `https://godseye.example.test` on a socket that is not encrypted gets `403` with `{"error":"cross_origin"}`

### Requirement: Checked input
The scenes route MUST accept only a body that passes the checks of the SkyWatch scenes route. It MUST refuse each other body before it reads the key.
Origin: spec-first

#### Scenario: Use the checks of the SkyWatch route `skyfi-source-006`
- **WHEN** a same-site scenes request arrives with a body
- **THEN** the route reads and checks the body with the rules of `skywatch-source-005`, `skywatch-source-006`, `skywatch-source-007` and `skywatch-source-008`
- **AND** the UTC date of the server clock in those rules is the UTC date of the option `now` of the plugin
- **AND** a body of 4097 bytes gets `400` with `{"error":"bad_body"}`
- **AND** a body of exactly 4096 bytes with a valid box and valid dates passes these checks
- **AND** a body with the field `x` gets `400` with `{"error":"bad_body"}`
- **AND** a body with the box `[1,0,0,1]` gets `400` with `{"error":"bad_bbox"}`
- **AND** a body with the box `[0,0,0.4497,0.4497]` gets `400` with `{"error":"area_too_large","maxKm2":2500}`
- **AND** a body with the dates `2026-01-01` and `2026-04-03` gets `400` with `{"error":"bad_dates"}`
- **AND** a body with the box `[0,0,0.4496,0.4496]` and the dates `2026-01-01` and `2026-04-02` passes these checks
- **AND** when `now` gives a time on `2026-10-22`, an `end` of `2026-10-22` passes, and an `end` of `2026-10-23` gets `bad_dates`
- **AND** for each refused body, the plugin sends no upstream request

### Requirement: Key on the server
The plugin MUST read the key from `SKYFI_API_KEY` on the server. It MUST keep the key out of each answer and each log line.
Origin: spec-first

#### Scenario: Refuse a request without a key `skyfi-source-007`
- **WHEN** a valid scenes request arrives, and `SKYFI_API_KEY` is not set or holds only white space
- **THEN** the answer is `503` with `{"error":"no_key","keyRequired":true}`, and the plugin sends no upstream request

#### Scenario: Keep the key out of the browser `skyfi-source-008`
- **WHEN** `SKYFI_API_KEY` holds " fixture-key-Q7 ", and the plugins answer requests for each route
- **THEN** no answer body and no answer header holds the text `fixture-key-Q7`
- **AND** for the search request, the headers object that the plugin gives to the fetch function has `X-Skyfi-Api-Key`
- **AND** the value of that header is `fixture-key-Q7`

### Requirement: One fixed search request
For each upstream search, the plugin MUST send one search request to `https://app.skyfi.com/platform-api/archives`. The plugins MUST send the key only with this request. They MUST make the URL of each other upstream request from a thumbnail link that passes the checks of `skyfi-source-017`.
Origin: spec-first

#### Scenario: Send the search request `skyfi-source-009`
- **WHEN** the plugin starts an upstream search for the box `[w,s,e,n]` and the dates `start` and `end`
- **THEN** it sends one POST request to `https://app.skyfi.com/platform-api/archives`, and no other request
- **AND** the body is the JSON text of an object with the four members `aoi`, `fromDate`, `toDate` and `pageSize`, and no other member
- **AND** `aoi` is the text `POLYGON ((`, the five positions `w s`, `e s`, `e n`, `w n` and `w s`, and the text `))`
- **AND** a comma and a space are between two positions, and each number has 6 digits after the decimal point
- **AND** `fromDate` is `<start>T00:00:00+00:00`, `toDate` is `<end>T23:59:59+00:00`, and `pageSize` is the number 50
- **AND** the samples include the box `[-82.701264,27.735005,-82.213136,28.166195]`
- **AND** that box gives the positions `-82.701264 27.735005`, `-82.213136 27.735005`, `-82.213136 28.166195`, `-82.701264 28.166195` and `-82.701264 27.735005`
- **AND** the samples include the box `[0.0000001,0,1,1]`, which gives a text with `0.000000` and no exponent
- **AND** the headers are `X-Skyfi-Api-Key`, `Content-Type: application/json` and `Accept: application/json`
- **AND** the request has the option `redirect: 'error'`

#### Scenario: Send only the allowed requests `skyfi-source-010`
- **WHEN** a test runs the status route, a valid upstream search, each failure of `skyfi-source-016` and each thumbnail answer of `skyfi-source-020` to `skyfi-source-030`
- **AND** each fake page has a `nextPage` text, and each fake scene has a `tilesUrl` and the two thumbnail links `300x300` and `2048x2048`
- **AND** the fetch function of the test records each URL, method and header name
- **THEN** each recorded request is a request of `skyfi-source-009` or of `skyfi-source-024`
- **AND** the only request with the header `X-Skyfi-Api-Key` is the request of `skyfi-source-009`
- **AND** no recorded URL is the `nextPage` text, a `tilesUrl`, a thumbnail link `2048x2048` or a URL with the path `/platform-api/auth/whoami`, `/platform-api/ping` or `/platform-api/order-archive`
- **AND** no recorded method is a method other than POST for the search and GET for a thumbnail

### Requirement: Search control
The plugin MUST limit the upstream searches with a daily count, an answer store and a rate limit.
Origin: spec-first

#### Scenario: Count the searches of the day `skyfi-source-011`
- **WHEN** a valid scenes request needs a new upstream search
- **THEN** the plugin adds 1 to the count of the UTC day before it sends the first search request
- **AND** the count grows by 1 for one upstream search
- **AND** the daily limit is the number of `SKYFI_DAILY_SEARCHES` when that text has only digits and its number is from 1 to 1000
- **AND** the daily limit is 20 for each other value, and when the variable is not set
- **AND** the samples of the variable include `0`, `1`, `1000` and `1001`
- **AND** when the count of the day is equal to the limit, the answer is `429` with `{"error":"budget","used":<count>,"limit":<limit>}`, and the plugin sends no upstream request
- **AND** the count is 0 at the start of each UTC day

#### Scenario: Answer a repeated request from the store `skyfi-source-012`
- **WHEN** a scenes request has the same box and dates as a valid answer that the store keeps
- **THEN** the plugin gives the scenes of that answer with `cached` true, does not change the count and sends no upstream request
- **AND** the `budget` of the new answer has the count of the day at the time of the new request
- **AND** the store gives an answer that is 599999 ms old, and it does not give an answer that is 600000 ms old
- **AND** the store keeps at most 32 answers, and it removes the oldest answer first
- **AND** after 33 answers for 33 boxes, the store gives the answer of the second box and not the answer of the first box

#### Scenario: Share an upstream search that is in flight `skyfi-source-013`
- **WHEN** a scenes request arrives while an upstream search for the same box and dates has not ended
- **THEN** the request waits for that upstream search, the plugin sends no other request, and the count does not change
- **AND** the request gets the scenes of that upstream search with `cached` true, or its failure

#### Scenario: Limit the requests `skyfi-source-014`
- **WHEN** more than 6 scenes requests reach the rate-limit step in 60000 ms
- **THEN** each request after the sixth gets `429` with `{"error":"rate_limited"}` and the header `Retry-After: 60`
- **AND** after 5 requests at the time 0 ms, the 6th request at 59999 ms passes
- **AND** after 6 requests at the time 0 ms, the 7th request at 59999 ms gets that answer
- **AND** after 6 requests at the time 0 ms, the 7th request at 60000 ms passes
- **AND** a request that the store answers counts for this limit

#### Scenario: Run the steps in order `skyfi-source-015`
- **WHEN** a scenes request meets more than one step that can answer
- **THEN** the first step in this order answers: method, same site, rate limit, body, box, area, dates, key, store, daily count
- **AND** the same-site step is the check of `skyfi-source-004`, with its check of the header `Content-Type`
- **AND** the store step answers when the store keeps an answer, or when an upstream search for the same box and dates is in flight
- **AND** a request that the store step answers gets its answer when the count of the day is equal to the limit
- **AND** the plugin starts an upstream search only when all ten steps pass

### Requirement: Upstream failures
The plugin MUST give a named failure for each search request that does not give a valid page.
Origin: spec-first

#### Scenario: Name the failure `skyfi-source-016`
- **WHEN** SkyFi answers the search request with `401` or `403`
- **THEN** the scenes route answers `403` with `{"error":"key_rejected","keyRejected":true}`
- **AND** an answer `429` gives `429` with `{"error":"upstream_rate_limit","retryAfter":<s>}` and the header `Retry-After: <s>`
- **AND** `<s>` is the number of the upstream header `Retry-After` when the header has only digits and the number is from 1 to 600
- **AND** `<s>` is 600 when the header has only digits and the number is more than 600
- **AND** `<s>` is 60 for each other value of the header, also `0`, and when the upstream answer has no `Retry-After` header
- **AND** each other status that is not `200` gives `502` with `{"error":"upstream_failed"}`, and the samples include `422` and `500`
- **AND** a network error and a redirect give the same answer
- **AND** before the search request, the plugin starts a timer of 15000 ms, and it clears the timer after it reads the body
- **AND** when the time limit ends, the plugin stops the request, and the scenes route gives `upstream_failed`
- **AND** the plugin reads the body only of an answer `200`
- **AND** a body that is not JSON and a body of more than 4194304 bytes give `502` with `{"error":"bad_upstream"}`
- **AND** the plugin reads a body of exactly 4194304 bytes
- **AND** a valid page is an object with an array `archives`, and each other page gives the same answer
- **AND** the store keeps no failure

### Requirement: Filtered answer
The scenes route MUST give only the allowed fields of each scene. It MUST keep the price fields, `tilesUrl` and the thumbnail links out of the answer.
Origin: spec-first

#### Scenario: Keep only the allowed fields `skyfi-source-017`
- **WHEN** a page is a valid page
- **THEN** each scene of the answer has only the fields of the list below, from the upstream value after the arrow
- **AND** the list is `id` ← `archiveId`, `start` ← `captureTimestamp`, `footprint` ← `footprint` and `resolutionM` ← `gsd`
- **AND** the list continues with `provider` ← `provider`, `productType` ← `productType` and `cloudPercent` ← `cloudCoveragePercent`, and it ends with `thumbnail`
- **AND** a valid time is a text that `Date.parse` reads as a finite number, and `start` is the `toISOString()` text of that time
- **AND** the sample `2026-10-22T18:10:34-04:00` gives the `start` `2026-10-22T22:10:34.000Z`
- **AND** `cloudPercent` is a finite number from 0 to 100
- **AND** `resolutionM` is the number `gsd` divided by 100, when `gsd` is a finite number of 0 or more
- **AND** each number field is null when the upstream value does not meet its rule
- **AND** the samples that give null for each number field include null, "7", true, -1 and a value that JSON reads as Infinity
- **AND** a `cloudCoveragePercent` of 101 gives a `cloudPercent` of null, and a `gsd` of 34 gives a `resolutionM` of 0.34
- **AND** `provider` is the upstream text when it has 1 to 40 capital letters, digits or underscores, and null in each other case
- **AND** `productType` is the upstream text when it is one of `DAY`, `NIGHT`, `VIDEO`, `MULTISPECTRAL`, `HYPERSPECTRAL`, `SAR`, `STEREO`, `BASEMAP` and `THERMAL`
- **AND** `productType` is null in each other case
- **AND** `thumbnail` is true when `thumbnailUrls["300x300"]` is a text that meets the rule of the next five items, and false in each other case
- **AND** the text is an `https` URL with the host `app.skyfi.com` or `thumbnails.skyfi.com`, and it has at most 2048 characters
- **AND** the text has no port, no user name, no password and no fragment
- **AND** the samples of `thumbnail` false include the host `skyfi.example.test` and the host `app.skyfi.com.example.test`
- **AND** the samples of `thumbnail` false include the scheme `http`, the port `:8443`, a user name, a fragment and a text of 2049 characters
- **AND** the samples of `thumbnail` false also include a scene that has only the link `2048x2048`, and a scene with a `thumbnailUrls` that is null
- **AND** the route removes an item of `archives` that is not an object
- **AND** the route removes a scene whose `archiveId` is not a text of 1 to 128 ASCII letters, digits, hyphens or underscores
- **AND** the route removes a scene with a `captureTimestamp` that is not a valid time

#### Scenario: Keep the first ring of a polygon `skyfi-source-018`
- **WHEN** a scene has a `footprint` that is a text
- **THEN** a text of the type `POLYGON` gives `{"type":"Polygon","coordinates":[ring]}`, where the ring is the first ring of the WKT polygon
- **AND** the route removes each other ring of the polygon
- **AND** the plugin reads at most 20000 characters, and it removes the scene for a text of 20001 characters
- **AND** a ring of the answer has the longitude and the latitude of each WKT position, as numbers
- **AND** a valid ring has 4 to 2000 positions, and the samples include rings of 3, 4, 2000 and 2001 positions
- **AND** the longitude and the latitude of the first position are equal to those of the last position
- **AND** each position has 2 numbers, a longitude from -180 to 180 and a latitude from -90 to 90, with no exponent
- **AND** the route removes a scene when the text is not a `POLYGON`
- **AND** the route removes a scene when its ring is not a valid ring, and when it has no ring
- **AND** the samples of removed texts include a `MULTIPOLYGON` of one polygon, a `POINT` and the text `POLYGON EMPTY`
- **AND** the samples of removed texts include a position with 3 numbers and a position with the number `1e1`
- **AND** the samples of kept texts include a polygon with a second ring
- **AND** the samples of kept texts include a polygon text that has no space after `POLYGON`, and no space after a comma
- **AND** a scene with a `footprint` that is not a text is removed

#### Scenario: Give the shape of the answer `skyfi-source-019`
- **WHEN** the scenes route gives an answer `200`
- **THEN** the answer has the fields `source`, `scenes`, `count`, `truncated`, `cached` and `budget`
- **AND** `cached` is false for the answer of a new upstream search
- **AND** `source` is "SkyFi", and `budget` is an object with `used`, the count of the day, and `limit`, the daily limit
- **AND** the route sorts the scenes of the page that stay after the checks, with the newest `start` first
- **AND** scenes with an equal `start` are in the code-unit order of `id`, from low to high
- **AND** scenes with an equal `start` and an equal `id` keep the upstream order
- **AND** `scenes` holds the first 50 scenes of that order
- **AND** `count` is the length of `scenes`
- **AND** `truncated` is true when `nextPage` of the page is a text that is not empty
- **AND** `truncated` is also true when more than 50 scenes stay after the checks
- **AND** `truncated` is false in each other case
- **AND** each answer of `/api/skyfi/scenes` has the headers `Content-Type: application/json; charset=utf-8` and `Cache-Control: no-store`

### Requirement: Thumbnail route
The plugin `skyfi-thumbnail-proxy` MUST answer only a path `/api/skyfi/thumbnail/<id>`, where the id is a text of 1 to 128 ASCII letters, digits, hyphens or underscores. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the route `skyfi-source-020`
- **WHEN** a test installs the plugin and sends GET requests to `/api/skyfi/thumbnail/abc` and to `/api/skyfi/thumbnail/abc?x=1`
- **THEN** each of the two requests gets an answer
- **AND** the paths `/api/skyfi/thumbnail`, `/api/skyfi/thumbnail/` and `/api/skyfi/thumbnail/a/b` go to `next` with no answer
- **AND** the paths `/api/skyfi/thumbnail/a.b` and `/api/skyfi/thumbnail/%41` go to `next` with no answer
- **AND** a path with an id of 128 letters gets an answer
- **AND** a path with an id of 129 letters goes to `next` with no answer
- **AND** the plugin name is "skyfi-thumbnail-proxy"
- **AND** `configureServer` and `configurePreviewServer` install the same route
- **AND** the list that `localProviderPlugins` returns holds this plugin once, directly after the plugin "skyfi-proxy"
- **AND** the thumbnail plugin of that list reads `process.env`
- **AND** it finds a scene of a kept answer of the plugin "skyfi-proxy" of the same list

#### Scenario: Accept only a same-site GET request `skyfi-source-021`
- **WHEN** a thumbnail request fails one check of `admitSameSiteRequest()`
- **THEN** the answer is `403` with `{"error":"cross_origin"}`, and the plugin sends no upstream request
- **AND** the samples include the header `Sec-Fetch-Site: cross-site`, the proxy header `X-Forwarded-For` and the origin `null`
- **AND** the samples include the origin `http://example.test` with the host `localhost:5173`
- **AND** the samples include the origin `https://godseye.example.test` with the host `godseye.example.test` on a socket that is not encrypted
- **AND** a request with the host `godseye.example.test`, the origin `http://godseye.example.test` and `Sec-Fetch-Site: same-origin` passes this step
- **AND** a request with the host `godseye.example.test` and the origin `https://godseye.example.test` on an encrypted socket passes this step
- **AND** a POST, PUT, DELETE or HEAD request that passes this step gets `405` with `{"error":"Method not allowed"}`, and the plugin sends no upstream request

#### Scenario: Answer when the thumbnails are off `skyfi-source-022`
- **WHEN** a GET thumbnail request passes the steps before the variable step, and `SKYFI_THUMBNAILS` is exactly the text `false`
- **THEN** the answer is `404` with `{"error":"thumbnails_off"}`, and the plugin sends no upstream request
- **AND** the variable step passes when `SKYFI_THUMBNAILS` is not set
- **AND** the variable step passes for each other text
- **AND** the samples of other texts include an empty text, `true`, `FALSE`, `0` and `false ` with a space at the end

#### Scenario: Limit the thumbnail requests `skyfi-source-023`
- **WHEN** more than 30 thumbnail requests reach the rate-limit step in 60000 ms
- **THEN** each request after the 30th gets `429` with `{"error":"rate_limited"}` and the header `Retry-After: 60`
- **AND** after 29 requests at the time 0 ms, the 30th request at 59999 ms passes
- **AND** after 30 requests at the time 0 ms, the 31st request at 59999 ms gets that answer
- **AND** after 30 requests at the time 0 ms, the 31st request at 60000 ms passes
- **AND** the plugin has one count for all requests, so requests from two socket addresses add to the same count

#### Scenario: Request the thumbnail of a known scene `skyfi-source-024`
- **WHEN** a thumbnail request names an id, and the test makes the two plugins with one call of `skyfiPlugins()`
- **THEN** the thumbnail plugin gets the URL from the function `thumbnailUrlOf` of the scenes plugin of the same call
- **AND** `thumbnailUrlOf` reads the kept answers from the newest answer to the oldest answer, and it looks only at the scenes in `scenes`
- **AND** it uses the newest kept answer that has a scene with that id and with `thumbnail` true
- **AND** it gives the thumbnail URL of the first such scene in that answer
- **AND** the thumbnail plugin then sends one GET request to that URL
- **AND** the request has the option `redirect: 'error'` and the header `Accept: image/png, image/jpeg, image/webp`, and no other header
- **AND** an answer that is 599999 ms old gives the URL, and an answer that is 600000 ms old does not give it
- **AND** the samples include a URL on the host `thumbnails.skyfi.com` and a URL on the host `app.skyfi.com`
- **AND** the samples include one id in two kept answers with different URLs
- **AND** the samples include one answer with two scenes that have the same id, where the first scene has `thumbnail` false

#### Scenario: Refuse a scene that no kept answer has `skyfi-source-025`
- **WHEN** no kept answer has a scene with the id of a thumbnail request and with `thumbnail` true
- **THEN** the answer is `404` with `{"error":"unknown_scene"}`, and the plugin sends no upstream request
- **AND** the samples include a scene with `thumbnail` false and a scene after the first 50 scenes of `skyfi-source-019`
- **AND** the thumbnail plugin of a second call of `skyfiPlugins()` does not find a scene of the first call
- **AND** a thumbnail plugin that the test makes with no option `thumbnailUrlOf` answers `404` with `{"error":"unknown_scene"}` for each id

#### Scenario: Send no key with a thumbnail request `skyfi-source-026`
- **WHEN** a thumbnail request reaches the upstream request, and `SKYFI_API_KEY` holds " fixture-key-Q7 "
- **THEN** the upstream request has no header `X-Skyfi-Api-Key`, no header `Authorization` and no header `Cookie`
- **AND** no header and no URL of the upstream request holds the text `fixture-key-Q7`
- **AND** a request with `SKYFI_API_KEY` not set also reaches the upstream request, and it gets `200` for a valid image

#### Scenario: Check the image `skyfi-source-027`
- **WHEN** the upstream answer of a thumbnail request has the status `200`
- **THEN** the thumbnail plugin checks the media type, the size and the first bytes with the rules of `skywatch-thumbnails-009`
- **AND** a PNG image of 9 bytes with the header `Content-Type: image/png` passes
- **AND** a PNG image of 1048576 bytes with the first bytes of a PNG image passes
- **AND** the media type `text/html` gives `502` with `{"error":"bad_upstream"}`
- **AND** a body of 1048577 bytes, and the media type `image/png` with the first bytes of a JPEG image, give the same answer
- **AND** a body that the thumbnail plugin cannot read for a reason other than the limit of 1048576 bytes gives `502` with `{"error":"upstream_failed"}`

#### Scenario: Name the thumbnail failure `skyfi-source-028`
- **WHEN** the upstream request of a thumbnail request fails
- **THEN** an upstream answer with a status that is not `200` gives `502` with `{"error":"upstream_failed"}`
- **AND** the samples of such a status include `204`, `302`, `401`, `404` and `500`
- **AND** a fetch that throws an error gives `502` with `{"error":"upstream_failed"}`
- **AND** the samples of such an error include a redirect and the end of the time limit of 15000 ms
- **AND** the time limit covers the headers and the body
- **AND** the thumbnail plugin clears the timer after it reads the body, and immediately when it reads no body
- **AND** no failure answer and no header of an answer holds the thumbnail URL, its host name or the key text

#### Scenario: Send the thumbnail and keep no copy `skyfi-source-029`
- **WHEN** the image passes the checks of `skyfi-source-027`
- **THEN** the answer is `200`, and its body has the same bytes as the upstream body
- **AND** the answer has the header `Content-Type` with the media type, and the header `Content-Length` with the number of bytes
- **AND** the answer has the headers `Cache-Control: no-store`, `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'none'`
- **AND** the thumbnail plugin sets no other header on the answer, so it copies no header of the upstream answer
- **AND** each answer that is not `200` from a step after the path step has the headers `Cache-Control: no-store` and `Content-Type: application/json; charset=utf-8`
- **AND** the thumbnail plugin keeps no image, so two thumbnail requests for the same id send two upstream requests

#### Scenario: Run the thumbnail steps in order `skyfi-source-030`
- **WHEN** a thumbnail request meets more than one step that can answer
- **THEN** the first step in this order answers: path, same site, method, variable, rate limit, scene
- **AND** the thumbnail plugin sends an upstream request only when all six steps pass

### Requirement: Request log
The plugins MUST write one log line for each upstream search and for each upstream request of the thumbnail plugin. A line MUST NOT hold the key text, a scene id, a URL or a host name.
Origin: spec-first

#### Scenario: Log each upstream search `skyfi-source-031`
- **WHEN** a test gives the scenes plugin the options `log`, `now` and a fake fetch function
- **AND** `ms` is the value of `now` when the upstream search ends, minus its value when the upstream search starts
- **AND** the fake `now` gives a time T before the upstream search, and the fake fetch moves it to T + 40 ms
- **THEN** a valid answer gives "[skyfi] ok scenes=3 requests=1 ms=40"
- **AND** in that sample, the page has 4 items in `archives`, and the route removes one of them
- **AND** `scenes` is the `count` of the answer
- **AND** a failure gives exactly one line, "[skyfi] failed kind=<failure> requests=1 ms=40"
- **AND** an answer `401` gives "[skyfi] failed kind=key_rejected requests=1 ms=40"
- **AND** an answer `500` gives "[skyfi] failed kind=upstream_failed requests=1 ms=40"
- **AND** a request that does not start an upstream search writes no line

#### Scenario: Log each upstream request of the thumbnail plugin `skyfi-source-032`
- **WHEN** a test gives the thumbnail plugin the options `log`, `now` and a fake fetch function
- **AND** the fake `now` gives a time T before the upstream request, and the fake fetch moves it to T + 25 ms
- **THEN** a JPEG image of 4 bytes gives the line "[skyfi] thumbnail ok bytes=4 ms=25"
- **AND** a failure gives the line "[skyfi] thumbnail failed kind=<kind> ms=25", where the kind is the error of `skyfi-source-027` or `skyfi-source-028`
- **AND** a thumbnail request that a step before the upstream request answers writes no line
- **AND** the samples of such a step include the answers `thumbnails_off`, `rate_limited` and `unknown_scene`
- **AND** no line of `skyfi-source-031` or of this scenario holds the key text, a scene id, `https://`, `app.skyfi.com` or `thumbnails.skyfi.com`

