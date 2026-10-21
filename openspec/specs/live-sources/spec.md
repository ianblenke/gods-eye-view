# live-sources Specification

## Purpose
Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave. The capability also has the requirement "Ontario row rules".
## Requirements
### Requirement: Transport abort error
`readResponse()` MUST reject with the same error object when a fetch function rejects with an `AbortError` and no external abort signal aborts the request.
Origin: backfill

#### Scenario: Keep the transport abort error `live-sources-001`
- **WHEN** `readResponse()` calls a fetch function that rejects with an `AbortError`, and no external abort signal aborts the request
- **THEN** `readResponse()` rejects with that same error object

### Requirement: Ontario row rules
The Ontario pack MUST apply its current row, view, source and cap rules to the camera list that the request returns.
Origin: backfill

#### Scenario: Select valid rows and image views `live-sources-006`
- **WHEN** the camera list that the request returns has rows with IDs, coordinates and camera views
- **THEN** the loader removes blank IDs, nonfinite coordinates and coordinates outside latitude 41 to 57.5 or longitude -95.6 to -74
- **AND** the loader accepts only enabled views with HTTPS URLs on the exact URL host name 511on.ca or a traveliq.co subdomain
- **AND** the loader accepts only the URL path /map/Cctv/ with one view ID of ASCII letters, digits, underscores, periods or hyphens
- **AND** the loader selects the first accepted view without the word down, or the first accepted view if all have that word
- **AND** a views list that is not an array, an empty views list and views whose status text is not enabled cause no warning
- **AND** the loader trims status text and treats upper case and lower case letters as equal
- **AND** the loader uses the lower case status field when the capitalized Status field is empty
- **AND** the loader returns an empty source list for an empty row list
- **AND** the loader converts URL objects to text and removes spaces at the start and end of URL text
- **AND** the loader reads no coordinate after a blank ID and no view after invalid coordinates

#### Scenario: Set source fields `live-sources-007`
- **WHEN** the loader accepts a row with capitalized or lower case field names
- **THEN** the source has the row ID with the on- prefix and the 511on.ca image URL that the loader builds
- **AND** the name is the Location text, or else the Roadway text, or else Ontario 511 Camera and the ID
- **AND** the loader adds a dash and the view description when the view description is not empty and has no word down
- **AND** the city uses location, roadway or Ontario
- **AND** the source uses the row direction, then the view description, then the ID hash for its heading
- **AND** a known heading has high confidence, pitch -24 degrees, field of view 56 degrees, range 210 meters and mount height 10 meters
- **AND** a hash heading has low confidence, pitch -18 degrees, field of view 44 degrees, range 145 meters and mount height 8 meters
- **AND** a hash heading for `on-1` is 45 degrees
- **AND** the source has numeric row coordinates, ground elevation 200 meters and image feed type
- **AND** `cityId` is ontario and `provider` is Ontario 511
- **AND** `sourceKind` is ontario-511-open-data and `snapshotUrl` equals `url`
- **AND** the `license` field is Open Government Licence - Ontario
- **AND** the loader converts the selected ID, location, roadway and view description values to strings with no spaces at the start or end
- **AND** the loader uses capitalized ID and coordinate fields first unless null or absent
- **AND** the loader uses capitalized location, roadway and view text fields that are not empty first, before lower case text fields
- **AND** the loader uses a capitalized views list first, before a lower case views list
- **AND** the loader uses a capitalized Direction value first unless null or absent
- **AND** a blank Direction value causes the view description to supply direction
- **AND** the loader reads latitude before longitude and location before roadway

#### Scenario: Remove duplicates and apply the cap `live-sources-008`
- **WHEN** the camera list that the request returns has duplicate IDs or exceeds the Ontario source cap
- **THEN** `CCTV_ONTARIO_MAX_SOURCES` sets the Ontario source cap
- **AND** the last row for each ID supplies the source
- **AND** the loader sorts sources by distance to the nearest of the anchor cities Kitchener, Toronto, Ottawa, Hamilton, London and Windsor
- **AND** the default Ontario source cap is 1000
- **AND** a finite Ontario source cap becomes an integer from 8 to 1000
- **AND** a nonfinite Ontario source cap uses 1000
- **AND** the loader writes a log line with the unique source count and the selected source count

#### Scenario: Reject a non-array response `live-sources-009`
- **WHEN** the camera list that the request returns is not an array
- **THEN** the loader returns an empty source list
- **AND** the pack writes no log line or warning

