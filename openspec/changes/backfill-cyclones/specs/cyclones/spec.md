## ADDED Requirements

### Requirement: Snapshot projection
The snapshot validator MUST return a new snapshot that has only the named fields. It MUST tell empty coverage from an unavailable source.
Origin: backfill

#### Scenario: Copy only the named fields of a valid snapshot `cyclones-001`
- **WHEN** `validateCycloneSnapshot()` gets a valid snapshot that has extra fields
- **AND** a storm of the snapshot has a cone with a hole that crosses the dateline
- **THEN** the result has only the named fields of the snapshot, of each storm and of each forecast point
- **AND** the result has only the named fields of each position and of each movement
- **AND** the result has new arrays for the coordinates of the track and of the cone, with the same values in the same order
- **AND** the position time of a storm stays apart from its advisory time
- **AND** each link in the result is the normal form of its URL
- **AND** a track of one line and a cone of one polygon keep the types `LineString` and `Polygon`

#### Scenario: Tell empty coverage from an unavailable source `cyclones-002`
- **WHEN** `validateCycloneSnapshot()` gets a snapshot with no storms
- **THEN** the result has `unavailable` set to `false` when the snapshot says `false`
- **AND** the result has `unavailable` set to `true` when the snapshot says `true`, with a `null` fetch time and a reason
- **AND** the validator throws an error for a snapshot that has `unavailable` set to `true` and one storm

### Requirement: Snapshot bounds
The snapshot validator MUST throw an error for a snapshot that is outside the bounds of the contract. It MUST accept a value that is on a bound.
Origin: backfill

#### Scenario: Reject a wrong snapshot shape or storm identity `cyclones-003`
- **WHEN** `validateCycloneSnapshot()` gets a snapshot with one wrong top-level field or one wrong storm identity
- **THEN** it throws the error `Malformed cyclone snapshot`
- **AND** this holds for a `null` snapshot and for a schema version other than 1
- **AND** this holds for a `stale` or `unavailable` flag that is not a boolean
- **AND** this holds for a `storms` value that is not an array, and for more than 32 storms
- **AND** this holds for a storm id that is not `al`, `ep` or `cp` with six digits in lower case
- **AND** this holds for an id that appears twice
- **AND** this holds for a geometry status other than `current`, `pending` or `unavailable`
- **AND** this holds for a basin that is not the upper-case form of the first two letters of the storm id
- **AND** the validator accepts 32 storms and the three basins `AL`, `EP` and `CP`

#### Scenario: Reject a wrong text, number, time, advisory number or link `cyclones-004`
- **WHEN** `validateCycloneSnapshot()` gets a snapshot with one wrong value in a text, a number, a time, an advisory number or a link
- **THEN** it throws an error
- **AND** the error is `Malformed cyclone snapshot` for each case except a link text that is not a URL
- **AND** a text is wrong when it is not a string, is blank, is over its limit, or has a control character, `<` or `>`
- **AND** the limits are 80 characters for a name and 16 for a classification
- **AND** the limits are 160 characters for the source, and 240 for the attribution, the coverage and the reason
- **AND** the validator accepts a `null` reason and rejects a `null` classification
- **AND** a number is wrong when it is not finite or is outside its range
- **AND** the validator accepts each end of a range
- **AND** the ranges are 0 to 300 for a wind and 0 to 350 for a gust
- **AND** the ranges are 800 to 1100 for a pressure, 0 to 360 for a direction and 0 to 200 for a speed
- **AND** the ranges are -180 to 180 for a longitude and -90 to 90 for a latitude
- **AND** the ranges are 0 to 168 for a lead time and 0 to 9007199254740991 for the fetch time
- **AND** the validator accepts a `null` value for a wind, a gust, a pressure, a direction, a speed and the fetch time
- **AND** a `null` position, a `null` coordinate, a `null` lead time and a storm with no `movement` object are wrong
- **AND** a time is right only in the exact form `YYYY-MM-DDTHH:mm:ss.sssZ` for a real date
- **AND** an advisory number is `0`, or one to three digits with no zero at the start, and then one optional capital letter
- **AND** a link is `null`, or an `https` URL on the host `www.nhc.noaa.gov` with no port, no user, no password and no fragment
- **AND** an advisory link has the path `/text/CODE.shtml` with capital letters and digits, and no query
- **AND** an outlook link has the path `/gtwo.php` and the query `basin=atlc&fdays=7`, or the same query with the basin `epac` or `cpac`
- **AND** a link text of more than 256 characters is wrong

