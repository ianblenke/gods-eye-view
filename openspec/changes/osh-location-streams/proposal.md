## Why

A position can live in a datastream. Not only in a system's own geometry, or in a feature's own point. Some systems on the owner's server have no geometry and no feature of interest at all. Their only position lives in a datastream. Today this project draws no entity for such a system.

The position shape is not one shape: three are measured against the owner's server. One is a `Vector` field bound by axis id, in a frame such as EPSG 4979. One is that same `Vector` shape with no reference frame at all. One is flat `Quantity` fields bound by their definition, with no wrapping field. A rule that trusts a field's name, or that needs a reference frame, misses the no-frame shape. That is the shape the position streams use.

So this change reads a datastream's schema to learn its shape. It reads a datastream's newest record for each of its features at once, in one request, never walked. It finds candidate streams from three stable surfaces: a property filter; the datastreams of each feature's host; and the datastreams of each point system. It never finds a candidate from a list that samples.

A position drawn as current long after a stream stopped is worse than no position. So every placement from a stream goes through the freshness gate this project already ships. A stale record never moves an entity. A stale record never places an entity either.

This change also drops the last guessed key search from the location reader. A location now comes only from the path a schema names.

## What Changes

- Read a datastream's schema for a location reader: a `Vector` field bound by axis id, or two flat fields bound by definition. The search depth is bounded. A present reference frame must be geographic. An absent frame is accepted.
- Read the newest record of every reporting feature of one datastream. One request. Never walked.
- Find candidate streams from three sources: a property-filtered list, the datastreams of every feature's host system, and the datastreams of every system with a point. Never from a walk of a sampled list.
- Add one route that runs this whole pass. It answers a location for each candidate whose schema names one.
- Extend the merge function that places entities. A fresh location that names a feature moves that feature. A fresh location with no feature name places its system, above that system's own point. A stale location is dropped before any other rule.
- A system with no held record at all, named only by a fresh stream, still gets an entity. It gets the pass's own name for it when a name can be read, and its raw id otherwise. No permanent record is kept for it.
- Extend the browser layer with a third read per refresh. Add the lifecycle of an entity a stream alone places. It stays only as long as its stream stays fresh, unless it is the current selection.
- Widen the address checks the OSH test suite runs. Accept the two public vocabulary hosts a schema's definitions can name. This change needs a synthetic vendor segment on every definition term it writes.

## Impact

- Changed files, each at 100% coverage after the edit: `src/data/oshObservations.js`, `src/data/oshSystems.js`, `server/providers/osh/ids.js`, `server/providers/osh/observations.js`, `server/providers/osh.js`, `src/layers/osh/source.js`, `src/layers/osh/index.js`, `src/layers/osh/detail.js`.
- No new source file. The pinned file counts under `osh-005` hold.
- Five new fixture files: three location-schema bodies and two list bodies, all synthetic.
- No requirement text changes. Six requirements are MODIFIED, for their scenario set only. One requirement is ADDED.
- The request shape widens. It gains a property-filtered list read, a per-host datastreams read and a per-point-system datastreams read. It gains a schema read per candidate stream, and one newest-record page per stream with a reader. Each sits behind its own cache. The existing per-datastream poll is unchanged.

## Known limits closed

- `osh-location-keys-inferred`: closed. The reader binds by the schema's own definition and axis id, never by a guessed key name.
- `osh-selected-only-motion`: closed. Every candidate stream places or moves its entity once per refresh. The selected system's own poll still runs every fifteen seconds, unchanged.
- `osh-no-observation-history`: never opened. The newest-record request already answers every reporting feature's newest record in one page.

## Known limits left open

- `osh-property-list-open`: the built-in property list holds two public terms. Take a stream that declares another property, whose system has neither a feature nor a point. It is found only when the owner adds that term to the environment value. The other two candidate sources still find what this list misses on this server.
- `osh-latest-page-cap`: one page of newest records per stream, never walked. A server whose one stream has more fresh-reporting features than that page holds loses the oldest of them.
- `osh-union-not-a-candidate-source`: the browser's own union of systems it has seen is not a candidate source. A system in it with a point is placed by that point regardless. One without a point is reachable only through the property filter or a feature.
- `osh-stream-placed-name-unread`: a system placed only by a stream, with no held record, is named by one read by id. When that read fails, or the record carries no name, the entity's label is its raw id. That is a degraded state, not the design.
- `osh-schema-shapes-measured-three`: the reader recognises the two schema shapes behind the three measured declarations. A schema of another shape gives no location, never a wrong one.
- `osh-fresh-threshold-one-hour`: a station whose newest record is older than the freshness gate never moves or places from it. Its own point, when it has one, still places it.
- `osh-no-live-test`: no test proves the server accepts any of these requests. Every fixture is synthetic.
