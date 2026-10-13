import assert from 'node:assert/strict';
import test from 'node:test';
import { createReticulumSource } from './source.js';

const GOOD = {
  schemaVersion: 1,
  stale: false,
  unavailable: false,
  reason: null,
  fetchedAt: '2026-10-13T12:00:00.000Z',
  counts: { total: 1 },
  interfaces: [
    {
      id: 'ab12cd34ef56ab12',
      type: 'rnode',
      name: 'Example Gateway',
      latitude: 12.346,
      longitude: -45.679,
      heightM: 43,
      hops: 3,
      lastHeard: '2026-10-13T11:00:00.000Z',
      status: 'available',
      radio: null,
    },
  ],
};
function source(respond, calls = []) {
  return createReticulumSource({
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return respond();
    },
  });
}
const MIB8 = 8 * 1024 * 1024;

test('[reticulum-layer-003] reads the route with the signal of the caller and gives the normalized snapshot', async () => {
  const calls = [];
  const controller = new AbortController();
  const result = await source(() => Response.json(GOOD), calls).getSnapshot({
    signal: controller.signal,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/reticulum');
  assert.equal(calls[0].options.signal, controller.signal);
  assert.deepEqual(Object.keys(result).sort(), ['interfaces', 'meta']);
  assert.equal(result.interfaces.length, 1);
  assert.equal(result.interfaces[0].name, 'Example Gateway');
  assert.equal(result.meta.unavailable, false);
  assert.equal(result.meta.total, 1);
  const noSignal = await source(() => Response.json(GOOD)).getSnapshot();
  assert.equal(noSignal.interfaces.length, 1);
});

test('[reticulum-layer-004] refuses a bad answer', async () => {
  const fails = async (respond, expected) => {
    const calls = [];
    await assert.rejects(source(respond, calls).getSnapshot({}), expected);
    assert.equal(calls.length, 1);
  };
  await fails(() => new Response('no', { status: 503 }), {
    message: 'Reticulum HTTP 503',
  });
  await fails(() => new Response('no', { status: 404 }), {
    message: 'Reticulum HTTP 404',
  });
  await fails(() => new Response('not json at all'), SyntaxError);
  await fails(() => Response.json({ interfaces: [] }), {
    message: 'Invalid Reticulum snapshot',
  });
  await fails(() => Response.json({ ...GOOD, schemaVersion: 2 }), {
    message: 'Invalid Reticulum snapshot',
  });
  await fails(() => Response.json({ ...GOOD, interfaces: 'x' }), {
    message: 'Invalid Reticulum snapshot',
  });
  await fails(() => Response.json(null), {
    message: 'Invalid Reticulum snapshot',
  });
  await fails(() => new Response(' '.repeat(MIB8 + 1)), {
    code: 'RESPONSE_TOO_LARGE',
  });
  const padded = JSON.stringify(GOOD);
  const exact = padded + ' '.repeat(MIB8 - padded.length);
  assert.equal(exact.length, 8388608);
  const accepted = await source(() => new Response(exact)).getSnapshot();
  assert.equal(accepted.interfaces.length, 1);
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
    createReticulumSource({
      fetchImpl: async () => {
        late.abort();
        return Response.json(GOOD);
      },
    }).getSnapshot({ signal: late.signal }),
    { name: 'AbortError' },
  );
});
