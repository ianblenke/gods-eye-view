import test from 'node:test';
import assert from 'node:assert/strict';

import {
  boxFromPin,
  boxFromRectangle,
  boxSideKm,
  coverageFor,
  boxCentre,
  dequantizeBox,
  fitViewHeightM,
  formatCandidateReadout,
  gibsTemplate,
  groupGranulesByDay,
  mergeCandidates,
  parseCandidateKey,
  quantizeBox,
  rankLatest,
  shortDay,
  thumbnailOrder,
  utcDay,
  validateBox,
  viewTooLargeMessage,
  viirsCandidates,
  wvsSnapshotUrl,
} from './model.js';
import { BOX } from './testDoubles.mjs';

function granule(overrides = {}) {
  return {
    id: 'g',
    product: 'S30',
    timeStart: '2026-09-18T17:12:00.000Z',
    timeEnd: '2026-09-18T17:12:30.000Z',
    cloud: 12,
    footprint: null,
    ...overrides,
  };
}

function hls(product, day, clouds, extra = {}) {
  const granules = clouds.map((cloud, index) =>
    granule({
      id: `${product}-${day}-${index}`,
      product,
      timeStart: `${day}T17:1${index}:00.000Z`,
      timeEnd: `${day}T17:1${index}:30.000Z`,
      cloud,
    }),
  );
  return { ...groupGranulesByDay(granules)[0], ...extra };
}

test('[recent-imagery-006] validateBox refuses dateline, polar, degenerate, invalid and oversized boxes', () => {
  const reason = (box) => validateBox(box).reason;
  assert.equal(
    reason({ west: 179, south: 0, east: -179, north: 1 }),
    'dateline',
  );
  assert.equal(
    reason({ west: 0, south: 84, east: 0.5, north: 85.05111 }),
    'polar',
  );
  assert.equal(
    reason({ west: 0, south: -85.0512, east: 0.5, north: -84 }),
    'polar',
  );
  // Refusals fit the one-line notice.
  assert.equal(
    validateBox({ west: 0, south: 84, east: 0.5, north: 85.05111 }).message,
    'Imagery stops at ±85.05° latitude',
  );
  assert.equal(
    validateBox({ west: 179, south: 0, east: -179, north: 1 }).message,
    'Select one side of the dateline',
  );
  assert.equal(
    validateBox({ west: 0, south: 84.9, east: 0.05, north: 85 }).ok,
    true,
  );
  assert.equal(
    reason({ west: 10, south: 10, east: 10, north: 11 }),
    'degenerate',
  );
  assert.equal(
    reason({ west: Infinity, south: 0, east: 1, north: 1 }),
    'invalid',
  );
  assert.equal(reason({ west: -181, south: 0, east: 1, north: 1 }), 'invalid');
  assert.equal(reason(undefined), 'invalid');
  // The cap is 1,000 km a side, and the refusal says how big the box is.
  const tall = validateBox({ west: 0, south: 0, east: 0.1, north: 10 });
  assert.equal(tall.reason, 'too-large');
  assert.equal(tall.message, 'Box is 1,113 km wide · limit 1,000 km');
  assert.equal(
    reason({ west: 0, south: 0, east: 10, north: 0.1 }),
    'too-large',
  );
  assert.equal(validateBox({ west: 0, south: 0, east: 8, north: 8 }).ok, true);
  assert.equal(
    viewTooLargeMessage(2400),
    'View is 2,400 km wide · limit 1,000 km',
  );
  // Latitudes are ordered; longitudes are never swapped.
  assert.deepEqual(
    validateBox({ west: -97.8, south: 30.3, east: -97.7, north: 30.2 }).box,
    { west: -97.8, south: 30.2, east: -97.7, north: 30.3 },
  );
});

