# Director shot evidence

Source commit: `dd4efcaccbac09ab63ec29192825a23b6368be91`.

## Scenario test links

### director-186: Shot capture

File: `src/scenes/directorShots.test.mjs`.

```text
[director-186] The capture records live fields and selects the new shot
```

### director-187: Capture guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-187] The capture rejects an absent scene
[director-187] The capture rejects an absent camera
```

### director-188: Shot update

File: `src/scenes/directorShots.test.mjs`.

```text
[director-188] The update uses a static camera
[director-188] The update uses a move camera
```

### director-189: Update guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-189] The update rejects an absent scene
[director-189] The update rejects an absent shot
[director-189] The update rejects an absent camera
```

### director-190: Shot deletion

File: `src/scenes/directorShots.test.mjs`.

```text
[director-190] The deletion handles the first
[director-190] The deletion handles the last
[director-190] The deletion handles the absent scene
[director-190] The deletion handles the absent shot
[director-190] The deleteShot checks only an absent scene
[director-190] The deleteShot checks only an absent shot
```

### director-191: Load guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-191] The load rejects destroyed
[director-191] The load rejects running
[director-191] The load rejects scene
[director-191] The load rejects shot
[director-191] The loadShot checks only an absent scene
[director-191] The loadShot checks only an absent shot
```

### director-192: Camera refusal

File: `src/scenes/directorShots.test.mjs`.

```text
[director-192] The camera refusal stops the load before visual state
```

File: `src/scenes/director.test.mjs`.

```text
[director-192] camera refusal starts no authored frame or playback clock
```

### director-193: Load defaults

File: `src/scenes/directorShots.test.mjs`.

```text
[director-193] The default flight uses the static duration
[director-193] The default flight uses the move duration
[director-193] The scene seek option handles false
[director-193] The scene seek option handles number
```

### director-194: Scene departure

File: `src/scenes/directorShots.test.mjs`.

```text
[director-194] The other scene stops before target visual state
[director-194] The next scene stops layers from a shot still in flight
```

File: `src/scenes/director.test.mjs`.

```text
[director-194] cross-scene replay grants media ownership only after the previous scene releases its layers
```

### director-195: Departure refusal

File: `src/scenes/directorShots.test.mjs`.

```text
[director-195] The scene departure handles refusal
[director-195] The scene departure handles cancellation
```

### director-196: Load replacement

File: `src/scenes/directorShots.test.mjs`.

```text
[director-196] The newer load cancels an older visual wait
```

File: `src/scenes/director.test.mjs`.

```text
[director-196] a newer LOAD aborts the previous LOAD transition rather than disowning it
[director-196] a superseded LOAD is refused its visual commit
[director-196] the newest LOAD wins when two loads race
```

### director-197: Load refusal

File: `src/scenes/directorShots.test.mjs`.

```text
[director-197] The load reports layers refusal
[director-197] The load reports packs refusal
```

File: `src/scenes/director.test.mjs`.

```text
[director-197] replay, adjacent and seek report layer refusal rather than success
```

### director-198: Load completion

File: `src/scenes/directorShots.test.mjs`.

```text
[director-198] The load completes flight before the hold phase
[director-198] The flight starts before travel publication and layer settlement
```

### director-199: Load errors

File: `src/scenes/directorShots.test.mjs`.

```text
[director-199] The flight error handles a live token
[director-199] The flight error handles a stale token
```

### director-200: Media ownership

File: `src/scenes/directorShots.test.mjs`.

```text
[director-200] The media owner reaches layer one
[director-200] The media owner reaches layer two
[director-200] The media method skips disabled
[director-200] The media method skips absent module
[director-200] The media method skips a value that is not a function
[director-200] The media method skips absent layers
[director-200] The load media option handles false
[director-200] The load media option handles true
[director-200] The scene seek does not grant media ownership
[director-200] The media owner accepts an absent manager
[director-200] The media owner accepts an absent layers
```

### director-201: Media guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-201] The media guard checks scene
[director-201] The media guard checks shot
[director-201] The media guard checks token
[director-201] The media guard checks cancelled
[director-201] The media guard checks aborted
[director-201] The old media owner stops module one
[director-201] The old media owner stops module two
```

### director-202: Layer settlement

File: `src/scenes/directorShots.test.mjs`.

```text
[director-202] The settleShotLayerStates reaches layer one
[director-202] The settleShotLayerStates reaches layer two
[director-202] The settleShotLayerStates skips the disabled layer
[director-202] The settleShotLayerStates skips the control layer
[director-202] The cancelled token does not settle layers
[director-202] The absent travel does not change another travel owner
[director-202] The absent travel gives null layer travel state
```

### director-203: Travel duration

File: `src/scenes/directorShots.test.mjs`.

```text
[director-203] The travel duration 4 gives 4 seconds
[director-203] The travel duration -1 gives 0.2 seconds
[director-203] The travel duration bad gives 4 seconds
```

