## ADDED Requirements

### Requirement: Layer record
The function `createSceneLayer` MUST make the layer of one service: Planet or SkyFi. Each layer MUST have the update interval 0, and it MUST accept only the parameter `scene`.
Origin: spec-first

#### Scenario: Describe the layer `scene-layers-001`
- **WHEN** a test creates the layer of each service with a fake source and a fake overlay host
- **THEN** the layer of Planet has the `id` "planet-scenes", the `name` "Planet Scenes", the `icon` "🪐" and the `source` "Planet"
- **AND** the layer of SkyFi has the `id` "skyfi-scenes", the `name` "SkyFi Scenes", the `icon` "🛰" and the `source` "SkyFi"
- **AND** the scenarios below name the values of the layer under test: `<layer>` is the `id` of the layer and `<label>` is its `source`
- **AND** they name the list label as `<list>`, the key variable as `<key>`, the thumbnail variable as `<thumbs>` and the route base as `<route>`
- **AND** for Planet, `<list>` is "Planet scenes", `<key>` is PLANET_API_KEY, `<thumbs>` is PLANET_THUMBNAILS and `<route>` is "/api/planet"
- **AND** for SkyFi, `<list>` is "SkyFi scenes", `<key>` is SKYFI_API_KEY, `<thumbs>` is SKYFI_THUMBNAILS and `<route>` is "/api/skyfi"
- **AND** a test runs each scenario below for the layer of Planet and for the layer of SkyFi
- **AND** the `updateInterval` is 0, and the layer has a method `setParams`
- **AND** `getStats` gives `count` 0, `lastUpdate` null and `error` null
- **AND** the layer throws a `TypeError` for a source that lacks `getStatus`, `searchScenes` or `getThumbnail`
- **AND** the layer throws a `TypeError` for an overlay host that lacks `setEntries`, `clearSource` or `setVisible`
- **AND** the function throws a `TypeError` for a service that is not "planet" or "skyfi"
- **AND** a second `init` throws an error
### Requirement: No search without a press
The layer MUST send a search only when a person presses the chip "search" of its row. It MUST send at most one search for each press. After an error, it MUST send no search until a person presses that chip again.
Origin: spec-first

#### Scenario: Ask only for the status `scene-layers-002`
- **WHEN** a test initializes and enables the layer, runs `update` 3 times, moves the camera of the viewer, disables the layer and enables it again
- **THEN** the source gets one `getStatus` call for each `update`, and no `searchScenes` call and no `getThumbnail` call
- **AND** the layer adds no listener to the camera or to the Cesium scene of the viewer
- **AND** `update` on a layer that is not enabled returns false, and the layer calls no function of the source

#### Scenario: Search only on a real press `scene-layers-003`
- **WHEN** a test enables the layer and reads `getRowControls`
- **THEN** the controls have one chip with the `id` "search" and the label "Search scenes here"
- **AND** the chip has a function `onClick` and no `params`
- **AND** one call of `onClick` gives one `searchScenes` call
- **AND** after `disable`, `getRowControls` has no chip, and a call of the old `onClick` gives no `searchScenes` call

#### Scenario: Send one search for each press `scene-layers-004`
- **WHEN** a test calls `onClick` of the chip, and calls it again before the first search ends
- **THEN** the source gets one `searchScenes` call
- **AND** while the search runs, the chip has the label "Searching…" and `disabled` true
- **AND** an `update` during the search keeps the label "Searching…" and `disabled` true, and sends no `searchScenes` call
- **AND** when the search ends, the chip has the label "Search scenes here" and `disabled` false

#### Scenario: Send no search after an error until the next press `scene-layers-005`
- **WHEN** `searchScenes` rejects, or gives `ok` false with the error "upstream_rate_limit", or gives `ok` false with the error "search_timeout"
- **THEN** the source has 1 `searchScenes` call after the test moves the fake clock and the mocked timers 10 minutes
- **AND** it has 1 `searchScenes` call after 3 `update` calls, and after `disable` and `enable`
- **AND** the chip is enabled again, and the next press sends one search
- **AND** after a rejection of `searchScenes`, the info text is the text of "unreachable" in `scene-layers-016`

### Requirement: Status of the key
The layer MUST read the status route at each call of `update` while it is enabled. It MUST disable the chip when the status route says that the server has no key.
Origin: spec-first

