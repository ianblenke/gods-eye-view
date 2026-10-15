## ADDED Requirements

### Requirement: Provider routes
The plugin MUST answer only `/api/beemaps/burst/status`, `/api/beemaps/burst/quote`, `/api/beemaps/burst/confirm` and `/api/beemaps/burst/list`. It MUST pass every other path to the next middleware.
Origin: spec-first

#### Scenario: Mount the four routes `beemaps-burst-control-001`
- **WHEN** a test installs the plugin and sends requests to the four paths, to `/api/beemaps/burst/other`, to `/api/beemaps/burst` and to `/api/beemaps/frames`
- **THEN** the four paths get an answer, and the other three paths go to `next` with no answer
- **AND** the plugin name is "beemaps-burst-proxy"
- **AND** `configureServer` and `configurePreviewServer` install the same routes
- **AND** the list that `localProviderPlugins` returns has this plugin once, after the plugin "beemaps-proxy"

### Requirement: Off by default
The routes MUST send no request to Bee Maps and MUST spend nothing unless `BEEMAPS_BURST_ENABLED` is exactly "true" and `BEEMAPS_BURST_API_KEY` has a key. The key of the frames provider MUST NOT count.
Origin: spec-first

#### Scenario: Read the flag exactly `beemaps-burst-control-002`
- **WHEN** a test reads the status route with each value of `BEEMAPS_BURST_ENABLED`
- **THEN** only the text "true" gives `enabled` true
- **AND** the texts "TRUE", "True", "1", "yes", " true", "true " and "" and an unset variable give `enabled` false
- **AND** a request to `quote`, `confirm` or `list` with `enabled` false gets 403 and `{error:'burst_off'}`
- **AND** the fake upstream gets no request and the budget file does not change

#### Scenario: Use a key of its own `beemaps-burst-control-003`
- **WHEN** a test sets `BEEMAPS_BURST_ENABLED` to "true" and sets only `BEEMAPS_API_KEY` to a key
- **THEN** the status gives `configured` false, and `quote`, `confirm` and `list` get 403 and `{error:'no_key'}`
- **AND** a `BEEMAPS_BURST_API_KEY` of only spaces gives `configured` false
- **AND** a `BEEMAPS_BURST_API_KEY` with spaces around a key gives `configured` true
- **AND** the upstream request uses the trimmed `BEEMAPS_BURST_API_KEY` and never `BEEMAPS_API_KEY`

#### Scenario: Report the status `beemaps-burst-control-004`
- **WHEN** a `GET` goes to `/api/beemaps/burst/status` from this machine
- **THEN** the answer is 200 with exactly the fields `enabled`, `configured`, `minCredits`, `maxCredits` and `dailyCredits`
- **AND** `minCredits` is 125, `maxCredits` is 125 by default and `dailyCredits` is 625 by default
- **AND** `maxCredits` and `dailyCredits` take the value of `BEEMAPS_BURST_MAX_CREDITS` and `BEEMAPS_BURST_DAILY_CREDITS` when each is digits only
- **AND** `BEEMAPS_BURST_MAX_CREDITS` below 125 and `BEEMAPS_BURST_DAILY_CREDITS` of 0 give the default
- **AND** the route uses the same-site gate, so a request with a foreign `Origin` gets 403
- **AND** another method gets 405 with `{error:'Method not allowed'}`, and the answer has no key and sends no upstream request

### Requirement: Local requests only
The routes `quote`, `confirm` and `list` MUST answer a POST only. They MUST refuse a request that does not pass `isLoopbackCommand` before they read the body, read the flag or send anything.
Origin: spec-first

#### Scenario: Refuse a method that is not POST `beemaps-burst-control-005`
- **WHEN** `quote`, `confirm` or `list` gets a `GET`, a `PUT` or a `DELETE`
- **THEN** the route answers 405 with `{error:'Method not allowed'}`
- **AND** it sends no upstream request and writes no file

#### Scenario: Refuse a request from another machine `beemaps-burst-control-006`
- **WHEN** a POST to `quote`, `confirm` or `list` breaks one of the five rules of `isLoopbackCommand`
- **THEN** the route answers 403 with `{error:'cross_origin'}`, and it does not read the body
- **AND** the route sends no upstream request, and it changes no file, also when the flag is off
- **AND** a POST that keeps all five rules passes this step

