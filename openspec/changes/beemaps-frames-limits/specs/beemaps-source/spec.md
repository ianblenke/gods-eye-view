## ADDED Requirements

### Requirement: Request log
The provider MUST write one result line to its log for each upstream request that it sends. It MUST NOT write a result line for a request that it does not send. A line MUST NOT have the key, a URL, a host name, a frame or a text of the body.
Origin: spec-first

#### Scenario: Log a good answer `beemaps-source-029`
- **WHEN** a test gives the plugin the options `log`, `now` and a fake fetch function
- **AND** the upstream answers `200` with a JSON body of 412 bytes
- **AND** the body has 5 items in the list `frames`, and 2 of the items are not valid frames
- **AND** the body has `creditsUsed` 99, `creditsRemaining` -0.25, `cost` 0 and `notEnoughCredits` true, and the request has the `limit` 1
- **AND** the clock moves 2000 milliseconds before the headers arrive and 826 milliseconds while the body is read
- **THEN** `log` gets exactly one line, and it is "[beemaps] ok status=200 bytes=412 frames=5 ms=2826 creditsUsed=99 creditsRemaining=-0.25 cost=0 notEnoughCredits=true"
- **AND** `frames` is the length of the list `frames` in the body, with each item counted
- **AND** `bytes` is the number of bytes of the body, so a body of 411 characters with one character of two bytes gives "bytes=412"
- **AND** a body with `notEnoughCredits` false, "true", 1 or no such key gives a line that ends after "cost=0"
- **AND** a credit field that is a finite number is written as `String()` gives it, also when the number is negative
- **AND** a credit field with the value "7", null or 1e999, and a credit field that is missing, are written as "none"
- **AND** a body with `creditsUsed` -5 gives "creditsUsed=-5" in the line

#### Scenario: Log a failure `beemaps-source-030`
- **WHEN** the upstream request fails in one of the ways below, and the clock moves 7 milliseconds during the request
- **THEN** `log` gets exactly one line for each way
- **AND** the status `401` gives "[beemaps] failed kind=key_rejected status=401 bytes=none ms=7"
- **AND** the status `403` gives "[beemaps] failed kind=key_rejected status=403 bytes=none ms=7"
- **AND** the status `402` gives "[beemaps] failed kind=no_credit status=402 bytes=none ms=7"
- **AND** the status `429` gives "[beemaps] failed kind=upstream_rate_limit status=429 bytes=none ms=7"
- **AND** the status `500` gives "[beemaps] failed kind=upstream_failed status=500 bytes=none ms=7"
- **AND** a thrown error gives "[beemaps] failed kind=upstream_failed status=none bytes=none ms=7"
- **AND** a timeout before the headers arrive gives the same line as a thrown error
- **AND** a timeout while the body is read gives "[beemaps] failed kind=upstream_failed status=200 bytes=none ms=7"
- **AND** the status `200` with the body "not json" gives "[beemaps] failed kind=bad_upstream status=200 bytes=8 ms=7"
- **AND** the status `200` with a body of 4194305 bytes gives "[beemaps] failed kind=bad_upstream status=200 bytes=over-limit ms=7"
- **AND** the status `200` with the JSON body {"frames":5} gives "[beemaps] failed kind=bad_upstream status=200 bytes=12 ms=7 creditsUsed=none"
- **AND** the JSON body {"frames":5,"creditsUsed":4} gives the same line with "bytes=28" and "creditsUsed=4"
- **AND** the JSON bodies `null` and `[]` give the same line with "bytes=4" and "bytes=2", and "creditsUsed=none"
- **AND** a JSON body of exactly 4194304 bytes gives an "ok" line with "bytes=4194304"

#### Scenario: Keep secrets out of the log `beemaps-source-031`
- **WHEN** the key is "fixture-key-Z9y8", and the upstream answers a good document and then each failure of scenario 030
- **THEN** no line has the key, "beemaps.com", "http", the id, the latitude or the longitude of a frame, or a text of the body
- **AND** a thrown error with a message that has the key and the URL gives a line with neither
- **AND** a request that is answered from memory, and a request that waits for an upstream request in flight, write no line
- **AND** a request that the hold refuses writes no line
- **AND** a request that the daily request limit refuses, and a request that the credit limit refuses, write no line
- **AND** a request with no key, and a request that gets `503` with `{error:'budget_unavailable'}`, write no line
- **AND** a plugin that gets no option `log` writes the same lines with `console.log`