#### Scenario: Read the status `scene-layers-006`
- **WHEN** `update` reads `getStatus` with `configured` false, and the info text shows no message of a press
- **THEN** the chip has `disabled` true, and the info text is "No <label> key. Set <key> in .env and restart the app."
- **AND** a call of `onClick` while the chip is disabled sends no search
- **AND** when `configured` is true, the chip has `disabled` false, and the info text is the hint of the readout
- **AND** when a good answer of `searchScenes` arrives after a status with no key, the info text starts with the text for no key

#### Scenario: Report a status that fails `scene-layers-007`
- **WHEN** `getStatus` rejects, or gives `ok` false
- **THEN** `update` returns true, and the info text is "The server did not give the status of the key."
- **AND** the stats have `error` equal to the message of a rejection
- **AND** they have `error` "The server did not give the status of the key." when the rejection has no message
- **AND** they have `error` "The server did not give the status of the key." when the result is `ok` false and has no `error`
- **AND** the chip has `disabled` false, also after an earlier status with no key
- **AND** a later `update` with a good status removes that text and the `error` of the failed status
- **AND** a good answer of `searchScenes` after a failed status also removes that text and that `error`
- **AND** a press that fails after a failed status shows the message and the `error` of the press

### Requirement: Search box and dates
The layer MUST build the box of a search from the point in the middle of the view. The box MUST have an area of about 2304 km², and the routes MUST accept it. The window of a search MUST be the last 92 calendar days in UTC.
Origin: spec-first

#### Scenario: Send the box and the dates of the SkyWatch layer `scene-layers-008`
- **WHEN** a test presses the chip with a fake viewer, and the fake clock is at 2026-10-21T12:00:00.000Z
- **AND** the middle of the view of the fake viewer is the point (60.0, 10.0)
- **THEN** the source gets one `searchScenes` call with the box [9.568326, 59.784163, 10.431674, 60.215837], `start` "2026-07-22" and `end` "2026-10-21"
- **AND** the sample (30.2672, -97.7431) gives the box [-97.98991, 30.054163, -97.49009, 30.485837]
- **AND** the sample (-33.9, 151.2) gives the box [150.939959, -34.115837, 151.460041, -33.684163]
- **AND** the layer calls `pickEllipsoid` at half of the `clientWidth` and half of the `clientHeight` of the canvas, with the ellipsoid of the globe
- **AND** the clock 2024-03-01T00:00:00.000Z gives `start` "2023-12-01" and `end` "2024-03-01"
- **AND** a layer without the option `now` uses `Date.now` as its clock
#### Scenario: Refuse a view that has no box `scene-layers-009`
- **WHEN** a person presses the chip in a view that cannot give a box
- **THEN** the layer sends no search, and the info text names the reason
- **AND** a view cannot give a box when its middle shows the sky, and then the layer gives null to `scenesBox`
- **AND** a middle of the view with a value that is not a finite number also gives the reason "sky"
- **AND** a `clientWidth` or a `clientHeight` of the canvas that is 0 or is not there also gives the reason "sky"
- **AND** a `pickEllipsoid` call that throws also gives the reason "sky"
- **AND** a view cannot give a box when the centre of the box has a latitude above 80 or below -80
- **AND** a view cannot give a box when the box goes past longitude 180 or -180
- **AND** when two reasons apply, the reason is the first of "sky", "latitude" and "meridian"
- **AND** the stats have `error` equal to the text of the reason
- **AND** for the reason "sky" the text is "Point the view at the ground and press again."
- **AND** for the reason "latitude" the text is "Move the view to a latitude from -80 to 80 degrees and press again."
- **AND** for the reason "meridian" the text is "Move the view away from the 180th meridian and press again."
- **AND** the sample (80.004, 0.0) gives a box, and the sample (80.006, 0.0) gets the reason "latitude"
- **AND** the sample (-80.004, 0.0) gives a box, and the sample (-80.006, 0.0) gets the reason "latitude"
- **AND** the samples (0.0, 179.78) and (0.0, -179.78) give a box
- **AND** the samples (0.0, 179.79) and (0.0, -179.79) get the reason "meridian"
- **AND** the sample (39.57, 179.72) gives a box with the east value 180, and (39.57, -179.72) gives a box with the west value -180

