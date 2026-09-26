import test from 'node:test';
import assert from 'node:assert/strict';
import { createHttpGeospatialProvider } from './http.js';

// The provider takes the answer of the server route as a fetch response. The
// route answers with the JSON of Google, plus the field `configured`.
const answer = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => body,
});

const AUSTIN_OK_ANSWER = {
  configured: true,
  status: 'OK',
  results: [
    {
      formatted_address: 'Austin, TX, USA',
      types: ['locality'],
      address_components: [{ long_name: 'Austin', types: ['locality'] }],
    },
  ],
};

/** A provider whose fetch calls the handler, and a list of the fetch calls. */
function providerWith(handler) {
  const calls = [];
  const provider = createHttpGeospatialProvider({
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init });
      return handler(calls.length, url, init);
    },
  });
  return { provider, calls };
}

test('[credential-boundary-014] reverseGeocode fetches the server route, with no key', async () => {
  const { provider, calls } = providerWith(async () => answer(AUSTIN_OK_ANSWER));
  // The page has a browser key. The request must not carry it.
  const before = globalThis.window;
  globalThis.window = { __GOOGLE_MAPS_API_KEY__: 'sentinel-browser-key' };
  try {
    await provider.reverseGeocode(30.2672, -97.7431);
  } finally {
    if (before === undefined) delete globalThis.window;
    else globalThis.window = before;
  }
  const requestUrl = new URL(calls[0].url, 'http://localhost');
  assert.equal(requestUrl.pathname, '/api/google/geocode');
  assert.equal(requestUrl.searchParams.get('lat'), '30.2672');
  assert.equal(requestUrl.searchParams.get('lon'), '-97.7431');
  assert.equal(requestUrl.searchParams.has('key'), false);
  assert.doesNotMatch(calls[0].url, /sentinel-browser-key/);
  assert.doesNotMatch(
    JSON.stringify({ ...calls[0].init, headers: [...new Headers(calls[0].init?.headers)] }),
    /sentinel-browser-key/,
  );
});

test('[credential-boundary-014] an empty result gets a default value for each field', async () => {
  const { provider } = providerWith(async () =>
    answer({ configured: true, status: 'OK', results: [{}] }),
  );
  assert.deepEqual(await provider.reverseGeocode(30.2672, -97.7431), {
    formattedAddress: null,
    locality: null,
    region: null,
    country: null,
    types: [],
    labels: [],
    streetLabels: [],
  });
});

test('[credential-boundary-014] the reverse lookup remembers a configured:false answer for the life of the page', async () => {
  const { provider, calls } = providerWith(async () =>
    answer({ configured: false, status: null, results: [] }),
  );
  assert.equal(await provider.reverseGeocode(30.2672, -97.7431), null);
  assert.equal(calls.length, 1);
  assert.equal(await provider.reverseGeocode(51.5074, -0.1278), null);
  assert.equal(calls.length, 1, 'a remembered keyless server takes no second fetch');
});

test('[credential-boundary-014] a configured answer gives the same place shape as before this change', async () => {
  const { provider } = providerWith(async () =>
    answer({
      configured: true,
      status: 'OK',
      results: [
        {
          formatted_address: 'Austin, TX, USA',
          types: ['locality', 'political'],
          address_components: [
            { long_name: 'Austin', types: ['locality'] },
            { long_name: 'Texas', types: ['administrative_area_level_1'] },
            { long_name: 'United States', types: ['country'] },
          ],
        },
        {
          // A control character that is not whitespace becomes a space, as before this change.
          formatted_address: 'Old\u001fTown\u0007Kraków',
          address_components: [{ long_name: 'Congress\u007fAvenue', types: ['route'] }],
        },
      ],
    }),
  );
  assert.deepEqual(await provider.reverseGeocode(30.2672, -97.7431), {
    formattedAddress: 'Austin, TX, USA',
    locality: 'Austin',
    region: 'Texas',
    country: 'United States',
    types: ['locality', 'political'],
    labels: ['Austin, TX, USA', 'Old Town Kraków'],
    streetLabels: ['Congress Avenue'],
  });
});

test('[credential-boundary-014] a ZERO_RESULTS answer with no results gives no place', async () => {
  const { provider } = providerWith(async () =>
    answer({ configured: true, status: 'ZERO_RESULTS', results: [] }),
  );
  assert.equal(await provider.reverseGeocode(30.2672, -97.7431), null);
});

test('[credential-boundary-014] a fetch failure makes the reverse lookup reject', async () => {
  const { provider } = providerWith(async () => {
    throw new Error('offline');
  });
  await assert.rejects(provider.reverseGeocode(30.2672, -97.7431), /offline/);
});

