import test from 'node:test';
import assert from 'node:assert/strict';
import { createThumbnailLoader } from './thumbnails.js';
import { BOX, response, settle } from './testDoubles.mjs';

const candidate = (product, day) => ({
  key: `${product}:${day}`,
  product,
  day,
});

/** A fetch whose responses the test releases, in any order. */
function fakeFetch() {
  const calls = [];
  const impl = (url, { signal } = {}) =>
    new Promise((resolve, reject) => {
      signal?.addEventListener('abort', () =>
        reject(Object.assign(new Error('aborted'), { name: 'AbortError' })),
      );
      calls.push({ url, signal, resolve });
    });
  const respond = (index, { ok = true, present = 'true' } = {}) =>
    calls[index].resolve(
      response({
        ok,
        headers: {
          'Data-Present': present,
          'Acquisition-Time': '2026-09-18T17:12:00Z',
        },
      }),
    );
  return { impl, calls, respond };
}

function fixture(options = {}) {
  const fetch = fakeFetch();
  const created = [];
  const revoked = [];
  const loader = createThumbnailLoader({
    fetchImpl: fetch.impl,
    createObjectUrl: () => {
      created.push(`blob:${created.length + 1}`);
      return created.at(-1);
    },
    revokeObjectUrl: (url) => revoked.push(url),
    ...options,
  });
  return { loader, fetch, created, revoked };
}

test('[recent-imagery-023] Data-Present decides the day: present with an object URL and sensing time, empty, or error', async () => {
  const { loader, fetch, created } = fixture();
  const changes = [];
  loader.subscribe((key) => changes.push(key));
  loader.request(candidate('S30', '2026-09-18'), BOX, 0);
  loader.request(candidate('L30', '2026-09-16'), BOX, 1);
  loader.request(candidate('VIIRS', '2026-09-15'), BOX, 2);
  assert.equal(loader.get('S30:2026-09-18').loading, true);
  assert.match(
    fetch.calls[0].url,
    /wvs\.earthdata\.nasa\.gov.*HLS_S30.*TIME=2026-09-18.*WIDTH=256&HEIGHT=256/,
  );
  fetch.respond(0);
  fetch.respond(1, { present: 'false' });
  fetch.respond(2, { ok: false });
  await settle();
  assert.deepEqual(loader.get('S30:2026-09-18'), {
    status: 'present',
    objectUrl: 'blob:1',
    acquisitionTime: '2026-09-18T17:12:00Z',
    loading: false,
  });
  assert.equal(loader.get('L30:2026-09-16').status, 'empty');
  assert.equal(loader.get('VIIRS:2026-09-15').status, 'error');
  assert.deepEqual(created, ['blob:1']);
  assert.deepEqual(changes.sort(), [
    'L30:2026-09-16',
    'S30:2026-09-18',
    'VIIRS:2026-09-15',
  ]);
  assert.equal(loader.get('nope').status, 'unknown');
});

test('[recent-imagery-024] at most maxInFlight fetches run and the queue drains by priority', async () => {
  const { loader, fetch } = fixture({ maxInFlight: 2 });
  loader.request(candidate('S30', '2026-09-10'), BOX, 5);
  loader.request(candidate('S30', '2026-09-11'), BOX, 1);
  loader.request(candidate('S30', '2026-09-12'), BOX, 0);
  loader.request(candidate('S30', '2026-09-13'), BOX, 3);
  // The pump is eager: the first two arrivals start at once, the rest queue.
  assert.equal(fetch.calls.length, 2);
  assert.match(fetch.calls[0].url, /TIME=2026-09-10/);
  assert.match(fetch.calls[1].url, /TIME=2026-09-11/);
  assert.deepEqual(loader.stats(), {
    inFlight: 2,
    queued: 2,
    decoded: 0,
    tracked: 4,
  });
  fetch.respond(0);
  await settle();
  assert.equal(fetch.calls.length, 3);
  assert.match(fetch.calls[2].url, /TIME=2026-09-12/, 'priority 0 before 3');
  // A repeat request for a queued key just re-prioritises it.
  loader.request(candidate('S30', '2026-09-13'), BOX, 0);
  assert.equal(loader.stats().tracked, 4);
  fetch.respond(1);
  await settle();
  assert.equal(fetch.calls.length, 4);
  assert.match(fetch.calls[3].url, /TIME=2026-09-13/);
});

