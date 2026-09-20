## Context

`osh-location-streams` gave the layer a third input: the newest location of every candidate stream. A fresh location that names a held feature moves that feature. A fresh location with no feature reference places its system. A fresh location that names a feature the layer does not hold is dropped. The last rule is the one this change replaces.

On the owner's server, the feature collection is small and the location streams name many more features than it holds. The walk of the collection completes, so the features are not behind a page cap. They are absent from the collection. So the dropped case is the common case, and the map shows a small fraction of the fresh positions the provider serves.

The features cluster. A few host systems own almost all of them, and one host owns hundreds. Those hundreds sit at far fewer distinct positions, and their ages run from seconds to more than a day. So the only name a location carries for an unheld feature is its host's name, and that name is shared by hundreds of features. A label built from it would fill the map with one word. The owner already sees a small version of this today, as repeated markers with one system's name.

Terms: a *held feature* is a feature record the features read gave this refresh. An *unheld feature* is a feature a location names that the layer does not hold this refresh. A *stream-drawn feature* is the entity this change draws for an unheld feature from its fresh location alone. *Fresh*, *stream-placed*, *placeholder* and *partial* keep the meanings `osh-observation-age` and `osh-location-streams` gave them.

The base text of `osh-042` and `osh-057` is the delta of `osh-location-streams`. `main` has merged that change and has not yet archived it, so `openspec/specs/osh/spec.md` on `main` still carries the older `osh-042` and no `osh-057`. This change quotes its base from `git show main:openspec/changes/osh-location-streams/specs/osh/spec.md`. Archive `osh-location-streams` before this change runs its gates, so the two deltas never both modify `osh-042` at once.

## Goals / Non-Goals

**Goals:**
- Draw an entity for every fresh location the provider serves, whether or not the layer holds the feature it names.
- Keep the rule that a location which names a feature never places its host system.
- Keep the rule that a location which is not fresh places nothing.
- Give a held feature and an unheld feature one entity id and one position, so a failed features read changes no entity.
- Keep no record of a stream-drawn feature between refreshes.
- Never label a feature with its host's name, and show the age of the location that placed a feature.

**Non-Goals:**
- Read a feature by id from the server. `osh-045` forbids it, and the collection does not hold the feature.
- Change the provider, the location pass, or any request.
- Give a stream-drawn feature a name or a label. It has no record to take one from.

## Decisions

### D52 Draw the feature, not the system, and not nothing

Eight options were weighed. The last is taken.

- **Aggregate by host system.** Rejected. One host owns hundreds of features at many positions, so the host has no one position to draw. A marker at the newest feature's position claims to be the system while it sits on one feature. That is the M16 failure with a count attached.

- **Aggregate by position.** Rejected. Features that share a position would collapse into one entity with a count. The entity then has no feature id, so a click has no host to poll, and `osh-060`'s one-id rule cannot hold. Equality of two positions is also a fragile test on decimal coordinates.

- **Cap the stream-drawn features, with a flag like `truncated`.** Rejected. The count is already bounded twice. Only a fresh location draws, and the measured fresh set is about a tenth of all locations. Each stream's page holds at most `OSH_LATEST_LIMIT` records, so the candidate count times that limit is a hard ceiling. A cap would also need an order rule, and the location list has no order across streams.

- **Leave the rule and explain it.** Rejected. The rule is correct only when the layer holds the features the streams name. On this server it does not, and the layer exists to show positions. A rule that discards most of them is a defect, whatever the spec says.

- **Place the host system from the location.** Rejected. One system hosts many features, so the host's marker would sit on one of them and claim to be the system. Mutant M16 exists to stop exactly this, and it stays red under this change.

- **Read the unheld feature by id.** Rejected. `osh-045` says the layer never fetches a feature by id. The collection does not hold the feature, so the read finds nothing. It would also send one GET per feature per refresh.

- **Draw the feature only when the features read succeeded this refresh.** Rejected, for the reasons in D54.

- **Draw the feature from the location alone.** Taken. The location carries the feature reference, the position, the time, the age and the system id. That is everything `osh-057` needs to draw a stream-placed system, and it is everything a feature entity needs.

### D53 The stream-drawn record mirrors the stream-placed system

`placeOshEntities()` in `src/data/oshSystems.js` gains one branch. A fresh location that names no held feature gives a placed feature in `features`. The record is `{id, uid, systemId, name, description, validTime, lon, lat, alt, locationSource, datastreamId, datastreamName, phenomenonTime, ageMs}`. `name`, `description` and `validTime` are null. `locationSource` is `'stream'`. The stream fields are the ones `placedFromStream()` already copies for a system.

The key is the location's `foiId`, or its `foiUid` when the location carries no `foiId`. `uid` is the location's `foiUid`, or null. `systemId` is the location's `systemId`, or null. The newer of two fresh locations for one key wins, by the `isNewer()` rule the system branch already uses. The location still never places its system, so `systems` and `unplaced` do not change.

The fresh filter runs before every other rule, as it does today. So a location that is not fresh draws nothing. The function stays pure and keeps no state between calls.

### D54 One entity id and one position, held or not

"The layer does not hold this feature" has two causes. The server does not publish the feature in its collection, or the features read failed this refresh. A failed features read is one that throws, that answers `keyRequired:true` alone, or that answers `truncated:true`. The first cause is permanent for this server. The second is transient.

The `failed` count of the locations route is not a third cause. A candidate whose schema or page read failed gives no location at all, as `osh-056` says. So a failed candidate read never yields a stream-drawn feature.

This change handles the transient cause with one rule, not with a branch. Take one fresh location that names a feature. When the layer holds that feature, the location moves it. When the layer does not, the location draws it. Both give the same entity id `osh-foi:<id>` and the same position.