### director-204: Travel publication

File: `src/scenes/directorShots.test.mjs`.

```text
[director-204] The publishShotTravel reaches layer one
[director-204] The publishShotTravel reaches layer two
[director-204] The publishShotTravel skips the disabled layer
[director-204] The publishShotTravel skips the control layer
```

### director-205: Travel cancellation

File: `src/scenes/directorShots.test.mjs`.

```text
[director-205] The cancelActiveSceneTravel reaches layer one
[director-205] The cancelActiveSceneTravel reaches layer two
[director-205] The cancelActiveSceneTravel skips the disabled layer
[director-205] The cancelActiveSceneTravel skips the control layer
[director-205] The absent travel still cancels camera motion
[director-205] The travel cancellation resolves a pack module
[director-205] The travel cancellation accepts an absent manager
[director-205] The travel cancellation accepts an absent layers
[director-205] The travel cancellation accepts an absent module
```

### director-206: Cancellation fallback

File: `src/scenes/directorShots.test.mjs`.

```text
[director-206] The travel cancellation handles a parameter refusal
[director-206] The travel cancellation handles a parameter error
[director-206] The travel cancellation handles an asynchronous layer error
[director-206] The travel cancellation handles a synchronous layer error
```

### director-207: Shot replay

File: `src/scenes/directorShots.test.mjs`.

```text
[director-207] The replay uses a static shot
[director-207] The replay uses a move shot
[director-207] The replay uses the default duration and cancellation result
```

### director-208: Replay guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-208] The replay rejects destroyed
[director-208] The replay rejects running
[director-208] The replay rejects scene
[director-208] The replay rejects shot
[director-208] The replayShot checks only an absent scene
[director-208] The replayShot checks only an absent shot
```

### director-209: Scene after a shot

File: `src/scenes/directorShots.test.mjs`.

```text
[director-209] The scene request starts after the selected shot
[director-209] The scene request rejects an absent scene
[director-209] The scene request rejects an absent shot
[director-209] The continueScene checks only an absent scene
[director-209] The continueScene checks only an absent shot
```

### director-210: Adjacent shots

File: `src/scenes/directorShots.test.mjs`.

```text
[director-210] The adjacent direction -1 selects its target
[director-210] The adjacent direction 1 selects its target
```

### director-211: Adjacent guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-211] The adjacent request rejects destroyed
[director-211] The adjacent request rejects running
[director-211] The adjacent request rejects scene
[director-211] The adjacent request rejects first
[director-211] The adjacent request rejects last
[director-211] The adjacent request rejects refusal
```

### director-212: Clock access

File: `src/scenes/directorShots.test.mjs`.

```text
[director-212] The clock timer total checks camera motion false
[director-212] The clock timer total checks camera motion true
```

File: `src/scenes/director.test.mjs`.

```text
[director-212] scene clock subscribers receive authoritative forward playback snapshots
```

### director-213: Idle wait

File: `src/scenes/directorShots.test.mjs`.

```text
[director-213] The idle promise handles an idle scene
[director-213] The idle promise handles an active scene
```

### director-214: Loaded shot seek

File: `src/scenes/directorShots.test.mjs`.

```text
[director-214] The direct seek updates layer one and the camera
[director-214] The direct seek updates layer two and the camera
[director-214] The direct seek skips absent disabled
[director-214] The direct seek skips absent params
```

### director-215: Loaded seek guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-215] The direct seek guard checks destroyed
[director-215] The direct seek guard checks scene
[director-215] The direct seek guard checks shot
[director-215] The direct seek guard checks packs
[director-215] The direct seek guard checks actions
[director-215] The direct seek guard checks loaded scene
[director-215] The direct seek guard checks selected shot
```

### director-216: Loaded seek refusal

File: `src/scenes/directorShots.test.mjs`.

```text
[director-216] The direct seek rejects camera refusal
[director-216] The direct seek rejects params refusal
```

### director-217: Scene seek

File: `src/scenes/directorShots.test.mjs`.

```text
[director-217] The scene seek uses the load path
[director-217] The scene seek uses the direct path
[director-217] The scene seek uses camera progress 0.5
[director-217] The scene seek uses camera progress 1
```

File: `src/scenes/director.test.mjs`.

```text
[director-217] scene clock seek resolves the exact shot phase and camera in both directions
```

### director-218: Scene seek guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-218] The scene seek rejects destroyed
[director-218] The scene seek rejects scene
[director-218] The scene seek rejects empty
[director-218] The scene seek rejects stale
[director-218] The scene seek rejects absent state
[director-218] The scene seek checks destroyed after the shot load
[director-218] The scene seek checks stale after the shot load
[director-218] The scene seek checks not started after the shot load
[director-218] The scene seek rejects destruction after its idle wait
```

### director-219: Load token

File: `src/scenes/directorShots.test.mjs`.

```text
[director-219] The load token checks destroyed
[director-219] The load token checks aborted
[director-219] The load token checks generation
[director-219] The load token checks live
[director-219] The load token accepts an absent signal
```

