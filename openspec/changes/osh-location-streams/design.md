## Context

A position lives in a datastream on the owner's server, not only in a system's own geometry. Three shapes of it are measured. One is a `Vector` field bound by axis id, in a geographic frame. Another is that same `Vector` shape with no reference frame at all, and a third is flat fields bound by definition, with no wrapping field. The no-frame shape is the one the position streams use. A rule that needs a frame, or that trusts a field's name over its axis id, misses it.

The systems list and the global datastreams list both sample. Two reads of either give a different set. So a candidate search over either never converges. Three surfaces are stable: the feature list, one system's own datastreams by id, and the datastreams list filtered by a declared property. This change finds every candidate stream through those three surfaces only.

A stream reports on its own schedule. A position drawn as current long after its stream stopped is a wrong position. This project already ships a freshness gate, `isOshObservationFresh()`. This change routes every placement a stream makes through it, with no exception.

## Goals / Non-Goals

**Goals:**
- Read a location from a datastream's own schema, never from a guessed key.
- Read the newest record of every reporting feature of one stream in one request.
- Find candidate streams only from stable surfaces.
- Place or move an entity from a stream only when its record is fresh.
- Give a stream-only system an entity, with a name when one can be read.

**Non-Goals:**
- Walk a stream's history. One newest-record request per stream, never followed.
- Read a datastream's descriptive fields, such as a model or a role. A stream-placed entity shows only the name the pass reads for its system.

## Decisions

### D44 The schema decides what a location is, by definition and axis id

`readOshSchemaLocation(schema)` lives in `src/data/oshObservations.js`. It reads the record at `resultSchema`. It walks its `fields`, and for a `Vector` field its `coordinates`, to a bounded depth. It gives a reader with four paths: the latitude, the longitude, the height when named, and a sampling-feature uid when named. Each path is a list of field names from the result's root, or null.

Two shapes are recognised. The `Vector` shape comes first when a schema declares both.
- **Vector shape.** A `Vector` field whose coordinates carry axis id `Lat` and `Lon` with unit code `deg` binds by axis id. It never binds by a coordinate's own name or its position in the list. A coordinate with axis id `h` and unit code `m` binds the height. A present reference frame must resolve to EPSG 4979 or EPSG 4326; an absent one is accepted, because the measured no-frame shape carries none. An axis id outside `Lat`, `Lon` and `h` never binds, so an ECEF vector's `X`, `Y`, `Z` axes give no reader.
- **Flat shape.** Two `Quantity` fields with unit code `deg` bind when their definition's last term reads `latitude` and `longitude`. The last term is read after its last `/`, `#` or `:`, in lower case. A height binds only from a `Quantity` in `m` whose last term reads `heighthae`, `heightaboveellipsoid` or `ellipsoidalheight`. `altitudemsl` never binds.

A field's own name plays no part in either binding rule. The sampling-feature uid binds to a `Text` field whose definition's last term reads `samplingfeatureuid`. That search runs the same way, across the whole schema.

`extractOshLocation(result, reader)` walks the reader's paths into a result record. A value counts only when `Number(value)` is finite, so the text `NaN`, an empty string and a missing value all fail. A bad or absent height keeps a good latitude and longitude, with the height null. A null reader, a bad latitude or longitude, or one out of range gives null. No key is ever guessed, and `geometry.coordinates` is never read. This closes `osh-location-keys-inferred`.

### D45 One per-feature query, one page, never walked

A newest-record request with a limit above one, filtered to the newest result time, groups its answer by feature of interest. It gives the newest record of each, measured against the owner's server. A stream with no feature reference is its own one group. It gives one record at any limit.

`OSH_LATEST_LIMIT` is a named constant in `server/providers/osh/ids.js`. `observationsLatestUrl(root, id)` builds the fixed URL. `assertObservationsLatestUrl()` rebuilds it and compares the whole thing. That is the same shape of check every other built URL in this provider already carries. The browser supplies nothing to this URL beyond the datastream id it always could. The page this request answers is never followed to a next page.

