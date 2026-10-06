# Director code mutations

Commit: `3e1160f47c8d1f63f4b550318134c77fa3f46c5b`.

The report command reads the last command output for each mutation ID.
The helper restores the production file after each check.
The missing source guard prevents an extra pack size read.

## Command

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-3 /home/ianblenke/docker/gev-tools/director-3/muts.json
```

The first command checked the first list.
Later commands selected new IDs or repeated corrected probes from the same file.
The command log keeps each attempt.
The final results below exclude earlier attempts.

## m001

File: `src/director/packs/manifest.js`.

```text
Old:
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
New:
/^never$/
Selected test: [director-076] The asset path accepts safe names
Result: KILLED
m001: KILLED [director-076] The asset path accepts safe names
```

## m002

File: `src/director/packs/manifest.js`.

```text
Old:
.every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))
New:
.every(() => true)
Selected test: [director-076] The asset path rejects traversal
Result: KILLED
m002: KILLED [director-076] The asset path rejects traversal
```

## m003

File: `src/director/packs/manifest.js`.

```text
Old:
pack.version !== 1
New:
false
Selected test: [director-077] The manifest rejects invalid version
Result: KILLED
m003: KILLED [director-077] The manifest rejects invalid version
```

## m004

File: `src/director/packs/manifest.js`.

```text
Old:
!['geojson', 'image', 'media'].includes(pack.format)
New:
false
Selected test: [director-077] The manifest rejects invalid format
Result: KILLED
m004: KILLED [director-077] The manifest rejects invalid format
```

## m005

File: `src/director/packs/manifest.js`.

```text
Old:
parsed.protocol !== 'https:'
New:
false
Selected test: [director-078] The attribution rejects protocol
Result: KILLED
m005: KILLED [director-078] The attribution rejects protocol
```

## m006

File: `src/director/packs/manifest.js`.

```text
Old:
parsed.username
New:
false
Selected test: [director-078] The attribution rejects username
Result: KILLED
m006: KILLED [director-078] The attribution rejects username
```

## m007

File: `src/director/packs/manifest.js`.

```text
Old:
parsed.password
New:
false
Selected test: [director-078] The attribution rejects password
Result: KILLED
m007: KILLED [director-078] The attribution rejects password
```

## m008

File: `src/director/packs/manifest.js`.

```text
Old:
parsed.search
New:
false
Selected test: [director-078] The attribution rejects query
Result: KILLED
m008: KILLED [director-078] The attribution rejects query
```

## m009

File: `src/director/packs/manifest.js`.

```text
Old:
parsed.hash
New:
false
Selected test: [director-078] The attribution rejects fragment
Result: KILLED
m009: KILLED [director-078] The attribution rejects fragment
```

## m010

File: `src/director/packs/manifest.js`.

```text
Old:
fail(at, 'expected an HTTPS source link');
New:
return;
Selected test: [director-078] The attribution rejects invalid URL text
Result: KILLED
m010: KILLED [director-078] The attribution rejects invalid URL text
```

## m011

File: `src/director/packs/manifest.js`.

```text
Old:
parsed.protocol !== 'https:'
New:
parsed.protocol === 'https:'
Selected test: [director-078] The attribution accepts a safe link
Result: KILLED
m011: KILLED [director-078] The attribution accepts a safe link
```

## m012

File: `src/director/packs/manifest.js`.

```text
Old:
string(pack.attribution.text, `${path}.attribution.text`, 4096);
New:

Selected test: [director-078] The attribution rejects blank text
Result: KILLED
m012: KILLED [director-078] The attribution rejects blank text
```

## m013

File: `src/director/packs/manifest.js`.

```text
Old:
string(pack.attribution.license, `${path}.attribution.license`, 4096);
New:

