import { oshGet } from './get.js';
import { coalesceProxyRequest } from '../common/http.js';
import { mapOshObservation } from '../../../src/data/oshObservations.js';

/** Cache TTL for one datastream's newest observation. */
export const OBS_TTL_MS = 15_000;
/** Oldest-first eviction cap on the number of cached datastream ids. */
export const OBS_MAX_ENTRIES = 256;

/**
 * A per-datastream cache of the newest observation, with single-flight
 * refresh and serve-stale-on-failure. See design decision D14.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 */
export function createOshObservationsCache({ fetchImpl, now = Date.now }) {
  const cache = new Map();
  const inflight = new Map();

  async function refresh(url, headers) {
    const { status, json } = await oshGet(fetchImpl, url, { headers });
    if (status < 200 || status >= 300) {
      const error = new Error(`OSH observations HTTP ${status}`);
      error.status = status;
      throw error;
    }
    return mapOshObservation(json);
  }

  /**
   * @param {string} id - Datastream id, already validated by the route.
   * @param {URL} url - Observations URL, already built and guarded by the route.
   * @param {Record<string,string>} headers
   */
  async function get(id, url, headers) {
    const nowMs = now();
    const entry = cache.get(id);
    if (entry && nowMs - entry.at < OBS_TTL_MS) {
      return { observation: entry.value, stale: false, fetchedAt: entry.at };
    }
    const { promise } = coalesceProxyRequest(inflight, id, () => refresh(url, headers));
    try {
      const observation = await promise;
      const at = now();
      cache.set(id, { at, value: observation });
      if (cache.size > OBS_MAX_ENTRIES) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      return { observation, stale: false, fetchedAt: at };
    } catch (error) {
      if (entry) return { observation: entry.value, stale: true, fetchedAt: entry.at, error };
      throw error;
    }
  }

  return { get, size: () => cache.size };
}
