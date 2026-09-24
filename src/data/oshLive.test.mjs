import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import http from 'node:http';
import { oshProxy } from '../../server/providers/osh.js';
import { oshOpenStream } from '../../server/providers/osh/get.js';
import { liveUrl } from '../../server/providers/osh/ids.js';
import {
  OSH_LIVE_MAX_FRAME_BYTES,
  createOshLiveHub,
} from '../../server/providers/osh/live.js';

const ROOT = new URL('https://osh.example/api/');
const DS = 'ds-fixture-1';
const START = Date.parse('2026-01-01T00:00:12Z');
const READER = {
  lat: ['location', 'lat'],
  lon: ['location', 'lon'],
  alt: ['location', 'h'],
  featureUid: null,
};
const FRAME = {
  phenomenonTime: '2026-01-01T00:00:10Z',
  resultTime: '2026-01-01T00:00:11Z',
  result: { location: { lat: 1.5, lon: 2.5, h: 3 }, speed: 4 },
};
const EXPECTED_OBSERVATION = {
  phenomenonTime: '2026-01-01T00:00:10Z',
  resultTime: '2026-01-01T00:00:11Z',
  rows: [
    { path: 'location.lat', value: 1.5 },
    { path: 'location.lon', value: 2.5 },
    { path: 'location.h', value: 3 },
    { path: 'speed', value: 4 },
  ],
  location: { lat: 1.5, lon: 2.5, alt: 3 },
  ageMs: 2000,
};
const SCHEMA = {
  resultSchema: {
    type: 'DataRecord',
    fields: [
      {
        type: 'Vector',
        name: 'location',
        coordinates: [
          { type: 'Quantity', name: 'lat', axisID: 'Lat', uom: { code: 'deg' } },
          { type: 'Quantity', name: 'lon', axisID: 'Lon', uom: { code: 'deg' } },
          { type: 'Quantity', name: 'h', axisID: 'h', uom: { code: 'm' } },
        ],
      },
    ],
  },
};
const SECRET_URL = 'https://osh.example/instance-fixture/';
const SECRET_USER = 'fixture-user';
const SECRET_PASS = 'fixture-pass';
const SECRET_TOKEN = Buffer.from(`${SECRET_USER}:${SECRET_PASS}`).toString('base64');

/** Fake timers: nothing runs until the test advances the clock. */
function fakeTimers() {
  let clock = 0;
  let nextId = 1;
  const pending = new Map();
  const add = (fn, ms, every) => {
    const id = nextId;
    nextId += 1;
    pending.set(id, { at: clock + ms, fn, every });
    return id;
  };
  return {
    api: {
      setTimeout: (fn, ms) => add(fn, ms, 0),
      setInterval: (fn, ms) => add(fn, ms, ms),
      clearTimeout: (id) => pending.delete(id),
      clearInterval: (id) => pending.delete(id),
    },
    advance(ms) {
      const end = clock + ms;
      for (;;) {
        let due = null;
        for (const [id, timer] of pending) {
          if (timer.at <= end && (!due || timer.at < due.timer.at)) due = { id, timer };
        }
        if (!due) break;
        clock = due.timer.at;
        if (due.timer.every) due.timer.at += due.timer.every;
        else pending.delete(due.id);
        due.timer.fn();
      }
      clock = end;
    },
    pending: () => pending.size,
    now: () => clock,
  };
}

/** A fake WebSocket constructor. It records each socket, and it never touches a network. */
function fakeSockets() {
  const state = { instances: [], failWith: null };
  class FakeSocket {
    constructor(url, options) {
      if (state.failWith) throw state.failWith;
      this.url = url;
      this.options = options;
      this.binaryType = 'blob';
      this.sent = [];
      this.closeCalls = 0;
      this.listeners = new Map();
      state.instances.push(this);
    }

    addEventListener(type, handler) {
      this.listeners.set(type, [...(this.listeners.get(type) || []), handler]);
    }

    send(data) {
      this.sent.push(data);
    }

    close() {
      this.closeCalls += 1;
    }

    emit(type, event = {}) {
      for (const handler of this.listeners.get(type) || []) handler(event);
    }
  }
  state.Impl = FakeSocket;
  return state;
}

function makeRig() {
  const timers = fakeTimers();
  const sockets = fakeSockets();
  const warnings = [];
  const hub = createOshLiveHub({
    WebSocketImpl: sockets.Impl,
    now: () => START + timers.now(),
    warn: (...args) => warnings.push(args.join(' ')),
    timers: timers.api,
  });
  return { hub, timers, sockets, warnings };
}

function fakeClient() {
  const client = {
    started: 0,
    chunks: [],
    ended: 0,
    start: () => {
      client.started += 1;
    },
    write: (text) => client.chunks.push(text),
    end: () => {
      client.ended += 1;
    },
  };
  return client;
}

function streamOf(id = DS, headers = {}) {
  return { url: liveUrl(ROOT, id), headers, reader: READER };
}

function eventsOf(client) {
  return client.chunks
    .filter((chunk) => chunk.startsWith('event: '))
    .map((chunk) => {
      const [head, body] = chunk.slice(0, -2).split('\n');
      return { name: head.slice('event: '.length), data: JSON.parse(body.slice('data: '.length)) };
    });
}

const namesOf = (client) => eventsOf(client).map((event) => event.name);
const binaryOf = (value) => new TextEncoder().encode(JSON.stringify(value)).buffer;

/** A JSON frame with a valid observation and exactly `bytes` bytes. */
function frameOfSize(bytes) {
  const shell = JSON.stringify({ ...FRAME, result: { pad: '' } });
  return { ...FRAME, result: { pad: 'x'.repeat(bytes - shell.length) } };
}

function jsonResponse(status, payload) {
  return new Response(payload === undefined ? null : JSON.stringify(payload), { status });
}

function upstreamFetch({ calls = [] } = {}) {
  return async (url, options) => {
    calls.push({ url: String(url), options });
    const { pathname } = new URL(String(url));
    if (pathname.endsWith('/systems')) return jsonResponse(200, { features: [] });
    if (pathname.endsWith('/schema')) return jsonResponse(200, SCHEMA);
    return jsonResponse(404);
  };
}