test('[recent-imagery-024] requestOrdered loads the focused card first, then outward, then the margins', () => {
  const { loader, fetch } = fixture({ maxInFlight: 10 });
  const candidates = Array.from({ length: 8 }, (_, i) =>
    candidate('S30', `2026-09-${String(10 + i).padStart(2, '0')}`),
  );
  loader.requestOrdered(candidates, BOX, {
    focusIndex: 3,
    firstVisible: 2,
    lastVisible: 5,
    extra: 1,
  });
  const days = fetch.calls.map(
    (call) => /TIME=2026-09-(\d\d)/.exec(call.url)[1],
  );
  assert.deepEqual(days, ['13', '14', '12', '15', '16', '11']);
});

test('[recent-imagery-025] decoded thumbnails are evicted least-recently-used and revoked; a read is not a use and an evicted day keeps what it learned', async () => {
  const { loader, fetch, revoked } = fixture({
    maxInFlight: 10,
    maxDecoded: 2,
  });
  loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  loader.request(candidate('S30', '2026-09-11'), BOX, 1);
  loader.request(candidate('S30', '2026-09-12'), BOX, 2);
  fetch.respond(0);
  fetch.respond(1);
  await settle();
  assert.equal(loader.stats().decoded, 2);
  loader.get('S30:2026-09-10'); // reading the oldest does not make it recent
  fetch.respond(2);
  await settle();
  assert.equal(loader.stats().decoded, 2);
  assert.deepEqual(revoked, ['blob:1']);
  const evicted = loader.get('S30:2026-09-10');
  assert.equal(evicted.status, 'present', 'availability survives eviction');
  assert.equal(evicted.objectUrl, null);
  assert.equal(evicted.acquisitionTime, '2026-09-18T17:12:00Z');
  assert.equal(loader.stats().tracked, 3, 'the entry is kept');
  assert.equal(loader.get('S30:2026-09-11').objectUrl, 'blob:2');
  assert.equal(loader.get('S30:2026-09-12').objectUrl, 'blob:3');
  // A repeat request IS a use, and re-fetches an evicted day without ever
  // reporting it unknown; 11 is now the LRU and goes when 10 comes back.
  loader.request(candidate('S30', '2026-09-12'), BOX, 0);
  loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  assert.equal(fetch.calls.length, 4, 'an evicted day is fetched again');
  assert.equal(loader.get('S30:2026-09-10').status, 'present');
  assert.equal(loader.get('S30:2026-09-10').loading, true);
  fetch.respond(3);
  await settle();
  assert.equal(loader.get('S30:2026-09-10').objectUrl, 'blob:4');
  assert.deepEqual(revoked, ['blob:1', 'blob:2']);
  assert.equal(loader.get('S30:2026-09-11').status, 'present');
  assert.equal(loader.get('S30:2026-09-12').objectUrl, 'blob:3');
  // A day that already holds an image is not fetched twice.
  loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  assert.equal(fetch.calls.length, 4);
});

