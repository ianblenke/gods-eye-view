import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';
import {
  coherentCycloneGeometry,
  createCycloneRendering,
} from './rendering.js';
import { CYCLONE_OVERLAY_SOURCE_ID } from './labels.js';

/** Records what the renderer publishes to the shared overlay host. */
function overlayRecorder() {
  const calls = [];
  return {
    calls,
    host: {
      setEntries: (source, entries, options) =>
        calls.push({ kind: 'entries', source, entries, options }),
      setVisible: (source, visible) =>
        calls.push({ kind: 'visible', source, visible }),
      clearSource: (source) => calls.push({ kind: 'clear', source }),
    },
    get publishes() {
      return calls.filter(({ kind }) => kind === 'entries').length;
    },
    published() {
      return calls.findLast(({ kind }) => kind === 'entries')?.entries || [];
    },
    entry(id) {
      return this.published().find((entry) => entry.id === id) || null;
    },
  };
}

function harness({ deferred = false } = {}) {
  const sources = [],
    completions = [],
    pointOccluders = [],
    sphereOccluders = [];
  const listeners = new Set();
  const visibility = {
    points: new Map(),
    spheres: new Map(),
    pointCalls: [],
    sphereCalls: [],
    writes: 0,
  };
  const color = (value) => ({
    value,
    withAlpha: (alpha) => ({ value, alpha }),
  });
  const cesium = {
    Color: {
      fromCssColorString: color,
      WHITE: color('white'),
      BLACK: color('black'),
    },
    Cartesian2: class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    },
    Cartesian3: {
      ZERO: { x: 0, y: 0, z: 0 },
      fromDegrees: (lon, lat, height) => ({ lon, lat, height }),
    },
    Ellipsoid: { WGS84: { minimumRadius: 6356752 } },
    EllipsoidalOccluder: class {
      constructor(ellipsoid, cameraPosition) {
        this.ellipsoid = ellipsoid;
        this.cameraPosition = cameraPosition;
        pointOccluders.push(this);
      }
      isPointVisible(position) {
        visibility.pointCalls.push(position);
        return visibility.points.get(position) ?? true;
      }
    },
    Occluder: class {
      constructor(sphere, cameraPosition) {
        this.sphere = sphere;
        this.cameraPosition = cameraPosition;
        sphereOccluders.push(this);
      }
      isBoundingSphereVisible(sphere) {
        visibility.sphereCalls.push(sphere);
        return visibility.spheres.get(sphere) ?? true;
      }
    },
    PolygonHierarchy: class {
      constructor(positions, holes = []) {
        this.positions = positions;
        this.holes = holes;
      }
    },
    BoundingSphere: class {
      constructor(center, radius) {
        this.center = center;
        this.radius = radius;
      }
      static fromPoints(points) {
        return { points, radius: 10 };
      }
    },
    LabelStyle: { FILL_AND_OUTLINE: 1 },
    HorizontalOrigin: { LEFT: 1 },
    ArcType: { GEODESIC: 1 },
    HeightReference: Cesium.HeightReference,
    ClassificationType: Cesium.ClassificationType,
    DistanceDisplayCondition: Cesium.DistanceDisplayCondition,
    CustomDataSource: class {
      constructor() {
        const values = [];
        this.entities = {
          values,
          add: (value) => {
            let show = true;
            Object.defineProperty(value, 'show', {
              get: () => show,
              set: (next) => {
                show = next;
                visibility.writes++;
              },
            });
            values.push(value);
            return value;
          },
          removeAll: () => {
            values.length = 0;
          },
        };
      }
    },
  };
  let renders = 0;
  const overlay = overlayRecorder();
  const viewer = {
    camera: { positionWC: { x: 6378487, y: 0, z: 0 } },
    scene: {
      requestRender: () => renders++,
      preRender: {
        addEventListener(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      },
    },
    dataSources: {
      add(value) {
        if (deferred)
          return new Promise((resolve) =>
            completions.push(() => {
              sources.push(value);
              resolve(value);
            }),
          );
        sources.push(value);
        return Promise.resolve(value);
      },
      remove(value) {
        const i = sources.indexOf(value);
        if (i >= 0) sources.splice(i, 1);
      },
    },
  };
  return {
    rendering: createCycloneRendering({
      viewer,
      cesium,
      overlayHost: overlay.host,
    }),
    overlay,
    sources,
    completions,
    viewer,
    cesium,
    visibility,
    pointOccluders,
    sphereOccluders,
    listeners,
    frame() {
      for (const listener of listeners) listener();
    },
    get renders() {
      return renders;
    },
  };
}
const storm = () => ({
  id: 'ep152026',
  name: 'Fifteen-E',
  advisoryNumber: '10',
  geometryAdvisoryNumber: '10',
  geometryStatus: 'current',
  position: { longitude: 179, latitude: 15 },
  forecastPoints: [
    { position: { longitude: -179, latitude: 16 }, tauHours: 12 },
  ],
  track: {
    type: 'MultiLineString',
    coordinates: [
      [
        [179, 15],
        [-179, 16],
      ],
    ],
  },
  cone: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [178, 10],
          [-178, 10],
          [-178, 20],
          [178, 10],
        ],
        [
          [179, 12],
          [-179, 12],
          [-179, 14],
          [179, 12],
        ],
      ],
      [
        [
          [170, 1],
          [171, 1],
          [171, 2],
          [170, 1],
        ],
      ],
    ],
  },
});

