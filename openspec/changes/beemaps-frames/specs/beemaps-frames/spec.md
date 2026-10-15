## ADDED Requirements

### Requirement: Layer record
The layer `beemaps` MUST have the name "Bee Maps Frames", the icon "📸", the source name "Bee Maps" and the update interval 0. It MUST NOT accept parameters.
Origin: spec-first

#### Scenario: Describe the layer `beemaps-frames-001`
- **WHEN** a test creates the layer with a fake source
- **THEN** the `id` is "beemaps", the `name` is "Bee Maps Frames", the `icon` is "📸" and the `source` is "Bee Maps"
- **AND** the `updateInterval` is 0
- **AND** the layer has no method `setParams`
- **AND** `getStats` gives `count` 0, `lastUpdate` null and `error` null
- **AND** the layer throws an error for a source without `getStatus` and `getFrames`, and for a second `init`

### Requirement: No request without a press
The layer MUST send a request for frames only when a person presses the button of its row. It MUST send at most one request for each press. After an error, it MUST send no request until a person presses the button again.
Origin: spec-first

#### Scenario: Ask only for the status `beemaps-frames-002`
- **WHEN** a test initializes and enables the layer, runs `update` 3 times, moves the camera of the viewer, disables the layer and enables it again
- **THEN** the source gets one `getStatus` call for each `update` and no `getFrames` call
- **AND** the layer adds no listener to the camera or to the scene of the viewer
- **AND** `update` on a layer that is not enabled returns false and sends no call

#### Scenario: Fetch only on a real press `beemaps-frames-003`
- **WHEN** a test enables the layer and reads `getRowControls`
- **THEN** the controls have one chip with the `id` "fetch" and the label "Fetch frames here"
- **AND** the chip has a function `onClick` and no `params`
- **AND** one call of `onClick` gives one `getFrames` call
- **AND** after `disable`, `getRowControls` has no chip, and a call of the old `onClick` gives no `getFrames` call

#### Scenario: Send one request for each press `beemaps-frames-004`
- **WHEN** a test calls `onClick` of the chip, and calls it again before the first request ends
- **THEN** the source gets one `getFrames` call
- **AND** while the request runs, the chip has the label "Fetching…" and `disabled` true
- **AND** an `update` during the request keeps the label "Fetching…" and `disabled` true, and sends no `getFrames` call
- **AND** when the request ends, the chip has the label "Fetch frames here" and `disabled` false

#### Scenario: Send no request after an error until the next press `beemaps-frames-005`
- **WHEN** `getFrames` rejects, or gives `ok` false with the error "upstream_rate_limit", or gives `ok` false with the error "upstream_failed"
- **THEN** the source has 1 `getFrames` call after the fake clock moves 10 minutes, after 3 `update` calls and after `disable` and `enable`
- **AND** the chip is enabled again, and the next press sends one request

### Requirement: Status of the key
The layer MUST read the status of the route when it is updated. It MUST disable the chip when the status says that there is no key.
Origin: spec-first

#### Scenario: Read the status `beemaps-frames-006`
- **WHEN** `update` reads `getStatus` with `configured` false, and no earlier press has failed
- **THEN** the chip has `disabled` true, and the info text is "No Bee Maps key. Set BEEMAPS_API_KEY in .env and restart the app."
- **AND** a call of `onClick` while the chip is disabled sends no request
- **AND** when `configured` is true, the chip has `disabled` false
- **AND** then the info text is the hint of the readout
- **AND** a good answer of `getFrames` that arrives after a status with no key keeps the text for no key

#### Scenario: Report a status that fails `beemaps-frames-007`
- **WHEN** `getStatus` rejects, or gives `ok` false
- **THEN** `update` returns true, and the info text is "The server did not give the status of the key."
- **AND** the stats have `error` equal to the message of a rejection
- **AND** they have `error` "The server did not give the status of the key." when the rejection has no message
- **AND** they have `error` "The server did not give the status of the key." when the result is `ok` false and has no `error`
- **AND** the chip has `disabled` false
- **AND** a later `update` with a good status removes that text and the `error` of the failed status
- **AND** a good answer of `getFrames` after a failed status also removes that text and the `error` of the failed status
- **AND** a press that fails after a failed status shows the message and the `error` of the press

