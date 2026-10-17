## Context

Base commit: `5c13bbfb` (main, after the merge of `gdacs-source`).

The layer "Bee Maps Frames" asks the route `/api/beemaps/frames` for the newest frames in a box around the view centre. The route sends one upstream request to `https://beemaps.com/api/developer/latest/poly?catalog=true`, with the box as a polygon. The route reads the answer, keeps the id, the position and the time of each frame, and sends at most 200 frames to the layer.

The owner pressed the chip at the centre of Taipei and got "Bee Maps did not answer correctly." Two failures give that sentence: `upstream_failed` and `bad_upstream`. The route writes no log, so the failure kind is not known.

The layer "Bee Maps Bursts" builds the box of its quote with the same function `viewBox` as the frames layer. The burst route refuses a box under 0.1 km².

This design uses these terms.
- A box is the area of one request. The layer builds it from the view centre.
- A frame is one street image record of the answer, with a time and a position.
- An answer is the reply of Bee Maps to the upstream request.
- A press is one press of the chip "Fetch frames here".
- A credit is the unit that Bee Maps reports in `creditsUsed` and `creditsRemaining`.
- The credit count is the sum of the credits of the answers of one UTC day.
- The daily request limit is the limit of upstream requests that the route has today (`BEEMAPS_DAILY_QUERIES`). The credit limit is the new limit.

Facts from the checks of 2026-10-16. The first group comes from one real call. The owner allowed that call, and the call came from the app container.
- The box was 200 m by 200 m (0.04 km²) at 25.048, 121.517 in Taipei.
- The status was 200 in 2.8 seconds. The body had 84620 bytes and 174 frames, which is about 486 bytes for a frame.
- The top-level keys were `frames`, `cost`, `creditsUsed`, `creditsRemaining` and `notEnoughCredits`. The last key is not in the public API description.
- `creditsUsed` was 99, `cost` was 0 and `creditsRemaining` was -0.25.
- The first frame in the list had the time 2026-04-06.

Other checks, which used no key and no real call:
- The public API description of 2026-10-16 differs from the saved copy of 2026-10-15 only in the path `/requestVideo`.
- A call with no key, from the app container, gets `403` with the text "Forbidden".
- A test with fake documents of the real shape passes the route and the layer at 174 and 600 frames. The fake frames have about 263 bytes, and the real frames have about 486 bytes.

## Goals / Non-goals

Goals:
- A box that cannot give an answer larger than the limit of the route, and that costs less.
- A log that names the cause of the next failure.
- A limit in credits for each day, so that the owner knows the most that the route can use.
- A message for that limit.
- No change in the behavior of the Bursts layer.

Non-goals:
- A new field in the answer of the route, or a part about credits in the readout (see "Later changes" in the proposal).
- A change of the limit of 5 km² in the route.
- A request to `GET /balance`, or any other call to Bee Maps.

## Decisions

### D1: A box of 300 m by 300 m and a grid of 0.001 degrees, in a new function

The density of the one call is 4350 frames for each km² in the middle of Taipei. The table shows what each half side gives at that density. The half side is half of the side of the box.

| Half side | Box | Frames | Bytes of the answer |
|---|---|---|---|
| 100 m | 200 m by 200 m, 0.04 km² | 174 (measured) | 84620 (measured) |
| 150 m | 300 m by 300 m, 0.09 km² | about 390 | about 190 KB |
| 250 m | 500 m by 500 m, 0.25 km² | about 1090 | about 530 KB |
| 1000 m (today) | 2 km by 2 km, 4 km² | about 17400 | about 8.5 MB |

The limit of the route is 4194304 bytes, which is about 8630 frames at 486 bytes. The box of 0.09 km² is 22 times below that limit at this density. The layer keeps 200 frames. A half side of 100 m gives 174 frames, which is below 200. A half side of 150 m is large enough to contain a road that passes within 90 m of the view centre. The owner can choose another half side, and the change is one constant.

The grid of the centre goes from 0.005 to 0.001 degrees. The centre moves by at most 0.0005 degrees, which is about 56 m. The half side of 150 m is larger than 56 m, so the box always has the view centre inside. A road within 90 m of the view centre is inside the box. The half side minus that shift is 94 m, which is more than 90 m. The old grid moved the centre by about 280 m, which is more than the new half side.

The Bursts layer needs the old box of 4 km². So `viewBox` stays as it is, and a new function `framesBox` builds the new box. Both call one internal function with the half side and the grid as arguments. The frames layer calls `framesBox`. The requirement "Quote" of the Bursts layer says "the box of the frames layer". That sentence becomes false, so the delta of `beemaps-bursts` names the function `viewBox` and the size of 4 km².

### D2: A log line for each upstream request

The route writes one result line through the option `log`. In production this option is `(line) => console.log(line)`, which reads `console.log` at each call. A line starts with `[beemaps] ok` or `[beemaps] failed`. Then it has the fields as `name=value` texts in one fixed order.

The fields of an "ok" line are `status`, `bytes`, `frames`, `ms`, `creditsUsed`, `creditsRemaining`, `cost` and, only when the value is exactly `true`, `notEnoughCredits=true`. The fields of a "failed" line are `kind`, `status`, `bytes` and `ms`. A failed line for a JSON body of the wrong shape also ends with `creditsUsed`, because the credit count adds those credits.

The time is the difference of the option `now` before the upstream call and after the outcome is known. The time to read the body is part of it. The size of the body is the length in bytes of its text in UTF-8, because the helper `readResponseTextCapped` returns text and not bytes. The size of a body that is too large is the text `over-limit`, because the reader stops at the limit.