### director-220: Camera ownership

File: `src/scenes/directorShots.test.mjs`.

```text
[director-220] The camera claim handles absent
[director-220] The camera claim handles true
[director-220] The camera claim handles false
[director-220] The camera claim handles throw
```

### director-221: Camera placement

File: `src/scenes/directorShots.test.mjs`.

```text
[director-221] The camera placement handles pose
[director-221] The camera placement handles zero
[director-221] The camera placement handles defaults
[director-221] The camera placement accepts optional facade methods
```

### director-222: Scene list

File: `src/scenes/directorShots.test.mjs`.

```text
[director-222] The scene list gives project order and shot totals
```

### director-223: Scene query

File: `src/scenes/directorShots.test.mjs`.

```text
[director-223] The scene query handles s
[director-223] The scene query handles  SCENE 
[director-223] The scene query handles cen
[director-223] The scene query handles absent
[director-223] The scene query handles blank
[director-223] The scene query handles null
[director-223] The scene query handles undefined
[director-223] The scene ID takes precedence over both title matches
[director-223] The exact title takes precedence over a substring
[director-223] The null query does not match the word null
```

### director-224: Playback status

File: `src/scenes/directorShots.test.mjs`.

```text
[director-224] The playback status handles an idle scene
[director-224] The playback status handles an active scene
[director-224] The scene time does not become negative
```

### director-225: Seek camera fallback

File: `src/scenes/directorShots.test.mjs`.

```text
[director-225] The loaded seek resolves an absent camera
[director-225] The direct seek resolves an absent camera
[director-225] The loaded seek uses its own camera
[director-225] The direct seek uses its own camera
```

### director-226: Load media cleanup

File: `src/scenes/directorShots.test.mjs`.

```text
[director-226] The failure media cleanup checks owned
[director-226] The failure media cleanup checks unowned
[director-226] The failure media cleanup checks stale
[director-226] The failure media cleanup checks success
[director-226] The error media cleanup checks owned
[director-226] The error media cleanup checks unowned
[director-226] The error media cleanup checks stale
[director-226] The error media cleanup checks success
```

### director-227: Load cancellation checkpoints

File: `src/scenes/directorShots.test.mjs`.

```text
[director-227] The load cancellation stops after layers
[director-227] The load cancellation stops after packs
[director-227] The load cancellation stops after flight
[director-227] The load cancellation stops after settle
```

### director-228: Supplied flight duration

File: `src/scenes/directorShots.test.mjs`.

```text
[director-228] The supplied flight duration gives 0 seconds
[director-228] The supplied flight duration gives 1 seconds
```

### director-229: Camera arrival ownership

File: `src/scenes/directorShots.test.mjs`.

```text
[director-229] The shot camera cancels arrival work before its policy
```

### director-230: Camera placement guards

File: `src/scenes/directorShots.test.mjs`.

```text
[director-230] The camera placement handles absent pose
[director-230] The camera placement handles absent method
[director-230] The camera placement rejects an absent viewer
[director-230] The camera placement rejects an absent camera
```

## Old tests without new tags

The table groups tests by their source file.
Earlier changes keep their tags.
Quoted old titles keep their source words.

### src/locationReadouts.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
the ACTIVE STYLE indicator is written from the style name and nothing else
a free-text search records its destination for the LOCATION mini-status
the mini-status reads its copy from the shared formatter
selecting a preset location clears the superseded search label
any other camera destination clears the search label too
a deferred lookup that never flies leaves the readout standing
scene playback invalidates the search label on every shot
```

### src/ui/sceneControls.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
Scene controls render the supplied selection and running/download states
Scene controls dispatch explicit actions and revoke replaced shot-row listeners
Scene Escape and recording presentation follow playback and release on destruction
a file import finishing after disposal cannot clear the retained file control
Scene action failures are visible only while that action still owns presentation
creation and deletion prompts precede their model actions and remain inert after disposal
the real director preserves a selected shot label for the following double-click
inline shot names save on Enter, cancel on Escape, and reject blank names
Scene controls consume current state, preserve rows on progress, and unsubscribe on destruction
```

