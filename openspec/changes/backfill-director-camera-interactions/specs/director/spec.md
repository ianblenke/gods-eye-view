## ADDED Requirements

### Requirement: Absent camera data

The director MUST support the current absent camera data behavior.

Origin: backfill

#### Scenario: Absent camera data `director-041`

- **WHEN** the caller supplies an absent camera or move
- **THEN** the resolver returns null

### Requirement: Inline camera poses

The director MUST support the current inline camera poses behavior.

Origin: backfill

#### Scenario: Inline camera poses `director-042`

- **WHEN** the caller supplies an inline camera pose
- **THEN** the resolver copies its position and orientation

### Requirement: Scene anchor poses

The director MUST support the current scene anchor poses behavior.

Origin: backfill

#### Scenario: Scene anchor poses `director-043`

- **WHEN** the caller names a scene anchor
- **THEN** the resolver uses the anchor position and rejects an unknown anchor

### Requirement: Default orientation

The director MUST support the current default orientation behavior.

Origin: backfill

#### Scenario: Default orientation `director-044`

- **WHEN** the camera leaves orientation fields absent
- **THEN** the resolver gives heading zero, pitch minus 35 and roll zero

### Requirement: Explicit camera moves

The director MUST support the current explicit camera moves behavior.

Origin: backfill

#### Scenario: Explicit camera moves `director-045`

- **WHEN** the shot supplies a move
- **THEN** the resolver gives both poses, the curve name and the shot duration

### Requirement: Camera progress bounds

The director MUST support the current camera progress bounds behavior.

Origin: backfill

#### Scenario: Camera progress bounds `director-046`

- **WHEN** the caller samples a move outside its progress bounds
- **THEN** the sampler returns a copy of the exact endpoint

### Requirement: Linear camera samples

The director MUST support the current linear camera samples behavior.
The table gives the endpoints and midpoint for the linear sample tests.

| Field | Start | Destination | Midpoint |
| --- | ---: | ---: | ---: |
| Latitude | 10 | 12 | 11 |
| Longitude | 179 | -179 | -180 |
| Height | 400 | 800 | 600 |
| Heading | 350 | 10 | 360 |
| Pitch | -40 | 0 | -20 |
| Roll | 350 | 10 | 360 |

Origin: backfill

#### Scenario: Linear camera samples `director-047`

- **WHEN** the caller samples a linear move at its midpoint
- **THEN** the sampler interpolates position and takes the shortest longitude, heading and roll arcs

### Requirement: Cubic camera samples

The director MUST support the current cubic camera samples behavior.
For latitude 10 to 12, cubic progress 0.25 gives 10.125 and progress 0.75 gives 11.875.
The table gives both cubic samples for the linear sample endpoints.

| Field | Progress 0.25 | Progress 0.75 |
| --- | ---: | ---: |
| Latitude | 10.125 | 11.875 |
| Longitude | 179.125 | -179.125 |
| Height | 425 | 775 |
| Heading | 351.25 | 368.75 |
| Pitch | -37.5 | -2.5 |
| Roll | 351.25 | 368.75 |

Origin: backfill

#### Scenario: Cubic camera samples `director-048`

- **WHEN** the caller samples each half of a cubic curve
- **THEN** the sampler gives the cubic position for each half

### Requirement: Camera position fields

The director MUST support the current camera position fields behavior.
Latitude spans minus 90 through 90 degrees.
Longitude spans minus 180 through 180 degrees.
Height spans minus 12000 through 1000000000 meters.

Origin: backfill

#### Scenario: Camera position fields `director-049`

- **WHEN** a camera supplies invalid position data
- **THEN** the validator rejects each invalid latitude, longitude or altitude
- **AND** the validator gives a document error for a null pose

### Requirement: Camera orientation fields

The director MUST support the current camera orientation fields behavior.
The validator accepts heading and roll from minus 360 through 360 degrees.
The validator accepts pitch from minus 90 through 90 degrees.

Origin: backfill

#### Scenario: Camera orientation fields `director-050`

- **WHEN** a camera supplies invalid orientation fields
- **THEN** the validator rejects each invalid heading, pitch or roll

### Requirement: Camera version rules

The director MUST support the current camera version rules behavior.

Origin: backfill

#### Scenario: Camera version rules `director-051`

- **WHEN** the caller checks camera data with different versions
- **THEN** the validator accepts legacy numeric text only before version three and anchor references only from version four

### Requirement: Scene anchor fields

The director MUST support the current scene anchor fields behavior.
A scene accepts at most 1024 anchors.
Each anchor supplies an ID, latitude, longitude, height and ellipsoid height reference.

Origin: backfill

#### Scenario: Scene anchor fields `director-052`

- **WHEN** the scene supplies invalid anchor data
- **THEN** the validator rejects invalid IDs, duplicate IDs, titles, coordinates and height references

### Requirement: Explicit endpoint fields

The director MUST support the current explicit endpoint fields behavior.

Origin: backfill

#### Scenario: Explicit endpoint fields `director-053`

- **WHEN** a move leaves an inline endpoint coordinate absent
- **THEN** the validator rejects each absent latitude, longitude or altitude

### Requirement: Move curve and time

The director MUST support the current move curve and time behavior.
Move duration spans 0.2 through 86400 seconds.
Hold duration spans zero through 86400 seconds.
The validator accepts the linear and cubic-in-out curves.

Origin: backfill

#### Scenario: Move curve and time `director-054`

- **WHEN** a move supplies an invalid curve or time
- **THEN** the validator rejects unsupported curves and invalid duration or hold values

### Requirement: Height references

