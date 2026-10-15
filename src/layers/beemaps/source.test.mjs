import test from 'node:test';
import assert from 'node:assert/strict';
import { createBeemapsSource } from './source.js';

const BBOX = [9.982014, 59.991007, 10.017986, 60.008993];
const ID = 'e79cd5d7c1102b08';
const GOOD = {
  source: 'Bee Maps',
  frames: [
    {
      id: ID,
      lat: 10.5,
      lon: 20.25,
      timestamp: '2026-10-01T12:00:00.000Z',
    },
  ],
  budget: { used: 3, limit: 20 },
  credits: { remaining: 998 },
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status });

/** A source with a fake fetch function and recording timers. */
function make(respond) {
  const calls = [];
  const timers = [];
  const cleared = [];
  const source = createBeemapsSource({
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return respond(url, init, calls.length);
    },
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
  });
  return { source, calls, timers, cleared };
}
const failing = (body, status) => make(() => json(body, status));

test('[beemaps-frames-011] sends one GET for the status route with the signal and reads configured', async () => {
  for (const configured of [true, false]) {
    const { source, calls } = make(() => json({ configured }));
    const signal = new AbortController().signal;
    assert.deepEqual(await source.getStatus({ signal }), {
      ok: true,
      configured,
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/api/beemaps/status');
    assert.equal(calls[0].init.signal, signal);
    assert.equal(calls[0].init.method ?? 'GET', 'GET');
    assert.equal(calls[0].init.body, undefined);
  }
});

test('[beemaps-frames-011] gives ok false for another body, for a status that is not 2xx and for a rejection', async () => {
  for (const body of [
    {},
    { configured: 'yes' },
    { configured: 1 },
    [],
    'x',
    null,
  ])
    assert.deepEqual(await make(() => json(body)).source.getStatus(), {
      ok: false,
    });
  for (const status of [301, 403, 404, 500, 503])
    assert.deepEqual(
      await make(() => json({ configured: true }, status)).source.getStatus(),
      { ok: false },
    );
  assert.deepEqual(
    await make(() => new Response('not json')).source.getStatus(),
    { ok: false },
  );
  const rejecting = make(() => {
    throw new TypeError('fetch failed');
  });
  assert.deepEqual(await rejecting.source.getStatus(), { ok: false });
});

test('[beemaps-frames-012] sends one POST with one header and the box and the limit as the body', async () => {
  const { source, calls } = make(() => json(GOOD));
  const signal = new AbortController().signal;
  await source.getFrames({ bbox: BBOX, signal });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/beemaps/frames');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(calls[0].init.headers, {
    'Content-Type': 'application/json',
  });
  assert.equal(
    calls[0].init.body,
    '{"bbox":[9.982014,59.991007,10.017986,60.008993],"limit":200}',
  );
  assert.equal(calls[0].init.signal instanceof AbortSignal, true);
  assert.equal(calls[0].init.signal.aborted, false);
});

test('[beemaps-frames-012] gives the result of the answer records for a good answer', async () => {
  const { source } = make(() => json(GOOD));
  const result = await source.getFrames({ bbox: BBOX });
  assert.deepEqual(result, {
    ok: true,
    answer: {
      frames: [
        {
          id: ID,
          lat: 10.5,
          lon: 20.25,
          timestamp: '2026-10-01T12:00:00.000Z',
          time: Date.UTC(2026, 9, 1, 12, 0, 0),
        },
      ],
      used: 3,
      limit: 20,
      remaining: 998,
    },
  });
});

test('[beemaps-frames-013] gives the status, the error and the whole numbers of an error body', async () => {
  const body = {
    error: 'budget',
    used: 20,
    limit: 20,
    retryAfter: 30,
    extra: 'CANARY',
  };
  assert.deepEqual(await failing(body, 429).source.getFrames({ bbox: BBOX }), {
    ok: false,
    status: 429,
    error: 'budget',
    used: 20,
    limit: 20,
    retryAfter: 30,
  });
  assert.deepEqual(
    await failing({ error: 'cross_origin' }, 403).source.getFrames({
      bbox: BBOX,
    }),
    { ok: false, status: 403, error: 'cross_origin' },
  );
  for (const value of [-1, 1.5, '3', null, NaN, Infinity, {}, []]) {
    const result = await failing(
      { error: 'budget', used: value, limit: value, retryAfter: value },
      429,
    ).source.getFrames({ bbox: BBOX });
    assert.deepEqual(
      result,
      { ok: false, status: 429, error: 'budget' },
      String(value),
    );
  }
  assert.deepEqual(
    await failing(
      { error: 'budget', used: 0, limit: 0, retryAfter: 0 },
      429,
    ).source.getFrames({ bbox: BBOX }),
    {
      ok: false,
      status: 429,
      error: 'budget',
      used: 0,
      limit: 0,
      retryAfter: 0,
    },
  );
});

test('[beemaps-frames-013] gives the error unknown for a JSON body without a text error', async () => {
  for (const body of [{}, { error: 5 }, { error: null }, [], 'x', null])
    assert.deepEqual(
      await failing(body, 418).source.getFrames({ bbox: BBOX }),
      {
        ok: false,
        status: 418,
        error: 'unknown',
      },
    );
});

test('[beemaps-frames-013] gives the error bad_answer for a body that is not JSON', async () => {
  for (const status of [200, 403, 502]) {
    const { source } = make(
      () => new Response('<html>error</html>', { status }),
    );
    assert.deepEqual(await source.getFrames({ bbox: BBOX }), {
      ok: false,
      status,
      error: 'bad_answer',
    });
  }
});