test('[recent-imagery-007] ZOOM IN: the height whose top-down view is 400 km wide, clamped to 5–400 km; a box centre', () => {
  const near = (actual, expected, label) =>
    assert.ok(Math.abs(actual - expected) < 1e-6, `${label}: ${actual}`);
  // A 1000 × 500 canvas with Cesium's 60° horizontal FOV: tan(fovy / 2) is
  // tan(30°) / 2, so the view is 2 · h · tan(30°) wide.
  const fovy = 2 * Math.atan(Math.tan(Math.PI / 6) / 2);
  const height = fitViewHeightM({ width: 1000, height: 500, fovy });
  near(height, 400_000 / (2 * Math.tan(Math.PI / 6)), 'wide canvas');
  near(
    2 * height * Math.tan(fovy / 2) * 2,
    400_000,
    'the view at that height is 400 km wide',
  );
  // A tall canvas would need more than 400 km; a very wide one less than 5.
  assert.equal(
    fitViewHeightM({ width: 200, height: 1000, fovy: Math.PI / 3 }),
    400_000,
  );
  assert.equal(fitViewHeightM({ width: 1000, height: 500, fovy: 3.1 }), 5_000);
  // No canvas or FOV: a square 60° view.
  near(
    fitViewHeightM({ width: 0, height: 0, fovy: undefined }),
    400_000 / (2 * Math.tan(Math.PI / 6)),
    'fallback',
  );
  assert.deepEqual(boxCentre({ west: 0, south: 0, east: 20, north: 10 }), {
    lon: 10,
    lat: 5,
  });
  assert.equal(boxCentre(null), null);
});

test('[recent-imagery-007] box width is the longitude span at the mid-latitude, never the shortest arc', () => {
  const equator = boxSideKm({ west: 0, south: -0.5, east: 1, north: 0.5 });
  assert.ok(Math.abs(equator.width - 111.32) < 1e-6);
  assert.ok(Math.abs(equator.height - 111.32) < 1e-6);
  const north = boxSideKm({ west: 0, south: 59.5, east: 1, north: 60.5 });
  assert.ok(north.width > 55 && north.width < 56.5, String(north.width));
  const nearlyGlobal = { west: -179.9, south: 30, east: 179.9, north: 30.1 };
  assert.ok(boxSideKm(nearlyGlobal).width > 30000);
  assert.equal(validateBox(nearlyGlobal).reason, 'too-large');
});

test('[recent-imagery-008] boxFromPin builds a 10 km square within 2% at any latitude and refuses what cannot validate', () => {
  for (const [lon, lat] of [
    [-97.75, 30.27],
    [18.07, 59.33],
    [0, 0],
    [-70, -45],
  ]) {
    const box = boxFromPin(lon, lat);
    const { width, height } = boxSideKm(box);
    assert.ok(Math.abs(width - 10) < 0.2, `width ${width} at ${lat}`);
    assert.ok(Math.abs(height - 10) < 0.2, `height ${height} at ${lat}`);
    assert.ok(Math.abs((box.west + box.east) / 2 - lon) < 1e-9);
  }
  assert.ok(Math.abs(boxSideKm(boxFromPin(10, 10, 50)).width - 50) < 1);
  assert.equal(boxFromPin(NaN, 0), null);
  assert.equal(boxFromPin(0, 0, 5000), null, 'over the cap');
  assert.equal(boxFromPin(179.99, 0), null, 'would cross the dateline');
  assert.equal(boxFromPin(0, 89), null, 'clamped to a degenerate polar box');
  assert.equal(boxFromPin(0, 85.04).north, 85.0511, 'clamped, still valid');
});

test('[recent-imagery-009] rectangles convert from radians and the share-link quantization round-trips', () => {
  const box = boxFromRectangle({
    west: -Math.PI / 2,
    south: 0,
    east: -Math.PI / 4,
    north: Math.PI / 6,
  });
  assert.ok(Math.abs(box.west + 90) < 1e-9 && Math.abs(box.north - 30) < 1e-9);
  assert.equal(boxFromRectangle(null), null);
  const ints = quantizeBox({
    west: -97.812345678,
    south: 30.2,
    east: -97.7,
    north: 30.3999999,
  });
  assert.deepEqual(ints, {
    west: -9781235,
    south: 3020000,
    east: -9770000,
    north: 3040000,
  });
  assert.deepEqual(quantizeBox(dequantizeBox(ints)), ints);
  assert.equal(quantizeBox(null), null);
  assert.equal(dequantizeBox({ west: 'x' }), null);
});

test('[recent-imagery-010] days and candidate keys are real UTC calendar days', () => {
  assert.equal(utcDay('2026-09-18T20:00:00-05:00'), '2026-09-19');
  assert.equal(utcDay(new Date(Date.UTC(2026, 0, 1))), '2026-01-01');
  assert.equal(utcDay('2026-02-30'), null);
  assert.equal(utcDay('nope'), null);
  assert.deepEqual(parseCandidateKey('L30:2026-09-10'), {
    product: 'L30',
    day: '2026-09-10',
  });
  assert.equal(parseCandidateKey('X30:2026-09-10'), null);
  assert.equal(parseCandidateKey('S30:2026-02-30'), null);
  assert.equal(shortDay('2026-09-18'), 'Sep 18');
  assert.equal(shortDay('nope'), '');
});