#### Scenario: Keep the order of the steps of confirm `beemaps-burst-control-007`
- **WHEN** a test sends a confirm that breaks two steps
- **THEN** the answer names the first broken step of this list
- **AND** the list is: method, local request, rate limit, flag, key, body, busy, idempotency key, hold, quote, budget
- **AND** the test checks each pair of neighbours in the list, with a confirm that breaks only those two steps
- **AND** a confirm that passes every step sends one upstream request
- **AND** the steps after the quote are the budget, the audit line, the record of the attempt and the upstream request, in this order

### Requirement: Checked input of a quote
The route `quote` MUST accept only a box and a credit amount. It MUST check every input before it keeps a quote, and the check MUST NOT spend anything.
Origin: spec-first

#### Scenario: Read the body of a quote `beemaps-burst-control-008`
- **WHEN** the body is larger than 4096 bytes, or is not a JSON object, or has a field other than `bbox` and `credits`
- **THEN** the route answers 400 with `{error:'bad_body'}`
- **AND** a valid body of exactly 4096 bytes passes this step
- **AND** a body that fails while the route reads it also gives `bad_body`

#### Scenario: Check the box `beemaps-burst-control-009`
- **WHEN** the body has `bbox` as a list of the four numbers west, south, east and north
- **THEN** the route answers 400 with `{error:'bad_area'}` when `bbox` is not a list of four numbers, or when a number is not finite
- **AND** it gives the same answer when west is not less than east, or when south is not less than north
- **AND** it gives the same answer when a longitude is outside -180 to 180, or when a latitude is outside -80 to 80
- **AND** a box with a latitude of exactly -80 or 80 passes this step
- **AND** a body without `bbox` gives `bad_area`
- **AND** the JSON text `1e999` is a number that is not finite, so a box with it gives `bad_area`
- **AND** a box with west greater than east and south greater than north gives `bad_area`

#### Scenario: Check the area `beemaps-burst-control-010`
- **WHEN** the area of the box, rounded to 3 decimals, is less than 0.1 km² or more than 5 km²
- **THEN** a smaller area gives 400 with `{error:'bad_area'}`, and a larger area gives 400 with `{error:'area_too_large', maxKm2:5}`
- **AND** the area in square metres is `R*R*W*(sin(N) - sin(S))`, with R equal to 6371008.8 metres
- **AND** W is east minus west in radians, and N and S are the north and south latitudes in radians
- **AND** the box [9.982014, 59.991007, 10.017986, 60.008993] passes this step
- **AND** the box [10, 60, 10.02, 60.02] with an area of about 2.5 km² passes
- **AND** the box [10, 60, 10.05, 60.02] with an area of about 6.2 km² gives `area_too_large`
- **AND** the box [10, 60, 10.01, 60.0016] with an area of about 0.099 km² gives `bad_area`
- **AND** the box [10, 60, 10.01, 60.0017] with an area of about 0.105 km² passes
- **AND** the box [10, 60, 10.01, 60.001612] with an area of about 0.0997 km² rounds to 0.1 and passes
- **AND** the box [10, 60, 10.01, 60.001607] with an area of about 0.0994 km² rounds to 0.099 and gives `bad_area`
- **AND** the box [10, 60, 10.04, 60.020227] with an area of about 5.0003 km² rounds to 5 and passes
- **AND** the box [10, 60, 10.04, 60.020229] with an area of about 5.0008 km² rounds to 5.001 and gives `area_too_large`
- **AND** the box [10, 60, 10.040029, 60.020213] with an area of about 5.000506 km² gives `area_too_large`
- **AND** the box [10, 60, 10.009213, 60.001747] with an area of about 0.0995001 km² passes

#### Scenario: Check the credits `beemaps-burst-control-011`
- **WHEN** the body has `credits`
- **THEN** a whole number from 125 to the value of `maxCredits` passes this step
- **AND** a number that is not whole, below 125 or above `maxCredits` gives 400 with `{error:'bad_credits'}`
- **AND** a value that is not a number gives the same answer
- **AND** a body without `credits` uses 125
- **AND** with `BEEMAPS_BURST_MAX_CREDITS` equal to 200, the credits 200 pass and 201 give `bad_credits`

