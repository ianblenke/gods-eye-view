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
[director-076] The asset path accepts safe names
[director-076] The asset path rejects traversal
[director-076] The asset path checks its text limit
[director-076] The asset path rejects URL syntax with a stable message
[director-076] The asset path accepts 1024 characters and rejects 1025
```

### director-077

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-077] The manifest rejects invalid version
[director-077] The manifest rejects invalid format
[director-077] The manifest accepts geojson
[director-077] The manifest accepts image
[director-077] The manifest accepts media
[director-077] The geojson accepts its altitudeReference field
[director-077] The manifest accepts the id field of a data pack
[director-077] The manifest accepts the version field of a data pack
[director-077] The manifest accepts the format field of a data pack
[director-077] The manifest accepts the source field of a data pack
[director-077] The manifest accepts the attribution field of a data pack
[director-077] The manifest accepts the placement field of a data pack
[director-077] The manifest accepts its source name field
[director-077] The manifest accepts its source path field
[director-077] The manifest accepts 256 characters for its ID and rejects 257
[director-077] The manifest accepts 256 characters for its source name and rejects 257
```

### director-078

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-078] The attribution rejects protocol
[director-078] The attribution rejects username
[director-078] The attribution rejects password
[director-078] The attribution rejects query
[director-078] The attribution rejects fragment
[director-078] The attribution rejects invalid URL text
[director-078] The attribution accepts a safe link
[director-078] The attribution rejects blank text
[director-078] The attribution rejects blank license
[director-078] The manifest accepts its attribution text field
[director-078] The manifest accepts its attribution license field
[director-078] The manifest accepts its attribution url field
[director-078] The attribution accepts its text limits and rejects excess text
```

### director-079

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-079] The byteLength field rejects a fraction
[director-079] The digest rejects invalid type
[director-079] The digest rejects invalid alphabet
[director-079] The integrity fields accept their limits
[director-079] The manifest accepts the byteLength field of a data pack
[director-079] The manifest accepts the sha256 field of a data pack
[director-079] The digest rejects 63 characters
[director-079] The digest rejects 65 characters
[director-079] The digest rejects uppercase text
[director-079] The digest rejects a prefix
[director-079] The digest rejects a suffix
[director-079] The digest accepts 64 lowercase characters
```

### director-080

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-080] The manifest checks given image bounds and media anchor references
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-080] The image rejects reversed west
[director-080] The image rejects reversed south
[director-080] The image rejects short bounds
[director-080] The image rejects bounds field 0
[director-080] The image rejects bounds field 1
[director-080] The image rejects bounds field 2
[director-080] The image rejects bounds field 3
[director-080] The image rejects height and reference
[director-080] The image accepts its bounds field
[director-080] The image accepts its height field
[director-080] The image accepts its altitudeReference field
[director-080] The image bounds 0 rejects low excess
[director-080] The image bounds 0 rejects high excess
[director-080] The image bounds 1 rejects low excess
[director-080] The image bounds 1 rejects high excess
[director-080] The image bounds 2 rejects low excess
[director-080] The image bounds 2 rejects high excess
[director-080] The image bounds 3 rejects low excess
[director-080] The image bounds 3 rejects high excess
[director-080] The image height checks both limits
[director-080] The placement selects the image fields
[director-080] The image rejects equal longitude edges
[director-080] The image rejects equal latitude edges
[director-080] The image accepts all geographic limits
[director-080] The image rejects text for each geographic field
```

### director-081

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-081] The media rejects an unknown anchor
[director-081] The media accepts its anchorId field
[director-081] The session gives anchors to its renderer
[director-081] The placement selects the media fields
```

### director-082

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-082] The scene rejects duplicate data pack IDs
[director-082] The shot rejects duplicate data pack IDs
[director-082] The shot rejects unknown data pack IDs
[director-082] The scene accepts absent data packs and anchors
[director-082] The scene uses supplied anchors
[director-082] The scene uses absent anchor defaults
[director-082] The scene ignores a data pack list from its parent
```

### director-083

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-083] The collection rejects invalid type
[director-083] The collection rejects invalid array
[director-083] The collection rejects more than 2000 features
[director-083] The collection accepts its exact feature limit
[director-083] The decoder rejects invalid UTF8 bytes
[director-083] The decoder rejects null
```

