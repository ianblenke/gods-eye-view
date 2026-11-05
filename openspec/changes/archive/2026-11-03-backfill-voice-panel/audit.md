# The voice panel audit

Source commit: `74ec10e054a88935c7fcfce96300ea660f7c7747`.
The review corrections change this worktree.

Each test name comes from a complete failure event.
The [event data](mutation-events.jsonl) records each failure and final summary.
The [mutation data](mutation-results.json) records each exact edit and name filter.

| ID | Source | Class | Mutations | Test |
| --- | --- | --- | --- | --- |
| A001 | src/voice/panel/actionObserver.js:43 | TESTED | K-loop-retire | [voice-panel-008] The observer retires each key with the default reason |
| A002 | src/voice/panel/actionObserver.js:44 | TESTED | A002-yes, A002-no | [voice-panel-008] The owner supplies a string retirement reason for each action |
| A003 | src/voice/panel/actionObserver.js:63 | TESTED | A003-yes, A003-no | [voice-panel-005 voice-panel-011] The progress wrapper copies descriptors and filters metadata |
| A004 | src/voice/panel/actionObserver.js:71 | TESTED | A004-yes, A004-no | [voice-panel-006] The custom options stay unchanged in case 0 |
| A005 | src/voice/panel/actionObserver.js:73 | TESTED | A005-yes, A005-no | [voice-panel-002] sync value/throw, receiver, arguments and opaque unsupported result stay exact |
| A006 | src/voice/panel/actionObserver.js:81 | TESTED | A006-left, A006-right | [voice-panel-006] accessor/custom options are forwarded untouched without extra getter/currentness probes |
| A007 | src/voice/panel/actionObserver.js:81 | TESTED | A007-left, A007-right, K-option-descriptors | [voice-panel-009] The absent options keep their value in case 0 |
| A008 | src/voice/panel/actionObserver.js:81 | TESTED | A008-left, A008-right | [voice-panel-009] The absent options keep their value in case 0 |
| A009 | src/voice/panel/actionObserver.js:81 | TESTED | A009-left, A009-right | [voice-panel-009] The absent options keep their value in case 1 |
| A010 | src/voice/panel/actionObserver.js:83 | TESTED | A010-left, A010-right | [voice-panel-010] observer faults and private metadata faults cannot replace original callback errors |
| A011 | src/voice/panel/actionObserver.js:85 | TESTED | A011-left, A011-right | [voice-panel-010] observer faults and private metadata faults cannot replace original callback errors |
| A012 | src/voice/panel/actionObserver.js:92 | TESTED | A012-left, A012-right | [voice-panel-005 voice-panel-011] The progress wrapper copies descriptors and filters metadata |
| A013 | src/voice/panel/actionObserver.js:95 | TESTED | A013-yes, A013-no | [voice-panel-005 voice-panel-011] The progress wrapper copies descriptors and filters metadata |
| A014 | src/voice/panel/actionObserver.js:97 | TESTED | A014-yes, A014-no | [voice-panel-010] observer faults and private metadata faults cannot replace original callback errors |
| A015 | src/voice/panel/actionObserver.js:104 | TESTED | A015-left, A015-right | [voice-panel-005] actual pinned-main common session: private invocation stream is separate from public events |
| A016 | src/voice/panel/actionObserver.js:108 | TESTED | A016-left, A016-right | [voice-panel-005 voice-panel-011] The progress wrapper copies descriptors and filters metadata |
| A017 | src/voice/panel/actionObserver.js:114 | TESTED | A017-yes, A017-no | [voice-panel-005 voice-panel-011] The progress wrapper copies descriptors and filters metadata |
| A018 | src/voice/panel/actionObserver.js:160 | TESTED | A018-left, A018-right | [voice-panel-002] The action return kind stays exact in case 0 |
| A019 | src/voice/panel/host.js:35 | TESTED | A019-left, A019-right | [voice-panel-052] The host rejects an incomplete mount in case 0 |
| A020 | src/voice/panel/host.js:35 | TESTED | A020-left, A020-right | [voice-panel-052] The host rejects an incomplete mount in case 0 |
| A021 | src/voice/panel/host.js:35 | TESTED | A021-left, A021-right | [voice-panel-052] The host rejects an incomplete mount in case 4 |
| A022 | src/voice/panel/host.js:50 | TESTED | A022-left, A022-right | [voice-panel-054 voice-panel-058] A disposed session cannot rearm through native text |
| A023 | src/voice/panel/host.js:58 | TESTED | A023-left, A023-right | [voice-panel-058] A retired mount cannot change the current panel |
| A024 | src/voice/panel/host.js:58 | TESTED | A024-left, A024-right | [voice-panel-058] A teardown callback cannot use the retired operation |
| A025 | src/voice/panel/host.js:58 | TESTED | A025-left, A025-right | [voice-panel-058] A teardown callback cannot use the retired operation |
| A026 | src/voice/panel/host.js:72 | TESTED | A026-yes, A026-no | [voice-panel-068] The host reports inactivity support in case 0 |
| A027 | src/voice/panel/host.js:72 | TESTED | A027-left, A027-right | [voice-panel-068] The host reports inactivity support in case 0 |
| A028 | src/voice/panel/host.js:79 | TESTED | A028-left, A028-right | [voice-panel-054] The native input edge rearms automatic preview once |
| A029 | src/voice/panel/host.js:92 | TESTED | A029-left, A029-right | [voice-panel-050] The stop ticket checks the current state in case 0 |
| A030 | src/voice/panel/host.js:92 | TESTED | A030-left, A030-right | [voice-panel-050] A stop ticket cannot close a disposed session panel |
| A031 | src/voice/panel/host.js:106 | TESTED | A031-left, A031-right | [voice-panel-053] The operation keeps its epoch after its own preference write |
| A032 | src/voice/panel/host.js:106 | TESTED | A032-left, A032-right | [voice-panel-058] A retired mount cannot change the current panel |
| A033 | src/voice/panel/host.js:116 | EQUIVALENT | A033-left, A033-right | The operation cannot coerce a custom numeric object |
| A034 | src/voice/panel/host.js:138 | TESTED | A034-yes, A034-no | [voice-panel-053] The operation rejects invalid minutes in case 2 |
| A035 | src/voice/panel/host.js:143 | TESTED | A035-yes, A035-no | [voice-panel-053] The operation keeps its epoch after its own preference write |
| A036 | src/voice/panel/host.js:150 | TESTED | A036-left, A036-right | [voice-panel-069] An inactive state event reaches the card |
| A037 | src/voice/panel/host.js:152 | TESTED | A037-left, A037-right, K-final-state-0, K-final-state-1, K-final-state-2 | [voice-panel-054] A state field on another event cannot disable automatic preview |
| A038 | src/voice/panel/host.js:159 | TESTED | A038-left, A038-right | [voice-panel-057] The advisory interruption keeps the card and manual choice |
| A039 | src/voice/panel/host.js:159 | TESTED | A039-left, A039-right | [voice-panel-054] A reason on another event cannot rearm automatic preview |
| A040 | src/voice/panel/host.js:165 | TESTED | A040-left, A040-right | [voice-panel-054] The host rejects automatic preview input in case 0 |
| A041 | src/voice/panel/host.js:165 | TESTED | A041-left, A041-right | [voice-panel-054] The host rejects automatic preview input in case 2 |
| A042 | src/voice/panel/host.js:169 | TESTED | A042-left, A042-right | [voice-panel-055] The host compares reply identifiers in case 0 |
| A043 | src/voice/panel/host.js:169 | TESTED | A043-left, A043-right | [voice-panel-055] The host compares reply identifiers in case 0 |
| A044 | src/voice/panel/host.js:171 | TESTED | A044-left, A044-right | [voice-panel-054] The input reason controls automatic preview in case 0 |
| A045 | src/voice/panel/host.js:171 | TESTED | A045-left, A045-right | [voice-panel-054] The input reason controls automatic preview in case 0 |
| A046 | src/voice/panel/host.js:172 | TESTED | A046-yes, A046-no | [voice-panel-055] The host compares reply identifiers in case 0 |
| A047 | src/voice/panel/host.js:173 | TESTED | A047-left, A047-right | [voice-panel-055] The host compares reply identifiers in case 0 |
| A048 | src/voice/panel/host.js:173 | TESTED | A048-left, A048-right | [voice-panel-055] A new final text or a different id reaches the card |
| A049 | src/voice/panel/host.js:174 | TESTED | A049-left, A049-right | [voice-panel-055] The same text with a new id reaches the card |
| A050 | src/voice/panel/host.js:179 | TESTED | A050-left, A050-right | [voice-panel-054] The input reason controls automatic preview in case 0 |
| A051 | src/voice/panel/host.js:179 | TESTED | A051-left, A051-right | [voice-panel-054] The input reason controls automatic preview in case 0 |
| A052 | src/voice/panel/host.js:187 | TESTED | A052-left, A052-right | [voice-panel-069] The advisory flag on another event does not hide it from the card |
| A053 | src/voice/panel/host.js:190 | TESTED | A053-left, A053-right | [voice-panel-053] The session boundary cancels an operation in case 0 |
| A054 | src/voice/panel/host.js:191 | TESTED | A054-left, A054-right, K-boundary-state-0, K-boundary-state-1, K-boundary-state-2 | [voice-panel-054] A state field on another event cannot disable automatic preview |
| A055 | src/voice/panel/inactivity.js:12 | TESTED | A055-left, A055-right | [voice-panel-032] The timer rejects invalid initial minutes in case 0 |
| A056 | src/voice/panel/inactivity.js:12 | TESTED | A056-left, A056-right | [voice-panel-032] The timer rejects invalid initial minutes in case 2 |
| A057 | src/voice/panel/inactivity.js:26 | TESTED | A057-left, A057-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A058 | src/voice/panel/inactivity.js:26 | TESTED | A058-left, A058-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A059 | src/voice/panel/inactivity.js:26 | TESTED | A059-left, A059-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A060 | src/voice/panel/inactivity.js:26 | TESTED | A060-left, A060-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A061 | src/voice/panel/inactivity.js:26 | TESTED | A061-left, A061-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A062 | src/voice/panel/inactivity.js:26 | TESTED | A062-left, A062-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A063 | src/voice/panel/inactivity.js:37 | TESTED | A063-left, A063-right | [voice-panel-032 voice-panel-065] The timer accepts both minute bounds |
| A064 | src/voice/panel/inactivity.js:41 | TESTED | A064-left, A064-right | [voice-panel-034] An old timer cannot expire after a quiet successor starts |
| A065 | src/voice/panel/inactivity.js:51 | TESTED | A065-left, A065-right | [voice-panel-030 voice-panel-033] The idle timer checks one blocker in case 0 |
| A066 | src/voice/panel/inactivity.js:55 | TESTED | A066-left, A066-right | [voice-panel-032] The timer rejects invalid initial minutes in case 0 |
| A067 | src/voice/panel/inactivity.js:55 | TESTED | A067-left, A067-right | [voice-panel-032] The timer rejects invalid initial minutes in case 2 |
| A068 | src/voice/panel/manualPanel.js:12 | TESTED | A068-left, A068-right | [voice-panel-019] A valid reader cannot replace an absent panel in case 0 |
| A069 | src/voice/panel/manualPanel.js:17 | TESTED | A069-left, A069-right | [voice-panel-019] A valid disabled message cannot replace an invalid empty message |
| A070 | src/voice/panel/manualPanel.js:29 | TESTED | A070-left, A070-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 2 |
| A071 | src/voice/panel/manualPanel.js:32 | TESTED | A071-left, A071-right | [voice-panel-020] The panel accepts absent optional controls |
| A072 | src/voice/panel/manualPanel.js:32 | TESTED | A072-left, A072-right | [voice-panel-020] The panel accepts absent optional controls |
| A073 | src/voice/panel/manualPanel.js:32 | TESTED | A073-left, A073-right | [voice-panel-020] The panel accepts absent optional controls |
| A074 | src/voice/panel/manualPanel.js:42 | TESTED | A074-left, A074-right | [voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged |
| A075 | src/voice/panel/manualPanel.js:43 | TESTED | A075-left, A075-right | [voice-panel-017] The owner destroys an open panel in case 1 |
| A076 | src/voice/panel/manualPanel.js:43 | TESTED | A076-left, A076-right | [voice-panel-013] A closed view hides both panes in case 1 |
| A077 | src/voice/panel/manualPanel.js:46 | TESTED | A077-left, A077-right | [voice-panel-016] The preview reader accepts only true in case 0 |
| A078 | src/voice/panel/manualPanel.js:46 | TESTED | A078-left, A078-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A079 | src/voice/panel/manualPanel.js:46 | TESTED | A079-left, A079-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A080 | src/voice/panel/manualPanel.js:46 | TESTED | A080-left, A080-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A081 | src/voice/panel/manualPanel.js:46 | TESTED | A081-left, A081-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A082 | src/voice/panel/manualPanel.js:55 | TESTED | A082-left, A082-right | [voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged |
| A083 | src/voice/panel/manualPanel.js:56 | TESTED | A083-left, A083-right | [voice-panel-015] A visible sync and a close keep unrelated focus unchanged |
| A084 | src/voice/panel/manualPanel.js:60 | TESTED | A084-left, A084-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A085 | src/voice/panel/manualPanel.js:60 | TESTED | A085-left, A085-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A086 | src/voice/panel/manualPanel.js:62 | TESTED | A086-left, A086-right | [voice-panel-017] The owner destroys an open panel in case 1 |
| A087 | src/voice/panel/manualPanel.js:65 | TESTED | A087-left, A087-right | [voice-panel-017] The owner destroys an open panel in case 1 |
| A088 | src/voice/panel/manualPanel.js:69 | TESTED | A088-yes, A088-no | [voice-panel-014] The tab key selects its target in case 0 |
| A089 | src/voice/panel/manualPanel.js:71 | TESTED | A089-yes, A089-no | [voice-panel-014] The tab key selects its target in case 0 |
| A090 | src/voice/panel/manualPanel.js:73 | TESTED | A090-left, A090-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A091 | src/voice/panel/manualPanel.js:73 | TESTED | A091-left, A091-right | [voice-panel-020] The preview snapshot checks each visibility condition in case 0 |
| A092 | src/voice/panel/manualPanel.js:75 | TESTED | A092-left, A092-right | [voice-panel-020] An absent card keeps the empty preview visible |
| A093 | src/voice/panel/manualPanel.js:76 | TESTED | A093-yes, A093-no | [voice-panel-020] An absent card keeps the empty preview visible |
| A094 | src/voice/panel/manualPanel.js:92 | TESTED | A094-left, A094-right | [voice-panel-020] The panel accepts absent optional controls |
| A095 | src/voice/panel/manualPanel.js:94 | TESTED | A095-yes, A095-no | [voice-panel-015] A view change transfers focus from the old pane in case 0 |
| A096 | src/voice/panel/manualPanel.js:95 | TESTED | A096-left, A096-right | [voice-panel-015] A view change transfers focus from the old pane in case 0 |
| A097 | src/voice/panel/manualPanel.js:100 | TESTED | A097-yes, A097-no | [voice-panel-015] A view change transfers focus from the old pane in case 1 |
| A098 | src/voice/panel/manualPanel.js:101 | TESTED | A098-left, A098-right | [voice-panel-015] A view change transfers focus from the old pane in case 0 |
| A099 | src/voice/panel/manualPanel.js:101 | TESTED | A099-left, A099-right | [voice-panel-015] A view change transfers focus from the old pane in case 0 |
| A100 | src/voice/panel/manualPanel.js:101 | TESTED | A100-left, A100-right | [voice-panel-020] An absent visibility method does not prevent focus |
| A101 | src/voice/panel/manualPanel.js:107 | TESTED | A101-left, A101-right | [voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged |
| A102 | src/voice/panel/manualPanel.js:109 | TESTED | A102-left, A102-right | [voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged |
| A103 | src/voice/panel/manualPanel.js:120 | TESTED | A103-yes, A103-no | [voice-panel-013] The settings button toggles a closed settings view and replaces Preview |
| A104 | src/voice/panel/manualPanel.js:120 | TESTED | A104-left, A104-right | [voice-panel-013] The settings button toggles a closed settings view and replaces Preview |
| A105 | src/voice/panel/manualPanel.js:127 | TESTED | A105-yes, A105-no | [voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged |
| A106 | src/voice/panel/manualPanel.js:131 | TESTED | A106-yes, A106-no | [voice-panel-014] The tab key selects its target in case 0 |
| A107 | src/voice/panel/manualPanel.js:133 | TESTED | A107-yes, A107-no | [voice-panel-014] The tab key selects its target in case 1 |
| A108 | src/voice/panel/manualPanel.js:135 | TESTED | A108-yes, A108-no | [voice-panel-014] The tab key selects its target in case 2 |
| A109 | src/voice/panel/manualPanel.js:140 | TESTED | A109-yes, A109-no | [voice-panel-014] The tab key selects its target in case 0 |
| A110 | src/voice/panel/manualPanel.js:145 | TESTED | A110-left, A110-right | [voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged |
| A111 | src/voice/panel/nativeActivity.js:9 | TESTED | A111-left, A111-right | [voice-panel-043] The native work field decides activity in case 0 |
| A112 | src/voice/panel/nativeActivity.js:11 | TESTED | A112-yes, A112-no | [voice-panel-043] The native work field decides activity in case 0 |
| A113 | src/voice/panel/nativeActivity.js:12 | TESTED | A113-yes, A113-no | [voice-panel-040 voice-panel-047] The input method keeps its call in case 0 |
| A114 | src/voice/panel/nativeActivity.js:13 | TESTED | A114-yes, A114-no | [voice-panel-036] The native input owner uses a distinct held flag in case 1 |
| A115 | src/voice/panel/nativeActivity.js:26 | TESTED | A115-left, A115-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A116 | src/voice/panel/nativeActivity.js:26 | TESTED | A116-left, A116-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A117 | src/voice/panel/nativeActivity.js:26 | TESTED | A117-left, A117-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A118 | src/voice/panel/nativeActivity.js:26 | TESTED | A118-left, A118-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A119 | src/voice/panel/nativeActivity.js:26 | TESTED | A119-left, A119-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A120 | src/voice/panel/nativeActivity.js:26 | TESTED | A120-left, A120-right | [voice-panel-042] The initial native status controls output knowledge in case 3 |
| A121 | src/voice/panel/nativeActivity.js:26 | TESTED | A121-left, A121-right | [voice-panel-042] The initial native status controls output knowledge in case 3 |
| A122 | src/voice/panel/nativeActivity.js:45 | TESTED | K-loop-audio-restores | [voice-panel-047] Gemini restores each retired audio immediately across repeated same-mount restarts |
| A123 | src/voice/panel/nativeActivity.js:48 | TESTED | A123-left, A123-right | [voice-panel-046] The response limit keeps unknown output until playback clears it |
| A124 | src/voice/panel/nativeActivity.js:52 | TESTED | A124-left, A124-right, K-output-items | [voice-panel-045] The silent response checks its status in case 4 |
| A125 | src/voice/panel/nativeActivity.js:52 | TESTED | A125-left, A125-right | [voice-panel-045] The silent response checks its status in case 4 |
| A126 | src/voice/panel/nativeActivity.js:58 | TESTED | A126-left, A126-right, K-output-parts | [voice-panel-045] The response checks every output part in case 0 |
| A127 | src/voice/panel/nativeActivity.js:59 | TESTED | A127-left, A127-right, K-output-parts | [voice-panel-045 voice-panel-070] The output guard still sends an activity notice in case 3 |
| A128 | src/voice/panel/nativeActivity.js:59 | TESTED | A128-left, A128-right | [voice-panel-045 voice-panel-070] The output guard still sends an activity notice in case 3 |
| A129 | src/voice/panel/nativeActivity.js:68 | TESTED | A129-yes, A129-no | [voice-panel-043] The native work field decides activity in case 0 |
| A130 | src/voice/panel/nativeActivity.js:70 | TESTED | A130-left, A130-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A131 | src/voice/panel/nativeActivity.js:70 | TESTED | A131-left, A131-right | [voice-panel-042] The initial output rejects a busy field in case 0 |
| A132 | src/voice/panel/nativeActivity.js:71 | TESTED | A132-left, A132-right | [voice-panel-040 voice-panel-047] The input method keeps its call in case 0 |
| A133 | src/voice/panel/nativeActivity.js:74 | TESTED | A133-left, A133-right | [voice-panel-036] The audio start checks admission in case 0 |
| A134 | src/voice/panel/nativeActivity.js:75 | TESTED | A134-left, A134-right | [voice-panel-043] The OpenAI input state ignores the Gemini input field |
| A135 | src/voice/panel/nativeActivity.js:78 | TESTED | A135-yes, A135-no | [voice-panel-037 voice-panel-040] The audio method updates output in case 0 |
| A136 | src/voice/panel/nativeActivity.js:79 | TESTED | A136-left, A136-right | [voice-panel-043] The native work field decides activity in case 3 |
| A137 | src/voice/panel/nativeActivity.js:79 | TESTED | A137-left, A137-right | [voice-panel-037] A null audio owner reports no output |
| A138 | src/voice/panel/nativeActivity.js:83 | TESTED | A138-left, A138-right | [voice-panel-043] The native work field decides activity in case 0 |
| A139 | src/voice/panel/nativeActivity.js:83 | TESTED | A139-left, A139-right | [voice-panel-043] The native work field decides activity in case 0 |
| A140 | src/voice/panel/nativeActivity.js:83 | TESTED | A140-left, A140-right | [voice-panel-043] The native work field decides activity in case 0 |
| A141 | src/voice/panel/nativeActivity.js:85 | TESTED | A141-left, A141-right | [voice-panel-043] The Gemini user turn flag does not report generation work |
| A142 | src/voice/panel/nativeActivity.js:86 | TESTED | A142-left, A142-right | [voice-panel-043] The OpenAI work state ignores a Gemini field in case 0 |
| A143 | src/voice/panel/nativeActivity.js:87 | TESTED | A143-left, A143-right | [voice-panel-043] The native work field decides activity in case 5 |
| A144 | src/voice/panel/nativeActivity.js:87 | TESTED | A144-left, A144-right | [voice-panel-043] The native work field decides activity in case 5 |
| A145 | src/voice/panel/nativeActivity.js:87 | TESTED | A145-left, A145-right | [voice-panel-043] The native work field decides activity in case 5 |
| A146 | src/voice/panel/nativeActivity.js:87 | TESTED | A146-left, A146-right | [voice-panel-043] The native work field decides activity in case 5 |
| A147 | src/voice/panel/nativeActivity.js:87 | TESTED | A147-left, A147-right | [voice-panel-043] The native work field decides activity in case 5 |
| A148 | src/voice/panel/nativeActivity.js:109 | TESTED | A148-left, A148-right | [voice-panel-070] A state boundary retires the method callback |
| A149 | src/voice/panel/nativeActivity.js:122 | TESTED | A149-left, A149-right | [voice-panel-047] A retired observer does not inspect native state events |
| A150 | src/voice/panel/nativeActivity.js:127 | TESTED | A150-left, A150-right | [voice-panel-047] A session boundary retires current audio in case 0 |
| A151 | src/voice/panel/nativeActivity.js:127 | TESTED | A151-left, A151-right | [voice-panel-046] Repeated start phases cannot erase an unresolved response |
| A152 | src/voice/panel/nativeActivity.js:130 | TESTED | A152-left, A152-right | [voice-panel-046] Repeated start phases cannot erase an unresolved response |
| A153 | src/voice/panel/nativeActivity.js:139 | TESTED | A153-left, A153-right | [voice-panel-070] A state boundary retires the method callback |
| A154 | src/voice/panel/nativeActivity.js:139 | TESTED | A154-left, A154-right | [voice-panel-070] A state boundary retires the method callback |
| A155 | src/voice/panel/nativeActivity.js:140 | TESTED | A155-left, A155-right | [voice-panel-048] The live transport keeps response evidence through recovery in case 0 |
| A156 | src/voice/panel/nativeActivity.js:141 | TESTED | A156-left, A156-right | [voice-panel-048] The live transport keeps response evidence through recovery in case 0 |
| A157 | src/voice/panel/nativeActivity.js:141 | TESTED | A157-left, A157-right | [voice-panel-047] A session boundary retires current audio in case 1 |
| A158 | src/voice/panel/nativeActivity.js:155 | TESTED | A158-left, A158-right | [voice-panel-044] The text wrapper checks its input in case 0 |
| A159 | src/voice/panel/nativeActivity.js:155 | TESTED | A159-left, A159-right | [voice-panel-044] The text wrapper checks its input in case 4 |
| A160 | src/voice/panel/nativeActivity.js:157 | TESTED | K-input-0, K-input-1, K-input-2 | [voice-panel-040 voice-panel-047] The input method keeps its call in case 0 |
| A161 | src/voice/panel/nativeActivity.js:170 | TESTED | A161-left, A161-right | [voice-panel-045] The silent response checks its status in case 0 |
| A162 | src/voice/panel/nativeActivity.js:174 | TESTED | A162-left, A162-right | [voice-panel-046] A response without an id cannot establish silent output |
| A163 | src/voice/panel/nativeActivity.js:180 | TESTED | A163-left, A163-right | [voice-panel-070] An untracked event still sends an activity notice in case 0 |
| A164 | src/voice/panel/nativeActivity.js:181 | TESTED | A164-left, A164-right | [voice-panel-041] The audio evidence blocks a silent result in case 0 |
| A165 | src/voice/panel/nativeActivity.js:181 | TESTED | A165-left, A165-right | [voice-panel-041] The audio evidence blocks a silent result in case 0 |
| A166 | src/voice/panel/nativeActivity.js:187 | TESTED | A166-left, A166-right | [voice-panel-041] The audio evidence blocks a silent result in case 0 |
| A167 | src/voice/panel/nativeActivity.js:187 | TESTED | A167-left, A167-right | [voice-panel-046] The response limit keeps unknown output until playback clears it |
| A168 | src/voice/panel/nativeActivity.js:187 | TESTED | A168-left, A168-right | [voice-panel-046] An event without completion cannot settle an unresolved response |
| A169 | src/voice/panel/nativeActivity.js:194 | TESTED | A169-left, A169-right | [voice-panel-041] OpenAI response.done does not drain output; absent lifecycle remains unknown |
| A170 | src/voice/panel/nativeActivity.js:214 | TESTED | K-callback-0, K-callback-1, K-callback-2, K-callback-3 | [voice-panel-039] The audio callback keeps its own values in case 0 |
| A171 | src/voice/panel/nativeActivity.js:223 | TESTED | A171-yes, A171-no | [voice-panel-039] The audio callback keeps its own values in case 0 |
| A172 | src/voice/panel/nativeActivity.js:226 | TESTED | A172-yes, A172-no | [voice-panel-039] The audio callback keeps its own values in case 0 |
| A173 | src/voice/panel/nativeActivity.js:231 | TESTED | A173-left, A173-right | [voice-panel-038] A closed audio callback cannot restore input activity |
| A174 | src/voice/panel/nativeActivity.js:231 | TESTED | A174-left, A174-right | [voice-panel-038] An old callback stays retired when the factory reuses its audio object |
| A175 | src/voice/panel/nativeActivity.js:231 | TESTED | A175-left, A175-right | [voice-panel-038] A retired factory callback cannot act through a null audio result |
| A176 | src/voice/panel/nativeActivity.js:237 | TESTED | A176-left, A176-right | [voice-panel-036] The audio start checks admission in case 1 |
| A177 | src/voice/panel/nativeActivity.js:237 | TESTED | A177-left, A177-right | [voice-panel-037] A drain event cannot admit input capture |
| A178 | src/voice/panel/nativeActivity.js:242 | TESTED | A178-left, A178-right | [voice-panel-036] The audio start checks admission in case 0 |
| A179 | src/voice/panel/nativeActivity.js:252 | TESTED | A179-left, A179-right | [voice-panel-047] A retired factory does not wrap its new audio result |
| A180 | src/voice/panel/nativeActivity.js:256 | TESTED | K-audio-0, K-audio-1, K-audio-2, K-audio-args-0, K-audio-args-1, K-audio-args-2 | [voice-panel-037 voice-panel-040] The audio method updates output in case 0 |
| A181 | src/voice/panel/nativeActivity.js:286 | TESTED | K-loop-native-restores | [voice-panel-040 voice-panel-047] The input method keeps its call in case 0 |
| A182 | src/voice/panel/preferences.js:6 | TESTED | A182-left, A182-right | [voice-panel-024] The incomplete storage keeps live values in case 0 |
| A183 | src/voice/panel/preferences.js:7 | TESTED | A183-left, A183-right | [voice-panel-021 voice-panel-022] The model uses browser storage when the storage option is absent |
| A184 | src/voice/panel/preferences.js:9 | TESTED | A184-yes, A184-no | [voice-panel-024] The incomplete storage keeps live values in case 0 |
| A185 | src/voice/panel/preferences.js:9 | TESTED | A185-left, A185-right | [voice-panel-023] The preference rejects an invalid value in case 8 |
| A186 | src/voice/panel/preferences.js:9 | TESTED | A186-left, A186-right | [voice-panel-023] The preference rejects an invalid value in case 10 |
| A187 | src/voice/panel/preferences.js:18 | TESTED | A187-yes, A187-no | [voice-panel-021 voice-panel-022] The model uses browser storage when the storage option is absent |
| A188 | src/voice/panel/preferences.js:29 | TESTED | A188-yes, A188-no | [voice-panel-026] The initial None value keeps a positive custom editor value |
| A189 | src/voice/panel/preferences.js:29 | TESTED | A189-left, A189-right | [voice-panel-021 voice-panel-022] The model uses browser storage when the storage option is absent |
| A190 | src/voice/panel/preferences.js:41 | TESTED | A190-left, A190-right | [voice-panel-024] An incomplete store cannot receive a write or a new read |
| A191 | src/voice/panel/preferences.js:58 | TESTED | K-loop-listeners | [voice-panel-028] Each listener receives a separate complete snapshot |
| A192 | src/voice/panel/preferences.js:72 | TESTED | A192-yes, A192-no | [voice-panel-024] The incomplete storage keeps live values in case 0 |
| A193 | src/voice/panel/preferences.js:84 | TESTED | A193-yes, A193-no | [voice-panel-023] The preference rejects an invalid value in case 0 |
| A194 | src/voice/panel/preferences.js:91 | TESTED | A194-yes, A194-no | [voice-panel-022] The preference saves valid minutes in case 0 |
| A195 | src/voice/panel/preferences.js:116 | TESTED | A195-yes, A195-no | [voice-panel-029] The custom value precedes a synchronous source notice |
| A196 | src/voice/panel/preferences.js:116 | TESTED | A196-left, A196-right | [voice-panel-029] The partial controls use a valid custom value in case 2 |
| A197 | src/voice/panel/preferences.js:118 | TESTED | A197-yes, A197-no | [voice-panel-029] The partial controls use a valid custom value in case 2 |
| A198 | src/voice/panel/preferences.js:125 | TESTED | A198-yes, A198-no | [voice-panel-024] The storage failure keeps live values across controls in case 0 |
| A199 | src/voice/panel/preferences.js:127 | TESTED | A199-yes, A199-no | [voice-panel-024] The storage failure keeps live values across controls in case 0 |
| A200 | src/voice/panel/preferences.js:129 | TESTED | A200-left, A200-right | [voice-panel-026] The initial None value keeps a positive custom editor value |
| A201 | src/voice/panel/preferences.js:133 | TESTED | A201-yes, A201-no | [voice-panel-029] The zero branch uses the current minute value from a custom source |
| A202 | src/voice/panel/preferences.js:133 | TESTED | A202-yes, A202-no | [voice-panel-022] The preset control applies its own value in case 0 |
| A203 | src/voice/panel/preferences.js:144 | TESTED | A203-left, A203-right | [voice-panel-029] The preview control restores a rejected value and ignores a retired callback |
| A204 | src/voice/panel/preferences.js:152 | TESTED | A204-left, A204-right | [voice-panel-029] The select works without a custom editor |
| A205 | src/voice/panel/preferences.js:161 | TESTED | A205-left, A205-right, K-preset-0, K-preset-1, K-preset-2, K-preset-3 | [voice-panel-027] invalid control edits restore valid state without writes; None remains distinct |
| A206 | src/voice/panel/preferences.js:168 | TESTED | A206-left, A206-right | [voice-panel-027] invalid control edits restore valid state without writes; None remains distinct |
| A207 | src/voice/panel/preferences.js:182 | TESTED | K-bind-add-0, K-bind-add-1, K-bind-add-2 | [voice-panel-029] The preview control restores a rejected value and ignores a retired callback |
| A208 | src/voice/panel/preferences.js:190 | TESTED | K-bind-remove-0, K-bind-remove-1, K-bind-remove-2 | [voice-panel-029] The binder removes its control listener in case 0 |
| A209 | src/voice/panel/testDom.mjs:27 | TESTED | A209-left, A209-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A210 | src/voice/panel/testDom.mjs:46 | TESTED | A210-left, A210-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A211 | src/voice/panel/testDom.mjs:50 | TESTED | A211-left, A211-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A212 | src/voice/panel/testDom.mjs:60 | TESTED | K-loop-html | [voice-panel-059] The DOM fixture models attributes and child order |
| A213 | src/voice/panel/testDom.mjs:66 | TESTED | K-loop-attributes | [voice-panel-059] The DOM fixture models attributes and child order |
| A214 | src/voice/panel/testDom.mjs:67 | TESTED | A214-left, A214-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A215 | src/voice/panel/testDom.mjs:76 | TESTED | A215-left, A215-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A216 | src/voice/panel/testDom.mjs:90 | TESTED | A216-yes, A216-no | [voice-panel-059] The DOM fixture models attributes and child order |
| A217 | src/voice/panel/testDom.mjs:94 | TESTED | K-loop-children | [voice-panel-059] The DOM fixture updates every class, child and listener |
| A218 | src/voice/panel/testDom.mjs:106 | TESTED | A218-left, A218-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A219 | src/voice/panel/testDom.mjs:115 | TESTED | A219-yes, A219-no | [voice-panel-059] The DOM fixture models attributes and child order |
| A220 | src/voice/panel/testDom.mjs:120 | TESTED | A220-left, A220-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A221 | src/voice/panel/testDom.mjs:124 | TESTED | A221-left, A221-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A222 | src/voice/panel/testDom.mjs:124 | TESTED | A222-left, A222-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A223 | src/voice/panel/testDom.mjs:126 | TESTED | A223-left, A223-right | [voice-panel-059] The DOM fixture models attributes and child order |
| A224 | src/voice/panel/testDom.mjs:155 | TESTED | K-loop-events | [voice-panel-059] The DOM fixture updates every class, child and listener |
| A225 | src/voice/panel/testDom.mjs:155 | TESTED | A225-left, A225-right | [voice-panel-059] The DOM fixture models listener lifetime and event data |
| A226 | src/voice/panel/testDom.mjs:200 | TESTED | K-loop-tasks | [voice-panel-060] The clock checks all due tasks and a cancelled sibling |
| A227 | src/voice/panel/testDom.mjs:201 | TESTED | A227-left, A227-right | [voice-panel-060] The clock runs due tasks once and cancels named tasks |

## The equivalent cases

- `A004-yes`: Null and undefined options cannot supply descriptors or a caller signal. The native prototype call throws for these values. The catch keeps the same arguments. The original guard at line 81 also keeps those arguments. A custom object takes the same nonnull path in both versions. Check: `actionObserver.js:71-89`.
- `A005-yes`: The descriptor call throws for null and undefined. The catch keeps the arguments. The original path builds an empty descriptor set, then the guard at line 81 keeps the arguments. A custom object takes the same descriptor path in both versions. Check: `actionObserver.js:73-89`.
- `A015-right`: A null update gives no string step through the empty object. The direct native descriptor call instead throws inside the private catch. Both paths return the original callback result without a progress event. Every nonnull object takes the same path. The private rest array cannot change through the callback arguments. Check: `actionObserver.js:103-118`.
- `A016-right`: A null update gives an undefined step before label inspection. The string check at line 111 therefore excludes publication. A direct label descriptor call throws inside the catch with the same result. Every nonnull object takes the same path. A custom metadata proxy cannot change a null value. Check: `actionObserver.js:103-118`.
- `A033-left`: Number.isInteger rejects every nonnumber without coercion. Thus its result already rejects the same values as the type guard. A custom numeric object cannot change that native check. Check: `host.js:116`.
- `A033-right`: The private preference parser rejects fractional numbers, NaN and infinity before it applies a value or calls listeners. The host returns the same invalid result. A custom storage object cannot bypass that parser or replace the private preference model. Check: `host.js:128; preferences.js:6-11,84-87`.
- `A042-right`: Without the null fallback, the id can hold another false value. The private final record uses that id only for truth tests or comparisons with a truthy current id. All false values therefore follow the same paths. A custom event cannot show or change the private final record. Check: `host.js:169-176,54`.
- `A046-no`: The original id expression stores only a truthy value or null. When the current id is null, equality with the old id equals the negation of that old id. A custom event cannot store another false value because the fallback at line 169 selects null. Check: `host.js:169,172`.
- `A064-left`: Destroy sets disposed and calls cancel, which advances the epoch before it calls a custom timer cancellation method. The saved callback therefore fails the epoch check. Custom clocks cannot assign the private epoch or disposed flag. Check: `inactivity.js:20,38,64-65`.
- `A131-left`: A custom provider starts with outputKnown false. The handle guard at line 122 prevents custom events from a change to that flag. The constructor installs no native wrappers for that provider. A hostile controller getter cannot bypass either provider check. Check: `nativeActivity.js:24,122`.
- `A152-left`: The condition at line 141 uses restartingAfterError only when the same cached state equals the connecting state. That outer check rejects every other state. A custom event getter cannot change the cached state after line 124. Check: `nativeActivity.js:124,130,141`.
- `A183-left`: The type check first rejects objects and other types. Every accepted integer number from 0 through 60 passes the digit grammar. The integer and range checks reject all other numbers. Thus the string type guard cannot change the result. A numeric object cannot bypass the first type check. Check: `preferences.js:6-11`.