test('[cyclones-014] horizon culling updates only changed entities and keeps selection independent', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [storm(), { ...storm(), id: 'near' }],
  });
  const entities = h.sources[0].entities.values;
  const far = entities.filter((e) => e.id.startsWith('cyclone:ep152026:'));
  const near = entities.filter((e) => e.id.startsWith('cyclone:near:'));
  const forecast = far.find((e) => e.id.endsWith('forecast:0'));
  const sphere = h.rendering.getFocusSphere('ep152026');
  for (const entity of far)
    if (entity.position) h.visibility.points.set(entity.position, false);
  h.visibility.spheres.set(sphere, false);
  h.rendering.setSelection('ep152026');
  const publishes = h.overlay.publishes;
  const before = h.renders;
  h.frame();
  assert.ok(far.every((e) => e.show === false));
  assert.ok(near.every((e) => e.show === true));
  assert.equal(
    h.overlay.entry('lead:ep152026:12').position,
    forecast.position,
    'the host culls labels at the same anchors the points use',
  );
  assert.equal(h.overlay.publishes, publishes, 'culling never republishes');
  assert.equal(h.renders, before + 1);
  assert.equal(h.visibility.writes, far.length);
  assert.equal(h.visibility.pointCalls.length, 4);
  assert.deepEqual(h.visibility.sphereCalls, [
    sphere,
    h.rendering.getFocusSphere('near'),
  ]);
  h.frame();
  assert.equal(h.renders, before + 1);
  assert.equal(h.visibility.writes, far.length);

  // A visible portion of the extent keeps all tracks/cones shown even when
  // the centre and an individual forecast point remain beyond the horizon.
  h.visibility.spheres.set(sphere, true);
  h.viewer.camera.positionWC = { x: 0, y: 6378487, z: 0 };
  h.frame();
  assert.ok(far.filter((e) => !e.position).every((e) => e.show));
  assert.ok(far.filter((e) => e.position).every((e) => !e.show));
  assert.equal(h.renders, before + 2);
  assert.equal(h.pointOccluders.length, 1);
  assert.equal(h.sphereOccluders.length, 1);
  assert.equal(h.pointOccluders[0].ellipsoid, h.cesium.Ellipsoid.WGS84);
  assert.equal(h.pointOccluders[0].cameraPosition, h.viewer.camera.positionWC);
  assert.equal(h.sphereOccluders[0].cameraPosition, h.viewer.camera.positionWC);

  h.rendering.setSelection('near');
  assert.equal(h.overlay.entry('lead:ep152026:12'), null);
  assert.equal(
    h.overlay.entry('lead:near:12').position,
    near.find((e) => e.id.endsWith('forecast:0')).position,
  );
  h.visibility.points.set(forecast.position, true);
  const beforeReveal = h.renders;
  const revealPublishes = h.overlay.publishes;
  h.frame();
  assert.equal(forecast.show, true);
  assert.equal(h.overlay.entry('lead:ep152026:12'), null);
  assert.equal(h.overlay.publishes, revealPublishes);
  assert.equal(far[0].show, false);
  assert.equal(h.renders, beforeReveal + 1);
  h.rendering.destroy();
});

test('[cyclones-014 cyclones-017] horizon listener follows committed nonempty snapshots and clear/destroy', async () => {
  const h = harness();
  assert.equal(h.listeners.size, 0);
  await h.rendering.setSnapshot({ storms: [] });
  assert.equal(h.listeners.size, 0);
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(h.listeners.size, 1);
  const old = [...h.sources[0].entities.values];
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(h.listeners.size, 1);
  h.frame();
  assert.ok(
    h.visibility.pointCalls.every((p) => !old.some((e) => e.position === p)),
  );
  await h.rendering.setSnapshot({ storms: [] });
  assert.equal(h.listeners.size, 0);
  await h.rendering.setSnapshot({ storms: [storm()] });
  h.rendering.clear();
  assert.equal(h.listeners.size, 0);
  const before = h.renders;
  h.frame();
  assert.equal(h.renders, before);
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(h.listeners.size, 1);
  h.rendering.destroy();
  h.rendering.destroy();
  assert.equal(h.listeners.size, 0);
  assert.equal(await h.rendering.setSnapshot({ storms: [storm()] }), false);
  assert.equal(h.listeners.size, 0);
});

test('[cyclones-014 cyclones-016] late asynchronous additions never restore a cleared or destroyed horizon listener', async () => {
  for (const method of ['clear', 'destroy']) {
    const h = harness({ deferred: true });
    const pending = h.rendering.setSnapshot({ storms: [storm()] });
    assert.equal(h.listeners.size, 0);
    h.rendering[method]();
    h.completions.shift()();
    assert.equal(await pending, false);
    assert.equal(h.listeners.size, 0);
  }
});

