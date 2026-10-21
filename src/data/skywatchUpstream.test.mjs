import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RESULTS_PATH_END,
  SEARCH_URL,
  runSearch,
} from '../../server/providers/skywatch/upstream.js';

const KEY = 'fixture-key-Q7';
const BOX = [10, 60, 10.02, 60.01];
const SEARCH = 'https://api.skywatch.co/earthcache/archive/search';
const RESULTS = (id) =>
  `https://api.skywatch.co/earthcache/archive/search/${id}/search_results?per_page=50`;
const json = (status, value, headers = {}) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
const started = (id = 'search-1') => json(200, { data: { id } });
const results = (data = [], extra = {}) => json(200, { data, ...extra });
const pending = () => json(202, { status: { message: 'in progress' } });
/** Let the streams and the promises of a request run. */
const settle = async () => {
  for (let i = 0; i < 10; i++) await new Promise((resolve) => setImmediate(resolve));
};

/** Run one search with a fake fetch that answers from a list, and fake timers and waits. */
async function search(answers, options = {}) {
  const calls = [];
  const waits = [];
  const timers = [];
  const cleared = [];
  const queue = [...answers];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    const next = queue.shift();
    if (next === undefined) throw new Error('no answer left');
    if (typeof next === 'function') return next(url, init);
    return next;
  };
  const result = await runSearch({
    fetchImpl,
    key: KEY,
    bbox: BOX,
    start: '2026-10-01',
    end: '2026-10-20',
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
    wait: async (ms) => {
      waits.push(ms);
    },
    ...options,
  });
  return { result, calls, waits, timers, cleared };
}

test('[skywatch-source-011] starts the search with one POST request of the fixed body to the fixed URL', async () => {
  const { result, calls } = await search([started(), results()]);
  assert.equal(result.ok, true);
  assert.equal(SEARCH_URL, SEARCH);
  assert.equal(calls[0].url, SEARCH);
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    location: {
      type: 'Polygon',
      coordinates: [
        [
          [10, 60],
          [10.02, 60],
          [10.02, 60.01],
          [10, 60.01],
          [10, 60],
        ],
      ],
    },
    start_date: '2026-10-01',
    end_date: '2026-10-20',
    order_by: '-date',
  });
  assert.deepEqual(calls[0].init.headers, {
    'x-api-key': KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  assert.equal(calls[0].init.redirect, 'error');
  assert.ok(calls[0].init.signal instanceof AbortSignal);
});

test('[skywatch-source-011] uses the start and the end of the request, and the corners of the box in order', async () => {
  const { calls } = await search([started(), results()], {
    bbox: [-1.5, 2.25, -1.25, 2.5],
    start: '2026-01-01',
    end: '2026-04-02',
  });
  const body = JSON.parse(calls[0].init.body);
  assert.deepEqual(body.location.coordinates[0], [
    [-1.5, 2.25],
    [-1.25, 2.25],
    [-1.25, 2.5],
    [-1.5, 2.5],
    [-1.5, 2.25],
  ]);
  assert.equal(body.start_date, '2026-01-01');
  assert.equal(body.end_date, '2026-04-02');
});

