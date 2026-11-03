import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as c from './viewCodec.js';
import * as w from './wire.js';
import * as f from './follow.js';
import {
  fromLegacyShareState,
  toLegacyShareState,
  LEGACY_SHARE_STATE_KEYS,
} from './legacyShareState.js';
import { parseSharePath } from './shareLinkPath.js';
import {
  createDefaultLayerState,
  LAYER_STATE_REGISTRY,
  optionSpecs,
} from '../data/layerState.js';

const NOW = 1793016000000;
const seal = (bytes) => w.encodeBase64Url([...bytes, w.crc8(bytes)]);
const message = (write) => {
  const b = new w.WireWriter();
  b.bytes.push(1);
  write(b);
  return seal(b.finish());
};
const read = (code) => {
  const result = c.decodeShareView(code, { nowMs: NOW });
  assert.equal(result.ok, true, result.reason);
  return result;
};
function fields(code) {
  const b = w.decodeBase64Url(code);
  const r = new w.WireReader(b, 1, b.length - 1);
  const out = new Map();
  while (!r.done) {
    const t = r.tag();
    out.set(
      t.field,
      t.wireType === 2 ? [...r.lengthDelimited().rest()] : r.varint(),
    );
  }
  return out;
}
const entity = (kind = 'aircraft', id = 'ab1234', extra = {}) => ({
  kind: 'thing',
  entity: { kind, id },
  ...extra,
});

const scalarCases = [
  ['lat', 2, 12.3456, 246912],
  ['lon', 3, -23.4567, 469133],
  ['alt', 4, 903, 1806],
  ['heading', 5, 350, 19],
  ['pitch', 6, -21, 41],
  ['roll', 7, 190, 339],
  ['sharedAtMs', 8, 1767225617000, 34],
  ['style', 14, 'noir', 5],
  ['mapStack', 15, 'osm', 4],
  ['hudVariant', 16, 'cyber', 3],
  ['bloomIntensity', 17, 27, 27],
  ['bloomVersion', 18, 1, 1],
  ['sharpenIntensity', 19, 63, 63],
  ['detectionMode', 20, 'SPARSE', 1],
  ['detectionDensity', 21, 100, 100],
  ['detectionAllocation', 22, 'WEIGHTED', 1],
  ['detectionFadePct', 23, 13, 13],
  ['detectionOutsideOpacityPct', 24, 19, 19],
  ['scopeFeatherPct', 25, 137, 137],
  ['scopeTerminusPct', 26, 97, 97],
];
for (const [key, number, value, raw] of scalarCases) {
  test(`[share-codec-012] The scalar ${key} uses its own field`, () => {
    assert.equal(fields(c.encodeShareView({})).has(number), false);
    const code = c.encodeShareView({ [key]: value });
    assert.equal(fields(code).get(number), raw);
    assert.equal(read(code).state[key], value);
    const direct = read(message((b) => b.uintField(number, raw)));
    assert.equal(direct.state[key], value);
    assert.equal(direct.unknownFields, undefined);
  });
}
for (const [key, bit, before, after] of [
  ['bloom', 0, false, true],
  ['sharpen', 1, true, false],
  ['hudVisible', 2, true, false],
  ['celestialRing', 3, false, true],
  ['scopeEnabled', 4, true, false],
]) {
  test(`[share-codec-012] The flag ${key} uses its own bit`, () => {
    assert.equal(read('AQc').state[key], before);
    const code = c.encodeShareView({ [key]: after });
    assert.equal(fields(code).get(9), 2 ** bit);
    const state = read(code).state;
    assert.equal(state[key], after);
    for (const [other, expected] of Object.entries({
      bloom: false,
      sharpen: true,
      hudVisible: true,
      celestialRing: false,
      scopeEnabled: true,
    })) {
      if (other !== key) assert.equal(state[other], expected);
    }
  });
}

test('[share-codec-045] The path parser keeps invalid escapes for the decoder', () => {
  assert.deepEqual(parseSharePath('/app/share/%41%51c/'), {
    code: 'AQc',
    basePath: '/app/',
  });
  assert.deepEqual(parseSharePath('/other/share/%ZZ'), {
    code: '%ZZ',
    basePath: '/other/',
  });
  for (const x of [null, 17, {}, '', '/x/share/', '/x/share/a/b'])
    assert.equal(parseSharePath(x), null);
});

test('[share-codec-055] The zero offset keeps the fix and supplied angles', () => {
  assert.deepEqual(
    f.followCameraFor(
      { lat: 0, lon: 0, alt: 123 },
      { range: 0, heading: 37, pitch: 19 },
    ),
    { lat: 0, lon: 0, alt: 123, heading: 37, pitch: 19, roll: 0 },
  );
});

test('[share-codec-024] The local geometry uses each axis with its sign', () => {
  const p = f.followOffsetToEnu({ range: 1000, heading: 90, pitch: -30 });
  assert.ok(Math.abs(p.east + 866.0254037844387) < 1e-8);
  assert.ok(Math.abs(p.north) < 1e-8);
  assert.ok(Math.abs(p.up - 500) < 1e-8);
  assert.deepEqual(f.followOffsetFromEnu({ east: 300, north: -400, up: 300 }), {
    range: 583,
    heading: 323,
    pitch: -31,
  });
  assert.equal(f.followOffsetFromEnu({ east: NaN, north: 0, up: 0 }), null);
});

test('[share-codec-053] The ASCII helpers check both bounds', () => {
  assert.deepEqual(w.asciiBytes(' A~'), [32, 65, 126]);
  assert.equal(w.asciiText([32, 65, 126]), ' A~');
  for (const text of ['\x1f', '\x7f'])
    assert.throws(() => w.asciiBytes(text), RangeError);
  for (const byte of [31, 127])
    assert.throws(() => w.asciiText([byte]), { reason: 'bad-text' });
  assert.equal(new w.WireReader(Uint8Array.of(5)).svarint(), -3);
  assert.equal(new w.ShareWireError('empty').message, 'empty');
  assert.equal(
    new w.ShareWireError('truncated', 'body').message,
    'truncated: body',
  );
});

test('[share-codec-005] The writer checks each numeric bound', () => {
  for (const x of [NaN, Infinity, 1.5, -1, 9007199254740992])
    assert.throws(() => new w.WireWriter().varint(x), RangeError);
  for (const x of [NaN, 1.5, 0, 536870912])
    assert.throws(() => new w.WireWriter().tag(x, 0), RangeError);
  for (const x of [NaN, 1.5, 4503599627370496, -4503599627370496])
    assert.throws(() => new w.WireWriter().sintField(1, x), RangeError);
  assert.deepEqual([...new w.WireWriter().sintField(1, -3).finish()], [8, 5]);
  assert.deepEqual(
    new w.WireReader(new w.WireWriter().tag(536870911, 5).finish()).tag(),
    { field: 536870911, wireType: 5 },
  );
  assert.throws(
    () =>
      new w.WireReader(new w.WireWriter().varint(4294967296).finish()).tag(),
    { reason: 'bad-field-number' },
  );
  assert.throws(() => w.decodeBase64Url(17), { reason: 'empty' });
});

const numberCases = [
  ['lat', 95, 90],
  ['lat', -95, -90],
  ['lon', 190, -170],
  ['lon', -190, 170],
  ['alt', 1e12, 1e9],
  ['alt', -1e12, -1e9],
  ['pitch', 95, 90],
  ['pitch', -95, -90],
  ['heading', -10, 350],
  ['roll', 721, 1],
  ['bloomIntensity', 1e7, 1e6],
  ['bloomIntensity', -5, 0],
  ['bloomVersion', 1e7, 1e6],
  ['sharpenIntensity', -5, 0],
  ['detectionFadePct', 50, 40],
  ['detectionOutsideOpacityPct', 101, 100],
  ['scopeFeatherPct', 201, 200],
  ['scopeTerminusPct', 3, 94],
  ['scopeTerminusPct', 101, 100],
  ['lat', ' 12.5 ', 12.5],
  ['lon', '23.5', 23.5],
];
for (const [key, value, expected] of numberCases)
  test(`[share-codec-048] The numeric bound for ${key} accepts ${String(value)}`, () => {
    assert.equal(c.normalizeShareViewState({ [key]: value })[key], expected);
    assert.equal(
      read(c.encodeShareView({ [key]: value })).state[key],
      expected,
    );
  });
for (const [index, bad] of [
  null,
  undefined,
  false,
  {},
  [],
  NaN,
  Infinity,
  '',
  ' ',
  'bad',
].entries()) {
  test(`[share-codec-048] The invalid number uses defaults for case ${index}`, () => {
    const out = c.normalizeShareViewState({
      lat: bad,
      lon: bad,
      alt: bad,
      heading: bad,
      pitch: bad,
      roll: bad,
      bloomIntensity: bad,
      bloomVersion: bad,
      sharpenIntensity: bad,
      scopeFeatherPct: bad,
      scopeTerminusPct: bad,
      sharedAtMs: bad,
    });
    assert.deepEqual(
      [
        out.lat,
        out.lon,
        out.alt,
        out.heading,
        out.pitch,
        out.roll,
        out.bloomIntensity,
        out.bloomVersion,
        out.sharpenIntensity,
        out.scopeFeatherPct,
        out.scopeTerminusPct,
        out.sharedAtMs,
      ],
      [0, 0, 800, 0, -35, 0, 0, 2, 49, 100, null, null],
    );
  });
}

test('[share-codec-052] The time decoder checks each bound', () => {
  for (const seconds of [0, -1, 9007199254741]) {
    const code = message((b) => b.sintField(8, seconds - 1767225600));
    assert.equal(
      c.decodeShareView(code, { nowMs: Number.MAX_SAFE_INTEGER }).state
        .sharedAtMs,
      null,
    );
  }
  assert.equal(c.normalizeShareViewState({ sharedAtMs: 999 }).sharedAtMs, null);
  assert.equal(
    c.normalizeShareViewState({ sharedAtMs: 1e20 }).sharedAtMs,
    null,
  );
  assert.equal(
    c.normalizeShareViewState({ sharedAtMs: 1767225601999 }).sharedAtMs,
    1767225601000,
  );
});

test('[share-codec-054] The decoder reports an internal exception', () => {
  const code = message((b) => b.sintField(8, 2));
  assert.deepEqual(
    c.decodeShareView(code, {
      nowMs: {
        [Symbol.toPrimitive]() {
          throw new Error('clock');
        },
      },
    }),
    { ok: false, reason: 'internal-error' },
  );
});