test('[cyclones-014] real Cesium culls far storms and retains partially visible extents with either globe visibility', async () => {
  for (const globeShow of [true, false]) {
    const sources = [];
    const viewer = {
      camera: { positionWC: Cesium.Cartesian3.fromDegrees(0, 0, 350) },
      scene: {
        globe: { show: globeShow },
        preRender: new Cesium.Event(),
        requestRender() {},
      },
      dataSources: {
        async add(source) {
          sources.push(source);
        },
        remove() {},
      },
    };
    const overlay = overlayRecorder();
    const rendering = createCycloneRendering({
      viewer,
      cesium: Cesium,
      overlayHost: overlay.host,
    });
    const at = (id, longitude) => ({
      ...storm(),
      id,
      position: { longitude, latitude: 0 },
      forecastPoints: [{ position: { longitude, latitude: 0 }, tauHours: 24 }],
      track: {
        type: 'LineString',
        coordinates: [
          [longitude, 0],
          [longitude, 1],
        ],
      },
      cone: {
        type: 'Polygon',
        coordinates: [
          [
            [longitude, 0],
            [longitude + 1, 0],
            [longitude, 1],
            [longitude, 0],
          ],
        ],
      },
    });
    await rendering.setSnapshot({
      storms: [at('near', 0), at('far', 180), at('limb', 5)],
    });
    rendering.setSelection('near');
    viewer.scene.preRender.raiseEvent();
    const entities = sources[0].entities.values;
    for (const entity of entities.filter((e) => e.position)) {
      assert.equal(
        entity.point.heightReference.getValue(),
        Cesium.HeightReference.CLAMP_TO_GROUND,
      );
      assert.equal(entity.point.disableDepthTestDistance.getValue(), Infinity);
      assert.equal(entity.label, undefined, 'no Cesium label graphics');
      const published = overlay.entry(
        entity.id.includes(':forecast:')
          ? `lead:${entity.id.split(':')[1]}:24`
          : `storm:${entity.id.split(':')[1]}`,
      );
      if (entity.id.startsWith('cyclone:near:')) {
        assert.ok(
          Cesium.Cartesian3.equals(
            published.position,
            entity.position.getValue(),
          ),
        );
        assert.equal(published.horizonCull, true);
      }
      if (entity.id === 'cyclone:near:forecast:0')
        assert.equal(published.maxDistance, 4_000_000);
    }
    assert.ok(
      entities
        .filter((e) => e.id.startsWith('cyclone:near:'))
        .every((e) => e.show),
    );
    assert.ok(
      entities
        .filter((e) => e.id.startsWith('cyclone:far:'))
        .every((e) => !e.show),
    );
    const limb = entities.filter((e) => e.id.startsWith('cyclone:limb:'));
    assert.ok(limb.filter((e) => e.position).every((e) => !e.show));
    assert.ok(limb.filter((e) => !e.position).every((e) => e.show));
    rendering.destroy();
    assert.equal(viewer.scene.preRender.numberOfListeners, 0);
  }
});

test('[cyclones-015] picking accepts exact current owned entities, never prefixes or superseded identities', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const oldEntities = [...h.sources[0].entities.values];
  assert.equal(oldEntities.length, 8);
  for (const entity of oldEntities) {
    assert.equal(h.rendering.pickStorm({ id: entity }), 'ep152026', entity.id);
    assert.equal(h.rendering.ownsPickId(entity.id), true);
    assert.equal(
      h.rendering.pickStorm({ id: { ...entity } }),
      null,
      'copied ID is not ownership',
    );
    assert.equal(
      h.rendering.pickStorm({ id: entity.id }),
      null,
      'string prefix is not ownership',
    );
  }
  assert.equal(h.rendering.pickStorm(undefined), null);
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:unknown'), false);
  await h.rendering.setSnapshot({ storms: [storm()] });
  for (const entity of oldEntities)
    assert.equal(h.rendering.pickStorm({ id: entity }), null);
  const current = h.sources[0].entities.values[0];
  assert.equal(h.rendering.pickStorm({ id: current }), 'ep152026');
  h.rendering.clear();
  assert.equal(h.rendering.pickStorm({ id: current }), null);
  assert.equal(h.rendering.ownsPickId(current.id), false);
  h.rendering.destroy();
});

