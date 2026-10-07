## ADDED Requirements

### Requirement: Absent camera data

The camera module MUST return null for absent camera data.

Origin: backfill

#### Scenario: Absent camera data `director-041`

- **WHEN** the caller supplies an absent camera or move
- **THEN** the camera module returns null

### Requirement: Inline camera poses

The camera module MUST copy inline camera poses.

Origin: backfill

#### Scenario: Inline camera poses `director-042`

- **WHEN** the caller supplies an inline camera pose
- **THEN** the camera module copies its position and orientation

### Requirement: Scene anchor poses

The camera module MUST resolve scene anchor poses.

Origin: backfill

#### Scenario: Scene anchor poses `director-043`

- **WHEN** the caller names a scene anchor
- **THEN** the camera module uses the anchor position and rejects an unknown anchor

### Requirement: Default orientation

The camera module MUST use default orientation for absent fields.

Origin: backfill

#### Scenario: Default orientation `director-044`

- **WHEN** the camera leaves orientation fields absent
- **THEN** the camera module gives heading zero degrees, pitch minus 35 degrees and roll zero degrees
- **AND** zero heading, pitch and roll stay zero
- **AND** heading and roll keep negative zero from a getter

### Requirement: Shot camera moves

The camera module MUST resolve both poses of a shot camera move.

Origin: backfill

#### Scenario: Shot camera moves `director-045`

- **WHEN** the shot supplies a move
- **THEN** the camera module gives both poses, the curve name and the shot duration

### Requirement: Camera progress bounds

The camera module MUST limit camera progress to zero through one.

Origin: backfill

#### Scenario: Camera progress bounds `director-046`

- **WHEN** the caller samples a move outside its progress bounds
- **THEN** the camera module returns a copy of the exact endpoint
- **AND** progress at or below zero gives a copy of the start pose
- **AND** progress at or above one gives a copy of the end pose
- **AND** invalid text gives the start pose and numeric text 0.5 gives the midpoint

### Requirement: Linear camera samples

The camera module MUST sample linear moves with the shortest angle arcs.
The table gives the endpoints and midpoint for the linear sample tests.

| Field | Start | End pose | Midpoint |
| --- | ---: | ---: | ---: |
| Latitude (degrees) | 10 | 12 | 11 |
| Longitude (degrees) | 179 | -179 | -180 |
| Height (meters) | 400 | 800 | 600 |
| Heading (degrees) | 350 | 10 | 360 |
| Pitch (degrees) | -40 | 0 | -20 |
| Roll (degrees) | 350 | 10 | 360 |

Origin: backfill

#### Scenario: Linear camera samples `director-047`

- **WHEN** the caller samples a linear move at its midpoint
- **THEN** the camera module interpolates position and takes the shortest longitude, heading and roll arcs
- **AND** a heading from zero to 180 degrees gives minus 90 degrees at progress 0.5
- **AND** a westward move from minus 179 to 179 degrees gives longitude 179.5 degrees at progress 0.75

### Requirement: Cubic camera samples

The camera module MUST sample cubic-in-out moves.
For latitude 10 to 12 degrees, cubic progress 0.25 gives 10.125 degrees and progress 0.75 gives 11.875 degrees.
The table gives both cubic samples for the linear sample endpoints.

| Field | Progress 0.25 | Progress 0.75 |
| --- | ---: | ---: |
| Latitude (degrees) | 10.125 | 11.875 |
| Longitude (degrees) | 179.125 | -179.125 |
| Height (meters) | 425 | 775 |
| Heading (degrees) | 351.25 | 368.75 |
| Pitch (degrees) | -37.5 | -2.5 |
| Roll (degrees) | 351.25 | 368.75 |

Origin: backfill

#### Scenario: Cubic camera samples `director-048`

- **WHEN** the caller samples each half of a cubic curve
- **THEN** the camera module gives the cubic position for each half
- **AND** latitude 10 to 12 degrees gives 10.729 degrees at progress 0.45

### Requirement: Camera position fields

The camera document module MUST check camera position fields.
Latitude spans minus 90 through 90 degrees.
Longitude spans minus 180 through 180 degrees.
Height spans minus 12000 through 1000000000 meters.

Origin: backfill

#### Scenario: Camera position fields `director-049`

- **WHEN** a camera supplies invalid position data
- **THEN** the camera document module rejects each invalid latitude, longitude or height
- **AND** the camera document module gives a document error for a null pose
- **AND** absent position fields pass the check
- **AND** the pose rejects an unsupported field

### Requirement: Camera orientation fields

The camera document module MUST check camera orientation fields.
The camera document module accepts heading and roll from minus 360 through 360 degrees.
The camera document module accepts pitch from minus 90 through 90 degrees.

Origin: backfill

#### Scenario: Camera orientation fields `director-050`

- **WHEN** a camera supplies invalid orientation fields
- **THEN** the camera document module rejects each invalid heading, pitch or roll
- **AND** absent orientation fields pass the check

### Requirement: Camera version rules

