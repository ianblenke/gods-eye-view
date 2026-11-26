## ADDED Requirements

### Requirement: Opening start view
The application MUST put the camera at the Taiwan pose with no flight when the page plays the opening and has no share state.
Origin: spec-first

#### Scenario: Start the opening at Taiwan `startup-view-006`
- **WHEN** `startApplicationView` runs with no share state and with an opening
- **THEN** the camera gets one view at longitude 120.6485, latitude 24.18, and height 217 m
- **AND** the view has heading 0 and pitch -35 degrees
- **AND** no default flight starts
- **AND** the loader shows `Flying to Taiwan...`

#### Scenario: Tell the start view about the opening `startup-view-007`
- **WHEN** the application controls start a page with no share state
- **THEN** a page that plays the opening gets no default flight
- **AND** a page of a person who asks for reduced motion gets the default flight

## MODIFIED Requirements

### Requirement: Default camera pose
The function `startApplicationView` MUST fly the camera to the Taiwan pose when no share state exists and the page plays no opening.
Origin: spec-first

#### Scenario: Fly to the Taiwan pose `startup-view-001`
- **WHEN** `startApplicationView` runs with no share state and no opening
- **THEN** the camera gets the default flight
- **AND** the flight ends at longitude 120.6485, latitude 24.18, and height 217 m
- **AND** the flight uses heading 0, pitch -35 degrees, and roll 0
