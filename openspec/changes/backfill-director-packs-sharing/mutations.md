# Director code mutations

HTTP means Hypertext Transfer Protocol.
HTTPS means HTTP with a secure connection.
MIME means Multipurpose Internet Mail Extensions.
AAAA is a base64 value in a code change.

Base commit: `290b5d2`.

The complete command uses a scratch copy of the repository.
Each test path comes from a repository test file.
The helper restores each production file.
The output gives each result below.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-tools/director-3/mutation-clone /home/ianblenke/docker/gev-tools/director-3/muts.json
```

The command checks 367 mutation rows.
It gives 365 KILLED results and 2 SURVIVED results.
It reaches the end without a time limit result or a skipped row.

Rows m172 and m284 show code limits, not equivalent changes.
Only scratch tests fail for these changes.
The probes are evidence/probe-inherited-height.txt and evidence/probe-signal-getter.txt.
No row claims equivalence for the public API of the module.

## m001

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m001-old) | [New code](#m001-new) | KILLED | [director-076] The asset path accepts safe names |

### m001 Old

```text
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
```

### m001 New

```text
/^never$/
```

## m002

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m002-old) | [New code](#m002-new) | KILLED | [director-076] The asset path rejects traversal |

### m002 Old

```text
.every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))
```

### m002 New

```text
.every(() => true)
```

## m003

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m003-old) | [New code](#m003-new) | KILLED | [director-077] The manifest rejects invalid version |

### m003 Old

```text
pack.version !== 1
```

### m003 New

```text
false
```

## m004

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m004-old) | [New code](#m004-new) | KILLED | [director-077] The manifest rejects invalid format |

### m004 Old

```text
!['geojson', 'image', 'media'].includes(pack.format)
```

### m004 New

```text
false
```

## m005

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m005-old) | [New code](#m005-new) | KILLED | [director-078] The attribution rejects protocol |

### m005 Old

```text
parsed.protocol !== 'https:'
```

### m005 New

```text
false
```

## m006

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m006-old) | [New code](#m006-new) | KILLED | [director-078] The attribution rejects username |

### m006 Old

```text
parsed.username
```

### m006 New

```text
false
```

## m007

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m007-old) | [New code](#m007-new) | KILLED | [director-078] The attribution rejects password |

### m007 Old

```text
parsed.password
```

### m007 New

```text
false
```

## m008

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m008-old) | [New code](#m008-new) | KILLED | [director-078] The attribution rejects query |

### m008 Old

```text
parsed.search
```

### m008 New

```text
false
```

## m009

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m009-old) | [New code](#m009-new) | KILLED | [director-078] The attribution rejects fragment |

### m009 Old

```text
parsed.hash
```

### m009 New

```text
false
```

## m010

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m010-old) | [New code](#m010-new) | KILLED | [director-078] The attribution rejects invalid URL text |

### m010 Old

```text
fail(at, 'expected an HTTPS source link');
```

### m010 New

```text
return;
```

## m011

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m011-old) | [New code](#m011-new) | KILLED | [director-078] The attribution accepts a safe link |

### m011 Old

```text
parsed.protocol !== 'https:'
```

### m011 New

```text
parsed.protocol === 'https:'
```

## m012

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m012-old) | [New code](#m012-new) | KILLED | [director-078] The attribution rejects blank text |

### m012 Old

```text
string(pack.attribution.text, `${path}.attribution.text`, 4096);
```

### m012 New

```text

```

## m013

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m013-old) | [New code](#m013-new) | KILLED | [director-078] The attribution rejects blank license |

### m013 Old

```text
string(pack.attribution.license, `${path}.attribution.license`, 4096);
```

### m013 New

```text

```

## m014

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m014-old) | [New code](#m014-new) | KILLED | [director-079] The byte length rejects a fraction |

### m014 Old

```text
!Number.isInteger(v)
```

### m014 New

```text
false
```

## m015

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m015-old) | [New code](#m015-new) | KILLED | [director-079] The digest rejects invalid type |

### m015 Old

```text
typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v)
```

### m015 New

```text
!/^[a-f0-9]{64}$/.test(v)
```

## m016

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m016-old) | [New code](#m016-new) | KILLED | [director-079] The digest rejects invalid alphabet |

### m016 Old

```text
typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v)
```

### m016 New

```text
typeof v !== 'string'
```

## m017

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m017-old) | [New code](#m017-new) | KILLED | [director-079] The integrity fields accept their limits |

### m017 Old

```text
number(v, at, 1, PACK_LIMITS.bytes, false);
```

### m017 New

```text
number(v, at, 0, PACK_LIMITS.bytes + 1, false);
```

## m018

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m018-old) | [New code](#m018-new) | KILLED | [director-080] The image rejects reversed west |

### m018 Old

```text
p.bounds[0] >= p.bounds[2]
```

### m018 New

```text
false
```

## m019

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m019-old) | [New code](#m019-new) | KILLED | [director-080] The image rejects reversed south |

### m019 Old

```text
p.bounds[1] >= p.bounds[3]
```

### m019 New

```text
false
```

## m020

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m020-old) | [New code](#m020-new) | KILLED | [director-080] The image rejects short bounds |

### m020 Old

```text
p.bounds.length !== 4
```

### m020 New

```text
false
```

## m021

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m021-old) | [New code](#m021-new) | KILLED | [director-080] The image rejects height and reference |

### m021 Old

```text
p.altitudeReference !== 'ellipsoid'
```

### m021 New

```text
false
```

## m022

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m022-old) | [New code](#m022-new) | KILLED | [director-081] The media rejects an unknown anchor |

### m022 Old

```text
!anchorIds.has(p.anchorId)
```

### m022 New

```text
false
```

## m023

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m023-old) | [New code](#m023-new) | KILLED | [director-082] The scene rejects duplicate data pack IDs |

### m023 Old

```text
seen.has(pack.id)
```

### m023 New

```text
false
```

## m024

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m024-old) | [New code](#m024-new) | KILLED | [director-082] The shot rejects duplicate data pack IDs |

### m024 Old

```text
new Set(ids).size !== ids.length
```

### m024 New

```text
false
```

## m025

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m025-old) | [New code](#m025-new) | KILLED | [director-082] The shot rejects unknown data pack IDs |

### m025 Old

```text
ids.some((id) => !seen.has(id))
```

### m025 New

```text
false
```

## m026

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m026-old) | [New code](#m026-new) | KILLED | [director-082] The scene accepts absent data packs and anchors |

### m026 Old

```text
Object.hasOwn(scene, 'dataPacks') ? scene.dataPacks : []
```

### m026 New

```text
scene.dataPacks
```

## m027

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m027-old) | [New code](#m027-new) | KILLED | [director-083] The collection rejects invalid type |

### m027 Old

```text
value?.type !== 'FeatureCollection'
```

### m027 New

```text
false
```

## m028

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m028-old) | [New code](#m028-new) | KILLED | [director-083] The collection rejects invalid array |

### m028 Old

```text
!Array.isArray(value.features)
```

### m028 New

```text
false
```

## m029

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m029-old) | [New code](#m029-new) | KILLED | [director-083] The collection rejects more than 2000 features |

### m029 Old

```text
value.features.length > PACK_LIMITS.features
```

### m029 New

```text
false
```

## m030

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m030-old) | [New code](#m030-new) | KILLED | [director-084] The feature rejects type |

### m030 Old

```text
feature?.type !== 'Feature'
```

### m030 New

```text
false
```

## m031

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m031-old) | [New code](#m031-new) | KILLED | [director-084] The feature rejects ID type |

### m031 Old

```text
typeof id !== 'string'
```

### m031 New

```text
false
```

## m032

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m032-old) | [New code](#m032-new) | KILLED | [director-084] The feature rejects blank ID |

### m032 Old

```text
!id.trim()
```

### m032 New

```text
false
```

## m033

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m033-old) | [New code](#m033-new) | KILLED | [director-084] The feature rejects long ID |

### m033 Old

```text
id.length > 256
```

### m033 New

```text
false
```

## m034

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m034-old) | [New code](#m034-new) | KILLED | [director-084] The feature rejects duplicate ID |

### m034 Old

```text
ids.has(id)
```

### m034 New

```text
false
```

## m035

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m035-old) | [New code](#m035-new) | KILLED | [director-085] The position rejects invalid array |

### m035 Old

```text
!Array.isArray(p)
```

### m035 New

```text
false
```

## m036

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m036-old) | [New code](#m036-new) | KILLED | [director-085] The position rejects invalid length |

### m036 Old

```text
![2, 3].includes(p.length)
```

### m036 New

```text
false
```

## m037

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m037-old) | [New code](#m037-new) | KILLED | [director-085] The position rejects a coordinate that is not finite |

### m037 Old

```text
p.some((v) => !Number.isFinite(v))
```

### m037 New

```text
false
```

## m038

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m038-old) | [New code](#m038-new) | KILLED | [director-085] The position rejects invalid longitude |

### m038 Old

```text
Math.abs(p[0]) > 180
```

### m038 New

```text
false
```

## m039

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m039-old) | [New code](#m039-new) | KILLED | [director-085] The position rejects invalid latitude |

### m039 Old

```text
Math.abs(p[1]) > 90
```

### m039 New

```text
false
```

## m040

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m040-old) | [New code](#m040-new) | KILLED | [director-085] The position rejects a height below the limit |

### m040 Old

```text
p[2] < -12000
```

### m040 New

```text
false
```

## m041

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m041-old) | [New code](#m041-new) | KILLED | [director-085] The position rejects a height above the limit |

### m041 Old

```text
p[2] > 1e9
```

### m041 New

```text
false
```

## m042

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m042-old) | [New code](#m042-new) | KILLED | [director-085] The position total rejects excess |

### m042 Old

```text
++positions > PACK_LIMITS.positions
```

### m042 New

```text
false
```

## m043

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m043-old) | [New code](#m043-new) | KILLED | [director-085] The position uses zero for absent height |

### m043 Old

```text
p[2] ?? 0
```

### m043 New

```text
p[2] ?? 1
```

## m044

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m044-old) | [New code](#m044-new) | KILLED | [director-085] The position keeps the height in the data |

### m044 Old

```text
p[2] ?? 0
```

### m044 New

```text
0
```

## m045

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m045-old) | [New code](#m045-new) | KILLED | [director-086] The line rejects invalid array |

### m045 Old

```text
!Array.isArray(points)
```

### m045 New

```text
false
```

## m046

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m046-old) | [New code](#m046-new) | KILLED | [director-086] The line rejects invalid minimum |

### m046 Old

```text
points.length < (ring ? 4 : 2)
```

### m046 New

```text
false
```

## m047

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m047-old) | [New code](#m047-new) | KILLED | [director-086] The ring needs four points |

### m047 Old

```text
ring ? 4 : 2
```

### m047 New

```text
2
```

## m048

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m048-old) | [New code](#m048-new) | KILLED | [director-086] The line accepts two distinct endpoints |

### m048 Old

```text
ring && normalized[0].some
```

### m048 New

```text
normalized[0].some
```

## m049

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m049-old) | [New code](#m049-new) | KILLED | [director-086] The ring rejects unclosed field 0 |

### m049 Old

```text
v !== normalized.at(-1)[i]
```

### m049 New

```text
i !== 0 && v !== normalized.at(-1)[i]
```

## m050

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m050-old) | [New code](#m050-new) | KILLED | [director-086] The ring rejects unclosed field 1 |

### m050 Old

```text
v !== normalized.at(-1)[i]
```

### m050 New

```text
i !== 1 && v !== normalized.at(-1)[i]
```

## m051

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m051-old) | [New code](#m051-new) | KILLED | [director-086] The ring rejects unclosed field 2 |

### m051 Old

```text
v !== normalized.at(-1)[i]
```

### m051 New

```text
i !== 2 && v !== normalized.at(-1)[i]
```

## m052

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m052-old) | [New code](#m052-new) | KILLED | [director-087] The geometry rejects invalid type |

### m052 Old

```text
g?.type === 'Polygon'
```

### m052 New

```text
true
```

## m053

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m053-old) | [New code](#m053-new) | KILLED | [director-087] The geometry rejects invalid array |

### m053 Old

```text
Array.isArray(g.coordinates)
```

### m053 New

```text
true
```

## m054

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m054-old) | [New code](#m054-new) | KILLED | [director-087] The geometry rejects an empty polygon |

### m054 Old

```text
g.coordinates.length &&
```

### m054 New

```text
true &&
```

## m055

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m055-old) | [New code](#m055-new) | KILLED | [director-087] The geometry rejects more than 128 rings |

### m055 Old

```text
g.coordinates.length <= 128
```

### m055 New

```text
true
```

## m056

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m056-old) | [New code](#m056-new) | KILLED | [director-087] The geometry returns a closed polygon |

### m056 Old

```text
coordinates = g.coordinates.map((ring) => line(ring, true));
```

### m056 New

```text
coordinates = [];
```

## m057

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m057-old) | [New code](#m057-new) | KILLED | [director-087] The geometry removes properties |

### m057 Old

```text
return { id, type: g.type, coordinates };
```

### m057 New

```text
return { ...feature, id, type: g.type, coordinates };
```

## m058

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m058-old) | [New code](#m058-new) | KILLED | [director-088] The new session reports idle state |

### m058 Old

```text
if (!packs.length) return true;
```

### m058 New

```text
if (!packs.length) return false;
```

## m059

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m059-old) | [New code](#m059-new) | KILLED | [director-088] The session rejects a value that is not a data pack list |

### m059 Old

```text
!Array.isArray(packs)
```

### m059 New

```text
false
```

## m060

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m060-old) | [New code](#m060-new) | KILLED | [director-088] The session rejects more than eight data packs |

### m060 Old

```text
packs.length > PACK_LIMITS.packs
```

### m060 New

```text
false
```

## m061

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m061-old) | [New code](#m061-new) | KILLED | [director-088] The session rejects destroyed state |

### m061 Old

```text
disposed || signal?.aborted
```

### m061 New

```text
signal?.aborted
```

## m062

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m062-old) | [New code](#m062-new) | KILLED | [director-088] The session rejects cancelled state |

### m062 Old

```text
disposed || signal?.aborted
```

### m062 New

```text
disposed
```

## m063

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m063-old) | [New code](#m063-new) | KILLED | [director-089] The session disposes handles in reverse order |

### m063 Old

```text
run.handles.splice(0).reverse()
```

### m063 New

```text
run.handles.splice(0)
```

## m064

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m064-old) | [New code](#m064-new) | KILLED | [director-089] The session gives copied state |

### m064 Old

```text
run.status = 'ready';
```

### m064 New

```text
run.status = 'bad';
```

## m065

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m065-old) | [New code](#m065-new) | KILLED | [director-090] The cancelled session disposes late resources |

### m065 Old

```text
if (ended) late(value);
```

### m065 New

```text
if (ended) {}
```

## m066

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m066-old) | [New code](#m066-new) | KILLED | [director-090] The session accepts a null late handle |

### m066 Old

```text
(late) => late?.dispose()
```

### m066 New

```text
(late) => late.dispose()
```

## m067

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m067-old) | [New code](#m067-new) | KILLED | [director-090] The session destroys work that is not complete |

### m067 Old

```text
if (superseded) return false;
```

### m067 New

```text
if (superseded) throw new Error("bad");
```

## m068

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m068-old) | [New code](#m068-new) | KILLED | [director-091] The replacement keeps its resources |

### m068 Old

```text
if (active === run) clear();
        if (superseded)
