import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mapOshSystems, placeOshEntities } from './oshSystems.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-systems.json', import.meta.url), 'utf8'),
);

test('[osh-024] maps a feature list to system records, keeping a system with no point', () => {
  const records = mapOshSystems(fixture);
  assert.deepEqual(records, [
    {
      id: 'sys-fixture-1',
      uid: 'urn:osh:sys-fixture-1',
      name: 'Fixture System One',
      description: 'A synthetic system used for tests.',
      validTime: ['2026-01-01T00:00:00Z', 'now'],
      lon: 10.5,
      lat: 45.2,
      alt: 120,
    },
    {
      id: 'sys-fixture-2',
      uid: 'urn:osh:sys-fixture-2',
      name: 'Fixture System Two',
      description: null,
      validTime: null,
      lon: null,
      lat: null,
      alt: null,
    },
    {
      id: 'sys-fixture-3',
      uid: 'urn:osh:sys-fixture-3',
      name: 'Fixture System Three, gateway with no point',
      description: null,
      validTime: null,
      lon: null,
      lat: null,
      alt: null,
    },
  ]);
});

test('[osh-024] accepts the items key and the features key', () => {
  const records = mapOshSystems({
    items: [
      {
        id: 'sys-fixture-9',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: {},
      },
    ],
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].id, 'sys-fixture-9');
  assert.equal(records[0].alt, null);
  assert.equal(records[0].uid, null);
  assert.equal(records[0].name, null);
  assert.equal(records[0].description, null);
  assert.equal(records[0].validTime, null);
});

test('[osh-024] returns an empty list for a malformed payload', () => {
  for (const payload of [null, undefined, {}, { features: 'x' }, { items: null }, []]) {
    assert.deepEqual(mapOshSystems(payload), []);
  }
});

test('[osh-024] skips a feature with no id, a non-object entry, or a non-string id', () => {
  const records = mapOshSystems({
    features: [
      null,
      'x',
      { id: '', geometry: { type: 'Point', coordinates: [1, 2] } },
      { geometry: { type: 'Point', coordinates: [1, 2] } },
      { id: 123, geometry: { type: 'Point', coordinates: [1, 2] } },
    ],
  });
  assert.deepEqual(records, []);
});

test('[osh-024] gives null lon, lat and alt for no geometry, a non-Point geometry, or no coordinates', () => {
  const records = mapOshSystems({
    features: [
      { id: 'no-geom' },
      { id: 'null-geom', geometry: null },
      { id: 'line', geometry: { type: 'LineString', coordinates: [1, 2] } },
      { id: 'no-coords', geometry: { type: 'Point' } },
    ],
  });
  assert.equal(records.length, 4);
  for (const record of records) {
    assert.equal(record.lon, null);
    assert.equal(record.lat, null);
    assert.equal(record.alt, null);
  }
});

test('[osh-024] gives null lon, lat and alt for a non-finite coordinate', () => {
  const records = mapOshSystems({
    features: [
      { id: 'a', geometry: { type: 'Point', coordinates: [null, 2] } },
      { id: 'b', geometry: { type: 'Point', coordinates: [1, 'x'] } },
      { id: 'c', geometry: { type: 'Point', coordinates: [Infinity, 2] } },
    ],
  });
  assert.equal(records.length, 3);
  for (const record of records) {
    assert.equal(record.lon, null);
    assert.equal(record.lat, null);
  }
});

test('[osh-024] keeps the first record of a repeated id', () => {
  const records = mapOshSystems({
    features: [
      {
        id: 'sys-fixture-dup',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: { name: 'First' },
      },
      {
        id: 'sys-fixture-dup',
        geometry: { type: 'Point', coordinates: [9, 9] },
        properties: { name: 'Second' },
      },
    ],
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].name, 'First');
  assert.equal(records[0].lon, 1);
});

test('[osh-024] ignores non-string property values', () => {
  const records = mapOshSystems({
    features: [
      {
        id: 'sys-fixture-9',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: { uid: 9, name: 9, description: 9, validTime: 'x' },
      },
    ],
  });
  assert.deepEqual(records[0], {
    id: 'sys-fixture-9',
    uid: null,
    name: null,
    description: null,
    validTime: null,
    lon: 1,
    lat: 2,
    alt: null,
  });
});

test('[osh-024] tolerates absent or non-object properties', () => {
  const records = mapOshSystems({
    features: [
      { id: 'sys-fixture-10', geometry: { type: 'Point', coordinates: [1, 2] } },
      {
        id: 'sys-fixture-11',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: 'x',
      },
    ],
  });
  assert.equal(records.length, 2);
  for (const record of records) assert.equal(record.uid, null);
});

test('[osh-042] places a system with a Point, and adds a system with no Point to unplaced', () => {
  const { systems, unplaced } = placeOshEntities({
    systems: [
      { id: 'sys-fixture-1', lon: 1, lat: 2, alt: 3 },
      { id: 'sys-fixture-2', lon: null, lat: null, alt: null },
    ],
    fois: [],
  });
  assert.equal(systems.length, 1);
  assert.equal(systems[0].id, 'sys-fixture-1');
  assert.equal(systems[0].locationSource, 'geometry');
  assert.deepEqual(unplaced, ['sys-fixture-2']);
});

test('[osh-042] places every feature record at its own point, with its systemId', () => {
  const { features } = placeOshEntities({
    systems: [],
    fois: [
      { id: 'foi-fixture-1', systemId: 'sys-fixture-1', lon: 5, lat: 6, alt: null },
      { id: 'foi-fixture-2', systemId: null, lon: 7, lat: 8, alt: null },
    ],
  });
  assert.equal(features.length, 2);
  assert.equal(features[0].systemId, 'sys-fixture-1');
  assert.equal(features[1].systemId, null);
});

test('[osh-042] a feature never places its host system, and a system never places a feature', () => {
  const { systems, features } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', lon: null, lat: null, alt: null }],
    fois: [{ id: 'foi-fixture-1', systemId: 'sys-fixture-1', lon: 5, lat: 6, alt: null }],
  });
  assert.equal(systems.length, 0);
  assert.equal(features.length, 1);
  assert.equal(features[0].id, 'foi-fixture-1');
});

test('[osh-042] defaults both lists to empty', () => {
  assert.deepEqual(placeOshEntities(), { systems: [], features: [], unplaced: [] });
});