#### Scenario: Build only boxes that the routes accept `scene-layers-036`
- **WHEN** a test presses the chip for each latitude from -80 to 80 in steps of 5
- **AND** it does so for each longitude from -170 to 170 in steps of 10
- **AND** the fake clock is at 2026-10-21T12:00:00.000Z
- **THEN** the function `validateRequest` of the server accepts each body `{bbox, start, end}` that the layer gives to `searchScenes`
- **AND** the routes of Planet and SkyFi use that function for their checks
- **AND** `start` is "2026-07-22" and `end` is "2026-10-21"
- **AND** the area of each box, from the function `boxAreaKm2` of the server, is from 2303.99 to 2304.01 km²

### Requirement: Browser source
The source MUST read the status, send the search and get a thumbnail through the same-origin routes of the service. It MUST read at most 8 MiB of a search answer and at most 1 MiB of a thumbnail.
Origin: spec-first

#### Scenario: Read the status route `scene-layers-010`
- **WHEN** a test calls `getStatus` with a fake fetch function
- **THEN** the fake fetch function gets one `GET` request for "<route>/status" with the signal of the call
- **AND** the body `{"configured":true}` gives `{ok:true, configured:true}`, and `{"configured":false}` gives `{ok:true, configured:false}`
- **AND** another body, an HTTP status that is not `2xx` and a rejection give `{ok:false}`

#### Scenario: Post the search `scene-layers-011`
- **WHEN** a test calls `searchScenes` with the box [9.568326, 59.784163, 10.431674, 60.215837], `start` "2026-07-22" and `end` "2026-10-21"
- **THEN** the fake fetch function gets one `POST` request for "<route>/scenes" with a signal that the source makes
- **AND** the only header is `Content-Type` "application/json"
- **AND** the body is the text `{"bbox":[9.568326,59.784163,10.431674,60.215837],"start":"2026-07-22","end":"2026-10-21"}`
- **AND** a good answer gives `{ok:true, answer}`, where `answer` is the result of `normalizeAnswer`
- **AND** a source that gets no fetch function uses the fetch function of the page

#### Scenario: Report a search that fails `scene-layers-012`
- **WHEN** the answer has an HTTP status that is not `2xx` and a JSON body with the fields `error`, `retryAfter`, `used` and `limit`
- **THEN** `searchScenes` gives `{ok:false, status, error}`, with `retryAfter`, `used` and `limit` when each is a whole number of 0 or more
- **AND** a JSON body without a text `error` gives the error "unknown"
- **AND** a body that is not JSON gives the error "bad_answer" with the HTTP status of the answer
- **AND** the source reads a body of 8388608 bytes, and a body of 8388609 bytes gives the error "bad_answer"
- **AND** a rejection gives the status 0 and the error "unreachable"
- **AND** the source aborts a call that does not end in 60 seconds, and the call gives the status 0 and the error "unreachable"
- **AND** the source clears the timer of that call when the call ends
- **AND** the source aborts the signal that it makes when the signal of the call aborts, and when the 60 seconds end
- **AND** the call removes its listener from the signal of the call when the call ends
- **AND** each case above that gives `ok` false sends exactly one request to the fake fetch function, also after the test runs each timer
- **AND** a call rejects with the `AbortError` when the signal of the call aborts

#### Scenario: Get a thumbnail `scene-layers-013`
- **WHEN** a test calls `getThumbnail` with the id "scene-1"
- **THEN** the fake fetch function gets one `GET` request for "<route>/thumbnail/scene-1" with a signal that the source makes, and with no other option
- **AND** a `2xx` answer with the media type "image/png", "image/jpeg" or "image/webp" gives `{ok:true, blob}`
- **AND** `blob` holds the bytes of the body and has the `type` of that media type
- **AND** the media type is the text of `Content-Type` before the first ";", with no white space at the start or the end, in lowercase
- **AND** the header "IMAGE/PNG; charset=binary" gives the `type` "image/png"
- **AND** a `2xx` answer with another media type or with no `Content-Type` gives `{ok:false, status, error:'bad_answer'}`
- **AND** the source reads a body of 1048576 bytes, and a body of 1048577 bytes gives the error "bad_answer"
- **AND** an answer with an HTTP status that is not `2xx` gives `{ok:false, status, error}`, where `error` is the text `error` of its JSON body
- **AND** such an answer gives the error "unknown" for a JSON body without a text `error`, and "bad_answer" for a body that is not JSON
- **AND** a rejection gives the status 0 and the error "unreachable"
- **AND** the source aborts a call that does not end in 20 seconds, and the call gives the status 0 and the error "unreachable"
- **AND** the source clears the timer of that call when the call ends, and the call removes its listener from the signal of the call
- **AND** a call rejects with the `AbortError` when the signal of the call aborts

