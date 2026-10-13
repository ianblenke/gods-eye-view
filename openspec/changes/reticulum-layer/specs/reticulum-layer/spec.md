## ADDED Requirements

### Requirement: Layer record
The layer `reticulum` MUST have the name "Reticulum Network", the icon "📡", the source name "Reticulum discovery" and the update interval 300000 ms. The layer MUST make no request until the first update.
Origin: spec-first

#### Scenario: Describe the layer `reticulum-layer-001`
- **WHEN** a test creates the layer with a fake source and a fake overlay host
- **THEN** the `id` is "reticulum", the `name` is "Reticulum Network" and the `icon` is "📡"
- **AND** the `source` is "Reticulum discovery" and the `updateInterval` is 300000
- **AND** the creation throws a `TypeError` when the source has no function `getSnapshot`, or when the overlay host is missing
- **AND** the layer has no function `getAnalystRecords`

#### Scenario: Make no request before the first update `reticulum-layer-002`
- **WHEN** a test calls `init` and then `enable` on the layer
- **THEN** the source gets no call
- **AND** the data source is hidden after `init` and shown after `enable`
- **AND** the overlay source "reticulum" is hidden after `init` and visible after `enable`
- **AND** a second `init` without `destroy` throws "Reticulum layer is already initialized"

### Requirement: Browser source
The source MUST read the route `/api/reticulum` of the same origin with the abort signal of the caller. It MUST refuse an answer that is not a Reticulum document of the schema version 1.
Origin: spec-first

#### Scenario: Read the route `reticulum-layer-003`
- **WHEN** `getSnapshot` runs with a signal and the fetch answers a valid document
- **THEN** the fetch gets the path "/api/reticulum" and the same signal
- **AND** the result has the list `interfaces` and the object `meta`

#### Scenario: Refuse a bad answer `reticulum-layer-004`
- **WHEN** the fetch answers with the status 503, or with text that is not JSON, or with a document that has no `schemaVersion` 1
- **THEN** `getSnapshot` throws, and the message for the status 503 is "Reticulum HTTP 503"
- **AND** it throws "Invalid Reticulum snapshot" for a document whose `interfaces` is not a list, and for a document that has no `schemaVersion` 1
- **AND** it throws for a body of more than 8 MiB, and it accepts a valid body of exactly 8 MiB
- **AND** it throws when the signal is already aborted, and then it sends no request

### Requirement: Interface records
The normalizer MUST keep only the interfaces that meet the rules, MUST clean the names, and MUST keep at most 5000 interfaces. A character is one code point. The normalizer removes `<`, `>`, U+0000 to U+001F, U+007F to U+009F and U+061C from a name. It also removes U+200B to U+200F, U+2028 to U+202E, U+2060 to U+2064, U+2066 to U+2069 and U+FEFF.
Origin: spec-first

