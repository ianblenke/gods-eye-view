import { normalizeScenes } from './normalize.js';

// shortcut: Probe hosts from 2026-11-08; extend this set when another host needs one collection.
const SINGLE_COLLECTION_HOSTS = new Set(['vantor-3d', 'vexcel-v2']);
const MAX_SEARCH_CALLS = 24;
const HOST = /^[a-z0-9][a-z0-9-]{0,63}$/;
const failed = (kind) => ({ ok: false, kind });
const object = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function collectionMap(value) {
  if (!object(value) || !Array.isArray(value.content)) return null;
  const map = new Map();
  for (const row of value.content) {
    if (
      !object(row) ||
      typeof row.name !== 'string' ||
      row.name === '' ||
      !Array.isArray(row.integrations) ||
      !Array.isArray(row.providers)
    )
      continue;
    const provider = row.providers.find(
      (p) => object(p) && Array.isArray(p.roles) && p.roles.includes('HOST'),
    );
    if (
      provider === undefined ||
      typeof provider.name !== 'string' ||
      !HOST.test(provider.name)
    )
      continue;
    map.set(row.name, {
      host: provider.name,
      thumbnail: row.integrations.includes('THUMBNAIL_AVAILABLE'),
    });
  }
  return map.size === 0 ? null : map;
}
function bodyOf(
  { box: [west, south, east, north], start, end, maxCloud },
  collections,
) {
  const body = {
    collections,
    datetime: `${start}T00:00:00.000Z/${end}T23:59:59.999Z`,
    intersects: {
      type: 'Polygon',
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
    },
    limit: 50,
  };
  if (maxCloud !== undefined) body.query = { cloudCoverage: { LTE: maxCloud } };
  return body;
}
function validPage(value) {
  return (
    object(value) &&
    Array.isArray(value.features) &&
    (value.links === undefined ||
      (Array.isArray(value.links) && value.links.every(object)))
  );
}

/** One page for each call, with a shared public collection cache. */
export function createSearch(client, now) {
  let cached = null;
  let inFlight = null;
  async function load() {
    const result = await client.collections();
    if (!result.ok) return result;
    const map = collectionMap(result.value);
    if (map === null) return failed('upstream_failed');
    cached = { map, at: now() };
    return { ok: true, map };
  }
  async function collections() {
    if (cached !== null && now() - cached.at < 21600000)
      return { ok: true, map: cached.map };
    if (inFlight !== null) return inFlight;
    inFlight = load();
    const result = await inFlight;
    inFlight = null;
    return result;
  }
  return async function runSearch(input) {
    const list = await collections();
    if (!list.ok) return list;
    const wanted = input.collections ?? [...list.map.keys()];
    if (!wanted.every((name) => list.map.has(name)))
      return failed('bad_collections');
    const groups = new Map();
    for (const [name, { host }] of list.map) {
      if (!wanted.includes(name)) continue;
      if (!groups.has(host)) groups.set(host, []);
      groups.get(host).push(name);
    }
    const calls = [];
    for (const [host, names] of groups) {
      if (SINGLE_COLLECTION_HOSTS.has(host)) {
        for (const name of names) calls.push({ host, names: [name] });
      } else calls.push({ host, names });
    }
    const queued = calls.slice(0, MAX_SEARCH_CALLS);
    const answers = new Array(queued.length);
    let index = 0;
    async function worker() {
      while (index < queued.length) {
        const slot = index++;
        const { host, names } = queued[slot];
        answers[slot] = await client.search(host, bodyOf(input, names));
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(4, queued.length) }, worker),
    );
    const scenes = [];
    const failedCalls = new Set();
    const goodHosts = new Set();
    let dropped = 0;
    let truncated = calls.length > MAX_SEARCH_CALLS;
    let timeout = false;
    let rejected = false;
    for (const [slot, answer] of answers.entries()) {
      const { host } = queued[slot];
      if (!answer.ok || !validPage(answer.value)) {
        failedCalls.add(host);
        timeout ||= answer.kind === 'search_timeout';
        rejected ||= answer.kind === 'credentials_rejected';
        continue;
      }
      goodHosts.add(host);
      const normalized = normalizeScenes(answer.value.features, host, list.map);
      scenes.push(...normalized.scenes);
      dropped += normalized.dropped;
      truncated ||= (answer.value.links ?? []).some(
        (link) => link.rel === 'next',
      );
    }
    const failedHosts = [...failedCalls].filter((host) => !goodHosts.has(host));
    truncated ||= [...failedCalls].some((host) => goodHosts.has(host));
    if (rejected) return { ...failed('credentials_rejected'), failedHosts };
    if (goodHosts.size === 0)
      return {
        ...failed(timeout ? 'search_timeout' : 'upstream_failed'),
        failedHosts,
      };
    return { ok: true, scenes, dropped, truncated, failedHosts };
  };
}