test('[cyclones-015 cyclones-016] registry IDs switch only when the next coherent data source commits', async () => {
  const h = harness({ deferred: true });
  const first = h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:center'), false);
  h.completions.shift()();
  await first;
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:center'), true);
  const next = h.rendering.setSnapshot({
    storms: [{ ...storm(), id: 'ep162026' }],
  });
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:center'), true);
  assert.equal(h.rendering.ownsPickId('cyclone:ep162026:center'), false);
  h.completions.shift()();
  await next;
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:center'), false);
  assert.equal(h.rendering.ownsPickId('cyclone:ep162026:center'), true);
  h.rendering.destroy();
  assert.equal(h.rendering.ownsPickId('cyclone:ep162026:center'), false);
});
test('[cyclones-012] static entities preserve polygon parts, holes and geographic seam coordinates', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const entities = h.sources[0].entities.values;
  const cones = entities.filter((e) => e.polygon);
  assert.equal(cones.length, 2);
  assert.equal(cones[0].polygon.hierarchy.holes.length, 1);
  assert.equal(cones[0].polygon.hierarchy.positions[1].lon, -178);
  for (const cone of cones) {
    assert.equal(
      cone.polygon.classificationType,
      h.cesium.ClassificationType.BOTH,
    );
    assert.equal(cone.polygon.height, undefined);
    assert.equal(cone.polygon.extrudedHeight, undefined);
    assert.equal(cone.polygon.outline, undefined);
  }
  const outlines = entities.filter((e) => e.id.includes(':outline:'));
  assert.equal(outlines.length, 3);
  assert.deepEqual(
    outlines.map((e) => e.polyline.positions.map((p) => [p.lon, p.lat])),
    storm().cone.coordinates.flat(),
  );
  for (const outline of outlines) {
    assert.deepEqual(outline.polyline.material, {
      value: '#7fe6ed',
      alpha: 0.55,
    });
  }
  for (const { polyline } of entities.filter((e) => e.polyline)) {
    assert.equal(polyline.clampToGround, true);
    assert.equal(polyline.classificationType, h.cesium.ClassificationType.BOTH);
    assert.ok(polyline.positions.every((p) => p.height === 0));
  }
  assert.equal(
    entities.find((e) => e.polyline).polyline.positions[1].lon,
    -179,
  );
  assert.deepEqual(h.rendering.getDiagnostics(), {
    storms: 1,
    tracks: 1,
    cones: 2,
    forecastPoints: 1,
    dataSources: 1,
    entities: 8,
    selectedId: null,
    timerActive: false,
  });
  h.rendering.setSelection('ep152026');
  assert.equal(
    h.overlay.entry('lead:ep152026:12').position,
    entities.find((e) => e.id.endsWith('forecast:0')).position,
  );
  assert.ok(entities.every((e) => e.label === undefined));
  assert.ok(h.rendering.getFocusSphere('ep152026').radius >= 500000);
  h.rendering.destroy();
  assert.equal(h.sources.length, 0);
  assert.equal(h.rendering.getDiagnostics().entities, 0);
});
test('[cyclones-012] pending or mismatched advisory geometry never renders even when supplied', async () => {
  for (const changed of [
    { geometryStatus: 'pending' },
    { geometryAdvisoryNumber: '9' },
  ]) {
    const h = harness();
    await h.rendering.setSnapshot({ storms: [{ ...storm(), ...changed }] });
    assert.equal(h.sources[0].entities.values.length, 1);
    assert.equal(h.rendering.getDiagnostics().tracks, 0);
    h.rendering.destroy();
  }
});
test('[cyclones-016] a data-source add settling after disable is removed, without a new owner', async () => {
  const h = harness({ deferred: true });
  const pending = h.rendering.setSnapshot({ storms: [storm()] });
  h.rendering.clear();
  h.completions.shift()();
  assert.equal(await pending, false);
  assert.equal(h.sources.length, 0);
  assert.equal(h.rendering.getDiagnostics().dataSources, 0);
});
test('[cyclones-016] superseded asynchronous additions cannot replace newer geometry', async () => {
  const h = harness({ deferred: true });
  const old = h.rendering.setSnapshot({ storms: [storm()] });
  const latest = h.rendering.setSnapshot({ storms: [] });
  h.completions[1]();
  assert.equal(await latest, true);
  h.completions[0]();
  assert.equal(await old, false);
  assert.equal(h.sources.length, 1);
  assert.equal(h.rendering.getDiagnostics().storms, 0);
  h.rendering.destroy();
});
test('aborting a pending add retains the prior complete source', async () => {
  const h = harness({ deferred: true });
  const initial = h.rendering.setSnapshot({ storms: [storm()] });
  h.completions.shift()();
  await initial;
  const controller = new AbortController();
  const update = h.rendering.setSnapshot(
    { storms: [] },
    { signal: controller.signal },
  );
  controller.abort();
  h.completions.shift()();
  assert.equal(await update, false);
  assert.equal(h.sources.length, 1);
  assert.equal(h.rendering.getDiagnostics().storms, 1);
  h.rendering.destroy();
});

