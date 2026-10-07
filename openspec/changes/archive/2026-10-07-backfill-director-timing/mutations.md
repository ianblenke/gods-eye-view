# Director mutation evidence

Pass 3 read the base commit `290b5d2` and the working tree of the lead's branch.
The source comparison below gives no output.

```sh
cd /home/ianblenke/docker/gev-work/director && git diff --stat 290b5d2 origin/main -- 'src/director/*.js'
```

The final complete host check supplies each result below.
The tool restores each source file after its check.

## m001

File: `src/director/documentFields.js`.

```text
Old:
if (!value || typeof value !== 'object' || Array.isArray(value))
New:
if (false || typeof value !== 'object' || Array.isArray(value))
Selected test: [director-005] The object check rejects null
Result: KILLED
Failed test prefix: [director-005] The object check rejects null
```

## m002

File: `src/director/documentFields.js`.

```text
Old:
typeof value !== 'object' ||
New:
false ||
Selected test: [director-005] The object check rejects text
Result: KILLED
Failed test prefix: [director-005] The object check rejects text
```

## m003

File: `src/director/documentFields.js`.

```text
Old:
|| Array.isArray(value)
New:
|| false
Selected test: [director-005] The object check rejects an array
Result: KILLED
Failed test prefix: [director-005] The object check rejects an array
```

## m004

File: `src/director/documentFields.js`.

```text
Old:
!allowed.includes(key)
New:
false
Selected test: [director-005] The field check rejects each unsupported key
Result: KILLED
Failed test prefix: [director-005] The field check rejects each unsupported key
```

## m005

File: `src/director/documentFields.js`.

```text
Old:
typeof value !== 'string' ||
New:
false ||
Selected test: [director-006] The text check rejects numbers
Result: KILLED
Failed test prefix: [director-006] The text check rejects numbers
```

## m006

File: `src/director/documentFields.js`.

```text
Old:
!value.trim() ||
New:
false ||
Selected test: [director-006] The text check rejects blank text
Result: KILLED
Failed test prefix: [director-006] The text check rejects blank text
```

## m007

File: `src/director/documentFields.js`.

```text
Old:
if (typeof value !== 'string' || !value.trim() || value.length > max)
New:
if (typeof value !== 'string' || !value.trim() || false)
Selected test: [director-006] The text check rejects excess length
Result: KILLED
Failed test prefix: [director-006] The text check rejects excess length
```

## m008

File: `src/director/documentFields.js`.

```text
Old:
max = 256
New:
max = 0
Selected test: [director-006] The text check accepts the exact limit
Result: KILLED
Failed test prefix: [director-006] The text check accepts the exact limit
```

## m009

File: `src/director/documentFields.js`.

```text
Old:
typeof numeric !== 'number' ||
New:
false ||
Selected test: [director-007] The number check rejects text
Result: SURVIVED
Failed test prefix: <none>
```

## m010

File: `src/director/documentFields.js`.

```text
Old:
!Number.isFinite(numeric) ||
New:
false ||
Selected test: [director-007] The number check rejects NaN
Result: KILLED
Failed test prefix: [director-007] The number check rejects NaN
```

## m011

File: `src/director/documentFields.js`.

```text
Old:
numeric < min ||
New:
false ||
Selected test: [director-007] The number check rejects the lower excess
Result: KILLED
Failed test prefix: [director-007] The number check rejects the lower excess
```

## m012

File: `src/director/documentFields.js`.

```text
Old:
numeric > max
New:
false
Selected test: [director-007] The number check rejects the upper excess
Result: KILLED
Failed test prefix: [director-007] The number check rejects the upper excess
```

## m013

File: `src/director/documentFields.js`.

```text
Old:
legacy &&
New:
false &&
Selected test: [director-007] The legacy flag alone allows numeric text
Result: KILLED
Failed test prefix: [director-007] The legacy flag alone allows numeric text
```

## m014

File: `src/director/documentFields.js`.

```text
Old:
typeof value === 'string' &&
New:
true &&
Selected test: [director-007] The legacy number input keeps its type
Result: KILLED
Failed test prefix: [director-007] The legacy number input keeps its type
```

## m015

File: `src/director/documentFields.js`.

```text
Old:
&& value.trim() ?
New:
&& true ?
Selected test: [director-007] The legacy blank text fails numeric checks
Result: KILLED
Failed test prefix: [director-007] The legacy blank text fails numeric checks
```

## m016

File: `src/director/documentFields.js`.

```text
Old:
numeric < min
New:
numeric <= min
Selected test: [director-007] The number check accepts both bounds
Result: KILLED
Failed test prefix: [director-007] The number check accepts both bounds
```

## m017

File: `src/director/documentFields.js`.

```text
Old:
Object.hasOwn(value, key)
New:
key in value
Selected test: [director-008] The optional check uses own fields only
Result: KILLED
Failed test prefix: [director-008] The optional check uses own fields only
```

## m018

File: `src/director/documentFields.js`.

```text
Old:
!Array.isArray(value) ||
New:
false ||
Selected test: [director-009] The array check rejects objects
Result: KILLED
Failed test prefix: [director-009] The array check rejects objects
```

## m019

File: `src/director/documentFields.js`.

```text
Old:
value.length > max)
    fail(path, `expected an array
New:
false)
    fail(path, `expected an array
Selected test: [director-009] The array check rejects excess entries
Result: KILLED
Failed test prefix: [director-009] The array check rejects excess entries
```

## m020

File: `src/director/documentFields.js`.

```text
Old:
value.forEach((id, index) => string(id, `${path}[${index}]`));
New:
value.forEach((id, index) => { if (index === 0) string(id, `${path}[${index}]`); });
Selected test: [director-009] The ID list checks every entry
Result: KILLED
Failed test prefix: [director-009] The ID list checks every entry
```

## m021

File: `src/director/documentFields.js`.

```text
Old:
seen.add(value.id);
New:
/* mutation */
Selected test: [director-009] The unique ID check keeps its set
Result: KILLED
Failed test prefix: [director-009] The unique ID check keeps its set
```

## m022

File: `src/director/documentFields.js`.

```text
Old:
++budget.nodes > SCENE_DOCUMENT_LIMITS.nodes
New:
false
Selected test: [director-010] The node budget rejects its next value
Result: KILLED
Failed test prefix: [director-010] The node budget rejects its next value
```

## m023

File: `src/director/documentFields.js`.

```text
Old:
depth > SCENE_DOCUMENT_LIMITS.depth
New:
false
Selected test: [director-010] The depth check rejects its next level
Result: KILLED
Failed test prefix: [director-010] The depth check rejects its next level
```

## m024

File: `src/director/documentFields.js`.

```text
Old:
value === null ||
New:
false ||
Selected test: [director-011] The JSON null takes its own path
Result: KILLED
Failed test prefix: [director-011] The JSON null takes its own path
```

## m025

File: `src/director/documentFields.js`.

```text
Old:
|| typeof value === 'boolean'
New:
|| false
Selected test: [director-011] The JSON boolean takes its own path
Result: KILLED
Failed test prefix: [director-011] The JSON boolean takes its own path
```

## m026

File: `src/director/documentFields.js`.

```text
Old:
typeof value === 'number' &&
New:
false &&
Selected test: [director-011] The JSON finite number takes its own path
Result: KILLED
Failed test prefix: [director-011] The JSON finite number takes its own path
```

## m027

File: `src/director/documentFields.js`.

```text
Old:
&& Number.isFinite(value)
New:
&& true
Selected test: [director-011] The JSON rejects an infinite number
Result: KILLED
Failed test prefix: [director-011] The JSON rejects an infinite number
```

## m028

File: `src/director/documentFields.js`.

```text
Old:
if (!value || typeof value !== 'object') fail(path, 'expected a JSON value');
New:
if (typeof value !== 'object') fail(path, 'expected a JSON value');
Selected test: [director-011] The JSON rejects undefined
Result: SURVIVED
Failed test prefix: <none>
```

## m029

File: `src/director/documentFields.js`.

```text
Old:
if (!value || typeof value !== 'object')
New:
if (!value)
Selected test: [director-011] The JSON rejects functions
Result: KILLED
Failed test prefix: [director-011] The JSON rejects functions
```

## m030

File: `src/director/documentFields.js`.

```text
Old:
Object.getPrototypeOf(value) !== Object.prototype &&
New:
true &&
Selected test: [director-011] The JSON accepts an ordinary object
Result: KILLED
Failed test prefix: [director-011] The JSON accepts an ordinary object
```

## m031

File: `src/director/documentFields.js`.

```text
Old:
!Array.isArray(value) &&
New:
true &&
Selected test: [director-011] The JSON accepts arrays
Result: KILLED
Failed test prefix: [director-011] The JSON accepts arrays
```

## m032

File: `src/director/documentFields.js`.

```text
Old:
Object.getPrototypeOf(value) !== null
New:
true
Selected test: [director-011] The JSON accepts a null prototype
Result: KILLED
Failed test prefix: [director-011] The JSON accepts a null prototype
```

## m033

File: `src/director/documentFields.js`.

```text
Old:
fail(path, 'expected a JSON object');
New:
return;
Selected test: [director-011] The JSON rejects a custom prototype
Result: KILLED
Failed test prefix: [director-011] The JSON rejects a custom prototype
```

## m034

File: `src/director/documentFields.js`.

```text
Old:
value.length > SCENE_DOCUMENT_LIMITS.string
New:
false
Selected test: [director-012] The JSON text limit checks its boundary
Result: KILLED
Failed test prefix: [director-012] The JSON text limit checks its boundary
```

## m035

File: `src/director/documentFields.js`.

```text
Old:
entries.length > SCENE_DOCUMENT_LIMITS.collection
New:
false
Selected test: [director-012] The JSON entry limit checks its boundary
Result: KILLED
Failed test prefix: [director-012] The JSON entry limit checks its boundary
```

## m036

File: `src/director/documentFields.js`.

```text
Old:
['__proto__', 'constructor', 'prototype']
New:
['constructor', 'prototype']
Selected test: [director-012] The JSON rejects the __proto__ key
Result: KILLED
Failed test prefix: [director-012] The JSON rejects the __proto__ key
```

## m037

File: `src/director/documentFields.js`.

```text
Old:
['__proto__', 'constructor', 'prototype']
New:
['__proto__', 'prototype']
Selected test: [director-012] The JSON rejects the constructor key
Result: KILLED
Failed test prefix: [director-012] The JSON rejects the constructor key
```

## m038

File: `src/director/documentFields.js`.

```text
Old:
['__proto__', 'constructor', 'prototype']
New:
['__proto__', 'constructor']
Selected test: [director-012] The JSON rejects the prototype key
Result: KILLED
Failed test prefix: [director-012] The JSON rejects the prototype key
```

## m039

File: `src/director/documentFields.js`.

```text
Old:
key.length > 256
New:
false
Selected test: [director-012] The JSON rejects long field names
Result: KILLED
Failed test prefix: [director-012] The JSON rejects long field names
```

## m040

File: `src/director/document.js`.

```text
Old:
typeof text !== 'string' ||
New:
false ||
Selected test: [director-013] The parser rejects nontext input
Result: KILLED
Failed test prefix: [director-013] The parser rejects nontext input
```

## m041

File: `src/director/document.js`.

```text
Old:
text.length > SCENE_DOCUMENT_LIMITS.bytes ||
New:
false ||
Selected test: [director-013] The parser rejects excess character length
Result: KILLED
Failed test prefix: [director-013] The parser rejects excess character length
```

## m042

File: `src/director/document.js`.

```text
Old:
new TextEncoder().encode(text).byteLength > SCENE_DOCUMENT_LIMITS.bytes
New:
false
Selected test: [director-013] The parser rejects excess UTF8 bytes
Result: KILLED
Failed test prefix: [director-013] The parser rejects excess UTF8 bytes
```

## m043

File: `src/director/document.js`.

```text
Old:
fail('$', 'invalid JSON');
New:
throw new Error("wrong");
Selected test: [director-013] The parser reports invalid JSON
Result: KILLED
Failed test prefix: [director-013] The parser reports invalid JSON
```

## m044

File: `src/director/document.js`.

```text
Old:
![1, 2, 3, 4, 5, 6].includes(version)
New:
false
Selected test: [director-004] The validator rejects an unsupported version
Result: KILLED
Failed test prefix: [director-004] The validator rejects an unsupported version
```

## m045

File: `src/director/document.js`.

```text
Old:
['style', 'mapStack']
New:
['mapStack']
Selected test: [director-014] The visual check rejects invalid style; [director-014] The visual check rejects invalid style parameters
Result: KILLED
Failed test prefix: [director-014] The visual check rejects invalid style
```

## m046

File: `src/director/document.js`.

```text
Old:
['style', 'mapStack']
New:
['style']
Selected test: [director-014] The visual check rejects invalid mapStack
Result: KILLED
Failed test prefix: [director-014] The visual check rejects invalid mapStack
```

## m047

File: `src/director/document.js`.

```text
Old:
optional(value, 'styleParams', path, object);
New:
<empty>
Selected test: [director-014] The visual check rejects invalid style parameters
Result: KILLED
Failed test prefix: [director-014] The visual check rejects invalid style parameters
```

## m048

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabledREMOVED: 'boolean', intensity: [-100, 10000], version: [1, 100] }
Selected test: [director-015] The visual bloom accepts its enabled field
Result: KILLED
Failed test prefix: [director-015] The visual bloom accepts its enabled field
```

## m049

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabled: 'boolean', intensityREMOVED: [-100, 10000], version: [1, 100] }
Selected test: [director-015] The visual bloom accepts its intensity field
Result: KILLED
Failed test prefix: [director-015] The visual bloom accepts its intensity field
```

