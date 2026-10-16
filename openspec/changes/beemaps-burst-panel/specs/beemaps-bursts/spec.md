## ADDED Requirements

### Requirement: Layer record
The layer `beemaps-bursts` MUST have the name "Bee Maps Bursts", the icon "🐝", the source name "Bee Maps" and the update interval 0. It MUST NOT accept parameters.
Origin: spec-first

#### Scenario: Describe the layer `beemaps-bursts-001`
- **WHEN** a test creates the layer with a fake source
- **THEN** the `id` is "beemaps-bursts", the `name` is "Bee Maps Bursts", the `icon` is "🐝" and the `source` is "Bee Maps"
- **AND** the `updateInterval` is 0
- **AND** the layer has no method `setParams`
- **AND** `getStats` gives `count` 0, `lastUpdate` null and `error` null
- **AND** the layer throws an error for a source that lacks one of `getStatus`, `quote`, `confirm` and `list`, and for a second `init`

### Requirement: No request without a press
The layer MUST send a quote request, a confirm request or a list request only when a person presses the chip for it. It MUST send at most one request for each press. It MUST send a confirm request only for the quote that the Confirm chip shows. After an error, it MUST send no quote, confirm or list request until a person presses a chip again.
Origin: spec-first

#### Scenario: Ask only for the status `beemaps-bursts-002`
- **WHEN** a test initializes and enables the layer, then runs `update` 3 times and moves the camera of the viewer
- **AND** the test then disables the layer, enables it again and destroys it
- **THEN** the source gets one `getStatus` call for each `update` and no `quote`, `confirm` or `list` call
- **AND** the layer adds no listener to the camera or to the scene of the viewer
- **AND** a second `enable` while a quote is shown sends no `confirm` call
- **AND** `destroy` removes the data source and clears the layer
- **AND** a later `init` and `enable` give a layer as new, with the data source name "beemaps-bursts"
- **AND** `update` on a layer that is not enabled returns false and sends no call

#### Scenario: Send nothing after a restored state `beemaps-bursts-003`
- **WHEN** a test decodes the share link `v=2&l=6` and enables the layers of it in the production catalog with a source that counts its calls
- **THEN** the source gets `getStatus` calls and no `quote`, `confirm` or `list` call
- **AND** the manager `setLayerParams` for "beemaps-bursts" returns false, and the source gets no `quote`, `confirm` or `list` call

#### Scenario: Offer the chips only when the layer is enabled `beemaps-bursts-004`
- **WHEN** a test reads `getRowControls` before `enable`, after `enable`, and after `disable`
- **THEN** before `enable` and after `disable` the controls have no chip
- **AND** after `enable` the controls have two chips, in this order
- **AND** the first chip is "quote" with the label "Quote burst here", and the second is "list" with the label "Check my bursts"
- **AND** each chip has a function `onClick` and no `params`
- **AND** a call of an `onClick` function taken before `disable` sends no call after `disable`

### Requirement: Status of the routes
The layer MUST read the status of the burst routes when it is updated. It MUST disable the chips "quote" and "list" when the server says that bursts are off or that the key is missing.
Origin: spec-first

#### Scenario: Show the status `beemaps-bursts-005`
- **WHEN** the layer updates and the status says `enabled:false`, or `configured:false`, or fails, or is good
- **THEN** with `enabled:false` the message is "Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app." and both chips are disabled
- **AND** with `enabled:true` and `configured:false` the message is "No Bee Maps key for bursts. Set BEEMAPS_BURST_API_KEY in .env and restart the app." and both chips are disabled
- **AND** a failed status gives the message "The server did not give the status of the bursts."
- **AND** a failed status leaves both chips enabled, and `update` resolves to true
- **AND** a good status leaves no message, so the info text is the hint of scenario 026, and it leaves both chips enabled
- **AND** a good quote or a good list clears the message of an earlier failed status
- **AND** with `enabled:false` and `configured:false` the message is the text for `enabled:false`
- **AND** a later `update` does not abort a status request that ended
- **AND** a status answer with `enabled:false` that comes while a quote request is open keeps its message after the answer of the quote
- **AND** `getStats` gives the error of the last press first, and the error of a failed status when there is none
- **AND** a second `update` while the first is open aborts the first and returns false for it
- **AND** `disable` aborts an open status request

