## ADDED Requirements

### Requirement: Shot authoring

The director MUST support the shot authoring behavior in these scenarios.

Origin: backfill

#### Scenario: Shot capture `director-186`

- **WHEN** the selected scene contains two shots and the live camera exists
- **THEN** the director adds a shot with the live camera, visual state and layers
- **AND** the new shot uses 4 seconds for flight and 0.9 seconds for hold
- **AND** the new shot title is Shot 3
- **AND** the director selects the new shot

#### Scenario: Capture guards `director-187`

- **WHEN** the selected scene or camera is absent
- **THEN** the director leaves the shot list unchanged

#### Scenario: Shot update `director-188`

- **WHEN** the selected shot and live camera exist
- **THEN** the director replaces its camera, visual state and layers

#### Scenario: Update guards `director-189`

- **WHEN** the scene, shot or camera is absent
- **THEN** the director leaves shot fields unchanged

#### Scenario: Shot deletion `director-190`

- **WHEN** the requested shot exists in the selected scene
- **THEN** the director removes it and selects the first remaining shot or null

### Requirement: Shot loads

The director MUST support the shot loads behavior in these scenarios.

Origin: backfill

#### Scenario: Load guards `director-191`

- **WHEN** the director is destroyed, a scene plays, or the requested shot is absent
- **THEN** the director reports that the shot did not start

#### Scenario: Camera refusal `director-192`

- **WHEN** the navigation policy rejects camera ownership
- **THEN** the director reports camera unavailability before shot changes

#### Scenario: Load defaults `director-193`

- **WHEN** a shot loads without a flight duration
- **THEN** the director uses the authored move duration or 2.2 seconds for a static camera

#### Scenario: Scene departure `director-194`

- **WHEN** a shot from another scene loads
- **THEN** the director waits for the old scene layers before target visual state

#### Scenario: Departure refusal `director-195`

- **WHEN** the old scene layers cannot stop
- **THEN** the director does not apply the target visual state

#### Scenario: Load replacement `director-196`

- **WHEN** a newer shot loads during an older visual transition
- **THEN** the director cancels the older token and applies only the newer layers

#### Scenario: Load refusal `director-197`

- **WHEN** the layers or data packs reject a shot
- **THEN** the director reports the applicable reason

#### Scenario: Load completion `director-198`

- **WHEN** a shot flight completes
- **THEN** the director settles layers before its hold phase and reports the shot outcome

#### Scenario: Load errors `director-199`

- **WHEN** a shot flight throws an error
- **THEN** the director cancels travel and stops the shot clock for a live token

### Requirement: Media and travel

The director MUST support the media and travel behavior in these scenarios.

Origin: backfill

#### Scenario: Media ownership `director-200`

- **WHEN** a live shot token requests media
- **THEN** the director gives ownership only to enabled layers with a media method

#### Scenario: Media guards `director-201`

- **WHEN** a scene, shot or token is absent, cancelled or aborted
- **THEN** the director removes old media ownership without new ownership

#### Scenario: Layer settlement `director-202`

- **WHEN** a live flight completes
- **THEN** the director updates only enabled layers that defer evidence until the camera settles

#### Scenario: Travel duration `director-203`

- **WHEN** a shot starts camera travel
- **THEN** the director sets a unique active travel ID with a minimum duration of 0.2 seconds

#### Scenario: Travel publication `director-204`

- **WHEN** the camera accepts a shot flight
- **THEN** the director updates only enabled layers with camera evidence paths

#### Scenario: Travel cancellation `director-205`

- **WHEN** active travel stops
- **THEN** the director sends cancelled travel state to enabled camera evidence paths

#### Scenario: Cancellation fallback `director-206`

- **WHEN** a layer rejects or throws during travel cancellation
- **THEN** the director disables that layer and reports errors from that action

### Requirement: Shot navigation

The director MUST support the shot navigation behavior in these scenarios.

Origin: backfill

#### Scenario: Shot replay `director-207`

- **WHEN** a valid shot replays
- **THEN** the director requests media and uses the preceding camera for a static shot

#### Scenario: Replay guards `director-208`

- **WHEN** the director is destroyed, a scene plays, or the shot is absent
- **THEN** the director reports that replay did not start

#### Scenario: Scene after a shot `director-209`

- **WHEN** a valid shot requests the rest of its scene
- **THEN** the director starts that scene after the shot without preview