## m050

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], versionREMOVED: [1, 100] }
Selected test: [director-015] The visual bloom accepts its version field
Result: KILLED
Failed test prefix: [director-015] The visual bloom accepts its version field
```

## m051

File: `src/director/document.js`.

```text
Old:
    sharpen: { enabled: 'boolean', intensity: [0, 100] }
New:
    sharpen: { enabledREMOVED: 'boolean', intensity: [0, 100] }
Selected test: [director-015] The visual sharpen accepts its enabled field
Result: KILLED
Failed test prefix: [director-015] The visual sharpen accepts its enabled field
```

## m052

File: `src/director/document.js`.

```text
Old:
    sharpen: { enabled: 'boolean', intensity: [0, 100] }
New:
    sharpen: { enabled: 'boolean', intensityREMOVED: [0, 100] }
Selected test: [director-015] The visual sharpen accepts its intensity field
Result: KILLED
Failed test prefix: [director-015] The visual sharpen accepts its intensity field
```

## m053

File: `src/director/document.js`.

```text
Old:
    hud: { visible: 'boolean', variant: 'string' }
New:
    hud: { visibleREMOVED: 'boolean', variant: 'string' }
Selected test: [director-015] The visual hud accepts its visible field
Result: KILLED
Failed test prefix: [director-015] The visual hud accepts its visible field
```

## m054

File: `src/director/document.js`.

```text
Old:
    hud: { visible: 'boolean', variant: 'string' }
New:
    hud: { visible: 'boolean', variantREMOVED: 'string' }
Selected test: [director-015] The visual hud accepts its variant field
Result: KILLED
Failed test prefix: [director-015] The visual hud accepts its variant field
```

## m055

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      modeREMOVED: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection accepts its mode field
Result: KILLED
Failed test prefix: [director-015] The visual detection accepts its mode field
```

## m056

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      densityREMOVED: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection accepts its density field
Result: KILLED
Failed test prefix: [director-015] The visual detection accepts its density field
```

## m057

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocationREMOVED: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection accepts its allocation field
Result: KILLED
Failed test prefix: [director-015] The visual detection accepts its allocation field
```

## m058

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePctREMOVED: [0, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection accepts its fadePct field
Result: KILLED
Failed test prefix: [director-015] The visual detection accepts its fadePct field
```

## m059

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPctREMOVED: [0, 100],
    }
Selected test: [director-015] The visual detection accepts its outsideOpacityPct field
Result: KILLED
Failed test prefix: [director-015] The visual detection accepts its outsideOpacityPct field
```

## m060

File: `src/director/document.js`.

```text
Old:
    scope: { enabled: 'boolean', featherPct: [0, 100] }
New:
    scope: { enabledREMOVED: 'boolean', featherPct: [0, 100] }
Selected test: [director-015] The visual scope accepts its enabled field
Result: KILLED
Failed test prefix: [director-015] The visual scope accepts its enabled field
```

## m061

File: `src/director/document.js`.

```text
Old:
    scope: { enabled: 'boolean', featherPct: [0, 100] }
New:
    scope: { enabled: 'boolean', featherPctREMOVED: [0, 100] }
Selected test: [director-015] The visual scope accepts its featherPct field
Result: KILLED
Failed test prefix: [director-015] The visual scope accepts its featherPct field
```

## m062

File: `src/director/document.js`.

```text
Old:
['createdAt', 'updatedAt']
New:
['updatedAt']
Selected test: [director-016] The document checks its createdAt field
Result: KILLED
Failed test prefix: [director-016] The document checks its createdAt field
```

## m063

File: `src/director/document.js`.

```text
Old:
['createdAt', 'updatedAt']
New:
['createdAt']
Selected test: [director-016] The document checks its updatedAt field
Result: KILLED
Failed test prefix: [director-016] The document checks its updatedAt field
```

## m064

File: `src/director/document.js`.

```text
Old:
optional(project, 'installedBuiltInSceneIds', '$', ids);
New:
<empty>
Selected test: [director-016] The document checks installed scene IDs
Result: KILLED
Failed test prefix: [director-016] The document checks installed scene IDs
```

## m065

File: `src/director/document.js`.

```text
Old:
      optional(shot, 'durationSec', at, (v, p) =>
        number(v, p, 0, 86400, legacy),
      );
New:
<empty>
Selected test: [director-017] The shot checks its durationSec field
Result: KILLED
Failed test prefix: [director-017] The shot checks its durationSec field
```

## m066

File: `src/director/document.js`.

```text
Old:
      optional(shot, 'holdSec', at, (v, p) => number(v, p, 0, 86400, legacy));
New:
<empty>
Selected test: [director-017] The shot checks its holdSec field
Result: KILLED
Failed test prefix: [director-017] The shot checks its holdSec field
```

## m067

File: `src/director/document.js`.

```text
Old:
      optional(shot, 'sourcePackVersion', at, (v, p) =>
        number(v, p, 1, 1000000, legacy),
      );
New:
<empty>
Selected test: [director-016] The shot checks its sourcePackVersion field
Result: KILLED
Failed test prefix: [director-016] The shot checks its sourcePackVersion field
```

## m068

File: `src/director/document.js`.

```text
Old:
string(id, `${p}.${title}`);
New:
;
Selected test: [director-016] The pack bindings check every value
Result: KILLED
Failed test prefix: [director-016] The pack bindings check every value
```

## m069

File: `src/director/document.js`.

```text
Old:
number(v, p, 1, 1000000, legacy),
        );
New:
number(v, p, 1, 1000000, true),
        );
Selected test: [director-016] The pack versions accept legacy text only
Result: KILLED
Failed test prefix: [director-016] The pack versions accept legacy text only
```

## m070

File: `src/director/document.js`.

```text
Old:
    optional(scene, 'title', path, (v, p) => string(v, p, 4096));
New:
<empty>
Selected test: [director-016] The scene checks its title field
Result: KILLED
Failed test prefix: [director-016] The scene checks its title field
```

## m071

File: `src/director/document.js`.

```text
Old:
    optional(scene, 'releaseLayerIds', path, ids);
New:
<empty>
Selected test: [director-016] The scene checks its releaseLayerIds field
Result: KILLED
Failed test prefix: [director-016] The scene checks its releaseLayerIds field
```

## m072

File: `src/director/document.js`.

```text
Old:
      optional(shot, 'title', at, (v, p) => string(v, p, 4096));
New:
<empty>
Selected test: [director-016] The shot checks its title field
Result: KILLED
Failed test prefix: [director-016] The shot checks its title field
```

## m073

File: `src/director/document.js`.

```text
Old:
      optional(shot, 'sourcePackId', at, string);
New:
<empty>
Selected test: [director-016] The shot checks its sourcePackId field
Result: KILLED
Failed test prefix: [director-016] The shot checks its sourcePackId field
```

## m074

File: `src/director/document.js`.

```text
Old:
typeof entry.enabled !== 'boolean'
New:
false
Selected test: [director-018] The layer entry needs a boolean state
Result: KILLED
Failed test prefix: [director-018] The layer entry needs a boolean state
```

## m075

File: `src/director/document.js`.

```text
Old:
optional(entry, 'params', p, object);
New:
<empty>
Selected test: [director-018] The layer parameters need an object
Result: KILLED
Failed test prefix: [director-018] The layer parameters need an object
```

## m076

File: `src/director/document.js`.

```text
Old:
shotCount > SCENE_DOCUMENT_LIMITS.shots
New:
false
Selected test: [director-018] The shot total spans scene boundaries
Result: KILLED
Failed test prefix: [director-018] The shot total spans scene boundaries
```

## m077

File: `src/director/document.js`.

```text
Old:
version >= 4 ? ['anchors'] : []
New:
true ? ['anchors'] : []
Selected test: [director-004] The version rejects an early anchors field
Result: KILLED
Failed test prefix: [director-004] The version rejects an early anchors field
```

## m078

File: `src/director/document.js`.

```text
Old:
version >= 5 ? ['dataPacks'] : []
New:
true ? ['dataPacks'] : []
Selected test: [director-004] The version rejects an early dataPacks field
Result: KILLED
Failed test prefix: [director-004] The version rejects an early dataPacks field
```

## m079

File: `src/director/document.js`.

```text
Old:
version >= 4 ? ['move'] : []
New:
true ? ['move'] : []
Selected test: [director-004] The version rejects an early move field
Result: KILLED
Failed test prefix: [director-004] The version rejects an early move field
```

## m080

File: `src/director/document.js`.

```text
Old:
version >= 5 ? ['dataPackIds'] : []
New:
true ? ['dataPackIds'] : []
Selected test: [director-004] The version rejects an early dataPackIds field
Result: KILLED
Failed test prefix: [director-004] The version rejects an early dataPackIds field
```

## m081

File: `src/director/document.js`.

```text
Old:
version >= 6 ? ['interactions'] : []
New:
true ? ['interactions'] : []
Selected test: [director-004] The version rejects an early interactions field
Result: KILLED
Failed test prefix: [director-004] The version rejects an early interactions field
```

## m082

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(sceneDetails, key)) scene[key] = sceneDetails[key];
New:
if (key !== 'anchors' && Object.hasOwn(sceneDetails, key)) scene[key] = sceneDetails[key];
Selected test: [director-019] The edit sets the anchors field
Result: KILLED
Failed test prefix: [director-019] The edit sets the anchors field
```

## m083

File: `src/director/authoring.js`.

```text
Old:
delete scene[key];
New:
if(key !== 'anchors') delete scene[key];
Selected test: [director-021] The edit removes an absent anchors field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent anchors field
```

## m084

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(sceneDetails, key)) scene[key] = sceneDetails[key];
New:
if (key !== 'dataPacks' && Object.hasOwn(sceneDetails, key)) scene[key] = sceneDetails[key];
Selected test: [director-019] The edit sets the dataPacks field
Result: KILLED
Failed test prefix: [director-019] The edit sets the dataPacks field
```

