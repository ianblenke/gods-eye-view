## Why

Changes 1 and 2 let a person read the newest Bee Maps frames of an area. The owner also wants to ask Bee Maps to map an area again, and to see the result. A request to map an area again costs money and cannot be cancelled.

This is change 3 of 4. It adds the server routes for that request, with every spend rule in the server. It adds no screen. Change 4 adds the panel.

## What Changes

- Add the plugin `beemaps-burst-proxy` with the files `server/providers/beemaps-burst.js` and `server/providers/beemaps-burst/{validate,quotes,credits,ledger,audit,upstream}.js`. These files are outside the folder that the scan test of change 1 reads.
- Add four routes: `GET /api/beemaps/burst/status`, and the POST routes `quote`, `confirm` and `list`. The POST routes answer only this machine.
- Keep everything off until `BEEMAPS_BURST_ENABLED` is exactly "true" and `BEEMAPS_BURST_API_KEY` has a key. This key is not the key of the frames provider.
- Give a quote first. A quote checks a box and a credit amount, spends nothing and lasts 120 seconds. A confirm then spends the quote once.
- Send exactly one create request for one confirmed quote. Never retry. Count the credits in a durable daily budget before the send, and never give them back.
- Keep one durable record for each idempotency key. A repeat of a key sends nothing. Treat an answer that does not clearly say "created" or "refused" as an unknown outcome. An unknown outcome blocks a resend of its key, and it makes the route refuse every confirm with a new idempotency key for 600 seconds.
- Write an audit line before each send and refuse to send when the write fails.
- Add a route for the list of the bursts that the key owns. It keeps an answer for 60 seconds.
- Register the plugin in `server/providers/local.js`, list the new files in the manifests, and add the four variables to `.env.example`. Add one entry to `CHANGELOG.md` and one paragraph to `DATA_SOURCES.md`.
- Add the capability `beemaps-burst-control` with 40 scenarios.

## Capabilities

### New Capabilities

- `beemaps-burst-control`: The routes, the flag and the key, and the local gate. The quote, the confirm and its one request. The budget, the idempotency records and the holds. The audit log and the secrecy of the key. The list, the rate limits and the scan of the files.

### Modified Capabilities

None.

## Impact

No browser code changes. The other providers do not change. The tests use fake fetch functions and fake clocks. No test and no run sends a request to Bee Maps. A run with a real Vite server and a fake upstream shows one upstream request for each confirm that passes every step. It shows none for a repeat of a key, and none with the flag off.

## Known limits and later changes

- Known limit `credit-rate-unverified`: The description does not give the dollar value of a credit. The routes show credits and never dollars.
- Known limit `key-scope-unverified`: The description names one kind of key. A person can set the same key in both variables, and nothing says whether a read key can create a burst.
- Known limit `list-price-unknown`: The description gives no price for the list call. The route keeps the answer for 60 seconds and limits the rate.
- Known limit `no-cancel`: Bee Maps has no call to cancel a burst. The app cannot undo a created burst.
- Known limit `no-refund`: The budget counts a refusal, an unknown outcome, a failed log write and a failed ledger write as spent. A person can raise the daily limit.
- Known limit `holds-in-memory`: A hold after a refusal ends when the server restarts. The hold after an unknown outcome comes from the ledger file, so it stays.
- Known limit `no-real-service`: No run used the real service. The shapes come from the public API description, version 1.3.0, so an unknown outcome can hide a real success.
- Known limit `no-screen`: Only a tool such as curl on this machine can use the routes until change 4 adds the panel.
- Known limit `refusal-sources`: The text file `llms-full.txt` gives the statuses 400, 402, 403 and 429. The version 1.0.0 of the description gives 402 and 429. The version 1.3.0 lists only 200 and 500 for the create call. No source gives 401 for the create call, and the plugin treats 401 as a refusal.
- Known limit `audit-rotation`: The audit file moves to a file with the suffix `.1` at 4 MiB. The move replaces an older file with that suffix. A request over the rate limit writes no line.
- Known limit `hold-ends`: The hold after an unknown outcome ends after 600 seconds. A new quote and a new key can then send again. The list is the only way to see whether the first attempt made a burst.
- Known limit `list-first-100`: The list asks for the first 100 bursts and sends no `skip`. The description gives no order, so a new burst can be absent from the list when the key has more than 100 bursts.
- Known limit `two-instances`: Two plugin instances, or two processes, on one cache folder each keep their own lock, budget count and copy of the ledger. Run one server for one folder.
- Known limit `internal-error-after-send`: An error that nobody expects after the send gives 500 with `internal_error`. The record keeps the state that it had when the error came, so the answer can hide a created burst. A panel must read this answer as "can have spent".
- Known limit `status-on-network`: The status route uses the same-site gate, so a device on the network can read `enabled` and `configured`. It shows no key.
- Known limit `fixed-options`: A request has no expiration, no tracked location and no device type. Bee Maps gives its own defaults.
