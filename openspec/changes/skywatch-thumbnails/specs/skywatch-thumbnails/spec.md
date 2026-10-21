## ADDED Requirements

### Requirement: Thumbnail route
The plugin `skywatch-thumbnail-proxy` MUST answer only a path `/api/skywatch/thumbnail/<id>`, where the id meets the id rule of `skywatch-source-012`. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the route `skywatch-thumbnails-001`
- **WHEN** a test installs the plugin and sends GET requests to `/api/skywatch/thumbnail/abc` and to `/api/skywatch/thumbnail/abc?x=1`
- **THEN** each of the two requests gets an answer
- **AND** the paths `/api/skywatch/thumbnail`, `/api/skywatch/thumbnail/` and `/api/skywatch/thumbnail/a/b` go to `next` with no answer
- **AND** the paths `/api/skywatch/thumbnail/a.b` and `/api/skywatch/thumbnail/%41` go to `next` with no answer
- **AND** a path with an id of 128 letters gets an answer
- **AND** a path with an id of 129 letters goes to `next` with no answer
- **AND** the plugin name is "skywatch-thumbnail-proxy"
- **AND** `configureServer` and `configurePreviewServer` install the same route
- **AND** the list that `localProviderPlugins` returns holds this plugin once
- **AND** in that list, this plugin is directly after the plugin "skywatch-proxy"

### Requirement: Same-site GET requests
The thumbnail route MUST accept only a GET request that passes `admitSameSiteRequest()`.
Origin: spec-first

#### Scenario: Refuse a request from another site `skywatch-thumbnails-002`
- **WHEN** a GET request for a thumbnail path fails one check of `admitSameSiteRequest()`
- **THEN** the answer is `403` with `{"error":"cross_origin"}`, and the plugin sends no upstream request
- **AND** the samples include the header `Sec-Fetch-Site: cross-site`, the proxy header `X-Forwarded-For` and the origin `null`
- **AND** the samples include the origin `http://example.test` with the host `localhost:5173`
- **AND** a request with the host `godseye.example.test`, the origin `http://godseye.example.test` and `Sec-Fetch-Site: same-origin` passes this step

#### Scenario: Refuse a method that is not GET `skywatch-thumbnails-003`
- **WHEN** a POST, PUT, DELETE or HEAD request for a thumbnail path passes `admitSameSiteRequest()`
- **THEN** the answer is `405` with `{"error":"Method not allowed"}`, and the plugin sends no upstream request

### Requirement: Off by default
The thumbnail route MUST send no upstream request when the variable `SKYWATCH_THUMBNAILS` is not the text `true`.
Origin: spec-first

#### Scenario: Answer when the thumbnails are off `skywatch-thumbnails-004`
- **WHEN** a GET request for a thumbnail path passes the steps before the variable step, and `SKYWATCH_THUMBNAILS` is not the text `true`
- **THEN** the answer is `404` with `{"error":"thumbnails_off"}`, and the plugin sends no upstream request
- **AND** the samples include no variable, an empty text and the texts `1`, `yes`, `TRUE` and `true ` with a space at the end

### Requirement: Request limit
The thumbnail route MUST limit the requests with a rate limit.
Origin: spec-first

#### Scenario: Limit the requests `skywatch-thumbnails-005`
- **WHEN** more than 30 thumbnail requests reach the rate-limit step in 60000 ms
- **THEN** each request after the 30th gets `429` with `{"error":"rate_limited"}` and the header `Retry-After: 60`
- **AND** after 29 requests at the time 0 ms, the 30th request at 59999 ms passes
- **AND** after 30 requests at the time 0 ms, the 31st request at 59999 ms gets that answer
- **AND** after 30 requests at the time 0 ms, the 31st request at 60000 ms passes
- **AND** the plugin has one count for all requests, so requests from two socket addresses add to the same count
- **AND** a request that the image store answers counts for this limit

### Requirement: Known scenes only
The thumbnail route MUST send a request only for the thumbnail of a scene that a kept answer of the scenes route gave.
Origin: spec-first

