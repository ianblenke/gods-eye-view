## ADDED Requirements

### Requirement: Opening start view
The function `startApplicationView` MUST put the camera at the Taiwan pose with no flight when the function gets an opening and no share state.
Origin: spec-first

#### Scenario: Set the Taiwan pose for the opening `startup-view-006`
- **WHEN** `startApplicationView` runs with no share state and with an opening
- **THEN** the camera gets one view at longitude 120.6485, latitude 24.18, and height 217 m
- **AND** the view has heading 0 and pitch -35 degrees
- **AND** no default flight starts
- **AND** the loader shows `Flying to Taiwan...`

### Requirement: Opening decision
The application controls MUST give an opening to the start view only when `openingWanted` returns true and the share code is not rejected.
Origin: spec-first

#### Scenario: Tell the start view about the opening `startup-view-007`
- **WHEN** the application controls start a page with no share state
- **THEN** a page for which `openingWanted` returns true, and which has no rejected share code, gets no default flight
- **AND** a page of a person who asks for reduced motion gets the default flight
- **AND** a page with a rejected share code gets the default flight

## MODIFIED Requirements

### Requirement: Default camera pose
The function `startApplicationView` MUST fly the camera to the Taiwan pose when no share state exists and the function gets no opening.
Origin: spec-first

#### Scenario: Fly to the Taiwan pose `startup-view-001`
- **WHEN** `startApplicationView` runs with no share state and no opening
- **THEN** the camera gets the default flight
- **AND** the flight ends at longitude 120.6485, latitude 24.18, and height 217 m
- **AND** the flight uses heading 0, pitch -35 degrees, and roll 0
