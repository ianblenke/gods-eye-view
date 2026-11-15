## Why

A person can see a quote for a UP42 tasking request. A person cannot yet order the satellite visit. The owner asks to order the visit from the page after the person approves the quote.

## What Changes

- Add three server routes. They place a tasking order, read its quotation and accept the quotation. All three stay off until `UP42_ORDERS` is `true`.
- Placing an order spends no credits. UP42 then makes a binding quotation. Accepting the quotation spends credits and UP42 cannot reverse it.
- Add four guards. The server refuses to place an order when the cap `UP42_ORDER_MAX_CREDITS` is absent. The server refuses a price above the cap or above the price that the person approved. A daily count limits the calls. The server never repeats a call after an unclear answer.
- Accept only a quotation of an order that this server placed since it started.
- Add three source methods and three chip steps to the row of the UP42 Scenes layer. Each spending step has its own confirm text and its own chip.
- **BREAKING**: the page and the server can now order and spend credits. Before this change, the code never called an order route.

## Capabilities

### New Capabilities
- `up42-orders`: The three server routes, the guards and the fixed UP42 destinations for tasking orders.
- `up42-order-panel`: The order steps of the UP42 Scenes row, the three source methods and the texts of each step.

### Modified Capabilities

None. The quote routes and the quote panel keep their requirements. The orders routes use new folders and new routes.

## Impact

- New server folder `server/providers/up42-orders/` with the routes, the validation and the upstream calls.
- Changed file `server/providers/up42/auth.js`. It gets generic `get` and `patch` methods that check only the origin, as `post` does.
- Changed file `server/providers/local.js` or `server/providers/up42-quotes/plugins.js`. The plugin list gets one more plugin that shares the client.
- New file `src/layers/up42Scenes/orders.js`. Changed files `src/layers/up42Scenes/source.js` and `src/layers/up42Scenes/index.js`.
- The `.env.example` file gets `UP42_ORDERS`, `UP42_ORDER_MAX_CREDITS`, `UP42_DAILY_ORDERS` and `UP42_WORKSPACE_ID`. The owner sets them.
- The change opens no gap in `openspec/trace`. It must keep each owned file at full coverage.
- Risk: no test calls the real UP42 order routes. The first real order needs the owner to say yes. The credit cap and the account balance are the last guards.