```

### m068 New

```text
clear();
        if (superseded)
```

## m069

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m069-old) | [New code](#m069-new) | KILLED | [director-092] The session reports a stable source error |

### m069 Old

```text
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
```

### m069 New

```text
throw error;
```

## m070

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m070-old) | [New code](#m070-new) | KILLED | [director-092] The deadline rejects stalled work |

### m070 Old

```text
if (superseded) return false;
```

### m070 New

```text
return false;
```

## m071

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m071-old) | [New code](#m071-new) | KILLED | [director-092] The absent registered source stops after the validation size read |

### m071 Old

```text
!source
```

### m071 New

```text
false
```

## m072

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m072-old) | [New code](#m072-new) | KILLED | [director-092] The absent renderer does not call its source |

### m072 Old

```text
!adapter
```

### m072 New

```text
false
```

## m073

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m073-old) | [New code](#m073-new) | KILLED | [director-093] The session rejects bytes that are not a Uint8Array |

### m073 Old

```text
!(bytes instanceof Uint8Array)
```

### m073 New

```text
false
```

## m074

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m074-old) | [New code](#m074-new) | KILLED | [director-093] The session rejects an empty asset |

### m074 Old

```text
!bytes.length
```

### m074 New

```text
false
```

## m075

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m075-old) | [New code](#m075-new) | KILLED | [director-093] The session rejects an asset above the byte limit |

### m075 Old

```text
bytes.length > PACK_LIMITS.bytes
```

### m075 New

```text
false
```

## m076

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m076-old) | [New code](#m076-new) | KILLED | [director-093] The session rejects a wrong asset length |

### m076 Old

```text
pack.byteLength && bytes.length !== pack.byteLength
```

### m076 New

```text
false
```

## m077

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m077-old) | [New code](#m077-new) | KILLED | [director-093] The session rejects bytes above the total limit |

### m077 Old

```text
total > PACK_LIMITS.totalBytes
```

### m077 New

```text
false
```

## m078

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m078-old) | [New code](#m078-new) | KILLED | [director-093] The session rejects a wrong digest |

### m078 Old

```text
hex !== pack.sha256
```

### m078 New

```text
false
```

## m079

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m079-old) | [New code](#m079-new) | KILLED | [director-093] The session checks exact bytes and digest |

### m079 Old

```text
maxBytes: pack.byteLength || PACK_LIMITS.bytes
```

### m079 New

```text
maxBytes: PACK_LIMITS.bytes
```

## m080

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m080-old) | [New code](#m080-new) | KILLED | [director-089] The session rejects a falsy handle with inherited disposal |

### m080 Old

```text
!handle
```

### m080 New

```text
false
```

## m081

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m081-old) | [New code](#m081-new) | KILLED | [director-089] The session rejects a handle without a dispose function |

### m081 Old

```text
typeof handle.dispose !== 'function'
```

### m081 New

```text
false
```

## m082

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m082-old) | [New code](#m082-new) | KILLED | [director-094] The directory rejects protocol |

### m082 Old

```text
!['https:', 'http:'].includes(base.protocol)
```

### m082 New

```text
false
```

## m083

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m083-old) | [New code](#m083-new) | KILLED | [director-094] The directory rejects username |

### m083 Old

```text
base.username
```

### m083 New

```text
false
```

## m084

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m084-old) | [New code](#m084-new) | KILLED | [director-094] The directory rejects password |

### m084 Old

```text
base.password
```

### m084 New

```text
false
```

## m085

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m085-old) | [New code](#m085-new) | KILLED | [director-094] The directory rejects query |

### m085 Old

```text
base.search
```

### m085 New

```text
false
```

## m086

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m086-old) | [New code](#m086-new) | KILLED | [director-094] The directory rejects fragment |

### m086 Old

```text
base.hash
```

### m086 New

```text
false
```

## m087

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m087-old) | [New code](#m087-new) | KILLED | [director-094] The directory rejects an address with no final slash |

### m087 Old

```text
!base.pathname.endsWith('/')
```

### m087 New

```text
false
```

## m088

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m088-old) | [New code](#m088-new) | KILLED | [director-095] The asset request sets its fixed options |

### m088 Old

```text
cache: 'no-store'
```

### m088 New

```text
cache: 'default'
```

## m089

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m089-old) | [New code](#m089-new) | KILLED | [director-096] The stream joins distinct chunks |

### m089 Old

```text
offset += chunk.byteLength;
```

### m089 New

```text
offset = 0;
```

## m090

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m090-old) | [New code](#m090-new) | KILLED | [director-096] The stream rejects excess header bytes |

### m090 Old

```text
Number(response.headers.get('content-length')) > maxBytes
```

### m090 New

```text
false
```

## m091

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m091-old) | [New code](#m091-new) | KILLED | [director-096] The stream rejects excess chunk bytes |

### m091 Old

```text
length > maxBytes
```

### m091 New

```text
false
```

## m092

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m092-old) | [New code](#m092-new) | KILLED | [director-096] The stream uses absent MIME default |

### m092 Old

```text
response.headers.get('content-type') || ''
```

### m092 New

```text
response.headers.get('content-type') || 'bad'
```

## m093

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m093-old) | [New code](#m093-new) | KILLED | [director-096] The stream normalizes MIME text |

### m093 Old

```text
.toLowerCase()
```

### m093 New

```text

