import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  OSH_FRESH_MAX_AGE_MS,
  extractOshLocation,
  flattenOshResult,
  isOshObservationFresh,
  mapOshLocationPage,
  mapOshObservation,
  oshObservationAgeMs,
  readOshSchemaLocation,
} from './oshObservations.js';

function fixture(name) {
  return JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));
}

const observationFixture = fixture('osh-observation.json');
const vectorSchema = fixture('osh-schema-vector.json');
const flatSchema = fixture('osh-schema-flat.json');
const noframeSchema = fixture('osh-schema-noframe.json');
const latestPage = fixture('osh-latest-page.json');

/** The reader readOshSchemaLocation() gives for osh-schema-vector.json. */
const VECTOR_READER = {
  lat: ['location', 'lat'],
  lon: ['location', 'lon'],
  alt: ['location', 'h'],
  featureUid: ['featureUid'],
};

test('[osh-026] flattens a primitive result to one row', () => {
  assert.deepEqual(flattenOshResult(5), [{ path: '', value: 5 }]);
  assert.deepEqual(flattenOshResult('x'), [{ path: '', value: 'x' }]);
  assert.deepEqual(flattenOshResult(true), [{ path: '', value: true }]);
});

test('[osh-026] returns an empty list for a null or undefined result', () => {
  assert.deepEqual(flattenOshResult(null), []);
  assert.deepEqual(flattenOshResult(undefined), []);
});

test('[osh-026] flattens a nested object to dotted paths and an array to index paths', () => {
  const rows = flattenOshResult({
    temperature: 21.4,
    status: { code: 'ok', battery: 92 },
    readings: [1, 2],
  });
  assert.deepEqual(rows, [
    { path: 'temperature', value: 21.4 },
    { path: 'status.code', value: 'ok' },
    { path: 'status.battery', value: 92 },
    { path: 'readings.0', value: 1 },
    { path: 'readings.1', value: 2 },
  ]);
});

test('[osh-026] keeps an empty object or array as its own row', () => {
  const rows = flattenOshResult({ empty: {}, none: [] });
  assert.deepEqual(rows, [
    { path: 'empty', value: {} },
    { path: 'none', value: [] },
  ]);
});

test('[osh-026] turns a non-primitive leaf past the depth cap into "[object]"', () => {
  const rows = flattenOshResult({ a: { b: { c: { d: { e: 1 } } } } });
  assert.deepEqual(rows, [{ path: 'a.b.c.d', value: '[object]' }]);
});

test('[osh-026] a primitive at the depth cap still reports its own value', () => {
  const rows = flattenOshResult({ a: { b: { c: { d: 1 } } } });
  assert.deepEqual(rows, [{ path: 'a.b.c.d', value: 1 }]);
});

test('[osh-026] keeps exactly 64 rows unmarked and truncates row 65 onward with a marker', () => {
  const exact = Object.fromEntries(
    Array.from({ length: 64 }, (_, index) => [`k${index}`, index]),
  );
  const exactRows = flattenOshResult(exact);
  assert.equal(exactRows.length, 64);
  assert.equal(exactRows.at(-1).path, 'k63');

  const over = Object.fromEntries(
    Array.from({ length: 65 }, (_, index) => [`k${index}`, index]),
  );
  const overRows = flattenOshResult(over);
  assert.equal(overRows.length, 64);
  assert.deepEqual(overRows.at(-1), { path: '…', value: '…' });
  assert.equal(overRows.at(-2).path, 'k62');
});

// --- osh-051: readOshSchemaLocation() ------------------------------------

test('[osh-051] reads the Vector shape of the mesh fixture, bound by axisID with an EPSG 4979 frame', () => {
  const reader = readOshSchemaLocation(vectorSchema);
  assert.deepEqual(reader, VECTOR_READER);
});

test('[osh-051] reads the flat shape of the vendor fixture, bound by definition, and never binds altitudeMsl', () => {
  const reader = readOshSchemaLocation(flatSchema);
  assert.deepEqual(reader, {
    lat: ['lat'],
    lon: ['lon'],
    alt: ['height'],
    featureUid: ['featureUid'],
  });
});

test('[osh-051] reads the no-frame Vector fixture — the measured aircraft shape — with no referenceFrame at all', () => {
  const reader = readOshSchemaLocation(noframeSchema);
  assert.deepEqual(reader, {
    lat: ['Location', 'lat'],
    lon: ['Location', 'lon'],
    alt: ['Location', 'h'],
    featureUid: null,
  });
});