### director-084

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-084] The feature rejects type
[director-084] The feature rejects ID type
[director-084] The feature rejects blank ID
[director-084] The feature rejects long ID
[director-084] The feature rejects duplicate ID
[director-084] The feature ID accepts its exact text limit
[director-084] The decoder rejects a null feature
```

### director-085

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-085] The position rejects invalid array
[director-085] The position rejects invalid length
[director-085] The position rejects a coordinate that is not finite
[director-085] The position rejects invalid longitude
[director-085] The position rejects invalid latitude
[director-085] The position rejects a height below the limit
[director-085] The position rejects a height above the limit
[director-085] The position total rejects excess
[director-085] The position uses zero for absent height
[director-085] The position keeps the height in the data
[director-085] The position accepts both geographic edges
[director-085] The position rejects field 0 that is not finite
[director-085] The position rejects field 1 that is not finite
[director-085] The position rejects field 2 that is not finite
[director-085] The position accepts its exact total limit
```

### director-086

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-086] The line rejects invalid array
[director-086] The line rejects invalid minimum
[director-086] The ring needs four points
[director-086] The line accepts two distinct endpoints
[director-086] The ring rejects unclosed field 0
[director-086] The ring rejects unclosed field 1
[director-086] The ring rejects unclosed field 2
```

### director-087

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-087] The geometry rejects invalid type
[director-087] The geometry rejects invalid array
[director-087] The geometry rejects an empty polygon
[director-087] The geometry rejects more than 128 rings
[director-087] The geometry returns a closed polygon
[director-087] The geometry removes properties
[director-087] The polygon accepts its exact ring limit
[director-087] The decoder rejects absent geometry
```

### director-088

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-088] The new session reports idle state
[director-088] The session rejects a value that is not a data pack list
[director-088] The session rejects more than eight data packs
[director-088] The session rejects destroyed state
[director-088] The session rejects cancelled state
[director-088] The session state uses its idle default
[director-088] The session state uses its zero default
[director-088] The session accepts eight data packs
[director-088] The session checks every declaration before the source call
```

### director-089

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-089] The data pack session removes resources and cancels the transport on Stop
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-089] The session disposes handles in reverse order
[director-089] The session gives copied state
[director-089] The session rejects a null handle
[director-089] The session rejects a handle without a dispose function
[director-089] The session state uses its active total
[director-089] The session state uses its active status
[director-089] The session loads its geojson format
[director-089] The session loads its image format
[director-089] The session loads its media format
[director-089] The session rejects a falsy handle with inherited disposal
[director-089] The session keeps every data pack handle
[director-089] The session destroys each ready resource
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
[director-090] The cancelled session disposes late resources
[director-090] The session accepts a null late handle
[director-090] The session destroys work that is not complete
[director-090] The session checks signal state without an event
[director-090] The session checks destroyed state after it reads the signal
[director-090] The session checks a cleared load call without signal state
[director-090] The session guard rejects a detached resource
[director-090] The session disposes the handle before it adds the handle to its list
```

### director-091

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-091] The data pack session replaces source work and ignores its late bytes
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-091] The replacement keeps its resources
```

### director-092

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-092] The session reports a stable source error
[director-092] The deadline rejects stalled work
[director-092] The session rejects absent source
[director-092] The session rejects absent renderer
[director-092] The session ignores a late source error
[director-092] The absent renderer does not call its source
[director-092] The session settles an early internal signal
[director-092] The session settles a source error before its deadline
[director-092] The session uses its supplied deadline
[director-092] The session uses its default deadline
[director-092] The session removes resources after a later error
[director-092] The session rejects a falsy custom source
[director-092] The data pack session reads the byteLength field once without a registered source
[director-092] The deadline removes partial resources
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
[director-093] The session checks exact bytes and digest
[director-093] The session uses its default byte budget
[director-093] The session accepts absent declared size
[director-093] The session accepts the asset byte limit
[director-093] The session accepts the total byte limit
[director-093] The session rejects one byte above the total limit
[director-093] The source receives the path and the renderer receives the asset and signal
```

### director-094

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-094] The directory rejects protocol
[director-094] The directory rejects username
[director-094] The directory rejects password
[director-094] The directory rejects query
[director-094] The directory rejects fragment
[director-094] The directory rejects an address with no final slash
[director-094] The directory accepts HTTP and HTTPS
```

### director-095

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-095] The asset request sets its fixed options
[director-095] The asset request sets its credentials option
[director-095] The asset request sets its redirect option
[director-095] The asset request sets its referrerPolicy option
[director-095] The asset request sets its cache option
[director-095] The asset request sets its signal option
[director-095] The directory source uses the default fetch function
```

