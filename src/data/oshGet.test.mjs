import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OSH_MAX_BODY_BYTES,
  buildNextPageUrl,
  isSamePageWalk,
  oshGet,
  oshPages,
} from '../../server/providers/osh/get.js';

test('[osh-004] sends one GET request with no body and an abort signal', async () => {
  let observedUrl;
  let observedOptions;
  const result = await oshGet(
    async (url, options) => {
      observedUrl = url;
      observedOptions = options;
      return new Response(JSON.stringify({ items: [] }), { status: 200 });
    },
    'https://osh.example/api/systems',
    { headers: { Accept: 'application/json' } },
  );
  assert.equal(observedUrl, 'https://osh.example/api/systems');
  assert.equal(observedOptions.method, 'GET');
  assert.equal(observedOptions.body, undefined);
  assert.equal(observedOptions.redirect, 'manual');
  assert.ok(observedOptions.signal instanceof AbortSignal);
  assert.deepEqual(observedOptions.headers, { Accept: 'application/json' });
  assert.deepEqual(result, { status: 200, json: { items: [] } });
});

test('[osh-004] accepts a URL object and a 204 with no body', async () => {
  const result = await oshGet(
    async () => new Response(null, { status: 204 }),
    new URL('https://osh.example/api/systems'),
  );
  assert.deepEqual(result, { status: 204, json: null });
});

test('[osh-004] a non-JSON body is treated as no body', async () => {
  const result = await oshGet(
    async () => new Response('<html></html>', { status: 200 }),
    'https://osh.example/api/systems',
  );
  assert.deepEqual(result, { status: 200, json: null });
});

test('[osh-004] aborts through an external caller signal', async () => {
  const controller = new AbortController();
  const pending = oshGet(
    async (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(options.signal.reason), {
          once: true,
        });
      }),
    'https://osh.example/api/systems',
    { signal: controller.signal },
  );
  controller.abort(new Error('caller cancelled'));
  await assert.rejects(pending, /caller cancelled/);
});

test('[osh-004] an already-aborted caller signal aborts immediately, before any request', async () => {
  const controller = new AbortController();
  controller.abort(new Error('already gone'));
  let calls = 0;
  await assert.rejects(
    oshGet(
      async (_url, options) => {
        calls += 1;
        if (options.signal.aborted) throw options.signal.reason;
        return new Response('{}');
      },
      'https://osh.example/api/systems',
      { signal: controller.signal },
    ),
    /already gone/,
  );
  assert.equal(calls, 1);
});

test('[osh-013] refuses every redirect status with one upstream call', async () => {
  for (const status of [300, 301, 302, 303, 307, 308]) {
    let calls = 0;
    await assert.rejects(
      oshGet(
        async () => {
          calls += 1;
          return new Response(null, { status });
        },
        'https://osh.example/api/systems',
      ),
      (error) => error.code === 'OSH_REDIRECT' && error.status === status,
    );
    assert.equal(calls, 1);
  }
});

test('[osh-013] cancels the body of a redirected response, and ignores a cancel failure', async () => {
  let cancelled = false;
  const response = new Response(
    new ReadableStream({
      pull() {},
      cancel() {
        cancelled = true;
        return Promise.reject(new Error('cancel failed'));
      },
    }),
    { status: 302 },
  );
  await assert.rejects(
    oshGet(async () => response, 'https://osh.example/api/systems'),
    { code: 'OSH_REDIRECT' },
  );
  assert.equal(cancelled, true);
});

