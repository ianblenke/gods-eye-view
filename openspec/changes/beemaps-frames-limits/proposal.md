## Why

On 2026-10-16 the owner pressed "Fetch frames here" at the centre of Taipei. The layer showed "Bee Maps did not answer correctly." The server writes no log, so nothing named the cause.

One real call, which the owner allowed, asked Bee Maps for a box of 200 m by 200 m at that place. The answer had 174 frames, 84620 bytes and 99 credits used. It left the balance at -0.25 credits and had the new flag `notEnoughCredits`. The shape of the answer fits the code.

The layer asks for a box of about 4 km², which is 100 times larger. At that density the answer has about 8.5 MB, which is a guess from the density. The route refuses an answer of more than 4 MiB. This is the most likely cause, but no log proves it.

The route also pays for what it drops. The layer keeps at most 200 frames, and the upstream request has no limit. The route counts requests, and it does not count credits. So it cannot limit the credits that Bee Maps charges, and the screen does not show them.

## What Changes

- The layer "Bee Maps Frames" asks for a box of 300 m by 300 m (0.09 km²) in place of 4 km². The centre snaps to 0.001 degrees in place of 0.005 degrees, so the box always has the view centre inside. The hint text names the new size.
- The layer "Bee Maps Bursts" keeps its box of 4 km². It shares the old box function with the frames layer today, and the burst route refuses a box under 0.1 km². So the old function stays as it is, and the frames layer gets a new function.
- The route writes one result line to its log for each upstream request that it sends. The line names the result, the status, the size of the body, the time and the credits of the answer. It has no key, no URL, no frame and no text of the body.
- The route adds the credits of each upstream answer to a credit count of the day, which survives a restart. It refuses a new upstream request when the count is at least the credit limit. The default limit is 500 credits, and `BEEMAPS_DAILY_CREDITS` sets another limit.
- The layer shows a message for the new refusal: "The daily limit of 500 credits is used."
- The route does not refuse because of `notEnoughCredits`. The frames of that answer are paid for, so the route keeps them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `beemaps-frames`: the size of the box of a request, the snap grid and the name of the function. Also the hint text and the message for the new refusal.
- `beemaps-bursts`: one sentence of the requirement "Quote" (the box is the box of 4 km² and no longer "the box of the frames layer"). The six scenarios (006 to 011) of that requirement stay as they are.
- `beemaps-source`: the request log and the credit limit (two new requirements, and no change to a requirement that the spec has today).

## Impact

- New files: `server/providers/beemaps/credits.js` and the tests `src/data/beemapsCredits.test.mjs` and `src/data/beemapsLog.test.mjs`.
- Changed files: `server/providers/beemaps.js`, `server/providers/beemaps/upstream.js`, `src/layers/beemaps/box.js`, `src/layers/beemaps/index.js`, `src/layers/beemaps/model.js`, `src/layers/beemaps/messages.js`, one comment in `src/layers/beemapsBursts/box.js`, their tests, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.
- The new text of the requirement "Quote" changes the hash of each of its six scenarios. So one test of each of those six scenarios changes by a title or by one assertion about the box. No behavior of the Bursts layer changes.
- The manifests `openspec/ownership.json` and `scripts/format-scope.json` list the new files.
- The change closes no gap and opens no gap in `openspec/trace`, because each changed owned file keeps full coverage.
- The owner can set `BEEMAPS_DAILY_CREDITS` in `.env`. The app works without it.
- No test sends a request to Bee Maps. The tests use fake fetch functions. The real answer of 2026-10-16 gave the shape of the fake answers.

## Later changes

- A part in the readout of the layer that shows the credits used by the last press. The route already sends `credits.used`, and the layer drops it today.
- A warning in the layer when the balance is at or below zero, from the flag `notEnoughCredits`.
- A smaller largest area for the route (today 5 km²).
- A call of `GET /balance` before a press. No test or run called it.

## Known limits and later changes

- Known limit `cost-unknown`: Nobody knows what a credit is worth in dollars. Nobody knows how the credits of a query depend on the area and on the number of frames. One call used 99 credits for 174 frames in 0.04 km². The limit of 500 credits is a guess, and the owner can change it.
- Known limit `cap-after-answer`: The price of a query is known only in its answer. So the credit limit acts after an answer, and requests that are in flight at the same time are not counted before their answers. The limit of 6 requests in 60 seconds bounds how many can pass.
- Known limit `credits-count-gaps`: A failure by status, an error and a timeout add 0 credits to the count. A body that is not JSON and a body that is too large add 0 too. An answer with no number in `creditsUsed` adds 0. An answer that is too large is paid for and dropped, and the count does not show these credits.
- Known limit `not-enough-credits-goes-on`: After an answer with `notEnoughCredits` true, the route still sends the next request. Only the log shows the flag.
- Known limit `bursts-outside-count`: A burst takes credits from the same account, and the count of 500 credits does not include them.
- Known limit `write-fails-then-restart`: When the file of the credit count cannot be written, the count stays in the plugin. A restart then starts from the old count in the file.
- Known limit `cause-unproven`: No log shows yet that the answer of the owner's press was too large. The new log shows the cause at the next press.
- Known limit `credits-used-reading`: The change reads `creditsUsed` as the credits of this answer, from one call. If it were a total of the account, the count would be too high, which is the safe direction.
- Known limit `crash-before-write`: A crash between an answer and the end of the write of the credit file loses the credits of that answer.
- Known limit `bad-answers-repeat`: An answer that is too large, or that is not valid, is charged, adds 0 credits and sets no hold. The same press can repeat up to 20 times in a day.
- Known limit `two-servers`: Two servers that share one `.gev-cache` folder overwrite the credit file of each other.
- Known limit `check-before-count`: The check of the credit limit runs before the plugin writes the request count. A request that passed the check can send after another answer takes the credit count over the limit.
- Known limit `log-gaps`: The line `frames=` counts the items of a list of more than 5000 items. A failed read of the body with no timeout has no sample.
- Known limit `gate-cost-tests`: The tests for `beemaps-bursts-006` to `beemaps-bursts-011` change by a title or by one assertion. The gate hashes the text of the requirement with each scenario. Their behavior does not change.
- Known limit `server-area`: The server still accepts a box of up to 5 km². A request that does not come from the layer can ask for more than the layer does.
- Known limit `fewer-frames`: A box of 0.09 km² shows fewer frames than a box of 4 km², in places where frames are few. A person who wants a larger view can press in several places.
- Known limit `frames-paid-not-shown`: The layer keeps 200 frames. In the densest places a box of 0.09 km² can have more than 200 frames, and the others are paid for and dropped.
- Known limit `log-in-console`: The log goes to the console of the server only. It has no file and no rotation.
