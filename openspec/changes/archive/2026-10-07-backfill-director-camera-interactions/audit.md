# Director branch audit

Pass 3 reads base commit `290b5d2`.

| File | Line | Class | Expression | Test and mutation | Evidence |
| --- | ---: | --- | --- | --- | --- |
| `src/director/camera.js` | 5 | `TESTED` | `!camera` | m001 | The named tests and mutations check this row. |
| `src/director/camera.js` | 6 | `TESTED` | See expression 1. | m003,m004 | The named tests and mutations check this row. |
| `src/director/camera.js` | 7 | `DEFAULT-VALUE` | `scene?.anchors?.find` | m174,m004 | The named tests and mutations check this row. |
| `src/director/camera.js` | 7 | `DEFAULT-VALUE` | `scene?.anchors` | m173,m004 | The named tests and mutations check this row. |
| `src/director/camera.js` | 9 | `TESTED` | `!position` | m005 | The named tests and mutations check this row. |
| `src/director/camera.js` | 14 | `DEFAULT-VALUE` | `camera.heading ?? 0` | m008,m009,m240 | The named tests and mutations check this row. |
| `src/director/camera.js` | 15 | `DEFAULT-VALUE` | `camera.pitch ?? -35` | m010,m011 | The named tests and mutations check this row. |
| `src/director/camera.js` | 16 | `DEFAULT-VALUE` | `camera.roll ?? 0` | m012,m013,m241 | The named tests and mutations check this row. |
| `src/director/camera.js` | 22 | `TESTED` | `!shot?.move` | m002,m175 | The named tests and mutations check this row. |
| `src/director/camera.js` | 22 | `TESTED` | `shot?.move` | m002,m175 | The named tests and mutations check this row. |
| `src/director/camera.js` | 33 | `DEFAULT-VALUE` | `Number(progress) &#124;&#124; 0` | m017,m018 | The named tests and mutations check this row. |
| `src/director/camera.js` | 34 | `TESTED` | `t === 0` | m019 | The named tests and mutations check this row. |
| `src/director/camera.js` | 35 | `TESTED` | `t === 1` | m020 | The named tests and mutations check this row. |
| `src/director/camera.js` | 37 | `TESTED` | See expression 2. | m030,m028,m029 | The named tests and mutations check this row. |
| `src/director/camera.js` | 39 | `TESTED` | See expression 3. | m028,m029,m237,m250,m251 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 18 | `TESTED` | `Object.entries(bounds)` | m031,m034,m037,m040,m041,m042,m032,m035,m038,m256,m257 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 19 | `TESTED` | `required &#124;&#124; Object.hasOwn(value, key)` | m045,m046,m043 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 19 | `TESTED` | `required &#124;&#124; Object.hasOwn(value, key)` | m045,m046,m043 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 24 | `TESTED` | `value !== 'ellipsoid'` | m063,m065 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 31 | `TESTED` | See expression 4. | m059,m161 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 31 | `DEFAULT-VALUE` | `value &#124;&#124; {}` | m145,m161 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 34 | `TESTED` | See expression 5. | m159,m160,m215,m216,m217,m218 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 38 | `TESTED` | See expression 6. | m061,m062 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 42 | `TESTED` | `anchored` | m162,m197 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 44 | `TESTED` | `!anchorIds.has(value.anchorId)` | m066,m162 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 48 | `TESTED` | `explicit &#124;&#124; Object.hasOwn(value, 'altitudeReference')` | m063,m064 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 48 | `TESTED` | `explicit &#124;&#124; Object.hasOwn(value, 'altitudeReference')` | m063,m064 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 77 | `TESTED` | `!['linear', 'cubic-in-out'].includes(move.easing)` | m075,m076,m077 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 12 | `DEFAULT-VALUE` | `scene.dataPacks &#124;&#124; []` | m091,m092 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 13 | `DEFAULT-VALUE` | `scene.anchors &#124;&#124; []` | m093,m094 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 28 | `TESTED` | See expression 7. | m088,m089 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 29 | `TESTED` | See expression 8. | m088,m089 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 29 | `DEFAULT-VALUE` | `packs.get(item.target.packId)?.format` | m176,m092 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 30 | `DEFAULT-VALUE` | `shot.dataPackIds?.includes` | m177,m092 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 40 | `TESTED` | `!a &#124;&#124; !Object.hasOwn(specs, a.type)` | m096,m097,m255 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 40 | `TESTED` | `!a &#124;&#124; !Object.hasOwn(specs, a.type)` | m096,m097,m255 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 49 | `TESTED` | `reference` | m112,m113,m114,m163 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 50 | `TESTED` | `a.type === 'card'` | m163 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 60 | `TESTED` | See expression 9. | m105,m106,m107,m108,m109 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 61 | `TESTED` | See expression 10. | m105,m106,m107,m108,m109 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 61 | `TESTED` | See expression 11. | m105,m106,m107,m108,m109 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 61 | `TESTED` | See expression 12. | m105,m106,m107,m108,m109 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 61 | `TESTED` | See expression 13. | m105,m106,m107,m108,m109 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 72 | `TESTED` | See expression 14. | m152,m095 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 72 | `TESTED` | See expression 15. | m152,m095 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 74 | `TESTED` | `a.type === 'shot'` | m164 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 76 | `TESTED` | `!target` | m115 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 78 | `TESTED` | `items` | m178,m179,m117 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 79 | `TESTED` | See expression 16. | m116,m117 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 80 | `TESTED` | See expression 17. | m116,m117 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 80 | `DEFAULT-VALUE` | `entry?.action?.type` | m148,m116 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 80 | `DEFAULT-VALUE` | `entry?.action` | m147,m116 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 81 | `DEFAULT-VALUE` | `target.layers &#124;&#124; {}` | m119,m120 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 87 | `TESTED` | `a.type === 'layer'` | m165 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 88 | `TESTED` | `!Object.hasOwn(shot.layers &#124;&#124; {}, a.layerId)` | m121 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 88 | `DEFAULT-VALUE` | `shot.layers &#124;&#124; {}` | m122,m123 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 90 | `TESTED` | `typeof a.enabled !== 'boolean'` | m124 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 14 | `DEFAULT-VALUE` | `controller?.abort` | m143,m198 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 29 | `TESTED` | See expression 18. | m136,m137 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 29 | `TESTED` | See expression 19. | m136,m137 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 29 | `TESTED` | `!active &#124;&#124; busy` | m136,m137 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 42 | `TESTED` | `current.signal.aborted` | m142 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 38 | `TESTED` | `resolve(false)` | m252 | The abort event test fails while the signal reports aborted false. |
| `src/director/interactions/session.js` | 42 | `EQUIVALENT` | `return false` | m253 | The guard at line 47 decides each cancelled result, so the final abort guard returns false before an adapter call. The public API probe passes. |
| `src/director/interactions/session.js` | 39 | `TESTED` | `{ once: true }` | m254 | The abort event test reads one listener before the event and zero after it. |
| `src/director/interactions/session.js` | 46 | `TESTED` | See expression 20. | m139,m150 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 53 | `TESTED` | `controller === current` | m144 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 41 | `TESTED` | See expression 21. | m047,m048,m049,m050,m051,m052 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 47 | `TESTED` | See expression 22. | m053,m054,m055,m056,m057,m058 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 30 | `DEFAULT-VALUE` | `explicit = false` | m245,m045 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 2 | `DEFAULT-VALUE` | See expression 23. | m244,m138 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 24 | `TESTED` | `active = !!actions.size` | m134 | The named tests and mutations check this row. |
| `src/director/interactions/session.js` | 29 | `EQUIVALENT` | `!active` | m149 | An empty native Map contains no item. The probe uses getters, a proxy and a spy. |
| `src/director/cameraDocument.js` | 32 | `TESTED` | `fields for a pose` | m248 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 60 | `TESTED` | `fields for an anchor` | m231 | The named tests and mutations check this row. |
| `src/director/cameraDocument.js` | 76 | `TESTED` | `fields for a move` | m230 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 21 | `TESTED` | `fields for an interaction` | m228 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 25 | `TESTED` | `fields for a target` | m229 | The named tests and mutations check this row. |
| `src/director/interactions/document.js` | 43 | `TESTED` | See expression 24. | m224,m225,m226,m227 | The named tests and mutations check this row. |