for (const [key, number, defaultName] of [
  ['hudVariant', 16, 'tactical'],
  ['mapStack', 15, 'photoreal'],
]) {
  for (const name of ['future_name-2', 'bad name', ''])
    test(`[${name === 'future_name-2' ? 'share-codec-032' : 'share-codec-056'}] The open name ${key} checks ${name || 'empty'}`, () => {
      const out = read(message((b) => b.textField(number, name)));
      if (name === 'future_name-2') {
        assert.deepEqual(
          fields(c.encodeShareView({ [key]: name })).get(number),
          [102, 117, 116, 117, 114, 101, 95, 110, 97, 109, 101, 45, 50],
        );
        assert.equal(Object.hasOwn(out, 'unknownFields'), false);
      }
      assert.equal(
        out.state[key],
        name === 'future_name-2' ? 'future_name-2' : defaultName,
      );
      assert.deepEqual(
        out.unknownFields,
        name === 'future_name-2'
          ? undefined
          : [{ scope: `enum:${key}`, code: name }],
      );
    });
}

for (const [number, key, name] of [
  [20, 'detectionMode', 'SPARSE'],
  [22, 'detectionAllocation', 'WEIGHTED'],
])
  test(`[share-codec-059] The closed name ${key} accepts known text`, () => {
    const out = read(message((b) => b.textField(number, name)));
    assert.equal(out.state[key], name);
    assert.equal(Object.hasOwn(out, 'unknownFields'), false);
  });

for (const [kind, id, field, encoded] of [
  ['aircraft', 'ab1234', 1, 11211316],
  ['military_aircraft', 'bc2345', 2, 12329797],
  ['vessel', '366999712', 3, 366999712],
  ['satellite', '25544', 4, 25544],
])
  test(`[share-codec-021] The entity ${kind} uses its own numeric field`, () => {
    const code = c.encodeShareView({ view: entity(kind, id) });
    const body = fields(code).get(13);
    const r = new w.WireReader(Uint8Array.from(body));
    assert.deepEqual(r.tag(), { field, wireType: 0 });
    assert.equal(r.varint(), encoded);
    assert.equal(r.done, true);
    assert.deepEqual(read(code).state.view.entity, { kind, id });
    assert.deepEqual(
      read(
        message((b) =>
          b.bytesField(
            13,
            new w.WireWriter().uintField(field, encoded).finish(),
          ),
        ),
      ).state.view.entity,
      { kind, id },
    );
  });

for (const [kind, id] of [
  ['aircraft', '~ab1234'],
  ['military_aircraft', 'adsb_x-1'],
  ['vessel', '002442000'],
])
  test(`[share-codec-021] The entity ${kind} keeps text ${id}`, () => {
    assert.deepEqual(
      read(c.encodeShareView({ view: entity(kind, id) })).state.view.entity,
      { kind, id },
    );
  });
for (const id of [null, {}, NaN, Infinity, '', 'bad id', 'x'.repeat(17)])
  test(`[share-codec-021] The invalid entity id uses a place for ${String(id)}`, () => {
    assert.deepEqual(
      c.normalizeShareViewState({ view: entity('aircraft', id) }).view,
      { kind: 'place' },
    );
  });
test('[share-codec-021] The numeric entity id and absent entity use separate paths', () => {
  assert.deepEqual(
    c.normalizeShareViewState({ view: entity('satellite', 25544) }).view.entity,
    { kind: 'satellite', id: '25544' },
  );
  assert.deepEqual(
    c.normalizeShareViewState({ view: { kind: 'thing' } }).view,
    { kind: 'place' },
  );
  assert.deepEqual(
    c.normalizeShareViewState({ view: { kind: 'future' } }).view,
    { kind: 'place' },
  );
});

test('[share-codec-051] The fix and offset reject invalid source values', () => {
  for (const bad of [
    null,
    17,
    {},
    { lat: 1 },
    { lon: 2 },
    { lat: 'bad', lon: 2 },
    { lat: 1, lon: 'bad' },
  ]) {
    const out = c.normalizeShareViewState({
      lat: 4,
      lon: 5,
      view: entity('aircraft', 'ab1234', { lastKnown: bad, offset: 17 }),
    });
    assert.equal(out.view.lastKnown, null);
    assert.deepEqual(out.view.offset, { range: 2000, heading: 0, pitch: -35 });
    assert.equal(out.lat, 4);
    assert.equal(out.lon, 5);
  }
  const out = c.normalizeShareViewState({
    view: entity('aircraft', 'ab1234', {
      offset: { range: 0, heading: -5, pitch: 100 },
      lastKnown: { lat: 95, lon: -190, alt: 12.6 },
    }),
  });
  assert.deepEqual(out.view.offset, { range: 1, heading: 355, pitch: 90 });
  assert.deepEqual(out.view.lastKnown, {
    lat: 90,
    lon: 170,
    alt: 13,
    observedAtMs: null,
  });
});

for (const [kind, owner, key, id, other] of [
  ['aircraft', 'flights', 'selectedFlightsTrackingId', 'ab1234', 'flights'],
  [
    'military_aircraft',
    'flights',
    'selectedMilitaryTrackingId',
    'bc2345',
    'military',
  ],
  ['satellite', 'satellites', 'selectedSatTrackingId', 25544, 'satellites'],
])
  test(`[share-codec-022 share-codec-039] The tracking slot for ${kind} moves both ways`, () => {
    const layerState = createDefaultLayerState();
    assert.deepEqual(
      [
        layerState.options.flights.selectedFlightsTrackingId,
        layerState.options.flights.selectedMilitaryTrackingId,
        layerState.options.satellites.selectedSatTrackingId,
      ],
      [null, null, null],
    );
    layerState.options[owner][key] = id;
    assert.equal(layerState.options[owner][key], id);
    assert.deepEqual(layerState.enabledLayerIds, []);
    layerState.enabledLayerIds = [other];
    const out = c.normalizeShareViewState({ layerState });
    assert.deepEqual(out.view.entity, { kind, id: String(id) });
    assert.deepEqual(out.layerState.enabledLayerIds, [other]);
    for (const [o, k] of [
      ['flights', 'selectedFlightsTrackingId'],
      ['flights', 'selectedMilitaryTrackingId'],
      ['satellites', 'selectedSatTrackingId'],
    ])
      assert.equal(out.layerState.options[o][k], null);
    const legacy = toLegacyShareState(out);
    assert.equal(legacy.layerState.options[owner][key], id);
  });
test('[share-codec-022] The codec selects the supplied view before a tracked entity', () => {
  const layerState = createDefaultLayerState();
  layerState.enabledLayerIds = ['flights', 'military', 'satellites'];
  layerState.options.flights.selectedFlightsTrackingId = 'ab1234';
  assert.deepEqual(c.normalizeShareViewState({ layerState }).view.entity, {
    kind: 'aircraft',
    id: 'ab1234',
  });
  const out = c.normalizeShareViewState({
    layerState,
    view: entity('vessel', '366999712'),
  });
  assert.deepEqual(out.view.entity, { kind: 'vessel', id: '366999712' });
  assert.equal(out.layerState.options.flights.selectedFlightsTrackingId, null);
  assert.equal(out.layerState.options.flights.selectedMilitaryTrackingId, null);
  assert.equal(out.layerState.options.satellites.selectedSatTrackingId, null);
});

for (const [name, write, reason] of [
  [
    'thing duplicate',
    (b) =>
      b.bytesField(
        13,
        new w.WireWriter().uintField(1, 1).uintField(2, 2).finish(),
      ),
    'duplicate-field',
  ],
  [
    'thing latitude',
    (b) =>
      b.bytesField(
        13,
        new w.WireWriter().uintField(1, 1).sintField(8, 900001).finish(),
      ),
    'out-of-range',
  ],
  [
    'thing longitude',
    (b) =>
      b.bytesField(
        13,
        new w.WireWriter().uintField(1, 1).sintField(9, 1800001).finish(),
      ),
    'out-of-range',
  ],
  ['camera longitude', (b) => b.sintField(3, -1800001), 'out-of-range'],
  [
    'thing wire',
    (b) => b.bytesField(13, new w.WireWriter().bytesField(5, [1]).finish()),
    'wire-type-mismatch',
  ],
  [
    'style duplicate',
    (b) =>
      b.bytesField(
        27,
        new w.WireWriter().varint(1).varint(2).varint(1).varint(3).finish(),
      ),
    'duplicate-entry',
  ],
  ['style truncated', (b) => b.bytesField(27, [1]), 'truncated'],
])
  test(`[share-codec-034] The decoder rejects the ${name}`, () => {
    assert.deepEqual(c.decodeShareView(message(write)), { ok: false, reason });
  });

for (const [name, write, fallback] of [
  ['text place', (b) => b.textField(1, 'place'), undefined],
  ['text thing', (b) => b.textField(1, 'thing'), 'missing-thing'],
  ['text future', (b) => b.textField(1, 'future'), 'unknown-view-kind'],
  ['number place', (b) => b.uintField(1, 0), undefined],
  ['empty entity', (b) => b.bytesField(13, []), 'missing-entity-kind'],
])
  test(`[${name.endsWith('place') ? 'share-codec-062' : name === 'empty entity' ? 'share-codec-064' : 'share-codec-030'}] The view kind uses the ${name} path`, () => {
    const out = read(
      message((b) => {
        b.sintField(2, 120000)
          .sintField(3, 230000)
          .sintField(4, 901)
          .sintField(5, 37)
          .sintField(6, -17)
          .sintField(7, 13);
        write(b);
      }),
    );
    assert.deepEqual(
      [
        out.state.lat,
        out.state.lon,
        out.state.alt,
        out.state.heading,
        out.state.pitch,
        out.state.roll,
      ],
      [12, 23, 901, 37, -17, 13],
    );
    assert.deepEqual(out.state.view, { kind: 'place' });
    assert.equal(out.fallback, fallback);
    assert.equal(Object.hasOwn(out, 'fallback'), fallback !== undefined);
    if (name.endsWith('place'))
      assert.equal(Object.hasOwn(out, 'unknownFields'), false);
  });

const pinnedDefaults = {
  normal: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: null,
  },
  retro: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: {
      pixelation: 1,
      distortion: 0,
      instability: 0.42,
    },
  },
  surveillance: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: {
      gain: 0.18,
      bloom: 0.22,
      scanlineStr: 0.96,
      pixelation: 1,
    },
  },
  thermal: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: {
      sensitivity: 0.85,
      bloom: 0.2,
      mode: 0.33,
      pixelation: 1,
      palette: 0,
    },
  },
  anime: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: {
      saturation: 1,
      edgeThick: 0.5,
    },
  },
  noir: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: {
      contrastAmt: 1.2,
      grainAmt: 0.5,
      vignetteAmt: 0.5,
    },
  },
  snow: {
    bloom: false,
    bloomIntensity: 0,
    sharpen: true,
    sharpenIntensity: 49,
    hudVariant: 'tactical',
    hudVisible: true,
    detectionMode: 'DENSE',
    detectionDensity: 75,
    detectionAllocation: 'ELASTIC',
    detectionFadePct: 7,
    detectionOutsideOpacityPct: 1,
    celestialRing: false,
    styleParams: {
      density: 0.6,
      wind: 0.5,
    },
  },
};
for (const [style, expected] of Object.entries(pinnedDefaults))
  test(`[share-codec-010 share-codec-014] The style ${style} keeps its defaults`, () => {
    assert.deepEqual(c.SHARE_VIEW_STYLE_DEFAULTS[style], expected);
    const out = read(
      message((b) => {
        if (style !== 'normal') b.textField(14, style);
      }),
    );
    for (const [key, value] of Object.entries(expected))
      assert.deepEqual(out.state[key], value);
    const a = c.createDefaultShareViewState(style);
    const b = c.createDefaultShareViewState(style);
    if (a.styleParams) {
      a.styleParams[Object.keys(a.styleParams)[0]] = 99;
      assert.deepEqual(b.styleParams, expected.styleParams);
    }
    assert.equal(
      fields(c.encodeShareView({ style })).size,
      style === 'normal' ? 0 : 1,
    );
  });

