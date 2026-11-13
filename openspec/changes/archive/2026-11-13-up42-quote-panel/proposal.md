## Why

The server already gives UP42 quote facts through two routes. No page uses them. A person cannot see the price, the feasibility or the next passes for a tasking request.

## What Changes

- Add a quote flow to the row of the UP42 Scenes layer. It uses the two quote routes of the server.
- Add the source methods `getProducts` and `getQuote` to the UP42 browser source. Each method reads one route.
- Show a chip "Quote tasking here" only when the source has both methods and the layer has an answer.
- Ask the person to choose one product and then to confirm. The confirm step states that the quote gives no order and spends no credits.
- Show the facts of the quote in the info text: status, credits, outcome and pass count.
- Add no server code. The routes stay the same. The page never calls an order route and never accepts a quotation.

## Capabilities

### New Capabilities
- `up42-quote-panel`: The quote flow of the UP42 Scenes row, with the two source methods, the confirm step and the text of the result.

### Modified Capabilities

None. The requirements of `up42-scenes-layer` stay true. The extra chips and methods only appear when a source has the new methods.

## Impact

- New files: `src/layers/up42Scenes/quotes.js` and its test.
- Changed files: `src/layers/up42Scenes/index.js`, `src/layers/up42Scenes/source.js` and `src/app/sourceComposition.js`.
- The contract test in `src/layers/up42Scenes/registration.test.mjs` checks the two new methods.
- The change opens no gap in `openspec/trace`. It must keep each owned file at full coverage.
- Set `UP42_QUOTES=true` in `.env` so that the routes can answer. The default stays off.