test('[credential-boundary-014] an answer that is not JSON makes the reverse lookup reject', async () => {
  const { provider } = providerWith(async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('invalid json');
    },
  }));
  await assert.rejects(provider.reverseGeocode(30.2672, -97.7431), SyntaxError);
});

/** Give `first` to the first fetch and an OK answer to each later fetch, then look up one coordinate two times. */
async function reverseGeocodeTwiceAfter(first) {
  const { provider, calls } = providerWith(async (count) =>
    count === 1 ? first : answer(AUSTIN_OK_ANSWER),
  );
  const firstPlace = await provider.reverseGeocode(30.2672, -97.7431).catch(() => null);
  const secondPlace = await provider.reverseGeocode(30.2672, -97.7431).catch(() => null);
  return { firstPlace, secondPlace, calls: calls.length };
}

test('[credential-boundary-014] a later call fetches again after an HTTP 502 answer with a null Google status', async () => {
  // The route sends this when the upstream fetch throws.
  const { firstPlace, secondPlace, calls } = await reverseGeocodeTwiceAfter(
    answer({ configured: true, status: null, results: [], error: 'offline' }, { ok: false, status: 502 }),
  );
  assert.equal(firstPlace, null);
  assert.equal(calls, 2, 'the reverse lookup does not remember an error answer');
  assert.equal(secondPlace?.formattedAddress, 'Austin, TX, USA');
});

test('[credential-boundary-014] a later call fetches again after an HTTP 429 answer with a null Google status', async () => {
  // The route sends this when the rate limiter refuses the request.
  const { firstPlace, secondPlace, calls } = await reverseGeocodeTwiceAfter(
    answer({ configured: true, status: null, results: [], error: 'Rate limit exceeded' }, { ok: false, status: 429 }),
  );
  assert.equal(firstPlace, null);
  assert.equal(calls, 2, 'the reverse lookup does not remember an error answer');
  assert.equal(secondPlace?.formattedAddress, 'Austin, TX, USA');
});

test('[credential-boundary-014] a later call fetches again after an HTTP 200 answer with a null Google status', async () => {
  // The route sends this when the upstream body is larger than the maximum size.
  const { firstPlace, secondPlace, calls } = await reverseGeocodeTwiceAfter(
    answer({ configured: true, status: null, results: [], error: 'Response too large' }),
  );
  assert.equal(firstPlace, null);
  assert.equal(calls, 2, 'the reverse lookup does not remember an answer with no Google status');
  assert.equal(secondPlace?.formattedAddress, 'Austin, TX, USA');
});

test('[credential-boundary-014] a later call fetches again after an HTTP 200 answer with no status field', async () => {
  const { firstPlace, secondPlace, calls } = await reverseGeocodeTwiceAfter(
    answer({ configured: true, results: [] }),
  );
  assert.equal(firstPlace, null);
  assert.equal(calls, 2, 'the reverse lookup does not remember an answer with no Google status');
  assert.equal(secondPlace?.formattedAddress, 'Austin, TX, USA');
});

test('[credential-boundary-014] a later call fetches again after an HTTP 500 answer with a Google status', async () => {
  // The route sends the upstream HTTP status and the upstream Google status.
  const { firstPlace, secondPlace, calls } = await reverseGeocodeTwiceAfter(
    answer(
      { configured: true, status: 'UNKNOWN_ERROR', results: [], error: 'Google Geocoding request failed' },
      { ok: false, status: 500 },
    ),
  );
  assert.equal(firstPlace, null);
  assert.equal(calls, 2, 'the reverse lookup does not remember an HTTP error answer');
  assert.equal(secondPlace?.formattedAddress, 'Austin, TX, USA');
});

test('[credential-boundary-014] a later call makes no fetch after an HTTP 200 ZERO_RESULTS answer', async () => {
  const { firstPlace, secondPlace, calls } = await reverseGeocodeTwiceAfter(
    answer({ configured: true, status: 'ZERO_RESULTS', results: [] }),
  );
  assert.equal(firstPlace, null);
  assert.equal(secondPlace, null, 'the second call gives the null in the cache');
  assert.equal(calls, 1, 'the reverse lookup remembers a ZERO_RESULTS answer');
});

test('[credential-boundary-014] a coordinate that rounds to the same four decimals makes no fetch, and one that differs at the fourth decimal fetches', async () => {
  const { provider, calls } = providerWith(async () => answer({ configured: true, status: 'ZERO_RESULTS', results: [] }));
  await provider.reverseGeocode(30.26721, -97.74311);
  await provider.reverseGeocode(30.26724, -97.74314);
  assert.equal(calls.length, 1, 'a coordinate with the same four decimals uses the remembered answer');
  await provider.reverseGeocode(30.2673, -97.7431);
  assert.equal(calls.length, 2, 'a coordinate that differs at the fourth decimal fetches again');
});