const parameterCases = [
  ['retro', 'pixelation', 25, 7.57, 1, 10],
  ['retro', 'distortion', 13, 0.73, 0, 1],
  ['retro', 'instability', 18, 0.73, 0, 1],
  ['surveillance', 'gain', 16, 0.73, 0, 1],
  ['surveillance', 'bloom', 11, 0.73, 0, 1],
  ['surveillance', 'scanlineStr', 28, 0.73, 0, 1],
  ['surveillance', 'pixelation', 25, 4.65, 1, 6],
  ['thermal', 'sensitivity', 28, 0.73, 0, 1],
  ['thermal', 'bloom', 11, 0.73, 0, 1],
  ['thermal', 'mode', 22, 0.73, 0, 1],
  ['thermal', 'pixelation', 25, 4.65, 1, 6],
  ['thermal', 'palette', 10, 0.73, 0, 1],
  ['anime', 'saturation', 28, 1.46, 0, 2],
  ['anime', 'edgeThick', 14, 0.73, 0, 1],
  ['noir', 'contrastAmt', 12, 1.46, 0, 2],
  ['noir', 'grainAmt', 16, 0.73, 0, 1],
  ['noir', 'vignetteAmt', 31, 0.73, 0, 1],
  ['snow', 'density', 13, 0.73, 0, 1],
  ['snow', 'wind', 32, 0.73, 0, 1],
];
for (const [style, key, token, value, min, max] of parameterCases)
  test(`[share-codec-015] The parameter ${style} ${key} uses its own token`, () => {
    const code = c.encodeShareView({ style, styleParams: { [key]: value } });
    assert.deepEqual(fields(code).get(27), [
      token,
      ...new w.WireWriter().varint(Math.round(value * 100)).bytes,
    ]);
    assert.equal(read(code).state.styleParams[key], value);
    const direct = read(
      message((b) => {
        b.textField(14, style);
        b.bytesField(
          27,
          new w.WireWriter()
            .varint(token)
            .varint(Math.round(value * 100))
            .finish(),
        );
      }),
    );
    assert.equal(direct.state.styleParams[key], value);
    for (const [other, v] of Object.entries(pinnedDefaults[style].styleParams))
      if (other !== key) assert.equal(direct.state.styleParams[other], v);
    assert.equal(
      c.normalizeShareViewState({ style, styleParams: { [key]: 1e6 } })
        .styleParams[key],
      max,
    );
    assert.equal(
      c.normalizeShareViewState({ style, styleParams: { [key]: -1e6 } })
        .styleParams[key],
      min,
    );
    for (const bad of [NaN, 'bad', null])
      assert.equal(
        c.normalizeShareViewState({ style, styleParams: { [key]: bad } })
          .styleParams[key],
        pinnedDefaults[style].styleParams[key],
      );
    const inherited = Object.create({ [key]: value });
    assert.equal(
      c.normalizeShareViewState({ style, styleParams: inherited }).styleParams[
        key
      ],
      pinnedDefaults[style].styleParams[key],
    );
  });

const panelCases = [
  {
    number: 0,
    id: 'control-panel',
    token: 'c',
    pinnable: true,
    collapsed: true,
  },
  {
    number: 1,
    id: 'location-bar',
    token: 'l',
    pinnable: true,
    collapsed: true,
  },
  {
    number: 2,
    id: 'data-panel',
    token: 'd',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 3,
    id: 'cctv-panel',
    token: 'v',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 4,
    id: 'recent-imagery-panel',
    token: 'i',
    pinnable: false,
    collapsed: false,
  },
  {
    number: 5,
    id: 'street-level-panel',
    token: 't',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 6,
    id: 'radio-panel',
    token: 'r',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 7,
    id: 'scene-panel',
    token: 's',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 8,
    id: 'global-context-panel',
    token: 'g',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 9,
    id: 'pp-toggles',
    token: 'p',
    pinnable: false,
    collapsed: true,
  },
  {
    number: 10,
    id: 'param-slider-panel',
    token: 'm',
    pinnable: false,
    collapsed: false,
  },
];
for (const panel of panelCases)
  test(`[share-codec-019] The panel ${panel.id} uses its own entry`, () => {
    const defaults = panelCases.map((p) => ({
      id: p.id,
      collapsed: p.collapsed,
      pinned: p.pinnable ? false : null,
    }));
    assert.deepEqual(
      read(message((b) => b.bytesField(12, []))).state.panelState.specs,
      defaults,
    );
    const specs = structuredClone(defaults);
    const current = specs[panel.number];
    current.collapsed = !panel.collapsed;
    if (panel.pinnable) current.pinned = true;
    const code = c.encodeShareView({ panelState: { specs } });
    const expected =
      panel.number * 16 + (panel.collapsed ? 4 : 8) + (panel.pinnable ? 2 : 0);
    assert.deepEqual(fields(code).get(12), [
      ...new w.WireWriter().varint(expected).bytes,
    ]);
    assert.deepEqual(read(code).state.panelState.specs, specs);
    for (const reserved of [0, 12, 7]) {
      const result = read(
        message((b) =>
          b.bytesField(
            12,
            new w.WireWriter().varint(panel.number * 16 + reserved).finish(),
          ),
        ),
      );
      assert.equal(
        result.state.panelState?.specs.some((p) => p.id === panel.id) ?? false,
        false,
      );
      assert.deepEqual(
        result.unknownFields,
        reserved === 0 ? undefined : [{ scope: 'panel', code: panel.number }],
      );
    }
  });

const optionValues = {
  traffic: {
    roadMode: 'hybrid',
  },
  'weather-lightning': {
    opacity: 'light',
  },
  'weather-radar': {
    opacity: 'light',
  },
  'weather-satellite': {
    infrared: 37,
    opacity: 'light',
    product: 'clouds',
  },
  wind: {
    model: 'ifs',
    overlay: 'pressure',
    units: 'mph',
    paused: true,
  },
  flights: {
    models3d: false,
    models3dMode: 'all',
  },
  satellites: {
    catalog: 'dense',
  },
  cctv: {
    coverageMode: 'viewshed',
    showProjection: false,
    autoHop: true,
  },
  'recent-imagery': {
    west: -1234567,
    south: -2345678,
    east: 3456789,
    north: 4567890,
    a: 'S30:2026-09-18',
    b: 'VIIRS:2025-01-02',
    mode: 2,
    split: 37,
    viirs: true,
  },
  'street-level': {
    mapillary: false,
    providerSwitches: 'abc-1*def-0',
    pano: 'flat',
    sinceDays: 365,
  },
  radio: {
    filter: 'genre:jazz',
    volume: 0.35,
  },
};

const absentOptions = {
  traffic: {
    roadMode: null,
  },
  'weather-lightning': {
    opacity: 'strong',
  },
  'weather-radar': {
    opacity: 'strong',
  },
  'weather-satellite': {
    infrared: 100,
    opacity: 'strong',
    product: 'clouds-regional',
  },
  wind: {
    model: 'gfs',
    overlay: 'none',
    units: 'km/h',
    paused: false,
  },
  flights: {
    models3d: true,
    models3dMode: 'proximity',
    selectedFlightsTrackingId: null,
    selectedMilitaryTrackingId: null,
  },
  satellites: {
    catalog: 'core',
    selectedSatTrackingId: null,
  },
  cctv: {
    coverageMode: 'on',
    showProjection: true,
    autoHop: false,
  },
  'recent-imagery': {
    west: null,
    south: null,
    east: null,
    north: null,
    a: null,
    b: null,
    mode: 0,
    split: 50,
    viirs: false,
  },
  'street-level': {
    mapillary: true,
    providerSwitches: '',
    pano: 'all',
    sinceDays: 0,
  },
  radio: {
    filter: 'all',
    volume: 0.8,
  },
};
for (const [owner, values] of Object.entries(optionValues))
  for (const [key, value] of Object.entries(values))
    test(`[share-codec-018] The option ${owner} ${key} keeps its own value`, () => {
      const layerState = createDefaultLayerState();
      layerState.options[owner][key] = value;
      const code = c.encodeShareView({ layerState });
      const body = fields(code).get(11);
      assert.ok(body?.length > 0);
      const out = read(code);
      assert.equal(out.state.layerState.options[owner][key], value);
      assert.equal(Object.hasOwn(out, 'unknownFields'), false);
      assert.equal(
        read(message((b) => b.bytesField(10, []))).state.layerState.options[
          owner
        ][key],
        absentOptions[owner][key],
      );
      for (const [otherOwner, options] of Object.entries(absentOptions))
        for (const [otherKey, expected] of Object.entries(options))
          if (otherOwner !== owner || otherKey !== key)
            assert.deepEqual(
              out.state.layerState.options[otherOwner][otherKey],
              expected,
            );
    });
test('[share-codec-018] The absent options match every frozen value', () => {
  assert.deepEqual(c.SHARE_VIEW_LAYER_OPTION_ABSENT, absentOptions);
  const out = read(message((b) => b.bytesField(10, []))).state.layerState
    .options;
  assert.deepEqual(out, absentOptions);
});

test('[share-codec-043] The legacy converter uses own fields and excludes metadata', () => {
  for (const value of [null, undefined, 17, 'bad', false])
    assert.equal(fromLegacyShareState(value), null);
  const parent = {
    lat: 21,
    lon: 32,
    restoreAuthority: 'parent',
    layerStateInvalid: true,
  };
  const parsed = Object.assign(Object.create(parent), {
    lat: 17,
    alt: 923,
    restoreAuthority: 'own',
    layerStateInvalid: true,
  });
  const state = fromLegacyShareState(parsed);
  assert.equal(state.lat, 17);
  assert.equal(state.lon, 0);
  assert.equal(state.alt, 923);
  assert.equal(Object.hasOwn(state, 'restoreAuthority'), false);
  assert.equal(Object.hasOwn(state, 'layerStateInvalid'), false);
  assert.deepEqual(
    c.normalizeShareViewState(null),
    c.createDefaultShareViewState(),
  );
  assert.deepEqual(
    c.normalizeShareViewState(17),
    c.createDefaultShareViewState(),
  );
});
for (const [key, number, value] of scalarCases)
  test(`[share-codec-043] The legacy field ${key} copies its own value`, () => {
    assert.equal(fromLegacyShareState({ [key]: value })[key], value);
    assert.equal(toLegacyShareState({ [key]: value })[key], value);
  });
