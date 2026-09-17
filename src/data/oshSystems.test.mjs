import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mapOshSystems } from './oshSystems.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-systems.json', import.meta.url), 'utf8'),
);

test('[osh-024] maps a feature list to system records and skips a system without a point', () => {
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
  ]);
});

test('[osh-024] accepts the items key and the features key', () => {
  const records = mapOshSystems({
    items: [
      {
        id: 'sys-fixture-3',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: {},
      },
    ],
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].id, 'sys-fixture-3');
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

test('[osh-024] skips a feature with no id, a non-object entry, or a non-Point geometry', () => {
  const records = mapOshSystems({
    features: [
      null,
      'x',
      { id: '', geometry: { type: 'Point', coordinates: [1, 2] } },
      { geometry: { type: 'Point', coordinates: [1, 2] } },
      { id: 'no-geom' },
      { id: 'null-geom', geometry: null },
      { id: 'line', geometry: { type: 'LineString', coordinates: [1, 2] } },
      { id: 'no-coords', geometry: { type: 'Point' } },
    ],
  });
  assert.deepEqual(records, []);
});

test('[osh-024] skips a feature with a non-finite coordinate', () => {
  const records = mapOshSystems({
    features: [
      { id: 'a', geometry: { type: 'Point', coordinates: [null, 2] } },
      { id: 'b', geometry: { type: 'Point', coordinates: [1, 'x'] } },
      { id: 'c', geometry: { type: 'Point', coordinates: [Infinity, 2] } },
    ],
  });
  assert.deepEqual(records, []);
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

test('[osh-024] skips a feature with a non-string id and tolerates absent or non-object properties', () => {
  assert.deepEqual(
    mapOshSystems({
      features: [{ id: 123, geometry: { type: 'Point', coordinates: [1, 2] } }],
    }),
    [],
  );
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
