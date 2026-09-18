import { oshGet, oshPages } from './get.js';
import { coalesceProxyRequest } from '../common/http.js';
import { mapOshObservation, readOshSchemaLocation } from '../../../src/data/oshObservations.js';
import { mapOshDatastreams } from '../../../src/data/oshDatastreams.js';

/** Cache TTL for one datastream's newest observation. */
export const OBS_TTL_MS = 15_000;
/** Oldest-first eviction cap on the number of cached ids, shared by both keyed caches. */
export const OBS_MAX_ENTRIES = 256;

/**
 * A generic per-id cache with single-flight refresh, TTL, serve-stale-on-
 * failure and an oldest-first eviction cap. `refresh(fetchImpl, id, ...args)`
 * does the actual upstream work and returns the value to cache; the extra
 * `args` a caller passes to `get()` reach `refresh()` unchanged, so one
 * instance can serve a one-shot fetch (the observation cache) or a page
 * walk (the per-system datastreams cache). See design decision D33a.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 * @param {number} options.ttlMs
 * @param {number} [options.maxEntries]
 * @param {(fetchImpl: typeof fetch, id: string, ...args: any[]) => Promise<*>} options.refresh
 */
export function createOshKeyedCache({
  fetchImpl,
  now = Date.now,
  ttlMs,
  maxEntries = OBS_MAX_ENTRIES,
  refresh,
}) {
  const cache = new Map();
  const inflight = new Map();

  /**
   * @param {string} id - Cache key, already validated by the route.
   * @param {...*} args - Forwarded to `refresh(fetchImpl, id, ...args)`.
   */
  async function get(id, ...args) {
    const nowMs = now();
    const entry = cache.get(id);
    if (entry && nowMs - entry.at < ttlMs) {
      return { value: entry.value, stale: false, fetchedAt: entry.at };
    }
    const { promise } = coalesceProxyRequest(inflight, id, () =>
      refresh(fetchImpl, id, ...args),
    );
    try {
      const value = await promise;
      const at = now();
      cache.set(id, { at, value });
      if (cache.size > maxEntries) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      return { value, stale: false, fetchedAt: at };
    } catch (error) {
      if (entry) return { value: entry.value, stale: true, fetchedAt: entry.at, error };
      throw error;
    }
  }

  return { get, size: () => cache.size };
}

async function refreshObservation(fetchImpl, _id, url, headers, reader) {
  const { status, json } = await oshGet(fetchImpl, url, { headers });
  if (status < 200 || status >= 300) {
    const error = new Error(`OSH observations HTTP ${status}`);
    error.status = status;
    throw error;
  }
  return mapOshObservation(json, reader);
}

/**
 * A per-datastream cache of the newest observation, with single-flight
 * refresh and serve-stale-on-failure. See design decision D14. `reader`
 * comes from the schema cache (design decision D44) — a null reader gives
 * an observation with `location:null`.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 */
export function createOshObservationsCache({ fetchImpl, now = Date.now }) {
  const keyed = createOshKeyedCache({
    fetchImpl,
    now,
    ttlMs: OBS_TTL_MS,
    maxEntries: OBS_MAX_ENTRIES,
    refresh: refreshObservation,
  });

  /**
   * @param {string} id - Datastream id, already validated by the route.
   * @param {URL} url - Observations URL, already built and guarded by the route.
   * @param {Record<string,string>} headers
   * @param {?object} [reader] - From readOshSchemaLocation(), or null.
   */
  async function get(id, url, headers, reader = null) {
    const { value, stale, fetchedAt, error } = await keyed.get(id, url, headers, reader);
    return error
      ? { observation: value, stale, fetchedAt, error }
      : { observation: value, stale, fetchedAt };
  }

  return { get, size: keyed.size };
}

async function refreshSystemDatastreams(fetchImpl, _id, root, url, headers) {
  const { items } = await oshPages(fetchImpl, root, url, {
    headers,
    listOf: (payload) => {
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.datastreams)) return payload.datastreams;
      return [];
    },
  });
  return mapOshDatastreams({ items });
}

/**
 * A per-system cache of that system's own datastreams, walked from
 * `systems/<id>/datastreams`, with single-flight refresh and
 * serve-stale-on-failure. See design decision D33a.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 * @param {number} options.ttlMs
 */