for (const [key, value] of Object.entries({
  bloom: true,
  sharpen: false,
  hudVisible: false,
  celestialRing: true,
  scopeEnabled: false,
}))
  test(`[share-codec-043] The legacy flag ${key} copies its own value`, () => {
    assert.equal(fromLegacyShareState({ [key]: value })[key], value);
    assert.equal(toLegacyShareState({ [key]: value })[key], value);
  });
test('[share-codec-043] The legacy converter copies composite state fields', () => {
  const source = {
    style: 'noir',
    styleParams: { grainAmt: 0.73 },
    layerState: { enabledLayerIds: ['radio'] },
    panelState: {
      specs: [{ id: 'cctv-panel', collapsed: false, pinned: null }],
    },
  };
  for (const convert of [fromLegacyShareState, toLegacyShareState]) {
    const state = convert(source);
    assert.equal(state.styleParams.grainAmt, 0.73);
    assert.deepEqual(state.layerState.enabledLayerIds, ['radio']);
    assert.deepEqual(state.panelState, source.panelState);
  }
});

for (const [name, build, reason, unknown] of [
  [
    'duplicate',
    () =>
      new w.WireWriter()
        .varint(15)
        .varint(28)
        .varint(0)
        .varint(15)
        .varint(29)
        .varint(1)
        .varint(48)
        .finish(),
    'duplicate-entry',
  ],
  [
    'excessive text',
    () => new w.WireWriter().varint(15).varint(29).varint(257).finish(),
    'truncated',
  ],
  [
    'bad ASCII text',
    () =>
      new w.WireWriter()
        .varint(15)
        .varint(29)
        .varint(2)
        .bytesField(1, [])
        .finish(),
    'bad-text',
  ],
  [
    'absent text',
    () => new w.WireWriter().varint(15).varint(29).varint(2).finish(),
    'truncated',
  ],
  [
    'an unknown owner',
    () => new w.WireWriter().varint(1500).varint(0).varint(0).finish(),
    null,
    [{ scope: 'layer-option', code: '1500.0' }],
  ],
  [
    'an unknown key',
    () => new w.WireWriter().varint(15).varint(200).varint(0).finish(),
    null,
    [{ scope: 'layer-option', code: '15.100' }],
  ],
  [
    'an invalid value',
    () => new w.WireWriter().varint(15).varint(28).varint(4).finish(),
    null,
    [{ scope: 'layer-option', code: '15.14' }],
  ],
])
  test(`[share-codec-050] The layer option handles ${name}`, () => {
    const code = message((b) => {
      b.bytesField(10, []);
      b.bytesField(11, build());
    });
    const out = c.decodeShareView(code);
    if (reason) assert.deepEqual(out, { ok: false, reason });
    else {
      assert.equal(out.ok, true);
      if (unknown) assert.deepEqual(out.unknownFields, unknown);
      assert.deepEqual(out.state.layerState.options, absentOptions);
      assert.deepEqual(out.state.layerState.enabledLayerIds, []);
    }
  });
test('[share-codec-050] The option without layers reports its scope', () => {
  const out = read(message((b) => b.bytesField(11, [])));
  assert.equal(out.state.layerState, null);
  assert.deepEqual(out.unknownFields, [
    { scope: 'layer-option', code: 'without-layers' },
  ]);
});
test('[share-codec-019] The panel source checks every entry before use', () => {
  for (const panelState of [
    null,
    {},
    { specs: 'bad' },
    {
      specs: [
        null,
        {},
        { id: 'unknown', collapsed: true },
        { id: 'cctv-panel', collapsed: 0 },
      ],
    },
  ])
    assert.equal(c.normalizeShareViewState({ panelState }).panelState, null);
  const out = c.normalizeShareViewState({
    panelState: {
      specs: [
        { id: 'control-panel', collapsed: false, pinned: 17 },
        { id: 'data-panel', collapsed: false, pinned: true },
      ],
    },
  });
  assert.deepEqual(out.panelState, {
    specs: [
      { id: 'control-panel', collapsed: false, pinned: null },
      { id: 'data-panel', collapsed: false, pinned: null },
    ],
  });
});

test('[share-codec-039 share-codec-040 share-codec-041] The legacy view without layers supplies the entity layer', () => {
  for (const [kind, id, layer, key, owner, expected] of [
    [
      'aircraft',
      'ab1234',
      'flights',
      'selectedFlightsTrackingId',
      'flights',
      'ab1234',
    ],
    [
      'military_aircraft',
      'bc2345',
      'military',
      'selectedMilitaryTrackingId',
      'flights',
      'bc2345',
    ],
    [
      'satellite',
      '25544',
      'satellites',
      'selectedSatTrackingId',
      'satellites',
      25544,
    ],
    ['vessel', '366999712', 'ais-live-vessels', null, null, null],
  ]) {
    const out = toLegacyShareState({ view: entity(kind, id) });
    assert.deepEqual(out.layerState.enabledLayerIds, [layer]);
    assert.equal(out.layerStateInvalid, false);
    if (key) assert.equal(out.layerState.options[owner][key], expected);
    else {
      assert.equal(
        out.layerState.options.flights.selectedMilitaryTrackingId,
        null,
      );
      assert.equal(
        out.layerState.options.flights.selectedFlightsTrackingId,
        null,
      );
      assert.equal(
        out.layerState.options.satellites.selectedSatTrackingId,
        null,
      );
    }
  }
});
test('[share-codec-045] The path parser rejects a custom text object', () => {
  assert.equal(
    parseSharePath({
      toString() {
        return '/app/share/AQc';
      },
    }),
    null,
  );
});
test('[share-codec-046] The root uses both share paths and page directories', async () => {
  const { appRootUrl } = await import('./shareLinkPath.js');
  assert.equal(
    appRootUrl('https://example.test/app/share/old?x=2#lat=3').href,
    'https://example.test/app/?x=2',
  );
  assert.equal(
    appRootUrl('https://example.test/other/index.html?x=7#lat=4').href,
    'https://example.test/other/?x=7',
  );
});
test('[share-codec-010] The default state keeps the selected style and valid keys', () => {
  for (const style of [
    'normal',
    'retro',
    'surveillance',
    'thermal',
    'anime',
    'noir',
    'snow',
  ]) {
    const out = c.createDefaultShareViewState(style);
    assert.equal(out.style, style);
    assert.deepEqual(out.view, { kind: 'place' });
    assert.equal(Object.hasOwn(out, 'flags'), false);
    assert.equal(Object.hasOwn(out, 'thing'), false);
    assert.equal(Object.hasOwn(out, 'layerOptions'), false);
    assert.deepEqual(out.styleParams, pinnedDefaults[style].styleParams);
  }
  for (const bad of ['future', null, 17, {}, false])
    assert.equal(c.createDefaultShareViewState(bad).style, 'normal');
});
test('[share-codec-048] The numeric source rejects a custom time object', () => {
  assert.equal(
    c.normalizeShareViewState({
      sharedAtMs: {
        valueOf() {
          return 1767225617000;
        },
      },
    }).sharedAtMs,
    null,
  );
});
test('[share-codec-021] The entity text uses trim and lowercase', () => {
  assert.deepEqual(
    c.normalizeShareViewState({ view: entity('aircraft', '  AB1234  ') }).view
      .entity,
    { kind: 'aircraft', id: 'ab1234' },
  );
  assert.deepEqual(
    c.normalizeShareViewState({ view: entity('ufo', '1') }).view,
    { kind: 'place' },
  );
});
test('[share-codec-015] The style source rejects function objects and absent data', () => {
  const value = Object.assign(() => {}, { grainAmt: 0.73 });
  for (const source of [null, undefined, 17, value])
    assert.deepEqual(
      c.normalizeShareViewState({ style: 'noir', styleParams: source })
        .styleParams,
      { contrastAmt: 1.2, grainAmt: 0.5, vignetteAmt: 0.5 },
    );
});
test('[share-codec-051] The fix and offset reject function objects', () => {
  const fix = Object.assign(() => {}, { lat: 21, lon: 32 });
  const offset = Object.assign(() => {}, {
    range: 3071,
    heading: 73,
    pitch: -17,
  });
  const out = c.normalizeShareViewState({
    view: entity('aircraft', 'ab1234', { lastKnown: fix, offset }),
  });
  assert.equal(out.view.lastKnown, null);
  assert.deepEqual(out.view.offset, { range: 2000, heading: 0, pitch: -35 });
});
for (const [name, extra, expected] of [
  [
    'relative age',
    {
      sharedAtMs: 1767225700000,
      lastKnown: { lat: 12, lon: 23, alt: 45, observedAtMs: 1767225693000 },
    },
    [88, 14],
  ],
  [
    'absolute time',
    { lastKnown: { lat: 12, lon: 23, alt: 45, observedAtMs: 1767225617000 } },
    [96, 34],
  ],
  [
    'the current fix',
    {
      sharedAtMs: 1767225700000,
      lastKnown: { lat: 12, lon: 23, alt: 45, observedAtMs: 1767225700000 },
    },
    [],
  ],
  ['absent time', { lastKnown: { lat: 12, lon: 23, alt: 45 } }, []],
])
  test(`[share-codec-023] The fix time uses ${name}`, () => {
    const { sharedAtMs, lastKnown } = extra;
    const code = c.encodeShareView({
      sharedAtMs,
      view: entity('aircraft', 'ab1234', { lastKnown }),
    });
    const r = new w.WireReader(Uint8Array.from(fields(code).get(13)));
    const times = [];
    while (!r.done) {
      const t = r.tag();
      const v = r.varint();
      if (t.field >= 11) times.push(t.field * 8, v);
    }
    assert.deepEqual(times, expected);
    assert.deepEqual(read(code).state.view.lastKnown, {
      lat: 12,
      lon: 23,
      alt: 45,
      observedAtMs: lastKnown.observedAtMs ?? null,
    });
    for (const key of [2, 3, 4, 5, 6, 7])
      assert.equal(fields(code).has(key), false);
  });
