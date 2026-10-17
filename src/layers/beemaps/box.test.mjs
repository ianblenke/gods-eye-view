import test from 'node:test';
import assert from 'node:assert/strict';
import { framesBox, viewBox } from './box.js';
import {
  boxAreaKm2,
  validateRequest,
} from '../../../server/providers/beemaps/validate.js';

const at = (lat, lon) => framesBox({ lat, lon });

test('[beemaps-frames-008] builds the box from the rows of the spec', () => {
  const rows = [
    [60.0, 10.0, 60.0, 10.0, [9.997302, 59.998651, 10.002698, 60.001349]],
    [0.0, 0.0, 0.0, 0.0, [-0.001349, -0.001349, 0.001349, 0.001349]],
    [
      -33.9,
      151.2,
      -33.9,
      151.2,
      [151.198375, -33.901349, 151.201625, -33.898651],
    ],
    [
      59.9996,
      10.0013,
      60.0,
      10.001,
      [9.998302, 59.998651, 10.003698, 60.001349],
    ],
    [
      30.2672,
      -97.7431,
      30.267,
      -97.743,
      [-97.744562, 30.265651, -97.741438, 30.268349],
    ],
    [0.0005, 0.0005, 0.001, 0.001, [-0.000349, -0.000349, 0.002349, 0.002349]],
    [-0.0005, -0.0005, 0, 0, [-0.001349, -0.001349, 0.001349, 0.001349]],
    [39.975, 0.0, 39.975, 0, [-0.00176, 39.973651, 0.00176, 39.976349]],
    [79.5004, 10.0, 79.5, 10, [9.992598, 79.498651, 10.007402, 79.501349]],
  ];
  for (const [lat, lon, centreLat, centreLon, bbox] of rows) {
    assert.deepEqual(
      at(lat, lon),
      { ok: true, centre: { lat: centreLat, lon: centreLon }, bbox },
      `${lat} ${lon}`,
    );
  }
});

test('[beemaps-frames-008] rounds a centre to the nearest multiple of 0.001 and a tie to the higher one', () => {
  assert.equal(at(0.0004, 0).centre.lat, 0);
  assert.equal(at(0.0005, 0).centre.lat, 0.001);
  assert.equal(at(0.0006, 0).centre.lat, 0.001);
  assert.equal(at(-0.0004, 0).centre.lat, 0);
  assert.equal(at(-0.0005, 0).centre.lat, 0);
  assert.equal(at(-0.0006, 0).centre.lat, -0.001);
  assert.equal(at(10, 0.0014).centre.lon, 0.001);
  assert.equal(at(10, 0.0016).centre.lon, 0.002);
});

test('[beemaps-frames-008] keeps the same box height at every latitude and widens the box towards the poles', () => {
  const heights = new Set();
  for (const lat of [0, 30, 60, 80, -80]) {
    const { bbox } = at(lat, 0);
    heights.add(Number((bbox[3] - bbox[1]).toFixed(6)));
  }
  assert.deepEqual([...heights], [0.002698]);
  assert.equal(at(0, 0).bbox[2] - at(0, 0).bbox[0], 0.002698);
  assert.equal(at(60, 0).bbox[2] - at(60, 0).bbox[0] > 0.0053, true);
});

test('[beemaps-frames-009] gives the reason sky for a centre that is null or has a value that is not a finite number', () => {
  assert.deepEqual(framesBox(null), { ok: false, reason: 'sky' });
  assert.deepEqual(framesBox(undefined), { ok: false, reason: 'sky' });
  for (const centre of [
    { lat: NaN, lon: 0 },
    { lat: 0, lon: NaN },
    { lat: Infinity, lon: 0 },
    { lat: 0, lon: -Infinity },
    { lat: '10', lon: 0 },
    { lat: 10, lon: null },
    {},
  ])
    assert.deepEqual(framesBox(centre), { ok: false, reason: 'sky' });
});

