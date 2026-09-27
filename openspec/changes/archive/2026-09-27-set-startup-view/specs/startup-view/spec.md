## ADDED Requirements

### Requirement: Default camera pose
The app MUST start the default camera flight at the Taiwan pose when no share state exists.
Origin: spec-first

#### Scenario: Fly to the Taiwan pose `startup-view-001`
- **WHEN** the app has no share state
- **THEN** the app calls `flyToStartView()`
- **AND** the flight ends at longitude 120.6485, latitude 24.18, and height 217 m
- **AND** the flight uses heading 0, pitch -35 degrees, and roll 0

### Requirement: Flight start
The default camera flight MUST start above the Taiwan pose after a 500 ms pause.
Origin: spec-first

#### Scenario: Start high above Taiwan `startup-view-002`
- **WHEN** the default camera flight starts
- **THEN** the first view has longitude 120.6485, latitude 24.18, and height 25000 m
- **AND** the first view has pitch -90 degrees
- **AND** the flight starts after 500 ms and lasts 4 s

### Requirement: Flight cancel
The default camera flight MUST stop its timer and cancel its active flight when the caller stops it.
Origin: spec-first

#### Scenario: Stop a late flight `startup-view-003`
- **WHEN** the caller stops the default flight before the timer ends
- **THEN** no late flight starts
- **AND** the camera cancels its flight if the viewer is live
- **AND** a destroyed viewer gets no flight

### Requirement: Share view priority
The app MUST keep the share view when share state exists.
Origin: spec-first

#### Scenario: Keep a share view `startup-view-004`
- **WHEN** the app has share state
- **THEN** the app does not start the default flight
- **AND** the loader shows `Restoring shared view...`

### Requirement: Default loader text
The app MUST show the Taiwan flight text when the default flight starts.
Origin: spec-first

#### Scenario: Show the Taiwan flight text `startup-view-005`
- **WHEN** the app starts the default flight
- **THEN** the loader shows `Flying to Taiwan...`