for (const [name, code, reason] of [
  ['non-string', 17, 'not-a-string'],
  ['empty', '', 'empty'],
  ['padding', 'AQ==', 'bad-base64'],
  ['short', 'AQ', 'truncated'],
  ['bound', 'A'.repeat(2049), 'too-long'],
  ['checksum', 'AQA', 'checksum'],
  ['version', seal([2]), 'unsupported-version'],
  ['wire', seal([1, 19]), 'bad-wire-type'],
  ['field', seal([1, 0]), 'bad-field-number'],
  ['truncated varint', seal([1, 16]), 'truncated'],
  ['overlong varint', seal([1, 16, 128, 0]), 'non-canonical-varint'],
  ['unsafe varint', seal([1, 16, ...Array(8).fill(255)]), 'varint-overflow'],
  ['duplicate field', seal([1, 16, 2, 16, 4]), 'duplicate-field'],
  ['wrong field type', seal([1, 18, 1, 65]), 'wire-type-mismatch'],
  ['latitude', message((b) => b.sintField(2, 900001)), 'out-of-range'],
])
  test(`[share-codec-034] The invalid payload reports ${name}`, () => {
    assert.deepEqual(c.decodeShareView(code), { ok: false, reason });
  });

for (const [key, number, value, raw] of [
  ['range', 5, 3071, 3071],
  ['heading', 6, 350, 19],
  ['pitch', 7, -17, 33],
])
  test(`[share-codec-020] The follow offset ${key} uses its own field`, () => {
    const code = c.encodeShareView({
      lat: 11,
      lon: 22,
      alt: 333,
      heading: 44,
      pitch: -55,
      roll: 66,
      view: entity('aircraft', 'ab1234', { offset: { [key]: value } }),
    });
    const r = new w.WireReader(Uint8Array.from(fields(code).get(13)));
    const values = new Map();
    while (!r.done) {
      const t = r.tag();
      values.set(t.field, r.varint());
    }
    assert.equal(values.get(number), raw);
    assert.equal(values.size, 2);
    const camera = read(code).state;
    assert.deepEqual(
      [
        camera.lat,
        camera.lon,
        camera.alt,
        camera.heading,
        camera.pitch,
        camera.roll,
      ],
      [11, 22, 333, 44, -55, 66],
    );
    assert.deepEqual(camera.view.offset, {
      range: 2000,
      heading: 0,
      pitch: -35,
      [key]: value,
    });
    const direct = read(
      message((b) =>
        b.bytesField(
          13,
          new w.WireWriter()
            .uintField(1, 11211316)
            .uintField(number, raw)
            .finish(),
        ),
      ),
    );
    assert.deepEqual(direct.state.view.offset, {
      range: 2000,
      heading: 0,
      pitch: -35,
      [key]: value,
    });
  });

test('[share-codec-063] The complete fix supplies every coordinate and altitude', () => {
  const view = entity('aircraft', 'ab1234', {
    lastKnown: {
      lat: 12.3456,
      lon: -23.4567,
      alt: 1234,
      observedAtMs: 1767225617000,
    },
  });
  const code = c.encodeShareView({ view });
  const body = fields(code).get(13);
  const r = new w.WireReader(Uint8Array.from(body));
  const values = [];
  while (!r.done) {
    const t = r.tag();
    values.push([t.field, r.varint()]);
  }
  assert.deepEqual(values, [
    [1, 11211316],
    [8, 246912],
    [9, 469133],
    [10, 2468],
    [12, 34],
  ]);
  assert.deepEqual(read(code).state.view.lastKnown, {
    lat: 12.3456,
    lon: -23.4567,
    alt: 1234,
    observedAtMs: 1767225617000,
  });
  const zero = c.encodeShareView({
    view: entity('vessel', '366999712', {
      lastKnown: { lat: 0, lon: 0, alt: 0 },
    }),
  });
  const z = new w.WireReader(Uint8Array.from(fields(zero).get(13)));
  const zeroValues = [];
  while (!z.done) zeroValues.push([z.tag().field, z.varint()]);
  assert.deepEqual(zeroValues, [
    [3, 366999712],
    [8, 0],
    [9, 0],
  ]);
});

test('[share-codec-050] The decoder checks the option length cap before the available byte count', () => {
  const packed = new w.WireWriter().varint(15).varint(29).varint(257);
  packed.bytes.push(...Array(257).fill(97));
  assert.deepEqual(
    c.decodeShareView(
      message((b) => {
        b.bytesField(10, []);
        b.bytesField(11, packed.finish());
      }),
    ),
    { ok: false, reason: 'truncated' },
  );
});

test('[share-codec-019] The panel pin differs while its collapse value stays at its default', () => {
  for (const id of ['control-panel', 'location-bar']) {
    const specs = panelCases.map((p) => ({
      id: p.id,
      collapsed: p.collapsed,
      pinned: p.pinnable ? false : null,
    }));
    specs.find((p) => p.id === id).pinned = true;
    assert.deepEqual(
      read(c.encodeShareView({ panelState: { specs } })).state.panelState.specs,
      specs,
    );
  }
});

test('[share-codec-019] The absent panel pin differs from a false pin', () => {
  const specs = panelCases.map((p) => ({
    id: p.id,
    collapsed: p.collapsed,
    pinned: p.pinnable ? false : null,
  }));
  specs[0].pinned = null;
  assert.deepEqual(
    read(c.encodeShareView({ panelState: { specs } })).state.panelState.specs,
    specs,
  );
  const out = read(
    message((b) => b.bytesField(12, new w.WireWriter().varint(8).finish())),
  );
  assert.deepEqual(out.state.panelState.specs[0], {
    id: 'control-panel',
    collapsed: true,
    pinned: null,
  });
});

test('[share-codec-005] The signed writer reports its own range error', () => {
  assert.throws(() => new w.WireWriter().sintField(1, 4503599627370496), {
    name: 'RangeError',
    message: 'signed value out of range: 4503599627370496',
  });
});

const cameraCases = [
  [
    {
      lat: 0,
      lon: 0,
      alt: 100,
    },
    {
      range: 1000,
      heading: 0,
      pitch: 0,
    },
    {
      lat: -0.008993074828925671,
      lon: 0.0,
      alt: 100.0784793831408,
      heading: 0.0,
      pitch: -0.008993074828925671,
      roll: 0,
    },
  ],
  [
    {
      lat: 0,
      lon: 90,
      alt: 200,
    },
    {
      range: 2000,
      heading: 90,
      pitch: -30,
    },
    {
      lat: -9.536185742792537e-19,
      lon: 89.98442622662003,
      alt: 1200.2353975037113,
      heading: 90.0,
      pitch: -30.015573773379973,
      roll: 0,
    },
  ],
  [
    {
      lat: 45,
      lon: -120,
      alt: 3000,
    },
    {
      range: 4000,
      heading: 225,
      pitch: -60,
    },
    {
      lat: 45.0127040274551,
      lon: -119.9820278138848,
      alt: 6464.415219403803,
      heading: 225.01270966360877,
      pitch: -60.01796820075175,
      roll: 0,
    },
  ],
];
for (const [fix, offset, expected] of cameraCases)
  test(`[share-codec-025] The camera uses the sphere at latitude ${fix.lat} longitude ${fix.lon}`, () => {
    const out = f.followCameraFor(fix, offset);
    for (const [key, value] of Object.entries(expected))
      assert.ok(Math.abs(out[key] - value) < 1e-7, `${key}: ${out[key]}`);
  });

test('[share-codec-050] The mirror layer rejects a valid owner option', () => {
  const out = read(
    message((b) => {
      b.bytesField(10, [0, 0, 64]);
      b.bytesField(
        11,
        new w.WireWriter().varint(22).varint(28).varint(0).finish(),
      );
    }),
  );
  assert.deepEqual(out.state.layerState.enabledLayerIds, ['military']);
  assert.equal(out.state.layerState.options.flights.models3d, true);
  assert.deepEqual(out.unknownFields, [
    { scope: 'layer-option', code: '22.14' },
  ]);
});
for (const [index, code] of [
  [35, 'thermal.z'],
  [36, 'thermal.?'],
])
  test(`[share-codec-049] The unknown style token ${index} reports its value`, () => {
    const out = read(
      message((b) => {
        b.uintField(14, 3);
        b.bytesField(27, new w.WireWriter().varint(index).varint(17).finish());
      }),
    );
    assert.deepEqual(out.unknownFields, [{ scope: 'style-param', code }]);
    assert.deepEqual(out.state.styleParams, {
      sensitivity: 0.85,
      bloom: 0.2,
      mode: 0.33,
      pixelation: 1,
      palette: 0,
    });
  });
test('[share-codec-049] The future panel reports its number', () => {
  const out = read(
    message((b) => b.bytesField(12, new w.WireWriter().varint(180).finish())),
  );
  assert.deepEqual(out.unknownFields, [{ scope: 'panel', code: 11 }]);
  assert.deepEqual(
    out.state.panelState.specs,
    panelCases.map((p) => ({
      id: p.id,
      collapsed: p.collapsed,
      pinned: p.pinnable ? false : null,
    })),
  );
});

