# Director scene evidence

Source commit: `dd4dc1bc3bee72d5ec0d2e159ff6cdae6a53a8de`.

## Scenario test links

New test titles belong to `src/scenes/directorRun.test.mjs`.
Old titles belong to `src/scenes/director.test.mjs`.
The quoted titles below identify each leaf test.

### director-231: Scene guards

```text
[director-231] The destroyed director rejects a scene
[director-231] The active director rejects another scene
```

### director-232: Queue guards

```text
[director-232] The queue rejects empty
[director-232] The queue rejects unknown
[director-232] The queue rejects last
[director-232] The after-shot guard checks the scene ID
[director-232] The empty project rejects a scene request
```

### director-233: Camera admission

```text
[director-233] The camera policy rejects a scene
```

### director-234: Scene selection

```text
[director-234] The scene starts from named
[director-234] The scene starts from selected
[director-234] The scene starts from first
```

### director-235: Shot sequence

```text
[director-235] The scene visits shots in project order
[director-235] The scene passes its live signal to the layer manager
[director-235] The scene accepts absent pack and action owners
```

### director-236: Scene options

```text
[director-236] The scene option uses single
[director-236] The scene option uses after
[director-236] The scene option uses preview
[director-236] The scene option uses panel
[director-236] scene preview owns recording chrome while panel playback leaves it available
```

### director-237: Load replacement

```text
[director-237] The scene cancels a load owner that waits
[director-237] a scene run supersedes a LOAD still suspended on its visual await
```

### director-238: Scene metadata

```text
[director-238] The metadata records duration
[director-238] The metadata records zero
[director-238] The metadata records move
```

### director-239: Scene error

```text
[director-239] The scene error uses its message
[director-239] The scene error uses default text
```

### director-240: Next shot

```text
[director-240] The next shot handles next
[director-240] The next shot handles wrap
[director-240] The next shot handles unknown
[director-240] The next shot handles absent
[director-240] The next shot handles first
[director-240] The next shot starts from the selected scene
```

### director-241: Next shot guards

```text
[director-241] The next shot stops for destroyed
[director-241] The next shot stops for active
[director-241] The next shot stops for empty
[director-241] The empty project cannot advance a shot
```

### director-242: Scene stop

```text
[director-242] The scene stop handles active
[director-242] The scene stop handles idle
[director-242] The scene stop handles token
[director-242] The scene stop handles default
[director-242] The scene stop accepts an absent abort owner
[director-242] The scene stop accepts absent pack and action owners
[director-242] Stop cancels a provider-owned shot hold and late completion cannot fly the next camera
[director-242] STOP during a suspended visual transition lands no layer changes
[director-242] STOP between two layers lands no further layer changes
[director-242] STOP aborts the layer transition in flight, not merely the next one
[director-242] a run refuses the visual commit of a shot cancelled mid-transition
```

### director-243: Pack application

```text
[director-243] The pack method handles true
[director-243] The pack method handles false
[director-243] The pack method handles null
[director-243] The pack method handles absent
[director-243] The pack method handles error
[director-243] The pack method handles canceled
[director-243] The pack error accepts an absent token
```

### director-244: State queries

```text
[director-244] The state queries handle owners
[director-244] The state queries handle absent
[director-244] The state queries handle null
```

### director-245: Action activation

```text
[director-245] The action activation handles targets
[director-245] The action activation handles error
[director-245] The action activation handles absent
```

### director-246: Action guards

```text
[director-246] The action guard checks signal
[director-246] The action guard checks active
[director-246] The action guard checks destroyed
[director-246] The action guard checks scene
[director-246] The action guard checks shot
[director-246] The action guard checks type
[director-246] The action checks only an absent scene
[director-246] The action checks only an absent shot
```

### director-247: Focus action

```text
[director-247] The focus action handles accepted
[director-247] The focus action handles refused
```

### director-248: Layer action

```text
[director-248] The layer action handles enabled
[director-248] The layer action handles disabled
[director-248] The layer action handles unknown
```

### director-249: Shot action

```text
[director-249] The shot action checks total 0
[director-249] The shot action checks total 63
[director-249] The shot action checks total 64
```

### director-250: Project export

```text
[director-250] The project export downloads and publishes its document
```

### director-251: Export error

```text
[director-251] The export error stops before a download
```

### director-252: Project import