## Test names

```text
m001: [director-041] The absent camera returns null
m002: [director-041] The absent move returns null
m003: [director-042] The inline pose copies each field
m004: [director-043] The anchor supplies the position
m005: [director-043] The unknown anchor rejects the pose
m008: [director-044] The absent heading uses its default
m009: [director-044] The inline heading keeps zero
m010: [director-044] The absent pitch uses its default
m011: [director-044] The inline pitch keeps zero
m012: [director-044] The absent roll uses its default
m013: [director-044] The inline roll keeps zero
m017: [director-046] The progress accepts the invalid text
m018: [director-046] The progress accepts the numeric text
m019: [director-046] The endpoint 0 returns an exact copy
m020: [director-046] The endpoint 1 returns an exact copy
m028: [director-048] The cubic sample uses the first half
m029: [director-048] The cubic sample uses the second half
m030: [director-047] The linear curve uses its supplied fraction
m031: [director-049] The shot without a move rejects invalid lat
m032: [director-053] The inline start needs lat
m034: [director-049] The shot without a move rejects invalid lon
m035: [director-053] The inline start needs lon
m037: [director-049] The shot without a move rejects invalid alt
m038: [director-053] The inline start needs alt
m040: [director-050] The pose rejects invalid heading
m041: [director-050] The pose rejects invalid pitch
m042: [director-050] The pose rejects invalid roll
m043: [director-050] The pose accepts absent orientation
m045: [director-053] The inline start needs all coordinates
m046: [director-050] The supplied orientation field controls the check
m047: [director-051] The version 2 pose accepts text heading
m048: [director-051] The version 3 pose rejects text heading
m049: [director-051] The version 2 pose accepts text pitch
m050: [director-051] The version 3 pose rejects text pitch
m051: [director-051] The version 2 pose accepts text roll
m052: [director-051] The version 3 pose rejects text roll
m053: [director-051] The version 2 pose accepts text lat
m054: [director-051] The version 3 pose rejects text lat
m055: [director-051] The version 2 pose accepts text lon
m056: [director-051] The version 3 pose rejects text lon
m057: [director-051] The version 2 pose accepts text alt
m058: [director-051] The version 3 pose rejects text alt
m059: [director-051] The early version rejects an anchor reference
m061: [director-055] The modern inline pose accepts its reference
m062: [director-051] The early version rejects the height field
m063: [director-055] The supplied height reference controls the check
m064: [director-055] The inline endpoint needs a height reference
m065: [director-055] The ellipsoid reference accepts the pose
m066: [director-052] The anchor ID must name a scene anchor
m075: [director-054] The move rejects an unsupported curve
m076: [director-054] The move accepts the linear curve
m077: [director-054] The move accepts the cubic-in-out curve
m088: [director-056] The target rejects a different pack format
m089: [director-056] The target rejects an unselected pack
m091: [director-056] The target rejects absent scene packs
m092: [director-056] The target accepts a selected GeoJSON pack
m093: [director-059] The focus rejects absent scene anchors
m094: [director-059] The focus accepts a scene anchor
m095: [director-059] The focus rejects an unknown anchor
m096: [director-057] The action field rejects an absent object
m097: [director-057] The action field rejects an unknown type
m105: [director-058] The card rejects a source protocol
m106: [director-058] The card rejects a source user name
m107: [director-058] The card rejects a source password
m108: [director-058] The card rejects a source query
m109: [director-058] The card rejects a source fragment
m112: [director-057] The action field rejects nontext anchorId
m113: [director-057] The action field rejects nontext shotId
m114: [director-057] The action field rejects nontext layerId
m115: [director-060] The shot action field rejects an unknown shot
m116: [director-060] The target shot needs each layer baseline
m117: [director-060] The target shot check skips a card action field
m119: [director-060] The absent target shot layers use an empty baseline
m120: [director-060] The target shot accepts every declared layer
m121: [director-061] The layer needs a direct shot baseline
m122: [director-061] The absent shot layers use an empty baseline
m123: [director-061] The layer accepts a direct shot baseline
m124: [director-061] The layer rejects a nonboolean state
m134: [director-066] The session activates every unique interaction
m136: [director-068] The busy session refuses a second adapter call
m137: [director-069] The active session refuses an unknown ID
m138: [director-070] The successful interaction gives idle state with the selected ID
m139: [director-071] The false adapter result refuses the interaction
m142: [director-073] The session cancels work before an adapter call
m143: [director-073] The session settles work with no adapter result
m144: [director-074] The old work leaves new session state intact
m145: [director-049] The null pose gives a document error
m147: [director-060] The shot loop skips an absent entry
m148: [director-060] The shot loop skips an absent action field
m149: [director-067] The inactive session refuses adapter call
m150: [director-073] The session returns false when clear runs after the result
m152: [director-061] The layer ignores an unrelated anchor ID
m159: [director-051] The anchor shape uses its supplied reference field
m160: [director-055] The inline shape keeps its coordinate fields
m161: [director-051] The inline pose controls its supplied shape
m162: [director-052] The anchor reference checks its ID
m163: [director-057] The card type controls its text check
m164: [director-060] The shot type controls its reference check
m165: [director-061] The layer type controls its state check
m173: [director-043] The pose rejects an absent scene
m174: [director-043] The pose rejects an absent anchor list
m175: [director-041] The absent move returns null
m176: [director-056] The target rejects absent scene packs
m177: [director-056] The target rejects absent selected packs
m178: [director-060] The target shot loop checks the traffic entry
m179: [director-060] The target shot loop checks the ships entry
m197: [director-050] The pose accepts absent orientation
m198: [director-066] The session activates every unique interaction
m215: [director-075] The anchor pose rejects its inline lat field
m216: [director-075] The anchor pose rejects its inline lon field
m217: [director-075] The anchor pose rejects its inline alt field
m218: [director-075] The anchor pose rejects its inline altitudeReference field
m224: [director-057] The card action field rejects an extra field
m225: [director-057] The focus action field rejects an extra field
m226: [director-057] The shot action field rejects an extra field
m227: [director-057] The layer action field rejects an extra field
m228: [director-057] The interaction rejects an extra field
m229: [director-057] The target rejects an extra field
m230: [director-054] The move rejects an extra field
m231: [director-052] The anchor rejects an extra field
m237: [director-048] The cubic sample uses progress 0.45
m240: [director-044] The heading keeps negative zero from a getter
m241: [director-044] The roll keeps negative zero from a getter
m244: [director-065] The default state callback accepts a session change
m245: [director-049] The shot without a move uses optional coordinates by default
m248: [director-049] The pose rejects an extra field
```


