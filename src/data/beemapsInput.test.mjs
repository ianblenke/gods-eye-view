import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  boxAreaKm2,
  readBodyText,
  validateRequest,
} from '../../server/providers/beemaps/validate.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const BOX = [10, 60, 10.02, 60.01];
const send = (body, now = NOW) => validateRequest(JSON.stringify(body), now);
const refused = (result, error, extra = {}) => {
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.deepEqual(result.payload, { error, ...extra });
};
const triangle = [
  [10, 60],
  [10.01, 60],
  [10.01, 60.01],
  [10, 60],
];
/** A closed ring with `count` positions on a small circle. */
const ringOf = (count) => {
  const ring = [];
  for (let i = 0; i < count - 1; i++) {
    const angle = (2 * Math.PI * i) / (count - 1);
    ring.push([10 + 0.005 * Math.cos(angle), 60 + 0.002 * Math.sin(angle)]);
  }
  ring.push(ring[0]);
  return ring;
};
const polygon = (ring) => ({ type: 'Polygon', coordinates: [ring] });
const stream = (...chunks) => Readable.from(chunks.map((c) => Buffer.from(c)));

test('[beemaps-source-005] reads a body of exactly 8192 bytes and refuses a body of 8193 bytes', async () => {
  const head = JSON.stringify({ bbox: BOX });
  const exact = head.slice(0, -1) + ' '.repeat(8192 - head.length) + '}';
  assert.equal(Buffer.byteLength(exact), 8192);
  const text = await readBodyText(stream(exact));
  assert.equal(text, exact);
  assert.equal(validateRequest(text, NOW).ok, true);
  assert.equal(await readBodyText(stream(exact + ' ')), null);
});

test('[beemaps-source-005] counts bytes and not characters, and counts all chunks', async () => {
  const twoBytes = 'é'.repeat(4096);
  assert.equal(Buffer.byteLength(twoBytes), 8192);
  assert.equal(await readBodyText(stream(twoBytes)), twoBytes);
  assert.equal(await readBodyText(stream(twoBytes + 'é')), null);
  const half = 'a'.repeat(4096);
  assert.equal(await readBodyText(stream(half, half)), half + half);
  assert.equal(await readBodyText(stream(half, half, 'a')), null);
  assert.equal(await readBodyText(stream()), '');
});

test('[beemaps-source-005] gives null when the request body fails while it is read', async () => {
  const failing = Readable.from(
    (async function* () {
      yield Buffer.from('{"bbox":');
      throw new Error('aborted');
    })(),
  );
  assert.equal(await readBodyText(failing), null);
});

test('[beemaps-source-005] refuses a body that is not JSON, not an object or has an unknown field', () => {
  for (const text of [
    '',
    'not json',
    '{"bbox":',
    'null',
    '[]',
    '5',
    '"text"',
    'true',
    '[{"bbox":[10,60,10.02,60.01]}]',
  ])
    refused(validateRequest(text, NOW), 'bad_body');
  refused(send({ bbox: BOX, extra: 1 }), 'bad_body');
  refused(send({ bbox: BOX, Since: '2026-10-01' }), 'bad_body');
  refused(
    validateRequest('{"bbox":[10,60,10.02,60.01],"__proto__":{}}', NOW),
    'bad_body',
  );
  assert.equal(send({ bbox: BOX }).ok, true);
  assert.equal(send({ bbox: BOX, since: '2026-10-01', limit: 5 }).ok, true);
  assert.equal(send({ polygon: polygon(triangle), limit: 5 }).ok, true);
});

test('[beemaps-source-006] builds the ring of a box with the longitude first', () => {
  const result = send({ bbox: BOX });
  assert.equal(result.ok, true);
  assert.deepEqual(result.ring, [
    [10, 60],
    [10.02, 60],
    [10.02, 60.01],
    [10, 60.01],
    [10, 60],
  ]);
});

