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
- Changed file `server/providers/local.js`. It uses the new `up42TaskingPlugins`, which adds one plugin that shares the client.
- Changed files `server/standalone/unwatched-cache.js` and `build/vite.js`. They ignore and deny the folder `.gev-up42`.
- Changed test `src/tooling/viteBuild.test.mjs`. The list of ignored folders has one more entry.
- New files `src/layers/up42Scenes/orders.js` and `src/layers/up42Scenes/orderFlow.js`. Changed files `src/layers/up42Scenes/source.js` and `src/layers/up42Scenes/index.js`.
- The `.env.example` file gets `UP42_ORDERS`, `UP42_ORDER_MAX_CREDITS` (example 5000), `UP42_DAILY_ORDERS` (example 2), `UP42_WORKSPACE_ID` and `UP42_DATA_DIR`. The owner sets them.
- The change opens no gap in `openspec/trace`. It must keep each owned file at full coverage.
- Risk: no test calls the real UP42 order routes. The first real order needs the owner to say yes. The credit cap and the account balance are the last guards.

## Known limits and later changes

- No test calls the real UP42 order routes. The answer shapes of the order call and of the quotation list come from the UP42 documents. A different shape gives `order_unclear` or `unknown_quotation`.
- The quotation list reads the first 100 entries only. A longer list can hide a quotation.
- UP42 can need a workspace id on the order URL. `UP42_WORKSPACE_ID` is optional and untested against UP42.
- The user needs a role that can create orders and accept quotations. The plan that gives this role is unknown.
- If the server cannot save a placed order to the ledger file, it keeps the order in memory and gives success. A restart then loses the order.
- The reject route has no count of its own. Its rate limit is the shared limit of six requests in one minute.
- The scenario `up42-order-panel-015` is retired. The scenario `up42-order-panel-016` replaces it.
- Minor findings of the STE adversary about -ing forms, nouns and passive forms stay open, for example "confirm" as a noun. The lead kept them. Round 3 listed four, and rounds 1 and 2 listed more of the same kind.