test('[recent-imagery-011] granules group into one candidate per product and UTC day, newest first', () => {
  const candidates = groupGranulesByDay([
    granule({ id: 'a', cloud: 12, timeEnd: '2026-09-18T17:12:40Z' }),
    granule({
      id: 'b',
      cloud: 18,
      timeStart: '2026-09-18T17:20:00Z',
      timeEnd: '2026-09-18T17:20:40Z',
    }),
    granule({
      id: 'c',
      cloud: null,
      product: 'L30',
      timeStart: '2026-09-18T16:00:00Z',
      timeEnd: null,
    }),
    granule({ id: 'd', cloud: 3, timeStart: '2026-09-10T17:00:00Z' }),
    granule({ id: 'e', timeStart: 'garbage' }),
    granule({ id: 'f', product: 'nope' }),
  ]);
  assert.deepEqual(
    candidates.map((c) => c.key),
    ['S30:2026-09-18', 'L30:2026-09-18', 'S30:2026-09-10'],
  );
  const [s18, l18] = candidates;
  assert.deepEqual(s18.cloud, { min: 12, max: 18 });
  assert.deepEqual(s18.timeRange, {
    start: '2026-09-18T17:12:00.000Z',
    end: '2026-09-18T17:20:40.000Z',
  });
  assert.equal(s18.availability, 'present');
  assert.equal(l18.cloud, null, 'missing cloud stays unknown');
  assert.equal(l18.timeRange.end, '2026-09-18T16:00:00.000Z');
});

test('[recent-imagery-012] VIIRS lists the last 30 UTC days as unprobed full-coverage days', () => {
  const days = viirsCandidates('2026-03-01T13:00:00Z', 3);
  assert.deepEqual(
    days.map((c) => c.key),
    ['VIIRS:2026-03-01', 'VIIRS:2026-02-28', 'VIIRS:2026-02-27'],
  );
  assert.equal(days[0].availability, 'unknown');
  assert.equal(days[0].coverage, 'full');
  assert.equal(viirsCandidates('2026-09-21').length, 30);
  assert.deepEqual(viirsCandidates('bad'), []);
});

test('[recent-imagery-011] merging sorts newest day first, then S30, L30, VIIRS, and the first key wins', () => {
  const merged = mergeCandidates([
    viirsCandidates('2026-09-18', 2),
    [hls('L30', '2026-09-18', [5]), hls('S30', '2026-09-17', [5])],
    [hls('S30', '2026-09-18', [7]), hls('S30', '2026-09-18', [99])],
  ]);
  assert.deepEqual(
    merged.map((c) => c.key),
    [
      'S30:2026-09-18',
      'L30:2026-09-18',
      'VIIRS:2026-09-18',
      'S30:2026-09-17',
      'VIIRS:2026-09-17',
    ],
  );
  assert.deepEqual(merged[0].cloud, { min: 7, max: 7 });
});

test('[recent-imagery-013] coverage samples the box corners and centre against the union of footprints', () => {
  const ring = (west, east) => [
    [west, 30],
    [east, 30],
    [east, 31],
    [west, 31],
  ];
  const withRings = (...rings) => ({
    granules: rings.map((footprint) => granule({ footprint })),
  });
  assert.equal(coverageFor(withRings(ring(-98, -97)), BOX), 'full');
  assert.equal(coverageFor(withRings(ring(-98, -97.75)), BOX), 'partial');
  assert.equal(
    coverageFor(withRings(ring(-98, -97.75), ring(-97.75, -97)), BOX),
    'full',
  );
  assert.equal(coverageFor(withRings(null), BOX), 'unknown');
});

