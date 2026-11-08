## MODIFIED Requirements

### Requirement: Host search

The client MUST group wanted collections in collection-map order and send at most four search calls at one time.

Origin: spec-first

#### Scenario: Host search `up42-source-015`

- **WHEN** search distinct hosts with optional cloud and collection filters in an order that differs from the collection map
- **THEN** each POST has collections, the RFC 3339 interval, a closed longitude-latitude box Polygon and limit 50
- **AND** query.cloudCoverage.LTE exists only when maxCloud exists, and no other request body fields exist
- **AND** the collection map sets the host order and collection order; each call counts against concurrency

### Requirement: Incomplete answer

The client MUST send at most 24 search calls and mark an answer as truncated when it omits excess calls or reads a next link.

Origin: spec-first

#### Scenario: Incomplete answer `up42-source-016`

- **WHEN** a search needs 25 calls or a page has a next link
- **THEN** at most 24 calls receive a request and truncated is true
- **AND** complete pages within the call cap give truncated false and no next request

### Requirement: Host failures

The client MUST keep scenes from good calls and list each host once in failedHosts only when all its sent calls fail.

Origin: spec-first

#### Scenario: Host failures `up42-source-017`

- **WHEN** search a mix of good and failed hosts
- **THEN** the answer contains all good scenes and the names of hosts whose calls all failed
- **AND** a credential rejection gives credentials_rejected with 403
- **AND** if all hosts fail without a credential rejection, a timeout gives search_timeout with 504 and other failures give upstream_failed with 502

### Requirement: Secret output

The route MUST keep passwords and tokens out of answers, thrown errors and console output.

Origin: spec-first

#### Scenario: Secret output `up42-source-023`

- **WHEN** capture answers and all console methods for good searches and failures with fake secrets
- **THEN** no captured text contains the fake user name, password or tokens
- **AND** each new search writes only fixed log forms with fixed kinds and checked host names; no kept answer writes a line

## ADDED Requirements

### Requirement: Single collection calls

The client MUST send one call per wanted collection for vantor-3d and vexcel-v2 and merge their good scenes.

Origin: spec-first

#### Scenario: Split restricted hosts `up42-source-028`

- **WHEN** select two collections of vantor-3d and two collections of vexcel-v2 with a normal host
- **THEN** each restricted call body has exactly one collection with its exact name
- **AND** the normal host receives one call with both its collections
- **AND** scenes from both calls of each restricted host remain in the answer

#### Scenario: Search all archive hosts `up42-source-029`

- **WHEN** the collection map has the 15 probe hosts with three vantor-3d collections and five vexcel-v2 collections
- **THEN** all 15 hosts receive their calls, for a total of 21 calls
- **AND** complete pages give truncated false and an empty failedHosts array

#### Scenario: Keep a partial host `up42-source-030`

- **WHEN** one call of a restricted host fails and another call succeeds
- **THEN** the answer keeps the good scenes and sets truncated true
- **AND** failedHosts does not contain that host

#### Scenario: List a failed host once `up42-source-031`

- **WHEN** all calls of a restricted host fail with a good host
- **THEN** failedHosts contains the restricted host once and the answer keeps the good scenes
- **AND** an unknown host with the same one-collection rule has a normal host failure

#### Scenario: Count concurrent calls `up42-source-032`

- **WHEN** a restricted host needs five calls with another host
- **THEN** four calls start before a gate opens and no fifth call starts
- **AND** all six calls finish with at most four calls active at one time

### Requirement: Search call count

The route MUST add one daily count per new search regardless of its upstream search call count.

Origin: spec-first

#### Scenario: Count one accepted search `up42-source-033`

- **WHEN** a new search needs 21 calls and the daily limit is one
- **THEN** the answer has budget used 1 and limit 1
- **AND** a kept answer sends no new call and adds no count
- **AND** a different search receives 429 with the error budget before any new upstream call

### Requirement: Failure logs

The route MUST log fixed failure kinds and checked failed host names without other request or upstream text.

Origin: spec-first

#### Scenario: Name search failures `up42-source-034`

- **WHEN** a search fails or gives a good answer with failedHosts
- **THEN** a failure writes `[up42] failed kind=<kind>` and writes `[up42] failed hosts=<list>` when hosts failed
- **AND** a good answer writes `[up42] ok` and writes `[up42] partial hosts=<list>` when hosts failed
- **AND** each list has checked host names with commas between names; kept answers write no line
