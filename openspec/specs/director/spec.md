# director Specification

## Purpose
The director capability states the public behavior of the scene director code.
The capability covers the document module, the fields module, the author module, the clock module, the timeline module and the playback module.
The capability also covers the camera module, the camera document module, the interaction document module and the interaction session module.
The capability also covers the pack validators, the geometry decoder, the pack session and the directory source.
The capability also covers the bundle helpers, the byte store, the share helpers and the preview.
Later backfill changes add the other parts of the scene director.
## Requirements
### Requirement: Document behavior
The document module MUST accept valid documents and reject invalid document fields.
Origin: backfill

#### Scenario: Keep authored content `director-001`
- **WHEN** a valid project passes through export and import
- **THEN** the document keeps authored fields

#### Scenario: Keep an empty project `director-002`
- **WHEN** the document contains an empty scene list
- **THEN** the scene list stays empty

#### Scenario: Import supported document versions `director-003`
- **WHEN** a document enters validation or migration at a supported version
- **THEN** the migration keeps stable IDs after export
- **AND** versions 4, 5 and 6 accept scene anchors and shot move fields
- **AND** versions 1, 2 and 3 reject scene anchors and shot move fields
- **AND** versions 5 and 6 accept scene data packs and shot data pack IDs
- **AND** versions 1, 2, 3 and 4 reject scene data packs and shot data pack IDs
- **AND** version 6 accepts an empty shot interactions list

#### Scenario: Reject invalid documents `director-004`
- **WHEN** a document contains an invalid shape, version, field or duplicate ID
- **THEN** validation rejects the document with a field path
- **AND** a duplicate scene ID gives path `$.scenes[1].id`

### Requirement: Fields behavior
The fields module MUST check object fields, text, numbers, collections, IDs and JSON complexity.
Origin: backfill

#### Scenario: Check object fields `director-005`
- **WHEN** the object or field check receives invalid input
- **THEN** the check rejects invalid objects and unsupported fields

#### Scenario: Check text `director-006`
- **WHEN** the text check receives text or invalid input
- **THEN** the check accepts text that is not empty within its length limit and rejects other input
- **AND** the default limit accepts 256 characters and rejects 257 characters
- **AND** 257 characters at path `$` give a `SceneDocumentError` with path `$`

#### Scenario: Check numbers `director-007`
- **WHEN** the number check receives a value and numeric bounds
- **THEN** the check accepts finite values within bounds and legacy numeric text

#### Scenario: Check optional fields `director-008`
- **WHEN** an optional field exists on the object
- **THEN** the check calls its validator only for an own field

#### Scenario: Check collections and IDs `director-009`
- **WHEN** a collection or ID check receives values
- **THEN** the check rejects invalid collections, invalid IDs and duplicate IDs

#### Scenario: Bound document complexity `director-010`
- **WHEN** a JSON tree exceeds its node or depth limit
- **THEN** the check rejects the tree

#### Scenario: Check JSON values `director-011`
- **WHEN** the JSON tree check receives primitive values or objects
- **THEN** the check accepts JSON values and rejects other values and custom prototypes

#### Scenario: Bound JSON text and keys `director-012`
- **WHEN** a JSON tree contains long text, excess entries or an unsafe key
- **THEN** the check rejects the tree

### Requirement: Document bounds
The document module MUST check input size, visual controls, metadata, shot time and layer state.
Origin: backfill

#### Scenario: Bound document input `director-013`
- **WHEN** the parser receives invalid JSON, input that is not text or text over its byte limit
- **THEN** the parser rejects the input

#### Scenario: Check visual text and objects `director-014`
- **WHEN** a shot contains visual text or style parameters
- **THEN** validation checks each supplied field
- **AND** an unknown visual field gives path `$.scenes[0].shots[0].visual.extra`

#### Scenario: Check visual controls `director-015`
- **WHEN** a shot contains a visual control
- **THEN** validation checks each supplied control field against its type and bounds
- **AND** an unknown bloom field gives path `$.scenes[0].shots[0].visual.bloom.extra`

#### Scenario: Check document metadata `director-016`
- **WHEN** a document contains date text, scene text or pack metadata
- **THEN** validation checks each supplied field
- **AND** an unknown pack field gives path `$.scenes[0].appliedShotPacks[0].extra`
- **AND** a duplicate pack ID gives path `$.scenes[0].appliedShotPacks[1].id`

