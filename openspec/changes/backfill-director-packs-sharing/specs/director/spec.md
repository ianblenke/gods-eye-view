# Director data packs and shares

## ADDED Requirements

### Requirement: Pack manifests

The pack validators MUST check declarations before asset access.

Origin: backfill

#### Scenario: Asset paths `director-076`

- **WHEN** a caller supplies a relative asset path
- **THEN** the validator accepts safe directory names and rejects traversal or URL syntax

#### Scenario: Pack formats `director-077`

- **WHEN** a caller supplies a pack manifest
- **THEN** the validator accepts version 1 and the geojson, image and media formats

#### Scenario: Pack attribution `director-078`

- **WHEN** a pack declares attribution
- **THEN** the validator checks text, license and an optional HTTPS link without credentials, query or fragment

#### Scenario: Pack integrity fields `director-079`

- **WHEN** a pack declares byteLength or sha256
- **THEN** the validator checks a positive integer through 8388608 and a lowercase hexadecimal digest of 64 characters

#### Scenario: Image placement `director-080`

- **WHEN** an image pack declares placement
- **THEN** the validator checks geographic bounds, ordered edges, height and the ellipsoid reference

#### Scenario: Media placement `director-081`

- **WHEN** a media pack declares placement
- **THEN** the validator checks its scene anchor reference

#### Scenario: Scene pack references `director-082`

- **WHEN** a scene declares packs or shot pack IDs
- **THEN** the validator rejects duplicate pack IDs, unknown shot references and duplicate shot references

### Requirement: Pack geometry

The geometry decoder MUST check bounded geometry and return inert coordinates.

Origin: backfill

#### Scenario: GeoJSON collections `director-083`

- **WHEN** a caller decodes GeoJSON
- **THEN** the decoder checks a FeatureCollection with an array of at most 2000 features

#### Scenario: GeoJSON feature IDs `director-084`

- **WHEN** a collection contains features
- **THEN** the decoder checks Feature types and distinct nonblank string IDs of at most 256 characters

#### Scenario: Geographic positions `director-085`

- **WHEN** a geometry supplies positions without inherited coordinate values
- **THEN** the decoder checks finite longitude, latitude and height within geographic limits

#### Scenario: Lines and rings `director-086`

- **WHEN** a geometry supplies a line or ring
- **THEN** the decoder checks minimum lengths and closed rings

#### Scenario: Geometry output `director-087`

- **WHEN** a collection contains supported geometry
- **THEN** the decoder returns IDs, geometry types and coordinates without properties

### Requirement: Pack sessions

The pack session MUST own asset work and disposable resources.

Origin: backfill

#### Scenario: Session admission `director-088`

- **WHEN** a caller creates a session
- **THEN** the session starts with idle state and its load method checks pack lists before asset work

#### Scenario: Session resources `director-089`

- **WHEN** a session completes asset work
- **THEN** the session reports ready state and disposes its handles when the caller clears or destroys it

#### Scenario: Session cancellation `director-090`

- **WHEN** a caller cancels pending asset work
- **THEN** the session returns false and disposes late adapter resources

#### Scenario: Session replacement `director-091`

- **WHEN** a caller replaces pending asset work
- **THEN** the old request returns false and leaves the new resources intact

#### Scenario: Session errors `director-092`

- **WHEN** a source fails or the asset deadline expires
- **THEN** the session removes partial resources and reports a stable error
- **AND** with a missing source adapter, the load reads the pack size once, during validation, and does not call the source

#### Scenario: Session asset checks `director-093`

- **WHEN** a source returns bytes for a pack
- **THEN** the session checks byte type, size, total bytes and declared integrity before the adapter call

### Requirement: Asset sources

The directory source MUST confine requests and bound stream bytes.

Origin: backfill

#### Scenario: Asset directory configuration `director-094`

- **WHEN** a caller registers an asset directory
- **THEN** the source checks an HTTP or HTTPS directory without credentials, query or fragment

#### Scenario: Asset request options `director-095`

- **WHEN** a caller requests a safe asset path
- **THEN** the source uses the registered directory and stated request options

#### Scenario: Asset stream limits `director-096`

- **WHEN** a source reads an asset stream
- **THEN** the source checks header and stream byte limits and joins its chunks

#### Scenario: Asset source cleanup `director-097`

- **WHEN** a request fails or its signal stops it
- **THEN** the source rejects the request and releases stream resources

### Requirement: Scene bundles

The bundle helpers MUST check supplied assets and keep the source project.

Origin: backfill

#### Scenario: Share text admission `director-098`

- **WHEN** a caller supplies scene share text
- **THEN** the parser checks text type, byte limits and JSON syntax

#### Scenario: Bundle asset entries `director-099`

- **WHEN** a caller supplies bundle assets
- **THEN** the parser checks fields, paths, media types, distinct paths and base64 syntax

#### Scenario: Bundle asset references `director-100`

- **WHEN** a bundle declares pack assets
- **THEN** the parser checks asset hashes and exact pack references

#### Scenario: Bundle export copy `director-101`

- **WHEN** a caller exports a project with supplied assets
- **THEN** the exporter copies the project and writes bundle paths, byte lengths and hashes

#### Scenario: Bundle export limits `director-102`

- **WHEN** a caller supplies files for bundle export
- **THEN** the exporter checks byte limits, media types, file totals and declared integrity

#### Scenario: Shared asset reuse `director-103`

- **WHEN** packs use the same source and path
- **THEN** the exporter writes one asset and rejects conflicting integrity declarations

### Requirement: Bundle byte store

The byte store MUST own project assets and return copied bytes.

Origin: backfill

#### Scenario: Bundle byte ownership `director-104`

- **WHEN** a caller replaces or clears bundle bytes
- **THEN** the store copies the map and reports its current byte total

#### Scenario: Bundle byte access `director-105`

- **WHEN** a caller requests stored bundle bytes
- **THEN** the store returns a byte copy and rejects absent, excess or cancelled assets

### Requirement: Share work

The share helpers MUST check file budgets and settle signal cancellation.

Origin: backfill

#### Scenario: Share file budgets `director-106`

- **WHEN** a caller supplies a scene file
- **THEN** the reader checks the file suffix and size before text access

#### Scenario: Share work cancellation `director-107`

- **WHEN** share work uses a signal
- **THEN** the helper rejects cancelled work and settles successful work or errors

### Requirement: Share preview

The preview MUST report project content and dependencies.

Origin: backfill

#### Scenario: Preview totals `director-108`

- **WHEN** a caller describes a scene share
- **THEN** the preview reports scene, shot and byte totals with pack attribution

#### Scenario: Preview source states `director-109`

- **WHEN** a preview describes a pack source
- **THEN** the preview reports included, absent, configured or unavailable source states

#### Scenario: Preview dependencies `director-110`

- **WHEN** a preview describes scene dependencies
- **THEN** the preview reports absent layers and external scene content