test('[osh-014] follows a next link only on the same origin, up to 20 pages', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async (url) => {
    calls += 1;
    const page = Number(new URL(String(url)).searchParams.get('page') || '1');
    if (page >= 21) throw new Error('page 21 must not be requested');
    return new Response(
      JSON.stringify({
        items: [{ id: `p${page}` }],
        links: [{ rel: 'next', href: `systems?page=${page + 1}` }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems?page=1', root), {
    listOf: (payload) => payload.items,
  });
  assert.equal(items.length, 20);
  assert.equal(calls, 20);
});

test('[osh-014] stops the walk at a foreign-origin next link', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        items: [{ id: 'p1' }],
        links: [{ rel: 'next', href: 'https://attacker.example/systems?page=2' }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.equal(items.length, 1);
  assert.equal(calls, 1);
});

test('[osh-014] stops when there is no next link, an unparsable href, or no links array', async () => {
  const root = new URL('https://osh.example/api/');
  for (const links of [undefined, [], [{ rel: 'next', href: 'http://[::' }], [{ rel: 'other' }]]) {
    const items = await oshPages(
      async () => new Response(JSON.stringify({ items: [{ id: 'x' }], links }), { status: 200 }),
      root,
      new URL('systems', root),
      { listOf: (payload) => payload.items },
    );
    assert.equal(items.length, 1);
  }
});

test('[osh-014] a non-2xx page status stops the walk with an error, and does not give an empty list', async () => {
  const root = new URL('https://osh.example/api/');
  await assert.rejects(
    oshPages(
      async () => new Response(JSON.stringify({}), { status: 401 }),
      root,
      new URL('systems', root),
      { listOf: (payload) => payload.items || [] },
    ),
    (error) => error.status === 401,
  );
});

test('[osh-036] isSamePageWalk() accepts a candidate that differs only in the allowed query keys', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems?limit=100');
  assert.equal(
    isSamePageWalk(new URL('https://osh.example/api/systems?limit=100&offset=100'), root, current),
    true,
  );
  assert.equal(
    isSamePageWalk(new URL('https://osh.example/api/systems?cursor=abc&page=2&startIndex=3&f=json'), root, current),
    true,
  );
});

test('[osh-036] isSamePageWalk() refuses a candidate on another path, even the same origin', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems');
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/datastreams'), root, current), false);
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/systems/delete-all'), root, current), false);
});

test('[osh-036] isSamePageWalk() refuses a candidate on another origin, even the same path', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems');
  assert.equal(
    isSamePageWalk(new URL('https://attacker.example/api/systems'), root, current),
    false,
  );
});

test('[osh-036] isSamePageWalk() refuses a candidate that carries a username or a password', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems?limit=100');
  assert.equal(
    isSamePageWalk(
      new URL('https://user:pass@osh.example/api/systems?limit=100'),
      root,
      current,
    ),
    false,
  );
  // Each half of the check needs its own case. A link with only a username,
  // or only a password, must fail as well.
  assert.equal(
    isSamePageWalk(new URL('https://user@osh.example/api/systems?limit=100'), root, current),
    false,
  );
  assert.equal(
    isSamePageWalk(new URL('https://:pass@osh.example/api/systems?limit=100'), root, current),
    false,
  );
});

test('[osh-036] isSamePageWalk() refuses a candidate with a query key outside the allowlist, such as a method override', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems?limit=100');
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/systems?_method=DELETE'), root, current), false);
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/systems?method=delete'), root, current), false);
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/systems?action=purge'), root, current), false);
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/systems?limit=100&extra=1'), root, current), false);
});

test('[osh-036] isSamePageWalk() refuses a candidate with a fragment', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems');
  assert.equal(isSamePageWalk(new URL('https://osh.example/api/systems#frag'), root, current), false);
});

test('[osh-036] a next link that the check refuses stops the walk, keeps the earlier items, and does not throw an error', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        items: [{ id: 'p1' }],
        links: [{ rel: 'next', href: 'systems?_method=DELETE' }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.deepEqual(items, [{ id: 'p1' }]);
  assert.equal(calls, 1, 'the rejected next link is never requested');
});

test('[osh-036] buildNextPageUrl() rebuilds the query so a `;` inside an allowed value cannot hide a second key', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems?limit=100');
  // URLSearchParams splits only on `&`, so this candidate's one key is
  // `limit`, with the value `1;_method=DELETE` — the check alone would
  // accept it, since `limit` is allowed. The rebuild must still make the
  // separator harmless.
  const candidate = new URL('https://osh.example/api/systems?limit=1;_method=DELETE');
  assert.deepEqual([...candidate.searchParams.keys()], ['limit']);
  const built = buildNextPageUrl(candidate, root, current);
  assert.ok(built);
  assert.equal(built.origin, root.origin);
  assert.equal(built.pathname, current.pathname);
  // `_method` is not a live key: it only ever appears as text inside the
  // one opaque `limit` value, never as its own `&`-separated key.
  assert.equal(built.searchParams.has('_method'), false);
  assert.equal([...built.searchParams.keys()].length, 1);
  assert.equal(built.searchParams.get('limit'), '1;_method=DELETE');
  assert.equal(built.search.includes(';'), false, 'a raw, unescaped `;` must not reach the wire');
});