Only the label, the entity properties and `placed.streamFeatures` differ. The layer keeps no map of stream-drawn features across refreshes. So a failed read changes the label and one count for one refresh. The next successful read restores them, and no entity is created or destroyed on the way. `osh-060` pins this with four refreshes.

The fourth option in D52 would skip the draw when `partial` is true. Under it, a failed features read removes every feature entity for that refresh, as it does today. That happens though the layer holds fresh positions for many of them. It also adds a branch, a test and a mutation for no gain. `partial:true` already tells the viewer that a read failed.

### D55 The layer draws, selects, counts and forgets

The feature loop in `update()` in `src/layers/osh/index.js` already draws every record in `placed.features`. A stream-drawn record has a null name, so `osh-045`'s label rule gives it no label with no new branch. The location's `systemName` never stands in for the feature's name, on the label or in the detail. One host owns hundreds of features, so that name would repeat hundreds of times.

`osh-057` labels a placeholder system with its id as a degraded state. A feature does not get that fallback. `osh-045` already gives a feature with no name no label, and a feature id is a server token. A test pins both refusals.

The layer draws one entity per fresh unheld feature. It applies no cap, and it does not group them by host or by position, for the reasons in D52. `getStats().placed.streamFeatures` reports the count, so the owner can see it.

The layer gains `_placedFeatureById`, a map of `placed.features` by id, the mirror of `_placedSystemById`. The click handler, `pollSelected()`, `applySelection()` and the selection-drop check read it, so a click on a stream-drawn feature finds its host. `_featureRecordsById` stays the map of held records. A record is stream-drawn when its `locationSource` is `'stream'` and `_featureRecordsById` does not hold its id. That is the rule the system placeholder already uses.

`getStats().placed.streamFeatures` counts the stream-drawn records. `locationSource` alone cannot decide it, because a held feature a stream moves also carries `'stream'`. `getStats().features` counts every feature entity, as `osh-045` says.

A stream-drawn feature is absent from `placed.features` at the first refresh with no fresh location for it. The layer then draws nothing for it, and the selection-drop rule of `osh-045` clears any selection of it. There is no exception for the selected feature. `osh-045` and `osh-049` already clear a dropped feature's selection. An exception would need a position memory and a re-add branch, for a case the feature rule never had.

`renderFeatureHeader()` already shows the feature's id in place of its name, and the host's id when the host has no record. D57 adds one line to it.

### D56 The M16 pin stays

The test that mutant M16 reddens keeps every assertion. Only its name changes, because the words "dropped entirely" are no longer true. The layer gains one test tagged `[osh-057 osh-059]` that asserts no system entity and no `placed.stream` count for a location that names an unheld feature. The host-fallback mutation must redden both.

### D57 The entity class is a feature, and its age is visible

A feature of a sensor that detects things is plausibly a detection or a tracked object, not a fixed installation. This change does not draw it as a system. It draws it as a feature entity, `osh-foi:<id>`, with the smaller cyan point every feature already gets, and no label. That is the class the server itself gives it. The layer cannot tell a fixed feature from a detection that moves, and it does not try.

Two things keep a detection honest. The freshness gate removes it an hour after its stream stops, so a day-old detection never draws. And the detail shows when and by what it was placed. `renderFeatureHeader()` in `src/layers/osh/detail.js` gains the `Placed by` line `renderSystemHeader()` already has, for a feature with `locationSource:'stream'`. It shows the datastream's name and the age of the location, in the same words the datastream blocks use.

For that line to work for a moved feature too, the override in `placeOshEntities()` copies the four stream fields, not only the coordinates. `osh-042` gains one clause for it. A held feature a stream moves and an unheld feature a stream draws then carry the same fields, which is what D54 needs.

To draw nothing was weighed here too, because a reasoned no is a legitimate outcome. It is rejected. The fresh positions are the live data this layer exists to show, and each one is a feature the server names. A viewer who sees a dot, clicks it, and reads a feature id, its host and a `Placed by` age has what the data holds. A viewer who sees nothing has less.

### D58 How the gates measure this change

Coverage: `src/data/oshSystems.js`, `src/layers/osh/index.js` and `src/layers/osh/detail.js` stay at 100% line, branch and function coverage. Trace: `osh-058`, `osh-059` and `osh-060` tag new tests. `osh-042`, `osh-032` and `osh-057` each have at least one changed test with its tag, which `TRACE-ID-CHANGED-NO-TEST` demands. Spec lint and STE lint run as before. Every mutation in `tasks.md` names the test that must redden, and the implementer reports the red for each.

## Risks / Trade-offs

- **Many more entities on the map.** Accepted. A stream-drawn feature has no label, so a host's hundreds of features never repeat its name. The count is bounded by the freshness gate and by each stream's page limit, and `placed.streamFeatures` reports it.
- **Stream-drawn features that share a position overlap.** Accepted. A click picks one of them, and its detail names it. A group entity would lose the feature id the click needs.
- **The new entities inherit a known defect.** The OSH layer sets neither `disableDepthTestDistance` nor `heightReference` on its points and labels, so its markers vanish on a close zoom. A separate change owns that fix. This change adds entities that show the same defect until it lands, and does not touch it.
- **A feature can draw twice.** One location names it by id, another by uid alone. Accepted and named as `osh-feature-key-split`. On the measured server, a location with a uid also carries an id.
- **A wrong `foiId` draws a dot for a feature that does not exist.** Accepted. The layer trusts the server's feature reference the way it trusts the server's position.
- **A stream-drawn feature vanishes an hour after its stream stops.** Accepted. That is the freshness rule every stream placement already follows.

## Migration Plan

None. The adapter and the layer change in place. No stored data or on-disk cache changes shape.

## Open Questions

None.
