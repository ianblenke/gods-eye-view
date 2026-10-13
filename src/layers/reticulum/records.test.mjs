import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeReticulumSnapshot } from './records.js';

const ID = 'ab12cd34ef56ab12';
const RADIO = {
  frequency: 914875000,
  bandwidth: 125000,
  spreadingFactor: 8,
  codingRate: 5,
};

/** One interface in the shape that the route /api/reticulum sends. */
function iface(overrides = {}) {
  return {
    id: ID,
    type: 'rnode',
    name: 'Example Gateway',
    latitude: 12.346,
    longitude: -45.679,
    heightM: 43,
    hops: 3,
    lastHeard: '2026-10-13T11:00:00.000Z',
    status: 'available',
    radio: { ...RADIO },
    ...overrides,
  };
}
const hex = (n) => n.toString(16).padStart(16, '0');
function doc(interfaces, overrides = {}) {
  return {
    schemaVersion: 1,
    source: 'Reticulum interface discovery',
    stale: false,
    unavailable: false,
    reason: null,
    fetchedAt: '2026-10-13T12:00:00.000Z',
    counts: { total: interfaces.length, positioned: interfaces.length },
    interfaces,
    ...overrides,
  };
}
const ids = (snapshot) => snapshot.interfaces.map((item) => item.id);
const nameOf = (name, type = 'rnode') =>
  normalizeReticulumSnapshot(doc([iface({ name, type })])).interfaces[0].name;

test('[reticulum-layer-005] keeps the fields of a valid interface and sets missing numbers to null', () => {
  const [record] = normalizeReticulumSnapshot(doc([iface()])).interfaces;
  assert.deepEqual(Object.keys(record).sort(), [
    'heightM',
    'hops',
    'id',
    'lastHeard',
    'latitude',
    'longitude',
    'name',
    'radio',
    'status',
    'type',
  ]);
  assert.deepEqual(record, {
    id: 'ab12cd34ef56ab12',
    type: 'rnode',
    name: 'Example Gateway',
    latitude: 12.346,
    longitude: -45.679,
    heightM: 43,
    hops: 3,
    lastHeard: '2026-10-13T11:00:00.000Z',
    status: 'available',
    radio: {
      frequency: 914875000,
      bandwidth: 125000,
      spreadingFactor: 8,
      codingRate: 5,
    },
  });
  const first = (overrides) =>
    normalizeReticulumSnapshot(doc([iface(overrides)])).interfaces[0];
  assert.equal(first({ radio: null }).radio, null);
  assert.equal(first({ radio: undefined }).radio, null);
  assert.equal(first({ radio: 'text' }).radio, null);
  for (const missing of Object.keys(RADIO))
    assert.equal(
      first({ radio: { ...RADIO, [missing]: undefined } }).radio,
      null,
      missing,
    );
  assert.equal(first({ heightM: null }).heightM, null);
  assert.equal(first({ heightM: 'tall' }).heightM, null);
  assert.equal(first({ heightM: Number.NaN }).heightM, null);
  assert.equal(first({ heightM: 0 }).heightM, 0);
  assert.equal(first({ hops: undefined }).hops, null);
  assert.equal(first({ hops: '3' }).hops, null);
  assert.equal(first({ hops: 0 }).hops, 0);
});

