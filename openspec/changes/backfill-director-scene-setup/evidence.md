# Director setup evidence

Source commit: `345ce08d8712c6a547e5bba5da2e2d31e40d4c39`.

## Scope sweep

The sweep checks every test file that imports the scene director.
The old director file contains 52 tests.
The change tags four old tests and leaves 48 old tests without new tags.
The new test file contains 113 tests.
The delta adds 40 scenarios, from `director-111` through `director-150`.
The scenario sweep checks the full sequence and finds no duplicate ID or gap.

Source command for these values:

```sh
cd /home/ianblenke/docker/gev-work/director-4a && python3 /home/ianblenke/docker/gev-tools/director-4a/sweep.py
```

## Scenario test links

All new tests use `src/scenes/directorSetup.test.mjs`.
Old tagged tests use `src/scenes/director.test.mjs`.
Each block gives a scenario title and its exact test names.

### director-111: The initial selection

```text
[director-111] The initial selection
```

### director-112: The empty project

```text
[director-112] The empty project selects no scene or shot
```

### director-113: The absent saved project

```text
[director-113] The absent project uses default scenes
```

### director-114: The rejected saved project

```text
[director-114] The rejected project protects its saved bytes
[director-114] The invalid document text protects saved bytes
```

### director-115: The storage access error

```text
[director-115] The storage access error gives default scenes
```

### director-116: The project normalization

```text
[director-116] The project normalization
```

### director-117: The scene migration anchor

```text
[director-117] an older default project gains the complete selectable Nepal scene once
[director-117] The migration uses the primary anchor
```

### director-118: The scene migration fallback

```text
[director-118] an existing public default project gains Nepal without replacing authored shots
[director-118] The migration uses the fallback anchor
[director-118] The primary anchor takes precedence over the fallback
```

### director-119: The scene migration marker

```text
[director-119] a previously installed Nepal scene stays deleted when its marker remains
[director-119] The installation marker prevents a second scene
```

### director-120: The scene migration identity

```text
[director-120] The migration checks the scene id
[director-120] The migration checks the scene title
```

### director-121: The absent migration anchor

```text
[director-121] The absent migration anchor
[director-121] The absent fallback avoids extra field access
[director-121] The recipe check rejects a nontext anchor
[director-121] The project checks recipe bhote-koshi-nepal-scene
[director-121] The project checks recipe flights-radar
[director-121] The project checks recipe orbital-watch
[director-121] The project checks recipe thermal-threats
[director-121] The project checks recipe city-overload
[director-121] The project checks recipe omniscience-pullback
```

### director-122: The migration storage error

```text
[director-122] The migration survives a storage error
```

### director-123: The installed pack upgrade

```text
[director-123] The installed pack checks version 17
[director-123] The installed pack checks version 0
[director-123] The installed pack checks version 18
[director-123] The unknown pack does not request an upgrade
[director-123] The constructor accepts absent pack markers
[director-123] The constructor checks each scene and pack marker
[director-123] The constructor reads an unknown pack marker
[director-123] The constructor reads an empty scene marker list
```

### director-124: The camera input events

```text
[director-124] The canvas registers pointerdown
[director-124] The canvas registers wheel
[director-124] The camera gesture checks _usesAuthoredCamera
[director-124] The camera gesture checks _claimingCamera
[director-124] The constructor accepts a viewer without a scene
[director-124] The camera gesture accepts an absent event
[director-124] The constructor accepts an absent camera subscription
```

### director-125: The active pointer action

```text
[director-125] The active pointer action keeps camera ownership
[director-125] The inactive pointer action yields camera ownership
[director-125] The pointer press accepts an absent interaction owner
```

### director-126: The layer visibility request

```text
[director-126] The user request disables a scene layer
[director-126] The voice request disables a scene layer
[director-126] The tool request disables a scene layer
```

### director-127: The unrelated visibility request

```text
[director-127] The visibility request checks its enabled
[director-127] The visibility request checks its origin
[director-127] The visibility request checks its layer
```

### director-128: The work settlement

```text
[director-128] The work set removes success results
[director-128] The work set removes error results
```

### director-129: The shutdown promise

```text
[director-129] The shutdown promise
```

### director-130: The shutdown resources

```text
[director-130] The shutdown disposes each resource
[director-130] The shutdown removes pointerdown
[director-130] The shutdown removes wheel
[director-130] The shutdown accepts absent optional owners
```

### director-131: The shutdown work

```text
[director-131] The shutdown waits for unsettled work
[director-131] The shutdown accepts an absent work set
```

### director-132: The project timestamp

