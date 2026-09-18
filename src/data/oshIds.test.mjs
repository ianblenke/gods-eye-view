import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OSH_ID_PATTERN,
  OSH_LATEST_LIMIT,
  OSH_LATEST_QUERY,
  OSH_OBSERVATIONS_QUERY,
  OSH_SYSTEM_DATASTREAMS_QUERY,
  assertObservationUrl,
  assertObservationsLatestUrl,
  assertSchemaUrl,
  assertSystemDatastreamsUrl,
  assertSystemUrl,
  observationUrl,
  observationsLatestUrl,
  readDatastreamId,
  readSystemId,
  schemaUrl,
  systemDatastreamsUrl,
  systemUrl,
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

test('[osh-047] readSystemId() refuses an absent, empty or repeated system parameter, and every rejected value', () => {
  assert.equal(readSystemId(paramsFor('x=1')), null);
  assert.equal(readSystemId(paramsFor('system=')), null);
  assert.equal(
    readSystemId(paramsFor('system=sys-fixture-1&system=sys-fixture-2')),
    null,
    'a reader that takes the first of two values would wrongly accept this',
  );
  for (const value of REJECTED_VALUES) {
    const params = paramsFor(`system=${encodeURIComponent(value)}`);
    assert.equal(readSystemId(params), null, `expected "${value}" to be refused`);
  }
});

test('[osh-047] readSystemId() accepts a value that matches the id pattern', () => {
  for (const id of ['sys-fixture-1', 'A_b-9']) {
    assert.equal(readSystemId(paramsFor(`system=${id}`)), id);
  }
});

test('[osh-047] systemDatastreamsUrl() builds the fixed systems/<id>/datastreams URL, with the id never in the query', () => {
  const root = new URL('https://osh.example/api/');
  const id = 'sys-fixture-1';
  const url = systemDatastreamsUrl(root, id);
  assert.equal(url.origin, root.origin);
  assert.equal(url.pathname, `${root.pathname}systems/${id}/datastreams`);
  assert.equal(url.search, `?${OSH_SYSTEM_DATASTREAMS_QUERY}`);
  assert.equal(url.search.includes(id), false, 'the id must never sit inside the query');
  assert.doesNotThrow(() => assertSystemDatastreamsUrl(url, root, id));
});

test('[osh-047] assertSystemDatastreamsUrl() throws for another origin, prefix, segment or query', () => {
  const root = new URL('https://osh.example/api/');
  const id = 'sys-fixture-1';
  const goodUrl = systemDatastreamsUrl(root, id);

  const otherOrigin = new URL(goodUrl.href);
  otherOrigin.host = 'attacker.example';
  assert.throws(() => assertSystemDatastreamsUrl(otherOrigin, root, id));

  const otherPrefix = new URL(
    `https://osh.example/other/systems/${id}/datastreams?${OSH_SYSTEM_DATASTREAMS_QUERY}`,
  );
  assert.throws(() => assertSystemDatastreamsUrl(otherPrefix, root, id));

  const extraSegment = new URL(
    `https://osh.example/api/systems/${id}/datastreams/extra?${OSH_SYSTEM_DATASTREAMS_QUERY}`,
  );
  assert.throws(() => assertSystemDatastreamsUrl(extraSegment, root, id));

  // A check that compares only the path, not the query, would wrongly accept this.
  const otherQuery = new URL(
    `https://osh.example/api/systems/${id}/datastreams?limit=2`,
  );
  assert.throws(() => assertSystemDatastreamsUrl(otherQuery, root, id));

  const withHash = new URL(goodUrl.href);
  withHash.hash = 'f';
  assert.throws(() => assertSystemDatastreamsUrl(withHash, root, id));
});

test('[osh-053] schemaUrl() and systemUrl() build fixed URLs with an empty query', () => {
  const root = new URL('https://osh.example/api/');

  const dsId = 'ds-fixture-1';
  const schema = schemaUrl(root, dsId);
  assert.equal(schema.origin, root.origin);
  assert.equal(schema.pathname, `${root.pathname}datastreams/${dsId}/schema`);
  assert.equal(schema.search, '');
  assert.doesNotThrow(() => assertSchemaUrl(schema, root, dsId));

  const sysId = 'sys-fixture-1';
  const system = systemUrl(root, sysId);
  assert.equal(system.origin, root.origin);
  assert.equal(system.pathname, `${root.pathname}systems/${sysId}`);
  assert.equal(system.search, '');
  assert.doesNotThrow(() => assertSystemUrl(system, root, sysId));
});