### director-096

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-096] The stream joins distinct chunks
[director-096] The stream rejects excess header bytes
[director-096] The stream rejects excess chunk bytes
[director-096] The source returns an empty media type when the header is absent
[director-096] The source returns lowercase media type text without parameters
[director-096] The source checks its default byte budget
[director-096] The stream accepts its exact byte limit
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
[director-097] The source accepts failed body cancellation
[director-097] The source rejects a failed response without a body
[director-097] The stream releases its lock after an error
[director-097] The source checks its signal between chunks
[director-097] The source rejects early cancellation
[director-097] The source stops between stream chunks
```

### director-098

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-098] The bundle helpers reject nontext input
[director-098] The bundle helpers reject invalid JSON
[director-098] The bundle helpers accept plain project JSON
[director-098] The bundle helpers reject excess characters
[director-098] The bundle helpers reject excess UTF8 bytes
[director-098] The share character guard comes before byte conversion
```

### director-099

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
[director-099] The base64 rejects invalid type
[director-099] The base64 rejects invalid empty
[director-099] The base64 rejects invalid length
[director-099] The base64 rejects invalid alignment
[director-099] The base64 rejects invalid alphabet
[director-099] The base64 rejects invalid padding
[director-099] The bundle rejects duplicate paths
[director-099] The bundle rejects an unsupported media type
[director-099] The bundle rejects unsupported version
[director-099] The base64 accepts bytes without padding
[director-099] The base64 rejects a custom text object
[director-099] The bundle accepts the application/json media type
[director-099] The bundle accepts the application/geo+json media type
[director-099] The bundle accepts the image/png media type
[director-099] The bundle accepts the video/mp4 media type
[director-099] The bundle accepts the video/webm media type
[director-099] The bundle accepts the audio/mpeg media type
[director-099] The bundle accepts the audio/ogg media type
[director-099] The bundle accepts the audio/wav media type
[director-099] The bundle accepts the audio/webm media type
[director-099] The import rejects 65 different asset paths
[director-099] The base64 accepts its length limit and rejects the next aligned length
[director-099] The import accepts the total byte limit and rejects one more byte
```

### director-100

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-100] The bundle rejects an absent asset
[director-100] The bundle rejects a wrong byteLength field
[director-100] The bundle rejects a pack digest that differs from its asset
[director-100] The bundle rejects an asset digest that differs from its bytes
[director-100] The bundle rejects unused assets
[director-100] The bundle rejects external data pack sources
[director-100] The bundle checks its second asset reference
[director-100] The bundle checks its second asset digest
```

### director-101

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request
[director-101] The bundle accepts long valid source asset names
[director-101] The export writes exact bundle metadata
[director-101] The export accepts scenes without data packs
[director-101] The export keeps a supplied data pack list
```

### director-102

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-102] The bundle checks asset limits and declared integrity before export
[director-102] The export rejects bytes that are not a Uint8Array
[director-102] The export rejects an empty asset
[director-102] The export rejects an asset above the byte limit
[director-102] The export rejects absent assets
[director-102] The export rejects declared byteLength
[director-102] The export rejects declared digest
[director-102] The export rejects excess total bytes
[director-102] The export rejects excess asset total
[director-102] The export accepts absent integrity fields
[director-102] The export accepts an absent digest
[director-102] The export rejects absent asset bytes
[director-102] The export checks its encoded text budget
[director-102] The export keeps its total after an asset without a byte length
[director-102] The export accepts its exact asset total
[director-102] The export rejects an unsupported media type
[director-102] The export accepts the asset byte limit
[director-102] The export accepts the total byte limit and rejects one more byte
```

### director-103

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-103] The data packs with the same path share one asset and reject integrity values that differ
[director-103] The export reuses a shared asset
[director-103] The export rejects shared byteLength
[director-103] The export rejects shared digest
[director-103] The shared export accepts absent byte declarations
[director-103] The shared export accepts an absent digest
[director-103] The export key uses the registered source name
[director-103] The export key uses path
[director-103] The export accepts equal shared integrity
```

### director-104

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-104] The bundle byte store removes old data after replacement and uses no network source
[director-104] The store copies the asset map
[director-104] The store clears stored bytes
```

### director-105

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-105] The store rejects absent bytes
[director-105] The store rejects bytes above the caller limit
[director-105] The store returns an independent byte copy
[director-105] The store checks its default byte budget
[director-105] The store rejects a cancelled source call
```

### director-106

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
[director-106] The share helpers accept an absent filename
[director-106] The share helpers reject the ordinary file limit
[director-106] The share helpers give bundles the larger file limit
[director-106] The share helpers check a signal after they read text
[director-106] The share helpers accept the project file limit and rejects one more byte
[director-106] The share helpers accept the bundle file limit and rejects one more byte
```