```text
[director-132] The project timestamp
```

### director-133: The invalid project document

```text
[director-133] invalid authored edits cannot persist an unreadable project over a good save
[director-133] The invalid project document
```

### director-134: The storage quota error

```text
[director-134] The storage quota error
```

### director-135: The storage notice

```text
[director-135] The toast uses its default text
[director-135] The toast removes its visible class after the deadline
[director-135] The toast tolerates a document error
```

### director-136: The scene selector

```text
[director-136] The scene selector
[director-136] The selector keeps a valid scene
[director-136] The selector uses null for an empty project
```

### director-137: The shot list selection

```text
[director-137] The shot list selection
[director-137] The shot list keeps a valid selection
[director-137] The shot list accepts an absent scene
[director-137] The empty shot list leaves its selection
```

### director-138: The scene and shot lookup

```text
[director-138] The scene and shot lookup
[director-138] The absent scene lookup returns null
```

### director-139: The scene creation name

```text
[director-139] The scene creation name
```

### director-140: The blank scene name

```text
[director-140] The blank scene name
```

### director-141: The absent scene name

```text
[director-141] The absent scene name
```

### director-142: The scene deletion

```text
[director-142] The scene deletion
[director-142] The absent scene selection leaves the project unchanged
[director-142] The scene deletion accepts an empty shot list
```

### director-143: The last scene deletion

```text
[director-143] The last scene deletion
[director-143] The last scene deletion uses an empty recipe list
```

### director-144: The layer state snapshot

```text
[director-144] The layer state snapshot
[director-144] The layer snapshot includes one
[director-144] The layer snapshot includes two
[director-144] The layer snapshot excludes absent parameters
```

### director-145: The shot outcome

```text
[director-145] The shot outcome
[director-145] The outcome accepts an absent state owner
```

### director-146: The control actions

```text
[director-146] The control actions
[director-146] The scene control selects its first shot
[director-146] The controls give the project state
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
[director-146] The blank shot title keeps its saved title
[director-146] The controls publish selection and name changes
```

### director-147: The interaction availability

```text
[director-147] The action checks _destroyed
[director-147] The action checks _running
[director-147] The action checks trackedEntity
[director-147] The action checks available
```

### director-148: The constructor callbacks

```text
[director-148] The camera callback gives the authored pose
[director-148] The clock callbacks give state shot time and progress
```

### director-149: The initial state snapshot

```text
[director-149] The initial snapshot gives the panel state
[director-149] The initial snapshot gives the storage error
```

### director-150: The bundle source owner

```text
[director-150] The constructor gives its byte store to the bundle source
```

## Old tests without new tags

Each block gives the old title, its source line and the reason.
The source sweep supplies the titles and line numbers.
The owner rule keeps every old title unchanged.

### src/cameraGroundGuard.test.mjs

The test checks another module or a later director method.

```text
15: a buried camera is lifted clear of the surface
21: a camera resting on the surface is lifted to a usable height
26: a well-framed arrival is left alone
31: sub-metre noise never triggers a nudge
39: an unmeasurable surface is never acted on
45: the clearance frames a subject without turning into an overflight
70: the guard lifts a buried arrival once the surface answers
88: the guard waits for streaming tiles and yields to a newer arrival
105: the guard leaves a clear view untouched
```

### src/data/bhoteKoshiLocator.test.mjs

The test checks another module or a later director method.

```text
60: Bhote Koshi locator closes valid region rings once
70: Bhote Koshi locator selects the largest GeoJSON country exterior
81: Bhote Koshi locator reveals a border progressively
95: Bhote Koshi locator stages its anchored callout from dot to leader to text
110: Bhote Koshi regional locator sequences Nepal, border, then the incident
187: Bhote Koshi locator switches between Nepal context and the regional incident treatment
236: Incident Corridor reveals all fifteen overview pins and keeps layout active through the sequence
289: Bhote Koshi flood path draws a solid cyan sourced route after the place shot
345: Bhote Koshi path-overview presentation keeps the route settled without Nepal border
388: Bhote Koshi trigger-record presentation reveals sourced incident details
433: Bhote Koshi trigger-record waits for the scene camera, zooms, then orbits
547: Bhote Koshi locator keeps the regional context settled while nearby cities stagger in
598: Bhote Koshi locator degrades to labels when the regional boundary is unavailable
627: Bhote Koshi regional locator waits for its boundary before starting the full sequence
661: Bhote Koshi locator cancels a stale boundary resolution and removes its surface
```

### src/data/bhoteKoshiEvent.test.mjs

The test checks another module or a later director method.