#### Scenario: Reject wrong or unbounded geometry `cyclones-005`
- **WHEN** `validateCycloneSnapshot()` gets a snapshot with geometry that is wrong for its status, wrong in form, or over a bound
- **THEN** it throws the error `Malformed cyclone snapshot`
- **AND** a `current` storm needs a track, a cone and one forecast point at least
- **AND** the geometry advisory number of a `current` storm equals its advisory number
- **AND** a storm with the status `pending` or `unavailable` has no track, no cone and no forecast point
- **AND** the list of forecast points is an array, a lead time repeats in no storm, and a lead time is never `null`
- **AND** a track has the type `LineString` or `MultiLineString`, and a cone has the type `Polygon` or `MultiPolygon`
- **AND** a position pair has two finite numbers in range
- **AND** a line has 2 to 10000 pairs, and a list of lines, rings or polygons has 1 to 128 items
- **AND** a ring has 4 to 10000 pairs, and its last pair equals its first pair
- **AND** a snapshot has at most 500 forecast points in all its storms
- **AND** a snapshot has at most 25000 coordinates in all its storms, and the forecast points count in this total

### Requirement: Snapshot acquisition
The snapshot source MUST send its request only when a caller asks for a snapshot. It MUST stop the request on a deadline or an abort. It MUST return only a snapshot that the validator accepts.
Origin: backfill

#### Scenario: Request the fixed path only when called `cyclones-006`
- **WHEN** a person creates a source with `createCycloneSource()` and calls `getSnapshot()`
- **THEN** the source sends no request before the call
- **AND** the call sends one request to `/api/cyclones` with the option `cache` set to `no-store`, the option `redirect` set to `error`, and a `signal`
- **AND** a source with no `fetchImpl` option calls the global `fetch`
- **AND** the call returns the snapshot that the validator accepts
- **AND** the call rejects when the body is not JSON, or when the validator rejects the snapshot

#### Scenario: Reject a failed or oversized response `cyclones-007`
- **WHEN** the response has a status that is not ok, or a body of more than 4194304 bytes
- **THEN** the call rejects with the error `Cyclone HTTP` and the status number for a status that is not ok
- **AND** the source cancels the body of a response with a status that is not ok
- **AND** a `content-length` of more than 4194304 makes the call reject with an error that says the response is too large
- **AND** streamed bytes of more than 4194304 make the call reject in the same way
- **AND** the call accepts a `content-length` of 4194304 and a body of 4194304 bytes

#### Scenario: Stop the request on a deadline or an abort `cyclones-008`
- **WHEN** the deadline ends, or the signal of the caller aborts
- **THEN** after 15000 ms the request signal aborts, and the call rejects with the error `Cyclone request timed out`
- **AND** the option `timeoutMs` sets the deadline
- **AND** a signal that already aborted makes the call reject with `AbortError`, and the source sends no request
- **AND** an abort of the caller during the request aborts the request signal with the reason of the caller
- **AND** the call rejects with the reason of the caller
- **AND** an abort of the caller after the body read, and before the validation, still makes the call reject
- **AND** when the call ends, the deadline timer and the listener on the signal of the caller are gone

### Requirement: Storm labels
The label builder MUST make one card for each storm. It MUST make one label for each forecast point of the selected storm. The publisher MUST send the cards and the labels to the shared overlay host.
Origin: backfill

#### Scenario: Build one card for each storm and one label for each forecast point `cyclones-009`
- **WHEN** `cycloneOverlayEntries()` gets a list of storms and the id of a selected storm
- **THEN** it returns the storm cards in the order of the storms, and the lead-hour labels of the selected storm follow its card
- **AND** a storm card has the id `storm:<id>` and the storm name as its title
- **AND** a storm card has its classification as its only detail, or no detail when it has none
- **AND** a storm card has the priority 1000 plus the wind in knots, or 1000 for a wind that is not a number
- **AND** the selected storm card has the largest safe integer as its priority
- **AND** the selected card has `protected` set to `true`, the variant `selected` and the accent `#ffe19a`
- **AND** each other card has the variant `card` and the accent `#7fe6ed`
- **AND** the gap of a card is 20 px for the selected storm and 17 px for another storm
- **AND** the leader of a card starts 14 px from the point for the selected storm and 11 px for another storm
- **AND** a lead-hour label has the id `lead:<id>:<hours>`, the title `<hours> h`, no detail, and a gap of 13 px
- **AND** a lead-hour label has the priority 500 minus the hours
- **AND** a lead-hour label has a maximum distance of 4000000 m with a hard cutoff, and a storm card has no distance limit
- **AND** each entry is an interactive tactical card in the collision group `ambient-card` that culls at the horizon
- **AND** a selected storm with no forecast list gets no lead-hour label