```text
[director-252] The file import waits for old work before replacement
[director-252] The import accepts an absent work set
[director-252] The first import sets generation one
[director-252] The second import sets generation two
[director-252] valid import settles a cancelled load before replacing the project
```

### director-253: Import guards

```text
[director-253] The import guard checks signal
[director-253] The import guard checks destroyed
[director-253] The import guard checks generation
[director-253] The import guard checks expected
[director-253] The import guard checks late-signal
[director-253] The import guard checks late-destroyed
[director-253] The import guard checks late-generation
[director-253] The import guard checks late-expected
[director-253] The import loses its generation before playback stops
[director-253] The unchanged expected project accepts the import
[director-253] a delayed import cannot publish after disposal
```

### director-254: Import assets and selection

```text
[director-254] The import uses selection
[director-254] The import uses default
[director-254] The import uses empty
[director-254] The import uses assets
[director-254] The import uses absent-assets
[director-254] The import uses absent-packs
[director-254] The import uses absent shots
[director-254] The import accepts an absent asset owner
```

### director-255: Import error

```text
[director-255] The import error handles document
[director-255] The import error handles read
[director-255] The import error handles signal
[director-255] The import error handles destroyed
[director-255] The import error handles generation
```

### director-256: Metadata download

```text
[director-256] The metadata download checks an absent record
[director-256] The metadata download checks a record
```

### director-257: Layer application

```text
[director-257] The layer one uses simple
[director-257] The layer one uses params
[director-257] The layer one uses restore
[director-257] The layer one uses an absent signal
[director-257] The layer two uses simple
[director-257] The layer two uses params
[director-257] The layer two uses restore
[director-257] The layer two uses an absent signal
[director-257] The restore path handles disabled
[director-257] The restore path handles an absent signal
[director-257] the director reconciles only the layers a shot declares
```

### director-258: Layer refusal

```text
[director-258] The layer refusal handles on
[director-258] The layer refusal handles off
[director-258] The layer refusal handles restore
[director-258] The layer refusal handles null
[director-258] a refused layer is reported, never counted as applied
```

### director-259: Layer cancellation

```text
[director-259] The layer cancellation stops before context mode
[director-259] The layer cancellation stops after context mode
[director-259] The layer cancellation stops after a layer
[director-259] cancellation between two layers ends the reconcile where it stands
```

### director-260: Scene-owned layers

```text
[director-260] The scene layer one handles success
[director-260] The scene layer one handles refused
[director-260] The scene layer one handles error
[director-260] The scene layer one handles empty-error
[director-260] The scene layer two handles success
[director-260] The scene layer two handles refused
[director-260] The scene layer two handles error
[director-260] The scene layer two handles empty-error
[director-260] The scene layer cleanup handles absent
[director-260] The scene layer cleanup handles not-list
[director-260] The scene layer cleanup handles empty
[director-260] The scene layer cleanup handles before
[director-260] The scene layer cleanup handles after
[director-260] The last scene layer checks empty
[director-260] The last scene layer checks last-canceled
[director-260] The scene layer method accepts absent pack and action owners
```

### director-261: Context exit

```text
[director-261] The context method handles mode
[director-261] The context method handles a mode entry
[director-261] The context method handles another mode
[director-261] The context method handles absent-state
[director-261] The context method handles absent-get
[director-261] The context method handles absent-set
[director-261] The context method handles refused
[director-261] The context method handles refused-empty
[director-261] The context method handles absent-result
[director-261] The context method handles an absent style manager
[director-261] a dirty Space Missions state is exited before a recipe applies its layers
[director-261] Orbital Watch does not compose over a Space Missions replay
[director-261] a non-isolating context mode is left alone
```

### director-262: Authored camera

```text
[director-262] The authored camera handles complete
[director-262] The authored camera handles interrupted
[director-262] The authored camera handles canceled
[director-262] The authored camera handles destroyed
[director-262] The authored camera handles ordinary
```

### director-263: Camera flight

```text
[director-263] The camera flight handles pose
[director-263] The camera flight handles defaults
[director-263] The camera flight handles zero
[director-263] The camera flight handles negative
[director-263] The camera flight handles bad
[director-263] The camera flight handles absent
[director-263] The camera flight handles canceled
[director-263] The camera flight handles an absent style manager
[director-263] The camera flight keeps zero heading
[director-263] The camera flight keeps zero roll
[director-263] The camera flight accepts an absent location method
```

### director-264: Flight completion

