import test from 'node:test';
import assert from 'node:assert/strict';
import { viewBox } from './box.js';
import {
  boxAreaKm2,
  validateRequest,
} from '../../../server/providers/beemaps/validate.js';

const at = (lat, lon) => viewBox({ lat, lon });

test('[beemaps-frames-008] builds the box from the rows of the spec', () => {
  const rows = [
    [60.0, 10.0, 60.0, 10.0, [9.982014, 59.991007, 10.017986, 60.008993]],
    [0.0, 0.0, 0.0, 0.0, [-0.008993, -0.008993, 0.008993, 0.008993]],
    [
      -33.9,
      151.2,
      -33.9,
      151.2,
      [151.189165, -33.908993, 151.210835, -33.891007],
    ],
    [
      59.9976,
      10.0031,
      60.0,
      10.005,
      [9.987014, 59.991007, 10.022986, 60.008993],
    ],
    [
      30.2672,
      -97.7431,
      30.265,
      -97.745,
      [-97.755412, 30.256007, -97.734588, 30.273993],
    ],
    [0.0025, 0.0025, 0.005, 0.005, [-0.003993, -0.003993, 0.013993, 0.013993]],
    [-0.0025, -0.0025, 0, 0, [-0.008993, -0.008993, 0.008993, 0.008993]],
  ];
  for (const [lat, lon, centreLat, centreLon, bbox] of rows) {
    assert.deepEqual(
      at(lat, lon),
      { ok: true, centre: { lat: centreLat, lon: centreLon }, bbox },
      `${lat} ${lon}`,
    );
  }
});

test('[beemaps-frames-008] rounds a centre to the nearest multiple of 0.005 and a tie to the higher one', () => {
  assert.equal(at(0.0024, 0).centre.lat, 0);
  assert.equal(at(0.0025, 0).centre.lat, 0.005);
  assert.equal(at(0.0026, 0).centre.lat, 0.005);
  assert.equal(at(-0.0024, 0).centre.lat, 0);
  assert.equal(at(-0.0025, 0).centre.lat, 0);
  assert.equal(at(-0.0026, 0).centre.lat, -0.005);
  assert.equal(at(10, 0.0074).centre.lon, 0.005);
  assert.equal(at(10, 0.0076).centre.lon, 0.01);
});

test('[beemaps-frames-008] keeps the same box height at every latitude and widens the box towards the poles', () => {
  const heights = new Set();
  for (const lat of [0, 30, 60, 80, -80]) {
    const { bbox } = at(lat, 0);
    heights.add(Number((bbox[3] - bbox[1]).toFixed(6)));
  }
  assert.deepEqual([...heights], [0.017986]);
  assert.equal(at(0, 0).bbox[2] - at(0, 0).bbox[0], 0.017986);
  assert.equal(at(60, 0).bbox[2] - at(60, 0).bbox[0] > 0.0359, true);
});

test('[beemaps-frames-009] gives the reason sky for a centre that is null or has a value that is not a finite number', () => {
  assert.deepEqual(viewBox(null), { ok: false, reason: 'sky' });
  assert.deepEqual(viewBox(undefined), { ok: false, reason: 'sky' });
  for (const centre of [
    { lat: NaN, lon: 0 },
    { lat: 0, lon: NaN },
    { lat: Infinity, lon: 0 },
    { lat: 0, lon: -Infinity },
    { lat: '10', lon: 0 },
    { lat: 10, lon: null },
    {},
  ])
    assert.deepEqual(viewBox(centre), { ok: false, reason: 'sky' });
});

test('[beemaps-frames-009] refuses a centre above 80 or below -80 degrees after the rounding', () => {
  assert.equal(at(80.0, 0).ok, true);
  assert.equal(at(80.002, 0).ok, true);
  assert.deepEqual(at(80.003, 0), { ok: false, reason: 'latitude' });
  assert.equal(at(-80.0, 0).ok, true);
  assert.equal(at(-80.002, 0).ok, true);
  assert.deepEqual(at(-80.003, 0), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(89, 0), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(-89, 0), { ok: false, reason: 'latitude' });
});

test('[beemaps-frames-009] refuses a box that goes past longitude 180 or -180', () => {
  assert.equal(at(0, 179.99).ok, true);
  assert.equal(at(0, -179.99).ok, true);
  assert.deepEqual(at(0, 179.995), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, -179.995), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, 180), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, -180), { ok: false, reason: 'meridian' });
  assert.equal(at(70, 179.97).ok, true);
  assert.deepEqual(at(70, 179.98), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(70, -179.98), { ok: false, reason: 'meridian' });
});

test('[beemaps-frames-009] gives the first reason when two apply', () => {
  assert.deepEqual(at(85, 179.995), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(-85, -179.995), { ok: false, reason: 'latitude' });
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
      assert.equal(area > 3.99 && area < 4.01, true, `${lat} ${lon} ${area}`);
      boxes++;
    }
  }
  assert.equal(boxes, 33 * 35);
});
