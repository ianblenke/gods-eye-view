## Context

The server gives UP42 quote facts through two routes. The page shows them in the UP42 Scenes row. No code orders a visit.

UP42 tasking has two steps that matter. A call to `POST /v2/orders` makes an order and spends no credits. UP42 then makes a binding quotation.

A call to `PATCH /v2/tasking/quotation/{id}` with the decision `ACCEPTED` deducts credits. UP42 cannot reverse it. The quote routes and their tests forbid both calls. The new code lives in a new folder so that those tests stay true.

## Goals / Non-Goals

**Goals:**
- Let a person order a visit after the quote and then accept the quotation, each step with its own confirm.
- Make each step safe. The server enforces the guards. The page does not enforce them.

**Non-Goals:**
- No order of archive images. No cancel, no extension, no feasibility study choice and no EULA accept.
- No check against the real UP42 order routes in the tests.

## Decisions

**D1. A new folder.** The code lives in `server/providers/up42-orders/`. The scan tests of `up42-source` and `up42-quotes` stay true because they read other folders.

**D2. The client gets `call`.** The method refuses DELETE, PUT and a method name with no capital letters. It checks the origin `https://api.up42.com`, as `post` does. It names the good status codes and reports the status of a refused call. They keep no order literal. The allow-list lives in the orders folder. A `PATCH` sends the type `application/merge-patch+json`.

**D3. Four fixed destinations.** The orders folder holds these as constants: the estimate URL, the order URL, the quotation list URL and the quotation URL pattern. The pattern serves the accept and the reject. The pattern takes a validated lower-case UUID only. No other part of a URL comes from a request.

**D4. The server states the price.** The page sends `approvedCredits`, the price that the person saw. The server runs its own estimate before it places an order. The server reads the quotation before it accepts it.

Each step refuses a price above the cap or above `approvedCredits`. The cap is `UP42_ORDER_MAX_CREDITS`. An absent or invalid cap refuses every spending route with `no_cap`.

**D5. Only own orders.** The ledger holds the id of each order that this server placed. The accept and reject routes refuse a quotation of another order.

**D6. No repeat after an unclear answer.** A time-out, a 5xx answer or an unknown body after the order call gives `order_unclear`. The same after the accept call gives `accept_unclear`. The server sends each call once.

The answer tells the person to check in UP42 before another try. A repeat of the accept is safe. The server reads the quotation first and refuses a decided one.

**D7. Two daily counts.** One count is for orders and one is for accepts. Both use `UP42_DAILY_ORDERS`. The default is 2 and the maximum is 20.

A count rises, and the ledger file holds it, before the call goes to UP42. A restart does not reset the counts.

**D8. Duplicate guard.** The ledger keeps the key of each placed order. The guard holds for 10 minutes. A second request with the same key gets `duplicate` and the first order id. A simultaneous second request gets `busy`.

**D9. The page does the steps in order.** The states are `idle`, `order-confirm`, `ordering`, `ordered`, `quotation-confirm` and `accepting`. The chip "Order this visit" appears after a quote with an estimate. The chip "Check quotation" appears after an order.

A quotation with a price shows the chip "Accept quotation". Each spending step has a confirm text with the amount. A press of a search chip, `reset` and `disable` clear the state.

**D10. A ledger file.** The ledger is `orders.json` in the folder `UP42_DATA_DIR`. The default is `.gev-up42` in the working folder. The file holds the orders, the duplicate keys and the two counts of the day.

The server writes a temporary file and renames it, as the Bee Maps ledger does. A failed write gives `store_failed` and the server sends no call.

**D11. A volume.** The file `compose.yaml` mounts the named volume `gev-up42` at `/app/.gev-up42`. The `Dockerfile` makes the folder. The dev server ignores it, as it ignores `.gev-cache`.

**D12. A reject.** The reject route sends one PATCH with the decision `REJECTED`. It spends no credits and has no cap check and no count. It needs a quotation of an order in the ledger with the decision NOT_DECIDED.

**D13. The source contract stays.** The four order methods are optional. The order chips appear only when the source has all four methods. The contract table in `sourceComposition.js` stays the same.

## Risks / Trade-offs

- [No live check] → The shapes of the order answer and of the quotation list come from the UP42 documents. A shape that differs gives `order_unclear` or `unknown_quotation`. No credits are spent without a readable quotation price.
- [The quotation list needs a page size] → The route reads the first 100 entries. A longer list can hide a quotation. This is a Known limit.
- [The order can need a workspace id] → `UP42_WORKSPACE_ID` is optional. The server adds it to the order URL when it is a UUID.
- [The ledger file fails] → The server sends no call and gives `store_failed`.
- [An accept answer is lost] → The page tells the person that credits can be spent. The person checks in UP42.

## How the gates measure it

- The tests of the server use a fake client or a fake fetch function that records each method and URL. Scenario `up42-orders-022` fails for any call outside the allow-list.
- The page tests record each URL and method that the source sends. Scenario `up42-order-panel-011` fails for any path outside the four order routes and the quote routes.
- Each new code file needs 100% line, branch and function coverage.

## Purpose at archive time

Describe how the server and the UP42 Scenes row place a tasking order and accept its quotation, each step with guards and a confirm.