test('[osh-053] assertSchemaUrl() and assertSystemUrl() throw for another origin, prefix, segment or query', () => {
  const root = new URL('https://osh.example/api/');
  const dsId = 'ds-fixture-1';
  const sysId = 'sys-fixture-1';

  const goodSchema = schemaUrl(root, dsId);
  const otherOriginSchema = new URL(goodSchema.href);
  otherOriginSchema.host = 'attacker.example';
  assert.throws(() => assertSchemaUrl(otherOriginSchema, root, dsId));
  assert.throws(() =>
    assertSchemaUrl(
      new URL(`https://osh.example/other/datastreams/${dsId}/schema`),
      root,
      dsId,
    ),
  );
  assert.throws(() =>
    assertSchemaUrl(
      new URL(`https://osh.example/api/datastreams/${dsId}/schema/extra`),
      root,
      dsId,
    ),
  );
  assert.throws(() =>
    assertSchemaUrl(new URL(`https://osh.example/api/datastreams/${dsId}/schema?limit=1`), root, dsId),
  );

  const goodSystem = systemUrl(root, sysId);
  const otherOriginSystem = new URL(goodSystem.href);
  otherOriginSystem.host = 'attacker.example';
  assert.throws(() => assertSystemUrl(otherOriginSystem, root, sysId));
  assert.throws(() =>
    assertSystemUrl(new URL(`https://osh.example/other/systems/${sysId}`), root, sysId),
  );
  assert.throws(() =>
    assertSystemUrl(new URL(`https://osh.example/api/systems/${sysId}/datastreams`), root, sysId),
  );
  assert.throws(() =>
    assertSystemUrl(new URL(`https://osh.example/api/systems/${sysId}?limit=1`), root, sysId),
  );
});

test('[osh-053] the schema and system URL pairs are the only functions the route may call — no argument replaces either', () => {
  // schemaUrl/assertSchemaUrl and systemUrl/assertSystemUrl take no
  // function argument at all: there is no seam for a caller to swap in a
  // different builder or checker, so this is a static fact of the
  // signatures rather than a runtime assertion.
  assert.equal(schemaUrl.length, 2);
  assert.equal(assertSchemaUrl.length, 3);
  assert.equal(systemUrl.length, 2);
  assert.equal(assertSystemUrl.length, 3);
});

test('[osh-054] observationsLatestUrl() builds the fixed newest-per-feature URL', () => {
  const root = new URL('https://osh.example/api/');
  const id = 'ds-fixture-1';
  assert.equal(OSH_LATEST_LIMIT, 300);
  assert.equal(OSH_LATEST_QUERY, 'limit=300&resultTime=latest');
  const url = observationsLatestUrl(root, id);
  assert.equal(url.origin, root.origin);
  assert.equal(url.pathname, `${root.pathname}datastreams/${id}/observations`);
  assert.equal(url.search, `?${OSH_LATEST_QUERY}`);
  assert.doesNotThrow(() => assertObservationsLatestUrl(url, root, id));
});

test('[osh-054] assertObservationsLatestUrl() throws for another origin, prefix, segment or query', () => {
  const root = new URL('https://osh.example/api/');
  const id = 'ds-fixture-1';
  const goodUrl = observationsLatestUrl(root, id);

  const otherOrigin = new URL(goodUrl.href);
  otherOrigin.host = 'attacker.example';
  assert.throws(() => assertObservationsLatestUrl(otherOrigin, root, id));

  assert.throws(() =>
    assertObservationsLatestUrl(
      new URL(`https://osh.example/other/datastreams/${id}/observations?${OSH_LATEST_QUERY}`),
      root,
      id,
    ),
  );
  assert.throws(() =>
    assertObservationsLatestUrl(
      new URL(`https://osh.example/api/datastreams/${id}/observations/extra?${OSH_LATEST_QUERY}`),
      root,
      id,
    ),
  );
  assert.throws(() =>
    assertObservationsLatestUrl(
      new URL(`https://osh.example/api/datastreams/${id}/observations?limit=1`),
      root,
      id,
    ),
  );
});
