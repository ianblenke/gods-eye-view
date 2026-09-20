## Context

`src/layers/osh/index.js` builds three entities in a `CustomDataSource`. The system entity is built at about line 404. The re-added entity for a selected system that this refresh did not place is at about line 436. The feature entity is at about line 453.

Each has a `point`. Two build a `label` when a name exists, and the re-add reuses the label object of the entity it replaces. None of the three sets `disableDepthTestDistance` or `heightReference`.

Cesium applies the depth test to a point and a label by default. The Google-3D mesh at a coarse far LOD sits above the true ground. So the mesh hides a marker on the ground, and the owner sees the marker disappear. The cctv layer recorded this at `src/layers/cctv/lifecycle.js:145` after a field test on 2026-07-06. It also recorded why a finite distance is not the fix.

A marker that never takes the depth test also draws through the globe from the far side. The cctv and firms layers hide such icons with an `EllipsoidalOccluder`. This project already shares the occluder: `src/data/iconOrientation.js:226` exports `horizonOccluder(camera)`. The pass that walks the icons is per layer, because each layer holds a different collection.

Terms: `on top` means the marker never takes the depth test. `horizon pass` means the walk that sets `show` from the occluder. `settle` means the camera's `moveEnd` event.

## Goals / Non-Goals

**Goals:**
- Draw every OSH marker on top of the terrain and the mesh, at every distance.
- Keep the altitude of every marker as its record gives it.
- Hide every marker beyond the ellipsoid horizon, and show it again when the camera sees it.
- Pin each of these with a test that a named mutation reddens.

**Non-Goals:**
- Change an entity id, a label rule, the click handler or a stats count. `osh-029`, `osh-045` and `osh-057` pin them.
- Move a rule into a shared module. D62 gives the reasons.
- Run the horizon pass on every frame. The camera's `moveEnd` is the cadence cctv and firms use.

## Decisions

### D59 On top at every distance, weighed against the finite windows this project ships

The point and the label of every OSH entity get `disableDepthTestDistance` equal to positive infinity. The label gets it too, because a label that sinks while its point shows is the same defect in a smaller shape.

This project ships two measured answers to the same symptom, not one. Six layers use positive infinity, and cctv recorded why after 1800 metres failed at far zoom. Traffic's live jam dots use a 15 000 metre window, from `src/layers/traffic/policy.js:176`. Its note records the measurement: one A/B capture drew 396 jam dots, and none was visible under the shipped 2000 metre window. So the facts file's line that cctv rejected a finite value "once already" is true of 1800 metres and false of 15 kilometres. Traffic's window works, and a window needs no horizon pass at all.

The depth test does not compare pixel sizes. It compares distances. A marker below the drawn surface fails the test at every camera distance beyond its window, however small it draws. So a finite window works only when the marker sits close to the surface.

Traffic's dots do. `src/layers/traffic/model.js:106` samples the scene height for each road. So a dot's burial is the gap between one sample and the mesh, metres to tens of metres. Beyond 15 kilometres a jam dot is a city-scale thing nobody reads, so the window covers traffic's whole use envelope.

An OSH marker sits at `record.alt || 0`, and the layer samples no ground. A record with no altitude, or with zero, draws at the ellipsoid. On land the drawn surface sits above the ellipsoid by the geoid height plus the terrain height, from tens of metres to thousands. That burial is unknown per record and unbounded. At whole-globe zoom the loaded surface is near the ellipsoid, so the marker shows; as the camera zooms in the surface rises and buries it. That is the symptom the owner reported, and it is why the marker shows from space and vanishes near.

So a window for OSH must reach past every distance at which the loaded surface rises above the marker. Feature labels show out to 200 km under `osh-045`, and system labels at any distance, so the owner reads the layer at every zoom. No window this project could name covers that envelope, and no measurement in this repository could set one. Only a marker that never takes the depth test is free of the burial depth. That is the claim a reader can check. Show that OSH records carry a true altitude, or add a ground sample, and a window is an option again.

The two field measurements differ because the two layers differ, not because one of them erred. Traffic's dots sit on a sampled surface and serve a city-scale view, so one window clears the mesh at every zoom that layer serves. OSH markers sit at an unsampled datum and serve a global view, so the far zooms that defeated cctv's 1800 metres defeat any window here. A later change that wants to replace positive infinity with a number must first give OSH markers a ground sample.

Rejected: a finite window, at 15 kilometres or another value. The burial of an OSH marker has no bound and no measurement, so the window would have to cover every zoom. Rejected: no change to the depth property. That is the defect. The cost of the horizon pass is small: pure math over the layer's own entities, on camera settle only. Firms runs the same pass over thousands of sprites per rebuild.

### D60 Keep the altitude, and set `heightReference` to `NONE` at the site

The point and the label get `heightReference` equal to `NONE`. That is Cesium's default, so the value changes nothing. It is set on purpose, so a reader sees the decision at the site and a test can pin it against a clamp.

The layer keeps the altitude for every marker. A position is built from `record.alt || 0`, and the poll moves the selected entity with `observation.location.alt || 0`. Both keep that shape.

Rejected: `CLAMP_TO_GROUND`, as earthquakes and firms use. Both of those set it on an ellipse or a rectangle, not on a point marker. No layer in this project clamps a point marker. A clamp discards the altitude, which is wrong for an aircraft track at 10 000 metres that the location pass now places. It is also wrong for a mesh node on a mast. It is right only for an installation whose record carries no altitude.

