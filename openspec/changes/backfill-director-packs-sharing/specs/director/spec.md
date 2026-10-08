# Director data packs and shares

HTTP means Hypertext Transfer Protocol.
HTTPS means HTTP with a secure connection.

## ADDED Requirements

### Requirement: Data pack manifests

The data pack validators MUST accept valid declarations and reject invalid declarations.

Origin: backfill

#### Scenario: Asset paths `director-076`

- **WHEN** a caller supplies a relative asset path
- **THEN** the validator accepts safe directory names and rejects traversal or URL syntax
- **AND** The validator accepts paths of at most 1024 characters and rejects longer paths.

#### Scenario: Data pack formats `director-077`

- **WHEN** a caller supplies a data pack manifest
- **THEN** the validator accepts version 1 and the geojson, image and media formats
- **AND** The validator rejects other versions and formats.
- **AND** The data pack ID and source name each accept at most 256 characters.

#### Scenario: Data pack attribution `director-078`

- **WHEN** a data pack declares attribution
- **THEN** the validator checks text, license and an optional HTTPS link without credentials, query or fragment
- **AND** Text and license each accept at most 4096 characters; the HTTPS link accepts at most 2048 characters.

#### Scenario: Data pack integrity fields `director-079`

- **WHEN** a data pack declares byteLength or sha256
- **THEN** the validator checks a positive integer up to 8388608 bytes and a lowercase hexadecimal digest of 64 characters
- **AND** The validator rejects 63-character, 65-character and uppercase digests, and accepts exactly 64 lowercase hexadecimal characters.

#### Scenario: Image placement `director-080`

- **WHEN** an image data pack declares placement
- **THEN** the validator checks geographic bounds, ordered edges, height and the ellipsoid reference
- **AND** The validator rejects equal west and east edges, and equal south and north edges.
- **AND** The validator accepts longitude limits of -180 and 180 degrees, and latitude limits of -90 and 90 degrees.
- **AND** The validator rejects numeric text for bounds and height.

#### Scenario: Media placement `director-081`

- **WHEN** a media data pack declares placement
- **THEN** the validator checks its scene anchor reference

#### Scenario: Scene data pack references `director-082`

- **WHEN** a scene declares data packs or data pack IDs for a shot
- **THEN** the validator rejects duplicate data pack IDs, unknown shot references and duplicate shot references
- **AND** The validator ignores a data pack list from the parent object of the scene.
- **AND** The validator accepts eight distinct data packs per scene and rejects nine.

### Requirement: Data pack geometry

The geometry decoder MUST return IDs, geometry types and coordinates without feature properties.

Origin: backfill

#### Scenario: GeoJSON collections `director-083`

- **WHEN** a caller decodes GeoJSON
- **THEN** the decoder checks a FeatureCollection with an array of at most 2000 features
- **AND** The decoder rejects invalid UTF8 bytes and null.

#### Scenario: GeoJSON feature IDs `director-084`

- **WHEN** a collection contains features
- **THEN** the decoder checks Feature types and distinct nonblank string IDs of at most 256 characters
- **AND** The decoder rejects a null feature with the feature ID error.

#### Scenario: Geographic positions `director-085`

- **WHEN** a geometry supplies positions without inherited coordinate values
- **THEN** the decoder checks finite longitude, latitude and height within geographic limits
- **AND** The decoder accepts at most 50000 positions and gives zero meters for an absent height.
- **AND** Each position has two or three coordinates; the decoder rejects one or four coordinates.
- **AND** The decoder accepts longitude from -180 to 180 degrees and latitude from -90 to 90 degrees.

#### Scenario: Lines and rings `director-086`

- **WHEN** a geometry supplies a line or ring
- **THEN** the decoder checks minimum lengths and closed rings

#### Scenario: Geometry output `director-087`

- **WHEN** a collection contains geometry
- **THEN** the decoder returns IDs, geometry types and coordinates without properties
- **AND** The decoder rejects unsupported or absent geometry and accepts at most 128 polygon rings.

### Requirement: Data data pack sessions

The data pack session MUST load valid assets and dispose its resources when the caller clears or destroys it.

Origin: backfill

#### Scenario: Session admission `director-088`

- **WHEN** a caller creates a session
- **THEN** the session starts with the idle state and its load method checks data pack lists before asset work
- **AND** The load method accepts at most eight data packs and checks every declaration before the first source call.
- **AND** The load method returns false for a destroyed session or a cancelled signal.

#### Scenario: Session resources `director-089`

- **WHEN** a session loads assets
- **THEN** after success, the session reports the ready state and disposes its handles when the caller clears or destroys it
- **AND** The session rejects a null handle or a handle without a dispose function.
- **AND** During asset work, the session reports the loading state.
- **AND** A change to a returned state object does not change the session state.
- **AND** The session removes the deadline timer after success.
- **AND** The session also removes that timer after the caller clears the session.

- **AND** The session removes source listeners after success or a source error.

#### Scenario: Session cancellation `director-090`

- **WHEN** a caller cancels asset work that is not complete
- **THEN** the session returns false and disposes late renderer resources

#### Scenario: Session replacement `director-091`

- **WHEN** a caller replaces asset work that is not complete
- **THEN** the old load call returns false and does not change the new resources

#### Scenario: Session errors `director-092`

- **WHEN** a source fails or the asset deadline expires
- **THEN** the session removes partial resources and reports a stable error
- **AND** With no registered source and a byteLength field in the declaration, the load method reads that field once, during validation
- **AND** The default deadline is 15000 milliseconds.
- **AND** With no renderer, the load method does not call the registered source.
- **AND** The session disposes each partial resource when the deadline expires.

