## Context

Base commit: `90698216` (main, after the merge of `beemaps-frames`).
The OSH control route (`server/providers/osh-control.js` and its folder) is the model for the gate, the audit line and the order of the steps. The frames provider of change 1 is the model for the holds, the daily count and the injected fetch function, clock and timers.

The create call of Bee Maps is `POST https://beemaps.com/api/developer/burst/create`. The body is a list of requests, and each request has a `geojson` shape and a `credits` number of 125 or more. The answer has `success`, `bursts` and `creditsRemaining`. The description lists only the answers 200 and 500 for this call. It has no dry run, no cancel call and no dollar rate. The call `GET /bursts` lists the bursts that the key created.

## Goals / Non-goals

**Goals:**
- Spend money only when four things are true. The flag is exactly "true". A key of its own is set. The request comes from this machine. A person confirmed a quote.
- Exactly one create request for one confirmed quote. No retry. No second request while one runs.
- A durable budget, a durable record for each key, and an audit line before each send.
- A clear answer when the outcome is not known.

**Non-goals:**
- A screen. Change 4 adds it.
- Dollars, a cancel call, an expiration, a tracked location or a device type.
- A refund of credits in the local budget.

## Decisions

### D1: New files outside the scanned folder

The scan test of change 1 reads `server/providers/beemaps.js` and every file in `server/providers/beemaps/`. It says that no file holds the text burst. The new plugin lives in `server/providers/beemaps-burst.js` and the folder `server/providers/beemaps-burst/`, so the merged scenario stays true. A new scenario scans the new files.

### D2: A quote, then a confirm

A quote checks a box and a credit amount, keeps a single-use id for 120 seconds and spends nothing. A confirm names the quote and an idempotency key. The confirm checks the flag, the key, the hold and the budget again, because a quote says nothing about the state at confirm time.

### D3: The order of the steps of a confirm

The steps run in this order, and the first step that refuses ends the confirm. The steps are: method, local request, rate limit, flag, key, body, busy, idempotency key, hold, quote, budget, audit line, record of the attempt, upstream request. A test checks each pair of neighbours.

### D4: One confirm at a time

A lock starts after the body step and ends in a `finally`. A second confirm gets `busy`. The lock makes the steps after it run one after the other, so the budget and the records need no other protection.

### D5: Credits, before the send, never back

The budget counts credits in a file, before the send. A refusal, an unknown outcome and a failed log write stay counted. The default daily limit is 625 credits, which is five bursts of 125 credits. The count is in credits because the dollar rate is not known.

### D6: An unknown outcome is not a failure

Only the status 200 with `success` true and exactly one burst with an id means "created". Only the statuses 400, 401, 402, 403 and 429 mean "refused", whatever the body is. All other answers mean "unknown", for example a 201, a 500, a timeout and a body that nobody can read. Bee Maps can have created the burst. An unknown outcome stays counted and blocks any resend under the same key. The answer tells the person to check the list.

### D7: Records before the send

The audit line "accepted" and the record "pending" are written and awaited before the send. A "pending" record that a restart finds reads as unknown. The record of a key holds the id of its quote, so the same key with another quote is refused.

### D8: A hold after an unknown outcome

An unknown outcome blocks only its own key, so a new quote and a new key could send again at once. The plugin holds every confirm for 600 seconds after a record with the state "unknown" or "pending". The hold comes from the time in the ledger file, so a restart does not end it. A quote is gone after the quote step for every outcome, so the same quote with a new key cannot send.

### D9: Answers hold only listed fields

The answer of a created burst has `id`, `status`, `validUntil` and `credits`, and `creditsRemaining`. The list has seven fields for each burst. No text of an answer of Bee Maps goes to the browser, because an error text could hold a signed value.

### D10: A key of its own, no same-account rule

The plugin reads `BEEMAPS_BURST_API_KEY`, and never `BEEMAPS_API_KEY`. The OSH rule that two accounts must differ is not copied. Bee Maps appears to give one key for each account, so that rule could make the feature unusable.

### D11: No redirect

Every upstream call uses `redirect: 'error'`. A redirect of a create call would send the body again, which is a second spend. A redirect gives an unknown outcome for a create call and a failure for a list call.

### D12: The list is part of this change

The list reveals where the owner asked for mapping, so the route has the same local gate. It is a POST, because the gate needs the content type JSON. Change 4 can then stay a browser-only change, as change 2 was.

## Risks / Trade-offs

- [An unknown outcome hides a real success] → The answer names the list route, and the record blocks a resend.
- [A refusal uses up a daily credit] → The limit is five bursts, and the owner can raise it.
- [The shapes come from the description] → No run used the real service. The classification treats every other shape as unknown.
- [The routes need `make up-codex`] → The gate answers only this machine.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Create a Bee Maps burst only after a person confirms a quote. Count the credits before the send, send once, and write each attempt to a log that survives a restart."
