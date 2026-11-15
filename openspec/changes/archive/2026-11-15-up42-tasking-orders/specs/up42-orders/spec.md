## ADDED Requirements

### Requirement: Routes

The plugin MUST provide both Vite hooks and answer only the four exact order paths.

Origin: spec-first

#### Scenario: Use both hooks `up42-orders-001`

- **WHEN** both hooks receive requests for POST /api/up42/order, GET /api/up42/order/quotation, POST /api/up42/order/accept and POST /api/up42/order/reject, and for child paths
- **THEN** both hooks answer the four exact paths; child paths and other paths go to next

### Requirement: Method

The routes MUST check the method before the site and all later gates.

Origin: spec-first

#### Scenario: Check the method `up42-orders-002`

- **WHEN** a request has another method and an invalid origin
- **THEN** the route gives 405 with the error Method not allowed and makes no upstream call

### Requirement: Site

The POST routes MUST accept only same-site JSON requests. The GET route MUST accept only same-site requests.

Origin: spec-first

#### Scenario: Check the site `up42-orders-003`

- **WHEN** requests have invalid origins, proxy headers, fetch metadata or POST content types
- **THEN** the routes give 403 with the error cross_origin before the switch and rate checks; valid HTTP and HTTPS origins pass

### Requirement: Switch

All routes MUST stay off unless UP42_ORDERS is exactly true.

Origin: spec-first

#### Scenario: Keep the routes off `up42-orders-004`

- **WHEN** UP42_ORDERS is absent or differs from true
- **THEN** all routes give 404 with the error orders_off and consume no rate count

### Requirement: Credit cap

The order route and the accept route MUST refuse each request when UP42_ORDER_MAX_CREDITS is not a whole number from 1 to 1000000. The reject route needs no cap.

Origin: spec-first

#### Scenario: Refuse with no cap `up42-orders-005`

- **WHEN** the cap is absent, zero, negative, fractional, above 1000000 or not a number, and a valid request arrives
- **THEN** the route gives 503 with the error no_cap and makes no upstream call
- **AND** a cap of 1 and a cap of 1000000 pass this check
- **AND** a reject request with no cap does not give no_cap

### Requirement: Rate limit

The routes MUST allow at most 6 requests in one minute for all four routes together.

Origin: spec-first

#### Scenario: Limit the rate `up42-orders-006`

- **WHEN** 7 valid requests arrive in one minute
- **THEN** the seventh gives 429 with the error rate_limited and the header Retry-After with the value 60

### Requirement: Order request

The order route MUST accept only the keys dataProduct, box, params and approvedCredits. It MUST check them before any upstream call.

Origin: spec-first

#### Scenario: Validate the order request `up42-orders-007`

- **WHEN** the body is not JSON, has an extra key or has an invalid product id, box or parameter
- **THEN** the route gives 400 bad_body or bad_bbox, and makes no upstream call
- **AND** a box above 2500 square kilometres gives 400 area_too_large with maxKm2
- **AND** an approvedCredits that is not a number above 0 and at most the cap gives 400 bad_body

### Requirement: Credentials

The order, accept and reject routes MUST refuse a request when the user name or the password is empty.

Origin: spec-first

#### Scenario: Refuse with no credentials `up42-orders-008`

- **WHEN** a valid request arrives and UP42_USERNAME or UP42_PASSWORD is empty
- **THEN** the route gives 503 with the error no_credentials and the flag keyRequired, and makes no upstream call

### Requirement: Estimate before order

The order route MUST run the estimate for the same body before it places the order. It MUST refuse a price above the cap or above approvedCredits.

Origin: spec-first

#### Scenario: Check the price first `up42-orders-009`

- **WHEN** the estimate gives totalCredits 51 with approvedCredits 50, or totalCredits 101 with a cap of 100, or fails, or gives no readable totalCredits
- **THEN** the route gives 409 over_approved, 409 over_cap, 502 upstream_failed or 502 bad_upstream, and sends no order call
- **AND** a price equal to the cap and to approvedCredits goes on to the order call

