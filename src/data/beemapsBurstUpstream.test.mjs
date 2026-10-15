import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBurst,
  listBursts,
  retryAfterOf,
} from '../../server/providers/beemaps-burst/upstream.js';

const KEY = 'fixture-burst-key-Q7';
const BBOX = [9.982014, 59.991007, 10.017986, 60.008993];
const RING = [
  [9.982014, 59.991007],
  [10.017986, 59.991007],
  [10.017986, 60.008993],
  [9.982014, 60.008993],
  [9.982014, 59.991007],
];
const BURST = {
  _id: '6501aa11bb22cc33dd44ee55',
  geojson: { type: 'Polygon', coordinates: [RING] },
  amount: 125,
  status: 'active',
  validFrom: '2026-10-15T12:00:00.000Z',
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
  isHit: false,
  createdAt: 'CANARY-created',
};
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers });
const created = (extra = {}, burst = {}) =>
  json({
    success: true,
    bursts: [{ ...BURST, ...burst }],
    creditsRemaining: 500,
    ...extra,
  });
const status = (code, headers = {}) =>
  new Response(
    [204, 205, 304].includes(code) ? null : 'body that is not read',
    {
      status: code,
      headers,
    },
  );
const endless = () =>
  new Response(new ReadableStream({ pull: () => new Promise(() => {}) }));

function run(call, respond) {
  const calls = [];
  const timers = [];
  const cleared = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return respond(url, init);
  };
  const promise = call({
    fetchImpl,
    key: KEY,
    bbox: BBOX,
    credits: 125,
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
  });
  return { promise, calls, timers, cleared };
}
const create = (respond) => run(createBurst, respond);
const list = (respond) => run(listBursts, respond);
const tick = () => new Promise((resolve) => setImmediate(resolve));