Selected test: [director-078] The attribution rejects blank license
Result: KILLED
m013: KILLED [director-078] The attribution rejects blank license
```

## m014

File: `src/director/packs/manifest.js`.

```text
Old:
!Number.isInteger(v)
New:
false
Selected test: [director-079] The byte length rejects a fraction
Result: KILLED
m014: KILLED [director-079] The byte length rejects a fraction
```

## m015

File: `src/director/packs/manifest.js`.

```text
Old:
typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v)
New:
!/^[a-f0-9]{64}$/.test(v)
Selected test: [director-079] The digest rejects invalid type
Result: KILLED
m015: KILLED [director-079] The digest rejects invalid type
```

## m016

File: `src/director/packs/manifest.js`.

```text
Old:
typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v)
New:
typeof v !== 'string'
Selected test: [director-079] The digest rejects invalid alphabet
Result: KILLED
m016: KILLED [director-079] The digest rejects invalid alphabet
```

## m017

File: `src/director/packs/manifest.js`.

```text
Old:
number(v, at, 1, PACK_LIMITS.bytes, false);
New:
number(v, at, 0, PACK_LIMITS.bytes + 1, false);
Selected test: [director-079] The integrity fields accept their limits
Result: KILLED
m017: KILLED [director-079] The integrity fields accept their limits
```

## m018

File: `src/director/packs/manifest.js`.

```text
Old:
p.bounds[0] >= p.bounds[2]
New:
false
Selected test: [director-080] The image rejects reversed west
Result: KILLED
m018: KILLED [director-080] The image rejects reversed west
```

## m019

File: `src/director/packs/manifest.js`.

```text
Old:
p.bounds[1] >= p.bounds[3]
New:
false
Selected test: [director-080] The image rejects reversed south
Result: KILLED
m019: KILLED [director-080] The image rejects reversed south
```

## m020

File: `src/director/packs/manifest.js`.

```text
Old:
p.bounds.length !== 4
New:
false
Selected test: [director-080] The image rejects short bounds
Result: KILLED
m020: KILLED [director-080] The image rejects short bounds
```

## m021

File: `src/director/packs/manifest.js`.

```text
Old:
p.altitudeReference !== 'ellipsoid'
New:
false
Selected test: [director-080] The image rejects height and reference
Result: KILLED
m021: KILLED [director-080] The image rejects height and reference
```

## m022

File: `src/director/packs/manifest.js`.

```text
Old:
!anchorIds.has(p.anchorId)
New:
false
Selected test: [director-081] The media rejects an unknown anchor
Result: KILLED
m022: KILLED [director-081] The media rejects an unknown anchor
```

## m023

File: `src/director/packs/manifest.js`.

```text
Old:
seen.has(pack.id)
New:
false
Selected test: [director-082] The scene rejects duplicate pack IDs
Result: KILLED
m023: KILLED [director-082] The scene rejects duplicate pack IDs
```

## m024

File: `src/director/packs/manifest.js`.

```text
Old:
new Set(ids).size !== ids.length
New:
false
Selected test: [director-082] The shot rejects duplicate pack IDs
Result: KILLED
m024: KILLED [director-082] The shot rejects duplicate pack IDs
```

## m025

File: `src/director/packs/manifest.js`.

```text
Old:
ids.some((id) => !seen.has(id))
New:
false
Selected test: [director-082] The shot rejects unknown pack IDs
Result: KILLED
m025: KILLED [director-082] The shot rejects unknown pack IDs
```

## m026

File: `src/director/packs/manifest.js`.

```text
Old:
Object.hasOwn(scene, 'dataPacks') ? scene.dataPacks : []
New:
scene.dataPacks
Selected test: [director-082] The scene accepts absent packs and anchors
Result: KILLED
m026: KILLED [director-082] The scene accepts absent packs and anchors
```

## m027

File: `src/director/packs/geojson.js`.

```text
Old:
value?.type !== 'FeatureCollection'
New:
false
Selected test: [director-083] The collection rejects invalid type
Result: KILLED
m027: KILLED [director-083] The collection rejects invalid type
```

## m028

File: `src/director/packs/geojson.js`.

```text
Old:
!Array.isArray(value.features)
New:
false
Selected test: [director-083] The collection rejects invalid array
Result: KILLED
m028: KILLED [director-083] The collection rejects invalid array
```

## m029

File: `src/director/packs/geojson.js`.

```text
Old:
value.features.length > PACK_LIMITS.features
New:
false
Selected test: [director-083] The collection rejects invalid total
Result: KILLED
m029: KILLED [director-083] The collection rejects invalid total
```

## m030

File: `src/director/packs/geojson.js`.

```text
Old:
feature?.type !== 'Feature'
New:
false
Selected test: [director-084] The feature rejects type
Result: KILLED
m030: KILLED [director-084] The feature rejects type
```

## m031

File: `src/director/packs/geojson.js`.

```text
Old:
typeof id !== 'string'
New:
false
Selected test: [director-084] The feature rejects ID type
Result: KILLED
m031: KILLED [director-084] The feature rejects ID type
```

## m032

File: `src/director/packs/geojson.js`.

```text
Old:
!id.trim()
New:
false
Selected test: [director-084] The feature rejects blank ID
Result: KILLED
m032: KILLED [director-084] The feature rejects blank ID
```

## m033

File: `src/director/packs/geojson.js`.

```text
Old:
id.length > 256
New:
false
Selected test: [director-084] The feature rejects long ID
Result: KILLED
m033: KILLED [director-084] The feature rejects long ID
```

## m034

File: `src/director/packs/geojson.js`.

```text
Old:
ids.has(id)
New:
false
Selected test: [director-084] The feature rejects duplicate ID
Result: KILLED
m034: KILLED [director-084] The feature rejects duplicate ID
```

## m035

File: `src/director/packs/geojson.js`.

```text
Old:
!Array.isArray(p)
New:
false
Selected test: [director-085] The position rejects invalid array
Result: KILLED
m035: KILLED [director-085] The position rejects invalid array
```

## m036

File: `src/director/packs/geojson.js`.

```text
Old:
![2, 3].includes(p.length)
New:
false
Selected test: [director-085] The position rejects invalid length
Result: KILLED
m036: KILLED [director-085] The position rejects invalid length
```

## m037

File: `src/director/packs/geojson.js`.

```text
Old:
p.some((v) => !Number.isFinite(v))
New:
false
Selected test: [director-085] The position rejects invalid finite
Result: KILLED
m037: KILLED [director-085] The position rejects invalid finite
```

## m038

File: `src/director/packs/geojson.js`.

```text
Old:
Math.abs(p[0]) > 180
New:
false
Selected test: [director-085] The position rejects invalid longitude
Result: KILLED
m038: KILLED [director-085] The position rejects invalid longitude
```

## m039

File: `src/director/packs/geojson.js`.

```text
Old:
Math.abs(p[1]) > 90
New:
false
Selected test: [director-085] The position rejects invalid latitude
Result: KILLED
m039: KILLED [director-085] The position rejects invalid latitude
```

## m040

File: `src/director/packs/geojson.js`.

```text
Old:
p[2] < -12000
New:
false
Selected test: [director-085] The position rejects invalid low height
Result: KILLED
m040: KILLED [director-085] The position rejects invalid low height
```

## m041

File: `src/director/packs/geojson.js`.

```text
Old:
p[2] > 1e9
New:
false
Selected test: [director-085] The position rejects invalid high height
Result: KILLED
m041: KILLED [director-085] The position rejects invalid high height
```

## m042

File: `src/director/packs/geojson.js`.

```text
Old:
++positions > PACK_LIMITS.positions
New:
false
Selected test: [director-085] The position total rejects excess
Result: KILLED
m042: KILLED [director-085] The position total rejects excess
```

## m043

File: `src/director/packs/geojson.js`.

```text
Old:
p[2] ?? 0
New:
p[2] ?? 1
Selected test: [director-085] The position uses zero for absent height
Result: KILLED
m043: KILLED [director-085] The position uses zero for absent height
```

## m044

File: `src/director/packs/geojson.js`.

```text
Old:
p[2] ?? 0
New:
0
Selected test: [director-085] The position keeps explicit height
Result: KILLED
m044: KILLED [director-085] The position keeps explicit height
```

## m045

File: `src/director/packs/geojson.js`.

```text
Old:
!Array.isArray(points)
New:
false
Selected test: [director-086] The line rejects invalid array
Result: KILLED
m045: KILLED [director-086] The line rejects invalid array
```

## m046

File: `src/director/packs/geojson.js`.

```text
Old:
points.length < (ring ? 4 : 2)
New:
false
Selected test: [director-086] The line rejects invalid minimum
Result: KILLED
m046: KILLED [director-086] The line rejects invalid minimum
```

## m047

File: `src/director/packs/geojson.js`.

```text
Old:
ring ? 4 : 2
New:
2
Selected test: [director-086] The ring needs four points
Result: KILLED
m047: KILLED [director-086] The ring needs four points
```

## m048

File: `src/director/packs/geojson.js`.

```text
Old:
ring && normalized[0].some
New:
normalized[0].some
Selected test: [director-086] The line accepts two distinct endpoints
Result: KILLED
m048: KILLED [director-086] The line accepts two distinct endpoints
```

## m049

File: `src/director/packs/geojson.js`.

```text
Old:
v !== normalized.at(-1)[i]
New:
i !== 0 && v !== normalized.at(-1)[i]
Selected test: [director-086] The ring rejects unclosed field 0
Result: KILLED
m049: KILLED [director-086] The ring rejects unclosed field 0
```

## m050

File: `src/director/packs/geojson.js`.

```text
Old:
v !== normalized.at(-1)[i]
New:
i !== 1 && v !== normalized.at(-1)[i]
Selected test: [director-086] The ring rejects unclosed field 1
Result: KILLED
m050: KILLED [director-086] The ring rejects unclosed field 1
```

## m051

File: `src/director/packs/geojson.js`.

```text
Old:
v !== normalized.at(-1)[i]
New:
i !== 2 && v !== normalized.at(-1)[i]
Selected test: [director-086] The ring rejects unclosed field 2
Result: KILLED
m051: KILLED [director-086] The ring rejects unclosed field 2
```

## m052

File: `src/director/packs/geojson.js`.

```text
Old:
g?.type === 'Polygon'
New:
true
Selected test: [director-087] The geometry rejects invalid type
Result: KILLED
m052: KILLED [director-087] The geometry rejects invalid type
```

## m053

File: `src/director/packs/geojson.js`.

```text
Old:
Array.isArray(g.coordinates)
New:
true
Selected test: [director-087] The geometry rejects invalid array
Result: KILLED
m053: KILLED [director-087] The geometry rejects invalid array
```

## m054

File: `src/director/packs/geojson.js`.

```text
Old:
g.coordinates.length &&
New:
true &&
Selected test: [director-087] The geometry rejects invalid empty
Result: KILLED
m054: KILLED [director-087] The geometry rejects invalid empty
```

## m055

File: `src/director/packs/geojson.js`.

```text
Old:
g.coordinates.length <= 128
New:
true
Selected test: [director-087] The geometry rejects invalid total
Result: KILLED
m055: KILLED [director-087] The geometry rejects invalid total
```

## m056

File: `src/director/packs/geojson.js`.

```text
Old:
coordinates = g.coordinates.map((ring) => line(ring, true));
New:
coordinates = [];
Selected test: [director-087] The geometry returns a closed polygon
Result: KILLED
m056: KILLED [director-087] The geometry returns a closed polygon
```

## m057

File: `src/director/packs/geojson.js`.

```text
Old:
return { id, type: g.type, coordinates };
New:
return { ...feature, id, type: g.type, coordinates };
Selected test: [director-087] The geometry removes properties
Result: KILLED
m057: KILLED [director-087] The geometry removes properties
```

## m058

File: `src/director/packs/session.js`.

```text
Old:
if (!packs.length) return true;
New:
if (!packs.length) return false;
Selected test: [director-088] The new session reports idle state
Result: KILLED
m058: KILLED [director-088] The new session reports idle state
```

## m059

File: `src/director/packs/session.js`.

```text
Old:
!Array.isArray(packs)
New:
false
Selected test: [director-088] The session rejects pack list type
Result: KILLED
m059: KILLED [director-088] The session rejects pack list type
```

## m060

File: `src/director/packs/session.js`.

```text
Old:
packs.length > PACK_LIMITS.packs
New:
false
Selected test: [director-088] The session rejects pack list total
Result: KILLED
m060: KILLED [director-088] The session rejects pack list total
```

## m061

File: `src/director/packs/session.js`.

```text
Old:
disposed || signal?.aborted
New:
signal?.aborted
Selected test: [director-088] The session rejects destroyed state
Result: KILLED
m061: KILLED [director-088] The session rejects destroyed state
```

## m062

File: `src/director/packs/session.js`.

```text
Old:
disposed || signal?.aborted
New:
disposed
Selected test: [director-088] The session rejects cancelled state
Result: KILLED
m062: KILLED [director-088] The session rejects cancelled state
```

## m063

File: `src/director/packs/session.js`.

```text
Old:
run.handles.splice(0).reverse()
New:
run.handles.splice(0)
Selected test: [director-089] The session disposes handles in reverse order
Result: KILLED
m063: KILLED [director-089] The session disposes handles in reverse order
```

## m064

File: `src/director/packs/session.js`.

```text
Old:
run.status = 'ready';
New:
run.status = 'bad';
Selected test: [director-089] The session gives copied state
Result: KILLED
m064: KILLED [director-089] The session gives copied state
```

## m065

File: `src/director/packs/session.js`.

```text
Old:
if (ended) late(value);
New:
if (ended) {}
Selected test: [director-090] The cancelled session disposes late resources
Result: KILLED
m065: KILLED [director-090] The cancelled session disposes late resources
```

## m066

File: `src/director/packs/session.js`.

```text
Old:
(late) => late?.dispose()
New:
(late) => late.dispose()
Selected test: [director-090] The session tolerates a null late handle
Result: KILLED
m066: KILLED [director-090] The session tolerates a null late handle
```

## m067

File: `src/director/packs/session.js`.

```text
Old:
if (superseded) return false;
New:
if (superseded) throw new Error("bad");
Selected test: [director-090] The session destroys pending work
Result: KILLED
m067: KILLED [director-090] The session destroys pending work
```

## m068

File: `src/director/packs/session.js`.

```text
Old:
if (active === run) clear();
        if (superseded)
New:
clear();
        if (superseded)