#### Scenario: Keep the fields of a valid interface `reticulum-layer-005`
- **WHEN** the normalizer reads a document with one valid RNode interface
- **THEN** the record has exactly the fields `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and `radio`
- **AND** the values are the values of the input, with the position and the radio numbers unchanged
- **AND** `radio` is null when the input has no radio object, or when one of its four numbers is missing
- **AND** `heightM` and `hops` are null when the input has no number

#### Scenario: Drop the interfaces that are not valid `reticulum-layer-006`
- **WHEN** the normalizer reads interfaces whose `id` is not 16 lowercase hexadecimal characters, or whose `type` is not 1 to 40 lowercase letters or digits
- **AND** the list also holds interfaces whose `status` is not "available", "unknown" or "stale"
- **AND** the list also holds interfaces whose position is not valid, or whose `lastHeard` is not a date
- **THEN** the result lists none of these interfaces
- **AND** a second interface with the same `id` is dropped
- **AND** a position is valid when the latitude and the longitude are finite numbers, and the pair is not 0 and 0
- **AND** the latitude of a valid position is from -90 to 90, and the longitude is from -180 to 180
- **AND** a text is a date when `Date.parse` reads it as a date
- **AND** the result holds at most 5000 interfaces, in the order of the input

#### Scenario: Clean the names `reticulum-layer-007`
- **WHEN** a name holds characters that the requirement removes, such as control characters, characters that change the text direction, zero width characters, `<` and `>`
- **THEN** the cleaned name has none of these characters, one space between words, and at most 40 code points
- **AND** a name that is empty after the normalizer cleans it, or is not text, becomes "Unnamed" and the type, for example "Unnamed rnode"
- **AND** the characters `&`, quotation marks and letters of any script stay

#### Scenario: Read the meta of the document `reticulum-layer-008`
- **WHEN** the normalizer reads a document
- **THEN** `meta.unavailable` and `meta.stale` are true only when the document says true
- **AND** `meta.reason` is the text of the document, cleaned like a name, with at most 120 code points, or null
- **AND** `meta.reason` is "Reticulum listener unavailable" when `meta.unavailable` is true and the text of the document is empty or missing
- **AND** `meta.fetchedAt` is a date or null, and `meta.total` is a whole number that is not negative
- **AND** the normalizer returns null for a value that is not a document of the schema version 1 with a list `interfaces`

### Requirement: Display model
The model MUST give each interface a color, a size and an alpha from its type and status. It MUST choose at most 48 labels.
Origin: spec-first

#### Scenario: Style the points by type and status `reticulum-layer-009`
- **WHEN** a test asks the model for the style of each type and each status
- **THEN** the colors are "#2dd4bf" for rnode, "#fb923c" for backbone, "#facc15" for tcpserver and "#fde047" for tcpclient
- **AND** the colors are "#a78bfa" for i2p, "#60a5fa" for kiss and "#f472b6" for weave
- **AND** any other type has the color "#9ca3af"
- **AND** the status "available" has the alpha 1 and the size 9, "unknown" has 0.6 and 7, and "stale" has 0.35 and 5

#### Scenario: Choose the labels `reticulum-layer-010`
- **WHEN** the model chooses the labels of a list of interfaces
- **THEN** it keeps at most 48 interfaces. It orders them by status ("available", then "unknown", then "stale"), then by the newest `lastHeard`, then by `id` in ascending text order
- **AND** each label title is the name cut to 24 code points, and the accent is the color of the type
- **AND** the priority of the first label is 100000, and each next label has a priority that is 1 less
- **AND** each entry has the `variant` "label", the `collisionGroup` and the `paintLane` "ambient-label", and `interactive` false
- **AND** each entry has `edgeFade` "keyhole", `horizonCull` true, `terrainOcclusion` false, `gapPx` 15, `verticalOnly` true and `placement` "above"

### Requirement: Layer display
The layer MUST show the points and the labels of the last answer that the source returns. It MUST poll only while it is enabled.
Origin: spec-first

#### Scenario: Show the points and the labels `reticulum-layer-011`
- **WHEN** the layer is enabled and `update` reads a list of 3 positioned interfaces
- **THEN** the data source has 3 entities, and the id of each entity is "reticulum:" followed by the `id` of the interface
- **AND** each entity has a point on the ground at the position of the interface
- **AND** the point has the color, the alpha and the size of the model
- **AND** the overlay host gets the entries of the labels for the source "reticulum"
- **AND** that call has the cohort limit 48, the collision capacity 24 and `moving` false
- **AND** the stats have `count` 3, a `lastUpdate` and `error` null
- **AND** a second `update` replaces the points and the labels of the update before

#### Scenario: Report an unavailable listener `reticulum-layer-012`
- **WHEN** `update` reads a document with `meta.unavailable` true and the reason "Reticulum listener not configured"
- **THEN** the data source has no entity and the overlay source has no entry
- **AND** the stats have `count` 0, `status` "idle", `statusMessage` "Reticulum listener not configured" and `error` null

#### Scenario: Keep the points of a stale list `reticulum-layer-013`
- **WHEN** `update` reads a document with `meta.stale` true and 2 positioned interfaces
- **THEN** the data source has 2 entities and the stats have `count` 2 and `error` null

#### Scenario: Keep the last points when a request fails `reticulum-layer-014`
- **WHEN** `update` runs after a good update and the source rejects with the message "Reticulum HTTP 503"
- **THEN** the data source keeps its entities and `update` returns false
- **AND** the stats have `error` "Reticulum HTTP 503", and the text "Reticulum source unavailable" when the error has no message

#### Scenario: Poll only while enabled `reticulum-layer-015`
- **WHEN** `update` runs while the layer is not enabled
- **THEN** it returns false and the source gets no call
- **AND** `disable` aborts the request in flight, and an answer that arrives afterwards changes nothing
- **AND** a new `update` aborts the request of the update before it

#### Scenario: Release everything on destroy `reticulum-layer-016`
- **WHEN** a test calls `destroy` on a layer that shows points
- **THEN** the viewer has no data source of the layer and the overlay source has no entry
- **AND** the stats have `count` 0 and `lastUpdate` null
- **AND** `destroy` aborts the request in flight, and a second `destroy` does nothing

### Requirement: Registration
The application MUST register the layer in the catalog, the share link, the layer panel and the credits, and MUST keep it out of voice.
Origin: spec-first

#### Scenario: Register the layer and its share token `reticulum-layer-017`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layer "reticulum" and the reference sources have the key "reticulum" with a function `getSnapshot`
- **AND** the share link registry has the entry "reticulum" with the token "4" and the disposition "enabled-only"
- **AND** the share link "v=2&l=4" decodes to the enabled layer "reticulum"
- **AND** the layer comes right after the layer "earthquakes" in the order of the catalog
- **AND** the source contract "reticulum" names the layer "reticulum" and the method `getSnapshot`
- **AND** a catalog without the source "reticulum" gives the layer the stats error "Data source not configured: reticulum"

#### Scenario: Put the layer in the Infrastructure group `reticulum-layer-018`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Infrastructure" ends with the layer "reticulum", after "local-dams"

#### Scenario: Keep the layer out of voice `reticulum-layer-019`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "reticulum" has the text "The Reticulum layer has no voice tools."

#### Scenario: Credit the data `reticulum-layer-020`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry with the key "reticulum" names the Reticulum network and links to "https://reticulum.network/"