### Requirement: Answer records
The layer MUST keep only the scenes that have a valid id, time and footprint, and MUST keep at most 50 scenes.
Origin: spec-first

#### Scenario: Keep the valid scenes `scene-layers-014`
- **WHEN** a test gives the function `normalizeAnswer` an answer whose `scenes` has valid scenes and scenes that are not valid
- **THEN** each kept scene has exactly the fields `id`, `time`, `rings`, `resolutionM`, `provider`, `cloudPercent` and `thumbnail`
- **AND** `time` is the result of `Date.parse` for the text `start` of the scene
- **AND** `rings` is a list of 1 to 16 rings, and each ring is a list of [longitude, latitude] pairs
- **AND** a footprint of the `type` "Polygon" gives one ring, the one ring of `coordinates`
- **AND** a footprint of the `type` "MultiPolygon" gives one ring for each part of `coordinates`, in the order of the parts
- **AND** the function drops a scene whose `id` is not a text of 1 to 128 characters
- **AND** it drops a scene whose `id` has a character that is not an ASCII letter, a digit, a hyphen or an underscore
- **AND** it drops a scene when `start` is not a text, or when `Date.parse` does not read it
- **AND** it drops a scene when `footprint` is not an object with the `type` "Polygon" or "MultiPolygon"
- **AND** it drops a scene when a Polygon has more or less than one ring in `coordinates`
- **AND** it keeps a `footprint` with the `type` "MultiPolygon" and 1 to 16 parts that each have exactly one ring
- **AND** it drops a scene with a `MultiPolygon` of 0 parts or of 17 parts
- **AND** it drops a scene with a part that does not have exactly one ring
- **AND** it drops a scene when a ring does not have 4 to 2000 positions
- **AND** it drops a scene when a position of a ring is not a list of two finite numbers
- **AND** it drops a scene when a position has a longitude that is not from -180 to 180
- **AND** it drops a scene when a position has a latitude that is not from -90 to 90
- **AND** it drops a scene when the first position and the last position of a ring are not equal
- **AND** it drops an entry of `scenes` that is not an object, and a scene when an earlier scene has the same `id`
- **AND** it keeps at most the first 50 valid scenes, in the order of the answer
- **AND** the samples include rings of 3, 4, 2000 and 2001 positions, ids of 128 and 129 characters, and answers of 50 and 51 scenes
- **AND** `resolutionM` is a finite number of 0 or more, or null
- **AND** `cloudPercent` is a finite number from 0 to 100, or null
- **AND** `provider` is null when the value of the answer is not a text, or is an empty text
- **AND** the function `normalizeAnswer` has the service as its second argument
- **AND** the layer of SkyFi gives the name "Vantor" for the text "VANTOR", "Sentinel-1" for "SENTINEL1_CREODIAS", "Sentinel-2" for "SENTINEL2_CREODIAS" and "Planet" for "PLANET"
- **AND** for the layer of SkyFi, every other text gives the text with each underscore changed to a space, so "SOME_CODE" gives "SOME CODE"
- **AND** the layer of Planet keeps each text as it is, so "PlanetScope", "SkySat" and "SOME_CODE" stay the same
- **AND** `thumbnail` is true only when the value of the answer is true
- **AND** the result has the kept scenes as `scenes`, and the fields `total`, `truncated`, `used` and `limit`
- **AND** `total` is a whole number of 0 or more or null, and `truncated` is true only when the value of the answer is true
- **AND** `used` and `limit` come from `budget`, and each is a whole number of 0 or more or null

#### Scenario: Refuse a bad answer `scene-layers-015`
- **WHEN** the answer is not an object, or its `scenes` is not a list
- **THEN** `normalizeAnswer` gives null, and `searchScenes` gives `{ok:false, status:200, error:'bad_answer'}`

### Requirement: Messages
The layer MUST show a message that names the cause for each failure of the scenes route and the thumbnail route.
Origin: spec-first