#### Scenario: Publish the labels to the overlay host `cyclones-010`
- **WHEN** a person calls `setSnapshot()`, `setSelection()` and `clear()` on the result of `createCycloneLabels()`
- **THEN** `setSnapshot()` shows the source `weather-cyclones`, and then sets its entries with a cohort limit of 64 and `moving` set to `false`
- **AND** the collision capacity is the number of entries that are not protected, and at most 64
- **AND** `setSelection()` with a new id sets the entries again, and with the same id it sends nothing
- **AND** `setSnapshot()` with no id keeps the earlier selection
- **AND** before the first snapshot, `setSelection()` and `clear()` send nothing
- **AND** `clear()` after a snapshot clears the source, hides it and forgets the selection
- **AND** a second `clear()` sends nothing
- **AND** a publisher with no `host` option sends its calls to the shared world overlay

#### Scenario: Find the storm of a label entry id `cyclones-011`
- **WHEN** `cycloneStormIdFromEntryId()` gets an entry id
- **THEN** it returns the storm id from `storm:<id>` and from `lead:<id>:<hours>`
- **AND** it returns `null` for another prefix, for a prefix in upper case, and for a prefix not at the start
- **AND** it returns `null` for an id with no text after the prefix
- **AND** it returns `null` for `null`, for `undefined`, for a number and for a plain object

### Requirement: Storm geometry on the globe
The renderer MUST draw a point for each storm. It MUST draw geometry only for a coherent advisory. It MUST hide each entity that is beyond the horizon.
Origin: backfill

#### Scenario: Draw a point for each storm and the geometry of a coherent advisory `cyclones-012`
- **WHEN** `setSnapshot()` gets storms and one storm has the status `current` and equal advisory numbers
- **THEN** the renderer adds a data source `weather-cyclones` with the entities of all storms
- **AND** a refresh removes the earlier data source with its entities
- **AND** each storm has a center point `cyclone:<id>:center` on the ground, of 9 px, in `#7fe6ed`
- **AND** the center point has a black outline of 2 px, and it shows through terrain
- **AND** each line of a track is one polyline `cyclone:<id>:track:<n>` on the ground, of 2.5 px, in `#7fe6ed`
- **AND** each polygon of a cone is one polygon `cyclone:<id>:cone:<n>` with the alpha 0.16, and its holes stay holes
- **AND** each ring of a cone has one outline polyline of 1 px with the alpha 0.55
- **AND** each forecast point with a lead time other than 0 is a white point of 5 px
- **AND** a forecast point at lead time 0 has no entity
- **AND** a storm with a status other than `current`, or with different advisory numbers, has only its center point
- **AND** a coherent storm with no track or no cone draws the parts that it has
- **AND** the diagnostics count the storms, the tracks, the cones and the forecast points
- **AND** the focus sphere of a storm covers its center and its geometry
- **AND** the focus sphere has a radius of at least 500000 m, and it is `null` for an unknown id

#### Scenario: Style and label the selected storm `cyclones-013`
- **WHEN** `setSelection()` gets the id of a storm after a snapshot commits
- **THEN** the center point of that storm is `#ffe19a` and 12 px, and each other center point is `#7fe6ed` and 9 px
- **AND** a selection that is `null` or unknown gives each center point the style of an unselected storm
- **AND** the call asks the viewer for one render
- **AND** the labels use the new selection: the card of that storm has the variant `selected`, and its lead-hour labels appear
- **AND** a later snapshot keeps the selection and applies it to the new points and the new labels