## m085

File: `src/director/authoring.js`.

```text
Old:
delete scene[key];
New:
if(key !== 'dataPacks') delete scene[key];
Selected test: [director-021] The edit removes an absent dataPacks field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent dataPacks field
```

## m086

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
New:
if (key !== 'camera' && Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
Selected test: [director-019] The edit sets the camera field
Result: KILLED
Failed test prefix: [director-019] The edit sets the camera field
```

## m087

File: `src/director/authoring.js`.

```text
Old:
delete shot[key];
New:
if(key !== 'camera') delete shot[key];
Selected test: [director-021] The edit removes an absent camera field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent camera field
```

## m088

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
New:
if (key !== 'move' && Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
Selected test: [director-019] The edit sets the move field
Result: KILLED
Failed test prefix: [director-019] The edit sets the move field
```

## m089

File: `src/director/authoring.js`.

```text
Old:
delete shot[key];
New:
if(key !== 'move') delete shot[key];
Selected test: [director-021] The edit removes an absent move field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent move field
```

## m090

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
New:
if (key !== 'durationSec' && Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
Selected test: [director-019] The edit sets the durationSec field
Result: KILLED
Failed test prefix: [director-019] The edit sets the durationSec field
```

## m091

File: `src/director/authoring.js`.

```text
Old:
delete shot[key];
New:
if(key !== 'durationSec') delete shot[key];
Selected test: [director-021] The edit removes an absent durationSec field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent durationSec field
```

## m092

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
New:
if (key !== 'holdSec' && Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
Selected test: [director-019] The edit sets the holdSec field
Result: KILLED
Failed test prefix: [director-019] The edit sets the holdSec field
```

## m093

File: `src/director/authoring.js`.

```text
Old:
delete shot[key];
New:
if(key !== 'holdSec') delete shot[key];
Selected test: [director-021] The edit removes an absent holdSec field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent holdSec field
```

## m094

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
New:
if (key !== 'dataPackIds' && Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
Selected test: [director-019] The edit sets the dataPackIds field
Result: KILLED
Failed test prefix: [director-019] The edit sets the dataPackIds field
```

## m095

File: `src/director/authoring.js`.

```text
Old:
delete shot[key];
New:
if(key !== 'dataPackIds') delete shot[key];
Selected test: [director-021] The edit removes an absent dataPackIds field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent dataPackIds field
```

## m096

File: `src/director/authoring.js`.

```text
Old:
if (Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
New:
if (key !== 'interactions' && Object.hasOwn(shotDetails, key)) shot[key] = shotDetails[key];
Selected test: [director-019] The edit sets the interactions field
Result: KILLED
Failed test prefix: [director-019] The edit sets the interactions field
```

## m097

File: `src/director/authoring.js`.

```text
Old:
delete shot[key];
New:
if(key !== 'interactions') delete shot[key];
Selected test: [director-021] The edit removes an absent interactions field
Result: KILLED
Failed test prefix: [director-021] The edit removes an absent interactions field
```

## m098

File: `src/director/authoring.js`.

```text
Old:
!scene ||
New:
false ||
Selected test: [director-020] The edit rejects an absent scene
Result: SURVIVED
Failed test prefix: <none>
```

## m099

File: `src/director/authoring.js`.

```text
Old:
|| !shot
New:
|| false
Selected test: [director-020] The edit rejects an absent shot
Result: KILLED
Failed test prefix: [director-020] The edit rejects an absent shot
```

## m100

File: `src/director/authoring.js`.

```text
Old:
!['anchors', 'dataPacks'].includes(key)
New:
false
Selected test: [director-020] The edit rejects unsupported scene details
Result: KILLED
Failed test prefix: [director-020] The edit rejects unsupported scene details
```

## m101

File: `src/director/authoring.js`.

```text
Old:
throw new Error('Unsupported shot detail');
New:
<empty>
Selected test: [director-020] The edit rejects unsupported shot details
Result: KILLED
Failed test prefix: [director-020] The edit rejects unsupported shot details
```

## m102

File: `src/director/authoring.js`.

```text
Old:
scenes: [scene]
New:
scenes: copy.scenes
Selected test: [director-022] The selection keeps only its scene
Result: KILLED
Failed test prefix: [director-022] The selection keeps only its scene
```

## m103

File: `src/director/authoring.js`.

```text
Old:
if (!scene) throw new Error('Select a scene first');
New:
<empty>
Selected test: [director-022] The selection rejects an absent scene
Result: KILLED
Failed test prefix: [director-022] The selection rejects an absent scene
```

## m104

File: `src/director/timeline.js`.

```text
Old:
durations[shotIndex] : 0
New:
0 : 0
Selected test: [director-031] The shot boundaries use cumulative durations
Result: KILLED
Failed test prefix: [director-031] The shot boundaries use cumulative durations
```

## m105

File: `src/director/timeline.js`.

```text
Old:
durationForShot(scene, item)) || []
New:
durationForShot(scene, item))
Selected test: [director-032] The absent scene gives empty time
Result: KILLED
Failed test prefix: [director-032] The absent scene gives empty time
```

## m106

File: `src/director/timeline.js`.

```text
Old:
shot?.id) ?? -1
New:
shot?.id)
Selected test: [director-032] The absent shot index gives empty time
Result: KILLED
Failed test prefix: [director-032] The absent shot index gives empty time
```

## m107

File: `src/director/timeline.js`.

```text
Old:
startProgress: totalSec > 0 ? startElapsedSec / totalSec : 0
New:
startProgress: startElapsedSec / totalSec
Selected test: [director-032] The zero duration gives finite progress
Result: KILLED
Failed test prefix: [director-032] The zero duration gives finite progress
```

## m108

File: `src/director/timeline.js`.

```text
Old:
endProgress: totalSec > 0 ? endElapsedSec / totalSec : 1
New:
endProgress: endElapsedSec / totalSec
Selected test: [director-032] The zero total bounds endProgress
Result: KILLED
Failed test prefix: [director-032] The zero total bounds endProgress
```

## m109

File: `src/director/timeline.js`.

```text
Old:
durationProgress: totalSec > 0 ? durationSec / totalSec : 0
New:
durationProgress: durationSec / totalSec
Selected test: [director-032] The zero total bounds durationProgress
Result: KILLED
Failed test prefix: [director-032] The zero total bounds durationProgress
```

## m110

File: `src/director/timeline.js`.

```text
Old:
const target = toCamera || fromCamera;
New:
const target = toCamera;
Selected test: [director-033] The camera uses its sole source
Result: KILLED
Failed test prefix: [director-033] The camera uses its sole source
```

## m111

File: `src/director/timeline.js`.

```text
Old:
const source = fromCamera || target;
New:
const source = fromCamera;
Selected test: [director-033] The camera uses its sole target
Result: KILLED
Failed test prefix: [director-033] The camera uses its sole target
```

## m112

File: `src/director/timeline.js`.

```text
Old:
return target || source || null
New:
return target || source
Selected test: [director-033] The camera returns null without endpoints
Result: KILLED
Failed test prefix: [director-033] The camera returns null without endpoints
```

## m113

File: `src/director/timeline.js`.

```text
Old:
const t = clamp01(Number(progress) || 0);
New:
const t = clamp01(Number(progress));
Selected test: [director-033] The camera bounds numeric progress
Result: KILLED
Failed test prefix: [director-033] The camera bounds numeric progress
```

## m114

File: `src/director/timeline.js`.

```text
Old:
t < 0.5 ?
New:
true ?
Selected test: [director-033] The camera uses both cubic halves
Result: KILLED
Failed test prefix: [director-033] The camera uses both cubic halves
```

## m115

File: `src/director/timeline.js`.

```text
Old:
const start = Number(from) || 0;
New:
const start = Number(from);
Selected test: [director-033] The camera gives a zero start angle for invalid text
Result: KILLED
Failed test prefix: [director-033] The camera gives a zero start angle for invalid text
```

## m116

File: `src/director/timeline.js`.

```text
Old:
targetSec < endElapsedSec ||
New:
false ||
Selected test: [director-034] The seek uses only the first time boundary
Result: KILLED
Failed test prefix: [director-034] The seek uses only the first time boundary
```

## m117

File: `src/director/timeline.js`.

```text
Old:
index === scene.shots.length - 1
New:
false
Selected test: [director-034] The seek chooses the final shot at the end
Result: KILLED
Failed test prefix: [director-034] The seek chooses the final shot at the end
```

## m118

File: `src/director/timeline.js`.

```text
Old:
shot.durationSec || DEFAULT_SHOT_DURATION_SEC
New:
shot.durationSec
Selected test: [director-034] The seek defaults an absent flight time
Result: KILLED
Failed test prefix: [director-034] The seek defaults an absent flight time
```

## m119

File: `src/director/timeline.js`.

```text
Old:
shot.durationSec || DEFAULT_SHOT_DURATION_SEC
New:
DEFAULT_SHOT_DURATION_SEC
Selected test: [director-034] The seek uses authored flight time
Result: KILLED
Failed test prefix: [director-034] The seek uses authored flight time
```

## m120

File: `src/director/timeline.js`.

```text
Old:
if (!scene?.shots?.length) return null;
New:
<empty>
Selected test: [director-032] The seek gives null without shots
Result: KILLED
Failed test prefix: [director-032] The seek gives null without shots
```

## m121

File: `src/director/timeline.js`.

```text
Old:
sceneProgress: totalSec > 0 ? targetSec / totalSec : 0
New:
sceneProgress: targetSec / totalSec
Selected test: [director-032] The seek bounds zero scene time
Result: KILLED
Failed test prefix: [director-032] The seek bounds zero scene time
```

## m122

File: `src/director/timeline.js`.

```text
Old:
const normalized = clamp01(Number(progress) || 0);
New:
const normalized = clamp01(Number(progress));
Selected test: [director-034] The seek converts invalid progress to zero
Result: KILLED
Failed test prefix: [director-034] The seek converts invalid progress to zero
```

## m123

File: `src/director/timeline.js`.

```text
Old:
holdDurationSec > 0 ? clamp01(holdElapsedSec / holdDurationSec) : 1
New:
clamp01(holdElapsedSec / holdDurationSec)
Selected test: [director-034] The seek bounds the hold fraction
Result: KILLED
Failed test prefix: [director-034] The seek bounds the hold fraction
```

## m124

File: `src/director/timeline.js`.

```text
Old:
scene.shots[shotIndex - 1]?.camera || shot.camera
New:
shot.camera
Selected test: [director-035] The seek uses the previous ordinary camera
Result: KILLED
Failed test prefix: [director-035] The seek uses the previous ordinary camera
```

## m125

File: `src/director/timeline.js`.

```text
Old:
scene.shots[shotIndex - 1]?.camera || shot.camera
New:
scene.shots[shotIndex - 1]?.camera
Selected test: [director-035] The seek uses the first ordinary camera
Result: KILLED
Failed test prefix: [director-035] The seek uses the first ordinary camera
```

## m126

File: `src/director/timeline.js`.

```text
Old:
move
      ? sampleCameraMove(move, cameraProgress)
