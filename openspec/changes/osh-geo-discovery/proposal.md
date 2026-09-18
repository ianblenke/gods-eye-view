## Why

The layer reads `/systems` and keeps a marker only for a system with a top-level `Point`. Almost no system carries one, so the layer draws almost nothing.

The places the owner wants are feature markers: nodes of a mesh, each a feature of interest with a `Point`, hosted by one system through a link. A client that reads only `/systems` never sees a node. A feature can be reached only through the feature list, because the server refuses a redirect and a feature by id redirects.

The systems list also samples: two full walks of it share few ids, and a walk can repeat one of its own items. A layer that treats a system absent from one walk as gone loses and regains markers with nothing changed on the server. The feature list has no such fault: two full walks give the same ids, none repeated.

A marker must open something. The datastream poll of a selected system today walks a global list to a cap and filters it afterwards; a system whose datastreams sit past that cap gets an empty panel. The server has a route for the datastreams of one system, so this change reads the selected system through that route instead.

This change reads the feature list, draws one marker per feature, ties each feature to its host for the detail and the poll, and keeps every system once seen instead of rebuilding the set from each refresh. It reads no datastream schema and moves no marker from an observation; a later change adds that.

## What Changes

- Add the route `GET /api/osh/fois`, cached the way the systems and datastreams lists are, with its own page cap.
- Add `oshPages()`'s `maxPages` option (default 20) and its `{items, truncated}` answer, so a walk reports a loss at the cap instead of hiding it.
- Add the adapter `src/data/oshFois.js` with `mapOshFois()`: a feature record with its own point and its host system id, read from the feature's hosting link.
- Add `placeOshEntities({systems, fois})` in `src/data/oshSystems.js`: a pure merge that places a system at its own point and every feature at its own point, with no cross-placement.
- Widen `mapOshSystems()` to keep every system with a string id, even with no `Point`, as a record with null coordinates, and to keep the first record of a repeated id.
- Add the `system` query key to the datastreams route, served from `systems/<id>/datastreams` through a new id boundary in `server/providers/osh/ids.js`, mirrored from the datastream-id boundary. A request with no `system` key keeps serving the global list.
- Turn the observation cache into a generic keyed cache, shared by the observation route and the new per-system datastreams route.
- Change the browser layer to draw two entity kinds, `osh:<id>` for a system and `osh-foi:<id>` for a feature, to keep a system record map as a union across refreshes, and to keep a feature record map that follows the feature list exactly.
- Change the click handling and the poll so a click on a feature selects the feature and its host together, and the poll always reads the selected system's own datastreams route.
- Change `renderOshDetail()` to show the feature's name above its host's name when the selection came from a feature.
- Add a synthetic feature fixture and a system fixture with a null geometry.

## Impact

- New files at 100% coverage: `src/data/oshFois.js`, `src/data/oshFois.test.mjs`, `src/data/fixtures/osh-fois.json`.
- Changed files, each at 100% coverage after the edit: `server/providers/osh/get.js`, `server/providers/osh/ids.js`, `server/providers/osh/observations.js`, `server/providers/osh.js`, `src/data/oshSystems.js`, `src/layers/osh/source.js`, `src/layers/osh/index.js`, `src/layers/osh/detail.js`.
- Changed tests: `src/data/oshSystems.test.mjs`, `src/data/oshGet.test.mjs`, `src/data/oshIds.test.mjs`, `src/data/oshObservationsProxy.test.mjs`, `src/data/oshProxy.test.mjs`, `src/data/oshRepositoryHygiene.test.mjs`, `src/data/oshLayer.test.mjs`, `src/layers/osh/source.test.mjs`, `src/layers/osh/detail.test.mjs`.
- Configuration: `scripts/package-boundaries.json` adds `src/data/oshFois.js` to the `osh-provider` group. `src/data/fixtures/README.md` gets one entry.
- No requirement text changes. Seven requirements are MODIFIED for their scenario set only; three requirements are ADDED.
- Upstream request shape: one more GET route per refresh (the feature walk), and the selected system's poll now sends one GET to a per-system route instead of reading the global datastreams list. Both new caches share the five-minute list TTL. No disk storage is added.

## Known limits closed

- `osh-point-only`: closed. The layer reads the systems and the features, so a node with only a feature geometry now draws.

## Known limits left open

- `osh-latest-is-oldest`: the shipped observation query returns the oldest stored record, not the newest, on a server with a long history. A later change replaces the query with a time window.
- `osh-location-keys-inferred`: the guessed result keys for a location in an observation are unchanged in this change. A later change reads the datastream schema instead.
- `osh-selected-only-motion`: only the selected system's poll can move a marker.
- `osh-no-live-test`: no test proves the server accepts the feature walk; every fixture is synthetic.
- `osh-systems-list-samples`: the systems list has no stable order and no stable membership between walks. The union rule in this change keeps every system once seen, so the marker set this layer can show only grows, never shrinks, inside one session. A feature marker is not a sample: the feature list is stable and each record resolves its host by id.
- `osh-system-records-accumulate`: the system union has no eviction. A long session holds a growing set of small records; a reload empties it.
- `osh-datastream-list-partial`: the global datastreams walk still stops at its page cap. The selected system's poll no longer reads that list, so the cap no longer affects it; the cap still applies wherever a later change surveys datastreams across every system.
- `osh-system-id-pattern-shared`: a system id must match the datastream id pattern to reach the per-system datastreams route. A host id outside the pattern gives a feature with no host and no poll, never a `400` from a click.
- `osh-foi-by-id-redirects`: the server answers a redirect for a feature fetched by id, and this provider refuses a redirect by design. A feature is reached only through the list.
- `osh-foi-walk-cap`: the feature walk stops at its own page cap, wider than the systems and datastreams caps. The route and the layer report a loss at that cap through `truncated`.
- `osh-walk-not-a-snapshot`: a page walk of a list is not one atomic snapshot; a walk can serve one item twice. Both adapters keep the first record of a repeated id.
- `osh-node-info-not-read`: a node's own descriptive stream, if it has one, is not read for the marker. A feature marker shows only the feature's own name.
- `osh-cold-start-latency`: on a cold cache the feature walk can run up to its own page cap of sequential pages before the layer draws its first feature marker.
- `osh-feature-labels-near-only`: a feature label shows only within 200 km, so a distant view shows unlabeled points.