### Requirement: Quote
A press of the chip "quote" MUST ask the server for the price of a burst in the box around the centre of the view. The box MUST be the box of the frames layer, and each corner of it MUST stay within the latitudes -80 and 80 degrees. The quote request MUST contain the box and nothing else. A quote MUST cost nothing and MUST NOT start a burst.
Origin: spec-first

#### Scenario: Ask for the quote of the view box `beemaps-bursts-006`
- **WHEN** a test enables the layer and presses "quote" with the view centre at 59.9976 degrees north and 10.0031 degrees east
- **THEN** the source gets one `quote` call with the box [9.987014, 59.991007, 10.022986, 60.008993] and the field `signal`, and no other field
- **AND** until the answer comes, the chip "quote" has the label "Quoting…", is disabled and has `busy` true
- **AND** a second press of the chip in that time sends no call
- **AND** in that time the chip "list" is disabled, and not busy

#### Scenario: Show the quote `beemaps-bursts-007`
- **WHEN** the source answers a quote with the quoteId `a1b2c3d4e5f60718293a4b5c6d7e8f90`, 125 credits, 4 km² and 120 seconds, with 0 credits used of 625
- **THEN** the chips are "confirm:a1b2c3d4e5f60718293a4b5c6d7e8f90" with the label "Confirm: 125 credits, 4 km²", "cancel" with the label "Cancel quote" and "list", in that order
- **AND** the info text is "Quote: 125 credits for 4 km² · credits used today 0 of 625 · valid for 120 seconds"
- **AND** the source gets no `confirm` call
- **AND** the Confirm chip is not busy, and the chip "cancel" is enabled
- **AND** the data source has one entity with the id "beemaps-bursts:quote" and a rectangle of the box in the answer
- **AND** an area of 3.998 km² in the answer gives the label "Confirm: 125 credits, 3.998 km²"
- **AND** the layer asks the random source for one idempotency key when this answer arrives, and not when the person presses "quote"

#### Scenario: Refuse a view that gives no box `beemaps-bursts-008`
- **WHEN** a test presses "quote" with the view at the sky, at the latitude 80.5 and at the longitude 179.999
- **AND** the test presses "quote" with the view at the latitude -79.999 or 79.996, where the box crosses -80 or 80
- **THEN** each press shows a message and sends no `quote` call
- **AND** the sky gives "Point the view at the ground and press again."
- **AND** each latitude gives "Move the view to a latitude from -79.99 to 79.99 degrees and press again."
- **AND** a canvas with no size, and a pick that fails, also give the text for the sky
- **AND** the layer picks the point at the middle of the canvas on the ellipsoid of the globe
- **AND** a viewer with no scene gives the sky text, and a viewer with no globe picks on the default ellipsoid
- **AND** the longitude gives "Move the view away from the 180th meridian and press again."
- **AND** the view at the latitude 79.9 gives a quote request

#### Scenario: Show each error of a quote `beemaps-bursts-009`
- **WHEN** the source answers a quote with an error, or with an answer that the layer cannot read
- **THEN** the message is the text of scenario 027 for the error and the layer keeps no quote
- **AND** the chip "quote" is enabled again and no confirm chip is shown
- **AND** the layer sends no call again by itself
- **AND** a source that throws gives the text for "unreachable"
- **AND** `disable` aborts a quote request that is open, and the late answer of that request changes nothing

#### Scenario: End the quote when its time is over `beemaps-bursts-010`
- **WHEN** a quote with 120 seconds is shown and the clock moves by 120 seconds
- **THEN** the layer keeps no quote, the box entity is gone and the chips are "quote" and "list"
- **AND** the message is "The quote ended. Press Quote burst here again."
- **AND** the layer starts the timer at the time of the answer and clears it when the quote is cancelled, confirmed or cleared by `disable`
- **AND** a press of the Confirm chip at or after the end, before the timer ran, sends no `confirm` call
- **AND** that press gives the same text and the same state

