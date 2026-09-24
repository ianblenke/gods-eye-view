import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mapOshDatastreams } from './oshDatastreams.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-datastreams.json', import.meta.url), 'utf8'),
);

test('[osh-025] maps a datastream list, and reads the system id from every known key', () => {
  const records = mapOshDatastreams(fixture);
  assert.deepEqual(records, [
    {
      id: 'ds-fixture-1',
      systemId: 'sys-fixture-1',
      name: 'Fixture Datastream One',
      outputName: 'weather',
      validTime: ['2026-01-01T00:00:00Z', 'now'],
    },
    {
      id: 'ds-fixture-2',
      systemId: 'sys-fixture-1',
      name: 'Fixture Datastream Two',
      outputName: 'location',
      validTime: null,
    },
  ]);
});

test('[osh-025] accepts the datastreams key and the items key', () => {
  const records = mapOshDatastreams({
    datastreams: [{ id: 'ds-fixture-3', systemId: 'sys-fixture-9' }],
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].systemId, 'sys-fixture-9');
});

test('[osh-025] returns an empty list for a malformed payload', () => {
  for (const payload of [null, undefined, {}, { items: 'x' }, { datastreams: null }, []]) {
    assert.deepEqual(mapOshDatastreams(payload), []);
  }
});

test('[osh-025] skips an entry without an id, with a non-string id, or with an id outside the pattern', () => {
  const records = mapOshDatastreams({
    items: [
      null,
      'x',
      {},
      { id: 123 },
      { id: '' },
      { id: 'has a space' },
      { id: 'has.dot' },
      { id: 'has/slash' },
      { id: 'a'.repeat(65) },
    ],
  });
  assert.deepEqual(records, []);
});

test('[osh-025] reads the system.id key and falls back to null with no known key', () => {
  const [withNested, withNone] = mapOshDatastreams({
    items: [
      { id: 'ds-fixture-4', system: { id: 'sys-fixture-4' } },
      { id: 'ds-fixture-5' },
    ],
  });
  assert.equal(withNested.systemId, 'sys-fixture-4');
  assert.equal(withNone.systemId, null);
});

test('[osh-025] falls back to null when system@link has no usable href', () => {
  const records = mapOshDatastreams({
    items: [
      { id: 'ds-fixture-6', 'system@link': {} },
      { id: 'ds-fixture-7', 'system@link': { href: '' } },
      { id: 'ds-fixture-8', 'system@link': { href: '/api/systems/sys-fixture-8/' } },
      { id: 'ds-fixture-9', 'system@link': { href: 123 } },
      { id: 'ds-fixture-10', 'system@link': 'not-an-object' },
      { id: 'ds-fixture-10b', 'system@link': { href: '/' } },
    ],
  });
  assert.equal(records[0].systemId, null);
  assert.equal(records[1].systemId, null);
  assert.equal(records[2].systemId, 'sys-fixture-8');
  assert.equal(records[3].systemId, null);
  assert.equal(records[4].systemId, null);
  assert.equal(records[5].systemId, null);
});

test('[osh-025] ignores non-string name, outputName and non-array validTime', () => {
  const [record] = mapOshDatastreams({
    items: [{ id: 'ds-fixture-11', name: 9, outputName: 9, validTime: 'x' }],
  });
  assert.equal(record.name, null);
  assert.equal(record.outputName, null);
  assert.equal(record.validTime, null);
});

test('[osh-025] prefers system@id over systemId and system.id', () => {
  const [record] = mapOshDatastreams({
    items: [
      {
        id: 'ds-fixture-12',
        'system@id': 'sys-fixture-a',
        systemId: 'sys-fixture-b',
        system: { id: 'sys-fixture-c' },
      },
    ],
  });
  assert.equal(record.systemId, 'sys-fixture-a');
});