### Requirement: View box
The layer MUST build the box of a request from the point in the middle of the view. The box MUST have a size of about 4 km², and the server MUST accept it.
Origin: spec-first

#### Scenario: Build the box from the middle of the view `beemaps-frames-008`
- **WHEN** a test gives the function `viewBox` the middle of the view at the latitude and longitude of a row
- **THEN** the centre is each value rounded to the nearest multiple of 0.005, and a value exactly between two multiples goes to the higher one
- **AND** the half height is 1000 metres on a sphere of radius 6371008.8 metres, written as degrees of latitude
- **AND** the half width is the half height divided by the cosine of the centre latitude
- **AND** the box is [west, south, east, north] with each value rounded to 6 decimals
- **AND** the layer calls `pickEllipsoid` at half of `clientWidth` and half of `clientHeight`, on the ellipsoid of the globe, for the middle of the view
- **AND** the row (60.0, 10.0) gives the box [9.982014, 59.991007, 10.017986, 60.008993]
- **AND** the row (0.0, 0.0) gives [-0.008993, -0.008993, 0.008993, 0.008993]
- **AND** the row (-33.9, 151.2) gives [151.189165, -33.908993, 151.210835, -33.891007]
- **AND** the row (0.0025, 0.0025) gives the centre (0.005, 0.005) and the box [-0.003993, -0.003993, 0.013993, 0.013993]
- **AND** the row (-0.0025, -0.0025) gives the centre (0.0, 0.0) and the same box as the row (0.0, 0.0)
- **AND** the row (59.9976, 10.0031) gives the centre (60.0, 10.005) and the box [9.987014, 59.991007, 10.022986, 60.008993]
- **AND** the row (30.2672, -97.7431) gives the centre (30.265, -97.745) and the box [-97.755412, 30.256007, -97.734588, 30.273993]

#### Scenario: Refuse a view that has no box `beemaps-frames-009`
- **WHEN** a person presses the chip in a view that cannot give a box
- **THEN** no request is sent, and the info text names the reason
- **AND** a view cannot give a box when its middle shows the sky, and then the middle of the view given to `viewBox` is null
- **AND** a middle of the view with a value that is not a finite number also gives the reason sky
- **AND** a canvas with no `clientWidth` or no `clientHeight`, and a pick that throws, also give the reason sky
- **AND** it cannot give a box when the centre has a latitude above 80 or below -80
- **AND** it cannot give a box when the box goes past longitude 180 or -180
- **AND** when two reasons apply, the reason is the first of the sky, the latitude and the longitude
- **AND** the stats have `error` equal to the text of the reason
- **AND** for the sky the text is "Point the view at the ground and press again."
- **AND** for the latitude the text is "Move the view to a latitude from -80 to 80 degrees and press again."
- **AND** for the longitude the text is "Move the view away from the 180th meridian and press again."
- **AND** the row (80.002, 0.0) gives a box, and the row (80.003, 0.0) is refused for the latitude
- **AND** the row (0.0, 179.99) gives a box, and the rows (0.0, 179.995) and (0.0, -179.995) are refused for the longitude
- **AND** the row (25.93, 179.99) gives a box with the east value 180
- **AND** the row (25.93, -179.99) gives a box with the west value -180

#### Scenario: Build only boxes that the server accepts `beemaps-frames-010`
- **WHEN** a test builds the box for each latitude from -80 to 80 in steps of 5
- **AND** it does so for each longitude from -170 to 170 in steps of 10
- **THEN** the function `validateRequest` of the server accepts the body `{bbox, limit:200}` for each box
- **AND** the area of each box, from the function `boxAreaKm2` of the server, is from 3.99 to 4.01 km²

### Requirement: Browser source
The source MUST read the status and post the box through the same-origin routes of the provider. It MUST read at most 1 MiB of an answer.
Origin: spec-first

#### Scenario: Read the status route `beemaps-frames-011`
- **WHEN** a test calls `getStatus` with a fake fetch function
- **THEN** the fake gets one `GET` request for "/api/beemaps/status" with the signal of the call
- **AND** the body `{"configured":true}` gives `{ok:true, configured:true}`, and `{"configured":false}` gives `{ok:true, configured:false}`
- **AND** another body, a status that is not `2xx` and a rejection give `{ok:false}`