#### Scenario: Cancel the quote `beemaps-bursts-011`
- **WHEN** a quote is shown and a person presses "cancel"
- **THEN** the layer keeps no quote, the box entity is gone, the timer is cleared and the chips are "quote" and "list"
- **AND** a call of the `onClick` function of the old Confirm chip sends no `confirm` call
- **AND** a new quote gets a new quoteId and a new Confirm chip id, so a press on the old chip finds no chip

### Requirement: Confirm
A press of the Confirm chip MUST send one confirm request with the quoteId and the idempotency key of the quote. The layer MUST disable the chip before it sends the request. The layer MUST send no second confirm request for the quote. After the answer the layer MUST NOT keep the quote. The layer MUST keep the Confirm chip disabled for 1000 milliseconds after it shows the quote.
Origin: spec-first

#### Scenario: Send one confirm request `beemaps-bursts-012`
- **WHEN** a quote is shown and a person presses the Confirm chip
- **THEN** the source gets one `confirm` call with exactly the fields `quoteId` and `idempotencyKey`
- **AND** the source reads the controls during its `confirm` call, and the panel got one notice before that call
- **AND** the controls then show the Confirm chip with the label "Sending…", disabled, with `busy` true
- **AND** in that time the info text shows no text of the quote
- **AND** in that time the chip "cancel" is not offered and the chip "list" is disabled
- **AND** a second call of the same `onClick` function in that time sends no call
- **AND** after the answer, a call of the same `onClick` function sends no call, whatever the answer was

#### Scenario: Make one idempotency key for each quote `beemaps-bursts-013`
- **WHEN** a test gives the layer a random source and shows two quotes one after the other
- **THEN** the layer asks the random source once for each quote, and the `confirm` call of a quote carries the key of that quote
- **AND** the layer asks for no key before the answer of a quote arrives
- **AND** the default random source gives 32 characters from "0123456789abcdef", and two calls give two different keys
- **AND** no label, title, id or info text of the layer contains an idempotency key

#### Scenario: Show a created burst `beemaps-bursts-014`
- **WHEN** the source answers a confirm with `outcome:'created'`, the burst `6501aa11bb22cc33dd44ee55` with status "active", 125 credits and `creditsRemaining` 875
- **THEN** the text of the last confirm is "Burst created: 125 credits taken, 875 left at Bee Maps."
- **AND** the layer keeps no quote and the quote box entity is gone
- **AND** the data source has the entity "beemaps-bursts:6501aa11bb22cc33dd44ee55" with the rectangle of the quote
- **AND** `getStats` gives `count` 1 and `lastUpdate` equal to the clock
- **AND** a `creditsRemaining` of null gives "Burst created: 125 credits taken."
- **AND** a burst with credits null gives the credits of the quote, and a burst with status null is drawn grey

#### Scenario: Show a refusal that took no credits at Bee Maps `beemaps-bursts-015`
- **WHEN** the source answers a confirm with `outcome:'refused'` and an error code of the server
- **THEN** the text of the last confirm is the text of scenario 027 for that error
- **AND** the layer keeps no quote and no Confirm chip is shown
- **AND** `getStats` gives that text as `error`
- **AND** the layer sends no call again by itself
- **AND** the layer creates no burst entity

#### Scenario: Warn after an unknown answer `beemaps-bursts-016`
- **WHEN** the source answers a confirm with `outcome:'unknown'`, or throws, or the answer has an unknown shape
- **AND** an answer with `outcome:'created'` and no burst with a string `id` has an unknown shape
- **THEN** the text of the last confirm is "It is possible that Bee Maps made a burst and took credits. Do not press Confirm again. Press Check my bursts."
- **AND** `getStats` gives that text as `error`
- **AND** an answer with `retryAfter` 539 adds "The server refuses new confirm requests for 539 seconds."
- **AND** `retryAfter` 1 adds "The server refuses new confirm requests for 1 second."
- **AND** an answer with no whole number from 1 for `retryAfter` adds nothing
- **AND** the layer keeps no quote and no Confirm chip is shown
- **AND** the layer offers no chip that sends the confirm request again
- **AND** after an unknown answer the chip "quote" is disabled and has the title "It is possible that Bee Maps made a burst. Press Check my bursts first."
- **AND** a call of the `onClick` function of that chip sends no `quote` call
- **AND** a list answer with `cached` true, a failed list, `disable` and `enable` leave the chip disabled
- **AND** an `update` call with a good status or a failed status leaves the chip disabled
- **AND** a list answer with `cached` false enables the chip again, and a fresh list answer is a list answer with `cached` false
- **AND** `destroy`, then `init` and `enable`, give an enabled chip
- **AND** a created answer or a refusal does not disable the chip