Rejected: a mixed rule that clamps when `alt` is null or zero and keeps a non-zero altitude. A record does not say what kind of system it places. `locationSource` says only whether a stream or a geometry placed it, and a fixed camera can report through a stream. An aircraft on the ground reports an altitude near zero, and `|| 0` already folds null into zero. So the rule cannot tell the two cases apart. It would also have to run again on every poll move, because the altitude changes with each observation.

Rejected: `RELATIVE_TO_GROUND`. A record's altitude is absolute. A relative reference adds the ground height to it, so a marker on a 1000-metre plateau would draw 1000 metres too high.

One rule serves both kinds. Traffic splits its window between live jam dots and simulated dots, two populations with different priorities and the same physics. An installation at the ground and an aircraft at altitude differ in physics, and still need no split. Only the planet stands between an airborne marker and the camera, and the horizon pass handles the planet, so the depth test adds nothing. A split would need an altitude threshold that no record lets the layer measure. And the poll would have to apply it again on every move, because the altitude changes with each observation.

### D61 Hide a marker beyond the horizon, through the shared occluder

The layer gets one horizon pass. It reads the occluder from `horizonOccluder(_viewer.camera)`. It walks `_dataSource.entities.values`. For each entity it reads the position at the current `JulianDate` and sets `entity.show` from `occluder.isPointVisible(position)`. It writes `show` without a same-value guard, because Cesium's `Entity.show` setter returns early for an unchanged value. The implementer confirms this in the Cesium source before the guard is left out.

The pass runs at three points. It runs from the camera's `moveEnd` listener. It runs at the end of the draw loop in `update()`, because a new entity starts with `show:true` and the camera has not moved. And the poll re-tests the one entity it moves, right after it sets the position, because that entity can cross the limb between refreshes.

`init()` adds the listener and `destroy()` removes it. It stays while the layer is off. So a camera that moves while the layer is off still updates the `show` flags, and `enable()` shows a correct set. The `moveEnd` event is a `Cesium.Event`, and the test can count its listeners.

The occluder is a shared singleton, and the pass sets its camera position on every call. That is the contract every other caller of `horizonOccluder()` already accepts.

Rejected: positive infinity alone, with no pass. The fix is cheap and the far-side markers draw through the planet. That is visible from space and is the exact failure cctv's comment names.

Rejected: a shared horizon pass. cctv and firms each walk a `BillboardCollection`, by record and by index. This layer walks an `EntityCollection`, and an entity reads its position through a property, not a field. A shared pass needs an abstraction over both shapes and a change to two layers that their own specs pin. That is a refactor for its own change, not a side effect of a defect fix.

### D62 One local helper, and no shared module

`index.js` gets one module-level function. It takes a graphics object and returns it with the two properties from D59 and D60 added. The three point constructions and the two label constructions pass through it. The re-add reuses the label object of the entity it replaces, so that label already carries the values.

Rejected: a shared helper in `src/data/`. Eight layers set the literal in place today, and none imports a helper for it. A helper in `src/data/osh*.js` adds a sixth file and breaks the count `osh-005` pins. A helper elsewhere in `src/data/` is a project-wide change that this defect does not justify. The one shared thing this change needs, the occluder, exists already.

### D63 How a named mutation reddens the test of each behaviour

A test that reads the value from the code and compares it with the same value proves nothing. So the test file imports nothing from `src/layers/osh/index.js` other than `createOshLayer`. Each assertion compares with the literal the specification names:
- The test compares the depth distance with the literal `Infinity`. A mutation to `1800`, or the removal of the property, reddens it.
- The test compares the height reference with `Cesium.HeightReference.NONE`, which is Cesium's own enum and not a value from the layer. A mutation to `CLAMP_TO_GROUND` reads `1` and reddens it.
- The altitude is read back through `Cesium.Cartographic.fromCartesian()` and compared with the fixture's own number, `100`. A mutation of `record.alt || 0` to `0` reddens it.
- Each of the three constructions gets its own assertion, so the removal of the helper from one site reddens one named test.

The real occluder, not a stub, pins the horizon pass. The fake viewer gets a camera with `positionWC` at 1 500 000 metres over the first system fixture, at longitude 1 and latitude 2. That is the same repro height the firms horizon test uses. Two new fixtures sit at the antipode, longitude minus 179 and latitude minus 2. From that camera the horizon half-angle is about 36 degrees, so every current fixture stays visible and the occluder hides the antipode. A pass that always shows, always hides, or inverts the test reddens one of the two assertions.

The three cadences get one test each. A `moveEnd` raised on the fake event, a refresh under a camera that has not moved, and a poll move across the limb. `numberOfListeners` on the fake `Cesium.Event` pins the listener's lifetime: one after `init()`, still one after `disable()`, zero after `destroy()`.

The task list names twelve mutations, M1 to M12. The implementer runs each one, records which test reddened, and reports a mutation that no test reddened as a finding.

### D64 How the gates measure this change

Coverage: `src/layers/osh/index.js` is at 100% line, branch and function coverage now and must stay there. The horizon pass has no guard branch, so it adds no branch. The helper has none either.

Trace: the change ADDS `osh-061` and `osh-062`, and each gets at least one test tagged with its id. The change MODIFIES no scenario, so no old id needs a changed test. Spec lint and STE lint run as they do for every change. The pinned file counts under `osh-005` hold, because the change adds no file.
