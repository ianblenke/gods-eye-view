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
- **AND** The validator accepts _ and - at the start of each path segment and returns without an error.
- **AND** The validator returns without an error for letters A to Z and a to z, and digits 0 to 9.
- **AND** The validator accepts those characters at the start and in other positions and returns without an error.
- **AND** The validator names the path field in each asset path error.
- **AND** The validator rejects the path type before it reads a segment.
- **AND** The validator checks the source name, the path and the attribution fields in that order and rejects an invalid value.
- **AND** The validator rejects an invalid second path segment.

#### Scenario: Data pack formats `director-077`

- **WHEN** a caller supplies a data pack manifest
- **THEN** the validator accepts version 1 and the geojson, image and media formats and returns without an error.
- **AND** The validator rejects other versions and formats.
- **AND** The validator rejects a data pack ID or source name above 256 characters.
- **AND** The validator rejects extra fields and names each invalid field in its error.
- **AND** The validator checks declaration fields, ID, version, format and source in that order and rejects an invalid value.
- **AND** The validator checks the declaration before it checks for duplicate IDs and rejects an invalid value.
- **AND** The validator rejects the unlisted format geojsonx.
- **AND** The validator rejects an invalid second data pack declaration.

#### Scenario: Data pack attribution `director-078`

- **WHEN** a data pack declares attribution
- **THEN** the validator checks text, license and an optional HTTPS link without credentials, query or fragment and rejects an invalid value.
- **AND** The validator rejects text or license above 4096 characters, or an HTTPS link above 2048 characters.
- **AND** The validator names each invalid attribution field and rejects extra attribution fields.
- **AND** The validator checks text, license, URL and byteLength in that order and rejects an invalid value.

#### Scenario: Data pack integrity fields `director-079`

- **WHEN** a data pack declares byteLength or sha256
- **THEN** the validator checks a positive integer up to 8388608 bytes and a lowercase hexadecimal digest of 64 characters and rejects an invalid value.
- **AND** The validator rejects 63-character, 65-character and uppercase digests, and accepts exactly 64 lowercase hexadecimal characters.
- **AND** The validator accepts each digit from 0 to 9 and each letter from a to f in the digest and returns without an error.
- **AND** The validator names the field in each integrity error.
- **AND** The validator checks the digest type before it converts text and rejects an invalid value.
- **AND** The validator checks byteLength before the digest, and the digest before it reads the placement.

#### Scenario: Image placement `director-080`

- **WHEN** an image data pack declares placement
- **THEN** the validator checks geographic bounds, ordered edges, height and the ellipsoid reference and rejects an invalid value.
- **AND** The validator rejects equal west and east edges, and equal south and north edges.
- **AND** The validator accepts longitude limits of -180 and 180 degrees, and latitude limits of -90 and 90 degrees and returns without an error.
- **AND** The validator rejects numeric text for bounds and height.
- **AND** Each placement error names its field, and the validator rejects extra image placement fields.
- **AND** The validator compares west with east before it compares south with north.
- **AND** The validator checks bounds values, edge order and height in that order and rejects an invalid value.
- **AND** The validator checks the height reference before it checks bounds and rejects an invalid value.
- **AND** The validator checks the bounds array before it reads the length. It checks the length before it checks each coordinate.
- **AND** The validator checks each bounds coordinate, with its index in the error path and rejects an invalid value.

#### Scenario: Media placement `director-081`

- **WHEN** a media data pack declares placement
- **THEN** the validator checks its scene anchor reference and rejects an invalid value.
- **AND** The validator names the placement field in each unknown anchor error.
- **AND** The validator accepts a reference to the second scene anchor and returns without an error.

#### Scenario: Scene data pack references `director-082`

- **WHEN** a scene declares data packs or data pack IDs for a shot
- **THEN** the validator rejects duplicate data pack IDs, unknown shot references and duplicate shot references
- **AND** The validator does not read a data pack list from the parent object of the scene and returns without an error.
- **AND** The validator accepts eight distinct data packs per scene and rejects nine.
- **AND** The validator accepts eight distinct data pack references per shot and rejects nine references before it checks distinct IDs.
- **AND** The validator names the shot field in each reference error.
- **AND** The validator rejects duplicate references before it searches for known IDs.
- **AND** The validator checks the data pack list before it reads the anchors.
- **AND** The validator rejects an unknown reference in the second shot.
- **AND** The validator reports `$.shots[1].dataPackIds` and says expected distinct scene pack IDs for that error.
- **AND** The validator rejects an unknown second reference ID.