```text
[director-264] The camera promise settles through complete
[director-264] The camera promise settles through cancel
[director-264] The camera promise settles through timeout
[director-264] The camera promise settles through double
```

### director-265: Shot hold

```text
[director-265] The hold owner one handles complete
[director-265] The hold owner one handles a busy state
[director-265] The hold owner one handles timeout
[director-265] The hold owner one handles canceled
[director-265] The hold owner one handles aborted
[director-265] The hold owner one handles disabled
[director-265] The hold owner one handles an absent method
[director-265] The hold owner one handles an absent initial state
[director-265] The hold owner one handles an absent manager
[director-265] The hold owner one handles an absent layer map
[director-265] The hold owner one handles an absent module
[director-265] The hold owner one handles a zero bound
[director-265] The hold owner one handles a negative bound
[director-265] The hold owner one handles a large bound
[director-265] The hold owner two handles complete
[director-265] The hold owner two handles a busy state
[director-265] The hold owner two handles timeout
[director-265] The hold owner two handles canceled
[director-265] The hold owner two handles aborted
[director-265] The hold owner two handles disabled
[director-265] The hold owner two handles an absent method
[director-265] The hold owner two handles an absent initial state
[director-265] The hold owner two handles an absent manager
[director-265] The hold owner two handles an absent layer map
[director-265] The hold owner two handles an absent module
[director-265] The hold owner two handles a zero bound
[director-265] The hold owner two handles a negative bound
[director-265] The hold owner two handles a large bound
[director-265] The hold owner accepts an absent beat and signal
[director-265] The hold ends when its owner returns an absent state
[director-265] The media time bound does not become negative after a clock change
[director-265] scene camera waits for provider completion and fade rather than the saved media hold
[director-265] a provider-owned hold fails boundedly if its owner never settles
```

### director-266: Clock methods

```text
[director-266] The clock method _sleep passes its arguments
[director-266] The clock method _startProgressTicker passes its arguments
[director-266] The clock method _startShotProgress passes its arguments
[director-266] The clock method _startSceneClockTicker passes its arguments
```

### director-267: Scene finish

```text
[director-267] The scene finish handles preview
[director-267] The scene finish handles panel
[director-267] The scene finish handles canceled
[director-267] The scene finish handles an absent token
[director-267] The scene finish handles absent metadata
[director-267] The scene finish handles an absent abort owner
```

### director-268: Final clock

```text
[director-268] The final clock handles valid
[director-268] The final clock handles scene
[director-268] The final clock handles shot
[director-268] The final clock handles absent shots
[director-268] The final clock handles absent
[director-268] The final clock rejects a false scene with inherited shots
```

### director-269: Presentation helpers

```text
[director-269] The button helper publishes the supplied value
[director-269] The presentation method _setPlaybackActive updates its state
[director-269] The presentation method _setPlaybackKeyboardEnabled updates its state
[director-269] The presentation method _setProgress updates its state
[director-269] The presentation method _updateStatus updates its state
[director-269] The presentation method _updateRuntime updates its state
[director-269] The status helper publishes its state to a subscriber
```

### director-270: Event log

```text
[director-270] The event log handles payload
[director-270] The event log handles absent
[director-270] The event log handles idle
```

## Source and command records

The method search fixes the area boundaries.
The scenario search finds the highest earlier ID.
The import search includes static and dynamic module imports.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && git rev-parse HEAD
cd /home/ianblenke/docker/gev-work/director-4d && rg -n "^  [a-zA-Z#_].*\) \{$" src/scenes/director.js
cd /home/ianblenke/docker/gev-work/director-4d && wc -l src/scenes/director.js
cd /home/ianblenke/docker/gev-work/director-4d && rg -o "director-[0-9]{3}" openspec/changes/backfill-director-*/specs/director/spec.md
cd /home/ianblenke/docker/gev-work/director-4d && rg -l "(scenes/director\.js|from './director\.js')" --glob '*.test.mjs' .
cd /home/ianblenke/docker/gev-work/director-4d && rg -n "^\s*(//|/\*|\*|\*/)" scripts/qa-director-*.mjs
```

The file length command gives 2483 lines.
The earlier scenario search gives director-230 as the highest ID.
The source parser gives the decision rows in the scratch audit.

## Host coverage

The host tests one file per process.
The union script uses source lines, branch order within each source line and function source lines.
The host numbers do not give an image gate verdict.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4d/coverage.py before
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4d/coverage.py after
```

