## Why

The owner reported on 2026-09-20 that OSH entities disappear as the camera zooms in. They do not draw on top of the tiles. The cause is in `src/layers/osh/index.js`. It builds three entities, and none of them sets `disableDepthTestDistance` or `heightReference`. So the depth test hides each entity behind the terrain and behind the Google-3D mesh.

Every other layer that draws a ground-anchored icon sets one of the two properties. The OSH layer sets neither, and the cctv layer met this exact symptom in a field test on 2026-07-06. Its comment at `src/layers/cctv/lifecycle.js:145` records the fix and the trade: a finite distance let the depth test hide the icon again at far zoom. Traffic met it too and chose a 15 kilometre window, from a measured capture, for dots it samples onto the road surface. An OSH entity samples no ground, so its burial under the surface has no bound, and no window covers it. D59 weighs both precedents, and the design keeps the entity out of the depth test at every distance.

This change gives every OSH entity the same two rules. The entity draws on top at every distance. A horizon pass over the layer's entities hides each one beyond the ellipsoid horizon. The horizon pass reads the occluder this project already shares from `src/data/iconOrientation.js`.

An OSH position carries an altitude. The location pass places aircraft tracks, mesh nodes and fixed installations, and a record does not say which kind it is. So this change keeps the altitude for every entity and never clamps an entity to the ground. The design gives the reasons under D60.

This change's own name, `osh-marker-depth`, still carries the word this proposal now avoids. `osh-geo-discovery`, round 3, dropped `marker` from this repository's entity sense. `entity` is the project's word. The folder keeps its name. A rename now costs more than the drift it would fix, because the folder name is not spec text and no scenario names it.

## What Changes

- Set `disableDepthTestDistance` to positive infinity on the point and the label of every OSH entity. That is the system entity, the re-added selected entity and the feature entity.
- Set `heightReference` to `NONE` on the same point and label, so the decision to keep the altitude is visible at the site.
- Add one horizon pass to the layer. It sets `show` on each entity from the shared occluder. It runs on the camera's `moveEnd`, after each refresh draws the entities, and after the poll moves the selected entity.
- Add the `moveEnd` listener at `init()` and remove it at `destroy()`. The listener stays while the layer is off, so the `show` flags are current at the next `enable()`.
- Give the layer test's fake viewer a camera with `positionWC` and a `moveEnd` event. Add two fixtures at the antipode of the first system fixture.
- No provider change. No request change. No new file. No requirement text change. No change to an entity id, a label rule, the click handler or a stats count.

## Impact

- Changed file, at 100% coverage now and after the edit: `src/layers/osh/index.js`.
- Changed test file: `src/data/oshLayer.test.mjs`.
- No new source file. The pinned counts under `osh-005` hold: five files match `src/data/osh*.js` before and after.
- This change ADDS one requirement, with `osh-061` and `osh-062`. It MODIFIES no requirement and changes no scenario body.
- No gap opens or closes in `openspec/trace`.
- The map draws every OSH entity on top of the terrain and the mesh at every zoom. The horizon pass hides an entity on the far side of the globe.
- The change `osh-draw-unheld-features` has a plan and no folder yet. It adds a fourth entity construction to the same file. The later of the two changes applies the two rules to that construction as well.

## Known limits closed

None by name. The defect had no limit name, because no scenario said what an entity's depth rule was.

## Known limits left open

- `osh-entity-through-near-structure`: an entity on top at every distance draws through a structure or a hill that stands between it and the camera. The cctv field test accepted this trade for the same reason. A finite distance let the depth test hide the icon again at far zoom. Traffic's 15 kilometre window avoids the trade only because its dots sit on the sampled road surface.
- `osh-hidden-entity-unpickable`: an entity the horizon pass hides also stops answering a click. `scene.pick()` skips an entity whose `show` is `false`. So a system or feature beyond the horizon is not selectable until the camera brings it back into view. This is correct behaviour. It is a real interaction with `osh-029`'s click handler that no scenario names.
- `osh-ground-entity-at-datum`: a record with `alt:0` or no altitude draws at the ellipsoid, not on the terrain. On high ground the entity sits below the surface. It still draws, but an oblique view shows it offset from the true ground. A clamp would correct this for a fixed installation and would discard the altitude of an aircraft, as D60 says. A ground sample per entity, as cctv, firms and traffic take, is the real fix, for a later change.
- `osh-horizon-on-settle-only`: the horizon pass runs when the camera settles, not on every frame. An entity that crosses the horizon during one camera motion keeps its last state until `moveEnd`. The cctv layer runs on the same cadence. A poll cycle that changes selection partway through skips the horizon pass entirely for that cycle. An earlier datastream in the same cycle can have already moved the selected entity. That entity keeps that `show` value until the next refresh or the next `moveEnd`.
- `osh-no-live-test`: unchanged. No test draws in a real scene. The tests prove the property values and the occluder's own answer. The owner's field test is the proof that the symptom is gone.
