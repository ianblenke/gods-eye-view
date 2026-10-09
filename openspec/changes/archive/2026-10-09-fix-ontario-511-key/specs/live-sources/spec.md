## ADDED Requirements

### Requirement: Ontario camera key
The Ontario pack MUST use a server key, make no request without the key and keep the key text out of the console channels.
Origin: spec-first

#### Scenario: Send the server key `live-sources-002`
- **WHEN** the server sets `ONTARIO_511_API_KEY` to a nonblank value
- **THEN** the request helper trims spaces at the start and end of that value and sends it in the `key` parameter
- **AND** the Accept header is `application/json` and the timeout is 15000 milliseconds
- **AND** the loader maps the camera rows by the rules of live-sources-006 to live-sources-008

#### Scenario: Make no request without a key `live-sources-003`
- **WHEN** the server has no key or a blank key and runs the request helper twice
- **THEN** the request helper makes no request and returns an empty row list each time
- **AND** the process writes one warning: "[CCTV] Ontario 511 needs ONTARIO_511_API_KEY."

#### Scenario: Return an empty row list for an invalid key `live-sources-004`
- **WHEN** the camera endpoint answers with an HTTP error, such as HTTP 400 with `Invalid Key`, twice
- **THEN** the request helper returns an empty row list each time
- **AND** the first request error in the process writes "[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY."
- **AND** later request errors write no warning
- **AND** no log line on the six console channels contains the key text
- **AND** the request helper throws no error

#### Scenario: Keep error text secret `live-sources-005`
- **WHEN** the fetch, the JSON reader or the code that reads a row throws an error with the key text
- **THEN** the request helper returns an empty row list for a fetch or JSON error
- **AND** the first request error in the process writes "[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY."
- **AND** later request errors write no warning
- **AND** the loader returns an empty source list for a row error and writes "[CCTV] Ontario 511 camera data has an error."
- **AND** no log line on the six console channels contains the key text
- **AND** the request helper throws no error for a fetch or JSON error
- **AND** the loader throws no error for a row error

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
