## MODIFIED Requirements

### Requirement: Layer data states
The layer MUST show one clear state for each result of a snapshot request. It MUST NOT show the geometry of an advisory that is unavailable or failed to load.
Origin: backfill

#### Scenario: Apply a snapshot or show why there is none `cyclones-020`
- **WHEN** `update()` runs on a layer between `enable()` and `disable()`
- **THEN** when the renderer applies the snapshot, `update()` returns `true`, keeps the snapshot and clears the error
- **AND** for an `unavailable` snapshot the layer clears the renderer, keeps the snapshot and drops the selection, and `update()` returns `true`
- **AND** for an `unavailable` snapshot the error is the reason, or the text `Cyclone advisories unavailable` when the reason is `null`
- **AND** after a failed request the layer clears the renderer, drops the snapshot and the selection, and `update()` returns `true`
- **AND** after a failed request the error is the message of the failure, or the text `Cyclone advisories unavailable` when it has no message
- **AND** `update()` returns `false` before `enable()` and after `disable()` or `destroy()`, and it does not call the feed
- **AND** `update()` returns `false` when a newer request, `disable()`, an abort or a refusal of the renderer ends the request
- **AND** that request does not replace the snapshot
- **AND** a failure of a request that a newer request or an abort replaced changes nothing
- **AND** an abort of the caller during the request aborts the request of the feed with the same reason
- **AND** the layer calls its listener when a request starts and when the newest request ends
- **AND** the load flag stays `true` until the newest request ends

#### Scenario: Describe the layer state in the row controls `cyclones-021`
- **WHEN** a person calls `getRowControls()`
- **THEN** the detail of a selected storm lists the name and the classification name
- **AND** the detail lists the word `Advisory` with its number, and the word `issued` with the issue time
- **AND** the mark `·` separates the parts of the detail, and the issue time reads `MM-DD HH:mm UTC`
- **AND** in the issue time, a word joiner (U+2060) comes after the hyphen, and a no-break space (U+00A0) comes before `HH` and before `UTC`
- **AND** with no selected storm the detail is `<n> active storm` or `<n> active storms`
- **AND** with no selected storm the detail is `No active NHC/CPHC systems` for an empty snapshot
- **AND** with no selected storm the detail is `Loading advisories…` for a first request that runs, or `Advisories unavailable`
- **AND** the codes PTC, HU, TS, TD, SS and SD show as their full names, and another code shows as it is
- **AND** the status is the error when the layer has one
- **AND** without an error, a stale snapshot gives a status that starts with `Cached advisory`
- **AND** without an error and without a stale snapshot, a request that runs gives the status `Loading advisories…`
- **AND** otherwise the status is the geometry text when the geometry is not coherent, and `null` when it is coherent
- **AND** the geometry text starts with `Track and cone match` when the geometry is coherent
- **AND** the geometry text is `Track/cone awaiting advisory <n>` for the status `pending`, and `Track/cone unavailable` for another status
- **AND** a value that is `null` shows as `Unavailable`, and a wind that is `null` shows in the list as `Wind unavailable`
- **AND** the list has one item for each storm, with its ordinal, its basin, its text and its active flag
- **AND** each list item has the parameters `stormId` and `focus`
- **AND** the summary has an action for the advisory link only when the selected storm has one
- **AND** the legend has two entries only when the layer has a selected storm
- **AND** the info text joins the detail, the position time, the intensity and the geometry text
- **AND** the info text adds the status when it differs from the geometry text
- **AND** the info text ends with the coverage text of the snapshot, or with a default text when there is none

#### Scenario: Report the statistics and the diagnostics `cyclones-022`
- **WHEN** a person calls `getStats()` or `getDiagnostics()`
- **THEN** `getStats()` returns `count`, `lastUpdate`, `loading`, `error`, `stale`, `source`, `advisoryAt` and `empty`
- **AND** `lastUpdate` is the issue time in ms of the selected storm, else the fetch time of the snapshot, else `null`
- **AND** `advisoryAt` is the issue time of the selected storm, or `null` when the layer has no selected storm
- **AND** `empty` is `true` only for an available snapshot with no storms
- **AND** `getDiagnostics()` joins the diagnostics of the renderer with `enabled`, `loading`, `requestPending`, `selectionActive`, `selectedId` and `selectionIntent`
- **AND** `getDiagnostics()` reports `timerActive` as `false`, also when the renderer reports `true`