### Requirement: Data pack geometry

The geometry decoder MUST return IDs, geometry types and coordinates without feature properties.

Origin: backfill

#### Scenario: GeoJSON collections `director-083`

- **WHEN** a caller decodes GeoJSON
- **THEN** the decoder rejects a type other than FeatureCollection, a feature list that is not an array or more than 2000 features
- **AND** The decoder rejects invalid UTF8 bytes and null.

#### Scenario: GeoJSON feature IDs `director-084`

- **WHEN** a collection contains features
- **THEN** the decoder rejects a type other than Feature, duplicate or blank IDs, IDs that are not strings and IDs above 256 characters
- **AND** The decoder rejects a null feature with the feature ID error.
- **AND** The decoder rejects a duplicate ID in the second feature.

#### Scenario: Geographic positions `director-085`

- **WHEN** a geometry supplies positions without inherited coordinate values
- **THEN** the decoder rejects longitude, latitude or height that is not finite or exceeds geographic limits
- **AND** The decoder accepts at most 50000 positions and gives zero meters for an absent height.
- **AND** Each position has two or three coordinates; the decoder rejects one or four coordinates.
- **AND** The decoder accepts longitude from -180 to 180 degrees and latitude from -90 to 90 degrees and returns coordinates.
- **AND** The decoder rejects a null position with the geographic position error.
- **AND** The decoder keeps negative zero for a supplied height.
- **AND** The decoder rejects an invalid second coordinate and an invalid second line position.

#### Scenario: Lines and rings `director-086`

- **WHEN** a geometry supplies a line or ring
- **THEN** the decoder rejects short lines, short rings and rings with unequal end positions
- **AND** The decoder rejects a null line with the line error.
- **AND** The decoder returns an open line with unequal end positions.

#### Scenario: Geometry output `director-087`

- **WHEN** a collection contains geometry
- **THEN** the decoder returns IDs, geometry types and coordinates without properties
- **AND** The decoder rejects unsupported or absent geometry and accepts at most 128 polygon rings.
- **AND** The decoder rejects an unclosed second polygon ring.

### Requirement: Data pack sessions

The data pack session MUST load valid assets and dispose its resources when the caller clears or destroys it.

Origin: backfill

#### Scenario: Session admission `director-088`

- **WHEN** a caller creates a session
- **THEN** the session starts with the idle state. Its load method checks data pack lists before asset work and rejects an invalid data pack list.
- **AND** The session rejects more than eight data packs and checks every declaration before the first source call.
- **AND** The load call returns false for a destroyed session or a cancelled signal.
- **AND** The public data pack limits throw a TypeError when a caller assigns a new value.
- **AND** After the caller destroys the session, a new load call does not read the caller signal state.
- **AND** An empty data pack list returns true without a source call or a deadline timer.
- **AND** An absent source map or renderer map gives an empty registry.
- **AND** The session reads source entries before renderer entries.
- **AND** The session calls each source by `pack.source.adapter` and each renderer by `pack.format`. The source map and the renderer map each contain two entries.
- **AND** The session checks the data pack list before it reads anchors. It checks declarations before it reads the caller signal.
- **AND** During source cancellation, a destroyed session returns false for another load call.
- **AND** An invalid second declaration gives its indexed error before the source call.

#### Scenario: Session resources `director-089`

- **WHEN** a session loads assets
- **THEN** after success, the session reports the ready state and disposes its handles when the caller clears or destroys it
- **AND** The session rejects a null handle or a handle without a dispose function.
- **AND** During asset work, the session reports the loading state.
- **AND** The session keeps its state after the caller changes a returned state object.
- **AND** The session removes the deadline timer after success.
- **AND** The session also removes that timer after the caller clears the session.