#### Scenario: Keep the text of a confirm when the layer is disabled `beemaps-bursts-017`
- **WHEN** a confirm request is open, a test disables the layer, the request answers, and the test enables the layer again
- **THEN** the layer gives the `confirm` call no signal, so `disable` and `destroy` cannot abort the request
- **AND** the answer sets the state, so the text of the last confirm after `enable` is the text for that answer
- **AND** `disable` clears a quote that is shown, and the next `enable` shows no Confirm chip
- **AND** after `disable` and `enable`, the controls, the info text and `getStats` are those of a new layer
- **AND** the exceptions are the text of the last confirm, the disabled chip "quote" and the burst that the answer of the open request added
- **AND** an unknown answer that comes while the layer is disabled gives the disabled chip "quote" after the next `enable`
- **AND** the text of the last confirm stays through `disable` and `enable` until the layer shows a new quote
- **AND** a later message of a press or of the status comes after that text, and does not replace it
- **AND** an answer after `destroy` changes nothing and throws no error

#### Scenario: Keep the Confirm chip disabled for a short time `beemaps-bursts-029`
- **WHEN** the layer shows a quote at the time T
- **THEN** until T plus 1000 milliseconds, the lock of the Confirm chip, the Confirm chip keeps its label and is disabled
- **AND** a call of its `onClick` function in that time sends no `confirm` call, and changes nothing
- **AND** the layer starts a timer of 1000 milliseconds when it shows the quote, and tells the panel when the lock ends
- **AND** the timer of the lock sends no `confirm` call
- **AND** a timer that runs before the end of the lock starts a new timer for the rest of the lock
- **AND** at T plus 1000 milliseconds the Confirm chip is enabled, and one call of its `onClick` function sends the confirm request
- **AND** the layer clears the timer when the quote is cancelled, ended, confirmed or cleared by `disable`
- **AND** the next quote has its own lock of 1000 milliseconds

### Requirement: List of bursts
A press of the chip "list" MUST ask the server for the bursts of the account and MUST draw their boxes. It MUST send one request for each press.
Origin: spec-first

#### Scenario: Show the bursts `beemaps-bursts-018`
- **WHEN** a person presses "list" and the source answers 3 bursts, one with `isHit` true, `total` 3
- **THEN** the source gets one `list` call
- **AND** until the answer comes, the chip "list" has the label "Checking…", is disabled and has `busy` true
- **AND** in that time the chip "quote" is disabled, and not busy
- **AND** the `list` call has the field `signal` and no other field
- **AND** the data source has one entity "beemaps-bursts:<id>" for each burst that has a box, with a rectangle of its box
- **AND** the text of the bursts is "3 bursts · 1 hit"
- **AND** with 1 burst and 0 hits the text is "1 burst · 0 hits"
- **AND** with 100 bursts and `total` 130 the text is "100 bursts (130 in all) · 0 hits"
- **AND** with 100 bursts and `total` 100 the text is "100 bursts · 0 hits"
- **AND** an answer with `cached` true adds " · stored answer" to the text
- **AND** a burst with no box counts in the text and gets no entity
- **AND** a burst whose id repeats an earlier id, or is "quote", gets no second entity
- **AND** `getStats` gives the `count` of the bursts and `lastUpdate` equal to the clock
- **AND** a list answer keeps the box entity of a quote that is shown