The camera document module MUST check camera fields for each document version.

Origin: backfill

#### Scenario: Camera version rules `director-051`

- **WHEN** the caller checks camera data with different versions
- **THEN** the camera document module accepts numeric text in a pose field only in versions 1 and 2 and anchor references only from version 4
- **AND** the camera document module rejects a height reference field before version 4

### Requirement: Scene anchor fields

The camera document module MUST check scene anchor fields.
A scene accepts at most 1024 anchors.
Each anchor supplies an ID, latitude, longitude, height and ellipsoid height reference.

Origin: backfill

#### Scenario: Scene anchor fields `director-052`

- **WHEN** the scene supplies invalid anchor data
- **THEN** the camera document module rejects invalid IDs, duplicate IDs, titles, coordinates and height references
- **AND** the anchor rejects an unsupported field
- **AND** the title accepts 4096 characters and rejects 4097 characters
- **AND** anchor coordinates reject numeric text in version 2

### Requirement: Inline endpoint fields

The camera document module MUST reject absent inline endpoint coordinates.

Origin: backfill

#### Scenario: Inline endpoint fields `director-053`

- **WHEN** a move leaves an inline endpoint coordinate absent
- **THEN** the camera document module rejects each absent latitude, longitude or height

### Requirement: Move curve and time

The camera document module MUST check move curves and times.
Move duration spans 0.2 through 86400 seconds.
Hold duration spans zero through 86400 seconds.
The camera document module accepts the linear and cubic-in-out curves.

Origin: backfill

#### Scenario: Move curve and time `director-054`

- **WHEN** a move supplies an invalid curve or time
- **THEN** the camera document module rejects unsupported curves and invalid duration or hold values
- **AND** duration 0.2 seconds passes and the camera document module rejects duration 0.19 seconds
- **AND** the move rejects an unsupported field

### Requirement: Height references

The camera document module MUST check ellipsoid height references.
Each endpoint that names no anchor supplies an ellipsoid height reference.

Origin: backfill

#### Scenario: Height references `director-055`

- **WHEN** a version 4 inline camera supplies a height reference
- **THEN** the camera document module accepts ellipsoid and rejects other references
- **AND** each inline endpoint rejects an absent height reference

### Requirement: Interaction targets

The interaction document module MUST check interaction pack targets.

Origin: backfill

#### Scenario: Interaction targets `director-056`

- **WHEN** an interaction names a pack target
- **THEN** the interaction document module accepts only a selected GeoJSON pack

### Requirement: Action fields

The interaction document module MUST reject unsupported interaction fields and types.

Origin: backfill

#### Scenario: Action fields `director-057`

- **WHEN** an action field supplies an unsupported field or type
- **THEN** the interaction document module rejects the field or type
- **AND** the card, focus, shot and layer action fields reject an extra field
- **AND** the interaction and its pack target reject an extra field
- **AND** the supported fields pass the check
- **AND** an inherited action type name gives a document error

### Requirement: Card source links

The interaction document module MUST check card source links.
HTTPS means Hypertext Transfer Protocol Secure.

Origin: backfill

#### Scenario: Card source links `director-058`

- **WHEN** a card supplies a source link
- **THEN** the interaction document module accepts HTTPS links without credentials, query text or fragments and rejects other links

### Requirement: Focus references

The interaction document module MUST check focus anchor references.

Origin: backfill

#### Scenario: Focus references `director-059`

- **WHEN** a focus action field names an anchor
- **THEN** the interaction document module rejects an unknown anchor

### Requirement: Shot references and baselines

The interaction document module MUST check target shots and layer baselines.

Origin: backfill

#### Scenario: Shot references and baselines `director-060`

- **WHEN** a shot action field names a target shot
- **THEN** the interaction document module rejects an unknown target shot
- **AND** the target shot needs a baseline for each layer that a layer action field of the same shot names
- **AND** a null interaction or an absent action field gives a document error

### Requirement: Layer state fields

The interaction document module MUST check layer states and shot baselines.

Origin: backfill

#### Scenario: Layer state fields `director-061`

- **WHEN** a layer action field names a layer state
- **THEN** the interaction document module needs a baseline set directly on the shot and a boolean state

### Requirement: Interaction text and limits

The interaction document module MUST check interaction text and collection limits.
A shot accepts at most 64 interactions.
The card accepts text of at most 4096 characters.
The card accepts a source URL of at most 2048 characters.

Origin: backfill

#### Scenario: Interaction text and limits `director-062`

- **WHEN** a shot supplies invalid interaction data
- **THEN** the interaction document module rejects excess interactions, duplicate IDs and invalid text
- **AND** the label accepts 256 characters and rejects 257 characters
- **AND** the source URL accepts 2048 characters and rejects 2049 characters

### Requirement: Portable interaction data

The interaction document module MUST keep interaction declarations when the document imports and exports them.

Origin: backfill

#### Scenario: Portable interaction data `director-063`

