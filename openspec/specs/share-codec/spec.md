# share-codec Specification

## Purpose
Describe how the share codec writes a view of the globe as a short code, reads that code back, and reads the old link form.
## Requirements
### Requirement: Wire primitives

The share codec MUST support the wire primitives behavior in these scenarios.

Origin: backfill

#### Scenario: Base64url bytes `share-codec-001`

- **WHEN** the caller converts bytes to base64url text
- **THEN** the codec uses the URL alphabet without padding

#### Scenario: Invalid base64url text `share-codec-002`

- **WHEN** the caller supplies empty, foreign, padded or noncanonical base64url text
- **THEN** the reader rejects the text

#### Scenario: Signed integers `share-codec-003`

- **WHEN** the caller converts signed integers
- **THEN** zigzag maps zero and both signs to unsigned integers

#### Scenario: Varint values `share-codec-004`

- **WHEN** the caller writes canonical safe unsigned integers
- **THEN** the reader returns each integer in order

#### Scenario: Writer bounds `share-codec-005`

- **WHEN** the caller supplies invalid numbers or field numbers
- **THEN** the writer throws a range error

#### Scenario: Reader bounds `share-codec-006`

- **WHEN** the caller supplies truncated, overlong or unsafe varints
- **THEN** the reader rejects each value with its reason

#### Scenario: Tags and lengths `share-codec-007`

- **WHEN** the caller supplies invalid tags or excessive lengths
- **THEN** the reader rejects the input

#### Scenario: Unknown wire values `share-codec-008`

- **WHEN** the caller skips each supported wire type
- **THEN** the reader advances to the next field and rejects truncated values

#### Scenario: Check byte `share-codec-009`

- **WHEN** the caller computes CRC-8 for ASCII digits from one through nine
- **THEN** the result equals 244

#### Scenario: ASCII text `share-codec-053`

- **WHEN** the caller converts printable ASCII text
- **THEN** the wire helpers keep every character and reject characters outside the range

### Requirement: Field registry

The share codec MUST support the field registry behavior in these scenarios.

Origin: backfill

#### Scenario: Permanent tables `share-codec-010`

- **WHEN** the caller reads the field, flag, entity and default data
- **THEN** the data matches the permanent format values
- **AND** default states store state fields as own properties
- **AND** fields for internal wire data do not become state properties

#### Scenario: Open names `share-codec-032`

- **WHEN** the caller supplies a valid map or HUD name outside its code table
- **THEN** the codec keeps the name as text without an unknown-field report
- **AND** the name uses letters, digits, hyphens or underscores within the character limit

#### Scenario: Known detection names `share-codec-059`

- **WHEN** a payload names detection mode SPARSE or allocation WEIGHTED as text
- **THEN** the decoder returns that name without an unknown-field report

#### Scenario: Closed names `share-codec-033`

- **WHEN** a payload contains unknown detection names or unknown enum codes
- **THEN** the decoder reports each value and uses its default

#### Scenario: Invalid open names `share-codec-056`

- **WHEN** a payload contains a map or HUD name outside its grammar
- **THEN** the decoder reports each name and uses its default

### Requirement: Defaults

The share codec MUST support the defaults behavior in these scenarios.

Origin: backfill

#### Scenario: Default view `share-codec-011`

- **WHEN** the caller encodes a default view
- **THEN** the code equals `AQc`

#### Scenario: Scalar differences `share-codec-012`

- **WHEN** the caller changes one scalar or flag from its default
- **THEN** the encoder writes that value and the decoder returns it

#### Scenario: Camera precision `share-codec-013`

- **WHEN** the caller supplies fractional camera values
- **THEN** the codec rounds coordinates to four decimal places and angles and altitude to integers

#### Scenario: Style cost `share-codec-014`

- **WHEN** the caller uses the default settings for a style
- **THEN** the encoder writes only the camera and the style

#### Scenario: Future share time `share-codec-027`

- **WHEN** the share time exceeds the decoder clock
- **THEN** the decoder drops the share time

#### Scenario: Canonical state `share-codec-036`

- **WHEN** the caller encodes normalized state with an absent share time or a share time at or before the decoder clock
- **THEN** the decoder returns the same state and the encoder returns the same code
- **AND** repeated normalization does not change the state

#### Scenario: Camera example size `share-codec-060`

- **WHEN** the caller encodes a default view with coordinates 48.8584 and 2.2945, altitude 1200, heading 120 and pitch -25
- **THEN** the code contains 24 characters without a share time
- **AND** the code contains 31 characters with share time 1793016000000

#### Scenario: Signed angle fields `share-codec-061`