### director-107

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-107] The cancelled bundle export stops before the next asset and returns no partial output
[director-107] The helper resolves without a signal
[director-107] The helper rejects an early signal
[director-107] The helper resolves with an active signal
[director-107] The helper rejects a work error
[director-107] The helper checks signal state when the work settles
[director-107] The helper cancels work that is not complete
[director-107] The bundle stops import before an asset
[director-107] The bundle stops import after a digest
[director-107] The bundle stops export before an asset
[director-107] The bundle stops export after asset bytes
[director-107] The bundle stops export after a digest
```

### director-108

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-108] The preview reports exact totals and attribution
[director-108] The preview uses the scene ID without a title
[director-108] The preview accepts absent data pack lists
[director-108] The preview uses supplied data pack lists
[director-108] The preview keeps a supplied scene title
[director-108] The preview totals include every asset
[director-108] The preview counts shots apart from scenes
```

### director-109

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-109] The preview reports unavailable sources, absent layers and absent bundle assets without edits to state
[director-109] The preview reports included bundle bytes
[director-109] The preview reports absent bundle bytes
[director-109] The preview reports a configured source
[director-109] The preview reports an unavailable source
[director-109] The preview distinguishes bundle sources
```

### director-110

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-110] The preview lists distinct absent layers
[director-110] The preview detects applied shot packs
[director-110] The preview detects the source pack ID of a shot
[director-110] The preview detects no external content
[director-110] The preview accepts absent shot layers
[director-110] The preview uses supplied shot layers
[director-110] The preview detects each layer key
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
New: The selected scene bundle copies bytes and attribution and keeps the project without an asset request
```

```text
Old: bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity
New: The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
```

```text
Old: asset caps and declared integrity are enforced before creating a downloadable bundle
New: The bundle checks asset limits and declared integrity before export
```

```text
Old: duplicate pack paths share one asset and reject conflicting integrity
New: The data packs with the same path share one asset and reject integrity values that differ
```

```text
Old: preview reports unavailable sources/layers and missing bundle assets without applying anything
New: The preview reports unavailable sources, absent layers and absent bundle assets without edits to state
```

```text
Old: bundle byte owner releases replacement data and has no network fallback
New: The bundle byte store removes old data after replacement and uses no network source
```

```text
Old: oversized files fail before reading and cancellation settles a stalled file without a late result
New: The share helpers reject excess file bytes before they read text and cancel a stalled project file
```

```text
Old: cancelled bundle export never resolves another asset or produces partial output
New: The cancelled bundle export stops before the next asset and returns no partial output
```

```text
Old: long valid source filenames still produce an importable bundle
New: The bundle accepts long valid source asset names
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
New: [director-082] The scene rejects duplicate data pack IDs
```

```text
Old: [director-082] The shot rejects duplicate pack IDs
New: [director-082] The shot rejects duplicate data pack IDs
```

```text
Old: [director-082] The shot rejects unknown pack IDs
New: [director-082] The shot rejects unknown data pack IDs
```

```text
Old: [director-082] The scene accepts absent packs and anchors
New: [director-082] The scene accepts absent data packs and anchors
```

```text
Old: [director-083] The collection rejects invalid total
New: [director-083] The collection rejects more than 2000 features
```

```text
Old: [director-085] The position rejects invalid finite
New: [director-085] The position rejects a coordinate that is not finite
```

```text
Old: [director-085] The position rejects invalid low height
New: [director-085] The position rejects a height below the limit
```

```text
Old: [director-085] The position rejects invalid high height
New: [director-085] The position rejects a height above the limit
```

```text
Old: [director-087] The geometry rejects invalid empty
New: [director-087] The geometry rejects an empty polygon
```

```text
Old: [director-087] The geometry rejects invalid total
New: [director-087] The geometry rejects more than 128 rings
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
New: [director-090] The session accepts a null late handle
```

```text
Old: [director-090] The session destroys pending work
New: [director-090] The session destroys work that is not complete
```

```text
Old: [director-091] The replacement keeps its own resources
New: [director-091] The replacement keeps its resources
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
New: [director-094] The directory rejects an address with no final slash
```

```text
Old: [director-095] The request sets its own options
New: [director-095] The asset request sets its fixed options
```

```text
Old: [director-097] The source tolerates failed body cancellation
New: [director-097] The source accepts failed body cancellation
```

```text
Old: [director-080] The image admits its bounds field
New: [director-080] The image accepts its bounds field
```

```text
Old: [director-080] The image admits its height field
New: [director-080] The image accepts its height field
```

```text
Old: [director-080] The image admits its altitudeReference field
New: [director-080] The image accepts its altitudeReference field
```

```text
Old: [director-081] The media admits its anchorId field
New: [director-081] The media accepts its anchorId field
```

```text
Old: [director-077] The geojson admits its altitudeReference field
New: [director-077] The geojson accepts its altitudeReference field
```

```text
Old: [director-090] The session catches signal state without an event
New: [director-090] The session checks signal state without an event
```

```text
Old: [director-090] The session catches destroyed state after signal access
New: [director-090] The session checks destroyed state after it reads the signal
```

