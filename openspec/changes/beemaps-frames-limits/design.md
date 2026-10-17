## Context

Base commit: `5c13bbfb` (main, after the merge of `gdacs-source`).

The layer "Bee Maps Frames" asks the route `/api/beemaps/frames` for the newest frames in a box around the view centre. The route sends one upstream request to `https://beemaps.com/api/developer/latest/poly?catalog=true`, with the box as a polygon. The route reads the answer, keeps the id, the position and the time of each frame, and sends at most 200 frames to the layer.

The owner pressed the chip at the centre of Taipei and got "Bee Maps did not answer correctly." Two failures give that sentence: `upstream_failed` and `bad_upstream`. The route writes no log, so the failure kind is not known.

This design uses these terms.
- A box is the area of one request. The layer builds it from the view centre.
- A frame is one street image record of the answer, with a time and a position.
- An answer is the reply of Bee Maps to the upstream request.
- A press is one press of the chip "Fetch frames here".
- A credit is the unit that Bee Maps reports in `creditsUsed` and `creditsRemaining`.

Facts from one real call on 2026-10-16. The owner allowed that call, and the call came from the app container.
- The box was 200 m by 200 m (0.04 km²) at 25.048, 121.517 in Taipei.
- The status was 200 in 2.8 seconds. The body had 84620 bytes and 174 frames, which is about 486 bytes for a frame.
- The top-level keys were `frames`, `cost`, `creditsUsed`, `creditsRemaining` and `notEnoughCredits`. The last key is not in the public API description.
- `creditsUsed` was 99, `cost` was 0 and `creditsRemaining` was -0.25.
- The public API description of 2026-10-16 is the same as the saved copy of 2026-10-15 for the path `/latest/poly`.
- A call with no key gets `403` with the text "Forbidden".
- A test with fake documents of that shape passes the route and the layer at 174, 600 and 9000 frames. A fake document of 17400 frames and 4583938 bytes gives `bad_upstream`.

## Goals / Non-goals

Goals:
- A box that cannot give an answer larger than the limit of the route, and that costs less.
- A log that names the cause of the next failure.
- A limit in credits, so that a spend has a bound per day.
- A message for that limit.

Non-goals:
- A new field in the answer of the route, or a line about credits in the readout (see "Later changes" in the proposal).
- A change of the limit of 5 km² in the route.
- A request to `GET /balance`, or any other call to Bee Maps.

## Decisions

### D1: A box of 300 m by 300 m and a grid of 0.001 degrees

The density of the one call is 4350 frames for each km² in the middle of Taipei. The table shows what each half side gives at that density.

| Half side | Box | Frames | Bytes of the answer |
|---|---|---|---|
| 100 m | 0.04 km² | 174 (measured) | 84620 (measured) |
| 150 m | 0.09 km² | about 390 | about 190 KB |
| 250 m | 0.25 km² | about 1090 | about 530 KB |
| 1000 m (today) | 4 km² | about 17400 | about 8.5 MB |

The limit of the route is 4194304 bytes, which is about 8630 frames at 486 bytes. The box of 0.09 km² is 22 times below that limit at this density. The layer keeps 200 frames, so the box of 100 m is the largest box that does not drop frames at this density. A box of 150 m is large enough to hold a road that passes 100 m from the view centre. The owner can choose 100 m or 250 m, and the change of the number is one constant.

The grid of the centre goes from 0.005 to 0.001 degrees. The centre moves by at most 0.0005 degrees, which is about 56 m. The half side is 150 m, so the box always holds the view centre. The old grid moved the centre by about 280 m, which is more than the new half side.

### D2: A log line for each upstream request

The route writes one line through the option `log`. In production this option is `console.log`. A line starts with `[beemaps] ok` or `[beemaps] failed`. Then it has the fields as `name=value` texts in one fixed order. The fields are the failure kind, the status, the body size, the time in milliseconds, the frame count and the three credit numbers. The time is the difference of the option `now` before and after the request, so a test can set it.