#### Scenario: Check shot time `director-017`
- **WHEN** a shot contains duration or hold values
- **THEN** validation accepts values from zero through 86400 seconds and rejects values outside that range

#### Scenario: Check layers and shot limits `director-018`
- **WHEN** a document contains layer state or excess shots
- **THEN** validation checks layer state and rejects excess shots
- **AND** an unknown layer field gives path `$.scenes[0].shots[0].layers.traffic.extra`

### Requirement: Author behavior
The author module MUST edit selected scene and shot details and copy selected scenes for export.
Origin: backfill

#### Scenario: Edit selected details `director-019`
- **WHEN** the caller edits valid details of a selected scene and shot
- **THEN** the result holds the new details and keeps other authored content and does not change the source

#### Scenario: Reject invalid details `director-020`
- **WHEN** the caller selects an absent scene or shot, or supplies unsupported details
- **THEN** the edit rejects the input

#### Scenario: Remove absent details `director-021`
- **WHEN** the caller supplies a detail object without an editable field
- **THEN** the result removes that field

#### Scenario: Select one scene `director-022`
- **WHEN** the caller selects a scene for export
- **THEN** the result contains only that scene and does not change the source

### Requirement: Clock behavior
The clock module MUST publish copied scene time, report progress and cancel its timers and holds.
Origin: backfill

#### Scenario: Publish copied clock state `director-023`
- **WHEN** the clock publishes scene time
- **THEN** subscribers get bounded time and copied state
- **AND** a clock outside playback gives `running: false` without an option
- **AND** elapsed time -2 gives elapsed time 0 and scene progress 0
- **AND** a clock without a snapshot keeps null for an absent scene, absent shot or destroyed clock
- **AND** a subscriber error gives one warning and leaves elapsed time at 1 second
- **AND** each later subscriber gets elapsed time 1 second, duration 4 seconds, progress 0.25 and `running: true`
- **AND** each later subscriber gets scene ID `scene`, shot ID `shot`, shot index 0, shot count 1 and `seeking: false`
- **AND** total duration 0 gives scene progress 0

#### Scenario: Stop clock resources `director-024`
- **WHEN** the clock stops or ends
- **THEN** it cancels owned timers and prevents stale callbacks from new progress
- **AND** the stop method after a snapshot gives `stopped: true` and `running: false`
- **AND** each subscriber gets the snapshot with `stopped: true` and `running: false` after the stop method
- **AND** a subscriber error does not leave the stop method
- **AND** a second call of the stop method gives zero new subscriber calls
- **AND** the stop method before the first snapshot leaves it null and leaves zero active timers
- **AND** `_destroyed: true` with an absent stopped field gives zero new subscriber calls and keeps that field absent

#### Scenario: Settle hold deadlines `director-025`
- **WHEN** a hold ends or its token cancels
- **THEN** the clock settles the hold and removes its deadline

#### Scenario: Own subscriptions `director-026`
- **WHEN** a subscriber joins or leaves the clock
- **THEN** the clock gives current state and removes the subscriber on request
- **AND** a value that is not a function on a fresh clock gives a callable unsubscribe function and zero subscribers
- **AND** a destroyed clock adds zero subscribers

#### Scenario: Report playback progress `director-027`
- **WHEN** the clock measures playback time
- **THEN** it reports elapsed time against a duration of at least one second
- **AND** a stopped, replaced or destroyed tick gives zero progress calls
- **AND** the default timer gives a number and one active timer before the destroy method
- **AND** the destroy method leaves zero active timers

#### Scenario: Report shot progress `director-028`
- **WHEN** a shot that a person selects outside playback advances or ends
- **THEN** the clock interpolates progress and scene time and removes its completed timer

#### Scenario: Reject cancelled shot work `director-029`
- **WHEN** a token, callback or clock cancels shot work outside playback
- **THEN** the clock prevents later progress from that work
- **AND** an active playback clock gives zero progress calls and zero shot timers for a shot outside playback

#### Scenario: Report scene time `director-030`
- **WHEN** an active scene clock advances
- **THEN** the clock bounds elapsed shot time and prevents cancelled work from new state

### Requirement: Timeline behavior
The timeline module MUST calculate shot boundaries, scene time and camera poses.
Origin: backfill

