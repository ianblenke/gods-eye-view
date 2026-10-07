# Director code mutations

Pass 3 reads base commit `290b5d2`.

The complete command gives 257 changes.
Of these changes, 255 fail a repository test.
Rows m149 and m253 are equivalent for the public API.
The probe file is `evidence/probe-equivalent.txt`.
A patched built-in prototype is outside the API limit.
HTTPS means Hypertext Transfer Protocol Secure.

## m001

File: `src/director/camera.js`.

```text
Old:
if (!camera) return null;
New:
if (!camera) return {};
Selected test: [director-041] The absent camera returns null
Result: KILLED
Failed test: [director-041] The absent camera returns null
m001: KILLED [director-041] The absent camera returns null
```

## m002

File: `src/director/camera.js`.

```text
Old:
if (!shot?.move) return null;
New:
if (!shot?.move) return {};
Selected test: [director-041] The absent move returns null
Result: KILLED
Failed test: [director-041] The absent move returns null
m002: KILLED [director-041] The absent move returns null
```

## m003

File: `src/director/camera.js`.

```text
Old:
: camera;
New:
: {};
Selected test: [director-042] The inline pose copies each field
Result: KILLED
Failed test: [director-042] The inline pose copies each field
m003: KILLED [director-042] The inline pose copies each field
```

## m004

File: `src/director/camera.js`.

```text
Old:
id === camera.anchorId
New:
false
Selected test: [director-043] The anchor supplies the position
Result: KILLED
Failed test: [director-043] The anchor supplies the position
m004: KILLED [director-043] The anchor supplies the position
```

## m005

File: `src/director/camera.js`.

```text
Old:
if (!position) throw new Error('Camera anchor is unavailable');
New:
if (!position) return null;
Selected test: [director-043] The unknown anchor rejects the pose
Result: KILLED
Failed test: [director-043] The unknown anchor rejects the pose
m005: KILLED [director-043] The unknown anchor rejects the pose
```

## m006

File: `src/director/camera.js`.

```text
Old:
if (!position) throw new Error('Camera anchor is unavailable');
New:
if (!position) return null;
Selected test: [director-043] The pose rejects an absent scene
Result: KILLED
Failed test: [director-043] The pose rejects an absent scene
m006: KILLED [director-043] The pose rejects an absent scene
```

## m007

File: `src/director/camera.js`.

```text
Old:
if (!position) throw new Error('Camera anchor is unavailable');
New:
if (!position) return null;
Selected test: [director-043] The pose rejects an absent anchor list
Result: KILLED
Failed test: [director-043] The pose rejects an absent anchor list
m007: KILLED [director-043] The pose rejects an absent anchor list
```

## m008

File: `src/director/camera.js`.

```text
Old:
heading: camera.heading ?? 0
New:
heading: camera.heading ?? 9
Selected test: [director-044] The absent heading uses its default
Result: KILLED
Failed test: [director-044] The absent heading uses its default
m008: KILLED [director-044] The absent heading uses its default
```

## m009

File: `src/director/camera.js`.

```text
Old:
heading: camera.heading ?? 0
New:
heading: 9
Selected test: [director-044] The inline heading keeps zero
Result: KILLED
Failed test: [director-044] The inline heading keeps zero
m009: KILLED [director-044] The inline heading keeps zero
```

## m010

File: `src/director/camera.js`.

```text
Old:
pitch: camera.pitch ?? -35
New:
pitch: camera.pitch ?? 9
Selected test: [director-044] The absent pitch uses its default
Result: KILLED
Failed test: [director-044] The absent pitch uses its default
m010: KILLED [director-044] The absent pitch uses its default
```

## m011

File: `src/director/camera.js`.

```text
Old:
pitch: camera.pitch ?? -35
New:
pitch: 9
Selected test: [director-044] The inline pitch keeps zero
Result: KILLED
Failed test: [director-044] The inline pitch keeps zero
m011: KILLED [director-044] The inline pitch keeps zero
```

## m012

File: `src/director/camera.js`.

```text
Old:
roll: camera.roll ?? 0
New:
roll: camera.roll ?? 9
Selected test: [director-044] The absent roll uses its default
Result: KILLED
Failed test: [director-044] The absent roll uses its default
m012: KILLED [director-044] The absent roll uses its default
```

## m013

File: `src/director/camera.js`.

```text
Old:
roll: camera.roll ?? 0
New:
roll: 9
Selected test: [director-044] The inline roll keeps zero
Result: KILLED
Failed test: [director-044] The inline roll keeps zero
m013: KILLED [director-044] The inline roll keeps zero
```

## m014

File: `src/director/camera.js`.

```text
Old:
durationSec: shot.durationSec
New:
durationSec: 0
Selected test: [director-045] The move keeps both poses and time
Result: KILLED
Failed test: [director-045] The move keeps both poses and time
m014: KILLED [director-045] The move keeps both poses and time
```

## m015

File: `src/director/camera.js`.

```text
Old:
Math.max(0, Math.min(1, Number(progress) || 0))
New:
Math.min(1, Number(progress) || 0)
Selected test: [director-046] The progress accepts the lower bound
Result: KILLED
Failed test: [director-046] The progress accepts the lower bound
m015: KILLED [director-046] The progress accepts the lower bound
```

## m016

File: `src/director/camera.js`.

```text
Old:
Math.max(0, Math.min(1, Number(progress) || 0))
New:
Math.max(0, Number(progress) || 0)
Selected test: [director-046] The progress accepts the upper bound
Result: KILLED
Failed test: [director-046] The progress accepts the upper bound
m016: KILLED [director-046] The progress accepts the upper bound
```

## m017

File: `src/director/camera.js`.

```text
Old:
Number(progress) || 0
New:
Number(progress)
Selected test: [director-046] The progress accepts the invalid text
Result: KILLED
Failed test: [director-046] The progress accepts the invalid text
m017: KILLED [director-046] The progress accepts the invalid text
```

## m018

File: `src/director/camera.js`.

```text
Old:
Number(progress) || 0
New:
0
Selected test: [director-046] The progress accepts the numeric text
Result: KILLED
Failed test: [director-046] The progress accepts the numeric text
m018: KILLED [director-046] The progress accepts the numeric text
```

## m019

File: `src/director/camera.js`.

```text
Old:
if (t === 0) return { ...move.from };
New:
if (t === 0) return move.from;
Selected test: [director-046] The endpoint 0 returns an exact copy
Result: KILLED
Failed test: [director-046] The endpoint 0 returns an exact copy
m019: KILLED [director-046] The endpoint 0 returns an exact copy
```

## m020

File: `src/director/camera.js`.

```text
Old:
if (t === 1) return { ...move.to };
New:
if (t === 1) return move.to;
Selected test: [director-046] The endpoint 1 returns an exact copy
Result: KILLED
Failed test: [director-046] The endpoint 1 returns an exact copy
m020: KILLED [director-046] The endpoint 1 returns an exact copy
```

## m021

File: `src/director/camera.js`.

```text
Old:
lat: lerp(from.lat, to.lat)
New:
lat: from.lat
Selected test: [director-047] The linear sample sets lat
Result: KILLED
Failed test: [director-047] The linear sample sets lat
m021: KILLED [director-047] The linear sample sets lat
```

## m022

File: `src/director/camera.js`.

```text
Old:
lon: ((((angle(from.lon, to.lon) + 180) % 360) + 360) % 360) - 180
New:
lon: from.lon
Selected test: [director-047] The linear sample sets lon
Result: KILLED
Failed test: [director-047] The linear sample sets lon
m022: KILLED [director-047] The linear sample sets lon
```

## m023

File: `src/director/camera.js`.

```text
Old:
alt: lerp(from.alt, to.alt)
New:
alt: from.alt
Selected test: [director-047] The linear sample sets alt
Result: KILLED
Failed test: [director-047] The linear sample sets alt
m023: KILLED [director-047] The linear sample sets alt
```

## m024

File: `src/director/camera.js`.

```text
Old:
heading: angle(from.heading, to.heading)
New:
heading: from.heading
Selected test: [director-047] The linear sample sets heading
Result: KILLED
Failed test: [director-047] The linear sample sets heading
m024: KILLED [director-047] The linear sample sets heading
```

## m025

File: `src/director/camera.js`.

```text
Old:
pitch: lerp(from.pitch, to.pitch)
New:
pitch: from.pitch
Selected test: [director-047] The linear sample sets pitch
Result: KILLED
Failed test: [director-047] The linear sample sets pitch
m025: KILLED [director-047] The linear sample sets pitch
```

## m026

File: `src/director/camera.js`.

```text
Old:
roll: angle(from.roll, to.roll)
New:
roll: from.roll
Selected test: [director-047] The linear sample sets roll
Result: KILLED
Failed test: [director-047] The linear sample sets roll
m026: KILLED [director-047] The linear sample sets roll
```

## m027

File: `src/director/camera.js`.

```text
Old:
- 180) * eased
New:
+ 180) * eased
Selected test: [director-047] The angle tie takes the negative arc
Result: KILLED
Failed test: [director-047] The angle tie takes the negative arc
m027: KILLED [director-047] The angle tie takes the negative arc
```

## m028

File: `src/director/camera.js`.

```text
Old:
4 * t ** 3
New:
t
Selected test: [director-048] The cubic sample uses the first half
Result: KILLED
Failed test: [director-048] The cubic sample uses the first half
m028: KILLED [director-048] The cubic sample uses the first half
```

## m029

File: `src/director/camera.js`.

```text
Old:
1 - (-2 * t + 2) ** 3 / 2
New:
t
Selected test: [director-048] The cubic sample uses the second half
Result: KILLED
Failed test: [director-048] The cubic sample uses the second half
m029: KILLED [director-048] The cubic sample uses the second half
```

## m030

File: `src/director/camera.js`.

```text
Old:
move.easing === 'linear'
New:
false
Selected test: [director-047] The linear curve uses its supplied fraction
Result: KILLED
Failed test: [director-047] The linear curve uses its supplied fraction
m030: KILLED [director-047] The linear curve uses its supplied fraction
```

## m031

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-049] The shot without a move rejects invalid lat
Result: KILLED
Failed test: [director-049] The shot without a move rejects invalid lat
m031: KILLED [director-049] The shot without a move rejects invalid lat
```

## m032

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-053] The inline start needs lat
Result: KILLED
Failed test: [director-053] The inline start needs lat
m032: KILLED [director-053] The inline start needs lat
```

## m033

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-053] The inline end pose needs lat
Result: KILLED
Failed test: [director-053] The inline end pose needs lat
m033: KILLED [director-053] The inline end pose needs lat
```

## m034

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lon') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-049] The shot without a move rejects invalid lon
Result: KILLED
Failed test: [director-049] The shot without a move rejects invalid lon
m034: KILLED [director-049] The shot without a move rejects invalid lon
```

