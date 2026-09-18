import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  OSH_FRESH_MAX_AGE_MS,
  extractOshLocation,
  flattenOshResult,
  isOshObservationFresh,
  mapOshObservation,
  oshObservationAgeMs,
} from './oshObservations.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/osh-observation.json', import.meta.url), 'utf8'),
);

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

test('[osh-027] extracts a location from lat/lon keys, case-insensitive, with an optional alt', () => {
  assert.deepEqual(extractOshLocation({ lat: 45.2, lon: 10.5 }), {
    lat: 45.2,
    lon: 10.5,
    alt: null,
  });
  assert.deepEqual(extractOshLocation({ LATITUDE: 1, Longitude: 2, Alt: 3 }), {
    lat: 1,
    lon: 2,
    alt: 3,
  });
});

test('[osh-027] finds a location object nested up to depth 4', () => {
  const found = extractOshLocation({ a: { b: { c: { lat: 1, lon: 2 } } } });
  assert.deepEqual(found, { lat: 1, lon: 2, alt: null });
});

test('[osh-027] does not search past depth 4', () => {
  const found = extractOshLocation({ a: { b: { c: { d: { lat: 1, lon: 2 } } } } });
  assert.equal(found, null);
});

test('[osh-027] falls back to geometry.coordinates as [lon, lat, alt]', () => {
  assert.deepEqual(extractOshLocation({ geometry: { coordinates: [10.5, 45.2, 8] } }), {
    lat: 45.2,
    lon: 10.5,
    alt: 8,
  });
  assert.deepEqual(extractOshLocation({ geometry: { coordinates: [10.5, 45.2] } }), {
    lat: 45.2,
    lon: 10.5,
    alt: null,
  });
});

test('[osh-027] rejects an out-of-range latitude or longitude', () => {
  assert.equal(extractOshLocation({ lat: 91, lon: 0 }), null);
  assert.equal(extractOshLocation({ lat: 0, lon: 181 }), null);
  assert.equal(
    extractOshLocation({ geometry: { coordinates: [200, 0] } }),
    null,
  );
});

test('[osh-027] returns null when there is no location anywhere', () => {
  assert.equal(extractOshLocation(null), null);
  assert.equal(extractOshLocation(5), null);
  assert.equal(extractOshLocation({ temperature: 21 }), null);
  assert.equal(extractOshLocation({ lat: 1 }), null);
  assert.equal(extractOshLocation({ lat: 'x', lon: 2 }), null);
  assert.equal(extractOshLocation({ geometry: {} }), null);
  assert.equal(extractOshLocation({ geometry: { coordinates: [1] } }), null);
  assert.equal(extractOshLocation({ geometry: { coordinates: ['x', 1] } }), null);
  assert.equal(extractOshLocation({ a: [{ lat: 1, lon: 2 }] }), null);
});

test('[osh-027] ignores a non-finite alt value', () => {
  assert.deepEqual(extractOshLocation({ lat: 1, lon: 2, alt: 'x' }), {
    lat: 1,
    lon: 2,
    alt: null,
  });
});

test('[osh-022] maps the observation envelope from the fixture', () => {
  const observation = mapOshObservation(fixture);
  assert.equal(observation.phenomenonTime, '2026-01-01T00:05:00Z');
  assert.equal(observation.resultTime, '2026-01-01T00:05:01Z');
  assert.deepEqual(observation.location, { lat: 45.21, lon: 10.53, alt: 121 });
  assert.ok(observation.rows.some((row) => row.path === 'temperature'));
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

test('[osh-050] oshObservationAgeMs() returns nowMs minus the parsed phenomenonTime', () => {
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

test('[osh-050] isOshObservationFresh() is true at the threshold and false one millisecond past it', () => {
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
