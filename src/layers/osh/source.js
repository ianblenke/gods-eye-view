/**
 * Read the OpenSensorHub systems, datastreams, features, locations and
 * newest-observation endpoints. The server already applies the shared
 * adapters before it caches a response, so this file validates the
 * envelope and passes the records through unchanged. It also opens the
 * live stream of one datastream.
 */

async function readOshResponse(fetchImpl, path, { signal } = {}) {
  const response = await fetchImpl(path, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (response.status === 503) {
    const body = await response.json().catch(() => null);
    if (body?.error === 'no_key') return { keyRequired: true, payload: null };
    throw new Error(`OSH HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`OSH HTTP ${response.status}`);
  const payload = await response.json();
  signal?.throwIfAborted();
  return { keyRequired: false, payload };
}

export function createOshSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
  eventSourceImpl,
} = {}) {
  return {
    async getSystems({ signal } = {}) {
      const { keyRequired, payload } = await readOshResponse(fetchImpl, '/api/osh/systems', {
        signal,
      });
      if (keyRequired) return { keyRequired: true, systems: [], stale: false };
      if (!Array.isArray(payload?.systems))
        throw new Error('Malformed OSH systems payload');
      return { keyRequired: false, systems: payload.systems, stale: Boolean(payload.stale) };
    },

    async getDatastreams({ system, signal } = {}) {
      const path = system
        ? `/api/osh/datastreams?system=${encodeURIComponent(system)}`
        : '/api/osh/datastreams';
      const { keyRequired, payload } = await readOshResponse(fetchImpl, path, { signal });
      if (keyRequired) return { keyRequired: true, datastreams: [] };
      if (!Array.isArray(payload?.datastreams))
        throw new Error('Malformed OSH datastreams payload');
      return { keyRequired: false, datastreams: payload.datastreams };
    },

    async getFois({ signal } = {}) {
      const { keyRequired, payload } = await readOshResponse(fetchImpl, '/api/osh/fois', {
        signal,
      });
      if (keyRequired) return { keyRequired: true, fois: [], truncated: false };
      if (!Array.isArray(payload?.fois)) throw new Error('Malformed OSH fois payload');
      return { keyRequired: false, fois: payload.fois, truncated: Boolean(payload.truncated) };
    },

    async getLocations({ signal } = {}) {
      const { keyRequired, payload } = await readOshResponse(fetchImpl, '/api/osh/locations', {
        signal,
      });
      if (keyRequired) return { keyRequired: true, locations: [], failed: 0 };
      if (!Array.isArray(payload?.locations))
        throw new Error('Malformed OSH locations payload');
      return {
        keyRequired: false,
        locations: payload.locations,
        failed: Number.isFinite(payload.failed) ? payload.failed : 0,
      };
    },

    async getObservation(datastreamId, { signal } = {}) {
      const path = `/api/osh/observations?datastream=${encodeURIComponent(datastreamId)}`;
      const { keyRequired, payload } = await readOshResponse(fetchImpl, path, { signal });
      if (keyRequired) return { keyRequired: true, observation: null };
      if (!payload || typeof payload !== 'object' || !('observation' in payload))
        throw new Error('Malformed OSH observation payload');
      return { keyRequired: false, observation: payload.observation };
    },

    /**
     * Open the live stream of one datastream (osh-071). One same-origin GET
     * with no credentials; the browser opens the connection again after a
     * break. The route sends the events `observation`, `open`, `down` and
     * `unsupported`, and the `error` event of the browser also means `down`.
     */
    openLive(datastreamId, { onObservation, onOpen, onDown, onUnsupported }) {
      const url = `/api/osh/live?datastream=${encodeURIComponent(datastreamId)}`;
      const stream = new (eventSourceImpl ?? globalThis.EventSource)(url);
      stream.addEventListener('observation', (event) => {
        let observation;
        try {
          observation = JSON.parse(event.data);
        } catch {
          return;
        }
        if (observation && typeof observation === 'object') onObservation(observation);
      });
      // The browser also raises `open` when the connection itself opens. Only
      // the event of the route has data, and it says the upstream is open.
      stream.addEventListener('open', (event) => {
        if (typeof event.data === 'string') onOpen();
      });
      stream.addEventListener('down', () => onDown());
      stream.addEventListener('unsupported', () => onUnsupported());
      stream.addEventListener('error', () => onDown());
      return { close: () => stream.close() };
    },
  };
}
