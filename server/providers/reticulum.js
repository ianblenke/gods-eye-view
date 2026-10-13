import { parseTapAddress, tapUrl } from '../../src/data/tapAddress.js';
import { coalesceProxyRequest, readResponseTextCapped } from './common/http.js';

/**
 * Reticulum interface discovery, read from a listener that the operator runs.
 *
 * Reticulum carries no location in its core. An operator who marks an
 * interface as discoverable publishes its name, type and position on purpose,
 * and a listener node hears those announces. The listener sends the raw list
 * as JSON on a local address. This provider is the only filter: it keeps an
 * allowed set of fields and drops addresses, keys, contacts and identities.
 *
 * @module server/providers/reticulum
 */

const SOURCE = 'Reticulum interface discovery';
const ATTRIBUTION =
  'Reticulum network operators who publish discoverable interfaces';
const COVERAGE =
  'Only operators who opt in; the operator sets each position and nobody checks it. A new listener hears more over its first hours.';
const HOUR = 3600_000;
const DAY = 24 * HOUR;
const UNKNOWN_AFTER_MS = DAY;
const STALE_AFTER_MS = 3 * DAY;
const DROP_AFTER_MS = 7 * DAY;
const CACHE_MS = 60_000;
const STALE_SERVE_MS = 2 * HOUR;
const TIMEOUT_MS = 8000;
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_INTERFACES = 5000;
const NAME_MAX = 80;
const MAX_HOPS = 255;

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
/** Round to three decimals; adding zero turns negative zero into zero. */
const round3 = (value) => Math.round(value * 1000) / 1000 + 0;

function position(record) {
  const { latitude, longitude } = record;
  if (!finite(latitude) || !finite(longitude)) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;
  if (latitude === 0 && longitude === 0) return null;
  return { latitude: round3(latitude), longitude: round3(longitude) };
}

/** `RNodeInterface` becomes `rnode`; anything else odd is rejected. */
function typeName(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9]{1,40}$/.test(value))
    return null;
  return value.replace(/Interface$/, '').toLowerCase() || null;
}

function cleanName(value, type) {
  const text =
    typeof value === 'string'
      ? value
          .replace(/[\u0000-\u001f\u007f-\u009f<>]/g, '')
          .trim()
          .slice(0, NAME_MAX)
          .trim()
      : '';
  return text || `Unnamed ${type}`;
}

function radioOf(record, type) {
  if (type !== 'rnode') return null;
  const { frequency, bandwidth, sf, cr } = record;
  if (![frequency, bandwidth, sf, cr].every(finite)) return null;
  return { frequency, bandwidth, spreadingFactor: sf, codingRate: cr };
}

function normalizeRecord(record, now) {
  if (!record || typeof record !== 'object') return null;
  if (!/^[0-9a-f]{64}$/.test(String(record.discovery_hash))) return null;
  const type = typeName(record.type);
  if (!type) return null;
  const place = position(record);
  if (!place) return null;
  if (!finite(record.last_heard)) return null;
  const heardMs = Math.round(record.last_heard * 1000);
  const heardAt = new Date(heardMs);
  if (Number.isNaN(heardAt.getTime())) return null;
  const age = now - heardMs;
  if (age > DROP_AFTER_MS) return null;
  const status =
    age > STALE_AFTER_MS
      ? 'stale'
      : age > UNKNOWN_AFTER_MS
        ? 'unknown'
        : 'available';
  return {
    heardMs,
    item: {
      id: String(record.discovery_hash).slice(0, 16),
      type,
      name: cleanName(record.name, type),
      ...place,
      heightM: finite(record.height) ? Math.round(record.height) : null,
      hops:
        Number.isInteger(record.hops) &&
        record.hops >= 0 &&
        record.hops <= MAX_HOPS
          ? record.hops
          : null,
      lastHeard: heardAt.toISOString(),
      status,
      radio: radioOf(record, type),
    },
  };
}

/**
 * Keep the allowed fields of the discovered interfaces that have a valid
 * position and are not too old. Newest first, at most 5000.
 *
 * @param {unknown[]} list Raw records from the listener.
 * @param {number} now Current time in milliseconds.
 * @returns {{interfaces: object[], counts: {total: number, positioned: number, byType: Record<string, number>}}}
 */
