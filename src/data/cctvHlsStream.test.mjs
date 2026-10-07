import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHlsPuller,
  fetchHlsBytes,
  parseHlsMedia,
  HLS_LIMITS,
} from '../../server/providers/cctv/stream.js';
const realSetTimeout = globalThis.setTimeout;
const playlist =
  '#EXTM3U\n#EXT-X-MEDIA-SEQUENCE:12\n#EXTINF:2,\na.ts\n#EXTINF:2,\nb.ts\n#EXTINF:2,\nc.ts\n';
const base = 'https://camera.example/live/list.m3u8';

test('playlist parser uses sequence, refuses escaping and unsupported references', () => {
  assert.deepEqual(
    parseHlsMedia(playlist, base).map((s) => s.seq),
    [12, 13, 14],
  );
  for (const bad of [
    playlist.replace('a.ts', 'https://evil.example/a.ts'),
    playlist.replace('a.ts', '//evil.example/a.ts'),
    '#EXTM3U\n#EXT-X-KEY:METHOD=AES-128\n' + playlist,
    playlist.replace('12', '-1'),
    playlist.replace('2,', 'Infinity,'),
  ])
    assert.throws(() => parseHlsMedia(bad, base));
});

test('downloads reject redirect responses, oversized declared and chunked bodies', async () => {
  let init;
  await assert.rejects(
    fetchHlsBytes(base, {
      maxBytes: 5,
      fetchImpl: async (_url, options) => {
        init = options;
        return new Response('', {
          status: 302,
          headers: { Location: 'https://evil.example' },
        });
      },
    }),
  );
  assert.equal(init.redirect, 'error');
  await assert.rejects(
    fetchHlsBytes(base, {
      maxBytes: 5,
      fetchImpl: async () => new Response('abcdef'),
    }),
  );
  await assert.rejects(
    fetchHlsBytes(base, {
      maxBytes: 5,
      fetchImpl: async () =>
        new Response('a', { headers: { 'content-length': '100' } }),
    }),
  );
});

test('one session is reserved before await; disk-free cache and capacity remain bounded', async () => {
  const manager = createHlsPuller({
    limits: {
      ...HLS_LIMITS,
      sessions: 1,
      segmentBytes: 4,
      sessionBytes: 6,
      segments: 2,
      pollMs: 100000,
    },
    fetchImpl: async (url) =>
      new Response(url.endsWith('.m3u8') ? playlist : 'abc'),
  });
  const [a, b] = await Promise.all([
    manager.ensure('a', base),
    manager.ensure('a', base),
  ]);
  assert.equal(a, b);
  await assert.rejects(manager.ensure('b', base));
  assert.equal(await manager.waitReady(a), true);
  assert.deepEqual(manager.stats(), { sessions: 1, bytes: 6 });
  const text = await manager.buildPlaylist(a, 'a');
  assert.match(text, /seg_0\.ts\?session=/);
  assert.equal(manager.getSegment('a', 'stale-token', 0), null);
  assert.equal(manager.getSegment('a', a.token, 0).length, 3);
  manager.stop('a', 'stale-token');
  assert.equal(manager.stats().sessions, 1);
  manager.stop('a', a.token);
  assert.deepEqual(manager.stats(), { sessions: 0, bytes: 0 });
  await manager.shutdown();
});

test('shutdown cancels in-flight downloads and late responses cannot refill cache', async () => {
  let observed;
  const manager = createHlsPuller({
    fetchImpl: async (_url, { signal }) => {
      observed = signal;
      return new Promise((resolve, reject) =>
        signal.addEventListener('abort', () => reject(new Error('cancelled')), {
          once: true,
        }),
      );
    },
  });
  const entry = await manager.ensure('a', base);
  await manager.shutdown();
  assert.equal(observed.aborted, true);
  assert.equal(entry.stopping, true);
  assert.deepEqual(manager.stats(), { sessions: 0, bytes: 0 });
  await assert.rejects(manager.ensure('a', base));
});

test('idle cleanup stops all polling without a background sweep', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const cleared = [];
  const clearTimer = globalThis.clearTimeout;
  t.mock.method(globalThis, 'clearTimeout', (timer) => {
    cleared.push(timer);
    return clearTimer(timer);
  });
  let calls = 0;
  const manager = createHlsPuller({
    limits: { ...HLS_LIMITS, idleMs: 15, pollMs: 100000 },
    fetchImpl: async (url) => {
      calls++;
      return new Response(url.endsWith('.m3u8') ? playlist : 'abc');
    },
  });
  const entry = await manager.ensure('a', base);
  await entry.polling;
  const pollTimer = entry.timer;
  t.mock.timers.tick(50);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(manager.stats(), { sessions: 0, bytes: 0 });
  assert.equal(cleared.includes(pollTimer), true);
  const stoppedCalls = calls;
  t.mock.timers.tick(100000);
  await new Promise((resolve) => realSetTimeout(resolve, 5));
  assert.equal(calls, stoppedCalls);
  await manager.shutdown();
});