#### Scenario: Keep the bursts when the list fails `beemaps-bursts-019`
- **WHEN** a list shows bursts and a second press fails
- **THEN** the message is the text of scenario 027 for the error, and the entities of the first list stay
- **AND** the chip "list" is enabled again
- **AND** a list answer replaces the bursts of the earlier list, and removes the entity of a burst that the list no longer contains
- **AND** a burst that a confirm created stays after a list answer that does not list it
- **AND** the burst of the list answer replaces the burst that the confirm created, and the text counts it once
- **AND** `disable` aborts a list request that is open, and the late answer of that request changes nothing

#### Scenario: Style a burst by its state `beemaps-bursts-020`
- **WHEN** the layer draws a burst
- **THEN** a burst with `isHit` true is green "#22c55e" with alpha 0.35
- **AND** an active burst that has no hit is blue "#38bdf8" with alpha 0.25
- **AND** any other burst, also one with status null, is grey "#9ca3af" with alpha 0.2
- **AND** the box of a quote is amber "#f59e0b" with alpha 0.3
- **AND** each rectangle has the west, south, east and north of the box in degrees
- **AND** each time the layer draws the boxes, it calls the function `requestRender` once with the reason "beemaps-bursts"
- **AND** a press of "quote" or "list" that ends with an error, and a press of "quote" with no view box, call `requestRender` zero times
- **AND** a refusal of a confirm request calls `requestRender` once, because the layer removes the box of the quote

### Requirement: Panel notice
The layer MUST tell the panel through its listener when an event changes the controls or the info text.
These events are a status answer, a press, an answer of a request, the end of a quote and the end of the lock. The layer MUST NOT tell the panel when a press changes nothing. The methods `enable`, `disable` and `destroy` MUST NOT call the listener.
Origin: spec-first

#### Scenario: Tell the panel about each change `beemaps-bursts-030`
- **WHEN** a test sets a row controls listener and then makes each change of the list below
- **THEN** a status answer calls the listener once
- **AND** a press of "quote" calls it when the request starts and when the answer arrives, and a press with no box calls it once
- **AND** a press of "list" calls it when the request starts and when the answer arrives
- **AND** a press of "cancel", the end of a quote and the end of the lock of the Confirm chip call it once
- **AND** a press of the Confirm chip calls it when the request starts and when the answer arrives
- **AND** a press of "cancel" without a quote, a press while another request is open and a press after `disable` call it zero times
- **AND** `enable`, `disable` and `destroy` call the listener zero times
- **AND** after `setRowControlsListener(null)` no change calls a listener

### Requirement: Browser source
The browser source MUST send the requests of the layer to the four burst routes. It MUST NOT retry a request. It MUST classify the answer of a confirm request.
The source MUST treat an answer as unknown unless the answer matches the rules of scenario 023 for a created burst or for a refusal.
Origin: spec-first

#### Scenario: Read the status `beemaps-bursts-021`
- **WHEN** a test calls `getStatus` with a fake fetch
- **THEN** the source sends a GET request to "/api/beemaps/burst/status" with the given signal
- **AND** a good answer gives `{ok:true, enabled, configured}` for two booleans
- **AND** a bad status gives `{ok:false}`
- **AND** a body that is not valid JSON, a body that is too large and a thrown error also give `{ok:false}`

#### Scenario: Request a quote `beemaps-bursts-022`
- **WHEN** a test calls `quote` with a box
- **THEN** the source sends a POST request to "/api/beemaps/burst/quote" with the header "Content-Type: application/json" and the body `{"bbox":[...]}`
- **AND** a good answer gives `{ok:true, quote}` with `quoteId`, `expiresInSeconds`, `bbox`, `areaKm2`, `credits` and `budget` with `used`, `limit` and `remaining`
- **AND** the source rejects a quoteId that is not 32 characters of "0123456789abcdef"
- **AND** the source rejects an `expiresInSeconds` that is not a whole number from 1 to 600
- **AND** the source rejects a box that does not contain 4 finite numbers, and an `areaKm2` that is not above 0
- **AND** the source rejects `credits` that are not a whole number from 1, and a `budget` field that is not a whole number from 0
- **AND** each of these rejections gives `{ok:false, status, error:'bad_answer'}`
- **AND** an error answer gives `{ok:false, status, error}` with the `error` string of the body, or "unknown"
- **AND** an error answer also gives the whole-number fields `retryAfter`, `used` and `limit` that the body contains
- **AND** a thrown fetch, and an abort by the timeout of 30 seconds, give `{ok:false, status:0, error:'unreachable'}`
- **AND** an abort by the signal of the caller throws, and the source sends one request only