`mapOshLocationPage(payload, reader, nowMs)` is pure. It gives one record per item, carrying the feature reference, the times, the location and the age computed from `nowMs`. An item with no location is kept with a null one, so a caller can count it. The order the server answers is kept.

### D46 Three candidate sources, one decision rule

A candidate stream is one whose schema gives a reader. The schema decides, not the source that found it. Candidates come from three stable sources, never from a walk of a sampled list:
1. **A property filter.** One list request per declared property URI, built the same way every other list request in this provider is built, and cached per URI. The built-in list holds two public terms; an environment value can add more, comma-separated. Each entry is checked to parse as a URL or a URN scheme with no white space. A refused entry is skipped, with a warning naming only its position, never its text. An entry can be the owner's own vendor term, and this project logs none.
2. **Every feature's host.** The distinct system ids the feature list names, read through the per-system datastreams route this project already has.
3. **Every point system.** Every system the systems snapshot holds with a point, read through the same per-system route.

The browser's own union of systems it has seen is not a candidate source. A system in it with a point is already placed by that point. One without a point is reachable only through the other two sources. `osh-union-not-a-candidate-source` names this.

### D47 One route runs the pass, server side

`GET /api/osh/locations` takes no query. It unites the three sources by datastream id. It reads each candidate's schema through a per-id cache. For each candidate with a reader it reads one newest-record page. A candidate with no reader, or whose page read fails, adds one to a `failed` count and gives no location.

Each location answer names the system, the datastream, the feature reference, the position, the time and the age. It also names the system's own name, when one can be read. A system's name comes from the systems snapshot when it holds that system. Otherwise it comes from one read by id, cached per id — the one reliable read for a system the snapshot never sampled. A failed name read never drops the location. It gives a null name instead.

The whole pass sits behind one cache with the same short TTL the observation cache already uses. It has one shared refresh, and a stale snapshot on a failed refresh. So concurrent readers share one pass, and the browser's own five-minute refresh always finds a fresh one. No candidate property URI, and no vendor term, ever appears in a response.

The pass caches the fold of every candidate's page, phenomenonTime included, but never an age. The route recomputes each location's age at serve time from that time. That is the same reason `osh-observation-age`'s own observation route recomputes its one age, rather than trusting a cached one. Without this fix, two answers from one cached pass would carry the same frozen age. A stale one, served longer still, would carry it even longer. The freshness gate this change's own placement rule depends on would then judge a growing staleness by a number that stopped growing.

### D48 Placement with the gate, and the lifecycle of a stream-placed entity

The merge function that places entities gains a third input, the pass's locations. A location counts only when it is fresh. A stale one is dropped before any other rule.
- A fresh location naming a feature moves that feature. One naming a feature the layer does not hold is dropped. A feature never places its host.
- A fresh location with no feature name places its system, above that system's own point. The newer of two such locations for one system wins.
- A system with a point and no fresh location keeps that point. A system with neither counts as unplaced.
- A fresh location whose system has no held record still places it, with the name the pass read. That entity carries the datastream, the time and the age. Its record is a placeholder, kept only for that one placement, and it never joins the layer's own union of systems. Only when that name could not be read does the entity's label fall back to the raw id — a degraded state, not the design. `osh-stream-placed-name-unread` names it.

The entity of a system placed this way carries the same id a point-placed one would. So the existing click handling and poll need no change. When its stream stops reporting fresh records, the entity is removed. This happens at the first refresh with nothing fresh for it. The system then counts as unplaced. The one exception is the current selection: it stays at its last position until deselected, the same rule this project already gives a point-placed selection.

### D49 The layer reads three lists per refresh

The systems read stays required. The feature read and the locations read are both optional. Either one failing sets a partial flag and no error. The layer still places what the other sources gave it. The layer sends the locations read no candidate of its own. The server finds every candidate itself.

### D50 How the gates measure this change

Coverage: every changed file at 100% line, branch and function coverage. Trace: each MODIFIED scenario carries one changed test with its tag. No new source file, so the pinned counts this provider's own hygiene test already checks hold unedited. Spec lint and STE lint run as they already do for this project.