## m035

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lon') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-053] The inline start needs lon
Result: KILLED
Failed test: [director-053] The inline start needs lon
m035: KILLED [director-053] The inline start needs lon
```

## m036

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lon') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-053] The inline end pose needs lon
Result: KILLED
Failed test: [director-053] The inline end pose needs lon
m036: KILLED [director-053] The inline end pose needs lon
```

## m037

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'alt') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-049] The shot without a move rejects invalid alt
Result: KILLED
Failed test: [director-049] The shot without a move rejects invalid alt
m037: KILLED [director-049] The shot without a move rejects invalid alt
```

## m038

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'alt') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-053] The inline start needs alt
Result: KILLED
Failed test: [director-053] The inline start needs alt
m038: KILLED [director-053] The inline start needs alt
```

## m039

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'alt') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-053] The inline end pose needs alt
Result: KILLED
Failed test: [director-053] The inline end pose needs alt
m039: KILLED [director-053] The inline end pose needs alt
```

## m040

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'heading') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-050] The pose rejects invalid heading
Result: KILLED
Failed test: [director-050] The pose rejects invalid heading
m040: KILLED [director-050] The pose rejects invalid heading
```

## m041

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'pitch') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-050] The pose rejects invalid pitch
Result: KILLED
Failed test: [director-050] The pose rejects invalid pitch
m041: KILLED [director-050] The pose rejects invalid pitch
```

## m042

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'roll') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-050] The pose rejects invalid roll
Result: KILLED
Failed test: [director-050] The pose rejects invalid roll
m042: KILLED [director-050] The pose rejects invalid roll
```

## m043

File: `src/director/cameraDocument.js`.

```text
Old:
required || Object.hasOwn(value, key)
New:
true
Selected test: [director-050] The pose accepts absent orientation
Result: KILLED
Failed test: [director-050] The pose accepts absent orientation
m043: KILLED [director-050] The pose accepts absent orientation
```

## m044

File: `src/director/cameraDocument.js`.

```text
Old:
required || Object.hasOwn(value, key)
New:
true
Selected test: [director-049] The shot without a move accepts absent coordinates
Result: KILLED
Failed test: [director-049] The shot without a move accepts absent coordinates
m044: KILLED [director-049] The shot without a move accepts absent coordinates
```

## m045

File: `src/director/cameraDocument.js`.

```text
Old:
required || Object.hasOwn(value, key)
New:
Object.hasOwn(value, key)
Selected test: [director-053] The inline start needs all coordinates
Result: KILLED
Failed test: [director-053] The inline start needs all coordinates
m045: KILLED [director-053] The inline start needs all coordinates
```

## m046

File: `src/director/cameraDocument.js`.

```text
Old:
required || Object.hasOwn(value, key)
New:
required
Selected test: [director-050] The supplied orientation field controls the check
Result: KILLED
Failed test: [director-050] The supplied orientation field controls the check
m046: KILLED [director-050] The supplied orientation field controls the check
```

## m047

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, false);
Selected test: [director-051] The version 2 pose accepts text heading
Result: KILLED
Failed test: [director-051] The version 2 pose accepts text heading
m047: KILLED [director-051] The version 2 pose accepts text heading
```

## m048

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, true);
Selected test: [director-051] The version 3 pose rejects text heading
Result: KILLED
Failed test: [director-051] The version 3 pose rejects text heading
m048: KILLED [director-051] The version 3 pose rejects text heading
```

## m049

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, false);
Selected test: [director-051] The version 2 pose accepts text pitch
Result: KILLED
Failed test: [director-051] The version 2 pose accepts text pitch
m049: KILLED [director-051] The version 2 pose accepts text pitch
```

## m050

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, true);
Selected test: [director-051] The version 3 pose rejects text pitch
Result: KILLED
Failed test: [director-051] The version 3 pose rejects text pitch
m050: KILLED [director-051] The version 3 pose rejects text pitch
```

## m051

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, false);
Selected test: [director-051] The version 2 pose accepts text roll
Result: KILLED
Failed test: [director-051] The version 2 pose accepts text roll
m051: KILLED [director-051] The version 2 pose accepts text roll
```

## m052

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, true);
Selected test: [director-051] The version 3 pose rejects text roll
Result: KILLED
Failed test: [director-051] The version 3 pose rejects text roll
m052: KILLED [director-051] The version 3 pose rejects text roll
```

## m053

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, false);
Selected test: [director-051] The version 2 pose accepts text lat
Result: KILLED
Failed test: [director-051] The version 2 pose accepts text lat
m053: KILLED [director-051] The version 2 pose accepts text lat
```

## m054

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, true);
Selected test: [director-051] The version 3 pose rejects text lat
Result: KILLED
Failed test: [director-051] The version 3 pose rejects text lat
m054: KILLED [director-051] The version 3 pose rejects text lat
```

## m055

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, false);
Selected test: [director-051] The version 2 pose accepts text lon
Result: KILLED
Failed test: [director-051] The version 2 pose accepts text lon
m055: KILLED [director-051] The version 2 pose accepts text lon
```

## m056

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, true);
Selected test: [director-051] The version 3 pose rejects text lon
Result: KILLED
Failed test: [director-051] The version 3 pose rejects text lon
m056: KILLED [director-051] The version 3 pose rejects text lon
```

## m057

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, false);
Selected test: [director-051] The version 2 pose accepts text alt
Result: KILLED
Failed test: [director-051] The version 2 pose accepts text alt
m057: KILLED [director-051] The version 2 pose accepts text alt
```

## m058

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, true);
Selected test: [director-051] The version 3 pose rejects text alt
Result: KILLED
Failed test: [director-051] The version 3 pose rejects text alt
m058: KILLED [director-051] The version 3 pose rejects text alt
```

## m059

File: `src/director/cameraDocument.js`.

```text
Old:
version >= 4 && Object.hasOwn(value || {}, 'anchorId')
New:
Object.hasOwn(value || {}, 'anchorId')
Selected test: [director-051] The early version rejects an anchor reference
Result: KILLED
Failed test: [director-051] The early version rejects an anchor reference
m059: KILLED [director-051] The early version rejects an anchor reference
```

## m060

File: `src/director/cameraDocument.js`.

```text
Old:
version >= 4 && Object.hasOwn(value || {}, 'anchorId')
New:
false
Selected test: [director-051] The modern version accepts an anchor reference
Result: KILLED
Failed test: [director-051] The modern version accepts an anchor reference
m060: KILLED [director-051] The modern version accepts an anchor reference
```

## m061

File: `src/director/cameraDocument.js`.

```text
Old:
...(version >= 4 ? ['altitudeReference'] : [])
New:
...[]
Selected test: [director-055] The modern inline pose accepts its reference
Result: KILLED
Failed test: [director-055] The modern inline pose accepts its reference
m061: KILLED [director-055] The modern inline pose accepts its reference
```

## m062

File: `src/director/cameraDocument.js`.

```text
Old:
...(version >= 4 ? ['altitudeReference'] : [])
New:
...['altitudeReference']
Selected test: [director-051] The early version rejects the height field
Result: KILLED
Failed test: [director-051] The early version rejects the height field
m062: KILLED [director-051] The early version rejects the height field
```

## m063

File: `src/director/cameraDocument.js`.

```text
Old:
explicit || Object.hasOwn(value, 'altitudeReference')
New:
explicit
Selected test: [director-055] The supplied height reference controls the check
Result: KILLED
Failed test: [director-055] The supplied height reference controls the check
m063: KILLED [director-055] The supplied height reference controls the check
```

## m064

File: `src/director/cameraDocument.js`.

```text
Old:
explicit || Object.hasOwn(value, 'altitudeReference')
New:
Object.hasOwn(value, 'altitudeReference')
Selected test: [director-055] The inline endpoint needs a height reference
Result: KILLED
Failed test: [director-055] The inline endpoint needs a height reference
m064: KILLED [director-055] The inline endpoint needs a height reference
```

## m065

File: `src/director/cameraDocument.js`.

```text
Old:
if (value !== 'ellipsoid')
New:
if (true)
Selected test: [director-055] The ellipsoid reference accepts the pose
Result: KILLED
Failed test: [director-055] The ellipsoid reference accepts the pose
m065: KILLED [director-055] The ellipsoid reference accepts the pose
```

## m066

File: `src/director/cameraDocument.js`.

```text
Old:
if (!anchorIds.has(value.anchorId))
New:
if (false)
Selected test: [director-052] The anchor ID must name a scene anchor
Result: KILLED
Failed test: [director-052] The anchor ID must name a scene anchor
m066: KILLED [director-052] The anchor ID must name a scene anchor
```

## m067

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-052] The anchor rejects invalid lat
Result: KILLED
Failed test: [director-052] The anchor rejects invalid lat
m067: KILLED [director-052] The anchor rejects invalid lat
```

## m068

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lon') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-052] The anchor rejects invalid lon
Result: KILLED
Failed test: [director-052] The anchor rejects invalid lon
m068: KILLED [director-052] The anchor rejects invalid lon
```

## m069

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'alt') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-052] The anchor rejects invalid alt
Result: KILLED
Failed test: [director-052] The anchor rejects invalid alt
m069: KILLED [director-052] The anchor rejects invalid alt
```

## m070

File: `src/director/cameraDocument.js`.

```text
Old:
string(anchor.id, `${at}.id`);
      uniqueId(anchor, at, anchorIds);
New:

Selected test: [director-052] The anchor rejects invalid id
Result: KILLED
Failed test: [director-052] The anchor rejects invalid id
m070: KILLED [director-052] The anchor rejects invalid id
```

## m071

File: `src/director/cameraDocument.js`.

```text
Old:
optional(anchor, 'title', at, (v, p) => string(v, p, 4096));
New:

Selected test: [director-052] The anchor rejects invalid title
Result: KILLED
Failed test: [director-052] The anchor rejects invalid title
m071: KILLED [director-052] The anchor rejects invalid title
```

## m072

File: `src/director/cameraDocument.js`.

```text
Old:
reference(anchor.altitudeReference, `${at}.altitudeReference`);
New:

