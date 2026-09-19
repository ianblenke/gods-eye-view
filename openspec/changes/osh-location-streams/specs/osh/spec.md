## MODIFIED Requirements

### Requirement: Records
The shared adapters MUST be pure, and MUST tolerate an absent or malformed field.
Origin: spec-first

#### Scenario: Map a feature list to system records `osh-024`
- **WHEN** a payload carries a list under `features` or `items`
- **THEN** each record keeps `id`, `uid`, `name`, `description`, `validTime`, `lon`, `lat` and `alt`
- **AND** a feature with no `Point` geometry, or with a coordinate that is not finite, keeps a record with `lon`, `lat` and `alt` null
- **AND** the mapper skips a feature with no string id, and keeps the first record of a repeated id
- **AND** a malformed payload maps to an empty list

#### Scenario: Map a datastream list to datastream records `osh-025`
- **WHEN** a payload carries a list under `items` or `datastreams`
- **THEN** each record keeps `id`, `systemId`, `name`, `outputName` and `validTime`
- **AND** `systemId` comes from `system@id`, `systemId`, `system.id` or the last path segment of `system@link.href`, in that order, else null
- **AND** the mapper skips an entry with no id, or an id outside the datastream id pattern

#### Scenario: Flatten a result to rows `osh-026`
- **WHEN** the flattener reads a result record
- **THEN** a primitive value becomes one row, a nested object becomes dotted paths, and an array becomes index paths
- **AND** an object or an array with a path of four or more names becomes the string `[object]`
- **AND** a primitive keeps its own value at any depth
- **AND** a result with more than 64 rows keeps 63 and ends with one marker row
- **AND** a null result gives an empty row list

#### Scenario: Extract a location from a result `osh-027`
- **WHEN** the extractor reads a result record with a reader from `readOshSchemaLocation()`
- **THEN** it walks the reader's paths into the result and reads the latitude, the longitude and the height by the paths the reader gives
- **AND** a value counts only when `Number(value)` is finite, so the text `NaN`, an empty string and null all fail
- **AND** a bad or absent height gives `alt:null` and keeps a good latitude and longitude
- **AND** a null reader, a bad latitude or longitude, a latitude past 90 degrees or a longitude past 180 degrees gives null
- **AND** it never reads a value by a guessed key name, and never reads `geometry.coordinates`

#### Scenario: Map a feature-of-interest list to feature records `osh-041`
- **WHEN** `mapOshFois()` reads a payload with a list under `features` or `items`
- **THEN** each record keeps `id`, `uid`, `systemId`, `name`, `description`, `validTime`, `lon`, `lat` and `alt`
- **AND** `systemId` is the last path segment of `hostedProcedure@link.href` only when the segment before it is `systems`, else null
- **AND** the mapper skips a feature with no string id, with no `Point`, or with a coordinate that is not finite
- **AND** a repeated id keeps the first record only
- **AND** a malformed payload maps to an empty list

#### Scenario: Place the systems and the features from their sources `osh-042`
- **WHEN** `placeOshEntities({systems, fois, locations})` reads the three lists
- **THEN** a system with a `Point` gives a placed system at its coordinates with `locationSource:'geometry'`
- **AND** a system with no `Point` and no fresh location gives no placed system and adds one to `unplaced`
- **AND** every feature record gives a placed feature at its own point with its `systemId`
- **AND** a location whose `ageMs` is not fresh under `isOshObservationFresh()` is dropped before any other rule
- **AND** a fresh location whose `foiId` or `foiUid` names a held feature moves that feature with `locationSource:'stream'`
- **AND** a fresh location naming a feature the layer does not hold is dropped
- **AND** a fresh location with no feature reference places its system with `locationSource:'stream'`, the datastream id and name, `phenomenonTime` and `ageMs`, above a `Point`
- **AND** the newer of two such locations for one system wins
- **AND** a fresh location whose system has no record still gives a placed system with `name:null`
- **AND** a feature never places its host system, and a system never places a feature