#### Scenario: Post the box `beemaps-frames-012`
- **WHEN** a test calls `getFrames` with the box [9.982014, 59.991007, 10.017986, 60.008993]
- **THEN** the fake gets one `POST` request for "/api/beemaps/frames" with the signal of the call
- **AND** the only header is `Content-Type` "application/json"
- **AND** the body is the text `{"bbox":[9.982014,59.991007,10.017986,60.008993],"limit":200}`
- **AND** a good answer gives `{ok:true, answer}`, where `answer` is the result of the answer records
- **AND** a source that gets no fetch function uses the fetch function of the page

#### Scenario: Report a request that fails `beemaps-frames-013`
- **WHEN** the answer has a status that is not `2xx` and a JSON body with the fields `error`, `retryAfter`, `used` and `limit`
- **THEN** `getFrames` gives `{ok:false, status, error}`, with `retryAfter`, `used` and `limit` when each is a whole number of 0 or more
- **AND** a JSON body without a text `error` gives the error "unknown"
- **AND** a body that is not JSON gives the error "bad_answer" with the status of the answer
- **AND** a body of 1048576 bytes is read, and a body of 1048577 bytes gives the error "bad_answer"
- **AND** a rejection gives the status 0 and the error "unreachable"
- **AND** a call that does not end in 30 seconds is aborted and gives the status 0 and the error "unreachable"
- **AND** the timer of that call is cleared when the call ends
- **AND** each case above that gives `ok` false sends exactly one request to the fake fetch function, also after the test runs every timer
- **AND** a call whose own signal is aborted rejects with the abort error

### Requirement: Answer records
The layer MUST keep only the frames that have a valid id, position and time, and MUST keep at most 200 frames.
Origin: spec-first

#### Scenario: Keep the valid frames `beemaps-frames-014`
- **WHEN** a test gives the answer a list with valid frames and with frames that are not valid
- **THEN** each kept frame has exactly the fields `id`, `lat`, `lon`, `timestamp` and `time`, where `time` is `Date.parse` of the `timestamp`
- **AND** a frame is dropped when its `id` is not 16 lowercase hexadecimal characters
- **AND** a frame is dropped when `lat` is not a finite number from -90 to 90
- **AND** a frame is dropped when `lon` is not a finite number from -180 to 180
- **AND** a frame is dropped when its `timestamp` is not a text of the form `YYYY-MM-DDTHH:MM:SS`, then an optional fraction, then `Z`
- **AND** a frame is dropped when `Date.parse` does not read its `timestamp`
- **AND** an item that is not an object is dropped
- **AND** a frame is dropped when an earlier frame has the same `id`
- **AND** at most the first 200 valid frames are kept
- **AND** the result has the kept frames as `frames`, and the fields `used`, `limit` and `remaining`
- **AND** `used` and `limit` come from `budget`, `remaining` comes from `credits`, and each is a whole number of 0 or more or null

#### Scenario: Refuse a bad answer `beemaps-frames-015`
- **WHEN** the answer is not an object, or its `frames` is not a list
- **THEN** `getFrames` gives `{ok:false, status:200, error:'bad_answer'}`

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
- **AND** "rate_limited" gives "Too many presses. Wait 60 seconds."
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 30 seconds." for `retryAfter` 30, and "Bee Maps asks you to wait 600 seconds." for `retryAfter` 600
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 1 second." for `retryAfter` 1
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait." when `retryAfter` is not a whole number
- **AND** "no_credit" gives "The Bee Maps account has no credit."
- **AND** "upstream_failed" and "bad_upstream" give "Bee Maps did not answer correctly."
- **AND** "budget_unavailable" gives "The server cannot use its budget file."
- **AND** "bad_area", "area_too_large", "bad_body", "bad_since" and "bad_limit" give "The server refused the request."
- **AND** "unreachable" gives "The server did not answer."
- **AND** "bad_answer" gives "The server sent an answer that the layer cannot read."
- **AND** any other error with the status 418 gives "The server answered with an unknown error (418)."

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
- **AND** the hint is "A press asks for the newest frames in 4 km² at the view centre. It can cost money."
- **AND** an answer of 3 frames has the newest at "2026-10-14T08:03:00.000Z", `used` 3, `limit` 20 and `remaining` 998
- **AND** for that answer the text is "3 frames · newest 2026-10-14 · requests today 3 of 20 · credits left 998"
- **AND** the date of the newest frame is the date in UTC, also when the time zone of the machine is not UTC
- **AND** with 1 frame, the text starts with "1 frame · newest"
- **AND** with no frame, the text starts with "0 frames" and has no newest part
- **AND** with `used` or `limit` null, the part "requests today" is left out
- **AND** with `remaining` null, the part "credits left" is left out
- **AND** with a message and an answer, the text is the message, then " · ", then the text of the answer
- **AND** with a message and no answer, the text is the message

