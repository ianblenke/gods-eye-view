## MODIFIED Requirements

### Requirement: View box
The layer MUST build the box of a request from the point in the middle of the view. The box MUST have a size of about 0.09 km², and the server MUST accept it.
Origin: spec-first

#### Scenario: Build the box from the middle of the view `beemaps-frames-008`
- **WHEN** a test gives the function `framesBox` the middle of the view at the latitude and longitude of a row
- **THEN** the centre is each value divided by 0.001, rounded with `Math.round`, multiplied by 0.001 and written with 3 decimals
- **AND** the half height is 150 metres on a sphere of radius 6371008.8 metres, written as degrees of latitude
- **AND** the half width is the half height divided by the cosine of the centre latitude, and not the cosine of the latitude of the row
- **AND** the box is [west, south, east, north] with each value rounded to 6 decimals
- **AND** the layer calls `pickEllipsoid` at half of `clientWidth` and half of `clientHeight`, on the ellipsoid of the globe, for the middle of the view
- **AND** the row (60.0, 10.0) gives the box [9.997302, 59.998651, 10.002698, 60.001349]
- **AND** the row (0.0, 0.0) gives [-0.001349, -0.001349, 0.001349, 0.001349]
- **AND** the row (-33.9, 151.2) gives [151.198375, -33.901349, 151.201625, -33.898651]
- **AND** the row (0.0005, 0.0005) gives the centre (0.001, 0.001) and the box [-0.000349, -0.000349, 0.002349, 0.002349]
- **AND** the row (-0.0005, -0.0005) gives the centre (0.0, 0.0) and the same box as the row (0.0, 0.0)
- **AND** the row (39.975, 0.0) gives the box [-0.00176, 39.973651, 0.00176, 39.976349]
- **AND** the row (59.9996, 10.0013) gives the centre (60.0, 10.001) and the box [9.998302, 59.998651, 10.003698, 60.001349]
- **AND** the row (30.2672, -97.7431) gives the centre (30.267, -97.743) and the box [-97.744562, 30.265651, -97.741438, 30.268349]
- **AND** the row (79.5004, 10.0) gives the centre (79.5, 10.0) and the box [9.992598, 79.498651, 10.007402, 79.501349]

#### Scenario: Refuse a view that has no box `beemaps-frames-009`
- **WHEN** a person presses the chip in a view that cannot give a box
- **THEN** no request is sent, and the info text names the reason
- **AND** a view cannot give a box when its middle shows the sky, and then the middle of the view given to `framesBox` is null
- **AND** a middle of the view with a value that is not a finite number also gives the reason sky
- **AND** a canvas with no `clientWidth` or no `clientHeight`, and a pick that throws, also give the reason sky
- **AND** it cannot give a box when the centre has a latitude above 80 or below -80
- **AND** it cannot give a box when the box goes past longitude 180 or -180
- **AND** when two reasons apply, the reason is the first of the sky, the latitude and the longitude
- **AND** the stats have `error` equal to the text of the reason
- **AND** for the sky the text is "Point the view at the ground and press again."
- **AND** for the latitude the text is "Move the view to a latitude from -80 to 80 degrees and press again."
- **AND** for the longitude the text is "Move the view away from the 180th meridian and press again."
- **AND** the row (80.0004, 0.0) gives a box, and the row (80.0006, 0.0) is refused for the latitude
- **AND** the row (0.0, 179.998) gives a box, and the rows (0.0, 179.999) and (0.0, -179.999) are refused for the longitude
- **AND** the row (47.59, 179.998) gives a box with the east value 180
- **AND** the row (47.59, -179.998) gives a box with the west value -180

#### Scenario: Build only boxes that the server accepts `beemaps-frames-010`
- **WHEN** a test builds the box for each latitude from -80 to 80 in steps of 5
- **AND** it does so for each longitude from -170 to 170 in steps of 10
- **THEN** the function `validateRequest` of the server accepts the body `{bbox, limit:200}` for each box
- **AND** the area of each box, from the function `boxAreaKm2` of the server, is from 0.0899 to 0.0901 km²

