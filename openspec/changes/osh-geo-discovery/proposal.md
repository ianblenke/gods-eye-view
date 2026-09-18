## Why

The layer reads `/systems` and keeps an entity only for a system with a top-level `Point`. A system with a top-level `Point` is rare on the owner's server, so the layer draws almost nothing.

The places the owner wants are feature entities. These are the nodes of a mesh. Each node is a feature of interest with a `Point`. One system hosts each feature, through a link. A client that reads only `/systems` never sees a feature.

A client reaches a feature only through the feature list. The server refuses a feature fetched by id with a redirect.

The systems list also samples. A walk of the systems list returns a different, arbitrary subset each time. A walk can repeat one of its own items. A layer that treats an absent system as gone loses and regains entities, with nothing changed on the server. The feature list has no such fault. Two full walks give the same ids, none repeated.

A click on an entity must show the datastreams of its host system. The datastream poll of a selected system today walks a global list to a cap, then filters it. A system whose datastreams sit past that cap gets an empty panel. The server has a route for the datastreams of one system. This change reads the selected system through that route instead.

This change reads the feature list. It draws one entity per feature. It ties each feature to its host, for the detail and the poll. It keeps every system once seen, instead of rebuilding the set from each refresh.

It reads no datastream schema. It moves no entity from an observation. A later change reads the datastream schema and moves an entity from an observation's location.

## What Changes

- Add the route `GET /api/osh/fois`. Cache it the way the systems and datastreams lists are cached, with its own page cap.
- Add a `maxPages` option to the page walk, with a default of 20. The walk now reports when it stopped at its cap.
- Add the adapter `src/data/oshFois.js`. Its `mapOshFois()` function builds a feature record with its own point and its host system id, read from the feature's hosting link.
- Add a pure merge function in `src/data/oshSystems.js`. It places a system at its own point and every feature at its own point, with no cross-placement.
- Widen the system adapter. It now keeps every system with a string id, even with no `Point`. It keeps the first record of a repeated id.
- Add a system query key to the datastreams route. It serves the datastreams of one system, through a new id boundary that mirrors the datastream id boundary. A request with no such key still serves the global list.
- Turn the observation cache into a generic keyed cache. The observation route and the new per-system datastreams route both use it.
- Change the browser layer. It now draws two entity kinds: one for a system, one for a feature. It keeps a system record map as a union across refreshes. It keeps a feature record map that follows the feature list exactly.
- Change the click handling and the poll. A click on a feature selects the feature and its host together. The poll always reads the selected system's own datastreams route.
- Change the detail renderer. It shows a feature's name above its host's name, when the selection came from a feature.
- Add a synthetic feature fixture, and a system fixture with a null geometry.

## Impact

- New files at 100% coverage: `src/data/oshFois.js`, its test file, and one new fixture file.
- Changed files, each at 100% coverage after the edit: the get, ids and observations modules under `server/providers/osh/`, the top-level osh provider, and the system adapter.
- Also changed, same coverage bar: the browser source, layer and detail files.
- Nine changed test files, one for each changed source file above, plus the hygiene and proxy test files.
- Configuration: one new module joins the osh boundary group. The fixtures readme gets one new entry.
- No requirement text changes. Seven requirements are MODIFIED for their scenario set only. Three requirements are ADDED.
- The request shape changes: one more GET route runs per refresh, for the feature walk. The selected system's poll now sends one GET to a per-system route, instead of reading the global datastreams list. Both new caches share the five-minute list TTL. No disk storage is added.

## Known limits closed

- `osh-point-only`: closed. The layer reads the systems and the features. A feature with only its own geometry now draws.

## Known limits left open

- `osh-latest-is-oldest`: the shipped observation query returns the oldest stored record on a server with a long history, not the newest. A later change replaces the query with a time window.
- `osh-location-keys-inferred`: the guessed result keys for a location stay unchanged in this change. A later change reads the datastream schema instead.
- `osh-selected-only-motion`: only the selected system's poll can move an entity.
- `osh-no-live-test`: no test proves the server accepts the feature walk. Every fixture is synthetic.
- `osh-systems-list-samples`: the systems list has no stable order and no stable membership between walks. The union rule in this change keeps every system once seen, so the system entity set can only grow inside one session. A feature entity is not a sample. The feature list is stable, and each record resolves its host by id.
- `osh-system-records-accumulate`: the system union has no eviction. A long session holds a growing set of small records. A reload empties it.
- `osh-datastream-list-partial`: the global datastreams walk still stops at its page cap. The selected system's poll no longer reads that list, so the cap no longer touches it. The cap still applies wherever a later change surveys datastreams across every system.
- `osh-system-id-pattern-shared`: a system id must match the datastream id pattern to reach the per-system route. A host id outside the pattern gives a feature with no host and no poll, never a `400` from a click.
- `osh-foi-by-id-redirects`: the server answers a redirect for a feature fetched by id. This provider refuses a redirect by design. A client reaches a feature only through the list.
- `osh-foi-walk-cap`: the feature walk stops at its own page cap, wider than the systems and datastreams caps. The route and the layer report a loss at that cap.
- `osh-walk-not-a-snapshot`: a page walk of a list is not one atomic snapshot. A walk can serve one item twice. Both adapters keep the first record of a repeated id.
- `osh-node-info-not-read`: the layer does not read a feature's descriptive datastream. A feature entity shows only the feature's own name.
- `osh-cold-start-latency`: on a cold cache the feature walk can run many sequential pages before the layer draws its first feature entity.
- `osh-feature-labels-near-only`: a feature label shows only within 200 km, so a distant view shows unlabeled points.
