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
- **AND** a feature that a location moves also carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs`
- **AND** a fresh location that names a feature the layer does not hold draws that feature, as `osh-058` says
- **AND** that location never places its system
- **AND** a fresh location with no feature reference places its system with `locationSource:'stream'`, the datastream id and name, `phenomenonTime` and `ageMs`
- **AND** that placement stands in place of that system's `Point`
- **AND** the layer places the newer of two such locations for one system
- **AND** a fresh location whose system has no record still gives a placed system with `name:null`
- **AND** a feature never places its host system, and a system never places a feature

#### Scenario: Read the location fields from a schema `osh-051`
- **WHEN** `readOshSchemaLocation(schema)` reads the record at `resultSchema`, walking `fields` to a depth of four
- **AND** it walks a `Vector` field's `coordinates`
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

#### Scenario: Add a feature that the layer does not hold, from its fresh location alone `osh-058`
- **WHEN** `placeOshEntities({systems, fois, locations})` reads a fresh location whose `foiId` and `foiUid` name no held feature
- **THEN** `features` gains one placed feature at the location's `lon`, `lat` and `alt`, with `locationSource:'stream'`
- **AND** that feature's `id` is the location's `foiId`, or its `foiUid` when the location carries no `foiId`
- **AND** that feature takes `uid` from the location's `foiUid` and `systemId` from the location's `systemId`, and has null for `name`, `description` and `validTime`
- **AND** that feature carries the location's `datastreamId`, `datastreamName`, `phenomenonTime` and `ageMs`, the same fields a stream-placed system carries
- **AND** `systems` and `unplaced` are the same as with no such location, so the location never places its system
- **AND** two fresh locations that name one such feature give one placed feature, at the newer location
- **AND** a location that is not fresh, or that names a held feature, gives no such placed feature
- **AND** `placeOshEntities()` keeps no state between two calls, so a second call with no such location gives no such feature

### Requirement: Systems layer
The browser layer MUST show one entity for each system with a point location. It MUST poll the datastreams and the newest observation of the selected system. It MUST report its state through `getStats()`.
Origin: spec-first

#### Scenario: Report key required from the browser source `osh-028`
- **WHEN** the browser source calls the systems, datastreams, features, locations or observation getter and the server answers `503` with `{error:'no_key'}`
- **THEN** the getter resolves to `keyRequired:true`
- **AND** another non-ok status, or a payload without the expected field, makes the getter throw
- **AND** the observation getter sends the datastream id as the `datastream` query parameter
- **AND** the datastreams getter sends a given system id as the `system` query parameter, and sends no such key when none is given
- **AND** the features getter forwards `truncated` from the payload
- **AND** the locations getter forwards `locations` and `failed` from the payload, and sends no query

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
- **AND** the layer leaves the entity in place when `ageMs` is above `OSH_FRESH_MAX_AGE_MS`, or below `-OSH_CLOCK_SKEW_MAX_MS`, or null
- **AND** an observation with no location leaves the entity where it was
- **AND** a later systems refresh does not move the entity back while that system stays selected

#### Scenario: Render the detail with escaped values `osh-032`
- **WHEN** `renderOshDetail(detail)` builds the system and datastream HTML
- **THEN** it escapes the characters `<`, `>`, `&` and `"` in every name and value
- **AND** when the selection came from a feature, the header shows the feature's name above the host's name
- **AND** the header shows the host's id when the host has no record, or `Host: —` when the feature has no host
- **AND** each datastream block shows the observation's age below its time, in words such as `12 s`, `5 min`, `3 h` or `6 d`
- **AND** a negative `ageMs` within `OSH_CLOCK_SKEW_MAX_MS` reads `0 s`
- **AND** an `ageMs` below `-OSH_CLOCK_SKEW_MAX_MS` reads `ahead of the clock`, and never reads `old`
- **AND** a block whose observation is not fresh carries the class `osh-detail-old`
- **AND** a block whose age is a number past `OSH_FRESH_MAX_AGE_MS` also carries the text `old`
- **AND** a block with `ageMs:null` reads `age unknown`, and never reads `old`
- **AND** when the system is placed by a stream, the header shows `Placed by` with the datastream's name and the age in the same words
- **AND** when the selected feature is placed by a stream, its header shows the same `Placed by` line for the location that placed it
- **AND** a feature header never shows the host's name in place of the feature's name
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
- **AND** a locations getter that resolves `keyRequired:true` alone gives an empty location list, with `partial:false` and no `error`
- **AND** an update aborted before the three reads settle draws nothing from them
- **AND** the layer sends no candidate of its own to the locations getter, and never walks a sampled list to find one

