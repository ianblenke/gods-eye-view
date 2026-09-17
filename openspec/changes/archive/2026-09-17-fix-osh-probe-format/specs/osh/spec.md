## MODIFIED Requirements
### Requirement: API root resolution
The provider MUST find the OpenSensorHub API root from a fixed list of three candidates, with GET probes only, once per process. It MUST report the name of the candidate that answered, never its URL.
Origin: spec-first

#### Scenario: Use the configured value when it answers with a system list `osh-009`
- **WHEN** the candidate built from `OSH_URL` answers `200` with a JSON body that has an array under `features` or `items`
- **THEN** the provider resolves the root to that candidate, named `root`, with one upstream probe
- **AND** the probe URL is the candidate plus `systems?limit=1&f=application%2Fgeo%2Bjson`
- **AND** the `f` value of that URL decodes to `application/geo+json`

#### Scenario: Try the next candidate after a miss `osh-010`
- **WHEN** the `root` candidate answers `404`, the `api` candidate answers `200` with a non-list body, and the `sensorhub-api` candidate answers `200` with a list
- **THEN** the provider probes the three candidates in that fixed order
- **AND** it resolves the root to `sensorhub-api`
- **AND** it records the two earlier misses with their status

#### Scenario: Probe once per process, and again after a change `osh-011`
- **WHEN** two requests for the systems route and one for the datastreams route arrive after the root resolves
- **THEN** the provider sends exactly one probe pass, shared by concurrent first requests
- **AND** a later request with a changed `OSH_URL` starts one new probe pass

#### Scenario: Report failure when every candidate misses `osh-012`
- **WHEN** every candidate misses, and a client later requests a data route within 60 seconds of that failed pass
- **THEN** the status route reports `candidate:null` with the three failures
- **AND** a data route answers `502` with `{error:'auth_failed'}` when a failure carries status `401` or `403`, else `{error:'base_unresolved'}`
- **AND** no new probe runs inside the 60-second hold, and one runs after it

## ADDED Requirements
### Requirement: Query construction
The provider MUST build the query of every upstream list URL from named keys and values with `URLSearchParams`. It MUST NOT write a URL with a literal query, and MUST NOT write a query value with a hand-encoded byte.
Origin: spec-first

#### Scenario: Build every list URL from parts `osh-037`
- **WHEN** the provider builds the URL of the base probe, the systems list or the datastreams list
- **THEN** `oshListUrl(root, path, query)` gives a URL on the root's origin, with the root's path plus `path`, and a query of the `URLSearchParams` form of `query`
- **AND** `oshListUrl()` throws when the built URL leaves the root's origin or the root's path
- **AND** a value with `+`, `/`, `&` or a space reaches the query as `%2B`, `%2F`, `%26` or `+`
- **AND** the probe query is `limit=1&f=application%2Fgeo%2Bjson`, the systems query is `limit=100&f=application%2Fgeo%2Bjson` and the datastreams query is `limit=100`
- **AND** `OSH_LIST_FORMAT` is `application/geo+json`

#### Scenario: Send each upstream query in its canonical form `osh-038`
- **WHEN** a client requests the systems, datastreams and observations routes, so that the probe, the two list fetches and the observation fetch each run
- **THEN** the query of each recorded upstream URL equals its own `URLSearchParams` round trip, byte for byte
- **AND** each recorded URL with an `f` key decodes that key to `application/geo+json`
- **AND** no decoded query value holds a space

#### Scenario: Keep the provider files free of a literal query `osh-039`
- **WHEN** the test reads, as text, `server/providers/osh.js` and the four files that `osh-005` discovers under `server/providers/osh/`, with comments removed
- **THEN** no quoted string in those files holds a `key=value` pair whose value has `+`, `%`, `#` or a space
- **AND** no quoted string in those files holds `?` followed by a `key=value` pair

#### Scenario: Keep the provider's own format on a walked next-page link `osh-040`
- **WHEN** a next-page link carries an `f` key, omits it, or carries it twice
- **THEN** the walked request's `f` value is `OSH_LIST_FORMAT`, written once, when the current page asked for one
- **AND** the walked request carries no `f` key at all when the current page asked for none
- **AND** that format holds across every later page of the same walk, and the walk never takes that format from a link
- **AND** the query reaches the wire as `application%2Fgeo%2Bjson`, even when a link's raw value holds a literal `+`