### Before host union

| Area | Covered lines | Covered branches | Covered functions |
| --- | --- | --- | --- |
| whole | 2336/2483 | 764/820 | 190/202 |
| range | 683/830 | 138/192 | 41/52 |

### After host union

| Area | Covered lines | Covered branches | Covered functions |
| --- | --- | --- | --- |
| whole | 2483/2483 | 919/921 | 203/203 |
| range | 830/830 | 293/293 | 53/53 |

## Old tests without new tags

The list quotes unchanged old titles.
The owner forbids a title change.
Tests outside this area keep their current tags or stay without a new tag.

### src/cameraGroundGuard.test.mjs

The test checks code outside this area.

```text
a buried camera is lifted clear of the surface
```

The test checks code outside this area.

```text
a camera resting on the surface is lifted to a usable height
```

The test checks code outside this area.

```text
a well-framed arrival is left alone
```

The test checks code outside this area.

```text
sub-metre noise never triggers a nudge
```

The test checks code outside this area.

```text
an unmeasurable surface is never acted on
```

The test checks code outside this area.

```text
the clearance frames a subject without turning into an overflight
```

The test checks code outside this area.

```text
the guard lifts a buried arrival once the surface answers
```

The test checks code outside this area.

```text
the guard waits for streaming tiles and yields to a newer arrival
```

The test checks code outside this area.

```text
the guard leaves a clear view untouched
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on Director
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on tracking
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on follow
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on keyboard
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on UI
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on flyTo
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on flyToBoundingSphere
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on setView
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on layer-disable
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on layer-destroy
```

The test checks code outside this area.

```text
arrival guard relinquishes and removes hooks on app-stop
```

### src/ui/sceneControls.test.mjs

The test checks code outside this area.

```text
Scene controls render the supplied selection and running/download states
```

The test checks code outside this area.

```text
Scene controls dispatch explicit actions and revoke replaced shot-row listeners
```

The test checks code outside this area.

```text
Scene Escape and recording presentation follow playback and release on destruction
```

The test checks code outside this area.

```text
a file import finishing after disposal cannot clear the retained file control
```

The test checks code outside this area.

```text
Scene action failures are visible only while that action still owns presentation
```

The test checks code outside this area.

```text
creation and deletion prompts precede their model actions and remain inert after disposal
```

The test checks code outside this area.

```text
the real director preserves a selected shot label for the following double-click
```

The test checks code outside this area.

```text
inline shot names save on Enter, cancel on Escape, and reject blank names
```

The test checks code outside this area.

```text
Scene controls consume current state, preserve rows on progress, and unsubscribe on destruction
```

### src/director/interactions/interactions.test.mjs

The test checks code outside this area.

```text
settled pack shots cannot take the same-shot seek shortcut after Stop released geometry
```

The title uses words that the owner forbids.

```text
actions preserve camera refusal, layer admission signal and explicit transition cap
```

### src/data/bhoteKoshiLocator.test.mjs

The test checks code outside this area.

```text
Bhote Koshi locator closes valid region rings once
```

The test checks code outside this area.

```text
Bhote Koshi locator selects the largest GeoJSON country exterior
```

The test checks code outside this area.

```text
Bhote Koshi locator reveals a border progressively
```

The test checks code outside this area.

```text
Bhote Koshi locator stages its anchored callout from dot to leader to text
```

The test checks code outside this area.

```text
Bhote Koshi regional locator sequences Nepal, border, then the incident
```

The test checks code outside this area.

```text
Bhote Koshi locator switches between Nepal context and the regional incident treatment
```

The test checks code outside this area.

```text
Incident Corridor reveals all fifteen overview pins and keeps layout active through the sequence
```

The test checks code outside this area.

```text
Bhote Koshi flood path draws a solid cyan sourced route after the place shot
```

The test checks code outside this area.

```text
Bhote Koshi path-overview presentation keeps the route settled without Nepal border
```

The test checks code outside this area.

```text
Bhote Koshi trigger-record presentation reveals sourced incident details
```

The test checks code outside this area.

```text
Bhote Koshi trigger-record waits for the scene camera, zooms, then orbits
```

The test checks code outside this area.

```text
Scene Stop revokes locator timer and stale callbacks cannot own a successor
```

The test checks code outside this area.

```text
Scene Stop revokes locator move-end and stale callbacks cannot own a successor
```

The test checks code outside this area.