New:
false
      ? sampleCameraMove(move, cameraProgress)
Selected test: [director-035] The seek samples a move that the shot gives
Result: KILLED
Failed test prefix: [director-035] The seek samples a move that the shot gives
```

## m127

File: `src/director/clock.js`.

```text
Old:
Number(sceneElapsedSec) || 0
New:
Number(sceneElapsedSec)
Selected test: [director-023] The clock bounds and copies its snapshot
Result: KILLED
Failed test prefix: [director-023] The clock bounds and copies its snapshot
```

## m128

File: `src/director/clock.js`.

```text
Old:
timing.totalSec > 0 ? elapsedSec / timing.totalSec : 0
New:
elapsedSec / timing.totalSec
Selected test: [director-023] The clock uses zero progress for zero total
Result: KILLED
Failed test prefix: [director-023] The clock uses zero progress for zero total
```

## m129

File: `src/director/clock.js`.

```text
Old:
this._destroyed || !scene || !shot
New:
this._destroyed || false || !shot
Selected test: [director-023] The clock rejects an absent scene
Result: KILLED
Failed test prefix: [director-023] The clock rejects an absent scene
```

## m130

File: `src/director/clock.js`.

```text
Old:
this._destroyed || !scene || !shot
New:
this._destroyed || !scene || false
Selected test: [director-023] The clock rejects an absent shot
Result: KILLED
Failed test prefix: [director-023] The clock rejects an absent shot
```

## m131

File: `src/director/clock.js`.

```text
Old:
console.warn('[Scenes] Scene clock listener failed:', error);
New:
<empty>
Selected test: [director-023] The clock warns when a subscriber fails
Result: KILLED
Failed test prefix: [director-023] The clock warns when a subscriber fails
```

## m132

File: `src/director/clock.js`.

```text
Old:
return () => this._sceneClockListeners.delete(listener);
New:
return () => {};
Selected test: [director-026] The subscription gives current copied state
Result: KILLED
Failed test prefix: [director-026] The subscription gives current copied state
```

## m133

File: `src/director/clock.js`.

```text
Old:
typeof listener !== 'function'
New:
false
Selected test: [director-026] The subscription rejects a nonfunction
Result: KILLED
Failed test prefix: [director-026] The subscription rejects a nonfunction
```

## m134

File: `src/director/clock.js`.

```text
Old:
this._sceneClockSnapshot.stopped ||
New:
false ||
Selected test: [director-024] The stop tolerates subscriber errors
Result: KILLED
Failed test prefix: [director-024] The stop tolerates subscriber errors
```

## m135

File: `src/director/clock.js`.

```text
Old:
!this._sceneClockSnapshot ||
New:
false ||
Selected test: [director-024] The stop works before the first snapshot
Result: KILLED
Failed test prefix: [director-024] The stop works before the first snapshot
```

## m136

File: `src/director/clock.js`.

```text
Old:
Math.max(1000, totalSec * 1000)
New:
totalSec * 1000
Selected test: [director-027] The playback progress uses a one second minimum
Result: KILLED
Failed test prefix: [director-027] The playback progress uses a one second minimum
```

## m137

File: `src/director/clock.js`.

```text
Old:
this._destroyed || this._progressTimer !== timer || !this.isRunning()
New:
this._destroyed || this._progressTimer !== timer
Selected test: [director-027] The playback tick rejects stopped state
Result: KILLED
Failed test prefix: [director-027] The playback tick rejects stopped state
```

## m138

File: `src/director/clock.js`.

```text
Old:
this._destroyed || this._progressTimer !== timer || !this.isRunning()
New:
this._destroyed || !this.isRunning()
Selected test: [director-027] The playback tick rejects replaced state
Result: KILLED
Failed test prefix: [director-027] The playback tick rejects replaced state
```

## m139

File: `src/director/clock.js`.

```text
Old:
this._destroyed || this._progressTimer !== timer || !this.isRunning()
New:
this._progressTimer !== timer || !this.isRunning()
Selected test: [director-027] The playback tick rejects destroyed state
Result: KILLED
Failed test prefix: [director-027] The playback tick rejects destroyed state
```

## m140

File: `src/director/clock.js`.

```text
Old:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      false ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 1 rejects destroyed
Result: KILLED
Failed test prefix: [director-029] The shot guard 1 rejects destroyed
```

## m141

File: `src/director/clock.js`.

```text
Old:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      false ||
      token.signal?.aborted ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 1 rejects flag
Result: KILLED
Failed test prefix: [director-029] The shot guard 1 rejects flag
```

## m142

File: `src/director/clock.js`.

```text
Old:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      false ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 1 rejects signal
Result: KILLED
Failed test prefix: [director-029] The shot guard 1 rejects signal
```

## m143

File: `src/director/clock.js`.

```text
Old:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
to, sceneClock = null) {
    this.stopShot();
    const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      false
    )
Selected test: [director-029] The shot guard 1 rejects playback
Result: KILLED
Failed test prefix: [director-029] The shot guard 1 rejects playback
```

## m144

File: `src/director/clock.js`.

```text
Old:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      false ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 2 rejects generation
Result: KILLED
Failed test prefix: [director-029] The shot guard 2 rejects generation
```

## m145

File: `src/director/clock.js`.

```text
Old:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      false ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 2 rejects destroyed
Result: KILLED
Failed test prefix: [director-029] The shot guard 2 rejects destroyed
```

## m146

File: `src/director/clock.js`.

```text
Old:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      false ||
      token.signal?.aborted ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 2 rejects flag
Result: KILLED
Failed test prefix: [director-029] The shot guard 2 rejects flag
```

## m147

File: `src/director/clock.js`.

```text
Old:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      false ||
      this.isRunning()
    )
Selected test: [director-029] The shot guard 2 rejects signal
Result: KILLED
Failed test prefix: [director-029] The shot guard 2 rejects signal
```

## m148

File: `src/director/clock.js`.

```text
Old:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
lock.shot,
        sceneClock.sceneElapsedFrom,
        { running: false },
      );
    }
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      false
    )
Selected test: [director-029] The shot guard 2 rejects playback
Result: KILLED
Failed test prefix: [director-029] The shot guard 2 rejects playback
```

## m149

File: `src/director/clock.js`.

```text
Old:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
New:
if (
        false ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
Selected test: [director-029] The shot guard 3 rejects generation
Result: KILLED
Failed test prefix: [director-029] The shot guard 3 rejects generation
```

## m150

File: `src/director/clock.js`.

```text
Old:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
New:
if (
        generation !== this._shotGeneration ||
        false ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
Selected test: [director-029] The shot guard 3 rejects destroyed
Result: KILLED
Failed test prefix: [director-029] The shot guard 3 rejects destroyed
```

## m151

File: `src/director/clock.js`.

```text
Old:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
New:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        false ||
        token.signal?.aborted ||
        this.isRunning()
      )
Selected test: [director-029] The shot guard 3 rejects flag
Result: KILLED
Failed test prefix: [director-029] The shot guard 3 rejects flag
```

## m152

File: `src/director/clock.js`.

```text
Old:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
New:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        false ||
        this.isRunning()
      )
Selected test: [director-029] The shot guard 3 rejects signal
Result: KILLED
Failed test prefix: [director-029] The shot guard 3 rejects signal
```

## m153

File: `src/director/clock.js`.

```text
Old:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        this.isRunning()
      )
New:
if (
        generation !== this._shotGeneration ||
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        false
      )
Selected test: [director-029] The shot guard 3 rejects playback
Result: KILLED
Failed test prefix: [director-029] The shot guard 3 rejects playback
```

## m154

File: `src/director/clock.js`.

```text
Old:
nal?.aborted ||
      this.isRunning()
    )
      return;
    this.onProgress(from);
    if (generation !== this._shotGeneration || this._destroyed) return;
New:
nal?.aborted ||
      this.isRunning()
    )
      return;
    this.onProgress(from);
    if (false || this._destroyed) return;
Selected test: [director-029] The shot progress guard 1 rejects generation
Result: KILLED
Failed test prefix: [director-029] The shot progress guard 1 rejects generation
```

## m155

File: `src/director/clock.js`.

```text
Old:
nal?.aborted ||
      this.isRunning()
    )
      return;
    this.onProgress(from);
    if (generation !== this._shotGeneration || this._destroyed) return;
New:
nal?.aborted ||
      this.isRunning()
    )
      return;
    this.onProgress(from);
    if (generation !== this._shotGeneration || false) return;
Selected test: [director-029] The shot progress guard 1 rejects destroyed
Result: KILLED
Failed test prefix: [director-029] The shot progress guard 1 rejects destroyed
```

## m156

File: `src/director/clock.js`.

```text
Old:
.isRunning()
    )
      return;
    if (seconds <= 0) {
      this.onProgress(to);
      if (generation !== this._shotGeneration || this._destroyed) return;
New:
.isRunning()
    )
      return;
    if (seconds <= 0) {
      this.onProgress(to);
      if (false || this._destroyed) return;
Selected test: [director-029] The shot progress guard 2 rejects generation
Result: KILLED
Failed test prefix: [director-029] The shot progress guard 2 rejects generation
```

## m157

File: `src/director/clock.js`.

```text
Old:
.isRunning()
    )
      return;
    if (seconds <= 0) {
      this.onProgress(to);
      if (generation !== this._shotGeneration || this._destroyed) return;
New:
.isRunning()
    )
      return;
    if (seconds <= 0) {
      this.onProgress(to);
      if (generation !== this._shotGeneration || false) return;
Selected test: [director-029] The shot progress guard 2 rejects destroyed
Result: KILLED
Failed test prefix: [director-029] The shot progress guard 2 rejects destroyed
```

## m158

File: `src/director/clock.js`.

```text
Old:
artedAt) / (seconds * 1000));
      this.onProgress(from + (to - from) * fraction);
      if (generation !== this._shotGeneration || this._destroyed) return;
New:
artedAt) / (seconds * 1000));
      this.onProgress(from + (to - from) * fraction);
      if (false || this._destroyed) return;
Selected test: [director-029] The shot progress guard 3 rejects generation
Result: KILLED
Failed test prefix: [director-029] The shot progress guard 3 rejects generation
```

## m159

File: `src/director/clock.js`.

```text
Old:
artedAt) / (seconds * 1000));
      this.onProgress(from + (to - from) * fraction);
      if (generation !== this._shotGeneration || this._destroyed) return;
New:
artedAt) / (seconds * 1000));
      this.onProgress(from + (to - from) * fraction);
      if (generation !== this._shotGeneration || false) return;
