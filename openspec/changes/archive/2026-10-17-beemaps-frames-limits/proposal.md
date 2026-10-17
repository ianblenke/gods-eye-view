## Why

On 2026-10-16 the owner pressed "Fetch frames here" at the centre of Taipei. The layer showed "Bee Maps did not answer correctly." The server writes no log, so nothing named the cause.

One real call, which the owner allowed, asked Bee Maps for a box of 200 m by 200 m at that place. The answer had 174 frames, 84620 bytes and 99 credits used. It also had `creditsRemaining` -0.25 and the new flag `notEnoughCredits`. The dashboard of the owner showed a balance of 110 dollars after that call, so these fields are not that balance. The shape of the answer fits the code.

The layer asks for a box of about 4 km², which is 100 times larger. At that density the answer has about 8.5 MB, which is a guess from the density. The route refuses an answer of more than 4 MiB. This is the most likely cause, but no log proves it.

The route also asks for frames that it drops. The layer keeps at most 200 frames, and the upstream request has no limit. The route counts requests, and it does not count the credits that the answers report. So it cannot limit them, and the screen does not show the credits used.

## What Changes

- The layer "Bee Maps Frames" asks for a box of 300 m by 300 m (0.09 km²) in place of 4 km². The centre snaps to 0.001 degrees in place of 0.005 degrees, so the box always has the view centre inside. The hint text names the new size.
- The layer "Bee Maps Bursts" keeps its box of 4 km². It shares the old box function with the frames layer today, and the burst route refuses a box under 0.1 km². So the old function stays as it is, and the frames layer gets a new function.
- The route writes one result line to its log for each upstream request that it sends. The line names the result, the status, the size of the body and the time. When the route reads a JSON body with a status from 200 to 299, the line also names its credits. The line has no key, no URL, no frame and no text of the body.
- The route adds the credits of each upstream answer to a credit count of the day. A file keeps the count across a restart. The route refuses a new upstream request when the count is at least the credit limit. The default limit is 500 credits, and `BEEMAPS_DAILY_CREDITS` sets another limit.
- The layer shows a message for the new refusal: "The daily limit of 500 credits is used."
- The route does not refuse because of `notEnoughCredits`. The route keeps the frames of that answer, because a refusal drops them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `beemaps-frames`: the size of the box of a request, the snap grid and the name of the function. Also the hint text and the message for the new refusal.
- `beemaps-bursts`: the box sentence of the requirement "Quote". The text names the box of 4 km² that the function `viewBox` builds, and no longer "the box of the frames layer". The delta splits that sentence in two. The six scenarios (006 to 011) of that requirement stay as they are.
- `beemaps-source`: the request log and the credit limit (two new requirements, and no change to a requirement that the spec has today).

## Impact

- New files: `server/providers/beemaps/credits.js` and the tests `src/data/beemapsCredits.test.mjs` and `src/data/beemapsLog.test.mjs`.
- Changed files: `server/providers/beemaps.js`, `server/providers/beemaps/upstream.js`, `src/layers/beemaps/box.js`, `src/layers/beemaps/index.js`, `src/layers/beemaps/model.js`, `src/layers/beemaps/messages.js`, one comment in `src/layers/beemapsBursts/box.js`, their tests, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.
- The new text of the requirement "Quote" changes the hash of each of its six scenarios. So at least one test of each of those six scenarios changes by a title or by one assertion about the box. The scenario `beemaps-bursts-006` also gets a new test for the function `viewBox`. No behavior of the Bursts layer changes.
- The manifests `openspec/ownership.json` and `scripts/format-scope.json` list the new files.
- The change closes no gap and opens no gap in `openspec/trace`, because each changed owned file keeps full coverage.
- The owner can set `BEEMAPS_DAILY_CREDITS` in `.env`. The app works without it.
- No test sends a request to Bee Maps. The tests use fake fetch functions. The real answer of 2026-10-16 gave the shape of the fake answers.

## Later changes

- A part in the readout of the layer that shows the credits used by the last press. The route already sends `credits.used`, and the layer drops it today.
- A warning in the layer when the flag `notEnoughCredits` is true.
- A smaller largest area for the route (today 5 km²).
- A call of `GET /balance` before a press. No test or run called it.

## Known limits and later changes

