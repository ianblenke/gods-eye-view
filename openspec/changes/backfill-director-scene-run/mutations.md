# Director scene mutations

Source commit: `dd4dc1bc3bee72d5ec0d2e159ff6cdae6a53a8de`.

The source operator uses `␠` for a space, `↵` for a new line and `ˋ` for a backtick.
The scratch folder holds the source edits and process logs.

| ID | File:line | Operator | Test or source limit | Result |
| --- | --- | --- | --- | --- |
| M001 | `src/scenes/director.js:1656` | `this._running␠→␠false` | [director-231] The active director rejects another scene | KILLED |
| M002 | `src/scenes/director.js:1677` | `this._destroyed␠→␠false` | [director-231] The destroyed director rejects a scene | KILLED |
| M003 | `src/scenes/director.js:1679` | `this._sceneSeekGeneration++␠→␠void␠0` | [director-237] The scene cancels a load owner that waits | KILLED |
| M004 | `src/scenes/director.js:1687` | `this._running␠→␠false` | [director-231] The active director rejects another scene | KILLED |
| M005 | `src/scenes/director.js:1690` | `sceneId␠&#124;&#124;␠␠→␠` | [director-234] The scene starts from named | KILLED |
| M006 | `src/scenes/director.js:1690` | `this._selectedSceneId␠&#124;&#124;␠␠→␠` | [director-234] The scene starts from selected | KILLED |
| M007 | `src/scenes/director.js:1690` | `this._project.scenes[0]?.id␠→␠'bad'` | [director-234] The scene starts from first | KILLED |
| M008 | `src/scenes/director.js:1695` | `scene.id␠===␠sceneId␠&&␠␠→␠` | [director-232] The after-shot guard checks the scene ID | KILLED |
| M009 | `src/scenes/director.js:1695` | `shot.id␠===␠afterShotId␠→␠true` | [director-232] The queue rejects last | KILLED |
| M010 | `src/scenes/director.js:1698` | `index␠+␠1␠→␠index` | [director-236] The scene option uses after | KILLED |
| M011 | `src/scenes/director.js:1699` | `!queue.length␠→␠false` | [director-232] The queue rejects last | KILLED |
| M012 | `src/scenes/director.js:1701` | `!queue.length␠→␠false` | [director-232] The queue rejects empty | KILLED |
| M013 | `src/scenes/director.js:1710` | `!this._claimCameraOwnership()␠→␠false` | [director-233] The camera policy rejects a scene | KILLED |
| M014 | `src/scenes/director.js:1722` | `this._loadAbort?.abort();␠→␠void␠0;` | [director-237] The scene cancels a load owner that waits | KILLED |
| M015 | `src/scenes/director.js:1724` | `this._loadGeneration++␠→␠void␠0` | [director-237] The scene cancels a load owner that waits | KILLED |
| M016 | `src/scenes/director.js:1727` | `!!shot.move␠→␠false` | [director-238] The metadata records move | KILLED |
| M017 | `src/scenes/director.js:1730` | `this._running␠=␠true␠→␠this._running␠=␠false` | [director-235] The scene visits shots in project order | KILLED |
| M018 | `src/scenes/director.js:1732` | `if␠(preview)␠→␠if␠(true)` | [director-236] The scene option uses panel | KILLED |
| M019 | `src/scenes/director.js:1746` | `hidePanels:␠true␠→␠hidePanels:␠false` | [director-236] The scene option uses preview | KILLED |
| M020 | `src/scenes/director.js:1747` | `hudMode:␠'full'␠→␠hudMode:␠'none'` | [director-236] The scene option uses preview | KILLED |
| M021 | `src/scenes/director.js:1748` | `safeFrame:␠'16:9'␠→␠safeFrame:␠'4:3'` | [director-236] The scene option uses preview | KILLED |
| M022 | `src/scenes/director.js:1756` | `item.shot.durationSec␠&#124;&#124;␠0␠→␠0` | [director-238] The metadata records duration | KILLED |
| M023 | `src/scenes/director.js:1756` | `&#124;&#124;␠0␠→␠&#124;&#124;␠9` | [director-238] The metadata records zero | KILLED |
| M024 | `src/scenes/director.js:1757` | `this._effectiveShotHoldSec(item.scene,␠item.shot)␠→␠0` | [director-238] The metadata records duration | KILLED |
| M025 | `src/scenes/director.js:1763` | `ˋproject-${PROJECT_VERSION}ˋ␠→␠'bad'` | [director-238] The metadata records duration | KILLED |
| M026 | `src/scenes/director.js:1767` | `queue.length␠→␠0` | [director-238] The metadata records duration | KILLED |
| M027 | `src/scenes/director.js:1771` | `&#124;&#124;␠1␠→␠&#124;&#124;␠9` | [director-238] The metadata records zero | KILLED |
| M028 | `src/scenes/director.js:1782` | `releaseOnFinish:␠preview␠→␠releaseOnFinish:␠false` | [director-236] The scene option uses preview | KILLED |
| M029 | `src/scenes/director.js:1785` | `error.message␠&#124;&#124;␠'run␠failed'␠→␠'run␠failed'` | [director-239] The scene error uses its message | KILLED |
| M030 | `src/scenes/director.js:1785` | `&#124;&#124;␠'run␠failed'␠→␠&#124;&#124;␠'bad'` | [director-239] The scene error uses default text | KILLED |
| M031 | `src/scenes/director.js:1787` | `error.message␠&#124;&#124;␠'unknown␠error'␠→␠'unknown␠error'` | [director-239] The scene error uses its message | KILLED |
| M032 | `src/scenes/director.js:1787` | `&#124;&#124;␠'unknown␠error'␠→␠&#124;&#124;␠'bad'` | [director-239] The scene error uses default text | KILLED |
| M033 | `src/scenes/director.js:1799` | `this._destroyed␠&#124;&#124;␠␠→␠` | [director-241] The next shot stops for destroyed | KILLED |
| M034 | `src/scenes/director.js:1799` | `this._running␠→␠false` | [director-241] The next shot stops for active | KILLED |
| M035 | `src/scenes/director.js:1802` | `this._selectedSceneId␠&#124;&#124;␠␠→␠` | [director-240] The next shot starts from the selected scene | KILLED |
| M036 | `src/scenes/director.js:1804` | `!queue.length␠→␠false` | [director-241] The next shot stops for empty | KILLED |
| M037 | `src/scenes/director.js:1812` | `idx␠+␠1␠→␠idx` | [director-240] The next shot handles next | KILLED |
| M038 | `src/scenes/director.js:1815` | `next.scene.id,␠next.shot.id␠→␠'bad',␠'bad'` | [director-240] The next shot handles next | KILLED |
| M039 | `src/scenes/director.js:1835` | `this._sceneSeekGeneration++␠→␠void␠0` | [director-242] The scene stop handles active | KILLED |
| M040 | `src/scenes/director.js:1836` | `this._loadAbort?.abort();␠→␠void␠0;` | [director-242] The scene stop handles active | KILLED |
| M041 | `src/scenes/director.js:1838` | `this._loadGeneration++␠→␠void␠0` | [director-242] The scene stop handles active | KILLED |
| M042 | `src/scenes/director.js:1843` | `!this._running␠&#124;&#124;␠␠→␠` | [director-242] The scene stop handles idle | KILLED |
| M043 | `src/scenes/director.js:1843` | `!this._runToken␠→␠false` | [director-242] The scene stop handles token | KILLED |
| M044 | `src/scenes/director.js:1844` | `true␠→␠false` | [director-242] The scene stop handles active | KILLED |
| M045 | `src/scenes/director.js:1845` | `this._runAbort?.abort();␠→␠void␠0;` | [director-242] The scene stop handles active | KILLED |
| M046 | `src/scenes/director.js:1853` | `??␠true␠→␠??␠false` | [director-243] The pack method handles null | KILLED |
| M047 | `src/scenes/director.js:1853` | `scene,␠shot,␠token␠→␠scene,␠shot,␠null` | [director-243] The pack method handles true | KILLED |
| M048 | `src/scenes/director.js:1855` | `!token?.cancelled␠→␠true` | [director-243] The pack method handles canceled | KILLED |
| M049 | `src/scenes/director.js:1855` | `!token?.cancelled␠→␠false` | [director-243] The pack method handles error | KILLED |
| M050 | `src/scenes/director.js:1862` | `&#124;&#124;␠{␠status:␠'idle',␠count:␠0␠}␠→␠&#124;&#124;␠{␠status:␠'bad',␠count:␠1␠}` | [director-244] The state queries handle absent | KILLED |
| M051 | `src/scenes/director.js:1868` | `shot,␠this._dataPacks.getTargets()␠→␠shot,␠[]` | [director-245] The action activation handles targets | KILLED |
| M052 | `src/scenes/director.js:1870` | `this._updateStatus(error.message);␠→␠void␠0;` | [director-245] The action activation handles error | KILLED |
| M053 | `src/scenes/director.js:1876` | `signal.aborted␠&#124;&#124;␠␠→␠` | [director-246] The action guard checks signal | KILLED |
| M054 | `src/scenes/director.js:1876` | `this._running␠&#124;&#124;␠␠→␠` | [director-246] The action guard checks active | KILLED |
| M055 | `src/scenes/director.js:1876` | `this._destroyed␠→␠false` | [director-246] The action guard checks destroyed | KILLED |
| M056 | `src/scenes/director.js:1881` | `!scene␠&#124;&#124;␠␠→␠` | [director-246] The action checks only an absent scene | KILLED |
| M057 | `src/scenes/director.js:1881` | `!shot␠→␠false` | [director-246] The action checks only an absent shot | KILLED |
| M058 | `src/scenes/director.js:1883` | `!this._claimCameraOwnership()␠→␠false` | [director-247] The focus action handles refused | KILLED |
| M059 | `src/scenes/director.js:1884` | `this._cancelActiveSceneTravel();␠→␠void␠0;` | [director-247] The focus action handles accepted | KILLED |
| M060 | `src/scenes/director.js:1885` | `this._clock.stopShot();␠→␠void␠0;` | [director-247] The focus action handles accepted | KILLED |
| M061 | `src/scenes/director.js:1887` | `pitch:␠-90␠→␠pitch:␠-35` | [director-247] The focus action handles accepted | KILLED |
| M062 | `src/scenes/director.js:1892` | `!this.dataManager␠→␠this.dataManager` | [director-248] The layer action handles unknown | KILLED |
| M063 | `src/scenes/director.js:1895` | `action.enabled␠→␠true` | [director-248] The layer action handles disabled | KILLED |
| M064 | `src/scenes/director.js:1896` | `signal,␠→␠signal:␠undefined,` | [director-248] The layer action handles enabled | KILLED |
| M065 | `src/scenes/director.js:1897` | `origin:␠'scene'␠→␠origin:␠'other'` | [director-248] The layer action handles enabled | KILLED |
| M066 | `src/scenes/director.js:1901` | `>=␠64␠→␠>␠64` | [director-249] The shot action checks total 64 | KILLED |
| M067 | `src/scenes/director.js:1907` | `this._interactionTransitions++␠→␠void␠0` | [director-249] The shot action checks total 0 | KILLED |
| M068 | `src/scenes/director.js:1909` | `item.id␠===␠action.shotId␠→␠true` | [director-249] The shot action checks total 0 | KILLED |
| M069 | `src/scenes/director.js:1912` | `.startProgress␠→␠.endProgress` | [director-249] The shot action checks total 0 | KILLED |
| M070 | `src/scenes/director.js:1922` | `active:␠false␠→␠active:␠true` | [director-244] The state queries handle absent | KILLED |
| M071 | `src/scenes/director.js:1934` | `count:␠0,␠bytes:␠0␠→␠count:␠1,␠bytes:␠1` | [director-244] The state queries handle absent | KILLED |
| M072 | `src/scenes/director.js:1944` | `stringifySceneDocument(this._project)␠→␠'{}'` | [director-250] The project export downloads and publishes its document | KILLED |
| M073 | `src/scenes/director.js:1947` | `return;␠→␠void␠0;` | [director-251] The export error stops before a download | KILLED |
| M074 | `src/scenes/director.js:1959` | `'Project␠exported'␠→␠'bad'` | [director-250] The project export downloads and publishes its document | KILLED |
| M075 | `src/scenes/director.js:1973` | `&#124;&#124;␠0␠→␠&#124;&#124;␠9` | [director-252] The first import sets generation one | KILLED |
| M076 | `src/scenes/director.js:1976` | `prepared␠&#124;&#124;␠␠→␠` | [director-254] The import uses selection | KILLED |
| M077 | `src/scenes/director.js:1978` | `this._destroyed␠&#124;&#124;␠␠→␠` | [director-253] The import guard checks destroyed | KILLED |
| M078 | `src/scenes/director.js:1978` | `generation␠!==␠this._importGeneration␠→␠false` | [director-253] The import loses its generation before playback stops | KILLED |
| M079 | `src/scenes/director.js:1984` | `expectedProject␠&&␠→␠true␠&&` | [director-254] The import uses default | KILLED |
| M080 | `src/scenes/director.js:1985` | `expectedProject␠!==␠JSON.stringify(this._project,␠null,␠2)␠→␠false` | [director-253] The import guard checks expected | KILLED |
| M081 | `src/scenes/director.js:1985` | `expectedProject␠!==␠JSON.stringify(this._project,␠null,␠2)␠→␠true` | [director-253] The unchanged expected project accepts the import | KILLED |
| M082 | `src/scenes/director.js:1990` | `&#124;&#124;␠[]␠→␠` | [director-252] The import accepts an absent work set | KILLED |
| M083 | `src/scenes/director.js:1991` | `this._destroyed␠&#124;&#124;␠␠→␠` | [director-253] The import guard checks late-destroyed | KILLED |
| M084 | `src/scenes/director.js:1991` | `generation␠!==␠this._importGeneration␠→␠false` | [director-253] The import guard checks late-generation | KILLED |
| M085 | `src/scenes/director.js:1993` | `signal?.aborted␠&#124;&#124;␠→␠false␠&#124;&#124;` | [director-253] The import guard checks late-signal | KILLED |
| M086 | `src/scenes/director.js:1994` | `expectedProject␠&&␠→␠true␠&&` | [director-254] The import uses default | KILLED |
| M087 | `src/scenes/director.js:1995` | `expectedProject␠!==␠JSON.stringify(this._project,␠null,␠2)␠→␠false` | [director-253] The import guard checks late-expected | KILLED |
| M088 | `src/scenes/director.js:2002` | `pack.source.adapter␠===␠BUNDLE_SOURCE␠→␠true` | [director-254] The import uses assets | KILLED |
| M089 | `src/scenes/director.js:2003` | `pack.source.path␠→␠'bad'` | [director-254] The import uses assets | KILLED |
| M090 | `src/scenes/director.js:2008` | `retainedPaths.has(path)␠→␠true` | [director-254] The import uses assets | KILLED |
| M091 | `src/scenes/director.js:2008` | `input.assets␠&#124;&#124;␠[]␠→␠[]` | [director-254] The import uses assets | KILLED |
| M092 | `src/scenes/director.js:2013` | `selection?.sceneId␠&#124;&#124;␠␠→␠` | [director-254] The import uses selection | KILLED |
| M093 | `src/scenes/director.js:2013` | `project.scenes[0]?.id␠&#124;&#124;␠␠→␠` | [director-254] The import uses default | KILLED |
| M094 | `src/scenes/director.js:2013` | `&#124;&#124;␠null␠→␠&#124;&#124;␠'bad'` | [director-254] The import uses empty | KILLED |
| M095 | `src/scenes/director.js:2015` | `selection?.shotId␠&#124;&#124;␠␠→␠` | [director-254] The import uses selection | KILLED |
| M096 | `src/scenes/director.js:2015` | `project.scenes[0]?.shots[0]?.id␠&#124;&#124;␠␠→␠` | [director-254] The import uses default | KILLED |
| M097 | `src/scenes/director.js:2015` | `&#124;&#124;␠null␠→␠&#124;&#124;␠'bad'` | [director-254] The import uses empty | KILLED |
| M098 | `src/scenes/director.js:2023` | `signal?.aborted␠&#124;&#124;␠→␠false␠&#124;&#124;` | [director-255] The import error handles signal | KILLED |
| M099 | `src/scenes/director.js:2024` | `this._destroyed␠&#124;&#124;␠→␠false␠&#124;&#124;` | [director-255] The import error handles destroyed | KILLED |
| M100 | `src/scenes/director.js:2025` | `generation␠!==␠this._importGeneration␠→␠false` | [director-255] The import error handles generation | KILLED |
| M101 | `src/scenes/director.js:2029` | `error␠instanceof␠SceneDocumentError␠→␠false` | [director-255] The import error handles document | KILLED |
| M102 | `src/scenes/director.js:2029` | `error␠instanceof␠SceneDocumentError␠→␠true` | [director-255] The import error handles read | KILLED |
| M103 | `src/scenes/director.js:2038` | `!this._lastRunJson␠→␠false` | [director-256] The metadata download checks an absent record | KILLED |
| M104 | `src/scenes/director.js:2041` | `this._lastRunJson␠→␠'{}'` | [director-256] The metadata download checks a record | KILLED |
| M105 | `src/scenes/director.js:2085` | `token?.cancelled␠→␠false` | [director-259] The layer cancellation stops before context mode | KILLED |
| M106 | `src/scenes/director.js:2092` | `token?.cancelled␠→␠false` | [director-259] The layer cancellation stops after context mode | KILLED |
| M107 | `src/scenes/director.js:2102` | `␠␠␠␠␠␠let␠settled;␠→␠␠␠␠␠␠␠if␠(id␠===␠'one')␠continue;↵␠␠␠␠␠␠let␠settled;` | [director-257] The layer one uses simple | KILLED |
| M108 | `src/scenes/director.js:2102` | `␠␠␠␠␠␠let␠settled;␠→␠␠␠␠␠␠␠if␠(id␠===␠'two')␠continue;↵␠␠␠␠␠␠let␠settled;` | [director-257] The layer two uses simple | KILLED |
| M109 | `src/scenes/director.js:2103` | `params␠&&␠␠→␠` | [director-257] The restore path handles disabled | KILLED |
| M110 | `src/scenes/director.js:2103` | `typeof␠this.dataManager.restoreLayerState␠===␠'function'␠→␠true` | [director-257] The layer one uses params | KILLED |
| M111 | `src/scenes/director.js:2107` | `signal␠?␠{␠signal␠}␠:␠{}␠→␠{}` | [director-257] The layer one uses restore | KILLED |
| M112 | `src/scenes/director.js:2107` | `signal␠?␠{␠signal␠}␠:␠{}␠→␠{␠signal␠}` | [director-257] The restore path handles an absent signal | KILLED |
| M113 | `src/scenes/director.js:2112` | `signal␠?␠{␠signal␠}␠:␠{}␠→␠{}` | [director-257] The layer one uses simple | KILLED |
| M114 | `src/scenes/director.js:2112` | `signal␠?␠{␠signal␠}␠:␠{}␠→␠{␠signal␠}` | [director-257] The layer one uses an absent signal | KILLED |
| M115 | `src/scenes/director.js:2116` | `token?.cancelled␠→␠false` | [director-259] The layer cancellation stops after a layer | KILLED |
| M116 | `src/scenes/director.js:2117` | `settled␠===␠false␠→␠false` | [director-258] The layer refusal handles on | KILLED |
| M117 | `src/scenes/director.js:2120` | `enabled␠?␠'on'␠:␠'off'␠→␠'off'` | [director-258] The layer refusal handles on | KILLED |
| M118 | `src/scenes/director.js:2120` | `enabled␠?␠'on'␠:␠'off'␠→␠'on'` | [director-258] The layer refusal handles off | KILLED |
| M119 | `src/scenes/director.js:2124` | `params␠&&␠␠→␠` | [director-257] The layer one uses simple | KILLED |
| M120 | `src/scenes/director.js:2124` | `typeof␠this.dataManager.restoreLayerState␠!==␠'function'␠→␠true` | [director-257] The layer one uses restore | KILLED |
| M121 | `src/scenes/director.js:2125` | `origin:␠'scene'␠→␠origin:␠'other'` | [director-257] The layer one uses params | KILLED |
| M122 | `src/scenes/director.js:2150` | `Array.isArray(scene?.releaseLayerIds)␠→␠true` | [director-260] The scene layer cleanup handles not-list | KILLED |
| M123 | `src/scenes/director.js:2154` | `for␠(const␠layerId␠of␠layerIds)␠{␠→␠for␠(const␠layerId␠of␠layerIds)␠{↵␠␠␠␠␠␠if␠(layerId␠===␠'one')␠continue;` | [director-260] The scene layer one handles success | KILLED |
| M124 | `src/scenes/director.js:2154` | `for␠(const␠layerId␠of␠layerIds)␠{␠→␠for␠(const␠layerId␠of␠layerIds)␠{↵␠␠␠␠␠␠if␠(layerId␠===␠'two')␠continue;` | [director-260] The scene layer two handles success | KILLED |
| M125 | `src/scenes/director.js:2155` | `token?.cancelled␠→␠false` | [director-260] The scene layer cleanup handles before | KILLED |
| M126 | `src/scenes/director.js:2157` | `false␠→␠true` | [director-260] The scene layer one handles success | KILLED |
| M127 | `src/scenes/director.js:2161` | `settled␠===␠false␠→␠false` | [director-260] The scene layer one handles refused | KILLED |
| M128 | `src/scenes/director.js:2180` | `error?.message␠&#124;&#124;␠'unknown␠error'␠→␠'unknown␠error'` | [director-260] The scene layer one handles error | KILLED |
| M129 | `src/scenes/director.js:2180` | `&#124;&#124;␠'unknown␠error'␠→␠&#124;&#124;␠'bad'` | [director-260] The scene layer one handles empty-error | KILLED |
| M130 | `src/scenes/director.js:2184` | `released␠&&␠␠→␠` | [director-260] The scene layer one handles refused | KILLED |
| M131 | `src/scenes/director.js:2184` | `!token?.cancelled␠→␠true` | [director-260] The last scene layer checks last-canceled | KILLED |
| M132 | `src/scenes/director.js:2210` | `&#124;&#124;␠{}␠→␠` | [director-261] The context method handles absent-state | KILLED |
| M133 | `src/scenes/director.js:2212` | `state.entering␠&#124;&#124;␠␠→␠` | [director-261] The context method handles a mode entry | KILLED |
| M134 | `src/scenes/director.js:2212` | `state.mode␠&#124;&#124;␠␠→␠` | [director-261] The context method handles mode | KILLED |
| M135 | `src/scenes/director.js:2216` | `result␠&&␠␠→␠` | [director-261] The context method handles absent-result | KILLED |
| M136 | `src/scenes/director.js:2216` | `result.ok␠===␠false␠→␠false` | [director-261] The context method handles refused | KILLED |
| M137 | `src/scenes/director.js:2219` | `result.error␠&#124;&#124;␠'unknown␠reason'␠→␠'unknown␠reason'` | [director-261] The context method handles refused | KILLED |
| M138 | `src/scenes/director.js:2219` | `&#124;&#124;␠'unknown␠reason'␠→␠&#124;&#124;␠'bad'` | [director-261] The context method handles refused-empty | KILLED |
| M139 | `src/scenes/director.js:2226` | `result.error␠&#124;&#124;␠null␠→␠null` | [director-261] The context method handles refused | KILLED |
| M140 | `src/scenes/director.js:2226` | `&#124;&#124;␠null␠→␠&#124;&#124;␠'bad'` | [director-261] The context method handles refused-empty | KILLED |
| M141 | `src/scenes/director.js:2247` | `!completed␠&&␠␠→␠` | [director-262] The authored camera handles complete | KILLED |
| M142 | `src/scenes/director.js:2247` | `!token.cancelled␠&&␠␠→␠` | [director-262] The authored camera handles canceled | KILLED |
| M143 | `src/scenes/director.js:2247` | `!this._destroyed␠→␠true` | [director-262] The authored camera handles destroyed | KILLED |
| M144 | `src/scenes/director.js:2244` | `{␠...move,␠durationSec␠}␠→␠{␠...move␠}` | [director-262] The authored camera handles complete | KILLED |
| M145 | `src/scenes/director.js:2260` | `!cameraState␠&#124;&#124;␠␠→␠` | [director-263] The camera flight handles absent | KILLED |
| M146 | `src/scenes/director.js:2260` | `token.cancelled␠→␠false` | [director-263] The camera flight handles canceled | KILLED |
| M147 | `src/scenes/director.js:2269` | `&#124;&#124;␠DEFAULT_SHOT_DURATION_SEC␠→␠&#124;&#124;␠9` | [director-263] The camera flight handles bad | KILLED |
| M148 | `src/scenes/director.js:2268` | `0.2␠→␠0` | [director-263] The camera flight handles negative | KILLED |
| M149 | `src/scenes/director.js:2291` | `cameraState.heading␠&#124;&#124;␠0␠→␠0` | [director-263] The camera flight handles pose | KILLED |
| M150 | `src/scenes/director.js:2291` | `&#124;&#124;␠0␠→␠&#124;&#124;␠1` | [director-263] The camera flight keeps zero heading | KILLED |
| M151 | `src/scenes/director.js:2292` | `cameraState.pitch␠??␠-35␠→␠-35` | [director-263] The camera flight handles pose | KILLED |
| M152 | `src/scenes/director.js:2292` | `??␠-35␠→␠&#124;&#124;␠-35` | [director-263] The camera flight handles zero | KILLED |
| M153 | `src/scenes/director.js:2292` | `??␠-35␠→␠??␠-10` | [director-263] The camera flight handles defaults | KILLED |
| M154 | `src/scenes/director.js:2293` | `cameraState.roll␠&#124;&#124;␠0␠→␠0` | [director-263] The camera flight handles pose | KILLED |
| M155 | `src/scenes/director.js:2293` | `&#124;&#124;␠0␠→␠&#124;&#124;␠1` | [director-263] The camera flight keeps zero roll | KILLED |
| M156 | `src/scenes/director.js:2302` | `duration␠+␠0.6␠→␠duration␠+␠1` | [director-264] The camera promise settles through timeout | KILLED |
| M157 | `src/scenes/director.js:2312` | `!state.enabled␠&#124;&#124;␠␠→␠` | [director-265] The hold owner one handles disabled | KILLED |
| M158 | `src/scenes/director.js:2312` | `typeof␠module?.getSceneShotMediaHold␠!==␠'function'␠→␠false` | [director-265] The hold owner one handles an absent method | KILLED |
| M159 | `src/scenes/director.js:2314` | `state.params?.beatId␠→␠'bad'` | [director-265] The hold owner one handles complete | KILLED |
| M160 | `src/scenes/director.js:2316` | `return␠initial␠→␠return␠true` | [director-265] The hold owner one handles an absent initial state | KILLED |
| M161 | `src/scenes/director.js:2321` | `20000␠→␠30000` | [director-265] The hold owner one handles a large bound | KILLED |
| M162 | `src/scenes/director.js:2322` | `Math.max(0,␠→␠Math.max(-10,` | [director-265] The media time bound does not become negative after a clock change | KILLED |
| M163 | `src/scenes/director.js:2322` | `Number(initial.maxWaitMs)␠&#124;&#124;␠0␠→␠0` | [director-265] The hold owner one handles timeout | KILLED |
| M164 | `src/scenes/director.js:2333` | `!token.cancelled␠&&␠␠→␠` | [director-265] The hold owner one handles canceled | KILLED |
| M165 | `src/scenes/director.js:2333` | `!token.signal?.aborted␠→␠true` | [director-265] The hold owner one handles aborted | KILLED |
| M166 | `src/scenes/director.js:2334` | `read()?.pending␠===␠true␠→␠false` | [director-265] The hold owner one handles a busy state | KILLED |
| M167 | `src/scenes/director.js:2336` | `Date.now()␠-␠began␠>=␠maxWaitMs␠→␠false` | [director-265] The hold owner one handles timeout | KILLED |
| M168 | `src/scenes/director.js:2342` | `70␠→␠71` | [director-265] The hold owner one handles a busy state | KILLED |
| M169 | `src/scenes/director.js:2348` | `this._clock.wait(ms,␠token)␠→␠this._clock.wait(0,␠token)` | [director-266] The clock method _sleep passes its arguments | KILLED |
| M170 | `src/scenes/director.js:2357` | `totalSec␠→␠0` | [director-266] The clock method _startProgressTicker passes its arguments | KILLED |
| M171 | `src/scenes/director.js:2362` | `token,␠seconds,␠from,␠to,␠sceneClock␠→␠token,␠0,␠from,␠to,␠sceneClock` | [director-266] The clock method _startShotProgress passes its arguments | KILLED |
| M172 | `src/scenes/director.js:2367` | `scene,␠shot,␠token␠→␠scene,␠shot,␠null` | [director-266] The clock method _startSceneClockTicker passes its arguments | KILLED |
| M173 | `src/scenes/director.js:2381` | `this._runAbort?.abort();␠→␠void␠0;` | [director-267] The scene finish handles panel | KILLED |
| M174 | `src/scenes/director.js:2385` | `this._previewRun␠→␠true` | [director-267] The scene finish handles panel | KILLED |
| M175 | `src/scenes/director.js:2391` | `this._running␠=␠false␠→␠this._running␠=␠true` | [director-267] The scene finish handles panel | KILLED |
| M176 | `src/scenes/director.js:2396` | `this._runToken?.cancelled␠&#124;&#124;␠false␠→␠false` | [director-267] The scene finish handles canceled | KILLED |
| M177 | `src/scenes/director.js:2396` | `&#124;&#124;␠false␠→␠&#124;&#124;␠true` | [director-267] The scene finish handles an absent token | KILLED |
| M178 | `src/scenes/director.js:2410` | `scene␠&&␠␠→␠` | [director-268] The final clock rejects a false scene with inherited shots | KILLED |
| M179 | `src/scenes/director.js:2410` | `shot␠→␠true` | [director-268] The final clock handles shot | KILLED |
| M180 | `src/scenes/director.js:2417` | `for␠(const␠resolve␠of␠this._runIdleResolvers)␠resolve();␠→␠for␠(const␠[index,␠resolve]␠of␠[...this._runIdleResolvers].entries())␠if␠(index␠!==␠0)␠resolve();` | [director-268] The final clock handles valid | KILLED |
| M181 | `src/scenes/director.js:2417` | `for␠(const␠resolve␠of␠this._runIdleResolvers)␠resolve();␠→␠for␠(const␠[index,␠resolve]␠of␠[...this._runIdleResolvers].entries())␠if␠(index␠!==␠1)␠resolve();` | [director-268] The final clock handles valid | KILLED |
| M182 | `src/scenes/director.js:2431` | `this._presentation.playbackActive␠=␠␠→␠this._presentation.wrong␠=␠` | [director-269] The presentation method _setPlaybackActive updates its state | KILLED |
| M183 | `src/scenes/director.js:2436` | `this._presentation.keyboardEnabled␠=␠␠→␠this._presentation.wrong␠=␠` | [director-269] The presentation method _setPlaybackKeyboardEnabled updates its state | KILLED |
| M184 | `src/scenes/director.js:2445` | `this._presentation.progress␠=␠␠→␠this._presentation.wrong␠=␠` | [director-269] The presentation method _setProgress updates its state | KILLED |
| M185 | `src/scenes/director.js:2454` | `this._presentation.status␠=␠␠→␠this._presentation.wrong␠=␠` | [director-269] The presentation method _updateStatus updates its state | KILLED |
| M186 | `src/scenes/director.js:2463` | `this._presentation.runtime␠=␠␠→␠this._presentation.wrong␠=␠` | [director-269] The presentation method _updateRuntime updates its state | KILLED |
| M187 | `src/scenes/director.js:2473` | `!this._activeRun␠→␠false` | [director-270] The event log handles idle | KILLED |
| M188 | `src/scenes/director.js:2474` | `payload␠&#124;&#124;␠null␠→␠null` | [director-270] The event log handles payload | KILLED |
| M189 | `src/scenes/director.js:2474` | `&#124;&#124;␠null␠→␠&#124;&#124;␠'bad'` | [director-270] The event log handles absent | KILLED |
| M190 | `src/scenes/director.js:2478` | `payload␠&#124;&#124;␠null␠→␠null` | [director-270] The event log handles payload | KILLED |
| M191 | `src/scenes/director.js:2478` | `&#124;&#124;␠null␠→␠&#124;&#124;␠'bad'` | [director-270] The event log handles absent | KILLED |
| M192 | `src/scenes/director.js:2001` | `scene.dataPacks␠&#124;&#124;␠[]␠→␠[]` | [director-254] The import uses assets | KILLED |
| M193 | `src/scenes/director.js:2001` | `&#124;&#124;␠[]␠→␠` | [director-254] The import uses absent-packs | KILLED |
| M194 | `src/scenes/director.js:2008` | `&#124;&#124;␠[]␠→␠` | [director-254] The import uses absent-assets | KILLED |
| M195 | `src/scenes/director.js:2212` | `&#124;&#124;␠null␠→␠` | Known limit `context-null-value` | SURVIVED; equivalent |
| M196 | `src/scenes/director.js:2322` | `&#124;&#124;␠0␠→␠` | [director-265] The hold owner one handles a zero bound | KILLED |
| M197 | `src/scenes/director.js:2310` | `.flatMap(([id,␠state])␠=>␠{␠→␠.flatMap(([id,␠state])␠=>␠{↵␠␠␠␠␠␠if␠(id␠===␠'one')␠return␠[];` | [director-265] The hold owner one handles a busy state | KILLED |
| M198 | `src/scenes/director.js:2310` | `.flatMap(([id,␠state])␠=>␠{␠→␠.flatMap(([id,␠state])␠=>␠{↵␠␠␠␠␠␠if␠(id␠===␠'two')␠return␠[];` | [director-265] The hold owner two handles a busy state | KILLED |
| M199 | `src/scenes/director.js:1940` | `replace(/[:.]/g,␠'-')␠→␠replace(/[:.]/g,␠':')` | [director-250] The project export downloads and publishes its document | KILLED |
| M200 | `src/scenes/director.js:2039` | `replace(/[:.]/g,␠'-')␠→␠replace(/[:.]/g,␠':')` | [director-256] The metadata download checks a record | KILLED |
| M201 | `src/scenes/director.js:2272` | `cameraState.lon␠→␠0` | [director-263] The camera flight handles pose | KILLED |
| M202 | `src/scenes/director.js:2273` | `cameraState.lat␠→␠0` | [director-263] The camera flight handles pose | KILLED |
| M203 | `src/scenes/director.js:2274` | `cameraState.alt␠→␠0` | [director-263] The camera flight handles pose | KILLED |
| M204 | `src/scenes/director.js:2296` | `Cesium.EasingFunction.CUBIC_IN_OUT␠→␠Cesium.EasingFunction.LINEAR_NONE` | [director-263] The camera flight handles pose | KILLED |
| M205 | `src/scenes/director.js:2277` | `await␠new␠Promise␠→␠new␠Promise` | [director-264] The camera promise settles through complete | KILLED |
| M206 | `src/scenes/director.js:2282` | `if␠(done)␠return;␠→␠void␠0;` | [director-264] The camera promise settles through double | KILLED |
| M207 | `src/scenes/director.js:2329` | `token);␠→␠null);` | [director-265] The hold owner one handles disabled | KILLED |
| M208 | `src/scenes/director.js:1742` | `signal:␠this._runAbort.signal␠→␠signal:␠undefined` | [director-235] The scene passes its live signal to the layer manager | KILLED |
| M209 | `src/scenes/director.js:2399` | `this._activeRun␠=␠null␠→␠void␠0` | [director-267] The scene finish handles panel | KILLED |
| M210 | `src/scenes/director.js:2418` | `this._runIdleResolvers.clear();␠→␠void␠0;` | [director-268] The final clock handles valid | KILLED |
| M211 | `src/scenes/director.js:2476` | `t:␠new␠Date().toISOString(),␠→␠t:␠'bad',` | [director-270] The event log handles payload | KILLED |
| M212 | `src/scenes/director.js:1697` | `index␠<␠0␠→␠false` | [director-232] The queue rejects unknown | KILLED |
| M213 | `src/scenes/director.js:1691` | `{␠single␠}␠→␠{␠single:␠false␠}` | [director-236] The scene option uses single | KILLED |
| M214 | `src/scenes/director.js:1815` | `next.scene.id,␠next.shot.id␠→␠'bad',␠'bad'` | [director-240] The next shot handles wrap | KILLED |
| M215 | `src/scenes/director.js:1815` | `next.scene.id,␠next.shot.id␠→␠'bad',␠'bad'` | [director-240] The next shot handles unknown | KILLED |
| M216 | `src/scenes/director.js:1815` | `next.scene.id,␠next.shot.id␠→␠'bad',␠'bad'` | [director-240] The next shot handles absent | KILLED |
| M217 | `src/scenes/director.js:1815` | `next.scene.id,␠next.shot.id␠→␠'bad',␠'bad'` | [director-240] The next shot handles first | KILLED |
| M218 | `src/scenes/director.js:1835` | `this._sceneSeekGeneration++␠→␠void␠0` | [director-242] The scene stop handles default | KILLED |
| M219 | `src/scenes/director.js:1853` | `(await␠this._dataPacks?.apply(scene,␠shot,␠token))␠??␠true␠→␠true` | [director-243] The pack method handles false | KILLED |
| M220 | `src/scenes/director.js:1853` | `??␠true␠→␠??␠false` | [director-243] The pack method handles absent | KILLED |
| M221 | `src/scenes/director.js:1862` | `this._dataPacks?.getState()␠→␠null` | [director-244] The state queries handle owners | KILLED |
| M222 | `src/scenes/director.js:1862` | `&#124;&#124;␠{␠status:␠'idle',␠count:␠0␠}␠→␠&#124;&#124;␠{␠status:␠'bad',␠count:␠1␠}` | [director-244] The state queries handle null | KILLED |
| M223 | `src/scenes/director.js:1868` | `this._interactions?.activate␠→␠this._interactions.activate` | [director-245] The action activation handles absent | KILLED |
| M224 | `src/scenes/director.js:1881` | `!scene␠&#124;&#124;␠!shot␠→␠false` | [director-246] The action guard checks scene | KILLED |
| M225 | `src/scenes/director.js:1881` | `!shot␠→␠false` | [director-246] The action guard checks shot | KILLED |
| M226 | `src/scenes/director.js:1915` | `return␠false␠→␠return␠true` | [director-246] The action guard checks type | KILLED |
| M227 | `src/scenes/director.js:1907` | `this._interactionTransitions++␠→␠void␠0` | [director-249] The shot action checks total 63 | KILLED |
| M228 | `src/scenes/director.js:2013` | `project.scenes[0]?.id␠&#124;&#124;␠␠→␠` | [director-252] The file import waits for old work before replacement | KILLED |
| M229 | `src/scenes/director.js:1977` | `signal?.aborted␠→␠false` | [director-253] The import guard checks signal | KILLED |
| M230 | `src/scenes/director.js:1991` | `generation␠!==␠this._importGeneration␠→␠false` | [director-253] The import guard checks generation | KILLED |
| M231 | `src/scenes/director.js:2015` | `&#124;&#124;␠null␠→␠&#124;&#124;␠'bad'` | [director-254] The import uses absent shots | KILLED |
| M232 | `src/scenes/director.js:2125` | `origin:␠'scene'␠→␠origin:␠'other'` | [director-257] The layer two uses params | KILLED |
| M233 | `src/scenes/director.js:2103` | `typeof␠this.dataManager.restoreLayerState␠===␠'function'␠→␠false` | [director-257] The layer two uses restore | KILLED |
| M234 | `src/scenes/director.js:2112` | `signal␠?␠{␠signal␠}␠:␠{}␠→␠{␠signal␠}` | [director-257] The layer two uses an absent signal | KILLED |
| M235 | `src/scenes/director.js:2120` | `enabled␠?␠'on'␠:␠'off'␠→␠'off'` | [director-258] The layer refusal handles restore | KILLED |
| M236 | `src/scenes/director.js:2120` | `enabled␠?␠'on'␠:␠'off'␠→␠'off'` | [director-258] The layer refusal handles null | KILLED |
| M237 | `src/scenes/director.js:2161` | `settled␠===␠false␠→␠false` | [director-260] The scene layer two handles refused | KILLED |
| M238 | `src/scenes/director.js:2180` | `error?.message␠&#124;&#124;␠'unknown␠error'␠→␠'unknown␠error'` | [director-260] The scene layer two handles error | KILLED |
| M239 | `src/scenes/director.js:2180` | `&#124;&#124;␠'unknown␠error'␠→␠&#124;&#124;␠'bad'` | [director-260] The scene layer two handles empty-error | KILLED |
| M240 | `src/scenes/director.js:2184` | `!token?.cancelled␠→␠false` | [director-260] The scene layer cleanup handles absent | KILLED |
| M241 | `src/scenes/director.js:2184` | `!token?.cancelled␠→␠false` | [director-260] The scene layer cleanup handles empty | KILLED |
| M242 | `src/scenes/director.js:2155` | `token?.cancelled␠→␠false` | [director-260] The scene layer cleanup handles after | KILLED |
| M243 | `src/scenes/director.js:2213` | `return␠false␠→␠return␠true` | [director-261] The context method handles another mode | KILLED |
| M244 | `src/scenes/director.js:2207` | `return␠false␠→␠return␠true` | [director-261] The context method handles absent-get | KILLED |
| M245 | `src/scenes/director.js:2208` | `return␠false␠→␠return␠true` | [director-261] The context method handles absent-set | KILLED |
| M246 | `src/scenes/director.js:2207` | `return␠false␠→␠return␠true` | [director-261] The context method handles an absent style manager | KILLED |
| M247 | `src/scenes/director.js:2247` | `!completed␠&&␠→␠false␠&&` | [director-262] The authored camera handles interrupted | KILLED |
| M248 | `src/scenes/director.js:2239` | `resolveCameraPose(scene,␠shot.camera)␠→␠{}` | [director-262] The authored camera handles ordinary | KILLED |
| M249 | `src/scenes/director.js:2265` | `this.styleManager?.clearSearchedLocation␠→␠this.styleManager.clearSearchedLocation` | [director-263] The camera flight handles an absent style manager | KILLED |
| M250 | `src/scenes/director.js:2277` | `await␠new␠Promise␠→␠new␠Promise` | [director-264] The camera promise settles through cancel | KILLED |
| M251 | `src/scenes/director.js:2329` | `*␠1000␠→␠*␠1` | [director-265] The hold owner one handles an absent manager | KILLED |
| M252 | `src/scenes/director.js:2329` | `*␠1000␠→␠*␠1` | [director-265] The hold owner one handles an absent layer map | KILLED |
| M253 | `src/scenes/director.js:2329` | `*␠1000␠→␠*␠1` | [director-265] The hold owner one handles an absent module | KILLED |
| M254 | `src/scenes/director.js:2339` | `Scene␠media␠did␠not␠finish␠within␠its␠bounded␠playback␠window␠→␠Changed␠media␠time␠window` | [director-265] The hold owner one handles a negative bound | KILLED |
| M255 | `src/scenes/director.js:2310` | `.flatMap(([id,␠state])␠=>␠{␠→␠.flatMap(([id,␠state])␠=>␠{↵␠␠␠␠␠␠if␠(id␠===␠'two')␠return␠[];` | [director-265] The hold owner two handles complete | KILLED |
| M256 | `src/scenes/director.js:2339` | `Scene␠media␠did␠not␠finish␠within␠its␠bounded␠playback␠window␠→␠Changed␠media␠time␠window` | [director-265] The hold owner two handles timeout | KILLED |
| M257 | `src/scenes/director.js:2333` | `!token.cancelled␠&&␠␠→␠` | [director-265] The hold owner two handles canceled | KILLED |
| M258 | `src/scenes/director.js:2333` | `!token.signal?.aborted␠→␠true` | [director-265] The hold owner two handles aborted | KILLED |
| M259 | `src/scenes/director.js:2312` | `!state.enabled␠&#124;&#124;␠␠→␠` | [director-265] The hold owner two handles disabled | KILLED |
| M260 | `src/scenes/director.js:2312` | `typeof␠module?.getSceneShotMediaHold␠!==␠'function'␠→␠false` | [director-265] The hold owner two handles an absent method | KILLED |
| M261 | `src/scenes/director.js:2316` | `return␠initial␠→␠return␠true` | [director-265] The hold owner two handles an absent initial state | KILLED |
| M262 | `src/scenes/director.js:2329` | `*␠1000␠→␠*␠1` | [director-265] The hold owner two handles an absent manager | KILLED |
| M263 | `src/scenes/director.js:2329` | `*␠1000␠→␠*␠1` | [director-265] The hold owner two handles an absent layer map | KILLED |
| M264 | `src/scenes/director.js:2329` | `*␠1000␠→␠*␠1` | [director-265] The hold owner two handles an absent module | KILLED |
| M265 | `src/scenes/director.js:2339` | `Scene␠media␠did␠not␠finish␠within␠its␠bounded␠playback␠window␠→␠Changed␠media␠time␠window` | [director-265] The hold owner two handles a zero bound | KILLED |
| M266 | `src/scenes/director.js:2339` | `Scene␠media␠did␠not␠finish␠within␠its␠bounded␠playback␠window␠→␠Changed␠media␠time␠window` | [director-265] The hold owner two handles a negative bound | KILLED |
| M267 | `src/scenes/director.js:2339` | `Scene␠media␠did␠not␠finish␠within␠its␠bounded␠playback␠window␠→␠Changed␠media␠time␠window` | [director-265] The hold owner two handles a large bound | KILLED |
| M268 | `src/scenes/director.js:2391` | `this._running␠=␠false␠→␠this._running␠=␠true` | [director-267] The scene finish handles preview | KILLED |
| M269 | `src/scenes/director.js:2391` | `this._running␠=␠false␠→␠this._running␠=␠true` | [director-267] The scene finish handles absent metadata | KILLED |
| M270 | `src/scenes/director.js:2391` | `this._running␠=␠false␠→␠this._running␠=␠true` | [director-267] The scene finish handles an absent abort owner | KILLED |
| M271 | `src/scenes/director.js:2417` | `for␠(const␠resolve␠of␠this._runIdleResolvers)␠resolve();␠→␠for␠(const␠[index,␠resolve]␠of␠[...this._runIdleResolvers].entries())␠if␠(index␠!==␠0)␠resolve();` | [director-268] The final clock handles scene | KILLED |
| M272 | `src/scenes/director.js:2417` | `for␠(const␠resolve␠of␠this._runIdleResolvers)␠resolve();␠→␠for␠(const␠[index,␠resolve]␠of␠[...this._runIdleResolvers].entries())␠if␠(index␠!==␠0)␠resolve();` | [director-268] The final clock handles absent shots | KILLED |
| M273 | `src/scenes/director.js:2417` | `for␠(const␠resolve␠of␠this._runIdleResolvers)␠resolve();␠→␠for␠(const␠[index,␠resolve]␠of␠[...this._runIdleResolvers].entries())␠if␠(index␠!==␠0)␠resolve();` | [director-268] The final clock handles absent | KILLED |
| M274 | `src/scenes/director.js:2427` | `running:␠isRunning␠→␠running:␠false` | [director-269] The button helper publishes the supplied value | KILLED |
| M275 | `src/scenes/director.js:2006` | `this._bundleAssets?.replace␠→␠this._bundleAssets.replace` | [director-254] The import accepts an absent asset owner | KILLED |
| M276 | `src/scenes/director.js:2184` | `!token?.cancelled␠→␠false` | [director-260] The last scene layer checks empty | KILLED |
| M277 | `src/scenes/director.js:2314` | `state.params?.beatId␠→␠'bad'` | [director-265] The hold owner accepts an absent beat and signal | KILLED |
| M278 | `src/scenes/director.js:1855` | `!token?.cancelled␠→␠false` | [director-243] The pack error accepts an absent token | KILLED |
| M279 | `src/scenes/director.js:2334` | `read()?.pending␠→␠read().pending` | [director-265] The hold ends when its owner returns an absent state | KILLED |
| M280 | `src/scenes/director.js:1701` | `!queue.length␠→␠false` | [director-232] The empty project rejects a scene request | KILLED |
| M281 | `src/scenes/director.js:1804` | `!queue.length␠→␠false` | [director-241] The empty project cannot advance a shot | KILLED |
| M282 | `src/scenes/director.js:1973` | `+␠1␠→␠+␠2` | [director-252] The second import sets generation two | KILLED |
| M283 | `src/scenes/director.js:1835` | `this._sceneSeekGeneration++␠→␠void␠0` | [director-242] The scene stop accepts an absent abort owner | KILLED |
| M284 | `src/scenes/director.js:2269` | `Number(durationSec)␠→␠0` | [director-263] The camera flight accepts an absent location method | KILLED |
| M285 | `src/scenes/director.js:1730` | `this._running␠=␠true␠→␠this._running␠=␠false` | [director-235] The scene accepts absent pack and action owners | KILLED |
| M286 | `src/scenes/director.js:1835` | `this._sceneSeekGeneration++␠→␠void␠0` | [director-242] The scene stop accepts absent pack and action owners | KILLED |
| M287 | `src/scenes/director.js:2184` | `!token?.cancelled␠→␠false` | [director-260] The scene layer method accepts absent pack and action owners | KILLED |
| M288 | `src/scenes/director.js:2454` | `this._presentation.status␠=␠␠→␠this._presentation.wrong␠=␠` | [director-269] The status helper publishes its state to a subscriber | KILLED |
| M289 | `src/scenes/director.js:1802` | `␠&#124;&#124;␠this._project.scenes[0]?.id␠→␠` | [director-240] The next shot handles first | KILLED |
