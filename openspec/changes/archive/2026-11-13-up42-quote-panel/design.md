## Context

The server route `POST /api/up42/quote` runs up to four checks: validation, estimate, feasibility and opportunities. The route `GET /api/up42/quote/products` lists the tasking products. Both routes stay off until `UP42_QUOTES=true`. The page has no code that calls them.

The UP42 Scenes layer shows a row with chips, an info text and a scene list. The layer sends a search only when a person presses a chip.

## Goals / Non-Goals

**Goals:**
- Let a person ask for a quote of the current view with one product.
- Make the person confirm each quote. The confirm text states that no order is made and no credit is spent.
- Show the quote facts in the info text.

**Non-Goals:**
- No order. No quotation accept. No call to any route other than the two quote routes.
- No choice of parameters. The request sends the product and the box only. The server then runs all four checks.
- No change to the server code or to the existing layer requirements.

## Decisions

**D1. Extend the existing source.** `createUp42Source` gets `getProducts` and `getQuote`. The alternative is a second source. A second source needs a second key in the contract table and in the reference list. The extension changes one contract entry.

**D2. A chip appears only when the source has both methods.** The existing layer tests use fake sources with three methods. Their chips stay the same. The quote chip also needs a search answer. This keeps the chip away from an empty row.

**D3. Flow of four steps.** The step names are `idle`, `choose`, `confirm` and `result`.

The chip "Quote tasking here" starts the flow and loads the products. One chip for each of the first six products follows. A product chip moves the flow to `confirm`. The chip "Confirm quote" sends one request. The chip "Cancel" returns to `idle`.

**D4. The view box is the box of a search.** The flow uses `scenesBox` with the centre of the view. The route already applies the area limit of 2500 square kilometres. The page shows the error text of the route when the area is too large.

**D5. The text of a result is built from facts only.** A pure function in `src/layers/up42Scenes/quotes.js` turns the results into short lines. A failed check shows its fixed error name through a message table. No text of the server passes to the page without a table entry.

**D6. One request at a time.** A second press of a chip while a request runs does nothing. `disable` and `reset` abort the request.

## Risks / Trade-offs

- [The daily quote count of the server can run out] → The result text shows `used` and `limit` of the budget. The error `budget` has its own message.
- [A product list of 6 chips hides other products] → Accept for this change. A product search is a later change.
- [A quote of a large view fails] → The message names the area limit.
- [A person reads "quote" as "order"] → The confirm text and the result text both state that no order exists.

## How the gates measure it

- Each scenario has one or more tests in `src/layers/up42Scenes/quotes.test.mjs`, `source.test.mjs` and `layer.test.mjs`. Each test name starts with the scenario IDs.
- The coverage gate needs 100% line, branch and function coverage for `quotes.js`, `source.js` and `index.js`.
- Scenario `up42-quote-panel-009` records each URL and method that a fake fetch function receives. It fails if any call goes to another path.
- Files that the change adds or changes: `src/layers/up42Scenes/quotes.js`, `quotes.test.mjs`, `source.js`, `index.js`, `src/app/sourceComposition.js`, `src/layers/up42Scenes/registration.test.mjs` and `src/sources/reference.test.mjs`.

## Purpose at archive time

Describe how the UP42 Scenes row asks for a quote of one tasking product and shows the quote facts without an order.
