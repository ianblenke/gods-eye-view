## MODIFIED Requirements

### Requirement: Registration
The application MUST register the layer in the catalog, the share link, the layer panel and the credits. It MUST give the texts of the layer in Spanish and Russian, and MUST keep the layer out of voice.
Origin: spec-first

#### Scenario: Register the layer and its share token `gdacs-layer-018`
- **WHEN** a test builds the catalog from the reference sources
- **THEN** the catalog has the layer "gdacs", and the object of the reference sources has the property "gdacs" with a function `getSnapshot`
- **AND** the share link registry has the entry "gdacs" with the token "9" and the disposition "enabled-only"
- **AND** the share link "v=2&l=9" decodes to the enabled layer "gdacs"
- **AND** the layer comes right after the layer "gnss-integrity" in the order of the catalog
- **AND** the source contract "gdacs" names the layer "gdacs" and the method `getSnapshot`
- **AND** a catalog without the source "gdacs" gives the layer the stats error "Data source not configured: gdacs"

#### Scenario: Put the layer in the Events group `gdacs-layer-019`
- **WHEN** a test reads the groups of the layer panel
- **THEN** the group "Events" has the layer "gdacs" right after the layer "s2-ghostmaps"

#### Scenario: Keep the layer out of voice `gdacs-layer-020`
- **WHEN** a test reads the list `VOICE_OFF_LAYERS`
- **THEN** the entry "gdacs" has the text "The GDACS layer has no voice tools."

#### Scenario: Credit the data `gdacs-layer-021`
- **WHEN** a test reads the list `DATA_CREDITS`
- **THEN** the entry whose field `key` is "gdacs" names GDACS, the United Nations and the European Commission
- **AND** the entry holds the text "The estimates of GDACS come from a machine, and an estimate can be wrong."
- **AND** the entry holds the text "Check each estimate before you use it to make a decision."
- **AND** the entry links to "https://www.gdacs.org/"

#### Scenario: Give the texts in Spanish and Russian `gdacs-layer-022`
- **WHEN** a test reads the Spanish and the Russian texts of the application
- **THEN** "Disaster Alerts" has the Spanish text "Alertas de desastres" and the Russian text "Оповещения о бедствиях"
- **AND** "GDACS source unavailable" has the Spanish text "Fuente de GDACS no disponible" and the Russian text "Источник GDACS недоступен"
- **AND** "GDACS unavailable" has the Spanish text "GDACS no disponible" and the Russian text "GDACS недоступен"
- **AND** after `setLocale("es")`, `layerNameForId("gdacs")` gives "Alertas de desastres"