const layerCases = [
  {
    id: 'air-quality',
    token: '8',
    number: 8,
    bytes: [0, 1],
  },
  {
    id: 'ais-live-vessels',
    token: 'a',
    number: 10,
    bytes: [0, 4],
  },
  {
    id: 'alpr-cameras',
    token: 'p',
    number: 25,
    bytes: [0, 0, 0, 2],
  },
  {
    id: 'beemaps',
    token: '5',
    number: 5,
    bytes: [32],
  },
  {
    id: 'beemaps-bursts',
    token: '6',
    number: 6,
    bytes: [64],
  },
  {
    id: 'bhote-koshi-2026',
    token: 'h',
    number: 17,
    bytes: [0, 0, 2],
  },
  {
    id: 'bhote-koshi-locator',
    token: 'z',
    number: 35,
    bytes: [0, 0, 0, 0, 8],
  },
  {
    id: 'bikeshare',
    token: 'b',
    number: 11,
    bytes: [0, 8],
  },
  {
    id: 'cctv',
    token: 'c',
    number: 12,
    bytes: [0, 16],
  },
  {
    id: 'directions',
    token: 'n',
    number: 23,
    bytes: [0, 0, 128],
  },
  {
    id: 'earthquakes',
    token: 'e',
    number: 14,
    bytes: [0, 64],
  },
  {
    id: 'fire-perimeters',
    token: '2',
    number: 2,
    bytes: [4],
  },
  {
    id: 'flights',
    token: 'f',
    number: 15,
    bytes: [0, 128],
  },
  {
    id: 'gdacs',
    token: '9',
    number: 9,
    bytes: [0, 2],
  },
  {
    id: 'gnss-integrity',
    token: '7',
    number: 7,
    bytes: [128],
  },
  {
    id: 'local-dams',
    token: 'q',
    number: 26,
    bytes: [0, 0, 0, 4],
  },
  {
    id: 'local-datacenters',
    token: 'd',
    number: 13,
    bytes: [0, 32],
  },
  {
    id: 'local-firms',
    token: 'w',
    number: 32,
    bytes: [0, 0, 0, 0, 1],
  },
  {
    id: 'military',
    token: 'm',
    number: 22,
    bytes: [0, 0, 64],
  },
  {
    id: 'military-awareness',
    token: 'g',
    number: 16,
    bytes: [0, 0, 1],
  },
  {
    id: 'military-installations',
    token: 'i',
    number: 18,
    bytes: [0, 0, 4],
  },
  {
    id: 'osh-systems',
    token: '3',
    number: 3,
    bytes: [8],
  },
  {
    id: 'planet-scenes',
    token: '01',
    number: 37,
    bytes: [0, 0, 0, 0, 32],
  },
  {
    id: 'radio',
    token: 'r',
    number: 27,
    bytes: [0, 0, 0, 8],
  },
  {
    id: 'recent-imagery',
    token: '1',
    number: 1,
    bytes: [2],
  },
  {
    id: 'reticulum',
    token: '4',
    number: 4,
    bytes: [16],
  },
  {
    id: 'rocket-launches',
    token: 'x',
    number: 33,
    bytes: [0, 0, 0, 0, 2],
  },
  {
    id: 's2-ghostmaps',
    token: '03',
    number: 39,
    bytes: [0, 0, 0, 0, 128],
  },
  {
    id: 'satellites',
    token: 's',
    number: 28,
    bytes: [0, 0, 0, 16],
  },
  {
    id: 'skyfi-scenes',
    token: '02',
    number: 38,
    bytes: [0, 0, 0, 0, 64],
  },
  {
    id: 'skywatch-scenes',
    token: '00',
    number: 36,
    bytes: [0, 0, 0, 0, 16],
  },
  {
    id: 'street-level',
    token: '0',
    number: 0,
    bytes: [1],
  },
  {
    id: 'telegeography-submarine-cables',
    token: 'u',
    number: 30,
    bytes: [0, 0, 0, 64],
  },
  {
    id: 'traffic',
    token: 't',
    number: 29,
    bytes: [0, 0, 0, 32],
  },
  {
    id: 'transit',
    token: 'j',
    number: 19,
    bytes: [0, 0, 8],
  },
  {
    id: 'weather-cyclones',
    token: 'y',
    number: 34,
    bytes: [0, 0, 0, 0, 4],
  },
  {
    id: 'weather-lightning',
    token: 'l',
    number: 21,
    bytes: [0, 0, 32],
  },
  {
    id: 'weather-radar',
    token: 'v',
    number: 31,
    bytes: [0, 0, 0, 128],
  },
  {
    id: 'weather-satellite',
    token: 'o',
    number: 24,
    bytes: [0, 0, 0, 1],
  },
  {
    id: 'wind',
    token: 'k',
    number: 20,
    bytes: [0, 0, 16],
  },
];
for (const { id, token, number, bytes } of layerCases)
  test(`[share-codec-016 share-codec-017] The layer ${id} keeps its own bit`, () => {
    assert.equal(c.layerTokenNumber(token), number);
    assert.equal(c.layerTokenFromNumber(number), token);
    const code = c.encodeShareView({ layerState: { enabledLayerIds: [id] } });
    assert.deepEqual(fields(code).get(10), bytes);
    const out = read(code);
    assert.deepEqual(out.state.layerState.enabledLayerIds, [id]);
    assert.equal(Object.hasOwn(out, 'unknownFields'), false);
    const raw = read(message((b) => b.bytesField(10, bytes)));
    assert.deepEqual(raw.state.layerState.enabledLayerIds, [id]);
    assert.equal(Object.hasOwn(raw, 'unknownFields'), false);
  });

test('[share-codec-057] The decoder uses Normal for an unknown style', () => {
  let reads = 0;
  const input = {
    get style() {
      return reads++ === 0 ? 'normal' : 'future';
    },
  };
  const out = read(message((b) => b.textField(14, 'future')));
  assert.equal(read(c.encodeShareView(input)).ok, true);
  assert.equal(out.state.style, 'normal');
  assert.deepEqual(out.unknownFields, [
    { scope: 'enum:style', code: 'future' },
  ]);
  assert.equal(out.state.bloom, false);
  assert.equal(out.state.sharpen, true);
});

test('[share-codec-058] The style initializer uses distinct source values', async () => {
  const { Worker } = await import('node:worker_threads');
  const source = `
 import {parentPort,workerData}from'node:worker_threads';
 const {GLOBAL_POST_DEFAULTS:g,STYLE_PRESET_DEFAULTS:p,STYLES:shaders}=await import(workerData.presets);
 Object.assign(g,{bloom:{enabled:true,intensity:31},sharpen:{enabled:false,intensity:62},hudVariant:'minimal',hudVisible:false,detectionMode:'OFF',detectionDensity:0,detectionAllocation:'WEIGHTED',detectionFadePct:13,detectionOutsideOpacityPct:23,celestialRing:true});
 p.retro={bloom:{enabled:false,intensity:17},sharpen:{enabled:true,intensity:83},hudVariant:'operator',hudVisible:true,detection:{mode:'DENSE',densityPct:100},styleParams:{retro:{pixelation:3.14,distortion:0.23,instability:0.67}}};
 p.noir={styleParams:{noir:{contrastAmt:0.43}}};
 shaders.noir={uniforms:{grainAmt:{default:0.37}}};
 p.anime={};shaders.anime={};p.snow={detection:{mode:'SPARSE'}};delete shaders.snow;
 p.surveillance={detection:{densityPct:25}};p.thermal={detection:{mode:17},styleParams:{}};
 const fresh=await import(workerData.codec);
 const code=fresh.encodeShareView({style:'anime',styleParams:{saturation:1.27}});
 const rd=fresh.decodeShareView(fresh.encodeShareView({style:'retro'})).state;
 parentPort.postMessage({animeDefault:fresh.SHARE_VIEW_STYLE_DEFAULTS.anime.styleParams,extraDetection:[fresh.SHARE_VIEW_STYLE_DEFAULTS.surveillance.detectionMode,fresh.SHARE_VIEW_STYLE_DEFAULTS.surveillance.detectionDensity,fresh.SHARE_VIEW_STYLE_DEFAULTS.thermal.detectionMode,fresh.SHARE_VIEW_STYLE_DEFAULTS.thermal.detectionDensity],snowDetection:{mode:fresh.SHARE_VIEW_STYLE_DEFAULTS.snow.detectionMode,density:fresh.SHARE_VIEW_STYLE_DEFAULTS.snow.detectionDensity},retroFlags:{bloom:rd.bloom,sharpen:rd.sharpen,hudVisible:rd.hudVisible,celestialRing:rd.celestialRing},normal:fresh.SHARE_VIEW_STYLE_DEFAULTS.normal,retro:fresh.SHARE_VIEW_STYLE_DEFAULTS.retro,noir:fresh.SHARE_VIEW_STYLE_DEFAULTS.noir,anime:fresh.decodeShareView(code).state.styleParams});
 `;
  const worker = new Worker(
    new URL('data:text/javascript,' + encodeURIComponent(source)),
    {
      workerData: {
        presets: new URL('../ui/visualPresets.js', import.meta.url).href,
        codec: new URL('./viewCodec.js', import.meta.url).href,
      },
    },
  );
  const messages = [];
  worker.on('message', (value) => messages.push(value));
  const status = await new Promise((resolve, reject) => {
    worker.once('error', reject);
    worker.once('exit', resolve);
  });
  assert.equal(status, 0);
  assert.equal(messages.length, 1);
  const actual = messages[0];
  const global = {
    bloom: true,
    bloomIntensity: 31,
    sharpen: false,
    sharpenIntensity: 62,
    hudVariant: 'minimal',
    hudVisible: false,
    detectionMode: 'OFF',
    detectionDensity: 0,
    detectionAllocation: 'WEIGHTED',
    detectionFadePct: 13,
    detectionOutsideOpacityPct: 23,
  };
  assert.deepEqual(actual, {
    animeDefault: null,
    extraDetection: ['OFF', 25, 'OFF', 0],
    snowDetection: { mode: 'SPARSE', density: 0 },
    retroFlags: {
      bloom: false,
      sharpen: true,
      hudVisible: true,
      celestialRing: false,
    },
    normal: { ...global, celestialRing: true, styleParams: null },
    retro: {
      bloom: false,
      bloomIntensity: 17,
      sharpen: true,
      sharpenIntensity: 83,
      hudVariant: 'operator',
      hudVisible: true,
      detectionMode: 'DENSE',
      detectionDensity: 100,
      detectionAllocation: 'WEIGHTED',
      detectionFadePct: 13,
      detectionOutsideOpacityPct: 23,
      celestialRing: false,
      styleParams: { pixelation: 3.14, distortion: 0.23, instability: 0.67 },
    },
    noir: {
      ...global,
      celestialRing: false,
      styleParams: { contrastAmt: 0.43, grainAmt: 0.37 },
    },
    anime: { saturation: 1.27 },
  });
});

for (const [seconds, label] of [
  [0, 'positive epoch'],
  [9007199254741, 'safe epoch'],
])
  test(`[share-codec-052] The ${label} guard does not read the clock`, () => {
    const calls = [];
    const clock = {
      [Symbol.toPrimitive](hint) {
        calls.push(hint);
        throw new Error('clock');
      },
    };
    const out = c.decodeShareView(
      message((b) => b.sintField(8, seconds - 1767225600)),
      { nowMs: clock },
    );
    assert.equal(out.ok, true);
    assert.equal(out.state.sharedAtMs, null);
    assert.deepEqual(calls, []);
  });
for (const [key, value] of [
  [1, 512],
  [2, 131072],
])
  test(`[share-codec-001] The encoder does not read byte ${key} beyond the length`, () => {
    assert.equal(w.encodeBase64Url({ 0: 1, [key]: value, length: 1 }), 'AQ');
  });
test('[share-codec-030] The unknown numeric view kind reports one value', () => {
  const out = read(message((b) => b.uintField(1, 7)));
  assert.deepEqual(out.unknownFields, [{ scope: 'enum:view', code: 7 }]);
  assert.equal(out.fallback, 'unknown-view-kind');
  assert.deepEqual(out.state.view, { kind: 'place' });
  assert.deepEqual(
    [
      out.state.lat,
      out.state.lon,
      out.state.alt,
      out.state.heading,
      out.state.pitch,
      out.state.roll,
    ],
    [0, 0, 800, 0, -35, 0],
  );
});
test('[share-codec-049] The style parameter without a style reports Normal', () => {
  const out = read(
    message((b) =>
      b.bytesField(27, new w.WireWriter().varint(35).varint(17).finish()),
    ),
  );
  assert.deepEqual(out.unknownFields, [
    { scope: 'style-param', code: 'normal.z' },
  ]);
  assert.equal(out.state.styleParams, null);
});
test('[share-codec-011] The default result excludes optional report properties', () => {
  const out = c.decodeShareView('AQc');
  assert.equal(out.ok, true);
  assert.deepEqual(out.state.view, { kind: 'place' });
  assert.equal(Object.hasOwn(out, 'fallback'), false);
  assert.equal(Object.hasOwn(out, 'unknownFields'), false);
  assert.equal(c.encodeShareView({}), 'AQc');
});
test('[share-codec-018] The option decoder keeps all values within each owner', () => {
  const code = c.encodeShareView({
    layerState: { enabledLayerIds: [], options: optionValues },
  });
  const out = read(code);
  for (const [owner, values] of Object.entries(optionValues))
    for (const [key, value] of Object.entries(values))
      assert.deepEqual(out.state.layerState.options[owner][key], value);
  assert.equal(Object.hasOwn(out, 'unknownFields'), false);
});

