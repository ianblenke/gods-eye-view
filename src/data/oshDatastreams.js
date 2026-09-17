/**
 * Pure adapter for an OpenSensorHub datastream list. Shared the same way as
 * src/data/oshSystems.js. Keeps its own copy of the datastream id pattern —
 * the server-side boundary check in server/providers/osh/ids.js stays a
 * node-only module, so this browser-safe file does not import it.
 */

const DATASTREAM_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

function listOf(payload) {
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.datastreams)) return payload.datastreams;
  return null;
}

function lastPathSegment(href) {
  if (typeof href !== 'string' || !href) return null;
  const clean = href.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const parts = clean.split('/');
  const last = parts[parts.length - 1];
  return last || null;
}

/** Read the id of the system a datastream belongs to, from any known key. */
function readSystemId(entry) {
  if (typeof entry['system@id'] === 'string' && entry['system@id'])
    return entry['system@id'];
  if (typeof entry.systemId === 'string' && entry.systemId) return entry.systemId;
  if (
    entry.system &&
    typeof entry.system === 'object' &&
    typeof entry.system.id === 'string' &&
    entry.system.id
  )
    return entry.system.id;
  const link = entry['system@link'];
  if (link && typeof link === 'object') {
    const segment = lastPathSegment(link.href);
    if (segment) return segment;
  }
  return null;
}

/**
 * Map a raw OpenSensorHub datastream list to trimmed records.
 * @param {*} payload - Upstream JSON body.
 * @returns {Array<{id:string, systemId:?string, name:?string, outputName:?string, validTime:?Array}>}
 */
export function mapOshDatastreams(payload) {
  const list = listOf(payload);
  if (!list) return [];
  const records = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') continue;
    const id = typeof entry.id === 'string' ? entry.id : '';
    if (!DATASTREAM_ID_PATTERN.test(id)) continue;
    records.push({
      id,
      systemId: readSystemId(entry),
      name: typeof entry.name === 'string' ? entry.name : null,
      outputName: typeof entry.outputName === 'string' ? entry.outputName : null,
      validTime: Array.isArray(entry.validTime) ? entry.validTime : null,
    });
  }
  return records;
}
