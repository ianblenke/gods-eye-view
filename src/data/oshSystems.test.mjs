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

// --- osh-042 (MODIFIED): placeOshEntities() with a locations input -------
// ageMs values below are chosen well inside/outside any plausible
// freshness threshold (design decision D40, osh-observation-age): 5_000 ms
// is fresh under any reasonable window, 7_200_000 ms (two hours) is stale
// under a one-hour one.
const FRESH_AGE_MS = 5_000;
const STALE_AGE_MS = 7_200_000;

test('[osh-042] a location whose ageMs is not fresh is dropped before any other rule', () => {
  const { systems, features, unplaced } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', lon: null, lat: null, alt: null }],
    fois: [{ id: 'foi-fixture-1', systemId: null, lon: 1, lat: 1, alt: null }],
    locations: [
      { systemId: 'sys-fixture-1', foiId: null, foiUid: null, lon: 9, lat: 9, alt: 9, ageMs: STALE_AGE_MS },
      { systemId: null, foiId: 'foi-fixture-1', foiUid: null, lon: 9, lat: 9, alt: 9, ageMs: null },
    ],
  });
  assert.equal(systems.length, 0);
  assert.deepEqual(unplaced, ['sys-fixture-1']);
  assert.equal(features[0].lon, 1, 'the stale feature-referencing location never moved the feature');
});

test('[osh-042] a fresh location moves a feature it finds by foiId or by foiUid, and is dropped for an unknown feature', () => {
  const { features } = placeOshEntities({
    systems: [],
    fois: [
      { id: 'foi-fixture-1', uid: 'urn:foi-1', systemId: null, lon: 1, lat: 1, alt: null },
      { id: 'foi-fixture-2', uid: 'urn:foi-2', systemId: null, lon: 2, lat: 2, alt: null },
    ],
    locations: [
      { foiId: 'foi-fixture-1', foiUid: null, lon: 11, lat: 12, alt: 13, ageMs: FRESH_AGE_MS },
      { foiId: null, foiUid: 'urn:foi-2', lon: 21, lat: 22, alt: 23, ageMs: FRESH_AGE_MS },
      { foiId: 'foi-fixture-unknown', foiUid: null, lon: 99, lat: 99, alt: 99, ageMs: FRESH_AGE_MS },
    ],
  });
  const byId = Object.fromEntries(features.map((f) => [f.id, f]));
  assert.deepEqual([byId['foi-fixture-1'].lon, byId['foi-fixture-1'].lat, byId['foi-fixture-1'].alt], [11, 12, 13]);
  assert.equal(byId['foi-fixture-1'].locationSource, 'stream');
  assert.deepEqual([byId['foi-fixture-2'].lon, byId['foi-fixture-2'].lat], [21, 22]);
});

test('[osh-042] a fresh location with no feature reference places its system above a Point, and the newer of two wins', () => {
  const { systems } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', uid: 'urn:sys-1', name: 'Gateway', lon: 1, lat: 1, alt: 1 }],
    fois: [],
    locations: [
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 50,
        lat: 51,
        alt: 52,
        datastreamId: 'ds-fixture-old',
        datastreamName: 'Old',
        phenomenonTime: '2026-01-01T00:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 60,
        lat: 61,
        alt: 62,
        datastreamId: 'ds-fixture-new',
        datastreamName: 'New',
        phenomenonTime: '2026-01-01T01:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
    ],
  });
  assert.equal(systems.length, 1);
  assert.equal(systems[0].locationSource, 'stream');
  assert.equal(systems[0].lon, 60, 'the newer of the two stream locations wins');
  assert.equal(systems[0].datastreamId, 'ds-fixture-new');
  assert.equal(systems[0].name, 'Gateway', 'the held record\'s name is kept above a stream placement');
});

test('[osh-042] a fresh location whose system has no record still gives a placed system with name:null', () => {
  const { systems, unplaced } = placeOshEntities({
    systems: [],
    fois: [],
    locations: [
      {
        systemId: 'sys-fixture-unseen',
        foiId: null,
        foiUid: null,
        lon: 5,
        lat: 6,
        alt: null,
        datastreamId: 'ds-fixture-1',
        datastreamName: 'Aircraft Position',
        phenomenonTime: '2026-01-01T00:00:00Z',
        ageMs: FRESH_AGE_MS,
        systemName: 'Fixture Aircraft',
      },
    ],
  });
  assert.equal(systems.length, 1);
  assert.equal(systems[0].id, 'sys-fixture-unseen');
  assert.equal(systems[0].name, null);
  assert.equal(systems[0].locationSource, 'stream');
  assert.equal(systems[0].streamSystemName, 'Fixture Aircraft');
  assert.deepEqual(unplaced, []);
});