test('[osh-036] buildNextPageUrl() returns null for a refused candidate, and a URL for an accepted one', () => {
  const root = new URL('https://osh.example/api/');
  const current = new URL('https://osh.example/api/systems?limit=100');
  assert.equal(
    buildNextPageUrl(new URL('https://attacker.example/api/systems'), root, current),
    null,
  );
  const built = buildNextPageUrl(
    new URL('https://osh.example/api/systems?limit=100&offset=100'),
    root,
    current,
  );
  assert.equal(built.search, '?limit=100&offset=100');
});

test('[osh-036] oshPages() never requests a next link on a different origin, even a protocol-relative one with the same path', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        items: [{ id: 'p1' }],
        links: [{ rel: 'next', href: '//attacker.example/api/systems?limit=1' }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.deepEqual(items, [{ id: 'p1' }]);
  assert.equal(calls, 1, 'the foreign-origin link, even with a matching path, is never requested');
});

test('[osh-036] oshPages() never requests a next link on a different path', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        items: [{ id: 'p1' }],
        links: [{ rel: 'next', href: 'datastreams?limit=1' }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.deepEqual(items, [{ id: 'p1' }]);
  assert.equal(calls, 1);
});

test('[osh-036] oshPages() never requests a next link with a fragment', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        items: [{ id: 'p1' }],
        links: [{ rel: 'next', href: 'systems?limit=1#frag' }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.deepEqual(items, [{ id: 'p1' }]);
  assert.equal(calls, 1);
});

test('[osh-036] oshPages() never requests a next link that carries a username or a password', async () => {
  const root = new URL('https://osh.example/api/');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({
        items: [{ id: 'p1' }],
        links: [{ rel: 'next', href: 'https://attacker:x@osh.example/api/systems?limit=1' }],
      }),
      { status: 200 },
    );
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.deepEqual(items, [{ id: 'p1' }]);
  assert.equal(calls, 1);
});

test('[osh-036] oshPages() follows an accepted next link with the query that the provider built again', async () => {
  const root = new URL('https://osh.example/api/');
  const requestedUrls = [];
  const fetchImpl = async (url) => {
    requestedUrls.push(String(url));
    const page = requestedUrls.length;
    if (page === 1) {
      return new Response(
        JSON.stringify({
          items: [{ id: 'p1' }],
          links: [{ rel: 'next', href: 'systems?limit=1;_method=DELETE' }],
        }),
        { status: 200 },
      );
    }
    return new Response(JSON.stringify({ items: [{ id: 'p2' }] }), { status: 200 });
  };
  const items = await oshPages(fetchImpl, root, new URL('systems', root), {
    listOf: (payload) => payload.items,
  });
  assert.deepEqual(items, [{ id: 'p1' }, { id: 'p2' }]);
  assert.equal(requestedUrls.length, 2);
  const secondUrl = new URL(requestedUrls[1]);
  assert.equal(secondUrl.searchParams.has('_method'), false);
  assert.equal([...secondUrl.searchParams.keys()].length, 1);
  assert.equal(requestedUrls[1].includes(';'), false, 'a raw, unescaped `;` must not reach the wire');
});

test('[osh-015] fails a request whose declared body exceeds the cap, with no parse', async () => {
  let pulls = 0;
  const stream = new ReadableStream(
    {
      pull(controller) {
        pulls += 1;
        controller.enqueue(new TextEncoder().encode('{"items":[]}'));
      },
    },
    { highWaterMark: 0 },
  );
  const response = new Response(stream, { status: 200 });
  response.headers.set('Content-Length', String(OSH_MAX_BODY_BYTES + 1));
  await assert.rejects(
    oshGet(async () => response, 'https://osh.example/api/systems'),
    { code: 'OSH_TOO_LARGE' },
  );
  assert.equal(pulls, 0, 'a body declared too large must never be read');
});

test('[osh-015] fails a request past its timeout', async () => {
  const startedAt = Date.now();
  await assert.rejects(
    oshGet(
      async (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(options.signal.reason), {
            once: true,
          });
        }),
      'https://osh.example/api/systems',
      { timeoutMs: 20 },
    ),
    { name: 'TimeoutError' },
  );
  assert.ok(Date.now() - startedAt < 500);
});