### Requirement: Place the order

After a valid estimate the order route MUST send one POST request to the order URL. The body is the body of the quote with the display name gev-order.

Origin: spec-first

#### Scenario: Place one order `up42-orders-010`

- **WHEN** the estimate passes and UP42 answers 202 with a results list whose first item has a UUID id
- **THEN** the fake fetch function gets exactly one POST to "https://api.up42.com/v2/orders" with the body of the quote and the display name gev-order
- **AND** the route gives 200 with the order id, the credits of the estimate and the flag spent false
- **AND** the URL has the query workspaceId when UP42_WORKSPACE_ID is a UUID, and the route gives 503 bad_workspace when it is set to another value

### Requirement: Unclear order answer

The order route MUST send the order call once. It MUST NOT repeat the call after a time-out, a 5xx answer or an unknown body.

Origin: spec-first

#### Scenario: Stop after an unclear order `up42-orders-011`

- **WHEN** the order call ends in a time-out, in a 5xx answer, or in a 202 body with no UUID id
- **THEN** the route gives 502 with the error order_unclear and sends no second order call
- **AND** the route keeps no order id and no duplicate key for that request

### Requirement: Duplicate order

The order route MUST refuse a second request with the same product, box and parameters for 10 minutes after a placed order. It MUST refuse a simultaneous identical request.

Origin: spec-first

#### Scenario: Refuse a duplicate `up42-orders-012`

- **WHEN** an identical request arrives after a placed order, and another arrives while the first still runs
- **THEN** the first gives 409 duplicate with the first order id and no upstream call
- **AND** the second gives 409 busy and no upstream call
- **AND** an identical request 10 minutes after the order passes the check

### Requirement: Order count

The order route MUST count each request that reaches the order call. It MUST write the count to the ledger before the call. It MUST refuse a request above UP42_DAILY_ORDERS. The default is 2 and the maximum is 20.

Origin: spec-first

#### Scenario: Count the orders `up42-orders-013`

- **WHEN** the count reaches the limit, the day changes, and UP42_DAILY_ORDERS is absent, 0, 21, fractional or 20
- **THEN** a request above the limit gives 429 with the error budget and the numbers used and limit, and sends no estimate call
- **AND** the limits are 2, 2, 2, 2 and 20, and a new day sets the count to 0
- **AND** a new plugin that reads the same ledger file keeps the count

### Requirement: Quotation read

The quotation route MUST accept only an orderId of an order in the ledger. It MUST read the quotation list with one GET request and return the quotation of that order.

Origin: spec-first

#### Scenario: Read the quotation `up42-orders-014`

- **WHEN** a request has an orderId that is not a UUID, an orderId that the ledger does not hold, or an orderId of the ledger
- **THEN** the route gives 400 bad_body, 404 unknown_order, or one GET to "https://api.up42.com/v2/tasking/quotation?page=0&size=100"
- **AND** a list item with the same orderId gives 200 with the quotation id, the credits and the decision
- **AND** a list with no such item gives 200 with the quotation null

### Requirement: Accept request

The accept route MUST accept only the keys quotationId and approvedCredits. It MUST check them before any upstream call.

Origin: spec-first

#### Scenario: Validate the accept request `up42-orders-015`

- **WHEN** the body is not JSON, has an extra key or has a quotationId that is not a UUID
- **AND** the approvedCredits is not a number above 0
- **THEN** the route gives 400 bad_body and makes no upstream call

### Requirement: Read before accept

The accept route MUST read the quotation list before it accepts. It MUST refuse a quotation of another order, a decided quotation and a price above the cap or above approvedCredits.

Origin: spec-first

#### Scenario: Check the quotation first `up42-orders-016`