```text
Scene Stop revokes locator approach and stale callbacks cannot own a successor
```

The test checks code outside this area.

```text
Scene Stop revokes locator orbit and stale callbacks cannot own a successor
```

The test checks code outside this area.

```text
Bhote Koshi locator keeps the regional context settled while nearby cities stagger in
```

The test checks code outside this area.

```text
Bhote Koshi locator degrades to labels when the regional boundary is unavailable
```

The test checks code outside this area.

```text
Bhote Koshi regional locator waits for its boundary before starting the full sequence
```

The test checks code outside this area.

```text
Bhote Koshi locator cancels a stale boundary resolution and removes its surface
```

### src/data/bhoteKoshiEvent.test.mjs

The test checks code outside this area.

```text
public lifecycle restores Nepal scene ownership without forwarding origin to enable
```

The test checks code outside this area.

```text
trimmed scene media holds through provider startup, playback and fade, then releases the camera
```

The test checks code outside this area.

```text
Pinokio source-card fallback selects authored Director dwell, not an impossible player hold
```

The test checks code outside this area.

```text
saved autoplay controls cannot authorize media; live shot ownership is cancellable and never serialized
```

The test checks code outside this area.

```text
Bhote Koshi timeline helpers clamp untrusted UI values
```

The test checks code outside this area.

```text
Bhote Koshi flood reveal is monotonic and bounded
```

The test checks code outside this area.

```text
Bhote Koshi flood corridor grows continuously to the animated surge head
```

The test checks code outside this area.

```text
Bhote Koshi story clock holds the flood for the cause beats then completes the corridor
```

The test checks code outside this area.

```text
Bhote Koshi camera holds its evidence beat, then travels by the next activation
```

The test checks code outside this area.

```text
Bhote Koshi card summaries wrap on words instead of clipping mid-sentence
```

The test checks code outside this area.

```text
Bhote Koshi evidence timeline is ordered by phase and corridor chainage with one active beat
```

The test checks code outside this area.

```text
Bhote Koshi scene beats resolve stable ids inside their reveal windows
```

The test checks code outside this area.

```text
Bhote Koshi scene shots continue the standalone evidence clock from Border Gate onward
```

The test checks code outside this area.

```text
Bhote Koshi evidence presentation reveals dot, leader, and card then tears down in reverse
```

The test checks code outside this area.

```text
Bhote Koshi evidence cards freeze useful landscape, portrait, and link-only footprints
```

The test checks code outside this area.

```text
Bhote Koshi gives YouTube and Facebook players priority over local review clips
```

The test checks code outside this area.

```text
Bhote Koshi beat navigation is deterministic in both directions and clamps at its ends
```

The test checks code outside this area.

```text
Bhote Koshi evidence fallback stays media-first and source-linked without card copy overload
```

The test checks code outside this area.

```text
Bhote Koshi evidence compositor contains portrait video from its decoded dimensions
```

The test checks code outside this area.

```text
Bhote Koshi failed direct enable restores the prior map and shared split
```

The test checks code outside this area.

```text
Bhote Koshi cancellation during the map switch restores the prior stack
```

The test checks code outside this area.

```text
Bhote Koshi disable preserves an operator-selected map and tears down every surface
```

The test checks code outside this area.

```text
Bhote Koshi disable stops active playback and releases its global render hold
```

The test checks code outside this area.

```text
Bhote Koshi passive restores do not start off-screen playback
```

The test checks code outside this area.

```text
Bhote Koshi standalone Scene keeps its Esri cinematic contract
```

The test checks code outside this area.

```text
Bhote Koshi scene beats preserve photoreal and never take camera ownership
```

The test checks code outside this area.

```text
Nepal hybrid comparison preserves native split and terrain-clamped flood trail
```

The test checks code outside this area.

```text
Bhote Koshi event pack keeps observations separate from reconstruction
```

The test checks code outside this area.

```text
Bhote Koshi publishes the evidence spine once and scrubs through cards and breadcrumbs
```

The test checks code outside this area.

```text
Bhote Koshi keeps one local fallback video active and unloads it on beat change and disable
```

The test checks code outside this area.

```text
Upper Valley Collapse autoplays its muted local fallback without starting the event clock
```

The test checks code outside this area.

```text
Debris-Dammed Lake card opens its source and is armed for approved local video autoplay
```

The test checks code outside this area.

```text
Nepal evidence shots resume the standalone callout and flood sequence from Border Gate
```