test('[osh-051] takes every field name from the schema, so "Location" and "location" give the same reader shape', () => {
  const inLineSchema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'position',
          referenceFrame: 'http://www.opengis.net/def/crs/EPSG/0/4326',
          coordinates: [
            { type: 'Quantity', name: 'y', axisID: 'Lat', uom: { code: 'deg' } },
            { type: 'Quantity', name: 'x', axisID: 'Lon', uom: { code: 'deg' } },
          ],
        },
      ],
    },
  };
  assert.deepEqual(readOshSchemaLocation(inLineSchema), {
    lat: ['position', 'y'],
    lon: ['position', 'x'],
    alt: null,
    featureUid: null,
  });
});

test('[osh-051] an ECEF Vector with X, Y, Z axis ids never binds, with or without a frame', () => {
  const ecef = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'ecef',
          referenceFrame: 'http://www.opengis.net/def/crs/EPSG/0/4978',
          coordinates: [
            { type: 'Quantity', name: 'x', axisID: 'X', uom: { code: 'm' } },
            { type: 'Quantity', name: 'y', axisID: 'Y', uom: { code: 'm' } },
            { type: 'Quantity', name: 'z', axisID: 'Z', uom: { code: 'm' } },
          ],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(ecef), null);
});

test('[osh-051] a frame outside EPSG 4979/4326 gives null even with valid axis ids', () => {
  const otherFrame = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          referenceFrame: 'http://www.opengis.net/def/crs/EPSG/0/4978',
          coordinates: [
            { type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'deg' } },
            { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'deg' } },
          ],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(otherFrame), null);
});

test('[osh-051] a radian unit on the coordinates never binds', () => {
  const radians = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          coordinates: [
            { type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'rad' } },
            { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'rad' } },
          ],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(radians), null);
});

test('[osh-051] a Vector missing Lon gives null, and does not fall through to a flat reading of the same fields', () => {
  const missingLon = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          coordinates: [{ type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'deg' } }],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(missingLon), null);
});

test('[osh-051] altitudeMsl alone never binds as a height', () => {
  const altOnly = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Quantity',
          name: 'lat',
          definition: 'urn:osh:def:fixture:position:1#latitude',
          uom: { code: 'deg' },
        },
        {
          type: 'Quantity',
          name: 'lon',
          definition: 'urn:osh:def:fixture:position:1#longitude',
          uom: { code: 'deg' },
        },
        {
          type: 'Quantity',
          name: 'amsl',
          definition: 'urn:osh:def:fixture:position:1#altitudeMsl',
          uom: { code: 'm' },
        },
      ],
    },
  };
  assert.deepEqual(readOshSchemaLocation(altOnly), {
    lat: ['lat'],
    lon: ['lon'],
    alt: null,
    featureUid: null,
  });
});

test('[osh-051] takes the Vector shape when a schema declares both', () => {
  const both = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        ...flatSchema.resultSchema.fields,
        ...vectorSchema.resultSchema.fields.filter((field) => field.type === 'Vector'),
      ],
    },
  };
  const reader = readOshSchemaLocation(both);
  assert.deepEqual(reader.lat, ['location', 'lat']);
  assert.deepEqual(reader.lon, ['location', 'lon']);
});

test('[osh-051] gives null with no resultSchema, or with a body that is not an object', () => {
  assert.equal(readOshSchemaLocation({}), null);
  assert.equal(readOshSchemaLocation(null), null);
  assert.equal(readOshSchemaLocation({ resultSchema: null }), null);
  assert.equal(readOshSchemaLocation({ resultSchema: 'x' }), null);
});

test('[osh-051] does not read a field past a depth of four', () => {
  function nest(level, field) {
    if (level === 0) return field;
    return nest(level - 1, {
      type: 'DataRecord',
      name: `wrap${level}`,
      fields: [field],
    });
  }
  const vectorField = vectorSchema.resultSchema.fields.find((field) => field.type === 'Vector');
  const atDepthFour = { resultSchema: { type: 'DataRecord', fields: [nest(4, vectorField)] } };
  const atDepthFive = { resultSchema: { type: 'DataRecord', fields: [nest(5, vectorField)] } };
  assert.notEqual(readOshSchemaLocation(atDepthFour), null);
  assert.equal(readOshSchemaLocation(atDepthFive), null);
});

// --- osh-027 (MODIFIED): extractOshLocation(result, reader) --------------

test('[osh-027] walks the reader paths into the result', () => {
  const result = { location: { lat: 45.21, lon: 10.53, h: 121 } };
  assert.deepEqual(extractOshLocation(result, VECTOR_READER), {
    lat: 45.21,
    lon: 10.53,
    alt: 121,
  });
});

