## ADDED Requirements

### Requirement: Catalog data

The catalog MUST select current product files from valid repository entries.

Origin: backfill

#### Scenario: Read edition dates `ghostmaps-001`

- **WHEN** a file name contains a valid date and edition
- **THEN** the parser returns that date and edition

#### Scenario: Select a product edition `ghostmaps-002`

- **WHEN** a product contains editions
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

- **WHEN** the helper reads color text
- **THEN** the parser returns RGBA values for eight hexadecimal digits, or null for invalid text

#### Scenario: Wrap card text `ghostmaps-012`

- **WHEN** the helper formats card text
- **THEN** the helper splits words and marks text that exceeds the line limit

#### Scenario: Format field labels `ghostmaps-013`

- **WHEN** the helper formats a field label
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
- **THEN** the source returns the catalog with each product and its metadata

#### Scenario: Read local file bytes `ghostmaps-023`

- **WHEN** the local file response succeeds
- **THEN** the source requests a URL with encoded product and version values
- **AND** the source returns the bytes for each requested product and version

#### Scenario: Follow catalog events `ghostmaps-024`

- **WHEN** the event source sends catalog frames and state changes
- **THEN** the source accepts catalog data with product arrays and reports the connection state

### Requirement: KML data

The KML reader MUST return supported geometry and local style data.

Origin: backfill

#### Scenario: Read coordinates `ghostmaps-025`

- **WHEN** the parser reads coordinate text
- **THEN** the parser keeps finite positions within longitude and latitude bounds

#### Scenario: Read geometry `ghostmaps-026`

- **WHEN** the reader processes KML placemarks
- **THEN** the reader returns supported point, line and polygon data with the folder names
- **AND** the reader excludes placemarks with visibility text `0` and geometry types that it does not support
- **AND** the reader excludes points without a valid position
- **AND** the reader excludes lines with fewer than two valid positions
- **AND** the reader excludes polygon boundaries with fewer than three valid positions

#### Scenario: Resolve styles `ghostmaps-027`

- **WHEN** the reader processes placemark style data
- **THEN** the reader keeps shared properties and gives inline values precedence
- **AND** the reader uses the normal pair of each style map when that pair exists

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
- **THEN** the layer creates entities at the point, line, polygon and hole coordinates

#### Scenario: Store product choice `ghostmaps-031`

- **WHEN** the person changes a product chip
- **THEN** the layer stores the selected product ids

#### Scenario: Sync product data `ghostmaps-032`

- **WHEN** a catalog of active products changes a product version or removes a product
- **THEN** the layer requests each product whose version changes by its id and new version before it replaces that data source
- **AND** the layer removes an absent product

#### Scenario: Select report cards `ghostmaps-033`

- **WHEN** the person selects a loaded marker
- **THEN** the layer publishes a card with the report fields

#### Scenario: Report layer state `ghostmaps-034`

- **WHEN** the layer receives catalog or stream data
- **THEN** the layer reports product chips, totals and connection state

### Requirement: Application factory

The application factory MUST supply the standard layer hosts and accept caller options.

Origin: backfill

#### Scenario: Connect the application layer `ghostmaps-035`

- **WHEN** the application creates the GhostMaps layer
- **THEN** the factory returns the layer with the caller source

### Requirement: Local boundary checks

The local helpers MUST guard invalid input and report service state.

Origin: backfill

#### Scenario: Serve file responses `ghostmaps-036`

- **WHEN** a GET request names a current product
- **THEN** the proxy returns its bytes, version and cache headers

#### Scenario: Wait for the first catalog `ghostmaps-037`

- **WHEN** a GET request for `/catalog` or `/file/cip` arrives before the first catalog
- **THEN** the proxy waits for the first check before it returns the catalog or reads the file

#### Scenario: Report file errors `ghostmaps-038`

- **WHEN** the file method throws an error
- **THEN** the proxy returns HTTP 502 with the service error code

#### Scenario: Skip a destroyed response `ghostmaps-039`

- **WHEN** a request uses a destroyed response
- **THEN** the proxy does not write JSON to that response

#### Scenario: Install local routes `ghostmaps-040`

- **WHEN** the plugin configures the server or preview server
- **THEN** the plugin installs local routes and keeps the watcher stopped

#### Scenario: Reject invalid catalog responses `ghostmaps-041`

- **WHEN** a catalog response fails or lacks a products array
- **THEN** the source rejects the response with an error

#### Scenario: Reject failed file responses `ghostmaps-042`

- **WHEN** a file response returns an HTTP error
- **THEN** the source rejects the response with an error