Selected test: [director-052] The anchor rejects invalid altitudeReference
Result: KILLED
Failed test: [director-052] The anchor rejects invalid altitudeReference
m072: KILLED [director-052] The anchor rejects invalid altitudeReference
```

## m073

File: `src/director/cameraDocument.js`.

```text
Old:
uniqueId(anchor, at, anchorIds);
New:
anchorIds.add(anchor.id);
Selected test: [director-052] The scene rejects duplicate anchor IDs
Result: KILLED
Failed test: [director-052] The scene rejects duplicate anchor IDs
m073: KILLED [director-052] The scene rejects duplicate anchor IDs
```

## m074

File: `src/director/cameraDocument.js`.

```text
Old:
array(anchors, field, 1024);
New:
array(anchors, field, 1025);
Selected test: [director-052] The scene rejects excess anchors
Result: KILLED
Failed test: [director-052] The scene rejects excess anchors
m074: KILLED [director-052] The scene rejects excess anchors
```

## m075

File: `src/director/cameraDocument.js`.

```text
Old:
if (!['linear', 'cubic-in-out'].includes(move.easing))
New:
if (false)
Selected test: [director-054] The move rejects an unsupported curve
Result: KILLED
Failed test: [director-054] The move rejects an unsupported curve
m075: KILLED [director-054] The move rejects an unsupported curve
```

## m076

File: `src/director/cameraDocument.js`.

```text
Old:
['linear', 'cubic-in-out']
New:
['cubic-in-out']
Selected test: [director-054] The move accepts the linear curve
Result: KILLED
Failed test: [director-054] The move accepts the linear curve
m076: KILLED [director-054] The move accepts the linear curve
```

## m077

File: `src/director/cameraDocument.js`.

```text
Old:
['linear', 'cubic-in-out']
New:
['linear']
Selected test: [director-054] The move accepts the cubic-in-out curve
Result: KILLED
Failed test: [director-054] The move accepts the cubic-in-out curve
m077: KILLED [director-054] The move accepts the cubic-in-out curve
```

## m078

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.durationSec, `${at}.durationSec`, 0.2, 86400, false);
New:

Selected test: [director-054] The move rejects durationSec lower excess
Result: KILLED
Failed test: [director-054] The move rejects durationSec lower excess
m078: KILLED [director-054] The move rejects durationSec lower excess
```

## m079

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.durationSec, `${at}.durationSec`, 0.2, 86400, false);
New:

Selected test: [director-054] The move rejects durationSec upper excess
Result: KILLED
Failed test: [director-054] The move rejects durationSec upper excess
m079: KILLED [director-054] The move rejects durationSec upper excess
```

## m080

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.durationSec, `${at}.durationSec`, 0.2, 86400, false);
New:

Selected test: [director-054] The move rejects durationSec text
Result: KILLED
Failed test: [director-054] The move rejects durationSec text
m080: KILLED [director-054] The move rejects durationSec text
```

## m081

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.durationSec, `${at}.durationSec`, 0.2, 86400, false);
New:

Selected test: [director-054] The move rejects durationSec absent value
Result: KILLED
Failed test: [director-054] The move rejects durationSec absent value
m081: KILLED [director-054] The move rejects durationSec absent value
```

## m082

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.durationSec, `${at}.durationSec`, 0.2, 86400, false);
New:
number(shot.durationSec, `${at}.durationSec`, 1.2, 86399, false);
Selected test: [director-054] The move accepts both durationSec bounds
Result: KILLED
Failed test: [director-054] The move accepts both durationSec bounds
m082: KILLED [director-054] The move accepts both durationSec bounds
```

## m083

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.holdSec, `${at}.holdSec`, 0, 86400, false);
New:

Selected test: [director-054] The move rejects holdSec lower excess
Result: KILLED
Failed test: [director-054] The move rejects holdSec lower excess
m083: KILLED [director-054] The move rejects holdSec lower excess
```

## m084

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.holdSec, `${at}.holdSec`, 0, 86400, false);
New:

Selected test: [director-054] The move rejects holdSec upper excess
Result: KILLED
Failed test: [director-054] The move rejects holdSec upper excess
m084: KILLED [director-054] The move rejects holdSec upper excess
```

## m085

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.holdSec, `${at}.holdSec`, 0, 86400, false);
New:

Selected test: [director-054] The move rejects holdSec text
Result: KILLED
Failed test: [director-054] The move rejects holdSec text
m085: KILLED [director-054] The move rejects holdSec text
```

## m086

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.holdSec, `${at}.holdSec`, 0, 86400, false);
New:

Selected test: [director-054] The move rejects holdSec absent value
Result: KILLED
Failed test: [director-054] The move rejects holdSec absent value
m086: KILLED [director-054] The move rejects holdSec absent value
```

## m087

File: `src/director/cameraDocument.js`.

```text
Old:
number(shot.holdSec, `${at}.holdSec`, 0, 86400, false);
New:
number(shot.holdSec, `${at}.holdSec`, 1, 86399, false);
Selected test: [director-054] The move accepts both holdSec bounds
Result: KILLED
Failed test: [director-054] The move accepts both holdSec bounds
m087: KILLED [director-054] The move accepts both holdSec bounds
```

## m088

File: `src/director/interactions/document.js`.

```text
Old:
packs.get(item.target.packId)?.format !== 'geojson' ||
          !shot.dataPackIds?.includes(item.target.packId)
New:
!shot.dataPackIds?.includes(item.target.packId)
Selected test: [director-056] The target rejects a different pack format
Result: KILLED
Failed test: [director-056] The target rejects a different pack format
m088: KILLED [director-056] The target rejects a different pack format
```

## m089

File: `src/director/interactions/document.js`.

```text
Old:
packs.get(item.target.packId)?.format !== 'geojson' ||
          !shot.dataPackIds?.includes(item.target.packId)
New:
packs.get(item.target.packId)?.format !== 'geojson'
Selected test: [director-056] The target rejects an unselected pack
Result: KILLED
Failed test: [director-056] The target rejects an unselected pack
m089: KILLED [director-056] The target rejects an unselected pack
```

## m090

File: `src/director/interactions/document.js`.

```text
Old:
!shot.dataPackIds?.includes(item.target.packId)
New:
false
Selected test: [director-056] The target rejects absent selected packs
Result: KILLED
Failed test: [director-056] The target rejects absent selected packs
m090: KILLED [director-056] The target rejects absent selected packs
```

## m091

File: `src/director/interactions/document.js`.

```text
Old:
scene.dataPacks || []
New:
scene.dataPacks || [{id:'p',format:'geojson'}]
Selected test: [director-056] The target rejects absent scene packs
Result: KILLED
Failed test: [director-056] The target rejects absent scene packs
m091: KILLED [director-056] The target rejects absent scene packs
```

## m092

File: `src/director/interactions/document.js`.

```text
Old:
scene.dataPacks || []
New:
[]
Selected test: [director-056] The target accepts a selected GeoJSON pack
Result: KILLED
Failed test: [director-056] The target accepts a selected GeoJSON pack
m092: KILLED [director-056] The target accepts a selected GeoJSON pack
```

## m093

File: `src/director/interactions/document.js`.

```text
Old:
scene.anchors || []
New:
scene.anchors || [{id:'a'}]
Selected test: [director-059] The focus rejects absent scene anchors
Result: KILLED
Failed test: [director-059] The focus rejects absent scene anchors
m093: KILLED [director-059] The focus rejects absent scene anchors
```

## m094

File: `src/director/interactions/document.js`.

```text
Old:
scene.anchors || []
New:
[]
Selected test: [director-059] The focus accepts a scene anchor
Result: KILLED
Failed test: [director-059] The focus accepts a scene anchor
m094: KILLED [director-059] The focus accepts a scene anchor
```

## m095

File: `src/director/interactions/document.js`.

```text
Old:
a.type === 'focus' && !anchors.has(a.anchorId)
New:
false
Selected test: [director-059] The focus rejects an unknown anchor
Result: KILLED
Failed test: [director-059] The focus rejects an unknown anchor
m095: KILLED [director-059] The focus rejects an unknown anchor
```

## m096

File: `src/director/interactions/document.js`.

```text
Old:
!a || !Object.hasOwn(specs, a.type)
New:
!Object.hasOwn(specs, a.type)
Selected test: [director-057] The action field rejects an absent object
Result: KILLED
Failed test: [director-057] The action field rejects an absent object
m096: KILLED [director-057] The action field rejects an absent object
```

## m097

File: `src/director/interactions/document.js`.

```text
Old:
!a || !Object.hasOwn(specs, a.type)
New:
!a
Selected test: [director-057] The action field rejects an unknown type
Result: KILLED
Failed test: [director-057] The action field rejects an unknown type
m097: KILLED [director-057] The action field rejects an unknown type
```

## m098

File: `src/director/interactions/document.js`.

```text
Old:
card: ['text', 'url'],
New:
card: ['url'],
Selected test: [director-057] The card action field accepts its text field
Result: KILLED
Failed test: [director-057] The card action field accepts its text field
m098: KILLED [director-057] The card action field accepts its text field
```

## m099

File: `src/director/interactions/document.js`.

```text
Old:
card: ['text', 'url'],
New:
card: ['text'],
Selected test: [director-057] The card action field accepts its url field
Result: KILLED
Failed test: [director-057] The card action field accepts its url field
m099: KILLED [director-057] The card action field accepts its url field
```

## m100

File: `src/director/interactions/document.js`.

```text
Old:
focus: ['anchorId'],
New:
focus: [],
Selected test: [director-057] The focus action field accepts its anchorId field
Result: KILLED
Failed test: [director-057] The focus action field accepts its anchorId field
m100: KILLED [director-057] The focus action field accepts its anchorId field
```

## m101

File: `src/director/interactions/document.js`.

```text
Old:
shot: ['shotId'],
New:
shot: [],
Selected test: [director-057] The shot action field accepts its shotId field
Result: KILLED
Failed test: [director-057] The shot action field accepts its shotId field
m101: KILLED [director-057] The shot action field accepts its shotId field
```

## m102

File: `src/director/interactions/document.js`.

```text
Old:
layer: ['layerId', 'enabled'],
New:
layer: ['enabled'],
Selected test: [director-057] The layer action field accepts its layerId field
Result: KILLED
Failed test: [director-057] The layer action field accepts its layerId field
m102: KILLED [director-057] The layer action field accepts its layerId field
```

## m103

File: `src/director/interactions/document.js`.

```text
Old:
layer: ['layerId', 'enabled'],
New:
layer: ['layerId'],
Selected test: [director-057] The layer action field accepts its enabled field
Result: KILLED
Failed test: [director-057] The layer action field accepts its enabled field
m103: KILLED [director-057] The layer action field accepts its enabled field
```

## m104

File: `src/director/interactions/document.js`.

```text
Old:
fields(a, `${field}.action`, ['type', ...specs[a.type]]);
New:

Selected test: [director-057] The action field rejects an unsupported field
Result: KILLED
Failed test: [director-057] The action field rejects an unsupported field
m104: KILLED [director-057] The action field rejects an unsupported field
```