### src/director/interactions/interactions.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
[director-063] all four inert actions survive validation, migration and export without executing content
[director-056 director-060 director-061] reject unknown fields, executable syntax, invalid references and missing reset baselines
[director-068 director-073 director-074] pending actions cancel promptly, refuse overlap and cannot update a replacement session
[director-072 director-073] synchronous stop before execution prevents any side effect; rejection unlocks retry
settled pack shots cannot take the same-shot seek shortcut after Stop released geometry
actions preserve camera refusal, layer admission signal and explicit transition cap
```

### src/data/bhoteKoshiLocator.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
Bhote Koshi locator closes valid region rings once
Bhote Koshi locator selects the largest GeoJSON country exterior
Bhote Koshi locator reveals a border progressively
Bhote Koshi locator stages its anchored callout from dot to leader to text
Bhote Koshi regional locator sequences Nepal, border, then the incident
Bhote Koshi locator switches between Nepal context and the regional incident treatment
Incident Corridor reveals all fifteen overview pins and keeps layout active through the sequence
Bhote Koshi flood path draws a solid cyan sourced route after the place shot
Bhote Koshi path-overview presentation keeps the route settled without Nepal border
Bhote Koshi trigger-record presentation reveals sourced incident details
Bhote Koshi trigger-record waits for the scene camera, zooms, then orbits
Bhote Koshi locator keeps the regional context settled while nearby cities stagger in
Bhote Koshi locator degrades to labels when the regional boundary is unavailable
Bhote Koshi regional locator waits for its boundary before starting the full sequence
Bhote Koshi locator cancels a stale boundary resolution and removes its surface
```

### src/data/bhoteKoshiEvent.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
public lifecycle restores Nepal scene ownership without forwarding origin to enable
trimmed scene media holds through provider startup, playback and fade, then releases the camera
Pinokio source-card fallback selects authored Director dwell, not an impossible player hold
saved autoplay controls cannot authorize media; live shot ownership is cancellable and never serialized
Bhote Koshi timeline helpers clamp untrusted UI values
Bhote Koshi flood reveal is monotonic and bounded
Bhote Koshi flood corridor grows continuously to the animated surge head
Bhote Koshi story clock holds the flood for the cause beats then completes the corridor
Bhote Koshi camera holds its evidence beat, then travels by the next activation
Bhote Koshi card summaries wrap on words instead of clipping mid-sentence
Bhote Koshi evidence timeline is ordered by phase and corridor chainage with one active beat
Bhote Koshi scene beats resolve stable ids inside their reveal windows
Bhote Koshi scene shots continue the standalone evidence clock from Border Gate onward
Bhote Koshi evidence presentation reveals dot, leader, and card then tears down in reverse
Bhote Koshi evidence cards freeze useful landscape, portrait, and link-only footprints
Bhote Koshi gives YouTube and Facebook players priority over local review clips
Bhote Koshi beat navigation is deterministic in both directions and clamps at its ends
Bhote Koshi evidence fallback stays media-first and source-linked without card copy overload
Bhote Koshi evidence compositor contains portrait video from its decoded dimensions
Bhote Koshi failed direct enable restores the prior map and shared split
Bhote Koshi cancellation during the map switch restores the prior stack
Bhote Koshi disable preserves an operator-selected map and tears down every surface
Bhote Koshi disable stops active playback and releases its global render hold
Bhote Koshi passive restores do not start off-screen playback
Bhote Koshi standalone Scene keeps its Esri cinematic contract
Bhote Koshi scene beats preserve photoreal and never take camera ownership
Nepal hybrid comparison preserves native split and terrain-clamped flood trail
Bhote Koshi event pack keeps observations separate from reconstruction
Bhote Koshi publishes the evidence spine once and scrubs through cards and breadcrumbs
Bhote Koshi keeps one local fallback video active and unloads it on beat change and disable
Upper Valley Collapse autoplays its muted local fallback without starting the event clock
Debris-Dammed Lake card opens its source and is armed for approved local video autoplay
Nepal evidence shots resume the standalone callout and flood sequence from Border Gate
Bhote Koshi beat controls keep cards, flood, camera, and panel on the one clock
Bhote Koshi repeated event frames perform no panel lookup, DOM write, or camera churn
Bhote Koshi frame path keeps evidence lookup scalar and wrapper-free
Bhote Koshi cinematic camera stays synchronized through pause and deterministic scrubbing
Bhote Koshi replay restores cinematic ownership unless the operator released it
Bhote Koshi closes a poster that resolves after disable
every sourced shot grows its tail with its head, keeps its own card, and clears on exit
media-led upper-valley shots retain only their upstream prefix during camera travel
camera-led Nepal flood motion preserves its prefix and stays ahead of shot travel
Bhote Koshi corridor remains ordered downstream and inside the imagery rectangle
```

### src/scenes/directorPacks.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
[director-151] The legacy sequence keeps three shot IDs and cameras
[director-153] The legacy checkpoint error protects the scene
[director-154] The legacy pack refusal restores the project
[director-155] The legacy selection uses its first shot
[director-156] The absent scene rejects the pack
[director-157] The absent pack rejects the request
[director-159] The first Nepal pack adds its current sequence
[director-162] The authored final view supplies its ID and camera
[director-164] The stored final beat prevents another adoption
[director-165] The older additions follow recipe order
[director-167] The renamed bound shot receives its patch
[director-168] The absent bound shot rejects the inventory
[director-169] The repeated bound shot rejects the inventory
[director-171] The absent patch reference rejects the pack
[director-173] The camera patch sets its normalized pose
[director-175] The visual patch keeps other visual fields
[director-176] The layer patch accepts absent shot layers
[director-177] The layer list combines scene and pack IDs
[director-178] The pack checkpoint error protects shots
[director-180] The pack saves before both control updates
[director-181] The notice reports new shots
[director-182] The marker replacement keeps another pack marker
[director-184] The title match supplies a shot reference
[director-185] The silent options save without optional actions
[director-183] The recipe accepts an absent adopted layer object
[director-173] The expansion does not replace a patched camera
[director-183] The empty adoption list accepts expansion
[director-183] The absent source layer name does not check beats
[director-183] The empty source beat list does not check its layer
[director-176] The Nepal patch sets target 1
[director-176] The Nepal patch sets target 2
[director-176] The Nepal patch sets target 3
[director-176] The Nepal patch sets target 4
[director-176] The Nepal patch sets target 5
[director-176] The Nepal patch sets target 6
[director-176] The Nepal patch sets target 7
[director-176] The Nepal patch sets target 8
[director-176] The Nepal patch sets target 9
[director-175] The Nepal patch sets target 10
[director-175] The Nepal patch sets target 11
[director-175] The Nepal patch sets target 12
[director-175] The Nepal patch sets target 13
[director-176] The Nepal patch sets target 14
[director-162] The adoption uses immediate-collapse-viewpoint
[director-162] The adoption uses debris-dammed-lake
[director-162] The adoption uses second-landslide
[director-162] The adoption uses gyirong-border-gate
[director-162] The adoption uses timure-cluster
[director-162] The adoption uses syabru-besi
[director-162] The adoption uses dhunche
[director-162] The adoption uses mailung-upper-trishuli
[director-162] The adoption uses mailung-bazzar
[director-162] The adoption uses dandagaun
[director-162] The adoption uses dandagaun-viewpoint
[director-162] The adoption uses betrawati-bazaar
[director-162] The adoption uses bhainse
[director-162] The adoption uses bidur-trishuli-bridge
[director-162] The adoption uses devighat-taadi-khola-bridge
[director-162] The adoption uses charaudi
[director-162] The adoption uses final-view
[director-183] The pack layer array comes from the recipe normalizer
[director-163] The first pack does not adopt an authored shot
[director-162] The adoption keeps other authored layers
[director-182] The older marker does not add shots without expansion
[director-165] The last addition follows an authored tail
[director-166] The short title prefix rejects the pack
[director-173] The camera patch converts text numbers
[director-177] The pack layer array accepts a custom list getter
[director-155] The constructor selects the legacy scene after a custom pack
```