- **WHEN** the caller encodes a place view with a normalized nondefault integer heading or roll
- **THEN** the wire stores the nearest signed turn through zigzag
- **AND** headings 10, 180 and 181 use unsigned values 20, 360 and 357
- **AND** rolls 50 and 359 use unsigned values 100 and 1

#### Scenario: Numeric limits `share-codec-048`

- **WHEN** the caller supplies invalid or extreme numeric settings
- **THEN** the codec uses defaults, bounds or angle normalization for each field
- **AND** a normalized camera value that rounds to zero uses positive zero

### Requirement: Style and panel tables

The share codec MUST support the style and panel tables behavior in these scenarios.

Origin: backfill

#### Scenario: Style parameter values `share-codec-015`

- **WHEN** the caller supplies style parameters
- **THEN** the codec keeps finite own values within each parameter range and fills other values from the style

#### Scenario: Panel layout `share-codec-019`

- **WHEN** the caller supplies panel states
- **THEN** the codec keeps valid panel differences and each absent opinion
- **AND** the codec does not read collapse values from unknown panels
- **AND** legacy panel tokens map to their permanent panel ids

#### Scenario: Future table entries `share-codec-049`

- **WHEN** a payload contains future panel values or style tokens
- **THEN** the decoder reports each unknown entry without changes to known values

### Requirement: Layer sets

The share codec MUST support the layer sets behavior in these scenarios.

Origin: backfill

#### Scenario: Layer numbers `share-codec-016`

- **WHEN** the caller converts permanent layer tokens
- **THEN** the codec uses base-36 numbers with an offset of 36 for two characters

#### Scenario: Layer presence `share-codec-017`

- **WHEN** the caller supplies an absent, empty or populated layer set
- **THEN** the codec keeps these states distinct

#### Scenario: Layer options `share-codec-018`

- **WHEN** the caller supplies layer options
- **THEN** the codec writes differences from the frozen absent values

#### Scenario: Invalid options `share-codec-050`

- **WHEN** a payload contains duplicate, excessive or unknown layer options
- **THEN** the decoder rejects invalid structure and reports unknown option data
- **AND** the decoder reports mirror options as unknown without changes to owner values

### Requirement: View kinds

The share codec MUST support the view kinds behavior in these scenarios.

Origin: backfill

#### Scenario: Place and thing views `share-codec-020`

- **WHEN** the caller supplies a place or thing view without a fix
- **THEN** the codec keeps its camera and the valid entity of a thing view

#### Scenario: Entity identifiers `share-codec-021`

- **WHEN** the caller supplies an entity identifier
- **THEN** the codec normalizes valid identifiers and uses numeric or text fields as the format specifies
- **AND** the codec rejects invalid identifier types before a grammar check

#### Scenario: Tracked entity `share-codec-022`

- **WHEN** the caller supplies a valid layer tracking selection
- **THEN** the codec selects the valid entity and clears all tracking slots

#### Scenario: Known place kind `share-codec-062`

- **WHEN** a payload names the place kind as text or code zero
- **THEN** the decoder keeps the camera without a fallback or unknown-field report

#### Scenario: Empty thing message `share-codec-064`

- **WHEN** a payload contains an empty thing message without a fix
- **THEN** the decoder keeps the camera and reports `missing-entity-kind`

#### Scenario: Unknown view kind `share-codec-030`

- **WHEN** a payload asks for an unknown view kind or a thing without its message
- **THEN** the decoder uses the camera and reports the fallback reason

#### Scenario: Unknown entity `share-codec-031`

- **WHEN** a thing message contains an unknown, absent or invalid entity
- **THEN** the decoder uses the camera from the fix and reports the fallback reason

### Requirement: Follow offsets

The share codec MUST support the follow offsets behavior in these scenarios.

Origin: backfill

#### Scenario: Fix time `share-codec-023`

- **WHEN** the caller supplies a fix time with or without a share time
- **THEN** the codec uses relative age with a share time and absolute time without one
- **AND** the decoder ignores an age without a share time
- **AND** a fix takes the share time when its own time is absent

#### Scenario: Fix wire data `share-codec-063`

- **WHEN** the caller encodes a valid fix without a share time
- **THEN** the wire stores both coordinate integers
- **AND** the wire stores a present absolute time as an epoch offset
- **AND** the decoder returns the normalized fix values
- **AND** coordinates 12.3456 and -23.4567 use integers 123456 and -234567
- **AND** altitude 1234 uses integer 1234 and time 1767225617000 uses epoch offset 17
- **AND** a zero fix writes both coordinates without an altitude field

#### Scenario: Local offset `share-codec-024`