#### Scenario: Name each failure of a search `scene-layers-016`
- **WHEN** a test gives the function `describeFailure` the error of a sample
- **THEN** the text of the sample is the result
- **AND** "cross_origin" gives "The server refused the request, because the request did not come from the same site."
- **AND** "key_rejected" gives "<label> refused the key. Check <key> in .env."
- **AND** "no_key" gives "No <label> key. Set <key> in .env and restart the app."
- **AND** "budget" gives "The daily limit of 20 searches is used." for `limit` 20, and "The daily limit of 1 search is used." for `limit` 1
- **AND** "budget" gives "The daily limit of 0 searches is used." for `limit` 0, and "The daily limit is used." when `limit` is not a whole number
- **AND** "rate_limited" gives "Too many searches. Wait 60 seconds."
- **AND** "upstream_rate_limit" gives "<label> asks you to wait 30 seconds." for `retryAfter` 30, and "<label> asks you to wait 1 second." for `retryAfter` 1
- **AND** "upstream_rate_limit" gives "<label> asks you to wait 0 seconds." for `retryAfter` 0, and "<label> asks you to wait." when `retryAfter` is not a whole number
- **AND** "search_timeout" gives "<label> did not complete the search in time. Press again later."
- **AND** "upstream_failed" and "bad_upstream" give "<label> did not answer correctly."
- **AND** "bad_dates" gives "The server refused the dates. Check the clock of this computer."
- **AND** "bad_body", "bad_bbox" and "area_too_large" give "The server refused the request."
- **AND** "unreachable" gives "The server did not answer."
- **AND** "bad_answer" gives "The server sent an answer that the layer cannot read."
- **AND** each other error with the HTTP status 418 gives "The server answered with an unknown error (418)."
- **AND** the error "toString" with the HTTP status 418 also gives that text

#### Scenario: Name each failure of a thumbnail `scene-layers-017`
- **WHEN** a test gives the function `describeThumbnailFailure` the error of a sample
- **THEN** the text of the sample is the result
- **AND** "thumbnails_off" gives "Thumbnails are off. Remove <thumbs>=false from .env and restart the app."
- **AND** "unknown_scene" gives "The server does not keep this scene now. Search again."
- **AND** "rate_limited" gives "Too many thumbnail requests. Wait 60 seconds."
- **AND** "upstream_failed" and "bad_upstream" give "<label> did not give the thumbnail."
- **AND** "cross_origin" gives the text of "cross_origin" in `scene-layers-016`
- **AND** "unreachable" gives "The server did not answer."
- **AND** "bad_answer" gives "The server sent an answer that the layer cannot read."
- **AND** "bad_image" gives "The layer cannot show the thumbnail."
- **AND** each other error with the HTTP status 405 gives "The server answered with an unknown error (405)."
- **AND** the error "toString" with the HTTP status 405 also gives that text

### Requirement: Display model
The layer MUST style each footprint by its selection, and MUST write one readout line for the state. It MUST give one list item for each scene, and the size and the position of the card.
Origin: spec-first

#### Scenario: Style the footprints `scene-layers-018`
- **WHEN** a test gives the function `footprintStyle` the selection of a footprint
- **THEN** a footprint that is not selected gives the color "#38bdf8", the outline alpha 0.9, the width 2 and the fill alpha 0
- **AND** a selected footprint gives the color "#facc15", the outline alpha 1, the width 3 and the fill alpha 0.25

#### Scenario: Write the readout `scene-layers-019`
- **WHEN** a test gives the function `readoutText` the state of the layer
- **THEN** with no answer and no message, the text is the hint
- **AND** the hint is "A press searches 92 days of the <label> archive in a 48 km box at the view centre."
- **AND** an answer of 3 scenes has the newest scene at "2026-10-14T08:03:00.000Z", `used` 3 and `limit` 20
- **AND** for that answer the text is "3 scenes · newest 2026-10-14 · searches today 3 of 20"
- **AND** the date of the newest scene is the date in UTC, also when the time zone of the machine is not UTC
- **AND** with 1 scene, the text starts with "1 scene · newest"
- **AND** with no scene, the text starts with "0 scenes" and has no newest part
- **AND** with `truncated` true, the part "<label> has more scenes" comes right after the first part of the answer text
- **AND** the first part is the count with the newest part, or only the count when the answer has no scene
- **AND** with `used` or `limit` null, the part "searches today" is not in the text
- **AND** with an answer, the text is the message, the text of the answer and the message of the thumbnail, with " · " between them
- **AND** a message or a message of the thumbnail that is null is not in that text
- **AND** with a message and no answer, the text is the message