Selected test: [director-091] The replacement keeps its own resources
Result: KILLED
m068: KILLED [director-091] The replacement keeps its own resources
```

## m069

File: `src/director/packs/session.js`.

```text
Old:
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
New:
throw error;
Selected test: [director-092] The session reports a stable source error
Result: KILLED
m069: KILLED [director-092] The session reports a stable source error
```

## m070

File: `src/director/packs/session.js`.

```text
Old:
if (superseded) return false;
New:
return false;
Selected test: [director-092] The deadline rejects stalled work
Result: KILLED
m070: KILLED [director-092] The deadline rejects stalled work
```

## m071

File: `src/director/packs/session.js`.

```text
Old:
!source
New:
false
Selected test: [director-092] The missing source stops after the validation size read
Result: KILLED
m071: KILLED [director-092] The missing source stops after the validation size read
```

## m072

File: `src/director/packs/session.js`.

```text
Old:
!adapter
New:
false
Selected test: [director-092] The absent adapter does not call its source
Result: KILLED
m072: KILLED [director-092] The absent adapter does not call its source
```

## m073

File: `src/director/packs/session.js`.

```text
Old:
!(bytes instanceof Uint8Array)
New:
false
Selected test: [director-093] The session rejects byte type
Result: KILLED
m073: KILLED [director-093] The session rejects byte type
```

## m074

File: `src/director/packs/session.js`.

```text
Old:
!bytes.length
New:
false
Selected test: [director-093] The session rejects byte empty
Result: KILLED
m074: KILLED [director-093] The session rejects byte empty
```

## m075

File: `src/director/packs/session.js`.

```text
Old:
bytes.length > PACK_LIMITS.bytes
New:
false
Selected test: [director-093] The session rejects byte size
Result: KILLED
m075: KILLED [director-093] The session rejects byte size
```

## m076

File: `src/director/packs/session.js`.

```text
Old:
pack.byteLength && bytes.length !== pack.byteLength
New:
false
Selected test: [director-093] The session rejects byte declared size
Result: KILLED
m076: KILLED [director-093] The session rejects byte declared size
```

## m077

File: `src/director/packs/session.js`.

```text
Old:
total > PACK_LIMITS.totalBytes
New:
false
Selected test: [director-093] The session rejects total byte excess
Result: KILLED
m077: KILLED [director-093] The session rejects total byte excess
```

## m078

File: `src/director/packs/session.js`.

```text
Old:
hex !== pack.sha256
New:
false
Selected test: [director-093] The session rejects a wrong digest
Result: KILLED
m078: KILLED [director-093] The session rejects a wrong digest
```

## m079

File: `src/director/packs/session.js`.

```text
Old:
maxBytes: pack.byteLength || PACK_LIMITS.bytes
New:
maxBytes: PACK_LIMITS.bytes
Selected test: [director-093] The session checks exact bytes and digest
Result: KILLED
m079: KILLED [director-093] The session checks exact bytes and digest
```

## m080

File: `src/director/packs/session.js`.

```text
Old:
!handle
New:
false
Selected test: [director-089] The session rejects a falsy handle with inherited disposal
Result: KILLED
m080: KILLED [director-089] The session rejects a falsy handle with inherited disposal
```

## m081

File: `src/director/packs/session.js`.

```text
Old:
typeof handle.dispose !== 'function'
New:
false
Selected test: [director-089] The session rejects handle disposal
Result: KILLED
m081: KILLED [director-089] The session rejects handle disposal
```

## m082

File: `src/director/packs/source.js`.

```text
Old:
!['https:', 'http:'].includes(base.protocol)
New:
false
Selected test: [director-094] The directory rejects protocol
Result: KILLED
m082: KILLED [director-094] The directory rejects protocol
```

## m083

File: `src/director/packs/source.js`.

```text
Old:
base.username
New:
false
Selected test: [director-094] The directory rejects username
Result: KILLED
m083: KILLED [director-094] The directory rejects username
```

## m084

File: `src/director/packs/source.js`.

```text
Old:
base.password
New:
false
Selected test: [director-094] The directory rejects password
Result: KILLED
m084: KILLED [director-094] The directory rejects password
```

## m085

File: `src/director/packs/source.js`.

```text
Old:
base.search
New:
false
Selected test: [director-094] The directory rejects query
Result: KILLED
m085: KILLED [director-094] The directory rejects query
```

## m086

File: `src/director/packs/source.js`.

```text
Old:
base.hash
New:
false
Selected test: [director-094] The directory rejects fragment
Result: KILLED
m086: KILLED [director-094] The directory rejects fragment
```

## m087

File: `src/director/packs/source.js`.

```text
Old:
!base.pathname.endsWith('/')
New:
false
Selected test: [director-094] The directory rejects directory
Result: KILLED
m087: KILLED [director-094] The directory rejects directory
```

## m088

File: `src/director/packs/source.js`.

```text
Old:
cache: 'no-store'
New:
cache: 'default'
Selected test: [director-095] The request sets its own options
Result: KILLED
m088: KILLED [director-095] The request sets its own options
```

## m089

File: `src/director/packs/source.js`.

```text
Old:
offset += chunk.byteLength;
New:
offset = 0;
Selected test: [director-096] The stream joins distinct chunks
Result: KILLED
m089: KILLED [director-096] The stream joins distinct chunks
```

## m090

File: `src/director/packs/source.js`.

```text
Old:
Number(response.headers.get('content-length')) > maxBytes
New:
false
Selected test: [director-096] The stream rejects excess header bytes
Result: KILLED
m090: KILLED [director-096] The stream rejects excess header bytes
```

## m091

File: `src/director/packs/source.js`.

```text
Old:
length > maxBytes
New:
false
Selected test: [director-096] The stream rejects excess chunk bytes
Result: KILLED
m091: KILLED [director-096] The stream rejects excess chunk bytes
```

## m092

File: `src/director/packs/source.js`.

```text
Old:
response.headers.get('content-type') || ''
New:
response.headers.get('content-type') || 'bad'
Selected test: [director-096] The stream uses absent MIME default
Result: KILLED
m092: KILLED [director-096] The stream uses absent MIME default
```

## m093

File: `src/director/packs/source.js`.

```text
Old:
.toLowerCase()
New:

Selected test: [director-096] The stream normalizes MIME text
Result: KILLED
m093: KILLED [director-096] The stream normalizes MIME text
```

## m094

File: `src/director/packs/source.js`.

```text
Old:
if (!reader) throw new Error('Asset stream unavailable');
New:
if (!reader) return {};
Selected test: [director-097] The source rejects an absent stream
Result: KILLED
m094: KILLED [director-097] The source rejects an absent stream
```

## m095

File: `src/director/packs/source.js`.

```text
Old:
response.body?.cancel().catch(() => {})
New:
response.body?.cancel()
Selected test: [director-097] The source tolerates failed body cancellation
Result: KILLED
m095: KILLED [director-097] The source tolerates failed body cancellation
```

## m096

File: `src/director/packs/source.js`.

```text
Old:
response.body?.cancel()
New:
response.body.cancel()
Selected test: [director-097] The source rejects a failed response without a body
Result: KILLED
m096: KILLED [director-097] The source rejects a failed response without a body
```

## m097

File: `src/director/packs/source.js`.

```text
Old:
await reader.cancel().catch(() => {});
New:
await reader.cancel();
Selected test: [director-097] The stream releases its lock after an error
Result: KILLED
m097: KILLED [director-097] The stream releases its lock after an error
```

## m098

File: `src/director/packs/source.js`.

```text
Old:
for (;;) {
        signal?.throwIfAborted();
New:
for (;;) {
        throw new Error('wrong');
Selected test: [director-097] The source checks its signal between chunks
Result: KILLED
m098: KILLED [director-097] The source checks its signal between chunks
```

## m099

File: `src/director/sharing/bundle.js`.

```text
Old:
typeof text !== 'string'
New:
false
Selected test: [director-098] The share parser rejects nontext input
Result: KILLED
m099: KILLED [director-098] The share parser rejects nontext input
```

## m100

File: `src/director/sharing/bundle.js`.

```text
Old:
fail('$', 'invalid JSON');
New:
throw new Error('wrong');
Selected test: [director-098] The share parser rejects invalid JSON
Result: KILLED
m100: KILLED [director-098] The share parser rejects invalid JSON
```

## m101

File: `src/director/sharing/bundle.js`.

```text
Old:
if (input?.format !== 'gev-scene-bundle')
New:
if (false)
Selected test: [director-098] The share parser accepts plain project JSON
Result: KILLED
m101: KILLED [director-098] The share parser accepts plain project JSON
```

## m102

File: `src/director/sharing/bundle.js`.

```text
Old:
text.length > SHARE_LIMITS.bytes
New:
false
Selected test: [director-098] The share parser rejects excess characters
Result: KILLED
m102: KILLED [director-098] The share parser rejects excess characters
```

## m103

File: `src/director/sharing/bundle.js`.

```text
Old:
    new TextEncoder().encode(text).length > SHARE_LIMITS.bytes
New:
    false
Selected test: [director-098] The share parser rejects excess UTF8 bytes
Result: KILLED
m103: KILLED [director-098] The share parser rejects excess UTF8 bytes
```

## m104

File: `src/director/sharing/bundle.js`.

```text
Old:
typeof value !== 'string'
New:
false
Selected test: [director-099] The base64 rejects a custom text object
Result: KILLED
m104: KILLED [director-099] The base64 rejects a custom text object
```

## m105

File: `src/director/sharing/bundle.js`.

```text
Old:
!value.length
New:
false
Selected test: [director-099] The base64 rejects invalid empty
Result: KILLED
m105: KILLED [director-099] The base64 rejects invalid empty
```

## m106

File: `src/director/sharing/bundle.js`.

```text
Old:
value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4
New:
false
Selected test: [director-099] The base64 rejects invalid length
Result: KILLED
m106: KILLED [director-099] The base64 rejects invalid length
```

## m107

File: `src/director/sharing/bundle.js`.

```text
Old:
value.length % 4 !== 0
New:
false
Selected test: [director-099] The base64 rejects invalid alignment
Result: KILLED
m107: KILLED [director-099] The base64 rejects invalid alignment
```

## m108

File: `src/director/sharing/bundle.js`.

```text
Old:
/[^A-Za-z0-9+/=]/.test(value)
New:
false
Selected test: [director-099] The base64 rejects invalid alphabet
Result: KILLED
m108: KILLED [director-099] The base64 rejects invalid alphabet
```

## m109

File: `src/director/sharing/bundle.js`.

```text
Old:
!/^[A-Za-z0-9+/]+={1,2}$/.test(value)
New:
false
Selected test: [director-099] The base64 rejects invalid padding
Result: KILLED
m109: KILLED [director-099] The base64 rejects invalid padding
```

## m110

File: `src/director/sharing/bundle.js`.

```text
Old:
assets.has(entry.path)
New:
false
Selected test: [director-099] The bundle rejects duplicate paths
Result: KILLED
m110: KILLED [director-099] The bundle rejects duplicate paths
```

## m111

File: `src/director/sharing/bundle.js`.

```text
Old:
!MIME.has(mimeType)
New:
false
Selected test: [director-099] The bundle rejects unsupported MIME
Result: KILLED
m111: KILLED [director-099] The bundle rejects unsupported MIME
```

## m112

File: `src/director/sharing/bundle.js`.

```text
Old:
input.version !== 1
New:
false
Selected test: [director-099] The bundle rejects unsupported version
Result: KILLED
m112: KILLED [director-099] The bundle rejects unsupported version
```

## m113

File: `src/director/sharing/bundle.js`.

```text
Old:
      !asset ||
New:
      false ||
Selected test: [director-100] The bundle rejects pack asset absent
Result: KILLED
m113: KILLED [director-100] The bundle rejects pack asset absent
```

## m114

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength !== asset.bytes.length
New:
false
Selected test: [director-100] The bundle rejects pack asset byte length
Result: KILLED
m114: KILLED [director-100] The bundle rejects pack asset byte length
```

## m115

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 !== asset.sha256
New:
false
Selected test: [director-100] The bundle rejects pack asset digest
Result: KILLED
m115: KILLED [director-100] The bundle rejects pack asset digest
```

## m116

File: `src/director/sharing/bundle.js`.

```text
Old:
entry.sha256 !== hash
New:
false
Selected test: [director-100] The bundle rejects wrong asset digest
Result: KILLED
m116: KILLED [director-100] The bundle rejects wrong asset digest
```

## m117

File: `src/director/sharing/bundle.js`.

```text
Old:
used.size !== assets.size
New:
false
Selected test: [director-100] The bundle rejects unused assets
Result: KILLED
m117: KILLED [director-100] The bundle rejects unused assets
```

## m118

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.source.adapter !== BUNDLE_SOURCE
New:
false
Selected test: [director-100] The bundle rejects external pack sources
Result: KILLED
m118: KILLED [director-100] The bundle rejects external pack sources
```

## m119

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
New:
pack.source = { adapter: 'bad', path: entry.path };
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m119: KILLED [director-101] The export writes exact bundle metadata
```

## m120

File: `src/director/sharing/bundle.js`.

```text
Old:
!(bytes instanceof Uint8Array)
New:
false
Selected test: [director-102] The export rejects byte type
Result: KILLED
m120: KILLED [director-102] The export rejects byte type
```

## m121

File: `src/director/sharing/bundle.js`.

```text
Old:
!bytes.length
New:
false
Selected test: [director-102] The export rejects byte empty
Result: KILLED
m121: KILLED [director-102] The export rejects byte empty
```

## m122

File: `src/director/sharing/bundle.js`.

```text
Old:
bytes.length > PACK_LIMITS.bytes
New:
false
Selected test: [director-102] The export rejects byte size
Result: KILLED
m122: KILLED [director-102] The export rejects byte size
```

## m123

File: `src/director/sharing/bundle.js`.

```text
Old:
if (!asset) fail('assets', 'select a file for every declared data pack');
New:
if (!asset) return null;
Selected test: [director-102] The export rejects absent assets
Result: KILLED
m123: KILLED [director-102] The export rejects absent assets
```

## m124

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength !== bytes.length
New:
false
Selected test: [director-102] The export rejects declared byte length
Result: KILLED
m124: KILLED [director-102] The export rejects declared byte length
```

## m125

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 !== sha256
New:
false
Selected test: [director-102] The export rejects declared digest
Result: KILLED
m125: KILLED [director-102] The export rejects declared digest
```

## m126

File: `src/director/sharing/bundle.js`.

```text
Old:
total > PACK_LIMITS.totalBytes
New:
false
Selected test: [director-102] The export rejects excess total bytes
Result: KILLED
m126: KILLED [director-102] The export rejects excess total bytes
```

## m127

File: `src/director/sharing/bundle.js`.

```text
Old:
assets.length >= SHARE_LIMITS.assets
New:
false
Selected test: [director-102] The export rejects excess asset total
Result: KILLED
m127: KILLED [director-102] The export rejects excess asset total
```

## m128

File: `src/director/sharing/bundle.js`.

```text
Old:
let entry = known.get(key);
New:
let entry = null;
Selected test: [director-103] The export reuses a shared asset
Result: KILLED
m128: KILLED [director-103] The export reuses a shared asset
```

## m129

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength !== entry.byteLength
New:
false
Selected test: [director-103] The export rejects shared byte length
Result: KILLED
m129: KILLED [director-103] The export rejects shared byte length
```

## m130

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 !== entry.sha256
New:
false
Selected test: [director-103] The export rejects shared digest
Result: KILLED
m130: KILLED [director-103] The export rejects shared digest
```

## m131

File: `src/director/sharing/bundle.js`.

```text
Old:
assets = new Map(next);
New:
assets = next;
Selected test: [director-104] The store copies the asset map
Result: KILLED
m131: KILLED [director-104] The store copies the asset map
```

## m132

File: `src/director/sharing/bundle.js`.

```text
Old:
assets.clear();
New:

Selected test: [director-104] The store clears owned bytes
Result: KILLED
m132: KILLED [director-104] The store clears owned bytes
```

## m133

File: `src/director/sharing/bundle.js`.

```text
Old:
!asset || asset.bytes.length > maxBytes
New:
asset.bytes.length > maxBytes
Selected test: [director-105] The store rejects absent bytes
Result: KILLED
m133: KILLED [director-105] The store rejects absent bytes
```

## m134

File: `src/director/sharing/bundle.js`.

```text
Old:
asset.bytes.length > maxBytes
New:
false
Selected test: [director-105] The store rejects size bytes
Result: KILLED
m134: KILLED [director-105] The store rejects size bytes
```

## m135

File: `src/director/sharing/bundle.js`.

```text
Old:
bytes: asset.bytes.slice()
New:
bytes: asset.bytes
Selected test: [director-105] The store returns an independent byte copy
Result: KILLED
m135: KILLED [director-105] The store returns an independent byte copy
```

## m136

File: `src/director/sharing/bundle.js`.

```text
Old:
file.name?.endsWith('.gevbundle.json')
New:
file.name.endsWith('.gevbundle.json')
Selected test: [director-106] The reader accepts an absent filename
Result: KILLED
m136: KILLED [director-106] The reader accepts an absent filename
```

## m137

File: `src/director/sharing/bundle.js`.

```text
Old:
if (file.size > limit)
New:
if (false)
Selected test: [director-106] The reader rejects the ordinary file budget
Result: KILLED
m137: KILLED [director-106] The reader rejects the ordinary file budget
```

## m138

File: `src/director/sharing/bundle.js`.

```text
Old:
file.name?.endsWith('.gevbundle.json')
New:
false
Selected test: [director-106] The reader gives bundles the larger budget
Result: KILLED
m138: KILLED [director-106] The reader gives bundles the larger budget
```

## m139

File: `src/director/sharing/lifetime.js`.

```text
Old:
if (!signal) return Promise.resolve(work);
New:
if (!signal) return Promise.resolve(8);
Selected test: [director-107] The helper resolves without a signal
Result: KILLED
m139: KILLED [director-107] The helper resolves without a signal
```

## m140

File: `src/director/sharing/lifetime.js`.

```text
Old:
if (signal.aborted) {
New:
if (false) {
Selected test: [director-107] The helper rejects an early signal
Result: KILLED
m140: KILLED [director-107] The helper rejects an early signal
```

## m141

File: `src/director/sharing/lifetime.js`.

```text
Old:
signal.aborted ? reject(signal.reason) : resolve(value)
New:
reject(signal.reason)
Selected test: [director-107] The helper resolves with an active signal
Result: KILLED
m141: KILLED [director-107] The helper resolves with an active signal
```

## m142

File: `src/director/sharing/lifetime.js`.

```text
Old:
reject(error);
New:
resolve(error);
Selected test: [director-107] The helper rejects a work error
Result: KILLED
m142: KILLED [director-107] The helper rejects a work error
```

## m143

File: `src/director/sharing/lifetime.js`.

```text
Old:
signal.aborted ? reject(signal.reason) : resolve(value)
New:
resolve(value)
Selected test: [director-107] The helper checks signal state at settlement
Result: KILLED
m143: KILLED [director-107] The helper checks signal state at settlement
```

## m144

File: `src/director/sharing/lifetime.js`.

```text
Old:
reject(signal.reason);
New:
resolve(signal.reason);
Selected test: [director-107] The helper cancels pending work
Result: KILLED
m144: KILLED [director-107] The helper cancels pending work
```

## m145

File: `src/director/sharing/preview.js`.

```text
Old:
n + a.bytes.length
New:
n
Selected test: [director-108] The preview reports exact totals and attribution
Result: KILLED
m145: KILLED [director-108] The preview reports exact totals and attribution
```

## m146

File: `src/director/sharing/preview.js`.

```text
Old:
scene.title || scene.id
New:
scene.title
Selected test: [director-108] The preview uses the scene ID without a title
Result: KILLED
m146: KILLED [director-108] The preview uses the scene ID without a title
```

## m147

File: `src/director/sharing/preview.js`.

```text
Old:
assets.has(pack.source.path)
New:
false
Selected test: [director-109] The preview reports included bundle bytes
Result: KILLED
m147: KILLED [director-109] The preview reports included bundle bytes
```

## m148

File: `src/director/sharing/preview.js`.

```text
Old:
assets.has(pack.source.path)
New:
true
Selected test: [director-109] The preview reports absent bundle bytes
Result: KILLED
m148: KILLED [director-109] The preview reports absent bundle bytes
```

## m149

File: `src/director/sharing/preview.js`.

```text
Old:
sources.has(pack.source.adapter)
New:
false
Selected test: [director-109] The preview reports a configured source
Result: KILLED
m149: KILLED [director-109] The preview reports a configured source
```

## m150

File: `src/director/sharing/preview.js`.

```text
Old:
sources.has(pack.source.adapter)
New:
true
Selected test: [director-109] The preview reports an unavailable source
Result: KILLED
m150: KILLED [director-109] The preview reports an unavailable source
```

## m151

File: `src/director/sharing/preview.js`.

```text
Old:
!layers.has(id)
New:
true
Selected test: [director-110] The preview lists distinct absent layers
Result: KILLED
m151: KILLED [director-110] The preview lists distinct absent layers
```

## m152

File: `src/director/sharing/preview.js`.

```text
Old:
s.appliedShotPacks?.length
New:
false
Selected test: [director-110] The preview detects applied scene packs
Result: KILLED
m152: KILLED [director-110] The preview detects applied scene packs
```

## m153

File: `src/director/sharing/preview.js`.

```text
Old:
s.shots.some((shot) => shot.sourcePackId)
New:
false
Selected test: [director-110] The preview detects shot source packs
Result: KILLED
m153: KILLED [director-110] The preview detects shot source packs
```

## m154

File: `src/director/sharing/preview.js`.

```text
Old:
s.appliedShotPacks?.length || s.shots.some((shot) => shot.sourcePackId)
New:
true
Selected test: [director-110] The preview detects no external content
Result: KILLED
m154: KILLED [director-110] The preview detects no external content
```

## m155

File: `src/director/packs/manifest.js`.

```text
Old:
? ['bounds', 'height', 'altitudeReference']
New:
? [ 'height', 'altitudeReference']
Selected test: [director-080] The image admits its bounds field
Result: KILLED
m155: KILLED [director-080] The image admits its bounds field
```

## m156

File: `src/director/packs/manifest.js`.

```text
Old:
? ['bounds', 'height', 'altitudeReference']
New:
? ['bounds', 'altitudeReference']
Selected test: [director-080] The image admits its height field
Result: KILLED
m156: KILLED [director-080] The image admits its height field
```

## m157

File: `src/director/packs/manifest.js`.

```text
Old:
? ['bounds', 'height', 'altitudeReference']
New:
? ['bounds', 'height']
Selected test: [director-080] The image admits its altitudeReference field
Result: KILLED
m157: KILLED [director-080] The image admits its altitudeReference field
```

## m158

File: `src/director/packs/manifest.js`.

```text
Old:
? ['anchorId']
New:
? []
Selected test: [director-081] The media admits its anchorId field
Result: KILLED
m158: KILLED [director-081] The media admits its anchorId field
```

## m159

File: `src/director/packs/manifest.js`.

```text
Old:
: ['altitudeReference'],
New:
: [],
Selected test: [director-077] The geojson admits its altitudeReference field
Result: KILLED
m159: KILLED [director-077] The geojson admits its altitudeReference field
```

## m160

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? -90 : -180
New:
i === 0 ? -181 : (i % 2 ? -90 : -180)
Selected test: [director-080] The image bounds 0 rejects low excess
Result: KILLED
m160: KILLED [director-080] The image bounds 0 rejects low excess
```

## m161

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 0 ? 181 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image bounds 0 rejects high excess
Result: KILLED
m161: KILLED [director-080] The image bounds 0 rejects high excess
```

## m162

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? -90 : -180
New:
i === 1 ? -91 : (i % 2 ? -90 : -180)
Selected test: [director-080] The image bounds 1 rejects low excess
Result: KILLED
m162: KILLED [director-080] The image bounds 1 rejects low excess
```

## m163

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 1 ? 91 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image bounds 1 rejects high excess
Result: KILLED
m163: KILLED [director-080] The image bounds 1 rejects high excess
```

## m164

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? -90 : -180
New:
i === 2 ? -181 : (i % 2 ? -90 : -180)
Selected test: [director-080] The image bounds 2 rejects low excess
Result: KILLED
m164: KILLED [director-080] The image bounds 2 rejects low excess
```

## m165

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 2 ? 181 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image bounds 2 rejects high excess
Result: KILLED
m165: KILLED [director-080] The image bounds 2 rejects high excess
```

## m166

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? -90 : -180
New:
i === 3 ? -91 : (i % 2 ? -90 : -180)
Selected test: [director-080] The image bounds 3 rejects low excess
Result: KILLED
m166: KILLED [director-080] The image bounds 3 rejects low excess
```

## m167

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 3 ? 91 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image bounds 3 rejects high excess
Result: KILLED
m167: KILLED [director-080] The image bounds 3 rejects high excess
```

## m168

File: `src/director/packs/manifest.js`.

```text
Old:
number(p.height, `${at}.height`, -12000, 1e9, false);
New:
number(p.height, `${at}.height`, -12000, 1e9 + 1, false);
Selected test: [director-080] The image height checks both limits
Result: KILLED
m168: KILLED [director-080] The image height checks both limits
```

## m169

File: `src/director/packs/manifest.js`.

```text
Old:
scene.anchors || []
New:
[]
Selected test: [director-082] The scene uses supplied anchors
Result: KILLED
m169: KILLED [director-082] The scene uses supplied anchors
```

## m170

File: `src/director/packs/manifest.js`.

```text
Old:
scene.anchors || []
New:
scene.anchors
Selected test: [director-082] The scene uses absent anchor defaults
Result: KILLED
m170: KILLED [director-082] The scene uses absent anchor defaults
```

## m171

File: `src/director/packs/geojson.js`.

```text
Old:
Math.abs(p[0]) > 180
New:
Math.abs(p[0]) >= 180
Selected test: [director-085] The position accepts both geographic edges
Result: KILLED
m171: KILLED [director-085] The position accepts both geographic edges
```

## m172

File: `src/director/packs/geojson.js`.

```text
Old:
p.length === 3 &&
New:
true &&
Selected test: The position height guard checks its length
Result: KILLED
m172: KILLED The position height guard checks its length
```

## m173

File: `src/director/packs/session.js`.

```text
Old:
active?.status || 'idle'
New:
active?.status || 'bad'
Selected test: [director-088] The session state uses its idle default
Result: KILLED
m173: KILLED [director-088] The session state uses its idle default
```

## m174

File: `src/director/packs/session.js`.

```text
Old:
active?.handles.length || 0
New:
active?.handles.length || 1
Selected test: [director-088] The session state uses its zero default
Result: KILLED
m174: KILLED [director-088] The session state uses its zero default
```

## m175

File: `src/director/packs/session.js`.

```text
Old:
active?.handles.length || 0
New:
0
Selected test: [director-089] The session state uses its active total
Result: KILLED
m175: KILLED [director-089] The session state uses its active total
```

## m176

File: `src/director/packs/session.js`.

```text
Old:
pack.byteLength || PACK_LIMITS.bytes
New:
pack.byteLength || 1
Selected test: [director-093] The session uses its default byte budget
Result: KILLED
m176: KILLED [director-093] The session uses its default byte budget
```

## m177

File: `src/director/packs/session.js`.

```text
Old:
pack.byteLength && bytes.length !== pack.byteLength
New:
bytes.length !== pack.byteLength
Selected test: [director-093] The session accepts absent declared size
Result: KILLED
m177: KILLED [director-093] The session accepts absent declared size
```

## m178

File: `src/director/packs/session.js`.

```text
Old:
const superseded = active !== run || signal?.aborted || disposed;
New:
const superseded = active !== run || disposed;
Selected test: [director-090] The session catches signal state without an event
Result: KILLED
m178: KILLED [director-090] The session catches signal state without an event
```

## m179

File: `src/director/packs/session.js`.

```text
Old:
const superseded = active !== run || signal?.aborted || disposed;
New:
const superseded = active !== run || signal?.aborted;
Selected test: [director-090] The session catches destroyed state after signal access
Result: KILLED
m179: KILLED [director-090] The session catches destroyed state after signal access
```

## m180

File: `src/director/packs/session.js`.

```text
Old:
const superseded = active !== run || signal?.aborted || disposed;
New:
const superseded = signal?.aborted || disposed;
Selected test: [director-090] The session catches replacement without signal state
Result: KILLED
m180: KILLED [director-090] The session catches replacement without signal state
```

## m181

File: `src/director/packs/session.js`.

```text
Old:
active !== run || controller.signal.aborted
New:
controller.signal.aborted
Selected test: [director-090] The session guard rejects a detached resource
Result: KILLED
m181: KILLED [director-090] The session guard rejects a detached resource
```

## m182

File: `src/director/packs/session.js`.

```text
Old:
active !== run || controller.signal.aborted
New:
active !== run
Selected test: [director-090] The session guard disposes before handle ownership
Result: KILLED
m182: KILLED [director-090] The session guard disposes before handle ownership
```

## m183

File: `src/director/packs/session.js`.

```text
Old:
if (!ended) {
          ended = true;
          reject(error);
New:
if (ended) {
          ended = true;
          reject(error);
Selected test: [director-092] The session settles a source error before its deadline
Result: KILLED
m183: KILLED [director-092] The session settles a source error before its deadline
```

## m184

File: `src/director/packs/source.js`.

```text
Old:
    signal?.throwIfAborted();
    const response
New:
    const response
Selected test: [director-097] The source rejects early cancellation
Result: KILLED
m184: KILLED [director-097] The source rejects early cancellation
```

## m185

File: `src/director/packs/source.js`.

```text
Old:
!['https:', 'http:'].includes(base.protocol)
New:
base.protocol !== 'https:'
Selected test: [director-094] The directory accepts HTTP and HTTPS
Result: KILLED
m185: KILLED [director-094] The directory accepts HTTP and HTTPS
```

## m186

File: `src/director/sharing/bundle.js`.

```text
Old:
text.length > SHARE_LIMITS.bytes
New:
false
Selected test: [director-098] The share character guard precedes byte conversion
Result: KILLED
m186: KILLED [director-098] The share character guard precedes byte conversion
```

## m187

File: `src/director/sharing/bundle.js`.

```text
Old:
scene.dataPacks || []
New:
scene.dataPacks
Selected test: [director-101] The export accepts scenes without packs
Result: KILLED
m187: KILLED [director-101] The export accepts scenes without packs
```

## m188

File: `src/director/sharing/bundle.js`.

```text
Old:
scene.dataPacks || []
New:
[]
Selected test: [director-101] The export keeps a supplied pack list
Result: KILLED
m188: KILLED [director-101] The export keeps a supplied pack list
```

## m189

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength && pack.byteLength !== bytes.length
New:
pack.byteLength !== bytes.length
Selected test: [director-102] The export accepts absent integrity fields
Result: KILLED
m189: KILLED [director-102] The export accepts absent integrity fields
```

## m190

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 && pack.sha256 !== sha256
New:
pack.sha256 !== sha256
Selected test: [director-102] The export accepts an absent digest
Result: KILLED
m190: KILLED [director-102] The export accepts an absent digest
```

## m191

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength && pack.byteLength !== entry.byteLength
New:
pack.byteLength !== entry.byteLength
Selected test: [director-103] The shared export accepts absent byte declarations
Result: KILLED
m191: KILLED [director-103] The shared export accepts absent byte declarations
```

## m192

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 && pack.sha256 !== entry.sha256
New:
pack.sha256 !== entry.sha256
Selected test: [director-103] The shared export accepts an absent digest
Result: KILLED
m192: KILLED [director-103] The shared export accepts an absent digest
```

## m193

File: `src/director/sharing/bundle.js`.

```text
Old:
value.includes('=') && !/^[A-Za-z0-9+/]+={1,2}$/.test(value)
New:
!/^[A-Za-z0-9+/]+={1,2}$/.test(value)
Selected test: [director-099] The base64 accepts bytes without padding
Result: KILLED
m193: KILLED [director-099] The base64 accepts bytes without padding
```

## m194

File: `src/director/sharing/preview.js`.

```text
Old:
scene.dataPacks || []
New:
scene.dataPacks
Selected test: [director-108] The preview accepts absent pack lists
Result: KILLED
m194: KILLED [director-108] The preview accepts absent pack lists
```

## m195

File: `src/director/sharing/preview.js`.

```text
Old:
scene.dataPacks || []
New:
[]
Selected test: [director-108] The preview uses supplied pack lists
Result: KILLED
m195: KILLED [director-108] The preview uses supplied pack lists
```

## m196

File: `src/director/sharing/preview.js`.

```text
Old:
scene.title || scene.id
New:
scene.id
Selected test: [director-108] The preview keeps a supplied scene title
Result: KILLED
m196: KILLED [director-108] The preview keeps a supplied scene title
```

## m197

File: `src/director/sharing/preview.js`.

```text
Old:
pack.source.adapter === BUNDLE_SOURCE
New:
true
Selected test: [director-109] The preview distinguishes bundle sources
Result: KILLED
m197: KILLED [director-109] The preview distinguishes bundle sources
```

## m198

File: `src/director/sharing/preview.js`.

```text
Old:
shot.layers || {}
New:
shot.layers
Selected test: [director-110] The preview accepts absent shot layers
Result: KILLED
m198: KILLED [director-110] The preview accepts absent shot layers
```

## m199

File: `src/director/sharing/preview.js`.

```text
Old:
shot.layers || {}
New:
{}
Selected test: [director-110] The preview uses supplied shot layers
Result: KILLED
m199: KILLED [director-110] The preview uses supplied shot layers
```

## m200

File: `src/director/sharing/bundle.js`.

```text
Old:
source({ path, signal, maxBytes = PACK_LIMITS.bytes })
New:
source({ path, signal, maxBytes = PACK_LIMITS.bytes + 1 })
Selected test: [director-105] The store checks its default byte budget
Result: KILLED
m200: KILLED [director-105] The store checks its default byte budget
```

## m201

File: `src/director/packs/session.js`.

```text
Old:
!adapter
New:
false
Selected test: [director-092] The absent adapter does not call its source
Result: KILLED
m201: KILLED [director-092] The absent adapter does not call its source
```

## m202

File: `src/director/sharing/bundle.js`.

```text
Old:
typeof value !== 'string'
New:
false
Selected test: [director-099] The base64 rejects a custom text object
Result: KILLED
m202: KILLED [director-099] The base64 rejects a custom text object
```

## m203

File: `src/director/sharing/bundle.js`.

```text
Old:
[pack.source.adapter, pack.source.path]
New:
[pack.source.path]
Selected test: [director-103] The export key uses adapter
Result: KILLED
m203: KILLED [director-103] The export key uses adapter
```

## m204

File: `src/director/sharing/bundle.js`.

```text
Old:
[pack.source.adapter, pack.source.path]
New:
[pack.source.adapter]
Selected test: [director-103] The export key uses path
Result: KILLED
m204: KILLED [director-103] The export key uses path
```

## m205

File: `src/director/sharing/preview.js`.

```text
Old:
Object.keys(shot.layers || {})
New:
Object.keys(shot.layers || {}).filter(id=>id!=='ships')
Selected test: [director-110] The preview detects each layer key
Result: KILLED
m205: KILLED [director-110] The preview detects each layer key
```

## m206

File: `src/director/sharing/preview.js`.

```text
Old:
[...assets.values()].reduce((n, a) => n + a.bytes.length, 0)
New:
[...assets.values()].slice(0, 1).reduce((n, a) => n + a.bytes.length, 0)
Selected test: [director-108] The preview totals include every asset
Result: KILLED
m206: KILLED [director-108] The preview totals include every asset
```

## m207

File: `src/director/packs/source.js`.

```text
Old:
credentials: 'omit',
New:

Selected test: [director-095] The request owns its credentials option
Result: KILLED
m207: KILLED [director-095] The request owns its credentials option
```

## m208

File: `src/director/packs/source.js`.

```text
Old:
redirect: 'error',
New:

Selected test: [director-095] The request owns its redirect option
Result: KILLED
m208: KILLED [director-095] The request owns its redirect option
```

## m209

File: `src/director/packs/source.js`.

```text
Old:
referrerPolicy: 'no-referrer',
New:

Selected test: [director-095] The request owns its referrerPolicy option
Result: KILLED
m209: KILLED [director-095] The request owns its referrerPolicy option
```

## m210

File: `src/director/packs/source.js`.

```text
Old:
cache: 'no-store',
New:

Selected test: [director-095] The request owns its cache option
Result: KILLED
m210: KILLED [director-095] The request owns its cache option
```

## m211

File: `src/director/packs/geojson.js`.

```text
Old:
p.some((v) => !Number.isFinite(v))
New:
p.some((v,i) => i !== 0 && !Number.isFinite(v))
Selected test: [director-085] The position rejects field 0 that is not finite
Result: KILLED
m211: KILLED [director-085] The position rejects field 0 that is not finite
```

## m212

File: `src/director/packs/geojson.js`.

```text
Old:
p.some((v) => !Number.isFinite(v))
New:
p.some((v,i) => i !== 1 && !Number.isFinite(v))
Selected test: [director-085] The position rejects field 1 that is not finite
Result: KILLED
m212: KILLED [director-085] The position rejects field 1 that is not finite
```

## m213

File: `src/director/packs/geojson.js`.

```text
Old:
p.some((v) => !Number.isFinite(v))
New:
p.some((v,i) => i !== 2 && !Number.isFinite(v))
Selected test: [director-085] The position rejects field 2 that is not finite
Result: KILLED
m213: KILLED [director-085] The position rejects field 2 that is not finite
```

## m214

File: `src/director/packs/source.js`.

```text
Old:
maxBytes = PACK_LIMITS.bytes
New:
maxBytes = PACK_LIMITS.bytes + 1
Selected test: [director-096] The source checks its default byte budget
Result: KILLED
m214: KILLED [director-096] The source checks its default byte budget
```

## m215

File: `src/director/packs/manifest.js`.

```text
Old:
'id',
New:

Selected test: [director-077] The manifest admits its pack id field
Result: KILLED
m215: KILLED [director-077] The manifest admits its pack id field
```

## m216

File: `src/director/packs/manifest.js`.

```text
Old:
'version',
New:

Selected test: [director-077] The manifest admits its pack version field
Result: KILLED
m216: KILLED [director-077] The manifest admits its pack version field
```

## m217

File: `src/director/packs/manifest.js`.

```text
Old:
'format',
New:

Selected test: [director-077] The manifest admits its pack format field
Result: KILLED
m217: KILLED [director-077] The manifest admits its pack format field
```

## m218

File: `src/director/packs/manifest.js`.

```text
Old:
'source',
New:

Selected test: [director-077] The manifest admits its pack source field
Result: KILLED
m218: KILLED [director-077] The manifest admits its pack source field
```

## m219

File: `src/director/packs/manifest.js`.

```text
Old:
'attribution',
New:

Selected test: [director-077] The manifest admits its pack attribution field
Result: KILLED
m219: KILLED [director-077] The manifest admits its pack attribution field
```

## m220

File: `src/director/packs/manifest.js`.

```text
Old:
'placement',
New:

Selected test: [director-077] The manifest admits its pack placement field
Result: KILLED
m220: KILLED [director-077] The manifest admits its pack placement field
```

## m221

File: `src/director/packs/manifest.js`.

```text
Old:
    'byteLength',
New:

Selected test: [director-079] The manifest admits its pack byteLength field
Result: KILLED
m221: KILLED [director-079] The manifest admits its pack byteLength field
```

## m222

File: `src/director/packs/manifest.js`.

```text
Old:
    'sha256',
New:

Selected test: [director-079] The manifest admits its pack sha256 field
Result: KILLED
m222: KILLED [director-079] The manifest admits its pack sha256 field
```

## m223

File: `src/director/packs/manifest.js`.

```text
Old:
['adapter', 'path']
New:
['path']
Selected test: [director-077] The manifest admits its source adapter field
Result: KILLED
m223: KILLED [director-077] The manifest admits its source adapter field
```

## m224

File: `src/director/packs/manifest.js`.

```text
Old:
['adapter', 'path']
New:
['adapter']
Selected test: [director-077] The manifest admits its source path field
Result: KILLED
m224: KILLED [director-077] The manifest admits its source path field
```

## m225

File: `src/director/packs/manifest.js`.

```text
Old:
['text', 'license', 'url']
New:
['license', 'url']
Selected test: [director-078] The manifest admits its attribution text field
Result: KILLED
m225: KILLED [director-078] The manifest admits its attribution text field
```

## m226

File: `src/director/packs/manifest.js`.

```text
Old:
['text', 'license', 'url']
New:
['text', 'url']
Selected test: [director-078] The manifest admits its attribution license field
Result: KILLED
m226: KILLED [director-078] The manifest admits its attribution license field
```

## m227

File: `src/director/packs/manifest.js`.

```text
Old:
['text', 'license', 'url']
New:
['text', 'license']
Selected test: [director-078] The manifest admits its attribution url field
Result: KILLED
m227: KILLED [director-078] The manifest admits its attribution url field
```

## m228

File: `src/director/sharing/bundle.js`.

```text
Old:
for (const pack of packsOf(project))
New:
for (const pack of packsOf(project).slice(0,1))
Selected test: [director-100] The bundle checks its second asset reference
Result: KILLED
m228: KILLED [director-100] The bundle checks its second asset reference
```

## m229

File: `src/director/sharing/bundle.js`.

```text
Old:
for (const entry of input.assets)
New:
for (const entry of input.assets.slice(0,1))
Selected test: [director-100] The bundle checks its second asset hash
Result: KILLED
m229: KILLED [director-100] The bundle checks its second asset hash
```

## m230

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 !== entry.sha256
New:
pack.sha256 === entry.sha256
Selected test: [director-103] The export accepts matching shared integrity
Result: KILLED
m230: KILLED [director-103] The export accepts matching shared integrity
```

## m231

File: `src/director/sharing/bundle.js`.

```text
Old:
bytes?.length || 0
New:
bytes.length || 0
Selected test: [director-102] The export rejects absent asset bytes
Result: KILLED
m231: KILLED [director-102] The export rejects absent asset bytes
```

## m232

File: `src/director/packs/session.js`.

```text
Old:
if (signal.aborted) abort();
New:
if (false) abort();
Selected test: [director-092] The session settles an early internal signal
Result: KILLED
m232: KILLED [director-092] The session settles an early internal signal
```

## m233

File: `src/director/packs/session.js`.

```text
Old:
(anchor) => anchor.id
New:
(anchor) => {throw new Error("wrong");}
Selected test: [director-081] The session gives anchors to its adapter
Result: KILLED
m233: KILLED [director-081] The session gives anchors to its adapter
```

## m234

File: `src/director/sharing/bundle.js`.

```text
Old:
  checkAbort(options?.signal);
  return parseSceneShare
New:
  checkAbort(undefined);
  return parseSceneShare
Selected test: [director-106] The reader checks a signal after text access
Result: KILLED
m234: KILLED [director-106] The reader checks a signal after text access
```

## m235

File: `src/director/sharing/bundle.js`.

```text
Old:
if (new TextEncoder().encode(text).length > SHARE_LIMITS.bytes)
New:
if (false)
Selected test: [director-102] The export checks its encoded text budget
Result: KILLED
m235: KILLED [director-102] The export checks its encoded text budget
```

## m236

File: `src/director/sharing/bundle.js`.

```text
Old:
bytes?.length || 0
New:
bytes?.length
Selected test: [director-102] The export keeps its total after an absent length
Result: KILLED
m236: KILLED [director-102] The export keeps its total after an absent length
```

## m237

File: `src/director/packs/session.js`.

```text
Old:
active?.status || 'idle'
New:
'idle'
Selected test: [director-089] The session state uses its active status
Result: KILLED
m237: KILLED [director-089] The session state uses its active status
```

## m238

File: `src/director/packs/manifest.js`.

```text
Old:
pack.format === 'image'
      ?
New:
false
      ?
Selected test: [director-080] The placement selects the image fields
Result: KILLED
m238: KILLED [director-080] The placement selects the image fields
```

## m239

File: `src/director/packs/manifest.js`.

```text
Old:
pack.format === 'media'
        ?
New:
false
        ?
Selected test: [director-081] The placement selects the media fields
Result: KILLED
m239: KILLED [director-081] The placement selects the media fields
```

## m240

File: `src/director/packs/session.js`.

```text
Old:
adapterMap.get(pack.format)
New:
pack.format === 'geojson' ? null : adapterMap.get(pack.format)
Selected test: [director-089] The session loads its geojson format
Result: KILLED
m240: KILLED [director-089] The session loads its geojson format
```

## m241

File: `src/director/packs/session.js`.

```text
Old:
adapterMap.get(pack.format)
New:
pack.format === 'image' ? null : adapterMap.get(pack.format)
Selected test: [director-089] The session loads its image format
Result: KILLED
m241: KILLED [director-089] The session loads its image format
```

## m242

File: `src/director/packs/session.js`.

```text
Old:
adapterMap.get(pack.format)
New:
pack.format === 'media' ? null : adapterMap.get(pack.format)
Selected test: [director-089] The session loads its media format
Result: KILLED
m242: KILLED [director-089] The session loads its media format
```

## m243

File: `src/director/packs/source.js`.

```text
Old:
for (;;) {
        signal?.throwIfAborted();
New:
for (;;) {
Selected test: [director-097] The source stops between stream chunks
Result: KILLED
m243: KILLED [director-097] The source stops between stream chunks
```

## m244

File: `src/director/packs/manifest.js`.

```text
Old:
seen.has(pack.id)
New:
false
Selected test: [director-082] manifest rejects duplicate/unknown IDs, unsupported placement and request or credential syntax
Result: KILLED
m244: KILLED [director-082] manifest rejects duplicate/unknown IDs, unsupported placement and request or credenti
```

## m245

File: `src/director/packs/manifest.js`.

```text
Old:
p.bounds[0] >= p.bounds[2]
New:
false
Selected test: [director-080] image bounds and media anchor references are explicit and validated
Result: KILLED
m245: KILLED [director-080] image bounds and media anchor references are explicit and validated
```

## m246

File: `src/director/packs/source.js`.

```text
Old:
redirect: 'error'
New:
redirect: 'follow'
Selected test: [director-095 director-096 director-097] directory source confines paths, strips credentials and rejects redirects, oversized streaming bodies and missing assets
Result: KILLED
m246: KILLED [director-095 director-096 director-097] directory source confines paths, strips credentials and rej
```

## m247

File: `src/director/packs/geojson.js`.

```text
Old:
return { id, type: g.type, coordinates };
New:
return { id, type: g.type, coordinates, properties: feature.properties };
Selected test: [director-087] GeoJSON preserves stable geometry IDs but never properties or remote style hints
Result: KILLED
m247: KILLED [director-087] GeoJSON preserves stable geometry IDs but never properties or remote style hints
```

## m248

File: `src/director/packs/session.js`.

```text
Old:
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
New:
run.handles.splice(0);
Selected test: [director-089] pack session removes presentations and cancels the transport on Stop
Result: KILLED
m248: KILLED [director-089] pack session removes presentations and cancels the transport on Stop
```

## m249

File: `src/director/packs/session.js`.

```text
Old:
if (superseded) return false;
New:
if (superseded) throw new Error("wrong");
Selected test: [director-091] replacing a pending source settles promptly and ignores its late bytes
Result: KILLED
m249: KILLED [director-091] replacing a pending source settles promptly and ignores its late bytes
```

## m250

File: `src/director/packs/session.js`.

```text
Old:
if (ended) late(value);
New:
if (ended) {}
Selected test: [director-090] late renderer resources are disposed after cancellation without mutating a replacement
Result: KILLED
m250: KILLED [director-090] late renderer resources are disposed after cancellation without mutating a replacemen
```

## m251

File: `src/director/packs/session.js`.

```text
Old:
if (ended) late(value);
New:
if (ended) {}
Selected test: [director-090] an abort between renderer settlement and continuation cannot leak the returned resource
Result: KILLED
m251: KILLED [director-090] an abort between renderer settlement and continuation cannot leak the returned resour
```

## m252

File: `src/director/packs/session.js`.

```text
Old:
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
New:
throw new Error("wrong");
Selected test: [director-092] timeout settles an uncooperative adapter and failed packs roll back earlier resources
Result: KILLED
m252: KILLED [director-092] timeout settles an uncooperative adapter and failed packs roll back earlier resources
```

## m253

File: `src/director/packs/session.js`.

```text
Old:
hex !== pack.sha256
New:
false
Selected test: [director-093] byte and integrity checks run before rendering; adapter names never resolve inherited properties
Result: KILLED
m253: KILLED [director-093] byte and integrity checks run before rendering; adapter names never resolve inherited
```

## m254

File: `src/director/packs/source.js`.

```text
Old:
await response.body?.cancel().catch(() => {});
New:

Selected test: [director-097] failed responses release their body and an already-cancelled source sends no request
Result: KILLED
m254: KILLED [director-097] failed responses release their body and an already-cancelled source sends no request
```

## m255

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
New:
pack.source = { adapter: 'bad', path: entry.path };
Selected test: [director-101] selected-scene bundles round trip bytes and attribution without mutating the project or fetching
Result: KILLED
m255: KILLED [director-101] selected-scene bundles round trip bytes and attribution without mutating the project 
```

## m256

File: `src/director/sharing/bundle.js`.

```text
Old:
input.version !== 1
New:
false
Selected test: [director-099] bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files and broken integrity
Result: KILLED
m256: KILLED [director-099] bundle rejects malformed bytes, unknown fields, traversal, duplicates, missing files 
```

## m257

File: `src/director/sharing/bundle.js`.

```text
Old:
bytes.length > PACK_LIMITS.bytes
New:
false
Selected test: [director-102] asset caps and declared integrity are enforced before creating a downloadable bundle
Result: KILLED
m257: KILLED [director-102] asset caps and declared integrity are enforced before creating a downloadable bundle
```

## m258

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength !== entry.byteLength
New:
false
Selected test: [director-103] duplicate pack paths share one asset and reject conflicting integrity
Result: KILLED
m258: KILLED [director-103] duplicate pack paths share one asset and reject conflicting integrity
```

## m259

File: `src/director/sharing/preview.js`.

```text
Old:
sources.has(pack.source.adapter)
New:
true
Selected test: [director-109] preview reports unavailable sources/layers and missing bundle assets without applying anything
Result: KILLED
m259: KILLED [director-109] preview reports unavailable sources/layers and missing bundle assets without applying
```

## m260

File: `src/director/sharing/bundle.js`.

```text
Old:
bytes: asset.bytes.slice()
New:
bytes: asset.bytes
Selected test: [director-104] bundle byte owner releases replacement data and has no network fallback
Result: KILLED
m260: KILLED [director-104] bundle byte owner releases replacement data and has no network fallback
```

## m261

File: `src/director/sharing/bundle.js`.

```text
Old:
if (file.size > limit)
New:
if (false)
Selected test: [director-106] oversized files fail before reading and cancellation settles a stalled file without a late result
Result: KILLED
m261: KILLED [director-106] oversized files fail before reading and cancellation settles a stalled file without a
```

## m262

File: `src/director/sharing/lifetime.js`.

```text
Old:
reject(signal.reason);
New:
reject(new Error('wrong'));
Selected test: [director-107] cancelled bundle export never resolves another asset or produces partial output
Result: KILLED
m262: KILLED [director-107] cancelled bundle export never resolves another asset or produces partial output
```

## m263

File: `src/director/sharing/bundle.js`.

```text
Old:
.at(-1).slice(0, 160)
New:
.at(-1)
Selected test: [director-101] long valid source filenames still produce an importable bundle
Result: KILLED
m263: KILLED [director-101] long valid source filenames still produce an importable bundle
```

## m264

File: `src/director/packs/manifest.js`.

```text
Old:
: ['altitudeReference'],
New:
: [],
Selected test: [director-077] The manifest accepts geojson
Result: KILLED
m264: KILLED [director-077] The manifest accepts geojson
```

## m265

File: `src/director/packs/manifest.js`.

```text
Old:
pack.format === 'image'
      ?
New:
false
      ?
Selected test: [director-077] The manifest accepts image
Result: KILLED
m265: KILLED [director-077] The manifest accepts image
```

## m266

File: `src/director/packs/manifest.js`.

```text
Old:
pack.format === 'media'
        ?
New:
false
        ?
Selected test: [director-077] The manifest accepts media
Result: KILLED
m266: KILLED [director-077] The manifest accepts media
```

## m267

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 0 ? 181 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image rejects bounds field 0
Result: KILLED
m267: KILLED [director-080] The image rejects bounds field 0
```

## m268

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 1 ? 91 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image rejects bounds field 1
Result: KILLED
m268: KILLED [director-080] The image rejects bounds field 1
```

## m269

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 2 ? 181 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image rejects bounds field 2
Result: KILLED
m269: KILLED [director-080] The image rejects bounds field 2
```

## m270

File: `src/director/packs/manifest.js`.

```text
Old:
i % 2 ? 90 : 180
New:
i === 3 ? 91 : (i % 2 ? 90 : 180)
Selected test: [director-080] The image rejects bounds field 3
Result: KILLED
m270: KILLED [director-080] The image rejects bounds field 3
```

## m271

File: `src/director/packs/session.js`.

```text
Old:
        timeoutMs,
New:
        15000,
Selected test: [director-092] The session uses its supplied deadline
Result: KILLED
m271: KILLED [director-092] The session uses its supplied deadline
```

## m272

File: `src/director/packs/session.js`.

```text
Old:
timeoutMs = 15000
New:
timeoutMs = 15001
Selected test: [director-092] The session uses its default deadline
Result: KILLED
m272: KILLED [director-092] The session uses its default deadline
```

## m273

File: `src/director/packs/session.js`.

```text
Old:
if (active === run) clear();
        if (superseded)
New:
if (superseded)
Selected test: [director-092] The session removes resources after a later error
Result: KILLED
m273: KILLED [director-092] The session removes resources after a later error
```

## m274

File: `src/director/sharing/bundle.js`.

```text
Old:
  'application/json',
New:

Selected test: [director-099] The bundle accepts the application/json media type
Result: KILLED
m274: KILLED [director-099] The bundle accepts the application/json media type
```

## m275

File: `src/director/sharing/bundle.js`.

```text
Old:
  'application/geo+json',
New:

Selected test: [director-099] The bundle accepts the application/geo+json media type
Result: KILLED
m275: KILLED [director-099] The bundle accepts the application/geo+json media type
```

## m276

File: `src/director/sharing/bundle.js`.

```text
Old:
  'image/png',
New:

Selected test: [director-099] The bundle accepts the image/png media type
Result: KILLED
m276: KILLED [director-099] The bundle accepts the image/png media type
```

## m277

File: `src/director/sharing/bundle.js`.

```text
Old:
  'video/mp4',
New:

Selected test: [director-099] The bundle accepts the video/mp4 media type
Result: KILLED
m277: KILLED [director-099] The bundle accepts the video/mp4 media type
```

## m278

File: `src/director/sharing/bundle.js`.

```text
Old:
  'video/webm',
New:

Selected test: [director-099] The bundle accepts the video/webm media type
Result: KILLED
m278: KILLED [director-099] The bundle accepts the video/webm media type
```

## m279

File: `src/director/sharing/bundle.js`.

```text
Old:
  'audio/mpeg',
New:

Selected test: [director-099] The bundle accepts the audio/mpeg media type
Result: KILLED
m279: KILLED [director-099] The bundle accepts the audio/mpeg media type
```

## m280

File: `src/director/sharing/bundle.js`.

```text
Old:
  'audio/ogg',
New:

Selected test: [director-099] The bundle accepts the audio/ogg media type
Result: KILLED
m280: KILLED [director-099] The bundle accepts the audio/ogg media type
```

## m281

File: `src/director/sharing/bundle.js`.

```text
Old:
  'audio/wav',
New:

Selected test: [director-099] The bundle accepts the audio/wav media type
Result: KILLED
m281: KILLED [director-099] The bundle accepts the audio/wav media type
```

## m282

File: `src/director/sharing/bundle.js`.

```text
Old:
  'audio/webm',
New:

Selected test: [director-099] The bundle accepts the audio/webm media type
Result: KILLED
m282: KILLED [director-099] The bundle accepts the audio/webm media type
```

## m283

File: `src/director/packs/session.js`.

```text
Old:
!handle
New:
false
Selected test: [director-089] The session rejects a falsy handle with inherited disposal
Result: KILLED
m283: KILLED [director-089] The session rejects a falsy handle with inherited disposal
```

## m284

File: `src/director/packs/session.js`.

```text
Old:
if (disposed || signal?.aborted) return false;
New:
if (signal?.aborted || disposed) return false;
Selected test: The signal getter permits work after destruction
Result: KILLED
m284: KILLED The signal getter permits work after destruction
```

## m285

File: `src/director/packs/geojson.js`.

```text
Old:
value.features.length > PACK_LIMITS.features
New:
value.features.length >= PACK_LIMITS.features
Selected test: [director-083] The collection accepts its exact feature limit
Result: KILLED
m285: KILLED [director-083] The collection accepts its exact feature limit
```

## m286

File: `src/director/packs/geojson.js`.

```text
Old:
id.length > 256
New:
id.length >= 256
Selected test: [director-084] The feature ID accepts its exact text limit
Result: KILLED
m286: KILLED [director-084] The feature ID accepts its exact text limit
```

## m287

File: `src/director/packs/geojson.js`.

```text
Old:
++positions > PACK_LIMITS.positions
New:
++positions >= PACK_LIMITS.positions
Selected test: [director-085] The position accepts its exact total limit
Result: KILLED
m287: KILLED [director-085] The position accepts its exact total limit
```

## m288

File: `src/director/packs/geojson.js`.

```text
Old:
g.coordinates.length <= 128
New:
g.coordinates.length < 128
Selected test: [director-087] The polygon accepts its exact ring limit
Result: KILLED
m288: KILLED [director-087] The polygon accepts its exact ring limit
```

## m289

File: `src/director/packs/manifest.js`.

```text
Old:
string(value, path, 1024);
New:
string(value, path, 1025);
Selected test: [director-076] The asset path checks its text limit
Result: KILLED
m289: KILLED [director-076] The asset path checks its text limit
```

## m290

File: `src/director/sharing/bundle.js`.

```text
Old:
assets.length >= SHARE_LIMITS.assets
New:
assets.length >= SHARE_LIMITS.assets - 1
Selected test: [director-102] The export accepts its exact asset total
Result: KILLED
m290: KILLED [director-102] The export accepts its exact asset total
```

## m291

File: `src/director/packs/session.js`.

```text
Old:
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
New:
for (const handle of run.handles.splice(0).reverse().slice(0,1)) handle.dispose();
Selected test: [director-089] The session owns every pack handle
Result: KILLED
m291: KILLED [director-089] The session owns every pack handle
```

## m292

File: `src/director/packs/source.js`.

```text
Old:
      signal,
New:

Selected test: [director-095] The request owns its signal option
Result: KILLED
m292: KILLED [director-095] The request owns its signal option
```

## m293

File: `src/director/packs/source.js`.

```text
Old:
length > maxBytes
New:
length >= maxBytes
Selected test: [director-096] The stream accepts its exact byte limit
Result: KILLED
m293: KILLED [director-096] The stream accepts its exact byte limit
```

## m294

File: `src/director/packs/source.js`.

```text
Old:
Number(response.headers.get('content-length')) > maxBytes
New:
Number(response.headers.get('content-length')) >= maxBytes
Selected test: [director-096] The stream accepts its exact byte limit
Result: KILLED
m294: KILLED [director-096] The stream accepts its exact byte limit
```

## m295

File: `src/director/packs/session.js`.

```text
Old:
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
New:
throw error;
Selected test: [director-092] The session rejects a falsy custom source
Result: KILLED
m295: KILLED [director-092] The session rejects a falsy custom source
```

## m296

File: `src/director/sharing/bundle.js`.

```text
Old:
const copy = parseSceneDocument(stringifySceneDocument(project));
New:
const copy = project;
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m296: KILLED [director-101] The export writes exact bundle metadata
```

## m297

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.byteLength = entry.byteLength;
New:
pack.byteLength = 1;
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m297: KILLED [director-101] The export writes exact bundle metadata
```

## m298

File: `src/director/sharing/bundle.js`.

```text
Old:
pack.sha256 = entry.sha256;
New:
pack.sha256 = '0'.repeat(64);
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m298: KILLED [director-101] The export writes exact bundle metadata
```

## m299

File: `src/director/sharing/bundle.js`.

```text
Old:
base64: encode(bytes),
New:
base64: 'AAAA',
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m299: KILLED [director-101] The export writes exact bundle metadata
```

## m300

File: `src/director/sharing/bundle.js`.

```text
Old:
assets: assets.map(({ byteLength, ...entry }) => entry),
New:
assets,
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m300: KILLED [director-101] The export writes exact bundle metadata
```

## m301

File: `src/director/sharing/bundle.js`.

```text
Old:
path: entry.path };
New:
path: 'other.json' };
Selected test: [director-101] The export writes exact bundle metadata
Result: KILLED
m301: KILLED [director-101] The export writes exact bundle metadata
```

## m302

File: `src/director/sharing/bundle.js`.

```text
Old:
mimeType: asset.mimeType };
New:
mimeType: 'bad' };
Selected test: [director-105] The store returns an independent byte copy
Result: KILLED
m302: KILLED [director-105] The store returns an independent byte copy
```


## Totals

The complete command records 302 KILLED results, 0 survivors and 0 time limits.
The command output is `mutation-continuation.log`.
