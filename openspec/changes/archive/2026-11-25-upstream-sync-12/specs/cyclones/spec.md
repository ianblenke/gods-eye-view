## MODIFIED Requirements

### Requirement: Snapshot bounds
The snapshot validator MUST throw an error for a snapshot that is outside the bounds of the contract. It MUST accept a value that is on a bound.
Origin: backfill

#### Scenario: Reject a wrong snapshot shape or storm identity `cyclones-003`
- **WHEN** `validateCycloneSnapshot()` gets a snapshot with one wrong top-level field or one wrong storm identity
- **THEN** it throws the error `Malformed cyclone snapshot`
- **AND** this holds for a `null` snapshot and for a schema version other than 1
- **AND** this holds for a `stale` or `unavailable` flag that is not a boolean
- **AND** this holds for a `storms` value that is not an array, and for more than 32 storms
- **AND** this holds for an agency other than `nhc` and `jtwc`, and a storm with no agency is an NHC storm
- **AND** this holds for a storm id that is not a prefix of its agency in lower case and then six digits
- **AND** the NHC prefixes are `al`, `ep` and `cp`, and the JTWC prefixes are `wp`, `io`, `sh`, `ep` and `cp`
- **AND** this holds for an id that appears twice
- **AND** this holds for a geometry status other than `current`, `pending` or `unavailable`
- **AND** this holds for a basin that is not the upper-case form of the first two letters of the storm id
- **AND** the validator accepts 32 storms, the NHC basins `AL`, `EP` and `CP`, and the JTWC basins `WP`, `IO` and `SH`

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
- **AND** a link is `null`, or an `https` URL on the host of the agency with no port, no user, no password and no fragment
- **AND** the host is `www.nhc.noaa.gov` for NHC and `www.metoc.navy.mil` for JTWC
- **AND** an NHC advisory link has the path `/text/CODE.shtml` with capital letters and digits, and no query
- **AND** an NHC outlook link has the path `/gtwo.php` and the query `basin=atlc&fdays=7`, or the same query with the basin `epac` or `cpac`
- **AND** a JTWC advisory link has the path `/jtwc/products/` and then two lower-case letters, four digits and `web.txt`, with no query
- **AND** a JTWC outlook link has the path `/jtwc/products/abpwweb.txt` or `/jtwc/products/abioweb.txt`, with no query
- **AND** a link text of more than 256 characters is wrong

#### Scenario: Reject wrong or unbounded geometry `cyclones-005`
- **WHEN** `validateCycloneSnapshot()` gets a snapshot with geometry that is wrong for its status, wrong in form, or over a bound
- **THEN** it throws the error `Malformed cyclone snapshot`
- **AND** a `current` storm needs a track, an area and one forecast point at least
- **AND** the area is a cone for an NHC storm and a danger area for a JTWC storm
- **AND** an NHC storm with a danger area is wrong, and a JTWC storm with a cone is wrong
- **AND** the geometry advisory number of a `current` storm equals its advisory number
- **AND** a storm with the status `pending` or `unavailable` has no track, no area and no forecast point
- **AND** the list of forecast points is an array, a lead time repeats in no storm, and a lead time is never `null`
- **AND** a track has the type `LineString` or `MultiLineString`, and a cone or a danger area has the type `Polygon` or `MultiPolygon`
- **AND** a position pair has two finite numbers in range
- **AND** a line has 2 to 10000 pairs, and a list of lines, rings or polygons has 1 to 128 items
- **AND** a ring has 4 to 10000 pairs, and its last pair equals its first pair
- **AND** a snapshot has at most 500 forecast points in all its storms
- **AND** a snapshot has at most 25000 coordinates in all its storms, and the forecast points count in this total

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
- **AND** each other storm card has the variant `card` and the accent `#7fe6ed`
- **AND** the gap of a card is 20 px for the selected storm and 17 px for another storm
- **AND** the leader of a card starts 14 px from the point for the selected storm and 11 px for another storm
- **AND** a lead-hour label has the id `lead:<id>:<hours>`, the title `<hours> h`, no detail, and a gap of 13 px
- **AND** a lead-hour label has the priority 500 minus the hours
- **AND** a lead-hour label has a maximum distance of 4000000 m with a hard cutoff, and a storm card has no distance limit
- **AND** each entry is an interactive tactical card in the collision group `ambient-card` that culls at the horizon
- **AND** a selected storm with no forecast list gets no lead-hour label
- **AND** a selected storm with a danger area gets one area label after its lead-hour labels
- **AND** the area label has the id `area:<id>`, the title `34-knot wind danger area`, no detail and the priority 300

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
- **THEN** it returns the storm id from `storm:<id>`, from `lead:<id>:<hours>` and from `area:<id>`
- **AND** it returns `null` for another prefix, for a prefix in upper case, and for a prefix not at the start
- **AND** it returns `null` for an id with no text after the prefix
- **AND** it returns `null` for `null`, for `undefined`, for a number and for a plain object
