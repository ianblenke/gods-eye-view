## ADDED Requirements

### Requirement: Request log
The provider MUST write one line to its log for each upstream request that it sends. It MUST NOT write a line for a request that it does not send. A line MUST NOT hold the key, an address, a frame or a text of the body.
Origin: spec-first

#### Scenario: Log a good answer `beemaps-source-029`
- **WHEN** a test gives the plugin the options `log`, `now` and a fake fetch function
- **AND** the upstream answers `200` with a JSON body of 412 bytes
- **AND** the body has 3 frames, `creditsUsed` 99, `creditsRemaining` -0.25, `cost` 0 and `notEnoughCredits` true
- **AND** the clock moves 2826 milliseconds during the upstream request
- **THEN** `log` gets exactly one line, and it is "[beemaps] ok status=200 bytes=412 frames=3 ms=2826 creditsUsed=99 creditsRemaining=-0.25 cost=0 notEnoughCredits=true"
- **AND** a body with `notEnoughCredits` false, or with no such key, gives a line that ends after "cost=0"
- **AND** a body with `creditsUsed` "7", null, or no key gives "creditsUsed=none" in the line
- **AND** `creditsRemaining` and `cost` give "none" in the same way, and a negative number is written as it is
- **AND** `bytes` is the number of bytes of the body, and `frames` is the length of the list `frames` before the route cuts it

#### Scenario: Log a failure `beemaps-source-030`
- **WHEN** the upstream request fails in one of the ways below, and the clock moves 7 milliseconds during the request
- **THEN** `log` gets exactly one line for each way
- **AND** the status `401` gives "[beemaps] failed kind=key_rejected status=401 bytes=none ms=7"
- **AND** the status `403` gives "[beemaps] failed kind=key_rejected status=403 bytes=none ms=7"
- **AND** the status `402` gives "[beemaps] failed kind=no_credit status=402 bytes=none ms=7"
- **AND** the status `429` gives "[beemaps] failed kind=upstream_rate_limit status=429 bytes=none ms=7"
- **AND** the status `500` gives "[beemaps] failed kind=upstream_failed status=500 bytes=none ms=7"
- **AND** a thrown error gives "[beemaps] failed kind=upstream_failed status=none bytes=none ms=7"
- **AND** a timeout gives the same line as a thrown error
- **AND** the status `200` with the body "not json" gives "[beemaps] failed kind=bad_upstream status=200 bytes=8 ms=7"
- **AND** the status `200` with the body {"frames":5} gives "[beemaps] failed kind=bad_upstream status=200 bytes=12 ms=7"
- **AND** the status `200` with a body of 4194305 bytes gives "[beemaps] failed kind=bad_upstream status=200 bytes=over-limit ms=7"
- **AND** a JSON body of exactly 4194304 bytes gives an "ok" line with "bytes=4194304"

#### Scenario: Keep secrets out of the log `beemaps-source-031`
- **WHEN** the key is "fixture-key-Z9y8", and the upstream answers a good document and then each failure of scenario 030
- **THEN** no line holds the key, "beemaps.com", "http", the id, the latitude or the longitude of a frame, or a text of the body
- **AND** a request that is answered from memory, and a request that waits for an upstream request in flight, write no line
- **AND** a request that the hold refuses writes no line
- **AND** a request that the daily query limit refuses, a request that the credit limit refuses, and a request with no key write no line
- **AND** a plugin that gets no option `log` writes the same lines with `console.log`

### Requirement: Credit limit
The provider MUST add the credits of each upstream answer to a count of the day. It MUST refuse a new upstream request when the count has reached the credit limit.
Origin: spec-first

#### Scenario: Read the credit limit `beemaps-source-032`
- **WHEN** a test gives the plugin the environment value `BEEMAPS_DAILY_CREDITS`
- **THEN** the credit limit is that number when the text has digits only and is 1 or more
- **AND** the values "1", "75" and "100000" give the limits 1, 75 and 100000
- **AND** an absent value and the values "", "0", "-3", "12.5", "7 ", " 7", "1e3" and "abc" give the limit 500
- **AND** the value of `BEEMAPS_DAILY_QUERIES` does not change the credit limit

#### Scenario: Count the credits of the day `beemaps-source-033`
- **WHEN** the upstream answers with a JSON document that has `creditsUsed` 99
- **THEN** the count of the day goes from 0 to 99
- **AND** the plugin writes `{"date":"2026-10-15","used":99}` to `.gev-cache/beemaps/credits.json`, and it waits for the write to end before it sends its own answer
- **AND** a second answer with `creditsUsed` 0.5 makes the count 99.5
- **AND** an answer with `creditsUsed` of -5, "7", null or no key adds 0
- **AND** a failure by status, a thrown error, a timeout, a body that is not JSON and a body that is too large add 0
- **AND** a JSON document whose `frames` is not a list adds its `creditsUsed`
- **AND** a request that is answered from memory, and a request that waits for an upstream request in flight, add nothing
- **AND** a new plugin that finds the date of today and a `used` in the file continues from that `used`
- **AND** a file with another date, or no file, gives the count 0
- **AND** the count starts again at 0 when the date (UTC) changes while the plugin runs
- **AND** the route answers `503` with `{error:'budget_unavailable'}` and sends no request when the file is not valid JSON
- **AND** it gives the same answer when the file has no `date` text of the form `YYYY-MM-DD`
- **AND** it gives the same answer when its `used` is not a finite number of 0 or more
- **AND** it gives the same answer when the file cannot be read for another reason
- **AND** a request that is answered from memory still gets its answer when the file is not valid
- **AND** when the file cannot be written, the count stays in memory and the route sends its answer
- **AND** in that case `log` gets the line "[beemaps] credits file not written"
- **AND** the writes of the file run one after the other, and the last write holds the last count

#### Scenario: Refuse when the credits are used `beemaps-source-034`
- **WHEN** the credit limit is 500
- **THEN** a request that reaches the hold step goes on when the count is 499.5
- **AND** it gets `429` with `{error:'credit_budget', used:500, limit:500}` when the count is 500
- **AND** in that case the route sends no request, and it changes neither the count of credits nor the count of requests
- **AND** the check is part of the hold step, so it comes after the memory step and before the check of the daily query limit
- **AND** a request with an answer in memory gets that answer when the credit limit is used
- **AND** when the hold of scenario 024 and the used credit limit both apply, the hold answers
- **AND** when the credit limit and the daily query limit are both used, the answer is `credit_budget`
- **AND** a request that goes on with the count 499 and gets `creditsUsed` 99 makes the count 598
- **AND** the next request then gets `credit_budget` with `used` 598
- **AND** at the next date (UTC) the count is 0 and a request goes on
