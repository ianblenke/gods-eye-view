# Director host evidence

Commit: `4660e7b6f39ee27233cd769fbb1536bdcec0876c`.

## Source commands

The scope sweep reads the whole test tree, each scoped ledger entry and each test title.
It checks the title word list and the scenario sequence.
The audit command supplies the decision totals.
The mutation helper supplies each failed test from command output.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && python3 /home/ianblenke/docker/gev-tools/director-2/sweep.py
cd /home/ianblenke/docker/gev-work/director-2 && python3 /home/ianblenke/docker/gev-tools/director-2/audit.py
```

## Scope sweep

The sweep gives 35 new scenarios, 202 tests, 199 tagged tests and three tests without tags.
The old ledger entries give four camera tests and six interaction tests.
The old names contain no banned dictionary word and stay below the tagged title limit.
The tests without tags check code outside this change.

The import sweep resolves each test import against its source directory.
It finds direct camera imports in the camera test files.
It finds direct session imports in the interaction test files.
Before this change, the camera document and interaction document modules had no direct test import.

The requested text search also matches unrelated camera and session modules.
The resolved import sweep distinguishes those modules by path.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && grep -rln "from '.*/camera.js'" --include='*.test.mjs' .
cd /home/ianblenke/docker/gev-work/director-2 && grep -rln "from '.*/cameraDocument.js'" --include='*.test.mjs' .
cd /home/ianblenke/docker/gev-work/director-2 && grep -rln "from '.*/document.js'" --include='*.test.mjs' .
cd /home/ianblenke/docker/gev-work/director-2 && grep -rln "from '.*/session.js'" --include='*.test.mjs' .
```

The ledger sweep gives these open gaps before this change.
These values come from the ledger, not host branch totals.

| File | Open lines | Open branches | Open functions |
| --- | ---: | ---: | ---: |
| src/director/camera.js | 0 | 5 | 0 |
| src/director/cameraDocument.js | 0 | 1 | 0 |
| src/director/interactions/document.js | 2 | 4 | 0 |
| src/director/interactions/session.js | 1 | 2 | 0 |

## Scenario tests

### director-041: Absent camera data

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-041] The absent camera returns null
[director-041] The absent move returns null
```

### director-042: Inline camera poses

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-042] The inline pose copies each field
```

### director-043: Scene anchor poses

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-043] The anchor supplies the position
[director-043] The unknown anchor rejects the pose
[director-043] The pose rejects an absent scene
[director-043] The pose rejects an absent anchor list
```

### director-044: Default orientation

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-044] The absent heading uses its default
[director-044] The inline heading keeps zero
[director-044] The absent pitch uses its default
[director-044] The inline pitch keeps zero
[director-044] The absent roll uses its default
[director-044] The inline roll keeps zero
```

### director-045: Inline camera moves

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-045] The move keeps both poses and time
```

### director-046: Camera progress bounds

Test file: `src/director/camera.test.mjs`.

```text
[director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
```

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-046] The progress accepts the lower bound
[director-046] The progress accepts the upper bound
[director-046] The progress accepts the invalid text
[director-046] The progress accepts the numeric text
[director-046] The endpoint 0 returns an exact copy
[director-046] The endpoint 1 returns an exact copy
```

### director-047: Linear camera samples

Test file: `src/director/camera.test.mjs`.

```text
[director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
```

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-047] The linear sample sets lat
[director-047] The linear sample sets lon
[director-047] The linear sample sets alt
[director-047] The linear sample sets heading
[director-047] The linear sample sets pitch
[director-047] The linear sample sets roll
[director-047] The angle tie takes the negative arc
[director-047] The linear curve uses its own fraction
```

### director-048: Cubic camera samples

Test file: `src/director/camera.test.mjs`.

```text
[director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
```

Test file: `src/director/cameraMoves.test.mjs`.

```text
[director-048] The cubic sample uses the first half
[director-048] The cubic sample uses the second half
```

### director-049: Camera position fields

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-049] The ordinary pose rejects invalid lat
[director-049] The ordinary pose rejects invalid lon
[director-049] The ordinary pose rejects invalid alt
[director-049] The ordinary pose accepts absent coordinates
[director-049] The null pose gives a document error
[director-049] The inline schema accepts its lat field
[director-049] The inline schema accepts its lon field
[director-049] The inline schema accepts its alt field
[director-049] The pose checks both lat bounds
[director-049] The pose checks both lon bounds
[director-049] The pose checks both alt bounds
```

### director-050: Camera orientation fields

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-050] The pose rejects invalid heading
[director-050] The pose rejects invalid pitch
[director-050] The pose rejects invalid roll
[director-050] The pose accepts absent orientation
[director-050] The own orientation field decides the check
[director-050] The inline schema accepts its heading field
[director-050] The inline schema accepts its pitch field
[director-050] The inline schema accepts its roll field
[director-050] The pose checks both heading bounds
[director-050] The pose checks both pitch bounds
[director-050] The pose checks both roll bounds
```

### director-051: Camera version rules

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-051] The legacy pose accepts text heading
[director-051] The modern pose rejects text heading
[director-051] The legacy pose accepts text pitch
[director-051] The modern pose rejects text pitch
[director-051] The legacy pose accepts text roll
[director-051] The modern pose rejects text roll
[director-051] The legacy pose accepts text lat
[director-051] The modern pose rejects text lat
[director-051] The legacy pose accepts text lon
[director-051] The modern pose rejects text lon
[director-051] The legacy pose accepts text alt
[director-051] The modern pose rejects text alt
[director-051] The early version rejects an anchor reference
[director-051] The modern version accepts an anchor reference
[director-051] The early version rejects the height field
[director-051] The anchor shape uses its own reference field
[director-051] The inline pose decides its own shape
```

