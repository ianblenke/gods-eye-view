## Context

The systems layer draws a marker only for a system with a top-level `Point`. On the owner's server almost no system carries one. The places the owner wants are nodes of a radio mesh: each a feature of interest with a `Point`, hosted by one gateway system through a link. A feature can be reached only through the feature list; the server answers a redirect for a feature fetched by id, and this provider refuses a redirect by design.

The systems list samples rather than enumerates: two full walks of it share few ids, a walk can repeat one of its own items, and the set changes between refreshes with nothing changed on the server. The feature list does not have that fault: two full walks give the same ids, none repeated. This change rests on that difference.

## Goals / Non-Goals

**Goals:**
- Draw one marker per feature of interest, tied to its host system for the detail and the poll.
- Keep every system once seen, so the marker set does not flicker as the systems list samples a different subset each refresh.
- Read the selected system's datastreams from a route scoped to that one system, so a host whose datastreams sit past the global list's page cap still shows them.
- Report a loss at a page cap instead of hiding it.

**Non-Goals:**
- Reading a datastream's schema, or moving a marker from an observation's location. A later change adds that.
- Fixing the observation query that returns the oldest record instead of the newest. A later change replaces it with a time window.

## Decisions

### D29 Two kinds of marker

A **system marker**, `osh:<id>`, is one entity per system with a `Point`. A **feature marker**, `osh-foi:<id>`, is one entity per feature of interest with a `Point`, at its own geometry. A feature never places its host, and a host never places a feature. A gateway with many nodes gets no marker from them.

### D30 One route serves the features of interest

`GET /api/osh/fois` walks `fois` with `limit=200` and the systems list format, both already used by the systems and probe requests. `mapOshFois()` keeps a record for each feature with a string id and a `Point`: `{id, uid, systemId, name, description, validTime, lon, lat, alt}`. It reads `properties.uid`, `properties.name` and `properties.description`. `systemId` is the last path segment of `hostedProcedure@link.href` only when the segment before it is `systems`, else null. A feature with a null host still draws.

The feature walk needs more pages than the other lists. `oshPages()` gets a `maxPages` option, default 20 (the systems and datastreams walks pass none, so they keep the default); the feature walk passes 60. The walk answers `{items, truncated}`. The route and the layer stats report `truncated`, so a loss past the cap is never silent. The route sits behind a third list cache with the five-minute TTL.

### D31 Many features under one system

- **Entities.** A feature entity has a small point and a label that shows only within 200 km, so many labels do not cover the globe at a distance.
- **Records.** The layer keeps a map of system records by id, and maps of feature records by id and by uid. The detail reads names from records, not from entity properties. A host with no marker still has a name. A feature by id is a key into the held list, never a fetch, because the server redirects a feature by id.
- **The system map is a union.** Each refresh adds the systems it sampled and removes none, because the list samples. A system seen once keeps its record and its marker for the life of the layer. Only `keyRequired`, `disable()` and `destroy()` clear the map. A refresh that omits the selected system does not clear the selection; the shipped layer does, and on a sampling server that ends nearly every poll at the next refresh. The feature map is not a union: the feature list is stable, so a feature absent from a refresh is gone, and its entity and any selection of it go with it. The maps hold only features with a `Point`, because `mapOshFois()` keeps only those; a node without a `Point` is known to the server and unplaced here, and a later observation that names it moves nothing.
- **Selection.** A click on a feature selects the feature and its host together: `selectedFeatureId` and `selectedId`. The host's datastream poll runs as today. A feature whose host is not in the systems list still selects that host id, and the detail shows the id. A click on empty space clears both.
- **Motion.** Unchanged in this change. The poll moves the selected system's entity as `osh-031` says today. A gateway with no entity of its own has nothing to move. A later change replaces this rule.

### D32 The merge runs in the browser, in a pure function

`placeOshEntities({systems, fois})` in `src/data/oshSystems.js` gives `{systems, features, unplaced}`. The layer reads the systems and the features per refresh with `Promise.allSettled`. The systems read is required. The features read is optional: a failure gives an empty list and `partial:true`. Each route degrades and caches on its own.

