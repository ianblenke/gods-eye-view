import {
  readResponseBytesCapped,
  readResponseJsonCapped,
} from '../common/http.js';
import {
  MAX_IMAGE_BYTES,
  hasImageSignature,
  isImageType,
  mediaTypeOf,
} from '../skywatch/image.js';
import { isSearchId } from './normalize.js';

const TOKEN_URL =
  'https://auth.up42.com/realms/public/protocol/openid-connect/token';
const API = 'https://api.up42.com';
const COLLECTIONS_PATH =
  '/v2/collections?type=ARCHIVE&integrations=SEARCH_AVAILABLE&size=100';
const HOST = /^[a-z0-9][a-z0-9-]{0,63}$/;
const failed = (kind) => ({ ok: false, kind });

async function cancelBody(response, signal) {
  try {
    await readUntilAbort(() => response.body?.cancel(), signal);
  } catch {
    // A cancel error must not change the fixed failure.
  }
  signal.throwIfAborted();
}

async function readUntilAbort(read, signal) {
  let onAbort;
  const aborted = new Promise((_resolve, reject) => {
    onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
  let value;
  try {
    value = await Promise.race([read(), aborted]);
  } catch (error) {
    signal.removeEventListener('abort', onAbort);
    throw error;
  }
  signal.removeEventListener('abort', onAbort);
  return value;
}

/** Fixed destinations, a private token cache and fixed failure names. */
export function createClient({ env, fetchImpl, now, setTimer, clearTimer }) {
  let cached = null;
  let inFlight = null;
  const secrets = new Set();

  async function send(url, init, login = false, image = false, multi = false) {
    const controller = new AbortController();
    const timer = setTimer(() => controller.abort(), 15000);
    const exchange = async () => {
      const response = await readUntilAbort(
        () =>
          Promise.resolve(
            fetchImpl(url, {
              ...init,
              redirect: 'error',
              signal: controller.signal,
            }),
          ).then(async (response) => {
            if (controller.signal.aborted)
              await cancelBody(response, controller.signal);
            return response;
          }),
        controller.signal,
      );
      controller.signal.throwIfAborted();
      if (response.status !== 200 && !(multi && response.status === 207)) {
        await cancelBody(response, controller.signal);
        if (login && (response.status === 400 || response.status === 401))
          return failed('credentials_rejected');
        if (init.headers.Authorization !== undefined && response.status === 401)
          return failed('unauthorized');
        if (image && response.status === 404) return failed('not_found');
        return failed('upstream_failed');
      }
      if (image) {
        const type = mediaTypeOf(response.headers.get('content-type'));
        if (!isImageType(type)) {
          await cancelBody(response, controller.signal);
          return failed('bad_upstream');
        }
        const bytes = await readUntilAbort(
          () =>
            readResponseBytesCapped(
              response,
              MAX_IMAGE_BYTES,
              controller.signal,
            ),
          controller.signal,
        );
        if (
          !hasImageSignature(type, bytes) ||
          !isSafe(Buffer.from(bytes).toString('utf8'))
        )
          return failed('bad_upstream');
        return { ok: true, type, bytes };
      }
      const value = await readUntilAbort(
        () => readResponseJsonCapped(response, 4194304, controller.signal),
        controller.signal,
      );
      return { ok: true, value };
    };
    let result;
    try {
      result = await exchange();
    } catch (error) {
      result = failed(
        controller.signal.aborted
          ? 'search_timeout'
          : image && error?.code === 'RESPONSE_TOO_LARGE'
            ? 'bad_upstream'
            : 'upstream_failed',
      );
    }
    clearTimer(timer);
    return result;
  }

  async function login(username, password, credentials) {
    secrets.add(username);
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

  async function thumbnail(host, id) {
    if (
      typeof host !== 'string' ||
      !HOST.test(host) ||
      !isSearchId(id) ||
      /^\.+$/.test(id)
    )
      return failed('bad_upstream');
    let token = await getToken();
    if (!token.ok) return token;
    const url = `${API}/catalog/${host}/image/${encodeURIComponent(id)}/thumbnail`;
    const request = (value) =>
      send(
        url,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${value}`,
            Accept: 'image/png, image/jpeg, image/webp',
          },
        },
        false,
        true,
      );
    let result = await request(token.value);
    if (!result.ok && result.kind === 'unauthorized') {
      token = await getToken(token.value);
      if (!token.ok) return token;
      result = await request(token.value);
    }
    return !result.ok && result.kind === 'unauthorized'
      ? failed('credentials_rejected')
      : result;
  }

  function apiOrigin(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' && parsed.origin === API;
    } catch {
      return false;
    }
  }

  async function post(url, body) {
    if (!apiOrigin(url)) return failed('bad_upstream');
    let token = await getToken();
    if (!token.ok) return token;
    const request = (value) =>
      send(
        url,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${value}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        },
        false,
        false,
        true,
      );
    let result = await request(token.value);
    if (!result.ok && result.kind === 'unauthorized') {
      token = await getToken(token.value);
      if (!token.ok) return token;
      result = await request(token.value);
    }
    return !result.ok && result.kind === 'unauthorized'
      ? failed('credentials_rejected')
      : result;
  }

  function getPublic(url) {
    if (!apiOrigin(url)) return Promise.resolve(failed('bad_upstream'));
    return send(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  }

  function isSafe(value) {
    const text = JSON.stringify(value);
    for (const secret of [env.UP42_USERNAME, env.UP42_PASSWORD, ...secrets]) {
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
    post,
    getPublic,
    search,
    thumbnail,
    isSafe,
  };
}