### director-052: Scene anchor fields

Test file: `src/director/camera.test.mjs`.

```text
[director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
```

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-052] The anchor ID must name a scene anchor
[director-052] The anchor rejects invalid lat
[director-052] The anchor rejects invalid lon
[director-052] The anchor rejects invalid alt
[director-052] The anchor rejects invalid id
[director-052] The anchor rejects invalid title
[director-052] The anchor rejects invalid altitudeReference
[director-052] The scene rejects duplicate anchor IDs
[director-052] The scene rejects excess anchors
[director-052] The anchor check rejects a changed ID
[director-052] The anchor reference checks its ID
[director-052] The scene accepts the exact anchor limit
[director-052] The anchor rejects an absent ID
[director-052] The anchor needs its lat coordinate
[director-052] The anchor needs its lon coordinate
[director-052] The anchor needs its alt coordinate
[director-052] The anchor needs its height reference
```

### director-053: Inline endpoint fields

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-053] The inline start needs lat
[director-053] The inline destination needs lat
[director-053] The inline start needs lon
[director-053] The inline destination needs lon
[director-053] The inline start needs alt
[director-053] The inline destination needs alt
[director-053] The inline start needs all coordinates
```

### director-054: Move curve and time

Test file: `src/director/camera.test.mjs`.

```text
[director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
```

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-054] The move rejects an unsupported curve
[director-054] The move accepts the linear curve
[director-054] The move accepts the cubic-in-out curve
[director-054] The move rejects durationSec lower excess
[director-054] The move rejects durationSec upper excess
[director-054] The move rejects durationSec text
[director-054] The move rejects durationSec absent value
[director-054] The move accepts both durationSec bounds
[director-054] The move rejects holdSec lower excess
[director-054] The move rejects holdSec upper excess
[director-054] The move rejects holdSec text
[director-054] The move rejects holdSec absent value
[director-054] The move accepts both holdSec bounds
```

### director-055: Height references

Test file: `src/director/camera.test.mjs`.

```text
[director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
```

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-055] The modern inline pose accepts its reference
[director-055] The own height reference decides the check
[director-055] The inline endpoint needs a height reference
[director-055] The ellipsoid reference accepts the pose
[director-055] The inline shape keeps its coordinate fields
[director-055] The destination needs its height reference
```

### director-056: Interaction targets

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-056] The target rejects a different pack format
[director-056] The target rejects an unselected pack
[director-056] The target rejects absent selected packs
[director-056] The target rejects absent scene packs
[director-056] The target accepts a selected GeoJSON pack
```

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-056 director-060 director-061] reject unknown fields, executable syntax, invalid references and missing reset baselines
```

### director-057: Action fields

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-057] The action rejects an absent object
[director-057] The action rejects an unknown type
[director-057] The card action accepts its text field
[director-057] The card action accepts its url field
[director-057] The focus action accepts its anchorId field
[director-057] The shot action accepts its shotId field
[director-057] The layer action accepts its layerId field
[director-057] The layer action accepts its enabled field
[director-057] The action rejects an unsupported field
[director-057] The action rejects nontext anchorId
[director-057] The action rejects nontext shotId
[director-057] The action rejects nontext layerId
[director-057] The card type decides its text check
[director-057] The action rejects an array type
```

### director-058: Card source links

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-058] The card rejects a source protocol
[director-058] The card rejects a source user name
[director-058] The card rejects a source password
[director-058] The card rejects a source query
[director-058] The card rejects a source fragment
[director-058] The card rejects an invalid URL
[director-058] The card accepts a plain HTTPS source
```