#### Scenario: Read the location fields from a schema `osh-051`
- **WHEN** `readOshSchemaLocation(schema)` reads the record at `resultSchema`, walking `fields` and, inside a `Vector`, `coordinates`, to a bounded depth
- **THEN** for a `Vector` whose coordinates carry `axisID` `Lat` and `Lon` with unit code `deg`, it binds `lat` and `lon` by axis id
- **AND** it never binds `lat` or `lon` by list position
- **AND** it binds `alt` to a coordinate with axis id `h` and unit code `m`
- **AND** a `Vector` with `Lat` and `Lon` axis ids and no `referenceFrame` binds; a present frame must resolve to EPSG 4979 or EPSG 4326
- **AND** any other frame, or axis ids outside `Lat`, `Lon` and `h` such as `X`, `Y` and `Z`, gives null
- **AND** it reads a definition's last term after the last `/`, `#` or `:`, in lower case
- **AND** for two `Quantity` fields with unit code `deg` whose last term reads `latitude` and `longitude`, it binds each field's path
- **AND** it binds a height only to a `Quantity` in `m` whose last term reads `heighthae`, `heightaboveellipsoid` or `ellipsoidalheight`, never `altitudemsl`
- **AND** it takes the `Vector` shape when a schema has both, and binds `featureUid` to a `Text` field whose definition's last term reads `samplingfeatureuid`
- **AND** it takes every field's path from the schema itself, so a `Vector` named one way, and one named another, give the same reader
- **AND** it gives null when the latitude or the longitude is absent, or when the unit code of either is not `deg`
- **AND** it gives null when the body has no `resultSchema`

#### Scenario: Map a page of newest-per-feature records to location records `osh-052`
- **WHEN** `mapOshLocationPage(payload, reader, nowMs)` reads a page of newest-per-feature records
- **THEN** each item gives a feature reference, the two times, a location and an age
- **AND** the feature reference and the location are both null when absent
- **AND** `location` comes from `extractOshLocation()` and the age from the age function this project's freshness change adds, computed with `nowMs`
- **AND** an item with no location is kept with a null one, and a malformed payload gives an empty list
- **AND** the order of the page is kept, newest first as the server answers it

### Requirement: Datastream id boundary
The provider MUST accept a `datastream` query value only when it matches the datastream id pattern. It MUST keep the origin, the path prefix and the query of the observations URL fixed. The pattern is `^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`.
Origin: spec-first

#### Scenario: Refuse a datastream id outside the pattern `osh-020`
- **WHEN** the `datastream` query value is absent, empty or repeated
- **AND** the test sends, on its own, one value from this set: `../systems`, `..%2Fsystems`, `https://osh.example/x`, `//osh.example/x`, `http:x`, `javascript:x`
- **AND** the test sends, on its own, one value from this set: `a?limit=1`, `a&limit=1`, `a#f`, `a/b`, `a%2Fb`, `a.b`, `a b`, a 65-character value
- **THEN** the response is `400` with `{error:'bad_datastream'}`
- **AND** the provider sends zero upstream requests

#### Scenario: Keep the built observation URL to its fixed shape `osh-021`
- **WHEN** the provider builds the observations URL for an accepted id such as `ds-fixture-1` or `A_b-9`
- **THEN** the URL origin equals the resolved root's origin, the path equals the root path plus `datastreams/<id>/observations`, and the query is the fixed query
- **AND** a safety check on the built URL throws for another origin, another prefix, an extra path segment or another query
- **AND** the route calls this fixed pair of functions directly, with no way for a caller to replace either one

#### Scenario: Keep the newest-per-feature URL to its fixed shape `osh-054`
- **WHEN** the provider builds the newest-per-feature URL for an accepted id
- **THEN** the path equals the root path plus `datastreams/<id>/observations` and the query is the fixed newest-per-feature query, from its own named constants
- **AND** the safety check throws for another origin, another prefix, an extra path segment or another query
- **AND** the location pass calls this fixed pair directly, and no browser value reaches it