### Requirement: Quote
The route `quote` MUST keep one quote for a checked request, and the quote MUST give the area, the credits and the budget. It MUST send no upstream request and spend nothing.
Origin: spec-first

#### Scenario: Give a quote `beemaps-burst-control-012`
- **WHEN** a test sends the box [9.982014, 59.991007, 10.017986, 60.008993] with no `credits` to `quote`
- **THEN** the answer is 200 with `quoteId`, `expiresInSeconds` 120, `request` and `budget`
- **AND** `request` is `{bbox:[9.982014,59.991007,10.017986,60.008993], areaKm2:4, credits:125}`, and `areaKm2` has at most 3 decimals
- **AND** `budget` is `{used:0, limit:625, remaining:625}` for a new budget, in credits
- **AND** the route sends no upstream request and does not change the budget file
- **AND** a box with more than 6 decimals is rounded to 6 decimals in `request.bbox`
- **AND** the checks of the box and of the area run on the rounded box
- **AND** the box [10, 60, 10.010004, 60.0016086] passes, because the rounded box has an area of about 0.0995085 km²

#### Scenario: Keep a quote for 120 seconds, once `beemaps-burst-control-013`
- **WHEN** a test gives the plugin a clock and asks for quotes
- **THEN** a `quoteId` is 32 lowercase hexadecimal characters, and two quotes for the same request have different ids
- **AND** a confirm 119.999 seconds after the quote uses the quote, and a confirm at 120 seconds gets 410 with `{error:'quote_expired'}`
- **AND** a used quote gives `quote_expired` at the next confirm with another idempotency key
- **AND** an id that was never given gives the same answer
- **AND** a confirm uses up its quote at the quote step, for every outcome after that step
- **AND** the same quote with a new idempotency key gets `quote_expired`, also after an unknown outcome
- **AND** the plugin keeps at most 8 quotes, so the ninth quote ends the oldest one

#### Scenario: Refuse a quote that the budget cannot pay `beemaps-burst-control-014`
- **WHEN** the credits of a request are more than the credits that remain in the budget of the day
- **THEN** the route answers 403 with `{error:'budget_used', used, limit}`, and it keeps no quote
- **AND** a request for exactly the credits that remain gets a quote
- **AND** a budget file that the route cannot read gives 500 with `{error:'budget_unavailable'}`

### Requirement: One upstream request for one confirmed quote
The route `confirm` MUST send exactly one create request to Bee Maps for a confirmed quote that passes every step. It MUST NOT retry, and it MUST NOT send another request while one runs.
Origin: spec-first

#### Scenario: Read the body of a confirm `beemaps-burst-control-015`
- **WHEN** the body is larger than 1024 bytes, or is not a JSON object, or has a field other than `quoteId` and `idempotencyKey`
- **THEN** the route answers 400 with `{error:'bad_body'}`
- **AND** it gives the same answer when `quoteId` is not 32 lowercase hexadecimal characters
- **AND** it gives the same answer when `idempotencyKey` does not match `^[A-Za-z0-9_-]{16,64}$`
- **AND** it gives the same answer when a field is absent or is not a text, for example a list with one valid text
- **AND** a key of exactly 16 characters and a key of exactly 64 characters pass this step
- **AND** a valid body of exactly 1024 bytes passes this step

#### Scenario: Send the create request `beemaps-burst-control-016`
- **WHEN** a test confirms a quote for the box [9.982014, 59.991007, 10.017986, 60.008993] and 125 credits
- **THEN** the fake gets one `POST` for "https://beemaps.com/api/developer/burst/create"
- **AND** the headers are only `Authorization` with "Basic " and the key, `Content-Type` "application/json" and `Accept` "application/json"
- **AND** the body is the text `[{"geojson":{"type":"Polygon","coordinates":[[[9.982014,59.991007],[10.017986,59.991007],[10.017986,60.008993],[9.982014,60.008993],[9.982014,59.991007]]]},"credits":125}]`
- **AND** the body is a list of exactly one element, and the element has no field `expiration`, `trackedLocation` or `deviceType`
- **AND** the option `redirect` is "error", and the call has a signal that the plugin aborts after 30 seconds

