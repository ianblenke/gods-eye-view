## MODIFIED Requirements

### Requirement: Registration
The application MUST register the layer in the catalog, the share link, the layer panel and the credits, and MUST keep it out of voice.
Origin: spec-first

#### Scenario: Register the layer and its share token `reticulum-layer-017`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layer "reticulum" and the reference sources have the key "reticulum" with a function `getSnapshot`
- **AND** the share link registry has the entry "reticulum" with the token "4" and the disposition "enabled-only"
- **AND** the share link "v=2&l=4" decodes to the enabled layer "reticulum"
- **AND** the layer comes right after the layer "earthquakes" in the order of the catalog
- **AND** the source contract "reticulum" names the layer "reticulum" and the method `getSnapshot`
- **AND** a catalog without the source "reticulum" gives the layer the stats error "Data source not configured: reticulum"

#### Scenario: Put the layer in the Infrastructure group `reticulum-layer-018`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Infrastructure" has the layer "reticulum" right after the layer "local-dams"

#### Scenario: Keep the layer out of voice `reticulum-layer-019`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "reticulum" has the text "The Reticulum layer has no voice tools."

#### Scenario: Credit the data `reticulum-layer-020`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry with the key "reticulum" names the Reticulum network and links to "https://reticulum.network/"