- Known limit `cost-unknown`: Nobody knows what a credit is worth in dollars, or if a credit costs dollars at all. The dashboard of the owner showed a balance of 110 dollars after the one call, and not -0.25. So the credits of an answer can be a unit with no link to that balance. Nobody knows how the credits of a query depend on the area and on the number of frames. One call used 99 credits for 174 frames in 0.04 km². The limit of 500 credits is a guess, and the owner can change it.
- Known limit `cap-after-answer`: The price of a query is known only in its answer. So the credit limit acts after an answer, and requests that are in flight at the same time are not counted before their answers. The limit of 6 requests in 60 seconds bounds how many can pass.
- Known limit `credits-count-gaps`: A failure by status, an error and a timeout add 0 credits to the count. A body that is not JSON and a body that is too large add 0 too. An answer with no number in `creditsUsed` adds 0. The route drops an answer that is too large, and the count does not show its credits.
- Known limit `not-enough-credits-goes-on`: After an answer with `notEnoughCredits` true, the route still sends the next request. Only the log shows the flag.
- Known limit `bursts-outside-count`: A burst uses credits of the same account, and the count of 500 credits does not include them.
- Known limit `write-fails-then-restart`: When the file of the credit count cannot be written, the count stays in the plugin. A restart then starts from the old count in the file.
- Known limit `cause-unproven`: No log shows yet that the answer of the owner's press was too large. The new log shows the cause at the next press.
- Known limit `credits-used-reading`: The change reads `creditsUsed` as the credits of this answer, from one call. If it were a total of the account, the count would be too high, which is the safe direction.
- Known limit `crash-before-write`: A crash after an answer and before the plugin writes the credit file loses the credits of that answer.
- Known limit `bad-answers-repeat`: An answer that is too large, or that is not JSON, adds 0 credits and sets no hold. Bee Maps can use credits for these answers. The same press can repeat up to 20 times in a day.
- Known limit `two-servers`: Two servers that share one `.gev-cache` folder overwrite the credit file of each other.
- Known limit `check-before-count`: The check of the credit limit runs before the plugin writes the request count. A request that passed the check can send after another answer takes the credit count over the limit.
- Known limit `log-gaps`: The line `frames=` counts the items of a list of more than 5000 items. A failed read of the body with no timeout has no sample.
- Known limit `gate-cost-tests`: The tests for `beemaps-bursts-006` to `beemaps-bursts-011` change by a title or by one assertion. The gate hashes the text of the requirement with each scenario. Their behavior does not change. The new test for `beemaps-bursts-006` is in `src/layers/beemaps/box.test.mjs`.
- Known limit `server-area`: The server still accepts a box of up to 5 km². A request that does not come from the layer can ask for more than the layer does.
- Known limit `fewer-frames`: A box of 0.09 km² shows fewer frames than a box of 4 km², in places where frames are few. A person who wants a larger view can press in several places.
- Known limit `frames-dropped-by-route`: The layer asks for at most 200 frames, and the route sends no more. In the densest places a box of 0.09 km² can have more than 200 frames. The route drops the others, and Bee Maps can use credits for them.
- Known limit `log-in-console`: The log goes to the console of the server only. It has no file and no rotation.
- Known limit `credit-file-in-place`: The plugin writes the credit file in place, with no temporary file and no rename. A crash while the plugin writes can leave a part of the text. Then each request that the memory does not answer gets `503` until a person repairs the file.
- Known limit `clock-set-back`: The credit count starts again at 0 when the date (UTC) differs from the date in the credit file. So a clock that a person sets to an earlier date resets the count.
- Known limit `lines-without-test`: The tests for `beemaps-source-033` make no timeout and no body that is too large. The tests for `beemaps-source-034` send no request that a step before the hold step refuses, at the count 500.
- Known limit `comment-in-proxy-test`: In `src/data/beemapsProxy.test.mjs`, a comment in the test for `beemaps-source-017` says that only the budget file fails to write. The plugin cannot read that file, because the cache folder is a file. So the test stops at the step that reads the budget file. The test in `src/data/beemapsBudget.test.mjs` shows what happens when the plugin cannot write that file.
- Known limit `log-credits-wording`: DATA_SOURCES.md says that the line "has its credits" when the route reads a JSON body with a status from 200 to 299. A JSON body with no number gives the value `none` for `creditsUsed`, `creditsRemaining` and `cost`. A body of the wrong shape gives `creditsUsed` only. The scenarios `beemaps-source-029` and `beemaps-source-030` give the exact fields.
