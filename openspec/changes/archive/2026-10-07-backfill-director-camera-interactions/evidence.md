# Director host evidence

Pass 3 reads base commit `290b5d2` and the current files.

## Test commands

Each command uses one test file without the force-exit option.

| Test file | Passed tests |
| --- | ---: |
| `src/director/camera.test.mjs` | 7 |
| `src/director/cameraDocument.test.mjs` | 96 |
| `src/director/cameraMoves.test.mjs` | 35 |
| `src/director/interactions/document.test.mjs` | 69 |
| `src/director/interactions/interactions.test.mjs` | 6 |
| `src/director/interactions/session.test.mjs` | 21 |

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/camera.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/cameraDocument.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/cameraMoves.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/interactions/document.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/interactions/interactions.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/interactions/session.test.mjs
```

The tests pass all 234 tests.
The title sweep gives 231 tagged tests and 3 tests without tags.
The scenario sweep gives 35 scenarios, from director-041 through director-075.
The title sweep finds zero dictionary faults.

## Host coverage

| Production file | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| `src/director/camera.js` | 100.00% | 100.00% | 100.00% |
| `src/director/cameraDocument.js` | 100.00% | 100.00% | 100.00% |
| `src/director/interactions/document.js` | 100.00% | 100.00% | 100.00% |
| `src/director/interactions/session.js` | 100.00% | 95.83% | 100.00% |

The proposal gives the host branch limit.
Host coverage does not give a gate verdict.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/camera.js --test-coverage-exclude=**/*.test.mjs src/director/camera.test.mjs src/director/cameraMoves.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/cameraDocument.js --test-coverage-exclude=**/*.test.mjs src/director/camera.test.mjs src/director/cameraDocument.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/interactions/document.js --test-coverage-exclude=**/*.test.mjs src/director/interactions/interactions.test.mjs src/director/interactions/document.test.mjs
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/interactions/session.js --test-coverage-exclude=**/*.test.mjs --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/director-2/pass3-session.lcov src/director/interactions/interactions.test.mjs src/director/interactions/session.test.mjs
```

## Mutation and audit results

The complete file gives 257 mutations: 255 mutations that fail a test and two equivalent changes.
Rows m149 and m253 are equivalent changes for the public API.
No command reaches a time limit.
The separate getter, proxy, re-entrant callback and listener spy probe passes for the source and for m149 and m253.

