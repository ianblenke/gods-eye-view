## Why

The feature collection of the owner's server does not hold every feature that its location streams name. The feature walk completes with `truncated:false`, so a longer walk finds nothing more. The features the streams name are not in the collection at all.

`osh-042` drops a fresh location that names a feature the layer does not hold. That rule is correct as written, and mutant M16 proves it. But this server does not meet the premise of the rule.

The premise is that a location names a feature that the layer holds. On this server that is not always true. So the layer drops the fresh positions of the features that it does not hold. The map draws fewer entities than the layer has positions for.

A fresh location already carries everything an entity needs. It has the feature reference, the position, the time, the age and the system id. So this change draws the feature itself from the location, with no record from the feature collection. This is the same as the placeholder that `osh-057` already draws for a system with no held record.

One host can have many features. So the host's name is the only name a location carries for an unheld feature, and many features share it. This change never uses it for a feature. A stream-drawn feature gets no label, and its detail shows its id, its host and the age of the location that placed it.

Two rules stay exactly as they are. A location that names a feature never places its host system, because one system hosts many features. A location that is not fresh places nothing. The second rule is also what bounds the count. Only a fresh location draws, and the measured fresh set is a small part of the whole.

## What Changes

- Extend `placeOshEntities()` in `src/data/oshSystems.js`. A fresh location that names a feature the layer does not hold gives a placed feature at the location. Its id is the location's `foiId`, or its `foiUid` when there is no `foiId`. It carries the same stream fields a stream-placed system carries.
- Extend the layer in `src/layers/osh/index.js`. It draws a stream-drawn feature with the same entity id a held feature gets. A click on it selects its host and starts the poll. The layer counts it under `getStats().features` and under a new `getStats().placed.streamFeatures`. The layer keeps no record of it between refreshes.
- Keep one entity id and one position for a feature, whether the layer holds it or not. This needs a location with the `foiId` of the record. A features getter that throws sets `partial:true`. It changes the label, the entity properties and `placed.streamFeatures` for one refresh.
- Extend `renderFeatureHeader()` in `src/layers/osh/detail.js`. A feature placed by a stream shows the `Placed by` line a stream-placed system already shows. A moved feature carries the stream fields for it.
- No provider change. No new file. No request change. No requirement text change.

## Impact

- Changed files, each at 100% coverage after the edit: `src/data/oshSystems.js`, `src/layers/osh/index.js`, `src/layers/osh/detail.js`.
- Changed test files: `src/data/oshSystems.test.mjs`, `src/data/oshLayer.test.mjs`, `src/layers/osh/detail.test.mjs`.
- No new source file, so the pinned file counts under `osh-005` stay true.
- No requirement text changes. Three requirements are MODIFIED for their scenario set only: Records, Systems layer and Feature entities. `osh-042` changes one clause and gains one. `osh-032` gains two clauses, and `osh-057` gains one. `osh-058`, `osh-059` and `osh-060` are ADDED under those requirements.
- No gap opens or closes in `openspec/trace`. The three changed files are at 100% now and stay there.
- The map draws many more entities. A stream-drawn feature has no name, so it gets no label, and the map stays readable. The freshness gate and the page limit of each stream limit the count.
- The base text of `osh-042` and `osh-057` is the delta of `osh-location-streams`. That delta is in `openspec/specs/osh/spec.md`.

## Known limits closed

None. The limits `osh-location-streams` left open stay open. The defect this change closes had no name, because `osh-042` recorded it as a rule, not as a limit.

## Known limits and later changes

- `osh-stream-drawn-feature-unnamed`: a stream-drawn feature has no name, because no record holds one. Its entity gets no label, and the detail shows its id. This is the degraded state `osh-stream-placed-name-unread` names for a system, without the by-id read. The feature collection does not hold the feature, so a by-id read has nothing to find.
- `osh-feature-key-split`: one location can name a feature by id, and another can name it by uid alone. The layer then draws it twice, once under each key, because no record links the two keys. On the owner's server, a location that carries a uid also carries an id. A location can also name a held feature by its uid only, or by an id that is not its record id. It then moves the feature under its record id. When the features getter throws, it draws the feature under the key that it carries, and the entity id changes for that refresh.
- `osh-stream-drawn-features-overlap`: features of one host that share a position draw as entities that overlap. A click picks one, and its detail names it. The layer does not group them, because a group entity has no feature id for the click to use.
- `osh-fresh-threshold-one-hour`: unchanged. A stream-drawn feature lives only as long as its location is fresh, the same as a stream-placed system.
- `osh-no-live-test`: unchanged. No test proves the server's locations name features the way the fixtures do. Every fixture is synthetic.
- `osh-feature-key-collision`: a location can carry a uid that equals the id of a held feature but is not its uid. The layer then has two records with one id. Cesium refuses the second entity. Then `update()` returns false and sets `error`, and the map is partly empty for that refresh. On the owner's server, a location that carries a uid also carries an id, so this needs an unusual location.
- `osh-failed-read-click-host`: when the features getter throws, a click on a drawn feature takes its host from the `systemId` of the location. It does not use a feature record. No test pins this.
- `osh-042-old-test-names`: two old tests in `oshSystems.test.mjs` say that the location is dropped for an unknown feature. Since `osh-058`, the location draws a feature. An existing test keeps its name, so the names stay. A new test covers the drawn feature.