function fakeRes() {
  const res = new EventEmitter();
  Object.assign(res, {
    status: null,
    headers: null,
    body: undefined,
    chunks: [],
    ended: 0,
    flushed: 0,
    earlyWrites: 0,
    destroyed: false,
    writeHead(code, headers) {
      res.status = code;
      res.headers = headers;
    },
    flushHeaders() {
      res.flushed += 1;
    },
    write(text) {
      if (res.status === null) res.earlyWrites += 1;
      res.chunks.push(text);
      return true;
    },
    end(body) {
      res.ended += 1;
      res.body = body;
    },
    closeConnection() {
      res.destroyed = true;
      res.emit('close');
    },
  });
  return res;
}

/** Drive the live middleware once, like a real request. */
async function driveLive(proxy, { method = 'GET', url = `/live?datastream=${DS}`, res = fakeRes() } = {}) {
  let handler;
  proxy.configureServer({
    middlewares: {
      use(path, callback) {
        assert.equal(path, '/api/osh');
        handler = callback;
      },
    },
  });
  await handler({ method, url }, res);
  return res;
}

const jsonOf = (res) => JSON.parse(res.body);
const KEYED = { OSH_URL: 'https://osh.example/api/' };

test('[osh-063] the live route gives 503 with no_key when no key is set, and opens no socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const calls = [];
  const proxy = oshProxy({ env: {}, fetchImpl: upstreamFetch({ calls }), liveHub: rig.hub });
  const res = await driveLive(proxy);
  assert.equal(res.status, 503);
  assert.deepEqual(jsonOf(res), { error: 'no_key' });
  assert.equal(rig.sockets.instances.length, 0);
  assert.equal(calls.length, 0);
});

test('[osh-063] the live route gives 400 with bad_datastream for a bad id, and opens no socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const calls = [];
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch({ calls }), liveHub: rig.hub });
  for (const url of [
    '/live',
    '/live?datastream=',
    '/live?datastream=a%2Fb',
    '/live?datastream=a.b',
    '/live?datastream=ds-fixture-1&datastream=ds-fixture-2',
    `/live?datastream=${'a'.repeat(65)}`,
  ]) {
    const res = await driveLive(proxy, { url });
    assert.equal(res.status, 400, `${url} must be refused`);
    assert.deepEqual(jsonOf(res), { error: 'bad_datastream' });
  }
  assert.equal(rig.sockets.instances.length, 0);
  assert.equal(calls.length, 0);
});

test('[osh-063] the live route gives 405 with Allow GET for a wrong method, and opens no socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const calls = [];
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch({ calls }), liveHub: rig.hub });
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const res = await driveLive(proxy, { method });
    assert.equal(res.status, 405);
    assert.equal(res.headers.Allow, 'GET');
    assert.equal(res.flushed, 0);
  }
  assert.equal(rig.sockets.instances.length, 0);
  assert.equal(calls.length, 0);
});

test('[osh-012] the live route reports base_unresolved and auth_failed when no candidate root answers', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const missing = oshProxy({
    env: KEYED,
    fetchImpl: async () => jsonResponse(404),
    liveHub: rig.hub,
  });
  const notFound = await driveLive(missing);
  assert.equal(notFound.status, 502);
  assert.deepEqual(jsonOf(notFound), { error: 'base_unresolved' });
  const refused = oshProxy({
    env: KEYED,
    fetchImpl: async () => jsonResponse(401),
    liveHub: rig.hub,
  });
  const unauthorized = await driveLive(refused);
  assert.equal(unauthorized.status, 502);
  assert.deepEqual(jsonOf(unauthorized), { error: 'auth_failed' });
  assert.equal(rig.sockets.instances.length, 0);
});

test('[osh-064] the live route builds the URL with liveUrl() and checks it with assertLiveUrl()', () => {
  const source = readFileSync(new URL('../../server/providers/osh.js', import.meta.url), 'utf8');
  assert.match(
    source,
    /const target = liveUrl\(state\.root, id\);\s*assertLiveUrl\(target, state\.root, id\);/,
  );
  assert.match(source, /from '\.\/osh\/ids\.js'/);
});

test('[osh-065] the route opens one upstream socket with binaryType set to arraybuffer, and with the Basic header', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const proxy = oshProxy({
    env: { ...KEYED, OSH_USERNAME: SECRET_USER, OSH_PASSWORD: SECRET_PASS },
    fetchImpl: upstreamFetch(),
    liveHub: rig.hub,
  });
  const res = await driveLive(proxy);
  assert.equal(res.status, 200);
  assert.equal(rig.sockets.instances.length, 1);
  const [socket] = rig.sockets.instances;
  assert.equal(
    socket.url,
    'wss://osh.example/api/datastreams/ds-fixture-1/observations?f=application%2Fom%2Bjson',
  );
  assert.deepEqual(socket.options, { headers: { Authorization: `Basic ${SECRET_TOKEN}` } });
  assert.equal(socket.binaryType, 'arraybuffer');
  assert.deepEqual(socket.sent, []);
});

test('[osh-065] the handshake carries Authorization only when both credentials are set', async (t) => {
  const combos = [
    {},
    { OSH_USERNAME: SECRET_USER },
    { OSH_PASSWORD: SECRET_PASS },
    { OSH_USERNAME: SECRET_USER, OSH_PASSWORD: SECRET_PASS },
  ];
  for (const [index, extra] of combos.entries()) {
    const rig = makeRig();
    t.after(() => rig.hub.close());
    const proxy = oshProxy({
      env: { ...KEYED, ...extra },
      fetchImpl: upstreamFetch(),
      liveHub: rig.hub,
    });
    await driveLive(proxy);
    const { headers } = rig.sockets.instances[0].options;
    assert.equal(Object.hasOwn(headers, 'Authorization'), index === 3, `combo ${index}`);
  }
});

