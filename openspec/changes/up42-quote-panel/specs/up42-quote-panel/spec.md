## ADDED Requirements

### Requirement: Product source
The browser source MUST read the product list with one GET request to "/api/up42/quote/products".

Origin: spec-first

#### Scenario: Read the products `up42-quote-panel-001`
- **WHEN** a test calls `getProducts` with a fake fetch function
- **THEN** the fake fetch function gets one `GET` request for "/api/up42/quote/products" with a signal that the source makes
- **AND** a body `{"products":[{"id":"<uuid>","title":"T"}]}` gives `{ok:true, products}` with the id and title of each product
- **AND** a body with no products array, a product with an invalid id and a body that is not JSON give `{ok:false, status, error:"bad_answer"}`
- **AND** an HTTP status that is not `2xx` gives `{ok:false, status, error}` with the text `error` of the body, or "unknown"
- **AND** a rejection and a stop after 20 seconds give the status 0 and the error "unreachable"

### Requirement: Quote source
The browser source MUST send one POST request with the product and the box to "/api/up42/quote" and keep only the named facts.

Origin: spec-first

#### Scenario: Post the quote request `up42-quote-panel-002`
- **WHEN** a test calls `getQuote` with the product id "11111111-2222-3333-4444-555555555555" and the box [9.568326, 59.784163, 10.431674, 60.215837]
- **THEN** the fake fetch function gets one `POST` request for "/api/up42/quote" with the only header `Content-Type` "application/json"
- **AND** the body is the text `{"dataProduct":"11111111-2222-3333-4444-555555555555","box":[9.568326,59.784163,10.431674,60.215837]}`
- **AND** a good answer gives `{ok:true, results, cached, budget}` where `results` has only the names validation, estimate, feasibility and opportunities
- **AND** a result that is not an object, or a budget without whole numbers `used` and `limit`, gives the error "bad_answer"
- **AND** an HTTP status that is not `2xx` gives `{ok:false, status, error}` with `retryAfter`, `used` and `limit` when each is a whole number of 0 or more
- **AND** a rejection and a stop after 60 seconds give the status 0 and the error "unreachable"

### Requirement: Quote chip
The layer MUST show the chip "Quote tasking here" only when the source has `getProducts` and `getQuote`. The layer must be on and must have an answer.

Origin: spec-first

#### Scenario: Show the chip only when it can work `up42-quote-panel-003`
- **WHEN** a test reads `getRowControls` for a layer with a source of three methods, and for a layer with five methods
- **THEN** the source of three methods gives no chip with the id "quote"
- **AND** the source of five methods gives no chip with the id "quote" before the first answer and after `disable`
- **AND** the source of five methods gives the chip with the id "quote" and the label "Quote tasking here" after a good answer
- **AND** the chip has `disabled` true while the status says that the server has no credentials

### Requirement: Product choice
A press of the quote chip MUST read the products once and then show one chip for each of the first six products.

Origin: spec-first

#### Scenario: Choose a product `up42-quote-panel-004`
- **WHEN** a test presses the quote chip, and the fake source gives eight products
- **THEN** the source gets one `getProducts` call and no `getQuote` call
- **AND** the chips are the chip "Cancel" and one chip for each of the first six products, with the title as the label
- **AND** a second press of the quote chip while the products load gives no second call
- **AND** a failed product call gives the failure text in the info and the chip "Quote tasking here" again

### Requirement: Confirm step
A product chip MUST show a confirm text and send no quote until a person presses "Confirm quote".

Origin: spec-first

#### Scenario: Confirm before the quote `up42-quote-panel-005`
- **WHEN** a test presses a product chip
- **THEN** the info text is "Quote <title> for this view? This gives no order and spends no credits."
- **AND** the chips are "Confirm quote" and "Cancel", and the source gets no `getQuote` call
- **AND** a press of "Cancel" returns the chip "Quote tasking here" and sends no quote

### Requirement: Quote request
A press of "Confirm quote" MUST send one quote request with the chosen product and the box of the view, one at a time.

Origin: spec-first

#### Scenario: Send one quote `up42-quote-panel-006`
- **WHEN** a test presses "Confirm quote", and presses it again before the answer
- **THEN** the source gets one `getQuote` call with the chosen id and the box of `scenesBox` for the view
- **AND** while the request runs, the info text is "Asking for a quote…" and each chip has `disabled` true
- **AND** `disable`, a new search and `destroy` abort the request and give no result text
- **AND** a view that cannot give a box gives the text of the box reason and no `getQuote` call

### Requirement: Quote text
The layer MUST show the facts of a quote as short lines and show a fixed text for each failed check.

Origin: spec-first

#### Scenario: Show the facts `up42-quote-panel-007`
- **WHEN** a test gives results with validation status "VALID", estimate credits 120 with size 4 and unit "SQ_KM", feasibility outcome "FEASIBLE" and 3 passes
- **AND** the budget has `used` 2 and `limit` 20
- **THEN** the info text has the lines "Validation: VALID", "Estimate: 120 credits for 4 SQ_KM", "Feasibility: FEASIBLE" and "Passes: 3"
- **AND** the last line is "Quotes today: 2 of 20. No order was made."
- **AND** a failed check gives the line "<Name>: not available (<fixed text>)" and the other lines stay
- **AND** an answer with `cached` true adds the line "This quote is kept from before."

### Requirement: Failure text
The layer MUST turn each error name of the quote routes into a fixed text.

Origin: spec-first

#### Scenario: Name each failure `up42-quote-panel-008`
- **WHEN** a test gives the errors quotes_off, rate_limited, budget, no_credentials, credentials_rejected, area_too_large, bad_bbox, unknown_product and an unknown name
- **THEN** each of the eight known names gives its own fixed text
- **AND** the unknown name gives the generic text "UP42 did not give a quote."
- **AND** no text contains a string of the server answer

### Requirement: No order
The page MUST call only the two quote routes for a quote, and never an order route or a quotation accept.

Origin: spec-first

#### Scenario: Call only the quote routes `up42-quote-panel-009`
- **WHEN** a test runs the whole flow with a fake fetch function that records each URL and method
- **THEN** the recorded calls are only GET "/api/up42/quote/products" and POST "/api/up42/quote"
- **AND** the chip labels and texts of the flow have no word "order" except in the text "no order"

### Requirement: Source contract
The source contract of the layer MUST list the five methods, and the real source MUST have them.

Origin: spec-first

#### Scenario: List the five methods `up42-quote-panel-010`
- **WHEN** a test reads the contract for the key "up42-scenes" and builds the reference source
- **THEN** the methods are getStatus, searchScenes, getThumbnail, getProducts and getQuote
- **AND** the reference source has a function for each of the five methods
