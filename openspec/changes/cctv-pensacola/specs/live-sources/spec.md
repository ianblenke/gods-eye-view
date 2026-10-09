## ADDED Requirements

### Requirement: Pensacola camera rows
The Pensacola pack MUST give one still-image camera source for each channel of a valid row.
A valid row has an FL511 frame address and a position in the Pensacola area. The pack MUST drop each other row.
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
- **WHEN** a valid row with the channel 10416 has the direction "NOT DIRECTIONAL", "NE", "constructor", "" or no direction
- **THEN** `headingDeg` is 45 and `headingConfidence` is "low"

#### Scenario: Drop a row with an image on another host or scheme `live-sources-013`
- **WHEN** a row has the image "https://snapshots.divas.cloud/DGI/D3CHP/US-98 at SR-281.jpg", "https://example.com/DGI/chan-1_h.jpg" or "http://images-dis.divas.cloud/DGI/chan-1_h.jpg"
- **THEN** the pack gives no source for that row

#### Scenario: Drop a row with an image address of a wrong form `live-sources-014`
- **WHEN** a row has the image "https://images-dis.divas.cloud:8443/DGI/chan-1_h.jpg", "https://user@images-dis.divas.cloud/DGI/chan-1_h.jpg" or "https://images-dis.divas.cloud/DGI/chan-1_h.jpg.exe"
- **THEN** the pack gives no source for that row
- **AND** a row with the image "", the image "   ", the number 12345 as image or no image gives no source

#### Scenario: Build the frame address from the channel `live-sources-015`
- **WHEN** a valid row has the image "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg?token=abc#top"
- **THEN** `url` and `snapshotUrl` are both "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg"

#### Scenario: Drop a row with a bad position `live-sources-016`
- **WHEN** a row has no latitude, the latitude as the text "30.502183", the position 0 and 0, or a position outside the Pensacola area
- **THEN** the pack gives no source for that row
- **AND** the area has the latitude range 30.20 to 30.85 and the longitude range -87.65 to -86.80, and both ranges include their ends
- **AND** rows at the corners 30.20 and -87.65, and 30.85 and -86.80, give a source
- **AND** rows at 30.19 and -87.65, 30.86 and -87.65, 30.20 and -87.66, and 30.85 and -86.79 give no source

#### Scenario: Keep one source for each channel `live-sources-017`
- **WHEN** two valid rows have the channel 10416 and the descriptions "Alpha" and "Beta"
- **THEN** the pack gives one source with `id` "fl-10416" and `name` "Alpha"

#### Scenario: Name a camera with a blank description `live-sources-018`
- **WHEN** a valid row with the channel 10416 has a description that is missing, "" or "   "
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
- **AND** the query has no other parameter, and the request sends no key
- **AND** the request has the Accept header "application/json", the redirect mode "manual" and a timeout of 15000 milliseconds

#### Scenario: Read the rows from the features `live-sources-020`
- **WHEN** the layer answers with HTTP 200 and a features list of four entries
- **AND** the entries are the entry of live-sources-010, an entry with null attributes, a null entry and the number 7
- **THEN** the pack gives one source, for the entry of live-sources-010

#### Scenario: Return an empty list for an HTTP error `live-sources-021`
- **WHEN** the layer answers with HTTP 503
- **THEN** the pack returns an empty list and cancels the body of the answer
- **AND** the pack writes one warning "[CCTV] Pensacola camera download failed:" with the status 503

#### Scenario: Return an empty list for a request error `live-sources-022`
- **WHEN** the request throws an error with the message "network down"
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning "[CCTV] Pensacola camera download error:" with the message "network down"

#### Scenario: Return an empty list for a redirect `live-sources-023`
- **WHEN** the layer answers with HTTP 302 or HTTP 307
- **THEN** the pack returns an empty list and cancels the body of the answer
- **AND** the pack writes one warning "[CCTV] Pensacola layer redirected; redirects are not followed"

#### Scenario: Return an empty list for a body over the limit `live-sources-024`
- **WHEN** the layer answers with the header Content-Length 1048577, or with a body of 1048577 bytes and no Content-Length header
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning that starts with "[CCTV] Pensacola camera download error:"
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
- **AND** the setting CCTV_PENSACOLA_MAX_SOURCES is unset, "50", "50.9", "5", "500" or "abc"
- **THEN** the pack returns 120, 50, 50, 8, 200 or 120 sources in that order
- **AND** the ids of the sources are "fl-1001" up to the count, nearest first

#### Scenario: Disable the pack `live-sources-027`
- **WHEN** the setting CCTV_PENSACOLA_ENABLED is "0"
- **THEN** the catalog makes no request to the FL511 layer

#### Scenario: Keep the pack on by default `live-sources-028`
- **WHEN** the setting CCTV_PENSACOLA_ENABLED is unset, "1" or "false"
- **THEN** the catalog lists the camera with the id "fl-10416"

#### Scenario: Use another layer address `live-sources-029`
- **WHEN** the setting CCTV_PENSACOLA_ROWS_URL is "http://127.0.0.1:9/layer/query"
- **THEN** the pack sends its request to that address with the same query as in live-sources-019