#### Scenario: Reject an absent catalog source `ghostmaps-043`

- **WHEN** the caller supplies no catalog method
- **THEN** the layer constructor rejects the source

#### Scenario: Guard catalog updates `ghostmaps-044`

- **WHEN** an absent viewer, absent catalog or cancellation prevents the layer from an update
- **THEN** the layer does not mount new product data

#### Scenario: Read stored product choice `ghostmaps-045`

- **WHEN** the layer reads a stored choice or receives invalid storage data
- **THEN** the layer uses the stored ids or the default selection

#### Scenario: Guard card input `ghostmaps-046`

- **WHEN** a card host, viewer or valid feature is absent
- **THEN** the layer does not publish a new card

#### Scenario: Keep a plain card `ghostmaps-047`

- **WHEN** a selected feature lacks a source link or an external host
- **THEN** the layer publishes a card without an activation callback

#### Scenario: Report check errors `ghostmaps-048`

- **WHEN** a branch or tree check fails
- **THEN** the watcher reports the error without a new product catalog

#### Scenario: Report optional commit data `ghostmaps-049`

- **WHEN** the watcher reads optional commit metadata
- **THEN** the catalog holds the first message line or an empty value, and gives the parsed date or null

#### Scenario: Cull local point pins `ghostmaps-050`

- **WHEN** the layer loads a product with a camera position, or a frame follows a camera change
- **THEN** the layer hides far pins and shows near pins

#### Scenario: Reject absent KML data `ghostmaps-051`

- **WHEN** the reader receives an absent document
- **THEN** the reader returns no feature

#### Scenario: Set request credentials `ghostmaps-052`

- **WHEN** the watcher reads the branch and API data
- **THEN** the watcher sends the token only to the API when the token exists

#### Scenario: Report inactive stream data `ghostmaps-053`

- **WHEN** the event source is absent
- **THEN** the source reports a closed stream

#### Scenario: Close a selected card `ghostmaps-054`

- **WHEN** a person selects empty ground, selects an invalid marker or deactivates the selected product
- **THEN** the layer clears the selected card

#### Scenario: Keep the current card `ghostmaps-055`

- **WHEN** the pointer or another layer owns the input, or the person activates another product
- **THEN** the layer keeps the current card

#### Scenario: Open the first source link `ghostmaps-056`

- **WHEN** a selected report supplies source links and an external host
- **THEN** the card opens the first source link on activation

#### Scenario: Reject invalid disk data `ghostmaps-057`

- **WHEN** the disk catalog contains an invalid commit or products value
- **THEN** the watcher keeps its empty initial catalog

#### Scenario: Accept incomplete tree data `ghostmaps-058`

- **WHEN** the API marks a tree as truncated
- **THEN** the watcher records a warning and accepts the tree

#### Scenario: Report layer errors `ghostmaps-059`

- **WHEN** a file or catalog method fails
- **THEN** the layer reports the error text

#### Scenario: Keep image URLs until removal `ghostmaps-060`

- **WHEN** the layer loads a product with packed images and then disables the product
- **THEN** the layer keeps the images until it removes that product

#### Scenario: Report invalid KML files `ghostmaps-061`

- **WHEN** a KMZ contains no KML document
- **THEN** the layer reports a file error without a data source

#### Scenario: Read an absent edition name `ghostmaps-062`

- **WHEN** the edition name is absent
- **THEN** the parser returns a null date and edition zero

#### Scenario: Bound source links `ghostmaps-063`

- **WHEN** a report contains more than six valid source links
- **THEN** the parser keeps the first six links

#### Scenario: Limit event subscribers `ghostmaps-064`

- **WHEN** the event route already holds 64 subscribers
- **THEN** the proxy rejects the new subscriber with HTTP 429 without a subscription or heartbeat timer

#### Scenario: Keep one input handler `ghostmaps-065`

- **WHEN** the layer receives repeated enable calls
- **THEN** the layer keeps one input handler

#### Scenario: Read absent refs `ghostmaps-066`

- **WHEN** the branch advertisement is absent
- **THEN** the ref parser returns null

#### Scenario: Send the initial event catalog `ghostmaps-067`

- **WHEN** an event client subscribes before the first check completes
- **THEN** the proxy sends the current catalog before that check completes

### Requirement: Catalog request input

The browser layer MUST set a supplied caller signal on the catalog request options object itself.

Origin: backfill

#### Scenario: Pass a caller signal `ghostmaps-068`

- **WHEN** a caller supplies a signal for a catalog update
- **THEN** the layer sets that signal on the request options object itself