## Expression 1

```text
camera.anchorId
    ? scene?.anchors?.find(({ id }) => id === camera.anchorId)
    : camera
```

## Expression 2

```text
move.easing === 'linear'
      ? t
      : t < 0.5
        ? 4 * t ** 3
        : 1 - (-2 * t + 2) ** 3 / 2
```

## Expression 3

```text
t < 0.5
        ? 4 * t ** 3
        : 1 - (-2 * t + 2) ** 3 / 2
```

## Expression 4

```text
version >= 4 && Object.hasOwn(value || {}, 'anchorId')
```

## Expression 5

```text
anchored
      ? ['anchorId']
      : [
          ...Object.keys(POSITION),
          ...(version >= 4 ? ['altitudeReference'] : []),
        ]
```

## Expression 6

```text
version >= 4 ? ['altitudeReference'] : []
```

## Expression 7

```text
packs.get(item.target.packId)?.format !== 'geojson' ||
          !shot.dataPackIds?.includes(item.target.packId)
```

## Expression 8

```text
packs.get(item.target.packId)?.format !== 'geojson' ||
          !shot.dataPackIds?.includes(item.target.packId)
```

## Expression 9

```text
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
```

## Expression 10

```text
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search ||
              parsed.hash
```

## Expression 11

```text
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password ||
              parsed.search
```