Selected test: [director-029] The shot progress guard 3 rejects destroyed
Result: KILLED
Failed test prefix: [director-029] The shot progress guard 3 rejects destroyed
```

## m160

File: `src/director/clock.js`.

```text
Old:
if (seconds <= 0)
New:
if (false)
Selected test: [director-028] The instant shot reports both endpoints
Result: KILLED
Failed test prefix: [director-028] The instant shot reports both endpoints
```

## m161

File: `src/director/clock.js`.

```text
Old:
if (this._shotProgressTimer !== timer) return;
New:
<empty>
Selected test: [director-029] The old shot timer leaves its replacement intact
Result: KILLED
Failed test prefix: [director-029] The old shot timer leaves its replacement intact
```

## m162

File: `src/director/clock.js`.

```text
Old:
st generation = this._sceneGeneration;
    const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
st generation = this._sceneGeneration;
    const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      false ||
      token.cancelled ||
      token.signal?.aborted
    )
Selected test: [director-030] The scene guard 1 rejects destroyed
Result: KILLED
Failed test prefix: [director-030] The scene guard 1 rejects destroyed
```

## m163

File: `src/director/clock.js`.

```text
Old:
st generation = this._sceneGeneration;
    const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
st generation = this._sceneGeneration;
    const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      false ||
      token.signal?.aborted
    )
Selected test: [director-030] The scene guard 1 rejects flag
Result: KILLED
Failed test prefix: [director-030] The scene guard 1 rejects flag
```

## m164

File: `src/director/clock.js`.

```text
Old:
st generation = this._sceneGeneration;
    const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
st generation = this._sceneGeneration;
    const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      false
    )
Selected test: [director-030] The scene guard 1 rejects signal
Result: KILLED
Failed test prefix: [director-030] The scene guard 1 rejects signal
```

## m165

File: `src/director/clock.js`.

```text
Old:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      false ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
Selected test: [director-030] The scene guard 2 rejects generation
Result: KILLED
Failed test prefix: [director-030] The scene guard 2 rejects generation
```

## m166

File: `src/director/clock.js`.

```text
Old:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      false ||
      token.cancelled ||
      token.signal?.aborted
    )
Selected test: [director-030] The scene guard 2 rejects destroyed
Result: KILLED
Failed test prefix: [director-030] The scene guard 2 rejects destroyed
```

## m167

File: `src/director/clock.js`.

```text
Old:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      false ||
      token.signal?.aborted
    )
Selected test: [director-030] The scene guard 2 rejects flag
Result: KILLED
Failed test prefix: [director-030] The scene guard 2 rejects flag
```

## m168

File: `src/director/clock.js`.

```text
Old:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
ow();
    this.publish(scene, shot, timing.startElapsedSec, {
      running: true,
    });
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      false
    )
Selected test: [director-030] The scene guard 2 rejects signal
Result: KILLED
Failed test prefix: [director-030] The scene guard 2 rejects signal
```

## m169

File: `src/director/clock.js`.

```text
Old:
if (
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        !this.isRunning()
      )
New:
if (
        false ||
        token.cancelled ||
        token.signal?.aborted ||
        !this.isRunning()
      )
Selected test: [director-030] The scene guard 3 rejects destroyed
Result: KILLED
Failed test prefix: [director-030] The scene guard 3 rejects destroyed
```

## m170

File: `src/director/clock.js`.

```text
Old:
if (
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        !this.isRunning()
      )
New:
if (
        this._destroyed ||
        false ||
        token.signal?.aborted ||
        !this.isRunning()
      )
Selected test: [director-030] The scene guard 3 rejects flag
Result: KILLED
Failed test prefix: [director-030] The scene guard 3 rejects flag
```

## m171

File: `src/director/clock.js`.

```text
Old:
if (
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        !this.isRunning()
      )
New:
if (
        this._destroyed ||
        token.cancelled ||
        false ||
        !this.isRunning()
      )
Selected test: [director-030] The scene guard 3 rejects signal
Result: KILLED
Failed test prefix: [director-030] The scene guard 3 rejects signal
```

## m172

File: `src/director/clock.js`.

```text
Old:
if (
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        !this.isRunning()
      )
New:
if (
        this._destroyed ||
        token.cancelled ||
        token.signal?.aborted ||
        false
      )
Selected test: [director-030] The scene guard 3 rejects playback
Result: KILLED
Failed test prefix: [director-030] The scene guard 3 rejects playback
```

## m173

File: `src/director/clock.js`.

```text
Old:
timing.durationSec,
        (this.now() - startedAt) / 1000
New:
Infinity,
        (this.now() - startedAt) / 1000
Selected test: [director-030] The scene clock bounds shot elapsed time
Result: KILLED
Failed test prefix: [director-030] The scene clock bounds shot elapsed time
```

## m174

File: `src/director/clock.js`.

```text
Old:
this.now() < endAt
New:
false
Selected test: [director-025] The hold ends at its deadline
Result: KILLED
Failed test prefix: [director-025] The hold ends at its deadline
```

## m175

File: `src/director/clock.js`.

```text
Old:
!token.cancelled
New:
true
Selected test: [director-025] The hold rejects flag state
Result: KILLED
Failed test prefix: [director-025] The hold rejects flag state
```

## m176

File: `src/director/clock.js`.

```text
Old:
!token.signal?.aborted
New:
true
Selected test: [director-025] The hold rejects signal state
Result: KILLED
Failed test prefix: [director-025] The hold rejects signal state
```

## m177

File: `src/director/clock.js`.

```text
Old:
!this._destroyed
New:
true
Selected test: [director-025] The hold rejects destroyed state
Result: KILLED
Failed test prefix: [director-025] The hold rejects destroyed state
```

## m178

File: `src/director/clock.js`.

```text
Old:
generation === this._waitGeneration
New:
true
Selected test: [director-025] The hold generation stops a pending wait
Result: KILLED
Failed test prefix: [director-025] The hold generation stops a pending wait
```

## m179

File: `src/director/clock.js`.

```text
Old:
setInterval(callback, ms)
New:
setInterval(() => {}, ms)
Selected test: [director-027] The default timer callbacks report progress
Result: KILLED
Failed test prefix: [director-027] The default timer callbacks report progress
```

## m180

File: `src/director/playback.js`.

```text
Old:
  'selectShot',
New:
<empty>
Selected test: [director-037] The playback calls the selectShot phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the selectShot phase
```

## m181

File: `src/director/playback.js`.

```text
Old:
  'applyVisual',
New:
<empty>
Selected test: [director-037] The playback calls the applyVisual phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the applyVisual phase
```

## m182

File: `src/director/playback.js`.

```text
Old:
  'applyLayers',
New:
<empty>
Selected test: [director-037] The playback calls the applyLayers phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the applyLayers phase
```

## m183

File: `src/director/playback.js`.

```text
Old:
  'travel',
New:
<empty>
Selected test: [director-037] The playback calls the travel phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the travel phase
```

## m184

File: `src/director/playback.js`.

```text
Old:
  'settle',
New:
<empty>
Selected test: [director-037] The playback calls the settle phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the settle phase
```

## m185

File: `src/director/playback.js`.

```text
Old:
  'hold',
New:
<empty>
Selected test: [director-037] The playback calls the hold phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the hold phase
```

## m186

File: `src/director/playback.js`.

```text
Old:
  'completeShot',
New:
<empty>
Selected test: [director-037] The playback calls the completeShot phase
Result: KILLED
Failed test prefix: [director-037] The playback calls the completeShot phase
```

## m187

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(false || token.signal?.aborted)
Selected test: [director-038] The playback rejects the flag token
Result: KILLED
Failed test prefix: [director-038] The playback rejects the flag token
```

## m188

File: `src/director/playback.js`.

```text
Old:
token.signal?.aborted
New:
false
Selected test: [director-038] The playback rejects the signal token
Result: KILLED
Failed test prefix: [director-038] The playback rejects the signal token
```

## m189

File: `src/director/playback.js`.

```text
Old:
previousScene.id !== queue[0].scene.id
New:
true
Selected test: [director-039] The playback keeps the same initial scene
Result: KILLED
Failed test prefix: [director-039] The playback keeps the same initial scene
```

## m190

File: `src/director/playback.js`.

```text
Old:
adapter.complete?.()
New:
adapter.complete()
Selected test: [director-037] The playback accepts an absent complete callback
Result: KILLED
Failed test prefix: [director-037] The playback accepts an absent complete callback
```

## m191

File: `src/director/playback.js`.

```text
Old:
const ordered = single
New:
const ordered = false
Selected test: [director-036] The single scene queue excludes other scenes
Result: KILLED
Failed test prefix: [director-036] The single scene queue excludes other scenes
```

## m192

File: `src/director/playback.js`.

```text
Old:
releaseOnFinish && activeScene
New:
activeScene
Selected test: [director-039] The final scene stays when cleanup is off
Result: KILLED
Failed test prefix: [director-039] The final scene stays when cleanup is off
```

## m193

File: `src/director/playback.js`.

```text
Old:
!queue.length || cancelled()
New:
cancelled()
Selected test: [director-038] The empty queue leaves all resources untouched
Result: KILLED
Failed test prefix: [director-038] The empty queue leaves all resources untouched
```

## m194

File: `src/director/document.js`.

```text
Old:
string(id, field);
New:
<empty>
Selected test: [director-018] The layer check validates a second layer ID
Result: KILLED
Failed test prefix: [director-018] The layer check validates a second layer ID
```

## m195

File: `src/director/document.js`.

```text
Old:
if (typeof entry === 'boolean') continue;
New:
<empty>
Selected test: [director-018] The layer check accepts boolean entries
Result: KILLED
Failed test prefix: [director-018] The layer check accepts boolean entries
```

## m196

File: `src/director/document.js`.

```text
Old:
JSON.stringify(project, null, 2)
New:
JSON.stringify({scenes:[]}, null, 2)
Selected test: [director-001] The export keeps authored text and time
Result: KILLED
Failed test prefix: [director-001] The export keeps authored text and time
```

## m197

File: `src/director/document.js`.

```text
Old:
return validateSceneDocument(parsed);
New:
return validateSceneDocument({scenes:[{shots:[]}]});
Selected test: [director-002] The parser keeps an empty scene list
Result: KILLED
Failed test prefix: [director-002] The parser keeps an empty scene list
```

## m198

File: `src/director/document.js`.

```text
Old:
Object.hasOwn(project, 'version') ? project.version : 1
New:
Object.hasOwn(project, 'version') ? project.version : 3
Selected test: [director-003] The absent version allows legacy numeric text
Result: KILLED
Failed test prefix: [director-003] The absent version allows legacy numeric text
```

## m199

File: `src/director/document.js`.

```text
Old:
if (Array.isArray(type)) number(item, at, ...type, legacy);
New:
if (Array.isArray(type)) {}
Selected test: [director-015] The visual check rejects invalid number type
Result: KILLED
Failed test prefix: [director-015] The visual check rejects invalid number type
```

## m200

File: `src/director/document.js`.

```text
Old:
else if (type === 'string') string(item, at);
New:
else if (type === 'string') {}
Selected test: [director-015] The visual check rejects invalid text type
Result: KILLED
Failed test prefix: [director-015] The visual check rejects invalid text type
```