#### Scenario: Calculate shot boundaries `director-031`
- **WHEN** the timeline receives a scene and a shot
- **THEN** it returns cumulative boundaries and normalized progress

#### Scenario: Handle absent or zero time `director-032`
- **WHEN** the timeline receives absent shots or a zero total duration
- **THEN** it returns empty or zero time results
- **AND** an absent shot ID in a scene of 10 seconds gives shot index -1
- **AND** the timeline gives start time 0, end time 0 and start progress 0

#### Scenario: Interpolate ordinary camera poses `director-033`
- **WHEN** the timeline receives camera endpoints and progress
- **THEN** it uses bounded cubic progress and the shortest arc for heading and for roll
- **AND** heading 350 degrees to 10 degrees gives 360 degrees at progress 0.5
- **AND** roll 350 degrees to 10 degrees gives 360 degrees at progress 0.5
- **AND** roll 10 degrees to 350 degrees gives 0 degrees at progress 0.5 while heading 350 degrees to 10 degrees gives 360 degrees

#### Scenario: Select a shot at scene time `director-034`
- **WHEN** a person seeks within a scene
- **THEN** the timeline selects the shot and calculates flight and hold progress

#### Scenario: Use camera endpoints for seek `director-035`
- **WHEN** a person seeks an ordinary shot or a shot that gives a move
- **THEN** the timeline returns the camera pose for that time

### Requirement: Playback behavior
The playback module MUST build shot queues, call adapter phases and release scene resources.
Origin: backfill

#### Scenario: Build a shot queue `director-036`
- **WHEN** the caller selects a start scene or a single scene
- **THEN** the queue for a start scene starts there and wraps to the earlier scenes
- **AND** the start scene `b` gives shots `b1`, `a1` and `a2` in that order
- **AND** an unknown start ID gives shots `a1`, `a2` and `b1` in that order
- **AND** a single scene `a` gives only shots `a1` and `a2` in that order
- **AND** each queue entry holds the same shot object as the source scene
- **AND** the scene field of each queue entry holds the source scene object
- **AND** the queue skips empty scenes

#### Scenario: Run shot phases `director-037`
- **WHEN** the adapter accepts a shot queue
- **THEN** playback calls each phase in order and completes the queue
- **AND** each phase receives its own index and total fields
- **AND** shots `b1`, `a1` and `a2` give indices 0, 1 and 2 with total 3

#### Scenario: Stop cancelled work `director-038`
- **WHEN** a token cancels before or during playback
- **THEN** playback stops later work and releases acquired scenes

#### Scenario: Transfer scene resources `director-039`
- **WHEN** playback enters another scene or ends
- **THEN** it releases scenes as the handoff and final cleanup options specify
- **AND** a refused initial handoff starts no shot

#### Scenario: Propagate adapter errors `director-040`
- **WHEN** an adapter phase or cleanup fails
- **THEN** playback rejects with the error after applicable cleanup

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

### Requirement: Data pack manifests

The data pack validators MUST accept valid declarations and reject invalid declarations.

Origin: backfill

#### Scenario: Asset paths `director-076`

- **WHEN** a caller supplies a relative asset path
- **THEN** the validator accepts safe directory names and rejects traversal or URL syntax
- **AND** The validator accepts paths of at most 1024 characters and rejects longer paths.

#### Scenario: Data pack formats `director-077`

- **WHEN** a caller supplies a data pack manifest
- **THEN** the validator accepts version 1 and the geojson, image and media formats
- **AND** The validator rejects other versions and formats.
- **AND** The data pack ID and source name each accept at most 256 characters.

#### Scenario: Data pack attribution `director-078`

- **WHEN** a data pack declares attribution
- **THEN** the validator checks text, license and an optional HTTPS link without credentials, query or fragment
- **AND** Text and license each accept at most 4096 characters; the HTTPS link accepts at most 2048 characters.

#### Scenario: Data pack integrity fields `director-079`

- **WHEN** a data pack declares byteLength or sha256
- **THEN** the validator checks a positive integer up to 8388608 bytes and a lowercase hexadecimal digest of 64 characters
- **AND** The validator rejects 63-character, 65-character and uppercase digests, and accepts exactly 64 lowercase hexadecimal characters.

#### Scenario: Image placement `director-080`