test('[recent-imagery-014] START HERE is the newest all-clear HLS day; unknown cloud is never clear', () => {
  const candidates = [
    hls('S30', '2026-09-20', [10, null]),
    hls('S30', '2026-09-19', [5, 21]),
    hls('S30', '2026-09-18', [0, 20]),
  ];
  assert.deepEqual(rankLatest([...candidates].reverse()), {
    candidate: candidates[2],
    reason: 'clear',
    certain: true,
  });
  assert.equal(rankLatest(candidates, { truncated: true }).certain, false);
  // Then the newest cloudy HLS day, then the newest non-empty VIIRS day.
  const cloudy = rankLatest([
    hls('L30', '2026-09-20', [45]),
    hls('S30', '2026-09-19', [null]),
  ]);
  assert.equal(cloudy.candidate.key, 'L30:2026-09-20');
  assert.equal(cloudy.reason, 'cloudy');
  const viirs = viirsCandidates('2026-09-21', 3);
  viirs[0] = { ...viirs[0], availability: 'empty' };
  const empty = { ...hls('S30', '2026-09-21', [0]), availability: 'empty' };
  const overview = rankLatest([empty, ...viirs]);
  assert.equal(overview.candidate.key, 'VIIRS:2026-09-20');
  assert.equal(overview.reason, 'overview');
  assert.equal(rankLatest([]).candidate, null);
});

test('[recent-imagery-014] START HERE prefers a day that covers the whole box over a newer sliver', () => {
  const full = (day, clouds) => hls('S30', day, clouds, { coverage: 'full' });
  const sliver = (day, clouds) =>
    hls('S30', day, clouds, { coverage: 'partial' });
  const pick = (list) => {
    const { candidate, reason } = rankLatest(list);
    return `${candidate?.day} ${reason}`;
  };
  assert.equal(
    pick([sliver('2026-09-20', [0]), full('2026-09-18', [10])]),
    '2026-09-18 clear',
  );
  assert.equal(
    pick([full('2026-09-20', [null]), sliver('2026-09-19', [0])]),
    '2026-09-20 cloudy',
  );
  // Unknown coverage (no footprints) counts as whole-box.
  assert.equal(
    pick([
      hls('S30', '2026-09-20', [5], { coverage: 'unknown' }),
      full('2026-09-18', [5]),
    ]),
    '2026-09-20 clear',
  );
  // Only slivers: the newest clear one, then the newest at all.
  assert.equal(
    pick([sliver('2026-09-20', [50]), sliver('2026-09-19', [0])]),
    '2026-09-19 partial',
  );
  assert.equal(
    pick([sliver('2026-09-20', [50]), sliver('2026-09-19', [null])]),
    '2026-09-20 partial',
  );
  assert.equal(
    pick([...viirsCandidates('2026-09-21', 2), sliver('2026-09-19', [70])]),
    '2026-09-19 partial',
    'a sliver still beats the overview',
  );
});

test('[recent-imagery-015] the readout is one UTC line with age, sensor, resolution and scene cloud', () => {
  const now = '2026-09-21T12:00:00Z';
  const readout = (granules) =>
    formatCandidateReadout(groupGranulesByDay(granules)[0], now);
  assert.equal(
    readout([granule({ timeStart: '2026-09-18T17:12:10Z' })]),
    'Sep 18, 2026 17:12Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12% scene cloud',
  );
  assert.equal(
    readout([
      granule({ id: 'a' }),
      granule({
        id: 'b',
        cloud: 18.4,
        timeStart: '2026-09-18T17:20:00Z',
        timeEnd: '2026-09-18T17:20:30Z',
      }),
    ]),
    'Sep 18, 2026 17:12–17:20Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12–18% scene cloud',
  );
  assert.equal(
    readout([
      granule({
        product: 'L30',
        cloud: null,
        timeStart: '2026-09-20T16:05:00Z',
        timeEnd: null,
      }),
    ]),
    'Sep 20, 2026 16:05Z · yesterday · Landsat 8/9 via HLS · 30 m · cloud unknown',
  );
  assert.equal(
    formatCandidateReadout(viirsCandidates('2026-09-21', 1)[0], now),
    'Sep 21, 2026 · today · VIIRS NOAA-21 · 250 m · overview · cloud unknown',
  );
  assert.equal(formatCandidateReadout(null), '');
});

