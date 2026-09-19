import { coalesceProxyRequest } from './common/http.js';
import { OSH_LIST_FORMAT, oshListUrl, oshPages } from './osh/get.js';
import { baseErrorCode, createOshBase } from './osh/base.js';
import {
  assertObservationUrl,
  assertSystemDatastreamsUrl,
  observationUrl,
  readDatastreamId,
  readSystemId,
  systemDatastreamsUrl,
} from './osh/ids.js';
import {
  OBS_TTL_MS,
  createOshObservationsCache,
  createOshSystemDatastreamsCache,
} from './osh/observations.js';
import { mapOshSystems } from '../../src/data/oshSystems.js';
import { mapOshDatastreams } from '../../src/data/oshDatastreams.js';
import { mapOshFois } from '../../src/data/oshFois.js';
import { oshObservationAgeMs } from '../../src/data/oshObservations.js';

/**
 * OpenSensorHub systems, datastreams, features-of-interest and
 * newest-observation proxy.
 *
 * The account behind OSH_URL/OSH_USERNAME/OSH_PASSWORD has create and
 * delete rights on a real server, so every upstream call goes through
 * osh/get.js's oshGet(), which never sends a body and never follows a
 * redirect. The API root is unknown ahead of time, so it is resolved from a
 * fixed candidate list (osh/base.js) with GET probes only.
 *
 * Routes:
 *   GET /api/osh/status       → {hasKey, base, systems, datastreams, fois, observations, ttlMs}
 *   GET /api/osh/systems      → {fetchedAt, stale, ttlMs, count, systems}
 *   GET /api/osh/datastreams  → {fetchedAt, stale, ttlMs, count, datastreams}
 *   GET /api/osh/datastreams?system=<id> → {system, fetchedAt, stale, ttlMs, count, datastreams}
 *   GET /api/osh/fois          → {fetchedAt, stale, ttlMs, count, truncated, fois}
 *   GET /api/osh/observations?datastream=<id> → {datastream, fetchedAt, stale, ttlMs, observation}
 *
 * Keyless (no OSH_URL, or a value that does not parse as a URL): every
 * route but /status answers 503 {error:'no_key'}; /status answers
 * {hasKey:false}. The server is never contacted in that case.
 *
 * @returns {import('vite').Plugin}
 */

export const OSH_LIST_TTL_MS = 5 * 60_000;
/** The feature-of-interest walk needs more pages than the other two lists. */
export const OSH_FOI_MAX_PAGES = 60;

function listOfSystems(payload) {
  if (Array.isArray(payload?.features)) return payload.features;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function listOfDatastreams(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.datastreams)) return payload.datastreams;
  return [];
}

/** A memory cache for one list route: TTL, single-flight refresh, serve-stale. */
function createOshListCache({ ttlMs, now }) {
  let entry = null;
  const inFlight = new Map();

  async function load(refresh) {
    const nowMs = now();
    if (entry && nowMs - entry.at < ttlMs) {
      return { records: entry.records, stale: false, fetchedAt: entry.at };
    }
    const { promise } = coalesceProxyRequest(inFlight, 'list', refresh);
    try {
      const records = await promise;
      entry = { at: now(), records };
      return { records, stale: false, fetchedAt: entry.at };
    } catch (error) {
      if (entry) return { records: entry.records, stale: true, fetchedAt: entry.at, error };
      throw error;
    }
  }

  function status() {
    if (!entry) return { lastFetch: null, count: null, stale: false };
    return { lastFetch: entry.at, count: entry.records.length, stale: now() - entry.at >= ttlMs };
  }

  return { load, status };
}

/**
 * A memory cache for the feature-of-interest route: the same shape as
 * createOshListCache(), plus the `truncated` flag of the walk that filled
 * the snapshot, so a loss at the feature walk's own page cap is never
 * silent (see design decision D30).
 */
function createOshFoisCache({ ttlMs, now }) {
  let entry = null;
  const inFlight = new Map();

  async function load(refresh) {
    const nowMs = now();
    if (entry && nowMs - entry.at < ttlMs) {
      return {
        records: entry.records,
        truncated: entry.truncated,
        stale: false,
        fetchedAt: entry.at,
      };
    }
    const { promise } = coalesceProxyRequest(inFlight, 'list', refresh);
    try {
      const { records, truncated } = await promise;
      entry = { at: now(), records, truncated };
      return { records, truncated, stale: false, fetchedAt: entry.at };
    } catch (error) {
      if (entry)
        return {
          records: entry.records,
          truncated: entry.truncated,
          stale: true,
          fetchedAt: entry.at,
          error,
        };
      throw error;
    }
  }

  function status() {
    if (!entry) return { lastFetch: null, count: null, stale: false };
    return { lastFetch: entry.at, count: entry.records.length, stale: now() - entry.at >= ttlMs };
  }

  return { load, status };
}