- **AND** The session removes source listeners after success or a source error.
- **AND** The session does not read the signal reason for a completed source listener after success or a source error.
- **AND** The session removes the caller signal listener when the caller clears it.
- **AND** The session installs that listener with the once option set to true.
- **AND** The session attaches the source listener, checks the source signal state and reads the work promise in that order.
- **AND** The session does not read the signal reason for a completed source when the promise settles.
- **AND** The session attaches the caller listener before the deadline timer starts.
- **AND** The session checks the signal before it removes the timer. It removes the timer before it reports the ready state.
- **AND** The session reports idle before source cancellation.
- **AND** The session cancels the source, removes the caller listener, removes the timer and disposes resources in that order.

#### Scenario: Session cancellation `director-090`

- **WHEN** a caller cancels asset work, or source or renderer work fails
- **THEN** for cancellation, the session returns false and disposes late renderer resources
- **AND** The session checks its source signal before it reads bytes and after renderer work.
- **AND** The session does not read the caller signal state again for a cleared load call after cancellation.
- **AND** The session rejects source errors before the renderer call and rejects null bytes or a null renderer handle.
- **AND** After the caller clears the session, the session does not read the old source signal state and returns false.
- **AND** The session returns false when the caller signal destroys the session after a source error.
- **AND** The session returns false for a caller event during listener registration.

#### Scenario: Session replacement `director-091`

- **WHEN** a caller starts a new load call
- **THEN** the session returns false for old work that is not complete and keeps the new resources
- **AND** The session disposes old resources before it checks the new data pack list and rejects an invalid data pack list.

#### Scenario: Session errors `director-092`

- **WHEN** a source fails, a source signal event stops work, or the asset deadline expires
- **THEN** the session removes partial resources and reports a stable error
- **AND** With no registered source and a byteLength field in the declaration, the session reads that field once, during validation
- **AND** The session sets a default deadline of 15000 milliseconds.
- **AND** The session sets the source signal reason to Asset load timed out when the deadline expires.
- **AND** With no renderer, the session does not call the registered source.
- **AND** The session disposes each partial resource when the deadline expires.
- **AND** The session rejects the load call before the renderer call for a source signal event.
- **AND** The session reads the source signal reason once when a source signal event stops work.
- **AND** The session rejects the load call before the renderer call for a source signal event during listener removal after source success or an error.
- **AND** The session does not read the global `error` property for a data pack failure.

#### Scenario: Session asset checks `director-093`

- **WHEN** a source returns bytes for a data pack
- **THEN** the session checks byte type, size, total bytes and declared integrity before the renderer call and rejects an invalid asset.
- **AND** The session accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns true.
- **AND** The source receives the source path and the byteLength field or the default byte limit.
- **AND** The renderer receives the asset and the signal of the source call.
- **AND** The renderer also receives the data pack and the scene anchors.
- **AND** The session checks the byte type before it reads the length of an invalid byte object.
- **AND** With null bytes, the session does not read the declared byteLength field again.
- **AND** Without a declared byteLength field, the session does not compare bytes with that field.
- **AND** The session checks total bytes before it reads the declared digest.
- **AND** The session accepts a data pack that refers to the second supplied anchor and returns true.

### Requirement: Asset sources

The directory source MUST use its directory URL and reject bytes above the asset limit.

Origin: backfill

#### Scenario: Asset directory configuration `director-094`

- **WHEN** a caller registers an asset directory
- **THEN** the factory rejects a directory outside HTTP or HTTPS, or with credentials, query or fragment
- **AND** The factory rejects a directory URL without a slash at the end.
- **AND** The factory rejects a directory URL that uses the file protocol.

#### Scenario: Asset request options `director-095`

- **WHEN** a caller asks for an asset path
- **THEN** the source checks the path before it checks the caller signal and rejects an invalid path.
- **AND** For a safe path, the source calls fetch with the registered directory and fixed request options.
- **AND** The source calls fetch with no credentials, redirects as errors, no referrer and no cache.
- **AND** Without a caller fetch function, the source calls the global fetch function.

#### Scenario: Asset stream limits `director-096`

- **WHEN** a source reads an asset stream
- **THEN** the source checks header and stream byte limits and joins its chunks
- **AND** The source removes media type parameters and space, and changes the media type to lowercase text.
- **AND** The source returns empty text for an absent media type.
- **AND** The source joins chunks of different byte lengths in their original order.
- **AND** The source checks the header byte limit before it reads the first stream chunk.
- **AND** The source checks the stream byte limit before it keeps a chunk.

#### Scenario: Asset source disposal `director-097`

