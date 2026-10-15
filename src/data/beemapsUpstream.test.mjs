import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import {
  callUpstream,
  UPSTREAM_URL,
} from '../../server/providers/beemaps/upstream.js';

const RING = [
  [10, 60],
  [10.02, 60],
  [10.02, 60.01],
  [10, 60.01],
  [10, 60],
];
const KEY = 'fixture-key-Z9y8';
const URL_BASE = 'https://beemaps.com/api/developer/latest/poly';

/** Run `callUpstream` with a fake fetch function and a recording timer. */
function run(respond, options = {}) {
  const calls = [];
  const timers = [];
  const cleared = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return respond(url, init);
  };
  const promise = callUpstream({
    fetchImpl,
    key: KEY,
    ring: RING,
    since: null,
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: (id) => cleared.push(id),
    ...options,
  });
  return { promise, calls, timers, cleared };
}
const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
const status = (code, headers = {}) =>
  new Response('{"error":"CANARY-body"}', { status: code, headers });

test('[beemaps-source-014] sends one POST to the fixed URL with the catalog option and no date', async () => {
  const { promise, calls } = run(() => json({ frames: [] }));
  const result = await promise;
  assert.deepEqual(result, { ok: true, document: { frames: [] } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${URL_BASE}?catalog=true`);
  assert.equal(UPSTREAM_URL, URL_BASE);
  assert.equal(calls[0].init.method, 'POST');
});

test('[beemaps-source-014] adds min_week after the catalog option when it has a date', async () => {
  const { promise, calls } = run(() => json({ frames: [] }), {
    since: '2026-10-01',
  });
  await promise;
  assert.equal(calls[0].url, `${URL_BASE}?catalog=true&min_week=2026-10-01`);
});

test('[beemaps-source-014] sends the polygon as the JSON body with the longitude first', async () => {
  const { promise, calls } = run(() => json({ frames: [] }));
  await promise;
  assert.equal(
    calls[0].init.body,
    '{"type":"Polygon","coordinates":[[[10,60],[10.02,60],[10.02,60.01],[10,60.01],[10,60]]]}',
  );
});

test('[beemaps-source-014] sends the key only in the header Authorization and sets two more headers', async () => {
  const { promise, calls } = run(() => json({ frames: [] }));
  await promise;
  assert.deepEqual(calls[0].init.headers, {
    Authorization: `Basic ${KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  assert.equal(calls[0].url.includes(KEY), false);
  assert.equal(calls[0].init.body.includes(KEY), false);
});

test('[beemaps-source-014] refuses a redirect and aborts the request after 20 seconds', async () => {
  const { promise, calls, timers, cleared } = run(() => json({ frames: [] }));
  await promise;
  assert.equal(calls[0].init.redirect, 'error');
  assert.equal(calls[0].init.signal.aborted, false);
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 20000);
  timers[0].fn();
  assert.equal(calls[0].init.signal.aborted, true);
  assert.deepEqual(cleared, [1]);
});

test('[beemaps-source-015] holds the one upstream URL once and no other URL in the provider files', () => {
  const files = providerFiles();
  assert.deepEqual(Object.keys(files).sort(), [
    'beemaps.js',
    'beemaps/budget.js',
    'beemaps/normalize.js',
    'beemaps/upstream.js',
    'beemaps/validate.js',
  ]);
  const urls = Object.values(files).flatMap(
    (text) => text.match(/https?:\/\/[^\s'"`)]+/g) ?? [],
  );
  assert.deepEqual(urls, [URL_BASE]);
  const hosts = Object.values(files).flatMap(
    (text) => text.match(/beemaps\.com/g) ?? [],
  );
  assert.deepEqual(hosts, ['beemaps.com']);
  const paths = Object.values(files).flatMap(
    (text) => text.match(/\/api\/developer\/latest\/poly/g) ?? [],
  );
  assert.deepEqual(paths, ['/api/developer/latest/poly']);
  assert.match(files['beemaps/upstream.js'], /fetchImpl\(url\.toString\(\)/);
});

test('[beemaps-source-015] holds no text burst in any letter case in the provider files', () => {
  for (const [name, text] of Object.entries(providerFiles()))
    assert.equal(/burst/i.test(text), false, name);
});

test('[beemaps-source-015] fails on a request to any other URL', async () => {
  const strict = async (url) => {
    assert.equal(url, `${URL_BASE}?catalog=true`);
    return json({ frames: [] });
  };
  const ok = await run(strict).promise;
  assert.equal(ok.ok, true);
  await assert.rejects(
    strict(`${URL_BASE.replace('latest/poly', 'burst/create')}?catalog=true`),
  );
});

test('[beemaps-source-023] names an upstream refusal of the key, the credit and the rate', async () => {
  for (const code of [401, 403]) {
    const result = await run(() => status(code)).promise;
    assert.deepEqual(result, { ok: false, kind: 'key_rejected' }, String(code));
  }
  assert.deepEqual(await run(() => status(402)).promise, {
    ok: false,
    kind: 'no_credit',
  });
  assert.deepEqual(
    await run(() => status(429, { 'retry-after': '30' })).promise,
    {
      ok: false,
      kind: 'upstream_rate_limit',
      retryAfter: 30,
    },
  );
});

test('[beemaps-source-023] reads retryAfter from digits only from 1 to 600 and gives 60 in all other cases', async () => {
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
  ]) {
    const headers = header === undefined ? {} : { 'retry-after': header };
    const result = await run(() => status(429, headers)).promise;
    assert.equal(result.retryAfter, seconds, String(header));
  }
});

test('[beemaps-source-023] gives upstream_failed for any other status that is not 2xx', async () => {
  for (const code of [400, 404, 405, 408, 500, 502, 503, 301, 302]) {
    const result = await run(() => status(code)).promise;
    assert.deepEqual(
      result,
      { ok: false, kind: 'upstream_failed' },
      String(code),
    );
  }
  for (const code of [200, 201]) {
    const result = await run(() => new Response('{}', { status: code }))
      .promise;
    assert.equal(result.ok, true, String(code));
  }
});

test('[beemaps-source-023] gives upstream_failed for a thrown error and does not leak its text', async () => {
  const result = await run(() => {
    throw new TypeError(`fetch failed for ${KEY}`);
  }).promise;
  assert.deepEqual(result, { ok: false, kind: 'upstream_failed' });
});

test('[beemaps-source-023] gives upstream_failed for a timeout before the headers', async () => {
  const stalled = (url, init) =>
    new Promise((resolve, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const { promise, timers, cleared } = run(stalled);
  await new Promise((resolve) => setImmediate(resolve));
  timers[0].fn();
  assert.deepEqual(await promise, { ok: false, kind: 'upstream_failed' });
  assert.deepEqual(cleared, [1]);
});

test('[beemaps-source-023] gives upstream_failed for a timeout while it reads the body', async () => {
  const stalledBody = () =>
    new Response(new ReadableStream({ pull: () => new Promise(() => {}) }), {
      status: 200,
    });
  const { promise, timers } = run(stalledBody);
  await new Promise((resolve) => setTimeout(resolve, 20));
  timers[0].fn();
  assert.deepEqual(await promise, { ok: false, kind: 'upstream_failed' });
});

test('[beemaps-source-023] gives bad_upstream for a body that is not JSON', async () => {
  for (const text of ['', 'not json', '<html>error</html>', '{"frames":']) {
    const result = await run(() => new Response(text, { status: 200 })).promise;
    assert.deepEqual(result, { ok: false, kind: 'bad_upstream' }, text);
  }
});

test('[beemaps-source-023] reads a body of exactly 4194304 bytes and gives bad_upstream for one byte more', async () => {
  const pad = (size) => {
    const head = '{"frames":[],"pad":"';
    const tail = '"}';
    return head + 'a'.repeat(size - head.length - tail.length) + tail;
  };
  const exact = pad(4194304);
  assert.equal(Buffer.byteLength(exact), 4194304);
  const fits = await run(() => new Response(exact, { status: 200 })).promise;
  assert.equal(fits.ok, true);
  const over = pad(4194305);
  const tooLarge = await run(() => new Response(over, { status: 200 })).promise;
  assert.deepEqual(tooLarge, { ok: false, kind: 'bad_upstream' });
  const declared = await run(
    () =>
      new Response('{}', {
        status: 200,
        headers: { 'content-length': '4194305' },
      }),
  ).promise;
  assert.deepEqual(declared, { ok: false, kind: 'bad_upstream' });
});

function providerFiles() {
  const base = new URL('../../server/providers/', import.meta.url);
  const files = {
    'beemaps.js': readFileSync(new URL('beemaps.js', base), 'utf8'),
  };
  for (const name of readdirSync(new URL('beemaps/', base)))
    files[`beemaps/${name}`] = readFileSync(
      new URL(`beemaps/${name}`, base),
      'utf8',
    );
  return files;
}
