## ADDED Requirements

### Requirement: Layer record
The layer `gdacs` MUST have the name "Disaster Alerts", the icon "🚨", the source name "GDACS" and the update interval 600000 ms. The layer MUST make no request until the first update.
Origin: spec-first

#### Scenario: Describe the layer `gdacs-layer-001`
- **WHEN** a test creates the layer with a fake source and a fake overlay host
- **THEN** the `id` is "gdacs", the `name` is "Disaster Alerts" and the `icon` is "🚨"
- **AND** the `source` is "GDACS" and the `updateInterval` is 600000
- **AND** the creation throws a `TypeError` when the source has no function `getSnapshot`, or when there is no overlay host
- **AND** the layer has no function `getAnalystRecords`

#### Scenario: Make no request before the first update `gdacs-layer-002`
- **WHEN** a test calls `init` and then `enable` on the layer
- **THEN** the source gets no call
- **AND** the data source has `show` false after `init` and `show` true after `enable`
- **AND** the overlay host gets `setVisible` with false for the source "gdacs" after `init`, and with true after `enable`
- **AND** a second `init` without `destroy` throws "GDACS layer is already initialized"

### Requirement: Browser source
The source MUST read the route `/api/gdacs` of the same origin with the abort signal of the caller. It MUST refuse an answer that is not a GDACS document of the schema version 1, and a body of more than 2 MiB.
Origin: spec-first

#### Scenario: Read the route `gdacs-layer-003`
- **WHEN** `getSnapshot` runs with a signal and the fetch answers a valid document
- **THEN** the fetch gets the path "/api/gdacs" and the same signal
- **AND** the result has the list `events` and the object `meta`

#### Scenario: Refuse a bad answer `gdacs-layer-004`
- **WHEN** the fetch answers with the status 503, or with text that is not JSON
- **THEN** `getSnapshot` throws, and the message for the status 503 is "GDACS HTTP 503"
- **AND** it throws "Invalid GDACS document" for a document whose `events` is not a list, and for a document that has no `schemaVersion` 1
- **AND** it throws for a body of more than 2 MiB, and it accepts a valid body of exactly 2 MiB
- **AND** it throws when the signal is already aborted, and then it sends no request

### Requirement: Event records
The normalizer MUST keep only the events that meet the rules, MUST clean the names, and MUST keep at most 500 events. A character is one code point.

An event meets the rules when each of these is true. The event is an object. Its `type` is "FL", "DR", "VO" or "TC". Its `id` is the type, a hyphen and a whole number of 1 to 16 digits whose first digit is not 0. Its `alert` is "green", "orange" or "red". Its `latitude` is a finite number from -90 to 90, and its `longitude` is a finite number from -180 to 180.

The normalizer MUST remove `<`, `>`, U+0000 to U+001F, U+007F to U+009F and U+061C from a name. It MUST also remove U+200B to U+200F, U+2028 to U+202E, U+2060 to U+2064, U+2066 to U+2069 and U+FEFF. A value is a date when it is a text and `Date.parse` gives a finite number for it.
Origin: spec-first

#### Scenario: Keep the fields of a valid event `gdacs-layer-005`
- **WHEN** the normalizer reads a document with the valid flood "Flood in Türkiye", the id "FL-1104230", the alert "green" and `current` true
- **AND** the flood has the latitude 41.116, the longitude 28.999 and the `modified` "2026-10-16T07:45:43.000Z"
- **THEN** the record has exactly the fields `id`, `type`, `name`, `alert`, `current`, `latitude`, `longitude` and `modified`
- **AND** the values are the values of the input
- **AND** the types "DR", "VO" and "TC", each with an id that starts with that type, are valid
- **AND** the alert levels "orange" and "red" are valid
- **AND** the latitudes -90 and 90, the longitudes -180 and 180, and the position (0, 0) are valid
- **AND** the ids "FL-1" and "FL-9007199254740992" are valid

