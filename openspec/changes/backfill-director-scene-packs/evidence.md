# Director shot pack evidence

Source commit: `b06f15a10c4294fd1ed7776370bfc273159d8d51`.

## Scenario test links

### director-151: The legacy sequence

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-151] The legacy sequence keeps three shot IDs and cameras
[director-151] The legacy options disable writeCheckpoint
[director-151] The legacy options disable render
[director-151] The legacy options disable announce
```

File: `src/scenes/director.test.mjs`.

```text
[director-151 director-155] a legacy three-shot Nepal browser project bootstraps to the current 25-shot sequence
```

### director-152: The authored legacy scene

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-152] The legacy scene title protects authored shots
[director-152] The legacy shot total protects authored shots
[director-152] The legacy first title protects authored shots
[director-152] The legacy second title protects authored shots
[director-152] The legacy third title protects authored shots
```

### director-153: The legacy checkpoint error

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-153] The legacy checkpoint error protects the scene
```

### director-154: The legacy pack refusal

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-154] The legacy pack refusal restores the project
```

### director-155: The legacy selection

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-155] The legacy selection uses its first shot
[director-183 director-155] The recipe accepts absent titles
[director-155] The constructor selects the legacy scene after a custom pack
```

File: `src/scenes/director.test.mjs`.

```text
[director-151 director-155] a legacy three-shot Nepal browser project bootstraps to the current 25-shot sequence
```

### director-156: The absent scene

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-156] The absent scene rejects the pack
```

### director-157: The absent pack

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-157] The absent pack rejects the request
```

### director-158: The current pack marker

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-158] The version 18 marker prevents another pack
[director-158] The version 19 marker prevents another pack
```

File: `src/scenes/director.test.mjs`.

```text
[director-159 director-173 director-158] the Nepal evidence pack appends once and applies the approved corridor framing
[director-182 director-158] the Nepal pack upgrades the upper-valley shots without duplicating evidence beats
```

### director-159: The first Nepal pack

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-159] The first Nepal pack adds its current sequence
```

File: `src/scenes/director.test.mjs`.

```text
[director-159 director-173 director-158] the Nepal evidence pack appends once and applies the approved corridor framing
```

### director-160: The older Nepal pack

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-160] The version 12 pack keeps authored cameras and titles
[director-160] The version 17 pack keeps authored cameras and titles
```

File: `src/scenes/director.test.mjs`.

```text
[director-160 director-165] installed v12 Nepal pack inserts ten points without replacing renamed cameras
```

### director-161: The incorrect older beats

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-161] The partial older beats reject expansion
[director-161] The order older beats reject expansion
```

### director-162: The final view adoption

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-162] The authored final view supplies its ID and camera
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
[director-162] The adoption keeps other authored layers
```

### director-163: The final view candidates

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-163] The absent final view does not supply a shot
[director-163] The duplicate final view does not supply a shot
[director-163] The other pack final view does not supply a shot
[director-163] The first pack does not adopt an authored shot
```

### director-164: The stored final beat

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-164] The stored final beat prevents another adoption
```

### director-165: The addition order

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-165] The older additions follow recipe order
[director-165] The last addition follows an authored tail
```

File: `src/scenes/director.test.mjs`.

```text
[director-160 director-165] installed v12 Nepal pack inserts ten points without replacing renamed cameras
```

### director-166: The initial inventory

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-166] The incorrect initial length rejects the pack
[director-166] The incorrect initial title rejects the pack
[director-166] The short title prefix rejects the pack
```

File: `src/scenes/director.test.mjs`.

```text
[director-166] the Nepal evidence pack refuses a partial inventory without mutating the scene
```

### director-167: The renamed bound shots

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-167] The renamed bound shot receives its patch
```

### director-168: The absent bound shot

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-168] The absent bound shot rejects the inventory
```