The test checks code outside this area.

```text
Bhote Koshi beat controls keep cards, flood, camera, and panel on the one clock
```

The test checks code outside this area.

```text
Bhote Koshi repeated event frames perform no panel lookup, DOM write, or camera churn
```

The test checks code outside this area.

```text
Bhote Koshi frame path keeps evidence lookup scalar and wrapper-free
```

The test checks code outside this area.

```text
Bhote Koshi cinematic camera stays synchronized through pause and deterministic scrubbing
```

The test checks code outside this area.

```text
Bhote Koshi replay restores cinematic ownership unless the operator released it
```

The test checks code outside this area.

```text
Bhote Koshi closes a poster that resolves after disable
```

The test checks code outside this area.

```text
every sourced shot grows its tail with its head, keeps its own card, and clears on exit
```

The test checks code outside this area.

```text
media-led upper-valley shots retain only their upstream prefix during camera travel
```

The test checks code outside this area.

```text
camera-led Nepal flood motion preserves its prefix and stays ahead of shot travel
```

The test checks code outside this area.

```text
Bhote Koshi corridor remains ordered downstream and inside the imagery rectangle
```

### src/scenes/director.test.mjs

The test also checks earlier director or presentation policy methods.

```text
Mailung clip trim estimates seven seconds and its exit, including older saved holds
```

The test also checks earlier director or presentation policy methods.

```text
Incident Corridor gives all overview pins time to reveal without rewriting saved shots
```

The test also checks earlier director or presentation policy methods.

```text
public defaults include Nepal without an extra standalone flood recipe
```

The test also checks earlier director or presentation policy methods.

```text
Nepal comparison shots load Esri beneath Vantor even from a saved OSM or photoreal shot
```

The test also checks earlier director or presentation policy methods.

```text
all saved Nepal shots choose a usable map in keyed and keyless runtimes without rewriting the project
```

The test also checks earlier director or presentation policy methods.

```text
only Play Shot or a scene run grants transient media authority; LOAD, Stop and replacement revoke it
```

The test also checks earlier director or presentation policy methods.

```text
destroyed directors refuse seek, replay, adjacent and continuation without writes
```

The test also checks earlier director or presentation policy methods.

```text
a seek waiting for run teardown is revoked by newer Stop, Load, Start or destroy
```

The title uses a word that the owner forbids.

```text
explicit scene-layer OFF revokes continuation during enable, flight and hold; internal OFF does not
```

The test also checks earlier director or presentation policy methods.

```text
a shot captured while tracking never re-establishes tracking on playback
```

The test also checks earlier director or presentation policy methods.

```text
applyVisualState gates the map-stack switch on both sides of its await
```

The test also checks earlier director or presentation policy methods.

```text
destroy drains cancelled LOAD work before its viewer can be discarded
```

The title uses a word that the owner forbids.

```text
Scene snapshots are immutable and editing outcomes retain the affected shot and index
```

The test also checks earlier director or presentation policy methods.

```text
Scene load outcomes exclude superseded and disposed completions
```

The title uses a word that the owner forbids.

```text
invalid and unsupported imports retain the current project, selection and saved bytes
```

No scenario states the combined import race and empty-project behavior.

```text
newer imports win delayed file reads, and an empty project is preserved
```

The test also checks earlier director or presentation policy methods.

```text
unsupported stored documents cannot be overwritten by fallback edits
```

The test also checks earlier director or presentation policy methods.

```text
zero camera pitch is preserved by both immediate placement and ordinary flight
```

## Decisions for the lead

Decision for the lead: the design records the source result limits and the scene-total field name.
The change does not add a requirement for those limits.

## Validation

The host checks pass.
The host uses Node v26.8.2.
The lead must run the image gates and review.

## Host test totals

The import sweep gives ten test files.
The test processes give 792 tests, 792 passes and zero failures.
The new file gives 220 tests, and the shared file gives 52 tests.
The source diff gives 17 new tags on old tests.