- **WHEN** an image data pack declares placement
- **THEN** the validator checks geographic bounds, ordered edges, height and the ellipsoid reference
- **AND** The validator rejects equal west and east edges, and equal south and north edges.
- **AND** The validator accepts longitude limits of -180 and 180 degrees, and latitude limits of -90 and 90 degrees.
- **AND** The validator rejects numeric text for bounds and height.

#### Scenario: Media placement `director-081`

- **WHEN** a media data pack declares placement
- **THEN** the validator checks its scene anchor reference

#### Scenario: Scene data pack references `director-082`

- **WHEN** a scene declares data packs or data pack IDs for a shot
- **THEN** the validator rejects duplicate data pack IDs, unknown shot references and duplicate shot references
- **AND** The validator ignores a data pack list from the parent object of the scene.

### Requirement: Data pack geometry

The geometry decoder MUST return IDs, geometry types and coordinates without feature properties.

Origin: backfill

#### Scenario: GeoJSON collections `director-083`

- **WHEN** a caller decodes GeoJSON
- **THEN** the decoder checks a FeatureCollection with an array of at most 2000 features
- **AND** The decoder rejects invalid UTF8 bytes and null.

#### Scenario: GeoJSON feature IDs `director-084`

- **WHEN** a collection contains features
- **THEN** the decoder checks Feature types and distinct nonblank string IDs of at most 256 characters
- **AND** The decoder rejects a null feature with the feature ID error.

#### Scenario: Geographic positions `director-085`

- **WHEN** a geometry supplies positions without inherited coordinate values
- **THEN** the decoder checks finite longitude, latitude and height within geographic limits
- **AND** The decoder accepts at most 50000 positions and gives zero meters for an absent height.

#### Scenario: Lines and rings `director-086`

- **WHEN** a geometry supplies a line or ring
- **THEN** the decoder checks minimum lengths and closed rings

#### Scenario: Geometry output `director-087`

- **WHEN** a collection contains geometry
- **THEN** the decoder returns IDs, geometry types and coordinates without properties
- **AND** The decoder rejects unsupported or absent geometry and accepts at most 128 polygon rings.

### Requirement: Data pack sessions

The data pack session MUST load valid assets and dispose its resources when the caller clears or destroys it.

Origin: backfill

#### Scenario: Session admission `director-088`

- **WHEN** a caller creates a session
- **THEN** the session starts with the idle state and its load method checks data pack lists before asset work
- **AND** The load method accepts at most eight data packs and checks every declaration before the first source call.
- **AND** The load method returns false for a destroyed session or a cancelled signal.

#### Scenario: Session resources `director-089`

- **WHEN** a session loads assets
- **THEN** after success, the session reports the ready state and disposes its handles when the caller clears or destroys it
- **AND** The session rejects a null handle or a handle without a dispose function.
- **AND** During asset work, the session reports the loading state.
- **AND** A change to a returned state object does not change the session state.
- **AND** The session removes the deadline timer after success or clear.

#### Scenario: Session cancellation `director-090`

- **WHEN** a caller cancels asset work that is not complete
- **THEN** the session returns false and disposes late renderer resources

#### Scenario: Session replacement `director-091`

- **WHEN** a caller replaces asset work that is not complete
- **THEN** the old load call returns false and leaves the new resources intact

#### Scenario: Session errors `director-092`

- **WHEN** a source fails or the asset deadline expires
- **THEN** the session removes partial resources and reports a stable error
- **AND** with no registered source and a byteLength field in the declaration, the load method reads that field once, during validation
- **AND** The default deadline is 15000 milliseconds.
- **AND** With no renderer, the load method does not call the registered source.
- **AND** The session disposes each partial resource when the deadline expires.

#### Scenario: Session asset checks `director-093`

- **WHEN** a source returns bytes for a data pack
- **THEN** the session checks byte type, size, total bytes and declared integrity before the renderer call
- **AND** The session accepts up to 8388608 bytes per asset and up to 33554432 total bytes.
- **AND** The source receives the source path and the byteLength field or the default byte limit.
- **AND** The renderer receives the asset and the abort signal of the source call.

### Requirement: Asset sources

The directory source MUST use its directory URL and reject bytes above the asset limit.

Origin: backfill

#### Scenario: Asset directory configuration `director-094`

