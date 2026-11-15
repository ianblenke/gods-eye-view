# up42-order-panel Specification

## Purpose
Describe how the server and the UP42 Scenes row place a tasking order and accept its quotation, each step with guards and a confirm.
## Requirements
### Requirement: Order source

The browser source MUST send one POST request with the product, the box and the approved credits to "/api/up42/order".

Origin: spec-first

#### Scenario: Post the order request `up42-order-panel-001`

- **WHEN** a test calls `placeOrder` with the product id "11111111-2222-3333-4444-555555555555", the box [9.568326, 59.784163, 10.431674, 60.215837] and the credits 120
- **THEN** the fake fetch function gets one `POST` request for "/api/up42/order" with the only header `Content-Type` "application/json"
- **AND** the body is the text `{"dataProduct":"11111111-2222-3333-4444-555555555555","box":[9.568326,59.784163,10.431674,60.215837],"approvedCredits":120}`
- **AND** a good answer gives `{ok:true, orderId, credits}`; a body with no order id gives the error "bad_answer"
- **AND** an HTTP status that is not `2xx` gives `{ok:false, status, error}` with the whole numbers `used` and `limit` when the body has them
- **AND** a rejection and a stop after 60 seconds give the status 0 and the error "unreachable"

### Requirement: Quotation source

The browser source MUST read one quotation with one GET request to "/api/up42/order/quotation".

Origin: spec-first

#### Scenario: Read the quotation `up42-order-panel-002`

- **WHEN** a test calls `getQuotation` with the order id "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
- **THEN** the fake fetch function gets one `GET` request for "/api/up42/order/quotation?orderId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
- **AND** a body with a null quotation gives `{ok:true, quotation:null}`
- **AND** a body with a quotation id, credits as a number and a decision gives `{ok:true, quotation}` with those three facts
- **AND** a body of another shape gives the error "bad_answer"

### Requirement: Accept source

The browser source MUST send one POST request with the quotation id and the approved credits to "/api/up42/order/accept".

Origin: spec-first

#### Scenario: Post the accept request `up42-order-panel-003`

- **WHEN** a test calls `acceptQuotation` with the quotation id "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" and the credits 120
- **THEN** the fake fetch function gets one `POST` request for "/api/up42/order/accept" with the body `{"quotationId":"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee","approvedCredits":120}`
- **AND** a body `{"accepted":true,"credits":120}` gives `{ok:true, credits}`; another body gives the error "bad_answer"
- **AND** an HTTP status that is not `2xx` gives `{ok:false, status, error}`

### Requirement: Order chip

The layer MUST show the chip "Order this visit" only after a quote with an estimate in credits. The source MUST have the four order methods.

Origin: spec-first

#### Scenario: Show the order chip `up42-order-panel-004`

- **WHEN** a quote answer has an estimate of 120 credits, has no estimate, or a source lacks one order method
- **THEN** the chip appears only for the first case; the layer tests with sources of three methods and quote-only sources show no order chip

### Requirement: Order confirm

The order step MUST state the amount and that it spends no credits yet. It MUST send nothing before the person presses "Place order".

Origin: spec-first

#### Scenario: Confirm the order `up42-order-panel-005`

- **WHEN** the person presses "Order this visit"
- **THEN** the info text is "Order <title> for this view? The estimate is 120 credits. This spends no credits yet." and the chips are "Place order" and "Cancel"
- **AND** the source gets no call; "Cancel" returns the layer to its state before the step

### Requirement: Order result

The press of "Place order" MUST send one request with the estimate as approvedCredits and MUST show the order id.

Origin: spec-first

#### Scenario: Place the order `up42-order-panel-006`

- **WHEN** the person presses "Place order" and the source answers with an order id
- **THEN** the source gets one `placeOrder` call with the product, the box and 120 credits
- **AND** the info text names the order and states that no credits are spent, and the chip "Check quotation" appears
- **AND** a second press while the call runs does nothing

### Requirement: Quotation step

The chip "Check quotation" MUST read the quotation and MUST show its price. A quotation with a price and the decision NOT_DECIDED shows the chip "Accept quotation".

Origin: spec-first

#### Scenario: Check the quotation `up42-order-panel-007`

- **WHEN** the person presses "Check quotation" and the quotation is null, is undecided with 90 credits, or has the decision ACCEPTED
- **THEN** the info text is "UP42 has no quotation yet.", "Quotation: 90 credits." with the chips "Accept quotation", "Reject quotation" and "Check quotation", or "This quotation is accepted."

### Requirement: Accept confirm