test('[beemaps-source-006] refuses a box that is not a list of four numbers', () => {
  for (const bbox of [
    'abc',
    5,
    null,
    {},
    [],
    [10, 60, 10.02],
    [10, 60, 10.02, 60.01, 1],
    ['10', 60, 10.02, 60.01],
    [10, '60', 10.02, 60.01],
    [10, 60, '10.02', 60.01],
    [10, 60, 10.02, '60.01'],
    [10, 60, 10.02, null],
    { length: 4 },
    'abcd',
  ])
    refused(send({ bbox }), 'bad_area');
  for (const index of [0, 1, 2, 3]) {
    const text = `{"bbox":[${BOX.map((v, i) => (i === index ? '1e999' : v)).join(',')}]}`;
    refused(validateRequest(text, NOW), 'bad_area');
  }
});

test('[beemaps-source-006] refuses a box with west not less than east or south not less than north', () => {
  refused(send({ bbox: [10.02, 60, 10, 60.01] }), 'bad_area');
  refused(send({ bbox: [10, 60, 10, 60.01] }), 'bad_area');
  refused(send({ bbox: [10, 60.01, 10.02, 60] }), 'bad_area');
  refused(send({ bbox: [10, 60, 10.02, 60] }), 'bad_area');
  assert.equal(send({ bbox: [10, 60, 10.0001, 60.0001] }).ok, true);
});

test('[beemaps-source-006] refuses a longitude outside -180 to 180 and a latitude outside -90 to 90', () => {
  for (const bbox of [
    [179.98, 0, 180.0001, 0.02],
    [-180.0001, 0, -179.98, 0.02],
    [0, 89.99, 0.02, 90.0001],
    [0, -90.0001, 0.02, -89.99],
  ])
    refused(send({ bbox }), 'bad_area');
  for (const bbox of [
    [179.98, 0, 180, 0.02],
    [-180, 0, -179.98, 0.02],
    [0, 89.99, 0.02, 90],
    [0, -90, 0.02, -89.99],
  ])
    assert.equal(send({ bbox }).ok, true, JSON.stringify(bbox));
});

test('[beemaps-source-007] passes a closed ring of 4 to 101 positions on as it is', () => {
  for (const count of [4, 5, 50, 101]) {
    const ring = ringOf(count);
    assert.equal(ring.length, count);
    const result = send({ polygon: polygon(ring) });
    assert.equal(result.ok, true, `count ${count}`);
    assert.deepEqual(result.ring, ring);
  }
  const edge = send({
    polygon: polygon([
      [179.99, 0],
      [180, 0],
      [180, 0.01],
      [179.99, 0],
    ]),
  });
  assert.equal(edge.ok, true);
});

test('[beemaps-source-007] refuses a ring with fewer than 4 or more than 101 positions', () => {
  refused(send({ polygon: polygon(ringOf(102)) }), 'bad_area');
  refused(send({ polygon: polygon(ringOf(103)) }), 'bad_area');
  refused(send({ polygon: polygon(triangle.slice(0, 3)) }), 'bad_area');
  refused(
    send({
      polygon: polygon([
        [10, 60],
        [10, 60],
      ]),
    }),
    'bad_area',
  );
  refused(send({ polygon: polygon([]) }), 'bad_area');
});

test('[beemaps-source-007] refuses a ring whose first and last positions differ', () => {
  const lat = [...triangle.slice(0, 3), [10, 60.0001]];
  const lon = [...triangle.slice(0, 3), [10.0001, 60]];
  refused(send({ polygon: polygon(lat) }), 'bad_area');
  refused(send({ polygon: polygon(lon) }), 'bad_area');
});

test('[beemaps-source-007] refuses a polygon that is not an object of type Polygon with one ring', () => {
  for (const value of ['text', 5, null, true, [], [triangle]])
    refused(send({ polygon: value }), 'bad_area');
  const others = [
    { type: 'MultiPolygon', coordinates: [[triangle]] },
    { type: 'polygon', coordinates: [triangle] },
    { coordinates: [triangle] },
    { type: 'Polygon' },
    { type: 'Polygon', coordinates: 'x' },
    { type: 'Polygon', coordinates: {} },
    { type: 'Polygon', coordinates: [] },
    { type: 'Polygon', coordinates: [triangle, triangle] },
    { type: 'Polygon', coordinates: [5] },
    { type: 'Polygon', coordinates: ['x'] },
    { type: 'Polygon', coordinates: [{}] },
    { type: 'Polygon', coordinates: { 0: triangle, length: 1 } },
    { type: 'Polygon', coordinates: [{ length: 4 }] },
    { type: 'Polygon', coordinates: ['abcd'] },
  ];
  for (const value of others) refused(send({ polygon: value }), 'bad_area');
});

