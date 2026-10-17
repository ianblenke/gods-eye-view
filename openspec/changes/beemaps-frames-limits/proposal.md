## Why

On 2026-10-16 the owner pressed "Fetch frames here" at the centre of Taipei. The layer showed "Bee Maps did not answer correctly." The server writes no log, so nothing named the cause.

One real call, which the owner allowed, asked Bee Maps for a box of 200 m by 200 m at that place. The answer had 174 frames, 84620 bytes and 99 credits used. It left the balance at -0.25 credits and had the new flag `notEnoughCredits`. The shape of the answer fits the code.

The layer asks for a box of about 4 km², which is 100 times larger. At that density the answer would have about 8 MB, which is a guess from the density. The route refuses an answer of more than 4 MiB. This is the most likely cause, but no log proves it.

The route also pays for what it throws away. The layer keeps at most 200 frames, and the upstream request has no limit. The route counts requests, and it does not count credits. So it cannot stop a spend in credits, and the screen does not show one.

## What Changes

- The layer asks for a box of 300 m by 300 m (0.09 km²) in place of 4 km². The centre snaps to 0.001 degrees in place of 0.005 degrees, so the box always holds the view centre. The hint text names the new size.
- The route writes one log line for each upstream request that it sends. The line names the result, the status, the size of the body, the time and the credits of the answer. It holds no key, no address, no frame and no text of the body.
- The route adds the credits of each good answer to a count of the day, which survives a restart. It refuses a new upstream request when the count reaches the credit limit. The default limit is 500 credits, and `BEEMAPS_DAILY_CREDITS` sets another limit.
- The layer shows a message for the new refusal: "The daily limit of 500 credits is used."
- The route does not treat `notEnoughCredits` as a refusal. The frames of that answer are paid for, so the route keeps them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `beemaps-frames`: the size of the box of a request, the snap grid, the hint text and the message for the new refusal.
- `beemaps-source`: the request log and the credit limit (two new requirements, no change to an existing one).

## Impact

- New files: `server/providers/beemaps/credits.js` and the tests `src/data/beemapsCredits.test.mjs` and `src/data/beemapsLog.test.mjs`.
- Changed files: `server/providers/beemaps.js`, `server/providers/beemaps/upstream.js`, `src/layers/beemaps/box.js`, `src/layers/beemaps/model.js`, `src/layers/beemaps/messages.js`, their tests, `DATA_SOURCES.md` and `CHANGELOG.md`. The manifests `openspec/ownership.json` and `scripts/format-scope.json` list the new files.
- The change closes no gap and opens no gap in `openspec/trace`, because each changed owned file keeps full coverage.
- The owner can set `BEEMAPS_DAILY_CREDITS` in `.env`. The app works without it.
- No test sends a request to Bee Maps. The tests use fake fetch functions. The real answer of 2026-10-16 gave the shape of the fake answers.

## Later changes

- A line in the readout of the layer that shows the credits used by the last press. The route already sends `credits.used`, and the layer drops it today.
- A warning in the layer when the balance is at or below zero, from the flag `notEnoughCredits`.
- A smaller largest area for the route (today 5 km²).
- A call of `GET /balance` before a press. No test or run called it.

## Known limits and later changes

- Known limit `cost-unknown`: Nobody knows what a credit is worth in dollars. Nobody knows how the credits of a query depend on the area and on the number of frames. One call used 99 credits for 174 frames in 0.04 km². The limit of 500 credits is a guess, and the owner can change it.
- Known limit `cap-after-answer`: The price of a query is known only in its answer. So the credit limit acts after an answer, and one request can pass the limit. Requests that are in flight at the same time are not counted before their answers.
- Known limit `credits-unknown-count-zero`: An answer with no number in `creditsUsed`, and every failed request, add 0 credits to the count. An answer that is too large is paid for and thrown away. The count does not show these credits.
- Known limit `cause-unproven`: No log shows yet that the answer of the owner's press was too large. The new log shows the cause at the next press.
- Known limit `server-area`: The server still accepts a box of up to 5 km². A request that does not come from the layer can ask for more than the layer does.
- Known limit `fewer-frames`: A box of 0.09 km² shows fewer frames than a box of 4 km², in places where frames are few. A person who wants a larger view can press in several places.
- Known limit `frames-paid-not-shown`: The layer keeps 200 frames. In the densest places a box of 0.09 km² can hold more than 200 frames, and the others are paid for and dropped.
- Known limit `log-in-console`: The log goes to the console of the server only. It has no file and no rotation.