### director-169: The repeated bound shot

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-169] The repeated bound shot rejects the inventory
```

### director-170: The source beat inventory

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-170] The source length rejects the pack
[director-170] The source order rejects the pack
[director-170] The absent source layers rejects the pack
[director-170] The absent source parameters rejects the pack
[director-170] The absent stored shot rejects adopted source beats
[director-170] The absent pack shot rejects adopted source beats
[director-170] The absent expansion version uses the source inventory check
[director-170] The zero marker version uses the source inventory check
[director-170] The higher marker version uses the source inventory check
[director-170] The complete beat total uses the source inventory check
```

### director-171: The absent patch target

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-171] The absent patch reference rejects the pack
```

### director-172: The patch title match

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-172] The absent patch title rejects the pack
[director-172] The duplicate patch title rejects the pack
```

### director-173: The camera patch

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-173] The camera patch sets its normalized pose
[director-173] The expansion does not replace a patched camera
[director-173] The camera patch converts text numbers
```

File: `src/scenes/director.test.mjs`.

```text
[director-159 director-173 director-158] the Nepal evidence pack appends once and applies the approved corridor framing
```

### director-174: The hold patch

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-174] The hold value 7 gives 7 seconds
[director-174] The hold value -2 gives 0 seconds
[director-174] The hold value 8 gives 8 seconds
[director-174] The hold value invalid gives 3 seconds
```

### director-175: The visual patch

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-175] The visual patch keeps other visual fields
[director-175] The Nepal patch sets target 10
[director-175] The Nepal patch sets target 11
[director-175] The Nepal patch sets target 12
[director-175] The Nepal patch sets target 13
```

### director-176: The layer patch

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-176] The layer patch sets first
[director-176] The layer patch sets second
[director-176] The layer patch accepts absent shot layers
[director-176] The Nepal patch sets target 1
[director-176] The Nepal patch sets target 2
[director-176] The Nepal patch sets target 3
[director-176] The Nepal patch sets target 4
[director-176] The Nepal patch sets target 5
[director-176] The Nepal patch sets target 6
[director-176] The Nepal patch sets target 7
[director-176] The Nepal patch sets target 8
[director-176] The Nepal patch sets target 9
[director-176] The Nepal patch sets target 14
[director-176] The Nepal locator patch sets Bhote Koshi Upper Valley
[director-176] The Nepal locator patch sets Final view
```

### director-177: The layer list

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-177] The layer list combines scene and pack IDs
[director-177] The pack layer array accepts a custom list getter
```

### director-178: The pack checkpoint

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-178] The pack checkpoint error protects shots
```

### director-179: The pack selection

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-179] The pack selection uses the addition
[director-179] The pack selection uses the saved shot
```

### director-180: The project and controls

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-180] The pack saves before both control updates
```

### director-181: The pack notice

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-181] The notice reports 1 patched shot
[director-181] The notice reports 2 patched shots
[director-181] The notice reports new shots
```

### director-182: The marker replacement

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-182] The marker replacement keeps another pack marker
[director-182] The older marker does not add shots without expansion
```

File: `src/scenes/director.test.mjs`.

```text
[director-182 director-158] the Nepal pack upgrades the upper-valley shots without duplicating evidence beats
```

### director-183: The recipe defaults

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-183] The recipe accepts absent version
[director-183] The recipe accepts absent requiredShotTitles
[director-183] The recipe accepts absent requiredSourcePackBeatIds
[director-183] The recipe accepts absent requiredSourcePackLayerId
[director-183] The recipe accepts absent adoptExistingShotTitles
[director-183] The recipe accepts absent previousRequiredSourcePackBeatIdVariants
[director-183] The recipe accepts absent shotPatches
[director-183] The recipe accepts absent releaseLayerIds
[director-183] The recipe accepts absent bootstrap
[director-183] The recipe accepts absent path
[director-183 director-155] The recipe accepts absent titles
[director-183] The recipe accepts an absent adopted layer object
[director-183] The recipe accepts a nonlist requiredShotTitles
[director-183] The recipe accepts a nonlist requiredSourcePackBeatIds
[director-183] The recipe accepts a nontext source layer name
[director-183] The recipe accepts a nonlist adoptExistingShotTitles
[director-183] The empty adoption list accepts expansion
[director-183] The absent source layer name does not check beats
[director-183] The empty source beat list does not check its layer
[director-183] The pack layer array comes from the recipe normalizer
```

### director-184: The title based references

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-184] The title match supplies a shot reference
```