## m105

File: `src/director/interactions/document.js`.

```text
Old:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
New:
parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
Selected test: [director-058] The card rejects a source protocol
Result: KILLED
Failed test: [director-058] The card rejects a source protocol
m105: KILLED [director-058] The card rejects a source protocol
```

## m106

File: `src/director/interactions/document.js`.

```text
Old:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
New:
parsed.protocol !== 'https:' ||
              parsed.password ||
              parsed.search ||
              parsed.hash
Selected test: [director-058] The card rejects a source user name
Result: KILLED
Failed test: [director-058] The card rejects a source user name
m106: KILLED [director-058] The card rejects a source user name
```

## m107

File: `src/director/interactions/document.js`.

```text
Old:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
New:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.search ||
              parsed.hash
Selected test: [director-058] The card rejects a source password
Result: KILLED
Failed test: [director-058] The card rejects a source password
m107: KILLED [director-058] The card rejects a source password
```

## m108

File: `src/director/interactions/document.js`.

```text
Old:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
New:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.hash
Selected test: [director-058] The card rejects a source query
Result: KILLED
Failed test: [director-058] The card rejects a source query
m108: KILLED [director-058] The card rejects a source query
```

## m109

File: `src/director/interactions/document.js`.

```text
Old:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
New:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search
Selected test: [director-058] The card rejects a source fragment
Result: KILLED
Failed test: [director-058] The card rejects a source fragment
m109: KILLED [director-058] The card rejects a source fragment
```

## m110

File: `src/director/interactions/document.js`.

```text
Old:
fail(at, 'expected HTTPS source URL');
New:
return;
Selected test: [director-058] The card rejects an invalid URL
Result: KILLED
Failed test: [director-058] The card rejects an invalid URL
m110: KILLED [director-058] The card rejects an invalid URL
```

## m111

File: `src/director/interactions/document.js`.

```text
Old:
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
New:
true
Selected test: [director-058] The card accepts a plain HTTPS source
Result: KILLED
Failed test: [director-058] The card accepts a plain HTTPS source
m111: KILLED [director-058] The card accepts a plain HTTPS source
```

## m112

File: `src/director/interactions/document.js`.

```text
Old:
if (reference) string(a[reference], `${field}.action.${reference}`);
New:

Selected test: [director-057] The action field rejects nontext anchorId
Result: KILLED
Failed test: [director-057] The action field rejects nontext anchorId
m112: KILLED [director-057] The action field rejects nontext anchorId
```

## m113

File: `src/director/interactions/document.js`.

```text
Old:
if (reference) string(a[reference], `${field}.action.${reference}`);
New:

Selected test: [director-057] The action field rejects nontext shotId
Result: KILLED
Failed test: [director-057] The action field rejects nontext shotId
m113: KILLED [director-057] The action field rejects nontext shotId
```

## m114

File: `src/director/interactions/document.js`.

```text
Old:
if (reference) string(a[reference], `${field}.action.${reference}`);
New:

Selected test: [director-057] The action field rejects nontext layerId
Result: KILLED
Failed test: [director-057] The action field rejects nontext layerId
m114: KILLED [director-057] The action field rejects nontext layerId
```

## m115

File: `src/director/interactions/document.js`.

```text
Old:
if (!target) fail(field, 'unknown shot');
New:
if (!target) return;
Selected test: [director-060] The shot action field rejects an unknown shot
Result: KILLED
Failed test: [director-060] The shot action field rejects an unknown shot
m115: KILLED [director-060] The shot action field rejects an unknown shot
```

## m116

File: `src/director/interactions/document.js`.

```text
Old:
entry?.action?.type === 'layer' &&
              !Object.hasOwn(target.layers || {}, entry.action.layerId)
New:
false
Selected test: [director-060] The target shot needs each layer baseline
Result: KILLED
Failed test: [director-060] The target shot needs each layer baseline
m116: KILLED [director-060] The target shot needs each layer baseline
```

## m117

File: `src/director/interactions/document.js`.

```text
Old:
entry?.action?.type === 'layer' &&
              !Object.hasOwn(target.layers || {}, entry.action.layerId)
New:
!Object.hasOwn(target.layers || {}, entry.action.layerId)
Selected test: [director-060] The target shot check skips a card action field
Result: KILLED
Failed test: [director-060] The target shot check skips a card action field
m117: KILLED [director-060] The target shot check skips a card action field
```

## m118

File: `src/director/interactions/document.js`.

```text
Old:
Object.hasOwn(target.layers || {}, entry.action.layerId)
New:
entry.action.layerId in (target.layers || {})
Selected test: [director-060] The target shot needs an own layer baseline
Result: KILLED
Failed test: [director-060] The target shot needs an own layer baseline
m118: KILLED [director-060] The target shot needs an own layer baseline
```

## m119

File: `src/director/interactions/document.js`.

```text
Old:
target.layers || {}
New:
target.layers || {traffic:false}
Selected test: [director-060] The absent target shot layers use an empty baseline
Result: KILLED
Failed test: [director-060] The absent target shot layers use an empty baseline
m119: KILLED [director-060] The absent target shot layers use an empty baseline
```

## m120

File: `src/director/interactions/document.js`.

```text
Old:
target.layers || {}
New:
{}
Selected test: [director-060] The target shot accepts every declared layer
Result: KILLED
Failed test: [director-060] The target shot accepts every declared layer
m120: KILLED [director-060] The target shot accepts every declared layer
```

## m121

File: `src/director/interactions/document.js`.

```text
Old:
Object.hasOwn(shot.layers || {}, a.layerId)
New:
a.layerId in (shot.layers || {})
Selected test: [director-061] The layer needs a direct shot baseline
Result: KILLED
Failed test: [director-061] The layer needs a direct shot baseline
m121: KILLED [director-061] The layer needs a direct shot baseline
```

## m122

File: `src/director/interactions/document.js`.

```text
Old:
shot.layers || {}
New:
shot.layers || {traffic:false}
Selected test: [director-061] The absent shot layers use an empty baseline
Result: KILLED
Failed test: [director-061] The absent shot layers use an empty baseline
m122: KILLED [director-061] The absent shot layers use an empty baseline
```

## m123

File: `src/director/interactions/document.js`.

```text
Old:
shot.layers || {}
New:
{}
Selected test: [director-061] The layer accepts a direct shot baseline
Result: KILLED
Failed test: [director-061] The layer accepts a direct shot baseline
m123: KILLED [director-061] The layer accepts a direct shot baseline
```

## m124

File: `src/director/interactions/document.js`.

```text
Old:
if (typeof a.enabled !== 'boolean')
New:
if (false)
Selected test: [director-061] The layer rejects a nonboolean state
Result: KILLED
Failed test: [director-061] The layer rejects a nonboolean state
m124: KILLED [director-061] The layer rejects a nonboolean state
```

## m125

File: `src/director/interactions/document.js`.

```text
Old:
string(item.id, field);
New:

Selected test: [director-062] The interaction rejects invalid id
Result: KILLED
Failed test: [director-062] The interaction rejects invalid id
m125: KILLED [director-062] The interaction rejects invalid id
```

## m126

File: `src/director/interactions/document.js`.

```text
Old:
string(item.label, field, 256);
New:

Selected test: [director-062] The interaction rejects invalid label
Result: KILLED
Failed test: [director-062] The interaction rejects invalid label
m126: KILLED [director-062] The interaction rejects invalid label
```

## m127

File: `src/director/interactions/document.js`.

```text
Old:
string(item.target.packId, field);
New:

Selected test: [director-062] The interaction rejects invalid packId
Result: KILLED
Failed test: [director-062] The interaction rejects invalid packId
m127: KILLED [director-062] The interaction rejects invalid packId
```

## m128

File: `src/director/interactions/document.js`.

```text
Old:
string(item.target.featureId, field);
New:

Selected test: [director-062] The interaction rejects invalid featureId
Result: KILLED
Failed test: [director-062] The interaction rejects invalid featureId
m128: KILLED [director-062] The interaction rejects invalid featureId
```

## m129

File: `src/director/interactions/document.js`.

```text
Old:
uniqueId(item, field, seen);
New:

Selected test: [director-062] The interaction rejects duplicate IDs
Result: KILLED
Failed test: [director-062] The interaction rejects duplicate IDs
m129: KILLED [director-062] The interaction rejects duplicate IDs
```

## m130

File: `src/director/interactions/document.js`.

```text
Old:
array(items, at, 64);
New:
array(items, at, 65);
Selected test: [director-062] The shot rejects excess interactions
Result: KILLED
Failed test: [director-062] The shot rejects excess interactions
m130: KILLED [director-062] The shot rejects excess interactions
```

## m131

File: `src/director/interactions/document.js`.

```text
Old:
string(a.text, field, 4096);
New:
string(a.text, field, 4097);
Selected test: [director-062] The card rejects excess text
Result: KILLED
Failed test: [director-062] The card rejects excess text
m131: KILLED [director-062] The card rejects excess text
```

## m132

File: `src/director/interactions/document.js`.

```text
Old:
string(url, at, 2048);
New:
string(url, at, 4096);
Selected test: [director-062] The card rejects excess URL text
Result: KILLED
Failed test: [director-062] The card rejects excess URL text
m132: KILLED [director-062] The card rejects excess URL text
```

## m133

File: `src/director/interactions/session.js`.

```text
Old:
active = false,
New:
active = true,
Selected test: [director-065] The new session reports empty state
Result: KILLED
Failed test: [director-065] The new session reports empty state
m133: KILLED [director-065] The new session reports empty state
```

## m134

File: `src/director/interactions/session.js`.

```text
Old:
active = !!actions.size;
New:
active = false;
Selected test: [director-066] The session activates every unique interaction
Result: KILLED
Failed test: [director-066] The session activates every unique interaction
m134: KILLED [director-066] The session activates every unique interaction
```

## m135

File: `src/director/interactions/session.js`.

```text
Old:
if (!active || busy || !item) return false;
New:
if (false) return false;
Selected test: [director-067] The inactive session refuses adapter call
Result: KILLED
Failed test: [director-067] The inactive session refuses adapter call
m135: KILLED [director-067] The inactive session refuses adapter call
```

## m136

File: `src/director/interactions/session.js`.

```text
Old:
!active || busy || !item
New:
!active || !item
Selected test: [director-068] The busy session refuses a second adapter call
Result: KILLED
Failed test: [director-068] The busy session refuses a second adapter call
m136: KILLED [director-068] The busy session refuses a second adapter call
```

## m137

File: `src/director/interactions/session.js`.

