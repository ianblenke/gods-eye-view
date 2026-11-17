## Context

The page shows each UP42 price in credits.
The server drops the fields creditsPerEur and currency of the estimate.

## Goals / Non-Goals

**Goals:**
- Show the euro amount where the person decides on a price.

**Non-Goals:**
- No setting for the rate. No server change.

## Decisions

- One function, withEuro, in orders.js gives the text "<n> credits (about EUR <n/100>)". quotes.js imports it.
- The rate is a fixed 100 credits for EUR 1. A new setting needs a server route and more tests.
- The four texts that ask for a decision use withEuro. The texts after the decision keep credits only.

## Risks / Trade-offs

- A contract with another rate shows a wrong amount. The word "about" limits the claim.

## Gates

- Scenario `up42-order-panel-005`, `up42-order-panel-007` and `up42-order-panel-008`: the tests compare each text with a literal string. A mutation that divides by 10, not 100, makes each of them fail.
- Scenario `up42-quote-panel-007`: the tests compare the quote text with a literal string. The same mutation makes them fail.
- The files orders.js and quotes.js stay at 100% line, branch and function coverage.
- `make lint` checks the prose. `make gates CHANGE=up42-credit-euro` runs all gates.