#### Scenario: Classify the answer of a confirm `beemaps-bursts-023`
- **WHEN** a test calls `confirm` with a quoteId and an idempotency key
- **THEN** the source sends a POST request to "/api/beemaps/burst/confirm" with the body `{"quoteId":...,"idempotencyKey":...}` and no signal of the caller
- **AND** the status 200 with `ok:true` and `outcome:'created'` and a readable burst gives `{outcome:'created', replayed, burst, creditsRemaining}`
- **AND** a readable burst has a non-empty string `id`
- **AND** its `status` and `validUntil` are a string or null, and its `credits` is a finite number or null
- **AND** `creditsRemaining` is null when the body has no whole number for it
- **AND** a status of 400 or more with `ok` not true and a known error gives `{outcome:'refused', status, error}`
- **AND** that answer has `retryAfter` when the body has a whole number for it
- **AND** the first group of known errors is cross_origin, rate_limited, burst_off, no_key, bad_body, busy, key_reused and quote_expired
- **AND** the second group of known errors is budget_used, budget_unavailable, ledger_unavailable, log_failed, bad_request, key_rejected, no_credit and upstream_rate_limit
- **AND** `budget_used` also keeps `used` and `limit` when they are whole numbers
- **AND** every other answer gives `{outcome:'unknown', status}`, with `retryAfter` when the body has a whole number for it
- **AND** these are outcome_unknown with 502 or 409, internal_error, and an error code that is not known
- **AND** a created answer with an unreadable burst gives the same
- **AND** a status below 400 without a created burst, and a body that is not valid JSON, give the same

#### Scenario: Send a confirm request once and abort it after 60 seconds `beemaps-bursts-024`
- **WHEN** a test makes the fetch of a confirm throw or never answer
- **AND** the test makes the body of the answer stop in the middle, or makes it invalid JSON
- **THEN** the source never rejects
- **AND** a fetch that throws or never answers gives `{outcome:'unknown', status:0}`
- **AND** a body that stops or is not valid JSON gives `{outcome:'unknown', status}` with the status of the response
- **AND** the source sends exactly one request in each case, and aborts it after 60 seconds on the injected timer
- **AND** the source clears its timer in each case

#### Scenario: Request the list `beemaps-bursts-025`
- **WHEN** a test calls `list`
- **THEN** the source sends a POST request to "/api/beemaps/burst/list" with the body `{"limit":100}`
- **AND** a good answer gives `{ok:true, bursts, total, cached}`
- **AND** each burst has a non-empty string `id` and a boolean `isHit`
- **AND** its `status` is a string or null, its `credits` is a finite number or null, and its `bbox` is 4 finite numbers or null
- **AND** the source drops a burst that fails these rules, and keeps the others in order
- **AND** an answer without an array `bursts` gives `{ok:false, status, error:'bad_answer'}`
- **AND** a `total` that is not a whole number from 0, or a `cached` that is not a boolean, gives the same
- **AND** an error answer, a thrown fetch and an abort behave as in scenario 022

### Requirement: Texts
The texts of the layer MUST be fixed strings in `messages.js` and `model.js`. They MUST say that a quote costs nothing and that a confirm request takes credits and cannot be undone.

The info text MUST join four parts with " · ", in this order, and leave out each part that is absent. The first two parts are the text of the last confirm and the message of the last press or of the status. The last two parts are the text of the quote and the text of the bursts.
With no part, the info text MUST be the hint. A message of a press replaces a message of the status.
Origin: spec-first