### director-059: Focus references

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-059] The focus rejects absent scene anchors
[director-059] The focus accepts a scene anchor
[director-059] The focus rejects an unknown anchor
```

### director-060: Shot references and baselines

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-060] The shot action rejects an unknown shot
[director-060] The destination needs each layer baseline
[director-060] The destination check skips a card action
[director-060] The destination needs an own layer baseline
[director-060] The absent destination layers use an empty baseline
[director-060] The destination accepts every declared layer
[director-060] The shot loop skips an absent entry
[director-060] The shot loop skips an absent action
[director-060] The shot type decides its reference check
[director-060] The destination loop checks the traffic entry
[director-060] The destination loop checks the ships entry
```

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-056 director-060 director-061] reject unknown fields, executable syntax, invalid references and missing reset baselines
```

### director-061: Layer state fields

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-061] The layer needs an own shot baseline
[director-061] The absent shot layers use an empty baseline
[director-061] The layer accepts an own shot baseline
[director-061] The layer rejects a nonboolean state
[director-061] The layer ignores an unrelated anchor ID
[director-061] The layer type decides its state check
[director-061] The layer accepts a false state
```

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-056 director-060 director-061] reject unknown fields, executable syntax, invalid references and missing reset baselines
```

### director-062: Interaction text and limits

Test file: `src/director/interactions/document.test.mjs`.

```text
[director-062] The interaction rejects invalid id
[director-062] The interaction rejects invalid label
[director-062] The interaction rejects invalid packId
[director-062] The interaction rejects invalid featureId
[director-062] The interaction rejects duplicate IDs
[director-062] The shot rejects excess interactions
[director-062] The card rejects excess text
[director-062] The card rejects excess URL text
[director-062] The shot accepts the exact action limit
[director-062] The card accepts the exact text limit
[director-062] The card accepts the exact source limit
```

### director-063: Portable action data

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-063] all four inert actions survive validation, migration and export without executing content
```

### director-064: Portable camera data

Test file: `src/director/camera.test.mjs`.

```text
[director-064] version 4 keeps anchor identity, references and inline move edits through normalization
[director-064] The version 1 camera stays an ordinary pose
[director-064] The version 2 camera stays an ordinary pose
[director-064] The version 3 camera stays an ordinary pose
```

### director-065: Initial session state

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-065] The new session reports empty state
```

### director-066: Action activation

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-066] The session activates every unique action
```

### director-067: Inactive session admission

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-067] The inactive session refuses execution
[director-067] The inactive map refuses custom list work
```

### director-068: Busy session admission

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-068 director-073 director-074] pending actions cancel promptly, refuse overlap and cannot update a replacement session
```

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-068] The busy session refuses a second execution
```

### director-069: Unknown action admission

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-069] The active session refuses an unknown ID
```

### director-070: Successful action execution

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-070] The successful action reports selected idle state
[director-070] The action detaches its abort listener
```

### director-071: Refused action execution

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-071] The false adapter result refuses the action
```

### director-072: Action exceptions

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-072 director-073] synchronous stop before execution prevents any side effect; rejection unlocks retry
```

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-072] The adapter exception allows another action
[director-072] The adapter rejection allows another action
```

### director-073: Action cancellation

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-068 director-073 director-074] pending actions cancel promptly, refuse overlap and cannot update a replacement session
[director-072 director-073] synchronous stop before execution prevents any side effect; rejection unlocks retry
```

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-073] The session cancels work before execution
[director-073] The session settles uncooperative work
[director-073] The settled race checks the abort signal
```

### director-074: Session replacement

Test file: `src/director/interactions/interactions.test.mjs`.

```text
[director-068 director-073 director-074] pending actions cancel promptly, refuse overlap and cannot update a replacement session
```

Test file: `src/director/interactions/session.test.mjs`.

```text
[director-074] The old work leaves new session state intact
```

### director-075: Camera reference fields

Test file: `src/director/cameraDocument.test.mjs`.

```text
[director-075] The anchor pose rejects its inline lat field
[director-075] The anchor pose rejects its inline lon field
[director-075] The anchor pose rejects its inline alt field
[director-075] The anchor pose rejects its inline altitudeReference field
```

## Host coverage

The command `node --version` gives Node 26.8.2.
Each command measures one production file.
The lead checks Node 24 in the gate image.
These host results do not give a gate verdict.