#### Scenario: Report a burst that Bee Maps created `beemaps-burst-control-017`
- **WHEN** the answer has the status 200, `success` true, a list `bursts` of exactly one burst with a text `_id`, and `creditsRemaining` 500
- **THEN** the route answers 200 with `ok` true, `outcome` "created", `replayed` false, `burst` and `creditsRemaining` 500
- **AND** `burst` has the fields `id`, `status`, `validUntil` and `credits`
- **AND** `id` is the `_id`, `status` is "active", "expired" or "refunded" and else null, and `validUntil` is a text and else null
- **AND** `credits` is a number and else null, and `creditsRemaining` is a whole number of 0 or more and else null
- **AND** no other field of the answer of Bee Maps goes to the browser, and the answer has the header `Cache-Control: no-store`

#### Scenario: Name a refusal of Bee Maps `beemaps-burst-control-018`
- **WHEN** the answer of Bee Maps has the status 400, 401, 403, 402 or 429
- **THEN** 400 gives 400 with `{ok:false, outcome:'refused', error:'bad_request'}`
- **AND** 401 and 403 give 403 with the error `key_rejected`, and 402 gives 402 with `no_credit`
- **AND** 429 gives 429 with the error `upstream_rate_limit`, `retryAfter` and the header `Retry-After`
- **AND** the value is the digits of the header of Bee Maps, 600 at most
- **AND** the value is 60 when the header is not digits or is 0
- **AND** the headers 1, 30 and 600 give the same number, and 601 and 99999 give 600
- **AND** the headers 0, 00, -5, 5.5 and an empty header give 60
- **AND** a status of 400, 401, 402, 403 or 429 decides the outcome, whatever the body is
- **AND** each refusal keeps the credits counted in the budget and the state "refused" in the record of the attempt

#### Scenario: Treat every other answer as unknown `beemaps-burst-control-019`
- **WHEN** the result of the call is not a created burst as in scenario 017, and is not a refusal as in scenario 018
- **THEN** the route answers 502 with `{ok:false, outcome:'unknown', error:'outcome_unknown'}`, and the answer gives no text of Bee Maps
- **AND** the credits stay counted in the budget, and the record of the attempt has the state "unknown"
- **AND** the plugin sends no other request for that confirm
- **AND** the test covers the status 200 with `success` not true, with no burst and with two bursts
- **AND** the test covers the status 200 with a burst that has no text `_id`, and with a body that is not JSON
- **AND** the test covers the status 200 with a body larger than 1 MiB
- **AND** the test covers the statuses 201, 204, 301, 404, 409, 418, 500, 502 and 503
- **AND** the test covers a fetch function that rejects, and a call that does not end in 30 seconds

#### Scenario: Send one request and never retry `beemaps-burst-control-020`
- **WHEN** a test confirms one quote for each kind of outcome of the two scenarios before
- **THEN** the fake fetch function gets exactly one request, also after the test moves the fake clock by 10 minutes and runs every timer
- **AND** a confirm that arrives while another confirm runs gets 409 with `{error:'busy'}` and sends no upstream request
- **AND** the first confirm ends with its own answer, and a confirm after it does not get `busy`
- **AND** a test sends three confirms at the same time, because the rate limit allows 3 for each minute
- **AND** the three confirms give one upstream request and two answers `busy`

### Requirement: Budget in credits
The plugin MUST count the credits of a confirm in a daily budget before it sends. It MUST NOT give credits back, and the count MUST survive a restart.
Origin: spec-first

#### Scenario: Reserve the credits before the send `beemaps-burst-control-021`
- **WHEN** a test confirms a quote for 125 credits
- **THEN** the file `credits.json` in the folder `beemaps-burst` of the cache folder contains `{date, credits:125}` before the fake upstream gets its request
- **AND** the date is the UTC day, and a new day starts again at 0 credits
- **AND** a refusal of Bee Maps, an unknown outcome, a failure of the audit line and a failed ledger write leave the credits counted
- **AND** a new plugin that reads the same folder continues from the credits in the file

#### Scenario: Use the daily limit `beemaps-burst-control-022`
- **WHEN** the credits in the file plus the credits of the confirm are more than the daily limit
- **THEN** the route answers 403 with `{error:'budget_used', used, limit}` and sends no upstream request
- **AND** the daily limit is 625 by default, and it is the value of `BEEMAPS_BURST_DAILY_CREDITS` when that is digits only and 1 or more
- **AND** the values "0", "", "-5", "1e3", "5.5" and " 5" give the default
- **AND** a test moves the clock by 61 seconds after each confirm, because the rate limit allows 3 for each minute
- **AND** five confirms of 125 credits pass and the sixth gives `budget_used`, and the file then contains 625 credits

