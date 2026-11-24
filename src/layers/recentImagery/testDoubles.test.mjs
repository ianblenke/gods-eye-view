import test from 'node:test';
import assert from 'node:assert/strict';

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
  const first = [],
    second = [];
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
  assert.deepEqual(candidate('S30', '2026-09-18', 12).cloud, {
    min: 12,
    max: 12,
  });
  assert.equal(candidate('VIIRS', '2026-09-18', 12).cloud, null);
});
