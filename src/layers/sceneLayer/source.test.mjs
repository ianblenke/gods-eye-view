import test from 'node:test';
import assert from 'node:assert/strict';
import { createSceneSource } from './source.js';

const SERVICES = [
  {
    service: 'planet',
    layer: 'planet-scenes',
    name: 'Planet Scenes',
    list: 'Planet scenes',
    label: 'Planet',
    icon: '🪐',
    key: 'PLANET_API_KEY',
    thumbs: 'PLANET_THUMBNAILS',
    route: '/api/planet',
  },
  {
    service: 'skyfi',
    layer: 'skyfi-scenes',
    name: 'SkyFi Scenes',
    list: 'SkyFi scenes',
    label: 'SkyFi',
    icon: '🛰',
    key: 'SKYFI_API_KEY',
    thumbs: 'SKYFI_THUMBNAILS',
    route: '/api/skyfi',
  },
];

for (const S of SERVICES) {
  const BBOX = [9.568326, 59.784163, 10.431674, 60.215837];
  const SEARCH = { bbox: BBOX, start: '2026-07-22', end: '2026-10-21' };
  const RING = [
    [10, 60],
    [10.2, 60],
    [10.2, 60.1],
    [10, 60.1],
    [10, 60],
  ];
  const GOOD = {
    source: `${S.label}`,
    scenes: [
      {
        id: 'scene-1',
        start: '2026-10-14T08:03:00.000Z',
        end: null,
        footprint: { type: 'Polygon', coordinates: [RING] },
        resolutionM: 0.5,
        provider: 'Satellogic',
        product: null,
        cloudPercent: 3,
        coveragePercent: 100,
        areaKm2: 120,
        pricePerKm2: null,
        cost: null,
        thumbnail: true,
      },
    ],
    count: 1,
    total: 1,
    truncated: false,
    cached: false,
    budget: { used: 3, limit: 20 },
  };
  const PNG = Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1,
  ]);
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status });
  const image = (bytes, type, status = 200) =>
    new Response(bytes, {
      status,
      headers: type === null ? {} : { 'Content-Type': type },
    });
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
    const source = createSceneSource(S.service, {
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
  const search = (made, extra = {}) =>
    made.source.searchScenes({ ...SEARCH, ...extra });
  const thumbnail = (made, extra = {}) =>
    made.source.getThumbnail({ id: 'scene-1', ...extra });

  test(`[scene-layers-010] ${S.label}: sends one GET for the status route with the signal and reads configured`, async () => {
    for (const configured of [true, false]) {
      const { source, calls } = make(() => json({ configured }));
      const signal = new AbortController().signal;
      assert.deepEqual(await source.getStatus({ signal }), {
        ok: true,
        configured,
      });
      assert.equal(calls.length, 1);
      assert.equal(calls[0].url, `${S.route}/status`);
      assert.equal(calls[0].init.signal, signal);
      assert.equal(calls[0].init.method ?? 'GET', 'GET');
      assert.equal(calls[0].init.body, undefined);
    }
  });

  test(`[scene-layers-010] ${S.label}: gives ok false for another body, for a status that is not 2xx and for a rejection`, async () => {
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

  test(`[scene-layers-011] ${S.label}: sends one POST with one header and the box and the dates as the body`, async () => {
    const made = make(() => json(GOOD));
    const signal = new AbortController().signal;
    await search(made, { signal });
    const { calls } = made;
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, `${S.route}/scenes`);
    assert.equal(calls[0].init.method, 'POST');
    assert.deepEqual(calls[0].init.headers, {
      'Content-Type': 'application/json',
    });
    assert.equal(
      calls[0].init.body,
      '{"bbox":[9.568326,59.784163,10.431674,60.215837],"start":"2026-07-22","end":"2026-10-21"}',
    );
    assert.equal(calls[0].init.signal instanceof AbortSignal, true);
    assert.notEqual(calls[0].init.signal, signal);
    assert.equal(calls[0].init.signal.aborted, false);
  });

  test(`[scene-layers-011] ${S.label}: gives the result of the answer records for a good answer`, async () => {
    const result = await search(make(() => json(GOOD)));
    assert.deepEqual(result, {
      ok: true,
      answer: {
        scenes: [
          {
            id: 'scene-1',
            time: Date.parse('2026-10-14T08:03:00.000Z'),
            rings: [RING],
            resolutionM: 0.5,
            provider: 'Satellogic',
            cloudPercent: 3,
            thumbnail: true,
          },
        ],
        total: 1,
        truncated: false,
        used: 3,
        limit: 20,
      },
    });
  });

  test(`[scene-layers-012] ${S.label}: gives the status, the error and the whole numbers of an error body`, async () => {
    const body = {
      error: 'budget',
      used: 20,
      limit: 20,
      retryAfter: 30,
      extra: 'CANARY',
    };
    assert.deepEqual(await search(failing(body, 429)), {
      ok: false,
      status: 429,
      error: 'budget',
      used: 20,
      limit: 20,
      retryAfter: 30,
    });
    assert.deepEqual(await search(failing({ error: 'cross_origin' }, 403)), {
      ok: false,
      status: 403,
      error: 'cross_origin',
    });
    for (const value of [-1, 1.5, '3', null, NaN, Infinity, {}, []]) {
      const result = await search(
        failing(
          { error: 'budget', used: value, limit: value, retryAfter: value },
          429,
        ),
      );
      assert.deepEqual(
        result,
        { ok: false, status: 429, error: 'budget' },
        String(value),
      );
    }
    assert.deepEqual(
      await search(
        failing({ error: 'budget', used: 0, limit: 0, retryAfter: 0 }, 429),
      ),
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

  test(`[scene-layers-012] ${S.label}: gives the error unknown for a JSON body without a text error`, async () => {
    for (const body of [{}, { error: 5 }, { error: null }, [], 'x', null])
      assert.deepEqual(await search(failing(body, 418)), {
        ok: false,
        status: 418,
        error: 'unknown',
      });
  });

  test(`[scene-layers-012] ${S.label}: gives the error bad_answer for a body that is not JSON`, async () => {
    for (const status of [200, 403, 502]) {
      const made = make(() => new Response('<html>error</html>', { status }));
      assert.deepEqual(await search(made), {
        ok: false,
        status,
        error: 'bad_answer',
      });
    }
  });

  test(`[scene-layers-012] ${S.label}: reads a body of 8388608 bytes and gives bad_answer for one byte more`, async () => {
    const pad = (size) => {
      const head = '{"scenes":[],"pad":"';
      return head + 'a'.repeat(size - head.length - 2) + '"}';
    };
    const exact = pad(8388608);
    assert.equal(Buffer.byteLength(exact), 8388608);
    const fits = await search(make(() => new Response(exact)));
    assert.equal(fits.ok, true);
    const over = await search(make(() => new Response(pad(8388609))));
    assert.deepEqual(over, { ok: false, status: 200, error: 'bad_answer' });
    const declared = await search(
      make(
        () => new Response('{}', { headers: { 'content-length': '8388609' } }),
      ),
    );
    assert.deepEqual(declared, { ok: false, status: 200, error: 'bad_answer' });
  });

  test(`[scene-layers-012] ${S.label}: reads at most 8388608 bytes of the body of an answer that is not 2xx`, async () => {
    const pad = (size) => {
      const head = '{"error":"budget","pad":"';
      return head + 'a'.repeat(size - head.length - 2) + '"}';
    };
    const exact = pad(8388608);
    assert.equal(Buffer.byteLength(exact), 8388608);
    assert.deepEqual(
      await search(make(() => new Response(exact, { status: 429 }))),
      { ok: false, status: 429, error: 'budget' },
    );
    assert.deepEqual(
      await search(make(() => new Response(pad(8388609), { status: 429 }))),
      { ok: false, status: 429, error: 'bad_answer' },
    );
  });

  test(`[scene-layers-015] ${S.label}: gives bad_answer with the status 200 for an answer without a list of scenes`, async () => {
    for (const body of [{}, { scenes: 'x' }, { scenes: null }, [], null, 'x'])
      assert.deepEqual(await search(make(() => json(body))), {
        ok: false,
        status: 200,
        error: 'bad_answer',
      });
  });

  test(`[scene-layers-012] ${S.label}: gives the status 0 and the error unreachable for a rejection`, async () => {
    const made = make(() => {
      throw new TypeError('fetch failed');
    });
    assert.deepEqual(await search(made), {
      ok: false,
      status: 0,
      error: 'unreachable',
    });
    assert.deepEqual(made.cleared, [1]);
  });

  test(`[scene-layers-012] ${S.label}: sends one request for each search that fails, also after the timers of the call run`, async () => {
    const rows = [
      () => json({ error: 'upstream_rate_limit', retryAfter: 30 }, 429),
      () => json({ error: 'search_timeout' }, 504),
      () => json({ error: 'upstream_failed' }, 502),
      () => json({}, 500),
      () => new Response('x'.repeat(8 * 1024 * 1024 + 1), { status: 200 }),
      stalledBody,
      () => json({ error: 'key_rejected', keyRejected: true }, 403),
      () => json({ error: 'budget', used: 20, limit: 20 }, 429),
      () => new Response('not json', { status: 500 }),
      () => json({ scenes: 'x' }),
      () => {
        throw new TypeError('fetch failed');
      },
      stalled,
    ];
    for (const respond of rows) {
      const made = make(respond);
      const pending = search(made);
      await settle();
      let fired = 0;
      while (fired < made.timers.length && fired < 5) {
        made.timers[fired].fn();
        fired += 1;
        await settle();
      }
      const result = await pending;
      assert.equal(result.ok, false);
      await settle();
      assert.equal(made.calls.length, 1);
      assert.equal(made.timers.length, 1);
    }
  });

  test(`[scene-layers-012] ${S.label}: aborts a search that does not end in 60 seconds and clears the timer`, async () => {
    const made = make(stalled);
    const pending = search(made);
    await settle();
    assert.equal(made.timers.length, 1);
    assert.equal(made.timers[0].ms, 60000);
    made.timers[0].fn();
    assert.deepEqual(await pending, {
      ok: false,
      status: 0,
      error: 'unreachable',
    });
    assert.deepEqual(made.cleared, [1]);
  });

  test(`[scene-layers-012] ${S.label}: gives the fetch function a signal of its own that follows the call and the 60 seconds`, async () => {
    const caller = new AbortController();
    const withCaller = make(stalled);
    const first = search(withCaller, { signal: caller.signal });
    await settle();
    const own = withCaller.calls[0].init.signal;
    assert.notEqual(own, caller.signal);
    assert.equal(own.aborted, false);
    caller.abort();
    assert.equal(own.aborted, true);
    await assert.rejects(first, { name: 'AbortError' });
    const alone = make(stalled);
    const second = search(alone);
    await settle();
    const ownAlone = alone.calls[0].init.signal;
    assert.equal(ownAlone.aborted, false);
    alone.timers[0].fn();
    assert.equal(ownAlone.aborted, true);
    assert.equal((await second).ok, false);
  });

  test(`[scene-layers-012] ${S.label}: removes its listener from the signal of the call when the search ends`, async () => {
    for (const respond of [() => json(GOOD), () => json({ error: 'x' }, 500)]) {
      const events = [];
      const signal = {
        aborted: false,
        throwIfAborted() {},
        addEventListener: (type, handler) =>
          events.push(['add', type, handler]),
        removeEventListener: (type, handler) =>
          events.push(['remove', type, handler]),
      };
      await search(make(respond), { signal });
      assert.deepEqual(
        events.map(([action, type]) => [action, type]),
        [
          ['add', 'abort'],
          ['remove', 'abort'],
        ],
      );
      assert.equal(events[0][2], events[1][2]);
    }
  });

  test(`[scene-layers-012] ${S.label}: gives unreachable when the 60 seconds end while it reads the body`, async () => {
    const made = make(stalledBody);
    const pending = search(made);
    await new Promise((resolve) => setTimeout(resolve, 20));
    made.timers[0].fn();
    assert.deepEqual(await pending, {
      ok: false,
      status: 0,
      error: 'unreachable',
    });
  });

  test(`[scene-layers-012] ${S.label}: rejects with the AbortError when the signal of the call aborts`, async () => {
    const made = make(stalled);
    const caller = new AbortController();
    const pending = search(made, { signal: caller.signal });
    await settle();
    caller.abort();
    await assert.rejects(pending, { name: 'AbortError' });
    assert.deepEqual(made.cleared, [1]);
    const before = new AbortController();
    before.abort();
    const idle = make(() => json(GOOD));
    await assert.rejects(search(idle, { signal: before.signal }), {
      name: 'AbortError',
    });
    assert.equal(idle.calls.length, 0);
    const body = make(stalledBody);
    const second = new AbortController();
    const waiting = search(body, { signal: second.signal });
    await new Promise((resolve) => setTimeout(resolve, 20));
    second.abort();
    await assert.rejects(waiting, { name: 'AbortError' });
  });

  test(`[scene-layers-011] ${S.label}: uses the fetch function of the page when none is given`, async (t) => {
    const urls = [];
    t.mock.method(globalThis, 'fetch', async (url) => {
      urls.push(url);
      if (url.endsWith('status')) return json({ configured: true });
      if (url.endsWith('scenes')) return json(GOOD);
      return image(PNG, 'image/png');
    });
    const source = createSceneSource(S.service);
    assert.deepEqual(await source.getStatus(), { ok: true, configured: true });
    assert.equal((await source.searchScenes(SEARCH)).ok, true);
    assert.equal((await source.getThumbnail({ id: 'scene-1' })).ok, true);
    assert.deepEqual(urls, [
      `${S.route}/status`,
      `${S.route}/scenes`,
      `${S.route}/thumbnail/scene-1`,
    ]);
  });

  test(`[scene-layers-013] ${S.label}: sends one GET for the thumbnail with a signal of its own and no other option`, async () => {
    const made = make(() => image(PNG, 'image/png'));
    const signal = new AbortController().signal;
    await thumbnail(made, { signal });
    assert.equal(made.calls.length, 1);
    assert.equal(made.calls[0].url, `${S.route}/thumbnail/scene-1`);
    assert.deepEqual(Object.keys(made.calls[0].init), ['signal']);
    assert.equal(made.calls[0].init.signal instanceof AbortSignal, true);
    assert.notEqual(made.calls[0].init.signal, signal);
    const other = make(() => image(PNG, 'image/png'));
    await other.source.getThumbnail({ id: 'A-z_09' });
    assert.equal(other.calls[0].url, `${S.route}/thumbnail/A-z_09`);
  });

  test(`[scene-layers-013] ${S.label}: gives a blob with the bytes and the media type of a good answer`, async () => {
    for (const [header, type] of [
      ['image/png', 'image/png'],
      ['image/jpeg', 'image/jpeg'],
      ['image/webp', 'image/webp'],
      ['IMAGE/PNG; charset=binary', 'image/png'],
      ['  image/webp ;x=1', 'image/webp'],
    ]) {
      const result = await thumbnail(make(() => image(PNG, header)));
      assert.equal(result.ok, true, header);
      assert.deepEqual(Object.keys(result).sort(), ['blob', 'ok']);
      assert.equal(result.blob instanceof Blob, true);
      assert.equal(result.blob.type, type, header);
      assert.deepEqual(
        new Uint8Array(await result.blob.arrayBuffer()),
        PNG,
        header,
      );
    }
    const accepted = await thumbnail(make(() => image(PNG, 'image/png', 203)));
    assert.equal(accepted.ok, true);
  });

  test(`[scene-layers-013] ${S.label}: gives bad_answer for another media type or no Content-Type`, async () => {
    for (const header of [
      'image/gif',
      'image/svg+xml',
      'text/html',
      'application/json',
      'image/pngx',
      '',
      null,
    ]) {
      const result = await thumbnail(make(() => image(PNG, header)));
      assert.deepEqual(
        result,
        { ok: false, status: 200, error: 'bad_answer' },
        String(header),
      );
    }
  });

  test(`[scene-layers-013] ${S.label}: reads a body of 1048576 bytes and gives bad_answer for one byte more`, async () => {
    const exact = new Uint8Array(1048576);
    const fits = await thumbnail(make(() => image(exact, 'image/png')));
    assert.equal(fits.ok, true);
    assert.equal(fits.blob.size, 1048576);
    const over = await thumbnail(
      make(() => image(new Uint8Array(1048577), 'image/png')),
    );
    assert.deepEqual(over, { ok: false, status: 200, error: 'bad_answer' });
  });

  test(`[scene-layers-013] ${S.label}: gives the status and the error of an answer that is not 2xx`, async () => {
    assert.deepEqual(
      await thumbnail(failing({ error: 'thumbnails_off' }, 404)),
      {
        ok: false,
        status: 404,
        error: 'thumbnails_off',
      },
    );
    assert.deepEqual(await thumbnail(failing({ error: 'rate_limited' }, 429)), {
      ok: false,
      status: 429,
      error: 'rate_limited',
    });
    for (const body of [{}, { error: 5 }, [], null])
      assert.deepEqual(await thumbnail(failing(body, 502)), {
        ok: false,
        status: 502,
        error: 'unknown',
      });
    assert.deepEqual(
      await thumbnail(make(() => new Response('<html>', { status: 404 }))),
      { ok: false, status: 404, error: 'bad_answer' },
    );
    assert.deepEqual(
      await thumbnail(make(() => image(PNG, 'image/png', 404))),
      {
        ok: false,
        status: 404,
        error: 'bad_answer',
      },
    );
  });

  test(`[scene-layers-013] ${S.label}: gives unreachable for a rejection and for a call that does not end in 20 seconds`, async () => {
    const rejecting = make(() => {
      throw new TypeError('fetch failed');
    });
    assert.deepEqual(await thumbnail(rejecting), {
      ok: false,
      status: 0,
      error: 'unreachable',
    });
    assert.deepEqual(rejecting.cleared, [1]);
    for (const respond of [
      stalled,
      () =>
        new Response(stalledBody().body, {
          headers: { 'Content-Type': 'image/png' },
        }),
    ]) {
      const made = make(respond);
      const pending = thumbnail(made);
      await new Promise((resolve) => setTimeout(resolve, 20));
      assert.equal(made.timers.length, 1);
      assert.equal(made.timers[0].ms, 20000);
      made.timers[0].fn();
      assert.deepEqual(await pending, {
        ok: false,
        status: 0,
        error: 'unreachable',
      });
      assert.deepEqual(made.cleared, [1]);
      assert.equal(made.calls.length, 1);
    }
  });

  test(`[scene-layers-013] ${S.label}: removes its listener from the signal of the call and rejects when that signal aborts`, async () => {
    for (const respond of [
      () => image(PNG, 'image/png'),
      () => json({ error: 'x' }, 500),
    ]) {
      const events = [];
      const signal = {
        aborted: false,
        throwIfAborted() {},
        addEventListener: (type, handler) =>
          events.push(['add', type, handler]),
        removeEventListener: (type, handler) =>
          events.push(['remove', type, handler]),
      };
      await thumbnail(make(respond), { signal });
      assert.deepEqual(
        events.map(([action, type]) => [action, type]),
        [
          ['add', 'abort'],
          ['remove', 'abort'],
        ],
      );
      assert.equal(events[0][2], events[1][2]);
    }
    const made = make(stalled);
    const caller = new AbortController();
    const pending = thumbnail(made, { signal: caller.signal });
    await settle();
    const own = made.calls[0].init.signal;
    caller.abort();
    assert.equal(own.aborted, true);
    await assert.rejects(pending, { name: 'AbortError' });
    assert.deepEqual(made.cleared, [1]);
    const before = new AbortController();
    before.abort();
    const idle = make(() => image(PNG, 'image/png'));
    await assert.rejects(thumbnail(idle, { signal: before.signal }), {
      name: 'AbortError',
    });
    assert.equal(idle.calls.length, 0);
    const body = make(
      () =>
        new Response(stalledBody().body, {
          headers: { 'Content-Type': 'image/png' },
        }),
    );
    const second = new AbortController();
    const waiting = thumbnail(body, { signal: second.signal });
    await new Promise((resolve) => setTimeout(resolve, 20));
    second.abort();
    await assert.rejects(waiting, { name: 'AbortError' });
  });

  test(`[scene-layers-010] ${S.label}: refuses a service that is not planet or skyfi`, () => {
    for (const service of [
      'other',
      '',
      'Planet',
      'toString',
      'constructor',
      undefined,
      null,
      5,
    ]) {
      assert.throws(() => createSceneSource(service), {
        name: 'TypeError',
        message: 'The service must be "planet" or "skyfi"',
      });
    }
  });

  test(`[scene-layers-011] ${S.label}: gives the answer with the names of the satellite providers of the service`, async () => {
    const body = {
      ...GOOD,
      scenes: GOOD.scenes.map((item) => ({
        ...item,
        provider: 'SENTINEL1_CREODIAS',
      })),
    };
    const source = createSceneSource(S.service, {
      fetchImpl: async () => json(body),
    });
    const result = await source.searchScenes(SEARCH);
    assert.equal(result.ok, true);
    const expected =
      S.service === 'skyfi' ? 'Sentinel-1' : 'SENTINEL1_CREODIAS';
    for (const item of result.answer.scenes)
      assert.equal(item.provider, expected);
  });
}