The accept step MUST state the amount, that it spends credits and that UP42 cannot reverse it. It MUST send nothing before the person presses "Accept and spend".

Origin: spec-first

#### Scenario: Confirm the accept `up42-order-panel-008`

- **WHEN** the person presses "Accept quotation" for a quotation of 90 credits
- **THEN** the info text is "Accept the quotation of 90 credits? This spends 90 credits. UP42 cannot reverse it." and the chips are "Accept and spend 90 credits" and "Cancel"
- **AND** the source gets no call before the second press

### Requirement: Accept result

The press of "Accept and spend" MUST send one request with the credits that the person saw.

Origin: spec-first

#### Scenario: Accept the quotation `up42-order-panel-009`

- **WHEN** the person presses "Accept and spend 90 credits" and the source answers with accepted
- **THEN** the source gets one `acceptQuotation` call with the quotation id and 90 credits
- **AND** the info text is "The quotation is accepted. 90 credits are spent." and no order chip stays
- **AND** a second press while the call runs does nothing

### Requirement: Failure text

The layer MUST show a fixed text for each known server error and MUST warn when credits can be spent.

Origin: spec-first

#### Scenario: Show the failure `up42-order-panel-010`

- **WHEN** the source answers with a known error, for example over_cap, duplicate, busy, budget, decided, order_unclear or accept_unclear
- **OR** the source answers with an unknown error
- **THEN** the info text is the fixed text of that error and the generic text for any other error
- **AND** the text of accept_unclear states that credits can be spent and tells the person to check in UP42 before a new try
- **AND** a lost answer of the order call gives the text of order_unclear, and no chip for a new try
- **AND** a lost answer of the accept call gives the text of accept_unclear, and no chip for a new try
- **AND** a lost answer of the reject call gives the text of reject_unclear, and no chip for a new try
- **AND** a lost answer of the quotation call keeps the chip "Check quotation"

### Requirement: Fixed calls

The layer MUST call only the quote routes and the four order routes.

Origin: spec-first

#### Scenario: Call only the listed routes `up42-order-panel-011`

- **WHEN** a test runs every step of the flow with a recording fake fetch function
- **THEN** the records hold only the paths of the two quote routes and the four order routes, each with its method

### Requirement: Clear the steps

A press of a search chip, `reset` and `disable` MUST end each running order call and clear the order steps.

Origin: spec-first

#### Scenario: Clear the order steps `up42-order-panel-012`

- **WHEN** a search chip, `reset` or `disable` comes while a step shows or a call runs
- **THEN** the signal of the call aborts, the order chips go away and the later answer changes nothing

### Requirement: Reject source

The browser source MUST send one POST request with the quotation id to "/api/up42/order/reject".

Origin: spec-first

#### Scenario: Post the reject request `up42-order-panel-013`

- **WHEN** a test calls `rejectQuotation` with the quotation id "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
- **THEN** the fake fetch function gets one `POST` request for "/api/up42/order/reject" with the body `{"quotationId":"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"}`
- **AND** a body `{"rejected":true}` gives `{ok:true}`; another body gives the error "bad_answer"
- **AND** an HTTP status that is not `2xx` gives `{ok:false, status, error}`

### Requirement: Reject step

The press of "Reject quotation" MUST ask for a confirm. The confirm text MUST state that the step spends no credits.

Origin: spec-first

#### Scenario: Reject the quotation `up42-order-panel-014`

- **WHEN** the person presses "Reject quotation" and then "Confirm reject"
- **THEN** the info text first is "Reject the quotation of 90 credits? The order stays unpaid and spends no credits." with the chips "Confirm reject" and "Cancel"
- **AND** the source gets no call before the second press, then one `rejectQuotation` call
- **AND** the info text then is "The quotation is rejected. No credits are spent."

### Requirement: Quote and order steps

The quote chip MUST stay disabled while an order step shows or runs. A new quote MUST end the offer of the old quote.

Origin: spec-first

This change retires `up42-order-panel-015`. An early draft of that scenario needed a new quote during an order step. The final scenario forbids that quote, so it has a new ID.

#### Scenario: Keep the quote and order steps apart `up42-order-panel-016`

- **WHEN** the order step is confirm, working, ordered, quotation, accept-confirm, reject-confirm or done
- **THEN** the quote chip is disabled, a press of it sends no call, and the info text keeps the order text
- **AND** a press of a search chip ends the order steps, and the quote chip works again
- **AND** a press of the quote chip while the layer only offers an order ends the offer, and the order chip goes away
- **AND** a chip works only in the step that showed it, and only until the layer resets the order steps
- **AND** a saved accept chip does nothing after an unclear answer or after the accept