The line has no key, no address, no frame and no text of the body. A request that the route does not send, because of memory, a hold or a limit, writes no line. The size of a body that is too large is the text `over-limit`, because the reader stops at the limit.

The log shows `notEnoughCredits=true` and a negative `creditsRemaining` as they are, because they are the facts of the owner's balance.

### D3: The credit limit joins the hold step

The spec of `beemaps-source` names eleven steps in a fixed order (scenario 022), and the last two are the hold and the budget. A twelfth step would change that scenario and the six scenarios next to it. The credit limit is a stored fact that refuses a request, as the hold is, and it comes after memory and before the query budget. So the check runs in the hold step, and the list of eleven steps stays true.

The count of credits is a number, not a whole number, because Bee Maps can send a fraction. The file `.gev-cache/beemaps/credits.json` holds `{"date":"YYYY-MM-DD","used":N}`. It is separate from `budget.json`, so no existing scenario about that file changes. The write goes after each answer and before the route sends its own answer. A failed write keeps the count in memory, writes one log line and does not stop the answer, because the frames are paid for.

A file that is not valid, or that cannot be read, gives `503` with `{error:'budget_unavailable'}`. The file of the query budget does the same.

The default limit is 500 credits. One call of 99 credits was for a box of 0.04 km², and the box of this change is 2.25 times larger. If the credits grow with the area, a press in a dense place uses about 220 credits. Then 500 credits allow two or three presses of a day. This is a guess, and the owner can set `BEEMAPS_DAILY_CREDITS`.

### D4: `notEnoughCredits` is a fact for the log, not a refusal

The answer with `notEnoughCredits` true held 174 frames that were paid for. A refusal would throw them away. The route keeps them and the log shows the flag. A later change can show a warning in the layer.

### D5: The message for the credit limit follows the message for the request limit

`credit_budget` gives "The daily limit of 500 credits is used." for the limit 500, "The daily limit of 1 credit is used." for the limit 1, and "The daily credit limit is used." when the limit is not a whole number. The layer already copies `used` and `limit` from the error body, so no other file of the layer changes.

### D6: What this change does not use

- The parameter `min_week` cuts frames older than a week. The newest frame at the test place was from April, so the cut would return nothing.
- The upstream request has no limit parameter. The only bound on the number of frames is the area.
- A smaller maximum area in the route would also protect direct requests. It changes the scenario about 5 km² and the scenarios next to it, so it waits for a later change.

### D7: The order of the work

The spec comes first, then the tests, then the code. Each rule gets a named fault. A run of the provider with a fake fetch checks the log lines and the credit file. No test and no check calls Bee Maps.

## Files and measures

- `src/layers/beemaps/box.js`: two constants (`HALF_SIDE_M`, `GRID_DEGREES`) and the comment.
- `src/layers/beemaps/model.js`: the hint text.
- `src/layers/beemaps/messages.js`: the message for `credit_budget`.
- `server/providers/beemaps/upstream.js`: the outcome also holds the status and the size of the body.
- `server/providers/beemaps/credits.js` (new): the count of credits.
- `server/providers/beemaps.js`: the options `log` and `now`, the log line and the hold check.
- The tests `src/layers/beemaps/box.test.mjs`, `layer.test.mjs`, `model.test.mjs`, `messages.test.mjs`, `src/data/beemapsCredits.test.mjs` and `src/data/beemapsLog.test.mjs`.

The check for each task names its scenario in the task list.

## Risks / Trade-offs

- [The cost of a credit is unknown] → The Known limit `cost-unknown` says it. The limit is a number that the owner can change, and the log shows the credits of each answer.
- [The new grid gives more boxes, so the memory answers fewer repeats] → A press in a new grid cell is a new request. The query limit of 20 for a day still bounds the requests.
- [A request in flight is not counted before its answer] → The Known limit `cap-after-answer` says it. The query limit and the limit of 6 requests in 60 seconds bound the overshoot.
- [A failed write of the credit file] → The count stays in memory for this run. The next start can find an old count in the file.
- [The log shows the balance of the owner] → The log is in the console of the machine of the owner. The line holds no key.