test('[osh-027] the text "NaN", an empty string and null all fail as a value', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: null };
  assert.equal(extractOshLocation({ lat: 'NaN', lon: 1 }, reader), null);
  assert.equal(extractOshLocation({ lat: '', lon: 1 }, reader), null);
  assert.equal(extractOshLocation({ lat: null, lon: 1 }, reader), null);
});

test('[osh-027] a bad or absent height gives alt:null and keeps a good latitude and longitude', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: ['h'] };
  assert.deepEqual(extractOshLocation({ lat: 1, lon: 2, h: 'NaN' }, reader), {
    lat: 1,
    lon: 2,
    alt: null,
  });
  assert.deepEqual(extractOshLocation({ lat: 1, lon: 2 }, reader), {
    lat: 1,
    lon: 2,
    alt: null,
  });
});

test('[osh-027] a null reader gives null, even for a result with lat and lon keys', () => {
  assert.equal(extractOshLocation({ lat: 1, lon: 2 }, null), null);
});

test('[osh-027] a bad latitude or longitude, or one out of range, gives null', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: null };
  assert.equal(extractOshLocation({ lat: 'x', lon: 2 }, reader), null);
  assert.equal(extractOshLocation({ lat: 91, lon: 0 }, reader), null);
  assert.equal(extractOshLocation({ lat: 0, lon: 181 }, reader), null);
});

test('[osh-027] never reads a value by a guessed key name, and never reads geometry.coordinates', () => {
  const reader = { lat: ['a', 'lat'], lon: ['a', 'lon'], alt: null };
  const result = {
    lat: 1,
    lon: 2,
    geometry: { coordinates: [10.5, 45.2] },
    a: {},
  };
  assert.equal(extractOshLocation(result, reader), null);
});

// --- osh-052: mapOshLocationPage() ----------------------------------------

test('[osh-052] maps the fixture page, kept in order, newest first as the server answers it', () => {
  const nowMs = Date.parse('2026-01-01T00:09:05Z');
  const records = mapOshLocationPage(latestPage, VECTOR_READER, nowMs);
  assert.equal(records.length, 3);
  assert.deepEqual(
    records.map((record) => record.foiId),
    ['foi-fixture-1', null, 'foi-fixture-2'],
  );
  assert.equal(records[0].phenomenonTime, '2026-01-01T00:09:00Z');
  assert.equal(records[2].phenomenonTime, '2026-01-01T00:07:00Z');
});

test('[osh-052] the flat reader finds a location on every item, kept even for the item with no foi@id', () => {
  const flatReader = { lat: ['lat'], lon: ['lon'], alt: ['height'], featureUid: null };
  const nowMs = Date.parse('2026-01-01T00:09:05Z');
  const records = mapOshLocationPage(latestPage, flatReader, nowMs);
  assert.deepEqual(records[1].location, { lat: 45.29, lon: 10.59, alt: 128 });
  assert.equal(records[1].foiId, null);
});

test('[osh-052] an item with no location is kept with location:null', () => {
  const badReader = { lat: ['nope'], lon: ['nope'], alt: null, featureUid: null };
  const nowMs = Date.parse('2026-01-01T00:09:05Z');
  const records = mapOshLocationPage(latestPage, badReader, nowMs);
  assert.equal(records.length, 3);
  assert.ok(records.every((record) => record.location === null));
});

test('[osh-052] ageMs comes from nowMs, not the wall clock: two different nowMs values give two different ages', () => {
  const early = mapOshLocationPage(latestPage, VECTOR_READER, Date.parse('2026-01-01T00:09:10Z'));
  const later = mapOshLocationPage(latestPage, VECTOR_READER, Date.parse('2026-01-01T00:19:10Z'));
  assert.ok(later[0].ageMs > early[0].ageMs);
});

test('[osh-052] a malformed payload maps to an empty list', () => {
  assert.deepEqual(mapOshLocationPage(null, VECTOR_READER, 0), []);
  assert.deepEqual(mapOshLocationPage({}, VECTOR_READER, 0), []);
  assert.deepEqual(mapOshLocationPage({ items: 'x' }, VECTOR_READER, 0), []);
  assert.deepEqual(mapOshLocationPage({ items: [null, 'x'] }, VECTOR_READER, 0), []);
});

// --- osh-022 (carried; the pure function now takes a reader) -------------