```

## m094

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m094-old) | [New code](#m094-new) | KILLED | [director-097] The source rejects an absent stream |

### m094 Old

```text
if (!reader) throw new Error('Asset stream unavailable');
```

### m094 New

```text
if (!reader) return {};
```

## m095

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m095-old) | [New code](#m095-new) | KILLED | [director-097] The source accepts failed body cancellation |

### m095 Old

```text
response.body?.cancel().catch(() => {})
```

### m095 New

```text
response.body?.cancel()
```

## m096

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m096-old) | [New code](#m096-new) | KILLED | [director-097] The source rejects a failed response without a body |

### m096 Old

```text
response.body?.cancel()
```

### m096 New

```text
response.body.cancel()
```

## m097

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m097-old) | [New code](#m097-new) | KILLED | [director-097] The stream releases its lock after an error |

### m097 Old

```text
await reader.cancel().catch(() => {});
```

### m097 New

```text
await reader.cancel();
```

## m098

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m098-old) | [New code](#m098-new) | KILLED | [director-097] The source checks its signal between chunks |

### m098 Old

```text
for (;;) {
        signal?.throwIfAborted();
```

### m098 New

```text
for (;;) {
        throw new Error('wrong');
```

## m099

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m099-old) | [New code](#m099-new) | KILLED | [director-098] The share helpers reject nontext input |

### m099 Old

```text
typeof text !== 'string'
```

### m099 New

```text
false
```

## m100

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m100-old) | [New code](#m100-new) | KILLED | [director-098] The share helpers reject invalid JSON |

### m100 Old

```text
fail('$', 'invalid JSON');
```

### m100 New

```text
throw new Error('wrong');
```

## m101

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m101-old) | [New code](#m101-new) | KILLED | [director-098] The share helpers accept plain project JSON |

### m101 Old

```text
if (input?.format !== 'gev-scene-bundle')
```

### m101 New

```text
if (false)
```

## m102

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m102-old) | [New code](#m102-new) | KILLED | [director-098] The share helpers reject excess characters |

### m102 Old

```text
text.length > SHARE_LIMITS.bytes
```

### m102 New

```text
false
```

## m103

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m103-old) | [New code](#m103-new) | KILLED | [director-098] The share helpers reject excess UTF8 bytes |

### m103 Old

```text
    new TextEncoder().encode(text).length > SHARE_LIMITS.bytes
```

### m103 New

```text
    false
```

## m104

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m104-old) | [New code](#m104-new) | KILLED | [director-099] The base64 rejects a custom text object |

### m104 Old

```text
typeof value !== 'string'
```

### m104 New

```text
false
```

## m105

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m105-old) | [New code](#m105-new) | KILLED | [director-099] The base64 rejects invalid empty |

### m105 Old

```text
!value.length
```

### m105 New

```text
false
```

## m106

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m106-old) | [New code](#m106-new) | KILLED | [director-099] The base64 rejects invalid length |

### m106 Old

```text
value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

### m106 New

```text
false
```

## m107

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m107-old) | [New code](#m107-new) | KILLED | [director-099] The base64 rejects invalid alignment |

### m107 Old

```text
value.length % 4 !== 0
```

### m107 New

```text
false
```

## m108

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m108-old) | [New code](#m108-new) | KILLED | [director-099] The base64 rejects invalid alphabet |

### m108 Old

```text
/[^A-Za-z0-9+/=]/.test(value)
```

### m108 New

```text
false
```

## m109

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m109-old) | [New code](#m109-new) | KILLED | [director-099] The base64 rejects invalid padding |

### m109 Old

```text
!/^[A-Za-z0-9+/]+={1,2}$/.test(value)
```

### m109 New

```text
false
```

## m110

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m110-old) | [New code](#m110-new) | KILLED | [director-099] The bundle rejects duplicate paths |

### m110 Old

```text
assets.has(entry.path)
```

### m110 New

```text
false
```

## m111

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m111-old) | [New code](#m111-new) | KILLED | [director-099] The bundle rejects unsupported MIME |

### m111 Old

```text
!MIME.has(mimeType)
```

### m111 New

```text
false
```

## m112

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m112-old) | [New code](#m112-new) | KILLED | [director-099] The bundle rejects unsupported version |

### m112 Old

```text
input.version !== 1
```

### m112 New

```text
false
```

## m113

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m113-old) | [New code](#m113-new) | KILLED | [director-100] The bundle rejects an absent asset |

### m113 Old

```text
      !asset ||
```

### m113 New

```text
      false ||
```

## m114

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m114-old) | [New code](#m114-new) | KILLED | [director-100] The bundle rejects a wrong asset length |

### m114 Old

```text
pack.byteLength !== asset.bytes.length
```

### m114 New

```text
false
```

## m115

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m115-old) | [New code](#m115-new) | KILLED | [director-100] The bundle rejects a wrong asset digest |

### m115 Old

```text
pack.sha256 !== asset.sha256
```

### m115 New

```text
false
```

## m116

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m116-old) | [New code](#m116-new) | KILLED | [director-100] The bundle rejects wrong asset digest |

### m116 Old

```text
entry.sha256 !== hash
```

### m116 New

```text
false
```

## m117

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m117-old) | [New code](#m117-new) | KILLED | [director-100] The bundle rejects unused assets |

### m117 Old

```text
used.size !== assets.size
```

### m117 New

```text
false
```

## m118

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m118-old) | [New code](#m118-new) | KILLED | [director-100] The bundle rejects external data pack sources |

### m118 Old

```text
pack.source.adapter !== BUNDLE_SOURCE
```

### m118 New

```text
false
```

## m119

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m119-old) | [New code](#m119-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m119 Old

```text
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
```

### m119 New

```text
pack.source = { adapter: 'bad', path: entry.path };
```

## m120

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m120-old) | [New code](#m120-new) | KILLED | [director-102] The export rejects bytes that are not a Uint8Array |

### m120 Old

```text
!(bytes instanceof Uint8Array)
```

### m120 New

```text
false
```

## m121

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m121-old) | [New code](#m121-new) | KILLED | [director-102] The export rejects an empty asset |

### m121 Old

```text
!bytes.length
```

### m121 New

```text
false
```

## m122

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m122-old) | [New code](#m122-new) | KILLED | [director-102] The export rejects an asset above the byte limit |

### m122 Old

```text
bytes.length > PACK_LIMITS.bytes
```

### m122 New

```text
false
```

## m123

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m123-old) | [New code](#m123-new) | KILLED | [director-102] The export rejects absent assets |

### m123 Old

```text
if (!asset) fail('assets', 'select a file for every declared data pack');
```

### m123 New

```text
if (!asset) return null;
```

## m124

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m124-old) | [New code](#m124-new) | KILLED | [director-102] The export rejects declared byte length |

### m124 Old

```text
pack.byteLength !== bytes.length
```

### m124 New

```text
false
```

## m125

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m125-old) | [New code](#m125-new) | KILLED | [director-102] The export rejects declared digest |

### m125 Old

```text
pack.sha256 !== sha256
```

### m125 New

```text
false
```

## m126

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m126-old) | [New code](#m126-new) | KILLED | [director-102] The export rejects excess total bytes |

### m126 Old

```text
total > PACK_LIMITS.totalBytes
```

### m126 New

```text
false
```

## m127

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m127-old) | [New code](#m127-new) | KILLED | [director-102] The export rejects excess asset total |

### m127 Old

```text
assets.length >= SHARE_LIMITS.assets
```

### m127 New

```text
false
```

## m128

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m128-old) | [New code](#m128-new) | KILLED | [director-103] The export reuses a shared asset |

### m128 Old

```text
let entry = known.get(key);
```

### m128 New

```text
let entry = null;
```

## m129

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m129-old) | [New code](#m129-new) | KILLED | [director-103] The export rejects shared byte length |

### m129 Old

```text
pack.byteLength !== entry.byteLength
```

### m129 New

```text
false
```

## m130

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m130-old) | [New code](#m130-new) | KILLED | [director-103] The export rejects shared digest |

### m130 Old

```text
pack.sha256 !== entry.sha256
```

### m130 New

```text
false
```

## m131

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m131-old) | [New code](#m131-new) | KILLED | [director-104] The store copies the asset map |

### m131 Old

```text
assets = new Map(next);
```

### m131 New

```text
assets = next;
```

## m132

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m132-old) | [New code](#m132-new) | KILLED | [director-104] The store clears stored bytes |

### m132 Old

```text
assets.clear();
```

### m132 New

```text

```

## m133

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m133-old) | [New code](#m133-new) | KILLED | [director-105] The store rejects absent bytes |

### m133 Old

```text
!asset || asset.bytes.length > maxBytes
```

### m133 New

```text
asset.bytes.length > maxBytes
```

## m134

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m134-old) | [New code](#m134-new) | KILLED | [director-105] The store rejects bytes above the caller limit |

### m134 Old

```text
asset.bytes.length > maxBytes
```

### m134 New

```text
false
```

## m135

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m135-old) | [New code](#m135-new) | KILLED | [director-105] The store returns an independent byte copy |

### m135 Old

```text
bytes: asset.bytes.slice()
```

### m135 New

```text
bytes: asset.bytes
```

## m136

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m136-old) | [New code](#m136-new) | KILLED | [director-106] The reader accepts an absent filename |

### m136 Old

```text
file.name?.endsWith('.gevbundle.json')
```

### m136 New

```text
file.name.endsWith('.gevbundle.json')
```

## m137

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m137-old) | [New code](#m137-new) | KILLED | [director-106] The reader rejects the ordinary file budget |

### m137 Old

```text
if (file.size > limit)
```

### m137 New

```text
if (false)
```

## m138

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m138-old) | [New code](#m138-new) | KILLED | [director-106] The reader gives bundles the larger budget |

### m138 Old

```text
file.name?.endsWith('.gevbundle.json')
```

### m138 New

```text
false
```

## m139

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m139-old) | [New code](#m139-new) | KILLED | [director-107] The helper resolves without a signal |

### m139 Old

```text
if (!signal) return Promise.resolve(work);
```

### m139 New

```text
if (!signal) return Promise.resolve(8);
```

## m140

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m140-old) | [New code](#m140-new) | KILLED | [director-107] The helper rejects an early signal |

### m140 Old

```text
if (signal.aborted) {
```

### m140 New

```text
if (false) {
```

## m141

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m141-old) | [New code](#m141-new) | KILLED | [director-107] The helper resolves with an active signal |

### m141 Old

```text
signal.aborted ? reject(signal.reason) : resolve(value)
```

### m141 New

```text
reject(signal.reason)
```

## m142

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m142-old) | [New code](#m142-new) | KILLED | [director-107] The helper rejects a work error |

### m142 Old

```text
reject(error);
```

### m142 New

```text
resolve(error);
```

## m143

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m143-old) | [New code](#m143-new) | KILLED | [director-107] The helper checks signal state at settlement |

### m143 Old

```text
signal.aborted ? reject(signal.reason) : resolve(value)
```

### m143 New

```text
resolve(value)
```

## m144

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m144-old) | [New code](#m144-new) | KILLED | [director-107] The helper cancels work that is not complete |

### m144 Old

```text
reject(signal.reason);
```

### m144 New

```text
resolve(signal.reason);
```

## m145

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m145-old) | [New code](#m145-new) | KILLED | [director-108] The preview reports exact totals and attribution |

### m145 Old

```text
n + a.bytes.length
```

### m145 New

```text
n
```

## m146

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m146-old) | [New code](#m146-new) | KILLED | [director-108] The preview uses the scene ID without a title |

### m146 Old

```text
scene.title || scene.id
```

### m146 New

```text
scene.title
```

## m147

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m147-old) | [New code](#m147-new) | KILLED | [director-109] The preview reports included bundle bytes |

### m147 Old

```text
assets.has(pack.source.path)
```

### m147 New

```text
false
```

## m148

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m148-old) | [New code](#m148-new) | KILLED | [director-109] The preview reports absent bundle bytes |

### m148 Old

```text
assets.has(pack.source.path)
```

### m148 New

```text
true
```

## m149

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m149-old) | [New code](#m149-new) | KILLED | [director-109] The preview reports a configured source |

### m149 Old

```text
sources.has(pack.source.adapter)
```

### m149 New

```text
false
```

## m150

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m150-old) | [New code](#m150-new) | KILLED | [director-109] The preview reports an unavailable source |

### m150 Old

```text
sources.has(pack.source.adapter)
```

### m150 New

```text
true
```

## m151

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m151-old) | [New code](#m151-new) | KILLED | [director-110] The preview lists distinct absent layers |

### m151 Old

```text
!layers.has(id)
```

### m151 New

```text
true
```

## m152

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m152-old) | [New code](#m152-new) | KILLED | [director-110] The preview detects applied shot packs |

### m152 Old

```text
s.appliedShotPacks?.length
```

### m152 New

```text
false
```

## m153

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m153-old) | [New code](#m153-new) | KILLED | [director-110] The preview detects a shot source pack ID |

### m153 Old

```text
s.shots.some((shot) => shot.sourcePackId)
```

### m153 New

```text
false
```

## m154

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m154-old) | [New code](#m154-new) | KILLED | [director-110] The preview detects no external content |

### m154 Old

```text
s.appliedShotPacks?.length || s.shots.some((shot) => shot.sourcePackId)
```

### m154 New

```text
true
```

## m155

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m155-old) | [New code](#m155-new) | KILLED | [director-080] The image accepts its bounds field |

### m155 Old

```text
? ['bounds', 'height', 'altitudeReference']
```

### m155 New

```text
? [ 'height', 'altitudeReference']
```

## m156

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m156-old) | [New code](#m156-new) | KILLED | [director-080] The image accepts its height field |

### m156 Old

```text
? ['bounds', 'height', 'altitudeReference']
```

### m156 New

```text
? ['bounds', 'altitudeReference']
```

## m157

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m157-old) | [New code](#m157-new) | KILLED | [director-080] The image accepts its altitudeReference field |

### m157 Old

```text
? ['bounds', 'height', 'altitudeReference']
```

### m157 New

```text
? ['bounds', 'height']
```

## m158

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m158-old) | [New code](#m158-new) | KILLED | [director-081] The media accepts its anchorId field |

### m158 Old

```text
? ['anchorId']
```

### m158 New

```text
? []
```

## m159

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m159-old) | [New code](#m159-new) | KILLED | [director-077] The geojson accepts its altitudeReference field |

### m159 Old

```text
: ['altitudeReference'],
```

### m159 New

```text
: [],
```

## m160

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m160-old) | [New code](#m160-new) | KILLED | [director-080] The image bounds 0 rejects low excess |

### m160 Old

```text
i % 2 ? -90 : -180
```

### m160 New

```text
i === 0 ? -181 : (i % 2 ? -90 : -180)
```

## m161

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m161-old) | [New code](#m161-new) | KILLED | [director-080] The image bounds 0 rejects high excess |

### m161 Old

```text
i % 2 ? 90 : 180
```

### m161 New

```text
i === 0 ? 181 : (i % 2 ? 90 : 180)
```

## m162

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m162-old) | [New code](#m162-new) | KILLED | [director-080] The image bounds 1 rejects low excess |

### m162 Old

```text
i % 2 ? -90 : -180
```

### m162 New

```text
i === 1 ? -91 : (i % 2 ? -90 : -180)
```

## m163

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m163-old) | [New code](#m163-new) | KILLED | [director-080] The image bounds 1 rejects high excess |

### m163 Old

```text
i % 2 ? 90 : 180
```

### m163 New

```text
i === 1 ? 91 : (i % 2 ? 90 : 180)
```

## m164

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m164-old) | [New code](#m164-new) | KILLED | [director-080] The image bounds 2 rejects low excess |

### m164 Old

```text
i % 2 ? -90 : -180
```

### m164 New

```text
i === 2 ? -181 : (i % 2 ? -90 : -180)
```

## m165

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m165-old) | [New code](#m165-new) | KILLED | [director-080] The image bounds 2 rejects high excess |

### m165 Old

```text
i % 2 ? 90 : 180
```

### m165 New

```text
i === 2 ? 181 : (i % 2 ? 90 : 180)
```

## m166

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m166-old) | [New code](#m166-new) | KILLED | [director-080] The image bounds 3 rejects low excess |

### m166 Old

```text
i % 2 ? -90 : -180
```

### m166 New

```text
i === 3 ? -91 : (i % 2 ? -90 : -180)
```

## m167

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m167-old) | [New code](#m167-new) | KILLED | [director-080] The image bounds 3 rejects high excess |

### m167 Old

```text
i % 2 ? 90 : 180
```

### m167 New

```text
i === 3 ? 91 : (i % 2 ? 90 : 180)
```

## m168

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m168-old) | [New code](#m168-new) | KILLED | [director-080] The image height checks both limits |

### m168 Old

```text
number(p.height, `${at}.height`, -12000, 1e9, false);
```

### m168 New

```text
number(p.height, `${at}.height`, -12000, 1e9 + 1, false);
```

## m169

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m169-old) | [New code](#m169-new) | KILLED | [director-082] The scene uses supplied anchors |

### m169 Old

```text
scene.anchors || []
```

### m169 New

```text
[]
```

## m170

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m170-old) | [New code](#m170-new) | KILLED | [director-082] The scene uses absent anchor defaults |

### m170 Old

```text
scene.anchors || []
```

### m170 New

```text
scene.anchors
```

## m171

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m171-old) | [New code](#m171-new) | KILLED | [director-085] The position accepts both geographic edges |

### m171 Old

```text
Math.abs(p[0]) > 180
```

### m171 New

```text
Math.abs(p[0]) >= 180
```

## m172

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m172-old) | [New code](#m172-new) | SURVIVED | No repository test fails. |

### m172 Old

```text
p.length === 3 &&
```

### m172 New

```text
true &&
```

## m173

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m173-old) | [New code](#m173-new) | KILLED | [director-088] The session state uses its idle default |

### m173 Old

```text
active?.status || 'idle'
```

### m173 New

```text
active?.status || 'bad'
```

## m174

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m174-old) | [New code](#m174-new) | KILLED | [director-088] The session state uses its zero default |

### m174 Old

```text
active?.handles.length || 0
```

### m174 New

```text
active?.handles.length || 1
```

## m175

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m175-old) | [New code](#m175-new) | KILLED | [director-089] The session state uses its active total |

### m175 Old

```text
active?.handles.length || 0
```

### m175 New

```text
0
```

## m176

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m176-old) | [New code](#m176-new) | KILLED | [director-093] The session uses its default byte budget |

### m176 Old

```text
pack.byteLength || PACK_LIMITS.bytes
```

### m176 New

```text
pack.byteLength || 1
```

## m177

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m177-old) | [New code](#m177-new) | KILLED | [director-093] The session accepts absent declared size |

### m177 Old

```text
pack.byteLength && bytes.length !== pack.byteLength
```

### m177 New

```text
bytes.length !== pack.byteLength
```

## m178

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m178-old) | [New code](#m178-new) | KILLED | [director-090] The session checks signal state without an event |

### m178 Old

```text
const superseded = active !== run || signal?.aborted || disposed;
```

### m178 New

```text
const superseded = active !== run || disposed;
```

## m179

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m179-old) | [New code](#m179-new) | KILLED | [director-090] The session checks destroyed state after signal access |

### m179 Old

```text
const superseded = active !== run || signal?.aborted || disposed;
```

### m179 New

```text
const superseded = active !== run || signal?.aborted;
```

## m180

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m180-old) | [New code](#m180-new) | KILLED | [director-090] The session checks replacement without signal state |

### m180 Old

```text
const superseded = active !== run || signal?.aborted || disposed;
```

### m180 New

```text
const superseded = signal?.aborted || disposed;
```

## m181

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m181-old) | [New code](#m181-new) | KILLED | [director-090] The session guard rejects a detached resource |

### m181 Old

```text
active !== run || controller.signal.aborted
```

### m181 New

```text
controller.signal.aborted
```

## m182

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m182-old) | [New code](#m182-new) | KILLED | [director-090] The session disposes the handle before it adds the handle to its list |

### m182 Old

```text
active !== run || controller.signal.aborted
```

### m182 New

```text
active !== run
```

## m183

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m183-old) | [New code](#m183-new) | KILLED | [director-092] The session settles a source error before its deadline |

### m183 Old

```text
if (!ended) {
          ended = true;
          reject(error);
```

### m183 New

```text
if (ended) {
          ended = true;
          reject(error);
```

## m184

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m184-old) | [New code](#m184-new) | KILLED | [director-097] The source rejects early cancellation |

### m184 Old

```text
    signal?.throwIfAborted();
    const response
```

### m184 New

```text
    const response
```

## m185

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m185-old) | [New code](#m185-new) | KILLED | [director-094] The directory accepts HTTP and HTTPS |

### m185 Old

```text
!['https:', 'http:'].includes(base.protocol)
```

### m185 New

```text
base.protocol !== 'https:'
```

## m186

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m186-old) | [New code](#m186-new) | KILLED | [director-098] The share character guard precedes byte conversion |

### m186 Old

```text
text.length > SHARE_LIMITS.bytes
```

### m186 New

```text
false
```

## m187

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m187-old) | [New code](#m187-new) | KILLED | [director-101] The export accepts scenes without data packs |

### m187 Old

```text
scene.dataPacks || []
```

### m187 New

```text
scene.dataPacks
```

## m188

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m188-old) | [New code](#m188-new) | KILLED | [director-101] The export keeps a supplied data pack list |

### m188 Old

```text
scene.dataPacks || []
```

### m188 New

```text
[]
```

## m189

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m189-old) | [New code](#m189-new) | KILLED | [director-102] The export accepts absent integrity fields |

### m189 Old

```text
pack.byteLength && pack.byteLength !== bytes.length
```

### m189 New

```text
pack.byteLength !== bytes.length
```

## m190

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m190-old) | [New code](#m190-new) | KILLED | [director-102] The export accepts an absent digest |

### m190 Old

```text
pack.sha256 && pack.sha256 !== sha256
```

### m190 New

```text
pack.sha256 !== sha256
```

## m191

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m191-old) | [New code](#m191-new) | KILLED | [director-103] The shared export accepts absent byte declarations |

### m191 Old

```text
pack.byteLength && pack.byteLength !== entry.byteLength
```

### m191 New

```text
pack.byteLength !== entry.byteLength
```

## m192

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m192-old) | [New code](#m192-new) | KILLED | [director-103] The shared export accepts an absent digest |

### m192 Old

```text
pack.sha256 && pack.sha256 !== entry.sha256
```

### m192 New

```text
pack.sha256 !== entry.sha256
```

## m193

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m193-old) | [New code](#m193-new) | KILLED | [director-099] The base64 accepts bytes without padding |

### m193 Old

```text
value.includes('=') && !/^[A-Za-z0-9+/]+={1,2}$/.test(value)
```

### m193 New

```text
!/^[A-Za-z0-9+/]+={1,2}$/.test(value)
```

## m194

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m194-old) | [New code](#m194-new) | KILLED | [director-108] The preview accepts absent data pack lists |

### m194 Old

```text
scene.dataPacks || []
```

### m194 New

```text
scene.dataPacks
```

## m195

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m195-old) | [New code](#m195-new) | KILLED | [director-108] The preview uses supplied data pack lists |

### m195 Old

```text
scene.dataPacks || []
```

### m195 New

```text
[]
```

## m196

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m196-old) | [New code](#m196-new) | KILLED | [director-108] The preview keeps a supplied scene title |

### m196 Old

```text
scene.title || scene.id
```

### m196 New

```text
scene.id
```

## m197

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m197-old) | [New code](#m197-new) | KILLED | [director-109] The preview distinguishes bundle sources |

### m197 Old

```text
pack.source.adapter === BUNDLE_SOURCE
```

### m197 New

```text
true
```

## m198

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m198-old) | [New code](#m198-new) | KILLED | [director-110] The preview accepts absent shot layers |

### m198 Old

```text
shot.layers || {}
```

### m198 New

```text
shot.layers
```

## m199

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m199-old) | [New code](#m199-new) | KILLED | [director-110] The preview uses supplied shot layers |

### m199 Old

```text
shot.layers || {}
```

### m199 New

```text
{}
```

## m200

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m200-old) | [New code](#m200-new) | KILLED | [director-105] The store checks its default byte budget |

### m200 Old

```text
source({ path, signal, maxBytes = PACK_LIMITS.bytes })
```

### m200 New

```text
source({ path, signal, maxBytes = PACK_LIMITS.bytes + 1 })
```

## m201

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m201-old) | [New code](#m201-new) | KILLED | [director-092] The absent renderer does not call its source |

### m201 Old

```text
!adapter
```

### m201 New

```text
false
```

## m202

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m202-old) | [New code](#m202-new) | KILLED | [director-099] The base64 rejects a custom text object |

### m202 Old

```text
typeof value !== 'string'
```

### m202 New

```text
false
```

## m203

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m203-old) | [New code](#m203-new) | KILLED | [director-103] The export key uses the registered source name |

### m203 Old

```text
[pack.source.adapter, pack.source.path]
```

### m203 New

```text
[pack.source.path]
```

## m204

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m204-old) | [New code](#m204-new) | KILLED | [director-103] The export key uses path |

### m204 Old

```text
[pack.source.adapter, pack.source.path]
```

### m204 New

```text
[pack.source.adapter]
```

## m205

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m205-old) | [New code](#m205-new) | KILLED | [director-110] The preview detects each layer key |

### m205 Old

```text
Object.keys(shot.layers || {})
```

### m205 New

```text
Object.keys(shot.layers || {}).filter(id=>id!=='ships')
```

## m206

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m206-old) | [New code](#m206-new) | KILLED | [director-108] The preview totals include every asset |

### m206 Old

```text
[...assets.values()].reduce((n, a) => n + a.bytes.length, 0)
```

### m206 New

```text
[...assets.values()].slice(0, 1).reduce((n, a) => n + a.bytes.length, 0)
```

## m207

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m207-old) | [New code](#m207-new) | KILLED | [director-095] The asset request sets its credentials option |

### m207 Old

```text
credentials: 'omit',
```

### m207 New

```text

```

## m208

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m208-old) | [New code](#m208-new) | KILLED | [director-095] The asset request sets its redirect option |

### m208 Old

```text
redirect: 'error',
```

### m208 New

```text

```

## m209

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m209-old) | [New code](#m209-new) | KILLED | [director-095] The asset request sets its referrerPolicy option |

### m209 Old

```text
referrerPolicy: 'no-referrer',
```

### m209 New

```text

```

## m210

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m210-old) | [New code](#m210-new) | KILLED | [director-095] The asset request sets its cache option |

### m210 Old

```text
cache: 'no-store',
```

### m210 New

```text

```

## m211

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m211-old) | [New code](#m211-new) | KILLED | [director-085] The position rejects field 0 that is not finite |

### m211 Old

```text
p.some((v) => !Number.isFinite(v))
```

### m211 New

```text
p.some((v,i) => i !== 0 && !Number.isFinite(v))
```

## m212

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m212-old) | [New code](#m212-new) | KILLED | [director-085] The position rejects field 1 that is not finite |

### m212 Old

```text
p.some((v) => !Number.isFinite(v))
```

### m212 New

```text
p.some((v,i) => i !== 1 && !Number.isFinite(v))
```

## m213

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m213-old) | [New code](#m213-new) | KILLED | [director-085] The position rejects field 2 that is not finite |

### m213 Old

```text
p.some((v) => !Number.isFinite(v))
```

### m213 New

```text
p.some((v,i) => i !== 2 && !Number.isFinite(v))
```

## m214

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m214-old) | [New code](#m214-new) | KILLED | [director-096] The source checks its default byte budget |

### m214 Old

```text
maxBytes = PACK_LIMITS.bytes
```

### m214 New

```text
maxBytes = PACK_LIMITS.bytes + 1
```

## m215

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m215-old) | [New code](#m215-new) | KILLED | [director-077] The manifest accepts the id field of a data pack |

### m215 Old

```text
'id',
```

### m215 New

```text

```

## m216

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m216-old) | [New code](#m216-new) | KILLED | [director-077] The manifest accepts the version field of a data pack |

### m216 Old

```text
'version',
```

### m216 New

```text

```

## m217

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m217-old) | [New code](#m217-new) | KILLED | [director-077] The manifest accepts the format field of a data pack |

### m217 Old

```text
'format',
```

### m217 New

```text

```

## m218

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m218-old) | [New code](#m218-new) | KILLED | [director-077] The manifest accepts the source field of a data pack |

### m218 Old

```text
'source',
```

### m218 New

```text

```

## m219

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m219-old) | [New code](#m219-new) | KILLED | [director-077] The manifest accepts the attribution field of a data pack |

### m219 Old

```text
'attribution',
```

### m219 New

```text

```

## m220

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m220-old) | [New code](#m220-new) | KILLED | [director-077] The manifest accepts the placement field of a data pack |

### m220 Old

```text
'placement',
```

### m220 New

```text

```

## m221

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m221-old) | [New code](#m221-new) | KILLED | [director-079] The manifest accepts the byteLength field of a data pack |

### m221 Old

```text
    'byteLength',
```

### m221 New

```text

```

## m222

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m222-old) | [New code](#m222-new) | KILLED | [director-079] The manifest accepts the sha256 field of a data pack |

### m222 Old

```text
    'sha256',
```

### m222 New

```text

```

## m223

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m223-old) | [New code](#m223-new) | KILLED | [director-077] The manifest accepts its source name field |

### m223 Old

```text
['adapter', 'path']
```

### m223 New

```text
['path']
```

## m224

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m224-old) | [New code](#m224-new) | KILLED | [director-077] The manifest accepts its source path field |

### m224 Old

```text
['adapter', 'path']
```

### m224 New

```text
['adapter']
```

## m225

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m225-old) | [New code](#m225-new) | KILLED | [director-078] The manifest accepts its attribution text field |

### m225 Old

```text
['text', 'license', 'url']
```

### m225 New

```text
['license', 'url']
```

## m226

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m226-old) | [New code](#m226-new) | KILLED | [director-078] The manifest accepts its attribution license field |

### m226 Old

```text
['text', 'license', 'url']
```

### m226 New

```text
['text', 'url']
```

## m227

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m227-old) | [New code](#m227-new) | KILLED | [director-078] The manifest accepts its attribution url field |

### m227 Old

```text
['text', 'license', 'url']
```

### m227 New

```text
['text', 'license']
```

## m228

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m228-old) | [New code](#m228-new) | KILLED | [director-100] The bundle checks its second asset reference |

### m228 Old

```text
for (const pack of packsOf(project))
```

### m228 New

```text
for (const pack of packsOf(project).slice(0,1))
```

## m229

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m229-old) | [New code](#m229-new) | KILLED | [director-100] The bundle checks its second asset digest |

### m229 Old

```text
for (const entry of input.assets)
```

### m229 New

```text
for (const entry of input.assets.slice(0,1))
```

## m230

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m230-old) | [New code](#m230-new) | KILLED | [director-103] The export accepts equal shared integrity |

### m230 Old

```text
pack.sha256 !== entry.sha256
```

### m230 New

```text
pack.sha256 === entry.sha256
```

## m231

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m231-old) | [New code](#m231-new) | KILLED | [director-102] The export rejects absent asset bytes |

### m231 Old

```text
bytes?.length || 0
```

### m231 New

```text
bytes.length || 0
```

## m232

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m232-old) | [New code](#m232-new) | KILLED | [director-092] The session settles an early internal signal |

### m232 Old

```text
if (signal.aborted) abort();
```

### m232 New

```text
if (false) abort();
```

## m233

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m233-old) | [New code](#m233-new) | KILLED | [director-081] The session gives anchors to its renderer |

### m233 Old

```text
(anchor) => anchor.id
```

### m233 New

```text
(anchor) => {throw new Error("wrong");}
```

## m234

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m234-old) | [New code](#m234-new) | KILLED | [director-106] The reader checks a signal after text access |

### m234 Old

```text
  checkAbort(options?.signal);
  return parseSceneShare
```

### m234 New

```text
  checkAbort(undefined);
  return parseSceneShare
```

## m235

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m235-old) | [New code](#m235-new) | KILLED | [director-102] The export checks its encoded text budget |

### m235 Old

```text
if (new TextEncoder().encode(text).length > SHARE_LIMITS.bytes)
```

### m235 New

```text
if (false)
```

## m236

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m236-old) | [New code](#m236-new) | KILLED | [director-102] The export keeps its total after an absent length |

### m236 Old

```text
bytes?.length || 0
```

### m236 New

```text
bytes?.length
```

## m237

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m237-old) | [New code](#m237-new) | KILLED | [director-089] The session state uses its active status |

### m237 Old

```text
active?.status || 'idle'
```

### m237 New

```text
'idle'
```

## m238

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m238-old) | [New code](#m238-new) | KILLED | [director-080] The placement selects the image fields |

### m238 Old

```text
pack.format === 'image'
      ?
```

### m238 New

```text
false
      ?
```

## m239

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m239-old) | [New code](#m239-new) | KILLED | [director-081] The placement selects the media fields |

### m239 Old

```text
pack.format === 'media'
        ?
```

### m239 New

```text
false
        ?
```

## m240

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m240-old) | [New code](#m240-new) | KILLED | [director-089] The session loads its geojson format |

### m240 Old

```text
adapterMap.get(pack.format)
```

### m240 New

```text
pack.format === 'geojson' ? null : adapterMap.get(pack.format)
```

## m241

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m241-old) | [New code](#m241-new) | KILLED | [director-089] The session loads its image format |

### m241 Old

```text
adapterMap.get(pack.format)
```

### m241 New

```text
pack.format === 'image' ? null : adapterMap.get(pack.format)
```

## m242

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m242-old) | [New code](#m242-new) | KILLED | [director-089] The session loads its media format |

### m242 Old

```text
adapterMap.get(pack.format)
```

### m242 New

```text
pack.format === 'media' ? null : adapterMap.get(pack.format)
```

## m243

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m243-old) | [New code](#m243-new) | KILLED | [director-097] The source stops between stream chunks |

### m243 Old

```text
for (;;) {
        signal?.throwIfAborted();
```

### m243 New

```text
for (;;) {
```

## m244

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m244-old) | [New code](#m244-new) | KILLED | [director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials |

### m244 Old

```text
seen.has(pack.id)
```

### m244 New

```text
false
```

## m245

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m245-old) | [New code](#m245-new) | KILLED | [director-080] The manifest checks given image bounds and media anchor references |

### m245 Old

```text
p.bounds[0] >= p.bounds[2]
```

### m245 New

```text
false
```

## m246

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m246-old) | [New code](#m246-new) | KILLED | [director-095 director-096 director-097] The directory source confines paths and rejects credentials, redirects, excess bytes and absent assets |

### m246 Old

```text
redirect: 'error'
```

### m246 New

```text
redirect: 'follow'
```

## m247

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m247-old) | [New code](#m247-new) | KILLED | [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints |

### m247 Old

```text
return { id, type: g.type, coordinates };
```

### m247 New

```text
return { id, type: g.type, coordinates, properties: feature.properties };
```

## m248

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m248-old) | [New code](#m248-new) | KILLED | [director-089] The data pack session removes resources and cancels the transport on Stop |

### m248 Old

```text
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
```

### m248 New

```text
run.handles.splice(0);
```

## m249

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m249-old) | [New code](#m249-new) | KILLED | [director-091] The data pack session replaces source work and ignores its late bytes |

### m249 Old

```text
if (superseded) return false;
```

### m249 New

```text
if (superseded) throw new Error("wrong");
```

## m250

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m250-old) | [New code](#m250-new) | KILLED | [director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement |

### m250 Old

```text
if (ended) late(value);
```

### m250 New

```text
if (ended) {}
```

## m251

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m251-old) | [New code](#m251-new) | KILLED | [director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result |

### m251 Old

```text
if (ended) late(value);
```

### m251 New

```text
if (ended) {}
```

## m252

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m252-old) | [New code](#m252-new) | KILLED | [director-092] The deadline stops a stalled renderer and a data pack error removes earlier resources |

### m252 Old

```text
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
```

### m252 New

```text
throw new Error("wrong");
```

## m253

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m253-old) | [New code](#m253-new) | KILLED | [director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited renderer names |

### m253 Old

```text
hex !== pack.sha256
```

### m253 New

```text
false
```

## m254

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m254-old) | [New code](#m254-new) | KILLED | [director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal |

### m254 Old

```text
await response.body?.cancel().catch(() => {});
```

### m254 New

```text

```

## m255

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m255-old) | [New code](#m255-new) | KILLED | [director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request |

### m255 Old

```text
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
```

### m255 New

```text
pack.source = { adapter: 'bad', path: entry.path };
```

## m256

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m256-old) | [New code](#m256-new) | KILLED | [director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity |

### m256 Old

```text
input.version !== 1
```

### m256 New

```text
false
```

## m257

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m257-old) | [New code](#m257-new) | KILLED | [director-102] The bundle checks asset limits and declared integrity before export |

### m257 Old

```text
bytes.length > PACK_LIMITS.bytes
```

### m257 New

```text
false
```

## m258

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m258-old) | [New code](#m258-new) | KILLED | [director-103] The data packs with the same path share one asset and reject integrity values that differ |

### m258 Old

```text
pack.byteLength !== entry.byteLength
```

### m258 New

```text
false
```

## m259

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m259-old) | [New code](#m259-new) | KILLED | [director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes |

### m259 Old

```text
sources.has(pack.source.adapter)
```

### m259 New

```text
true
```

## m260

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m260-old) | [New code](#m260-new) | KILLED | [director-104] The bundle byte store removes old data after replacement and uses no network source |

### m260 Old

```text
bytes: asset.bytes.slice()
```

### m260 New

```text
bytes: asset.bytes
```

## m261

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m261-old) | [New code](#m261-new) | KILLED | [director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file |

### m261 Old

```text
if (file.size > limit)
```

### m261 New

```text
if (false)
```

## m262

File: `src/director/sharing/lifetime.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m262-old) | [New code](#m262-new) | KILLED | [director-107] The cancelled bundle export stops before the next asset and returns no partial output |

### m262 Old

```text
reject(signal.reason);
```

### m262 New

```text
reject(new Error('wrong'));
```

## m263

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m263-old) | [New code](#m263-new) | KILLED | [director-101] The bundle accepts long valid source asset names |

### m263 Old

```text
.at(-1).slice(0, 160)
```

### m263 New

```text
.at(-1)
```

## m264

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m264-old) | [New code](#m264-new) | KILLED | [director-077] The manifest accepts geojson |

### m264 Old

```text
: ['altitudeReference'],
```

### m264 New

```text
: [],
```

## m265

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m265-old) | [New code](#m265-new) | KILLED | [director-077] The manifest accepts image |

### m265 Old

```text
pack.format === 'image'
      ?
```

### m265 New

```text
false
      ?
```

## m266

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m266-old) | [New code](#m266-new) | KILLED | [director-077] The manifest accepts media |

### m266 Old

```text
pack.format === 'media'
        ?
```

### m266 New

```text
false
        ?
```

## m267

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m267-old) | [New code](#m267-new) | KILLED | [director-080] The image rejects bounds field 0 |

### m267 Old

```text
i % 2 ? 90 : 180
```

### m267 New

```text
i === 0 ? 181 : (i % 2 ? 90 : 180)
```

## m268

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m268-old) | [New code](#m268-new) | KILLED | [director-080] The image rejects bounds field 1 |

### m268 Old

```text
i % 2 ? 90 : 180
```

### m268 New

```text
i === 1 ? 91 : (i % 2 ? 90 : 180)
```

## m269

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m269-old) | [New code](#m269-new) | KILLED | [director-080] The image rejects bounds field 2 |

### m269 Old

```text
i % 2 ? 90 : 180
```

### m269 New

```text
i === 2 ? 181 : (i % 2 ? 90 : 180)
```

## m270

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m270-old) | [New code](#m270-new) | KILLED | [director-080] The image rejects bounds field 3 |

### m270 Old

```text
i % 2 ? 90 : 180
```

### m270 New

```text
i === 3 ? 91 : (i % 2 ? 90 : 180)
```

## m271

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m271-old) | [New code](#m271-new) | KILLED | [director-092] The session uses its supplied deadline |

### m271 Old

```text
        timeoutMs,
```

### m271 New

```text
        15000,
```

## m272

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m272-old) | [New code](#m272-new) | KILLED | [director-092] The session uses its default deadline |

### m272 Old

```text
timeoutMs = 15000
```

### m272 New

```text
timeoutMs = 15001
```

## m273

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m273-old) | [New code](#m273-new) | KILLED | [director-092] The session removes resources after a later error |

### m273 Old

```text
if (active === run) clear();
        if (superseded)
```

### m273 New

```text
if (superseded)
```

## m274

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m274-old) | [New code](#m274-new) | KILLED | [director-099] The bundle accepts the application/json media type |

### m274 Old

```text
  'application/json',
```

### m274 New

```text

```

## m275

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m275-old) | [New code](#m275-new) | KILLED | [director-099] The bundle accepts the application/geo+json media type |

### m275 Old

```text
  'application/geo+json',
```

### m275 New

```text

```

## m276

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m276-old) | [New code](#m276-new) | KILLED | [director-099] The bundle accepts the image/png media type |

### m276 Old

```text
  'image/png',
```

### m276 New

```text

```

## m277

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m277-old) | [New code](#m277-new) | KILLED | [director-099] The bundle accepts the video/mp4 media type |

### m277 Old

```text
  'video/mp4',
```

### m277 New

```text

```

## m278

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m278-old) | [New code](#m278-new) | KILLED | [director-099] The bundle accepts the video/webm media type |

### m278 Old

```text
  'video/webm',
```

### m278 New

```text

```

## m279

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m279-old) | [New code](#m279-new) | KILLED | [director-099] The bundle accepts the audio/mpeg media type |

### m279 Old

```text
  'audio/mpeg',
```

### m279 New

```text

```

## m280

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m280-old) | [New code](#m280-new) | KILLED | [director-099] The bundle accepts the audio/ogg media type |

### m280 Old

```text
  'audio/ogg',
```

### m280 New

```text

```

## m281

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m281-old) | [New code](#m281-new) | KILLED | [director-099] The bundle accepts the audio/wav media type |

### m281 Old

```text
  'audio/wav',
```

### m281 New

```text

```

## m282

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m282-old) | [New code](#m282-new) | KILLED | [director-099] The bundle accepts the audio/webm media type |

### m282 Old

```text
  'audio/webm',
```

### m282 New

```text

```

## m283

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m283-old) | [New code](#m283-new) | KILLED | [director-089] The session rejects a falsy handle with inherited disposal |

### m283 Old

```text
!handle
```

### m283 New

```text
false
```

## m284

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m284-old) | [New code](#m284-new) | SURVIVED | No repository test fails. |

### m284 Old

```text
if (disposed || signal?.aborted) return false;
```

### m284 New

```text
if (signal?.aborted || disposed) return false;
```

## m285

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m285-old) | [New code](#m285-new) | KILLED | [director-083] The collection accepts its exact feature limit |

### m285 Old

```text
value.features.length > PACK_LIMITS.features
```

### m285 New

```text
value.features.length >= PACK_LIMITS.features
```

## m286

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m286-old) | [New code](#m286-new) | KILLED | [director-084] The feature ID accepts its exact text limit |

### m286 Old

```text
id.length > 256
```

### m286 New

```text
id.length >= 256
```

## m287

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m287-old) | [New code](#m287-new) | KILLED | [director-085] The position accepts its exact total limit |

### m287 Old

```text
++positions > PACK_LIMITS.positions
```

### m287 New

```text
++positions >= PACK_LIMITS.positions
```

## m288

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m288-old) | [New code](#m288-new) | KILLED | [director-087] The polygon accepts its exact ring limit |

### m288 Old

```text
g.coordinates.length <= 128
```

### m288 New

```text
g.coordinates.length < 128
```

## m289

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m289-old) | [New code](#m289-new) | KILLED | [director-076] The asset path checks its text limit |

### m289 Old

```text
string(value, path, 1024);
```

### m289 New

```text
string(value, path, 1025);
```

## m290

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m290-old) | [New code](#m290-new) | KILLED | [director-102] The export accepts its exact asset total |

### m290 Old

```text
assets.length >= SHARE_LIMITS.assets
```

### m290 New

```text
assets.length >= SHARE_LIMITS.assets - 1
```

## m291

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m291-old) | [New code](#m291-new) | KILLED | [director-089] The session keeps every data pack handle |

### m291 Old

```text
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
```

### m291 New

```text
for (const handle of run.handles.splice(0).reverse().slice(0,1)) handle.dispose();
```

## m292

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m292-old) | [New code](#m292-new) | KILLED | [director-095] The asset request sets its signal option |

### m292 Old

```text
      signal,
```

### m292 New

```text

```

## m293

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m293-old) | [New code](#m293-new) | KILLED | [director-096] The stream accepts its exact byte limit |

### m293 Old

```text
length > maxBytes
```

### m293 New

```text
length >= maxBytes
```

## m294

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m294-old) | [New code](#m294-new) | KILLED | [director-096] The stream accepts its exact byte limit |

### m294 Old

```text
Number(response.headers.get('content-length')) > maxBytes
```

### m294 New

```text
Number(response.headers.get('content-length')) >= maxBytes
```

## m295

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m295-old) | [New code](#m295-new) | KILLED | [director-092] The session rejects a falsy custom source |

### m295 Old

```text
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
```

### m295 New

```text
throw error;
```

## m296

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m296-old) | [New code](#m296-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m296 Old

```text
const copy = parseSceneDocument(stringifySceneDocument(project));
```

### m296 New

```text
const copy = project;
```

## m297

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m297-old) | [New code](#m297-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m297 Old

```text
pack.byteLength = entry.byteLength;
```

### m297 New

```text
pack.byteLength = 1;
```

## m298

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m298-old) | [New code](#m298-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m298 Old

```text
pack.sha256 = entry.sha256;
```

### m298 New

```text
pack.sha256 = '0'.repeat(64);
```

## m299

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m299-old) | [New code](#m299-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m299 Old

```text
base64: encode(bytes),
```

### m299 New

```text
base64: 'AAAA',
```

## m300

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m300-old) | [New code](#m300-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m300 Old

```text
assets: assets.map(({ byteLength, ...entry }) => entry),
```

### m300 New

```text
assets,
```

## m301

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m301-old) | [New code](#m301-new) | KILLED | [director-101] The export writes exact bundle metadata |

### m301 Old

```text
path: entry.path };
```

### m301 New

```text
path: 'other.json' };
```

## m302

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m302-old) | [New code](#m302-new) | KILLED | [director-105] The store returns an independent byte copy |

### m302 Old

```text
mimeType: asset.mimeType };
```

### m302 New

```text
mimeType: 'bad' };
```

## m303

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m303-old) | [New code](#m303-new) | KILLED | [director-079] The digest rejects 63 characters |

### m303 Old

```text
{64}
```

### m303 New

```text
{1,64}
```

## m304

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m304-old) | [New code](#m304-new) | KILLED | [director-079] The digest rejects 65 characters |

### m304 Old

```text
{64}
```

### m304 New

```text
{64,}
```

## m305

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m305-old) | [New code](#m305-new) | KILLED | [director-079] The digest rejects a prefix |

### m305 Old

```text
/^[a-f0-9]{64}$/
```

### m305 New

```text
/[a-f0-9]{64}$/
```

## m306

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m306-old) | [New code](#m306-new) | KILLED | [director-079] The digest rejects a suffix |

### m306 Old

```text
/^[a-f0-9]{64}$/
```

### m306 New

```text
/^[a-f0-9]{64}/
```

## m307

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m307-old) | [New code](#m307-new) | KILLED | [director-079] The digest rejects uppercase text |

### m307 Old

```text
[a-f0-9]
```

### m307 New

```text
[a-fA-F0-9]
```

## m308

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m308-old) | [New code](#m308-new) | KILLED | [director-080] The image rejects equal longitude edges |

### m308 Old

```text
p.bounds[0] >= p.bounds[2]
```

### m308 New

```text
p.bounds[0] > p.bounds[2]
```

## m309

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m309-old) | [New code](#m309-new) | KILLED | [director-080] The image rejects equal latitude edges |

### m309 Old

```text
p.bounds[1] >= p.bounds[3]
```

### m309 New

```text
p.bounds[1] > p.bounds[3]
```

## m310

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m310-old) | [New code](#m310-new) | KILLED | [director-080] The image accepts all geographic limits |

### m310 Old

```text
i % 2 ? -90 : -180
```

### m310 New

```text
i % 2 ? -89 : -180
```

## m311

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m311-old) | [New code](#m311-new) | KILLED | [director-080] The image accepts all geographic limits |

### m311 Old

```text
i % 2 ? -90 : -180
```

### m311 New

```text
i % 2 ? -90 : -179
```

## m312

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m312-old) | [New code](#m312-new) | KILLED | [director-080] The image accepts all geographic limits |

### m312 Old

```text
i % 2 ? 90 : 180
```

### m312 New

```text
i % 2 ? 89 : 180
```

## m313

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m313-old) | [New code](#m313-new) | KILLED | [director-080] The image accepts all geographic limits |

### m313 Old

```text
i % 2 ? 90 : 180
```

### m313 New

```text
i % 2 ? 90 : 179
```

## m314

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m314-old) | [New code](#m314-new) | KILLED | [director-082] The scene ignores a data pack list from its parent |

### m314 Old

```text
Object.hasOwn(scene, 'dataPacks')
```

### m314 New

```text
'dataPacks' in scene
```

## m315

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m315-old) | [New code](#m315-new) | KILLED | [director-080] The image rejects text for each geographic field |

### m315 Old

```text
          false,
