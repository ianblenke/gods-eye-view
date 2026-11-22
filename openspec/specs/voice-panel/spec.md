# voice-panel Specification

## Purpose
Describe how the voice panel shows Preview and Voice Settings, stores local preferences, and uses local activity to stop a quiet session.
## Requirements
### Requirement: Action input

The action input helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Reject an absent action `voice-panel-001`

- **WHEN** the caller supplies an absent or invalid action function
- **THEN** the observer throws a TypeError

#### Scenario: Keep synchronous action results `voice-panel-002`

- **WHEN** an action returns a scalar or throws an error
- **THEN** the observer keeps the result or error and reports its outcome

#### Scenario: Keep native promises `voice-panel-003`

- **WHEN** an action returns a native Promise
- **THEN** the observer returns that Promise and reports its final outcome

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

#### Scenario: Keep absent options `voice-panel-009`

- **WHEN** the caller supplies null, undefined or no options
- **THEN** the observer keeps the argument values and argument length

#### Scenario: Isolate observer errors `voice-panel-010`

- **WHEN** an observation callback or private inspection throws
- **THEN** the observer keeps the action result or original callback error

#### Scenario: Filter progress metadata `voice-panel-011`

- **WHEN** an action calls its progress function
- **THEN** the observer publishes progress only for a string data property named step
- **AND** the observer includes a label only from a string data property named label
- **AND** the observer does not publish other properties from the update

#### Scenario: Keep opaque action values `voice-panel-067`

- **WHEN** an action returns an object or function without native Promise evidence
- **THEN** the observer returns it unchanged and retires its key with reason unobserved-return-kind

### Requirement: Panel presentation

The panel presentation helpers MUST report their current state and keep their local resources.
A new panel starts closed in Preview.

Origin: backfill

#### Scenario: Compose panel controls `voice-panel-012`

- **WHEN** the control constructor enables the panel
- **THEN** the controls connect the tabs to distinct panes and keep the alert outside the panel

#### Scenario: Select panel views `voice-panel-013`

- **WHEN** the person selects a tab or the settings button
- **THEN** the panel selects that view and the settings button toggles its pane

#### Scenario: Navigate with keys `voice-panel-014`

- **WHEN** the person presses a tab navigation key or Escape
- **THEN** the panel selects the target view or closes and sets the focus and tab attributes

#### Scenario: Transfer panel focus `voice-panel-015`

- **WHEN** a view change hides the focused pane
- **THEN** the panel transfers focus to the selected tab without a change to unrelated focus

#### Scenario: Keep the preview preference `voice-panel-016`

- **WHEN** the person selects Preview with its preference off
- **THEN** the panel keeps the preference off and shows the disabled text

#### Scenario: Dispose panel controls `voice-panel-017`

- **WHEN** the owner destroys the panel
- **AND** no card callback selects a view during teardown
- **THEN** the panel hides its presentation, removes its listeners and rejects later view changes

#### Scenario: Use the Close control `voice-panel-071`

- **WHEN** the person clicks Close in an open panel
- **THEN** the panel hides both panes and the card
- **AND** the settings button reports aria-expanded as false

#### Scenario: Delay row closure `voice-panel-018`

- **WHEN** the pointer leaves the row without touch input
- **THEN** the row keeps its grace flag for 700 milliseconds unless the pointer enters or the owner destroys the panel

#### Scenario: Reject invalid panel input `voice-panel-019`

- **WHEN** constructor validation or a listener method fails
- **THEN** the constructor throws the error and leaves no active panel listeners

#### Scenario: Check panel visibility `voice-panel-020`

- **WHEN** the panel computes its presentation or selects a focus target
- **THEN** Preview is visible only in an open enabled preview outside Cockpit with a visible card
- **AND** the panel does not focus hidden or disconnected targets

### Requirement: Browser preferences

The browser preferences helpers MUST report their current state and keep their local resources.
The controls offer 3, 5, 10 and 15 minute presets.
Preview uses `godsEyeView.voice.previewEnabled` for boolean text.
Minutes use `godsEyeView.voice.inactivityMinutes`, with `none` for zero.

Origin: backfill

#### Scenario: Read browser preferences `voice-panel-021`

- **WHEN** the model starts with stored values or absent values
- **THEN** the model restores valid values or the defaults without a storage write

#### Scenario: Apply valid preferences `voice-panel-022`

