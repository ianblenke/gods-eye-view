# Director host evidence

Commit read: `43b776a14aaf7d9379a786f5dafdc1c79bd4e371`.
Source base: `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.

## Scenario tests

### director-001: Keep authored content

Test file: `src/director/document.test.mjs`.

```text
[director-001] all built-in authored content exports and normalizes without edit loss
[director-001] The export keeps authored text and time
```

### director-002: Keep an empty project

Test file: `src/director/document.test.mjs`.

```text
[director-002] an intentionally empty project stays empty
[director-002] The parser keeps an empty scene list
```

### director-003: Accept legacy documents

Test file: `src/director/document.test.mjs`.

```text
[director-003] v1/v2 bloom migrates once; IDs, edits, pack bindings and zero holds survive
[director-003] missing legacy IDs become stable after the first saved migration
[director-003] The legacy document accepts absent IDs
[director-003] The absent version allows legacy numeric text
[director-003] The import accepts anchors and move at versions 4 through 6
[director-003] The import accepts data packs at versions 5 and 6
[director-003] The import rejects fields below each version gate
```

### director-004: Reject invalid documents

Test file: `src/director/document.test.mjs`.

```text
[director-004] invalid shapes, versions, unknown fields and unsafe keys fail with field paths
[director-004] The validator rejects an unsupported version
[director-004] The version rejects an early anchors field
[director-004] The version rejects an early dataPacks field
[director-004] The version rejects an early move field
[director-004] The version rejects an early dataPackIds field
[director-004] The version rejects an early interactions field
[director-004] The document rejects a duplicate scene ID
```

### director-005: Check object fields

Test file: `src/director/documentFields.test.mjs`.

```text
[director-005] The object check rejects null
[director-005] The object check rejects text
[director-005] The object check rejects an array
[director-005] The field check rejects each unsupported key
```

### director-006: Check text

Test file: `src/director/documentFields.test.mjs`.

```text
[director-006] The text check rejects numbers
[director-006] The text check rejects blank text
[director-006] The text check rejects excess length
[director-006] The text check accepts the exact limit
[director-006] The default text limit accepts 256 characters
[director-006] The default text limit rejects 257 characters
```

### director-007: Check numbers

Test file: `src/director/documentFields.test.mjs`.

```text
[director-007] The number check rejects text
[director-007] The number check rejects NaN
[director-007] The number check rejects the lower excess
[director-007] The number check rejects the upper excess
[director-007] The legacy flag alone allows numeric text
[director-007] The legacy number input keeps its type
[director-007] The legacy blank text fails numeric checks
[director-007] The number check accepts both bounds
[director-007] The number check rejects custom conversion objects
```

### director-008: Check optional fields

Test file: `src/director/documentFields.test.mjs`.

```text
[director-008] The optional check uses own fields only
```

### director-009: Check collections and IDs

Test file: `src/director/documentFields.test.mjs`.

```text
[director-009] The array check rejects objects
[director-009] The array check rejects excess entries
[director-009] The ID list checks every entry
[director-009] The unique ID check keeps its set
```

### director-010: Bound document complexity

Test file: `src/director/documentFields.test.mjs`.

```text
[director-010] The node budget rejects its next value
[director-010] The depth check rejects its next level
```

### director-011: Check JSON values

Test file: `src/director/documentFields.test.mjs`.

```text
[director-011] The JSON null takes its own path
[director-011] The JSON boolean takes its own path
[director-011] The JSON finite number takes its own path
[director-011] The JSON rejects an infinite number
[director-011] The JSON rejects undefined
[director-011] The JSON rejects functions
[director-011] The JSON accepts an ordinary object
[director-011] The JSON accepts arrays
[director-011] The JSON accepts a null prototype
[director-011] The JSON rejects a custom prototype
[director-011] The JSON rejects falsy nonobject values
```

### director-012: Bound JSON text and keys

Test file: `src/director/documentFields.test.mjs`.

```text
[director-012] The JSON text limit checks its boundary
[director-012] The JSON entry limit checks its boundary
[director-012] The JSON rejects the __proto__ key
[director-012] The JSON rejects the constructor key
[director-012] The JSON rejects the prototype key
[director-012] The JSON rejects long field names
```

### director-013: Bound document input

Test file: `src/director/document.test.mjs`.

```text
[director-013] document byte, nesting, collection, finite-number and string bounds are enforced
[director-013] The parser rejects nontext input
[director-013] The parser rejects excess character length
[director-013] The parser rejects excess UTF8 bytes
[director-013] The parser reports invalid JSON
```

### director-014: Check visual text and objects

Test file: `src/director/document.test.mjs`.

```text
[director-014] The visual check rejects invalid style
[director-014] The visual check rejects invalid mapStack
[director-014] The visual check rejects invalid style parameters
[director-014] The visual rejects an unknown field
```

### director-015: Check visual controls

Test file: `src/director/document.test.mjs`.

```text
[director-015] captured scope and extended detection edits survive migration
[director-015] The visual bloom accepts its enabled field
[director-015] The visual bloom accepts its intensity field
[director-015] The visual bloom accepts its version field
[director-015] The visual sharpen accepts its enabled field
[director-015] The visual sharpen accepts its intensity field
[director-015] The visual hud accepts its visible field
[director-015] The visual hud accepts its variant field
[director-015] The visual detection accepts its mode field
[director-015] The visual detection accepts its density field
[director-015] The visual detection accepts its allocation field
[director-015] The visual detection accepts its fadePct field
[director-015] The visual detection accepts its outsideOpacityPct field
[director-015] The visual scope accepts its enabled field
[director-015] The visual scope accepts its featherPct field
[director-015] The visual bloom bounds its intensity field
[director-015] The visual bloom bounds its version field
[director-015] The visual sharpen bounds its intensity field
[director-015] The visual detection bounds its density field
[director-015] The visual detection bounds its fadePct field
[director-015] The visual detection bounds its outsideOpacityPct field
[director-015] The visual scope bounds its featherPct field
[director-015] The visual check rejects invalid number type
[director-015] The visual check rejects invalid text type
[director-015] The visual check rejects invalid boolean type
[director-015] The visual group rejects an unknown field
```

### director-016: Check document metadata

Test file: `src/director/document.test.mjs`.

```text
[director-016] The document checks its createdAt field
[director-016] The document checks its updatedAt field
[director-016] The document checks installed scene IDs
[director-016] The shot checks its sourcePackVersion field
[director-016] The pack bindings check every value
[director-016] The pack versions accept legacy text only
[director-016] The scene checks its title field
[director-016] The scene checks its releaseLayerIds field
[director-016] The shot checks its title field
[director-016] The shot checks its sourcePackId field
[director-016] The pack entry rejects an unknown field
[director-016] The document rejects a duplicate pack ID
```

### director-017: Check shot time

Test file: `src/director/document.test.mjs`.

```text
[director-017] The shot checks its durationSec field
[director-017] The shot checks its holdSec field
```

### director-018: Check layers and shot limits

Test file: `src/director/document.test.mjs`.

```text
[director-018] The layer entry needs a boolean state
[director-018] The layer parameters need an object
[director-018] The shot total spans scene boundaries
[director-018] The layer check validates a second layer ID
[director-018] The layer check accepts boolean entries
[director-018] The layer entry rejects an unknown field
```

### director-019: Edit selected details

Test file: `src/director/authoring.test.mjs`.

```text
[director-019] The edit sets the anchors field
[director-019] The edit sets the dataPacks field
[director-019] The edit sets the camera field
[director-019] The edit sets the move field
[director-019] The edit sets the durationSec field
[director-019] The edit sets the holdSec field
[director-019] The edit sets the dataPackIds field
[director-019] The edit sets the interactions field
```

### director-020: Reject invalid details

Test file: `src/director/authoring.test.mjs`.

```text
[director-020] The edit rejects an absent scene
[director-020] The edit rejects an absent shot
[director-020] The edit rejects unsupported scene details
[director-020] The edit rejects unsupported shot details
```

### director-021: Remove absent details

Test file: `src/director/authoring.test.mjs`.

```text
[director-021] The edit removes an absent anchors field
[director-021] The edit removes an absent dataPacks field
[director-021] The edit removes an absent camera field
[director-021] The edit removes an absent move field
[director-021] The edit removes an absent durationSec field
[director-021] The edit removes an absent holdSec field
[director-021] The edit removes an absent dataPackIds field
[director-021] The edit removes an absent interactions field
```

### director-022: Select one scene

Test file: `src/director/authoring.test.mjs`.

```text
[director-022] The selection keeps only its scene
[director-022] The selection rejects an absent scene
```

### director-023: Publish copied clock state

Test file: `src/director/clock.test.mjs`.

```text
[director-023] The clock bounds and copies its snapshot
[director-023] The clock uses zero progress for zero total
[director-023] The clock rejects an absent scene
[director-023] The clock rejects an absent shot
[director-023] The clock warns when a subscriber fails
[director-023] The destroyed publication does not make a snapshot
[director-023] The snapshot access returns a copy
[director-023] The publication notifies every subscriber
[director-023] The publication uses false from the clock state
[director-023] The publication clamps negative elapsed time to zero
```

### director-024: Stop clock resources

Test file: `src/director/clock.test.mjs`.

```text
[director-024] Stop releases every clock timer and queued callbacks cannot publish later
[director-024] The stop tolerates subscriber errors
[director-024] The stop works before the first snapshot
[director-024] The stop rejects a destroyed clock state
[director-024] The stop notifies every subscriber
```

### director-025: Settle hold deadlines

Test file: `src/director/clock.test.mjs`.

```text
[director-025] Stop, abort and destroy settle long holds immediately and release their deadlines
[director-025] The hold ends at its deadline
[director-025] The hold rejects flag state
[director-025] The hold rejects signal state
[director-025] The hold rejects destroyed state
[director-025] The hold generation stops a pending wait
[director-025] The clock cancels every pending wait
[director-025] The hold condition checks its current state first
```

### director-026: Own subscriptions

Test file: `src/director/clock.test.mjs`.

```text
[director-026] The subscription gives current copied state
[director-026] The subscription rejects a nonfunction
[director-026] The destroyed subscription does not add a listener
```

### director-027: Report playback progress

Test file: `src/director/clock.test.mjs`.

```text
[director-027] The playback progress uses a one second minimum
[director-027] The playback tick rejects stopped state
[director-027] The playback tick rejects replaced state
[director-027] The playback tick rejects destroyed state
[director-027] The default timer callbacks report progress
```

### director-028: Report shot progress

Test file: `src/director/clock.test.mjs`.

```text
[director-028] direct-load progress finishes once and snapshots cannot mutate the clock
[director-028] The instant shot reports both endpoints
[director-028] The shot progress works without scene state
[director-028] The startShotProgress detaches its timer handle
```

### director-029: Reject cancelled shot work

Test file: `src/director/clock.test.mjs`.

```text
[director-029] The shot guard 1 rejects destroyed
[director-029] The shot guard 1 rejects flag
[director-029] The shot guard 1 rejects signal
[director-029] The shot guard 1 rejects playback
[director-029] The shot guard 2 rejects generation
[director-029] The shot guard 2 rejects destroyed
[director-029] The shot guard 2 rejects flag
[director-029] The shot guard 2 rejects signal
[director-029] The shot guard 2 rejects playback
[director-029] The shot guard 3 rejects generation
[director-029] The shot guard 3 rejects destroyed
[director-029] The shot guard 3 rejects flag
[director-029] The shot guard 3 rejects signal
[director-029] The shot guard 3 rejects playback
[director-029] The shot progress guard 1 rejects generation
[director-029] The shot progress guard 1 rejects destroyed
[director-029] The shot progress guard 2 rejects generation
[director-029] The shot progress guard 2 rejects destroyed
[director-029] The shot progress guard 3 rejects generation
[director-029] The shot progress guard 3 rejects destroyed
[director-029] The old shot timer leaves its replacement intact
[director-029] The shot start rejects a changed counter read
```

### director-030: Report scene time

Test file: `src/director/clock.test.mjs`.

```text
[director-030] replacing a shot clock rejects the old callback without clearing the replacement
[director-030] aborted starts and destruction during initial notification leave no timers or listeners
[director-030] a subscriber can Stop or replace the initial clock without the old start acquiring a timer
[director-030] The scene guard 1 rejects destroyed
[director-030] The scene guard 1 rejects flag
[director-030] The scene guard 1 rejects signal
[director-030] The scene guard 2 rejects generation
[director-030] The scene guard 2 rejects destroyed
[director-030] The scene guard 2 rejects flag
[director-030] The scene guard 2 rejects signal
[director-030] The scene guard 3 rejects destroyed
[director-030] The scene guard 3 rejects flag
[director-030] The scene guard 3 rejects signal
[director-030] The scene guard 3 rejects playback
[director-030] The scene clock bounds shot elapsed time
[director-030] The scene start rejects a timing callback replacement
[director-030] The startScene detaches its timer handle
```

### director-031: Calculate shot boundaries

Test file: `src/director/timeline.test.mjs`.

```text
[director-031 director-034] scene time accounts for flight and hold; exact boundaries select the next shot
[director-031] The shot boundaries use cumulative durations
```

### director-032: Handle absent or zero time

Test file: `src/director/timeline.test.mjs`.

```text
[director-032] The absent scene gives empty time
[director-032] The absent shot index gives empty time
[director-032] The zero duration gives finite progress
[director-032] The zero total bounds endProgress
[director-032] The zero total bounds durationProgress
[director-032] The seek gives null without shots
[director-032] The seek bounds zero scene time
[director-032] The absent shot starts at zero elapsed time
```

### director-033: Interpolate ordinary camera poses

Test file: `src/director/timeline.test.mjs`.

```text
[director-033] The camera uses its sole source
[director-033] The camera uses its sole target
[director-033] The camera returns null without endpoints
[director-033] The camera bounds numeric progress
[director-033] The camera uses both cubic halves
[director-033] The camera gives a zero start angle for invalid text
[director-033] The camera guard handles a falsy endpoint
[director-033] The camera guard returns null for falsy endpoints
[director-033] The camera takes the shortest arc for both angles
```

### director-034: Select a shot at scene time

Test file: `src/director/timeline.test.mjs`.

```text
[director-031 director-034] scene time accounts for flight and hold; exact boundaries select the next shot
[director-034] The seek uses only the first time boundary
[director-034] The seek chooses the final shot at the end
[director-034] The seek defaults an absent flight time
[director-034] The seek uses authored flight time
[director-034] The seek converts invalid progress to zero
[director-034] The seek bounds the hold fraction
```

### director-035: Use camera endpoints for seek

Test file: `src/director/timeline.test.mjs`.

```text
[director-035] The seek uses the previous ordinary camera
[director-035] The seek uses the first ordinary camera
[director-035] The seek samples a move that the shot gives
```

### director-036: Build a shot queue

Test file: `src/director/playback.test.mjs`.

```text
[director-036] The single scene queue excludes other scenes
[director-036] The queue wraps from b and keeps each shot object
[director-036] The unknown start selects the first scene
```

### director-037: Run shot phases

Test file: `src/director/playback.test.mjs`.

```text
[director-037] playback sequences phases, releases only at scene changes, then releases the final scene
[director-037] The playback calls the selectShot phase
[director-037] The playback calls the applyVisual phase
[director-037] The playback calls the applyLayers phase
[director-037] The playback calls the travel phase
[director-037] The playback calls the settle phase
[director-037] The playback calls the hold phase
[director-037] The playback calls the completeShot phase
[director-037] The playback accepts an absent complete callback
[director-037] The adapter receives the exact phase order
[director-037] The phase context gives each index and the queue total
```

### director-038: Stop cancelled work

Test file: `src/director/playback.test.mjs`.

```text
[director-038] empty and pre-aborted runs never acquire or release adapter resources
[director-038] cancellation during an inter-scene release never acquires the next scene
[director-038] The playback rejects the flag token
[director-038] The playback rejects the signal token
[director-038] The empty queue leaves all resources untouched
[director-038] The flag token stops work after selectShot
[director-038] The signal token stops work after selectShot
[director-038] The flag token stops work after applyVisual
[director-038] The signal token stops work after applyVisual
[director-038] The flag token stops work after applyLayers
[director-038] The signal token stops work after applyLayers
[director-038] The flag token stops work after travel
[director-038] The signal token stops work after travel
[director-038] The flag token stops work after settle
[director-038] The signal token stops work after settle
[director-038] The flag token stops work after hold
[director-038] The signal token stops work after hold
[director-038] The flag token stops work after completeShot
[director-038] The signal token stops work after completeShot
[director-038] The handoff cancellation prevents the first shot
```

### director-039: Transfer scene resources

Test file: `src/director/playback.test.mjs`.

```text
[director-039] The playback keeps the same initial scene
[director-039] The final scene stays when cleanup is off
[director-039] The handoff accepts a previous scene before work
[director-039] The scene change releases the old scene
[director-039] The same scene keeps resources between shots
[director-039] The refused handoff stops the first shot
```

### director-040: Propagate adapter errors

Test file: `src/director/playback.test.mjs`.

```text
[director-040] failure in selectShot propagates after release, without later shots
[director-040] failure in applyVisual propagates after release, without later shots
[director-040] failure in applyLayers propagates after release, without later shots
[director-040] failure in travel propagates after release, without later shots
[director-040] failure in settle propagates after release, without later shots
[director-040] failure in hold propagates after release, without later shots
[director-040] failure in completeShot propagates after release, without later shots
[director-040] a cleanup failure rejects for the caller to restore its own controls
[director-040] The phase failure keeps its error after cleanup
```

## Host coverage

The host uses Node 26.8.2.
Each file gives 100% line, branch and function coverage.
The host reports no uncovered line or branch.
The lead still needs the Node 24 gate measurement.

| File | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| src/director/document.js | 100% | 100% | 100% |
| src/director/documentFields.js | 100% | 100% | 100% |
| src/director/authoring.js | 100% | 100% | 100% |
| src/director/clock.js | 100% | 100% | 100% |
| src/director/playback.js | 100% | 100% | 100% |
| src/director/timeline.js | 100% | 100% | 100% |

The coverage command below runs once for each name in the table.
The test file next to each module supplies its input.

```sh
cd /home/ianblenke/docker/gev-work/director && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --test-force-exit --experimental-test-coverage --test-coverage-include='src/director/<name>.js' --test-coverage-exclude='**/*.test.mjs' src/director/<name>.test.mjs
```

## Old tests without tags

The title sweep finds 18 old tests without tags.
Each cancellation title contains the banned word `subsequent`.
The handoff title contains the banned word `prior`.
Three more titles contain the words `preserve`, `retains` and `preserves`, which the word list bans in new prose.
Old titles keep their words.
The new tagged tests cover cancellation and the initial handoff.

```text
src/director/playback.test.mjs
flag cancellation while awaiting selectShot stops subsequent work and releases resources
signal cancellation while awaiting selectShot stops subsequent work and releases resources
flag cancellation while awaiting applyVisual stops subsequent work and releases resources
signal cancellation while awaiting applyVisual stops subsequent work and releases resources
flag cancellation while awaiting applyLayers stops subsequent work and releases resources
signal cancellation while awaiting applyLayers stops subsequent work and releases resources
flag cancellation while awaiting travel stops subsequent work and releases resources
signal cancellation while awaiting travel stops subsequent work and releases resources
flag cancellation while awaiting settle stops subsequent work and releases resources
signal cancellation while awaiting settle stops subsequent work and releases resources
flag cancellation while awaiting hold stops subsequent work and releases resources
signal cancellation while awaiting hold stops subsequent work and releases resources
flag cancellation while awaiting completeShot stops subsequent work and releases resources
signal cancellation while awaiting completeShot stops subsequent work and releases resources
a prior scene must release before playback; a refused handoff starts no shot
queues rotate scenes, skip empty scenes, preserve shot identity and support a single scene
non-preview playback retains the final scene but still releases preceding scenes
src/director/timeline.test.mjs
camera seeking preserves cubic easing and shortest-angle orientation
```

## Mutations and branch audit

The mutation sweep reads 312 mutation declarations.
The last log result gives 304 killed mutations and 8 equivalent survivors.
The mutation evidence records each ID, file, exact change and failed test.

The audit command below gives these row totals.

```sh
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director/audit.py
```

| Tested | Equivalent | Default-value | Open |
| ---: | ---: | ---: | ---: |
| 120 | 2 | 2 | 0 |

The scratch audit path is `/home/ianblenke/docker/gev-tools/director/audit.md`.
Each row lists the tests and mutations that prove its decisions.
The nested expressions keep separate rows.

### Equivalent mutants

- `m267`: The finite check at documentFields.js:77 rejects every value that is not a number without conversion. Custom functions, objects and numeric text cannot pass this check.
- `m009`: The finite check at documentFields.js:42 rejects every value that is not a number without conversion. Custom valueOf objects and boxed numbers also fail.
- `m028`: The JSON checks at documentFields.js:71 and :77 accept null, booleans and finite numbers first. The type check at :78 rejects other falsy nonobjects.
- `m098`: The optional scene access at authoring.js:13 gives an absent shot when the scene is absent. The shot check at :14 rejects it. JSON copies discard custom methods.
- `m219`: The endpoint assignments at timeline.js:35 and :36 give source and target the same truth state. Custom objects stay true; all falsy primitives return null.
- `m236`: The endpoint assignments at timeline.js:35 and :36 give source and target the same truth state. Custom objects stay true; all falsy primitives return null.
- `m237`: The guard at timeline.js:37 reaches this return only with two falsy endpoints. Custom truthy endpoints enter interpolation. The null fallback gives the result.
- `m238`: The guard at timeline.js:37 reaches this return only with two falsy endpoints. Custom truthy endpoints enter interpolation. The null fallback gives the result.

## Questions for the lead

- Question for the lead: `src/director/timeline.js:74` uses the default flight duration for a zero shot duration. Document validation accepts zero. The lead decides this policy for the document format.
- Question for the lead: `src/director/clock.js:127` lets an immediate subscriber error propagate. Publication catches subscriber errors at line 157. The lead decides the policy for subscriber errors.

## Commands and totals

The sweep gives 40 scenario headings and 308 tests that ran.
It also gives old ledger test totals, title issues and the mutation declaration total.
The title check finds no banned word or excess length in a tagged title.

```sh
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director/sweep.py
cd /home/ianblenke/docker/gev-work/director && for director_module in document documentFields authoring clock playback timeline; do
  NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test "src/director/${director_module}.test.mjs"
