## MODIFIED Requirements

### Requirement: Newest observation
The provider MUST serve the newest observation of one datastream, cached for 15 seconds.
Origin: spec-first

#### Scenario: Serve the newest observation of a datastream `osh-022`
- **WHEN** a client sends `GET /api/osh/observations?datastream=ds-fixture-1` for an id whose upstream call succeeds
- **THEN** the response names the datastream, the fetch time, a stale flag, the TTL and an observation built from the newest item
- **AND** an empty upstream item list gives `observation:null`
- **AND** a non-2xx upstream status gives `502` with `{error:'observation_failed', upstreamStatus}`

#### Scenario: Cache the newest observation per datastream `osh-023`
- **WHEN** concurrent requests name the same datastream id, and other requests name a second id
- **THEN** the same-id requests share one upstream call, inside a 15-second TTL, and the second id causes its own call
- **AND** a failed refresh serves the stale value when one exists
- **AND** the cache keeps at most 256 ids, and drops the oldest past that cap

#### Scenario: Carry the age of every observation `osh-050`
- **WHEN** the observations route answers with an observation
- **THEN** the observation carries `ageMs`, the provider's clock at serve time minus the parsed `phenomenonTime`, computed by the route and never stored in the cache
- **AND** a second answer served from the same cached snapshot later carries a larger `ageMs`
- **AND** an absent or unparsed `phenomenonTime` gives `ageMs:null`
- **AND** `oshObservationAgeMs()` and `isOshObservationFresh()` read no clock of their own and hold no state
- **AND** an observation is fresh when `ageMs` is a finite number at or under `OSH_FRESH_MAX_AGE_MS`, which is one hour
- **AND** `ageMs:null` is an unknown age, and an unknown age is never fresh
- **AND** an `ageMs` below zero is fresh, because the OpenSensorHub server's clock leads the provider's clock
- **AND** the route serves a negative `ageMs` when the `phenomenonTime` is ahead of the injected `now`
- **AND** the browser source passes `ageMs` through unchanged and computes no age

### Requirement: Systems layer
The browser layer MUST show one entity for each system with a point location. It MUST poll the datastreams and the newest observation of the selected system. It MUST report its state through `getStats()`.
Origin: spec-first

#### Scenario: Report key required from the browser source `osh-028`
- **WHEN** the browser source calls the systems, datastreams, features or observation getter and the server answers `503` with `{error:'no_key'}`
- **THEN** the getter resolves to `keyRequired:true`
- **AND** another non-ok status, or a payload without the expected field, makes the getter throw
- **AND** the observation getter sends the datastream id as the `datastream` query parameter
- **AND** the datastreams getter sends a given system id as the `system` query parameter, and sends no such key when none is given
- **AND** the features getter passes through `truncated` from the payload

#### Scenario: Show one entity per placed system and report the stats `osh-029`
- **WHEN** the layer updates with the systems and the features
- **THEN** the map holds one entity with the id `osh:<id>` for each placed system, and none for a system with no `Point`
- **AND** `getStats()` reports `count`, `features`, `lastUpdate`, `error`, `keyRequired`, `stale`, `unplaced`, `truncated`, `partial`, `selectedId` and `selectedFeatureId`
- **AND** a failed systems fetch sets `error` and leaves the entities unchanged
- **AND** a failure while the layer places or draws the entities also sets `error`, and the update resolves to `false`
- **AND** a `keyRequired` answer clears the entities
- **AND** `disable()` hides the data source, and only `destroy()` removes it

#### Scenario: Poll the datastreams of the selected system `osh-030`
- **WHEN** a click selects a system entity or a feature entity with a host
- **THEN** the layer reads the datastreams of that system through the datastreams getter with the `system` key, once
- **AND** it reads the newest observation of each, then again every 15 seconds
- **AND** it keeps only the records whose `systemId` equals the selected id
- **AND** a click that selects another system stops the first poll and starts a new one
- **AND** a click on empty space or on a non-OSH entity clears the selection and stops the poll

#### Scenario: Move the entity for the selected system's newest location `osh-031`
- **WHEN** a poll's newest observation for the selected system carries a location
- **THEN** the entity moves to that location only when the observation is fresh, with `ageMs` finite and at or under `OSH_FRESH_MAX_AGE_MS`
- **AND** an observation with an `ageMs` above the threshold, or with `ageMs:null`, leaves the entity where it was
- **AND** an observation with no location leaves the entity where it was
- **AND** a later systems refresh does not move the entity back while that system stays selected

#### Scenario: Render the detail with escaped values `osh-032`
- **WHEN** `renderOshDetail(detail)` builds the system and datastream HTML
- **THEN** it escapes the characters `<`, `>`, `&` and `"` in every name and value
- **AND** when the selection came from a feature, the header shows the feature's name above the host's name
- **AND** the header shows the host's id when the host has no record, or `Host: —` when the feature has no host
- **AND** each datastream block shows the observation's age below its time, in words such as `12 s`, `5 min`, `3 h` or `6 d`
- **AND** an `ageMs` below zero reads `0 s`, which is the usual reading from a server whose clock leads
- **AND** a block whose observation is not fresh carries the class `osh-detail-old`
- **AND** a block whose age is a number past the threshold also carries the text `old`
- **AND** a block with `ageMs:null` reads `age unknown`, and never reads `old`, because an unknown age is not a large one
- **AND** a host element given to the layer receives that HTML in `innerHTML`
- **AND** an empty selection clears the host

#### Scenario: Register the layer with a stable token `osh-033`
- **WHEN** the test reads the production layer registry
- **THEN** it has an entry `{id:'osh-systems', token:'o', disposition:'enabled-only'}`
- **AND** the registry has 17 entries, sorted by id
- **AND** `src/data/localLayers.js` includes the OSH systems layer

#### Scenario: Read the two lists per refresh, and stay correct when the features are unavailable `osh-046`
- **WHEN** the layer updates and the features getter throws
- **THEN** the layer places the systems it has, sets `partial:true`, and sets no `error`
- **AND** a server with no `Point` and no feature gives `count:0`, `features:0`, `error:null` and `partial:false`
- **AND** `truncated` is true when the features payload says so
- **AND** a features getter that resolves `keyRequired:true` alone gives an empty feature list, with `partial:false` and no `error`
- **AND** an update aborted before the two reads settle draws nothing from them

#### Scenario: Keep every system once seen, because the list samples `osh-049`
- **WHEN** a refresh returns a system list that omits a system an earlier refresh held
- **THEN** that system's record and its entity stay, and `getStats().count` does not fall
- **AND** a selection of that system, and its poll, stay across that refresh
- **AND** a refresh that names a system again with new fields updates its record in place
- **AND** only a `keyRequired` answer or `destroy()` empties the system map; `disable()` does not
- **AND** a feature absent from a refresh is removed, with its entity and any selection of it, because the feature list is stable
