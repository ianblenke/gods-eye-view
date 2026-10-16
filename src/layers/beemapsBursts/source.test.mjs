import test from 'node:test';
import assert from 'node:assert/strict';
import { createBeemapsBurstSource } from './source.js';

const BBOX = [9.982014, 59.991007, 10.017986, 60.008993];
const QUOTE_ID = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
const KEY = '0123456789abcdef0123456789abcdef';
const GOOD_QUOTE = {
  quoteId: QUOTE_ID,
  expiresInSeconds: 120,
  request: { bbox: BBOX, areaKm2: 4, credits: 125 },
  budget: { used: 0, limit: 625, remaining: 625 },
};
const BURST = {
  id: '6501aa11bb22cc33dd44ee55',
  status: 'active',
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
};
const CREATED = {
  ok: true,
  outcome: 'created',
  replayed: false,
  burst: BURST,
  creditsRemaining: 875,
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status });
const stalled = (url, init) =>
  new Promise((resolve, reject) =>
    init.signal.addEventListener('abort', () =>
      reject(new DOMException('aborted', 'AbortError')),
    ),
  );
const stalledBody = () =>
  new Response(new ReadableStream({ pull: () => new Promise(() => {}) }));
const settle = () => new Promise((resolve) => setImmediate(resolve));

