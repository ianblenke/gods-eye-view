# wind Specification

## Purpose
Describe how the wind layer reads a wind field, makes its particles and shows them on the globe.
## Requirements
### Requirement: fields behavior
The wind field MUST sample scalar grids and make field images and trail values.
Origin: backfill

#### Scenario: Read scalar values `wind-001`
- **WHEN** a field has valid wind or scalar data
- **THEN** the field returns the value at the selected point

#### Scenario: Make a field image `wind-002`
- **WHEN** a field has valid values
- **THEN** the image uses geographic pixel centers

#### Scenario: Set trail color and decay `wind-003`
- **WHEN** the renderer gets speed and elapsed time
- **THEN** it selects a bounded color and a time based erase value

#### Scenario: Use a fixed temperature scale `wind-004`
- **WHEN** the image has temperature values
- **THEN** it uses a Celsius scale and distinct colors

### Requirement: model behavior
The wind model MUST sample grids and move particles.
Origin: backfill

#### Scenario: Sample a wind grid `wind-018`
- **WHEN** a point is in a grid
- **THEN** the model interpolates wind and wraps longitude

#### Scenario: Move and color a particle `wind-019`
- **WHEN** a particle has wind and a speed
- **THEN** the model moves it within bounds and gives a color

### Requirement: presentation behavior
The presentation MUST format a saved wind readout and its unit controls.
Origin: backfill

#### Scenario: Format a saved readout `wind-020`
- **WHEN** the person changes speed units
- **THEN** the readout keeps its sample and makes a result block

### Requirement: source behavior
The wind source MUST check manifests and grids and keep valid wind.
Origin: backfill

#### Scenario: Read a bounded wind field `wind-036`
- **WHEN** the provider returns a valid manifest and grid
- **THEN** the source splits the wind data into its components

#### Scenario: Reject a bad wind source `wind-037`
- **WHEN** a manifest or grid violates its contract
- **THEN** the source rejects it before use

#### Scenario: Stop source work `wind-038`
- **WHEN** a request times out or gets an abort
- **THEN** the source stops the active fetch or body read

#### Scenario: Keep wind with an optional scalar `wind-039`
- **WHEN** an optional scalar has no data
- **THEN** the source returns the valid wind values

### Requirement: streamlines behavior
The streamline bake MUST make bounded paths and group them by map cell.
Origin: backfill

#### Scenario: Bake bounded wind paths `wind-040`
- **WHEN** the wind field has usable values
- **THEN** the bake makes deterministic paths within its limits

#### Scenario: Stop an invalid wind path `wind-041`
- **WHEN** a path meets a pole, seam or absent wind
- **THEN** the bake stops before invalid geometry

#### Scenario: Group paths by map cell `wind-042`
- **WHEN** the bake has paths in regions
- **THEN** the group keeps their order and uses a wrapped middle point