export function normalizeInterfaces(list, now) {
  const kept = [];
  for (const record of list) {
    const normalized = normalizeRecord(record, now);
    if (normalized) kept.push(normalized);
  }
  kept.sort((a, b) => b.heardMs - a.heardMs);
  const interfaces = kept.slice(0, MAX_INTERFACES).map(({ item }) => item);
  const byType = {};
  for (const { type } of interfaces)
    byType[type] = (Object.hasOwn(byType, type) ? byType[type] : 0) + 1;
  return {
    interfaces,
    counts: { total: list.length, positioned: interfaces.length, byType },
  };
}

function documentOf(fields) {
  return {
    schemaVersion: 1,
    source: SOURCE,
    attribution: ATTRIBUTION,
    coverage: COVERAGE,
    fetchedAt: null,
    stale: false,
    unavailable: false,
    reason: null,
    counts: { total: 0, positioned: 0, byType: {} },
    interfaces: [],
    ...fields,
  };
}
const unavailable = (reason) => documentOf({ unavailable: true, reason });

/**
 * Vite plugin for `/api/reticulum`.
 *
 * @param {object} [options]
 * @param {typeof fetch} [options.fetchImpl] Fetch used for the listener.
 * @param {() => number} [options.now] Clock in milliseconds.
 * @param {Record<string, string|undefined>} [options.env] Environment; the
 *   address of the listener is `RETICULUM_LISTENER` (`host:port`, local only).
 * @param {Function} [options.setTimer] Timer for the request timeout.
 * @param {Function} [options.clearTimer] Clears that timer.
 */
export function reticulumProxy({
  fetchImpl = fetch,
  now = Date.now,
  env = process.env,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  let cache = null;
  const inFlight = new Map();

  async function fetchList(address) {
    const controller = new AbortController();
    const timer = setTimer(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetchImpl(tapUrl(address, '/interfaces.json'), {
        signal: controller.signal,
        redirect: 'error',
      });
      if (!response.ok) throw new Error('listener_status');
      const list = JSON.parse(
        await readResponseTextCapped(response, MAX_BYTES, controller.signal),
      );
      if (!Array.isArray(list)) throw new Error('listener_format');
      return list;
    } finally {
      clearTimer(timer);
    }
  }

  async function refresh(address, time) {
    try {
      const { interfaces, counts } = normalizeInterfaces(
        await fetchList(address),
        time,
      );
      const document = documentOf({
        fetchedAt: new Date(time).toISOString(),
        counts,
        interfaces,
      });
      cache = { fetchedAt: time, document };
      return document;
    } catch {
      if (cache && time - cache.fetchedAt < STALE_SERVE_MS)
        return { ...cache.document, stale: true };
      return unavailable('Reticulum listener unavailable');
    }
  }

  async function load() {
    const setting = String(env.RETICULUM_LISTENER ?? '').trim();
    if (!setting) return unavailable('Reticulum listener not configured');
    const address = parseTapAddress(setting);
    // `010.0.0.1` passes the tap rule as 10.0.0.1, but a URL parser reads the
    // leading zero as octal and connects to 8.0.0.1. Refuse such a host.
    if (!address || new URL(address.origin).hostname !== address.host)
      return unavailable('Reticulum listener address not allowed');
    const time = now();
    if (cache && time - cache.fetchedAt < CACHE_MS) return cache.document;
    return coalesceProxyRequest(inFlight, 'interfaces', () =>
      refresh(address, time),
    ).promise;
  }

  async function handler(req, res) {
    const json = (status, value) => {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      });
      res.end(JSON.stringify(value));
    };
    if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
    if (req.url !== '/' && req.url !== '')
      return json(400, { error: 'invalid_reticulum_query' });
    return json(200, await load());
  }

  return {
    name: 'reticulum',
    configureServer({ middlewares }) {
      middlewares.use('/api/reticulum', handler);
    },
    configurePreviewServer({ middlewares }) {
      middlewares.use('/api/reticulum', handler);
    },
  };
}
