import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OSH_ID_PATTERN,
  OSH_OBSERVATIONS_QUERY,
  assertObservationUrl,
  observationUrl,
  readDatastreamId,
} from '../../server/providers/osh/ids.js';

function paramsFor(rawQuery) {
  return new URL(`https://app.example/o?${rawQuery}`).searchParams;
}

const REJECTED_VALUES = [
  '../systems',
  '..%2Fsystems',
  'https://osh.example/x',
  '//osh.example/x',
  'http:x',
  'javascript:x',
  'a?limit=1',
  'a&limit=1',
  'a#f',
  'a/b',
  'a%2Fb',
  'a.b',
  'a b',
  'a'.repeat(65),
];

test('[osh-020] refuses an absent datastream parameter', () => {
  assert.equal(readDatastreamId(paramsFor('x=1')), null);
});

test('[osh-020] refuses an empty datastream value', () => {
  assert.equal(readDatastreamId(paramsFor('datastream=')), null);
});

test('[osh-020] refuses every value outside the id pattern', () => {
  for (const value of REJECTED_VALUES) {
    const params = paramsFor(`datastream=${encodeURIComponent(value)}`);
    assert.equal(
      readDatastreamId(params),
      null,
      `expected "${value}" to be refused`,
    );
  }
});

test('[osh-020] refuses a repeated datastream parameter', () => {
  const params = paramsFor('datastream=ds-fixture-1&datastream=ds-fixture-2');
  assert.equal(readDatastreamId(params), null);
});

test('[osh-021] accepts a valid id and builds the fixed observations URL', () => {
  const root = new URL('https://osh.example/api/');
  for (const id of ['ds-fixture-1', 'A_b-9']) {
    assert.ok(OSH_ID_PATTERN.test(id));
    assert.equal(readDatastreamId(paramsFor(`datastream=${id}`)), id);
    const url = observationUrl(root, id);
    assert.equal(url.origin, root.origin);
    assert.equal(url.pathname, `${root.pathname}datastreams/${id}/observations`);
    assert.equal(url.search, `?${OSH_OBSERVATIONS_QUERY}`);
    assert.doesNotThrow(() => assertObservationUrl(url, root, id));
  }
});

test('[osh-021] the guard throws for a URL with another origin, prefix, segment or query', () => {
  const root = new URL('https://osh.example/api/');
  const id = 'ds-fixture-1';
  const goodUrl = observationUrl(root, id);

  const otherOrigin = new URL(goodUrl.href);
  otherOrigin.host = 'attacker.example';
  assert.throws(() => assertObservationUrl(otherOrigin, root, id));

  const otherPrefix = new URL(
    `https://osh.example/other/datastreams/${id}/observations?${OSH_OBSERVATIONS_QUERY}`,
  );
  assert.throws(() => assertObservationUrl(otherPrefix, root, id));

  const extraSegment = new URL(
    `https://osh.example/api/datastreams/${id}/observations/extra?${OSH_OBSERVATIONS_QUERY}`,
  );
  assert.throws(() => assertObservationUrl(extraSegment, root, id));

  const otherQuery = new URL(
    `https://osh.example/api/datastreams/${id}/observations?limit=2`,
  );
  assert.throws(() => assertObservationUrl(otherQuery, root, id));

  const withHash = new URL(goodUrl.href);
  withHash.hash = 'f';
  assert.throws(() => assertObservationUrl(withHash, root, id));
});
