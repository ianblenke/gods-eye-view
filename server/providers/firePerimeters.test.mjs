import test from 'node:test';
import assert from 'node:assert/strict';
import { firePerimetersProxy } from './firePerimeters.js';
import '../../src/data/firePerimetersProxy.test.mjs';

function route(fetchImpl) {
  let handler;
  const plugin = firePerimetersProxy({ fetchImpl });
  assert.equal(plugin.name, 'fire-perimeters');
  plugin.configureServer({
    middlewares: {
      use(path, callback) {
        assert.equal(path, '/api/fire-perimeters');
        handler = callback;
      },
    },
  });
  return async (url, peer = 'test', method = 'GET') => {
    const reply = {
      writeHead(status, headers) {
        this.status = status;
        this.headers = headers;
      },
      end(body) {
        this.body = JSON.parse(body);
      },
    };
    await handler({ method, url, socket: { remoteAddress: peer } }, reply);
    return reply;
  };
}

test('[perimeters-017] a zero length page stops the feed request', async () => {
  let calls = 0;
  const request = route(async () => {
    calls++;
    return Response.json({ features: [], exceededTransferLimit: true });
  });
  const reply = await request('/');
  assert.equal(reply.status, 200);
  assert.deepEqual(reply.body.rows, []);
  assert.equal(calls, 1);
});

test('[perimeters-018] the index rejects a bad list', async () => {
  const request = route(async () => Response.json({ rows: [] }));
  const reply = await request('/inciweb/index');
  assert.equal(reply.status, 502);
  assert.deepEqual(reply.body, { error: 'fire_perimeters_unavailable' });
});

test('[perimeters-019] a failed feed cancels its body', async () => {
  let cancelCount = 0;
  const request = route(async () => ({
    ok: false,
    body: { cancel: async () => { cancelCount++; } },
  }));
  const reply = await request('/');
  assert.equal(reply.status, 502);
  assert.equal(cancelCount, 1);
});

test('[perimeters-019] a failed page cancels its body', async () => {
  let cancelCount = 0;
  const request = route(async () => ({
    status: 503,
    body: { cancel: async () => { cancelCount++; } },
  }));
  const reply = await request('/inciweb/publication/4');
  assert.equal(reply.status, 502);
  assert.equal(cancelCount, 1);
});

test('[perimeters-017] the proxy uses the host fetch by default', async () => {
  const oldFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ features: [] }); };
  try {
    let handler;
    firePerimetersProxy().configureServer({ middlewares: { use(_path, value) { handler = value; } } });
    const reply = { writeHead(status) { this.status = status; }, end(body) { this.body = JSON.parse(body); } };
    await handler({ method: 'GET', url: '/', socket: {} }, reply);
    assert.equal(reply.status, 200);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = oldFetch; }
});

test('[perimeters-017] a property can mark a page limit', async () => {
  let calls = 0;
  const request = route(async () => { calls++; return Response.json({ features: [], properties: { exceededTransferLimit: true } }); });
  assert.equal((await request('/')).status, 200);
  assert.equal(calls, 1);
});

test('[perimeters-019] an empty route uses the feed and an unknown route fails', async () => {
  const request = route(async () => Response.json({ features: [] }));
  assert.equal((await request('?x=1')).status, 200);
  assert.equal((await request('/unknown')).status, 404);
});

test('[perimeters-019] a reply on a closed client has no body', async () => {
  let handler;
  firePerimetersProxy({ fetchImpl: async () => Response.json({ features: [] }) }).configureServer({ middlewares: { use(_path, value) { handler = value; } } });
  const reply = { destroyed: true, writeHead() { throw new Error('write'); }, end() { throw new Error('end'); } };
  await handler({ method: 'GET', url: '/', socket: {} }, reply);
  assert.equal(reply.destroyed, true);
});

test('[perimeters-019] too many distinct page requests give busy status', async () => {
  let release;
  const hold = new Promise((resolve) => { release = resolve; });
  const request = route(async () => { await hold; return new Response('<meta property="og:updated_time" content="2026-09-01T00:00:00Z">'); });
  const waits = [];
  for (let id = 1; id <= 256; id++) waits.push(request(`/inciweb/publication/${id}`, `peer-${id}`));
  await new Promise(setImmediate);
  const extra = await request('/inciweb/publication/257', 'peer-257');
  assert.equal(extra.status, 429);
  release();
  const replies = await Promise.all(waits);
  assert.equal(replies.filter((reply) => reply.status === 200).length, 256);
});

test('[perimeters-019] an absent route uses the perimeter feed', async () => {
  const request = route(async () => Response.json({ features: [] }));
  const reply = await request(undefined);
  assert.equal(reply.status, 200);
  assert.deepEqual(reply.body.rows, []);
});

test('[perimeters-017] the feed stops after five full pages', async () => {
  let calls = 0;
  const request = route(async () => {
    calls++;
    return Response.json({ features: [{ id: calls, properties: { attr_UniqueFireIdentifier: String(calls) }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] } }], exceededTransferLimit: true });
  });
  const reply = await request('/');
  assert.equal(reply.status, 200);
  assert.equal(reply.body.rows.length, 5);
  assert.equal(calls, 5);
});

test('[perimeters-018] a valid index has an array response', async () => {
  const request = route(async () => Response.json([{ incident_id: '2' }]));
  const reply = await request('/inciweb/index');
  assert.equal(reply.status, 200);
  assert.deepEqual(reply.body, [{ incident_id: '2' }]);
});

test('[perimeters-019] a post request gets method error', async () => {
  const request = route(async () => { throw new Error('unexpected fetch'); });
  const reply = await request('/', 'test', 'POST');
  assert.equal(reply.status, 405);
  assert.deepEqual(reply.body, { error: 'method_not_allowed' });
});