#### Scenario: Find the thumbnail of a scene `skywatch-thumbnails-006`
- **WHEN** a thumbnail request names an id, and the test makes the two plugins with one call of `skywatchPlugins()`
- **THEN** the thumbnail plugin gets the URL from the function `thumbnailUrlOf` of the scenes plugin of the same call
- **AND** a kept answer is a good answer in the store of `skywatch-source-015` that is less than 600000 ms old
- **AND** `thumbnailUrlOf` reads the kept answers from the newest answer to the oldest answer
- **AND** in each kept answer, `thumbnailUrlOf` looks only at the scenes in `scenes` that have `thumbnail` true
- **AND** `thumbnailUrlOf` gives the upstream `thumbnail_uri` text of the first such scene with that id in the newest kept answer that has one
- **AND** when no kept answer has such a scene, the thumbnail plugin answers `404` with `{"error":"unknown_scene"}`, and it sends no upstream request
- **AND** an answer that is 599999 ms old gives the URL, and an answer that is 600000 ms old does not give it
- **AND** the samples include two kept answers with different URLs for one id, and one answer with two scenes that have the same id
- **AND** the samples include a scene after the first 50 scenes of `skywatch-source-021`, and a scene with `thumbnail` false
- **AND** a thumbnail plugin that the test makes with no option `thumbnailUrlOf` answers `404` with `{"error":"unknown_scene"}` for each id

### Requirement: Checked thumbnail URL
The thumbnail route MUST send a request only to a parsed URL with the scheme `https:` and no user name, password or port. It MUST send no request to an IP address or a loopback name.
Origin: spec-first

#### Scenario: Check the URL before the request `skywatch-thumbnails-007`
- **WHEN** the function `thumbnailUrlOf` of the options gives a text for the id
- **THEN** the thumbnail plugin parses the text as an absolute URL
- **AND** the thumbnail plugin sends the request only when the parsed URL has the scheme `https:` and an empty port
- **AND** the parsed URL must also have an empty user name and an empty password
- **AND** the host name of the parsed URL, with one dot at its end removed, must not be an IPv4 address or an IPv6 address
- **AND** that host name must also not be `localhost` or a name that ends with `.localhost`
- **AND** for a text that is not an absolute URL and for each other URL, the answer is `502` with `{"error":"bad_upstream"}`
- **AND** for each refused text, the thumbnail plugin sends no upstream request
- **AND** the refused samples include `not a url`, `http://cdn.example.test/t.png` and `https://user@cdn.example.test/t.png`
- **AND** the refused samples also include `https://cdn.example.test:8443/t.png`, `https://127.0.0.1/t.png`, `https://[::1]/t.png` and `https://2130706433/t.png`
- **AND** the refused samples also include `https://localhost/t.png`, `https://localhost./t.png` and `https://a.localhost/t.png`
- **AND** the thumbnail plugin accepts `https://cdn.example.test:443/t.png`, because the URL parser removes the port 443

### Requirement: One upstream request
The thumbnail route MUST send one GET request to the checked thumbnail URL for each thumbnail request that the image store step does not answer.
Origin: spec-first

#### Scenario: Request the thumbnail `skywatch-thumbnails-008`
- **WHEN** the URL passes the checks, and the image store step does not answer
- **THEN** the thumbnail plugin sends one GET request to the `href` text of the parsed URL, with the option `redirect: 'error'`
- **AND** the request has the header `Accept: image/png, image/jpeg, image/webp`
- **AND** the request has the header `x-api-key` with the trimmed key only when the host name is `api.skywatch.co` and the trimmed key is not empty
- **AND** the samples include a key with spaces at its start and at its end, and a key of only spaces
- **AND** the request has no other header
- **AND** the time limit of 15000 ms covers the headers and the body
- **AND** the thumbnail plugin clears the timer after it reads the body, and at once when it reads no body

### Requirement: Checked image
The thumbnail route MUST send only an image of the type PNG, JPEG or WebP with at most 1048576 bytes.
Origin: spec-first

#### Scenario: Check the image `skywatch-thumbnails-009`
- **WHEN** the upstream answer has the status `200`
- **THEN** the media type is the text of the header `Content-Type` before the first `;`, in lower case
- **AND** the thumbnail plugin removes the white space at the start and at the end of the media type
- **AND** the media type must be `image/png`, `image/jpeg` or `image/webp`, and the thumbnail plugin reads no body for another media type
- **AND** the body must have at most 1048576 bytes
- **AND** the first bytes must be the hexadecimal bytes 89 50 4E 47 0D 0A 1A 0A for `image/png`, and FF D8 FF for `image/jpeg`
- **AND** for `image/webp`, the first 4 bytes must be the ASCII text "RIFF"
- **AND** for `image/webp`, the 9th to the 12th byte must be the ASCII text "WEBP"
- **AND** each answer 200 that does not meet these rules is the failure `bad_upstream`
- **AND** a body read that stops with another error, such as the end of the time limit, is the failure `upstream_failed`
- **AND** the samples of `bad_upstream` include the media types `image/svg+xml` and `text/html`, and an answer with no header `Content-Type`
- **AND** the samples of `bad_upstream` also include a body of 0 bytes, a body of 1048577 bytes and a header `Content-Length: 1048577`
- **AND** the samples of `bad_upstream` also include the media type `image/png` with the first bytes of a JPEG image
- **AND** a body of 1048576 bytes passes
- **AND** the header text `Image/PNG; charset=x` gives the media type `image/png`, and the header text `image/png ;x` also gives `image/png`

