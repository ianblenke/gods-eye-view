import test, { beforeEach } from 'node:test';
import * as ontarioRequest from '../../server/providers/cctv/ontarioRequest.js';
import assert from 'node:assert/strict';

beforeEach(() => ontarioRequest._resetOntarioRequestForTest());
const key = 'ONTARIO_FAKE_SECRET_A&+?';

async function fixture(t, value, response) {
  const old = process.env.ONTARIO_511_API_KEY;
  t.after(() => {
    if (old === undefined) delete process.env.ONTARIO_511_API_KEY;
    else process.env.ONTARIO_511_API_KEY = old;
  });
  if (value === undefined) delete process.env.ONTARIO_511_API_KEY;
  else process.env.ONTARIO_511_API_KEY = value;
  const calls = [];
  const logs = [];
  t.mock.method(globalThis, 'fetch', async (...args) => {
    calls.push(args);
    if (response instanceof Error) throw response;
    return response;
  });
  t.mock.method(console, 'warn', (...args) => logs.push(args.join(' ')));
  t.mock.method(console, 'log', (...args) => logs.push(args.join(' ')));
  return { ...ontarioRequest, calls, logs };
}

test('[live-sources-002] send the key parameter', async (t) => {
  const f = await fixture(t, key, {
    ok: true,
    json: async () => [{ Id: 455 }],
  });
  assert.deepEqual(await f.readOntarioCameraRows(), [{ Id: 455 }]);
  const url = new URL(f.calls[0][0]);
  assert.equal(
    url.origin + url.pathname,
    'https://511on.ca/api/v2/get/cameras',
  );
  assert.equal(url.searchParams.get('key'), 'ONTARIO_FAKE_SECRET_A&+?');
  assert.equal(url.searchParams.get('format'), 'json');
  assert.equal(url.searchParams.get('lang'), 'en');
  assert.equal(f.calls[0][1].headers.Accept, 'application/json');
  assert.equal(f.calls[0][1].signal instanceof AbortSignal, true);
  assert.deepEqual(f.logs, []);
});

test('[live-sources-003] make no request without a key', async (t) => {
  const f = await fixture(t, undefined, { ok: true, json: async () => [] });
  let nested;
  t.mock.method(console, 'warn', (...args) => {
    f.logs.push(args.join(' '));
    if (f.logs.length === 1) nested = f.readOntarioCameraRows();
  });
  for (const value of [undefined, '', '   ']) {
    if (value === undefined) delete process.env.ONTARIO_511_API_KEY;
    else process.env.ONTARIO_511_API_KEY = value;
    assert.deepEqual(await f.readOntarioCameraRows(), []);
    assert.deepEqual(await f.readOntarioCameraRows(), []);
  }
  await nested;
  assert.equal(f.calls.length, 0);
  assert.deepEqual(f.logs, ['[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.']);
  ontarioRequest._resetOntarioRequestForTest();
  f.logs.length = 0;
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.deepEqual(f.logs, ['[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.']);
  assert.equal(f.logs.join().includes(key), false);
});

test('[live-sources-004] write one warning for an invalid key', async (t) => {
  const f = await fixture(
    t,
    key,
    new Response('<Error><Message>Invalid Key</Message></Error>', {
      status: 400,
    }),
  );
  let nested;
  t.mock.method(console, 'warn', (...args) => {
    f.logs.push(args.join(' '));
    if (f.logs.length === 1) nested = f.readOntarioCameraRows();
  });
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  await nested;
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.equal(f.calls.length, 3);
  assert.deepEqual(f.logs, [
    '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
  ]);
  assert.equal(f.logs.join().includes(key), false);
});

for (const type of ['fetch', 'json']) {
  test(`[live-sources-005] keep the ${type} error secret`, async (t) => {
    const error = new Error(key);
    const response =
      type === 'fetch'
        ? error
        : {
            ok: true,
            json: async () => {
              throw error;
            },
          };
    const f = await fixture(t, key, response);
    assert.deepEqual(await f.readOntarioCameraRows(), []);
    assert.equal(f.logs.join().includes(key), false);
    assert.deepEqual(f.logs, [
      '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
    ]);
    assert.deepEqual(await f.readOntarioCameraRows(), []);
    assert.equal(f.logs.length, 1);
  });
}

test('[live-sources-002] map the Ontario rows', async (t) => {
  await fixture(t, key, {
    ok: true,
    json: async () => [
      {
        Id: 455,
        Latitude: 43.992,
        Longitude: -78.6864,
        Location: 'Highway 407',
        Direction: 'N',
        Views: [{ Url: 'https://511on.ca/map/Cctv/815', Status: 'Enabled' }],
      },
    ],
  });
  const { loadOntarioSourcesFromOpenData } =
    await import('../../server/providers/cctv/sources.js');
  const rows = await loadOntarioSourcesFromOpenData();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 'on-455');
  assert.equal(rows[0].name, 'Highway 407');
  assert.equal(rows[0].snapshotUrl, 'https://511on.ca/map/Cctv/815');
  assert.equal(JSON.stringify(rows).includes(key), false);
});

test('[live-sources-005] keep the camera data error secret', async (t) => {
  const row = {
    get Id() {
      throw new Error(key);
    },
  };
  const f = await fixture(t, key, { ok: true, json: async () => [row] });
  const { loadOntarioSourcesFromOpenData } =
    await import('../../server/providers/cctv/sources.js');
  assert.deepEqual(await loadOntarioSourcesFromOpenData(), []);
  assert.deepEqual(f.logs, ['[CCTV] Ontario 511 camera data has an error.']);
  assert.equal(f.logs.join().includes(key), false);
});

test('[live-sources-004] return an empty list for an HTTP error with JSON rows', async (t) => {
  const f = await fixture(t, key, {
    ok: false,
    json: async () => [{ Id: 455 }],
  });
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.deepEqual(f.logs, [
    '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
  ]);
  assert.equal(f.logs.join().includes(key), false);
});

test('[live-sources-002] trim spaces from the key', async (t) => {
  const f = await fixture(t, '  ' + key + '  ', {
    ok: true,
    json: async () => [],
  });
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.equal(
    new URL(f.calls[0][0]).searchParams.get('key'),
    'ONTARIO_FAKE_SECRET_A&+?',
  );
});

test('[live-sources-002] use a timeout of 15000 milliseconds', async (t) => {
  const values = [];
  const signal = new AbortController().signal;
  t.mock.method(AbortSignal, 'timeout', (value) => {
    values.push(value);
    return signal;
  });
  const f = await fixture(t, key, { ok: true, json: async () => [] });
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.deepEqual(values, [15000]);
  assert.equal(f.calls[0][1].signal, signal);
});

test('[live-sources-002] send the application/json Accept header', async (t) => {
  const f = await fixture(t, key, { ok: true, json: async () => [] });
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.equal(f.calls[0][1].headers.Accept, 'application/json');
});

test('[live-sources-005] keep key text inside a fetch error out of the warning', async (t) => {
  const f = await fixture(t, key, new Error('Request for ' + key + ' failed'));
  assert.deepEqual(await f.readOntarioCameraRows(), []);
  assert.deepEqual(f.logs, [
    '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
  ]);
  assert.equal(f.logs.join().includes(key), false);
});
