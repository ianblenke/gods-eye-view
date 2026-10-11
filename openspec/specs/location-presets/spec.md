# location-presets Specification

## Purpose
Keep the location presets of the location bar in a known order and with valid data. Show one pill for each preset. Put the Taiwan preset first, and answer its name from the bundled presets.
## Requirements
### Requirement: Preset order
The location presets MUST put Taiwan first, Tampa second and Austin third.
Origin: spec-first

#### Scenario: Put Tampa between Taiwan and Austin `location-presets-001`
- **WHEN** the app reads the preset keys
- **THEN** the first key is `taiwan`
- **AND** the second key is `tampa`
- **AND** the third key is `austin`

### Requirement: Taiwan preset data
The Taiwan preset MUST have one island view and four places inside its view bounds.
Origin: spec-first

#### Scenario: Give Taiwan five valid places `location-presets-002`
- **WHEN** the app reads the Taiwan preset
- **THEN** its name is Taiwan and its ground elevation is 30 m
- **AND** its southwest point is 21.8 degrees north and 119.3 degrees east
- **AND** its northeast point is 25.4 degrees north and 122.1 degrees east
- **AND** it has five POIs with finite camera numbers inside these bounds
- **AND** its first POI is Taiwan with a range of at least 500000 m

### Requirement: Location pills
The location controls MUST show one pill for each preset in key order.
Origin: spec-first

#### Scenario: Show the Taiwan pill first `location-presets-003`
- **WHEN** the controls get the location presets
- **THEN** they show one pill for each preset
- **AND** the Taiwan pill is left of the Austin pill

### Requirement: Preset flight
The Taiwan pill MUST use the first Taiwan POI for its flight.
Origin: spec-first

#### Scenario: Fly to the island view `location-presets-004`
- **WHEN** the app flies to the Taiwan preset
- **THEN** it uses latitude 23.7 and longitude 121.0
- **AND** it uses range 700000 m, pitch -60 degrees and heading 0 degrees

### Requirement: Preset search
The preset geocoder MUST answer a search for the city name or id with the preset view bounds.
Origin: spec-first

#### Scenario: Find Taiwan by name or id `location-presets-005`
- **WHEN** a person types `Taiwan` or `taiwan`
- **THEN** the preset geocoder answers with Taiwan
- **AND** its viewport equals the Taiwan preset view bounds

### Requirement: Tampa preset data
The Tampa preset MUST have five places inside its view bounds.
Origin: spec-first

#### Scenario: Give Tampa five valid places `location-presets-006`
- **WHEN** the app reads the Tampa preset
- **THEN** its name is Tampa and its ground elevation is 10 m
- **AND** its southwest point is 27.8 degrees north and 82.65 degrees west
- **AND** its northeast point is 28.1 degrees north and 82.3 degrees west
- **AND** it has five POIs with finite camera numbers inside these bounds
- **AND** its POIs, in this order, are "Bank of America Plaza, Tampa", "Raymond James Stadium", "Tampa International Airport", "Henry B. Plant Museum" and "Ybor City"

### Requirement: Tampa pill position
The location controls MUST put the Tampa pill between the Taiwan pill and the Austin pill.
Origin: spec-first

#### Scenario: Show the Tampa pill between Taiwan and Austin `location-presets-007`
- **WHEN** the controls get the location presets
- **THEN** the Taiwan pill is left of the Tampa pill
- **AND** the Tampa pill is left of the Austin pill
- **AND** the Tampa pill shows the text Tampa

### Requirement: Tampa pill flight
The Tampa pill MUST use the first Tampa POI for its flight.
Origin: spec-first

#### Scenario: Fly to the downtown view `location-presets-008`
- **WHEN** the app flies to the Tampa preset
- **THEN** it uses latitude 27.9468 and longitude -82.4591
- **AND** it uses range 650 m, pitch -22 degrees and heading 0 degrees

