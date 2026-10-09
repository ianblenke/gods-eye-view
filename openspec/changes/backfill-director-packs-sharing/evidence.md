# Director host evidence

HTTP means Hypertext Transfer Protocol.
HTTPS means HTTP with a secure connection.
SVG means Scalable Vector Graphics.
HEAD names the current Git commit.
ERROR is the error prefix in command output.

Base commit: `290b5d2`.

Pass 2 corrects review round 1.
The host results do not give a gate or review verdict.

## Source commands

The report reads command output, source files and the audit list.
It does not read a gate cache.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass2-report.py
```

The scenario heading search gives 35 IDs, from director-076 through director-110.
Pass 2: The mutation list gives 367 rows: 365 KILLED and 2 SURVIVED.
Pass 2: The audit list gives 166 rows: 143 tested, 20 default-value and 3 Known limits.
Pass 2: The audit contains zero equivalent rows and zero open rows.

## Base scope

The base title files give 22 old tests.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && git show 290b5d2:src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && git show 290b5d2:src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && git show 290b5d2:openspec/trace/gaps.json
```

| File | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| `src/director/packs/geojson.js` | 2 | 6 | 0 |
| `src/director/packs/manifest.js` | 2 | 4 | 0 |
| `src/director/packs/session.js` | 9 | 7 | 2 |
| `src/director/packs/source.js` | 2 | 5 | 2 |
| `src/director/sharing/bundle.js` | 2 | 8 | 2 |
| `src/director/sharing/lifetime.js` | 6 | 2 | 2 |
| `src/director/sharing/preview.js` | 0 | 5 | 1 |

The table gives ledger gaps at the base commit, not current gate measurements.

## Repository tests of pass 2

Each command uses one test file and no force-exit option.

| File | Tests | Pass | Fail | Cancelled | Skipped |
| --- | ---: | ---: | ---: | ---: | ---: |
| `src/director/packs/packs.test.mjs` | 12 | 12 | 0 | 0 | 0 |
| `src/director/packs/backfill.test.mjs` | 212 | 212 | 0 | 0 | 0 |
| `src/director/sharing/sharing.test.mjs` | 118 | 118 | 0 | 0 | 0 |

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
```

## Host coverage

The commands include one production file at a time.
Each file reaches 100% lines, branches and functions on the host.
The host output gives no path gap.
The lead checks the gate image.

```text
ℹ    geojson.js | 100.00 |   100.00 |  100.00 |
ℹ    manifest.js | 100.00 |   100.00 |  100.00 |
ℹ    session.js | 100.00 |   100.00 |  100.00 |
ℹ    source.js | 100.00 |   100.00 |  100.00 |
ℹ    bundle.js | 100.00 |   100.00 |  100.00 |
ℹ    lifetime.js | 100.00 |   100.00 |  100.00 |
ℹ    preview.js | 100.00 |   100.00 |  100.00 |
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/packs/geojson.js' --test-coverage-exclude='**/*.test.mjs' src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/packs/manifest.js' --test-coverage-exclude='**/*.test.mjs' src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/packs/session.js' --test-coverage-exclude='**/*.test.mjs' src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/packs/source.js' --test-coverage-exclude='**/*.test.mjs' src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/sharing/bundle.js' --test-coverage-exclude='**/*.test.mjs' src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/sharing/lifetime.js' --test-coverage-exclude='**/*.test.mjs' src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include='src/director/sharing/preview.js' --test-coverage-exclude='**/*.test.mjs' src/director/sharing/sharing.test.mjs
```

## Scenario tests

### director-076

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-076] The validator returns without an error for safe names for the asset path
[director-076] The validator rejects traversal for the asset path
[director-076] The validator rejects a path above its text limit for the asset path
[director-076] The validator rejects URL syntax with a stable message for the asset path
[director-076] The validator returns without an error for 1024 characters and rejects 1025 for the asset path
```

### director-077

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-077] The validator rejects an invalid version
[director-077] The validator rejects an invalid format
[director-077] The validator returns without an error for geojson
[director-077] The validator returns without an error for image
[director-077] The validator returns without an error for media
[director-077] The validator returns without an error for a GeoJSON altitudeReference field
[director-077] The validator returns without an error for the id field of a data pack
[director-077] The validator returns without an error for the version field of a data pack
[director-077] The validator returns without an error for the format field of a data pack
[director-077] The validator returns without an error for the source field of a data pack
[director-077] The validator returns without an error for the attribution field of a data pack
[director-077] The validator returns without an error for the placement field of a data pack
[director-077] The validator returns without an error for its source name field
[director-077] The validator returns without an error for its source path field
[director-077] The validator returns without an error for 256 characters for its ID and rejects 257
[director-077] The validator returns without an error for 256 characters for its source name and rejects 257
```

### director-078

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-078] The validator rejects the protocol for the attribution
[director-078] The validator rejects the username for the attribution
[director-078] The validator rejects the password for the attribution
[director-078] The validator rejects the query for the attribution
[director-078] The validator rejects the fragment for the attribution
[director-078] The validator rejects invalid URL text for the attribution
[director-078] The validator returns without an error for a safe link for the attribution
[director-078] The validator rejects blank text for the attribution
[director-078] The validator rejects a blank license for the attribution
[director-078] The validator returns without an error for its attribution text field
[director-078] The validator returns without an error for its attribution license field
[director-078] The validator returns without an error for its attribution url field
[director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
```

### director-079

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-079] The validator rejects a fraction for the byteLength field
[director-079] The validator rejects an invalid type for the digest
[director-079] The validator rejects an invalid alphabet for the digest
[director-079] The validator accepts integrity limits and rejects zero or excess byteLength
[director-079] The validator returns without an error for the byteLength field of a data pack
[director-079] The validator returns without an error for the sha256 field of a data pack
[director-079] The validator rejects 63 characters for the digest
[director-079] The validator rejects 65 characters for the digest
[director-079] The validator rejects uppercase text for the digest
[director-079] The validator rejects a prefix for the digest
[director-079] The validator rejects a suffix for the digest
[director-079] The validator returns without an error for 64 lowercase characters for the digest
```

### director-080

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-080] The manifest checks given image bounds and media anchor references
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-080] The validator rejects reversed west for the image
[director-080] The validator rejects reversed south for the image
[director-080] The validator rejects short bounds for the image
[director-080] The validator rejects bounds field 0 for the image
[director-080] The validator rejects bounds field 1 for the image
[director-080] The validator rejects bounds field 2 for the image
[director-080] The validator rejects bounds field 3 for the image
[director-080] The validator rejects height and reference for the image
[director-080] The validator returns without an error for its bounds field for the image
[director-080] The validator returns without an error for its height field for the image
[director-080] The validator returns without an error for its altitudeReference field for the image
[director-080] The validator rejects low excess for image bounds field 0
[director-080] The validator rejects high excess for image bounds field 0
[director-080] The validator rejects low excess for image bounds field 1
[director-080] The validator rejects high excess for image bounds field 1
[director-080] The validator rejects low excess for image bounds field 2
[director-080] The validator rejects high excess for image bounds field 2
[director-080] The validator rejects low excess for image bounds field 3
[director-080] The validator rejects high excess for image bounds field 3
[director-080] The validator rejects an image height above the upper limit
[director-080] The validator returns without an error for the fields of the image placement
[director-080] The validator rejects equal longitude edges for the image
[director-080] The validator rejects equal latitude edges for the image
[director-080] The validator returns without an error for all geographic limits for the image
[director-080] The validator rejects text for each geographic field for the image
```

### director-081

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-081] The validator rejects an unknown anchor for the media
[director-081] The validator returns without an error for its anchorId field for the media
[director-093] The session calls the renderer with the anchors and returns true
[director-081] The validator returns without an error for the fields of the media placement
```

### director-082

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-082] The validator rejects duplicate data pack IDs for the scene
[director-082] The validator rejects duplicate data pack IDs for the shot
[director-082] The validator rejects unknown data pack IDs for the shot
[director-082] The validator returns without an error for absent data packs and anchors for the scene
[director-082] The validator uses supplied anchors for the scene and returns without an error
[director-082] The validator uses absent anchor defaults for the scene and returns without an error
[director-082] The validator does not read a data pack list from the parent object of the scene and returns without an error
```

### director-083

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-083] The decoder rejects an invalid type for the collection
[director-083] The decoder rejects an invalid array for the collection
[director-083] The decoder rejects more than 2000 features for the collection
[director-083] The decoder accepts the exact feature limit of the collection and returns 2000 features
[director-083] The decoder rejects invalid UTF8 bytes
[director-083] The decoder rejects null
```

### director-084

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-084] The decoder rejects the type for the feature
[director-084] The decoder rejects ID type for the feature
[director-084] The decoder rejects a blank ID for the feature
[director-084] The decoder rejects a long ID for the feature
[director-084] The decoder rejects a duplicate ID for the feature
[director-084] The decoder accepts the exact text limit of the feature ID and returns a feature with an ID length of 256
[director-084] The decoder rejects a null feature
```

### director-085

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-085] The decoder rejects an invalid array for the position
[director-085] The decoder rejects an invalid length for the position
[director-085] The decoder rejects a coordinate that is not finite for the position
[director-085] The decoder rejects an invalid longitude for the position
[director-085] The decoder rejects an invalid latitude for the position
[director-085] The decoder rejects a height below the limit for the position
[director-085] The decoder rejects a height above the limit for the position
[director-085] The decoder rejects more than 50000 positions
[director-085] The decoder returns zero for absent height for the position
[director-085] The decoder returns the height in the data for the position
[director-085] The decoder accepts both geographic edges for the position and returns coordinates
[director-085] The decoder rejects field 0 that is not finite for the position
[director-085] The decoder rejects field 1 that is not finite for the position
[director-085] The decoder rejects field 2 that is not finite for the position
[director-085] The decoder accepts the exact position limit of the collection and returns 50000 positions
```

### director-086

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-086] The decoder rejects an invalid array for the line
[director-086] The decoder rejects an invalid minimum for the line
[director-086] The decoder rejects a ring with fewer than four points for the ring
[director-086] The decoder accepts two distinct endpoints for the line and returns coordinates
[director-086] The decoder rejects unclosed field 0 for the ring
[director-086] The decoder rejects unclosed field 1 for the ring
[director-086] The decoder rejects unclosed field 2 for the ring
```

### director-087

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-087] The decoder rejects an invalid type for the geometry
[director-087] The decoder rejects an invalid array for the geometry
[director-087] The decoder rejects an empty polygon for the geometry
[director-087] The decoder rejects more than 128 rings for the geometry
[director-087] The decoder returns a closed polygon for the geometry
[director-087] The decoder removes properties for the geometry
[director-087] The decoder accepts the exact ring limit of the polygon and returns 128 rings
[director-087] The decoder rejects absent geometry
```

### director-088

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-088] The new session reports the idle state and zero handles
[director-088] The session rejects a value that is not a data pack list
[director-088] The session rejects more than eight data packs
[director-088] The load call returns false after the caller destroys the session without a source call
[director-088] The load call returns false for a cancelled signal without a source call
[director-088] The new session reports the idle state
[director-088] The new session reports zero handles
[director-088] The session returns true for eight data packs
[director-088] The session checks every declaration before the source call and rejects the call
```

### director-089

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-089] The data pack session removes resources and cancels the transport on Stop
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-089] The session disposes handles in reverse order
[director-089] The session reports ready after the caller changes a state copy
[director-089] The session rejects a null handle
[director-089] The session rejects a handle without a dispose function
[director-089] The session reports one active handle
[director-089] The session reports ready after asset work
[director-089] The session calls the GeoJSON renderer once and returns true
[director-089] The session calls the image renderer once and returns true
[director-089] The session calls the media renderer once and returns true
[director-089] The session rejects a falsy handle with inherited disposal
[director-089] The session keeps every data pack handle
[director-089] The session disposes both ready handles in reverse order and reports idle
[director-089] The session removes its deadline after success
[director-089] The session removes its deadline after clear
```

### director-090

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement
[director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-090] The session disposes late resources for the cancelled session
[director-090] The session returns false for cancelled work with a null late handle
[director-090] The session returns false when the caller destroys it during asset work
[director-090] The session returns false for a cancelled signal without an event
[director-090] The session checks destroyed state after it reads the signal
[director-090] The session returns false for a cleared load call and does not read the signal state
[director-090] The load call returns false and disposes a detached resource
[director-090] The session disposes the handle before it adds the handle to its list
```

### director-091

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-091] The data pack session replaces source work and ignores its late bytes
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-091] The session keeps the new resources after a new load call
```

### director-092

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-092] The session reports a stable source error
[director-092] The session rejects stalled work for the deadline
[director-092] The session rejects absent source
[director-092] The session rejects absent renderer
[director-092] The session returns false for cancelled work and reports idle after a late source error
[director-092] The session rejects an absent renderer without a source call
[director-092] The session settles an early internal signal and reports idle
[director-092] The session settles a source error before its deadline and reports idle
[director-092] The session rejects stalled work at the 19 milliseconds deadline
[director-092] The session rejects stalled work at the default 15000 milliseconds deadline
[director-092] The session removes resources after a later error
[director-092] The session rejects a falsy custom source
[director-092] The session reads the byteLength field once without a registered source
[director-092] The session removes partial resources for the deadline
```

### director-093

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-093] The session rejects bytes that are not a Uint8Array
[director-093] The session rejects an empty asset
[director-093] The session rejects an asset above the byte limit
[director-093] The session rejects a wrong byteLength field
[director-093] The session rejects bytes above the total limit
[director-093] The session rejects a wrong digest
[director-093] The session returns true for exact bytes and digest
[director-093] The session calls the source with a default limit of 8388608 bytes
[director-093] The session returns true without a declared size
[director-093] The session returns true at the asset byte limit
[director-093] The session returns true at the total byte limit
[director-093] The session rejects one byte above the total limit
[director-093] The source receives the path, the renderer receives the asset and the signal, and the load call returns true
```

### director-094

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-094] The factory rejects the protocol
[director-094] The factory rejects the username
[director-094] The factory rejects the password
[director-094] The factory rejects the query
[director-094] The factory rejects the fragment
[director-094] The factory rejects a directory URL with no final slash
[director-094] The factory returns a source for HTTP and HTTPS directories
```

### director-095

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-095] The source sets its fixed options for the asset request
[director-095] The source sets its credentials option for the asset request
[director-095] The source sets its redirect option for the asset request
[director-095] The source sets its referrerPolicy option for the asset request
[director-095] The source sets its cache option for the asset request
[director-095] The source sets its signal option for the asset request
[director-095] The source uses the default fetch function and returns bytes
```

### director-096

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-096] The source joins distinct stream chunks
[director-096] The source rejects excess header bytes for the stream
[director-096] The source rejects excess chunk bytes for the stream
[director-096] The source returns an empty media type when the header is absent
[director-096] The source returns lowercase media type text without parameters
[director-096] The source rejects 8388609 bytes without a caller limit
[director-096] The source accepts the exact byte limit of the stream and returns bytes
```

### director-097

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
[director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-097] The source rejects an absent stream
[director-097] The source rejects the asset request after failed body cancellation
[director-097] The source rejects a failed response without a body
[director-097] The source releases the reader lock after a stream error
[director-097] The source checks its signal between chunks and rejects the call
[director-097] The source rejects early cancellation
[director-097] The source stops between stream chunks
```

### director-098

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-098] The import rejects nontext input
[director-098] The import rejects invalid JSON
[director-098] The import accepts plain project JSON and returns the project
[director-098] The import rejects excess characters
[director-098] The import rejects excess UTF8 bytes
[director-098] The import rejects 52428801 characters before byte conversion
```

### director-099

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-099] The import rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
[director-099] The import rejects an invalid type for the base64
[director-099] The import rejects an empty base64 value
[director-099] The import rejects an invalid length for the base64
[director-099] The import rejects an invalid alignment for the base64
[director-099] The import rejects an invalid alphabet for the base64
[director-099] The import rejects an invalid padding for the base64
[director-099] The import rejects duplicate paths
[director-099] The import rejects an unsupported media type
[director-099] The import rejects unsupported version
[director-099] The import accepts bytes without padding for the base64 and returns assets
[director-099] The import rejects a custom text object for the base64
[director-099] The import accepts the application/json media type and returns assets
[director-099] The import accepts the application/geo+json media type and returns assets
[director-099] The import accepts the image/png media type and returns assets
[director-099] The import accepts the video/mp4 media type and returns assets
[director-099] The import accepts the video/webm media type and returns assets
[director-099] The import accepts the audio/mpeg media type and returns assets
[director-099] The import accepts the audio/ogg media type and returns assets
[director-099] The import accepts the audio/wav media type and returns assets
[director-099] The import accepts the audio/webm media type and returns assets
[director-099] The import rejects 65 different asset paths
[director-099] The import returns assets at the base64 length limit and rejects the next aligned length
[director-099] The import returns assets at the total byte limit and rejects one more byte
```

### director-100

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-100] The import rejects an absent asset
[director-100] The import rejects a wrong byteLength field
[director-100] The import rejects a pack digest that differs from its asset
[director-100] The import rejects an asset digest that differs from its bytes
[director-100] The import rejects unused assets
[director-100] The import rejects external data pack sources
[director-100] The import checks its second asset reference and rejects the call
[director-100] The import checks its second asset digest and rejects the call
```

### director-101

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-101] The export copies bytes and attribution and keeps the project without an asset request
[director-101] The export returns bundle text for a source path of 1024 characters
[director-101] The export writes exact bundle metadata
[director-101] The export accepts scenes without data packs and returns bundle text
[director-101] The export returns one asset for a supplied data pack list
```

### director-102

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-102] The export rejects excess bytes, wrong integrity and absent assets
[director-102] The export rejects bytes that are not a Uint8Array
[director-102] The export rejects an empty asset
[director-102] The export rejects an asset above the byte limit
[director-102] The export rejects absent assets
[director-102] The export rejects declared byteLength
[director-102] The export rejects declared digest
[director-102] The export rejects excess asset total
[director-102] The export rejects excess asset total
[director-102] The export accepts absent integrity fields and returns bundle text
[director-102] The export accepts an absent digest and returns bundle text
[director-102] The export rejects absent asset bytes
[director-102] The export rejects encoded bundle text above 52428800 bytes
[director-102] The export keeps its total after an asset without a byte length
[director-102] The export accepts its exact asset total and returns bundle text
[director-102] The export rejects an unsupported media type
[director-102] The export accepts the text byte limit and returns bundle text
[director-102] The export returns bundle text at the total byte limit and rejects one more byte
```

### director-103

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-103] The export writes one asset and rejects integrity declarations that differ for the data packs with the same path
[director-103] The export reuses a shared asset and returns bundle text
[director-103] The export rejects shared byteLength
[director-103] The export rejects shared digest
[director-103] The export accepts absent byte declarations for the shared export and returns bundle text
[director-103] The export accepts an absent digest for the shared export and returns bundle text
[director-103] The export key uses the registered source name and returns bundle text
[director-103] The export key uses path and returns bundle text
[director-103] The export accepts equal shared integrity and returns bundle text
```

### director-104

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-104] The store removes old data after replacement and uses no network source
[director-104] The store copies the asset map
[director-104] The store clears stored bytes
```

### director-105

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-105] The store rejects absent bytes
[director-105] The store rejects bytes above the caller limit
[director-105] The store returns an independent byte copy
[director-105] The store rejects 8388609 bytes without a caller limit
[director-105] The store rejects a cancelled source call
```

### director-106

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
[director-106] The share helpers return an empty asset map for an absent filename
[director-106] The share helpers reject the ordinary file limit
[director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes
[director-106] The share helpers call throwIfAborted three times and return an empty asset map
[director-106] The share helpers accept the project file limit and reject one more byte
[director-106] The share helpers accept the bundle file limit and reject one more byte
```

### director-107

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-107] The export stops before the next asset and returns no partial output
[director-107] The helper resolves without a signal
[director-107] The helper rejects an early signal
[director-107] The helper resolves with an active signal
[director-107] The helper rejects a work error
[director-107] The helper checks signal state when the work settles and rejects the call
[director-107] The helper cancels work that is not complete
[director-107] The bundle helpers stop import before an asset
[director-107] The bundle helpers stop import after a digest
[director-107] The bundle helpers stop export before an asset
[director-107] The bundle helpers stop export after asset bytes
[director-107] The bundle helpers stop export after a digest
```

### director-108

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-108] The preview reports exact totals and attribution
[director-108] The preview reports the scene ID when the title is absent
[director-108] The preview reports no packs when data pack lists are absent
[director-108] The preview reports one pack from the supplied data pack list
[director-108] The preview reports Example for the supplied scene title
[director-108] The preview reports three bytes for both assets
[director-108] The preview counts shots apart from scenes
```

### director-109

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-109] The preview reports unavailable sources, absent layers and absent bundle assets
[director-109] The preview reports included bundle bytes
[director-109] The preview reports absent bundle bytes
[director-109] The preview reports a configured source
[director-109] The preview reports an unavailable source
[director-109] The preview reports a configured source for a supplied source ID
```

### director-110

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-110] The preview lists distinct absent layers
[director-110] The preview reports external content for applied shot packs
[director-110] The preview reports external content for a shot with a source pack ID
[director-110] The preview reports no external content without source packs
[director-110] The preview reports no absent layer when a shot has no layers
[director-110] The preview reports traffic as absent without layer IDs
[director-110] The preview reports ships as absent when only traffic is configured
```

## Review corrections

Base commit: `290b5d2`.
All finding labels below quote review round 1.
The change keeps the scenario IDs and production files.

| Finding label | Correction |
| --- | --- |
| Spec: 079 says lowercase digest | Tests reject 63 characters, 65 characters, uppercase text, a prefix and a suffix. Mutations m303 to m307 make a test fail. |
| Spec: 080 ordered edges | Tests reject equal edges and accept all geographic limits. Rows m308-m313 fail. |
| Spec: No accept-at-limit test | Tests accept asset, total, data pack, base64 and file limits. Rows m322-m324 and m341-m345 fail. |
| Spec: 102 names media types | Export rejects an unsupported type. Import rejects 65 different paths and excess total bytes. Rows m346-m349 fail. |
| Spec: 2 scenes and 2 shots | The tests use three scenes and separate shot totals. Two shots repeat an absent layer. Rows m356-m358 fail. |
| Spec: No test with invalid UTF8 | Tests check invalid bytes, null, a null feature and absent geometry with literal messages. Rows m333-m339 fail. |
| Spec: Unasserted source path | Call spies check the source path, renderer arguments, timers and validation order. Rows m325-m332 fail. |
| Spec: Tag mismatches | New tests carry 076, 089 and 105. Rows m321, m331 and m350 fail. |
| Spec: nothing aborts parseSceneShare | Signal spies check asset and digest calls during import and export. Rows m351-m355 fail. |
| Spec: Tags assert what no THEN states | The scenarios now state each listed result. The requirement sentences name results that tests can check. |
| Spec: Count after destroy cannot fail | A new deadline test checks the disposal list before the caller destroys it. Scenario 092 separates registered source and renderer cases. |
| Spec: Known limits lack bounds | The limits name the custom prototype getter and signal getter. Parent declarations, text limits and default fetch tests fail their rows. |
| STE: a missing source adapter | The prose separates registered source from renderer. The load method reads byteLength once when no source exists. |
| STE: applied scene packs | The prose and titles use data pack, applied shot packs and the source pack ID of a shot with one meaning each. |
| STE: the old request returns false | The prose uses load call, asset request or the caller asks, as applicable. |
| STE: stated request options | The source uses fixed request options. The manifest title uses given references. The design states the reason. |
| STE: scene share text | The prose uses project share text, project file and shared project. Scene totals still mean scenes. |
| STE: the scratch title | The cited scratch title now uses allows. The mutation results come from repository tests. |
| STE: own, pending, missing | New prose and titles use keep, not complete and absent. Historical title quotes stay as evidence. |
| STE: rejects invalid finite | The titles use clear verb phrases for coordinates, addresses and asset lengths. |
| STE: are disposed, mutating | Old tagged titles use active verbs. Title correction records each base title and its final title. |
| STE: hashes, files, pack size | The prose and titles use digest, assets, byteLength field, data pack session, share helpers and bundle helpers. |
| STE: through 8388608 | The prose gives bytes, meters, the ready state and file names for line locations. |
| STE: Tag or write | Each task gives one instruction. Mutation text stays separate. |
| STE: the lint total | The checks give the current lint command output. |
| STE: adds its proposal | The design lists checks.md and mutations.md. |

## Text that stays the same

Historical titles stay in code blocks because the brief calls for exact old/new pairs.
Production error messages and code text stay exact in assertions and mutation rows.
The reports, earlier requirements and Purpose stay the same because the brief bars their edit.
The probes show Known limits, not equivalent mutations.
Pass 2: No equivalent row needs a separate probe.

## Known limits

The position has an inherited value at index 2.
The probe returns -12001 meters through the public API.
The custom signal getter destroys the session when the session reads the signal.

The source still receives a call and the load method can return true.
No scenario states these behaviors.
The proposal gives each limit and its file location.
The probes are text files in the evidence directory.

The scratch probe command gives two tests and two passes.
It gives no failed repository test.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test /home/ianblenke/docker/gev-tools/director-3/limits.test.mjs
```

## Tests without tags

The project migration test and author details test stay outside this change.
Their titles stay the same.

## Title correction

The lead changed these three title words in pass 1.
These exact pairs stay as history.

```text
Old: image bounds and media anchor references are explicit and validated
New: image bounds and media anchor references are stated and validated
Old: GeoJSON preserves stable geometry IDs but never properties or remote style hints
New: GeoJSON keeps stable geometry IDs but never properties or remote style hints
Old: bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity
New: bundle rejects invalid bytes, unknown fields, traversal, duplicates, missing files and broken integrity
```

### Base title pairs

The base title commands read commit `290b5d2`.
Each pair below gives an old title and its final text, without the tag.

```text
Old: manifest rejects duplicate/unknown IDs, unsupported placement and request or credential syntax
New: The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials
```

```text
Old: image bounds and media anchor references are explicit and validated
New: The manifest checks given image bounds and media anchor references
```

```text
Old: directory source confines paths, strips credentials and rejects redirects, oversized streaming bodies and missing assets
New: The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

```text
Old: GeoJSON preserves stable geometry IDs but never properties or remote style hints
New: GeoJSON keeps stable geometry IDs without properties or remote style hints
```

```text
Old: pack session removes presentations and cancels the transport on Stop
New: The data pack session removes resources and cancels the transport on Stop
```

```text
Old: replacing a pending source settles promptly and ignores its late bytes
New: The data pack session replaces source work and ignores its late bytes
```

```text
Old: late renderer resources are disposed after cancellation without mutating a replacement
New: The data pack session disposes late renderer resources after cancellation and keeps the replacement
```

```text
Old: an abort between renderer settlement and continuation cannot leak the returned resource
New: The data pack session disposes a renderer resource when its signal stops after the renderer result
```

```text
Old: timeout settles an uncooperative adapter and failed packs roll back earlier resources
New: The deadline stops a stalled registered source and a data pack error removes earlier resources
```

```text
Old: byte and integrity checks run before rendering; adapter names never resolve inherited properties
New: The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names
```

```text
Old: failed responses release their body and an already-cancelled source sends no request
New: The directory source cancels response bodies and sends no asset request with a cancelled signal
```

```text
Old: selected-scene bundles round trip bytes and attribution without mutating the project or fetching
New: The export copies bytes and attribution and keeps the project without an asset request for the selected scene bundle
```

```text
Old: bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity
New: The import rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
```

```text
Old: asset caps and declared integrity are enforced before creating a downloadable bundle
New: The export rejects excess bytes, wrong integrity and absent assets
```

```text
Old: duplicate pack paths share one asset and reject conflicting integrity
New: The export share one asset and reject integrity values that differ for the data packs with the same path
```

```text
Old: preview reports unavailable sources/layers and missing bundle assets without applying anything
New: The preview reports unavailable sources, absent layers and absent bundle assets
```

```text
Old: bundle byte owner releases replacement data and has no network fallback
New: The store removes old data after replacement and uses no network source for the import byte store
```

```text
Old: oversized files fail before reading and cancellation settles a stalled file without a late result
New: The share helpers reject excess file bytes before they read text and cancel a stalled project file
```

```text
Old: cancelled bundle export never resolves another asset or produces partial output
New: The export stops before the next asset and returns no partial output for the cancelled bundle export
```

```text
Old: long valid source filenames still produce an importable bundle
New: The export returns a bundle for a source path of 1024 characters
```

### Pass 2 title pairs

The input commands read the test files before pass 2.
These pairs give each changed input title and its final text.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && git show HEAD:src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && git show HEAD:src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && git show HEAD:src/director/sharing/sharing.test.mjs
```

```text
Old: [director-082] manifest rejects duplicate/unknown IDs, unsupported placement and request or credential syntax
New: [director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials
```

```text
Old: [director-080] image bounds and media anchor references are stated and validated
New: [director-080] The manifest checks given image bounds and media anchor references
```

```text
Old: [director-095 director-096 director-097] directory source confines paths, strips credentials and rejects redirects, oversized streaming bodies and missing assets
New: [director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

```text
Old: [director-087] GeoJSON keeps stable geometry IDs but never properties or remote style hints
New: [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
```

```text
Old: [director-089] pack session removes presentations and cancels the transport on Stop
New: [director-089] The data pack session removes resources and cancels the transport on Stop
```

```text
Old: [director-091] replacing a pending source settles promptly and ignores its late bytes
New: [director-091] The data pack session replaces source work and ignores its late bytes
```

```text
Old: [director-090] late renderer resources are disposed after cancellation without mutating a replacement
New: [director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement
```

```text
Old: [director-090] an abort between renderer settlement and continuation cannot leak the returned resource
New: [director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result
```

```text
Old: [director-092] timeout settles an uncooperative adapter and failed packs roll back earlier resources
New: [director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources
```

```text
Old: [director-093] byte and integrity checks run before rendering; adapter names never resolve inherited properties
New: [director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names
```

```text
Old: [director-097] failed responses release their body and an already-cancelled source sends no request
New: [director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal
```

```text
Old: [director-082] The scene rejects duplicate pack IDs
New: [director-082] The validator rejects duplicate data pack IDs for the scene
```

```text
Old: [director-082] The shot rejects duplicate pack IDs
New: [director-082] The validator rejects duplicate data pack IDs for the shot
```

```text
Old: [director-082] The shot rejects unknown pack IDs
New: [director-082] The validator rejects unknown data pack IDs for the shot
```

```text
Old: [director-082] The scene accepts absent packs and anchors
New: [director-082] The validator returns without an error for absent data packs and anchors for the scene
```

```text
Old: [director-083] The collection rejects invalid total
New: [director-083] The decoder rejects more than 2000 features for the collection
```

```text
Old: [director-085] The position rejects invalid finite
New: [director-085] The decoder rejects a coordinate that is not finite for the position
```

```text
Old: [director-085] The position rejects invalid low height
New: [director-085] The decoder rejects a height below the limit for the position
```

```text
Old: [director-085] The position rejects invalid high height
New: [director-085] The decoder rejects a height above the limit for the position
```

```text
Old: [director-087] The geometry rejects invalid empty
New: [director-087] The decoder rejects an empty polygon for the geometry
```

```text
Old: [director-087] The geometry rejects invalid total
New: [director-087] The decoder rejects more than 128 rings for the geometry
```

```text
Old: [director-088] The session rejects pack list type
New: [director-088] The session rejects a value that is not a data pack list
```

```text
Old: [director-088] The session rejects pack list total
New: [director-088] The session rejects more than eight data packs
```

```text
Old: [director-090] The session tolerates a null late handle
New: [director-090] The session returns false for cancelled work with a null late handle
```

```text
Old: [director-090] The session destroys pending work
New: [director-090] The session returns false for work that destruction stops
```

```text
Old: [director-091] The replacement keeps its own resources
New: [director-091] The session keeps its resources for the replacement
```

```text
Old: [director-092] The session rejects absent adapter
New: [director-092] The session rejects absent renderer
```

```text
Old: [director-093] The session rejects byte type
New: [director-093] The session rejects bytes that are not a Uint8Array
```

```text
Old: [director-093] The session rejects byte empty
New: [director-093] The session rejects an empty asset
```

```text
Old: [director-093] The session rejects byte size
New: [director-093] The session rejects an asset above the byte limit
```

```text
Old: [director-093] The session rejects byte declared size
New: [director-093] The session rejects a wrong byteLength field
```

```text
Old: [director-093] The session rejects total byte excess
New: [director-093] The session rejects bytes above the total limit
```

```text
Old: [director-089] The session rejects handle null
New: [director-089] The session rejects a null handle
```

```text
Old: [director-089] The session rejects handle disposal
New: [director-089] The session rejects a handle without a dispose function
```

```text
Old: [director-094] The directory rejects directory
New: [director-094] The factory rejects an address with no final slash
```

```text
Old: [director-095] The request sets its own options
New: [director-095] The source sets its fixed options for the asset request
```

```text
Old: [director-097] The source tolerates failed body cancellation
New: [director-097] The source rejects the asset request after failed body cancellation
```

```text
Old: [director-080] The image admits its bounds field
New: [director-080] The validator returns without an error for its bounds field for the image
```

```text
Old: [director-080] The image admits its height field
New: [director-080] The validator returns without an error for its height field for the image
```

```text
Old: [director-080] The image admits its altitudeReference field
New: [director-080] The validator returns without an error for its altitudeReference field for the image
```

```text
Old: [director-081] The media admits its anchorId field
New: [director-081] The validator returns without an error for its anchorId field for the media
```

```text
Old: [director-077] The geojson admits its altitudeReference field
New: [director-077] The validator returns without an error for a GeoJSON altitudeReference field
```

```text
Old: [director-090] The session catches signal state without an event
New: [director-090] The session returns false for a cancelled signal without an event
```

```text
Old: [director-090] The session catches destroyed state after signal access
New: [director-090] The session checks destroyed state after it reads the signal
```

```text
Old: [director-090] The session catches replacement without signal state
New: [director-090] The session returns false for a cleared load call without a signal state access
```

```text
Old: [director-090] The session guard disposes before handle ownership
New: [director-090] The session disposes the handle before it adds the handle to its list
```

```text
Old: [director-092] The absent adapter does not call its source
New: [director-092] The session rejects an absent renderer without a source call
```

```text
Old: [director-095] The request owns its credentials option
New: [director-095] The source sets its credentials option for the asset request
```

```text
Old: [director-095] The request owns its redirect option
New: [director-095] The source sets its redirect option for the asset request
```

```text
Old: [director-095] The request owns its referrerPolicy option
New: [director-095] The source sets its referrerPolicy option for the asset request
```

```text
Old: [director-095] The request owns its cache option
New: [director-095] The source sets its cache option for the asset request
```

```text
Old: [director-077] The manifest admits its pack id field
New: [director-077] The validator returns without an error for the id field of a data pack
```

```text
Old: [director-077] The manifest admits its pack version field
New: [director-077] The validator returns without an error for the version field of a data pack
```

```text
Old: [director-077] The manifest admits its pack format field
New: [director-077] The validator returns without an error for the format field of a data pack
```

```text
Old: [director-077] The manifest admits its pack source field
New: [director-077] The validator returns without an error for the source field of a data pack
```

```text
Old: [director-077] The manifest admits its pack attribution field
New: [director-077] The validator returns without an error for the attribution field of a data pack
```

```text
Old: [director-077] The manifest admits its pack placement field
New: [director-077] The validator returns without an error for the placement field of a data pack
```

```text
Old: [director-079] The manifest admits its pack byteLength field
New: [director-079] The validator returns without an error for the byteLength field of a data pack
```

```text
Old: [director-079] The manifest admits its pack sha256 field
New: [director-079] The validator returns without an error for the sha256 field of a data pack
```

```text
Old: [director-077] The manifest admits its source adapter field
New: [director-077] The validator returns without an error for its source name field
```

```text
Old: [director-077] The manifest admits its source path field
New: [director-077] The validator returns without an error for its source path field
```

```text
Old: [director-078] The manifest admits its attribution text field
New: [director-078] The validator returns without an error for its attribution text field
```

```text
Old: [director-078] The manifest admits its attribution license field
New: [director-078] The validator returns without an error for its attribution license field
```

```text
Old: [director-078] The manifest admits its attribution url field
New: [director-078] The validator returns without an error for its attribution url field
```

```text
Old: [director-081] The session gives anchors to its adapter
New: [director-093] The session calls the renderer with the anchors and returns true
```

```text
Old: [director-089] The session owns every pack handle
New: [director-089] The session keeps every data pack handle
```

```text
Old: [director-095] The request owns its signal option
New: [director-095] The source sets its signal option for the asset request
```

```text
Old: [director-092] The missing source stops after the validation size read
New: [director-092] The session reads the byteLength field once without a registered source for the data pack session
```

```text
Old: [director-101] selected-scene bundles round trip bytes and attribution without mutating the project or fetching
New: [director-101] The export copies bytes and attribution and keeps the project without an asset request for the selected scene bundle
```

```text
Old: [director-099] bundle rejects invalid bytes, unknown fields, traversal, duplicates, missing files and broken integrity
New: [director-099] The import rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
```

```text
Old: [director-102] asset caps and declared integrity are enforced before creating a downloadable bundle
New: [director-102] The export rejects excess bytes, wrong integrity and absent assets
```

```text
Old: [director-103] duplicate pack paths share one asset and reject conflicting integrity
New: [director-103] The export share one asset and reject integrity values that differ for the data packs with the same path
```

```text
Old: [director-109] preview reports unavailable sources/layers and missing bundle assets without applying anything
New: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets
```

```text
Old: [director-104] bundle byte owner releases replacement data and has no network fallback
New: [director-104] The store removes old data after replacement and uses no network source for the import byte store
```

```text
Old: [director-106] oversized files fail before reading and cancellation settles a stalled file without a late result
New: [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
```

```text
Old: [director-107] cancelled bundle export never resolves another asset or produces partial output
New: [director-107] The export stops before the next asset and returns no partial output for the cancelled bundle export
```

```text
Old: [director-101] long valid source filenames still produce an importable bundle
New: [director-101] The export returns a bundle for a source path of 1024 characters
```

```text
Old: [director-098] The share parser rejects nontext input
New: [director-098] The import rejects nontext input
```

```text
Old: [director-098] The share parser rejects invalid JSON
New: [director-098] The import rejects invalid JSON
```

```text
Old: [director-098] The share parser accepts plain project JSON
New: [director-098] The import accepts plain project JSON and returns the project
```

```text
Old: [director-098] The share parser rejects excess characters
New: [director-098] The import rejects excess characters
```

```text
Old: [director-098] The share parser rejects excess UTF8 bytes
New: [director-098] The import rejects excess UTF8 bytes
```

```text
Old: [director-100] The bundle rejects pack asset absent
New: [director-100] The import rejects an absent asset
```

```text
Old: [director-100] The bundle rejects pack asset byte length
New: [director-100] The import rejects a wrong byteLength field
```

```text
Old: [director-100] The bundle rejects pack asset digest
New: [director-100] The import rejects a pack digest that differs from its asset
```

```text
Old: [director-100] The bundle rejects external pack sources
New: [director-100] The import rejects external data pack sources
```

```text
Old: [director-102] The export rejects byte type
New: [director-102] The export rejects bytes that are not a Uint8Array
```

```text
Old: [director-102] The export rejects byte empty
New: [director-102] The export rejects an empty asset
```

```text
Old: [director-102] The export rejects byte size
New: [director-102] The export rejects an asset above the byte limit
```

```text
Old: [director-104] The store clears owned bytes
New: [director-104] The store clears stored bytes
```

```text
Old: [director-105] The store rejects size bytes
New: [director-105] The store rejects bytes above the caller limit
```

```text
Old: [director-107] The helper cancels pending work
New: [director-107] The helper cancels work that is not complete
```

```text
Old: [director-110] The preview detects applied scene packs
New: [director-110] The preview reports external content for applied shot packs
```

```text
Old: [director-110] The preview detects shot source packs
New: [director-110] The preview reports external content for a shot with a source pack ID
```

```text
Old: [director-101] The export accepts scenes without packs
New: [director-101] The export accepts scenes without data packs and returns bundle text
```

```text
Old: [director-101] The export keeps a supplied pack list
New: [director-101] The export returns one asset for a supplied data pack list
```

```text
Old: [director-108] The preview accepts absent pack lists
New: [director-108] The preview reports no packs when data pack lists are absent
```

```text
Old: [director-108] The preview uses supplied pack lists
New: [director-108] The preview reports one pack from the supplied data pack list
```

```text
Old: [director-103] The export key uses adapter
New: [director-103] The export key uses the registered source name and returns bundle text
```

```text
Old: [director-100] The bundle checks its second asset hash
New: [director-100] The import checks its second asset digest and rejects the call
```

```text
Old: [director-103] The export accepts matching shared integrity
New: [director-103] The export accepts equal shared integrity and returns bundle text
```

## Corrections of review round 2

OPEN means that the proof is not complete.

Base commit: `290b5d2`.
Pass 3 adds the operand table in audit.md.
That table replaces the scratch decision table.
The table lists operands, constants, default values, array methods and helper arguments.
An open row records work that is not complete.

| Finding | Correction |
| --- | --- |
| Accept-at-limit holes | Tests check the character limit, the multibyte byte limit, the export text limit and the caller byte limit. |
| Accept-at-limit holes: asset total | The import accepts distinct assets at its limit. |
| Math.abs | Tests check negative and positive longitude and latitude limits and the first value above each limit. |
| Four-element position | Tests reject positions with one or four coordinates. Scenario 085 states the accepted lengths. |
| Cap of eight data packs | Tests use distinct IDs and separate acceptance at eight from rejection at nine. Scenario 082 states the cap. |
| Reports the loading state | A test tagged 089 reads the state before the source work settles. |
| Bundle validators | Tests reject invalid plain, bundle and export projects, null and extra top-level fields. |
| Resolver arguments | A resolver reads the data pack, the signal and the signal property source. |
| Inherited height | The description says an inherited value at index 2. The probe checks plain values on both parent objects. |
| Path character class | Tests reject query syntax, a colon, a dot prefix, a final slash and an empty path part. |
| Smaller survivors | Tests check one byte, array bounds and the default source byte limit. Scenario 094 states the final slash. |
| Renderer arguments | Tests tagged 093 check data pack and anchors arguments. Scenario 093 names both. |
| Stalled renderer | The titles and records say stalled registered source and inherited registered source names. |
| The share helpers reject | Tests tagged 098 and their records name the bundle helpers. |
| Wrong asset digest | The two titles distinguish the data pack digest from the asset digest. |
| Preview dependencies | Scenario 110 describes whether content exists, instead of lists of that content. |
| Rejects credentials | The directory title says it sends no credentials and rejects the other invalid input. |
| One name each | The records use data pack validators, data pack session, source call and byteLength field. |
| Shot source pack ID | The title says the source pack ID of a shot. |
| Verbs as nouns | The records name caller actions and tests that mutations make fail. |
| Intact and lower case | The replacement scenario states that the old call does not change new resources. The AND line starts with a capital. |
| Warning total | The current lint output supplies the total. |
| Design terms | The design names report, test, coverage and ledger commands and the first value above the limit. |
| Task m071 | The task states that the mutation uses the code below. |

The applied Purpose belongs to the lead.
Pass 3 does not edit that file.
Old title text stays in fenced records because it names the original text.

The repeated export parser is equivalent for the public API of the module with standard built-in functions.
The probe checks getters and a resolver spy.
The probe is evidence/probe-export-parser.txt.
The serializer checks the same project text before the repeated parser.
The parser returns its input object without a change.

The inherited-height probe is evidence/probe-inherited-height.txt.
It shows the same result for a plain value on Array.prototype and Object.prototype.
It records a Known limit, not an equivalent mutation.

The listener tests check removal after success, error and cancellation.
The cancellation test checks removal before late work settles.
The renderer test checks the source of the data pack and anchors properties.

Commands for probes:

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass3-height-probe.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass3-export-probe.mjs
```

### Title correction in pass 3

The pairs below compare the titles of pass 2 with the titles of pass 3.

File: src/director/packs/packs.test.mjs

```text
Old: [director-095 director-096 director-097] The directory source confines paths and rejects credentials, redirects, excess bytes and absent assets
New: [director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

File: src/director/packs/packs.test.mjs

```text
Old: [director-092] The deadline stops a stalled renderer and a data pack error removes earlier resources
New: [director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources
```

File: src/director/packs/packs.test.mjs

```text
Old: [director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited renderer names
New: [director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names
```

File: src/director/packs/backfill.test.mjs

```text
Old: [director-093] The session rejects a wrong asset length
New: [director-093] The session rejects a wrong byteLength field
```

File: src/director/packs/backfill.test.mjs

```text
Old: [director-081] The session gives anchors to its renderer
New: [director-093] The session calls the renderer with the anchors and returns true
```

File: src/director/packs/backfill.test.mjs

```text
Old: [director-092] The absent registered source stops after the validation size read
New: [director-092] The session reads the byteLength field once without a registered source for the data pack session
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject nontext input
New: [director-098] The import rejects nontext input
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject invalid JSON
New: [director-098] The import rejects invalid JSON
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers accept plain project JSON
New: [director-098] The import accepts plain project JSON and returns the project
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject excess characters
New: [director-098] The import rejects excess characters
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject excess UTF8 bytes
New: [director-098] The import rejects excess UTF8 bytes
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-100] The bundle rejects a wrong asset length
New: [director-100] The import rejects a wrong byteLength field
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-100] The bundle rejects a wrong asset digest
New: [director-100] The import rejects a pack digest that differs from its asset
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-100] The bundle rejects wrong asset digest
New: [director-100] The import rejects an asset digest that differs from its bytes
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader accepts an absent filename
New: [director-106] The share helpers return the project for an absent filename
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader rejects the ordinary file budget
New: [director-106] The share helpers reject the ordinary file limit
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader gives bundles the larger budget
New: [director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-110] The preview detects a shot source pack ID
New: [director-110] The preview reports external content for a shot with a source pack ID
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader checks a signal after text access
New: [director-106] The share helpers call throwIfAborted three times and return the project
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-105] The store rejects a cancelled asset call
New: [director-105] The store rejects a cancelled source call
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader accepts the ${label} file limit and rejects one more byte
New: [director-106] The share helpers accept the bundle file limit and reject one more byte
```


### Complete mutation results of pass 3

The complete command reaches the end after the last test edit.
The output records a failed repository test for each killed mutation.
The mutation report gives the Old, New, Result and failed test for each row.
The operand table is [audit.md](audit.md).

```json
{
  "mutations": 408,
  "results": {
    "KILLED": 405,
    "SURVIVED": 3
  },
  "survivors": [
    "m172",
    "m284",
    "m389"
  ],
  "audit": {
    "rows": 1079,
    "classes": {
      "OPEN": 661,
      "TESTED": 415,
      "known limit": 2,
      "EQUIVALENT": 1
    }
  }
}
```

The command below gives these totals.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass3-reconcile.py
```

The open operand rows are not complete.
This pass does not claim a complete systematic proof sweep.
The change is not ready for review.

### Host checks of pass 3

Base commit: `290b5d2`.
The host uses Node 26.8.2.
The commands use one process for each test file and one coverage command for each production file.
They do not use the test-force-exit option.

File: src/director/packs/packs.test.mjs

```json
{
  "tests": 12,
  "pass": 12,
  "fail": 0,
  "cancelled": 0,
  "skipped": 0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
```

File: src/director/packs/backfill.test.mjs

```json
{
  "tests": 241,
  "pass": 241,
  "fail": 0,
  "cancelled": 0,
  "skipped": 0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
```

File: src/director/sharing/sharing.test.mjs

```json
{
  "tests": 132,
  "pass": 132,
  "fail": 0,
  "cancelled": 0,
  "skipped": 0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
```

File: src/director/packs/manifest.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/manifest.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
```

File: src/director/packs/geojson.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/geojson.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
```

File: src/director/packs/session.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/session.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
```

File: src/director/packs/source.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/source.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
```

File: src/director/sharing/bundle.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/bundle.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

File: src/director/sharing/lifetime.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/lifetime.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

File: src/director/sharing/preview.js

```json
{
  "lines": 100.0,
  "branches": 100.0,
  "functions": 100.0
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/preview.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

The command below reads each test total and each coverage row from those command outputs.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass3-host-record.py
```

### Prose checks of pass 3

The title scan checks 354 titles and reports zero banned forms.
The predispatch report also scans source text and old title records in code blocks.
The owner words in those blocks are source text, not new prose or new titles.
The value AAAA is a base64 string in a mutation, not an abbreviation.
The signal is a technical object.

Commands:

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && (cd /home/ianblenke/docker/gev-work && taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110)
```

### Format and file scope of pass 3

EPERM means that the operation is not allowed.
The direct format command stops with spawnSync git EPERM.
The host format commands complete and report 1158 source files each.
The production diff is empty after the mutation command restores its files.
The protected review files also match HEAD.
The changed files belong to the test scope and this change folder.

The lead runs the full gates and the review.
This pass does not run those commands.

Commands:

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-3 && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-3 && git diff --stat HEAD -- 'src/director/**/*.js'
cd /home/ianblenke/docker/gev-work/director-3 && git diff --name-only HEAD -- openspec/changes/backfill-director-packs-sharing/review
```

### Final prose correction of pass 3

The lint command reports zero errors and 543 warnings.
The paragraph about the format command now has two parts.
This command checks the prose.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing
```

## Pass 4

Base commit: `290b5d2`.

### Test counts and times

The host uses Node 26.8.2.
The image version in `.node-version` is 24.21.0.
The lead must confirm coverage with that image.
No image or gate command ran in this pass.

Each test command below ran alone and without forced process exit.
The before copy carries the old test files from the source commit in audit.md.
The copy has all source dependencies and a link to the same node_modules directory.
The first copy lacked a source dependency and stopped before the sharing test.
That failed initial command gives no test result for packs.
The corrected copy completed all three test files.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/director-3/pass4/baseline && taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/director-3/pass4/baseline && taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/director-3/pass4/baseline && taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
```

The logs are `baseline-<name>.log` and `final-<name>.log` in the folder `evidence`.
The command below reads counts and times.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && rg '^ℹ (tests|pass|fail|duration_ms)' /home/ianblenke/docker/gev-tools/director-3/pass4/baseline-*.log /home/ianblenke/docker/gev-tools/director-3/pass4/final-*.log
```

| file | tests before | tests after | before seconds | after seconds |
| --- | ---: | ---: | ---: | ---: |
| `src/director/packs/backfill.test.mjs` | 241 | 301 | 2.118618 | 2.533981 |
| `src/director/packs/packs.test.mjs` | 12 | 12 | 6.862618 | 7.232998 |
| `src/director/sharing/sharing.test.mjs` | 132 | 166 | 115.901768 | 10.406275 |

The final count is 479 passed tests and zero failures.
No new test file is necessary.
The other backfill and sharing files contain the new checks.

### Slow test proof

The fixtures use a real buffer of 33554432 bytes.
Node Buffer and crypto build the base64 text and SHA256 digest once.
The import checks bundle JSON directly.
The export caches zero-byte chunks with the native subarray bounds.
The decoder checks the map function for all 256 byte values before the fast copy.
The final assertions check exact byte and text lengths, digest and rejection messages.

The total export test also proves the asset byte limit and total excess rejection.
It replaces two separate tests with the same limit proof.
The absent-length test uses numeric byte lengths and an empty array length.
It checks that the fallback keeps the total.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && rg 'total byte limit|excess total bytes|absent length|asset byte limit|base64 accepts its length' /home/ianblenke/docker/gev-tools/director-3/pass4/baseline-sharing.log /home/ianblenke/docker/gev-tools/director-3/pass4/final-sharing.log
```

| test | before seconds | after seconds |
| --- | ---: | ---: |
| The import accepts the total byte limit and rejects one more byte and returns assets | 59.990760 | 4.083381 |
| The export accepts the total byte limit and rejects one more byte and returns bundle text | 22.209433 | 2.575859 |
| The export rejects excess total bytes | 12.033089 | Part of the total export test. |
| The export keeps its total after an asset without a byte length | 10.273848 | 0.013870 |
| The import accepts its length limit and rejects the next aligned length for the base64 and returns assets | 5.803030 | 0.446927 |
| The export accepts the asset byte limit | 2.787105 | Part of the total export test. |

Each other limit test takes less than 10 seconds.
The complete sharing file takes less than 40 seconds.
The assertions still separate each exact limit from its first value above the limit.
Pass 4 correction check 2 kills the former shot limit survivors a0831 and a0832.
The source limit mutations outside this list stay available for the lead run.

### Automatic mutation proof

The audit gives the original operator totals and both original phases.
Campaign 1 stopped during baseline tests at the 30-second cap.
No mutation ran in campaign 1.
Its log is `stopped-baseline.log`; its partial output is `stopped-baseline-results.json`.

Pass 4 correction check 1 killed 180 cases and left 80 survivors.
Its output is `campaign-first-results.json`.
Further tests killed 12 more cases.

The final command uses all 260 former survivors and all three test files.
The slow threshold disables the skipped-test phase.
The tool copies the source into its work directories.
The root production files stay unchanged.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && survivor_ids=$(cat /home/ianblenke/docker/gev-tools/director-3/pass4/ids.txt) && cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants /home/ianblenke/docker/gev-tools/automut/director-3/mutants.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --only "$survivor_ids" --jobs 4 --slow-ms 100000 --out /home/ianblenke/docker/gev-tools/director-3/pass4/results.json
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass4/final-table.py
```

The final output reports 192 killed and 68 survived results.
It reports zero timeouts and zero crashes.
The phase is complete.
The final table has 260 unique rows and zero open rows.
The result groups are 192 killed, 64 equivalent and four Known limit cases.

The command output is `campaign.log` and `final-table.log`.

The other survivor IDs are:

```text
a3144,a1022,a3788,a1415,a1100,a1435,a1436,a1439,a1442,a1549,a1550,a2624,a2625,a3048,a3049,a3424,a3635,a3636,a3637,a3640,a0405,a0607,a0705,a1431,a1487,a2552,a2680,a2681,a2683,a2684,a2483,a3054,a0364,a0359,a0354,a0369,a0410,a0612,a0710,a0926,a1026,a1025,a1038,a1149,a1190,a1205,a1335,a1336,a1396,a1397,a1417,a1424,a1425,a1432,a1512,a1513,a1717,a1908,a2012,a2017,a2022,a2027,a2032,a2512,a2553,a3295,a3301,a3310
```

The [survivor table](survivors.md) links each equivalent case to a probe.
The probes call public exports and compare output, error fields and observable calls.
Their bound is the public API of the module with standard built-in functions.
They exclude source text and diagnostic stack locations.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass4/build-probes.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass4/probe-height-guards.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass4/probe-nonnumeric-length.mjs
```

The final probe output reports 64 equivalent cases in `probes-final2.log`.
The inherited-height probe records a1022, a1025 and a1026.
The nonnumeric-length probe records a3144.
Those four cases remain Known limits.
The other signal-getter Known limit stays a Known limit outside the automatic survivor list.
No new scenario approves a Known limit.

### Prose scan bounds

The predispatch scan still quotes old test titles from base commit `290b5d2`.
The flagged title words occur only in those exact history quotes.
They are not new prose or current test titles.

The value AAAA is base64 test data in the hand mutation report.
The uppercase status labels in the audit and survivor table are tool or table values.
Those labels are not undefined abbreviations in prose.

The title scan checks 406 titles and reports zero banned forms.
The current test titles therefore pass the required scan.


### Host coverage

The command checks one production file at a time.
It runs the same three test files in each check.
Each log reports 479 passed tests and zero failures.
Each production file has 100 percent line, branch and function coverage.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && for coverage_file in packs/geojson packs/manifest packs/session packs/source sharing/bundle sharing/lifetime sharing/preview; do taskset -c 12-15 nice -n 19 node --test --test-concurrency=1 --experimental-test-coverage --test-coverage-include="src/director/$coverage_file.js" --test-coverage-exclude='**/*.test.mjs' src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs src/director/sharing/sharing.test.mjs > "/home/ianblenke/docker/gev-tools/director-3/pass4/coverage-${coverage_file##*/}.log" 2>&1 || exit; done
cd /home/ianblenke/docker/gev-work/director-3 && rg 'ℹ    .*\.js|ℹ all files|ℹ fail ' /home/ianblenke/docker/gev-tools/director-3/pass4/coverage-*.log
```

| production file | lines | branches | functions |
| --- | ---: | ---: | ---: |
| packs/geojson.js | 100.00 | 100.00 | 100.00 |
| packs/manifest.js | 100.00 | 100.00 | 100.00 |
| packs/session.js | 100.00 | 100.00 | 100.00 |
| packs/source.js | 100.00 | 100.00 | 100.00 |
| sharing/bundle.js | 100.00 | 100.00 | 100.00 |
| sharing/lifetime.js | 100.00 | 100.00 | 100.00 |
| sharing/preview.js | 100.00 | 100.00 | 100.00 |

### Format and title checks

The direct format commands with --write and --check stop with `spawnSync git EPERM`.
The host helper completes both commands.
The output of --write reports 1158 formatted files.
The output of --check reports 1158 checked files.
The helper uses the same format script.

The first helper command with --write in the sandbox stopped without a final result.
Its empty output gives no format result.
The later host commands with --write and --check completed with exit code zero.
The logs are `format-write-host.log` and `format-check-host.log` in the folder `evidence`.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-work && taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110
```

The title output is:

```text
titles checked: 406, with a banned form: 0
```


### Record comparison

The command below reads both pass 4 correction checks and the pass 4 table.
It reports 180 killed and 80 survived results for pass 4 correction check 1.
It reports 192 killed and 68 survived results for pass 4 correction check 2.
The pass 4 table agrees with all 260 correction records.
Each equivalent probe path exists.
The hand input has 408 rows.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass4/check-records.py
```

The output is `check-records.log` in the folder `evidence`.


### Complete hand check

The helper changes code only in a scratch clone.
The root production files stay unchanged.
The clone contains the final tests and all source dependencies.
The complete run checks all 408 rows once.
It kills 406 rows and leaves only m172 and m389.
No row was skipped, timed out or crashed.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-tools/director-3/pass4/hand-clone /home/ianblenke/docker/gev-tools/director-3/muts.json
```

The output is `hand-final.log` in the folder `evidence`.
The [hand mutation report](mutations.md) includes that complete output.
The failed test for m284 is:

```text
[director-088] The session returns false without a caller signal access after destruction
```

The new guard-order test kills m284 with an already destroyed session.
The separate active-session signal getter fault remains a Known limit.
The pass policy expected three survivors, but the stronger test kills one more row.
The tests keep this valid proof.
No new hand row is necessary because the automatic tool reproduces every new kill.

The hand patterns for m126 and m341 now name the combined total export test.
A backslash comes before each space in those patterns.
The complete hand run proves both rows still fail.


### Final prose and scope checks

The lint command reports zero errors.
The title scan reports zero banned forms.
The predispatch scan leaves only exact old title quotes.
The scan numbers refer to different stated limits and earlier pass results.
The brief says to keep the exact old quotes.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && git diff --check
cd /home/ianblenke/docker/gev-work/director-3 && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-3 && git diff HEAD -- 'src/director/**/*.js'
cd /home/ianblenke/docker/gev-work/director-3 && git diff 290b5d2 -- src/director/packs/geojson.js src/director/packs/manifest.js src/director/packs/session.js src/director/packs/source.js src/director/sharing/bundle.js src/director/sharing/lifetime.js src/director/sharing/preview.js
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass4/check-scope.py
```

The scope script compares all seven production files and the three test files with the hand clone.
Each copy matches its root file after the hand run.
The production diffs are empty against the current source commit and base commit `290b5d2`.
The changed paths are only the two test files and this change directory.
No trace ledger, main spec, QA script or review report changes.

The first marker scan included unchanged review reports and stopped on their old markers.
That probe gave no complete scope result.
The final scope script checks each changed file and completes.
The logs are `final-scope.log`, `final-paths.log`, `final-production-diff.log` and `base-production-diff.log`.

The lead runs the full automatic mutation set, image gates, ratchet and both reviews.
Those commands are outside this pass.
No commit, merge or push ran.

## Pass 5

Base commit: `290b5d2`.

### Review round 3 corrections

The first words below identify each finding in the unchanged review reports.
The pass skips no finding.
The lead owns the main spec, ratchet and next review round.

| report | first words of the finding | correction |
| --- | --- | --- |
| Spec | `a2680, a2681, a2683 and` | New director-098 tests check 5242881 and 52428800 characters. All four mutations fail. The pass retires the false probe. |
| Spec | `No test uses +` | Import and export tests check +/+/ and /w==, padded + and the standard alphabet. The 099 clause gives this alphabet. |
| Spec | `snapshot: () => new` | The 104 test checks keys, byte values and a separate map. Constructor argument mutations now fail. |
| Spec | `The 101 clause` | An invalid project has a pack. A resolver spy checks zero calls. |
| Spec | `No test accepts a` | The 076 tests accept _ and - at the start. All 24 regex member mutations fail. Extension check 4 removes each character separately. |
| Spec | `Pass 2 statements` | The old statements and test table have pass 2 labels. Pass 4 and pass 5 keep separate totals. |
| Spec | `Timeouts and crashes count` | The audit labels the pass policy and states that the tool has countsAsKill false for the 114 cases of the rerun after pass 4. |
| Spec | `these two limits` | The proposal names a later change for each code Known limit, including bundle-nonnumeric-length. |
| STE | `starts with the project` | The delta spec names $, project, assets and source.path as distinct error prefixes. |
| STE | `replaced load call` | The tests and clauses use cleared load call for clear(), and replacement for a new load call. |
| STE | `first campaign` | The documents use campaign 1, campaign 2, final rerun and extension run. Pass 4 correction checks keep separate names. |
| STE | `gives the decision totals` | The design names operator and status totals and uses pass4/build-audit.py. |
| STE | `Data data pack sessions` | The delta spec uses Data pack sessions. The main spec and ratchet stay with the lead. |
| STE | `byte length field` | The documents and titles distinguish the byteLength field from the byte array length. |
| STE | `code changes, candidates` | The documents use mutation and Known limit. The column name is known limit. |
| STE | `The case uses` | The proposal uses position, names later change folders and lists audit.md and survivors.md. The pass deletes the stale warning statement. |
| STE | `32 MiB` | The prose uses 33554432 bytes, first value above the limit and full verb clauses. |
| STE | `precedes, After destruction` | The prose uses comes before, caller action, include and sees. |
| STE | `leading equals sign` | The prose uses equals sign at the start, total, other and active verbs. |
| STE | `rejects null handle` | The labels match the test titles. The status word has one stated meaning. |
| STE | `The claim is equivalent` | Probe headers name the mutation. All 21 expanded probes pass. The extension probe gives 67 bounds. |

### Tagged test files

Pass 5 adds 152 host test cases: 106 in backfill.test.mjs and 46 in sharing.test.mjs.
The scenario IDs stay director-076 through director-110.
New cases check JSON error messages, base64 characters, snapshot data, resolver call order and path characters.
Other cases check validation order, callback order, stream disposal and cancellation.
The spec gives a clause for each case.

The new clauses use director-076, director-077, director-078, director-079 and director-080.
They also use director-088 through director-093 and director-095 through director-102.
Other new cases use director-104 through director-107.

### Test counts and coverage

Each test command uses one file without forced exit.
NODE_OPTIONS sets test isolation to none for these host processes.

| file | passed tests | time in seconds |
| --- | ---: | ---: |
| `src/director/packs/backfill.test.mjs` | 407 | 2.082896 |
| `src/director/packs/packs.test.mjs` | 12 | 7.420291 |
| `src/director/sharing/sharing.test.mjs` | 212 | 19.651011 |

All 631 tests pass with zero failures, cancellations or skips.
Each of the seven production files has 100% host line, branch and function coverage.
Each coverage command includes one production file.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/manifest.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/geojson.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/session.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/source.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/bundle.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/lifetime.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/preview.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

### Extension run

The extension run keeps all 3849 old IDs and exact mutations.
It adds 711 mutations and 16 operator classes.
The audit names classes that the tool still does not mutate.
The seven tool tests pass.

Extension checks 1 to 4 have inputs of 367, 199, 104 and 321 mutations.
The second and fourth inputs include four old JSON mutations.
The latest result for each new ID gives 644 killed and 67 equivalent cases.
No latest case has a timeout, crash, Known limit or open result.
The four old JSON mutations now fail director-098.

Extension check 4 found a gap in character ranges.
The tool now removes each letter and digit of a range and complete ranges.
New tests check all path letters and digits, all hexadecimal digits and each standard base64 character.
The fourth input checks 250 new range mutations and repeats all 67 former extension survivors.

The [automatic audit](audit.md) gives the extension check and class totals.
The [survivor table](survivors.md) names every failed test.
The [extension probe](evidence/probe-extension.txt) gives each equivalent bound.
The [probe range table](probe-ranges.md) checks the 22 old probe groups.
The 21 expanded equivalent probes pass; the pass retires the false JSON probe.

Each extension check uses the same three test files and source file order below.
These commands reproduce the saved inputs of each completed extension check.
The first command used mutants-new.json while it had 367 rows.
The saved copy of that input is extension-1-mutants.json.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants /home/ianblenke/docker/gev-tools/director-3/pass5/extension-1-mutants.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --order "src/director/packs/*.js=backfill,packs,sharing;src/director/sharing/*.js=sharing,backfill,packs" --jobs 4 --timeout 45 --slow-ms 100000 --out /home/ianblenke/docker/gev-tools/director-3/pass5/extension-results.json
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants /home/ianblenke/docker/gev-tools/director-3/pass5/correction-mutants.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --order "src/director/packs/*.js=backfill,packs,sharing;src/director/sharing/*.js=sharing,backfill,packs" --jobs 4 --timeout 45 --slow-ms 100000 --out /home/ianblenke/docker/gev-tools/director-3/pass5/correction-results.json
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants /home/ianblenke/docker/gev-tools/director-3/pass5/closing-mutants.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --order "src/director/packs/*.js=backfill,packs,sharing;src/director/sharing/*.js=sharing,backfill,packs" --jobs 4 --timeout 45 --slow-ms 100000 --out /home/ianblenke/docker/gev-tools/director-3/pass5/closing-results.json
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-tools/automut && taskset -c 12-15 nice -n 19 node automut.mjs run --root /home/ianblenke/docker/gev-work/director-3 --mutants /home/ianblenke/docker/gev-tools/director-3/pass5/range-mutants.json --tests src/director/packs/backfill.test.mjs,src/director/packs/packs.test.mjs,src/director/sharing/sharing.test.mjs --order "src/director/packs/*.js=backfill,packs,sharing;src/director/sharing/*.js=sharing,backfill,packs" --jobs 4 --timeout 45 --slow-ms 100000 --out /home/ianblenke/docker/gev-tools/director-3/pass5/range-results.json
```

The first extension probe command had an absent createHash import and did not pass.
The corrected command checks all 67 survivors and passes.
Full old probe outputs stay in scratch.
Compact reports keep exact data comparisons and record hashes, case counts and callback traces.

### Complete hand check

The final command checks all 408 rows once.
It kills 406 rows and leaves only m172 and m389.
The pass skips no row, and no row gives a timeout.
Every pattern matches a current test title and has a backslash before each space.
The scratch copy has the same seven source files and three test files after the command.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-tools/director-3/pass5/hand-copy /home/ianblenke/docker/gev-tools/director-3/pass5/hand-muts.json
```

The first hand check gave the same results.
The new character tests required the final repeat.
The first log stays in scratch as hand-before-range.log.

The [hand mutation report](mutations.md) records the full output of pass 5.

### Prose, format and scope

The lint command reports zero errors.
The title scan checks 464 titles with zero banned forms.
The predispatch scan leaves only eight exact Old title records.
The different numbers name different byte limits or earlier pass results.

The restricted direct format commands stop with spawnSync git EPERM.
The given host helper writes and checks 1158 files.
The production diffs are empty against the current source tree and base commit 290b5d2.
No main spec, trace ledger, QA script or review report changes.

Known limit session-listener-timer has a separate probe and later change.
The caller can cancel during listener registration before timer creation.
The timer then stays after the caller destroys the session.
Production code stays unchanged.

The lead runs the final rerun, ratchet, image gates and review.
This pass runs none of those commands.
No commit, merge or push runs.

### Pass 6 title correction

The Old records name titles before pass 6.
The New records name the current tests.

```text
Old: [director-076] The path type check comes before the segment read
New: [director-076] The validator rejects the path type before it reads a segment
```

```text
Old: [director-097] The source waits for stream cancellation before release
New: [director-097] The source waits for stream cancellation before it releases the reader lock
```

```text
Old: [director-097] The source waits for body cancellation before an HTTP error
New: [director-097] The source waits for body cancellation before it rejects the asset request
```

```text
Old: [director-089] The source listener and state check come before the work read
New: [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order
```

```text
Old: [director-092] The source event reads its reason once during another source event
New: [director-092] The session reads the source signal reason once during another source signal event
```

```text
Old: [director-089] The completed source does not read its reason during promise settlement
New: [director-089] The session returns true and does not read the reason after the source promise settles
```

```text
Old: [director-089] The session removes resources after source cancellation and timer cleanup
New: [director-089] The session removes resources after source cancellation and timer removal
```

```text
Old: [director-088 director-091] The new list check follows old resource cleanup
New: [director-088 director-091] The session checks the new list after it disposes old resources
```

```text
Old: [director-089] The caller listener comes before the deadline
New: [director-089] The session attaches the caller listener before the deadline timer starts
```

```text
Old: [director-090] The caller event during listener setup cancels the load call
New: [director-090] The session returns false for a caller event during listener registration
```

```text
Old: [director-107] The helper attaches its listener before the work read
New: [director-107] The helper attaches its listener before it reads the work promise
```

```text
Old: [director-107] The helper checks signal state at settlement
New: [director-107] The helper checks signal state when the work settles and rejects the call
```

```text
Old: [director-107] The file signal check follows text settlement
New: [director-107] The share helpers check the signal after the text promise settles and return the project
```

```text
Old: [director-098] The plain share returns an empty asset map
New: [director-098] The import returns an empty asset map for plain project JSON
```

```text
Old: [director-107] The helper handles cancellation during listener removal before a work error
New: [director-107] The helper rejects with the cancellation reason during listener removal after a work error
```

```text
Old: [director-099] The import checks top fields before version
New: [director-099] The import checks top-level fields before version and rejects the call
```

```text
Old: [director-105] The byte store rejects an unsafe path before its lookup
New: [director-105] The store rejects an invalid path that it holds for the byte store
```

```text
Old: [director-106] The file budget check comes before the signal read
New: [director-106] The share helpers check the file limit before they read the signal and reject the invalid input
```


### Other pass 6 title corrections

```text
Old: [director-079] The digest check comes before the placement read
New: [director-079] The validator checks the digest before it reads the placement
```

```text
Old: [director-080] The bounds array check comes before the length read
New: [director-080] The validator checks the bounds array before it reads the length
```

```text
Old: [director-082] The list check comes before the anchor read
New: [director-082] The validator checks the list before it reads the anchors
```

```text
Old: [director-088] The list check comes before the anchor read
New: [director-088] The session checks the list before it reads the anchors
```

```text
Old: [director-088] The declaration check comes before the caller signal read
New: [director-088] The session checks declarations before it reads the caller signal
```

```text
Old: [director-090 director-093] The source signal error comes before the byte read
New: [director-090 director-093] The session rejects the signal error before it reads bytes
```

```text
Old: [director-093] The total byte check comes before the digest read
New: [director-093] The session checks total bytes before it reads the digest
```

```text
Old: [director-096] The header limit check comes before the first stream read
New: [director-096] The source checks the header limit before it reads the first stream chunk
```

```text
Old: [director-097] The source signal check comes before the stream read
New: [director-097] The source checks the signal before it reads the stream chunk
```

```text
Old: [director-106] The share helpers reject the ordinary file budget
New: [director-106] The share helpers reject the ordinary file limit
```

```text
Old: [director-102] The export checks integrity before the filename read
New: [director-102] The export checks integrity before it reads the filename
```

```text
Old: [director-107] The helper removes its listener before the reason read
New: [director-107] The helper removes its listener before it reads the reason
```

```text
Old: [director-102 director-107] The export signal check comes before absent asset
New: [director-102 director-107] The export checks the signal before it checks for an absent asset and rejects the call
```

```text
Old: [director-092] The source event during listener removal stops success
New: [director-092] The session rejects the load call for a source signal event during listener removal after success
```

```text
Old: [director-092] The source event during listener removal stops error
New: [director-092] The session rejects the load call for a source signal event during listener removal after error
```


## Pass 6

Base commit: `290b5d2`.

### Review round 4 corrections

The first words identify each finding in the unchanged reports.
The lead owns review round 5 and the image gates.

| report | first words | correction |
| --- | --- | --- |
| Spec | before each asset and after each digest | Two-item import and export tests count digests and resolver calls. Hand rows m409, m410, m447 and m448 fail. |
| Spec | Each shot | A valid first shot and an invalid second shot give the literal indexed error. Hand rows m411 and m412 fail. |
| Spec | rejects an invalid path before | The store holds the invalid path. The test checks that key and the rejection. The clause states the public result. |
| Spec | Tool limits omit added members | The audit names the limit on added members. The 099 clause lists nine types. SVG, file protocol and geojsonx tests kill m413 to m415. |
| Spec | Lines 89, 102 and 103 | The audit uses the rerun after pass 4 for that command. |
| Spec | 367 rows and 166 rows | Both figures have Pass 2 labels. |
| Spec | Killer titles of extension rows | The script checks all 260 old rows and 711 extension rows against the result files that the lead saved. |
| STE | the final rerun | The audit and evidence distinguish the rerun after pass 4 from the final rerun after pass 5. |
| STE | for an absent source | The labels use actual test titles. The Old records keep the full title history. |
| STE | probe-extension.txt objects | The probe uses Objects that the caller supplies and 52428800. It states that each mutation in the table is equivalent. |
| STE | the segment read | Titles and clauses use disposal and finite verb clauses. The Share work requirement uses file limits. |
| STE | listener setup | Titles and clauses use listener registration, source signal event and source signal state where they concern a signal. |
| STE | The extension, last sweep | The documents use extension run, Extension check 4, final rerun, Campaign 2 phase 1 and Extension check. |
| STE | changes | The audit and design use mutations for code in the mutation commands. |
| STE | The source event reads its reason | The session reads the signal reason. The success and error tests keep separate titles. Other titles state the exact check or result. |
| STE | base64 alphabet and passive voice | The clauses use with + and /. The evidence and probe table use active verbs and absent. |
| STE | accepts z and Z | The clause states _ and - at the start. The proposal states A later asset without a byte length. |

### New tests and loop checks

The tests add 16 backfill tests and 10 sharing tests.
The new tags stay within director-076 to director-110.
The loop table lists 52 collection traversals in six of the seven source files.
No loop row has an open gap or Known limit.

The file lifetime.js has no collection loop.
The new rows are m409 to m448.
The automatic tool classes stay unchanged, so this pass needs no tool extension command.

### Test and coverage commands

The final command below records each output and its first command line.
The test run follows the two-chunk correction.
It runs one test file per process and one coverage file at a time.
It sets NODE_OPTIONS to --test-isolation=none for each Node process.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass6/checks.py
```

| test file | tests | passed | time in milliseconds |
| --- | ---: | ---: | ---: |
| backfill | 423 | 423 | 1763.049739 |
| packs | 12 | 12 | 7053.17065 |
| sharing | 222 | 222 | 18743.091254 |

The three test commands use no forced exit.
All 657 tests pass.

| source file | line % | branch % | function % |
| --- | ---: | ---: | ---: |
| packs-manifest | 100.00 | 100.00 | 100.00 |
| packs-geojson | 100.00 | 100.00 | 100.00 |
| packs-session | 100.00 | 100.00 | 100.00 |
| packs-source | 100.00 | 100.00 | 100.00 |
| sharing-bundle | 100.00 | 100.00 | 100.00 |
| sharing-lifetime | 100.00 | 100.00 | 100.00 |
| sharing-preview | 100.00 | 100.00 | 100.00 |

The coverage values are host measurements, not image gate results.
The recorded coverage commands are:

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/manifest.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/geojson.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/session.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/source.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/bundle.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/lifetime.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/preview.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

### Killer title source

The rows use the first failed test of the final rerun of the lead after pass 5.
The source is director-3-final2/results-mutants.json and results-mutants-new.json.
The regeneration corrects 51 old and 123 extension killer labels.
The final comparison checks all 260 old rows and 711 extension rows.
It gives 840 killed, 127 equivalent and four Known limit rows, with zero title differences.
Those counts describe the saved lead command, not a new automatic command in pass 6.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass6/docs.py
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass6/check-killers.py
```

### Stopped command

The initial hand attempt stopped before its end because the loop audit added more tests.
It gives no complete mutation result.
The first backfill command stopped at a syntax error.
The corrected command passes all 422 backfill tests.
The first spec lint command reported an error for an inline code span of six words.
The later command puts that text in prose and passes.

### Checks before the complete hand result

The final title scan checks 488 titles with zero banned forms.
The predispatch output contains only eight Old title records.
The host format helper writes and checks 1158 files.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-work && taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```

The result of the complete hand command follows.
The lead owns image gates, ratchet, review round 5 and any commit.
This pass runs no commit, merge or push command.

### Two-chunk correction

Complete hand check 1 finishes with 446 killed rows and only m172 and m389 as survivors.
The next test supplies two stream chunks and asserts that cancellation stops the second chunk.
Row m445 now selects that test.
Complete hand check 2 checks the complete hand list after this test.

### Scenario and title checks

The hash command uses the project spec parser.
It finds 35 scenario IDs and 26 changed hashes.
Each changed hash has a changed test tag in the diff.
The final test output contains 657 different leaf titles.
No leaf title occurs twice.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass6/check-delta.mjs
```

### Final complete hand result

Complete hand check 2 checks 448 rows after the two-chunk correction.
It gives 446 killed rows and only m172 and m389 as survivors.
Each killed row names a failed repository test.
The command skips no row and gives no timeout.
All 40 new rows give a failed repository test.

The mutation report keeps the final output without spaces at line ends.
The first line of hand-final.log names the command.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none PYTHONUNBUFFERED=1 taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-3 /home/ianblenke/docker/gev-tools/director-3/muts.json
```

### Final scope result

The final scope script checks all seven production files against both source commits.
All seven files match byte for byte.

The scope script checks all 448 old spans and each supplied test pattern.
Each span occurs once, and each supplied pattern matches a current leaf title.
Each pattern has a backslash before every space.
In pass 6 the worker changes two test files and ten change documents only.
The worker changes no review report, main spec, trace ledger or QA script.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass6/finish.py
```

The lead owns the image gates, ratchet, review round 5 and any commit.
This pass does not run those commands.

The first scope command stops before its complete report because a row has no optional pattern.
It gives no complete scope result.
The corrected command checks each supplied pattern and passes.

## Pass 7 title corrections

Source commit: `0bf26a8ec20c1f6685f25e4f7ec57bb113204822`.

```text
Old: [director-076] The path type check comes before the segment access
New: [director-076] The validator rejects the path type before it reads a segment
```

```text
Old: [director-089] The source listener and state check come before it reads the work promise
New: [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order
```

```text
Old: [director-096] The header limit check comes before it reads the first stream chunk
New: [director-096] The source checks the header limit before it reads the first stream chunk
```

```text
Old: [director-097] The source signal check comes before it reads the stream chunk
New: [director-097] The source checks the signal before it reads the stream chunk
```

```text
Old: [director-082] The manifest rejects the second shot reference
New: [director-082] The validator rejects a reference in the second shot
```

```text
Old: [director-094] The directory rejects the file protocol
New: [director-094] The factory rejects the file protocol
```

```text
Old: [director-077 director-082] The manifest validates the second data pack
New: [director-077 director-082] The validator rejects an invalid second data pack
```

```text
Old: [director-081] The manifest uses the second anchor
New: [director-081] The validator returns without an error for a reference to the second anchor
```

```text
Old: [director-082] The manifest checks the second reference ID
New: [director-082] The validator rejects an unknown second reference ID
```

```text
Old: [director-088] The session validates the second data pack before source access
New: [director-088] The session rejects an invalid second data pack before the source call
```

```text
Old: [director-081 director-093] The session uses the second anchor
New: [director-081 director-093] The session returns true for a reference to the second anchor
```

```text
Old: [director-076] The path rejects its second segment
New: [director-076] The validator rejects an invalid second path segment
```

```text
Old: [director-085] The position rejects its second nonfinite coordinate
New: [director-085] The decoder rejects an invalid second coordinate
```

```text
Old: [director-098] The plain project JSON returns an empty asset map
New: [director-098] The import returns an empty asset map for plain project JSON
```

```text
Old: [director-105] The byte store rejects an unsafe path that it holds
New: [director-105] The store rejects an invalid path that it holds for the byte store
```

```text
Old: [director-106] The share helpers give bundles the larger budget
New: [director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes
```

```text
Old: [director-099] The bundle helpers reject an extra top field
New: [director-099] The import rejects an extra top-level field
```

```text
Old: [director-102] The absent digest stops its check after one field read
New: [director-102] The export reads an absent declared digest once before it writes the digest
```

```text
Old: [director-107] The file signal check follows the text result
New: [director-107] The share helpers check the signal after the text promise settles and return the project
```

```text
Old: [director-107] The helper attaches its listener before it reads the work promise
New: [director-107] The helper attaches its listener before it reads the work promise
```

```text
Old: [director-108 director-110] The preview reaches the second scene and shot
New: [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
```

```text
Old: [director-108] The preview reaches the second data pack
New: [director-108] The preview lists the second data pack
```

```text
Old: [director-107] The ${mode} stops before the second asset
New: [director-107] The import stops before the second digest
New: [director-107] The export stops before the second resolver call
```

### Further title corrections in pass 7

```text
Old: [director-079] The digest check comes before access to the placement
New: [director-079] The validator checks the digest before it reads the placement
```

```text
Old: [director-080] The height reference check comes before the bounds check
New: [director-080] The validator checks the height reference before it checks the bounds and rejects the call
```

```text
Old: [director-080] The bounds array check comes before access to the length
New: [director-080] The validator checks the bounds array before it reads the length
```

```text
Old: [director-080] The bounds length check comes before each coordinate check
New: [director-080] The validator checks the bounds length before it checks each coordinate and rejects the call
```

```text
Old: [director-082] The list check comes before access to the anchors
New: [director-082] The validator checks the list before it reads the anchors
```

```text
Old: [director-077 director-082] The declaration check comes before the duplicate ID check
New: [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call
```

```text
Old: [director-088 director-091] The new list check follows old resource disposal
New: [director-088 director-091] The session checks the new list after it disposes old resources
```

```text
Old: [director-088] The list check comes before access to the anchors
New: [director-088] The session checks the list before it reads the anchors
```

```text
Old: [director-088] The declaration check comes before access to the caller signal
New: [director-088] The session checks declarations before it reads the caller signal
```

```text
Old: [director-089] The final signal check comes before timer removal and the ready state
New: [director-089] The session checks the signal before it removes the timer and reports the ready state
```

```text
Old: [director-090 director-093] The source signal error comes before access to the bytes
New: [director-090 director-093] The session rejects the signal error before it reads bytes
```

```text
Old: [director-093] The total byte check comes before access to the digest
New: [director-093] The session checks total bytes before it reads the digest
```

```text
Old: [director-095] The path check comes before the caller signal check
New: [director-095] The source checks the path before it checks the caller signal and rejects the call
```

```text
Old: [director-096] The header limit check comes before the source reads the first stream chunk
New: [director-096] The source checks the header limit before it reads the first stream chunk
```

```text
Old: [director-090] The session checks its source signal before byte access and after renderer work
New: [director-090] The session checks its source signal before it reads bytes and after renderer work
```

```text
Old: [director-090] The session checks destroyed state after signal access
New: [director-090] The session checks destroyed state after it reads the signal
```

```text
Old: [director-090] The session sees destruction during caller signal access after a source error
New: [director-090] The load call returns false when the caller signal destroys the session after a source error
```

```text
Old: [director-093] The session checks byte type before length access
New: [director-093] The session checks byte type before it reads the length
```

```text
Old: [director-079] The digest type check comes before text conversion
New: [director-079] The validator checks the digest type before it converts text and rejects the call
```

```text
Old: [director-080] The edge order check starts with west and east
New: [director-080] The validator compares west with east before it compares south with north
```

```text
Old: [director-082] The distinct reference check comes before the search for known IDs
New: [director-082] The validator rejects duplicate references before it searches for known IDs
```

```text
Old: [director-090] The detached handle check does not read the source signal state
New: [director-090] The cleared session returns false and does not read the source signal state
```

```text
Old: [director-099] The base64 type check comes before text conversion
New: [director-099] The import checks the base64 type before it converts text and rejects the call
```

```text
Old: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes
New: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets
```

```text
Old: [director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file
New: [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
```

```text
Old: [director-106] The share helpers check a signal after text access
New: [director-106] The share helpers call throwIfAborted three times and return the project
```

```text
Old: [director-102] The absent digest stops its check after it reads one field
New: [director-102] The export reads an absent declared digest once before it writes the digest
```

```text
Old: [director-098 director-107] The share signal check comes before the text type check
New: [director-098 director-107] The import checks the signal before it checks the text type and rejects the call
```

```text
Old: [director-099 director-107] The asset signal check comes before its field check
New: [director-099 director-107] The import checks the signal before it checks asset fields and rejects the call
```

```text
Old: [director-100 director-107] The import signal check comes before the digest comparison
New: [director-100 director-107] The import checks the signal before it compares digests
```

```text
Old: [director-106] The file limit check comes before access to the signal
New: [director-106] The share helpers check the file limit before they read the signal and reject the invalid input
```

```text
Old: [director-106 director-107] The file signal check comes before text access
New: [director-106 director-107] The share helpers check the signal before they read text and reject the invalid input
```

```text
Old: [director-107] The file signal check follows the text promise
New: [director-107] The share helpers check the signal after the text promise settles and return the project
```

```text
Old: [director-102] The export checks integrity before access to the filename
New: [director-102] The export checks integrity before it reads the filename
```

```text
Old: [director-102] The export count check comes before the next resolver call
New: [director-102] The export checks the asset count before the next resolver call and rejects the call
```

```text
Old: [director-102 director-107] The export signal check comes before ${label}
New: [director-102 director-107] The export checks the signal before it checks declared integrity and rejects the call
```

```text
Old: [director-105] The store signal check comes before the path check
New: [director-105] The store checks the signal before it checks the path and rejects the call
```

```text
Old: [director-107] The helper removes its listener before access to the reason
New: [director-107] The helper removes its listener before it reads the reason
```


## Pass 7

Source commit: `0bf26a8ec20c1f6685f25e4f7ec57bb113204822`.
Base commit: `290b5d2`.

The first words identify findings in the unchanged round 5 reports.
The correction does not change production code.
The lead runs image gates, ratchet and review round 6.

| finding | first words | correction |
| --- | --- | --- |
| Spec | Without layer IDs | A shot names traffic and ships. The test expects both absent layers. Rows m449 to m451 narrow the filter result. |
| Spec | The registry copies | Two sources and two renderers serve GeoJSON and image data packs. Rows m452 to m454, m463 and m464 narrow registry entries or select the first renderer. |
| Spec | The table covers each | The table has 52 traversals in six source files. Byte mappers have positive digest and byte tests. Rows m465 to m479 cover more collection operations. |
| Spec | The closed-sets table | The table lists eight allowed-field lists. Tests reject script and adapters separately. Rows m455 to m462 add script. |
| S1 | Titles and clauses use | The files use constructor mutations and exact mutations. Finite clauses state when the source reads chunks and when the export reads a field. |
| S2 | The loop table covers | All five documents state 52 traversals in six source files. The file lifetime.js has no collection loop. |
| S3 | The preview includes | The clause separates counts from the data pack list. Tests and their echoes name the second scene, shot and data pack. |
| S4 | The manifest rejects the second | The title states a reference in the second shot. The other title states an unknown second reference ID. |
| S5 | The final rerun is | The pass 4 design names the rerun after pass 4. Final rerun names the command after pass 5. |
| S6 | 3514 Campaign | The audit states kills after each phase and names Complete hand check 2. The stream paragraph states cancellation before the second chunk. |
| S7 | The verbs validates | Titles state rejection, acceptance, counts or list results. Echoes follow those titles. |
| S8 | check comes before it | The source registers its listener and checks its state before it reads work. The parser returns an empty map for plain project JSON. |
| S9 | The validator checks | The clause states rejection of the invalid second declaration. The source rejects the file protocol. After cancellation before the second chunk, the source reads only the first chunk. |
| S10 | give bundles the larger | The tests use larger file limit and extra top-level field. All echoes use those titles. |
| S11 | `MIME types` | Documents use media type and delete the unused definitions. The same term applies to old tagged titles. |
| S12 | before source access | Titles use source call, invalid path, text promise, second digest and second resolver call. Documents use killer titles. |
| S13 | The extension run checks | The evidence gives input counts, test counts, past events, clear subjects and the pass 6 scope. It names a failed repository test for each killed row. |
| S14 | This additive edits limit | The audit states the limit on added members with articles and separate sentences. The allowed-field rows extend that limit. |
| S15 | both 52428800 checks | The probe states character and byte units and the JSON parse. |
| S16 | Correct the command names | Tasks 9.11 and 9.12 name run names and the final rerun after pass 5. |

### Prose gate constraint

The first clause command stopped at the 28-word preview sentence.
It gave no passed prose result.
The requested sentence exceeds the 25-word prose limit.
The correction uses two sentences with the same result.
The correction does not change the gate.

### Traversal scope

The loop table lists 52 collection traversals in six of the seven source files.
The file lifetime.js has no collection loop.
The automatic tool classes stay unchanged.
This pass needs no automatic tool command for new classes.

### Test additions

The worker adds seven backfill tests and six sharing tests.
They use only the scenario IDs of this change.
The hand list adds 31 rows, m449 to m479.
Each new row must give a failed repository test before this pass ends.

### Final title corrections in pass 7

```text
Old: [director-096] The stream uses absent MIME default
New: [director-096] The source returns an empty media type when the header is absent
```

```text
Old: [director-096] The stream normalizes MIME text
New: [director-096] The source returns lowercase media type text without parameters
```

```text
Old: [director-090] The session validates the detached handle without the source signal state
New: [director-090] The cleared session returns false and does not read the source signal state
```

```text
Old: [director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
New: [director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

```text
Old: [director-099] The bundle rejects unsupported MIME
New: [director-099] The import rejects an unsupported media type
```

```text
Old: [director-101] The export reaches the second scene
New: [director-101] The export includes the asset of the second scene and returns bundle text
```


### Predispatch tool limits

The predispatch helper reads each line separately.
It treats a line inside a JavaScript fence as prose.
The code identifiers `MIME` and `SHA-256` give abbreviation reports in the mutation spans.
The identifiers are part of unchanged production spans.
The pass does not change that span or the helper.

The helper also reports run as a noun in task 9.11.
The task uses the exact wording that the lead gives.
The pass keeps that wording.
The other reports concern Old title records.

### Final host tests and coverage in pass 7

Source commit: `0bf26a8ec20c1f6685f25e4f7ec57bb113204822`.

The final command follows all test title corrections and the format command.
It runs each test file separately without a forced exit.
It measures each source file separately.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass7/checks.py
```

| test file | passed | time in milliseconds |
| --- | ---: | ---: |
| backfill | 430 | 1811.553476 |
| packs | 12 | 6902.033912 |
| sharing | 228 | 18520.008722 |

All 670 tests pass.

| source file | line % | branch % | function % |
| --- | ---: | ---: | ---: |
| packs-manifest | 100.00 | 100.00 | 100.00 |
| packs-geojson | 100.00 | 100.00 | 100.00 |
| packs-session | 100.00 | 100.00 | 100.00 |
| packs-source | 100.00 | 100.00 | 100.00 |
| sharing-bundle | 100.00 | 100.00 | 100.00 |
| sharing-lifetime | 100.00 | 100.00 | 100.00 |
| sharing-preview | 100.00 | 100.00 | 100.00 |

The coverage values are host measurements.
This pass runs no image gate or Node 24.14.0 command.
The new tests use APIs that Node 24.14.0 supports.
No new test uses getTestContext.

The first line of each log gives its command.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/manifest.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/geojson.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/session.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/packs/source.js --test-coverage-exclude=**/*.test.mjs src/director/packs/backfill.test.mjs src/director/packs/packs.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/bundle.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/lifetime.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 node --test --experimental-test-coverage --test-coverage-include=src/director/sharing/preview.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

### Scenario and table checks in pass 7

```json
{
  "sourceCommit": "0bf26a8ec20c1f6685f25e4f7ec57bb113204822",
  "scenarios": 35,
  "changed": [
    "director-076",
    "director-077",
    "director-079",
    "director-080",
    "director-082",
    "director-088",
    "director-089",
    "director-090",
    "director-091",
    "director-093",
    "director-094",
    "director-096",
    "director-097",
    "director-099",
    "director-102",
    "director-105",
    "director-106",
    "director-107",
    "director-108"
  ],
  "withoutChangedTag": []
}
```

```json
{
  "command": "compare.py",
  "sourceCommit": "0bf26a8ec20c1f6685f25e4f7ec57bb113204822",
  "traversals": 52,
  "files": 6,
  "documents": 5
}
```

```json
{
  "sourceCommit": "0bf26a8ec20c1f6685f25e4f7ec57bb113204822",
  "rows": 479,
  "leafTitles": 670,
  "duplicateTitles": 0,
  "patternsMatch": 477,
  "unchangedProductionFiles": 7
}
```

```json
{
  "sourceCommit": "0bf26a8ec20c1f6685f25e4f7ec57bb113204822",
  "rows": 31,
  "validCode": 31
}
```

```json
{
  "old": 260,
  "extension": 711,
  "killed": 840,
  "equivalent": 127,
  "knownLimit": 4,
  "corrected": []
}
```

The scenario hash command finds 19 changed hashes and no hash without a changed test tag.
The preflight command finds 670 unique leaf titles and 477 valid supplied patterns.
The two other hand rows have no optional pattern.
The row syntax command parses all 31 new mutations.
The label command checks all 971 automatic table rows against the saved lead results.
It finds no label difference.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass7/check-delta.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass7/compare.py
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass7/preflight.py
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass7/check-rows.mjs
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass7/traversals.mjs
```

The syntax tree search lists 66 collection operations.
Eight constructors have no input collection, and one Set is the closed media type set.
The table groups splice and reverse with their handle loop.
It groups layer Set construction with spread, and values with spread in the two byte totals.
These groups give the 52 table rows.

### First complete hand command in pass 7

The first complete command checks 479 rows.
It gives 476 killed rows and three survivors: m172, m246 and m389.
Row m246 has a pattern that does not match the title in packs.test.mjs.
The pass corrects that title and starts another complete command.
The first command gives no result for the final tree.

### Searches for the same faults in pass 7

The broad grep covers the change documents, all three test files and mutation names.
It excludes review reports.
The saved output also includes verbs, command options, code spans, report quotations and Old title records.
Those forms do not state a new prose noun.
The fault-form search finds no current instance outside those records.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass7/search-final.py
```

The script uses grep with -nE and the words below.
The complete broad output is noun-search.log in the pass7 scratch folder.

```text
read|write|check|setup|cleanup|changes|access
```

```json
{
  "sourceCommit": "0bf26a8ec20c1f6685f25e4f7ec57bb113204822",
  "filesSearched": 42,
  "broadSearchLines": 378,
  "currentFaultForms": 0,
  "correctionSearches": 20
}
```

The following grep outputs show each correction after the edits.

```text
Finding: S1
Command: grep -nE constructor mutations openspec/changes/backfill-director-packs-sharing/design.md
128:It also adds default shapes, destructured fields, spreads, template values, regex quantifiers and constructor mutations.
Finding: S1
Command: grep -nE exact mutations openspec/changes/backfill-director-packs-sharing/evidence.md
2251:The extension run keeps all 3849 old IDs and exact mutations.
3011:| S1 | Titles and clauses use | The files use constructor mutations and exact mutations. Finite clauses state when the source reads chunks and when the export reads a field. |
Finding: S1 S9
Command: grep -nE reads the first stream chunk|before each time|after it reads one field openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
251:- **AND** The source checks the header byte limit before it reads the first stream chunk.
260:- **AND** The source checks its signal before each time the source reads a stream chunk.
329:- **AND** The export stops when the digest is absent after it reads one field.
Finding: S2
Command: grep -nE 52 collection traversals|lifetime.js has no openspec/changes/backfill-director-packs-sharing/audit.md
408:The loop table lists 52 collection traversals in six of the seven source files.
409:The file lifetime.js has no collection loop.
Finding: S3
Command: grep -nE The preview counts the second scene openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
407:- **AND** The preview counts the second scene and the second shot, and lists the second data pack. The preview adds the bytes of the second asset to the byte total.
Finding: S4 S7
Command: grep -nE reference in the second shot|invalid second data pack|reference to the second anchor|invalid second path|invalid second coordinate src/director/packs/backfill.test.mjs
3141:test('[director-082] The manifest rejects a reference in the second shot', () => {
3150:test('[director-077 director-082] The manifest rejects an invalid second data pack', () => {
3153:test('[director-081] The manifest accepts a reference to the second anchor', () => {
3168:test('[director-088] The session rejects an invalid second data pack before the source call', async () => {
3176:test('[director-081 director-093] The session accepts a reference to the second anchor', async () => {
3182:test('[director-076] The validator rejects an invalid second path segment', () => {
3185:test('[director-085] The decoder rejects an invalid second coordinate', () => {
Finding: S5
Command: grep -nE rerun after pass 4 openspec/changes/backfill-director-packs-sharing/design.md
119:The rerun after pass 4 is the lead test of all 3849 mutations.
Finding: S6
Command: grep -nE 3514 kills|checks the signal before the second chunk openspec/changes/backfill-director-packs-sharing/audit.md
48:That rule gives 3514 kills after Campaign 2 phase 1 and 3589 kills after phase 2.
485:The stream test supplies two chunks and stops when it checks the signal before the second chunk.
Finding: S8
Command: grep -nE parser returns an empty asset map src/director/sharing/sharing.test.mjs
56:test('[director-098] The parser returns an empty asset map for plain project JSON', async () => {
Finding: S10
Command: grep -nE larger file limit|extra top-level field src/director/sharing/sharing.test.mjs
1099:test('[director-106] The share helpers give bundles the larger file limit', async () => {
2028:test('[director-099] The bundle helpers reject an extra top-level field', async () => {
Finding: S11
Command: grep -nE accepted media type set openspec/changes/backfill-director-packs-sharing/design.md
157:The accepted media type set contains exactly nine types.
Finding: S12
Command: grep -nE invalid path|text promise settles|second.*digest.*resolver call src/director/sharing/sharing.test.mjs
347:test('[director-105] The byte store rejects an invalid path that it holds', () => {
2406:test('[director-107] The reader checks the signal after the text promise settles', async () => {
2658:  test(`[director-107] The ${mode} stops before the second ${mode === 'import' ? 'digest' : 'resolver call'}`, async () => {
Finding: S13
Command: grep -nE Extension checks 1 to 4|16 backfill tests|In pass 6 the worker openspec/changes/backfill-director-packs-sharing/evidence.md
2256:Extension checks 1 to 4 have inputs of 367, 199, 104 and 321 mutations.
2534:The tests add 16 backfill tests and 10 sharing tests.
2669:In pass 6 the worker changes two test files and ten change documents only.
Finding: S14
Command: grep -nE limit on additive edits openspec/changes/backfill-director-packs-sharing/audit.md
234:This limit on additive edits covers the nine media types at bundle.js:11 to 21.
Finding: S15
Command: grep -nE 52428800-character openspec/changes/backfill-director-packs-sharing/evidence/probe-extension.txt
398:The private input declaration has no value or callback. Signal checks, type checks, the 52428800-character check, the 52428800-byte check and the JSON parse keep their order for every text length.
Finding: S16
Command: grep -nE 9\.11|9\.12 openspec/changes/backfill-director-packs-sharing/tasks.md
1467:- [x] 9.11 Correct the run names in audit.md and evidence.md.
1468:- [x] 9.12 Regenerate the killer titles from the final rerun after pass 5.
Finding: Spec Without layer IDs
Command: grep -nE both absent named layers|traffic.*ships src/director/sharing/sharing.test.mjs
1245:  f.scenes[0].shots.push({ id: 'b', layers: { traffic: true, ships: false } });
1477:  f.scenes[0].shots[0].layers = { traffic: false, ships: false };
2846:test('[director-110] The preview reports both absent named layers without layer IDs', () => {
2848:  project.scenes[0].shots[0].layers = { traffic: true, ships: true };
2851:    ['traffic', 'ships'],
2871:  project.scenes[0].shots[0].layers = { traffic: true, ships: true };
2875:      { layerIds: ['traffic', 'ships'] },
Finding: Spec The registry copies
Command: grep -nE both registered sources and both renderers src/director/packs/backfill.test.mjs
3225:test('[director-088 director-093] The session calls both registered sources and both renderers', async () => {
Finding: Spec The table covers each
Command: grep -nE 52 collection traversals|Preview absent layer filter|registry|digest bytes|Base64 input bytes openspec/changes/backfill-director-packs-sharing/audit.md
408:The loop table lists 52 collection traversals in six of the seven source files.
448:| Source registry entries | src/director/packs/session.js:41 | [director-088 director-093] The session calls both registered sources and both renderers | m452 |
449:| Source registry Map | src/director/packs/session.js:41 | [director-088 director-093] The session calls both registered sources and both renderers | m463 |
450:| Renderer registry entries | src/director/packs/session.js:42 | [director-088 director-093] The session calls both registered sources and both renderers | m453 |
451:| Renderer registry Map | src/director/packs/session.js:42 | [director-088 director-093] The session calls both registered sources and both renderers | m464 |
455:| Session digest bytes | src/director/packs/session.js:124 | [director-093] The session checks exact bytes and digest | m477 |
456:| Bundle digest bytes | src/director/sharing/bundle.js:26 | [director-099] The import accepts a literal digest for three distinct bytes | m478 |
457:| Base64 input bytes | src/director/sharing/bundle.js:46 | [director-099] The import accepts a literal digest for three distinct bytes | m479 |
466:| Preview absent layer filter | src/director/sharing/preview.js:36 | [director-110] The preview reports both absent named layers without layer IDs | m449, m450, m451 |
Finding: Spec The closed-sets table
Command: grep -nE fields.*manifest.js|fields.*bundle.js|m455 to m462 openspec/changes/backfill-director-packs-sharing/audit.md
224:| Data pack fields | manifest.js:34-43 | id, version, format, source, attribution, placement, byteLength, sha256 |
225:| Source fields | manifest.js:48 | adapter, path |
226:| Attribution fields | manifest.js:51 | text, license, url |
227:| Image placement fields | manifest.js:84-92 | bounds, height, altitudeReference |
228:| Media placement fields | manifest.js:84-92 | anchorId |
229:| GeoJSON placement fields | manifest.js:84-92 | altitudeReference |
230:| Bundle fields | bundle.js:78 | format, version, project, assets |
231:| Asset fields | bundle.js:86 | path, mimeType, base64, sha256 |
237:Rows m455 to m462 add script to each allowed-field list.
```

### Final complete hand result in pass 7

Source commit: `0bf26a8ec20c1f6685f25e4f7ec57bb113204822`.

Complete hand check 3 checks all 479 rows after the final title corrections.
It gives 477 killed rows and only m172 and m389 as survivors.
All 31 new rows give a failed repository test.
The command skips no row and gives no timeout.
The first log line gives the command.
The mutation report records the complete output.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none PYTHONUNBUFFERED=1 taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-3 /home/ianblenke/docker/gev-tools/director-3/muts.json
```

### Final source scope in pass 7

The final scope command compares all seven production files with commits 0bf26a8e and 290b5d2.
All seven files match byte for byte after the complete hand command.
It also checks each old span and the allowed changed paths.
The worker changes no review report, main spec, trace ledger or QA script.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass7/finish.py
```

```json
{
  "sourceCommit": "0bf26a8ec20c1f6685f25e4f7ec57bb113204822",
  "rows": 479,
  "killed": 477,
  "survivors": [
    "m172",
    "m389"
  ],
  "newRows": 31,
  "newRowsKilled": 31,
  "skipped": 0,
  "timeout": 0,
  "productionFilesUnchanged": 7,
  "changedFiles": [
    "openspec/changes/backfill-director-packs-sharing/audit.md",
    "openspec/changes/backfill-director-packs-sharing/checks.md",
    "openspec/changes/backfill-director-packs-sharing/design.md",
    "openspec/changes/backfill-director-packs-sharing/evidence.md",
    "openspec/changes/backfill-director-packs-sharing/evidence/probe-extension.txt",
    "openspec/changes/backfill-director-packs-sharing/evidence/probe-feature-order.txt",
    "openspec/changes/backfill-director-packs-sharing/mutations.md",
    "openspec/changes/backfill-director-packs-sharing/probe-ranges.md",
    "openspec/changes/backfill-director-packs-sharing/proposal.md",
    "openspec/changes/backfill-director-packs-sharing/specs/director/spec.md",
    "openspec/changes/backfill-director-packs-sharing/survivors.md",
    "openspec/changes/backfill-director-packs-sharing/tasks.md",
    "src/director/packs/backfill.test.mjs",
    "src/director/packs/packs.test.mjs",
    "src/director/sharing/sharing.test.mjs"
  ]
}
```

### Final prose and format commands in pass 7

The prose lint gives zero errors.
The title scan checks 494 titles and gives zero banned forms.
The format command checks 1158 files.
The git whitespace command gives no output.
The production file comparison gives seven unchanged files.

The predispatch command gives only Old records, code identifiers and the exact task 9.11 wording.
The code fence limit applies to `MIME` and `SHA-256` in mutation spans.
The pass keeps the production spans, Old records and required task text.
The pass does not change the helper.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-work && taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-3 && git diff --check
```

```text
ABBR     evidence.md:3053  "MIME" is not defined in this file
ABBR     mutations.md:3033  "MIME" is not defined in this file
ABBR     mutations.md:14501  "SHA" is not defined in this file
NOUN?    evidence.md:858  verb used as a noun: "abort"  Old: an abort between renderer settlement and continuation cannot leak the returned resource
NOUN?    evidence.md:969  verb used as a noun: "abort"  Old: [director-090] an abort between renderer settlement and continuation cannot leak the returned resource
NOUN?    evidence.md:3341  verb used as a noun: "run"  1467:- [x] 9.11 Correct the run names in audit.md and evidence.md.
NOUN?    tasks.md:1467  verb used as a noun: "run"  - [x] 9.11 Correct the run names in audit.md and evidence.md.
WORD     evidence.md:809  "explicit"  Old: image bounds and media anchor references are explicit and validated
WORD     evidence.md:811  "preserves"  Old: GeoJSON preserves stable geometry IDs but never properties or remote style hints
WORD     evidence.md:813  "malformed"  Old: bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity
WORD     evidence.md:828  "explicit"  Old: image bounds and media anchor references are explicit and validated
WORD     evidence.md:838  "preserves"  Old: GeoJSON preserves stable geometry IDs but never properties or remote style hints
WORD     evidence.md:883  "malformed"  Old: bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity

== summary: {'WORD': 6, 'NOUN?': 4, 'ABBR': 3}
```

The stat filter leaves the summary for the three test files.
That summary is not a production file difference.
The name output below lists only the three test files.
The byte comparison in finish.py also finds no production difference.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && git diff 0bf26a8e --name-only -- src/director
```

```text
src/director/packs/backfill.test.mjs
src/director/packs/packs.test.mjs
src/director/sharing/sharing.test.mjs
```

### Commands outside this pass

The pass runs no container, image gate, ratchet or new review round.
The lead runs those commands.
The pass runs no automatic mutation command because the tool classes stay unchanged.
The pass runs no merge or push command.
The pass commits the correction in the clone.

### Title corrections in pass 8

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

```text
Old: [director-076] The asset path accepts A in both character positions
New: [director-076] The validator returns without an error for A in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts B in both character positions
New: [director-076] The validator returns without an error for B in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts C in both character positions
New: [director-076] The validator returns without an error for C in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts D in both character positions
New: [director-076] The validator returns without an error for D in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts E in both character positions
New: [director-076] The validator returns without an error for E in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts F in both character positions
New: [director-076] The validator returns without an error for F in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts G in both character positions
New: [director-076] The validator returns without an error for G in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts H in both character positions
New: [director-076] The validator returns without an error for H in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts I in both character positions
New: [director-076] The validator returns without an error for I in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts J in both character positions
New: [director-076] The validator returns without an error for J in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts K in both character positions
New: [director-076] The validator returns without an error for K in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts L in both character positions
New: [director-076] The validator returns without an error for L in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts M in both character positions
New: [director-076] The validator returns without an error for M in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts N in both character positions
New: [director-076] The validator returns without an error for N in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts O in both character positions
New: [director-076] The validator returns without an error for O in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts P in both character positions
New: [director-076] The validator returns without an error for P in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts Q in both character positions
New: [director-076] The validator returns without an error for Q in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts R in both character positions
New: [director-076] The validator returns without an error for R in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts S in both character positions
New: [director-076] The validator returns without an error for S in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts T in both character positions
New: [director-076] The validator returns without an error for T in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts U in both character positions
New: [director-076] The validator returns without an error for U in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts V in both character positions
New: [director-076] The validator returns without an error for V in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts W in both character positions
New: [director-076] The validator returns without an error for W in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts X in both character positions
New: [director-076] The validator returns without an error for X in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts Y in both character positions
New: [director-076] The validator returns without an error for Y in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts Z in both character positions
New: [director-076] The validator returns without an error for Z in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts a in both character positions
New: [director-076] The validator returns without an error for a in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts b in both character positions
New: [director-076] The validator returns without an error for b in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts c in both character positions
New: [director-076] The validator returns without an error for c in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts d in both character positions
New: [director-076] The validator returns without an error for d in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts e in both character positions
New: [director-076] The validator returns without an error for e in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts f in both character positions
New: [director-076] The validator returns without an error for f in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts g in both character positions
New: [director-076] The validator returns without an error for g in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts h in both character positions
New: [director-076] The validator returns without an error for h in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts i in both character positions
New: [director-076] The validator returns without an error for i in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts j in both character positions
New: [director-076] The validator returns without an error for j in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts k in both character positions
New: [director-076] The validator returns without an error for k in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts l in both character positions
New: [director-076] The validator returns without an error for l in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts m in both character positions
New: [director-076] The validator returns without an error for m in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts n in both character positions
New: [director-076] The validator returns without an error for n in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts o in both character positions
New: [director-076] The validator returns without an error for o in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts p in both character positions
New: [director-076] The validator returns without an error for p in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts q in both character positions
New: [director-076] The validator returns without an error for q in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts r in both character positions
New: [director-076] The validator returns without an error for r in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts s in both character positions
New: [director-076] The validator returns without an error for s in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts t in both character positions
New: [director-076] The validator returns without an error for t in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts u in both character positions
New: [director-076] The validator returns without an error for u in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts v in both character positions
New: [director-076] The validator returns without an error for v in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts w in both character positions
New: [director-076] The validator returns without an error for w in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts x in both character positions
New: [director-076] The validator returns without an error for x in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts y in both character positions
New: [director-076] The validator returns without an error for y in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts z in both character positions
New: [director-076] The validator returns without an error for z in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 0 in both character positions
New: [director-076] The validator returns without an error for 0 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 1 in both character positions
New: [director-076] The validator returns without an error for 1 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 2 in both character positions
New: [director-076] The validator returns without an error for 2 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 3 in both character positions
New: [director-076] The validator returns without an error for 3 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 4 in both character positions
New: [director-076] The validator returns without an error for 4 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 5 in both character positions
New: [director-076] The validator returns without an error for 5 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 6 in both character positions
New: [director-076] The validator returns without an error for 6 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 7 in both character positions
New: [director-076] The validator returns without an error for 7 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 8 in both character positions
New: [director-076] The validator returns without an error for 8 in both character positions for the asset path
```

```text
Old: [director-076] The asset path accepts 9 in both character positions
New: [director-076] The validator returns without an error for 9 in both character positions for the asset path
```

```text
Old: [director-079] The manifest accepts each hexadecimal digest character
New: [director-079] The validator returns without an error for each hexadecimal digest character
```

```text
Old: [director-077] The manifest checks fields before ID
New: [director-077] The validator checks fields before ID and rejects the call
```

```text
Old: [director-077] The manifest checks ID before version
New: [director-077] The validator checks ID before version and rejects the call
```

```text
Old: [director-077] The manifest checks version before format
New: [director-077] The validator checks version before format and rejects the call
```

```text
Old: [director-077] The manifest checks format before source fields
New: [director-077] The validator checks format before source fields and rejects the call
```

```text
Old: [director-076 director-077] The manifest checks source name before path
New: [director-076 director-077] The validator checks source name before path and rejects the call
```

```text
Old: [director-076 director-078] The manifest checks source path before attribution fields
New: [director-076 director-078] The validator checks source path before attribution fields and rejects the call
```

```text
Old: [director-078] The manifest checks text before license
New: [director-078] The validator checks text before license and rejects the call
```

```text
Old: [director-078] The manifest checks license before URL
New: [director-078] The validator checks license before URL and rejects the call
```

```text
Old: [director-078 director-079] The manifest checks URL before byteLength
New: [director-078 director-079] The validator checks URL before byteLength and rejects the call
```

```text
Old: [director-079] The manifest checks byteLength before digest
New: [director-079] The validator checks byteLength before digest and rejects the call
```

```text
Old: [director-080] The manifest checks bounds values before edge order
New: [director-080] The validator checks bounds values before edge order and rejects the call
```

```text
Old: [director-080] The manifest checks edge order before height
New: [director-080] The validator checks edge order before height and rejects the call
```

```text
Old: [director-080] The validator checks the height reference before it checks the bounds
New: [director-080] The validator checks the height reference before it checks the bounds and rejects the call
```

```text
Old: [director-080] The validator checks the bounds length before it checks each coordinate
New: [director-080] The validator checks the bounds length before it checks each coordinate and rejects the call
```

```text
Old: [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs
New: [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call
```

```text
Old: [director-089] The source registers its listener and checks its state before it reads the work promise
New: [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order
```

```text
Old: [director-089] The completed source does not read its reason when the promise settles
New: [director-089] The session returns true and does not read the reason after the source promise settles
```

```text
Old: [director-088] The destroyed session returns false for a load call during source cancellation
New: [director-088] The session returns false for a load call during source cancellation for the destroyed session
```

```text
Old: [director-088] The validator checks the list before it reads the anchors
New: [director-088] The session checks the list before it reads the anchors
```

```text
Old: [director-089] The caller listener comes before the deadline timer starts
New: [director-089] The session attaches the caller listener before the deadline timer starts
```

```text
Old: [director-090] The caller event during listener registration cancels the load call
New: [director-090] The session returns false for a caller event during listener registration
```

```text
Old: [director-095] The source checks the path before it checks the caller signal
New: [director-095] The source checks the path before it checks the caller signal and rejects the call
```

```text
Old: [director-076] The asset path accepts z/Zz
New: [director-076] The validator returns without an error for z/Zz for the asset path
```

```text
Old: [director-076] The asset path accepts Z/zZ
New: [director-076] The validator returns without an error for Z/zZ for the asset path
```

```text
Old: [director-076] The asset path accepts zZ/Zz
New: [director-076] The validator returns without an error for zZ/Zz for the asset path
```

```text
Old: [director-076] The asset path accepts _x/_y
New: [director-076] The validator returns without an error for _x/_y for the asset path
```

```text
Old: [director-076] The asset path accepts -x/-y
New: [director-076] The validator returns without an error for -x/-y for the asset path
```

```text
Old: [director-077] The manifest names the extra data pack field
New: [director-077] The validator names the extra data pack field and rejects the call
```

```text
Old: [director-077] The manifest names the format field
New: [director-077] The validator names the format field and rejects the call
```

```text
Old: [director-077] The manifest names the source object
New: [director-077] The validator names the source object and rejects the call
```

```text
Old: [director-076] The manifest names the source path
New: [director-076] The validator names the source path and rejects the call
```

```text
Old: [director-078] The manifest names the extra attribution field
New: [director-078] The validator names the extra attribution field and rejects the call
```

```text
Old: [director-078] The manifest names the attribution object
New: [director-078] The validator names the attribution object and rejects the call
```

```text
Old: [director-078] The manifest names the link syntax
New: [director-078] The validator names the link syntax and rejects the call
```

```text
Old: [director-078] The manifest names the link protocol
New: [director-078] The validator names the link protocol and rejects the call
```

```text
Old: [director-079] The manifest names the numeric text
New: [director-079] The validator names the numeric text and rejects the call
```

```text
Old: [director-079] The manifest names the byteLength field
New: [director-079] The validator names the byteLength field and rejects the call
```

```text
Old: [director-079] The manifest names the integer field
New: [director-079] The validator names the integer field and rejects the call
```

```text
Old: [director-080] The manifest names the extra placement field
New: [director-080] The validator names the extra placement field and rejects the call
```

```text
Old: [director-080] The manifest names the placement object
New: [director-080] The validator names the placement object and rejects the call
```

```text
Old: [director-080] The manifest names the height reference
New: [director-080] The validator names the height reference and rejects the call
```

```text
Old: [director-080] The manifest names the bound list
New: [director-080] The validator names the bound list and rejects the call
```

```text
Old: [director-081] The manifest names an unknown anchor
New: [director-081] The validator names an unknown anchor and rejects the call
```

```text
Old: [director-082] The shot accepts eight references and rejects nine references
New: [director-082] The validator returns without an error for eight references and rejects nine references for the shot
```

```text
Old: [director-082] The scene names the invalid declaration
New: [director-082] The validator rejects the invalid declaration for the scene
```

```text
Old: [director-082] The scene names the invalid duplicate ID
New: [director-082] The validator rejects the invalid duplicate ID for the scene
```

```text
Old: [director-082] The scene names the invalid duplicate reference
New: [director-082] The validator rejects the invalid duplicate reference for the scene
```

```text
Old: [director-082] The scene names the invalid reference type
New: [director-082] The validator rejects the invalid reference type for the scene
```

```text
Old: [director-086] The decoder accepts an open line
New: [director-086] The decoder accepts an open line and returns coordinates
```

```text
Old: [director-088] The session accepts an empty list without asset work
New: [director-088] The session returns true for an empty list without asset work
```

```text
Old: [director-088] The data pack limits reject a caller change
New: [director-088] The session rejects a caller change to the data pack limits
```

```text
Old: [director-088] The destroyed session does not read the caller signal state
New: [director-088] The session returns false without a caller signal access after destruction
```

```text
Old: [director-090] The cleared load call does not read the caller signal state again
New: [director-090] The session returns false and does not read the caller signal state again after cancellation
```

```text
Old: [director-076] The asset path accepts safe names
New: [director-076] The validator returns without an error for safe names for the asset path
```

```text
Old: [director-076] The asset path rejects traversal
New: [director-076] The validator rejects traversal for the asset path
```

```text
Old: [director-077] The manifest rejects invalid version
New: [director-077] The validator rejects invalid version
```

```text
Old: [director-077] The manifest rejects invalid format
New: [director-077] The validator rejects invalid format
```

```text
Old: [director-077] The manifest accepts geojson
New: [director-077] The validator returns without an error for geojson
```

```text
Old: [director-077] The manifest accepts image
New: [director-077] The validator returns without an error for image
```

```text
Old: [director-077] The manifest accepts media
New: [director-077] The validator returns without an error for media
```

```text
Old: [director-078] The attribution rejects protocol
New: [director-078] The validator rejects protocol for the attribution
```

```text
Old: [director-078] The attribution rejects username
New: [director-078] The validator rejects username for the attribution
```

```text
Old: [director-078] The attribution rejects password
New: [director-078] The validator rejects password for the attribution
```

```text
Old: [director-078] The attribution rejects query
New: [director-078] The validator rejects query for the attribution
```

```text
Old: [director-078] The attribution rejects fragment
New: [director-078] The validator rejects fragment for the attribution
```

```text
Old: [director-078] The attribution rejects invalid URL text
New: [director-078] The validator rejects invalid URL text for the attribution
```

```text
Old: [director-078] The attribution accepts a safe link
New: [director-078] The validator returns without an error for a safe link for the attribution
```

```text
Old: [director-078] The attribution rejects blank text
New: [director-078] The validator rejects blank text for the attribution
```

```text
Old: [director-078] The attribution rejects blank license
New: [director-078] The validator rejects blank license for the attribution
```

```text
Old: [director-079] The byteLength field rejects a fraction
New: [director-079] The validator rejects a fraction for the byteLength field
```

```text
Old: [director-079] The digest rejects invalid type
New: [director-079] The validator rejects invalid type for the digest
```

```text
Old: [director-079] The digest rejects invalid alphabet
New: [director-079] The validator rejects invalid alphabet for the digest
```

```text
Old: [director-079] The integrity fields accept their limits
New: [director-079] The validator accepts integrity limits and rejects zero or excess byteLength
```

```text
Old: [director-080] The image rejects reversed west
New: [director-080] The validator rejects reversed west for the image
```

```text
Old: [director-080] The image rejects reversed south
New: [director-080] The validator rejects reversed south for the image
```

```text
Old: [director-080] The image rejects short bounds
New: [director-080] The validator rejects short bounds for the image
```

```text
Old: [director-080] The image rejects bounds field 0
New: [director-080] The validator rejects bounds field 0 for the image
```

```text
Old: [director-080] The image rejects bounds field 1
New: [director-080] The validator rejects bounds field 1 for the image
```

```text
Old: [director-080] The image rejects bounds field 2
New: [director-080] The validator rejects bounds field 2 for the image
```

```text
Old: [director-080] The image rejects bounds field 3
New: [director-080] The validator rejects bounds field 3 for the image
```

```text
Old: [director-080] The image rejects height and reference
New: [director-080] The validator rejects height and reference for the image
```

```text
Old: [director-081] The media rejects an unknown anchor
New: [director-081] The validator rejects an unknown anchor for the media
```

```text
Old: [director-082] The scene rejects duplicate data pack IDs
New: [director-082] The validator rejects duplicate data pack IDs for the scene
```

```text
Old: [director-082] The shot rejects duplicate data pack IDs
New: [director-082] The validator rejects duplicate data pack IDs for the shot
```

```text
Old: [director-082] The shot rejects unknown data pack IDs
New: [director-082] The validator rejects unknown data pack IDs for the shot
```

```text
Old: [director-082] The scene accepts absent data packs and anchors
New: [director-082] The validator returns without an error for absent data packs and anchors for the scene
```

```text
Old: [director-083] The collection rejects invalid type
New: [director-083] The decoder rejects invalid type for the collection
```

```text
Old: [director-083] The collection rejects invalid array
New: [director-083] The decoder rejects invalid array for the collection
```

```text
Old: [director-083] The collection rejects more than 2000 features
New: [director-083] The decoder rejects more than 2000 features for the collection
```

```text
Old: [director-084] The feature rejects type
New: [director-084] The decoder rejects type for the feature
```

```text
Old: [director-084] The feature rejects ID type
New: [director-084] The decoder rejects ID type for the feature
```

```text
Old: [director-084] The feature rejects blank ID
New: [director-084] The decoder rejects blank ID for the feature
```

```text
Old: [director-084] The feature rejects long ID
New: [director-084] The decoder rejects long ID for the feature
```

```text
Old: [director-084] The feature rejects duplicate ID
New: [director-084] The decoder rejects duplicate ID for the feature
```

```text
Old: [director-085] The position rejects invalid array
New: [director-085] The decoder rejects invalid array for the position
```

```text
Old: [director-085] The position rejects invalid length
New: [director-085] The decoder rejects invalid length for the position
```

```text
Old: [director-085] The position rejects a coordinate that is not finite
New: [director-085] The decoder rejects a coordinate that is not finite for the position
```

```text
Old: [director-085] The position rejects invalid longitude
New: [director-085] The decoder rejects invalid longitude for the position
```

```text
Old: [director-085] The position rejects invalid latitude
New: [director-085] The decoder rejects invalid latitude for the position
```

```text
Old: [director-085] The position rejects a height below the limit
New: [director-085] The decoder rejects a height below the limit for the position
```

```text
Old: [director-085] The position rejects a height above the limit
New: [director-085] The decoder rejects a height above the limit for the position
```

```text
Old: [director-085] The position total rejects excess
New: [director-085] The decoder rejects excess for the position total
```

```text
Old: [director-085] The position uses zero for absent height
New: [director-085] The decoder returns zero for absent height for the position
```

```text
Old: [director-085] The position keeps the height in the data
New: [director-085] The decoder returns the height in the data for the position
```

```text
Old: [director-086] The line rejects invalid array
New: [director-086] The decoder rejects invalid array for the line
```

```text
Old: [director-086] The line rejects invalid minimum
New: [director-086] The decoder rejects invalid minimum for the line
```

```text
Old: [director-086] The ring needs four points
New: [director-086] The decoder rejects a ring with fewer than four points for the ring
```

```text
Old: [director-086] The line accepts two distinct endpoints
New: [director-086] The decoder accepts two distinct endpoints for the line and returns coordinates
```

```text
Old: [director-086] The ring rejects unclosed field 0
New: [director-086] The decoder rejects unclosed field 0 for the ring
```

```text
Old: [director-086] The ring rejects unclosed field 1
New: [director-086] The decoder rejects unclosed field 1 for the ring
```

```text
Old: [director-086] The ring rejects unclosed field 2
New: [director-086] The decoder rejects unclosed field 2 for the ring
```

```text
Old: [director-087] The geometry rejects invalid type
New: [director-087] The decoder rejects invalid type for the geometry
```

```text
Old: [director-087] The geometry rejects invalid array
New: [director-087] The decoder rejects invalid array for the geometry
```

```text
Old: [director-087] The geometry rejects an empty polygon
New: [director-087] The decoder rejects an empty polygon for the geometry
```

```text
Old: [director-087] The geometry rejects more than 128 rings
New: [director-087] The decoder rejects more than 128 rings for the geometry
```

```text
Old: [director-087] The geometry returns a closed polygon
New: [director-087] The decoder returns a closed polygon for the geometry
```

```text
Old: [director-087] The geometry removes properties
New: [director-087] The decoder removes properties for the geometry
```

```text
Old: [director-088] The new session reports idle state
New: [director-088] The session reports idle state after creation
```

```text
Old: [director-089] The session gives copied state
New: [director-089] The session reports ready after the caller changes a state copy
```

```text
Old: [director-090] The cancelled session disposes late resources
New: [director-090] The session disposes late resources for the cancelled session
```

```text
Old: [director-090] The session accepts a null late handle
New: [director-090] The session returns false for cancelled work with a null late handle
```

```text
Old: [director-090] The session destroys work that is not complete
New: [director-090] The session returns false for work that destruction stops
```

```text
Old: [director-091] The replacement keeps its resources
New: [director-091] The session keeps its resources for the replacement
```

```text
Old: [director-092] The deadline rejects stalled work
New: [director-092] The session rejects stalled work for the deadline
```

```text
Old: [director-093] The session checks exact bytes and digest
New: [director-093] The session returns true for exact bytes and digest
```

```text
Old: [director-094] The directory rejects protocol
New: [director-094] The factory rejects protocol
```

```text
Old: [director-094] The directory rejects username
New: [director-094] The factory rejects username
```

```text
Old: [director-094] The directory rejects password
New: [director-094] The factory rejects password
```

```text
Old: [director-094] The directory rejects query
New: [director-094] The factory rejects query
```

```text
Old: [director-094] The directory rejects fragment
New: [director-094] The factory rejects fragment
```

```text
Old: [director-094] The directory rejects an address with no final slash
New: [director-094] The factory rejects an address with no final slash
```

```text
Old: [director-095] The asset request sets its fixed options
New: [director-095] The source sets its fixed options for the asset request
```

```text
Old: [director-096] The stream joins distinct chunks
New: [director-096] The source joins distinct stream chunks
```

```text
Old: [director-096] The stream rejects excess header bytes
New: [director-096] The source rejects excess header bytes for the stream
```

```text
Old: [director-096] The stream rejects excess chunk bytes
New: [director-096] The source rejects excess chunk bytes for the stream
```

```text
Old: [director-097] The source accepts failed body cancellation
New: [director-097] The source rejects the asset request after failed body cancellation
```

```text
Old: [director-097] The stream releases its lock after an error
New: [director-097] The source releases the reader lock after a stream error
```

```text
Old: [director-097] The source checks its signal between chunks
New: [director-097] The source checks its signal between chunks and rejects the call
```

```text
Old: [director-080] The image accepts its bounds field
New: [director-080] The validator returns without an error for its bounds field for the image
```

```text
Old: [director-080] The image accepts its height field
New: [director-080] The validator returns without an error for its height field for the image
```

```text
Old: [director-080] The image accepts its altitudeReference field
New: [director-080] The validator returns without an error for its altitudeReference field for the image
```

```text
Old: [director-081] The media accepts its anchorId field
New: [director-081] The validator returns without an error for its anchorId field for the media
```

```text
Old: [director-077] The geojson accepts its altitudeReference field
New: [director-077] The validator returns without an error for a GeoJSON altitudeReference field
```

```text
Old: [director-080] The image bounds 0 rejects low excess
New: [director-080] The validator rejects low excess for image bounds field 0
```

```text
Old: [director-080] The image bounds 0 rejects high excess
New: [director-080] The validator rejects high excess for image bounds field 0
```

```text
Old: [director-080] The image bounds 1 rejects low excess
New: [director-080] The validator rejects low excess for image bounds field 1
```

```text
Old: [director-080] The image bounds 1 rejects high excess
New: [director-080] The validator rejects high excess for image bounds field 1
```

```text
Old: [director-080] The image bounds 2 rejects low excess
New: [director-080] The validator rejects low excess for image bounds field 2
```

```text
Old: [director-080] The image bounds 2 rejects high excess
New: [director-080] The validator rejects high excess for image bounds field 2
```

```text
Old: [director-080] The image bounds 3 rejects low excess
New: [director-080] The validator rejects low excess for image bounds field 3
```

```text
Old: [director-080] The image bounds 3 rejects high excess
New: [director-080] The validator rejects high excess for image bounds field 3
```

```text
Old: [director-080] The image height checks both limits
New: [director-080] The validator rejects image height outside both limits
```

```text
Old: [director-082] The scene uses supplied anchors
New: [director-082] The validator uses supplied anchors for the scene and returns without an error
```

```text
Old: [director-082] The scene uses absent anchor defaults
New: [director-082] The validator uses absent anchor defaults for the scene and returns without an error
```

```text
Old: [director-085] The position accepts both geographic edges
New: [director-085] The decoder accepts both geographic edges for the position and returns coordinates
```

```text
Old: [director-088] The session state uses its idle default
New: [director-088] The session reports idle after creation
```

```text
Old: [director-088] The session state uses its zero default
New: [director-088] The session reports zero handles after creation
```

```text
Old: [director-089] The session state uses its active total
New: [director-089] The session reports one active handle
```

```text
Old: [director-093] The session uses its default byte budget
New: [director-093] The session calls the source with a default limit of 8388608 bytes
```

```text
Old: [director-093] The session accepts absent declared size
New: [director-093] The session returns true without a declared size
```

```text
Old: [director-090] The session checks signal state without an event
New: [director-090] The session returns false for a cancelled signal without an event
```

```text
Old: [director-090] The session checks a cleared load call without signal state
New: [director-090] The session returns false for a cleared load call without a signal state access
```

```text
Old: [director-092] The session ignores a late source error
New: [director-092] The session returns false for cancelled work and reports idle after a late source error
```

```text
Old: [director-094] The directory accepts HTTP and HTTPS
New: [director-094] The factory returns a source for HTTP and HTTPS directories
```

```text
Old: [director-092] The absent renderer does not call its source
New: [director-092] The session rejects an absent renderer without a source call
```

```text
Old: [director-095] The asset request sets its credentials option
New: [director-095] The source sets its credentials option for the asset request
```

```text
Old: [director-095] The asset request sets its redirect option
New: [director-095] The source sets its redirect option for the asset request
```

```text
Old: [director-095] The asset request sets its referrerPolicy option
New: [director-095] The source sets its referrerPolicy option for the asset request
```

```text
Old: [director-095] The asset request sets its cache option
New: [director-095] The source sets its cache option for the asset request
```

```text
Old: [director-085] The position rejects field 0 that is not finite
New: [director-085] The decoder rejects field 0 that is not finite for the position
```

```text
Old: [director-085] The position rejects field 1 that is not finite
New: [director-085] The decoder rejects field 1 that is not finite for the position
```

```text
Old: [director-085] The position rejects field 2 that is not finite
New: [director-085] The decoder rejects field 2 that is not finite for the position
```

```text
Old: [director-096] The source checks its default byte budget
New: [director-096] The source rejects 8388609 bytes without a caller limit
```

```text
Old: [director-077] The manifest accepts the id field of a data pack
New: [director-077] The validator returns without an error for the id field of a data pack
```

```text
Old: [director-077] The manifest accepts the version field of a data pack
New: [director-077] The validator returns without an error for the version field of a data pack
```

```text
Old: [director-077] The manifest accepts the format field of a data pack
New: [director-077] The validator returns without an error for the format field of a data pack
```

```text
Old: [director-077] The manifest accepts the source field of a data pack
New: [director-077] The validator returns without an error for the source field of a data pack
```

```text
Old: [director-077] The manifest accepts the attribution field of a data pack
New: [director-077] The validator returns without an error for the attribution field of a data pack
```

```text
Old: [director-077] The manifest accepts the placement field of a data pack
New: [director-077] The validator returns without an error for the placement field of a data pack
```

```text
Old: [director-079] The manifest accepts the byteLength field of a data pack
New: [director-079] The validator returns without an error for the byteLength field of a data pack
```

```text
Old: [director-079] The manifest accepts the sha256 field of a data pack
New: [director-079] The validator returns without an error for the sha256 field of a data pack
```

```text
Old: [director-077] The manifest accepts its source name field
New: [director-077] The validator returns without an error for its source name field
```

```text
Old: [director-077] The manifest accepts its source path field
New: [director-077] The validator returns without an error for its source path field
```

```text
Old: [director-078] The manifest accepts its attribution text field
New: [director-078] The validator returns without an error for its attribution text field
```

```text
Old: [director-078] The manifest accepts its attribution license field
New: [director-078] The validator returns without an error for its attribution license field
```

```text
Old: [director-078] The manifest accepts its attribution url field
New: [director-078] The validator returns without an error for its attribution url field
```

```text
Old: [director-092] The session settles an early internal signal
New: [director-092] The session settles an early internal signal and reports idle
```

```text
Old: [director-093] The session gives anchors to its renderer
New: [director-093] The session calls the renderer with the anchors and returns true
```

```text
Old: [director-089] The session state uses its active status
New: [director-089] The session reports ready after asset work
```

```text
Old: [director-080] The placement selects the image fields
New: [director-080] The validator rejects media fields in image placement for the placement
```

```text
Old: [director-081] The placement selects the media fields
New: [director-081] The validator rejects image fields in media placement for the placement
```

```text
Old: [director-089] The session loads its geojson format
New: [director-089] The session calls the GeoJSON renderer once and returns true
```

```text
Old: [director-089] The session loads its image format
New: [director-089] The session calls the image renderer once and returns true
```

```text
Old: [director-089] The session loads its media format
New: [director-089] The session calls the media renderer once and returns true
```

```text
Old: [director-092] The session settles a source error before its deadline
New: [director-092] The session settles a source error before its deadline and reports idle
```

```text
Old: [director-092] The session uses its supplied deadline
New: [director-092] The session rejects stalled work at the 19 ms deadline
```

```text
Old: [director-092] The session uses its default deadline
New: [director-092] The session rejects stalled work at the default 15000 ms deadline
```

```text
Old: [director-083] The collection accepts its exact feature limit
New: [director-083] The decoder accepts its exact feature limit for the collection and returns coordinates
```

```text
Old: [director-084] The feature ID accepts its exact text limit
New: [director-084] The decoder accepts its exact text limit for the feature ID and returns coordinates
```

```text
Old: [director-085] The position accepts its exact total limit
New: [director-085] The decoder accepts its exact total limit for the position and returns coordinates
```

```text
Old: [director-087] The polygon accepts its exact ring limit
New: [director-087] The decoder accepts its exact ring limit for the polygon and returns coordinates
```

```text
Old: [director-076] The asset path checks its text limit
New: [director-076] The validator rejects a path above its text limit for the asset path
```

```text
Old: [director-095] The asset request sets its signal option
New: [director-095] The source sets its signal option for the asset request
```

```text
Old: [director-096] The stream accepts its exact byte limit
New: [director-096] The source accepts its exact byte limit for the stream and returns bytes
```

```text
Old: [director-092] The data pack session reads the byteLength field once without a registered source
New: [director-092] The session reads the byteLength field once without a registered source for the data pack session
```

```text
Old: [director-079] The digest rejects 63 characters
New: [director-079] The validator rejects 63 characters for the digest
```

```text
Old: [director-079] The digest rejects 65 characters
New: [director-079] The validator rejects 65 characters for the digest
```

```text
Old: [director-079] The digest rejects uppercase text
New: [director-079] The validator rejects uppercase text for the digest
```

```text
Old: [director-079] The digest rejects a prefix
New: [director-079] The validator rejects a prefix for the digest
```

```text
Old: [director-079] The digest rejects a suffix
New: [director-079] The validator rejects a suffix for the digest
```

```text
Old: [director-079] The digest accepts 64 lowercase characters
New: [director-079] The validator returns without an error for 64 lowercase characters for the digest
```

```text
Old: [director-080] The image rejects equal longitude edges
New: [director-080] The validator rejects equal longitude edges for the image
```

```text
Old: [director-080] The image rejects equal latitude edges
New: [director-080] The validator rejects equal latitude edges for the image
```

```text
Old: [director-080] The image accepts all geographic limits
New: [director-080] The validator returns without an error for all geographic limits for the image
```

```text
Old: [director-088] The session accepts eight data packs
New: [director-088] The session returns true for eight data packs
```

```text
Old: [director-093] The session accepts the asset byte limit
New: [director-093] The session returns true at the asset byte limit
```

```text
Old: [director-093] The session accepts the total byte limit
New: [director-093] The session returns true at the total byte limit
```

```text
Old: [director-093] The source receives the path and the renderer receives the asset and signal
New: [director-093] The source receives the path and the renderer receives the asset and signal and returns bytes
```

```text
Old: [director-088] The session checks every declaration before the source call
New: [director-088] The session checks every declaration before the source call and rejects the call
```

```text
Old: [director-089] The session destroys each ready resource
New: [director-089] The session disposes both ready handles in reverse order and reports idle
```

```text
Old: [director-092] The deadline removes partial resources
New: [director-092] The session removes partial resources for the deadline
```

```text
Old: [director-076] The asset path rejects URL syntax with a stable message
New: [director-076] The validator rejects URL syntax with a stable message for the asset path
```

```text
Old: [director-082] The scene ignores a data pack list from its parent
New: [director-082] The validator ignores a data pack list from its parent for the scene and returns without an error
```

```text
Old: [director-080] The image rejects text for each geographic field
New: [director-080] The validator rejects text for each geographic field for the image
```

```text
Old: [director-078] The attribution accepts its text limits and rejects excess text
New: [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
```

```text
Old: [director-076] The asset path accepts 1024 characters and rejects 1025
New: [director-076] The validator returns without an error for 1024 characters and rejects 1025 for the asset path
```

```text
Old: [director-095] The directory source uses the default fetch function
New: [director-095] The source uses the default fetch function and returns bytes
```

```text
Old: [director-077] The manifest accepts 256 characters for its ID and rejects 257
New: [director-077] The validator returns without an error for 256 characters for its ID and rejects 257
```

```text
Old: [director-077] The manifest accepts 256 characters for its source name and rejects 257
New: [director-077] The validator returns without an error for 256 characters for its source name and rejects 257
```

```text
Old: [director-076] The asset path rejects x?a=1
New: [director-076] The validator rejects x?a=1 for the asset path
```

```text
Old: [director-076] The asset path rejects a:b
New: [director-076] The validator rejects a:b for the asset path
```

```text
Old: [director-076] The asset path rejects .x
New: [director-076] The validator rejects .x for the asset path
```

```text
Old: [director-076] The asset path rejects x/
New: [director-076] The validator rejects x/ for the asset path
```

```text
Old: [director-076] The asset path rejects x//y
New: [director-076] The validator rejects x//y for the asset path
```

```text
Old: [director-079] The manifest accepts one byte
New: [director-079] The validator returns without an error for one byte
```

```text
Old: [director-080] The image rejects bounds outside an array
New: [director-080] The validator rejects bounds outside an array for the image
```

```text
Old: [director-082] The scene accepts eight distinct data packs
New: [director-082] The validator returns without an error for eight distinct data packs for the scene
```

```text
Old: [director-082] The scene rejects nine distinct data packs
New: [director-082] The validator rejects nine distinct data packs for the scene
```

```text
Old: [director-085] The position rejects negative longitude
New: [director-085] The decoder rejects negative longitude for the position
```

```text
Old: [director-085] The position rejects positive longitude
New: [director-085] The decoder rejects positive longitude for the position
```

```text
Old: [director-085] The position rejects negative latitude
New: [director-085] The decoder rejects negative latitude for the position
```

```text
Old: [director-085] The position rejects positive latitude
New: [director-085] The decoder rejects positive latitude for the position
```

```text
Old: [director-085] The position rejects one coordinate
New: [director-085] The decoder rejects one coordinate for the position
```

```text
Old: [director-085] The position rejects four coordinates
New: [director-085] The decoder rejects four coordinates for the position
```

```text
Old: [director-085] The position accepts the limit for negative longitude
New: [director-085] The decoder accepts the limit for negative longitude for the position and returns coordinates
```

```text
Old: [director-085] The position accepts the limit for positive longitude
New: [director-085] The decoder accepts the limit for positive longitude for the position and returns coordinates
```

```text
Old: [director-085] The position accepts the limit for negative latitude
New: [director-085] The decoder accepts the limit for negative latitude for the position and returns coordinates
```

```text
Old: [director-085] The position accepts the limit for positive latitude
New: [director-085] The decoder accepts the limit for positive latitude for the position and returns coordinates
```

```text
Old: [director-089] The data pack session reports its state during asset work
New: [director-089] The session reports its state during asset work for the data pack session
```

```text
Old: [director-096] The directory source accepts its default byte limit
New: [director-096] The source accepts its default byte limit and returns bytes
```

```text
Old: [director-093] The renderer receives the data pack and scene anchors
New: [director-093] The renderer receives the data pack and scene anchors and returns coordinates
```

```text
Old: [director-080] The image accepts its minimum height
New: [director-080] The validator returns without an error for its minimum height for the image
```

```text
Old: [director-085] The position accepts its minimum height
New: [director-085] The decoder accepts its minimum height for the position and returns coordinates
```

```text
Old: [director-080] The image accepts its maximum height
New: [director-080] The validator returns without an error for its maximum height for the image
```

```text
Old: [director-085] The position accepts its maximum height
New: [director-085] The decoder accepts its maximum height for the position and returns coordinates
```

```text
Old: [director-079] The manifest accepts its byte limit
New: [director-079] The validator returns without an error for its byte limit
```

```text
Old: [director-089] The data pack session removes source listeners after success
New: [director-089] The session removes source listeners after success for the data pack session
```

```text
Old: [director-089] The data pack session removes source listeners after error
New: [director-089] The session removes source listeners after error for the data pack session
```

```text
Old: [director-089] The completed source listener ignores a later event after success
New: [director-089] The session reads the reason zero times after a later event for success
```

```text
Old: [director-089] The completed source listener ignores a later event after error
New: [director-089] The session reads the reason zero times after a later event for error
```

```text
Old: [director-090] The caller destroys the session when it reads the caller signal after a source error
New: [director-090] The load call returns false when the caller signal destroys the session after a source error
```

```text
Old: [director-093] The session does not read declared byteLength again for null bytes
New: [director-093] The session does not read declared byteLength again for null bytes and rejects the call
```

```text
Old: [director-092] The deadline gives its cause to the source signal
New: [director-092] The session gives its cause to the source signal for the deadline and rejects the call
```

```text
Old: [director-079] The validator checks the digest type before it converts text
New: [director-079] The validator checks the digest type before it converts text and rejects the call
```

```text
Old: [director-080] The validator checks west and east before south and north
New: [director-080] The validator compares west with east before it compares south with north
```

```text
Old: [director-093] The session does not read bytes.length again without declared byteLength
New: [director-093] The session returns true and reads bytes.length three times without declared byteLength
```

```text
Old: [director-090] The cleared session returns false without the source signal state
New: [director-090] The cleared session returns false and does not read the source signal state
```

```text
Old: [director-091] The old caller listener does not change new resources
New: [director-091] The session keeps new resources after the old caller listener fires
```

```text
Old: [director-088 director-092] The absent source map gives no source for a numeric name
New: [director-088 director-092] The session rejects a numeric source name with no source map
```

```text
Old: [director-088 director-092] The absent renderer map gives no renderer for a numeric name
New: [director-088 director-092] The session rejects a numeric renderer name with no renderer map
```

```text
Old: [director-092] The session does not read the global error property for absent source
New: [director-092] The session does not read the global error property for absent source and rejects the call
```

```text
Old: [director-092] The session does not read the global error property for invalid bytes
New: [director-092] The session does not read the global error property for invalid bytes and rejects the call
```

```text
Old: [director-092] The session does not read the global error property for excess total
New: [director-092] The session does not read the global error property for excess total and rejects the call
```

```text
Old: [director-092] The session does not read the global error property for wrong digest
New: [director-092] The session does not read the global error property for wrong digest and rejects the call
```

```text
Old: [director-092] The session does not read the global error property for invalid handle
New: [director-092] The session does not read the global error property for invalid handle and rejects the call
```

```text
Old: [director-082] The manifest rejects a reference in the second shot
New: [director-082] The validator rejects a reference in the second shot
```

```text
Old: [director-077] The manifest rejects an unlisted geojsonx format
New: [director-077] The validator rejects an unlisted geojsonx format
```

```text
Old: [director-077 director-082] The manifest rejects an invalid second data pack
New: [director-077 director-082] The validator rejects an invalid second data pack
```

```text
Old: [director-081] The manifest accepts a reference to the second anchor
New: [director-081] The validator returns without an error for a reference to the second anchor
```

```text
Old: [director-082] The manifest rejects an unknown second reference ID
New: [director-082] The validator rejects an unknown second reference ID
```

```text
Old: [director-081 director-093] The session accepts a reference to the second anchor
New: [director-081 director-093] The session returns true for a reference to the second anchor
```

```text
Old: [director-079 director-082] The manifest rejects the second data pack digest
New: [director-079 director-082] The validator rejects the second data pack digest
```

```text
Old: [director-080] The manifest rejects the last bounds coordinate
New: [director-080] The validator rejects the last bounds coordinate
```

```text
Old: [director-077] The manifest rejects script and adapters in the data pack
New: [director-077] The validator rejects the extra fields script and adapters in the data pack
```

```text
Old: [director-077] The manifest rejects script and adapters in the source
New: [director-077] The validator rejects the extra fields script and adapters in the source
```

```text
Old: [director-078] The manifest rejects script and adapters in the attribution
New: [director-078] The validator rejects the extra fields script and adapters in the attribution
```

```text
Old: [director-080] The manifest rejects script and adapters in the geojson placement
New: [director-077] The validator rejects the extra fields script and adapters in the GeoJSON placement
```

```text
Old: [director-080] The manifest rejects script and adapters in the image placement
New: [director-080] The validator rejects the extra fields script and adapters in the image placement
```

```text
Old: [director-081] The manifest rejects script and adapters in the media placement
New: [director-077] The validator rejects the extra fields script and adapters in the media placement
```

```text
Old: [director-098] The parser returns an empty asset map for plain project JSON
New: [director-098] The import returns an empty asset map for plain project JSON
```

```text
Old: [director-107] The helper does not attach a listener to a cancelled signal
New: [director-107] The helper does not attach a listener to a cancelled signal and rejects the call
```

```text
Old: [director-099] The import accepts each base64 character in plain text
New: [director-099] The import accepts each base64 character in plain text and returns assets
```

```text
Old: [director-099] The import accepts each base64 character in padded text
New: [director-099] The import accepts each base64 character in padded text and returns assets
```

```text
Old: [director-099] The bundle names the invalid version
New: [director-099] The import names the invalid version and rejects the call
```

```text
Old: [director-099] The bundle names the invalid extra field
New: [director-099] The import names the invalid extra field and rejects the call
```

```text
Old: [director-099] The bundle names the invalid path
New: [director-099] The import names the invalid path and rejects the call
```

```text
Old: [director-099] The bundle names the invalid duplicate path
New: [director-099] The import names the invalid duplicate path and rejects the call
```

```text
Old: [director-100] The bundle names the invalid digest
New: [director-100] The import names the invalid digest and rejects the call
```

```text
Old: [director-100] The bundle names the invalid source
New: [director-100] The import names the invalid source and rejects the call
```

```text
Old: [director-100] The bundle names the invalid reference
New: [director-100] The import names the invalid reference and rejects the call
```

```text
Old: [director-100] The bundle names the invalid unused asset
New: [director-100] The import names the invalid unused asset and rejects the call
```

```text
Old: [director-098] The bundle names the invalid JSON path
New: [director-098] The import names the invalid JSON path and rejects the call
```

```text
Old: [director-099] The bundle accepts base64 zz==
New: [director-099] The import accepts base64 zz== and returns assets
```

```text
Old: [director-099] The bundle accepts base64 ZZ==
New: [director-099] The import accepts base64 ZZ== and returns assets
```

```text
Old: [director-099] The bundle accepts base64 99==
New: [director-099] The import accepts base64 99== and returns assets
```

```text
Old: [director-099] The bundle accepts base64 zZ09
New: [director-099] The import accepts base64 zZ09 and returns assets
```

```text
Old: [director-099] The bundle rejects an equals sign at the start
New: [director-099] The import rejects an equals sign at the start
```

```text
Old: [director-099] The bundle rejects a null base64 value
New: [director-099] The import rejects a null base64 value
```

```text
Old: [director-098] The bundle rejects null text
New: [director-098] The import rejects null text
```

```text
Old: [director-102] The export names the invalid absent asset
New: [director-102] The export names the invalid absent asset and rejects the call
```

```text
Old: [director-102] The export names the invalid empty bytes
New: [director-102] The export names the invalid empty bytes and rejects the call
```

```text
Old: [director-102] The export names the invalid media type
New: [director-102] The export names the invalid media type and rejects the call
```

```text
Old: [director-102] The export names the invalid declared byteLength
New: [director-102] The export names the invalid declared byteLength and rejects the call
```

```text
Old: [director-102] The export names excess asset entries
New: [director-102] The export names excess asset entries and rejects the call
```

```text
Old: [director-103] The export names different shared integrity
New: [director-103] The export names different shared integrity and rejects the call
```

```text
Old: [director-101] The export limits each source filename to 160 characters
New: [director-101] The export limits each source filename to 160 characters and returns bundle text
```

```text
Old: [director-104] The byte store accepts an absent replacement map
New: [director-104] The store reports zero bytes after an absent replacement map
```

```text
Old: [director-105] The byte store accepts its default byte limit
New: [director-105] The store accepts its default byte limit for the byte store and returns byte copies
```

```text
Old: [director-105] The byte store rejects an invalid path that it holds
New: [director-105] The store rejects an invalid path that it holds for the byte store
```

```text
Old: [director-102] The share limits reject a caller change
New: [director-102] The bundle helpers reject a caller change to the share limits
```

```text
Old: [director-099] The parser checks the base64 type before it converts text
New: [director-099] The import checks the base64 type before it converts text and rejects the call
```

```text
Old: [director-102] The export does not compare an absent declared byteLength
New: [director-102] The export does not compare an absent declared byteLength and returns bundle text
```

```text
Old: [director-102] The export checks declared byteLength before declared digest
New: [director-102] The export checks declared byteLength before declared digest and rejects the call
```

```text
Old: [director-102] The export checks the asset size before the total size
New: [director-102] The export checks the asset size before the total size and rejects the call
```

```text
Old: [director-110] The applied shot packs decide external content before source pack IDs
New: [director-110] The preview reports external content from applied shot packs before it reads source pack IDs
```

```text
Old: [director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request
New: [director-101] The export copies bytes and attribution and keeps the project without an asset request for the selected scene bundle
```

```text
Old: [director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
New: [director-099] The import rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
```

```text
Old: [director-102] The bundle checks asset limits and declared integrity before export
New: [director-102] The export rejects excess bytes, wrong integrity and absent assets
```

```text
Old: [director-103] The data packs with the same path share one asset and reject integrity values that differ
New: [director-103] The export share one asset and reject integrity values that differ for the data packs with the same path
```

```text
Old: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without edits to state
New: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets
```

```text
Old: [director-104] The bundle byte store removes old data after replacement and uses no network source
New: [director-104] The store removes old data after replacement and uses no network source for the import byte store
```

```text
Old: [director-107] The cancelled bundle export stops before the next asset and returns no partial output
New: [director-107] The export stops before the next asset and returns no partial output for the cancelled bundle export
```

```text
Old: [director-101] The bundle accepts long valid source asset names
New: [director-101] The export returns a bundle for a source path of 1024 characters
```

```text
Old: [director-098] The bundle helpers reject nontext input
New: [director-098] The import rejects nontext input
```

```text
Old: [director-098] The bundle helpers reject invalid JSON
New: [director-098] The import rejects invalid JSON
```

```text
Old: [director-098] The bundle helpers accept plain project JSON
New: [director-098] The import accepts plain project JSON and returns the project
```

```text
Old: [director-098] The bundle helpers reject excess characters
New: [director-098] The import rejects excess characters
```

```text
Old: [director-098] The bundle helpers reject excess UTF8 bytes
New: [director-098] The import rejects excess UTF8 bytes
```

```text
Old: [director-099] The base64 rejects invalid type
New: [director-099] The import rejects invalid type for the base64
```

```text
Old: [director-099] The base64 rejects invalid empty
New: [director-099] The import rejects invalid empty for the base64
```

```text
Old: [director-099] The base64 rejects invalid length
New: [director-099] The import rejects invalid length for the base64
```

```text
Old: [director-099] The base64 rejects invalid alignment
New: [director-099] The import rejects invalid alignment for the base64
```

```text
Old: [director-099] The base64 rejects invalid alphabet
New: [director-099] The import rejects invalid alphabet for the base64
```

```text
Old: [director-099] The base64 rejects invalid padding
New: [director-099] The import rejects invalid padding for the base64
```

```text
Old: [director-099] The bundle rejects duplicate paths
New: [director-099] The import rejects duplicate paths
```

```text
Old: [director-099] The bundle rejects an unsupported media type
New: [director-099] The import rejects an unsupported media type
```

```text
Old: [director-099] The bundle rejects unsupported version
New: [director-099] The import rejects unsupported version
```

```text
Old: [director-100] The bundle rejects an absent asset
New: [director-100] The import rejects an absent asset
```

```text
Old: [director-100] The bundle rejects a wrong byteLength field
New: [director-100] The import rejects a wrong byteLength field
```

```text
Old: [director-100] The bundle rejects a pack digest that differs from its asset
New: [director-100] The import rejects a pack digest that differs from its asset
```

```text
Old: [director-100] The bundle rejects an asset digest that differs from its bytes
New: [director-100] The import rejects an asset digest that differs from its bytes
```

```text
Old: [director-100] The bundle rejects unused assets
New: [director-100] The import rejects unused assets
```

```text
Old: [director-100] The bundle rejects external data pack sources
New: [director-100] The import rejects external data pack sources
```

```text
Old: [director-103] The export reuses a shared asset
New: [director-103] The export reuses a shared asset and returns bundle text
```

```text
Old: [director-106] The share helpers accept an absent filename
New: [director-106] The share helpers return the project for an absent filename
```

```text
Old: [director-106] The share helpers give bundles the larger file limit
New: [director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes
```

```text
Old: [director-107] The helper checks signal state when the work settles
New: [director-107] The helper checks signal state when the work settles and rejects the call
```

```text
Old: [director-108] The preview uses the scene ID without a title
New: [director-108] The preview reports the scene ID when the title is absent
```

```text
Old: [director-110] The preview detects applied shot packs
New: [director-110] The preview reports external content for applied shot packs
```

```text
Old: [director-110] The preview detects the source pack ID of a shot
New: [director-110] The preview reports external content for a shot with a source pack ID
```

```text
Old: [director-110] The preview detects no external content
New: [director-110] The preview reports no external content without source packs
```

```text
Old: [director-098] The share character guard comes before byte conversion
New: [director-098] The import rejects 52428801 characters before byte conversion
```

```text
Old: [director-101] The export accepts scenes without data packs
New: [director-101] The export accepts scenes without data packs and returns bundle text
```

```text
Old: [director-102] The export accepts absent integrity fields
New: [director-102] The export accepts absent integrity fields and returns bundle text
```

```text
Old: [director-102] The export accepts an absent digest
New: [director-102] The export accepts an absent digest and returns bundle text
```

```text
Old: [director-103] The shared export accepts absent byte declarations
New: [director-103] The export accepts absent byte declarations for the shared export and returns bundle text
```

```text
Old: [director-103] The shared export accepts an absent digest
New: [director-103] The export accepts an absent digest for the shared export and returns bundle text
```

```text
Old: [director-099] The base64 accepts bytes without padding
New: [director-099] The import accepts bytes without padding for the base64 and returns assets
```

```text
Old: [director-109] The preview distinguishes bundle sources
New: [director-109] The preview reports a configured source for a supplied source ID
```

```text
Old: [director-110] The preview accepts absent shot layers
New: [director-110] The preview reports no absent layer when a shot has no layers
```

```text
Old: [director-110] The preview uses supplied shot layers
New: [director-110] The preview reports traffic as absent without layer IDs
```

```text
Old: [director-105] The store checks its default byte budget
New: [director-105] The store rejects 8388609 bytes without a caller limit
```

```text
Old: [director-099] The base64 rejects a custom text object
New: [director-099] The import rejects a custom text object for the base64
```

```text
Old: [director-103] The export key uses the registered source name
New: [director-103] The export key uses the registered source name and returns bundle text
```

```text
Old: [director-103] The export key uses path
New: [director-103] The export key uses path and returns bundle text
```

```text
Old: [director-110] The preview detects each layer key
New: [director-110] The preview reports ships as absent when only traffic is configured
```

```text
Old: [director-108] The preview totals include every asset
New: [director-108] The preview reports three bytes for both assets
```

```text
Old: [director-100] The bundle checks its second asset reference
New: [director-100] The import checks its second asset reference and rejects the call
```

```text
Old: [director-100] The bundle checks its second asset digest
New: [director-100] The import checks its second asset digest and rejects the call
```

```text
Old: [director-103] The export accepts equal shared integrity
New: [director-103] The export accepts equal shared integrity and returns bundle text
```

```text
Old: [director-106] The share helpers check a signal after they read text
New: [director-106] The share helpers call throwIfAborted three times and return the project
```

```text
Old: [director-102] The export checks its encoded text budget
New: [director-102] The export rejects encoded bundle text above 52428800 bytes
```

```text
Old: [director-099] The bundle accepts the application/json media type
New: [director-099] The import accepts the application/json media type and returns assets
```

```text
Old: [director-099] The bundle accepts the application/geo+json media type
New: [director-099] The import accepts the application/geo+json media type and returns assets
```

```text
Old: [director-099] The bundle accepts the image/png media type
New: [director-099] The import accepts the image/png media type and returns assets
```

```text
Old: [director-099] The bundle accepts the video/mp4 media type
New: [director-099] The import accepts the video/mp4 media type and returns assets
```

```text
Old: [director-099] The bundle accepts the video/webm media type
New: [director-099] The import accepts the video/webm media type and returns assets
```

```text
Old: [director-099] The bundle accepts the audio/mpeg media type
New: [director-099] The import accepts the audio/mpeg media type and returns assets
```

```text
Old: [director-099] The bundle accepts the audio/ogg media type
New: [director-099] The import accepts the audio/ogg media type and returns assets
```

```text
Old: [director-099] The bundle accepts the audio/wav media type
New: [director-099] The import accepts the audio/wav media type and returns assets
```

```text
Old: [director-099] The bundle accepts the audio/webm media type
New: [director-099] The import accepts the audio/webm media type and returns assets
```

```text
Old: [director-102] The export accepts its exact asset total
New: [director-102] The export accepts its exact asset total and returns bundle text
```

```text
Old: [director-102] The export accepts the total byte limit and rejects one more byte
New: [director-102] The export accepts the total byte limit and rejects one more byte and returns bundle text
```

```text
Old: [director-099] The base64 accepts its length limit and rejects the next aligned length
New: [director-099] The import accepts its length limit and rejects the next aligned length for the base64 and returns assets
```

```text
Old: [director-099] The import accepts the total byte limit and rejects one more byte
New: [director-099] The import accepts the total byte limit and rejects one more byte and returns assets
```

```text
Old: [director-107] The bundle stops import before an asset
New: [director-107] The bundle helpers stop import before an asset
```

```text
Old: [director-107] The bundle stops import after a digest
New: [director-107] The bundle helpers stop import after a digest
```

```text
Old: [director-107] The bundle stops export before an asset
New: [director-107] The bundle helpers stop export before an asset
```

```text
Old: [director-107] The bundle stops export after asset bytes
New: [director-107] The bundle helpers stop export after asset bytes
```

```text
Old: [director-107] The bundle stops export after a digest
New: [director-107] The bundle helpers stop export after a digest
```

```text
Old: [director-098] The bundle helpers accept the character limit
New: [director-098] The import accepts the character limit and returns the project
```

```text
Old: [director-098] The bundle helpers accept the multibyte text limit
New: [director-098] The import returns one asset at the multibyte text limit and rejects one more byte
```

```text
Old: [director-098] The bundle helpers reject a null project
New: [director-098] The import rejects a null project
```

```text
Old: [director-098] The bundle helpers reject an invalid plain project
New: [director-098] The import rejects an invalid plain project
```

```text
Old: [director-099] The bundle helpers reject an extra top-level field
New: [director-099] The import rejects an extra top-level field
```

```text
Old: [director-099] The bundle helpers reject an invalid bundle project
New: [director-099] The import rejects an invalid bundle project
```

```text
Old: [director-099] The import accepts 64 distinct assets
New: [director-099] The import accepts 64 distinct assets and returns assets
```

```text
Old: [director-101] The resolver receives the data pack and signal
New: [director-101] The export calls the resolver with the data pack and signal
```

```text
Old: [director-102] The export accepts the text byte limit
New: [director-102] The export accepts the text byte limit and returns bundle text
```

```text
Old: [director-105] The byte store accepts the caller byte limit
New: [director-105] The store accepts the caller byte limit for the byte store and returns byte copies
```

```text
Old: [director-107] The share helpers remove the listener after success
New: [director-107] The helper removes its listener after success
```

```text
Old: [director-107] The share helpers remove the listener after error
New: [director-107] The helper removes its listener after error
```

```text
Old: [director-107] The share helpers remove the listener after cancel
New: [director-107] The helper removes its listener after cancel
```

```text
Old: [director-102] The export stops when the digest is absent after it reads one field
New: [director-102] The export reads an absent declared digest once before it writes the digest
```

```text
Old: [director-101] The filename slice starts at zero
New: [director-101] The export calls the filename slice with a start of zero
```

```text
Old: [director-098] The bundle rejects invalid JSON of 5242881 characters
New: [director-098] The import rejects invalid JSON of 5242881 characters
```

```text
Old: [director-098] The bundle rejects invalid JSON of 52428800 characters
New: [director-098] The import rejects invalid JSON of 52428800 characters
```

```text
Old: [director-099] The import accepts the standard alphabet +/+/
New: [director-099] The import accepts the standard alphabet +/+/ and returns assets
```

```text
Old: [director-099 director-101] The export uses the standard alphabet +/+/
New: [director-099 director-101] The export uses the standard alphabet +/+/ and returns bundle text
```

```text
Old: [director-099] The import accepts the standard alphabet /w==
New: [director-099] The import accepts the standard alphabet /w== and returns assets
```

```text
Old: [director-099 director-101] The export uses the standard alphabet /w==
New: [director-099 director-101] The export uses the standard alphabet /w== and returns bundle text
```

```text
Old: [director-099] The import accepts the standard alphabet +w==
New: [director-099] The import accepts the standard alphabet +w== and returns assets
```

```text
Old: [director-099 director-101] The export uses the standard alphabet +w==
New: [director-099 director-101] The export uses the standard alphabet +w== and returns bundle text
```

```text
Old: [director-099] The import accepts the standard alphabet +/8=
New: [director-099] The import accepts the standard alphabet +/8= and returns assets
```

```text
Old: [director-099 director-101] The export uses the standard alphabet +/8=
New: [director-099 director-101] The export uses the standard alphabet +/8= and returns bundle text
```

```text
Old: [director-099] The import accepts the standard alphabet AZaz09+/
New: [director-099] The import accepts the standard alphabet AZaz09+/ and returns assets
```

```text
Old: [director-099 director-101] The export uses the standard alphabet AZaz09+/
New: [director-099 director-101] The export uses the standard alphabet AZaz09+/ and returns bundle text
```

```text
Old: [director-098 director-107] The parser checks the signal before it checks the text type
New: [director-098 director-107] The import checks the signal before it checks the text type and rejects the call
```

```text
Old: [director-099] The import checks top-level fields before version
New: [director-099] The import checks top-level fields before version and rejects the call
```

```text
Old: [director-099] The import checks version before project
New: [director-099] The import checks version before project and rejects the call
```

```text
Old: [director-099] The import checks project before assets
New: [director-099] The import checks project before assets and rejects the call
```

```text
Old: [director-099] The import checks asset fields before path
New: [director-099] The import checks asset fields before path and rejects the call
```

```text
Old: [director-099] The import checks path before media type
New: [director-099] The import checks path before media type and rejects the call
```

```text
Old: [director-099] The import checks media type before duplicate path
New: [director-099] The import checks media type before duplicate path and rejects the call
```

```text
Old: [director-099] The import checks duplicate path before base64
New: [director-099] The import checks duplicate path before base64 and rejects the call
```

```text
Old: [director-099 director-107] The parser checks the signal before it checks asset fields
New: [director-099 director-107] The import checks the signal before it checks asset fields and rejects the call
```

```text
Old: [director-099] The import checks asset bytes before the digest call
New: [director-099] The import checks asset bytes before the digest call and rejects the call
```

```text
Old: [director-106] The reader checks the file limit before it reads the signal
New: [director-106] The share helpers check the file limit before they read the signal and reject the invalid input
```

```text
Old: [director-106 director-107] The reader checks the signal before it reads text
New: [director-106 director-107] The share helpers check the signal before they read text and reject the invalid input
```

```text
Old: [director-107] The reader checks the signal after the text promise settles
New: [director-107] The share helpers check the signal after the text promise settles and return the project
```

```text
Old: [director-102] The export checks the asset count before the next resolver call
New: [director-102] The export checks the asset count before the next resolver call and rejects the call
```

```text
Old: [director-102] The export checks bytes before the media type
New: [director-102] The export checks bytes before the media type and rejects the call
```

```text
Old: [director-102] The export checks the media type before the digest call
New: [director-102] The export checks the media type before the digest call and rejects the call
```

```text
Old: [director-102 director-107] The export checks the signal before it checks for an absent asset
New: [director-102 director-107] The export checks the signal before it checks for an absent asset and rejects the call
```

```text
Old: [director-102 director-107] The export checks the signal before declared integrity
New: [director-102 director-107] The export checks the signal before it checks declared integrity and rejects the call
```

```text
Old: [director-105] The store checks the signal before it checks the path
New: [director-105] The store checks the signal before it checks the path and rejects the call
```

```text
Old: [director-107] The helper attaches its listener before the source reads the work promise
New: [director-107] The helper attaches its listener before it reads the work promise
```

```text
Old: [director-107] The helper checks cancellation after listener removal
New: [director-107] The helper checks cancellation after listener removal and rejects the call
```

```text
Old: [director-099 director-102] The bundle rejects an SVG media type
New: [director-099 director-102] The bundle helpers reject an SVG media type during import and export
```

```text
Old: [director-108 director-110] The preview counts the second scene and shot
New: [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
```

```text
Old: [director-101] The export includes the asset of the second scene
New: [director-101] The export includes the asset of the second scene and returns bundle text
```

```text
Old: [director-101] The export encodes the second byte chunk
New: [director-101] The export encodes the second byte chunk and returns bundle text
```

```text
Old: [director-099] The import rejects script and adapters in the top-level object
New: [director-099] The import rejects the extra fields script and adapters in the top-level object
```

```text
Old: [director-099] The import rejects script and adapters in the asset
New: [director-099] The import rejects the extra fields script and adapters in the asset
```

```text
Old: [director-110] The preview accepts both configured layer IDs
New: [director-110] The preview reports no absent layer when both layer IDs are configured
```

```text
Old: [director-109] The preview accepts both configured source IDs
New: [director-109] The preview reports both configured sources as configured
```

```text
Old: [director-099] The import accepts a literal digest for three distinct bytes
New: [director-099] The import returns the bytes 1, 2 and 3 and the literal digest
```

## Pass 8

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

The glossary gives one name for each function actor.
The factory validates the directory; the source is the function that the factory returns.
No production function changes.
The limit for coordinate lengths records the untested addition of 5 to the set of lengths 2 and 3.

The pass adds no test body or hand row.
The automatic row statuses come from the source commit.
This pass changes their killer labels.
Three traversals use separate table rows for their hand rows.
The scope command counts 56 rows and 52 distinct traversals.

### Findings and searches

#### F1

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The reader checks.
The worker named the share helpers for file and text work.

```text
Command: taskset -c 12-15 nice -n 19 rg -n share helpers check openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
376:- **THEN** the share helpers check the file suffix and size before they read text
379:- **AND** The share helpers check the file limit before they read the signal and reject excess files.
390:- **AND** The share helpers check the signal before they read text and after the text promise settles. They reject cancellation.
```

#### F2

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: During export, the helper.
The worker named the bundle helpers for export signal checks.

```text
Command: taskset -c 12-15 nice -n 19 rg -n During export, the bundle helpers check openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
391:- **AND** During export, the bundle helpers check the signal before they check asset presence and declared integrity and reject cancellation.
```

#### F3

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The helper attaches.
The worker restored the helper as the actor that reads the work promise.

```text
Command: taskset -c 12-15 nice -n 19 rg -n helper attaches its listener before it reads openspec/changes/backfill-director-packs-sharing/../../../src/director/sharing/sharing.test.mjs
2553:test('[director-107] The helper attaches its listener before it reads the work promise', async () => {
```

#### F4

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The source registers.
The worker named the session for listener, state and work promise order.

```text
Command: taskset -c 12-15 nice -n 19 rg -n session attaches the source listener openspec/changes/backfill-director-packs-sharing/../../../src/director/packs/backfill.test.mjs
191:test('[director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order', async () => {
```

#### F5

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The export stops.
The worker stated one digest field access before the export writes the digest.

```text
Command: taskset -c 12-15 nice -n 19 rg -n declared digest openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
223:- **AND** The session checks total bytes before it reads the declared digest.
330:- **AND** The export checks declared byteLength before the declared digest and rejects an invalid asset.
332:- **AND** When the declared digest is absent, the export reads the digest field once before it writes the digest.
```

#### F6

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The caller destroys.
The worker stated the false result of the load call.

```text
Command: taskset -c 12-15 nice -n 19 rg -n caller signal destroys openspec/changes/backfill-director-packs-sharing/../../../src/director/packs/backfill.test.mjs
2968:test('[director-090] The load call returns false when the caller signal destroys the session after a source error', async () => {
```

#### F7

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The validator checks west.
The worker named edge comparison instead of field order.

```text
Command: taskset -c 12-15 nice -n 19 rg -n compares west with east openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
65:- **AND** The validator compares west with east before it compares south with north.
```

#### F8

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: the session calls the source.
The worker named pack.source.adapter for sources and pack.format for renderers.

```text
Command: taskset -c 12-15 nice -n 19 rg -n pack.source.adapter openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
155:- **AND** The session calls each source by pack.source.adapter and each renderer by pack.format. Both registries contain two entries.
```

#### F9

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The rows keep.
The worker restored each killer for m432, m434, m447 and m448.

```text
Command: taskset -c 12-15 nice -n 19 rg -n m432 openspec/changes/backfill-director-packs-sharing/audit.md
456:| Project scenes and their data packs | src/director/sharing/bundle.js:23 | [director-101] The export writes each asset index and filename | m432 |
```

#### F10

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The validator checks the list.
The worker named the session for the list check.

```text
Command: taskset -c 12-15 nice -n 19 rg -n session checks the list openspec/changes/backfill-director-packs-sharing/../../../src/director/packs/backfill.test.mjs
317:test('[director-088] The session checks the list before it reads the anchors', async () => {
```

#### M1

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: the original test.
The worker named commands separately from test functions.

```text
Command: taskset -c 12-15 nice -n 19 rg -n 3849 mutations openspec/changes/backfill-director-packs-sharing/audit.md
41:The tool generated 3849 mutations.
69:The old set has 3849 mutations. It gives 3718 killed, 64 timeout, 3 crash and 64 survived results.
97:The command ended with exit status 0 after it tested 3849 mutations.
162:Campaign 2 ran the 3849 mutations first.
```

#### M2

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: edit as a noun.
The worker changed noun uses and removed the false preview state claim.

```text
Command: taskset -c 12-15 nice -n 19 rg -n The worker adds seven openspec/changes/backfill-director-packs-sharing/evidence.md
3045:The worker adds seven backfill tests and six sharing tests.
```

#### M3

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: existing scenario IDs.
The worker used the scenario IDs of this change and a finite sentence.

```text
Command: taskset -c 12-15 nice -n 19 rg -n They use only openspec/changes/backfill-director-packs-sharing/evidence.md
3046:They use only the scenario IDs of this change.
```

#### M4

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The preview accepts.
The worker stated preview reports and the import byte and digest result.

```text
Command: taskset -c 12-15 nice -n 19 rg -n returns the bytes 1 openspec/changes/backfill-director-packs-sharing/../../../src/director/sharing/sharing.test.mjs
2899:test('[director-099] The import returns the bytes 1, 2 and 3 and the literal digest', async () => {
```

#### M5

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: before declared integrity.
The worker added the verb for the declared integrity check.

```text
Command: taskset -c 12-15 nice -n 19 rg -n it checks declared integrity openspec/changes/backfill-director-packs-sharing/../../../src/director/sharing/sharing.test.mjs
2516:    'it checks declared integrity',
```

#### M6

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: rejects script and adapters.
The worker named script and adapters as extra fields.

```text
Command: taskset -c 12-15 nice -n 19 rg -n rejects the extra fields openspec/changes/backfill-director-packs-sharing/../../../src/director/packs/backfill.test.mjs
3257:  test(`[director-${tag}] The validator rejects the extra fields script and adapters in the ${label}`, () => {
```

#### M7

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: the parser.
The worker used import for parseSceneShare.

```text
Command: taskset -c 12-15 nice -n 19 rg -n The import checks asset fields openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
297:- **AND** The import checks asset fields, path, media type, duplicate path and base64 in that order and rejects an invalid asset.
```

#### M8

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: without the old source signal state.
The worker stated no source signal access and a false result.

```text
Command: taskset -c 12-15 nice -n 19 rg -n does not read the old source signal state openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
188:- **AND** After the caller clears the session, the session does not read the old source signal state and returns false.
```

#### M9

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: byteLength and the digest.
The worker restored byteLength before digest before placement.

```text
Command: taskset -c 12-15 nice -n 19 rg -n checks byteLength before the digest openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
55:- **AND** The validator checks byteLength before the digest, and the digest before it reads the placement.
```

#### M10

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The stream test supplies.
The worker named the source that stops before the second chunk.

```text
Command: taskset -c 12-15 nice -n 19 rg -n The stream test supplies two chunks. openspec/changes/backfill-director-packs-sharing/audit.md
511:The stream test supplies two chunks. The source stops when it checks the signal before the second chunk.
```

#### M11

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The source rejects the file protocol and.
The worker used separate sentences for protocol and cancellation.

```text
Command: taskset -c 12-15 nice -n 19 rg -n After cancellation before the second chunk openspec/changes/backfill-director-packs-sharing/evidence.md
3019:| S9 | The validator checks | The clause states rejection of the invalid second declaration. The source rejects the file protocol. After cancellation before the second chunk, the source reads only the first chunk. |
```

#### M12

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: No review report.
The worker stated the scope of the worker.

```text
Command: taskset -c 12-15 nice -n 19 rg -n The worker changes no review report openspec/changes/backfill-director-packs-sharing/evidence.md
2670:The worker changes no review report, main spec, trace ledger or QA script.
3399:The worker changes no review report, main spec, trace ledger or QA script.
```

#### M13

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: because it has 28 words.
The worker named the sentence and corrected the rerun phrase.

```text
Command: taskset -c 12-15 nice -n 19 rg -n because the sentence has 28 words openspec/changes/backfill-director-packs-sharing/design.md
180:The prose gate rejects the requested preview sentence because the sentence has 28 words.
```

#### M14

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: Known limit host-gates.
The worker moved process notes under the Known limits section as Pass 7 notes.

```text
Command: taskset -c 12-15 nice -n 19 rg -n Pass 7 note openspec/changes/backfill-director-packs-sharing/proposal.md
75:### Pass 7 notes
82:- Pass 7 note `host-gates`: the lead runs image gates, ratchet and review round 6.
85:- Pass 7 note `predispatch-code-fence`: the predispatch checker treats the production identifiers `MIME` and `SHA-256` inside JavaScript fences as prose.
87:- Pass 7 note `predispatch-run-name`: task 9.11 uses the wording that the lead gives.
```

#### M15

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: MIME and SHA-256.
The worker marked the production identifiers as code.

```text
Command: taskset -c 12-15 nice -n 19 rg -n `MIME` and `SHA-256` openspec/changes/backfill-director-packs-sharing/evidence.md
3087:The code identifiers `MIME` and `SHA-256` give abbreviation reports in the mutation spans.
3448:The code fence limit applies to `MIME` and `SHA-256` in mutation spans.
```

#### M16

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: counts the second scene and shot.
The worker added the second asset bytes to the title.

```text
Command: taskset -c 12-15 nice -n 19 rg -n adds the bytes of the second asset openspec/changes/backfill-director-packs-sharing/../../../src/director/sharing/sharing.test.mjs
2717:test('[director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset', () => {
```

#### M17

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: Asset store replacement Map.
The worker used Map of the asset store and entries of each registry.

```text
Command: taskset -c 12-15 nice -n 19 rg -n Map of the asset store openspec/changes/backfill-director-packs-sharing/audit.md
485:| Replacement Map of the asset store | src/director/sharing/bundle.js:202 | [director-104] The store counts the second asset | m472 |
486:| Snapshot Map of the asset store | src/director/sharing/bundle.js:207 | [director-104] The store counts the second asset | m473 |
```

#### Spec 1

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: The four new Known limits.
The worker moved limits and named additions to every closed set, with coordinate lengths.

```text
Command: taskset -c 12-15 nice -n 19 rg -n closed-set-added-members openspec/changes/backfill-director-packs-sharing/proposal.md
68:- Known limit `closed-set-added-members`: the automatic tool does not add members to any closed set.
```

#### Spec 2

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: Rows name one test.
The worker named each killer with its hand row.

```text
Command: taskset -c 12-15 nice -n 19 rg -n m434 openspec/changes/backfill-director-packs-sharing/audit.md
462:| Export data packs | src/director/sharing/bundle.js:143 | [director-101] The export writes each asset index and filename | m434 |
```

#### Spec 3

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: before the source reads.
The worker named the helper and the session in titles.

```text
Command: taskset -c 12-15 nice -n 19 rg -n helper attaches its listener openspec/changes/backfill-director-packs-sharing/../../../src/director/sharing/sharing.test.mjs
2553:test('[director-107] The helper attaches its listener before it reads the work promise', async () => {
```

#### Spec 4

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: calls the source and renderer.
The worker stated the distinct registry keys.

```text
Command: taskset -c 12-15 nice -n 19 rg -n pack.format openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
27:#### Scenario: Data pack formats `director-077`
155:- **AND** The session calls each source by pack.source.adapter and each renderer by pack.format. Both registries contain two entries.
```

#### Spec 5

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: dropped the order.
The worker restored integrity order and no old signal access.

```text
Command: taskset -c 12-15 nice -n 19 rg -n byteLength before the digest openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
55:- **AND** The validator checks byteLength before the digest, and the digest before it reads the placement.
```

#### Spec 6

Source commit: `f8f6a94d2d09489b98fda4d063b8612f766f5dfa`.

First words: Two new tests.
The worker tagged GeoJSON and media extra fields with director-077.

```text
Command: taskset -c 12-15 nice -n 19 rg -n 077.*,.*placement openspec/changes/backfill-director-packs-sharing/../../../src/director/packs/backfill.test.mjs
3253:  ['077', 'GeoJSON placement', pack, p => p.placement, 'pack.placement'],
3255:  ['077', 'media placement', () => ({ ...pack(), format: 'media', placement: { anchorId: 'anchor' } }), p => p.placement, 'pack.placement'],
```

### repeated titles

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/check-echoes.py
{
  "sourceCommit": "f8f6a94d2d09489b98fda4d063b8612f766f5dfa",
  "sourceTitleTemplates": 498,
  "liveTitles": 705,
  "checkedLabels": 5193,
  "oldRecordsExcluded": 765,
  "truncatedKillerLabels": 0,
  "staleLabels": []
}
```

### final-tests

```text
Command: The command in each test record gives the test process.
[
  {
    "name": "backfill",
    "exit": 0,
    "command": "taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs",
    "summary": [
      "\u2139 tests 430",
      "\u2139 suites 0",
      "\u2139 pass 430",
      "\u2139 fail 0",
      "\u2139 cancelled 0",
      "\u2139 skipped 0",
      "\u2139 todo 0",
      "\u2139 duration_ms 2201.062421"
    ]
  },
  {
    "name": "packs",
    "exit": 0,
    "command": "taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs",
    "summary": [
      "\u2139 tests 12",
      "\u2139 suites 0",
      "\u2139 pass 12",
      "\u2139 fail 0",
      "\u2139 cancelled 0",
      "\u2139 skipped 0",
      "\u2139 todo 0",
      "\u2139 duration_ms 7539.853399"
    ]
  },
  {
    "name": "sharing",
    "exit": 0,
    "command": "taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs",
    "summary": [
      "\u2139 tests 228",
      "\u2139 suites 0",
      "\u2139 pass 228",
      "\u2139 fail 0",
      "\u2139 cancelled 0",
      "\u2139 skipped 0",
      "\u2139 todo 0",
      "\u2139 duration_ms 19578.172424"
    ]
  }
]
```

### self-check

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/self-check.py
{
  "sourceCommit": "f8f6a94d2d09489b98fda4d063b8612f766f5dfa",
  "productionFilesRead": 7,
  "testTemplatesRead": 487,
  "scenarioResultsRead": 227,
  "scenarioIds": 35,
  "actorFailures": 0,
  "outcomeFailures": 0,
  "checks": {
    "promiseActor": true,
    "helperPromise": true,
    "edgeComparison": true,
    "registryKeys": true,
    "absentDigestContinues": true,
    "coordinateLengthSet": true
  },
  "catalog": "/home/ianblenke/docker/gev-tools/director-3/pass8/self-check-catalog.json"
}
```

### coverage

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/coverage-summary.py
[
  {
    "file": "packs/manifest.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-packs-manifest /home/ianblenke/docker/gev-work/director-3/src/director/packs/manifest.js",
    "counts": {
      "LF": 138,
      "LH": 138,
      "BRF": 56,
      "BRH": 56,
      "FNF": 13,
      "FNH": 13
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  },
  {
    "file": "packs/geojson.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-packs-geojson /home/ianblenke/docker/gev-work/director-3/src/director/packs/geojson.js",
    "counts": {
      "LF": 62,
      "LH": 62,
      "BRF": 54,
      "BRH": 54,
      "FNF": 7,
      "FNH": 7
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  },
  {
    "file": "packs/session.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-packs-session /home/ianblenke/docker/gev-work/director-3/src/director/packs/session.js",
    "counts": {
      "LF": 159,
      "LH": 159,
      "BRF": 81,
      "BRH": 81,
      "FNF": 18,
      "FNH": 18
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  },
  {
    "file": "packs/source.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-packs-source /home/ianblenke/docker/gev-work/director-3/src/director/packs/source.js",
    "counts": {
      "LF": 67,
      "LH": 67,
      "BRF": 37,
      "BRH": 37,
      "FNF": 4,
      "FNH": 4
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  },
  {
    "file": "sharing/bundle.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-sharing-bundle /home/ianblenke/docker/gev-work/director-3/src/director/sharing/bundle.js",
    "counts": {
      "LF": 221,
      "LH": 221,
      "BRF": 103,
      "BRH": 103,
      "FNF": 21,
      "FNH": 21
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  },
  {
    "file": "sharing/lifetime.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-sharing-lifetime /home/ianblenke/docker/gev-work/director-3/src/director/sharing/lifetime.js",
    "counts": {
      "LF": 26,
      "LH": 26,
      "BRF": 13,
      "BRH": 13,
      "FNF": 6,
      "FNH": 6
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  },
  {
    "file": "sharing/preview.js",
    "command": "Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass8/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass8/v8-sharing-preview /home/ianblenke/docker/gev-work/director-3/src/director/sharing/preview.js",
    "counts": {
      "LF": 43,
      "LH": 43,
      "BRF": 22,
      "BRH": 22,
      "FNF": 10,
      "FNH": 10
    },
    "linePercent": 100,
    "branchPercent": 100,
    "functionPercent": 100
  }
]
```

### survivor-labels

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/regenerate-survivors.py
{
  "sourceCommit": "f8f6a94d2d09489b98fda4d063b8612f766f5dfa",
  "counts": {
    "rows": 971,
    "killed": 840,
    "equivalent": 127,
    "knownLimit": 4,
    "oldRows": 260,
    "extensionRows": 711
  },
  "correctedRows": []
}
```

### scope

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/scope.py
{
  "sourceCommit": "f8f6a94d2d09489b98fda4d063b8612f766f5dfa",
  "handRows": 479,
  "killed": 477,
  "survivors": [
    "m172",
    "m389"
  ],
  "skipped": 0,
  "timeouts": 0,
  "productionFilesUnchanged": [
    "src/director/packs/manifest.js",
    "src/director/packs/geojson.js",
    "src/director/packs/session.js",
    "src/director/packs/source.js",
    "src/director/sharing/bundle.js",
    "src/director/sharing/lifetime.js",
    "src/director/sharing/preview.js"
  ],
  "changedFiles": [
    "openspec/changes/backfill-director-packs-sharing/audit.md",
    "openspec/changes/backfill-director-packs-sharing/design.md",
    "openspec/changes/backfill-director-packs-sharing/evidence.md",
    "openspec/changes/backfill-director-packs-sharing/evidence/probe-repeat-json-error.txt",
    "openspec/changes/backfill-director-packs-sharing/mutations.md",
    "openspec/changes/backfill-director-packs-sharing/probe-ranges.md",
    "openspec/changes/backfill-director-packs-sharing/proposal.md",
    "openspec/changes/backfill-director-packs-sharing/specs/director/spec.md",
    "openspec/changes/backfill-director-packs-sharing/survivors.md",
    "openspec/changes/backfill-director-packs-sharing/tasks.md",
    "src/director/packs/backfill.test.mjs",
    "src/director/sharing/sharing.test.mjs"
  ],
  "requirementSentencesUnchanged": true,
  "loopTableRows": 56,
  "traversals": 52,
  "traversalFiles": 6
}
```

### lint-final

```text
Command: taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint
WARN STE-NOUN openspec/changes/archive/2026-09-16-establish-spec-governance/specs/coverage-gate/spec.md:244 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-16-establish-spec-governance/specs/coverage-gate/spec.md:245 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-16-establish-spec-governance/specs/coverage-gate/spec.md:246 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-17-harden-gate-ledger/specs/coverage-gate/spec.md:73 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-17-harden-gate-ledger/specs/coverage-gate/spec.md:74 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-17-harden-gate-ledger/specs/coverage-gate/spec.md:75 Check for a verb used as a noun: "skip"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-17-osh-fusion/design.md:35 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-17-osh-fusion/proposal.md:70 Use "clear", not "explicit"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-17-osh-fusion/specs/osh/spec.md:172 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-17-osh-fusion/specs/osh/spec.md:179 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-17-osh-fusion/specs/osh/spec.md:251 Use "clear", not "explicit"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/design.md:17 Check the -ing word "hiding"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/design.md:33 Check the -ing word "hosting"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/design.md:43 Check the -ing word "sampling"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/design.md:52 Check for passive voice: "is required"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/design.md:66 Check for passive voice: "is named"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/design.md:68 Check for passive voice: "is unmeasured"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:13 Check the -ing word "rebuilding"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:19 Check for passive voice: "are cached"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:21 Check the -ing word "hosting"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:27 Check the -ing word "handling"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:38 Check for passive voice: "are modified"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:38 Check for passive voice: "are added"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:39 Check for passive voice: "is added"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:39 Check the -ing word "reading"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/proposal.md:52 Check the -ing word "growing"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-18-osh-geo-discovery/specs/osh/spec.md:27 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-18-osh-geo-discovery/specs/osh/spec.md:35 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-18-osh-geo-discovery/specs/osh/spec.md:64 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/specs/osh/spec.md:82 Check for passive voice: "is given"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/specs/osh/spec.md:136 Check for passive voice: "is removed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-18-osh-geo-discovery/specs/osh/spec.md:146 Use "clear", not "explicit"
WARN STE-NOUN openspec/changes/archive/2026-09-18-osh-geo-discovery/tasks.md:21 Check for a verb used as a noun: "skip"
WARN STE-ING openspec/changes/archive/2026-09-18-osh-geo-discovery/tasks.md:47 Check the -ing word "fetching"
WARN STE-NOUN openspec/changes/archive/2026-09-18-osh-geo-discovery/tasks.md:71 Check for a verb used as a noun: "abort"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/tasks.md:104 Check for passive voice: "is dropped"
WARN STE-PASSIVE openspec/changes/archive/2026-09-18-osh-geo-discovery/tasks.md:105 Check for passive voice: "is removed"
WARN STE-NOUN openspec/changes/archive/2026-09-18-osh-geo-discovery/tasks.md:108 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/design.md:5 Check the -ing word "morning"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/design.md:5 Check the -ing word "evening"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/design.md:9 Check the -ing word "evening"
WARN STE-PASSIVE openspec/changes/archive/2026-09-19-osh-observation-age/design.md:31 Check for passive voice: "is ruled"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/design.md:31 Check the -ing word "reading"
WARN STE-PASSIVE openspec/changes/archive/2026-09-19-osh-observation-age/design.md:41 Check for passive voice: "are pinned"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/design.md:61 Check the -ing word "reading"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/design.md:61 Check the -ing word "trusting"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:3 Check the -ing word "moving"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:5 Check the -ing word "morning"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:5 Check the -ing word "evening"
WARN STE-PASSIVE openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:7 Check for passive voice: "is named"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:9 Check the -ing word "evening"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:9 Check the -ing word "reading"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:9 Check the -ing word "Treating"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:9 Check the -ing word "refusing"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:9 Check the -ing word "reading"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:11 Check the -ing word "evening"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:15 Check the -ing word "reading"
WARN STE-PASSIVE openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:25 Check for passive voice: "are modified"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:30 Check the -ing word "morning"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:30 Check the -ing word "evening"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:35 Check the -ing word "morning"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:35 Check the -ing word "evening"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:37 Check the -ing word "evening"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:37 Check the -ing word "reading"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:38 Use "clear", not "explicit"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/proposal.md:38 Check the -ing word "evening"
WARN STE-PASSIVE openspec/changes/archive/2026-09-19-osh-observation-age/specs/osh/spec.md:41 Check for passive voice: "is given"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/specs/osh/spec.md:74 Check the -ing word "reading"
WARN STE-PASSIVE openspec/changes/archive/2026-09-19-osh-observation-age/specs/osh/spec.md:102 Check for passive voice: "is removed"
WARN STE-ING openspec/changes/archive/2026-09-19-osh-observation-age/tasks.md:14 Check the -ing word "reading"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:3 Check for passive voice: "are measured"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:3 Check the -ing word "wrapping"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:15 Check the -ing word "reporting"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:30 Check for passive voice: "are recognised"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:31 Check for passive voice: "is accepted"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:34 Check the -ing word "binding"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:36 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:44 Check the -ing word "carrying"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:49 Check for passive voice: "is checked"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:49 Check for passive voice: "is skipped"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:49 Check the -ing word "naming"
WARN STE-NOUN openspec/changes/archive/2026-09-20-osh-location-streams/design.md:59 Check for a verb used as a noun: "read"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:63 Check the -ing word "trusting"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:63 Check the -ing word "growing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:67 Check for passive voice: "is dropped"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:68 Check for passive voice: "is dropped"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:68 Check the -ing word "naming"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:68 Check the -ing word "naming"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:74 Check for passive voice: "is removed"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:74 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:74 Check the -ing word "handling"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:74 Check the -ing word "reporting"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:78 Check the -ing word "failing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:86 Check for passive voice: "is confirmed"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:86 Check the -ing word "tracing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:88 Check the -ing word "calling"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:89 Check the -ing word "parsing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:89 Check the -ing word "accepting"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/design.md:91 Check the -ing word "calling"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:92 Check for passive voice: "are checked"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/design.md:92 Check for passive voice: "is called"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:5 Check the -ing word "wrapping"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:15 Check for passive voice: "is bounded"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:15 Check for passive voice: "is accepted"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:16 Check the -ing word "reporting"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:19 Check for passive voice: "is dropped"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:29 Check for passive voice: "are modified"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:29 Check for passive voice: "is added"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:30 Check for passive voice: "is unchanged"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:30 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:36 Check the -ing word "reporting"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:42 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:43 Check for passive voice: "is named"
WARN STE-NOUN openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:43 Check for a verb used as a noun: "read"
WARN STE-NOUN openspec/changes/archive/2026-09-20-osh-location-streams/proposal.md:43 Check for a verb used as a noun: "read"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:4 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:12 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:42 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:49 Check for passive voice: "is dropped"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:51 Check for passive voice: "is dropped"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:51 Check the -ing word "naming"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:59 Check the -ing word "walking"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:79 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:149 Check for passive voice: "is given"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:189 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:216 Check for passive voice: "is removed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:241 Use "clear", not "explicit"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:255 Check for passive voice: "is walked"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:257 Check for passive voice: "is skipped"
WARN STE-NOUN openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:258 Check for a verb used as a noun: "skip"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:261 Check for passive voice: "is served"
WARN STE-NOUN openspec/changes/archive/2026-09-20-osh-location-streams/specs/osh/spec.md:273 Check for a verb used as a noun: "read"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:22 Check the -ing word "missing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:25 Check for passive voice: "is green"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:29 Check for passive voice: "is green"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:31 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:33 Check for passive voice: "is green"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:35 Check the -ing word "winning"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:38 Check for passive voice: "is green"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:43 Check the -ing word "trailing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:44 Check for passive voice: "is green"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:47 Check for passive voice: "is green"
WARN STE-NOUN openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:50 Check for a verb used as a noun: "read"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:53 Check for passive voice: "is green"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:58 Check the -ing word "landing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:58 Check the -ing word "existing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:60 Check for passive voice: "are green"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:62 Check the -ing word "naming"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:69 Check for passive voice: "is green"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:76 Check for passive voice: "are green"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:76 Check the -ing word "bookkeeping"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:83 Check the -ing word "keeping"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:85 Check for passive voice: "is carried"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:87 Check the -ing word "standing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:88 Check for passive voice: "are green"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:90 Check for passive voice: "is unchanged"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:92 Use "shown", not "exposed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:105 Check for passive voice: "is placed"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:105 Check the -ing word "naming"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:105 Check the -ing word "asserting"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:107 Check the -ing word "asserting"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:124 Check the -ing word "surviving"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:132 Check for passive voice: "be honoured"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:133 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-location-streams/tasks.md:140 Check the -ing word "keeping"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-20-osh-marker-depth/design.md:11 Use "shows", not "exposes"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-marker-depth/design.md:34 Check for passive voice: "be buried"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-marker-depth/proposal.md:39 Check the -ing word "answering"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-marker-depth/tasks.md:36 Check for passive voice: "is green"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-osh-marker-depth/tasks.md:53 Check for passive voice: "is green"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-marker-depth/tasks.md:67 Check the -ing word "having"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-marker-depth/tasks.md:67 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-20-osh-marker-depth/tasks.md:67 Check the -ing word "missing"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/design.md:30 Check for a verb used as a noun: "read"
WARN STE-PASSIVE openspec/changes/archive/2026-09-20-test-teardown-cleanup/design.md:36 Check for passive voice: "is unreached"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/design.md:36 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/design.md:36 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/tasks.md:49 Check for a verb used as a noun: "read"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/tasks.md:49 Check for a verb used as a noun: "read"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/tasks.md:55 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-20-test-teardown-cleanup/tasks.md:56 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-09-20-test-teardown-cleanup/tasks.md:113 Check the -ing word "including"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-22-teardown-guard/proposal.md:38 Use "shows", not "exposes"
WARN STE-PASSIVE openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:4 Check for passive voice: "is modified"
WARN STE-PASSIVE openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:34 Check for passive voice: "is unchanged"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:121 Use "check", not "verify"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:128 Use "checked", not "verified"
WARN STE-ING openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:134 Check the -ing word "moving"
WARN STE-ING openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:134 Check the -ing word "gaining"
WARN STE-ING openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:139 Check the -ing word "matching"
WARN STE-ING openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:140 Check the -ing word "undercounting"
WARN STE-ING openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:141 Check the -ing word "extracting"
WARN STE-PASSIVE openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:143 Check for passive voice: "was corrected"
WARN STE-PASSIVE openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:143 Check for passive voice: "was fixed"
WARN STE-ING openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:143 Check the -ing word "confirming"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:144 Use "allows", not "permits"
WARN STE-PASSIVE openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:144 Check for passive voice: "are accepted"
WARN STE-PASSIVE openspec/changes/archive/2026-09-22-teardown-guard/tasks.md:144 Check for passive voice: "is cross-referenced"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:7 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:15 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:35 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:41 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:43 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:67 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/design.md:101 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/proposal.md:11 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/proposal.md:19 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/proposal.md:45 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/proposal.md:46 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/proposal.md:47 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/proposal.md:49 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/specs/coverage-gate/spec.md:4 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/specs/coverage-gate/spec.md:4 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/specs/coverage-gate/spec.md:4 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/specs/coverage-gate/spec.md:7 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/specs/coverage-gate/spec.md:9 Check the -ing word "blocking"
WARN STE-ING openspec/changes/archive/2026-09-23-gate-measurement-race/tasks.md:13 Check the -ing word "blocking"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-23-ledger-waiver/design.md:3 Use "runs", not "executes"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-23-ledger-waiver/design.md:52 Use "runs", not "executes"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-23-ledger-waiver/design.md:56 Use "run", not "executed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-23-ledger-waiver/design.md:124 Use "run", not "executed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-23-ledger-waiver/proposal.md:3 Use "runs", not "executes"
WARN STE-ING openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md:38 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md:44 Check the -ing word "running"
WARN STE-ING openspec/changes/archive/2026-09-24-ci-leak-cleanup/proposal.md:5 Check the -ing word "onboarding"
WARN STE-ING openspec/changes/archive/2026-09-24-ci-leak-cleanup/proposal.md:25 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-24-ci-leak-cleanup/tasks.md:38 Check the -ing word "pending"
WARN STE-NOUN openspec/changes/archive/2026-09-24-ci-node-24-skip/design.md:22 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-24-ci-node-24-skip/design.md:26 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/changes/archive/2026-09-24-ci-node-24-skip/proposal.md:26 Check for a verb used as a noun: "skip"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:5 Check the -ing word "geocoding"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/design.md:10 Use "shows", not "exposes"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:17 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:37 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:61 Check the -ing word "geocoding"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/design.md:81 Use "shows", not "exposes"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:158 Check the -ing word "geocoding"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/design.md:177 Use "run", not "execute"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/design.md:177 Use "runs", not "executes"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:174 Check the -ing word "closing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-credential-boundary/design.md:181 Check for passive voice: "are covered"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:249 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:250 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/design.md:252 Check the -ing word "setting"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:4 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:5 Check the -ing word "geocoding"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:9 Use "shows", not "exposes"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:14 Use "show", not "expose"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:16 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:65 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:84 Check the -ing word "Geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:86 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:94 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:95 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/proposal.md:96 Check the -ing word "geocoding"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:4 Use "show", not "expose"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:47 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:48 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:68 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:82 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:92 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:93 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/specs/credential-boundary/spec.md:109 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:112 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:155 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:156 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:157 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:158 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:159 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:160 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:161 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:162 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:163 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-24-credential-boundary/tasks.md:163 Check the -ing word "geocoding"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:3 Check for passive voice: "is dropped"
WARN STE-NOUN openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:44 Check for a verb used as a noun: "read"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:94 Check for passive voice: "is dropped"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:104 Check for passive voice: "was weighed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:104 Check for passive voice: "is rejected"
WARN STE-ING openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:108 Check the -ing word "failing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/design.md:112 Check for passive voice: "is bounded"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/proposal.md:28 Check for passive voice: "are modified"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/proposal.md:28 Check for passive voice: "are added"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/proposal.md:46 Check for passive voice: "is dropped"
WARN STE-ING openspec/changes/archive/2026-09-24-osh-draw-unheld-features/proposal.md:46 Check the -ing word "existing"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:4 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:12 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:42 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:49 Check for passive voice: "is dropped"
WARN STE-ING openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:61 Check the -ing word "walking"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:81 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:104 Check for passive voice: "is given"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:144 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:145 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/specs/osh/spec.md:173 Check for passive voice: "is removed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:4 Check for passive voice: "was archived"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:7 Check for passive voice: "was checked"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:26 Check for passive voice: "is moved"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:30 Check for passive voice: "is green"
WARN STE-ING openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:53 Check the -ing word "grouping"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:71 Check for passive voice: "are green"
WARN STE-NOUN openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:90 Check for a verb used as a noun: "destroy"
WARN STE-PASSIVE openspec/changes/archive/2026-09-24-osh-draw-unheld-features/tasks.md:102 Check for passive voice: "is green"
WARN STE-ING openspec/changes/archive/2026-09-26-backfill-cyclones/proposal.md:27 Check the -ing word "rendering"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/proposal.md:68 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/proposal.md:78 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:77 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:96 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:101 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:103 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:200 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:202 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:207 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:256 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:258 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/specs/cyclones/spec.md:259 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-09-26-backfill-cyclones/tasks.md:80 Check the -ing word "rendering"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/tasks.md:86 Check for a verb used as a noun: "skip"
WARN STE-ING openspec/changes/archive/2026-09-26-backfill-cyclones/tasks.md:126 Check the -ing word "missing"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-cyclones/tasks.md:131 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-09-26-backfill-cyclones/tasks.md:147 Check the -ing word "pending"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/design.md:25 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/design.md:29 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/proposal.md:10 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/proposal.md:10 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/specs/layer-lifecycle/spec.md:4 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/specs/layer-lifecycle/spec.md:7 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/tasks.md:10 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/tasks.md:11 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-09-26-backfill-layer-lifecycle/tasks.md:12 Check for a verb used as a noun: "destroy"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/design.md:8 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/design.md:34 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/design.md:65 Check the -ing word "pending"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-26-qa-script-register/design.md:102 Use "keep", not "retain"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/proposal.md:113 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/proposal.md:121 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/specs/qa-scripts/spec.md:39 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/specs/qa-scripts/spec.md:40 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/specs/qa-scripts/spec.md:43 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/specs/qa-scripts/spec.md:44 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/specs/qa-scripts/spec.md:81 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/tasks.md:32 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/tasks.md:34 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/tasks.md:35 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/tasks.md:37 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-qa-script-register/tasks.md:62 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:31 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-26-upstream-sync/specs/credential-boundary/spec.md:3 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-26-upstream-sync/specs/credential-boundary/spec.md:4 Check the -ing word "geocoding"
WARN STE-ING openspec/changes/archive/2026-09-26-upstream-sync/specs/credential-boundary/spec.md:23 Check the -ing word "geocoding"
WARN STE-PASSIVE openspec/changes/archive/2026-09-26-upstream-sync/specs/osh/spec.md:12 Check for passive voice: "is given"
WARN STE-PASSIVE openspec/changes/archive/2026-09-26-upstream-sync/specs/osh/spec.md:52 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-26-upstream-sync/specs/osh/spec.md:53 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/changes/archive/2026-09-26-upstream-sync/specs/osh/spec.md:81 Check for passive voice: "is removed"
WARN STE-NOUN openspec/changes/archive/2026-09-27-backfill-live-sources/design.md:33 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-27-backfill-live-sources/tasks.md:8 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-27-backfill-perimeters/specs/perimeters/spec.md:17 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-27-backfill-perimeters/specs/perimeters/spec.md:64 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-09-27-backfill-perimeters/specs/perimeters/spec.md:194 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/design.md:3 Check the -ing word "Adding"
WARN STE-PASSIVE openspec/changes/archive/2026-09-28-osh-control-auto-targets/design.md:33 Check for passive voice: "is unchanged"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/design.md:34 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/design.md:48 Check the -ing word "matching"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-28-osh-control-auto-targets/design.md:52 Use "show", not "expose"
WARN STE-PASSIVE openspec/changes/archive/2026-09-28-osh-control-auto-targets/design.md:58 Check for passive voice: "is unaffected"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/proposal.md:7 Check the -ing word "BREAKING"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/proposal.md:8 Check the -ing word "BREAKING"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-28-osh-control-auto-targets/proposal.md:33 Use "show", not "expose"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/specs/osh-control/spec.md:78 Check the -ing word "matching"
WARN STE-PASSIVE openspec/changes/archive/2026-09-28-osh-control-auto-targets/tasks.md:8 Check for passive voice: "is carried"
WARN STE-NOUN openspec/changes/archive/2026-09-28-osh-control-auto-targets/tasks.md:38 Check for a verb used as a noun: "read"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-control-auto-targets/tasks.md:52 Check the -ing word "reading"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-mavlink-control/design.md:272 Check the -ing word "calling"
WARN STE-PASSIVE openspec/changes/archive/2026-09-28-osh-mavlink-control/proposal.md:23 Check for passive voice: "was written"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-mavlink-control/specs/osh-control/spec.md:38 Check the -ing word "matching"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-mavlink-control/tasks.md:13 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-mavlink-control/tasks.md:26 Check the -ing word "parsing"
WARN STE-ING openspec/changes/archive/2026-09-28-osh-mavlink-control/tasks.md:99 Check the -ing word "handling"
WARN STE-ING openspec/changes/archive/2026-09-29-backfill-osh-control-options/design.md:5 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-29-backfill-osh-control-options/design.md:27 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-09-29-backfill-osh-control-options/design.md:37 Check the -ing word "passing"
WARN STE-ING openspec/changes/archive/2026-09-29-backfill-osh-control-options/proposal.md:5 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-09-29-backfill-osh-control-options/tasks.md:6 Check the -ing word "existing"
WARN STE-PASSIVE openspec/changes/archive/2026-09-29-backfill-osh-control-options/tasks.md:9 Check for passive voice: "are needed"
WARN STE-WORD-OLD openspec/changes/archive/2026-09-29-backfill-wind/specs/wind/spec.md:71 Use "closes", not "dismisses"
WARN STE-NOUN openspec/changes/archive/2026-09-29-backfill-wind/specs/wind/spec.md:190 Check for a verb used as a noun: "abort"
WARN STE-PASSIVE openspec/changes/archive/2026-09-29-osh-control-panel-layout/design.md:25 Check for passive voice: "is defined"
WARN STE-ING openspec/changes/archive/2026-09-29-osh-control-panel-layout/design.md:33 Check the -ing word "padding"
WARN STE-PASSIVE openspec/changes/archive/2026-09-29-osh-control-panel-layout/design.md:37 Check for passive voice: "was considered"
WARN STE-PASSIVE openspec/changes/archive/2026-09-29-osh-control-panel-layout/design.md:44 Check for passive voice: "is retired"
WARN STE-ING openspec/changes/archive/2026-09-29-osh-control-panel-layout/proposal.md:9 Check the -ing word "spacing"
WARN STE-ING openspec/changes/archive/2026-09-29-osh-control-panel-layout/tasks.md:22 Check the -ing word "padding"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:67 Check the -ing word "including"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:111 Check the -ing word "failing"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:117 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:123 Check the -ing word "moving"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:123 Check the -ing word "unpinning"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:129 Check the -ing word "shrinking"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:141 Check the -ing word "being"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:183 Check the -ing word "pinning"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:201 Check the -ing word "publishing"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:207 Check the -ing word "scrubbing"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:213 Check the -ing word "turning"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:213 Check the -ing word "pending"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:219 Check the -ing word "merging"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:225 Check the -ing word "leaving"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:231 Check the -ing word "sensing"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:243 Check the -ing word "reading"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:249 Check the -ing word "holding"
WARN STE-ING openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:255 Check the -ing word "moving"
WARN STE-PASSIVE openspec/changes/archive/2026-10-01-ledger-adopt-reached/design.md:15 Check for passive voice: "is reached"
WARN STE-ING openspec/changes/archive/2026-10-01-ledger-adopt-reached/design.md:29 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-10-01-ledger-adopt-reached/proposal.md:19 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-10-01-ledger-adopt-reached/specs/gap-ledger/spec.md:140 Check the -ing word "including"
WARN STE-ING openspec/changes/archive/2026-10-02-upstream-sync-2/design.md:31 Check the -ing word "differing"
WARN STE-ING openspec/changes/archive/2026-10-06-gates-coverage-race/design.md:54 Check the -ing word "using"
WARN STE-ING openspec/changes/archive/2026-10-06-gates-coverage-race/design.md:58 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-10-06-gates-coverage-race/design.md:62 Check the -ing word "existing"
WARN STE-ING openspec/changes/archive/2026-10-06-gates-coverage-race/design.md:82 Check the -ing word "existing"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/audit.md:69 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/audit.md:71 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/evidence.md:631 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/evidence.md:638 Check the -ing word "throwing"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/evidence.md:641 Check the -ing word "sibling"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/evidence.md:644 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/evidence.md:644 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/evidence.md:675 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/proposal.md:57 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/proposal.md:60 Check for a verb used as a noun: "read"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/proposal.md:62 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/proposal.md:68 Check the -ing word "reading"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/proposal.md:72 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/proposal.md:69 Check the -ing word "wording"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/specs/director/spec.md:396 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/specs/director/spec.md:405 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/specs/director/spec.md:441 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/specs/director/spec.md:443 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/specs/director/spec.md:446 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/tasks.md:281 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/design.md:4 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/evidence.md:3 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/evidence.md:733 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/evidence.md:851 Check the -ing word "working"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-timing/evidence.md:857 Check for a verb used as a noun: "destroy"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/evidence.md:858 Check the -ing word "missing"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/mutations.md:3 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-backfill-director-timing/proposal.md:46 Check the -ing word "wording"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-timing/specs/director/spec.md:165 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/changes/archive/2026-10-07-backfill-director-timing/specs/director/spec.md:166 Check for a verb used as a noun: "destroy"
WARN STE-PASSIVE openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:86 Check for passive voice: "is closed"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:83 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:97 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:124 Check the -ing word "wording"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:50 Check the -ing word "remaining"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:139 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:254 Check the -ing word "working"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:383 Check the -ing word "wording"
WARN STE-ING openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:67 Check the -ing word "wording"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/corrections.md:7 Check the -ing word "processing"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/corrections.md:10 Check the -ing word "Streaming"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/corrections.md:11 Check the -ing word "programming"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/design.md:5 Check the -ing word "processing"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/design.md:11 Check the -ing word "Streaming"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/design.md:14 Check the -ing word "programming"
WARN STE-ING openspec/changes/archive/2026-10-07-harden-timing-tests/design.md:66 Check the -ing word "pending"
WARN STE-PASSIVE openspec/changes/archive/2026-10-07-harden-timing-tests/proposal.md:44 Check for passive voice: "is defined"
WARN STE-ING openspec/changes/archive/2026-10-07-ste-noun-warning/proposal.md:11 Check the -ing word "reporting"
WARN STE-PASSIVE openspec/changes/archive/2026-10-08-gates-one-measurement/evidence.md:54 Check for passive voice: "is trusted"
WARN STE-PASSIVE openspec/changes/archive/2026-10-08-gates-one-measurement/evidence.md:354 Check for passive voice: "be removed"
WARN STE-PASSIVE openspec/changes/archive/2026-10-08-gates-one-measurement/evidence.md:2676 Check for passive voice: "be removed"
WARN STE-ING openspec/changes/archive/2026-10-08-gates-one-measurement/proposal.md:69 Check the -ing word "wording"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/audit.md:230 Check the -ing word "LineString"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/audit.md:235 Check the -ing word "padding"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/audit.md:257 Check the -ing word "Adding"
WARN STE-PASSIVE openspec/changes/backfill-director-packs-sharing/audit.md:489 Check for passive voice: "are configured"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:757 Check the -ing word "missing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:763 Check the -ing word "pending"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:763 Check the -ing word "missing"
WARN STE-PASSIVE openspec/changes/backfill-director-packs-sharing/evidence.md:765 Check for passive voice: "are disposed"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:765 Check the -ing word "mutating"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:1455 Check the -ing word "loading"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:1914 Check the -ing word "sharing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:1942 Check the -ing word "sharing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:1972 Check the -ing word "sharing"
WARN STE-PASSIVE openspec/changes/backfill-director-packs-sharing/evidence.md:2117 Check for passive voice: "was skipped"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:2194 Check the -ing word "including"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:2534 Check the -ing word "sharing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:2558 Check the -ing word "sharing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:3045 Check the -ing word "sharing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:3092 Check the -ing word "wording"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:3093 Check the -ing word "wording"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:3112 Check the -ing word "sharing"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:3447 Check the -ing word "wording"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/evidence.md:6277 Check the -ing word "existing"
WARN STE-PASSIVE openspec/changes/backfill-director-packs-sharing/mutations.md:11182 Check for passive voice: "was skipped"
WARN STE-PASSIVE openspec/changes/backfill-director-packs-sharing/mutations.md:11603 Check for passive voice: "is skipped"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/proposal.md:87 Check the -ing word "wording"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/specs/director/spec.md:165 Check the -ing word "loading"
WARN STE-ING openspec/changes/backfill-director-packs-sharing/survivors.md:753 Check the -ing word "padding"
WARN STE-NOUN openspec/specs/coverage-gate/spec.md:247 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/specs/coverage-gate/spec.md:248 Check for a verb used as a noun: "skip"
WARN STE-NOUN openspec/specs/coverage-gate/spec.md:249 Check for a verb used as a noun: "skip"
WARN STE-ING openspec/specs/coverage-gate/spec.md:289 Check the -ing word "blocking"
WARN STE-ING openspec/specs/coverage-gate/spec.md:289 Check the -ing word "blocking"
WARN STE-ING openspec/specs/coverage-gate/spec.md:289 Check the -ing word "blocking"
WARN STE-ING openspec/specs/coverage-gate/spec.md:292 Check the -ing word "blocking"
WARN STE-ING openspec/specs/coverage-gate/spec.md:294 Check the -ing word "blocking"
WARN STE-WORD-OLD openspec/specs/credential-boundary/spec.md:4 Use "show", not "expose"
WARN STE-ING openspec/specs/credential-boundary/spec.md:4 Check the -ing word "geocoding"
WARN STE-WORD-OLD openspec/specs/credential-boundary/spec.md:7 Use "show", not "expose"
WARN STE-ING openspec/specs/credential-boundary/spec.md:50 Check the -ing word "geocoding"
WARN STE-ING openspec/specs/credential-boundary/spec.md:51 Check the -ing word "geocoding"
WARN STE-ING openspec/specs/credential-boundary/spec.md:71 Check the -ing word "missing"
WARN STE-ING openspec/specs/credential-boundary/spec.md:85 Check the -ing word "geocoding"
WARN STE-ING openspec/specs/credential-boundary/spec.md:95 Check the -ing word "geocoding"
WARN STE-ING openspec/specs/credential-boundary/spec.md:96 Check the -ing word "geocoding"
WARN STE-ING openspec/specs/credential-boundary/spec.md:115 Check the -ing word "geocoding"
WARN STE-NOUN openspec/specs/cyclones/spec.md:80 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:99 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:104 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:106 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:203 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:205 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:210 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:259 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:261 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/cyclones/spec.md:262 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/director/spec.md:165 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/specs/director/spec.md:166 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/specs/director/spec.md:636 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/director/spec.md:645 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/director/spec.md:681 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/director/spec.md:683 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/director/spec.md:686 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/specs/gap-ledger/spec.md:523 Check the -ing word "including"
WARN STE-NOUN openspec/specs/layer-lifecycle/spec.md:4 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/specs/layer-lifecycle/spec.md:7 Check for a verb used as a noun: "destroy"
WARN STE-NOUN openspec/specs/layer-lifecycle/spec.md:10 Check for a verb used as a noun: "destroy"
WARN STE-ING openspec/specs/osh-control/spec.md:187 Check the -ing word "matching"
WARN STE-WORD-OLD openspec/specs/osh/spec.md:198 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/specs/osh/spec.md:206 Use "invalid", not "malformed"
WARN STE-WORD-OLD openspec/specs/osh/spec.md:236 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/specs/osh/spec.md:243 Check for passive voice: "is dropped"
WARN STE-ING openspec/specs/osh/spec.md:255 Check the -ing word "walking"
WARN STE-WORD-OLD openspec/specs/osh/spec.md:275 Use "invalid", not "malformed"
WARN STE-PASSIVE openspec/specs/osh/spec.md:298 Check for passive voice: "is given"
WARN STE-PASSIVE openspec/specs/osh/spec.md:338 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/specs/osh/spec.md:339 Check for passive voice: "is placed"
WARN STE-PASSIVE openspec/specs/osh/spec.md:367 Check for passive voice: "is removed"
WARN STE-WORD-OLD openspec/specs/osh/spec.md:393 Use "clear", not "explicit"
WARN STE-PASSIVE openspec/specs/osh/spec.md:547 Check for passive voice: "is walked"
WARN STE-PASSIVE openspec/specs/osh/spec.md:549 Check for passive voice: "is skipped"
WARN STE-NOUN openspec/specs/osh/spec.md:550 Check for a verb used as a noun: "skip"
WARN STE-PASSIVE openspec/specs/osh/spec.md:553 Check for passive voice: "is served"
WARN STE-NOUN openspec/specs/osh/spec.md:565 Check for a verb used as a noun: "read"
WARN STE-NOUN openspec/specs/perimeters/spec.md:18 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/perimeters/spec.md:65 Check for a verb used as a noun: "abort"
WARN STE-NOUN openspec/specs/perimeters/spec.md:195 Check for a verb used as a noun: "abort"
WARN STE-ING openspec/specs/qa-scripts/spec.md:42 Check the -ing word "pending"
WARN STE-ING openspec/specs/qa-scripts/spec.md:43 Check the -ing word "pending"
WARN STE-ING openspec/specs/qa-scripts/spec.md:46 Check the -ing word "pending"
WARN STE-ING openspec/specs/qa-scripts/spec.md:47 Check the -ing word "pending"
WARN STE-ING openspec/specs/qa-scripts/spec.md:84 Check the -ing word "pending"
WARN STE-ING openspec/specs/wind/spec.md:4 Check the -ing word "archiving"
WARN STE-WORD-OLD openspec/specs/wind/spec.md:72 Use "closes", not "dismisses"
WARN STE-NOUN openspec/specs/wind/spec.md:191 Check for a verb used as a noun: "abort"
STE: 0 errors, 566 warnings.
```

### predispatch-final

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-packs-sharing
ABBR     evidence.md:3053  "MIME" is not defined in this file
ABBR     evidence.md:3461  "ABBR" is not defined in this file
ABBR     evidence.md:3463  "SHA" is not defined in this file
ABBR     evidence.md:3464  "NOUN" is not defined in this file
ABBR     evidence.md:3468  "WORD" is not defined in this file
ABBR     evidence.md:6634  "LF" is not defined in this file
ABBR     evidence.md:6635  "LH" is not defined in this file
ABBR     evidence.md:6636  "BRF" is not defined in this file
ABBR     evidence.md:6637  "BRH" is not defined in this file
ABBR     evidence.md:6638  "FNF" is not defined in this file
ABBR     evidence.md:6639  "FNH" is not defined in this file
ABBR     evidence.md:6804  "WARN" is not defined in this file
ABBR     evidence.md:6810  "OLD" is not defined in this file
ABBR     evidence.md:6815  "ING" is not defined in this file
ABBR     mutations.md:3033  "MIME" is not defined in this file
The full output is in /home/ianblenke/docker/gev-tools/director-3/pass8/predispatch-final.log.
```

### titles-final

```text
Command: taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110
titles checked: 494, with a banned form: 0
```

### format-check

```text
Command: taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
Checked 1158 source files.
```

### openspec-show

```text
Command: taskset -c 12-15 nice -n 19 openspec show backfill-director-packs-sharing --json
Warning: Ignoring flags not applicable to change: scenarios
{
  "id": "backfill-director-packs-sharing",
  "title": "backfill-director-packs-sharing",
The full JSON is in /home/ianblenke/docker/gev-tools/director-3/pass8/openspec-show.log.
```

### openspec-validate

```text
Command: taskset -c 12-15 nice -n 19 openspec validate backfill-director-packs-sharing
Change 'backfill-director-packs-sharing' is valid
```

### headings

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/headings.py
{
  "sourceCommit": "f8f6a94d2d09489b98fda4d063b8612f766f5dfa",
  "changedHeadings": [
    {
      "file": "openspec/changes/backfill-director-packs-sharing/evidence.md",
      "previous": [
        "## Source commands",
        "## Base scope",
        "## Repository tests of pass 2",
        "## Host coverage",
        "## Scenario tests",
        "## Review corrections",
        "## Text that stays the same",
        "## Known limits",
        "## Tests without tags",
        "## Title correction",
        "## Corrections of review round 2",
        "## Pass 4",
        "## Pass 5",
        "## Pass 6",
        "## Pass 7 title corrections",
        "## Pass 7"
      ],
      "current": [
        "## Source commands",
        "## Base scope",
        "## Repository tests of pass 2",
        "## Host coverage",
        "## Scenario tests",
        "## Review corrections",
        "## Text that stays the same",
        "## Known limits",
        "## Tests without tags",
        "## Title correction",
        "## Corrections of review round 2",
        "## Pass 4",
        "## Pass 5",
        "## Pass 6",
        "## Pass 7 title corrections",
        "## Pass 7",
        "## Pass 8"
      ]
    },
    {
      "file": "openspec/changes/backfill-director-packs-sharing/proposal.md",
      "previous": [
        "## Why",
        "## What Changes",
        "## Capabilities",
        "## Impact",
        "## Known limits and later changes",
        "## Pass 7 scope"
      ],
      "current": [
        "## Why",
        "## What Changes",
        "## Capabilities",
        "## Impact",
        "## Known limits and later changes"
      ]
    },
    {
      "file": "openspec/changes/backfill-director-packs-sharing/tasks.md",
      "previous": [
        "## 1. Spec documents",
        "## 2. Scenario tests",
        "## Corrections of review round 1",
        "## 3. Gates and review",
        "## Corrections of review round 2",
        "## 7 Pass 4",
        "## 8 Pass 5",
        "## 9. Corrections of review round 4",
        "## 10. Corrections of review round 5"
      ],
      "current": [
        "## 1. Spec documents",
        "## 2. Scenario tests",
        "## Corrections of review round 1",
        "## 3. Gates and review",
        "## Corrections of review round 2",
        "## 7 Pass 4",
        "## 8 Pass 5",
        "## 9. Corrections of review round 4",
        "## 10. Corrections of review round 5",
        "## 11. Correct round 6 findings"
      ]
    }
  ],
  "requiredProposalHeadings": [
    "## Why",
    "## What Changes",
    "## Capabilities",
    "## Impact",
    "## Known limits and later changes"
  ]
}
```

### hand-last

```text
Command: NODE_OPTIONS=--test-isolation=none PYTHONUNBUFFERED=1 taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-3 /home/ianblenke/docker/gev-tools/director-3/muts.json
m001: KILLED [director-076] The validator returns without an error for safe names for the asset path
m002: KILLED [director-076] The validator rejects traversal for the asset path
m003: KILLED [director-077] The validator rejects invalid version
m004: KILLED [director-077] The validator rejects invalid format
m005: KILLED [director-078] The validator rejects protocol for the attribution
m006: KILLED [director-078] The validator rejects username for the attribution
m007: KILLED [director-078] The validator rejects password for the attribution
m008: KILLED [director-078] The validator rejects query for the attribution
m009: KILLED [director-078] The validator rejects fragment for the attribution
m010: KILLED [director-078] The validator rejects invalid URL text for the attribution
m011: KILLED [director-078] The validator returns without an error for a safe link for the attribution
m012: KILLED [director-078] The validator rejects blank text for the attribution
m013: KILLED [director-078] The validator rejects blank license for the attribution
m014: KILLED [director-079] The validator rejects a fraction for the byteLength field
m015: KILLED [director-079] The validator rejects invalid type for the digest
m016: KILLED [director-079] The validator rejects invalid alphabet for the digest
m017: KILLED [director-079] The validator accepts integrity limits and rejects zero or excess byteLength
m018: KILLED [director-080] The validator rejects reversed west for the image
m019: KILLED [director-080] The validator rejects reversed south for the image
m020: KILLED [director-080] The validator rejects short bounds for the image
m021: KILLED [director-080] The validator rejects height and reference for the image
m022: KILLED [director-081] The validator rejects an unknown anchor for the media
m023: KILLED [director-082] The validator rejects duplicate data pack IDs for the scene
m024: KILLED [director-082] The validator rejects duplicate data pack IDs for the shot
m025: KILLED [director-082] The validator rejects unknown data pack IDs for the shot
m026: KILLED [director-082] The validator returns without an error for absent data packs and anchors for the scene
m027: KILLED [director-083] The decoder rejects invalid type for the collection
m028: KILLED [director-083] The decoder rejects invalid array for the collection
m029: KILLED [director-083] The decoder rejects more than 2000 features for the collection
m030: KILLED [director-084] The decoder rejects type for the feature
m031: KILLED [director-084] The decoder rejects ID type for the feature
m032: KILLED [director-084] The decoder rejects blank ID for the feature
m033: KILLED [director-084] The decoder rejects long ID for the feature
m034: KILLED [director-084] The decoder rejects duplicate ID for the feature
m035: KILLED [director-085] The decoder rejects invalid array for the position
m036: KILLED [director-085] The decoder rejects invalid length for the position
m037: KILLED [director-085] The decoder rejects a coordinate that is not finite for the position
m038: KILLED [director-085] The decoder rejects invalid longitude for the position
m039: KILLED [director-085] The decoder rejects invalid latitude for the position
m040: KILLED [director-085] The decoder rejects a height below the limit for the position
m041: KILLED [director-085] The decoder rejects a height above the limit for the position
m042: KILLED [director-085] The decoder rejects excess for the position total
m043: KILLED [director-085] The decoder returns zero for absent height for the position
m044: KILLED [director-085] The decoder returns the height in the data for the position
m045: KILLED [director-086] The decoder rejects invalid array for the line
m046: KILLED [director-086] The decoder rejects invalid minimum for the line
m047: KILLED [director-086] The decoder rejects a ring with fewer than four points for the ring
m048: KILLED [director-086] The decoder accepts two distinct endpoints for the line and returns coordinates
m049: KILLED [director-086] The decoder rejects unclosed field 0 for the ring
m050: KILLED [director-086] The decoder rejects unclosed field 1 for the ring
m051: KILLED [director-086] The decoder rejects unclosed field 2 for the ring
m052: KILLED [director-087] The decoder rejects invalid type for the geometry
m053: KILLED [director-087] The decoder rejects invalid array for the geometry
m054: KILLED [director-087] The decoder rejects an empty polygon for the geometry
m055: KILLED [director-087] The decoder rejects more than 128 rings for the geometry
m056: KILLED [director-087] The decoder returns a closed polygon for the geometry
m057: KILLED [director-087] The decoder removes properties for the geometry
m058: KILLED [director-088] The session reports idle state after creation
m059: KILLED [director-088] The session rejects a value that is not a data pack list
m060: KILLED [director-088] The session rejects more than eight data packs
m061: KILLED [director-088] The session rejects destroyed state
m062: KILLED [director-088] The session rejects cancelled state
m063: KILLED [director-089] The session disposes handles in reverse order
m064: KILLED [director-089] The session reports ready after the caller changes a state copy
m065: KILLED [director-090] The session disposes late resources for the cancelled session
m066: KILLED [director-090] The session returns false for cancelled work with a null late handle
m067: KILLED [director-090] The session returns false for work that destruction stops
m068: KILLED [director-091] The session keeps its resources for the replacement
m069: KILLED [director-092] The session reports a stable source error
m070: KILLED [director-092] The session rejects stalled work for the deadline
m071: KILLED [director-092] The session reads the byteLength field once without a registered source for the data pack session
m072: KILLED [director-092] The session rejects an absent renderer without a source call
m073: KILLED [director-093] The session rejects bytes that are not a Uint8Array
m074: KILLED [director-093] The session rejects an empty asset
m075: KILLED [director-093] The session rejects an asset above the byte limit
m076: KILLED [director-093] The session rejects a wrong byteLength field
m077: KILLED [director-093] The session rejects bytes above the total limit
m078: KILLED [director-093] The session rejects a wrong digest
m079: KILLED [director-093] The session returns true for exact bytes and digest
m080: KILLED [director-089] The session rejects a falsy handle with inherited disposal
m081: KILLED [director-089] The session rejects a handle without a dispose function
m082: KILLED [director-094] The factory rejects protocol
m083: KILLED [director-094] The factory rejects username
m084: KILLED [director-094] The factory rejects password
m085: KILLED [director-094] The factory rejects query
m086: KILLED [director-094] The factory rejects fragment
m087: KILLED [director-094] The factory rejects an address with no final slash
m088: KILLED [director-095] The source sets its fixed options for the asset request
m089: KILLED [director-096] The source joins distinct stream chunks
m090: KILLED [director-096] The source rejects excess header bytes for the stream
m091: KILLED [director-096] The source rejects excess chunk bytes for the stream
m092: KILLED [director-096] The source returns an empty media type when the header is absent
m093: KILLED [director-096] The source returns lowercase media type text without parameters
m094: KILLED [director-097] The source rejects an absent stream
m095: KILLED [director-097] The source rejects the asset request after failed body cancellation
m096: KILLED [director-097] The source rejects a failed response without a body
m097: KILLED [director-097] The source releases the reader lock after a stream error
m098: KILLED [director-097] The source checks its signal between chunks and rejects the call
m099: KILLED [director-098] The import rejects nontext input
m100: KILLED [director-098] The import rejects invalid JSON; [director-098] The import rejects invalid JSON of 52428800 characters; [director-098] The import rejects invalid JSON of 5242881 characters
m101: KILLED [director-098] The import accepts plain project JSON and returns the project
m102: KILLED [director-098] The import rejects excess characters
m103: KILLED [director-098] The import rejects excess UTF8 bytes
m104: KILLED [director-099] The import rejects a custom text object for the base64
m105: KILLED [director-099] The import rejects invalid empty for the base64
m106: KILLED [director-099] The import rejects invalid length for the base64
m107: KILLED [director-099] The import rejects invalid alignment for the base64
m108: KILLED [director-099] The import rejects invalid alphabet for the base64
m109: KILLED [director-099] The import rejects invalid padding for the base64
m110: KILLED [director-099] The import rejects duplicate paths
m111: KILLED [director-099] The import rejects an unsupported media type
m112: KILLED [director-099] The import rejects unsupported version
m113: KILLED [director-100] The import rejects an absent asset
m114: KILLED [director-100] The import rejects a wrong byteLength field
m115: KILLED [director-100] The import rejects a pack digest that differs from its asset
m116: KILLED [director-100] The import rejects an asset digest that differs from its bytes
m117: KILLED [director-100] The import rejects unused assets
m118: KILLED [director-100] The import rejects external data pack sources
m119: KILLED [director-101] The export writes exact bundle metadata
m120: KILLED [director-102] The export rejects bytes that are not a Uint8Array
m121: KILLED [director-102] The export rejects an empty asset
m122: KILLED [director-102] The export rejects an asset above the byte limit
m123: KILLED [director-102] The export rejects absent assets
m124: KILLED [director-102] The export rejects declared byteLength
m125: KILLED [director-102] The export rejects declared digest
m126: KILLED [director-102] The export accepts the total byte limit and rejects one more byte and returns bundle text
m127: KILLED [director-102] The export rejects excess asset total
m128: KILLED [director-103] The export reuses a shared asset and returns bundle text
m129: KILLED [director-103] The export rejects shared byteLength
m130: KILLED [director-103] The export rejects shared digest
m131: KILLED [director-104] The store copies the asset map
m132: KILLED [director-104] The store clears stored bytes
m133: KILLED [director-105] The store rejects absent bytes
m134: KILLED [director-105] The store rejects bytes above the caller limit
m135: KILLED [director-105] The store returns an independent byte copy
m136: KILLED [director-106] The share helpers return the project for an absent filename
m137: KILLED [director-106] The share helpers reject the ordinary file limit
m138: KILLED [director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes
m139: KILLED [director-107] The helper resolves without a signal
m140: KILLED [director-107] The helper rejects an early signal
m141: KILLED [director-107] The helper resolves with an active signal
m142: KILLED [director-107] The helper rejects a work error
m143: KILLED [director-107] The helper checks signal state when the work settles and rejects the call
m144: KILLED [director-107] The helper cancels work that is not complete
m145: KILLED [director-108] The preview reports exact totals and attribution
m146: KILLED [director-108] The preview reports the scene ID when the title is absent
m147: KILLED [director-109] The preview reports included bundle bytes
m148: KILLED [director-109] The preview reports absent bundle bytes
m149: KILLED [director-109] The preview reports a configured source; [director-109] The preview reports a configured source for a supplied source ID
m150: KILLED [director-109] The preview reports an unavailable source
m151: KILLED [director-110] The preview lists distinct absent layers
m152: KILLED [director-110] The preview reports external content for applied shot packs
m153: KILLED [director-110] The preview reports external content for a shot with a source pack ID
m154: KILLED [director-110] The preview reports no external content without source packs
m155: KILLED [director-080] The validator returns without an error for its bounds field for the image
m156: KILLED [director-080] The validator returns without an error for its height field for the image
m157: KILLED [director-080] The validator returns without an error for its altitudeReference field for the image
m158: KILLED [director-081] The validator returns without an error for its anchorId field for the media
m159: KILLED [director-077] The validator returns without an error for a GeoJSON altitudeReference field
m160: KILLED [director-080] The validator rejects low excess for image bounds field 0
m161: KILLED [director-080] The validator rejects high excess for image bounds field 0
m162: KILLED [director-080] The validator rejects low excess for image bounds field 1
m163: KILLED [director-080] The validator rejects high excess for image bounds field 1
m164: KILLED [director-080] The validator rejects low excess for image bounds field 2
m165: KILLED [director-080] The validator rejects high excess for image bounds field 2
m166: KILLED [director-080] The validator rejects low excess for image bounds field 3
m167: KILLED [director-080] The validator rejects high excess for image bounds field 3
m168: KILLED [director-080] The validator rejects image height outside both limits
m169: KILLED [director-082] The validator uses supplied anchors for the scene and returns without an error
m170: KILLED [director-082] The validator uses absent anchor defaults for the scene and returns without an error
m171: KILLED [director-085] The decoder accepts both geographic edges for the position and returns coordinates
m172: SURVIVED
m173: KILLED [director-088] The session reports idle after creation
m174: KILLED [director-088] The session reports zero handles after creation
m175: KILLED [director-089] The session reports one active handle
m176: KILLED [director-093] The session calls the source with a default limit of 8388608 bytes
m177: KILLED [director-093] The session returns true without a declared size
m178: KILLED [director-090] The session returns false for a cancelled signal without an event
m179: KILLED [director-090] The session checks destroyed state after it reads the signal
m180: KILLED [director-090] The session returns false for a cleared load call without a signal state access
m181: KILLED [director-090] The session guard rejects a detached resource
m182: KILLED [director-090] The session disposes the handle before it adds the handle to its list
m183: KILLED [director-092] The session settles a source error before its deadline and reports idle
m184: KILLED [director-097] The source rejects early cancellation
m185: KILLED [director-094] The factory returns a source for HTTP and HTTPS directories
m186: KILLED [director-098] The import rejects 52428801 characters before byte conversion
m187: KILLED [director-101] The export accepts scenes without data packs and returns bundle text
m188: KILLED [director-101] The export returns one asset for a supplied data pack list
m189: KILLED [director-102] The export accepts absent integrity fields and returns bundle text
m190: KILLED [director-102] The export accepts an absent digest and returns bundle text
m191: KILLED [director-103] The export accepts absent byte declarations for the shared export and returns bundle text
m192: KILLED [director-103] The export accepts an absent digest for the shared export and returns bundle text
m193: KILLED [director-099] The import accepts bytes without padding for the base64 and returns assets
m194: KILLED [director-108] The preview reports no packs when data pack lists are absent
m195: KILLED [director-108] The preview reports one pack from the supplied data pack list
m196: KILLED [director-108] The preview reports Example for the supplied scene title
m197: KILLED [director-109] The preview reports a configured source for a supplied source ID
m198: KILLED [director-110] The preview reports no absent layer when a shot has no layers
m199: KILLED [director-110] The preview reports traffic as absent without layer IDs
m200: KILLED [director-105] The store rejects 8388609 bytes without a caller limit
m201: KILLED [director-092] The session rejects an absent renderer without a source call
m202: KILLED [director-099] The import rejects a custom text object for the base64
m203: KILLED [director-103] The export key uses the registered source name and returns bundle text
m204: KILLED [director-103] The export key uses path and returns bundle text
m205: KILLED [director-110] The preview reports ships as absent when only traffic is configured
m206: KILLED [director-108] The preview reports three bytes for both assets
m207: KILLED [director-095] The source sets its credentials option for the asset request
m208: KILLED [director-095] The source sets its redirect option for the asset request
m209: KILLED [director-095] The source sets its referrerPolicy option for the asset request
m210: KILLED [director-095] The source sets its cache option for the asset request
m211: KILLED [director-085] The decoder rejects field 0 that is not finite for the position
m212: KILLED [director-085] The decoder rejects field 1 that is not finite for the position
m213: KILLED [director-085] The decoder rejects field 2 that is not finite for the position
m214: KILLED [director-096] The source rejects 8388609 bytes without a caller limit
m215: KILLED [director-077] The validator returns without an error for the id field of a data pack
m216: KILLED [director-077] The validator returns without an error for the version field of a data pack
m217: KILLED [director-077] The validator returns without an error for the format field of a data pack
m218: KILLED [director-077] The validator returns without an error for the source field of a data pack
m219: KILLED [director-077] The validator returns without an error for the attribution field of a data pack
m220: KILLED [director-077] The validator returns without an error for the placement field of a data pack
m221: KILLED [director-079] The validator returns without an error for the byteLength field of a data pack
m222: KILLED [director-079] The validator returns without an error for the sha256 field of a data pack
m223: KILLED [director-077] The validator returns without an error for its source name field
m224: KILLED [director-077] The validator returns without an error for its source path field
m225: KILLED [director-078] The validator returns without an error for its attribution text field
m226: KILLED [director-078] The validator returns without an error for its attribution license field
m227: KILLED [director-078] The validator returns without an error for its attribution url field
m228: KILLED [director-100] The import checks its second asset reference and rejects the call
m229: KILLED [director-100] The import checks its second asset digest and rejects the call
m230: KILLED [director-103] The export accepts equal shared integrity and returns bundle text
m231: KILLED [director-102] The export rejects absent asset bytes
m232: KILLED [director-092] The session settles an early internal signal and reports idle
m233: KILLED [director-093] The session calls the renderer with the anchors and returns true
m234: KILLED [director-106] The share helpers call throwIfAborted three times and return the project
m235: KILLED [director-102] The export rejects encoded bundle text above 52428800 bytes
m236: KILLED [director-102] The export keeps its total after an asset without a byte length
m237: KILLED [director-089] The session reports ready after asset work
m238: KILLED [director-080] The validator rejects media fields in image placement for the placement
m239: KILLED [director-081] The validator rejects image fields in media placement for the placement
m240: KILLED [director-089] The session calls the GeoJSON renderer once and returns true
m241: KILLED [director-089] The session calls the image renderer once and returns true
m242: KILLED [director-089] The session calls the media renderer once and returns true
m243: KILLED [director-097] The source stops between stream chunks
m244: KILLED [director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials
m245: KILLED [director-080] The manifest checks given image bounds and media anchor references
m246: KILLED [director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
m247: KILLED [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
m248: KILLED [director-089] The data pack session removes resources and cancels the transport on Stop
m249: KILLED [director-091] The data pack session replaces source work and ignores its late bytes
m250: KILLED [director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement
m251: KILLED [director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result
m252: KILLED [director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources
m253: KILLED [director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names
m254: KILLED [director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal
m255: KILLED [director-101] The export copies bytes and attribution and keeps the project without an asset request for the selected scene bundle
m256: KILLED [director-099] The import rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
m257: KILLED [director-102] The export rejects excess bytes, wrong integrity and absent assets
m258: KILLED [director-103] The export share one asset and reject integrity values that differ for the data packs with the same path
m259: KILLED [director-109] The preview reports unavailable sources, absent layers and absent bundle assets
m260: KILLED [director-104] The store removes old data after replacement and uses no network source for the import byte store
m261: KILLED [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
m262: KILLED [director-107] The export stops before the next asset and returns no partial output for the cancelled bundle export
m263: KILLED [director-101] The export returns a bundle for a source path of 1024 characters
m264: KILLED [director-077] The validator returns without an error for geojson
m265: KILLED [director-077] The validator returns without an error for image
m266: KILLED [director-077] The validator returns without an error for media
m267: KILLED [director-080] The validator rejects bounds field 0 for the image
m268: KILLED [director-080] The validator rejects bounds field 1 for the image
m269: KILLED [director-080] The validator rejects bounds field 2 for the image
m270: KILLED [director-080] The validator rejects bounds field 3 for the image
m271: KILLED [director-092] The session rejects stalled work at the 19 ms deadline
m272: KILLED [director-092] The session rejects stalled work at the default 15000 ms deadline
m273: KILLED [director-092] The session removes resources after a later error
m274: KILLED [director-099] The import accepts the application/json media type and returns assets
m275: KILLED [director-099] The import accepts the application/geo+json media type and returns assets
m276: KILLED [director-099] The import accepts the image/png media type and returns assets
m277: KILLED [director-099] The import accepts the video/mp4 media type and returns assets
m278: KILLED [director-099] The import accepts the video/webm media type and returns assets
m279: KILLED [director-099] The import accepts the audio/mpeg media type and returns assets
m280: KILLED [director-099] The import accepts the audio/ogg media type and returns assets
m281: KILLED [director-099] The import accepts the audio/wav media type and returns assets
m282: KILLED [director-099] The import accepts the audio/webm media type and returns assets
m283: KILLED [director-089] The session rejects a falsy handle with inherited disposal
m284: KILLED [director-088] The session returns false without a caller signal access after destruction
m285: KILLED [director-083] The decoder accepts its exact feature limit for the collection and returns coordinates
m286: KILLED [director-084] The decoder accepts its exact text limit for the feature ID and returns coordinates
m287: KILLED [director-085] The decoder accepts its exact total limit for the position and returns coordinates
m288: KILLED [director-087] The decoder accepts its exact ring limit for the polygon and returns coordinates
m289: KILLED [director-076] The validator rejects a path above its text limit for the asset path
m290: KILLED [director-102] The export accepts its exact asset total and returns bundle text
m291: KILLED [director-089] The session keeps every data pack handle
m292: KILLED [director-095] The source sets its signal option for the asset request
m293: KILLED [director-096] The source accepts its exact byte limit for the stream and returns bytes
m294: KILLED [director-096] The source accepts its exact byte limit for the stream and returns bytes
m295: KILLED [director-092] The session rejects a falsy custom source
m296: KILLED [director-101] The export writes exact bundle metadata
m297: KILLED [director-101] The export writes exact bundle metadata
m298: KILLED [director-101] The export writes exact bundle metadata
m299: KILLED [director-101] The export writes exact bundle metadata
m300: KILLED [director-101] The export writes exact bundle metadata
m301: KILLED [director-101] The export writes exact bundle metadata
m302: KILLED [director-105] The store returns an independent byte copy
m303: KILLED [director-079] The validator rejects 63 characters for the digest
m304: KILLED [director-079] The validator rejects 65 characters for the digest
m305: KILLED [director-079] The validator rejects a prefix for the digest
m306: KILLED [director-079] The validator rejects a suffix for the digest
m307: KILLED [director-079] The validator rejects uppercase text for the digest
m308: KILLED [director-080] The validator rejects equal longitude edges for the image
m309: KILLED [director-080] The validator rejects equal latitude edges for the image
m310: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m311: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m312: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m313: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m314: KILLED [director-082] The validator ignores a data pack list from its parent for the scene and returns without an error
m315: KILLED [director-080] The validator rejects text for each geographic field for the image
m316: KILLED [director-080] The validator rejects text for each geographic field for the image
m317: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
m318: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
m319: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
m320: KILLED [director-076] The validator returns without an error for 1024 characters and rejects 1025 for the asset path
m321: KILLED [director-076] The validator rejects URL syntax with a stable message for the asset path
m322: KILLED [director-088] The session returns true for eight data packs
m323: KILLED [director-093] The session returns true at the asset byte limit
m324: KILLED [director-093] The session returns true at the total byte limit
m325: KILLED [director-093] The source receives the path and the renderer receives the asset and signal and returns bytes
m326: KILLED [director-093] The source receives the path and the renderer receives the asset and signal and returns bytes
m327: KILLED [director-093] The source receives the path and the renderer receives the asset and signal and returns bytes
m328: KILLED [director-089] The session removes its deadline after success
m329: KILLED [director-089] The session removes its deadline after clear
m330: KILLED [director-088] The session checks every declaration before the source call and rejects the call
m331: KILLED [director-089] The session disposes both ready handles in reverse order and reports idle
m332: KILLED [director-088] The session checks every declaration before the source call and rejects the call
m333: KILLED [director-083] The decoder rejects invalid UTF8 bytes
m334: KILLED [director-083] The decoder rejects null
m335: KILLED [director-084] The decoder rejects a null feature
m336: KILLED [director-084] The decoder rejects a null feature
m337: KILLED [director-087] The decoder rejects absent geometry
m338: KILLED [director-087] The decoder rejects absent geometry
m339: KILLED [director-087] The decoder rejects absent geometry
m340: KILLED [director-095] The source uses the default fetch function and returns bytes
m341: KILLED [director-102] The export accepts the total byte limit and rejects one more byte and returns bundle text
m342: KILLED [director-102] The export accepts the total byte limit and rejects one more byte and returns bundle text
m343: KILLED [director-099] The import accepts its length limit and rejects the next aligned length for the base64 and returns assets
m344: KILLED [director-106] The share helpers accept the project file limit and reject one more byte
m345: KILLED [director-106] The share helpers accept the bundle file limit and reject one more byte
m346: KILLED [director-102] The export rejects an unsupported media type
m347: KILLED [director-099] The import rejects 65 different asset paths
m348: KILLED [director-099] The import accepts the total byte limit and rejects one more byte and returns assets
m349: KILLED [director-099] The import accepts the total byte limit and rejects one more byte and returns assets
m350: KILLED [director-105] The store rejects a cancelled source call
m351: KILLED [director-107] The bundle helpers stop import before an asset
m352: KILLED [director-107] The bundle helpers stop import after a digest
m353: KILLED [director-107] The bundle helpers stop export before an asset
m354: KILLED [director-107] The bundle helpers stop export after asset bytes
m355: KILLED [director-107] The bundle helpers stop export after a digest
m356: KILLED [director-108] The preview counts shots apart from scenes
m357: KILLED [director-108] The preview counts shots apart from scenes
m358: KILLED [director-110] The preview lists distinct absent layers
m359: KILLED [director-077] The validator returns without an error for 256 characters for its ID and rejects 257
m360: KILLED [director-077] The validator returns without an error for 256 characters for its ID and rejects 257
m361: KILLED [director-077] The validator returns without an error for 256 characters for its source name and rejects 257
m362: KILLED [director-077] The validator returns without an error for 256 characters for its source name and rejects 257
m363: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
m364: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
m365: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text for the attribution
m366: KILLED [director-076] The validator returns without an error for 1024 characters and rejects 1025 for the asset path
m367: KILLED [director-102] The export rejects excess asset total
m368: KILLED [director-085] The decoder rejects negative longitude for the position
m369: KILLED [director-085] The decoder rejects negative latitude for the position
m370: KILLED [director-085] The decoder accepts the limit for negative longitude for the position and returns coordinates
m371: KILLED [director-085] The decoder accepts the limit for negative latitude for the position and returns coordinates
m372: KILLED [director-085] The decoder rejects four coordinates for the position
m373: KILLED [director-085] The decoder rejects one coordinate for the position
m374: KILLED [director-076] The validator rejects .x for the asset path
m375: KILLED [director-076] The validator rejects x?a=1 for the asset path
m376: KILLED [director-079] The validator returns without an error for one byte
m377: KILLED [director-080] The validator rejects bounds outside an array for the image
m378: KILLED [director-082] The validator rejects nine distinct data packs for the scene
m379: KILLED [director-082] The validator returns without an error for eight distinct data packs for the scene
m380: KILLED [director-089] The session reports its state during asset work for the data pack session
m381: KILLED [director-096] The source accepts its default byte limit and returns bytes
m382: KILLED [director-098] The import accepts the character limit and returns the project
m383: KILLED [director-098] The import returns one asset at the multibyte text limit and rejects one more byte
m384: KILLED [director-098] The import rejects an invalid plain project
m385: KILLED [director-098] The import rejects a null project
m386: KILLED [director-099] The import rejects an extra top-level field
m387: KILLED [director-099] The import rejects an invalid bundle project
m388: KILLED [director-099] The import accepts 64 distinct assets and returns assets
m389: SURVIVED
m390: KILLED [director-101] The export calls the resolver with the data pack and signal
m391: KILLED [director-101] The export calls the resolver with the data pack and signal
m392: KILLED [director-102] The export accepts the text byte limit and returns bundle text
m393: KILLED [director-105] The store accepts the caller byte limit for the byte store and returns byte copies
m394: KILLED [director-093] The renderer receives the data pack and scene anchors and returns coordinates
m395: KILLED [director-093] The renderer receives the data pack and scene anchors and returns coordinates
m396: KILLED [director-089] The session removes source listeners after success for the data pack session
m397: KILLED [director-089] The session removes source listeners after success for the data pack session
m398: KILLED [director-089] The session removes source listeners after error for the data pack session
m399: KILLED [director-079] The validator returns without an error for its byte limit
m400: KILLED [director-080] The validator returns without an error for its minimum height for the image
m401: KILLED [director-080] The validator returns without an error for its maximum height for the image
m402: KILLED [director-085] The decoder accepts its minimum height for the position and returns coordinates
m403: KILLED [director-085] The decoder accepts its maximum height for the position and returns coordinates
m404: KILLED [director-107] The helper removes its listener after cancel
m405: KILLED [director-107] The helper removes its listener after success
m406: KILLED [director-107] The helper removes its listener after error
m407: KILLED [director-107] The helper removes its listener after success
m408: KILLED [director-101] The export rejects an invalid project
m409: KILLED [director-107] The import stops before the second digest
m410: KILLED [director-107] The export stops before the second resolver call
m411: KILLED [director-082] The validator rejects a reference in the second shot
m412: KILLED [director-082] The validator rejects a reference in the second shot
m413: KILLED [director-099 director-102] The bundle helpers reject an SVG media type during import and export
m414: KILLED [director-077] The validator rejects an unlisted geojsonx format
m415: KILLED [director-094] The factory rejects the file protocol
m416: KILLED [director-077 director-082] The validator rejects an invalid second data pack
m417: KILLED [director-081] The validator returns without an error for a reference to the second anchor
m418: KILLED [director-082] The validator rejects an unknown second reference ID
m419: KILLED [director-084] The decoder rejects the second feature
m420: KILLED [director-085 director-086] The decoder rejects the second line position
m421: KILLED [director-087] The decoder rejects the second ring
m422: KILLED [director-088] The session rejects an invalid second data pack before the source call
m423: KILLED [director-081 director-093] The session returns true for a reference to the second anchor
m424: KILLED [director-080] The validator rejects bounds field 3 for the image
m425: KILLED [director-076] The validator rejects an invalid second path segment
m426: KILLED [director-085] The decoder rejects an invalid second coordinate
m427: KILLED [director-086] The decoder rejects unclosed field 2 for the ring
m428: KILLED [director-089] The session keeps every data pack handle
m429: KILLED [director-092] The session removes resources after a later error
m430: KILLED [director-096] The source joins chunks of different lengths
m431: KILLED [director-101] The export includes the asset of the second scene and returns bundle text
m432: KILLED [director-101] The export writes each asset index and filename
m433: KILLED [director-100] The import checks its second asset reference and rejects the call
m434: KILLED [director-101] The export writes each asset index and filename
m435: KILLED [director-101] The export writes each asset index and filename
m436: KILLED [director-104] The store counts the second asset
m437: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m438: KILLED [director-108] The preview lists the second data pack
m439: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m440: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m441: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m442: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m443: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m444: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m445: KILLED [director-097] The source cancels before it reads the second chunk
m446: KILLED [director-101] The export encodes the second byte chunk and returns bundle text
m447: KILLED [director-107] The import stops after the second digest
m448: KILLED [director-107] The export stops after the second digest
m449: KILLED [director-110] The preview reports both absent named layers without layer IDs
m450: KILLED [director-110] The preview reports both absent named layers without layer IDs
m451: KILLED [director-110] The preview reports both absent named layers without layer IDs
m452: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m453: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m454: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m455: KILLED [director-077] The validator rejects the extra fields script and adapters in the data pack
m456: KILLED [director-077] The validator rejects the extra fields script and adapters in the source
m457: KILLED [director-078] The validator rejects the extra fields script and adapters in the attribution
m458: KILLED [director-080] The validator rejects the extra fields script and adapters in the image placement
m459: KILLED [director-077] The validator rejects the extra fields script and adapters in the media placement
m460: KILLED [director-077] The validator rejects the extra fields script and adapters in the GeoJSON placement
m461: KILLED [director-099] The import rejects the extra fields script and adapters in the top-level object
m462: KILLED [director-099] The import rejects the extra fields script and adapters in the asset
m463: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m464: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m465: KILLED [director-110] The preview reports both absent named layers without layer IDs
m466: KILLED [director-110] The preview reports both absent named layers without layer IDs
m467: KILLED [director-110] The preview reports no absent layer when both layer IDs are configured
m468: KILLED [director-109] The preview reports both configured sources as configured
m469: KILLED [director-082] The validator returns without an error for eight references and rejects nine references for the shot
m470: KILLED [director-081] The validator returns without an error for a reference to the second anchor
m471: KILLED [director-081 director-093] The session returns true for a reference to the second anchor
m472: KILLED [director-104] The store counts the second asset
m473: KILLED [director-104] The store counts the second asset
m474: KILLED [director-104] The store counts the second asset
m475: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the second asset
m476: KILLED [director-101] The export encodes the second byte chunk and returns bundle text
m477: KILLED [director-093] The session returns true for exact bytes and digest
m478: KILLED [director-099] The import returns the bytes 1, 2 and 3 and the literal digest
m479: KILLED [director-099] The import returns the bytes 1, 2 and 3 and the literal digest
SURVIVORS: [('m172', 'SURVIVED'), ('m389', 'SURVIVED')]
```

### Label expansion

The hand tool clips some killer titles.
The label script expands only a unique live title.
The raw hand log stays in gev-tools.

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass8/expand-killers.py
Expanded killer labels: 47
```

### Host limits

The host uses Node 26.8.2.
This pass does not run Node 24.14.0, image gates, ratchet or the next review round.
The lead owns those commands.
The make lint command stopped at image construction before lint could start.
It gave no lint verdict.

The host lint command gives the lint verdict below its command line.
The first document command stopped before completion.
The first pattern and echo repair commands also stopped before completion.
Those commands gave no final verdict.

The final commands replace those incomplete attempts.

The predispatch checker also reports coverage keys in command output.
The fenced outputs keep those keys.

## Pass 9
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
Base commit: `290b5d2`.

The worker changes test titles and three tag cells only.
The worker changes no test body or production file.
Review reports and trace files stay unchanged.

Pass 9 note: the host checks do not replace the Node 24.14.0 image gates.
The lead must run the image gates and the next review round.

The table has 56 rows for 52 traversals since pass 8.
The Pass 7 phrase 52 table rows stays as a record.

### F1 and Spec major
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The titles say rejects media fields.
The worker gave both placement tests positive titles. The allowed-field-added-members limit stays.
```text
Command: taskset -c 12-15 nice -n 19 rg -n fields of the (image|media) placement src/director/packs/backfill.test.mjs
2144:test('[director-080] The validator returns without an error for the fields of the image placement', async () => {
2149:test('[director-081] The validator returns without an error for the fields of the media placement', async () => {
```

### F2 and Spec minor 1
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The tails and returns coordinates.
The worker named the renderer call and the true load result.
```text
Command: taskset -c 12-15 nice -n 19 rg -n receives the path,|calls the renderer with the data pack src/director/packs/backfill.test.mjs
2581:test('[director-093] The source receives the path, the renderer receives the asset and the signal, and the load call returns true', async () => {
2858:test('[director-093] The session calls the renderer with the data pack and the scene anchors and returns true', async () => {
```

### F3
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The tail rejects an invalid asset.
The worker named an invalid data pack list, invalid bundle and excess asset count.
```text
Command: taskset -c 12-15 nice -n 19 rg -n invalid data pack list|invalid bundle|more than 64 assets openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
145:- **THEN** the session starts with the idle state. Its load method checks data pack lists before asset work and rejects an invalid data pack list.
194:- **AND** The session disposes old resources before it checks the new data pack list and rejects an invalid data pack list.
288:- **AND** The import rejects extra top-level fields and invalid bundle projects.
294:- **AND** The import checks top-level fields, version, project and the asset list in that order and rejects an invalid bundle.
333:- **AND** The export checks the asset count before the next resolver call and rejects more than 64 assets.
```

### F4 and Spec minor 2
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The frozen PACK_LIMITS and SHARE_LIMITS.
The worker named the public limits as the actor in titles and clauses.
```text
Command: taskset -c 12-15 nice -n 19 rg -n limits throw a TypeError openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
148:- **AND** The public data pack limits throw a TypeError when a caller assigns a new value.
325:- **AND** The share limits throw a TypeError when a caller assigns a new value.
```

### F5
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The share helpers reject files.
The worker stated the bundle suffix exception to the ordinary file limit.
```text
Command: taskset -c 12-15 nice -n 19 rg -n reject a file above|reject that file openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
375:- **AND** The share helpers reject a file above 5242880 bytes, except a file with the .gevbundle.json suffix. They reject that file above 52428800 bytes.
```

### F6
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The tail reject the invalid input.
The worker named cancellation and excess files as the rejected inputs.
```text
Command: taskset -c 12-15 nice -n 19 rg -n reject cancellation|reject excess files src/director/sharing/sharing.test.mjs
2366:test('[director-106] The share helpers check the file limit before they read the signal and reject excess files', async () => {
2385:test('[director-106 director-107] The share helpers check the signal before they read text and reject cancellation', async () => {
```

### F7
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The 095 tail rejects cancellation.
The worker named the invalid path as the rejected input.
```text
Command: taskset -c 12-15 nice -n 19 rg -n checks the path before src/director/packs/backfill.test.mjs
401:test('[director-095] The source checks the path before it checks the caller signal and rejects the invalid path', async () => {
```

### F8
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The preview reports absent layers.
The worker separated absent layers from the source pack ID.
```text
Command: taskset -c 12-15 nice -n 19 rg -n absent layers of the second|source pack ID of that shot openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
423:- **AND** The preview reports the absent layers of the second shot in the second scene. It reports external content from the source pack ID of that shot.
```

### F9
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The import byte store title.
The worker used store for createBundleAssets and removed the import term.
```text
Command: taskset -c 12-15 nice -n 19 rg -n removes old data after replacement src/director/sharing/sharing.test.mjs
566:test('[director-104] The store removes old data after replacement and uses no network source', async () => {
```

### F10
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Pass 8 edited the old Pass 7 grep records.
The worker restored the Pass 7 search section from f8f6a94d. New searches appear in Pass 9.
```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/report-findings.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "Pass 7 search record equals f8f6a94d": true,
  "Old records equal f8f6a94d": true
}
```

### M1
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: A stray blank line.
The worker deleted the repeated image placement clause.
```text
Command: taskset -c 12-15 nice -n 19 rg -n extra image placement fields openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
64:- **AND** Each placement error names its field, and the validator rejects extra image placement fields.
```

### M2
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: pack.source.adapter and pack.format.
The worker marked the keys as code and named both maps.
```text
Command: taskset -c 12-15 nice -n 19 rg -n calls each source by openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
153:- **AND** The session calls each source by `pack.source.adapter` and each renderer by `pack.format`. The source map and the renderer map each contain two entries.
```

### M3
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The session returns false.
The worker named the load call as the actor.
```text
Command: taskset -c 12-15 nice -n 19 rg -n load call returns false for a destroyed openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
147:- **AND** The load call returns false for a destroyed session or a cancelled signal.
```

### M4
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: non-FeatureCollection.
The worker used finite clauses for types, arrays and string IDs.
```text
Command: taskset -c 12-15 nice -n 19 rg -n other than Feature|not an array|not strings openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
101:- **THEN** the decoder rejects a type other than FeatureCollection, a feature list that is not an array or more than 2000 features
107:- **THEN** the decoder rejects a type other than Feature, duplicate or blank IDs, IDs that are not strings and IDs above 256 characters
```

### M5
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The import calls the digest once.
The worker distinguished the digest function from the digest call.
```text
Command: taskset -c 12-15 nice -n 19 rg -n digest function once openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
395:- **AND** With two assets, the import calls the digest function once when cancellation occurs before the second digest call.
```

### M6
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Adding 5 to that set.
The worker used a length as the subject and marked script and adapters as code.
```text
Command: taskset -c 12-15 nice -n 19 rg -n A length 5 added openspec/changes/backfill-director-packs-sharing/audit.md
261:A length 5 added to that set remains a Known limit.
```

### M7
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: mutations of built-in functions.
The worker used changes for functions outside the mutation command.
```text
Command: taskset -c 12-15 nice -n 19 rg -n changes to built-in functions openspec/changes/backfill-director-packs-sharing/probe-ranges.md
12:The claims exclude changes to built-in functions and their prototypes.
```

### M8
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: because the validator gives them.
The worker named the scene and added the document parser to the glossary.
```text
Command: taskset -c 12-15 nice -n 19 rg -n scene declares|document parser openspec/changes/backfill-director-packs-sharing/design.md
55:The old title about stated references now says given references, because the scene declares them.
78:The second call to the document parser is equivalent for the public API when built-in functions keep their standard behavior.
80:The document parser returns that parsed object without a change.
216:| document parser | src/director/document.js | parseSceneDocument |
221:The document parser means parseSceneDocument in src/director/document.js.
239:The document parser is parseSceneDocument.
```

### M9
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The correction has no production code edit.
The worker used a finite clause and restored the first words from the earlier report.
```text
Command: taskset -c 12-15 nice -n 19 rg -n correction does not change production|S14.*This additive edits limit openspec/changes/backfill-director-packs-sharing/evidence.md
3002:The correction does not change production code.
3024:| S14 | This additive edits limit | The audit states the limit on added members with articles and separate sentences. The allowed-field rows extend that limit. |
```

### M10
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Sentences with a past verb and no subject.
The worker added a subject to each Pass 8 correction sentence.
```text
Command: taskset -c 12-15 nice -n 19 rg -n ^The worker (named|restored|stated|changed|used|added|marked|tagged|moved) openspec/changes/backfill-director-packs-sharing/evidence.md
6127:The worker named the share helpers for file and text work.
6141:The worker named the bundle helpers for export signal checks.
6153:The worker restored the helper as the actor that reads the work promise.
6165:The worker named the session for listener, state and work promise order.
6177:The worker stated one digest field access before the export writes the digest.
6191:The worker stated the false result of the load call.
6203:The worker named edge comparison instead of field order.
6215:The worker named pack.source.adapter for sources and pack.format for renderers.
6227:The worker restored each killer for m432, m434, m447 and m448.
6239:The worker named the session for the list check.
6251:The worker named commands separately from test functions.
6266:The worker changed noun uses and removed the false preview state claim.
6278:The worker used the scenario IDs of this change and a finite sentence.
6290:The worker stated preview reports and the import byte and digest result.
6302:The worker added the verb for the declared integrity check.
6314:The worker named script and adapters as extra fields.
6326:The worker used import for parseSceneShare.
6338:The worker stated no source signal access and a false result.
6350:The worker restored byteLength before digest before placement.
6362:The worker named the source that stops before the second chunk.
6374:The worker used separate sentences for protocol and cancellation.
6386:The worker stated the scope of the worker.
6399:The worker named the sentence and corrected the rerun phrase.
6411:The worker moved process notes under the Known limits section as Pass 7 notes.
6426:The worker marked the production identifiers as code.
6439:The worker added the second asset bytes to the title.
6451:The worker used Map of the asset store and entries of each registry.
6464:The worker moved limits and named additions to every closed set, with coordinate lengths.
6476:The worker named each killer with its hand row.
6488:The worker named the helper and the session in titles.
6500:The worker stated the distinct registry keys.
6513:The worker restored integrity order and no old signal access.
6525:The worker tagged GeoJSON and media extra fields with director-077.
```

### M11
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The heading echoes.
The worker used repeated titles in new prose and created check-repeated-titles.py.
```text
Command: taskset -c 12-15 nice -n 19 rg -n repeated titles|repeats a test title openspec/changes/backfill-director-packs-sharing/design.md
236:Check each place that repeats a test title with check-repeated-titles.py in the pass9 scratch folder.
```

### M12
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Nouns made from verbs.
The worker stated signal reads, caller destruction and the new session state.
```text
Command: taskset -c 12-15 nice -n 19 rg -n The new session|caller destroys it|does not read the signal state src/director/packs/backfill.test.mjs
549:test('[director-088] The session returns false and does not read the caller signal state after the caller destroys it', async () => {
1176:test('[director-088] The new session reports the idle state and zero handles', async () => {
1286:test('[director-090] The session returns false when the caller destroys it during asset work', async () => {
1753:test('[director-088] The new session reports the idle state', async () => {
1760:test('[director-088] The new session reports zero handles', async () => {
1824:test('[director-090] The session returns false for a cleared load call and does not read the signal state', async () => {
```

### M13
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Titles without an article.
The worker added articles to the named singular nouns and stated the position limit.
```text
Command: taskset -c 12-15 nice -n 19 rg -n rejects an invalid version|rejects the protocol|rejects more than 50000 positions src/director/packs/backfill.test.mjs
594:test('[director-077] The validator rejects an invalid version', async () => {
637:test('[director-078] The validator rejects the protocol for the attribution', async () => {
967:test('[director-085] The decoder rejects more than 50000 positions', async () => {
1433:test('[director-094] The factory rejects the protocol', async () => {
```

### M14
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The pronoun its.
The worker named the new resources and literal feature, ID, position and ring counts.
```text
Command: taskset -c 12-15 nice -n 19 rg -n new resources after|returns 2000 features|ID length of 256|returns 50000 positions|returns 128 rings src/director/packs/backfill.test.mjs
1297:test('[director-091] The session keeps the new resources after a new load call', async () => {
2341:test('[director-083] The decoder accepts the exact feature limit of the collection and returns 2000 features', async () => {
2346:test('[director-084] The decoder accepts the exact text limit of the feature ID and returns a feature with an ID length of 256', async () => {
2350:test('[director-085] The decoder accepts the exact position limit of the collection and returns 50000 positions', async () => {
2363:test('[director-087] The decoder accepts the exact ring limit of the polygon and returns 128 rings', async () => {
3054:test('[director-091] The session keeps new resources after the old caller listener fires', async () => {
```

### M15
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Two words for one thing.
The worker used work promise, reason, milliseconds and directory URL and removed repeated actor terms.
```text
Command: taskset -c 12-15 nice -n 19 rg -n work promise settles|milliseconds deadline|gives its reason|directory URL with no final slash src/director/packs/backfill.test.mjs
248:test('[director-089] The session returns true and does not read the reason after the work promise settles', async () => {
1488:test('[director-094] The factory rejects a directory URL with no final slash', async () => {
2254:test('[director-092] The session rejects stalled work at the 19 milliseconds deadline', async () => {
2278:test('[director-092] The session rejects stalled work at the default 15000 milliseconds deadline', async () => {
2997:test('[director-092] The session gives its reason to the source signal for the deadline and rejects the call', async () => {
```

### M16
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The export share one asset.
The worker used writes and rejects with integrity declarations.
```text
Command: taskset -c 12-15 nice -n 19 rg -n writes one asset and rejects integrity declarations src/director/sharing/sharing.test.mjs
531:test('[director-103] The export writes one asset and rejects integrity declarations that differ for the data packs with the same path', async () => {
```

### M17
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: accepts X and rejects Y and returns.
The worker attached the returned result to the accepted limit.
```text
Command: taskset -c 12-15 nice -n 19 rg -n returns bundle text at the total|returns assets at the src/director/sharing/sharing.test.mjs
1859:test('[director-102] The export returns bundle text at the total byte limit and rejects one more byte', async () =>
1904:test('[director-099] The import returns assets at the base64 length limit and rejects the next aligned length', async () =>
1916:test('[director-099] The import returns assets at the total byte limit and rejects one more byte', async () =>
```

### Spec minor 3
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The director-082 clause lost ignores.
The worker stated that the validator does not read the parent list.
```text
Command: taskset -c 12-15 nice -n 19 rg -n does not read a data pack list from the parent openspec/changes/backfill-director-packs-sharing/specs/director/spec.md
82:- **AND** The validator does not read a data pack list from the parent object of the scene and returns without an error.
```

### Spec minor 4
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The rows keep tag 080.
The worker retagged the three GeoJSON field rows to director-077. Scenario 077 states extra-field rejection.
```text
Command: taskset -c 12-15 nice -n 19 rg -n 077.*(extra placement field|placement object|height reference) src/director/packs/backfill.test.mjs
448:  ['077', 'extra placement field', p => { p.placement.extra = 1; }, 'pack.placement.extra: unsupported field'],
449:  ['077', 'placement object', p => { p.placement = null; }, 'pack.placement: expected an object'],
450:  ['077', 'height reference', p => { p.placement.altitudeReference = 'bad'; }, 'pack.placement.altitudeReference: expected ellipsoid height in meters'],
```

### Spec minor 5
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: The table names each such set.
The worker added source name, suffix and final slash rows with tests and the closed-set limit.
```text
Command: taskset -c 12-15 nice -n 19 rg -n Bundle source|Preview bundle source|Bundle file suffix|Directory final slash openspec/changes/backfill-director-packs-sharing/audit.md
232:| Bundle source | bundle.js:100 | scene-bundle; [director-100] The import rejects external data pack sources |
233:| Preview bundle source | preview.js:17 | scene-bundle; [director-109] The preview reports absent bundle bytes |
234:| Bundle file suffix | bundle.js:117 | .gevbundle.json; [director-106] The share helpers return a project with the larger bundle file limit and reject excess bytes |
235:| Directory final slash | source.js:15 | /; [director-094] The factory rejects a directory URL with no final slash |
```

### Spec minor 6
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: 52 table rows.
The worker kept the Pass 7 count as a record. The table has 56 rows for 52 traversals since pass 8.
```text
Command: taskset -c 12-15 nice -n 19 rg -n 56 rows|52 table rows openspec/changes/backfill-director-packs-sharing/evidence.md
3236:These groups give the 52 table rows.
6118:The scope command counts 56 rows and 52 distinct traversals.
```

### Spec minor 7
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
First words: Final complete pass 6 output.
The worker stated that Pass 8 replaced the killer labels.
```text
Command: taskset -c 12-15 nice -n 19 rg -n Pass 8 replaced the killer labels openspec/changes/backfill-director-packs-sharing/mutations.md
13233:Pass 8 replaced the killer labels in this list.
```

### First verb check

This output records the first command before the worker corrected the five titles.

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/check-verbs.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "testTemplatesRead": 486,
  "flagCount": 5,
  "flags": [
    {
      "file": "src/director/packs/backfill.test.mjs",
      "line": 1199,
      "title": "[director-088] The session rejects destroyed state",
      "assertions": [
        "equal",
        "equal"
      ],
      "flags": [
        "a: rejection or stop has no error assertion"
      ]
    },
    {
      "file": "src/director/packs/backfill.test.mjs",
      "line": 1211,
      "title": "[director-088] The session rejects cancelled state",
      "assertions": [
        "equal",
        "equal"
      ],
      "flags": [
        "a: rejection or stop has no error assertion"
      ]
    },
    {
      "file": "src/director/packs/backfill.test.mjs",
      "line": 1834,
      "title": "[director-090] The session guard rejects a detached resource",
      "assertions": [
        "equal",
        "equal"
      ],
      "flags": [
        "a: rejection or stop has no error assertion"
      ]
    },
    {
      "file": "src/director/sharing/sharing.test.mjs",
      "line": 1076,
      "title": "[director-106] The share helpers return the project for an absent filename",
      "assertions": [
        "deepEqual"
      ],
      "flags": [
        "d: no project assertion"
      ]
    },
    {
      "file": "src/director/sharing/sharing.test.mjs",
      "line": 1548,
      "title": "[director-106] The share helpers call throwIfAborted three times and return the project",
      "assertions": [
        "equal",
        "equal"
      ],
      "flags": [
        "d: no project assertion"
      ]
    }
  ]
}
```

The worker read each flagged body.
The destroyed and cancelled load calls assert false and zero source calls.
The detached resource test asserts false and one disposal.
The absent filename test asserts an empty asset map.
The signal method test asserts an empty asset map and three calls.
The worker corrected all five titles; no false alarm remains.

### Final verb check

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/check-verbs.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "testTemplatesRead": 486,
  "flagCount": 0,
  "flags": []
}
```

### Spec minor 1 result tails

Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.

First words: Titles end returns bytes and returns coordinates.
The worker stated the feature and ID counts, the upper height limit and the call order.

```text
Command: taskset -c 12-15 nice -n 19 rg -n upper limit|returns 2000 features|ID length of 256 src/director/packs/backfill.test.mjs
1712:test('[director-080] The validator rejects an image height above the upper limit', async () => {
2341:test('[director-083] The decoder accepts the exact feature limit of the collection and returns 2000 features', async () => {
2346:test('[director-084] The decoder accepts the exact text limit of the feature ID and returns a feature with an ID length of 256', async () => {
```

```text
Command: taskset -c 12-15 nice -n 19 rg -n report the call order src/director/sharing/sharing.test.mjs
2406:test('[director-107] The share helpers check the signal after the text promise settles and report the call order', async () => {
```

### Current labels

Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.

First words: The false titles are the killer records.
The worker corrected the live placement and public limit labels.

```text
Command: taskset -c 12-15 nice -n 19 rg -n fields of the (image|media) placement|a0004 openspec/changes/backfill-director-packs-sharing/survivors.md
26:| a0004 | src/director/packs/manifest.js:10 | `object` | KILLED | [director-088] The public data pack limits throw a TypeError when a caller assigns a new value |
```

```text
Command: taskset -c 12-15 nice -n 19 rg -n ^\[director-08[01]\] The validator returns without an error for the fields openspec/changes/backfill-director-packs-sharing/mutations.md
6486:[director-080] The validator returns without an error for the fields of the image placement
6515:[director-081] The validator returns without an error for the fields of the media placement
```

### M6 code words

Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.

First words: script and adapters outside inline code.
The worker marked both field names as code in the proposal.

```text
Command: taskset -c 12-15 nice -n 19 rg -n Hand rows add openspec/changes/backfill-director-packs-sharing/proposal.md
66:  Hand rows add `script`, and tests reject `script` and `adapters` for each list.
```

### M15 share words

Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.

First words: Two words for one thing.
The worker used bundle text and integrity declarations and removed the repeated store terms.

```text
Command: taskset -c 12-15 nice -n 19 rg -n returns bundle text for a source path|integrity declarations that differ|caller byte limit and returns byte copies src/director/sharing/sharing.test.mjs
531:test('[director-103] The export writes one asset and rejects integrity declarations that differ for the data packs with the same path', async () => {
683:test('[director-101] The export returns bundle text for a source path of 1024 characters', async () => {
2100:test('[director-105] The store accepts the caller byte limit and returns byte copies', () => {
```

### Final host checks
Source commit: `b7653ad75c059af9b1305d81922fd76bbc20d66a`.
Pass 9 note: the first hand command loaded old filters.
It does not check the final filters or titles.
The worker corrected the filters and repeated the complete command.

### Repository tests

```text
Command: taskset -c 12-15 nice -n 19 node --test src/director/packs/backfill.test.mjs
ℹ tests 430
ℹ suites 0
ℹ pass 430
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2141.832359
```

```text
Command: taskset -c 12-15 nice -n 19 node --test src/director/packs/packs.test.mjs
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7924.368311
```

```text
Command: taskset -c 12-15 nice -n 19 node --test src/director/sharing/sharing.test.mjs
ℹ tests 228
ℹ suites 0
ℹ pass 228
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 20953.949495
```

### Production coverage

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-packs-manifest /home/ianblenke/docker/gev-work/director-3/src/director/packs/manifest.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/packs/manifest.js",
    {
      "LF": 138,
      "LH": 138,
      "BRF": 56,
      "BRH": 56,
      "FNF": 13,
      "FNH": 13
    }
  ]
]
```

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-packs-geojson /home/ianblenke/docker/gev-work/director-3/src/director/packs/geojson.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/packs/geojson.js",
    {
      "LF": 62,
      "LH": 62,
      "BRF": 54,
      "BRH": 54,
      "FNF": 7,
      "FNH": 7
    }
  ]
]
```

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-packs-session /home/ianblenke/docker/gev-work/director-3/src/director/packs/session.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/packs/session.js",
    {
      "LF": 159,
      "LH": 159,
      "BRF": 81,
      "BRH": 81,
      "FNF": 18,
      "FNH": 18
    }
  ]
]
```

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-packs-source /home/ianblenke/docker/gev-work/director-3/src/director/packs/source.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/packs/source.js",
    {
      "LF": 67,
      "LH": 67,
      "BRF": 37,
      "BRH": 37,
      "FNF": 4,
      "FNH": 4
    }
  ]
]
```

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-sharing-bundle /home/ianblenke/docker/gev-work/director-3/src/director/sharing/bundle.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/sharing/bundle.js",
    {
      "LF": 221,
      "LH": 221,
      "BRF": 103,
      "BRH": 103,
      "FNF": 21,
      "FNH": 21
    }
  ]
]
```

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-sharing-lifetime /home/ianblenke/docker/gev-work/director-3/src/director/sharing/lifetime.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/sharing/lifetime.js",
    {
      "LF": 26,
      "LH": 26,
      "BRF": 13,
      "BRH": 13,
      "FNF": 6,
      "FNH": 6
    }
  ]
]
```

```text
Command: taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/director-3/pass9/merge-coverage.mjs /home/ianblenke/docker/gev-tools/director-3/pass9/v8-sharing-preview /home/ianblenke/docker/gev-work/director-3/src/director/sharing/preview.js
[
  [
    "file:///home/ianblenke/docker/gev-work/director-3/src/director/sharing/preview.js",
    {
      "LF": 43,
      "LH": 43,
      "BRF": 22,
      "BRH": 22,
      "FNF": 10,
      "FNH": 10
    }
  ]
]
```

### Repeated titles

The checker excludes past command records and the first verb check.
It checks every current label in the audit, mutation and survivor documents.
It also checks the current scenario test list, evidence tables and the new Pass 9 searches.
The earlier complete command lists in mutations.md stay as records from the source commit.

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/check-repeated-titles.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "runtimeTests": 670,
  "checkedLabels": 2240,
  "pastRecordLinesExcluded": 9728,
  "staleLabels": [],
  "staleLabelCount": 0,
  "duplicateTitles": {},
  "duplicateTitleCount": 0
}
```

### verbs final

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/check-verbs.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "testTemplatesRead": 486,
  "flagCount": 0,
  "flags": []
}
```

### patterns final

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/verify-patterns.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "handRows": 479,
  "unmatchedPatterns": []
}
```

### titles

```text
Command: taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110
titles checked: 494, with a banned form: 0
```

### format check

```text
Command: taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
Checked 1158 source files.
```

### openspec show

```text
Command: taskset -c 12-15 nice -n 19 openspec show backfill-director-packs-sharing --json
{
  "id": "backfill-director-packs-sharing",
  "title": "backfill-director-packs-sharing",
  "deltaCount": 8,
  "deltas": [
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The data pack validators MUST accept valid declarations and reject invalid declarations.",
      "requirement": {
        "text": "The data pack validators MUST accept valid declarations and reject invalid declarations.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller supplies a relative asset path\n- **THEN** the validator accepts safe directory names and rejects traversal or URL syntax\n- **AND** The validator accepts paths of at most 1024 characters and rejects longer paths.\n- **AND** The validator accepts _ and - at the start of each path segment and returns without an error.\n- **AND** The validator returns without an error for letters A to Z and a to z, and digits 0 to 9.\n- **AND** The validator accepts those characters at the start and in other positions and returns without an error.\n- **AND** The validator names the path field in each asset path error.\n- **AND** The validator rejects the path type before it reads a segment.\n- **AND** The validator checks the source name, the path and the attribution fields in that order and rejects an invalid value.\n- **AND** The validator rejects an invalid second path segment."
          },
          {
            "rawText": "- **WHEN** a caller supplies a data pack manifest\n- **THEN** the validator accepts version 1 and the geojson, image and media formats and returns without an error.\n- **AND** The validator rejects other versions and formats.\n- **AND** The validator rejects a data pack ID or source name above 256 characters.\n- **AND** The validator rejects extra fields and names each invalid field in its error.\n- **AND** The validator checks declaration fields, ID, version, format and source in that order and rejects an invalid value.\n- **AND** The validator checks the declaration before it checks for duplicate IDs and rejects an invalid value.\n- **AND** The validator rejects the unlisted format geojsonx.\n- **AND** The validator rejects an invalid second data pack declaration."
          },
          {
            "rawText": "- **WHEN** a data pack declares attribution\n- **THEN** the validator checks text, license and an optional HTTPS link without credentials, query or fragment and rejects an invalid value.\n- **AND** The validator rejects text or license above 4096 characters, or an HTTPS link above 2048 characters.\n- **AND** The validator names each invalid attribution field and rejects extra attribution fields.\n- **AND** The validator checks text, license, URL and byteLength in that order and rejects an invalid value."
          },
          {
            "rawText": "- **WHEN** a data pack declares byteLength or sha256\n- **THEN** the validator checks a positive integer up to 8388608 bytes and a lowercase hexadecimal digest of 64 characters and rejects an invalid value.\n- **AND** The validator rejects 63-character, 65-character and uppercase digests, and accepts exactly 64 lowercase hexadecimal characters.\n- **AND** The validator accepts each digit from 0 to 9 and each letter from a to f in the digest and returns without an error.\n- **AND** The validator names the field in each integrity error.\n- **AND** The validator checks the digest type before it converts text and rejects an invalid value.\n- **AND** The validator checks byteLength before the digest, and the digest before it reads the placement."
          },
          {
            "rawText": "- **WHEN** an image data pack declares placement\n- **THEN** the validator checks geographic bounds, ordered edges, height and the ellipsoid reference and rejects an invalid value.\n- **AND** The validator rejects equal west and east edges, and equal south and north edges.\n- **AND** The validator accepts longitude limits of -180 and 180 degrees, and latitude limits of -90 and 90 degrees and returns without an error.\n- **AND** The validator rejects numeric text for bounds and height.\n- **AND** Each placement error names its field, and the validator rejects extra image placement fields.\n- **AND** The validator compares west with east before it compares south with north.\n- **AND** The validator checks bounds values, edge order and height in that order and rejects an invalid value.\n- **AND** The validator checks the height reference before it checks bounds and rejects an invalid value.\n- **AND** The validator checks the bounds array before it reads the length. It checks the length before it checks each coordinate.\n- **AND** The validator checks each bounds coordinate, with its index in the error path and rejects an invalid value."
          },
          {
            "rawText": "- **WHEN** a media data pack declares placement\n- **THEN** the validator checks its scene anchor reference and rejects an invalid value.\n- **AND** The validator names the placement field in each unknown anchor error.\n- **AND** The validator accepts a reference to the second scene anchor and returns without an error."
          },
          {
            "rawText": "- **WHEN** a scene declares data packs or data pack IDs for a shot\n- **THEN** the validator rejects duplicate data pack IDs, unknown shot references and duplicate shot references\n- **AND** The validator does not read a data pack list from the parent object of the scene and returns without an error.\n- **AND** The validator accepts eight distinct data packs per scene and rejects nine.\n- **AND** The validator accepts eight distinct data pack references per shot and rejects nine references before it checks distinct IDs.\n- **AND** The validator names the shot field in each reference error.\n- **AND** The validator rejects duplicate references before it searches for known IDs.\n- **AND** The validator checks the data pack list before it reads the anchors.\n- **AND** The validator rejects an unknown reference in the second shot.\n- **AND** The validator reports `$.shots[1].dataPackIds` and says expected distinct scene pack IDs for that error.\n- **AND** The validator rejects an unknown second reference ID."
          }
        ]
      },
      "requirements": [
        {
          "text": "The data pack validators MUST accept valid declarations and reject invalid declarations.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller supplies a relative asset path\n- **THEN** the validator accepts safe directory names and rejects traversal or URL syntax\n- **AND** The validator accepts paths of at most 1024 characters and rejects longer paths.\n- **AND** The validator accepts _ and - at the start of each path segment and returns without an error.\n- **AND** The validator returns without an error for letters A to Z and a to z, and digits 0 to 9.\n- **AND** The validator accepts those characters at the start and in other positions and returns without an error.\n- **AND** The validator names the path field in each asset path error.\n- **AND** The validator rejects the path type before it reads a segment.\n- **AND** The validator checks the source name, the path and the attribution fields in that order and rejects an invalid value.\n- **AND** The validator rejects an invalid second path segment."
            },
            {
              "rawText": "- **WHEN** a caller supplies a data pack manifest\n- **THEN** the validator accepts version 1 and the geojson, image and media formats and returns without an error.\n- **AND** The validator rejects other versions and formats.\n- **AND** The validator rejects a data pack ID or source name above 256 characters.\n- **AND** The validator rejects extra fields and names each invalid field in its error.\n- **AND** The validator checks declaration fields, ID, version, format and source in that order and rejects an invalid value.\n- **AND** The validator checks the declaration before it checks for duplicate IDs and rejects an invalid value.\n- **AND** The validator rejects the unlisted format geojsonx.\n- **AND** The validator rejects an invalid second data pack declaration."
            },
            {
              "rawText": "- **WHEN** a data pack declares attribution\n- **THEN** the validator checks text, license and an optional HTTPS link without credentials, query or fragment and rejects an invalid value.\n- **AND** The validator rejects text or license above 4096 characters, or an HTTPS link above 2048 characters.\n- **AND** The validator names each invalid attribution field and rejects extra attribution fields.\n- **AND** The validator checks text, license, URL and byteLength in that order and rejects an invalid value."
            },
            {
              "rawText": "- **WHEN** a data pack declares byteLength or sha256\n- **THEN** the validator checks a positive integer up to 8388608 bytes and a lowercase hexadecimal digest of 64 characters and rejects an invalid value.\n- **AND** The validator rejects 63-character, 65-character and uppercase digests, and accepts exactly 64 lowercase hexadecimal characters.\n- **AND** The validator accepts each digit from 0 to 9 and each letter from a to f in the digest and returns without an error.\n- **AND** The validator names the field in each integrity error.\n- **AND** The validator checks the digest type before it converts text and rejects an invalid value.\n- **AND** The validator checks byteLength before the digest, and the digest before it reads the placement."
            },
            {
              "rawText": "- **WHEN** an image data pack declares placement\n- **THEN** the validator checks geographic bounds, ordered edges, height and the ellipsoid reference and rejects an invalid value.\n- **AND** The validator rejects equal west and east edges, and equal south and north edges.\n- **AND** The validator accepts longitude limits of -180 and 180 degrees, and latitude limits of -90 and 90 degrees and returns without an error.\n- **AND** The validator rejects numeric text for bounds and height.\n- **AND** Each placement error names its field, and the validator rejects extra image placement fields.\n- **AND** The validator compares west with east before it compares south with north.\n- **AND** The validator checks bounds values, edge order and height in that order and rejects an invalid value.\n- **AND** The validator checks the height reference before it checks bounds and rejects an invalid value.\n- **AND** The validator checks the bounds array before it reads the length. It checks the length before it checks each coordinate.\n- **AND** The validator checks each bounds coordinate, with its index in the error path and rejects an invalid value."
            },
            {
              "rawText": "- **WHEN** a media data pack declares placement\n- **THEN** the validator checks its scene anchor reference and rejects an invalid value.\n- **AND** The validator names the placement field in each unknown anchor error.\n- **AND** The validator accepts a reference to the second scene anchor and returns without an error."
            },
            {
              "rawText": "- **WHEN** a scene declares data packs or data pack IDs for a shot\n- **THEN** the validator rejects duplicate data pack IDs, unknown shot references and duplicate shot references\n- **AND** The validator does not read a data pack list from the parent object of the scene and returns without an error.\n- **AND** The validator accepts eight distinct data packs per scene and rejects nine.\n- **AND** The validator accepts eight distinct data pack references per shot and rejects nine references before it checks distinct IDs.\n- **AND** The validator names the shot field in each reference error.\n- **AND** The validator rejects duplicate references before it searches for known IDs.\n- **AND** The validator checks the data pack list before it reads the anchors.\n- **AND** The validator rejects an unknown reference in the second shot.\n- **AND** The validator reports `$.shots[1].dataPackIds` and says expected distinct scene pack IDs for that error.\n- **AND** The validator rejects an unknown second reference ID."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The geometry decoder MUST return IDs, geometry types and coordinates without feature properties.",
      "requirement": {
        "text": "The geometry decoder MUST return IDs, geometry types and coordinates without feature properties.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller decodes GeoJSON\n- **THEN** the decoder rejects a type other than FeatureCollection, a feature list that is not an array or more than 2000 features\n- **AND** The decoder rejects invalid UTF8 bytes and null."
          },
          {
            "rawText": "- **WHEN** a collection contains features\n- **THEN** the decoder rejects a type other than Feature, duplicate or blank IDs, IDs that are not strings and IDs above 256 characters\n- **AND** The decoder rejects a null feature with the feature ID error.\n- **AND** The decoder rejects a duplicate ID in the second feature."
          },
          {
            "rawText": "- **WHEN** a geometry supplies positions without inherited coordinate values\n- **THEN** the decoder rejects longitude, latitude or height that is not finite or exceeds geographic limits\n- **AND** The decoder accepts at most 50000 positions and gives zero meters for an absent height.\n- **AND** Each position has two or three coordinates; the decoder rejects one or four coordinates.\n- **AND** The decoder accepts longitude from -180 to 180 degrees and latitude from -90 to 90 degrees and returns coordinates.\n- **AND** The decoder rejects a null position with the geographic position error.\n- **AND** The decoder keeps negative zero for a supplied height.\n- **AND** The decoder rejects an invalid second coordinate and an invalid second line position."
          },
          {
            "rawText": "- **WHEN** a geometry supplies a line or ring\n- **THEN** the decoder rejects short lines, short rings and rings with unequal end positions\n- **AND** The decoder rejects a null line with the line error.\n- **AND** The decoder returns an open line with unequal end positions."
          },
          {
            "rawText": "- **WHEN** a collection contains geometry\n- **THEN** the decoder returns IDs, geometry types and coordinates without properties\n- **AND** The decoder rejects unsupported or absent geometry and accepts at most 128 polygon rings.\n- **AND** The decoder rejects an unclosed second polygon ring."
          }
        ]
      },
      "requirements": [
        {
          "text": "The geometry decoder MUST return IDs, geometry types and coordinates without feature properties.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller decodes GeoJSON\n- **THEN** the decoder rejects a type other than FeatureCollection, a feature list that is not an array or more than 2000 features\n- **AND** The decoder rejects invalid UTF8 bytes and null."
            },
            {
              "rawText": "- **WHEN** a collection contains features\n- **THEN** the decoder rejects a type other than Feature, duplicate or blank IDs, IDs that are not strings and IDs above 256 characters\n- **AND** The decoder rejects a null feature with the feature ID error.\n- **AND** The decoder rejects a duplicate ID in the second feature."
            },
            {
              "rawText": "- **WHEN** a geometry supplies positions without inherited coordinate values\n- **THEN** the decoder rejects longitude, latitude or height that is not finite or exceeds geographic limits\n- **AND** The decoder accepts at most 50000 positions and gives zero meters for an absent height.\n- **AND** Each position has two or three coordinates; the decoder rejects one or four coordinates.\n- **AND** The decoder accepts longitude from -180 to 180 degrees and latitude from -90 to 90 degrees and returns coordinates.\n- **AND** The decoder rejects a null position with the geographic position error.\n- **AND** The decoder keeps negative zero for a supplied height.\n- **AND** The decoder rejects an invalid second coordinate and an invalid second line position."
            },
            {
              "rawText": "- **WHEN** a geometry supplies a line or ring\n- **THEN** the decoder rejects short lines, short rings and rings with unequal end positions\n- **AND** The decoder rejects a null line with the line error.\n- **AND** The decoder returns an open line with unequal end positions."
            },
            {
              "rawText": "- **WHEN** a collection contains geometry\n- **THEN** the decoder returns IDs, geometry types and coordinates without properties\n- **AND** The decoder rejects unsupported or absent geometry and accepts at most 128 polygon rings.\n- **AND** The decoder rejects an unclosed second polygon ring."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The data pack session MUST load valid assets and dispose its resources when the caller clears or destroys it.",
      "requirement": {
        "text": "The data pack session MUST load valid assets and dispose its resources when the caller clears or destroys it.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller creates a session\n- **THEN** the session starts with the idle state. Its load method checks data pack lists before asset work and rejects an invalid data pack list.\n- **AND** The session rejects more than eight data packs and checks every declaration before the first source call.\n- **AND** The load call returns false for a destroyed session or a cancelled signal.\n- **AND** The public data pack limits throw a TypeError when a caller assigns a new value.\n- **AND** After the caller destroys the session, a new load call does not read the caller signal state.\n- **AND** An empty data pack list returns true without a source call or a deadline timer.\n- **AND** An absent source map or renderer map gives an empty registry.\n- **AND** The session reads source entries before renderer entries.\n- **AND** The session calls each source by `pack.source.adapter` and each renderer by `pack.format`. The source map and the renderer map each contain two entries.\n- **AND** The session checks the data pack list before it reads anchors. It checks declarations before it reads the caller signal.\n- **AND** During source cancellation, a destroyed session returns false for another load call.\n- **AND** An invalid second declaration gives its indexed error before the source call."
          },
          {
            "rawText": "- **WHEN** a session loads assets\n- **THEN** after success, the session reports the ready state and disposes its handles when the caller clears or destroys it\n- **AND** The session rejects a null handle or a handle without a dispose function.\n- **AND** During asset work, the session reports the loading state.\n- **AND** The session keeps its state after the caller changes a returned state object.\n- **AND** The session removes the deadline timer after success.\n- **AND** The session also removes that timer after the caller clears the session.\n\n- **AND** The session removes source listeners after success or a source error.\n- **AND** The session does not read the signal reason for a completed source listener after success or a source error.\n- **AND** The session removes the caller signal listener when the caller clears it.\n- **AND** The session installs that listener with the once option set to true.\n- **AND** The session attaches the source listener, checks the source signal state and reads the work promise in that order.\n- **AND** The session does not read the signal reason for a completed source when the promise settles.\n- **AND** The session attaches the caller listener before the deadline timer starts.\n- **AND** The session checks the signal before it removes the timer. It removes the timer before it reports the ready state.\n- **AND** The session reports idle before source cancellation.\n- **AND** The session cancels the source, removes the caller listener, removes the timer and disposes resources in that order."
          },
          {
            "rawText": "- **WHEN** a caller cancels asset work, or source or renderer work fails\n- **THEN** for cancellation, the session returns false and disposes late renderer resources\n- **AND** The session checks its source signal before it reads bytes and after renderer work.\n- **AND** The session does not read the caller signal state again for a cleared load call after cancellation.\n- **AND** The session rejects source errors before the renderer call and rejects null bytes or a null renderer handle.\n- **AND** After the caller clears the session, the session does not read the old source signal state and returns false.\n- **AND** The session returns false when the caller signal destroys the session after a source error.\n- **AND** The session returns false for a caller event during listener registration."
          },
          {
            "rawText": "- **WHEN** a caller starts a new load call\n- **THEN** the session returns false for old work that is not complete and keeps the new resources\n- **AND** The session disposes old resources before it checks the new data pack list and rejects an invalid data pack list."
          },
          {
            "rawText": "- **WHEN** a source fails, a source signal event stops work, or the asset deadline expires\n- **THEN** the session removes partial resources and reports a stable error\n- **AND** With no registered source and a byteLength field in the declaration, the session reads that field once, during validation\n- **AND** The session sets a default deadline of 15000 milliseconds.\n- **AND** The session sets the source signal reason to Asset load timed out when the deadline expires.\n- **AND** With no renderer, the session does not call the registered source.\n- **AND** The session disposes each partial resource when the deadline expires.\n- **AND** The session rejects the load call before the renderer call for a source signal event.\n- **AND** The session reads the source signal reason once when a source signal event stops work.\n- **AND** The session rejects the load call before the renderer call for a source signal event during listener removal after source success or an error.\n- **AND** The session does not read the global `error` property for a data pack failure."
          },
          {
            "rawText": "- **WHEN** a source returns bytes for a data pack\n- **THEN** the session checks byte type, size, total bytes and declared integrity before the renderer call and rejects an invalid asset.\n- **AND** The session accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns true.\n- **AND** The source receives the source path and the byteLength field or the default byte limit.\n- **AND** The renderer receives the asset and the signal of the source call.\n- **AND** The renderer also receives the data pack and the scene anchors.\n- **AND** The session checks the byte type before it reads the length of an invalid byte object.\n- **AND** With null bytes, the session does not read the declared byteLength field again.\n- **AND** Without a declared byteLength field, the session does not compare bytes with that field.\n- **AND** The session checks total bytes before it reads the declared digest.\n- **AND** The session accepts a data pack that refers to the second supplied anchor and returns true."
          }
        ]
      },
      "requirements": [
        {
          "text": "The data pack session MUST load valid assets and dispose its resources when the caller clears or destroys it.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller creates a session\n- **THEN** the session starts with the idle state. Its load method checks data pack lists before asset work and rejects an invalid data pack list.\n- **AND** The session rejects more than eight data packs and checks every declaration before the first source call.\n- **AND** The load call returns false for a destroyed session or a cancelled signal.\n- **AND** The public data pack limits throw a TypeError when a caller assigns a new value.\n- **AND** After the caller destroys the session, a new load call does not read the caller signal state.\n- **AND** An empty data pack list returns true without a source call or a deadline timer.\n- **AND** An absent source map or renderer map gives an empty registry.\n- **AND** The session reads source entries before renderer entries.\n- **AND** The session calls each source by `pack.source.adapter` and each renderer by `pack.format`. The source map and the renderer map each contain two entries.\n- **AND** The session checks the data pack list before it reads anchors. It checks declarations before it reads the caller signal.\n- **AND** During source cancellation, a destroyed session returns false for another load call.\n- **AND** An invalid second declaration gives its indexed error before the source call."
            },
            {
              "rawText": "- **WHEN** a session loads assets\n- **THEN** after success, the session reports the ready state and disposes its handles when the caller clears or destroys it\n- **AND** The session rejects a null handle or a handle without a dispose function.\n- **AND** During asset work, the session reports the loading state.\n- **AND** The session keeps its state after the caller changes a returned state object.\n- **AND** The session removes the deadline timer after success.\n- **AND** The session also removes that timer after the caller clears the session.\n\n- **AND** The session removes source listeners after success or a source error.\n- **AND** The session does not read the signal reason for a completed source listener after success or a source error.\n- **AND** The session removes the caller signal listener when the caller clears it.\n- **AND** The session installs that listener with the once option set to true.\n- **AND** The session attaches the source listener, checks the source signal state and reads the work promise in that order.\n- **AND** The session does not read the signal reason for a completed source when the promise settles.\n- **AND** The session attaches the caller listener before the deadline timer starts.\n- **AND** The session checks the signal before it removes the timer. It removes the timer before it reports the ready state.\n- **AND** The session reports idle before source cancellation.\n- **AND** The session cancels the source, removes the caller listener, removes the timer and disposes resources in that order."
            },
            {
              "rawText": "- **WHEN** a caller cancels asset work, or source or renderer work fails\n- **THEN** for cancellation, the session returns false and disposes late renderer resources\n- **AND** The session checks its source signal before it reads bytes and after renderer work.\n- **AND** The session does not read the caller signal state again for a cleared load call after cancellation.\n- **AND** The session rejects source errors before the renderer call and rejects null bytes or a null renderer handle.\n- **AND** After the caller clears the session, the session does not read the old source signal state and returns false.\n- **AND** The session returns false when the caller signal destroys the session after a source error.\n- **AND** The session returns false for a caller event during listener registration."
            },
            {
              "rawText": "- **WHEN** a caller starts a new load call\n- **THEN** the session returns false for old work that is not complete and keeps the new resources\n- **AND** The session disposes old resources before it checks the new data pack list and rejects an invalid data pack list."
            },
            {
              "rawText": "- **WHEN** a source fails, a source signal event stops work, or the asset deadline expires\n- **THEN** the session removes partial resources and reports a stable error\n- **AND** With no registered source and a byteLength field in the declaration, the session reads that field once, during validation\n- **AND** The session sets a default deadline of 15000 milliseconds.\n- **AND** The session sets the source signal reason to Asset load timed out when the deadline expires.\n- **AND** With no renderer, the session does not call the registered source.\n- **AND** The session disposes each partial resource when the deadline expires.\n- **AND** The session rejects the load call before the renderer call for a source signal event.\n- **AND** The session reads the source signal reason once when a source signal event stops work.\n- **AND** The session rejects the load call before the renderer call for a source signal event during listener removal after source success or an error.\n- **AND** The session does not read the global `error` property for a data pack failure."
            },
            {
              "rawText": "- **WHEN** a source returns bytes for a data pack\n- **THEN** the session checks byte type, size, total bytes and declared integrity before the renderer call and rejects an invalid asset.\n- **AND** The session accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns true.\n- **AND** The source receives the source path and the byteLength field or the default byte limit.\n- **AND** The renderer receives the asset and the signal of the source call.\n- **AND** The renderer also receives the data pack and the scene anchors.\n- **AND** The session checks the byte type before it reads the length of an invalid byte object.\n- **AND** With null bytes, the session does not read the declared byteLength field again.\n- **AND** Without a declared byteLength field, the session does not compare bytes with that field.\n- **AND** The session checks total bytes before it reads the declared digest.\n- **AND** The session accepts a data pack that refers to the second supplied anchor and returns true."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The directory source MUST use its directory URL and reject bytes above the asset limit.",
      "requirement": {
        "text": "The directory source MUST use its directory URL and reject bytes above the asset limit.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller registers an asset directory\n- **THEN** the factory rejects a directory outside HTTP or HTTPS, or with credentials, query or fragment\n- **AND** The factory rejects a directory URL without a slash at the end.\n- **AND** The factory rejects a directory URL that uses the file protocol."
          },
          {
            "rawText": "- **WHEN** a caller asks for an asset path\n- **THEN** the source checks the path before it checks the caller signal and rejects an invalid path.\n- **AND** For a safe path, the source calls fetch with the registered directory and fixed request options.\n- **AND** The source calls fetch with no credentials, redirects as errors, no referrer and no cache.\n- **AND** Without a caller fetch function, the source calls the global fetch function."
          },
          {
            "rawText": "- **WHEN** a source reads an asset stream\n- **THEN** the source checks header and stream byte limits and joins its chunks\n- **AND** The source removes media type parameters and space, and changes the media type to lowercase text.\n- **AND** The source returns empty text for an absent media type.\n- **AND** The source joins chunks of different byte lengths in their original order.\n- **AND** The source checks the header byte limit before it reads the first stream chunk.\n- **AND** The source checks the stream byte limit before it keeps a chunk."
          },
          {
            "rawText": "- **WHEN** an asset request fails or its signal stops it\n- **THEN** the source rejects the asset request and releases stream resources\n- **AND** The source waits for stream cancellation before it releases the reader lock.\n- **AND** For an HTTP error, the source waits for body cancellation before it rejects the asset request.\n- **AND** The source checks its signal before each time the source reads a stream chunk and rejects cancellation.\n- **AND** With two stream chunks, cancellation before the second chunk stops the source, and the source reads only the first chunk."
          }
        ]
      },
      "requirements": [
        {
          "text": "The directory source MUST use its directory URL and reject bytes above the asset limit.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller registers an asset directory\n- **THEN** the factory rejects a directory outside HTTP or HTTPS, or with credentials, query or fragment\n- **AND** The factory rejects a directory URL without a slash at the end.\n- **AND** The factory rejects a directory URL that uses the file protocol."
            },
            {
              "rawText": "- **WHEN** a caller asks for an asset path\n- **THEN** the source checks the path before it checks the caller signal and rejects an invalid path.\n- **AND** For a safe path, the source calls fetch with the registered directory and fixed request options.\n- **AND** The source calls fetch with no credentials, redirects as errors, no referrer and no cache.\n- **AND** Without a caller fetch function, the source calls the global fetch function."
            },
            {
              "rawText": "- **WHEN** a source reads an asset stream\n- **THEN** the source checks header and stream byte limits and joins its chunks\n- **AND** The source removes media type parameters and space, and changes the media type to lowercase text.\n- **AND** The source returns empty text for an absent media type.\n- **AND** The source joins chunks of different byte lengths in their original order.\n- **AND** The source checks the header byte limit before it reads the first stream chunk.\n- **AND** The source checks the stream byte limit before it keeps a chunk."
            },
            {
              "rawText": "- **WHEN** an asset request fails or its signal stops it\n- **THEN** the source rejects the asset request and releases stream resources\n- **AND** The source waits for stream cancellation before it releases the reader lock.\n- **AND** For an HTTP error, the source waits for body cancellation before it rejects the asset request.\n- **AND** The source checks its signal before each time the source reads a stream chunk and rejects cancellation.\n- **AND** With two stream chunks, cancellation before the second chunk stops the source, and the source reads only the first chunk."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The bundle helpers MUST check supplied assets and keep the source project.",
      "requirement": {
        "text": "The bundle helpers MUST check supplied assets and keep the source project.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller supplies project share text\n- **THEN** the import rejects invalid text type, excess bytes and invalid JSON syntax\n- **AND** The import rejects null and invalid projects.\n- **AND** The import rejects text above 52428800 characters or 52428800 UTF8 bytes.\n- **AND** The import reports `$: invalid JSON` for invalid JSON within the share text limit.\n- **AND** For project JSON without bundle format, the import returns the project and an empty asset Map."
          },
          {
            "rawText": "- **WHEN** a caller supplies bundle assets\n- **THEN** the import rejects invalid fields, paths, media types, duplicate paths and invalid base64 syntax\n- **AND** The import accepts at most 64 assets and returns assets. The import rejects 65 different paths.\n- **AND** The import accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns assets.\n- **AND** The import rejects base64 above 11184812 characters.\n- **AND** The import rejects a bundle version other than 1.\n- **AND** The import rejects extra top-level fields and invalid bundle projects.\n- **AND** The import starts asset field, count, byte, media type, base64 and digest errors with `assets`.\n- **AND** The import starts each asset path error with `source.path`.\n- **AND** The import accepts the standard base64 alphabet, with + and /, and returns assets. The import rejects an equals sign at the start.\n- **AND** The import accepts each standard base64 character in both plain and padded text and returns assets.\n- **AND** The import checks the base64 type before it converts text and rejects an invalid asset.\n- **AND** The import checks top-level fields, version, project and the asset list in that order and rejects an invalid bundle.\n- **AND** The import checks asset fields, path, media type, duplicate path and base64 in that order and rejects an invalid asset.\n- **AND** The import checks asset byte limits before the digest call and rejects an invalid asset.\n- **AND** The import accepts these media types and returns assets: application/json, application/geo+json, image/png, video/mp4, video/webm, audio/mpeg, audio/ogg, audio/wav and audio/webm.\n- **AND** The import rejects image/svg+xml."
          },
          {
            "rawText": "- **WHEN** a bundle declares data pack assets\n- **THEN** the import rejects incorrect asset digests and incorrect data pack references\n- **AND** The import starts each data pack reference error with `project`."
          },
          {
            "rawText": "- **WHEN** a caller exports a project with supplied assets\n- **THEN** the export copies the project and writes bundle paths, byte lengths and digests\n- **AND** The export rejects an invalid project before the resolver call.\n- **AND** The export calls the resolver with the data pack and the signal in its options object.\n- **AND** The export writes a path with at most 160 characters from the source filename.\n- **AND** The export writes each path with files/, the asset index from zero, and a dash before the filename.\n- **AND** The export writes source, byteLength and digest fields in that order.\n- **AND** The export does not read byte chunks past the asset end.\n- **AND** The export calls the filename slice with a start of zero and a length limit of 160.\n- **AND** The export writes assets for data packs from the second scene."
          },
          {
            "rawText": "- **WHEN** a caller supplies assets for bundle export\n- **THEN** the export rejects excess bytes, unsupported media types, excess assets and incorrect declared integrity\n- **AND** The export accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns bundle text.\n- **AND** The export rejects an unsupported media type during export.\n- **AND** The share limits throw a TypeError when a caller assigns a new value.\n- **AND** The export starts each asset error with `assets`.\n- **AND** The export checks byte type and per-asset size before the total size and rejects an invalid asset.\n- **AND** The export checks declared byteLength before the declared digest and rejects an invalid asset.\n- **AND** For numeric byte lengths, the export adds zero to the total for an asset without a byte length.\n- **AND** When the declared digest is absent, the export reads the digest field once before it writes the digest.\n- **AND** The export starts each text limit error with `$`.\n- **AND** The export checks declared integrity before it reads the filename.\n- **AND** The export checks the asset count before the next resolver call and rejects more than 64 assets.\n- **AND** The export checks bytes before media type, and media type before the digest call and rejects an invalid asset."
          },
          {
            "rawText": "- **WHEN** data packs use the same source and path\n- **THEN** the export writes one asset and rejects integrity declarations that differ\n- **AND** The export starts each shared asset integrity error with `assets`."
          }
        ]
      },
      "requirements": [
        {
          "text": "The bundle helpers MUST check supplied assets and keep the source project.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller supplies project share text\n- **THEN** the import rejects invalid text type, excess bytes and invalid JSON syntax\n- **AND** The import rejects null and invalid projects.\n- **AND** The import rejects text above 52428800 characters or 52428800 UTF8 bytes.\n- **AND** The import reports `$: invalid JSON` for invalid JSON within the share text limit.\n- **AND** For project JSON without bundle format, the import returns the project and an empty asset Map."
            },
            {
              "rawText": "- **WHEN** a caller supplies bundle assets\n- **THEN** the import rejects invalid fields, paths, media types, duplicate paths and invalid base64 syntax\n- **AND** The import accepts at most 64 assets and returns assets. The import rejects 65 different paths.\n- **AND** The import accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns assets.\n- **AND** The import rejects base64 above 11184812 characters.\n- **AND** The import rejects a bundle version other than 1.\n- **AND** The import rejects extra top-level fields and invalid bundle projects.\n- **AND** The import starts asset field, count, byte, media type, base64 and digest errors with `assets`.\n- **AND** The import starts each asset path error with `source.path`.\n- **AND** The import accepts the standard base64 alphabet, with + and /, and returns assets. The import rejects an equals sign at the start.\n- **AND** The import accepts each standard base64 character in both plain and padded text and returns assets.\n- **AND** The import checks the base64 type before it converts text and rejects an invalid asset.\n- **AND** The import checks top-level fields, version, project and the asset list in that order and rejects an invalid bundle.\n- **AND** The import checks asset fields, path, media type, duplicate path and base64 in that order and rejects an invalid asset.\n- **AND** The import checks asset byte limits before the digest call and rejects an invalid asset.\n- **AND** The import accepts these media types and returns assets: application/json, application/geo+json, image/png, video/mp4, video/webm, audio/mpeg, audio/ogg, audio/wav and audio/webm.\n- **AND** The import rejects image/svg+xml."
            },
            {
              "rawText": "- **WHEN** a bundle declares data pack assets\n- **THEN** the import rejects incorrect asset digests and incorrect data pack references\n- **AND** The import starts each data pack reference error with `project`."
            },
            {
              "rawText": "- **WHEN** a caller exports a project with supplied assets\n- **THEN** the export copies the project and writes bundle paths, byte lengths and digests\n- **AND** The export rejects an invalid project before the resolver call.\n- **AND** The export calls the resolver with the data pack and the signal in its options object.\n- **AND** The export writes a path with at most 160 characters from the source filename.\n- **AND** The export writes each path with files/, the asset index from zero, and a dash before the filename.\n- **AND** The export writes source, byteLength and digest fields in that order.\n- **AND** The export does not read byte chunks past the asset end.\n- **AND** The export calls the filename slice with a start of zero and a length limit of 160.\n- **AND** The export writes assets for data packs from the second scene."
            },
            {
              "rawText": "- **WHEN** a caller supplies assets for bundle export\n- **THEN** the export rejects excess bytes, unsupported media types, excess assets and incorrect declared integrity\n- **AND** The export accepts up to 8388608 bytes per asset and up to 33554432 total bytes and returns bundle text.\n- **AND** The export rejects an unsupported media type during export.\n- **AND** The share limits throw a TypeError when a caller assigns a new value.\n- **AND** The export starts each asset error with `assets`.\n- **AND** The export checks byte type and per-asset size before the total size and rejects an invalid asset.\n- **AND** The export checks declared byteLength before the declared digest and rejects an invalid asset.\n- **AND** For numeric byte lengths, the export adds zero to the total for an asset without a byte length.\n- **AND** When the declared digest is absent, the export reads the digest field once before it writes the digest.\n- **AND** The export starts each text limit error with `$`.\n- **AND** The export checks declared integrity before it reads the filename.\n- **AND** The export checks the asset count before the next resolver call and rejects more than 64 assets.\n- **AND** The export checks bytes before media type, and media type before the digest call and rejects an invalid asset."
            },
            {
              "rawText": "- **WHEN** data packs use the same source and path\n- **THEN** the export writes one asset and rejects integrity declarations that differ\n- **AND** The export starts each shared asset integrity error with `assets`."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The byte store MUST copy the asset map and return byte copies.",
      "requirement": {
        "text": "The byte store MUST copy the asset map and return byte copies.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller replaces or clears bundle bytes\n- **THEN** the store copies the map and reports its current byte total\n- **AND** With no replacement map, the store reports zero assets and zero bytes.\n- **AND** The store returns a separate snapshot map with the stored keys and byte values.\n- **AND** The store counts the bytes of the second stored asset."
          },
          {
            "rawText": "- **WHEN** a caller asks for stored bundle bytes\n- **THEN** the store returns a byte copy and rejects absent or excess bytes and a cancelled source call\n- **AND** The store accepts bytes equal to the caller limit and rejects one more byte.\n- **AND** Without a caller limit, the store accepts an asset of 8388608 bytes and returns a byte copy.\n- **AND** The store rejects an invalid path even when the store holds that path.\n- **AND** The store checks its signal before it checks the path and rejects cancellation."
          }
        ]
      },
      "requirements": [
        {
          "text": "The byte store MUST copy the asset map and return byte copies.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller replaces or clears bundle bytes\n- **THEN** the store copies the map and reports its current byte total\n- **AND** With no replacement map, the store reports zero assets and zero bytes.\n- **AND** The store returns a separate snapshot map with the stored keys and byte values.\n- **AND** The store counts the bytes of the second stored asset."
            },
            {
              "rawText": "- **WHEN** a caller asks for stored bundle bytes\n- **THEN** the store returns a byte copy and rejects absent or excess bytes and a cancelled source call\n- **AND** The store accepts bytes equal to the caller limit and rejects one more byte.\n- **AND** Without a caller limit, the store accepts an asset of 8388608 bytes and returns a byte copy.\n- **AND** The store rejects an invalid path even when the store holds that path.\n- **AND** The store checks its signal before it checks the path and rejects cancellation."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The share helpers MUST check file limits and settle signal cancellation.",
      "requirement": {
        "text": "The share helpers MUST check file limits and settle signal cancellation.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller supplies a project file\n- **THEN** the share helpers check the file suffix and size before they read text\n- **AND** The share helpers reject a file above 5242880 bytes, except a file with the .gevbundle.json suffix. They reject that file above 52428800 bytes.\n- **AND** The share helpers accept the limit and reject one more byte.\n- **AND** The share helpers check the file limit before they read the signal and reject excess files."
          },
          {
            "rawText": "- **WHEN** share work uses a signal\n- **THEN** the helper rejects cancelled work and settles successful work or errors\n- **AND** The bundle helpers check the signal before each asset and after each digest during import and export. They reject cancellation.\n- **AND** During export, the bundle helpers also check the signal after the asset result and reject cancellation.\n\n- **AND** The helper removes its listener after success, a work error or cancellation.\n- **AND** The import checks the signal before text type, asset fields and digest comparison and rejects cancellation.\n- **AND** The share helpers check the signal before they read text and after the text promise settles. They reject cancellation.\n- **AND** During export, the bundle helpers check the signal before they check asset presence and declared integrity and reject cancellation.\n- **AND** The helper does not attach a listener to a cancelled signal.\n- **AND** The helper attaches its listener before it reads the work promise.\n- **AND** The helper reads cancelled work before the reason, and removes its listener before it reads the reason.\n- **AND** The helper checks cancellation after listener removal and before the work settles with success.\n- **AND** For cancellation during listener removal after a work error, the helper rejects with the cancellation reason.\n- **AND** With two assets, the import calls the digest function once when cancellation occurs before the second digest call.\n- **AND** With two data packs, the export calls the resolver once when cancellation occurs before the second resolver call."
          }
        ]
      },
      "requirements": [
        {
          "text": "The share helpers MUST check file limits and settle signal cancellation.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller supplies a project file\n- **THEN** the share helpers check the file suffix and size before they read text\n- **AND** The share helpers reject a file above 5242880 bytes, except a file with the .gevbundle.json suffix. They reject that file above 52428800 bytes.\n- **AND** The share helpers accept the limit and reject one more byte.\n- **AND** The share helpers check the file limit before they read the signal and reject excess files."
            },
            {
              "rawText": "- **WHEN** share work uses a signal\n- **THEN** the helper rejects cancelled work and settles successful work or errors\n- **AND** The bundle helpers check the signal before each asset and after each digest during import and export. They reject cancellation.\n- **AND** During export, the bundle helpers also check the signal after the asset result and reject cancellation.\n\n- **AND** The helper removes its listener after success, a work error or cancellation.\n- **AND** The import checks the signal before text type, asset fields and digest comparison and rejects cancellation.\n- **AND** The share helpers check the signal before they read text and after the text promise settles. They reject cancellation.\n- **AND** During export, the bundle helpers check the signal before they check asset presence and declared integrity and reject cancellation.\n- **AND** The helper does not attach a listener to a cancelled signal.\n- **AND** The helper attaches its listener before it reads the work promise.\n- **AND** The helper reads cancelled work before the reason, and removes its listener before it reads the reason.\n- **AND** The helper checks cancellation after listener removal and before the work settles with success.\n- **AND** For cancellation during listener removal after a work error, the helper rejects with the cancellation reason.\n- **AND** With two assets, the import calls the digest function once when cancellation occurs before the second digest call.\n- **AND** With two data packs, the export calls the resolver once when cancellation occurs before the second resolver call."
            }
          ]
        }
      ]
    },
    {
      "spec": "director",
      "operation": "ADDED",
      "description": "Add requirement: The preview MUST report project content and dependencies.",
      "requirement": {
        "text": "The preview MUST report project content and dependencies.",
        "scenarios": [
          {
            "rawText": "- **WHEN** a caller describes a shared project\n- **THEN** the preview reports scene, shot and byte totals with data pack attribution\n- **AND** The preview counts the second scene and the second shot, and lists the second data pack. The preview adds the bytes of the second asset to the byte total."
          },
          {
            "rawText": "- **WHEN** a preview describes a data pack source\n- **THEN** the preview reports included, absent, configured or unavailable source states\n- **AND** Without source IDs, the preview reports every external source as unavailable."
          },
          {
            "rawText": "- **WHEN** a preview describes scene dependencies\n- **THEN** the preview reports absent layers and whether a scene has applied shot packs or a shot has a source pack ID\n- **AND** The preview lists each absent layer once, even when two shots name that layer.\n- **AND** Without layer IDs, the preview reports every named layer as absent.\n- **AND** With applied shot packs, the preview does not read source pack IDs to decide whether the scene has external content.\n- **AND** The preview reports the absent layers of the second shot in the second scene. It reports external content from the source pack ID of that shot."
          }
        ]
      },
      "requirements": [
        {
          "text": "The preview MUST report project content and dependencies.",
          "scenarios": [
            {
              "rawText": "- **WHEN** a caller describes a shared project\n- **THEN** the preview reports scene, shot and byte totals with data pack attribution\n- **AND** The preview counts the second scene and the second shot, and lists the second data pack. The preview adds the bytes of the second asset to the byte total."
            },
            {
              "rawText": "- **WHEN** a preview describes a data pack source\n- **THEN** the preview reports included, absent, configured or unavailable source states\n- **AND** Without source IDs, the preview reports every external source as unavailable."
            },
            {
              "rawText": "- **WHEN** a preview describes scene dependencies\n- **THEN** the preview reports absent layers and whether a scene has applied shot packs or a shot has a source pack ID\n- **AND** The preview lists each absent layer once, even when two shots name that layer.\n- **AND** Without layer IDs, the preview reports every named layer as absent.\n- **AND** With applied shot packs, the preview does not read source pack IDs to decide whether the scene has external content.\n- **AND** The preview reports the absent layers of the second shot in the second scene. It reports external content from the source pack ID of that shot."
            }
          ]
        }
      ]
    }
  ]
}
Warning: Ignoring flags not applicable to change: scenarios
```

### openspec validate

```text
Command: taskset -c 12-15 nice -n 19 openspec validate backfill-director-packs-sharing
Change 'backfill-director-packs-sharing' is valid
```

### headings

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/final-docs-checks.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "documentsChecked": 52,
  "changedHeadings": [
    {
      "file": "openspec/changes/backfill-director-packs-sharing/evidence.md",
      "previous": [
        "## Source commands",
        "## Base scope",
        "## Repository tests of pass 2",
        "## Host coverage",
        "## Scenario tests",
        "## Review corrections",
        "## Text that stays the same",
        "## Known limits",
        "## Tests without tags",
        "## Title correction",
        "## Corrections of review round 2",
        "## Pass 4",
        "## Pass 5",
        "## Pass 6",
        "## Pass 7 title corrections",
        "## Pass 7",
        "## Pass 8"
      ],
      "current": [
        "## Source commands",
        "## Base scope",
        "## Repository tests of pass 2",
        "## Host coverage",
        "## Scenario tests",
        "## Review corrections",
        "## Text that stays the same",
        "## Known limits",
        "## Tests without tags",
        "## Title correction",
        "## Corrections of review round 2",
        "## Pass 4",
        "## Pass 5",
        "## Pass 6",
        "## Pass 7 title corrections",
        "## Pass 7",
        "## Pass 8",
        "## Pass 9"
      ]
    },
    {
      "file": "openspec/changes/backfill-director-packs-sharing/tasks.md",
      "previous": [
        "## 1. Spec documents",
        "## 2. Scenario tests",
        "## Corrections of review round 1",
        "## 3. Gates and review",
        "## Corrections of review round 2",
        "## 7 Pass 4",
        "## 8 Pass 5",
        "## 9. Corrections of review round 4",
        "## 10. Corrections of review round 5",
        "## 11. Correct round 6 findings"
      ],
      "current": [
        "## 1. Spec documents",
        "## 2. Scenario tests",
        "## Corrections of review round 1",
        "## 3. Gates and review",
        "## Corrections of review round 2",
        "## 7 Pass 4",
        "## 8 Pass 5",
        "## 9. Corrections of review round 4",
        "## 10. Corrections of review round 5",
        "## 11. Correct round 6 findings",
        "## 12. Correct pre-review 7 findings"
      ]
    }
  ],
  "requiredProposalHeadings": [
    "## Why",
    "## What Changes",
    "## Capabilities",
    "## Impact",
    "## Known limits and later changes"
  ]
}
```

### scope

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/final-docs-checks.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "productionFilesUnchanged": [
    "packs/manifest",
    "packs/geojson",
    "packs/session",
    "packs/source",
    "sharing/bundle",
    "sharing/lifetime",
    "sharing/preview"
  ],
  "productionDiff": "",
  "testBodiesUnchanged": true,
  "retaggedRows": 3,
  "changedFiles": [
    "openspec/changes/backfill-director-packs-sharing/audit.md",
    "openspec/changes/backfill-director-packs-sharing/design.md",
    "openspec/changes/backfill-director-packs-sharing/evidence.md",
    "openspec/changes/backfill-director-packs-sharing/mutations.md",
    "openspec/changes/backfill-director-packs-sharing/probe-ranges.md",
    "openspec/changes/backfill-director-packs-sharing/proposal.md",
    "openspec/changes/backfill-director-packs-sharing/specs/director/spec.md",
    "openspec/changes/backfill-director-packs-sharing/survivors.md",
    "openspec/changes/backfill-director-packs-sharing/tasks.md",
    "src/director/packs/backfill.test.mjs",
    "src/director/sharing/sharing.test.mjs"
  ]
}
```

### source audits

```text
Command: taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass9/source-audits.py
{
  "sourceCommit": "b7653ad75c059af9b1305d81922fd76bbc20d66a",
  "pastSearchRecordEqualsF8f6a94d": true,
  "oldRecordCount": 245,
  "oldRecordsEqualF8f6a94d": true,
  "additionalPass8RecordsUnchanged": 520,
  "pass8CorrectionSubjects": 33,
  "missingSubjects": [],
  "stableScenarioIds": 35,
  "requirementSentencesUnchanged": true
}
```

### diff check

```text
Command: taskset -c 12-15 nice -n 19 git diff --check
```

### Host prose checks

```text
Command: taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing
STE: 0 errors, 567 warnings.
```

The full lint output is lint-final.log in the pass9 scratch folder.
The predispatch output is predispatch.log in that folder.
The checker lists old records, code abbreviations and finite verbs as possible prose faults.
Pass 9 keeps those records.
The worker changes no QA script, production file or review report.

### Hand command

The tool clips each failed title at 100 characters.
The current document labels keep the full titles.
Pass 9 note: the report removes spaces at line ends.
The raw command output stays in hand-final.log in the pass9 scratch folder.

```text
Command: NODE_OPTIONS=--test-isolation=none PYTHONUNBUFFERED=1 taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-3 /home/ianblenke/docker/gev-tools/director-3/muts.json
m001: KILLED [director-076] The validator returns without an error for safe names for the asset path
m002: KILLED [director-076] The validator rejects traversal for the asset path
m003: KILLED [director-077] The validator rejects an invalid version
m004: KILLED [director-077] The validator rejects an invalid format
m005: KILLED [director-078] The validator rejects the protocol for the attribution
m006: KILLED [director-078] The validator rejects the username for the attribution
m007: KILLED [director-078] The validator rejects the password for the attribution
m008: KILLED [director-078] The validator rejects the query for the attribution
m009: KILLED [director-078] The validator rejects the fragment for the attribution
m010: KILLED [director-078] The validator rejects invalid URL text for the attribution
m011: KILLED [director-078] The validator returns without an error for a safe link for the attribution
m012: KILLED [director-078] The validator rejects blank text for the attribution
m013: KILLED [director-078] The validator rejects a blank license for the attribution
m014: KILLED [director-079] The validator rejects a fraction for the byteLength field
m015: KILLED [director-079] The validator rejects an invalid type for the digest
m016: KILLED [director-079] The validator rejects an invalid alphabet for the digest
m017: KILLED [director-079] The validator accepts integrity limits and rejects zero or excess byteLength
m018: KILLED [director-080] The validator rejects reversed west for the image
m019: KILLED [director-080] The validator rejects reversed south for the image
m020: KILLED [director-080] The validator rejects short bounds for the image
m021: KILLED [director-080] The validator rejects height and reference for the image
m022: KILLED [director-081] The validator rejects an unknown anchor for the media
m023: KILLED [director-082] The validator rejects duplicate data pack IDs for the scene
m024: KILLED [director-082] The validator rejects duplicate data pack IDs for the shot
m025: KILLED [director-082] The validator rejects unknown data pack IDs for the shot
m026: KILLED [director-082] The validator returns without an error for absent data packs and anchors for the scen
m027: KILLED [director-083] The decoder rejects an invalid type for the collection
m028: KILLED [director-083] The decoder rejects an invalid array for the collection
m029: KILLED [director-083] The decoder rejects more than 2000 features for the collection
m030: KILLED [director-084] The decoder rejects the type for the feature
m031: KILLED [director-084] The decoder rejects ID type for the feature
m032: KILLED [director-084] The decoder rejects a blank ID for the feature
m033: KILLED [director-084] The decoder rejects a long ID for the feature
m034: KILLED [director-084] The decoder rejects a duplicate ID for the feature
m035: KILLED [director-085] The decoder rejects an invalid array for the position
m036: KILLED [director-085] The decoder rejects an invalid length for the position
m037: KILLED [director-085] The decoder rejects a coordinate that is not finite for the position
m038: KILLED [director-085] The decoder rejects an invalid longitude for the position
m039: KILLED [director-085] The decoder rejects an invalid latitude for the position
m040: KILLED [director-085] The decoder rejects a height below the limit for the position
m041: KILLED [director-085] The decoder rejects a height above the limit for the position
m042: KILLED [director-085] The decoder rejects more than 50000 positions
m043: KILLED [director-085] The decoder returns zero for absent height for the position
m044: KILLED [director-085] The decoder returns the height in the data for the position
m045: KILLED [director-086] The decoder rejects an invalid array for the line
m046: KILLED [director-086] The decoder rejects an invalid minimum for the line
m047: KILLED [director-086] The decoder rejects a ring with fewer than four points for the ring
m048: KILLED [director-086] The decoder accepts two distinct endpoints for the line and returns coordinates
m049: KILLED [director-086] The decoder rejects unclosed field 0 for the ring
m050: KILLED [director-086] The decoder rejects unclosed field 1 for the ring
m051: KILLED [director-086] The decoder rejects unclosed field 2 for the ring
m052: KILLED [director-087] The decoder rejects an invalid type for the geometry
m053: KILLED [director-087] The decoder rejects an invalid array for the geometry
m054: KILLED [director-087] The decoder rejects an empty polygon for the geometry
m055: KILLED [director-087] The decoder rejects more than 128 rings for the geometry
m056: KILLED [director-087] The decoder returns a closed polygon for the geometry
m057: KILLED [director-087] The decoder removes properties for the geometry
m058: KILLED [director-088] The new session reports the idle state and zero handles
m059: KILLED [director-088] The session rejects a value that is not a data pack list
m060: KILLED [director-088] The session rejects more than eight data packs
m061: KILLED [director-088] The load call returns false after the caller destroys the session without a source ca
m062: KILLED [director-088] The load call returns false for a cancelled signal without a source call
m063: KILLED [director-089] The session disposes handles in reverse order
m064: KILLED [director-089] The session reports ready after the caller changes a state copy
m065: KILLED [director-090] The session disposes late resources for the cancelled session
m066: KILLED [director-090] The session returns false for cancelled work with a null late handle
m067: KILLED [director-090] The session returns false when the caller destroys it during asset work
m068: KILLED [director-091] The session keeps the new resources after a new load call
m069: KILLED [director-092] The session reports a stable source error
m070: KILLED [director-092] The session rejects stalled work for the deadline
m071: KILLED [director-092] The session reads the byteLength field once without a registered source
m072: KILLED [director-092] The session rejects an absent renderer without a source call
m073: KILLED [director-093] The session rejects bytes that are not a Uint8Array
m074: KILLED [director-093] The session rejects an empty asset
m075: KILLED [director-093] The session rejects an asset above the byte limit
m076: KILLED [director-093] The session rejects a wrong byteLength field
m077: KILLED [director-093] The session rejects bytes above the total limit
m078: KILLED [director-093] The session rejects a wrong digest
m079: KILLED [director-093] The session returns true for exact bytes and digest
m080: KILLED [director-089] The session rejects a falsy handle with inherited disposal
m081: KILLED [director-089] The session rejects a handle without a dispose function
m082: KILLED [director-094] The factory rejects the protocol
m083: KILLED [director-094] The factory rejects the username
m084: KILLED [director-094] The factory rejects the password
m085: KILLED [director-094] The factory rejects the query
m086: KILLED [director-094] The factory rejects the fragment
m087: KILLED [director-094] The factory rejects a directory URL with no final slash
m088: KILLED [director-095] The source sets its fixed options for the asset request
m089: KILLED [director-096] The source joins distinct stream chunks
m090: KILLED [director-096] The source rejects excess header bytes for the stream
m091: KILLED [director-096] The source rejects excess chunk bytes for the stream
m092: KILLED [director-096] The source returns an empty media type when the header is absent
m093: KILLED [director-096] The source returns lowercase media type text without parameters
m094: KILLED [director-097] The source rejects an absent stream
m095: KILLED [director-097] The source rejects the asset request after failed body cancellation
m096: KILLED [director-097] The source rejects a failed response without a body
m097: KILLED [director-097] The source releases the reader lock after a stream error
m098: KILLED [director-097] The source checks its signal between chunks and rejects the call
m099: KILLED [director-098] The import rejects nontext input
m100: KILLED [director-098] The import rejects invalid JSON; [director-098] The import rejects invalid JSON of 52428800 characters; [director-098] The import rejects invalid JSON of 5242881 characters
m101: KILLED [director-098] The import accepts plain project JSON and returns the project
m102: KILLED [director-098] The import rejects excess characters
m103: KILLED [director-098] The import rejects excess UTF8 bytes
m104: KILLED [director-099] The import rejects a custom text object for the base64
m105: KILLED [director-099] The import rejects an empty base64 value
m106: KILLED [director-099] The import rejects an invalid length for the base64
m107: KILLED [director-099] The import rejects an invalid alignment for the base64
m108: KILLED [director-099] The import rejects an invalid alphabet for the base64
m109: KILLED [director-099] The import rejects an invalid padding for the base64
m110: KILLED [director-099] The import rejects duplicate paths
m111: KILLED [director-099] The import rejects an unsupported media type
m112: KILLED [director-099] The import rejects unsupported version
m113: KILLED [director-100] The import rejects an absent asset
m114: KILLED [director-100] The import rejects a wrong byteLength field
m115: KILLED [director-100] The import rejects a pack digest that differs from its asset
m116: KILLED [director-100] The import rejects an asset digest that differs from its bytes
m117: KILLED [director-100] The import rejects unused assets
m118: KILLED [director-100] The import rejects external data pack sources
m119: KILLED [director-101] The export writes exact bundle metadata
m120: KILLED [director-102] The export rejects bytes that are not a Uint8Array
m121: KILLED [director-102] The export rejects an empty asset
m122: KILLED [director-102] The export rejects an asset above the byte limit
m123: KILLED [director-102] The export rejects absent assets
m124: KILLED [director-102] The export rejects declared byteLength
m125: KILLED [director-102] The export rejects declared digest
m126: KILLED [director-102] The export returns bundle text at the total byte limit and rejects one more byte
m127: KILLED [director-102] The export rejects excess asset total
m128: KILLED [director-103] The export reuses a shared asset and returns bundle text
m129: KILLED [director-103] The export rejects shared byteLength
m130: KILLED [director-103] The export rejects shared digest
m131: KILLED [director-104] The store copies the asset map
m132: KILLED [director-104] The store clears stored bytes
m133: KILLED [director-105] The store rejects absent bytes
m134: KILLED [director-105] The store rejects bytes above the caller limit
m135: KILLED [director-105] The store returns an independent byte copy
m136: KILLED [director-106] The share helpers return an empty asset map for an absent filename
m137: KILLED [director-106] The share helpers reject the ordinary file limit
m138: KILLED [director-106] The share helpers return a project with the larger bundle file limit and reject exces
m139: KILLED [director-107] The helper resolves without a signal
m140: KILLED [director-107] The helper rejects an early signal
m141: KILLED [director-107] The helper resolves with an active signal
m142: KILLED [director-107] The helper rejects a work error
m143: KILLED [director-107] The helper checks signal state when the work settles and rejects the call
m144: KILLED [director-107] The helper cancels work that is not complete
m145: KILLED [director-108] The preview reports exact totals and attribution
m146: KILLED [director-108] The preview reports the scene ID when the title is absent
m147: KILLED [director-109] The preview reports included bundle bytes
m148: KILLED [director-109] The preview reports absent bundle bytes
m149: KILLED [director-109] The preview reports a configured source; [director-109] The preview reports a configured source for a supplied source ID
m150: KILLED [director-109] The preview reports an unavailable source
m151: KILLED [director-110] The preview lists distinct absent layers
m152: KILLED [director-110] The preview reports external content for applied shot packs
m153: KILLED [director-110] The preview reports external content for a shot with a source pack ID
m154: KILLED [director-110] The preview reports no external content without source packs
m155: KILLED [director-080] The validator returns without an error for its bounds field for the image
m156: KILLED [director-080] The validator returns without an error for its height field for the image
m157: KILLED [director-080] The validator returns without an error for its altitudeReference field for the image
m158: KILLED [director-081] The validator returns without an error for its anchorId field for the media
m159: KILLED [director-077] The validator returns without an error for a GeoJSON altitudeReference field
m160: KILLED [director-080] The validator rejects low excess for image bounds field 0
m161: KILLED [director-080] The validator rejects high excess for image bounds field 0
m162: KILLED [director-080] The validator rejects low excess for image bounds field 1
m163: KILLED [director-080] The validator rejects high excess for image bounds field 1
m164: KILLED [director-080] The validator rejects low excess for image bounds field 2
m165: KILLED [director-080] The validator rejects high excess for image bounds field 2
m166: KILLED [director-080] The validator rejects low excess for image bounds field 3
m167: KILLED [director-080] The validator rejects high excess for image bounds field 3
m168: KILLED [director-080] The validator rejects an image height above the upper limit
m169: KILLED [director-082] The validator uses supplied anchors for the scene and returns without an error
m170: KILLED [director-082] The validator uses absent anchor defaults for the scene and returns without an error
m171: KILLED [director-085] The decoder accepts both geographic edges for the position and returns coordinates
m172: SURVIVED
m173: KILLED [director-088] The new session reports the idle state; [director-088] The new session reports the idle state and zero handles
m174: KILLED [director-088] The new session reports zero handles
m175: KILLED [director-089] The session reports one active handle
m176: KILLED [director-093] The session calls the source with a default limit of 8388608 bytes
m177: KILLED [director-093] The session returns true without a declared size
m178: KILLED [director-090] The session returns false for a cancelled signal without an event
m179: KILLED [director-090] The session checks destroyed state after it reads the signal
m180: KILLED [director-090] The session returns false for a cleared load call and does not read the signal state
m181: KILLED [director-090] The load call returns false and disposes a detached resource
m182: KILLED [director-090] The session disposes the handle before it adds the handle to its list
m183: KILLED [director-092] The session settles a source error before its deadline and reports idle
m184: KILLED [director-097] The source rejects early cancellation
m185: KILLED [director-094] The factory returns a source for HTTP and HTTPS directories
m186: KILLED [director-098] The import rejects 52428801 characters before byte conversion
m187: KILLED [director-101] The export accepts scenes without data packs and returns bundle text
m188: KILLED [director-101] The export returns one asset for a supplied data pack list
m189: KILLED [director-102] The export accepts absent integrity fields and returns bundle text
m190: KILLED [director-102] The export accepts an absent digest and returns bundle text
m191: KILLED [director-103] The export accepts absent byte declarations for the shared export and returns bundle
m192: KILLED [director-103] The export accepts an absent digest for the shared export and returns bundle text
m193: KILLED [director-099] The import accepts bytes without padding for the base64 and returns assets
m194: KILLED [director-108] The preview reports no packs when data pack lists are absent
m195: KILLED [director-108] The preview reports one pack from the supplied data pack list
m196: KILLED [director-108] The preview reports Example for the supplied scene title
m197: KILLED [director-109] The preview reports a configured source for a supplied source ID
m198: KILLED [director-110] The preview reports no absent layer when a shot has no layers
m199: KILLED [director-110] The preview reports traffic as absent without layer IDs
m200: KILLED [director-105] The store rejects 8388609 bytes without a caller limit
m201: KILLED [director-092] The session rejects an absent renderer without a source call
m202: KILLED [director-099] The import rejects a custom text object for the base64
m203: KILLED [director-103] The export key uses the registered source name and returns bundle text
m204: KILLED [director-103] The export key uses path and returns bundle text
m205: KILLED [director-110] The preview reports ships as absent when only traffic is configured
m206: KILLED [director-108] The preview reports three bytes for both assets
m207: KILLED [director-095] The source sets its credentials option for the asset request
m208: KILLED [director-095] The source sets its redirect option for the asset request
m209: KILLED [director-095] The source sets its referrerPolicy option for the asset request
m210: KILLED [director-095] The source sets its cache option for the asset request
m211: KILLED [director-085] The decoder rejects field 0 that is not finite for the position
m212: KILLED [director-085] The decoder rejects field 1 that is not finite for the position
m213: KILLED [director-085] The decoder rejects field 2 that is not finite for the position
m214: KILLED [director-096] The source rejects 8388609 bytes without a caller limit
m215: KILLED [director-077] The validator returns without an error for the id field of a data pack
m216: KILLED [director-077] The validator returns without an error for the version field of a data pack
m217: KILLED [director-077] The validator returns without an error for the format field of a data pack
m218: KILLED [director-077] The validator returns without an error for the source field of a data pack
m219: KILLED [director-077] The validator returns without an error for the attribution field of a data pack
m220: KILLED [director-077] The validator returns without an error for the placement field of a data pack
m221: KILLED [director-079] The validator returns without an error for the byteLength field of a data pack
m222: KILLED [director-079] The validator returns without an error for the sha256 field of a data pack
m223: KILLED [director-077] The validator returns without an error for its source name field
m224: KILLED [director-077] The validator returns without an error for its source path field
m225: KILLED [director-078] The validator returns without an error for its attribution text field
m226: KILLED [director-078] The validator returns without an error for its attribution license field
m227: KILLED [director-078] The validator returns without an error for its attribution url field
m228: KILLED [director-100] The import checks its second asset reference and rejects the call
m229: KILLED [director-100] The import checks its second asset digest and rejects the call
m230: KILLED [director-103] The export accepts equal shared integrity and returns bundle text
m231: KILLED [director-102] The export rejects absent asset bytes
m232: KILLED [director-092] The session settles an early internal signal and reports idle
m233: KILLED [director-093] The session calls the renderer with the anchors and returns true
m234: KILLED [director-106] The share helpers call throwIfAborted three times and return an empty asset map
m235: KILLED [director-102] The export rejects encoded bundle text above 52428800 bytes
m236: KILLED [director-102] The export keeps its total after an asset without a byte length
m237: KILLED [director-089] The session reports ready after asset work
m238: KILLED [director-080] The validator returns without an error for the fields of the image placement
m239: KILLED [director-081] The validator returns without an error for the fields of the media placement
m240: KILLED [director-089] The session calls the GeoJSON renderer once and returns true
m241: KILLED [director-089] The session calls the image renderer once and returns true
m242: KILLED [director-089] The session calls the media renderer once and returns true
m243: KILLED [director-097] The source stops between stream chunks
m244: KILLED [director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and cred
m245: KILLED [director-080] The manifest checks given image bounds and media anchor references
m246: KILLED [director-095 director-096 director-097] The directory source sends no credentials and rejects inval
m247: KILLED [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
m248: KILLED [director-089] The data pack session removes resources and cancels the transport on Stop
m249: KILLED [director-091] The data pack session replaces source work and ignores its late bytes
m250: KILLED [director-090] The data pack session disposes late renderer resources after cancellation and keeps t
m251: KILLED [director-090] The data pack session disposes a renderer resource when its signal stops after the re
m252: KILLED [director-092] The deadline stops a stalled registered source and a data pack error removes earlier
m253: KILLED [director-093] The data pack session checks bytes and integrity before the renderer call and rejects
m254: KILLED [director-097] The directory source cancels response bodies and sends no asset request with a cancel
m255: KILLED [director-101] The export copies bytes and attribution and keeps the project without an asset reques
m256: KILLED [director-099] The import rejects invalid bytes, unknown fields, traversal, duplicates, absent asset
m257: KILLED [director-102] The export rejects excess bytes, wrong integrity and absent assets
m258: KILLED [director-103] The export writes one asset and rejects integrity declarations that differ for the da
m259: KILLED [director-109] The preview reports unavailable sources, absent layers and absent bundle assets
m260: KILLED [director-104] The store removes old data after replacement and uses no network source
m261: KILLED [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled
m262: KILLED [director-107] The export stops before the next asset and returns no partial output
m263: KILLED [director-101] The export returns bundle text for a source path of 1024 characters
m264: KILLED [director-077] The validator returns without an error for geojson
m265: KILLED [director-077] The validator returns without an error for image
m266: KILLED [director-077] The validator returns without an error for media
m267: KILLED [director-080] The validator rejects bounds field 0 for the image
m268: KILLED [director-080] The validator rejects bounds field 1 for the image
m269: KILLED [director-080] The validator rejects bounds field 2 for the image
m270: KILLED [director-080] The validator rejects bounds field 3 for the image
m271: KILLED [director-092] The session rejects stalled work at the 19 milliseconds deadline
m272: KILLED [director-092] The session rejects stalled work at the default 15000 milliseconds deadline
m273: KILLED [director-092] The session removes resources after a later error
m274: KILLED [director-099] The import accepts the application/json media type and returns assets
m275: KILLED [director-099] The import accepts the application/geo+json media type and returns assets
m276: KILLED [director-099] The import accepts the image/png media type and returns assets
m277: KILLED [director-099] The import accepts the video/mp4 media type and returns assets
m278: KILLED [director-099] The import accepts the video/webm media type and returns assets
m279: KILLED [director-099] The import accepts the audio/mpeg media type and returns assets
m280: KILLED [director-099] The import accepts the audio/ogg media type and returns assets
m281: KILLED [director-099] The import accepts the audio/wav media type and returns assets
m282: KILLED [director-099] The import accepts the audio/webm media type and returns assets
m283: KILLED [director-089] The session rejects a falsy handle with inherited disposal
m284: KILLED [director-088] The session returns false and does not read the caller signal state after the caller
m285: KILLED [director-083] The decoder accepts the exact feature limit of the collection and returns 2000 featur
m286: KILLED [director-084] The decoder accepts the exact text limit of the feature ID and returns a feature with
m287: KILLED [director-085] The decoder accepts the exact position limit of the collection and returns 50000 posi
m288: KILLED [director-087] The decoder accepts the exact ring limit of the polygon and returns 128 rings
m289: KILLED [director-076] The validator rejects a path above its text limit for the asset path
m290: KILLED [director-102] The export accepts its exact asset total and returns bundle text
m291: KILLED [director-089] The session keeps every data pack handle
m292: KILLED [director-095] The source sets its signal option for the asset request
m293: KILLED [director-096] The source accepts the exact byte limit of the stream and returns bytes
m294: KILLED [director-096] The source accepts the exact byte limit of the stream and returns bytes
m295: KILLED [director-092] The session rejects a falsy custom source
m296: KILLED [director-101] The export writes exact bundle metadata
m297: KILLED [director-101] The export writes exact bundle metadata
m298: KILLED [director-101] The export writes exact bundle metadata
m299: KILLED [director-101] The export writes exact bundle metadata
m300: KILLED [director-101] The export writes exact bundle metadata
m301: KILLED [director-101] The export writes exact bundle metadata
m302: KILLED [director-105] The store returns an independent byte copy
m303: KILLED [director-079] The validator rejects 63 characters for the digest
m304: KILLED [director-079] The validator rejects 65 characters for the digest
m305: KILLED [director-079] The validator rejects a prefix for the digest
m306: KILLED [director-079] The validator rejects a suffix for the digest
m307: KILLED [director-079] The validator rejects uppercase text for the digest
m308: KILLED [director-080] The validator rejects equal longitude edges for the image
m309: KILLED [director-080] The validator rejects equal latitude edges for the image
m310: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m311: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m312: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m313: KILLED [director-080] The validator returns without an error for all geographic limits for the image
m314: KILLED [director-082] The validator does not read a data pack list from the parent object of the scene and
m315: KILLED [director-080] The validator rejects text for each geographic field for the image
m316: KILLED [director-080] The validator rejects text for each geographic field for the image
m317: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text fo
m318: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text fo
m319: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text fo
m320: KILLED [director-076] The validator returns without an error for 1024 characters and rejects 1025 for the a
m321: KILLED [director-076] The validator rejects URL syntax with a stable message for the asset path
m322: KILLED [director-088] The session returns true for eight data packs
m323: KILLED [director-093] The session returns true at the asset byte limit
m324: KILLED [director-093] The session returns true at the total byte limit
m325: KILLED [director-093] The source receives the path, the renderer receives the asset and the signal, and the
m326: KILLED [director-093] The source receives the path, the renderer receives the asset and the signal, and the
m327: KILLED [director-093] The source receives the path, the renderer receives the asset and the signal, and the
m328: KILLED [director-089] The session removes its deadline after success
m329: KILLED [director-089] The session removes its deadline after clear
m330: KILLED [director-088] The session checks every declaration before the source call and rejects the call
m331: KILLED [director-089] The session disposes both ready handles in reverse order and reports idle
m332: KILLED [director-088] The session checks every declaration before the source call and rejects the call
m333: KILLED [director-083] The decoder rejects invalid UTF8 bytes
m334: KILLED [director-083] The decoder rejects null
m335: KILLED [director-084] The decoder rejects a null feature
m336: KILLED [director-084] The decoder rejects a null feature
m337: KILLED [director-087] The decoder rejects absent geometry
m338: KILLED [director-087] The decoder rejects absent geometry
m339: KILLED [director-087] The decoder rejects absent geometry
m340: KILLED [director-095] The source uses the default fetch function and returns bytes
m341: KILLED [director-102] The export returns bundle text at the total byte limit and rejects one more byte
m342: KILLED [director-102] The export returns bundle text at the total byte limit and rejects one more byte
m343: KILLED [director-099] The import returns assets at the base64 length limit and rejects the next aligned len
m344: KILLED [director-106] The share helpers accept the project file limit and reject one more byte
m345: KILLED [director-106] The share helpers accept the bundle file limit and reject one more byte
m346: KILLED [director-102] The export rejects an unsupported media type
m347: KILLED [director-099] The import rejects 65 different asset paths
m348: KILLED [director-099] The import returns assets at the total byte limit and rejects one more byte
m349: KILLED [director-099] The import returns assets at the total byte limit and rejects one more byte
m350: KILLED [director-105] The store rejects a cancelled source call
m351: KILLED [director-107] The bundle helpers stop import before an asset
m352: KILLED [director-107] The bundle helpers stop import after a digest
m353: KILLED [director-107] The bundle helpers stop export before an asset
m354: KILLED [director-107] The bundle helpers stop export after asset bytes
m355: KILLED [director-107] The bundle helpers stop export after a digest
m356: KILLED [director-108] The preview counts shots apart from scenes
m357: KILLED [director-108] The preview counts shots apart from scenes
m358: KILLED [director-110] The preview lists distinct absent layers
m359: KILLED [director-077] The validator returns without an error for 256 characters for its ID and rejects 257
m360: KILLED [director-077] The validator returns without an error for 256 characters for its ID and rejects 257
m361: KILLED [director-077] The validator returns without an error for 256 characters for its source name and rej
m362: KILLED [director-077] The validator returns without an error for 256 characters for its source name and rej
m363: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text fo
m364: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text fo
m365: KILLED [director-078] The validator returns without an error for its text limits and rejects excess text fo
m366: KILLED [director-076] The validator returns without an error for 1024 characters and rejects 1025 for the a
m367: KILLED [director-102] The export rejects excess asset total
m368: KILLED [director-085] The decoder rejects negative longitude for the position
m369: KILLED [director-085] The decoder rejects negative latitude for the position
m370: KILLED [director-085] The decoder accepts the limit for negative longitude for the position and returns coo
m371: KILLED [director-085] The decoder accepts the limit for negative latitude for the position and returns coor
m372: KILLED [director-085] The decoder rejects four coordinates for the position
m373: KILLED [director-085] The decoder rejects one coordinate for the position
m374: KILLED [director-076] The validator rejects .x for the asset path
m375: KILLED [director-076] The validator rejects x?a=1 for the asset path
m376: KILLED [director-079] The validator returns without an error for one byte
m377: KILLED [director-080] The validator rejects bounds outside an array for the image
m378: KILLED [director-082] The validator rejects nine distinct data packs for the scene
m379: KILLED [director-082] The validator returns without an error for eight distinct data packs for the scene
m380: KILLED [director-089] The session reports its state during asset work
m381: KILLED [director-096] The source accepts its default byte limit and returns bytes
m382: KILLED [director-098] The import accepts the character limit and returns the project
m383: KILLED [director-098] The import returns one asset at the multibyte text limit and rejects one more byte
m384: KILLED [director-098] The import rejects an invalid plain project
m385: KILLED [director-098] The import rejects a null project
m386: KILLED [director-099] The import rejects an extra top-level field
m387: KILLED [director-099] The import rejects an invalid bundle project
m388: KILLED [director-099] The import accepts 64 distinct assets and returns assets
m389: SURVIVED
m390: KILLED [director-101] The export calls the resolver with the data pack and signal
m391: KILLED [director-101] The export calls the resolver with the data pack and signal
m392: KILLED [director-102] The export accepts the text byte limit and returns bundle text
m393: KILLED [director-105] The store accepts the caller byte limit and returns byte copies
m394: KILLED [director-093] The session calls the renderer with the data pack and the scene anchors and returns t
m395: KILLED [director-093] The session calls the renderer with the data pack and the scene anchors and returns t
m396: KILLED [director-089] The session removes source listeners after success
m397: KILLED [director-089] The session removes source listeners after success
m398: KILLED [director-089] The session removes source listeners after error
m399: KILLED [director-079] The validator returns without an error for its byte limit
m400: KILLED [director-080] The validator returns without an error for its minimum height for the image
m401: KILLED [director-080] The validator returns without an error for its maximum height for the image
m402: KILLED [director-085] The decoder accepts its minimum height for the position and returns coordinates
m403: KILLED [director-085] The decoder accepts its maximum height for the position and returns coordinates
m404: KILLED [director-107] The helper removes its listener after cancel
m405: KILLED [director-107] The helper removes its listener after success
m406: KILLED [director-107] The helper removes its listener after error
m407: KILLED [director-107] The helper removes its listener after success
m408: KILLED [director-101] The export rejects an invalid project
m409: KILLED [director-107] The import stops before the second digest
m410: KILLED [director-107] The export stops before the second resolver call
m411: KILLED [director-082] The validator rejects a reference in the second shot
m412: KILLED [director-082] The validator rejects a reference in the second shot
m413: KILLED [director-099 director-102] The bundle helpers reject an SVG media type during import and export
m414: KILLED [director-077] The validator rejects an unlisted geojsonx format
m415: KILLED [director-094] The factory rejects the file protocol
m416: KILLED [director-077 director-082] The validator rejects an invalid second data pack
m417: KILLED [director-081] The validator returns without an error for a reference to the second anchor
m418: KILLED [director-082] The validator rejects an unknown second reference ID
m419: KILLED [director-084] The decoder rejects the second feature
m420: KILLED [director-085 director-086] The decoder rejects the second line position
m421: KILLED [director-087] The decoder rejects the second ring
m422: KILLED [director-088] The session rejects an invalid second data pack before the source call
m423: KILLED [director-081 director-093] The session returns true for a reference to the second anchor
m424: KILLED [director-080] The validator rejects bounds field 3 for the image
m425: KILLED [director-076] The validator rejects an invalid second path segment
m426: KILLED [director-085] The decoder rejects an invalid second coordinate
m427: KILLED [director-086] The decoder rejects unclosed field 2 for the ring
m428: KILLED [director-089] The session keeps every data pack handle
m429: KILLED [director-092] The session removes resources after a later error
m430: KILLED [director-096] The source joins chunks of different lengths
m431: KILLED [director-101] The export includes the asset of the second scene and returns bundle text
m432: KILLED [director-101] The export writes each asset index and filename
m433: KILLED [director-100] The import checks its second asset reference and rejects the call
m434: KILLED [director-101] The export writes each asset index and filename
m435: KILLED [director-101] The export writes each asset index and filename
m436: KILLED [director-104] The store counts the second asset
m437: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m438: KILLED [director-108] The preview lists the second data pack
m439: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m440: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m441: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m442: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m443: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m444: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m445: KILLED [director-097] The source cancels before it reads the second chunk
m446: KILLED [director-101] The export encodes the second byte chunk and returns bundle text
m447: KILLED [director-107] The import stops after the second digest
m448: KILLED [director-107] The export stops after the second digest
m449: KILLED [director-110] The preview reports both absent named layers without layer IDs
m450: KILLED [director-110] The preview reports both absent named layers without layer IDs
m451: KILLED [director-110] The preview reports both absent named layers without layer IDs
m452: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m453: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m454: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m455: KILLED [director-077] The validator rejects the extra fields script and adapters in the data pack
m456: KILLED [director-077] The validator rejects the extra fields script and adapters in the source
m457: KILLED [director-078] The validator rejects the extra fields script and adapters in the attribution
m458: KILLED [director-080] The validator rejects the extra fields script and adapters in the image placement
m459: KILLED [director-077] The validator rejects the extra fields script and adapters in the media placement
m460: KILLED [director-077] The validator rejects the extra fields script and adapters in the GeoJSON placement
m461: KILLED [director-099] The import rejects the extra fields script and adapters in the top-level object
m462: KILLED [director-099] The import rejects the extra fields script and adapters in the asset
m463: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m464: KILLED [director-088 director-093] The session calls both registered sources and both renderers
m465: KILLED [director-110] The preview reports both absent named layers without layer IDs
m466: KILLED [director-110] The preview reports both absent named layers without layer IDs
m467: KILLED [director-110] The preview reports no absent layer when both layer IDs are configured
m468: KILLED [director-109] The preview reports both configured sources as configured
m469: KILLED [director-082] The validator returns without an error for eight references and rejects nine referenc
m470: KILLED [director-081] The validator returns without an error for a reference to the second anchor
m471: KILLED [director-081 director-093] The session returns true for a reference to the second anchor
m472: KILLED [director-104] The store counts the second asset
m473: KILLED [director-104] The store counts the second asset
m474: KILLED [director-104] The store counts the second asset
m475: KILLED [director-108 director-110] The preview counts the second scene and shot and adds the bytes of the s
m476: KILLED [director-101] The export encodes the second byte chunk and returns bundle text
m477: KILLED [director-093] The session returns true for exact bytes and digest
m478: KILLED [director-099] The import returns the bytes 1, 2 and 3 and the literal digest
m479: KILLED [director-099] The import returns the bytes 1, 2 and 3 and the literal digest
SURVIVORS: [('m172', 'SURVIVED'), ('m389', 'SURVIVED')]
```

### Checks outside this pass

Pass 9 note: the host rule excludes Docker, make, ratchet, gates, adopt, waive and archive.
The worker did not run them.
The worker did not push or use gh.
The lead must run the image checks and the next review round.
