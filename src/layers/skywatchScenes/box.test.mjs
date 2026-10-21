import test from 'node:test';
import assert from 'node:assert/strict';
import { scenesBox, searchWindow } from './box.js';
import {
  boxAreaKm2,
  validateRequest,
} from '../../../server/providers/skywatch/validate.js';

const at = (lat, lon) => scenesBox({ lat, lon });

test('[skywatch-scenes-layer-008] builds the box from the rows of the spec', () => {
  const rows = [
    [60.0, 10.0, 60, 10, [9.568326, 59.784163, 10.431674, 60.215837]],
    [0.0, 0.0, 0, 0, [-0.215837, -0.215837, 0.215837, 0.215837]],
    [
      -33.9,
      151.2,
      -33.9,
      151.2,
      [150.939959, -34.115837, 151.460041, -33.684163],
    ],
    [
      30.2672,
      -97.7431,
      30.27,
      -97.74,
      [-97.98991, 30.054163, -97.49009, 30.485837],
    ],
    [0.005, 0.005, 0.01, 0.01, [-0.205837, -0.205837, 0.225837, 0.225837]],
    [-0.005, -0.005, 0, 0, [-0.215837, -0.215837, 0.215837, 0.215837]],
    [79.994, 10.0, 79.99, 10, [8.758274, 79.774163, 11.241726, 80.205837]],
    [
      27.95,
      -82.46,
      27.95,
      -82.46,
      [-82.704337, 27.734163, -82.215663, 28.165837],
    ],
  ];
  for (const [lat, lon, centreLat, centreLon, bbox] of rows) {
    assert.deepEqual(
      at(lat, lon),
      { ok: true, centre: { lat: centreLat, lon: centreLon }, bbox },
      `${lat} ${lon}`,
    );
  }
});

test('[skywatch-scenes-layer-008] rounds a centre to the nearest multiple of 0.01 and a tie to the higher one', () => {
  assert.equal(at(0.004, 0).centre.lat, 0);
  assert.equal(at(0.005, 0).centre.lat, 0.01);
  assert.equal(at(0.006, 0).centre.lat, 0.01);
  assert.equal(at(-0.004, 0).centre.lat, 0);
  assert.equal(at(-0.005, 0).centre.lat, 0);
  assert.equal(at(-0.006, 0).centre.lat, -0.01);
  assert.equal(at(10, 0.014).centre.lon, 0.01);
  assert.equal(at(10, 0.016).centre.lon, 0.02);
  assert.equal(Object.is(at(-0.004, -0.004).centre.lat, -0), false);
});

test('[skywatch-scenes-layer-008] keeps the same box height at every latitude and takes the width from the latitude of the centre', () => {
  const heights = new Set();
  for (const lat of [0, 30, 60, 80, -80]) {
    const { bbox } = at(lat, 0);
    heights.add(Number((bbox[3] - bbox[1]).toFixed(6)));
  }
  assert.deepEqual([...heights], [0.431674]);
  assert.equal(at(0, 0).bbox[2] - at(0, 0).bbox[0], 0.431674);
  assert.deepEqual(at(59.996, 10).bbox, at(60.0, 10).bbox);
  assert.deepEqual(at(60.004, 10).bbox, at(60.0, 10).bbox);
});

test('[skywatch-scenes-layer-009] gives the reason sky for a centre that is null or has a value that is not a finite number', () => {
  assert.deepEqual(scenesBox(null), { ok: false, reason: 'sky' });
  assert.deepEqual(scenesBox(undefined), { ok: false, reason: 'sky' });
  for (const centre of [
    { lat: NaN, lon: 0 },
    { lat: 0, lon: NaN },
    { lat: Infinity, lon: 0 },
    { lat: 0, lon: -Infinity },
    { lat: '10', lon: 0 },
    { lat: 10, lon: null },
    {},
  ])
    assert.deepEqual(scenesBox(centre), { ok: false, reason: 'sky' });
});

