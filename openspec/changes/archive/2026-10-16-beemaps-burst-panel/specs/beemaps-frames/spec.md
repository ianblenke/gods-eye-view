## MODIFIED Requirements

### Requirement: Registration
The application MUST register the layer in the catalog, the share link, the layer panel and the credits, and MUST keep it out of voice.
Origin: spec-first

#### Scenario: Register the layer and its share token `beemaps-frames-024`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layer "beemaps" and the reference sources have the key "beemaps" with the functions `getStatus` and `getFrames`
- **AND** the share link registry has the entry "beemaps" with the token "5" and the disposition "enabled-only"
- **AND** the share link "v=2&l=5" decodes to the enabled layer "beemaps"
- **AND** the layer comes right after the layer "reticulum" in the order of the catalog
- **AND** the source contract "beemaps" names the layer "beemaps" and the methods `getStatus` and `getFrames`
- **AND** a catalog without the source "beemaps" gives the layer the stats error "Data source not configured: beemaps"
- **AND** the manager `setLayerParams` for "beemaps" returns false, and the source gets no call

#### Scenario: Put the layer in the Cameras group `beemaps-frames-025`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Cameras" ends with the layers "beemaps" and "beemaps-bursts", in that order, after "street-level"

#### Scenario: Keep the layer out of voice `beemaps-frames-026`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "beemaps" has the text "The Bee Maps layer has no voice tools."

#### Scenario: Credit the data `beemaps-frames-027`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry with the key "beemaps" names Bee Maps and links to "https://beemaps.com/"
