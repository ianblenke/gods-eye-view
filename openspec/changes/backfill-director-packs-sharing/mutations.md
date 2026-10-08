AAAA is a base64 text value.

# Mutation evidence

Base commit: `290b5d2`.

HTTP means Hypertext Transfer Protocol.
HTTPS means HTTP with a secure connection.
MIME means Multipurpose Internet Mail Extensions.

Pass 3 reads the output of the complete mutation command.
A killed mutation has a failed repository test.
Pass 3 had no failed repository test for m172 and m284.
Mutation m389 is equivalent for the public API of the module with standard built-in functions.
The getter and resolver probe is evidence/probe-export-parser.txt.

## Command

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/director-3 /home/ianblenke/docker/gev-tools/director-3/muts.json
```

## Results

The command below gives these totals.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass3-reconcile.py
```

```json
{
  "rows": 408,
  "results": {
    "KILLED": 405,
    "SURVIVED": 3
  },
  "survivors": [
    "m172",
    "m284",
    "m389"
  ]
}
```

## m001

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m001-old) | [New code](#m001-new) | KILLED | [Test record](#m001-test) |

### m001 Old

```js
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
```

### m001 New

```js
/^never$/
```

### m001 Test

```text
[director-076] The asset path accepts safe names
Output: KILLED [director-076] The asset path accepts safe names
```

## m002

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m002-old) | [New code](#m002-new) | KILLED | [Test record](#m002-test) |

### m002 Old

```js
.every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))
```

### m002 New

```js
.every(() => true)
```

### m002 Test

```text
[director-076] The asset path rejects traversal
Output: KILLED [director-076] The asset path rejects traversal
```

## m003

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m003-old) | [New code](#m003-new) | KILLED | [Test record](#m003-test) |

### m003 Old

```js
pack.version !== 1
```

### m003 New

```js
false
```

### m003 Test

```text
[director-077] The manifest rejects invalid version
Output: KILLED [director-077] The manifest rejects invalid version
```

## m004

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m004-old) | [New code](#m004-new) | KILLED | [Test record](#m004-test) |

### m004 Old

```js
!['geojson', 'image', 'media'].includes(pack.format)
```

### m004 New

```js
false
```

### m004 Test

```text
[director-077] The manifest rejects invalid format
Output: KILLED [director-077] The manifest rejects invalid format
```

## m005

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m005-old) | [New code](#m005-new) | KILLED | [Test record](#m005-test) |

### m005 Old

```js
parsed.protocol !== 'https:'
```

### m005 New

```js
false
```

### m005 Test

```text
[director-078] The attribution rejects protocol
Output: KILLED [director-078] The attribution rejects protocol
```

## m006

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m006-old) | [New code](#m006-new) | KILLED | [Test record](#m006-test) |

### m006 Old

```js
parsed.username
```

### m006 New

```js
false
```

### m006 Test

```text
[director-078] The attribution rejects username
Output: KILLED [director-078] The attribution rejects username
```

## m007

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m007-old) | [New code](#m007-new) | KILLED | [Test record](#m007-test) |

### m007 Old

```js
parsed.password
```

### m007 New

```js
false
```

### m007 Test

```text
[director-078] The attribution rejects password
Output: KILLED [director-078] The attribution rejects password
```

## m008

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m008-old) | [New code](#m008-new) | KILLED | [Test record](#m008-test) |

### m008 Old

```js
parsed.search
```

### m008 New

```js
false
```

### m008 Test

```text
[director-078] The attribution rejects query
Output: KILLED [director-078] The attribution rejects query
```

## m009

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m009-old) | [New code](#m009-new) | KILLED | [Test record](#m009-test) |

### m009 Old

```js
parsed.hash
```

### m009 New

```js
false
```

### m009 Test

```text
[director-078] The attribution rejects fragment
Output: KILLED [director-078] The attribution rejects fragment
```

## m010

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m010-old) | [New code](#m010-new) | KILLED | [Test record](#m010-test) |

### m010 Old

```js
fail(at, 'expected an HTTPS source link');
```

### m010 New

```js
return;
```

### m010 Test

```text
[director-078] The attribution rejects invalid URL text
Output: KILLED [director-078] The attribution rejects invalid URL text
```

## m011

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m011-old) | [New code](#m011-new) | KILLED | [Test record](#m011-test) |

### m011 Old

```js
parsed.protocol !== 'https:'
```

### m011 New

```js
parsed.protocol === 'https:'
```

### m011 Test

```text
[director-078] The attribution accepts a safe link
Output: KILLED [director-078] The attribution accepts a safe link
```

## m012

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m012-old) | [New code](#m012-new) | KILLED | [Test record](#m012-test) |

### m012 Old

```js
string(pack.attribution.text, `${path}.attribution.text`, 4096);
```

### m012 New

```js

```

### m012 Test

```text
[director-078] The attribution rejects blank text
Output: KILLED [director-078] The attribution rejects blank text
```

## m013

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m013-old) | [New code](#m013-new) | KILLED | [Test record](#m013-test) |

### m013 Old

```js
string(pack.attribution.license, `${path}.attribution.license`, 4096);
```

### m013 New

```js

```

### m013 Test

```text
[director-078] The attribution rejects blank license
Output: KILLED [director-078] The attribution rejects blank license
```

## m014

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m014-old) | [New code](#m014-new) | KILLED | [Test record](#m014-test) |

### m014 Old

```js
!Number.isInteger(v)
```

### m014 New

```js
false
```

### m014 Test

```text
[director-079] The byte length rejects a fraction
Output: KILLED [director-079] The byte length rejects a fraction
```

## m015

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m015-old) | [New code](#m015-new) | KILLED | [Test record](#m015-test) |

### m015 Old

```js
typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v)
```

### m015 New

```js
!/^[a-f0-9]{64}$/.test(v)
```

### m015 Test

```text
[director-079] The digest rejects invalid type
Output: KILLED [director-079] The digest rejects invalid type
```

## m016

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m016-old) | [New code](#m016-new) | KILLED | [Test record](#m016-test) |

### m016 Old

```js
typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v)
```

### m016 New

```js
typeof v !== 'string'
```

### m016 Test

```text
[director-079] The digest rejects invalid alphabet
Output: KILLED [director-079] The digest rejects invalid alphabet
```

## m017

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m017-old) | [New code](#m017-new) | KILLED | [Test record](#m017-test) |

### m017 Old

```js
number(v, at, 1, PACK_LIMITS.bytes, false);
```

### m017 New

```js
number(v, at, 0, PACK_LIMITS.bytes + 1, false);
```

### m017 Test

```text
[director-079] The integrity fields accept their limits
Output: KILLED [director-079] The integrity fields accept their limits
```

## m018

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m018-old) | [New code](#m018-new) | KILLED | [Test record](#m018-test) |

### m018 Old

```js
p.bounds[0] >= p.bounds[2]
```

### m018 New

```js
false
```

### m018 Test

```text
[director-080] The image rejects reversed west
Output: KILLED [director-080] The image rejects reversed west
```

## m019

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m019-old) | [New code](#m019-new) | KILLED | [Test record](#m019-test) |

### m019 Old

```js
p.bounds[1] >= p.bounds[3]
```

### m019 New

```js
false
```

### m019 Test

```text
[director-080] The image rejects reversed south
Output: KILLED [director-080] The image rejects reversed south
```

## m020

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m020-old) | [New code](#m020-new) | KILLED | [Test record](#m020-test) |

### m020 Old

```js
p.bounds.length !== 4
```

### m020 New

```js
false
```

### m020 Test

```text
[director-080] The image rejects short bounds
Output: KILLED [director-080] The image rejects short bounds
```

## m021

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m021-old) | [New code](#m021-new) | KILLED | [Test record](#m021-test) |

### m021 Old

```js
p.altitudeReference !== 'ellipsoid'
```

### m021 New

```js
false
```

### m021 Test

```text
[director-080] The image rejects height and reference
Output: KILLED [director-080] The image rejects height and reference
```

## m022

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m022-old) | [New code](#m022-new) | KILLED | [Test record](#m022-test) |

### m022 Old

```js
!anchorIds.has(p.anchorId)
```

### m022 New

```js
false
```

### m022 Test

```text
[director-081] The media rejects an unknown anchor
Output: KILLED [director-081] The media rejects an unknown anchor
```

## m023

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m023-old) | [New code](#m023-new) | KILLED | [Test record](#m023-test) |

### m023 Old

```js
seen.has(pack.id)
```

### m023 New

```js
false
```

### m023 Test

```text
[director-082] The scene rejects duplicate data pack IDs
Output: KILLED [director-082] The scene rejects duplicate data pack IDs
```

## m024

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m024-old) | [New code](#m024-new) | KILLED | [Test record](#m024-test) |

### m024 Old

```js
new Set(ids).size !== ids.length
```

### m024 New

```js
false
```

### m024 Test

```text
[director-082] The shot rejects duplicate data pack IDs
Output: KILLED [director-082] The shot rejects duplicate data pack IDs
```

## m025

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m025-old) | [New code](#m025-new) | KILLED | [Test record](#m025-test) |

### m025 Old

```js
ids.some((id) => !seen.has(id))
```

### m025 New

```js
false
```

### m025 Test

```text
[director-082] The shot rejects unknown data pack IDs
Output: KILLED [director-082] The shot rejects unknown data pack IDs
```

## m026

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m026-old) | [New code](#m026-new) | KILLED | [Test record](#m026-test) |

### m026 Old

```js
Object.hasOwn(scene, 'dataPacks') ? scene.dataPacks : []
```

### m026 New

```js
scene.dataPacks
```

### m026 Test

```text
[director-082] The scene accepts absent data packs and anchors
Output: KILLED [director-082] The scene accepts absent data packs and anchors
```

## m027

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m027-old) | [New code](#m027-new) | KILLED | [Test record](#m027-test) |

### m027 Old

```js
value?.type !== 'FeatureCollection'
```

### m027 New

```js
false
```

### m027 Test

```text
[director-083] The collection rejects invalid type
Output: KILLED [director-083] The collection rejects invalid type
```

## m028

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m028-old) | [New code](#m028-new) | KILLED | [Test record](#m028-test) |

### m028 Old

```js
!Array.isArray(value.features)
```

### m028 New

```js
false
```

### m028 Test

```text
[director-083] The collection rejects invalid array
Output: KILLED [director-083] The collection rejects invalid array
```

## m029

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m029-old) | [New code](#m029-new) | KILLED | [Test record](#m029-test) |

### m029 Old

```js
value.features.length > PACK_LIMITS.features
```

### m029 New

```js
false
```

### m029 Test

```text
[director-083] The collection rejects more than 2000 features
Output: KILLED [director-083] The collection rejects more than 2000 features
```

## m030

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m030-old) | [New code](#m030-new) | KILLED | [Test record](#m030-test) |

### m030 Old

```js
feature?.type !== 'Feature'
```

### m030 New

```js
false
```

### m030 Test

```text
[director-084] The feature rejects type
Output: KILLED [director-084] The feature rejects type
```

## m031

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m031-old) | [New code](#m031-new) | KILLED | [Test record](#m031-test) |

### m031 Old

```js
typeof id !== 'string'
```

### m031 New

```js
false
```

### m031 Test

```text
[director-084] The feature rejects ID type
Output: KILLED [director-084] The feature rejects ID type
```

## m032

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m032-old) | [New code](#m032-new) | KILLED | [Test record](#m032-test) |

### m032 Old

```js
!id.trim()
```

### m032 New

```js
false
```

### m032 Test

```text
[director-084] The feature rejects blank ID
Output: KILLED [director-084] The feature rejects blank ID
```

## m033

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m033-old) | [New code](#m033-new) | KILLED | [Test record](#m033-test) |

### m033 Old

```js
id.length > 256
```

### m033 New

```js
false
```

### m033 Test

```text
[director-084] The feature rejects long ID
Output: KILLED [director-084] The feature rejects long ID
```

## m034

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m034-old) | [New code](#m034-new) | KILLED | [Test record](#m034-test) |

### m034 Old

```js
ids.has(id)
```

### m034 New

```js
false
```

### m034 Test

```text
[director-084] The feature rejects duplicate ID
Output: KILLED [director-084] The feature rejects duplicate ID
```

## m035

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m035-old) | [New code](#m035-new) | KILLED | [Test record](#m035-test) |

### m035 Old

```js
!Array.isArray(p)
```

### m035 New

```js
false
```

### m035 Test

```text
[director-085] The position rejects invalid array
Output: KILLED [director-085] The position rejects invalid array
```

## m036

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m036-old) | [New code](#m036-new) | KILLED | [Test record](#m036-test) |

### m036 Old

```js
![2, 3].includes(p.length)
```

### m036 New

```js
false
```

### m036 Test

```text
[director-085] The position rejects invalid length
Output: KILLED [director-085] The position rejects invalid length
```

## m037

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m037-old) | [New code](#m037-new) | KILLED | [Test record](#m037-test) |

### m037 Old

```js
p.some((v) => !Number.isFinite(v))
```

### m037 New

```js
false
```

### m037 Test

```text
[director-085] The position rejects a coordinate that is not finite
Output: KILLED [director-085] The position rejects a coordinate that is not finite
```

## m038

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m038-old) | [New code](#m038-new) | KILLED | [Test record](#m038-test) |

### m038 Old

```js
Math.abs(p[0]) > 180
```

### m038 New

```js
false
```

### m038 Test

```text
[director-085] The position rejects invalid longitude
Output: KILLED [director-085] The position rejects invalid longitude
```

## m039

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m039-old) | [New code](#m039-new) | KILLED | [Test record](#m039-test) |

### m039 Old

```js
Math.abs(p[1]) > 90
```

### m039 New

```js
false
```

### m039 Test

```text
[director-085] The position rejects invalid latitude
Output: KILLED [director-085] The position rejects invalid latitude
```

## m040

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m040-old) | [New code](#m040-new) | KILLED | [Test record](#m040-test) |

### m040 Old

```js
p[2] < -12000
```

### m040 New

```js
false
```

### m040 Test

```text
[director-085] The position rejects a height below the limit
Output: KILLED [director-085] The position rejects a height below the limit
```

## m041

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m041-old) | [New code](#m041-new) | KILLED | [Test record](#m041-test) |

### m041 Old

```js
p[2] > 1e9
```

### m041 New

```js
false
```

### m041 Test

```text
[director-085] The position rejects a height above the limit
Output: KILLED [director-085] The position rejects a height above the limit
```

## m042

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m042-old) | [New code](#m042-new) | KILLED | [Test record](#m042-test) |

### m042 Old

```js
++positions > PACK_LIMITS.positions
```

### m042 New

```js
false
```

### m042 Test

```text
[director-085] The position total rejects excess
Output: KILLED [director-085] The position total rejects excess
```

## m043

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m043-old) | [New code](#m043-new) | KILLED | [Test record](#m043-test) |

### m043 Old

```js
p[2] ?? 0
```

### m043 New

```js
p[2] ?? 1
```

### m043 Test

```text
[director-085] The position uses zero for absent height
Output: KILLED [director-085] The position uses zero for absent height
```

## m044

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m044-old) | [New code](#m044-new) | KILLED | [Test record](#m044-test) |

### m044 Old

```js
p[2] ?? 0
```

### m044 New

```js
0
```

### m044 Test

```text
[director-085] The position keeps the height in the data
Output: KILLED [director-085] The position keeps the height in the data
```

## m045

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m045-old) | [New code](#m045-new) | KILLED | [Test record](#m045-test) |

### m045 Old

```js
!Array.isArray(points)
```

### m045 New

```js
false
```

### m045 Test

```text
[director-086] The line rejects invalid array
Output: KILLED [director-086] The line rejects invalid array
```

## m046

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m046-old) | [New code](#m046-new) | KILLED | [Test record](#m046-test) |

### m046 Old

```js
points.length < (ring ? 4 : 2)
```

### m046 New

```js
false
```

### m046 Test

```text
[director-086] The line rejects invalid minimum
Output: KILLED [director-086] The line rejects invalid minimum
```

## m047

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m047-old) | [New code](#m047-new) | KILLED | [Test record](#m047-test) |

### m047 Old

```js
ring ? 4 : 2
```

### m047 New

```js
2
```

### m047 Test

```text
[director-086] The ring needs four points
Output: KILLED [director-086] The ring needs four points
```

## m048

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m048-old) | [New code](#m048-new) | KILLED | [Test record](#m048-test) |

### m048 Old

```js
ring && normalized[0].some
```

### m048 New

```js
normalized[0].some
```

### m048 Test

```text
[director-086] The line accepts two distinct endpoints
Output: KILLED [director-086] The line accepts two distinct endpoints
```

## m049

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m049-old) | [New code](#m049-new) | KILLED | [Test record](#m049-test) |

### m049 Old

```js
v !== normalized.at(-1)[i]
```

### m049 New

```js
i !== 0 && v !== normalized.at(-1)[i]
```

### m049 Test

```text
[director-086] The ring rejects unclosed field 0
Output: KILLED [director-086] The ring rejects unclosed field 0
```

## m050

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m050-old) | [New code](#m050-new) | KILLED | [Test record](#m050-test) |

### m050 Old

```js
v !== normalized.at(-1)[i]
```

### m050 New

```js
i !== 1 && v !== normalized.at(-1)[i]
```

### m050 Test

```text
[director-086] The ring rejects unclosed field 1
Output: KILLED [director-086] The ring rejects unclosed field 1
```

## m051

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m051-old) | [New code](#m051-new) | KILLED | [Test record](#m051-test) |

### m051 Old

```js
v !== normalized.at(-1)[i]
```

### m051 New

```js
i !== 2 && v !== normalized.at(-1)[i]
```

### m051 Test

```text
[director-086] The ring rejects unclosed field 2
Output: KILLED [director-086] The ring rejects unclosed field 2
```

## m052

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m052-old) | [New code](#m052-new) | KILLED | [Test record](#m052-test) |

### m052 Old

```js
g?.type === 'Polygon'
```

### m052 New

```js
true
```

### m052 Test

```text
[director-087] The geometry rejects invalid type
Output: KILLED [director-087] The geometry rejects invalid type
```

## m053

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m053-old) | [New code](#m053-new) | KILLED | [Test record](#m053-test) |

### m053 Old

```js
Array.isArray(g.coordinates)
```

### m053 New

```js
true
```

### m053 Test

```text
[director-087] The geometry rejects invalid array
Output: KILLED [director-087] The geometry rejects invalid array
```

## m054

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m054-old) | [New code](#m054-new) | KILLED | [Test record](#m054-test) |

### m054 Old

```js
g.coordinates.length &&
```

### m054 New

```js
true &&
```

### m054 Test

```text
[director-087] The geometry rejects an empty polygon
Output: KILLED [director-087] The geometry rejects an empty polygon
```

## m055

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m055-old) | [New code](#m055-new) | KILLED | [Test record](#m055-test) |

### m055 Old

```js
g.coordinates.length <= 128
```

### m055 New

```js
true
```

### m055 Test

```text
[director-087] The geometry rejects more than 128 rings
Output: KILLED [director-087] The geometry rejects more than 128 rings
```

## m056

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m056-old) | [New code](#m056-new) | KILLED | [Test record](#m056-test) |

### m056 Old

```js
coordinates = g.coordinates.map((ring) => line(ring, true));
```

### m056 New

```js
coordinates = [];
```

### m056 Test

```text
[director-087] The geometry returns a closed polygon
Output: KILLED [director-087] The geometry returns a closed polygon
```

## m057

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m057-old) | [New code](#m057-new) | KILLED | [Test record](#m057-test) |

### m057 Old

```js
return { id, type: g.type, coordinates };
```

### m057 New

```js
return { ...feature, id, type: g.type, coordinates };
```

### m057 Test

```text
[director-087] The geometry removes properties
Output: KILLED [director-087] The geometry removes properties
```

## m058

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m058-old) | [New code](#m058-new) | KILLED | [Test record](#m058-test) |

### m058 Old

```js
if (!packs.length) return true;
```

### m058 New

```js
if (!packs.length) return false;
```

### m058 Test

```text
[director-088] The new session reports idle state
Output: KILLED [director-088] The new session reports idle state
```

## m059

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m059-old) | [New code](#m059-new) | KILLED | [Test record](#m059-test) |

### m059 Old

```js
!Array.isArray(packs)
```

### m059 New

```js
false
```

### m059 Test

```text
[director-088] The session rejects a value that is not a data pack list
Output: KILLED [director-088] The session rejects a value that is not a data pack list
```

## m060

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m060-old) | [New code](#m060-new) | KILLED | [Test record](#m060-test) |

### m060 Old

```js
packs.length > PACK_LIMITS.packs
```

### m060 New

```js
false
```

### m060 Test

```text
[director-088] The session rejects more than eight data packs
Output: KILLED [director-088] The session rejects more than eight data packs
```

## m061

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m061-old) | [New code](#m061-new) | KILLED | [Test record](#m061-test) |

### m061 Old

```js
disposed || signal?.aborted
```

### m061 New

```js
signal?.aborted
```

### m061 Test

```text
[director-088] The session rejects destroyed state
Output: KILLED [director-088] The session rejects destroyed state
```

## m062

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m062-old) | [New code](#m062-new) | KILLED | [Test record](#m062-test) |

### m062 Old

```js
disposed || signal?.aborted
```

### m062 New

```js
disposed
```

### m062 Test

```text
[director-088] The session rejects cancelled state
Output: KILLED [director-088] The session rejects cancelled state
```

## m063

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m063-old) | [New code](#m063-new) | KILLED | [Test record](#m063-test) |

### m063 Old

```js
run.handles.splice(0).reverse()
```

### m063 New

```js
run.handles.splice(0)
```

### m063 Test

```text
[director-089] The session disposes handles in reverse order
Output: KILLED [director-089] The session disposes handles in reverse order
```

## m064

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m064-old) | [New code](#m064-new) | KILLED | [Test record](#m064-test) |

### m064 Old

```js
run.status = 'ready';
```

### m064 New

```js
run.status = 'bad';
```

### m064 Test

```text
[director-089] The session gives copied state
Output: KILLED [director-089] The session gives copied state
```

## m065

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m065-old) | [New code](#m065-new) | KILLED | [Test record](#m065-test) |

### m065 Old

```js
if (ended) late(value);
```

### m065 New

```js
if (ended) {}
```

### m065 Test

```text
[director-090] The cancelled session disposes late resources
Output: KILLED [director-090] The cancelled session disposes late resources
```

## m066

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m066-old) | [New code](#m066-new) | KILLED | [Test record](#m066-test) |

### m066 Old

```js
(late) => late?.dispose()
```

### m066 New

```js
(late) => late.dispose()
```

### m066 Test

```text
[director-090] The session accepts a null late handle
Output: KILLED [director-090] The session accepts a null late handle
```

## m067

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m067-old) | [New code](#m067-new) | KILLED | [Test record](#m067-test) |

### m067 Old

```js
if (superseded) return false;
```

### m067 New

```js
if (superseded) throw new Error("bad");
```

### m067 Test

```text
[director-090] The session destroys work that is not complete
Output: KILLED [director-090] The session destroys work that is not complete
```

## m068

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m068-old) | [New code](#m068-new) | KILLED | [Test record](#m068-test) |

### m068 Old

```js
if (active === run) clear();
        if (superseded)
```

### m068 New

```js
clear();
        if (superseded)
```

### m068 Test

```text
[director-091] The replacement keeps its resources
Output: KILLED [director-091] The replacement keeps its resources
```

## m069

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m069-old) | [New code](#m069-new) | KILLED | [Test record](#m069-test) |

### m069 Old

```js
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
```

### m069 New

```js
throw error;
```

### m069 Test

```text
[director-092] The session reports a stable source error
Output: KILLED [director-092] The session reports a stable source error
```

## m070

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m070-old) | [New code](#m070-new) | KILLED | [Test record](#m070-test) |

### m070 Old

```js
if (superseded) return false;
```

### m070 New

```js
return false;
```

### m070 Test

```text
[director-092] The deadline rejects stalled work
Output: KILLED [director-092] The deadline rejects stalled work
```

## m071

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m071-old) | [New code](#m071-new) | KILLED | [Test record](#m071-test) |

### m071 Old

```js
!source
```

### m071 New

```js
false
```

### m071 Test

```text
[director-092] The data pack session reads the byteLength field once without a registered source
Output: KILLED [director-092] The data pack session reads the byteLength field once without a registered source
```

## m072

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m072-old) | [New code](#m072-new) | KILLED | [Test record](#m072-test) |

### m072 Old

```js
!adapter
```

### m072 New

```js
false
```

### m072 Test

```text
[director-092] The absent renderer does not call its source
Output: KILLED [director-092] The absent renderer does not call its source
```

## m073

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m073-old) | [New code](#m073-new) | KILLED | [Test record](#m073-test) |

### m073 Old

```js
!(bytes instanceof Uint8Array)
```

### m073 New

```js
false
```

### m073 Test

```text
[director-093] The session rejects bytes that are not a Uint8Array
Output: KILLED [director-093] The session rejects bytes that are not a Uint8Array
```

## m074

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m074-old) | [New code](#m074-new) | KILLED | [Test record](#m074-test) |

### m074 Old

```js
!bytes.length
```

### m074 New

```js
false
```

### m074 Test

```text
[director-093] The session rejects an empty asset
Output: KILLED [director-093] The session rejects an empty asset
```

## m075

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m075-old) | [New code](#m075-new) | KILLED | [Test record](#m075-test) |

### m075 Old

```js
bytes.length > PACK_LIMITS.bytes
```

### m075 New

```js
false
```

### m075 Test

```text
[director-093] The session rejects an asset above the byte limit
Output: KILLED [director-093] The session rejects an asset above the byte limit
```

## m076

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m076-old) | [New code](#m076-new) | KILLED | [Test record](#m076-test) |

### m076 Old

```js
pack.byteLength && bytes.length !== pack.byteLength
```

### m076 New

```js
false
```

### m076 Test

```text
[director-093] The session rejects a wrong byteLength field
Output: KILLED [director-093] The session rejects a wrong byteLength field
```

## m077

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m077-old) | [New code](#m077-new) | KILLED | [Test record](#m077-test) |

### m077 Old

```js
total > PACK_LIMITS.totalBytes
```

### m077 New

```js
false
```

### m077 Test

```text
[director-093] The session rejects bytes above the total limit
Output: KILLED [director-093] The session rejects bytes above the total limit
```

## m078

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m078-old) | [New code](#m078-new) | KILLED | [Test record](#m078-test) |

### m078 Old

```js
hex !== pack.sha256
```

### m078 New

```js
false
```

### m078 Test

```text
[director-093] The session rejects a wrong digest
Output: KILLED [director-093] The session rejects a wrong digest
```

## m079

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m079-old) | [New code](#m079-new) | KILLED | [Test record](#m079-test) |

### m079 Old

```js
maxBytes: pack.byteLength || PACK_LIMITS.bytes
```

### m079 New

```js
maxBytes: PACK_LIMITS.bytes
```

### m079 Test

```text
[director-093] The session checks exact bytes and digest
Output: KILLED [director-093] The session checks exact bytes and digest
```

## m080

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m080-old) | [New code](#m080-new) | KILLED | [Test record](#m080-test) |

### m080 Old

```js
!handle
```

### m080 New

```js
false
```

### m080 Test

```text
[director-089] The session rejects a falsy handle with inherited disposal
Output: KILLED [director-089] The session rejects a falsy handle with inherited disposal
```

## m081

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m081-old) | [New code](#m081-new) | KILLED | [Test record](#m081-test) |

### m081 Old

```js
typeof handle.dispose !== 'function'
```

### m081 New

```js
false
```

### m081 Test

```text
[director-089] The session rejects a handle without a dispose function
Output: KILLED [director-089] The session rejects a handle without a dispose function
```

## m082

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m082-old) | [New code](#m082-new) | KILLED | [Test record](#m082-test) |

### m082 Old

```js
!['https:', 'http:'].includes(base.protocol)
```

### m082 New

```js
false
```

### m082 Test

```text
[director-094] The directory rejects protocol
Output: KILLED [director-094] The directory rejects protocol
```

## m083

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m083-old) | [New code](#m083-new) | KILLED | [Test record](#m083-test) |

### m083 Old

```js
base.username
```

### m083 New

```js
false
```

### m083 Test

```text
[director-094] The directory rejects username
Output: KILLED [director-094] The directory rejects username
```

## m084

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m084-old) | [New code](#m084-new) | KILLED | [Test record](#m084-test) |

### m084 Old

```js
base.password
```

### m084 New

```js
false
```

### m084 Test

```text
[director-094] The directory rejects password
Output: KILLED [director-094] The directory rejects password
```

## m085

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m085-old) | [New code](#m085-new) | KILLED | [Test record](#m085-test) |

### m085 Old

```js
base.search
```

### m085 New

```js
false
```

### m085 Test

```text
[director-094] The directory rejects query
Output: KILLED [director-094] The directory rejects query
```

## m086

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m086-old) | [New code](#m086-new) | KILLED | [Test record](#m086-test) |

### m086 Old

```js
base.hash
```

### m086 New

```js
false
```

### m086 Test

```text
[director-094] The directory rejects fragment
Output: KILLED [director-094] The directory rejects fragment
```

## m087

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m087-old) | [New code](#m087-new) | KILLED | [Test record](#m087-test) |

### m087 Old

```js
!base.pathname.endsWith('/')
```

### m087 New

```js
false
```

### m087 Test

```text
[director-094] The directory rejects an address with no final slash
Output: KILLED [director-094] The directory rejects an address with no final slash
```

## m088

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m088-old) | [New code](#m088-new) | KILLED | [Test record](#m088-test) |

### m088 Old

```js
cache: 'no-store'
```

### m088 New

```js
cache: 'default'
```

### m088 Test

```text
[director-095] The asset request sets its fixed options
Output: KILLED [director-095] The asset request sets its fixed options
```

## m089

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m089-old) | [New code](#m089-new) | KILLED | [Test record](#m089-test) |

### m089 Old

```js
offset += chunk.byteLength;
```

### m089 New

```js
offset = 0;
```

### m089 Test

```text
[director-096] The stream joins distinct chunks
Output: KILLED [director-096] The stream joins distinct chunks
```

## m090

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m090-old) | [New code](#m090-new) | KILLED | [Test record](#m090-test) |

### m090 Old

```js
Number(response.headers.get('content-length')) > maxBytes
```

### m090 New

```js
false
```

### m090 Test

```text
[director-096] The stream rejects excess header bytes
Output: KILLED [director-096] The stream rejects excess header bytes
```

## m091

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m091-old) | [New code](#m091-new) | KILLED | [Test record](#m091-test) |

### m091 Old

```js
length > maxBytes
```

### m091 New

```js
false
```

### m091 Test

```text
[director-096] The stream rejects excess chunk bytes
Output: KILLED [director-096] The stream rejects excess chunk bytes
```

## m092

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m092-old) | [New code](#m092-new) | KILLED | [Test record](#m092-test) |

### m092 Old

```js
response.headers.get('content-type') || ''
```

### m092 New

```js
response.headers.get('content-type') || 'bad'
```

### m092 Test

```text
[director-096] The stream uses absent MIME default
Output: KILLED [director-096] The stream uses absent MIME default
```

## m093

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m093-old) | [New code](#m093-new) | KILLED | [Test record](#m093-test) |

### m093 Old

```js
.toLowerCase()
```

### m093 New

```js

```

### m093 Test

```text
[director-096] The stream normalizes MIME text
Output: KILLED [director-096] The stream normalizes MIME text
```

## m094

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m094-old) | [New code](#m094-new) | KILLED | [Test record](#m094-test) |

### m094 Old

```js
if (!reader) throw new Error('Asset stream unavailable');
```

### m094 New

```js
if (!reader) return {};
```

### m094 Test

```text
[director-097] The source rejects an absent stream
Output: KILLED [director-097] The source rejects an absent stream
```

## m095

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m095-old) | [New code](#m095-new) | KILLED | [Test record](#m095-test) |

### m095 Old

```js
response.body?.cancel().catch(() => {})
```

### m095 New

```js
response.body?.cancel()
```

### m095 Test

```text
[director-097] The source accepts failed body cancellation
Output: KILLED [director-097] The source accepts failed body cancellation
```

## m096

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m096-old) | [New code](#m096-new) | KILLED | [Test record](#m096-test) |

### m096 Old

```js
response.body?.cancel()
```

### m096 New

```js
response.body.cancel()
```

### m096 Test

```text
[director-097] The source rejects a failed response without a body
Output: KILLED [director-097] The source rejects a failed response without a body
```

## m097

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m097-old) | [New code](#m097-new) | KILLED | [Test record](#m097-test) |

### m097 Old

```js
await reader.cancel().catch(() => {});
```

### m097 New

```js
await reader.cancel();
```

### m097 Test

```text
[director-097] The stream releases its lock after an error
Output: KILLED [director-097] The stream releases its lock after an error
```

## m098

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m098-old) | [New code](#m098-new) | KILLED | [Test record](#m098-test) |

### m098 Old

```js
for (;;) {
        signal?.throwIfAborted();
```

### m098 New

```js
for (;;) {
        throw new Error('wrong');
```

### m098 Test

```text
[director-097] The source checks its signal between chunks
Output: KILLED [director-097] The source checks its signal between chunks
```

## m099

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m099-old) | [New code](#m099-new) | KILLED | [Test record](#m099-test) |

### m099 Old

```js
typeof text !== 'string'
```

### m099 New

```js
false
```

### m099 Test

```text
[director-098] The bundle helpers reject nontext input
Output: KILLED [director-098] The bundle helpers reject nontext input
```

## m100

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m100-old) | [New code](#m100-new) | KILLED | [Test record](#m100-test) |

### m100 Old

```js
fail('$', 'invalid JSON');
```

### m100 New

```js
throw new Error('wrong');
```

### m100 Test

```text
[director-098] The bundle helpers reject invalid JSON
Output: KILLED [director-098] The bundle helpers reject invalid JSON
```

## m101

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m101-old) | [New code](#m101-new) | KILLED | [Test record](#m101-test) |

### m101 Old

```js
if (input?.format !== 'gev-scene-bundle')
```

### m101 New

```js
if (false)
```

### m101 Test

```text
[director-098] The bundle helpers accept plain project JSON
Output: KILLED [director-098] The bundle helpers accept plain project JSON
```

## m102

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m102-old) | [New code](#m102-new) | KILLED | [Test record](#m102-test) |

### m102 Old

```js
text.length > SHARE_LIMITS.bytes
```

### m102 New

```js
false
```

### m102 Test

```text
[director-098] The bundle helpers reject excess characters
Output: KILLED [director-098] The bundle helpers reject excess characters
```

## m103

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m103-old) | [New code](#m103-new) | KILLED | [Test record](#m103-test) |

### m103 Old

```js
    new TextEncoder().encode(text).length > SHARE_LIMITS.bytes
```

### m103 New

```js
    false
```

### m103 Test

```text
[director-098] The bundle helpers reject excess UTF8 bytes
Output: KILLED [director-098] The bundle helpers reject excess UTF8 bytes
```

## m104

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m104-old) | [New code](#m104-new) | KILLED | [Test record](#m104-test) |

### m104 Old

```js
typeof value !== 'string'
```

### m104 New

```js
false
```

### m104 Test

```text
[director-099] The base64 rejects a custom text object
Output: KILLED [director-099] The base64 rejects a custom text object
```

## m105

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m105-old) | [New code](#m105-new) | KILLED | [Test record](#m105-test) |

### m105 Old

```js
!value.length
```

### m105 New

```js
false
```

### m105 Test

```text
[director-099] The base64 rejects invalid empty
Output: KILLED [director-099] The base64 rejects invalid empty
```

## m106

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m106-old) | [New code](#m106-new) | KILLED | [Test record](#m106-test) |

### m106 Old

```js
value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

### m106 New

```js
false
```

### m106 Test

```text
[director-099] The base64 rejects invalid length
Output: KILLED [director-099] The base64 rejects invalid length
```

## m107

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m107-old) | [New code](#m107-new) | KILLED | [Test record](#m107-test) |

### m107 Old

```js
value.length % 4 !== 0
```

### m107 New

```js
false
```

### m107 Test

```text
[director-099] The base64 rejects invalid alignment
Output: KILLED [director-099] The base64 rejects invalid alignment
```

## m108

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m108-old) | [New code](#m108-new) | KILLED | [Test record](#m108-test) |

### m108 Old

```js
/[^A-Za-z0-9+/=]/.test(value)
```

### m108 New

```js
false
```

### m108 Test

```text
[director-099] The base64 rejects invalid alphabet
Output: KILLED [director-099] The base64 rejects invalid alphabet
```

## m109

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m109-old) | [New code](#m109-new) | KILLED | [Test record](#m109-test) |

### m109 Old

```js
!/^[A-Za-z0-9+/]+={1,2}$/.test(value)
```

### m109 New

```js
false
```

### m109 Test

```text
[director-099] The base64 rejects invalid padding
Output: KILLED [director-099] The base64 rejects invalid padding
```

## m110

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m110-old) | [New code](#m110-new) | KILLED | [Test record](#m110-test) |

### m110 Old

```js
assets.has(entry.path)
```

### m110 New

```js
false
```

### m110 Test

```text
[director-099] The bundle rejects duplicate paths
Output: KILLED [director-099] The bundle rejects duplicate paths
```

## m111

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m111-old) | [New code](#m111-new) | KILLED | [Test record](#m111-test) |

### m111 Old

```js
!MIME.has(mimeType)
```

### m111 New

```js
false
```

### m111 Test

```text
[director-099] The bundle rejects unsupported MIME
Output: KILLED [director-099] The bundle rejects unsupported MIME
```

## m112

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m112-old) | [New code](#m112-new) | KILLED | [Test record](#m112-test) |

### m112 Old

```js
input.version !== 1
```

### m112 New

```js
false
```

### m112 Test

```text
[director-099] The bundle rejects unsupported version
Output: KILLED [director-099] The bundle rejects unsupported version
```

## m113

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m113-old) | [New code](#m113-new) | KILLED | [Test record](#m113-test) |

### m113 Old

```js
      !asset ||
```

### m113 New

```js
      false ||
```

### m113 Test

```text
[director-100] The bundle rejects an absent asset
Output: KILLED [director-100] The bundle rejects an absent asset
```

## m114

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m114-old) | [New code](#m114-new) | KILLED | [Test record](#m114-test) |

### m114 Old

```js
pack.byteLength !== asset.bytes.length
```

### m114 New

```js
false
```

### m114 Test

```text
[director-100] The bundle rejects a wrong byteLength field
Output: KILLED [director-100] The bundle rejects a wrong byteLength field
```

## m115

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m115-old) | [New code](#m115-new) | KILLED | [Test record](#m115-test) |

### m115 Old

```js
pack.sha256 !== asset.sha256
```

### m115 New

```js
false
```

### m115 Test

```text
[director-100] The bundle rejects a pack digest that differs from its asset
Output: KILLED [director-100] The bundle rejects a pack digest that differs from its asset
```

## m116

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m116-old) | [New code](#m116-new) | KILLED | [Test record](#m116-test) |

### m116 Old

```js
entry.sha256 !== hash
```

### m116 New

```js
false
```

### m116 Test

```text
[director-100] The bundle rejects an asset digest that differs from its bytes
Output: KILLED [director-100] The bundle rejects an asset digest that differs from its bytes
```

## m117

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m117-old) | [New code](#m117-new) | KILLED | [Test record](#m117-test) |

### m117 Old

```js
used.size !== assets.size
```

### m117 New

```js
false
```

### m117 Test

```text
[director-100] The bundle rejects unused assets
Output: KILLED [director-100] The bundle rejects unused assets
```

## m118

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m118-old) | [New code](#m118-new) | KILLED | [Test record](#m118-test) |

### m118 Old

```js
pack.source.adapter !== BUNDLE_SOURCE
```

### m118 New

```js
false
```

### m118 Test

```text
[director-100] The bundle rejects external data pack sources
Output: KILLED [director-100] The bundle rejects external data pack sources
```

## m119

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m119-old) | [New code](#m119-new) | KILLED | [Test record](#m119-test) |

### m119 Old

```js
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
```

### m119 New

```js
pack.source = { adapter: 'bad', path: entry.path };
```

### m119 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m120

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m120-old) | [New code](#m120-new) | KILLED | [Test record](#m120-test) |

### m120 Old

```js
!(bytes instanceof Uint8Array)
```

### m120 New

```js
false
```

### m120 Test

```text
[director-102] The export rejects bytes that are not a Uint8Array
Output: KILLED [director-102] The export rejects bytes that are not a Uint8Array
```

## m121

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m121-old) | [New code](#m121-new) | KILLED | [Test record](#m121-test) |

### m121 Old

```js
!bytes.length
```

### m121 New

```js
false
```

### m121 Test

```text
[director-102] The export rejects an empty asset
Output: KILLED [director-102] The export rejects an empty asset
```

## m122

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m122-old) | [New code](#m122-new) | KILLED | [Test record](#m122-test) |

### m122 Old

```js
bytes.length > PACK_LIMITS.bytes
```

### m122 New

```js
false
```

### m122 Test

```text
[director-102] The export rejects an asset above the byte limit
Output: KILLED [director-102] The export rejects an asset above the byte limit
```

## m123

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m123-old) | [New code](#m123-new) | KILLED | [Test record](#m123-test) |

### m123 Old

```js
if (!asset) fail('assets', 'select a file for every declared data pack');
```

### m123 New

```js
if (!asset) return null;
```

### m123 Test

```text
[director-102] The export rejects absent assets
Output: KILLED [director-102] The export rejects absent assets
```

## m124

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m124-old) | [New code](#m124-new) | KILLED | [Test record](#m124-test) |

### m124 Old

```js
pack.byteLength !== bytes.length
```

### m124 New

```js
false
```

### m124 Test

```text
[director-102] The export rejects declared byte length
Output: KILLED [director-102] The export rejects declared byte length
```

## m125

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m125-old) | [New code](#m125-new) | KILLED | [Test record](#m125-test) |

### m125 Old

```js
pack.sha256 !== sha256
```

### m125 New

```js
false
```

### m125 Test

```text
[director-102] The export rejects declared digest
Output: KILLED [director-102] The export rejects declared digest
```

## m126

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m126-old) | [New code](#m126-new) | KILLED | [Test record](#m126-test) |

### m126 Old

```js
total > PACK_LIMITS.totalBytes
```

### m126 New

```js
false
```

### m126 Test

```text
[director-102] The export accepts the total byte limit and rejects one more byte
Output: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
```

## m127

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m127-old) | [New code](#m127-new) | KILLED | [Test record](#m127-test) |

### m127 Old

```js
assets.length >= SHARE_LIMITS.assets
```

### m127 New

```js
false
```

### m127 Test

```text
[director-102] The export rejects excess asset total
Output: KILLED [director-102] The export rejects excess asset total
```

## m128

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m128-old) | [New code](#m128-new) | KILLED | [Test record](#m128-test) |

### m128 Old

```js
let entry = known.get(key);
```

### m128 New

```js
let entry = null;
```

### m128 Test

```text
[director-103] The export reuses a shared asset
Output: KILLED [director-103] The export reuses a shared asset
```

## m129

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m129-old) | [New code](#m129-new) | KILLED | [Test record](#m129-test) |

### m129 Old

```js
pack.byteLength !== entry.byteLength
```

### m129 New

```js
false
```

### m129 Test

```text
[director-103] The export rejects shared byte length
Output: KILLED [director-103] The export rejects shared byte length
```

## m130

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m130-old) | [New code](#m130-new) | KILLED | [Test record](#m130-test) |

### m130 Old

```js
pack.sha256 !== entry.sha256
```

### m130 New

```js
false
```

### m130 Test

```text
[director-103] The export rejects shared digest
Output: KILLED [director-103] The export rejects shared digest
```

## m131

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m131-old) | [New code](#m131-new) | KILLED | [Test record](#m131-test) |

### m131 Old

```js
assets = new Map(next);
```

### m131 New

```js
assets = next;
```

### m131 Test

```text
[director-104] The store copies the asset map
Output: KILLED [director-104] The store copies the asset map
```

## m132

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m132-old) | [New code](#m132-new) | KILLED | [Test record](#m132-test) |

### m132 Old

```js
assets.clear();
```

### m132 New

```js

```

### m132 Test

```text
[director-104] The store clears stored bytes
Output: KILLED [director-104] The store clears stored bytes
```

## m133

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m133-old) | [New code](#m133-new) | KILLED | [Test record](#m133-test) |

### m133 Old

```js
!asset || asset.bytes.length > maxBytes
```

### m133 New

```js
asset.bytes.length > maxBytes
```

### m133 Test

```text
[director-105] The store rejects absent bytes
Output: KILLED [director-105] The store rejects absent bytes
```

## m134

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m134-old) | [New code](#m134-new) | KILLED | [Test record](#m134-test) |

### m134 Old

```js
asset.bytes.length > maxBytes
```

### m134 New

```js
false
```

### m134 Test

```text
[director-105] The store rejects bytes above the caller limit
Output: KILLED [director-105] The store rejects bytes above the caller limit
```

## m135

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m135-old) | [New code](#m135-new) | KILLED | [Test record](#m135-test) |

### m135 Old

```js
bytes: asset.bytes.slice()
```

### m135 New

```js
bytes: asset.bytes
```

### m135 Test

```text
[director-105] The store returns an independent byte copy
Output: KILLED [director-105] The store returns an independent byte copy
```

## m136

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m136-old) | [New code](#m136-new) | KILLED | [Test record](#m136-test) |

### m136 Old

```js
file.name?.endsWith('.gevbundle.json')
```

### m136 New

```js
file.name.endsWith('.gevbundle.json')
```

### m136 Test

```text
[director-106] The share helpers accept an absent filename
Output: KILLED [director-106] The share helpers accept an absent filename
```

## m137

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m137-old) | [New code](#m137-new) | KILLED | [Test record](#m137-test) |

### m137 Old

```js
if (file.size > limit)
```

### m137 New

```js
if (false)
```

### m137 Test

```text
[director-106] The share helpers reject the ordinary file budget
Output: KILLED [director-106] The share helpers reject the ordinary file budget
```

## m138

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m138-old) | [New code](#m138-new) | KILLED | [Test record](#m138-test) |

### m138 Old

```js
file.name?.endsWith('.gevbundle.json')
```

### m138 New

```js
false
```

### m138 Test

```text
[director-106] The share helpers give bundles the larger budget
Output: KILLED [director-106] The share helpers give bundles the larger budget
```

## m139

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m139-old) | [New code](#m139-new) | KILLED | [Test record](#m139-test) |

### m139 Old

```js
if (!signal) return Promise.resolve(work);
```

### m139 New

```js
if (!signal) return Promise.resolve(8);
```

### m139 Test

```text
[director-107] The helper resolves without a signal
Output: KILLED [director-107] The helper resolves without a signal
```

## m140

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m140-old) | [New code](#m140-new) | KILLED | [Test record](#m140-test) |

### m140 Old

```js
if (signal.aborted) {
```

### m140 New

```js
if (false) {
```

### m140 Test

```text
[director-107] The helper rejects an early signal
Output: KILLED [director-107] The helper rejects an early signal
```

## m141

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m141-old) | [New code](#m141-new) | KILLED | [Test record](#m141-test) |

### m141 Old

```js
signal.aborted ? reject(signal.reason) : resolve(value)
```

### m141 New

```js
reject(signal.reason)
```

### m141 Test

```text
[director-107] The helper resolves with an active signal
Output: KILLED [director-107] The helper resolves with an active signal
```

## m142

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m142-old) | [New code](#m142-new) | KILLED | [Test record](#m142-test) |

### m142 Old

```js
reject(error);
```

### m142 New

```js
resolve(error);
```

### m142 Test

```text
[director-107] The helper rejects a work error
Output: KILLED [director-107] The helper rejects a work error
```

## m143

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m143-old) | [New code](#m143-new) | KILLED | [Test record](#m143-test) |

### m143 Old

```js
signal.aborted ? reject(signal.reason) : resolve(value)
```

### m143 New

```js
resolve(value)
```

### m143 Test

```text
[director-107] The helper checks signal state at settlement
Output: KILLED [director-107] The helper checks signal state at settlement
```

## m144

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m144-old) | [New code](#m144-new) | KILLED | [Test record](#m144-test) |

### m144 Old

```js
reject(signal.reason);
```

### m144 New

```js
resolve(signal.reason);
```

### m144 Test

```text
[director-107] The helper cancels work that is not complete
Output: KILLED [director-107] The helper cancels work that is not complete
```

## m145

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m145-old) | [New code](#m145-new) | KILLED | [Test record](#m145-test) |

### m145 Old

```js
n + a.bytes.length
```

### m145 New

```js
n
```

### m145 Test

```text
[director-108] The preview reports exact totals and attribution
Output: KILLED [director-108] The preview reports exact totals and attribution
```

## m146

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m146-old) | [New code](#m146-new) | KILLED | [Test record](#m146-test) |

### m146 Old

```js
scene.title || scene.id
```

### m146 New

```js
scene.title
```

### m146 Test

```text
[director-108] The preview uses the scene ID without a title
Output: KILLED [director-108] The preview uses the scene ID without a title
```

## m147

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m147-old) | [New code](#m147-new) | KILLED | [Test record](#m147-test) |

### m147 Old

```js
assets.has(pack.source.path)
```

### m147 New

```js
false
```

### m147 Test

```text
[director-109] The preview reports included bundle bytes
Output: KILLED [director-109] The preview reports included bundle bytes
```

## m148

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m148-old) | [New code](#m148-new) | KILLED | [Test record](#m148-test) |

### m148 Old

```js
assets.has(pack.source.path)
```

### m148 New

```js
true
```

### m148 Test

```text
[director-109] The preview reports absent bundle bytes
Output: KILLED [director-109] The preview reports absent bundle bytes
```

## m149

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m149-old) | [New code](#m149-new) | KILLED | [Test record](#m149-test) |

### m149 Old

```js
sources.has(pack.source.adapter)
```

### m149 New

```js
false
```

### m149 Test

```text
[director-109] The preview reports a configured source
Output: KILLED [director-109] The preview reports a configured source
```

## m150

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m150-old) | [New code](#m150-new) | KILLED | [Test record](#m150-test) |

### m150 Old

```js
sources.has(pack.source.adapter)
```

### m150 New

```js
true
```

### m150 Test

```text
[director-109] The preview reports an unavailable source
Output: KILLED [director-109] The preview reports an unavailable source
```

## m151

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m151-old) | [New code](#m151-new) | KILLED | [Test record](#m151-test) |

### m151 Old

```js
!layers.has(id)
```

### m151 New

```js
true
```

### m151 Test

```text
[director-110] The preview lists distinct absent layers
Output: KILLED [director-110] The preview lists distinct absent layers
```

## m152

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m152-old) | [New code](#m152-new) | KILLED | [Test record](#m152-test) |

### m152 Old

```js
s.appliedShotPacks?.length
```

### m152 New

```js
false
```

### m152 Test

```text
[director-110] The preview detects applied shot packs
Output: KILLED [director-110] The preview detects applied shot packs
```

## m153

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m153-old) | [New code](#m153-new) | KILLED | [Test record](#m153-test) |

### m153 Old

```js
s.shots.some((shot) => shot.sourcePackId)
```

### m153 New

```js
false
```

### m153 Test

```text
[director-110] The preview detects the source pack ID of a shot
Output: KILLED [director-110] The preview detects the source pack ID of a shot
```

## m154

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m154-old) | [New code](#m154-new) | KILLED | [Test record](#m154-test) |

### m154 Old

```js
s.appliedShotPacks?.length || s.shots.some((shot) => shot.sourcePackId)
```

### m154 New

```js
true
```

### m154 Test

```text
[director-110] The preview detects no external content
Output: KILLED [director-110] The preview detects no external content
```

## m155

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m155-old) | [New code](#m155-new) | KILLED | [Test record](#m155-test) |

### m155 Old

```js
? ['bounds', 'height', 'altitudeReference']
```

### m155 New

```js
? [ 'height', 'altitudeReference']
```

### m155 Test

```text
[director-080] The image accepts its bounds field
Output: KILLED [director-080] The image accepts its bounds field
```

## m156

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m156-old) | [New code](#m156-new) | KILLED | [Test record](#m156-test) |

### m156 Old

```js
? ['bounds', 'height', 'altitudeReference']
```

### m156 New

```js
? ['bounds', 'altitudeReference']
```

### m156 Test

```text
[director-080] The image accepts its height field
Output: KILLED [director-080] The image accepts its height field
```

## m157

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m157-old) | [New code](#m157-new) | KILLED | [Test record](#m157-test) |

### m157 Old

```js
? ['bounds', 'height', 'altitudeReference']
```

### m157 New

```js
? ['bounds', 'height']
```

### m157 Test

```text
[director-080] The image accepts its altitudeReference field
Output: KILLED [director-080] The image accepts its altitudeReference field
```

## m158

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m158-old) | [New code](#m158-new) | KILLED | [Test record](#m158-test) |

### m158 Old

```js
? ['anchorId']
```

### m158 New

```js
? []
```

### m158 Test

```text
[director-081] The media accepts its anchorId field
Output: KILLED [director-081] The media accepts its anchorId field
```

## m159

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m159-old) | [New code](#m159-new) | KILLED | [Test record](#m159-test) |

### m159 Old

```js
: ['altitudeReference'],
```

### m159 New

```js
: [],
```

### m159 Test

```text
[director-077] The geojson accepts its altitudeReference field
Output: KILLED [director-077] The geojson accepts its altitudeReference field
```

## m160

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m160-old) | [New code](#m160-new) | KILLED | [Test record](#m160-test) |

### m160 Old

```js
i % 2 ? -90 : -180
```

### m160 New

```js
i === 0 ? -181 : (i % 2 ? -90 : -180)
```

### m160 Test

```text
[director-080] The image bounds 0 rejects low excess
Output: KILLED [director-080] The image bounds 0 rejects low excess
```

## m161

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m161-old) | [New code](#m161-new) | KILLED | [Test record](#m161-test) |

### m161 Old

```js
i % 2 ? 90 : 180
```

### m161 New

```js
i === 0 ? 181 : (i % 2 ? 90 : 180)
```

### m161 Test

```text
[director-080] The image bounds 0 rejects high excess
Output: KILLED [director-080] The image bounds 0 rejects high excess
```

## m162

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m162-old) | [New code](#m162-new) | KILLED | [Test record](#m162-test) |

### m162 Old

```js
i % 2 ? -90 : -180
```

### m162 New

```js
i === 1 ? -91 : (i % 2 ? -90 : -180)
```

### m162 Test

```text
[director-080] The image bounds 1 rejects low excess
Output: KILLED [director-080] The image bounds 1 rejects low excess
```

## m163

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m163-old) | [New code](#m163-new) | KILLED | [Test record](#m163-test) |

### m163 Old

```js
i % 2 ? 90 : 180
```

### m163 New

```js
i === 1 ? 91 : (i % 2 ? 90 : 180)
```

### m163 Test

```text
[director-080] The image bounds 1 rejects high excess
Output: KILLED [director-080] The image bounds 1 rejects high excess
```

## m164

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m164-old) | [New code](#m164-new) | KILLED | [Test record](#m164-test) |

### m164 Old

```js
i % 2 ? -90 : -180
```

### m164 New

```js
i === 2 ? -181 : (i % 2 ? -90 : -180)
```

### m164 Test

```text
[director-080] The image bounds 2 rejects low excess
Output: KILLED [director-080] The image bounds 2 rejects low excess
```

## m165

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m165-old) | [New code](#m165-new) | KILLED | [Test record](#m165-test) |

### m165 Old

```js
i % 2 ? 90 : 180
```

### m165 New

```js
i === 2 ? 181 : (i % 2 ? 90 : 180)
```

### m165 Test

```text
[director-080] The image bounds 2 rejects high excess
Output: KILLED [director-080] The image bounds 2 rejects high excess
```

## m166

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m166-old) | [New code](#m166-new) | KILLED | [Test record](#m166-test) |

### m166 Old

```js
i % 2 ? -90 : -180
```

### m166 New

```js
i === 3 ? -91 : (i % 2 ? -90 : -180)
```

### m166 Test

```text
[director-080] The image bounds 3 rejects low excess
Output: KILLED [director-080] The image bounds 3 rejects low excess
```

## m167

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m167-old) | [New code](#m167-new) | KILLED | [Test record](#m167-test) |

### m167 Old

```js
i % 2 ? 90 : 180
```

### m167 New

```js
i === 3 ? 91 : (i % 2 ? 90 : 180)
```

### m167 Test

```text
[director-080] The image bounds 3 rejects high excess
Output: KILLED [director-080] The image bounds 3 rejects high excess
```

## m168

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m168-old) | [New code](#m168-new) | KILLED | [Test record](#m168-test) |

### m168 Old

```js
number(p.height, `${at}.height`, -12000, 1e9, false);
```

### m168 New

```js
number(p.height, `${at}.height`, -12000, 1e9 + 1, false);
```

### m168 Test

```text
[director-080] The image height checks both limits
Output: KILLED [director-080] The image height checks both limits
```

## m169

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m169-old) | [New code](#m169-new) | KILLED | [Test record](#m169-test) |

### m169 Old

```js
scene.anchors || []
```

### m169 New

```js
[]
```

### m169 Test

```text
[director-082] The scene uses supplied anchors
Output: KILLED [director-082] The scene uses supplied anchors
```

## m170

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m170-old) | [New code](#m170-new) | KILLED | [Test record](#m170-test) |

### m170 Old

```js
scene.anchors || []
```

### m170 New

```js
scene.anchors
```

### m170 Test

```text
[director-082] The scene uses absent anchor defaults
Output: KILLED [director-082] The scene uses absent anchor defaults
```

## m171

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m171-old) | [New code](#m171-new) | KILLED | [Test record](#m171-test) |

### m171 Old

```js
Math.abs(p[0]) > 180
```

### m171 New

```js
Math.abs(p[0]) >= 180
```

### m171 Test

```text
[director-085] The position accepts both geographic edges
Output: KILLED [director-085] The position accepts both geographic edges
```

## m172

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m172-old) | [New code](#m172-new) | known limit | [Test record](#m172-test) |

### m172 Old

```js
p.length === 3 &&
```

### m172 New

```js
true &&
```

### m172 Test

```text
No failed repository test
Output: SURVIVED 
```

Probe: evidence/probe-inherited-height.txt.
The code limit uses an inherited value at index 2.

## m173

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m173-old) | [New code](#m173-new) | KILLED | [Test record](#m173-test) |

### m173 Old

```js
active?.status || 'idle'
```

### m173 New

```js
active?.status || 'bad'
```

### m173 Test

```text
[director-088] The session state uses its idle default
Output: KILLED [director-088] The session state uses its idle default
```

## m174

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m174-old) | [New code](#m174-new) | KILLED | [Test record](#m174-test) |

### m174 Old

```js
active?.handles.length || 0
```

### m174 New

```js
active?.handles.length || 1
```

### m174 Test

```text
[director-088] The session state uses its zero default
Output: KILLED [director-088] The session state uses its zero default
```

## m175

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m175-old) | [New code](#m175-new) | KILLED | [Test record](#m175-test) |

### m175 Old

```js
active?.handles.length || 0
```

### m175 New

```js
0
```

### m175 Test

```text
[director-089] The session state uses its active total
Output: KILLED [director-089] The session state uses its active total
```

## m176

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m176-old) | [New code](#m176-new) | KILLED | [Test record](#m176-test) |

### m176 Old

```js
pack.byteLength || PACK_LIMITS.bytes
```

### m176 New

```js
pack.byteLength || 1
```

### m176 Test

```text
[director-093] The session uses its default byte budget
Output: KILLED [director-093] The session uses its default byte budget
```

## m177

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m177-old) | [New code](#m177-new) | KILLED | [Test record](#m177-test) |

### m177 Old

```js
pack.byteLength && bytes.length !== pack.byteLength
```

### m177 New

```js
bytes.length !== pack.byteLength
```

### m177 Test

```text
[director-093] The session accepts absent declared size
Output: KILLED [director-093] The session accepts absent declared size
```

## m178

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m178-old) | [New code](#m178-new) | KILLED | [Test record](#m178-test) |

### m178 Old

```js
const superseded = active !== run || signal?.aborted || disposed;
```

### m178 New

```js
const superseded = active !== run || disposed;
```

### m178 Test

```text
[director-090] The session checks signal state without an event
Output: KILLED [director-090] The session checks signal state without an event
```

## m179

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m179-old) | [New code](#m179-new) | KILLED | [Test record](#m179-test) |

### m179 Old

```js
const superseded = active !== run || signal?.aborted || disposed;
```

### m179 New

```js
const superseded = active !== run || signal?.aborted;
```

### m179 Test

```text
[director-090] The session checks destroyed state after signal access
Output: KILLED [director-090] The session checks destroyed state after signal access
```

## m180

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m180-old) | [New code](#m180-new) | KILLED | [Test record](#m180-test) |

### m180 Old

```js
const superseded = active !== run || signal?.aborted || disposed;
```

### m180 New

```js
const superseded = signal?.aborted || disposed;
```

### m180 Test

```text
[director-090] The session checks replacement without signal state
Output: KILLED [director-090] The session checks replacement without signal state
```

## m181

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m181-old) | [New code](#m181-new) | KILLED | [Test record](#m181-test) |

### m181 Old

```js
active !== run || controller.signal.aborted
```

### m181 New

```js
controller.signal.aborted
```

### m181 Test

```text
[director-090] The session guard rejects a detached resource
Output: KILLED [director-090] The session guard rejects a detached resource
```

## m182

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m182-old) | [New code](#m182-new) | KILLED | [Test record](#m182-test) |

### m182 Old

```js
active !== run || controller.signal.aborted
```

### m182 New

```js
active !== run
```

### m182 Test

```text
[director-090] The session disposes the handle before it adds the handle to its list
Output: KILLED [director-090] The session disposes the handle before it adds the handle to its list
```

## m183

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m183-old) | [New code](#m183-new) | KILLED | [Test record](#m183-test) |

### m183 Old

```js
if (!ended) {
          ended = true;
          reject(error);
```

### m183 New

```js
if (ended) {
          ended = true;
          reject(error);
```

### m183 Test

```text
[director-092] The session settles a source error before its deadline
Output: KILLED [director-092] The session settles a source error before its deadline
```

## m184

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m184-old) | [New code](#m184-new) | KILLED | [Test record](#m184-test) |

### m184 Old

```js
    signal?.throwIfAborted();
    const response
```

### m184 New

```js
    const response
```

### m184 Test

```text
[director-097] The source rejects early cancellation
Output: KILLED [director-097] The source rejects early cancellation
```

## m185

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m185-old) | [New code](#m185-new) | KILLED | [Test record](#m185-test) |

### m185 Old

```js
!['https:', 'http:'].includes(base.protocol)
```

### m185 New

```js
base.protocol !== 'https:'
```

### m185 Test

```text
[director-094] The directory accepts HTTP and HTTPS
Output: KILLED [director-094] The directory accepts HTTP and HTTPS
```

## m186

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m186-old) | [New code](#m186-new) | KILLED | [Test record](#m186-test) |

### m186 Old

```js
text.length > SHARE_LIMITS.bytes
```

### m186 New

```js
false
```

### m186 Test

```text
[director-098] The share character guard precedes byte conversion
Output: KILLED [director-098] The share character guard precedes byte conversion
```

## m187

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m187-old) | [New code](#m187-new) | KILLED | [Test record](#m187-test) |

### m187 Old

```js
scene.dataPacks || []
```

### m187 New

```js
scene.dataPacks
```

### m187 Test

```text
[director-101] The export accepts scenes without data packs
Output: KILLED [director-101] The export accepts scenes without data packs
```

## m188

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m188-old) | [New code](#m188-new) | KILLED | [Test record](#m188-test) |

### m188 Old

```js
scene.dataPacks || []
```

### m188 New

```js
[]
```

### m188 Test

```text
[director-101] The export keeps a supplied data pack list
Output: KILLED [director-101] The export keeps a supplied data pack list
```

## m189

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m189-old) | [New code](#m189-new) | KILLED | [Test record](#m189-test) |

### m189 Old

```js
pack.byteLength && pack.byteLength !== bytes.length
```

### m189 New

```js
pack.byteLength !== bytes.length
```

### m189 Test

```text
[director-102] The export accepts absent integrity fields
Output: KILLED [director-102] The export accepts absent integrity fields
```

## m190

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m190-old) | [New code](#m190-new) | KILLED | [Test record](#m190-test) |

### m190 Old

```js
pack.sha256 && pack.sha256 !== sha256
```

### m190 New

```js
pack.sha256 !== sha256
```

### m190 Test

```text
[director-102] The export accepts an absent digest
Output: KILLED [director-102] The export accepts an absent digest
```

## m191

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m191-old) | [New code](#m191-new) | KILLED | [Test record](#m191-test) |

### m191 Old

```js
pack.byteLength && pack.byteLength !== entry.byteLength
```

### m191 New

```js
pack.byteLength !== entry.byteLength
```

### m191 Test

```text
[director-103] The shared export accepts absent byte declarations
Output: KILLED [director-103] The shared export accepts absent byte declarations
```

## m192

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m192-old) | [New code](#m192-new) | KILLED | [Test record](#m192-test) |

### m192 Old

```js
pack.sha256 && pack.sha256 !== entry.sha256
```

### m192 New

```js
pack.sha256 !== entry.sha256
```

### m192 Test

```text
[director-103] The shared export accepts an absent digest
Output: KILLED [director-103] The shared export accepts an absent digest
```

## m193

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m193-old) | [New code](#m193-new) | KILLED | [Test record](#m193-test) |

### m193 Old

```js
value.includes('=') && !/^[A-Za-z0-9+/]+={1,2}$/.test(value)
```

### m193 New

```js
!/^[A-Za-z0-9+/]+={1,2}$/.test(value)
```

### m193 Test

```text
[director-099] The base64 accepts bytes without padding
Output: KILLED [director-099] The base64 accepts bytes without padding
```

## m194

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m194-old) | [New code](#m194-new) | KILLED | [Test record](#m194-test) |

### m194 Old

```js
scene.dataPacks || []
```

### m194 New

```js
scene.dataPacks
```

### m194 Test

```text
[director-108] The preview accepts absent data pack lists
Output: KILLED [director-108] The preview accepts absent data pack lists
```

## m195

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m195-old) | [New code](#m195-new) | KILLED | [Test record](#m195-test) |

### m195 Old

```js
scene.dataPacks || []
```

### m195 New

```js
[]
```

### m195 Test

```text
[director-108] The preview uses supplied data pack lists
Output: KILLED [director-108] The preview uses supplied data pack lists
```

## m196

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m196-old) | [New code](#m196-new) | KILLED | [Test record](#m196-test) |

### m196 Old

```js
scene.title || scene.id
```

### m196 New

```js
scene.id
```

### m196 Test

```text
[director-108] The preview keeps a supplied scene title
Output: KILLED [director-108] The preview keeps a supplied scene title
```

## m197

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m197-old) | [New code](#m197-new) | KILLED | [Test record](#m197-test) |

### m197 Old

```js
pack.source.adapter === BUNDLE_SOURCE
```

### m197 New

```js
true
```

### m197 Test

```text
[director-109] The preview distinguishes bundle sources
Output: KILLED [director-109] The preview distinguishes bundle sources
```

## m198

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m198-old) | [New code](#m198-new) | KILLED | [Test record](#m198-test) |

### m198 Old

```js
shot.layers || {}
```

### m198 New

```js
shot.layers
```

### m198 Test

```text
[director-110] The preview accepts absent shot layers
Output: KILLED [director-110] The preview accepts absent shot layers
```

## m199

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m199-old) | [New code](#m199-new) | KILLED | [Test record](#m199-test) |

### m199 Old

```js
shot.layers || {}
```

### m199 New

```js
{}
```

### m199 Test

```text
[director-110] The preview uses supplied shot layers
Output: KILLED [director-110] The preview uses supplied shot layers
```

## m200

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m200-old) | [New code](#m200-new) | KILLED | [Test record](#m200-test) |

### m200 Old

```js
source({ path, signal, maxBytes = PACK_LIMITS.bytes })
```

### m200 New

```js
source({ path, signal, maxBytes = PACK_LIMITS.bytes + 1 })
```

### m200 Test

```text
[director-105] The store checks its default byte budget
Output: KILLED [director-105] The store checks its default byte budget
```

## m201

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m201-old) | [New code](#m201-new) | KILLED | [Test record](#m201-test) |

### m201 Old

```js
!adapter
```

### m201 New

```js
false
```

### m201 Test

```text
[director-092] The absent renderer does not call its source
Output: KILLED [director-092] The absent renderer does not call its source
```

## m202

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m202-old) | [New code](#m202-new) | KILLED | [Test record](#m202-test) |

### m202 Old

```js
typeof value !== 'string'
```

### m202 New

```js
false
```

### m202 Test

```text
[director-099] The base64 rejects a custom text object
Output: KILLED [director-099] The base64 rejects a custom text object
```

## m203

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m203-old) | [New code](#m203-new) | KILLED | [Test record](#m203-test) |

### m203 Old

```js
[pack.source.adapter, pack.source.path]
```

### m203 New

```js
[pack.source.path]
```

### m203 Test

```text
[director-103] The export key uses the registered source name
Output: KILLED [director-103] The export key uses the registered source name
```

## m204

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m204-old) | [New code](#m204-new) | KILLED | [Test record](#m204-test) |

### m204 Old

```js
[pack.source.adapter, pack.source.path]
```

### m204 New

```js
[pack.source.adapter]
```

### m204 Test

```text
[director-103] The export key uses path
Output: KILLED [director-103] The export key uses path
```

## m205

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m205-old) | [New code](#m205-new) | KILLED | [Test record](#m205-test) |

### m205 Old

```js
Object.keys(shot.layers || {})
```

### m205 New

```js
Object.keys(shot.layers || {}).filter(id=>id!=='ships')
```

### m205 Test

```text
[director-110] The preview detects each layer key
Output: KILLED [director-110] The preview detects each layer key
```

## m206

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m206-old) | [New code](#m206-new) | KILLED | [Test record](#m206-test) |

### m206 Old

```js
[...assets.values()].reduce((n, a) => n + a.bytes.length, 0)
```

### m206 New

```js
[...assets.values()].slice(0, 1).reduce((n, a) => n + a.bytes.length, 0)
```

### m206 Test

```text
[director-108] The preview totals include every asset
Output: KILLED [director-108] The preview totals include every asset
```

## m207

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m207-old) | [New code](#m207-new) | KILLED | [Test record](#m207-test) |

### m207 Old

```js
credentials: 'omit',
```

### m207 New

```js

```

### m207 Test

```text
[director-095] The asset request sets its credentials option
Output: KILLED [director-095] The asset request sets its credentials option
```

## m208

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m208-old) | [New code](#m208-new) | KILLED | [Test record](#m208-test) |

### m208 Old

```js
redirect: 'error',
```

### m208 New

```js

```

### m208 Test

```text
[director-095] The asset request sets its redirect option
Output: KILLED [director-095] The asset request sets its redirect option
```

## m209

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m209-old) | [New code](#m209-new) | KILLED | [Test record](#m209-test) |

### m209 Old

```js
referrerPolicy: 'no-referrer',
```

### m209 New

```js

```

### m209 Test

```text
[director-095] The asset request sets its referrerPolicy option
Output: KILLED [director-095] The asset request sets its referrerPolicy option
```

## m210

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m210-old) | [New code](#m210-new) | KILLED | [Test record](#m210-test) |

### m210 Old

```js
cache: 'no-store',
```

### m210 New

```js

```

### m210 Test

```text
[director-095] The asset request sets its cache option
Output: KILLED [director-095] The asset request sets its cache option
```

## m211

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m211-old) | [New code](#m211-new) | KILLED | [Test record](#m211-test) |

### m211 Old

```js
p.some((v) => !Number.isFinite(v))
```

### m211 New

```js
p.some((v,i) => i !== 0 && !Number.isFinite(v))
```

### m211 Test

```text
[director-085] The position rejects field 0 that is not finite
Output: KILLED [director-085] The position rejects field 0 that is not finite
```

## m212

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m212-old) | [New code](#m212-new) | KILLED | [Test record](#m212-test) |

### m212 Old

```js
p.some((v) => !Number.isFinite(v))
```

### m212 New

```js
p.some((v,i) => i !== 1 && !Number.isFinite(v))
```

### m212 Test

```text
[director-085] The position rejects field 1 that is not finite
Output: KILLED [director-085] The position rejects field 1 that is not finite
```

## m213

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m213-old) | [New code](#m213-new) | KILLED | [Test record](#m213-test) |

### m213 Old

```js
p.some((v) => !Number.isFinite(v))
```

### m213 New

```js
p.some((v,i) => i !== 2 && !Number.isFinite(v))
```

### m213 Test

```text
[director-085] The position rejects field 2 that is not finite
Output: KILLED [director-085] The position rejects field 2 that is not finite
```

## m214

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m214-old) | [New code](#m214-new) | KILLED | [Test record](#m214-test) |

### m214 Old

```js
maxBytes = PACK_LIMITS.bytes
```

### m214 New

```js
maxBytes = PACK_LIMITS.bytes + 1
```

### m214 Test

```text
[director-096] The source checks its default byte budget
Output: KILLED [director-096] The source checks its default byte budget
```

## m215

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m215-old) | [New code](#m215-new) | KILLED | [Test record](#m215-test) |

### m215 Old

```js
'id',
```

### m215 New

```js

```

### m215 Test

```text
[director-077] The manifest accepts the id field of a data pack
Output: KILLED [director-077] The manifest accepts the id field of a data pack
```

## m216

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m216-old) | [New code](#m216-new) | KILLED | [Test record](#m216-test) |

### m216 Old

```js
'version',
```

### m216 New

```js

```

### m216 Test

```text
[director-077] The manifest accepts the version field of a data pack
Output: KILLED [director-077] The manifest accepts the version field of a data pack
```

## m217

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m217-old) | [New code](#m217-new) | KILLED | [Test record](#m217-test) |

### m217 Old

```js
'format',
```

### m217 New

```js

```

### m217 Test

```text
[director-077] The manifest accepts the format field of a data pack
Output: KILLED [director-077] The manifest accepts the format field of a data pack
```

## m218

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m218-old) | [New code](#m218-new) | KILLED | [Test record](#m218-test) |

### m218 Old

```js
'source',
```

### m218 New

```js

```

### m218 Test

```text
[director-077] The manifest accepts the source field of a data pack
Output: KILLED [director-077] The manifest accepts the source field of a data pack
```

## m219

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m219-old) | [New code](#m219-new) | KILLED | [Test record](#m219-test) |

### m219 Old

```js
'attribution',
```

### m219 New

```js

```

### m219 Test

```text
[director-077] The manifest accepts the attribution field of a data pack
Output: KILLED [director-077] The manifest accepts the attribution field of a data pack
```

## m220

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m220-old) | [New code](#m220-new) | KILLED | [Test record](#m220-test) |

### m220 Old

```js
'placement',
```

### m220 New

```js

```

### m220 Test

```text
[director-077] The manifest accepts the placement field of a data pack
Output: KILLED [director-077] The manifest accepts the placement field of a data pack
```

## m221

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m221-old) | [New code](#m221-new) | KILLED | [Test record](#m221-test) |

### m221 Old

```js
    'byteLength',
```

### m221 New

```js

```

### m221 Test

```text
[director-079] The manifest accepts the byteLength field of a data pack
Output: KILLED [director-079] The manifest accepts the byteLength field of a data pack
```

## m222

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m222-old) | [New code](#m222-new) | KILLED | [Test record](#m222-test) |

### m222 Old

```js
    'sha256',
```

### m222 New

```js

```

### m222 Test

```text
[director-079] The manifest accepts the sha256 field of a data pack
Output: KILLED [director-079] The manifest accepts the sha256 field of a data pack
```

## m223

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m223-old) | [New code](#m223-new) | KILLED | [Test record](#m223-test) |

### m223 Old

```js
['adapter', 'path']
```

### m223 New

```js
['path']
```

### m223 Test

```text
[director-077] The manifest accepts its source name field
Output: KILLED [director-077] The manifest accepts its source name field
```

## m224

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m224-old) | [New code](#m224-new) | KILLED | [Test record](#m224-test) |

### m224 Old

```js
['adapter', 'path']
```

### m224 New

```js
['adapter']
```

### m224 Test

```text
[director-077] The manifest accepts its source path field
Output: KILLED [director-077] The manifest accepts its source path field
```

## m225

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m225-old) | [New code](#m225-new) | KILLED | [Test record](#m225-test) |

### m225 Old

```js
['text', 'license', 'url']
```

### m225 New

```js
['license', 'url']
```

### m225 Test

```text
[director-078] The manifest accepts its attribution text field
Output: KILLED [director-078] The manifest accepts its attribution text field
```

## m226

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m226-old) | [New code](#m226-new) | KILLED | [Test record](#m226-test) |

### m226 Old

```js
['text', 'license', 'url']
```

### m226 New

```js
['text', 'url']
```

### m226 Test

```text
[director-078] The manifest accepts its attribution license field
Output: KILLED [director-078] The manifest accepts its attribution license field
```

## m227

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m227-old) | [New code](#m227-new) | KILLED | [Test record](#m227-test) |

### m227 Old

```js
['text', 'license', 'url']
```

### m227 New

```js
['text', 'license']
```

### m227 Test

```text
[director-078] The manifest accepts its attribution url field
Output: KILLED [director-078] The manifest accepts its attribution url field
```

## m228

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m228-old) | [New code](#m228-new) | KILLED | [Test record](#m228-test) |

### m228 Old

```js
for (const pack of packsOf(project))
```

### m228 New

```js
for (const pack of packsOf(project).slice(0,1))
```

### m228 Test

```text
[director-100] The bundle checks its second asset reference
Output: KILLED [director-100] The bundle checks its second asset reference
```

## m229

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m229-old) | [New code](#m229-new) | KILLED | [Test record](#m229-test) |

### m229 Old

```js
for (const entry of input.assets)
```

### m229 New

```js
for (const entry of input.assets.slice(0,1))
```

### m229 Test

```text
[director-100] The bundle checks its second asset digest
Output: KILLED [director-100] The bundle checks its second asset digest
```

## m230

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m230-old) | [New code](#m230-new) | KILLED | [Test record](#m230-test) |

### m230 Old

```js
pack.sha256 !== entry.sha256
```

### m230 New

```js
pack.sha256 === entry.sha256
```

### m230 Test

```text
[director-103] The export accepts equal shared integrity
Output: KILLED [director-103] The export accepts equal shared integrity
```

## m231

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m231-old) | [New code](#m231-new) | KILLED | [Test record](#m231-test) |

### m231 Old

```js
bytes?.length || 0
```

### m231 New

```js
bytes.length || 0
```

### m231 Test

```text
[director-102] The export rejects absent asset bytes
Output: KILLED [director-102] The export rejects absent asset bytes
```

## m232

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m232-old) | [New code](#m232-new) | KILLED | [Test record](#m232-test) |

### m232 Old

```js
if (signal.aborted) abort();
```

### m232 New

```js
if (false) abort();
```

### m232 Test

```text
[director-092] The session settles an early internal signal
Output: KILLED [director-092] The session settles an early internal signal
```

## m233

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m233-old) | [New code](#m233-new) | KILLED | [Test record](#m233-test) |

### m233 Old

```js
(anchor) => anchor.id
```

### m233 New

```js
(anchor) => {throw new Error("wrong");}
```

### m233 Test

```text
[director-093] The session gives anchors to its renderer
Output: KILLED [director-093] The session gives anchors to its renderer
```

## m234

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m234-old) | [New code](#m234-new) | KILLED | [Test record](#m234-test) |

### m234 Old

```js
  checkAbort(options?.signal);
  return parseSceneShare
```

### m234 New

```js
  checkAbort(undefined);
  return parseSceneShare
```

### m234 Test

```text
[director-106] The share helpers check a signal after text access
Output: KILLED [director-106] The share helpers check a signal after text access
```

## m235

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m235-old) | [New code](#m235-new) | KILLED | [Test record](#m235-test) |

### m235 Old

```js
if (new TextEncoder().encode(text).length > SHARE_LIMITS.bytes)
```

### m235 New

```js
if (false)
```

### m235 Test

```text
[director-102] The export checks its encoded text budget
Output: KILLED [director-102] The export checks its encoded text budget
```

## m236

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m236-old) | [New code](#m236-new) | KILLED | [Test record](#m236-test) |

### m236 Old

```js
bytes?.length || 0
```

### m236 New

```js
bytes?.length
```

### m236 Test

```text
[director-102] The export keeps its total after an absent length
Output: KILLED [director-102] The export keeps its total after an absent length
```

## m237

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m237-old) | [New code](#m237-new) | KILLED | [Test record](#m237-test) |

### m237 Old

```js
active?.status || 'idle'
```

### m237 New

```js
'idle'
```

### m237 Test

```text
[director-089] The session state uses its active status
Output: KILLED [director-089] The session state uses its active status
```

## m238

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m238-old) | [New code](#m238-new) | KILLED | [Test record](#m238-test) |

### m238 Old

```js
pack.format === 'image'
      ?
```

### m238 New

```js
false
      ?
```

### m238 Test

```text
[director-080] The placement selects the image fields
Output: KILLED [director-080] The placement selects the image fields
```

## m239

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m239-old) | [New code](#m239-new) | KILLED | [Test record](#m239-test) |

### m239 Old

```js
pack.format === 'media'
        ?
```

### m239 New

```js
false
        ?
```

### m239 Test

```text
[director-081] The placement selects the media fields
Output: KILLED [director-081] The placement selects the media fields
```

## m240

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m240-old) | [New code](#m240-new) | KILLED | [Test record](#m240-test) |

### m240 Old

```js
adapterMap.get(pack.format)
```

### m240 New

```js
pack.format === 'geojson' ? null : adapterMap.get(pack.format)
```

### m240 Test

```text
[director-089] The session loads its geojson format
Output: KILLED [director-089] The session loads its geojson format
```

## m241

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m241-old) | [New code](#m241-new) | KILLED | [Test record](#m241-test) |

### m241 Old

```js
adapterMap.get(pack.format)
```

### m241 New

```js
pack.format === 'image' ? null : adapterMap.get(pack.format)
```

### m241 Test

```text
[director-089] The session loads its image format
Output: KILLED [director-089] The session loads its image format
```

## m242

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m242-old) | [New code](#m242-new) | KILLED | [Test record](#m242-test) |

### m242 Old

```js
adapterMap.get(pack.format)
```

### m242 New

```js
pack.format === 'media' ? null : adapterMap.get(pack.format)
```

### m242 Test

```text
[director-089] The session loads its media format
Output: KILLED [director-089] The session loads its media format
```

## m243

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m243-old) | [New code](#m243-new) | KILLED | [Test record](#m243-test) |

### m243 Old

```js
for (;;) {
        signal?.throwIfAborted();
```

### m243 New

```js
for (;;) {
```

### m243 Test

```text
[director-097] The source stops between stream chunks
Output: KILLED [director-097] The source stops between stream chunks
```

## m244

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m244-old) | [New code](#m244-new) | KILLED | [Test record](#m244-test) |

### m244 Old

```js
seen.has(pack.id)
```

### m244 New

```js
false
```

### m244 Test

```text
[director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials
Output: KILLED [director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and cred
```

## m245

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m245-old) | [New code](#m245-new) | KILLED | [Test record](#m245-test) |

### m245 Old

```js
p.bounds[0] >= p.bounds[2]
```

### m245 New

```js
false
```

### m245 Test

```text
[director-080] The manifest checks given image bounds and media anchor references
Output: KILLED [director-080] The manifest checks given image bounds and media anchor references
```

## m246

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m246-old) | [New code](#m246-new) | KILLED | [Test record](#m246-test) |

### m246 Old

```js
redirect: 'error'
```

### m246 New

```js
redirect: 'follow'
```

### m246 Test

```text
[director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets
Output: KILLED [director-095 director-096 director-097] The directory source sends no credentials and rejects unsaf
```

## m247

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m247-old) | [New code](#m247-new) | KILLED | [Test record](#m247-test) |

### m247 Old

```js
return { id, type: g.type, coordinates };
```

### m247 New

```js
return { id, type: g.type, coordinates, properties: feature.properties };
```

### m247 Test

```text
[director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
Output: KILLED [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
```

## m248

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m248-old) | [New code](#m248-new) | KILLED | [Test record](#m248-test) |

### m248 Old

```js
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
```

### m248 New

```js
run.handles.splice(0);
```

### m248 Test

```text
[director-089] The data pack session removes resources and cancels the transport on Stop
Output: KILLED [director-089] The data pack session removes resources and cancels the transport on Stop
```

## m249

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m249-old) | [New code](#m249-new) | KILLED | [Test record](#m249-test) |

### m249 Old

```js
if (superseded) return false;
```

### m249 New

```js
if (superseded) throw new Error("wrong");
```

### m249 Test

```text
[director-091] The data pack session replaces source work and ignores its late bytes
Output: KILLED [director-091] The data pack session replaces source work and ignores its late bytes
```

## m250

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m250-old) | [New code](#m250-new) | KILLED | [Test record](#m250-test) |

### m250 Old

```js
if (ended) late(value);
```

### m250 New

```js
if (ended) {}
```

### m250 Test

```text
[director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement
Output: KILLED [director-090] The data pack session disposes late renderer resources after cancellation and keeps t
```

## m251

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m251-old) | [New code](#m251-new) | KILLED | [Test record](#m251-test) |

### m251 Old

```js
if (ended) late(value);
```

### m251 New

```js
if (ended) {}
```

### m251 Test

```text
[director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result
Output: KILLED [director-090] The data pack session disposes a renderer resource when its signal stops after the re
```

## m252

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m252-old) | [New code](#m252-new) | KILLED | [Test record](#m252-test) |

### m252 Old

```js
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
```

### m252 New

```js
throw new Error("wrong");
```

### m252 Test

```text
[director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources
Output: KILLED [director-092] The deadline stops a stalled registered source and a data pack error removes earlier 
```

## m253

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m253-old) | [New code](#m253-new) | KILLED | [Test record](#m253-test) |

### m253 Old

```js
hex !== pack.sha256
```

### m253 New

```js
false
```

### m253 Test

```text
[director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names
Output: KILLED [director-093] The data pack session checks bytes and integrity before the renderer call and rejects
```

## m254

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m254-old) | [New code](#m254-new) | KILLED | [Test record](#m254-test) |

### m254 Old

```js
await response.body?.cancel().catch(() => {});
```

### m254 New

```js

```

### m254 Test

```text
[director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal
Output: KILLED [director-097] The directory source cancels response bodies and sends no asset request with a cancel
```

## m255

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m255-old) | [New code](#m255-new) | KILLED | [Test record](#m255-test) |

### m255 Old

```js
pack.source = { adapter: BUNDLE_SOURCE, path: entry.path };
```

### m255 New

```js
pack.source = { adapter: 'bad', path: entry.path };
```

### m255 Test

```text
[director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request
Output: KILLED [director-101] The selected scene bundle copies bytes and attribution and keeps the project without 
```

## m256

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m256-old) | [New code](#m256-new) | KILLED | [Test record](#m256-test) |

### m256 Old

```js
input.version !== 1
```

### m256 New

```js
false
```

### m256 Test

```text
[director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity
Output: KILLED [director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent asset
```

## m257

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m257-old) | [New code](#m257-new) | KILLED | [Test record](#m257-test) |

### m257 Old

```js
bytes.length > PACK_LIMITS.bytes
```

### m257 New

```js
false
```

### m257 Test

```text
[director-102] The bundle checks asset limits and declared integrity before export
Output: KILLED [director-102] The bundle checks asset limits and declared integrity before export
```

## m258

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m258-old) | [New code](#m258-new) | KILLED | [Test record](#m258-test) |

### m258 Old

```js
pack.byteLength !== entry.byteLength
```

### m258 New

```js
false
```

### m258 Test

```text
[director-103] The data packs with the same path share one asset and reject integrity values that differ
Output: KILLED [director-103] The data packs with the same path share one asset and reject integrity values that di
```

## m259

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m259-old) | [New code](#m259-new) | KILLED | [Test record](#m259-test) |

### m259 Old

```js
sources.has(pack.source.adapter)
```

### m259 New

```js
true
```

### m259 Test

```text
[director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes
Output: KILLED [director-109] The preview reports unavailable sources, absent layers and absent bundle assets witho
```

## m260

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m260-old) | [New code](#m260-new) | KILLED | [Test record](#m260-test) |

### m260 Old

```js
bytes: asset.bytes.slice()
```

### m260 New

```js
bytes: asset.bytes
```

### m260 Test

```text
[director-104] The bundle byte store removes old data after replacement and uses no network source
Output: KILLED [director-104] The bundle byte store removes old data after replacement and uses no network source
```

## m261

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m261-old) | [New code](#m261-new) | KILLED | [Test record](#m261-test) |

### m261 Old

```js
if (file.size > limit)
```

### m261 New

```js
if (false)
```

### m261 Test

```text
[director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file
Output: KILLED [director-106] The share helpers reject excess file bytes before text access and cancel a stalled pr
```

## m262

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m262-old) | [New code](#m262-new) | KILLED | [Test record](#m262-test) |

### m262 Old

```js
reject(signal.reason);
```

### m262 New

```js
reject(new Error('wrong'));
```

### m262 Test

```text
[director-107] The cancelled bundle export stops before the next asset and returns no partial output
Output: KILLED [director-107] The cancelled bundle export stops before the next asset and returns no partial output
```

## m263

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m263-old) | [New code](#m263-new) | KILLED | [Test record](#m263-test) |

### m263 Old

```js
.at(-1).slice(0, 160)
```

### m263 New

```js
.at(-1)
```

### m263 Test

```text
[director-101] The bundle accepts long valid source asset names
Output: KILLED [director-101] The bundle accepts long valid source asset names
```

## m264

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m264-old) | [New code](#m264-new) | KILLED | [Test record](#m264-test) |

### m264 Old

```js
: ['altitudeReference'],
```

### m264 New

```js
: [],
```

### m264 Test

```text
[director-077] The manifest accepts geojson
Output: KILLED [director-077] The manifest accepts geojson
```

## m265

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m265-old) | [New code](#m265-new) | KILLED | [Test record](#m265-test) |

### m265 Old

```js
pack.format === 'image'
      ?
```

### m265 New

```js
false
      ?
```

### m265 Test

```text
[director-077] The manifest accepts image
Output: KILLED [director-077] The manifest accepts image
```

## m266

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m266-old) | [New code](#m266-new) | KILLED | [Test record](#m266-test) |

### m266 Old

```js
pack.format === 'media'
        ?
```

### m266 New

```js
false
        ?
```

### m266 Test

```text
[director-077] The manifest accepts media
Output: KILLED [director-077] The manifest accepts media
```

## m267

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m267-old) | [New code](#m267-new) | KILLED | [Test record](#m267-test) |

### m267 Old

```js
i % 2 ? 90 : 180
```

### m267 New

```js
i === 0 ? 181 : (i % 2 ? 90 : 180)
```

### m267 Test

```text
[director-080] The image rejects bounds field 0
Output: KILLED [director-080] The image rejects bounds field 0
```

## m268

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m268-old) | [New code](#m268-new) | KILLED | [Test record](#m268-test) |

### m268 Old

```js
i % 2 ? 90 : 180
```

### m268 New

```js
i === 1 ? 91 : (i % 2 ? 90 : 180)
```

### m268 Test

```text
[director-080] The image rejects bounds field 1
Output: KILLED [director-080] The image rejects bounds field 1
```

## m269

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m269-old) | [New code](#m269-new) | KILLED | [Test record](#m269-test) |

### m269 Old

```js
i % 2 ? 90 : 180
```

### m269 New

```js
i === 2 ? 181 : (i % 2 ? 90 : 180)
```

### m269 Test

```text
[director-080] The image rejects bounds field 2
Output: KILLED [director-080] The image rejects bounds field 2
```

## m270

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m270-old) | [New code](#m270-new) | KILLED | [Test record](#m270-test) |

### m270 Old

```js
i % 2 ? 90 : 180
```

### m270 New

```js
i === 3 ? 91 : (i % 2 ? 90 : 180)
```

### m270 Test

```text
[director-080] The image rejects bounds field 3
Output: KILLED [director-080] The image rejects bounds field 3
```

## m271

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m271-old) | [New code](#m271-new) | KILLED | [Test record](#m271-test) |

### m271 Old

```js
        timeoutMs,
```

### m271 New

```js
        15000,
```

### m271 Test

```text
[director-092] The session uses its supplied deadline
Output: KILLED [director-092] The session uses its supplied deadline
```

## m272

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m272-old) | [New code](#m272-new) | KILLED | [Test record](#m272-test) |

### m272 Old

```js
timeoutMs = 15000
```

### m272 New

```js
timeoutMs = 15001
```

### m272 Test

```text
[director-092] The session uses its default deadline
Output: KILLED [director-092] The session uses its default deadline
```

## m273

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m273-old) | [New code](#m273-new) | KILLED | [Test record](#m273-test) |

### m273 Old

```js
if (active === run) clear();
        if (superseded)
```

### m273 New

```js
if (superseded)
```

### m273 Test

```text
[director-092] The session removes resources after a later error
Output: KILLED [director-092] The session removes resources after a later error
```

## m274

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m274-old) | [New code](#m274-new) | KILLED | [Test record](#m274-test) |

### m274 Old

```js
  'application/json',
```

### m274 New

```js

```

### m274 Test

```text
[director-099] The bundle accepts the application/json media type
Output: KILLED [director-099] The bundle accepts the application/json media type
```

## m275

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m275-old) | [New code](#m275-new) | KILLED | [Test record](#m275-test) |

### m275 Old

```js
  'application/geo+json',
```

### m275 New

```js

```

### m275 Test

```text
[director-099] The bundle accepts the application/geo+json media type
Output: KILLED [director-099] The bundle accepts the application/geo+json media type
```

## m276

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m276-old) | [New code](#m276-new) | KILLED | [Test record](#m276-test) |

### m276 Old

```js
  'image/png',
```

### m276 New

```js

```

### m276 Test

```text
[director-099] The bundle accepts the image/png media type
Output: KILLED [director-099] The bundle accepts the image/png media type
```

## m277

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m277-old) | [New code](#m277-new) | KILLED | [Test record](#m277-test) |

### m277 Old

```js
  'video/mp4',
```

### m277 New

```js

```

### m277 Test

```text
[director-099] The bundle accepts the video/mp4 media type
Output: KILLED [director-099] The bundle accepts the video/mp4 media type
```

## m278

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m278-old) | [New code](#m278-new) | KILLED | [Test record](#m278-test) |

### m278 Old

```js
  'video/webm',
```

### m278 New

```js

```

### m278 Test

```text
[director-099] The bundle accepts the video/webm media type
Output: KILLED [director-099] The bundle accepts the video/webm media type
```

## m279

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m279-old) | [New code](#m279-new) | KILLED | [Test record](#m279-test) |

### m279 Old

```js
  'audio/mpeg',
```

### m279 New

```js

```

### m279 Test

```text
[director-099] The bundle accepts the audio/mpeg media type
Output: KILLED [director-099] The bundle accepts the audio/mpeg media type
```

## m280

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m280-old) | [New code](#m280-new) | KILLED | [Test record](#m280-test) |

### m280 Old

```js
  'audio/ogg',
```

### m280 New

```js

```

### m280 Test

```text
[director-099] The bundle accepts the audio/ogg media type
Output: KILLED [director-099] The bundle accepts the audio/ogg media type
```

## m281

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m281-old) | [New code](#m281-new) | KILLED | [Test record](#m281-test) |

### m281 Old

```js
  'audio/wav',
```

### m281 New

```js

```

### m281 Test

```text
[director-099] The bundle accepts the audio/wav media type
Output: KILLED [director-099] The bundle accepts the audio/wav media type
```

## m282

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m282-old) | [New code](#m282-new) | KILLED | [Test record](#m282-test) |

### m282 Old

```js
  'audio/webm',
```

### m282 New

```js

```

### m282 Test

```text
[director-099] The bundle accepts the audio/webm media type
Output: KILLED [director-099] The bundle accepts the audio/webm media type
```

## m283

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m283-old) | [New code](#m283-new) | KILLED | [Test record](#m283-test) |

### m283 Old

```js
!handle
```

### m283 New

```js
false
```

### m283 Test

```text
[director-089] The session rejects a falsy handle with inherited disposal
Output: KILLED [director-089] The session rejects a falsy handle with inherited disposal
```

## m284

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m284-old) | [New code](#m284-new) | KILLED | [Test record](#m284-test) |

### m284 Old

```js
if (disposed || signal?.aborted) return false;
```

### m284 New

```js
if (signal?.aborted || disposed) return false;
```

### m284 Test

```text
[director-088] The destroyed session does not read the caller signal state
Output: KILLED [director-088] The destroyed session does not read the caller signal state
```

Probe: evidence/probe-signal-getter.txt.
Pass 4 kills this order change for an already destroyed session.
The active-session getter code fault remains a Known limit.

## m285

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m285-old) | [New code](#m285-new) | KILLED | [Test record](#m285-test) |

### m285 Old

```js
value.features.length > PACK_LIMITS.features
```

### m285 New

```js
value.features.length >= PACK_LIMITS.features
```

### m285 Test

```text
[director-083] The collection accepts its exact feature limit
Output: KILLED [director-083] The collection accepts its exact feature limit
```

## m286

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m286-old) | [New code](#m286-new) | KILLED | [Test record](#m286-test) |

### m286 Old

```js
id.length > 256
```

### m286 New

```js
id.length >= 256
```

### m286 Test

```text
[director-084] The feature ID accepts its exact text limit
Output: KILLED [director-084] The feature ID accepts its exact text limit
```

## m287

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m287-old) | [New code](#m287-new) | KILLED | [Test record](#m287-test) |

### m287 Old

```js
++positions > PACK_LIMITS.positions
```

### m287 New

```js
++positions >= PACK_LIMITS.positions
```

### m287 Test

```text
[director-085] The position accepts its exact total limit
Output: KILLED [director-085] The position accepts its exact total limit
```

## m288

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m288-old) | [New code](#m288-new) | KILLED | [Test record](#m288-test) |

### m288 Old

```js
g.coordinates.length <= 128
```

### m288 New

```js
g.coordinates.length < 128
```

### m288 Test

```text
[director-087] The polygon accepts its exact ring limit
Output: KILLED [director-087] The polygon accepts its exact ring limit
```

## m289

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m289-old) | [New code](#m289-new) | KILLED | [Test record](#m289-test) |

### m289 Old

```js
string(value, path, 1024);
```

### m289 New

```js
string(value, path, 1025);
```

### m289 Test

```text
[director-076] The asset path checks its text limit
Output: KILLED [director-076] The asset path checks its text limit
```

## m290

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m290-old) | [New code](#m290-new) | KILLED | [Test record](#m290-test) |

### m290 Old

```js
assets.length >= SHARE_LIMITS.assets
```

### m290 New

```js
assets.length >= SHARE_LIMITS.assets - 1
```

### m290 Test

```text
[director-102] The export accepts its exact asset total
Output: KILLED [director-102] The export accepts its exact asset total
```

## m291

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m291-old) | [New code](#m291-new) | KILLED | [Test record](#m291-test) |

### m291 Old

```js
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
```

### m291 New

```js
for (const handle of run.handles.splice(0).reverse().slice(0,1)) handle.dispose();
```

### m291 Test

```text
[director-089] The session keeps every data pack handle
Output: KILLED [director-089] The session keeps every data pack handle
```

## m292

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m292-old) | [New code](#m292-new) | KILLED | [Test record](#m292-test) |

### m292 Old

```js
      signal,
```

### m292 New

```js

```

### m292 Test

```text
[director-095] The asset request sets its signal option
Output: KILLED [director-095] The asset request sets its signal option
```

## m293

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m293-old) | [New code](#m293-new) | KILLED | [Test record](#m293-test) |

### m293 Old

```js
length > maxBytes
```

### m293 New

```js
length >= maxBytes
```

### m293 Test

```text
[director-096] The stream accepts its exact byte limit
Output: KILLED [director-096] The stream accepts its exact byte limit
```

## m294

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m294-old) | [New code](#m294-new) | KILLED | [Test record](#m294-test) |

### m294 Old

```js
Number(response.headers.get('content-length')) > maxBytes
```

### m294 New

```js
Number(response.headers.get('content-length')) >= maxBytes
```

### m294 Test

```text
[director-096] The stream accepts its exact byte limit
Output: KILLED [director-096] The stream accepts its exact byte limit
```

## m295

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m295-old) | [New code](#m295-new) | KILLED | [Test record](#m295-test) |

### m295 Old

```js
throw new Error(
          'Data pack could not load: check its source, format, size or integrity',
        );
```

### m295 New

```js
throw error;
```

### m295 Test

```text
[director-092] The session rejects a falsy custom source
Output: KILLED [director-092] The session rejects a falsy custom source
```

## m296

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m296-old) | [New code](#m296-new) | KILLED | [Test record](#m296-test) |

### m296 Old

```js
const copy = parseSceneDocument(stringifySceneDocument(project));
```

### m296 New

```js
const copy = project;
```

### m296 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m297

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m297-old) | [New code](#m297-new) | KILLED | [Test record](#m297-test) |

### m297 Old

```js
pack.byteLength = entry.byteLength;
```

### m297 New

```js
pack.byteLength = 1;
```

### m297 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m298

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m298-old) | [New code](#m298-new) | KILLED | [Test record](#m298-test) |

### m298 Old

```js
pack.sha256 = entry.sha256;
```

### m298 New

```js
pack.sha256 = '0'.repeat(64);
```

### m298 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m299

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m299-old) | [New code](#m299-new) | KILLED | [Test record](#m299-test) |

### m299 Old

```js
base64: encode(bytes),
```

### m299 New

```js
base64: 'AAAA',
```

### m299 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m300

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m300-old) | [New code](#m300-new) | KILLED | [Test record](#m300-test) |

### m300 Old

```js
assets: assets.map(({ byteLength, ...entry }) => entry),
```

### m300 New

```js
assets,
```

### m300 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m301

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m301-old) | [New code](#m301-new) | KILLED | [Test record](#m301-test) |

### m301 Old

```js
path: entry.path };
```

### m301 New

```js
path: 'other.json' };
```

### m301 Test

```text
[director-101] The export writes exact bundle metadata
Output: KILLED [director-101] The export writes exact bundle metadata
```

## m302

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m302-old) | [New code](#m302-new) | KILLED | [Test record](#m302-test) |

### m302 Old

```js
mimeType: asset.mimeType };
```

### m302 New

```js
mimeType: 'bad' };
```

### m302 Test

```text
[director-105] The store returns an independent byte copy
Output: KILLED [director-105] The store returns an independent byte copy
```

## m303

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m303-old) | [New code](#m303-new) | KILLED | [Test record](#m303-test) |

### m303 Old

```js
{64}
```

### m303 New

```js
{1,64}
```

### m303 Test

```text
[director-079] The digest rejects 63 characters
Output: KILLED [director-079] The digest rejects 63 characters
```

## m304

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m304-old) | [New code](#m304-new) | KILLED | [Test record](#m304-test) |

### m304 Old

```js
{64}
```

### m304 New

```js
{64,}
```

### m304 Test

```text
[director-079] The digest rejects 65 characters
Output: KILLED [director-079] The digest rejects 65 characters
```

## m305

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m305-old) | [New code](#m305-new) | KILLED | [Test record](#m305-test) |

### m305 Old

```js
/^[a-f0-9]{64}$/
```

### m305 New

```js
/[a-f0-9]{64}$/
```

### m305 Test

```text
[director-079] The digest rejects a prefix
Output: KILLED [director-079] The digest rejects a prefix
```

## m306

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m306-old) | [New code](#m306-new) | KILLED | [Test record](#m306-test) |

### m306 Old

```js
/^[a-f0-9]{64}$/
```

### m306 New

```js
/^[a-f0-9]{64}/
```

### m306 Test

```text
[director-079] The digest rejects a suffix
Output: KILLED [director-079] The digest rejects a suffix
```

## m307

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m307-old) | [New code](#m307-new) | KILLED | [Test record](#m307-test) |

### m307 Old

```js
[a-f0-9]
```

### m307 New

```js
[a-fA-F0-9]
```

### m307 Test

```text
[director-079] The digest rejects uppercase text
Output: KILLED [director-079] The digest rejects uppercase text
```

## m308

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m308-old) | [New code](#m308-new) | KILLED | [Test record](#m308-test) |

### m308 Old

```js
p.bounds[0] >= p.bounds[2]
```

### m308 New

```js
p.bounds[0] > p.bounds[2]
```

### m308 Test

```text
[director-080] The image rejects equal longitude edges
Output: KILLED [director-080] The image rejects equal longitude edges
```

## m309

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m309-old) | [New code](#m309-new) | KILLED | [Test record](#m309-test) |

### m309 Old

```js
p.bounds[1] >= p.bounds[3]
```

### m309 New

```js
p.bounds[1] > p.bounds[3]
```

### m309 Test

```text
[director-080] The image rejects equal latitude edges
Output: KILLED [director-080] The image rejects equal latitude edges
```

## m310

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m310-old) | [New code](#m310-new) | KILLED | [Test record](#m310-test) |

### m310 Old

```js
i % 2 ? -90 : -180
```

### m310 New

```js
i % 2 ? -89 : -180
```

### m310 Test

```text
[director-080] The image accepts all geographic limits
Output: KILLED [director-080] The image accepts all geographic limits
```

## m311

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m311-old) | [New code](#m311-new) | KILLED | [Test record](#m311-test) |

### m311 Old

```js
i % 2 ? -90 : -180
```

### m311 New

```js
i % 2 ? -90 : -179
```

### m311 Test

```text
[director-080] The image accepts all geographic limits
Output: KILLED [director-080] The image accepts all geographic limits
```

## m312

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m312-old) | [New code](#m312-new) | KILLED | [Test record](#m312-test) |

### m312 Old

```js
i % 2 ? 90 : 180
```

### m312 New

```js
i % 2 ? 89 : 180
```

### m312 Test

```text
[director-080] The image accepts all geographic limits
Output: KILLED [director-080] The image accepts all geographic limits
```

## m313

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m313-old) | [New code](#m313-new) | KILLED | [Test record](#m313-test) |

### m313 Old

```js
i % 2 ? 90 : 180
```

### m313 New

```js
i % 2 ? 90 : 179
```

### m313 Test

```text
[director-080] The image accepts all geographic limits
Output: KILLED [director-080] The image accepts all geographic limits
```

## m314

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m314-old) | [New code](#m314-new) | KILLED | [Test record](#m314-test) |

### m314 Old

```js
Object.hasOwn(scene, 'dataPacks')
```

### m314 New

```js
'dataPacks' in scene
```

### m314 Test

```text
[director-082] The scene ignores a data pack list from its parent
Output: KILLED [director-082] The scene ignores a data pack list from its parent
```

## m315

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m315-old) | [New code](#m315-new) | KILLED | [Test record](#m315-test) |

### m315 Old

```js
          false,
```

### m315 New

```js
          true,
```

### m315 Test

```text
[director-080] The image rejects text for each geographic field
Output: KILLED [director-080] The image rejects text for each geographic field
```

## m316

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m316-old) | [New code](#m316-new) | KILLED | [Test record](#m316-test) |

### m316 Old

```js
-12000, 1e9, false
```

### m316 New

```js
-12000, 1e9, true
```

### m316 Test

```text
[director-080] The image rejects text for each geographic field
Output: KILLED [director-080] The image rejects text for each geographic field
```

## m317

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m317-old) | [New code](#m317-new) | KILLED | [Test record](#m317-test) |

### m317 Old

```js
string(pack.attribution.text, `${path}.attribution.text`, 4096)
```

### m317 New

```js
string(pack.attribution.text, `${path}.attribution.text`, 4095)
```

### m317 Test

```text
[director-078] The attribution accepts its text limits and rejects excess text
Output: KILLED [director-078] The attribution accepts its text limits and rejects excess text
```

## m318

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m318-old) | [New code](#m318-new) | KILLED | [Test record](#m318-test) |

### m318 Old

```js
string(pack.attribution.license, `${path}.attribution.license`, 4096)
```

### m318 New

```js
string(pack.attribution.license, `${path}.attribution.license`, 4095)
```

### m318 Test

```text
[director-078] The attribution accepts its text limits and rejects excess text
Output: KILLED [director-078] The attribution accepts its text limits and rejects excess text
```

## m319

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m319-old) | [New code](#m319-new) | KILLED | [Test record](#m319-test) |

### m319 Old

```js
string(url, at, 2048)
```

### m319 New

```js
string(url, at, 2047)
```

### m319 Test

```text
[director-078] The attribution accepts its text limits and rejects excess text
Output: KILLED [director-078] The attribution accepts its text limits and rejects excess text
```

## m320

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m320-old) | [New code](#m320-new) | KILLED | [Test record](#m320-test) |

### m320 Old

```js
string(value, path, 1024)
```

### m320 New

```js
string(value, path, 1023)
```

### m320 Test

```text
[director-076] The asset path accepts 1024 characters and rejects 1025
Output: KILLED [director-076] The asset path accepts 1024 characters and rejects 1025
```

## m321

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m321-old) | [New code](#m321-new) | KILLED | [Test record](#m321-test) |

### m321 Old

```js
.every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))
```

### m321 New

```js
.every(() => true)
```

### m321 Test

```text
[director-076] The asset path rejects URL syntax with a stable message
Output: KILLED [director-076] The asset path rejects URL syntax with a stable message
```

## m322

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m322-old) | [New code](#m322-new) | KILLED | [Test record](#m322-test) |

### m322 Old

```js
packs.length > PACK_LIMITS.packs
```

### m322 New

```js
packs.length >= PACK_LIMITS.packs
```

### m322 Test

```text
[director-088] The session accepts eight data packs
Output: KILLED [director-088] The session accepts eight data packs
```

## m323

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m323-old) | [New code](#m323-new) | KILLED | [Test record](#m323-test) |

### m323 Old

```js
bytes.length > PACK_LIMITS.bytes
```

### m323 New

```js
bytes.length >= PACK_LIMITS.bytes
```

### m323 Test

```text
[director-093] The session accepts the asset byte limit
Output: KILLED [director-093] The session accepts the asset byte limit
```

## m324

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m324-old) | [New code](#m324-new) | KILLED | [Test record](#m324-test) |

### m324 Old

```js
total > PACK_LIMITS.totalBytes
```

### m324 New

```js
total >= PACK_LIMITS.totalBytes
```

### m324 Test

```text
[director-093] The session accepts the total byte limit
Output: KILLED [director-093] The session accepts the total byte limit
```

## m325

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m325-old) | [New code](#m325-new) | KILLED | [Test record](#m325-test) |

### m325 Old

```js
path: pack.source.path,
```

### m325 New

```js
path: 'wrong',
```

### m325 Test

```text
[director-093] The source receives the path and the renderer receives the asset and signal
Output: KILLED [director-093] The source receives the path and the renderer receives the asset and signal
```

## m326

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m326-old) | [New code](#m326-new) | KILLED | [Test record](#m326-test) |

### m326 Old

```js
adapter({ pack, asset, anchors, signal: controller.signal })
```

### m326 New

```js
adapter({ pack, anchors, signal: controller.signal })
```

### m326 Test

```text
[director-093] The source receives the path and the renderer receives the asset and signal
Output: KILLED [director-093] The source receives the path and the renderer receives the asset and signal
```

## m327

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m327-old) | [New code](#m327-new) | KILLED | [Test record](#m327-test) |

### m327 Old

```js
adapter({ pack, asset, anchors, signal: controller.signal })
```

### m327 New

```js
adapter({ pack, asset, anchors })
```

### m327 Test

```text
[director-093] The source receives the path and the renderer receives the asset and signal
Output: KILLED [director-093] The source receives the path and the renderer receives the asset and signal
```

## m328

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m328-old) | [New code](#m328-new) | KILLED | [Test record](#m328-test) |

### m328 Old

```js
        clearTimeout(run.timer);
```

### m328 New

```js
        /* timer */
```

### m328 Test

```text
[director-089] The session removes its deadline after success
Output: KILLED [director-089] The session removes its deadline after success
```

## m329

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m329-old) | [New code](#m329-new) | KILLED | [Test record](#m329-test) |

### m329 Old

```js

    clearTimeout(run.timer);
```

### m329 New

```js

    /* timer */
```

### m329 Test

```text
[director-089] The session removes its deadline after clear
Output: KILLED [director-089] The session removes its deadline after clear
```

## m330

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m330-old) | [New code](#m330-new) | KILLED | [Test record](#m330-test) |

### m330 Old

```js
      packs.forEach((pack, i) =>
        validateDataPack(pack, `packs[${i}]`, anchorIds),
      );
```

### m330 New

```js

```

### m330 Test

```text
[director-088] The session checks every declaration before the source call
Output: KILLED [director-088] The session checks every declaration before the source call
```

## m331

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m331-old) | [New code](#m331-new) | KILLED | [Test record](#m331-test) |

### m331 Old

```js
for (const handle of run.handles.splice(0).reverse()) handle.dispose();
```

### m331 New

```js
for (const handle of []) handle.dispose();
```

### m331 Test

```text
[director-089] The session destroys each ready resource
Output: KILLED [director-089] The session destroys each ready resource
```

## m332

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m332-old) | [New code](#m332-new) | KILLED | [Test record](#m332-test) |

### m332 Old

```js
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

```js

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

### m332 Test

```text
[director-088] The session checks every declaration before the source call
Output: KILLED [director-088] The session checks every declaration before the source call
```

## m333

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m333-old) | [New code](#m333-new) | KILLED | [Test record](#m333-test) |

### m333 Old

```js
{ fatal: true }
```

### m333 New

```js
{}
```

### m333 Test

```text
[director-083] The decoder rejects invalid UTF8 bytes
Output: KILLED [director-083] The decoder rejects invalid UTF8 bytes
```

## m334

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m334-old) | [New code](#m334-new) | KILLED | [Test record](#m334-test) |

### m334 Old

```js
value?.type
```

### m334 New

```js
value.type
```

### m334 Test

```text
[director-083] The decoder rejects null
Output: KILLED [director-083] The decoder rejects null
```

## m335

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m335-old) | [New code](#m335-new) | KILLED | [Test record](#m335-test) |

### m335 Old

```js
feature?.id
```

### m335 New

```js
feature.id
```

### m335 Test

```text
[director-084] The decoder rejects a null feature
Output: KILLED [director-084] The decoder rejects a null feature
```

## m336

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m336-old) | [New code](#m336-new) | KILLED | [Test record](#m336-test) |

### m336 Old

```js
feature?.type
```

### m336 New

```js
feature.type
```

### m336 Test

```text
[director-084] The decoder rejects a null feature
Output: KILLED [director-084] The decoder rejects a null feature
```

## m337

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m337-old) | [New code](#m337-new) | KILLED | [Test record](#m337-test) |

### m337 Old

```js
g?.type === 'Point'
```

### m337 New

```js
g.type === 'Point'
```

### m337 Test

```text
[director-087] The decoder rejects absent geometry
Output: KILLED [director-087] The decoder rejects absent geometry
```

## m338

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m338-old) | [New code](#m338-new) | KILLED | [Test record](#m338-test) |

### m338 Old

```js
g?.type === 'LineString'
```

### m338 New

```js
g.type === 'LineString'
```

### m338 Test

```text
[director-087] The decoder rejects absent geometry
Output: KILLED [director-087] The decoder rejects absent geometry
```

## m339

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m339-old) | [New code](#m339-new) | KILLED | [Test record](#m339-test) |

### m339 Old

```js
g?.type === 'Polygon'
```

### m339 New

```js
g.type === 'Polygon'
```

### m339 Test

```text
[director-087] The decoder rejects absent geometry
Output: KILLED [director-087] The decoder rejects absent geometry
```

## m340

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m340-old) | [New code](#m340-new) | KILLED | [Test record](#m340-test) |

### m340 Old

```js
fetchImpl = globalThis.fetch
```

### m340 New

```js
fetchImpl = undefined
```

### m340 Test

```text
[director-095] The directory source uses the default fetch function
Output: KILLED [director-095] The directory source uses the default fetch function
```

## m341

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m341-old) | [New code](#m341-new) | KILLED | [Test record](#m341-test) |

### m341 Old

```js
bytes.length > PACK_LIMITS.bytes
```

### m341 New

```js
bytes.length >= PACK_LIMITS.bytes
```

### m341 Test

```text
[director-102] The export accepts the total byte limit and rejects one more byte
Output: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
```

## m342

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m342-old) | [New code](#m342-new) | KILLED | [Test record](#m342-test) |

### m342 Old

```js
total > PACK_LIMITS.totalBytes
```

### m342 New

```js
total >= PACK_LIMITS.totalBytes
```

### m342 Test

```text
[director-102] The export accepts the total byte limit and rejects one more byte
Output: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
```

## m343

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m343-old) | [New code](#m343-new) | KILLED | [Test record](#m343-test) |

### m343 Old

```js
value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

### m343 New

```js
value.length >= Math.ceil(PACK_LIMITS.bytes / 3) * 4
```

### m343 Test

```text
[director-099] The base64 accepts its length limit and rejects the next aligned length
Output: KILLED [director-099] The base64 accepts its length limit and rejects the next aligned length
```

## m344

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m344-old) | [New code](#m344-new) | KILLED | [Test record](#m344-test) |

### m344 Old

```js
file.size > limit
```

### m344 New

```js
file.size >= limit
```

### m344 Test

```text
[director-106] The share helpers accept the project file limit and reject one more byte
Output: KILLED [director-106] The share helpers accept the project file limit and reject one more byte
```

## m345

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m345-old) | [New code](#m345-new) | KILLED | [Test record](#m345-test) |

### m345 Old

```js
file.size > limit
```

### m345 New

```js
file.size >= limit
```

### m345 Test

```text
[director-106] The share helpers accept the bundle file limit and reject one more byte
Output: KILLED [director-106] The share helpers accept the bundle file limit and reject one more byte
```

## m346

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m346-old) | [New code](#m346-new) | KILLED | [Test record](#m346-test) |

### m346 Old

```js
      checkMime(asset.mimeType);
```

### m346 New

```js

```

### m346 Test

```text
[director-102] The export rejects an unsupported media type
Output: KILLED [director-102] The export rejects an unsupported media type
```

## m347

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m347-old) | [New code](#m347-new) | KILLED | [Test record](#m347-test) |

### m347 Old

```js
array(input.assets, 'assets', SHARE_LIMITS.assets);
```

### m347 New

```js

```

### m347 Test

```text
[director-099] The import rejects 65 different asset paths
Output: KILLED [director-099] The import rejects 65 different asset paths
```

## m348

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m348-old) | [New code](#m348-new) | KILLED | [Test record](#m348-test) |

### m348 Old

```js

    checkBytes(bytes, total);
```

### m348 New

```js

```

### m348 Test

```text
[director-099] The import accepts the total byte limit and rejects one more byte
Output: KILLED [director-099] The import accepts the total byte limit and rejects one more byte
```

## m349

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m349-old) | [New code](#m349-new) | KILLED | [Test record](#m349-test) |

### m349 Old

```js
total > PACK_LIMITS.totalBytes
```

### m349 New

```js
total > PACK_LIMITS.totalBytes + 1
```

### m349 Test

```text
[director-099] The import accepts the total byte limit and rejects one more byte
Output: KILLED [director-099] The import accepts the total byte limit and rejects one more byte
```

## m350

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m350-old) | [New code](#m350-new) | KILLED | [Test record](#m350-test) |

### m350 Old

```js
      checkAbort(signal);
      validateAssetPath(path);
```

### m350 New

```js
      validateAssetPath(path);
```

### m350 Test

```text
[director-105] The store rejects a cancelled source call
Output: KILLED [director-105] The store rejects a cancelled source call
```

## m351

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m351-old) | [New code](#m351-new) | KILLED | [Test record](#m351-test) |

### m351 Old

```js
    checkAbort(signal);
    fields(entry
```

### m351 New

```js
    fields(entry
```

### m351 Test

```text
[director-107] The bundle stops import before an asset
Output: KILLED [director-107] The bundle stops import before an asset
```

## m352

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m352-old) | [New code](#m352-new) | KILLED | [Test record](#m352-test) |

### m352 Old

```js
    checkAbort(signal);
    if (entry.sha256
```

### m352 New

```js
    if (entry.sha256
```

### m352 Test

```text
[director-107] The bundle stops import after a digest
Output: KILLED [director-107] The bundle stops import after a digest
```

## m353

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m353-old) | [New code](#m353-new) | KILLED | [Test record](#m353-test) |

### m353 Old

```js
    checkAbort(signal);
    const key
```

### m353 New

```js
    const key
```

### m353 Test

```text
[director-107] The bundle stops export before an asset
Output: KILLED [director-107] The bundle stops export before an asset
```

## m354

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m354-old) | [New code](#m354-new) | KILLED | [Test record](#m354-test) |

### m354 Old

```js
      checkAbort(signal);
      if (!asset)
```

### m354 New

```js
      if (!asset)
```

### m354 Test

```text
[director-107] The bundle stops export after asset bytes
Output: KILLED [director-107] The bundle stops export after asset bytes
```

## m355

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m355-old) | [New code](#m355-new) | KILLED | [Test record](#m355-test) |

### m355 Old

```js
      checkAbort(signal);
      if (
        (pack.byteLength
```

### m355 New

```js
      if (
        (pack.byteLength
```

### m355 Test

```text
[director-107] The bundle stops export after a digest
Output: KILLED [director-107] The bundle stops export after a digest
```

## m356

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m356-old) | [New code](#m356-new) | KILLED | [Test record](#m356-test) |

### m356 Old

```js
project.scenes.reduce((n, s) => n + s.shots.length, 0)
```

### m356 New

```js
project.scenes.length
```

### m356 Test

```text
[director-108] The preview counts shots apart from scenes
Output: KILLED [director-108] The preview counts shots apart from scenes
```

## m357

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m357-old) | [New code](#m357-new) | KILLED | [Test record](#m357-test) |

### m357 Old

```js
n + s.shots.length
```

### m357 New

```js
n + 1
```

### m357 Test

```text
[director-108] The preview counts shots apart from scenes
Output: KILLED [director-108] The preview counts shots apart from scenes
```

## m358

File: src/director/sharing/preview.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m358-old) | [New code](#m358-new) | KILLED | [Test record](#m358-test) |

### m358 Old

```js
...new Set(
        project.scenes.flatMap((s) =>
          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),
        ),
      )
```

### m358 New

```js
...project.scenes.flatMap((s) => s.shots.flatMap((shot) => Object.keys(shot.layers || {})))
```

### m358 Test

```text
[director-110] The preview lists distinct absent layers
Output: KILLED [director-110] The preview lists distinct absent layers
```

## m359

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m359-old) | [New code](#m359-new) | KILLED | [Test record](#m359-test) |

### m359 Old

```js
string(pack.id, `${path}.id`)
```

### m359 New

```js
string(pack.id, `${path}.id`, 255)
```

### m359 Test

```text
[director-077] The manifest accepts 256 characters for its ID and rejects 257
Output: KILLED [director-077] The manifest accepts 256 characters for its ID and rejects 257
```

## m360

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m360-old) | [New code](#m360-new) | KILLED | [Test record](#m360-test) |

### m360 Old

```js
string(pack.id, `${path}.id`)
```

### m360 New

```js
string(pack.id, `${path}.id`, 257)
```

### m360 Test

```text
[director-077] The manifest accepts 256 characters for its ID and rejects 257
Output: KILLED [director-077] The manifest accepts 256 characters for its ID and rejects 257
```

## m361

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m361-old) | [New code](#m361-new) | KILLED | [Test record](#m361-test) |

### m361 Old

```js
string(pack.source.adapter, `${path}.source.adapter`)
```

### m361 New

```js
string(pack.source.adapter, `${path}.source.adapter`, 255)
```

### m361 Test

```text
[director-077] The manifest accepts 256 characters for its source name and rejects 257
Output: KILLED [director-077] The manifest accepts 256 characters for its source name and rejects 257
```

## m362

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m362-old) | [New code](#m362-new) | KILLED | [Test record](#m362-test) |

### m362 Old

```js
string(pack.source.adapter, `${path}.source.adapter`)
```

### m362 New

```js
string(pack.source.adapter, `${path}.source.adapter`, 257)
```

### m362 Test

```text
[director-077] The manifest accepts 256 characters for its source name and rejects 257
Output: KILLED [director-077] The manifest accepts 256 characters for its source name and rejects 257
```

## m363

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m363-old) | [New code](#m363-new) | KILLED | [Test record](#m363-test) |

### m363 Old

```js
string(pack.attribution.text, `${path}.attribution.text`, 4096)
```

### m363 New

```js
string(pack.attribution.text, `${path}.attribution.text`, 4097)
```

### m363 Test

```text
[director-078] The attribution accepts its text limits and rejects excess text
Output: KILLED [director-078] The attribution accepts its text limits and rejects excess text
```

## m364

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m364-old) | [New code](#m364-new) | KILLED | [Test record](#m364-test) |

### m364 Old

```js
string(pack.attribution.license, `${path}.attribution.license`, 4096)
```

### m364 New

```js
string(pack.attribution.license, `${path}.attribution.license`, 4097)
```

### m364 Test

```text
[director-078] The attribution accepts its text limits and rejects excess text
Output: KILLED [director-078] The attribution accepts its text limits and rejects excess text
```

## m365

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m365-old) | [New code](#m365-new) | KILLED | [Test record](#m365-test) |

### m365 Old

```js
string(url, at, 2048)
```

### m365 New

```js
string(url, at, 2049)
```

### m365 Test

```text
[director-078] The attribution accepts its text limits and rejects excess text
Output: KILLED [director-078] The attribution accepts its text limits and rejects excess text
```

## m366

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m366-old) | [New code](#m366-new) | KILLED | [Test record](#m366-test) |

### m366 Old

```js
string(value, path, 1024)
```

### m366 New

```js
string(value, path, 1025)
```

### m366 Test

```text
[director-076] The asset path accepts 1024 characters and rejects 1025
Output: KILLED [director-076] The asset path accepts 1024 characters and rejects 1025
```

## m367

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m367-old) | [New code](#m367-new) | KILLED | [Test record](#m367-test) |

### m367 Old

```js
assets.length >= SHARE_LIMITS.assets
```

### m367 New

```js
assets.length > SHARE_LIMITS.assets
```

### m367 Test

```text
[director-102] The export rejects excess asset total
Output: KILLED [director-102] The export rejects excess asset total
```

## m368

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m368-old) | [New code](#m368-new) | KILLED | [Test record](#m368-test) |

### m368 Old

```js
Math.abs(p[0]) > 180
```

### m368 New

```js
p[0] > 180
```

### m368 Test

```text
[director-085] The position rejects negative longitude
Output: KILLED [director-085] The position rejects negative longitude
```

## m369

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m369-old) | [New code](#m369-new) | KILLED | [Test record](#m369-test) |

### m369 Old

```js
Math.abs(p[1]) > 90
```

### m369 New

```js
p[1] > 90
```

### m369 Test

```text
[director-085] The position rejects negative latitude
Output: KILLED [director-085] The position rejects negative latitude
```

## m370

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m370-old) | [New code](#m370-new) | KILLED | [Test record](#m370-test) |

### m370 Old

```js
Math.abs(p[0]) > 180
```

### m370 New

```js
Math.abs(p[0]) >= 180
```

### m370 Test

```text
[director-085] The position accepts the limit for negative longitude
Output: KILLED [director-085] The position accepts the limit for negative longitude
```

## m371

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m371-old) | [New code](#m371-new) | KILLED | [Test record](#m371-test) |

### m371 Old

```js
Math.abs(p[1]) > 90
```

### m371 New

```js
Math.abs(p[1]) >= 90
```

### m371 Test

```text
[director-085] The position accepts the limit for negative latitude
Output: KILLED [director-085] The position accepts the limit for negative latitude
```

## m372

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m372-old) | [New code](#m372-new) | KILLED | [Test record](#m372-test) |

### m372 Old

```js
![2, 3].includes(p.length)
```

### m372 New

```js
p.length < 2
```

### m372 Test

```text
[director-085] The position rejects four coordinates
Output: KILLED [director-085] The position rejects four coordinates
```

## m373

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m373-old) | [New code](#m373-new) | KILLED | [Test record](#m373-test) |

### m373 Old

```js
![2, 3].includes(p.length)
```

### m373 New

```js
p.length > 3
```

### m373 Test

```text
[director-085] The position rejects one coordinate
Output: KILLED [director-085] The position rejects one coordinate
```

## m374

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m374-old) | [New code](#m374-new) | KILLED | [Test record](#m374-test) |

### m374 Old

```js
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
```

### m374 New

```js
/[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
```

### m374 Test

```text
[director-076] The asset path rejects .x
Output: KILLED [director-076] The asset path rejects .x
```

## m375

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m375-old) | [New code](#m375-new) | KILLED | [Test record](#m375-test) |

### m375 Old

```js
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/
```

### m375 New

```js
/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*/
```

### m375 Test

```text
[director-076] The asset path rejects x?a=1
Output: KILLED [director-076] The asset path rejects x?a=1
```

## m376

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m376-old) | [New code](#m376-new) | KILLED | [Test record](#m376-test) |

### m376 Old

```js
number(v, at, 1, PACK_LIMITS.bytes, false)
```

### m376 New

```js
number(v, at, 2, PACK_LIMITS.bytes, false)
```

### m376 Test

```text
[director-079] The manifest accepts one byte
Output: KILLED [director-079] The manifest accepts one byte
```

## m377

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m377-old) | [New code](#m377-new) | KILLED | [Test record](#m377-test) |

### m377 Old

```js
array(p.bounds, `${at}.bounds`, 4);
```

### m377 New

```js
;
```

### m377 Test

```text
[director-080] The image rejects bounds outside an array
Output: KILLED [director-080] The image rejects bounds outside an array
```

## m378

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m378-old) | [New code](#m378-new) | KILLED | [Test record](#m378-test) |

### m378 Old

```js
array(packs, `${path}.dataPacks`, PACK_LIMITS.packs);
```

### m378 New

```js
array(packs, `${path}.dataPacks`, 9);
```

### m378 Test

```text
[director-082] The scene rejects nine distinct data packs
Output: KILLED [director-082] The scene rejects nine distinct data packs
```

## m379

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m379-old) | [New code](#m379-new) | KILLED | [Test record](#m379-test) |

### m379 Old

```js
array(packs, `${path}.dataPacks`, PACK_LIMITS.packs);
```

### m379 New

```js
array(packs, `${path}.dataPacks`, 7);
```

### m379 Test

```text
[director-082] The scene accepts eight distinct data packs
Output: KILLED [director-082] The scene accepts eight distinct data packs
```

## m380

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m380-old) | [New code](#m380-new) | KILLED | [Test record](#m380-test) |

### m380 Old

```js
status: 'loading'
```

### m380 New

```js
status: 'ready'
```

### m380 Test

```text
[director-089] The data pack session reports its state during asset work
Output: KILLED [director-089] The data pack session reports its state during asset work
```

## m381

File: src/director/packs/source.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m381-old) | [New code](#m381-new) | KILLED | [Test record](#m381-test) |

### m381 Old

```js
maxBytes = PACK_LIMITS.bytes
```

### m381 New

```js
maxBytes = PACK_LIMITS.bytes - 1
```

### m381 Test

```text
[director-096] The directory source accepts its default byte limit
Output: KILLED [director-096] The directory source accepts its default byte limit
```

## m382

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m382-old) | [New code](#m382-new) | KILLED | [Test record](#m382-test) |

### m382 Old

```js
text.length > SHARE_LIMITS.bytes
```

### m382 New

```js
text.length >= SHARE_LIMITS.bytes
```

### m382 Test

```text
[director-098] The bundle helpers accept the character limit
Output: KILLED [director-098] The bundle helpers accept the character limit
```

## m383

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m383-old) | [New code](#m383-new) | KILLED | [Test record](#m383-test) |

### m383 Old

```js
new TextEncoder().encode(text).length > SHARE_LIMITS.bytes
  )
```

### m383 New

```js
new TextEncoder().encode(text).length >= SHARE_LIMITS.bytes
  )
```

### m383 Test

```text
[director-098] The bundle helpers accept the multibyte text limit
Output: KILLED [director-098] The bundle helpers accept the multibyte text limit
```

## m384

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m384-old) | [New code](#m384-new) | KILLED | [Test record](#m384-test) |

### m384 Old

```js
return { project: parseSceneDocument(text), assets: new Map() };
```

### m384 New

```js
return { project: JSON.parse(text), assets: new Map() };
```

### m384 Test

```text
[director-098] The bundle helpers reject an invalid plain project
Output: KILLED [director-098] The bundle helpers reject an invalid plain project
```

## m385

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m385-old) | [New code](#m385-new) | KILLED | [Test record](#m385-test) |

### m385 Old

```js
input?.format !== 'gev-scene-bundle'
```

### m385 New

```js
input.format !== 'gev-scene-bundle'
```

### m385 Test

```text
[director-098] The bundle helpers reject a null project
Output: KILLED [director-098] The bundle helpers reject a null project
```

## m386

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m386-old) | [New code](#m386-new) | KILLED | [Test record](#m386-test) |

### m386 Old

```js
fields(input, '$', ['format', 'version', 'project', 'assets']);
```

### m386 New

```js
;
```

### m386 Test

```text
[director-099] The bundle helpers reject an extra top field
Output: KILLED [director-099] The bundle helpers reject an extra top field
```

## m387

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m387-old) | [New code](#m387-new) | KILLED | [Test record](#m387-test) |

### m387 Old

```js
const project = parseSceneDocument(JSON.stringify(input.project));
```

### m387 New

```js
const project = structuredClone(input.project);
```

### m387 Test

```text
[director-099] The bundle helpers reject an invalid bundle project
Output: KILLED [director-099] The bundle helpers reject an invalid bundle project
```

## m388

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m388-old) | [New code](#m388-new) | KILLED | [Test record](#m388-test) |

### m388 Old

```js
array(input.assets, 'assets', SHARE_LIMITS.assets);
```

### m388 New

```js
array(input.assets, 'assets', SHARE_LIMITS.assets - 1);
```

### m388 Test

```text
[director-099] The import accepts 64 distinct assets
Output: KILLED [director-099] The import accepts 64 distinct assets
```

## m389

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m389-old) | [New code](#m389-new) | EQUIVALENT | [Test record](#m389-test) |

### m389 Old

```js
const copy = parseSceneDocument(stringifySceneDocument(project));
```

### m389 New

```js
const copy = JSON.parse(stringifySceneDocument(project));
```

### m389 Test

```text
No failed repository test
Output: SURVIVED 
```

Probe: evidence/probe-export-parser.txt.
The serializer checks the same text before the repeated parser call.

## m390

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m390-old) | [New code](#m390-new) | KILLED | [Test record](#m390-test) |

### m390 Old

```js
resolveAsset(pack, { signal })
```

### m390 New

```js
resolveAsset(undefined, { signal })
```

### m390 Test

```text
[director-101] The resolver receives the data pack and signal
Output: KILLED [director-101] The resolver receives the data pack and signal
```

## m391

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m391-old) | [New code](#m391-new) | KILLED | [Test record](#m391-test) |

### m391 Old

```js
resolveAsset(pack, { signal })
```

### m391 New

```js
resolveAsset(pack, {})
```

### m391 Test

```text
[director-101] The resolver receives the data pack and signal
Output: KILLED [director-101] The resolver receives the data pack and signal
```

## m392

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m392-old) | [New code](#m392-new) | KILLED | [Test record](#m392-test) |

### m392 Old

```js
if (new TextEncoder().encode(text).length > SHARE_LIMITS.bytes)
```

### m392 New

```js
if (new TextEncoder().encode(text).length >= SHARE_LIMITS.bytes)
```

### m392 Test

```text
[director-102] The export accepts the text byte limit
Output: KILLED [director-102] The export accepts the text byte limit
```

## m393

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m393-old) | [New code](#m393-new) | KILLED | [Test record](#m393-test) |

### m393 Old

```js
asset.bytes.length > maxBytes
```

### m393 New

```js
asset.bytes.length >= maxBytes
```

### m393 Test

```text
[director-105] The byte store accepts the caller byte limit
Output: KILLED [director-105] The byte store accepts the caller byte limit
```

## m394

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m394-old) | [New code](#m394-new) | KILLED | [Test record](#m394-test) |

### m394 Old

```js
adapter({ pack, asset, anchors, signal: controller.signal })
```

### m394 New

```js
adapter({ asset, anchors, signal: controller.signal })
```

### m394 Test

```text
[director-093] The renderer receives the data pack and scene anchors
Output: KILLED [director-093] The renderer receives the data pack and scene anchors
```

## m395

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m395-old) | [New code](#m395-new) | KILLED | [Test record](#m395-test) |

### m395 Old

```js
adapter({ pack, asset, anchors, signal: controller.signal })
```

### m395 New

```js
adapter({ pack, asset, signal: controller.signal })
```

### m395 Test

```text
[director-093] The renderer receives the data pack and scene anchors
Output: KILLED [director-093] The renderer receives the data pack and scene anchors
```

## m396

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m396-old) | [New code](#m396-new) | KILLED | [Test record](#m396-test) |

### m396 Old

```js
signal.addEventListener('abort', abort, { once: true });
```

### m396 New

```js
signal.addEventListener('abort', abort);
```

### m396 Test

```text
[director-089] The data pack session removes source listeners after success
Output: KILLED [director-089] The data pack session removes source listeners after success
```

## m397

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m397-old) | [New code](#m397-new) | KILLED | [Test record](#m397-test) |

### m397 Old

```js
      (value) => {
        signal.removeEventListener('abort', abort);
```

### m397 New

```js
      (value) => {
```

### m397 Test

```text
[director-089] The data pack session removes source listeners after success
Output: KILLED [director-089] The data pack session removes source listeners after success
```

## m398

File: src/director/packs/session.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m398-old) | [New code](#m398-new) | KILLED | [Test record](#m398-test) |

### m398 Old

```js
      (error) => {
        signal.removeEventListener('abort', abort);
```

### m398 New

```js
      (error) => {
```

### m398 Test

```text
[director-089] The data pack session removes source listeners after error
Output: KILLED [director-089] The data pack session removes source listeners after error
```

## m399

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m399-old) | [New code](#m399-new) | KILLED | [Test record](#m399-test) |

### m399 Old

```js
number(v, at, 1, PACK_LIMITS.bytes, false)
```

### m399 New

```js
number(v, at, 1, PACK_LIMITS.bytes - 1, false)
```

### m399 Test

```text
[director-079] The manifest accepts its byte limit
Output: KILLED [director-079] The manifest accepts its byte limit
```

## m400

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m400-old) | [New code](#m400-new) | KILLED | [Test record](#m400-test) |

### m400 Old

```js
number(p.height, `${at}.height`, -12000, 1e9, false)
```

### m400 New

```js
number(p.height, `${at}.height`, -11999, 1e9, false)
```

### m400 Test

```text
[director-080] The image accepts its minimum height
Output: KILLED [director-080] The image accepts its minimum height
```

## m401

File: src/director/packs/manifest.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m401-old) | [New code](#m401-new) | KILLED | [Test record](#m401-test) |

### m401 Old

```js
number(p.height, `${at}.height`, -12000, 1e9, false)
```

### m401 New

```js
number(p.height, `${at}.height`, -12000, 1e9 - 1, false)
```

### m401 Test

```text
[director-080] The image accepts its maximum height
Output: KILLED [director-080] The image accepts its maximum height
```

## m402

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m402-old) | [New code](#m402-new) | KILLED | [Test record](#m402-test) |

### m402 Old

```js
p[2] < -12000
```

### m402 New

```js
p[2] <= -12000
```

### m402 Test

```text
[director-085] The position accepts its minimum height
Output: KILLED [director-085] The position accepts its minimum height
```

## m403

File: src/director/packs/geojson.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m403-old) | [New code](#m403-new) | KILLED | [Test record](#m403-test) |

### m403 Old

```js
p[2] > 1e9
```

### m403 New

```js
p[2] >= 1e9
```

### m403 Test

```text
[director-085] The position accepts its maximum height
Output: KILLED [director-085] The position accepts its maximum height
```

## m404

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m404-old) | [New code](#m404-new) | KILLED | [Test record](#m404-test) |

### m404 Old

```js
      signal.removeEventListener('abort', abort);
      reject(signal.reason);
```

### m404 New

```js
      reject(signal.reason);
```

### m404 Test

```text
[director-107] The share helpers remove the listener after cancel
Output: KILLED [director-107] The share helpers remove the listener after cancel
```

## m405

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m405-old) | [New code](#m405-new) | KILLED | [Test record](#m405-test) |

### m405 Old

```js
        signal.removeEventListener('abort', abort);
        signal.aborted
```

### m405 New

```js
        signal.aborted
```

### m405 Test

```text
[director-107] The share helpers remove the listener after success
Output: KILLED [director-107] The share helpers remove the listener after success
```

## m406

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m406-old) | [New code](#m406-new) | KILLED | [Test record](#m406-test) |

### m406 Old

```js
        signal.removeEventListener('abort', abort);
        reject(error);
```

### m406 New

```js
        reject(error);
```

### m406 Test

```text
[director-107] The share helpers remove the listener after error
Output: KILLED [director-107] The share helpers remove the listener after error
```

## m407

File: src/director/sharing/lifetime.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m407-old) | [New code](#m407-new) | KILLED | [Test record](#m407-test) |

### m407 Old

```js
signal.addEventListener('abort', abort, { once: true });
```

### m407 New

```js
signal.addEventListener('abort', abort);
```

### m407 Test

```text
[director-107] The share helpers remove the listener after success
Output: KILLED [director-107] The share helpers remove the listener after success
```

## m408

File: src/director/sharing/bundle.js

| Old | New | Result | Failed test |
| --- | --- | --- | --- |
| [Old code](#m408-old) | [New code](#m408-new) | KILLED | [Test record](#m408-test) |

### m408 Old

```js
const copy = parseSceneDocument(stringifySceneDocument(project));
```

### m408 New

```js
const copy = structuredClone(project);
```

### m408 Test

```text
[director-101] The export rejects an invalid project
Output: KILLED [director-101] The export rejects an invalid project
```

## Pass 4 complete command output

The command uses a scratch clone with the final test files.
The clone has all source dependencies and the same node_modules link.
The helper changes and restores only that clone.
The root production files stay unchanged.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-tools/director-3/pass4/hand-clone /home/ianblenke/docker/gev-tools/director-3/muts.json
```

The result is 406 killed rows and two survivors from 408 rows.
No row was skipped, timed out or crashed.
Row m284 now has a failed tagged repository test.
No row m409 or later is necessary.
The automatic campaign reproduces every new kill.

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
m071: KILLED [director-092] The data pack session reads the byteLength field once without a registered source
m072: KILLED [director-092] The absent renderer does not call its source
m073: KILLED [director-093] The session rejects bytes that are not a Uint8Array
m074: KILLED [director-093] The session rejects an empty asset
m075: KILLED [director-093] The session rejects an asset above the byte limit
m076: KILLED [director-093] The session rejects a wrong byteLength field
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
m099: KILLED [director-098] The bundle helpers reject nontext input
m100: KILLED [director-098] The bundle helpers reject invalid JSON
m101: KILLED [director-098] The bundle helpers accept plain project JSON
m102: KILLED [director-098] The bundle helpers reject excess characters
m103: KILLED [director-098] The bundle helpers reject excess UTF8 bytes
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
m114: KILLED [director-100] The bundle rejects a wrong byteLength field
m115: KILLED [director-100] The bundle rejects a pack digest that differs from its asset
m116: KILLED [director-100] The bundle rejects an asset digest that differs from its bytes
m117: KILLED [director-100] The bundle rejects unused assets
m118: KILLED [director-100] The bundle rejects external data pack sources
m119: KILLED [director-101] The export writes exact bundle metadata
m120: KILLED [director-102] The export rejects bytes that are not a Uint8Array
m121: KILLED [director-102] The export rejects an empty asset
m122: KILLED [director-102] The export rejects an asset above the byte limit
m123: KILLED [director-102] The export rejects absent assets
m124: KILLED [director-102] The export rejects declared byte length
m125: KILLED [director-102] The export rejects declared digest
m126: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
m127: KILLED [director-102] The export rejects excess asset total
m128: KILLED [director-103] The export reuses a shared asset
m129: KILLED [director-103] The export rejects shared byte length
m130: KILLED [director-103] The export rejects shared digest
m131: KILLED [director-104] The store copies the asset map
m132: KILLED [director-104] The store clears stored bytes
m133: KILLED [director-105] The store rejects absent bytes
m134: KILLED [director-105] The store rejects bytes above the caller limit
m135: KILLED [director-105] The store returns an independent byte copy
m136: KILLED [director-106] The share helpers accept an absent filename
m137: KILLED [director-106] The share helpers reject the ordinary file budget
m138: KILLED [director-106] The share helpers give bundles the larger budget
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
m153: KILLED [director-110] The preview detects the source pack ID of a shot
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
m233: KILLED [director-093] The session gives anchors to its renderer
m234: KILLED [director-106] The share helpers check a signal after text access
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
m246: KILLED [director-095 director-096 director-097] The directory source sends no credentials and rejects unsaf
m247: KILLED [director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints
m248: KILLED [director-089] The data pack session removes resources and cancels the transport on Stop
m249: KILLED [director-091] The data pack session replaces source work and ignores its late bytes
m250: KILLED [director-090] The data pack session disposes late renderer resources after cancellation and keeps t
m251: KILLED [director-090] The data pack session disposes a renderer resource when its signal stops after the re
m252: KILLED [director-092] The deadline stops a stalled registered source and a data pack error removes earlier 
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
m284: KILLED [director-088] The destroyed session does not read the caller signal state
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
m341: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
m342: KILLED [director-102] The export accepts the total byte limit and rejects one more byte
m343: KILLED [director-099] The base64 accepts its length limit and rejects the next aligned length
m344: KILLED [director-106] The share helpers accept the project file limit and reject one more byte
m345: KILLED [director-106] The share helpers accept the bundle file limit and reject one more byte
m346: KILLED [director-102] The export rejects an unsupported media type
m347: KILLED [director-099] The import rejects 65 different asset paths
m348: KILLED [director-099] The import accepts the total byte limit and rejects one more byte
m349: KILLED [director-099] The import accepts the total byte limit and rejects one more byte
m350: KILLED [director-105] The store rejects a cancelled source call
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
m368: KILLED [director-085] The position rejects negative longitude
m369: KILLED [director-085] The position rejects negative latitude
m370: KILLED [director-085] The position accepts the limit for negative longitude
m371: KILLED [director-085] The position accepts the limit for negative latitude
m372: KILLED [director-085] The position rejects four coordinates
m373: KILLED [director-085] The position rejects one coordinate
m374: KILLED [director-076] The asset path rejects .x
m375: KILLED [director-076] The asset path rejects x?a=1
m376: KILLED [director-079] The manifest accepts one byte
m377: KILLED [director-080] The image rejects bounds outside an array
m378: KILLED [director-082] The scene rejects nine distinct data packs
m379: KILLED [director-082] The scene accepts eight distinct data packs
m380: KILLED [director-089] The data pack session reports its state during asset work
m381: KILLED [director-096] The directory source accepts its default byte limit
m382: KILLED [director-098] The bundle helpers accept the character limit
m383: KILLED [director-098] The bundle helpers accept the multibyte text limit
m384: KILLED [director-098] The bundle helpers reject an invalid plain project
m385: KILLED [director-098] The bundle helpers reject a null project
m386: KILLED [director-099] The bundle helpers reject an extra top field
m387: KILLED [director-099] The bundle helpers reject an invalid bundle project
m388: KILLED [director-099] The import accepts 64 distinct assets
m389: SURVIVED 
m390: KILLED [director-101] The resolver receives the data pack and signal
m391: KILLED [director-101] The resolver receives the data pack and signal
m392: KILLED [director-102] The export accepts the text byte limit
m393: KILLED [director-105] The byte store accepts the caller byte limit
m394: KILLED [director-093] The renderer receives the data pack and scene anchors
m395: KILLED [director-093] The renderer receives the data pack and scene anchors
m396: KILLED [director-089] The data pack session removes source listeners after success
m397: KILLED [director-089] The data pack session removes source listeners after success
m398: KILLED [director-089] The data pack session removes source listeners after error
m399: KILLED [director-079] The manifest accepts its byte limit
m400: KILLED [director-080] The image accepts its minimum height
m401: KILLED [director-080] The image accepts its maximum height
m402: KILLED [director-085] The position accepts its minimum height
m403: KILLED [director-085] The position accepts its maximum height
m404: KILLED [director-107] The share helpers remove the listener after cancel
m405: KILLED [director-107] The share helpers remove the listener after success
m406: KILLED [director-107] The share helpers remove the listener after error
m407: KILLED [director-107] The share helpers remove the listener after success
m408: KILLED [director-101] The export rejects an invalid project
SURVIVORS: [('m172', 'SURVIVED'), ('m389', 'SURVIVED')]
```
