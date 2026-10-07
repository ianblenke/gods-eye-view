# Director host evidence

Commit: `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.

## Source commands

The scope command reads the ledger and all repository imports.
It checks old titles, tagged titles and the scenario sequence.
The coverage command checks each production file with host Node.
The report command reads the final result for each mutation ID from command output.
It does not read a gate cache.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/sweep.py
cd /home/ianblenke/docker/gev-work/director-3 && SWEEP_MODE=baseline python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && NODE_PATH=/home/ianblenke/docker/gev-work/node_modules node /home/ianblenke/docker/gev-tools/director-3/decisions.cjs
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/audit.py
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/report.py
```

## Scope sweep

The ledger lists 22 old tests in scope.
The declaration sweep finds 296 repository tests, with 294 tagged tests and 2 tests without tags.
The title sweep finds no banned word or excess title length.
The scenario sweep checks the full sequence from director-001 through director-110.
This change adds 35 scenarios, from director-076 through director-110.

### Ledger gaps

The scope command reads these values from `openspec/trace/gaps.json` at the named commit.
They are ledger values, not new gate measurements.

| File | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| `src/director/packs/geojson.js` | 2 | 6 | 0 |
| `src/director/packs/manifest.js` | 2 | 4 | 0 |
| `src/director/packs/session.js` | 9 | 7 | 2 |
| `src/director/packs/source.js` | 2 | 5 | 2 |
| `src/director/sharing/bundle.js` | 2 | 8 | 2 |
| `src/director/sharing/lifetime.js` | 6 | 2 | 2 |
| `src/director/sharing/preview.js` | 0 | 5 | 1 |

### Direct imports

The scope command resolves each relative import across all repository test files.
The initial basename grep also found unrelated files with the same basename.
These resolved paths load the modules in scope directly.

- `src/director/packs/geojson.js`: `src/director/packs/backfill.test.mjs`, `src/director/packs/packs.test.mjs`.
- `src/director/packs/manifest.js`: `src/director/packs/backfill.test.mjs`.
- `src/director/packs/session.js`: `src/director/packs/backfill.test.mjs`, `src/director/packs/packs.test.mjs`.
- `src/director/packs/source.js`: `src/director/packs/backfill.test.mjs`, `src/director/packs/packs.test.mjs`.
- `src/director/sharing/bundle.js`: `src/director/sharing/sharing.test.mjs`.
- `src/director/sharing/lifetime.js`: `src/director/sharing/sharing.test.mjs`.
- `src/director/sharing/preview.js`: `src/director/sharing/sharing.test.mjs`.

## Host coverage

Host Node: `26.8.2`.
The coverage commands include one production file at a time.
The host sweep reaches all listed lines, branches and functions.
The sweep leaves no host path gap.
The lead must check the Node 24 gate image.

| File | Baseline lines | Baseline branches | Baseline functions | Final lines | Final branches | Final functions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `src/director/packs/geojson.js` | 96.77 | 76.00 | 100.00 | 100.00 | 100.00 | 100.00 |
| `src/director/packs/manifest.js` | 98.55 | 89.80 | 100.00 | 100.00 | 100.00 | 100.00 |
| `src/director/packs/session.js` | 94.34 | 87.10 | 88.89 | 100.00 | 100.00 | 100.00 |
| `src/director/packs/source.js` | 97.01 | 73.68 | 50.00 | 100.00 | 100.00 | 100.00 |
| `src/director/sharing/bundle.js` | 99.10 | 87.95 | 90.48 | 100.00 | 100.00 | 100.00 |
| `src/director/sharing/lifetime.js` | 76.92 | 77.78 | 66.67 | 100.00 | 100.00 | 100.00 |
| `src/director/sharing/preview.js` | 100.00 | 72.22 | 90.00 | 100.00 | 100.00 | 100.00 |

The baseline command uses temporary copies of the old tests from HEAD.
The command removes those copies after the sweep.
The final sweep does not use the scratch code limit probes.