```text
Old: [director-090] The session catches replacement without signal state
New: [director-090] The session checks a cleared load call without signal state
```

```text
Old: [director-090] The session guard disposes before handle ownership
New: [director-090] The session disposes the handle before it adds the handle to its list
```

```text
Old: [director-092] The absent adapter does not call its source
New: [director-092] The absent renderer does not call its source
```

```text
Old: [director-095] The request owns its credentials option
New: [director-095] The asset request sets its credentials option
```

```text
Old: [director-095] The request owns its redirect option
New: [director-095] The asset request sets its redirect option
```

```text
Old: [director-095] The request owns its referrerPolicy option
New: [director-095] The asset request sets its referrerPolicy option
```

```text
Old: [director-095] The request owns its cache option
New: [director-095] The asset request sets its cache option
```

```text
Old: [director-077] The manifest admits its pack id field
New: [director-077] The manifest accepts the id field of a data pack
```

```text
Old: [director-077] The manifest admits its pack version field
New: [director-077] The manifest accepts the version field of a data pack
```

```text
Old: [director-077] The manifest admits its pack format field
New: [director-077] The manifest accepts the format field of a data pack
```

```text
Old: [director-077] The manifest admits its pack source field
New: [director-077] The manifest accepts the source field of a data pack
```

```text
Old: [director-077] The manifest admits its pack attribution field
New: [director-077] The manifest accepts the attribution field of a data pack
```

```text
Old: [director-077] The manifest admits its pack placement field
New: [director-077] The manifest accepts the placement field of a data pack
```

```text
Old: [director-079] The manifest admits its pack byteLength field
New: [director-079] The manifest accepts the byteLength field of a data pack
```

```text
Old: [director-079] The manifest admits its pack sha256 field
New: [director-079] The manifest accepts the sha256 field of a data pack
```

```text
Old: [director-077] The manifest admits its source adapter field
New: [director-077] The manifest accepts its source name field
```

```text
Old: [director-077] The manifest admits its source path field
New: [director-077] The manifest accepts its source path field
```

```text
Old: [director-078] The manifest admits its attribution text field
New: [director-078] The manifest accepts its attribution text field
```

```text
Old: [director-078] The manifest admits its attribution license field
New: [director-078] The manifest accepts its attribution license field
```

```text
Old: [director-078] The manifest admits its attribution url field
New: [director-078] The manifest accepts its attribution url field
```

```text
Old: [director-081] The session gives anchors to its adapter
New: [director-081] The session gives anchors to its renderer
```

```text
Old: [director-089] The session owns every pack handle
New: [director-089] The session keeps every data pack handle
```

```text
Old: [director-095] The request owns its signal option
New: [director-095] The asset request sets its signal option
```

```text
Old: [director-092] The missing source stops after the validation size read
New: [director-092] The data pack session reads the byteLength field once without a registered source
```

```text
Old: [director-101] selected-scene bundles round trip bytes and attribution without mutating the project or fetching
New: [director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request
```

```text
Old: [director-099] bundle rejects invalid bytes, unknown fields, traversal, duplicates, missing files and broken integrity
New: [director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
```

```text
Old: [director-102] asset caps and declared integrity are enforced before creating a downloadable bundle
New: [director-102] The bundle checks asset limits and declared integrity before export
```

```text
Old: [director-103] duplicate pack paths share one asset and reject conflicting integrity
New: [director-103] The data packs with the same path share one asset and reject integrity values that differ
```

```text
Old: [director-109] preview reports unavailable sources/layers and missing bundle assets without applying anything
New: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without edits to state
```

```text
Old: [director-104] bundle byte owner releases replacement data and has no network fallback
New: [director-104] The bundle byte store removes old data after replacement and uses no network source
```

```text
Old: [director-106] oversized files fail before reading and cancellation settles a stalled file without a late result
New: [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
```

```text
Old: [director-107] cancelled bundle export never resolves another asset or produces partial output
New: [director-107] The cancelled bundle export stops before the next asset and returns no partial output
```

```text
Old: [director-101] long valid source filenames still produce an importable bundle
New: [director-101] The bundle accepts long valid source asset names
```

```text
Old: [director-098] The share parser rejects nontext input
New: [director-098] The bundle helpers reject nontext input
```

```text
Old: [director-098] The share parser rejects invalid JSON
New: [director-098] The bundle helpers reject invalid JSON
```

```text
Old: [director-098] The share parser accepts plain project JSON
New: [director-098] The bundle helpers accept plain project JSON
```

```text
Old: [director-098] The share parser rejects excess characters
New: [director-098] The bundle helpers reject excess characters
```