### director-185: The silent options

File: `src/scenes/directorPacks.test.mjs`.

```text
[director-185] The silent options save without optional actions
```

## Old tests without new tags

The full source sweep checks all test files with a scene director import.
The table lists old test names without a tag from this change.
Earlier tagged tests keep their existing tags.

### src/cameraGroundGuard.test.mjs

The tests check other module behavior outside this source area.

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
arrival guard relinquishes and removes hooks on Director
arrival guard relinquishes and removes hooks on tracking
arrival guard relinquishes and removes hooks on follow
arrival guard relinquishes and removes hooks on keyboard
arrival guard relinquishes and removes hooks on UI
arrival guard relinquishes and removes hooks on flyTo
arrival guard relinquishes and removes hooks on flyToBoundingSphere
arrival guard relinquishes and removes hooks on setView
arrival guard relinquishes and removes hooks on layer-disable
arrival guard relinquishes and removes hooks on layer-destroy
arrival guard relinquishes and removes hooks on app-stop
```

### src/data/bhoteKoshiEvent.test.mjs

The tests check other module behavior outside this source area.

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

### src/data/bhoteKoshiLocator.test.mjs

The tests check other module behavior outside this source area.

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
Scene Stop revokes locator timer and stale callbacks cannot own a successor
Scene Stop revokes locator move-end and stale callbacks cannot own a successor
Scene Stop revokes locator approach and stale callbacks cannot own a successor
Scene Stop revokes locator orbit and stale callbacks cannot own a successor
Bhote Koshi locator keeps the regional context settled while nearby cities stagger in
Bhote Koshi locator degrades to labels when the regional boundary is unavailable
Bhote Koshi regional locator waits for its boundary before starting the full sequence
Bhote Koshi locator cancels a stale boundary resolution and removes its surface
```

### src/scenes/director.test.mjs

The tests check later director methods or recipe defaults.

```text
Mailung clip trim estimates seven seconds and its exit, including older saved holds
Incident Corridor gives all overview pins time to reveal without rewriting saved shots
scene clock seek resolves the exact shot phase and camera in both directions
scene clock subscribers receive authoritative forward playback snapshots
public defaults include Nepal without an extra standalone flood recipe
Nepal comparison shots load Esri beneath Vantor even from a saved OSM or photoreal shot
all saved Nepal shots choose a usable map in keyed and keyless runtimes without rewriting the project
only Play Shot or a scene run grants transient media authority; LOAD, Stop and replacement revoke it
cross-scene replay grants media ownership only after the previous scene releases its layers
scene camera waits for provider completion and fade rather than the saved media hold
Stop cancels a provider-owned shot hold and late completion cannot fly the next camera
a provider-owned hold fails boundedly if its owner never settles
destroyed directors refuse seek, replay, adjacent and continuation without writes
replay, adjacent and seek report layer refusal rather than success
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
a newer LOAD aborts the previous LOAD transition rather than disowning it
applyVisualState gates the map-stack switch on both sides of its await
a superseded LOAD is refused its visual commit
a run refuses the visual commit of a shot cancelled mid-transition
the newest LOAD wins when two loads race
a scene run supersedes a LOAD still suspended on its visual await
destroy drains cancelled LOAD work before its viewer can be discarded
Scene snapshots are immutable and editing outcomes retain the affected shot and index
Scene load outcomes exclude superseded and disposed completions
invalid and unsupported imports retain the current project, selection and saved bytes
newer imports win delayed file reads, and an empty project is preserved
unsupported stored documents cannot be overwritten by fallback edits
valid import settles a cancelled load before replacing the project
a delayed import cannot publish after disposal
zero camera pitch is preserved by both immediate placement and ordinary flight
camera refusal starts no authored frame or playback clock
```

### src/ui/sceneControls.test.mjs

The tests check other module behavior outside this source area.

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