## m201

File: `src/director/document.js`.

```text
Old:
else if (typeof item !== 'boolean') fail(at, 'expected a boolean');
New:
<empty>
Selected test: [director-015] The visual check rejects invalid boolean type
Result: KILLED
Failed test prefix: [director-015] The visual check rejects invalid boolean type
```

## m202

File: `src/director/clock.js`.

```text
Old:
this._sceneClockSnapshot.stopped ||
      this._destroyed
New:
this._sceneClockSnapshot.stopped ||
      false
Selected test: [director-024] The stop rejects a destroyed clock state
Result: KILLED
Failed test prefix: [director-024] The stop rejects a destroyed clock state
```

## m203

File: `src/director/clock.js`.

```text
Old:
if (this._destroyed || typeof listener !== 'function')
New:
if (false || typeof listener !== 'function')
Selected test: [director-026] The destroyed subscription does not add a listener
Result: KILLED
Failed test prefix: [director-026] The destroyed subscription does not add a listener
```

## m204

File: `src/director/clock.js`.

```text
Old:
if (this._destroyed || !scene || !shot)
New:
if (false || !scene || !shot)
Selected test: [director-023] The destroyed publication does not make a snapshot
Result: KILLED
Failed test prefix: [director-023] The destroyed publication does not make a snapshot
```

## m205

File: `src/director/clock.js`.

```text
Old:
this._sceneClockSnapshot ? { ...this._sceneClockSnapshot } : null
New:
this._sceneClockSnapshot ? this._sceneClockSnapshot : null
Selected test: [director-023] The snapshot access returns a copy
Result: KILLED
Failed test prefix: [director-023] The snapshot access returns a copy
```

## m206

File: `src/director/clock.js`.

```text
Old:
for (const listener of this._sceneClockListeners) {
      try {
        listener(this.snapshot);
New:
for (const listener of [...this._sceneClockListeners].slice(0,1)) {
      try {
        listener(this.snapshot);
Selected test: [director-024] The stop notifies every subscriber
Result: KILLED
Failed test prefix: [director-024] The stop notifies every subscriber
```

## m207

File: `src/director/clock.js`.

```text
Old:
for (const listener of this._sceneClockListeners) {
      try {
        listener({ ...this._sceneClockSnapshot });
New:
for (const listener of [...this._sceneClockListeners].slice(0,1)) {
      try {
        listener({ ...this._sceneClockSnapshot });
Selected test: [director-023] The publication notifies every subscriber
Result: KILLED
Failed test prefix: [director-023] The publication notifies every subscriber
```

## m208

File: `src/director/clock.js`.

```text
Old:
for (const finish of [...this._waiters]) finish();
New:
for (const finish of [...this._waiters].slice(0,1)) finish();
Selected test: [director-025] The clock cancels every pending wait
Result: KILLED
Failed test prefix: [director-025] The clock cancels every pending wait
```

## m209

File: `src/director/playback.js`.

```text
Old:
  'applyVisual',
  'applyLayers',
New:
  'applyLayers',
  'applyVisual',
Selected test: [director-037] The adapter receives the exact phase order
Result: KILLED
Failed test prefix: [director-037] The adapter receives the exact phase order
```

## m210

File: `src/director/playback.js`.

```text
Old:
previousScene && previousScene.id !== queue[0].scene.id
New:
false && previousScene.id !== queue[0].scene.id
Selected test: [director-039] The handoff accepts a previous scene before work
Result: KILLED
Failed test prefix: [director-039] The handoff accepts a previous scene before work
```

## m211

File: `src/director/playback.js`.

```text
Old:
activeScene && activeScene.id !== scene.id
New:
false && activeScene.id !== scene.id
Selected test: [director-039] The scene change releases the old scene
Result: KILLED
Failed test prefix: [director-039] The scene change releases the old scene
```

## m212

File: `src/director/playback.js`.

```text
Old:
activeScene && activeScene.id !== scene.id
New:
activeScene
Selected test: [director-039] The same scene keeps resources between shots
Result: KILLED
Failed test prefix: [director-039] The same scene keeps resources between shots
```

## m213

File: `src/director/playback.js`.

```text
Old:
index < queue.length && !cancelled()
New:
index < queue.length
Selected test: [director-038] The handoff cancellation prevents the first shot
Result: KILLED
Failed test prefix: [director-038] The handoff cancellation prevents the first shot
```

## m214

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] The phase failure keeps its error after cleanup
Result: KILLED
Failed test prefix: [director-040] The phase failure keeps its error after cleanup
```

## m215

File: `src/director/documentFields.js`.

```text
Old:
if (!Object.hasOwn(value, 'id')) return;
New:
if (!Object.hasOwn(value, 'id')) fail(path, 'ID absent');
Selected test: [director-003] The legacy document accepts absent IDs
Result: KILLED
Failed test prefix: [director-003] The legacy document accepts absent IDs
```

## m216

File: `src/director/clock.js`.

```text
Old:
const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
New:
const timing = this.timingForShot(scene, shot);
    if (
      false ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
    )
Selected test: [director-030] The scene start rejects a timing callback replacement
Result: KILLED
Failed test prefix: [director-030] The scene start rejects a timing callback replacement
```

## m217

File: `src/director/clock.js`.

```text
Old:
const generation = this._shotGeneration;
    if (
      generation !== this._shotGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
New:
const generation = this._shotGeneration;
    if (
      false ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted ||
      this.isRunning()
    )
Selected test: [director-029] The shot start rejects a changed counter read
Result: KILLED
Failed test prefix: [director-029] The shot start rejects a changed counter read
```

## m218

File: `src/director/clock.js`.

```text
Old:
while (current() && this.now() < endAt)
New:
while (true && this.now() < endAt)
Selected test: [director-025] The hold condition checks its current state first
Result: KILLED
Failed test prefix: [director-025] The hold condition checks its current state first
```

## m219

File: `src/director/timeline.js`.

```text
Old:
if (!source || !target)
New:
if (!target)
Selected test: [director-033] The camera guard handles a falsy endpoint
Result: SURVIVED
Failed test prefix: <none>
```

## m220

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabled: 'boolean', intensity: [-101, 10000], version: [1, 100] }
Selected test: [director-015] The visual bloom bounds its intensity field
Result: KILLED
Failed test prefix: [director-015] The visual bloom bounds its intensity field
```

## m221

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabled: 'boolean', intensity: [-100, 10001], version: [1, 100] }
Selected test: [director-015] The visual bloom bounds its intensity field
Result: KILLED
Failed test prefix: [director-015] The visual bloom bounds its intensity field
```

## m222

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [0, 100] }
Selected test: [director-015] The visual bloom bounds its version field
Result: KILLED
Failed test prefix: [director-015] The visual bloom bounds its version field
```

## m223

File: `src/director/document.js`.

```text
Old:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 100] }
New:
    bloom: { enabled: 'boolean', intensity: [-100, 10000], version: [1, 101] }
Selected test: [director-015] The visual bloom bounds its version field
Result: KILLED
Failed test prefix: [director-015] The visual bloom bounds its version field
```

## m224

File: `src/director/document.js`.

```text
Old:
    sharpen: { enabled: 'boolean', intensity: [0, 100] }
New:
    sharpen: { enabled: 'boolean', intensity: [-1, 100] }
Selected test: [director-015] The visual sharpen bounds its intensity field
Result: KILLED
Failed test prefix: [director-015] The visual sharpen bounds its intensity field
```

## m225

File: `src/director/document.js`.

```text
Old:
    sharpen: { enabled: 'boolean', intensity: [0, 100] }
New:
    sharpen: { enabled: 'boolean', intensity: [0, 101] }
Selected test: [director-015] The visual sharpen bounds its intensity field
Result: KILLED
Failed test prefix: [director-015] The visual sharpen bounds its intensity field
```

## m226

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [-1, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection bounds its density field
Result: KILLED
Failed test prefix: [director-015] The visual detection bounds its density field
```

## m227

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 101],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection bounds its density field
Result: KILLED
Failed test prefix: [director-015] The visual detection bounds its density field
```

## m228

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [-1, 100],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection bounds its fadePct field
Result: KILLED
Failed test prefix: [director-015] The visual detection bounds its fadePct field
```

## m229

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 101],
      outsideOpacityPct: [0, 100],
    }
Selected test: [director-015] The visual detection bounds its fadePct field
Result: KILLED
Failed test prefix: [director-015] The visual detection bounds its fadePct field
```

## m230

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [-1, 100],
    }
Selected test: [director-015] The visual detection bounds its outsideOpacityPct field
Result: KILLED
Failed test prefix: [director-015] The visual detection bounds its outsideOpacityPct field
```

## m231

File: `src/director/document.js`.

```text
Old:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 100],
    }
New:
    detection: {
      mode: 'string',
      density: [0, 100],
      allocation: 'string',
      fadePct: [0, 100],
      outsideOpacityPct: [0, 101],
    }
Selected test: [director-015] The visual detection bounds its outsideOpacityPct field
Result: KILLED
Failed test prefix: [director-015] The visual detection bounds its outsideOpacityPct field
```

## m232

File: `src/director/document.js`.

```text
Old:
    scope: { enabled: 'boolean', featherPct: [0, 100] }
New:
    scope: { enabled: 'boolean', featherPct: [-1, 100] }
Selected test: [director-015] The visual scope bounds its featherPct field
Result: KILLED
Failed test prefix: [director-015] The visual scope bounds its featherPct field
```

## m233

File: `src/director/document.js`.

```text
Old:
    scope: { enabled: 'boolean', featherPct: [0, 100] }
New:
    scope: { enabled: 'boolean', featherPct: [0, 101] }
Selected test: [director-015] The visual scope bounds its featherPct field
Result: KILLED
Failed test prefix: [director-015] The visual scope bounds its featherPct field
```

## m234

File: `src/director/clock.js`.

```text
Old:
    }, 100);
    timer.unref?.();
New:
    }, 100);
    
Selected test: [director-028] The startShotProgress detaches its timer handle
Result: KILLED
Failed test prefix: [director-028] The startShotProgress detaches its timer handle
```

## m235

File: `src/director/clock.js`.

```text
Old:
    }, 50);
    timer.unref?.();
New:
    }, 50);
    
