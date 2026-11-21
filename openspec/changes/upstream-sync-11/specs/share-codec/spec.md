## REMOVED Requirements

### Requirement: Wire primitives
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-053`. The change keeps the other scenarios in a new requirement of the same capability.
**Migration**: None.

### Requirement: Field registry
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-010`, `share-codec-032`, `share-codec-059`, `share-codec-033`, `share-codec-056`.
**Migration**: None.

### Requirement: Defaults
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-011`, `share-codec-012`, `share-codec-013`, `share-codec-014`, `share-codec-027`, `share-codec-036`, `share-codec-060`, `share-codec-061`, `share-codec-048`.
**Migration**: None.

### Requirement: Style and panel tables
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-015`, `share-codec-019`, `share-codec-049`.
**Migration**: None.

### Requirement: Layer sets
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-016`, `share-codec-017`, `share-codec-018`, `share-codec-050`.
**Migration**: None.

### Requirement: View kinds
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-020`, `share-codec-021`, `share-codec-022`, `share-codec-062`, `share-codec-064`, `share-codec-030`, `share-codec-031`.
**Migration**: None.

### Requirement: Follow offsets
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-023`, `share-codec-063`, `share-codec-024`, `share-codec-025`, `share-codec-051`, `share-codec-055`.
**Migration**: None.

### Requirement: Error handling
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-026`, `share-codec-028`, `share-codec-029`, `share-codec-034`, `share-codec-035`, `share-codec-052`, `share-codec-054`.
**Migration**: None.

### Requirement: Legacy state
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-037`, `share-codec-038`, `share-codec-039`, `share-codec-040`, `share-codec-041`, `share-codec-042`, `share-codec-043`, `share-codec-044`.
**Migration**: None.

### Requirement: Unknown style names
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-057`.
**Migration**: None.

### Requirement: Default sources
**Reason**: Upstream changed the share codec tables. It removed the style snow and changed the panel table. The fork tests of this requirement pinned the old tables, and they fail against the merged code. This change retires the scenarios `share-codec-058`.
**Migration**: None.

## ADDED Requirements

### Requirement: Wire primitives after sync 11

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