### Requirement: Datastreams of one system
The provider MUST serve the datastreams of one system from the per-system route when a `system` query value matches the id pattern. It MUST keep the origin, the path and the query of that URL fixed, and MUST refuse any other value with no upstream request.
Origin: spec-first

#### Scenario: Keep the system id to the pattern and the URL to its shape `osh-047`
- **WHEN** the `system` query key is present, with a value that is empty, repeated, or outside the id pattern
- **AND** the test sends, on its own, one value from the rejection sets of `osh-020`
- **THEN** the response is `400` with `{error:'bad_system'}`, and the provider sends zero upstream requests
- **AND** for an accepted id such as `sys-fixture-1`, the built URL origin equals the resolved root's origin
- **AND** the built URL path equals the root path plus `systems/<id>/datastreams`, and the query is `limit=100`
- **AND** `assertSystemDatastreamsUrl()` throws for another origin, another prefix, an extra path segment or another query
- **AND** the route calls this fixed pair of functions directly, with no way for a caller to replace either one
- **AND** `mapOshFois()` keeps a `systemId` outside the pattern as null
- **AND** an absent `system` key is not a refusal: the route serves the global list and `readSystemId()` answers null

#### Scenario: Serve the datastreams of one system, cached per id `osh-048`
- **WHEN** a client sends `GET /api/osh/datastreams?system=sys-fixture-1` and the upstream page walk succeeds
- **THEN** the response names the system id, the fetch time, a stale flag, the TTL, the count and the datastream records
- **AND** the datastream records are the ones `mapOshDatastreams()` builds
- **AND** each recorded upstream call is a `GET` with no body and an `AbortSignal`
- **AND** its query round-trips through `URLSearchParams`, and it carries no `f` key
- **AND** concurrent requests for one id share one walk, a second id causes its own, and a request inside five minutes sends none
- **AND** a failed walk serves the stale snapshot when one exists, and answers `502` with `{error:'upstream_failed'}` when none exists
- **AND** the cache keeps at most 256 ids
- **AND** a request with no `system` key serves the global list as `osh-016` says
- **AND** the status route reports the per-system cache size

#### Scenario: Keep the built schema URL and system URL to their fixed shapes `osh-053`
- **WHEN** the provider builds the schema URL for an accepted datastream id such as `ds-fixture-1`
- **AND** it builds the system URL for an accepted system id such as `sys-fixture-1`
- **THEN** each URL's origin equals the resolved root's origin, its path equals the root path plus `datastreams/<id>/schema` or `systems/<id>`, and its query is empty
- **AND** the safety check for each throws for another origin, another prefix, an extra path segment, or any query
- **AND** the schema cache and the system cache each call their fixed pair directly, with no way for a caller to replace either one
- **AND** no browser value reaches either fixed pair

### Requirement: Systems layer
The browser layer MUST show one entity for each system with a point location. It MUST poll the datastreams and the newest observation of the selected system. It MUST report its state through `getStats()`.
Origin: spec-first

#### Scenario: Report key required from the browser source `osh-028`
- **WHEN** the browser source calls the systems, datastreams, features, locations or observation getter and the server answers `503` with `{error:'no_key'}`
- **THEN** the getter resolves to `keyRequired:true`
- **AND** another non-ok status, or a payload without the expected field, makes the getter throw
- **AND** the observation getter sends the datastream id as the `datastream` query parameter
- **AND** the datastreams getter sends a given system id as the `system` query parameter, and sends no such key when none is given
- **AND** the features getter passes through `truncated` from the payload
- **AND** the locations getter passes through `locations` and `failed` from the payload, and sends no query

