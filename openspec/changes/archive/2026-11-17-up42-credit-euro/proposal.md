## Why

UP42 shows a price in credits only. The person must know the money before an order.
UP42 sells 100 credits for EUR 1. The author read this rate on the UP42 pricing page and in the UP42 billing documents (docs.up42.com/getting-started/credits).

## What Changes

- Add the amount in euro after the first credit amount of each text that the person reads before a decision.
- Change the quote line, the order confirm, the quotation and the accept confirm.
- Use the fixed rate of 100 credits for EUR 1. The text says "about".
- Keep the texts that state a spent amount, a rejected quotation and a placed order. Keep the chip labels.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `up42-quote-panel`: Add the euro amount to the estimate text of the quote.
- `up42-order-panel`: Change the texts of the order confirm, the quotation and the accept confirm.

## Impact

The change edits orders.js and quotes.js under src/layers/up42Scenes.
It edits the tests orders.test.mjs, quotes.test.mjs and layer.test.mjs in the same folder.
It adds changelog.d/1438-up42-credit-euro.md.

It adds no code file and changes no ownership path.
The server does not change. No trace gap opens.
The lead must run the ratchet command to record the new hashes of the four scenarios.

## Known limits

- Known limit `fixed-rate`: A UP42 contract with another rate gives a wrong amount. The author read that a regional UP42 site (docs.sa.up42.com) states USD 1 for 100 credits. The layer cannot know the contract.
- Known limit `rounding`: The amount has two decimals. A price with a fraction of a credit rounds to the nearest cent.
- Known limit `not-everywhere`: Four texts show credits only. They are the chip "Accept and spend", the sentence "This spends 90 credits.", the text after an accept and the reject confirm.
- Known limit `rounding-test`: No test sets a credit amount that is not whole, zero or large. A change of the rounding method would pass the tests.
