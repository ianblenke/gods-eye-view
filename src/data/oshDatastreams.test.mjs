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