test('[reticulum-layer-006] drops the interfaces that are not valid, repeated ids and all after 5000', () => {
  const bad = [
    ['id in capitals', { id: 'AB12CD34EF56AB12' }],
    ['id too short', { id: 'ab12' }],
    ['id too long', { id: 'ab12cd34ef56ab123' }],
    ['id one character short', { id: 'ab12cd34ef56ab1' }],
    ['id as a number', { id: 1234567890123456 }],
    ['id not text', { id: 12345678 }],
    ['id missing', { id: undefined }],
    ['type in capitals', { type: 'RNode' }],
    ['type empty', { type: '' }],
    ['type too long', { type: 'x'.repeat(41) }],
    ['type with a space', { type: 'bad type' }],
    ['type not text', { type: 5 }],
    ['status unknown word', { status: 'online' }],
    ['status in capitals', { status: 'Available' }],
    ['status missing', { status: undefined }],
    ['latitude above 90', { latitude: 90.001 }],
    ['latitude below -90', { latitude: -90.001 }],
    ['longitude above 180', { longitude: 180.001 }],
    ['longitude below -180', { longitude: -180.001 }],
    ['latitude not a number', { latitude: Number.NaN }],
    ['latitude as text', { latitude: '12.3' }],
    ['longitude missing', { longitude: undefined }],
    ['longitude as text', { longitude: '1.2' }],
    ['position zero and zero', { latitude: 0, longitude: 0 }],
    ['lastHeard not a date', { lastHeard: 'soon' }],
    ['lastHeard empty', { lastHeard: '' }],
    ['lastHeard a number', { lastHeard: 1760000000 }],
    ['lastHeard missing', { lastHeard: null }],
  ];
  const list = [iface({ id: hex(1) })];
  bad.forEach(([, overrides], index) =>
    list.push(iface({ id: hex(100 + index), ...overrides })),
  );
  list.push('text', null, 7, [], iface({ id: hex(2), name: 'Second' }));
  const kept = normalizeReticulumSnapshot(doc(list));
  assert.deepEqual(ids(kept), [hex(1), hex(2)]);
  const edges = normalizeReticulumSnapshot(
    doc([
      iface({ id: hex(1), latitude: 90, longitude: 180 }),
      iface({ id: hex(2), latitude: -90, longitude: -180 }),
      iface({ id: hex(3), latitude: 0, longitude: 5 }),
      iface({ id: hex(4), latitude: 5, longitude: 0 }),
      iface({ id: hex(5), type: 'x'.repeat(40) }),
      iface({ id: hex(6), type: 'i2p2' }),
      iface({ id: hex(7), status: 'unknown' }),
      iface({ id: hex(8), status: 'stale' }),
    ]),
  );
  assert.equal(edges.interfaces.length, 8);
  assert.deepEqual(
    edges.interfaces.slice(-2).map((entry) => entry.status),
    ['unknown', 'stale'],
  );
  const repeated = normalizeReticulumSnapshot(
    doc([
      iface({ id: hex(1), name: 'First' }),
      iface({ id: hex(1), name: 'Second' }),
    ]),
  );
  assert.deepEqual(
    repeated.interfaces.map((item) => item.name),
    ['First'],
  );
  const many = [];
  for (let n = 0; n < 5002; n += 1) many.push(iface({ id: hex(n) }));
  const limited = normalizeReticulumSnapshot(doc(many));
  assert.equal(limited.interfaces.length, 5000);
  assert.equal(limited.interfaces[0].id, hex(0));
  assert.equal(limited.interfaces[4999].id, hex(4999));
  const exact = normalizeReticulumSnapshot(doc(many.slice(0, 5000)));
  assert.equal(exact.interfaces.length, 5000);
});

const cp = (...codes) => String.fromCodePoint(...codes);

test('[reticulum-layer-007] cleans the names', () => {
  assert.equal(
    nameOf(`A${cp(0x00)}B${cp(0x1f)}C${cp(0x7f)}D${cp(0x85)}E${cp(0x9f)}F`),
    'ABCDEF',
  );
  assert.equal(
    nameOf(
      `a${cp(0x202e)}b${cp(0x202a)}c${cp(0x2066)}d${cp(0x2069)}e${cp(0x200e)}f${cp(0x200f)}g`,
    ),
    'abcdefg',
  );
  assert.equal(
    nameOf(
      `a${cp(0x200b)}b${cp(0x200d)}c${cp(0x2060)}d${cp(0xfeff)}e${cp(0x61c)}f${cp(0x2028)}g${cp(0x2029)}h`,
    ),
    'abcdefgh',
  );
  for (const code of [
    0x00, 0x1f, 0x3c, 0x3e, 0x7f, 0x85, 0x9f, 0x61c, 0x200b, 0x200d, 0x200f,
    0x2028, 0x202a, 0x202c, 0x202e, 0x2060, 0x2064, 0x2066, 0x2069, 0xfeff,
  ])
    assert.equal(nameOf(`a${cp(code)}b`), 'ab', `0x${code.toString(16)}`);
  for (const code of [
    0x21, 0x3b, 0x3d, 0x3f, 0x40, 0x7e, 0xa1, 0x61b, 0x61d, 0x2010, 0x2027,
    0x2065, 0x206a, 0xfefe, 0xff21,
  ])
    assert.equal(
      nameOf(`a${cp(code)}b`),
      `a${cp(code)}b`,
      `0x${code.toString(16)}`,
    );
  assert.equal(nameOf(`a${cp(0x20)}b`), 'a b');
  assert.equal(nameOf(`a${cp(0xa0, 0xa0, 0x3000)}b`), 'a b');
  assert.equal(nameOf('<b>x</b>'), 'bx/b');
  assert.equal(nameOf('  a   b c  '), 'a b c');
  assert.equal(nameOf('x'.repeat(50)), 'x'.repeat(40));
  assert.equal(nameOf('x'.repeat(40)), 'x'.repeat(40));
  assert.equal(nameOf('x'.repeat(39) + ' yyy'), 'x'.repeat(39));
  assert.equal(nameOf('   ' + 'x'.repeat(45)), 'x'.repeat(40));
  assert.equal(nameOf(cp(0x1f600).repeat(45)), cp(0x1f600).repeat(40));
  const mixed = `A&B "q" ${cp(0x65e5, 0x672c, 0x8a9e)} ${cp(0x3a9)}mega`;
  assert.equal(nameOf(mixed), mixed);
  assert.equal(nameOf(`${cp(0x200b)}<>`), 'Unnamed rnode');
  assert.equal(nameOf(''), 'Unnamed rnode');
  assert.equal(nameOf('   '), 'Unnamed rnode');
  assert.equal(nameOf(42), 'Unnamed rnode');
  assert.equal(nameOf(null), 'Unnamed rnode');
  assert.equal(nameOf(undefined), 'Unnamed rnode');
  assert.equal(nameOf('', 'backbone'), 'Unnamed backbone');
});

