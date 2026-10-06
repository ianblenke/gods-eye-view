## ADDED Requirements

### Requirement: The initial selection

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The initial selection `director-111`

- WHEN the director reads a project with shots
- THEN the director selects the first scene and its first shot

### Requirement: The empty project

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The empty project `director-112`

- WHEN the director reads an empty project
- THEN the scene and shot selections equal null

### Requirement: The absent saved project

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The absent saved project `director-113`

- WHEN storage gives no project text
- THEN the director uses the default project

### Requirement: The rejected saved project

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The rejected saved project `director-114`

- WHEN storage gives text that document validation rejects
- THEN the director records the error and protects the saved bytes

### Requirement: The storage access error

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The storage access error `director-115`

- WHEN storage throws during project access
- THEN the director records the error and uses the default project

### Requirement: The project normalization

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The project normalization `director-116`

- WHEN storage gives a version three project
- THEN the director converts the project to version six

### Requirement: The scene migration anchor

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene migration anchor `director-117`

- WHEN a saved project contains the primary scene anchor
- THEN the director adds the Nepal scene after the anchor

### Requirement: The scene migration fallback

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene migration fallback `director-118`

- WHEN a saved project contains only the fallback scene anchor
- THEN the director adds the Nepal scene after that anchor

### Requirement: The scene migration marker

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene migration marker `director-119`

- WHEN a saved project records the Nepal installation marker
- THEN the director does not add the Nepal scene again

### Requirement: The scene migration identity

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene migration identity `director-120`

- WHEN a saved project already contains the Nepal scene ID or title
- THEN the director records its installation without a duplicate scene

### Requirement: The absent migration anchor

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The absent migration anchor `director-121`

- WHEN a saved project contains neither scene anchor
- THEN the director does not add the Nepal scene

### Requirement: The migration storage error

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The migration storage error `director-122`

- WHEN storage rejects the migrated project
- THEN the director keeps the migrated project in memory

### Requirement: The installed pack upgrade

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The installed pack upgrade `director-123`

- WHEN an installed pack version lies in its expansion range
- THEN the constructor requests the pack upgrade without a presentation change

### Requirement: The camera input events

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The camera input events `director-124`

- WHEN a camera gesture occurs with authored camera ownership
- THEN the director stops the scene unless it claims the camera

### Requirement: The active pointer action

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The active pointer action `director-125`

- WHEN a pointer press occurs with active interactions
- THEN the director leaves authored camera ownership in place

### Requirement: The layer visibility request

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The layer visibility request `director-126`

- WHEN a user, voice or tool request disables a scene layer
- THEN the director stops the scene

### Requirement: The unrelated visibility request

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The unrelated visibility request `director-127`

- WHEN a request enables a layer or targets an unrelated layer or origin
- THEN the director does not stop the scene

### Requirement: The work settlement

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The work settlement `director-128`

- WHEN tracked work settles with success or an error
- THEN the director removes the work from its pending set

### Requirement: The shutdown promise

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The shutdown promise `director-129`

- WHEN the caller requests shutdown twice
- THEN the director gives the same promise for both calls

### Requirement: The shutdown resources

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The shutdown resources `director-130`

- WHEN the caller requests shutdown
- THEN the director disposes its resources and cancels its camera flight

### Requirement: The shutdown work

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The shutdown work `director-131`

- WHEN the caller requests shutdown with pending work
- THEN the shutdown promise waits for that work

### Requirement: The project timestamp

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The project timestamp `director-132`

- WHEN the caller saves a valid project at `2026-10-06T12:00:00.000Z`
- THEN storage receives the project with that update timestamp

### Requirement: The invalid project document

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The invalid project document `director-133`

- WHEN the project contains an invalid latitude
- THEN the director rejects the save and gives the document error

### Requirement: The storage quota error

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The storage quota error `director-134`

- WHEN storage rejects a valid project save
- THEN the director gives the default storage notice

### Requirement: The storage notice

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The storage notice `director-135`

- WHEN the director reports a storage error
- THEN the director updates the status and shows a temporary toast when present

### Requirement: The scene selector

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene selector `director-136`

- WHEN the selected scene ID does not match a scene
- THEN the director selects the first scene or null and publishes scene options

### Requirement: The shot list selection

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The shot list selection `director-137`

- WHEN a scene contains shots but its selected shot ID does not match
- THEN the director selects its first shot and publishes the shot list

### Requirement: The scene and shot lookup

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene and shot lookup `director-138`

- WHEN the caller gives matching or absent scene and shot IDs
- THEN the director returns only the matching objects

### Requirement: The scene creation name

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene creation name `director-139`

- WHEN the caller gives a scene name with outer spaces
- THEN the director adds an empty scene with the trimmed name and selects it

### Requirement: The blank scene name

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The blank scene name `director-140`

- WHEN the caller gives only spaces as the scene name
- THEN the director uses the next scene number as its title

### Requirement: The absent scene name

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The absent scene name `director-141`

- WHEN the caller gives an empty or null scene name
- THEN the director leaves the project and storage unchanged

### Requirement: The scene deletion

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The scene deletion `director-142`

- WHEN the caller deletes a selected scene while another scene remains
- THEN the director removes that scene and selects the first other scene

### Requirement: The last scene deletion

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The last scene deletion `director-143`

- WHEN the caller deletes the last scene
- THEN the director restores the default project

### Requirement: The layer state snapshot

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The layer state snapshot `director-144`

- WHEN the caller captures data layer state
- THEN the director records each layer ID, boolean state and present parameters

### Requirement: The shot outcome

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The shot outcome `director-145`

- WHEN the director publishes a shot outcome
- THEN the outcome records its scene, shot and index and a loaded shot updates the status

### Requirement: The control actions

The scene director MUST support this project operation.
Origin: backfill

#### Scenario: The control actions `director-146`

- WHEN the controls request a project action
- THEN the director calls the method for that action
- AND a scene or shot selection updates the selected IDs
- AND a shot name change saves its trimmed title or keeps its title for blank text
- AND the director publishes each selection or name change

### Requirement: The interaction availability

The scene director MUST supply its state to its owners.
Origin: backfill

#### Scenario: The interaction availability `director-147`

- WHEN an interaction action occurs
- THEN the director accepts the action only without shutdown, scene playback or a tracked entity

### Requirement: The constructor callbacks

The scene director MUST supply its state to its owners.
Origin: backfill

#### Scenario: The constructor callbacks `director-148`

- WHEN an owner calls a constructor callback
- THEN the director sends poses and progress to its methods
- AND the clock receives the current playback state and shot time data
- AND the default map availability callback gives false

### Requirement: The initial state snapshot

The scene director MUST supply its state to its owners.
Origin: backfill

#### Scenario: The initial state snapshot `director-149`

- WHEN a caller subscribes to the director state
- THEN the snapshot gives the initial status, progress, runtime and playback state

### Requirement: The bundle source owner

The scene director MUST register its bundle byte store with the pack owner.
Origin: backfill

#### Scenario: The bundle source owner `director-150`

- WHEN constructor options supply an external source and a replacement bundle source
- THEN the pack owner registers both source IDs
- AND the bundle source uses the director byte store

