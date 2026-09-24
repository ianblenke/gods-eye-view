import { coalesceProxyRequest } from './common/http.js';
import { OSH_LIST_FORMAT, oshGet, oshListUrl, oshPages } from './osh/get.js';
import { baseErrorCode, createOshBase } from './osh/base.js';
import {
  assertLiveUrl,
  assertObservationUrl,
  assertObservationsLatestUrl,
  assertSchemaUrl,
  assertSystemDatastreamsUrl,
  assertSystemUrl,
  liveUrl,
  observationUrl,
  observationsLatestUrl,
  readDatastreamId,
  readSystemId,
  schemaUrl,
  systemDatastreamsUrl,
  systemUrl,
} from './osh/ids.js';
import { createOshLiveHub } from './osh/live.js';
import {
  OBS_TTL_MS,
  createOshKeyedCache,
  createOshLocationsPass,
  createOshObservationsCache,
  createOshSchemaCache,
  createOshSystemCache,
  createOshSystemDatastreamsCache,
} from './osh/observations.js';
import { mapOshSystems } from '../../src/data/oshSystems.js';
import { mapOshDatastreams } from '../../src/data/oshDatastreams.js';
import { mapOshFois } from '../../src/data/oshFois.js';
import { mapOshLocationPage, oshObservationAgeMs } from '../../src/data/oshObservations.js';

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
 *   GET /api/osh/status       → {hasKey, base, systems, datastreams, fois, observations, datastreamsBySystem, locationProperties, locations, ttlMs}
 *   GET /api/osh/systems      → {fetchedAt, stale, ttlMs, count, systems}
 *   GET /api/osh/datastreams  → {fetchedAt, stale, ttlMs, count, datastreams}
 *   GET /api/osh/datastreams?system=<id> → {system, fetchedAt, stale, ttlMs, count, datastreams}
 *   GET /api/osh/fois          → {fetchedAt, stale, ttlMs, count, truncated, fois}
 *   GET /api/osh/observations?datastream=<id> → {datastream, fetchedAt, stale, ttlMs, observation}
 *   GET /api/osh/live?datastream=<id> → server-sent events: observation, open, down, unsupported
 *   GET /api/osh/locations     → {fetchedAt, stale, ttlMs, count, streams, failed, locations}
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

/** The head of every answer of the live route (design decision D64). */
const OSH_LIVE_HEADERS = Object.freeze({
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Accel-Buffering': 'no',
});

/**
 * The location pass's built-in property-filter candidate source (design
 * decision D46): the public OGC and SensorML terms measured to answer the
 * position streams. `OSH_LOCATION_PROPERTIES` in the environment appends
 * more, comma-separated — the owner's own vendor term never sits in the
 * repository.
 */
export const OSH_DEFAULT_LOCATION_PROPERTIES = Object.freeze([
  'http://www.opengis.net/def/property/OGC/0/SensorLocation',
  'http://sensorml.com/ont/swe/property/LocationVector',
]);

/**
 * True for a value that parses as a URL, with no white space. `new URL()`
 * already accepts every syntactically valid URN — `urn:` is a generic
 * scheme, not a special one, so the WHATWG parser never refuses a
 * whitespace-free string of that shape. An earlier version of this
 * function fell back to a URN regex on a parse failure; measured against
 * every malformed `urn:`-prefixed value this project could construct,
 * `new URL()` never threw, so that fallback's accepting branch was
 * unreachable and it is gone.
 *
 * The one caller below already trims each entry and skips an empty one
 * before this runs, so this never sees an empty string; an untrimmed or
 * non-string value would still resolve correctly (an empty string, or one
 * `new URL()` refuses, already answers false through the branches kept
 * here), but no such call exists, so no guard is kept for it either.
 */