test('[osh-025] ignores a non-string or empty systemId and a malformed system object', () => {
  const records = mapOshDatastreams({
    items: [
      { id: 'ds-fixture-14', systemId: '' },
      { id: 'ds-fixture-15', systemId: 9 },
      { id: 'ds-fixture-16', system: 'not-an-object' },
      { id: 'ds-fixture-17', system: { id: 9 } },
      { id: 'ds-fixture-18', system: { id: '' } },
    ],
  });
  for (const record of records) assert.equal(record.systemId, null);
});

test('[osh-025] ignores a non-string or empty system@id and falls back', () => {
  const [record] = mapOshDatastreams({
    items: [{ id: 'ds-fixture-19', 'system@id': '', systemId: 'sys-fixture-z' }],
  });
  assert.equal(record.systemId, 'sys-fixture-z');
});

test('[osh-025] prefers systemId over system.id when system@id is absent', () => {
  const [record] = mapOshDatastreams({
    items: [
      { id: 'ds-fixture-13', systemId: 'sys-fixture-b', system: { id: 'sys-fixture-c' } },
    ],
  });
  assert.equal(record.systemId, 'sys-fixture-b');
});

const RASTER = 'http://sensorml.com/ont/swe/property/RasterImage';
const OTHER_PROPERTY = 'http://sensorml.com/ont/swe/property/Temperature';

/** One synthetic datastream entry. Each key of `extra` replaces the key of the same name. */
function entryOf(id, extra = {}) {
  return { id, resultType: 'coverage', observedProperties: [{ definition: RASTER }], ...extra };
}

test('[osh-076] a coverage result with the observed property RasterImage gets video true', () => {
  const [record] = mapOshDatastreams({ items: [entryOf('ds-fixture-30')] });
  assert.equal(record.video, true);
  assert.equal(record.id, 'ds-fixture-30');
  assert.deepEqual(Object.keys(record), [
    'id',
    'systemId',
    'name',
    'outputName',
    'validTime',
    'video',
  ]);
});

test('[osh-076] a list with one video record marks it, and leaves each neighbour with no video key', () => {
  const records = mapOshDatastreams({
    items: [
      entryOf('ds-fixture-31'),
      { id: 'ds-fixture-32', resultType: 'measure', observedProperties: [{ definition: OTHER_PROPERTY }] },
      { id: 'ds-fixture-33' },
    ],
  });
  assert.deepEqual(
    records.map((record) => [record.id, record.video]),
    [
      ['ds-fixture-31', true],
      ['ds-fixture-32', undefined],
      ['ds-fixture-33', undefined],
    ],
  );
  assert.equal(Object.hasOwn(records[1], 'video'), false);
  assert.equal(Object.hasOwn(records[2], 'video'), false);
});

test('[osh-076] each record of the fixture list has no video key and keeps its five keys', () => {
  for (const record of mapOshDatastreams(fixture)) {
    assert.equal(Object.hasOwn(record, 'video'), false);
    assert.equal(Object.keys(record).length, 5);
  }
});

test('[osh-076] a RasterImage property with a result type other than coverage gives no video key', () => {
  const records = mapOshDatastreams({
    items: [
      entryOf('ds-fixture-34', { resultType: 'measure' }),
      entryOf('ds-fixture-35', { resultType: 'Coverage' }),
      entryOf('ds-fixture-36', { resultType: undefined }),
      entryOf('ds-fixture-37', { resultType: 7 }),
    ],
  });
  assert.equal(records.length, 4);
  for (const record of records) assert.equal(Object.hasOwn(record, 'video'), false, record.id);
});

test('[osh-076] a coverage result with no RasterImage property gives no video key', () => {
  const records = mapOshDatastreams({
    items: [
      entryOf('ds-fixture-38', { observedProperties: [{ definition: OTHER_PROPERTY }] }),
      entryOf('ds-fixture-39', { observedProperties: [] }),
      entryOf('ds-fixture-40', { observedProperties: undefined }),
      entryOf('ds-fixture-41', { observedProperties: null }),
      entryOf('ds-fixture-42', { observedProperties: 'RasterImage' }),
      entryOf('ds-fixture-43', { observedProperties: { definition: RASTER } }),
    ],
  });
  assert.equal(records.length, 6);
  for (const record of records) assert.equal(Object.hasOwn(record, 'video'), false, record.id);
});