```text
186: public lifecycle restores Nepal scene ownership without forwarding origin to enable
252: trimmed scene media holds through provider startup, playback and fade, then releases the camera
307: Pinokio source-card fallback selects authored Director dwell, not an impossible player hold
350: saved autoplay controls cannot authorize media; live shot ownership is cancellable and never serialized
395: Bhote Koshi timeline helpers clamp untrusted UI values
403: Bhote Koshi flood reveal is monotonic and bounded
411: Bhote Koshi flood corridor grows continuously to the animated surge head
441: Bhote Koshi story clock holds the flood for the cause beats then completes the corridor
450: Bhote Koshi camera holds its evidence beat, then travels by the next activation
489: Bhote Koshi card summaries wrap on words instead of clipping mid-sentence
497: Bhote Koshi evidence timeline is ordered by phase and corridor chainage with one active beat
547: Bhote Koshi scene beats resolve stable ids inside their reveal windows
559: Bhote Koshi scene shots continue the standalone evidence clock from Border Gate onward
582: Bhote Koshi evidence presentation reveals dot, leader, and card then tears down in reverse
610: Bhote Koshi evidence cards freeze useful landscape, portrait, and link-only footprints
631: Bhote Koshi gives YouTube and Facebook players priority over local review clips
652: Bhote Koshi beat navigation is deterministic in both directions and clamps at its ends
663: Bhote Koshi evidence fallback stays media-first and source-linked without card copy overload
704: Bhote Koshi evidence compositor contains portrait video from its decoded dimensions
739: Bhote Koshi failed direct enable restores the prior map and shared split
794: Bhote Koshi cancellation during the map switch restores the prior stack
838: Bhote Koshi disable preserves an operator-selected map and tears down every surface
903: Bhote Koshi disable stops active playback and releases its global render hold
963: Bhote Koshi passive restores do not start off-screen playback
1004: Bhote Koshi standalone Scene keeps its Esri cinematic contract
1070: Bhote Koshi scene beats preserve photoreal and never take camera ownership
1408: Nepal hybrid comparison preserves native split and terrain-clamped flood trail
1486: Bhote Koshi event pack keeps observations separate from reconstruction
1553: Bhote Koshi publishes the evidence spine once and scrubs through cards and breadcrumbs
1613: Bhote Koshi keeps one local fallback video active and unloads it on beat change and disable
1708: Upper Valley Collapse autoplays its muted local fallback without starting the event clock
1819: Debris-Dammed Lake card opens its source and is armed for approved local video autoplay
1897: Nepal evidence shots resume the standalone callout and flood sequence from Border Gate
2073: Bhote Koshi beat controls keep cards, flood, camera, and panel on the one clock
2206: Bhote Koshi repeated event frames perform no panel lookup, DOM write, or camera churn
2276: Bhote Koshi frame path keeps evidence lookup scalar and wrapper-free
2296: Bhote Koshi cinematic camera stays synchronized through pause and deterministic scrubbing
2371: Bhote Koshi replay restores cinematic ownership unless the operator released it
2461: Bhote Koshi closes a poster that resolves after disable
2502: every sourced shot grows its tail with its head, keeps its own card, and clears on exit
2607: media-led upper-valley shots retain only their upstream prefix during camera travel
2694: camera-led Nepal flood motion preserves its prefix and stays ahead of shot travel
2903: Bhote Koshi corridor remains ordered downstream and inside the imagery rectangle
```

### src/director/interactions/interactions.test.mjs

The test checks another module or a later director method.

```text
73: [director-063] all four inert actions survive validation, migration and export without executing content
86: [director-056 director-060 director-061] reject unknown fields, executable syntax, invalid references and missing reset baselines
129: [director-068 director-073 director-074] pending actions cancel promptly, refuse overlap and cannot update a replacement session
161: [director-072 director-073] synchronous stop before execution prevents any side effect; rejection unlocks retry
181: settled pack shots cannot take the same-shot seek shortcut after Stop released geometry
194: actions preserve camera refusal, layer admission signal and explicit transition cap
```

### src/scenes/director.test.mjs

Part D covers the playback, layer, camera or finish method.

