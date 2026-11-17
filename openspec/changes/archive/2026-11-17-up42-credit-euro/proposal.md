## Why

UP42 shows a price in credits only. The person must know the money before an order.
UP42 sells 100 credits for EUR 1. The UP42 pricing page and the billing documents state this rate.

## What Changes

- Add the amount in euro after each credit amount that the person must decide on.
- Change the quote line, the order confirm, the quotation and the accept confirm.
- Use the fixed rate of 100 credits for EUR 1. The text says "about".
- Keep the texts that state a spent amount, a reject and a placed order. Keep the chip labels.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `up42-quote-panel`: Change the text of the estimate.
- `up42-order-panel`: Change the texts of the order confirm, the quotation and the accept confirm.

## Impact

The change edits orders.js and quotes.js under src/layers/up42Scenes.
It edits the tests orders.test.mjs, quotes.test.mjs and layer.test.mjs in the same folder.
It adds changelog.d/1438-up42-credit-euro.md.

It adds no code file and changes no ownership path.
The server does not change. No trace gap opens.
The lead must run the ratchet command to record the new hashes of the four scenarios.

## Known limits

- Known limit `fixed-rate`: A UP42 contract with another rate gives a wrong amount. A regional UP42 site states USD 1 for 100 credits. The page cannot know the contract.
- Known limit `rounding`: The amount has two decimals. A price with a part of a credit rounds to the nearest cent.
- Known limit `not-everywhere`: The chip "Accept and spend" and the text after an accept show credits only.