export function oshProxy({
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = Date.now,
  warn = console.warn,
} = {}) {
  const base = createOshBase({ fetchImpl, now });
  const systemsCache = createOshListCache({ ttlMs: OSH_LIST_TTL_MS, now });
  const datastreamsCache = createOshListCache({ ttlMs: OSH_LIST_TTL_MS, now });
  const foisCache = createOshFoisCache({ ttlMs: OSH_LIST_TTL_MS, now });
  const observationsCache = createOshObservationsCache({ fetchImpl, now });
  const systemDatastreamsCache = createOshSystemDatastreamsCache({
    fetchImpl,
    now,
    ttlMs: OSH_LIST_TTL_MS,
  });

  function credentials() {
    const rawUrl = String(env.OSH_URL || '').trim();
    let configuredUrl = null;
    if (rawUrl) {
      try {
        configuredUrl = new URL(rawUrl).href;
      } catch {
        configuredUrl = null;
      }
    }
    const username = String(env.OSH_USERNAME || '').trim();
    const password = String(env.OSH_PASSWORD || '').trim();
    const headers = {};
    if (username && password) {
      headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    return { configuredUrl, headers };
  }

  async function fetchSystemsUpstream(root, headers) {
    const firstUrl = oshListUrl(root, 'systems', { limit: '100', f: OSH_LIST_FORMAT });
    const { items } = await oshPages(fetchImpl, root, firstUrl, {
      headers,
      listOf: listOfSystems,
    });
    return mapOshSystems({ features: items });
  }

  async function fetchDatastreamsUpstream(root, headers) {
    const firstUrl = oshListUrl(root, 'datastreams', { limit: '100' });
    const { items } = await oshPages(fetchImpl, root, firstUrl, {
      headers,
      listOf: listOfDatastreams,
    });
    return mapOshDatastreams({ items });
  }

  async function fetchFoisUpstream(root, headers) {
    const firstUrl = oshListUrl(root, 'fois', { limit: '200', f: OSH_LIST_FORMAT });
    const { items, truncated } = await oshPages(fetchImpl, root, firstUrl, {
      headers,
      listOf: listOfSystems,
      maxPages: OSH_FOI_MAX_PAGES,
    });
    return { records: mapOshFois({ features: items }), truncated };
  }

  const installMiddleware = (server) => {
    server.middlewares.use('/api/osh', async (req, res) => {
      const sendJson = (status, obj) => {
        res.writeHead(status, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        });
        res.end(JSON.stringify(obj));
      };
      try {
        if (req.method !== 'GET') {
          res.writeHead(405, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            Allow: 'GET',
          });
          res.end(JSON.stringify({ error: 'method_not_allowed' }));
          return;
        }

        const subPath = String(req.url || '').split('?')[0];
        const { configuredUrl, headers } = credentials();

        if (subPath === '/status') {
          if (!configuredUrl) {
            sendJson(200, {
              hasKey: false,
              base: { candidate: null, failures: [], probedAt: null },
              systems: { lastFetch: null, count: null, stale: false },
              datastreams: { lastFetch: null, count: null, stale: false },
              fois: { lastFetch: null, count: null, stale: false },
              observations: { cached: 0 },
              datastreamsBySystem: { cached: 0 },
              ttlMs: OSH_LIST_TTL_MS,
            });
            return;
          }
          const state = await base.resolveRoot(configuredUrl, headers);
          sendJson(200, {
            hasKey: true,
            base: {
              candidate: state.candidate,
              failures: state.failures,
              probedAt: state.probedAt || null,
            },
            systems: systemsCache.status(),
            datastreams: datastreamsCache.status(),
            fois: foisCache.status(),
            observations: { cached: observationsCache.size() },
            datastreamsBySystem: { cached: systemDatastreamsCache.size() },
            ttlMs: OSH_LIST_TTL_MS,
          });
          return;
        }

        if (!configuredUrl) {
          sendJson(503, { error: 'no_key' });
          return;
        }

        const requestUrl = new URL(req.url, 'http://localhost');

        if (subPath === '/datastreams' && requestUrl.searchParams.has('system')) {
          const id = readSystemId(requestUrl.searchParams);
          if (!id) {
            sendJson(400, { error: 'bad_system' });
            return;
          }
          const state = await base.resolveRoot(configuredUrl, headers);
          if (!state.root) {
            sendJson(502, { error: baseErrorCode(state.failures) });
            return;
          }
          // No injectable seam here: systemDatastreamsUrl() and
          // assertSystemDatastreamsUrl() are the fixed imports from
          // ids.js, mirroring the observation route below.
          const target = systemDatastreamsUrl(state.root, id);
          assertSystemDatastreamsUrl(target, state.root, id);
          try {
            const result = await systemDatastreamsCache.get(id, state.root, target, headers);
            sendJson(200, {
              system: id,
              fetchedAt: result.fetchedAt,
              stale: result.stale,
              ttlMs: OSH_LIST_TTL_MS,
              count: result.datastreams.length,
              datastreams: result.datastreams,
            });
          } catch {
            sendJson(502, { error: 'upstream_failed' });
          }
          return;
        }

        if (subPath === '/systems' || subPath === '/datastreams') {
          const state = await base.resolveRoot(configuredUrl, headers);
          if (!state.root) {
            sendJson(502, { error: baseErrorCode(state.failures) });
            return;
          }
          const isSystems = subPath === '/systems';
          const cache = isSystems ? systemsCache : datastreamsCache;
          try {
            const { records, stale, fetchedAt } = await cache.load(() =>
              isSystems
                ? fetchSystemsUpstream(state.root, headers)
                : fetchDatastreamsUpstream(state.root, headers),
            );
            sendJson(200, {
              fetchedAt,
              stale,
              ttlMs: OSH_LIST_TTL_MS,
              count: records.length,
              [isSystems ? 'systems' : 'datastreams']: records,
            });
          } catch {
            sendJson(502, { error: 'upstream_failed' });
          }
          return;
        }

        if (subPath === '/fois') {
          const state = await base.resolveRoot(configuredUrl, headers);
          if (!state.root) {
            sendJson(502, { error: baseErrorCode(state.failures) });
            return;
          }
          try {
            const { records, truncated, stale, fetchedAt } = await foisCache.load(() =>
              fetchFoisUpstream(state.root, headers),
            );
            sendJson(200, {
              fetchedAt,
              stale,
              ttlMs: OSH_LIST_TTL_MS,
              count: records.length,
              truncated,
              fois: records,
            });
          } catch {
            sendJson(502, { error: 'upstream_failed' });
          }
          return;
        }

        if (subPath === '/observations') {
          const id = readDatastreamId(requestUrl.searchParams);
          if (!id) {
            sendJson(400, { error: 'bad_datastream' });
            return;
          }
          const state = await base.resolveRoot(configuredUrl, headers);
          if (!state.root) {
            sendJson(502, { error: baseErrorCode(state.failures) });
            return;
          }
          // No injectable seam here: observationUrl() and assertObservationUrl()
          // are the fixed imports from ids.js, never a caller-supplied
          // function, so nothing outside a code edit can weaken this check.
          // A validated id always passes it (see design.md D13); an
          // unexpected throw falls to the outer catch, below, as a 500.
          const target = observationUrl(state.root, id);
          assertObservationUrl(target, state.root, id);
          try {
            const result = await observationsCache.get(id, target, headers);
            // The age is arithmetic on the cached observation's phenomenonTime
            // against the current instant, computed fresh on every answer;
            // the cache itself never stores an age, so a stale snapshot
            // served twice reports a larger age the second time.
            const observation = result.observation
              ? { ...result.observation, ageMs: oshObservationAgeMs(result.observation.phenomenonTime, now()) }
              : null;
            sendJson(200, {
              datastream: id,
              fetchedAt: result.fetchedAt,
              stale: result.stale,
              ttlMs: OBS_TTL_MS,
              observation,
            });
          } catch (error) {
            sendJson(502, {
              error: 'observation_failed',
              upstreamStatus: Number.isFinite(error?.status) ? error.status : null,
            });
          }
          return;
        }

        sendJson(404, { error: 'not_found' });
      } catch (error) {
        warn('[osh-proxy] error:', error?.message || 'internal error');
        sendJson(500, { error: 'osh proxy error' });
      }
    });
  };

  return {
    name: 'osh-proxy',
    configureServer: installMiddleware,
    configurePreviewServer: installMiddleware,
  };
}