test('[recent-imagery-025] reading every card in strip order (a snapshot) never decides who is evicted; evicted days stay known and come back on request', async () => {
  const { loader, fetch, revoked } = fixture({
    maxInFlight: 20,
    maxDecoded: 9,
  });
  const candidates = Array.from({ length: 20 }, (_, i) =>
    candidate('S30', `2026-09-${String(i + 1).padStart(2, '0')}`),
  );
  candidates.forEach((c, i) => loader.request(c, BOX, i));
  assert.equal(fetch.calls.length, 20);
  // Decode the strip back to front, leaving the newest card in flight.
  for (let i = 19; i >= 1; i -= 1) fetch.respond(i);
  await settle();
  const holders = () =>
    candidates.filter((c) => loader.get(c.key).objectUrl).map((c) => c.key);
  assert.equal(loader.stats().decoded, 9);
  assert.equal(loader.stats().tracked, 20);
  assert.deepEqual(
    holders(),
    candidates.slice(1, 10).map((c) => c.key),
    'the nine most recently decoded',
  );
  // Sweep every card in strip order, several times, as getSnapshot does.
  for (let pass = 0; pass < 3; pass += 1)
    for (const c of candidates) loader.get(c.key);
  assert.deepEqual(
    holders(),
    candidates.slice(1, 10).map((c) => c.key),
  );
  // The last decode evicts the least recently DECODED card, not the first
  // card the sweep happened to read.
  fetch.respond(0);
  await settle();
  assert.deepEqual(
    holders(),
    candidates.slice(0, 9).map((c) => c.key),
  );
  assert.equal(revoked.length, 11);
  for (const c of candidates) {
    const entry = loader.get(c.key);
    assert.equal(entry.status, 'present', `${c.key} stays present`);
    assert.equal(entry.acquisitionTime, '2026-09-18T17:12:00Z');
    assert.equal(entry.loading, false);
  }
  // Re-requesting an evicted day fetches it again and it holds an image.
  const evictedKey = candidates[15].key;
  assert.equal(loader.get(evictedKey).objectUrl, null);
  loader.request(candidates[15], BOX, 0);
  assert.equal(fetch.calls.length, 21);
  assert.equal(loader.get(evictedKey).status, 'present');
  fetch.respond(20);
  await settle();
  assert.ok(loader.get(evictedKey).objectUrl);
  assert.equal(loader.stats().decoded, 9);
  assert.equal(loader.stats().tracked, 20);
});

test('[recent-imagery-026] cancelAll aborts in-flight fetches and a late settle never leaks an object URL', async () => {
  const { loader, fetch, created, revoked } = fixture({ maxInFlight: 1 });
  loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  loader.request(candidate('S30', '2026-09-11'), BOX, 1);
  const signal = fetch.calls[0].signal;
  loader.cancelAll();
  assert.equal(signal.aborted, true);
  assert.deepEqual(loader.stats(), {
    inFlight: 1,
    queued: 0,
    decoded: 0,
    tracked: 0,
  });
  await settle();
  assert.equal(loader.stats().inFlight, 0);
  assert.deepEqual(created, []);
  assert.deepEqual(revoked, []);
  assert.equal(loader.get('S30:2026-09-10').status, 'unknown');
});

test('[recent-imagery-027] clear and destroy revoke every resident thumbnail', async () => {
  const { loader, fetch, revoked } = fixture({ maxInFlight: 10 });
  loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  loader.request(candidate('S30', '2026-09-11'), BOX, 1);
  fetch.respond(0);
  fetch.respond(1);
  await settle();
  loader.clear();
  assert.deepEqual(revoked.sort(), ['blob:1', 'blob:2']);
  assert.equal(loader.stats().tracked, 0);
  loader.request(candidate('S30', '2026-09-12'), BOX, 0);
  fetch.respond(2);
  await settle();
  loader.destroy();
  assert.equal(revoked.length, 3);
  loader.request(candidate('S30', '2026-09-13'), BOX, 0);
  assert.equal(fetch.calls.length, 3, 'a destroyed loader fetches nothing');
});

test('[recent-imagery-026] a request queued behind an aborted fetch still starts once the abort settles', async () => {
  // A response that arrives after the abort (the fetch ignored the signal).
  const calls = [];
  const fetchImpl = (url, { signal } = {}) =>
    new Promise((resolve) => calls.push({ url, signal, resolve }));
  const loader = createThumbnailLoader({
    fetchImpl,
    maxInFlight: 1,
    createObjectUrl: () => 'blob:x',
    revokeObjectUrl: () => {},
  });
  loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  loader.clear();
  loader.request(candidate('S30', '2026-09-11'), BOX, 0);
  assert.equal(calls[0].signal.aborted, true);
  assert.deepEqual(loader.stats(), {
    inFlight: 1,
    queued: 1,
    decoded: 0,
    tracked: 1,
  });
  calls[0].resolve({
    ok: true,
    headers: { get: () => null },
    blob: async () => ({}),
  });
  await settle();
  assert.equal(calls.length, 2, 'the replacement request was pumped');
  assert.match(calls[1].url, /TIME=2026-09-11/);
  assert.deepEqual(loader.stats(), {
    inFlight: 1,
    queued: 0,
    decoded: 0,
    tracked: 1,
  });

  // The same sequence when the fetch rejects with AbortError instead.
  const rejecting = fixture({ maxInFlight: 1 });
  rejecting.loader.request(candidate('S30', '2026-09-10'), BOX, 0);
  rejecting.loader.clear();
  rejecting.loader.request(candidate('S30', '2026-09-11'), BOX, 0);
  await settle();
  assert.equal(rejecting.fetch.calls.length, 2);
  assert.deepEqual(rejecting.loader.stats(), {
    inFlight: 1,
    queued: 0,
    decoded: 0,
    tracked: 1,
  });
});