The director MUST support the current height references behavior.
Each inline endpoint of an explicit move supplies an ellipsoid height reference.

Origin: backfill

#### Scenario: Height references `director-055`

- **WHEN** a version 4 inline camera supplies a height reference
- **THEN** the validator accepts ellipsoid and rejects other references

### Requirement: Interaction targets

The director MUST support the current interaction targets behavior.

Origin: backfill

#### Scenario: Interaction targets `director-056`

- **WHEN** an action names a pack target
- **THEN** the validator accepts only a selected GeoJSON pack

### Requirement: Action fields

The director MUST support the current action fields behavior.

Origin: backfill

#### Scenario: Action fields `director-057`

- **WHEN** an action supplies an unsupported field or type
- **THEN** the validator rejects the field or type

### Requirement: Card source links

The director MUST support the current card source links behavior.

Origin: backfill

#### Scenario: Card source links `director-058`

- **WHEN** a card supplies a source link
- **THEN** the validator accepts HTTPS links without credentials, query text or fragments and rejects other links

### Requirement: Focus references

The director MUST support the current focus references behavior.

Origin: backfill

#### Scenario: Focus references `director-059`

- **WHEN** a focus action names an anchor
- **THEN** the validator rejects an unknown anchor

### Requirement: Shot references and baselines

The director MUST support the current shot references and baselines behavior.

Origin: backfill

#### Scenario: Shot references and baselines `director-060`

- **WHEN** a shot action names a destination
- **THEN** the validator rejects unknown shots and destinations without each interactive layer baseline

### Requirement: Layer state fields

The director MUST support the current layer state fields behavior.

Origin: backfill

#### Scenario: Layer state fields `director-061`

- **WHEN** a layer action names a layer state
- **THEN** the validator needs an own shot baseline and a boolean state

### Requirement: Interaction text and limits

The director MUST support the current interaction text and limits behavior.
A shot accepts at most 64 actions.
The card accepts text of at most 4096 characters.
The card accepts a source URL of at most 2048 characters.

Origin: backfill

#### Scenario: Interaction text and limits `director-062`

- **WHEN** a shot supplies invalid interaction data
- **THEN** the validator rejects excess items, duplicate IDs and invalid text

### Requirement: Portable action data

The director MUST support the current portable action data behavior.

Origin: backfill

#### Scenario: Portable action data `director-063`

- **WHEN** the caller imports and exports valid action data
- **THEN** the document keeps the action declarations

### Requirement: Portable camera data

The director MUST support the current portable camera data behavior.
The legacy test pose uses latitude 1, longitude 2, height 3, heading 4, pitch zero and roll 6.

Origin: backfill

#### Scenario: Portable camera data `director-064`

- **WHEN** the caller imports and exports camera data
- **THEN** the document keeps anchor identity, camera poses and move declarations
- **AND** legacy camera poses stay ordinary shots

### Requirement: Initial session state

The director MUST support the current initial session state behavior.

Origin: backfill

#### Scenario: Initial session state `director-065`

- **WHEN** the caller creates a session
- **THEN** the session reports inactive state, zero actions and absent selection

### Requirement: Action activation

The director MUST support the current action activation behavior.

Origin: backfill

#### Scenario: Action activation `director-066`

- **WHEN** the caller activates an action list
- **THEN** the session reports its action total and active state for a nonempty list

### Requirement: Inactive session admission

The director MUST support the current inactive session admission behavior.

Origin: backfill

#### Scenario: Inactive session admission `director-067`

- **WHEN** the caller dispatches an action in an inactive session
- **THEN** the session returns false without action execution

### Requirement: Busy session admission

The director MUST support the current busy session admission behavior.

Origin: backfill

#### Scenario: Busy session admission `director-068`

- **WHEN** the caller dispatches another action while work remains active
- **THEN** the session returns false without a second execution

### Requirement: Unknown action admission

The director MUST support the current unknown action admission behavior.

Origin: backfill

#### Scenario: Unknown action admission `director-069`

- **WHEN** the caller dispatches an unknown ID in an active session
- **THEN** the session returns false without action execution

### Requirement: Successful action execution

The director MUST support the current successful action execution behavior.
The session adds one abort listener for each action.
It removes that listener when the action finishes.

Origin: backfill

#### Scenario: Successful action execution `director-070`

- **WHEN** the adapter completes an action with a result other than false
- **THEN** the session returns true and reports idle state with the selected ID
- **AND** the session removes its abort listener

### Requirement: Refused action execution

The director MUST support the current refused action execution behavior.

Origin: backfill

#### Scenario: Refused action execution `director-071`

- **WHEN** the adapter returns false
- **THEN** the session returns false and reports idle state

### Requirement: Action exceptions

The director MUST support the current action exceptions behavior.

Origin: backfill

#### Scenario: Action exceptions `director-072`

- **WHEN** the adapter throws or rejects
- **THEN** the session returns false and permits another action

### Requirement: Action cancellation

The director MUST support the current action cancellation behavior.

Origin: backfill

#### Scenario: Action cancellation `director-073`

- **WHEN** the caller clears a session with active work
- **THEN** the session aborts the action signal and settles the result as false

### Requirement: Session replacement

The director MUST support the current session replacement behavior.

Origin: backfill

#### Scenario: Session replacement `director-074`

- **WHEN** the caller activates new actions before old work completes
- **THEN** the old result cannot change the new session state


### Requirement: Camera reference fields

From version 4, the director MUST reject inline position fields and height references with a camera anchor reference.

Origin: backfill

#### Scenario: Camera reference fields `director-075`

- **WHEN** a version 4 camera names an anchor and an inline position field or height reference
- **THEN** the validator rejects that field