test('agency sequence rollback creates a monotonic local discontinuity', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  let current = playlist;
  const manager = createHlsPuller({
    limits: { ...HLS_LIMITS, pollMs: 5 },
    fetchImpl: async (url) =>
      new Response(url.endsWith('.m3u8') ? current : 'abc'),
  });
  const entry = await manager.ensure('a', base);
  await entry.polling;
  assert.equal(await manager.waitReady(entry), true);
  const before = await manager.buildPlaylist(entry, 'a');
  assert.match(before, /seg_0\.ts/);
  current = playlist.replace('SEQUENCE:12', 'SEQUENCE:0');
  t.mock.timers.tick(30);
  await entry.polling;
  await new Promise((resolve) => setImmediate(resolve));
  const changedPoll = entry.polling;
  t.mock.timers.tick(5);
  assert.notEqual(entry.polling, changedPoll);
  await entry.polling;
  const after = await manager.buildPlaylist(entry, 'a');
  assert.match(
    after,
    /#EXT-X-DISCONTINUITY\n#EXTINF:2\.000,\n\/api\/cctv\/media\/a\/seg_3\.ts/,
  );
  await manager.shutdown();
});

test('upstream discontinuity tags survive the media parser', () => {
  const parsed = parseHlsMedia(
    playlist.replace('a.ts', 'a.ts\n#EXT-X-DISCONTINUITY'),
    base,
  );
  assert.equal(parsed[0].discontinuity, false);
  assert.equal(parsed[1].discontinuity, true);
});

test('a reused agency sequence with changed segment URI cannot remain stale', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  let current = playlist;
  const manager = createHlsPuller({
    limits: { ...HLS_LIMITS, pollMs: 5 },
    fetchImpl: async (url) =>
      new Response(url.endsWith('.m3u8') ? current : 'abc'),
  });
  const entry = await manager.ensure('a', base);
  await entry.polling;
  assert.equal(await manager.waitReady(entry), true);
  current = playlist.replaceAll('.ts', '.ts?generation=2');
  t.mock.timers.tick(30);
  await entry.polling;
  await new Promise((resolve) => setImmediate(resolve));
  const changedPoll = entry.polling;
  t.mock.timers.tick(5);
  assert.notEqual(entry.polling, changedPoll);
  await entry.polling;
  assert.match(
    await manager.buildPlaylist(entry, 'a'),
    /#EXT-X-DISCONTINUITY\n#EXTINF:2\.000,\n\/api\/cctv\/media\/a\/seg_3\.ts/,
  );
  await manager.shutdown();
});

test('two consumers share downloads but release and abandoned expiry are independent', async () => {
  let downloads = 0;
  const manager = createHlsPuller({
    limits: { ...HLS_LIMITS, pollMs: 100000, leasesPerSession: 2 },
    fetchImpl: async (url) => {
      downloads++;
      return new Response(url.endsWith('.m3u8') ? playlist : 'abc');
    },
  });
  const [a, b] = await Promise.all([
    manager.ensure('camera', base, 'viewer-a'),
    manager.ensure('camera', base, 'viewer-b'),
  ]);
  assert.equal(a, b);
  await manager.waitReady(a);
  assert.equal(downloads, 4); // One manifest and three segments, not per consumer.
  assert.equal(a.leases.size, 2);
  await assert.rejects(manager.ensure('camera', base, 'viewer-c'));
  manager.release('camera', 'viewer-a');
  assert.equal(manager.stats().sessions, 1);
  assert.equal(manager.getSegment('camera', a.token, 0, 'viewer-a'), null);
  assert.equal(manager.getSegment('camera', a.token, 0, 'viewer-b').length, 3);
  assert.match(
    await manager.buildPlaylist(b, 'camera', 'viewer-b'),
    /lease=viewer-b/,
  );
  manager.release('camera', 'viewer-a'); // Duplicate/late release cannot stop B.
  assert.equal(b.controller.signal.aborted, false);
  manager.release('camera', 'viewer-b');
  assert.equal(b.controller.signal.aborted, true);
  assert.deepEqual(manager.stats(), { sessions: 0, bytes: 0 });
  await manager.shutdown();
});

test('an abandoned consumer expires while a renewed consumer keeps the session', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const manager = createHlsPuller({
    limits: { ...HLS_LIMITS, idleMs: 80, pollMs: 100000 },
    fetchImpl: async (url) =>
      new Response(url.endsWith('.m3u8') ? playlist : 'abc'),
  });
  const entry = await manager.ensure('camera', base, 'abandoned');
  await manager.ensure('camera', base, 'active');
  await entry.polling;
  t.mock.timers.tick(50);
  await new Promise((resolve) => setImmediate(resolve));
  await manager.ensure('camera', base, 'active');
  await entry.polling;
  t.mock.timers.tick(50);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(entry.leases.has('abandoned'), false);
  assert.equal(entry.leases.has('active'), true);
  assert.equal(entry.controller.signal.aborted, false);
  await manager.shutdown();
});
