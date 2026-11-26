## RENAMED Requirements

- FROM: ### Requirement: Tampa pill flight
- TO: ### Requirement: Tampa preset flight

## MODIFIED Requirements

### Requirement: Preset flight
A choice of the Taiwan preset MUST use the first Taiwan POI for its flight.
Origin: spec-first

#### Scenario: Fly to the island view `location-presets-004`
- **WHEN** the app flies to the Taiwan preset
- **THEN** it uses latitude 23.7 and longitude 121.0
- **AND** it uses range 700000 m, pitch -60 degrees and heading 0 degrees

### Requirement: Tampa preset flight
A choice of the Tampa preset MUST use the first Tampa POI for its flight.
Origin: spec-first

#### Scenario: Fly to the downtown view `location-presets-008`
- **WHEN** the app flies to the Tampa preset
- **THEN** it uses latitude 27.9468 and longitude -82.4591
- **AND** it uses range 650 m, pitch -22 degrees and heading 0 degrees

## REMOVED Requirements

### Requirement: Location pills
**Reason**: Upstream deleted the location bar and its pills. The owner chose to follow upstream. This change retires the scenario `location-presets-003`.
**Migration**: A person types a city name in the search bar.

### Requirement: Tampa pill position
**Reason**: Upstream deleted the location bar and its pills. The owner chose to follow upstream. This change retires the scenario `location-presets-007`.
**Migration**: None. The scenario `location-presets-001` keeps the order of the preset keys.
