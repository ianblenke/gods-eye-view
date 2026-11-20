## REMOVED Requirements

### Requirement: Panel presentation
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-012`, `voice-panel-013`, `voice-panel-014`, `voice-panel-015`, `voice-panel-016`, `voice-panel-017`, `voice-panel-071`, `voice-panel-018`, `voice-panel-019`, `voice-panel-020`.
**Migration**: None.

### Requirement: Browser preferences
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-021`, `voice-panel-022`, `voice-panel-023`, `voice-panel-024`, `voice-panel-025`, `voice-panel-026`, `voice-panel-027`, `voice-panel-028`, `voice-panel-072`, `voice-panel-029`.
**Migration**: None.

### Requirement: Panel host
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-049`, `voice-panel-050`, `voice-panel-051`, `voice-panel-052`, `voice-panel-053`, `voice-panel-054`, `voice-panel-055`, `voice-panel-056`, `voice-panel-057`, `voice-panel-058`, `voice-panel-066`.
**Migration**: None.

### Requirement: Test fixtures
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-059`, `voice-panel-060`.
**Migration**: None.

### Requirement: Voice request boundaries
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-061`, `voice-panel-062`, `voice-panel-063`, `voice-panel-064`.
**Migration**: None.

### Requirement: Host status and card events
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-068`, `voice-panel-069`.
**Migration**: None.

### Requirement: Native activity notices
**Reason**: Upstream renders the voice panel from a presenter and removed the test fixture of the old panel. The fork tests of this requirement used that fixture, and they fail against the merged code. This change retires the scenarios `voice-panel-070`.
**Migration**: None.

## MODIFIED Requirements

### Requirement: Action input

The action input helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Keep synchronous action results `voice-panel-002`

- **WHEN** an action returns a scalar or throws an error
- **THEN** the observer keeps the result or error and reports its outcome

#### Scenario: Separate action keys `voice-panel-004`

- **WHEN** two actions share a call id
- **THEN** the observer uses distinct keys and settles each action independently

#### Scenario: Forward progress calls `voice-panel-005`

- **WHEN** an action calls a progress callback
- **THEN** the observer calls an original callback before publication when that callback exists
- **AND** it keeps that callback's receiver, arguments and result

#### Scenario: Keep custom options `voice-panel-006`

- **WHEN** the caller supplies options with string accessors, invalid progress data, an inspection error, or a prototype other than `Object.prototype` or `null`
- **THEN** the observer forwards those options unchanged
- **AND** the observer does not call option accessors or currentness predicates itself

#### Scenario: Retire caller ownership `voice-panel-007`

- **WHEN** successful option inspection finds an own caller AbortSignal
- **THEN** the observer retires its key on abort or a listener error without cancellation of the action
- **AND** the observer does not report settlement after that retirement

#### Scenario: Retire mount ownership `voice-panel-008`

- **WHEN** the mount aborts or the owner retires pending actions
- **THEN** the observer retires their keys and continues to call the action after disposal

#### Scenario: Isolate observer errors `voice-panel-010`

- **WHEN** an observation callback or private inspection throws
- **THEN** the observer keeps the action result or original callback error

### Requirement: Local inactivity

The local inactivity helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Arm a quiet deadline `voice-panel-030`

- **WHEN** known connected activity becomes quiet without unresolved actions
- **THEN** the timer arms a deadline at the current time plus the selected minutes

#### Scenario: Reset the activity deadline `voice-panel-031`

- **WHEN** the owner reports activity while the connection stays quiet
- **THEN** the timer resets the deadline while unchanged snapshots keep the deadline

#### Scenario: Check activity at expiry `voice-panel-033`

- **WHEN** the timer reaches its deadline
- **THEN** the timer checks each busy flag and unresolved actions before it calls the expiry callback

#### Scenario: Cancel stale timers `voice-panel-034`

- **WHEN** the owner destroys the timer or changes its epoch
- **THEN** the timer cancels its task and ignores stale callbacks and later updates

### Requirement: Native activity

The native activity helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Keep custom adapters opaque `voice-panel-035`

- **WHEN** the provider is custom
- **THEN** the observer reports unknown activity without access to the controller

#### Scenario: Track local input `voice-panel-036`

- **WHEN** the observer reads a native input source
- **THEN** the observer reports local input state from that provider's held key, speech events and activity fields

#### Scenario: Track Gemini playback `voice-panel-037`

- **WHEN** the observer reads the current Gemini audio source
- **THEN** the observer reports outputBusy only when its current audio owner reports output in its queue

#### Scenario: Ignore retired audio callbacks `voice-panel-038`

- **WHEN** Gemini retires an audio instance or its observer
- **THEN** callbacks from the old audio cannot change the current input state

#### Scenario: Keep audio callback results `voice-panel-039`

- **WHEN** Gemini calls a decorated audio callback
- **THEN** the observer keeps the original receiver, arguments, result and thrown error

#### Scenario: Keep native method calls `voice-panel-040`

- **WHEN** a native input or playback method uses an observer wrapper
- **THEN** the wrapper keeps the receiver, arguments, result and thrown error

#### Scenario: Use playback evidence `voice-panel-041`

- **WHEN** OpenAI reports generation completion without playback evidence
- **THEN** the observer keeps output unknown or busy until native playback evidence arrives

#### Scenario: Check the initial output state `voice-panel-042`

- **WHEN** an OpenAI observer attaches to a controller
- **THEN** the observer reports known output only for a clean native state

#### Scenario: Track native work fields `voice-panel-043`

- **WHEN** a native activity field changes
- **THEN** the observer uses only fields that belong to that provider for its input and generation state

#### Scenario: Accept silent responses `voice-panel-045`

- **WHEN** an observed OpenAI response completes with output metadata
- **THEN** the observer restores output knowledge only for supported silent output when no other output remains unresolved

#### Scenario: Keep unresolved responses separate `voice-panel-046`

- **WHEN** OpenAI reports response, playback or connection events
- **THEN** the observer keeps output unknown until silent completion, playback evidence or a clean connection boundary resolves all unresolved output

#### Scenario: Restore owned methods `voice-panel-047`

- **WHEN** the native observer retires audio or the owner destroys the observer
- **THEN** the observer restores the original method functions that it still owns and keeps newer replacements