- **WHEN** the person selects valid minutes or a boolean preview value
- **THEN** the model applies the value and reports whether storage returns the same serialized value

#### Scenario: Reject invalid preferences `voice-panel-023`

- **WHEN** the person supplies invalid minutes or a nonboolean preview value
- **THEN** the model returns invalid-value without a state change, storage write or notice

#### Scenario: Keep values after storage errors `voice-panel-024`

- **WHEN** storage is unavailable, fails, ignores a write or returns different text
- **THEN** the model keeps the live value and reports persisted false across control replacement

#### Scenario: Save the same value again `voice-panel-025`

- **WHEN** storage recovers after a failed save
- **THEN** the model saves the same value and removes the warning without a live value change

#### Scenario: Edit custom minutes `voice-panel-026`

- **WHEN** the person selects Custom with a valid displayed value
- **THEN** the controls apply that value and keep the custom editor visible even for a preset

#### Scenario: Reject invalid control edits `voice-panel-027`

- **WHEN** the person enters invalid custom minutes or an unknown select value
- **THEN** the controls restore the valid state without a storage write

#### Scenario: Separate preference snapshots `voice-panel-028`

- **WHEN** a caller changes a snapshot or removes a listener
- **THEN** the model keeps its private state and stops notices to that listener

#### Scenario: Reject an invalid preference listener `voice-panel-072`

- **WHEN** the caller supplies a listener that is not a function
- **THEN** the model throws a TypeError with message Preference listener required

#### Scenario: Bind optional preference controls `voice-panel-029`

- **WHEN** the caller supplies only some controls
- **THEN** the binder updates those controls and removes their listeners at disposal

### Requirement: Local inactivity

The local inactivity helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Arm a quiet deadline `voice-panel-030`

- **WHEN** known connected activity becomes quiet without unresolved actions
- **THEN** the timer arms a deadline at the current time plus the selected minutes

#### Scenario: Reset the activity deadline `voice-panel-031`

- **WHEN** the owner reports activity while the connection stays quiet
- **THEN** the timer resets the deadline while unchanged snapshots keep the deadline

#### Scenario: Validate timeout minutes `voice-panel-032`

- **WHEN** the caller supplies initial minutes or changes the timeout
- **THEN** the timer accepts integers from 0 through 60 and uses 5 for invalid initial values

#### Scenario: Check activity at expiry `voice-panel-033`

- **WHEN** the timer reaches its deadline
- **THEN** the timer checks each busy flag and unresolved actions before it calls the expiry callback

#### Scenario: Cancel stale timers `voice-panel-034`

- **WHEN** the owner destroys the timer or changes its epoch
- **THEN** the timer cancels its task and ignores stale callbacks and later updates

#### Scenario: Disable the local deadline `voice-panel-065`

- **WHEN** the person selects None
- **THEN** the inactivity timer cancels its deadline and does not stop the session

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

#### Scenario: Observe accepted text `voice-panel-044`

- **WHEN** the caller submits text through the native text method
- **THEN** the observer calls the input callback only for accepted nonempty text after the method returns

#### Scenario: Accept silent responses `voice-panel-045`

- **WHEN** an observed OpenAI response completes with output metadata
- **THEN** the observer restores output knowledge only for supported silent output when no other output remains unresolved

#### Scenario: Keep unresolved responses separate `voice-panel-046`

- **WHEN** OpenAI reports response, playback or connection events
- **THEN** the observer keeps output unknown until silent completion, playback evidence or a clean connection boundary resolves all unresolved output

#### Scenario: Restore owned methods `voice-panel-047`

- **WHEN** the native observer retires audio or the owner destroys the observer
- **THEN** the observer restores the original method functions that it still owns and keeps newer replacements

#### Scenario: Keep recovery evidence `voice-panel-048`

- **WHEN** OpenAI reports an error on an open data channel
- **THEN** the observer keeps output evidence through recovery and retires that evidence on a new connection

### Requirement: Panel host

The panel host helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Restore the host view `voice-panel-049`

- **WHEN** the host replaces a provider mount
- **THEN** the host restores live preferences and the saved view without a storage write or focus transfer

#### Scenario: Close after a current stop `voice-panel-050`

- **WHEN** a caller asks the host to close after Stop with a ticket
- **THEN** the host closes the panel only for a current ticket, a current mount and an inactive session