The status and the size come from an optional function `observe` that `callUpstream` calls when it knows them. The outcome that `callUpstream` returns keeps its shape, so the eight existing tests that compare the whole outcome stay as they are.

The line has no key, no URL, no host name, no frame and no text of the body. A request that the route does not send, because of memory, a hold or a limit, writes no line.

The log shows `notEnoughCredits=true` and a negative `creditsRemaining` as they are, because they are the facts of the owner's balance.

### D3: The credit limit joins the hold step

The spec of `beemaps-source` names eleven steps in a fixed order (scenario 022), and the last two are the hold and the budget. A twelfth step changes that scenario and the six scenarios next to it. The credit limit is a stored fact that refuses a request, as the hold is, and it comes after memory and before the request limit. So the check runs in the hold step, and the list of eleven steps stays true. Inside the step the stored hold comes before the credit limit. The route reads the credit file once, at the first request, before it checks the limit.

The credit count is a number and not a whole number, because Bee Maps can send a fraction. The file `.gev-cache/beemaps/credits.json` has `{"date":"YYYY-MM-DD","used":N}`. It is separate from `budget.json`, so no existing scenario about that file changes. The route reads the credit file when the first request reaches the check, and then it keeps the count in the plugin. An addition of 0 writes no file.

The route adds the credits of an answer when the answer is a JSON body, before it checks the shape of the document. So a document of the wrong shape adds its credits. The date of an addition is the date (UTC) at the moment of the addition, after the plugin reads the body. The plugin writes the credit file for one addition at a time, and it fixes the text at the addition. It finishes the write before it sends its own answer.

A failed write keeps the count in the plugin, writes one log line and does not stop the answer, because the frames are paid for. A file that is not valid, or that cannot be read, gives `503` with `{error:'budget_unavailable'}`. The file of the request limit does the same.

The default limit is 500 credits. One call of 99 credits was for a box of 0.04 km², and the box of this change is 2.25 times larger. If the credits grow with the area, a press in a dense place uses about 220 credits. Then 500 credits allow two or three presses of a day. This is a guess, and the owner can set `BEEMAPS_DAILY_CREDITS`.

The reader `readCredits` in `normalize.js` must not throw for the body `null`. The change makes it safe for a value that is not an object.

### D4: `notEnoughCredits` is a fact for the log, not a refusal

The answer with `notEnoughCredits` true had 174 frames that Bee Maps charged for. A refusal drops them. The route keeps them and the log shows the flag. A later change can show a warning in the layer.

### D5: The message for the credit limit follows the message for the request limit

`credit_budget` gives "The daily limit of 500 credits is used." for the limit 500, "The daily limit of 1 credit is used." for the limit 1, and "The daily credit limit is used." when the limit is not a whole number. The layer already copies `used` and `limit` from the error body, so `source.js` does not change. The layer drops a `used` that is not a whole number, and the message does not use `used`.

### D6: What this change does not use

- The parameter `min_week` cuts old frames. It does not bound the area, and the first frame of the one call was from April 2026. So this change does not use it.
- The upstream request has no limit parameter. The only bound on the number of frames is the area.
- A smaller maximum area in the route also protects direct requests. It changes the scenario about 5 km² and the scenarios next to it, so it waits for a later change.

### D7: The order of the work

The spec comes first, then the tests, then the code. Each rule gets a named fault. A run of the provider with a fake fetch checks the log lines and the credit file. No test and no check calls Bee Maps.

## Files and measures

- `src/layers/beemaps/box.js`: the internal function, `viewBox` (unchanged result) and `framesBox`, and the comment.
- `src/layers/beemaps/index.js`: the call of `framesBox`.
- `src/layers/beemaps/model.js`: the hint text.
- `src/layers/beemaps/messages.js`: the message for `credit_budget`.
- `src/layers/beemapsBursts/box.js`: one comment.
- `server/providers/beemaps/upstream.js`: the function `observe`.
- `server/providers/beemaps/normalize.js`: `readCredits` for a value that is not an object.
- `server/providers/beemaps/credits.js` (new): the credit count.
- `server/providers/beemaps.js`: the options `log` and `fs`, the log line and the check of the credit limit.
- The tests `src/layers/beemaps/box.test.mjs`, `layer.test.mjs`, `model.test.mjs`, `messages.test.mjs`, the three Bursts test files `src/layers/beemapsBursts/box.test.mjs`, `layer.test.mjs` and `model.test.mjs`, `src/data/beemapsFrames.test.mjs`, `beemapsProxy.test.mjs`, `beemapsUpstream.test.mjs`, `beemapsBurstScan.test.mjs`, and the new `src/data/beemapsCredits.test.mjs` and `src/data/beemapsLog.test.mjs`.

## Risks / Trade-offs

- [The cost of a credit is unknown] → The Known limit `cost-unknown` says it. The limit is a number that the owner can change, and the log shows the credits of each answer.
- [The new grid gives more boxes, so the memory answers fewer repeats] → A press in a new grid cell is a new request. The request limit of 20 for a day still bounds the requests.
- [A request in flight is not counted before its answer] → The Known limit `cap-after-answer` says it. The request limit and the limit of 6 requests in 60 seconds bound the overshoot.
- [A failed write of the credit file] → The count stays in the plugin for this run. The next start can find an old count in the file.
- [The log shows the balance of the owner] → The log is in the console of the machine of the owner. The line has no key.
- [A new function and an old function build boxes] → One internal function builds both, and the tests of both layers pin the rows.