#### Scenario: Refuse when the budget file fails `beemaps-burst-control-023`
- **WHEN** the file cannot be read, has no valid date and credits, or cannot be written
- **THEN** the route answers 500 with `{error:'budget_unavailable'}` and sends no upstream request
- **AND** a file with a wrong date format, with credits that are not whole or that are negative gives the same answer
- **AND** the route reads the file again at the next request

### Requirement: Idempotency
Each confirm MUST carry an idempotency key, and the plugin MUST keep one durable record for each key. A repeat of a key MUST NOT send an upstream request.
Origin: spec-first

#### Scenario: Answer a repeat of a created burst `beemaps-burst-control-024`
- **WHEN** a test sends the same `quoteId` and `idempotencyKey` again after a created burst
- **THEN** the answer is 200 with the same burst and `replayed` true
- **AND** the fake upstream gets no second request, and the budget does not change

#### Scenario: Answer a repeat of a refusal `beemaps-burst-control-025`
- **WHEN** a test sends the same `quoteId` and `idempotencyKey` again after a refusal of Bee Maps
- **THEN** the answer has the same status and the same error as the first answer, and `replayed` true
- **AND** the fake upstream gets no second request, and the budget does not change
- **AND** a new attempt needs a new quote and a new key

#### Scenario: Answer a repeat of an unknown outcome `beemaps-burst-control-026`
- **WHEN** a test sends the same `quoteId` and `idempotencyKey` again after an unknown outcome, or when the record of the attempt is still pending
- **THEN** the answer is 409 with `{ok:false, outcome:'unknown', error:'outcome_unknown', replayed:true}`
- **AND** the fake upstream gets no request, and the budget does not change

#### Scenario: Refuse a key for another quote `beemaps-burst-control-027`
- **WHEN** a test sends a key that has a record, with a `quoteId` other than the one of the record
- **THEN** the answer is 409 with `{error:'key_reused'}`
- **AND** the fake upstream gets no request, and the budget does not change
- **AND** the check of the key comes before the check of the quote, so a repeat works after the quote has expired

#### Scenario: Keep the record on disk `beemaps-burst-control-028`
- **WHEN** a test confirms a quote and reads the file `ledger.json` in the folder `beemaps-burst`
- **THEN** the file contains a record with the idempotency key, the `quoteId`, the state and the time
- **AND** a record with the state "created" also contains `burst` and `creditsRemaining`
- **AND** a record with the state "refused" also contains the status, the `error` and `retryAfter`
- **AND** a replay of a key uses only its record, so it works after a restart
- **AND** the state is "pending" before the fake upstream gets its request
- **AND** the state changes to "created", "refused" or "unknown" when the confirm ends
- **AND** a new plugin that reads a file with a "pending" record gives the answer of an unknown outcome for that key
- **AND** the file keeps at most 500 records of "created" and "refused", and it drops the oldest of those first
- **AND** it never drops a record of "pending" or "unknown"
- **AND** when the write of the record after the send fails, the answer is still the outcome of the send
- **AND** the file then keeps the state "pending"
- **AND** a new plugin treats that key as an unknown outcome
- **AND** a repeat of that key gets scenario 026, and a new key gets the hold of scenario 040

#### Scenario: Refuse when the ledger fails `beemaps-burst-control-039`
- **WHEN** the file `ledger.json` cannot be read, is not valid JSON, or contains a record that is not valid
- **THEN** the route answers 500 with `{error:'ledger_unavailable'}` and sends no upstream request
- **AND** the same answer follows when the write of the "pending" record fails
- **AND** a missing file is an empty ledger, and any other read error is not
- **AND** the plugin writes a temporary file first and then renames it to `ledger.json`
- **AND** the route reads the file again at the next request

### Requirement: Holds
The plugin MUST refuse each confirm until a hold ends. A hold follows a refusal of the key, the credit or the rate, and an unknown outcome. The route MUST send no upstream request during a hold.
Origin: spec-first