### src/scenes/directorSetup.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
[director-111] The initial selection
[director-116] The project normalization
[director-121] The absent migration anchor
[director-129] The shutdown promise
[director-132] The project timestamp
[director-133] The invalid project document
[director-134] The storage quota error
[director-136] The scene selector
[director-137] The shot list selection
[director-138] The scene and shot lookup
[director-139] The scene creation name
[director-140] The blank scene name
[director-141] The absent scene name
[director-142] The scene deletion
[director-143] The last scene deletion
[director-144] The layer state snapshot
[director-145] The shot outcome
[director-146] The control actions
[director-112] The empty project selects no scene or shot
[director-113] The absent project uses default scenes
[director-114] The rejected project protects its saved bytes
[director-115] The storage access error gives default scenes
[director-117] The migration uses the primary anchor
[director-118] The migration uses the fallback anchor
[director-119] The installation marker prevents a second scene
[director-120] The migration checks the scene id
[director-120] The migration checks the scene title
[director-122] The migration survives a storage error
[director-123] The installed pack checks version 17
[director-123] The installed pack checks version 0
[director-123] The installed pack checks version 18
[director-123] The unknown pack does not request an upgrade
[director-124] The canvas registers pointerdown
[director-124] The canvas registers wheel
[director-124] The camera gesture checks _usesAuthoredCamera
[director-124] The camera gesture checks _claimingCamera
[director-125] The active pointer action keeps camera ownership
[director-125] The inactive pointer action yields camera ownership
[director-126] The user request disables a scene layer
[director-126] The voice request disables a scene layer
[director-126] The tool request disables a scene layer
[director-127] The visibility request checks its enabled
[director-127] The visibility request checks its origin
[director-127] The visibility request checks its layer
[director-128] The work set removes success results
[director-128] The work set removes error results
[director-130] The shutdown disposes each resource
[director-131] The shutdown waits for unsettled work
[director-135] The toast uses its default text
[director-135] The toast removes its visible class after the deadline
[director-135] The toast tolerates a document error
[director-136] The selector keeps a valid scene
[director-136] The selector uses null for an empty project
[director-137] The shot list keeps a valid selection
[director-137] The shot list accepts an absent scene
[director-142] The absent scene selection leaves the project unchanged
[director-146] The scene control selects its first shot
[director-146] The controls give the project state
[director-147] The action checks _destroyed
[director-147] The action checks _running
[director-147] The action checks trackedEntity
[director-147] The action checks available
[director-148] The camera callback gives the authored pose
[director-148] The clock callbacks give state shot time and progress
[director-149] The initial snapshot gives the panel state
[director-130] The shutdown removes pointerdown
[director-130] The shutdown removes wheel
[director-131] The shutdown accepts an absent work set
[director-123] The constructor accepts absent pack markers
[director-137] The empty shot list leaves its selection
[director-146] The scene control selects an empty scene
[director-146] The controls call create
[director-146] The controls call deleteScene
[director-146] The controls call capture
[director-146] The controls call update
[director-146] The controls call start
[director-146] The controls call stop
[director-146] The controls call next
[director-146] The controls call export
[director-146] The controls call import
[director-146] The controls call download
[director-146] The controls call load
[director-146] The controls call deleteShot
[director-146] The controls call reviewImport
[director-118] The primary anchor takes precedence over the fallback
[director-121] The absent fallback avoids extra field access
[director-121] The recipe check rejects a nontext anchor
[director-146] The blank shot title keeps its saved title
[director-144] The layer snapshot includes one
[director-144] The layer snapshot includes two
[director-144] The layer snapshot excludes absent parameters
[director-142] The scene deletion accepts an empty shot list
[director-143] The last scene deletion uses an empty recipe list
[director-124] The constructor accepts a viewer without a scene
[director-124] The camera gesture accepts an absent event
[director-125] The pointer press accepts an absent interaction owner
[director-130] The shutdown accepts absent optional owners
[director-145] The outcome accepts an absent state owner
[director-146] The controls publish selection and name changes
[director-124] The constructor accepts an absent camera subscription
[director-123] The constructor checks each scene and pack marker
[director-149] The initial snapshot gives the storage error
[director-121] The project checks recipe bhote-koshi-nepal-scene
[director-121] The project checks recipe flights-radar
[director-121] The project checks recipe orbital-watch
[director-121] The project checks recipe thermal-threats
[director-121] The project checks recipe city-overload
[director-121] The project checks recipe omniscience-pullback
[director-123] The constructor reads an unknown pack marker
[director-123] The constructor reads an empty scene marker list
[director-138] The absent scene lookup returns null
[director-150] The constructor gives its byte store to the bundle source
[director-114] The invalid document text protects saved bytes
```

### src/cockpitMarkup.test.mjs

The tests check other module methods or keep earlier scenario tags.

```text
Cockpit has one reset action beside its bottom exit path
Cockpit heading tape leaves the bottom exit row unobstructed
Cockpit vision cycle exposes exactly five real visual styles without NONE
Contacts uses the approved radar icon
Cockpit Escape handling precedes form-control shortcut suppression and focus is restored
Cockpit shortcut failures do not leak and open Radio owns the first Escape
the Contact panel never hides itself out from under its own NEXT button
the cockpit reads its aircraft from the layer that owns Cesium tracking
programmatic Context layer changes cannot bypass explicit expansion policy
share startup isolates panel defaults from recipient-local collapse preferences
Cockpit owns a focused shared Display portal and compact Radio controls
Display orders 3D above Celestial, Clean UI below it, and Parameters below Detection
Clear Selected Layers uses one adopted batch and discards Context restoration state
Cockpit Display portal retains both scroll owners across round trips
Cockpit side surfaces behave as two single-expanded accordions
fresh Cockpit entry temporarily collapses map panels and exit restores their exact layout
real disclosure changes reconsider only their own temporary panel lane
Cockpit hides the complete top-center globe action group
Reset releases Contact camera ownership through its selection-preserving route
Location navigation releases immediate routes before flight and deferred routes after resolution
Cockpit Radio station changes preserve first-person camera ownership
Cockpit panel corridors reserve the owned topline readouts
an expanded Cockpit left panel stays above Contact, HUD, and attribution
Cockpit side rulers stay behind interactive panel surfaces
Cockpit Display portals shared HUD, Detection, Parameters, and 3D controls
mobile Cockpit prioritizes flight instruments and collision-safe controls
cockpit route direction uses self-contained vector artwork, not a font ligature
cockpit aircraft handoff invalidates the prior world-position anchor
cockpit weather control is off before JavaScript restores an explicit opt-in
cockpit summary presents the focused item as Contact
Cockpit Contact navigation omits the redundant Focus camera action
Global Context names its mixed contact cycle without changing the stable mode id
Global Context uses its dedicated right rail without a duplicate Data Layers row
Global Context standby describes both chooser modes
cockpit briefing cycle control keeps its state as the accessible name
voice Cockpit entry honours a requested contact layer before it enters
voice Cockpit entry refuses when the entry gate is shut
cockpit state cannot report entryAllowed while already active
```

### src/cameraGroundGuard.test.mjs

The tests check arrival helper hooks.
The navigation policy also cancels arrival work.
Those tests do not prove which method cancels that work.

```text
a buried camera is lifted clear of the surface
a camera resting on the surface is lifted to a usable height
a well-framed arrival is left alone
sub-metre noise never triggers a nudge
an unmeasurable surface is never acted on
the clearance frames a subject without turning into an overflight
the guard lifts a buried arrival once the surface answers
the guard waits for streaming tiles and yields to a newer arrival
the guard leaves a clear view untouched
```

### src/scenes/director.test.mjs

The tests keep earlier tags, check other methods, or keep titles outside the new prose rules.
The known limits state the title exceptions.

```text
Mailung clip trim estimates seven seconds and its exit, including older saved holds
Incident Corridor gives all overview pins time to reveal without rewriting saved shots
[director-159 director-173 director-158] the Nepal evidence pack appends once and applies the approved corridor framing
[director-160 director-165] installed v12 Nepal pack inserts ten points without replacing renamed cameras
[director-151 director-155] a legacy three-shot Nepal browser project bootstraps to the current 25-shot sequence
[director-166] the Nepal evidence pack refuses a partial inventory without mutating the scene
[director-182 director-158] the Nepal pack upgrades the upper-valley shots without duplicating evidence beats
[director-117] an older default project gains the complete selectable Nepal scene once
[director-119] a previously installed Nepal scene stays deleted when its marker remains
public defaults include Nepal without an extra standalone flood recipe
[director-118] an existing public default project gains Nepal without replacing authored shots
Nepal comparison shots load Esri beneath Vantor even from a saved OSM or photoreal shot
all saved Nepal shots choose a usable map in keyed and keyless runtimes without rewriting the project
only Play Shot or a scene run grants transient media authority; LOAD, Stop and replacement revoke it
scene camera waits for provider completion and fade rather than the saved media hold
Stop cancels a provider-owned shot hold and late completion cannot fly the next camera
a provider-owned hold fails boundedly if its owner never settles
destroyed directors refuse seek, replay, adjacent and continuation without writes
a seek waiting for run teardown is revoked by newer Stop, Load, Start or destroy
explicit scene-layer OFF revokes continuation during enable, flight and hold; internal OFF does not
scene preview owns recording chrome while panel playback leaves it available
the director reconciles only the layers a shot declares
a shot captured while tracking never re-establishes tracking on playback
a dirty Space Missions state is exited before a recipe applies its layers
Orbital Watch does not compose over a Space Missions replay
a non-isolating context mode is left alone
a refused layer is reported, never counted as applied
cancellation between two layers ends the reconcile where it stands
STOP during a suspended visual transition lands no layer changes
STOP between two layers lands no further layer changes
STOP aborts the layer transition in flight, not merely the next one
applyVisualState gates the map-stack switch on both sides of its await
a run refuses the visual commit of a shot cancelled mid-transition
a scene run supersedes a LOAD still suspended on its visual await
destroy drains cancelled LOAD work before its viewer can be discarded
Scene snapshots are immutable and editing outcomes retain the affected shot and index
Scene load outcomes exclude superseded and disposed completions
invalid and unsupported imports retain the current project, selection and saved bytes
newer imports win delayed file reads, and an empty project is preserved
unsupported stored documents cannot be overwritten by fallback edits
valid import settles a cancelled load before replacing the project
a delayed import cannot publish after disposal
[director-133] invalid authored edits cannot persist an unreadable project over a good save
zero camera pitch is preserved by both immediate placement and ordinary flight
```

## Source commands

The command list records each source sweep and host check.
The lead runs image gates and the ledger commands.

```sh
cd /home/ianblenke/docker/gev-work/director-4c && git rev-parse HEAD
cd /home/ianblenke/docker/gev-work/director-4c && rg -n '^  [a-zA-Z#_].*\) \{$' src/scenes/director.js
cd /home/ianblenke/docker/gev-work/director-4c && rg -l 'director\.js' --glob '*.test.mjs' --hidden -g '!node_modules/**' -g '!.git/**' .
cd /home/ianblenke/docker/gev-work/director-4c && rg -o --no-filename 'director-[0-9]{3}' openspec/changes/backfill-director-*/specs/director/spec.md | sort -u | tail -1
cd /home/ianblenke/docker/gev-work/director-4c && NODE_PATH=/home/ianblenke/docker/gev-work/node_modules taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4c/decisions.cjs
cd /home/ianblenke/docker/gev-work/director-4c && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-force-exit src/scenes/directorShots.test.mjs
cd /home/ianblenke/docker/gev-work/director-4c && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4c /home/ianblenke/docker/gev-tools/director-4c/muts.json
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-scene-shots 2>&1 | grep -E '^(ERROR|STE)'
```

## Host results

The host uses Node 26.8.2.
The test sweep uses separate processes for each director import file.
The sweep also finds source text tests.
The report command below gives each total in this section.

The sweep passes 572 tests in 9 files.
The new file passes 183 tests.
The old director file keeps 35 tests without tags.
The scenario and test table above lists every new link.

| File | Passed tests |
| --- | --- |
| `src/scenes/directorShots.test.mjs` | 183 |
| `src/data/bhoteKoshiEvent.test.mjs` | 43 |
| `src/data/bhoteKoshiLocator.test.mjs` | 19 |
| `src/cameraGroundGuard.test.mjs` | 20 |
| `src/scenes/director.test.mjs` | 52 |
| `src/scenes/directorPacks.test.mjs` | 127 |
| `src/scenes/directorSetup.test.mjs` | 113 |
| `src/director/interactions/interactions.test.mjs` | 6 |
| `src/ui/sceneControls.test.mjs` | 9 |

## Host coverage

The source area is `src/scenes/director.js:917` through line 1653.
The helper combines positive line hits from the separate file measurements.
The helper maps functions by source line and branch records by source line and local order.
Node can give different branch records after more function paths run.
Host totals do not give the image gate verdict.

| Area | Lines | Branch records | Functions |
| --- | --- | --- | --- |
| Shot methods | 737/737 | 287/287 | 55/55 |
| Whole class | 2336/2483 | 764/820 | 190/202 |
No line, branch record or function remains uncovered in this source area.
The other class methods remain outside this change.

## Mutation and decision results

The helper checks 191 source mutations.
The tests of the change kill 188 mutations.
The public probes give the same result for 2 mutations.
One mutation survives the tests of the change, because only a getter that gives a different result for each access shows it.
The named known limits and decision audit state those reasons.

The audit records 65 rows: 40 tested, 2 equivalent and 23 default-value rows.
The audit records zero open rows.
The source parser and audit command give these totals.

Decision for the lead: the direct path can report success after layer refusal without another layer attempt.
Decision for the lead: an absent source shot can select the first shot through the next-shot method.
Decision for the lead: a zero-duration camera flight uses a four-second travel record.

Decision for the lead: deletion from another scene changes the shot selection without a scene selection change.
Decision for the lead: shot methods report memory changes after a storage error.
The known limits give source lines and probe details.
No scenario states these cases.

## Format and prose checks

The direct formatter stopped before it finished with `spawnSync git EPERM`.
The host adapter uses Git output only when Git returns status zero and empty error output.
The adapter changes neither format scope nor checks.
The adapter passes the formatter commands for 1158 source files.
The new test file also passes its own Prettier format command.

The spec parser reports zero errors for this change.
The title check reports zero word or length errors for 183 new titles and 8 old titles with new tags.

The final prose helper reports only unchanged source titles and command tokens.
The differing numbers describe separate test, format, mutation and time values.
The source commands and result tables give each value.

## Final source commands

```sh
cd /home/ianblenke/docker/gev-work/director-4c && git show HEAD:src/scenes/director.js > /home/ianblenke/docker/gev-tools/director-4c/director-head.js
cd /home/ianblenke/docker/gev-work/director-4c && NODE_PATH=/home/ianblenke/docker/gev-work/node_modules taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4c/decisions.cjs
cd /home/ianblenke/docker/gev-work/director-4c && for f in src/scenes/director.test.mjs src/scenes/directorSetup.test.mjs src/scenes/directorPacks.test.mjs src/cameraGroundGuard.test.mjs src/ui/sceneControls.test.mjs src/director/interactions/interactions.test.mjs src/data/bhoteKoshiEvent.test.mjs src/data/bhoteKoshiLocator.test.mjs; do NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4c/final-$(basename "$f").lcov --test-reporter=spec --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4c/final-$(basename "$f").log "$f"; done
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4c/final-directorShots.test.mjs.lcov --test-reporter=spec --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4c/tests.log src/scenes/directorShots.test.mjs
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4c /home/ianblenke/docker/gev-tools/director-4c/muts.json $(cat /home/ianblenke/docker/gev-tools/director-4c/retry-ids.txt)
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4c /home/ianblenke/docker/gev-tools/director-4c/muts.json M180 M181 M182 M183 M184 M185 M186
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4c /home/ianblenke/docker/gev-tools/director-4c/muts.json M187 M188 M189 M190
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4c /home/ianblenke/docker/gev-tools/director-4c/muts.json M191
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-force-exit /home/ianblenke/docker/gev-tools/director-4c/probes.test.mjs
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4c/check.mjs
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4c/coverage.py final
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4c/audit.py
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4c/docs.py
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4c/report.py
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 node --version
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 node ../node_modules/prettier/bin/prettier.cjs --write src/scenes/directorShots.test.mjs
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-4c && NODE_OPTIONS='--import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs' taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-4c && NODE_OPTIONS='--import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs' taskset -c 12-15 nice -n 19 node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-4c && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-scene-shots
cd /home/ianblenke/docker/gev-work/director-4c && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-4c && git status --short
```

The last mutation check uses this command.

```sh
cd /home/ianblenke/docker/gev-work/director-4c && NODE_COMPILE_CACHE=/home/ianblenke/docker/gev-tools/director-4c/node-cache NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-4c /home/ianblenke/docker/gev-tools/director-4c/muts.json M136
```
