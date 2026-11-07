import { readResponseJsonCapped } from '../common/http.js';

const TOKEN_URL =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const API = 'https://api.up42.com';
const COLLECTIONS_PATH =
  '/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100';
const HOST = /^[a-z0-9][a-z0-9-]{0,63}$/;
const failed = (kind) => ({ ok: false, kind });

/** Fixed destinations, a private token cache and fixed failure names. */
export function createClient({ env, fetchImpl, now, setTimer, clearTimer }) {
  let cached = null;
  let inFlight = null;
  const secrets = new Set();

  async function send(url, init, login = false) {
    const controller = new AbortController();
    const timer = setTimer(() => controller.abort(), 15000);
    const exchange = async () => {
      const response = await fetchImpl(url, {
        ...init,
        redirect: 'error',
        signal: controller.signal,
      });
      controller.signal.throwIfAborted();
      if (response.status !== 200) {
        try {
          await response.body?.cancel();
        } catch {
          // A cancel error must not change the fixed failure.
        }
        if (login && (response.status === 400 || response.status === 401))
          return failed('credentials_rejected');
        if (init.headers.Authorization !== undefined && response.status === 401)
          return failed('unauthorized');
        return failed('upstream_failed');
      }
      const value = await readResponseJsonCapped(
        response,
        4194304,
        controller.signal,
      );
      return { ok: true, value };
    };
    let result;
    try {
      result = await exchange();
    } catch {
      result = failed(
        controller.signal.aborted ? 'search_timeout' : 'upstream_failed',
      );
    }
    clearTimer(timer);
    return result;
  }

  async function login(username, password, credentials) {
    secrets.add(password);
    const result = await send(
      TOKEN_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'up42-api',
          username,
          password,
        }).toString(),
      },
      true,
    );
    if (!result.ok) return result;
    const value = result.value;
    if (
      value === null ||
      typeof value !== 'object' ||
      typeof value.access_token !== 'string' ||
      !/^[A-Za-z0-9._~-]+$/.test(value.access_token) ||
      !Number.isFinite(value.expires_in) ||
      value.expires_in <= 0
    )
      return failed('upstream_failed');
    secrets.add(value.access_token);
    cached = {
      token: value.access_token,
      until: now() + (value.expires_in - 60) * 1000,
      credentials,
    };
    return { ok: true, value: cached.token };
  }

  async function getToken(rejected) {
    const username = (env.UP42_USERNAME ?? '').trim();
    const password = env.UP42_PASSWORD ?? '';
    const credentials = JSON.stringify([username, password]);
    if (
      cached !== null &&
      cached.credentials === credentials &&
      cached.token !== rejected &&
      now() < cached.until
    ) {
      return { ok: true, value: cached.token };
    }
    if (inFlight !== null) return inFlight;
    inFlight = login(username, password, credentials);
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  }

  async function search(host, body) {
    if (typeof host !== 'string' || !HOST.test(host))
      return failed('upstream_failed');
    let token = await getToken();
    if (!token.ok) return token;
    const url = `${API}/catalog/hosts/${host}/stac/search`;
    const request = (value) =>
      send(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${value}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
    let result = await request(token.value);
    if (!result.ok && result.kind === 'unauthorized') {
      token = await getToken(token.value);
      if (!token.ok) return token;
      result = await request(token.value);
    }
    return !result.ok && result.kind === 'unauthorized'
      ? failed('upstream_failed')
      : result;
  }

  function isSafe(value) {
    const text = JSON.stringify(value);
    for (const secret of [env.UP42_PASSWORD, ...secrets]) {
      if (typeof secret !== 'string' || secret === '') continue;
      if (text.includes(JSON.stringify(secret).slice(1, -1))) return false;
    }
    return true;
  }

  return {
    collections: () =>
      send(`${API}${COLLECTIONS_PATH}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    search,
    isSafe,
  };
}
