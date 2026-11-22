## ADDED Requirements

### Requirement: Bundled cable source
The bundled cable source MUST read the two bundled files of cable data. It MUST use the global fetch function when the caller gives none.
Origin: backfill

#### Scenario: Read the bundled files with the global fetch `submarine-cables-001`
- **WHEN** a caller makes the source with no fetch function and reads it
- **THEN** the source reads `cable-geo.json` and `landing-point-geo.json` with the global fetch function
- **AND** the source gives the two collections
