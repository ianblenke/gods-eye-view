## ADDED Requirements

### Requirement: Pensacola camera rows
The Pensacola pack MUST give one still-image camera source for each valid row of the FL511 layer and MUST drop each invalid row.
Origin: spec-first

#### Scenario: Map a valid row `live-sources-010`
- **WHEN** a row has the image "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg" and the description "I10-MM 010.2EB-Pensacola Blvd"
- **AND** the row has the direction "E", the latitude 30.502183 and the longitude -87.266586
- **THEN** the pack gives one source with the id "fl-10416" and the name "I10-MM 010.2EB-Pensacola Blvd"
- **AND** the feed type is "image" and the fields url and snapshotUrl are both "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg"
- **AND** the latitude is 30.502183, the longitude is -87.266586, the provider is "FL511" and the city is "Pensacola"
- **AND** the license is "FL511 (FDOT), individual non-commercial use only"

#### Scenario: Set a low-confidence heading from the direction `live-sources-011`
- **WHEN** a valid row has the direction "N", "E", "S" or "W"
- **THEN** the heading is 0, 90, 180 or 270 degrees in that order
- **AND** the heading confidence is "low"

#### Scenario: Use the fallback heading for another direction `live-sources-012`
- **WHEN** a valid row with the channel 10416 has the direction "NOT DIRECTIONAL" or no direction
- **THEN** the heading is 45 degrees and the heading confidence is "low"

#### Scenario: Drop a row with another image address `live-sources-013`
- **WHEN** a row has the image "https://snapshots.divas.cloud/DGI/D3CHP/US-98 at SR-281.jpg", "https://example.com/DGI/chan-1_h.jpg" or "http://images-dis.divas.cloud/DGI/chan-1_h.jpg"
- **THEN** the pack gives no source for that row
- **AND** a row with no image gives no source

#### Scenario: Build the frame address from the channel `live-sources-014`
- **WHEN** a valid row has the image "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg?token=abc#top"
- **THEN** the fields url and snapshotUrl are both "https://images-dis.divas.cloud/DGI/chan-10416_h.jpg"

#### Scenario: Drop a row with a bad position `live-sources-015`
- **WHEN** a row has no latitude, a text latitude, the position 0 and 0, or a position outside the Pensacola area
- **THEN** the pack gives no source for that row
- **AND** the area has the latitude range 30.20 to 30.85 and the longitude range -87.65 to -86.80, with both ends included
- **AND** a row at 30.20 and -87.65 gives a source and a row at 30.19 and -87.65 gives none
- **AND** a row at 30.85 and -86.80 gives a source and a row at 30.85 and -86.79 gives none

#### Scenario: Keep one source for each channel `live-sources-016`
- **WHEN** two valid rows have the channel 10416 and the descriptions "Alpha" and "Beta"
- **THEN** the pack gives one source with the id "fl-10416" and the name "Alpha"

#### Scenario: Name a camera with no description `live-sources-017`
- **WHEN** a valid row with the channel 10416 has a blank description
- **THEN** the source name is "FL511 camera 10416"

### Requirement: Pensacola layer request
The Pensacola pack MUST send one keyless query to the FL511 layer and refuse redirects. It MUST read at most 1048576 bytes and return an empty list for each failure.
Origin: spec-first

#### Scenario: Send the fixed query `live-sources-018`
- **WHEN** the pack loads with no override setting
- **THEN** it sends one GET request to "https://services.arcgis.com/3wFbqsFPLeKqOlIK/arcgis/rest/services/FL511_Traffic_Cameras/FeatureServer/0/query"
- **AND** the query has where "1=1", geometryType "esriGeometryEnvelope", inSR "4326", outSR "4326" and spatialRel "esriSpatialRelIntersects"
- **AND** the geometry is "-87.65,30.2,-86.8,30.85", returnGeometry is "false" and f is "json"
- **AND** outFields is "ID,DESCRIPT,DIRECTION,LATITUDE,LONGITUDE,IMAGE" and resultRecordCount is "200"
- **AND** the request has the Accept header "application/json" and the redirect mode "manual"

#### Scenario: Return an empty list for an HTTP error `live-sources-019`
- **WHEN** the layer answers with HTTP 503
- **THEN** the pack returns an empty list and cancels the body of the answer
- **AND** the pack writes one warning "[CCTV] Pensacola camera download failed:" with the status 503

#### Scenario: Return an empty list for a request error `live-sources-020`
- **WHEN** the request throws an error with the message "network down"
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning "[CCTV] Pensacola camera download error:" with the message "network down"

#### Scenario: Return an empty list for a redirect `live-sources-021`
- **WHEN** the layer answers with HTTP 302
- **THEN** the pack returns an empty list and cancels the body of the answer
- **AND** the pack writes one warning "[CCTV] Pensacola catalog redirected; redirects are not followed"

#### Scenario: Return an empty list for a body over the limit `live-sources-022`
- **WHEN** the layer answers with a declared length of 1048577 bytes, or with a body of 1048577 bytes and no declared length
- **THEN** the pack returns an empty list

#### Scenario: Return an empty list for an error body `live-sources-023`
- **WHEN** the layer answers with HTTP 200 and a body that has an error member or has no features list
- **THEN** the pack returns an empty list
- **AND** the pack writes one warning "[CCTV] Pensacola layer answered with an error."

### Requirement: Pensacola pack settings
The Pensacola pack MUST read three settings from the server environment and MUST be on when no setting turns it off.
Origin: spec-first

#### Scenario: Limit the number of sources `live-sources-024`
- **WHEN** the setting CCTV_PENSACOLA_MAX_SOURCES is unset, "50", "5", "500" or "abc"
- **THEN** the pack keeps at most 120, 50, 8, 200 or 120 sources in that order
- **AND** the pack keeps the sources nearest to the point 30.4213 and -87.2169 first

#### Scenario: Turn the pack off `live-sources-025`
- **WHEN** the setting CCTV_PENSACOLA_ENABLED is "0"
- **THEN** the catalog makes no request to the FL511 layer
- **AND** when the setting is unset or "1", the catalog lists the camera with the id "fl-10416"

#### Scenario: Use another layer address `live-sources-026`
- **WHEN** the setting CCTV_PENSACOLA_ROWS_URL is "http://127.0.0.1:9/layer/query"
- **THEN** the pack sends its request to that address with the same query as in live-sources-018