Selected test: [director-030] The startScene detaches its timer handle
Result: KILLED
Failed test prefix: [director-030] The startScene detaches its timer handle
```

## m236

File: `src/director/timeline.js`.

```text
Old:
if (!source || !target)
New:
if (!source)
Selected test: [director-033] The camera guard returns null for falsy endpoints
Result: SURVIVED
Failed test prefix: <none>
```

## m237

File: `src/director/timeline.js`.

```text
Old:
return target || source || null
New:
return source || null
Selected test: [director-033] The camera guard returns null for falsy endpoints
Result: SURVIVED
Failed test prefix: <none>
```

## m238

File: `src/director/timeline.js`.

```text
Old:
return target || source || null
New:
return target || null
Selected test: [director-033] The camera guard returns null for falsy endpoints
Result: SURVIVED
Failed test prefix: <none>
```

## m239

File: `src/director/document.js`.

```text
Old:
JSON.stringify(project, null, 2)
New:
JSON.stringify({scenes:[]}, null, 2)
Selected test: [director-001] all built-in authored content exports and normalizes without edit loss
Result: KILLED
Failed test prefix: [director-001] all built-in authored content exports and normalizes without edit loss
```

## m240

File: `src/director/document.js`.

```text
Old:
JSON.stringify(project, null, 2)
New:
JSON.stringify({scenes:[]}, null, 2)
Selected test: [director-003] v1/v2 bloom migrates once; IDs, edits, pack bindings and zero holds survive
Result: KILLED
Failed test prefix: [director-003] v1/v2 bloom migrates once; IDs, edits, pack bindings and zero holds survive
```

## m241

File: `src/director/document.js`.

```text
Old:
return validateSceneDocument(parsed);
New:
return validateSceneDocument({scenes:[{shots:[]}]});
Selected test: [director-002] an intentionally empty project stays empty
Result: KILLED
Failed test prefix: [director-002] an intentionally empty project stays empty
```

## m242

File: `src/director/documentFields.js`.

```text
Old:
if (!Object.hasOwn(value, 'id')) return;
New:
if (!Object.hasOwn(value, 'id')) fail(path, 'ID absent');
Selected test: [director-003] missing legacy IDs become stable after the first saved migration
Result: KILLED
Failed test prefix: [director-003] missing legacy IDs become stable after the first saved migration
```

## m243

File: `src/director/document.js`.

```text
Old:
![1, 2, 3, 4, 5, 6].includes(version)
New:
false
Selected test: [director-004] invalid shapes, versions, unknown fields and unsafe keys fail with field paths
Result: KILLED
Failed test prefix: [director-004] invalid shapes, versions, unknown fields and unsafe keys fail with field paths
```

## m244

File: `src/director/document.js`.

```text
Old:
typeof text !== 'string' ||
    text.length > SCENE_DOCUMENT_LIMITS.bytes ||
    new TextEncoder().encode(text).byteLength > SCENE_DOCUMENT_LIMITS.bytes
New:
false
Selected test: [director-013] document byte, nesting, collection, finite-number and string bounds are enforced
Result: KILLED
Failed test prefix: [director-013] document byte, nesting, collection, finite-number and string bounds are enforced
```

## m245

File: `src/director/document.js`.

```text
Old:
return project;
New:
for (const scene of project.scenes) for (const shot of scene.shots) delete shot.visual; return project;
Selected test: [director-015] captured scope and extended detection edits survive migration
Result: KILLED
Failed test prefix: [director-015] captured scope and extended detection edits survive migration
```

## m246

File: `src/director/clock.js`.

```text
Old:
this.stopSceneTimer();
  }
New:
/* mutation */
  }
Selected test: [director-024] Stop releases every clock timer and queued callbacks cannot publish later
Result: KILLED
Failed test prefix: [director-024] Stop releases every clock timer and queued callbacks cannot publish later
```

## m247

File: `src/director/clock.js`.

```text
Old:
if (this._sceneClockTimer !== timer) return;
New:
<empty>
Selected test: [director-030] replacing a shot clock rejects the old callback without clearing the replacement
Result: KILLED
Failed test prefix: [director-030] replacing a shot clock rejects the old callback without clearing the replacement
```

## m248

File: `src/director/clock.js`.

```text
Old:
this.onProgress(from + (to - from) * fraction);
New:
this.onProgress(from);
Selected test: [director-028] direct-load progress finishes once and snapshots cannot mutate the clock
Result: KILLED
Failed test prefix: [director-028] direct-load progress finishes once and snapshots cannot mutate the clock
```

## m249

File: `src/director/clock.js`.

```text
Old:
const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      token.signal?.aborted
New:
const timing = this.timingForShot(scene, shot);
    if (
      generation !== this._sceneGeneration ||
      this._destroyed ||
      token.cancelled ||
      false
Selected test: [director-030] aborted starts and destruction during initial notification leave no timers or listeners
Result: KILLED
Failed test prefix: [director-030] aborted starts and destruction during initial notification leave no timers or listene
```

## m250

File: `src/director/clock.js`.

```text
Old:
const endAt = this.now() + ms;
New:
const endAt = this.now();
Selected test: [director-025] Stop, abort and destroy settle long holds immediately and release their deadlines
Result: KILLED
Failed test prefix: [director-025] Stop, abort and destroy settle long holds immediately and release their deadlines
```

## m251

File: `src/director/clock.js`.

```text
Old:
});
    if (
      generation !== this._sceneGeneration ||
New:
});
    if (
      false ||
Selected test: [director-030] a subscriber can Stop or replace the initial clock without the old start acquiring a timer
Result: KILLED
Failed test prefix: [director-030] a subscriber can Stop or replace the initial clock without the old start acquiring a
```

## m252

File: `src/director/playback.js`.

```text
Old:
const ordered = single
New:
const ordered = false
Selected test: [director-036] The single scene queue excludes other scenes
Result: KILLED
Failed test prefix: [director-036] The single scene queue excludes other scenes
```

## m253

File: `src/director/playback.js`.

```text
Old:
  'applyVisual',
New:
<empty>
Selected test: [director-037] playback sequences phases, releases only at scene changes, then releases the final scene
Result: KILLED
Failed test prefix: [director-037] playback sequences phases, releases only at scene changes, then releases the final sc
```

## m254

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in selectShot propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in selectShot propagates after release, without later shots
```

## m255

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in applyVisual propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in applyVisual propagates after release, without later shots
```

## m256

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in applyLayers propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in applyLayers propagates after release, without later shots
```

## m257

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in travel propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in travel propagates after release, without later shots
```

## m258

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in settle propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in settle propagates after release, without later shots
```

## m259

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in hold propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in hold propagates after release, without later shots
```

## m260

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] failure in completeShot propagates after release, without later shots
Result: KILLED
Failed test prefix: [director-040] failure in completeShot propagates after release, without later shots
```

## m261

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] empty and pre-aborted runs never acquire or release adapter resources
Result: KILLED
Failed test prefix: [director-038] empty and pre-aborted runs never acquire or release adapter resources
```

## m262

File: `src/director/playback.js`.

```text
Old:
if (cancelled()) break;
      }
New:
/* mutation */
      }
Selected test: [director-038] cancellation during an inter-scene release never acquires the next scene
Result: KILLED
Failed test prefix: [director-038] cancellation during an inter-scene release never acquires the next scene
```

## m263

File: `src/director/playback.js`.

```text
Old:
releaseOnFinish && activeScene
New:
activeScene
Selected test: [director-039] The final scene stays when cleanup is off
Result: KILLED
Failed test prefix: [director-039] The final scene stays when cleanup is off
```

## m264

File: `src/director/playback.js`.

```text
Old:
if (releaseOnFinish && activeScene) await adapter.releaseScene(activeScene);
New:
<empty>
Selected test: [director-040] a cleanup failure rejects for the caller to restore its own controls
Result: KILLED
Failed test prefix: [director-040] a cleanup failure rejects for the caller to restore its own controls
```

## m265

File: `src/director/timeline.js`.

```text
Old:
targetSec < endElapsedSec ||
New:
targetSec <= endElapsedSec ||
Selected test: [director-031 director-034] scene time accounts for flight and hold; exact boundaries select the next shot
Result: KILLED
Failed test prefix: [director-031 director-034] scene time accounts for flight and hold; exact boundaries select the nex
```

## m266

File: `src/director/timeline.js`.

```text
Old:
4 * t ** 3
New:
0 * t ** 3
Selected test: [director-033] The camera uses both cubic halves
Result: KILLED
Failed test prefix: [director-033] The camera uses both cubic halves
```

## m267

File: `src/director/documentFields.js`.

```text
Old:
typeof value === 'number' && Number.isFinite(value)
New:
Number.isFinite(value)
Selected test: [director-011] The JSON rejects functions
Result: SURVIVED
Failed test prefix: <none>
```

## m268

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after selectShot
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after selectShot
```

## m269

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after selectShot
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after selectShot
```

## m270

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after applyVisual
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after applyVisual
```

## m271

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after applyVisual
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after applyVisual
```

## m272

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after applyLayers
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after applyLayers
```

## m273

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after applyLayers
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after applyLayers
```

## m274

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after travel
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after travel
```

## m275

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after travel
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after travel
```

## m276

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after settle
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after settle
```

## m277

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after settle
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after settle
```

## m278

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after hold
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after hold
```

## m279

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after hold
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after hold
```

## m280

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.signal?.aborted)
Selected test: [director-038] The flag token stops work after completeShot
Result: KILLED
Failed test prefix: [director-038] The flag token stops work after completeShot
```

## m281

File: `src/director/playback.js`.

```text
Old:
Boolean(token.cancelled || token.signal?.aborted)
New:
Boolean(token.cancelled)
Selected test: [director-038] The signal token stops work after completeShot
Result: KILLED
Failed test prefix: [director-038] The signal token stops work after completeShot
```

## m282

File: `src/director/playback.js`.

```text
Old:
if (!released)
New:
if (false)
Selected test: [director-039] The refused handoff stops the first shot
Result: KILLED
Failed test prefix: [director-039] The refused handoff stops the first shot
```

## m283

File: `src/director/clock.js`.

```text
Old:
Number(sceneElapsedSec) || 0
New:
0
Selected test: [director-023] The clock bounds and copies its snapshot
Result: KILLED
Failed test prefix: [director-023] The clock bounds and copies its snapshot
```

## m284

File: `src/director/timeline.js`.

```text
Old:
const t = clamp01(Number(progress) || 0);
New:
const t = 0;
Selected test: [director-033] The camera uses both cubic halves
Result: KILLED
Failed test prefix: [director-033] The camera uses both cubic halves
```

## m285

File: `src/director/timeline.js`.

```text
Old:
const normalized = clamp01(Number(progress) || 0);
New:
const normalized = 0;
Selected test: [director-031 director-034] scene time accounts for flight and hold; exact boundaries select the next shot
Result: KILLED
Failed test prefix: [director-031 director-034] scene time accounts for flight and hold; exact boundaries select the nex
```

## m286

File: `src/director/timeline.js`.

```text
Old:
const start = Number(from) || 0;
New:
const start = 0;
Selected test: [director-033] The camera takes the shortest arc for both angles
Result: KILLED
Failed test prefix: [director-033] The camera takes the shortest arc for both angles
```

## m287

File: `src/director/timeline.js`.

```text
Old:
scene?.shots?.map((item) => durationForShot(scene, item)) || []
New:
[]
Selected test: [director-031] The shot boundaries use cumulative durations
Result: KILLED
Failed test prefix: [director-031] The shot boundaries use cumulative durations
```

## m288

File: `src/director/timeline.js`.

```text
Old:
scene?.shots?.findIndex(({ id }) => id === shot?.id) ?? -1
New:
-1
Selected test: [director-031] The shot boundaries use cumulative durations
Result: KILLED
Failed test prefix: [director-031] The shot boundaries use cumulative durations
```

## m289

File: `src/director/playback.js`.

```text
Old:
[...scenes.slice(start), ...scenes.slice(0, start)]
New:
[...scenes.slice(0, start), ...scenes.slice(start)]
Selected test: [director-036] The queue wraps from scene b and keeps each shot object
Result: KILLED
Failed test prefix: [director-036] The queue wraps from scene b and keeps each shot object
```

## m290

File: `src/director/playback.js`.