test('[cyclones-013 cyclones-016 cyclones-017] labels publish committed anchors to the shared overlay and follow selection and clear', async () => {
  const h = harness({ deferred: true });
  const pending = h.rendering.setSnapshot({
    storms: [storm(), { ...storm(), id: 'near', name: 'Near' }],
  });
  assert.equal(h.overlay.calls.length, 0, 'nothing publishes before commit');
  h.completions.shift()();
  assert.equal(await pending, true);
  const entities = h.sources[0].entities.values;
  const center = (id) => entities.find((e) => e.id === `cyclone:${id}:center`);
  assert.deepEqual(
    h.overlay.calls
      .slice(0, 2)
      .map(({ kind, source, visible }) => [kind, source, visible]),
    [
      ['visible', CYCLONE_OVERLAY_SOURCE_ID, true],
      ['entries', CYCLONE_OVERLAY_SOURCE_ID, undefined],
    ],
  );
  assert.deepEqual(
    h.overlay.published().map((entry) => entry.id),
    ['storm:ep152026', 'storm:near'],
    'no selection, no lead-hour labels',
  );
  assert.equal(h.overlay.entry('storm:near').title, 'Near');
  assert.equal(h.overlay.entry('storm:near').position, center('near').position);

  h.rendering.setSelection('near');
  assert.equal(center('near').point.pixelSize, 12);
  assert.equal(center('ep152026').point.pixelSize, 9);
  assert.equal(h.overlay.entry('storm:near').variant, 'selected');
  assert.equal(h.overlay.entry('storm:ep152026').variant, 'card');
  assert.ok(h.overlay.entry('lead:near:12'));
  const publishes = h.overlay.publishes;
  h.rendering.setSelection('near');
  assert.equal(h.overlay.publishes, publishes, 'unchanged selection is quiet');

  // A refresh republishes the new anchors with the retained selection.
  const refresh = h.rendering.setSnapshot({
    storms: [{ ...storm(), id: 'near', name: 'Near' }],
  });
  h.completions.shift()();
  await refresh;
  assert.deepEqual(
    h.overlay.published().map((entry) => [entry.id, entry.variant]),
    [
      ['storm:near', 'selected'],
      ['lead:near:12', 'card'],
    ],
  );
  assert.equal(
    h.overlay.entry('storm:near').position,
    h.sources[0].entities.values[0].position,
  );

  // A superseded addition never publishes, and clear hides the source.
  const stale = h.rendering.setSnapshot({ storms: [storm()] });
  h.rendering.clear();
  const afterClear = h.overlay.calls.slice(-2);
  assert.deepEqual(afterClear, [
    { kind: 'clear', source: CYCLONE_OVERLAY_SOURCE_ID },
    { kind: 'visible', source: CYCLONE_OVERLAY_SOURCE_ID, visible: false },
  ]);
  h.completions.shift()();
  assert.equal(await stale, false);
  assert.equal(h.overlay.calls.at(-1), afterClear[1]);
  h.rendering.destroy();
  assert.equal(h.overlay.calls.at(-1), afterClear[1]);
});

const ids = (h) => h.sources[0].entities.values.map((entity) => entity.id);
const point = (h, id) =>
  h.sources[0].entities.values.find((entity) => entity.id === id);

test('[cyclones-012] each entity has the size, the color and the width of its kind', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const entity = (suffix) => point(h, `cyclone:ep152026:${suffix}`);
  const center = entity('center');
  assert.equal(center.name, 'Fifteen-E');
  assert.deepEqual(center.position, { lon: 179, lat: 15, height: 0 });
  assert.equal(center.point.pixelSize, 9);
  assert.equal(center.point.color.value, '#7fe6ed');
  assert.equal(center.point.outlineColor.value, 'black');
  assert.equal(center.point.outlineWidth, 2);
  assert.equal(center.point.disableDepthTestDistance, Infinity);
  assert.equal(
    center.point.heightReference,
    Cesium.HeightReference.CLAMP_TO_GROUND,
  );
  const track = entity('track:0');
  assert.equal(track.polyline.width, 2.5);
  assert.equal(track.polyline.material.value, '#7fe6ed');
  assert.equal(track.polyline.material.alpha, undefined);
  assert.equal(track.polyline.arcType, 1);
  assert.deepEqual(
    track.polyline.positions.map((p) => [p.lon, p.lat]),
    [
      [179, 15],
      [-179, 16],
    ],
  );
  const cone = entity('cone:0');
  assert.deepEqual(cone.polygon.material, { value: '#7fe6ed', alpha: 0.16 });
  assert.equal(cone.polygon.arcType, 1);
  assert.equal(cone.polygon.hierarchy.positions.length, 4);
  assert.equal(entity('cone:0:outline:0').polyline.width, 1);
  assert.equal(entity('cone:0:outline:1').polyline.width, 1);
  assert.equal(entity('cone:1:outline:0').polyline.width, 1);
  const forecast = entity('forecast:0');
  assert.deepEqual(forecast.position, { lon: -179, lat: 16, height: 0 });
  assert.equal(forecast.point.pixelSize, 5);
  assert.equal(forecast.point.color.value, 'white');
  assert.equal(forecast.point.outlineColor.value, 'black');
  assert.equal(forecast.point.outlineWidth, 1);
  assert.equal(forecast.point.disableDepthTestDistance, Infinity);
  assert.equal(
    forecast.point.heightReference,
    Cesium.HeightReference.CLAMP_TO_GROUND,
  );
  h.rendering.destroy();
});

test('[cyclones-012] the staged center starts at 9 px', async () => {
  const h = harness();
  let size;
  h.viewer.dataSources.add = (source) => {
    size = source.entities.values.find((entity) => entity.id === 'cyclone:ep152026:center').point.pixelSize;
    h.sources.push(source);
    return Promise.resolve(source);
  };
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(size, 9);
  h.rendering.destroy();
});

test('[cyclones-014] a refresh keeps one horizon listener', async () => {
  const h = harness();
  let adds = 0;
  const original = h.viewer.scene.preRender.addEventListener;
  h.viewer.scene.preRender.addEventListener = (listener) => {
    adds++;
    return original(listener);
  };
  await h.rendering.setSnapshot({ storms: [storm()] });
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(adds, 1);
  h.rendering.destroy();
});

test('[cyclones-017] after clear, a selection change leaves the removed center as it was', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const center = h.sources[0].entities.values.find((entity) => entity.id === 'cyclone:ep152026:center');
  h.rendering.clear();
  h.rendering.setSelection('ep152026');
  assert.equal(center.point.pixelSize, 9);
  h.rendering.destroy();
});