- **WHEN** the quotation is not in the list, or belongs to an order that the ledger does not hold
- **OR** the decision is ACCEPTED or REJECTED, the price is 101 with a cap of 100, or the price is 51 with approvedCredits 50
- **THEN** the route gives 404 unknown_quotation, 409 not_ours, 409 decided, 409 over_cap or 409 over_approved, and sends no PATCH call
- **AND** a price equal to the cap and to approvedCredits goes on to the PATCH call

### Requirement: Accept the quotation

After the checks the accept route MUST send one PATCH request that holds only the decision ACCEPTED.

Origin: spec-first

#### Scenario: Accept one quotation `up42-orders-017`

- **WHEN** the checks pass and UP42 answers 2xx
- **THEN** the fake fetch function gets exactly one PATCH to "https://api.up42.com/v2/tasking/quotation/" followed by the lower-case quotation id
- **AND** the type is application/merge-patch+json and the body is the text {"decision":"ACCEPTED"}
- **AND** the route gives 200 with accepted true and the credits of the quotation
- **AND** an answer 402 gives 402 insufficient_balance

### Requirement: Unclear accept answer

The accept route MUST send the PATCH call once. It MUST NOT repeat the call after a time-out, a 5xx answer or an unknown body.

Origin: spec-first

#### Scenario: Stop after an unclear accept `up42-orders-018`

- **WHEN** the PATCH call ends in a time-out or in a 5xx answer
- **THEN** the route gives 502 with the error accept_unclear and the flag maySpend true, and sends no second PATCH call
- **AND** a later accept of the same quotation reads the list first and gives 409 decided when the quotation shows ACCEPTED

### Requirement: Accept count

The accept route MUST count each request that reaches the PATCH call with its own count, written to the ledger before the call. It MUST refuse a request above UP42_DAILY_ORDERS.

Origin: spec-first

#### Scenario: Count the accepts `up42-orders-019`

- **WHEN** the accept count reaches the limit while the order count is 0
- **THEN** a request above the limit gives 429 with the error budget and sends no PATCH call
- **AND** the order route still accepts requests

### Requirement: One accept at a time

The accept route MUST refuse a second request for the same quotation while the first request runs.

Origin: spec-first

#### Scenario: Refuse a second accept `up42-orders-020`

- **WHEN** two requests for the same quotation arrive before the first PATCH call ends
- **THEN** the second gives 409 busy and the fake fetch function gets one PATCH call

### Requirement: Rejected credentials

The order, accept and reject routes MUST report rejected credentials.

Origin: spec-first

#### Scenario: Report rejected credentials `up42-orders-021`

- **WHEN** UP42 refuses the token twice in one call
- **THEN** the route gives 403 with the error credentials_rejected and the flag keyRejected

### Requirement: Allow-list

The code of the orders folder MUST send only five calls. They are the estimate POST, the order POST, the quotation list GET and the quotation PATCH with ACCEPTED or with REJECTED.

Origin: spec-first

#### Scenario: Send only the listed calls `up42-orders-022`

- **WHEN** a fake fetch function records each method and URL for every request shape and every failure kind
- **THEN** the records hold only the five calls of the allow-list
- **AND** a scan of the folder finds no extensions, cancellation, eulas, download-url, DELETE or PUT text
- **AND** the text REJECTED and the text ACCEPTED each appear once, in one constant
- **AND** the scan finds the text /v2/orders only in the estimate and order constants

### Requirement: No secret in output

The routes MUST NOT put a secret into an answer or into the log.

Origin: spec-first

#### Scenario: Keep secrets private `up42-orders-023`

- **WHEN** a fault puts the user name, the password or the token into an estimate response, an order response or a quotation list response
- **THEN** the estimate response and the quotation list response give 502 bad_upstream
- **AND** the order response gives 502 order_unclear
- **AND** the answer and the log hold none of the three values, and no PATCH call goes out

### Requirement: Plugin list

The local plugin list MUST add one orders plugin that shares the client with the other UP42 plugins.

Origin: spec-first

#### Scenario: Share the client `up42-orders-024`

- **WHEN** the local list serves scenes, thumbnails, quotes and orders
- **THEN** one up42-orders plugin follows up42-quotes and all four share one client