test('[recent-imagery-023 recent-imagery-027] loader defaults own URLs and release them', async () => {
  const originalFetch = globalThis.fetch;
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  const revoked = [];
  globalThis.fetch = async () => ({
    ok: true,
    blob: async () => ({ size: 2 }),
  });
  URL.createObjectURL = () => 'blob:default';
  URL.revokeObjectURL = (url) => revoked.push(url);
  try {
    const loader = createThumbnailLoader({ maxInFlight: 0, maxDecoded: 0 });
    const off = loader.subscribe(null);
    assert.equal(off(), undefined);
    loader.request(null, BOX);
    loader.request(candidate('S30', '2026-09-18'), null);
    assert.equal(loader.stats().tracked, 0);
    loader.request(candidate('S30', '2026-09-18'), BOX);
    await settle();
    assert.deepEqual(loader.get('S30:2026-09-18'), {
      status: 'present',
      objectUrl: 'blob:default',
      acquisitionTime: null,
      loading: false,
    });
    loader.destroy();
    loader.destroy();
    loader.request(candidate('S30', '2026-09-19'), BOX);
    assert.equal(loader.stats().tracked, 0);
    assert.deepEqual(revoked, ['blob:default']);
  } finally {
    globalThis.fetch = originalFetch;
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test('[recent-imagery-023 recent-imagery-027] listener and URL errors do not stop image release', async () => {
  const f = fixture({
    revokeObjectUrl: () => {
      throw new Error('gone');
    },
  });
  const warnings = [];
  const warn = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  try {
    const off = f.loader.subscribe(() => {
      throw new Error('listener');
    });
    f.loader.request(candidate('S30', '2026-09-18'), BOX);
    f.fetch.respond(0);
    await settle();
    assert.deepEqual(warnings, [
      '[Data:RecentImagery] thumbnail listener failed:',
    ]);
    off();
    f.loader.clear();
    assert.equal(f.loader.stats().decoded, 0);
  } finally {
    console.warn = warn;
  }
});

test('[recent-imagery-026] abort after blob data does not make an image', async () => {
  let finish;
  const created = [];
  const loader = createThumbnailLoader({
    fetchImpl: async () => ({
      ok: true,
      blob: () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    }),
    createObjectUrl: () => {
      created.push('image');
      return 'blob:late';
    },
  });
  loader.request(candidate('S30', '2026-09-18'), BOX);
  await settle();
  loader.cancelAll();
  finish({});
  await settle();
  assert.deepEqual(created, []);
  assert.equal(loader.stats().inFlight, 0);
  assert.equal(loader.get('S30:2026-09-18').status, 'unknown');
});

test('[recent-imagery-023 recent-imagery-026] fetch errors and abort errors have distinct states', async () => {
  for (const name of ['Error', 'AbortError']) {
    const loader = createThumbnailLoader({
      fetchImpl: async () => {
        throw Object.assign(new Error('fetch'), { name });
      },
    });
    loader.request(candidate('S30', '2026-09-18'), BOX);
    await settle();
    assert.equal(
      loader.get('S30:2026-09-18').status,
      name === 'Error' ? 'error' : 'unknown',
    );
    assert.equal(loader.stats().inFlight, 0);
    loader.destroy();
  }
});

test('[recent-imagery-026] a callback that clears the loader revokes its late URL', async () => {
  const revoked = [];
  let loader;
  loader = createThumbnailLoader({
    fetchImpl: async () => response(),
    createObjectUrl: () => {
      loader.clear();
      return 'blob:late';
    },
    revokeObjectUrl: (url) => revoked.push(url),
  });
  loader.request(candidate('S30', '2026-09-18'), BOX);
  await settle();
  assert.deepEqual(revoked, ['blob:late']);
  assert.equal(loader.stats().tracked, 0);
});

test('[recent-imagery-026] late empty response after abort leaves the day unknown', async () => {
  let finish;
  const loader = createThumbnailLoader({
    fetchImpl: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  loader.request(candidate('S30', '2026-09-18'), BOX);
  loader.cancelAll();
  finish({ ok: true, headers: { get: () => 'false' } });
  await settle();
  assert.equal(loader.get('S30:2026-09-18').status, 'unknown');
  assert.equal(loader.stats().tracked, 0);
});

test('[recent-imagery-024] duplicate active request uses one fetch', async () => {
  const f = fixture();
  f.loader.request(candidate('S30', '2026-09-18'), BOX);
  f.loader.request(candidate('S30', '2026-09-18'), BOX);
  assert.equal(f.fetch.calls.length, 1);
  f.fetch.respond(0);
  await settle();
  assert.equal(f.loader.stats().decoded, 1);
  f.loader.destroy();
});

test('[recent-imagery-026] late settlement after destroy leaves the queue empty', async () => {
  let finish;
  const loader = createThumbnailLoader({
    fetchImpl: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  loader.request(candidate('S30', '2026-09-18'), BOX);
  loader.destroy();
  finish(response());
  await settle();
  assert.equal(loader.stats().queued, 0);
  assert.equal(loader.stats().tracked, 0);
});

test('[recent-imagery-023] each thumbnail subscriber gets the same day result', async () => {
  const f = fixture();
  const first = [],
    second = [];
  f.loader.subscribe((key) => first.push(key));
  f.loader.subscribe((key) => second.push(key));
  f.loader.request(candidate('S30', '2026-09-18'), BOX);
  f.fetch.respond(0);
  await settle();
  assert.deepEqual(first, ['S30:2026-09-18']);
  assert.deepEqual(second, ['S30:2026-09-18']);
  f.loader.destroy();
});

test('[recent-imagery-025] image eviction does not send a notice for an empty day', async () => {
  const f = fixture({ maxDecoded: 1 }),
    changes = [];
  f.loader.subscribe((key) => changes.push(key));
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  f.fetch.respond(0, { present: 'false' });
  await settle();
  f.loader.request(candidate('S30', '2026-09-11'), BOX);
  f.fetch.respond(1);
  await settle();
  changes.length = 0;
  f.loader.request(candidate('S30', '2026-09-12'), BOX);
  f.fetch.respond(2);
  await settle();
  assert.deepEqual(changes, ['S30:2026-09-11', 'S30:2026-09-12']);
  f.loader.destroy();
});

test('[recent-imagery-023] a new successful fetch updates the acquisition time', async () => {
  const f = fixture({ maxDecoded: 1 });
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  f.fetch.respond(0);
  await settle();
  f.loader.request(candidate('S30', '2026-09-11'), BOX);
  f.fetch.respond(1);
  await settle();
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  f.fetch.calls[2].resolve(
    response({
      headers: {
        'Data-Present': 'true',
        'Acquisition-Time': '2026-09-10T18:00:00Z',
      },
    }),
  );
  await settle();
  assert.equal(
    f.loader.get('S30:2026-09-10').acquisitionTime,
    '2026-09-10T18:00:00Z',
  );
  f.loader.destroy();
});

test('[recent-imagery-023] a known empty day does not start another fetch', async () => {
  const f = fixture();
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  f.fetch.respond(0, { present: 'false' });
  await settle();
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  assert.equal(f.fetch.calls.length, 1);
  f.loader.destroy();
});

test('[recent-imagery-026] a signal that stops the fetch does not send another day notice', async () => {
  const calls = [],
    changes = [];
  const f = fixture({
    maxDecoded: 1,
    fetchImpl: (url, { signal }) =>
      new Promise((resolve, reject) => calls.push({ resolve, reject, signal })),
  });
  f.loader.subscribe((key) => changes.push(key));
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  calls[0].resolve(response());
  await settle();
  f.loader.request(candidate('S30', '2026-09-11'), BOX);
  calls[1].resolve(response());
  await settle();
  f.loader.request(candidate('S30', '2026-09-10'), BOX);
  changes.length = 0;
  f.loader.cancelAll();
  calls[2].reject(new Error('stopped'));
  await settle();
  assert.deepEqual(changes, []);
  f.loader.destroy();
});