## Expression 12

```text
parsed.protocol !== 'https:' ||
              parsed.username ||
              parsed.password
```

## Expression 13

```text
parsed.protocol !== 'https:' ||
              parsed.username
```

## Expression 14

```text
a.type === 'focus' && !anchors.has(a.anchorId)
```

## Expression 15

```text
a.type === 'focus' && !anchors.has(a.anchorId)
```

## Expression 16

```text
entry?.action?.type === 'layer' &&
              !Object.hasOwn(target.layers || {}, entry.action.layerId)
```

## Expression 17

```text
entry?.action?.type === 'layer' &&
              !Object.hasOwn(target.layers || {}, entry.action.layerId)
```

## Expression 18

```text
!active || busy || !item
```

## Expression 19

```text
!active || busy || !item
```

## Expression 20

```text
(await Promise.race([work, cancelled])) !== false &&
          !current.signal.aborted
```

## Expression 21

```text
version < 3 for orientation
```

## Expression 22

```text
version < 3 for position
```

## Expression 23

```text
changed = () => {}
```

## Expression 24

```text
fields for each action type
```

## Totals

The command gives 79 rows: 59 tested, 18 default-value, two equivalent and zero open rows.

The public API probes for m149 and m253 are in `evidence/probe-equivalent.txt`.
A patched built-in prototype is outside the public API limit.

## Pass 3 test links

```text
m250, m251: [director-048] The cubic sample uses progress 0.55
m255: [director-057] The action field rejects an inherited type name
m256, m257: [director-051] The version 1 pose accepts numeric text
```

```text
m252: [director-073] The abort event gives false before the signal changes
```

```text
m254: [director-073] The abort event gives false before the signal changes
```