test('[osh-065] oshOpenStream() sets binaryType to arraybuffer, passes the headers and sends no message frame', () => {
  const sockets = fakeSockets();
  const url = liveUrl(ROOT, DS);
  const plain = oshOpenStream(sockets.Impl, url);
  assert.equal(plain.url, String(url));
  assert.deepEqual(plain.options, { headers: {} });
  assert.equal(plain.binaryType, 'arraybuffer');
  const headers = { Authorization: 'Basic fixture' };
  const keyed = oshOpenStream(sockets.Impl, url, { headers });
  assert.deepEqual(keyed.options, { headers });
  assert.equal(keyed.binaryType, 'arraybuffer');
  assert.deepEqual([plain.sent, keyed.sent], [[], []]);
  assert.equal(sockets.instances.length, 2);
});

test('[osh-066] a binary frame gives an observation event with the shape of osh-022 and the age of that moment', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  const [socket] = rig.sockets.instances;
  socket.emit('open');
  socket.emit('message', { data: binaryOf(FRAME) });
  rig.timers.advance(5000);
  socket.emit('message', { data: binaryOf(FRAME) });
  const events = eventsOf(client);
  assert.deepEqual(
    events.map((event) => event.name),
    ['open', 'observation', 'observation'],
  );
  assert.deepEqual(events[1].data, EXPECTED_OBSERVATION);
  assert.deepEqual(events[2].data, { ...EXPECTED_OBSERVATION, ageMs: 7000 });
  assert.equal(
    client.chunks[1],
    `event: observation\ndata: ${JSON.stringify(EXPECTED_OBSERVATION)}\n\n`,
  );
});

test('[osh-066] a text frame gives the same observation event', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  const [socket] = rig.sockets.instances;
  socket.emit('open');
  socket.emit('message', { data: JSON.stringify(FRAME) });
  const events = eventsOf(client);
  assert.deepEqual(
    events.map((event) => event.name),
    ['open', 'observation'],
  );
  assert.deepEqual(events[1].data, EXPECTED_OBSERVATION);
});

test('[osh-066] a frame of 65536 bytes or less that is not JSON or has no result gives no event, and the stream stays open', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  const [socket] = rig.sockets.instances;
  socket.emit('open');
  const noResult = { phenomenonTime: FRAME.phenomenonTime, resultTime: FRAME.resultTime };
  for (const data of [
    binaryOf('text'),
    new TextEncoder().encode('not json').buffer,
    'not json',
    '',
    'null',
    '"a string"',
    '5',
    '[]',
    JSON.stringify([FRAME]),
    JSON.stringify(noResult),
    binaryOf(noResult),
    JSON.stringify({ items: [FRAME] }),
  ]) {
    socket.emit('message', { data });
  }
  assert.deepEqual(namesOf(client), ['open']);
  assert.equal(socket.closeCalls, 0);
  assert.equal(client.ended, 0);
  socket.emit('message', { data: JSON.stringify(FRAME) });
  assert.deepEqual(namesOf(client), ['open', 'observation']);
});

test('[osh-066] a frame of exactly 65536 bytes is not too large', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  const [socket] = rig.sockets.instances;
  const frame = frameOfSize(OSH_LIVE_MAX_FRAME_BYTES);
  const data = binaryOf(frame);
  assert.equal(OSH_LIVE_MAX_FRAME_BYTES, 65536);
  assert.equal(data.byteLength, 65536);
  socket.emit('message', { data });
  socket.emit('message', { data: JSON.stringify(frame) });
  assert.deepEqual(namesOf(client), ['observation', 'observation']);
  assert.equal(socket.closeCalls, 0);
});

test('[osh-066] a frame of more than 65536 bytes that holds an observation closes the socket and sends the event unsupported', async (t) => {
  for (const [label, makeData] of [
    ['a binary frame', () => binaryOf(frameOfSize(65537))],
    ['a text frame', () => JSON.stringify(frameOfSize(65537))],
    [
      'a text frame of two-byte characters with fewer than 65536 characters',
      () => JSON.stringify({ ...FRAME, result: { pad: 'é'.repeat(32_800) } }),
    ],
  ]) {
    const rig = makeRig();
    t.after(() => rig.hub.close());
    const first = fakeClient();
    const second = fakeClient();
    rig.hub.join(DS, streamOf(), first);
    rig.hub.join(DS, streamOf(), second);
    const [socket] = rig.sockets.instances;
    socket.emit('open');
    socket.emit('message', { data: makeData() });
    for (const client of [first, second]) {
      assert.deepEqual(namesOf(client), ['open', 'unsupported'], label);
      assert.equal(client.chunks[1], 'event: unsupported\ndata: {}\n\n');
      assert.equal(client.ended, 1, label);
    }
    assert.equal(socket.closeCalls, 1, label);
    assert.equal(rig.timers.pending(), 0, label);
  }
});

test('[osh-066] a frame of more than 65536 bytes closes the socket and sends the event unsupported, with any content', async (t) => {
  const noResult = { phenomenonTime: FRAME.phenomenonTime, resultTime: FRAME.resultTime };
  for (const [label, makeData] of [
    ['a binary frame that is not JSON', () => new Uint8Array(65_537).fill(0xff).buffer],
    ['a text frame that is not JSON', () => 'x'.repeat(65_537)],
    ['a binary frame of JSON with no result', () => binaryOf({ ...noResult, pad: 'x'.repeat(65_537) })],
    ['a text frame of JSON with no result', () => JSON.stringify({ ...noResult, pad: 'x'.repeat(65_537) })],
    ['a text frame of a JSON array', () => JSON.stringify([FRAME, 'x'.repeat(65_537)])],
  ]) {
    const rig = makeRig();
    t.after(() => rig.hub.close());
    const client = fakeClient();
    rig.hub.join(DS, streamOf(), client);
    const [socket] = rig.sockets.instances;
    socket.emit('open');
    socket.emit('message', { data: makeData() });
    assert.deepEqual(namesOf(client), ['open', 'unsupported'], label);
    assert.equal(client.ended, 1, label);
    assert.equal(socket.closeCalls, 1, label);
    assert.equal(rig.timers.pending(), 0, label);
  }
});

