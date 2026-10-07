## ADDED Requirements

### Requirement: Scene admission

The director MUST reject a scene request that cannot start.

Origin: backfill

#### Scenario: Scene guards `director-231`

- **WHEN** the director is destroyed or already active
- **THEN** the request reports the corresponding reason

#### Scenario: Queue guards `director-232`

- **WHEN** the queue is empty, or the after-shot ID is absent or last in the queue
- **THEN** the request reports no-shots, shot-not-found or scene-complete, respectively

#### Scenario: Camera admission `director-233`

- **WHEN** the camera policy refuses the scene
- **THEN** the request reports camera-unavailable

### Requirement: Scene playback

The director MUST play the selected queue through its scene adapter.

Origin: backfill

#### Scenario: Scene selection `director-234`

- **WHEN** a scene request supplies an ID or uses the selected or first scene
- **THEN** the queue starts at that scene

#### Scenario: Shot sequence `director-235`

- **WHEN** a scene starts with shots
- **THEN** the camera visits each shot in queue order

#### Scenario: Scene options `director-236`

- **WHEN** a request names its scene and selects single, afterShotId or preview
- **THEN** single limits the queue to the named scene
- **AND** afterShotId excludes that shot and the earlier shots
- **AND** preview stops final scene-owned layers and uses record mode
- **AND** panel playback does not stop those final layers or change record mode

#### Scenario: Load replacement `director-237`

- **WHEN** a scene starts while a shot load waits
- **THEN** the director aborts the load and changes its generation

#### Scenario: Scene metadata `director-238`

- **WHEN** a scene starts
- **THEN** the metadata records the queue total and estimated duration

#### Scenario: Scene error `director-239`

- **WHEN** the scene playback queue throws
- **THEN** the director records the error and completes its cleanup

### Requirement: Manual scene control

The director MUST support manual advancement and cancellation.

Origin: backfill

#### Scenario: Next shot `director-240`

- **WHEN** the operator requests the next shot
- **THEN** the director loads the next selected shot and wraps at the end
- **AND** a first scene supplies its ID when the scene selection is absent

#### Scenario: Next shot guards `director-241`

- **WHEN** the director is destroyed, active or without shots
- **THEN** the next-shot request does not load a shot

#### Scenario: Scene stop `director-242`

- **WHEN** the operator stops a scene
- **THEN** the director cancels its work and records the supplied reason

### Requirement: Pack and action state

The director MUST report pack, action and share state through their owners.

Origin: backfill

#### Scenario: Pack application `director-243`

- **WHEN** a pack owner completes, refuses or throws
- **THEN** the method reports success or failure and reports a live error

#### Scenario: State queries `director-244`

- **WHEN** the caller requests pack, action or share state
- **THEN** the query gives the owner state or its idle defaults

#### Scenario: Action activation `director-245`

- **WHEN** a shot activates its actions
- **THEN** the director passes the shot and pack targets to the action owner

#### Scenario: Action guards `director-246`

- **WHEN** an action arrives with a stopped signal, active scene or destroyed director
- **THEN** the director returns false

#### Scenario: Focus action `director-247`

- **WHEN** a focus action passes camera admission
- **THEN** the director places the camera at the scene anchor with pitch minus 90 degrees

#### Scenario: Layer action `director-248`

- **WHEN** a layer action names a registered layer
- **THEN** the director passes its enabled value and signal to the data manager

#### Scenario: Shot action `director-249`

- **WHEN** a shot action arrives below the transition limit
- **THEN** the director seeks to that shot and increases the transition total

### Requirement: Project files

The director MUST transfer project files through the document checks.

Origin: backfill

#### Scenario: Project export `director-250`

- **WHEN** the operator exports a valid project
- **THEN** the director downloads a JSON document and publishes project-exported

#### Scenario: Export error `director-251`

- **WHEN** the project fails document checks
- **THEN** the director reports the export error without a download