| File | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| src/director/camera.js | 100% | 100% | 100% |
| src/director/cameraDocument.js | 100% | 100% | 100% |
| src/director/interactions/document.js | 100% | 100% | 100% |
| src/director/interactions/session.js | 100% | 95.83% | 100% |

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include='src/director/camera.js' --test-coverage-exclude='**/*.test.mjs' src/director/camera.test.mjs src/director/cameraMoves.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include='src/director/cameraDocument.js' --test-coverage-exclude='**/*.test.mjs' src/director/camera.test.mjs src/director/cameraDocument.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include='src/director/interactions/document.js' --test-coverage-exclude='**/*.test.mjs' src/director/interactions/interactions.test.mjs src/director/interactions/document.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include='src/director/interactions/session.js' --test-coverage-exclude='**/*.test.mjs' src/director/interactions/interactions.test.mjs src/director/interactions/session.test.mjs
```

## Known limits

- The host branch at `src/director/interactions/session.js:51` cannot run. Both the try block and catch block return before finally.
The V8 result places this branch in the space before finally.
The tests try successful results, false results, exceptions, rejected promises, immediate cancellation and replacement.
The tests also try cancellation after the promise race and custom signal methods.
No public input reaches normal completion of either block.

The code keeps all lines and functions within coverage.
The lead must check the gate image before the ledger update.
- At `src/director/interactions/session.js:34`, an exception from the state callback leaves busy true.
The callback precedes the try block.
A custom callback that throws for busy state proves this limit.
The next dispatch returns false without adapter execution.
This change does not specify that behavior as correct.
- Old tagged titles keep their original text.
The owner rule allows a tag but forbids other changes to those names.

### Tests without tags

Test file: `src/director/camera.test.mjs`.
This test checks bloom migration in the first change.

```text
v3 unversioned bloom already uses scale 2 and is not migrated again in later formats
```

Test file: `src/director/interactions/interactions.test.mjs`.
This test checks the scene controller for a later change.

```text
settled pack shots cannot take the same-shot seek shortcut after Stop released geometry
```

Test file: `src/director/interactions/interactions.test.mjs`.
This test checks the scene controller for a later change.

```text
actions preserve camera refusal, layer admission signal and explicit transition cap
```

## Mutation and audit results

The mutation result sweep reads the final command logs for each ID in `muts.json`.
It gives 219 mutations and 219 failed tests.
No final check reaches a time limit.
An earlier busy test reached the helper time limit before the test used a finite wait.
That test process stopped before it finished.
It gave no test verdict.

The later check fails with an assertion instead.

The audit gives 70 rows: 52 tested, 18 default-value, zero equivalent and zero open rows.
The file `mutations.md` gives each exact change and selected test.
The scratch table is `/home/ianblenke/docker/gev-tools/director-2/audit.md`.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m198
```

## Checks

The full scoped test command passes all 202 tests.
The title sweep finds no banned word, excess length or excess tag total in a tagged test.
The scenario sweep finds no gap or reused ID from director-001 through director-075.
The first change stays unchanged.

The STE lint gives zero errors and 346 warnings across its scope.
It reports no warning against this change folder.
The format commands report 1158 source files and pass after the camera test correction.
The first sandbox attempt reports a git subprocess permission error.
The same commands pass with host access.
The separate format check covers the new test files too.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit src/director/camera.test.mjs src/director/cameraMoves.test.mjs src/director/cameraDocument.test.mjs src/director/interactions/interactions.test.mjs src/director/interactions/document.test.mjs src/director/interactions/session.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && node scripts/spec/gates.mjs lint --change backfill-director-camera-interactions 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/director-2 && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-2 && node scripts/format.mjs --check
```

The lead still runs the ratchet, gates and formal review.
This work does not archive, commit, push or run Docker.

## Final file state

The production files match the source commit byte for byte.
The file sweep finds only scoped tests and this change folder.
The QA scripts and the first change stay unchanged.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-2 && git status --short
```

```text
 M src/director/camera.test.mjs
 M src/director/interactions/interactions.test.mjs
?? openspec/changes/backfill-director-camera-interactions/
?? src/director/cameraDocument.test.mjs
?? src/director/cameraMoves.test.mjs
?? src/director/interactions/document.test.mjs
?? src/director/interactions/session.test.mjs
```

## Extra mutation commands

These commands check the later fields and the corrected custom probes.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m199 m200 m201 m202 m203 m204 m205 m206 m207
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m200 m207 m208 m209 m210
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m015 m016 m028 m029 m144 m211
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m212
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m151 m213
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m149
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json m214 m215 m216 m217 m218 m219
```