test('[osh-066] the hub refuses the datastream for ten minutes after a frame that is too large', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  const joined = rig.hub.join(DS, streamOf(), client);
  rig.sockets.instances[0].emit('message', { data: binaryOf(frameOfSize(70_000)) });
  joined.leave();
  assert.equal(rig.timers.pending(), 0);
  const other = fakeClient();
  assert.equal(rig.hub.join('ds-fixture-2', streamOf('ds-fixture-2'), other).error, undefined);
  rig.timers.advance(10 * 60_000 - 1);
  const refused = fakeClient();
  assert.deepEqual(rig.hub.join(DS, streamOf(), refused), { error: 'live_unsupported' });
  assert.equal(refused.started, 0);
  assert.equal(rig.sockets.instances.length, 2);
  rig.timers.advance(1);
  const again = fakeClient();
  assert.equal(typeof rig.hub.join(DS, streamOf(), again).leave, 'function');
  assert.equal(again.started, 1);
  assert.equal(rig.sockets.instances.length, 3);
});

test('[osh-066] the route gives 503 with live_unsupported after a frame that is too large', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch(), liveHub: rig.hub });
  const first = await driveLive(proxy);
  assert.equal(first.status, 200);
  rig.sockets.instances[0].emit('message', { data: binaryOf(frameOfSize(70_000)) });
  assert.deepEqual(first.chunks, ['event: unsupported\ndata: {}\n\n']);
  assert.equal(first.ended, 1);
  first.closeConnection();
  const second = await driveLive(proxy);
  assert.equal(second.status, 503);
  assert.deepEqual(jsonOf(second), { error: 'live_unsupported' });
  assert.equal(second.flushed, 0);
  assert.equal(rig.sockets.instances.length, 1);
  assert.equal(rig.timers.pending(), 0);
});

test('[osh-067] two clients share one upstream socket and both receive each frame', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const first = fakeClient();
  const second = fakeClient();
  rig.hub.join(DS, streamOf(), first);
  const [socket] = rig.sockets.instances;
  socket.emit('open');
  rig.hub.join(DS, streamOf(), second);
  socket.emit('message', { data: binaryOf(FRAME) });
  assert.equal(rig.sockets.instances.length, 1);
  assert.equal(first.chunks[0], 'event: open\ndata: {}\n\n');
  assert.equal(second.chunks[0], 'event: open\ndata: {}\n\n');
  assert.deepEqual(namesOf(first), ['open', 'observation']);
  assert.deepEqual(eventsOf(second), eventsOf(first));
  assert.equal(first.started + second.started, 2);
});

test('[osh-067] the socket closes two seconds after the last client leaves', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const first = rig.hub.join(DS, streamOf(), fakeClient());
  const second = rig.hub.join(DS, streamOf(), fakeClient());
  const [socket] = rig.sockets.instances;
  first.leave();
  first.leave();
  rig.timers.advance(10_000);
  assert.equal(socket.closeCalls, 0, 'one client still listens');
  second.leave();
  assert.equal(socket.closeCalls, 0, 'the socket stays at once');
  rig.timers.advance(1999);
  assert.equal(socket.closeCalls, 0);
  rig.timers.advance(1);
  assert.equal(socket.closeCalls, 1);
  assert.equal(rig.timers.pending(), 0);
});

test('[osh-067] a client that joins within the two seconds keeps the same socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const first = rig.hub.join(DS, streamOf(), fakeClient());
  const [socket] = rig.sockets.instances;
  first.leave();
  rig.timers.advance(1999);
  const late = fakeClient();
  const second = rig.hub.join(DS, streamOf(), late);
  rig.timers.advance(60_000);
  assert.equal(rig.sockets.instances.length, 1);
  assert.equal(socket.closeCalls, 0);
  socket.emit('message', { data: binaryOf(FRAME) });
  assert.deepEqual(namesOf(late), ['observation']);
  second.leave();
  rig.timers.advance(2000);
  assert.equal(socket.closeCalls, 1);
  const again = fakeClient();
  rig.hub.join(DS, streamOf(), again);
  assert.equal(rig.sockets.instances.length, 2, 'a new socket after the old one closed');
});

test('[osh-067] the route removes the client when the connection closes', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch(), liveHub: rig.hub });
  const res = await driveLive(proxy);
  assert.equal(res.status, 200);
  assert.equal(res.flushed, 1);
  assert.deepEqual(res.headers, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Accel-Buffering': 'no',
  });
  const [socket] = rig.sockets.instances;
  rig.timers.advance(20_000);
  assert.deepEqual(res.chunks, [': hb\n\n']);
  res.closeConnection();
  rig.timers.advance(1999);
  assert.equal(socket.closeCalls, 0);
  rig.timers.advance(1);
  assert.equal(socket.closeCalls, 1);
  assert.equal(rig.timers.pending(), 0);
});

test('[osh-067] a client that leaves while the route reads the schema opens no socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch(), liveHub: rig.hub });
  const res = fakeRes();
  res.destroyed = true;
  await driveLive(proxy, { res });
  assert.equal(res.status, null);
  assert.equal(res.flushed, 0);
  assert.equal(rig.sockets.instances.length, 0);
  assert.equal(rig.timers.pending(), 0);
});

test('[osh-068] a client for a ninth datastream gets live_busy, and the hub opens no socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const joined = [];
  for (let index = 1; index <= 8; index += 1) {
    const id = `ds-fixture-${index}`;
    joined.push(rig.hub.join(id, streamOf(id), fakeClient()));
  }
  assert.equal(rig.sockets.instances.length, 8);
  const ninth = fakeClient();
  assert.deepEqual(rig.hub.join('ds-fixture-9', streamOf('ds-fixture-9'), ninth), {
    error: 'live_busy',
  });
  assert.equal(ninth.started, 0);
  assert.equal(rig.sockets.instances.length, 8);
  const extra = rig.hub.join('ds-fixture-8', streamOf('ds-fixture-8'), fakeClient());
  assert.equal(typeof extra.leave, 'function', 'a datastream that holds a socket still takes clients');
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch(), liveHub: rig.hub });
  const res = await driveLive(proxy, { url: '/live?datastream=ds-fixture-9' });
  assert.equal(res.status, 503);
  assert.deepEqual(jsonOf(res), { error: 'live_busy' });
  assert.equal(rig.sockets.instances.length, 8);
  joined[0].leave();
  rig.timers.advance(2000);
  const later = rig.hub.join('ds-fixture-9', streamOf('ds-fixture-9'), fakeClient());
  assert.equal(typeof later.leave, 'function', 'a closed socket frees its place');
  assert.equal(rig.sockets.instances.length, 9);
});