test('[cyclones-012] the data source has the layer name, and a refresh removes the earlier one with its entities', async () => {
  const h = harness();
  const names = [];
  const Base = h.cesium.CustomDataSource;
  h.cesium.CustomDataSource = class extends Base {
    constructor(name) {
      super();
      names.push(name);
    }
  };
  const removed = [];
  const remove = h.viewer.dataSources.remove;
  h.viewer.dataSources.remove = (value, destroy) => {
    removed.push([value, destroy]);
    return remove(value);
  };
  await h.rendering.setSnapshot({ storms: [storm()] });
  const first = h.sources[0];
  assert.equal(first.entities.values.length, 8);
  assert.deepEqual(removed, []);
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.deepEqual(names, ['weather-cyclones', 'weather-cyclones']);
  assert.equal(h.sources.length, 1);
  assert.notEqual(h.sources[0], first);
  assert.deepEqual(removed, [[first, true]]);
  assert.equal(first.entities.values.length, 0);
  assert.equal(h.sources[0].entities.values.length, 8);
  h.rendering.destroy();
});

test('[cyclones-012] a coherent storm with no track and no cone draws only its points', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [{ ...storm(), track: null, cone: null }],
  });
  assert.deepEqual(ids(h), [
    'cyclone:ep152026:center',
    'cyclone:ep152026:forecast:0',
  ]);
  assert.deepEqual(h.rendering.getDiagnostics(), {
    storms: 1,
    tracks: 0,
    cones: 0,
    forecastPoints: 1,
    dataSources: 1,
    entities: 2,
    selectedId: null,
    timerActive: false,
  });
  h.rendering.destroy();
});

test('[cyclones-012] a track of one line and a cone of one polygon each give one line and one polygon', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [
      {
        ...storm(),
        forecastPoints: [],
        track: {
          type: 'LineString',
          coordinates: [
            [1, 2],
            [3, 4],
          ],
        },
        cone: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ],
        },
      },
    ],
  });
  assert.deepEqual(ids(h), [
    'cyclone:ep152026:center',
    'cyclone:ep152026:track:0',
    'cyclone:ep152026:cone:0',
    'cyclone:ep152026:cone:0:outline:0',
  ]);
  assert.deepEqual(
    point(h, 'cyclone:ep152026:track:0').polyline.positions.map((p) => [
      p.lon,
      p.lat,
    ]),
    [
      [1, 2],
      [3, 4],
    ],
  );
  const { polygon } = point(h, 'cyclone:ep152026:cone:0');
  assert.equal(polygon.hierarchy.holes.length, 0);
  assert.equal(h.rendering.getDiagnostics().tracks, 1);
  assert.equal(h.rendering.getDiagnostics().cones, 1);
  h.rendering.destroy();
});

test('[cyclones-012] a forecast point at lead hour 0 has no entity and no lead-hour label', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [
      {
        ...storm(),
        forecastPoints: [
          { position: { longitude: 179, latitude: 15 }, tauHours: 0 },
          { position: { longitude: -179, latitude: 16 }, tauHours: 12 },
        ],
      },
    ],
  });
  h.rendering.setSelection('ep152026');
  assert.equal(point(h, 'cyclone:ep152026:forecast:0'), undefined);
  assert.ok(point(h, 'cyclone:ep152026:forecast:1'));
  assert.equal(h.rendering.getDiagnostics().forecastPoints, 1);
  assert.deepEqual(
    h.overlay.published().map((entry) => entry.id),
    ['storm:ep152026', 'lead:ep152026:12'],
  );
  h.rendering.destroy();
});

test('[cyclones-012] the focus sphere covers the whole storm, keeps a radius of at least 500,000 m and is null for an unknown storm', async () => {
  const h = harness();
  assert.equal(h.rendering.getFocusSphere('ep152026'), null);
  h.cesium.BoundingSphere.fromPoints = (points) => ({ points, radius: 900000 });
  await h.rendering.setSnapshot({
    storms: [storm(), { ...storm(), id: 'pending', geometryStatus: 'pending' }],
  });
  const wide = h.rendering.getFocusSphere('ep152026');
  assert.equal(wide.radius, 900000);
  // One center, two track pairs, two cone exteriors of four pairs, one forecast point.
  assert.equal(wide.points.length, 12);
  assert.equal(wide.points[0], point(h, 'cyclone:ep152026:center').position);
  assert.equal(h.rendering.getFocusSphere('pending').points.length, 1);
  h.cesium.BoundingSphere.fromPoints = (points) => ({ points, radius: 10 });
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(h.rendering.getFocusSphere('ep152026').radius, 500000);
  h.cesium.BoundingSphere.fromPoints = (points) => ({ points, radius: 500001 });
  await h.rendering.setSnapshot({ storms: [storm()] });
  assert.equal(h.rendering.getFocusSphere('ep152026').radius, 500001);
  assert.equal(h.rendering.getFocusSphere('unknown'), null);
  h.rendering.destroy();
});

