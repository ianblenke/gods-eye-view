## Context

The server route `POST /api/up42/quote` runs up to four checks: validation, estimate, feasibility and opportunities. The route `GET /api/up42/quote/products` lists the tasking products. Both routes stay off until `UP42_QUOTES=true`. The page has no code that calls them.

The UP42 Scenes layer shows a row with chips, an info text and a scene list. The layer sends a search only when a person presses a chip.

## Goals / Non-Goals

**Goals:**
- Let a person ask for a quote of the current view with one product.
- Make the person confirm each quote. The confirm text states that the quote makes no order and spends no credits.
- Show the quote facts in the info text.

**Non-Goals:**
- No order. No request to accept a quotation. No call to any route other than the two quote routes.
- No choice of parameters. The request sends the product and the box only. The server then runs all four checks.
- No change to the server code or to the layer requirements.

## Decisions

**D1. Extend the source.** `createUp42Source` gets `getProducts` and `getQuote`. The alternative is a second source. A second source needs a second key in the contract table and in the reference list. The extension changes one contract entry.

**D2. A chip appears only when the source has both methods.** The layer tests use fake sources with three methods. Their chips stay the same. The quote chip also needs a search answer. This keeps the chip away from an empty row.

**D3. Flow of five states.** The flow uses the states `idle`, `loading`, `choose`, `confirm` and `asking`. A quote result or a failure returns the flow to `idle`.

The chip "Quote tasking here" starts the flow and loads the products. One chip for each of the first six products follows. A product chip moves the flow to `confirm`. The chip "Confirm quote" sends one request. The chip "Cancel" returns to `idle`.

**D4. The view box is the box of a search.** The flow uses `scenesBox` with the centre of the view. The route already applies the area limit of 2500 square kilometres. The page shows a local message when the view is too large.

**D5. The result text uses facts only.** A pure function in `src/layers/up42Scenes/quotes.js` turns the results into short parts. The page shows the named facts. A message table supplies the failure text.

**D6. One request at a time.** A second press of a chip while a request runs does nothing. `disable` and `reset` abort the request.

## Risks / Trade-offs

- [The server can reach its daily quote limit] → The result text shows `used` and `limit` of the budget. The error `budget` has its own message.
- [A product list of 6 chips hides other products] → Accept for this change. A product search is a later change.
- [A quote of a large view fails] → The message tells the person to zoom in.
- [A person reads "quote" as "order"] → The confirm text and the result text both state that no order exists.

## How the gates measure it

- Scenario `up42-quote-panel-010` has its test in `src/layers/up42Scenes/registration.test.mjs`. The other scenarios have tests in `quotes.test.mjs`, `source.test.mjs` and `layer.test.mjs`. Each test name starts with the scenario IDs.
- The coverage gate needs 100% line, branch and function coverage for `quotes.js`, `source.js` and `index.js`.
- Scenario `up42-quote-panel-009` records each URL and method that a fake fetch function receives. It fails if any call goes to another path.
- Files that the change adds or changes: `src/layers/up42Scenes/quotes.js`, `quotes.test.mjs`, `source.js`, `index.js`, `src/app/sourceComposition.js`, `src/layers/up42Scenes/registration.test.mjs`, `source.test.mjs` and `layer.test.mjs`.

## Purpose at archive time

Describe how the UP42 Scenes row asks for a quote of one tasking product and shows the quote facts without an order.