test('[beemaps-source-007] refuses a position that is not two finite numbers in range', () => {
  const middle = (position) => [
    triangle[0],
    position,
    triangle[2],
    triangle[3],
  ];
  const bad = [
    [10],
    [10, 60, 5],
    ['10', 60],
    [10, '60'],
    'x',
    null,
    {},
    [null, 60],
    [10, null],
  ];
  for (const position of bad)
    refused(send({ polygon: polygon(middle(position)) }), 'bad_area');
  refused(
    send({
      polygon: polygon([['10', 60], triangle[1], triangle[2], ['10', 60]]),
    }),
    'bad_area',
  );
  refused(
    validateRequest(
      '{"polygon":{"type":"Polygon","coordinates":[[[10,60],[10.01,60],[1e999,60.01],[10,60]]]}}',
      NOW,
    ),
    'bad_area',
  );
  refused(
    validateRequest(
      '{"polygon":{"type":"Polygon","coordinates":[[[10,60],[10.01,60],[10,1e999],[10,60]]]}}',
      NOW,
    ),
    'bad_area',
  );
  const outLon = [
    [180.0001, 0],
    [180.0002, 0],
    [180.0002, 0.01],
    [180.0001, 0],
  ];
  const outLat = [
    [0, 90.0001],
    [0.01, 90.0001],
    [0.01, 90.0002],
    [0, 90.0001],
  ];
  const lowLon = [
    [-180.0002, 0],
    [-180.0001, 0],
    [-180.0001, 0.01],
    [-180.0002, 0],
  ];
  const lowLat = [
    [0, -90.0002],
    [0.01, -90.0002],
    [0.01, -90.0001],
    [0, -90.0002],
  ];
  for (const ring of [outLon, outLat, lowLon, lowLat])
    refused(send({ polygon: polygon(ring) }), 'bad_area');
});

test('[beemaps-source-008] needs exactly one of box and polygon', () => {
  refused(send({}), 'bad_area');
  refused(send({ since: '2026-10-01' }), 'bad_area');
  refused(send({ bbox: BOX, polygon: polygon(triangle) }), 'bad_area');
  assert.equal(send({ bbox: BOX }).ok, true);
  assert.equal(send({ polygon: polygon(triangle) }).ok, true);
});

test('[beemaps-source-009] measures the box on a sphere and refuses more than 5 km²', () => {
  assert.equal(
    boxAreaKm2([
      [0, 0],
      [0.0201, 0],
      [0.0201, 0.02],
      [0, 0.02],
      [0, 0],
    ]).toFixed(4),
    '4.9705',
  );
  assert.equal(
    boxAreaKm2([
      [0, 0],
      [0.0204, 0],
      [0.0204, 0.02],
      [0, 0.02],
      [0, 0],
    ]).toFixed(4),
    '5.0447',
  );
  assert.equal(send({ bbox: [0, 0, 0.0201, 0.02] }).ok, true);
  refused(send({ bbox: [0, 0, 0.0204, 0.02] }), 'area_too_large', {
    maxKm2: 5,
  });
});

test('[beemaps-source-009] uses the width of the box at its latitude', () => {
  assert.equal(send({ bbox: [10, 60, 10.04, 60.02] }).ok, true);
  assert.equal(
    boxAreaKm2([
      [10, 60],
      [10.04, 60],
      [10.04, 60.02],
      [10, 60.02],
      [10, 60],
    ]).toFixed(4),
    '4.9442',
  );
  assert.equal(
    boxAreaKm2([
      [10, 60],
      [10.0445, 60],
      [10.0445, 60.02],
      [10, 60.02],
      [10, 60],
    ]).toFixed(4),
    '5.5005',
  );
  refused(send({ bbox: [10, 60, 10.0445, 60.02] }), 'area_too_large', {
    maxKm2: 5,
  });
  assert.equal(send({ bbox: [-10.04, -60.02, -10, -60] }).ok, true);
  refused(send({ bbox: [-10.0445, -60.02, -10, -60] }), 'area_too_large', {
    maxKm2: 5,
  });
});