#### Scenario: Keep every system once seen, because the list samples `osh-049`
- **WHEN** a refresh returns a system list that omits a system an earlier refresh held
- **THEN** that system's record and its entity stay, and `getStats().count` does not fall
- **AND** a selection of that system, and its poll, stay across that refresh
- **AND** a refresh that names a system again with new fields updates its record in place
- **AND** only a `keyRequired` answer or `destroy()` empties the system map; `disable()` does not
- **AND** a feature absent from a refresh is removed, with its entity and any selection of it, because the feature list is stable

#### Scenario: Place a system from a fresh stream record, and retire it when its record is no longer fresh `osh-057`
- **WHEN** a refresh brings a fresh location with no feature reference for a system
- **THEN** the map holds the entity `osh:<id>` for that system with `locationSource:'stream'`, and `getStats().placed.stream` counts it
- **AND** a system with no record in the union map gets that entity with the `systemName` the location carries
- **AND** that system also gets a placeholder record, one that never enters the union map
- **AND** only a location with `systemName:null` gives the id as the label
- **AND** the selected system's own poll moves its entity as `osh-031` says, unchanged
- **AND** a refresh with no fresh location for that system removes the entity and counts the system under `unplaced`
- **AND** a selected system is the one exception: its entity stays at its last position until deselected
- **AND** that exception governs the entity only
- **AND** the system still counts under `unplaced`, because no fresh location named it
- **AND** a fresh location that names a feature by id or uid moves that feature entity and never places the system
- **AND** a fresh location that names a feature the layer does not hold draws that feature entity, as `osh-059` says, and never places the system
- **AND** a click on a stream-placed entity selects it and starts its datastream poll as for any system

### Requirement: Feature entities
The browser layer MUST show one entity for each feature of interest with a point. It MUST select the feature's host system when a click picks that entity.
Origin: spec-first

#### Scenario: Show one entity per feature and select its host on a click `osh-045`
- **WHEN** the layer updates with feature records
- **THEN** the map holds one entity with the id `osh-foi:<id>` for each feature, with a point
- **AND** the entity's label shows only within 200 km
- **AND** a feature with no name gets no label
- **AND** `getStats().features` counts the feature entities
- **AND** a click on a feature entity sets `selectedFeatureId` to the feature and `selectedId` to its host id
- **AND** that click starts the host's datastream poll, whether or not the host is in the systems list
- **AND** a click on a feature with a null host sets `selectedFeatureId`, leaves `selectedId` null, and starts no poll
- **AND** a click on empty space clears `selectedFeatureId` and `selectedId`
- **AND** a later refresh that drops the feature also clears `selectedFeatureId` and `selectedId`
- **AND** the layer finds a feature record by id and by uid, and never fetches a feature by id
- **AND** the detail names the feature and its host

#### Scenario: Show one entity per stream-drawn feature, and remove it when its location is no longer fresh `osh-059`
- **WHEN** the layer updates with a fresh location that names a feature the layer does not hold
- **THEN** the map holds the entity `osh-foi:<id>` for that feature at the location's position, where `<id>` is the placed feature's `id`
- **AND** that location adds no entity `osh:<systemId>` for its system, and adds nothing to `getStats().placed.stream`
- **AND** a system with no `Point` that only such a location names still counts under `unplaced`
- **AND** the entity gets no label, because the feature has no name
- **AND** the location's `systemName` never replaces the feature's name, on the label or in the detail, because one host has many features
- **AND** the layer draws one entity per fresh unheld feature, so three such features of one host at one position give three entities
- **AND** the layer applies no cap to the stream-drawn features, and does not group them by host or by position
- **AND** `getStats().features` counts the entity, and `getStats().placed.streamFeatures` counts only the stream-drawn features
- **AND** a held feature that a fresh location moves is not counted under `placed.streamFeatures`
- **AND** a click on the entity sets `selectedFeatureId` to the feature and `selectedId` to the location's `systemId`, and starts that host's datastream poll
- **AND** the detail for that selection shows the feature's id in place of its name, and shows its host
- **AND** that detail shows `Placed by` with the datastream's name and the location's age
- **AND** a refresh with no fresh location for that feature removes the entity and clears any selection of it
- **AND** the layer keeps no record of a stream-drawn feature after a refresh or after `destroy()`

#### Scenario: Keep one entity for a feature across a failed features read `osh-060`
- **WHEN** one refresh holds a feature and a fresh location whose `foiId` is the feature's `id`
- **AND** the second refresh has a features getter that throws, with the same location, and a third refresh holds the feature again
- **AND** a fourth refresh has a features getter that throws and no fresh location for that feature
- **THEN** all three first refreshes hold the one entity `osh-foi:<id>` at the location's position
- **AND** in the first and the third refresh the entity has the feature's name as its label, with `partial:false` and `placed.streamFeatures` at zero
- **AND** in the second refresh the entity has no label, `partial` is true, and `placed.streamFeatures` counts it
- **AND** the fourth refresh removes the entity
- **AND** the layer places the stream-drawn feature the same way whether the features read failed or the feature list has no such feature
