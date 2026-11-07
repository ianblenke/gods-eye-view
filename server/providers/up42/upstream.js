import { normalizeScenes } from './normalize.js';

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

/** One page for each host, with a shared public collection cache. */
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
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  }
  return async function runSearch(input) {
    const list = await collections();
    if (!list.ok) return list;
    const wanted = input.collections ?? [...list.map.keys()];
    if (!wanted.every((name) => list.map.has(name)))
      return failed('bad_collections');
    const groups = new Map();
    for (const name of wanted) {
      const { host } = list.map.get(name);
      if (!groups.has(host)) groups.set(host, []);
      groups.get(host).push(name);
    }
    const hosts = [...groups.keys()].slice(0, 10);
    const answers = new Array(hosts.length);
    let index = 0;
    async function worker() {
      while (index < hosts.length) {
        const slot = index++;
        const host = hosts[slot];
        answers[slot] = await client.search(
          host,
          bodyOf(input, groups.get(host)),
        );
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(4, hosts.length) }, worker),
    );
    const scenes = [];
    const failedHosts = [];
    let dropped = 0;
    let truncated = groups.size > 10;
    let timeout = false;
    let rejected = false;
    for (const [slot, answer] of answers.entries()) {
      const host = hosts[slot];
      if (!answer.ok || !validPage(answer.value)) {
        failedHosts.push(host);
        timeout ||= answer.kind === 'search_timeout';
        rejected ||= answer.kind === 'credentials_rejected';
        continue;
      }
      const normalized = normalizeScenes(answer.value.features, host, list.map);
      scenes.push(...normalized.scenes);
      dropped += normalized.dropped;
      truncated ||= (answer.value.links ?? []).some(
        (link) => link.rel === 'next',
      );
    }
    if (rejected) return failed('credentials_rejected');
    if (failedHosts.length === hosts.length)
      return failed(timeout ? 'search_timeout' : 'upstream_failed');
    return { ok: true, scenes, dropped, truncated, failedHosts };
  };
}
