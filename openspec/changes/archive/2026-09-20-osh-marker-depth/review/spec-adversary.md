# Spec adversary — `osh-marker-depth`, round 1, scope full

**Trees read: `9b26215`** for the round-1 pass and **`491213e`** for the
re-read that produced this verdict, both on branch `osh-marker-depth` in
`/home/ianblenke/docker/gev-depth`, each exported with `git archive` into a
private copy. Confirmed with
`git -C /home/ianblenke/docker/gev-depth log --oneline -4 491213e`:

```
491213e chore(tasks): check 2.1 through 5.4 of osh-marker-depth
8aa3421 chore(trace): record the ratchet after the marker-to-entity rename
85546c5 fix(osh): address spec and STE review findings on osh-marker-depth
ba5ff1a chore(trace): record the ratchet for osh-marker-depth
```

`9b26215` is the parent of `ba5ff1a`.

**Verdict confirmed to hold at `5f16e15`** ("fix(osh): close the three
spec-adversary blockers on osh-marker-depth"), three commits later, by reading
`git diff 491213e 5f16e15 -- src/`. That diff is two test titles, one assertion
message string and two comments: no assertion expression, no fixture, no
control flow and no property value changed, and `entityAlwaysOnTop`'s body is
byte-identical. Where this file quotes a test title, an assertion message or a
task's mutation wording, it quotes it **as `5f16e15` reads**, so the citation
stays greppable; the surrounding reasoning is the reading of `491213e`.

I wrote nothing in any clone and started no container. I ran no tests: the
worktree has no `node_modules`, so every statement below is from reading the
trees, not from an execution. Coverage and the gate verdict are the
implementer's runs, not mine.

The change MODIFIES no scenario, so no `git show main:` base quote was needed.

---

## What holds

**The depth and height rules are applied at every site the design names.**
`entityAlwaysOnTop()` (`src/layers/osh/index.js:33`) sets
`Number.POSITIVE_INFINITY` and `Cesium.HeightReference.NONE`, and it wraps five
constructions: the system point and label (`:450`, `:457`), the re-added
selected point (`:482`), and the feature point (`:505`) and label (`:512`). The
re-add reuses `selectedSystemEntity.label`, which Cesium's `label` property
descriptor assigns through as the same `LabelGraphics` instance, so the values
survive the reuse. Five of five; nothing was missed.

**`osh-045` is not broken by the helper.** The feature label's
`distanceDisplayCondition` sits inside the object literal passed to
`entityAlwaysOnTop()`, and the helper mutates and returns that same object, so
the 200 km rule survives verbatim. Entity ids, `properties`, the click handler
and every stats counter are untouched by the diff, so `osh-029`, `osh-057` and
the `osh-005` file counts are unaffected. `src/data/iconOrientation.js` imports
only `cesium`, so adding it to the `osh-layer` package boundary pulls in no
transitive module.

**The rendering assertions compare against outside values, not the layer's.**
The test file imports exactly `createOshLayer` from the layer
(`src/data/oshLayer.test.mjs:4`) and `OSH_FRESH_MAX_AGE_MS` from
`oshObservations.js`. Every new assertion compares against the literal
`Infinity`, against `Cesium.HeightReference.NONE` (Cesium's own enum, value 0,
distinct from `CLAMP_TO_GROUND`'s 1), or against a fixture's own number read
back through `Cesium.Cartographic.fromCartesian` — `100` from
`aircraftLocation()`, `250` from the observation literal, `75` from
`FEATURE_ALT`. No assertion reads its expected value from the code under test.
The defect this project has shipped four times is not present here.

**The horizon pass is pinned with the real occluder.** Nothing stubs
`horizonOccluder`, so the tests run the module singleton
`new Cesium.EllipsoidalOccluder(Cesium.Ellipsoid.WGS84, …)` at
`src/data/iconOrientation.js:103`. The camera sits at (1, 2, 1 500 000) and the
new fixtures at (-179, -2) are the exact antipode, so the geometry is not
marginal — 180 degrees against a ~36 degree half-angle. It fails in both
directions: the refresh test asserts `true` on a near system and a near feature
and `false` on a far system and a far feature, and the `moveEnd` test asserts
the pair swaps after `setCamera(-179, -2, …)`. An always-true horizon pass
reddens the far assertions, an always-false one the near, an inverted
`isPointVisible` both.

**The camera addition does not disturb the existing suite.** `fakeViewer()` is
the only viewer the file constructs — 76 call sites, no bare object literal
passed to `init()` — so every `init(viewer)` finds the `camera.moveEnd` event
the layer now needs. Every pre-existing fixture lies inside the new camera's
horizon; the farthest, `aircraftLocation()` at (10, 20), is about 20 degrees
out. `FEATURE_ALT` at (5, 6) is about 5.6 degrees out, so it is drawn and
`show` stays `true` for the assertion that reads its altitude.

**The no-guard claim in `refreshHorizonVisibility()` is true.** All three
`entities.add` sites (`:446`, `:478`, `:497`) pass a position, and they are the
only ones, so `entity.position.getValue(now)` cannot be reached on an entity
without a position.

**The rename is complete and the trace was re-recorded for it.** No occurrence
of `marker` survives in `src/layers/osh/` or in the change's `specs/osh/spec.md`.
Both scenario titles changed, which rehashes both scenarios; `8aa3421` follows
the rename commit `85546c5` and updates the `osh-061` and `osh-062` hashes in
`openspec/trace/ids.json`, and `links.json` gained the new feature-altitude
test. The commit order is right. I did not recompute the hashes themselves.

## The two mutations I checked by reading

I picked the two I most expected to be hollow.

**M4 — "remove the helper from the re-added point".** Not hollow. In the
`[osh-061] the re-added entity for a selected system draws on top, on its point and its label`
test the
second refresh returns empty systems, fois and locations, so `placed.systems`
is empty and the system loop runs zero times. The re-add guard at `:477`
(`_selectedId && !placedIds.has(_selectedId) && selectedSystemEntity &&
selectedPosition`) is satisfied, and the block at `:478` is the only source of
`osh:sys-fixture-9` in that refresh. Removing `entityAlwaysOnTop` there leaves
`entity.point.disableDepthTestDistance` undefined and the `.getValue` call
throws. The test reddens.

**M11 — the poll's re-test.** Not hollow, and still not hollow after the hoist.
In the `[osh-062]` poll test the other two call sites are unreachable between
the assertions: `update()` is called once before the selection and never again,
and no `moveEnd` is raised. `t.mock.timers.tick(15_000)` drives only the
`setInterval` at `:206`. So with the post-loop call at `:167` removed,
`entity.show` keeps the `true` the `update()` pass left it at, and
`assert.equal(entity.show, false, 'the poll carried it past the horizon')`
fails, in
`[osh-062] a poll move across the horizon hides the selected entity, and a later move back shows it`.

I also read M9, M10, M12, M13 and M14 against the code and each reddens a named
assertion. I did not check M1, M2, M3, M5, M6, M7 or M8 individually; they are
direct value mutations against assertions I read.

## The two findings, and how they were closed

- [x] FINDING minor `osh-061`'s label clause was unasserted for the re-added selected entity — the one site whose mechanism is reuse rather than the helper. The scenario's WHEN covers "the entity it re-adds for a selected system", and its second THEN says "a label on that entity carries `disableDepthTestDistance` equal to positive infinity". At `9b26215` the re-added-entity test asserted only `entity.point`. The reused label at `src/layers/osh/index.js:491` carried the values by inheritance from a previous refresh's `LabelGraphics`, not from `entityAlwaysOnTop`, and no M1-M12 mutation touched it; `osh-draw-unheld-features` is named in the proposal as adding a fourth construction to this same file, so a later refactor of the re-add could have reintroduced the submerge for the selected system's label with nothing reddening. Closed at `85546c5`: the test now asserts `entity.label.disableDepthTestDistance` against `Infinity` and `entity.label.heightReference` against `Cesium.HeightReference.NONE`, with a comment naming why that site differs, and M13 replaces `label: selectedSystemEntity.label` with a new literal. Verified the label exists in that fixture: the system is a stream-placed placeholder with no record in the union map, so `labelText` falls to `record.streamSystemName || record.id` and is non-null, and the first refresh builds that label through the helper. The assertions therefore run rather than passing vacuously on an undefined label.
- [x] FINDING minor `osh-061`'s altitude clause was unasserted for a feature entity, and the feature altitude expression was mutation-proof. The scenario's WHEN covers "a feature entity" and its fourth THEN says "the entity's position keeps the altitude its record carries". At `9b26215` every feature fixture — `FEATURE_A`, `FEATURE_ORPHAN`, `FEATURE_NO_HOST`, `FEATURE_NO_NAME` and the new `FEATURE_FAR` — carried `alt: 0`, so mutating `feature.alt || 0` at `src/layers/osh/index.js:506` to a bare `0` reddened nothing: the clause was true of the code and untestable by the suite. M6 mutates only the system-side `record.alt || 0`. Closed at `85546c5`: `FEATURE_ALT` carries `alt: 75` at (5, 6), the new `[osh-061] a feature entity keeps its own altitude` test reads the height back through `Cesium.Cartographic.fromCartesian` and compares against the fixture's own `75`, and M14 mutates `feature.alt || 0` to `0`. The fixture's host is `sys-fixture-1`, which the default `fakeSource()` systems supply, so the feature is placed.

## The hoist, read specifically

`refreshHorizonVisibility()` moved out of the `for (const datastream of
datastreams)` loop and now runs once after it (`src/layers/osh/index.js:167`).
D61 was reworded to match rather than left to drift, and task 4.2 records the
new placement. I read it for two things.

**No null-dereference window opens.** The horizon pass reads `_viewer.camera`
and `_dataSource.entities`, both of which `destroy()` nulls. The guard before
the loop returns on a generation change, and the last guard inside the loop runs
after that iteration's `await` — so on both the empty-`datastreams` path and the
full-loop path there is no `await` between the final generation check and the
post-loop call. `destroy()` and `disable()` both reach `stopPolling()` through
`clearSelection()`, which cannot take its own early return while a poll is in
flight, because a poll only starts with `_selectedId` set. The pass cannot run
against a torn-down layer.

**One behaviour changed beyond the call count, and it is bounded.** The pass is
now skipped when the loop takes its early `return` on a generation change. So a
selection change landing between two datastream awaits, on a cycle where an
earlier datastream had already carried the selected entity across the horizon,
leaves that entity's `show` stale — it draws through the planet until the next
`update()` or the next camera settle. Before the hoist the pass had already run
for that earlier move. The window is narrow and self-healing, and a `finally`
would be the wrong fix, since running the pass after a teardown-driven
generation bump is exactly the null dereference the paragraph above rules out.

I am **not raising this as a finding**. It is the same staleness, with the same
bound, that `osh-horizon-on-settle-only` already names and accepts. My
suggestion is one clause added to that limit — that an aborted poll leaves the
entity it had already moved in its last state until the next refresh or settle
— so the accepted limit covers the case in writing. Say the word if you would
rather have it as a minor.

## Notes that are not findings

1. **`osh-hidden-entity-unpickable` now names the click interaction** I raised
   in round 1: an entity the horizon pass hides stops answering a click,
   because `scene.pick()` skips `show:false`. Correct behaviour, correctly
   recorded as a limit rather than silently accepted.

2. **D63's fixture claim was narrowed correctly.** It said "every current
   fixture stays visible"; it now names only `SYSTEM_A`, `SYSTEM_B` and
   `FEATURE_A`, the fixtures the tests actually assert `show` on. Both readings
   are true today — I checked every fixture against the ~36 degree half-angle —
   but the narrower claim is the one a later fixture cannot falsify by
   accident.

3. **`destroy()` still removes the listener only inside `if (_dataSource &&
   viewer)`** (`:573`), while `_moveEndListener = null` runs unconditionally
   just after, so a `destroy()` with no viewer would leave a live listener over
   a null `_viewer`. Nothing in `src/` calls a layer's `destroy` at all — it is
   exercised only by tests, which always pass the viewer — so this is
   unreachable today. The project's other five `moveEnd` users
   (`src/layers/traffic/lifecycle.js:103`, `src/layers/military/state.js:257`,
   `src/overlays/worldOverlay.js:2214`, `src/scopeMask.js:444`,
   `src/hud.js:134`) keep the remover callback that `addEventListener` returns
   rather than the listener function, which is immune to this shape. Still not
   worth changing for this defect fix.

Verdict: PASS