#### Scenario: Hide the entities that are beyond the horizon `cyclones-014`
- **WHEN** the `preRender` event of the scene runs
- **THEN** a point entity has `show` set to `true` when the point occluder says that its position is visible, and `false` when not
- **AND** the shape entities of a storm have `show` set to `true` when the sphere occluder says that the sphere of the storm is visible
- **AND** a storm with no shape entity is not tested with its sphere
- **AND** the renderer sets `show` and asks for a render only when a value changes
- **AND** the renderer does not publish the labels again
- **AND** the occluders use the WGS84 ellipsoid and the WGS84 minimum radius
- **AND** the renderer keeps one `preRender` listener while the committed snapshot has storms
- **AND** an empty snapshot, `clear()` and `destroy()` remove the listener, and a late commit does not restore it
- **AND** with the real Cesium library, a storm on the far side hides
- **AND** with the real Cesium library, a storm at the limb keeps its shapes and hides its points

### Requirement: Renderer ownership and release
The renderer MUST claim a pick only for an exact current entity. It MUST commit only the newest complete snapshot. It MUST release its entities when it clears.
Origin: backfill

#### Scenario: Own the pick of an exact current entity `cyclones-015`
- **WHEN** `pickStorm()` gets a pick, or `ownsPickId()` gets an id
- **THEN** `pickStorm()` returns the storm id when the `id` of the pick is an entity object of the current data source
- **AND** `pickStorm()` returns `null` for a copy of an entity, for a string id and for an empty pick
- **AND** `pickStorm()` returns `null` for an entity of an older data source, and after `clear()`
- **AND** `ownsPickId()` returns `true` only for the string id of an entity of the current data source
- **AND** until a new data source commits, the ids of the earlier data source stay owned and the new ids are not owned

#### Scenario: Commit only the newest complete snapshot `cyclones-016`
- **WHEN** `setSnapshot()` runs while an earlier call has not ended, or `clear()`, `destroy()` or an abort comes before the add ends
- **THEN** a call returns `true` and replaces the earlier data source only when nothing newer happened
- **AND** a call that a newer call, `clear()`, `destroy()` or an abort replaced returns `false` and removes its own data source
- **AND** a call that returns `false` keeps the earlier data source, its counts and its ids
- **AND** a signal that aborted before the call makes the call reject with `AbortError`, and the call adds no data source
- **AND** when the add fails for the newest call, the call rejects with the failure and removes its own data source
- **AND** when the add fails for the newest call, the earlier data source stays
- **AND** when the add fails for a call that a newer call, `clear()`, `destroy()` or an abort replaced, the call returns `false`
- **AND** the labels publish only when a data source commits
- **AND** `setSnapshot()` after `destroy()` returns `false` and adds nothing

#### Scenario: Release everything on clear and destroy `cyclones-017`
- **WHEN** `clear()` or `destroy()` runs
- **THEN** `clear()` removes the data source and its entities, hides the labels, and resets the counts, the selection, the focus spheres and the owned ids
- **AND** `getDiagnostics()` shows zero counts and the selected id `null` before the first snapshot and after `clear()`
- **AND** `clear()` asks the viewer for one render
- **AND** a destroyed viewer gets no render request, and a destroyed data source list gets no removal call
- **AND** `destroy()` calls `clear()`, and a second `destroy()` does nothing
- **AND** `getDiagnostics()` reports `timerActive` as `false`

### Requirement: Layer life cycle
The layer MUST need a snapshot source. It MUST hold its click handler and its pick registration only between `enable()` and `disable()`.
Origin: backfill

#### Scenario: Create the layer with a fixed identity and refuse a layer with no source `cyclones-018`
- **WHEN** a person calls `createCyclonesLayer()`
- **THEN** a call with a `feed` that has a `getSnapshot` function gives a layer with the id `weather-cyclones`, the name `Cyclone advisories` and the source `NOAA NHC / CPHC`
- **AND** the layer has the update interval 300000 ms
- **AND** a call with no `feed`, or with a `feed` that has no `getSnapshot` function, throws a `TypeError`
- **AND** `init()` passes the `overlayHost` option to the renderer