export function createOshSystemDatastreamsCache({ fetchImpl, now = Date.now, ttlMs }) {
  const keyed = createOshKeyedCache({
    fetchImpl,
    now,
    ttlMs,
    maxEntries: OBS_MAX_ENTRIES,
    refresh: refreshSystemDatastreams,
  });

  /**
   * @param {string} id - System id, already validated by the route.
   * @param {URL} root - Resolved API root.
   * @param {URL} url - Datastreams URL, already built and guarded by the route.
   * @param {Record<string,string>} headers
   */
  async function get(id, root, url, headers) {
    const { value, stale, fetchedAt, error } = await keyed.get(id, root, url, headers);
    return error
      ? { datastreams: value, stale, fetchedAt, error }
      : { datastreams: value, stale, fetchedAt };
  }

  return { get, size: keyed.size };
}

async function refreshSchema(fetchImpl, _id, url, headers) {
  const { status, json } = await oshGet(fetchImpl, url, { headers });
  if (status < 200 || status >= 300) {
    const error = new Error(`OSH schema HTTP ${status}`);
    error.status = status;
    throw error;
  }
  return readOshSchemaLocation(json);
}

/**
 * A per-datastream cache of that stream's location reader, read from its
 * schema through the fixed schema URL pair. See design decision D44 and
 * D47.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 * @param {number} options.ttlMs
 */
export function createOshSchemaCache({ fetchImpl, now = Date.now, ttlMs }) {
  const keyed = createOshKeyedCache({
    fetchImpl,
    now,
    ttlMs,
    maxEntries: OBS_MAX_ENTRIES,
    refresh: refreshSchema,
  });

  /**
   * @param {string} id - Datastream id.
   * @param {URL} url - Schema URL, already built and guarded by the caller.
   * @param {Record<string,string>} headers
   */
  async function get(id, url, headers) {
    const { value, stale, fetchedAt, error } = await keyed.get(id, url, headers);
    return error
      ? { reader: value, stale, fetchedAt, error }
      : { reader: value, stale, fetchedAt };
  }

  return { get, size: keyed.size };
}

async function refreshSystemName(fetchImpl, _id, url, headers) {
  const { status, json } = await oshGet(fetchImpl, url, { headers });
  if (status < 200 || status >= 300) {
    const error = new Error(`OSH system HTTP ${status}`);
    error.status = status;
    throw error;
  }
  const properties =
    json?.properties && typeof json.properties === 'object' ? json.properties : {};
  return typeof properties.name === 'string' ? properties.name : null;
}

/**
 * A per-id cache of one system's name, read by id through the fixed system
 * URL pair — the one reliable read for a system the systems snapshot does
 * not hold. See design decision D48.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 * @param {number} options.ttlMs
 */
export function createOshSystemCache({ fetchImpl, now = Date.now, ttlMs }) {
  const keyed = createOshKeyedCache({
    fetchImpl,
    now,
    ttlMs,
    maxEntries: OBS_MAX_ENTRIES,
    refresh: refreshSystemName,
  });

  /**
   * @param {string} id - System id.
   * @param {URL} url - System URL, already built and guarded by the caller.
   * @param {Record<string,string>} headers
   */
  async function get(id, url, headers) {
    const { value, stale, fetchedAt, error } = await keyed.get(id, url, headers);
    return error ? { name: value, stale, fetchedAt, error } : { name: value, stale, fetchedAt };
  }

  return { get, size: keyed.size };
}

/**
 * A single-value cache for the whole location pass: one shared refresh,
 * a fixed TTL and a stale snapshot on failure — the same shape as the
 * route's own list caches, but kept here because the pass it wraps is a
 * provider-level concern (design decision D47), not a route concern.
 * `refresh` is supplied by the caller at each `load()`, because building
 * the candidate set needs the route's own systems, features and
 * datastreams caches.
 * @param {object} options
 * @param {number} options.ttlMs
 * @param {() => number} [options.now]
 */
export function createOshLocationsPass({ ttlMs, now = Date.now }) {
  let entry = null;
  const inFlight = new Map();

  /**
   * @param {() => Promise<*>} refresh
   */
  async function load(refresh) {
    const nowMs = now();
    if (entry && nowMs - entry.at < ttlMs) {
      return { value: entry.value, stale: false, fetchedAt: entry.at };
    }
    const { promise } = coalesceProxyRequest(inFlight, 'pass', refresh);
    try {
      const value = await promise;
      entry = { at: now(), value };
      return { value, stale: false, fetchedAt: entry.at };
    } catch (error) {
      if (entry) return { value: entry.value, stale: true, fetchedAt: entry.at, error };
      throw error;
    }
  }

  return { load };
}