/** A source with a fake fetch function and recording timers. */
function make(respond) {
  const calls = [];
  const timers = [];
  const cleared = [];
  const source = createBeemapsBurstSource({
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
const confirmWith = (respond) =>
  make(respond).source.confirm({ quoteId: QUOTE_ID, idempotencyKey: KEY });

test('[beemaps-bursts-021] sends one GET for the status route with the signal and reads the two flags', async () => {
  for (const [enabled, configured] of [
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ]) {
    const { source, calls } = make(() => json({ enabled, configured }));
    const signal = new AbortController().signal;
    assert.deepEqual(await source.getStatus({ signal }), {
      ok: true,
      enabled,
      configured,
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/api/beemaps/burst/status');
    assert.equal(calls[0].init.signal, signal);
    assert.equal(calls[0].init.method ?? 'GET', 'GET');
    assert.equal(calls[0].init.body, undefined);
  }
});

test('[beemaps-bursts-021] gives ok false for another body, for a status that is not 2xx and for a rejection', async () => {
  for (const body of [
    {},
    { enabled: true },
    { configured: true },
    { enabled: 'yes', configured: true },
    { enabled: true, configured: 1 },
    [],
    'x',
    null,
  ]) {
    assert.deepEqual(await make(() => json(body)).source.getStatus(), {
      ok: false,
    });
  }
  assert.deepEqual(
    await make(() =>
      json({ enabled: true, configured: true }, 500),
    ).source.getStatus(),
    { ok: false },
  );
  assert.deepEqual(
    await make(() => new Response('<html>')).source.getStatus(),
    { ok: false },
  );
  assert.deepEqual(
    await make(() => {
      throw new TypeError('fetch failed');
    }).source.getStatus(),
    { ok: false },
  );
  assert.deepEqual(
    await make(
      () => new Response('{}', { headers: { 'content-length': '1048577' } }),
    ).source.getStatus(),
    { ok: false },
  );
});

test('[beemaps-bursts-022] sends one POST with the box and nothing else and reads a good quote', async () => {
  const { source, calls } = make(() => json(GOOD_QUOTE));
  const result = await source.quote({ bbox: BBOX });
  assert.deepEqual(result, {
    ok: true,
    quote: {
      quoteId: QUOTE_ID,
      expiresInSeconds: 120,
      bbox: BBOX,
      areaKm2: 4,
      credits: 125,
      budget: { used: 0, limit: 625, remaining: 625 },
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/beemaps/burst/quote');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(calls[0].init.headers, {
    'Content-Type': 'application/json',
  });
  assert.equal(
    calls[0].init.body,
    '{"bbox":[9.982014,59.991007,10.017986,60.008993]}',
  );
});

test('[beemaps-bursts-022] gives bad_answer with the status 200 for a quote that fails the rules', async () => {
  const bad = [
    { ...GOOD_QUOTE, quoteId: 'x' },
    { ...GOOD_QUOTE, expiresInSeconds: 601 },
    { ...GOOD_QUOTE, request: { ...GOOD_QUOTE.request, bbox: [1, 2, 3] } },
    { ...GOOD_QUOTE, request: { ...GOOD_QUOTE.request, areaKm2: 0 } },
    { ...GOOD_QUOTE, request: { ...GOOD_QUOTE.request, credits: 0 } },
    { ...GOOD_QUOTE, budget: { used: -1, limit: 625, remaining: 625 } },
    {},
    [],
    null,
  ];
  for (const body of bad) {
    assert.deepEqual(
      await make(() => json(body)).source.quote({ bbox: BBOX }),
      {
        ok: false,
        status: 200,
        error: 'bad_answer',
      },
    );
  }
});

test('[beemaps-bursts-022] gives the error string and the whole-number fields of an error answer', async () => {
  assert.deepEqual(
    await make(() =>
      json({ error: 'budget_used', used: 625, limit: 625 }, 403),
    ).source.quote({
      bbox: BBOX,
    }),
    { ok: false, status: 403, error: 'budget_used', used: 625, limit: 625 },
  );
  assert.deepEqual(
    await make(() =>
      json({ error: 'rate_limited', retryAfter: 60 }, 429),
    ).source.quote({
      bbox: BBOX,
    }),
    { ok: false, status: 429, error: 'rate_limited', retryAfter: 60 },
  );
  for (const value of [undefined, -1, 1.5, '3', null]) {
    assert.deepEqual(
      await make(() =>
        json({ error: 'x', used: value, limit: value, retryAfter: value }, 400),
      ).source.quote({ bbox: BBOX }),
      { ok: false, status: 400, error: 'x' },
    );
  }
  assert.deepEqual(
    await make(() =>
      json({ error: 'x', used: 0, limit: 0, retryAfter: 0 }, 400),
    ).source.quote({
      bbox: BBOX,
    }),
    { ok: false, status: 400, error: 'x', used: 0, limit: 0, retryAfter: 0 },
  );
  for (const body of [{}, { error: 5 }, { error: null }, [], 'x', null]) {
    assert.deepEqual(
      await make(() => json(body, 418)).source.quote({ bbox: BBOX }),
      { ok: false, status: 418, error: 'unknown' },
    );
  }
  for (const status of [200, 403, 502]) {
    assert.deepEqual(
      await make(() => new Response('<html>', { status })).source.quote({
        bbox: BBOX,
      }),
      { ok: false, status, error: 'bad_answer' },
    );
  }
});

test('[beemaps-bursts-022] gives unreachable for a thrown fetch and for the 30 seconds, and clears the timer', async () => {
  const thrown = make(() => {
    throw new TypeError('fetch failed');
  });
  assert.deepEqual(await thrown.source.quote({ bbox: BBOX }), {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
  assert.deepEqual(thrown.cleared, [1]);
  const slow = make(stalled);
  const pending = slow.source.quote({ bbox: BBOX });
  await settle();
  assert.equal(slow.timers.length, 1);
  assert.equal(slow.timers[0].ms, 30000);
  slow.timers[0].fn();
  assert.deepEqual(await pending, {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
  assert.deepEqual(slow.cleared, [1]);
  const body = make(stalledBody);
  const reading = body.source.quote({ bbox: BBOX });
  await new Promise((resolve) => setTimeout(resolve, 20));
  body.timers[0].fn();
  assert.deepEqual(await reading, {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
});

test('[beemaps-bursts-022] throws the abort error of the caller, sends one request and removes its listener', async () => {
  const caller = new AbortController();
  const { source, calls, cleared } = make(stalled);
  const pending = source.quote({ bbox: BBOX, signal: caller.signal });
  await settle();
  const own = calls[0].init.signal;
  assert.notEqual(own, caller.signal);
  assert.equal(own.aborted, false);
  caller.abort();
  assert.equal(own.aborted, true);
  await assert.rejects(pending, { name: 'AbortError' });
  assert.deepEqual(cleared, [1]);
  assert.equal(calls.length, 1);
  const before = new AbortController();
  before.abort();
  const idle = make(() => json(GOOD_QUOTE));
  await assert.rejects(
    idle.source.quote({ bbox: BBOX, signal: before.signal }),
  );
  assert.equal(idle.calls.length, 0);
  const second = new AbortController();
  const waiting = make(stalledBody).source.quote({
    bbox: BBOX,
    signal: second.signal,
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  second.abort();
  await assert.rejects(waiting);
  const events = [];
  const signal = {
    aborted: false,
    throwIfAborted() {},
    addEventListener: (type, handler, options) =>
      events.push(['add', type, handler, options]),
    removeEventListener: (type, handler) =>
      events.push(['remove', type, handler]),
  };
  await make(() => json(GOOD_QUOTE)).source.quote({ bbox: BBOX, signal });
  assert.deepEqual(
    events.map(([action, type]) => [action, type]),
    [
      ['add', 'abort'],
      ['remove', 'abort'],
    ],
  );
  assert.equal(events[0][2], events[1][2]);
  assert.deepEqual(events[0][3], { once: true });
});

test('[beemaps-bursts-022] sends one request for each call that fails, also after the timer runs', async () => {
  const rows = [
    () => json({ error: 'rate_limited', retryAfter: 60 }, 429),
    () => json({}, 500),
    () => new Response('x'.repeat(1024 * 1024 + 1)),
    stalledBody,
    () => new Response('not json', { status: 500 }),
    () => json({ quoteId: 'x' }),
    () => {
      throw new TypeError('fetch failed');
    },
    stalled,
  ];
  for (const respond of rows) {
    const { source, calls, timers } = make(respond);
    const pending = source.quote({ bbox: BBOX });
    await settle();
    for (const timer of timers) timer.fn();
    assert.equal((await pending).ok, false);
    await settle();
    assert.equal(calls.length, 1);
    assert.equal(timers.length, 1);
  }
});

test('[beemaps-bursts-023] sends one POST with the quoteId and the key and no signal of the caller', async () => {
  const { source, calls } = make(() => json(CREATED));
  await source.confirm({ quoteId: QUOTE_ID, idempotencyKey: KEY });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/beemaps/burst/confirm');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(calls[0].init.headers, {
    'Content-Type': 'application/json',
  });
  assert.equal(
    calls[0].init.body,
    `{"quoteId":"${QUOTE_ID}","idempotencyKey":"${KEY}"}`,
  );
  assert.equal(calls[0].init.signal instanceof AbortSignal, true);
  assert.equal(calls[0].init.signal.aborted, false);
});

test('[beemaps-bursts-023] reads a created answer and keeps the replay flag', async () => {
  assert.deepEqual(await confirmWith(() => json(CREATED)), {
    outcome: 'created',
    replayed: false,
    burst: BURST,
    creditsRemaining: 875,
  });
  assert.equal(
    (await confirmWith(() => json({ ...CREATED, replayed: true }))).replayed,
    true,
  );
  assert.equal(
    (await confirmWith(() => json({ ...CREATED, creditsRemaining: null })))
      .creditsRemaining,
    null,
  );
});

test('[beemaps-bursts-023] reads a created answer whose burst has a null status, a null validUntil and null credits', async () => {
  const burst = { id: 'x1', status: null, validUntil: null, credits: null };
  assert.deepEqual(await confirmWith(() => json({ ...CREATED, burst })), {
    outcome: 'created',
    replayed: false,
    burst,
    creditsRemaining: 875,
  });
});

test('[beemaps-bursts-023] gives refused for each known error and keeps retryAfter', async () => {
  const known = [
    ['cross_origin', 403],
    ['rate_limited', 429],
    ['burst_off', 403],
    ['no_key', 403],
    ['bad_body', 400],
    ['busy', 409],
    ['key_reused', 409],
    ['quote_expired', 410],
    ['budget_used', 403],
    ['budget_unavailable', 500],
    ['ledger_unavailable', 500],
    ['log_failed', 500],
    ['bad_request', 400],
    ['key_rejected', 403],
    ['no_credit', 402],
    ['upstream_rate_limit', 429],
  ];
  for (const [error, status] of known) {
    assert.deepEqual(await confirmWith(() => json({ error }, status)), {
      outcome: 'refused',
      status,
      error,
    });
    assert.deepEqual(
      await confirmWith(() =>
        json({ ok: false, outcome: 'refused', error, retryAfter: 30 }, status),
      ),
      { outcome: 'refused', status, error, retryAfter: 30 },
    );
  }
  assert.equal(
    (await confirmWith(() => json({ error: 'busy', retryAfter: 1.5 }, 409)))
      .retryAfter,
    undefined,
  );
});

test('[beemaps-bursts-023] keeps used and limit for budget_used only', async () => {
  assert.deepEqual(
    await confirmWith(() =>
      json({ error: 'budget_used', used: 625, limit: 625 }, 403),
    ),
    {
      outcome: 'refused',
      status: 403,
      error: 'budget_used',
      used: 625,
      limit: 625,
    },
  );
  assert.deepEqual(
    await confirmWith(() =>
      json({ error: 'budget_used', used: -1, limit: 'x' }, 403),
    ),
    { outcome: 'refused', status: 403, error: 'budget_used' },
  );
  assert.deepEqual(
    await confirmWith(() => json({ error: 'busy', used: 1, limit: 2 }, 409)),
    { outcome: 'refused', status: 409, error: 'busy' },
  );
});

test('[beemaps-bursts-023] gives unknown for every other answer', async () => {
  const rows = [
    [
      json({ ok: false, outcome: 'unknown', error: 'outcome_unknown' }, 502),
      502,
    ],
    [
      json(
        { ok: false, outcome: 'unknown', error: 'outcome_unknown', held: true },
        409,
      ),
      409,
    ],
    [json({ error: 'internal_error' }, 500), 500],
    [json({ error: 'something_new' }, 403), 403],
    [json({ error: 'upstream_failed' }, 502), 502],
    [json({ error: 'bad_answer' }, 400), 400],
    [new Response('null', { status: 400 }), 400],
    [new Response('null', { status: 200 }), 200],
    [json({ error: 'toString' }, 400), 400],
    [json({ error: 5 }, 400), 400],
    [json({}, 400), 400],
    [json({ ok: true, outcome: 'created', burst: { id: '' } }, 200), 200],
    [json({ ...CREATED, burst: undefined }, 200), 200],
    [json({ ok: false, error: 'busy' }, 200), 200],
    [json({ error: 'busy' }, 399), 399],
    [json(CREATED, 201), 201],
    [json({ ...CREATED, ok: true, error: 'busy' }, 409), 409],
    [new Response('<html>', { status: 200 }), 200],
    [new Response('<html>', { status: 502 }), 502],
  ];
  for (const [response, status] of rows) {
    assert.deepEqual(await confirmWith(() => response), {
      outcome: 'unknown',
      status,
    });
  }
});

test('[beemaps-bursts-023] keeps retryAfter in an unknown answer when it is a whole number', async () => {
  assert.deepEqual(
    await confirmWith(() =>
      json(
        {
          ok: false,
          outcome: 'unknown',
          error: 'outcome_unknown',
          retryAfter: 539,
        },
        409,
      ),
    ),
    { outcome: 'unknown', status: 409, retryAfter: 539 },
  );
  assert.deepEqual(
    await confirmWith(() =>
      json({ error: 'outcome_unknown', retryAfter: 'x' }, 409),
    ),
    { outcome: 'unknown', status: 409 },
  );
});

test('[beemaps-bursts-024] resolves to unknown with the status 0 and never rejects when the fetch throws or stalls', async () => {
  assert.deepEqual(
    await confirmWith(() => {
      throw new TypeError('fetch failed');
    }),
    { outcome: 'unknown', status: 0 },
  );
  const slow = make(stalled);
  const pending = slow.source.confirm({
    quoteId: QUOTE_ID,
    idempotencyKey: KEY,
  });
  await settle();
  assert.equal(slow.timers.length, 1);
  assert.equal(slow.timers[0].ms, 60000);
  assert.equal(slow.calls[0].init.signal.aborted, false);
  slow.timers[0].fn();
  assert.equal(slow.calls[0].init.signal.aborted, true);
  assert.deepEqual(await pending, { outcome: 'unknown', status: 0 });
  assert.deepEqual(slow.cleared, [1]);
});

test('[beemaps-bursts-024] resolves to unknown with the status when the body stops, is too large or is not JSON', async () => {
  const body = make(stalledBody);
  const pending = body.source.confirm({
    quoteId: QUOTE_ID,
    idempotencyKey: KEY,
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  body.timers[0].fn();
  assert.deepEqual(await pending, { outcome: 'unknown', status: 200 });
  assert.deepEqual(body.cleared, [1]);
  assert.deepEqual(
    await confirmWith(
      () => new Response('x'.repeat(1024 * 1024 + 1), { status: 200 }),
    ),
    { outcome: 'unknown', status: 200 },
  );
  assert.deepEqual(
    await confirmWith(() => new Response('{"ok":', { status: 503 })),
    { outcome: 'unknown', status: 503 },
  );
});

test('[beemaps-bursts-024] sends one request for each confirm and clears its timer, whatever the answer', async () => {
  const rows = [
    () => json(CREATED),
    () => json({ error: 'busy' }, 409),
    () => json({}, 500),
    () => new Response('not json', { status: 500 }),
    stalledBody,
    () => {
      throw new TypeError('fetch failed');
    },
    stalled,
  ];
  for (const respond of rows) {
    const { source, calls, timers, cleared } = make(respond);
    const pending = source.confirm({ quoteId: QUOTE_ID, idempotencyKey: KEY });
    await settle();
    for (const timer of timers) timer.fn();
    const result = await pending;
    assert.equal(typeof result.outcome, 'string');
    await settle();
    assert.equal(calls.length, 1);
    assert.equal(timers.length, 1);
    assert.deepEqual(cleared, [1]);
  }
});

const LISTED = (id, isHit = false) => ({
  id,
  status: 'active',
  isHit,
  latestHitAt: null,
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
  bbox: BBOX,
});

test('[beemaps-bursts-025] sends one POST with the limit 100 and reads a good list', async () => {
  const { source, calls } = make(() =>
    json({ bursts: [LISTED('a', true), LISTED('b')], total: 2, cached: true }),
  );
  const signal = new AbortController().signal;
  assert.deepEqual(await source.list({ signal }), {
    ok: true,
    bursts: [
      { id: 'a', status: 'active', isHit: true, credits: 125, bbox: BBOX },
      { id: 'b', status: 'active', isHit: false, credits: 125, bbox: BBOX },
    ],
    total: 2,
    cached: true,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/beemaps/burst/list');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.body, '{"limit":100}');
  assert.deepEqual(calls[0].init.headers, {
    'Content-Type': 'application/json',
  });
  assert.notEqual(calls[0].init.signal, signal);
});

test('[beemaps-bursts-025] keeps a listed burst with a null status, null credits and a null box', async () => {
  const answer = await make(() =>
    json({
      bursts: [{ ...LISTED('a'), status: null, credits: null, bbox: null }],
      total: 1,
      cached: false,
    }),
  ).source.list();
  assert.deepEqual(answer.bursts, [
    { id: 'a', status: null, isHit: false, credits: null, bbox: null },
  ]);
});

test('[beemaps-bursts-025] drops a burst that fails the rules and gives bad_answer for a bad list', async () => {
  const dropped = await make(() =>
    json({
      bursts: [LISTED('a'), { id: 'z' }, LISTED('b')],
      total: 3,
      cached: false,
    }),
  ).source.list();
  assert.deepEqual(
    dropped.bursts.map((burst) => burst.id),
    ['a', 'b'],
  );
  for (const body of [
    {},
    { bursts: 'x', total: 0, cached: false },
    { bursts: [], total: -1, cached: false },
    { bursts: [], total: 0 },
    [],
    null,
  ]) {
    assert.deepEqual(await make(() => json(body)).source.list(), {
      ok: false,
      status: 200,
      error: 'bad_answer',
    });
  }
});

test('[beemaps-bursts-025] gives an error answer, unreachable and the abort error as the quote does', async () => {
  assert.deepEqual(
    await make(() => json({ error: 'key_rejected' }, 403)).source.list(),
    { ok: false, status: 403, error: 'key_rejected' },
  );
  assert.deepEqual(
    await make(() =>
      json({ error: 'rate_limited', retryAfter: 60 }, 429),
    ).source.list(),
    { ok: false, status: 429, error: 'rate_limited', retryAfter: 60 },
  );
  assert.deepEqual(
    await make(() => {
      throw new TypeError('fetch failed');
    }).source.list(),
    { ok: false, status: 0, error: 'unreachable' },
  );
  const slow = make(stalled);
  const pending = slow.source.list();
  await settle();
  assert.equal(slow.timers[0].ms, 30000);
  slow.timers[0].fn();
  assert.deepEqual(await pending, {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
  const caller = new AbortController();
  const aborted = make(stalled).source.list({ signal: caller.signal });
  await settle();
  caller.abort();
  await assert.rejects(aborted, { name: 'AbortError' });
});

test('[beemaps-bursts-021] uses the fetch function and the timers of the page when none is given', async (t) => {
  const urls = [];
  t.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(url);
    if (url.endsWith('status'))
      return json({ enabled: true, configured: true });
    if (url.endsWith('quote')) return json(GOOD_QUOTE);
    if (url.endsWith('confirm')) return json(CREATED);
    return json({ bursts: [], total: 0, cached: false });
  });
  const source = createBeemapsBurstSource();
  assert.equal((await source.getStatus()).ok, true);
  assert.equal((await source.quote({ bbox: BBOX })).ok, true);
  assert.equal(
    (await source.confirm({ quoteId: QUOTE_ID, idempotencyKey: KEY })).outcome,
    'created',
  );
  assert.equal((await source.list()).ok, true);
  assert.deepEqual(urls, [
    '/api/beemaps/burst/status',
    '/api/beemaps/burst/quote',
    '/api/beemaps/burst/confirm',
    '/api/beemaps/burst/list',
  ]);
});

test('[beemaps-bursts-022] gives bad_answer with the real status for a good status and a quote that fails the rules', async () => {
  for (const status of [200, 201]) {
    assert.deepEqual(
      await make(() => json({ quoteId: 'x' }, status)).source.quote({
        bbox: BBOX,
      }),
      { ok: false, status, error: 'bad_answer' },
    );
  }
});

test('[beemaps-bursts-022] reads a body of 1048576 bytes and gives bad_answer for one byte more', async () => {
  const pad = (size) => {
    const head = JSON.stringify({ ...GOOD_QUOTE, pad: '' }).slice(0, -2);
    return head + 'a'.repeat(size - head.length - 2) + '"}';
  };
  const exact = pad(1048576);
  assert.equal(Buffer.byteLength(exact), 1048576);
  assert.equal(
    (await make(() => new Response(exact)).source.quote({ bbox: BBOX })).ok,
    true,
  );
  assert.deepEqual(
    await make(() => new Response(pad(1048577))).source.quote({ bbox: BBOX }),
    { ok: false, status: 200, error: 'bad_answer' },
  );
  assert.equal(
    (
      await make(() => new Response(exact)).source.confirm({
        quoteId: QUOTE_ID,
        idempotencyKey: KEY,
      })
    ).outcome,
    'unknown',
  );
});

test('[beemaps-bursts-021] stops a status read when its signal is aborted while the body stalls', async () => {
  const controller = new AbortController();
  const pending = make(stalledBody).source.getStatus({
    signal: controller.signal,
  });
  await new Promise((resolve) => setTimeout(resolve, 20));
  controller.abort();
  assert.deepEqual(await pending, { ok: false });
});