### Requirement: Display model
The layer MUST style each point by the age of its frame, and MUST write one readout line for the state.
Origin: spec-first

#### Scenario: Style the points by age `beemaps-frames-017`
- **WHEN** a test gives the function `pointStyle` a time and the current time
- **THEN** an age under 604800000 ms gives the color "#f59e0b", the alpha 1 and the size 8
- **AND** an age from 604800000 ms and under 2592000000 ms gives the same color, the alpha 0.7 and the size 7
- **AND** an age of 2592000000 ms or more gives the same color, the alpha 0.4 and the size 6
- **AND** a time after the current time gives the style of the first age

#### Scenario: Write the readout `beemaps-frames-018`
- **WHEN** a test gives the function `readoutText` the state of the layer
- **THEN** with no answer and no message, the text is the hint
- **AND** the hint is "A press asks for the newest frames in a box of 300 m by 300 m at the view centre. It can cost money."
- **AND** an answer of 3 frames has the newest at "2026-10-14T08:03:00.000Z", `used` 3, `limit` 20 and `remaining` 998
- **AND** for that answer the text is "3 frames · newest 2026-10-14 · requests today 3 of 20 · credits left 998"
- **AND** the date of the newest frame is the date in UTC, also when the time zone of the machine is not UTC
- **AND** with 1 frame, the text starts with "1 frame · newest"
- **AND** with no frame, the text starts with "0 frames" and has no newest part
- **AND** with `used` or `limit` null, the part "requests today" is left out
- **AND** with `remaining` null, the part "credits left" is left out
- **AND** with a message and an answer, the text is the message, then " · ", then the text of the answer
- **AND** with a message and no answer, the text is the message

### Requirement: Messages
The layer MUST show a message that names the cause for each answer of the route that is an error.
Origin: spec-first

#### Scenario: Name each failure `beemaps-frames-016`
- **WHEN** a test gives the function `describeFailure` the error of a row
- **THEN** the text of the row is the result
- **AND** "cross_origin" gives "Only the machine that runs the server can fetch frames. Start the app with make up-codex."
- **AND** "key_rejected" gives "Bee Maps refused the key. Check BEEMAPS_API_KEY in .env."
- **AND** "no_key" gives "No Bee Maps key. Set BEEMAPS_API_KEY in .env and restart the app."
- **AND** "budget" gives "The daily limit of 20 requests is used." for `limit` 20, and "The daily limit of 5 requests is used." for `limit` 5
- **AND** "budget" gives "The daily limit of 1 request is used." for `limit` 1
- **AND** "budget" gives "The daily limit is used." when `limit` is not a whole number
- **AND** "credit_budget" gives "The daily limit of 500 credits is used." for `limit` 500, and "The daily limit of 1 credit is used." for `limit` 1
- **AND** "credit_budget" gives "The daily credit limit is used." when `limit` is not a whole number
- **AND** "rate_limited" gives "Too many presses. Wait 60 seconds."
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 30 seconds." for `retryAfter` 30, and "Bee Maps asks you to wait 600 seconds." for `retryAfter` 600
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 1 second." for `retryAfter` 1
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 0 seconds." for `retryAfter` 0
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 2 seconds." for `retryAfter` 2
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait." when `retryAfter` is not a whole number
- **AND** "no_credit" gives "The Bee Maps account has no credit."
- **AND** "upstream_failed" and "bad_upstream" give "Bee Maps did not answer correctly."
- **AND** "budget_unavailable" gives "The server cannot use its budget file."
- **AND** "bad_area", "area_too_large", "bad_body", "bad_since" and "bad_limit" give "The server refused the request."
- **AND** "unreachable" gives "The server did not answer."
- **AND** "bad_answer" gives "The server sent an answer that the layer cannot read."
- **AND** any other error with the status 418 gives "The server answered with an unknown error (418)."
