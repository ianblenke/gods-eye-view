# Director host evidence

HTTP means Hypertext Transfer Protocol.
HTTPS means HTTP with a secure connection.
MIME means Multipurpose Internet Mail Extensions.
HEAD names the current Git commit.

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
The mutation list gives 367 rows: 365 KILLED and 2 SURVIVED.
The audit list gives 166 rows: 143 tested, 20 default-value and 3 code limits.
The audit contains zero equivalent rows and zero open rows.

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

## Repository tests

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
[director-079] The byte length rejects a fraction
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
[director-090] The session checks destroyed state after signal access
[director-090] The session checks replacement without signal state
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
[director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
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
[director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
```

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-096] The stream joins distinct chunks
[director-096] The stream rejects excess header bytes
[director-096] The stream rejects excess chunk bytes
[director-096] The stream uses absent MIME default
[director-096] The stream normalizes MIME text
[director-096] The source checks its default byte budget
[director-096] The stream accepts its exact byte limit
```

### director-097

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
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
[director-098] The share character guard precedes byte conversion
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
[director-099] The bundle rejects unsupported MIME
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
[director-102] The export rejects declared byte length
[director-102] The export rejects declared digest
[director-102] The export rejects excess total bytes
[director-102] The export rejects excess asset total
[director-102] The export accepts absent integrity fields
[director-102] The export accepts an absent digest
[director-102] The export rejects absent asset bytes
[director-102] The export checks its encoded text budget
[director-102] The export keeps its total after an absent length
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
[director-103] The export rejects shared byte length
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
[director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file
[director-106] The share helpers accept an absent filename
[director-106] The share helpers reject the ordinary file budget
[director-106] The share helpers give bundles the larger budget
[director-106] The share helpers check a signal after text access
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
[director-107] The helper checks signal state at settlement
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
[director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes
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
The probes show code limits, not equivalent mutations.
No equivalent row needs a separate probe.

## Code limits

The case uses an inherited value at index 2.
The probe returns -12001 meters through the public API.
The custom signal getter destroys the session during signal access.

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
New: The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
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
New: The preview reports unavailable sources, absent layers and absent bundle assets without state changes
```

```text
Old: bundle byte owner releases replacement data and has no network fallback
New: The bundle byte store removes old data after replacement and uses no network source
```

```text
Old: oversized files fail before reading and cancellation settles a stalled file without a late result
New: The share helpers reject excess file bytes before text access and cancel a stalled project file
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
New: [director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
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
New: [director-090] The session checks destroyed state after signal access
```

```text
Old: [director-090] The session catches replacement without signal state
New: [director-090] The session checks replacement without signal state
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
New: [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes
```

```text
Old: [director-104] bundle byte owner releases replacement data and has no network fallback
New: [director-104] The bundle byte store removes old data after replacement and uses no network source
```

```text
Old: [director-106] oversized files fail before reading and cancellation settles a stalled file without a late result
New: [director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file
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
It records a code limit, not an equivalent mutation.

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
New: [director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
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
New: [director-106] The share helpers reject the ordinary file budget
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader gives bundles the larger budget
New: [director-106] The share helpers give bundles the larger budget
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-110] The preview detects a shot source pack ID
New: [director-110] The preview detects the source pack ID of a shot
```

File: src/director/sharing/sharing.test.mjs

```text
Old: [director-106] The reader checks a signal after text access
New: [director-106] The share helpers check a signal after text access
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
The warning count in checks.md comes from this command.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing
```