test('[osh-068] a seventeenth client for one datastream gets live_busy, and the hub opens no socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const joined = [];
  for (let index = 1; index <= 16; index += 1) joined.push(rig.hub.join(DS, streamOf(), fakeClient()));
  assert.equal(rig.sockets.instances.length, 1);
  const seventeenth = fakeClient();
  assert.deepEqual(rig.hub.join(DS, streamOf(), seventeenth), { error: 'live_busy' });
  assert.equal(seventeenth.started, 0);
  assert.equal(rig.sockets.instances.length, 1);
  const other = rig.hub.join('ds-fixture-2', streamOf('ds-fixture-2'), fakeClient());
  assert.equal(typeof other.leave, 'function', 'a full datastream does not block another one');
  joined[0].leave();
  const replacement = rig.hub.join(DS, streamOf(), fakeClient());
  assert.equal(typeof replacement.leave, 'function', 'a client that left frees its place');
  assert.deepEqual(rig.hub.join(DS, streamOf(), fakeClient()), { error: 'live_busy' });
});

test('[osh-068] a datastream keeps its place until two seconds after its last client leaves', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const joined = [];
  for (let index = 1; index <= 8; index += 1) {
    const id = `ds-fixture-${index}`;
    joined.push(rig.hub.join(id, streamOf(id), fakeClient()));
  }
  joined[0].leave();
  rig.timers.advance(1999);
  assert.deepEqual(rig.hub.join('ds-fixture-9', streamOf('ds-fixture-9'), fakeClient()), { error: 'live_busy' });
  rig.timers.advance(1);
  assert.equal(typeof rig.hub.join('ds-fixture-9', streamOf('ds-fixture-9'), fakeClient()).leave, 'function');
  assert.equal(rig.sockets.instances.length, 9);
});

test('[osh-068] a datastream keeps its place while its socket waits to try again', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  for (let index = 1; index <= 8; index += 1) {
    const id = `ds-fixture-${index}`;
    rig.hub.join(id, streamOf(id), fakeClient());
  }
  for (const socket of rig.sockets.instances) socket.emit('close', { code: 1006 });
  const ninth = fakeClient();
  assert.deepEqual(rig.hub.join('ds-fixture-9', streamOf('ds-fixture-9'), ninth), { error: 'live_busy' });
  assert.equal(ninth.started, 0);
  assert.equal(rig.sockets.instances.length, 8);
});

test('[osh-069] the client receives open each time the socket opens, and down each time it closes', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  rig.sockets.instances[0].emit('open');
  rig.sockets.instances[0].emit('close', { code: 1006 });
  rig.timers.advance(1000);
  rig.sockets.instances[1].emit('open');
  assert.deepEqual(namesOf(client), ['open', 'down', 'open']);
  assert.equal(client.chunks[1], 'event: down\ndata: {}\n\n');
  assert.deepEqual(eventsOf(client).map((event) => event.data), [{}, {}, {}]);
  rig.sockets.instances[1].emit('close', { code: 1000 });
  assert.deepEqual(namesOf(client), ['open', 'down', 'open', 'down']);
});

test('[osh-069] a client that joins an open socket gets the event open at once', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  rig.hub.join(DS, streamOf(), fakeClient());
  const [socket] = rig.sockets.instances;
  const beforeOpen = fakeClient();
  rig.hub.join(DS, streamOf(), beforeOpen);
  assert.deepEqual(beforeOpen.chunks, [], 'the socket is not open yet');
  socket.emit('open');
  const late = fakeClient();
  rig.hub.join(DS, streamOf(), late);
  assert.equal(late.started, 1);
  assert.deepEqual(late.chunks, ['event: open\ndata: {}\n\n']);
  socket.emit('close', { code: 1006 });
  const afterDown = fakeClient();
  rig.hub.join(DS, streamOf(), afterDown);
  assert.deepEqual(afterDown.chunks, [], 'the socket is down, so the client gets no open');
  assert.deepEqual(namesOf(beforeOpen), ['open', 'down']);
  assert.equal(rig.sockets.instances.length, 1);
});

test('[osh-069] the route writes the response head before the event open of a client that joins an open socket', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch(), liveHub: rig.hub });
  const first = await driveLive(proxy);
  rig.sockets.instances[0].emit('open');
  const second = await driveLive(proxy);
  assert.equal(rig.sockets.instances.length, 1);
  assert.equal(second.status, 200);
  assert.equal(second.flushed, 1);
  assert.equal(second.earlyWrites, 0, 'the head comes before the first event');
  assert.deepEqual(second.chunks, ['event: open\ndata: {}\n\n']);
  assert.deepEqual(first.chunks, ['event: open\ndata: {}\n\n']);
});

test('[osh-069] an error event and a close event of one socket give one down event', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  const [socket] = rig.sockets.instances;
  socket.emit('open');
  socket.emit('error', { message: 'fixture failure' });
  socket.emit('close', { code: 1006 });
  assert.deepEqual(namesOf(client), ['open', 'down']);
  rig.timers.advance(1000);
  assert.equal(rig.sockets.instances.length, 2);
  rig.timers.advance(60_000);
  assert.equal(rig.sockets.instances.length, 2, 'the new socket stays open, so no more attempts');
  assert.deepEqual(rig.warnings, [
    '[osh-live] upstream socket ended, code 0',
  ]);
});

test('[osh-069] the delays before a new socket are 1, 2, 4, 8, 16 and 30 seconds', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  rig.hub.join(DS, streamOf(), client);
  for (const [index, seconds] of [1, 2, 4, 8, 16, 30, 30, 30].entries()) {
    assert.equal(rig.sockets.instances.length, index + 1);
    rig.sockets.instances[index].emit('close', { code: 1006 });
    rig.timers.advance(seconds * 1000 - 1);
    assert.equal(rig.sockets.instances.length, index + 1, `no socket before ${seconds} s`);
    rig.timers.advance(1);
    assert.equal(rig.sockets.instances.length, index + 2, `a socket after ${seconds} s`);
  }
  assert.deepEqual(namesOf(client), Array(8).fill('down'));
});

