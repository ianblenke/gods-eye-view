## ADDED Requirements

### Requirement: Public interface fields only
The Reticulum provider MUST keep only the allowed fields of a discovered interface and MUST drop every other field.
Origin: spec-first

#### Scenario: Keep the allowed fields `reticulum-source-001`
- **WHEN** the provider normalizes a discovered RNode interface that has a position
- **THEN** the record has exactly the fields `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and `radio`
- **AND** the id is "ab12cd34ef56ab12", the first 16 characters of the field `discovery_hash`
- **AND** the type is "rnode", the name is "Example Gateway", the latitude is 12.346 and the longitude is -45.679
- **AND** the height 43.4 m gives `heightM` 43, the hops are 3, the status is "available" and `lastHeard` is "2026-10-13T11:00:00.000Z"
- **AND** the radio has the frequency 914875000 Hz, the bandwidth 125000 Hz, the spreading factor 8 and the coding rate 5
- **AND** `radio` is null for an interface that is not an RNode, and for an RNode that lacks a radio number
- **AND** `hops` is null unless it is an integer from 0 to 255, and `heightM` is null unless the height is a number

#### Scenario: Drop the address, key and contact fields `reticulum-source-002`
- **WHEN** the provider normalizes a record that holds a value in each of the fields `config_entry`, `reachable_on`, `port`, `ifac_netname`, `ifac_netkey` and `operator_lxmf_address`
- **THEN** the JSON text of the result holds none of these values

#### Scenario: Drop the identity, stamp and software fields `reticulum-source-003`
- **WHEN** the provider normalizes a record that holds a value in each of the fields `transport_id`, `network_id`, `stamp`, `value`, `impl_name` and `version`
- **THEN** the JSON text of the result holds none of these values

### Requirement: Record rules
The provider MUST drop a record that is not an object. It MUST drop a record whose `discovery_hash` is not 64 lowercase hexadecimal characters. It MUST drop a record whose type is not 1 to 40 letters or digits, or is only the word "Interface". It MUST drop a record whose `last_heard` is not a number or not a valid date.
Origin: spec-first

#### Scenario: Drop invalid records `reticulum-source-004`
- **WHEN** the provider normalizes a list that holds one record of each kind that these rules name, and one valid record
- **THEN** the document lists only the valid record
- **AND** `counts.total` counts all the records

### Requirement: Position rules
The provider MUST list only the interfaces that have a valid position, and MUST round the position to three decimals.
Origin: spec-first

#### Scenario: List only positioned interfaces `reticulum-source-005`
- **WHEN** the provider normalizes records whose latitude or longitude is missing, is not a number, is outside the valid range, or is zero for both
- **THEN** the document lists none of these records
- **AND** `counts.total` counts all records and `counts.positioned` counts the listed records
- **AND** the latitudes -90 and 90 and the longitudes -180 and 180 are valid
- **AND** the latitude 5.5555 becomes 5.556 and the latitude -0.0004 becomes 0

### Requirement: Age rules
The provider MUST set the status of an interface from the time since it was last heard. It MUST drop an interface that it last heard more than 7 days ago.
Origin: spec-first

#### Scenario: Set the status from the age `reticulum-source-006`
- **WHEN** the provider normalizes records that were last heard 23 hours, 25 hours, 73 hours and 169 hours ago
- **THEN** the first three statuses are "available", "unknown" and "stale"
- **AND** the document does not list the record of 169 hours

### Requirement: Text and size bounds
The provider MUST clean the name of an interface. A control character is a character from U+0000 to U+001F or from U+007F to U+009F. The provider MUST keep at most 5000 interfaces.
Origin: spec-first

#### Scenario: Clean the names and bound the list `reticulum-source-007`
- **WHEN** a name holds control characters or angle brackets, is longer than 80 characters, or is empty
- **THEN** the cleaned name has no control character, no angle bracket and at most 80 characters
- **AND** an empty name becomes "Unnamed" and the type, for example "Unnamed rnode"
- **AND** the document lists at most 5000 interfaces, the most recently heard first

### Requirement: Route document
The route `/api/reticulum` MUST answer a GET request with one JSON document.
Origin: spec-first

#### Scenario: Answer with the document `reticulum-source-008`
- **WHEN** a GET request with no query comes to the route and the source answers with records
- **THEN** the status is 200 and the header `Cache-Control` is "no-store"
- **AND** the body has `schemaVersion` 1, `source` "Reticulum interface discovery", `stale` false, `unavailable` false and `reason` null
- **AND** the body also has `attribution`, `coverage`, `fetchedAt`, `counts` and `interfaces`
- **AND** for one RNode record, `counts` is 1 in `total`, 1 in `positioned` and 1 in `byType.rnode`
- **AND** `byType` holds a count of its own for each type, also for a type that is named like an inherited property, such as `constructor`
- **AND** the provider asks the listener for the path `/interfaces.json`, and the preview server serves the same route

#### Scenario: Refuse other methods `reticulum-source-009`
- **WHEN** a request uses a method other than GET
- **THEN** the status is 405 with the error `method_not_allowed`
- **AND** the provider sends no request to the listener

#### Scenario: Refuse a query or a sub-path `reticulum-source-010`
- **WHEN** a GET request has a query, or has a path other than `/` such as `/other`
- **THEN** the status is 400 with the error `invalid_reticulum_query`
- **AND** the provider sends no request to the listener

### Requirement: Source address
The provider MUST read the listener only at a local address that the operator sets. A local address is a `host:port` of the loopback, a private network, `localhost` or a `.local` name. The provider MUST NOT follow a redirect.
Origin: spec-first

#### Scenario: Report a source that is not set or not local `reticulum-source-011`
- **WHEN** the variable `RETICULUM_LISTENER` is not set, is empty or only spaces, or is not a local address
- **THEN** the document says `unavailable` true
- **AND** the reason is "Reticulum listener not configured" for a variable that is not set, empty or only spaces
- **AND** the reason is "Reticulum listener address not allowed" for any other value
- **AND** the provider sends no request

### Requirement: Source failure and cache
The provider MUST serve the last good document for 2 hours when the listener fails. The listener fails when it does not answer in 8 seconds, or answers with an error status or a redirect. It also fails when it sends more than 4 MiB, or text that is not a JSON list. The provider MUST cache the document for 60 seconds.
Origin: spec-first

#### Scenario: Serve the last good document when the source fails `reticulum-source-012`
- **WHEN** the listener fails
- **THEN** the provider answers with the last good document and `stale` true when that document is younger than 2 hours
- **AND** otherwise the provider answers with `unavailable` true and the reason "Reticulum listener unavailable"
- **AND** a failed answer is not cached, so the next request tries the listener again
- **AND** a list of exactly 4 MiB is still accepted

#### Scenario: Cache the document for 60 seconds `reticulum-source-013`
- **WHEN** a second request comes while the first waits for the listener, and a third comes less than 60 seconds after the first
- **THEN** the provider sends one request to the listener for all three
- **AND** a fourth request that comes 60 seconds after the first gets a new request
- **AND** a fifth request that comes 30 seconds after the fourth uses the new document and sends no request