```text
Old:
const start = Math.max(
    0,
    scenes.findIndex((scene) => scene.id === startSceneId),
  );
New:
const start = scenes.findIndex((scene) => scene.id === startSceneId);
Selected test: [director-036] The unknown start ID selects the first scene
Result: KILLED
Failed test prefix: [director-036] The unknown start ID selects the first scene
```

## m291

File: `src/director/playback.js`.

```text
Old:
return ordered.flatMap((scene) =>
New:
return ordered.map((scene) =>
Selected test: [director-036] The queue wraps from scene b and keeps each shot object
Result: KILLED
Failed test prefix: [director-036] The queue wraps from scene b and keeps each shot object
```

## m292

File: `src/director/playback.js`.

```text
Old:
scene.shots.map((shot) => ({ scene, shot }))
New:
scene.shots.map((shot) => ({ scene, shot: { ...shot } }))
Selected test: [director-036] The queue wraps from scene b and keeps each shot object
Result: KILLED
Failed test prefix: [director-036] The queue wraps from scene b and keeps each shot object
```

## m293

File: `src/director/timeline.js`.

```text
Old:
+ 540
New:
+ 360
Selected test: [director-033] The camera takes the shortest arc for both angles
Result: KILLED
Failed test prefix: [director-033] The camera takes the shortest arc for both angles
```

## m294

File: `src/director/timeline.js`.

```text
Old:
% 360
New:
% 180
Selected test: [director-033] The camera takes the shortest arc for both angles
Result: KILLED
Failed test prefix: [director-033] The camera takes the shortest arc for both angles
```

## m295

File: `src/director/timeline.js`.

```text
Old:
) - 180
New:
) - 0
Selected test: [director-033] The camera takes the shortest arc for both angles
Result: KILLED
Failed test prefix: [director-033] The camera takes the shortest arc for both angles
```

## m296

File: `src/director/document.js`.

```text
Old:
  fields(value, path, [
    'style',
    'bloom',
    'sharpen',
    'hud',
    'detection',
    'scope',
    'mapStack',
    'styleParams',
  ]);
New:
<empty>
Selected test: [director-014] The visual check rejects an unknown field
Result: KILLED
Failed test prefix: [director-014] The visual check rejects an unknown field
```

## m297

File: `src/director/document.js`.

```text
Old:
fields(entry, field, Object.keys(spec));
New:
<empty>
Selected test: [director-015] The visual control rejects an unknown field
Result: KILLED
Failed test prefix: [director-015] The visual control rejects an unknown field
```

## m298

File: `src/director/document.js`.

```text
Old:
fields(pack, at, ['id', 'version', 'shotBindings']);
New:
<empty>
Selected test: [director-016] The pack entry rejects an unknown field
Result: KILLED
Failed test prefix: [director-016] The pack entry rejects an unknown field
```

## m299

File: `src/director/document.js`.

```text
Old:
fields(entry, p, ['enabled', 'params']);
New:
<empty>
Selected test: [director-018] The layer entry rejects an unknown field
Result: KILLED
Failed test prefix: [director-018] The layer entry rejects an unknown field
```

## m300

File: `src/director/document.js`.

```text
Old:
uniqueId(scene, path, sceneIds);
New:
<empty>
Selected test: [director-004] The document rejects a duplicate scene ID
Result: KILLED
Failed test prefix: [director-004] The document rejects a duplicate scene ID
```

## m301

File: `src/director/document.js`.

```text
Old:
uniqueId(pack, at, packIds);
New:
<empty>
Selected test: [director-016] The document rejects a duplicate pack ID
Result: KILLED
Failed test prefix: [director-016] The document rejects a duplicate pack ID
```

## m302

File: `src/director/document.js`.

```text
Old:
version >= 4 ? ['anchors']
New:
version >= 6 ? ['anchors']
Selected test: [director-003] The import accepts the anchors field and the move field at versions 4 through 6
Result: KILLED
Failed test prefix: [director-003] The import accepts the anchors field and the move field at versions 4 through 6
```

## m303

File: `src/director/document.js`.

```text
Old:
version >= 4 ? ['move']
New:
version >= 6 ? ['move']
Selected test: [director-003] The import accepts the anchors field and the move field at versions 4 through 6
Result: KILLED
Failed test prefix: [director-003] The import accepts the anchors field and the move field at versions 4 through 6
```

## m304

File: `src/director/document.js`.

```text
Old:
version >= 5 ? ['dataPacks']
New:
version >= 6 ? ['dataPacks']
Selected test: [director-003] The import accepts data packs at versions 5 and 6
Result: KILLED
Failed test prefix: [director-003] The import accepts data packs at versions 5 and 6
```

## m305

File: `src/director/document.js`.

```text
Old:
version >= 5 ? ['dataPackIds']
New:
version >= 6 ? ['dataPackIds']
Selected test: [director-003] The import accepts data packs at versions 5 and 6
Result: KILLED
Failed test prefix: [director-003] The import accepts data packs at versions 5 and 6
```

## m306

File: `src/director/clock.js`.

```text
Old:
running = this.isRunning()
New:
running = true
Selected test: [director-023] The publication uses false from the clock state
Result: KILLED
Failed test prefix: [director-023] The publication uses false from the clock state
```

## m307

File: `src/director/clock.js`.

```text
Old:
const elapsedSec = Math.max(
      0,
      Math.min(timing.totalSec, Number(sceneElapsedSec) || 0),
    );
New:
const elapsedSec = Math.min(timing.totalSec, Number(sceneElapsedSec) || 0);
Selected test: [director-023] The publication clamps negative elapsed time to zero
Result: KILLED
Failed test prefix: [director-023] The publication clamps negative elapsed time to zero
```

## m308

File: `src/director/timeline.js`.

```text
Old:
.slice(0, Math.max(0, shotIndex))
New:
.slice(0, shotIndex)
Selected test: [director-032] The absent shot starts at zero elapsed time
Result: KILLED
Failed test prefix: [director-032] The absent shot starts at zero elapsed time
```

## m309

File: `src/director/documentFields.js`.

```text
Old:
max = 256
New:
max = 255
Selected test: [director-006] The default text limit accepts 256 characters
Result: KILLED
Failed test prefix: [director-006] The default text limit accepts 256 characters
```

## m310

File: `src/director/documentFields.js`.

```text
Old:
max = 256
New:
max = 257
Selected test: [director-006] The default text limit rejects 257 characters
Result: KILLED
Failed test prefix: [director-006] The default text limit rejects 257 characters
```

## m311

File: `src/director/playback.js`.

```text
Old:
const context = { scene, shot, index, total: queue.length, token };
New:
const context = { scene, shot, index: 0, total: queue.length, token };
Selected test: [director-037] The phase context gives each index and the queue total
Result: KILLED
Failed test prefix: [director-037] The phase context gives each index and the queue total
```

## m312

File: `src/director/playback.js`.

```text
Old:
const context = { scene, shot, index, total: queue.length, token };
New:
const context = { scene, shot, index, total: 1, token };
Selected test: [director-037] The phase context gives each index and the queue total
Result: KILLED
Failed test prefix: [director-037] The phase context gives each index and the queue total
```

## m313

File: `src/director/playback.js`.

```text
Old:
scenes.slice(start, start + 1)
New:
scenes.slice(start, start + 2)
Selected test: [director-036] The single scene queue starts at scene a and keeps source objects
Result: KILLED
Failed test prefix: [director-036] The single scene queue starts at scene a and keeps source objects
```

## m314

File: `src/director/playback.js`.

```text
Old:
({ scene, shot })
New:
({ scene: { id: scene.id }, shot })
Selected test: [director-036] The single scene queue starts at scene a and keeps source objects
Result: KILLED
Failed test prefix: [director-036] The single scene queue starts at scene a and keeps source objects
```

## m315

File: `src/director/document.js`.

```text
Old:
...(version >= 6 ? ['interactions'] : [])
New:
...(version >= 7 ? ['interactions'] : [])
Selected test: [director-003] The import accepts an empty interactions list at version 6
Result: KILLED
Failed test prefix: [director-003] The import accepts an empty interactions list at version 6
```

## m316

File: `src/director/playback.js`.

```text
Old:
const context = { scene, shot, index, total: queue.length, token };
New:
const context = { scene, shot: queue[0].shot, index, total: queue.length, token };
Selected test: [director-037] The phase context gives each index and the queue total
Result: KILLED
Failed test prefix: [director-037] The phase context gives each index and the queue total
```

## m317

File: `src/director/clock.js`.

```text
Old:
listener({ ...this._sceneClockSnapshot });
      } catch (error)
New:
listener({ ...this._sceneClockSnapshot, sceneElapsedSec: 0 });
      } catch (error)
Selected test: [director-023] The clock warns when a subscriber fails
Result: KILLED
Failed test prefix: [director-023] The clock warns when a subscriber fails
```

## m318

File: `src/director/clock.js`.

```text
Old:
listener(this.snapshot);
New:
listener({ ...this.snapshot, running: true });
Selected test: [director-024] The stop notifies every subscriber
Result: KILLED
Failed test prefix: [director-024] The stop notifies every subscriber
```

## New mutation summary

The sections above give the exact Old, New, Result and failed test text for each row.

| ID | File | Result | Scenario |
| --- | --- | --- | --- |
| `m289` | `src/director/playback.js` | KILLED | `director-036` |
| `m290` | `src/director/playback.js` | KILLED | `director-036` |
| `m291` | `src/director/playback.js` | KILLED | `director-036` |
| `m292` | `src/director/playback.js` | KILLED | `director-036` |
| `m293` | `src/director/timeline.js` | KILLED | `director-033` |
| `m294` | `src/director/timeline.js` | KILLED | `director-033` |
| `m295` | `src/director/timeline.js` | KILLED | `director-033` |
| `m296` | `src/director/document.js` | KILLED | `director-014` |
| `m297` | `src/director/document.js` | KILLED | `director-015` |
| `m298` | `src/director/document.js` | KILLED | `director-016` |
| `m299` | `src/director/document.js` | KILLED | `director-018` |
| `m300` | `src/director/document.js` | KILLED | `director-004` |
| `m301` | `src/director/document.js` | KILLED | `director-016` |
| `m302` | `src/director/document.js` | KILLED | `director-003` |
| `m303` | `src/director/document.js` | KILLED | `director-003` |
| `m304` | `src/director/document.js` | KILLED | `director-003` |
| `m305` | `src/director/document.js` | KILLED | `director-003` |
| `m306` | `src/director/clock.js` | KILLED | `director-023` |
| `m307` | `src/director/clock.js` | KILLED | `director-023` |
| `m308` | `src/director/timeline.js` | KILLED | `director-032` |
| `m309` | `src/director/documentFields.js` | KILLED | `director-006` |
| `m310` | `src/director/documentFields.js` | KILLED | `director-006` |
| `m311` | `src/director/playback.js` | KILLED | `director-037` |
| `m312` | `src/director/playback.js` | KILLED | `director-037` |
| `m313` | `src/director/playback.js` | KILLED | `director-036` |
| `m314` | `src/director/playback.js` | KILLED | `director-036` |
| `m315` | `src/director/document.js` | KILLED | `director-003` |
| `m316` | `src/director/playback.js` | KILLED | `director-037` |
| `m317` | `src/director/clock.js` | KILLED | `director-023` |
| `m318` | `src/director/clock.js` | KILLED | `director-024` |