### Requirement: Reject the quotation

The reject route MUST accept only the keys quotationId. It MUST read the quotation list first and MUST send one PATCH request that holds only the decision REJECTED.

Origin: spec-first

#### Scenario: Reject one quotation `up42-orders-025`

- **WHEN** the quotation belongs to an order of the ledger and has the decision NOT_DECIDED
- **THEN** the fake fetch function gets exactly one PATCH to the quotation URL with the type application/merge-patch+json and the body {"decision":"REJECTED"}
- **AND** the route gives 200 with rejected true, and the route makes no cap check and changes no count
- **AND** a reject request with no cap, and a reject request at a full accept count, give 200
- **AND** a quotation of another order gives 409 not_ours, and a decided quotation gives 409 decided
- **AND** a quotation that is not in the list gives 404 unknown_quotation
- **AND** each of the three sends no PATCH call
- **AND** a time-out or a 5xx answer gives 502 reject_unclear and no second call

### Requirement: Ledger file

The orders folder MUST keep the orders, the duplicate keys and the two counts of the day in the file orders.json of the folder UP42_DATA_DIR. It MUST write each change before the call that the change allows.

Origin: spec-first

#### Scenario: Keep the ledger over a restart `up42-orders-026`

- **WHEN** a new plugin starts with the file that an earlier plugin wrote
- **THEN** the order ids, the duplicate keys and the counts of the day are the same
- **AND** a day that changed sets the counts to 0
- **AND** an order with the key of the file gives 409 duplicate, and a quotation of an order in the file passes the own-order check
- **AND** a missing file gives an empty ledger
- **AND** the server writes a temporary file first and then renames it, and it writes each count before the call that the count allows
- **AND** two first requests at the same time load the file once and share one ledger state
- **AND** each allowed request increases its count
- **AND** the ledger keeps each order and deletes none

### Requirement: Ledger failure

The routes MUST fail closed when the ledger file cannot be read, or when the server cannot write a count.

Origin: spec-first

#### Scenario: Stop when the ledger fails `up42-orders-027`

- **WHEN** the file has invalid content, the read of the file fails or the write of a count fails
- **THEN** the route gives 503 with the error store_failed and sends no estimate, order or PATCH call

### Requirement: Order save failure

The order route MUST keep a placed order in memory when the server cannot save the order to the ledger file. It MUST then give the success answer.

Origin: spec-first

#### Scenario: Keep the order after a failed save `up42-orders-030`

- **WHEN** the write of the ledger file fails after the order call
- **THEN** the route gives 200 with the order id and the credits
- **AND** a quotation request for that order works while the plugin runs

### Requirement: Volume

The compose file MUST mount a named volume at the folder of the ledger. The dev server MUST ignore that folder.

Origin: spec-first

#### Scenario: Mount the volume `up42-orders-028`

- **WHEN** a test reads compose.yaml, the Dockerfile and the list of ignored folders
- **THEN** compose.yaml mounts the volume gev-up42 at /app/.gev-up42 and lists it under volumes
- **AND** the Dockerfile makes the folder .gev-up42
- **AND** the dev server ignores and denies the folder .gev-up42

### Requirement: Client call

The shared client MUST send a call only to the origin https://api.up42.com. It MUST refuse DELETE, PUT and each method name that has no capital letters. It MUST repeat a call once after a token refusal and MUST report the status of a refused call.

Origin: spec-first

#### Scenario: Call the API with a fixed origin `up42-orders-029`

- **WHEN** a test calls the client with the methods DELETE, PUT and get, with an origin other than https://api.up42.com, and with a refused status
- **THEN** DELETE, PUT, get and the other origin give bad_upstream and make no fetch call
- **AND** a status 401 gets one new token and one repeat; a second 401 gives credentials_rejected
- **AND** a status that the caller did not name gives upstream_failed with the status
- **AND** a call with a body sends the given content type, or application/json when none is given
- **AND** the option discard returns a null value without a read of the body