test('[osh-022] maps the observation envelope from the fixture, given a reader for its shape', () => {
  const reader = { lat: ['location', 'lat'], lon: ['location', 'lon'], alt: ['location', 'alt'] };
  const observation = mapOshObservation(observationFixture, reader);
  assert.equal(observation.phenomenonTime, '2026-01-01T00:05:00Z');
  assert.equal(observation.resultTime, '2026-01-01T00:05:01Z');
  assert.deepEqual(observation.location, { lat: 45.21, lon: 10.53, alt: 121 });
  assert.ok(observation.rows.some((row) => row.path === 'temperature'));
});

test('[osh-022] with no reader, location is null even though the fixture carries one', () => {
  const observation = mapOshObservation(observationFixture);
  assert.equal(observation.location, null);
});

test('[osh-022] an empty or malformed item list maps to a null observation', () => {
  assert.equal(mapOshObservation({ items: [] }), null);
  assert.equal(mapOshObservation({ items: null }), null);
  assert.equal(mapOshObservation({}), null);
  assert.equal(mapOshObservation(null), null);
  assert.equal(mapOshObservation({ items: [null] }), null);
  assert.equal(mapOshObservation({ items: ['x'] }), null);
});

test('[osh-022] an absent phenomenonTime, resultTime or result becomes null or empty rows', () => {
  const observation = mapOshObservation({ items: [{}] });
  assert.equal(observation.phenomenonTime, null);
  assert.equal(observation.resultTime, null);
  assert.deepEqual(observation.rows, []);
  assert.equal(observation.location, null);
});

test('[osh-022] a non-string phenomenonTime or resultTime becomes null', () => {
  const observation = mapOshObservation({
    items: [{ phenomenonTime: 5, resultTime: 5, result: 1 }],
  });
  assert.equal(observation.phenomenonTime, null);
  assert.equal(observation.resultTime, null);
});

test('[osh-050] computes the age as nowMs minus the parsed phenomenonTime', () => {
  const nowMs = Date.parse('2026-01-01T00:05:12Z');
  assert.equal(oshObservationAgeMs('2026-01-01T00:05:00Z', nowMs), 12_000);
});

test('[osh-050] an absent or non-string phenomenonTime gives a null age', () => {
  assert.equal(oshObservationAgeMs(null, 1000), null);
  assert.equal(oshObservationAgeMs(undefined, 1000), null);
  assert.equal(oshObservationAgeMs(5, 1000), null);
});

test('[osh-050] a phenomenonTime that does not parse gives a null age', () => {
  assert.equal(oshObservationAgeMs('NaN', 1000), null);
  assert.equal(oshObservationAgeMs('not a time', 1000), null);
});

test('[osh-050] fresh holds at the threshold and fails one millisecond past it', () => {
  assert.equal(isOshObservationFresh(OSH_FRESH_MAX_AGE_MS), true);
  assert.equal(isOshObservationFresh(OSH_FRESH_MAX_AGE_MS + 1), false);
});

test('[osh-050] a null or non-finite age is never fresh', () => {
  assert.equal(isOshObservationFresh(null), false);
  assert.equal(isOshObservationFresh(undefined), false);
  assert.equal(isOshObservationFresh(NaN), false);
});

test('[osh-050] a phenomenonTime ahead of nowMs gives a negative age, and a negative age is fresh', () => {
  // The owner's OSH server runs a few seconds ahead of the provider, so a
  // live reading's phenomenonTime lands after the provider's own clock and
  // the age comes out negative. A guard that rejects a negative age, or
  // that treats it as unknown, would reject every live reading from that
  // server; this is the case that rules such a guard out.
  const nowMs = Date.parse('2026-01-01T00:05:00Z');
  const ageMs = oshObservationAgeMs('2026-01-01T00:05:05Z', nowMs);
  assert.equal(ageMs, -5000);
  assert.equal(isOshObservationFresh(ageMs), true);
});

// --- osh-051: branch gaps in the schema reader's helper functions --------

test('[osh-051] a non-string, non-null referenceFrame is treated as not geographic', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          referenceFrame: 12345,
          coordinates: [
            { type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'deg' } },
            { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'deg' } },
          ],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(schema), null);
});

test('[osh-051] a referenceFrame string with no "epsg" in it is not geographic', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          referenceFrame: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84',
          coordinates: [
            { type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'deg' } },
            { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'deg' } },
          ],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(schema), null);
});

test('[osh-051] a flat field with no definition at all never binds', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        { type: 'Quantity', name: 'lat', uom: { code: 'deg' } },
        {
          type: 'Quantity',
          name: 'lon',
          definition: 'urn:osh:def:fixture:position:1#longitude',
          uom: { code: 'deg' },
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(schema), null);
});

