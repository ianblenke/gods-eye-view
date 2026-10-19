import assert from 'node:assert/strict';
import test from 'node:test';
import { createGdacsSource } from './source.js';

const GOOD = {
  schemaVersion: 1,
  stale: false,
  unavailable: false,
  reason: null,
  fetchedAt: '2026-10-16T08:00:00.000Z',
  counts: { total: 1, current: 1, dropped: 0 },
  events: [
    {
      id: 'FL-1104230',
      type: 'FL',
      eventId: 1104230,
      episodeId: 2,
      name: 'Flood in Türkiye',
      alert: 'green',
      alertScore: 1,
      current: true,
      country: 'Türkiye',
      iso3: 'TUR',
      from: '2026-10-12T01:00:00.000Z',
      to: '2026-10-16T01:00:00.000Z',
      modified: '2026-10-16T07:45:43.000Z',
      latitude: 41.116,
      longitude: 28.999,
      severity: null,
      origin: 'GLOFAS',
      reportUrl:
        'https://www.gdacs.org/report.aspx?eventid=1104230&episodeid=2&eventtype=FL',
    },
  ],
};
function source(respond, calls = []) {
  return createGdacsSource({
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return respond();
    },
  });
}
const MIB2 = 2 * 1024 * 1024;

test('[gdacs-layer-003] reads the route with the signal of the caller and gives the normalized document', async () => {
  const calls = [];
  const controller = new AbortController();
  const result = await source(() => Response.json(GOOD), calls).getSnapshot({
    signal: controller.signal,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/gdacs');
  assert.equal(calls[0].options.signal, controller.signal);
  assert.deepEqual(Object.keys(result).sort(), ['events', 'meta']);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].name, 'Flood in Türkiye');
  assert.equal(result.meta.unavailable, false);
  assert.equal(result.meta.total, 1);
  const mixed = await source(() =>
    Response.json({
      ...GOOD,
      events: [
        { ...GOOD.events[0], id: 'FL-1', alert: 'purple' },
        { ...GOOD.events[0], id: 'FL-2', name: 'A‮B' },
      ],
    }),
  ).getSnapshot();
  assert.deepEqual(
    mixed.events.map((event) => [event.id, event.name]),
    [['FL-2', 'AB']],
  );
  const noSignal = await source(() => Response.json(GOOD)).getSnapshot();
  assert.equal(noSignal.events.length, 1);
  const original = globalThis.fetch;
  const global = [];
  globalThis.fetch = async (url, options) => {
    global.push({ url, options });
    return Response.json(GOOD);
  };
  try {
    const fromGlobal = await createGdacsSource().getSnapshot({
      signal: controller.signal,
    });
    assert.equal(fromGlobal.events.length, 1);
  } finally {
    globalThis.fetch = original;
  }
  assert.equal(global.length, 1);
  assert.equal(global[0].url, '/api/gdacs');
  assert.equal(global[0].options.signal, controller.signal);
});

test('[gdacs-layer-004] refuses a bad answer', async () => {
  const fails = async (respond, expected) => {
    const calls = [];
    await assert.rejects(source(respond, calls).getSnapshot({}), expected);
    assert.equal(calls.length, 1);
  };
  await fails(() => new Response('no', { status: 503 }), {
    message: 'GDACS HTTP 503',
  });
  await fails(() => new Response('no', { status: 404 }), {
    message: 'GDACS HTTP 404',
  });
  await fails(() => new Response('not json at all'), SyntaxError);
  await fails(() => Response.json({ events: [] }), {
    message: 'Invalid GDACS document',
  });
  await fails(() => Response.json({ ...GOOD, schemaVersion: 2 }), {
    message: 'Invalid GDACS document',
  });
  await fails(() => Response.json({ ...GOOD, events: 'x' }), {
    message: 'Invalid GDACS document',
  });
  await fails(() => Response.json(null), {
    message: 'Invalid GDACS document',
  });
  await fails(() => new Response(' '.repeat(MIB2 + 1)), {
    code: 'RESPONSE_TOO_LARGE',
  });
  const padded = JSON.stringify(GOOD);
  const exact = padded + ' '.repeat(MIB2 - Buffer.byteLength(padded));
  assert.equal(Buffer.byteLength(exact), 2097152);
  const accepted = await source(() => new Response(exact)).getSnapshot();
  assert.equal(accepted.events.length, 1);
  const controller = new AbortController();
  controller.abort();
  const calls = [];
  await assert.rejects(
    source(() => Response.json(GOOD), calls).getSnapshot({
      signal: controller.signal,
    }),
    { name: 'AbortError' },
  );
  assert.equal(calls.length, 0);
  const late = new AbortController();
  await assert.rejects(
    createGdacsSource({
      fetchImpl: async () => {
        late.abort();
        return Response.json(GOOD);
      },
    }).getSnapshot({ signal: late.signal }),
    { name: 'AbortError' },
  );
});