```text
Old:
!active || busy || !item
New:
!active || busy
Selected test: [director-069] The active session refuses an unknown ID
Result: KILLED
Failed test: [director-069] The active session refuses an unknown ID
m137: KILLED [director-069] The active session refuses an unknown ID
```

## m138

File: `src/director/interactions/session.js`.

```text
Old:
busy = true;
New:
busy = false;
Selected test: [director-070] The successful interaction gives idle state with the selected ID
Result: KILLED
Failed test: [director-070] The successful interaction gives idle state with the selected ID
m138: KILLED [director-070] The successful interaction gives idle state with the selected ID
```

## m139

File: `src/director/interactions/session.js`.

```text
Old:
(await Promise.race([work, cancelled])) !== false
New:
(await Promise.race([work, cancelled])) !== null
Selected test: [director-071] The false adapter result refuses the interaction
Result: KILLED
Failed test: [director-071] The false adapter result refuses the interaction
m139: KILLED [director-071] The false adapter result refuses the interaction
```

## m140

File: `src/director/interactions/session.js`.

```text
Old:
} catch {
        return false;
New:
} catch {
        return true;
Selected test: [director-072] The adapter exception allows another interaction
Result: KILLED
Failed test: [director-072] The adapter exception allows another interaction
m140: KILLED [director-072] The adapter exception allows another interaction
```

## m141

File: `src/director/interactions/session.js`.

```text
Old:
} catch {
        return false;
New:
} catch {
        return true;
Selected test: [director-072] The adapter rejection allows another interaction
Result: KILLED
Failed test: [director-072] The adapter rejection allows another interaction
m141: KILLED [director-072] The adapter rejection allows another interaction
```

## m142

File: `src/director/interactions/session.js`.

```text
Old:
if (current.signal.aborted) return false;
New:

Selected test: [director-073] The session cancels work before an adapter call
Result: KILLED
Failed test: [director-073] The session cancels work before an adapter call
m142: KILLED [director-073] The session cancels work before an adapter call
```

## m143

File: `src/director/interactions/session.js`.

```text
Old:
controller?.abort();
New:

Selected test: [director-073] The session settles work with no adapter result
Result: KILLED
Failed test: [director-073] The session settles work with no adapter result
m143: KILLED [director-073] The session settles work with no adapter result
```

## m144

File: `src/director/interactions/session.js`.

```text
Old:
if (controller === current) {
New:
if (true) {
Selected test: [director-074] The old work leaves new session state intact
Result: KILLED
Failed test: [director-074] The old work leaves new session state intact
m144: KILLED [director-074] The old work leaves new session state intact
```

## m145

File: `src/director/cameraDocument.js`.

```text
Old:
value || {}
New:
value
Selected test: [director-049] The null pose gives a document error
Result: KILLED
Failed test: [director-049] The null pose gives a document error
m145: KILLED [director-049] The null pose gives a document error
```

## m146

File: `src/director/cameraDocument.js`.

```text
Old:
string(anchor.id, `${at}.id`);
New:

Selected test: [director-052] The anchor check rejects a changed ID
Result: KILLED
Failed test: [director-052] The anchor check rejects a changed ID
m146: KILLED [director-052] The anchor check rejects a changed ID
```

## m147

File: `src/director/interactions/document.js`.

```text
Old:
entry?.action?.type === 'layer'
New:
entry.action?.type === 'layer'
Selected test: [director-060] The shot loop skips an absent entry
Result: KILLED
Failed test: [director-060] The shot loop skips an absent entry
m147: KILLED [director-060] The shot loop skips an absent entry
```

## m148

File: `src/director/interactions/document.js`.

```text
Old:
entry?.action?.type === 'layer'
New:
entry?.action.type === 'layer'
Selected test: [director-060] The shot loop skips an absent action field
Result: KILLED
Failed test: [director-060] The shot loop skips an absent action field
m148: KILLED [director-060] The shot loop skips an absent action field
```

## m149

File: `src/director/interactions/session.js`.

```text
Old:
!active || busy || !item
New:
busy || !item
Selected test: [director-067] The inactive session refuses adapter call
Result: EQUIVALENT
Failed test: None; the repository tests pass.
m149: SURVIVED 
```

The native Map holds no item while the session is inactive.
The getter, proxy, re-entrant callback and listener spy probe passes for this change.

## m150

File: `src/director/interactions/session.js`.

```text
Old:
!current.signal.aborted
        );
New:
true
        );
Selected test: [director-073] The session returns false when clear runs after the result
Result: KILLED
Failed test: [director-073] The session returns false when clear runs after the result
m150: KILLED [director-073] The session returns false when clear runs after the result
```

## m151

File: `src/director/interactions/session.js`.

```text
Old:
current.signal.removeEventListener('abort', abort);
New:

Selected test: [director-070] The interaction removes its abort listener
Result: KILLED
Failed test: [director-070] The interaction removes its abort listener
m151: KILLED [director-070] The interaction removes its abort listener
```

## m152

File: `src/director/interactions/document.js`.

```text
Old:
a.type === 'focus' && !anchors.has(a.anchorId)
New:
!anchors.has(a.anchorId)
Selected test: [director-061] The layer ignores an unrelated anchor ID
Result: KILLED
Failed test: [director-061] The layer ignores an unrelated anchor ID
m152: KILLED [director-061] The layer ignores an unrelated anchor ID
```

## m153

File: `src/director/cameraDocument.js`.

```text
Old:
...Object.keys(POSITION),
          ...(version >= 4
New:
...Object.keys(POSITION).filter(key => key !== 'lat'),
          ...(version >= 4
Selected test: [director-049] The inline schema accepts its lat field
Result: KILLED
Failed test: [director-049] The inline schema accepts its lat field
m153: KILLED [director-049] The inline schema accepts its lat field
```

## m154

File: `src/director/cameraDocument.js`.

```text
Old:
...Object.keys(POSITION),
          ...(version >= 4
New:
...Object.keys(POSITION).filter(key => key !== 'lon'),
          ...(version >= 4
Selected test: [director-049] The inline schema accepts its lon field
Result: KILLED
Failed test: [director-049] The inline schema accepts its lon field
m154: KILLED [director-049] The inline schema accepts its lon field
```

## m155

File: `src/director/cameraDocument.js`.

```text
Old:
...Object.keys(POSITION),
          ...(version >= 4
New:
...Object.keys(POSITION).filter(key => key !== 'alt'),
          ...(version >= 4
Selected test: [director-049] The inline schema accepts its alt field
Result: KILLED
Failed test: [director-049] The inline schema accepts its alt field
m155: KILLED [director-049] The inline schema accepts its alt field
```

## m156

File: `src/director/cameraDocument.js`.

```text
Old:
...Object.keys(ORIENTATION)
New:
...Object.keys(ORIENTATION).filter(key => key !== 'heading')
Selected test: [director-050] The inline schema accepts its heading field
Result: KILLED
Failed test: [director-050] The inline schema accepts its heading field
m156: KILLED [director-050] The inline schema accepts its heading field
```

## m157

File: `src/director/cameraDocument.js`.

```text
Old:
...Object.keys(ORIENTATION)
New:
...Object.keys(ORIENTATION).filter(key => key !== 'pitch')
Selected test: [director-050] The inline schema accepts its pitch field
Result: KILLED
Failed test: [director-050] The inline schema accepts its pitch field
m157: KILLED [director-050] The inline schema accepts its pitch field
```

## m158

File: `src/director/cameraDocument.js`.

```text
Old:
...Object.keys(ORIENTATION)
New:
...Object.keys(ORIENTATION).filter(key => key !== 'roll')
Selected test: [director-050] The inline schema accepts its roll field
Result: KILLED
Failed test: [director-050] The inline schema accepts its roll field
m158: KILLED [director-050] The inline schema accepts its roll field
```

## m159

File: `src/director/cameraDocument.js`.

```text
Old:
...(anchored
      ? ['anchorId']
New:
...(false
      ? ['anchorId']
Selected test: [director-051] The anchor shape uses its supplied reference field
Result: KILLED
Failed test: [director-051] The anchor shape uses its supplied reference field
m159: KILLED [director-051] The anchor shape uses its supplied reference field
```

## m160

File: `src/director/cameraDocument.js`.

```text
Old:
...(anchored
      ? ['anchorId']
New:
...(true
      ? ['anchorId']
Selected test: [director-055] The inline shape keeps its coordinate fields
Result: KILLED
Failed test: [director-055] The inline shape keeps its coordinate fields
m160: KILLED [director-055] The inline shape keeps its coordinate fields
```

## m161

File: `src/director/cameraDocument.js`.

```text
Old:
version >= 4 && Object.hasOwn(value || {}, 'anchorId')
New:
version >= 4
Selected test: [director-051] The inline pose controls its supplied shape
Result: KILLED
Failed test: [director-051] The inline pose controls its supplied shape
m161: KILLED [director-051] The inline pose controls its supplied shape
```

## m162

File: `src/director/cameraDocument.js`.

```text
Old:
if (anchored) {
New:
if (false) {
Selected test: [director-052] The anchor reference checks its ID
Result: KILLED
Failed test: [director-052] The anchor reference checks its ID
m162: KILLED [director-052] The anchor reference checks its ID
```

## m163

File: `src/director/interactions/document.js`.

```text
Old:
if (a.type === 'card') {
New:
if (false) {
Selected test: [director-057] The card type controls its text check
Result: KILLED
Failed test: [director-057] The card type controls its text check
m163: KILLED [director-057] The card type controls its text check
```

## m164

File: `src/director/interactions/document.js`.

```text
Old:
else if (a.type === 'shot') {
New:
else if (false) {
Selected test: [director-060] The shot type controls its reference check
Result: KILLED
Failed test: [director-060] The shot type controls its reference check
m164: KILLED [director-060] The shot type controls its reference check
```

## m165

File: `src/director/interactions/document.js`.

```text
Old:
else if (a.type === 'layer') {
New:
else if (false) {
Selected test: [director-061] The layer type controls its state check
Result: KILLED
Failed test: [director-061] The layer type controls its state check
m165: KILLED [director-061] The layer type controls its state check
```

## m166

File: `src/director/cameraDocument.js`.

```text
Old:
reference(anchor.altitudeReference, `${at}.altitudeReference`);
New:

Selected test: [director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
Result: KILLED
Failed test: [director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easing and unspecified altitude are rejected
m166: KILLED [director-052 director-054 director-055] unknown anchors, duplicate IDs, mixed references, bad easin
```

## m167

File: `src/director/camera.js`.

```text
Old:
4 * t ** 3
New:
t
Selected test: [director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
Result: KILLED
Failed test: [director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with scene seeking
m167: KILLED [director-046 director-047 director-048] move endpoints, easing, shortest arcs and hold agree with s
```