test('[osh-069] a socket that stays open for 30 seconds resets the delay', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  rig.hub.join(DS, streamOf(), fakeClient());
  let count = 1;
  const fail = (seconds) => {
    rig.sockets.instances[count - 1].emit('close', { code: 1006 });
    rig.timers.advance(seconds * 1000 - 1);
    assert.equal(rig.sockets.instances.length, count, `no socket before ${seconds} s`);
    rig.timers.advance(1);
    count += 1;
    assert.equal(rig.sockets.instances.length, count, `a socket after ${seconds} s`);
  };
  fail(1);
  fail(2);
  fail(4);
  rig.sockets.instances[3].emit('open');
  rig.timers.advance(29_999);
  fail(8);
  rig.sockets.instances[4].emit('open');
  rig.timers.advance(30_000);
  fail(1);
  fail(2);
});

test('[osh-069] the hub clears the timer of the next socket when it removes the entry after the last client leaves', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const joined = rig.hub.join(DS, streamOf(), fakeClient());
  for (const seconds of [1, 2]) {
    rig.sockets.instances.at(-1).emit('close', { code: 1006 });
    rig.timers.advance(seconds * 1000);
  }
  assert.equal(rig.sockets.instances.length, 3);
  rig.sockets.instances[2].emit('close', { code: 1006 });
  joined.leave();
  rig.timers.advance(2000);
  assert.equal(rig.timers.pending(), 0, 'the entry cleared the retry of 4 seconds');
  rig.timers.advance(60_000);
  assert.equal(rig.sockets.instances.length, 3, 'no socket opens for a dropped entry');
  rig.hub.join(DS, streamOf(), fakeClient());
  assert.equal(rig.sockets.instances.length, 4, 'a new client starts a new socket');
});

test('[osh-069] a socket that closes less than 30 seconds after it opens leaves no timer that resets the delay', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  rig.hub.join(DS, streamOf(), fakeClient());
  rig.sockets.instances[0].emit('open');
  rig.timers.advance(10_000);
  rig.sockets.instances[0].emit('close', { code: 1006 });
  rig.timers.advance(1000);
  rig.sockets.instances[1].emit('close', { code: 1006 });
  rig.timers.advance(2000);
  assert.equal(rig.sockets.instances.length, 3);
  rig.timers.advance(18_000);
  rig.sockets.instances[2].emit('close', { code: 1006 });
  rig.timers.advance(3999);
  assert.equal(rig.sockets.instances.length, 3, 'the delay is 4 seconds, and not 1 second');
  rig.timers.advance(1);
  assert.equal(rig.sockets.instances.length, 4);
});

test('[osh-069] the response carries a heartbeat comment every 20 seconds', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  const joined = rig.hub.join(DS, streamOf(), client);
  const other = fakeClient();
  rig.hub.join(DS, streamOf(), other);
  rig.timers.advance(19_999);
  assert.deepEqual(client.chunks, []);
  rig.timers.advance(1);
  assert.deepEqual(client.chunks, [': hb\n\n']);
  rig.timers.advance(40_000);
  assert.deepEqual(client.chunks, Array(3).fill(': hb\n\n'));
  joined.leave();
  rig.timers.advance(60_000);
  assert.equal(client.chunks.length, 3, 'a client that left gets no more heartbeat');
  assert.equal(other.chunks.length, 6);
});

test('[osh-069] the hub does not open a new socket after a socket closes while no client listens', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const joined = rig.hub.join(DS, streamOf(), fakeClient());
  const [socket] = rig.sockets.instances;
  socket.emit('open');
  joined.leave();
  socket.emit('close', { code: 1006 });
  assert.equal(rig.timers.pending(), 0);
  rig.timers.advance(120_000);
  assert.equal(rig.sockets.instances.length, 1);
  assert.equal(socket.closeCalls, 0);
  rig.hub.join(DS, streamOf(), fakeClient());
  assert.equal(rig.sockets.instances.length, 2, 'a new client starts a new socket');
});

test('[osh-069] a constructor that throws gives the event down and a new attempt', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  rig.sockets.failWith = new Error('fixture failure');
  const client = fakeClient();
  const joined = rig.hub.join(DS, streamOf(), client);
  assert.equal(typeof joined.leave, 'function');
  assert.deepEqual(namesOf(client), ['down']);
  assert.equal(rig.sockets.instances.length, 0);
  rig.timers.advance(1000);
  assert.deepEqual(namesOf(client), ['down', 'down']);
  rig.sockets.failWith = null;
  rig.timers.advance(2000);
  assert.equal(rig.sockets.instances.length, 1);
  rig.sockets.instances[0].emit('open');
  assert.deepEqual(namesOf(client), ['down', 'down', 'open']);
});

test('[osh-069] an event of a socket that the entry no longer holds changes nothing', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const client = fakeClient();
  const joined = rig.hub.join(DS, streamOf(), client);
  const [old] = rig.sockets.instances;
  old.emit('close', { code: 1006 });
  rig.timers.advance(1000);
  const [, current] = rig.sockets.instances;
  current.emit('open');
  const before = namesOf(client);
  assert.deepEqual(before, ['down', 'open']);
  old.emit('message', { data: binaryOf(FRAME) });
  old.emit('open');
  old.emit('close', { code: 1006 });
  old.emit('error');
  assert.deepEqual(namesOf(client), before);
  rig.timers.advance(60_000);
  assert.equal(rig.sockets.instances.length, 2);
  joined.leave();
  rig.timers.advance(2000);
  assert.equal(current.closeCalls, 1);
  current.emit('message', { data: binaryOf(FRAME) });
  assert.deepEqual(namesOf(client), before);
});