function isAcceptableLocationProperty(value) {
  if (/\s/.test(value)) return false;
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build the full candidate property list: the two built-in terms, plus
 * every accepted, comma-separated entry of `env.OSH_LOCATION_PROPERTIES`.
 * A refused entry is skipped with a warning naming its position in the
 * list, never its text — the value itself may be the owner's own vendor
 * term, and this project never logs an upstream vocabulary URI.
 */
function resolveLocationProperties(env, warn) {
  const list = [...OSH_DEFAULT_LOCATION_PROPERTIES];
  const raw = String(env.OSH_LOCATION_PROPERTIES || '').trim();
  if (!raw) return list;
  const entries = raw.split(',').map((entry) => entry.trim());
  entries.forEach((entry, index) => {
    if (!entry) return;
    if (isAcceptableLocationProperty(entry)) {
      list.push(entry);
    } else {
      warn(`[osh-proxy] OSH_LOCATION_PROPERTIES entry at position ${index} skipped: not a URL or a URN`);
    }
  });
  return list;
}

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
  liveHub = null,
} = {}) {
  const base = createOshBase({ fetchImpl, now });
  const hub = liveHub || createOshLiveHub({ now, warn });
  const systemsCache = createOshListCache({ ttlMs: OSH_LIST_TTL_MS, now });
  const datastreamsCache = createOshListCache({ ttlMs: OSH_LIST_TTL_MS, now });
  const foisCache = createOshFoisCache({ ttlMs: OSH_LIST_TTL_MS, now });
  const observationsCache = createOshObservationsCache({ fetchImpl, now });
  const systemDatastreamsCache = createOshSystemDatastreamsCache({
    fetchImpl,
    now,
    ttlMs: OSH_LIST_TTL_MS,
  });
  const schemaCache = createOshSchemaCache({ fetchImpl, now, ttlMs: OSH_LIST_TTL_MS });
  const systemNameCache = createOshSystemCache({ fetchImpl, now, ttlMs: OSH_LIST_TTL_MS });
  const propertyFilterCache = createOshKeyedCache({
    fetchImpl,
    now,
    ttlMs: OSH_LIST_TTL_MS,
    refresh: async (fetchImplArg, uri, root, headers) => {
      const firstUrl = oshListUrl(root, 'datastreams', { limit: '200', observedProperty: uri });
      const { items } = await oshPages(fetchImplArg, root, firstUrl, {
        headers,
        listOf: listOfDatastreams,
      });
      return mapOshDatastreams({ items });
    },
  });
  const locationsPass = createOshLocationsPass({ ttlMs: OBS_TTL_MS, now });
  let lastLocationsResult = null;

  function locationsPassStatus() {
    if (!lastLocationsResult) return { lastFetch: null, count: null, stale: false };
    return {
      lastFetch: lastLocationsResult.fetchedAt,
      count: lastLocationsResult.value.locations.length,
      stale: lastLocationsResult.stale,
    };
  }

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

  /**
   * The schema decides whether, and how, a stream's result carries a
   * location (design decision D44). A failed schema read is not the
   * failure of the route that asks: it gives a reader of null, which
   * mapOshObservation() reports as location:null.
   */
  async function readerFor(root, id, headers) {
    try {
      const schemaTarget = schemaUrl(root, id);
      assertSchemaUrl(schemaTarget, root, id);
      const schemaResult = await schemaCache.get(id, schemaTarget, headers);
      return schemaResult.reader;
    } catch {
      return null;
    }
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

  /**
   * Gather location candidate datastreams from the three stable sources of
   * design decision D46, deduplicated by datastream id: the property
   * filter, the datastreams of every feature host, and the datastreams of
   * every system with a `Point`. A source that fails contributes nothing —
   * it never fails the whole gather. Returns the candidate records plus a
   * map of the current systems snapshot, for the name resolution of D47.
   */
  async function gatherLocationCandidates(root, headers) {
    const candidatesById = new Map();
    const propertyUris = resolveLocationProperties(env, warn);
    await Promise.all(
      propertyUris.map(async (uri) => {
        try {
          const { value } = await propertyFilterCache.get(uri, root, headers);
          for (const record of value) {
            if (!candidatesById.has(record.id)) candidatesById.set(record.id, record);
          }
        } catch {
          // A refused or unreachable property term contributes no candidates.
        }
      }),
    );

    let systemRecords = [];
    let foiRecords = [];
    try {
      ({ records: systemRecords } = await systemsCache.load(() =>
        fetchSystemsUpstream(root, headers),
      ));
    } catch {
      systemRecords = [];
    }
    try {
      ({ records: foiRecords } = await foisCache.load(() => fetchFoisUpstream(root, headers)));
    } catch {
      foiRecords = [];
    }
    const systemsById = new Map(systemRecords.map((record) => [record.id, record]));

    const hostIds = new Set();
    for (const foi of foiRecords) if (foi.systemId) hostIds.add(foi.systemId);
    for (const system of systemRecords) {
      if (system.lon !== null && system.lat !== null) hostIds.add(system.id);
    }

    await Promise.all(
      [...hostIds].map(async (id) => {
        try {
          const target = systemDatastreamsUrl(root, id);
          assertSystemDatastreamsUrl(target, root, id);
          const result = await systemDatastreamsCache.get(id, root, target, headers);
          for (const record of result.datastreams) {
            const withSystem = record.systemId ? record : { ...record, systemId: id };
            if (!candidatesById.has(withSystem.id)) candidatesById.set(withSystem.id, withSystem);
          }
        } catch {
          // One host's datastreams read failing does not fail the gather.
        }
      }),
    );

    return { candidates: [...candidatesById.values()], systemsById, propertyCount: propertyUris.length };
  }

  /**
   * Resolve one system's name: from the systems snapshot when it holds the
   * system, else one by-id read cached per id — the one reliable read for
   * a system that snapshot never sampled (design decision D47). A failed
   * read gives null and never drops the location it names.
   */
  async function resolveSystemName(systemId, systemsById, root, headers) {
    if (!systemId) return null;
    const known = systemsById.get(systemId);
    if (known) return known.name;
    try {
      const target = systemUrl(root, systemId);
      assertSystemUrl(target, root, systemId);
      const result = await systemNameCache.get(systemId, target, headers);
      return result.name;
    } catch {
      return null;
    }
  }

  /**
   * Run one location pass: read each candidate's schema through the schema
   * cache, read one newest-per-feature page for every candidate whose
   * schema gave a reader, and fold each page with mapOshLocationPage().
   * See design decision D47.
   */
  async function runLocationsPass(root, headers) {
    const { candidates, systemsById, propertyCount } = await gatherLocationCandidates(
      root,
      headers,
    );
    let failed = 0;
    const locations = [];
    await Promise.all(
      candidates.map(async (candidate) => {
        let reader;
        try {
          const schemaTarget = schemaUrl(root, candidate.id);
          assertSchemaUrl(schemaTarget, root, candidate.id);
          const schemaResult = await schemaCache.get(candidate.id, schemaTarget, headers);
          reader = schemaResult.reader;
        } catch {
          failed += 1;
          return;
        }
        if (!reader) {
          failed += 1;
          return;
        }
        let json;
        try {
          const pageUrl = observationsLatestUrl(root, candidate.id);
          assertObservationsLatestUrl(pageUrl, root, candidate.id);
          const { status, json: body } = await oshGet(fetchImpl, pageUrl, { headers });
          if (status < 200 || status >= 300) {
            failed += 1;
            return;
          }
          json = body;
        } catch {
          failed += 1;
          return;
        }
        const records = mapOshLocationPage(json, reader, now());
        const systemName = await resolveSystemName(candidate.systemId, systemsById, root, headers);
        for (const record of records) {
          if (!record.location) continue;
          locations.push({
            systemId: candidate.systemId,
            systemName,
            datastreamId: candidate.id,
            datastreamName: candidate.name,
            foiId: record.foiId,
            foiUid: record.foiUid,
            lat: record.location.lat,
            lon: record.location.lon,
            alt: record.location.alt,
            phenomenonTime: record.phenomenonTime,
            ageMs: record.ageMs,
          });
        }
      }),
    );
    return { streams: candidates.length, failed, locations, propertyCount };
  }

  const installMiddleware = (server) => {
    // The hub owns timers and upstream sockets, so it closes with the HTTP server (osh-075).
    server.httpServer?.on('close', () => hub.close());
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
              locationProperties: { count: OSH_DEFAULT_LOCATION_PROPERTIES.length },
              locations: { lastFetch: null, count: null, stale: false },
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
            locationProperties: { count: resolveLocationProperties(env, warn).length },
            locations: locationsPassStatus(),
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
          const reader = await readerFor(state.root, id, headers);
          try {
            const result = await observationsCache.get(id, target, headers, reader);
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

        if (subPath === '/live') {
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
          // Like the observation route: fixed imports from ids.js, no seam.
          const target = liveUrl(state.root, id);
          assertLiveUrl(target, state.root, id);
          const reader = await readerFor(state.root, id, headers);
          // The client can leave while the root and the schema load.
          if (res.destroyed) return;
          const joined = hub.join(
            id,
            { url: target, headers, reader },
            {
              start() {
                res.writeHead(200, OSH_LIVE_HEADERS);
                res.flushHeaders();
              },
              write: (text) => res.write(text),
              end: () => res.end(),
            },
          );
          if (joined.error) {
            sendJson(503, { error: joined.error });
            return;
          }
          res.on('close', joined.leave);
          return;
        }

        if (subPath === '/locations') {
          const state = await base.resolveRoot(configuredUrl, headers);
          if (!state.root) {
            sendJson(502, { error: baseErrorCode(state.failures) });
            return;
          }
          try {
            const result = await locationsPass.load(() => runLocationsPass(state.root, headers));
            lastLocationsResult = result;
            // The pass cache can serve the same fold more than once, and a
            // stale one longer than that: age is arithmetic on
            // phenomenonTime against the current instant, so it is
            // recomputed here at serve time, never trusted from the fold
            // (the same reason the observations route above recomputes it).
            const nowMs = now();
            const locations = result.value.locations.map((location) => ({
              ...location,
              ageMs: oshObservationAgeMs(location.phenomenonTime, nowMs),
            }));
            sendJson(200, {
              fetchedAt: result.fetchedAt,
              stale: result.stale,
              ttlMs: OBS_TTL_MS,
              count: locations.length,
              streams: result.value.streams,
              failed: result.value.failed,
              locations,
            });
          } catch {
            sendJson(502, { error: 'upstream_failed' });
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