| File | Tests | Pass | Fail |
| --- | --- | --- | --- |
| `src/cameraGroundGuard.test.mjs` | 20 | 20 | 0 |
| `src/ui/sceneControls.test.mjs` | 9 | 9 | 0 |
| `src/director/interactions/interactions.test.mjs` | 6 | 6 | 0 |
| `src/data/bhoteKoshiLocator.test.mjs` | 19 | 19 | 0 |
| `src/data/bhoteKoshiEvent.test.mjs` | 43 | 43 | 0 |
| `src/scenes/directorShots.test.mjs` | 183 | 183 | 0 |
| `src/scenes/directorSetup.test.mjs` | 113 | 113 | 0 |
| `src/scenes/directorPacks.test.mjs` | 127 | 127 | 0 |
| `src/scenes/director.test.mjs` | 52 | 52 | 0 |
| `src/scenes/directorRun.test.mjs` | 220 | 220 | 0 |

The commands below give each test total without forced process termination.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && while IFS= read -r file; do taskset -c 12-15 nice -n 19 node --test --test-isolation=none "$file" > "/home/ianblenke/docker/gev-tools/director-4d/count-$(basename "$file" .test.mjs).log" 2>&1 || exit; done < /home/ianblenke/docker/gev-tools/director-4d/files.txt
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --test --test-isolation=none src/scenes/directorRun.test.mjs > /home/ianblenke/docker/gev-tools/director-4d/tests-final.log 2>&1
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4d/counts.py
cd /home/ianblenke/docker/gev-work/director-4d && git diff -- src/scenes/director.test.mjs
```

The single-file coverage commands follow.
The before sweep uses the same flags without the test exclusion flag.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && while IFS= read -r file; do taskset -c 12-15 nice -n 19 node --test --test-force-exit --test-isolation=none --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination="/home/ianblenke/docker/gev-tools/director-4d/after-$(basename "$file" .test.mjs).lcov" "$file" || exit; done < /home/ianblenke/docker/gev-tools/director-4d/files.txt
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --test --test-force-exit --test-isolation=none --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4d/after-directorRun.lcov src/scenes/directorRun.test.mjs
```

No source item in the requested area stays uncovered.
The whole file records uncovered branches at lines 263 and 852, outside this area.
The setup design records `installed-list-default`, and the pack design records `pack-layer-array`.

## Mutation and decision totals

The final mutation log gives 288 killed mutations and one equivalent mutation.
Every killed mutation fails a leaf test in the new repository test file.
Every new leaf test records a named killed mutation.
No scratch test supplies a killed result.
M195 stays without a repository test failure because the context policy treats both values the same.
The public proxy probes give the same result and field access order.

The audit gives 66 rows: 26 tested, 1 equivalent, 39 default-value and 0 open.

The source parser and audit commands give those row totals.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4d/decisions.cjs
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4d/audit.py
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4d/result-counts.py
```

The helper uses the mutation list in the scratch folder.
The first helper command tests the initial list.
Later helper commands select corrected and added IDs.
The final row result takes the last helper entry for that ID.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4d /home/ianblenke/docker/gev-tools/director-4d/muts.json
```

## Public source probes

The context logs match after the null fallback changes.
The import probe confirms the asset-owner error limit in the design.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4d/probe-loader.mjs /home/ianblenke/docker/gev-tools/director-4d/probe-context.mjs > /home/ianblenke/docker/gev-tools/director-4d/probe-context-original.log
cd /home/ianblenke/docker/gev-work/director-4d && DIRECTOR_PROBE_MUTATION=context-null taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4d/probe-loader.mjs /home/ianblenke/docker/gev-tools/director-4d/probe-context.mjs > /home/ianblenke/docker/gev-tools/director-4d/probe-context-mutant.log
cd /home/ianblenke/docker/gev-work/director-4d && cmp /home/ianblenke/docker/gev-tools/director-4d/probe-context-original.log /home/ianblenke/docker/gev-tools/director-4d/probe-context-mutant.log
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4d/probe-loader.mjs /home/ianblenke/docker/gev-tools/director-4d/probe-import-error.mjs
```

The after-shot probe records the default-scene ID limit in the design.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4d/probe-loader.mjs /home/ianblenke/docker/gev-tools/director-4d/probe-after-scene.mjs
```

## Prose and format checks

The STE lint reports zero errors.
The title check covers 237 titles and gives four warnings in unchanged old titles.
The new titles give no warning.

EPERM means an operation permission error.
The direct formatter stops with EPERM.
The supplied host adapter completes the format checks.
A separate Prettier check passes for the new test.

The prose helper reports quoted old titles and command names.
The test totals refer to different file groups.
The checks do not give an image gate verdict.

```bash
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --version
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-scene-run 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4d/check-titles.mjs
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-scene-run
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-4d && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```
