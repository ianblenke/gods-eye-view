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