### Requirement: Layer display
While it is enabled, the layer MUST show the points of the answer to its newest press. It MUST keep them when a later press fails, and it MUST release everything when it is disabled or destroyed.
Origin: spec-first

#### Scenario: Show the points `beemaps-frames-019`
- **WHEN** the layer is enabled and a press gets an answer with 3 frames
- **THEN** the data source has 3 entities, and the id of each entity is "beemaps:" followed by the `id` of the frame
- **AND** each entity has a point on the ground at the position of the frame
- **AND** the point has the color, the alpha and the size of the model
- **AND** the stats have `count` 3, a `lastUpdate` and `error` null
- **AND** a second good answer replaces the points of the first

#### Scenario: Keep the points when a press fails `beemaps-frames-020`
- **WHEN** a press fails after a good answer
- **THEN** the data source keeps its entities, and the info text starts with the message of the failure
- **AND** the stats have `count` unchanged and `error` equal to that message
- **AND** a press that has no box does not change the points either
- **AND** a good answer after a failure removes the message and the `error` of the stats

#### Scenario: Stop on disable `beemaps-frames-021`
- **WHEN** a test disables the layer while a request runs
- **THEN** the request is aborted, an answer that arrives afterwards changes nothing, and the data source is hidden and has no entity
- **AND** the stats have `count` 0, and the next enable shows the hint and no message
- **AND** a status answer that arrives after `disable` changes nothing, and a new `update` aborts the status request of the one before

#### Scenario: Release everything on destroy `beemaps-frames-022`
- **WHEN** a test calls `destroy` on a layer that shows points
- **THEN** the viewer has no data source of the layer, and the stats have `count` 0 and `lastUpdate` null
- **AND** `destroy` aborts the request in flight, and a second `destroy` does nothing
- **AND** `destroy` on a layer that was never initialized does nothing

#### Scenario: Tell the panel about each change `beemaps-frames-023`
- **WHEN** a test sets a row controls listener, and then presses the chip
- **THEN** the listener is called when the request starts and when it ends, and when `update` ends
- **AND** a press that has no box calls the listener once
- **AND** after `setRowControlsListener(null)` the listener is not called

### Requirement: Registration
The application MUST register the layer in the catalog, the share link, the layer panel and the credits, and MUST keep it out of voice.
Origin: spec-first

#### Scenario: Register the layer and its share token `beemaps-frames-024`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layer "beemaps" and the reference sources have the key "beemaps" with the functions `getStatus` and `getFrames`
- **AND** the share link registry has the entry "beemaps" with the token "5" and the disposition "enabled-only"
- **AND** the share link "v=2&l=5" decodes to the enabled layer "beemaps"
- **AND** the layer comes right after the layer "reticulum" in the order of the catalog
- **AND** the source contract "beemaps" names the layer "beemaps" and the methods `getStatus` and `getFrames`
- **AND** a catalog without the source "beemaps" gives the layer the stats error "Data source not configured: beemaps"
- **AND** the manager `setLayerParams` for "beemaps" returns false, and the source gets no call

#### Scenario: Put the layer in the Cameras group `beemaps-frames-025`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Cameras" ends with the layer "beemaps", after "street-level"

#### Scenario: Keep the layer out of voice `beemaps-frames-026`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "beemaps" has the text "The Bee Maps layer has no voice tools."

#### Scenario: Credit the data `beemaps-frames-027`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry with the key "beemaps" names Bee Maps and links to "https://beemaps.com/"