test('[osh-076] the name is the whole last path segment of the definition, so a longer name or another segment gives no video key', () => {
  const definitions = [
    'http://sensorml.com/ont/swe/property/MyRasterImage',
    'http://sensorml.com/ont/swe/property/RasterImages',
    'http://sensorml.com/ont/swe/property/RasterImage/Extra',
    'http://sensorml.com/ont/RasterImage/property',
    'http://sensorml.com/ont/swe/property/rasterimage',
    'RasterImage.value',
    'RasterImageRasterImage',
  ];
  const records = mapOshDatastreams({
    items: definitions.map((definition, index) =>
      entryOf(`ds-fixture-${50 + index}`, { observedProperties: [{ definition }] }),
    ),
  });
  assert.equal(records.length, definitions.length);
  for (const [index, record] of records.entries()) {
    assert.equal(Object.hasOwn(record, 'video'), false, definitions[index]);
  }
});

test('[osh-076] the adapter reads the name after a slash, a hash sign or a colon, and ignores a slash at the end', () => {
  const definitions = [
    RASTER,
    'https://vocabulary.example/def/RasterImage',
    'http://vocabulary.example/def/property#RasterImage',
    'urn:fixture:def:RasterImage',
    'RasterImage',
    `${RASTER}/`,
    `${RASTER}//`,
  ];
  const records = mapOshDatastreams({
    items: definitions.map((definition, index) =>
      entryOf(`ds-fixture-${60 + index}`, { observedProperties: [{ definition }] }),
    ),
  });
  assert.equal(records.length, definitions.length);
  for (const [index, record] of records.entries()) assert.equal(record.video, true, definitions[index]);
});

test('[osh-076] one RasterImage property among the observed properties is enough, in any place', () => {
  const other = { definition: OTHER_PROPERTY };
  const records = mapOshDatastreams({
    items: [
      entryOf('ds-fixture-70', { observedProperties: [other, { definition: RASTER }] }),
      entryOf('ds-fixture-71', { observedProperties: [{ definition: RASTER }, other] }),
      entryOf('ds-fixture-72', { observedProperties: [null, 'x', {}, { definition: 9 }, { definition: RASTER }] }),
    ],
  });
  for (const record of records) assert.equal(record.video, true, record.id);
});

test('[osh-076] an observed property with no definition string, and a null property, give no video key and no error', () => {
  const records = mapOshDatastreams({
    items: [
      entryOf('ds-fixture-73', { observedProperties: [null] }),
      entryOf('ds-fixture-74', { observedProperties: [undefined, 'RasterImage', 7] }),
      entryOf('ds-fixture-75', { observedProperties: [{}] }),
      entryOf('ds-fixture-76', { observedProperties: [{ definition: 7 }, { definition: null }] }),
      entryOf('ds-fixture-77', { observedProperties: [{ definition: '' }] }),
      entryOf('ds-fixture-78', { observedProperties: [{ label: 'RasterImage', name: 'RasterImage' }] }),
    ],
  });
  assert.equal(records.length, 6);
  for (const record of records) assert.equal(Object.hasOwn(record, 'video'), false, record.id);
});

test('[osh-076] the mark comes from the type of the data, and never from the name of the datastream or its output', () => {
  const records = mapOshDatastreams({
    items: [
      entryOf('ds-fixture-79', { name: 'Video', outputName: 'video', resultType: 'measure' }),
      entryOf('ds-fixture-80', {
        name: 'Video',
        outputName: 'RasterImage',
        observedProperties: [{ definition: OTHER_PROPERTY }],
      }),
      { id: 'ds-fixture-81', name: 'Video', outputName: 'video' },
      entryOf('ds-fixture-82', { name: 'Fixture Sensor', outputName: 'reading' }),
    ],
  });
  assert.deepEqual(
    records.map((record) => Object.hasOwn(record, 'video')),
    [false, false, false, true],
  );
});