#### Scenario: Hold after a refusal of Bee Maps `beemaps-burst-control-029`
- **WHEN** Bee Maps refuses with 401 or 403, with 402 or with 429
- **THEN** the hold lasts 300 seconds, 600 seconds, and the seconds of `Retry-After` as in scenario 018
- **AND** a confirm during the hold gets the status and the error of the first refusal, with `ok` false, `outcome` "refused" and `held` true
- **AND** for 429 the answer also has `retryAfter` equal to the seconds that remain, and the confirm sends no upstream request and counts no credits
- **AND** a confirm at the end of the hold goes on to the next steps
- **AND** the holds after a refusal live in memory, so a new plugin has none of them

#### Scenario: Hold after an unknown outcome `beemaps-burst-control-040`
- **WHEN** the ledger contains a record with the state "unknown" or "pending" that is less than 600 seconds old
- **THEN** a confirm with a new idempotency key gets 409 with `ok` false, `outcome` "unknown", `error` "outcome_unknown", `held` true and `retryAfter`, and no upstream request
- **AND** `retryAfter` is the whole seconds that remain, rounded up, and the answer has the header `Retry-After` with the same number
- **AND** the age of a record is the time since its last change, which is the write of "pending" or the change to "unknown"
- **AND** a record that is 600 seconds old or older causes no hold
- **AND** the hold comes from the file, so a new plugin still has it
- **AND** a confirm that repeats the key of that record gets the answer of scenario 026

### Requirement: Audit log
The route `confirm` MUST write an audit line for every attempt before it sends, and it MUST NOT send when that write fails.
Origin: spec-first

#### Scenario: Write the line before the send `beemaps-burst-control-030`
- **WHEN** a test confirms a quote with a log that records the order of its calls and of the fetch calls
- **THEN** the line with the outcome "accepted" is written, and the write has ended, before the fake upstream gets its request
- **AND** a second line with the outcome "created", "refused" or "unknown" follows when the confirm ends
- **AND** when the write of the first line fails, the route answers 500 with `{error:'log_failed'}`, and it sends no upstream request
- **AND** when the write of the second line fails, the answer is still the outcome of the send

#### Scenario: Fill the line `beemaps-burst-control-031`
- **WHEN** a test reads the lines of the file `beemaps-bursts.jsonl` in the log folder
- **THEN** each line is JSON with the fields `time`, `requestId`, `outcome`, `reason`, `client`, `bbox`, `areaKm2`, `credits`, `quoteId`, `idempotencyKey`, `upstreamStatus`, `burstId` and `durationMs`
- **AND** the outcome is "accepted" before the send, and "created", "refused" or "unknown" after it, where "refused" means a refusal of Bee Maps
- **AND** a refusal of `confirm` at a step after the rate limit gets a line with the outcome "blocked" and the reason
- **AND** a request from another machine, a method that is not POST and a repeat of a key get no line
- **AND** a request over the rate limit gets no line
- **AND** the reasons are cross_origin, burst_off, no_key, bad_body, busy, key_reused, outcome_unknown, key_rejected, no_credit, upstream_rate_limit, bad_request, budget_used, budget_unavailable, quote_expired, ledger_unavailable and log_failed
- **AND** a `reason` that is not in that list, for example `rate_limited`, is written as null
- **AND** no line contains the key or a field of the answer of Bee Maps other than the ones above
- **AND** the file is renamed to a file with the suffix `.1` when a line would make it larger than 4 MiB

### Requirement: The key stays secret
The key MUST appear only in the header `Authorization` of the upstream requests. It MUST NOT appear in an answer, a header of an answer, a log line, a record, a file or a console line.
Origin: spec-first

#### Scenario: Keep the key out of every output `beemaps-burst-control-032`
- **WHEN** a test runs the four routes with a key of a rare text, with every method of `console` replaced
- **THEN** the rare text is in the header `Authorization` of the fake requests and nowhere else
- **AND** the text of an error answer of Bee Maps does not appear in an answer, a line or a record
- **AND** a fetch function that rejects with a message that contains the key leaves the key out of every output
- **AND** this is true for a created burst, for each refusal and for each unknown outcome

### Requirement: List of the bursts
The route `list` MUST send one request for the list of the bursts and answer only the fields of the table. It MUST keep an answer for 60 seconds and MUST NOT retry.
Origin: spec-first