done
cd /home/ianblenke/docker/gev-work/director && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director /home/ianblenke/docker/gev-tools/director/muts.json
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-timing 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```

The mutation command also accepts ID lists for later checks.
The log keeps each result; the sweep selects the last result for each ID.
STE lint gives zero errors.
The normal format commands stopped with `spawnSync git EPERM`.
The host helper completed the format commands.

The scope check compares this round with `HEAD`.
The lead changes the QA headers at the archive step.

The lead runs the ratchet, gates, archive and both reviews after these corrections.
The base commit and `origin/main` hold the same director source.
The round 1 commits hold the tests and change files.
This round adds no commit.

## Tree state

The final scope check uses the commands below.

```sh
cd /home/ianblenke/docker/gev-work/director && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director && git status --short
```

```text
 M openspec/changes/backfill-director-timing/design.md
 M openspec/changes/backfill-director-timing/evidence.md
 M openspec/changes/backfill-director-timing/mutations.md
 M openspec/changes/backfill-director-timing/proposal.md
 M openspec/changes/backfill-director-timing/specs/director/spec.md
 M openspec/changes/backfill-director-timing/tasks.md
 M src/director/clock.test.mjs
 M src/director/document.test.mjs
 M src/director/documentFields.test.mjs
 M src/director/playback.test.mjs
 M src/director/timeline.test.mjs