test('[recent-imagery-016] GIBS templates put y before x; Worldview snapshots take south,west,north,east', () => {
  assert.equal(
    gibsTemplate('S30', '2026-09-18'),
    'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/HLS_S30_Nadir_BRDF_Adjusted_Reflectance/default/2026-09-18/GoogleMapsCompatible_Level12/{z}/{y}/{x}.png',
  );
  assert.equal(
    gibsTemplate('VIIRS', '2026-09-21'),
    'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_NOAA21_CorrectedReflectance_TrueColor/default/2026-09-21/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
  );
  assert.match(gibsTemplate('L30', '2026-09-10'), /HLS_L30_.*Level12.*\.png$/);
  assert.throws(() => gibsTemplate('MODIS', '2026-01-01'), /Unknown/);
  assert.equal(
    wvsSnapshotUrl({
      product: 'S30',
      day: '2026-09-18',
      box: BOX,
      width: 256,
      height: 256,
    }),
    'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=HLS_S30_Nadir_BRDF_Adjusted_Reflectance&CRS=EPSG:4326&TIME=2026-09-18&BBOX=30.2,-97.8,30.3,-97.7&WIDTH=256&HEIGHT=256&FORMAT=image/png',
  );
  assert.throws(
    () => wvsSnapshotUrl({ product: 'S30', day: 'x', box: null }),
    TypeError,
  );
});

test('[recent-imagery-017] thumbnails load the focused card, then the visible cards outward, then the margins', () => {
  assert.deepEqual(thumbnailOrder(5, 3, 7, 20), [5, 6, 4, 7, 3, 8, 2, 9, 1]);
  assert.deepEqual(thumbnailOrder(19, 17, 19, 20), [19, 18, 17, 16, 15]);
  assert.deepEqual(thumbnailOrder(50, 7, 3, 10), [7, 6, 5, 4, 3, 8, 2, 9, 1]);
  assert.deepEqual(thumbnailOrder(0, 0, 0, 0), []);
});

test('[recent-imagery-006] each independent box limit rejects its box', () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 181, north: 1 }).reason,
    'invalid',
  );
  assert.equal(
    validateBox({ west: 0, south: 0, east: 1, north: 0 }).reason,
    'degenerate',
  );
  assert.equal(
    validateBox({ west: 0, south: -86, east: 1, north: 0 }).reason,
    'polar',
  );
  assert.equal(
    validateBox({ west: 0, south: 0, east: 1, north: 86 }).reason,
    'polar',
  );
  assert.equal(Number.isNaN(boxSideKm(null).width), true);
  assert.equal(Number.isNaN(boxSideKm(null).height), true);
  assert.equal(
    viewTooLargeMessage(undefined),
    'View is 0 km wide · limit 1,000 km',
  );
});

test('[recent-imagery-008 recent-imagery-010] invalid pin data and absent day return null', () => {
  assert.equal(boxFromPin(0, NaN), null);
  assert.equal(boxFromPin(0, 0, NaN), null);
  assert.equal(boxFromPin(0, 0, 0), null);
  assert.equal(boxFromPin(0, 180), null);
  assert.equal(shortDay(null), '');
  assert.equal(utcDay(null), null);
});

test('[recent-imagery-011 recent-imagery-013] absent lists and footprints have explicit results', () => {
  assert.deepEqual(groupGranulesByDay(null), []);
  assert.deepEqual(mergeCandidates([null, [null, {}]]), []);
  assert.equal(coverageFor(null, BOX), 'unknown');
  assert.equal(
    coverageFor(
      {
        granules: [
          {
            footprint: [
              [0, 0],
              [1, 1],
            ],
          },
        ],
      },
      null,
    ),
    'unknown',
  );
  const day = groupGranulesByDay([granule({ timeEnd: 'bad' })])[0];
  assert.equal(day.timeRange, null);
});

test('[recent-imagery-015] absent times and invalid clock keep the readout bounded', () => {
  const c = {
    product: 'S30',
    day: '2026-09-18',
    timeRange: { start: 'bad' },
    cloud: null,
  };
  assert.equal(
    formatCandidateReadout(c, 'bad'),
    'Sep 18, 2026 Z · Sentinel-2 via HLS · 30 m · cloud unknown',
  );
  assert.equal(formatCandidateReadout(null), '');
});

test('[recent-imagery-016] unknown products and absent snapshot box fail', () => {
  assert.throws(
    () => wvsSnapshotUrl({ product: 'bad', box: BOX }),
    /Unknown imagery product/,
  );
  assert.throws(
    () => wvsSnapshotUrl({ product: 'S30', box: null }),
    /finite box/,
  );
});

test('[recent-imagery-006] the west limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: -181, south: 0, east: 1, north: 1 }).reason,
    'invalid',
  );
});

test('[recent-imagery-006] the east limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 181, north: 1 }).reason,
    'invalid',
  );
});

test('[recent-imagery-006] the south limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: -86, east: 1, north: 0 }).reason,
    'polar',
  );
});