test('[skywatch-source-012] reads the results with GET requests and the same headers, with no body', async () => {
  const { result, calls } = await search([
    started('abc_DEF-123'),
    results([{ id: 'x' }], { pagination: { total: 1 } }),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.polls, 1);
  assert.deepEqual(result.document, {
    data: [{ id: 'x' }],
    pagination: { total: 1 },
  });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, RESULTS('abc_DEF-123'));
  assert.equal(RESULTS_PATH_END, '/search_results?per_page=50');
  assert.equal(calls[1].init.method, 'GET');
  assert.equal(calls[1].init.body, undefined);
  assert.deepEqual(calls[1].init.headers, {
    'x-api-key': KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  assert.equal(calls[1].init.redirect, 'error');
});

test('[skywatch-source-012] waits 2000 ms after each of the first nine answers 202 and stops after the tenth', async () => {
  const nine = Array.from({ length: 9 }, pending);
  const good = await search([started(), ...nine, results()]);
  assert.equal(good.result.ok, true);
  assert.equal(good.result.polls, 10);
  assert.deepEqual(good.waits, Array(9).fill(2000));
  assert.equal(good.calls.length, 11);

  const ten = Array.from({ length: 10 }, pending);
  const timeout = await search([started(), ...ten]);
  assert.deepEqual(timeout.result, {
    ok: false,
    kind: 'search_timeout',
    polls: 10,
  });
  assert.deepEqual(timeout.waits, Array(9).fill(2000));
  assert.equal(timeout.calls.length, 11);
});

test('[skywatch-source-012] sends the next result request only after the wait ends', async () => {
  let release;
  const order = [];
  const calls = [];
  const answers = [started(), pending(), results()];
  const running = runSearch({
    fetchImpl: async (url) => {
      calls.push(String(url));
      order.push(`fetch ${calls.length}`);
      return answers.shift();
    },
    key: KEY,
    bbox: BOX,
    start: '2026-10-01',
    end: '2026-10-20',
    setTimer: () => 1,
    clearTimer: () => {},
    wait: (ms) =>
      new Promise((resolve) => {
        order.push(`wait ${ms}`);
        release = resolve;
      }),
  });
  await settle();
  assert.deepEqual(order, ['fetch 1', 'fetch 2', 'wait 2000']);
  release();
  const result = await running;
  assert.equal(result.ok, true);
  assert.deepEqual(order, ['fetch 1', 'fetch 2', 'wait 2000', 'fetch 3']);
});

test('[skywatch-source-012] refuses a search id of another form and sends no result request', async () => {
  for (const id of [
    '',
    'a'.repeat(129),
    'has space',
    'dot.id',
    'slash/id',
    'é',
    '../x',
    5,
    null,
    undefined,
  ]) {
    const data = id === undefined ? {} : { id };
    const { result, calls } = await search([json(200, { data })]);
    assert.deepEqual(result, { ok: false, kind: 'bad_upstream', polls: 0 }, String(id));
    assert.equal(calls.length, 1);
  }
  const longest = await search([started('a'.repeat(128)), results()]);
  assert.equal(longest.result.ok, true);
});

test('[skywatch-source-012 skywatch-source-019] refuses a search document that is not an object or has no object data', async () => {
  for (const value of [null, [], 5, 'text', {}, { data: null }, { data: [] }, { data: 'x' }]) {
    const { result, calls } = await search([json(200, value)]);
    assert.deepEqual(result, { ok: false, kind: 'bad_upstream', polls: 0 }, JSON.stringify(value));
    assert.equal(calls.length, 1);
  }
});

test('[skywatch-source-019] refuses a results document that is not an object, or whose data is not an array', async () => {
  for (const value of [null, [], 5, 'text', {}, { data: null }, { data: {} }, { data: 'x' }]) {
    const { result } = await search([started(), json(200, value)]);
    assert.deepEqual(result, { ok: false, kind: 'bad_upstream', polls: 1 }, JSON.stringify(value));
  }
});

test('[skywatch-source-019] names the failure of each status of the search request', async () => {
  for (const [status, kind] of [
    [401, 'key_rejected'],
    [403, 'key_rejected'],
    [201, 'upstream_failed'],
    [202, 'upstream_failed'],
    [204, 'upstream_failed'],
    [400, 'upstream_failed'],
    [404, 'upstream_failed'],
    [500, 'upstream_failed'],
    [503, 'upstream_failed'],
  ]) {
    const { result, calls } = await search([json(status, { data: { id: 'x' } })]);
    assert.deepEqual(result, { ok: false, kind, polls: 0 }, String(status));
    assert.equal(calls.length, 1);
  }
});

test('[skywatch-source-019] names the failure of each status of a result request', async () => {
  for (const [status, kind] of [
    [401, 'key_rejected'],
    [403, 'key_rejected'],
    [201, 'upstream_failed'],
    [204, 'upstream_failed'],
    [400, 'upstream_failed'],
    [500, 'upstream_failed'],
  ]) {
    const { result } = await search([started(), pending(), json(status, { data: [] })]);
    assert.deepEqual(result, { ok: false, kind, polls: 2 }, String(status));
  }
});

test('[skywatch-source-019] gives the seconds of Retry-After for an answer 429', async () => {
  for (const [header, seconds] of [
    ['1', 1],
    ['30', 30],
    ['600', 600],
    ['601', 600],
    ['99999', 600],
    ['0', 60],
    ['-5', 60],
    ['1.5', 60],
    [' 30', 60],
    ['30s', 60],
    ['Wed, 21 Oct 2026 07:28:00 GMT', 60],
    [undefined, 60],
  ]) {
    const headers = header === undefined ? {} : { 'retry-after': header };
    const first = await search([json(429, {}, headers)]);
    assert.deepEqual(
      first.result,
      { ok: false, kind: 'upstream_rate_limit', retryAfter: seconds, polls: 0 },
      String(header),
    );
    const later = await search([started(), json(429, {}, headers)]);
    assert.equal(later.result.retryAfter, seconds, String(header));
    assert.equal(later.result.polls, 1);
  }
});

test('[skywatch-source-019] reads the body only of an answer 200', async () => {
  let read = 0;
  const watched = (status) => {
    const response = json(status, { data: { id: 'x' } });
    const text = response.text.bind(response);
    response.text = async () => {
      read++;
      return text();
    };
    Object.defineProperty(response, 'body', {
      get() {
        read++;
        return null;
      },
    });
    return response;
  };
  await search([watched(500)]);
  await search([started(), watched(202), watched(403)]);
  assert.equal(read, 0);
});

test('[skywatch-source-019] gives upstream_failed for a network error and a redirect', async () => {
  const network = await search([
    async () => {
      throw new TypeError('fetch failed');
    },
  ]);
  assert.deepEqual(network.result, { ok: false, kind: 'upstream_failed', polls: 0 });
  const redirect = await search([
    started(),
    async (_url, init) => {
      assert.equal(init.redirect, 'error');
      throw new TypeError('redirect mode is set to error');
    },
  ]);
  assert.deepEqual(redirect.result, { ok: false, kind: 'upstream_failed', polls: 1 });
});

test('[skywatch-source-019] starts a timer of 15000 ms before each request and clears it after the body', async () => {
  const { timers, cleared } = await search([started(), pending(), results()]);
  assert.deepEqual(
    timers.map((timer) => timer.ms),
    [15000, 15000, 15000],
  );
  assert.deepEqual(cleared, [1, 2, 3]);
});

test('[skywatch-source-019] stops a request when its timer fires, also while it reads the body', async () => {
  const hanging = (url, init) =>
    new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      );
    });
  let fire;
  const run = search([hanging], {
    setTimer: (fn) => {
      fire = fn;
      return 1;
    },
  });
  await settle();
  fire();
  const before = await run;
  assert.deepEqual(before.result, { ok: false, kind: 'upstream_failed', polls: 0 });

  let fireBody;
  const slowBody = (_url, init) => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"data":'));
        init.signal.addEventListener('abort', () =>
          controller.error(new DOMException('aborted', 'AbortError')),
        );
      },
    });
    return new Response(stream, { status: 200 });
  };
  const timers = [];
  const runBody = search([slowBody], {
    setTimer: (fn) => {
      timers.push(fn);
      fireBody = fn;
      return 1;
    },
  });
  await settle();
  fireBody();
  const during = await runBody;
  assert.deepEqual(during.result, { ok: false, kind: 'upstream_failed', polls: 0 });
});

test('[skywatch-source-019] gives bad_upstream for a body that is not JSON or is too large, and reads a body of 4194304 bytes', async () => {
  const text = (status, body) =>
    new Response(body, { status, headers: { 'content-type': 'application/json' } });
  const notJson = await search([text(200, 'not json')]);
  assert.deepEqual(notJson.result, { ok: false, kind: 'bad_upstream', polls: 0 });
  const head = '{"data":[],"pad":"';
  const exact = head + 'a'.repeat(4194304 - head.length - 2) + '"}';
  assert.equal(Buffer.byteLength(exact), 4194304);
  const fits = await search([started(), text(200, exact)]);
  assert.equal(fits.result.ok, true);
  const over = await search([started(), text(200, exact.replace('"}', 'a"}'))]);
  assert.deepEqual(over.result, { ok: false, kind: 'bad_upstream', polls: 1 });
});
