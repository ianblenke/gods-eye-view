## ADDED Requirements

### Requirement: Preset order
The location presets MUST put Taiwan first and Austin second.
Origin: spec-first

#### Scenario: Put Taiwan before Austin `location-presets-001`
- **WHEN** the app reads the preset keys
- **THEN** the first key is `taiwan`
- **AND** the second key is `austin`

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
The preset geocoder MUST answer the city name and id with the preset view bounds.
Origin: spec-first

#### Scenario: Find Taiwan by name or id `location-presets-005`
- **WHEN** a person types `Taiwan` or `taiwan`
- **THEN** the preset geocoder answers with Taiwan
- **AND** its viewport equals the Taiwan preset view bounds