#### Scenario: Adjacent shots `director-210`

- **WHEN** a valid adjacent shot exists
- **THEN** the director loads it without a wrap at either boundary

#### Scenario: Adjacent guards `director-211`

- **WHEN** the director is destroyed, a scene plays, or the target is absent
- **THEN** the director returns false

### Requirement: Clock and seek

The director MUST support the clock and seek behavior in these scenarios.

Origin: backfill

#### Scenario: Clock access `director-212`

- **WHEN** a consumer requests clock state or a subscription
- **THEN** the director gives the clock snapshot and includes active camera motion in the timer total

#### Scenario: Idle wait `director-213`

- **WHEN** a consumer waits for the scene to become idle
- **THEN** the director resolves at once when idle or records a resolver for an active scene

#### Scenario: Loaded shot seek `director-214`

- **WHEN** a plain selected shot seeks within its loaded scene
- **THEN** the director updates layer parameters, camera, progress and clock without another shot load

#### Scenario: Loaded seek guards `director-215`

- **WHEN** a shot carries packs or interactions, selection differs, or input is absent
- **THEN** the director rejects the direct shot seek

#### Scenario: Loaded seek refusal `director-216`

- **WHEN** camera ownership or layer parameters reject a direct seek
- **THEN** the director returns false

#### Scenario: Scene seek `director-217`

- **WHEN** a consumer seeks a valid scene position
- **THEN** the director uses the direct shot path or loads the shot at the resolved camera

#### Scenario: Scene seek guards `director-218`

- **WHEN** the scene is absent or empty, the director is destroyed, or a newer request exists
- **THEN** the director returns false

#### Scenario: Load token `director-219`

- **WHEN** a load token checks cancellation
- **THEN** the token checks director destruction, signal abortion and load generation

### Requirement: Camera and queries

The director MUST support the camera and queries behavior in these scenarios.

Origin: backfill

#### Scenario: Camera ownership `director-220`

- **WHEN** a consumer claims camera ownership
- **THEN** the director calls the scene navigation policy and resets its claim flag after errors

#### Scenario: Camera placement `director-221`

- **WHEN** a camera pose supplies a usable viewer
- **THEN** the director cancels camera flight and sets its destination and angles

#### Scenario: Scene list `director-222`

- **WHEN** a consumer lists scenes
- **THEN** the director returns scene IDs, titles and shot totals in project order

#### Scenario: Scene query `director-223`

- **WHEN** a consumer gives a scene query
- **THEN** the director selects an ID match before an exact title match and then a title substring match

#### Scenario: Playback status `director-224`

- **WHEN** a consumer requests playback status
- **THEN** the director gives selection, scene total and active scene time

#### Scenario: Seek camera fallback `director-225`

- **WHEN** a seek state does not supply a camera
- **THEN** the director resolves the authored shot camera

### Requirement: Load media cleanup

The director MUST remove media ownership after an unsuccessful load that still owns its generation.

Origin: backfill

#### Scenario: Load media cleanup `director-226`

- **WHEN** a load completes without success or throws an error
- **THEN** the director removes media ownership only if that load still owns its generation
### Requirement: Load cancellation checkpoints

The director MUST stop a cancelled load before its next shot phase.

Origin: backfill

#### Scenario: Load cancellation checkpoints `director-227`

- **WHEN** a token cancels during layers, data packs, camera flight or layer settlement
- **THEN** the director stops that load before the next shot phase
### Requirement: Supplied flight duration

The director MUST use a supplied flight duration for the shot camera.

Origin: backfill

#### Scenario: Supplied flight duration `director-228`

- **WHEN** a load supplies a flight duration of zero or one second
- **THEN** the director passes that duration to the camera flight
### Requirement: Camera arrival ownership

The director MUST cancel camera arrival work before the scene navigation policy.

Origin: backfill

#### Scenario: Camera arrival ownership `director-229`

- **WHEN** a shot loads with camera arrival work for its viewer
- **THEN** the director cancels that work before it calls the scene navigation policy
### Requirement: Camera placement guards

The director MUST reject camera placement when the pose or viewer camera is absent.

Origin: backfill

#### Scenario: Camera placement guards `director-230`

- **WHEN** the pose, viewer, camera or view method is absent
- **THEN** the director returns false without camera actions