test('[reticulum-layer-008] reads the meta of the document', () => {
  const meta = (overrides, interfaces = [iface()]) =>
    normalizeReticulumSnapshot(doc(interfaces, overrides)).meta;
  assert.deepEqual(meta({}), {
    unavailable: false,
    stale: false,
    reason: null,
    fetchedAt: '2026-10-13T12:00:00.000Z',
    total: 1,
  });
  assert.equal(meta({ unavailable: true, reason: 'Down' }).unavailable, true);
  assert.equal(meta({ unavailable: 'yes' }).unavailable, false);
  assert.equal(meta({ unavailable: 1 }).unavailable, false);
  assert.equal(meta({ stale: true }).stale, true);
  assert.equal(meta({ stale: 'true' }).stale, false);
  assert.equal(
    meta({ reason: `  Not   ready${cp(0x202e)} ` }).reason,
    'Not ready',
  );
  assert.equal(meta({ reason: 'r'.repeat(130) }).reason, 'r'.repeat(120));
  assert.equal(meta({ reason: 'r'.repeat(120) }).reason, 'r'.repeat(120));
  assert.equal(meta({ reason: '' }).reason, null);
  assert.equal(meta({ reason: cp(0x200b) }).reason, null);
  assert.equal(meta({ reason: 5 }).reason, null);
  assert.equal(
    meta({ unavailable: true, reason: null }).reason,
    'Reticulum listener unavailable',
  );
  assert.equal(
    meta({ unavailable: true, reason: '' }).reason,
    'Reticulum listener unavailable',
  );
  assert.equal(
    meta({ unavailable: true, reason: undefined }).reason,
    'Reticulum listener unavailable',
  );
  assert.equal(meta({ fetchedAt: 'soon' }).fetchedAt, null);
  assert.equal(meta({ fetchedAt: 5 }).fetchedAt, null);
  assert.equal(meta({ fetchedAt: null }).fetchedAt, null);
  assert.equal(meta({ counts: { total: 7 } }).total, 7);
  assert.equal(meta({ counts: { total: 0 } }).total, 0);
  assert.equal(meta({ counts: { total: -1 } }).total, 1);
  assert.equal(meta({ counts: { total: 1.5 } }).total, 1);
  assert.equal(meta({ counts: { total: '7' } }).total, 1);
  assert.equal(meta({ counts: undefined }).total, 1);
  assert.equal(meta({ counts: null }).total, 1);
  assert.equal(meta({ counts: { total: 9 } }, [iface(), iface()]).total, 9);
  assert.equal(meta({ counts: {} }, [iface(), 'x']).total, 2);
});

test('[reticulum-layer-008] refuses a value that is not a document of the schema version 1', () => {
  assert.equal(normalizeReticulumSnapshot(null), null);
  assert.equal(normalizeReticulumSnapshot('text'), null);
  assert.equal(normalizeReticulumSnapshot([]), null);
  assert.equal(normalizeReticulumSnapshot({}), null);
  assert.equal(normalizeReticulumSnapshot({ interfaces: [] }), null);
  assert.equal(
    normalizeReticulumSnapshot({ schemaVersion: 2, interfaces: [] }),
    null,
  );
  assert.equal(
    normalizeReticulumSnapshot({ schemaVersion: '1', interfaces: [] }),
    null,
  );
  assert.equal(
    normalizeReticulumSnapshot({ schemaVersion: 1, interfaces: 'x' }),
    null,
  );
  assert.equal(
    normalizeReticulumSnapshot({ schemaVersion: 1, interfaces: {} }),
    null,
  );
  assert.deepEqual(
    normalizeReticulumSnapshot({ schemaVersion: 1, interfaces: [] }).interfaces,
    [],
  );
});