```text
100: Mailung clip trim estimates seven seconds and its exit, including older saved holds
123: Incident Corridor gives all overview pins time to reveal without rewriting saved shots
534: all saved Nepal shots choose a usable map in keyed and keyless runtimes without rewriting the project
801: scene camera waits for provider completion and fade rather than the saved media hold
824: Stop cancels a provider-owned shot hold and late completion cannot fly the next camera
842: a provider-owned hold fails boundedly if its owner never settles
935: scene preview owns recording chrome while panel playback leaves it available
959: the director reconciles only the layers a shot declares
978: a shot captured while tracking never re-establishes tracking on playback
1005: a dirty Space Missions state is exited before a recipe applies its layers
1054: a non-isolating context mode is left alone
1066: a refused layer is reported, never counted as applied
1088: cancellation between two layers ends the reconcile where it stands
1111: STOP during a suspended visual transition lands no layer changes
1137: STOP between two layers lands no further layer changes
1170: STOP aborts the layer transition in flight, not merely the next one
1312: a run refuses the visual commit of a shot cancelled mid-transition
1562: zero camera pitch is preserved by both immediate placement and ordinary flight
1575: camera refusal starts no authored frame or playback clock
```

### src/scenes/director.test.mjs

Part C covers the load, travel or seek method.

```text
148: scene clock seek resolves the exact shot phase and camera in both directions
510: Nepal comparison shots load Esri beneath Vantor even from a saved OSM or photoreal shot
734: only Play Shot or a scene run grants transient media authority; LOAD, Stop and replacement revoke it
766: cross-scene replay grants media ownership only after the previous scene releases its layers
861: destroyed directors refuse seek, replay, adjacent and continuation without writes
875: replay, adjacent and seek report layer refusal rather than success
884: a seek waiting for run teardown is revoked by newer Stop, Load, Start or destroy
1034: Orbital Watch does not compose over a Space Missions replay
1218: a newer LOAD aborts the previous LOAD transition rather than disowning it
1284: a superseded LOAD is refused its visual commit
1339: the newest LOAD wins when two loads race
1369: a scene run supersedes a LOAD still suspended on its visual await
1444: Scene load outcomes exclude superseded and disposed completions
```

### src/scenes/director.test.mjs

The test checks later import or shot edit methods.

```text
178: scene clock subscribers receive authoritative forward playback snapshots
1417: Scene snapshots are immutable and editing outcomes retain the affected shot and index
1469: invalid and unsupported imports retain the current project, selection and saved bytes
1489: newer imports win delayed file reads, and an empty project is preserved
1517: valid import settles a cancelled load before replacing the project
1536: a delayed import cannot publish after disposal
```

### src/scenes/director.test.mjs

Part B covers the legacy bootstrap or shot pack method.

```text
200: the Nepal evidence pack appends once and applies the approved corridor framing
323: installed v12 Nepal pack inserts ten points without replacing renamed cameras
359: a legacy three-shot Nepal browser project bootstraps to the current 25-shot sequence
380: the Nepal evidence pack refuses a partial inventory without mutating the scene
400: the Nepal pack upgrades the upper-valley shots without duplicating evidence beats
```

### src/scenes/director.test.mjs

The test checks another production module.

```text
490: public defaults include Nepal without an extra standalone flood recipe
1242: applyVisualState gates the map-stack switch on both sides of its await
```

### src/scenes/director.test.mjs

The title uses a banned word. The test also spans later playback methods.

```text
907: explicit scene-layer OFF revokes continuation during enable, flight and hold; internal OFF does not
```

### src/scenes/director.test.mjs

The test spans shutdown and later load or start methods.

```text
1395: destroy drains cancelled LOAD work before its viewer can be discarded
```

### src/scenes/director.test.mjs

The test spans saved document protection and later import methods.

```text
1503: unsupported stored documents cannot be overwritten by fallback edits
```

### src/ui/sceneControls.test.mjs

The test checks another module or a later director method.

```text
145: Scene controls render the supplied selection and running/download states
172: Scene controls dispatch explicit actions and revoke replaced shot-row listeners
203: Scene Escape and recording presentation follow playback and release on destruction
237: a file import finishing after disposal cannot clear the retained file control
258: Scene action failures are visible only while that action still owns presentation
286: creation and deletion prompts precede their model actions and remain inert after disposal
328: the real director preserves a selected shot label for the following double-click
373: inline shot names save on Enter, cancel on Escape, and reject blank names
402: Scene controls consume current state, preserve rows on progress, and unsubscribe on destruction
```

## Host coverage

Host Node: `26.8.2`.
The host checks one test file per process.
The helper combines covered lines and paths from their separate records.
The helper uses each branch location and its ordinal within that source line.
The helper pairs duplicate function names with their declaration order.
Node adds records when tests call more source paths.

The host totals do not give a gate verdict.

| Area | Lines | Branches | Functions |
| --- | --- | --- | --- |
| Before: lines 75–532 | 397/458 | 73/97 | 35/57 |
| After: lines 75–532 | 458/458 | 162/163 | 58/58 |