```text
Old: [director-098] The share parser rejects excess UTF8 bytes
New: [director-098] The bundle helpers reject excess UTF8 bytes
```

```text
Old: [director-100] The bundle rejects pack asset absent
New: [director-100] The bundle rejects an absent asset
```

```text
Old: [director-100] The bundle rejects pack asset byte length
New: [director-100] The bundle rejects a wrong byteLength field
```

```text
Old: [director-100] The bundle rejects pack asset digest
New: [director-100] The bundle rejects a pack digest that differs from its asset
```

```text
Old: [director-100] The bundle rejects external pack sources
New: [director-100] The bundle rejects external data pack sources
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
New: [director-110] The preview detects applied shot packs
```

```text
Old: [director-110] The preview detects shot source packs
New: [director-110] The preview detects the source pack ID of a shot
```

```text
Old: [director-101] The export accepts scenes without packs
New: [director-101] The export accepts scenes without data packs
```

```text
Old: [director-101] The export keeps a supplied pack list
New: [director-101] The export keeps a supplied data pack list
```

```text
Old: [director-108] The preview accepts absent pack lists
New: [director-108] The preview accepts absent data pack lists
```

```text
Old: [director-108] The preview uses supplied pack lists
New: [director-108] The preview uses supplied data pack lists
```

```text
Old: [director-103] The export key uses adapter
New: [director-103] The export key uses the registered source name
```

```text
Old: [director-100] The bundle checks its second asset hash
New: [director-100] The bundle checks its second asset digest
```

```text
Old: [director-103] The export accepts matching shared integrity
New: [director-103] The export accepts equal shared integrity
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
New: [director-093] The session gives anchors to its renderer
```

File: src/director/packs/backfill.test.mjs

```text
Old: [director-092] The absent registered source stops after the validation size read
New: [director-092] The data pack session reads the byteLength field once without a registered source
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject nontext input
New: [director-098] The bundle helpers reject nontext input
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject invalid JSON
New: [director-098] The bundle helpers reject invalid JSON
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers accept plain project JSON
New: [director-098] The bundle helpers accept plain project JSON
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject excess characters
New: [director-098] The bundle helpers reject excess characters
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-098] The share helpers reject excess UTF8 bytes
New: [director-098] The bundle helpers reject excess UTF8 bytes
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-100] The bundle rejects a wrong asset length
New: [director-100] The bundle rejects a wrong byteLength field
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-100] The bundle rejects a wrong asset digest
New: [director-100] The bundle rejects a pack digest that differs from its asset
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-100] The bundle rejects wrong asset digest
New: [director-100] The bundle rejects an asset digest that differs from its bytes
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader accepts an absent filename
New: [director-106] The share helpers accept an absent filename
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader rejects the ordinary file budget
New: [director-106] The share helpers reject the ordinary file limit
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader gives bundles the larger budget
New: [director-106] The share helpers give bundles the larger file limit
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-110] The preview detects a shot source pack ID
New: [director-110] The preview detects the source pack ID of a shot
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader checks a signal after text access
New: [director-106] The share helpers check a signal after they read text
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-105] The store rejects a cancelled asset call
New: [director-105] The store rejects a cancelled source call
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader accepts the ${label} file limit and rejects one more byte
New: [director-106] The share helpers accept the ${label} file limit and reject one more byte
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
| The import accepts the total byte limit and rejects one more byte | 59.990760 | 4.083381 |
| The export accepts the total byte limit and rejects one more byte | 22.209433 | 2.575859 |
| The export rejects excess total bytes | 12.033089 | Part of the total export test. |
| The export keeps its total after an asset without a byte length | 10.273848 | 0.013870 |
| The base64 accepts its length limit and rejects the next aligned length | 5.803030 | 0.446927 |
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
[director-088] The destroyed session does not read the caller signal state
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

### Tagged test edits

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
New: [director-089] The source registers its listener and checks its state before it reads the work promise
```

```text
Old: [director-092] The source event reads its reason once during another source event
New: [director-092] The session reads the source signal reason once during another source signal event
```

```text
Old: [director-089] The completed source does not read its reason during promise settlement
New: [director-089] The completed source does not read its reason when the promise settles
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
New: [director-089] The caller listener comes before the deadline timer starts
```

```text
Old: [director-090] The caller event during listener setup cancels the load call
New: [director-090] The caller event during listener registration cancels the load call
```

```text
Old: [director-107] The helper attaches its listener before the work read
New: [director-107] The helper attaches its listener before the source reads the work promise
```

```text
Old: [director-107] The helper checks signal state at settlement
New: [director-107] The helper checks signal state when the work settles
```

```text
Old: [director-107] The file signal check follows text settlement
New: [director-107] The reader checks the signal after the text promise settles
```