test('[beemaps-frames-013] reads a body of 1048576 bytes and gives bad_answer for one byte more', async () => {
  const pad = (size) => {
    const head = '{"frames":[],"pad":"';
    return head + 'a'.repeat(size - head.length - 2) + '"}';
  };
  const exact = pad(1048576);
  assert.equal(Buffer.byteLength(exact), 1048576);
  const fits = await make(() => new Response(exact)).source.getFrames({
    bbox: BBOX,
  });
  assert.equal(fits.ok, true);
  const over = await make(() => new Response(pad(1048577))).source.getFrames({
    bbox: BBOX,
  });
  assert.deepEqual(over, { ok: false, status: 200, error: 'bad_answer' });
  const declared = await make(
    () => new Response('{}', { headers: { 'content-length': '1048577' } }),
  ).source.getFrames({ bbox: BBOX });
  assert.deepEqual(declared, { ok: false, status: 200, error: 'bad_answer' });
});

test('[beemaps-frames-015] gives bad_answer with the status 200 for an answer without a list of frames', async () => {
  for (const body of [{}, { frames: 'x' }, [], null, 'x'])
    assert.deepEqual(
      await make(() => json(body)).source.getFrames({ bbox: BBOX }),
      {
        ok: false,
        status: 200,
        error: 'bad_answer',
      },
    );
});

test('[beemaps-frames-013] gives the status 0 and the error unreachable for a rejection', async () => {
  const { source, cleared } = make(() => {
    throw new TypeError('fetch failed');
  });
  assert.deepEqual(await source.getFrames({ bbox: BBOX }), {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
  assert.deepEqual(cleared, [1]);
});

test('[beemaps-frames-013] sends one request for each call that fails, also after the timers of the call run', async () => {
  const stalled = (url, init) =>
    new Promise((resolve, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const rows = [
    () => json({ error: 'upstream_rate_limit', retryAfter: 30 }, 429),
    () => json({ error: 'upstream_failed' }, 502),
    () => json({}, 500),
    () => new Response('x'.repeat(1024 * 1024 + 1), { status: 200 }),
    () => json({ error: 'key_rejected' }, 401),
    () => json({ error: 'no_credit' }, 402),
    () => json({ error: 'budget', used: 20, limit: 20 }, 429),
    () => new Response('not json', { status: 500 }),
    () => json({ frames: 'x' }),
    () => {
      throw new TypeError('fetch failed');
    },
    stalled,
  ];
  for (const respond of rows) {
    const { source, calls, timers } = make(respond);
    const pending = source.getFrames({ bbox: BBOX });
    await new Promise((resolve) => setImmediate(resolve));
    let fired = 0;
    while (fired < timers.length && fired < 5) {
      timers[fired].fn();
      fired += 1;
      await new Promise((resolve) => setImmediate(resolve));
    }
    const result = await pending;
    assert.equal(result.ok, false);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(calls.length, 1);
    assert.equal(timers.length, 1);
  }
});

test('[beemaps-frames-013] aborts a call that does not end in 30 seconds and clears the timer', async () => {
  const stalled = (url, init) =>
    new Promise((resolve, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const { source, timers, cleared } = make(stalled);
  const pending = source.getFrames({ bbox: BBOX });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 30000);
  timers[0].fn();
  assert.deepEqual(await pending, {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
  assert.deepEqual(cleared, [1]);
});

test('[beemaps-frames-013] gives unreachable when the 30 seconds end while it reads the body', async () => {
  const stalledBody = () =>
    new Response(new ReadableStream({ pull: () => new Promise(() => {}) }));
  const { source, timers } = make(stalledBody);
  const pending = source.getFrames({ bbox: BBOX });
  await new Promise((resolve) => setTimeout(resolve, 20));
  timers[0].fn();
  assert.deepEqual(await pending, {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
});

test('[beemaps-frames-013] rejects with the abort error when the signal of the caller is aborted', async () => {
  const stalled = (url, init) =>
    new Promise((resolve, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const { source, cleared } = make(stalled);
  const caller = new AbortController();
  const pending = source.getFrames({ bbox: BBOX, signal: caller.signal });
  await new Promise((resolve) => setImmediate(resolve));
  caller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.deepEqual(cleared, [1]);
  const before = new AbortController();
  before.abort();
  const idle = make(() => json(GOOD));
  await assert.rejects(
    idle.source.getFrames({ bbox: BBOX, signal: before.signal }),
  );
  assert.equal(idle.calls.length, 0);
  const stalledBody = () =>
    new Response(new ReadableStream({ pull: () => new Promise(() => {}) }));
  const body = make(stalledBody);
  const second = new AbortController();
  const waiting = body.source.getFrames({ bbox: BBOX, signal: second.signal });
  await new Promise((resolve) => setTimeout(resolve, 20));
  second.abort();
  await assert.rejects(waiting);
});

test('[beemaps-frames-012] uses the fetch function and the timers of the page when none is given', async (t) => {
  const urls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(url);
    return json(url.endsWith('status') ? { configured: true } : GOOD);
  });
  const source = createBeemapsSource();
  assert.deepEqual(await source.getStatus(), { ok: true, configured: true });
  const result = await source.getFrames({ bbox: BBOX });
  assert.equal(result.ok, true);
  assert.deepEqual(urls, ['/api/beemaps/status', '/api/beemaps/frames']);
});