test('[skywatch-scenes-layer-009] refuses a centre above 80 or below -80 degrees after the rounding', () => {
  assert.equal(at(80.0, 0).ok, true);
  assert.equal(at(80.004, 0).ok, true);
  assert.deepEqual(at(80.006, 0), { ok: false, reason: 'latitude' });
  assert.equal(at(-80.0, 0).ok, true);
  assert.equal(at(-80.004, 0).ok, true);
  assert.deepEqual(at(-80.006, 0), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(89, 0), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(-89, 0), { ok: false, reason: 'latitude' });
});

test('[skywatch-scenes-layer-009] refuses a box that goes past longitude 180 or -180', () => {
  assert.equal(at(0, 179.78).ok, true);
  assert.equal(at(0, -179.78).ok, true);
  assert.deepEqual(at(0, 179.79), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, -179.79), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, 180), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, -180), { ok: false, reason: 'meridian' });
  assert.deepEqual(at(0, 179.78).bbox[2], 179.995837);
  assert.deepEqual(at(0, -179.78).bbox[0], -179.995837);
});

test('[skywatch-scenes-layer-009] gives the first reason when two apply', () => {
  assert.deepEqual(at(85, 179.99), { ok: false, reason: 'latitude' });
  assert.deepEqual(at(-85, -179.99), { ok: false, reason: 'latitude' });
  assert.deepEqual(scenesBox({ lat: NaN, lon: 179.99 }), {
    ok: false,
    reason: 'sky',
  });
});

test('[skywatch-scenes-layer-010] builds a box that the server accepts at 33 latitudes and 35 longitudes', () => {
  const now = Date.parse('2026-10-21T12:00:00.000Z');
  const window = searchWindow(now);
  let boxes = 0;
  for (let lat = -80; lat <= 80; lat += 5) {
    for (let lon = -170; lon <= 170; lon += 10) {
      const result = at(lat, lon);
      assert.equal(result.ok, true, `${lat} ${lon}`);
      const body = JSON.stringify({ bbox: result.bbox, ...window });
      const checked = validateRequest(body, now);
      assert.equal(checked.ok, true, `${lat} ${lon}`);
      assert.equal(checked.start, '2026-07-22');
      assert.equal(checked.end, '2026-10-21');
      const area = boxAreaKm2(checked.bbox);
      assert.equal(
        area >= 2303.99 && area <= 2304.01,
        true,
        `${lat} ${lon} ${area}`,
      );
      boxes++;
    }
  }
  assert.equal(boxes, 33 * 35);
});

test('[skywatch-scenes-layer-011] gives the last 92 days as the window, from the rows of the spec', () => {
  const rows = [
    ['2026-10-21T12:00:00.000Z', '2026-07-22', '2026-10-21'],
    ['2026-03-01T00:00:00.000Z', '2025-11-30', '2026-03-01'],
    ['2024-03-01T00:00:00.000Z', '2023-12-01', '2024-03-01'],
    ['2026-10-21T23:59:59.999Z', '2026-07-22', '2026-10-21'],
    ['2026-10-22T00:00:00.000Z', '2026-07-23', '2026-10-22'],
  ];
  for (const [time, start, end] of rows)
    assert.deepEqual(searchWindow(Date.parse(time)), { start, end }, time);
});

test('[skywatch-scenes-layer-011] gives the same window when the time zone of the machine is America/New_York', (t) => {
  const before = process.env.TZ;
  t.after(() => {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  });
  process.env.TZ = 'America/New_York';
  assert.equal(new Date(Date.parse('2026-10-22T02:00:00.000Z')).getDate(), 21);
  assert.deepEqual(searchWindow(Date.parse('2026-10-22T02:00:00.000Z')), {
    start: '2026-07-23',
    end: '2026-10-22',
  });
  assert.deepEqual(searchWindow(Date.parse('2026-03-01T00:00:00.000Z')), {
    start: '2025-11-30',
    end: '2026-03-01',
  });
});