```text
Old: [director-098] The plain share returns an empty asset map
New: [director-098] The parser returns an empty asset map for plain project JSON
```

```text
Old: [director-107] The helper handles cancellation during listener removal before a work error
New: [director-107] The helper rejects with the cancellation reason during listener removal after a work error
```

```text
Old: [director-099] The import checks top fields before version
New: [director-099] The import checks top-level fields before version
```

```text
Old: [director-105] The byte store rejects an unsafe path before its lookup
New: [director-105] The byte store rejects an invalid path that it holds
```

```text
Old: [director-106] The file budget check comes before the signal read
New: [director-106] The reader checks the file limit before it reads the signal
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
New: [director-088] The validator checks the list before it reads the anchors
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
New: [director-102 director-107] The export checks the signal before it checks for an absent asset
```

```text
Old: [director-092] The source event during listener removal stops success
New: [director-092] The source signal event during listener removal stops success
```

```text
Old: [director-092] The source event during listener removal stops error
New: [director-092] The source signal event during listener removal stops error
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
| Spec | Tool limits omit additive edits | The audit names additive edits. The 099 clause lists nine types. SVG, file protocol and geojsonx tests kill m413 to m415. |
| Spec | Lines 89, 102 and 103 | The audit uses the rerun after pass 4 for that command. |
| Spec | 367 rows and 166 rows | Both figures have Pass 2 labels. |
| Spec | Killer titles of extension rows | The script checks all 260 old rows and 711 extension rows against the result files that the lead saved. |
| STE | the final rerun | The audit and evidence distinguish the rerun after pass 4 from the final rerun after pass 5. |
| STE | for an absent source | The labels use actual test titles. The Old records keep the full title history. |
| STE | probe-extension.txt objects | The probe uses Objects that the caller supplies and 52428800. It states that each mutation in the table is equivalent. |
| STE | the segment read | Titles and clauses use disposal and finite verb clauses. The Share work requirement uses file limits. |
| STE | listener setup | Titles and clauses use listener registration, source signal event and source signal state where they concern a signal. |
| STE | The extension, last sweep | The documents use extension run, Extension check 4, final rerun, Campaign 2 phase 1 and Extension check. |
| STE | changes | The audit and design use mutations for edits to code in the mutation tests. |
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

The rows use the first failed test of the lead final rerun after pass 5.
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
New: [director-089] The source registers its listener and checks its state before it reads the work promise
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
New: [director-082] The manifest rejects a reference in the second shot
```

```text
Old: [director-094] The directory rejects the file protocol
New: [director-094] The source rejects the file protocol
```

```text
Old: [director-077 director-082] The manifest validates the second data pack
New: [director-077 director-082] The manifest rejects an invalid second data pack
```

```text
Old: [director-081] The manifest uses the second anchor
New: [director-081] The manifest accepts a reference to the second anchor
```

```text
Old: [director-082] The manifest checks the second reference ID
New: [director-082] The manifest rejects an unknown second reference ID
```

```text
Old: [director-088] The session validates the second data pack before source access
New: [director-088] The session rejects an invalid second data pack before the source call
```

```text
Old: [director-081 director-093] The session uses the second anchor
New: [director-081 director-093] The session accepts a reference to the second anchor
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
New: [director-098] The parser returns an empty asset map for plain project JSON
```

```text
Old: [director-105] The byte store rejects an unsafe path that it holds
New: [director-105] The byte store rejects an invalid path that it holds
```

```text
Old: [director-106] The share helpers give bundles the larger budget
New: [director-106] The share helpers give bundles the larger file limit
```

```text
Old: [director-099] The bundle helpers reject an extra top field
New: [director-099] The bundle helpers reject an extra top-level field
```

```text
Old: [director-102] The absent digest stops its check after one field read
New: [director-102] The export stops when the digest is absent after it reads one field
```

```text
Old: [director-107] The file signal check follows the text result
New: [director-107] The reader checks the signal after the text promise settles
```

```text
Old: [director-107] The helper attaches its listener before it reads the work promise
New: [director-107] The helper attaches its listener before the source reads the work promise
```

```text
Old: [director-108 director-110] The preview reaches the second scene and shot
New: [director-108 director-110] The preview counts the second scene and shot
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
New: [director-080] The validator checks the height reference before it checks the bounds
```

```text
Old: [director-080] The bounds array check comes before access to the length
New: [director-080] The validator checks the bounds array before it reads the length
```

```text
Old: [director-080] The bounds length check comes before each coordinate check
New: [director-080] The validator checks the bounds length before it checks each coordinate
```

```text
Old: [director-082] The list check comes before access to the anchors
New: [director-082] The validator checks the list before it reads the anchors
```

