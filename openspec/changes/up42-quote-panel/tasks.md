## 1. Source

- [x] 1.1 Write the tests for `getProducts` and `getQuote` (`up42-quote-panel-001`, `up42-quote-panel-002`) in `source.test.mjs`.
- [x] 1.2 Add `getProducts` and `getQuote` to `src/layers/up42Scenes/source.js`.
- [x] 1.3 Write the test of the contract (`up42-quote-panel-010`) in `registration.test.mjs` and `reference.test.mjs`.
- [x] 1.4 Add the two methods to the entry "up42-scenes" in `src/app/sourceComposition.js`.

## 2. Text

- [x] 2.1 Write the tests for the text of a quote and of a failure (`up42-quote-panel-007`, `up42-quote-panel-008`) in `quotes.test.mjs`.
- [x] 2.2 Write `src/layers/up42Scenes/quotes.js` with the text functions and the message table.

## 3. Layer

- [x] 3.1 Write the layer tests for the chip and the product choice (`up42-quote-panel-003`, `up42-quote-panel-004`).
- [x] 3.2 Write the layer tests for the confirm step and the request (`up42-quote-panel-005`, `up42-quote-panel-006`).
- [x] 3.3 Write the test that records each URL and method of the flow (`up42-quote-panel-009`).
- [x] 3.4 Add the quote flow to `src/layers/up42Scenes/index.js`.
- [x] 3.5 Run the layer tests on the host and correct each error.

## 4. Gates and review

- [ ] 4.1 Commit the code files and the test files.
- [ ] 4.2 Run `make ratchet CHANGE=up42-quote-panel` and read the verdict.
- [ ] 4.3 Run `/opsx:review up42-quote-panel`, and write `review.md` with the findings of the two review agents.
- [ ] 4.4 Run `make gates CHANGE=up42-quote-panel` on the final tree.