The audit gives 79 rows: 59 tested, 18 default-value and 2 equivalent.
The audit gives zero open rows.
The table is `audit.md`.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-2 /home/ianblenke/docker/gev-tools/director-2/muts.json
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-2/probe3.mjs
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-2/sweep.py
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-2/audit3.py
```

## Title correction

Pass 2 changes five old titles.
Pass 3 also corrects their text as follows.
The comparison uses `git show` and `git diff` against main.
Only these five old titles change beyond their tags.

```text
File: src/director/camera.test.mjs
Old: version 4 retains anchor identity, references and explicit move edits through normalization
New: [director-064] version 4 keeps anchor identity, references and move edits through normalization
```

```text
File: src/director/interactions/interactions.test.mjs
Old: all four inert actions survive validation, migration and export without executing content
New: [director-063] all four inert interactions survive validation, migration and export and no content runs
```

```text
File: src/director/interactions/interactions.test.mjs
Old: reject unknown fields, executable syntax, invalid references and missing reset baselines
New: [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines
```

```text
File: src/director/interactions/interactions.test.mjs
Old: pending actions cancel promptly, refuse overlap and cannot update a replacement session
New: [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session
```

```text
File: src/director/interactions/interactions.test.mjs
Old: synchronous stop before execution prevents any side effect; rejection unlocks retry
New: [director-072 director-073] synchronous stop before an adapter call prevents any side effect; rejection unlocks retry
```

## Scenario test links

### director-041: Absent camera data

```text
src/director/cameraMoves.test.mjs: [director-041] The absent camera returns null
src/director/cameraMoves.test.mjs: [director-041] The absent move returns null
```

### director-042: Inline camera poses

```text
src/director/cameraMoves.test.mjs: [director-042] The inline pose copies each field
```

### director-043: Scene anchor poses

```text
src/director/cameraMoves.test.mjs: [director-043] The anchor supplies the position
src/director/cameraMoves.test.mjs: [director-043] The unknown anchor rejects the pose
src/director/cameraMoves.test.mjs: [director-043] The pose rejects an absent scene
src/director/cameraMoves.test.mjs: [director-043] The pose rejects an absent anchor list
```

### director-044: Default orientation

```text
src/director/cameraMoves.test.mjs: [director-044] The absent heading uses its default
src/director/cameraMoves.test.mjs: [director-044] The inline heading keeps zero
src/director/cameraMoves.test.mjs: [director-044] The absent pitch uses its default
src/director/cameraMoves.test.mjs: [director-044] The inline pitch keeps zero
src/director/cameraMoves.test.mjs: [director-044] The absent roll uses its default
src/director/cameraMoves.test.mjs: [director-044] The inline roll keeps zero
src/director/cameraMoves.test.mjs: [director-044] The heading keeps negative zero from a getter
src/director/cameraMoves.test.mjs: [director-044] The roll keeps negative zero from a getter
```

### director-045: Shot camera moves

```text
src/director/cameraMoves.test.mjs: [director-045] The move keeps both poses and time
```

### director-046: Camera progress bounds

```text
src/director/camera.test.mjs: [director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
src/director/cameraMoves.test.mjs: [director-046] The progress accepts the lower bound
src/director/cameraMoves.test.mjs: [director-046] The progress accepts the upper bound
src/director/cameraMoves.test.mjs: [director-046] The progress accepts the invalid text
src/director/cameraMoves.test.mjs: [director-046] The progress accepts the numeric text
src/director/cameraMoves.test.mjs: [director-046] The endpoint 0 returns an exact copy
src/director/cameraMoves.test.mjs: [director-046] The endpoint 1 returns an exact copy
```

### director-047: Linear camera samples

```text
src/director/camera.test.mjs: [director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
src/director/cameraMoves.test.mjs: [director-047] The linear sample sets lat
src/director/cameraMoves.test.mjs: [director-047] The linear sample sets lon
src/director/cameraMoves.test.mjs: [director-047] The linear sample sets alt
src/director/cameraMoves.test.mjs: [director-047] The linear sample sets heading
src/director/cameraMoves.test.mjs: [director-047] The linear sample sets pitch
src/director/cameraMoves.test.mjs: [director-047] The linear sample sets roll
src/director/cameraMoves.test.mjs: [director-047] The angle tie takes the negative arc
src/director/cameraMoves.test.mjs: [director-047] The linear curve uses its supplied fraction
src/director/cameraMoves.test.mjs: [director-047] The westward sample crosses the date line
```

### director-048: Cubic camera samples

```text
src/director/camera.test.mjs: [director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
src/director/cameraMoves.test.mjs: [director-048] The cubic sample uses the first half
src/director/cameraMoves.test.mjs: [director-048] The cubic sample uses the second half
src/director/cameraMoves.test.mjs: [director-048] The cubic sample uses progress 0.45
src/director/cameraMoves.test.mjs: [director-048] The cubic sample uses progress 0.55
```

### director-049: Camera position fields

```text
src/director/cameraDocument.test.mjs: [director-049] The shot without a move rejects invalid lat
src/director/cameraDocument.test.mjs: [director-049] The shot without a move rejects invalid lon
src/director/cameraDocument.test.mjs: [director-049] The shot without a move rejects invalid alt
src/director/cameraDocument.test.mjs: [director-049] The shot without a move accepts absent coordinates
src/director/cameraDocument.test.mjs: [director-049] The null pose gives a document error
src/director/cameraDocument.test.mjs: [director-049] The inline schema accepts its lat field
src/director/cameraDocument.test.mjs: [director-049] The inline schema accepts its lon field
src/director/cameraDocument.test.mjs: [director-049] The inline schema accepts its alt field
src/director/cameraDocument.test.mjs: [director-049] The pose checks both lat bounds
src/director/cameraDocument.test.mjs: [director-049] The pose checks both lon bounds
src/director/cameraDocument.test.mjs: [director-049] The pose checks both alt bounds
src/director/cameraDocument.test.mjs: [director-049] The shot without a move uses optional coordinates by default
src/director/cameraDocument.test.mjs: [director-049] The pose rejects an extra field
```

### director-050: Camera orientation fields

```text
src/director/cameraDocument.test.mjs: [director-050] The pose rejects invalid heading
src/director/cameraDocument.test.mjs: [director-050] The pose rejects invalid pitch
src/director/cameraDocument.test.mjs: [director-050] The pose rejects invalid roll
src/director/cameraDocument.test.mjs: [director-050] The pose accepts absent orientation
src/director/cameraDocument.test.mjs: [director-050] The supplied orientation field controls the check
src/director/cameraDocument.test.mjs: [director-050] The inline schema accepts its heading field
src/director/cameraDocument.test.mjs: [director-050] The inline schema accepts its pitch field
src/director/cameraDocument.test.mjs: [director-050] The inline schema accepts its roll field
src/director/cameraDocument.test.mjs: [director-050] The pose checks both heading bounds
src/director/cameraDocument.test.mjs: [director-050] The pose checks both pitch bounds
src/director/cameraDocument.test.mjs: [director-050] The pose checks both roll bounds
```

### director-051: Camera version rules

```text
src/director/cameraDocument.test.mjs: [director-051] The version 2 pose accepts text heading
src/director/cameraDocument.test.mjs: [director-051] The version 3 pose rejects text heading
src/director/cameraDocument.test.mjs: [director-051] The version 2 pose accepts text pitch
src/director/cameraDocument.test.mjs: [director-051] The version 3 pose rejects text pitch
src/director/cameraDocument.test.mjs: [director-051] The version 2 pose accepts text roll
src/director/cameraDocument.test.mjs: [director-051] The version 3 pose rejects text roll
src/director/cameraDocument.test.mjs: [director-051] The version 2 pose accepts text lat
src/director/cameraDocument.test.mjs: [director-051] The version 3 pose rejects text lat
src/director/cameraDocument.test.mjs: [director-051] The version 2 pose accepts text lon
src/director/cameraDocument.test.mjs: [director-051] The version 3 pose rejects text lon
src/director/cameraDocument.test.mjs: [director-051] The version 2 pose accepts text alt
src/director/cameraDocument.test.mjs: [director-051] The version 3 pose rejects text alt
src/director/cameraDocument.test.mjs: [director-051] The early version rejects an anchor reference
src/director/cameraDocument.test.mjs: [director-051] The modern version accepts an anchor reference
src/director/cameraDocument.test.mjs: [director-051] The early version rejects the height field
src/director/cameraDocument.test.mjs: [director-051] The anchor shape uses its supplied reference field
src/director/cameraDocument.test.mjs: [director-051] The inline pose controls its supplied shape
src/director/cameraDocument.test.mjs: [director-051] The version 1 pose accepts numeric text
```

### director-052: Scene anchor fields

```text
src/director/camera.test.mjs: [director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
src/director/cameraDocument.test.mjs: [director-052] The anchor ID must name a scene anchor
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects invalid lat
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects invalid lon
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects invalid alt
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects invalid id
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects invalid title
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects invalid altitudeReference
src/director/cameraDocument.test.mjs: [director-052] The scene rejects duplicate anchor IDs
src/director/cameraDocument.test.mjs: [director-052] The scene rejects excess anchors
src/director/cameraDocument.test.mjs: [director-052] The anchor check rejects a changed ID
src/director/cameraDocument.test.mjs: [director-052] The anchor reference checks its ID
src/director/cameraDocument.test.mjs: [director-052] The scene accepts the exact anchor limit
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects an absent ID
src/director/cameraDocument.test.mjs: [director-052] The anchor needs its lat coordinate
src/director/cameraDocument.test.mjs: [director-052] The anchor needs its lon coordinate
src/director/cameraDocument.test.mjs: [director-052] The anchor needs its alt coordinate
src/director/cameraDocument.test.mjs: [director-052] The anchor needs its height reference
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects an extra field
src/director/cameraDocument.test.mjs: [director-052] The title accepts 4096 characters
src/director/cameraDocument.test.mjs: [director-052] The title rejects 4097 characters
src/director/cameraDocument.test.mjs: [director-052] The anchor rejects text coordinates in version 2
```

### director-053: Inline endpoint fields

```text
src/director/cameraDocument.test.mjs: [director-053] The inline start needs lat
src/director/cameraDocument.test.mjs: [director-053] The inline end pose needs lat
src/director/cameraDocument.test.mjs: [director-053] The inline start needs lon
src/director/cameraDocument.test.mjs: [director-053] The inline end pose needs lon
src/director/cameraDocument.test.mjs: [director-053] The inline start needs alt
src/director/cameraDocument.test.mjs: [director-053] The inline end pose needs alt
src/director/cameraDocument.test.mjs: [director-053] The inline start needs all coordinates
```

### director-054: Move curve and time

```text
src/director/camera.test.mjs: [director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
src/director/cameraDocument.test.mjs: [director-054] The move rejects an unsupported curve
src/director/cameraDocument.test.mjs: [director-054] The move accepts the linear curve
src/director/cameraDocument.test.mjs: [director-054] The move accepts the cubic-in-out curve
src/director/cameraDocument.test.mjs: [director-054] The move rejects durationSec lower excess
src/director/cameraDocument.test.mjs: [director-054] The move rejects durationSec upper excess
src/director/cameraDocument.test.mjs: [director-054] The move rejects durationSec text
src/director/cameraDocument.test.mjs: [director-054] The move rejects durationSec absent value
src/director/cameraDocument.test.mjs: [director-054] The move accepts both durationSec bounds
src/director/cameraDocument.test.mjs: [director-054] The move rejects holdSec lower excess
src/director/cameraDocument.test.mjs: [director-054] The move rejects holdSec upper excess
src/director/cameraDocument.test.mjs: [director-054] The move rejects holdSec text
src/director/cameraDocument.test.mjs: [director-054] The move rejects holdSec absent value
src/director/cameraDocument.test.mjs: [director-054] The move accepts both holdSec bounds
src/director/cameraDocument.test.mjs: [director-054] The move rejects 0.19 seconds
src/director/cameraDocument.test.mjs: [director-054] The move accepts 0.2 seconds
src/director/cameraDocument.test.mjs: [director-054] The move rejects an extra field
```

### director-055: Height references

```text
src/director/camera.test.mjs: [director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
src/director/cameraDocument.test.mjs: [director-055] The modern inline pose accepts its reference
src/director/cameraDocument.test.mjs: [director-055] The supplied height reference controls the check
src/director/cameraDocument.test.mjs: [director-055] The inline endpoint needs a height reference
src/director/cameraDocument.test.mjs: [director-055] The ellipsoid reference accepts the pose
src/director/cameraDocument.test.mjs: [director-055] The inline shape keeps its coordinate fields
src/director/cameraDocument.test.mjs: [director-055] The end pose needs its height reference
```

### director-056: Interaction targets

```text
src/director/interactions/interactions.test.mjs: [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines
src/director/interactions/document.test.mjs: [director-056] The target rejects a different pack format
src/director/interactions/document.test.mjs: [director-056] The target rejects an unselected pack
src/director/interactions/document.test.mjs: [director-056] The target rejects absent selected packs
src/director/interactions/document.test.mjs: [director-056] The target rejects absent scene packs
src/director/interactions/document.test.mjs: [director-056] The target accepts a selected GeoJSON pack
```

### director-057: Action fields

```text
src/director/interactions/document.test.mjs: [director-057] The action field rejects an absent object
src/director/interactions/document.test.mjs: [director-057] The action field rejects an unknown type
src/director/interactions/document.test.mjs: [director-057] The card action field accepts its text field
src/director/interactions/document.test.mjs: [director-057] The card action field accepts its url field
src/director/interactions/document.test.mjs: [director-057] The focus action field accepts its anchorId field
src/director/interactions/document.test.mjs: [director-057] The shot action field accepts its shotId field
src/director/interactions/document.test.mjs: [director-057] The layer action field accepts its layerId field
src/director/interactions/document.test.mjs: [director-057] The layer action field accepts its enabled field
src/director/interactions/document.test.mjs: [director-057] The action field rejects an unsupported field
src/director/interactions/document.test.mjs: [director-057] The action field rejects nontext anchorId
src/director/interactions/document.test.mjs: [director-057] The action field rejects nontext shotId
src/director/interactions/document.test.mjs: [director-057] The action field rejects nontext layerId
src/director/interactions/document.test.mjs: [director-057] The card type controls its text check
src/director/interactions/document.test.mjs: [director-057] The action field rejects an array type
src/director/interactions/document.test.mjs: [director-057] The card action field rejects an extra field
src/director/interactions/document.test.mjs: [director-057] The focus action field rejects an extra field
src/director/interactions/document.test.mjs: [director-057] The shot action field rejects an extra field
src/director/interactions/document.test.mjs: [director-057] The layer action field rejects an extra field
src/director/interactions/document.test.mjs: [director-057] The interaction rejects an extra field
src/director/interactions/document.test.mjs: [director-057] The target rejects an extra field
src/director/interactions/document.test.mjs: [director-057] The action field rejects an inherited type name
```

### director-058: Card source links

```text
src/director/interactions/document.test.mjs: [director-058] The card rejects a source protocol
src/director/interactions/document.test.mjs: [director-058] The card rejects a source user name
src/director/interactions/document.test.mjs: [director-058] The card rejects a source password
src/director/interactions/document.test.mjs: [director-058] The card rejects a source query
src/director/interactions/document.test.mjs: [director-058] The card rejects a source fragment
src/director/interactions/document.test.mjs: [director-058] The card rejects an invalid URL
src/director/interactions/document.test.mjs: [director-058] The card accepts a plain HTTPS source
```

### director-059: Focus references

```text
src/director/interactions/document.test.mjs: [director-059] The focus rejects absent scene anchors
src/director/interactions/document.test.mjs: [director-059] The focus accepts a scene anchor
src/director/interactions/document.test.mjs: [director-059] The focus rejects an unknown anchor
```

### director-060: Shot references and baselines

```text
src/director/interactions/interactions.test.mjs: [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines
src/director/interactions/document.test.mjs: [director-060] The shot action field rejects an unknown shot
src/director/interactions/document.test.mjs: [director-060] The target shot needs each layer baseline
src/director/interactions/document.test.mjs: [director-060] The target shot check skips a card action field
src/director/interactions/document.test.mjs: [director-060] The target shot needs an own layer baseline
src/director/interactions/document.test.mjs: [director-060] The absent target shot layers use an empty baseline
src/director/interactions/document.test.mjs: [director-060] The target shot accepts every declared layer
src/director/interactions/document.test.mjs: [director-060] The shot loop skips an absent entry
src/director/interactions/document.test.mjs: [director-060] The shot loop skips an absent action field
src/director/interactions/document.test.mjs: [director-060] The shot type controls its reference check
src/director/interactions/document.test.mjs: [director-060] The target shot loop checks the traffic entry
src/director/interactions/document.test.mjs: [director-060] The target shot loop checks the ships entry
```

### director-061: Layer state fields

```text
src/director/interactions/interactions.test.mjs: [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines
src/director/interactions/document.test.mjs: [director-061] The layer needs a direct shot baseline
src/director/interactions/document.test.mjs: [director-061] The absent shot layers use an empty baseline
src/director/interactions/document.test.mjs: [director-061] The layer accepts a direct shot baseline
src/director/interactions/document.test.mjs: [director-061] The layer rejects a nonboolean state
src/director/interactions/document.test.mjs: [director-061] The layer ignores an unrelated anchor ID
src/director/interactions/document.test.mjs: [director-061] The layer type controls its state check
src/director/interactions/document.test.mjs: [director-061] The layer accepts a false state
```

### director-062: Interaction text and limits

```text
src/director/interactions/document.test.mjs: [director-062] The interaction rejects invalid id
src/director/interactions/document.test.mjs: [director-062] The interaction rejects invalid label
src/director/interactions/document.test.mjs: [director-062] The interaction rejects invalid packId
src/director/interactions/document.test.mjs: [director-062] The interaction rejects invalid featureId
src/director/interactions/document.test.mjs: [director-062] The interaction rejects duplicate IDs
src/director/interactions/document.test.mjs: [director-062] The shot rejects excess interactions
src/director/interactions/document.test.mjs: [director-062] The card rejects excess text
src/director/interactions/document.test.mjs: [director-062] The card rejects excess URL text
src/director/interactions/document.test.mjs: [director-062] The shot accepts the exact interaction limit
src/director/interactions/document.test.mjs: [director-062] The card accepts the exact text limit
src/director/interactions/document.test.mjs: [director-062] The card accepts the exact source limit
src/director/interactions/document.test.mjs: [director-062] The card accepts 2048 URL characters
src/director/interactions/document.test.mjs: [director-062] The card rejects 2049 URL characters
src/director/interactions/document.test.mjs: [director-062] The label accepts 256 characters
src/director/interactions/document.test.mjs: [director-062] The label rejects 257 characters
```

### director-063: Portable interaction data

```text
src/director/interactions/interactions.test.mjs: [director-063] all four inert interactions survive validation, migration and export and no content runs
```

### director-064: Portable camera data

```text
src/director/camera.test.mjs: [director-064] version 4 keeps anchor identity, references and move edits through normalization
src/director/camera.test.mjs: [director-064] The version 1 camera stays a shot without a move
src/director/camera.test.mjs: [director-064] The version 2 camera stays a shot without a move
src/director/camera.test.mjs: [director-064] The version 3 camera stays a shot without a move
```

### director-065: Initial session state

```text
src/director/interactions/session.test.mjs: [director-065] The new session reports empty state
src/director/interactions/session.test.mjs: [director-065] The default state callback accepts a session change
```

### director-066: Interaction activation

```text
src/director/interactions/session.test.mjs: [director-066] The session activates every unique interaction
```

### director-067: Inactive session admission

```text
src/director/interactions/session.test.mjs: [director-067] The inactive session refuses adapter call
```

### director-068: Busy session admission

```text
src/director/interactions/interactions.test.mjs: [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session
src/director/interactions/session.test.mjs: [director-068] The busy session refuses a second adapter call
```

### director-069: Unknown interaction admission

```text
src/director/interactions/session.test.mjs: [director-069] The active session refuses an unknown ID
```

### director-070: Successful adapter call

```text
src/director/interactions/session.test.mjs: [director-070] The successful interaction gives idle state with the selected ID
src/director/interactions/session.test.mjs: [director-070] The interaction removes its abort listener
src/director/interactions/session.test.mjs: [director-070] The adapter result zero gives true
src/director/interactions/session.test.mjs: [director-070] The adapter result empty text gives true
src/director/interactions/session.test.mjs: [director-070] The session does not abort a completed abort controller when clear runs
```

### director-071: Refused adapter call

```text
src/director/interactions/session.test.mjs: [director-071] The false adapter result refuses the interaction
```

### director-072: Adapter exceptions

```text
src/director/interactions/interactions.test.mjs: [director-072 director-073] synchronous stop before an adapter call prevents any side effect; rejection unlocks retry
src/director/interactions/session.test.mjs: [director-072] The adapter exception allows another interaction
src/director/interactions/session.test.mjs: [director-072] The adapter rejection allows another interaction
```

### director-073: Interaction cancellation

```text
src/director/interactions/interactions.test.mjs: [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session
src/director/interactions/interactions.test.mjs: [director-072 director-073] synchronous stop before an adapter call prevents any side effect; rejection unlocks retry
src/director/interactions/session.test.mjs: [director-073] The session cancels work before an adapter call
src/director/interactions/session.test.mjs: [director-073] The session settles work with no adapter result
src/director/interactions/session.test.mjs: [director-073] The session returns false when clear runs after the result
src/director/interactions/session.test.mjs: [director-073] The session does not abort the old abort controller when clear runs twice
src/director/interactions/session.test.mjs: [director-073] The state callback receives empty state after clear
src/director/interactions/session.test.mjs: [director-073] The abort event gives false before the signal changes
```

### director-074: Session replacement

```text
src/director/interactions/interactions.test.mjs: [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session
src/director/interactions/session.test.mjs: [director-074] The old work leaves new session state intact
```

### director-075: Camera reference fields

```text
src/director/cameraDocument.test.mjs: [director-075] The anchor pose rejects its inline lat field
src/director/cameraDocument.test.mjs: [director-075] The anchor pose rejects its inline lon field
src/director/cameraDocument.test.mjs: [director-075] The anchor pose rejects its inline alt field
src/director/cameraDocument.test.mjs: [director-075] The anchor pose rejects its inline altitudeReference field
```

## Corrections of review round 1

Each row states the result for base commit `290b5d2`.

| Finding starts with | Change |
| --- | --- |
| `Limit side survives` | Tests check duration 0.19 and 0.2 seconds, and URL lengths 2048 and 2049 characters; rows m220 to m223. |
| `Scenario 057` | Each field check rejects an extra field; rows m224 to m231 and m248. |
| `The state callback` | Scenarios 065, 066, 070, 073 and 074 state callback values and call order; tests compare literal states. |
| `Tagged tests assert` | AND lines state zero angles, text progress, tie arcs, absent fields, version limits and supported fields. |
| `More survivors` | Rows m232 to m243, m246 and m247 test the other limits, curve split, wrap terms and controller state. |
| `audit.md default rows` | Rows m244 and m245 change the defaults; the audit names base commit 290b5d2. |
| `Test 067 patches` | The pass deletes the test that changes the Map size getter; the public API probe supports equivalent row m149. |
| `Old tagged titles` | The title record gives all five old and new titles; the proposal gives the lcov line. |
| `proposal.md has no` | The proposal holds one copy of all known limits, with callback errors and recovery. |
| `Bare assert.throws` | The two error tables compare literal error messages for each case; scenario 046 names both endpoint results. |
| `scripts/qa-director` | The proposal records qa-headers-ahead; the pass leaves the QA scripts unchanged. |
| `Each endpoint` | Inline means coordinates in the pose; scenario 045 and the old camera title use move without inline. |
| `Old tagged titles keep` | The title record states the old and new names in a code block. |
| `legacy camera poses` | The spec states versions 1 and 2 for numeric text, and versions 1 to 3 for shots without a move. |
| `a shot action` | The spec uses end pose for a move and target shot for an interaction. |
| `A shot accepts` | The spec uses interactions for the full records and action field for the action data. |
| `rejects unknown shots` | The spec states that one absent layer baseline causes rejection. |
| `action execution` | The titles and documents use adapter call, content that runs and script syntax; mutation patterns follow the titles. |
| `The director MUST` | Each requirement names a module and a checkable result. |
| `altitude` | The spec uses height, abort signal and removes. |
| `The inactive map` | The pass deletes the Map test and names the later-clear test by its result. |
| `for load, replay` | The design states when the scene loads, replays or seeks; code block names use inline code. |
| `346 warnings` | The final lint output supplies the current warning total; the mutation log uses current titles. |
| `numbers without units` | The tables name degrees and meters; each task gives one instruction. |
| `two instructions per task` | Each task gives one instruction with at most 20 words. |
| `noun group` | The evidence states separate totals for the mutations and the audit. |

The pass skips no meaning correction.
It keeps code strings and old untagged titles in code blocks because they are evidence.
The name `abort` identifies an event and a signal in this API.
The lead still runs the ratchet, gates and both review agents.
The worker made no commit in this pass.

## Final checks

The lint command gives zero errors and 525 warnings across its scope.
The normal format commands stop with the sandbox Git error.
The host import formats and checks 1158 source files.
The format command checks the repository source scope.
The predispatch tool finds no prose fault after the text check choices in `design.md`.

The callback limit record comes from pass 2.
Pass 3 adds the callback conditions to the proposal.
The production diff is empty.

The file list contains only the six test files and the change folder.

The two immediate timers still use their handles and call `clearImmediate`.
The lead still runs the ratchet, full gates and review.
The pass runs none of those commands.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-camera-interactions 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-camera-interactions
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-2/limits.mjs
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-2 && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-2 && git diff --stat HEAD -- 'src/director/*.js' 'src/director/interactions/*.js'
cd /home/ianblenke/docker/gev-work/director-2 && rg -n 'clearImmediate\(timer\)|timer = setImmediate' src/director/interactions/session.test.mjs
```

## Changed files

The final status command gives this list.

```text
 M openspec/changes/backfill-director-camera-interactions/audit.md
 M openspec/changes/backfill-director-camera-interactions/design.md
 M openspec/changes/backfill-director-camera-interactions/evidence.md
 M openspec/changes/backfill-director-camera-interactions/mutations.md
 M openspec/changes/backfill-director-camera-interactions/proposal.md
 M openspec/changes/backfill-director-camera-interactions/specs/director/spec.md
 M openspec/changes/backfill-director-camera-interactions/tasks.md
 M src/director/camera.test.mjs
 M src/director/cameraDocument.test.mjs
 M src/director/cameraMoves.test.mjs
 M src/director/interactions/document.test.mjs
 M src/director/interactions/interactions.test.mjs
 M src/director/interactions/session.test.mjs
?? openspec/changes/backfill-director-camera-interactions/evidence/
```

## Corrections of review round 2

Pass 3 reads base commit `290b5d2`.
The probe file is `evidence/probe-equivalent.txt` in this change folder.
The lead adds that text file with the force option if Git ignores it.
Rows m149 and m253 are equivalent for the public API only.
The final abort guard returns false for m253 after cancellation.
For m254, the test reads the listener total before and after the first abort event.

The probe checks early and late cancellation with listener spies.
It also checks getters, proxy lists and a re-entrant state callback.
A patched built-in prototype is outside this API limit.

| Finding starts with | Change |
| --- | --- |
| Split 0.5 | The 0.55 test checks latitude 11.271; m250 and m251 change the split. |
| Unrecorded survivors | Rows m252 and m254 fail the abort event test; m253 names the equivalent change and its probe. |
| Row m149 | The design bounds the API claim; the proposal adds session-builtin-patch; the probe checks a re-entrant callback. |
| Object.hasOwn | The inherited type name test checks the document error; m255 changes the field check. |
| Scenario 051 | The version 1 numeric text test checks all pose fields; m256 and m257 change the version checks. |
| DEFAULT rows | The audit cites m148, m147 and m116, and removes repeated mutation IDs. |
| Scenarios 070 and 074 | Each adapter call checks the last callback state with a literal object. |
| The tests at 353 | Scenario 060 states the document error for a null interaction and an absent action field. |
| can recover | The proposal states that the callback must stop throwing and names errors at lines 16 and 25. |
| one old camera title | The Title correction lists all five old and current titles from main and the current files. |
| accepts numeric text | Scenario 051 limits numeric text to pose fields in versions 1 and 2. |
| The shot rejects | All four sibling titles name the action field; all documents and mutation patterns use those titles. |
| Action activation | Titles use Interaction activation, Adapter exceptions and Interaction cancellation; the design uses key interactions. |
| The validator accepts | The spec uses the camera document module. |
| aborts the abort signal | The spec names the abort controller of the work. |
| the interaction and target | The spec names the pack target and each callback state change. |
| that an action field changes | Scenario 060 names the layer action field of the same shot. |
| without adapter call | The titles and spec add the article; the spec names `clear` as code. |
| version four | The spec uses version 4 and rejects. |
| Write tests for | Each task gives one instruction; mutation sub-lines state the code change. |
| 248 failed tests | The command supplies the current mutation totals; the lint command supplies its warning total. |
| selected idle state | The titles use idle state with the selected ID, no content runs and shot without a move. |

The pass skips no requested correction.
The predispatch hits name source strings, old titles, API event names and command flags.
Those strings stay exact in code blocks.
HTTPS means Hypertext Transfer Protocol Secure.
ERROR is a command output label.
HEAD names the current Git commit.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-2/probe3.mjs
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-2/check3.py
cd /home/ianblenke/docker/gev-work/director-2 && cd /home/ianblenke/docker/gev-work && taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-2 41 75
```

The title command checks 231 titles and finds zero banned forms.
The tests give 234 passed tests and zero failed tests.
The audit table gives 79 rows and zero open rows.
The command below reads each row class from that table.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-2/audit3.py
```

Rows m252 and m254 fail the abort event test through the public API.
The test uses the supplied signal and the host listener getter.
It does not change a built-in prototype.

The final mutation output gives 255 killed rows and two equivalent changes.
No row reaches a time limit or skips its source text.

The separate format command checks all six test files.

```sh
cd /home/ianblenke/docker/gev-work/director-2 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-2/format-tests3.mjs --check
```
