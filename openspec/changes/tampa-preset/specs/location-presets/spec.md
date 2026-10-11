## MODIFIED Requirements

### Requirement: Preset order
The location presets MUST put Taiwan first, Tampa second and Austin third.
Origin: spec-first

#### Scenario: Put Tampa between Taiwan and Austin `location-presets-001`
- **WHEN** the app reads the preset keys
- **THEN** the first key is `taiwan`
- **AND** the second key is `tampa`
- **AND** the third key is `austin`

## ADDED Requirements

### Requirement: Tampa preset data
The Tampa preset MUST have five places inside its view bounds.
Origin: spec-first

#### Scenario: Give Tampa five valid places `location-presets-006`
- **WHEN** the app reads the Tampa preset
- **THEN** its name is Tampa and its ground elevation is 10 m
- **AND** its southwest point is 27.8 degrees north and 82.65 degrees west
- **AND** its northeast point is 28.1 degrees north and 82.3 degrees west
- **AND** it has five POIs with finite camera numbers inside these bounds
- **AND** its first POI is Bank of America Plaza, Tampa

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
