## REMOVED Requirements

### Requirement: Browser layer
**Reason**: Upstream moved the GhostMaps layer to the renderer ports. The fork tests of this requirement used the old Cesium objects, and they fail against the merged code. The merge takes the upstream tests of the layer. This change retires the scenarios `ghostmaps-029`, `ghostmaps-030`, `ghostmaps-031`, `ghostmaps-032`, `ghostmaps-033`, `ghostmaps-034`.
**Migration**: None.

### Requirement: Catalog request input
**Reason**: Upstream moved the GhostMaps layer to the renderer ports. The fork tests of this requirement used the old Cesium objects, and they fail against the merged code. The merge takes the upstream tests of the layer. This change retires the scenario `ghostmaps-068`.
**Migration**: None.

## MODIFIED Requirements

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

#### Scenario: Report check errors `ghostmaps-048`

- **WHEN** a branch or tree check fails
- **THEN** the watcher reports the error without a new product catalog

#### Scenario: Report optional commit data `ghostmaps-049`

- **WHEN** the watcher reads optional commit metadata
- **THEN** the catalog holds the first message line or an empty value, and gives the parsed date or null

#### Scenario: Reject absent KML data `ghostmaps-051`

- **WHEN** the reader receives an absent document
- **THEN** the reader returns no feature

#### Scenario: Set request credentials `ghostmaps-052`

- **WHEN** the watcher reads the branch and API data
- **THEN** the watcher sends the token only to the API when the token exists

#### Scenario: Report inactive stream data `ghostmaps-053`

- **WHEN** the event source is absent
- **THEN** the source reports a closed stream

#### Scenario: Reject invalid disk data `ghostmaps-057`

- **WHEN** the disk catalog contains an invalid commit or products value
- **THEN** the watcher keeps its empty initial catalog

#### Scenario: Accept incomplete tree data `ghostmaps-058`

- **WHEN** the API marks a tree as truncated
- **THEN** the watcher records a warning and accepts the tree

#### Scenario: Read an absent edition name `ghostmaps-062`

- **WHEN** the edition name is absent
- **THEN** the parser returns a null date and edition zero

#### Scenario: Bound source links `ghostmaps-063`

- **WHEN** a report contains more than six valid source links
- **THEN** the parser keeps the first six links

#### Scenario: Limit event subscribers `ghostmaps-064`

- **WHEN** the event route already holds 64 subscribers
- **THEN** the proxy rejects the new subscriber with HTTP 429 without a subscription or heartbeat timer

#### Scenario: Read absent refs `ghostmaps-066`

- **WHEN** the branch advertisement is absent
- **THEN** the ref parser returns null

#### Scenario: Send the initial event catalog `ghostmaps-067`

- **WHEN** an event client subscribes before the first check completes
- **THEN** the proxy sends the current catalog before that check completes