test('[osh-051] a definition with no token after its separators gives null, so featureUid stays null', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        ...flatSchema.resultSchema.fields.filter((field) => field.name !== 'featureUid'),
        { type: 'Text', name: 'featureUid', definition: '///' },
      ],
    },
  };
  const reader = readOshSchemaLocation(schema);
  assert.equal(reader.featureUid, null);
});

test('[osh-051] a Vector coordinate with no uom at all never binds', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          coordinates: [
            { type: 'Quantity', name: 'lat', axisID: 'Lat' },
            { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'deg' } },
          ],
        },
      ],
    },
  };
  assert.equal(readOshSchemaLocation(schema), null);
});

test('[osh-051] a malformed entry in a Vector\'s coordinates — null, or with no string name — is skipped', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'Vector',
          name: 'loc',
          coordinates: [
            null,
            { type: 'Quantity', axisID: 'Lat', uom: { code: 'deg' } }, // no name
            { type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'deg' } },
            { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'deg' } },
          ],
        },
      ],
    },
  };
  const reader = readOshSchemaLocation(schema);
  assert.deepEqual(reader.lat, ['loc', 'lat']);
});

test('[osh-051] finds featureUid one level below the root, not only at the top', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        ...flatSchema.resultSchema.fields.filter((field) => field.name !== 'featureUid'),
        {
          type: 'DataRecord',
          name: 'wrap',
          fields: [
            { type: 'Text', name: 'featureUid', definition: 'urn:osh:def:fixture:position:1#samplingFeatureUid' },
          ],
        },
      ],
    },
  };
  const reader = readOshSchemaLocation(schema);
  assert.deepEqual(reader.featureUid, ['wrap', 'featureUid']);
});

// --- osh-027: extractOshLocation() and its readFinite() helper -----------

test('[osh-027] a non-null, non-object result gives null', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: null };
  assert.equal(extractOshLocation('not an object', reader), null);
  assert.equal(extractOshLocation(5, reader), null);
});

// --- osh-052: readFeatureUid() and mapOshLocationPage() branch gaps ------

test('[osh-052] a foiUid path whose value is not a string, or is an empty string, gives null', () => {
  const readerNumeric = { lat: ['lat'], lon: ['lon'], alt: null, featureUid: ['uid'] };
  const nowMs = 0;
  const numericPage = { items: [{ result: { lat: 1, lon: 2, uid: 42 } }] };
  const emptyPage = { items: [{ result: { lat: 1, lon: 2, uid: '' } }] };
  assert.equal(mapOshLocationPage(numericPage, readerNumeric, nowMs)[0].foiUid, null);
  assert.equal(mapOshLocationPage(emptyPage, readerNumeric, nowMs)[0].foiUid, null);
});

test('[osh-052] an item with no "result" key at all is kept, with location:null', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: null, featureUid: null };
  const records = mapOshLocationPage({ items: [{ phenomenonTime: '2026-01-01T00:00:00Z' }] }, reader, 0);
  assert.equal(records.length, 1);
  assert.equal(records[0].location, null);
});

test('[osh-052] a non-string phenomenonTime or resultTime becomes null, not just an absent one', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: null, featureUid: null };
  const records = mapOshLocationPage(
    { items: [{ phenomenonTime: 5, resultTime: 5, result: { lat: 1, lon: 2 } }] },
    reader,
    0,
  );
  assert.equal(records[0].phenomenonTime, null);
  assert.equal(records[0].resultTime, null);
});

test('[osh-052] a null reader gives every record a null foiUid and a null location, with no throw', () => {
  const records = mapOshLocationPage(latestPage, null, 0);
  assert.equal(records.length, 3);
  assert.ok(records.every((record) => record.foiUid === null && record.location === null));
});

test('[osh-052] a reader with featureUid explicitly undefined (never set) also gives a null foiUid', () => {
  const reader = { lat: ['lat'], lon: ['lon'], alt: null };
  const records = mapOshLocationPage({ items: [{ result: { lat: 1, lon: 2 } }] }, reader, 0);
  assert.equal(records[0].foiUid, null);
});

test('[osh-051] finds the flat shape one level below the root, not only at the top', () => {
  const schema = {
    resultSchema: {
      type: 'DataRecord',
      fields: [
        {
          type: 'DataRecord',
          name: 'wrap',
          fields: flatSchema.resultSchema.fields.filter((field) => field.name !== 'featureUid'),
        },
      ],
    },
  };
  const reader = readOshSchemaLocation(schema);
  assert.deepEqual(reader.lat, ['wrap', 'lat']);
  assert.deepEqual(reader.lon, ['wrap', 'lon']);
});
