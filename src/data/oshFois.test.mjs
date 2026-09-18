import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mapOshFois } from './oshFois.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-fois.json', import.meta.url), 'utf8'),
);

test('[osh-041] maps the fixture feature list, dropping the null-geometry node', () => {
  const records = mapOshFois(fixture);
  const ids = records.map((record) => record.id);
  assert.deepEqual(ids, [
    'foi-fixture-1',
    'foi-fixture-2',
    'foi-fixture-3',
    'foi-fixture-4',
    'foi-fixture-6',
    'foi-fixture-7',
  ]);
  assert.deepEqual(records[0], {
    id: 'foi-fixture-1',
    uid: 'urn:osh:foi-fixture-1',
    systemId: 'sys-fixture-2',
    name: 'Fixture Node One',
    description: 'A synthetic mesh node used for tests.',
    validTime: ['2026-01-01T00:00:00Z', 'now'],
    lon: 10.6,
    lat: 45.3,
    alt: 90,
  });
});

test('[osh-041] gives a null systemId for a link that is not systems/<id>', () => {
  const records = mapOshFois(fixture);
  const wrongKind = records.find((record) => record.id === 'foi-fixture-6');
  const noLink = records.find((record) => record.id === 'foi-fixture-7');
  assert.equal(wrongKind.systemId, null);
  assert.equal(noLink.systemId, null);
});

test('[osh-041] skips a feature with no string id', () => {
  const records = mapOshFois({
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

test('[osh-041] skips a feature with no Point, or a coordinate that is not finite', () => {
  const records = mapOshFois({
    features: [
      { id: 'no-geom' },
      { id: 'null-geom', geometry: null },
      { id: 'line', geometry: { type: 'LineString', coordinates: [1, 2] } },
      { id: 'no-coords', geometry: { type: 'Point' } },
      { id: 'bad-lon', geometry: { type: 'Point', coordinates: [Infinity, 2] } },
      { id: 'bad-lat', geometry: { type: 'Point', coordinates: [1, 'x'] } },
      { id: 'empty-lon', geometry: { type: 'Point', coordinates: ['', 2] } },
    ],
  });
  assert.deepEqual(records, []);
});

test('[osh-041] keeps the first record of a repeated id', () => {
  const records = mapOshFois({
    features: [
      {
        id: 'foi-fixture-dup',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: { name: 'First' },
      },
      {
        id: 'foi-fixture-dup',
        geometry: { type: 'Point', coordinates: [9, 9] },
        properties: { name: 'Second' },
      },
    ],
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].name, 'First');
});

test('[osh-041] a malformed payload maps to an empty list', () => {
  for (const payload of [null, undefined, {}, { features: 'x' }, { items: null }, []]) {
    assert.deepEqual(mapOshFois(payload), []);
  }
});

test('[osh-041] accepts the items key, and tolerates absent or non-object properties', () => {
  const records = mapOshFois({
    items: [
      { id: 'foi-fixture-20', geometry: { type: 'Point', coordinates: [1, 2] } },
      {
        id: 'foi-fixture-21',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: 'x',
      },
    ],
  });
  assert.equal(records.length, 2);
  for (const record of records) {
    assert.equal(record.uid, null);
    assert.equal(record.systemId, null);
  }
});

test('[osh-041] ignores non-string property values', () => {
  const records = mapOshFois({
    features: [
      {
        id: 'foi-fixture-30',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: { uid: 9, name: 9, description: 9, validTime: 'x' },
      },
    ],
  });
  assert.deepEqual(records[0], {
    id: 'foi-fixture-30',
    uid: null,
    systemId: null,
    name: null,
    description: null,
    validTime: null,
    lon: 1,
    lat: 2,
    alt: null,
  });
});

test('[osh-047] mapOshFois() keeps a systemId outside the id pattern as null', () => {
  const records = mapOshFois({
    features: [
      {
        id: 'foi-fixture-40',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: { 'hostedProcedure@link': { href: 'https://osh.example/api/systems/a b' } },
      },
      {
        id: 'foi-fixture-41',
        geometry: { type: 'Point', coordinates: [1, 2] },
        properties: {
          'hostedProcedure@link': { href: `https://osh.example/api/systems/${'a'.repeat(65)}` },
        },
      },
    ],
  });
  for (const record of records) assert.equal(record.systemId, null);
});
