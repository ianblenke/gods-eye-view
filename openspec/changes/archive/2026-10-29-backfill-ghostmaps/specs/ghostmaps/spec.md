## ADDED Requirements

### Requirement: Catalog data

The catalog MUST select current product files from valid repository entries.

Origin: backfill

#### Scenario: Read edition dates `ghostmaps-001`

- **WHEN** a file name contains a valid date and edition
- **THEN** the parser returns that date and edition

#### Scenario: Select a product edition `ghostmaps-002`

- **WHEN** a product contains dated editions
- **THEN** the catalog selects the newest date and then the highest edition

#### Scenario: Select the latest incident `ghostmaps-003`

- **WHEN** incident files include dated products and archive data
- **THEN** the catalog selects the newest eligible incident

#### Scenario: Reject invalid entries `ghostmaps-004`

- **WHEN** a tree contains invalid file metadata
- **THEN** the catalog excludes those entries

#### Scenario: Build file URLs `ghostmaps-005`

- **WHEN** a repository path contains spaces
- **THEN** the raw URL pins the commit and encodes each path segment

#### Scenario: Read branch refs `ghostmaps-006`

- **WHEN** an advertisement includes the target branch
- **THEN** the parser returns its commit

### Requirement: Report text

The report helpers MUST return plain fields and bounded card text.

Origin: backfill

#### Scenario: Read table fields `ghostmaps-007`

- **WHEN** an ArcGIS description contains fields and links
- **THEN** the parser returns plain field values and HTTP links

#### Scenario: Read free text `ghostmaps-008`

- **WHEN** a description contains text and script markup
- **THEN** the parser returns plain text without script content

#### Scenario: Bound report fields `ghostmaps-009`

- **WHEN** a description exceeds the field or value limit
- **THEN** the parser keeps at most 24 fields and 600 characters per value

#### Scenario: Decode text `ghostmaps-010`

- **WHEN** text contains character references
- **THEN** the decoder returns the characters and rejects invalid scalar values

#### Scenario: Read KML colors `ghostmaps-011`

- **WHEN** a color contains eight hexadecimal digits
- **THEN** the parser returns red, green, blue and alpha values

#### Scenario: Wrap card text `ghostmaps-012`

- **WHEN** text exceeds a card line width
- **THEN** the helper splits words and marks text that exceeds the line limit

#### Scenario: Format field labels `ghostmaps-013`

- **WHEN** a field label contains capitals, digits or underscores
- **THEN** the helper separates its words

### Requirement: Proxy service

The proxy MUST keep a catalog and serve its current product files.

Origin: backfill

#### Scenario: Announce commits `ghostmaps-014`

- **WHEN** the watcher reads a new commit
- **THEN** the watcher sends the new catalog to subscribers

#### Scenario: Cache file bytes `ghostmaps-015`

- **WHEN** the watcher reads a current product file
- **THEN** the watcher downloads a commit URL and caches the blob bytes

#### Scenario: Restore the catalog `ghostmaps-016`

- **WHEN** the watcher restarts with a valid disk catalog
- **THEN** the watcher keeps that catalog when the remote check fails

#### Scenario: Report recovery `ghostmaps-017`

- **WHEN** the same branch head succeeds after an error
- **THEN** the watcher clears the error and sends one recovery event

#### Scenario: Set the poll interval `ghostmaps-018`

- **WHEN** the poll option contains a number
- **THEN** the helper uses milliseconds with a 5000 millisecond minimum

#### Scenario: Route local requests `ghostmaps-019`

- **WHEN** a request names an unsupported method or path
- **THEN** the proxy rejects it before it starts the watcher

#### Scenario: Schedule branch checks `ghostmaps-020`

- **WHEN** the watcher starts or stops
- **THEN** the timer follows that state and uses the failure delay after errors

#### Scenario: Send catalog events `ghostmaps-021`

- **WHEN** a client subscribes to catalog events
- **THEN** the proxy sends the catalog and removes the subscriber when the connection closes

### Requirement: Browser source

The browser source MUST read local catalog data, file bytes and catalog events.

Origin: backfill

#### Scenario: Read the local catalog `ghostmaps-022`

- **WHEN** the local catalog response succeeds with a products array
- **THEN** the source returns the catalog

#### Scenario: Read local file bytes `ghostmaps-023`

- **WHEN** the local file response succeeds
- **THEN** the source requests a URL with encoded product and version values
- **AND** the source returns the bytes

#### Scenario: Follow catalog events `ghostmaps-024`

- **WHEN** the event source sends catalog frames and state changes
- **THEN** the source accepts catalog data with product arrays and reports the connection state

### Requirement: KML data

The KML reader MUST return supported geometry and local style data.

Origin: backfill

#### Scenario: Read coordinates `ghostmaps-025`

- **WHEN** coordinate tuples contain valid and invalid positions
- **THEN** the parser keeps finite positions within longitude and latitude bounds

#### Scenario: Read geometry `ghostmaps-026`

- **WHEN** visible placemarks contain supported geometry
- **THEN** the reader returns points, lines and polygons with their folder names

#### Scenario: Resolve styles `ghostmaps-027`

- **WHEN** a placemark names a shared style or supplies an inline style
- **THEN** the reader resolves local styles and gives inline values precedence

#### Scenario: Bound KML data `ghostmaps-028`

- **WHEN** KML data exceeds a feature or position limit
- **THEN** the reader sets the over flag and stops before it adds the excess feature

### Requirement: Browser layer

The browser layer MUST own product data, selection cards and local resources.

Origin: backfill

#### Scenario: Own image URLs `ghostmaps-029`

- **WHEN** the KML reader or entity constructor stops after image allocation
- **THEN** the layer revokes each allocated image URL

#### Scenario: Draw product geometry `ghostmaps-030`

- **WHEN** a product contains supported geometry
- **THEN** the layer creates data source entities for that geometry

#### Scenario: Store product choice `ghostmaps-031`

- **WHEN** the person changes a product chip
- **THEN** the layer stores the selected product ids

#### Scenario: Sync product data `ghostmaps-032`

- **WHEN** a catalog changes a product version or removes a product
- **THEN** the layer replaces the changed product and removes an absent product

#### Scenario: Select report cards `ghostmaps-033`

- **WHEN** the person selects a loaded marker with source links and an external host
- **THEN** the layer publishes a report card and opens its first source link on activation

#### Scenario: Report layer state `ghostmaps-034`

- **WHEN** the layer receives catalog and stream data
- **THEN** the layer reports product chips, totals and connection state

### Requirement: Application factory

The application factory MUST supply the standard layer hosts and accept caller options.

Origin: backfill

#### Scenario: Connect the application layer `ghostmaps-035`

- **WHEN** the application creates the GhostMaps layer
- **THEN** the factory returns the layer with the caller source