#### Scenario: Drop the events that are not valid `gdacs-layer-006`
- **WHEN** the list `events` holds null, the number 5, the text "FL-1" and a list
- **AND** it holds events with the types "EQ", "fl" and "FL " and with no type
- **AND** it holds events of the type "FL" with the ids "FL-0", "FL-01", "FL-1.5", "FL-" and "DR-7"
- **AND** it holds events of the type "FL" with the ids "FL-12345678901234567" and "fl-7", and with the number 7 as the id
- **AND** it holds events with the alerts "Green", "purple" and " red" and with no alert
- **AND** it holds events with the latitudes 90.001, -90.001 and "5" and with no latitude
- **AND** it holds events with the longitudes 180.001, -180.001 and null, and an event with the latitude `NaN`
- **AND** each of these events is valid in all other fields
- **THEN** the result lists none of these events
- **AND** the result keeps only the first event with the same `id`
- **AND** a list of 520 valid events gives the first 500 events, in the order of the input

#### Scenario: Read the current flag and the time `gdacs-layer-007`
- **WHEN** the normalizer reads valid events with `current` true, false, "true", 1 and no value
- **AND** it reads valid events with the `modified` values "2026-10-16T07:45:43.000Z", "not a date", 5, null and no value
- **THEN** `current` is true only for the value true, and false for the other values
- **AND** `modified` is "2026-10-16T07:45:43.000Z" for the first value, and null for the other values

#### Scenario: Clean the names `gdacs-layer-008`
- **WHEN** a name holds characters that the requirement removes, such as control characters, characters that change the text direction, zero width characters, `<` and `>`
- **THEN** the cleaned name has none of these characters and at most 120 code points
- **AND** the cleaned name has no white space at its start or its end
- **AND** every run of white space between words becomes one space
- **AND** a name that is empty after the normalizer cleans it, or is not text, becomes the type label
- **AND** the type label is "Flood", "Drought", "Volcano" or "Tropical cyclone" for the type FL, DR, VO or TC
- **AND** the characters `&`, quotation marks and letters of any script stay

#### Scenario: Read the meta of the document `gdacs-layer-009`
- **WHEN** the normalizer reads a document
- **THEN** `meta.unavailable` and `meta.stale` are true only when the document says true
- **AND** `meta.reason` is the text of the document, cleaned like a name and cut to 120 code points, when that cleaned text is not empty
- **AND** the cleaned text of a value that is not a text is empty
- **AND** when the cleaned text is empty, `meta.reason` is "GDACS unavailable" if `meta.unavailable` is true, and null if not
- **AND** `meta.fetchedAt` is a date or null
- **AND** `meta.total` is the `counts.total` of the document when that is a whole number that is not negative
- **AND** `meta.total` is the length of the list `events` of the document when `counts.total` is not such a number
- **AND** the normalizer returns null for a value that is not a document of the schema version 1 with a list `events`

### Requirement: Display model
The model MUST give each event a color from its alert level, and a size and an alpha from its current flag. It MUST choose at most 48 labels.
Origin: spec-first

#### Scenario: Style the points by alert and current flag `gdacs-layer-010`
- **WHEN** a test asks the model for the style of each alert level and each value of the current flag
- **THEN** the colors are "#22c55e" for green, "#f97316" for orange and "#ef4444" for red
- **AND** an event with `current` true has the alpha 1 and the size 10
- **AND** an event with `current` false has the alpha 0.45 and the size 6

#### Scenario: Choose the labels `gdacs-layer-011`
- **WHEN** the model chooses the labels of a list of events
- **THEN** it sorts the events with `current` true first
- **AND** then it sorts them by the alert level: "red", then "orange", then "green"
- **AND** then it sorts them by the newest `modified`, and an event with `modified` null comes after the events with a date
- **AND** then it sorts them by `id`, with the smaller `id` first, compared as text
- **AND** it keeps the first 48 events of that order
- **AND** each label title is the name cut to 32 code points, and the accent is the color of the alert level
- **AND** the priority of the first label is 100000, and each next label has a priority that is 1 less
- **AND** each entry has the `variant` "label", the `collisionGroup` "ambient-label", the `paintLane` "ambient-label" and `interactive` false
- **AND** each entry has `edgeFade` "keyhole", `horizonCull` true, `terrainOcclusion` false, `gapPx` 15, `verticalOnly` true and `placement` "above"

### Requirement: Layer display
While it is enabled, the layer MUST show the points and the labels of the answer to its newest request. It MUST keep them when that request fails. It MUST poll only while it is enabled.
Origin: spec-first