### Requirement: Credit limit
The provider MUST add the credits of each upstream answer to a credit count of the day. It MUST refuse a new upstream request when the credit count is at least the credit limit. It MUST keep the count in the plugin when it cannot write the file, and it MUST write the line "[beemaps] credits file not written".
Origin: spec-first

#### Scenario: Read the credit limit `beemaps-source-032`
- **WHEN** a test gives the plugin the environment value `BEEMAPS_DAILY_CREDITS`
- **THEN** the credit limit is that number when the text has digits only and is 1 or more
- **AND** the values "1", "75" and "100000" give the limits 1, 75 and 100000
- **AND** an absent value and the values "", "0", "-3", "12.5", "7 ", " 7", "1e3" and "abc" give the limit 500
- **AND** the value of `BEEMAPS_DAILY_QUERIES` does not change the credit limit

#### Scenario: Count the credits of the day `beemaps-source-033`
- **WHEN** the upstream answers with a JSON body that has `creditsUsed` 99
- **THEN** the credit count goes from 0 to 99
- **AND** the plugin writes the text {"date":"2026-10-15","used":99} to the file `.gev-cache/beemaps/credits.json`
- **AND** the plugin waits for the write to end before it sends its own answer
- **AND** a second answer with `creditsUsed` 0.5 makes the credit count 99.5
- **AND** an answer with `creditsUsed` of -5, "7", null, 1e999 or no key adds 0
- **AND** a failure by status, a thrown error, a timeout, a body that is not JSON and a body that is too large add 0
- **AND** the JSON bodies `null` and `[]` add 0, and the route answers `502` with `{error:'bad_upstream'}`
- **AND** a JSON body whose `frames` is not a list adds its `creditsUsed`, and the route answers `502` with `{error:'bad_upstream'}`
- **AND** a request that is answered from memory, and a request that waits for an upstream request in flight, add nothing
- **AND** two requests for different areas that end at the same time add both amounts, and the file ends with the sum
- **AND** the date of an addition is the date (UTC) when the answer arrives
- **AND** an answer that arrives after 00:00:00 UTC of the next date starts that date with its own credits

#### Scenario: Keep the credit count across restarts `beemaps-source-035`
- **WHEN** a new plugin starts and the file has the date of today and `used` 99.5
- **THEN** the plugin continues from 99.5
- **AND** a file with another date, or no file, gives the credit count 0
- **AND** the credit count starts again at 0 when the date (UTC) changes while the plugin runs
- **AND** the route answers `503` with `{error:'budget_unavailable'}` and sends no request when the file is not valid JSON
- **AND** it gives the same answer when the file has no `date` text of the form `YYYY-MM-DD`
- **AND** it gives the same answer when its `used` is not a finite number of 0 or more
- **AND** it gives the same answer when the file cannot be read for another reason
- **AND** when the file cannot be written, the count stays in the plugin and the route sends its answer
- **AND** in that case `log` gets the line "[beemaps] credits file not written"
- **AND** with the limit 500 and a file that cannot be written, two answers of 300 credits each make the count 600
- **AND** the third request then gets `credit_budget`
- **AND** the writes of the file run one after the other, and the last write has the last count

#### Scenario: Refuse when the credits are used `beemaps-source-034`
- **WHEN** the credit limit is 500
- **THEN** a request that reaches the hold step passes when the credit count is 499.5
- **AND** it gets `429` with `{error:'credit_budget', used:500, limit:500}` when the count is 500
- **AND** in that case the route sends no request, and it changes neither the credit count nor the request count of the day
- **AND** the check is part of the hold step, so it comes after the memory step and before the check of the daily request limit
- **AND** inside the hold step the order is the stored hold of scenario 024, the file of the credit count, and then the credit limit
- **AND** a request with an answer in memory gets that answer when the credit limit is used
- **AND** when the credit limit and the daily request limit are both used, the answer is `credit_budget`
- **AND** a request that passes with the count 499 and gets `creditsUsed` 99 makes the count 598
- **AND** the next request then gets `credit_budget` with `used` 598
- **AND** at the next date (UTC) the count is 0 and a request passes