test('[cyclones-013] the selected storm has a gold point of 12 px and each other storm has a blue point of 9 px', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [storm(), { ...storm(), id: 'near', name: 'Near' }],
  });
  const look = () =>
    ['ep152026', 'near'].map((id) => {
      const { point: p } = point(h, `cyclone:${id}:center`);
      return [p.color.value, p.pixelSize];
    });
  assert.deepEqual(look(), [
    ['#7fe6ed', 9],
    ['#7fe6ed', 9],
  ]);
  const before = h.renders;
  h.rendering.setSelection('near');
  assert.equal(h.renders, before + 1);
  assert.deepEqual(look(), [
    ['#7fe6ed', 9],
    ['#ffe19a', 12],
  ]);
  h.rendering.setSelection('ep152026');
  assert.deepEqual(look(), [
    ['#ffe19a', 12],
    ['#7fe6ed', 9],
  ]);
  assert.equal(h.rendering.getDiagnostics().selectedId, 'ep152026');
  h.rendering.setSelection('unknown');
  assert.deepEqual(look(), [
    ['#7fe6ed', 9],
    ['#7fe6ed', 9],
  ]);
  h.rendering.setSelection(null);
  assert.equal(h.rendering.getDiagnostics().selectedId, null);
  assert.deepEqual(h.overlay.entry('storm:near').variant, 'card');
  h.rendering.setSelection('near');
  await h.rendering.setSnapshot({
    storms: [storm(), { ...storm(), id: 'near', name: 'Near' }],
  });
  assert.deepEqual(look(), [
    ['#7fe6ed', 9],
    ['#ffe19a', 12],
  ]);
  assert.equal(h.overlay.entry('storm:near').variant, 'selected');
  h.rendering.destroy();
});

test('[cyclones-014] the renderer tests a storm with no shapes by its point only, and the occluders use the WGS84 minimum radius', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [{ ...storm(), geometryStatus: 'pending' }],
  });
  assert.equal(h.listeners.size, 1);
  const [center] = h.sources[0].entities.values;
  h.visibility.points.set(center.position, false);
  h.frame();
  assert.equal(center.show, false);
  assert.equal(h.visibility.pointCalls.length, 1);
  assert.equal(h.visibility.sphereCalls.length, 0);
  assert.equal(h.sphereOccluders[0].sphere.radius, 6356752);
  assert.equal(h.sphereOccluders[0].sphere.center, h.cesium.Cartesian3.ZERO);
  assert.equal(h.pointOccluders[0].ellipsoid, h.cesium.Ellipsoid.WGS84);
  h.visibility.points.set(center.position, true);
  const before = h.renders;
  h.frame();
  assert.equal(center.show, true);
  assert.equal(h.renders, before + 1);
  h.rendering.destroy();
});

test('[cyclones-015] a pick maps each entity to its own storm, and an id that is not a string is not owned', async () => {
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [storm(), { ...storm(), id: 'near' }],
  });
  const entities = h.sources[0].entities.values;
  for (const entity of entities) {
    const expected = entity.id.startsWith('cyclone:near:')
      ? 'near'
      : 'ep152026';
    assert.equal(h.rendering.pickStorm({ id: entity }), expected, entity.id);
    assert.equal(h.rendering.ownsPickId(entity.id), true, entity.id);
    assert.equal(h.rendering.ownsPickId(entity), false, 'an entity object');
  }
  for (const value of [undefined, null, 5, {}, { id: null }, { id: 5 }])
    assert.equal(h.rendering.pickStorm(value), null, String(value));
  for (const value of [undefined, null, 5, {}, ['cyclone:near:center']])
    assert.equal(h.rendering.ownsPickId(value), false, String(value));
  assert.equal(h.rendering.ownsPickId('cyclone:near'), false);
  assert.equal(h.rendering.ownsPickId('cyclone:near:center:'), false);
  h.rendering.destroy();
});

test('[cyclones-016] a failed data-source add rejects the call, removes the new entities and keeps the earlier source', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const first = h.sources[0];
  const failure = new Error('add failed');
  let added;
  h.viewer.dataSources.add = async (value) => {
    added = value;
    throw failure;
  };
  await assert.rejects(
    h.rendering.setSnapshot({ storms: [storm()] }),
    (error) => error === failure,
  );
  assert.equal(added.entities.values.length, 0);
  assert.deepEqual(h.sources, [first]);
  assert.equal(first.entities.values.length, 8);
  assert.equal(h.rendering.getDiagnostics().storms, 1);
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:center'), true);
  h.rendering.destroy();
});

test('[cyclones-016] a failed add returns false, and does not throw, after an abort, a newer call or a clear', async () => {
  for (const how of ['abort', 'newer', 'clear', 'destroy']) {
    const h = harness();
    const rejectors = [];
    h.viewer.dataSources.add = () =>
      new Promise((_resolve, reject) => rejectors.push(reject));
    const controller = new AbortController();
    const first = h.rendering.setSnapshot(
      { storms: [storm()] },
      { signal: controller.signal },
    );
    let second = null;
    if (how === 'abort') controller.abort();
    else if (how === 'newer') second = h.rendering.setSnapshot({ storms: [] });
    else h.rendering[how]();
    rejectors[0](new Error('add failed'));
    assert.equal(await first, false, how);
    if (second) {
      rejectors[1](new Error('newest failed'));
      await assert.rejects(second, { message: 'newest failed' });
    }
    assert.equal(h.sources.length, 0, how);
    h.rendering.destroy();
  }
});

