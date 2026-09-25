## MODIFIED Requirements

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
- **THEN** it has an entry `{id:'osh-systems', token:'3', disposition:'enabled-only'}`
- **AND** the registry has 29 entries, sorted by id
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

### Requirement: Camera panel
The layer MUST show the detail and the video of the selected system in a panel, and MUST hide the panel when the selection ends.
Origin: spec-first

#### Scenario: Show and hide the panel with the selection `osh-086`
- **WHEN** the user selects a system or a feature, and later selects nothing
- **THEN** the layer shows the panel host while it has a detail for the selection, and the detail host has that detail
- **AND** the layer hides the panel host and empties the detail host when the selection ends

#### Scenario: Play the video of the selected system `osh-087`
- **WHEN** the datastreams of the selected system have a datastream with `video: true`
- **THEN** the layer starts one video stream for the first such datastream, and it creates one video view and one player
- **AND** the layer passes each message of the stream to the player
- **AND** the view shows the name of the datastream, or its id when it has no name, and the status of the player
- **AND** the view shows the title `Video` when the name that the layer gives it is empty
- **AND** a new selection, a click on empty space and `destroy()` each close the video stream and the player, and remove the view
- **AND** the event `down` shows the status `reconnecting`, and the event `unsupported` shows the status `unavailable` and closes the stream
- **AND** the event `open` shows the last status of the player again
- **AND** the layer starts no video stream when the player reports the status `unsupported`
- **AND** the layer starts no video stream when the source has no `openVideo()`, or when the page has no video host

#### Scenario: Show a video datastream in the detail `osh-088`
- **WHEN** the detail has a datastream with `video: true`
- **THEN** its block shows the name, or the id when it has no name, and the word `Video`
- **AND** the block shows no row `No data`, no time and no age

#### Scenario: Find the hosts of the panel `osh-089`
- **WHEN** the default layer looks for its hosts in a page
- **THEN** it uses the elements with the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`
- **AND** it uses no host when there is no document, or when the page has no element for an id

#### Scenario: Treat the panel as an occluder of the world overlay `osh-093`
- **WHEN** the world overlay reads its list of occluder selectors
- **THEN** the list has `#osh-panel`, the selector of the panel host
- **AND** the world overlay places a label or a card clear of an element of the list when it can

#### Scenario: Keep the panel in the page and hidden at the start `osh-094`
- **WHEN** a test expands `index.html` with its component templates, as the build does, and reads `style.css` with the files that it imports
- **THEN** the page has one element with the id `osh-panel` and the attribute `hidden`
- **AND** that element has the class `osh-panel`
- **AND** the elements with the ids `osh-panel-video` and `osh-panel-detail` are inside that element
- **AND** each of the three ids is on one element only
- **AND** the style sheets give the display `none` to an element that has the class `osh-panel` and the attribute `hidden`

## ADDED Requirements

### Requirement: Application catalog
The application catalog MUST build the OSH systems layer from the production source, with the hosts of the page. It MUST place that layer after the recent-imagery layer.
Origin: spec-first

#### Scenario: Build the layer in the application catalog `osh-095`
- **WHEN** a test builds the application catalog with the standalone layer sources
- **THEN** the catalog has one layer with the id `osh-systems`
- **AND** that layer comes right after the layer `recent-imagery`
- **AND** the catalog metadata of that layer has the token `3` and the disposition `enabled-only`