#### Scenario: Stop after local inactivity `voice-panel-051`

- **WHEN** a current native session stays quiet until its deadline
- **THEN** the host stops the session and closes its current panel

#### Scenario: Guard host mounts `voice-panel-052`

- **WHEN** the host is disposed or the panel or card methods are absent
- **THEN** the host returns null without a mount

#### Scenario: Capture current operations `voice-panel-053`

- **WHEN** a caller uses a captured operation
- **THEN** the operation applies valid requests only while it owns the current presentation and session epoch
- **AND** the operation rejects invalid current requests or returns cancelled for stale requests

#### Scenario: Show automatic preview `voice-panel-054`

- **WHEN** the current host receives a session event
- **THEN** the host selects Preview only for active assistant text while automatic preview is enabled

#### Scenario: Ignore transcript replays `voice-panel-055`

- **WHEN** a current mount receives a transcript or a state event
- **THEN** the host ignores a final replay with the same text and id and partial text for the current final reply's known id
- **AND** an ignored replay keeps the card text and timer
- **AND** an active mount accepts a different id or changed final text
- **AND** a connecting, idle or error state clears the stored final reply

#### Scenario: Suppress automatic preview `voice-panel-056`

- **WHEN** Preview is off or Cockpit is active
- **THEN** the host keeps automatic Preview hidden without a preference change

#### Scenario: Keep advisory captions `voice-panel-057`

- **WHEN** an interruption sets preserveAdvisoryCaption
- **AND** no new local input accompanies that event
- **THEN** the host keeps the card caption and does not rearm automatic preview

#### Scenario: Guard deferred host updates `voice-panel-058`

- **WHEN** a mount loses ownership before an observer callback or deferred update
- **THEN** the old mount cannot update the current presentation

#### Scenario: Report unknown host activity `voice-panel-066`

- **WHEN** the host uses a custom connection
- **THEN** the host shows the unavailable message and does not stop that session through inactivity

### Requirement: Test fixtures

The test fixtures helpers MUST report their current state and keep their local resources.

Origin: backfill

#### Scenario: Model panel elements `voice-panel-059`

- **WHEN** a test uses the panel DOM fixture
- **THEN** the fixture models attributes, child order, selectors, visibility, focus and event listeners

#### Scenario: Advance the test clock `voice-panel-060`

- **WHEN** a test advances the controlled clock
- **THEN** the clock calls only due tasks and respects task cancellation

### Requirement: Voice request boundaries

The voice request helpers MUST check the current host before they change the panel.

Origin: backfill

#### Scenario: Apply named voice requests `voice-panel-061`

- **WHEN** the action runner receives a named voice panel or timeout request
- **THEN** the runner applies the requested view or minutes and keeps Preview disabled when its preference is off

#### Scenario: Reject an unavailable voice host `voice-panel-062`

- **WHEN** a voice request cannot get a panel host
- **THEN** the request reports unavailable before a Cockpit or preference change

#### Scenario: Guard a delayed voice view `voice-panel-063`

- **WHEN** a Cockpit exit waits before a voice view change
- **THEN** a newer manual choice or Stop prevents the old request from a view change

#### Scenario: Use the provider dialog `voice-panel-064`

- **WHEN** a request names Provider Settings
- **THEN** the request uses the ready dialog controls and rejects unavailable or cancelled requests

### Requirement: Host status and card events

The host MUST distinguish inactivity support and forward current card events.

Origin: backfill

#### Scenario: Report inactivity support `voice-panel-068`

- **WHEN** the host mounts a native or custom provider
- **THEN** the status text is empty for OpenAI and Gemini
- **AND** a custom provider reports Automatic stop is unavailable for this voice connection.

#### Scenario: Forward card events `voice-panel-069`

- **WHEN** an active current mount receives an event without an interruption that keeps its advisory caption
- **THEN** the host forwards that event to the card

### Requirement: Native activity notices

The native observer MUST report its current activity through its callback.

Origin: backfill

#### Scenario: Notify current native activity `voice-panel-070`

- **WHEN** a current observer receives an event or its speech method returns
- **THEN** the observer sends its current activity snapshot unless a session boundary retires that method call
- **AND** the snapshot reports known, connected, held, inputBusy, outputBusy and generationBusy as booleans
- **AND** a clean idle observer starts with known true and all other flags false
- **AND** each notice reports changes to connection, input, output and generation activity