#### Scenario: Give one list item for each scene `scene-layers-020`
- **WHEN** a test gives the function `sceneList` an answer and the id of the selected scene
- **THEN** the result is null for no answer and for an answer with no scene
- **AND** the result has the `ariaLabel` "<list>" and one item for each scene, in the order of the answer
- **AND** the `id` of an item is "scene:" followed by the `id` of the scene
- **AND** the `lead` of an item is the UTC date of the scene with the form `YYYY-MM-DD`
- **AND** the `text` of an item is the `provider` of the scene, the resolution, the cloud cover and the note "no thumbnail", with " · " between them
- **AND** the text has the note "no thumbnail" only for a scene with `thumbnail` false
- **AND** the text has no part for a `provider`, a resolution or a cloud cover that is null
- **AND** the text is "<label> scene" when it has no part
- **AND** so a scene with `thumbnail` false and no `provider`, resolution or cloud cover has the text "no thumbnail"
- **AND** the resolution 0.5 gives "0.5 m", the resolution 3 gives "3 m", the resolution 0.123456 gives "0.12 m", and 0.126 gives "0.13 m"
- **AND** the cloud cover 3.4 gives "cloud 3%", the cloud cover 3.6 gives "cloud 4%", and the cloud cover 0 gives "cloud 0%"
- **AND** the item of the selected scene has `active` true and the `params` `{scene:null}`
- **AND** each other item has `active` false and the `params` `{scene:<id>}`

#### Scenario: Give the size and the position of the card `scene-layers-021`
- **WHEN** a test gives the function `thumbnailSize` the width and the height of an image
- **THEN** the result has a longer side of 192 pixels, and keeps the ratio of the width to the height
- **AND** (256, 256) gives (192, 192), (512, 256) gives (192, 96), and (100, 400) gives (48, 192)
- **AND** a smaller image grows, so (96, 48) gives (192, 96)
- **AND** each side is the result of `Math.round`, and at least 1, so (1000, 1) gives (192, 1)
- **AND** a width or a height that is not a finite number more than 0 gives null
- **AND** the function `footprintCentre` gives the mean longitude and the mean latitude of each position of a ring, except the last
- **AND** the ring [[0,0],[2,0],[2,2],[0,2],[0,0]] gives the longitude 1 and the latitude 1

### Requirement: Layer display
While it is enabled, the layer MUST show the footprints of the newest good answer that it keeps, also after a later press fails. A call of `disable` MUST abort each request that runs, forget the answer, and remove the footprints and the card. A call of `destroy` MUST release everything.
Origin: spec-first

#### Scenario: Show the footprints `scene-layers-022`
- **WHEN** the layer is enabled and a press gets an answer with 3 scenes
- **THEN** the data source has 3 entities for 3 scenes with one ring each
- **AND** the id of each entity is "<layer>:" followed by the `id` of the scene
- **AND** each entity has a polyline on the ground through each position of the ring of its scene
- **AND** a scene with 3 rings has 3 entities
- **AND** the id of the first is "<layer>:" followed by the `id`, and the ids of the others end with ":1" and ":2"
- **AND** the entities of one scene have the same style
- **AND** the polyline has the color, the outline alpha and the width of the style of a footprint that is not selected
- **AND** an entity of a footprint that is not selected has no polygon
- **AND** the stats have `count` 3 for 3 scenes, `lastUpdate` equal to the time of the clock of the layer, and `error` null
- **AND** `count` is the number of scenes, not the number of entities
- **AND** the row controls have the list of `sceneList` for that answer
- **AND** a second good answer replaces the footprints and the list of the first
- **AND** the layer calls its option `requestRender` with "<layer>" after each change of the entities
- **AND** a layer without the option `requestRender` also shows the footprints

#### Scenario: Keep the footprints when a press fails `scene-layers-023`
- **WHEN** a press fails after a good answer
- **THEN** the data source keeps its entities, the list stays, and the info text starts with the message of the failure
- **AND** the stats have `count` unchanged and `error` equal to that message
- **AND** the selected scene and its thumbnail card stay
- **AND** a press that has no box does not change the footprints either
- **AND** a good answer after a failure removes the message and the `error` of the stats

#### Scenario: Stop on disable `scene-layers-024`
- **WHEN** a test disables the layer while a search, a status request and a thumbnail request run
- **THEN** the layer aborts each request, and an answer that arrives afterwards changes nothing
- **AND** the data source is hidden and has no entity, and the stats have `count` 0
- **AND** the layer calls `clearSource` and `setVisible` with false for the source "<layer>" of the overlay host
- **AND** after the next `enable`, the layer shows the hint, no message and no list, and it calls `setVisible` with true
- **AND** after the next `enable`, the layer forgets a status with no key and a failed status, and the chip has `disabled` false
- **AND** a new `update` aborts the status request of the update before
- **AND** an `update` or a `disable` does not abort a status request that ended