test('[beemaps-frames-009] refuses a centre above 80 or below -80 degrees after the rounding', () => {
  assert.equal(at(80.0, 0).ok, true);
  assert.equal(at(80.0004, 0).ok, true);
  assert.deepEqual(at(80.0006, 0), { ok: false, reason: 'latitude' });
  assert.equal(at(-80.0, 0).ok, true);
  assert.equal(at(-80.0004, 0).ok, true);
  assert.deepEqual(at(-80.0006, 0), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(89, 0), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(-89, 0), { ok: false, reason: 'latitude' });
});

test('[beemaps-frames-009] refuses a box that goes past longitude 180 or -180', () => {
  assert.equal(at(0, 179.998).ok, true);
  assert.equal(at(0, -179.998).ok, true);
  assert.deepEqual(at(0, 179.999), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, -179.999), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, 180), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, -180), { ok: false, reason: 'meridian' });
  assert.equal(at(70, 179.996).ok, true);
  assert.deepEqual(at(70, 179.997), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(70, -179.997), { ok: false, reason: 'meridian' });
});

test('[beemaps-frames-009] gives a box that ends exactly at longitude 180 or -180', () => {
  assert.deepEqual(at(47.59, 179.998), {
    ok: true,
    centre: { lat: 47.59, lon: 179.998 },
    bbox: [179.996, 47.588651, 180, 47.591349],
  });
  assert.deepEqual(at(47.59, -179.998), {
    ok: true,
    centre: { lat: 47.59, lon: -179.998 },
    bbox: [-180, 47.588651, -179.996, 47.591349],
  });
});

test('[beemaps-frames-009] gives the first reason when two apply', () => {
  assert.deepEqual(at(85, 179.999), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(-85, -179.999), { ok: false, reason: 'latitude' });
});

test('[beemaps-frames-010] builds a box that the server accepts at 33 latitudes and 35 longitudes', () => {
  const now = Date.UTC(2026, 9, 15, 12, 0, 0);
  let boxes = 0;
  for (let lat = -80; lat <= 80; lat += 5) {
    for (let lon = -170; lon <= 170; lon += 10) {
      const result = at(lat, lon);
      assert.equal(result.ok, true, `${lat} ${lon}`);
      const body = JSON.stringify({ bbox: result.bbox, limit: 200 });
      const checked = validateRequest(body, now);
      assert.equal(checked.ok, true, `${lat} ${lon}`);
      assert.equal(checked.limit, 200);
      const area = boxAreaKm2(checked.ring);
      assert.equal(
        area > 0.0899 && area < 0.0901,
        true,
        `${lat} ${lon} ${area}`,
      );
      boxes++;
    }
  }
  assert.equal(boxes, 33 * 35);
});

test('[beemaps-bursts-006] builds the box of 4 km² for a quote with the function viewBox', () => {
  assert.deepEqual(viewBox({ lat: 59.9976, lon: 10.0031 }), {
    ok: true,
    centre: { lat: 60, lon: 10.005 },
    bbox: [9.987014, 59.991007, 10.022986, 60.008993],
  });
  assert.deepEqual(viewBox({ lat: 0.0025, lon: 0.0025 }), {
    ok: true,
    centre: { lat: 0.005, lon: 0.005 },
    bbox: [-0.003993, -0.003993, 0.013993, 0.013993],
  });
  const now = Date.UTC(2026, 9, 15, 12, 0, 0);
  for (let lat = -80; lat <= 80; lat += 5) {
    for (let lon = -170; lon <= 170; lon += 10) {
      const result = viewBox({ lat, lon });
      const checked = validateRequest(
        JSON.stringify({ bbox: result.bbox, limit: 200 }),
        now,
      );
      const area = boxAreaKm2(checked.ring);
      assert.equal(area > 3.99 && area < 4.01, true, `${lat} ${lon} ${area}`);
    }
  }
});
