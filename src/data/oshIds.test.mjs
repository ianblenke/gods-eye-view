import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OSH_ID_PATTERN,
  OSH_LATEST_LIMIT,
  OSH_LATEST_QUERY,
  OSH_LIVE_FORMAT,
  OSH_LIVE_QUERY,
  OSH_OBSERVATIONS_QUERY,
  OSH_SYSTEM_DATASTREAMS_QUERY,
  assertLiveUrl,
  assertObservationUrl,
  assertObservationsLatestUrl,
  assertSchemaUrl,
  assertSystemDatastreamsUrl,
  assertSystemUrl,
  liveUrl,
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

test('[osh-053] the schema and system URL pairs are the only functions the route can call — no argument replaces either', () => {
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

test('[osh-064] liveUrl() builds a ws URL for an http root and a wss URL for an https root', () => {
  const id = 'ds-fixture-1';
  for (const [rootText, protocol] of [
    ['http://osh.example/api/', 'ws:'],
    ['https://osh.example/api/', 'wss:'],
  ]) {
    const root = new URL(rootText);
    const url = liveUrl(root, id);
    assert.equal(url.protocol, protocol);
    assert.doesNotThrow(() => assertLiveUrl(url, root, id));
  }
});

test('[osh-064] liveUrl() keeps the host and the port of the root, and sets the fixed path and query', () => {
  const id = 'A_b-9';
  const root = new URL('http://osh.example:8080/prefix/api/');
  const url = liveUrl(root, id);
  assert.equal(url.host, 'osh.example:8080');
  assert.equal(url.pathname, `${root.pathname}datastreams/${id}/observations`);
  assert.equal(OSH_LIVE_FORMAT, 'application/om+json');
  assert.equal(url.search, `?${OSH_LIVE_QUERY}`);
  assert.equal(url.searchParams.get('f'), 'application/om+json');
  assert.equal(url.searchParams.size, 1);
  assert.equal(url.search, '?f=application%2Fom%2Bjson', 'the slash and the plus sign reach the server encoded');
  assert.equal(url.hash, '');
});

test('[osh-064] liveUrl() drops the credentials that the root holds', () => {
  const id = 'ds-fixture-1';
  const root = new URL('https://fixture-user:fixture-pass@osh.example/api/');
  const url = liveUrl(root, id);
  assert.equal(url.username, '');
  assert.equal(url.password, '');
  assert.doesNotThrow(() => assertLiveUrl(url, root, id));
});

test('[osh-064] assertLiveUrl() throws for another scheme, host, port, path, query, user name, password or fragment', () => {
  const id = 'ds-fixture-1';
  for (const rootText of ['http://osh.example/api/', 'https://osh.example/api/']) {
    const root = new URL(rootText);
    const good = liveUrl(root, id);
    const refuses = (label, change) => {
      const url = new URL(good.href);
      change(url);
      assert.throws(() => assertLiveUrl(url, root, id), /safety check/, `${rootText}: ${label}`);
    };
    refuses('another scheme', (url) => {
      url.protocol = root.protocol === 'https:' ? 'ws:' : 'wss:';
    });
    refuses('another host', (url) => {
      url.hostname = 'attacker.example';
    });
    refuses('another port', (url) => {
      url.port = '9999';
    });
    refuses('another prefix', (url) => {
      url.pathname = `/other/datastreams/${id}/observations`;
    });
    refuses('another datastream', (url) => {
      url.pathname = `${root.pathname}datastreams/ds-fixture-2/observations`;
    });
    refuses('an extra segment', (url) => {
      url.pathname = `${root.pathname}datastreams/${id}/observations/extra`;
    });
    refuses('another query', (url) => {
      url.search = 'limit=2';
    });
    refuses('an extra query key', (url) => {
      url.search = `${OSH_LIVE_QUERY}&limit=2`;
    });
    refuses('no query', (url) => {
      url.search = '';
    });
    refuses('a user name', (url) => {
      url.username = 'fixture-user';
    });
    refuses('a password', (url) => {
      url.password = 'fixture-pass';
    });
    refuses('a fragment', (url) => {
      url.hash = 'f';
    });
  }
});