```text
Old: [director-077 director-082] The declaration check comes before the duplicate ID check
New: [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs
```

```text
Old: [director-088 director-091] The new list check follows old resource disposal
New: [director-088 director-091] The session checks the new list after it disposes old resources
```

```text
Old: [director-088] The list check comes before access to the anchors
New: [director-088] The validator checks the list before it reads the anchors
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
New: [director-095] The source checks the path before it checks the caller signal
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
New: [director-090] The caller destroys the session when it reads the caller signal after a source error
```

```text
Old: [director-093] The session checks byte type before length access
New: [director-093] The session checks byte type before it reads the length
```

```text
Old: [director-079] The digest type check comes before text conversion
New: [director-079] The validator checks the digest type before it converts text
```

```text
Old: [director-080] The edge order check starts with west and east
New: [director-080] The validator checks west and east before south and north
```

```text
Old: [director-082] The distinct reference check comes before the search for known IDs
New: [director-082] The validator rejects duplicate references before it searches for known IDs
```

```text
Old: [director-090] The detached handle check does not read the source signal state
New: [director-090] The cleared session returns false without the source signal state
```

```text
Old: [director-099] The base64 type check comes before text conversion
New: [director-099] The parser checks the base64 type before it converts text
```

```text
Old: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes
New: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without edits to state
```

```text
Old: [director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file
New: [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file
```

```text
Old: [director-106] The share helpers check a signal after text access
New: [director-106] The share helpers check a signal after they read text
```

```text
Old: [director-102] The absent digest stops its check after it reads one field
New: [director-102] The export stops when the digest is absent after it reads one field
```

```text
Old: [director-098 director-107] The share signal check comes before the text type check
New: [director-098 director-107] The parser checks the signal before it checks the text type
```

```text
Old: [director-099 director-107] The asset signal check comes before its field check
New: [director-099 director-107] The parser checks the signal before it checks asset fields
```

```text
Old: [director-100 director-107] The import signal check comes before the digest comparison
New: [director-100 director-107] The import checks the signal before it compares digests
```

```text
Old: [director-106] The file limit check comes before access to the signal
New: [director-106] The reader checks the file limit before it reads the signal
```

```text
Old: [director-106 director-107] The file signal check comes before text access
New: [director-106 director-107] The reader checks the signal before it reads text
```

```text
Old: [director-107] The file signal check follows the text promise
New: [director-107] The reader checks the signal after the text promise settles
```

```text
Old: [director-102] The export checks integrity before access to the filename
New: [director-102] The export checks integrity before it reads the filename
```

```text
Old: [director-102] The export count check comes before the next resolver call
New: [director-102] The export checks the asset count before the next resolver call
```

```text
Old: [director-102 director-107] The export signal check comes before ${label}
New: [director-102 director-107] The export checks the signal before ${label}
```

```text
Old: [director-105] The store signal check comes before the path check
New: [director-105] The store checks the signal before it checks the path
```

```text
Old: [director-107] The helper removes its listener before access to the reason
New: [director-107] The helper removes its listener before it reads the reason
```


## Pass 7

Source commit: `0bf26a8ec20c1f6685f25e4f7ec57bb113204822`.
Base commit: `290b5d2`.

The first words identify findings in the unchanged round 5 reports.
The correction has no production code edit.
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
| S9 | The validator checks | The clause states rejection of the invalid second declaration. The source rejects the file protocol and reads only the first chunk after cancellation. |
| S10 | give bundles the larger | The tests use larger file limit and extra top-level field. All echoes use those titles. |
| S11 | `MIME types` | Documents use media type and delete the unused definitions. The same term applies to old tagged titles. |
| S12 | before source access | Titles use source call, invalid path, text promise, second digest and second resolver call. Documents use killer titles. |
| S13 | The extension run checks | The evidence gives input counts, test counts, past events, clear subjects and the pass 6 scope. It names a failed repository test for each killed row. |
| S14 | This additive edits limit | The audit states the limit on additive edits with articles and separate sentences. The allowed-field rows extend that limit. |
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

The test edits add seven backfill tests and six sharing tests.
They use existing scenario IDs only.
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
New: [director-090] The cleared session returns false without the source signal state
```

```text
Old: [director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
New: [director-095 director-096 director-097] The directory source sends no credentials and rejects invalid paths, redirects, excess bytes and absent assets
```

```text
Old: [director-099] The bundle rejects unsupported MIME
New: [director-099] The bundle rejects an unsupported media type
```

```text
Old: [director-101] The export reaches the second scene
New: [director-101] The export includes the asset of the second scene
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
No review report, main spec, trace ledger or QA script changes.

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
The code fence limit applies to MIME and SHA-256 in mutation spans.
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