### Requirement: Thumbnail failures
The thumbnail route MUST name each failure of the upstream request. A failure answer MUST NOT hold the URL, the host name or the key text.
Origin: spec-first

#### Scenario: Name the failure `skywatch-thumbnails-010`
- **WHEN** the upstream request fails
- **THEN** an answer with a status that is not `200` gives `502` with `{"error":"upstream_failed"}`
- **AND** a fetch that throws an error gives `502` with `{"error":"upstream_failed"}`
- **AND** the samples of such an error include a redirect and the end of the time limit
- **AND** a failure of `skywatch-thumbnails-009` gives `502` with the error of that failure
- **AND** no failure answer and no header of an answer holds the thumbnail URL, its host name or the key text

### Requirement: Thumbnail answer
The thumbnail route MUST send the bytes of the checked image with headers that tell a browser not to read it as another type.
Origin: spec-first

#### Scenario: Send the thumbnail `skywatch-thumbnails-011`
- **WHEN** the image passes the checks of `skywatch-thumbnails-009`
- **THEN** the answer is `200`, and its body has the same bytes as the upstream body
- **AND** the answer has the header `Content-Type` with the media type, and the header `Content-Length` with the number of bytes
- **AND** the answer has the headers `Cache-Control: private, max-age=600` and `X-Content-Type-Options: nosniff`
- **AND** the answer has the header `Content-Security-Policy: default-src 'none'`
- **AND** the thumbnail plugin sets no other header on the answer, so it copies no header of the upstream answer
- **AND** each answer that is not `200` from a step after the path step has the header `Cache-Control: no-store`
- **AND** each such answer has the header `Content-Type: application/json; charset=utf-8`

### Requirement: Image store
The thumbnail route MUST keep each good image for 600000 ms, and it MUST share an upstream request that is in flight.
Origin: spec-first

#### Scenario: Answer from the image store `skywatch-thumbnails-012`
- **WHEN** a thumbnail request has the same URL as a good image that the image store keeps
- **THEN** the thumbnail plugin sends the same bytes with the headers of `skywatch-thumbnails-011`, and it sends no upstream request
- **AND** the image store finds an image by the `href` text of the URL
- **AND** the image store gives an image that is 599999 ms old, and it does not give an image that is 600000 ms old
- **AND** the image store keeps at most 32 images, and it removes the oldest image first
- **AND** the image store keeps no failure, so the next request after a failure sends a new upstream request

#### Scenario: Share an upstream request that is in flight `skywatch-thumbnails-013`
- **WHEN** a thumbnail request arrives while an upstream request for the same URL has not ended
- **THEN** the request waits for that upstream request, and the thumbnail plugin sends no other request
- **AND** the request gets the image of that upstream request, or the failure of that upstream request

### Requirement: Thumbnail steps
The thumbnail route MUST run its steps in one fixed order.
Origin: spec-first

#### Scenario: Run the steps in order `skywatch-thumbnails-014`
- **WHEN** a thumbnail request meets more than one step that can answer
- **THEN** the first step in this order answers: path, same site, method, variable, rate limit, scene, URL check, image store
- **AND** the same-site step is the check of `skywatch-thumbnails-002`, and the variable step is the check of `skywatch-thumbnails-004`
- **AND** the image store step answers when the image store keeps the image, or when an upstream request for the same URL is in flight
- **AND** the thumbnail plugin sends an upstream request only when all eight steps pass

### Requirement: Thumbnail log
The plugin MUST write one log line for each upstream request that it sends. A line MUST NOT hold the key text, a scene id, a URL or a host name.
Origin: spec-first

#### Scenario: Log each upstream request `skywatch-thumbnails-015`
- **WHEN** a test gives the thumbnail plugin the options `log`, `now` and a fake fetch function
- **AND** the fake `now` gives a time T before the request, and the fake fetch moves it to T + 25 ms
- **THEN** a good image of 4 bytes gives the line "[skywatch] thumbnail ok bytes=4 ms=25"
- **AND** a failure gives the line "[skywatch] thumbnail failed kind=<kind> ms=25", where the kind is the error of `skywatch-thumbnails-010`
- **AND** a request that the image store answers, or that a step before the upstream request answers, writes no line
- **AND** no line holds the key text, the scene id, the URL or its host name