- **WHEN** the caller imports and exports valid interaction data
- **THEN** the document keeps the interaction declarations

### Requirement: Portable camera data

The camera document module MUST keep camera data when the document imports and exports it.
The test pose uses latitude 1 degree, longitude 2 degrees and height 3 meters.
Its heading is 4 degrees, pitch is zero degrees and roll is 6 degrees.

Origin: backfill

#### Scenario: Portable camera data `director-064`

- **WHEN** the caller imports and exports camera data
- **THEN** the document keeps anchor identity, camera poses and move declarations
- **AND** camera poses of versions 1 to 3 stay shots without a move

### Requirement: Initial session state

The interaction session module MUST start with inactive state.

Origin: backfill

#### Scenario: Initial session state `director-065`

- **WHEN** the caller creates a session
- **THEN** getState reports inactive state, zero interactions and absent selection
- **AND** getState reports active false, busy false, selected null and count zero
- **AND** the default state callback accepts each state change

### Requirement: Interaction activation

The interaction session module MUST activate interaction lists.

Origin: backfill

#### Scenario: Interaction activation `director-066`

- **WHEN** the caller activates an interaction list
- **THEN** getState reports its interaction total and active state for a nonempty list
- **AND** the state callback receives active false, busy false, selected null and count zero before the list changes
- **AND** the state callback receives active true, busy false, selected null and count 2 for IDs a and b
- **AND** an empty list gives the state callback active false, busy false, selected null and count zero twice

### Requirement: Inactive session admission

The interaction session module MUST return false for an inactive session.

Origin: backfill

#### Scenario: Inactive session admission `director-067`

- **WHEN** the caller dispatches an interaction in an inactive session
- **THEN** the session returns false without an adapter call

### Requirement: Busy session admission

The interaction session module MUST return false while the session is busy.

Origin: backfill

#### Scenario: Busy session admission `director-068`

- **WHEN** the caller dispatches another interaction while work remains active
- **THEN** the session returns false without a second adapter call

### Requirement: Unknown interaction admission

The interaction session module MUST return false for an unknown interaction ID.

Origin: backfill

#### Scenario: Unknown interaction admission `director-069`

- **WHEN** the caller dispatches an unknown ID in an active session
- **THEN** the session returns false without an adapter call

### Requirement: Successful adapter call

The interaction session module MUST return true for adapter results other than false.
The session adds one abort listener for each interaction.
It removes that listener when the interaction finishes.

Origin: backfill

#### Scenario: Successful adapter call `director-070`

- **WHEN** the adapter completes an interaction with a result other than false
- **THEN** the session returns true and gives idle state with the selected ID
- **AND** the session removes its abort listener
- **AND** the state callback receives active true, busy true, selected a and count 1 before the adapter call
- **AND** the state callback receives active true, busy false, selected a and count 1 after the adapter result
- **AND** adapter results zero and empty text give true
- **AND** `clear` does not abort a completed abort controller

### Requirement: Refused adapter call

The interaction session module MUST return false for a false adapter result.

Origin: backfill

#### Scenario: Refused adapter call `director-071`

- **WHEN** the adapter returns false
- **THEN** the session returns false and gives idle state

### Requirement: Adapter exceptions

The interaction session module MUST return false for adapter exceptions.

Origin: backfill

#### Scenario: Adapter exceptions `director-072`

- **WHEN** the adapter throws or rejects
- **THEN** the session returns false and allows another interaction

### Requirement: Interaction cancellation

The interaction session module MUST cancel active work when the caller clears the session.

Origin: backfill

#### Scenario: Interaction cancellation `director-073`

- **WHEN** the caller clears active work or the adapter sends an abort event
- **THEN** the session settles the result as false
- **AND** `clear` aborts the abort controller of the work
- **AND** the adapter does not run when `clear` precedes its call
- **AND** a second `clear` does not abort the old abort controller
- **AND** an abort event gives false while the signal still reports aborted false
- **AND** the first abort event removes the session abort listener
- **AND** `clear` gives the state callback active false, busy false, selected null and count zero

### Requirement: Session replacement

The interaction session module MUST keep new session state when old work completes.

Origin: backfill

#### Scenario: Session replacement `director-074`

- **WHEN** the caller activates new interactions before old work completes
- **THEN** the old result cannot change the new session state
- **AND** the state callback does not receive a state from old work after the new list starts
- **AND** the state callback receives selected old before the old adapter call and selected new before the new adapter call
- **AND** these states give active true, busy true and count 1
- **AND** the new list first gives the state callback active false, busy false, selected null and count zero
- **AND** the new list then gives the state callback active true, busy false, selected null and count 1
- **AND** the new result gives the state callback active true, busy false, selected new and count 1

### Requirement: Camera reference fields

From version 4, the camera document module MUST reject inline position fields and height references with a camera anchor reference.

Origin: backfill

#### Scenario: Camera reference fields `director-075`

- **WHEN** a version 4 camera names an anchor and an inline position field or height reference
- **THEN** the camera document module rejects that field