const optionBytes = {
  'traffic.roadMode': [29, 55, 1, 104],
  'weather-lightning.opacity': [21, 49, 1, 108],
  'weather-radar.opacity': [31, 49, 1, 108],
  'weather-satellite.infrared': [24, 36, 74],
  'weather-satellite.opacity': [24, 49, 1, 108],
  'weather-satellite.product': [24, 51, 1, 103],
  'wind.model': [20, 45, 1, 105],
  'wind.overlay': [20, 49, 1, 112],
  'wind.units': [20, 61, 1, 105],
  'wind.paused': [20, 50, 2],
  'flights.models3d': [15, 28, 0],
  'flights.models3dMode': [15, 45, 1, 97],
  'satellites.catalog': [28, 25, 1, 100],
  'cctv.coverageMode': [12, 25, 1, 118],
  'cctv.showProjection': [12, 50, 0],
  'cctv.autoHop': [12, 20, 2],
  'recent-imagery.west': [1, 64, 141, 218, 150, 1],
  'recent-imagery.south': [1, 56, 155, 171, 158, 2],
  'recent-imagery.east': [1, 28, 170, 252, 165, 3],
  'recent-imagery.north': [1, 46, 164, 205, 173, 4],
  'recent-imagery.a': [1, 21, 9, 83, 50, 48, 50, 54, 48, 57, 49, 56],
  'recent-imagery.b': [1, 23, 9, 86, 50, 48, 50, 53, 48, 49, 48, 50],
  'recent-imagery.mode': [1, 44, 4],
  'recent-imagery.split': [1, 50, 74],
  'recent-imagery.viirs': [1, 62, 2],
  'street-level.mapillary': [0, 44, 0],
  'street-level.providerSwitches': [
    0, 55, 11, 97, 98, 99, 45, 49, 42, 100, 101, 102, 45, 48,
  ],
  'street-level.pano': [0, 51, 1, 102],
  'street-level.sinceDays': [0, 56, 218, 5],
  'radio.filter': [27, 31, 6, 103, 45, 106, 97, 122, 122],
  'radio.volume': [27, 62, 70],
};
for (const [owner, values] of Object.entries(optionValues))
  for (const [key, value] of Object.entries(values))
    test(`[share-codec-018] The option ${owner} ${key} uses one wire entry`, () => {
      const code = c.encodeShareView({
        layerState: {
          enabledLayerIds: [],
          options: { [owner]: { [key]: value } },
        },
      });
      assert.deepEqual(fields(code).get(11), optionBytes[owner + '.' + key]);
      const raw = read(
        message((b) => {
          b.bytesField(10, []);
          b.bytesField(11, optionBytes[owner + '.' + key]);
        }),
      );
      assert.deepEqual(raw.state.layerState.options[owner][key], value);
      assert.equal(Object.hasOwn(raw, 'unknownFields'), false);
    });

test('[share-codec-041] The supplied layer set keeps other layers and options', () => {
  const out = toLegacyShareState({
    view: entity(),
    layerState: {
      enabledLayerIds: ['flights', 'radio'],
      options: { radio: { filter: 'genre:jazz', volume: 0.35 } },
    },
  });
  assert.deepEqual(out.layerState.enabledLayerIds, ['flights', 'radio']);
  assert.deepEqual(out.layerState.options.radio, {
    filter: 'genre:jazz',
    volume: 0.35,
  });
  assert.equal(
    out.layerState.options.flights.selectedFlightsTrackingId,
    'ab1234',
  );
});
test('[share-codec-048] The state source rejects a function with numeric fields', () => {
  const source = Object.assign(() => {}, { lat: 12, lon: 23 });
  const out = c.normalizeShareViewState(source);
  assert.equal(out.lat, 0);
  assert.equal(out.lon, 0);
});
for (const mode of [
  undefined,
  '',
  17,
  true,
  {
    toString() {
      return 'OFF';
    },
  },
])
  test(`[share-codec-048] The invalid detection mode uses the default for ${String(mode)}`, () => {
    const out = c.normalizeShareViewState({
      detectionMode: mode,
      detectionDensity: 50,
    });
    assert.equal(out.detectionMode, 'DENSE');
    assert.equal(out.detectionDensity, 75);
  });
test('[share-codec-048] The disabled detection mode keeps a valid density and defaults an invalid density', () => {
  assert.deepEqual(
    [
      c.normalizeShareViewState({ detectionMode: 'OFF', detectionDensity: 25 })
        .detectionMode,
      c.normalizeShareViewState({ detectionMode: 'OFF', detectionDensity: 25 })
        .detectionDensity,
    ],
    ['OFF', 25],
  );
  for (const value of [null, '', {}, false]) {
    const out = c.normalizeShareViewState({
      detectionMode: 'OFF',
      detectionDensity: value,
    });
    assert.equal(out.detectionMode, 'OFF');
    assert.equal(out.detectionDensity, 75);
  }
});
for (const [fix, offset, expected] of cameraCases)
  test(`[share-codec-025] The state derives each camera field at latitude ${fix.lat} longitude ${fix.lon}`, () => {
    const out = c.normalizeShareViewState({
      lat: -77,
      lon: 88,
      alt: -999,
      heading: 12,
      pitch: 37,
      roll: 44,
      view: entity('aircraft', 'ab1234', { lastKnown: fix, offset }),
    });
    assert.equal(out.lat, Math.round(expected.lat * 1e4) / 1e4 + 0);
    assert.equal(out.lon, Math.round(expected.lon * 1e4) / 1e4 + 0);
    assert.equal(out.alt, Math.round(expected.alt));
    assert.equal(out.heading, Math.round(expected.heading) % 360);
    assert.equal(out.pitch, Math.round(expected.pitch) + 0);
    assert.equal(out.roll, 0);
  });
for (const [kind, id, layer] of [
  ['aircraft', 'ab1234', 'flights'],
  ['military_aircraft', 'bc2345', 'military'],
  ['vessel', '366999712', 'ais-live-vessels'],
  ['satellite', '25544', 'satellites'],
])
  test(`[share-codec-017] The implied layer for ${kind} uses no entity bit`, () => {
    const layerState = { enabledLayerIds: [] };
    const code = c.encodeShareView({ layerState, view: entity(kind, id) });
    const packed = fields(code);
    assert.deepEqual(packed.get(10), []);
    assert.equal(packed.has(1), false);
    assert.deepEqual(
      c.normalizeShareViewState({ layerState, view: entity(kind, id) })
        .layerState.enabledLayerIds,
      [layer],
    );
    assert.deepEqual(read(code).state.layerState.enabledLayerIds, [layer]);
  });
for (const [key, number, value, raw] of [
  ['heading', 5, 10, 20],
  ['heading', 5, 180, 360],
  ['heading', 5, 181, 357],
  ['roll', 7, 50, 100],
  ['roll', 7, 359, 1],
])
  test(`[share-codec-061] The angle ${key} at ${value} uses the nearest signed turn`, () => {
    const code = c.encodeShareView({ [key]: value });
    assert.equal(fields(code).get(number), raw);
    assert.equal(read(code).state[key], value);
  });
for (const [key, number, expected] of [
  ['style', 14, 'normal'],
  ['mapStack', 15, 'photoreal'],
  ['hudVariant', 16, 'tactical'],
  ['detectionMode', 20, 'DENSE'],
  ['detectionAllocation', 22, 'ELASTIC'],
])
  test(`[share-codec-033] The unknown enum ${key} uses its default`, () => {
    const out = read(message((b) => b.uintField(number, 99)));
    assert.equal(out.state[key], expected);
    assert.deepEqual(out.unknownFields, [{ scope: `enum:${key}`, code: 99 }]);
  });
test('[share-codec-029] The layer bits keep known layers beside unknown layers', () => {
  const bytes = Array(21).fill(0);
  bytes[1] = 128;
  bytes[20] = 1;
  const out = read(message((b) => b.bytesField(10, bytes)));
  assert.deepEqual(out.state.layerState.enabledLayerIds, ['flights']);
  assert.deepEqual(out.unknownFields, [{ scope: 'layer', code: 160 }]);
});
test('[share-codec-034] The duplicate panel entry fails before its second value applies', () => {
  assert.deepEqual(
    c.decodeShareView(
      message((b) =>
        b.bytesField(12, new w.WireWriter().varint(4).varint(8).finish()),
      ),
    ),
    { ok: false, reason: 'duplicate-entry' },
  );
});
test('[share-codec-023] The fix ignores an age without a share time', () => {
  const thing = new w.WireWriter()
    .uintField(1, 11211316)
    .sintField(8, 120000)
    .sintField(9, 230000)
    .sintField(11, -17)
    .finish();
  const out = read(message((b) => b.bytesField(13, thing)));
  assert.equal(out.state.sharedAtMs, null);
  assert.deepEqual(out.state.view.lastKnown, {
    lat: 12,
    lon: 23,
    alt: 0,
    observedAtMs: null,
  });
});
test('[share-codec-031] The unknown entity uses a fix with default altitude', () => {
  const thing = new w.WireWriter()
    .textField(30, 'new-7')
    .sintField(8, 0)
    .sintField(9, 0)
    .finish();
  const out = read(message((b) => b.bytesField(13, thing)));
  assert.equal(out.fallback, 'unknown-entity-kind');
  assert.deepEqual(out.unknownFields, [
    { scope: 'thing', field: 30, wireType: 2 },
  ]);
  assert.deepEqual(out.state.view, { kind: 'place' });
  assert.deepEqual(
    [
      out.state.lat,
      out.state.lon,
      out.state.alt,
      out.state.heading,
      out.state.pitch,
      out.state.roll,
    ],
    [-0.0147, 0, 1147, 0, -35, 0],
  );
});
test('[share-codec-021] The entity getter can remove its value before id access', () => {
  let reads = 0;
  const view = {
    kind: 'thing',
    get entity() {
      return reads++ === 0 ? { kind: 'aircraft', id: 'ab1234' } : undefined;
    },
  };
  assert.deepEqual(c.normalizeShareViewState({ view }).view, { kind: 'place' });
  assert.equal(reads, 2);
});
test('[share-codec-023] The absent fix time takes the share time', () => {
  const out = c.normalizeShareViewState({
    sharedAtMs: 1767225617000,
    view: entity('aircraft', 'ab1234', {
      lastKnown: { lat: 12, lon: 23, alt: 45 },
    }),
  });
  assert.equal(out.view.lastKnown.observedAtMs, 1767225617000);
});