## Decisions for the lead

Decision for the lead: the design names the marker list change before refusal and the absent storage success indicator.
The design also names the singular addition notice, complete-beat camera replacement and legacy field replacement.
No scenario states those behaviors.

## Source commands

The sweep gives scenario IDs, test links and old test names.

```sh
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4b/sweep.py
cd /home/ianblenke/docker/gev-work/director-4b && grep -n "^  [a-zA-Z#_].*) {$" src/scenes/director.js
cd /home/ianblenke/docker/gev-work/director-4b && grep -rln "from '.*/director.js'" --include='*.test.mjs' .
cd /home/ianblenke/docker/gev-work/director-4b && grep -n "@covers" scripts/qa-director-*.mjs
cd /home/ianblenke/docker/gev-work/director-4b && rg -n "^\s*//|/\*|\*/" scripts/qa-director-*.mjs
```

## Host results

The host uses Node v26.8.2.
The host coverage does not give the Node 24 gate result.
The new test file passes all 127 tests.
The old director test file passes all 52 tests.
The scratch limit file passes all 5 probes.

The source sweep finds 243 old declarations and 256 expanded old test names across 6 import files.
The change tags 5 old tests and adds 127 tests for 35 scenarios, from director-151 through director-185.
The evidence lists the 134 old untagged names above.
The sweep and declaration parser commands below give these totals.

| Source area | Lines | Branches | Functions |
| --- | --- | --- | --- |
| `src/scenes/director.js:539` through line 916 | 378 / 378 | 176 / 177 | 38 / 38 |
| Whole `src/scenes/director.js` | 2195 / 2483 | 619 / 712 | 178 / 195 |

The whole file includes code for later sub-changes.
The baseline area leaves 45 lines, 31 branches and 4 functions without coverage.
The final area leaves no line or function without coverage.
The branch at line 852 cannot reach its empty array operand.
The design names the source checks and the public proxy probes for that limit.

The host measures each import file alone and combines covered items with the coverage script.
The script uses line numbers, local branch order and function source locations.
The evidence does not use Node coverage across several test files in one process.

The mutation log records 151 killed mutations and 1 equivalent mutation from 152 distinct source edits.
The equivalent mutation removes the unreachable array operand at line 852.
The decision audit records 52 rows: 29 tested, 1 equivalent, 22 default-value and 0 open.
The audit and report scripts give these totals.

## Final checks

The formatter completes both commands with exit status 0.
The formatter reports 1158 source files for each command.
An earlier formatter attempt stopped at a sandbox process error before completion.

The host lint and title check report no error.
The title check reports four warnings for unchanged old titles.
The lead still needs the ratchet, gates and both reviews.
No production file or browser QA script changes.

## Result commands

The coverage script with the measure argument measures each source import file in sequence.
The command without that argument combines the separate coverage files.
The declaration parser expands constant loop test names from source commit copies.
The scratch folder holds the source copies, JSON reports and logs.

```sh
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node --version
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4b/coverage.py measure
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node --test --test-isolation=none --test-force-exit --experimental-test-coverage --test-coverage-include=src/scenes/director.js '--test-coverage-exclude=**/*.test.mjs' --test-reporter=spec --test-reporter=lcov --test-reporter-destination=stdout --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-4b/final-6.lcov src/scenes/directorPacks.test.mjs
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4b/coverage.py
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node --test --test-isolation=none --test-force-exit src/scenes/director.test.mjs
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node --test --test-isolation=none --test-force-exit /home/ianblenke/docker/gev-tools/director-4b/limits.test.mjs
cd /home/ianblenke/docker/gev-work/director-4b && NODE_PATH=/home/ianblenke/docker/gev-work/node_modules taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4b/test-declarations.cjs
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4b/sweep.py
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4b/audit.py
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-4b/report.py
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-4b/titles.mjs
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-scene-packs 2>&1 | grep -E '^(ERROR|STE)'
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-4b && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-scene-packs
cd /home/ianblenke/docker/gev-work/director-4b && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-4b && git status --short
```