test('[recent-imagery-006] the north limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 1, north: 86 }).reason,
    'polar',
  );
});

test('[recent-imagery-006] the zero-width limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 0, north: 1 }).reason,
    'degenerate',
  );
});

test('[recent-imagery-006] the zero-height limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 1, north: 0 }).reason,
    'degenerate',
  );
});

test('[recent-imagery-006] the wide limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 10, north: 0.1 }).reason,
    'too-large',
  );
});

test('[recent-imagery-006] the tall limit alone rejects the box', async () => {
  assert.equal(
    validateBox({ west: 0, south: 0, east: 0.1, north: 10 }).reason,
    'too-large',
  );
});

test('[recent-imagery-008] invalid pin longitude alone returns null', async () => {
  assert.equal(boxFromPin('0', 0, 10), null);
});

test('[recent-imagery-008] invalid pin latitude alone returns null', async () => {
  assert.equal(boxFromPin(0, '0', 10), null);
});

test('[recent-imagery-008] invalid pin size alone returns null', async () => {
  assert.equal(boxFromPin(0, 0, '10'), null);
});

test('[recent-imagery-008] invalid pin positive-size alone returns null', async () => {
  assert.equal(boxFromPin(0, 0, -1), null);
});

test('[recent-imagery-013] a nonfinite footprint point does not prove full box coverage', () => {
  const candidate = {
    granules: [
      {
        footprint: [
          [-120, NaN],
          [-121, 31],
          [-121, 30],
          [-120, 30],
        ],
      },
    ],
  };
  assert.equal(coverageFor(candidate, BOX), 'partial');
});

test('[recent-imagery-013] a nonfinite latitude can produce a full result', () => {
  const candidate = {
    granules: [
      {
        footprint: [
          [-121, NaN],
          [-120, 31],
          [-120, 30],
          [-121, 30],
        ],
      },
    ],
  };
  assert.equal(coverageFor(candidate, BOX), 'full');
});

test('[recent-imagery-013] sloped footprint uses its latitude span', () => {
  const candidate = {
    granules: [
      {
        footprint: [
          [0, 0],
          [2, 0],
          [0, 2],
        ],
      },
    ],
  };
  assert.equal(
    coverageFor(candidate, { west: 0.5, south: 0.5, east: 0.6, north: 0.6 }),
    'full',
  );
});

test('[recent-imagery-010] four digit year limits still reject invalid calendar dates', () => {
  assert.equal(utcDay('0000-00-00'), null);
  assert.equal(utcDay('0000-13-32'), null);
  assert.equal(utcDay('9999-99-99'), null);
  assert.equal(utcDay('9999-12-31'), '9999-12-31');
  assert.equal(parseCandidateKey('S30:9999-99-99'), null);
});

test('[recent-imagery-011] an empty group cannot create an empty day bucket', () => {
  assert.deepEqual(groupGranulesByDay([]), []);
  assert.deepEqual(
    groupGranulesByDay([
      null,
      granule({ timeStart: 'bad' }),
      granule({ product: 'unknown' }),
    ]),
    [],
  );
  assert.equal(groupGranulesByDay([granule()])[0].availability, 'present');
});

test('[recent-imagery-007] an infinite aspect alone uses the square view', async () => {
  assert.equal(
    Math.round(fitViewHeightM({ width: Infinity, height: 1, fovy: 1 })),
    346410,
  );
});

test('[recent-imagery-007] a zero aspect alone uses the square view', async () => {
  assert.equal(
    Math.round(fitViewHeightM({ width: 0, height: 1, fovy: 1 })),
    346410,
  );
});

test('[recent-imagery-007] a zero field angle alone uses the square view', async () => {
  assert.equal(
    Math.round(fitViewHeightM({ width: 1, height: 1, fovy: 0 })),
    346410,
  );
});

test('[recent-imagery-007] a large field angle alone uses the square view', async () => {
  assert.equal(
    Math.round(fitViewHeightM({ width: 1, height: 1, fovy: 4 })),
    346410,
  );
});

test('[recent-imagery-006] a function with box edges still fails the box type check', async () => {
  const box = Object.assign(() => {}, { west: 0, south: 0, east: 1, north: 1 });
  assert.equal(validateBox(box).reason, 'invalid');
});