#### Scenario: Show one entity per placed system and report the stats `osh-029`
- **WHEN** the layer updates with the systems and the features
- **THEN** the map holds one entity with the id `osh:<id>` for each placed system
- **AND** the map holds no entity for a system with no `Point` and no fresh location
- **AND** `getStats()` reports `count`, `features`, `lastUpdate`, `error`, `keyRequired`, `stale`, `unplaced`, `truncated`, `partial`, `selectedId`, `selectedFeatureId` and `placed`
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
- **THEN** the layer moves the entity to that location only when the observation is fresh
- **AND** the layer leaves the entity in place when `ageMs` is above `OSH_FRESH_MAX_AGE_MS`, or further below zero than `OSH_CLOCK_SKEW_MAX_MS`, or null
- **AND** an observation with no location leaves the entity where it was
- **AND** a later systems refresh does not move the entity back while that system stays selected

#### Scenario: Render the detail with escaped values `osh-032`
- **WHEN** `renderOshDetail(detail)` builds the system and datastream HTML
- **THEN** it escapes the characters `<`, `>`, `&` and `"` in every name and value
- **AND** when the selection came from a feature, the header shows the feature's name above the host's name
- **AND** the header shows the host's id when the host has no record, or `Host: —` when the feature has no host
- **AND** each datastream block shows the observation's age below its time, in words such as `12 s`, `5 min`, `3 h` or `6 d`
- **AND** a small negative `ageMs` reads `0 s`, which is the usual reading from a server whose clock leads
- **AND** an `ageMs` further ahead than `OSH_CLOCK_SKEW_MAX_MS` reads `ahead of the clock`, and never reads `old`
- **AND** a block whose observation is not fresh carries the class `osh-detail-old`
- **AND** a block whose age is a number past the threshold also carries the text `old`
- **AND** a block with `ageMs:null` reads `age unknown`, and never reads `old`, because an unknown age is not a large one
- **AND** when the system is placed by a stream, the header shows `Placed by` with the datastream's name and the age in the same words
- **AND** the header shows the system's id as its name when it has none
- **AND** a host element given to the layer receives that HTML in `innerHTML`
- **AND** an empty selection clears the host

#### Scenario: Register the layer with a stable token `osh-033`
- **WHEN** the test reads the production layer registry
- **THEN** it has an entry `{id:'osh-systems', token:'o', disposition:'enabled-only'}`
- **AND** the registry has 17 entries, sorted by id
- **AND** `src/data/localLayers.js` includes the OSH systems layer

#### Scenario: Read the three lists per refresh, and stay correct when the features or the locations are unavailable `osh-046`
- **WHEN** the layer updates and the features getter or the locations getter throws
- **THEN** the layer places what it has from the other sources, sets `partial:true`, and sets no `error`
- **AND** a server with no `Point`, no feature and no location gives `count:0`, `features:0`, `error:null` and `partial:false`
- **AND** `truncated` is true when the features payload says so
- **AND** a features getter that resolves `keyRequired:true` alone gives an empty feature list, with `partial:false` and no `error`
- **AND** an update aborted before the three reads settle draws nothing from them
- **AND** the layer sends no candidate of its own to the locations getter, and never walks a sampled list to find one

#### Scenario: Keep every system once seen, because the list samples `osh-049`
- **WHEN** a refresh returns a system list that omits a system an earlier refresh held
- **THEN** that system's record and its entity stay, and `getStats().count` does not fall
- **AND** a selection of that system, and its poll, stay across that refresh
- **AND** a refresh that names a system again with new fields updates its record in place
- **AND** only a `keyRequired` answer or `destroy()` empties the system map; `disable()` does not
- **AND** a feature absent from a refresh is removed, with its entity and any selection of it, because the feature list is stable