- **WHEN** a caller registers an asset directory
- **THEN** the source checks an HTTP or HTTPS directory without credentials, query or fragment

#### Scenario: Asset request options `director-095`

- **WHEN** a caller asks for a safe asset path
- **THEN** the source uses the registered directory and fixed request options: no credentials, redirects as errors, no referrer, no cache
- **AND** Without a caller fetch function, the directory source uses the global fetch function.

#### Scenario: Asset stream limits `director-096`

- **WHEN** a source reads an asset stream
- **THEN** the source checks header and stream byte limits and joins its chunks
- **AND** The source removes media type parameters and space, and changes the media type to lowercase text.
- **AND** An absent media type gives empty text.

#### Scenario: Asset source cleanup `director-097`

- **WHEN** an asset request fails or its signal stops it
- **THEN** the source rejects the asset request and releases stream resources

### Requirement: Scene bundles

The bundle helpers MUST check supplied assets and keep the source project.

Origin: backfill

#### Scenario: Share text admission `director-098`

- **WHEN** a caller supplies project share text
- **THEN** the bundle helpers check text type, byte limits and JSON syntax

#### Scenario: Bundle asset entries `director-099`

- **WHEN** a caller supplies bundle assets
- **THEN** the bundle helpers check fields, paths, media types, distinct paths and base64 syntax
- **AND** The bundle helpers accept at most 64 assets and reject 65 different paths.
- **AND** The bundle helpers accept up to 8388608 bytes per asset and up to 33554432 total bytes.
- **AND** The base64 length limit is 11184812 characters.
- **AND** The bundle helpers reject a bundle version other than 1.

#### Scenario: Bundle asset references `director-100`

- **WHEN** a bundle declares data pack assets
- **THEN** the bundle helpers check asset digests and exact data pack references

#### Scenario: Bundle export copy `director-101`

- **WHEN** a caller exports a project with supplied assets
- **THEN** the bundle helpers copy the project and write bundle paths, byte lengths and digests

#### Scenario: Bundle export limits `director-102`

- **WHEN** a caller supplies assets for bundle export
- **THEN** the bundle helpers check byte limits, media types, asset totals and declared integrity
- **AND** The bundle helpers accept up to 8388608 bytes per asset and up to 33554432 total bytes.
- **AND** The bundle helpers reject an unsupported media type during export.

#### Scenario: Shared asset reuse `director-103`

- **WHEN** data packs use the same source and path
- **THEN** the bundle helpers write one asset and reject integrity declarations that differ

### Requirement: Bundle byte store

The byte store MUST copy the asset map and return byte copies.

Origin: backfill

#### Scenario: Bundle byte ownership `director-104`

- **WHEN** a caller replaces or clears bundle bytes
- **THEN** the store copies the map and reports its current byte total

#### Scenario: Bundle byte access `director-105`

- **WHEN** a caller asks for stored bundle bytes
- **THEN** the store returns a byte copy and rejects absent or excess bytes and a cancelled asset call

### Requirement: Share work

The share helpers MUST check file budgets and settle signal cancellation.

Origin: backfill

#### Scenario: Share file budgets `director-106`

- **WHEN** a caller supplies a project file
- **THEN** the share helpers check the file suffix and size before text access
- **AND** The file limit is 5242880 bytes, or 52428800 bytes for a name with the .gevbundle.json suffix.
- **AND** The share helpers accept the limit and reject one more byte.

#### Scenario: Share work cancellation `director-107`

- **WHEN** share work uses a signal
- **THEN** the helper rejects cancelled work and settles successful work or errors
- **AND** The bundle helpers check the signal before each asset and after each digest during import and export.
- **AND** During export, the bundle helpers also check the signal after the asset result.

### Requirement: Share preview

The preview MUST report project content and dependencies.

Origin: backfill

#### Scenario: Preview totals `director-108`

- **WHEN** a caller describes a shared project
- **THEN** the preview reports scene, shot and byte totals with data pack attribution

#### Scenario: Preview source states `director-109`

- **WHEN** a preview describes a data pack source
- **THEN** the preview reports included, absent, configured or unavailable source states

#### Scenario: Preview dependencies `director-110`

- **WHEN** a preview describes scene dependencies
- **THEN** the preview reports absent layers and applied shot packs and shot source pack IDs
- **AND** The preview lists each absent layer once, even when two shots name that layer.