#### Scenario: Show the points and the labels `gdacs-layer-012`
- **WHEN** the layer is enabled and `update` reads a list of 3 events
- **THEN** the data source has 3 entities, and the id of each entity is "gdacs:" followed by the `id` of the event
- **AND** each entity has a point on the ground at the position of the event
- **AND** the point has the color, the alpha and the size of the model
- **AND** the overlay host gets the entries of the labels for the source "gdacs"
- **AND** that call has the cohort limit 48, the collision capacity 24 and `moving` false
- **AND** the stats have `count` 3, a `lastUpdate` and `error` null
- **AND** a second `update` replaces the points and the labels of the update before

#### Scenario: Report an unavailable source `gdacs-layer-013`
- **WHEN** `update` reads a document with `meta.unavailable` true and the reason "GDACS unavailable"
- **THEN** the data source has no entity and the overlay source has no entry
- **AND** the stats have `count` 0, `status` "idle", `statusMessage` "GDACS unavailable" and `error` null

#### Scenario: Keep the points of a stale list `gdacs-layer-014`
- **WHEN** `update` reads a document with `meta.stale` true and 2 events
- **THEN** the data source has 2 entities and the stats have `count` 2 and `error` null

#### Scenario: Keep the last points when a request fails `gdacs-layer-015`
- **WHEN** `update` runs after a good update and the source rejects with the message "GDACS HTTP 503"
- **THEN** the data source keeps its entities, the overlay source keeps its entries, and `update` returns false
- **AND** the stats have `error` "GDACS HTTP 503", and the text "GDACS source unavailable" when the error has no message

#### Scenario: Poll only while enabled `gdacs-layer-016`
- **WHEN** `update` runs while the layer is not enabled
- **THEN** it returns false and the source gets no call
- **AND** `disable` aborts the request in flight, and an answer that arrives afterwards changes nothing
- **AND** `disable` hides the data source, clears the entries of the overlay source and hides that source
- **AND** a new `update` aborts the request of the update before it

#### Scenario: Release everything on destroy `gdacs-layer-017`
- **WHEN** a test calls `destroy` on a layer that shows points
- **THEN** the viewer has no data source of the layer and the overlay source has no entry
- **AND** the stats have `count` 0 and `lastUpdate` null
- **AND** `destroy` aborts the request in flight, and a second `destroy` does nothing

### Requirement: Registration
The application MUST register the layer in the catalog, the share link, the layer panel and the credits. It MUST give the texts of the layer in Spanish and Russian, and MUST keep the layer out of voice.
Origin: spec-first

#### Scenario: Register the layer and its share token `gdacs-layer-018`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layer "gdacs" and the reference sources have the key "gdacs" with a function `getSnapshot`
- **AND** the share link registry has the entry "gdacs" with the token "9" and the disposition "enabled-only"
- **AND** the share link "v=2&l=9" decodes to the enabled layer "gdacs"
- **AND** the layer comes right after the layer "gnss-integrity" in the order of the catalog
- **AND** the source contract "gdacs" names the layer "gdacs" and the method `getSnapshot`
- **AND** a catalog without the source "gdacs" gives the layer the stats error "Data source not configured: gdacs"

#### Scenario: Put the layer in the Events group `gdacs-layer-019`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Events" ends with the layer "gdacs", after "gnss-integrity"

#### Scenario: Keep the layer out of voice `gdacs-layer-020`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "gdacs" has the text "The GDACS layer has no voice tools."

#### Scenario: Credit the data `gdacs-layer-021`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry with the key "gdacs" names GDACS, the United Nations and the European Commission
- **AND** the entry says that a machine makes the estimates and that an estimate can be wrong
- **AND** the entry links to "https://www.gdacs.org/"

#### Scenario: Give the texts in Spanish and Russian `gdacs-layer-022`
- **WHEN** a test reads the Spanish and the Russian texts of the application
- **THEN** each of the texts "Disaster Alerts", "GDACS source unavailable" and "GDACS unavailable" has a Spanish text and a Russian text that are not empty
- **AND** the layer panel shows the name "Disaster Alerts" through the text function of the application