- **WHEN** an asset request fails or its signal stops it
- **THEN** the source rejects the asset request and releases stream resources
- **AND** The source waits for stream cancellation before it releases the reader lock.
- **AND** For an HTTP error, the source waits for body cancellation before it rejects the asset request.
- **AND** The source checks its signal before each time the source reads a stream chunk and rejects cancellation.
- **AND** With two stream chunks, cancellation before the second chunk stops the source, and the source reads only the first chunk.


### Requirement: Scene bundles

The bundle helpers MUST check supplied assets and keep the source project.

Origin: backfill

#### Scenario: Share text admission `director-098`

- **WHEN** a caller supplies project share text
- **THEN** the import rejects invalid text type, excess bytes and invalid JSON syntax
- **AND** The import rejects null and invalid projects.
- **AND** The import rejects text above 52428800 characters or 52428800 UTF8 bytes.
- **AND** The import reports `$: invalid JSON` for invalid JSON within the share text limit.
- **AND** For project JSON without bundle format, the import returns the project and an empty asset Map.

#### Scenario: Bundle asset entries `director-099`

- **WHEN** a caller supplies bundle assets
- **THEN** the import rejects invalid fields, paths, media types, duplicate paths and invalid base64 syntax
- **AND** The import accepts at most 64 assets and returns assets. The import rejects 65 different paths.
- **AND** The import accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns assets.
- **AND** The import rejects base64 above 11184812 characters.
- **AND** The import rejects a bundle version other than 1.
- **AND** The import rejects extra top-level fields and invalid bundle projects.
- **AND** The import starts asset field, count, byte, media type, base64 and digest errors with `assets`.
- **AND** The import starts each asset path error with `source.path`.
- **AND** The import accepts the standard base64 alphabet, with + and /, and returns assets. The import rejects an equals sign at the start.
- **AND** The import accepts each standard base64 character in both plain and padded text and returns assets.
- **AND** The import checks the base64 type before it converts text and rejects an invalid asset.
- **AND** The import checks top-level fields, version, project and the asset list in that order and rejects an invalid bundle.
- **AND** The import checks asset fields, path, media type, duplicate path and base64 in that order and rejects an invalid asset.
- **AND** The import checks asset byte limits before the digest call and rejects an invalid asset.
- **AND** The import accepts these media types and returns assets: application/json, application/geo+json, image/png, video/mp4, video/webm, audio/mpeg, audio/ogg, audio/wav and audio/webm.
- **AND** The import rejects image/svg+xml.

#### Scenario: Bundle asset references `director-100`

- **WHEN** a bundle declares data pack assets
- **THEN** the import rejects incorrect asset digests and incorrect data pack references
- **AND** The import starts each data pack reference error with `project`.

#### Scenario: Bundle export copy `director-101`

- **WHEN** a caller exports a project with supplied assets
- **THEN** the export copies the project and writes bundle paths, byte lengths and digests
- **AND** The export rejects an invalid project before the resolver call.
- **AND** The export calls the resolver with the data pack and the signal in its options object.
- **AND** The export writes a path with at most 160 characters from the source filename.
- **AND** The export writes each path with files/, the asset index from zero, and a dash before the filename.
- **AND** The export writes source, byteLength and digest fields in that order.
- **AND** The export does not read byte chunks past the asset end.
- **AND** The export calls the filename slice with a start of zero and a length limit of 160.
- **AND** The export writes assets for data packs from the second scene.

#### Scenario: Bundle export limits `director-102`

- **WHEN** a caller supplies assets for bundle export
- **THEN** the export rejects excess bytes, unsupported media types, excess assets and incorrect declared integrity
- **AND** The export accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns bundle text.
- **AND** The export rejects an unsupported media type during export.
- **AND** The share limits throw a TypeError when a caller assigns a new value.
- **AND** The export starts each asset error with `assets`.
- **AND** The export checks byte type and per-asset size before the total size and rejects an invalid asset.
- **AND** The export checks declared byteLength before the declared digest and rejects an invalid asset.
- **AND** For numeric byte lengths, the export adds zero to the total for an asset without a byte length.
- **AND** When the declared digest is absent, the export reads the digest field once before it writes the digest.
- **AND** The export starts each text limit error with `$`.
- **AND** The export checks declared integrity before it reads the filename.
- **AND** The export checks the asset count before the next resolver call and rejects more than 64 assets.
- **AND** The export checks bytes before media type, and media type before the digest call and rejects an invalid asset.

