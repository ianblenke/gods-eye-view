## ADDED Requirements

### Requirement: Entity depth and horizon
The browser layer MUST draw every system entity and every feature entity on top of the terrain and the mesh, at its record's altitude. It MUST hide an entity that sits beyond the ellipsoid horizon from the camera.
Origin: spec-first

#### Scenario: Draw every entity on top of the terrain, at its own altitude `osh-061`
- **WHEN** the layer draws a system entity, a feature entity, or the entity it re-adds for a selected system
- **THEN** the entity's point carries `disableDepthTestDistance` equal to positive infinity
- **AND** a label on that entity carries `disableDepthTestDistance` equal to positive infinity
- **AND** the point and the label carry `heightReference` equal to `NONE`
- **AND** the entity's position keeps the altitude its record carries, so a record with `alt:100` sits 100 metres above the ellipsoid
- **AND** the entity the layer moves for a fresh observation keeps that observation's altitude in the same way

#### Scenario: Hide an entity beyond the horizon `osh-062`
- **WHEN** the camera's `moveEnd` event fires, or a refresh draws the entities, or the poll moves the selected entity
- **THEN** each system entity and each feature entity beyond the ellipsoid horizon from the camera has `show:false`
- **AND** each entity inside the horizon has `show:true`
- **AND** a later `moveEnd` from a camera that sees a hidden entity restores `show:true`
- **AND** a refresh under a camera that has not moved hides a newly drawn entity beyond the horizon, before any `moveEnd`
- **AND** a poll move that carries the selected entity beyond the horizon hides it, and a later move that brings it back shows it
- **AND** the layer adds one `moveEnd` listener at `init()`, keeps it while the layer is off, and removes it at `destroy()`