#### Scenario: Session asset checks `director-093`

- **WHEN** a source returns bytes for a data pack
- **THEN** the session checks byte type, size, total bytes and declared integrity before the renderer call
- **AND** The session accepts up to 8388608 bytes per asset and up to 33554432 total bytes.
- **AND** The source receives the source path and the byteLength field or the default byte limit.
- **AND** The renderer receives the asset and the signal of the source call.
- **AND** The renderer also receives the data pack and the scene anchors.

### Requirement: Asset sources

The directory source MUST use its directory URL and reject bytes above the asset limit.

Origin: backfill

#### Scenario: Asset directory configuration `director-094`

- **WHEN** a caller registers an asset directory
- **THEN** the source checks an HTTP or HTTPS directory without credentials, query or fragment
- **AND** The directory URL ends with a slash.

#### Scenario: Asset request options `director-095`

- **WHEN** a caller asks for a safe asset path
- **THEN** the source uses the registered directory and fixed request options: no credentials, redirects as errors, no referrer, no cache
- **AND** Without a caller fetch function, the directory source uses the global fetch function.

#### Scenario: Asset stream limits `director-096`

- **WHEN** a source reads an asset stream
- **THEN** the source checks header and stream byte limits and joins its chunks
- **AND** The source removes media type parameters and space, and changes the media type to lowercase text.
- **AND** An absent media type gives empty text.

#### Scenario: Asset source cleanup `director-097`

- **WHEN** an asset request fails or its signal stops it
- **THEN** the source rejects the asset request and releases stream resources

### Requirement: Scene bundles

The bundle helpers MUST check supplied assets and keep the source project.

Origin: backfill

#### Scenario: Share text admission `director-098`

- **WHEN** a caller supplies project share text
- **THEN** the bundle helpers check text type, byte limits and JSON syntax
- **AND** The bundle helpers reject null and invalid projects.
- **AND** The text limit is 52428800 characters and 52428800 UTF8 bytes.

#### Scenario: Bundle asset entries `director-099`

- **WHEN** a caller supplies bundle assets
- **THEN** the bundle helpers check fields, paths, media types, distinct paths and base64 syntax
- **AND** The bundle helpers accept at most 64 assets and reject 65 different paths.
- **AND** The bundle helpers accept up to 8388608 bytes per asset and up to 33554432 total bytes.
- **AND** The base64 length limit is 11184812 characters.
- **AND** The bundle helpers reject a bundle version other than 1.
- **AND** The bundle helpers reject extra top-level fields and invalid bundle projects.

#### Scenario: Bundle asset references `director-100`

- **WHEN** a bundle declares data pack assets
- **THEN** the bundle helpers check asset digests and exact data pack references

#### Scenario: Bundle export copy `director-101`

- **WHEN** a caller exports a project with supplied assets
- **THEN** the bundle helpers copy the project and write bundle paths, byte lengths and digests
- **AND** The bundle helpers reject an invalid project before the resolver call.
- **AND** The resolver receives the data pack and the signal in its options object.


#### Scenario: Bundle export limits `director-102`

- **WHEN** a caller supplies assets for bundle export
- **THEN** the bundle helpers check byte limits, media types, asset totals and declared integrity
- **AND** The bundle helpers accept up to 8388608 bytes per asset and up to 33554432 total bytes.
- **AND** The bundle helpers reject an unsupported media type during export.

#### Scenario: Shared asset reuse `director-103`

- **WHEN** data packs use the same source and path
- **THEN** the bundle helpers write one asset and reject integrity declarations that differ

### Requirement: Bundle byte store

The byte store MUST copy the asset map and return byte copies.

Origin: backfill

#### Scenario: Bundle byte ownership `director-104`

- **WHEN** a caller replaces or clears bundle bytes
- **THEN** the store copies the map and reports its current byte total

#### Scenario: Bundle byte access `director-105`

- **WHEN** a caller asks for stored bundle bytes
- **THEN** the store returns a byte copy and rejects absent or excess bytes and a cancelled source call
- **AND** The store accepts bytes equal to the caller limit and rejects one more byte.

### Requirement: Share work

The share helpers MUST check file budgets and settle signal cancellation.

Origin: backfill

#### Scenario: Share file budgets `director-106`

- **WHEN** a caller supplies a project file
- **THEN** the share helpers check the file suffix and size before text access
- **AND** The file limit is 5242880 bytes, or 52428800 bytes for a name with the .gevbundle.json suffix.
- **AND** The share helpers accept the limit and reject one more byte.

#### Scenario: Share work cancellation `director-107`

- **WHEN** share work uses a signal
- **THEN** the helper rejects cancelled work and settles successful work or errors
- **AND** The bundle helpers check the signal before each asset and after each digest during import and export.
- **AND** During export, the bundle helpers also check the signal after the asset result.

- **AND** The share helpers remove their listener after success, a work error or cancellation.

### Requirement: Share preview

The preview MUST report project content and dependencies.

Origin: backfill

#### Scenario: Preview totals `director-108`

- **WHEN** a caller describes a shared project
- **THEN** the preview reports scene, shot and byte totals with data pack attribution

#### Scenario: Preview source states `director-109`

- **WHEN** a preview describes a data pack source
- **THEN** the preview reports included, absent, configured or unavailable source states

#### Scenario: Preview dependencies `director-110`

- **WHEN** a preview describes scene dependencies
- **THEN** the preview reports absent layers and whether a scene has applied shot packs or a shot has a source pack ID
- **AND** The preview lists each absent layer once, even when two shots name that layer.