#### Scenario: Shared asset reuse `director-103`

- **WHEN** data packs use the same source and path
- **THEN** the export writes one asset and rejects integrity declarations that differ
- **AND** The export starts each shared asset integrity error with `assets`.

### Requirement: Bundle byte store

The byte store MUST copy the asset map and return byte copies.

Origin: backfill

#### Scenario: Bundle byte ownership `director-104`

- **WHEN** a caller replaces or clears bundle bytes
- **THEN** the store copies the map and reports its current byte total
- **AND** With no replacement map, the store reports zero assets and zero bytes.
- **AND** The store returns a separate snapshot map with the stored keys and byte values.
- **AND** The store counts the bytes of the second stored asset.

#### Scenario: Bundle asset bytes `director-105`

- **WHEN** a caller asks for stored bundle bytes
- **THEN** the store returns a byte copy and rejects absent or excess bytes and a cancelled source call
- **AND** The store accepts bytes equal to the caller limit and rejects one more byte.
- **AND** Without a caller limit, the store accepts an asset of 8388608 bytes and returns a byte copy.
- **AND** The store rejects an invalid path even when the store holds that path.
- **AND** The store checks its signal before it checks the path and rejects cancellation.

### Requirement: Share work

The share helpers MUST check file limits and settle signal cancellation.

Origin: backfill

#### Scenario: Share file limits `director-106`

- **WHEN** a caller supplies a project file
- **THEN** the share helpers check the file suffix and size before they read text
- **AND** The share helpers reject a file above 5242880 bytes, except a file with the .gevbundle.json suffix. They reject that file above 52428800 bytes.
- **AND** The share helpers accept the limit and reject one more byte.
- **AND** The share helpers check the file limit before they read the signal and reject excess files.

#### Scenario: Share work cancellation `director-107`

- **WHEN** share work uses a signal
- **THEN** the helper rejects cancelled work and settles successful work or errors
- **AND** The bundle helpers check the signal before each asset and after each digest during import and export. They reject cancellation.
- **AND** During export, the bundle helpers also check the signal after the asset result and reject cancellation.

- **AND** The helper removes its listener after success, a work error or cancellation.
- **AND** The import checks the signal before text type, asset fields and digest comparison and rejects cancellation.
- **AND** The share helpers check the signal before they read text and after the text promise settles. They reject cancellation.
- **AND** During export, the bundle helpers check the signal before they check asset presence and declared integrity and reject cancellation.
- **AND** The helper does not attach a listener to a cancelled signal.
- **AND** The helper attaches its listener before it reads the work promise.
- **AND** The helper reads cancelled work before the reason, and removes its listener before it reads the reason.
- **AND** The helper checks cancellation after listener removal and before the work settles with success.
- **AND** For cancellation during listener removal after a work error, the helper rejects with the cancellation reason.
- **AND** With two assets, the import calls the digest function once when cancellation occurs before the second digest call.
- **AND** With two data packs, the export calls the resolver once when cancellation occurs before the second resolver call.

### Requirement: Share preview

The preview MUST report project content and dependencies.

Origin: backfill

#### Scenario: Preview totals `director-108`

- **WHEN** a caller describes a shared project
- **THEN** the preview reports scene, shot and byte totals with data pack attribution
- **AND** The preview counts the second scene and the second shot, and lists the second data pack. The preview adds the bytes of the second asset to the byte total.

#### Scenario: Preview source states `director-109`

- **WHEN** a preview describes a data pack source
- **THEN** the preview reports included, absent, configured or unavailable source states
- **AND** Without source IDs, the preview reports every external source as unavailable.

#### Scenario: Preview dependencies `director-110`

- **WHEN** a preview describes scene dependencies
- **THEN** the preview reports absent layers and whether a scene has applied shot packs or a shot has a source pack ID
- **AND** The preview lists each absent layer once, even when two shots name that layer.
- **AND** Without layer IDs, the preview reports every named layer as absent.
- **AND** With applied shot packs, the preview does not read source pack IDs to decide whether the scene has external content.
- **AND** The preview reports the absent layers of the second shot in the second scene. It reports external content from the source pack ID of that shot.