#### Scenario: Hold the click handler and the pick owner from enable to disable `cyclones-019`
- **WHEN** a person calls `enable()`, `disable()` and `destroy()` on the layer
- **THEN** `enable()` registers the pick owner `weather-cyclones` and installs one click handler on the canvas, and a second `enable()` does nothing
- **AND** the pick owner claims an id only between `enable()` and `disable()`, and only when `ownsPickId()` of the renderer returns `true` for it
- **AND** the layer installs no click handler when the viewer has no scene, no canvas, or no Cesium handler class
- **AND** `disable()` unregisters the pick owner, destroys the click handler once, and removes the capture listeners of the canvas
- **AND** `disable()` does not destroy a click handler that Cesium already destroyed
- **AND** `disable()` aborts the request, and it resets the snapshot, the error, the load flag, the selection and the selection intent
- **AND** `disable()` clears the renderer
- **AND** `destroy()` does the same, and it releases the renderer once
- **AND** `enable()` and `update()` do nothing after `destroy()`
- **AND** a layer with no viewer can enable, disable and destroy

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

### Requirement: Storm selection
The layer MUST hold at most one selected storm. It MUST keep the choice of the person across a refresh. It MUST NOT claim the pointer or move the camera on its own.
Origin: backfill

#### Scenario: Keep the selection intent across a refresh `cyclones-023`
- **WHEN** `update()` applies a snapshot, and `setParams()` selects or clears a storm
- **THEN** with the intent `auto` the layer selects the first storm of the snapshot when the selected storm is not in it
- **AND** `setParams()` with a `stormId` of a storm in the snapshot sets the intent `user` and selects that storm
- **AND** `setParams()` with `clear` set to `true`, or with `stormId` set to `null`, sets the intent `cleared` and selects no storm
- **AND** a refresh with the intent `cleared` selects no storm
- **AND** a refresh with the intent `user` keeps the selected storm, or selects the first storm when the selected storm left
- **AND** a clear that comes while a refresh stages the snapshot wins over the refresh
- **AND** `setParams()` ignores a `stormId` that is not a string or not in the snapshot, and a `clear` that is not `true`
- **AND** `setParams()` does nothing before `enable()` and after `disable()` or `destroy()`
- **AND** a change of the selection calls the listener, and `disable()` sets the intent to `auto`

#### Scenario: Select a storm with a map click `cyclones-024`
- **WHEN** a person clicks the map between `enable()` and `disable()`
- **THEN** a click on a storm card or on a lead-hour label of the overlay selects its storm with the intent `user`
- **AND** that click does not pick the scene
- **AND** a click on a card of an advisory that is no longer in the snapshot changes nothing
- **AND** a click on a vessel card changes nothing and does not pick the scene
- **AND** a click on a cyclone entity selects its storm
- **AND** a click on empty map, on 3D Tiles content or on a tileset primitive clears the selection
- **AND** a click on an entity of another layer, or on another primitive, changes nothing
- **AND** the layer uses the overlay hit that a `pointerup`, `mouseup` or `touchend` event recorded within 1 px of the click
- **AND** one record serves one click only
- **AND** a `pointerdown`, `mousedown`, `touchstart`, `pointercancel` or `touchcancel` event clears the record
- **AND** a release event with no finite coordinates records nothing and clears the earlier record
- **AND** a click does nothing after `disable()` or `destroy()`
- **AND** a click does nothing when another owner holds the pointer or when the click has no position
- **AND** a click from a handler that a newer handler replaced does nothing
- **AND** a click never claims the pointer, never moves the camera and never sets the tracked entity

#### Scenario: Fly to a storm and open its advisory `cyclones-025`
- **WHEN** `setParams()` gets `focus` set to `true` or `advisory` set to `true`
- **THEN** with `focus` the layer passes one function to `runNavigation()`, and that function flies the camera to the focus sphere of the selected storm
- **AND** the flight lasts 1.4 s, or 0 s when the person prefers reduced motion
- **AND** the shell gets the result of the flight
- **AND** that function does nothing after a selection change, a clear, or a refresh that drops the storm
- **AND** that function does nothing after an unavailable snapshot, a failed request, `disable()` or `destroy()`
- **AND** only the function that the newest focus request queued flies, and a focus request for the selected storm flies again
- **AND** the layer queues no flight without a shell service, without a focus sphere, or without a selected storm
- **AND** with `advisory` the layer opens the advisory URL of the selected storm in a new tab with the option `noopener,noreferrer`
- **AND** the layer opens no link when the selected storm has no advisory URL
- **AND** a layer after `disable()` flies nowhere and opens no link
- **AND** the options `matchMedia` and `openLink` replace the global `matchMedia` and the global `open`
