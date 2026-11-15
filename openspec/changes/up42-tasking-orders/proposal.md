## Why

A person can see a quote for a UP42 tasking request. A person cannot yet order the satellite visit. The owner asks to order the visit from the page after the person approves the quote.

## What Changes

- Add four server routes. They place a tasking order, read its quotation, accept the quotation and reject it. All four stay off until `UP42_ORDERS` is `true`.
- Placing an order spends no credits. UP42 then makes a binding quotation. Accepting the quotation spends credits and UP42 cannot reverse it.
- Add four guards. The server refuses to place an order when the cap `UP42_ORDER_MAX_CREDITS` is absent. The server refuses a price above the cap or above the price that the person approved. A daily count limits the calls. The server never repeats a call after an unclear answer.
- Keep a ledger of orders, counts and duplicate keys in a file. A compose volume holds the file, so a restart keeps it. The server writes each count before the call.
- Accept or reject only a quotation of an order in the ledger.
- Add four source methods and the order steps to the row of the UP42 Scenes layer. Each spending step has its own confirm text and its own chip.
- **BREAKING**: the page and the server can now order and spend credits. Before this change, the code never called an order route.

## Capabilities

### New Capabilities
- `up42-orders`: The four server routes, the guards, the ledger file and the fixed UP42 destinations for tasking orders.
- `up42-order-panel`: The order steps of the UP42 Scenes row, the four source methods and the texts of each step.

### Modified Capabilities

None. The quote routes and the quote panel keep their requirements. The orders routes use new folders and new routes.

## Impact

- New server folder `server/providers/up42-orders/` with the routes, the validation, the ledger and the upstream calls.
- Changed files `compose.yaml` and `Dockerfile`. They add the volume `gev-up42` at `/app/.gev-up42`. The dev server ignores the folder.
- Changed file `server/providers/up42/auth.js`. It gets one generic method `call` for GET, POST and PATCH. The method checks only the origin, as `post` does.
- Changed file `server/providers/local.js` or `server/providers/up42-quotes/plugins.js`. The plugin list gets one more plugin that shares the client.
- New file `src/layers/up42Scenes/orders.js`. Changed files `src/layers/up42Scenes/source.js` and `src/layers/up42Scenes/index.js`.
- The `.env.example` file gets `UP42_ORDERS`, `UP42_ORDER_MAX_CREDITS` (example 5000), `UP42_DAILY_ORDERS` (example 2), `UP42_WORKSPACE_ID` and `UP42_DATA_DIR`. The owner sets them.
- The change opens no gap in `openspec/trace`. It must keep each owned file at full coverage.
- Risk: no test calls the real UP42 order routes. The first real order needs the owner to say yes. The credit cap and the account balance are the last guards.