#### Scenario: Release everything on destroy `scene-layers-025`
- **WHEN** a test calls `destroy` on a layer that shows footprints and a thumbnail card
- **THEN** the viewer has no data source of the layer, and the stats have `count` 0 and `lastUpdate` null
- **AND** `destroy` aborts each request in flight, and clears and hides the source "<layer>" of the overlay host
- **AND** a second `destroy` does nothing, and `destroy` on a layer that was never initialized does nothing
- **AND** the layer can initialize again after `destroy`

#### Scenario: Tell the panel about each change `scene-layers-026`
- **WHEN** a test sets a row controls listener, and then presses the chip
- **THEN** the layer calls the listener when the search starts and when it ends, and when `update` ends
- **AND** a press that has no box calls the listener once
- **AND** a selection calls the listener once, and the end of its thumbnail request calls the listener once more
- **AND** after `setRowControlsListener(null)` the layer does not call the listener

### Requirement: Scene selection
The layer MUST select a scene of its answer through the parameter `scene`. It MUST show the thumbnail of the selected scene as one card of the overlay host. It MUST close each image that it does not show now.
Origin: spec-first

#### Scenario: Select a scene `scene-layers-027`
- **WHEN** a test calls `setParams({scene:<id>})` with the `id` of a scene of the answer
- **THEN** the call returns true, and the entity of that scene has the style of a selected footprint
- **AND** each other entity has the style of a footprint that is not selected
- **AND** each entity of the selected scene has a polygon of its ring with the fill alpha of that style
- **AND** the list item of that scene has `active` true
- **AND** `setParams({scene:null})` returns true and removes the selection, and no entity has a polygon
- **AND** `setParams` with the `id` of the selected scene returns true and sends no new thumbnail request
- **AND** `setParams` returns false and changes nothing for an `id` that is not in the answer
- **AND** it does the same for a `scene` that is not a text and not null, and for a value that is not an object
- **AND** it does the same for an object with a key other than `scene`, and for an object with no key `scene`
- **AND** it does the same when the layer is not enabled
- **AND** a new good answer removes the selection

#### Scenario: Show the thumbnail card `scene-layers-028`
- **WHEN** a test selects a scene that has `thumbnail` true
- **THEN** the source gets one `getThumbnail` call with the `id` of that scene
- **AND** while the call runs, the info text ends with "Loading the thumbnail…"
- **AND** the layer gives the blob of a good result to its option `decodeImage` once
- **AND** a layer without the option `decodeImage` gives the blob to `createImageBitmap` of the page
- **AND** then the overlay host gets one call of `setEntries` for the source "<layer>" with one entry
- **AND** the entry has the `id` "selected", the `variant` "thumbnail", the `image` that `decodeImage` gave and `requireImage` true
- **AND** the entry has `thumbnailWidth` and `thumbnailHeight` from `thumbnailSize` of the `width` and the `height` of that image
- **AND** the `title` of the entry is the UTC date of the scene, a space and the `provider` of the scene
- **AND** the `title` is only that date when the `provider` of the scene is null
- **AND** the `position` of the entry is the point of `footprintCentre` of the first ring of `rings`, on the ellipsoid
- **AND** after the card, the info text has no message of the thumbnail
- **AND** a scene that has `thumbnail` false gives no `getThumbnail` call, and the info text ends with "<label> has no thumbnail for this scene."

#### Scenario: Report a thumbnail that fails `scene-layers-029`
- **WHEN** `getThumbnail` gives `ok` false, or rejects, or `decodeImage` rejects
- **THEN** the overlay host gets no card, and the info text ends with the text of `describeThumbnailFailure` for the error of the result
- **AND** a rejection of `getThumbnail` gives the text of "unreachable"
- **AND** a rejection of `decodeImage` gives the text of "bad_image"
- **AND** an image with a size that gives null in `thumbnailSize` also gives the text of "bad_image", and the layer closes that image
- **AND** the stats keep their `error`
- **AND** the layer sends no thumbnail request again until the next selection of a scene

#### Scenario: Close the images `scene-layers-030`
- **WHEN** a test selects a second scene while the card of the first scene shows, or while its thumbnail request runs
- **THEN** the layer removes the card of the first scene at once, before the result of the second request
- **AND** the layer aborts the request of the first scene, and its result changes nothing
- **AND** the layer calls `close` of an image that it gets after the layer aborts the request of that image
- **AND** the layer calls `close` of the image of the old card once
- **AND** `setParams({scene:null})`, a new good answer, `disable` and `destroy` each abort a thumbnail request that runs
- **AND** each of them calls `close` of the image of the card once, and `clearSource` for the source "<layer>" of the overlay host

