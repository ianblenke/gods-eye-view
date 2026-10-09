# live-sources Specification

## Purpose
Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave. The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules. The capability also has requirements for the Pensacola camera pack. It has requirements for the layer request and the pack settings.
## Requirements
### Requirement: Transport abort error
`readResponse()` MUST reject with the same error object when a fetch function rejects with an `AbortError` and no external abort signal aborts the request.
Origin: backfill

#### Scenario: Keep the transport abort error `live-sources-001`
- **WHEN** `readResponse()` calls a fetch function that rejects with an `AbortError`, and no external abort signal aborts the request
- **THEN** `readResponse()` rejects with that same error object

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

### Requirement: Pensacola camera rows
The Pensacola pack MUST give one still-image camera source for each channel of a valid row, up to the number that CCTV_PENSACOLA_MAX_SOURCES allows.
A row is the attributes member of a feature in the layer answer. A valid row has a position in the Pensacola area and an image address.
The image address uses https, the host images-dis.divas.cloud, no port, no user information and the path `/DGI/chan-<digits>_h.jpg`.
The pack MUST drop each row that is not valid.
Origin: spec-first

#### Scenario: Map a valid row `live-sources-010`
- **WHEN** a row has the image "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg" and the description "I10-MM 010.2EB-Pensacola Blvd"
- **AND** the row has the direction "E", the latitude 30.502183 and the longitude -87.266586
- **THEN** the source has `id` "fl-10416", `name` "I10-MM 010.2EB-Pensacola Blvd" and `code` "10416"
- **AND** `feedType` is "image", and `url` and `snapshotUrl` are both "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg"
- **AND** `lat` is 30.502183, `lon` is -87.266586, `headingDeg` is 90 and `headingConfidence` is "low"
- **AND** `provider` is "FL511", `city` is "Pensacola", `cityId` is "pensacola" and `sourceKind` is "fl511-open-data"
- **AND** `license` is "FL511 (FDOT), individual non-commercial use only"
- **AND** `pitchDeg`, `fovDeg`, `rangeM`, `mountHeightM` and `groundElevationM` are -18, 44, 145, 8 and 5

#### Scenario: Set a low-confidence heading from the direction `live-sources-011`
- **WHEN** a valid row has the direction "N", "E", "S", "W" or " E " with a space at each end
- **THEN** `headingDeg` is 0, 90, 180, 270 or 90 in that order
- **AND** `headingConfidence` is "low"

#### Scenario: Use the fallback heading for another direction `live-sources-012`
- **WHEN** a valid row with the channel 10416 has the direction "NOT DIRECTIONAL", "NE", "e", "constructor", "" or no direction
- **THEN** `headingDeg` is 45 and `headingConfidence` is "low"

#### Scenario: Drop a row with an image on another host, scheme, port or user information `live-sources-013`
- **WHEN** a row has the image "https://snapshots.divas.cloud/DGI/D3CHP/US-98 at SR-281.jpg", "https://snapshots.divas.cloud/DGI/chan-1_h.jpg", "https://images-dis.divas.cloud.example.com/DGI/chan-1_h.jpg", "https://example.com/DGI/chan-1_h.jpg", "http://images-dis.divas.cloud/DGI/chan-1_h.jpg", "https://images-dis.divas.cloud:8443/DGI/chan-1_h.jpg", "https://images-dis.divas.cloud:443/DGI/chan-1_h.jpg", "https://user@images-dis.divas.cloud/DGI/chan-1_h.jpg" or "https://example.com/?u=https://images-dis.divas.cloud/DGI/chan-1_h.jpg"
- **THEN** the pack gives no source for that row

#### Scenario: Drop a row with an image that is not a frame `live-sources-014`
- **WHEN** a row has the image "https://images-dis.divas.cloud/OTHER/chan-1_h.jpg", "https://images-dis.divas.cloud/DGI/other.jpg", "https://images-dis.divas.cloud/DGI/chan-1_l.jpg", "https://images-dis.divas.cloud/DGI/chan-1_h.jpg.exe", "https://images-dis.divas.cloud/DGI/chan-_h.jpg", "", "   ", the number 12345, the list ["https://images-dis.divas.cloud/DGI/chan-1_h.jpg"] or no image
- **THEN** the pack gives no source for that row

#### Scenario: Build the frame address from the channel `live-sources-015`
- **WHEN** a valid row has the image "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg?token=abc#top", "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg#top" or "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg?"
- **THEN** `url` and `snapshotUrl` are both "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg"

#### Scenario: Drop a row with a missing or text position `live-sources-016`
- **WHEN** a row has no latitude, no longitude, the text latitude "30.502183", the text longitude "-87.266586", or the position 0 and 0
- **THEN** the pack gives no source for that row

#### Scenario: Drop a row outside the Pensacola area `live-sources-030`
- **WHEN** a row has the position 30.19 and -87.65, 30.86 and -87.65, 30.20 and -87.66, or 30.85 and -86.79
- **THEN** the pack gives no source for that row
- **AND** the area has the latitude range 30.20 to 30.85 and the longitude range -87.65 to -86.80, and both ranges include their ends
- **AND** rows at the corners 30.20 and -87.65, and 30.85 and -86.80, give a source