test('[osh-070] no event, header or log line holds the URL, the user name or the password after a failure', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const warnings = [];
  const proxy = oshProxy({
    env: { OSH_URL: SECRET_URL, OSH_USERNAME: SECRET_USER, OSH_PASSWORD: SECRET_PASS },
    fetchImpl: upstreamFetch(),
    warn: (...args) => warnings.push(args.join(' ')),
    liveHub: rig.hub,
  });
  const res = await driveLive(proxy);
  assert.equal(res.status, 200);
  const [socket] = rig.sockets.instances;
  const leaked = `connect failed for ${socket.url} as ${SECRET_USER}:${SECRET_PASS}`;
  socket.emit('open');
  socket.emit('error', { message: leaked, error: new Error(leaked) });
  socket.emit('close', { code: 1006, reason: leaked });
  rig.sockets.failWith = new Error(leaked);
  rig.timers.advance(1000);
  rig.sockets.failWith = null;
  rig.timers.advance(2000);
  rig.sockets.instances[1].emit('close', { code: 1011, reason: leaked });
  const bad = await driveLive(proxy, { url: '/live?datastream=a%2Fb' });
  const texts = [
    ...res.chunks,
    ...Object.entries(res.headers).flat(),
    ...rig.warnings,
    ...warnings,
    bad.body,
  ];
  assert.deepEqual(namesOf({ chunks: res.chunks }), ['open', 'down', 'down', 'down']);
  assert.ok(rig.warnings.length >= 3, 'the failures wrote a log line');
  assert.ok(rig.warnings.every((line) => line.startsWith('[osh-live] ')));
  for (const text of texts) {
    for (const secret of [SECRET_USER, SECRET_PASS, SECRET_TOKEN, 'osh.example', 'instance-fixture']) {
      assert.equal(String(text).includes(secret), false, `${secret} must not appear in: ${text}`);
    }
  }
});

test('[osh-075] the hub ends each client, clears each timer and closes each open socket when it closes', async (t) => {
  const rig = makeRig();
  t.after(() => rig.hub.close());
  const first = fakeClient();
  const second = fakeClient();
  const third = fakeClient();
  rig.hub.join(DS, streamOf(), first);
  rig.hub.join(DS, streamOf(), second);
  rig.hub.join('ds-fixture-2', streamOf('ds-fixture-2'), third);
  const [open, waiting] = rig.sockets.instances;
  open.emit('open');
  waiting.emit('close', { code: 1006 });
  assert.ok(rig.timers.pending() >= 4, 'heartbeats, one stable timer and one retry wait');
  rig.hub.close();
  for (const client of [first, second, third]) assert.equal(client.ended, 1);
  assert.equal(open.closeCalls, 1);
  assert.equal(waiting.closeCalls, 0, 'a socket that already closed is not closed again');
  assert.equal(rig.timers.pending(), 0);
  rig.timers.advance(120_000);
  assert.equal(rig.sockets.instances.length, 2, 'no new socket opens');
  assert.equal(first.chunks.length, 1, 'no heartbeat after the close');
});

test('[osh-075] the provider closes the hub when the HTTP server closes', async (t) => {
  for (const hook of ['configureServer', 'configurePreviewServer']) {
    const rig = makeRig();
    t.after(() => rig.hub.close());
    const proxy = oshProxy({ env: KEYED, fetchImpl: upstreamFetch(), liveHub: rig.hub });
    const httpServer = new EventEmitter();
    let handler;
    proxy[hook]({
      httpServer,
      middlewares: {
        use(path, callback) {
          handler = callback;
        },
      },
    });
    const res = fakeRes();
    await handler({ method: 'GET', url: `/live?datastream=${DS}` }, res);
    rig.sockets.instances[0].emit('open');
    assert.equal(res.ended, 0, hook);
    httpServer.emit('close');
    assert.equal(res.ended, 1, hook);
    assert.equal(rig.sockets.instances[0].closeCalls, 1, hook);
    assert.equal(rig.timers.pending(), 0, hook);
  }
});