test('[share-codec-010] The enum and panel tables match their permanent values', () => {
  assert.equal(c.BY_STYLE, 'by-style');
  assert.deepEqual(c.SHARE_VIEW_PANELS, panelCases);
  assert.deepEqual(c.SHARE_VIEW_ENUMS, {
    viewKind: ['place', 'thing'],
    style: [
      'normal',
      'retro',
      'surveillance',
      'thermal',
      'anime',
      'noir',
      'snow',
    ],
    mapStack: [
      'photoreal',
      'bing-aerial',
      'bing-labels',
      'esri-imagery',
      'osm',
    ],
    hudVariant: ['tactical', 'operator', 'minimal', 'cyber'],
    detectionMode: ['OFF', 'SPARSE', 'BALANCED', 'DENSE'],
    detectionAllocation: ['ELASTIC', 'WEIGHTED'],
  });
});

for (const [kind, id, field, raw] of [
  ['satellite', '123456', 4, 123456],
  ['vessel', '234567', 3, 234567],
])
  test(`[share-codec-021] The decimal entity ${kind} keeps six decimal digits`, () => {
    const code = c.encodeShareView({ view: entity(kind, id) });
    const r = new w.WireReader(Uint8Array.from(fields(code).get(13)));
    assert.deepEqual(r.tag(), { field, wireType: 0 });
    assert.equal(r.varint(), raw);
    assert.equal(r.done, true);
    assert.deepEqual(read(code).state.view.entity, { kind, id });
  });
for (const [kind, id, field, bytes] of [
  ['aircraft', '12345', 1, [49, 50, 51, 52, 53]],
  ['military_aircraft', '1234567', 2, [49, 50, 51, 52, 53, 54, 55]],
])
  test(`[share-codec-021] The aircraft entity ${kind} keeps decimal text outside six digits`, () => {
    const code = c.encodeShareView({ view: entity(kind, id) });
    const r = new w.WireReader(Uint8Array.from(fields(code).get(13)));
    assert.deepEqual(r.tag(), { field, wireType: 2 });
    assert.deepEqual([...r.lengthDelimited().rest()], bytes);
    assert.equal(r.done, true);
    assert.deepEqual(read(code).state.view.entity, { kind, id });
  });
for (const [type, body, length] of [
  [0, [172, 2], 2],
  [2, [5, 11, 22, 33, 44, 55], 6],
  [1, [7, 8, 9, 10, 11, 12, 13, 14], 8],
  [5, [15, 16, 17, 18], 4],
])
  test(`[share-codec-008] The wire cursor skips type ${type} to its next field`, () => {
    const bytes = Uint8Array.from([24 + type, ...body, 56, 19]);
    const r = new w.WireReader(bytes);
    assert.deepEqual(r.tag(), { field: 3, wireType: type });
    assert.equal(r.pos, 1);
    r.skip(type);
    assert.equal(r.pos, 1 + length);
    assert.deepEqual(r.tag(), { field: 7, wireType: 0 });
    assert.equal(r.varint(), 19);
    assert.equal(r.done, true);
    const short = new w.WireReader(
      Uint8Array.from(type === 0 || type === 2 ? [] : body.slice(0, -1)),
    );
    assert.throws(() => short.skip(type), { reason: 'truncated' });
  });

test('[share-codec-043] The legacy converter does not read metadata getters', () => {
  const calls = [];
  const parsed = { lat: 12, lon: 23 };
  for (const key of ['layerStateInvalid', 'restoreAuthority'])
    Object.defineProperty(parsed, key, {
      enumerable: true,
      get() {
        calls.push(key);
        throw new Error(key);
      },
    });
  const out = fromLegacyShareState(parsed);
  assert.equal(out.lat, 12);
  assert.equal(out.lon, 23);
  assert.deepEqual(calls, []);
  assert.equal(Object.hasOwn(out, 'layerStateInvalid'), false);
  assert.equal(Object.hasOwn(out, 'restoreAuthority'), false);
});
test('[share-codec-021] The invalid identifier type does not reach the grammar', async () => {
  const { TRACKING_ID_GRAMMAR } = await import('../data/layerState.js');
  const descriptor = Object.getOwnPropertyDescriptor(
    TRACKING_ID_GRAMMAR,
    'test',
  );
  const original = TRACKING_ID_GRAMMAR.test;
  const calls = [];
  TRACKING_ID_GRAMMAR.test = function (value) {
    calls.push(value);
    return original.call(this, value);
  };
  try {
    for (const id of [{}, NaN, Infinity])
      assert.deepEqual(
        c.normalizeShareViewState({
          view: { kind: 'thing', entity: { kind: 'aircraft', id } },
        }).view,
        { kind: 'place' },
      );
    assert.deepEqual(calls, []);
  } finally {
    if (descriptor)
      Object.defineProperty(TRACKING_ID_GRAMMAR, 'test', descriptor);
    else delete TRACKING_ID_GRAMMAR.test;
  }
});
test('[share-codec-019] The unknown panel does not supply a collapse value', () => {
  const calls = [];
  const spec = {
    id: 'unknown',
    get collapsed() {
      calls.push('collapsed');
      throw new Error('collapsed');
    },
    get pinned() {
      calls.push('pinned');
      throw new Error('pinned');
    },
  };
  assert.equal(
    c.normalizeShareViewState({ panelState: { specs: [spec] } }).panelState,
    null,
  );
  assert.deepEqual(calls, []);
});

for (const [key, number, fallback] of [
  ['hudVariant', 16, 'tactical'],
  ['mapStack', 15, 'photoreal'],
]) {
  test(`[share-codec-032] The open name ${key} accepts its full width`, () => {
    const name = 'A'.repeat(32);
    const out = read(c.encodeShareView({ [key]: name }));
    assert.equal(out.state[key], name);
    assert.equal(Object.hasOwn(out, 'unknownFields'), false);
  });
  test(`[share-codec-056] The open name ${key} rejects excess width`, () => {
    const name = 'A'.repeat(33);
    const out = read(message((b) => b.textField(number, name)));
    assert.equal(out.state[key], fallback);
    assert.deepEqual(out.unknownFields, [{ scope: `enum:${key}`, code: name }]);
  });
}
test('[share-codec-034] The text limit accepts its exact bound before version validation', () => {
  assert.deepEqual(c.decodeShareView('A'.repeat(2048)), {
    ok: false,
    reason: 'unsupported-version',
  });
  assert.deepEqual(c.decodeShareView('A'.repeat(2049)), {
    ok: false,
    reason: 'too-long',
  });
});

const defaultFieldCases = [
  ['view', true, { kind: 'place' }],
  ['lat', true, 0],
  ['lon', true, 0],
  ['alt', true, 800],
  ['heading', true, 0],
  ['pitch', true, -35],
  ['roll', true, 0],
  ['sharedAtMs', true, null],
  ['flags', false, null],
  ['layerState', true, null],
  ['layerOptions', false, null],
  ['panelState', true, null],
  ['thing', false, null],
  ['style', true, 'normal'],
  ['mapStack', true, 'photoreal'],
  ['hudVariant', true, 'tactical'],
  ['bloomIntensity', true, 0],
  ['bloomVersion', true, 2],
  ['sharpenIntensity', true, 49],
  ['detectionMode', true, 'DENSE'],
  ['detectionDensity', true, 75],
  ['detectionAllocation', true, 'ELASTIC'],
  ['detectionFadePct', true, 7],
  ['detectionOutsideOpacityPct', true, 1],
  ['scopeFeatherPct', true, 100],
  ['scopeTerminusPct', true, null],
  ['styleParams', true, null],
  ['bloom', true, false],
  ['sharpen', true, true],
  ['hudVisible', true, true],
  ['celestialRing', true, false],
  ['scopeEnabled', true, true],
];
for (const [key, own, value] of defaultFieldCases)
  test(`[share-codec-010] The default state ${own ? 'sets' : 'excludes'} the field ${key}`, () => {
    const state = c.createDefaultShareViewState();
    assert.equal(Object.hasOwn(state, key), own);
    if (own) assert.deepEqual(state[key], value);
  });
for (const [kind, owner, key, id, bits, packed] of [
  [
    'aircraft',
    'flights',
    'selectedFlightsTrackingId',
    'ab1234',
    [0, 128],
    [15, 59, 6, 97, 98, 49, 50, 51, 52],
  ],
  [
    'military_aircraft',
    'flights',
    'selectedMilitaryTrackingId',
    'bc2345',
    [0, 0, 64],
    [15, 61, 6, 98, 99, 50, 51, 52, 53],
  ],
  [
    'satellite',
    'satellites',
    'selectedSatTrackingId',
    '25544',
    [0, 0, 0, 16],
    [28, 58, 144, 143, 3],
  ],
])
  test(`[share-codec-022] The raw tracking option for ${kind} becomes its entity`, () => {
    const out = read(
      message((b) => {
        b.bytesField(10, bits);
        b.bytesField(11, packed);
      }),
    );
    assert.deepEqual(out.state.view.entity, { kind, id });
    assert.deepEqual(
      [
        out.state.layerState.options.flights.selectedFlightsTrackingId,
        out.state.layerState.options.flights.selectedMilitaryTrackingId,
        out.state.layerState.options.satellites.selectedSatTrackingId,
      ],
      [null, null, null],
    );
    assert.equal(Object.hasOwn(out, 'unknownFields'), false);
    assert.equal(Object.hasOwn(out, 'fallback'), false);
  });

for (const nowMs of [1767225617000, 1767225617001])
  test(`[share-codec-036] The canonical state keeps the share time at clock ${nowMs}`, () => {
    const expected = {
      ...Object.fromEntries(
        defaultFieldCases
          .filter(([, own]) => own)
          .map(([key, , value]) => [key, value]),
      ),
      lat: 12.3456,
      sharedAtMs: 1767225617000,
    };
    const state = c.normalizeShareViewState({
      lat: 12.3456,
      sharedAtMs: 1767225617000,
    });
    assert.deepEqual(state, expected);
    assert.deepEqual(c.normalizeShareViewState(state), expected);
    assert.equal(c.encodeShareView(state), 'ARCAiQ9AIrM');
    const out = c.decodeShareView('ARCAiQ9AIrM', { nowMs });
    assert.deepEqual(out, { ok: true, state: expected });
    assert.equal(c.encodeShareView(out.state), 'ARCAiQ9AIrM');
  });

test('[share-codec-027] The decoder drops the share time one millisecond after the clock', () => {
  const out = c.decodeShareView('ARCAiQ9AIrM', { nowMs: 1767225616999 });
  assert.equal(out.ok, true);
  assert.equal(out.state.sharedAtMs, null);
  assert.equal(out.state.lat, 12.3456);
  assert.equal(Object.hasOwn(out, 'fallback'), false);
  assert.equal(Object.hasOwn(out, 'unknownFields'), false);
});