#### Scenario: Give the hint and the readout `beemaps-bursts-026`
- **WHEN** the layer has no message, no quote and no burst
- **THEN** the info text is "A quote shows the price of a burst in 4 km² at the view centre. A quote costs nothing. A confirm request takes credits and cannot be undone."
- **AND** otherwise the info text joins the four parts of the requirement with " · ", in that order
- **AND** a message of a press replaces a message of the status
- **AND** the info text leaves out each part that is absent
- **AND** the chip "quote" has the title "Ask for the price of a burst. A quote costs nothing."
- **AND** the same chip has the title "It is possible that Bee Maps made a burst. Press Check my bursts first." after an unknown answer of a confirm request
- **AND** the Confirm chip has the title "Create the burst. This takes credits and cannot be undone."
- **AND** the chip "cancel" has the title "Cancel the quote. Nothing is sent."
- **AND** the chip "list" has the title "Ask Bee Maps for your bursts. This can cost money."

#### Scenario: Give the text of each error `beemaps-bursts-027`
- **WHEN** a test asks for the text of an error code
- **THEN** "cross_origin" gives "Only the machine that runs the server can use bursts. Start the app with make up-codex."
- **AND** "burst_off" gives "Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app."
- **AND** "no_key" gives "No Bee Maps key for bursts. Set BEEMAPS_BURST_API_KEY in .env and restart the app."
- **AND** "rate_limited" gives "Too many presses. Wait 60 seconds."
- **AND** "key_rejected" gives "Bee Maps refused the key. Check BEEMAPS_BURST_API_KEY in .env."
- **AND** "no_credit" gives "The Bee Maps account has no credit."
- **AND** "upstream_rate_limit" gives "Bee Maps asks you to wait 30 seconds." for `retryAfter` 30, "Bee Maps asks you to wait 1 second." for 1, and "Bee Maps asks you to wait." without a whole number from 1
- **AND** "budget_used" gives "The daily limit of 625 credits is used." for `limit` 625, "The daily limit of 1 credit is used." for 1, and "The daily limit is used." without a whole number from 1
- **AND** "budget_unavailable" gives "The server cannot use its budget file."
- **AND** "ledger_unavailable" gives "The server cannot use its record of bursts. Nothing was sent."
- **AND** "log_failed" gives "The server cannot write its log. Nothing was sent."
- **AND** "quote_expired" gives "The quote ended. Press Quote burst here again."
- **AND** "busy" gives "The server is busy with another confirm request. Wait, then press Check my bursts."
- **AND** "key_reused" gives "The server refused this confirm request."
- **AND** "bad_request" gives "Bee Maps refused the request."
- **AND** "upstream_failed" gives "Bee Maps did not answer correctly."
- **AND** "bad_body", "bad_area", "area_too_large" and "bad_credits" give "The server refused the request."
- **AND** "unreachable" gives "The server did not answer."
- **AND** "bad_answer" gives "The server sent an answer that the layer cannot read."
- **AND** any other code gives "The server answered with an unknown error (500)." for the status 500

### Requirement: Registration
The layer MUST be in the production catalog, the source contract, the reference sources and the share link. It MUST also be in the layer panel, the data credits and the list of layers without voice tools.
Origin: spec-first

#### Scenario: Register the layer `beemaps-bursts-028`
- **WHEN** a test reads the production catalog, the source contract, the reference sources and the registry of layer states
- **THEN** the catalog has the layer "beemaps-bursts" with the name "Bee Maps Bursts", directly after the layer "beemaps"
- **AND** the source contract for "beemaps-bursts" lists the layer "beemaps-bursts" and the methods `getStatus`, `quote`, `confirm` and `list`
- **AND** the reference sources contain a new source object for "beemaps-bursts" on each call, with those four functions
- **AND** the registry has the entry `{id:'beemaps-bursts', token:'6', disposition:'enabled-only'}`
- **AND** the layer panel lists the layer in the group "Cameras" directly after "beemaps"
- **AND** the data credits contain an entry with the key "beemaps-bursts" and a link to "https://beemaps.com/"
- **AND** the list of layers without voice tools gives the reason "The Bee Maps bursts layer has no voice tools." for "beemaps-bursts"
- **AND** the layer of the application gets the render governor as its function `requestRender`, and a caller can give another function