test('[osh-042] a location naming neither a feature nor a systemId is ignored', () => {
  const { systems, unplaced } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', lon: null, lat: null, alt: null }],
    fois: [],
    locations: [{ systemId: null, foiId: null, foiUid: null, lon: 1, lat: 1, alt: 1, ageMs: FRESH_AGE_MS }],
  });
  assert.deepEqual(unplaced, ['sys-fixture-1']);
  assert.equal(systems.length, 0);
});

test('[osh-042] a location with no phenomenonTime is never treated as newer than one that has one', () => {
  const { systems } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', uid: null, name: 'Gateway', lon: 1, lat: 1, alt: 1 }],
    fois: [],
    locations: [
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 10,
        lat: 11,
        alt: 12,
        datastreamId: 'ds-fixture-first',
        datastreamName: 'First',
        phenomenonTime: '2026-01-01T00:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 20,
        lat: 21,
        alt: 22,
        datastreamId: 'ds-fixture-no-time',
        datastreamName: 'No Time',
        phenomenonTime: null,
        ageMs: FRESH_AGE_MS,
      },
    ],
  });
  assert.equal(systems[0].datastreamId, 'ds-fixture-first', 'a location with no time never displaces one that has one');
});

test('[osh-042] a location with a valid time replaces an earlier one that had no time at all', () => {
  const { systems } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', uid: null, name: 'Gateway', lon: 1, lat: 1, alt: 1 }],
    fois: [],
    locations: [
      // Pushed first, with no time to compare against.
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 10,
        lat: 11,
        alt: 12,
        datastreamId: 'ds-fixture-no-time',
        datastreamName: 'No Time',
        phenomenonTime: null,
        ageMs: FRESH_AGE_MS,
      },
      // Compared against the first: a valid time against no time at all
      // must win, since "no time" can never itself be newer.
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 20,
        lat: 21,
        alt: 22,
        datastreamId: 'ds-fixture-has-time',
        datastreamName: 'Has Time',
        phenomenonTime: '2026-01-01T00:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
    ],
  });
  assert.equal(systems[0].datastreamId, 'ds-fixture-has-time');
});

test('[osh-042] the newer of two fresh locations naming the same feature wins', () => {
  const { features } = placeOshEntities({
    systems: [],
    fois: [{ id: 'foi-fixture-1', uid: 'urn:foi-1', systemId: null, lon: 1, lat: 1, alt: null }],
    locations: [
      {
        foiId: 'foi-fixture-1',
        foiUid: null,
        lon: 11,
        lat: 12,
        alt: 13,
        phenomenonTime: '2026-01-01T00:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
      {
        foiId: 'foi-fixture-1',
        foiUid: null,
        lon: 21,
        lat: 22,
        alt: 23,
        phenomenonTime: '2026-01-01T01:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
    ],
  });
  const feature = features.find((f) => f.id === 'foi-fixture-1');
  assert.deepEqual([feature.lon, feature.lat, feature.alt], [21, 22, 23], 'the newer of the two locations wins');
});

test('[osh-042] when neither of two locations for one system has a usable time, the first one seen is kept', () => {
  const { systems } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', uid: null, name: 'Gateway', lon: 1, lat: 1, alt: 1 }],
    fois: [],
    locations: [
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 10,
        lat: 11,
        alt: 12,
        datastreamId: 'ds-fixture-first-no-time',
        datastreamName: 'First',
        phenomenonTime: null,
        ageMs: FRESH_AGE_MS,
      },
      {
        systemId: 'sys-fixture-1',
        foiId: null,
        foiUid: null,
        lon: 20,
        lat: 21,
        alt: 22,
        datastreamId: 'ds-fixture-second-no-time',
        datastreamName: 'Second',
        phenomenonTime: 'also-not-a-time',
        ageMs: FRESH_AGE_MS,
      },
    ],
  });
  assert.equal(
    systems[0].datastreamId,
    'ds-fixture-first-no-time',
    'neither location has a usable time, so the second never displaces the first',
  );
});

test('[osh-042] a fresh location naming an unknown feature is dropped entirely — it never places its own systemId as a fallback', () => {
  const { systems, unplaced } = placeOshEntities({
    systems: [{ id: 'sys-fixture-1', uid: null, name: 'Gateway', lon: null, lat: null, alt: null }],
    fois: [],
    locations: [
      {
        systemId: 'sys-fixture-1',
        foiId: 'foi-fixture-unknown',
        foiUid: null,
        lon: 99,
        lat: 99,
        alt: 99,
        datastreamId: 'ds-fixture-1',
        datastreamName: 'Wrong',
        phenomenonTime: '2026-01-01T00:00:00Z',
        ageMs: FRESH_AGE_MS,
      },
    ],
  });
  assert.equal(systems.length, 0, 'the location named a feature, so it must never place a system, known or not');
  assert.deepEqual(unplaced, ['sys-fixture-1']);
});