### Requirement: Registration
The application MUST register both layers in the catalog, the share link, the layer panel and the credits, and MUST keep them out of voice.
Origin: spec-first

#### Scenario: Register the layers and their share tokens `scene-layers-031`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layers "planet-scenes" and "skyfi-scenes", and the reference sources have these two keys
- **AND** the source of each key has the functions `getStatus`, `searchScenes` and `getThumbnail`
- **AND** each call of `createReferenceSources` gives a new source object for each key
- **AND** the share link registry has the entry `{id:'planet-scenes', token:'01', disposition:'enabled-only'}`
- **AND** the share link registry has the entry `{id:'skyfi-scenes', token:'02', disposition:'enabled-only'}`
- **AND** the share link "v=2&l=01" decodes to the enabled layer "planet-scenes", and "v=2&l=02" decodes to "skyfi-scenes"
- **AND** the layers come in the order of the catalog right after the layer "skywatch-scenes": "planet-scenes", then "skyfi-scenes"
- **AND** the source contract "planet-scenes" names the layer "planet-scenes", and the source contract "skyfi-scenes" names the layer "skyfi-scenes"
- **AND** each source contract names the methods `getStatus`, `searchScenes` and `getThumbnail`
- **AND** a catalog without the source "planet-scenes" gives that layer the stats error "Data source not configured: planet-scenes"
- **AND** a catalog without the source "skyfi-scenes" gives that layer the stats error "Data source not configured: skyfi-scenes"
- **AND** after a search, the method `setLayerParams` of the manager selects a scene with `{scene:<id>}` and the origin "user", and returns true
- **AND** the layer of `createApplicationSceneLayer(service)` calls the function `requestRender` of the Cesium scene of the render governor after a search
- **AND** an option `requestRender` of `createApplicationSceneLayer(service, options)` replaces the render governor
- **AND** the function `nextLayerStateToken` gives the token "03" for the ledger and the free digits that the QA script uses
#### Scenario: Put the layers in the Cameras group `scene-layers-032`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Cameras" has the layers "skywatch-scenes", "planet-scenes" and "skyfi-scenes" in this order, right after "recent-imagery"
- **AND** the group still ends with "street-level", "beemaps" and "beemaps-bursts", in that order
#### Scenario: Keep the layers out of voice `scene-layers-033`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "planet-scenes" has the text "The Planet layer has no voice tools."
- **AND** the entry "skyfi-scenes" has the text "The SkyFi layer has no voice tools."
#### Scenario: Credit the data `scene-layers-034`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry with the key "planet-scenes" has the text "Satellite scenes: Planet, through the server of this app with your API key. Imagery © Planet Labs PBC. The terms of Planet allow you to view the data for yourself. Do not give other people access to this app. · planet.com"
- **AND** the link of that entry goes to "https://www.planet.com/"
- **AND** the entry with the key "skyfi-scenes" has the text "Satellite scenes: SkyFi, through the server of this app with your API key. The terms of SkyFi give a personal and non-commercial license, so use the data for yourself only. Each scene comes from a satellite provider that the list names. · skyfi.com"
- **AND** the link of that entry goes to "https://skyfi.com/"

#### Scenario: Give the Spanish and the Russian texts `scene-layers-035`
- **WHEN** a test reads the Spanish and the Russian texts
- **THEN** the Spanish text of "Planet Scenes" is "Escenas de Planet", and the Russian text is "Сцены Planet"
- **AND** the Spanish text of "SkyFi Scenes" is "Escenas de SkyFi", and the Russian text is "Сцены SkyFi"
- **AND** `layerNameForId('planet-scenes')` gives "Escenas de Planet" in Spanish and "Planet Scenes" in English
- **AND** `layerNameForId('skyfi-scenes')` gives "Escenas de SkyFi" in Spanish and "SkyFi Scenes" in English
- **AND** the Spanish text of the list label "Planet scenes" is "Escenas de Planet", and the Russian text is "Сцены Planet"
- **AND** the Spanish text of the list label "SkyFi scenes" is "Escenas de SkyFi", and the Russian text is "Сцены SkyFi"
- **AND** in Spanish, `sceneList` gives the `ariaLabel` "Escenas de Planet" or "Escenas de SkyFi" for the layer under test