- **WHEN** the caller converts a local follow offset
- **THEN** the codec uses east, north and up distances and rounds a nonzero inverse to integer values
- **AND** the inverse returns null for a zero distance

#### Scenario: Camera geometry `share-codec-025`

- **WHEN** the caller supplies a valid fix and a nonzero follow offset
- **THEN** the codec derives the camera on the sphere with radius 6371000 meters

#### Scenario: Invalid fix values `share-codec-051`

- **WHEN** the caller supplies invalid fix or offset values
- **THEN** the codec drops invalid fixes and normalizes valid offsets

#### Scenario: Zero distance `share-codec-055`

- **WHEN** the caller derives a camera with a zero offset
- **THEN** the camera keeps the fix coordinates and supplied angles with roll zero

### Requirement: Error handling

The share codec MUST support the error handling behavior in these scenarios.

Origin: backfill

#### Scenario: Character errors `share-codec-026`

- **WHEN** the caller changes one character of a valid code
- **THEN** the decoder rejects the changed code

#### Scenario: Unknown fields `share-codec-028`

- **WHEN** a payload contains unknown top-level fields
- **THEN** the decoder skips each field and reports its scope, number and wire type

#### Scenario: Unknown nested data `share-codec-029`

- **WHEN** a payload contains unknown thing fields, flag bits or layer numbers
- **THEN** the decoder reports the unknown data and keeps the known data

#### Scenario: Invalid payloads `share-codec-034`

- **WHEN** a payload violates the wire format
- **THEN** the decoder returns failure with the error reason

#### Scenario: Corrupt payloads `share-codec-035`

- **WHEN** the caller decodes truncated or corrupt bytes
- **THEN** the decoder returns a result without an exception

#### Scenario: Time bounds `share-codec-052`

- **WHEN** a payload contains a share time outside the safe positive range
- **THEN** the decoder drops the share time

#### Scenario: Internal error `share-codec-054`

- **WHEN** an internal operation throws an error outside the wire error class
- **THEN** the decoder returns `internal-error`

### Requirement: Legacy state

The share codec MUST support the legacy state behavior in these scenarios.

Origin: backfill

#### Scenario: Permanent example `share-codec-037`

- **WHEN** the caller converts the HAL long link
- **THEN** the compact code equals `ARCg-SQYrah3ILAJKB4wO1IEAIQAEGIBNMgBC1o`

#### Scenario: Earlier links `share-codec-038`

- **WHEN** the caller converts earlier long links
- **THEN** the codec keeps their historical settings

#### Scenario: Tracking conversion `share-codec-039`

- **WHEN** the caller converts a tracked aircraft, military aircraft or satellite
- **THEN** the converters transfer its identifier between the view and the layer option

#### Scenario: Vessel conversion `share-codec-040`

- **WHEN** the caller converts a vessel to legacy state
- **THEN** the converter keeps the vessel layer without a tracking selection

#### Scenario: Entity layer `share-codec-041`

- **WHEN** the caller converts a thing view with or without a layer set
- **THEN** the legacy state enables the entity layer

#### Scenario: Generated links `share-codec-042`

- **WHEN** the caller converts links from the long-form generator
- **THEN** the compact form keeps the parsed view

#### Scenario: Own state fields `share-codec-043`

- **WHEN** the caller converts parsed legacy state
- **THEN** the converter copies own view fields and excludes restore metadata

#### Scenario: Legacy keys `share-codec-044`

- **WHEN** the caller reads the legacy key table
- **THEN** the table lists each parsed state key

### Requirement: Link path

The share codec MUST support the link path behavior in these scenarios.

Origin: backfill

#### Scenario: Share path `share-codec-045`

- **WHEN** the caller parses a share path
- **THEN** the parser returns the final code and base path

#### Scenario: Application root `share-codec-046`

- **WHEN** the caller resolves an application root URL
- **THEN** the result drops the share path and hash and keeps the query

#### Scenario: Share URL `share-codec-047`

- **WHEN** the caller builds a share URL
- **THEN** the result uses the application base and excludes the sender language

### Requirement: Unknown style names

The codec MUST use Normal for an unknown style name.

Origin: backfill

#### Scenario: Unknown style `share-codec-057`

- **WHEN** a payload names an unknown style
- **THEN** the decoder reports the name and uses Normal

### Requirement: Default sources

The codec MUST initialize style defaults from the preset, global and shader tables.

Origin: backfill

#### Scenario: Default sources `share-codec-058`

- **WHEN** the source tables supply distinct preset, global and shader values
- **THEN** the codec selects preset values before global or shader defaults
