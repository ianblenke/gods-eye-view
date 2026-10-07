# director Specification

## Purpose
The director capability states the public behavior of the scene director code.
The capability covers the document module, the fields module, the author module, the clock, the timeline module and the playback module.
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