#### Scenario: Project import `director-252`

- **WHEN** a valid project file reaches the director
- **THEN** the director stops old work before it replaces and saves the project

#### Scenario: Import guards `director-253`

- **WHEN** an import loses its generation, signal or expected project
- **THEN** the director does not replace the project

#### Scenario: Import assets and selection `director-254`

- **WHEN** an import supplies local assets and selection
- **THEN** the director keeps only asset paths in the project and selects the supplied IDs

#### Scenario: Import error `director-255`

- **WHEN** a current import fails document checks or cannot supply JSON
- **THEN** the director reports the corresponding import error

#### Scenario: Metadata download `director-256`

- **WHEN** the operator requests metadata
- **THEN** the director downloads the last JSON record only when that record exists

### Requirement: Scene layers

The director MUST apply declared layers and stop scene-owned layers.

Origin: backfill

#### Scenario: Layer application `director-257`

- **WHEN** a declared registered layer changes state
- **THEN** the director passes scene origin to the manager
- **AND** the director passes the token signal when the token supplies a signal
- **AND** the director uses restoreLayerState for parameters when that method exists
- **AND** the director uses setEnabled before setLayerParams when parameters exist without restoreLayerState

#### Scenario: Layer refusal `director-258`

- **WHEN** a manager refuses a layer state
- **THEN** the result lists the refused layer and the director records its ID

#### Scenario: Layer cancellation `director-259`

- **WHEN** the token becomes canceled before or after a layer step
- **THEN** the result reports cancellation and stops further layer steps

#### Scenario: Scene-owned layers `director-260`

- **WHEN** a scene lists layer IDs for cleanup
- **THEN** the director disables each listed layer and reports failure or cancellation

#### Scenario: Context exit `director-261`

- **WHEN** a scene needs to leave an isolating context mode
- **THEN** the director requests off before it applies layers and reports success or failure

### Requirement: Scene camera and hold

The director MUST complete the shot camera phase before its hold phase.

Origin: backfill

#### Scenario: Authored camera `director-262`

- **WHEN** a shot supplies an authored camera move
- **THEN** the director passes the move and duration to its camera owner
- **AND** an interrupted move stops the scene unless the token is canceled or the director is destroyed

#### Scenario: Camera flight `director-263`

- **WHEN** a shot supplies an ordinary camera pose
- **THEN** the director flies to that pose with cubic ease and a duration of at least 0.2 seconds
- **AND** absent heading and roll values use zero degrees
- **AND** an absent pitch uses minus 35 degrees, while zero pitch stays zero

#### Scenario: Flight completion `director-264`

- **WHEN** the flight completes, cancels or reaches its safety timeout
- **THEN** the camera promise settles

#### Scenario: Shot hold `director-265`

- **WHEN** a shot supplies a media hold owner
- **THEN** the director waits for each busy owner within its time bound
- **AND** the time bound stays between zero and 20000 milliseconds
- **AND** a shot without a media hold owner waits for its effective hold duration

#### Scenario: Clock methods `director-266`

- **WHEN** the caller requests a wait or a progress ticker
- **THEN** the director passes its arguments to the clock

### Requirement: Scene finish and presentation

The director MUST complete scene cleanup and update its presentation state.

Origin: backfill

#### Scenario: Scene finish `director-267`

- **WHEN** a scene completes or stops
- **THEN** the director stops its owners and archives metadata with its cancellation state

#### Scenario: Final clock `director-268`

- **WHEN** the clock snapshot names a current or absent scene and shot
- **THEN** the director publishes an idle clock only for a current scene and shot
- **AND** the director settles idle waiters

#### Scenario: Presentation helpers `director-269`

- **WHEN** the caller changes buttons, playback, keyboard, progress, status or runtime
- **THEN** the director publishes the corresponding state change

#### Scenario: Event log `director-270`

- **WHEN** an active scene records an event
- **THEN** the director records its timestamp, type and payload
