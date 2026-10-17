import test from 'node:test';
import assert from 'node:assert/strict';
import { burstBox } from './box.js';

test('[beemaps-bursts-008] gives the box of 4 km² for a view inside the latitudes', () => {
  assert.deepEqual(burstBox({ lat: 59.9976, lon: 10.0031 }), {
    ok: true,
    centre: { lat: 60, lon: 10.005 },
    bbox: [9.987014, 59.991007, 10.022986, 60.008993],
  });
  assert.deepEqual(
    burstBox({ lat: 79.9, lon: 0 }).bbox,
    [-0.051282, 79.891007, 0.051282, 79.908993],
  );
  assert.deepEqual(
    burstBox({ lat: -79.9, lon: 0 }).bbox,
    [-0.051282, -79.908993, 0.051282, -79.891007],
  );
});

test('[beemaps-bursts-008] accepts the last centres whose corners stay within 80 degrees', () => {
  assert.deepEqual(
    burstBox({ lat: 79.99, lon: 0 }).bbox,
    [-0.051739, 79.981007, 0.051739, 79.998993],
  );
  assert.deepEqual(
    burstBox({ lat: -79.99, lon: 0 }).bbox,
    [-0.051739, -79.998993, 0.051739, -79.981007],
  );
});

test('[beemaps-bursts-008] refuses a box whose corner crosses 80 or -80 degrees', () => {
  for (const lat of [-80, -79.999, -79.995, 79.995, 79.996, 80]) {
    assert.deepEqual(burstBox({ lat, lon: 0 }), {
      ok: false,
      reason: 'latitude',
    });
  }
});

test('[beemaps-bursts-008] keeps the reasons of the box of 4 km² for the sky, the latitude and the meridian', () => {
  for (const centre of [null, { lat: NaN, lon: 0 }, { lat: 0, lon: 'x' }]) {
    assert.deepEqual(burstBox(centre), { ok: false, reason: 'sky' });
  }
  assert.deepEqual(burstBox({ lat: 80.5, lon: 0 }), {
    ok: false,
    reason: 'latitude',
  });
  assert.deepEqual(burstBox({ lat: -80.5, lon: 0 }), {
    ok: false,
    reason: 'latitude',
  });
  assert.deepEqual(burstBox({ lat: 0, lon: 179.999 }), {
    ok: false,
    reason: 'meridian',
  });
});
