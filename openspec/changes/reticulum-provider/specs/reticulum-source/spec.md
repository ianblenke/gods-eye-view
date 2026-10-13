## ADDED Requirements

### Requirement: Public interface fields only
The Reticulum provider MUST keep only the allowed fields of a discovered interface and MUST drop every other field.
Origin: spec-first

#### Scenario: Keep the allowed fields `reticulum-source-001`
- **WHEN** the provider normalizes a discovered RNode interface that has a position
- **THEN** the record has exactly the fields `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and `radio`
- **AND** the type is "rnode", the name is "Example Gateway", the latitude is 12.346 and the longitude is -45.679
- **AND** the height is 43 m, the hops are 3 and the status is "available"
- **AND** the radio has the frequency 914875000 Hz, the bandwidth 125000 Hz, the spreading factor 8 and the coding rate 5
- **AND** `radio` is null for an interface that is not an RNode, and for an RNode that lacks a radio number

#### Scenario: Drop the address, key and contact fields `reticulum-source-002`
- **WHEN** the provider normalizes a record that holds a value in each of the fields `config_entry`, `reachable_on`, `port`, `ifac_netname`, `ifac_netkey` and `operator_lxmf_address`
- **THEN** the JSON text of the result holds none of these values

#### Scenario: Drop the identity and software fields `reticulum-source-003`
- **WHEN** the provider normalizes a record that holds a value in each of the fields `transport_id`, `network_id`, `stamp`, `value`, `impl_name` and `version`
- **THEN** the JSON text of the result holds none of these values

### Requirement: Position rules
The provider MUST list only the interfaces that have a valid position, and MUST round the position to three decimals.
Origin: spec-first

#### Scenario: List only positioned interfaces `reticulum-source-004`
- **WHEN** the provider normalizes records whose latitude or longitude is missing, is not a number, is outside the valid range, or is zero for both
- **THEN** the document lists none of these records
- **AND** `counts.total` counts all records and `counts.positioned` counts the listed records

### Requirement: Age rules
The provider MUST set the status of an interface from the time since it was last heard. It MUST drop an interface that it last heard more than 7 days ago.
Origin: spec-first

#### Scenario: Set the status from the age `reticulum-source-005`
- **WHEN** the provider normalizes records that were last heard 23 hours, 25 hours, 73 hours and 169 hours ago
- **THEN** the first three statuses are "available", "unknown" and "stale"
- **AND** the document does not list the record of 169 hours

### Requirement: Text and size bounds
The provider MUST clean the name of an interface and MUST keep at most 5000 interfaces.
Origin: spec-first

#### Scenario: Clean the names and bound the list `reticulum-source-006`
- **WHEN** a name holds control characters or angle brackets, is longer than 80 characters, or is empty
- **THEN** the cleaned name has no control character, no angle bracket and at most 80 characters
- **AND** an empty name becomes "Unnamed" and the type, for example "Unnamed rnode"
- **AND** the document lists at most 5000 interfaces, the most recently heard first

### Requirement: Route document
The route `/api/reticulum` MUST answer a GET request with one JSON document.
Origin: spec-first

#### Scenario: Answer with the document `reticulum-source-007`
- **WHEN** a GET request with no query comes to the route and the source answers with records
- **THEN** the status is 200 and the header `Cache-Control` is "no-store"
- **AND** the body has `schemaVersion` 1, `source` "Reticulum interface discovery", `stale` false and `unavailable` false
- **AND** the body also has `attribution`, `coverage`, `fetchedAt`, `counts` and `interfaces`
- **AND** for one RNode record, `counts` is 1 in `total`, 1 in `positioned` and 1 in `byType.rnode`

#### Scenario: Refuse other requests `reticulum-source-008`
- **WHEN** a request uses a method other than GET, or has a query
- **THEN** the status is 405 with the error `method_not_allowed`, or 400 with the error `invalid_reticulum_query`

### Requirement: Source rules
The provider MUST read the listener only at a local address that the operator sets. It MUST serve the last good document for 2 hours when the listener fails.
Origin: spec-first

#### Scenario: Report a missing or not local source `reticulum-source-009`
- **WHEN** the variable `RETICULUM_LISTENER` is empty, or is not a `host:port` address of the loopback, a private network, `localhost` or a `.local` name
- **THEN** the document says `unavailable` true
- **AND** the reason is "Reticulum listener not configured" for an empty variable and "Reticulum listener address not allowed" for any other value
- **AND** the provider sends no request

#### Scenario: Survive a failing source `reticulum-source-010`
- **WHEN** the listener times out, answers with an error status, sends more than 4 MiB, or sends text that is not a JSON list
- **THEN** the provider answers with the last good document and `stale` true when that document is younger than 2 hours
- **AND** otherwise the provider answers with `unavailable` true and the reason "Reticulum listener unavailable"
- **AND** a failed answer is not cached, so the next request tries the listener again

#### Scenario: Cache the document for 60 seconds `reticulum-source-011`
- **WHEN** a second request comes less than 60 seconds after the first, and a third comes 60 seconds after the first
- **THEN** the provider sends one request to the listener for the first two
- **AND** it sends a new request for the third
