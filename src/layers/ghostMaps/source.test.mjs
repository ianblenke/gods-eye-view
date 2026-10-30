import test from 'node:test';
import assert from 'node:assert/strict';
import { createGhostMapsSource } from './source.js';

const response = (body, status = 200) => new Response(body, { status });

test('[ghostmaps-022] The source returns the catalog and passes its signal', async () => {
  const signal = new AbortController().signal;
  const calls = [];
  const source = createGhostMapsSource({
    fetchImpl: async (...args) => {
      calls.push(args);
      return response(
        '{"products":[{"id":"cip","version":"edition-a"},{"id":"kinetic-30d","version":"edition-b"}],"commit":"test"}',
      );
    },
  });
  assert.deepEqual(await source.getCatalog({ signal }), {
    products: [
      { id: 'cip', version: 'edition-a' },
      { id: 'kinetic-30d', version: 'edition-b' },
    ],
    commit: 'test',
  });
  assert.equal(calls[0][0], '/api/ghostmaps/catalog');
  assert.equal(calls[0][1].signal, signal);
});

for (const [name, body, status, message] of [
  ['an HTTP error', '{}', 503, /GhostMaps catalog unavailable \(HTTP 503\)/],
  ['null data', 'null', 200, /Malformed GhostMaps catalog/],
  ['absent products', '{}', 200, /Malformed GhostMaps catalog/],
  ['invalid products', '{"products":{}}', 200, /Malformed GhostMaps catalog/],
]) {
  test(`[ghostmaps-041] The source rejects a catalog with ${name}`, async () => {
    const source = createGhostMapsSource({
      fetchImpl: async () => response(body, status),
    });
    await assert.rejects(source.getCatalog(), message);
  });
}

test('[ghostmaps-023] The source encodes file values and returns bytes', async () => {
  const calls = [];
  const signal = new AbortController().signal;
  const source = createGhostMapsSource({
    fetchImpl: async (...args) => {
      calls.push(args);
      return response(new Uint8Array([4, 5, 6]));
    },
  });
  assert.deepEqual(
    await source.getFile('a/b', 'v ?#', { signal }),
    new Uint8Array([4, 5, 6]),
  );
  assert.equal(calls[0][0], '/api/ghostmaps/file/a%2Fb?v=v%20%3F%23');
  assert.equal(calls[0][1].signal, signal);
});

test('[ghostmaps-042] The source rejects a file response error', async () => {
  const source = createGhostMapsSource({
    fetchImpl: async () => response('', 502),
  });
  await assert.rejects(
    source.getFile('cip', 'a'),
    /GhostMaps file unavailable \(HTTP 502\)/,
  );
});

test('[ghostmaps-022 ghostmaps-023] The default source calls the global fetch helper', async (t) => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(url);
    return response(
      url.endsWith('/catalog')
        ? '{"products":[{"id":"border-crisis","version":"edition-c"}]}'
        : 'A',
    );
  });
  const source = createGhostMapsSource();
  assert.deepEqual(await source.getCatalog(), {
    products: [{ id: 'border-crisis', version: 'edition-c' }],
  });
  assert.deepEqual(await source.getFile('cip', 'a'), new Uint8Array([65]));
  assert.deepEqual(calls, [
    '/api/ghostmaps/catalog',
    '/api/ghostmaps/file/cip?v=a',
  ]);
});

for (const [code, expected] of [
  [0, 'connecting'],
  [1, 'open'],
  [2, 'closed'],
  [9, 'connecting'],
]) {
  test(`[ghostmaps-024] The stream reports the connection state for code ${code}`, () => {
    let events;
    class FakeEvents {
      readyState = code;
      constructor(url) {
        this.url = url;
        events = this;
      }
      addEventListener(name, listener) {
        this.name = name;
        this.listener = listener;
      }
      removeEventListener(name, listener) {
        assert.equal(name, 'catalog');
        assert.equal(listener, this.listener);
        this.removed = true;
      }
      close() {
        this.closed = true;
      }
    }
    const states = [];
    const catalogs = [];
    const source = createGhostMapsSource({ EventSourceImpl: FakeEvents });
    const stop = source.subscribe(
      (catalog) => catalogs.push(catalog),
      (state) => states.push(state),
    );
    assert.equal(events.url, '/api/ghostmaps/events');
    assert.equal(events.name, 'catalog');
    assert.deepEqual(states, [expected]);
    events.readyState = 1;
    events.onopen();
    events.readyState = 2;
    events.onerror();
    assert.deepEqual(states, [expected, 'open', 'closed']);
    for (const data of ['invalid', 'null', '{}', '{"products":{}}'])
      events.listener({ data });
    assert.deepEqual(catalogs, []);
    events.listener({
      data: '{"products":[{"id":"cip","version":"new-a"},{"id":"kinetic-30d","version":"new-b"}],"commit":"test"}',
    });
    assert.deepEqual(catalogs, [
      {
        products: [
          { id: 'cip', version: 'new-a' },
          { id: 'kinetic-30d', version: 'new-b' },
        ],
        commit: 'test',
      },
    ]);
    stop();
    assert.equal(events.removed, true);
    assert.equal(events.closed, true);
  });
}

test('[ghostmaps-053] An absent event source reports a closed stream', () => {
  const states = [];
  const source = createGhostMapsSource({ EventSourceImpl: null });
  source.subscribe(
    () => assert.fail('catalog'),
    (state) => states.push(state),
  )();
  source.subscribe(() => assert.fail('catalog'))();
  assert.deepEqual(states, ['closed']);
});

test('[ghostmaps-024] The stream accepts an absent state callback', () => {
  let events;
  class FakeEvents {
    readyState = 1;
    constructor() {
      events = this;
    }
    addEventListener(_name, listener) {
      this.listener = listener;
    }
    removeEventListener() {}
    close() {
      this.closed = true;
    }
  }
  const source = createGhostMapsSource({ EventSourceImpl: FakeEvents });
  const catalogs = [];
  const stop = source.subscribe((catalog) => catalogs.push(catalog));
  assert.doesNotThrow(() => events.onopen());
  events.listener({ data: '{"products":[{"id":"cip","version":"last"}]}' });
  assert.deepEqual(catalogs, [{ products: [{ id: 'cip', version: 'last' }] }]);
  stop();
  assert.equal(events.closed, true);
});