## m168

File: `src/director/cameraDocument.js`.

```text
Old:
pose(shot.camera, `${at}.camera`, version, anchorIds, true);
New:
pose(shot.camera, `${at}.camera`, version, anchorIds, true); shot.camera.heading = 99;
Selected test: [director-064] version 4 keeps anchor identity, references and move edits through normalization
Result: KILLED
Failed test: [director-064] version 4 keeps anchor identity, references and move edits through normalization
m168: KILLED [director-064] version 4 keeps anchor identity, references and move edits through normalization
```

## m169

File: `src/director/interactions/document.js`.

```text
Old:
string(a.text, field, 4096);
New:
string(a.text, field, 4096); a.text = "changed";
Selected test: [director-063] all four inert interactions survive validation, migration and export and no content runs
Result: KILLED
Failed test: [director-063] all four inert interactions survive validation, migration and export and no content runs
m169: KILLED [director-063] all four inert interactions survive validation, migration and export and no content r
```

## m170

File: `src/director/interactions/document.js`.

```text
Old:
if (typeof a.enabled !== 'boolean')
New:
if (false)
Selected test: [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines
Result: KILLED
Failed test: [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines
m170: KILLED [director-056 director-060 director-061] reject unknown fields, script syntax, invalid references an
```

## m171

File: `src/director/interactions/session.js`.

```text
Old:
controller?.abort();
New:

Selected test: [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session
Result: KILLED
Failed test: [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session
m171: KILLED [director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and ca
```

## m172

File: `src/director/interactions/session.js`.

```text
Old:
if (current.signal.aborted) return false;
New:

Selected test: [director-072 director-073] synchronous stop before an adapter call prevents any side effect; rejection unlocks retry
Result: KILLED
Failed test: [director-072 director-073] synchronous stop before an adapter call prevents any side effect; rejection unlocks retry
m172: KILLED [director-072 director-073] synchronous stop before an adapter call prevents any side effect; reject
```

## m173

File: `src/director/camera.js`.

```text
Old:
scene?.anchors?.find
New:
scene.anchors?.find
Selected test: [director-043] The pose rejects an absent scene
Result: KILLED
Failed test: [director-043] The pose rejects an absent scene
m173: KILLED [director-043] The pose rejects an absent scene
```

## m174

File: `src/director/camera.js`.

```text
Old:
scene?.anchors?.find
New:
scene?.anchors.find
Selected test: [director-043] The pose rejects an absent anchor list
Result: KILLED
Failed test: [director-043] The pose rejects an absent anchor list
m174: KILLED [director-043] The pose rejects an absent anchor list
```

## m175

File: `src/director/camera.js`.

```text
Old:
shot?.move
New:
shot.move
Selected test: [director-041] The absent move returns null
Result: KILLED
Failed test: [director-041] The absent move returns null
m175: KILLED [director-041] The absent move returns null
```

## m176

File: `src/director/interactions/document.js`.

```text
Old:
packs.get(item.target.packId)?.format
New:
packs.get(item.target.packId).format
Selected test: [director-056] The target rejects absent scene packs
Result: KILLED
Failed test: [director-056] The target rejects absent scene packs
m176: KILLED [director-056] The target rejects absent scene packs
```

## m177

File: `src/director/interactions/document.js`.

```text
Old:
shot.dataPackIds?.includes
New:
shot.dataPackIds.includes
Selected test: [director-056] The target rejects absent selected packs
Result: KILLED
Failed test: [director-056] The target rejects absent selected packs
m177: KILLED [director-056] The target rejects absent selected packs
```

## m178

File: `src/director/interactions/document.js`.

```text
Old:
for (const entry of items)
New:
for (const entry of items.filter(e => e.action?.layerId !== 'traffic'))
Selected test: [director-060] The target shot loop checks the traffic entry
Result: KILLED
Failed test: [director-060] The target shot loop checks the traffic entry
m178: KILLED [director-060] The target shot loop checks the traffic entry
```

## m179

File: `src/director/interactions/document.js`.

```text
Old:
for (const entry of items)
New:
for (const entry of items.filter(e => e.action?.layerId !== 'ships'))
Selected test: [director-060] The target shot loop checks the ships entry
Result: KILLED
Failed test: [director-060] The target shot loop checks the ships entry
m179: KILLED [director-060] The target shot loop checks the ships entry
```

## m180

File: `src/director/cameraDocument.js`.

```text
Old:
lat: [-90, 90]
New:
lat: [-89, 89]
Selected test: [director-049] The pose checks both lat bounds
Result: KILLED
Failed test: [director-049] The pose checks both lat bounds
m180: KILLED [director-049] The pose checks both lat bounds
```

## m181

File: `src/director/cameraDocument.js`.

```text
Old:
lon: [-180, 180]
New:
lon: [-179, 179]
Selected test: [director-049] The pose checks both lon bounds
Result: KILLED
Failed test: [director-049] The pose checks both lon bounds
m181: KILLED [director-049] The pose checks both lon bounds
```

## m182

File: `src/director/cameraDocument.js`.

```text
Old:
alt: [-12000, 1e9]
New:
alt: [-11999, 999999999]
Selected test: [director-049] The pose checks both alt bounds
Result: KILLED
Failed test: [director-049] The pose checks both alt bounds
m182: KILLED [director-049] The pose checks both alt bounds
```

## m183

File: `src/director/cameraDocument.js`.

```text
Old:
heading: [-360, 360]
New:
heading: [-359, 359]
Selected test: [director-050] The pose checks both heading bounds
Result: KILLED
Failed test: [director-050] The pose checks both heading bounds
m183: KILLED [director-050] The pose checks both heading bounds
```

## m184

File: `src/director/cameraDocument.js`.

```text
Old:
pitch: [-90, 90]
New:
pitch: [-89, 89]
Selected test: [director-050] The pose checks both pitch bounds
Result: KILLED
Failed test: [director-050] The pose checks both pitch bounds
m184: KILLED [director-050] The pose checks both pitch bounds
```

## m185

File: `src/director/cameraDocument.js`.

```text
Old:
roll: [-360, 360]
New:
roll: [-359, 359]
Selected test: [director-050] The pose checks both roll bounds
Result: KILLED
Failed test: [director-050] The pose checks both roll bounds
m185: KILLED [director-050] The pose checks both roll bounds
```

## m186

File: `src/director/cameraDocument.js`.

```text
Old:
pose(camera, field, version, anchorIds)
New:
(pose(camera, field, version, anchorIds), camera.pitch = -35)
Selected test: [director-064] The version 1 camera stays a shot without a move
Result: KILLED
Failed test: [director-064] The version 1 camera stays a shot without a move
m186: KILLED [director-064] The version 1 camera stays a shot without a move
```

## m187

File: `src/director/cameraDocument.js`.

```text
Old:
pose(camera, field, version, anchorIds)
New:
(pose(camera, field, version, anchorIds), camera.pitch = -35)
Selected test: [director-064] The version 2 camera stays a shot without a move
Result: KILLED
Failed test: [director-064] The version 2 camera stays a shot without a move
m187: KILLED [director-064] The version 2 camera stays a shot without a move
```

## m188

File: `src/director/cameraDocument.js`.

```text
Old:
pose(camera, field, version, anchorIds)
New:
(pose(camera, field, version, anchorIds), camera.pitch = -35)
Selected test: [director-064] The version 3 camera stays a shot without a move
Result: KILLED
Failed test: [director-064] The version 3 camera stays a shot without a move
m188: KILLED [director-064] The version 3 camera stays a shot without a move
```

## m189

File: `src/director/interactions/session.js`.

```text
Old:
selected = id;
New:
selected = null;
Selected test: [director-070] The successful interaction gives idle state with the selected ID
Result: KILLED
Failed test: [director-070] The successful interaction gives idle state with the selected ID
m189: KILLED [director-070] The successful interaction gives idle state with the selected ID
```

## m190

File: `src/director/interactions/session.js`.

```text
Old:
          busy = false;
New:
          busy = true;
Selected test: [director-070] The successful interaction gives idle state with the selected ID
Result: KILLED
Failed test: [director-070] The successful interaction gives idle state with the selected ID
m190: KILLED [director-070] The successful interaction gives idle state with the selected ID
```

## m191

File: `src/director/camera.js`.

```text
Old:
easing: shot.move.easing
New:
easing: "cubic-in-out"
Selected test: [director-045] The move keeps both poses and time
Result: KILLED
Failed test: [director-045] The move keeps both poses and time
m191: KILLED [director-045] The move keeps both poses and time
```

## m192

File: `src/director/camera.js`.

```text
Old:
from: resolveCameraPose(scene, shot.move.from)
New:
from: resolveCameraPose(scene, shot.camera)
Selected test: [director-045] The move keeps both poses and time
Result: KILLED
Failed test: [director-045] The move keeps both poses and time
m192: KILLED [director-045] The move keeps both poses and time
```

## m193

File: `src/director/camera.js`.

```text
Old:
to: resolveCameraPose(scene, shot.camera)
New:
to: resolveCameraPose(scene, shot.move.from)
Selected test: [director-045] The move keeps both poses and time
Result: KILLED
Failed test: [director-045] The move keeps both poses and time
m193: KILLED [director-045] The move keeps both poses and time
```

## m194

File: `src/director/camera.js`.

```text
Old:
lat: position.lat
New:
lat: 0
Selected test: [director-042] The inline pose copies each field
Result: KILLED
Failed test: [director-042] The inline pose copies each field
m194: KILLED [director-042] The inline pose copies each field
```

## m195

File: `src/director/camera.js`.

```text
Old:
lon: position.lon
New:
lon: 0
Selected test: [director-042] The inline pose copies each field
Result: KILLED
Failed test: [director-042] The inline pose copies each field
m195: KILLED [director-042] The inline pose copies each field
```

## m196

File: `src/director/camera.js`.

```text
Old:
alt: position.alt
New:
alt: 0
Selected test: [director-042] The inline pose copies each field
Result: KILLED
Failed test: [director-042] The inline pose copies each field
m196: KILLED [director-042] The inline pose copies each field
```

## m197

File: `src/director/cameraDocument.js`.

```text
Old:
if (anchored) {
New:
if (true) {
Selected test: [director-050] The pose accepts absent orientation
Result: KILLED
Failed test: [director-050] The pose accepts absent orientation
m197: KILLED [director-050] The pose accepts absent orientation
```

## m198

File: `src/director/interactions/session.js`.

```text
Old:
controller?.abort();
New:
controller.abort();
Selected test: [director-066] The session activates every unique interaction
Result: KILLED
Failed test: [director-066] The session activates every unique interaction
m198: KILLED [director-066] The session activates every unique interaction
```