test('[beemaps-source-009] gives a ring the same verdict in both directions', () => {
  const small = [
    [0, 0],
    [0.02, 0],
    [0.02, 0.02],
    [0, 0.02],
    [0, 0],
  ];
  const large = [
    [0, 0],
    [0.0204, 0],
    [0.0204, 0.02],
    [0, 0.02],
    [0, 0],
  ];
  assert.equal(send({ polygon: polygon(small) }).ok, true);
  assert.equal(send({ polygon: polygon([...small].reverse()) }).ok, true);
  refused(send({ polygon: polygon(large) }), 'area_too_large', { maxKm2: 5 });
  refused(send({ polygon: polygon([...large].reverse()) }), 'area_too_large', {
    maxKm2: 5,
  });
});

test('[beemaps-source-009] refuses a ring that crosses itself when its box is more than 5 km²', () => {
  const bowTie = [
    [0, 0],
    [0.03, 0.03],
    [0.03, 0],
    [0, 0.03],
    [0, 0],
  ];
  assert.equal(boxAreaKm2(bowTie).toFixed(4), '11.1279');
  refused(send({ polygon: polygon(bowTie) }), 'area_too_large', {
    maxKm2: 5,
  });
  const small = [
    [0, 0],
    [0.02, 0.02],
    [0.02, 0],
    [0, 0.02],
    [0, 0],
  ];
  assert.equal(send({ polygon: polygon(small) }).ok, true);
});

test('[beemaps-source-010] reads a date and passes it on as the text', () => {
  const result = send({ bbox: BOX, since: '2026-10-01' });
  assert.equal(result.ok, true);
  assert.equal(result.since, '2026-10-01');
  assert.equal(send({ bbox: BOX }).since, null);
  assert.equal(send({ bbox: BOX, since: '2024-02-29' }).since, '2024-02-29');
});

test('[beemaps-source-010] accepts the dates from 2020-01-01 to today in UTC', () => {
  assert.equal(send({ bbox: BOX, since: '2020-01-01' }).ok, true);
  refused(send({ bbox: BOX, since: '2019-12-31' }), 'bad_since');
  assert.equal(send({ bbox: BOX, since: '2026-10-15' }).ok, true);
  refused(send({ bbox: BOX, since: '2026-10-16' }), 'bad_since');
  const lateToday = Date.UTC(2026, 9, 15, 23, 59, 59, 999);
  assert.equal(send({ bbox: BOX, since: '2026-10-15' }, lateToday).ok, true);
  refused(send({ bbox: BOX, since: '2026-10-16' }, lateToday), 'bad_since');
  const midnight = Date.UTC(2026, 9, 16, 0, 0, 0, 0);
  assert.equal(send({ bbox: BOX, since: '2026-10-16' }, midnight).ok, true);
});

test('[beemaps-source-010] refuses a since that is not a text or not a real calendar date', () => {
  for (const since of [20261001, null, true, ['2026-10-01'], {}])
    refused(send({ bbox: BOX, since }), 'bad_since');
  for (const since of [
    '2026-02-30',
    '2025-02-29',
    '2026-13-01',
    '2026-00-10',
    '2026-10-00',
    '2026-10-32',
    '2026-1-01',
    '26-10-01',
    '2026/10/01',
    ' 2026-10-01',
    '2026-10-01 ',
    '2026-10-01T00:00:00Z',
    '',
    'yesterday',
  ])
    refused(send({ bbox: BOX, since }), 'bad_since');
});

test('[beemaps-source-011] reads a limit from 1 to 200 and defaults to 100', () => {
  assert.equal(send({ bbox: BOX }).limit, 100);
  assert.equal(send({ bbox: BOX, limit: 1 }).limit, 1);
  assert.equal(send({ bbox: BOX, limit: 200 }).limit, 200);
  assert.equal(send({ bbox: BOX, limit: 57 }).limit, 57);
});

test('[beemaps-source-011] refuses any other limit and a limit that is not a number', () => {
  for (const limit of [0, 201, -1, 1.5, '5', null, true, [], {}])
    refused(send({ bbox: BOX, limit }), 'bad_limit');
  refused(
    validateRequest('{"bbox":[10,60,10.02,60.01],"limit":1e999}', NOW),
    'bad_limit',
  );
});