#### Scenario: Place a system from a fresh stream record, and retire it when the record goes stale `osh-057`
- **WHEN** a refresh brings a fresh location with no feature reference for a system
- **THEN** the map holds the entity `osh:<id>` for that system with `locationSource:'stream'`, and `getStats().placed.stream` counts it
- **AND** a system with no record in the union map gets that entity with the `systemName` the location carries
- **AND** that system also gets a placeholder record, one that never enters the union map
- **AND** only a location with `systemName:null` gives the id as the label
- **AND** that label means the name could not be read, a degraded state and not the design
- **AND** the selected system's own poll moves its entity as `osh-031` says, unchanged; this scenario governs only placement and motion from the pass
- **AND** a refresh with no fresh location for that system removes the entity and counts the system under `unplaced`
- **AND** a selected system is the one exception: its entity stays at its last position until deselected
- **AND** that exception governs the entity only
- **AND** the system still counts under `unplaced`, because its stream went stale
- **AND** a fresh location that names a feature by id or uid moves that feature entity and never places the system
- **AND** a click on a stream-placed entity selects it and starts its datastream poll as for any system

### Requirement: Synthetic fixtures
The OSH provider files, adapter files and test files MUST NOT contain a real server address or a captured payload.
Origin: spec-first

#### Scenario: Keep the OSH files free of a real address `osh-034`
- **WHEN** the test reads the provider files, the adapter files and the layer files as text
- **AND** it reads, as text, each test file whose name starts with `osh` or that sits in an `osh/` directory
- **THEN** every scheme-qualified address in them names `localhost`, a reserved `*.example` host, or one of the two vocabulary hosts `www.opengis.net` and `sensorml.com`
- **AND** every `urn:osh:def:` string in them has `fixture` as its vendor segment
- **AND** the provider, adapter and layer files also have no dotted host with an explicit port, other than a `*.example` host
- **AND** those files have no IPv4 literal
- **AND** every system, datastream and feature fixture id starts with `sys-fixture-`, `ds-fixture-` or `foi-fixture-`
- **AND** `.env.example` has the three OSH keys and `OSH_LOCATION_PROPERTIES`, each with an empty value

## ADDED Requirements

### Requirement: Location discovery
The provider MUST find candidate location datastreams from stable surfaces only. These are the datastreams list filtered by a declared property, the datastreams of each feature host, and the datastreams of each system with a point. It MUST let the schema decide whether a candidate carries a location. It MUST NOT walk a sampled list to find one.
Origin: spec-first

#### Scenario: Serve the candidate datastreams of each declared property `osh-055`
- **WHEN** the location pass reads the property filter
- **THEN** it sends one list request per URI in the built-in property list, built with the query keys `limit` and `observedProperty`
- **AND** each request is walked by the shared walk and cached per URI for the list TTL
- **AND** the built-in list holds two public terms, and an environment value appends comma-separated URIs to it
- **AND** a value that does not parse as a URL or a URN scheme, or that holds white space, is skipped
- **AND** the skip carries a warning that names only the value's position, never its text
- **AND** no response of any route carries a URI of the list
- **AND** the status route reports their count
- **AND** a candidate found only by the filter, whose system is in no systems snapshot, is served like any other

#### Scenario: Serve the newest location of every candidate datastream `osh-056`
- **WHEN** a client sends `GET /api/osh/locations`
- **THEN** the provider unites the candidates of the property filter, of every feature host's datastreams and of every `Point` system's datastreams
- **AND** it reads each candidate's schema through a per-id cache with the list TTL, one shared refresh and a stale value on failure
- **AND** that schema cache keeps at most 256 ids
- **AND** it reads one newest-per-feature page for each candidate whose schema gave a reader
- **AND** it answers the fetch time, a stale flag, the TTL, the count, the stream count and the failed count
- **AND** it also answers the location list
- **AND** each location names its system, its system's name, its datastream, its feature reference, its position, its time and its age
- **AND** the system's name comes from the systems snapshot when it holds the system, else from one by-id read cached per id
- **AND** that name is null when the read fails or the record has no name, and a failed name read never drops the location
- **AND** a candidate with no reader, or whose page read fails, gives no location and adds one to the failed count
- **AND** every schema URL and every page URL of the pass goes through its fixed pair of functions
- **AND** the pass sits behind a fifteen-second cache with one shared refresh and a stale snapshot on failure
- **AND** with no candidate at all it answers a zero count and sends no schema and no page request