test('[beemaps-burst-control-016] sends one POST to the create address with three headers, one polygon, the credits and a redirect option of error', async () => {
  const { promise, calls } = create(() => created());
  await promise;
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://beemaps.com/api/developer/burst/create');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(calls[0].init.headers, {
    Authorization: `Basic ${KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  assert.equal(
    calls[0].init.body,
    '[{"geojson":{"type":"Polygon","coordinates":[[[9.982014,59.991007],[10.017986,59.991007],[10.017986,60.008993],[9.982014,60.008993],[9.982014,59.991007]]]},"credits":125}]',
  );
  assert.equal(calls[0].init.redirect, 'error');
  assert.equal(calls[0].init.signal instanceof AbortSignal, true);
  assert.equal(calls[0].init.signal.aborted, false);
});

test('[beemaps-burst-control-016] sends a list of exactly one element that has only the fields geojson and credits', async () => {
  const { promise, calls } = run(
    (options) => createBurst({ ...options, credits: 200 }),
    () => created(),
  );
  await promise;
  const body = JSON.parse(calls[0].init.body);
  assert.equal(Array.isArray(body), true);
  assert.equal(body.length, 1);
  assert.deepEqual(Object.keys(body[0]), ['geojson', 'credits']);
  assert.equal(body[0].credits, 200);
  assert.equal(Object.hasOwn(body[0], 'expiration'), false);
  assert.equal(Object.hasOwn(body[0], 'trackedLocation'), false);
  assert.equal(Object.hasOwn(body[0], 'deviceType'), false);
});

test('[beemaps-burst-control-016] aborts the call after 30 seconds and clears the timer when the call ends', async () => {
  const stalled = (url, init) =>
    new Promise((resolve, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const { promise, timers, cleared, calls } = create(stalled);
  await tick();
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 30000);
  assert.equal(calls[0].init.signal.aborted, false);
  timers[0].fn();
  assert.equal(calls[0].init.signal.aborted, true);
  assert.deepEqual(await promise, { kind: 'unknown', upstreamStatus: null });
  assert.deepEqual(cleared, [1]);
  const ok = create(() => created());
  await ok.promise;
  assert.deepEqual(ok.cleared, [1]);
});

test('[beemaps-burst-control-017] gives a created burst for the status 200, success true and exactly one burst with a text _id', async () => {
  const result = await create(() => created()).promise;
  assert.deepEqual(result, {
    kind: 'created',
    upstreamStatus: 200,
    burst: {
      id: '6501aa11bb22cc33dd44ee55',
      status: 'active',
      validUntil: '2026-10-22T12:00:00.000Z',
      credits: 125,
    },
    creditsRemaining: 500,
  });
  assert.equal(JSON.stringify(result).includes('CANARY'), false);
});

test('[beemaps-burst-control-017] gives status, validUntil, credits and creditsRemaining as null when they have the wrong shape', async () => {
  const bad = await create(() =>
    created(
      { creditsRemaining: -1 },
      { status: 'sleeping', validUntil: 5, credits: '125' },
    ),
  ).promise;
  assert.deepEqual(bad.burst, {
    id: BURST._id,
    status: null,
    validUntil: null,
    credits: null,
  });
  assert.equal(bad.creditsRemaining, null);
  for (const [value, expected] of [
    [500, 500],
    [0, 0],
    [-1, null],
    [1.5, null],
    ['5', null],
    [null, null],
    [undefined, null],
  ])
    assert.equal(
      (await create(() => created({ creditsRemaining: value })).promise)
        .creditsRemaining,
      expected,
      String(value),
    );
  for (const status of ['active', 'expired', 'refunded'])
    assert.equal(
      (await create(() => created({}, { status })).promise).burst.status,
      status,
    );
  assert.equal(
    (await create(() => created({}, { credits: 250 })).promise).burst.credits,
    250,
  );
  assert.equal(
    (await create(() => created({}, { credits: 0 })).promise).burst.credits,
    0,
  );
});

test('[beemaps-burst-control-018] gives a refusal for the statuses 400, 401, 402, 403 and 429 with the status of the answer of the route', async () => {
  const rows = [
    [
      400,
      {
        kind: 'refused',
        upstreamStatus: 400,
        status: 400,
        error: 'bad_request',
      },
    ],
    [
      401,
      {
        kind: 'refused',
        upstreamStatus: 401,
        status: 403,
        error: 'key_rejected',
      },
    ],
    [
      403,
      {
        kind: 'refused',
        upstreamStatus: 403,
        status: 403,
        error: 'key_rejected',
      },
    ],
    [
      402,
      { kind: 'refused', upstreamStatus: 402, status: 402, error: 'no_credit' },
    ],
    [
      429,
      {
        kind: 'refused',
        upstreamStatus: 429,
        status: 429,
        error: 'upstream_rate_limit',
        retryAfter: 60,
      },
    ],
  ];
  for (const [code, expected] of rows) {
    const { promise, calls } = create(() => status(code));
    assert.deepEqual(await promise, expected, String(code));
    assert.equal(calls.length, 1);
  }
});

test('[beemaps-burst-control-018] decides a refusal by the status and does not read the body', async () => {
  for (const code of [400, 401, 402, 403, 429]) {
    const result = await create(
      () =>
        new Response(
          new ReadableStream({ pull: () => new Promise(() => {}) }),
          { status: code },
        ),
    ).promise;
    assert.equal(result.kind, 'refused', String(code));
    const html = await create(
      () =>
        new Response('<html>nope</html>', {
          status: code,
          headers: { 'content-type': 'text/html' },
        }),
    ).promise;
    assert.equal(html.kind, 'refused', String(code));
    const ok = await create(() =>
      json({ success: true, bursts: [BURST] }, code),
    ).promise;
    assert.equal(ok.kind, 'refused', String(code));
  }
});

test('[beemaps-burst-control-018] reads retryAfter from digits, 600 at most, and gives 60 for anything else', async () => {
  for (const [header, seconds] of [
    ['1', 1],
    ['30', 30],
    ['600', 600],
    ['601', 600],
    ['99999', 600],
    ['0', 60],
    ['00', 60],
    ['-5', 60],
    ['+30', 60],
    ['5.5', 60],
    ['5x', 60],
    ['', 60],
    ['Wed, 21 Oct 2026 07:28:00 GMT', 60],
    [undefined, 60],
    [null, 60],
  ]) {
    assert.equal(retryAfterOf(header), seconds, String(header));
    const headers =
      header === undefined || header === null ? {} : { 'retry-after': header };
    const result = await create(() => status(429, headers)).promise;
    assert.equal(result.retryAfter, seconds, String(header));
  }
});

test('[beemaps-burst-control-019] gives unknown for a status 200 that does not say created exactly once', async () => {
  const bodies = [
    { success: false, bursts: [BURST] },
    { success: 'true', bursts: [BURST] },
    { success: 1, bursts: [BURST] },
    { bursts: [BURST] },
    { success: true },
    { success: true, bursts: [] },
    { success: true, bursts: [BURST, BURST] },
    { success: true, bursts: BURST },
    { success: true, bursts: null },
    { success: true, bursts: [{ ...BURST, _id: undefined }] },
    { success: true, bursts: [{ ...BURST, _id: 5 }] },
    { success: true, bursts: [{ ...BURST, _id: '' }] },
    { success: true, bursts: [null] },
    { success: true, bursts: ['x'] },
    [],
    null,
    'text',
    5,
  ];
  for (const body of bodies) {
    const { promise, calls } = create(() => json(body));
    assert.deepEqual(
      await promise,
      { kind: 'unknown', upstreamStatus: 200 },
      JSON.stringify(body),
    );
    assert.equal(calls.length, 1);
  }
});

test('[beemaps-burst-control-019] gives unknown for a status 200 with a body that is not JSON or is larger than 1 MiB', async () => {
  for (const respond of [
    () => new Response('not json', { status: 200 }),
    () => new Response('', { status: 200 }),
    () => new Response('{"success":', { status: 200 }),
    () => new Response('x'.repeat(1024 * 1024 + 1), { status: 200 }),
    () =>
      new Response('x', {
        status: 200,
        headers: { 'content-length': String(1024 * 1024 + 1) },
      }),
  ])
    assert.deepEqual(await create(respond).promise, {
      kind: 'unknown',
      upstreamStatus: 200,
    });
  const exact = JSON.stringify({
    success: true,
    bursts: [BURST],
    pad: 'x'.repeat(1024 * 1024 - 400),
  });
  assert.equal(Buffer.byteLength(exact) <= 1024 * 1024, true);
  assert.equal(
    (await create(() => new Response(exact, { status: 200 })).promise).kind,
    'created',
  );
});

test('[beemaps-burst-control-019] gives unknown for every other status and keeps the status for the audit line', async () => {
  for (const code of [
    201, 202, 204, 301, 302, 307, 404, 405, 408, 409, 418, 500, 502, 503, 504,
  ]) {
    const { promise, calls } = create(() => status(code));
    assert.deepEqual(
      await promise,
      { kind: 'unknown', upstreamStatus: code },
      String(code),
    );
    assert.equal(calls.length, 1);
  }
  assert.equal(
    (await create(() => json({ success: true, bursts: [BURST] }, 201)).promise)
      .kind,
    'unknown',
  );
});

test('[beemaps-burst-control-019] gives unknown with no status when the fetch function rejects or the 30 seconds end while it reads the body', async () => {
  assert.deepEqual(
    await create(() => {
      throw new TypeError('fetch failed');
    }).promise,
    { kind: 'unknown', upstreamStatus: null },
  );
  assert.deepEqual(
    await create(() => Promise.reject(new Error(`redirect ${KEY}`))).promise,
    { kind: 'unknown', upstreamStatus: null },
  );
  const { promise, timers } = create(endless);
  await new Promise((resolve) => setTimeout(resolve, 20));
  timers[0].fn();
  assert.deepEqual(await promise, { kind: 'unknown', upstreamStatus: 200 });
});

test('[beemaps-burst-control-034] sends one GET to the list address with limit 100, two headers and a redirect option of error', async () => {
  const { promise, calls, timers, cleared } = list(() =>
    json({ bursts: [], total: 0 }),
  );
  await promise;
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    'https://beemaps.com/api/developer/bursts?limit=100',
  );
  assert.equal(calls[0].init.method ?? 'GET', 'GET');
  assert.equal(calls[0].init.body, undefined);
  assert.deepEqual(calls[0].init.headers, {
    Authorization: `Basic ${KEY}`,
    Accept: 'application/json',
  });
  assert.equal(calls[0].init.redirect, 'error');
  assert.equal(calls[0].init.signal instanceof AbortSignal, true);
  assert.equal(timers[0].ms, 20000);
  assert.deepEqual(cleared, [1]);
});

const LISTED = (n, extra = {}) => ({
  _id: `b${n}`,
  geojson: { type: 'Polygon', coordinates: [RING] },
  status: 'active',
  isHit: true,
  latestHitAt: '2026-10-16T01:00:00.000Z',
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
  amount: 125,
  createdAt: 'CANARY-created',
  ...extra,
});

test('[beemaps-burst-control-034] gives each burst with the seven fields and no other field', async () => {
  const result = await list(() =>
    json({ bursts: [LISTED(1)], total: 7, skip: 0 }),
  ).promise;
  assert.deepEqual(result, {
    ok: true,
    total: 7,
    bursts: [
      {
        id: 'b1',
        status: 'active',
        isHit: true,
        latestHitAt: '2026-10-16T01:00:00.000Z',
        validUntil: '2026-10-22T12:00:00.000Z',
        credits: 125,
        bbox: [9.982014, 59.991007, 10.017986, 60.008993],
      },
    ],
  });
  assert.equal(JSON.stringify(result).includes('CANARY'), false);
});

test('[beemaps-burst-control-035] drops an item that is not an object or has no text _id', async () => {
  const result = await list(() =>
    json({
      bursts: [
        null,
        5,
        'x',
        [],
        LISTED(1, { _id: undefined }),
        LISTED(2, { _id: 5 }),
        LISTED(3, { _id: '' }),
        LISTED(4),
      ],
      total: 8,
    }),
  ).promise;
  assert.deepEqual(
    result.bursts.map((b) => b.id),
    ['b4'],
  );
});

test('[beemaps-burst-control-035] gives isHit, status, latestHitAt, validUntil and credits their default when they have the wrong shape', async () => {
  const result = await list(() =>
    json({
      bursts: [
        LISTED(1, {
          isHit: 'yes',
          status: 'sleeping',
          latestHitAt: 5,
          validUntil: null,
          credits: '125',
        }),
      ],
    }),
  ).promise;
  const [burst] = result.bursts;
  assert.equal(burst.isHit, false);
  assert.equal(burst.status, null);
  assert.equal(burst.latestHitAt, null);
  assert.equal(burst.validUntil, null);
  assert.equal(burst.credits, null);
  for (const status of ['active', 'expired', 'refunded'])
    assert.equal(
      (await list(() => json({ bursts: [LISTED(1, { status })] })).promise)
        .bursts[0].status,
      status,
    );
  assert.equal(
    (await list(() => json({ bursts: [LISTED(1, { isHit: false })] })).promise)
      .bursts[0].isHit,
    false,
  );
});

test('[beemaps-burst-control-035] gives bbox from the ring of geojson rounded to 6 decimals and null when the ring is not valid', async () => {
  const at = (geojson) =>
    list(() => json({ bursts: [LISTED(1, { geojson })] })).promise.then(
      (r) => r.bursts[0].bbox,
    );
  assert.deepEqual(
    await at({
      type: 'Polygon',
      coordinates: [
        [
          [10.0000004, 60],
          [10.02, 60],
          [10.02, 60.0100006],
          [10, 60.0100006],
          [10.0000004, 60],
        ],
      ],
    }),
    [10, 60, 10.02, 60.010001],
  );
  for (const geojson of [
    undefined,
    null,
    'x',
    {},
    { type: 'Polygon' },
    { type: 'Polygon', coordinates: [] },
    { type: 'Polygon', coordinates: [[]] },
    {
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      ],
    },
    {
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
          ['7', 8],
        ],
      ],
    },
    {
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
          [NaN, 8],
        ],
      ],
    },
    { type: 'Polygon', coordinates: [[[1, 2], [3, 4], [5, 6], [7]]] },
    { type: 'Polygon', coordinates: [[[1, 2], [3, 4], [5, 6], null]] },
    { type: 'Polygon', coordinates: 'x' },
  ])
    assert.equal(await at(geojson), null, JSON.stringify(geojson));
});

test('[beemaps-burst-control-035] gives total from the answer when it is a whole number of 0 or more, and else the number of items kept', async () => {
  const items = [LISTED(1), LISTED(2)];
  for (const [total, expected] of [
    [7, 7],
    [0, 0],
    [-1, 2],
    [1.5, 2],
    ['7', 2],
    [null, 2],
    [undefined, 2],
  ])
    assert.equal(
      (await list(() => json({ bursts: items, total })).promise).total,
      expected,
      String(total),
    );
});

test('[beemaps-burst-control-035] keeps at most 100 items', async () => {
  const items = Array.from({ length: 101 }, (_, n) => LISTED(n));
  const result = await list(() => json({ bursts: items, total: 500 })).promise;
  assert.equal(result.bursts.length, 100);
  assert.equal(result.bursts[0].id, 'b0');
  assert.equal(result.bursts[99].id, 'b99');
  assert.equal(result.total, 500);
});

test('[beemaps-burst-control-036] gives key_rejected for 401 and 403 and upstream_failed for every other failure of the list call', async () => {
  for (const code of [401, 403])
    assert.deepEqual(
      await list(() => status(code)).promise,
      { ok: false, error: 'key_rejected' },
      String(code),
    );
  for (const code of [400, 402, 404, 429, 500, 502, 301, 204, 201])
    assert.deepEqual(
      await list(() => status(code)).promise,
      { ok: false, error: 'upstream_failed' },
      String(code),
    );
  for (const respond of [
    () => new Response('not json', { status: 200 }),
    () => json({ nope: true }),
    () => json({ bursts: 'x' }),
    () => json([]),
    () => json(null),
    () => new Response('x'.repeat(1024 * 1024 + 1), { status: 200 }),
    () => {
      throw new TypeError('fetch failed');
    },
  ])
    assert.deepEqual(await list(respond).promise, {
      ok: false,
      error: 'upstream_failed',
    });
  const { promise, timers } = list(endless);
  await new Promise((resolve) => setTimeout(resolve, 20));
  timers[0].fn();
  assert.deepEqual(await promise, { ok: false, error: 'upstream_failed' });
});

test('[beemaps-burst-control-018] gives the result of a refusal also when the body cannot be cancelled', async () => {
  const stuck = (code) =>
    new Response(
      new ReadableStream({ cancel: () => Promise.reject(new Error('stuck')) }),
      { status: code },
    );
  assert.equal((await create(() => stuck(403)).promise).kind, 'refused');
  assert.equal((await create(() => stuck(500)).promise).kind, 'unknown');
  assert.equal((await list(() => stuck(401)).promise).ok, false);
});