#### Scenario: Keep one source for each channel `live-sources-017`
- **WHEN** two valid rows have the channel 10416, and the first row has the description "Alpha"
- **AND** the second row has the description "Beta"
- **THEN** the pack gives one source with `id` "fl-10416" and `name` "Alpha"

#### Scenario: Name a camera with a blank description `live-sources-018`
- **WHEN** a valid row with the channel 10416 has a description that is absent, "" or "   "
- **THEN** `name` is "FL511 camera 10416"

### Requirement: Pensacola layer request
The Pensacola pack MUST send one query to the FL511 layer and refuse redirects. It MUST read at most 1048576 bytes and return an empty list for each failure.
Origin: spec-first

#### Scenario: Send the fixed query `live-sources-019`
- **WHEN** the pack loads and no setting names another layer address
- **THEN** it sends one GET request to "https://services.arcgis.com/3wFbqsFPLeKqOlIK/arcgis/rest/services/FL511_Traffic_Cameras/FeatureServer/0/query"
- **AND** the query has where "1=1", geometryType "esriGeometryEnvelope", inSR "4326", outSR "4326" and spatialRel "esriSpatialRelIntersects"
- **AND** the geometry is "-87.65,30.2,-86.8,30.85", returnGeometry is "false" and f is "json"
- **AND** outFields is "DESCRIPT,DIRECTION,LATITUDE,LONGITUDE,IMAGE" and resultRecordCount is "200"
- **AND** the query has no other parameter, and the request has no header other than Accept
- **AND** the Accept header is "application/json", the redirect mode is "manual" and the timeout is 15000 milliseconds
- **AND** the pack writes one log line "[CCTV] Loaded Pensacola camera sources: 1 (using nearest 1)"

#### Scenario: Read the rows from the features `live-sources-020`
- **WHEN** the layer answers with HTTP 200 and a features list of four entries
- **AND** the entries are an entry whose attributes are the row of live-sources-010, an entry with null attributes, a null entry and the number 7
- **THEN** the pack gives one source, for the row of live-sources-010

#### Scenario: Return an empty list for an HTTP error `live-sources-021`
- **WHEN** the layer answers with HTTP 400 or 503, with a body, with no body, or with a body that throws on cancel
- **THEN** the pack returns an empty list and cancels the body of the answer when it has one
- **AND** the pack writes one warning "[CCTV] Pensacola camera download failed:" with that status

#### Scenario: Return an empty list for a request error `live-sources-022`
- **WHEN** the request throws an error with the message "network down", or throws the text "boom"
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning "[CCTV] Pensacola camera download error:" with the message "network down" or the text "boom"

#### Scenario: Return an empty list for a redirect `live-sources-023`
- **WHEN** the layer answers with HTTP 300, 302, 307 or 399
- **THEN** the pack returns an empty list and cancels the body of the answer
- **AND** the pack writes one warning "[CCTV] Pensacola layer redirected; redirects are not followed"

#### Scenario: Return an empty list for a body over the limit `live-sources-024`
- **WHEN** the layer answers with the header Content-Length 1048577, or with a body of 1048577 bytes and no Content-Length header
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning with the first argument "[CCTV] Pensacola camera download error:"
- **AND** a valid body of exactly 1048576 bytes gives its sources

#### Scenario: Return an empty list for an error body `live-sources-025`
- **WHEN** the layer answers with HTTP 200 and a body that has an error member or has no features list
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning "[CCTV] Pensacola layer answered with an error."

### Requirement: Pensacola pack settings
The Pensacola pack MUST read three settings from the server environment. The pack MUST be on unless the setting CCTV_PENSACOLA_ENABLED is "0".
Origin: spec-first

#### Scenario: Limit the number of sources `live-sources-026`
- **WHEN** the layer answers with 250 valid rows from the channel 1250 down to the channel 1001
- **AND** the row with the channel 1000 plus n is the n-th nearest to the point at latitude 30.4213 and longitude -87.2169
- **AND** the setting CCTV_PENSACOLA_MAX_SOURCES is unset, "", "50", "50.9", "5", "500" or "abc"
- **THEN** the pack returns 120, 120, 50, 50, 8, 200 or 120 sources in that order
- **AND** for each m from 1 to the count, the m-th source has the id "fl-" and the number 1000 plus m
- **AND** for the first value, the pack writes one log line "[CCTV] Loaded Pensacola camera sources: 250 (using nearest 120)"

#### Scenario: Stop the pack with a setting `live-sources-027`
- **WHEN** the setting CCTV_PENSACOLA_ENABLED is "0"
- **THEN** the catalog makes no request to the FL511 layer

#### Scenario: Keep the pack on by default `live-sources-028`
- **WHEN** the setting CCTV_PENSACOLA_ENABLED is unset, "", "1" or "false"
- **AND** the layer answers with an entry whose attributes are the row of live-sources-010
- **THEN** the catalog lists the camera with the id "fl-10416"

#### Scenario: Use another layer address `live-sources-029`
- **WHEN** the setting CCTV_PENSACOLA_ROWS_URL is "http://127.0.0.1:9/layer/query"
- **THEN** the pack sends its request to that address with the same query as in live-sources-019
- **AND** the value "" of the setting makes the pack use the layer address of live-sources-019