```

### m315 New

```text
          true,
```

## m316

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m316-old) | [New code](#m316-new) | KILLED | [director-080] The image rejects text for each geographic field |

### m316 Old

```text
-12000, 1e9, false
```

### m316 New

```text
-12000, 1e9, true
```

## m317

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m317-old) | [New code](#m317-new) | KILLED | [director-078] The attribution accepts its text limits and rejects excess text |

### m317 Old

```text
string(pack.attribution.text, `${path}.attribution.text`, 4096)
```

### m317 New

```text
string(pack.attribution.text, `${path}.attribution.text`, 4095)
```

## m318

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m318-old) | [New code](#m318-new) | KILLED | [director-078] The attribution accepts its text limits and rejects excess text |

### m318 Old

```text
string(pack.attribution.license, `${path}.attribution.license`, 4096)
```

### m318 New

```text
string(pack.attribution.license, `${path}.attribution.license`, 4095)
```

## m319

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m319-old) | [New code](#m319-new) | KILLED | [director-078] The attribution accepts its text limits and rejects excess text |

### m319 Old

```text
string(url, at, 2048)
```

### m319 New

```text
string(url, at, 2047)
```

## m320

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m320-old) | [New code](#m320-new) | KILLED | [director-076] The asset path accepts 1024 characters and rejects 1025 |

### m320 Old

```text
string(value, path, 1024)
```

### m320 New

```text
string(value, path, 1023)
```

## m321

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m321-old) | [New code](#m321-new) | KILLED | [director-076] The asset path rejects URL syntax with a stable message |

### m321 Old

```text
.every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))
```

### m321 New

```text
.every(() => true)
```

## m322

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m322-old) | [New code](#m322-new) | KILLED | [director-088] The session accepts eight data packs |

### m322 Old

```text
packs.length > PACK_LIMITS.packs
```

### m322 New

```text
packs.length >= PACK_LIMITS.packs
```

## m323

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m323-old) | [New code](#m323-new) | KILLED | [director-093] The session accepts the asset byte limit |

### m323 Old

```text
bytes.length > PACK_LIMITS.bytes
```

### m323 New

```text
bytes.length >= PACK_LIMITS.bytes
```

## m324

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m324-old) | [New code](#m324-new) | KILLED | [director-093] The session accepts the total byte limit |

### m324 Old

```text
total > PACK_LIMITS.totalBytes
```

### m324 New

```text
total >= PACK_LIMITS.totalBytes
```

## m325

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m325-old) | [New code](#m325-new) | KILLED | [director-093] The source receives the path and the renderer receives the asset and signal |

### m325 Old

```text
path: pack.source.path,
```

### m325 New

```text
path: 'wrong',
```

## m326

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m326-old) | [New code](#m326-new) | KILLED | [director-093] The source receives the path and the renderer receives the asset and signal |

### m326 Old

```text
adapter({ pack, asset, anchors, signal: controller.signal })
```

### m326 New

```text
adapter({ pack, anchors, signal: controller.signal })
```

## m327

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m327-old) | [New code](#m327-new) | KILLED | [director-093] The source receives the path and the renderer receives the asset and signal |

### m327 Old

```text
adapter({ pack, asset, anchors, signal: controller.signal })
```

### m327 New

```text
adapter({ pack, asset, anchors })
```

## m328

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m328-old) | [New code](#m328-new) | KILLED | [director-089] The session removes its deadline after success |

### m328 Old

```text
        clearTimeout(run.timer);
