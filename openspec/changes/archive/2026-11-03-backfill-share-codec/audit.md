# Share codec audit

Source commit: `5fd416b9ed4a80c9a1ceeded81836aa69f3ebc0c`.

Branch: `backfill-share-codec`.

The JSON data records each exact edit and each failed test.

Each row below names a decision, loop, predicate or calculation.

The witness table names every operand and key case.

| ID | Source | Function | Class | Expression | Case prefix | First witness | Second witness |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A001 | src/share/follow.js:83 | followOffsetFromEnu | TESTED | `!(range>0)` | `A001-` | [share-codec-024] The local geometry uses each axis with its sign |  |
| A002 | src/share/follow.js:143 | followCameraFor | TESTED | `!(length>0)` | `A002-` | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |  |
| A003 | src/share/legacyShareState.js:61 | fromLegacyShareState | TESTED | `!parsed\|\|typeofparsed!=='object'` | `A003-` | [share-codec-043] The legacy converter uses own fields and excludes metadata |  |
| A004 | src/share/legacyShareState.js:63 | fromLegacyShareState | TESTED | `LEGACY_SHARE_STATE_KEYS` | `A004-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A005 | src/share/legacyShareState.js:64 | fromLegacyShareState | TESTED | `key!=='layerStateInvalid'&&Object.hasOwn(parsed,key)` | `A005-` | [share-codec-043] The legacy converter does not read metadata getters |  |
| A006 | src/share/legacyShareState.js:81 | toLegacyShareState | TESTED | `state.view.kind==='thing'?SHARE_VIEW_ENTITY_KINDS.find((e)=>e.kind===state.view.entity.kind):null` | `A006-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A007 | src/share/legacyShareState.js:85 | toLegacyShareState | TESTED | `entry&&!state.layerState?normalizeLayerState({...createDefaultLayerState(),enabledLayerIds:[entry.layerId],}):state.layerState` | `A007-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A008 | src/share/legacyShareState.js:85 | toLegacyShareState | TESTED | `entry&&!state.layerState` | `A008-` | [share-codec-043] The legacy field alt copies its own value |  |
| A009 | src/share/legacyShareState.js:91 | toLegacyShareState | TESTED | `entry?.tracking?SHARE_TRACKING_RESTORE_POLICIES[entry.tracking]:null` | `A009-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A010 | src/share/legacyShareState.js:95 | toLegacyShareState | TESTED | `layerState&&policy&&layerState.enabledLayerIds.includes(entry.layerId)` | `A010-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A011 | src/share/legacyShareState.js:95 | toLegacyShareState | TESTED | `layerState&&policy` | `A011-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A012 | src/share/legacyShareState.js:100 | toLegacyShareState | TESTED | `entry.kind==='satellite'?Number(state.view.entity.id):state.view.entity.id` | `A012-` | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |  |
| A013 | src/share/legacyShareState.js:115 | toLegacyShareState | TESTED | `LEGACY_SHARE_STATE_KEYS` | `A013-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A014 | src/share/shareLinkPath.js:22 | parseSharePath | TESTED | `typeofpathname!=='string'` | `A014-` | [share-codec-045] The path parser keeps invalid escapes for the decoder |  |
| A015 | src/share/shareLinkPath.js:24 | parseSharePath | TESTED | `!match` | `A015-` | [share-codec-045] The path parser keeps invalid escapes for the decoder |  |
| A016 | src/share/shareLinkPath.js:42 | appRootUrl | TESTED | `share?share.basePath:newURL('./',url).pathname` | `A016-` | [share-codec-046] The root uses both share paths and page directories |  |
| A017 | src/share/viewCodec.js:307 | layerOptionAbsentValue | TESTED | `owner&&Object.hasOwn(owner,spec.key)?owner[spec.key]:undefined` | `A017-` | [share-codec-018] The option cctv autoHop uses one wire entry |  |
| A018 | src/share/viewCodec.js:307 | layerOptionAbsentValue | EQUIVALENT | `owner&&Object.hasOwn(owner,spec.key)` | `A018-` | See the equivalent proof. |  |
| A019 | src/share/viewCodec.js:402 | defaultOf | TESTED | `entry.default!==BY_STYLE` | `A019-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A020 | src/share/viewCodec.js:404 | defaultOf | TESTED | `SHARE_VIEW_STYLE_DEFAULTS[style]??SHARE_VIEW_STYLE_DEFAULTS.normal` | `A020-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A021 | src/share/viewCodec.js:413 | createDefaultShareViewState | TESTED | `VIEW_STYLES.includes(requested)?requested:'normal'` | `A021-` | [share-codec-010] The default state keeps the selected style and valid keys |  |
| A022 | src/share/viewCodec.js:415 | createDefaultShareViewState | TESTED | `SHARE_VIEW_FIELDS` | `A022-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A023 | src/share/viewCodec.js:416 | createDefaultShareViewState | TESTED | `field.key==='view'\|\|field.key==='flags'` | `A023-` | [share-codec-043] The legacy converter uses own fields and excludes metadata |  |
| A024 | src/share/viewCodec.js:417 | createDefaultShareViewState | TESTED | `field.key==='thing'\|\|field.key==='layerOptions'` | `A024-` | [share-codec-043] The legacy converter uses own fields and excludes metadata |  |
| A025 | src/share/viewCodec.js:419 | createDefaultShareViewState | TESTED | `field.key==='style'?style:structuredClone(defaultOf(field,style))` | `A025-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A026 | src/share/viewCodec.js:421 | createDefaultShareViewState | TESTED | `SHARE_VIEW_FLAGS` | `A026-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A027 | src/share/viewCodec.js:430 | finite | TESTED | `typeofvalue==='number'?Number.isFinite(value):typeofvalue==='string'&&value.trim()!==''&&Number.isFinite(Number(value))` | `A027-` | [share-codec-048] The numeric bound for lat accepts  12.5  |  |
| A028 | src/share/viewCodec.js:432 | finite | TESTED | `typeofvalue==='string'&&value.trim()!==''&&Number.isFinite(Number(value))` | `A028-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A029 | src/share/viewCodec.js:432 | finite | TESTED | `typeofvalue==='string'&&value.trim()!==''` | `A029-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A030 | src/share/viewCodec.js:439 | intOr | TESTED | `finite(value)?clamp(Math.round(Number(value)),min,max)+0:fallback` | `A030-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A031 | src/share/viewCodec.js:445 | wrapAngle | TESTED | `!finite(value)` | `A031-` | [share-codec-012] The scalar heading uses its own field |  |
| A032 | src/share/viewCodec.js:450 | latitudeOr | TESTED | `!finite(value)` | `A032-` | [share-codec-012] The scalar lat uses its own field |  |
| A033 | src/share/viewCodec.js:459 | longitudeOr | TESTED | `!finite(value)` | `A033-` | [share-codec-012] The scalar lon uses its own field |  |
| A034 | src/share/viewCodec.js:462 | longitudeOr | TESTED | `lon<-180\|\|lon>180` | `A034-` | [share-codec-048] The numeric bound for lon accepts -190 |  |
| A035 | src/share/viewCodec.js:467 | epochMsOr | TESTED | `!finite(value)` | `A035-` | [share-codec-012] The scalar sharedAtMs uses its own field |  |
| A036 | src/share/viewCodec.js:469 | epochMsOr | TESTED | `seconds>=1&&Number.isSafeInteger(seconds*1000)?seconds*1000:null` | `A036-` | [share-codec-052] The time decoder checks each bound |  |
| A037 | src/share/viewCodec.js:469 | epochMsOr | TESTED | `seconds>=1&&Number.isSafeInteger(seconds*1000)` | `A037-` | [share-codec-052] The time decoder checks each bound |  |
| A038 | src/share/viewCodec.js:475 | nameOr | TESTED | `typeofvalue==='string'&&NAME_GRAMMAR.test(value)?value:fallback` | `A038-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A039 | src/share/viewCodec.js:475 | nameOr | TESTED | `typeofvalue==='string'&&NAME_GRAMMAR.test(value)` | `A039-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A040 | src/share/viewCodec.js:481 | normalizeEntityId | EQUIVALENT | `value===null\|\|value===undefined` | `A040-` | See the equivalent proof. |  |
| A041 | src/share/viewCodec.js:483 | normalizeEntityId | TESTED | `typeofvalue==='number'&&Number.isFinite(value)?String(value):typeofvalue==='string'?value.trim().toLowerCase():null` | `A041-` | [share-codec-021] The entity text uses trim and lowercase |  |
| A042 | src/share/viewCodec.js:483 | normalizeEntityId | TESTED | `typeofvalue==='number'&&Number.isFinite(value)` | `A042-` | [share-codec-021] The invalid identifier type does not reach the grammar |  |
| A043 | src/share/viewCodec.js:485 | normalizeEntityId | TESTED | `typeofvalue==='string'?value.trim().toLowerCase():null` | `A043-` | [share-codec-021] The invalid entity id uses a place for Infinity |  |
| A044 | src/share/viewCodec.js:488 | normalizeEntityId | TESTED | `raw===null\|\|!TRACKING_ID_GRAMMAR.test(raw)` | `A044-` | [share-codec-021] The invalid identifier type does not reach the grammar |  |
| A045 | src/share/viewCodec.js:489 | normalizeEntityId | TESTED | `entry.kind==='satellite'&&!/^[1-9]\d{0,14}$/.test(raw)` | `A045-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A046 | src/share/viewCodec.js:495 | normalizeStyleParams | TESTED | `!registry\|\|!values\|\|typeofvalues!=='object'` | `A046-` | src/share/backfill.test.mjs |  |
| A047 | src/share/viewCodec.js:495 | normalizeStyleParams | TESTED | `!registry\|\|!values` | `A047-` | src/share/backfill.test.mjs |  |
| A048 | src/share/viewCodec.js:497 | normalizeStyleParams | TESTED | `registry` | `A048-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A049 | src/share/viewCodec.js:498 | normalizeStyleParams | TESTED | `!Object.hasOwn(values,spec.key)\|\|!finite(values[spec.key])` | `A049-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A050 | src/share/viewCodec.js:503 | normalizeStyleParams | TESTED | `Object.keys(out).length?out:null` | `A050-` | [share-codec-058] The style initializer uses distinct source values |  |
| A051 | src/share/viewCodec.js:522 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `STYLE_PRESET_DEFAULTS[style]??{}` | `A051-` | [share-codec-010 share-codec-014] The style retro keeps its defaults |  |
| A052 | src/share/viewCodec.js:524 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.detection?.mode?.toUpperCase?.()??g.detectionMode` | `A052-` | [share-codec-058] The style initializer uses distinct source values |  |
| A053 | src/share/viewCodec.js:525 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.detection?.densityPct??g.detectionDensity` | `A053-` | [share-codec-058] The style initializer uses distinct source values |  |
| A054 | src/share/viewCodec.js:529 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `SHARE_VIEW_STYLE_PARAMS[style]??[]` | `A054-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A055 | src/share/viewCodec.js:529 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `SHARE_VIEW_STYLE_PARAMS[style]??[]` | `A055-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A056 | src/share/viewCodec.js:531 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.styleParams?.[style]?.[spec.key]??STYLES[style]?.uniforms?.[spec.key]?.default` | `A056-` | [share-codec-010 share-codec-014] The style retro keeps its defaults |  |
| A057 | src/share/viewCodec.js:533 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `finite(value)` | `A057-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A058 | src/share/viewCodec.js:538 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.bloom?.enabled??g.bloom.enabled` | `A058-` | [share-codec-058] The style initializer uses distinct source values |  |
| A059 | src/share/viewCodec.js:539 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.bloom?.intensity??g.bloom.intensity` | `A059-` | [share-codec-058] The style initializer uses distinct source values |  |
| A060 | src/share/viewCodec.js:540 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.sharpen?.enabled??g.sharpen.enabled` | `A060-` | [share-codec-058] The style initializer uses distinct source values |  |
| A061 | src/share/viewCodec.js:541 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.sharpen?.intensity??g.sharpen.intensity` | `A061-` | [share-codec-058] The style initializer uses distinct source values |  |
| A062 | src/share/viewCodec.js:542 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.hudVariant??g.hudVariant` | `A062-` | [share-codec-058] The style initializer uses distinct source values |  |
| A063 | src/share/viewCodec.js:543 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.hudVisible??g.hudVisible` | `A063-` | [share-codec-058] The style initializer uses distinct source values |  |
| A064 | src/share/viewCodec.js:544 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `detection.enabled?detection.profile:'OFF'` | `A064-` | [share-codec-058] The style initializer uses distinct source values |  |
| A065 | src/share/viewCodec.js:552 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `style==='normal'?g.celestialRing:false` | `A065-` | [share-codec-058] The style initializer uses distinct source values |  |
| A066 | src/share/viewCodec.js:561 | normalizePanelState | TESTED | `!panelState\|\|!Array.isArray(panelState.specs)` | `A066-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A067 | src/share/viewCodec.js:563 | normalizePanelState | TESTED | `panelState.specs` | `A067-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A068 | src/share/viewCodec.js:564 | normalizePanelState | TESTED | `spec&&PANEL_BY_ID.has(spec.id)&&typeofspec.collapsed==='boolean'` | `A068-` | [share-codec-019] The panel source checks every entry before use |  |
| A069 | src/share/viewCodec.js:564 | normalizePanelState | TESTED | `spec&&PANEL_BY_ID.has(spec.id)` | `A069-` | [share-codec-019] The panel source checks every entry before use |  |
| A070 | src/share/viewCodec.js:568 | normalizePanelState | TESTED | `SHARE_VIEW_PANELS` | `A070-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A071 | src/share/viewCodec.js:570 | normalizePanelState | TESTED | `!spec` | `A071-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A072 | src/share/viewCodec.js:575 | normalizePanelState | TESTED | `panel.pinnable&&typeofspec.pinned==='boolean'?spec.pinned:null` | `A072-` | [share-codec-019] The panel source checks every entry before use |  |
| A073 | src/share/viewCodec.js:575 | normalizePanelState | TESTED | `panel.pinnable&&typeofspec.pinned==='boolean'` | `A073-` | [share-codec-019] The panel source checks every entry before use |  |
| A074 | src/share/viewCodec.js:578 | normalizePanelState | TESTED | `specs.length?{specs}:null` | `A074-` | [share-codec-019] The panel source checks every entry before use |  |
| A075 | src/share/viewCodec.js:583 | normalizeFollowOffset | TESTED | `offset&&typeofoffset==='object'?offset:{}` | `A075-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A076 | src/share/viewCodec.js:583 | normalizeFollowOffset | TESTED | `offset&&typeofoffset==='object'` | `A076-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A077 | src/share/viewCodec.js:592 | normalizeLastKnown | TESTED | `!fix\|\|typeoffix!=='object'` | `A077-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A078 | src/share/viewCodec.js:593 | normalizeLastKnown | TESTED | `!finite(fix.lat)\|\|!finite(fix.lon)` | `A078-` | [share-codec-051] The fix and offset reject invalid source values |  |
| A079 | src/share/viewCodec.js:612 | normalizeView | TESTED | `view?.kind!=='thing'` | `A079-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A080 | src/share/viewCodec.js:614 | normalizeView | TESTED | `entry?normalizeEntityId(entry,view.entity?.id):null` | `A080-` | [share-codec-021] The entity text uses trim and lowercase |  |
| A081 | src/share/viewCodec.js:615 | normalizeView | TESTED | `!id` | `A081-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A082 | src/share/viewCodec.js:635 | liftTrackedEntity | TESTED | `SHARE_VIEW_ENTITY_KINDS` | `A082-` | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |  |
| A083 | src/share/viewCodec.js:636 | liftTrackedEntity | TESTED | `entry.tracking?SHARE_TRACKING_RESTORE_POLICIES[entry.tracking]:null` | `A083-` | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |  |
| A084 | src/share/viewCodec.js:639 | liftTrackedEntity | TESTED | `!policy` | `A084-` | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |  |
| A085 | src/share/viewCodec.js:643 | liftTrackedEntity | TESTED | `id&&lifted.kind==='place'` | `A085-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A086 | src/share/viewCodec.js:657 | normalizeShareViewState | TESTED | `input&&typeofinput==='object'?input:{}` | `A086-` | [share-codec-043] The legacy converter uses own fields and excludes metadata |  |
| A087 | src/share/viewCodec.js:657 | normalizeShareViewState | TESTED | `input&&typeofinput==='object'` | `A087-` | [share-codec-043] The legacy converter uses own fields and excludes metadata |  |
| A088 | src/share/viewCodec.js:658 | normalizeShareViewState | TESTED | `VIEW_STYLES.includes(source.style)?source.style:'normal'` | `A088-` | [share-codec-012] The flag bloom uses its own bit |  |
| A089 | src/share/viewCodec.js:674 | normalizeShareViewState | TESTED | `SHARE_VIEW_FLAGS` | `A089-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A090 | src/share/viewCodec.js:676 | normalizeShareViewState | TESTED | `typeofsource[flag.key]==='boolean'?source[flag.key]:d[flag.key]` | `A090-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A091 | src/share/viewCodec.js:697 | normalizeShareViewState | TESTED | `typeofsource.detectionMode==='string'&&source.detectionMode?source.detectionMode:d.detectionMode` | `A091-` | [share-codec-048] The invalid detection mode uses the default for  |  |
| A092 | src/share/viewCodec.js:697 | normalizeShareViewState | TESTED | `typeofsource.detectionMode==='string'&&source.detectionMode` | `A092-` | [share-codec-048] The invalid detection mode uses the default for 17 |  |
| A093 | src/share/viewCodec.js:700 | normalizeShareViewState | TESTED | `finite(source.detectionDensity)?Number(source.detectionDensity):d.detectionDensity` | `A093-` | [share-codec-048] The disabled detection mode keeps a valid density and defaults an invalid density |  |
| A094 | src/share/viewCodec.js:705 | normalizeShareViewState | TESTED | `detection.enabled?detection.profile:'OFF'` | `A094-` | [share-codec-048] The disabled detection mode keeps a valid density and defaults an invalid density |  |
| A095 | src/share/viewCodec.js:723 | normalizeShareViewState | TESTED | `finite(source.scopeFeatherPct)?clampScopeFeatherPct(Number(source.scopeFeatherPct)):d.scopeFeatherPct` | `A095-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A096 | src/share/viewCodec.js:733 | normalizeShareViewState | TESTED | `source.layerState?normalizeLayerState(source.layerState):null` | `A096-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A097 | src/share/viewCodec.js:739 | normalizeShareViewState | TESTED | `state.layerState` | `A097-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A098 | src/share/viewCodec.js:740 | normalizeShareViewState | TESTED | `view.kind==='thing'` | `A098-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A099 | src/share/viewCodec.js:742 | normalizeShareViewState | TESTED | `view.lastKnown?.observedAtMs===null&&state.sharedAtMs!==null` | `A099-` | [share-codec-023] The fix time uses relative age |  |
| A100 | src/share/viewCodec.js:746 | normalizeShareViewState | TESTED | `view.lastKnown` | `A100-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A101 | src/share/viewCodec.js:749 | normalizeShareViewState | TESTED | `state.layerState&&!state.layerState.enabledLayerIds.includes(layerId)` | `A101-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A102 | src/share/viewCodec.js:769 | layerTokenNumber | TESTED | `token.length===1` | `A102-` | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |  |
| A103 | src/share/viewCodec.js:775 | layerTokenFromNumber | TESTED | `number<base` | `A103-` | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |  |
| A104 | src/share/viewCodec.js:777 | layerTokenFromNumber | TESTED | `rest>=base*base` | `A104-` | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |  |
| A105 | src/share/viewCodec.js:792 | writeEntityId | TESTED | `entry.idForm==='hex24'&&/^[0-9a-f]{6}$/.test(id)` | `A105-` | [share-codec-021] The decimal entity satellite keeps six decimal digits |  |
| A106 | src/share/viewCodec.js:794 | writeEntityId | TESTED | `entry.idForm==='decimal'&&/^[1-9]\d{0,14}$/.test(id)` | `A106-` | [share-codec-021] The aircraft entity aircraft keeps decimal text outside six digits |  |
| A107 | src/share/viewCodec.js:805 | writeEnum | TESTED | `code>=0` | `A107-` | [share-codec-057] The decoder uses Normal after a custom style getter changes |  |
| A108 | src/share/viewCodec.js:811 | encodeLayers | TESTED | `layerState.enabledLayerIds` | `A108-` | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |  |
| A109 | src/share/viewCodec.js:812 | encodeLayers | TESTED | `id===impliedLayerId` | `A109-` | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |  |
| A110 | src/share/viewCodec.js:815 | encodeLayers | EQUIVALENT | `bitset.length<=byte` | `A110-` | See the equivalent proof. |  |
| A111 | src/share/viewCodec.js:820 | encodeLayers | TESTED | `Object.entries(layerState.options)` | `A111-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A112 | src/share/viewCodec.js:822 | encodeLayers | TESTED | `optionSpecs(ownerId)` | `A112-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A113 | src/share/viewCodec.js:824 | encodeLayers | TESTED | `current===null\|\|current===layerOptionAbsentValue(ownerId,spec)` | `A113-` | [share-codec-018] The option cctv autoHop uses one wire entry |  |
| A114 | src/share/viewCodec.js:829 | encodeLayers | EQUIVALENT | `CANONICAL_INTEGER.test(value)&&Math.abs(Number(value))<=MAX_ZIGZAG_MAGNITUDE` | `A114-` | See the equivalent proof. |  |
| A115 | src/share/viewCodec.js:831 | encodeLayers | TESTED | `isInteger?0:1` | `A115-` | [share-codec-018] The option cctv coverageMode keeps its own value |  |
| A116 | src/share/viewCodec.js:832 | encodeLayers | TESTED | `isInteger` | `A116-` | [share-codec-018] The option cctv coverageMode keeps its own value |  |
| A117 | src/share/viewCodec.js:840 | encodeLayers | TESTED | `blob.bytes.length` | `A117-` | [share-codec-018] every layer option has a frozen absent meaning |  |
| A118 | src/share/viewCodec.js:844 | triState | TESTED | `value===null?0:value?2:1` | `A118-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A119 | src/share/viewCodec.js:844 | triState | TESTED | `value?2:1` | `A119-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A120 | src/share/viewCodec.js:849 | encodePanels | TESTED | `SHARE_VIEW_PANELS` | `A120-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A121 | src/share/viewCodec.js:851 | encodePanels | TESTED | `panel.pinnable?false:null` | `A121-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A122 | src/share/viewCodec.js:853 | encodePanels | TESTED | `spec&&spec.collapsed===panel.collapsed&&spec.pinned===defaultPinned` | `A122-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A123 | src/share/viewCodec.js:853 | encodePanels | TESTED | `spec&&spec.collapsed===panel.collapsed` | `A123-` | [share-codec-019] panels: only differences from the frozen layout are written |  |
| A124 | src/share/viewCodec.js:858 | encodePanels | TESTED | `spec?triState(spec.collapsed):0` | `A124-` | [share-codec-019] panels: only differences from the frozen layout are written |  |
| A125 | src/share/viewCodec.js:859 | encodePanels | TESTED | `spec?triState(spec.pinned):0` | `A125-` | [share-codec-019] panels: only differences from the frozen layout are written |  |
| A126 | src/share/viewCodec.js:866 | encodeStyleParams | TESTED | `SHARE_VIEW_STYLE_DEFAULTS[style].styleParams??{}` | `A126-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A127 | src/share/viewCodec.js:868 | encodeStyleParams | TESTED | `SHARE_VIEW_STYLE_PARAMS[style]` | `A127-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A128 | src/share/viewCodec.js:870 | encodeStyleParams | TESTED | `!Object.hasOwn(values,spec.key)` | `A128-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A129 | src/share/viewCodec.js:871 | encodeStyleParams | TESTED | `values[spec.key]===defaults[spec.key]` | `A129-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A130 | src/share/viewCodec.js:876 | encodeStyleParams | TESTED | `blob.bytes.length` | `A130-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A131 | src/share/viewCodec.js:882 | signedAngle | TESTED | `degrees>180?degrees-360:degrees` | `A131-` | [share-codec-013] The angle heading at 10 uses the nearest signed turn |  |
| A132 | src/share/viewCodec.js:892 | encodeThing | TESTED | `range!==d.range` | `A132-` | [share-codec-021] The entity aircraft uses its own numeric field |  |
| A133 | src/share/viewCodec.js:893 | encodeThing | TESTED | `heading!==d.heading` | `A133-` | [share-codec-021] The entity aircraft uses its own numeric field |  |
| A134 | src/share/viewCodec.js:894 | encodeThing | TESTED | `pitch!==d.pitch` | `A134-` | [share-codec-021] The entity aircraft uses its own numeric field |  |
| A135 | src/share/viewCodec.js:896 | encodeThing | TESTED | `fix` | `A135-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A136 | src/share/viewCodec.js:900 | encodeThing | TESTED | `fix.alt` | `A136-` | [share-codec-051] The complete fix supplies every coordinate and altitude |  |
| A137 | src/share/viewCodec.js:903 | encodeThing | TESTED | `observed!==null&&state.sharedAtMs!==null` | `A137-` | [share-codec-023] The fix time uses absolute time |  |
| A138 | src/share/viewCodec.js:904 | encodeThing | TESTED | `observed!==state.sharedAtMs` | `A138-` | [share-codec-023] The fix time uses current fix |  |
| A139 | src/share/viewCodec.js:906 | encodeThing | TESTED | `observed!==null` | `A139-` | [share-codec-023] The fix time uses absent time |  |
| A140 | src/share/viewCodec.js:927 | encodeShareView | TESTED | `state.view.kind==='thing'?state.view:null` | `A140-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A141 | src/share/viewCodec.js:930 | encodeShareView | TESTED | `thing?ENTITY_BY_KIND.get(thing.entity.kind).layerId:null` | `A141-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A142 | src/share/viewCodec.js:935 | encodeShareView | TESTED | `SHARE_VIEW_FIELDS` | `A142-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A143 | src/share/viewCodec.js:936 | encodeShareView | TESTED | `cameraDerived&&CAMERA_KEYS.has(field.key)` | `A143-` | [share-codec-012] The scalar alt uses its own field |  |
| A144 | src/share/viewCodec.js:937 | encodeShareView | TESTED | `field.key` | `A144-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A145 | src/share/viewCodec.js:940 | encodeShareView | TESTED | `state.view.kind!==(thing?'thing':'place')` | `A145-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A146 | src/share/viewCodec.js:940 | encodeShareView | TESTED | `thing?'thing':'place'` | `A146-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A147 | src/share/viewCodec.js:945 | encodeShareView | TESTED | `state[field.key]!==field.default` | `A147-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A148 | src/share/viewCodec.js:950 | encodeShareView | TESTED | `state[field.key]!==field.default` | `A148-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A149 | src/share/viewCodec.js:954 | encodeShareView | TESTED | `state.sharedAtMs!==null` | `A149-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A150 | src/share/viewCodec.js:959 | encodeShareView | TESTED | `SHARE_VIEW_FLAGS` | `A150-` | [share-codec-012] The flag bloom uses its own bit |  |
| A151 | src/share/viewCodec.js:960 | encodeShareView | TESTED | `state[flag.key]!==defaultOf(flag,state.style)` | `A151-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A152 | src/share/viewCodec.js:962 | encodeShareView | TESTED | `bits` | `A152-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A153 | src/share/viewCodec.js:966 | encodeShareView | TESTED | `state.layerState` | `A153-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A154 | src/share/viewCodec.js:972 | encodeShareView | TESTED | `state.panelState` | `A154-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A155 | src/share/viewCodec.js:975 | encodeShareView | TESTED | `thing` | `A155-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A156 | src/share/viewCodec.js:978 | encodeShareView | TESTED | `state.styleParams` | `A156-` | [share-codec-010 share-codec-014] The style normal keeps its defaults |  |
| A157 | src/share/viewCodec.js:982 | encodeShareView | TESTED | `state[field.key]===defaultOf(field,state.style)` | `A157-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A158 | src/share/viewCodec.js:983 | encodeShareView | TESTED | `field.type==='enum'` | `A158-` | [share-codec-012] The scalar alt uses its own field |  |
| A159 | src/share/viewCodec.js:984 | encodeShareView | TESTED | `field.type==='sint'` | `A159-` | [share-codec-012] The scalar bloomIntensity uses its own field |  |
| A160 | src/share/viewCodec.js:1016 | readMessage | TESTED | `!reader.done` | `A160-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A161 | src/share/viewCodec.js:1019 | readMessage | TESTED | `!allowed` | `A161-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A162 | src/share/viewCodec.js:1024 | readMessage | TESTED | `!allowed.includes(wireType)` | `A162-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A163 | src/share/viewCodec.js:1026 | readMessage | TESTED | `values.has(field)` | `A163-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A164 | src/share/viewCodec.js:1030 | readMessage | TESTED | `wireType===WIRE_LEN?{len:reader.lengthDelimited()}:{varint:reader.varint()}` | `A164-` | [share-codec-012] The flag bloom uses its own bit |  |
| A165 | src/share/viewCodec.js:1063 | readEnum | TESTED | `!entry` | `A165-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A166 | src/share/viewCodec.js:1064 | readEnum | TESTED | `entry.len` | `A166-` | [share-codec-012] The scalar detectionAllocation uses its own field |  |
| A167 | src/share/viewCodec.js:1069 | readEnum | TESTED | `CLOSED_ENUMS.has(field.key)&&!SHARE_VIEW_ENUMS[field.enum].includes(text)` | `A167-` | [share-codec-032 share-codec-056] The open name hudVariant checks future_name-2 |  |
| A168 | src/share/viewCodec.js:1078 | readEnum | TESTED | `name===undefined` | `A168-` | [share-codec-012] The scalar detectionAllocation uses its own field |  |
| A169 | src/share/viewCodec.js:1085 | decodeLayers | TESTED | `byte<bits.length` | `A169-` | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |  |
| A170 | src/share/viewCodec.js:1086 | decodeLayers | TESTED | `bit<8` | `A170-` | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |  |
| A171 | src/share/viewCodec.js:1087 | decodeLayers | TESTED | `!(bits[byte]&(1<<bit))` | `A171-` | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |  |
| A172 | src/share/viewCodec.js:1090 | decodeLayers | TESTED | `entry` | `A172-` | [share-codec-029] The layer bits keep known layers beside unknown layers |  |
| A173 | src/share/viewCodec.js:1097 | decodeLayers | TESTED | `reader&&!reader.done` | `A173-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A174 | src/share/viewCodec.js:1097 | decodeLayers | TESTED | `reader&&!reader.done` | `A174-` | [share-codec-018] The absent options match every frozen value |  |
| A175 | src/share/viewCodec.js:1101 | decodeLayers | TESTED | `key%2===0` | `A175-` | [share-codec-018] The option cctv coverageMode keeps its own value |  |
| A176 | src/share/viewCodec.js:1104 | decodeLayers | TESTED | `length>MAX_OPTION_VALUE_CHARS\|\|length>reader.end-reader.pos` | `A176-` | [share-codec-050] The option length checks the cap before its remaining bytes |  |
| A177 | src/share/viewCodec.js:1110 | decodeLayers | TESTED | `seen.has(slot)` | `A177-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A178 | src/share/viewCodec.js:1116 | decodeLayers | TESTED | `layerEntry?.optionOwner===layerEntry?.id?layerEntry?.optionOwner:null` | `A178-` | [share-codec-050] The mirror layer rejects a valid owner option |  |
| A179 | src/share/viewCodec.js:1120 | decodeLayers | TESTED | `ownerId?optionSpecs(ownerId).find((candidate)=>candidate.token===optionToken,):null` | `A179-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A180 | src/share/viewCodec.js:1125 | decodeLayers | TESTED | `spec?spec.decode(value):null` | `A180-` | [share-codec-050] The layer option handles unknown key |  |
| A181 | src/share/viewCodec.js:1126 | decodeLayers | TESTED | `decoded===null\|\|decoded===undefined` | `A181-` | [share-codec-050] The layer option handles invalid value |  |
| A182 | src/share/viewCodec.js:1135 | decodeLayers | DEFAULT-VALUE | `Object.keys(SHARE_VIEW_LAYER_OPTION_ABSENT)` | `A182-` | [share-codec-018] The absent options match every frozen value | [share-codec-018] The option decoder keeps all values within each owner |
| A183 | src/share/viewCodec.js:1137 | decodeLayers | DEFAULT-VALUE | `optionSpecs(ownerId)` | `A183-` | [share-codec-018] The absent options match every frozen value | [share-codec-018] The option decoder keeps all values within each owner |
| A184 | src/share/viewCodec.js:1138 | decodeLayers | TESTED | `!Object.hasOwn(options[ownerId],spec.key)` | `A184-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A185 | src/share/viewCodec.js:1147 | decodePanels | TESTED | `!reader.done` | `A185-` | [share-codec-019] The absent panel pin differs from a false pin |  |
| A186 | src/share/viewCodec.js:1150 | decodePanels | TESTED | `entries.has(number)` | `A186-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A187 | src/share/viewCodec.js:1157 | decodePanels | TESTED | `entries` | `A187-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A188 | src/share/viewCodec.js:1159 | decodePanels | TESTED | `!PANEL_BY_NUMBER.has(number)\|\|entry.collapsed===3\|\|entry.pinned===3` | `A188-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A189 | src/share/viewCodec.js:1159 | decodePanels | TESTED | `!PANEL_BY_NUMBER.has(number)\|\|entry.collapsed===3` | `A189-` | [share-codec-049] The future panel reports its number |  |
| A190 | src/share/viewCodec.js:1166 | decodePanels | TESTED | `SHARE_VIEW_PANELS` | `A190-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A191 | src/share/viewCodec.js:1168 | decodePanels | TESTED | `entry` | `A191-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A192 | src/share/viewCodec.js:1170 | decodePanels | TESTED | `entry.collapsed===0\|\|entry.collapsed===3\|\|entry.pinned===3` | `A192-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A193 | src/share/viewCodec.js:1170 | decodePanels | TESTED | `entry.collapsed===0\|\|entry.collapsed===3` | `A193-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A194 | src/share/viewCodec.js:1176 | decodePanels | TESTED | `panel.pinnable&&entry.pinned!==0?entry.pinned===2:null` | `A194-` | [share-codec-019] The absent panel pin differs from a false pin |  |
| A195 | src/share/viewCodec.js:1176 | decodePanels | TESTED | `panel.pinnable&&entry.pinned!==0` | `A195-` | [share-codec-019] The absent panel pin differs from a false pin |  |
| A196 | src/share/viewCodec.js:1182 | decodePanels | TESTED | `panel.pinnable?false:null` | `A196-` | [share-codec-019] The panel cctv-panel uses its own entry |  |
| A197 | src/share/viewCodec.js:1190 | decodeStyleParams | TESTED | `SHARE_VIEW_STYLE_PARAMS[style]\|\|[]` | `A197-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A198 | src/share/viewCodec.js:1193 | decodeStyleParams | TESTED | `!reader.done` | `A198-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A199 | src/share/viewCodec.js:1197 | decodeStyleParams | TESTED | `seen.has(index)` | `A199-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A200 | src/share/viewCodec.js:1201 | decodeStyleParams | TESTED | `!spec` | `A200-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A201 | src/share/viewCodec.js:1202 | decodeStyleParams | TESTED | `token??'?'` | `A201-` | [share-codec-049] The unknown style token 35 reports its value |  |
| A202 | src/share/viewCodec.js:1211 | decodeEntityId | TESTED | `!entry` | `A202-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A203 | src/share/viewCodec.js:1212 | decodeEntityId | TESTED | `value.len` | `A203-` | [share-codec-021] The entity aircraft uses its own numeric field |  |
| A204 | src/share/viewCodec.js:1213 | decodeEntityId | TESTED | `entry.idForm==='hex24'` | `A204-` | [share-codec-021] The entity satellite uses its own numeric field |  |
| A205 | src/share/viewCodec.js:1214 | decodeEntityId | TESTED | `value.varint<=0xffffff?value.varint.toString(16).padStart(6,'0'):null` | `A205-` | [share-codec-031] an unknown or invalid entity falls back to the camera its fix implies |  |
| A206 | src/share/viewCodec.js:1225 | decodeThing | TESTED | `fields.get(n)?.varint??0` | `A206-` | [share-codec-034] The decoder rejects the thing latitude |  |
| A207 | src/share/viewCodec.js:1227 | decodeThing | TESTED | `fields.get(F.range)?.varint??d.range` | `A207-` | [share-codec-020] The follow offset range uses its own field |  |
| A208 | src/share/viewCodec.js:1228 | decodeThing | TESTED | `fields.has(F.heading)?signed(F.heading):d.heading` | `A208-` | [share-codec-020] The follow offset heading uses its own field |  |
| A209 | src/share/viewCodec.js:1229 | decodeThing | TESTED | `fields.has(F.pitch)?signed(F.pitch):d.pitch` | `A209-` | [share-codec-020] The follow offset heading uses its own field |  |
| A210 | src/share/viewCodec.js:1232 | decodeThing | TESTED | `fields.has(F.lat)\|\|fields.has(F.lon)` | `A210-` | [share-codec-034] The decoder rejects the thing latitude |  |
| A211 | src/share/viewCodec.js:1234 | decodeThing | TESTED | `fields.has(F.observedAt)` | `A211-` | [share-codec-023] The fix time uses absent time |  |
| A212 | src/share/viewCodec.js:1236 | decodeThing | TESTED | `createdAtS!==null` | `A212-` | [share-codec-023] The fix ignores an age without a share time |  |
| A213 | src/share/viewCodec.js:1244 | decodeThing | TESTED | `Math.abs(lastKnown.lat)>90\|\|Math.abs(lastKnown.lon)>180` | `A213-` | [share-codec-034] The decoder rejects the thing latitude |  |
| A214 | src/share/viewCodec.js:1248 | decodeThing | TESTED | `lastKnown?followCameraFor(lastKnown,normalizeFollowOffset(offset)):null` | `A214-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A215 | src/share/viewCodec.js:1252 | decodeThing | TESTED | `present.length>1` | `A215-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A216 | src/share/viewCodec.js:1255 | decodeThing | TESTED | `!entry` | `A216-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A217 | src/share/viewCodec.js:1260 | decodeThing | TESTED | `newerKind?'unknown-entity-kind':'missing-entity-kind'` | `A217-` | [share-codec-030] The view kind uses the empty entity path |  |
| A218 | src/share/viewCodec.js:1264 | decodeThing | TESTED | `!id` | `A218-` | [share-codec-021] The entity aircraft keeps text ~ab1234 |  |
| A219 | src/share/viewCodec.js:1281 | decodeShareView | TESTED | `typeofcode!=='string'` | `A219-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A220 | src/share/viewCodec.js:1282 | decodeShareView | TESTED | `code.length>MAX_SHARE_VIEW_CHARS` | `A220-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A221 | src/share/viewCodec.js:1285 | decodeShareView | TESTED | `sealed.length<2` | `A221-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A222 | src/share/viewCodec.js:1287 | decodeShareView | TESTED | `crc8(bytes)!==sealed[sealed.length-1]` | `A222-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A223 | src/share/viewCodec.js:1289 | decodeShareView | TESTED | `bytes[0]!==SHARE_VIEW_FORMAT_VERSION` | `A223-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A224 | src/share/viewCodec.js:1301 | decodeShareView | TESTED | `SHARE_VIEW_FIELDS` | `A224-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A225 | src/share/viewCodec.js:1304 | decodeShareView | TESTED | `!entry\|\|field.type==='bytes'\|\|field.type==='flags'\|\|field.key==='view'` | `A225-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A226 | src/share/viewCodec.js:1304 | decodeShareView | TESTED | `!entry\|\|field.type==='bytes'\|\|field.type==='flags'` | `A226-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A227 | src/share/viewCodec.js:1304 | decodeShareView | TESTED | `!entry\|\|field.type==='bytes'` | `A227-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A228 | src/share/viewCodec.js:1310 | decodeShareView | TESTED | `field.type==='enum'` | `A228-` | [share-codec-012] The scalar alt uses its own field |  |
| A229 | src/share/viewCodec.js:1312 | decodeShareView | TESTED | `field.type==='coord'` | `A229-` | [share-codec-012] The scalar alt uses its own field |  |
| A230 | src/share/viewCodec.js:1314 | decodeShareView | TESTED | `field.type==='sint'\|\|field.type==='angle'` | `A230-` | [share-codec-012] The scalar alt uses its own field |  |
| A231 | src/share/viewCodec.js:1316 | decodeShareView | TESTED | `field.type==='uint'` | `A231-` | [share-codec-012] The scalar bloomIntensity uses its own field |  |
| A232 | src/share/viewCodec.js:1318 | decodeShareView | TESTED | `['lat','lon']` | `A232-` | [share-codec-034] The decoder rejects the camera longitude |  |
| A233 | src/share/viewCodec.js:1320 | decodeShareView | TESTED | `Math.abs(raw[key])>(key==='lat'?90:180)` | `A233-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A234 | src/share/viewCodec.js:1320 | decodeShareView | TESTED | `key==='lat'?90:180` | `A234-` | [share-codec-048] The numeric bound for lon accepts -190 |  |
| A235 | src/share/viewCodec.js:1324 | decodeShareView | TESTED | `raw.style!==undefined&&!VIEW_STYLES.includes(raw.style)` | `A235-` | [share-codec-010 share-codec-014] The style normal keeps its defaults |  |
| A236 | src/share/viewCodec.js:1325 | decodeShareView | TESTED | `get('style').len` | `A236-` | [share-codec-057] The decoder uses Normal after a custom style getter changes |  |
| A237 | src/share/viewCodec.js:1328 | decodeShareView | TESTED | `['hudVariant','mapStack']` | `A237-` | [share-codec-032 share-codec-056] The open name hudVariant checks bad name |  |
| A238 | src/share/viewCodec.js:1329 | decodeShareView | TESTED | `raw[key]!==undefined&&!NAME_GRAMMAR.test(raw[key])` | `A238-` | [share-codec-012] The scalar hudVariant uses its own field |  |
| A239 | src/share/viewCodec.js:1333 | decodeShareView | TESTED | `get('flags')?.varint??0` | `A239-` | [share-codec-012] The flag bloom uses its own bit |  |
| A240 | src/share/viewCodec.js:1334 | decodeShareView | TESTED | `SHARE_VIEW_FLAGS` | `A240-` | [share-codec-012] The flag bloom uses its own bit |  |
| A241 | src/share/viewCodec.js:1337 | decodeShareView | TESTED | `raw.style??'normal'` | `A241-` | [share-codec-058] The style initializer uses distinct source values |  |
| A242 | src/share/viewCodec.js:1339 | decodeShareView | TESTED | `flags>knownBits` | `A242-` | [share-codec-012] The scalar alt uses its own field |  |
| A243 | src/share/viewCodec.js:1343 | decodeShareView | TESTED | `get('sharedAtMs')` | `A243-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A244 | src/share/viewCodec.js:1347 | decodeShareView | TESTED | `createdAtS>=1&&Number.isSafeInteger(ms)&&ms<=nowMs?ms:null` | `A244-` | [share-codec-054] The decoder reports an internal exception |  |
| A245 | src/share/viewCodec.js:1347 | decodeShareView | TESTED | `createdAtS>=1&&Number.isSafeInteger(ms)&&ms<=nowMs` | `A245-` | [share-codec-052] The positive epoch guard does not read the clock |  |
| A246 | src/share/viewCodec.js:1347 | decodeShareView | TESTED | `createdAtS>=1&&Number.isSafeInteger(ms)` | `A246-` | [share-codec-052] The positive epoch guard does not read the clock |  |
| A247 | src/share/viewCodec.js:1350 | decodeShareView | TESTED | `get('layerState')` | `A247-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A248 | src/share/viewCodec.js:1353 | decodeShareView | TESTED | `get('layerOptions')?.len??null` | `A248-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A249 | src/share/viewCodec.js:1356 | decodeShareView | TESTED | `get('layerOptions')` | `A249-` | [share-codec-012] The scalar alt uses its own field |  |
| A250 | src/share/viewCodec.js:1358 | decodeShareView | TESTED | `get('panelState')` | `A250-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A251 | src/share/viewCodec.js:1360 | decodeShareView | TESTED | `get('styleParams')` | `A251-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A252 | src/share/viewCodec.js:1363 | decodeShareView | TESTED | `raw.style??'normal'` | `A252-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A253 | src/share/viewCodec.js:1368 | decodeShareView | TESTED | `get('thing')?decodeThing(get('thing').len,createdAtS,unknown):null` | `A253-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A254 | src/share/viewCodec.js:1372 | decodeShareView | TESTED | `thing?.camera` | `A254-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A255 | src/share/viewCodec.js:1374 | decodeShareView | TESTED | `viewEntry?viewEntry.len?asciiText(viewEntry.len.rest()):(SHARE_VIEW_ENUMS.viewKind[viewEntry.varint]??viewEntry.varint):thing?'thing':'place'` | `A255-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A256 | src/share/viewCodec.js:1375 | decodeShareView | TESTED | `viewEntry.len?asciiText(viewEntry.len.rest()):(SHARE_VIEW_ENUMS.viewKind[viewEntry.varint]??viewEntry.varint)` | `A256-` | [share-codec-030] The view kind uses the number place path |  |
| A257 | src/share/viewCodec.js:1377 | decodeShareView | TESTED | `SHARE_VIEW_ENUMS.viewKind[viewEntry.varint]??viewEntry.varint` | `A257-` | [share-codec-030] The view kind uses the number place path |  |
| A258 | src/share/viewCodec.js:1378 | decodeShareView | TESTED | `thing?'thing':'place'` | `A258-` | [share-codec-011] The default result excludes optional report properties |  |
| A259 | src/share/viewCodec.js:1381 | decodeShareView | TESTED | `viewKind==='thing'` | `A259-` | [share-codec-030] The view kind uses the number place path |  |
| A260 | src/share/viewCodec.js:1382 | decodeShareView | TESTED | `thing?.view` | `A260-` | [share-codec-030] The view kind uses the empty entity path |  |
| A261 | src/share/viewCodec.js:1383 | decodeShareView | TESTED | `thing?.fallback??'missing-thing'` | `A261-` | [share-codec-030] The view kind uses the empty entity path |  |
| A262 | src/share/viewCodec.js:1384 | decodeShareView | TESTED | `viewKind!=='place'` | `A262-` | [share-codec-012] The scalar alt uses its own field |  |
| A263 | src/share/viewCodec.js:1391 | decodeShareView | TESTED | `unknown.entries.length` | `A263-` | [share-codec-012] The scalar alt uses its own field |  |
| A264 | src/share/viewCodec.js:1392 | decodeShareView | TESTED | `fallback` | `A264-` | [share-codec-011] The default result excludes optional report properties |  |
| A265 | src/share/viewCodec.js:1395 | decodeShareView | TESTED | `errorinstanceofShareWireError` | `A265-` | [share-codec-054] The decoder reports an internal exception |  |
| A266 | src/share/wire.js:23 | ShareWireError.constructor | TESTED | `detail?\`${reason}:${detail}\`:reason` | `A266-` | [share-codec-053] The ASCII helpers check both bounds |  |
| A267 | src/share/wire.js:38 | encodeBase64Url | TESTED | `i<bytes.length` | `A267-` | [share-codec-001] The encoder does not read byte 1 beyond the length |  |
| A268 | src/share/wire.js:40 | encodeBase64Url | TESTED | `i+1<bytes.length?bytes[i+1]:0` | `A268-` | [share-codec-001] The encoder does not read byte 1 beyond the length |  |
| A269 | src/share/wire.js:41 | encodeBase64Url | TESTED | `i+2<bytes.length?bytes[i+2]:0` | `A269-` | [share-codec-001] The encoder does not read byte 2 beyond the length |  |
| A270 | src/share/wire.js:44 | encodeBase64Url | TESTED | `i+1<bytes.length` | `A270-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A271 | src/share/wire.js:45 | encodeBase64Url | TESTED | `i+2<bytes.length` | `A271-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A272 | src/share/wire.js:56 | decodeBase64Url | TESTED | `typeoftext!=='string'\|\|text.length===0` | `A272-` | [share-codec-005] The writer checks each numeric bound |  |
| A273 | src/share/wire.js:58 | decodeBase64Url | TESTED | `text.length%4===1` | `A273-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A274 | src/share/wire.js:63 | decodeBase64Url | TESTED | `text` | `A274-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A275 | src/share/wire.js:65 | decodeBase64Url | TESTED | `value===undefined` | `A275-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A276 | src/share/wire.js:68 | decodeBase64Url | TESTED | `bits>=8` | `A276-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A277 | src/share/wire.js:73 | decodeBase64Url | TESTED | `bits>0&&(buffer&((1<<bits)-1))!==0` | `A277-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A278 | src/share/wire.js:85 | crc8 | TESTED | `bytes` | `A278-` | [share-codec-012] The flag bloom uses its own bit |  |
| A279 | src/share/wire.js:87 | crc8 | TESTED | `bit<8` | `A279-` | [share-codec-011] The default result excludes optional report properties |  |
| A280 | src/share/wire.js:88 | crc8 | TESTED | `crc&0x80?((crc<<1)^0x07)&0xff:(crc<<1)&0xff` | `A280-` | [share-codec-012] The flag bloom uses its own bit |  |
| A281 | src/share/wire.js:95 | zigzag | TESTED | `value>=0?value*2:-value*2-1` | `A281-` | [share-codec-005] The writer checks each numeric bound |  |
| A282 | src/share/wire.js:100 | unzigzag | TESTED | `value%2===0?value/2:-(value+1)/2` | `A282-` | [share-codec-012] The scalar heading uses its own field |  |
| A283 | src/share/wire.js:113 | WireWriter.varint | TESTED | `!Number.isSafeInteger(value)\|\|value<0` | `A283-` | [share-codec-005] The writer checks each numeric bound |  |
| A284 | src/share/wire.js:116 | WireWriter.varint | TESTED | `rest>=0x80` | `A284-` | [share-codec-005] The writer checks each numeric bound |  |
| A285 | src/share/wire.js:125 | WireWriter.tag | TESTED | `!Number.isInteger(field)\|\|field<1\|\|field>MAX_FIELD_NUMBER` | `A285-` | [share-codec-005] The writer checks each numeric bound |  |
| A286 | src/share/wire.js:125 | WireWriter.tag | TESTED | `!Number.isInteger(field)\|\|field<1` | `A286-` | [share-codec-005] The writer checks each numeric bound |  |
| A287 | src/share/wire.js:135 | WireWriter.sintField | TESTED | `!Number.isSafeInteger(value)\|\|Math.abs(value)>MAX_ZIGZAG_MAGNITUDE` | `A287-` | [share-codec-005] The writer checks each numeric bound |  |
| A288 | src/share/wire.js:142 | WireWriter.bytesField | TESTED | `bytes` | `A288-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A289 | src/share/wire.js:159 | asciiBytes | TESTED | `i<text.length` | `A289-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A290 | src/share/wire.js:161 | asciiBytes | TESTED | `code<0x20\|\|code>0x7e` | `A290-` | [share-codec-053] The ASCII helpers check both bounds |  |
| A291 | src/share/wire.js:171 | asciiText | TESTED | `bytes` | `A291-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A292 | src/share/wire.js:172 | asciiText | TESTED | `byte<0x20\|\|byte>0x7e` | `A292-` | [share-codec-050] The layer option handles bad ASCII text |  |
| A293 | src/share/wire.js:194 | WireReader.varint | TESTED | `count<MAX_VARINT_BYTES` | `A293-` | [share-codec-005] The writer checks each numeric bound |  |
| A294 | src/share/wire.js:195 | WireReader.varint | TESTED | `this.pos>=this.end` | `A294-` | [share-codec-005] The writer checks each numeric bound |  |
| A295 | src/share/wire.js:198 | WireReader.varint | TESTED | `(byte&0x80)===0` | `A295-` | [share-codec-005] The writer checks each numeric bound |  |
| A296 | src/share/wire.js:200 | WireReader.varint | TESTED | `count>0&&byte===0` | `A296-` | [share-codec-018] The absent options match every frozen value |  |
| A297 | src/share/wire.js:202 | WireReader.varint | TESTED | `!Number.isSafeInteger(value)` | `A297-` | [share-codec-005] The writer checks each numeric bound |  |
| A298 | src/share/wire.js:220 | WireReader.tag | TESTED | `field<1\|\|field>MAX_FIELD_NUMBER` | `A298-` | [share-codec-034] The invalid payload reports field |  |
| A299 | src/share/wire.js:223 | WireReader.tag | TESTED | `wireType!==WIRE_VARINT&&wireType!==WIRE_FIXED64&&wireType!==WIRE_LEN&&wireType!==WIRE_FIXED32` | `A299-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A300 | src/share/wire.js:223 | WireReader.tag | TESTED | `wireType!==WIRE_VARINT&&wireType!==WIRE_FIXED64&&wireType!==WIRE_LEN` | `A300-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A301 | src/share/wire.js:223 | WireReader.tag | TESTED | `wireType!==WIRE_VARINT&&wireType!==WIRE_FIXED64` | `A301-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A302 | src/share/wire.js:235 | WireReader.lengthDelimited | TESTED | `length>this.end-this.pos` | `A302-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A303 | src/share/wire.js:251 | WireReader.skip | TESTED | `wireType===WIRE_VARINT` | `A303-` | [share-codec-008] skip steps over each wire type and stops at a truncated value |  |
| A304 | src/share/wire.js:252 | WireReader.skip | TESTED | `wireType===WIRE_LEN` | `A304-` | [share-codec-008] skip steps over each wire type and stops at a truncated value |  |
| A305 | src/share/wire.js:254 | WireReader.skip | TESTED | `wireType===WIRE_FIXED64?8:4` | `A305-` | [share-codec-008] skip steps over each wire type and stops at a truncated value |  |
| A306 | src/share/wire.js:255 | WireReader.skip | TESTED | `size>this.end-this.pos` | `A306-` | [share-codec-008] skip steps over each wire type and stops at a truncated value |  |
| A307 | src/share/follow.js:115 | dot | TESTED | `a[0]*b[0]+a[1]*b[1]+a[2]*b[2]` | `A307-` | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |  |
| A308 | src/share/follow.js:130 | followCameraFor | TESTED | `at[i]+local.east*basis.east[i]+local.north*basis.north[i]+local.up*basis.up[i]` | `A308-` | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |  |
| A309 | src/share/follow.js:140 | followCameraFor | TESTED | `at[i]-camera[i]` | `A309-` | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |  |
| A310 | src/share/legacyShareState.js:82 | toLegacyShareState | TESTED | `e.kind===state.view.entity.kind` | `A310-` | [share-codec-022 share-codec-039] The tracking slot for military_aircraft moves both ways |  |
| A311 | src/share/legacyShareState.js:91 | toLegacyShareState | TESTED | `entry?.tracking` | `A311-` | [share-codec-043] The legacy converter copies composite state fields |  |
| A312 | src/share/viewCodec.js:524 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.detection?.mode?.toUpperCase?.()` | `A312-` | [share-codec-058] The style initializer uses distinct source values |  |
| A313 | src/share/viewCodec.js:524 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.detection?.mode?.toUpperCase` | `A313-` | [share-codec-058] The style initializer uses distinct source values |  |
| A314 | src/share/viewCodec.js:524 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.detection?.mode` | `A314-` | src/share/backfill.test.mjs |  |
| A315 | src/share/viewCodec.js:525 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.detection?.densityPct` | `A315-` | src/share/backfill.test.mjs |  |
| A316 | src/share/viewCodec.js:531 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.styleParams?.[style]?.[spec.key]` | `A316-` | [share-codec-058] The style initializer uses distinct source values |  |
| A317 | src/share/viewCodec.js:531 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.styleParams?.[style]` | `A317-` | src/share/backfill.test.mjs |  |
| A318 | src/share/viewCodec.js:532 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `STYLES[style]?.uniforms?.[spec.key]?.default` | `A318-` | [share-codec-058] The style initializer uses distinct source values |  |
| A319 | src/share/viewCodec.js:532 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `STYLES[style]?.uniforms?.[spec.key]` | `A319-` | [share-codec-058] The style initializer uses distinct source values |  |
| A320 | src/share/viewCodec.js:532 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `STYLES[style]?.uniforms` | `A320-` | [share-codec-058] The style initializer uses distinct source values |  |
| A321 | src/share/viewCodec.js:538 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.bloom?.enabled` | `A321-` | src/share/backfill.test.mjs |  |
| A322 | src/share/viewCodec.js:539 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.bloom?.intensity` | `A322-` | src/share/backfill.test.mjs |  |
| A323 | src/share/viewCodec.js:540 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.sharpen?.enabled` | `A323-` | src/share/backfill.test.mjs |  |
| A324 | src/share/viewCodec.js:541 | SHARE_VIEW_STYLE_DEFAULTS | TESTED | `preset.sharpen?.intensity` | `A324-` | src/share/backfill.test.mjs |  |
| A325 | src/share/viewCodec.js:612 | normalizeView | TESTED | `view?.kind` | `A325-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A326 | src/share/viewCodec.js:613 | normalizeView | TESTED | `view.entity?.kind` | `A326-` | [share-codec-021] The numeric entity id and absent entity use separate paths |  |
| A327 | src/share/viewCodec.js:614 | normalizeView | TESTED | `view.entity?.id` | `A327-` | [share-codec-021] The entity getter can remove its value before id access |  |
| A328 | src/share/viewCodec.js:742 | normalizeShareViewState | TESTED | `view.lastKnown?.observedAtMs` | `A328-` | [share-codec-020] The follow offset heading uses its own field |  |
| A329 | src/share/viewCodec.js:883 | epochSeconds | TESTED | `ms/1000-SHARE_VIEW_EPOCH_S` | `A329-` | [share-codec-012] The scalar sharedAtMs uses its own field |  |
| A330 | src/share/viewCodec.js:929 | encodeShareView | TESTED | `thing?.lastKnown` | `A330-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A331 | src/share/viewCodec.js:1049 | initialization | TESTED | `!f.retired` | `A331-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A332 | src/share/viewCodec.js:1116 | decodeLayers | TESTED | `layerEntry?.optionOwner` | `A332-` | [share-codec-050] The layer option handles unknown owner |  |
| A333 | src/share/viewCodec.js:1116 | decodeLayers | TESTED | `layerEntry?.id` | `A333-` | [share-codec-050] The layer option handles unknown owner |  |
| A334 | src/share/viewCodec.js:1117 | decodeLayers | TESTED | `layerEntry?.optionOwner` | `A334-` | [share-codec-050] The layer option handles unknown owner |  |
| A335 | src/share/viewCodec.js:1122 | decodeLayers | TESTED | `candidate.token===optionToken` | `A335-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A336 | src/share/viewCodec.js:1130 | decodeLayers | TESTED | `options[ownerId]??={}` | `A336-` | [share-codec-018] The option decoder keeps all values within each owner |  |
| A337 | src/share/viewCodec.js:1136 | decodeLayers | TESTED | `options[ownerId]??={}` | `A337-` | [share-codec-018] The option cctv autoHop keeps its own value |  |
| A338 | src/share/viewCodec.js:1200 | decodeStyleParams | TESTED | `candidate.token===token` | `A338-` | [share-codec-015] The parameter anime edgeThick uses its own token |  |
| A339 | src/share/viewCodec.js:1225 | decodeThing | TESTED | `fields.get(n)?.varint` | `A339-` | [share-codec-023] The fix time uses current fix |  |
| A340 | src/share/viewCodec.js:1227 | decodeThing | TESTED | `fields.get(F.range)?.varint` | `A340-` | [share-codec-020] The follow offset heading uses its own field |  |
| A341 | src/share/viewCodec.js:1319 | decodeShareView | TESTED | `raw[key]??=0` | `A341-` | [share-codec-012] The scalar lat uses its own field |  |
| A342 | src/share/viewCodec.js:1333 | decodeShareView | TESTED | `get('flags')?.varint` | `A342-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A343 | src/share/viewCodec.js:1353 | decodeShareView | TESTED | `get('layerOptions')?.len` | `A343-` | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |  |
| A344 | src/share/viewCodec.js:1372 | decodeShareView | TESTED | `thing?.camera` | `A344-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |
| A345 | src/share/viewCodec.js:1382 | decodeShareView | TESTED | `thing?.view` | `A345-` | [share-codec-030] The view kind uses the text thing path |  |
| A346 | src/share/viewCodec.js:1383 | decodeShareView | TESTED | `thing?.fallback` | `A346-` | [share-codec-030] The view kind uses the text thing path |  |
| A347 | src/share/wire.js:187 | WireReader.done | TESTED | `this.pos>=this.end` | `A347-` | [share-codec-010 share-codec-014] The style anime keeps its defaults |  |

## Mutation witnesses

| Case | File | Result | Named test |
| --- | --- | --- | --- |
| A001-true | src/share/follow.js | KILLED | [share-codec-024] The local geometry uses each axis with its sign |
| A001-false | src/share/follow.js | KILLED | [share-codec-024] The local geometry uses each axis with its sign |
| A002-true | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A002-false | src/share/follow.js | KILLED | [share-codec-055] The zero offset keeps the fix and supplied angles |
| A003-left | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A003-right | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A004-empty | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A005-left | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter does not read metadata getters |
| A005-right | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A006-true | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A006-false | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A007-true | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A007-false | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy view without layers supplies the entity layer |
| A008-left | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field alt copies its own value |
| A008-right | src/share/legacyShareState.js | KILLED | [share-codec-039] a tracking selection becomes a thing view and back |
| A009-true | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A009-false | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A010-left | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A010-right | src/share/legacyShareState.js | SURVIVED | See the equivalent proof. |
| A011-left | src/share/legacyShareState.js | SURVIVED | See the equivalent proof. |
| A011-right | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A012-true | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A012-false | src/share/legacyShareState.js | SURVIVED | See the equivalent proof. |
| A013-empty | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A014-true | src/share/shareLinkPath.js | KILLED | [share-codec-045] The path parser keeps invalid escapes for the decoder |
| A014-false | src/share/shareLinkPath.js | KILLED | [share-codec-045] The path parser rejects a custom text object |
| A015-true | src/share/shareLinkPath.js | KILLED | [share-codec-045] The path parser keeps invalid escapes for the decoder |
| A015-false | src/share/shareLinkPath.js | KILLED | [share-codec-045] The path parser keeps invalid escapes for the decoder |
| A016-true | src/share/shareLinkPath.js | KILLED | [share-codec-046] The root uses both share paths and page directories |
| A016-false | src/share/shareLinkPath.js | KILLED | [share-codec-046] The root uses both share paths and page directories |
| A017-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A017-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop uses one wire entry |
| A018-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A018-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A019-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A019-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A020-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A020-right | src/share/viewCodec.js | KILLED | [share-codec-057] The decoder uses Normal for an unknown style |
| A021-true | src/share/viewCodec.js | KILLED | [share-codec-010] The default state keeps the selected style and valid keys |
| A021-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A022-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A023-left | src/share/viewCodec.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A023-right | src/share/viewCodec.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A024-left | src/share/viewCodec.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A024-right | src/share/viewCodec.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A025-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A025-false | src/share/viewCodec.js | KILLED | [share-codec-010] The default state keeps the selected style and valid keys |
| A026-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A027-true | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for lat accepts  12.5  |
| A027-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A028-left | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A028-right | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A029-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A029-right | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case  |
| A030-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A030-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A031-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A031-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A032-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A032-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A033-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lon uses its own field |
| A033-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A034-left | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for lon accepts -190 |
| A034-right | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for lon accepts 190 |
| A035-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A035-false | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric source rejects a custom time object |
| A036-true | src/share/viewCodec.js | KILLED | [share-codec-052] The time decoder checks each bound |
| A036-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A037-left | src/share/viewCodec.js | KILLED | [share-codec-052] The time decoder checks each bound |
| A037-right | src/share/viewCodec.js | KILLED | [share-codec-052] The time decoder checks each bound |
| A038-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A038-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar hudVariant uses its own field |
| A039-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A039-right | src/share/viewCodec.js | KILLED | [share-codec-032 share-codec-056] The open name hudVariant checks bad name |
| A040-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A040-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A041-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity text uses trim and lowercase |
| A041-false | src/share/viewCodec.js | KILLED | [share-codec-021] The numeric entity id and absent entity use separate paths |
| A042-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A042-right | src/share/viewCodec.js | KILLED | [share-codec-021] The invalid identifier type does not reach the grammar |
| A043-true | src/share/viewCodec.js | KILLED | [share-codec-021] The invalid entity id uses a place for Infinity |
| A043-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A044-left | src/share/viewCodec.js | KILLED | [share-codec-021] The invalid identifier type does not reach the grammar |
| A044-right | src/share/viewCodec.js | KILLED | [share-codec-021] The invalid entity id uses a place for bad id |
| A045-left | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A045-right | src/share/viewCodec.js | KILLED | [share-codec-021] The entity satellite uses its own numeric field |
| A046-left | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A046-right | src/share/viewCodec.js | KILLED | [share-codec-015] The style source rejects function objects and absent data |
| A047-left | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A047-right | src/share/viewCodec.js | KILLED | [share-codec-015] The style source rejects function objects and absent data |
| A048-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A049-left | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A049-right | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A050-true | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A050-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A051-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style retro keeps its defaults |
| A051-right | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A052-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A052-right | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A053-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A053-right | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A054-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A055-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A055-right | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A056-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style retro keeps its defaults |
| A056-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A057-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A057-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A058-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A058-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A059-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A059-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A060-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A060-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A061-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A061-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A062-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A062-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A063-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A063-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A064-true | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A064-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A065-true | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A065-false | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A066-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A066-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A067-empty | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A068-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A068-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A069-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A069-right | src/share/viewCodec.js | KILLED | [share-codec-019] The unknown panel does not supply a collapse value |
| A070-empty | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A071-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A071-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A072-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A072-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A073-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A073-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A074-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel source checks every entry before use |
| A074-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A075-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A075-false | src/share/viewCodec.js | KILLED | [share-codec-051] The fix and offset reject invalid source values |
| A076-left | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A076-right | src/share/viewCodec.js | KILLED | [share-codec-051] The fix and offset reject function objects |
| A077-left | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A077-right | src/share/viewCodec.js | KILLED | [share-codec-051] The fix and offset reject function objects |
| A078-left | src/share/viewCodec.js | KILLED | [share-codec-051] The fix and offset reject invalid source values |
| A078-right | src/share/viewCodec.js | KILLED | [share-codec-051] The fix and offset reject invalid source values |
| A079-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A079-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A080-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity text uses trim and lowercase |
| A080-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A081-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A081-false | src/share/viewCodec.js | KILLED | [share-codec-021] The invalid entity id uses a place for  |
| A082-empty | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A083-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A083-false | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A084-true | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A084-false | src/share/viewCodec.js | KILLED | [share-codec-018] The absent options match every frozen value |
| A085-left | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A085-right | src/share/viewCodec.js | KILLED | [share-codec-022] The own view wins over a tracking slot |
| A086-true | src/share/viewCodec.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A086-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A087-left | src/share/viewCodec.js | KILLED | [share-codec-043] The legacy converter uses own fields and excludes metadata |
| A087-right | src/share/viewCodec.js | KILLED | [share-codec-048] The state source rejects a function with numeric fields |
| A088-true | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A088-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A089-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A090-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A090-false | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A091-true | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid detection mode uses the default for  |
| A091-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionMode uses its own field |
| A092-left | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid detection mode uses the default for 17 |
| A092-right | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid detection mode uses the default for  |
| A093-true | src/share/viewCodec.js | KILLED | [share-codec-048] The disabled detection mode keeps a valid density and defaults an invalid density |
| A093-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionDensity uses its own field |
| A094-true | src/share/viewCodec.js | KILLED | [share-codec-048] The disabled detection mode keeps a valid density and defaults an invalid density |
| A094-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A095-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A095-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar scopeFeatherPct uses its own field |
| A096-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A096-false | src/share/viewCodec.js | KILLED | [share-codec-018] The absent options match every frozen value |
| A097-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A097-false | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A098-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A098-false | src/share/viewCodec.js | KILLED | [share-codec-012] every registered field round-trips at once |
| A099-left | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses relative age |
| A099-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A100-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A100-false | src/share/viewCodec.js | KILLED | [share-codec-012] every registered field round-trips at once |
| A101-left | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A101-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A102-true | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |
| A102-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A103-true | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |
| A103-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A104-true | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |
| A104-false | src/share/viewCodec.js | KILLED | [share-codec-016] layer tokens map to permanent numbers covering the whole ledger |
| A105-left | src/share/viewCodec.js | KILLED | [share-codec-021] The decimal entity satellite keeps six decimal digits |
| A105-right | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A106-left | src/share/viewCodec.js | KILLED | [share-codec-021] The aircraft entity aircraft keeps decimal text outside six digits |
| A106-right | src/share/viewCodec.js | KILLED | [share-codec-021] The entity vessel keeps text 002442000 |
| A107-true | src/share/viewCodec.js | KILLED | [share-codec-057] The decoder uses Normal after a custom style getter changes |
| A107-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionAllocation uses its own field |
| A108-empty | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A109-true | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A109-false | src/share/viewCodec.js | KILLED | [share-codec-017] The implied layer for aircraft uses no entity bit |
| A111-empty | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A112-empty | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A113-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A113-right | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop uses one wire entry |
| A114-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A114-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A115-true | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv coverageMode keeps its own value |
| A115-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A116-true | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv coverageMode keeps its own value |
| A116-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A117-true | src/share/viewCodec.js | KILLED | [share-codec-018] every layer option has a frozen absent meaning |
| A117-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A118-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A118-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A119-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A119-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel control-panel uses its own entry |
| A120-empty | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A121-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A121-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A122-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A122-right | src/share/viewCodec.js | KILLED | [share-codec-019] The absent panel pin differs from a false pin |
| A123-left | src/share/viewCodec.js | KILLED | [share-codec-019] panels: only differences from the frozen layout are written |
| A123-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A124-true | src/share/viewCodec.js | KILLED | [share-codec-019] panels: only differences from the frozen layout are written |
| A124-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A125-true | src/share/viewCodec.js | KILLED | [share-codec-019] panels: only differences from the frozen layout are written |
| A125-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel control-panel uses its own entry |
| A126-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A126-right | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A127-empty | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A128-true | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A128-false | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A129-true | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A129-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A130-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A130-false | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A131-true | src/share/viewCodec.js | KILLED | [share-codec-013] The angle heading at 10 uses the nearest signed turn |
| A131-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A132-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A132-false | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset range uses its own field |
| A133-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A133-false | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A134-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A134-false | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset pitch uses its own field |
| A135-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A135-false | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absent time |
| A136-true | src/share/viewCodec.js | KILLED | [share-codec-051] The complete fix supplies every coordinate and altitude |
| A136-false | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absent time |
| A137-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A137-right | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absolute time |
| A138-true | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses current fix |
| A138-false | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses relative age |
| A139-true | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absent time |
| A139-false | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absolute time |
| A140-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A140-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A141-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A141-false | src/share/viewCodec.js | KILLED | [share-codec-017] The implied layer for aircraft uses no entity bit |
| A142-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A143-left | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A143-right | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absent time |
| A144-case0 | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A144-case1 | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A144-case2 | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lon uses its own field |
| A144-case3 | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A144-case4 | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar roll uses its own field |
| A144-case5 | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A144-case6 | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A144-case7 | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A144-case8 | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A144-case9 | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A144-case10 | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A144-case11 | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A145-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A145-false | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A146-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A146-false | src/share/viewCodec.js | KILLED | [share-codec-017] The implied layer for aircraft uses no entity bit |
| A147-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A147-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A148-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A148-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A149-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A149-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A150-empty | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A151-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A151-false | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A152-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A152-false | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A153-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A153-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A154-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A154-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A155-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A155-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A156-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style normal keeps its defaults |
| A156-false | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A157-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A157-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A158-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A158-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A159-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar bloomIntensity uses its own field |
| A159-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A161-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A161-false | src/share/viewCodec.js | KILLED | [share-codec-028] unknown top-level fields of every wire type are skipped and reported |
| A162-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A162-false | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing wire |
| A163-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A163-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports duplicate field |
| A164-true | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A164-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A165-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A165-false | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A166-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionAllocation uses its own field |
| A166-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A167-left | src/share/viewCodec.js | KILLED | [share-codec-032 share-codec-056] The open name hudVariant checks future_name-2 |
| A167-right | src/share/viewCodec.js | KILLED | [share-codec-033] The closed name detectionAllocation accepts known text |
| A168-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionAllocation uses its own field |
| A168-false | src/share/viewCodec.js | KILLED | [share-codec-029] unknown fields inside a thing view, codes and bits are skipped too |
| A171-true | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A171-false | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A172-true | src/share/viewCodec.js | KILLED | [share-codec-029] The layer bits keep known layers beside unknown layers |
| A172-false | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A174-left | src/share/viewCodec.js | KILLED | [share-codec-018] The absent options match every frozen value |
| A174-right | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A175-true | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv coverageMode keeps its own value |
| A175-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A176-left | src/share/viewCodec.js | KILLED | [share-codec-050] The option length checks the cap before its remaining bytes |
| A176-right | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles absent text |
| A177-true | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A177-false | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles duplicate |
| A178-true | src/share/viewCodec.js | KILLED | [share-codec-050] The mirror layer rejects a valid owner option |
| A178-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A179-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A179-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A180-true | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles unknown key |
| A180-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A181-left | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles invalid value |
| A181-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-empty | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-empty | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A184-true | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A184-false | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A186-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A186-false | src/share/viewCodec.js | KILLED | [share-codec-034] The duplicate panel entry fails before its second value applies |
| A187-empty | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A188-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A188-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A189-left | src/share/viewCodec.js | KILLED | [share-codec-049] The future panel reports its number |
| A189-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A190-empty | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A191-true | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A191-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A192-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A192-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A193-left | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A193-right | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A194-true | src/share/viewCodec.js | KILLED | [share-codec-019] The absent panel pin differs from a false pin |
| A194-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel control-panel uses its own entry |
| A195-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A195-right | src/share/viewCodec.js | KILLED | [share-codec-019] The absent panel pin differs from a false pin |
| A196-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A196-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A197-left | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A197-right | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the style duplicate |
| A199-true | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A199-false | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the style duplicate |
| A200-true | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A200-false | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the style duplicate |
| A201-left | src/share/viewCodec.js | KILLED | [share-codec-049] The unknown style token 35 reports its value |
| A201-right | src/share/viewCodec.js | KILLED | [share-codec-049] The unknown style token 36 reports its value |
| A202-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A202-false | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A203-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A203-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A204-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity satellite uses its own numeric field |
| A204-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A205-true | src/share/viewCodec.js | KILLED | [share-codec-031] an unknown or invalid entity falls back to the camera its fix implies |
| A205-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A206-left | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing latitude |
| A206-right | src/share/viewCodec.js | KILLED | [share-codec-031] The unknown entity uses a fix with default altitude |
| A207-left | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset range uses its own field |
| A207-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A208-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A208-false | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A209-true | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A209-false | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset pitch uses its own field |
| A210-left | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing latitude |
| A210-right | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing longitude |
| A211-true | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absent time |
| A211-false | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absolute time |
| A212-true | src/share/viewCodec.js | KILLED | [share-codec-023] The fix ignores an age without a share time |
| A212-false | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses relative age |
| A213-left | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing latitude |
| A213-right | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing longitude |
| A214-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A214-false | src/share/viewCodec.js | KILLED | [share-codec-031] The unknown entity uses a fix with default altitude |
| A215-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A215-false | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the thing duplicate |
| A216-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A216-false | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the empty entity path |
| A217-true | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the empty entity path |
| A217-false | src/share/viewCodec.js | KILLED | [share-codec-031] The unknown entity uses a fix with default altitude |
| A218-true | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A218-false | src/share/viewCodec.js | KILLED | [share-codec-031] an unknown or invalid entity falls back to the camera its fix implies |
| A219-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A219-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports non-string |
| A220-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A220-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports bound |
| A221-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A221-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports short |
| A222-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A222-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports checksum |
| A223-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A223-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports version |
| A224-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A225-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A225-right | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text place path |
| A226-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A226-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A227-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A227-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A228-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A228-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A229-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A229-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A230-left | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A230-right | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A231-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A231-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar bloomIntensity uses its own field |
| A232-empty | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the camera longitude |
| A233-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A233-false | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the camera longitude |
| A234-true | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for lon accepts -190 |
| A234-false | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports latitude |
| A235-left | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style normal keeps its defaults |
| A235-right | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A236-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A236-false | src/share/viewCodec.js | KILLED | [share-codec-057] The decoder uses Normal after a custom style getter changes |
| A237-empty | src/share/viewCodec.js | KILLED | [share-codec-032 share-codec-056] The open name hudVariant checks bad name |
| A238-left | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A238-right | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar hudVariant uses its own field |
| A239-left | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A239-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A240-empty | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A241-left | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A241-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A242-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A242-false | src/share/viewCodec.js | KILLED | [share-codec-029] unknown fields inside a thing view, codes and bits are skipped too |
| A243-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A243-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A244-true | src/share/viewCodec.js | KILLED | [share-codec-054] The decoder reports an internal exception |
| A244-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A245-left | src/share/viewCodec.js | KILLED | [share-codec-052] The positive epoch guard does not read the clock |
| A245-right | src/share/viewCodec.js | KILLED | [share-codec-054] The decoder reports an internal exception |
| A246-left | src/share/viewCodec.js | KILLED | [share-codec-052] The positive epoch guard does not read the clock |
| A246-right | src/share/viewCodec.js | KILLED | [share-codec-052] The safe epoch guard does not read the clock |
| A247-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A247-false | src/share/viewCodec.js | KILLED | [share-codec-018] The absent options match every frozen value |
| A248-left | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A248-right | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A249-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A249-false | src/share/viewCodec.js | KILLED | [share-codec-050] The option without layers reports its scope |
| A250-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A250-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A251-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A251-false | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A252-left | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A252-right | src/share/viewCodec.js | KILLED | [share-codec-049] The style parameter without a style reports Normal |
| A253-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A253-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A254-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A254-false | src/share/viewCodec.js | KILLED | [share-codec-031] The unknown entity uses a fix with default altitude |
| A255-true | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A255-false | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text future path |
| A256-true | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the number place path |
| A256-false | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text place path |
| A257-left | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the number place path |
| A257-right | src/share/viewCodec.js | KILLED | [share-codec-030] The unknown numeric view kind reports one value |
| A258-true | src/share/viewCodec.js | KILLED | [share-codec-011] The default result excludes optional report properties |
| A258-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A259-true | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the number place path |
| A259-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A260-true | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the empty entity path |
| A260-false | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| A261-left | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the empty entity path |
| A261-right | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text thing path |
| A262-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A262-false | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text future path |
| A263-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A263-false | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A264-true | src/share/viewCodec.js | KILLED | [share-codec-011] The default result excludes optional report properties |
| A264-false | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the empty entity path |
| A265-true | src/share/viewCodec.js | KILLED | [share-codec-054] The decoder reports an internal exception |
| A265-false | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the style duplicate |
| A266-true | src/share/wire.js | KILLED | [share-codec-053] The ASCII helpers check both bounds |
| A266-false | src/share/wire.js | KILLED | [share-codec-053] The ASCII helpers check both bounds |
| A268-true | src/share/wire.js | KILLED | [share-codec-001] The encoder does not read byte 1 beyond the length |
| A268-false | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A269-true | src/share/wire.js | KILLED | [share-codec-001] The encoder does not read byte 2 beyond the length |
| A269-false | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A270-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A270-false | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A271-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A271-false | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A272-left | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A272-right | src/share/wire.js | KILLED | [share-codec-034] The invalid payload reports empty |
| A273-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A273-false | src/share/wire.js | KILLED | [share-codec-002] base64url rejects padding, foreign characters, bad lengths and stray bits |
| A274-empty | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A275-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A275-false | src/share/wire.js | KILLED | [share-codec-034] The invalid payload reports padding |
| A276-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A276-false | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A277-left | src/share/wire.js | SURVIVED | See the equivalent proof. |
| A277-right | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A278-empty | src/share/wire.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A280-true | src/share/wire.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A280-false | src/share/wire.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A281-true | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A281-false | src/share/wire.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A282-true | src/share/wire.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A282-false | src/share/wire.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A283-left | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A283-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A285-left | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A285-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A286-left | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A286-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A287-left | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A287-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A288-empty | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A290-left | src/share/wire.js | KILLED | [share-codec-053] The ASCII helpers check both bounds |
| A290-right | src/share/wire.js | KILLED | [share-codec-053] The ASCII helpers check both bounds |
| A291-empty | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A292-left | src/share/wire.js | KILLED | [share-codec-050] The layer option handles bad ASCII text |
| A292-right | src/share/wire.js | KILLED | [share-codec-053] The ASCII helpers check both bounds |
| A294-true | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A294-false | src/share/wire.js | KILLED | [share-codec-034] The decoder rejects the style truncated |
| A295-true | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A295-false | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A296-left | src/share/wire.js | KILLED | [share-codec-018] The absent options match every frozen value |
| A296-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A297-true | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A297-false | src/share/wire.js | KILLED | [share-codec-006] the reader rejects truncated, overlong and overflowing varints |
| A298-left | src/share/wire.js | KILLED | [share-codec-034] The invalid payload reports field |
| A298-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A299-left | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A299-right | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A300-left | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A300-right | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A301-left | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A301-right | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A302-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A302-false | src/share/wire.js | KILLED | [share-codec-007] the reader bounds lengths and rejects group and reserved wire types |
| A303-true | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A303-false | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A304-true | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A304-false | src/share/wire.js | KILLED | [share-codec-031] The unknown entity uses a fix with default altitude |
| A305-true | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A305-false | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A306-true | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A306-false | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| A004-key-lat | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field lat copies its own value |
| A004-key-lon | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field lon copies its own value |
| A004-key-alt | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field alt copies its own value |
| A004-key-heading | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field heading copies its own value |
| A004-key-pitch | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field pitch copies its own value |
| A004-key-roll | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field roll copies its own value |
| A004-key-style | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field style copies its own value |
| A004-key-styleParams | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A004-key-bloom | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag bloom copies its own value |
| A004-key-sharpen | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag sharpen copies its own value |
| A004-key-bloomIntensity | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field bloomIntensity copies its own value |
| A004-key-bloomVersion | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field bloomVersion copies its own value |
| A004-key-sharpenIntensity | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field sharpenIntensity copies its own value |
| A004-key-hudVariant | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field hudVariant copies its own value |
| A004-key-hudVisible | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag hudVisible copies its own value |
| A004-key-detectionMode | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionMode copies its own value |
| A004-key-detectionDensity | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionDensity copies its own value |
| A004-key-detectionAllocation | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionAllocation copies its own value |
| A004-key-detectionFadePct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionFadePct copies its own value |
| A004-key-detectionOutsideOpacityPct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionOutsideOpacityPct copies its own value |
| A004-key-celestialRing | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag celestialRing copies its own value |
| A004-key-scopeEnabled | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag scopeEnabled copies its own value |
| A004-key-scopeFeatherPct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field scopeFeatherPct copies its own value |
| A004-key-scopeTerminusPct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field scopeTerminusPct copies its own value |
| A004-key-mapStack | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field mapStack copies its own value |
| A004-key-layerState | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A004-key-layerStateInvalid | src/share/legacyShareState.js | SURVIVED | See the equivalent proof. |
| A004-key-panelState | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A004-key-sharedAtMs | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field sharedAtMs copies its own value |
| A013-key-lat | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field lat copies its own value |
| A013-key-lon | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field lon copies its own value |
| A013-key-alt | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field alt copies its own value |
| A013-key-heading | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field heading copies its own value |
| A013-key-pitch | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field pitch copies its own value |
| A013-key-roll | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field roll copies its own value |
| A013-key-style | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field style copies its own value |
| A013-key-styleParams | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A013-key-bloom | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag bloom copies its own value |
| A013-key-sharpen | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag sharpen copies its own value |
| A013-key-bloomIntensity | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field bloomIntensity copies its own value |
| A013-key-bloomVersion | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field bloomVersion copies its own value |
| A013-key-sharpenIntensity | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field sharpenIntensity copies its own value |
| A013-key-hudVariant | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field hudVariant copies its own value |
| A013-key-hudVisible | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag hudVisible copies its own value |
| A013-key-detectionMode | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionMode copies its own value |
| A013-key-detectionDensity | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionDensity copies its own value |
| A013-key-detectionAllocation | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionAllocation copies its own value |
| A013-key-detectionFadePct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionFadePct copies its own value |
| A013-key-detectionOutsideOpacityPct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field detectionOutsideOpacityPct copies its own value |
| A013-key-celestialRing | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag celestialRing copies its own value |
| A013-key-scopeEnabled | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy flag scopeEnabled copies its own value |
| A013-key-scopeFeatherPct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field scopeFeatherPct copies its own value |
| A013-key-scopeTerminusPct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field scopeTerminusPct copies its own value |
| A013-key-mapStack | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field mapStack copies its own value |
| A013-key-layerState | src/share/legacyShareState.js | SURVIVED | See the equivalent proof. |
| A013-key-layerStateInvalid | src/share/legacyShareState.js | SURVIVED | See the equivalent proof. |
| A013-key-panelState | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A013-key-sharedAtMs | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy field sharedAtMs copies its own value |
| A022-key-view | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A022-key-lat | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field lat |
| A022-key-lon | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field lon |
| A022-key-alt | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field alt |
| A022-key-heading | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field heading |
| A022-key-pitch | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field pitch |
| A022-key-roll | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field roll |
| A022-key-sharedAtMs | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field sharedAtMs |
| A022-key-flags | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A022-key-layerState | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field layerState |
| A022-key-layerOptions | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A022-key-panelState | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field panelState |
| A022-key-thing | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A022-key-style | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field style |
| A022-key-mapStack | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field mapStack |
| A022-key-hudVariant | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field hudVariant |
| A022-key-bloomIntensity | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field bloomIntensity |
| A022-key-bloomVersion | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field bloomVersion |
| A022-key-sharpenIntensity | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field sharpenIntensity |
| A022-key-detectionMode | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field detectionMode |
| A022-key-detectionDensity | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field detectionDensity |
| A022-key-detectionAllocation | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field detectionAllocation |
| A022-key-detectionFadePct | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field detectionFadePct |
| A022-key-detectionOutsideOpacityPct | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field detectionOutsideOpacityPct |
| A022-key-scopeFeatherPct | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field scopeFeatherPct |
| A022-key-scopeTerminusPct | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field scopeTerminusPct |
| A022-key-styleParams | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field styleParams |
| A026-key-bloom | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field bloom |
| A026-key-sharpen | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field sharpen |
| A026-key-hudVisible | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field hudVisible |
| A026-key-celestialRing | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field celestialRing |
| A026-key-scopeEnabled | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field scopeEnabled |
| A048-key-retro-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro pixelation uses its own token |
| A048-key-retro-distortion | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro distortion uses its own token |
| A048-key-retro-instability | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro instability uses its own token |
| A048-key-surveillance-gain | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance gain uses its own token |
| A048-key-surveillance-bloom | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance bloom uses its own token |
| A048-key-surveillance-scanlineStr | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance scanlineStr uses its own token |
| A048-key-surveillance-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance pixelation uses its own token |
| A048-key-thermal-sensitivity | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal sensitivity uses its own token |
| A048-key-thermal-bloom | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal bloom uses its own token |
| A048-key-thermal-mode | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal mode uses its own token |
| A048-key-thermal-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal pixelation uses its own token |
| A048-key-thermal-palette | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal palette uses its own token |
| A048-key-anime-saturation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime saturation uses its own token |
| A048-key-anime-edgeThick | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A048-key-noir-contrastAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir contrastAmt uses its own token |
| A048-key-noir-grainAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir grainAmt uses its own token |
| A048-key-noir-vignetteAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir vignetteAmt uses its own token |
| A048-key-snow-density | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter snow density uses its own token |
| A048-key-snow-wind | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter snow wind uses its own token |
| A054-key-retro-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro pixelation uses its own token |
| A054-key-retro-distortion | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro distortion uses its own token |
| A054-key-retro-instability | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro instability uses its own token |
| A054-key-surveillance-gain | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance gain uses its own token |
| A054-key-surveillance-bloom | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance bloom uses its own token |
| A054-key-surveillance-scanlineStr | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance scanlineStr uses its own token |
| A054-key-surveillance-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance pixelation uses its own token |
| A054-key-thermal-sensitivity | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal sensitivity uses its own token |
| A054-key-thermal-bloom | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal bloom uses its own token |
| A054-key-thermal-mode | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal mode uses its own token |
| A054-key-thermal-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal pixelation uses its own token |
| A054-key-thermal-palette | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal palette uses its own token |
| A054-key-anime-saturation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime saturation uses its own token |
| A054-key-anime-edgeThick | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A054-key-noir-contrastAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir contrastAmt uses its own token |
| A054-key-noir-grainAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir grainAmt uses its own token |
| A054-key-noir-vignetteAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir vignetteAmt uses its own token |
| A054-key-snow-density | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter snow density uses its own token |
| A054-key-snow-wind | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter snow wind uses its own token |
| A070-key-control-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel control-panel uses its own entry |
| A070-key-location-bar | src/share/viewCodec.js | KILLED | [share-codec-019] The panel location-bar uses its own entry |
| A070-key-data-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel data-panel uses its own entry |
| A070-key-cctv-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A070-key-recent-imagery-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel recent-imagery-panel uses its own entry |
| A070-key-street-level-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel street-level-panel uses its own entry |
| A070-key-radio-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel radio-panel uses its own entry |
| A070-key-scene-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel scene-panel uses its own entry |
| A070-key-global-context-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel global-context-panel uses its own entry |
| A070-key-pp-toggles | src/share/viewCodec.js | KILLED | [share-codec-019] The panel pp-toggles uses its own entry |
| A070-key-param-slider-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel param-slider-panel uses its own entry |
| A082-key-aircraft | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A082-key-military_aircraft | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for military_aircraft moves both ways |
| A082-key-vessel | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A082-key-satellite | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for satellite moves both ways |
| A089-key-bloom | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A089-key-sharpen | src/share/viewCodec.js | KILLED | [share-codec-012] The flag sharpen uses its own bit |
| A089-key-hudVisible | src/share/viewCodec.js | KILLED | [share-codec-012] The flag hudVisible uses its own bit |
| A089-key-celestialRing | src/share/viewCodec.js | KILLED | [share-codec-012] The flag celestialRing uses its own bit |
| A089-key-scopeEnabled | src/share/viewCodec.js | KILLED | [share-codec-012] The flag scopeEnabled uses its own bit |
| A111-key-traffic | src/share/viewCodec.js | KILLED | [share-codec-018] The option traffic roadMode uses one wire entry |
| A111-key-weather-lightning | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-lightning opacity uses one wire entry |
| A111-key-weather-radar | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-radar opacity uses one wire entry |
| A111-key-weather-satellite | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-satellite infrared uses one wire entry |
| A111-key-wind | src/share/viewCodec.js | KILLED | [share-codec-018] The option wind model uses one wire entry |
| A111-key-flights | src/share/viewCodec.js | KILLED | [share-codec-018] The option flights models3d uses one wire entry |
| A111-key-satellites | src/share/viewCodec.js | KILLED | [share-codec-018] The option satellites catalog uses one wire entry |
| A111-key-cctv | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv coverageMode uses one wire entry |
| A111-key-recent-imagery | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery west uses one wire entry |
| A111-key-street-level | src/share/viewCodec.js | KILLED | [share-codec-018] The option street-level mapillary uses one wire entry |
| A111-key-radio | src/share/viewCodec.js | KILLED | [share-codec-018] The option radio filter uses one wire entry |
| A112-key-traffic-roadMode | src/share/viewCodec.js | KILLED | [share-codec-018] The option traffic roadMode uses one wire entry |
| A112-key-weather-lightning-opacity | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-lightning opacity uses one wire entry |
| A112-key-weather-radar-opacity | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-radar opacity uses one wire entry |
| A112-key-weather-satellite-infrared | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-satellite infrared uses one wire entry |
| A112-key-weather-satellite-opacity | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-satellite opacity uses one wire entry |
| A112-key-weather-satellite-product | src/share/viewCodec.js | KILLED | [share-codec-018] The option weather-satellite product uses one wire entry |
| A112-key-wind-model | src/share/viewCodec.js | KILLED | [share-codec-018] The option wind model uses one wire entry |
| A112-key-wind-overlay | src/share/viewCodec.js | KILLED | [share-codec-018] The option wind overlay uses one wire entry |
| A112-key-wind-units | src/share/viewCodec.js | KILLED | [share-codec-018] The option wind units uses one wire entry |
| A112-key-wind-paused | src/share/viewCodec.js | KILLED | [share-codec-018] The option wind paused uses one wire entry |
| A112-key-flights-models3d | src/share/viewCodec.js | KILLED | [share-codec-018] The option flights models3d uses one wire entry |
| A112-key-flights-models3dMode | src/share/viewCodec.js | KILLED | [share-codec-018] The option flights models3dMode uses one wire entry |
| A112-key-flights-selectedFlightsTrackingId | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A112-key-flights-selectedMilitaryTrackingId | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A112-key-satellites-catalog | src/share/viewCodec.js | KILLED | [share-codec-018] The option satellites catalog uses one wire entry |
| A112-key-satellites-selectedSatTrackingId | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A112-key-cctv-coverageMode | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv coverageMode uses one wire entry |
| A112-key-cctv-showProjection | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv showProjection uses one wire entry |
| A112-key-cctv-autoHop | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop uses one wire entry |
| A112-key-recent-imagery-west | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery west uses one wire entry |
| A112-key-recent-imagery-south | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery south uses one wire entry |
| A112-key-recent-imagery-east | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery east uses one wire entry |
| A112-key-recent-imagery-north | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery north uses one wire entry |
| A112-key-recent-imagery-a | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery a uses one wire entry |
| A112-key-recent-imagery-b | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery b uses one wire entry |
| A112-key-recent-imagery-mode | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery mode uses one wire entry |
| A112-key-recent-imagery-split | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery split uses one wire entry |
| A112-key-recent-imagery-viirs | src/share/viewCodec.js | KILLED | [share-codec-018] The option recent-imagery viirs uses one wire entry |
| A112-key-street-level-mapillary | src/share/viewCodec.js | KILLED | [share-codec-018] The option street-level mapillary uses one wire entry |
| A112-key-street-level-providerSwitches | src/share/viewCodec.js | KILLED | [share-codec-018] The option street-level providerSwitches uses one wire entry |
| A112-key-street-level-pano | src/share/viewCodec.js | KILLED | [share-codec-018] The option street-level pano uses one wire entry |
| A112-key-street-level-sinceDays | src/share/viewCodec.js | KILLED | [share-codec-018] The option street-level sinceDays uses one wire entry |
| A112-key-radio-filter | src/share/viewCodec.js | KILLED | [share-codec-018] The option radio filter uses one wire entry |
| A112-key-radio-volume | src/share/viewCodec.js | KILLED | [share-codec-018] The option radio volume uses one wire entry |
| A120-key-control-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel control-panel uses its own entry |
| A120-key-location-bar | src/share/viewCodec.js | KILLED | [share-codec-019] The panel location-bar uses its own entry |
| A120-key-data-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel data-panel uses its own entry |
| A120-key-cctv-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A120-key-recent-imagery-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel recent-imagery-panel uses its own entry |
| A120-key-street-level-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel street-level-panel uses its own entry |
| A120-key-radio-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel radio-panel uses its own entry |
| A120-key-scene-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel scene-panel uses its own entry |
| A120-key-global-context-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel global-context-panel uses its own entry |
| A120-key-pp-toggles | src/share/viewCodec.js | KILLED | [share-codec-019] The panel pp-toggles uses its own entry |
| A120-key-param-slider-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel param-slider-panel uses its own entry |
| A127-key-retro-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro pixelation uses its own token |
| A127-key-retro-distortion | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro distortion uses its own token |
| A127-key-retro-instability | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter retro instability uses its own token |
| A127-key-surveillance-gain | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance gain uses its own token |
| A127-key-surveillance-bloom | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance bloom uses its own token |
| A127-key-surveillance-scanlineStr | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance scanlineStr uses its own token |
| A127-key-surveillance-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter surveillance pixelation uses its own token |
| A127-key-thermal-sensitivity | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal sensitivity uses its own token |
| A127-key-thermal-bloom | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal bloom uses its own token |
| A127-key-thermal-mode | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal mode uses its own token |
| A127-key-thermal-pixelation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal pixelation uses its own token |
| A127-key-thermal-palette | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter thermal palette uses its own token |
| A127-key-anime-saturation | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime saturation uses its own token |
| A127-key-anime-edgeThick | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A127-key-noir-contrastAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir contrastAmt uses its own token |
| A127-key-noir-grainAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir grainAmt uses its own token |
| A127-key-noir-vignetteAmt | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir vignetteAmt uses its own token |
| A127-key-snow-density | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter snow density uses its own token |
| A127-key-snow-wind | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter snow wind uses its own token |
| A142-key-view | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A142-key-lat | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A142-key-lon | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lon uses its own field |
| A142-key-alt | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A142-key-heading | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A142-key-pitch | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar pitch uses its own field |
| A142-key-roll | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar roll uses its own field |
| A142-key-sharedAtMs | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A142-key-flags | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A142-key-layerState | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer flights keeps its own bit |
| A142-key-layerOptions | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A142-key-panelState | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A142-key-thing | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft uses its own numeric field |
| A142-key-style | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar style uses its own field |
| A142-key-mapStack | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar mapStack uses its own field |
| A142-key-hudVariant | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar hudVariant uses its own field |
| A142-key-bloomIntensity | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar bloomIntensity uses its own field |
| A142-key-bloomVersion | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar bloomVersion uses its own field |
| A142-key-sharpenIntensity | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharpenIntensity uses its own field |
| A142-key-detectionMode | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionMode uses its own field |
| A142-key-detectionDensity | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionDensity uses its own field |
| A142-key-detectionAllocation | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionAllocation uses its own field |
| A142-key-detectionFadePct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionFadePct uses its own field |
| A142-key-detectionOutsideOpacityPct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionOutsideOpacityPct uses its own field |
| A142-key-scopeFeatherPct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar scopeFeatherPct uses its own field |
| A142-key-scopeTerminusPct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar scopeTerminusPct uses its own field |
| A142-key-styleParams | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter noir grainAmt uses its own token |
| A150-key-bloom | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A150-key-sharpen | src/share/viewCodec.js | KILLED | [share-codec-012] The flag sharpen uses its own bit |
| A150-key-hudVisible | src/share/viewCodec.js | KILLED | [share-codec-012] The flag hudVisible uses its own bit |
| A150-key-celestialRing | src/share/viewCodec.js | KILLED | [share-codec-012] The flag celestialRing uses its own bit |
| A150-key-scopeEnabled | src/share/viewCodec.js | KILLED | [share-codec-012] The flag scopeEnabled uses its own bit |
| A182-key-traffic | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-weather-lightning | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-weather-radar | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-weather-satellite | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-wind | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-flights | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-satellites | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-cctv | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-recent-imagery | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-street-level | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A182-key-radio | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-traffic-roadMode | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-weather-lightning-opacity | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-weather-radar-opacity | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-weather-satellite-infrared | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-weather-satellite-opacity | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-weather-satellite-product | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-wind-model | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-wind-overlay | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-wind-units | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-wind-paused | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-flights-models3d | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-flights-models3dMode | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-flights-selectedFlightsTrackingId | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-flights-selectedMilitaryTrackingId | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-satellites-catalog | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-satellites-selectedSatTrackingId | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-cctv-coverageMode | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-cctv-showProjection | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-cctv-autoHop | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-west | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-south | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-east | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-north | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-a | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-b | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-mode | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-split | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-recent-imagery-viirs | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-street-level-mapillary | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-street-level-providerSwitches | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-street-level-pano | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-street-level-sinceDays | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-radio-filter | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A183-key-radio-volume | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A190-key-control-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel control-panel uses its own entry |
| A190-key-location-bar | src/share/viewCodec.js | KILLED | [share-codec-019] The panel location-bar uses its own entry |
| A190-key-data-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel data-panel uses its own entry |
| A190-key-cctv-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel cctv-panel uses its own entry |
| A190-key-recent-imagery-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel recent-imagery-panel uses its own entry |
| A190-key-street-level-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel street-level-panel uses its own entry |
| A190-key-radio-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel radio-panel uses its own entry |
| A190-key-scene-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel scene-panel uses its own entry |
| A190-key-global-context-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel global-context-panel uses its own entry |
| A190-key-pp-toggles | src/share/viewCodec.js | KILLED | [share-codec-019] The panel pp-toggles uses its own entry |
| A190-key-param-slider-panel | src/share/viewCodec.js | KILLED | [share-codec-019] The panel param-slider-panel uses its own entry |
| A224-key-view | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-lat | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A224-key-lon | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lon uses its own field |
| A224-key-alt | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar alt uses its own field |
| A224-key-heading | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar heading uses its own field |
| A224-key-pitch | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar pitch uses its own field |
| A224-key-roll | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar roll uses its own field |
| A224-key-sharedAtMs | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-flags | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-layerState | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-layerOptions | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-panelState | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-thing | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A224-key-style | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar style uses its own field |
| A224-key-mapStack | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar mapStack uses its own field |
| A224-key-hudVariant | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar hudVariant uses its own field |
| A224-key-bloomIntensity | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar bloomIntensity uses its own field |
| A224-key-bloomVersion | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar bloomVersion uses its own field |
| A224-key-sharpenIntensity | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharpenIntensity uses its own field |
| A224-key-detectionMode | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionMode uses its own field |
| A224-key-detectionDensity | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionDensity uses its own field |
| A224-key-detectionAllocation | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionAllocation uses its own field |
| A224-key-detectionFadePct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionFadePct uses its own field |
| A224-key-detectionOutsideOpacityPct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar detectionOutsideOpacityPct uses its own field |
| A224-key-scopeFeatherPct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar scopeFeatherPct uses its own field |
| A224-key-scopeTerminusPct | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar scopeTerminusPct uses its own field |
| A224-key-styleParams | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A232-key-lat | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports latitude |
| A232-key-lon | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the camera longitude |
| A237-key-hudVariant | src/share/viewCodec.js | KILLED | [share-codec-032 share-codec-056] The open name hudVariant checks bad name |
| A237-key-mapStack | src/share/viewCodec.js | KILLED | [share-codec-032 share-codec-056] The open name mapStack checks bad name |
| A240-key-bloom | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A240-key-sharpen | src/share/viewCodec.js | KILLED | [share-codec-012] The flag sharpen uses its own bit |
| A240-key-hudVisible | src/share/viewCodec.js | KILLED | [share-codec-012] The flag hudVisible uses its own bit |
| A240-key-celestialRing | src/share/viewCodec.js | KILLED | [share-codec-012] The flag celestialRing uses its own bit |
| A240-key-scopeEnabled | src/share/viewCodec.js | KILLED | [share-codec-012] The flag scopeEnabled uses its own bit |
| A108-key-air-quality | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A172-key-air-quality | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A108-key-ais-live-vessels | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer ais-live-vessels keeps its own bit |
| A172-key-ais-live-vessels | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer ais-live-vessels keeps its own bit |
| A108-key-alpr-cameras | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer alpr-cameras keeps its own bit |
| A172-key-alpr-cameras | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer alpr-cameras keeps its own bit |
| A108-key-beemaps | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer beemaps keeps its own bit |
| A172-key-beemaps | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer beemaps keeps its own bit |
| A108-key-beemaps-bursts | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer beemaps-bursts keeps its own bit |
| A172-key-beemaps-bursts | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer beemaps-bursts keeps its own bit |
| A108-key-bhote-koshi-2026 | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer bhote-koshi-2026 keeps its own bit |
| A172-key-bhote-koshi-2026 | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer bhote-koshi-2026 keeps its own bit |
| A108-key-bhote-koshi-locator | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer bhote-koshi-locator keeps its own bit |
| A172-key-bhote-koshi-locator | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer bhote-koshi-locator keeps its own bit |
| A108-key-bikeshare | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer bikeshare keeps its own bit |
| A172-key-bikeshare | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer bikeshare keeps its own bit |
| A108-key-cctv | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer cctv keeps its own bit |
| A172-key-cctv | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer cctv keeps its own bit |
| A108-key-directions | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer directions keeps its own bit |
| A172-key-directions | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer directions keeps its own bit |
| A108-key-earthquakes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer earthquakes keeps its own bit |
| A172-key-earthquakes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer earthquakes keeps its own bit |
| A108-key-fire-perimeters | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer fire-perimeters keeps its own bit |
| A172-key-fire-perimeters | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer fire-perimeters keeps its own bit |
| A108-key-flights | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer flights keeps its own bit |
| A172-key-flights | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer flights keeps its own bit |
| A108-key-gdacs | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer gdacs keeps its own bit |
| A172-key-gdacs | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer gdacs keeps its own bit |
| A108-key-gnss-integrity | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer gnss-integrity keeps its own bit |
| A172-key-gnss-integrity | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer gnss-integrity keeps its own bit |
| A108-key-local-dams | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer local-dams keeps its own bit |
| A172-key-local-dams | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer local-dams keeps its own bit |
| A108-key-local-datacenters | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer local-datacenters keeps its own bit |
| A172-key-local-datacenters | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer local-datacenters keeps its own bit |
| A108-key-local-firms | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer local-firms keeps its own bit |
| A172-key-local-firms | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer local-firms keeps its own bit |
| A108-key-military | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer military keeps its own bit |
| A172-key-military | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer military keeps its own bit |
| A108-key-military-awareness | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer military-awareness keeps its own bit |
| A172-key-military-awareness | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer military-awareness keeps its own bit |
| A108-key-military-installations | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer military-installations keeps its own bit |
| A172-key-military-installations | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer military-installations keeps its own bit |
| A108-key-osh-systems | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer osh-systems keeps its own bit |
| A172-key-osh-systems | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer osh-systems keeps its own bit |
| A108-key-planet-scenes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |
| A172-key-planet-scenes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |
| A108-key-radio | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer radio keeps its own bit |
| A172-key-radio | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer radio keeps its own bit |
| A108-key-recent-imagery | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer recent-imagery keeps its own bit |
| A172-key-recent-imagery | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer recent-imagery keeps its own bit |
| A108-key-reticulum | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer reticulum keeps its own bit |
| A172-key-reticulum | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer reticulum keeps its own bit |
| A108-key-rocket-launches | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer rocket-launches keeps its own bit |
| A172-key-rocket-launches | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer rocket-launches keeps its own bit |
| A108-key-s2-ghostmaps | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer s2-ghostmaps keeps its own bit |
| A172-key-s2-ghostmaps | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer s2-ghostmaps keeps its own bit |
| A108-key-satellites | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer satellites keeps its own bit |
| A172-key-satellites | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer satellites keeps its own bit |
| A108-key-skyfi-scenes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer skyfi-scenes keeps its own bit |
| A172-key-skyfi-scenes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer skyfi-scenes keeps its own bit |
| A108-key-skywatch-scenes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer skywatch-scenes keeps its own bit |
| A172-key-skywatch-scenes | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer skywatch-scenes keeps its own bit |
| A108-key-street-level | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer street-level keeps its own bit |
| A172-key-street-level | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer street-level keeps its own bit |
| A108-key-telegeography-submarine-cables | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer telegeography-submarine-cables keeps its own bit |
| A172-key-telegeography-submarine-cables | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer telegeography-submarine-cables keeps its own bit |
| A108-key-traffic | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer traffic keeps its own bit |
| A172-key-traffic | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer traffic keeps its own bit |
| A108-key-transit | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer transit keeps its own bit |
| A172-key-transit | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer transit keeps its own bit |
| A108-key-weather-cyclones | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-cyclones keeps its own bit |
| A172-key-weather-cyclones | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-cyclones keeps its own bit |
| A108-key-weather-lightning | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-lightning keeps its own bit |
| A172-key-weather-lightning | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-lightning keeps its own bit |
| A108-key-weather-radar | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-radar keeps its own bit |
| A172-key-weather-radar | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-radar keeps its own bit |
| A108-key-weather-satellite | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-satellite keeps its own bit |
| A172-key-weather-satellite | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer weather-satellite keeps its own bit |
| A108-key-wind | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer wind keeps its own bit |
| A172-key-wind | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer wind keeps its own bit |
| A307-true | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A307-false | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A308-true | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A308-false | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A309-true | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A309-false | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| A310-true | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for military_aircraft moves both ways |
| A310-false | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A311-direct | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| A311-absent | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| A312-direct | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A312-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A313-direct | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A313-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A314-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A314-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A315-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A315-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A316-direct | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A316-absent | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style retro keeps its defaults |
| A317-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A317-absent | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style retro keeps its defaults |
| A318-direct | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A318-absent | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A319-direct | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A319-absent | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A320-direct | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A320-absent | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A321-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A321-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A322-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A322-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A323-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A323-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A324-direct | src/share/viewCodec.js | KILLED | src/share/backfill.test.mjs |
| A324-absent | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| A325-direct | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A325-absent | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A326-direct | src/share/viewCodec.js | KILLED | [share-codec-021] The numeric entity id and absent entity use separate paths |
| A326-absent | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A327-direct | src/share/viewCodec.js | KILLED | [share-codec-021] The entity getter can remove its value before id access |
| A327-absent | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A328-direct | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A328-absent | src/share/viewCodec.js | KILLED | [share-codec-023] The absent fix time takes the share time |
| A329-true | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A329-false | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar sharedAtMs uses its own field |
| A330-direct | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A330-absent | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses absent time |
| A331-true | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A331-false | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A332-direct | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles unknown owner |
| A332-absent | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A333-direct | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles unknown owner |
| A333-absent | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A334-direct | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles unknown owner |
| A334-absent | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A335-true | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A335-false | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A336-always | src/share/viewCodec.js | KILLED | [share-codec-018] The option decoder keeps all values within each owner |
| A336-absent | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A337-always | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A337-absent | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A338-true | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A338-false | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A339-direct | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses current fix |
| A339-absent | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A340-direct | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A340-absent | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset range uses its own field |
| A341-always | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| A341-absent | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A342-direct | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A342-absent | src/share/viewCodec.js | KILLED | [share-codec-012] The flag bloom uses its own bit |
| A343-direct | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A343-absent | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A344-direct | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A344-absent | src/share/viewCodec.js | KILLED | [share-codec-031] The unknown entity uses a fix with default altitude |
| A345-direct | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text thing path |
| A345-absent | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| A346-direct | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the text thing path |
| A346-absent | src/share/viewCodec.js | KILLED | [share-codec-030] The view kind uses the empty entity path |
| A347-true | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A110-empty | src/share/viewCodec.js | SURVIVED | See the equivalent proof. |
| A160-empty | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A169-empty | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A170-empty | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| A173-empty | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| A185-empty | src/share/viewCodec.js | KILLED | [share-codec-019] The absent panel pin differs from a false pin |
| A198-empty | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| A267-empty | src/share/wire.js | KILLED | [share-codec-001] The encoder does not read byte 1 beyond the length |
| A279-empty | src/share/wire.js | KILLED | [share-codec-011] The default result excludes optional report properties |
| A284-empty | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| A289-empty | src/share/wire.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| A293-empty | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| S001 | src/share/wire.js | KILLED | [share-codec-001] The encoder does not read byte 1 beyond the length |
| S002 | src/share/wire.js | KILLED | [share-codec-002] base64url rejects padding, foreign characters, bad lengths and stray bits |
| S003 | src/share/wire.js | KILLED | [share-codec-003] zigzag maps small magnitudes of either sign to small codes |
| S004 | src/share/wire.js | KILLED | [share-codec-004] varints round-trip up to the largest safe integer |
| S005 | src/share/wire.js | KILLED | [share-codec-005] The writer checks each numeric bound |
| S006 | src/share/wire.js | KILLED | [share-codec-006] the reader rejects truncated, overlong and overflowing varints |
| S007 | src/share/wire.js | KILLED | [share-codec-007] the reader bounds lengths and rejects group and reserved wire types |
| S008 | src/share/wire.js | KILLED | [share-codec-008] skip steps over each wire type and stops at a truncated value |
| S009 | src/share/wire.js | KILLED | [share-codec-009] crc8 is CRC-8/SMBUS and catches every burst of up to 8 bits |
| S010 | src/share/viewCodec.js | KILLED | [share-codec-010] the field registry is well formed and permanent |
| S011 | src/share/viewCodec.js | KILLED | [share-codec-011] The default result excludes optional report properties |
| S012 | src/share/viewCodec.js | KILLED | [share-codec-012] The scalar lat uses its own field |
| S013 | src/share/viewCodec.js | KILLED | [share-codec-013] precision: coordinates 1e-4 degrees, angles and lengths whole units |
| S014 | src/share/viewCodec.js | KILLED | [share-codec-010 share-codec-014] The style anime keeps its defaults |
| S015 | src/share/viewCodec.js | KILLED | [share-codec-015] The parameter anime edgeThick uses its own token |
| S016 | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer planet-scenes keeps its own bit |
| S017 | src/share/viewCodec.js | KILLED | [share-codec-016 share-codec-017] The layer air-quality keeps its own bit |
| S018 | src/share/viewCodec.js | KILLED | [share-codec-018] The option cctv autoHop keeps its own value |
| S019 | src/share/viewCodec.js | KILLED | [share-codec-019] The absent panel pin differs from a false pin |
| S020 | src/share/viewCodec.js | KILLED | [share-codec-020] The follow offset heading uses its own field |
| S021 | src/share/viewCodec.js | KILLED | [share-codec-021] The entity aircraft keeps text ~ab1234 |
| S022 | src/share/viewCodec.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for aircraft moves both ways |
| S023 | src/share/viewCodec.js | KILLED | [share-codec-023] The fix time uses relative age |
| S024 | src/share/follow.js | KILLED | [share-codec-024] The local geometry uses each axis with its sign |
| S025 | src/share/follow.js | KILLED | [share-codec-025] The camera uses the sphere at latitude 0 longitude 0 |
| S026 | src/share/wire.js | KILLED | [share-codec-026] the check byte rejects every single-character typo |
| S027 | src/share/viewCodec.js | KILLED | [share-codec-027] a created-at time in the future is dropped, like the long form’s `at` |
| S028 | src/share/viewCodec.js | KILLED | [share-codec-028] unknown top-level fields of every wire type are skipped and reported |
| S029 | src/share/viewCodec.js | KILLED | [share-codec-029] unknown fields inside a thing view, codes and bits are skipped too |
| S030 | src/share/viewCodec.js | KILLED | [share-codec-030] The unknown numeric view kind reports one value |
| S031 | src/share/viewCodec.js | KILLED | [share-codec-031] an unknown or invalid entity falls back to the camera its fix implies |
| S032 | src/share/viewCodec.js | KILLED | [share-codec-032] enum names outside the code tables travel as text |
| S033 | src/share/viewCodec.js | KILLED | [share-codec-033] unknown detection names fall back to their defaults and are reported |
| S034 | src/share/viewCodec.js | KILLED | [share-codec-034] The decoder rejects the style duplicate |
| S035 | src/share/viewCodec.js | KILLED | [share-codec-035] every truncation and single-byte corruption of real payloads is handled |
| S036 | src/share/viewCodec.js | KILLED | [share-codec-036] generated states round-trip exactly and encode canonically |
| S037 | src/share/viewCodec.js | KILLED | [share-codec-037] the HAL example survives the round trip and shrinks to 39 characters |
| S038 | src/share/legacyShareState.js | KILLED | [share-codec-038] links from earlier long-form versions keep their historical meaning |
| S039 | src/share/legacyShareState.js | KILLED | [share-codec-022 share-codec-039] The tracking slot for satellite moves both ways |
| S040 | src/share/legacyShareState.js | KILLED | [share-codec-040] thing views the long form cannot express convert without one |
| S041 | src/share/legacyShareState.js | KILLED | [share-codec-041] a thing view turns its layer on, with or without a layer set |
| S042 | src/share/legacyShareState.js | KILLED | [share-codec-042] links written by the long-form generator survive the compact form |
| S043 | src/share/legacyShareState.js | KILLED | [share-codec-043] The legacy converter copies composite state fields |
| S044 | src/share/legacyShareState.js | KILLED | [share-codec-044] the converter knows every key of the long form’s parsed state |
| S045 | src/share/shareLinkPath.js | KILLED | [share-codec-045] The path parser keeps invalid escapes for the decoder |
| S046 | src/share/shareLinkPath.js | KILLED | [share-codec-046] The root uses both share paths and page directories |
| S047 | src/share/shareLinkPath.js | KILLED | [share-codec-047] a share link sits under the app root without the sender ?lang |
| S048 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for lat accepts -95 |
| S049 | src/share/viewCodec.js | KILLED | [share-codec-049] The style parameter without a style reports Normal |
| S050 | src/share/viewCodec.js | KILLED | [share-codec-050] The mirror layer rejects a valid owner option |
| S051 | src/share/viewCodec.js | KILLED | [share-codec-051] The fix and offset reject invalid source values |
| S052 | src/share/viewCodec.js | KILLED | [share-codec-052] The time decoder checks each bound |
| S053 | src/share/wire.js | KILLED | [share-codec-053] The ASCII helpers check both bounds |
| S054 | src/share/viewCodec.js | KILLED | [share-codec-054] The decoder reports an internal exception |
| S055 | src/share/follow.js | KILLED | [share-codec-055] The zero offset keeps the fix and supplied angles |
| S056 | src/share/viewCodec.js | KILLED | [share-codec-032 share-codec-056] The open name hudVariant checks bad name |
| S057 | src/share/viewCodec.js | KILLED | [share-codec-057] The decoder uses Normal for an unknown style |
| S058 | src/share/viewCodec.js | KILLED | [share-codec-058] The style initializer uses distinct source values |
| B001 | src/share/viewCodec.js | KILLED | [share-codec-056] The open name hudVariant rejects excess width |
| B002 | src/share/viewCodec.js | KILLED | [share-codec-032] The open name hudVariant accepts its full width |
| B003 | src/share/viewCodec.js | KILLED | [share-codec-034] The text limit accepts its exact bound before version validation |
| B004 | src/share/wire.js | KILLED | [share-codec-034] The invalid payload reports unsafe varint |
| T001 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for alt accepts 1000000000000 |
| T002 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for alt accepts -1000000000000 |
| T003 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for pitch accepts 95 |
| T004 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for pitch accepts -95 |
| T005 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for roll accepts 721 |
| T006 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for bloomIntensity accepts 10000000 |
| T007 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for bloomIntensity accepts -5 |
| T008 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for bloomVersion accepts 10000000 |
| T009 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for sharpenIntensity accepts -5 |
| T010 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for detectionFadePct accepts 50 |
| T011 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for detectionOutsideOpacityPct accepts 101 |
| T012 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for scopeTerminusPct accepts 3 |
| T013 | src/share/viewCodec.js | KILLED | [share-codec-048] The numeric bound for scopeTerminusPct accepts 101 |
| T014 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case null |
| T015 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case undefined |
| T016 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case false |
| T017 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case [object Object] |
| T018 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case NaN |
| T019 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case Infinity |
| T020 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid number uses defaults for case bad |
| T021 | src/share/viewCodec.js | KILLED | [share-codec-021] The invalid entity id uses a place for null |
| T022 | src/share/viewCodec.js | KILLED | [share-codec-050] The layer option handles excessive text |
| T023 | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports wire |
| T024 | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports truncated varint |
| T025 | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports overlong varint |
| T026 | src/share/viewCodec.js | KILLED | [share-codec-034] The invalid payload reports wrong field type |
| T027 | src/share/wire.js | KILLED | [share-codec-005] The signed writer reports its own range error |
| T028 | src/share/viewCodec.js | KILLED | [share-codec-057] The decoder uses Normal for an unknown style |
| T029 | src/share/viewCodec.js | KILLED | [share-codec-048] The invalid detection mode uses the default for undefined |
| T030 | src/share/viewCodec.js | KILLED | [share-codec-025] The state derives each camera field at latitude 0 longitude 90 |
| T031 | src/share/viewCodec.js | KILLED | [share-codec-025] The state derives each camera field at latitude 45 longitude -120 |
| T032 | src/share/viewCodec.js | KILLED | [share-codec-013] The angle heading at 181 uses the nearest signed turn |
| T033 | src/share/viewCodec.js | KILLED | [share-codec-013] The angle roll at 359 uses the nearest signed turn |
| T034 | src/share/viewCodec.js | KILLED | [share-codec-033] The unknown enum style uses its default |
| T035 | src/share/viewCodec.js | KILLED | [share-codec-033] The unknown enum mapStack uses its default |
| T036 | src/share/viewCodec.js | KILLED | [share-codec-010] The enum and panel tables match their permanent values |
| T037 | src/share/wire.js | KILLED | [share-codec-008] The wire cursor skips type 0 to its next field |
| T038 | src/share/wire.js | KILLED | [share-codec-008] The wire cursor skips type 2 to its next field |
| T039 | src/share/wire.js | KILLED | [share-codec-008] The wire cursor skips type 1 to its next field |
| T040 | src/share/wire.js | KILLED | [share-codec-008] The wire cursor skips type 5 to its next field |
| T041 | src/share/viewCodec.js | KILLED | [share-codec-032] The open name mapStack accepts its full width |
| T042 | src/share/viewCodec.js | KILLED | [share-codec-056] The open name mapStack rejects excess width |
| T043 | src/share/viewCodec.js | KILLED | [share-codec-010] The default state sets the field view |
| T044 | src/share/viewCodec.js | KILLED | [share-codec-010] The default state excludes the field flags |
| T045 | src/share/viewCodec.js | KILLED | [share-codec-010] The default state excludes the field layerOptions |
| T046 | src/share/viewCodec.js | KILLED | [share-codec-010] The default state excludes the field thing |
| T047 | src/share/viewCodec.js | KILLED | [share-codec-022] The raw tracking option for aircraft becomes its entity |
| T048 | src/share/viewCodec.js | KILLED | [share-codec-022] The raw tracking option for military_aircraft becomes its entity |
| T049 | src/share/viewCodec.js | KILLED | [share-codec-022] The raw tracking option for satellite becomes its entity |
| T050 | src/share/legacyShareState.js | KILLED | [share-codec-043] the converter ignores non-objects and restore bookkeeping |
| T051 | src/share/viewCodec.js | KILLED | [share-codec-014] a view just switched to any style costs its camera and style only |
| T052 | src/share/viewCodec.js | KILLED | [share-codec-015] invalid style parameters keep the style’s own value |
| T053 | src/share/viewCodec.js | KILLED | [share-codec-036] normalization is idempotent |
| T054 | src/share/viewCodec.js | KILLED | [share-codec-010] defaults travel as frozen meanings that match today’s app defaults |
| T055 | src/share/viewCodec.js | KILLED | [share-codec-019] the panel table agrees with the long form’s panel tokens |
| T056 | src/share/viewCodec.js | KILLED | [share-codec-015] the style parameter table agrees with the long form’s `sp` codec |
| T057 | src/share/viewCodec.js | KILLED | [share-codec-017] layer sets: absent, explicitly empty and populated stay distinct |
| T058 | src/share/viewCodec.js | KILLED | [share-codec-020] a place view opens at its camera; a thing view also names what to follow |
| T059 | src/share/viewCodec.js | KILLED | [share-codec-021] thing ids use the compact numeric form when they can, text otherwise |
| T060 | src/share/viewCodec.js | KILLED | [share-codec-022] tracking selections in layer options become a thing view |
| T061 | src/share/viewCodec.js | KILLED | [share-codec-034] a code is the bare base64url payload; URL forms are not codes |
| T062 | src/share/viewCodec.js | KILLED | [share-codec-013] size: a camera-only place view |
| T063 | src/share/follow.js | KILLED | [share-codec-025] the derived camera looks at the fix from the offset, even from orbit |
| T064 | src/share/viewCodec.js | KILLED | [share-codec-049] future panel values and style tokens are skipped, not applied |
| T065 | src/share/viewCodec.js | KILLED | [share-codec-050] a layer option filed under a mirror layer is ignored |
| Z001 | src/share/viewCodec.js | KILLED | [share-codec-048] extreme and negative-zero numbers normalize to values the decoder returns |
| Z002 | src/share/viewCodec.js | KILLED | [share-codec-048] extreme and negative-zero numbers normalize to values the decoder returns |
| Z003 | src/share/viewCodec.js | KILLED | [share-codec-048] extreme and negative-zero numbers normalize to values the decoder returns |

## Equivalent cases

| Case | Class | Public API reason |
| --- | --- | --- |
| A004-key-layerStateInvalid | EQUIVALENT | The loop guard at legacyShareState.js:64 already excludes this key. A metadata getter therefore stays unread in both versions. |
| A010-right | EQUIVALENT | The normalizer enables the entity layer at viewCodec.js:749. The fresh layer path at legacyShareState.js:85 also enables it. Public inputs cannot change the private layer set after these steps. |
| A011-left | EQUIVALENT | A valid policy needs an entity entry. The path at legacyShareState.js:85 supplies a layer set for that entry. A place view supplies no policy. |
| A012-false | EQUIVALENT | The satellite grammar at viewCodec.js:489 accepts positive decimal text. normalizeLayerState converts that text to an integer at legacyShareState.js:104. Custom id objects fail the earlier type check. |
| A013-key-layerState | EQUIVALENT | The assignments at legacyShareState.js:116 and line 117 replace this loop result. The converter returns the same own property with or without the loop copy. |
| A013-key-layerStateInvalid | EQUIVALENT | The assignments at legacyShareState.js:116 and line 117 replace this loop result. The converter returns the same own property with or without the loop copy. |
| A017-true | EQUIVALENT | The fixed option groups select each spec. Every owner and key exists in the frozen absent table. normalizeLayerState removes unknown keys before encoding. The decoder selects fixed owners at viewCodec.js:1135. |
| A018-left | EQUIVALENT | The fixed option groups select each spec. Every owner and key exists in the frozen absent table. normalizeLayerState removes unknown keys before encoding. The decoder selects fixed owners at viewCodec.js:1135. |
| A018-right | EQUIVALENT | The fixed option groups select each spec. Every owner and key exists in the frozen absent table. normalizeLayerState removes unknown keys before encoding. The decoder selects fixed owners at viewCodec.js:1135. |
| A022-key-flags | EQUIVALENT | The guards at viewCodec.js:416 and line 417 already exclude this registry entry. The initial view object at line 414 supplies the place kind. |
| A022-key-layerOptions | EQUIVALENT | The guards at viewCodec.js:416 and line 417 already exclude this registry entry. The initial view object at line 414 supplies the place kind. |
| A022-key-thing | EQUIVALENT | The guards at viewCodec.js:416 and line 417 already exclude this registry entry. The initial view object at line 414 supplies the place kind. |
| A022-key-view | EQUIVALENT | The guards at viewCodec.js:416 and line 417 already exclude this registry entry. The initial view object at line 414 supplies the place kind. |
| A040-left | EQUIVALENT | Null and undefined become the local null sentinel at viewCodec.js:483. The guard at line 488 returns null before the grammar call. Neither primitive supplies a callback. |
| A040-right | EQUIVALENT | Null and undefined become the local null sentinel at viewCodec.js:483. The guard at line 488 returns null before the grammar call. Neither primitive supplies a callback. |
| A042-left | EQUIVALENT | Number.isFinite accepts only number primitives and does not convert objects. Other types still take the string or null path at viewCodec.js:485. Custom conversion methods cannot change this result. |
| A057-true | EQUIVALENT | normalizeStyleParams rejects each nonfinite value at viewCodec.js:498. Its private params object contains only copied source values. The worker also checks absent shader values. |
| A082-key-vessel | EQUIVALENT | The vessel entry carries a null tracking key. The loop guard at viewCodec.js:639 already skips it. A public state cannot replace that frozen entry. |
| A083-true | EQUIVALENT | The vessel entry uses a null tracking key. The policy lookup returns undefined instead of null. The guard at viewCodec.js:639 treats both values alike. |
| A099-right | DEFAULT-VALUE | The only extra assignment writes null over the own null time property. normalizeLastKnown creates that property at viewCodec.js:598. Custom fix accessors cannot survive that copy. |
| A101-right | EQUIVALENT | The extra layer id duplicates an id that is already in the set. normalizeLayerState uses a Set and fixed registry order at layerState.js:937. It returns private arrays and normalized primitive options, so custom array methods cannot survive. |
| A110-empty | EQUIVALENT | The bit assignment extends the private array to the same length. Array holes yield undefined during the byte iteration. Uint8Array.from converts each hole to zero at wire.js:finish. Public inputs cannot access this private array. |
| A112-key-flights-selectedFlightsTrackingId | EQUIVALENT | liftTrackedEntity clears every tracking slot at viewCodec.js:642 before encodeLayers runs. A specified view also clears those slots. Public option getters cannot survive normalization. |
| A112-key-flights-selectedMilitaryTrackingId | EQUIVALENT | liftTrackedEntity clears every tracking slot at viewCodec.js:642 before encodeLayers runs. A specified view also clears those slots. Public option getters cannot survive normalization. |
| A112-key-satellites-selectedSatTrackingId | EQUIVALENT | liftTrackedEntity clears every tracking slot at viewCodec.js:642 before encodeLayers runs. A specified view also clears those slots. Public option getters cannot survive normalization. |
| A113-left | DEFAULT-VALUE | A null normalized option also carries a null frozen absent value. Other option types normalize null to their typed defaults. The current schema therefore skips the same values. |
| A114-left | EQUIVALENT | Fixed option encoders return canonical integers or nonnumeric text. Provider switches start with a letter and contain a separator. Radio genres and image keys use letter prefixes. Empty switches equal their absent value and never reach this decision. |
| A114-right | EQUIVALENT | The canonical pattern accepts at most fifteen decimal digits. Their magnitude stays below MAX_ZIGZAG_MAGNITUDE. Public option values pass the fixed normalizers before the encoder selects this path. |
| A128-false | EQUIVALENT | The normalizer copies every default key at viewCodec.js:670. If a worker source lacks a key, both value and default are undefined. The equality check at line 871 therefore skips the same key. |
| A137-left | EQUIVALENT | The normalizer fills an absent fix time from a present share time at viewCodec.js:742. Thus a fix cannot keep a null observation with a present share time. The stored fields are private data properties. |
| A142-key-layerOptions | EQUIVALENT | The view case never writes an inferred place or thing kind. The layerOptions case writes no data because encodeLayers writes that field. Public inputs cannot add another view kind. |
| A142-key-view | EQUIVALENT | The view case never writes an inferred place or thing kind. The layerOptions case writes no data because encodeLayers writes that field. Public inputs cannot add another view kind. |
| A145-false | EQUIVALENT | normalizeView returns only place or thing at viewCodec.js:612 and line 616. The encoder infers the same kind at line 927. An entity getter cannot change the private result object. |
| A165-false | EQUIVALENT | The loop excludes absent entries at viewCodec.js:1304 before its call at line 1311. A custom code object fails the primitive string check at line 1281. |
| A179-true | EQUIVALENT | A null or undefined owner selects an empty option list in layerState.js:824. The lookup then yields undefined instead of null. The next spec check at viewCodec.js:1125 treats both values alike. |
| A181-right | EQUIVALENT | Every fixed option decoder returns a typed value or null. None returns undefined. The private parser supplies ASCII strings, and public code objects cannot replace the reader or a spec. |
| A182-empty | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-cctv | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-flights | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-radio | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-recent-imagery | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-satellites | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-street-level | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-traffic | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-weather-lightning | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-weather-radar | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-weather-satellite | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A182-key-wind | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-empty | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-cctv-autoHop | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-cctv-coverageMode | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-cctv-showProjection | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-flights-models3d | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-flights-models3dMode | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-flights-selectedFlightsTrackingId | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-flights-selectedMilitaryTrackingId | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-radio-filter | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-radio-volume | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-a | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-b | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-east | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-mode | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-north | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-south | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-split | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-viirs | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-recent-imagery-west | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-satellites-catalog | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-satellites-selectedSatTrackingId | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-street-level-mapillary | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-street-level-pano | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-street-level-providerSwitches | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-street-level-sinceDays | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-traffic-roadMode | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-weather-lightning-opacity | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-weather-radar-opacity | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-weather-satellite-infrared | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-weather-satellite-opacity | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-weather-satellite-product | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-wind-model | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-wind-overlay | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-wind-paused | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A183-key-wind-units | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A184-false | DEFAULT-VALUE | Each frozen absent value equals its option group default. normalizeLayerState fills the same values at viewCodec.js:1142. The decoder owns its options object. A custom payload cannot observe that intermediate object or replace the fixed option groups. |
| A195-left | EQUIVALENT | normalizePanelState removes pin values from nonpinnable panels at viewCodec.js:575. Pinnable panels keep the same value. The public payload cannot change the frozen panel table. |
| A196-true | EQUIVALENT | normalizePanelState removes pin values from nonpinnable panels at viewCodec.js:575. Pinnable panels keep the same value. The public payload cannot change the frozen panel table. |
| A202-false | EQUIVALENT | decodeThing returns at viewCodec.js:1255 when the entity entry is absent. Its call at line 1263 therefore supplies a fixed entry. The primitive code input cannot replace that local entry. |
| A207-right | DEFAULT-VALUE | normalizeFollowOffset fills an absent range with 2000 at viewCodec.js:585. Both the camera path and thingView call that helper. The public payload cannot replace the frozen offset default. |
| A208-true | DEFAULT-VALUE | An absent heading gives signed zero at viewCodec.js:1225. The frozen heading default also equals zero. Both present and absent paths therefore give the same number. |
| A224-key-flags | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-layerOptions | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-layerState | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-panelState | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-sharedAtMs | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-styleParams | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-thing | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A224-key-view | EQUIVALENT | The scalar loop excludes structured entries and flags at viewCodec.js:1304. Its cascade does not assign epoch values. Later blocks decode all these entries from the unchanged private field map. |
| A226-right | EQUIVALENT | The scalar cascade does not contain a bytes case at viewCodec.js:1310. A present bytes entry therefore causes no assignment. The later structured decoders still read the same private field map. |
| A227-right | EQUIVALENT | The scalar cascade does not contain a bytes case at viewCodec.js:1310. A present bytes entry therefore causes no assignment. The later structured decoders still read the same private field map. |
| A231-true | EQUIVALENT | The only extra scalar assignment affects the epoch field. The time block at viewCodec.js:1343 replaces it before normalization. A custom clock cannot access the private raw object. |
| A236-true | EQUIVALENT | An unknown style can pass the guard at viewCodec.js:1324 only as LEN text. The enum table contains only known styles. An unknown numeric code returns undefined at line 1079 and cannot enter this guard. |
| A238-left | EQUIVALENT | The grammar accepts the text form of undefined. Thus an absent raw name still causes no report. readEnum returns only text or undefined, so a custom code object cannot supply another type. |
| A239-right | DEFAULT-VALUE | An absent flags value becomes NaN in the bit expression. Each comparison with one is false, as for zero flags. The later unknown-bit comparison is also false. |
| A241-right | EQUIVALENT | defaultOf uses the Normal table for undefined at viewCodec.js:404. The worker gives Normal distinct values and still selects that same table. A primitive name cannot supply another lookup source. |
| A248-right | DEFAULT-VALUE | The options loop at viewCodec.js:1097 stops for null and undefined. The private reader has no observable method call on either value. |
| A277-left | EQUIVALENT | When bits equals zero, the mask at wire.js:73 equals zero. The other operand is therefore false. decodeBase64Url accepts only primitive strings, so custom iterators cannot alter that arithmetic. |
| A331-true | EQUIVALENT | Every field currently lacks a retired flag. The module freezes the field array and each row. A public code or state object cannot add a retired registry entry. |
| A341-absent | DEFAULT-VALUE | An absent camera coordinate still takes zero in normalizeShareViewState at viewCodec.js:662. Present coordinates keep their values. A derived camera replaces both versions before that step. |

## Correction source

The correction check reads commit `4cf8e3706060658bf303d3d6e49643d0a4cb6a9f`.
The earlier tables keep their source commit.