## m199

File: `src/director/cameraDocument.js`.

```text
Old:
array(anchors, field, 1024);
New:
array(anchors, field, 1023);
Selected test: [director-052] The scene accepts the exact anchor limit
Result: KILLED
Failed test: [director-052] The scene accepts the exact anchor limit
m199: KILLED [director-052] The scene accepts the exact anchor limit
```

## m200

File: `src/director/cameraDocument.js`.

```text
Old:
string(anchor.id, `${at}.id`);
New:

Selected test: [director-052] The anchor rejects an absent ID
Result: KILLED
Failed test: [director-052] The anchor rejects an absent ID
m200: KILLED [director-052] The anchor rejects an absent ID
```

## m201

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lat') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-052] The anchor needs its lat coordinate
Result: KILLED
Failed test: [director-052] The anchor needs its lat coordinate
m201: KILLED [director-052] The anchor needs its lat coordinate
```

## m202

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'lon') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-052] The anchor needs its lon coordinate
Result: KILLED
Failed test: [director-052] The anchor needs its lon coordinate
m202: KILLED [director-052] The anchor needs its lon coordinate
```

## m203

File: `src/director/cameraDocument.js`.

```text
Old:
number(value[key], `${path}.${key}`, ...range, legacy);
New:
if (key !== 'alt') number(value[key], `${path}.${key}`, ...range, legacy);
Selected test: [director-052] The anchor needs its alt coordinate
Result: KILLED
Failed test: [director-052] The anchor needs its alt coordinate
m203: KILLED [director-052] The anchor needs its alt coordinate
```

## m204

File: `src/director/cameraDocument.js`.

```text
Old:
reference(anchor.altitudeReference, `${at}.altitudeReference`);
New:

Selected test: [director-052] The anchor needs its height reference
Result: KILLED
Failed test: [director-052] The anchor needs its height reference
m204: KILLED [director-052] The anchor needs its height reference
```

## m205

File: `src/director/interactions/document.js`.

```text
Old:
array(items, at, 64);
New:
array(items, at, 63);
Selected test: [director-062] The shot accepts the exact interaction limit
Result: KILLED
Failed test: [director-062] The shot accepts the exact interaction limit
m205: KILLED [director-062] The shot accepts the exact interaction limit
```

## m206

File: `src/director/interactions/document.js`.

```text
Old:
string(a.text, field, 4096);
New:
string(a.text, field, 4095);
Selected test: [director-062] The card accepts the exact text limit
Result: KILLED
Failed test: [director-062] The card accepts the exact text limit
m206: KILLED [director-062] The card accepts the exact text limit
```

## m207

File: `src/director/interactions/document.js`.

```text
Old:
string(url, at, 2048);
New:
string(url, at, 2047);
Selected test: [director-062] The card accepts the exact source limit
Result: KILLED
Failed test: [director-062] The card accepts the exact source limit
m207: KILLED [director-062] The card accepts the exact source limit
```

## m208

File: `src/director/cameraDocument.js`.

```text
Old:
pose(camera, field, version, anchorIds)
New:
(pose(camera, field, version, anchorIds), shot.move = {from: {lat:1, lon:2, alt:3, altitudeReference:"ellipsoid"}, easing:"linear"})
Selected test: [director-064] The version 1 camera stays a shot without a move
Result: KILLED
Failed test: [director-064] The version 1 camera stays a shot without a move
m208: KILLED [director-064] The version 1 camera stays a shot without a move
```

## m209

File: `src/director/cameraDocument.js`.

```text
Old:
pose(camera, field, version, anchorIds)
New:
(pose(camera, field, version, anchorIds), shot.move = {from: {lat:1, lon:2, alt:3, altitudeReference:"ellipsoid"}, easing:"linear"})
Selected test: [director-064] The version 2 camera stays a shot without a move
Result: KILLED
Failed test: [director-064] The version 2 camera stays a shot without a move
m209: KILLED [director-064] The version 2 camera stays a shot without a move
```

## m210

File: `src/director/cameraDocument.js`.

```text
Old:
pose(camera, field, version, anchorIds)
New:
(pose(camera, field, version, anchorIds), shot.move = {from: {lat:1, lon:2, alt:3, altitudeReference:"ellipsoid"}, easing:"linear"})
Selected test: [director-064] The version 3 camera stays a shot without a move
Result: KILLED
Failed test: [director-064] The version 3 camera stays a shot without a move
m210: KILLED [director-064] The version 3 camera stays a shot without a move
```

## m211

File: `src/director/interactions/document.js`.

```text
Old:
string(a.type, `${field}.action.type`);
New:

Selected test: [director-057] The action field rejects an array type
Result: KILLED
Failed test: [director-057] The action field rejects an array type
m211: KILLED [director-057] The action field rejects an array type
```

## m212

File: `src/director/cameraDocument.js`.

```text
Old:
explicit || Object.hasOwn(value, 'altitudeReference')
New:
Object.hasOwn(value, 'altitudeReference')
Selected test: [director-055] The end pose needs its height reference
Result: KILLED
Failed test: [director-055] The end pose needs its height reference
m212: KILLED [director-055] The end pose needs its height reference
```

## m213

File: `src/director/interactions/session.js`.

```text
Old:
current.signal.removeEventListener('abort', abort);
New:
current.signal.removeEventListener('abort', () => {});
Selected test: [director-070] The interaction removes its abort listener
Result: KILLED
Failed test: [director-070] The interaction removes its abort listener
m213: KILLED [director-070] The interaction removes its abort listener
```

## m214

File: `src/director/interactions/document.js`.

```text
Old:
typeof a.enabled !== 'boolean'
New:
a.enabled !== true
Selected test: [director-061] The layer accepts a false state
Result: KILLED
Failed test: [director-061] The layer accepts a false state
m214: KILLED [director-061] The layer accepts a false state
```

## m215

File: `src/director/cameraDocument.js`.

```text
Old:
? ['anchorId']
New:
? ['anchorId', 'lat']
Selected test: [director-075] The anchor pose rejects its inline lat field
Result: KILLED
Failed test: [director-075] The anchor pose rejects its inline lat field
m215: KILLED [director-075] The anchor pose rejects its inline lat field
```

## m216

File: `src/director/cameraDocument.js`.

```text
Old:
? ['anchorId']
New:
? ['anchorId', 'lon']
Selected test: [director-075] The anchor pose rejects its inline lon field
Result: KILLED
Failed test: [director-075] The anchor pose rejects its inline lon field
m216: KILLED [director-075] The anchor pose rejects its inline lon field
```

## m217

File: `src/director/cameraDocument.js`.

```text
Old:
? ['anchorId']
New:
? ['anchorId', 'alt']
Selected test: [director-075] The anchor pose rejects its inline alt field
Result: KILLED
Failed test: [director-075] The anchor pose rejects its inline alt field
m217: KILLED [director-075] The anchor pose rejects its inline alt field
```

## m218

File: `src/director/cameraDocument.js`.

```text
Old:
? ['anchorId']
New:
? ['anchorId', 'altitudeReference']
Selected test: [director-075] The anchor pose rejects its inline altitudeReference field
Result: KILLED
Failed test: [director-075] The anchor pose rejects its inline altitudeReference field
m218: KILLED [director-075] The anchor pose rejects its inline altitudeReference field
```

## m219

File: `src/director/interactions/session.js`.

```text
Old:
actions = new Map(items.map((item) => [item.id, item]));
New:
actions = new Map();
Selected test: [director-066] The session activates every unique interaction
Result: KILLED
Failed test: [director-066] The session activates every unique interaction
m219: KILLED [director-066] The session activates every unique interaction
```

## m220

File: `src/director/cameraDocument.js`.

```text
Old:
0.2, 86400, false
New:
0.1, 86400, false
Selected test: [director-054] The move rejects 0.19 seconds
Result: KILLED
Failed test: [director-054] The move rejects 0.19 seconds
m220: KILLED [director-054] The move rejects 0.19 seconds
```

## m221

File: `src/director/cameraDocument.js`.

```text
Old:
0.2, 86400, false
New:
0.3, 86400, false
Selected test: [director-054] The move accepts 0.2 seconds
Result: KILLED
Failed test: [director-054] The move accepts 0.2 seconds
m221: KILLED [director-054] The move accepts 0.2 seconds
```

## m222

File: `src/director/interactions/document.js`.

```text
Old:
string(url, at, 2048);
New:
string(url, at, 2047);
Selected test: [director-062] The card accepts 2048 URL characters
Result: KILLED
Failed test: [director-062] The card accepts 2048 URL characters
m222: KILLED [director-062] The card accepts 2048 URL characters
```

## m223

File: `src/director/interactions/document.js`.

```text
Old:
string(url, at, 2048);
New:
string(url, at, 2049);
Selected test: [director-062] The card rejects 2049 URL characters
Result: KILLED
Failed test: [director-062] The card rejects 2049 URL characters
m223: KILLED [director-062] The card rejects 2049 URL characters
```

## m224

File: `src/director/interactions/document.js`.

```text
Old:
fields(a, `${field}.action`, ['type', ...specs[a.type]]);
New:
if (a.type !== 'card') fields(a, `${field}.action`, ['type', ...specs[a.type]]);
Selected test: [director-057] The card action field rejects an extra field
Result: KILLED
Failed test: [director-057] The card action field rejects an extra field
m224: KILLED [director-057] The card action field rejects an extra field
```

## m225

File: `src/director/interactions/document.js`.

```text
Old:
fields(a, `${field}.action`, ['type', ...specs[a.type]]);
New:
if (a.type !== 'focus') fields(a, `${field}.action`, ['type', ...specs[a.type]]);
Selected test: [director-057] The focus action field rejects an extra field
Result: KILLED
Failed test: [director-057] The focus action field rejects an extra field
m225: KILLED [director-057] The focus action field rejects an extra field
```

## m226

File: `src/director/interactions/document.js`.

```text
Old:
fields(a, `${field}.action`, ['type', ...specs[a.type]]);
New:
if (a.type !== 'shot') fields(a, `${field}.action`, ['type', ...specs[a.type]]);
Selected test: [director-057] The shot action field rejects an extra field
Result: KILLED
Failed test: [director-057] The shot action field rejects an extra field
m226: KILLED [director-057] The shot action field rejects an extra field
```

## m227

File: `src/director/interactions/document.js`.

```text
Old:
fields(a, `${field}.action`, ['type', ...specs[a.type]]);
New:
if (a.type !== 'layer') fields(a, `${field}.action`, ['type', ...specs[a.type]]);
Selected test: [director-057] The layer action field rejects an extra field
Result: KILLED
Failed test: [director-057] The layer action field rejects an extra field
m227: KILLED [director-057] The layer action field rejects an extra field
```

