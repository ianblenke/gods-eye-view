## Context

The systems layer draws a marker only for a system with a top-level `Point`. On the owner's server almost no system carries one. The places the owner wants are nodes of a radio mesh. Each node is a feature of interest with a `Point`. One gateway system hosts each node, through a link.

A client reaches a feature only through the feature list. The server answers a redirect for a feature fetched by id. This provider refuses a redirect by design.

The systems list samples rather than enumerates. Two full walks of it share few ids. One walk can repeat one of its own items. The set changes between refreshes with nothing changed on the server.

The feature list does not have that fault. Two full walks give the same ids, none repeated. This change rests on that difference.

## Goals / Non-Goals

**Goals:**
- Draw one marker per feature of interest. Tie each marker to its host system for the detail and the poll.
- Keep every system once seen. The marker set must not flicker as the systems list samples a different subset each refresh.
- Read the selected system's datastreams from a route scoped to that one system. A host whose datastreams sit past the global list's page cap must still show them.
- Report a loss at a page cap instead of hiding it.

**Non-Goals:**
- Read a datastream's schema, or move a marker from an observation's location. A later change adds that.
- Fix the observation query that returns the oldest record instead of the newest. A later change replaces it with a time window.

## Decisions

### D29 Two kinds of marker

A **system marker**, `osh:<id>`, is one entity per system with a `Point`. A **feature marker**, `osh-foi:<id>`, is one entity per feature of interest with a `Point`, at its own geometry. A feature never places its host. A system never places a feature. A gateway with many nodes gets no marker from them.

### D30 One route serves the features of interest

`GET /api/osh/fois` walks `fois`. The query is `limit=200` and the systems list format, both already in use for the systems walk and the probe. `mapOshFois()` keeps a record for each feature with a string id and a `Point`. The record keeps an id, a uid, a host system id, a name, a description, a valid-time span and a position.

It reads the uid, the name and the description from the feature's properties. The host system id is the last path segment of the feature's hosting link, only when the segment before it reads `systems`. Else the host id is null. A feature with a null host still draws.

The feature walk needs more pages than the other lists. `oshPages()` gets a `maxPages` option. Its default is 20. The systems and the datastreams walks pass no value, so they keep that default. The feature walk passes 60.

The walk answers an item list and a truncated flag. The route and the layer stats report that flag, so a loss past the cap is never silent. The route sits behind a third list cache, with the five-minute TTL.

### D31 Many features under one system

- **Entities.** A feature entity has a small point. Its label shows only within 200 km, so many labels do not cover the globe at a distance.
- **Records:** the layer keeps a map of system records by id. It keeps maps of feature records by id and by uid. The detail reads names from records, not from entity properties. A host with no marker still has a name. A feature by id is a key into the held list. It is never a fetch, because the server redirects a feature fetched by id.
- **The system map is a union:** each refresh adds the systems it sampled. It removes none, because the list samples. A system seen once keeps its record and its marker for the life of the layer. Only a key-required answer, `disable()` and `destroy()` clear the map. A refresh that omits the selected system does not clear the selection. The shipped layer does clear it, and on a sampling server that ends nearly every poll at the next refresh.
- **The feature map is not a union:** the feature list is stable, so a feature absent from a refresh is gone. Its entity, and any selection of it, go with it. Both maps hold only features with a `Point`, because `mapOshFois()` keeps only those. A node with no `Point` is known to the server and unplaced here. A later observation that names it moves nothing.
- **Selection.** A click on a feature selects the feature and its host together, as a feature id and a system id. The host's datastream poll runs as today. A feature whose host is not in the systems list still selects that host id, and the detail shows the id. A click on empty space clears both.
- **Motion.** Unchanged in this change. The poll moves the selected system's entity as `osh-031` says today. A gateway with no entity of its own has nothing to move. A later change replaces this rule.

### D32 The merge runs in the browser, in a pure function

`placeOshEntities()` takes the system records and the feature records. It gives back the placed systems, the placed features and the unplaced system ids. The function lives in `src/data/oshSystems.js`.

The layer reads the systems and the features per refresh together, with `Promise.allSettled`. The systems read is required. The features read is optional. A failure there gives an empty feature list and sets a partial flag. Each route degrades and caches on its own.

### D33 The system adapter keeps every system

`mapOshSystems()` keeps a record for every feature with a string id. It keeps the first record of a repeated id, because one walk can serve a system twice. No `Point`, or a coordinate that is not finite, gives a null position. A gateway with no `Point` still needs its name, for the detail of every node it hosts.

A feature with no geometry is the common case in the feature list, not an error. `mapOshFois()` drops such a feature with no log line. The marker count stays far below the feature count.

### D33a The selected system reads its own datastreams

A new query key on the datastreams route serves the datastreams of one system, from a path scoped to that system. With no such key, the route serves the global list, as today. The browser's datastreams getter sends the key when given a system id, and the poll always gives one. A defensive filter on the system id stays in the poll.

A system id from the browser becomes part of an upstream URL. It gets the same four layers the datastream id already has. A reader function reads the query key only, and refuses a value that is absent, empty, repeated, or outside the id pattern. A refusal answers `400` with no upstream call.

A builder function builds the fixed URL, with one named query constant, the same way the observation query is named. A checker function rebuilds the URL and compares it. The route calls the fixed pair directly. No option can replace either function.

Page links follow the same path, so the same-walk check and the page cap apply unchanged. The list sends no format key, the same shape the global list uses.

The adapters validate the id at the list level too. `mapOshFois()` keeps a host id only when it matches the id pattern, else null, the same way the datastream adapter keeps a datastream id. So a link with a bad id gives a feature with no host, never a `400` from a click.

The route keeps one snapshot per system id. The TTL is five minutes, with one shared refresh per id, a stale snapshot on failure, and a cap of 256 ids. This is the same keyed cache the observation route already has for one datastream. The factory behind it becomes generic, and both routes wrap it.

A host outside the systems list still polls, because the route needs only the id. Membership in the systems list is never a condition anywhere in this change.

### D34 How the gates measure this change

Coverage: every new and edited file stays at 100% line, branch and function coverage. Trace: each test names its scenario, at most three ids per test. Each MODIFIED scenario keeps one changed test with its tag. Spec lint: one WHEN line and one or more THEN lines per scenario. Every requirement keeps a MUST sentence and an origin line. STE lint covers the proposal, the design, the tasks, the delta spec and every test name.

## Risks / Trade-offs

Where a marker could land in the wrong place, and the guard:

1. **A feature that joins the wrong system.** Guard: the link path must end in a system id. Any other link gives a null host. The feature still draws at its own point.
2. **A feature with a coordinate that is not a number.** Guard: the adapter skips it, as the systems adapter does.
3. **A feature past the walk cap.** Not a wrong place: an absent one. The route and the stats report the loss.
4. **A poll that moves the selected system to an old position.** Unchanged behaviour, named `osh-latest-is-oldest`. A later change removes the cause.
5. **Two features at one position.** Not a wrong place: the position each reported. A click picks the top one.
6. **A marker that opens an empty panel.** Not a wrong place, but a false sign that the layer works. Guard: the poll reads the per-system route, which is exact. The panel of a node shows its host's datastreams. A host with no datastreams shows a plain "no data" message, which is true.
7. **A system id that changes the upstream URL.** Guard: the four layers of D33a, mirrored from the datastream id boundary, plus the adapter-level pattern check. A bad id never reaches a click.
8. **A marker that flickers, or a poll that ends at the next refresh.** The systems list samples. Guard: the system map is a union. A refresh removes no system. An omitted, selected system keeps its selection and its poll.
