## ADDED Requirements

### Requirement: Ontario camera credential
The Ontario camera pack MUST use an optional server key, make no request without it, and keep the key out of logs and errors.
Origin: spec-first

#### Scenario: Send the server key `live-sources-002`
- **WHEN** the server has `ONTARIO_511_API_KEY`
- **THEN** the camera request has that value in the `key` parameter
- **AND** the pack maps the camera rows as before

#### Scenario: Stop without a key `live-sources-003`
- **WHEN** the server has no key or a blank key and calls the Ontario pack twice
- **THEN** the pack makes no request and returns an empty list each time
- **AND** the process writes one warning that names `ONTARIO_511_API_KEY`

#### Scenario: Reject an invalid key `live-sources-004`
- **WHEN** the camera endpoint answers HTTP 400 with `Invalid Key` twice
- **THEN** the pack returns an empty list each time and writes one warning
- **AND** no log or error has the key text

#### Scenario: Keep error text secret `live-sources-005`
- **WHEN** the fetch or JSON reader throws an error with the key text
- **THEN** the pack returns an empty list and writes fixed warning text without the key

### Requirement: Ontario row rules
The Ontario pack MUST apply its existing row, view, source and cap rules to keyed camera data.
This requirement describes behavior that exists before the key change.
Origin: backfill

#### Scenario: Select valid rows and still views `live-sources-006`
- **WHEN** keyed data has rows with IDs, coordinates and camera views
- **THEN** the pack drops blank IDs, nonfinite coordinates and coordinates outside latitude 41 to 57.5 or longitude -95.6 to -74
- **AND** the pack accepts only enabled views with HTTPS URLs on 511on.ca or a traveliq.co subdomain
- **AND** the URL path must be /map/Cctv/ with one ID of letters, digits, underscores, periods or hyphens
- **AND** the pack selects the first accepted view without the word down, or the first accepted view if all have that word
- **AND** non-array views, empty views and disabled scalar statuses cause no data error warning
- **AND** the pack reads no coordinate after a blank ID and no view after invalid coordinates

#### Scenario: Set source fields `live-sources-007`
- **WHEN** the pack accepts a row with upper or lower case field names
- **THEN** the source has the row ID with the on- prefix and the canonical 511on.ca image URL
- **AND** the name uses location, roadway or Ontario 511 Camera with the ID, plus a view label without the word down
- **AND** the city uses location, roadway or Ontario
- **AND** the source uses the row direction, then the view direction, then the ID hash for its heading
- **AND** a known heading has high confidence, pitch -24, field of view 56, range 210 and mount height 10
- **AND** a hash heading has low confidence, pitch -18, field of view 44, range 145 and mount height 8
- **AND** a hash heading for `on-1` is 45
- **AND** the source has numeric row coordinates, ground elevation 200 and image feed type
- **AND** `cityId` is ontario and `provider` is Ontario 511
- **AND** `sourceKind` is ontario-511-open-data and `snapshotUrl` equals `url`
- **AND** the licence name is Open Government Licence - Ontario
- **AND** the pack converts the selected ID, location, roadway and view description values to strings with no edge spaces
- **AND** capitalized ID and coordinate fields take precedence unless null or absent
- **AND** nonempty capitalized location, roadway and view text fields take precedence over lower case text fields
- **AND** a capitalized views list takes precedence over a lower case views list
- **AND** the pack reads latitude before longitude and location before roadway

#### Scenario: Remove duplicates and apply the cap `live-sources-008`
- **WHEN** keyed rows have duplicate IDs or exceed the source cap
- **THEN** the last row for each ID supplies the source
- **AND** the pack sorts sources by distance to the nearest Ontario anchor
- **AND** the default cap is 1000
- **AND** a finite server cap becomes an integer from 8 to 1000
- **AND** a nonfinite server cap uses 1000
- **AND** the pack logs the unique source count and the selected source count

#### Scenario: Reject a non-array response `live-sources-009`
- **WHEN** keyed camera data is not an array
- **THEN** the pack returns an empty list
- **AND** the pack writes no log or warning