```

## Round 1 corrections

Each row names the first words of a review item.
This report reads commit `43b776a14aaf7d9379a786f5dafdc1c79bd4e371`.

| Report | First words | Change |
| --- | --- | --- |
| Spec | `director-036 has one` | Add queue order, unknown start and shot object tests. |
| Spec | `director-033 says shortest` | Add heading and roll wrap tests and three angle mutations. |
| Spec | `No test sends` | Add each field and duplicate ID test with six call deletions. |
| Spec | `Version gates are pinned` | Add imports at each gate and below each gate. |
| Spec | `Tests tagged 023` | Add scenario results for publication, stop, subscriptions and tick guards. |
| Spec | `The change edited` | Restore the old body from `origin/main`. |
| Spec | `The audit sweep` | Add clock, text limit, shot index and queue context tests. |
| Spec | `does not change` | State the archive header step and add the QA known limit. |
| Spec | `Known limits omit` | Add both limits and give each requirement specific module behavior. |
| STE | `The stop works` | Keep exact old titles in code blocks; use method names in prose. |
| STE | `a pending wait` | Keep exact old titles in code blocks; describe each method action in prose. |
| STE | `nonempty, nontext, nonnumber` | Use text that is not empty, not text and not a number in prose. |
| STE | `a direct shot` | State shot selection outside playback and the active playback guard. |
| STE | `decision audit` | Use branch audit; use Question for the lead for a policy choice. |
| STE | `the author edits` | Use the caller for the API. |
| STE | `token cancels` | Use cancels, subscriber and error in prose. |
| STE | `the authoring functions` | Name the fields module in the proposal and design. |
| STE | `keeps shot identity` | State the start scene and wrap order. |
| STE | `without source changes` | State that the result does not change the source; add the time unit. |
| STE | `with STE lint` | Use the STE lint and separate the final tasks. |
| STE | `which the owner chose` | State the word list rule and the current commit state. |
| STE | `format policy` | Use the policy for the document format and the policy for subscriber errors. |

Exact test names stay in code blocks because the brief bans changes to old names.
A different quote gives a false test link.
No prose correction changes a test assertion.

### Equivalent probes

The scratch probe loads source from the commit above.
It compares each equivalent mutation with the same source through the public API.
The number checks reject proxy objects or functions with zero conversion calls.
The JSON object probe checks property access through a proxy.
The author probe uses detail proxies and checks zero calls before the selection error.
The camera probes compare property access through proxy endpoints and each pair of false endpoints.

The probes do not count as killed mutations.

```sh
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director/equivalent-round2.mjs
cd /home/ianblenke/docker/gev-work/director && git diff --stat 290b5d2 HEAD -- 'src/director/*.js'
cd /home/ianblenke/docker/gev-work/director && git diff --stat 290b5d2 origin/main -- 'src/director/*.js'
```

## Host test totals

The file commands use `--test-isolation=none` and do not use `--test-force-exit`.

| Test file | Tests | Failed |
| --- | ---: | ---: |
| `src/director/document.test.mjs` | 74 | 0 |
| `src/director/documentFields.test.mjs` | 43 | 0 |
| `src/director/authoring.test.mjs` | 22 | 0 |
| `src/director/clock.test.mjs` | 74 | 0 |
| `src/director/playback.test.mjs` | 66 | 0 |
| `src/director/timeline.test.mjs` | 29 | 0 |

The command output gives 308 tests in total.
The scenario heading sweep gives 40 scenarios.
The diff sweep gives 18 new test titles.

## New test labels

The mutation table uses these labels.

```text
T01 | src/director/clock.test.mjs | [director-023] The publication uses false from the clock state
T02 | src/director/clock.test.mjs | [director-023] The publication clamps negative elapsed time to zero
T03 | src/director/document.test.mjs | [director-014] The visual rejects an unknown field
T04 | src/director/document.test.mjs | [director-015] The visual group rejects an unknown field
T05 | src/director/document.test.mjs | [director-016] The pack entry rejects an unknown field
T06 | src/director/document.test.mjs | [director-018] The layer entry rejects an unknown field
T07 | src/director/document.test.mjs | [director-004] The document rejects a duplicate scene ID
T08 | src/director/document.test.mjs | [director-016] The document rejects a duplicate pack ID
T09 | src/director/document.test.mjs | [director-003] The import accepts anchors and move at versions 4 through 6
T10 | src/director/document.test.mjs | [director-003] The import accepts data packs at versions 5 and 6
T11 | src/director/document.test.mjs | [director-003] The import rejects fields below each version gate
T12 | src/director/documentFields.test.mjs | [director-006] The default text limit accepts 256 characters
T13 | src/director/documentFields.test.mjs | [director-006] The default text limit rejects 257 characters
T14 | src/director/playback.test.mjs | [director-036] The queue wraps from b and keeps each shot object
T15 | src/director/playback.test.mjs | [director-036] The unknown start selects the first scene
T16 | src/director/playback.test.mjs | [director-037] The phase context gives each index and the queue total
T17 | src/director/timeline.test.mjs | [director-033] The camera takes the shortest arc for both angles
T18 | src/director/timeline.test.mjs | [director-032] The absent shot starts at zero elapsed time
```

## Check limits

The first complete mutation check used stale patterns and gave extra survivors.
The final complete check uses the corrected patterns and a valid empty loop body for `m068`.
Each complete check reached its end.
The normal isolated test command reports file totals on this host.
The file totals do not count the tests inside each file.
The commands above use the same isolation option as the mutation command.

The lead still runs the container gates and the review agents.
This round does not run make, Docker, commit or push commands.
The scratch audit and mutation files stay outside the repository.

## Result commands

The report helper reads the test logs and the final mutation output.
The helper also reads the totals from the branch audit.
The diff check supplies the new test titles.
The title check includes the word list, the owner words, the word limit and passive voice.

```sh
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director/refresh-round2.py
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director/title-check-round2.py
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-timing
```

## Subscriber error check

The error test also checks that the next subscriber gets the state.
The extra check applies the `m207` mutation to that test.
Only the first subscriber runs in this mutation.
The test fails because the next subscriber gets zero calls instead of one.
The mutation total counts `m207` once.

```sh
cd /home/ianblenke/docker/gev-work/director && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director /home/ianblenke/docker/gev-tools/director/muts-subscriber-round2.json
```

```text
m207: KILLED [director-023] The clock warns when a subscriber fails
SURVIVORS: []
```

## Final file check

The file check gives 11 changed files and zero production or QA changes.
The old timeline test body matches `origin/main` exactly.
The scenario IDs stay `director-001` through `director-040`.
The pre-dispatch helper gives zero real prose hits and 20 hits inside fenced code.
The word rule excludes those code blocks.

```sh
cd /home/ianblenke/docker/gev-work/director && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director/final-check-round2.py
cd /home/ianblenke/docker/gev-work/director && rg -n 'default limit|versions 4|subscriber error|stopped: true|heading 350|roll 10|start `b`|own index' openspec/changes/backfill-director-timing/specs/director/spec.md
```

```text
24: versions 4, 5 and 6 accept scene anchors and shot move fields
45: the default limit accepts 256 characters and rejects 257 characters
135: a subscriber error gives one warning and leaves elapsed time at 1 second
141: stop after a snapshot gives stopped: true and running: false
142: a subscriber error does not leave the stop method
194: heading 350 to 10 gives 360 at progress 0.5
196: roll 10 to 350 gives 0 at progress 0.5 while heading 350 to 10 gives 360
213: start b gives shots b1, a1 and a2 in that order
221: each phase receives its own index and total fields
```
