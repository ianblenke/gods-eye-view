# cable-bundled-source Specification

## Purpose
Describe how the bundled source gives the submarine cable data to the layer.
## Requirements
### Requirement: Bundled cable source
The bundled cable source MUST read the two bundled files of cable data. It MUST use the global fetch function when the caller gives none.
Origin: backfill

#### Scenario: Read the bundled files with the global fetch `cable-bundled-source-001`
- **WHEN** a caller creates the source with no fetch function and reads it
- **THEN** the source reads `cable-geo.json` and `landing-point-geo.json` with the global fetch function
- **AND** the source gives the two collections

