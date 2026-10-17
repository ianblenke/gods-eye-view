## ADDED Requirements

### Requirement: Request log
The provider MUST write one result line to its log for each upstream request that it sends. It MUST NOT write a result line for a request that it does not send. A line MUST NOT have the key, a URL, a host name, a frame or a string from the body.
Origin: spec-first

#### Scenario: Log a good answer `beemaps-source-029`
- **WHEN** a test gives the plugin the options `log`, `now` and a fake fetch function
- **AND** the upstream answers `200` with a JSON body of 412 bytes
- **AND** the body has 5 items in the list `frames`, and 2 of the items are not valid frames
- **AND** the body has `creditsUsed` 99, `creditsRemaining` -0.25, `cost` 0 and `notEnoughCredits` true, and the request has the `limit` 1
- **AND** the clock moves 2000 milliseconds before the headers arrive and 826 milliseconds while the plugin reads the body
- **THEN** `log` gets exactly one line, and it is "[beemaps] ok status=200 bytes=412 frames=5 ms=2826 creditsUsed=99 creditsRemaining=-0.25 cost=0 notEnoughCredits=true"
- **AND** `frames` is the length of the list `frames` in the body, with each item counted
- **AND** `bytes` is the length in bytes of the text of the body in UTF-8
- **AND** a body of 411 characters with one character of two bytes gives "bytes=412"
- **AND** a JSON body of exactly 4194304 bytes gives an "ok" line with "bytes=4194304"
- **AND** a body with `notEnoughCredits` false, "true", 1 or no field `notEnoughCredits` gives a line that ends after "cost=0"
- **AND** the plugin writes the text that `String()` gives for a credit field that is a finite number, also for a negative number
- **AND** a body with `creditsUsed` "7", `creditsRemaining` null and `cost` 1e999 gives "creditsUsed=none creditsRemaining=none cost=none"
- **AND** the plugin writes "none" for a credit field that is absent
- **AND** a good answer with the status 206 gives "status=206"
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
- **AND** a timeout while the plugin reads the body gives "[beemaps] failed kind=upstream_failed status=200 bytes=none ms=7"
- **AND** the status `200` with the body "not json" gives "[beemaps] failed kind=bad_upstream status=200 bytes=8 ms=7"
- **AND** the status `200` with a body of 4194305 bytes gives "[beemaps] failed kind=bad_upstream status=200 bytes=over-limit ms=7"
- **AND** the status `200` with the JSON body {"frames":5} gives "[beemaps] failed kind=bad_upstream status=200 bytes=12 ms=7 creditsUsed=none"
- **AND** the JSON body {"frames":5,"creditsUsed":4} gives the same line with "bytes=28" and "creditsUsed=4"
- **AND** the JSON bodies `null` and `[]` give the same line with "bytes=4" and "bytes=2", and "creditsUsed=none"
- **AND** a JSON body of the wrong shape gives "creditsUsed=-5" for the value -5, and "creditsUsed=none" for the value "7" and for 1e999

#### Scenario: Keep secrets out of the log `beemaps-source-031`
- **WHEN** the key is "fixture-key-Z9y8", and the upstream answers a good document and then each failure of scenario 030
- **THEN** no line has the key, "beemaps.com", "http", the id, the latitude or the longitude of a frame, or a string from the body
- **AND** a thrown error with a message that has the key and the URL gives a line with neither
- **AND** a request that the memory answers, and a request that waits for an upstream request in flight, write no line
- **AND** a request that the hold refuses writes no line
- **AND** a request that the daily request limit refuses, and a request that the credit limit refuses, write no line
- **AND** a request with no key, and a request that gets `503` with `{error:'budget_unavailable'}`, write no line
- **AND** a plugin that gets no option `log` writes the same lines with `console.log`