test('[recent-imagery-009] a function with rectangle edges still fails the rectangle type check', async () => {
  const rectangle = Object.assign(() => {}, {
    west: 0,
    south: 0,
    east: 0.1,
    north: 0.1,
  });
  assert.equal(boxFromRectangle(rectangle), null);
});

test('[recent-imagery-011] a nonfinite cloud number alone stays unknown', async () => {
  assert.equal(groupGranulesByDay([granule({ cloud: NaN })])[0].cloud, null);
});

test('[recent-imagery-010] a text object takes the timestamp path', async () => {
  assert.equal(utcDay(Object('2026-09-18')), '2026-09-18');
});

test('[recent-imagery-010] a Date timestamp keeps the zero year', async () => {
  assert.equal(utcDay(new Date('0000-09-18T17:12:00.000Z')), '0000-09-18');
});

test('[recent-imagery-011] an unparseable start alone prevents the time range', async () => {
  const day = groupGranulesByDay([
    granule({ timeStart: new Date('-000001-09-18T17:12:00.000Z') }),
  ])[0];
  assert.equal(day.timeRange, null);
});

test('[recent-imagery-013] a short polygon alone gives unknown coverage', async () => {
  assert.equal(
    coverageFor(
      {
        granules: [
          {
            footprint: [
              [0, 0],
              [1, 1],
            ],
          },
        ],
      },
      BOX,
    ),
    'unknown',
  );
});

test('[recent-imagery-013] an absent box alone gives unknown coverage', async () => {
  assert.equal(
    coverageFor(
      {
        granules: [
          {
            footprint: [
              [-98, 30],
              [-97, 30],
              [-97, 31],
              [-98, 31],
            ],
          },
        ],
      },
      null,
    ),
    'unknown',
  );
});

test('[recent-imagery-014] an HLS day without granules cannot win', async () => {
  assert.equal(
    rankLatest([
      {
        key: 'S30:2026-09-18',
        product: 'S30',
        day: '2026-09-18',
        granules: [],
        availability: 'present',
        coverage: 'full',
      },
    ]).candidate,
    null,
  );
});

test('[recent-imagery-014] an unknown product alone cannot win', async () => {
  const day = {
    ...hls('S30', '2026-09-18', [12]),
    product: 'BAD',
    key: 'BAD:2026-09-18',
  };
  assert.equal(rankLatest([day]).candidate, null);
});

test('[recent-imagery-014] an overview with granule facts still uses the overview tier', async () => {
  const day = {
    ...hls('S30', '2026-09-18', [12]),
    product: 'VIIRS',
    key: 'VIIRS:2026-09-18',
  };
  assert.equal(rankLatest([day]).reason, 'overview');
});

test('[recent-imagery-015] an unknown product alone has an empty readout', async () => {
  assert.equal(
    formatCandidateReadout({ product: 'BAD', day: '2026-09-18' }),
    '',
  );
});

test('[recent-imagery-015] an absent day alone has an empty readout', async () => {
  assert.equal(formatCandidateReadout({ product: 'S30' }), '');
});

test('[recent-imagery-015] an absent end time keeps the start time', async () => {
  const day = {
    ...hls('S30', '2026-09-18', [12, 12]),
    timeRange: { start: '2026-09-18T17:12:00Z' },
  };
  assert.equal(
    formatCandidateReadout(day, '2026-09-21'),
    'Sep 18, 2026 17:12Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12% scene cloud',
  );
});

test('[recent-imagery-015] one granule alone keeps one readout time', async () => {
  const day = {
    ...hls('S30', '2026-09-18', [12]),
    timeRange: { start: '2026-09-18T17:12:00Z', end: '2026-09-18T17:20:00Z' },
  };
  assert.equal(
    formatCandidateReadout(day, '2026-09-21'),
    'Sep 18, 2026 17:12Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12% scene cloud',
  );
});

test('[recent-imagery-015] equal times alone keep one readout time', async () => {
  const day = {
    ...hls('S30', '2026-09-18', [12, 12]),
    timeRange: { start: '2026-09-18T17:12:00Z', end: '2026-09-18T17:12:00Z' },
  };
  assert.equal(
    formatCandidateReadout(day, '2026-09-21'),
    'Sep 18, 2026 17:12Z · 3 days ago · Sentinel-2 via HLS · 30 m · 12% scene cloud',
  );
});

test('[recent-imagery-017] the first card rejects negative neighbors', async () => {
  assert.deepEqual(thumbnailOrder(0, 0, 0, 3, 2), [0, 1, 2]);
});