// The end-to-end tests below use a hand-made server on the loopback address.
// It answers the probe and the schema over HTTP, accepts one WebSocket
// upgrade, sends the frames of the test, and records the method and the
// headers of the handshake and the opcode of each frame that the client sends.

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function wsFrame(opcode, payload) {
  let head;
  if (payload.length < 126) {
    head = Buffer.from([0x80 | opcode, payload.length]);
  } else if (payload.length < 65_536) {
    head = Buffer.from([0x80 | opcode, 126, payload.length >> 8, payload.length & 255]);
  } else {
    head = Buffer.alloc(10);
    head[0] = 0x80 | opcode;
    head[1] = 127;
    head.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  return Buffer.concat([head, payload]);
}

/** The opcodes of the masked frames in one chunk. Each frame of these tests has a payload under 126 bytes. */
function opcodesOf(chunk) {
  const opcodes = [];
  for (let at = 0; at < chunk.length; at += 6 + (chunk[at + 1] & 0x7f)) opcodes.push(chunk[at] & 0x0f);
  return opcodes;
}

async function startUpstream(t, { frames = [] } = {}) {
  const seen = { handshakes: [], requests: [], clientOpcodes: [], closeFrameAt: 0 };
  const waiters = [];
  const upgraded = new Set();
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    seen.requests.push({ method: req.method, pathname });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Connection', 'close');
    if (pathname === '/api/systems') {
      res.end(JSON.stringify({ features: [] }));
    } else if (pathname === `/api/datastreams/${DS}/schema`) {
      res.end(JSON.stringify(SCHEMA));
    } else {
      res.statusCode = 404;
      res.end('{}');
    }
  });
  server.on('upgrade', (req, socket) => {
    upgraded.add(socket);
    socket.on('error', () => {});
    socket.on('close', () => upgraded.delete(socket));
    seen.handshakes.push({ method: req.method, url: req.url, headers: req.headers });
    const accept = crypto
      .createHash('sha1')
      .update(req.headers['sec-websocket-key'] + WS_GUID)
      .digest('base64');
    socket.write(
      [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${accept}`,
        '',
        '',
      ].join('\r\n'),
    );
    socket.on('data', (chunk) => {
      const opcodes = opcodesOf(chunk);
      if (opcodes.includes(8) && !seen.closeFrameAt) seen.closeFrameAt = Date.now();
      seen.clientOpcodes.push(...opcodes);
      for (const waiter of [...waiters]) {
        if (seen.clientOpcodes.length >= waiter.count) {
          waiters.splice(waiters.indexOf(waiter), 1);
          waiter.done();
        }
      }
    });
    for (const frame of frames) socket.write(frame);
  });
  // Bind IPv4 only: in the Node 24 image, `localhost` binds ::1 and a `localhost` client then fails.
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    for (const socket of upgraded) socket.destroy();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  return {
    seen,
    port: server.address().port,
    /** Resolve when the client has sent `count` frames. */
    clientFrames: (count) =>
      new Promise((resolve, reject) => {
        if (seen.clientOpcodes.length >= count) {
          resolve();
          return;
        }
        const timer = setTimeout(() => reject(new Error('the client sent no frame in time')), 8000);
        waiters.push({
          count,
          done: () => {
            clearTimeout(timer);
            resolve();
          },
        });
      }),
  };
}

/** Serve the provider middleware on a real HTTP server, with a hub that uses the real WebSocket. */
async function startProvider(t, upstream, env) {
  const hub = createOshLiveHub({ warn: () => {} });
  const proxy = oshProxy({
    env: { OSH_URL: `http://localhost:${upstream.port}/api/`, ...env },
    liveHub: hub,
  });
  let handler;
  proxy.configureServer({
    middlewares: {
      use(_path, callback) {
        handler = callback;
      },
    },
  });
  const server = http.createServer((req, res) => {
    req.url = req.url.slice('/api/osh'.length);
    handler(req, res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    hub.close();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  return { port: server.address().port };
}

/** Read the event stream of the live route until `done(text)` is true, or the response ends. */
function readStream(port, done) {
  return new Promise((resolve, reject) => {
    const request = http.get(
      { host: 'localhost', port, path: `/api/osh/live?datastream=${DS}`, agent: false },
      (response) => {
        let text = '';
        const timer = setTimeout(() => {
          request.destroy();
          reject(new Error(`the stream did not deliver the events in time: ${text}`));
        }, 8000);
        const finish = () => {
          clearTimeout(timer);
          resolve({ request, response, text });
        };
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          text += chunk;
          if (done(text)) finish();
        });
        response.on('end', finish);
        response.on('error', () => {});
      },
    );
    request.on('error', reject);
  });
}

const parseWire = (text) =>
  text
    .split('\n\n')
    .filter((part) => part.startsWith('event: '))
    .map((part) => {
      const [head, body] = part.split('\n');
      return { name: head.slice('event: '.length), data: JSON.parse(body.slice('data: '.length)) };
    });

const OBSERVATION_WITHOUT_AGE = { ...EXPECTED_OBSERVATION };
delete OBSERVATION_WITHOUT_AGE.ageMs;

test('[osh-065 osh-066 osh-067] a loopback server sees a GET handshake and no message frame, the route relays frames, and the socket closes after the client leaves', async (t) => {
  const frames = [
    wsFrame(9, Buffer.from('ping')),
    wsFrame(2, Buffer.from(JSON.stringify(FRAME))),
    wsFrame(1, Buffer.from(JSON.stringify(FRAME))),
    wsFrame(2, Buffer.from('not json')),
    wsFrame(2, Buffer.from(JSON.stringify({ phenomenonTime: FRAME.phenomenonTime }))),
  ];
  const upstream = await startUpstream(t, { frames });
  const provider = await startProvider(t, upstream, {
    OSH_USERNAME: SECRET_USER,
    OSH_PASSWORD: SECRET_PASS,
  });
  const { request, response, text } = await readStream(
    provider.port,
    (received) => received.split('event: observation').length > 2,
  );
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], 'text/event-stream; charset=utf-8');
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(response.headers['x-accel-buffering'], 'no');
  const events = parseWire(text);
  assert.deepEqual(
    events.map((event) => event.name),
    ['open', 'observation', 'observation'],
  );
  assert.deepEqual(events[0].data, {});
  for (const event of events.slice(1)) {
    const { ageMs, ...observation } = event.data;
    assert.deepEqual(observation, OBSERVATION_WITHOUT_AGE);
    assert.equal(typeof ageMs, 'number');
  }
  assert.equal(upstream.seen.handshakes.length, 1);
  const [handshake] = upstream.seen.handshakes;
  assert.equal(handshake.method, 'GET');
  assert.equal(handshake.headers.upgrade.toLowerCase(), 'websocket');
  assert.equal(handshake.headers.authorization, `Basic ${SECRET_TOKEN}`);
  assert.equal(handshake.url, `/api/datastreams/${DS}/observations?f=application%2Fom%2Bjson`);
  assert.ok(upstream.seen.requests.every((seen) => seen.method === 'GET'));
  await upstream.clientFrames(1);
  assert.deepEqual(upstream.seen.clientOpcodes, [10], 'the runtime answered the ping with a pong, and no message frame followed');
  const left = Date.now();
  request.destroy();
  await upstream.clientFrames(2);
  const waited = upstream.seen.closeFrameAt - left;
  assert.ok(waited >= 1900, `the socket closed after ${waited} ms, too early`);
  assert.ok(waited < 6000, `the socket closed after ${waited} ms, too late`);
  assert.deepEqual(upstream.seen.clientOpcodes, [10, 8], 'the frames are the pong and the close frame, and both are control frames');
});

test('[osh-066] a loopback server sends a frame of 70000 bytes, and the route gives unsupported and ends the stream', async (t) => {
  const frames = [
    wsFrame(2, Buffer.from(JSON.stringify(FRAME))),
    wsFrame(2, Buffer.from(JSON.stringify(frameOfSize(70_000)))),
  ];
  const upstream = await startUpstream(t, { frames });
  const provider = await startProvider(t, upstream, {});
  const { text } = await readStream(provider.port, () => false);
  assert.deepEqual(
    parseWire(text).map((event) => event.name),
    ['open', 'observation', 'unsupported'],
  );
  await upstream.clientFrames(1);
  assert.deepEqual(upstream.seen.clientOpcodes, [8]);
  assert.equal(upstream.seen.handshakes[0].headers.authorization, undefined);
});