#### Scenario: Check the request for the list `beemaps-burst-control-033`
- **WHEN** the body is larger than 1024 bytes, or is not a JSON object, or has a field other than `limit`
- **THEN** the route answers 400 with `{error:'bad_body'}`
- **AND** `limit` is a whole number from 1 to 100, and an empty body object uses 20
- **AND** `limit` only cuts the answer, and the upstream request always asks for 100
- **AND** a valid body of exactly 1024 bytes passes this step
- **AND** any other value of `limit` gives 400 with `{error:'bad_body'}`
- **AND** the steps run in this order: method, local request, rate limit, flag, key, body, memory, upstream request

#### Scenario: Send the request for the list `beemaps-burst-control-034`
- **WHEN** a test sends the body `{"limit":5}`
- **THEN** the fake gets one `GET` for "https://beemaps.com/api/developer/bursts?limit=100"
- **AND** the headers are only `Authorization` and `Accept` "application/json", the option `redirect` is "error", and the call ends in 20 seconds at most
- **AND** the answer is 200 with `bursts`, `total` and `cached` false, and `bursts` has at most 5 items
- **AND** each burst has `id`, `status`, `isHit`, `latestHitAt`, `validUntil`, `credits` and `bbox`, and no other field

#### Scenario: Clean the list `beemaps-burst-control-035`
- **WHEN** the answer of Bee Maps has a list `bursts` with valid and with bad items
- **THEN** an item without a text `_id` is dropped, and an item that is not an object is dropped
- **AND** `bbox` is [west, south, east, north] of the ring of `geojson`
- **AND** the numbers are rounded to 6 decimals, and `bbox` is null when the ring is not valid
- **AND** an answer larger than 1 MiB gives `upstream_failed`, and an answer of exactly 1 MiB is read
- **AND** a ring of 150000 positions gives its `bbox`
- **AND** `isHit` is a boolean and else false
- **AND** `status` is one of the three texts and else null
- **AND** `latestHitAt` and `validUntil` are texts and else null
- **AND** `total` is a whole number of 0 or more and else the number of items kept
- **AND** at most 100 items are kept

#### Scenario: Keep the list for 60 seconds `beemaps-burst-control-036`
- **WHEN** a test asks twice, with the same `limit` or with another `limit`
- **THEN** the second answer has `cached` true, and the fake gets one request
- **AND** an answer 60 seconds old is not used, and the plugin keeps one entry
- **AND** two requests at the same time give one upstream request
- **AND** a failed answer is not kept, and the route sends no second request after a failure
- **AND** a 401 or 403 gives 403 with `{error:'key_rejected'}`, and every other failure gives 502 with `{error:'upstream_failed'}`

### Requirement: Rate limit
Each route that sends or keeps something MUST limit the requests of a client to a number for each minute.
Origin: spec-first

#### Scenario: Limit the requests `beemaps-burst-control-037`
- **WHEN** a client sends more requests than the limit in 60 seconds
- **THEN** `quote` allows 10, `confirm` allows 3 and `list` allows 6, and the next request gets 429 with `{error:'rate_limited'}` and the header `Retry-After` 60
- **AND** a refused request sends no upstream request and writes no file, so a flood of requests cannot fill the audit file
- **AND** the window is 60 seconds on the clock of the plugin, and the status route has no limit

### Requirement: One address and no other way in
The plugin files MUST contain the two upstream addresses and no other address. No tool, voice or MCP file MUST reach the burst routes.
Origin: spec-first

#### Scenario: Scan the plugin files `beemaps-burst-control-038`
- **WHEN** a test reads the files of the plugin
- **THEN** the files are `server/providers/beemaps-burst.js` and every file in `server/providers/beemaps-burst/`, and the test lists them
- **AND** the addresses in them are "https://beemaps.com/api/developer/burst/create" and "https://beemaps.com/api/developer/bursts" once each
- **AND** no file contains the text "latest/poly", "/api/beemaps/frames" or "BEEMAPS_API_KEY"
- **AND** no file in `src/voice`, `src/tools` or `server/mcp` contains the text "beemaps/burst"
- **AND** no file of the plugin is a file of the frames provider, which are `server/providers/beemaps.js` and the files in `server/providers/beemaps/`
