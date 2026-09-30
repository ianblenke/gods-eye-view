import test from 'node:test';
import assert from 'node:assert/strict';

test('[recent-imagery-052] the box tool doubles give standard input and globe values', async () => {
  const { boxToolFakes } = await import('./testDoubles.mjs');
  const f = boxToolFakes();
  assert.equal(f.originalClick(), 'select');
  assert.equal(f.originalDouble(), 'track');
  assert.deepEqual(f.cesium.Rectangle.fromDegrees(0, 0, 1, 1), {});
  assert.deepEqual(f.cesium.Cartesian3.fromDegreesArray([1, 2]), [1, 2]);
  f.viewer.scene.requestRender();
  assert.equal(f.viewer.renders, 1);
  assert.equal(f.pickWorld(f.viewer, 0, 0), null);
  assert.deepEqual(f.pickWorld(f.viewer, 0.5, 0.5), {
    lon: -97.80000000000001,
    lat: 30.299999999999997,
  });
  assert.equal(f.handler(), null);
  assert.equal(f.fire('LEFT_DOWN', {}), undefined);
});

test('[recent-imagery-052] the box tool double sends the live canvas handler an event', async () => {
  const { boxToolFakes } = await import('./testDoubles.mjs');
  const f = boxToolFakes();
  const first = new f.cesium.ScreenSpaceEventHandler('canvas');
  first.destroy();
  const live = new f.cesium.ScreenSpaceEventHandler('canvas');
  assert.equal(f.handler(), live);
  assert.equal(f.fire('LEFT_UP', {}), undefined);
  const events = [];
  live.setInputAction(
    (event) => events.push(event.position.x),
    f.types.LEFT_DOWN,
  );
  f.fire('LEFT_DOWN', { position: { x: 12 } });
  assert.deepEqual(events, [12]);
});

test('[recent-imagery-052] the renderer double moves both image slots to the next host', async () => {
  const { fakeRenderer, candidate, BOX } = await import('./testDoubles.mjs');
  const r = fakeRenderer();
  r.rebind({ kind: 'globe' });
  r.showSlot('a', candidate('S30', '2026-09-18'), BOX, {});
  r.showSlot('b', candidate('L30', '2026-09-16'), BOX, {});
  r.rebind({ kind: 'tileset' });
  assert.equal(r.getOwned().a.kind, 'tileset');
  assert.equal(r.getOwned().b.kind, 'tileset');
});

test('[recent-imagery-052] the thumbnail double calls both probe subscribers', async () => {
  const { fakeThumbnails } = await import('./testDoubles.mjs');
  const t = fakeThumbnails();
  const first = [], second = [];
  t.subscribe((key) => first.push(key));
  t.subscribe((key) => second.push(key));
  t.probe('S30:2026-09-18', 'present');
  assert.deepEqual(first, ['S30:2026-09-18']);
  assert.deepEqual(second, ['S30:2026-09-18']);
});

test('[recent-imagery-052] the response doubles use different success and failure status codes', async () => {
  const { response } = await import('./testDoubles.mjs');
  assert.equal(response().status, 200);
  assert.equal(response({ ok: false }).status, 500);
});

test('[recent-imagery-052] the day doubles give cloud ranges only to granule days', async () => {
  const { candidate } = await import('./testDoubles.mjs');
  assert.deepEqual(candidate('S30', '2026-09-18', 12).cloud, { min: 12, max: 12 });
  assert.equal(candidate('VIIRS', '2026-09-18', 12).cloud, null);
});