```

### m328 New

```text
        /* timer */
```

## m329

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m329-old) | [New code](#m329-new) | KILLED | [director-089] The session removes its deadline after clear |

### m329 Old

```text

    clearTimeout(run.timer);
```

### m329 New

```text

    /* timer */
```

## m330

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m330-old) | [New code](#m330-new) | KILLED | [director-088] The session checks every declaration before the source call |

### m330 Old

```text
      packs.forEach((pack, i) =>
        validateDataPack(pack, `packs[${i}]`, anchorIds),
      );
```

### m330 New

```text

```

## m331

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m331-old) | [New code](#m331-new) | KILLED | [director-089] The session destroys each ready resource |

### m331 Old

```text
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
```

### m331 New

```text
for (const handle of []) handle.dispose();
```

## m332

File: `src/director/packs/session.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m332-old) | [New code](#m332-new) | KILLED | [director-088] The session checks every declaration before the source call |

### m332 Old

```text
      packs.forEach((pack, i) =>
        validateDataPack(pack, `packs[${i}]`, anchorIds),
      );
      if (disposed || signal?.aborted) return false;
      if (!packs.length) return true;
      const controller = new AbortController();
      const run = {
        controller,
        handles: [],
        status: 'loading',
        detach: () => signal?.removeEventListener('abort', cancel),
      };
      const cancel = () => {
        if (active === run) clear();
      };
      active = run;
      signal?.addEventListener('abort', cancel, { once: true });
      run.timer = setTimeout(
        () => controller.abort(new Error('Asset load timed out')),
        timeoutMs,
      );
      let total = 0;
      try {
        for (const pack of packs) {

```

### m332 New

```text

      if (disposed || signal?.aborted) return false;
      if (!packs.length) return true;
      const controller = new AbortController();
      const run = {
        controller,
        handles: [],
        status: 'loading',
        detach: () => signal?.removeEventListener('abort', cancel),
      };
      const cancel = () => {
        if (active === run) clear();
      };
      active = run;
      signal?.addEventListener('abort', cancel, { once: true });
      run.timer = setTimeout(
        () => controller.abort(new Error('Asset load timed out')),
        timeoutMs,
      );
      let total = 0;
      try {
        for (const [i, pack] of packs.entries()) {
          validateDataPack(pack, `packs[${i}]`, anchorIds);

```

## m333

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m333-old) | [New code](#m333-new) | KILLED | [director-083] The decoder rejects invalid UTF8 bytes |

### m333 Old

```text
{ fatal: true }
```

### m333 New

```text
{}
```

## m334

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m334-old) | [New code](#m334-new) | KILLED | [director-083] The decoder rejects null |

### m334 Old

```text
value?.type
```

### m334 New

```text
value.type
```

## m335

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m335-old) | [New code](#m335-new) | KILLED | [director-084] The decoder rejects a null feature |

### m335 Old

```text
feature?.id
```

### m335 New

```text
feature.id
```

## m336

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m336-old) | [New code](#m336-new) | KILLED | [director-084] The decoder rejects a null feature |

### m336 Old

```text
feature?.type
```

### m336 New

```text
feature.type
```

## m337

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m337-old) | [New code](#m337-new) | KILLED | [director-087] The decoder rejects absent geometry |

### m337 Old

```text
g?.type === 'Point'
```

### m337 New

```text
g.type === 'Point'
```

## m338

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m338-old) | [New code](#m338-new) | KILLED | [director-087] The decoder rejects absent geometry |

### m338 Old

```text
g?.type === 'LineString'
```

### m338 New

```text
g.type === 'LineString'
```

## m339

File: `src/director/packs/geojson.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m339-old) | [New code](#m339-new) | KILLED | [director-087] The decoder rejects absent geometry |

### m339 Old

```text
g?.type === 'Polygon'
```

### m339 New

```text
g.type === 'Polygon'
```

## m340

File: `src/director/packs/source.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m340-old) | [New code](#m340-new) | KILLED | [director-095] The directory source uses the default fetch function |

### m340 Old

```text
fetchImpl = globalThis.fetch
```

### m340 New

```text
fetchImpl = undefined
```

## m341

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m341-old) | [New code](#m341-new) | KILLED | [director-102] The export accepts the asset byte limit |

### m341 Old

```text
bytes.length > PACK_LIMITS.bytes
```

### m341 New

```text
bytes.length >= PACK_LIMITS.bytes
```

## m342

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m342-old) | [New code](#m342-new) | KILLED | [director-102] The export accepts the total byte limit and rejects one more byte |

### m342 Old

```text
total > PACK_LIMITS.totalBytes
```

### m342 New

```text
total >= PACK_LIMITS.totalBytes
```

## m343

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m343-old) | [New code](#m343-new) | KILLED | [director-099] The base64 accepts its length limit and rejects the next aligned length |

### m343 Old

```text
value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

### m343 New

```text
value.length >= Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

## m344

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m344-old) | [New code](#m344-new) | KILLED | [director-106] The reader accepts the project file limit and rejects one more byte |

### m344 Old

```text
file.size > limit
```

### m344 New

```text
file.size >= limit
```

## m345

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m345-old) | [New code](#m345-new) | KILLED | [director-106] The reader accepts the bundle file limit and rejects one more byte |

### m345 Old

```text
file.size > limit
```

### m345 New

```text
file.size >= limit
```

## m346

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m346-old) | [New code](#m346-new) | KILLED | [director-102] The export rejects an unsupported media type |

### m346 Old

```text
      checkMime(asset.mimeType);
```

### m346 New

```text

```

## m347

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m347-old) | [New code](#m347-new) | KILLED | [director-099] The import rejects 65 different asset paths |

### m347 Old

```text
array(input.assets, 'assets', SHARE_LIMITS.assets);
```

### m347 New

```text

```

## m348

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m348-old) | [New code](#m348-new) | KILLED | [director-099] The import accepts the total byte limit and rejects one more byte |

### m348 Old

```text

    checkBytes(bytes, total);
```

### m348 New

```text

```

## m349

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m349-old) | [New code](#m349-new) | KILLED | [director-099] The import accepts the total byte limit and rejects one more byte |

### m349 Old

```text
total > PACK_LIMITS.totalBytes
```

### m349 New

```text
total > PACK_LIMITS.totalBytes + 1
```

## m350

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m350-old) | [New code](#m350-new) | KILLED | [director-105] The store rejects a cancelled asset call |

### m350 Old

```text
      checkAbort(signal);
      validateAssetPath(path);
```

### m350 New

```text
      validateAssetPath(path);
```

## m351

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m351-old) | [New code](#m351-new) | KILLED | [director-107] The bundle stops import before an asset |

### m351 Old

```text
    checkAbort(signal);
    fields(entry
```

### m351 New

```text
    fields(entry
```

## m352

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m352-old) | [New code](#m352-new) | KILLED | [director-107] The bundle stops import after a digest |

### m352 Old

```text
    checkAbort(signal);
    if (entry.sha256
```

### m352 New

```text
    if (entry.sha256
```

## m353

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m353-old) | [New code](#m353-new) | KILLED | [director-107] The bundle stops export before an asset |

### m353 Old

```text
    checkAbort(signal);
    const key
```

### m353 New

```text
    const key
```

## m354

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m354-old) | [New code](#m354-new) | KILLED | [director-107] The bundle stops export after asset bytes |

### m354 Old

```text
      checkAbort(signal);
      if (!asset)
```

### m354 New

```text
      if (!asset)
```

## m355

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m355-old) | [New code](#m355-new) | KILLED | [director-107] The bundle stops export after a digest |

### m355 Old

```text
      checkAbort(signal);
      if (
        (pack.byteLength
```

### m355 New

```text
      if (
        (pack.byteLength
```

## m356

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m356-old) | [New code](#m356-new) | KILLED | [director-108] The preview counts shots apart from scenes |

### m356 Old

```text
project.scenes.reduce((n, s) => n + s.shots.length, 0)
```

### m356 New

```text
project.scenes.length
```

## m357

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m357-old) | [New code](#m357-new) | KILLED | [director-108] The preview counts shots apart from scenes |

### m357 Old

```text
n + s.shots.length
```

### m357 New

```text
n + 1
```

## m358

File: `src/director/sharing/preview.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m358-old) | [New code](#m358-new) | KILLED | [director-110] The preview lists distinct absent layers |

### m358 Old

```text
...new Set(
        project.scenes.flatMap((s) =>
          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),
        ),
      )