test('[cyclones-016] a signal that aborted before the call rejects it and adds no data source', async () => {
  const h = harness();
  let adds = 0;
  const add = h.viewer.dataSources.add;
  h.viewer.dataSources.add = (value) => {
    adds++;
    return add(value);
  };
  await assert.rejects(
    h.rendering.setSnapshot(
      { storms: [storm()] },
      { signal: AbortSignal.abort() },
    ),
    { name: 'AbortError' },
  );
  assert.equal(adds, 0);
  assert.equal(h.rendering.getDiagnostics().dataSources, 0);
  assert.equal(h.overlay.calls.length, 0);
  h.rendering.destroy();
  assert.equal(await h.rendering.setSnapshot({ storms: [storm()] }), false);
  assert.equal(adds, 0);
});

test('[cyclones-017] clear removes the data source, resets the counts and the selection and hides the labels', async () => {
  const h = harness();
  assert.deepEqual(h.rendering.getDiagnostics(), {
    storms: 0,
    tracks: 0,
    cones: 0,
    forecastPoints: 0,
    dataSources: 0,
    entities: 0,
    selectedId: null,
    timerActive: false,
  });
  await h.rendering.setSnapshot({ storms: [storm()] });
  h.rendering.setSelection('ep152026');
  assert.deepEqual(h.rendering.getDiagnostics(), {
    storms: 1,
    tracks: 1,
    cones: 2,
    forecastPoints: 1,
    dataSources: 1,
    entities: 8,
    selectedId: 'ep152026',
    timerActive: false,
  });
  const before = h.renders;
  h.rendering.clear();
  assert.deepEqual(h.rendering.getDiagnostics(), {
    storms: 0,
    tracks: 0,
    cones: 0,
    forecastPoints: 0,
    dataSources: 0,
    entities: 0,
    selectedId: null,
    timerActive: false,
  });
  assert.equal(h.renders, before + 1);
  assert.equal(h.sources.length, 0);
  assert.equal(h.rendering.getFocusSphere('ep152026'), null);
  assert.equal(h.rendering.ownsPickId('cyclone:ep152026:center'), false);
  assert.deepEqual(h.overlay.calls.slice(-2), [
    { kind: 'clear', source: CYCLONE_OVERLAY_SOURCE_ID },
    { kind: 'visible', source: CYCLONE_OVERLAY_SOURCE_ID, visible: false },
  ]);
  h.rendering.clear();
  assert.equal(h.renders, before + 2);
  assert.equal(h.overlay.calls.length, 6);
  h.rendering.destroy();
});

test('[cyclones-017] a destroyed viewer gets no render request and a destroyed data source list gets no removal', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const source = h.sources[0];
  let removals = 0;
  const remove = h.viewer.dataSources.remove;
  h.viewer.dataSources.remove = (...args) => {
    removals++;
    return remove(...args);
  };
  h.viewer.isDestroyed = () => true;
  h.viewer.dataSources.isDestroyed = () => true;
  const before = h.renders;
  h.rendering.clear();
  assert.equal(h.renders, before);
  assert.equal(removals, 0);
  assert.equal(source.entities.values.length, 0);
  h.viewer.isDestroyed = () => false;
  h.viewer.dataSources.isDestroyed = () => false;
  await h.rendering.setSnapshot({ storms: [storm()] });
  const live = h.renders;
  h.rendering.clear();
  assert.equal(h.renders, live + 1);
  assert.equal(removals, 1);
  h.rendering.destroy();
});

test('[cyclones-012] only a storm with the status current and equal advisory numbers has coherent geometry', async () => {
  const base = {
    geometryStatus: 'current',
    geometryAdvisoryNumber: '10',
    advisoryNumber: '10',
  };
  assert.equal(coherentCycloneGeometry(base), true);
  for (const change of [
    { geometryStatus: 'pending' },
    { geometryStatus: 'unavailable' },
    { geometryStatus: 'stale' },
    { geometryAdvisoryNumber: '9' },
    { geometryAdvisoryNumber: '10A' },
    { geometryAdvisoryNumber: null },
    { geometryAdvisoryNumber: 10 },
    { advisoryNumber: '11' },
  ])
    assert.equal(
      coherentCycloneGeometry({ ...base, ...change }),
      false,
      JSON.stringify(change),
    );
  const h = harness();
  await h.rendering.setSnapshot({
    storms: [{ ...storm(), geometryStatus: 'unavailable' }],
  });
  assert.deepEqual(ids(h), ['cyclone:ep152026:center']);
  h.rendering.destroy();
});

test('[cyclones-017] destroy clears once and a second destroy does nothing', async () => {
  const h = harness();
  await h.rendering.setSnapshot({ storms: [storm()] });
  const calls = h.overlay.calls.length;
  const renders = h.renders;
  h.rendering.destroy();
  assert.equal(h.overlay.calls.length, calls + 2);
  assert.equal(h.renders, renders + 1);
  assert.equal(h.sources.length, 0);
  h.rendering.destroy();
  assert.equal(h.overlay.calls.length, calls + 2);
  assert.equal(h.renders, renders + 1);
});