### Exact coverage commands

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/packs/geojson.js --test-coverage-exclude=**/*.test.mjs src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/packs/manifest.js --test-coverage-exclude=**/*.test.mjs src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/packs/session.js --test-coverage-exclude=**/*.test.mjs src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/packs/source.js --test-coverage-exclude=**/*.test.mjs src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/sharing/bundle.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/sharing/lifetime.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --experimental-test-coverage --test-coverage-include=src/director/sharing/preview.js --test-coverage-exclude=**/*.test.mjs src/director/sharing/sharing.test.mjs
```

## Scenario tests

### director-076: Asset paths

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-076] The asset path accepts safe names
[director-076] The asset path rejects traversal
[director-076] The asset path checks its text limit
```

### director-077: Pack formats

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-077] The manifest rejects invalid version
[director-077] The manifest rejects invalid format
[director-077] The manifest accepts geojson
[director-077] The manifest accepts image
[director-077] The manifest accepts media
[director-077] The geojson admits its altitudeReference field
[director-077] The manifest admits its pack id field
[director-077] The manifest admits its pack version field
[director-077] The manifest admits its pack format field
[director-077] The manifest admits its pack source field
[director-077] The manifest admits its pack attribution field
[director-077] The manifest admits its pack placement field
[director-077] The manifest admits its source adapter field
[director-077] The manifest admits its source path field
```

### director-078: Pack attribution

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
[director-078] The manifest admits its attribution text field
[director-078] The manifest admits its attribution license field
[director-078] The manifest admits its attribution url field
```

### director-079: Pack integrity fields

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-079] The byte length rejects a fraction
[director-079] The digest rejects invalid type
[director-079] The digest rejects invalid alphabet
[director-079] The integrity fields accept their limits
[director-079] The manifest admits its pack byteLength field
[director-079] The manifest admits its pack sha256 field
```

### director-080: Image placement

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
[director-080] The image admits its bounds field
[director-080] The image admits its height field
[director-080] The image admits its altitudeReference field
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
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-080] image bounds and media anchor references are stated and validated
```

### director-081: Media placement

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-081] The media rejects an unknown anchor
[director-081] The media admits its anchorId field
[director-081] The session gives anchors to its adapter
[director-081] The placement selects the media fields
```

### director-082: Scene pack references

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-082] The scene rejects duplicate pack IDs
[director-082] The shot rejects duplicate pack IDs
[director-082] The shot rejects unknown pack IDs
[director-082] The scene accepts absent packs and anchors
[director-082] The scene uses supplied anchors
[director-082] The scene uses absent anchor defaults
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-082] manifest rejects duplicate/unknown IDs, unsupported placement and request or credential syntax
```

### director-083: GeoJSON collections

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-083] The collection rejects invalid type
[director-083] The collection rejects invalid array
[director-083] The collection rejects invalid total
[director-083] The collection accepts its exact feature limit
```

### director-084: GeoJSON feature IDs

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-084] The feature rejects type
[director-084] The feature rejects ID type
[director-084] The feature rejects blank ID
[director-084] The feature rejects long ID
[director-084] The feature rejects duplicate ID
[director-084] The feature ID accepts its exact text limit
```

### director-085: Geographic positions

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-085] The position rejects invalid array
[director-085] The position rejects invalid length
[director-085] The position rejects invalid finite
[director-085] The position rejects invalid longitude
[director-085] The position rejects invalid latitude
[director-085] The position rejects invalid low height
[director-085] The position rejects invalid high height
[director-085] The position total rejects excess
[director-085] The position uses zero for absent height
[director-085] The position keeps the height in the data
[director-085] The position accepts both geographic edges
[director-085] The position rejects field 0 that is not finite
[director-085] The position rejects field 1 that is not finite
[director-085] The position rejects field 2 that is not finite
[director-085] The position accepts its exact total limit
```

### director-086: Lines and rings

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

### director-087: Geometry output

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-087] The geometry rejects invalid type
[director-087] The geometry rejects invalid array
[director-087] The geometry rejects invalid empty
[director-087] The geometry rejects invalid total
[director-087] The geometry returns a closed polygon
[director-087] The geometry removes properties
[director-087] The polygon accepts its exact ring limit
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-087] GeoJSON keeps stable geometry IDs but never properties or remote style hints
```

### director-088: Session admission

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-088] The new session reports idle state
[director-088] The session rejects pack list type
[director-088] The session rejects pack list total
[director-088] The session rejects destroyed state
[director-088] The session rejects cancelled state
[director-088] The session state uses its idle default
[director-088] The session state uses its zero default
```

### director-089: Session resources

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-089] The session disposes handles in reverse order
[director-089] The session gives copied state
[director-089] The session rejects handle null
[director-089] The session rejects handle disposal
[director-089] The session state uses its active total
[director-089] The session state uses its active status
[director-089] The session loads its geojson format
[director-089] The session loads its image format
[director-089] The session loads its media format
[director-089] The session rejects a falsy handle with inherited disposal
[director-089] The session owns every pack handle
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-089] pack session removes presentations and cancels the transport on Stop
```

### director-090: Session cancellation

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-090] The cancelled session disposes late resources
[director-090] The session tolerates a null late handle
[director-090] The session destroys pending work
[director-090] The session catches signal state without an event
[director-090] The session catches destroyed state after signal access
[director-090] The session catches replacement without signal state
[director-090] The session guard rejects a detached resource
[director-090] The session guard disposes before handle ownership
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-090] late renderer resources are disposed after cancellation without mutating a replacement
[director-090] an abort between renderer settlement and continuation cannot leak the returned resource
```

### director-091: Session replacement

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-091] The replacement keeps its own resources
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-091] replacing a pending source settles promptly and ignores its late bytes
```

### director-092: Session errors

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-092] The session reports a stable source error
[director-092] The deadline rejects stalled work
[director-092] The session rejects absent source
[director-092] The session rejects absent adapter
[director-092] The session ignores a late source error
[director-092] The absent adapter does not call its source
[director-092] The session settles an early internal signal
[director-092] The session settles a source error before its deadline
[director-092] The session uses its supplied deadline
[director-092] The session uses its default deadline
[director-092] The session removes resources after a later error
[director-092] The session rejects a falsy custom source
[director-092] The missing source stops after the validation size read
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-092] timeout settles an uncooperative adapter and failed packs roll back earlier resources
```

### director-093: Session asset checks

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-093] The session rejects byte type
[director-093] The session rejects byte empty
[director-093] The session rejects byte size
[director-093] The session rejects byte declared size
[director-093] The session rejects total byte excess
[director-093] The session rejects a wrong digest
[director-093] The session checks exact bytes and digest
[director-093] The session uses its default byte budget
[director-093] The session accepts absent declared size
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-093] byte and integrity checks run before rendering; adapter names never resolve inherited properties
```

### director-094: Asset directory configuration

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-094] The directory rejects protocol
[director-094] The directory rejects username
[director-094] The directory rejects password
[director-094] The directory rejects query
[director-094] The directory rejects fragment
[director-094] The directory rejects directory
[director-094] The directory accepts HTTP and HTTPS
```

### director-095: Asset request options

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-095] The request sets its own options
[director-095] The request owns its credentials option
[director-095] The request owns its redirect option
[director-095] The request owns its referrerPolicy option
[director-095] The request owns its cache option
[director-095] The request owns its signal option
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] directory source confines paths, strips credentials and rejects redirects, oversized streaming bodies and missing assets
```

### director-096: Asset stream limits

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

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] directory source confines paths, strips credentials and rejects redirects, oversized streaming bodies and missing assets
```

### director-097: Asset source cleanup

Test file: `src/director/packs/backfill.test.mjs`.

```text
[director-097] The source rejects an absent stream
[director-097] The source tolerates failed body cancellation
[director-097] The source rejects a failed response without a body
[director-097] The stream releases its lock after an error
[director-097] The source checks its signal between chunks
[director-097] The source rejects early cancellation
[director-097] The source stops between stream chunks
```

Test file: `src/director/packs/packs.test.mjs`.

```text
[director-095 director-096 director-097] directory source confines paths, strips credentials and rejects redirects, oversized streaming bodies and missing assets
[director-097] failed responses release their body and an already-cancelled source sends no request
```

### director-098: Share text admission

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-098] The share parser rejects nontext input
[director-098] The share parser rejects invalid JSON
[director-098] The share parser accepts plain project JSON
[director-098] The share parser rejects excess characters
[director-098] The share parser rejects excess UTF8 bytes
[director-098] The share character guard precedes byte conversion
```

### director-099: Bundle asset entries

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-099] bundle rejects invalid bytes, unknown fields, traversal, duplicates, missing files and broken integrity
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
```

### director-100: Bundle asset references

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-100] The bundle rejects pack asset absent
[director-100] The bundle rejects pack asset byte length
[director-100] The bundle rejects pack asset digest
[director-100] The bundle rejects wrong asset digest
[director-100] The bundle rejects unused assets
[director-100] The bundle rejects external pack sources
[director-100] The bundle checks its second asset reference
[director-100] The bundle checks its second asset hash
```

### director-101: Bundle export copy

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-101] selected-scene bundles round trip bytes and attribution without mutating the project or fetching
[director-101] long valid source filenames still produce an importable bundle
[director-101] The export writes exact bundle metadata
[director-101] The export accepts scenes without packs
[director-101] The export keeps a supplied pack list
```

### director-102: Bundle export limits

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-102] asset caps and declared integrity are enforced before creating a downloadable bundle
[director-102] The export rejects byte type
[director-102] The export rejects byte empty
[director-102] The export rejects byte size
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
```

### director-103: Shared asset reuse

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-103] duplicate pack paths share one asset and reject conflicting integrity
[director-103] The export reuses a shared asset
[director-103] The export rejects shared byte length
[director-103] The export rejects shared digest
[director-103] The shared export accepts absent byte declarations
[director-103] The shared export accepts an absent digest
[director-103] The export key uses adapter
[director-103] The export key uses path
[director-103] The export accepts matching shared integrity
```

### director-104: Bundle byte ownership

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-104] bundle byte owner releases replacement data and has no network fallback
[director-104] The store copies the asset map
[director-104] The store clears owned bytes
```

### director-105: Bundle byte access

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-105] The store rejects absent bytes
[director-105] The store rejects size bytes
[director-105] The store returns an independent byte copy
[director-105] The store checks its default byte budget
```

### director-106: Share file budgets

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-106] oversized files fail before reading and cancellation settles a stalled file without a late result
[director-106] The reader accepts an absent filename
[director-106] The reader rejects the ordinary file budget
[director-106] The reader gives bundles the larger budget
[director-106] The reader checks a signal after text access
```

### director-107: Share work cancellation

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-107] cancelled bundle export never resolves another asset or produces partial output
[director-107] The helper resolves without a signal
[director-107] The helper rejects an early signal
[director-107] The helper resolves with an active signal
[director-107] The helper rejects a work error
[director-107] The helper checks signal state at settlement
[director-107] The helper cancels pending work
```

### director-108: Preview totals

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-108] The preview reports exact totals and attribution
[director-108] The preview uses the scene ID without a title
[director-108] The preview accepts absent pack lists
[director-108] The preview uses supplied pack lists
[director-108] The preview keeps a supplied scene title
[director-108] The preview totals include every asset
```

### director-109: Preview source states

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-109] preview reports unavailable sources/layers and missing bundle assets without applying anything
[director-109] The preview reports included bundle bytes
[director-109] The preview reports absent bundle bytes
[director-109] The preview reports a configured source
[director-109] The preview reports an unavailable source
[director-109] The preview distinguishes bundle sources
```

### director-110: Preview dependencies

Test file: `src/director/sharing/sharing.test.mjs`.

```text
[director-110] The preview lists distinct absent layers
[director-110] The preview detects applied scene packs
[director-110] The preview detects shot source packs
[director-110] The preview detects no external content
[director-110] The preview accepts absent shot layers
[director-110] The preview uses supplied shot layers
[director-110] The preview detects each layer key
```

## Tests without tags

The scope sweep lists these old tests.
They check project migration and author details outside this change.
Their names stay unchanged.

File: `src/director/packs/packs.test.mjs`.

```text
v5 packs and shot references round trip through project migration without acquiring bytes
```

File: `src/director/sharing/sharing.test.mjs`.

```text
details editing preserves content IDs, layers and provenance, rejects invalid drafts atomically
```

The scratch file `limits.test.mjs` checks inherited height and signal getter behavior.
It does not add repository tests or scenario claims for those code limits.

## Code limits

Decision for the lead: the decoder reads an inherited height at `src/director/packs/geojson.js` line 27 without the height bounds check.
The scratch test uses an array prototype getter with height -12001.
The mutation removes the length operand at line 23 and that probe fails.
No scenario states this behavior.

Decision for the lead: a signal getter can destroy the session at `src/director/packs/session.js` line 74 before the source call.
The source call at line 100 can still produce ready resources and a true result.
The scratch test changes the signal getter call order.
No scenario states this behavior.

The size getter proves that the missing source guard prevents an extra pack size read.

## Mutation and audit totals

The mutation report command reads 302 final results. Repository tests kill 300 of them.
Rows m172 and m284 fail only the scratch test `limits.test.mjs`, which is outside the repository.

The repository tests do not kill those two rows, so they stay open as the Known limits `geojson-inherited-height` and `session-signal-getter`.
The audit command reads 99 rows: 79 tested, 0 equivalent and 20 default-value.
The audit keeps the scratch-test rows m172 and m284 as tested rows.
The Known limits record that no repository test kills them.
The AST command finds 92 decision rows and no switch statement.

The helper reached its time limit for m183 and m262 in earlier attempts.
Those attempts did not establish valid mutation verdicts.
The bounded repeats killed both mutations.
The mutation report gives each exact change and selected failed test.

## Checks and handoff

The final check notes record test, lint and format output.
The lead runs the ratchet, gates and both reviews.
The final tasks stay unchecked for those steps.

## Source guard correction

The test for `director-092` uses a pack size getter with value 100.
The missing source rejects with the stable error after one size read.
The session returns idle state with zero resources.
The mutation `m071` causes a second size read and the test fails.

The audit changes both session guard rows at line 97.
The source operand changes from equivalent to tested.
Each default-value row keeps tests for both outcomes.
The scratch file `default-review.md` records those checks.
No equivalent row remains.

## Final commands

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit $(rg --files src/director -g '*.test.mjs')
cd /home/ianblenke/docker/gev-work/director-3 && grep -aE '^ℹ (tests|pass|fail|cancelled|skipped)' /home/ianblenke/docker/gev-tools/director-3/tests-continuation.log
```

The test output records 788 tests and 788 passes.
It records zero failures, cancellations and skipped tests.
The complete mutation command with the repository tests records 300 KILLED and 2 SURVIVED results without a time limit.
The two survivors are m172 and m284.

## Title correction

The new word rule makes a retagged old title a new title.
Three old titles had a word of the rule, so the lead changed one word in each.
Each pair shows the old title on main and the current title without its tag.

```text
Old: image bounds and media anchor references are explicit and validated
New: image bounds and media anchor references are stated and validated
Old: GeoJSON preserves stable geometry IDs but never properties or remote style hints
New: GeoJSON keeps stable geometry IDs but never properties or remote style hints
Old: bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity
New: bundle rejects invalid bytes, unknown fields, traversal, duplicates, missing files and broken integrity
```

The lead changed the same words in this change folder and in the patterns of the mutation rows.
The title of the new position height test no longer has the word `explicit`.
Its new text says that the position keeps the height in the data.

