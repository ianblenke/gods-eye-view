# Wind specification

## ADDED Requirements

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

### Requirement: GPU path flow
The GPU owner MUST make path cells, cull them and release its resources.
Origin: backfill

#### Scenario: Build GPU path cells `wind-005`
- **WHEN** the GPU owner gets a wind field
- **THEN** it makes regional cells and updates their uniforms

#### Scenario: Release GPU resources `wind-006`
- **WHEN** the owner gets a new field or ends
- **THEN** it releases its cells and material

#### Scenario: Use a canvas fallback `wind-007`
- **WHEN** GPU geometry cannot work
- **THEN** the owner requests the canvas fallback

#### Scenario: Cull GPU cells `wind-008`
- **WHEN** the camera cannot see a cell
- **THEN** the owner hides that cell

### Requirement: index behavior
The wind layer MUST manage source requests, controls and inspection through its life cycle.
Origin: backfill

#### Scenario: Keep forecast time and status `wind-009`
- **WHEN** the layer gets a wind manifest
- **THEN** it reports forecast time and source age

#### Scenario: Switch the wind model `wind-010`
- **WHEN** the selected model changes
- **THEN** the layer clears old data and stops old source work

#### Scenario: Select a wind field `wind-011`
- **WHEN** the person changes field style, units or scalar choice
- **THEN** the layer keeps wind data for local changes and requests new scalar data when needed

#### Scenario: Handle absent wind or scalar data `wind-012`
- **WHEN** wind or optional scalar data is absent
- **THEN** the layer clears an unavailable wind field or keeps valid wind and reports the absent scalar

#### Scenario: Report source and renderer state `wind-013`
- **WHEN** the source, renderer or imagery host changes
- **THEN** the layer gives the renderer its host and reports the current state

#### Scenario: Keep an inspection point `wind-014`
- **WHEN** the person changes a model, field or unit
- **THEN** the point stays fixed until the person dismisses it or disables inspection

#### Scenario: Show wind controls `wind-015`
- **WHEN** the layer has a selected forecast
- **THEN** it reports a numeric count and shows applicable unit controls

### Requirement: inspection behavior
Wind inspection MUST read one map point and own its marker.
Origin: backfill

#### Scenario: Read wind at map center `wind-016`
- **WHEN** the camera has a center point
- **THEN** the readout uses the field value and source direction

#### Scenario: Own an inspection marker `wind-017`
- **WHEN** the layer has an inspection point
- **THEN** the marker tracks that point and releases its listener

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

### Requirement: relief behavior
Wind relief MUST own and restore a globe material.
Origin: backfill

#### Scenario: Own globe relief `wind-021`
- **WHEN** the relief owner starts and ends
- **THEN** it sets and restores the globe material

#### Scenario: Adjust relief for terrain and viewer `wind-022`
- **WHEN** terrain normals or the viewer changes
- **THEN** the relief owner uses the new state

### Requirement: Globe display
The wind renderer MUST draw flow and scalar fields and release its resources.
Origin: backfill

#### Scenario: Own a canvas and its frame loop `wind-023`
- **WHEN** the renderer starts and stops
- **THEN** it owns its canvas and scheduled frames

#### Scenario: Keep particles on screen `wind-024`
- **WHEN** the camera or canvas changes
- **THEN** the renderer changes its particles and does not draw hidden paths

#### Scenario: Pause and resume frame work `wind-025`
- **WHEN** motion or document state changes
- **THEN** the renderer pauses or resumes its frame callback

#### Scenario: Install scalar imagery `wind-026`
- **WHEN** the renderer gets a scalar field
- **THEN** it installs imagery and releases it on clear

#### Scenario: Fade scalar imagery `wind-027`
- **WHEN** the camera height changes
- **THEN** the scalar image uses a height based alpha

#### Scenario: Keep canvas strokes local `wind-028`
- **WHEN** the map projection has a seam
- **THEN** the renderer does not draw a long stroke across the view

#### Scenario: Keep glyph speed stable `wind-029`
- **WHEN** frame time changes
- **THEN** wind glyphs stay legible without extra particle motion

#### Scenario: Run GPU flow `wind-030`
- **WHEN** the renderer has GPU support or the view width changes
- **THEN** it uses one scheduler and builds geometry or uses the canvas

#### Scenario: Report that the GPU is ready `wind-031`
- **WHEN** GPU geometry becomes ready
- **THEN** the renderer reports once that it is ready

#### Scenario: Keep GPU geometry without new wind `wind-032`
- **WHEN** only scalar data changes or the next field is absent
- **THEN** the renderer keeps its wind geometry and phase until the layer clears it

#### Scenario: Rebuild changed GPU geometry `wind-033`
- **WHEN** a wind grid or model property changes
- **THEN** the renderer builds new GPU geometry

#### Scenario: Resume GPU flow at a new height `wind-034`
- **WHEN** the camera moves after height suspension
- **THEN** the renderer resumes flow

#### Scenario: Show a scalar shell `wind-035`
- **WHEN** a tileset or host change needs a scalar field
- **THEN** the renderer shows a shell, controls its alpha and reports the host state

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