```

### m358 New

```text
...project.scenes.flatMap((s) => s.shots.flatMap((shot) => Object.keys(shot.layers || {})))
```

## m359

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m359-old) | [New code](#m359-new) | KILLED | [director-077] The manifest accepts 256 characters for its ID and rejects 257 |

### m359 Old

```text
string(pack.id, `${path}.id`)
```

### m359 New

```text
string(pack.id, `${path}.id`, 255)
```

## m360

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m360-old) | [New code](#m360-new) | KILLED | [director-077] The manifest accepts 256 characters for its ID and rejects 257 |

### m360 Old

```text
string(pack.id, `${path}.id`)
```

### m360 New

```text
string(pack.id, `${path}.id`, 257)
```

## m361

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m361-old) | [New code](#m361-new) | KILLED | [director-077] The manifest accepts 256 characters for its source name and rejects 257 |

### m361 Old

```text
string(pack.source.adapter, `${path}.source.adapter`)
```

### m361 New

```text
string(pack.source.adapter, `${path}.source.adapter`, 255)
```

## m362

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m362-old) | [New code](#m362-new) | KILLED | [director-077] The manifest accepts 256 characters for its source name and rejects 257 |

### m362 Old

```text
string(pack.source.adapter, `${path}.source.adapter`)
```

### m362 New

```text
string(pack.source.adapter, `${path}.source.adapter`, 257)
```

## m363

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m363-old) | [New code](#m363-new) | KILLED | [director-078] The attribution accepts its text limits and rejects excess text |

### m363 Old

```text
string(pack.attribution.text, `${path}.attribution.text`, 4096)
```

### m363 New

```text
string(pack.attribution.text, `${path}.attribution.text`, 4097)
```

## m364

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m364-old) | [New code](#m364-new) | KILLED | [director-078] The attribution accepts its text limits and rejects excess text |

### m364 Old

```text
string(pack.attribution.license, `${path}.attribution.license`, 4096)
```

### m364 New

```text
string(pack.attribution.license, `${path}.attribution.license`, 4097)
```

## m365

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m365-old) | [New code](#m365-new) | KILLED | [director-078] The attribution accepts its text limits and rejects excess text |

### m365 Old

```text
string(url, at, 2048)
```

### m365 New

```text
string(url, at, 2049)
```

## m366

File: `src/director/packs/manifest.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m366-old) | [New code](#m366-new) | KILLED | [director-076] The asset path accepts 1024 characters and rejects 1025 |

### m366 Old

```text
string(value, path, 1024)
```

### m366 New

```text
string(value, path, 1025)
```

## m367

File: `src/director/sharing/bundle.js`.

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m367-old) | [New code](#m367-new) | KILLED | [director-102] The export rejects excess asset total |

### m367 Old

```text
assets.length >= SHARE_LIMITS.assets
```

### m367 New

```text
assets.length > SHARE_LIMITS.assets
```

## Command output

```text
m001: KILLED [director-076] The asset path accepts safe names
m002: KILLED [director-076] The asset path rejects traversal
m003: KILLED [director-077] The manifest rejects invalid version
m004: KILLED [director-077] The manifest rejects invalid format
m005: KILLED [director-078] The attribution rejects protocol
m006: KILLED [director-078] The attribution rejects username
m007: KILLED [director-078] The attribution rejects password
m008: KILLED [director-078] The attribution rejects query
m009: KILLED [director-078] The attribution rejects fragment
m010: KILLED [director-078] The attribution rejects invalid URL text
m011: KILLED [director-078] The attribution accepts a safe link
m012: KILLED [director-078] The attribution rejects blank text
m013: KILLED [director-078] The attribution rejects blank license
m014: KILLED [director-079] The byte length rejects a fraction
m015: KILLED [director-079] The digest rejects invalid type
m016: KILLED [director-079] The digest rejects invalid alphabet
m017: KILLED [director-079] The integrity fields accept their limits
m018: KILLED [director-080] The image rejects reversed west
m019: KILLED [director-080] The image rejects reversed south
m020: KILLED [director-080] The image rejects short bounds
m021: KILLED [director-080] The image rejects height and reference
m022: KILLED [director-081] The media rejects an unknown anchor
m023: KILLED [director-082] The scene rejects duplicate data pack IDs
m024: KILLED [director-082] The shot rejects duplicate data pack IDs
m025: KILLED [director-082] The shot rejects unknown data pack IDs
m026: KILLED [director-082] The scene accepts absent data packs and anchors
m027: KILLED [director-083] The collection rejects invalid type
m028: KILLED [director-083] The collection rejects invalid array
m029: KILLED [director-083] The collection rejects more than 2000 features
m030: KILLED [director-084] The feature rejects type
m031: KILLED [director-084] The feature rejects ID type
m032: KILLED [director-084] The feature rejects blank ID
m033: KILLED [director-084] The feature rejects long ID
m034: KILLED [director-084] The feature rejects duplicate ID
m035: KILLED [director-085] The position rejects invalid array
m036: KILLED [director-085] The position rejects invalid length
m037: KILLED [director-085] The position rejects a coordinate that is not finite
m038: KILLED [director-085] The position rejects invalid longitude
m039: KILLED [director-085] The position rejects invalid latitude
m040: KILLED [director-085] The position rejects a height below the limit
m041: KILLED [director-085] The position rejects a height above the limit
m042: KILLED [director-085] The position total rejects excess
m043: KILLED [director-085] The position uses zero for absent height
m044: KILLED [director-085] The position keeps the height in the data
m045: KILLED [director-086] The line rejects invalid array
m046: KILLED [director-086] The line rejects invalid minimum
m047: KILLED [director-086] The ring needs four points
m048: KILLED [director-086] The line accepts two distinct endpoints
m049: KILLED [director-086] The ring rejects unclosed field 0
m050: KILLED [director-086] The ring rejects unclosed field 1
m051: KILLED [director-086] The ring rejects unclosed field 2
m052: KILLED [director-087] The geometry rejects invalid type
m053: KILLED [director-087] The geometry rejects invalid array
m054: KILLED [director-087] The geometry rejects an empty polygon
m055: KILLED [director-087] The geometry rejects more than 128 rings
m056: KILLED [director-087] The geometry returns a closed polygon
m057: KILLED [director-087] The geometry removes properties
m058: KILLED [director-088] The new session reports idle state
m059: KILLED [director-088] The session rejects a value that is not a data pack list
m060: KILLED [director-088] The session rejects more than eight data packs
m061: KILLED [director-088] The session rejects destroyed state
m062: KILLED [director-088] The session rejects cancelled state
m063: KILLED [director-089] The session disposes handles in reverse order
m064: KILLED [director-089] The session gives copied state
m065: KILLED [director-090] The cancelled session disposes late resources
m066: KILLED [director-090] The session accepts a null late handle
m067: KILLED [director-090] The session destroys work that is not complete
m068: KILLED [director-091] The replacement keeps its resources
m069: KILLED [director-092] The session reports a stable source error
m070: KILLED [director-092] The deadline rejects stalled work
m071: KILLED [director-092] The absent registered source stops after the validation size read
m072: KILLED [director-092] The absent renderer does not call its source
m073: KILLED [director-093] The session rejects bytes that are not a Uint8Array
m074: KILLED [director-093] The session rejects an empty asset
m075: KILLED [director-093] The session rejects an asset above the byte limit
m076: KILLED [director-093] The session rejects a wrong asset length
m077: KILLED [director-093] The session rejects bytes above the total limit
m078: KILLED [director-093] The session rejects a wrong digest
m079: KILLED [director-093] The session checks exact bytes and digest
m080: KILLED [director-089] The session rejects a falsy handle with inherited disposal
m081: KILLED [director-089] The session rejects a handle without a dispose function
m082: KILLED [director-094] The directory rejects protocol
m083: KILLED [director-094] The directory rejects username
m084: KILLED [director-094] The directory rejects password
m085: KILLED [director-094] The directory rejects query
m086: KILLED [director-094] The directory rejects fragment
m087: KILLED [director-094] The directory rejects an address with no final slash
m088: KILLED [director-095] The asset request sets its fixed options
m089: KILLED [director-096] The stream joins distinct chunks
m090: KILLED [director-096] The stream rejects excess header bytes
m091: KILLED [director-096] The stream rejects excess chunk bytes
m092: KILLED [director-096] The stream uses absent MIME default
m093: KILLED [director-096] The stream normalizes MIME text
m094: KILLED [director-097] The source rejects an absent stream
m095: KILLED [director-097] The source accepts failed body cancellation
m096: KILLED [director-097] The source rejects a failed response without a body
m097: KILLED [director-097] The stream releases its lock after an error
m098: KILLED [director-097] The source checks its signal between chunks
m099: KILLED [director-098] The share helpers reject nontext input
m100: KILLED [director-098] The share helpers reject invalid JSON
m101: KILLED [director-098] The share helpers accept plain project JSON
m102: KILLED [director-098] The share helpers reject excess characters
m103: KILLED [director-098] The share helpers reject excess UTF8 bytes
m104: KILLED [director-099] The base64 rejects a custom text object
m105: KILLED [director-099] The base64 rejects invalid empty
m106: KILLED [director-099] The base64 rejects invalid length
m107: KILLED [director-099] The base64 rejects invalid alignment
m108: KILLED [director-099] The base64 rejects invalid alphabet
m109: KILLED [director-099] The base64 rejects invalid padding
m110: KILLED [director-099] The bundle rejects duplicate paths
m111: KILLED [director-099] The bundle rejects unsupported MIME
m112: KILLED [director-099] The bundle rejects unsupported version
m113: KILLED [director-100] The bundle rejects an absent asset
m114: KILLED [director-100] The bundle rejects a wrong asset length
m115: KILLED [director-100] The bundle rejects a wrong asset digest
m116: KILLED [director-100] The bundle rejects wrong asset digest
m117: KILLED [director-100] The bundle rejects unused assets
m118: KILLED [director-100] The bundle rejects external data pack sources
m119: KILLED [director-101] The export writes exact bundle metadata
m120: KILLED [director-102] The export rejects bytes that are not a Uint8Array
m121: KILLED [director-102] The export rejects an empty asset
m122: KILLED [director-102] The export rejects an asset above the byte limit
m123: KILLED [director-102] The export rejects absent assets
m124: KILLED [director-102] The export rejects declared byte length
m125: KILLED [director-102] The export rejects declared digest
m126: KILLED [director-102] The export rejects excess total bytes
m127: KILLED [director-102] The export rejects excess asset total
m128: KILLED [director-103] The export reuses a shared asset
m129: KILLED [director-103] The export rejects shared byte length
m130: KILLED [director-103] The export rejects shared digest
m131: KILLED [director-104] The store copies the asset map
m132: KILLED [director-104] The store clears stored bytes
m133: KILLED [director-105] The store rejects absent bytes
m134: KILLED [director-105] The store rejects bytes above the caller limit
m135: KILLED [director-105] The store returns an independent byte copy
m136: KILLED [director-106] The reader accepts an absent filename
m137: KILLED [director-106] The reader rejects the ordinary file budget
m138: KILLED [director-106] The reader gives bundles the larger budget
m139: KILLED [director-107] The helper resolves without a signal
m140: KILLED [director-107] The helper rejects an early signal
m141: KILLED [director-107] The helper resolves with an active signal
m142: KILLED [director-107] The helper rejects a work error
m143: KILLED [director-107] The helper checks signal state at settlement
m144: KILLED [director-107] The helper cancels work that is not complete
m145: KILLED [director-108] The preview reports exact totals and attribution
m146: KILLED [director-108] The preview uses the scene ID without a title
m147: KILLED [director-109] The preview reports included bundle bytes
m148: KILLED [director-109] The preview reports absent bundle bytes
m149: KILLED [director-109] The preview reports a configured source
m150: KILLED [director-109] The preview reports an unavailable source
m151: KILLED [director-110] The preview lists distinct absent layers
m152: KILLED [director-110] The preview detects applied shot packs
m153: KILLED [director-110] The preview detects a shot source pack ID
m154: KILLED [director-110] The preview detects no external content
m155: KILLED [director-080] The image accepts its bounds field
m156: KILLED [director-080] The image accepts its height field
m157: KILLED [director-080] The image accepts its altitudeReference field
m158: KILLED [director-081] The media accepts its anchorId field
m159: KILLED [director-077] The geojson accepts its altitudeReference field
m160: KILLED [director-080] The image bounds 0 rejects low excess
m161: KILLED [director-080] The image bounds 0 rejects high excess
m162: KILLED [director-080] The image bounds 1 rejects low excess
m163: KILLED [director-080] The image bounds 1 rejects high excess
m164: KILLED [director-080] The image bounds 2 rejects low excess
m165: KILLED [director-080] The image bounds 2 rejects high excess
m166: KILLED [director-080] The image bounds 3 rejects low excess
m167: KILLED [director-080] The image bounds 3 rejects high excess
m168: KILLED [director-080] The image height checks both limits
m169: KILLED [director-082] The scene uses supplied anchors
m170: KILLED [director-082] The scene uses absent anchor defaults
m171: KILLED [director-085] The position accepts both geographic edges
m172: SURVIVED
m173: KILLED [director-088] The session state uses its idle default
m174: KILLED [director-088] The session state uses its zero default
m175: KILLED [director-089] The session state uses its active total
m176: KILLED [director-093] The session uses its default byte budget
m177: KILLED [director-093] The session accepts absent declared size
m178: KILLED [director-090] The session checks signal state without an event
m179: KILLED [director-090] The session checks destroyed state after signal access
m180: KILLED [director-090] The session checks replacement without signal state
m181: KILLED [director-090] The session guard rejects a detached resource
m182: KILLED [director-090] The session disposes the handle before it adds the handle to its list
m183: KILLED [director-092] The session settles a source error before its deadline
m184: KILLED [director-097] The source rejects early cancellation
m185: KILLED [director-094] The directory accepts HTTP and HTTPS
m186: KILLED [director-098] The share character guard precedes byte conversion
m187: KILLED [director-101] The export accepts scenes without data packs
m188: KILLED [director-101] The export keeps a supplied data pack list
m189: KILLED [director-102] The export accepts absent integrity fields
m190: KILLED [director-102] The export accepts an absent digest
m191: KILLED [director-103] The shared export accepts absent byte declarations
m192: KILLED [director-103] The shared export accepts an absent digest
m193: KILLED [director-099] The base64 accepts bytes without padding
m194: KILLED [director-108] The preview accepts absent data pack lists
m195: KILLED [director-108] The preview uses supplied data pack lists
m196: KILLED [director-108] The preview keeps a supplied scene title
m197: KILLED [director-109] The preview distinguishes bundle sources
m198: KILLED [director-110] The preview accepts absent shot layers
m199: KILLED [director-110] The preview uses supplied shot layers
m200: KILLED [director-105] The store checks its default byte budget
m201: KILLED [director-092] The absent renderer does not call its source
m202: KILLED [director-099] The base64 rejects a custom text object
m203: KILLED [director-103] The export key uses the registered source name
m204: KILLED [director-103] The export key uses path
m205: KILLED [director-110] The preview detects each layer key
m206: KILLED [director-108] The preview totals include every asset
m207: KILLED [director-095] The asset request sets its credentials option
m208: KILLED [director-095] The asset request sets its redirect option
m209: KILLED [director-095] The asset request sets its referrerPolicy option
m210: KILLED [director-095] The asset request sets its cache option
m211: KILLED [director-085] The position rejects field 0 that is not finite
m212: KILLED [director-085] The position rejects field 1 that is not finite
m213: KILLED [director-085] The position rejects field 2 that is not finite
m214: KILLED [director-096] The source checks its default byte budget
m215: KILLED [director-077] The manifest accepts the id field of a data pack
m216: KILLED [director-077] The manifest accepts the version field of a data pack
m217: KILLED [director-077] The manifest accepts the format field of a data pack
m218: KILLED [director-077] The manifest accepts the source field of a data pack
m219: KILLED [director-077] The manifest accepts the attribution field of a data pack
m220: KILLED [director-077] The manifest accepts the placement field of a data pack
m221: KILLED [director-079] The manifest accepts the byteLength field of a data pack
m222: KILLED [director-079] The manifest accepts the sha256 field of a data pack
m223: KILLED [director-077] The manifest accepts its source name field
m224: KILLED [director-077] The manifest accepts its source path field
m225: KILLED [director-078] The manifest accepts its attribution text field
m226: KILLED [director-078] The manifest accepts its attribution license field
m227: KILLED [director-078] The manifest accepts its attribution url field
m228: KILLED [director-100] The bundle checks its second asset reference
m229: KILLED [director-100] The bundle checks its second asset digest
m230: KILLED [director-103] The export accepts equal shared integrity
m231: KILLED [director-102] The export rejects absent asset bytes
m232: KILLED [director-092] The session settles an early internal signal
m233: KILLED [director-081] The session gives anchors to its renderer
m234: KILLED [director-106] The reader checks a signal after text access
m235: KILLED [director-102] The export checks its encoded text budget
m236: KILLED [director-102] The export keeps its total after an absent length
m237: KILLED [director-089] The session state uses its active status
m238: KILLED [director-080] The placement selects the image fields
m239: KILLED [director-081] The placement selects the media fields
m240: KILLED [director-089] The session loads its geojson format
m241: KILLED [director-089] The session loads its image format
m242: KILLED [director-089] The session loads its media format
m243: KILLED [director-097] The source stops between stream chunks
m244: KILLED [director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and cred
m245: KILLED [director-080] The manifest checks given image bounds and media anchor references
m246: KILLED [director-095 director-096 director-097] The directory source confines paths and rejects credentials
m247: KILLED [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
m248: KILLED [director-089] The data pack session removes resources and cancels the transport on Stop
m249: KILLED [director-091] The data pack session replaces source work and ignores its late bytes
m250: KILLED [director-090] The data pack session disposes late renderer resources after cancellation and keeps t
m251: KILLED [director-090] The data pack session disposes a renderer resource when its signal stops after the re
m252: KILLED [director-092] The deadline stops a stalled renderer and a data pack error removes earlier resources
m253: KILLED [director-093] The data pack session checks bytes and integrity before the renderer call and rejects
m254: KILLED [director-097] The directory source cancels response bodies and sends no asset request with a cancel
m255: KILLED [director-101] The selected scene bundle copies bytes and attribution and keeps the project without
m256: KILLED [director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent asset
m257: KILLED [director-102] The bundle checks asset limits and declared integrity before export
m258: KILLED [director-103] The data packs with the same path share one asset and reject integrity values that di
m259: KILLED [director-109] The preview reports unavailable sources, absent layers and absent bundle assets witho
m260: KILLED [director-104] The bundle byte store removes old data after replacement and uses no network source
m261: KILLED [director-106] The share helpers reject excess file bytes before text access and cancel a stalled pr
m262: KILLED [director-107] The cancelled bundle export stops before the next asset and returns no partial output
m263: KILLED [director-101] The bundle accepts long valid source asset names
m264: KILLED [director-077] The manifest accepts geojson
m265: KILLED [director-077] The manifest accepts image
m266: KILLED [director-077] The manifest accepts media
m267: KILLED [director-080] The image rejects bounds field 0
m268: KILLED [director-080] The image rejects bounds field 1
m269: KILLED [director-080] The image rejects bounds field 2
m270: KILLED [director-080] The image rejects bounds field 3
m271: KILLED [director-092] The session uses its supplied deadline
m272: KILLED [director-092] The session uses its default deadline
m273: KILLED [director-092] The session removes resources after a later error
m274: KILLED [director-099] The bundle accepts the application/json media type
m275: KILLED [director-099] The bundle accepts the application/geo+json media type
m276: KILLED [director-099] The bundle accepts the image/png media type
m277: KILLED [director-099] The bundle accepts the video/mp4 media type
m278: KILLED [director-099] The bundle accepts the video/webm media type
m279: KILLED [director-099] The bundle accepts the audio/mpeg media type
m280: KILLED [director-099] The bundle accepts the audio/ogg media type
m281: KILLED [director-099] The bundle accepts the audio/wav media type
m282: KILLED [director-099] The bundle accepts the audio/webm media type
m283: KILLED [director-089] The session rejects a falsy handle with inherited disposal
m284: SURVIVED
m285: KILLED [director-083] The collection accepts its exact feature limit
m286: KILLED [director-084] The feature ID accepts its exact text limit
m287: KILLED [director-085] The position accepts its exact total limit
m288: KILLED [director-087] The polygon accepts its exact ring limit
m289: KILLED [director-076] The asset path checks its text limit
m290: KILLED [director-102] The export accepts its exact asset total
m291: KILLED [director-089] The session keeps every data pack handle
m292: KILLED [director-095] The asset request sets its signal option
m293: KILLED [director-096] The stream accepts its exact byte limit
m294: KILLED [director-096] The stream accepts its exact byte limit
m295: KILLED [director-092] The session rejects a falsy custom source
m296: KILLED [director-101] The export writes exact bundle metadata
m297: KILLED [director-101] The export writes exact bundle metadata
m298: KILLED [director-101] The export writes exact bundle metadata
m299: KILLED [director-101] The export writes exact bundle metadata
m300: KILLED [director-101] The export writes exact bundle metadata
m301: KILLED [director-101] The export writes exact bundle metadata
m302: KILLED [director-105] The store returns an independent byte copy
m303: KILLED [director-079] The digest rejects 63 characters
m304: KILLED [director-079] The digest rejects 65 characters
m305: KILLED [director-079] The digest rejects a prefix
m306: KILLED [director-079] The digest rejects a suffix
m307: KILLED [director-079] The digest rejects uppercase text
m308: KILLED [director-080] The image rejects equal longitude edges
m309: KILLED [director-080] The image rejects equal latitude edges
m310: KILLED [director-080] The image accepts all geographic limits
m311: KILLED [director-080] The image accepts all geographic limits
m312: KILLED [director-080] The image accepts all geographic limits
m313: KILLED [director-080] The image accepts all geographic limits
m314: KILLED [director-082] The scene ignores a data pack list from its parent
m315: KILLED [director-080] The image rejects text for each geographic field
m316: KILLED [director-080] The image rejects text for each geographic field
m317: KILLED [director-078] The attribution accepts its text limits and rejects excess text
m318: KILLED [director-078] The attribution accepts its text limits and rejects excess text
m319: KILLED [director-078] The attribution accepts its text limits and rejects excess text
m320: KILLED [director-076] The asset path accepts 1024 characters and rejects 1025
m321: KILLED [director-076] The asset path rejects URL syntax with a stable message
m322: KILLED [director-088] The session accepts eight data packs
m323: KILLED [director-093] The session accepts the asset byte limit
m324: KILLED [director-093] The session accepts the total byte limit
m325: KILLED [director-093] The source receives the path and the renderer receives the asset and signal
m326: KILLED [director-093] The source receives the path and the renderer receives the asset and signal
m327: KILLED [director-093] The source receives the path and the renderer receives the asset and signal
m328: KILLED [director-089] The session removes its deadline after success
m329: KILLED [director-089] The session removes its deadline after clear
m330: KILLED [director-088] The session checks every declaration before the source call
m331: KILLED [director-089] The session destroys each ready resource
m332: KILLED [director-088] The session checks every declaration before the source call
m333: KILLED [director-083] The decoder rejects invalid UTF8 bytes
m334: KILLED [director-083] The decoder rejects null
m335: KILLED [director-084] The decoder rejects a null feature
m336: KILLED [director-084] The decoder rejects a null feature
m337: KILLED [director-087] The decoder rejects absent geometry
m338: KILLED [director-087] The decoder rejects absent geometry
m339: KILLED [director-087] The decoder rejects absent geometry
m340: KILLED [director-095] The directory source uses the default fetch function
m341: KILLED [director-102] The export accepts the asset byte limit
m342: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
m343: KILLED [director-099] The base64 accepts its length limit and rejects the next aligned length
m344: KILLED [director-106] The reader accepts the project file limit and rejects one more byte
m345: KILLED [director-106] The reader accepts the bundle file limit and rejects one more byte
m346: KILLED [director-102] The export rejects an unsupported media type
m347: KILLED [director-099] The import rejects 65 different asset paths
m348: KILLED [director-099] The import accepts the total byte limit and rejects one more byte
m349: KILLED [director-099] The import accepts the total byte limit and rejects one more byte
m350: KILLED [director-105] The store rejects a cancelled asset call
m351: KILLED [director-107] The bundle stops import before an asset
m352: KILLED [director-107] The bundle stops import after a digest
m353: KILLED [director-107] The bundle stops export before an asset
m354: KILLED [director-107] The bundle stops export after asset bytes
m355: KILLED [director-107] The bundle stops export after a digest
m356: KILLED [director-108] The preview counts shots apart from scenes
m357: KILLED [director-108] The preview counts shots apart from scenes
m358: KILLED [director-110] The preview lists distinct absent layers
m359: KILLED [director-077] The manifest accepts 256 characters for its ID and rejects 257
m360: KILLED [director-077] The manifest accepts 256 characters for its ID and rejects 257
m361: KILLED [director-077] The manifest accepts 256 characters for its source name and rejects 257
m362: KILLED [director-077] The manifest accepts 256 characters for its source name and rejects 257
m363: KILLED [director-078] The attribution accepts its text limits and rejects excess text
m364: KILLED [director-078] The attribution accepts its text limits and rejects excess text
m365: KILLED [director-078] The attribution accepts its text limits and rejects excess text
m366: KILLED [director-076] The asset path accepts 1024 characters and rejects 1025
m367: KILLED [director-102] The export rejects excess asset total
SURVIVORS: [('m172', 'SURVIVED'), ('m284', 'SURVIVED')]

```