The branch at `src/scenes/director.js:263` cannot use its empty array operand.
The normalizer sets an own array first.
The custom storage proxy cannot cross document validation.
The scratch probe checks property access before that rejection.
No other line, branch or function in this area stays uncovered in the host sweep.

The first isolated new-test process stopped before leaf results.
The later process uses no test isolation and completes.
The host does not replace the gate image.

### Coverage commands

The helper issues the coverage command once for each imported test file.
The files come from the repository import sweep.
The new test file appears only in the final sweep.

```sh
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none python3 -u /home/ianblenke/docker/gev-tools/director-4a/coverage.py final
cd /home/ianblenke/docker/gev-work/director-4a && python3 /home/ianblenke/docker/gev-tools/director-4a/coverage.py
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-0.lcov ./src/cameraGroundGuard.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-1.lcov ./src/data/bhoteKoshiLocator.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-2.lcov ./src/data/bhoteKoshiEvent.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-3.lcov ./src/director/interactions/interactions.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-4.lcov ./src/scenes/director.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-5.lcov ./src/ui/sceneControls.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/final-6.lcov src/scenes/directorSetup.test.mjs
```

## Mutation and audit totals

The final result sweep finds 160 killed mutations and 1 source limit mutation.
The decision audit records 33 rows: 19 tested, 1 equivalent and 13 default-value rows.
The audit records zero open rows.
The mutation table gives each selected test.

```sh
cd /home/ianblenke/docker/gev-work/director-4a && python3 /home/ianblenke/docker/gev-tools/director-4a/report.py
cd /home/ianblenke/docker/gev-work/director-4a && python3 /home/ianblenke/docker/gev-tools/director-4a/audit.py
```

## Decisions for the lead

Decision for the lead: the shot list can keep a shot ID when the selected scene contains no shots.
The design records this behavior without a scenario.
Decision for the lead: legacy bootstrap can replace the initial storage error status.
The design records this behavior without a scenario.
The lead must check the gate image and get both reviews.

## Title checks

The title sweep finds no banned word or excess title length in new tags.
The STE title helper gives no warning for a new title.
The old title for `director-118` gives two style warnings.
The owner rule keeps that old title unchanged.

```sh
cd /home/ianblenke/docker/gev-work/director-4a && node /home/ianblenke/docker/gev-tools/director-4a/titles.mjs
```

## Final host checks

The last coverage process for the new test file exits with status zero.
The title sweep records 113 new tests and no new title fault.
The adopted source formatter reports a complete result for both commands.
A separate Prettier check returns true for the new test file.
The prose lint reports zero errors.

The predispatch word hits refer to quoted old test titles.
The abbreviation hits refer to those titles and a command pattern.
The owner rule keeps those titles unchanged.

The different test values describe separate sets: 52 old tests, 48 old tests without new tags and 113 new tests.
The source sweep supplies each value.
The predispatch name pairs also include old title quotes and source code blocks.
No new prose fault stays open from that check.

Decision for the lead: the legacy bootstrap writes a default project checkpoint after the constructor rejects saved text.
The primary storage text stays unchanged.
The scratch probe checks both storage keys and passes.
No scenario states this behavior.

Commands:

```sh
cd /home/ianblenke/docker/gev-work/director-4a && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-4a && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-4a && node scripts/spec/gates.mjs lint --change backfill-director-scene-setup 2>&1 | grep -E '^(ERROR|STE)'
cd /home/ianblenke/docker/gev-work/director-4a && python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-scene-setup
cd /home/ianblenke/docker/gev-work/director-4a && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --test-name-pattern='The unreadable project writes a fallback checkpoint' /home/ianblenke/docker/gev-tools/director-4a/checkpoint-probe.test.mjs
```

The baseline measurement uses these separate test processes:

```sh
cd /home/ianblenke/docker/gev-work/director-4a && node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/baseline-0.lcov ./src/cameraGroundGuard.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/baseline-1.lcov ./src/data/bhoteKoshiLocator.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/baseline-2.lcov ./src/data/bhoteKoshiEvent.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/baseline-3.lcov ./src/director/interactions/interactions.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/baseline-4.lcov ./src/scenes/director.test.mjs
cd /home/ianblenke/docker/gev-work/director-4a && node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js --test-coverage-exclude="**/*.test.mjs" --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4a/baseline-5.lcov ./src/ui/sceneControls.test.mjs
```

The change does not change production code or browser QA scripts.
The earlier change folders stay unchanged.
The lead must complete the unchecked gate and review tasks.