## m228

File: `src/director/interactions/document.js`.

```text
Old:
fields(item, field, ['id', 'label', 'target', 'action']);
New:

Selected test: [director-057] The interaction rejects an extra field
Result: KILLED
Failed test: [director-057] The interaction rejects an extra field
m228: KILLED [director-057] The interaction rejects an extra field
```

## m229

File: `src/director/interactions/document.js`.

```text
Old:
fields(item.target, `${field}.target`, ['packId', 'featureId']);
New:

Selected test: [director-057] The target rejects an extra field
Result: KILLED
Failed test: [director-057] The target rejects an extra field
m229: KILLED [director-057] The target rejects an extra field
```

## m230

File: `src/director/cameraDocument.js`.

```text
Old:
fields(move, field, ['from', 'easing']);
New:

Selected test: [director-054] The move rejects an extra field
Result: KILLED
Failed test: [director-054] The move rejects an extra field
m230: KILLED [director-054] The move rejects an extra field
```

## m231

File: `src/director/cameraDocument.js`.

```text
Old:
fields(anchor, at, [
        'id',
        'title',
        ...Object.keys(POSITION),
        'altitudeReference',
      ]);
New:

Selected test: [director-052] The anchor rejects an extra field
Result: KILLED
Failed test: [director-052] The anchor rejects an extra field
m231: KILLED [director-052] The anchor rejects an extra field
```

## m232

File: `src/director/interactions/document.js`.

```text
Old:
string(item.label, field, 256);
New:
string(item.label, field, 255);
Selected test: [director-062] The label accepts 256 characters
Result: KILLED
Failed test: [director-062] The label accepts 256 characters
m232: KILLED [director-062] The label accepts 256 characters
```

## m233

File: `src/director/interactions/document.js`.

```text
Old:
string(item.label, field, 256);
New:
string(item.label, field, 257);
Selected test: [director-062] The label rejects 257 characters
Result: KILLED
Failed test: [director-062] The label rejects 257 characters
m233: KILLED [director-062] The label rejects 257 characters
```

## m234

File: `src/director/cameraDocument.js`.

```text
Old:
string(v, p, 4096)
New:
string(v, p, 4095)
Selected test: [director-052] The title accepts 4096 characters
Result: KILLED
Failed test: [director-052] The title accepts 4096 characters
m234: KILLED [director-052] The title accepts 4096 characters
```

## m235

File: `src/director/cameraDocument.js`.

```text
Old:
string(v, p, 4096)
New:
string(v, p, 4097)
Selected test: [director-052] The title rejects 4097 characters
Result: KILLED
Failed test: [director-052] The title rejects 4097 characters
m235: KILLED [director-052] The title rejects 4097 characters
```

## m236

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(anchor, at, POSITION, true, false);
New:
coordinates(anchor, at, POSITION, true, true);
Selected test: [director-052] The anchor rejects text coordinates in version 2
Result: KILLED
Failed test: [director-052] The anchor rejects text coordinates in version 2
m236: KILLED [director-052] The anchor rejects text coordinates in version 2
```

## m237

File: `src/director/camera.js`.

```text
Old:
t < 0.5
New:
t < 0.4
Selected test: [director-048] The cubic sample uses progress 0.45
Result: KILLED
Failed test: [director-048] The cubic sample uses progress 0.45
m237: KILLED [director-048] The cubic sample uses progress 0.45
```

## m238

File: `src/director/camera.js`.

```text
Old:
((((angle(from.lon, to.lon) + 180) % 360) + 360) % 360) - 180
New:
((angle(from.lon, to.lon) + 180) % 360) - 180
Selected test: [director-047] The westward sample crosses the date line
Result: KILLED
Failed test: [director-047] The westward sample crosses the date line
m238: KILLED [director-047] The westward sample crosses the date line
```

## m239

File: `src/director/camera.js`.

```text
Old:
((((b - a + 540) % 360) + 360) % 360)
New:
((b - a + 540) % 360)
Selected test: [director-047] The westward sample crosses the date line
Result: KILLED
Failed test: [director-047] The westward sample crosses the date line
m239: KILLED [director-047] The westward sample crosses the date line
```

## m240

File: `src/director/camera.js`.

```text
Old:
camera.heading ?? 0
New:
camera.heading || 0
Selected test: [director-044] The heading keeps negative zero from a getter
Result: KILLED
Failed test: [director-044] The heading keeps negative zero from a getter
m240: KILLED [director-044] The heading keeps negative zero from a getter
```

## m241

File: `src/director/camera.js`.

```text
Old:
camera.roll ?? 0
New:
camera.roll || 0
Selected test: [director-044] The roll keeps negative zero from a getter
Result: KILLED
Failed test: [director-044] The roll keeps negative zero from a getter
m241: KILLED [director-044] The roll keeps negative zero from a getter
```

## m242

File: `src/director/interactions/session.js`.

```text
Old:
(await Promise.race([work, cancelled])) !== false
New:
(await Promise.race([work, cancelled])) != false
Selected test: [director-070] The adapter result zero gives true
Result: KILLED
Failed test: [director-070] The adapter result zero gives true
m242: KILLED [director-070] The adapter result zero gives true
```

## m243

File: `src/director/interactions/session.js`.

```text
Old:
(await Promise.race([work, cancelled])) !== false
New:
(await Promise.race([work, cancelled])) != false
Selected test: [director-070] The adapter result empty text gives true
Result: KILLED
Failed test: [director-070] The adapter result empty text gives true
m243: KILLED [director-070] The adapter result empty text gives true
```

## m244

File: `src/director/interactions/session.js`.

```text
Old:
changed = () => {}
New:
changed = undefined
Selected test: [director-065] The default state callback accepts a session change
Result: KILLED
Failed test: [director-065] The default state callback accepts a session change
m244: KILLED [director-065] The default state callback accepts a session change
```

## m245

File: `src/director/cameraDocument.js`.

```text
Old:
explicit = false
New:
explicit = true
Selected test: [director-049] The shot without a move uses optional coordinates by default
Result: KILLED
Failed test: [director-049] The shot without a move uses optional coordinates by default
m245: KILLED [director-049] The shot without a move uses optional coordinates by default
```

## m246

File: `src/director/interactions/session.js`.

```text
Old:
    controller = null;
    changed(state());
New:
    changed(state());
Selected test: [director-073] The session does not abort the old abort controller when clear runs twice
Result: KILLED
Failed test: [director-073] The session does not abort the old abort controller when clear runs twice
m246: KILLED [director-073] The session does not abort the old abort controller when clear runs twice
```

## m247

File: `src/director/interactions/session.js`.

```text
Old:
          controller = null;
New:

Selected test: [director-070] The session does not abort a completed abort controller when clear runs
Result: KILLED
Failed test: [director-070] The session does not abort a completed abort controller when clear runs
m247: KILLED [director-070] The session does not abort a completed abort controller when clear runs
```

## m248

File: `src/director/cameraDocument.js`.

```text
Old:
  fields(value, path, [
    ...Object.keys(ORIENTATION),
    ...(anchored
      ? ['anchorId']
      : [
          ...Object.keys(POSITION),
          ...(version >= 4 ? ['altitudeReference'] : []),
        ]),
  ]);
New:

Selected test: [director-049] The pose rejects an extra field
Result: KILLED
Failed test: [director-049] The pose rejects an extra field
m248: KILLED [director-049] The pose rejects an extra field
```

## m249

File: `src/director/interactions/session.js`.

```text
Old:
    controller = null;
    changed(state());
New:
    controller = null;
Selected test: [director-073] The state callback receives empty state after clear
Result: KILLED
Failed test: [director-073] The state callback receives empty state after clear
m249: KILLED [director-073] The state callback receives empty state after clear
```

## m250

File: `src/director/camera.js`.

```text
Old:
t < 0.5
New:
t < 0.6
Selected test: [director-048] The cubic sample uses progress 0.55
Result: KILLED
Failed test: [director-048] The cubic sample uses progress 0.55
m250: KILLED [director-048] The cubic sample uses progress 0.55
```

## m251

File: `src/director/camera.js`.

```text
Old:
t < 0.5
New:
t < 0.75
Selected test: [director-048] The cubic sample uses progress 0.55
Result: KILLED
Failed test: [director-048] The cubic sample uses progress 0.55
m251: KILLED [director-048] The cubic sample uses progress 0.55
```

## m252

File: `src/director/interactions/session.js`.

```text
Old:
abort = () => resolve(false);
New:
abort = () => resolve(true);
Selected test: [director-073] The abort event gives false before the signal changes
Result: KILLED
Failed test: [director-073] The abort event gives false before the signal changes
m252: KILLED [director-073] The abort event gives false before the signal changes
```

## m253

File: `src/director/interactions/session.js`.

```text
Old:
if (current.signal.aborted) return false;
New:
if (current.signal.aborted) return true;
Selected test: All tests in src/director/interactions/session.test.mjs
Result: EQUIVALENT
Failed test: None; the repository tests pass.
m253: SURVIVED 
```

The final abort guard returns false before the adapter call.
The getter, proxy, re-entrant callback and listener spy probe passes for this change.

## m254

File: `src/director/interactions/session.js`.

```text
Old:
current.signal.addEventListener('abort', abort, { once: true });
New:
current.signal.addEventListener('abort', abort);
Selected test: [director-073] The abort event gives false before the signal changes
Result: KILLED
Failed test: [director-073] The abort event gives false before the signal changes
m254: KILLED [director-073] The abort event gives false before the signal changes
```

## m255

File: `src/director/interactions/document.js`.

```text
Old:
Object.hasOwn(specs, a.type)
New:
a.type in specs
Selected test: [director-057] The action field rejects an inherited type name
Result: KILLED
Failed test: [director-057] The action field rejects an inherited type name
m255: KILLED [director-057] The action field rejects an inherited type name
```

## m256

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, ORIENTATION, false, version < 3);
New:
coordinates(value, path, ORIENTATION, false, version === 2);
Selected test: [director-051] The version 1 pose accepts numeric text
Result: KILLED
Failed test: [director-051] The version 1 pose accepts numeric text
m256: KILLED [director-051] The version 1 pose accepts numeric text
```

## m257

File: `src/director/cameraDocument.js`.

```text
Old:
coordinates(value, path, POSITION, explicit, version < 3);
New:
coordinates(value, path, POSITION, explicit, version === 2);
Selected test: [director-051] The version 1 pose accepts numeric text
Result: KILLED
Failed test: [director-051] The version 1 pose accepts numeric text
m257: KILLED [director-051] The version 1 pose accepts numeric text
```