### D33 The system adapter keeps every system

`mapOshSystems()` keeps a record for every feature with a string id, and keeps the first record of a repeated id, because one walk can serve a system twice. No `Point`, or a coordinate that is not finite, gives `lon`, `lat` and `alt` null. A gateway with no `Point` needs its name for the detail of every node it hosts. A feature with no geometry is the common case in the feature list, not an error: `mapOshFois()` drops it with no log line, so the marker count stays far below the feature count.

### D33a The selected system reads its own datastreams

`GET /api/osh/datastreams?system=<id>` serves the datastreams of one system from `systems/<id>/datastreams`. With no `system` key the route serves the global list as today. The browser's `getDatastreams({system})` sends the key, and the poll uses it. A defensive filter on `systemId` stays in the poll.

A system id from the browser becomes part of an upstream URL, so it gets the same four layers as the datastream id in the shipped id boundary. `readSystemId()` reads the `system` key only, and refuses a value that is absent, empty, repeated or outside `OSH_ID_PATTERN`; a refusal answers `400 {error:'bad_system'}` with no upstream call. `systemDatastreamsUrl(root, id)` builds `systems/<id>/datastreams` with the fixed query `limit=100`, kept as one named constant like the observation query. `assertSystemDatastreamsUrl(url, root, id)` rebuilds and compares the whole URL. The route calls the fixed pair directly; no option can replace either. Page links follow the same path, so `isSamePageWalk()` and the page cap apply unchanged. The list sends no `f` key, the same shape the global list uses.

The adapters validate the id at the list level too: `mapOshFois()` keeps `systemId` only when it matches `OSH_ID_PATTERN`, else null, as `mapOshDatastreams()` keeps a datastream id. So a link with an id outside the pattern gives a feature with no host, never a `400` from a click.

The route keeps one snapshot per system id, five minutes, one shared refresh per id, a stale snapshot on failure and a cap of 256 ids — the keyed cache `observations.js` already has for one datastream's observation. The factory becomes generic, `createOshKeyedCache({fetchImpl, now, ttlMs, map})`, and both caches wrap it.

A host that is not in the systems list still polls, because the route needs only the id. Membership in the systems list is never a condition anywhere in this change.

### D34 How the gates measure this change

Coverage: every new and edited file at 100% line, branch and function coverage. Trace: each test names its scenario, at most three ids; each MODIFIED scenario has one changed test with its tag, which `TRACE-ID-CHANGED-NO-TEST` demands. Spec lint: one WHEN and one or more THEN lines per scenario; a MUST sentence and an origin line per requirement. STE lint: proposal, design, tasks, delta spec, test names.

## Risks / Trade-offs

Where a marker could land in the wrong place, and the guard:

1. **A feature that joins the wrong system.** Guard: the link path must end `systems/<id>`; any other link gives a null host, and the feature still draws at its own point.
2. **A feature with a coordinate that is not a number.** Guard: the adapter skips it, as the systems adapter does.
3. **A feature past the walk cap.** Not a wrong place: an absent one. The route and the stats say `truncated`.
4. **A poll that moves the selected system to an old position.** Unchanged behaviour, named `osh-latest-is-oldest`. A later change removes the cause.
5. **Two features at one position.** Not a wrong place: the position each reported. The click picks the top one.
6. **A marker that opens an empty panel.** Not a wrong place, but a false sign that the layer works. Guard: the poll reads the per-system route, which is exact, so the panel of a node shows its host's datastreams. A host with no datastreams shows `No data`, which is true.
7. **A system id that changes the upstream URL.** Guard: the four layers of D33a, mirrored from the datastream-id boundary, and the adapter-level pattern check that keeps a bad id from ever reaching a click.
8. **A marker that flickers, or a poll that ends at the next refresh.** The systems list samples. Guard: the system map is a union, a refresh removes no system, and an omitted selected system keeps its selection and its poll.