### Requirement: Credit limit
The provider MUST add the credits of each upstream answer to a credit count of the day. It MUST refuse a new upstream request when the credit count is at least the credit limit. It MUST keep the count in the plugin when it cannot write the credit file `.gev-cache/beemaps/credits.json`. In that case it MUST write the line "[beemaps] credits file not written".
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
- **AND** the plugin writes the text {"date":"2026-10-15","used":99} to the credit file
- **AND** the plugin writes the credit file first, and then it sends its own answer
- **AND** a second answer with `creditsUsed` 0.5 makes the credit count 99.5
- **AND** an answer with `creditsUsed` of -5, "7", null or 1e999, and an answer with no field `creditsUsed`, add 0
- **AND** an addition of 0 writes no file
- **AND** a failure by status, a thrown error, a timeout, a body that is not JSON and a body that is too large add 0
- **AND** the JSON bodies `null` and `[]` add 0, and the route answers `502` with `{error:'bad_upstream'}`
- **AND** a JSON body whose `frames` is not a list adds its `creditsUsed`, and the route answers `502` with `{error:'bad_upstream'}`
- **AND** a request that the memory answers, and a request that waits for an upstream request in flight, add nothing
- **AND** two requests for different areas that end at the same time add both amounts, and the credit file ends with the sum
- **AND** the date of an addition is the date (UTC) at the moment of the addition, which is after the plugin reads the body
- **AND** an answer that the plugin adds after 00:00:00 UTC of the next date starts that date with its own credits

#### Scenario: Refuse when the credits are used `beemaps-source-034`
- **WHEN** the credit limit is 500
- **THEN** a request that reaches the hold step passes when the credit count is 499.5
- **AND** with the limit 75 and the credit count 75, the answer is `429` with `{error:'credit_budget', used:75, limit:75}`
- **AND** it gets `429` with `{error:'credit_budget', used:500, limit:500}` when the credit count is 500
- **AND** in that case the route sends no request, and it changes neither the credit count nor the request count of the day
- **AND** the check is part of the hold step, so it comes after the memory step and before the check of the daily request limit
- **AND** inside the hold step the stored hold of scenario 024 comes before the credit limit
- **AND** two requests for different areas are in flight at the count 499, and one gets `creditsUsed` 99 and the other gets `401`
- **AND** a request for a third area then gets `key_rejected` from the stored hold, and not `credit_budget`
- **AND** a request with an answer in memory gets that answer when the credit limit is used
- **AND** a request that reaches the hold step with the credit limit and the daily request limit both used gets `credit_budget`
- **AND** the steps before the hold step answer first, as scenario 022 says
- **AND** a request that passes with the count 499 and gets `creditsUsed` 99 makes the credit count 598
- **AND** the next request for another area then gets `credit_budget` with `used` 598
- **AND** at the next date (UTC) the credit count is 0 and a request passes

#### Scenario: Keep the credit count across restarts `beemaps-source-035`
- **WHEN** a new plugin starts and the credit file has the date of today and `used` 99.5
- **THEN** the plugin continues from 99.5
- **AND** a credit file with another date, or no credit file, gives the credit count 0
- **AND** the credit count starts again at 0 when the date (UTC) changes while the plugin runs
- **AND** the route answers `503` with `{error:'budget_unavailable'}` and sends no request when the credit file is not valid JSON
- **AND** it gives the same answer when the credit file has no `date` text of the form `YYYY-MM-DD`
- **AND** it gives the same answer when its `used` is not a finite number of 0 or more
- **AND** it gives the same answer when the plugin cannot read the credit file for another reason
- **AND** in each of these cases the request count of the day stays as it was, and the plugin writes no log line
- **AND** when the plugin cannot write the credit file, the count stays in the plugin and the route sends its answer, with no `503`
- **AND** in that case `log` gets the line "[beemaps] credits file not written" once for each failed write
- **AND** that line comes before the result line of the request, so two failed writes give two lines
- **AND** with the limit 500 and a credit file that cannot be written, two answers of 300 credits each make the credit count 600
- **AND** a request for a third area then gets `credit_budget`
- **AND** the plugin writes the credit file for one addition at a time, and the last addition gives the final text
